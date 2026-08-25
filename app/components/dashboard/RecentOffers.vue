<script setup lang="ts">
import { computed } from "vue"
import { ArrowRight } from "lucide-vue-next"
import { useCmsData } from "~/composables/useCmsData"

const { cmsData } = useCmsData()

const offers = computed(() => {
  const list: any[] = []
  const received = cmsData.value?.dashboard?.receivedBids || []
  for (const item of received) {
    for (const t of (item.teklifler || [])) {
      list.push({
        id: t.id,
        company: t.firma,
        tender: item.baslik,
        amount: t.fiyat,
        status: t.durum === 'onaylandi' ? 'Onaylandı' : 'İnceleniyor',
        date: t.sure || 'Yeni'
      })
    }
  }
  return list.slice(0, 5)
})

const badgeClass = (status: string) => {
  switch (status) {
    case "Onaylandı":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "İnceleniyor":
      return "bg-amber-50 text-amber-700 border-amber-200"
    default:
      return "bg-blue-50 text-blue-700 border-blue-200"
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white shadow-xs">
    <div class="flex items-center justify-between border-b border-slate-100 p-6">
      <div>
        <h2 class="text-base font-black text-slate-800 tracking-tight">
          Gelen Teklifler
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          İhalelerinize verilen son teklifler
        </p>
      </div>

      <NuxtLink
        to="/panel/gelen-teklifler"
        class="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
      >
        <span>Tümünü Gör</span>
        <ArrowRight :size="14" />
      </NuxtLink>
    </div>

    <div v-if="offers.length > 0" class="divide-y divide-slate-100">
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

    <div v-else class="p-8 text-center space-y-2">
      <p class="text-xs text-slate-400 font-medium">Henüz gelen teklif bulunmuyor.</p>
      <NuxtLink to="/panel/pazar-yeri" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
        Pazar Yerini İncele ↗
      </NuxtLink>
    </div>
  </div>
</template>