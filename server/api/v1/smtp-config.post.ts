import { defineEventHandler, readBody } from 'h3'
import { saveStoredSmtpConfig, SmtpConfig, sendViaGoogleSmtp } from '~~/server/utils/smtpClient'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const body = await readBody<Partial<SmtpConfig> & { testEmail?: string }>(event)

    const updated = saveStoredSmtpConfig({
      smtpHost: body.smtpHost || 'smtp.gmail.com',
      smtpPort: Number(body.smtpPort) || 465,
      smtpUser: body.smtpUser || 'ihalecib@gmail.com',
      smtpPassword: body.smtpPassword,
      senderEmail: body.senderEmail || 'ihalecib@gmail.com',
      senderName: body.senderName || 'İhaleciBurada B2B Operasyon',
      replyToEmail: body.replyToEmail || 'ihalecib@gmail.com'
    })

    let testResult = null
    if (body.testEmail) {
      testResult = await sendViaGoogleSmtp({
        host: updated.smtpHost,
        port: updated.smtpPort,
        user: updated.smtpUser,
        pass: updated.smtpPassword,
        from: updated.senderEmail,
        fromName: updated.senderName,
        to: body.testEmail,
        subject: 'İhaleciBurada - Google Mail SMTP Test Başarılı!',
        html: `Sayın Yönetici,\n\nGoogle Mail (Gmail SMTP) yapılandırmanız başarıyla tamamlanmıştır.\n\n• SMTP Sunucu: ${updated.smtpHost}:${updated.smtpPort}\n• Gönderici: ${updated.senderEmail}\n• Durum: Aktif ve Yayında\n\nBu andan itibaren şifre değişiklikleri, yeni ihale yayınları ve teklif bildirimleri otomatik olarak bu Google hesabı üzerinden iletilecektir.`
      })
    }

    return {
      success: true,
      message: 'Google Mail SMTP ayarları başarıyla kaydedildi.',
      testResult
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'SMTP ayarları kaydedilirken hata.'
    })
  }
})
