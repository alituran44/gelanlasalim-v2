<script setup lang="ts">
import { ref } from 'vue'
import { Search, SlidersHorizontal, LayoutGrid, Heart } from 'lucide-vue-next'

definePageMeta({
  layout: "public"
})

const activeSegment = ref<1 | 2 | 3>(1)
const searchQuery = ref('')

const segments = [
  { id: 1, title: 'Ürün & Hizmet', desc: 'Operasyonel ihtiyaçlarınız için malzeme ve profesyonel hizmet ihaleleri.', badge: 'GÜNCEL' },
  { id: 2, title: 'Üretim & İmalat', desc: 'Fason üretim, özel imalat ve teknik şartnameye dayalı üretim ihaleleri.', badge: '' },
  { id: 3, title: 'Proje Bazlı', desc: 'Alt yüklenici değerlendirmesi ve proje fazları bazında toplu satın almalar.', badge: '' }
]
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6 py-12">
    
    <!-- Başlık ve Filtre Segmentleri -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800" style="color: #0F172A;">İhale Pazarı & Pazar Yeri</h1>
      <p class="text-xs text-slate-500 mt-1">Canlı B2B ihaleleri ve tedarik fırsatları</p>
    </div>

    <!-- Segment Seçiciler -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button 
        v-for="seg in segments" 
        :key="seg.id"
        type="button"
        @click="activeSegment = seg.id as 1 | 2 | 3"
        class="rounded-xl border p-5 text-left transition relative overflow-hidden"
        :class="activeSegment === seg.id 
          ? 'border-blue-600 bg-blue-50/10' 
          : 'border-slate-200 bg-white hover:bg-slate-50'"
      >
        <span class="text-xs font-black text-slate-700 flex items-center gap-2">
          {{ seg.title }}
          <span v-if="seg.badge" class="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black">{{ seg.badge }}</span>
        </span>
        <p class="text-[10px] text-slate-400 mt-1 leading-normal">{{ seg.desc }}</p>
        <span class="absolute bottom-2 right-4 text-3xl font-bold text-slate-100/50 select-none">0{{ seg.id }}</span>
      </button>
    </div>

    <!-- Arama ve Eylemler Barı -->
    <div class="flex flex-col sm:flex-row items-center gap-3">
      <div class="relative flex-1 w-full">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          aria-label="İhale veya anahtar kelime arama"
          placeholder="İhale adı, açıklama veya anahtar kelime ile ara..."
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500 min-h-[44px]"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <SlidersHorizontal :size="13" />
          Filtreler
        </button>
        <button type="button" class="flex items-center justify-center rounded-xl border p-2.5 text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;" aria-label="Görünüm Değiştir">
          <LayoutGrid :size="14" />
        </button>
      </div>
    </div>

    <!-- Boş Durum Kartı / Üyelik Çağrısı -->
    <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4 shadow-sm" style="border-color: #E2E8F0;">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Search :size="20" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Tüm İhaleleri İncelemek ve Teklif Vermek İçin Üye Olun</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Kurumsal hesabınızı dakikalar içinde oluşturarak doğrudan canlı eksiltme arenalarına katılabilirsiniz.
        </p>
      </div>
      <NuxtLink 
        to="/uyelik"
        class="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
      >
        Kurumsal Üyelik Oluştur
      </NuxtLink>
    </div>

  </div>
</template>
