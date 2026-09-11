import { defineEventHandler, getQuery, getRequestHeaders } from 'h3'
import { getNotificationsForUser, getAllNotifications } from '~~/server/utils/notificationsStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const headers = getRequestHeaders(event)
  const email = (query.email || headers['x-user-email'] || 'ihalecib@gmail.com') as string

  const userNotifications = getNotificationsForUser(email)

  const unreadCount = userNotifications.filter(n => !n.read).length
  const criticalCount = userNotifications.filter(n => n.category === 'CRITICAL').length

  return {
    success: true,
    count: userNotifications.length,
    unreadCount,
    criticalCount,
    notifications: userNotifications
  }
})
