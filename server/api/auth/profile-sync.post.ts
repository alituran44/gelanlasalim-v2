import { defineEventHandler, readBody, createError } from 'h3'
import { createSession, setSessionCookie } from '~~/server/utils/sessionStore'
import { resolveSession, sanitizePayload, sanitizeXss } from '~~/server/utils/authGuard'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event).catch(() => ({}))
  const body = sanitizePayload(rawBody || {})

  const email = sanitizeXss(body.email || '').toLowerCase().trim()
  if (!email || !email.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçerli bir e-posta adresi giriniz.'
    })
  }

  // Mevcut oturumu çöz (varsa VKN ve rol bilgilerini koru)
  const currentSession = resolveSession(event)
  
  let userName = sanitizeXss(body.name || body.username || '')
  if (!userName && currentSession.isAuthenticated && currentSession.userName) {
    userName = currentSession.userName
  }
  if (!userName) {
    userName = email.split('@')[0]
  }

  const role = body.role === 'company' ? 'company' : 'individual'
  const companyVkn = currentSession.companyVkn || body.companyVkn || undefined

  // 🛡️ Güvenlik Kuralı: Normal profil güncellemesiyle asla admin yetkisi kazanılamaz!
  const isAdmin = false

  // Sunucuda oturumu güncelle ve imzalı httpOnly cookie'leri yenile
  const { session, token } = createSession({
    userEmail: email,
    userName,
    companyVkn,
    companyRole: role,
    isCompanyVerified: currentSession.isCompanyVerified || false,
    isAdmin: false,
    isPremium: currentSession.isPremium || false,
    subscriptionPlan: currentSession.subscriptionPlan || 'Standart Plan'
  })

  setSessionCookie(event, token)

  logSecurityEvent(event, {
    eventType: 'AUTH_SUCCESS',
    severity: 'LOW',
    actorEmail: email,
    actionTaken: 'ALLOWED',
    details: { 
      action: 'PROFILE_SYNC', 
      email, 
      userName, 
      isGoogleAuth: Boolean(body.isGoogleAuth) 
    }
  })

  return {
    success: true,
    message: 'Profil ve e-posta adresi başarıyla senkronize edildi.',
    user: {
      email: session.userEmail,
      name: session.userName,
      companyVkn: session.companyVkn,
      companyRole: session.companyRole,
      isCompanyVerified: session.isCompanyVerified,
      isAdmin: false,
      isPremium: session.isPremium,
      subscriptionPlan: session.subscriptionPlan
    }
  }
})
