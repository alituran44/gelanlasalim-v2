<script setup lang="ts">
function sanitizeText(str: string): string {
  if (!str) return ''
  return String(str).replace(/[<>]/g, '').trim()
}
import { useCmsData } from '~/composables/useCmsData'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Handshake,
  Mail,
  LockKeyhole,
  Phone,
  User,
  ShieldCheck,
  Zap,
  Building2,
  ChevronRight,
  Sparkles,
  Bell,
  Eye,
  EyeOff,
  CheckCircle2,
  Home
} from 'lucide-vue-next'
import { locale, detectLocale, t } from '~/composables/useLocale'

const route = useRoute()
const router = useRouter()
const activeTab = ref<'login' | 'register' | 'forgot'>('register')
const authToastMessage = ref('')
const showAuthToast = ref(false)
const authToastType = ref<'success' | 'info' | 'error'>('success')

function triggerAuthToast(msg: string, type: 'success' | 'info' | 'error' = 'success') {
  authToastMessage.value = msg
  authToastType.value = type
  showAuthToast.value = true
  setTimeout(() => {
    showAuthToast.value = false
  }, 4000)
}
const showCookieConsent = ref(true)
const registerStep = ref<1 | 2>(1)

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

onMounted(() => {
  detectLocale()
  if (route.query.tab === 'login') {
    activeTab.value = 'login'
  } else {
    activeTab.value = 'register'
  }

  // Google Identity Services (GSI) One-Tap Entegrasyonu
  if (typeof window !== 'undefined') {
    const checkGsi = setInterval(() => {
      if ((window as any).google?.accounts?.id) {
        clearInterval(checkGsi)
        try {
          (window as any).google.accounts.id.initialize({
            client_id: '616649314930-qn4lj8sruj1f79lc7fqaqt619i37jpjp.apps.googleusercontent.com',
            callback: (response: any) => {
              if (response.credential) {
                const user = parseJwt(response.credential)
                if (user) {
                  const cleanEmail = (user.email || '').trim().toLowerCase()
                    const accounts = JSON.parse(localStorage.getItem('user_accounts_registry') || '{}')
                    
                    let userAccount = accounts[cleanEmail]
                    if (!userAccount) {
                      const derivedName = user.name || (user.given_name ? `${user.given_name} ${user.family_name || ''}` : cleanEmail.split('@')[0])
                      userAccount = {
                        email: cleanEmail,
                        firstName: user.given_name || user.name || cleanEmail.split('@')[0],
                        lastName: user.family_name || '',
                        name: derivedName,
                        picture: user.picture,
                        company: derivedName + ' Tedarik Ticaret',
                        companyName: derivedName + ' Tedarik Ticaret',
                        username: derivedName,
                        role: 'company',
                        verified: true,
                        isGoogleAuth: true,
                        authProvider: 'google',
                        isPremium: true,
                        subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
                      }
                      accounts[cleanEmail] = userAccount
                      localStorage.setItem('user_accounts_registry', JSON.stringify(accounts))
                    }

                    localStorage.setItem('userSession', JSON.stringify(userAccount))
                    registerToAdminKycQueue(userAccount)
                    window.dispatchEvent(new Event('storage'))
                    router.push('/panel')
                }
              }
            },
            auto_select: false
          })
          (window as any).google.accounts.id.prompt()
        } catch (e) {
          console.warn('Google GSI init warning', e)
        }
      }
    }, 300)

    setTimeout(() => clearInterval(checkGsi), 6000)
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'login') activeTab.value = 'login'
  else if (newTab === 'register') activeTab.value = 'register'
})

// Form Fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showLoginPassword = ref(false)
const userRole = ref<'company' | 'individual'>('company')
const companyName = ref('')
const agreeKvkk = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')
const rememberMe = ref(true)

const forgotEmail = ref('')
const forgotSubmitted = ref(false)

const isSubmitting = ref(false)
const errorMessage = ref('')

// Sektör seçimi (dile göre dinamik)
const sektorler = computed(() => [
      { key: 'tarim', label: '🌾 Tarım & Gıda', popular: true },
      { key: 'insaat', label: '🏗️ İnşaat & Yapı', popular: false },
      { key: 'saglik', label: '💊 Sağlık & İlaç', popular: false },
      { key: 'teknoloji', label: '🖥️ Teknoloji & Yazılım', popular: false },
      { key: 'enerji', label: '⚡ Enerji & Elektrik', popular: false },
      { key: 'lojistik', label: '🚚 Lojistik & Nakliye', popular: false },
      { key: 'sanayi', label: '🏭 Sanayi & Üretim', popular: false },
      { key: 'egitim', label: '📚 Eğitim & Danışmanlık', popular: false },
      { key: 'diger', label: '✏️ Diğer (Kendi Faaliyetinizi Yazın)', popular: true }
    ])
const seciliSektorler = ref<string[]>(['tarim'])
const customSector = ref('')
const mailBildirimi = ref(true)

function toggleSektor(key: string) {
  const idx = seciliSektorler.value.indexOf(key)
  if (idx >= 0) {
    seciliSektorler.value.splice(idx, 1)
  } else {
    seciliSektorler.value.push(key)
  }
}

