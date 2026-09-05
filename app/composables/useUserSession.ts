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
    window.addEventListener('storage', loadSessionFromStorage)
    window.addEventListener('session-updated', loadSessionFromStorage)
  }

  const isLoggedIn = computed(() => {
    return !!(userSession.value?.email || userSession.value?.name || userSession.value?.firstName)
  })

  // Bireysel (Kişisel) vs Kurumsal (Firma) Modu
  const isCompanyMode = computed(() => {
    return userSession.value?.isCompanyActive === true
  })

  const userName = computed(() => {
    return (
      userSession.value?.name ||
      userSession.value?.firstName ||
      userSession.value?.username ||
      'Kullanıcı'
    )
  })

  const userEmail = computed(() => userSession.value?.email || '')
  const userPhone = computed(() => userSession.value?.phone || '')

  const companyName = computed(() => {
    if (!isCompanyMode.value) return ''
    return userSession.value?.companyName || userSession.value?.company || ''
  })

  const isPhoneVerified = computed(() => {
    return userSession.value?.isPhoneVerified === true || userSession.value?.phoneVerified === true
  })

  const isEmailVerified = computed(() => {
    return userSession.value?.isEmailVerified === true || userSession.value?.emailVerified === true
  })

  function toggleCompanyMode(active: boolean) {
    userSession.value.isCompanyActive = active
    userSession.value.role = active ? 'company' : 'personal'
    saveSessionToStorage()
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

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userSession')
      localStorage.removeItem('auth_token')
    }
    userSession.value = {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('session-updated'))
    }
  }

  return {
    userSession,
    isLoggedIn,
    isCompanyMode,
    userName,
    userEmail,
    userPhone,
    companyName,
    isPhoneVerified,
    isEmailVerified,
    toggleCompanyMode,
    updateSession,
    setPhoneVerified,
    setEmailVerified,
    logout,
    loadSessionFromStorage
  }
}
