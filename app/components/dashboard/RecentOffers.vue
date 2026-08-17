<script setup lang="ts">
import { computed } from "vue"
import { ArrowRight } from "lucide-vue-next"
import { locale } from "~/composables/useLocale"

const offers = computed(() => {
  // Pure Turkish mode
  {
    return [
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
    ]
  }
})

const badgeClass = (status: string) => {
  switch (status) {
    case "Yeni":
    case "New Bid":
      return "bg-blue-50 text-blue-700 border-blue-200"

    case "İnceleniyor":
    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200"

    case "Onaylandı":
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"

    case "Reddedildi":
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200"

    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white shadow-xs">
    <div class="flex items-center justify-between border-b border-slate-100 p-6">
      <div>
        <h2 class="text-base font-black text-slate-800 tracking-tight">
          {{ 'Gelen Teklifler' }}
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'İhalelerinize verilen son teklifler' }}
        </p>
      </div>

      <NuxtLink
        to="/panel/gelen-teklifler"
        class="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
      >
        <span>{{ 'Tümünü Gör' }}</span>
        <ArrowRight :size="14" />
      </NuxtLink>
    </div>

    <div class="divide-y divide-slate-100">
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="flex items-center justify-between p-4 transition hover:bg-slate-50/80"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-bold text-slate-800">
              {{ offer.company }}
            </h3>
            <span class="text-[10px] text-slate-400 font-medium">• {{ offer.date }}</span>
          </div>
          <p class="text-[11px] text-slate-500">
            {{ offer.tender }}
          </p>
        </div>

        <div class="flex items-center gap-3 text-right">
          <div>
            <div class="text-xs font-black font-mono text-slate-900">
              {{ offer.amount }}
            </div>
            <span
              class="inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold mt-1"
              :class="badgeClass(offer.status)"
            >
              {{ offer.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>