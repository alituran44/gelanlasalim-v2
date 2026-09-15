import { defineEventHandler } from 'h3'
import { getEnvironmentConfig, getSystemTelemetry, validateEnvironmentReadiness } from '~~/server/utils/systemEnvironmentStore'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması
  requireAdmin(event)

  const config = getEnvironmentConfig()
  const telemetry = getSystemTelemetry()
  const readiness = validateEnvironmentReadiness()

  return {
    success: true,
    serverTime: new Date().toISOString(),
    config,
    telemetry,
    readiness
  }
})
