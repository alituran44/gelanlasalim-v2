import { defineEventHandler, readBody, createError } from 'h3'
import { requestJoinCompany } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
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
