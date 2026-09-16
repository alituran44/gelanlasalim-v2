import { defineEventHandler, createError, getQuery } from 'h3'
import { getMfaOtpForDev } from '~~/server/utils/mfaStore'

export default defineEventHandler((event) => {
  // 🛡️ Katı Derleme ve Çalışma Zamanı Koruması:
  // Production / Staging ortamında bu endpoint tamamen kapalıdır (404).
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
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
