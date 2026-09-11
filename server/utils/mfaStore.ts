// In-memory MFA OTP store with auto-expiry
export interface MfaOtpRecord {
  phoneOrEmail: string
  code: string
  purpose: string
  expiresAt: number
  verified: boolean
}

declare global {
  // eslint-disable-next-line no-var
  var __MFA_STORE__: Map<string, MfaOtpRecord> | undefined
}

if (!globalThis.__MFA_STORE__) {
  globalThis.__MFA_STORE__ = new Map<string, MfaOtpRecord>()
}

export function generateMfaOtp(phoneOrEmail: string, purpose = 'CRITICAL_ACTION'): string {
  // 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 3 * 60 * 1000 // 3 minutes

  globalThis.__MFA_STORE__!.set(phoneOrEmail.toLowerCase().trim(), {
    phoneOrEmail,
    code,
    purpose,
    expiresAt,
    verified: false
  })

  return code
}

export function verifyMfaOtp(phoneOrEmail: string, code: string): { valid: boolean; error?: string } {
  const key = phoneOrEmail.toLowerCase().trim()
  const record = globalThis.__MFA_STORE__!.get(key)

  if (!record) {
    return { valid: false, error: 'Doğrulama kodu bulunamadı veya süresi doldu. Lütfen yeniden kod isteyiniz.' }
  }

  if (Date.now() > record.expiresAt) {
    globalThis.__MFA_STORE__!.delete(key)
    return { valid: false, error: 'Doğrulama kodunun 3 dakikalık geçerlilik süresi dolmuştur.' }
  }

  if (record.code !== code.trim()) {
    return { valid: false, error: 'Hatalı doğrulama kodu girdiniz.' }
  }

  record.verified = true
  // Delete after single use (one-time password)
  globalThis.__MFA_STORE__!.delete(key)
  return { valid: true }
}
