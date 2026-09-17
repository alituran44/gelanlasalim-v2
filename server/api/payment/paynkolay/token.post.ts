import { defineEventHandler, readBody } from 'h3'
import crypto from 'node:crypto'
import { sanitizePayload } from '../../../utils/authGuard'
import { resolveClientIp } from '../../../utils/clientIp'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody || {})

  const merchantId = process.env.PAYNKOLAY_MERCHANT_ID || '10001'
  const secretKey = process.env.PAYNKOLAY_SECRET_KEY || 'paynkolay_secret_key_demo'
  const terminalId = process.env.PAYNKOLAY_TERMINAL_ID || 'NKOLAY01'

  // 🛡️ SEC-IP: Güvenilir İstemci IP Çözümleme
  const userIp = resolveClientIp(event)
  const orderId = 'IB-NK-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
  const email = body.email || 'ihalecib@gmail.com'
  const paymentAmount = Math.round((Number(body.amount) || 900) * 100)
  const userName = body.name || 'Yetkili Kullanici'
  const okUrl = body.okUrl || 'https://ihaleciburada.com/panel?payment=success&provider=paynkolay'
  const failUrl = body.failUrl || 'https://ihaleciburada.com/abonelik?payment=fail&provider=paynkolay'

  // Paynkolay / N Kolay SHA-512 Hash Generation
  const hashString = `${merchantId}${terminalId}${orderId}${paymentAmount}${okUrl}${failUrl}${secretKey}`
  const paynkolayHash = crypto.createHash('sha512').update(hashString).digest('base64')

  return {
    status: 'success',
    provider: 'paynkolay',
    orderId,
    amount: body.amount || 900,
    hash: paynkolayHash,
    gatewayUrl: 'https://sanalpos.paynkolay.com.tr/fim/est3Dgate'
  }
})
