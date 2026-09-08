import tls from 'node:tls'
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
 * Native Node.js Zero-Dependency TLS SMTP Client for Google Mail / Gmail (smtp.gmail.com:465)
 */
export function sendViaGoogleSmtp(options: SmtpOptions): Promise<{ success: boolean; message: string; code?: string; timestamp?: string }> {
  return new Promise((resolve) => {
    const stored = getStoredSmtpConfig()

    const host = options.host || stored.smtpHost || 'smtp.gmail.com'
    const port = Number(options.port || stored.smtpPort || 465)
    const user = options.user || stored.smtpUser || 'ihalecib@gmail.com'
    const pass = (options.pass || stored.smtpPassword || '').replace(/\s+/g, '')
    const from = options.from || stored.senderEmail || user
    const fromName = options.fromName || stored.senderName || 'İhaleciBurada.com'
    const to = options.to
    const subject = options.subject
    const bodyContent = options.html || options.text || ''

    if (!user || !pass) {
      return resolve({
        success: false,
        code: 'MISSING_CREDENTIALS',
        message: 'Google e-posta adresi veya 16 haneli Google Uygulama Şifresi girilmemiş. Lütfen Admin Paneli > E-Posta Merkezi sekmesinden şifrenizi kaydediniz.',
        timestamp: new Date().toISOString()
      })
    }

    const socket = tls.connect({ host, port, timeout: 12000 }, () => {})

    let step = 0
    let hasResolved = false

    const finish = (result: { success: boolean; message: string; code?: string }) => {
      if (!hasResolved) {
        hasResolved = true
        try {
          socket.write('QUIT\r\n')
          socket.end()
        } catch (e) {}
        resolve({
          ...result,
          timestamp: new Date().toISOString()
        })
      }
    }

    socket.on('data', (chunk) => {
      const response = chunk.toString()

      if (step === 0 && response.startsWith('220')) {
        step = 1
        socket.write('EHLO localhost\r\n')
      } else if (step === 1 && response.startsWith('250')) {
        step = 2
        socket.write('AUTH LOGIN\r\n')
      } else if (step === 2 && response.startsWith('334')) {
        step = 3
        const b64User = Buffer.from(user, 'utf-8').toString('base64')
        socket.write(`${b64User}\r\n`)
      } else if (step === 3 && response.startsWith('334')) {
        step = 4
        const b64Pass = Buffer.from(pass, 'utf-8').toString('base64')
        socket.write(`${b64Pass}\r\n`)
      } else if (step === 4) {
        if (response.startsWith('235')) {
          step = 5
          socket.write(`MAIL FROM:<${from}>\r\n`)
        } else {
          return finish({
            success: false,
            code: 'AUTH_FAILED',
            message: `Google Giriş Hatası: Kullanıcı adı veya uygulama şifresi kabul edilmedi (${response.trim()}). Lütfen Google Hesabınızdan 16 haneli Uygulama Şifresi oluşturup girdiğinizden emin olun.`
          })
        }
      } else if (step === 5 && response.startsWith('250')) {
        step = 6
        socket.write(`RCPT TO:<${to}>\r\n`)
      } else if (step === 6 && response.startsWith('250')) {
        step = 7
        socket.write('DATA\r\n')
      } else if (step === 7 && response.startsWith('354')) {
        step = 8
        const dateStr = new Date().toUTCString()
        const b64Subject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`
        const b64FromName = `=?UTF-8?B?${Buffer.from(fromName, 'utf-8').toString('base64')}?=`
        
        // Wrap body in a beautiful, responsive HTML email shell
        const htmlFormatted = bodyContent.includes('<html') ? bodyContent : `
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
${bodyContent}
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

        const b64Body = Buffer.from(htmlFormatted, 'utf-8').toString('base64')

        const mimeMsg = [
          `Date: ${dateStr}`,
          `From: ${b64FromName} <${from}>`,
          `To: <${to}>`,
          `Subject: ${b64Subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          `Content-Transfer-Encoding: base64`,
          ``,
          b64Body,
          `.`
        ].join('\r\n') + '\r\n'

        socket.write(mimeMsg)
      } else if (step === 8 && response.startsWith('250')) {
        return finish({
          success: true,
          code: 'SMTP_SENT',
          message: `E-posta ${to} adresine Google SMTP (${host}:${port}) üzerinden başarıyla iletildi.`
        })
      } else if (response.startsWith('5') || response.startsWith('4')) {
        return finish({
          success: false,
          code: 'SMTP_ERROR',
          message: `Google SMTP Hatası: ${response.trim()}`
        })
      }
    })

    socket.on('error', (err) => {
      finish({
        success: false,
        code: 'CONNECTION_ERROR',
        message: `Google SMTP Sunucusuna bağlanılamadı: ${err.message}`
      })
    })

    socket.on('timeout', () => {
      socket.destroy()
      finish({
        success: false,
        code: 'TIMEOUT',
        message: 'Google SMTP sunucusundan 12 saniye içinde yanıt alınamadı (Zaman aşımı).'
      })
    })
  })
}