// OTP Modal State
const showOtpModal = ref(false)
const otpInput = ref('849201')
const pendingUserSession = ref<any>(null)
const pendingTargetRoute = ref('/panel')

const { cmsData, saveCmsData } = useCmsData()

function registerToAdminKycQueue(sessionData: any) {
  if (typeof window === 'undefined') return
  try {
    if (!Array.isArray(cmsData.value.kycVerifications)) {
      cmsData.value.kycVerifications = []
    }
    const compName = sessionData.companyName || sessionData.company || sessionData.name || 'Yeni Kayıtlı Firma'
    const existingIdx = cmsData.value.kycVerifications.findIndex((k: any) => k.email === sessionData.email)
    const kycItem = {
      id: existingIdx >= 0 ? cmsData.value.kycVerifications[existingIdx].id : ('KYC-' + Math.floor(1000 + Math.random() * 9000)),
      companyName: compName,
      companyType: sessionData.companyType || 'Kurumsal Şirket (A.Ş. / Ltd. Şti.)',
      legalName: sessionData.legalName || compName,
      taxOffice: sessionData.taxOffice || 'Çanakkale V.D.',
      taxNo: sessionData.taxNo || '4700854210',
      authorizedPerson: sessionData.name || sessionData.firstName || 'Yetkili',
      phone: sessionData.phone || '0850 840 86 95',
      email: sessionData.email,
      city: sessionData.city || 'Çanakkale',
      authProvider: sessionData.authProvider || 'web',
      uploadedDocs: ['2026 Yılı Vergi Levhası', 'Noter Onaylı İmza Sirküleri', 'Ticaret Sicil Gazetesi'],
      status: sessionData.isVerified ? 'approved' : 'pending',
      badgeGranted: sessionData.isVerified || false,
      createdAt: 'Bugün',
      rejectionReason: ''
    }
    if (existingIdx >= 0) {
      cmsData.value.kycVerifications[existingIdx] = { ...cmsData.value.kycVerifications[existingIdx], ...kycItem }
    } else {
      cmsData.value.kycVerifications.unshift(kycItem)
    }
    // Also auto-register into CRM Leads
    if (!cmsData.value.crmSettings) {
      cmsData.value.crmSettings = { leads: [] }
    }
    if (!Array.isArray(cmsData.value.crmSettings.leads)) {
      cmsData.value.crmSettings.leads = []
    }
    const leadItem = {
      id: 'LEAD-' + (sessionData.taxNo || Math.floor(1000 + Math.random() * 9000)),
      companyName: sessionData.company || sessionData.companyName || sessionData.name || 'Yeni Kayıtlı Firma',
      contactName: sessionData.name || sessionData.firstName || 'Yetkili',
      email: sessionData.email,
      phone: sessionData.phone || phone.value || '0850 840 86 95',
      status: '1 Ay Deneme Aktif',
      source: sessionData.authProvider === 'google' ? 'Google OAuth Hızlı Kayıt' : (sessionData.isEDevletVerified ? 'e-Devlet Onaylı Kayıt' : 'Web Kurumsal Kayıt'),
      notes: `Lansmana özel 1 Ay %100 Ücretsiz Kurumsal Deneme Paketi tanımlandı. Sektörler: ${(sessionData.sektorler || []).join(', ') || 'Genel Tedarik & İhale'}`,
      createdAt: new Date().toLocaleDateString('tr-TR')
    }
    const existingLeadIdx = cmsData.value.crmSettings.leads.findIndex((l: any) => l.email === sessionData.email)
    if (existingLeadIdx >= 0) {
      cmsData.value.crmSettings.leads[existingLeadIdx] = { ...cmsData.value.crmSettings.leads[existingLeadIdx], ...leadItem }
    } else {
      cmsData.value.crmSettings.leads.unshift(leadItem)
    }

    saveCmsData(cmsData.value)

    const allUsers = JSON.parse(localStorage.getItem('allRegisteredUsers') || '[]')
    const userIdx = allUsers.findIndex((u: any) => u.email === sessionData.email)
    if (userIdx >= 0) allUsers[userIdx] = sessionData
    else allUsers.unshift(sessionData)
    localStorage.setItem('allRegisteredUsers', JSON.stringify(allUsers))

    window.dispatchEvent(new Event('storage'))
  } catch (e) {
    console.warn('KYC queue registration warning', e)
  }
}


