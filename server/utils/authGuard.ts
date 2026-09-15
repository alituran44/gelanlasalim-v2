import type { H3Event } from 'h3'
import { getRequestHeaders, getRequestHeader, getQuery, createError } from 'h3'
import { getCompanyByVkn, getAllCompanies, CompanyRole } from './companyVerificationStore'
import { logSecurityEvent } from './securityAuditStore'
import { getSessionCookie, verifySessionToken, verifyAdminSession } from './sessionStore'
import { consumePurposeBoundMfaToken, verifyMfaOtp } from './mfaStore'

export interface UserSessionContext {
  isAuthenticated: boolean
  userEmail: string
  userName: string
  companyVkn?: string
  companyRole?: CompanyRole | string
  isCompanyVerified: boolean
  isAdmin: boolean
  clientIp: string
}

/**
 * 🛡️ SEC-001: Gerçek Sunucu Taraflı Oturum & Kimlik Çözümleme
 * İstemci tarafından serbestçe gönderilebilen x-user-email gibi başlıklara ASLA güvenmez.
 * Yalnızca imzalı httpOnly cookie veya doğrulanmış Bearer oturum token'larını esas alır.
 */
export function resolveSession(event: H3Event): UserSessionContext {
  const headers = getRequestHeaders(event)
  const authHeader = (headers['authorization'] || '').trim()
  const fwd = getRequestHeader(event, 'x-forwarded-for')
  const clientIp = (fwd ? fwd.split(',')[0].trim() : '') ||
    event.node.req.socket.remoteAddress ||
    '127.0.0.1'

  // 1. Admin Tespiti: Yalnızca gizli sunucu anahtarıyla veya doğrulanmış admin oturumuyla mümkündür.
  // Header'ın içinde "admin" kelimesi geçmesi KESİNLİKLE yetmez.
  let isAdmin = false
  const adminHeaderToken = (headers['x-admin-token'] as string || '').trim()
  if (adminHeaderToken && verifyAdminSession(adminHeaderToken)) {
    isAdmin = true
  }

  // 2. Token Çıkarma: Önce imzalı httpOnly cookie'ye bakılır, yoksa Bearer başlığına bakılır
  let rawToken = getSessionCookie(event)
  if (!rawToken && authHeader.startsWith('Bearer ')) {
    rawToken = authHeader.substring(7).trim()
    // Eğer Bearer doğrudan admin secret token'ı ise
    if (verifyAdminSession(rawToken)) {
      isAdmin = true
    }
  }

  // 3. Token'ı Sunucu Session Store ve Kriptografik İmzayla Doğrulama
  if (rawToken) {
    const serverSession = verifySessionToken(rawToken)
    if (serverSession) {
      if (serverSession.isAdmin) {
        isAdmin = true
      }

      // Şirket ve yetki çözümlemesi
      const allCompanies = getAllCompanies()
      const email = (serverSession.userEmail || '').toLowerCase().trim()
      const matchedCompany = allCompanies.find(c =>
        (c.adminEmail && c.adminEmail.toLowerCase() === email) ||
        (Array.isArray(c.members) && c.members.some(m => ((m.userEmail || (m as any).email || '').toLowerCase() === email) && m.status === 'ACTIVE'))
      )

      let role = serverSession.companyRole || ('GÖRÜNTÜLEYİCİ' as CompanyRole)
      let userName = serverSession.userName || email.split('@')[0]
      let isVerified = serverSession.isCompanyVerified

      if (matchedCompany) {
        isVerified = matchedCompany.status === 'VERIFIED'
        if (matchedCompany.adminEmail && matchedCompany.adminEmail.toLowerCase() === email) {
          role = 'FİRMA_YÖNETİCİSİ'
          userName = matchedCompany.adminName || userName
        } else if (Array.isArray(matchedCompany.members)) {
          const member = matchedCompany.members.find(m => (m.userEmail || (m as any).email || '').toLowerCase() === email)
          if (member) {
            role = member.role
            userName = member.name || userName
          }
        }
      }

      return {
        isAuthenticated: true,
        userEmail: email,
        userName,
        companyVkn: serverSession.companyVkn || matchedCompany?.vkn,
        companyRole: role,
        isCompanyVerified: isVerified,
        isAdmin,
        clientIp
      }
    }
  }

  // 4. Doğrulanmış admin gizli anahtarı varsa ama kullanıcı session'ı yoksa
  if (isAdmin) {
    return {
      isAuthenticated: true,
      userEmail: 'admin@ihaleciburada.com',
      userName: 'Sistem Yöneticisi (Admin)',
      isCompanyVerified: true,
      isAdmin: true,
      clientIp
    }
  }

  // 5. Doğrulanamayan istek: Anonim
  return {
    isAuthenticated: false,
    userEmail: '',
    userName: 'Anonim Kullanıcı',
    isCompanyVerified: false,
    isAdmin: false,
    clientIp
  }
}

