<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowRight, 
  Home, 
  User, 
  LogOut, 
  Plus, 
  Phone, 
  Mail, 
  Zap, 
  Key, 
  ShieldCheck, 
  Building, 
  Building2,
  Scale, 
  FileText, 
  LockKeyhole,
  Menu,
  X,
  Bell,
  Inbox,
  Send,
  ClipboardList,
  ShoppingBag
} from 'lucide-vue-next'
import FloatingSupportWidget from '~/components/common/FloatingSupportWidget.vue'
import PaymentBadges from '~/components/common/PaymentBadges.vue'
import Footer from '~/components/landing/Footer.vue'
import { useNotifications } from '~/composables/useNotifications'
import { locale, setLocale, t } from '~/composables/useLocale'

const route = useRoute()
const userSession = ref<any>(null)
const activeNavTab = ref('anasayfa')
const isMobileMenuOpen = ref(false)
const showExpertiseModal = ref(false)
const EXPERTISE_TARGET_URL = ref('') // Kullanıcı harici link verdiğinde anında buraya yönlendirilecek

function handleExpertiseClick() {
  if (EXPERTISE_TARGET_URL.value) {
    if (typeof window !== 'undefined') {
      window.open(EXPERTISE_TARGET_URL.value, '_blank')
    }
  } else {
    showExpertiseModal.value = true
  }
}

const { unreadCount } = useNotifications()

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.company || userSession.value.username || userSession.value.name)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && (parsed.email || parsed.name || parsed.username || parsed.company || parsed.companyName)) {
          userSession.value = parsed
          return
        }
      }
      userSession.value = null
    } catch {
      userSession.value = null
    }
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('userSession')
      localStorage.removeItem('guestSession')
    } catch (e) {}
  }
  userSession.value = null
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'))
    window.location.reload()
  }
}

watch(() => route.fullPath, () => {
  checkSession()
  isMobileMenuOpen.value = false
})

