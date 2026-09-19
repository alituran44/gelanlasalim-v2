import type { H3Event } from 'h3'
import { setCookie, getCookie, deleteCookie, getRequestProtocol } from 'h3'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { CompanyRole } from './companyVerificationStore'

export interface ServerSession {
  id: string
  userEmail: string
  userName: string
  companyVkn?: string
  companyRole?: CompanyRole | string
  isCompanyVerified: boolean
  isAdmin: boolean
  isPremium: boolean
  subscriptionPlan: string
  tierId: 'free' | 'kurumsal-pro' | 'kurumsal-enterprise'
  createdAt: number
  expiresAt: number
}

// 🛡️ SEC-001 & Madde 5: Statik fallback kaldırıldı. Env anahtarı yoksa güvenli rastgele 256-bit entropy üretilir.
const SESSION_SECRET = (process.env.SESSION_SECRET || '').trim() || randomBytes(32).toString('hex')

export const ADMIN_SECRET_TOKEN = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD || '').trim() ||
  randomBytes(32).toString('hex')

export const SESSION_COOKIE_NAME = 'ihb_session'

declare global {
  // eslint-disable-next-line no-var
  var __SERVER_SESSIONS__: Map<string, ServerSession> | undefined
}

if (!globalThis.__SERVER_SESSIONS__) {
  globalThis.__SERVER_SESSIONS__ = new Map<string, ServerSession>()
}

const sessionStore = globalThis.__SERVER_SESSIONS__!

interface TokenPayload {
  sid: string
  email: string
  name: string
  vkn?: string
  role?: string
  ver?: number
  adm?: number
  prem?: number
  plan?: string
  tier?: string
  exp: number
}

/**
 * Oturum verisini kriptografik HMAC-SHA256 ile imzalar ve durumsuz (stateless) token üretir
 */
function signToken(session: ServerSession): string {
  const payloadData: TokenPayload = {
    sid: session.id,
    email: session.userEmail,
    name: session.userName,
    vkn: session.companyVkn,
    role: session.companyRole as string,
    ver: session.isCompanyVerified ? 1 : 0,
    adm: session.isAdmin ? 1 : 0,
    prem: session.isPremium ? 1 : 0,
    plan: session.subscriptionPlan,
    tier: session.tierId,
    exp: session.expiresAt
  }
  const payloadStr = JSON.stringify(payloadData)
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64url')
  const signature = createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url')
  return `${payloadB64}.${signature}`
}

/**
 * Token imzasını ve süresini doğrular
 */
function verifyTokenSignature(signedToken: string): { sessionId: string; expiresAt: number; isAdmin: boolean } | null {
  try {
    const parts = signedToken.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, signature] = parts
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url')

    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const rawPayload = Buffer.from(payloadB64, 'base64url').toString('utf8')
    if (rawPayload.includes(':') && !rawPayload.startsWith('{')) {
      const [sessionId, expiresAtStr, isAdminStr] = rawPayload.split(':')
      const expiresAt = parseInt(expiresAtStr, 10)
      if (isNaN(expiresAt) || Date.now() > expiresAt) return null
      return { sessionId, expiresAt, isAdmin: isAdminStr === '1' }
    }

    const data = JSON.parse(rawPayload) as TokenPayload
    if (!data.exp || Date.now() > data.exp) return null
    return { sessionId: data.sid, expiresAt: data.exp, isAdmin: Boolean(data.adm) }
  } catch {
    return null
  }
}

import { getSubscription } from './subscriptionStore'

/**
 * Yeni bir sunucu oturumu oluşturur ve imzalı token üretir
 */
export function createSession(data: {
  userEmail: string
  userName: string
  companyVkn?: string
  companyRole?: CompanyRole | string
  isCompanyVerified?: boolean
  isAdmin?: boolean
  isPremium?: boolean
  subscriptionPlan?: string
  tierId?: 'free' | 'kurumsal-pro' | 'kurumsal-enterprise'
  ttlMs?: number
}): { session: ServerSession; token: string } {
  const sessionId = randomBytes(24).toString('hex')
  const now = Date.now()
  const ttl = data.ttlMs || 7 * 24 * 60 * 60 * 1000 // 7 gün
  const expiresAt = now + ttl

  const sub = getSubscription(data.companyVkn) || getSubscription(data.userEmail)
  const isPremium = Boolean(data.isAdmin || data.isPremium || sub?.isPremium)
  const subscriptionPlan = data.isAdmin
    ? 'Kurumsal Enterprise (Sistem Yöneticisi)'
    : (data.subscriptionPlan || sub?.subscriptionPlan || (isPremium ? 'Kurumsal Pro' : 'Standart Plan'))
  const tierId = (data.isAdmin
    ? 'kurumsal-enterprise'
    : (data.tierId || sub?.tierId || (isPremium ? 'kurumsal-pro' : 'free'))) as 'free' | 'kurumsal-pro' | 'kurumsal-enterprise'

  const session: ServerSession = {
    id: sessionId,
    userEmail: data.userEmail.toLowerCase().trim(),
    userName: data.userName || data.userEmail.split('@')[0],
    companyVkn: data.companyVkn,
    companyRole: data.companyRole,
    isCompanyVerified: Boolean(data.isCompanyVerified),
    isAdmin: Boolean(data.isAdmin),
    isPremium,
    subscriptionPlan,
    tierId,
    createdAt: now,
    expiresAt
  }

  sessionStore.set(sessionId, session)
  const token = signToken(session)

  return { session, token }
}

