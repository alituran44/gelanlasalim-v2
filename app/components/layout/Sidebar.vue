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
  HelpCircle,
  ChevronRight,
  User,
  MapPin,
  Bell,
  Heart,
  History,
  Award,
  Sliders,
  Building
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

const userRole = computed(() => userSession.value?.role || 'company')
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

const isSettingsPage = computed(() => {
  return route.path === '/panel/ayarlar' || route.path === '/panel/yardim'
})

const settingsGroups = [
  {
    title: "Profil",
    items: [
      { title: "Kişisel", icon: User, to: "/panel/ayarlar?tab=kisisel", tab: "kisisel" },
      { title: "Şirket & Doğrulama", icon: Building2, to: "/panel/ayarlar?tab=sirket", tab: "sirket" }
    ]
  },
  {
    title: "İş akışı",
    items: [
      { title: "Kayıtlı Adresler", icon: MapPin, to: "/panel/ayarlar?tab=adresler", tab: "adresler" },
      { title: "Bildirimler", icon: Bell, to: "/panel/ayarlar?tab=bildirimler", tab: "bildirimler" },
      { title: "Takip Ettiklerim", icon: Heart, to: "/panel/ayarlar?tab=takip", tab: "takip" },
      { title: "Geçmiş Ticaretlerim", icon: History, to: "/panel/ayarlar?tab=ticaret", tab: "ticaret" }
    ]
  },
  {
    title: "Hesap",
    items: [
      { title: "Üyelik", icon: Award, to: "/panel/ayarlar?tab=uyelik", tab: "uyelik" },
      { title: "Ayarlar", icon: Sliders, to: "/panel/ayarlar?tab=ayarlar", tab: "ayarlar" }
    ]
  }
]

const menus = computed(() => sidebarMenus)
const activePath = computed(() => route.path)
const activeTabQuery = computed(() => route.query.tab || 'ayarlar')
</script>

<template>
  <aside class="w-64 h-screen sticky top-0 flex flex-col shrink-0" style="background: #0F172A;">

    <!-- Logo Alanı -->
    <div class="px-6 py-5 border-b flex justify-start" style="border-color: rgba(255,255,255,0.08);">
      <img src="/logo.png" alt="GelAnlaşalım B2B Kurumsal Logo" class="h-8 w-auto brightness-0 invert" />
    </div>

    <!-- Rol Etiketi -->
    <div class="px-6 py-3">
      <span
        class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
        :style="userRole === 'company'
          ? 'background: rgba(30,174,76,0.12); color: #1EAE4C;'
          : 'background: rgba(37,99,235,0.12); color: #2563EB;'"
      >
        {{ userRole === 'company' ? '🏢 Firma Kaydı' : '👤 Bireysel Üye' }}
      </span>
    </div>

    <!-- Conditional Navigation menus -->
    <template v-if="isSettingsPage">
      <!-- Firma Merkezi Butonu -->
      <div class="px-3 mb-4">
        <NuxtLink
          to="/panel"
          class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all shadow-md"
          style="background: #003057; border: 1px solid rgba(255, 255, 255, 0.15);"
          onmouseover="this.style.background='#1EAE4C'"
          onmouseout="this.style.background='#003057'"
        >
          <LayoutDashboard :size="14" />
          Firma Merkezi
        </NuxtLink>
      </div>

      <!-- Settings Submenu groups -->
      <div class="flex-1 px-3 pb-4 space-y-4 overflow-y-auto">
        <div v-for="group in settingsGroups" :key="group.title" class="space-y-1">
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block px-3 mb-1.5">{{ group.title }}</span>
          <NuxtLink
            v-for="item in group.items"
            :key="item.tab"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-150"
            :class="activeTabQuery === item.tab && route.path === '/panel/ayarlar'
              ? 'text-white'
              : 'text-slate-400 hover:text-white'"
            :style="activeTabQuery === item.tab && route.path === '/panel/ayarlar'
              ? 'background: rgba(30,174,76,0.15); color: #1EAE4C;'
              : ''"
          >
            <component
              :is="item.icon"
              :size="15"
              :style="activeTabQuery === item.tab && route.path === '/panel/ayarlar' ? 'color: #1EAE4C;' : ''"
              class="shrink-0 transition-colors"
            />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Yeni İhale Oluştur Butonu -->
      <div class="px-3 mb-4">
        <NuxtLink
          to="/panel/ihale-olustur"
          class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white transition-all shadow-md"
          style="background: #003057; border: 1px solid rgba(255, 255, 255, 0.15);"
          onmouseover="this.style.background='#1EAE4C'"
          onmouseout="this.style.background='#003057'"
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
            ? 'background: rgba(30,174,76,0.15); color: #1EAE4C;'
            : ''"
        >
          <component
            :is="item.icon"
            :size="17"
            :style="activePath === item.to ? 'color: #1EAE4C;' : ''"
            class="shrink-0 transition-colors"
          />
          <span>{{ item.title }}</span>
          <ChevronRight
            v-if="activePath === item.to"
            :size="14"
            class="ml-auto"
            style="color: #1EAE4C;"
          />
        </NuxtLink>
      </nav>
    </template>

    <!-- Yardım Merkezi Butonu -->
    <div class="px-3 mb-2 border-t pt-2" style="border-color: rgba(255,255,255,0.08);">
      <NuxtLink
        to="/panel/yardim"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150"
        :class="activePath === '/panel/yardim' ? 'text-white' : 'text-slate-400 hover:text-white'"
        :style="activePath === '/panel/yardim' ? 'background: rgba(30,174,76,0.15); color: #1EAE4C;' : ''"
      >
        <HelpCircle :size="17" :style="activePath === '/panel/yardim' ? 'color: #1EAE4C;' : ''" />
        <span>Yardım</span>
      </NuxtLink>
    </div>

    <!-- Kullanıcı Bilgisi -->
    <div class="px-4 py-4 border-t" style="border-color: rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3 mb-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style="background: linear-gradient(135deg, #003057, #1EAE4C);"
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