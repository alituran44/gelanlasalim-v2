<script setup lang="ts">
import { ref } from "vue"
import { ArrowRight } from "lucide-vue-next"

const tenders = ref([
  {
    id: 1,
    title: "Dizüstü Bilgisayar Alımı",
    company: "ABC Teknoloji",
    budget: "₺1.250.000",
    status: "Aktif",
    date: "15 Temmuz 2026"
  },
  {
    id: 2,
    title: "Ofis Mobilyası Alımı",
    company: "XYZ Holding",
    budget: "₺420.000",
    status: "Teklif Bekleniyor",
    date: "14 Temmuz 2026"
  },
  {
    id: 3,
    title: "Yazılım Lisansları",
    company: "BiHocam Eğitim",
    budget: "₺310.000",
    status: "Aktif",
    date: "13 Temmuz 2026"
  },
  {
    id: 4,
    title: "Sunucu Donanımı",
    company: "Delta Bilişim",
    budget: "₺980.000",
    status: "Kapandı",
    date: "12 Temmuz 2026"
  },
  {
    id: 5,
    title: "Güvenlik Kamera Sistemi",
    company: "Mavi Yapı",
    budget: "₺165.000",
    status: "Aktif",
    date: "11 Temmuz 2026"
  }
])

const statusClass = (status: string) => {
  switch (status) {
    case "Aktif":
      return "bg-green-100 text-green-700"

    case "Teklif Bekleniyor":
      return "bg-yellow-100 text-yellow-700"

    case "Kapandı":
      return "bg-red-100 text-red-700"

    default:
      return "bg-slate-100 text-slate-700"
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">

    <div class="flex items-center justify-between border-b border-slate-100 p-6">

      <div>

        <h2 class="text-xl font-bold text-slate-800">
          Son İhaleler
        </h2>

        <p class="text-sm text-slate-500">
          Son oluşturulan ihaleler
        </p>

      </div>

      <NuxtLink
        to="/ihalelerim"
        class="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Tümünü Gör

        <ArrowRight :size="16" />
      </NuxtLink>

    </div>

    <div>

      <div
        v-for="item in tenders"
        :key="item.id"
        class="flex items-center justify-between border-b border-slate-100 p-5 transition hover:bg-slate-50"
      >

        <div>

          <div class="font-semibold text-slate-800">
            {{ item.title }}
          </div>

          <div class="mt-1 text-sm text-slate-500">
            {{ item.company }}
          </div>

        </div>

        <div class="text-right">

          <div class="font-bold text-slate-800">
            {{ item.budget }}
          </div>

          <div class="mt-1 text-xs text-slate-400">
            {{ item.date }}
          </div>

        </div>

        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="statusClass(item.status)"
        >
          {{ item.status }}
        </span>

      </div>

    </div>

  </div>
</template>