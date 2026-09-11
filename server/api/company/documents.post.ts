import { defineEventHandler, readBody, createError } from 'h3'
import { getCompanyByVkn, saveCompanies, getAllCompanies, CompanyDocument } from '~~/server/utils/companyVerificationStore'
import { validateUploadedFile } from '~~/server/utils/fileValidation'
import { resolveSession, sanitizePayload } from '~~/server/utils/authGuard'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  const body = sanitizePayload(rawBody)
  const { vkn, type, title, fileUrl, validUntil, adminEmail } = body

  if (!vkn || !type || !title || !validUntil) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN, belge türü, başlık ve son geçerlilik tarihi (validUntil) zorunludur. (Kural VER-008)'
    })
  }

  // 🛡️ SEC-012: Dosya uzantısı, MIME tipi ve zararlı içerik kontrolü
  validateUploadedFile(event, {
    fileName: title.includes('.') ? title : `${title}.pdf`,
    base64OrBuffer: fileUrl
  })

  // 🛡️ SEC-002: Tenant İzolasyonu
  const session = resolveSession(event)
  if (session.isAuthenticated && !session.isAdmin && session.companyVkn && session.companyVkn !== vkn) {
    logSecurityEvent(event, {
      eventType: 'IDOR_ATTEMPT',
      severity: 'HIGH',
      actorEmail: session.userEmail,
      actorVkn: session.companyVkn,
      targetResource: `/api/company/documents?vkn=${vkn}`,
      actionTaken: 'BLOCKED_403',
      details: { attemptedVkn: vkn, userVkn: session.companyVkn }
    })
    throw createError({
      statusCode: 403,
      statusMessage: 'Başka bir firmaya evrak yükleyemezsiniz (Kural SEC-002).'
    })
  }

  const company = getCompanyByVkn(vkn)
  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Firma bulunamadı.'
    })
  }

  const today = new Date().toISOString().slice(0, 10)
  const isExpired = validUntil < today

  const newDoc: CompanyDocument = {
    id: `DOC-${Date.now()}`,
    type,
    title,
    fileUrl: fileUrl || '',
    uploadedAt: new Date().toISOString(),
    validUntil,
    isExpired,
    verifiedByAdmin: true
  }

  // Replace or add document
  const existingIdx = company.documents.findIndex(d => d.type === type)
  if (existingIdx >= 0) {
    company.documents[existingIdx] = newDoc
  } else {
    company.documents.push(newDoc)
  }

  company.auditLog.push({
    action: 'DOCUMENT_UPLOADED',
    actor: adminEmail || 'SYSTEM',
    timestamp: newDoc.uploadedAt,
    details: { type, title, validUntil, isExpired }
  })

  saveCompanies(getAllCompanies())

  return {
    success: true,
    message: isExpired 
      ? 'Belge yüklendi ancak süresi dolmuş olarak işaretlendi. Lütfen güncel evrak yükleyiniz. (Kural VER-009)' 
      : 'Belge başarıyla yüklendi ve geçerliliği onaylandı.',
    document: newDoc
  }
})
