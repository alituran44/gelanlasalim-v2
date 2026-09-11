import { defineEventHandler, readBody, createError } from 'h3'
import { getCompanyByVkn, saveCompanies, getAllCompanies, CompanyRole } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { vkn, targetEmail, newRole, action, adminEmail } = body

  if (!vkn || !targetEmail || !adminEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN, hedef üye e-postası ve yönetici e-postası zorunludur.'
    })
  }

  const company = getCompanyByVkn(vkn)
  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Firma bulunamadı.'
    })
  }

  // Check admin authority
  const adminMember = company.members.find(m => m.userEmail.toLowerCase() === adminEmail.trim().toLowerCase())
  if (!adminMember || adminMember.role !== 'FİRMA_YÖNETİCİSİ') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Bu işlemi yapmaya sadece Firma Yöneticisi yetkilidir. (Kural USR-003)'
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
      actor: adminEmail,
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
      actor: adminEmail,
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
