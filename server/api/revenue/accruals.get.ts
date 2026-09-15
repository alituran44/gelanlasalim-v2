import { defineEventHandler, getQuery } from 'h3'
import { getAllCommissionAccruals, AccrualStatus, CorporateTier } from '~~/server/utils/revenueModelStore'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması (401/403)
  requireAdmin(event)

  const query = getQuery(event)
  const status = query.status as AccrualStatus | undefined
  const tier = query.tier as CorporateTier | undefined

  let accruals = getAllCommissionAccruals()

  if (status) {
    accruals = accruals.filter(a => a.status === status)
  }
  if (tier) {
    accruals = accruals.filter(a => a.sellerTier === tier)
  }

  const all = getAllCommissionAccruals()
  const summary = {
    totalAccrualsCount: all.length,
    totalGrossMerchandiseVolume: all.reduce((sum, a) => sum + a.tenderFinalAmount, 0),
    totalGrossCommissionPool: all.reduce((sum, a) => sum + a.grossCommission, 0),
    totalNetPayable: all.reduce((sum, a) => sum + a.netPayableCommission, 0),
    collectedCommission: all.filter(a => a.status === 'COLLECTED').reduce((sum, a) => sum + a.netPayableCommission, 0),
    pendingInvoiceCommission: all.filter(a => a.status === 'PENDING_INVOICE').reduce((sum, a) => sum + a.netPayableCommission, 0),
    invoicedCommission: all.filter(a => a.status === 'INVOICED').reduce((sum, a) => sum + a.netPayableCommission, 0)
  }

  return {
    success: true,
    serverTime: new Date().toISOString(),
    summary,
    count: accruals.length,
    accruals
  }
})
