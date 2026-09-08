import { getAllTenders, removeTender } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID belirtilmelidir.'
    })
  }

  const allTenders = getAllTenders()
  const targetTender = allTenders.find(t => t.id === id)

  if (!targetTender) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Silinmek istenen ihale bulunamadı.'
    })
  }

  // 🛡️ IDOR & Güvenlik Koruması: Temel sistem ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri ve resmî temel kayıtlar silinemez.'
    })
  }

  // Yetkilendirme kontrolü: İhale sahibi veya admin token
  const headers = getRequestHeaders(event)
  const reqEmail = (headers['x-user-email'] as string | undefined)?.toLowerCase().trim()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || headers['x-admin-token']

  if (targetTender.ownerEmail && reqEmail && !isAdmin) {
    if (targetTender.ownerEmail.toLowerCase().trim() !== reqEmail) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bu ihaleyi yalnızca ihale sahibi silebilir (Yetkisiz IDOR işlemi engellendi).'
      })
    }
  }

  const removed = removeTender(id)
  return {
    success: true,
    removed,
    message: removed ? 'İhale başarıyla sunucu havuzundan kaldırıldı.' : 'İhale bulunamadı.'
  }
})
