import { getAllBids, removeBid } from '~~/server/utils/bidsStore'

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

  const ok = removeBid(id)
  return {
    success: ok,
    removed: ok,
    message: ok ? 'Teklif başarıyla sunucu havuzundan kaldırıldı.' : 'Teklif bulunamadı.'
  }
})
