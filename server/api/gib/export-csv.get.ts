import { getGibLogsByPeriod, getAllGibLogs, generateBtransCsv } from '~~/server/utils/gibAuditStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const period = (query.period as string) || '2026-09'

  const logs = period === 'all' ? getAllGibLogs() : getGibLogsByPeriod(period)
  const csvContent = generateBtransCsv(logs)

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="GIB_BTRANS_VUK538_Ihale_Raporu_${period.replace('-', '_')}.csv"`)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  return csvContent
})
