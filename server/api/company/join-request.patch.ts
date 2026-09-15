import { defineEventHandler, readBody, createError } from 'h3'
import { respondToJoinRequest } from '~~/server/utils/companyVerificationStore'
import { assertTenantAccess, requireRole } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { vkn, requestId, approved, assignedRole } = body

  if (!vkn || !requestId || approved === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN, talep kimliği (requestId) ve onay durumu zorunludur.'
    })
  }

  // 🛡️ SEC-002 & SEC-006: Tenant İzolasyonu, IDOR ve Rol Kontrolü
  // Katılım taleplerini yalnızca ilgili firmanın yöneticisi veya sistem yöneticisi yanıtlayabilir
  assertTenantAccess(event, vkn)
  const session = requireRole(event, ['FİRMA_YÖNETİCİSİ'])
  const adminEmail = session.userEmail

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
