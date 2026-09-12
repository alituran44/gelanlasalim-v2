import { defineEventHandler, readBody, getRequestHeaders } from 'h3'
import { deleteNotification, clearNotificationsForUser } from '~~/server/utils/notificationsStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const headers = getRequestHeaders(event)
  const email = (body.email || headers['x-user-email'] || 'ihalecib@gmail.com') as string

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
