<script setup lang="ts">
import { ref } from 'vue'
import { 
  TrendingUp, 
  RotateCw, 
  Download, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  Activity, 
  AlertCircle 
} from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const activeSorgu = ref<'ihale' | 'tedarikci'>('ihale')
const activePeriod = ref<'30gun' | '7gun' | '90gun' | '1yil'>('30gun')
const kiyasToggle = ref(true)
const userName = ref('Ali Turan')
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">OPERASYON VE FİNANS GÖRÜNÜMÜ</span>
        <h1 class="text-2xl font-black text-slate-800 mt-1" style="color: #0F172A;">İstatistikler</h1>
        <p class="text-xs text-slate-500 mt-0.5">Hoş geldiniz, {{ userName }}!</p>
      </div>

      <!-- Quick Info Badges -->
      <div class="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div>
          <span class="block text-[8px] text-slate-300">30 GÜN</span>
          <span class="text-slate-700">17 Haz - 17 Tem</span>
        </div>
        <div class="h-6 w-px bg-slate-200"></div>
        <div>
          <span class="block text-[8px] text-slate-300">ÖNCEKİ DÖNEMLE KIYAS</span>
          <span class="text-slate-700">Değişim --</span>
        </div>
        <div class="h-6 w-px bg-slate-200"></div>
        <div>
          <span class="block text-[8px] text-slate-300">SON GÜNCELLEME</span>
          <span class="text-slate-700 font-mono text-[9px]">17 Tem 23:34</span>
        </div>
      </div>
    </div>

    <!-- Toggle Buttons Row -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-xl border p-3" style="border-color: #E2E8F0;">
      <div class="flex flex-wrap items-center gap-3">
        <!-- İhale/Tedarikçi Switch -->
        <div class="flex rounded-lg bg-slate-100 p-1">
          <button 
            type="button"
            @click="activeSorgu = 'ihale'"
            class="rounded px-3 py-1.5 text-xs font-bold transition"
            :class="activeSorgu === 'ihale' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'"
          >
            İHALE
          </button>
          <button 
            type="button"
            @click="activeSorgu = 'tedarikci'"
            class="rounded px-3 py-1.5 text-xs font-bold transition"
            :class="activeSorgu === 'tedarikci' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'"
          >
            TEDARİKÇİ
          </button>
        </div>

        <!-- Period Selection -->
        <div class="flex rounded-lg bg-slate-100 p-1">
          <button 
            v-for="p in [
              { id: '7gun', label: '7 GÜN' },
              { id: '30gun', label: '30 GÜN' },
              { id: '90gun', label: '90 GÜN' },
              { id: '1yil', label: '1 YIL' }
            ]"
            :key="p.id"
            type="button"
            @click="activePeriod = p.id as any"
            class="rounded px-3 py-1.5 text-[10px] font-bold transition"
            :class="activePeriod === p.id ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Kıyaslama Switch + Eylemler -->
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">ÖNCEKİ DÖNEMLE KIYAS</span>
          <button 
            type="button" 
            @click="kiyasToggle = !kiyasToggle"
            class="relative h-5 w-9 rounded-full transition-all"
            :style="kiyasToggle ? 'background: #1E3A5F;' : 'background: #CBD5E1;'"
          >
            <span 
              class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
              :style="kiyasToggle ? 'left: 1.25rem;' : 'left: 0.125rem;'"
            ></span>
          </button>
        </label>

        <button type="button" class="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 border transition" style="border-color: #E2E8F0;">
          <RotateCw :size="14" />
        </button>

        <button type="button" class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <Download :size="13" />
          CSV İndir
        </button>
      </div>
    </div>

    <!-- AI İçgörü Asistanı -->
    <div class="rounded-xl border bg-white p-5 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-center" style="border-color: #E2E8F0;">
      <div class="lg:col-span-2 space-y-2">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[9px] font-black uppercase text-blue-700 tracking-widest">
          <Sparkles :size="10" /> Operasyonel içgörü asistanı
        </div>
        <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1">
          <TrendingUp :size="14" class="text-blue-600" />
          Satın alma tasarrufu özeti
        </h4>
        <p class="text-[11px] text-slate-500 leading-normal">
          Seçili dönemde görünür tasarruf <strong>₺0,00</strong>. Önceki dönem değişimi karşılaştırma yok.
        </p>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl border flex flex-col justify-between h-full space-y-3" style="border-color: #F1F5F9;">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">ÖNERİLEN AKSİYON</span>
        <p class="text-[10px] text-slate-600 leading-relaxed">Tasarruf üretmek için ihale kriterlerini ve teklif kurallarını yeni talepler için referans alın.</p>
        <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1 text-[10px] font-black text-white bg-slate-900 rounded-lg px-3 py-2.5 hover:bg-slate-800 transition shadow justify-center">
          İHALELERİ AÇ →
        </NuxtLink>
      </div>
    </div>

    <!-- 4 Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Card 1: Harcama -->
      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-2 relative" style="border-color: #E2E8F0;">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">HARCAMA</span>
        <h3 class="text-2xl font-black text-slate-800">₺0,00</h3>
        <span class="text-[9px] text-slate-400 font-bold block">ÖNCEKİ DÖNEMLE KIYAS</span>
        <div class="absolute top-4 right-4 text-slate-100 flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
          <PieChart :size="16" class="text-slate-400" />
        </div>
      </div>

      <!-- Card 2: Tasarruf -->
      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-2 relative" style="border-color: #E2E8F0;">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">TASARRUF</span>
        <h3 class="text-2xl font-black text-slate-800">₺0,00</h3>
        <span class="text-[9px] text-slate-400 font-bold block">ÖNCEKİ DÖNEMLE KIYAS</span>
        <div class="absolute top-4 right-4 text-slate-100 flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
          <TrendingUp :size="16" class="text-slate-400" />
        </div>
      </div>

      <!-- Card 3: Tamamlanan -->
      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-2 relative" style="border-color: #E2E8F0;">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">TAMAMLANAN</span>
        <h3 class="text-2xl font-black text-slate-800">0,00</h3>
        <span class="text-[9px] text-slate-400 font-bold block">ÖNCEKİ DÖNEMLE KIYAS</span>
        <div class="absolute top-4 right-4 text-slate-100 flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
          <CheckCircle2 :size="16" class="text-slate-400" />
        </div>
      </div>

      <!-- Card 4: Teklif Aktivitesi -->
      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-2 relative" style="border-color: #E2E8F0;">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">TEKLİF AKTİVİTESİ</span>
        <h3 class="text-2xl font-black text-slate-800">0,00</h3>
        <span class="text-[9px] text-slate-400 font-bold block">ÖNCEKİ DÖNEMLE KIYAS</span>
        <div class="absolute top-4 right-4 text-slate-100 flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
          <Activity :size="16" class="text-slate-400" />
        </div>
      </div>

    </div>

    <!-- Empty Graphs Grid (Screenshot 3 style) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Graph Card 1: Harcama Büyümesi -->
      <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
          <h4 class="text-xs font-bold text-slate-800">Harcama Büyümesi</h4>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">30 Gün · Dönemsel Karşılaştırma</span>
        </div>
        <div class="h-48 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 rounded-xl border border-dashed" style="border-color: #E2E8F0;">
          <div class="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><BarChart3 :size="16" /></div>
          <div>
            <h5 class="text-xs font-bold text-slate-700">Veri bulunamadı</h5>
            <p class="text-[10px] text-slate-400 mt-0.5">Seçili dönemde veri bulunmuyor.</p>
          </div>
        </div>
      </div>

      <!-- Graph Card 2: Harcama Dağılımı -->
      <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
          <h4 class="text-xs font-bold text-slate-800">Harcama Dağılımı</h4>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Toplam: ₺0,00</span>
        </div>
        <div class="h-48 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 rounded-xl border border-dashed" style="border-color: #E2E8F0;">
          <div class="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><PieChart :size="16" /></div>
          <div>
            <h5 class="text-xs font-bold text-slate-700">Veri bulunamadı</h5>
            <p class="text-[10px] text-slate-400 mt-0.5">Seçili dönemde harcama verisi bulunmuyor.</p>
          </div>
        </div>
      </div>

      <!-- Graph Card 3: İhale Hacmi -->
      <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
          <h4 class="text-xs font-bold text-slate-800">İhale Hacmi</h4>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">0,00</span>
        </div>
        <div class="h-48 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 rounded-xl border border-dashed" style="border-color: #E2E8F0;">
          <div class="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><BarChart3 :size="16" /></div>
          <div>
            <h5 class="text-xs font-bold text-slate-700">Veri bulunamadı</h5>
            <p class="text-[10px] text-slate-400 mt-0.5">Seçili dönemde veri bulunmuyor.</p>
          </div>
        </div>
      </div>

      <!-- Graph Card 4: Son İhaleler -->
      <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
          <h4 class="text-xs font-bold text-slate-800">Son İhaleler</h4>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Veri bulunamadı</span>
        </div>
        <div class="h-48 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 rounded-xl border border-dashed" style="border-color: #E2E8F0;">
          <div class="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><AlertCircle :size="16" /></div>
          <div>
            <h5 class="text-xs font-bold text-slate-700">Veri bulunamadı</h5>
            <p class="text-[10px] text-slate-400 mt-0.5">Seçili dönemde veri bulunmuyor.</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
