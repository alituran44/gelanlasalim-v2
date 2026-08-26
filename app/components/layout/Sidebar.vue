<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  ChevronDown,
  User,
  MapPin,
  Bell,
  Heart,
  History,
  Award,
  Sliders,
  Building,
  Globe
} from "lucide-vue-next"
import { locale, detectLocale, setLocale } from '~/composables/useLocale'

const route = useRoute()
const router = useRouter()

// Simulated user session — safe client-side loading
const userSession = ref<any>({})
const isTekliflerOpen = ref(true)

watchEffect(() => {
  if (route.path.includes('teklif')) {
    isTekliflerOpen.value = true
  }
})

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

function toggleLang() {
  if (locale.value === 'tr') {
    setLocale('en')
  } else {
    setLocale('tr')
  }
}

const userRole = computed(() => userSession.value?.role || 'company')
const userName = computed(() => userSession.value?.firstName || 'User')
const userCompany = computed(() => userSession.value?.company || 'Your Company')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
  router.push('/')
}

const sidebarMenus = computed(() => {
  if (locale.value === 'tr') {
    return [
      { title: "Yönetim Paneli", icon: LayoutDashboard, to: "/panel" },
      { title: "Pazar Yeri", icon: ShoppingBag, to: "/panel/pazar-yeri" },
      { title: "İhalelerim", icon: ClipboardList, to: "/panel/ilanlarim" },
      { 
        title: "Tekliflerim", 
        icon: Send, 
        isDropdown: true,
        children: [
          { title: "Aldığım Teklifler (Gelen)", icon: Inbox, to: "/panel/gelen-teklifler" },
          { title: "Verdiğim Teklifler (Yaptığım)", icon: Send, to: "/panel/yaptigim-teklifler" }
        ]
      },
      { title: "Sipariş & Teslimat", icon: Package, to: "/panel/siparis-teslimat" },
      { title: "Canlı Etkinlikler", icon: Tv, to: "/panel/canli-etkinlikler" },
      { title: "İstatistikler", icon: BarChart3, to: "/panel/istatistikler" },
      { title: "Döviz Kurları", icon: Coins, to: "/panel/doviz-kurlari" },
      { title: "Kurumsal Firmalar", icon: Building2, to: "/panel/firmalar" },
      { title: "Ekip & Yetki", icon: Users, to: "/panel/ekip-yetki" },
      { title: "Hesap & Ayarlar", icon: Settings, to: "/panel/ayarlar" },
    ]
  } else {
    return [
      { title: "Dashboard", icon: LayoutDashboard, to: "/panel" },
      { title: "Marketplace", icon: ShoppingBag, to: "/panel/pazar-yeri" },
      { title: "My Tenders", icon: ClipboardList, to: "/panel/ilanlarim" },
      { 
        title: "My Bids", 
        icon: Send, 
        isDropdown: true,
        children: [
          { title: "Received Bids", icon: Inbox, to: "/panel/gelen-teklifler" },
          { title: "Submitted Bids", icon: Send, to: "/panel/yaptigim-teklifler" }
        ]
      },
      { title: "Orders & Shipping", icon: Package, to: "/panel/siparis-teslimat" },
      { title: "Live Auctions", icon: Tv, to: "/panel/canli-etkinlikler" },
      { title: "Analytics", icon: BarChart3, to: "/panel/istatistikler" },
      { title: "Exchange Rates", icon: Coins, to: "/panel/doviz-kurlari" },
      { title: "Verified Companies", icon: Building2, to: "/panel/firmalar" },
      { title: "Team & Permissions", icon: Users, to: "/panel/ekip-yetki" },
      { title: "Account Center", icon: Settings, to: "/panel/ayarlar" },
    ]
  }
})

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="w-64 h-screen sticky top-0 flex flex-col shrink-0 text-left font-sans select-none" style="background: #0F223D;">

    <!-- Logo Alanı (Büyük & Belirgin) -->
    <div class="px-5 py-4 border-b flex justify-start items-center" style="border-color: rgba(255,255,255,0.08);">
      <NuxtLink to="/" class="block w-full hover:opacity-95 transition">
        <img src="/logo-white.png" alt="İhaleciBurada.com" class="h-10 sm:h-11 w-auto max-h-[48px] object-contain drop-shadow-md" />
      </NuxtLink>
    </div>

    <!-- Rol Etiketi -->
    <div class="px-5 py-3">
      <span
        class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold"
        :style="userRole === 'company'
          ? 'background: rgba(0,82,255,0.18); color: #00C2FF; border: 1px solid rgba(0,194,255,0.3);'
          : 'background: rgba(37,99,235,0.12); color: #2563EB;'"
      >
        {{ userRole === 'company' ? '🏢 Onaylı Kurumsal Hesap' : '👤 Bireysel Üye' }}
      </span>
    </div>

    <!-- Yeni İhale Oluştur Butonu -->
    <div class="px-3 mb-3">
      <NuxtLink
        to="/panel/ihale-olustur"
        class="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white transition-all shadow-md"
        style="background: #003057; border: 1px solid rgba(255, 255, 255, 0.15);"
        onmouseover="this.style.background='#1EAE4C'"
        onmouseout="this.style.background='#003057'"
      >
        <Plus :size="14" />
        + Yeni İhale Aç
      </NuxtLink>
    </div>

    <!-- Navigasyon Menüsü -->
    <nav class="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
      <template v-for="item in sidebarMenus" :key="item.title">
        
        <!-- DROPDOWN ITEM (TEKLİFLERİM) -->
        <div v-if="item.isDropdown" class="space-y-1">
          <!-- Ana Başlık / Dropdown Butonu -->
          <button
            type="button"
            @click="isTekliflerOpen = !isTekliflerOpen"
            class="w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 group cursor-pointer"
            :class="(route.path === '/panel/gelen-teklifler' || route.path === '/panel/yaptigim-teklifler' || route.path === '/panel/tekliflerim')
              ? 'text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'"
            :style="(route.path === '/panel/gelen-teklifler' || route.path === '/panel/yaptigim-teklifler' || route.path === '/panel/tekliflerim')
              ? 'background: #003057; border: 1px solid rgba(255, 255, 255, 0.15);'
              : ''"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                :size="16"
                :style="(route.path === '/panel/gelen-teklifler' || route.path === '/panel/yaptigim-teklifler' || route.path === '/panel/tekliflerim') ? 'color: #1EAE4C;' : ''"
                class="shrink-0 transition-colors"
              />
              <span :style="(route.path === '/panel/gelen-teklifler' || route.path === '/panel/yaptigim-teklifler' || route.path === '/panel/tekliflerim') ? 'color: #1EAE4C;' : ''">
                {{ item.title }}
              </span>
            </div>
            <ChevronDown
              :size="14"
              class="transition-transform duration-200"
              :class="isTekliflerOpen ? 'rotate-180 text-[#1EAE4C]' : 'text-slate-400'"
            />
          </button>

          <!-- Alt Menü Öğeleri (Aldığım / Verdiğim Teklifler) -->
          <div v-show="isTekliflerOpen" class="pl-4 pr-1 py-1 space-y-1">
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all block"
              :class="activePath === child.to
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'"
              :style="activePath === child.to
                ? 'background: rgba(30,174,76,0.2); color: #1EAE4C; border: 1px solid rgba(30,174,76,0.3);'
                : ''"
            >
              <component
                :is="child.icon"
                :size="14"
                :style="activePath === child.to ? 'color: #1EAE4C;' : ''"
                class="shrink-0"
              />
              <span>{{ child.title }}</span>
              <ChevronRight
                v-if="activePath === child.to"
                :size="12"
                class="ml-auto"
                style="color: #1EAE4C;"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- STANDART TEKİL MENÜ ÖĞESİ -->
        <NuxtLink
          v-else
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all duration-150 group"
          :class="activePath === item.to
            ? 'text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'"
          :style="activePath === item.to
            ? 'background: rgba(30,174,76,0.15); color: #1EAE4C;'
            : ''"
        >
          <component
            :is="item.icon"
            :size="16"
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

      </template>
    </nav>

    <!-- Yardım Merkezi Butonu -->
    <div class="px-3 mb-2 border-t pt-2" style="border-color: rgba(255,255,255,0.08);">
      <NuxtLink
        to="/panel/yardim"
        class="flex items-center gap-3 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150"
        :class="activePath === '/panel/yardim' ? 'text-white' : 'text-slate-400 hover:text-white'"
        :style="activePath === '/panel/yardim' ? 'background: rgba(30,174,76,0.15); color: #1EAE4C;' : ''"
      >
        <HelpCircle :size="16" :style="activePath === '/panel/yardim' ? 'color: #1EAE4C;' : ''" />
        <span>Yardım & Destek</span>
      </NuxtLink>
    </div>

    <!-- Kullanıcı Bilgisi & Çıkış -->
    <div class="px-4 py-3.5 border-t" style="border-color: rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3 mb-2.5">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style="background: linear-gradient(135deg, #003057, #1EAE4C);"
        >
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-white truncate">{{ userName }}</div>
          <div class="text-[10px] truncate" style="color: #64748B;">{{ userCompany }}</div>
        </div>
      </div>
      <button
        @click="logout"
        class="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer"
        style="background: rgba(239,68,68,0.08); color: #EF4444; border: 1px solid rgba(239,68,68,0.2);"
        onmouseover="this.style.background='rgba(239,68,68,0.18)'"
        onmouseout="this.style.background='rgba(239,68,68,0.08)'"
      >
        <LogOut :size="13" />
        Çıkış Yap
      </button>
    </div>

  </aside>
</template>