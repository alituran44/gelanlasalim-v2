import { defineEventHandler, getQuery } from 'h3'
import { calculatePlatformKpis } from '~~/server/utils/reportingKpiStore'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması
  requireAdmin(event)

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const period = (query.period as string) || '30gun'

  const report = calculatePlatformKpis(period)

  return {
    success: true,
    period,
    report
  }
})
