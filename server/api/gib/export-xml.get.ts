import { getGibLogsByPeriod, getAllGibLogs, generateBtransXml } from '~~/server/utils/gibAuditStore'
import { requireRole } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin veya Muhasebe / Mali Yetkili Rol Doğrulaması (401/403)
  const session = requireRole(event, ['MUHASEBE', 'FİRMA_YÖNETİCİSİ'])
  const query = getQuery(event)
  const period = (query.period as string) || '2026-09'

  let logs = period === 'all' ? getAllGibLogs() : getGibLogsByPeriod(period)

  // 🛡️ SEC-002: Tenant İzolasyonu
  if (!session.isAdmin) {
    const userVkn = session.companyVkn
    if (!userVkn) {
      logs = []
    } else {
      logs = logs.filter(l => l.taxId === userVkn)
    }
  }

  const xmlContent = generateBtransXml(logs, period)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="GIB_BTRANS_VUK538_Ihale_Bildirimi_${period.replace('-', '_')}.xml"`)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  return xmlContent
})
