import { defineEventHandler, readBody, createError } from 'h3'
import { createSession, setSessionCookie } from '~~/server/utils/sessionStore'
import { sanitizeXss, sanitizePayload } from '~~/server/utils/authGuard'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { getAllCompanies } from '~~/server/utils/companyVerificationStore'
import { verifyUserCredential } from '~~/server/utils/credentialStore'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
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

  // 🛡️ SEC-PWD: Şifre Doğrulama (Scrypt + Salt + Timing-Safe)
  const credentialCheck = verifyUserCredential(email, password)
  if (!credentialCheck.valid) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      actorEmail: email,
      actionTaken: 'BLOCKED_403',
      details: { reason: 'Hatalı kullanıcı şifresi denemesi.' }
    })
    throw createError({
      statusCode: 401,
      statusMessage: 'Giriş başarısız: E-posta adresi veya şifre hatalı.'
    })
  }

  // Pre-production: Şirket eşleşmesini kontrol et
  const allCompanies = getAllCompanies()
  const matchedCompany = allCompanies.find(c =>
    (c.adminEmail && c.adminEmail.toLowerCase() === email) ||
    (Array.isArray(c.members) && c.members.some(m => ((m.userEmail || (m as any).email || '').toLowerCase() === email) && m.status === 'ACTIVE')) ||
    (companyVkn && c.vkn === companyVkn)
  )

  let role = 'GÖRÜNTÜLEYİCİ'
  let userName = email.split('@')[0]
  let isVerified = false
  let targetVkn = companyVkn

  if (matchedCompany) {
    targetVkn = matchedCompany.vkn
    isVerified = matchedCompany.status === 'VERIFIED'
    if (matchedCompany.adminEmail && matchedCompany.adminEmail.toLowerCase() === email) {
      role = 'FİRMA_YÖNETİCİSİ'
      userName = (matchedCompany as any).adminName || userName
    } else if (Array.isArray(matchedCompany.members)) {
      const member = matchedCompany.members.find(m => ((m.userEmail || (m as any).email || '').toLowerCase() === email))
      if (member) {
        role = member.role
        userName = member.fullName || (member as any).name || userName
      }
    }
  } else {
    const candidateRole = body.role && typeof body.role === 'string' ? sanitizeXss(body.role) : 'individual'
    // 🛡️ SEC-ADM: Normal giriş uç noktasından asla ADMIN rolü veya yetkisi verilemez
    role = (candidateRole === 'ADMIN' || candidateRole === 'admin') ? 'individual' : candidateRole
    if (body.name && typeof body.name === 'string') {
      userName = sanitizeXss(body.name)
    }
    isVerified = false
  }

  // 🛡️ SEC-ADM: Admin oturumu YALNIZCA /api/auth/admin-login üzerinden kriptografik secret key ile açılabilir.
  // Normal /api/auth/login üzerinden e-posta örüntüsü veya istek gövdesi ile admin yetkisi kazanılması KESİNLİKLE engellenmiştir.
  const isAdmin = false

  // 🛡️ Sunucu tarafında oturum oluştur ve imzalı httpOnly cookie ekle
  const { session, token } = createSession({
    userEmail: email,
    userName,
    companyVkn: targetVkn || undefined,
    companyRole: role,
    isCompanyVerified: isVerified,
    isAdmin: false
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
