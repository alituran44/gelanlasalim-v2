<script setup lang="ts">
import { computed } from "vue"
import { locale } from "~/composables/useLocale"

const activities = computed(() => {
  // Pure Turkish mode
  {
    return [
      {
        id: 1,
        title: "Yeni ihale oluşturuldu",
        description: "Dizüstü Bilgisayar Alımı",
        time: "5 dk önce",
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "Yeni teklif geldi",
        description: "ABC Teknoloji teklif verdi",
        time: "18 dk önce",
        color: "bg-[#1EAE4C]"
      },
      {
        id: 3,
        title: "İhale yayına alındı",
        description: "Ofis Mobilyaları",
        time: "1 saat önce",
        color: "bg-amber-500"
      },
      {
        id: 4,
        title: "Firma kaydı tamamlandı",
        description: "Mavi Yazılım Ltd.",
        time: "Bugün",
        color: "bg-purple-500"
      }
    ]
  }
})
</script>

<template>
  <div class="rounded-2xl bg-white border border-slate-200 shadow-xs">
    <div class="border-b border-slate-100 p-6">
      <h2 class="text-base font-black text-slate-800 tracking-tight">
        {{ 'Aktivite Akışı' }}
      </h2>
      <p class="text-xs font-medium text-slate-500 mt-0.5">
        {{ 'Son sistem hareketleri ve ihale takipleri' }}
      </p>
    </div>

    <div class="p-6 space-y-5">
      <div
        v-for="item in activities"
        :key="item.id"
        class="flex gap-4 items-start"
      >
        <div
          class="h-3 w-3 rounded-full mt-1 shrink-0"
          :class="item.color"
        ></div>
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-bold text-slate-800">{{ item.title }}</h3>
            <span class="text-[10px] font-medium text-slate-400">• {{ item.time }}</span>
          </div>
          <p class="text-xs text-slate-500 font-medium">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>