/**
 * İmzalı token'ı çözer ve doğrular (Serverless & stateless uyumlu)
 */
export function verifySessionToken(token: string): ServerSession | null {
  if (!token || typeof token !== 'string') return null
  const cleanToken = token.trim()
  const parts = cleanToken.split('.')
  if (parts.length !== 2) return null

  const [payloadB64, signature] = parts
  const expectedSig = createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url')

  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null
  }

  try {
    const rawPayload = Buffer.from(payloadB64, 'base64url').toString('utf8')

    // Legacy format fallback: "sessionId:expiresAt:isAdmin"
    if (rawPayload.includes(':') && !rawPayload.startsWith('{')) {
      const [sessionId, expiresAtStr] = rawPayload.split(':')
      const expiresAt = parseInt(expiresAtStr, 10)
      if (isNaN(expiresAt) || Date.now() > expiresAt) return null
      const existing = sessionStore.get(sessionId)
      if (existing && Date.now() <= existing.expiresAt) {
        return existing
      }
      return null
    }

    const data = JSON.parse(rawPayload) as TokenPayload
    if (!data.exp || Date.now() > data.exp) {
      if (data.sid) sessionStore.delete(data.sid)
      return null
    }

    const session: ServerSession = {
      id: data.sid,
      userEmail: data.email,
      userName: data.name,
      companyVkn: data.vkn,
      companyRole: data.role || 'GÖRÜNTÜLEYİCİ',
      isCompanyVerified: Boolean(data.ver),
      isAdmin: Boolean(data.adm),
      isPremium: Boolean(data.prem),
      subscriptionPlan: data.plan || 'Standart Plan',
      tierId: (data.tier || (data.prem ? 'kurumsal-pro' : 'free')) as any,
      createdAt: data.exp - (7 * 24 * 60 * 60 * 1000),
      expiresAt: data.exp
    }

    sessionStore.set(session.id, session)
    return session
  } catch {
    return null
  }
}

/**
 * Oturumu sunucudan siler
 */
export function destroySession(sessionIdOrToken: string): boolean {
  if (!sessionIdOrToken) return false
  if (sessionIdOrToken.includes('.')) {
    const parsed = verifyTokenSignature(sessionIdOrToken)
    if (parsed) {
      return sessionStore.delete(parsed.sessionId)
    }
  }
  return sessionStore.delete(sessionIdOrToken)
}

/**
 * Yetkili bir admin oturumu oluşturur
 */
export function createAdminSession(adminEmail = 'admin@ihaleciburada.com'): { session: ServerSession; token: string } {
  return createSession({
    userEmail: adminEmail,
    userName: 'Sistem Yöneticisi (Admin)',
    isAdmin: true,
    ttlMs: 4 * 60 * 60 * 1000 // Admin oturumları 4 saat
  })
}

/**
 * Bir oturumun gerçek bir admin oturumu olduğunu doğrular
 */
export function verifyAdminSession(sessionOrToken: ServerSession | string): boolean {
  let session: ServerSession | null = null
  if (typeof sessionOrToken === 'string') {
    // 1. Doğrudan admin token değeri kontrolü (timing-safe)
    const tokenBuf = Buffer.from(sessionOrToken.trim())
    const secretBuf = Buffer.from(ADMIN_SECRET_TOKEN.trim())
    if (tokenBuf.length === secretBuf.length && timingSafeEqual(tokenBuf, secretBuf)) {
      return true
    }
    session = verifySessionToken(sessionOrToken)
  } else {
    session = sessionOrToken
  }

  if (!session) return false
  return session.isAdmin === true
}

/**
 * İstek protokolünün gerçekten HTTPS olup olmadığını saptar
 * Localhost, 127.0.0.1 ve düz HTTP test ortamlarında tarayıcının çerezleri reddetmesini önler.
 */
export function isRequestHttps(event: H3Event): boolean {
  try {
    const host = (event.node?.req?.headers?.['host'] || '').toLowerCase()
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return false
    }
    const proto = getRequestProtocol(event)
    return proto === 'https'
  } catch {
    return false
  }
}

/**
 * İmzalı oturum cookie'sini HTTP cevabına ekler
 */
export function setSessionCookie(event: H3Event, token: string): void {
  const isHttps = isRequestHttps(event)
  // 🛡️ 1. Güvenli, imzalı ve HttpOnly oturum belirteci (Sunucu ve API uç noktaları için)
  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 gün
  })
  // 🛡️ 2. İstemci tarafı Nuxt route middleware doğrulaması için okunabilir bayrak
  setCookie(event, 'ihb_auth', '1', {
    httpOnly: false,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60
  })
}

/**
 * İstekten oturum cookie'sini okur
 */
export function getSessionCookie(event: H3Event): string | null {
  return getCookie(event, SESSION_COOKIE_NAME) || null
}

/**
 * Oturum cookie'lerini siler
 */
export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax'
  })
  deleteCookie(event, 'ihb_auth', {
    path: '/',
    sameSite: 'lax'
  })
}
