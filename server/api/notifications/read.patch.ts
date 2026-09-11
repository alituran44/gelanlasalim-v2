import { defineEventHandler, readBody, getRequestHeaders } from 'h3'
import { markAsRead, markAllAsReadForUser } from '~~/server/utils/notificationsStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const headers = getRequestHeaders(event)
  const email = (body.email || headers['x-user-email'] || 'ihalecib@gmail.com') as string

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
