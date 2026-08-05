<script setup lang="ts">
import { computed } from "vue"
import { ArrowRight } from "lucide-vue-next"
import { locale } from "~/composables/useLocale"

const tenders = computed(() => {
  if (locale.value === 'en') {
    return [
      {
        id: 1,
        title: "Laptop Computer Procurement",
        company: "ABC Technology Inc.",
        budget: "$38,500",
        status: "Active",
        date: "15 July 2026"
      },
      {
        id: 2,
        title: "Office Furniture Supply Batch",
        company: "XYZ Holdings",
        budget: "$14,200",
        status: "Bids Expected",
        date: "14 July 2026"
      },
      {
        id: 3,
        title: "Enterprise Software Licenses",
        company: "BiHocam EdTech",
        budget: "$9,800",
        status: "Active",
        date: "13 July 2026"
      },
      {
        id: 4,
        title: "Rack Server Hardware Batch",
        company: "Delta IT Systems",
        budget: "$29,400",
        status: "Closed",
        date: "12 July 2026"
      },
      {
        id: 5,
        title: "CCTV Security Camera System",
        company: "Mavi Construction",
        budget: "$5,600",
        status: "Active",
        date: "11 July 2026"
      }
    ]
  } else {
    return [
      {
        id: 1,
        title: "Dizüstü Bilgisayar Alımı",
        company: "ABC Teknoloji A.Ş.",
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
    ]
  }
})

const statusClass = (status: string) => {
  switch (status) {
    case "Aktif":
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"

    case "Teklif Bekleniyor":
    case "Bids Expected":
      return "bg-amber-50 text-amber-700 border-amber-200"

    case "Kapandı":
    case "Closed":
      return "bg-slate-100 text-slate-600 border-slate-200"

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
          {{ locale === 'tr' ? 'Son İhaleler' : 'Recent Tenders' }}
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ locale === 'tr' ? 'En son yayınlanan B2B ihaleleri' : 'Latest published procurement tenders' }}
        </p>
      </div>

      <NuxtLink
        to="/panel/ilanlarim"
        class="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
      >
        <span>{{ locale === 'tr' ? 'Tümünü Gör' : 'View All' }}</span>
        <ArrowRight :size="14" />
      </NuxtLink>
    </div>

    <div class="divide-y divide-slate-100">
      <div
        v-for="item in tenders"
        :key="item.id"
        class="flex items-center justify-between p-4 transition hover:bg-slate-50/80"
      >
        <div class="space-y-1">
          <h3 class="text-xs font-bold text-slate-800">
            {{ item.title }}
          </h3>
          <p class="text-[11px] text-slate-400 font-medium">
            {{ item.company }} • {{ item.date }}
          </p>
        </div>

        <div class="flex items-center gap-4 text-right">
          <div>
            <div class="text-xs font-black font-mono text-slate-900">
              {{ item.budget }}
            </div>
            <span
              class="inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold mt-1"
              :class="statusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>