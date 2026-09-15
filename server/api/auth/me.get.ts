import { defineEventHandler } from 'h3'
import { resolveSession } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  const session = resolveSession(event)

  return {
    success: true,
    isAuthenticated: session.isAuthenticated,
    user: session.isAuthenticated ? {
      email: session.userEmail,
      name: session.userName,
      companyVkn: session.companyVkn,
      companyRole: session.companyRole,
      isCompanyVerified: session.isCompanyVerified,
      isAdmin: session.isAdmin
    } : null
  }
})
