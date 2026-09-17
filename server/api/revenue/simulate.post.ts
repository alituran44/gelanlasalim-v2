import { defineEventHandler, readBody } from 'h3'
import { simulateRevenueProjection, SimulationParams } from '~~/server/utils/revenueModelStore'
import { sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody<SimulationParams>(event)
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody || {} as SimulationParams)

  const params: SimulationParams = {
    monthlyTenderCount: Number(body?.monthlyTenderCount || 50),
    avgTenderAmount: Number(body?.avgTenderAmount || 250000),
    proSubscriberCount: Number(body?.proSubscriberCount || 20),
    enterpriseSubscriberCount: Number(body?.enterpriseSubscriberCount || 5),
    sellerCommissionRate: body?.sellerCommissionRate ? Number(body.sellerCommissionRate) : undefined
  }

  const projection = simulateRevenueProjection(params)

  return {
    success: true,
    calculatedAt: new Date().toISOString(),
    params,
    projection
  }
})
