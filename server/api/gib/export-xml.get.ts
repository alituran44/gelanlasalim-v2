import { getGibLogsByPeriod, getAllGibLogs, generateBtransXml } from '~~/server/utils/gibAuditStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const period = (query.period as string) || '2026-09'

  const logs = period === 'all' ? getAllGibLogs() : getGibLogsByPeriod(period)
  const xmlContent = generateBtransXml(logs, period)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="GIB_BTRANS_VUK538_Ihale_Bildirimi_${period.replace('-', '_')}.xml"`)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  return xmlContent
})
