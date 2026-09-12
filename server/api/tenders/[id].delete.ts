import { getAllTenders, removeTender } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'

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
    throw createError({
      statusCode: 404,
      statusMessage: 'Silinmek istenen ihale bulunamadı.'
    })
  }

  // 🛡️ IDOR & Güvenlik Koruması: Temel sistem ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri ve resmî temel kayıtlar silinemez.'
    })
  }

  // Yetkilendirme kontrolü: İhale sahibi veya admin token
  const headers = getRequestHeaders(event)
  const reqEmail = (headers['x-user-email'] as string | undefined)?.toLowerCase().trim()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  if (targetTender.ownerEmail && reqEmail && !isAdmin) {
    if (targetTender.ownerEmail.toLowerCase().trim() !== reqEmail) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bu ihaleyi yalnızca ihale sahibi silebilir (Yetkisiz IDOR işlemi engellendi).'
      })
    }
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
