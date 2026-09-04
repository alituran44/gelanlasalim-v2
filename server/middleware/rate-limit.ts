import { defineEventHandler, getRequestHeader, setResponseHeader, createError } from 'h3'

// In-memory rate limiting store (sliding window per IP)
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export default defineEventHandler((event) => {
  const path = event.node.req.url || ''

  // Apply rate limiting strictly to /api routes
  if (!path.startsWith('/api')) {
    return
  }

  // Get client IP address
  const forwardedFor = getRequestHeader(event, 'x-forwarded-for')
  const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : '') ||
    event.node.req.socket.remoteAddress ||
    '127.0.0.1'

  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window

  // Stricter limit for SMS, OTP, and Payment endpoints (15 req/min)
  // Standard limit for other API endpoints (60 req/min)
  const isSensitive = path.includes('netgsm') || path.includes('smtp') || path.includes('payment') || path.includes('dogrulama')
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
