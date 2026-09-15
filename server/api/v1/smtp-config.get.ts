import { defineEventHandler } from 'h3'
import { getStoredSmtpConfig } from '~~/server/utils/smtpClient'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması (401/403)
  requireAdmin(event)

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const config = getStoredSmtpConfig()
  // Mask password for security
  const maskedPassword = config.smtpPassword 
    ? (config.smtpPassword.length > 4 ? config.smtpPassword.slice(0, 2) + '••••••••••••' + config.smtpPassword.slice(-2) : '••••••••')
    : ''

  return {
    success: true,
    config: {
      ...config,
      hasPassword: Boolean(config.smtpPassword),
      maskedPassword
    }
  }
})
