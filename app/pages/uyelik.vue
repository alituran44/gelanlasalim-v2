<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
const activeTab = ref<'login' | 'register' | 'guest' | 'forgot'>('register')
const showCookieConsent = ref(true)
const registerStep = ref<1 | 2>(1)

onMounted(() => {
  detectLocale()
  if (route.query.tab === 'guest') {
    activeTab.value = 'guest'
  } else if (route.query.tab === 'login') {
    activeTab.value = 'login'
  }
})

// Guest Access Fields
const guestName = ref('')
const guestContact = ref('')
const guestCompany = ref('')
const guestSector = ref('İnşaat & Yapı')

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

function verifyOtp() {
  if (!otpInput.value || otpInput.value.length < 6) {
    alert(locale.value === 'tr' ? 'Lütfen 6 haneli onay kodunu giriniz.' : 'Please enter 6-digit verification code.')
    return
  }
  if (typeof window !== 'undefined' && pendingUserSession.value) {
    localStorage.setItem('userSession', JSON.stringify(pendingUserSession.value))
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
    pendingTargetRoute.value = '/firma-dogrulama'
    showOtpModal.value = true
  }, 800)
}

function handleOAuth(provider: 'google' | 'facebook') {
  alert(`${provider === 'google' ? 'Google' : 'Facebook'} kimlik doğrulama simülasyonu başlatıldı.`)
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
        name: 'Ali Turan (e-Devlet & MERSİS Onaylı)',
        company: 'Turan Lojistik San. A.Ş.',
        role: 'company',
        isEDevletVerified: true,
        isPremium: true
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

  setTimeout(() => {
    isSubmitting.value = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify({
        email: loginEmail.value,
        firstName: 'Ali',
        name: 'Ali Turan',
        role: 'buyer',
        isPremium: true
      }))
    }
    router.push('/panel')
  }, 1000)
}

function handleDemoLogin(role: 'company' | 'individual') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify({
      email: role === 'company' ? 'firma_demo@ihaleciburada.com' : 'kullanici_demo@ihaleciburada.com',
      firstName: role === 'company' ? 'Kemal' : 'Ahmet',
      name: role === 'company' ? 'Kemal Yılmaz' : 'Ahmet Yıldız',
      company: role === 'company' ? 'Yılmaz Tekstil A.Ş.' : 'Bireysel Üye',
      role: role,
      isPremium: true
    }))
  }
  router.push('/panel')
}

