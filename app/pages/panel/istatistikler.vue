<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  TrendingUp, 
  RotateCw, 
  Download, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  Activity, 
  AlertCircle,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  Filter,
  ShieldAlert,
  ArrowDownRight,
  ExternalLink,
  BookOpen
} from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const activeTab = ref<'ozet' | 'funnel' | 'iptal' | 'risk' | 'sozluk'>('ozet')
const activePeriod = ref<'7gun' | '30gun' | '90gun' | '1yil'>('30gun')
const isLoading = ref(false)
const isExporting = ref(false)

const kpiReport = ref<any>(null)
const userSession = ref<any>({})

async function fetchKpis() {
  isLoading.value = true
  try {
    const res: any = await $fetch(`/api/admin/reports/kpi?period=${activePeriod.value}`)
    if (res?.success && res.report) {
      kpiReport.value = res.report
    }
  } catch (e) {
    console.warn('KPI fetch error:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }
  fetchKpis()
})

watch(activePeriod, () => {
  fetchKpis()
})

const userName = computed(() => userSession.value?.name || userSession.value?.firstName || 'Hasan Hüseyin Yıldırım')

async function exportSensitiveReport(type: 'kpi' | 'tenders' | 'bids') {
  if (isExporting.value) return
  isExporting.value = true

  try {
    const email = userSession.value?.email || 'ihalecib@gmail.com'
    const res: any = await $fetch('/api/admin/reports/export', {
      method: 'POST',
      body: {
        reportType: type,
        period: activePeriod.value,
        userEmail: email
      }
    })

    if (res?.success && res.csvContent) {
      const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', res.fileName || 'IhaleciBurada_Rapor.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert(`🛡️ HASSAS VERİ DIŞA AKTARILDI (Kural REP-013)\n\n${res.message}\nAktarılan Kayıt: ${res.recordCount}\nAktaran: ${email}`)
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Dışa aktarma işlemi sırasında bir hata oluştu.')
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5 border-slate-100">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-mono font-black uppercase">
            MODÜL 7 · REP-001 – REP-014
          </span>
          <span class="text-xs font-bold text-slate-500">
            Hasan Hüseyin Yıldırım (İhaleciBurada) · VKN: 9560161511
          </span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <BarChart3 class="text-blue-600" :size="26" />
          <span>Raporlama, KPI & Likidite Analitiği</span>
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Silikon Vadisi standartlarında çift taraflı B2B pazar yeri likidite göstergeleri ve şeffaf satınalma metrikleri
        </p>
      </div>

      <!-- Actions & Period -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Period Selector -->
        <div class="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button 
            v-for="p in [
              { id: '7gun', label: '7 Gün' },
              { id: '30gun', label: '30 Gün' },
              { id: '90gun', label: '90 Gün' },
              { id: '1yil', label: '1 Yıl' }
            ]"
            :key="p.id"
            type="button"
            @click="activePeriod = p.id as any"
            class="rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer"
            :class="activePeriod === p.id ? 'bg-[#0F223D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ p.label }}
          </button>
        </div>

        <button 
          type="button" 
          @click="fetchKpis" 
          class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-2xs"
          title="Verileri Yenile"
        >
          <RotateCw :size="15" :class="isLoading ? 'animate-spin' : ''" />
        </button>

        <!-- 🛡️ REP-013: Hassas Veri Export Butonu -->
        <button 
          type="button"
          @click="exportSensitiveReport('kpi')"
          :disabled="isExporting"
          class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          title="Kural REP-013: Güvenlik denetim izine kayıtlı CSV dışa aktarımı"
        >
          <Download :size="14" />
          <span>{{ isExporting ? 'Aktarılıyor...' : 'Audit Loglu CSV İndir (REP-013)' }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-black">
      <button 
        @click="activeTab = 'ozet'"
        class="px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        :class="activeTab === 'ozet' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        <Activity :size="14" />
        <span>Likidite & Network Özeti (REP-001 - 006)</span>
      </button>

      <button 
        @click="activeTab = 'funnel'"
        class="px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        :class="activeTab === 'funnel' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        <Filter :size="14" />
        <span>Funnel & Tasarruf (REP-008 - 011)</span>
      </button>

      <button 
        @click="activeTab = 'iptal'"
        class="px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        :class="activeTab === 'iptal' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        <AlertCircle :size="14" />
        <span>Reason Code Dağılımı (REP-007)</span>
      </button>

      <button 
        @click="activeTab = 'risk'"
        class="px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        :class="activeTab === 'risk' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        <ShieldAlert :size="14" />
        <span>Risk & Manipülasyon (REP-012)</span>
      </button>

      <button 
        @click="activeTab = 'sozluk'"
        class="px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
        :class="activeTab === 'sozluk' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        <BookOpen :size="14" />
        <span>Resmî KPI Sözlüğü (REP-014)</span>
      </button>
    </div>

    <!-- TAB 1: GENEL ÖZET & LİKİDİTE (REP-001 – REP-006) -->
    <div v-if="activeTab === 'ozet' && kpiReport" class="space-y-6">
      
      <!-- 6 Ana KPI Kartları Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <!-- Kart 1: REP-001 (Kayıtlı vs Doğrulanmış vs Aktif) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-black">
              KURAL REP-001
            </span>
            <Building2 class="text-blue-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Firma Havuzu Kalitesi</h3>
            <div class="text-2xl font-mono font-black text-slate-900 mt-1">
              {{ kpiReport.companies.totalActive }} <span class="text-xs text-emerald-600 font-sans font-bold">Aktif Firma</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500">Doğrulanmış: <strong>{{ kpiReport.companies.totalVerified }}</strong></span>
            <span class="text-slate-500">Toplam Kayıtlı: <strong>{{ kpiReport.companies.totalRegistered }}</strong></span>
            <span class="font-bold text-blue-700">%{{ kpiReport.companies.verificationRate }} Onay</span>
          </div>
        </div>

        <!-- Kart 2: REP-002 (Aktif Alıcı vs Aktif Satıcı) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-black">
              KURAL REP-002
            </span>
            <Users class="text-emerald-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Arz & Talep Dengesi</h3>
            <div class="text-2xl font-mono font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{{ kpiReport.actors.activeBuyers }} <small class="text-xs font-bold text-blue-600">Alıcı</small></span>
              <span class="text-slate-300">/</span>
              <span>{{ kpiReport.actors.activeSellers }} <small class="text-xs font-bold text-emerald-600">Satıcı</small></span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Satıcı/Alıcı Oranı:</span>
            <span class="font-mono font-black text-slate-800">{{ kpiReport.actors.buyerSellerRatio }}x Sağlıklı Likidite</span>
          </div>
        </div>

        <!-- Kart 3: REP-003 (Teklif Olayı vs Benzersiz Teklifçi) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-mono font-black">
              KURAL REP-003
            </span>
            <Layers class="text-purple-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Teklif Olayı vs Teklifçi Ayrımı</h3>
            <div class="text-2xl font-mono font-black text-slate-900 mt-1">
              {{ kpiReport.biddingActivity.totalBidEvents }} <span class="text-xs text-purple-600 font-sans font-bold">Teklif Olayı</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Benzersiz Firma: <strong>{{ kpiReport.biddingActivity.uniqueBiddingCompanies }}</strong></span>
            <span class="text-slate-500">Ort. Revizyon: <strong>{{ kpiReport.biddingActivity.eventsPerBidderRatio }}x</strong></span>
          </div>
        </div>

        <!-- Kart 4: REP-004 & REP-005 (İhale Başına Teklifçi & Alma Oranı) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-mono font-black">
              KURAL REP-004 & 005
            </span>
            <Activity class="text-amber-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Likidite & Karşılık Bulma</h3>
            <div class="text-2xl font-mono font-black text-slate-900 mt-1">
              {{ kpiReport.liquidity.uniqueBiddersPerTender }} <span class="text-xs text-slate-500 font-sans font-bold">Teklifçi / İhale</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Teklif Alma Oranı:</span>
            <span class="font-mono font-black text-emerald-700">%{{ kpiReport.liquidity.bidReceiptRate }} Başarı</span>
          </div>
        </div>

        <!-- Kart 5: REP-006 (İlk Teklif Süresi) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono font-black">
              KURAL REP-006
            </span>
            <Clock class="text-slate-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">İlk Geçerli Teklif Süresi</h3>
            <div class="text-2xl font-mono font-black text-slate-900 mt-1">
              {{ kpiReport.liquidity.avgFirstBidHours }} <span class="text-xs text-slate-500 font-sans font-bold">Saat Ortalama</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Tedarikçi Reaksiyonu:</span>
            <span class="font-bold text-emerald-700">Yüksek Hızlı Yanıt</span>
          </div>
        </div>

        <!-- Kart 6: REP-008 (Repeat Buyer Rate) -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[10px] font-mono font-black">
              KURAL REP-008
            </span>
            <CheckCircle2 class="text-indigo-600" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tekrar İhale Açan Alıcı</h3>
            <div class="text-2xl font-mono font-black text-indigo-700 mt-1">
              %{{ kpiReport.repeatBuyerRate }} <span class="text-xs text-slate-500 font-sans font-bold">Repeat Rate</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Product-Market Fit:</span>
            <span class="font-bold text-indigo-800">Yüksek Sadakat & Memnuniyet</span>
          </div>
        </div>

      </div>

      <!-- Bilgilendirme Kutusu: PRD Bölüm 10 Prensibi -->
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
        <ShieldCheck :size="18" class="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 class="font-bold text-slate-900 text-xs">Silikon Vadisi Standartlarında Şeffaf Analitik Disiplini (PRD Bölüm 10)</h4>
          <p class="text-[11px] text-slate-600 mt-0.5">
            İhaleciBurada platformunda başarı yalnızca "toplam üye" gibi yanıltıcı metriklerle değil; doğrulanmış VKN sayısı, ihale başına benzersiz teklifçi, teklif alma likiditesi ve gerçek fiyat hareketi üzerinden ölçülür. Teklif revizyonları ile benzersiz firma sayıları şeffaf bir biçimde ayrıştırılır.
          </p>
        </div>
      </div>

    </div>

    <!-- TAB 2: FUNNEL & TASARRUF (REP-009, REP-010, REP-011) -->
    <div v-if="activeTab === 'funnel' && kpiReport" class="space-y-6">
      
      <!-- Funnel Gösterimi (REP-009) -->
      <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-black uppercase">
              KURAL REP-009
            </span>
            <h3 class="text-base font-black text-slate-900 mt-1">Davet → Katılım → Teklif Dönüşüm Funnel'ı</h3>
          </div>
          <span class="font-mono font-black text-blue-600 text-base">
            Net Dönüşüm: %{{ kpiReport.funnel.conversionRate }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">1. Davet Edilen</span>
            <span class="font-mono font-black text-lg text-slate-900">{{ kpiReport.funnel.invitedCount }}</span>
            <span class="text-[9px] text-slate-500 block">%100 Taban</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">2. Görüntüleyen</span>
            <span class="font-mono font-black text-lg text-blue-700">{{ kpiReport.funnel.viewedCount }}</span>
            <span class="text-[9px] text-blue-600 block">%72 Görüntüleme</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">3. Katılım Talebi</span>
            <span class="font-mono font-black text-lg text-purple-700">{{ kpiReport.funnel.joinRequestedCount }}</span>
            <span class="text-[9px] text-purple-600 block">%48 Başvuru</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">4. Ön Yeterlilik Onayı</span>
            <span class="font-mono font-black text-lg text-amber-700">{{ kpiReport.funnel.approvedCount }}</span>
            <span class="text-[9px] text-amber-600 block">%42 Kabul</span>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span class="text-[10px] font-black text-emerald-800 uppercase block">5. Teklif Sunan</span>
            <span class="font-mono font-black text-xl text-emerald-700">{{ kpiReport.funnel.bidSubmittedCount }}</span>
            <span class="text-[9px] font-bold text-emerald-800 block">%{{ kpiReport.funnel.conversionRate }} Nihai Teklif</span>
          </div>
        </div>
      </div>

      <!-- Fiyat Hareketi ve Tasarruf Ayrımı (REP-010 & REP-011) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-mono font-black uppercase">
              KURAL REP-010
            </span>
            <TrendingUp class="text-blue-600" :size="20" />
          </div>
          <h4 class="text-sm font-black text-slate-900">İhale İçi Fiyat Rekabet Hareketi</h4>
          <p class="text-xs text-slate-500">İlk teklif ile kapanış teklifi arasındaki rekabetçi düşüş oranı</p>
          <div class="text-3xl font-mono font-black text-blue-600">
            -%{{ kpiReport.financials.priceMovementRate }}
          </div>
          <p class="text-[11px] text-slate-500 border-t pt-2 border-slate-100">
            * İhale içi fiyat hareketi tek başına alıcı tasarrufu olarak sunulmaz; piyasa dinamizmini gösterir.
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-black uppercase">
              KURAL REP-011
            </span>
            <ShieldCheck class="text-emerald-600" :size="20" />
          </div>
          <h4 class="text-sm font-black text-slate-900">Net Satın Alma Tasarrufu</h4>
          <p class="text-xs text-slate-500">Resmî referans fiyat kriterine kıyasla sağlanan net maliyet avantajı</p>
          <div class="text-3xl font-mono font-black text-emerald-600">
            %{{ kpiReport.financials.savingsRate }} <small class="text-xs font-sans text-slate-500 font-bold">(~₺{{ kpiReport.financials.totalSavingsVolume.toLocaleString('tr-TR') }})</small>
          </div>
          <p class="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
            <strong>Referans Kaynağı:</strong> {{ kpiReport.financials.savingsReferenceSource }}
          </p>
        </div>

      </div>

    </div>

    <!-- TAB 3: REASON CODE BAZINDA İPTAL & KAPATMA (REP-007) -->
    <div v-if="activeTab === 'iptal' && kpiReport" class="space-y-5">
      
      <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100">
          <div>
            <span class="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase">
              KURAL REP-007 & AWD-005
            </span>
            <h3 class="text-base font-black text-slate-900 mt-1">Standart İptal & Sonuçsuz Kalma Neden Kodları</h3>
            <p class="text-xs text-slate-500 mt-0.5">Serbest metin yerine sistematik 13 standart neden kodu dağılımı</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            v-for="(count, code) in kpiReport.cancellationsByReason" 
            :key="code"
            class="p-3.5 rounded-2xl border transition flex items-center justify-between"
            :class="count > 0 ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/50 border-slate-100 opacity-60'"
          >
            <div>
              <span class="font-mono text-xs font-bold text-slate-800 block">{{ code }}</span>
              <span class="text-[10px] text-slate-500">
                {{ 
                  code === 'NO_BIDS' ? 'Hiç Teklif Gelmedi' :
                  code === 'INSUFFICIENT_BIDS' ? 'Yetersiz Rekabet' :
                  code === 'BUDGET_EXCEEDED' ? 'Bütçe Aşıldı' :
                  code === 'SPECIFICATION_ERROR' ? 'Şartname Hatası' :
                  code === 'WINNER_WITHDREW' ? 'Kazanan Vazgeçti' :
                  code === 'RESERVE_NOT_MET' ? 'Hedef Fiyat Tutmadı' :
                  code === 'ALL_TECHNICALLY_REJECTED' ? 'Teknik Elenme' :
                  'Standart Gerekçe'
                }}
              </span>
            </div>
            <span 
              class="font-mono font-black text-sm px-2.5 py-1 rounded-xl"
              :class="count > 0 ? 'bg-red-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'"
            >
              {{ count }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 4: RİSK & MANİPÜLASYON (REP-012) -->
    <div v-if="activeTab === 'risk' && kpiReport" class="space-y-5">
      
      <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <span class="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-mono font-black uppercase">
              KURAL REP-012 & SEC-014
            </span>
            <h3 class="text-base font-black text-slate-900 mt-1">Güvenlik ve Risk Olayları Özeti</h3>
            <p class="text-xs text-slate-500 mt-0.5">Platform hile, danışıklı teklif ve yetki ihlali anomali sayaçları</p>
          </div>
          <NuxtLink 
            to="/panel/guvenlik-denetim" 
            class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Denetim Merkezini Aç</span>
            <ExternalLink :size="13" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] font-black text-slate-400 uppercase block">Toplam Güvenlik Olayı</span>
            <span class="font-mono font-black text-2xl text-slate-900">{{ kpiReport.riskSummary.totalRiskEvents }}</span>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span class="text-[10px] font-black text-amber-800 uppercase block">Danışıklı Teklif Sinyali</span>
            <span class="font-mono font-black text-2xl text-amber-700">{{ kpiReport.riskSummary.collusionSignals }}</span>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <span class="text-[10px] font-black text-blue-800 uppercase block">Rate Limit Engellemesi</span>
            <span class="font-mono font-black text-2xl text-blue-700">{{ kpiReport.riskSummary.rateLimitHits }}</span>
          </div>
          <div class="p-4 rounded-2xl bg-red-50 border border-red-200">
            <span class="text-[10px] font-black text-red-800 uppercase block">IDOR & Yetki İhlali</span>
            <span class="font-mono font-black text-2xl text-red-700">{{ kpiReport.riskSummary.idorAttempts + kpiReport.riskSummary.roleViolations }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 5: RESMÎ KPI SÖZLÜĞÜ (REP-014) -->
    <div v-if="activeTab === 'sozluk' && kpiReport" class="space-y-4">
      
      <div class="p-5 rounded-3xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-3">
        <BookOpen :size="20" class="text-blue-700 shrink-0 mt-0.5" />
        <div>
          <h3 class="font-black text-sm">Resmî KPI Dokümantasyonu (Kural REP-014)</h3>
          <p class="text-xs text-blue-900 mt-0.5">
            İhaleciBurada platformundaki her performans göstergesi, iş amacı, matematiksel formülü ve yönetimsel etkisiyle birlikte net biçimde tanımlanmıştır.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="def in kpiReport.kpiDefinitions" 
          :key="def.id"
          class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-left"
        >
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono font-black">
              {{ def.code }}
            </span>
            <span class="text-[10px] font-bold text-blue-600">Standart Tanım</span>
          </div>
          <h4 class="font-black text-xs sm:text-sm text-slate-900">{{ def.title }}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{{ def.description }}</p>
          
          <div class="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div class="text-slate-700 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
              <strong>Formül:</strong> {{ def.formula }}
            </div>
            <div class="text-slate-500 pt-1">
              <strong>İş Etkisi:</strong> {{ def.businessImpact }}
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