/**
 * 🛡️ SEC-001: Backend Zorunlu Kimlik Doğrulama
 */
export function requireAuth(event: H3Event): UserSessionContext {
  const session = resolveSession(event)
  if (!session.isAuthenticated && !session.isAdmin) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'MEDIUM',
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: { reason: 'Giriş yapılmamış veya oturum süresi dolmuş.' }
    })
    throw createError({
      statusCode: 401,
      statusMessage: 'Bu işlem için geçerli bir oturum açmanız gerekmektedir (Kural SEC-001).'
    })
  }
  return session
}

/**
 * 🛡️ SEC-ADM: Kesin Admin Yetki Zorunluluğu
 */
export function requireAdmin(event: H3Event): UserSessionContext {
  const session = resolveSession(event)

  if (!session.isAuthenticated && !session.isAdmin) {
    logSecurityEvent(event, {
      eventType: 'AUTH_FAILURE',
      severity: 'HIGH',
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_401',
      details: { reason: 'Yetkisiz erişim: Oturum açılmamış.' }
    })
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz erişim: Bu işlem için geçerli bir yönetici oturumu açmanız gerekmektedir (Kural SEC-001).'
    })
  }

  if (!session.isAdmin) {
    logSecurityEvent(event, {
      eventType: 'ROLE_VIOLATION',
      severity: 'CRITICAL',
      actorEmail: session.userEmail || undefined,
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: { reason: 'Yetkisiz erişim: Yönetici (Admin) yetkisi doğrulanmadı.' }
    })
    throw createError({
      statusCode: 403,
      statusMessage: 'Yetkisiz işlem: Bu kaynak yalnızca doğrulanmış sistem yöneticilerine açıktır.'
    })
  }
  return session
}

/**
 * 🛡️ Katman 3: Amaca Bağlı (Purpose-Bound) MFA Doğrulama Zorunluluğu
 */
export function requireMfaVerification(event: H3Event, requiredPurpose: string): { phoneOrEmail: string } {
  const headers = getRequestHeaders(event)
  const query = getQuery(event)
  const mfaToken = (headers['x-mfa-token'] as string || query.mfaToken as string || '').trim()
  const mfaCode = (headers['x-mfa-code'] as string || query.mfaCode as string || '').trim()

  if (!mfaToken && !mfaCode) {
    logSecurityEvent(event, {
      eventType: 'MFA_FAILED',
      severity: 'HIGH',
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: { reason: 'MFA aksiyon tokenı veya onay kodu eksik.', requiredPurpose }
    })
    throw createError({
      statusCode: 403,
      statusMessage: `Bu kritik işlem için '${requiredPurpose}' amaçlı 2FA / MFA doğrulaması zorunludur (Kural SEC-009).`
    })
  }

  if (mfaToken) {
    const verification = consumePurposeBoundMfaToken(mfaToken, requiredPurpose)
    if (!verification.valid) {
      logSecurityEvent(event, {
        eventType: 'MFA_FAILED',
        severity: 'CRITICAL',
        targetResource: event.node.req.url,
        actionTaken: 'BLOCKED_403',
        details: { reason: verification.error, requiredPurpose }
      })
      throw createError({
        statusCode: 403,
        statusMessage: verification.error || 'Geçersiz veya süresi dolmuş MFA doğrulaması.'
      })
    }

    logSecurityEvent(event, {
      eventType: 'MFA_VERIFIED',
      severity: 'LOW',
      targetResource: event.node.req.url,
      actionTaken: 'ALLOWED',
      details: { purpose: requiredPurpose, phoneOrEmail: verification.phoneOrEmail }
    })

    return { phoneOrEmail: verification.phoneOrEmail || '' }
  }

  // x-mfa-code veya query.mfaCode sağlandıysa:
  const session = resolveSession(event)
  const phoneOrEmail = session.userEmail || 'admin@ihaleciburada.com'
  const otpResult = verifyMfaOtp(phoneOrEmail, mfaCode, requiredPurpose)
  if (!otpResult.valid) {
    logSecurityEvent(event, {
      eventType: 'MFA_FAILED',
      severity: 'CRITICAL',
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: { reason: otpResult.error, requiredPurpose }
    })
    throw createError({
      statusCode: 403,
      statusMessage: otpResult.error || 'Geçersiz veya süresi dolmuş MFA onay kodu.'
    })
  }

  logSecurityEvent(event, {
    eventType: 'MFA_VERIFIED',
    severity: 'LOW',
    targetResource: event.node.req.url,
    actionTaken: 'ALLOWED',
    details: { purpose: requiredPurpose, phoneOrEmail }
  })

  return { phoneOrEmail }
}

