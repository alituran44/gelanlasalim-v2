<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  Bell
} from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const router = useRouter()
const activeTab = ref<'login' | 'register'>('register')
const showCookieConsent = ref(true)
const registerStep = ref<1 | 2>(1)

// Form Fields
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const userRole = ref<'buyer' | 'supplier'>('buyer')
const agreeKvkk = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')

const isSubmitting = ref(false)
const errorMessage = ref('')

// Sektör seçimi
const sektorler = [
  { key: 'tarim', label: '🌾 Tarım & Gıda', popular: true },
  { key: 'insaat', label: '🏗️ İnşaat & Yapı', popular: false },
  { key: 'saglik', label: '💊 Sağlık & İlaç', popular: false },
  { key: 'teknoloji', label: '🖥️ Teknoloji & Yazılım', popular: false },
  { key: 'enerji', label: '⚡ Enerji & Elektrik', popular: false },
  { key: 'lojistik', label: '🚚 Lojistik & Nakliye', popular: false },
  { key: 'sanayi', label: '🏭 Sanayi & Üretim', popular: false },
  { key: 'egitim', label: '📚 Eğitim & Danışmanlık', popular: false },
]
const seciliSektorler = ref<string[]>(['tarim'])
const mailBildirimi = ref(true)

function toggleSektor(key: string) {
  const idx = seciliSektorler.value.indexOf(key)
  if (idx >= 0) {
    seciliSektorler.value.splice(idx, 1)
  } else {
    seciliSektorler.value.push(key)
  }
}

function goStep2() {
  if (!email.value || !password.value || !firstName.value || !lastName.value) {
    errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun.'
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
    localStorage.setItem('userSession', JSON.stringify({
      email: email.value,
      firstName: firstName.value,
      name: `${firstName.value} ${lastName.value}`,
      role: userRole.value,
      sektorler: seciliSektorler.value,
      mailBildirimi: mailBildirimi.value,
      isPremium: false
    }))
    router.push('/abonelik')
  }, 1000)
}

