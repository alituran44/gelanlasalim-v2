import { defineEventHandler, readBody, createError } from 'h3'
import { requestJoinCompany } from '~~/server/utils/companyVerificationStore'
import { sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const { vkn, userEmail, fullName, requestedRole, note } = body

  if (!vkn || !userEmail || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN, e-posta ve isim-soyad zorunludur.'
    })
  }

  const result = requestJoinCompany({
    vkn,
    userEmail,
    fullName,
    requestedRole,
    note
  })

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error || 'Katılım talebi iletilemedi.'
    })
  }

  return {
    success: true,
    message: 'Katılım talebiniz firma yöneticisine iletildi. Onaylandığında bildirim alacaksınız.',
    request: result.request
  }
})
