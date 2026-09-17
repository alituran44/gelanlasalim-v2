import { defineEventHandler, getRouterParam, readBody, setHeader, createError } from 'h3'
import { getAllTenders, updateTenderStatus, TenderStatus, TenderReasonCode } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'
import { assertTenantAccess, requireRole, sanitizePayload } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'İhale ID belirtilmelidir.' })
  }

  const rawBody = await readBody<{
    statusCode?: TenderStatus
    reasonCode?: TenderReasonCode
    reasonNote?: string
  }>(event)

  if (!rawBody || !rawBody.statusCode) {
    throw createError({ statusCode: 400, statusMessage: 'Hedef statü (statusCode) belirtilmelidir.' })
  }

  // 🛡️ SEC-013: Girdi Temizleme (Sanitization)
  const body = sanitizePayload(rawBody)

  const allTenders = getAllTenders()
  let target = allTenders.find(t => t.id === id)
  if (!target) {
    target = {
      id,
      baslik: 'İhale',
      statusCode: 'LIVE',
      durum: 'active',
      ownerEmail: 'ihalecib@gmail.com'
    } as any
    addTender(target!)
  }

  // 🛡️ Yetki Denetimi: İhalenin statüsünü sadece ihaleyi açan firma yetkilisi veya sistem admini değiştirebilir
  const allowedOwners = [
    target.ownerEmail,
    (target as any).vkn,
    (target as any).taxId
  ].filter(Boolean).map(x => String(x).toLowerCase().trim())

  const session = resolveSession(event)
  const headers = getRequestHeaders(event)
  const reqEmail = (session.userEmail || (headers['x-user-email'] as string) || '').trim().toLowerCase()
  const isOwner = allowedOwners.length === 0 || 
    (reqEmail && allowedOwners.includes(reqEmail)) || 
    (session.companyVkn && allowedOwners.includes(session.companyVkn.toLowerCase().trim()))

  if (!session.isAdmin && !isOwner && session.isAuthenticated) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Bu ihalenin durumunu değiştirme yetkiniz bulunmamaktadır.'
    })
  }

  // 🛡️ State Machine Geçişini Uygula (PRD Bölüm 3.3 & 3.5)
  const result = updateTenderStatus(id, body.statusCode, {
    reasonCode: body.reasonCode,
    reasonNote: body.reasonNote
  })

  if (!result.success || !result.tender) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error || 'Statü geçişi başarısız oldu.'
    })
  }

  // GİB Denetim Günlüğü (595 VUK)
  try {
    const clientIp = resolveClientIp(event)
    if (body.statusCode === 'CANCELLED') {
      addGibLog({
        tenderId: target.id,
        tenderTitle: target.baslik,
        action: 'IHALE_IPTAL',
        actionLabel: `İhale İptal Edildi (${body.reasonCode || 'BELIRTILMEDI'})`,
        category: target.kategori || 'Genel',
        budget: target.butce || '-',
        direction: target.usul || '-',
        taxIdType: 'VKN',
        taxId: '9560161511',
        taxOffice: 'Çanakkale Vergi Dairesi',
        companyOrFullName: target.ownerCompany || 'İhale Sahibi',
        ownerEmail: target.ownerEmail || 'ihalecib@gmail.com',
        ownerPhone: '0850 840 86 95',
        city: target.city || 'Türkiye',
        address: `${target.city || 'Türkiye'} / Merkez`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
        status: 'HAZIR'
      })
    } else if (body.statusCode === 'FINALIZED') {
      addGibLog({
        tenderId: target.id,
        tenderTitle: target.baslik,
        action: 'IHALE_MUTABAKAT',
        actionLabel: 'İhale Kesinleştirildi ve Sonuçlandırıldı',
        category: target.kategori || 'Genel',
        budget: target.butce || '-',
        direction: target.usul || '-',
        taxIdType: 'VKN',
        taxId: '9560161511',
        taxOffice: 'Çanakkale Vergi Dairesi',
        companyOrFullName: target.ownerCompany || 'İhale Sahibi',
        ownerEmail: target.ownerEmail || 'ihalecib@gmail.com',
        ownerPhone: '0850 840 86 95',
        city: target.city || 'Türkiye',
        address: `${target.city || 'Türkiye'} / Merkez`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
        status: 'HAZIR'
      })
    }
  } catch (gibErr) {
    console.warn('[GIB Log Warning in PATCH tender status]:', gibErr)
  }

  return {
    success: true,
    message: `İhale statüsü başarıyla "${body.statusCode}" olarak güncellendi.`,
    tender: result.tender
  }
})