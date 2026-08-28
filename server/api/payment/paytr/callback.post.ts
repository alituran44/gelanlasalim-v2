import { defineEventHandler, readBody } from 'h3'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const merchantKey = process.env.PAYTR_MERCHANT_KEY || 'paytr_demo_merchant_key'
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'paytr_demo_merchant_salt'

  const { merchant_oid, status, total_amount, hash } = body || {}

  // Validate PayTR Hash
  const hashString = `${merchant_oid}${merchantSalt}${status}${total_amount}`
  const calculatedHash = crypto
    .createHmac('sha256', merchantKey)
    .update(hashString)
    .digest('base64')

  if (hash !== calculatedHash && process.env.NODE_ENV === 'production') {
    return 'PAYTR notification failed: bad hash'
  }

  if (status === 'success') {
    // Payment confirmed - Activate subscription & log transaction
    return 'OK'
  }

  return 'OK'
})