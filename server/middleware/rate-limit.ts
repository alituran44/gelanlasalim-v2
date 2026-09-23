import { defineEventHandler, getRequestHeader, setResponseHeader, createError } from 'h3'

import { resolveClientIp } from '../utils/clientIp'

// In-memory rate limiting store (sliding window per IP)
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Lazy cleanup function without persistent background timers
function cleanupStale(now: number) {
  if (rateLimitMap.size > 100) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }
}

export default defineEventHandler((event) => {
  const path = event.node.req.url || ''

  // Apply rate limiting strictly to /api routes
  if (!path.startsWith('/api')) {
    return
  }

  const now = Date.now()
  cleanupStale(now)

  // 🛡️ SEC-IP: Güvenilir İstemci IP Çözümleme (Trusted Proxy & Anti-Spoofing)
  // Vercel / Nginx arkasında 'x-real-ip', Cloudflare arkasında 'cf-connecting-ip' önceliklendirilir.
  const clientIp = resolveClientIp(event)

  const windowMs = 60 * 1000 // 1 minute window

  // Stricter limit for OTP, Payment, and Auth endpoints (15 req/min)
  // Standard limit for other API endpoints (60 req/min)
  const isSensitive = path.includes('smtp') || path.includes('payment') || path.includes('dogrulama') || path.includes('mfa') || path.includes('admin-login') || path.includes('/auth/login')
  const maxRequests = isSensitive ? 15 : 60

  const key = `${clientIp}:${isSensitive ? 'sensitive' : 'standard'}`
  let record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs
    }
    rateLimitMap.set(key, record)
  } else {
    record.count++
  }

  const remaining = Math.max(0, maxRequests - record.count)
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000)

  // Set standard RateLimit headers
  setResponseHeader(event, 'X-RateLimit-Limit', String(maxRequests))
  setResponseHeader(event, 'X-RateLimit-Remaining', String(remaining))
  setResponseHeader(event, 'X-RateLimit-Reset', String(resetSeconds))

  // If rate limit exceeded, block request with 429
  if (record.count > maxRequests) {
    setResponseHeader(event, 'Retry-After', String(resetSeconds))
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: {
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyiniz.',
        retryAfter: resetSeconds
      }
    })
  }
})
