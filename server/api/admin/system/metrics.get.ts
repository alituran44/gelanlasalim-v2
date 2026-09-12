import { defineEventHandler } from 'h3'
import { getEnvironmentConfig, getSystemTelemetry, validateEnvironmentReadiness } from '~~/server/utils/systemEnvironmentStore'

export default defineEventHandler(() => {
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
