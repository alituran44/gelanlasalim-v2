import { defineEventHandler, createError } from 'h3'
import { clearAllTenders } from '../../utils/tendersStore'
import { clearAllBids } from '../../utils/bidsStore'
import { clearAllGibLogs } from '../../utils/gibAuditStore'
import { requireAdmin, requireMfaVerification } from '../../utils/authGuard'
import { logSecurityEvent } from '../../utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  // 🛡️ 1. Sunucu Tarafı Yetkili Admin Oturumu Kontrolü
  const session = requireAdmin(event)

  // 🛡️ 2. Katman 3: Amaca Bağlı MFA Doğrulama Zorunluluğu (ADMIN_WIPE)
  const mfa = requireMfaVerification(event, 'ADMIN_WIPE')

  try {
    clearAllTenders()
    clearAllBids()
    clearAllGibLogs()

    logSecurityEvent(event, {
      eventType: 'SYSTEM_WIPE',
      severity: 'CRITICAL',
      actorEmail: session.userEmail,
      actionTaken: 'ALLOWED',
      details: {
        message: 'Tüm sunucu verileri başarıyla sıfırlandı.',
        mfaVerifiedUser: mfa.phoneOrEmail
      }
    })

    return {
      success: true,
      message: 'Tüm sunucu ihaleleri, teklifleri ve log kayıtları MFA onayı ile başarıyla sıfırlandı.',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Sistem temizleme sırasında hata oluştu.'
    })
  }
})
