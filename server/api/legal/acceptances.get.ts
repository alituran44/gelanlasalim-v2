import { defineEventHandler, getQuery, getRequestHeaders } from 'h3'
import { 
  getUserAcceptances, 
  OFFICIAL_LEGAL_DOCUMENTS,
  checkHasAcceptedLatest 
} from '~~/server/utils/legalComplianceStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const headers = getRequestHeaders(event)
  const email = (query.email || headers['x-user-email'] || 'ihalecib@gmail.com') as string

  const userAcceptances = getUserAcceptances(email)

  const documentStatuses = OFFICIAL_LEGAL_DOCUMENTS.map(doc => {
    const isAccepted = checkHasAcceptedLatest(email, doc.code)
    const latestAcceptance = userAcceptances.find(a => a.documentCode === doc.code)
    return {
      ...doc,
      isAccepted,
      acceptedVersion: latestAcceptance?.documentVersion || null,
      acceptedAt: latestAcceptance?.acceptedAt || null,
      channel: latestAcceptance?.channel || null
    }
  })

  return {
    success: true,
    userEmail: email,
    totalDocuments: OFFICIAL_LEGAL_DOCUMENTS.length,
    acceptedCount: documentStatuses.filter(d => d.isAccepted).length,
    documents: documentStatuses,
    history: userAcceptances
  }
})