/**
 * 🛡️ SEC-001 & SEC-006: Rol Tabanlı Yetki Kontrolü
 */
export function requireRole(event: H3Event, allowedRoles: (CompanyRole | string)[]): UserSessionContext {
  const session = requireAuth(event)
  if (session.isAdmin) return session

  // FİRMA_YÖNETİCİSİ has full management authority
  const hasRole = session.companyRole === 'FİRMA_YÖNETİCİSİ' || 
    (session.companyRole && allowedRoles.includes(session.companyRole))

  if (!hasRole) {
    logSecurityEvent(event, {
      eventType: 'ROLE_VIOLATION',
      severity: 'HIGH',
      actorEmail: session.userEmail,
      actorVkn: session.companyVkn,
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: {
        userRole: session.companyRole,
        requiredRoles: allowedRoles
      }
    })

    throw createError({
      statusCode: 403,
      statusMessage: `Yetkisiz işlem: Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır. Gerekli roller: ${allowedRoles.join(', ')} (Kural SEC-001 / USR-004).`
    })
  }

  return session
}

/**
 * 🛡️ SEC-002: Tenant İzolasyonu & IDOR Koruması
 * Bir firmanın verisine farklı bir firmanın erişmesini engeller.
 */
export function assertTenantAccess(event: H3Event, targetVknOrEmail: string): UserSessionContext {
  const session = requireAuth(event)
  if (session.isAdmin) return session

  const cleanTarget = targetVknOrEmail.trim().toLowerCase()
  const isMatch = 
    (session.companyVkn && session.companyVkn === cleanTarget) ||
    session.userEmail.toLowerCase() === cleanTarget

  if (!isMatch) {
    logSecurityEvent(event, {
      eventType: 'IDOR_ATTEMPT',
      severity: 'CRITICAL',
      actorEmail: session.userEmail,
      actorVkn: session.companyVkn,
      targetResource: event.node.req.url,
      actionTaken: 'BLOCKED_403',
      details: {
        attemptedTarget: targetVknOrEmail,
        actualUserVkn: session.companyVkn
      }
    })

    throw createError({
      statusCode: 403,
      statusMessage: 'Erişim engellendi: Başka bir firmanın veya kullanıcının kaynaklarına doğrudan erişilemez (Kural SEC-002 - Tenant İzolasyonu).'
    })
  }

  return session
}

/**
 * 🛡️ SEC-013: XSS & Injection Girdi Temizleme
 */
export function sanitizeXss(input: string | undefined): string {
  if (!input) return ''
  return String(input)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/[<>]/g, '')
    .trim()
}

/**
 * 🛡️ SEC-013: Tüm Girdileri Özyinelemeli Temizleme
 */
export function sanitizePayload<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeXss(obj) as any
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizePayload(item)) as any
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizePayload(value)
    }
    return cleaned
  }
  return obj
}
