import { defineEventHandler, getRouterParam, getQuery, setHeader, createError } from 'h3'
import { getAllBids, removeBid, addBid } from '~~/server/utils/bidsStore'
import { logBidEvent } from '~~/server/utils/bidAuditStore'
import { assertTenantAccess } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Geçersiz teklif ID' })
  }

  const allBids = getAllBids()
  const targetBid = allBids.find(b => b.id === id)

  if (!targetBid) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Silinmek istenen teklif bulunamadı.'
    })
  }

  // 🛡️ IDOR & Güvenlik: Baseline referans tekliflerin silinmesini engelle
  if (id.startsWith('TKF-901-') || id.startsWith('TKF-902-') || id.startsWith('TKF-910-')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans teklifleri silinemez.'
    })
  }

  // 🛡️ SEC-002: Tenant İzolasyonu & IDOR Doğrulaması
  // Teklifi yalnızca teklifi veren firma (tedarikçi) veya ihaleyi açan firma (alıcı) veya admin geri çekebilir
  const allowedOwners = [
    targetBid.eposta,
    targetBid.ownerEmail,
    targetBid.vkn,
    (targetBid as any).taxId
  ].filter(Boolean)

  assertTenantAccess(event, allowedOwners)

  const query = getQuery(event)
  const cancelReason = (query.reason as string) || 'Kullanıcı tarafından geri çekilme / iptal talebi oluşturuldu.'

  // 🛡️ BID-005, BID-013, SEC-004: Kritik ticari teklif kayıtları asla fiziksel olarak silinemez (Admin dahil)
  targetBid.durum = 'iptal_talebi'
  targetBid.iptalGerekcesi = cancelReason
  targetBid.iptalTarihi = new Date().toISOString()

  // Teklif kaydını güncelle (silinmez, durum güncellenir)
  addBid(targetBid)

  // 🛡️ BID-020 & SEC-007: İptal talebi denetim kaydına alınır
  logBidEvent(event, {
    action: 'BID_CANCEL_REQUEST',
    tenderId: targetBid.tenderId,
    tenderTitle: targetBid.tenderTitle,
    bidId: targetBid.id,
    firma: targetBid.firma,
    yetkili: targetBid.yetkili,
    eposta: targetBid.eposta,
    fiyat: targetBid.fiyat,
    result: 'SUCCESS',
    reason: cancelReason
  })

  return {
    success: true,
    removed: false,
    status: 'iptal_talebi',
    message: 'Kural BID-013 & SEC-004 gereğince teklif sistemden fiziksel olarak silinmez; iptal talebi gerekçesiyle kayıt altına alındı.',
    bid: targetBid
  }
})
