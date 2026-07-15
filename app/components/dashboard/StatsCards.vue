<script setup lang="ts">
import {
  FileText,
  Gavel,
  Users,
  TrendingUp
} from "lucide-vue-next"

const stats = [
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
</script>

<template>
  <section class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

    <div
      v-for="item in stats"
      :key="item.title"
      class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >

      <div class="flex items-center justify-between">

        <div>

          <p class="text-sm text-slate-500">
            {{ item.title }}
          </p>

          <h2 class="mt-3 text-3xl font-black text-slate-800">
            {{ item.value }}
          </h2>

          <div
            class="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
          >
            {{ item.change }}
          </div>

        </div>

        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          :class="item.color"
        >
          <component
            :is="item.icon"
            :size="30"
          />
        </div>

      </div>

    </div>

  </section>
</template>