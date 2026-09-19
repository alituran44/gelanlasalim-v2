import { defineEventHandler, createError, setHeader } from 'h3'
import { getQuestionsForTender } from '~~/server/utils/tenderQuestionsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'
import { resolveSession } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const tenderId = event.context.params?.id
  if (!tenderId) {
    throw createError({ statusCode: 400, statusMessage: 'İhale kimliği gereklidir.' })
  }

  // 🛡️ SEC-001 & SEC-002: Güvenli sunucu oturumu çözümleme
  const session = resolveSession(event)
  const requesterEmail = session.isAuthenticated ? session.userEmail.trim().toLowerCase() : ''

  const allTenders = getAllTenders()
  const tender = allTenders.find(t => t.id === tenderId)
  const isOwner = Boolean(
    session.isAdmin ||
    (session.isAuthenticated && tender?.ownerEmail && session.userEmail.trim().toLowerCase() === tender.ownerEmail.trim().toLowerCase()) ||
    (session.isAuthenticated && session.companyVkn && (tender as any)?.vkn && session.companyVkn.trim().toLowerCase() === String((tender as any).vkn).trim().toLowerCase())
  )

  const questions = getQuestionsForTender(tenderId, requesterEmail, isOwner)

  return {
    success: true,
    tenderId,
    count: questions.length,
    questions
  }
})
