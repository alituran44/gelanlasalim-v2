import { getAllBids, removeBid, addBid } from '~~/server/utils/bidsStore'
import { logBidEvent } from '~~/server/utils/bidAuditStore'

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

  // Yetkilendirme kontrolü
  const headers = getRequestHeaders(event)
  const reqEmail = (headers['x-user-email'] as string | undefined)?.toLowerCase().trim()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || headers['x-admin-token']

  if (targetBid.eposta && reqEmail && !isAdmin) {
    if (targetBid.eposta.toLowerCase().trim() !== reqEmail && (targetBid.ownerEmail || '').toLowerCase().trim() !== reqEmail) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bu teklifi yalnızca teklif sahibi veya ihale açan firma geri çekebilir (IDOR engellendi).'
      })
    }
  }

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
