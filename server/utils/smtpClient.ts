import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'

export interface SmtpOptions {
  host?: string
  port?: number
  user?: string
  pass?: string
  from?: string
  fromName?: string
  to: string
  subject: string
  text?: string
  html?: string
  templateName?: string
}

export interface SmtpConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword?: string
  senderEmail: string
  senderName: string
  replyToEmail?: string
}

const CONFIG_FILE = path.resolve(process.cwd(), '.smtp_config.json')

export function getStoredSmtpConfig(): SmtpConfig {
  const defaults: SmtpConfig = {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpUser: 'ihalecib@gmail.com',
    smtpPassword: '',
    senderEmail: 'ihalecib@gmail.com',
    senderName: 'İhaleciBurada B2B Operasyon'
  }

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      return { ...defaults, ...parsed }
    }
  } catch (e) {}

  return defaults
}

export function saveStoredSmtpConfig(config: Partial<SmtpConfig>): SmtpConfig {
  const current = getStoredSmtpConfig()
  const updated = { ...current, ...config }
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch (e) {
    console.warn('[SMTP Config] Could not write config file:', e)
  }
  return updated
}

/**
 * Enterprise Production SMTP Client using Nodemailer with full Google Mail (Gmail) compatibility.
 * Supports Gmail Service presets, Port 465 (Direct SSL) and Port 587 (STARTTLS).
 */
export async function sendViaGoogleSmtp(options: SmtpOptions): Promise<{ success: boolean; message: string; code?: string; timestamp?: string }> {
  const stored = getStoredSmtpConfig()

  const host = options.host || stored.smtpHost || 'smtp.gmail.com'
  const port = Number(options.port || stored.smtpPort || 465)
  const user = options.user || stored.smtpUser || 'ihalecib@gmail.com'
  const pass = (options.pass || stored.smtpPassword || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
  const from = options.from || stored.senderEmail || user
  const fromName = options.fromName || stored.senderName || 'İhaleciBurada.com'
  const to = options.to
  const subject = options.subject
  const rawBody = options.html || options.text || ''

  if (!user || !pass) {
    return {
      success: false,
      code: 'MISSING_CREDENTIALS',
      message: 'Google e-posta adresi veya 16 haneli Google Uygulama Şifresi girilmemiş. Lütfen Admin Paneli > E-Posta Merkezi sekmesinden şifrenizi kaydediniz.',
      timestamp: new Date().toISOString()
    }
  }

  // Wrap body in a beautiful, responsive HTML email shell if not already wrapped
  const htmlFormatted = rawBody.includes('<html') ? rawBody : `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0b1e3b; padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; white-space: pre-line; color: #334155; }
    .button-wrap { text-align: center; padding: 12px 0 24px; }
    .button { display: inline-block; background: #0052ff; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 14px; }
    .footer { background: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>İhaleciBurada.com</h1>
      <div style="font-size: 11px; color: #93c5fd; margin-top: 4px;">B2B Elektronik Satın Alma & Canlı Ters İhale Platformu</div>
    </div>
    <div class="content">
${rawBody}
    </div>
    <div class="button-wrap">
      <a href="https://www.ihaleciburada.com/panel" class="button">İşlemi İncele & Yönetim Paneline Git →</a>
    </div>
    <div class="footer">
      <div>Bu e-posta İhaleciBurada.com otomatik bildirim sistemi tarafından gönderilmiştir.</div>
      <div style="margin-top: 4px;">İletişim: 0850 840 86 95 • ihalecib@gmail.com • Çanakkale / Türkiye</div>
    </div>
  </div>
</body>
</html>`

  try {
    const isGmailHost = host.toLowerCase().includes('gmail.com') || host.toLowerCase().includes('googlemail.com')

    const transportOptions: any = isGmailHost
      ? {
          service: 'gmail',
          auth: {
            user,
            pass
          },
          tls: {
            rejectUnauthorized: false
          }
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass
          },
          tls: {
            rejectUnauthorized: false
          }
        }

    const transporter = nodemailer.createTransport(transportOptions)

    const info = await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to,
      subject,
      text: options.text || rawBody.replace(/<[^>]*>/g, ''),
      html: htmlFormatted
    })

    return {
      success: true,
      code: 'SMTP_SENT',
      message: `E-posta ${to} adresine Google SMTP (${host}:${port}) üzerinden başarıyla iletildi. (ID: ${info.messageId})`,
      timestamp: new Date().toISOString()
    }
  } catch (err: any) {
    console.error('[SMTP Send Error]:', err)
    const rawError = err?.message || String(err)
    let code = 'SMTP_ERROR'
    let friendlyMessage = rawError

    if (rawError.includes('535') || rawError.includes('Username and Password not accepted') || err?.code === 'EAUTH') {
      code = 'AUTH_FAILED'
      friendlyMessage = 'Google Giriş Hatası (535 Bad Credentials): Normal hesap şifreniz Google tarafından reddedildi. Google Güvenlik kuralları gereği https://myaccount.google.com/apppasswords adresinden "İhaleciBurada" adıyla 16 haneli bir "Uygulama Şifresi" üretip onu girmelisiniz.'
    } else if (rawError.includes('ECONNREFUSED') || rawError.includes('ETIMEDOUT') || rawError.includes('ENOTFOUND')) {
      code = 'CONNECTION_ERROR'
      friendlyMessage = `Google SMTP Sunucusuna (${host}:${port}) bağlanılamadı. Lütfen sunucu bağlantısını ve port ayarını (465 veya 587) kontrol ediniz.`
    }

    return {
      success: false,
      code,
      message: friendlyMessage,
      timestamp: new Date().toISOString()
    }
  }
}
