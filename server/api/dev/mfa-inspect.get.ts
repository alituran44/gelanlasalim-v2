import { defineEventHandler, createError, getQuery } from 'h3'
import { getMfaOtpForDev } from '~~/server/utils/mfaStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler((event) => {
  // 🛡️ Katı Derleme ve Çalışma Zamanı Koruması (Item 6):
  // Production, Preview, Staging veya herhangi bir bulut dağıtımında (Vercel) bu uç nokta tamamen yok sayılır (404).
  // Yalnızca lokal makinede ve açıkça ENABLE_DEV_MFA=true bayrağı tanımlandığında çalışabilir.
  const isStrictLocalDev = 
    process.env.NODE_ENV === 'development' &&
    !process.env.VERCEL &&
    !process.env.VERCEL_ENV &&
    process.env.ENABLE_DEV_MFA === 'true'

  if (!isStrictLocalDev) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      targetResource: '/api/dev/mfa-inspect',
      actionTaken: 'BLOCKED_404',
      details: { reason: 'Attempt to access dev inspect endpoint in non-dev or cloud environment' }
    })
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }

  // Eğer lokal geliştirme için gizli bir secret tanımlıysa başlık kontrolü yap
  const devSecret = process.env.DEV_MFA_SECRET
  if (devSecret && event.node.req.headers['x-dev-secret'] !== devSecret) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Geçersiz geliştirici denetim anahtarı (x-dev-secret).'
    })
  }

  const query = getQuery(event)
  const phoneOrEmail = (query.phoneOrEmail as string || '').trim().toLowerCase()

  if (!phoneOrEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'phoneOrEmail parametresi zorunludur.'
    })
  }

  const record = getMfaOtpForDev(phoneOrEmail)
  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hedef için aktif MFA kaydı bulunamadı.'
    })
  }

  return {
    phoneOrEmail: record.phoneOrEmail,
    code: record.code,
    purpose: record.purpose,
    expiresAt: record.expiresAt,
    remainingSeconds: Math.max(0, Math.round((record.expiresAt - Date.now()) / 1000))
  }
})
