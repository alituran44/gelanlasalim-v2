<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Search, Bell, Plus, ChevronDown, User, Home, Globe } from "lucide-vue-next"
import { locale, detectLocale, setLocale } from '~/composables/useLocale'

const route = useRoute()
const router = useRouter()
const search = ref("")
const notifCount = ref(3)
const showUserMenu = ref(false)

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
  showUserMenu.value = false
  router.push('/')
}

function toggleLang() {
  if (locale.value === 'tr') {
    setLocale('en')
  } else {
    setLocale('tr')
  }
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

const userName = computed(() => userSession.value?.firstName || (locale.value === 'tr' ? 'Kullanıcı' : 'User'))
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const pageTitle = computed(() => {
  if (locale.value === 'tr') {
    const titles: Record<string, string> = {
      '/panel': 'Yönetim Paneli',
      '/panel/ilanlarim': 'İhalelerim',
      '/panel/gelen-teklifler': 'Gelen Teklifler',
      '/panel/yaptigim-teklifler': 'Verdiğim Teklifler',
      '/panel/mesajlar': 'Mesajlar',
      '/panel/bildirimler': 'Bildirimler',
      '/panel/ayarlar': 'Hesap & Ayarlar',
      '/panel/ihale-olustur': 'Yeni İhale Oluştur',
    }
    return titles[route.path] || 'Yönetim Paneli'
  } else {
    const titles: Record<string, string> = {
      '/panel': 'Dashboard',
      '/panel/ilanlarim': 'My Tenders',
      '/panel/gelen-teklifler': 'Received Bids',
      '/panel/yaptigim-teklifler': 'My Submitted Bids',
      '/panel/mesajlar': 'Messages',
      '/panel/bildirimler': 'Notifications',
      '/panel/ayarlar': 'Account Settings',
      '/panel/ihale-olustur': 'Create New Tender',
    }
    return titles[route.path] || 'Dashboard'
  }
})
</script>

<template>
  <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6"
    style="border-color: #E2E8F0;">

    <!-- Left: Page Title -->
    <div class="flex items-center gap-4">
      <div>
        <h2 class="text-base font-semibold" style="color: #0F172A;">{{ pageTitle }}</h2>
        <p class="text-xs" style="color: #94A3B8;">GelAnlaşalım B2B Platform</p>
      </div>

      <!-- Search -->
      <div class="relative hidden md:block">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2" :size="15" style="color: #94A3B8;" />
        <input
          v-model="search"
          type="text"
          :placeholder="'İhalelerde ara...'"
          class="w-64 rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition"
          style="border-color: #E2E8F0; background: #F8FAFC; color: #0F172A;"
          onfocus="this.style.borderColor='#1EAE4C'; this.style.boxShadow='0 0 0 3px rgba(30,174,76,0.1)'"
          onblur="this.style.borderColor='#E2E8F0'; this.style.boxShadow='none'"
        />
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">

      <!-- Language Toggle Button (TR / EN) -->
      <button
        type="button"
        @click="toggleLang"
        class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white px-3 py-2 text-xs font-black text-slate-800 transition shadow-xs cursor-pointer"
        :title="'Switch to English'"
      >
        <Globe :size="14" class="text-blue-600" />
        <span>{{ '🇹🇷 TR' }}</span>
      </button>

      <!-- Home Page Button -->
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-800 hover:bg-white hover:text-amber-600 transition shadow-xs"
        :title="'Ana Sayfaya Dön'"
      >
        <Home :size="14" class="text-amber-600" />
        <span>{{ 'Ana Sayfaya Git' }}</span>
      </NuxtLink>

      <!-- New Tender Button -->
      <NuxtLink
        to="/panel/ihale-olustur"
        class="hidden md:flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition"
        style="background: #0A1128; border: 1px solid #C59B27;"
      >
        <Plus :size="15" class="text-amber-400" />
        <span>{{ 'Yeni İhale' }}</span>
      </NuxtLink>

      <!-- Notifications -->
      <button 
        class="relative flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-slate-50"
        style="border-color: #E2E8F0;"
        :title="'Okunmamış Bildirimler'"
      >
        <Bell :size="17" style="color: #475569;" />
        <span
          v-if="notifCount > 0"
          class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style="background: #EF4444;"
        >
          {{ notifCount }}
        </span>
      </button>

      <!-- Profilim Button -->
      <NuxtLink
        to="/panel/ayarlar"
        class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl border transition-all text-slate-800 bg-amber-50 hover:bg-amber-100 border-amber-300 shadow-xs"
      >
        <User :size="14" class="text-amber-600" />
        <span>{{ 'Profilim' }}</span>
      </NuxtLink>

      <!-- User Menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition hover:bg-slate-50"
          style="border-color: #E2E8F0;"
        >
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
            style="background: linear-gradient(135deg, #0A1128, #1C2541); border: 1px solid #C59B27;"
          >
            {{ userInitial }}
          </div>
          <span class="hidden md:block font-bold text-xs" style="color: #0F172A;">{{ userName }}</span>
          <ChevronDown :size="14" style="color: #94A3B8;" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-11 z-50 w-44 rounded-xl border bg-white shadow-lg py-1"
          style="border-color: #E2E8F0;"
        >
          <NuxtLink to="/panel/ayarlar" @click="showUserMenu=false"
            class="block px-4 py-2 text-sm hover:bg-slate-50 transition" style="color: #475569;">
            Profile Settings
          </NuxtLink>
          <NuxtLink to="/abonelik" @click="showUserMenu=false"
            class="block px-4 py-2 text-sm hover:bg-slate-50 transition" style="color: #475569;">
            Subscription
          </NuxtLink>
          <div class="my-1 border-t" style="border-color: #F1F5F9;"></div>
          <button
            @click="handleLogout"
            class="block w-full px-4 py-2 text-left text-sm transition hover:bg-red-50"
            style="color: #EF4444;"
          >
            Log Out
          </button>
        </div>
      </div>

    </div>
  </header>
</template>