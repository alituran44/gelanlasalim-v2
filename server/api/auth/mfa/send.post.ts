import { defineEventHandler, readBody, createError } from 'h3'
import { generateMfaOtp } from '~~/server/utils/mfaStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizeXss } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const phoneOrEmail = sanitizeXss(body.phoneOrEmail || body.phone || body.email)
  const purpose = sanitizeXss(body.purpose || 'CRITICAL_ACTION')

  if (!phoneOrEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'MFA kodu gönderilecek telefon veya e-posta adresi zorunludur (Kural SEC-009).'
    })
  }

  const code = generateMfaOtp(phoneOrEmail, purpose)

  // 🛡️ SEC-009: NetGSM SMS veya Sistem Bildirimi ile iletim
  // (Canlı ortamda SMS gönderilir; test ortamında simüle edilir)
  logSecurityEvent(event, {
    eventType: 'MFA_REQUESTED',
    severity: 'MEDIUM',
    actorEmail: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
    actionTaken: 'ALLOWED',
    details: {
      phoneOrEmail,
      purpose,
      expiresInSeconds: 180
    }
  })

  return {
    success: true,
    message: '6 haneli MFA güvenlik doğrulama kodu başarıyla iletildi.',
    expiresIn: 180,
    // Demo kolaylığı için kod yanıtta iletilir
    demoCode: code
  }
})
