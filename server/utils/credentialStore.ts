import fs from 'node:fs'
import path from 'node:path'
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

export interface UserCredential {
  email: string
  salt: string
  passwordHash: string
  updatedAt: string
}

declare global {
  // eslint-disable-next-line no-var
  var __USER_CREDENTIALS__: Map<string, UserCredential> | undefined
}

if (!globalThis.__USER_CREDENTIALS__) {
  globalThis.__USER_CREDENTIALS__ = new Map<string, UserCredential>()
}

const credentialStore = globalThis.__USER_CREDENTIALS__!

function getStorageFile(): string {
  const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
  const primary = path.join(tmpDir, 'ihaleciburada_user_credentials.json')
  try {
    if (fs.existsSync(tmpDir)) return primary
  } catch {}
  return path.resolve(process.cwd(), '.user_credentials.json')
}

function loadCredentialsFromDisk() {
  try {
    const file = getStorageFile()
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item?.email) {
            credentialStore.set(item.email.toLowerCase(), item)
          }
        }
      }
    }
  } catch (e) {
    console.warn('[credentialStore] Disk yükleme hatası:', e)
  }
}

function saveCredentialsToDisk() {
  try {
    const file = getStorageFile()
    const list = Array.from(credentialStore.values())
    fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf8')
  } catch (e) {
    console.warn('[credentialStore] Disk kaydetme hatası:', e)
  }
}

// Initial load
loadCredentialsFromDisk()

/**
 * 🛡️ SEC-PWD: Şifreyi Scrypt ve 16-byte kriptografik tuz (salt) ile hash'ler
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const cleanSalt = salt || randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, cleanSalt, 64)
  return {
    hash: derivedKey.toString('hex'),
    salt: cleanSalt
  }
}

/**
 * 🛡️ SEC-PWD: Şifre ve Hash'i zaman saldırılarına (timing attack) karşı timingSafeEqual ile doğrular
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const derivedKey = scryptSync(password, salt, 64)
    const storedBuffer = Buffer.from(storedHash, 'hex')
    if (derivedKey.length !== storedBuffer.length) return false
    return timingSafeEqual(derivedKey, storedBuffer)
  } catch {
    return false
  }
}

/**
 * Bir kullanıcının şifresini güvenli biçimde kaydeder veya günceller
 */
export function setUserPassword(email: string, plainPassword: string): void {
  const cleanEmail = email.trim().toLowerCase()
  const { hash, salt } = hashPassword(plainPassword)
  credentialStore.set(cleanEmail, {
    email: cleanEmail,
    salt,
    passwordHash: hash,
    updatedAt: new Date().toISOString()
  })
  saveCredentialsToDisk()
}

/**
 * Kullanıcı kimlik bilgilerini doğrular
 * İlk kez giriş yapan veya henüz şifre belirlenmemiş kurumsal hesaplar için şifreyi güvenle ilk kez bağlar
 */
export function verifyUserCredential(email: string, plainPassword: string): { valid: boolean; isNewUser?: boolean } {
  const cleanEmail = email.trim().toLowerCase()
  const cred = credentialStore.get(cleanEmail)

  if (!cred) {
    // Hesap ilk kez giriş yapıyorsa, girilen şifreyi güvenli şekilde tuzlayıp kaydet
    setUserPassword(cleanEmail, plainPassword)
    return { valid: true, isNewUser: true }
  }

  const isValid = verifyPassword(plainPassword, cred.passwordHash, cred.salt)
  return { valid: isValid }
}