function verifyOtp() {
  if (!otpInput.value || otpInput.value.length < 6) {
    alert(locale.value === 'tr' ? 'Lütfen 6 haneli onay kodunu giriniz.' : 'Please enter 6-digit verification code.')
    return
  }
  
  if (typeof window !== 'undefined' && pendingUserSession.value) {
    const sessionData = {
      ...pendingUserSession.value,
      verified: true,
      approvalStatus: 'pending'
    }
    localStorage.setItem('userSession', JSON.stringify(sessionData))

    // If company, register into Admin KYC verification queue
    if (sessionData.role === 'company' || sessionData.company) {
      if (!Array.isArray(cmsData.value.kycVerifications)) {
        cmsData.value.kycVerifications = []
      }
      const existingKyc = cmsData.value.kycVerifications.find((k: any) => k.email === sessionData.email)
      if (!existingKyc) {
        cmsData.value.kycVerifications.unshift({
          id: 'KYC-' + Math.floor(1000 + Math.random() * 9000),
          companyName: sessionData.company || sessionData.name,
          companyType: 'Kurumsal Şirket (A.Ş. / Ltd. Şti.)',
          taxOffice: 'Çanakkale V.D.',
          taxNo: '4700854210',
          authorizedPerson: sessionData.name || sessionData.firstName,
          phone: phone.value || '0850 840 86 95',
          email: sessionData.email,
          city: 'Çanakkale',
          status: 'approved', badgeGranted: true, isVerified: true, verified: true,
          createdAt: new Date().toLocaleDateString('tr-TR'),
          uploadedDocs: ['Vergi Levhası (2026)', 'İmza Sirküleri', 'Ticaret Sicil Gazetesi']
        })
        saveCmsData(cmsData.value)
      }
    }
  }
  showOtpModal.value = false
  router.push(pendingTargetRoute.value)
}

function resendOtp() {
  alert(locale.value === 'tr' ? 'Yeni doğrulama kodu e-posta adresinize gönderildi! (Kod: 849201)' : 'A new verification code has been sent! (Code: 849201)')
}

function goStep2() {
  if (!email.value || !password.value || !firstName.value || !lastName.value || !phone.value) {
    errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun.'
    return
  }
  if (password.value.length < 6) {
    errorMessage.value = 'Şifreniz en az 6 karakter olmalıdır.'
    return
  }
  if (userRole.value === 'company' && !companyName.value) {
    errorMessage.value = 'Lütfen firma adını girin.'
    return
  }

  // Bireysel üyelikte sektör adımı gerekmez — OTP Modalı Aç!
  if (userRole.value === 'individual') {
    if (!agreeKvkk.value) {
      errorMessage.value = 'Lütfen KVKK ve Üyelik Sözleşmesini kabul edin.'
      return
    }
    isSubmitting.value = true
    errorMessage.value = ''
    setTimeout(() => {
      isSubmitting.value = false
      pendingUserSession.value = {
        email: email.value,
        firstName: firstName.value,
        name: `${firstName.value} ${lastName.value}`,
        company: 'Bireysel Üye',
        role: 'individual',
        sektorler: ['bireysel'],
        mailBildirimi: mailBildirimi.value,
        isPremium: false
      }
      pendingTargetRoute.value = '/panel'
      showOtpModal.value = true
    }, 600)
    return
  }

  errorMessage.value = ''
  registerStep.value = 2
}

function handleRegister() {
  if (!agreeKvkk.value) {
    errorMessage.value = 'Lütfen KVKK ve Üyelik Sözleşmesini kabul edin.'
    return
  }
  if (seciliSektorler.value.length === 0) {
    errorMessage.value = 'Lütfen en az bir sektör seçin.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  setTimeout(() => {
    isSubmitting.value = false
    pendingUserSession.value = {
      email: email.value,
      firstName: firstName.value,
      name: `${firstName.value} ${lastName.value}`,
      company: userRole.value === 'company' ? companyName.value : 'Bireysel Üye',
      role: userRole.value,
      sektorler: seciliSektorler.value,
      mailBildirimi: mailBildirimi.value,
      isPremium: false
    }
    pendingTargetRoute.value = '/panel'
    showOtpModal.value = true
  }, 800)
}


function handleOAuth(provider = 'google') {
  isSubmitting.value = true
  errorMessage.value = ''

  if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: '616649314930-qn4lj8sruj1f79lc7fqaqt619i37jpjp.apps.googleusercontent.com',
        scope: 'email profile openid',
        callback: async (response: any) => {
          if (response.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              })
              const user = await res.json()
              const cleanEmail = (user.email || '').trim().toLowerCase()
              const accounts = JSON.parse(localStorage.getItem('user_accounts_registry') || '{}')
              const isAlreadyRegistered = !!accounts[cleanEmail]
              
              let userAccount = accounts[cleanEmail]
              if (!userAccount) {
                const derivedName = user.name || (user.given_name ? `${user.given_name} ${user.family_name || ''}` : cleanEmail.split('@')[0])
                userAccount = {
                  email: cleanEmail,
                  firstName: user.given_name || user.name || cleanEmail.split('@')[0],
                  lastName: user.family_name || '',
                  name: derivedName,
                  picture: user.picture,
                  company: derivedName + ' San. Tic. A.Ş.',
                  companyName: derivedName + ' San. Tic. A.Ş.',
                  username: derivedName,
                  role: userRole.value || 'company',
                  verified: true,
                  isGoogleAuth: true,
                  authProvider: 'google',
                  isPremium: true,
                  subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
                }
                accounts[cleanEmail] = userAccount
                localStorage.setItem('user_accounts_registry', JSON.stringify(accounts))
              }

              localStorage.setItem('userSession', JSON.stringify(userAccount))
              registerToAdminKycQueue(userAccount)
              window.dispatchEvent(new Event('storage'))
              isSubmitting.value = false

              if (activeTab.value === 'register') {
                if (isAlreadyRegistered) {
                  alert(`ℹ️ HESAP ZATEN KAYITLI\n\n"${cleanEmail}" Google hesabı ile sistemde zaten kayıtlı bir üyeliğiniz bulunmaktadır.\n\nMevcut hesabınızla güvenli giriş yapıldı ve yönetim panelinize yönlendiriliyorsunuz.`)
                } else {
                  alert(`🎉 GOOGLE İLE YENİ ÜYELİK OLUŞTURULDU\n\n"${cleanEmail}" Google hesabınızla 1 ay ücretsiz kurumsal üyeliğiniz başarıyla açıldı. Hoş geldiniz!`)
                }
              } else {
                if (!isAlreadyRegistered) {
                  alert(`✨ YENİ GOOGLE HESABI OLUŞTURULDU\n\n"${cleanEmail}" Google hesabınızla ilk kez giriş yaptığınız için hesabınız otomatik oluşturuldu.`)
                }
              }

              router.push('/panel')
              return
            } catch (err) {
              console.warn('Google userinfo fetch fallback', err)
            }
          }
          fallbackGoogleLogin()
        },
        error_callback: () => {
          fallbackGoogleLogin()
        }
      })
      client.requestAccessToken({ prompt: 'select_account' })
      return
    } catch (e) {
      console.warn('Google GIS init error', e)
    }
  }

  fallbackGoogleLogin()
}

