import { getGibLogsByPeriod, getAllGibLogs, generateBtransCsv } from '~~/server/utils/gibAuditStore'
import { requireRole } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin veya Muhasebe / Mali Yetkili Rol Doğrulaması (401/403)
  const session = requireRole(event, ['MUHASEBE', 'FİRMA_YÖNETİCİSİ'])
  const query = getQuery(event)
  const period = (query.period as string) || '2026-09'

  let logs = period === 'all' ? getAllGibLogs() : getGibLogsByPeriod(period)

  // 🛡️ SEC-002: Tenant İzolasyonu
  // Admin tüm sistem loglarını görebilir; şirket muhasebe/yöneticisi yalnızca kendi firmasına ait kayıtları görebilir
  if (!session.isAdmin) {
    const userVkn = session.companyVkn
    if (!userVkn) {
      logs = []
    } else {
      logs = logs.filter(l => l.taxId === userVkn)
    }
  }

  const csvContent = generateBtransCsv(logs)

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="GIB_BTRANS_VUK538_Ihale_Raporu_${period.replace('-', '_')}.csv"`)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  return csvContent
})
