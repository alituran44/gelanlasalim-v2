import { addBid, BidItem } from '~~/server/utils/bidsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'

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

    const id = body.id || `TKF-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

    // Tender bilgilerini bulup ihale sahibinin e-postasını eşitle
    const allTenders = getAllTenders()
    const targetTender = allTenders.find(t => t.id === body.tenderId || t.baslik === body.tenderTitle)
    const ownerEmail = body.ownerEmail || targetTender?.ownerEmail || ''
    const tenderTitle = body.tenderTitle || targetTender?.baslik || 'Satın Alma İhalesi'

    const newBid: BidItem = {
      id,
      tenderId: body.tenderId,
      tenderTitle,
      ownerEmail,
      firma: body.firma || 'Teklif Veren Tedarikçi',
      fiyat: body.fiyat.trim(),
      sure: body.sure || '7 gün geçerli',
      puan: body.puan || 5.0,
      durum: body.durum || 'bekliyor',
      yetkili: body.yetkili || 'Firma Yetkilisi',
      telefon: body.telefon || '',
      eposta: body.eposta || '',
      vergiDairesi: body.vergiDairesi || '',
      adres: body.adres || '',
      notum: body.notum || '',
      tarih: body.tarih || dateFormatted,
      createdAt: now.toISOString(),
      pazarlikGecmisi: body.pazarlikGecmisi || []
    }

    const saved = addBid(newBid)

    // İlgili ihalenin teklif sayısını ve lider teklifini güncelle
    if (targetTender) {
      targetTender.teklifSayisi = (targetTender.teklifSayisi || 0) + 1
      targetTender.liderTeklif = newBid.fiyat
    }

    return {
      success: true,
      message: 'Teklif başarıyla sunucu havuzuna kaydedildi.',
      bid: saved
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'Teklif kaydedilirken sunucu hatası oluştu.'
    })
  }
})
