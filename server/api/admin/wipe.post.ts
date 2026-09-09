import { clearAllTenders } from '../../utils/tendersStore'
import { clearAllBids } from '../../utils/bidsStore'
import { clearAllGibLogs } from '../../utils/gibAuditStore'

export default defineEventHandler(async (event) => {
  try {
    clearAllTenders()
    clearAllBids()
    clearAllGibLogs()

    return {
      success: true,
      message: 'Tüm sunucu ihaleleri, teklifleri ve log kayıtları başarıyla sıfırlandı.',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Sistem temizleme sırasında hata oluştu.'
    })
  }
})
