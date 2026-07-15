<script setup lang="ts">
import { ref } from "vue"

const activities = ref([
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
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "İhale yayına alındı",
    description: "Ofis Mobilyaları",
    time: "1 saat önce",
    color: "bg-orange-500"
  },
  {
    id: 4,
    title: "Firma kaydı tamamlandı",
    description: "Mavi Yazılım Ltd.",
    time: "Bugün",
    color: "bg-purple-500"
  }
])
</script>

<template>

<div class="rounded-2xl bg-white border border-slate-200 shadow-sm">

<div class="border-b border-slate-100 p-6">

<h2 class="text-xl font-bold">
Aktivite Akışı
</h2>

<p class="text-sm text-slate-500">
Son sistem hareketleri
</p>

</div>

<div class="p-6 space-y-6">

<div
v-for="item in activities"
:key="item.id"
class="flex gap-4"
>

<div
class="w-3 h-3 rounded-full mt-2"
:class="item.color"
/>

<div class="flex-1">

<div class="font-semibold">

{{ item.title }}

</div>

<div class="text-sm text-slate-500 mt-1">

{{ item.description }}

</div>

<div class="text-xs text-slate-400 mt-2">

{{ item.time }}

</div>

</div>

</div>

</div>

</div>

</template>