<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  User, 
  Home, 
  Globe, 
  Play, 
  ShoppingBag, 
  CheckCheck, 
  Inbox, 
  MessageSquare, 
  CheckCircle2,
  BellOff,
  LogOut
} from "lucide-vue-next"
import { locale, detectLocale, setLocale } from '~/composables/useLocale'
import { useCmsData } from '~/composables/useCmsData'
import { useNotifications } from '~/composables/useNotifications'
import { useUserSession } from '~/composables/useUserSession'

const route = useRoute()
const router = useRouter()
const search = ref("")
const showNotifDropdown = ref(false)
const showUserMenu = ref(false)
const { cmsData } = useCmsData()

const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
const { userSession, userName, isCompanyMode, companyName, logout: sessionLogout } = useUserSession()

const notifCount = computed(() => unreadCount.value)

function handleLogout() {
  sessionLogout()
  showUserMenu.value = false
  router.push('/')
}

onMounted(() => {
  detectLocale()
})

const userAvatar = computed(() => userSession.value?.picture || userSession.value?.avatar || userSession.value?.companyLogo || '')
const userInitial = computed(() => (userName.value || 'K').charAt(0).toUpperCase())

const pageTitle = computed(() => {
  if (locale.value === 'tr') {
    const titles: Record<string, string> = {
      '/panel': 'Yönetim Paneli',
      '/panel/pazar-yeri': 'İhale Pazar Yeri',
      '/panel/ilanlarim': 'İhalelerim',
      '/panel/gelen-teklifler': 'Aldığım Teklifler (Gelen)',
      '/panel/yaptigim-teklifler': 'Verdiğim Teklifler (Yaptığım)',
      '/panel/tekliflerim': 'Teklif Yönetim Merkezi',
      '/panel/siparis-teslimat': 'Sipariş & Teslimat (Escrow)',
      '/panel/canli-etkinlikler': 'İhale ve Satın Alma Arenası',
      '/panel/istatistikler': 'Analitik & Raporlar',
      '/panel/doviz-kurlari': 'Döviz & Emtia Kurları',
      '/panel/mucbir-sebep': 'Mücbir Sebep & Sözleşme Feshi',
      '/panel/firmalar': 'Onaylı Kurumsal Firmalar',
      '/panel/ekip-yetki': 'Ekip & Yetkilendirme',
      '/panel/mesajlar': 'Mesajlar',
      '/panel/bildirimler': 'Bildirimler',
      '/panel/ayarlar': 'Hesap & Ayarlar',
      '/panel/ihale-olustur': 'Yeni İhale Oluştur',
    }
    return titles[route.path] || 'Yönetim Paneli'
  } else {
    return 'Dashboard'
  }
})
</script>

