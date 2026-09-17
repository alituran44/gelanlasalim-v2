import { defineEventHandler, readBody, createError } from 'h3'
import { resolveSession, sanitizePayload } from '~~/server/utils/authGuard'
import { updateCompanyVerificationStatus, getCompanyByVkn } from '~~/server/utils/companyVerificationStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  const session = resolveSession(event)
  if (!session.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Yetkisiz işlem: Şirket KYC onayı sadece sistem yöneticileri tarafından verilebilir.'
    })
  }

  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const vkn = String(body.vkn || '').trim()
  const status = body.status === 'REJECTED' ? 'REJECTED' : 'VERIFIED'
  const reason = body.reason ? String(body.reason).trim() : undefined

  if (!vkn) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN parametresi zorunludur.'
    })
  }

  const result = updateCompanyVerificationStatus({
    vkn,
    status,
    actorEmail: session.userEmail,
    reason,
    verificationBadge: status === 'VERIFIED' 
      ? '✓ GİB & KYC Doğrulanmış Kurumsal Mükellef (Mavi Rozet)' 
      : '✕ Sicil Onayı Reddedildi'
  })

  if (!result.success) {
    throw createError({
      statusCode: 404,
      statusMessage: result.error || 'Şirket bulunamadı.'
    })
  }

  logSecurityEvent(event, {
    eventType: 'ADMIN_ACTION',
    severity: 'MEDIUM',
    actorEmail: session.userEmail,
    actorVkn: vkn,
    actionTaken: 'ALLOWED',
    details: { action: 'KYC_STATUS_UPDATED', newStatus: status, reason }
  })

  return {
    success: true,
    message: status === 'VERIFIED' 
      ? 'Firma resmi belgeleri onaylandı ve Mavi Rozet başarıyla tanımlandı.' 
      : 'Firma doğrulama başvurusu reddedildi.',
    company: result.company
  }
})
