import { defineEventHandler, getQuery, getRequestHeaders, createError } from 'h3'
import { getQuestionsForTender } from '~~/server/utils/tenderQuestionsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const tenderId = event.context.params?.id
  if (!tenderId) {
    throw createError({ statusCode: 400, statusMessage: 'İhale kimliği gereklidir.' })
  }

  const query = getQuery(event)
  const headers = getRequestHeaders(event)
  const requesterEmail = ((query.requesterEmail || headers['x-user-email'] || '') as string).trim().toLowerCase()

  const allTenders = getAllTenders()
  const tender = allTenders.find(t => t.id === tenderId)
  const isOwner = Boolean(requesterEmail && tender?.ownerEmail && requesterEmail === tender.ownerEmail.trim().toLowerCase())

  const questions = getQuestionsForTender(tenderId, requesterEmail, isOwner)

  return {
    success: true,
    tenderId,
    count: questions.length,
    questions
  }
})
