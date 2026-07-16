<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import {
  LayoutDashboard,
  FilePlus2,
  FolderKanban,
  BadgeDollarSign,
  Building2,
  MessageSquare,
  Bell,
  CreditCard,
  Settings,
  LogOut
} from "lucide-vue-next"

const route = useRoute()
const router = useRouter()

function logout() {
  localStorage.removeItem('userSession')
  router.push('/')
}

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/panel"
  },
  {
    title: "İhale Oluştur",
    icon: FilePlus2,
    to: "/ihale/yeni"
  },
  {
    title: "İhalelerim",
    icon: FolderKanban,
    to: "/ihalelerim"
  },
  {
    title: "Gelen Teklifler",
    icon: BadgeDollarSign,
    to: "/teklifler"
  },
  {
    title: "Firmalar",
    icon: Building2,
    to: "/firmalar"
  },
  {
    title: "Mesajlar",
    icon: MessageSquare,
    to: "/mesajlar"
  },
  {
    title: "Bildirimler",
    icon: Bell,
    to: "/bildirimler"
  },
  {
    title: "Abonelik",
    icon: CreditCard,
    to: "/abonelik"
  },
  {
    title: "Ayarlar",
    icon: Settings,
    to: "/ayarlar"
  },
  {
    title: "Entegrasyonlar",
    icon: Database,
    to: "/entegrasyonlar"
  }
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

    <!-- Logo -->

    <div class="border-b border-slate-800 p-6">

      <h1 class="text-2xl font-black tracking-wide">

        GelAnlaşalım

      </h1>

      <p class="mt-2 text-sm text-slate-400">

        İhale Platformu

      </p>

    </div>

    <!-- Menü -->

    <nav class="flex-1 p-4 space-y-2">

      <NuxtLink
        v-for="item in menus"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
        :class="activePath === item.to
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
      >

        <component
          :is="item.icon"
          :size="20"
        />

        <span>

          {{ item.title }}

        </span>

      </NuxtLink>

    </nav>

    <!-- Kullanıcı -->

    <div class="border-t border-slate-800 p-5">

      <div class="flex items-center gap-3">

        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold"
        >

          A

        </div>

        <div class="flex-1">

          <div class="font-semibold">

            Ali Turan

          </div>

          <div class="text-sm text-slate-400">

            Premium Firma

          </div>

        </div>

      </div>

      <button
        @click="logout"
        class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 transition hover:bg-red-600"
      >

        <LogOut :size="18" />

        Çıkış Yap

      </button>

    </div>

  </aside>
</template>