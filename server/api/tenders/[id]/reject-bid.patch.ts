import { defineEventHandler, readBody, createError } from 'h3'
import { getAllBids, saveBids } from '~~/server/utils/bidsStore'
import { getAllTenders } from '~~/server/utils/tendersStore'
import { logGibAudit } from '~~/server/utils/gibAuditStore'
import { assertTenantAccess, requireRole, sanitizePayload } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'

export interface RejectBidPayload {
  bidId: string
  reasonCode: 'TEKNIK_YETERSIZLIK' | 'TESLIMAT_SURESI_UYUMSUZ' | 'GARANTI_KOSULLARI_UYGUNSUZ' | 'BUTCE_ASIMI' | 'TICARI_SARTLAR_UYGUNSUZ' | 'REFERANS_YETERSIZLIGI' | 'DIGER'
  reasonNote?: string
  rejectedBy?: string
}

export default defineEventHandler(async (event) => {
  const tenderId = event.context.params?.id
  const rawBody = await readBody<RejectBidPayload>(event)

  if (!tenderId || !rawBody || !rawBody.bidId || !rawBody.reasonCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale kimliği, teklif kimliği ve zorunlu ret gerekçesi (reasonCode) belirtilmelidir. (Kural AWD-002)'
    })
  }

  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)

  const tenders = getAllTenders()
  const tender = tenders.find(t => t.id === tenderId)
  if (!tender) {
    throw createError({
      statusCode: 404,
      statusMessage: `İhale bulunamadı: ${tenderId}`
    })
  }

  // 🛡️ SEC-002 & SEC-006: Tenant İzolasyonu, IDOR ve Rol Kontrolü
  // Teklifi sadece ihaleyi açan firma yetkilisi veya sistem yöneticisi reddedebilir
  const allowedOwners = [
    tender.ownerEmail,
    (tender as any).vkn,
    (tender as any).taxId
  ].filter(Boolean)

  assertTenantAccess(event, allowedOwners)
  requireRole(event, ['FİRMA_YÖNETİCİSİ', 'SATIN_ALMA'])

  const bids = getAllBids()
  const bid = bids.find(b => b.id === body.bidId && b.tenderId === tenderId)

  if (!bid) {
    throw createError({
      statusCode: 404,
      statusMessage: `Bu ihaleye ait teklif bulunamadı: ${body.bidId}`
    })
  }

  const now = new Date().toISOString()

  // 🛡️ AWD-002: Teknik/ticari olarak elenen teklif silinmez; gerekçesiyle korunur
  bid.durum = 'reddedildi'
  bid.rejectionReason = body.reasonCode
  bid.rejectionNote = body.reasonNote || ''
  bid.rejectedAt = now
  bid.rejectedBy = body.rejectedBy || 'Değerlendirme Yetkilisi'

  saveBids(bids)

  logGibAudit({
    event_type: 'BID_REJECTED_WITH_REASON',
    tax_number: '9560161511',
    user_id: body.rejectedBy || 'ihalecib@gmail.com',
    tender_id: tenderId,
    ip_address: resolveClientIp(event),
    status_code: 200,
    request_payload: JSON.stringify(body),
    response_payload: JSON.stringify({ bidId: bid.id, status: 'reddedildi' })
  })

  return {
    success: true,
    message: `Teklif "${body.reasonCode}" gerekçesiyle teknik/ticari olarak elendi ve denetim izine kaydedildi. (Kural AWD-002)`,
    bid
  }
})
