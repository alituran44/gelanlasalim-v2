<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from "~/components/layout/Sidebar.vue"
import Topbar from "~/components/layout/Topbar.vue"
import FloatingSupportWidget from "~/components/common/FloatingSupportWidget.vue"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Send,
  Package,
  Tv,
  BarChart3,
  Coins,
  Building2,
  Users,
  Settings,
  ArrowLeft,
  ChevronDown,
  Inbox
} from "lucide-vue-next"

import { locale, detectLocale } from '~/composables/useLocale'

const router = useRouter()
const route = useRoute()
const isTopTekliflerOpen = ref(false)

onMounted(() => {
  detectLocale()
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('userSession')
    if (!raw || raw === 'null' || raw === 'undefined' || raw === '{}') {
      router.push('/uyelik')
    }
  }
})

const sidebarMenus = computed(() => {
  if (locale.value === 'tr') {
    return [
      { title: "Panel", icon: LayoutDashboard, to: "/panel" },
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
      { title: "Hesap", icon: Settings, to: "/panel/ayarlar" },
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
      { title: "Orders & Delivery", icon: Package, to: "/panel/siparis-teslimat" },
      { title: "Live Auctions", icon: Tv, to: "/panel/canli-etkinlikler" },
      { title: "Analytics", icon: BarChart3, to: "/panel/istatistikler" },
      { title: "Exchange Rates", icon: Coins, to: "/panel/doviz-kurlari" },
      { title: "Verified Companies", icon: Building2, to: "/panel/firmalar" },
      { title: "Team & Permissions", icon: Users, to: "/panel/ekip-yetki" },
      { title: "Account & Settings", icon: Settings, to: "/panel/ayarlar" },
    ]
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    <!-- Left Sidebar (Collapsible/Hidden on mobile if needed, but sticky on desktop) -->
    <Sidebar class="hidden md:flex" />

    <div class="flex min-h-screen flex-1 flex-col overflow-hidden">
      <!-- Topbar Header -->
      <Topbar />

      <!-- Horizontal Navigation Bar (Menus at the top, scrollable on small screens) -->
      <div class="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-4 scrollbar-none shrink-0 shadow-sm">
        <div class="flex items-center gap-1 shrink-0">
          <template v-for="item in sidebarMenus" :key="item.title">
            
            <!-- Top Nav Dropdown (Tekliflerim) -->
            <div v-if="item.isDropdown" class="relative">
              <button
                type="button"
                @click="isTopTekliflerOpen = !isTopTekliflerOpen"
                class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all border border-transparent cursor-pointer"
                :class="(route.path === '/panel/gelen-teklifler' || route.path === '/panel/yaptigim-teklifler' || route.path === '/panel/tekliflerim') 
                  ? 'bg-[#1EAE4C]/10 text-[#1EAE4C] border-[#1EAE4C]/25' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <component :is="item.icon" :size="13" />
                <span>{{ item.title }}</span>
                <ChevronDown :size="12" class="transition-transform duration-200" :class="isTopTekliflerOpen ? 'rotate-180 text-[#1EAE4C]' : 'text-slate-400'" />
              </button>

              <div 
                v-if="isTopTekliflerOpen" 
                class="absolute left-0 mt-1.5 w-56 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-xl z-50 animate-fadeIn space-y-0.5"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  @click="isTopTekliflerOpen = false"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  :class="route.path === child.to ? 'bg-[#1EAE4C]/10 text-[#1EAE4C]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'"
                >
                  <component :is="child.icon" :size="13" :class="route.path === child.to ? 'text-[#1EAE4C]' : 'text-slate-400'" />
                  <span>{{ child.title }}</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Standard Top Nav Link -->
            <NuxtLink
              v-else
              :to="item.to"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all border border-transparent"
              :class="route.path === item.to 
                ? 'bg-[#1EAE4C]/10 text-[#1EAE4C] border-[#1EAE4C]/25' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <component :is="item.icon" :size="13" />
              <span>{{ item.title }}</span>
            </NuxtLink>

          </template>
        </div>
        
        <!-- Go to Homepage Link -->
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shrink-0 uppercase tracking-wider"
        >
          <ArrowLeft :size="13" />
          {{ 'Ana Sayfaya Git' }}
        </NuxtLink>
      </div>

      <!-- Main Layout Body -->
      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Floating Support Widget (WhatsApp & AI Bot) -->
    <FloatingSupportWidget />
  </div>
</template>

<style scoped>
/* Hide scrollbars for chrome, safari and opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbars for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>