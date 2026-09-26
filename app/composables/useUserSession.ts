import { ref, computed } from 'vue'

export interface UserSessionData {
  name?: string
  firstName?: string
  lastName?: string
  surname?: string
  username?: string
  email?: string
  phone?: string
  picture?: string
  avatar?: string
  title?: string
  role?: 'company' | 'personal' | 'admin' | string
  isCompanyActive?: boolean
  company?: string
  companyName?: string
  companyEmail?: string
  companyLogo?: string
  legalName?: string
  description?: string
  about?: string
  taxNo?: string
  taxOffice?: string
  sectors?: string | string[]
  website?: string
  city?: string
  iban?: string
  faturaAdresi?: string
  isPhoneVerified?: boolean
  phoneVerified?: boolean
  isEmailVerified?: boolean
  emailVerified?: boolean
  isGoogleAuth?: boolean
  authProvider?: string
  isPremium?: boolean
  subscriptionPlan?: string
  [key: string]: any
}

export interface ServerVerifiedSession {
  isAuthenticated: boolean
  userEmail: string
  userName: string
  companyVkn?: string
  companyRole?: string
  isCompanyVerified: boolean
  isAdmin: boolean
  isPremium: boolean
  subscriptionPlan: string
  tierId?: string
}

// 🛡️ SEC-011: Sunucu Tarafından Doğrulanmış Oturum (Trusted Server State)
// Yetkilendirme (role, isAdmin, isPremium vb.) KESİNLİKLE buna dayanır.
const serverSession = ref<ServerVerifiedSession | null>(null)
const userSession = ref<UserSessionData>({})
const isInitialized = ref(false)

function loadSessionFromStorage() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('userSession')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        userSession.value = parsed
        return
      }
    }
    userSession.value = {}
  } catch (e) {
    console.warn('Failed to parse userSession from localStorage:', e)
    userSession.value = {}
  }
}

function saveSessionToStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('userSession', JSON.stringify(userSession.value))
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('session-updated'))
  } catch (e) {
    console.warn('Failed to save userSession to localStorage:', e)
  }
}