<template>
  <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6 border-slate-200 shadow-2xs">

    <!-- Left: Page Title -->
    <div class="flex items-center gap-4 text-left">
      <div>
        <h2 class="text-base font-black text-slate-900">{{ pageTitle }}</h2>
        <p class="text-xs text-slate-400 font-medium">İhaleciBurada B2B Operasyon Merkezi</p>
      </div>

      <!-- Search -->
      <div class="relative hidden xl:block">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="14" />
        <input
          v-model="search"
          type="text"
          placeholder="İhalelerde veya tekliflerde ara..."
          class="w-64 rounded-xl border border-slate-200 py-1.5 pl-9 pr-3 text-xs outline-none bg-slate-50 focus:border-[#1EAE4C] focus:bg-white transition"
        />
      </div>
    </div>

    <!-- Right: Actions & Links -->
    <div class="flex items-center gap-2">

      <!-- 🛡️ Sabit %4 Escrow Komisyon Rozeti & Kolay Erişim Linki -->
      <NuxtLink
        to="/panel/siparis-teslimat"
        class="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/90 px-3 py-1.5 text-xs font-black text-emerald-900 hover:bg-emerald-100 transition shadow-2xs"
        title="Sektör ayrımı yapmaksızın tüm işlemlerde sabit %4 Escrow komisyonu"
      >
        <ShieldCheck :size="14" class="text-emerald-600" />
        <span>Escrow Komisyonu: <strong class="text-emerald-700 font-mono font-black">%4 Sabit</strong></span>
      </NuxtLink>

      <!-- Home Page Button -->
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-800 hover:bg-white hover:text-blue-600 transition shadow-xs"
      >
        <Home :size="14" class="text-blue-600" />
        <span>Ana Sayfa</span>
      </NuxtLink>

      <!-- New Tender Button (Büyük ve Yanıp Sönen) -->
      <NuxtLink
        to="/panel/ihale-olustur"
        class="hidden sm:flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all duration-300 animate-pulse hover:scale-105"
      >
        <span class="text-sm">✨</span>
        <span>+ İHALE AÇ</span>
      </NuxtLink>

      <!-- Notifications Dropdown Trigger -->
      <div class="relative">
        <button 
          @click="showNotifDropdown = !showNotifDropdown"
          class="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-50 cursor-pointer"
          title="Bildirimler"
        >
          <Bell :size="17" class="text-slate-600" />
          <span
            v-if="notifCount > 0"
            class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white bg-red-500 animate-pulse"
          >
            {{ notifCount }}
          </span>
        </button>

        <!-- Notification Panel Dropdown -->
        <div
          v-if="showNotifDropdown"
          class="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 text-left space-y-2 animate-fadeIn"
        >
          <div class="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
            <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Bell :size="13" class="text-[#1EAE4C]" />
              Bildirimler ({{ notifCount }})
            </span>
            <button 
              @click="markAllAsRead"
              class="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <CheckCheck :size="12" />
              Tümünü Okundu Say
            </button>
          </div>

          <div class="space-y-1 max-h-72 overflow-y-auto">
            <NuxtLink
              v-for="notif in notifications"
              :key="notif.id"
              :to="notif.to"
              @click="notif.unread = false; showNotifDropdown = false"
              class="block p-2.5 rounded-xl transition-all"
              :class="notif.unread ? 'bg-blue-50/70 hover:bg-blue-100/70' : 'hover:bg-slate-50'"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="text-xs font-black text-slate-900">{{ notif.title }}</span>
                <span class="text-[9px] text-slate-400 shrink-0 font-mono">{{ notif.time }}</span>
              </div>
              <p class="text-[11px] text-slate-600 mt-0.5 leading-snug">{{ notif.desc }}</p>
            </NuxtLink>
          </div>

          <div class="pt-2 border-t border-slate-100 text-center">
            <NuxtLink
              to="/panel/bildirimler"
              @click="showNotifDropdown = false"
              class="text-xs font-bold text-slate-700 hover:text-blue-600 block py-1"
            >
              Tüm Bildirimleri Görüntüle →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- User Profile & Direct Logout (Giriş / Çıkış Yan Yana) -->
      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <div
              class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs overflow-hidden shrink-0"
              style="background: #003057;"
            >
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="h-full w-full object-cover" />
              <span v-else>{{ userInitial }}</span>
            </div>
            <div class="text-left hidden md:block leading-none">
              <span class="block font-bold text-xs text-slate-900">{{ userName }}</span>
              <span class="block text-[9px] font-semibold text-slate-400 mt-0.5">
                {{ isCompanyMode ? (companyName || 'Kurumsal Hesap') : 'Kişisel Hesap' }}
              </span>
            </div>
            <ChevronDown :size="13" class="text-slate-400" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-slate-200 bg-white shadow-xl py-1.5 text-left animate-fadeIn"
          >
            <div class="px-4 py-2 border-b border-slate-100">
              <div class="text-xs font-bold text-slate-800 truncate">{{ userName }}</div>
              <div class="text-[10px] text-slate-400 font-medium">
                {{ isCompanyMode ? (companyName || 'Kurumsal Hesap') : 'Kişisel Profil' }}
              </div>
            </div>
            <NuxtLink to="/panel/ayarlar?tab=kisisel" @click="showUserMenu=false"
              class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              👤 Profil Ayarları
            </NuxtLink>
            <NuxtLink v-if="isCompanyMode" to="/panel/ayarlar?tab=sirket" @click="showUserMenu=false"
              class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              🏢 Şirket Bilgileri
            </NuxtLink>
            <NuxtLink to="/panel/ayarlar?tab=adresler" @click="showUserMenu=false"
              class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              📍 Adreslerim
            </NuxtLink>
            <NuxtLink to="/abonelik" @click="showUserMenu=false"
              class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              ⚡ Üyelik & Paketler
            </NuxtLink>
            <div class="my-1 border-t border-slate-100"></div>
            <button
              @click="handleLogout"
              class="block w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <!-- Hızlı Doğrudan Çıkış Butonu (Yan Yana) -->
        <button
          @click="handleLogout"
          class="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 text-xs font-bold transition shadow-2xs cursor-pointer"
          title="Güvenli Çıkış Yap"
        >
          <LogOut :size="13" />
          <span class="hidden sm:inline">Çıkış</span>
        </button>
      </div>

    </div>
  </header>
</template>