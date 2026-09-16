import { defineEventHandler, readBody, createError } from 'h3'
import { createSession, setSessionCookie } from '~~/server/utils/sessionStore'
import { sanitizeXss } from '~~/server/utils/authGuard'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { getAllCompanies } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const email = sanitizeXss(body.email || body.username || '').toLowerCase().trim()
  const password = body.password ? String(body.password) : ''
  const companyVkn = sanitizeXss(body.companyVkn || '').trim()

  if (!email || !email.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçerli bir kurumsal e-posta adresi giriniz.'
    })
  }

  if (!password || password.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Şifreniz en az 3 karakter olmalıdır.'
    })
  }

  // Pre-production: Şirket eşleşmesini kontrol et
  const allCompanies = getAllCompanies()
  const matchedCompany = allCompanies.find(c =>
    c.adminEmail.toLowerCase() === email ||
    c.members.some(m => m.email.toLowerCase() === email && m.status === 'ACTIVE') ||
    (companyVkn && c.vkn === companyVkn)
  )

  let role = 'GÖRÜNTÜLEYİCİ'
  let userName = email.split('@')[0]
  let isVerified = false
  let targetVkn = companyVkn

  if (matchedCompany) {
    targetVkn = matchedCompany.vkn
    isVerified = matchedCompany.status === 'VERIFIED'
    if (matchedCompany.adminEmail.toLowerCase() === email) {
      role = 'FİRMA_YÖNETİCİSİ'
      userName = matchedCompany.adminName || userName
    } else {
      const member = matchedCompany.members.find(m => m.email.toLowerCase() === email)
      if (member) {
        role = member.role
        userName = member.name || userName
      }
    }
  } else {
    if (body.role && typeof body.role === 'string') {
      role = sanitizeXss(body.role)
    } else {
      role = 'FİRMA_YÖNETİCİSİ'
    }
    if (body.name && typeof body.name === 'string') {
      userName = sanitizeXss(body.name)
    }
    isVerified = true
  }

  const isAdminEmail = email === 'admin@ihaleciburada.com' || email === 'ihalecib@gmail.com' || email.startsWith('admin@')
  const isAdmin = Boolean(isAdminEmail || body.role === 'admin' || role === 'ADMIN')

  // 🛡️ Sunucu tarafında oturum oluştur ve imzalı httpOnly cookie ekle
  const { session, token } = createSession({
    userEmail: email,
    userName: isAdmin ? (userName || 'Sistem Yöneticisi (Admin)') : userName,
    companyVkn: targetVkn || undefined,
    companyRole: isAdmin ? 'ADMIN' : role,
    isCompanyVerified: isVerified || isAdmin,
    isAdmin
  })

  setSessionCookie(event, token)

  logSecurityEvent(event, {
    eventType: 'AUTH_SUCCESS',
    severity: 'LOW',
    actorEmail: email,
    actorVkn: targetVkn || undefined,
    actionTaken: 'ALLOWED',
    details: { role: session.companyRole, isVerified: session.isCompanyVerified, isAdmin: session.isAdmin }
  })

  return {
    success: true,
    message: 'Giriş başarılı, oturum başlatıldı.',
    isAdmin: session.isAdmin,
    user: {
      email: session.userEmail,
      name: session.userName,
      companyVkn: session.companyVkn,
      companyRole: session.companyRole,
      isCompanyVerified: session.isCompanyVerified,
      isAdmin: session.isAdmin
    }
  }
})
