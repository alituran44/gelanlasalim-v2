import type { H3Event } from 'h3'
import { setCookie, getCookie, deleteCookie } from 'h3'
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
  createdAt: number
  expiresAt: number
}

// 🛡️ SEC-001: Güçlü Oturum Gizli Anahtarı
const SESSION_SECRET = process.env.SESSION_SECRET || 'ihb_session_master_entropy_key_2026_x89_secure'
export const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_KEY || 'ihb_admin_secret_guard_2026_master_key'
export const SESSION_COOKIE_NAME = 'ihb_session'

declare global {
  // eslint-disable-next-line no-var
  var __SERVER_SESSIONS__: Map<string, ServerSession> | undefined
}

if (!globalThis.__SERVER_SESSIONS__) {
  globalThis.__SERVER_SESSIONS__ = new Map<string, ServerSession>()
}

const sessionStore = globalThis.__SERVER_SESSIONS__!

/**
 * Oturum token'ını HMAC-SHA256 ile imzalar
 */
function signToken(sessionId: string, expiresAt: number, isAdmin: boolean): string {
  const payload = `${sessionId}:${expiresAt}:${isAdmin ? '1' : '0'}`
  const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
  return `${Buffer.from(payload).toString('base64url')}.${signature}`
}

/**
 * Token imzasını ve süresini doğrular
 */
function verifyTokenSignature(signedToken: string): { sessionId: string; expiresAt: number; isAdmin: boolean } | null {
  try {
    const parts = signedToken.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, signature] = parts
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')

    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const [sessionId, expiresAtStr, isAdminStr] = payload.split(':')
    const expiresAt = parseInt(expiresAtStr, 10)
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return null
    }

    return {
      sessionId,
      expiresAt,
      isAdmin: isAdminStr === '1'
    }
  } catch {
    return null
  }
}

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
  ttlMs?: number
}): { session: ServerSession; token: string } {
  const sessionId = randomBytes(24).toString('hex')
  const now = Date.now()
  const ttl = data.ttlMs || 7 * 24 * 60 * 60 * 1000 // 7 gün
  const expiresAt = now + ttl

  const session: ServerSession = {
    id: sessionId,
    userEmail: data.userEmail.toLowerCase().trim(),
    userName: data.userName || data.userEmail.split('@')[0],
    companyVkn: data.companyVkn,
    companyRole: data.companyRole,
    isCompanyVerified: Boolean(data.isCompanyVerified),
    isAdmin: Boolean(data.isAdmin),
    createdAt: now,
    expiresAt
  }

  sessionStore.set(sessionId, session)
  const token = signToken(sessionId, expiresAt, session.isAdmin)

  return { session, token }
}

/**
 * İmzalı token'ı çözer ve sunucu tarafındaki sessionStore'dan doğrular
 */
export function verifySessionToken(token: string): ServerSession | null {
  if (!token || typeof token !== 'string') return null
  const parsed = verifyTokenSignature(token.trim())
  if (!parsed) return null

  const session = sessionStore.get(parsed.sessionId)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessionStore.delete(parsed.sessionId)
    return null
  }

  // İmzalanmış admin flag ile hafızadaki admin flag eşleşmelidir
  if (parsed.isAdmin !== session.isAdmin) {
    sessionStore.delete(parsed.sessionId)
    return null
  }

  return session
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
 * İmzalı oturum cookie'sini HTTP cevabına ekler
 */
export function setSessionCookie(event: H3Event, token: string): void {
  const isProd = process.env.NODE_ENV === 'production'
  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 gün
  })
}

/**
 * İstekten oturum cookie'sini okur
 */
export function getSessionCookie(event: H3Event): string | null {
  return getCookie(event, SESSION_COOKIE_NAME) || null
}

/**
 * Oturum cookie'sini siler
 */
export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax'
  })
}
