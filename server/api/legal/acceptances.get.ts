import { defineEventHandler, getQuery, setHeader } from 'h3'
import { 
  getUserAcceptances, 
  OFFICIAL_LEGAL_DOCUMENTS, 
  checkHasAcceptedLatest 
} from '~~/server/utils/legalComplianceStore'
import { requireAuth } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  // 🛡️ SEC-001 & SEC-002: Yetkisiz veri okumayı ve başkasının sözleşme kaydını görmeyi engelle
  const session = requireAuth(event)
  const query = getQuery(event)

  // Normal kullanıcılar yalnızca kendi kabul geçmişini görebilir; Admin yetkisi varsa parametre sorgulayabilir
  const email = (session.isAdmin && query.email ? String(query.email) : session.userEmail).trim().toLowerCase()

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