export function useUserSession() {
  if (typeof window !== 'undefined' && !isInitialized.value) {
    isInitialized.value = true
    loadSessionFromStorage()
    fetchServerSession()
    window.addEventListener('storage', () => {
      loadSessionFromStorage()
      fetchServerSession()
    })
    window.addEventListener('session-updated', loadSessionFromStorage)
    window.addEventListener('user-session-changed', () => {
      loadSessionFromStorage()
      fetchServerSession()
    })
  }

  // 🛡️ SEC-011: Oturum durumu öncelikle sunucu doğrulamasına dayanır, yoksa yerel oturuma bakar
  const isLoggedIn = computed(() => {
    if (serverSession.value?.isAuthenticated) return true
    return !!(userSession.value?.email || userSession.value?.name || userSession.value?.firstName)
  })

  // Bireysel (Kişisel) vs Kurumsal (Firma) Modu (Görsel 5: İlk girişte hep Kişisel Mod, istendiğinde Firma Modu)
  const isCompanyMode = computed(() => {
    // Kullanıcı açıkça Firma Modunu aktif etmediyse daima Kişisel Mod (false)
    if (userSession.value?.isCompanyActive !== true) {
      return false
    }
    if (serverSession.value) {
      const cr = (serverSession.value.companyRole || '').toLowerCase()
      if (cr === 'individual' || cr === 'bireysel' || cr === 'personal' || cr === 'görüntüleyici') {
        return userSession.value?.isCompanyActive === true
      }
      return Boolean(serverSession.value.companyVkn && serverSession.value.companyRole !== 'GÖRÜNTÜLEYİCİ')
    }
    return userSession.value?.isCompanyActive === true
  })

  // UI Görüntüleme için İsim (Güvenlik kararlarında kullanılmaz)
  const userName = computed(() => {
    if (serverSession.value?.userName) return serverSession.value.userName
    if (userSession.value?.name && userSession.value.name.trim()) {
      return userSession.value.name.trim()
    }
    if (userSession.value?.firstName || userSession.value?.lastName) {
      const full = `${userSession.value?.firstName || ''} ${userSession.value?.lastName || ''}`.trim()
      if (full) return full
    }
    if (userSession.value?.username && userSession.value.username.trim()) {
      return userSession.value.username.trim()
    }
    if (userSession.value?.email) {
      const prefix = userSession.value.email.split('@')[0]
      return prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ')
    }
    return 'Kullanıcı'
  })

  const userEmail = computed(() => serverSession.value?.userEmail || userSession.value?.email || '')
  const userPhone = computed(() => userSession.value?.phone || '')

  const companyName = computed(() => {
    return userSession.value?.companyName || userSession.value?.company || ''
  })

  const isPhoneVerified = computed(() => {
    return userSession.value?.isPhoneVerified === true || userSession.value?.phoneVerified === true
  })

  const isEmailVerified = computed(() => {
    return userSession.value?.isEmailVerified === true || userSession.value?.emailVerified === true
  })

  // 🛡️ VER-001 & SEC-011: Firma Doğrulama & Yetkililik Durumu (Sunucu Teyitli)
  const isCompanyVerified = computed(() => {
    if (serverSession.value) {
      return serverSession.value.isCompanyVerified === true
    }
    return false
  })

  // 🛡️ SEC-011: Firma Rolü (Sunucu Tarafı Teyitli)
  const companyRole = computed(() => {
    if (serverSession.value?.companyRole) {
      return serverSession.value.companyRole
    }
    return 'GÖRÜNTÜLEYİCİ'
  })

  const companyVkn = computed(() => {
    return serverSession.value?.companyVkn || userSession.value?.taxNo || userSession.value?.vkn || '9560161511'
  })

  // 👥 Teklif Verme Yetkisi: Tüm kayıtlı / oturum açmış kullanıcılar (vatandaş, bireysel, memur, kurumsal) teklif verebilir
  const canSubmitBid = computed(() => {
    return isLoggedIn.value === true
  })

  // 👑 ADM-001 & SEC-011: Süper Admin Yetkisi (SADECE Sunucu Tarafı Teyitli!)
  // localStorage veya istemci token aldatmacalarına KESİNLİKLE İZİN VERİLMEZ.
  const isAdmin = computed(() => {
    return serverSession.value?.isAdmin === true
  })

  // 💎 SEC-011: Abonelik & Premium Yetkileri (SADECE Sunucu Tarafı Teyitli!)
  const isPremiumUser = computed(() => {
    return serverSession.value?.isPremium === true
  })

  const subscriptionPlan = computed(() => {
    return serverSession.value?.subscriptionPlan || 'Standart Plan'
  })

  // Kurumsal Pro: Pro veya Enterprise (Enterprise üst paket olup Pro özelliklerini de kapsar)
  const isCorporatePro = computed(() => {
    if (!serverSession.value?.isPremium) return false
    const plan = (serverSession.value?.subscriptionPlan || '').toLowerCase()
    const tierId = serverSession.value?.tierId || ''
    return tierId === 'kurumsal-pro' || 
           tierId === 'kurumsal-enterprise' || 
           plan.includes('pro') || 
           plan.includes('enterprise')
  })

  // Kurumsal Enterprise: Yalnızca Kurumsal Enterprise paketi olanlar
  const isCorporateEnterprise = computed(() => {
    if (!serverSession.value?.isPremium) return false
    const plan = (serverSession.value?.subscriptionPlan || '').toLowerCase()
    const tierId = serverSession.value?.tierId || ''
    return tierId === 'kurumsal-enterprise' || 
           plan.includes('enterprise')
  })

  function setCompanyMode(active: boolean) {
    userSession.value.isCompanyActive = active
    userSession.value.role = active ? 'company' : 'individual'
    saveSessionToStorage()
  }

  function toggleCompanyMode(active?: boolean | any) {
    const next = typeof active === 'boolean' ? active : !userSession.value.isCompanyActive
    setCompanyMode(next)
  }

  function updateSession(data: Partial<UserSessionData>) {
    userSession.value = {
      ...userSession.value,
      ...data
    }
    saveSessionToStorage()
  }

  function setPhoneVerified(status: boolean, phone?: string) {
    userSession.value.isPhoneVerified = status
    userSession.value.phoneVerified = status
    if (phone) {
      userSession.value.phone = phone
    }
    saveSessionToStorage()
  }

  function setEmailVerified(status: boolean, email?: string) {
    userSession.value.isEmailVerified = status
    userSession.value.emailVerified = status
    if (email) {
      userSession.value.email = email
    }
    saveSessionToStorage()
  }

  async function fetchServerSession() {
    try {
      const res: any = await $fetch('/api/auth/me')
      if (res?.success && res.isAuthenticated && res.user) {
        serverSession.value = {
          isAuthenticated: true,
          userEmail: res.user.email,
          userName: res.user.name,
          companyVkn: res.user.companyVkn,
          companyRole: res.user.companyRole,
          isCompanyVerified: Boolean(res.user.isCompanyVerified),
          isAdmin: Boolean(res.user.isAdmin || res.isAdmin),
          isPremium: Boolean(res.user.isPremium),
          subscriptionPlan: res.user.subscriptionPlan || 'Standart Plan',
          tierId: res.user.tierId || (res.user.isPremium ? 'kurumsal-pro' : 'free')
        }
        userSession.value = {
          ...userSession.value,
          ...res.user
        }
        saveSessionToStorage()
        try {
          const authCookie = useCookie('ihb_auth')
          authCookie.value = '1'
        } catch {}
      } else {
        serverSession.value = null
      }
    } catch {
      serverSession.value = null
    }
  }

  async function serverLogin(payload: { email: string; password?: string; companyVkn?: string; role?: string; name?: string }) {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload
    })
    if (res?.success && res.user) {
      try {
        const authCookie = useCookie('ihb_auth')
        authCookie.value = '1'
      } catch {}
      await fetchServerSession()
    }
    return res
  }

  async function serverLogout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    logout()
  }

  function logout() {
    serverSession.value = null
    userSession.value = {}
    if (typeof window !== 'undefined') {
      try {
        const authCookie = useCookie('ihb_auth')
        authCookie.value = null
      } catch {}
      localStorage.removeItem('userSession')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('adminToken')
      $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('session-updated'))
    }
  }

  return {
    serverSession,
    userSession,
    isLoggedIn,
    isCompanyMode,
    userName,
    userEmail,
    userPhone,
    companyName,
    isPhoneVerified,
    isEmailVerified,
    isCompanyVerified,
    companyRole,
    companyVkn,
    canSubmitBid,
    isAdmin,
    isPremiumUser,
    subscriptionPlan,
    isCorporatePro,
    isCorporateEnterprise,
    toggleCompanyMode,
    setCompanyMode,
    updateSession,
    setPhoneVerified,
    setEmailVerified,
    logout,
    serverLogin,
    serverLogout,
    fetchServerSession,
    loadSessionFromStorage
  }
}
