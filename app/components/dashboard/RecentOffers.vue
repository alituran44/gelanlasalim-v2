<script setup lang="ts">
import { ref } from "vue"
import { ArrowRight } from "lucide-vue-next"

const offers = ref([
  {
    id: 1,
    company: "ABC Teknoloji A.Ş.",
    tender: "Dizüstü Bilgisayar Alımı",
    amount: "₺1.185.000",
    status: "Yeni",
    date: "5 dk önce"
  },
  {
    id: 2,
    company: "Delta Yazılım",
    tender: "ERP Yazılım Hizmeti",
    amount: "₺845.000",
    status: "İnceleniyor",
    date: "18 dk önce"
  },
  {
    id: 3,
    company: "Mavi Bilişim",
    tender: "Sunucu Alımı",
    amount: "₺965.000",
    status: "Onaylandı",
    date: "1 saat önce"
  },
  {
    id: 4,
    company: "Tekno Market",
    tender: "Yazıcı ve Sarf Malzeme",
    amount: "₺214.000",
    status: "Yeni",
    date: "Bugün"
  },
  {
    id: 5,
    company: "Nova Teknoloji",
    tender: "IP Kamera Sistemi",
    amount: "₺382.000",
    status: "Reddedildi",
    date: "Dün"
  }
])

const badgeClass = (status: string) => {
  switch (status) {
    case "Yeni":
      return "bg-blue-100 text-blue-700"

    case "İnceleniyor":
      return "bg-yellow-100 text-yellow-700"

    case "Onaylandı":
      return "bg-green-100 text-green-700"

    case "Reddedildi":
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
          Gelen Teklifler
        </h2>

        <p class="text-sm text-slate-500">
          Son gelen teklifler
        </p>

      </div>

      <NuxtLink
        to="/teklifler"
        class="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Tümünü Gör

        <ArrowRight :size="16" />

      </NuxtLink>

    </div>

    <div>

      <div
        v-for="offer in offers"
        :key="offer.id"
        class="flex items-center justify-between border-b border-slate-100 p-5 transition hover:bg-slate-50"
      >

        <div>

          <div class="font-semibold text-slate-800">
            {{ offer.company }}
          </div>

          <div class="mt-1 text-sm text-slate-500">
            {{ offer.tender }}
          </div>

        </div>

        <div class="text-right">

          <div class="font-bold text-slate-800">
            {{ offer.amount }}
          </div>

          <div class="mt-1 text-xs text-slate-400">
            {{ offer.date }}
          </div>

        </div>

        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="badgeClass(offer.status)"
        >
          {{ offer.status }}
        </span>

      </div>

    </div>

  </div>
</template>