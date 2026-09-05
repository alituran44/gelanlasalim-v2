import { removeTender } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID belirtilmelidir.'
    })
  }

  const removed = removeTender(id)
  return {
    success: true,
    removed,
    message: removed ? 'İhale başarıyla sunucu havuzundan kaldırıldı.' : 'İhale bulunamadı.'
  }
})
