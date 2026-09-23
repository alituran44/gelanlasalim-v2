import { defineEventHandler, getRequestHeader, setResponseHeader, createError } from 'h3'
import { logSecurityEvent } from '../utils/securityAuditStore'

// İzin verilen güvenli kökenler (Origins - Whitelist)
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)?ihaleciburada\.com$/,
  /^https:\/\/[a-zA-Z0-9-]+-.*\.vercel\.app$/ // Vercel Preview Deployments
]

// CSRF denetiminden muaf harici webhook ve entegrasyon uç noktaları (İmza/Secret ile korunurlar)
const CSRF_EXEMPT_ROUTES = [
  '/api/v1/payment/callback',
  '/api/tenders/sync',
  '/api/v1/erp/webhook-dispatch'
]

/**
 * 🛡️ SEC-CSRF & CORS Guard: Siteler Arası İstek Sahteciliği ve Katı CORS Filtresi
 * - Hassas API rotalarında wildcard '*' yerine yalnızca yetkili domain whitelist'ine izin verir.
 * - Mutasyon yapan (POST, PUT, PATCH, DELETE) tüm API isteklerinde Origin ve Referer başlıklarını denetler.
 */
export default defineEventHandler((event) => {
  const method = (event.node?.req?.method || '').toUpperCase()
  const path = (event.path || event.node?.req?.url || '').split('?')[0]

  // Sadece /api/ rotalarını denetle
  if (!path.startsWith('/api/')) {
    return
  }

  const origin = getRequestHeader(event, 'origin')
  const referer = getRequestHeader(event, 'referer')
  const secFetchSite = getRequestHeader(event, 'sec-fetch-site')

  // 1. Dinamik CORS Yönetimi (Wildcard '*' kullanımını engelleyerek whitelist eşleştirmesi)
  if (origin && ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin))) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', origin)
    setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setResponseHeader(event, 'Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, x-user-email, x-admin-token')
    setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    setResponseHeader(event, 'Vary', 'Origin')

    if (method === 'OPTIONS') {
      event.node.res.statusCode = 204
      return ''
    }
  }

  // Sadece mutasyon (veri değiştiren) isteklerde CSRF denetimi yap
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return
  }

  // Muafiyet listesi kontrolü (Bank POS callback, ERP webhook vb.)
  if (CSRF_EXEMPT_ROUTES.some(exempt => path === exempt || path.startsWith(`${exempt}/`))) {
    return
  }

  // 2. Tarayıcı Sec-Fetch-Site 'cross-site' ise ve istek mutasyon ise doğrudan engelle
  if (secFetchSite === 'cross-site') {
    logSecurityEvent(event, {
      eventType: 'ROLE_VIOLATION',
      severity: 'CRITICAL',
      targetResource: path,
      actionTaken: 'BLOCKED_403',
      details: {
        reason: 'Cross-Site Fetch Denemesi Engellendi (Sec-Fetch-Site: cross-site)',
        origin,
        referer
      }
    })

    throw createError({
      statusCode: 403,
      statusMessage: 'Erişim engellendi: Siteler arası yetkisiz istek sahteciliği tespit edildi (CSRF Koruması).'
    })
  }

  // 3. Origin veya Referer kontrolü
  const sourceToValidate = origin || referer

  // Test ortamı / Postman / curl (origin veya referer gönderilmiyorsa Bearer veya custom header gereklidir)
  if (!sourceToValidate) {
    return
  }

  try {
    const parsedUrl = new URL(sourceToValidate)
    const originHost = `${parsedUrl.protocol}//${parsedUrl.host}`

    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(originHost))

    if (!isAllowed) {
      logSecurityEvent(event, {
        eventType: 'ROLE_VIOLATION',
        severity: 'CRITICAL',
        targetResource: path,
        actionTaken: 'BLOCKED_403',
        details: {
          reason: 'Bilinmeyen veya yetkisiz kökenden (Origin) API çağrısı engellendi.',
          originHost,
          method
        }
      })

      throw createError({
        statusCode: 403,
        statusMessage: 'Yetkisiz kaynak (CORS/CSRF İhlali): Bu alandan API çağrısı yapılmasına izin verilmiyor.'
      })
    }
  } catch {
    // Geçersiz Origin URL biçimi
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz Origin/Referer başlığı.'
    })
  }
})
