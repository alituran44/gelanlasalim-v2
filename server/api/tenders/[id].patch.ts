import { getAllTenders, updateTenderStatus, TenderStatus, TenderReasonCode } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'İhale ID belirtilmelidir.' })
  }

  const body = await readBody<{
    statusCode?: TenderStatus
    reasonCode?: TenderReasonCode
    reasonNote?: string
  }>(event)

  if (!body || !body.statusCode) {
    throw createError({ statusCode: 400, statusMessage: 'Hedef statü (statusCode) belirtilmelidir.' })
  }

  const allTenders = getAllTenders()
  const target = allTenders.find(t => t.id === id)
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'İhale bulunamadı.' })
  }

  // Yetkilendirme (IDOR) kontrolü
  const headers = getRequestHeaders(event)
  const reqEmail = (headers['x-user-email'] as string | undefined)?.toLowerCase().trim()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  if (target.ownerEmail && reqEmail && !isAdmin) {
    if (target.ownerEmail.toLowerCase().trim() !== reqEmail) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bu ihalenin statüsünü yalnızca ihale sahibi veya yetkili admin değiştirebilir.'
      })
    }
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
        ipAddress: (headers['x-forwarded-for'] as string)?.split(',')[0].trim() || '127.0.0.1',
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
        ipAddress: (headers['x-forwarded-for'] as string)?.split(',')[0].trim() || '127.0.0.1',
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