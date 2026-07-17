<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Package, Truck, CheckCircle2, Search, SlidersHorizontal, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const isLoading = ref(true)

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
        <h1 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Sipariş & Teslimat</h1>
        <p class="text-xs text-slate-500 mt-1">Tedarik süreçlerinizin sözleşme, sevkiyat ve kabul durumunu izleyin.</p>
      </div>
    </div>

    <!-- Search and filter -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 w-full max-w-md">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder="Sipariş no, fatura no veya tedarikçi adı ile ara..."
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

      <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition self-end" style="border-color: #E2E8F0;">
        <SlidersHorizontal :size="13" />
        Filtreler
      </button>
    </div>

    <!-- SKELETON LOADER (Screenshot 4 style) -->
    <div v-if="isLoading" class="space-y-4">
      <div 
        v-for="i in 5" 
        :key="i"
        class="rounded-xl border bg-white p-5 animate-pulse flex flex-col gap-3"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-center justify-between">
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
          <div class="h-4 bg-slate-200 rounded w-16"></div>
        </div>
        <div class="h-3 bg-slate-100 rounded w-2/3"></div>
        <div class="h-3 bg-slate-50 rounded w-1/2"></div>
      </div>
    </div>

    <!-- EMPTY STATE VIEW -->
    <div v-else class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4" style="border-color: #E2E8F0;">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Package :size="20" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Aktif sipariş bulunamadı</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Henüz sonuçlanmış bir ihale veya oluşturulmuş bir sevkiyat/teslimat kaydınız bulunmuyor.
        </p>
      </div>
    </div>

  </div>
</template>
