import { getAllTenders } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const headers = getRequestHeaders(event)
  const query = getQuery(event)
  const requesterEmail = ((query.requesterEmail || headers['x-user-email'] || '') as string).trim().toLowerCase()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  const tenders = getAllTenders()

  // 🛡️ TND-008 & SEC-001: Gizli rezerv/hedef fiyatı yetkisiz tedarikçilerden maskele
  const sanitizedTenders = tenders.map(t => {
    const copy = { ...t }
    const isOwner = Boolean(requesterEmail && (t.ownerEmail || '').trim().toLowerCase() === requesterEmail)

    if (!isOwner && !isAdmin) {
      delete copy.reservePrice
      if (Array.isArray(copy.kalemler)) {
        copy.kalemler = copy.kalemler.map(k => {
          const kCopy = { ...k }
          delete (kCopy as any).hedefFiyat
          return kCopy
        })
      }
    }
    return copy
  })

  return {
    success: true,
    serverTime: new Date().toISOString(),
    count: sanitizedTenders.length,
    tenders: sanitizedTenders
  }
})