onMounted(() => {
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
    window.addEventListener('focus', checkSession)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] font-sans text-slate-800 flex flex-col justify-between">
    
    <!-- ========================================================================= -->
    <!-- 📞 1. EN ÜST İNCE BİLGİ ŞERİDİ (GÖRSELDEKİ BİREBİR ÜST BAR - SADECE MASAÜSTÜNDE GÖRÜNÜR) -->
    <!-- ========================================================================= -->
    <div class="hidden lg:block bg-white border-b border-slate-300 py-1.5 px-4 sm:px-6 text-[11px] text-slate-600">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1">
            <span class="text-rose-600">📞</span>
            <strong>Destek:</strong> 
            <a href="tel:08508408695" class="text-blue-700 hover:underline">0850 840 86 95</a> / 0850 840 86 95
          </span>
          <span class="hidden sm:flex items-center gap-1">
            <span class="text-indigo-600">✉</span>
            <strong>E-posta:</strong> 
            <a href="mailto:ihalecib@gmail.com" class="text-blue-700 hover:underline">ihalecib@gmail.com</a>
          </span>
        </div>
        <div class="flex items-center gap-3">
          <!-- 🌐 DİL SEÇİCİ (TR / EN) -->
          <div class="flex items-center rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-[11px] font-bold shadow-2xs" role="group" aria-label="Dil Seçimi / Language Selection">
            <button 
              type="button" 
              @click="setLocale('tr')" 
              :class="locale === 'tr' ? 'bg-[#0B1E3B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1"
              aria-label="Türkçe Diline Geç"
            >
              <span>🇹🇷</span>
              <span>TR</span>
            </button>
            <button 
              type="button" 
              @click="setLocale('en')" 
              :class="locale === 'en' ? 'bg-[#0B1E3B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              class="px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1"
              aria-label="Switch to English Language"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1">
            <span>Kurumsal bilgiler</span> <ArrowRight :size="11" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏛️ 2. ANA HEADER: LOGO, MENÜ SEKMELERİ & HIZLI GİRİŞ ŞERİDİ -->
    <!-- ========================================================================= -->
    <header class="bg-white dark:bg-[#070E1E] border-b border-slate-300 dark:border-slate-800 pt-2 pb-2 px-3 sm:px-6 shadow-xs sticky top-0 z-50">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between gap-3">

        <!-- SOL: ORİJİNAL MARKA LOGOSU (İHALECİBURADA.COM) -->
        <NuxtLink to="/" class="flex items-center gap-3.5 hover:opacity-95 transition shrink-0 group py-1" title="İhaleciBurada.com Ana Sayfa">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 540 120" 
            class="h-9 sm:h-11 w-auto max-w-[210px] sm:max-w-[260px] object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-200" 
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
              <!-- Gövde -->
              <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#0B1E3B" class="fill-[#0B1E3B] dark:fill-[#38BDF8]" />
            </g>
            <!-- ihaleciburada Metni (Açıkta Koyu, Karanlıkta Net Beyaz) -->
            <text x="152" y="84" fill="#0B1E3B" class="fill-[#0B1E3B] dark:fill-white font-black" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
            <!-- .com Uzantısı (Canlı Mavi / Cyan) -->
            <text x="430" y="84" fill="#0052FF" class="fill-[#0052FF] dark:fill-[#38BDF8] font-black" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
          </svg>
        </NuxtLink>

        <!-- SAĞ (MASAÜSTÜ): ÜST MENÜ SEKMELERİ (hidden lg:flex) -->
        <!-- Misafir Menüsü (Giriş Yapılmamışsa) -->
        <nav v-if="!isLoggedIn" aria-label="Ana Gezinme Menüsü" class="hidden lg:flex flex-wrap items-center gap-1.5 text-white font-bold text-xs">
          <NuxtLink 
            to="/"
            :class="route.path === '/' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🏠 Ana Sayfa</span>
          </NuxtLink>

          <NuxtLink 
            to="/pazar-yeri"
            :class="route.path === '/pazar-yeri' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🛒 İhale Pazar Yeri</span>
          </NuxtLink>

          <NuxtLink 
            to="/abonelik"
            :class="route.path === '/abonelik' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>💎 Abonelik & Fiyatlar</span>
          </NuxtLink>

          <NuxtLink 
            to="/sozlesmeler?tab=hakkimizda"
            class="px-3.5 py-2 rounded-t-lg bg-[#1E3A8A] hover:bg-[#172554] text-slate-100 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>ℹ️ Hakkımızda</span>
          </NuxtLink>
        </nav>

        <!-- Üye Menüsü (Giriş Yapılmışsa - MASAÜSTÜ) -->
        <nav v-else aria-label="Kullanıcı Gezinme Menüsü" class="hidden lg:flex flex-wrap items-center gap-1.5 text-white font-bold text-xs">
          <NuxtLink 
            to="/"
            :class="route.path === '/' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🏠 Ana Sayfa</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/pazar-yeri" 
            :class="route.path === '/panel/pazar-yeri' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🛒 Pazar Yeri</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/ayarlar" 
            :class="route.path === '/panel/ayarlar' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>👤 Profilim</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/bildirimler" 
            :class="route.path === '/panel/bildirimler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer relative shadow-xs"
          >
            <span>🔔 Bildirimler</span>
            <span 
              v-if="unreadCount > 0" 
              class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse"
            >
              {{ unreadCount }}
            </span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/ilanlarim" 
            :class="route.path === '/panel/ilanlarim' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📑 Yayındaki İhalelerim</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/gelen-teklifler" 
            :class="route.path === '/panel/gelen-teklifler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📥 Gelen Teklifler</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/yaptigim-teklifler" 
            :class="route.path === '/panel/yaptigim-teklifler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📤 Verilen Teklifler</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/firmalar" 
            :class="route.path === '/panel/firmalar' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🏢 Üye Firmalar</span>
          </NuxtLink>
        </nav>

        <!-- SAĞ (MOBİL & TABLET): HIZLI AKSİYONLAR & HAMBURGER MENÜ (flex lg:hidden) -->
        <div class="flex lg:hidden items-center gap-2">
          <!-- İhale Aç (Mobil Kompakt) -->
          <NuxtLink 
            to="/panel/ihale-olustur" 
            class="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-[11px] shadow-xs flex items-center gap-1 border border-orange-400"
          >
            <Plus :size="13" class="stroke-[3]" />
            <span>İhale Aç</span>
          </NuxtLink>

          <!-- Giriş veya Panel (Mobil Kompakt) -->
          <NuxtLink 
            v-if="!isLoggedIn"
            to="/uyelik?tab=login" 
            class="px-2.5 py-1.5 rounded-lg bg-[#0F223D] text-white font-bold text-[11px] shadow-xs flex items-center gap-1 border border-slate-700"
          >
            <span>Giriş</span>
          </NuxtLink>
          <NuxtLink 
            v-else
            to="/panel" 
            class="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
          >
            <span>Panel</span>
          </NuxtLink>

          <!-- Hamburger Menü Butonu -->
          <button 
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Mobil Menüyü Aç/Kapat"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-controls="mobile-navigation-drawer"
          >
            <Menu v-if="!isMobileMenuOpen" :size="18" />
            <X v-else :size="18" />
          </button>
        </div>

      </div>

      <!-- 📱 MOBİL AÇILIR MENÜ PANELİ (DRAWER) -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div id="mobile-navigation-drawer" v-if="isMobileMenuOpen" class="lg:hidden mt-2 pt-3 border-t border-slate-200 space-y-3 pb-2 animate-fadeIn">
          
          <!-- Kullanıcı Bilgi Kartı (Giriş Yapılmışsa) -->
          <div v-if="isLoggedIn" class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-xs">
                {{ ((userSession?.companyName || userSession?.name || 'H').charAt(0)).toUpperCase() }}
              </div>
              <div class="truncate max-w-[180px]">
                <div class="font-black text-slate-800 text-xs truncate">
                  {{ (userSession?.isCompanyActive ? (userSession?.companyName || userSession?.company) : '') || userSession?.name || userSession?.firstName || 'Hesabım' }}
                </div>
                <div class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Aktif Oturum</span>
                </div>
              </div>
            </div>
            <button 
              type="button"
              @click="handleLogout"
              class="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold border border-red-200 flex items-center gap-1 hover:bg-red-100 cursor-pointer"
            >
              <LogOut :size="12" />
              <span>Çıkış</span>
            </button>
          </div>

          <!-- Hızlı Aksiyonlar -->
          <div class="grid grid-cols-3 gap-1.5">
            <NuxtLink 
              to="/panel/ihale-olustur" 
              @click="isMobileMenuOpen = false"
              class="py-2.5 px-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-[11px] text-center flex items-center justify-center gap-1 shadow-xs"
            >
              <span>+ İHALE AÇ</span>
            </NuxtLink>
            <NuxtLink 
              to="/abonelik"
              @click="isMobileMenuOpen = false"
              class="py-2.5 px-1.5 rounded-xl bg-[#0284C7] text-white font-bold text-[11px] text-center flex items-center justify-center gap-1 shadow-xs"
            >
              <span>🔄 Üyelik Uzat</span>
            </NuxtLink>
            <button 
              type="button"
              @click="isMobileMenuOpen = false; handleExpertiseClick()"
              class="py-2.5 px-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>📋 Ekspertiz</span>
            </button>
          </div>

          <!-- Temel Gezinme Linkleri -->
          <nav aria-label="Mobil Gezinme Menüsü" class="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 text-xs font-bold text-slate-700 overflow-hidden shadow-2xs">
            <NuxtLink to="/" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>🏠</span><span>Ana Sayfa</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/pazar-yeri" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>🛒</span><span>İhale Pazar Yeri</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/abonelik" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>💎</span><span>Abonelik & Fiyatlar</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=hakkimizda" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>ℹ️</span><span>Hakkımızda</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
          </nav>

          <!-- Üye Özel Menüsü (Giriş Yapılmışsa) -->
          <nav v-if="isLoggedIn" aria-label="Mobil Kullanıcı Menüsü" class="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 text-xs font-bold text-slate-700 overflow-hidden shadow-2xs">
            <NuxtLink to="/panel" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 bg-blue-50/60 hover:bg-blue-100/60 text-blue-900 font-black">
              <span class="flex items-center gap-2"><span>🎛️</span><span>Yönetim Paneli</span></span>
              <ArrowRight :size="13" class="text-blue-600" />
            </NuxtLink>
            <NuxtLink to="/panel/ayarlar" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>👤</span><span>Profilim & Ayarlar</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/panel/bildirimler" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>🔔</span><span>Bildirimler</span></span>
              <span v-if="unreadCount > 0" class="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black">{{ unreadCount }}</span>
            </NuxtLink>
            <NuxtLink to="/panel/ilanlarim" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>📑</span><span>Yayındaki İhalelerim</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/panel/gelen-teklifler" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>📥</span><span>Gelen Teklifler</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/panel/yaptigim-teklifler" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>📤</span><span>Verilen Teklifler</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
            <NuxtLink to="/panel/firmalar" @click="isMobileMenuOpen = false" class="flex items-center justify-between p-2.5 hover:bg-slate-50">
              <span class="flex items-center gap-2"><span>🏢</span><span>Üye Firmalar</span></span>
              <ArrowRight :size="13" class="text-slate-400" />
            </NuxtLink>
          </nav>

          <!-- Giriş Yapılmamışsa: Giriş & Kayıt Butonları -->
          <div v-else class="grid grid-cols-2 gap-2">
            <NuxtLink 
              to="/uyelik?tab=login"
              @click="isMobileMenuOpen = false"
              class="py-2.5 px-3 rounded-xl bg-[#0F223D] text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-xs"
            >
              <span>🔑 Giriş Yap</span>
            </NuxtLink>
            <NuxtLink 
              to="/uyelik?tab=register"
              @click="isMobileMenuOpen = false"
              class="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-xs"
            >
              <span>👤+ Yeni Üyelik</span>
            </NuxtLink>
          </div>

          <!-- 🌐 Mobil Dil Seçici (TR / EN) -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
            <span class="flex items-center gap-1.5">
              <span>🌐</span>
              <span>Dil Seçimi / Language:</span>
            </span>
            <div class="flex items-center gap-1">
              <button 
                type="button" 
                @click="setLocale('tr')" 
                :class="locale === 'tr' ? 'bg-[#0B1E3B] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                aria-label="Türkçe Diline Geç"
              >
                🇹🇷 TR
              </button>
              <button 
                type="button" 
                @click="setLocale('en')" 
                :class="locale === 'en' ? 'bg-[#0B1E3B] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                aria-label="Switch to English Language"
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          <!-- Destek Bilgileri -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <span>📞 Destek: <a href="tel:08508408695" class="text-blue-700 font-bold">0850 840 86 95</a></span>
            <a href="mailto:ihalecib@gmail.com" class="text-blue-700 font-bold">ihalecib@gmail.com</a>
          </div>

        </div>
      </transition>

      <!-- ALT İKİNCİ ŞERİT: MASAÜSTÜNDE GÖRÜNÜR (hidden lg:flex) -->
      <div class="hidden lg:flex max-w-[1400px] mx-auto mt-2 pt-2 border-t border-slate-200 items-center justify-between gap-3">
        
        <!-- Sol: İhale ve Abonelik Aksiyonları -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- 1. İhale Aç (Büyük, Yatayda Geniş ve Yanıp Sönen Dikkat Çekici Buton) -->
          <NuxtLink 
            to="/panel/ihale-olustur" 
            class="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-[length:200%_auto] hover:bg-right text-white font-black text-sm shadow-md shadow-orange-600/30 flex items-center gap-1.5 border border-orange-400 transition-all duration-300 animate-pulse hover:scale-105 cursor-pointer tracking-wide"
          >
            <span class="text-base leading-none">✨</span>
            <span>+ İHALE AÇ</span>
          </NuxtLink>

          <!-- 2. Üyelik Uzat -->
          <NuxtLink to="/abonelik" class="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-sky-700/30 transition cursor-pointer">
            <span>🔄 Üyelik uzat</span>
          </NuxtLink>

          <!-- 3. Ekspertiz Raporu Al -->
          <button 
            type="button"
            @click="handleExpertiseClick"
            class="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 border border-emerald-600/30 transition cursor-pointer"
          >
            <span>📋 Ekspertiz Raporu Al</span>
          </button>
        </div>

        <!-- Sağ: Kullanıcı Giriş / Çıkış & Profil Alanı (Her Zaman Sağda Aynı Yerde) -->
        <div class="flex items-center gap-2.5 text-xs">
          <!-- Giriş Yapılmamışsa: Yeni Üyelik & Giriş Yap Butonları -->
          <template v-if="!isLoggedIn">
            <NuxtLink 
              to="/uyelik?tab=register" 
              class="px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-emerald-700/30 transition cursor-pointer"
            >
              <span>👤+ Yeni üyelik</span>
            </NuxtLink>

            <NuxtLink 
              to="/uyelik?tab=login" 
              class="px-3.5 py-1.5 rounded-lg bg-[#0F223D] hover:bg-[#1E293B] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-slate-700/40 transition cursor-pointer"
            >
              <span>🔑 Giriş Yap</span>
            </NuxtLink>
          </template>

          <!-- Giriş Yapılmışsa: Profil, Panel ve Çıkış Butonları -->
          <template v-else>
            <NuxtLink 
              to="/panel/ayarlar"
              class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center gap-1.5 transition"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span class="truncate max-w-[180px]">{{ (userSession?.isCompanyActive ? (userSession?.companyName || userSession?.company) : '') || userSession?.name || userSession?.firstName || userSession?.username || 'Hesabım' }}</span>
            </NuxtLink>

            <NuxtLink 
              to="/panel" 
              class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span>🎛️ Panelime Git</span>
            </NuxtLink>

            <button 
              @click="handleLogout" 
              class="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition flex items-center gap-1 cursor-pointer"
              title="Güvenli Çıkış Yap"
            >
              <LogOut :size="13" />
              <span>Çıkış Yap</span>
            </button>
          </template>
        </div>

      </div>
    </header>

    <!-- SAYFA İÇERİĞİ -->
    <main class="flex-1 w-full pb-20 lg:pb-0">
      <slot />
    </main>

    <!-- ========================================================================= -->
    <!-- 🛡️ 3. MODERN KURUMSAL VE HUKUKİ FOOTER ALANI -->
    <!-- ========================================================================= -->
    <Footer />

    <!-- 📱 MOBİL SABİT ALT GEZİNME ÇUBUĞU (NATIVE APP BOTTOM BAR) -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl safe-bottom">
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        :class="route.path === '/' ? 'text-[#0052FF]' : ''"
      >
        <Home :size="20" />
        <span>Ana Sayfa</span>
      </NuxtLink>

      <NuxtLink 
        to="/pazar-yeri" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        :class="route.path === '/pazar-yeri' ? 'text-[#0052FF]' : ''"
      >
        <ShoppingBag :size="20" />
        <span>Pazar Yeri</span>
      </NuxtLink>

      <!-- Ortadaki Vurgulu İhale Aç FAB Butonu -->
      <NuxtLink 
        to="/panel/ihale-olustur" 
        class="flex flex-col items-center -mt-6 group"
      >
        <div class="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 group-active:scale-95 transition-all border-2 border-white">
          <Plus :size="24" class="stroke-[3]" />
        </div>
        <span class="text-[9px] font-black text-orange-600 mt-0.5">+ İhale Aç</span>
      </NuxtLink>

      <NuxtLink 
        :to="isLoggedIn ? '/panel/gelen-teklifler' : '/uyelik?tab=login'" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        :class="route.path.includes('teklif') ? 'text-[#0052FF]' : ''"
      >
        <Inbox :size="20" />
        <span>Teklifler</span>
      </NuxtLink>

      <NuxtLink 
        :to="isLoggedIn ? '/panel' : '/uyelik?tab=login'" 
        class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#0052FF]"
        :class="route.path.startsWith('/panel') || route.path.startsWith('/uyelik') ? 'text-[#0052FF]' : ''"
      >
        <User :size="20" />
        <span>{{ isLoggedIn ? 'Hesabım' : 'Giriş Yap' }}</span>
      </NuxtLink>
    </nav>

    <!-- Floating Destek Butonu -->
    <FloatingSupportWidget />

    <!-- 📋 EKSPERTİZ RAPORU AL BİLGİLENDİRME MODALI -->
    <Teleport to="body">
      <div 
        v-if="showExpertiseModal" 
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        @click.self="showExpertiseModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 relative overflow-hidden">
          <!-- Üst Çizgi -->
          <div class="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 absolute top-0 left-0 right-0"></div>

          <!-- Kapat Butonu -->
          <button 
            type="button"
            @click="showExpertiseModal = false" 
            aria-label="Kapat"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition cursor-pointer"
          >
            <X :size="18" />
          </button>

          <!-- İkon ve Başlık -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl shrink-0">
              📋
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 leading-tight">Lisanslı Ekspertiz & Değerleme Raporu</h3>
              <p class="text-xs text-teal-700 font-semibold mt-0.5">SPK & BDDK Akrediteli Bağımsız Uzman Raporlaması</p>
            </div>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed mb-4">
            İhaleye çıkaracağınız veya teklif vereceğiniz tüm gayrimenkul (konut, arsa, ticari vb.), araç, makine ve ticari emtialar için bağımsız lisanslı ekspertiz raporunuzu güvenle temin edebilirsiniz.
          </p>

          <!-- Özellikler -->
          <div class="space-y-2 mb-5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
              <span class="text-teal-600 font-black">✓</span>
              <span><strong>Resmi & Hukuki Geçerlilik:</strong> Mahkeme, banka ve resmi kurumlarda geçerli değerleme.</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
              <span class="text-teal-600 font-black">✓</span>
              <span><strong>Hızlı İnceleme:</strong> 24-48 saat içerisinde yerinde inceleme ve dijital rapor teslimi.</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
              <span class="text-teal-600 font-black">✓</span>
              <span><strong>Güvenli İhale Süreci:</strong> Alıcı ve satıcı taraflar için şeffaf, sıfır riskli ticaret.</span>
            </div>
          </div>

          <!-- Aksiyon Alanı -->
          <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="text-[11px] font-bold text-amber-900">Ekspertiz Talep & Danışma Hattı:</div>
              <a href="tel:08508408695" class="text-base font-black text-amber-800 tracking-wide hover:underline">0850 840 86 95</a>
            </div>
            <a 
              href="mailto:ihalecib@gmail.com?subject=Ekspertiz%20Raporu%20Talebi" 
              class="px-3.5 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition text-center shrink-0"
            >
              ✉️ E-posta ile Talep Et
            </a>
          </div>

          <!-- Kapat Butonu -->
          <button 
            type="button"
            @click="showExpertiseModal = false" 
            class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer text-center"
          >
            Tamam, Anladım
          </button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

