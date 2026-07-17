<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, RotateCw, Search, LayoutGrid, List, Send, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const isLoading = ref(true)
const activeTab = ref<'aktif' | 'beklemede' | 'kazanilan' | 'kaybedilen'>('aktif')
const activePeriod = ref<'30gun' | '7gun' | '90gun' | '1yil'>('30gun')
const searchQuery = ref('')
const orderBy = ref('En yeni')

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Tekliflerim</h1>
        <p class="text-xs text-slate-500 mt-1">Toplam 0 teklifiniz var. Teklif hacmi: <strong>₺0</strong>. Son güncelleme: 17 Temmuz 23:34</p>
      </div>

      <NuxtLink 
        to="/panel/pazar-yeri"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
      >
        <Plus :size="14" />
        Yeni teklif ver
      </NuxtLink>
    </div>

    <!-- Date Period Tabs Bar -->
    <div class="flex items-center justify-between bg-white rounded-xl border p-2" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-1.5">
        <button 
          v-for="period in [
            { id: '7gun', label: '7 Gün' },
            { id: '30gun', label: '30 Gün' },
            { id: '90gun', label: '90 Gün' },
            { id: '1yil', label: '1 Yıl' }
          ]"
          :key="period.id"
          type="button"
          @click="activePeriod = period.id as any"
          class="rounded-lg px-4 py-2 text-xs font-bold transition"
          :class="activePeriod === period.id ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ period.label }}
        </button>
      </div>

      <button 
        type="button" 
        @click="isLoading = true; setTimeout(() => isLoading = false, 800)"
        class="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
      >
        <RotateCw :size="14" />
      </button>
    </div>

    <!-- Status Tabs & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Status Buttons Grid -->
      <div class="flex items-center gap-2 bg-white rounded-xl border p-1" style="border-color: #E2E8F0;">
        <button 
          v-for="tab in [
            { id: 'aktif', label: 'Aktif', count: 0 },
            { id: 'beklemede', label: 'Beklemede', count: 0 },
            { id: 'kazanilan', label: 'Kazanılan', count: 0 },
            { id: 'kaybedilen', label: 'Kaybedilen', count: 0 }
          ]"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id as any"
          class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition"
          :class="activeTab === tab.id 
            ? 'bg-slate-950 text-white shadow' 
            : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ tab.label }}
          <span 
            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search, view switcher and order -->
      <div class="flex flex-wrap items-center gap-2 flex-1 md:max-w-2xl justify-end">
        <div class="relative flex-1 w-full max-w-xs">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="İhale adı, firma, kategori veya teklif durumu ile ara..."
            class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500"
            style="border-color: #E2E8F0; color: #0F172A;"
          />
        </div>
        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <List :size="14" />
        </button>
        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-400 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <LayoutGrid :size="14" />
        </button>
        
        <select 
          v-model="orderBy"
          class="rounded-xl border px-3 py-2.5 text-xs bg-white outline-none font-bold text-slate-700"
          style="border-color: #E2E8F0;"
        >
          <option value="En yeni">Sırala: En yeni</option>
          <option value="En eski">Sırala: En eski</option>
          <option value="En yüksek teklif">Sırala: En yüksek</option>
          <option value="En düşük teklif">Sırala: En düşük</option>
        </select>
      </div>

    </div>

    <!-- SKELETON LOADER -->
    <div v-if="isLoading" class="space-y-3">
      <div 
        v-for="i in 4" 
        :key="i"
        class="h-20 w-full rounded-xl border bg-white animate-pulse flex items-center justify-between px-6"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-center gap-4 w-2/3">
          <div class="h-10 w-10 bg-slate-100 rounded-lg shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            <div class="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
        </div>
        <div class="h-4 bg-slate-200 rounded w-24"></div>
      </div>
    </div>

    <!-- EMPTY STATE VIEW (Screenshot 2 style) -->
    <div v-else class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4" style="border-color: #E2E8F0;">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Send :size="20" class="rotate-45" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Henüz teklif vermediniz.</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Pazaryerindeki açık ihaleleri inceleyerek ilk teklifinizi oluşturabilirsiniz.
        </p>
      </div>
      <NuxtLink 
        to="/panel/pazar-yeri"
        class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 shadow transition"
      >
        Pazaryeri'ne git
        <ArrowRight :size="13" />
      </NuxtLink>
    </div>

  </div>
</template>
