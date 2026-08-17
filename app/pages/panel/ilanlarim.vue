<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, RotateCw, Search, LayoutGrid, List, FileText, ChevronRight } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const { cmsData } = useCmsData()
const isLoading = ref(true)
const activeTab = ref<'aktif' | 'beklemede' | 'tamamlanan' | 'iptal'>('aktif')
const activePeriod = ref<'7gun' | '30gun' | '90gun' | '1yil'>('30gun')
const searchQuery = ref('')

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 600)
})

const tendersList = computed(() => {
  return cmsData.value.dashboard.tenders || []
})

const periods = computed(() => {
  if (locale.value === 'en') {
    return [
      { id: '7gun', label: 'Last 7 Days' },
      { id: '30gun', label: 'Last 30 Days' },
      { id: '90gun', label: 'Last 90 Days' },
      { id: '1yil', label: 'Last 1 Year' }
    ]
  } else {
    return [
      { id: '7gun', label: 'Son 7 Gün' },
      { id: '30gun', label: 'Son 30 Gün' },
      { id: '90gun', label: 'Son 90 Gün' },
      { id: '1yil', label: 'Son 1 Yıl' }
    ]
  }
})

const statusTabs = computed(() => {
  if (locale.value === 'en') {
    return [
      { id: 'aktif', label: 'Active', count: tendersList.value.length },
      { id: 'beklemede', label: 'Pending', count: 0 },
      { id: 'tamamlanan', label: 'Completed', count: 0 },
      { id: 'iptal', label: 'Cancelled', count: 0 }
    ]
  } else {
    return [
      { id: 'aktif', label: 'Aktif', count: tendersList.value.length },
      { id: 'beklemede', label: 'Beklemede', count: 0 },
      { id: 'tamamlanan', label: 'Tamamlanan', count: 0 },
      { id: 'iptal', label: 'İptal', count: 0 }
    ]
  }
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          {{ 'İhalelerim' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'Oluşturduğunuz ihaleleri durum, tarih ve teklif sürecine göre yönetin.' }}
        </p>
      </div>

      <NuxtLink 
        to="/panel/ihale-olustur"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
      >
        <Plus :size="14" />
        <span>{{ 'Yeni İhale' }}</span>
      </NuxtLink>
    </div>

    <!-- Date Period Tabs Bar -->
    <div class="flex items-center justify-between bg-white rounded-xl border p-2 shadow-xs" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-1.5 overflow-x-auto">
        <button 
          v-for="period in periods"
          :key="period.id"
          type="button"
          @click="activePeriod = period.id as any"
          class="rounded-lg px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer"
          :class="activePeriod === period.id ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ period.label }}
        </button>
      </div>

      <button 
        type="button" 
        @click="isLoading = true; setTimeout(() => isLoading = false, 500)"
        class="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
      >
        <RotateCw :size="14" />
      </button>
    </div>

    <!-- Status Tabs & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Status Buttons Grid -->
      <div class="flex items-center gap-1.5 bg-white rounded-xl border p-1 shadow-xs" style="border-color: #E2E8F0;">
        <button 
          v-for="tab in statusTabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id as any"
          class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer"
          :class="activeTab === tab.id 
            ? 'bg-blue-900 text-white shadow-xs' 
            : 'text-slate-500 hover:bg-slate-50'"
        >
          <span>{{ tab.label }}</span>
          <span 
            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search and View Switcher -->
      <div class="flex items-center gap-2 flex-1 md:max-w-md justify-end">
        <div class="relative flex-1 w-full">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text"
            :placeholder="'İhale adı, kategori veya şehir ile ara...'"
            class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500 font-medium"
            style="border-color: #E2E8F0; color: #0F172A;"
          />
        </div>
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

    <!-- DATA LIST -->
    <div v-else class="space-y-3">
      <div 
        v-for="tender in tendersList"
        :key="tender.id"
        class="rounded-2xl border bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <FileText :size="18" />
          </div>
          <div>
            <h3 class="font-bold text-sm text-slate-800">{{ tender.baslik }}</h3>
            <p class="text-xs text-slate-400 mt-0.5 font-medium">
              {{ 'İhale Kodu:' }} <strong class="font-mono text-slate-700">{{ tender.id }}</strong> • 
              {{ 'Kategori:' }} {{ tender.kategori }}
            </p>
            
            <div class="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
              <span class="rounded bg-slate-100 px-2 py-0.5 font-bold uppercase tracking-wider text-[8px] text-slate-700">{{ tender.olusturma }}</span>
              <span>{{ 'Bütçe:' }} {{ tender.butce }}</span>
              <span>{{ 'Süre:' }} {{ tender.sure }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 sm:justify-end">
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {{ tender.teklifSayisi }} {{ 'Teklif Alındı' }}
          </span>
          <NuxtLink :to="`/panel/gelen-teklifler?ilan=${tender.id}`" class="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition border" style="border-color: #E2E8F0;">
            <ChevronRight :size="14" />
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>
