import { addGibLog, GibAuditLogItem } from '~~/server/utils/gibAuditStore'
import { requireAuth, sanitizePayload } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  // 🛡️ SEC-001: Oturum Doğrulaması
  requireAuth(event)

  try {
    const rawBody = await readBody<Partial<GibAuditLogItem>>(event)
    if (!rawBody || !rawBody.tenderId || !rawBody.tenderTitle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'İhale ID (tenderId) ve ihale başlığı zorunludur.'
      })
    }

    // 🛡️ SEC-013: Girdi Temizleme
    const body = sanitizePayload(rawBody)

    // 🛡️ SEC-IP: Güvenilir İstemci IP Çözümleme
    const clientIp = resolveClientIp(event)
    const headers = getRequestHeaders(event)
    const userAgent = headers['user-agent'] || 'Web Client'

    const logEntry = addGibLog({
      ...body,
      ipAddress: body.ipAddress || clientIp,
      userAgent: body.userAgent || userAgent,
      timestamp: body.timestamp || new Date().toISOString()
    })

    return {
      success: true,
      message: 'GİB BTRANS ihale denetim kaydı başarıyla oluşturuldu.',
      log: logEntry
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'GİB log kaydı oluşturulurken hata.'
    })
  }
})
