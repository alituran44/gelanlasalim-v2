import { addBid, BidItem, sanitizeInput, validateBidSubmission } from '~~/server/utils/bidsStore'
import { getAllTenders, addTender } from '~~/server/utils/tendersStore'
import { sendViaGoogleSmtp, getStoredSmtpConfig } from '~~/server/utils/smtpClient'
import { logBidEvent } from '~~/server/utils/bidAuditStore'

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
      // 🛡️ BID-019 & BID-020: Ret nedeni açıkça loglanır ve denetim kaydına alınır
      logBidEvent(event, {
        action: 'BID_REJECTED',
        tenderId: body.tenderId,
        tenderTitle: targetTender?.baslik || body.tenderTitle || 'Bilinmeyen İhale',
        firma: sanitizeInput(body.firma) || 'Bilinmeyen Firma',
        yetkili: sanitizeInput(body.yetkili),
        eposta: sanitizeInput(body.eposta),
        fiyat: String(body.fiyat),
        result: 'REJECTED',
        reason: validation.error
      })

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

    // 4. İlgili ihalenin teklif sayısını, lider teklifini ve Anti-Sniping kuralını güncelle
    let antiSnipingTriggered = false
    let newEndDate: string | null = null

    if (targetTender) {
      targetTender.teklifSayisi = (targetTender.teklifSayisi || 0) + 1
      targetTender.liderTeklif = formattedPrice

      // 🛡️ BID-009 & BID-010: Anti-Sniping Otomatik Süre Uzatma (Açık Eksiltme ve Açık Artırma)
      const isSealed = targetTender.usul === 'Kapalı Zarf Usulü' || targetTender.tur === 'kapali_zarf'
      if (!isSealed && targetTender.endDate) {
        const endMs = new Date(targetTender.endDate).getTime()
        const remainingMs = endMs - now.getTime()
        const TWO_MINUTES_MS = 2 * 60 * 1000 // 120.000 ms

        // Kapanışa son 2 dakika veya daha az kalmışsa ve ihale henüz bitmemişse
        if (remainingMs > 0 && remainingMs <= TWO_MINUTES_MS) {
          const currentExtensions = targetTender.extensionCount || 0
          const MAX_EXTENSIONS = 15 // Maksimum 30 dakika (15 x 2 dk - BID-010)

          if (currentExtensions < MAX_EXTENSIONS) {
            targetTender.extensionCount = currentExtensions + 1
            targetTender.totalExtendedMinutes = targetTender.extensionCount * 2
            targetTender.lastExtendedAt = now.toISOString()
            targetTender.antiSnipingActive = true

            // Kapanış süresine +2 dakika ekle
            const updatedEndMs = endMs + TWO_MINUTES_MS
            targetTender.endDate = new Date(updatedEndMs).toISOString()
            newEndDate = targetTender.endDate
            antiSnipingTriggered = true

            console.log(`[Anti-Sniping] Tender ${targetTender.id} extended by 2 minutes! (Extension #${targetTender.extensionCount}/${MAX_EXTENSIONS})`)
          }
        }
      }

      addTender(targetTender)
    }

    // 🛡️ BID-020: Teklif işleminde firma, kullanıcı, teklif, tutar, zaman, IP/oturum ve denetim kaydına alma
    logBidEvent(event, {
      action: 'BID_SUBMITTED',
      tenderId: saved.tenderId,
      tenderTitle: saved.tenderTitle,
      bidId: saved.id,
      firma: saved.firma,
      yetkili: saved.yetkili,
      eposta: saved.eposta,
      fiyat: saved.fiyat,
      result: 'SUCCESS',
      antiSnipingTriggered
    })

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
      message: antiSnipingTriggered 
        ? 'Teklif kaydedildi. Son dakika teklifi nedeniyle ihale süresi kural gereğince otomatik 2 dakika uzatıldı (Anti-Sniping).' 
        : 'Teklif başarıyla sunucu havuzuna kaydedildi.',
      bid: saved,
      antiSniping: {
        triggered: antiSnipingTriggered,
        extensionCount: targetTender?.extensionCount || 0,
        totalExtendedMinutes: targetTender?.totalExtendedMinutes || 0,
        newEndDate
      },
      updatedTender: targetTender ? {
        id: targetTender.id,
        teklifSayisi: targetTender.teklifSayisi,
        liderTeklif: targetTender.liderTeklif,
        endDate: targetTender.endDate,
        extensionCount: targetTender.extensionCount,
        totalExtendedMinutes: targetTender.totalExtendedMinutes,
        antiSnipingActive: targetTender.antiSnipingActive
      } : null
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'Teklif kaydedilirken sunucu hatası oluştu.'
    })
  }
})
