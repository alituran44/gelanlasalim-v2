import { getGibLogsByPeriod, getAllGibLogs } from '~~/server/utils/gibAuditStore'
import { requireRole } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin veya Muhasebe / Mali Yetkili Rol Doğrulaması (401/403)
  const session = requireRole(event, ['MUHASEBE', 'FİRMA_YÖNETİCİSİ'])

  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const period = query.period as string | undefined

  let logs = period ? getGibLogsByPeriod(period) : getAllGibLogs()

  // 🛡️ SEC-002: Tenant İzolasyonu
  if (!session.isAdmin) {
    const userVkn = session.companyVkn
    if (!userVkn) {
      logs = []
    } else {
      logs = logs.filter(l => l.taxId === userVkn)
    }
  }

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
