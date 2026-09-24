import { defineEventHandler, readBody, setHeader, createError } from 'h3'
import { sanitizePayload } from '../../utils/authGuard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  try {
    const rawBody = await readBody(event)
    if (!rawBody) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçersiz abonelik verisi.'
      })
    }

    const body = sanitizePayload(rawBody)

    if (!body.email || !String(body.email).includes('@')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçerli bir e-posta adresi zorunludur.'
      })
    }

    return {
      success: true,
      message: 'Bülten aboneliğiniz başarıyla kaydedildi.',
      email: String(body.email).toLowerCase().trim(),
      subscribedAt: new Date().toISOString()
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Abonelik işlemi sırasında hata oluştu.'
    })
  }
})