function handleGuestEntry() {
  if (!guestName.value || !guestContact.value) {
    errorMessage.value = 'Lütfen ad soyad ve iletişim bilgilerinizi girin.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  setTimeout(() => {
    isSubmitting.value = false
    if (typeof window !== 'undefined') {
      const existingLeads = JSON.parse(localStorage.getItem('guestLeads') || '[]')
      existingLeads.push({
        name: guestName.value,
        contact: guestContact.value,
        company: guestCompany.value || 'Misafir Firma',
        sector: guestSector.value,
        date: new Date().toISOString()
      })
      localStorage.setItem('guestLeads', JSON.stringify(existingLeads))

      localStorage.setItem('userSession', JSON.stringify({
        email: guestContact.value.includes('@') ? guestContact.value : 'misafir@ihaleciburada.com',
        firstName: guestName.value.split(' ')[0] || 'Misafir',
        name: guestName.value,
        company: guestCompany.value || 'Misafir Firma',
        role: 'guest',
        isGuest: true
      }))
    }
    router.push('/panel')
  }, 600)
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
          <img src="/logo.png" alt="İhaleciBurada Logo" class="h-12 sm:h-14 w-auto bg-white/90 p-1.5 rounded-xl shadow-xs object-contain" />
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
          {{ 'Tedarik Maliyetinizi Canlı Eksiltme ile Düşürün' }}
        </h2>
        <p class="mt-4 max-w-md text-xs text-slate-400 leading-relaxed font-medium">
          {{ 'İhaleciBurada arenasında rekabet kurallarını siz belirlersiniz. İlanınızı yayınlayın, onaylı satıcılar anlık fiyat kırarak yarışsın.' }}
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
              <h4 class="text-xs font-bold text-white">{{ 'Canlı Eksiltme Teknolojisi' }}</h4>
              <p class="text-[10px] text-slate-400">{{ 'Şeffaf zaman damgalı teklif yarışı ile maksimum tasarruf sağlayın.' }}</p>
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

        <!-- Switch tabs (Register / Login / Guest) -->
        <div class="mb-8 flex border-b border-slate-100 gap-1">
          <button @click="activeTab = 'register'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'register' ? 'border-[#0F223D] text-[#0F223D]' : 'border-transparent text-slate-400 hover:text-slate-600'">
            {{ 'Yeni Üyelik' }}
          </button>
          <button @click="activeTab = 'login'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'login' ? 'border-[#0F223D] text-[#0F223D]' : 'border-transparent text-slate-400 hover:text-slate-600'">
            {{ 'Giriş Yap' }}
          </button>
          <button @click="activeTab = 'guest'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1" :class="activeTab === 'guest' ? 'border-[#0F223D] text-[#0F223D] bg-slate-50 rounded-t-lg font-black' : 'border-transparent text-slate-400 hover:text-slate-600'">
            <span>👁️</span>
            <span>{{ 'Misafir Girişi' }}</span>
          </button>
        </div>

        <!-- Alert messages -->
        <div v-if="errorMessage" class="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- REGISTRATION FORM -->
        <div v-if="activeTab === 'register'">
          <!-- e-Devlet & OAuth Giriş Butonları -->
          <div class="space-y-2 mb-5">
            <!-- e-Devlet Kapısı SSO Giriş (Resmi Kurumsal Giriş) -->
            <button
              type="button"
              @click="handleEDevletAuth"
              class="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-red-700 bg-red-600 hover:bg-red-700 text-white py-3 text-xs font-black transition shadow-md shadow-red-900/10 cursor-pointer"
            >
              <div class="h-5 w-5 rounded-full bg-white text-red-600 flex items-center justify-center text-[10px] font-black">
                TR
              </div>
              <span>{{ '🇹🇷 e-Devlet Kapısı ile Hızlı Kaydol / Giriş Yap' }}</span>
            </button>

            <button
              type="button"
              @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
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
          <!-- e-Devlet & OAuth Butonları -->
          <div class="space-y-2 mb-5">
            <button
              type="button"
              @click="handleEDevletAuth"
              class="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-red-700 bg-red-600 hover:bg-red-700 text-white py-3 text-xs font-black transition shadow-md shadow-red-900/10 cursor-pointer"
            >
              <div class="h-5 w-5 rounded-full bg-white text-red-600 flex items-center justify-center text-[10px] font-black">
                TR
              </div>
              <span>{{ '🇹🇷 e-Devlet Kapısı ile Doğrulanmış Giriş' }}</span>
            </button>

            <button type="button" @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
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

          <!-- Hızlı Demo Girişleri -->
          <div class="mt-6 pt-6 border-t" style="border-color: #F1F5F9;">
            <label class="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2 text-center">{{ 'HIZLI DEMO GİRİŞLERİ' }}</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                @click="handleDemoLogin('company')"
                class="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/10 hover:bg-blue-50 text-center transition cursor-pointer"
              >
                <span class="text-xs font-bold text-blue-700">{{ '🏢 Firma Demosu' }}</span>
                <span class="text-[8px] text-slate-500 mt-0.5">{{ 'İhale Aç & Yönet' }}</span>
              </button>
              <button 
                type="button" 
                @click="handleDemoLogin('individual')"
                class="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50 text-center transition cursor-pointer"
              >
                <span class="text-xs font-bold text-emerald-700">{{ '👤 Kullanıcı Demosu' }}</span>
                <span class="text-[8px] text-slate-500 mt-0.5">{{ 'Bireysel İlan & Teklif' }}</span>
              </button>
            </div>
          </div>
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

        <!-- MİSAFİR GİRİŞİ FORMU (GUEST ACCESS & LEAD CAPTURE) -->
        <div v-else-if="activeTab === 'guest'" class="space-y-5">
          <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-left space-y-1">
            <h3 class="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>👁️</span>
              <span>{{ 'Misafir Girişi & Platform İnceleme' }}</span>
            </h3>
            <p class="text-[11px] leading-relaxed text-amber-800 font-medium">
              {{ 'Platformu şifre oluşturmadan doğrudan incelemek için iletişim bilgilerinizi giriniz. Ekibimiz size en uygun ihale örneklerini sunacaktır.' }}
            </p>
          </div>

          <form @submit.prevent="handleGuestEntry" class="space-y-4">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Adınız Soyadınız *' }}</label>
              <div class="relative">
                <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="guestName" type="text" required :placeholder="'Örn: Ahmet Yılmaz'" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-amber-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Telefon veya Kurumsal E-Posta *' }}</label>
              <div class="relative">
                <Phone :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="guestContact" type="text" required :placeholder="'Örn: 0555 555 55 55 veya isim@firma.com'" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-amber-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'Firma Adınız / Unvan' }}</label>
                <div class="relative">
                  <Building2 :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="guestCompany" type="text" :placeholder="'Örn: Yılmaz İnşaat A.Ş.'" class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-amber-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{{ 'İlgilendiğiniz Sektör' }}</label>
                <select v-model="guestSector" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold outline-none focus:border-amber-500">
                  <option value="İnşaat & Yapı">🏗️ İnşaat & Yapı</option>
                  <option value="Tarım & Gıda">🌾 Tarım & Gıda</option>
                  <option value="Teknoloji & Yazılım">🖥️ Teknoloji & Yazılım</option>
                  <option value="Lojistik & Nakliye">🚚 Lojistik & Nakliye</option>
                  <option value="Sanayi & Üretim">🏭 Sanayi & Üretim</option>
                  <option value="Diğer">📦 Diğer Sektörler</option>
                </select>
              </div>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-slate-950 transition-all shadow-md disabled:opacity-50" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); border: 1px solid #C59B27;">
              <span>{{ isSubmitting ? ('Misafir Girişi Yapılıyor...') : ('👁️ Misafir Olarak İncelemeye Başla') }}</span>
              <ChevronRight v-if="!isSubmitting" :size="14" />
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- COOKIES CONSENT BANNER (KVKK compliant) -->
    <transition name="fade">
      <div v-if="showCookieConsent" class="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl text-left flex flex-col gap-3">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          🍪 {{ 'Çerez Onayı & KVKK' }}
        </h4>
        <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
          {{ 'Üyelik işlemleri ve güvenli oturum yönetimi için zorunlu çerezleri kullanıyoruz.' }}
        </p>
        <div class="flex items-center justify-end gap-2">
          <button @click="acceptCookies" class="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-[11px] font-black text-white transition shadow-sm cursor-pointer">
            {{ 'Anladım ve Kabul Ediyorum' }}
          </button>
        </div>
      </div>
    </transition>

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
