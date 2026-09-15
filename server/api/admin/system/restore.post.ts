import { defineEventHandler, readBody, createError } from 'h3'
import { restoreFullSystemSnapshot, testBackupRestoreCycle } from '~~/server/utils/systemEnvironmentStore'
import { requireAdmin, requireMfaVerification } from '~~/server/utils/authGuard'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  // 🛡️ 1. Sunucu Tarafı Yetkili Admin Kontrolü
  const session = requireAdmin(event)

  const body = await readBody(event)

  // Eğer test modu ise, tam bir döngü self-test gerçekleştir
  if (body?.mode === 'SELF_TEST') {
    const testResult = testBackupRestoreCycle()
    return {
      success: true,
      message: 'Otomatik yedekleme ve geri yükleme döngü testi başarıyla tamamlandı.',
      testResult
    }
  }

  // 🛡️ 2. Gerçek Snapshot Geri Yükleme için Katman 3 Purpose-Bound MFA Zorunluluğu
  const mfa = requireMfaVerification(event, 'SYSTEM_RESTORE')

  if (!body || !body.snapshot) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geri yüklenecek snapshot verisi eksik.'
    })
  }

  try {
    const restoreResult = restoreFullSystemSnapshot(body.snapshot)

    logSecurityEvent(event, {
      eventType: 'SYSTEM_RESTORE',
      severity: 'CRITICAL',
      actorEmail: session.userEmail,
      actionTaken: 'ALLOWED',
      details: {
        message: restoreResult.message,
        checksum: restoreResult.restoredChecksum,
        mfaVerifiedUser: mfa.phoneOrEmail
      }
    })

    return {
      success: true,
      message: restoreResult.message,
      checksum: restoreResult.restoredChecksum
    }
  } catch (err: any) {
    throw createError({
      statusCode: 422,
      statusMessage: err.message || 'Yedek geri yüklenirken hata oluştu.'
    })
  }
})
