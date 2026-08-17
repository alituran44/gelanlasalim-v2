<script setup lang="ts">
import { computed } from "vue"
import {
  FileText,
  Gavel,
  Users,
  TrendingUp
} from "lucide-vue-next"
import { locale } from "~/composables/useLocale"

const stats = computed(() => {
  // Pure Turkish mode
  {
    return [
      {
        title: "Toplam İhale",
        value: "148",
        change: "+12%",
        color: "bg-blue-500",
        icon: FileText
      },
      {
        title: "Aktif İhale",
        value: "23",
        change: "+4",
        color: "bg-emerald-500",
        icon: Gavel
      },
      {
        title: "Gelen Teklif",
        value: "324",
        change: "+28",
        color: "bg-orange-500",
        icon: Users
      },
      {
        title: "Tamamlanan",
        value: "96",
        change: "+18%",
        color: "bg-purple-500",
        icon: TrendingUp
      }
    ]
  }
})
</script>

<template>
  <section class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="item in stats"
      :key="item.title"
      class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {{ item.title }}
          </p>

          <h2 class="mt-2 text-3xl font-black text-slate-800 font-mono">
            {{ item.value }}
          </h2>

          <div class="mt-2 flex items-center gap-2">
            <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              {{ item.change }}
            </span>
            <span class="text-[10px] font-medium text-slate-400">
              {{ 'geçen aya göre' }}
            </span>
          </div>
        </div>

        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
          :class="item.color"
        >
          <component :is="item.icon" :size="22" />
        </div>
      </div>
    </div>
  </section>
</template>