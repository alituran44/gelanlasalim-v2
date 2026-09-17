import { defineEventHandler, readBody, createError } from 'h3'
import { getCompanyByVkn, saveCompanies, getAllCompanies, CompanyRole } from '~~/server/utils/companyVerificationStore'
import { assertTenantAccess, requireRole, sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const { vkn, targetEmail, newRole, action } = body

  if (!vkn || !targetEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN ve hedef üye e-postası zorunludur.'
    })
  }

  // 🛡️ SEC-002 & SEC-006: Tenant İzolasyonu, IDOR ve Rol Kontrolü
  // Yalnızca ilgili firmanın yöneticisi veya sistem yöneticisi üye yönetebilir
  assertTenantAccess(event, vkn)
  const session = requireRole(event, ['FİRMA_YÖNETİCİSİ'])
  const actorEmail = session.userEmail

  const company = getCompanyByVkn(vkn)
  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Firma bulunamadı.'
    })
  }

  const targetMember = company.members.find(m => m.userEmail.toLowerCase() === targetEmail.trim().toLowerCase())
  if (!targetMember) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hedef çalışan bulunamadı.'
    })
  }

  const now = new Date().toISOString()

  if (action === 'REMOVE') {
    // USR-006: Firma hesabından çıkarıldığında üye pasife alınır
    targetMember.status = 'REMOVED'
    company.auditLog.push({
      action: 'MEMBER_REMOVED',
      actor: actorEmail,
      timestamp: now,
      details: { targetEmail }
    })
    saveCompanies(getAllCompanies())
    return {
      success: true,
      message: `${targetEmail} çalışanının firma erişim yetkisi kaldırıldı. (Kural USR-006)`
    }
  }

  if (newRole) {
    // USR-004: Rol ayrıştırması
    const oldRole = targetMember.role
    targetMember.role = newRole as CompanyRole
    company.auditLog.push({
      action: 'MEMBER_ROLE_UPDATED',
      actor: actorEmail,
      timestamp: now,
      details: { targetEmail, oldRole, newRole }
    })
    saveCompanies(getAllCompanies())
    return {
      success: true,
      message: `${targetEmail} çalışanının rolü "${newRole}" olarak güncellendi. (Kural USR-004)`
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Geçersiz işlem parametresi.'
  })
})
