import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import { getAllTenders, removeTender } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'
import { assertTenantAccess, requireRole } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID belirtilmelidir.'
    })
  }

  const allTenders = getAllTenders()
  const targetTender = allTenders.find(t => t.id === id)

  if (!targetTender) {
    return {
      success: true,
      message: 'İhale kaydı bulunamadı veya zaten silinmiş.'
    }
  }

  // 🛡️ IDOR & Güvenlik Koruması: Temel sistem ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri ve resmî temel kayıtlar silinemez.'
    })
  }

  // 🛡️ Yetki Denetimi: İhaleyi açan kişi veya sistem admini silebilir
  const allowedOwners = [
    targetTender.ownerEmail,
    (targetTender as any).vkn,
    (targetTender as any).taxId
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
      statusMessage: 'Bu ihaleyi silme yetkiniz bulunmamaktadır.'
    })
  }

  const removed = removeTender(id)

  if (removed) {
    try {
      addGibLog({
        tenderId: targetTender.id,
        tenderTitle: targetTender.baslik,
        action: 'IHALE_IPTAL',
        actionLabel: 'İhale Sistemden Tamamen Silindi / İptal Edildi',
        category: targetTender.kategori || 'Genel',
        budget: targetTender.butce || '-',
        direction: targetTender.tur || targetTender.ihaleYonu || '-',
        taxIdType: 'VKN',
        taxId: '9560161511',
        taxOffice: 'Çanakkale Vergi Dairesi',
        companyOrFullName: targetTender.ownerCompany || 'İhale Sahibi',
        ownerEmail: targetTender.ownerEmail || reqEmail || 'ihalecib@gmail.com',
        ownerPhone: '0850 840 86 95',
        city: targetTender.city || 'Türkiye',
        address: targetTender.teslimatAdresi || `${targetTender.city || 'Türkiye'} / Merkez`,
        ipAddress: (headers['x-forwarded-for'] as string)?.split(',')[0].trim() || '127.0.0.1',
        timestamp: new Date().toISOString(),
        status: 'HAZIR'
      })
    } catch (gibErr) {
      console.warn('[GIB Log Warning in DELETE tender]:', gibErr)
    }
  }

  return {
    success: true,
    removed,
    message: removed ? 'İhale başarıyla sunucu havuzundan kaldırıldı.' : 'İhale bulunamadı.'
  }
})
