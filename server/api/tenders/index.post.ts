import { addTender, TenderItem } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'

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

    // 595 Sıra No'lu VUK Genel Tebliği uyarınca yer sağlayıcı ihale denetim kaydını otomatik oluştur
    try {
      const headers = getRequestHeaders(event)
      const forwardedFor = headers['x-forwarded-for']
      const clientIp = typeof forwardedFor === 'string' 
        ? forwardedFor.split(',')[0].trim()
        : (headers['x-real-ip'] || headers['cf-connecting-ip'] || event.node.req?.socket?.remoteAddress || '127.0.0.1')
      const userAgent = headers['user-agent'] || 'Web Client'
      const port = (headers['x-forwarded-port'] as string) || '443'

      addGibLog({
        tenderId: saved.id,
        tenderTitle: saved.baslik,
        action: 'IHALE_ACILDI',
        actionLabel: '595 VUK Tebliği Uyarınca Yer Sağlayıcı İhale Kaydı',
        category: saved.kategori,
        budget: saved.butce,
        direction: saved.usul,
        taxIdType: ((body as any).taxIdType) || ((body as any).taxNo?.length === 11 ? 'TCKN' : 'VKN'),
        taxId: (body as any).taxId || (body as any).taxNo || (body as any).vkn || (body as any).tckn || '4700854210',
        taxOffice: (body as any).taxOffice || (body as any).vergiDairesi || `${saved.city} Vergi Dairesi`,
        companyOrFullName: saved.ownerCompany || (body as any).unvan || 'Kayıtlı İhale Sahibi',
        ownerEmail: saved.ownerEmail || 'ihalecib@gmail.com',
        ownerPhone: (body as any).ownerPhone || (body as any).phone || (body as any).telefon || '0850 840 86 95',
        city: saved.city,
        address: (body as any).teslimatAdresi || (body as any).address || `${saved.city} / Türkiye`,
        ipAddress: String(clientIp),
        port,
        userAgent,
        timestamp: now.toISOString(),
        status: 'HAZIR',
        url: `https://www.ihaleciburada.com/pazar-yeri?id=${saved.id}`
      })
    } catch (gibErr) {
      console.warn('[GIB 595 Log] Auto-record warning:', gibErr)
    }

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
