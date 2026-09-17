import { defineEventHandler, readBody } from 'h3'
import { deleteNotification, clearNotificationsForUser } from '~~/server/utils/notificationsStore'
import { resolveSession, sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const session = resolveSession(event)
  const email = (session.userEmail || body.email || 'ihalecib@gmail.com') as string

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
