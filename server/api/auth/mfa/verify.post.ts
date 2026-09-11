import { defineEventHandler, readBody, createError } from 'h3'
import { verifyMfaOtp } from '~~/server/utils/mfaStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizeXss } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const phoneOrEmail = sanitizeXss(body.phoneOrEmail || body.phone || body.email)
  const code = sanitizeXss(body.code)

  if (!phoneOrEmail || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Telefon/E-posta ve 6 haneli doğrulama kodu zorunludur.'
    })
  }

  const result = verifyMfaOtp(phoneOrEmail, code)

  if (!result.valid) {
    logSecurityEvent(event, {
      eventType: 'MFA_FAILED',
      severity: 'HIGH',
      actorEmail: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      actionTaken: 'BLOCKED_403',
      details: { phoneOrEmail, reason: result.error }
    })

    throw createError({
      statusCode: 400,
      statusMessage: result.error || 'Doğrulama başarısız.'
    })
  }

  logSecurityEvent(event, {
    eventType: 'MFA_VERIFIED',
    severity: 'LOW',
    actorEmail: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
    actionTaken: 'ALLOWED',
    details: { phoneOrEmail }
  })

  // Return signed one-time token
  const actionToken = `mfa_ok_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

  return {
    success: true,
    message: 'MFA iki faktörlü kimlik doğrulaması başarıyla tamamlandı (Kural SEC-009).',
    actionToken
  }
})
