import { defineEventHandler, getQuery } from 'h3'
import { calculatePlatformKpis } from '~~/server/utils/reportingKpiStore'

export default defineEventHandler((event) => {
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
