import { defineEventHandler, readBody, createError } from 'h3'
import { recordAcceptance, OFFICIAL_LEGAL_DOCUMENTS } from '~~/server/utils/legalComplianceStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)

  if (!body.userEmail || !body.documentCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı e-postası ve sözleşme kodu zorunludur (Kural LEG-004).'
    })
  }

  const doc = OFFICIAL_LEGAL_DOCUMENTS.find(d => d.code === body.documentCode)
  if (!doc) {
    throw createError({
      statusCode: 404,
      statusMessage: `Tanımsız sözleşme kodu: ${body.documentCode}`
    })
  }

  const record = recordAcceptance(event, {
    userEmail: body.userEmail,
    companyVkn: body.companyVkn,
    documentCode: body.documentCode,
    documentVersion: body.documentVersion || doc.version,
    channel: body.channel || 'WEB',
    isExplicitConsent: Boolean(body.isExplicitConsent),
    isCommercialCommConsent: Boolean(body.isCommercialCommConsent)
  })

  // 🛡️ SEC-007 & LEG-004: Güvenlik günlüğüne kritik kabul olayını işle
  logSecurityEvent(event, {
    eventType: 'CRITICAL_ACTION_LOGGED',
    severity: 'LOW',
    actorEmail: body.userEmail,
    actorVkn: body.companyVkn,
    actionTaken: 'ALLOWED',
    targetResource: `/legal/${body.documentCode}`,
    details: {
      action: 'CONTRACT_ACCEPTED',
      documentCode: body.documentCode,
      version: record.documentVersion,
      compliance: 'LEG-001, LEG-004, LEG-006'
    }
  })

  return {
    success: true,
    message: `"${doc.title}" (v${record.documentVersion}) sözleşme kabulünüz zaman damgalı olarak tescil edildi.`,
    acceptance: record
  }
})
