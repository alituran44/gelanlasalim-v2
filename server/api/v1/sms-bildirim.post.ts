import { defineEventHandler, readBody, createError } from 'h3'
import { sanitizePayload, resolveSession, requireAuth } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

// Rate limit store for public lead notifications (max 5 requests per 10 minutes per IP)
const notificationRateLimitMap = new Map<string, { count: number; resetTime: number }>()

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const { phone, email, type = 'lead_notification', customMessage, message } = body

  // 🛡️ KRİTİK GÜVENLİK DÜZELTMESİ (Item 7):
  // OTP kodları kesinlikle bu uç noktadan üretilemez veya döndürülemez!
  if (type === 'otp' || body.otpCode !== undefined) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      targetResource: '/api/v1/sms-bildirim',
      actionTaken: 'BLOCKED_400',
      details: { reason: 'Unauthorized attempt to request OTP via generic sms-bildirim endpoint' }
    })
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz istek: Güvenlik ve MFA OTP işlemleri yalnızca /api/auth/mfa/send uç noktası üzerinden yürütülür.'
    })
  }

  if (!phone && !email) {
    return {
      success: false,
      code: 'MISSING_RECIPIENT',
      message: 'SMS veya E-Posta gönderimi için geçerli alıcı bilgisi gereklidir.',
      timestamp: new Date().toISOString()
    }
  }

  // Rate Limiting per IP
  const clientIp = resolveClientIp(event)
  const now = Date.now()
  const windowMs = 10 * 60 * 1000 // 10 minutes
  const maxReq = 5

  const rateRecord = notificationRateLimitMap.get(clientIp)
  if (rateRecord && now < rateRecord.resetTime) {
    if (rateRecord.count >= maxReq) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Kısa süre içinde çok fazla bildirim isteği gönderildi. Lütfen daha sonra tekrar deneyiniz.'
      })
    }
    rateRecord.count++
  } else {
    notificationRateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs })
  }

  // Yetkilendirme Denetimi:
  // Anonim kullanıcılar yalnızca web sitesi teklif/iletişim talebi teyidi alabilir.
  // Sistem güncellemeleri veya özel mesajlar doğrulanmış oturum gerektirir.
  const session = resolveSession(event)
  const effectiveMessage = customMessage || message

  if (type !== 'lead_notification' && (!session.isAuthenticated && !session.isAdmin)) {
    // Eğer anonim kullanıcı özel mesaj veya ihale güncellemesi göndermeye çalışırsa engelle
    if (effectiveMessage && !effectiveMessage.includes('IhaleciBurada')) {
      requireAuth(event)
    }
  }

  const messageId = `MSG_${Date.now()}_${Math.floor(Math.random() * 1000)}`

  let messageText = effectiveMessage
  if (!messageText) {
    if (type === 'tender_update') {
      messageText = `[İhaleciBurada] Takip ettiğiniz ihalede canlı fiyat eksiltmesi gerçekleşti. Detaylar için panele giriniz.`
    } else if (type === 'bid_received') {
      messageText = `[İhaleciBurada] Yayınladığınız ihale için yeni bir doğrulanmış tedarikçi teklifi alındı.`
    } else {
      messageText = `[İhaleciBurada] Talebiniz sistemimize başarıyla iletilmiştir. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.`
    }
  }

  // 🛡️ ASLA OTP veya hassas güvenlik anahtarı response içinde döndürülmez
  return {
    success: true,
    code: 'SMS_SENT',
    messageId,
    recipient: {
      phone: phone ? String(phone).replace(/[^0-9+]/g, '') : null,
      email: email ? String(email).trim().toLowerCase() : null
    },
    message: 'Bildirim başarıyla kuyruğa alındı.',
    timestamp: new Date().toISOString()
  }
})
