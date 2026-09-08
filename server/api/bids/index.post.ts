import { addBid, BidItem, sanitizeInput, validateBidSubmission } from '~~/server/utils/bidsStore'
import { getAllTenders, addTender } from '~~/server/utils/tendersStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const body = await readBody<Partial<BidItem>>(event)
    if (!body || !body.tenderId || !body.fiyat) {
      throw createError({
        statusCode: 400,
        statusMessage: 'İhale kimliği (tenderId) ve teklif fiyatı zorunludur.'
      })
    }

    // 1. İlgili ihaleyi bul
    const allTenders = getAllTenders()
    const targetTender = allTenders.find(t => t.id === body.tenderId || t.baslik === body.tenderTitle)

    // 2. Kapanış, kendi ihalesine teklif verme ve tutar doğrulamasını çalıştır
    const validation = validateBidSubmission(targetTender, {
      eposta: body.eposta,
      fiyat: body.fiyat,
      firma: body.firma,
      bidderName: body.yetkili
    })

    if (!validation.valid) {
      throw createError({
        statusCode: validation.statusCode || 400,
        statusMessage: validation.error || 'Teklif kurallara uygun bulunmadı.'
      })
    }

    const id = body.id || `TKF-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

    const ownerEmail = body.ownerEmail || targetTender?.ownerEmail || ''
    const tenderTitle = targetTender?.baslik || body.tenderTitle || 'Satın Alma İhalesi'

    // 3. XSS ve Güvenlik Sanitization
    const cleanPrice = sanitizeInput(body.fiyat)
    const formattedPrice = cleanPrice.includes('₺') || cleanPrice.includes('$') || cleanPrice.includes('€') 
      ? cleanPrice 
      : `${cleanPrice} ₺`

    const newBid: BidItem = {
      id,
      tenderId: body.tenderId,
      tenderTitle,
      ownerEmail,
      firma: sanitizeInput(body.firma) || 'Teklif Veren Tedarikçi',
      fiyat: formattedPrice,
      sure: sanitizeInput(body.sure) || '7 gün geçerli',
      puan: typeof body.puan === 'number' ? body.puan : 5.0,
      durum: body.durum || 'bekliyor',
      yetkili: sanitizeInput(body.yetkili) || 'Firma Yetkilisi',
      telefon: sanitizeInput(body.telefon) || '',
      eposta: sanitizeInput(body.eposta) || '',
      vergiDairesi: sanitizeInput(body.vergiDairesi) || '',
      adres: sanitizeInput(body.adres) || '',
      notum: sanitizeInput(body.notum) || '',
      tarih: body.tarih || dateFormatted,
      createdAt: now.toISOString(),
      pazarlikGecmisi: body.pazarlikGecmisi || []
    }

    const saved = addBid(newBid)

    // 4. İlgili ihalenin teklif sayısını ve lider teklifini güncelle
    if (targetTender) {
      targetTender.teklifSayisi = (targetTender.teklifSayisi || 0) + 1
      targetTender.liderTeklif = formattedPrice
      addTender(targetTender)
    }

    return {
      success: true,
      message: 'Teklif başarıyla sunucu havuzuna kaydedildi.',
      bid: saved,
      updatedTender: targetTender ? {
        id: targetTender.id,
        teklifSayisi: targetTender.teklifSayisi,
        liderTeklif: targetTender.liderTeklif
      } : null
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'Teklif kaydedilirken sunucu hatası oluştu.'
    })
  }
})