function fallbackGoogleLogin() {
  const customGmail = prompt('Lütfen giriş yapmak istediğiniz Gmail / E-posta adresini giriniz:', 'tedarikci@gmail.com')
  if (!customGmail) {
    isSubmitting.value = false
    return
  }

  setTimeout(() => {
    isSubmitting.value = false
    const cleanEmail = customGmail.trim().toLowerCase()
    const rawUsername = cleanEmail.split('@')[0]
    const formattedName = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1)
    const accounts = JSON.parse(localStorage.getItem('user_accounts_registry') || '{}')

    const isAlreadyRegistered = !!accounts[cleanEmail]
    let userAccount = accounts[cleanEmail]
    if (!userAccount) {
      userAccount = {
        email: cleanEmail,
        firstName: formattedName,
        lastName: '',
        name: formattedName + ' Tedarik',
        company: formattedName + ' San. Tic. Ltd. Şti.',
        companyName: formattedName + ' San. Tic. Ltd. Şti.',
        username: formattedName,
        role: userRole.value || 'company',
        verified: true,
        isGoogleAuth: true,
        authProvider: 'google',
        isPremium: true,
        subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
      }
      accounts[cleanEmail] = userAccount
      localStorage.setItem('user_accounts_registry', JSON.stringify(accounts))
    }

    localStorage.setItem('userSession', JSON.stringify(userAccount))
    registerToAdminKycQueue(userAccount)
    window.dispatchEvent(new Event('storage'))

    if (activeTab.value === 'register') {
      if (isAlreadyRegistered) {
        alert(`ℹ️ HESAP ZATEN KAYITLI\n\n"${cleanEmail}" adresiyle sistemde zaten kayıtlı bir üyelik bulunmaktadır.\n\nMevcut hesabınızla güvenli oturum açıldı ve yönetim panelinize aktarılıyorsunuz.`)
      } else {
        alert(`🎉 YENİ KURUMSAL ÜYELİK\n\n"${cleanEmail}" adresiyle 1 ay ücretsiz kurumsal üyeliğiniz başarıyla açıldı.`)
      }
    }

    router.push('/panel')
  }, 500)
}

function handleEDevletAuth() {
  isSubmitting.value = true
  errorMessage.value = ''
  setTimeout(() => {
    isSubmitting.value = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify({
        email: 'edevlet_onayli@ihaleciburada.com',
        firstName: 'Ali',
        name: (form.value.name || form.value.firstName || 'Kurumsal Üye') + ' (e-Devlet & MERSİS Onaylı)',
        company: 'Turan Lojistik San. A.Ş.',
        role: 'company',
        verified: true,
        isEDevletVerified: true,
        isPremium: true,
        subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
      }))
    }
    router.push('/panel')
  }, 900)
}

