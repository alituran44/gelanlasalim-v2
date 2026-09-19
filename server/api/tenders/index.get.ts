import { getAllTenders } from '~~/server/utils/tendersStore'
import { resolveSession } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  // 🛡️ SEC-001 & SEC-002: Güvenli sunucu oturumu çözümleme
  const session = resolveSession(event)
  const isAdmin = session.isAdmin
  const requesterEmail = session.isAuthenticated ? session.userEmail.trim().toLowerCase() : ''

  const tenders = getAllTenders()

  // 🛡️ SEC-002 & GEN-007: Özel ve Davetli İhalelerin Tenant İzolasyonu & Görünürlük Kontrolü
  const visibleTenders = tenders.filter(t => {
    const isOwner = Boolean(requesterEmail && (t.ownerEmail || '').trim().toLowerCase() === requesterEmail)
    if (isOwner || isAdmin) return true

    // Özel ve davetli ihaleler pazar yerinde yetkisiz kullanıcılara listelenmez
    if (t.gorunurluk === 'ozel' || t.gorunurluk === 'davetli') {
      const invitedList = (t.davetliFirmalar || t.allowedParticipants || []) as string[]
      const isInvited = invitedList.some(inv => inv.trim().toLowerCase() === requesterEmail)
      return isInvited
    }

    return true
  })

  // 🛡️ TND-008 & SEC-001: Gizli rezerv/hedef fiyatı yetkisiz tedarikçilerden maskele
  const sanitizedTenders = visibleTenders.map(t => {
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
