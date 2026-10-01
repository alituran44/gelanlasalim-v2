import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import { getAllTenders, removeTender } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'
import { assertTenantAccess } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'

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
      message: 'İhale kaydı bulunamadı veya zaten arşivlenmiş.'
    }
  }

  // 🛡️ IDOR & Güvenlik Koruması: Temel sistem ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri ve resmî temel kayıtlar silinemez.'
    })
  }

  // 🛡️ SEC-002: Tenant İzolasyonu & IDOR Doğrulaması (İhaleyi açan firma veya sistem admini silebilir/arşivleyebilir)
  const allowedOwners = [
    targetTender.ownerEmail,
    (targetTender as any).vkn,
    (targetTender as any).taxId
  ].filter(Boolean)

  assertTenantAccess(event, allowedOwners)

  // 🛡️ Silinmeme İlkesi: İhale fiziksel olarak asla silinmez; arşivlendi olarak işaretlenir
  const archived = removeTender(id)

  if (archived) {
    try {
      const clientIp = resolveClientIp(event)
      addGibLog({
        tenderId: targetTender.id,
        tenderTitle: targetTender.baslik,
        action: 'IHALE_ARSIV',
        actionLabel: 'İhale Yayından Kaldırıldı / Arşive Alındı (Sistemde Korunuyor)',
        category: targetTender.kategori || 'Genel',
        budget: targetTender.butce || '-',
        direction: targetTender.tur || targetTender.ihaleYonu || '-',
        taxIdType: 'VKN',
        taxId: '9560161511',
        taxOffice: 'Çanakkale Vergi Dairesi',
        companyOrFullName: targetTender.ownerCompany || 'İhale Sahibi',
        ownerEmail: targetTender.ownerEmail || 'ihalecib@gmail.com',
        ownerPhone: targetTender.ownerPhone || '0850 840 86 95',
        city: targetTender.city || 'Türkiye',
        address: targetTender.teslimatAdresi || `${targetTender.city || 'Türkiye'} / Merkez`,
        ipAddress: String(clientIp),
        timestamp: new Date().toISOString(),
        status: 'HAZIR'
      })
    } catch (gibErr) {
      console.warn('[GIB Log Warning in DELETE tender]:', gibErr)
    }
  }

  return {
    success: true,
    archived,
    message: archived ? 'İhale başarıyla yayından kaldırılarak arşive alındı ve yasal denetim için sistemde kalıcı olarak korundu.' : 'İhale bulunamadı.'
  }
})
