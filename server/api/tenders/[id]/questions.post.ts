import { defineEventHandler, readBody, createError } from 'h3'
import { addTenderQuestion } from '~~/server/utils/tenderQuestionsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'
import { createNotification } from '~~/server/utils/notificationsStore'
import { sanitizeXss } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const tenderId = event.context.params?.id
  const body = await readBody(event) || {}

  if (!tenderId || !body.question) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale kimliği ve soru metni zorunludur. (Kural COM-005)'
    })
  }

  const allTenders = getAllTenders()
  const tender = allTenders.find(t => t.id === tenderId)
  if (!tender) {
    throw createError({
      statusCode: 404,
      statusMessage: 'İhale bulunamadı.'
    })
  }

  // Check if tender is still active
  if (tender.durum === 'closed' || tender.durum === 'anlasildi') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kapanmış veya mutabakat sağlanmış bir ihale için yeni soru sorulamaz.'
    })
  }

  const question = addTenderQuestion({
    tenderId,
    tenderTitle: tender.baslik,
    askerEmail: body.askerEmail || 'tedarikci@firma.com',
    askerCompanyName: sanitizeXss(body.askerCompanyName) || 'Katılımcı Firma',
    isAnonymous: Boolean(body.isAnonymous),
    type: body.type || 'GENEL',
    question: sanitizeXss(body.question)
  })

  // 🛡️ COM-001 & COM-005: İhale Sahibine Bildirim Gönder
  if (tender.ownerEmail) {
    createNotification({
      recipientEmail: tender.ownerEmail,
      title: `Yeni İhale Sorusu: ${tender.baslik}`,
      message: `"${tender.baslik}" ihalenize yeni bir ${question.type === 'GENEL' ? 'genel' : 'özel'} soru iletildi. Lütfen yanıtlayınız.`,
      category: 'INFO',
      relatedTenderId: tenderId,
      actionUrl: `/panel/ilanlarim?id=${tenderId}`
    })
  }

  return {
    success: true,
    message: question.type === 'GENEL' 
      ? 'Sorunuz başarıyla iletildi. İhale sahibi yanıtladığında tüm katılımcılara genel duyuru olarak yayınlanacaktır (Kural COM-005).'
      : 'Özel sorunuz doğrudan ihale sahibine iletilmiştir.',
    question
  }
})
