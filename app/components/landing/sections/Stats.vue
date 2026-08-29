<script setup lang="ts">
import { computed } from 'vue'
import { useCmsData } from '~/composables/useCmsData'

const { cmsData } = useCmsData()
const tenders = computed(() => cmsData.value?.dashboard?.tenders || [])
const bids = computed(() => cmsData.value?.dashboard?.receivedBids || [])

const stats = computed(() => [
  {
    value: "0+",
    title: "Kayıtlı Kurumsal Firma"
  },
  {
    value: `${tenders.value.length}`,
    title: "Aktif İhale"
  },
  {
    value: `${bids.value.length}`,
    title: "Teklif Hacmi"
  },
  {
    value: "%100",
    title: "Escrow Güvencesi"
  }
])
</script>

<template>
  <section class="py-12">
    <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">

      <div
        v-for="item in stats"
        :key="item.title"
        class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
      >
        <div class="text-3xl font-black text-blue-600">
          {{ item.value }}
        </div>

        <div class="mt-2 text-slate-500">
          {{ item.title }}
        </div>
      </div>

    </div>
  </section>
</template>