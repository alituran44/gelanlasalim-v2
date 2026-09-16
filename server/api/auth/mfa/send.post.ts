import { defineEventHandler, readBody, createError } from 'h3'
import { generateMfaOtp } from '~~/server/utils/mfaStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizeXss } from '~~/server/utils/authGuard'
import { sendViaGoogleSmtp } from '~~/server/utils/smtpClient'
import { sendViaNetGsm } from '~~/server/utils/netgsmClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const rawTarget = body.phoneOrEmail || body.phone || body.email
  const phoneOrEmail = sanitizeXss(rawTarget)
  const purpose = sanitizeXss(body.purpose || 'CRITICAL_ACTION')

  if (!phoneOrEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'MFA kodu gönderilecek telefon veya e-posta adresi zorunludur (Kural SEC-009).'
    })
  }

  // 1. 6 haneli rastgele tek kullanımlık OTP üretimi
  const code = generateMfaOtp(phoneOrEmail, purpose)
  const isEmail = phoneOrEmail.includes('@')

  // 2. Gerçek İletim Kanalı (E-posta veya NetGSM SMS)
  let dispatchSuccess = false
  let dispatchMessage = ''

  if (isEmail) {
    const subject = `[İhaleciBurada] Güvenlik Doğrulama Kodu: ${code}`
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background-color: #f8fafc; border-radius: 12px; color: #1e293b;">
        <h3 style="color: #003057; margin-top: 0;">İhaleciBurada Güvenlik Doğrulaması</h3>
        <p style="font-size: 14px; line-height: 1.6;">
          Platform üzerinde <strong>${purpose}</strong> işlemi için talep ettiğiniz tek kullanımlık 6 haneli güvenlik kodunuz:
        </p>
        <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; font-family: monospace; color: #2563eb; background: #eff6ff; padding: 16px 24px; border-radius: 10px; border: 1px solid #bfdbfe; display: inline-block; margin: 16px 0;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
          ⏱️ Bu kod <strong>3 dakika</strong> boyunca geçerlidir. Güvenliğiniz için bu kodu platform personeli dahil hiç kimseyle paylaşmayınız.
        </p>
      </div>
    `
    const mailRes = await sendViaGoogleSmtp({
      to: phoneOrEmail,
      subject,
      html: htmlBody,
      templateName: `MFA_OTP_${purpose}`
    })
    dispatchSuccess = mailRes.success
    dispatchMessage = mailRes.message
  } else {
    const smsMessage = `[İhaleciBurada] ${purpose} işlemi için 6 haneli güvenlik doğrulama kodunuz: ${code}. Kod 3 dakika geçerlidir. Kimseyle paylaşmayınız.`
    const smsRes = await sendViaNetGsm({
      phone: phoneOrEmail,
      message: smsMessage
    })
    dispatchSuccess = smsRes.success
    dispatchMessage = smsRes.message
  }

  // 3. Güvenlik Denetim İzi (SIEM Günlüğü)
  logSecurityEvent(event, {
    eventType: 'MFA_REQUESTED',
    severity: 'MEDIUM',
    actorEmail: isEmail ? phoneOrEmail : undefined,
    targetResource: event.node.req.url,
    actionTaken: 'ALLOWED',
    details: {
      destination: isEmail ? maskEmail(phoneOrEmail) : maskPhone(phoneOrEmail),
      channel: isEmail ? 'EMAIL' : 'SMS',
      purpose,
      expiresInSeconds: 180,
      dispatched: dispatchSuccess,
      dispatchLog: dispatchMessage
    }
  })

  // 4. Geliştirme ortamında sunucu konsoluna güvenli log (Response'a ASLA konmaz)
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[DEV-MFA] 🔑 OTP Kod Gönderimi (${isEmail ? 'EMAIL' : 'SMS'} -> ${phoneOrEmail}) [${purpose}]: ${code}`)
  }

  // 5. 🛡️ KESİN KORUMA: demoCode alanı hiçbir koşulda response'ta döndürülmez
  return {
    success: true,
    message: isEmail 
      ? `${maskEmail(phoneOrEmail)} e-posta adresinize 6 haneli güvenlik kodu iletildi.`
      : `${maskPhone(phoneOrEmail)} numaralı telefonunuza SMS ile 6 haneli güvenlik kodu iletildi.`,
    channel: isEmail ? 'EMAIL' : 'SMS',
    maskedTarget: isEmail ? maskEmail(phoneOrEmail) : maskPhone(phoneOrEmail),
    expiresIn: 180
  }
})

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return email
  const maskedUser = user.length > 2 ? user.slice(0, 2) + '***' : user + '***'
  return `${maskedUser}@${domain}`
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '')
  if (clean.length >= 7) {
    return clean.slice(0, 3) + '***' + clean.slice(-2)
  }
  return phone
}
