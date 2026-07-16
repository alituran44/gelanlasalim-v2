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
  Sparkles
} from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const router = useRouter()
const activeTab = ref<'login' | 'register'>('register')
const showCookieConsent = ref(true)

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

function handleRegister() {
  if (!agreeKvkk.value) {
    errorMessage.value = 'Lütfen KVKK ve Üyelik Sözleşmesini kabul edin.'
    return
  }
  if (!email.value || !password.value || !firstName.value || !lastName.value) {
    errorMessage.value = 'Lütfen tüm zorunlu alanları doldurun.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  // Simulate API registration delay
  setTimeout(() => {
    isSubmitting.value = false
    // Store user session in localStorage
    localStorage.setItem('userSession', JSON.stringify({
      email: email.value,
      name: `${firstName.value} ${lastName.value}`,
      role: userRole.value,
      isPremium: false
    }))
    // Redirect to Abonelik (Payment Setup) page
    router.push('/abonelik')
  }, 1000)
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
    // Store user session
    localStorage.setItem('userSession', JSON.stringify({
      email: loginEmail.value,
      name: 'Ali Turan',
      role: 'buyer',
      isPremium: true
    }))
    // Redirect to dashboard panel
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
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Handshake :size="18" />
        </div>
        <span class="text-base font-black text-white tracking-tight">GelAnlaşalım</span>
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
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
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

          <div class="flex items-start gap-2.5 py-1">
            <input v-model="agreeKvkk" id="kvkk" type="checkbox" required class="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label for="kvkk" class="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-wider">
              Üyelik şartlarını ve <a href="#" class="text-blue-600 hover:underline">KVKK Açık Rıza Metnini</a> kabul ediyorum.
            </label>
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all disabled:opacity-50">
            <span>{{ isSubmitting ? 'Kayıt Yapılıyor...' : 'Kaydol ve Devam Et' }}</span>
            <ChevronRight v-if="!isSubmitting" :size="14" />
          </button>
        </form>

        <!-- LOGIN FORM -->
        <form v-else @submit.prevent="handleLogin" class="space-y-4">
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
              <input type="checkbox" class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600" />
              Beni Hatırla
            </label>
            <a href="#" class="text-blue-600 hover:underline">Şifremi Unuttum</a>
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all disabled:opacity-50">
            <span>{{ isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}</span>
            <ChevronRight v-if="!isSubmitting" :size="14" />
          </button>
        </form>
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
