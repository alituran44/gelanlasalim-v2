<script setup lang="ts">
import { ref } from "vue"
import AppButton from "~/components/ui/AppButton.vue"
import AppInput from "~/components/ui/AppInput.vue"

const keyword = ref("")
const category = ref("")
const city = ref("")

function search() {
  navigateTo({
    path: "/ihaleler",
    query: {
      q: keyword.value,
      category: category.value,
      city: city.value
    }
  })
}
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
    <div class="grid gap-4 lg:grid-cols-4">

      <AppInput
        v-model="keyword"
        placeholder="İhale adı veya anahtar kelime"
      />

      <select
        v-model="category"
        class="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
      >
        <option value="">Kategori</option>
        <option>İnşaat</option>
        <option>Yazılım</option>
        <option>Elektrik</option>
        <option>Makine</option>
        <option>Sağlık</option>
      </select>

      <select
        v-model="city"
        class="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
      >
        <option value="">Şehir</option>
        <option>İstanbul</option>
        <option>Ankara</option>
        <option>İzmir</option>
        <option>Bursa</option>
        <option>Çanakkale</option>
      </select>

      <AppButton
        block
        size="lg"
        @click="search"
      >
        🔍 İhale Ara
      </AppButton>

    </div>
  </div>
</template>