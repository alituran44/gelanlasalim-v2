/**
 * 🛡️ SEC-011 (Katman 5): Kurumsal Abonelik ve Premium Doğrulama Deposu
 * İstemci tarafında manipüle edilebilen localStorage yerine,
 * kullanıcının aktif kurumsal aboneliğini ve paket yetkilerini sunucu tarafında tutar ve doğrular.
 */

export interface CompanySubscription {
  userEmail: string
  companyVkn?: string
  isPremium: boolean
  subscriptionPlan: string // 'Ücretsiz Başlangıç' | 'Kurumsal Pro' | 'Kurumsal Enterprise' | 'Standart'
  tierId: 'free' | 'kurumsal-pro' | 'kurumsal-enterprise'
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  activatedAt: number
  expiresAt?: number
  paymentReference?: string
}

declare global {
  // eslint-disable-next-line no-var
  var __SUBSCRIPTIONS__: Map<string, CompanySubscription> | undefined
}

if (!globalThis.__SUBSCRIPTIONS__) {
  globalThis.__SUBSCRIPTIONS__ = new Map<string, CompanySubscription>()
}

const subscriptionMap = globalThis.__SUBSCRIPTIONS__!

// Seed initial verified enterprise subscribers for testing/staging
if (subscriptionMap.size === 0) {
  // Demo verified company 1
  subscriptionMap.set('9560161511', {
    companyVkn: '9560161511',
    userEmail: 'firma_demo@ihaleciburada.com',
    isPremium: true,
    subscriptionPlan: 'Kurumsal Pro',
    tierId: 'kurumsal-pro',
    status: 'ACTIVE',
    activatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 335 * 24 * 60 * 60 * 1000
  })

  // Admin user always has Enterprise subscription
  subscriptionMap.set('admin@ihaleciburada.com', {
    userEmail: 'admin@ihaleciburada.com',
    isPremium: true,
    subscriptionPlan: 'Kurumsal Enterprise (Sistem Yöneticisi)',
    tierId: 'kurumsal-enterprise',
    status: 'ACTIVE',
    activatedAt: Date.now()
  })

  subscriptionMap.set('ihalecib@gmail.com', {
    userEmail: 'ihalecib@gmail.com',
    isPremium: true,
    subscriptionPlan: 'Kurumsal Enterprise',
    tierId: 'kurumsal-enterprise',
    status: 'ACTIVE',
    activatedAt: Date.now()
  })
}

/**
 * E-posta veya VKN ile aktif abonelik kaydını bulur
 */
export function getSubscription(emailOrVkn?: string): CompanySubscription | null {
  if (!emailOrVkn) return null
  const key = emailOrVkn.trim().toLowerCase()

  // 1. Doğrudan eşleşme
  let sub = subscriptionMap.get(key)
  if (sub) {
    if (sub.expiresAt && Date.now() > sub.expiresAt) {
      sub.status = 'EXPIRED'
      sub.isPremium = false
    }
    return sub
  }

  // 2. Map içinde e-posta veya vkn taraması
  for (const item of subscriptionMap.values()) {
    if (
      (item.userEmail && item.userEmail.toLowerCase() === key) ||
      (item.companyVkn && item.companyVkn.trim() === key)
    ) {
      if (item.expiresAt && Date.now() > item.expiresAt) {
        item.status = 'EXPIRED'
        item.isPremium = false
      }
      return item
    }
  }

  return null
}

/**
 * Kullanıcının veya şirketin aktif premium aboneliği var mı?
 */
export function hasActivePremium(emailOrVkn?: string): boolean {
  const sub = getSubscription(emailOrVkn)
  if (!sub) return false
  return sub.isPremium && sub.status === 'ACTIVE'
}

/**
 * Yeni bir abonelik aktifleştirir (Ödeme onayından sonra)
 */
export function activateSubscription(data: {
  userEmail: string
  companyVkn?: string
  tierId: 'free' | 'kurumsal-pro' | 'kurumsal-enterprise'
  subscriptionPlan?: string
  durationDays?: number
  paymentReference?: string
}): CompanySubscription {
  const email = data.userEmail.trim().toLowerCase()
  const now = Date.now()
  const days = data.durationDays || (data.tierId === 'free' ? 365 : 30)
  const expiresAt = now + days * 24 * 60 * 60 * 1000

  const planName = data.subscriptionPlan || (
    data.tierId === 'kurumsal-enterprise' ? 'Kurumsal Enterprise' :
    data.tierId === 'kurumsal-pro' ? 'Kurumsal Pro' : 'Standart Plan'
  )

  const record: CompanySubscription = {
    userEmail: email,
    companyVkn: data.companyVkn?.trim(),
    isPremium: data.tierId !== 'free',
    subscriptionPlan: planName,
    tierId: data.tierId,
    status: 'ACTIVE',
    activatedAt: now,
    expiresAt,
    paymentReference: data.paymentReference
  }

  subscriptionMap.set(email, record)
  if (data.companyVkn) {
    subscriptionMap.set(data.companyVkn.trim(), record)
  }

  return record
}
