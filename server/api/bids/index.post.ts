import { addBid, BidItem, sanitizeInput, validateBidSubmission } from '~~/server/utils/bidsStore'
import { getAllTenders, addTender } from '~~/server/utils/tendersStore'
import { sendViaGoogleSmtp, getStoredSmtpConfig } from '~~/server/utils/smtpClient'

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

    // Otomatik E-Posta Bildirimleri: Teklif Verildiğinde ve Teklif Alındığında
    try {
      const storedConfig = getStoredSmtpConfig()
      const passwordToUse = storedConfig.smtpPassword || process.env.GMAIL_APP_PASSWORD || ''

      if (passwordToUse) {
        // A) Teklif Verildiğinde Tedarikçiye Teyit E-Postası (TPL_BID_SUBMITTED)
        if (saved.eposta && saved.eposta.includes('@')) {
          sendViaGoogleSmtp({
            host: storedConfig.smtpHost || 'smtp.gmail.com',
            port: storedConfig.smtpPort || 465,
            user: storedConfig.smtpUser || 'ihalecib@gmail.com',
            pass: passwordToUse,
            from: storedConfig.senderEmail || 'ihalecib@gmail.com',
            fromName: storedConfig.senderName || 'İhaleciBurada B2B Operasyon',
            to: saved.eposta,
            subject: `Teklifiniz Başarıyla İletildi: ${tenderTitle}`,
            html: `Sayın ${saved.firma} Yetkilisi,\n\n"${tenderTitle}" başlıklı satın alma ihalesine sunmuş olduğunuz ${saved.fiyat} tutarındaki fiyat teklifiniz alıcı kuruma başarıyla ulaştırılmıştır.\n\n• Teklif Kodu: ${saved.id}\n• İhale Başlığı: ${tenderTitle}\n• Sunulan Fiyat: ${saved.fiyat}\n• Geçerlilik Süresi: ${saved.sure}\n\nTeklifinizin durumunu kurumsal yönetim panelinizden anlık olarak takip edebilirsiniz:\nhttps://www.ihaleciburada.com/panel/tekliflerim\n\nİhaleciBurada Tedarik Zinciri Masası`,
            templateName: 'Teklif Verildi Teyidi (TPL_BID_SUBMITTED)'
          }).catch(err => console.warn('[Auto-Mail] Bidder confirmation failed:', err))
        }

        // B) Teklif Alındığında İhale Sahibine Bildirim E-Postası (TPL_NEW_BID)
        const tenderOwner = ownerEmail || targetTender?.ownerEmail || 'ihalecib@gmail.com'
        if (tenderOwner && tenderOwner.includes('@')) {
          sendViaGoogleSmtp({
            host: storedConfig.smtpHost || 'smtp.gmail.com',
            port: storedConfig.smtpPort || 465,
            user: storedConfig.smtpUser || 'ihalecib@gmail.com',
            pass: passwordToUse,
            from: storedConfig.senderEmail || 'ihalecib@gmail.com',
            fromName: storedConfig.senderName || 'İhaleciBurada B2B Operasyon',
            to: tenderOwner,
            subject: `İhalenize Yeni Teklif Geldi: ${tenderTitle}`,
            html: `Sayın Alıcı Yetkilisi,\n\nYayınlamış olduğunuz "${tenderTitle}" başlıklı satın alma ilanınız için onaylı tedarikçi "${saved.firma}" tarafından yeni bir fiyat teklifi sunuldu.\n\n• İhale Başlığı: ${tenderTitle}\n• Sunulan Teklif: ${saved.fiyat}\n• Teklif Veren Firma: ${saved.firma}\n• Teklif Yetkilisi: ${saved.yetkili}\n\nTeklifi incelemek ve karşı teklifinizi iletmek için kurumsal panelinize giriş yapınız:\nhttps://www.ihaleciburada.com/panel/ihalelerim\n\nİhaleciBurada B2B Operasyon Masası`,
            templateName: 'Yeni Teklif Bildirimi (TPL_NEW_BID)'
          }).catch(err => console.warn('[Auto-Mail] Tender owner notification failed:', err))
        }
      }
    } catch (mailErr) {
      console.warn('[Auto-Mail] Bid submission email dispatch warning:', mailErr)
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
