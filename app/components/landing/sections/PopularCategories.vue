<script setup lang="ts">
import { computed } from 'vue'
import { useCmsData } from '~/composables/useCmsData'

const { cmsData } = useCmsData()
const tenders = computed(() => cmsData.value?.dashboard?.tenders || [])

const rawCategories = [
  { name: "İnşaat", icon: "🏗️" },
  { name: "Yazılım", icon: "💻" },
  { name: "Elektrik", icon: "⚡" },
  { name: "Makine", icon: "⚙️" },
  { name: "Sağlık", icon: "🏥" },
  { name: "Lojistik", icon: "🚛" },
  { name: "Eğitim", icon: "🎓" },
  { name: "Güvenlik", icon: "🛡️" }
]

const categories = computed(() => {
  return rawCategories.map(cat => ({
    ...cat,
    count: tenders.value.filter(t => (t.kategori || '').toLowerCase().includes(cat.name.toLowerCase()) || (t.baslik || '').toLowerCase().includes(cat.name.toLowerCase())).length
  }))
})
</script>

<template>
  <section class="py-20">
    <div class="mx-auto max-w-7xl px-6">

      <div class="mb-12 text-center">
        <h2 class="text-4xl font-black text-slate-900">
          Popüler İhale Kategorileri
        </h2>

        <p class="mt-4 text-slate-500">
          İlgilendiğiniz sektörü seçin ve ihaleleri inceleyin.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <NuxtLink
          v-for="category in categories"
          :key="category.name"
          to="/ihaleler"
          class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
        >

          <div class="text-5xl">
            {{ category.icon }}
          </div>

          <h3 class="mt-5 text-xl font-bold text-slate-800">
            {{ category.name }}
          </h3>

          <p class="mt-2 text-slate-500">
            {{ category.count }} aktif ihale
          </p>

        </NuxtLink>

      </div>

    </div>
  </section>
</template>