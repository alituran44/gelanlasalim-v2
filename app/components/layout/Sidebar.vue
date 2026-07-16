<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Inbox,
  SendHorizonal,
  MessageSquare,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-vue-next"

const route = useRoute()
const router = useRouter()

// Simulated user session — replace with real auth store
const userSession = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('userSession') || '{}')
  } catch {
    return {}
  }
})

const userRole = computed(() => userSession.value?.role || 'buyer')
const userName = computed(() => userSession.value?.firstName || 'Kullanıcı')
const userCompany = computed(() => userSession.value?.company || 'Şirketiniz')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function logout() {
  localStorage.removeItem('userSession')
  router.push('/')
}

const buyerMenus = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/panel" },
  { title: "İhale Oluştur", icon: FilePlus2, to: "/panel/ihale-olustur" },
  { title: "İlanlarım", icon: ClipboardList, to: "/panel/ilanlarim" },
  { title: "Gelen Teklifler", icon: Inbox, to: "/panel/gelen-teklifler" },
  { title: "Mesajlar", icon: MessageSquare, to: "/panel/mesajlar" },
  { title: "Bildirimler", icon: Bell, to: "/panel/bildirimler" },
  { title: "Abonelik", icon: CreditCard, to: "/abonelik" },
  { title: "Ayarlar", icon: Settings, to: "/panel/ayarlar" },
]

const supplierMenus = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/panel" },
  { title: "İhale Bul", icon: ClipboardList, to: "/panel/ilanlarim" },
  { title: "Yaptığım Teklifler", icon: SendHorizonal, to: "/panel/yaptigim-teklifler" },
  { title: "Mesajlar", icon: MessageSquare, to: "/panel/mesajlar" },
  { title: "Bildirimler", icon: Bell, to: "/panel/bildirimler" },
  { title: "Abonelik", icon: CreditCard, to: "/abonelik" },
  { title: "Ayarlar", icon: Settings, to: "/panel/ayarlar" },
]

const menus = computed(() => userRole.value === 'supplier' ? supplierMenus : buyerMenus)

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="w-64 min-h-screen flex flex-col" style="background: #0F172A;">

    <!-- Logo Alanı -->
    <div class="px-6 py-5 border-b" style="border-color: rgba(255,255,255,0.08);">
      <div class="flex items-center gap-2.5">
        <!-- Inline SVG Premium Acsisco Logo -->
        <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 19L11.05 4.35C11.45 3.65 12.55 3.65 12.95 4.35L21 19H16.5L12 10.5L7.5 19H3Z" fill="#FFFFFF"/>
          <path d="M12 10.5L9.5 15H14.5L12 10.5Z" fill="#0D9488"/>
        </svg>
        <div>
          <h1 class="text-sm font-bold text-white tracking-wide">Acsisco</h1>
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