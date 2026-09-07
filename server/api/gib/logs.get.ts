import { getGibLogsByPeriod, getAllGibLogs } from '~~/server/utils/gibAuditStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const period = query.period as string | undefined

  const logs = period ? getGibLogsByPeriod(period) : getAllGibLogs()

  // Calculate statistics for GİB compliance
  const totalLogs = logs.length
  const validTaxIdCount = logs.filter(l => l.taxId && l.taxId.trim().length >= 10).length
  const missingInfoCount = totalLogs - validTaxIdCount
  const complianceRate = totalLogs > 0 ? Math.round((validTaxIdCount / totalLogs) * 100) : 100

  return {
    success: true,
    count: totalLogs,
    complianceRate,
    validTaxIdCount,
    missingInfoCount,
    period: period || 'all',
    logs
  }
})
