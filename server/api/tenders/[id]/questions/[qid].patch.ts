import { defineEventHandler, readBody, createError } from 'h3'
import { answerTenderQuestion, getAllTenderQuestions } from '~~/server/utils/tenderQuestionsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'
import { createNotification } from '~~/server/utils/notificationsStore'
import { sanitizeXss } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const tenderId = event.context.params?.id
  const qid = event.context.params?.qid
  const body = await readBody(event) || {}

  if (!tenderId || !qid || !body.answer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID, soru ID ve cevap metni zorunludur. (Kural COM-005)'
    })
  }

  const allQuestions = getAllTenderQuestions()
  const question = allQuestions.find(q => q.id === qid && q.tenderId === tenderId)
  if (!question) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Soru bulunamadı.'
    })
  }

  const answered = answerTenderQuestion(qid, {
    answer: sanitizeXss(body.answer),
    answeredBy: body.answeredBy || 'İhale Sahibi Yetkilisi',
    isPublicAnnouncement: Boolean(body.isPublicAnnouncement)
  })

  // 🛡️ COM-006: Soru sahibine veya herkese bildirim üret
  if (answered) {
    // 1. Soru sahibine bildirim
    createNotification({
      recipientEmail: question.askerEmail,
      title: `İhale Sorunuz Yanıtlandı: ${question.tenderTitle}`,
      message: `"${question.question}" sorunuza ihale sahibi tarafından yanıt verildi: "${answered.answer}"`,
      category: 'INFO',
      relatedTenderId: tenderId
    })

    // 2. Genel zeyilname ise genel duyuru bildirimi
    if (answered.isPublicAnnouncement) {
      createNotification({
        recipientEmail: 'all',
        title: `📢 Genel Zeyilname / İhale Açıklaması: ${question.tenderTitle}`,
        message: `İhale koşullarını ilgilendiren soru yanıtı genel duyuru olarak yayınlandı: "${answered.answer}"`,
        category: 'CRITICAL', // 🛡️ COM-003: Zeyilnameler kritiktir, kapatılamaz
        isMandatory: true,
        relatedTenderId: tenderId
      })
    }
  }

  return {
    success: true,
    message: answered?.isPublicAnnouncement 
      ? 'Soru yanıtlandı ve tüm katılımcılara Genel Zeyilname (Addendum) olarak duyuruldu (Kural COM-006).' 
      : 'Soru yanıtlandı ve katılımcıya iletildi.',
    question: answered
  }
})
