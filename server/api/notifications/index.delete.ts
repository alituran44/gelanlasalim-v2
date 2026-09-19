import { defineEventHandler, readBody } from 'h3'
import { deleteNotification, clearNotificationsForUser } from '~~/server/utils/notificationsStore'
import { requireAuth, sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  // 🛡️ SEC-001 & SEC-002: Yalnızca doğrulanmış oturum sahipleri bildirim silebilir
  const session = requireAuth(event)
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const email = (session.isAdmin && body.email ? String(body.email) : session.userEmail).toLowerCase().trim()

  if (body.all) {
    const count = clearNotificationsForUser(email, body.ids)
    return {
      success: true,
      message: `${count} adet bildirim silindi.`,
      count
    }
  }

  if (body.id) {
    const ok = deleteNotification(body.id, email)
    return {
      success: ok,
      message: ok ? 'Bildirim silindi.' : 'Bildirim bulunamadı.'
    }
  }

  return {
    success: false,
    message: 'Bildirim kimliği (id) veya tümü (all: true) belirtilmelidir.'
  }
})
