import { getAllTenders } from '~~/server/utils/tendersStore'
import { getAllGibLogs, addGibLog, GibAuditLogItem } from '~~/server/utils/gibAuditStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const tenders = getAllTenders()
    const existingLogs = getAllGibLogs()
    const existingTenderIds = new Set(existingLogs.map(l => l.tenderId))

    const newlySynced: GibAuditLogItem[] = []

    for (const t of tenders) {
      if (!existingTenderIds.has(t.id)) {
        const syncedItem = addGibLog({
          tenderId: t.id,
          tenderTitle: t.baslik,
          action: 'IHALE_ACILDI',
          actionLabel: '595 VUK Tebliği Uyarınca Yer Sağlayıcı İhale Kaydı',
          category: t.kategori || t.mainCategory || 'Genel Satın Alma',
          budget: t.butce || '💬 Teklif Usulü',
          direction: t.usul || (t.ihaleYonu === 'eksiltme' ? 'Açık Eksiltme' : 'Kapalı Zarf Usulü'),
          taxIdType: 'VKN',
          taxId: (t as any).taxId || (t as any).vkn || '9560161511',
          taxOffice: (t as any).taxOffice || `${t.city || 'İstanbul'} Vergi Dairesi`,
          companyOrFullName: t.ownerCompany || 'Doğrulanmış İhale Sahibi',
          ownerEmail: t.ownerEmail || 'ihalecib@gmail.com',
          ownerPhone: (t as any).ownerPhone || '0850 840 86 95',
          city: t.city || 'Türkiye',
          address: (t as any).address || `${t.city || 'Türkiye'} / Merkez`,
          ipAddress: (t as any).ipAddress || '195.175.254.12',
          port: '443',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) İhaleciBurada/SystemSync',
          timestamp: t.startDate || new Date().toISOString(),
          status: 'HAZIR',
          url: `https://www.ihaleciburada.com/pazar-yeri?id=${t.id}`
        })
        newlySynced.push(syncedItem)
        existingTenderIds.add(t.id)
      }
    }

    const allLogs = getAllGibLogs()

    return {
      success: true,
      message: `${newlySynced.length} yeni ihale kaydı GİB denetim havuzuna senkronize edildi.`,
      syncedCount: newlySynced.length,
      totalTenders: tenders.length,
      totalLogs: allLogs.length
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'İhale senkronizasyonu sırasında hata oluştu.'
    })
  }
})
