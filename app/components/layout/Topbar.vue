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
  CheckCircle2 
} from "lucide-vue-next"
import { locale, detectLocale, setLocale } from '~/composables/useLocale'

const route = useRoute()
const router = useRouter()
const search = ref("")
const showNotifDropdown = ref(false)
const showUserMenu = ref(false)

const notifications = ref([
  {
    id: 1,
    title: 'Yeni Teklif Geldi ⚡',
    desc: '10 KM Mıcır Yol Yapım İşi ihalesine 1.380.000 ₺ tutarında yeni teklif sunuldu.',
    time: '5 dk önce',
    unread: true,
    to: '/panel/gelen-teklifler'
  },
  {
    id: 2,
    title: 'Karşı Teklif & Pazarlık 💬',
    desc: 'Yazılım Geliştirme ihalesinde alıcı firma pazarlık mesajı iletti.',
    time: '45 dk önce',
    unread: true,
    to: '/panel/yaptigim-teklifler'
  },
  {
    id: 3,
    title: 'NetGSM SMS İletildi 📱',
    desc: 'Teklif onay ve sözleşme bilgilendirme SMS mesajı karşı tarafa iletildi.',
    time: '2 saat önce',
    unread: false,
    to: '/panel/bildirimler'
  }
])

const notifCount = computed(() => notifications.value.filter(n => n.unread).length)

function markAllAsRead() {
  notifications.value.forEach(n => n.unread = false)
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('guestSession')
  }
  showUserMenu.value = false
  router.push('/')
}

// Simulated user session — safe client-side loading
const userSession = ref<any>({})

onMounted(() => {
  detectLocale()
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch {
      userSession.value = {}
    }
  }
})

const userName = computed(() => {
  return userSession.value?.name || userSession.value?.firstName || userSession.value?.username || 'Hesabım'
})
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

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

      <!-- User Profile Menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm transition hover:bg-slate-50 cursor-pointer"
        >
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
            style="background: #003057;"
          >
            {{ userInitial }}
          </div>
          <span class="hidden md:block font-bold text-xs text-slate-900">{{ userName }}</span>
          <ChevronDown :size="13" class="text-slate-400" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-slate-200 bg-white shadow-xl py-1.5 text-left animate-fadeIn"
        >
          <div class="px-4 py-2 border-b border-slate-100">
            <div class="text-xs font-bold text-slate-800 truncate">{{ userName }}</div>
            <div class="text-[10px] text-slate-400">Onaylı Kurumsal Hesap</div>
          </div>
          <NuxtLink to="/panel/ayarlar" @click="showUserMenu=false"
            class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Hesap Ayarları
          </NuxtLink>
          <NuxtLink to="/abonelik" @click="showUserMenu=false"
            class="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Üyelik Planı (1 Ay Deneme)
          </NuxtLink>
          <div class="my-1 border-t border-slate-100"></div>
          <button
            @click="handleLogout"
            class="block w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

    </div>
  </header>
</template>