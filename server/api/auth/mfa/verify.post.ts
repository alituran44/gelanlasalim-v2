import { defineEventHandler, readBody, createError } from 'h3'
import { verifyMfaOtp, createPurposeBoundMfaToken } from '~~/server/utils/mfaStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizeXss } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const phoneOrEmail = sanitizeXss(body.phoneOrEmail || body.phone || body.email)
  const code = sanitizeXss(body.code)
  const purpose = sanitizeXss(body.purpose || 'CRITICAL_ACTION')

  if (!phoneOrEmail || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Telefon/E-posta ve 6 haneli doğrulama kodu zorunludur.'
    })
  }

  const result = verifyMfaOtp(phoneOrEmail, code, purpose)

  if (!result.valid) {
    logSecurityEvent(event, {
      eventType: 'MFA_FAILED',
      severity: 'HIGH',
      actorEmail: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      actionTaken: 'BLOCKED_403',
      details: { phoneOrEmail, purpose, reason: result.error }
    })

    throw createError({
      statusCode: 400,
      statusMessage: result.error || 'Doğrulama başarısız.'
    })
  }

  // 🛡️ Katman 3: Amaca Bağlı (Purpose-Bound) İmzalı Tek Kullanımlık Token Üret
  const actionToken = createPurposeBoundMfaToken(phoneOrEmail, purpose)

  logSecurityEvent(event, {
    eventType: 'MFA_VERIFIED',
    severity: 'LOW',
    actorEmail: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
    actionTaken: 'ALLOWED',
    details: { phoneOrEmail, purpose }
  })

  return {
    success: true,
    message: 'MFA iki faktörlü kimlik doğrulaması başarıyla tamamlandı (Kural SEC-009).',
    purpose,
    actionToken,
    expiresInSeconds: 300
  }
})