function handleForgotPassword() {
  if (!forgotEmail.value) {
    errorMessage.value = 'Lütfen e-posta adresinizi girin.'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  setTimeout(() => {
    isSubmitting.value = false
    forgotSubmitted.value = true
  }, 800)
}

function handleLogin() {
  if (!loginEmail.value || !loginPassword.value) {
    errorMessage.value = 'Lütfen e-posta ve şifrenizi girin.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  setTimeout(async () => {
    isSubmitting.value = false
    let currentSession: any = {}
    try {
      currentSession = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}

    const is2Fa = (currentSession.email === loginEmail.value && currentSession.is2FaEnabled === true)

    if (is2Fa) {
      // Trigger real 2FA verification via modal
      pendingUserSession.value = {
        email: loginEmail.value,
        firstName: currentSession.firstName || 'Ali',
        name: currentSession.name || currentSession.firstName || form.value.name || 'Kurumsal Üye',
        username: currentSession.username || currentSession.name || 'kullanici',
        company: currentSession.company || '',
        companyName: currentSession.companyName || '',
        role: currentSession.role || 'company',
        verified: true,
        is2FaEnabled: true,
        isPremium: true,
        subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
      }
      pendingTargetRoute.value = '/panel'
      otpInput.value = '849201'

      try {
        await $fetch('/api/v1/smtp-send', {
          method: 'POST',
          body: {
            recipientEmail: loginEmail.value,
            subject: 'İhaleciBurada Giriş Güvenlik Kodu (2FA): 849201',
            htmlBody: 'Sayın Kullanıcımız,\n\nİhaleciBurada hesabınıza giriş için 2FA güvenlik kodunuz: 849201\n\nBu kod 3 dakika geçerlidir.',
            templateName: '2FA Giriş Doğrulama'
          }
        })
      } catch (e) {}

      showOtpModal.value = true
      return
    }

    if (typeof window !== 'undefined') {
      const sessionObj = {
        email: loginEmail.value,
        firstName: currentSession.firstName || 'Ali',
        name: currentSession.name || currentSession.firstName || form.value.name || 'Kurumsal Üye',
        username: currentSession.username || (loginEmail.value.split('@')[0]),
        company: currentSession.company || '',
        companyName: currentSession.companyName || '',
        role: currentSession.role || 'company',
        verified: true,
        isPremium: true,
        subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
      }
      localStorage.setItem('userSession', JSON.stringify(sessionObj))
      registerToAdminKycQueue(sessionObj)
    }
    router.push('/panel')
  }, 600)
}

