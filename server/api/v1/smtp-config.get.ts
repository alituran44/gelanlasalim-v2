import { defineEventHandler } from 'h3'
import { getStoredSmtpConfig } from '~~/server/utils/smtpClient'

export default defineEventHandler((event) => {
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
