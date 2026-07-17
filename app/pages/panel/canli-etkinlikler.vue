<script setup lang="ts">
import { ref } from 'vue'
import { Tv, Radio, Clock, Search, SlidersHorizontal, AlertCircle, Sparkles } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const activeTab = ref<'tumu' | 'canli' | 'yaklasan' | 'tamamlanan'>('tumu')
const filterType = ref<'tumu' | 'webinar' | 'egitim'>('tumu')
const searchQuery = ref('')
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800 flex items-center gap-2" style="color: #0F172A;">
          <Radio class="text-red-500 animate-pulse" :size="22" />
          Canlı Etkinlikler
        </h1>
        <p class="text-xs text-slate-500 mt-1">Filtrelenen: 0 etkinlik · 0 canlı yayın</p>
      </div>

      <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[9px] font-black uppercase text-blue-700 tracking-wider">
        <Sparkles :size="10" /> Kurumsal Paket Gerekli
      </span>
    </div>

    <!-- Metrics Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">TÜM ETKİNLİKLER</span>
          <span class="text-xl font-black text-slate-800 block mt-0.5">0</span>
        </div>
        <div class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Tv :size="15" /></div>
      </div>

      <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">CANLI YAYIN</span>
          <span class="text-xl font-black text-slate-800 block mt-0.5">0</span>
        </div>
        <div class="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><Radio :size="15" /></div>
      </div>

      <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">YAKLAŞAN</span>
          <span class="text-xl font-black text-slate-800 block mt-0.5">0</span>
        </div>
        <div class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Clock :size="15" /></div>
      </div>

      <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">TAMAMLANAN</span>
          <span class="text-xl font-black text-slate-800 block mt-0.5">0</span>
        </div>
        <div class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><CheckCircle2 :size="15" /></div>
      </div>
    </div>

    <!-- Filter and Search controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Type Switcher -->
      <div class="flex items-center gap-2 bg-white rounded-xl border p-1" style="border-color: #E2E8F0;">
        <button 
          v-for="type in [
            { id: 'tumu', label: 'Tümü' },
            { id: 'webinar', label: 'Webinar' },
            { id: 'egitim', label: 'Eğitim' }
          ]"
          :key="type.id"
          type="button"
          @click="filterType = type.id as any"
          class="rounded-lg px-4 py-2 text-xs font-bold transition"
          :class="filterType === type.id ? 'bg-slate-950 text-white shadow' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ type.label }}
        </button>
      </div>

      <!-- Search input -->
      <div class="relative flex-1 w-full max-w-xs">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Etkinlik ara..."
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

    </div>

    <!-- Empty State View -->
    <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4" style="border-color: #E2E8F0;">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Radio :size="20" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Aktif etkinlik bulunmuyor.</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Yeni bir etkinlik oluşturarak webinar, eğitim veya canlı yayın planlayabilirsiniz.
        </p>
      </div>
    </div>

  </div>
</template>
