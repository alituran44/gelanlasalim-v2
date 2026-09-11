import { getAllBids, getBidsForTender } from '~~/server/utils/bidsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const headers = getRequestHeaders(event)
  const tenderId = query.tenderId as string | undefined
  const ownerEmail = query.ownerEmail as string | undefined
  const requesterEmail = ((query.requesterEmail || headers['x-user-email'] || '') as string).trim().toLowerCase()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  let bids = getAllBids()
  const allTenders = getAllTenders()

  if (tenderId) {
    bids = bids.filter(b => b.tenderId === tenderId)
  }

  if (ownerEmail) {
    const cleanEmail = ownerEmail.trim().toLowerCase()
    bids = bids.filter(b => (b.ownerEmail || '').trim().toLowerCase() === cleanEmail)
  }

  // 🛡️ BID-014, SEC-004 & BID-015: Backend Düzeyinde Gizlilik ve Maskeleme
  const sanitizedBids = bids.map((b, idx) => {
    const tender = allTenders.find(t => t.id === b.tenderId)
    const bidEmail = (b.eposta || '').trim().toLowerCase()
    const isMyBid = Boolean(requesterEmail && bidEmail === requesterEmail)
    const isOwner = Boolean(requesterEmail && tender?.ownerEmail && requesterEmail === tender.ownerEmail.trim().toLowerCase())

    // Kopya nesne oluştur (orijinal store verisini mutasyona uğratmamak için)
    const copy = { ...b }

    // 1. 🛡️ BID-014 & SEC-004: Kapalı Zarf İhale Backend Gizliliği
    const isSealed = tender?.usul === 'Kapalı Zarf Usulü' || tender?.tur === 'kapali_zarf'
    const isTenderOpen = tender ? (tender.durum !== 'closed' && tender.durum !== 'mutabakat' && (!tender.endDate || new Date(tender.endDate).getTime() > Date.now())) : false

    if (isSealed && isTenderOpen && !isMyBid && !isAdmin) {
      // İhale kapanana kadar alıcı dahil fiyat ve şartname notu API'de gizlenir
      copy.fiyat = '***.*** ₺ (Kapalı Zarf - Gizli Teklif)'
      copy.notum = 'Gizli Şartname Notu (İhale Kapanışından Sonra Açılacaktır)'
      copy.telefon = '***'
      copy.eposta = '***'
    }

    // 2. 🛡️ BID-015: Açık Eksiltmede Rakip Firma Unvanı Gizliliği (Fair Competition)
    const isOpenReduction = !isSealed
    if (isOpenReduction && !isMyBid && !isOwner && !isAdmin) {
      copy.firma = `Doğrulanmış Tedarikçi #${idx + 1}`
      copy.yetkili = 'Yetkili Temsilci'
      copy.telefon = '***'
      copy.eposta = '***'
    }

    return copy
  })

  return {
    success: true,
    count: sanitizedBids.length,
    bids: sanitizedBids
  }
})
