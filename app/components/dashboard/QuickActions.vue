<script setup lang="ts">
import {
  PlusCircle,
  FileText,
  Users,
  BarChart3
} from "lucide-vue-next"

const actions = [
  {
    title: "Yeni İhale",
    description: "Yeni ihale oluştur",
    icon: PlusCircle,
    color: "bg-blue-500",
    link: "/ihale/yeni"
  },
  {
    title: "İhalelerim",
    description: "Tüm ihaleleri görüntüle",
    icon: FileText,
    color: "bg-emerald-500",
    link: "/ihalelerim"
  },
  {
    title: "Firmalar",
    description: "Firma listesini aç",
    icon: Users,
    color: "bg-orange-500",
    link: "/firmalar"
  },
  {
    title: "Raporlar",
    description: "İstatistikleri görüntüle",
    icon: BarChart3,
    color: "bg-purple-500",
    link: "/raporlar"
  }
]
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 class="text-xl font-bold text-slate-800">
      Hızlı İşlemler
    </h2>

    <p class="mt-1 text-sm text-slate-500">
      En sık kullanılan işlemler
    </p>

    <div class="mt-6 space-y-4">

      <NuxtLink
        v-for="item in actions"
        :key="item.title"
        :to="item.link"
        class="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-blue-50"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl text-white"
          :class="item.color"
        >
          <component
            :is="item.icon"
            :size="22"
          />
        </div>

        <div class="flex-1">

          <div class="font-semibold text-slate-800">
            {{ item.title }}
          </div>

          <div class="text-sm text-slate-500">
            {{ item.description }}
          </div>

        </div>

      </NuxtLink>

    </div>

  </div>
</template>