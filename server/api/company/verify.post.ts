import { defineEventHandler, readBody, createError } from 'h3'
import { registerNewCompany, getCompanyByVkn } from '~~/server/utils/companyVerificationStore'
import { queryOfficialTaxRegistry, validateVknChecksum } from '~~/server/utils/taxVerificationService'
import { sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event) || {}
  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)
  const { vkn, taxOffice, companyTitle, legalName, address, city, kepAddress, userEmail, userName } = body

  if (!vkn || typeof vkn !== 'string' || (vkn.length !== 10 && vkn.length !== 11)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz Vergi Kimlik No formatı. VKN 10 haneli, TCKN 11 haneli olmalıdır.'
    })
  }

  if (!taxOffice || !companyTitle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vergi dairesi ve şirket unvanı zorunludur.'
    })
  }

  // 🛡️ KATMAN 7: Gerçek GİB / Ticaret Sicil Mükellefiyet Sorgulama Servisi
  // Sadece checksum kontrolü yetmez; gerçek tescil teyit edilmedikçe otomatik "VERIFIED" verilmez.
  const taxResult = await queryOfficialTaxRegistry({
    vkn,
    taxOffice,
    companyTitle
  })

  if (!taxResult.isValidChecksum) {
    throw createError({
      statusCode: 400,
      statusMessage: 'VKN/TCKN algoritma doğrulaması başarısız. Girdiğiniz numarayı kontrol ediniz. (Kural VER-002)'
    })
  }

  const result = registerNewCompany({
    companyTitle,
    legalName,
    vkn,
    taxOffice,
    address,
    city,
    kepAddress,
    ownerEmail: userEmail || 'ihalecib@gmail.com',
    ownerName: userName || 'Firma Yöneticisi',
    status: taxResult.status,
    verificationBadge: taxResult.verificationBadge
  })

  if (!result.success) {
    throw createError({
      statusCode: 409,
      statusMessage: result.error || 'Firma kaydı oluşturulamadı.'
    })
  }

  return {
    success: true,
    status: taxResult.status,
    isVerified: taxResult.isOfficialRegistryConfirmed,
    verificationBadge: taxResult.verificationBadge,
    checksumValid: true,
    officialRegistryConfirmed: taxResult.isOfficialRegistryConfirmed,
    message: taxResult.message,
    officialRecord: taxResult.officialRecord,
    company: result.company,
    timestamp: new Date().toISOString()
  }
})
