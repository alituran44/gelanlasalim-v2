import { defineEventHandler, readBody, createError } from 'h3'
import { getAllTenders, saveTenders } from '~~/server/utils/tendersStore'
import { logGibAudit } from '~~/server/utils/gibAuditStore'

export interface AwardPayload {
  bidId: string
  winnerCompany: string
  amount: string
  evaluationType: 'BEST_PRICE' | 'COMMERCIAL_REASON' | 'TECHNICAL_MERIT'
  awardReasonCode?: 'BEST_VALID_PRICE' | 'FASTEST_DELIVERY' | 'BEST_WARRANTY' | 'HIGH_QUALITY_SPEC' | 'PAST_PERFORMANCE' | 'OTHER'
  awardReasonNote?: string
  evaluatedBy?: string
  isFinal?: boolean
}

export default defineEventHandler(async (event) => {
  const tenderId = event.context.params?.id
  const body = await readBody<AwardPayload>(event)

  if (!tenderId || !body || !body.bidId || !body.winnerCompany || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale kimliği, teklif kimliği, kazanan firma ve teklif tutarı zorunludur. (Kural AWD-001)'
    })
  }

  const tenders = getAllTenders()
  const tender = tenders.find(t => t.id === tenderId)

  if (!tender) {
    throw createError({
      statusCode: 404,
      statusMessage: `İhale bulunamadı: ${tenderId}`
    })
  }

  // 🛡️ AWD-006: Asgari Teklif Sayısı Kontrolü
  const minRequired = tender.minBidsCount || 1
  const actualCount = tender.teklifSayisi || 0
  if (actualCount < minRequired) {
    throw createError({
      statusCode: 400,
      statusMessage: `İhalede belirlenen asgari teklif sayısı (${minRequired}) sağlanamamıştır (Mevcut: ${actualCount}). İhale kazanan belirlenerek sonuçlandırılamaz (Kural AWD-006 - INSUFFICIENT_BIDS).`
    })
  }

  // 🛡️ AWD-003: En İyi Fiyat Dışında Seçim Gerekçesi Kontrolü
  if (body.evaluationType !== 'BEST_PRICE' && !body.awardReasonCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'En düşük/yüksek fiyat dışındaki bir teklifin kazanan seçilmesi durumunda seçim gerekçesi belirtilmesi zorunludur. (Kural AWD-003)'
    })
  }

  const now = new Date().toISOString()
  const tutanakNo = `TUT-2026-${Math.floor(10000 + Math.random() * 90000)}`

  // 🛡️ AWD-007: İki Aşamalı Sonuç (Geçici vs Kesin Sonuç)
  const targetStatus = body.isFinal ? 'FINALIZED' : 'PROVISIONAL_RESULT'
  tender.statusCode = targetStatus
  tender.durum = body.isFinal ? 'anlasildi' : 'degerlendirmede'

  const awardEvent = {
    awardId: `AWD-${Date.now()}`,
    tutanakNo,
    bidId: body.bidId,
    winnerCompany: body.winnerCompany,
    amount: body.amount,
    evaluationType: body.evaluationType,
    awardReasonCode: body.awardReasonCode || 'BEST_VALID_PRICE',
    awardReasonNote: body.awardReasonNote || '',
    evaluatedBy: body.evaluatedBy || 'Satın Alma Yetkilisi',
    status: targetStatus,
    timestamp: now
  }

  if (!tender.awardHistory) {
    tender.awardHistory = []
  }

  // 🛡️ AWD-009: Kesin sonuç kaydı üzerine yazılmaz; yeni award olayı eklenir
  tender.awardHistory.push(awardEvent)
  tender.activeAward = awardEvent

  saveTenders(tenders)

  // 🛡️ VUK 595 Denetim Kaydı
  logGibAudit({
    event_type: 'TENDER_AWARDED',
    tax_number: '9560161511',
    user_id: body.evaluatedBy || 'ihalecib@gmail.com',
    tender_id: tender.id,
    ip_address: '127.0.0.1',
    status_code: 200,
    request_payload: JSON.stringify(body),
    response_payload: JSON.stringify({ tutanakNo, targetStatus })
  })

  return {
    success: true,
    message: body.isFinal 
      ? 'İhale kesin olarak sonuçlandırıldı ve resmi sonuç tutanağı oluşturuldu.' 
      : 'İhale geçici sonucu oluşturuldu. Şirket içi nihai onay bekleniyor. (Kural AWD-007)',
    award: awardEvent,
    tutanakNo,
    statusCode: targetStatus
  }
})
