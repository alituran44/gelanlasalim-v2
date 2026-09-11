import { defineEventHandler, readBody, createError } from 'h3'
import { getAllBids, saveBids } from '~~/server/utils/bidsStore'
import { logGibAudit } from '~~/server/utils/gibAuditStore'

export interface RejectBidPayload {
  bidId: string
  reasonCode: 'TEKNIK_YETERSIZLIK' | 'TESLIMAT_SURESI_UYUMSUZ' | 'GARANTI_KOSULLARI_UYGUNSUZ' | 'BUTCE_ASIMI' | 'TICARI_SARTLAR_UYGUNSUZ' | 'REFERANS_YETERSIZLIGI' | 'DIGER'
  reasonNote?: string
  rejectedBy?: string
}

export default defineEventHandler(async (event) => {
  const tenderId = event.context.params?.id
  const body = await readBody<RejectBidPayload>(event)

  if (!tenderId || !body || !body.bidId || !body.reasonCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale kimliği, teklif kimliği ve zorunlu ret gerekçesi (reasonCode) belirtilmelidir. (Kural AWD-002)'
    })
  }

  const bids = getAllBids()
  const bid = bids.find(b => b.id === body.bidId)

  if (!bid) {
    throw createError({
      statusCode: 404,
      statusMessage: `Teklif bulunamadı: ${body.bidId}`
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
    ip_address: '127.0.0.1',
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
