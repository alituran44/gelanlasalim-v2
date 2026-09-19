import { defineEventHandler, readBody, setHeader, createError, getRequestHeader } from 'h3'
import { timingSafeEqual } from 'node:crypto'
import { syncTendersBatch, TenderItem } from '../../utils/tendersStore'
import { resolveSession, sanitizePayload } from '../../utils/authGuard'
import { ADMIN_SECRET_TOKEN } from '../../utils/sessionStore'
import { logSecurityEvent } from '../../utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  // 🛡️ KRİTİK GÜVENLİK DÜZELTMESİ (Item 3):
  // İhale senkronizasyonu yalnızca yetkili Admin veya geçerli servis anahtarı (Service Secret) ile yapılabilir.
  const session = resolveSession(event)
  const syncSecretHeader = (getRequestHeader(event, 'x-sync-secret') || '').trim()
  const authHeader = (getRequestHeader(event, 'authorization') || '').trim()
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : ''

  const providedSecret = syncSecretHeader || bearerToken
  const configuredSecret = (process.env.TENDER_SYNC_SECRET || process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_TOKEN).trim()

  let isSecretAuthorized = false
  if (providedSecret && configuredSecret) {
    try {
      const bufA = Buffer.from(providedSecret)
      const bufB = Buffer.from(configuredSecret)
      if (bufA.length === bufB.length && timingSafeEqual(bufA, bufB)) {
        isSecretAuthorized = true
      }
    } catch {
      isSecretAuthorized = false
    }
  }

  const isAuthorized = session.isAdmin || isSecretAuthorized

  if (!isAuthorized) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'CRITICAL',
      targetResource: '/api/tenders/sync',
      actionTaken: 'BLOCKED_401',
      details: { reason: 'Unauthorized tender sync attempt without admin session or valid service secret' }
    })
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz işlem: Canlı ihale senkronizasyonu için yönetici oturumu veya x-sync-secret anahtarı zorunludur.'
    })
  }

  try {
    const rawBody = await readBody<{ tenders?: TenderItem[] }>(event)
    const body = sanitizePayload(rawBody)
    const incoming = Array.isArray(body?.tenders) ? body.tenders : []
    const updated = syncTendersBatch(incoming)

    logSecurityEvent(event, {
      eventType: 'CRITICAL_ACTION_LOGGED',
      severity: 'LOW',
      actorEmail: session.userEmail || 'system:sync-service',
      targetResource: '/api/tenders/sync',
      actionTaken: 'ALLOWED',
      details: { action: 'TENDERS_SYNCED', count: updated.length }
    })

    return {
      success: true,
      count: updated.length,
      tenders: updated
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Sync failed',
      tenders: []
    }
  }
})
