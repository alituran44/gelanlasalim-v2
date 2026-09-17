import { defineEventHandler, readBody } from 'h3'
import { markAsRead, markAllAsReadForUser } from '~~/server/utils/notificationsStore'
import { resolveSession, sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const session = resolveSession(event)
  const email = (session.userEmail || body.email || 'ihalecib@gmail.com') as string

  if (body.all) {
    const updatedCount = markAllAsReadForUser(email)
    return {
      success: true,
      message: `${updatedCount} adet bildirim okundu olarak işaretlendi (Kural COM-009).`,
      count: updatedCount
    }
  }

  if (body.id) {
    const ok = markAsRead(body.id, email)
    return {
      success: ok,
      message: ok ? 'Bildirim okundu olarak işaretlendi.' : 'Bildirim bulunamadı.'
    }
  }

  return {
    success: false,
    message: 'Bildirim kimliği (id) veya tümü (all: true) belirtilmelidir.'
  }
})
