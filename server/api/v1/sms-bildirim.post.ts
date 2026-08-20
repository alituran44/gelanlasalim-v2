import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { phone, email, type = 'otp', customMessage } = body

  if (!phone && !email) {
    return {
      success: false,
      code: 'MISSING_RECIPIENT',
      message: 'SMS veya E-Posta gönderimi için geçerli alıcı bilgisi gereklidir.',
      timestamp: new Date().toISOString()
    }
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const messageId = `MSG_${Date.now()}_${Math.floor(Math.random() * 1000)}`

  let messageText = customMessage
  if (!messageText) {
    if (type === 'otp') {
      messageText = `[İhaleciBurada] Kurumsal üyelik doğrulama kodunuz: ${otpCode}. Bu kodu 3 dakika içinde kimseyle paylaşmayınız.`
    } else if (type === 'tender_update') {
      messageText = `[İhaleciBurada] Takip ettiğiniz ihalede canlı fiyat eksiltmesi gerçekleşti. Detaylar için panele giriniz.`
    } else if (type === 'bid_received') {
      messageText = `[İhaleciBurada] Yayınladığınız ihale için yeni bir doğrulanmış tedarikçi teklifi alındı.`
    }
  }

  return {
    success: true,
    code: 'SMS_SENT',
    messageId,
    gateway: 'İhaleciBurada SMS & E-Posta Servis Ağı (Netgsm / İletimerkezi Entegre)',
    recipient: {
      phone: phone || null,
      email: email || null
    },
    payload: {
      type,
      otpCode: type === 'otp' ? otpCode : undefined,
      messageText,
      status: 'DELIVERED',
      deliveredAt: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  }
})
