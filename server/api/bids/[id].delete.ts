import { removeBid } from '~~/server/utils/bidsStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Geçersiz teklif ID' })
  }

  const ok = removeBid(id)
  return {
    success: ok,
    removed: ok,
    message: ok ? 'Teklif başarıyla sunucu havuzundan kaldırıldı.' : 'Teklif bulunamadı.'
  }
})
