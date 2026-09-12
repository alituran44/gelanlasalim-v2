import { defineEventHandler } from 'h3'
import { getEnvironmentConfig, getSystemTelemetry } from '~~/server/utils/systemEnvironmentStore'

export default defineEventHandler(() => {
  const env = getEnvironmentConfig()
  const telemetry = getSystemTelemetry()

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'İhaleciBurada B2B E-İhale Platformu',
    version: env.version,
    environment: env.env,
    buildId: env.buildId,
    uptimeSeconds: telemetry.uptimeSeconds,
    memory: telemetry.memory,
    systemStatus: {
      tenantIsolation: env.dbIsolation,
      maintenanceMode: env.maintenanceMode,
      activeTenders: telemetry.counts.activeTenders,
      totalBids: telemetry.counts.totalBids
    },
    merchant: {
      tradeName: env.officialMerchant.tradeName,
      taxOffice: env.officialMerchant.taxOffice,
      vkn: env.officialMerchant.vkn,
      phone: env.officialMerchant.phone
    }
  }
})
