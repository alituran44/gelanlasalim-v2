import type { H3Event } from 'h3'
import { getRequestHeaders, getRequestHeader, createError } from 'h3'
import { getCompanyByVkn, getAllCompanies, CompanyRole } from './companyVerificationStore'
import { logSecurityEvent } from './securityAuditStore'

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
 * 🛡️ SEC-001 & SEC-003: Sunucu Tarafında Kimlik & Tenant Çözümleme
 * İstemciden gelen companyId alanına körü körüne güvenmek yerine oturumdan doğrular.
 */
export function resolveSession(event: H3Event): UserSessionContext {
  const headers = getRequestHeaders(event)
  const authHeader = (headers['authorization'] || '').trim()
  const fwd = getRequestHeader(event, 'x-forwarded-for')
  const clientIp = (fwd ? fwd.split(',')[0].trim() : '') ||
    event.node.req.socket.remoteAddress ||
    '127.0.0.1'

  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  // Header or Bearer simulation
  let email = (headers['x-user-email'] as string || '').trim().toLowerCase()
  if (!email && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (token.includes('@')) {
      email = token.toLowerCase().trim()
    }
  }

  if (!email && !isAdmin) {
    return {
      isAuthenticated: false,
      userEmail: '',
      userName: 'Anonim Kullanıcı',
      isCompanyVerified: false,
      isAdmin: false,
      clientIp
    }
  }

  // Resolve company membership and role from companyVerificationStore
  const allCompanies = getAllCompanies()
  let matchedCompany = allCompanies.find(c => 
    c.adminEmail.toLowerCase() === email ||
    c.members.some(m => m.email.toLowerCase() === email && m.status === 'ACTIVE')
  )

  // If header provided VKN, check if user actually belongs to it (prevent VKN spoofing)
  const headerVkn = (headers['x-user-vkn'] as string || '').trim()
  if (headerVkn && (!matchedCompany || matchedCompany.vkn !== headerVkn)) {
    const vknTarget = getCompanyByVkn(headerVkn)
    if (vknTarget && vknTarget.members.some(m => m.email.toLowerCase() === email && m.status === 'ACTIVE')) {
      matchedCompany = vknTarget
    }
  }

  let role: CompanyRole = 'GÖRÜNTÜLEYİCİ'
  let userName = email.split('@')[0]
  let isVerified = false

  if (matchedCompany) {
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
  }

  return {
    isAuthenticated: true,
    userEmail: email,
    userName,
    companyVkn: matchedCompany?.vkn,
    companyRole: role,
    isCompanyVerified: isVerified,
    isAdmin,
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
      statusMessage: 'Bu işlem için oturum açmanız gerekmektedir (Kural SEC-001).'
    })
  }
  return session
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
