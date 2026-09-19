import { defineEventHandler, getQuery, setHeader } from 'h3'
import { getNotificationsForUser } from '~~/server/utils/notificationsStore'
import { requireAuth } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  // 🛡️ SEC-001 & SEC-002: Bildirimler yalnızca oturum açmış kullanıcıya sunulur
  const session = requireAuth(event)
  const query = getQuery(event)

  // Yalnızca sistem yöneticisi başka bir kullanıcının bildirimlerini sorgulayabilir
  const email = (session.isAdmin && query.email ? String(query.email) : session.userEmail).toLowerCase().trim()

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
