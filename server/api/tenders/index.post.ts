import { addTender, TenderItem } from '~~/server/utils/tendersStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const body = await readBody<Partial<TenderItem>>(event)
    if (!body || !body.baslik) {
      throw createError({
        statusCode: 400,
        statusMessage: 'İhale başlığı zorunludur.'
      })
    }

    const id = body.id || `IHC-2026-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`

    const newTender: TenderItem = {
      id,
      baslik: body.baslik.trim(),
      aciklama: body.aciklama || '',
      kategori: body.kategori || 'Genel Satın Alma',
      mainCategory: body.mainCategory || body.kategori || 'Genel',
      subCategory: body.subCategory || 'Malzeme & Hizmet',
      city: body.city || body.sehir || 'Türkiye',
      ownerCompany: body.ownerCompany || 'Firma Sahibi',
      ownerEmail: body.ownerEmail || '',
      authority: body.authority || 'Yetkili Satın Alma Komisyonu',
      butce: body.butce || '💬 Teklif Usulü',
      sure: body.sure || '7 gün kaldı',
      durum: body.durum || 'active',
      ihaleYonu: body.ihaleYonu || 'kapali_zarf',
      tur: body.tur || 'Satın Alma',
      usul: body.usul || (body.ihaleYonu === 'eksiltme' ? 'Açık Eksiltme' : 'Kapalı Zarf Usulü'),
      teklifSayisi: body.teklifSayisi || 0,
      liderTeklif: body.liderTeklif || '-',
      adminApproved: true,
      aiApproved: true,
      aiScore: body.aiScore || 99.0,
      olusturma: body.olusturma || dateFormatted,
      isBaseline: false,
      files: body.files || [],
      images: body.images || []
    }

    const saved = addTender(newTender)

    return {
      success: true,
      message: 'İhale başarıyla oluşturuldu ve sunucu havuzuna kaydedildi.',
      tender: saved
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'İhale oluşturulurken sunucu hatası oluştu.'
    })
  }
})
