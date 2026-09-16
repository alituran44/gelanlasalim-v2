import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// In-memory MFA OTP store with auto-expiry
export interface MfaOtpRecord {
  phoneOrEmail: string
  code: string
  purpose: string
  expiresAt: number
  verified: boolean
}

export interface MfaActionTokenRecord {
  id: string
  phoneOrEmail: string
  purpose: string
  expiresAt: number
  used: boolean
}

const MFA_SECRET = process.env.MFA_SECRET || 'ihb_mfa_action_entropy_salt_2026_secure'

declare global {
  // eslint-disable-next-line no-var
  var __MFA_STORE__: Map<string, MfaOtpRecord> | undefined
  // eslint-disable-next-line no-var
  var __MFA_ACTION_STORE__: Map<string, MfaActionTokenRecord> | undefined
}

if (!globalThis.__MFA_STORE__) {
  globalThis.__MFA_STORE__ = new Map<string, MfaOtpRecord>()
}

if (!globalThis.__MFA_ACTION_STORE__) {
  globalThis.__MFA_ACTION_STORE__ = new Map<string, MfaActionTokenRecord>()
}

const otpStore = globalThis.__MFA_STORE__!
const actionStore = globalThis.__MFA_ACTION_STORE__!

export function generateMfaOtp(phoneOrEmail: string, purpose = 'CRITICAL_ACTION'): string {
  // 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 3 * 60 * 1000 // 3 minutes

  otpStore.set(phoneOrEmail.toLowerCase().trim(), {
    phoneOrEmail: phoneOrEmail.toLowerCase().trim(),
    code,
    purpose: purpose.trim(),
    expiresAt,
    verified: false
  })

  return code
}

export function verifyMfaOtp(phoneOrEmail: string, code: string, purpose?: string): { valid: boolean; error?: string; record?: MfaOtpRecord } {
  const key = phoneOrEmail.toLowerCase().trim()
  const record = otpStore.get(key)

  if (!record) {
    return { valid: false, error: 'Doğrulama kodu bulunamadı veya süresi doldu. Lütfen yeniden kod isteyiniz.' }
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key)
    return { valid: false, error: 'Doğrulama kodunun 3 dakikalık geçerlilik süresi dolmuştur.' }
  }

  if (record.code !== code.trim()) {
    return { valid: false, error: 'Hatalı doğrulama kodu girdiniz.' }
  }

  if (purpose && record.purpose && record.purpose !== purpose.trim()) {
    return { valid: false, error: `Bu doğrulama kodu '${record.purpose}' için üretilmiştir, '${purpose}' işlemi için kullanılamaz.` }
  }

  record.verified = true
  // Tek kullanımlık kod tüketimi
  otpStore.delete(key)
  return { valid: true, record }
}

/**
 * 🛡️ Katman 3: Amaca Bağlı (Purpose-Bound) Tek Kullanımlık Kriptografik MFA Token'ı
 */
export function createPurposeBoundMfaToken(phoneOrEmail: string, purpose: string): string {
  const tokenId = randomBytes(20).toString('hex')
  const now = Date.now()
  const expiresAt = now + 5 * 60 * 1000 // 5 dakika geçerli

  const cleanTarget = phoneOrEmail.toLowerCase().trim()
  const cleanPurpose = purpose.trim()

  const record: MfaActionTokenRecord = {
    id: tokenId,
    phoneOrEmail: cleanTarget,
    purpose: cleanPurpose,
    expiresAt,
    used: false
  }

  actionStore.set(tokenId, record)

  // HMAC-SHA256 ile imzalanmış token: mfa_<payloadB64>.<sigB64>
  const payloadStr = `${tokenId}:${cleanTarget}:${cleanPurpose}:${expiresAt}`
  const signature = createHmac('sha256', MFA_SECRET).update(payloadStr).digest('base64url')
  const payloadB64 = Buffer.from(payloadStr).toString('base64url')

  return `mfa_${payloadB64}.${signature}`
}

/**
 * 🛡️ Katman 3: Amaca Bağlı Token Tüketimi (Replay Korumalı Tek Kullanım)
 */
export function consumePurposeBoundMfaToken(
  tokenStr: string,
  requiredPurpose: string
): { valid: boolean; error?: string; phoneOrEmail?: string } {
  if (!tokenStr || typeof tokenStr !== 'string') {
    return { valid: false, error: 'MFA doğrulama tokenı eksik (Kural SEC-009).' }
  }

  const trimmed = tokenStr.trim()
  if (!trimmed.startsWith('mfa_')) {
    return { valid: false, error: 'Geçersiz MFA token formatı.' }
  }

  const raw = trimmed.substring(4)
  const parts = raw.split('.')
  if (parts.length !== 2) {
    return { valid: false, error: 'Bozuk MFA token yapısı.' }
  }

  const [payloadB64, signature] = parts
  try {
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const expectedSig = createHmac('sha256', MFA_SECRET).update(payloadStr).digest('base64url')

    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false, error: 'MFA token imzası geçersiz veya tahrif edilmiş.' }
    }

    const [tokenId, tokenPhoneOrEmail, tokenPurpose, expiresAtStr] = payloadStr.split(':')
    const expiresAt = parseInt(expiresAtStr, 10)

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      actionStore.delete(tokenId)
      return { valid: false, error: 'MFA tokenının 5 dakikalık geçerlilik süresi dolmuştur.' }
    }

    // 🛡️ Purpose-Bound Doğrulaması
    if (tokenPurpose !== requiredPurpose.trim()) {
      return {
        valid: false,
        error: `MFA yetkilendirme amacı uyuşmuyor: Token '${tokenPurpose}' için üretilmiş, ancak bu işlem '${requiredPurpose}' gerektiriyor.`
      }
    }

    // 🛡️ Sunucu Tarafı Tek Kullanımlık (Replay Attack) Kontrolü
    const record = actionStore.get(tokenId)
    if (!record || record.used) {
      return { valid: false, error: 'Bu MFA tokenı zaten kullanılmış veya geçersiz kılınmıştır (Tek kullanımlık koruma).' }
    }

    // Tüket ve sil
    record.used = true
    actionStore.delete(tokenId)

    return { valid: true, phoneOrEmail: tokenPhoneOrEmail }
  } catch (err: any) {
    return { valid: false, error: err?.message || 'MFA token doğrulanırken hata oluştu.' }
  }
}

/**
 * 🔒 Yalnızca Yerel Geliştirme/Test Amaçlı (Production ortamında kesinlikle undefined döner)
 */
export function getMfaOtpForDev(phoneOrEmail: string): MfaOtpRecord | undefined {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return undefined
  }
  return otpStore.get(phoneOrEmail.toLowerCase().trim())
}

