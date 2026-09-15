import { defineEventHandler } from 'h3'
import { clearSessionCookie, destroySession, getSessionCookie } from '~~/server/utils/sessionStore'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler((event) => {
  const token = getSessionCookie(event)
  if (token) {
    destroySession(token)
  }

  clearSessionCookie(event)

  logSecurityEvent(event, {
    eventType: 'AUTH_LOGOUT',
    severity: 'LOW',
    actionTaken: 'ALLOWED',
    details: { message: 'Kullanıcı oturumu başarıyla kapatıldı.' }
  })

  return {
    success: true,
    message: 'Oturum güvenli bir şekilde kapatıldı.'
  }
})
