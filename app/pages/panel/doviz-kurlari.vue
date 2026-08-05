<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCw, Coins, ArrowRight, DollarSign, Calculator } from 'lucide-vue-next'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const isRefreshing = ref(false)
const inputAmount = ref(1000)
const fromCurrency = ref('EUR')
const toCurrency = ref('TRY')

const rates: Record<string, number> = {
  USD: 47.0282,
  EUR: 53.7951,
  GBP: 63.2446,
  TRY: 1
}

const convertedResult = computed(() => {
  const amount = Number(inputAmount.value) || 0
  const fromRate = rates[fromCurrency.value] || 1
  const toRate = rates[toCurrency.value] || 1
  
  // Convert from source to TRY, then to target
  const amountInTry = amount * fromRate
  const finalAmount = amountInTry / toRate
  
  return new Intl.NumberFormat(locale.value === 'tr' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalAmount)
})

function triggerRefresh() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 800)
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">
          {{ locale === 'tr' ? 'KAYNAK: TCMB (DÖVİZ) - GOLD API (EMTİA)' : 'SOURCE: CENTRAL BANK (FX) - GOLD API (COMMODITIES)' }}
        </span>
        <h1 class="text-xl font-black text-slate-800 mt-1 tracking-tight" style="color: #0F172A;">
          {{ locale === 'tr' ? 'Kur ve Emtia Panosu' : 'Exchange Rates & Commodities Board' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ locale === 'tr' 
            ? 'Toplam 5 enstrüman izleniyor. Bu veriler ihale fiyatlandırması ve satın alma analizi için referans amaçlıdır.' 
            : '5 market instruments tracked. Provided for procurement benchmark and FX pricing calculation.' 
          }}
        </p>
      </div>

      <!-- Quick Info Badges -->
      <div class="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div>
          <span class="block text-[8px] text-slate-400 font-medium">{{ locale === 'tr' ? 'DÖVİZ KURLARI' : 'FOREX RATES' }}</span>
          <span class="text-slate-700">3 {{ locale === 'tr' ? 'TCMB resmi' : 'Central Bank' }}</span>
        </div>
        <div class="h-6 w-px bg-slate-200"></div>
        <div>
          <span class="block text-[8px] text-slate-400 font-medium">{{ locale === 'tr' ? 'DEĞERLİ METALLER' : 'PRECIOUS METALS' }}</span>
          <span class="text-slate-700">2 Gold API</span>
        </div>
        <div class="h-6 w-px bg-slate-200"></div>
        <div>
          <span class="block text-[8px] text-slate-400 font-medium">{{ locale === 'tr' ? 'SON GÜNCELLEME' : 'LAST UPDATE' }}</span>
          <span class="text-slate-700 font-mono text-[9px]">{{ locale === 'tr' ? 'Canlı kurlar' : 'Live rates' }}</span>
        </div>
      </div>
    </div>

    <!-- Actions & Info -->
    <div class="flex justify-between items-center bg-white border p-3 rounded-xl shadow-xs" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-xs font-bold text-slate-700">{{ locale === 'tr' ? 'Referans Kurlar Aktif' : 'Reference Rates Active' }}</span>
      </div>

      <button 
        type="button" 
        @click="triggerRefresh"
        class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer" 
        style="border-color: #E2E8F0;"
      >
        <RotateCw :size="13" :class="isRefreshing ? 'animate-spin' : ''" />
        {{ locale === 'tr' ? 'Yenile' : 'Refresh' }}
      </button>
    </div>

    <!-- Alert bar -->
    <div class="rounded-xl border bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style="border-color: #E2E8F0;">
      <div class="flex items-start gap-3">
        <div class="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
          <Calculator :size="15" />
        </div>
        <div>
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">SATIN ALMA AKIŞI</span>
          <h4 class="text-xs font-bold text-slate-800 mt-0.5">Kur incelemesinden ihale fiyatlandırmasına geçin</h4>
          <p class="text-[10px] text-slate-500 mt-1">Bu panodaki referansları ihale fiyatlaması, kur riski notları ve tedarikçi karşılaştırmaları hazırlarken kullanın.</p>
        </div>
      </div>
      <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow transition">
        İhale oluştur
        <ArrowRight :size="13" />
      </NuxtLink>
    </div>

    <!-- Main Converter + Rates Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Converter -->
      <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center gap-2 border-b pb-2" style="border-color: #F1F5F9;">
          <Calculator :size="15" class="text-blue-600" />
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">TCMB RESMİ KURLARI · Döviz Dönüştürücü</h3>
        </div>

        <div class="space-y-4">
          <!-- Miktar -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Miktar</label>
            <input 
              v-model="inputAmount"
              type="number"
              class="w-full rounded-xl border px-4 py-3 text-xs outline-none focus:border-blue-500 transition font-mono"
              style="border-color: #E2E8F0; color: #0F172A;"
            />
            <p class="text-[9px] text-slate-400 mt-1">Virgül veya nokta ile ondalık değer girebilirsiniz.</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Kaynak -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Kaynak</label>
              <select v-model="fromCurrency" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                <option value="EUR">€ EUR - Euro</option>
                <option value="USD">$ USD - Dolar</option>
                <option value="GBP">£ GBP - Sterlin</option>
                <option value="TRY">₺ TRY - Türk Lirası</option>
              </select>
            </div>

            <!-- Hedef -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Hedef</label>
              <select v-model="toCurrency" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                <option value="TRY">₺ TRY - Türk Lirası</option>
                <option value="USD">$ USD - Dolar</option>
                <option value="EUR">€ EUR - Euro</option>
                <option value="GBP">£ GBP - Sterlin</option>
              </select>
            </div>
          </div>

          <!-- Result -->
          <div class="pt-4 border-t" style="border-color: #F1F5F9;">
            <div class="p-4 rounded-xl bg-slate-50 border flex flex-col justify-between" style="border-color: #F1F5F9;">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider">TUTAR</span>
              <span class="text-xs font-bold text-slate-500 mt-1">{{ fromCurrency }} {{ inputAmount }} =</span>
              <span class="text-xl font-black text-slate-800 font-mono mt-1">{{ toCurrency }} {{ convertedResult }}</span>
            </div>
            <p class="text-[8px] text-slate-400 mt-2">Kaynak: TCMB - Kaynak zamanı: 23:34</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Rates Cards & Commodity Cards -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Döviz Kurları (03) Grid -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">DÖVİZ KURLARI (03) <span class="text-[9px] text-blue-600 font-bold ml-1">TCMB RESMİ</span></h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <!-- USD/TRY -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-slate-700">USD/TRY</span>
                </div>
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">DÖVİZ</span>
              </div>
              <div>
                <span class="text-[9px] font-bold text-slate-400 block">SATIŞ</span>
                <span class="text-lg font-black text-slate-800 font-mono">₺47,0705</span>
              </div>
              <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-50 text-[9px] text-slate-400 font-bold">
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ</span>
                  <span class="font-mono text-slate-600">46,9858</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ORTA KUR</span>
                  <span class="font-mono text-slate-600">47,0282</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ-SATIŞ</span>
                  <span class="font-mono text-slate-600">0,0847</span>
                </div>
              </div>
              <span class="block text-[8px] text-slate-300 pt-1">KAYNAK: TCMB · Kaynak zamanı: 23:34</span>
            </div>

            <!-- EUR/TRY -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-slate-700">EUR/TRY</span>
                </div>
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">DÖVİZ</span>
              </div>
              <div>
                <span class="text-[9px] font-bold text-slate-400 block">SATIŞ</span>
                <span class="text-lg font-black text-slate-800 font-mono">₺53,8435</span>
              </div>
              <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-50 text-[9px] text-slate-400 font-bold">
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ</span>
                  <span class="font-mono text-slate-600">53,7467</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ORTA KUR</span>
                  <span class="font-mono text-slate-600">53,7951</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ-SATIŞ</span>
                  <span class="font-mono text-slate-600">0,0968</span>
                </div>
              </div>
              <span class="block text-[8px] text-slate-300 pt-1">KAYNAK: TCMB · Kaynak zamanı: 23:34</span>
            </div>

            <!-- GBP/TRY -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-slate-700">GBP/TRY</span>
                </div>
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">DÖVİZ</span>
              </div>
              <div>
                <span class="text-[9px] font-bold text-slate-400 block">SATIŞ</span>
                <span class="text-lg font-black text-slate-800 font-mono">₺63,4090</span>
              </div>
              <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-50 text-[9px] text-slate-400 font-bold">
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ</span>
                  <span class="font-mono text-slate-600">63,0802</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ORTA KUR</span>
                  <span class="font-mono text-slate-600">63,2446</span>
                </div>
                <div>
                  <span class="block text-[8px] text-slate-300">ALIŞ-SATIŞ</span>
                  <span class="font-mono text-slate-600">0,3288</span>
                </div>
              </div>
              <span class="block text-[8px] text-slate-300 pt-1">KAYNAK: TCMB · Kaynak zamanı: 23:34</span>
            </div>

          </div>
        </div>

        <!-- Değerli Metaller (02) Grid -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">DEĞERLİ METALLER (02) <span class="text-[9px] text-blue-600 font-bold ml-1">GOLD API - SPOT</span></h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Altın -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-slate-700">Altın · XAU</span>
                </div>
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">EMTİA</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 block">TL / GRAM</span>
                  <span class="text-lg font-black text-slate-800 font-mono">₺6.069,45</span>
                </div>
                <div>
                  <span class="text-[9px] font-bold text-slate-400 block">USD / ONS</span>
                  <span class="text-base font-black text-slate-700 font-mono">$4.018,60</span>
                </div>
              </div>
              <span class="block text-[8px] text-slate-300 pt-1">KAYNAK: GOLD API · Kaynak zamanı: 23:27</span>
            </div>

            <!-- Gümüş -->
            <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black text-slate-700">Gümüş · XAG</span>
                </div>
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">EMTİA</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 block">TL / GRAM</span>
                  <span class="text-lg font-black text-slate-800 font-mono">₺84,86</span>
                </div>
                <div>
                  <span class="text-[9px] font-bold text-slate-400 block">USD / ONS</span>
                  <span class="text-base font-black text-slate-700 font-mono">$56,07</span>
                </div>
              </div>
              <span class="block text-[8px] text-slate-300 pt-1">KAYNAK: GOLD API · Kaynak zamanı: 23:27</span>
            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>