function handleOAuth(provider: 'google' | 'facebook') {
  // UI placeholder — backend OAuth entegrasyonu ayrı sprint'te yapılacak
  alert(`${provider === 'google' ? 'Google' : 'Facebook'} OAuth entegrasyonu yakında aktif olacak!`)
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
    localStorage.setItem('userSession', JSON.stringify({
      email: loginEmail.value,
      firstName: 'Ali',
      name: 'Ali Turan',
      role: 'buyer',
      isPremium: true
    }))
    router.push('/panel')
  }, 1000)
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
      <div class="relative z-10 flex items-center gap-3">
        <!-- Inline SVG Premium Logo -->
        <svg class="h-9 w-9 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="9" fill="#1E3A5F"/>
          <path d="M22 12C20.8 10.2 18.5 9 16 9C12.1 9 9 12.1 9 16C9 19.9 12.1 23 16 23C19.9 23 23 19.9 23 16H16" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="23" cy="16" r="2" fill="#FFFFFF"/>
        </svg>
        <span class="text-base font-black tracking-tight text-white">Gel<span style="color: #F59E0B;">Anlaşalım</span></span>
      </div>

      <!-- Main presentation -->
      <div class="relative z-10 my-auto">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/25 px-3.5 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          <Sparkles :size="12" /> B2B Tedarik Çözümü
        </div>
        <h2 class="mt-6 text-3xl font-black text-white leading-tight md:text-4xl lg:text-5xl tracking-tight">
          Tedarik Maliyetinizi Canlı Eksiltme ile Düşürün
        </h2>
        <p class="mt-4 max-w-md text-xs text-slate-400 leading-relaxed font-medium">
          GelAnlaşalım arenasında rekabet kurallarını siz belirlersiniz. İlanınızı yayınlayın, onaylı satıcılar anlık fiyat kırarak yarışsın.
        </p>

        <!-- Feature List -->
        <div class="mt-8 space-y-4">
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <ShieldCheck :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">Doğrulanmış B2B Üyeler</h4>
              <p class="text-[10px] text-slate-400">Tüm şirketlerin vergi levhası ve yetki belgeleri kontrol edilir.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Zap :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">Canlı Eksiltme Teknolojisi</h4>
              <p class="text-[10px] text-slate-400">Şeffaf zaman damgalı teklif yarışı ile maksimum tasarruf sağlayın.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Building2 :size="14" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">81 İl Tedarik Ağı</h4>
              <p class="text-[10px] text-slate-400">Mal ve hizmet alımlarınızı yerel veya ulusal ölçekte rekabete açın.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer indicator -->
      <div class="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        © 2026 GelAnlaşalım B2B reverse auction portal
      </div>
    </div>

    <!-- Form Right Panel -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white">
      <div class="mx-auto w-full max-w-md text-left">
        <!-- Switch tabs -->
        <div class="mb-8 flex border-b border-slate-100">
          <button @click="activeTab = 'register'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'register' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'">
            Yeni Üyelik
          </button>
          <button @click="activeTab = 'login'; errorMessage = ''" class="flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2" :class="activeTab === 'login' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'">
            Giriş Yap
          </button>
        </div>

        <!-- Alert messages -->
        <div v-if="errorMessage" class="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- REGISTRATION FORM -->
        <div v-if="activeTab === 'register'">

          <!-- OAuth Butonları -->
          <div class="space-y-2 mb-5">
            <button
              type="button"
              @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
              style="border-color: #E2E8F0; color: #374151;"
            >
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google ile Devam Et
            </button>
            <button
              type="button"
              @click="handleOAuth('facebook')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
              style="border-color: #E2E8F0; color: #374151;"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook ile Devam Et
            </button>
          </div>

          <!-- Ayraç -->
          <div class="relative flex items-center mb-5">
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
            <span class="px-3 text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">veya e-posta ile</span>
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
          </div>

          <!-- Adım 1: Kişisel Bilgiler -->
          <form v-if="registerStep === 1" @submit.prevent="goStep2" class="space-y-4">
            <!-- Adım göstergesi -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style="background: #1E3A5F;">1</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #1E3A5F;">Kişisel Bilgiler</span>
              <div class="flex-1 h-px" style="background: #E2E8F0;"></div>
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style="background: #F1F5F9; color: #94A3B8;">2</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">Sektörler</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Ad *</label>
                <div class="relative">
                  <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="firstName" type="text" required placeholder="Adınız" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Soyad *</label>
                <div class="relative">
                  <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="lastName" type="text" required placeholder="Soyadınız" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Kurumsal E-Posta *</label>
              <div class="relative">
                <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="email" type="email" required placeholder="isim@sirketiniz.com" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Telefon *</label>
              <div class="relative">
                <Phone :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="phone" type="tel" required placeholder="+90 (555) 555 55 55" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Şifre *</label>
              <div class="relative">
                <LockKeyhole :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="password" type="password" required placeholder="Minimum 6 karakter" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Platform Rolünüz *</label>
              <div class="grid grid-cols-2 gap-3 mt-1">
                <button type="button" @click="userRole = 'buyer'" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all" :class="userRole === 'buyer' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'">
                  <span class="text-xs font-bold">Alıcı Firma</span>
                  <span class="text-[8px] mt-0.5 font-medium">İhale Yayınlar</span>
                </button>
                <button type="button" @click="userRole = 'supplier'" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all" :class="userRole === 'supplier' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'">
                  <span class="text-xs font-bold">Tedarikçi Firma</span>
                  <span class="text-[8px] mt-0.5 font-medium">Teklif Verir</span>
                </button>
              </div>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <button type="submit" class="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all" style="background: #1E3A5F;">
              Devam Et — Sektör Seçimi
              <ChevronRight :size="14" />
            </button>
          </form>

          <!-- Adım 2: Sektör Seçimi -->
          <form v-else-if="registerStep === 2" @submit.prevent="handleRegister" class="space-y-4">
            <!-- Adım göstergesi -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style="background: #22C55E; color: white;">✓</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">Kişisel Bilgiler</span>
              <div class="flex-1 h-px" style="background: #1E3A5F;"></div>
              <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style="background: #1E3A5F;">2</div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #1E3A5F;">Sektörler</span>
            </div>

            <div>
              <label class="text-[10px] font-black uppercase tracking-wider block mb-3" style="color: #475569;">İlgilendiğiniz Sektörleri Seçin *</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="sektor in sektorler"
                  :key="sektor.key"
                  type="button"
                  @click="toggleSektor(sektor.key)"
                  class="relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium text-left transition-all"
                  :style="seciliSektorler.includes(sektor.key)
                    ? 'border-color: #1E3A5F; background: rgba(30,58,95,0.06); color: #1E3A5F;'
                    : 'border-color: #E2E8F0; color: #64748B;'"
                >
                  <span>{{ sektor.label }}</span>
                  <span v-if="sektor.popular" class="ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-bold" style="background: rgba(245,158,11,0.15); color: #D97706;">Popüler</span>
                </button>
              </div>
            </div>

            <!-- Mail Bildirimi Toggle -->
            <div class="flex items-center justify-between rounded-xl border p-3" style="border-color: #E2E8F0; background: #F8FAFC;">
              <div class="flex items-center gap-2">
                <Bell :size="14" style="color: #F59E0B;" />
                <div>
                  <div class="text-xs font-semibold" style="color: #0F172A;">Sektör Bildirimleri</div>
                  <div class="text-[10px]" style="color: #94A3B8;">Seçili sektörlerde yeni ilan çıkınca mail at</div>
                </div>
              </div>
              <button
                type="button"
                @click="mailBildirimi = !mailBildirimi"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="mailBildirimi ? 'background: #1E3A5F;' : 'background: #CBD5E1;'"
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
                Üyelik şartlarını ve <a href="#" class="text-blue-600 hover:underline">KVKK Açık Rıza Metnini</a> kabul ediyorum.
              </label>
            </div>

            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>

            <div class="flex gap-2">
              <button type="button" @click="registerStep = 1" class="rounded-xl border px-4 py-3 text-xs font-bold transition hover:bg-slate-50" style="border-color: #E2E8F0; color: #64748B;">
                ← Geri
              </button>
              <button type="submit" :disabled="isSubmitting" class="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all disabled:opacity-50" style="background: #1E3A5F;">
                <span>{{ isSubmitting ? 'Kayıt Yapılıyor...' : 'Kaydol ve Devam Et' }}</span>
                <ChevronRight v-if="!isSubmitting" :size="14" />
              </button>
            </div>
          </form>

        </div>

        <!-- LOGIN FORM -->
        <div v-else>
          <!-- OAuth Butonları -->
          <div class="space-y-2 mb-5">
            <button type="button" @click="handleOAuth('google')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
              style="border-color: #E2E8F0; color: #374151;">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google ile Giriş Yap
            </button>
            <button type="button" @click="handleOAuth('facebook')"
              class="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-xs font-semibold transition hover:bg-slate-50"
              style="border-color: #E2E8F0; color: #374151;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook ile Giriş Yap
            </button>
          </div>
          <div class="relative flex items-center mb-5">
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
            <span class="px-3 text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">veya e-posta ile</span>
            <div class="flex-1 border-t" style="border-color: #E2E8F0;"></div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Kurumsal E-Posta</label>
              <div class="relative">
                <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="loginEmail" type="email" required placeholder="isim@sirketiniz.com" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Şifre</label>
              <div class="relative">
                <LockKeyhole :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="loginPassword" type="password" required placeholder="Şifreniz" class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
              <label class="flex items-center gap-2 text-slate-500">
                <input type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300" />
                Beni Hatırla
              </label>
              <a href="#" class="text-blue-600 hover:underline">Şifremi Unuttum</a>
            </div>
            <div v-if="errorMessage" class="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">⚠️ {{ errorMessage }}</div>
            <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all disabled:opacity-50" style="background: #1E3A5F;">
              <span>{{ isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}</span>
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
          🍪 Çerez Onayı & KVKK
        </h4>
        <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
          Üyelik işlemleri ve güvenli oturum yönetimi için zorunlu çerezleri kullanıyoruz.
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="showCookieConsent = false" class="rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-black text-white hover:bg-blue-700 transition-colors">
            Kabul Et
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
