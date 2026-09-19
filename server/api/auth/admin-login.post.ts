import { defineEventHandler, readBody, createError } from 'h3'
import { createAdminSession, setSessionCookie, ADMIN_SECRET_TOKEN } from '~~/server/utils/sessionStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizePayload } from '~~/server/utils/authGuard'
import { timingSafeEqual } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const secretKey = (body.secretKey || body.password || '').trim()

  if (!secretKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Admin gizli anahtarı veya parolası zorunludur.'
    })
  }

  const adminEmail = (body.email || '').trim().toLowerCase()
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const validAdminEmails = [
    'admin@ihaleciburada.com',
    'ihalecib@gmail.com',
    'hasan@ihaleciburada.com'
  ]
  if (configuredAdminEmail) {
    validAdminEmails.push(configuredAdminEmail)
  }

  // 🛡️ Madde 1: E-posta uzantısı joker (wildcard) bypass'ı tamamen kaldırıldı. Sadece yetkili listesi geçerlidir.
  const isEmailValid = validAdminEmails.includes(adminEmail)

  // 🛡️ SEC-005 & B3: Yalnızca güçlü sunucu ortam değişkeni (ADMIN_PASSWORD veya ADMIN_SECRET_KEY) ile güvenli doğrulama
  const configuredPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_TOKEN.trim()

  const validPasswords = [configuredPassword].filter(Boolean)

  const isPasswordValid = validPasswords.some(expected => {
    const expBuf = Buffer.from(expected)
    const inBuf = Buffer.from(secretKey)
    return inBuf.length === expBuf.length && timingSafeEqual(inBuf, expBuf)
  })

  const isAuthorized = isEmailValid && isPasswordValid

  if (!isAuthorized) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      actionTaken: 'BLOCKED_403',
      details: { reason: 'Geçersiz admin anahtarı denemesi.' }
    })
    throw createError({
      statusCode: 403,
      statusMessage: 'Yetkisiz erişim: Geçersiz yönetici kimlik bilgisi.'
    })
  }

  // 🛡️ Gerçek bir admin oturumu oluştur ve imzalı httpOnly cookie ekle
  const { session, token } = createAdminSession(adminEmail)
  setSessionCookie(event, token)

  logSecurityEvent(event, {
    eventType: 'AUTH_SUCCESS',
    severity: 'MEDIUM',
    actorEmail: session.userEmail,
    actionTaken: 'ALLOWED',
    details: { role: 'ADMIN', message: 'Yönetici oturumu açıldı.' }
  })

  return {
    success: true,
    message: 'Yönetici oturumu başarıyla açıldı.',
    isAdmin: true,
    user: {
      email: session.userEmail,
      name: session.userName,
      isAdmin: true
    }
  }
})
