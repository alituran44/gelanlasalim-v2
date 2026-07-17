<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  ShoppingBag,
  Inbox,
  Send,
  Package,
  Tv,
  BarChart3,
  Coins,
  Building2,
  Users,
  Settings,
  LogOut,
  Plus,
  ChevronRight
} from "lucide-vue-next"

const route = useRoute()
const router = useRouter()

// Simulated user session — safe client-side loading
const userSession = ref<any>({})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch {
      userSession.value = {}
    }
  }
})

const userRole = computed(() => userSession.value?.role || 'buyer')
const userName = computed(() => userSession.value?.firstName || 'Kullanıcı')
const userCompany = computed(() => userSession.value?.company || 'Şirketiniz')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
  router.push('/')
}

const sidebarMenus = [
  { title: "Panel", icon: LayoutDashboard, to: "/panel" },
  { title: "Pazar Yeri", icon: ShoppingBag, to: "/panel/pazar-yeri" },
  { title: "İhalelerim", icon: ClipboardList, to: "/panel/ilanlarim" },
  { title: "Tekliflerim", icon: Send, to: "/panel/tekliflerim" },
  { title: "Sipariş & Teslimat", icon: Package, to: "/panel/siparis-teslimat" },
  { title: "Canlı Etkinlikler", icon: Tv, to: "/panel/canli-etkinlikler" },
  { title: "İstatistikler", icon: BarChart3, to: "/panel/istatistikler" },
  { title: "Döviz Kurları", icon: Coins, to: "/panel/doviz-kurlari" },
  { title: "Kurumsal Firmalar", icon: Building2, to: "/panel/firmalar" },
  { title: "Ekip & Yetki", icon: Users, to: "/panel/ekip-yetki" },
  { title: "Hesap Merkezi", icon: Settings, to: "/panel/ayarlar" },
]

const menus = computed(() => sidebarMenus)

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="w-64 min-h-screen flex flex-col" style="background: #0F172A;">

    <!-- Logo Alanı -->
    <div class="px-6 py-5 border-b" style="border-color: rgba(255,255,255,0.08);">
      <div class="flex items-center gap-2.5">
        <!-- Inline SVG Premium G Logo -->
        <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#1E3A5F"/>
          <path d="M17 9C16.1 7.6 14.4 6.7 12.5 6.7C9.5 6.7 7 9.2 7 12.2C7 15.2 9.5 17.7 12.5 17.7C15.5 17.7 17.8 15.2 17.8 12.2H12.5" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="17.8" cy="12.2" r="1.5" fill="#FFFFFF"/>
        </svg>
        <div>
          <h1 class="text-sm font-bold text-white tracking-wide">Gel<span style="color: #F59E0B;">Anlaşalım</span></h1>
          <p class="text-[9px]" style="color: #64748B;">B2B İhale Platformu</p>
        </div>
      </div>
    </div>

    <!-- Rol Etiketi -->
    <div class="px-6 py-3">
      <span
        class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        :style="userRole === 'buyer'
          ? 'background: rgba(245,158,11,0.12); color: #F59E0B;'
          : 'background: rgba(34,197,94,0.12); color: #22C55E;'"
      >
        {{ userRole === 'buyer' ? '🏢 Alıcı Firma' : '🏭 Tedarikçi' }}
      </span>
    </div>

    <!-- Yeni İhale Oluştur Butonu -->
    <div class="px-3 mb-4">
      <NuxtLink
        to="/panel/ihale-olustur"
        class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all shadow-md"
        style="background: #1E3A5F; border: 1px solid rgba(255, 255, 255, 0.15);"
        onmouseover="this.style.background='#F59E0B'"
        onmouseout="this.style.background='#1E3A5F'"
      >
        <Plus :size="14" />
        Yeni ihale oluştur
      </NuxtLink>
    </div>

    <!-- Navigasyon -->
    <nav class="flex-1 px-3 pb-4 space-y-0.5">
      <NuxtLink
        v-for="item in menus"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group"
        :class="activePath === item.to
          ? 'text-white'
          : 'text-slate-400 hover:text-white'"
        :style="activePath === item.to
          ? 'background: rgba(245,158,11,0.15); color: #F59E0B;'
          : ''"
      >
        <component
          :is="item.icon"
          :size="17"
          :style="activePath === item.to ? 'color: #F59E0B;' : ''"
          class="shrink-0 transition-colors"
        />
        <span>{{ item.title }}</span>
        <ChevronRight
          v-if="activePath === item.to"
          :size="14"
          class="ml-auto"
          style="color: #F59E0B;"
        />
      </NuxtLink>
    </nav>

    <!-- Kullanıcı Bilgisi -->
    <div class="px-4 py-4 border-t" style="border-color: rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3 mb-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style="background: linear-gradient(135deg, #1E3A5F, #2563EB);"
        >
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-white truncate">{{ userName }}</div>
          <div class="text-xs truncate" style="color: #64748B;">{{ userCompany }}</div>
        </div>
      </div>
      <button
        @click="logout"
        class="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all duration-150"
        style="background: rgba(239,68,68,0.08); color: #EF4444; border: 1px solid rgba(239,68,68,0.2);"
        onmouseover="this.style.background='rgba(239,68,68,0.18)'"
        onmouseout="this.style.background='rgba(239,68,68,0.08)'"
      >
        <LogOut :size="14" />
        Çıkış Yap
      </button>
    </div>

  </aside>
</template>