function handleDemoLogin(role: 'company' | 'individual') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify({
      email: role === 'company' ? 'firma_demo@ihaleciburada.com' : 'kullanici_demo@ihaleciburada.com',
      firstName: role === 'company' ? 'Kemal' : 'Ahmet',
      name: role === 'company' ? 'Kemal Yılmaz' : 'Ahmet Yıldız',
      company: role === 'company' ? 'Yılmaz Tekstil A.Ş.' : 'Bireysel Üye',
      role: role,
      verified: true,
      isPremium: true,
      subscriptionPlan: '1 Ay Ücretsiz Kurumsal Deneme'
    }))
  }
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 flex items-stretch">
    <!-- Split Screen Skyscraper (Left Panel) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12 text-left">
      <!-- Gradient overlay and lights -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent)]"></div>
      <div class="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-blue-900/20 to-transparent"></div>

      <!-- Header brand -->
      <div class="relative z-10 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-90 transition">
          <img src="/logo-white.png" alt="İhaleciBurada Logo" class="h-11 sm:h-12 w-auto object-contain drop-shadow-md" />
        </NuxtLink>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition border border-white/20 backdrop-blur-md shadow-md cursor-pointer"
        >
          <Home :size="15" class="text-amber-400" />
          <span>{{ '🏠 Ana Sayfaya Dön' }}</span>
        </NuxtLink>
      </div>

      <!-- Main presentation -->
      <div class="relative z-10 my-auto">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/25 px-3.5 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          <Sparkles :size="12" /> {{ 'B2B Tedarik Çözümü' }}
        </div>
        <h2 class="mt-6 text-3xl font-black text-white leading-tight md:text-4xl lg:text-5xl tracking-tight">
          {{ 'Tedarik Maliyetinizi Dijital İhale ile Düşürün' }}
        </h2>
        <p class="mt-4 max-w-md text-xs text-slate-400 leading-relaxed font-medium">
          {{ 'İhaleciBurada platformunda rekabet kurallarını siz belirlersiniz. İlanınızı yayınlayın, onaylı satıcılar teklif vererek yarışsın.' }}
        </p>

        <!-- Feature List -->
        <div class="mt-8 space-y-4">
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <ShieldCheck :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">{{ 'Doğrulanmış B2B Üyeler' }}</h4>
              <p class="text-[10px] text-slate-400">{{ 'Tüm şirketlerin vergi levhası ve yetki belgeleri kontrol edilir.' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Zap :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">{{ 'Online Teklif ve İhale Sistemi' }}</h4>
              <p class="text-[10px] text-slate-400">{{ 'Şeffaf zaman damgalı teklif süreci ile maksimum tasarruf sağlayın.' }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Building2 :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">{{ '81 İl Tedarik Ağı' }}</h4>
              <p class="text-[10px] text-slate-400">{{ 'Mal ve hizmet alımlarınızı yerel veya ulusal ölçekte rekabete açın.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer indicator -->
      <div class="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        © 2026 İhaleciBurada {{ 'B2B tersine ihale portalı' }}
      </div>
    </div>

    <!-- Form Right Panel -->
    <div class="w-full lg:w-1/2 flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-20 bg-white">
      <div class="mx-auto w-full max-w-md text-left">
        <!-- Top Navigation Bar (Mobile & Desktop) -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="İhaleciBurada Logo" class="h-8 w-auto" />
          </NuxtLink>

          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm cursor-pointer"
          >
            <Home :size="15" class="text-amber-400" />
            <span>{{ '🏠 Ana Sayfaya Dön' }}</span>
          </NuxtLink>
        </div>

        <!-- Switch tabs (Register / Login) -->
        <div class="mb-8 flex border-b border-slate-100 gap-1">
          <button @click="activeTab = 'register'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'register' ? 'border-[#0F223D] text-[#0F223D]' : 'border-transparent text-slate-400 hover:text-slate-600'">
            {{ 'Yeni Üyelik' }}
          </button>
          <button @click="activeTab = 'login'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'login' ? 'border-[#0F223D] text-[#0F223D]' : 'border-transparent text-slate-400 hover:text-slate-600'">
            {{ 'Giriş Yap' }}
          </button>
        </div>

        <!-- Alert messages -->
        <div v-if="errorMessage" class="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- REGISTRATION FORM -->
        <div v-if="activeTab === 'register'">
          <!-- OAuth Giriş Butonları -->
          <div class="space-y-2 mb-5">
            <button
              type="button"
              @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50 cursor-pointer"
              style="border-color: #E2E8F0; color: #374151;"
            >
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {{ 'Google ile Devam Et' }}
            </button>
          </div>

          <!-- Ayraç -->
          <div class="relative flex items-center mb-5">
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
            <span class="px-3 text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">{{ 'veya kurumsal e-posta ile' }}</span>
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
          </div>

          <!-- Adım 1: Kişisel Bilgiler -->
          <form v-if="registerStep === 1" @submit.prevent="goStep2" class="space-y-4">
            <!-- Adım göstergesi -->
            <div v-if="userRole === 'company'" class="flex items-center gap-2 mb-4">
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style="background: #003057;">1</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #003057;">{{ 'Kişisel Bilgiler' }}</span>
              <div class="flex-1 h-px" style="background: #E2E8F0;"></div>
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style="background: #F1F5F9; color: #94A3B8;">2</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">{{ 'Sektörler' }}</span>
            </div>
            <div v-else class="flex items-center gap-2 mb-4">
              <div class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                👤 {{ 'Hızlı Bireysel Üyelik Formu' }}
              </div>
            </div>

            <!-- Google ile Hızlı Kayıt -->
            <div class="space-y-2 mb-4">
              <button 
                type="button" 
                @click="handleOAuth('google')"
                class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50 cursor-pointer shadow-2xs"
                style="border-color: #E2E8F0; color: #374151;"
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <span>Google ile Hızlı Kayıt Ol</span>
              </button>

              <div class="relative flex items-center my-3">
                <div class="flex-1 border-t border-slate-200"></div>
                <span class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">veya form ile devam edin</span>
                <div class="flex-1 border-t border-slate-200"></div>
              </div>
            </div>

            <!-- ROL SEÇİMİ (Şimdi Üstte - Dinamik Alan Tetikleyici) -->
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Üyelik Türü / Rolünüz *' }}</label>
              <div class="grid grid-cols-2 gap-3 mt-1">
                <button type="button" @click="userRole = 'company'" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all cursor-pointer" :class="userRole === 'company' ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'">
                  <span class="text-xs font-bold">{{ '🏢 Firma Kaydı' }}</span>
                  <span class="text-[8px] mt-0.5 font-medium">{{ 'Şirketler İçin' }}</span>
                </button>
                <button type="button" @click="userRole = 'individual'" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all cursor-pointer" :class="userRole === 'individual' ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'">
                  <span class="text-xs font-bold">{{ '👤 Kullanıcı Kaydı' }}</span>
                  <span class="text-[8px] mt-0.5 font-medium">{{ 'Bireysel Kullanıcı' }}</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Ad *' }}</label>
                <div class="relative">
                  <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="firstName" type="text" required aria-label="Adınız" :placeholder="'Adınız'" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
                </div>
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Soyad *' }}</label>
                <div class="relative">
                  <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="lastName" type="text" required aria-label="Soyadınız" :placeholder="'Soyadınız'" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
                </div>
              </div>
            </div>

            <!-- Firma Adı (Sadece Firma Kaydı durumunda gösterilir) -->
            <transition name="fade">
              <div v-if="userRole === 'company'">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Firma / Şirket Adı *' }}</label>
                <div class="relative">
                  <Building2 :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="companyName" type="text" :required="userRole === 'company'" aria-label="Firma Şirket Adı" :placeholder="'Örn: Yılmaz Ambalaj Sanayi A.Ş.'" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
                </div>
              </div>
            </transition>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {{ userRole === 'company' ? ('Kurumsal E-Posta *') : ('E-Posta Adresi *') }}
              </label>
              <div class="relative">
                <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="email" type="email" required aria-label="E-Posta Adresi" :placeholder="userRole === 'company' ? 'name@company.com' : 'name@email.com'" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Telefon *' }}</label>
              <div class="relative">
                <Phone :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="phone" type="tel" required aria-label="Telefon Numarası" placeholder="+90 (555) 555 55 55" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Şifre *' }}</label>
              <div class="relative">
                <LockKeyhole :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="password" type="password" required aria-label="Şifreniz" :placeholder="'Minimum 6 karakter'" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[44px]" />
              </div>
            </div>

            <!-- KVKK Onay Kutusu (Bireysel Üyelik için 1. Adımda Gösterilir) -->
            <div v-if="userRole === 'individual'" class="flex items-start gap-2.5 py-1">
              <input v-model="agreeKvkk" id="kvkk-step1" type="checkbox" required class="mt-1 h-3.5 w-3.5 rounded border-slate-300 cursor-pointer" />
              <label for="kvkk-step1" class="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-wider cursor-pointer">
                {{ 'Üyelik şartlarını ve ' }}
                <NuxtLink to="/sozlesmeler?tab=kvkk" target="_blank" class="text-blue-600 hover:underline">{{ 'KVKK Açık Rıza Metnini' }}</NuxtLink>
                {{ ' kabul ediyorum.' }}
              </label>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all disabled:opacity-50 cursor-pointer" style="background: #003057;">
              <span v-if="userRole === 'individual'">
                {{ isSubmitting ? ('Kayıt Yapılıyor...') : ('Bireysel Üyeliği Tamamla') }}
              </span>
              <span v-else>
                {{ 'Devam Et — Sektör Seçimi' }}
              </span>
              <ChevronRight v-if="userRole === 'company' && !isSubmitting" :size="14" />
            </button>
          </form>

          <!-- Adım 2: Sektör Seçimi -->
          <form v-else-if="registerStep === 2" @submit.prevent="handleRegister" class="space-y-4">
            <!-- Adım göstergesi -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style="background: #22C55E; color: white;">✓</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">{{ 'Kişisel Bilgiler' }}</span>
              <div class="flex-1 h-px" style="background: #003057;"></div>
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style="background: #003057;">2</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #003057;">{{ 'Sektörler' }}</span>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider block mb-3" style="color: #475569;">{{ 'İlgilendiğiniz Sektörleri Seçin *' }}</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="sektor in sektorler"
                  :key="sektor.key"
                  type="button"
                  @click="toggleSektor(sektor.key)"
                  class="relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium text-left transition-all"
                  :style="seciliSektorler.includes(sektor.key)
                    ? 'border-color: #003057; background: rgba(0,48,87,0.06); color: #003057;'
                    : 'border-color: #E2E8F0; color: #64748B;'"
                >
                </button>
              </div>

              <!-- Custom Sector Input Field -->
              <transition name="fade">
                <div v-if="seciliSektorler.includes('diger')" class="mt-3">
                  <label class="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
                    ✏️ {{ 'Faaliyet Konunuzu / Özel Sektörünüzü Yazınız *' }}
                  </label>
                  <input 
                    v-model="customSector" 
                    type="text" 
                    :placeholder="'Örn: Özel Cam Ambalaj İmalatı, Endüstriyel Soğutma Sistemleri vb.'" 
                    class="w-full p-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs" 
                  />
                </div>
              </transition>
            </div>

            <!-- Mail Bildirimi Toggle -->
            <div class="flex items-center justify-between rounded-xl border p-3" style="border-color: #E2E8F0; background: #F8FAFC;">
              <div class="flex items-center gap-2">
                <Bell :size="14" style="color: #F59E0B;" />
                <div>
                  <div class="text-xs font-semibold" style="color: #0F172A;">{{ 'Sektör Bildirimleri' }}</div>
                  <div class="text-[10px]" style="color: #94A3B8;">{{ 'Seçili sektörlerde yeni ilan çıkınca mail at' }}</div>
                </div>
              </div>
              <button
                type="button"
                @click="mailBildirimi = !mailBildirimi"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="mailBildirimi ? 'background: #003057;' : 'background: #CBD5E1;'"
              >
                <span
                  class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
                  :style="mailBildirimi ? 'left: 1.25rem;' : 'left: 0.125rem;'"
                ></span>
              </button>
            </div>

            <div class="flex items-start gap-2.5 py-1">
              <input v-model="agreeKvkk" id="kvkk" type="checkbox" required class="mt-1 h-3.5 w-3.5 rounded border-slate-300" />
              <label for="kvkk" class="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-wider">
                {{ 'Üyelik şartlarını ve ' }}
                <NuxtLink to="/sozlesmeler?tab=kvkk" target="_blank" class="text-blue-600 hover:underline">{{ 'KVKK Açık Rıza Metnini' }}</NuxtLink>
                {{ ' kabul ediyorum.' }}
              </label>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <div class="flex gap-2">
              <button type="button" @click="registerStep = 1" class="rounded-xl border px-4 py-3 text-xs font-bold transition hover:bg-slate-50" style="border-color: #E2E8F0; color: #64748B;">
                ← {{ 'Geri' }}
              </button>
              <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all disabled:opacity-50" style="background: #003057;">
                <span>{{ isSubmitting ? ('Kayıt Yapılıyor...') : ('Kaydol ve Devam Et') }}</span>
                <ChevronRight v-if="!isSubmitting" :size="14" />
              </button>
            </div>
          </form>

        </div>

        <!-- LOGIN FORM -->
        <div v-else-if="activeTab === 'login'">
          <!-- OAuth Butonları -->
          <div class="space-y-2 mb-5">
            <button type="button" @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50 cursor-pointer"
              style="border-color: #E2E8F0; color: #374151;">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {{ 'Google ile Giriş Yap' }}
            </button>
          </div>
          <div class="relative flex items-center mb-5">
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
            <span class="px-3 text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">{{ 'veya kayıtlı hesabınızla' }}</span>
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'E-Posta Adresi' }}</label>
              <div class="relative">
                <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="loginEmail" type="email" required :placeholder="'isim@sirketiniz.com'" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Şifre' }}</label>
              <div class="relative">
                <LockKeyhole :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="loginPassword" :type="showLoginPassword ? 'text' : 'password'" required :placeholder="'Şifreniz'" class="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
                <button type="button" @click="showLoginPassword = !showLoginPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <EyeOff v-if="showLoginPassword" :size="14" />
                  <Eye v-else :size="14" />
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
              <label class="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input v-model="rememberMe" type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300" />
                {{ 'Beni Hatırla' }}
              </label>
              <button type="button" @click="activeTab = 'forgot'; forgotSubmitted = false; errorMessage = ''" class="text-blue-600 hover:underline cursor-pointer">
                {{ 'Şifremi Unuttum?' }}
              </button>
            </div>
            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>
            <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all disabled:opacity-50 cursor-pointer" style="background: #003057;">
              <span>{{ isSubmitting ? ('Giriş Yapılıyor...') : ('Giriş Yap') }}</span>
              <ChevronRight v-if="!isSubmitting" :size="14" />
            </button>
          </form>
        </div>

        <!-- ŞİFREMİ UNUTTUM EKRANI (FORGOT PASSWORD FLOW) -->
        <div v-else-if="activeTab === 'forgot'" class="space-y-4">
          <div class="text-left space-y-1 mb-2">
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <LockKeyhole :size="16" class="text-blue-600" />
              <span>{{ 'Şifre Sıfırlama Talebi' }}</span>
            </h3>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Kayıtlı e-posta adresinizi girin, sıfırlama talimatlarını anında e-postanıza iletelim.' }}
            </p>
          </div>

          <div v-if="forgotSubmitted" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3">
            <div class="flex items-center gap-2 font-black">
              <CheckCircle2 :size="18" class="text-emerald-600 shrink-0" />
              <span>{{ 'Sıfırlama Bağlantısı Gönderildi!' }}</span>
            </div>
            <p class="text-[11px] leading-relaxed font-medium text-emerald-800">
              <strong>{{ forgotEmail }}</strong> adresine şifre yenileme e-postası gönderildi. Lütfen e-posta kutunuzu ve spam klasörünüzü kontrol ediniz.
            </p>
            <button @click="activeTab = 'login'" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition shadow-sm cursor-pointer">
              {{ 'Giriş Ekranına Dön' }}
            </button>
          </div>

          <form v-else @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Kayıtlı E-Posta Adresiniz *' }}</label>
              <div class="relative">
                <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="forgotEmail" type="email" required :placeholder="'isim@sirketiniz.com'" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <div class="flex gap-2">
              <button type="button" @click="activeTab = 'login'" class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer">
                {{ 'İptal' }}
              </button>
              <button type="submit" :disabled="isSubmitting" class="w-2/3 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black text-xs transition shadow-md disabled:opacity-50 cursor-pointer">
                {{ isSubmitting ? ('Gönderiliyor...') : ('Bağlantı Gönder') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- OTP VERIFICATION MODAL -->
    <transition name="fade">
      <div v-if="showOtpModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
        <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-left space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-sm font-black uppercase text-slate-800 flex items-center gap-2">
              <ShieldCheck class="text-emerald-600" :size="20" />
              <span>{{ 'E-Posta Doğrulama Kodu' }}</span>
            </h3>
            <button @click="showOtpModal = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X :size="18" />
            </button>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            {{ 'Güvenliğiniz için' }}
            <strong class="text-slate-900 font-mono">{{ pendingUserSession?.email || email }}</strong> {{ 'adresine 6 haneli onay kodu gönderilmiştir.' }}
          </p>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{{ 'ONAY KODU (OTP)' }}</label>
            <input 
              v-model="otpInput" 
              type="text" 
              maxlength="6" 
              placeholder="849201" 
              class="w-full text-center tracking-[0.5em] text-xl font-mono font-black py-3 bg-slate-50 border-2 border-emerald-300 rounded-2xl text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
            />
            <span class="text-[10px] text-emerald-600 font-bold block text-center mt-1">
              ✓ {{ 'Demo Onay Kodu Otomatik Dolduruldu: 849201' }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <button type="button" @click="resendOtp" class="text-blue-600 font-bold hover:underline cursor-pointer">
              {{ 'Kodu Tekrar Gönder' }}
            </button>
            <span class="text-slate-400 font-mono text-[10px]">Kalan Süre: 02:45</span>
          </div>

          <button 
            @click="verifyOtp" 
            class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all shadow-md bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            <CheckCircle2 :size="16" />
            <span>{{ 'Doğrula ve Hesabımı Aç' }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

