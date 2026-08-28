<script setup lang="ts">
import { computed } from "vue"
import { ArrowRight, FileText } from "lucide-vue-next"
import { useCmsData } from "~/composables/useCmsData"

const { cmsData } = useCmsData()

const tenders = computed(() => {
  return (cmsData.value?.dashboard?.tenders || []).slice(0, 5).map((t: any, idx: number) => ({
    id: t.id || idx,
    title: t.baslik,
    company: t.companyName || t.firma || `${t.city || 'Kurumsal'} Alıcı`,
    budget: t.butce || 'Açık İhale',
    status: t.durum === 'closed' ? 'Kapandı' : 'Aktif',
    date: t.olusturma || 'Bugün'
  }))
})

const statusClass = (status: string) => {
  switch (status) {
    case "Aktif":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Kapandı":
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
          Son İhaleler
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          En son yayınlanan kurumsal B2B satın alma ihaleleri
        </p>
      </div>

      <NuxtLink
        to="/panel/ilanlarim"
        class="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
      >
        <span>Tümünü Gör</span>
        <ArrowRight :size="14" />
      </NuxtLink>
    </div>

    <div v-if="tenders.length > 0" class="divide-y divide-slate-100">
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

    <div v-else class="p-8 text-center space-y-2">
      <p class="text-xs text-slate-400 font-medium">Henüz yayında ihale bulunmuyor.</p>
      <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
        + İlk İhaleyi Aç
      </NuxtLink>
    </div>
  </div>
</template>