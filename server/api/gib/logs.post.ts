import { addGibLog, GibAuditLogItem } from '~~/server/utils/gibAuditStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const body = await readBody<Partial<GibAuditLogItem>>(event)
    if (!body || !body.tenderId || !body.tenderTitle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'İhale ID (tenderId) ve ihale başlığı zorunludur.'
      })
    }

    // Capture real client IP address per 5651 & VUK guidelines
    const headers = getRequestHeaders(event)
    const forwardedFor = headers['x-forwarded-for']
    const clientIp = typeof forwardedFor === 'string' 
      ? forwardedFor.split(',')[0].trim()
      : (headers['x-real-ip'] || headers['cf-connecting-ip'] || event.node.req.socket?.remoteAddress || '127.0.0.1')

    const userAgent = headers['user-agent'] || 'Web Client'

    const logEntry = addGibLog({
      ...body,
      ipAddress: body.ipAddress || String(clientIp),
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
