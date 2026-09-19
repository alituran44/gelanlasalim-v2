import { defineEventHandler, getQuery, createError } from 'h3'
import { getCompanyForUser, getAllCompanies, getCompanyByVkn } from '~~/server/utils/companyVerificationStore'
import { resolveSession, requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const session = resolveSession(event)
  const query = getQuery(event)
  const userEmail = (query.email as string || '').trim().toLowerCase()
  const vkn = (query.vkn as string || '').trim()

  if (query.all === 'true') {
    // 🛡️ SEC-ADM: Tüm firmaların listelenmesi yalnızca yöneticilere açıktır
    requireAdmin(event)
    const companies = getAllCompanies()
    return {
      companies: companies.map(c => ({
        vkn: c.vkn,
        companyTitle: c.companyTitle,
        taxOffice: c.taxOffice,
        status: c.status,
        verificationBadge: c.verificationBadge,
        membersCount: (c.members || []).filter(m => m.status === 'ACTIVE').length,
        pendingRequestsCount: (c.joinRequests || []).filter(r => r.status === 'PENDING').length
      })),
      total: companies.length
    }
  }

  if (vkn) {
    const company = getCompanyByVkn(vkn)
    if (company) {
      if (query.full === 'true') {
        // 🛡️ SEC-002: Detaylı firma verileri sadece firma çalışanlarına veya admine açıktır
        const isMember = (session.companyVkn && session.companyVkn === vkn) ||
          (session.userEmail && company.members.some(m => m.userEmail.toLowerCase() === session.userEmail.toLowerCase()))
        if (!session.isAdmin && !isMember) {
          throw createError({
            statusCode: 403,
            statusMessage: 'Bu firmanın detaylı kurumsal verilerine erişim yetkiniz bulunmamaktadır (Kural SEC-002).'
          })
        }
        return {
          hasCompany: true,
          company,
          member: company.members[0]
        }
      }
      return {
        exists: true,
        companyTitle: company.companyTitle,
        vkn: company.vkn,
        taxOffice: company.taxOffice,
        status: company.status,
        verificationBadge: company.verificationBadge
      }
    }
    return { exists: false }
  }

  const effectiveEmail = (session.isAdmin && userEmail) ? userEmail : (session.isAuthenticated ? session.userEmail : userEmail)
  const membership = getCompanyForUser(effectiveEmail)
  if (membership) {
    return {
      hasCompany: true,
      company: membership.company,
      member: membership.member
    }
  }

  // Fallback: If user is admin/demo or not yet linked to a custom company, return seed company for demo session
  if (userEmail.includes('ihalecib') || userEmail.includes('demo') || !userEmail) {
    const companies = getAllCompanies()
    const firstCompany = companies[0]
    return {
      hasCompany: true,
      company: firstCompany,
      member: firstCompany?.members[0]
    }
  }

  return {
    hasCompany: false,
    message: 'Kullanıcıya ait onaylanmış kurumsal firma kaydı bulunamadı.'
  }
})
