<script setup lang="ts">
const stats = [
  {
    value: "12.000+",
    title: "Firma"
  },
  {
    value: "48.000+",
    title: "Aktif İhale"
  },
  {
    value: "1.250.000+",
    title: "Teklif"
  },
  {
    value: "97%",
    title: "Memnuniyet"
  }
]
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