import { defineEventHandler, readBody } from 'h3'
import { sendViaGoogleSmtp, saveStoredSmtpConfig, getStoredSmtpConfig } from '~~/server/utils/smtpClient'

export interface SmtpSendRequest {
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  senderEmail?: string
  senderName?: string
  recipientEmail: string
  subject: string
  htmlBody: string
  templateName?: string
  saveConfig?: boolean
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as SmtpSendRequest

  if (!body || !body.recipientEmail || !body.subject) {
    return {
      success: false,
      code: 'MISSING_PARAMETERS',
      message: 'Alıcı e-posta adresi ve e-posta konusu zorunludur.',
      timestamp: new Date().toISOString()
    }
  }

  // Save config if requested from admin panel
  if (body.saveConfig || body.smtpPassword) {
    saveStoredSmtpConfig({
      smtpHost: body.smtpHost || 'smtp.gmail.com',
      smtpPort: body.smtpPort || 465,
      smtpUser: body.smtpUser || body.senderEmail || 'ihalecib@gmail.com',
      smtpPassword: body.smtpPassword,
      senderEmail: body.senderEmail || 'ihalecib@gmail.com',
      senderName: body.senderName || 'İhaleciBurada B2B Operasyon'
    })
  }

  const storedConfig = getStoredSmtpConfig()
  const passwordToUse = body.smtpPassword || storedConfig.smtpPassword || process.env.GMAIL_APP_PASSWORD || ''

  // Attempt real Google SMTP dispatch
  const smtpResult = await sendViaGoogleSmtp({
    host: body.smtpHost || storedConfig.smtpHost || 'smtp.gmail.com',
    port: body.smtpPort || storedConfig.smtpPort || 465,
    user: body.smtpUser || storedConfig.smtpUser || 'ihalecib@gmail.com',
    pass: passwordToUse,
    from: body.senderEmail || storedConfig.senderEmail || 'ihalecib@gmail.com',
    fromName: body.senderName || storedConfig.senderName || 'İhaleciBurada B2B Operasyon',
    to: body.recipientEmail,
    subject: body.subject,
    html: body.htmlBody,
    templateName: body.templateName
  })

  const emailId = `MAIL_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`

  return {
    success: smtpResult.success,
    code: smtpResult.code || (smtpResult.success ? 'SMTP_SENT' : 'SMTP_FAILED'),
    emailId,
    sender: `${body.senderName || storedConfig.senderName} <${body.senderEmail || storedConfig.senderEmail}>`,
    recipient: body.recipientEmail,
    subject: body.subject,
    template: body.templateName || 'Özel E-Posta Şablonu',
    status: smtpResult.success ? 'DELIVERED' : 'FAILED',
    message: smtpResult.message,
    timestamp: new Date().toISOString()
  }
})
