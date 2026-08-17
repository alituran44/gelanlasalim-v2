<script setup lang="ts">
import { computed } from "vue"
import {
  PlusCircle,
  FileText,
  Users,
  BarChart3
} from "lucide-vue-next"
import { locale } from "~/composables/useLocale"

const actions = computed(() => {
  // Pure Turkish mode
  {
    return [
      {
        title: "Yeni İhale",
        description: "Yeni ihale oluştur",
        icon: PlusCircle,
        color: "bg-blue-600",
        link: "/panel/ihale-olustur"
      },
      {
        title: "İhalelerim",
        description: "Tüm ihaleleri görüntüle",
        icon: FileText,
        color: "bg-emerald-600",
        link: "/panel/ilanlarim"
      },
      {
        title: "Firma Ayarları",
        description: "Firma profilini düzenle",
        icon: Users,
        color: "bg-amber-600",
        link: "/panel/ayarlar"
      },
      {
        title: "Entegrasyonlar",
        description: "ERP entegrasyonu",
        icon: BarChart3,
        color: "bg-purple-600",
        link: "/entegrasyonlar"
      }
    ]
  }
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
    <h2 class="text-base font-black text-slate-800 tracking-tight">
      {{ 'Hızlı İşlemler' }}
    </h2>
    <p class="mt-0.5 text-xs text-slate-500 font-medium">
      {{ 'En sık kullanılan satın alma araçları' }}
    </p>

    <div class="mt-5 grid gap-3">
      <NuxtLink
        v-for="action in actions"
        :key="action.title"
        :to="action.link"
        class="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-slate-200 hover:bg-slate-100/80 hover:shadow-xs group"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
          :class="action.color"
        >
          <component :is="action.icon" :size="18" />
        </div>

        <div>
          <h3 class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
            {{ action.title }}
          </h3>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">
            {{ action.description }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>