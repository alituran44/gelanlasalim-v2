import { defineEventHandler, readBody, sendRedirect } from 'h3'
import crypto from 'node:crypto'
import { sanitizePayload } from '../../../utils/authGuard'
import { logSecurityEvent } from '../../../utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event).catch(() => ({}))
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody || {})

  // 🛡️ KRİTİK GÜVENLİK DÜZELTMESİ (Item 4): Fail-Closed Prensibi
  // Boş gövde veya sahte istek durumunda ASLA varsayılan 'Approved' kabul edilmez!
  if (!body || Object.keys(body).length === 0) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      targetResource: '/api/payment/paynkolay/callback',
      actionTaken: 'BLOCKED_302',
      details: { reason: 'Empty or missing callback payload' }
    })
    return sendRedirect(event, '/abonelik?payment=fail&provider=paynkolay&reason=Gecersiz_istek_govdesi', 302)
  }

  const secretKey = (process.env.PAYNKOLAY_SECRET_KEY || 'paynkolay_secret_key_demo').trim()
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'

  // 1. Kriptografik SHA-512 Hash Doğrulaması
  let isSignatureValid = false

  if (body.HASH) {
    try {
      let expectedHash = ''
      if (body.HASHPARAMS) {
        const paramNames = String(body.HASHPARAMS).split(':')
        const concatenated = paramNames.map(p => (body[p] !== undefined && body[p] !== null ? String(body[p]) : '')).join('')
        expectedHash = crypto.createHash('sha512').update(concatenated + secretKey).digest('base64')
      } else if (body.HASHPARAMSVAL) {
        expectedHash = crypto.createHash('sha512').update(String(body.HASHPARAMSVAL) + secretKey).digest('base64')
      } else {
        const fallbackStr = `${body.clientid || ''}${body.oid || body.OrderId || ''}${body.AuthCode || ''}${body.ProcReturnCode || ''}${body.Response || ''}${body.mdStatus || ''}${secretKey}`
        expectedHash = crypto.createHash('sha512').update(fallbackStr).digest('base64')
      }

      const bufExpected = Buffer.from(expectedHash)
      const bufReceived = Buffer.from(String(body.HASH))
      if (bufExpected.length === bufReceived.length && crypto.timingSafeEqual(bufExpected, bufReceived)) {
        isSignatureValid = true
      }
    } catch (hashErr) {
      isSignatureValid = false
    }
  } else if (!isProd && secretKey === 'paynkolay_secret_key_demo') {
    // Yalnızca lokal test ortamında ve demo anahtarla simülasyon toleransı
    isSignatureValid = true
  }

  // 2. İmza Doğrulama Kontrolü
  if (!isSignatureValid) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'CRITICAL',
      targetResource: '/api/payment/paynkolay/callback',
      actionTaken: 'BLOCKED_302',
      details: {
        reason: 'Paynkolay 3D secure callback hash mismatch or missing signature',
        receivedHash: body.HASH ? 'PRESENT_INVALID' : 'MISSING'
      }
    })
    return sendRedirect(event, '/abonelik?payment=fail&provider=paynkolay&reason=' + encodeURIComponent('Guvenlik_imzasi_dogrulanamadi'), 302)
  }

  // 3. İşlem ve 3D Secure Durum Kontrolü
  const mdStatus = String(body.mdStatus || '').trim()
  const responseMsg = String(body.Response || body.response || '').trim()
  const procReturnCode = String(body.ProcReturnCode || '').trim()

  const isApproved = (mdStatus === '1') && (responseMsg.toLowerCase() === 'approved' || procReturnCode === '00')

  if (isApproved) {
    const orderId = body.oid || body.OrderId || ''
    return sendRedirect(event, `/panel?payment=success&provider=paynkolay${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ''}`, 302)
  }

  const failReason = body.ErrMsg || body.errMsg || body.Response || 'Odeme_onaylanamadi'
  return sendRedirect(event, '/abonelik?payment=fail&provider=paynkolay&reason=' + encodeURIComponent(failReason), 302)
})
