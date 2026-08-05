<script setup lang="ts">
import AppButton from "~/components/ui/AppButton.vue"

const menu = [
  {
    title: "İhaleler",
    to: "/pazar-yeri"
  },
  {
    title: "Firmalar",
    to: "/panel/firmalar"
  },
  {
    title: "Nasıl Çalışır",
    to: "/#how"
  },
  {
    title: "Abonelik Paketleri",
    to: "/abonelik"
  },
  {
    title: "Sözleşmeler & Bilgi",
    to: "/sozlesmeler"
  }
]
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur"
  >
    <div
      class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white"
        >
          G
        </div>

        <div>
          <div class="text-xl font-black text-slate-800">
            GelAnlaşalım
          </div>

          <div class="text-xs text-slate-500">
            Dijital İhale Platformu
          </div>
        </div>
      </NuxtLink>

      <!-- Menü -->
      <nav class="hidden items-center gap-8 lg:flex">
        <NuxtLink
          v-for="item in menu"
          :key="item.title"
          :to="item.to"
          class="font-medium text-slate-600 transition hover:text-blue-600"
        >
          {{ item.title }}
        </NuxtLink>
      </nav>

      <!-- Sağ -->
      <div class="flex items-center gap-3">
        <NuxtLink to="/login">
          <AppButton variant="secondary">
            Giriş Yap
          </AppButton>
        </NuxtLink>

        <NuxtLink to="/register">
          <AppButton>
            Hemen Başla
          </AppButton>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>