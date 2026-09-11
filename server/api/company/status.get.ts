import { defineEventHandler, getQuery, createError } from 'h3'
import { getCompanyForUser, getAllCompanies, getCompanyByVkn } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userEmail = (query.email as string || '').trim().toLowerCase()
  const vkn = (query.vkn as string || '').trim()

  if (vkn) {
    const company = getCompanyByVkn(vkn)
    if (company) {
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

  const membership = getCompanyForUser(userEmail)
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
