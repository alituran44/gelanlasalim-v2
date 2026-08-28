<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Handshake, 
  Menu, 
  X, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Home, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Plus, 
  FileText,
  ShoppingBag,
  Inbox,
  Send,
  PlayCircle,
  Sparkles,
  Eye
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, setLocale, detectLocale, t } from '~/composables/useLocale'
import FloatingSupportWidget from '~/components/common/FloatingSupportWidget.vue'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

const { cmsData } = useCmsData()
const mobileMenuOpen = ref(false)
const userSession = ref<any>(null)

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.firstName)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        userSession.value = JSON.parse(raw)
      } else {
        userSession.value = null
      }
    } catch {
      userSession.value = null
    }
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('guestSession')
  }
  userSession.value = null
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

onMounted(() => {
  detectLocale()
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
  }
})

const activeTenders = computed(() => {
  const list = cmsData.value?.dashboard?.tenders || []
  return list.filter((t: any) => t.durum === 'aktif' || !t.durum || t.durum === 'open').map((t: any) => ({
    title: `${t.sehir ? t.sehir + ' - ' : ''}${t.baslik}`,
    time: t.sure || 'Aktif',
    savings: t.butce ? `Bütçe: ${t.butce}` : 'Yeni İhale'
  }))
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#0052FF] selection:text-white flex flex-col">
    <!-- Sticky Header Wrapper containing both Announcement Banner & Nav Header -->
    <div class="sticky top-0 z-50 w-full flex flex-col bg-white shadow-xs">
      
      <!-- Announcement Banner -->
      <div class="w-full bg-[#0F223D] text-white py-2 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-blue-900/40 relative z-50 text-[11px] font-bold">
        <div class="mx-auto max-w-[1720px] flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 shrink-0">
            <span class="bg-[#0052FF] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 shadow-sm whitespace-nowrap">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>B2B İHALE BORSASI</span>
            </span>
            <span class="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[10px] font-medium border-l border-slate-700 pl-3 whitespace-nowrap">
              <span>📞 Destek:</span>
              <a href="tel:08503080000" class="text-[#FF5938] font-bold hover:underline">0850 308 00 00</a>
            </span>
          </div>

          <!-- Eğer aktif ihale varsa akan bant -->
          <div v-if="activeTenders.length > 0" class="relative w-full overflow-hidden h-4 flex items-center mx-4">
            <div class="absolute whitespace-nowrap flex gap-12 animate-marquee hover:pause-animation">
              <span v-for="(tender, idx) in activeTenders" :key="idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#00C2FF] bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-[#FF5938] bg-[#FF5938]/10 border border-[#FF5938]/20 px-1.5 py-0.2 rounded text-[9px] font-black">{{ tender.savings }}</span>
              </span>
              <!-- Duplicate for seamless scroll loop -->
              <span v-for="(tender, idx) in activeTenders" :key="'dup-' + idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#00C2FF] bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-[#FF5938] bg-[#FF5938]/10 border border-[#FF5938]/20 px-1.5 py-0.2 rounded text-[9px] font-black">{{ tender.savings }}</span>
              </span>
            </div>
          </div>

          <!-- Eğer henüz ihale yoksa temiz kurumsal duyuru -->
          <div v-else class="w-full flex items-center justify-center text-slate-300 text-[11px] font-medium truncate px-4">
            <span>TCMB & BDDK Lisanslı B2B İhale Borsası — Onaylı üreticilerden anında teklif toplamak için ilk ihalenizi oluşturun.</span>
          </div>

          <NuxtLink to="/panel/ihale-olustur" class="text-[#00C2FF] hover:underline flex items-center gap-0.5 text-[10px] shrink-0 font-black whitespace-nowrap">
            <span>İhale Aç</span> <ArrowRight :size="12" />
          </NuxtLink>
        </div>
      </div>

      <!-- Header -->
      <header class="w-full bg-white border-b transition-all" style="border-color: #E2E8F0;">
      <div class="mx-auto flex h-[88px] sm:h-[94px] max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 gap-4">

        <!-- Sol: Logo (İhaleciBurada.com) -->
        <NuxtLink to="/" class="flex items-center gap-3.5 hover:opacity-95 transition shrink-0 group py-1.5" title="İhaleciBurada.com Ana Sayfa">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 540 120" 
            class="h-11 sm:h-13 md:h-14 lg:h-15 w-auto max-w-[240px] sm:max-w-[270px] object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-200" 
            fill="none" 
            role="img" 
            aria-label="İhaleciBurada.com"
          >
            <g transform="translate(10, 10)">
              <!-- Turuncu Nokta -->
              <circle cx="106" cy="18" r="14" fill="#FF5938" />
              <!-- 3 Adet Hız Çizgisi -->
              <path d="M 38 68 L 86 63 L 83 58 L 32 64 Z" fill="#0052FF" />
              <path d="M 18 84 L 78 78 L 75 73 L 12 80 Z" fill="#0084FF" />
              <path d="M 0 98 L 70 91 L 67 86 L -4 94 Z" fill="#00C2FF" />
              <!-- Koyu Lacivert Gövde -->
              <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#0B1E3B" />
            </g>
            <!-- ihaleciburada Metni -->
            <text x="152" y="84" fill="#0B1E3B" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
            <!-- .com Uzantısı -->
            <text x="430" y="84" fill="#0052FF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
          </svg>
          <span class="hidden 2xl:inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-[#0052FF] border border-blue-200 shadow-2xs whitespace-nowrap">
            ✓ ONAYLI B2B
          </span>
        </NuxtLink>

        <!-- Orta: Hızlı Ana Sayfa, Pazar Yeri, İhalelerim & Teklif Erişim Buton Şeridi (Genişletilmiş ve Ferah) -->
        <div class="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <NuxtLink 
            to="/" 
            class="px-3.5 py-2 text-xs font-black text-slate-800 hover:text-[#0052FF] bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm border border-slate-200/60 whitespace-nowrap shrink-0"
          >
            <Home :size="14" class="text-[#0052FF]" />
            <span>Ana Sayfa</span>
          </NuxtLink>
          <NuxtLink 
            to="/pazar-yeri" 
            class="px-3.5 py-2 text-xs font-black text-slate-800 hover:text-[#1EAE4C] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <ShoppingBag :size="14" class="text-emerald-600" />
            <span>Pazar Yeri</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/ilanlarim" 
            class="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <FileText :size="14" class="text-blue-600" />
            <span>İhalelerim</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/gelen-teklifler" 
            class="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <Inbox :size="14" class="text-[#0052FF]" />
            <span>Gelen Teklifler</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/yaptigim-teklifler" 
            class="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <Send :size="14" class="text-indigo-600" />
            <span>Verdiğim Teklifler</span>
          </NuxtLink>
          <NuxtLink 
            to="/videolar" 
            class="px-3.5 py-2 text-xs font-black text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100/80 rounded-xl transition-all flex items-center gap-1.5 shadow-sm border border-blue-200 whitespace-nowrap shrink-0"
          >
            <PlayCircle :size="14" class="text-blue-600" />
            <span>Video Rehberler</span>
          </NuxtLink>
          <NuxtLink 
            to="/abonelik" 
            class="px-3.5 py-2 text-xs font-black text-emerald-800 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 rounded-xl transition-all flex items-center gap-1.5 shadow-sm border border-emerald-300 animate-pulse whitespace-nowrap shrink-0"
          >
            <Sparkles :size="14" class="text-emerald-600" />
            <span>1 Ay Ücretsiz</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Profilim & İhale Aç / Giriş Butonları -->
        <div class="hidden sm:flex items-center gap-3 shrink-0">

          <!-- 🟢 KULLANICI GİRİŞ YAPTIĞINDA: İHALE AÇ BUTONU -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ihale-olustur"
            class="flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl text-white transition-all shadow-md bg-[#1EAE4C] hover:bg-[#188C3D] hover:shadow-lg hover:shadow-[#1EAE4C]/20 active:scale-98 whitespace-nowrap shrink-0"
          >
            <Plus :size="15" class="text-white stroke-[3]" />
            <span>İhale Aç</span>
          </NuxtLink>

          <!-- PROFILIM BUTTON (Sadece oturum AÇIKKEN gösterilir) -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ayarlar"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl border transition-all text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300 shadow-xs whitespace-nowrap shrink-0"
          >
            <User :size="15" class="text-[#003057]" />
            <span>Profilim</span>
          </NuxtLink>

          <!-- PANELLE GEÇİŞ (Oturum açıkken) -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl text-white transition-all shadow-sm bg-[#0F223D] hover:bg-[#003057] whitespace-nowrap shrink-0"
          >
            <LayoutDashboard :size="14" />
            <span>Panel</span>
          </NuxtLink>

          <!-- ÇIKIŞ YAP BUTONU (Oturum açıkken) -->
          <button
            v-if="isLoggedIn"
            type="button"
            @click="handleLogout"
            class="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut :size="14" />
            <span>Çıkış</span>
          </button>

          <!-- MISAFIR GIRISI BUTTON (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik?tab=guest"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border-slate-300 shadow-xs whitespace-nowrap shrink-0"
            title="Şifresiz Misafir Girişi Yaparak Platformu İnceleyin"
          >
            <Eye :size="14" class="text-slate-600" />
            <span>Misafir Girişi</span>
          </NuxtLink>

          <!-- GIRIS YAP (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik"
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all text-slate-700 hover:bg-slate-100 border border-slate-200 whitespace-nowrap shrink-0"
          >
            Giriş Yap
          </NuxtLink>

          <!-- KURUMSAL HESAP AC (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik"
            class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-white transition-all shadow-md bg-[#0F223D] hover:bg-[#003057] border border-slate-700 whitespace-nowrap shrink-0"
          >
            <span>Kurumsal Hesap Aç</span>
            <ArrowRight :size="13" class="text-emerald-400" />
          </NuxtLink>
        </div>

        <!-- Mobil Menü Butonu -->
        <div class="flex items-center gap-2 lg:hidden">
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ihale-olustur"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-lg text-white bg-[#0052FF]"
          >
            <Plus :size="13" /> <span>İhale Aç</span>
          </NuxtLink>
          <button class="p-2 rounded-lg transition hover:bg-slate-100" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menü">
            <X :size="20" v-if="mobileMenuOpen" style="color: #475569;" />
            <Menu :size="20" v-else style="color: #475569;" />
          </button>
        </div>
      </div>

      <!-- Mobil Menü -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="border-t bg-white px-5 py-6 lg:hidden max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl border-slate-200">
          
          <!-- Hızlı B2B Erişim Izgarası -->
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink 
              to="/" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-800"
            >
              <Home :size="16" class="text-[#0052FF]" />
              <span>Ana Sayfa</span>
            </NuxtLink>
            <NuxtLink 
              to="/pazar-yeri" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200 text-xs font-black text-emerald-900"
            >
              <ShoppingBag :size="16" class="text-emerald-600" />
              <span>Pazar Yeri</span>
            </NuxtLink>
            <NuxtLink 
              to="/panel/ilanlarim" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 text-xs font-bold text-blue-900"
            >
              <FileText :size="16" class="text-blue-600" />
              <span>İhalelerim</span>
            </NuxtLink>
            <NuxtLink 
              to="/panel/gelen-teklifler" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200 text-xs font-bold text-indigo-900"
            >
              <Inbox :size="16" class="text-indigo-600" />
              <span>Gelen Teklifler</span>
            </NuxtLink>
            <NuxtLink 
              to="/panel/yaptigim-teklifler" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-violet-50/60 hover:bg-violet-100/60 border border-violet-200 text-xs font-bold text-violet-900"
            >
              <Send :size="16" class="text-violet-600" />
              <span>Verdiğim Teklif</span>
            </NuxtLink>
            <NuxtLink 
              to="/videolar" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-2 p-3 rounded-2xl bg-sky-50/60 hover:bg-sky-100/60 border border-sky-200 text-xs font-black text-sky-900"
            >
              <PlayCircle :size="16" class="text-sky-600" />
              <span>Rehberler</span>
            </NuxtLink>
          </div>

          <!-- 1 Ay Ücretsiz Özel Banner -->
          <NuxtLink 
            to="/abonelik" 
            @click="mobileMenuOpen = false"
            class="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-md"
          >
            <span class="flex items-center gap-2">
              <Sparkles :size="16" class="text-amber-300" />
              <span>Lansmana Özel: 1 Ay %100 Ücretsiz</span>
            </span>
            <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">İncele →</span>
          </NuxtLink>

          <!-- Alt Linkler -->
          <div class="border-t pt-3 border-slate-100 flex flex-col gap-2.5 text-xs font-bold text-slate-700">
            <a href="/#nasil-calisir" @click="mobileMenuOpen = false" class="py-1 hover:text-blue-600">Nasıl Çalışır</a>
            <a href="/#ozellikler" @click="mobileMenuOpen = false" class="py-1 hover:text-blue-600">Sektörel Masalar</a>
            <a href="/#sss" @click="mobileMenuOpen = false" class="py-1 hover:text-blue-600">Sıkça Sorulan Sorular (SSS)</a>
            <NuxtLink to="/yardim" @click="mobileMenuOpen = false" class="py-1 hover:text-blue-600">Yardım & Destek Merkezi</NuxtLink>
          </div>

          <div class="border-t pt-3 border-slate-100 space-y-2">
            <!-- Oturum AÇIKKEN -->
            <template v-if="isLoggedIn">
              <NuxtLink 
                to="/panel/ihale-olustur" 
                @click="mobileMenuOpen = false" 
                class="w-full py-3 bg-[#1EAE4C] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Plus :size="16" /> + Yeni İhale Oluştur
              </NuxtLink>
              <div class="grid grid-cols-2 gap-2">
                <NuxtLink to="/panel/ayarlar" @click="mobileMenuOpen = false" class="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <User :size="14" /> Profilim
                </NuxtLink>
                <NuxtLink to="/panel" @click="mobileMenuOpen = false" class="py-2.5 px-3 bg-[#0F223D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <LayoutDashboard :size="14" /> Panel
                </NuxtLink>
              </div>
              <button 
                @click="handleLogout(); mobileMenuOpen = false" 
                class="w-full py-2 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 rounded-xl"
              >
                <LogOut :size="14" /> Çıkış Yap
              </button>
            </template>

            <!-- Oturum KAPALIYKEN -->
            <template v-else>
              <NuxtLink 
                to="/uyelik?tab=guest" 
                @click="mobileMenuOpen = false" 
                class="w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-300"
              >
                <Eye :size="14" class="text-slate-600" /> Misafir Girişi Yap
              </NuxtLink>
              <div class="grid grid-cols-2 gap-2">
                <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center border border-slate-200">
                  Giriş Yap
                </NuxtLink>
                <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="py-2.5 bg-[#0F223D] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1">
                  <span>Hesap Aç</span> <ArrowRight :size="12" class="text-emerald-400" />
                </NuxtLink>
              </div>
            </template>
          </div>

        </div>
      </transition>
    </header>
  </div>

    <!-- Main Content -->
    <main class="flex-grow pb-16 sm:pb-0">
      <slot />
    </main>

    <!-- 📱 MOBİL SABİT ALT GEZİNME ÇUBUĞU (MOBILE BOTTOM APP BAR) -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl safe-bottom">
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        active-class="text-[#0052FF]"
      >
        <Home :size="18" />
        <span>Ana Sayfa</span>
      </NuxtLink>

      <NuxtLink 
        to="/pazar-yeri" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#1EAE4C]"
        active-class="text-[#1EAE4C]"
      >
        <ShoppingBag :size="18" />
        <span>Pazar Yeri</span>
      </NuxtLink>

      <!-- Ortadaki Vurgulu İhale Aç FAB Butonu -->
      <NuxtLink 
        to="/panel/ihale-olustur" 
        class="flex flex-col items-center -mt-6 group"
      >
        <div class="h-12 w-12 rounded-full bg-[#1EAE4C] text-white flex items-center justify-center shadow-lg shadow-[#1EAE4C]/40 group-active:scale-95 transition-all border-2 border-white">
          <Plus :size="22" class="stroke-[3]" />
        </div>
        <span class="text-[9px] font-black text-[#1EAE4C] mt-0.5">İhale Aç</span>
      </NuxtLink>

      <NuxtLink 
        to="/panel/gelen-teklifler" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        active-class="text-[#0052FF]"
      >
        <Inbox :size="18" />
        <span>Teklifler</span>
      </NuxtLink>

      <NuxtLink 
        :to="isLoggedIn ? '/panel' : '/uyelik'" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0F223D]"
        active-class="text-[#0F223D]"
      >
        <User :size="18" />
        <span>{{ isLoggedIn ? 'Panelim' : 'Giriş' }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <footer class="bg-[#0F223D] text-slate-300 border-t border-slate-800">
      <div class="mx-auto max-w-7xl px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          <!-- Column 1: Brand Info (md:col-span-3) -->
          <div class="md:col-span-3 flex flex-col gap-4 text-left">
            <div class="flex items-center gap-2.5">
              <NuxtLink to="/" class="inline-block hover:opacity-95 transition group" title="İhaleciBurada.com">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 540 120" 
                  class="h-11 sm:h-12 w-auto max-w-[240px] object-contain drop-shadow-md group-hover:scale-102 transition-transform duration-200" 
                  fill="none" 
                  role="img" 
                  aria-label="İhaleciBurada.com"
                >
                  <g transform="translate(10, 10)">
                    <!-- Turuncu Nokta -->
                    <circle cx="106" cy="18" r="14" fill="#FF5938" />
                    <!-- 3 Adet Hız Çizgisi -->
                    <path d="M 38 68 L 86 63 L 83 58 L 32 64 Z" fill="#00C2FF" />
                    <path d="M 18 84 L 78 78 L 75 73 L 12 80 Z" fill="#0084FF" />
                    <path d="M 0 98 L 70 91 L 67 86 L -4 94 Z" fill="#00C2FF" />
                    <!-- Beyaz Gövde -->
                    <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#FFFFFF" />
                  </g>
                  <!-- Beyaz ihaleciburada Metni -->
                  <text x="152" y="84" fill="#FFFFFF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
                  <!-- Parlak Turkuaz .com Uzantısı -->
                  <text x="430" y="84" fill="#00C2FF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
                </svg>
              </NuxtLink>
            </div>
            
            <p class="text-xs leading-relaxed font-medium text-slate-400">
              B2B satın alma taleplerini, tedarikçi tekliflerini, canlı eksiltmeleri ve pazarlık süreçlerini tek çatı altında yöneten kurumsal ters ihale platformu.
            </p>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="inline-flex items-center gap-1 rounded-md bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 text-[8.5px] font-black text-[#00C2FF] uppercase tracking-wide">
                <span class="h-1 w-1 rounded-full bg-[#00C2FF]"></span>
                KVKK Uyumlu
              </span>
              <span class="inline-flex items-center gap-1 rounded-md bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 text-[8.5px] font-black text-[#00C2FF] uppercase tracking-wide">
                <span class="h-1 w-1 rounded-full bg-[#00C2FF]"></span>
                TLS 1.3 Şifreli
              </span>
              <span class="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[8.5px] font-black text-emerald-400 uppercase tracking-wide">
                <span class="h-1 w-1 rounded-full bg-emerald-400"></span>
                TCMB Escrow
              </span>
            </div>

            <!-- Social Links -->
            <div class="flex gap-2 mt-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Facebook :size="13" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Instagram :size="13" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Linkedin :size="13" />
              </a>
            </div>
          </div>

          <!-- Column 2: Platform Links (md:col-span-2) -->
          <div class="md:col-span-2 flex flex-col gap-3 text-left">
            <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">PLATFORM</h4>
            <div class="flex flex-col gap-2.5 text-[11px] font-bold text-slate-300">
              <a href="/#nasil-calisir" class="hover:text-[#00C2FF] transition-colors py-0.5">Nasıl Çalışır</a>
              <a href="/#ihale-gezgini" class="hover:text-[#00C2FF] transition-colors py-0.5">İhale Marketi</a>
              <NuxtLink to="/panel/ilanlarim" class="hover:text-[#00C2FF] transition-colors py-0.5">İhalelerim</NuxtLink>
              <NuxtLink to="/abonelik" class="hover:text-[#00C2FF] transition-colors py-0.5">{{ t('pricing') }}</NuxtLink>
              <NuxtLink to="/entegrasyonlar" class="hover:text-[#00C2FF] transition-colors py-0.5">Entegrasyonlar</NuxtLink>
              <NuxtLink to="/yardim" class="hover:text-[#00C2FF] transition-colors py-0.5">Yardım Merkezi</NuxtLink>
            </div>
          </div>

          <!-- Column 3: Company Links (md:col-span-2) -->
          <div class="md:col-span-2 flex flex-col gap-3 text-left">
            <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">KURUMSAL</h4>
            <div class="flex flex-col gap-2.5 text-[11px] font-bold text-slate-300">
              <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="hover:text-[#00C2FF] transition-colors py-0.5">Hakkımızda & Vizyon</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kariyer" class="hover:text-[#00C2FF] transition-colors py-0.5">Kariyer Fırsatları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-[#00C2FF] transition-colors py-0.5">Blog & Analizler</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=is-ortakligi" class="hover:text-[#00C2FF] transition-colors py-0.5">İş Ortaklığı Programı</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=basin" class="hover:text-[#00C2FF] transition-colors py-0.5">Basın Odası & Medya</NuxtLink>
            </div>
          </div>

          <!-- Column 4: Legal & Contracts Hub (md:col-span-3) -->
          <div class="md:col-span-3 flex flex-col gap-3 text-left">
            <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider flex items-center gap-1.5">
              <span>HUKUKİ & SÖZLEŞMELER</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">13 Sözleşme</span>
            </h4>
            <div class="grid grid-cols-1 gap-1.5 text-[11px] font-medium text-slate-300">
              <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Kullanım Şartları (MSA)
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5 text-amber-300 font-semibold">
                <span class="text-amber-400 text-[9px]">▪</span> Ön Bilgilendirme Formu
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5 text-blue-200 font-semibold">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Mesafeli Satış & Abonelik
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span class="text-emerald-400 text-[9px]">▪</span> İptal ve İade Koşulları
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=teslimat" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Teslimat ve Dijital İfa
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Gizlilik & Ticari Sır Politikası
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> KVKK Aydınlatma & DPA
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=ihale-kurallari" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Canlı Eksiltme Kuralları
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=cerezler" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Çerez (Cookie) Politikası
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=tedarikci-uyum" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Tedarikçi KYC & Uyum Beyanı
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=sla" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Servis Seviyesi Taahhüdü (SLA)
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=bilgi-guvenligi" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Bilgi Güvenliği (ISO 27001)
              </NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=escrow" class="hover:text-[#00C2FF] transition-colors py-0.5 flex items-center gap-1.5">
                <span class="text-[#00C2FF] text-[9px]">▪</span> Escrow Güvenli Havuz Sözleşmesi
              </NuxtLink>
            </div>
          </div>

          <!-- Column 5: Contact details & Merchant Info (md:col-span-2) -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <div class="space-y-2">
              <h4 class="text-xs font-black uppercase tracking-wider text-[#00C2FF]">ŞİRKET KÜNYESİ</h4>
              <p class="text-[10px] leading-relaxed text-slate-300 font-medium">
                <strong class="text-white block">İhaleciBurada Platform A.Ş.</strong>
                İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale<br />
                <span class="text-slate-400">Çanakkale V.D. / VKN: 4700854210</span><br />
                <span class="text-slate-400 font-mono">MERSİS: 0470085421000001</span><br />
                <span class="text-slate-400">KEP: ihaleciburada@hs01.kep.tr</span>
              </p>
              <div class="text-[11px] font-bold text-slate-200 space-y-1 pt-1">
                <a href="mailto:ihalecib@gmail.com" class="block hover:text-[#00C2FF] py-0.5">
                  ihalecib@gmail.com
                </a>
                <div class="text-[#FF5938] font-bold">
                  📞 0850 308 00 00
                </div>
              </div>
            </div>

            <div class="space-y-1 pt-1">
              <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">DESTEK SAATLERİ</h4>
              <p class="text-[10.5px] text-slate-400 font-medium leading-relaxed">
                Hafta İçi: 09:00 - 18:00 <br />
                Cumartesi: 10:00 - 14:00
              </p>
            </div>
          </div>

        </div>

        <!-- PAYMENT BRAND LOGOS & SECURITY TRUST SEAL STRIP (PAYTR & İYZİCO ONBOARDING AUDIT) -->
        <div class="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div class="flex items-center gap-3 text-slate-400 text-[11px] font-bold">
            <span class="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck :size="16" />
              PayTR & iyzico 256-Bit SSL 3D Secure
            </span>
            <span>•</span>
            <span class="text-slate-300">TCMB & BDDK Lisanslı Güvenli Ödeme Altyapısı</span>
          </div>

          <!-- Official Payment Gateways & Card Badges (Visa, MasterCard, Troy, iyzico, PayTR, SSL) -->
          <PaymentBadges />
        </div>

        <hr class="border-slate-800 my-8" />

        <!-- Bottom Legal Bar -->
        <div class="flex flex-col lg:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-medium">
          <div class="font-bold tracking-wide text-center lg:text-left">
            © 2026 İhaleciBurada.com — B2B Canlı Eksiltme & Satın Alma Platformu. Tüm Hakları Saklıdır.
          </div>
          
          <!-- Quick Legal Links Bar -->
          <div class="flex flex-wrap gap-x-3 gap-y-2 justify-center lg:justify-end text-[10.5px] text-slate-400 font-medium">
            <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-[#00C2FF] transition-colors text-amber-300 font-bold">Ön Bilgilendirme Formu</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-[#00C2FF] transition-colors text-blue-300 font-bold">Mesafeli Satış</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-[#00C2FF] transition-colors text-emerald-300 font-bold">İptal ve İade</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=teslimat" class="hover:text-[#00C2FF] transition-colors">Teslimat Şartları</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-[#00C2FF] transition-colors">Kullanım Koşulları</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-[#00C2FF] transition-colors">Gizlilik</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-[#00C2FF] transition-colors">KVKK</NuxtLink>
            <span class="text-slate-700">•</span>
            <NuxtLink to="/sozlesmeler?tab=escrow" class="hover:text-[#00C2FF] transition-colors">Escrow Güvenli Havuz</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- WhatsApp & AI Welcoming Floating Widget -->
    <FloatingSupportWidget />

    <!-- Global Responsive Cookie & KVKK Consent Banner -->
    <CommonCookieConsent />
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}

.hover\:pause-animation:hover {
  animation-play-state: paused;
}
</style>
