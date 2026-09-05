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
  Globe,
  ShieldCheck,
  Scale
} from "lucide-vue-next"
import { locale } from '~/composables/useLocale'

import { useUserSession } from '~/composables/useUserSession'

const route = useRoute()
const router = useRouter()

const { userSession, isCompanyMode, userName, companyName, toggleCompanyMode, logout: sessionLogout } = useUserSession()
const isTekliflerOpen = ref(true)

watchEffect(() => {
  if (route.path.includes('teklif')) {
    isTekliflerOpen.value = true
  }
})

const userInitial = computed(() => (userName.value || 'K').charAt(0).toUpperCase())

function logout() {
  sessionLogout()
  router.push('/')
}

function activateCompanyMode() {
  toggleCompanyMode(true)
  router.push('/panel/ayarlar?tab=sirket')
}

const sidebarMenus = computed(() => {
  const isComp = isCompanyMode.value
  if (locale.value === 'tr') {
    const list: any[] = [
      { title: "Genel Bakış", icon: LayoutDashboard, to: "/panel" },
      { title: "İhalelerim", icon: ClipboardList, to: "/panel/ilanlarim" },
      { title: "Gelen Teklifler", icon: Inbox, to: "/panel/gelen-teklifler" },
      { title: "Verdiğim Teklifler", icon: Send, to: "/panel/yaptigim-teklifler" },
      { title: "Escrow & Komisyon (%4)", icon: ShieldCheck, to: "/panel/siparis-teslimat", badge: "%4 Sabit" }
    ]
    if (isComp) {
      list.push({ title: "Üye Firmalar", icon: Building2, to: "/panel/firmalar" })
    }
    list.push(
      { title: "Mücbir Sebep & Fesih", icon: Scale, to: "/panel/mucbir-sebep" },
      { title: "Bildirimler", icon: Bell, to: "/panel/bildirimler" },
      { title: "Profil & Hesap", icon: Settings, to: "/panel/ayarlar?tab=kisisel" }
    )
    return list
  } else {
    const list: any[] = [
      { title: "Dashboard", icon: LayoutDashboard, to: "/panel" },
      { title: "My Tenders", icon: ClipboardList, to: "/panel/ilanlarim" },
      { title: "Received Bids", icon: Inbox, to: "/panel/gelen-teklifler" },
      { title: "Submitted Bids", icon: Send, to: "/panel/yaptigim-teklifler" },
      { title: "Escrow & Fee (4%)", icon: ShieldCheck, to: "/panel/siparis-teslimat", badge: "4% Flat" }
    ]
    if (isComp) {
      list.push({ title: "Verified Companies", icon: Building2, to: "/panel/firmalar" })
    }
    list.push(
      { title: "Force Majeure & Disputes", icon: Scale, to: "/panel/mucbir-sebep" },
      { title: "Notifications", icon: Bell, to: "/panel/bildirimler" },
      { title: "Account & Profile", icon: Settings, to: "/panel/ayarlar?tab=kisisel" }
    )
    return list
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

    <!-- Çalışma Modu Kartı (Kişisel / Bireysel vs Kurumsal Firma) -->
    <div class="px-4 py-3 mx-3 my-2 rounded-xl bg-white/5 border border-white/10 text-left">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Çalışma Modu
        </span>
        <span
          class="text-[10px] font-bold px-2 py-0.5 rounded-full"
          :class="isCompanyMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'"
        >
          {{ isCompanyMode ? '🏢 Firma' : '👤 Kişisel' }}
        </span>
      </div>

      <!-- Kişisel Modda iken Firma Modunu Aktif Et Butonu -->
      <div v-if="!isCompanyMode" class="space-y-1">
        <p class="text-[11px] text-slate-300 leading-tight">
          Bireysel / kişisel hesaptasınız.
        </p>
        <button
          type="button"
          @click="activateCompanyMode"
          class="w-full mt-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <Building2 :size="12" />
          <span>Firma Modunu Aktif Et</span>
        </button>
      </div>

      <!-- Firma Modunda iken Firma Bilgisi & Kişisel Moda Dön -->
      <div v-else class="space-y-1">
        <p class="text-[11px] text-emerald-300 font-bold truncate" :title="companyName">
          {{ companyName || 'Kurumsal Firma' }}
        </p>
        <div class="flex items-center justify-between gap-1 pt-1">
          <NuxtLink
            to="/panel/ayarlar?tab=sirket"
            class="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>Şirket Bilgileri</span>
          </NuxtLink>
          <button
            type="button"
            @click="toggleCompanyMode(false)"
            class="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Kişisel moda geç"
          >
            Kişisele Dön
          </button>
        </div>
      </div>
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
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono tracking-tight"
          >
            {{ item.badge }}
          </span>
          <ChevronRight
            v-else-if="activePath === item.to"
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
          <div class="text-[10px] truncate" style="color: #64748B;">{{ isCompanyMode ? (companyName || 'Kurumsal Hesap') : 'Kişisel Hesap' }}</div>
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