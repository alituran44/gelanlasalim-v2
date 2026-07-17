<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, SlidersHorizontal, Download, LayoutGrid, List, MapPin, Building2, User } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const searchQuery = ref('')
const selectedCity = ref('Balıkesir')

const firms = [
  { name: 'Ali Turan', city: 'Çanakkale', district: 'Merkez', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'AT' },
  { name: 'yavuz uyanık', city: 'İstanbul', district: 'Beylikdüzü', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'YU' },
  { name: 'İSTFA GLOBAL TEDARİK YAPI BİLİŞİM DIŞ TİCARET LİMİTED ŞİRKETİ', city: 'İstanbul', district: 'Başakşehir', status: 'Doğrulanmış', sector: 'Hizmet', initial: 'İŞ', isBig: true },
  { name: 'KADİR AK', city: 'İstanbul', district: 'Başakşehir', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'KA' },
  { name: 'osman karada', city: 'İstanbul', district: 'Ataşehir', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'OK' },
  { name: 'SMT RULMAN', city: 'İstanbul', district: 'Ümraniye', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'SR' },
  { name: 'Musa Mert Çördük', city: 'Konya', district: 'Selçuklu', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'MÇ' },
  { name: 'Zeynep Özdemir', city: 'İstanbul', district: 'Sancaktepe', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'ZÖ' },
  { name: 'YUSUF HAMARAT', city: 'İstanbul', district: 'Sultanbeyli', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'YH' },
  { name: 'Ferdi Yılmaz', city: 'İzmir', district: 'Karabağlar', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'FY' },
  { name: 'Furkan Şahin', city: 'Kocaeli', district: 'İzmit', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'FŞ' },
  { name: 'Makks Villas A.Ş.', city: 'İstanbul', district: 'Pendik', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'MA' }
]
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Kurumsal Firmalar</h1>
        <p class="text-xs text-slate-500 mt-1">Tedarikçi ve firma ağınızı konum, sektör ve doğrulama durumuna göre yönetin. <span class="text-slate-400">Toplam: 99 - Doğrulanmış: 10 - Ortalama puan: --</span></p>
      </div>

      <button 
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
      >
        <Plus :size="14" />
        Tedarikçi davet et
      </button>
    </div>

    <!-- Map Dropdown Bar -->
    <div class="flex items-center bg-white border p-3 rounded-xl gap-3" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-2 text-slate-400 shrink-0">
        <MapPin :size="15" />
        <span class="text-xs font-bold text-slate-500">Firma konumları:</span>
      </div>
      
      <select 
        v-model="selectedCity"
        class="rounded-lg border px-3 py-1.5 text-xs bg-white outline-none font-bold text-slate-700 max-w-xs"
        style="border-color: #E2E8F0;"
      >
        <option value="Balıkesir">Balıkesir (1 firma)</option>
        <option value="İstanbul">İstanbul (82 firma)</option>
        <option value="Çanakkale">Çanakkale (4 firma)</option>
        <option value="İzmir">İzmir (3 firma)</option>
      </select>
    </div>

    <!-- Search and Filters Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 w-full max-w-md">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Firma adı, vergi no veya e-posta ile ara..."
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto justify-end">
        <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <SlidersHorizontal :size="13" />
          Detaylı filtre
        </button>
        
        <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <Download :size="13" />
          Dışa aktar
        </button>

        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <List :size="14" />
        </button>
        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-400 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <LayoutGrid :size="14" />
        </button>
      </div>
    </div>

    <!-- Corporate Directory Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(firm, idx) in firms" 
        :key="idx"
        class="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between min-h-[190px]"
        style="border-color: #E2E8F0;"
      >
        <!-- Top header tags -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex gap-1.5">
            <span class="text-[8px] font-black uppercase rounded bg-slate-100 text-slate-500 px-1.5 py-0.5">
              {{ firm.status }}
            </span>
            <span class="text-[8px] font-black uppercase rounded bg-slate-100 text-slate-500 px-1.5 py-0.5">
              {{ firm.sector }}
            </span>
          </div>
        </div>

        <!-- Corporate Branding banner overlay if BIG firm -->
        <div v-if="firm.isBig" class="absolute top-0 left-0 right-0 h-16 bg-slate-900 rounded-t-2xl flex items-center justify-center p-3 overflow-hidden select-none z-0">
          <span class="text-[10px] text-white/20 font-black tracking-widest">KURUMSAL TEDARİKÇİ</span>
        </div>

        <!-- Corporate Avatar & Name -->
        <div class="flex items-start gap-3 mt-4 relative z-10">
          <div 
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black text-slate-700 bg-slate-100 border"
            :style="firm.isBig ? 'background: #FFFFFF; border-color: #E2E8F0; margin-top: 8px;' : ''"
          >
            {{ firm.initial }}
          </div>
          <div class="min-w-0" :style="firm.isBig ? 'margin-top: 8px;' : ''">
            <h4 class="text-xs font-black text-slate-800 leading-snug truncate" :title="firm.name">{{ firm.name }}</h4>
            <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin :size="9" /> {{ firm.district }}, {{ firm.city }}</p>
          </div>
        </div>

        <!-- Metrics block -->
        <div class="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold mt-4">
          <div>
            <span class="block text-[7px] text-slate-300">KATILDIĞI İHALE</span>
            <span class="text-slate-600 font-mono">0</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">TAMAMLANAN</span>
            <span class="text-slate-600 font-mono">0</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">BAŞARI ORANI</span>
            <span class="text-slate-600">--</span>
          </div>
        </div>

        <!-- Footer link -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-50 mt-3 text-[10px] font-bold text-slate-400">
          <span>Üye: Tem 2026</span>
          <button class="text-blue-600 hover:underline">Detayları görüntüle ↗</button>
        </div>

      </div>
    </div>

    <!-- Pagination controls -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style="border-color: #F1F5F9;">
      <span class="text-xs font-bold text-slate-400">1-12 / 99 sonuç</span>
      
      <div class="flex items-center gap-1 text-xs font-bold text-slate-500">
        <button type="button" class="px-2 py-1 rounded hover:bg-slate-100">Önceki</button>
        <button type="button" class="h-6 w-6 rounded bg-slate-950 text-white flex items-center justify-center font-mono">1</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">2</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">3</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">4</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">5</button>
        <span class="px-1 text-slate-300">...</span>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">9</button>
        <button type="button" class="px-2 py-1 rounded hover:bg-slate-100">Sonraki</button>
      </div>
    </div>

  </div>
</template>
