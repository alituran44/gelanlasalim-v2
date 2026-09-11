import { defineEventHandler, readBody, createError } from 'h3'
import { respondToJoinRequest } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { vkn, requestId, approved, adminEmail, assignedRole } = body

  if (!vkn || !requestId || approved === undefined || !adminEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN, talep kimliği (requestId), onay durumu ve yönetici e-postası zorunludur.'
    })
  }

  const result = respondToJoinRequest({
    vkn,
    requestId,
    approved: Boolean(approved),
    adminEmail,
    assignedRole
  })

  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: result.error || 'Katılım talebi yanıtlanamadı.'
    })
  }

  return {
    success: true,
    message: approved ? 'Katılım talebi onaylandı, yeni çalışan yetkilendirildi.' : 'Katılım talebi reddedildi.'
  }
})
