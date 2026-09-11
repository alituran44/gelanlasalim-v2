import { defineEventHandler, readBody, createError } from 'h3'
import { registerNewCompany, getCompanyByVkn } from '~~/server/utils/companyVerificationStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
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

  // Check checksum
  const isValidChecksum = validateVknChecksum(vkn)
  if (!isValidChecksum) {
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
    ownerName: userName || 'Firma Yöneticisi'
  })

  if (!result.success) {
    throw createError({
      statusCode: 409,
      statusMessage: result.error || 'Firma kaydı oluşturulamadı.'
    })
  }

  return {
    success: true,
    message: 'Firma ticari kimliği başarıyla doğrulandı ve kurumsal hesap aktive edildi.',
    company: result.company,
    timestamp: new Date().toISOString()
  }
})

function validateVknChecksum(vkn: string): boolean {
  if (!/^\d+$/.test(vkn)) return false
  
  if (vkn.length === 11) {
    const digits = vkn.split('').map(Number)
    if (digits[0] === 0) return false
    const d10 = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10
    const d11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10
    return digits[9] === d10 && digits[10] === d11
  }

  if (vkn.length === 10) {
    const digits = vkn.split('').map(Number)
    let sum = 0
    for (let i = 0; i < 9; i++) {
      let v = (digits[i] + 9 - i) % 10
      if (v !== 0) {
        v = (v * Math.pow(2, 9 - i)) % 9
        if (v === 0) v = 9
      }
      sum += v
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return digits[9] === checkDigit
  }

  return false
}
