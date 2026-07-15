<script setup lang="ts">
import { ref } from "vue"

const notifications = ref([
  {
    id: 1,
    title: "3 yeni teklif geldi",
    type: "Bilgi",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Aboneliğiniz 5 gün sonra bitecek",
    type: "Uyarı",
    color: "bg-orange-500"
  },
  {
    id: 3,
    title: "Yeni firma sizi takip etti",
    type: "Sistem",
    color: "bg-green-500"
  },
  {
    id: 4,
    title: "Yeni sürüm yayınlandı",
    type: "Güncelleme",
    color: "bg-purple-500"
  }
])
</script>

<template>

<div class="rounded-2xl bg-white border border-slate-200 shadow-sm">

<div class="border-b border-slate-100 p-6">

<h2 class="text-xl font-bold">
Bildirim Merkezi
</h2>

<p class="text-sm text-slate-500">
Son bildirimler
</p>

</div>

<div class="divide-y divide-slate-100">

<div
v-for="item in notifications"
:key="item.id"
class="flex items-center justify-between p-5 hover:bg-slate-50 transition"
>

<div class="flex items-center gap-4">

<div
class="w-3 h-3 rounded-full"
:class="item.color"
/>

<div>

<div class="font-semibold">

{{ item.title }}

</div>

<div class="text-xs text-slate-400">

{{ item.type }}

</div>

</div>

</div>

<button
class="text-blue-600 text-sm font-semibold hover:text-blue-700"
>

Görüntüle

</button>

</div>

</div>

</div>

</template>