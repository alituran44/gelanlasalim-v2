<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Receipt, 
  Coins, 
  Layers, 
  ArrowUpRight, 
  Calculator, 
  Sparkles,
  RefreshCw,
  Info,
  Check,
  Award,
  ChevronRight
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Gelir Modeli & Ücretlendirme Stratejisi (REV-001 - REV-003) | İhaleciBurada'
})

const activeTab = ref<'strateji' | 'simulasyon' | 'tahakkuk' | 'paketler'>('strateji')
const isLoading = ref(false)
const isUpdating = ref(false)
const saveSuccess = ref(false)

// Config & Accruals
const config = ref<any>({
  activeModel: 'HYBRID',
  buyerCommissionRate: 0,
  sellerCommissionRate: 4.0,
  minCommissionAmount: 500,
  maxCommissionCap: 150000,
  vatRate: 20,
  withholdingRate: 0.5,
  isDecoupledFromBidding: true
})

const corporateTiers = ref<any[]>([])
const accruals = ref<any[]>([])
const accrualsSummary = ref<any>(null)

// Simulation Parameters
const simParams = ref({
  monthlyTenderCount: 45,
  avgTenderAmount: 350000,
  proSubscriberCount: 25,
  enterpriseSubscriberCount: 8,
  sellerCommissionRate: 4.0
})

const simResult = ref<any>(null)

// Fetch Initial Data
async function loadData() {
  isLoading.value = true
  try {
    const [cfgRes, accRes] = await Promise.all([
      $fetch<any>('/api/revenue/config'),
      $fetch<any>('/api/revenue/accruals')
    ])
    if (cfgRes?.config) config.value = cfgRes.config
    if (cfgRes?.tiers) corporateTiers.value = cfgRes.tiers
    if (accRes?.accruals) accruals.value = accRes.accruals
    if (accRes?.summary) accrualsSummary.value = accRes.summary
    
    await runSimulation()
  } catch (err) {
    console.error('Veri yükleme hatası:', err)
  } finally {
    isLoading.value = false
  }
}

// Run Financial Simulation
async function runSimulation() {
  try {
    const res = await $fetch<any>('/api/revenue/simulate', {
      method: 'POST',
      body: simParams.value
    })
    if (res?.projection) {
      simResult.value = res.projection
    }
  } catch (err) {
    console.error('Simülasyon hatası:', err)
  }
}

// Save Config Changes
async function saveConfig() {
  isUpdating.value = true
  saveSuccess.value = false
  try {
    const res = await $fetch<any>('/api/revenue/config', {
      method: 'PATCH',
      body: {
        activeModel: config.value.activeModel,
        sellerCommissionRate: Number(config.value.sellerCommissionRate),
        minCommissionAmount: Number(config.value.minCommissionAmount),
        maxCommissionCap: Number(config.value.maxCommissionCap)
      }
    })
    if (res?.config) {
      config.value = res.config
      saveSuccess.value = true
      setTimeout(() => { saveSuccess.value = false }, 3000)
      await runSimulation()
    }
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Kaydetme sırasında bir hata oluştu.')
  } finally {
    isUpdating.value = false
  }
}

onMounted(() => {
  loadData()
})

const prdModels = [
  {
    id: 'Alıcı Aboneliği',
    target: 'Alıcı Odaklı',
    advantages: 'Alıcıya kurumsal satın alma SaaS değeri üzerinden öngörülebilir gelir. Satıcı networküne sıfır giriş bariyeri.',
    risks: 'Alıcı firmaların satın alma aracı için bütçe ayırması zaman alabilir; gelişmiş ERP ve onay akışları gerekir.',
    compatibility: 'Opsiyonel / Kurumsal Eklenti',
    status: 'Karar Bekliyor'
  },
  {
    id: 'Satıcı Premium',
    target: 'Satıcı Odaklı',
    advantages: 'Aktif tedarikçilerden aylık/yıllık üyelik geliri; ihale alarmları, analiz ve vitrin değeri satılabilir.',
    risks: 'Network yeterli büyüklüğe ulaşmadan ücret koymak yeni tedarikçi kazanımını yavaşlatabilir.',
    compatibility: 'Mevcut (Kurumsal Pro)',
    status: 'Aktif Kullanımda'
  },
  {
    id: 'İhale Başına Ücret',
    target: 'İşlem Başına',
    advantages: 'Kullandıkça öde mantığı; basit ve şeffaf.',
    risks: 'Kullanıcılar ihale açmaktan veya teklif vermekten imtina edebilir; likiditeyi düşürür.',
    compatibility: 'Uygun Değil (REV-002 İhlali)',
    status: 'Tavsiye Edilmiyor'
  },
  {
    id: 'Başarı / İşlem Komisyonu (%4)',
    target: 'Sonuç Odaklı',
    advantages: 'Platform değer yarattıkça ve ihale başarıyla sonuçlandıkça gelir üretir. Alıcıya %0 komisyon güvencesi sunar.',
    risks: 'İhale sonuç tutanağının ve faturanın tahsilat takibi gerekir; aracı hizmet sağlayıcı rolü korunmalıdır.',
    compatibility: 'Mevcut Ana Model (%4 Sabit)',
    status: 'Standart / Varsayılan'
  },
  {
    id: 'Kurumsal Paket (SaaS)',
    target: 'Büyük Kurumsal',
    advantages: 'Büyük ölçekli satın alma yapan holdinglere çoklu kullanıcı, onay hiyerarşisi ve ERP API paketi satışı.',
    risks: 'Satış döngüsü uzundur; entegrasyon desteği gerekir.',
    compatibility: 'Mevcut (Enterprise)',
    status: 'Aktif Kullanımda'
  },
  {
    id: 'Hibrit Model (Tavsiye Edilen)',
    target: 'Karma Model',
    advantages: 'Alıcı %0 + Satıcı %4 Başarı Komisyonu + Opsiyonel Kurumsal Pro/Enterprise Abonelikler. Maksimum likidite.',
    risks: 'Fiyatlandırma sade ve şeffaf tutulmalıdır.',
    compatibility: 'Tam Uyumlu (PRD Önerisi)',
    status: 'Platform Standardı'
  }
]
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto text-slate-100">
    
    <!-- Üst Başlık & Durum Rozeti -->
    <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-sm">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck :size="14" />
              PRD BÖLÜM 12 & REV-001 - REV-003 UYUMLU
            </span>
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ALICI %0 KOMİSYON GÜVENCESİ
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Coins class="text-emerald-400" :size="32" />
            Gelir Modeli ve Ücretlendirme Stratejisi
          </h1>
          <p class="text-sm text-slate-400 mt-1 max-w-3xl">
            İhaleciBurada B2B e-ihale pazaryeri gelir mimarisi; alıcı satın alma ekiplerine sıfır maliyet (%0), satıcı firmalara başarı durumunda net %4 platform hizmet bedeli ve kurumsal üyelik paketleri üzerine kuruludur.
          </p>
        </div>

        <!-- Özet Hacim Kartı -->
        <div class="flex items-center gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 shrink-0">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp :size="24" />
          </div>
          <div>
            <div class="text-xs text-slate-400 font-medium">Toplam Tahakkuk Havuzu</div>
            <div class="text-xl font-black text-white font-mono">
              {{ accrualsSummary?.totalNetPayable ? accrualsSummary.totalNetPayable.toLocaleString('tr-TR') + ' ₺' : '143.550 ₺' }}
            </div>
            <div class="text-[10px] text-emerald-400 font-bold">3 Sonuçlanan İhaleden</div>
          </div>
        </div>
      </div>

      <!-- Kural Güvenceleri Şeridi -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">REV-001 (Alıcı %0 Komisyon):</span> Alıcı firmalar ihale açarken, şartname yayınlarken veya teklif kabul ederken hiçbir komisyon ödemez.
          </div>
        </div>
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">REV-002 (Decoupled Engine):</span> Temel ihale ve teklif motoru ücretlendirmeye bağımsızdır; ihale akışı ödeme duvarına kilitlenemez.
          </div>
        </div>
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">REV-003 (Tahakkuk Analitiği):</span> Platform hizmet bedeli sadece resmi İhale Sonuç Tutanağı onaylandığında kazanana tahakkuk eder.
          </div>
        </div>
      </div>
    </div>

    <!-- Sekme Navigasyonu -->
    <div class="flex border-b border-slate-800 space-x-1 overflow-x-auto scrollbar-none">
      <button
        type="button"
        @click="activeTab = 'strateji'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'strateji' ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Layers :size="16" />
        Bölüm 12 Karar Matrisi
      </button>

      <button
        type="button"
        @click="activeTab = 'simulasyon'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'simulasyon' ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Calculator :size="16" />
        Dinamik Gelir Simülatörü
      </button>

      <button
        type="button"
        @click="activeTab = 'tahakkuk'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'tahakkuk' ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Receipt :size="16" />
        Komisyon Tahakkuk Tablosu
      </button>

      <button
        type="button"
        @click="activeTab = 'paketler'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'paketler' ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Award :size="16" />
        Kurumsal Üyelik Paketleri
      </button>
    </div>

    <!-- 1. TAB: STRATEJİ & KARAR MATRİSİ -->
    <div v-if="activeTab === 'strateji'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Sol: Aktif Model Yapılandırması Formu -->
        <div class="lg:col-span-1 rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Sliders :size="18" class="text-emerald-400" />
            Aktif Model Parametreleri
          </h2>
          <p class="text-xs text-slate-400">
            Platform genelinde geçerli olan komisyon tabanı ve katsayıları yönetin.
          </p>

          <form @submit.prevent="saveConfig" class="space-y-4 pt-2">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Seçili Model Stratejisi</label>
              <select 
                v-model="config.activeModel"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="HYBRID">Hibrit (Alıcı %0 + Satıcı %4 + SaaS)</option>
                <option value="COMMISSION_ONLY">Yalnızca Başarı Komisyonu (%4)</option>
                <option value="SUBSCRIPTION_ONLY">Yalnızca Kurumsal Abonelik</option>
                <option value="FREE_PILOT">Ücretsiz Pilot Dönemi (%0 Komisyon)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Alıcı Komisyon Oranı (%)
                <span class="text-[10px] text-emerald-400 ml-1 font-normal">(PRD Kuralı: Kilitli)</span>
              </label>
              <input 
                type="number" 
                :value="0" 
                disabled 
                class="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Satıcı Standart Başarı Komisyonu (%)</label>
              <div class="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="15"
                  v-model.number="config.sellerCommissionRate"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
                <span class="absolute right-3 top-2 text-xs text-slate-500">%</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Min. Taban Tutar</label>
                <input 
                  type="number" 
                  v-model.number="config.minCommissionAmount"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Maks. Tavan Sınırı</label>
                <input 
                  type="number" 
                  v-model.number="config.maxCommissionCap"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div class="flex justify-between">
                <span>KDV Oranı:</span>
                <span class="text-white font-mono">%20</span>
              </div>
              <div class="flex justify-between">
                <span>B2B KDV Tevkifatı:</span>
                <span class="text-white font-mono">5/10 (Yarısı Tevkif)</span>
              </div>
              <div class="flex justify-between">
                <span>İhale Motoru Kilidi:</span>
                <span class="text-emerald-400 font-bold">Kapalı (Decoupled)</span>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isUpdating"
              class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw v-if="isUpdating" class="animate-spin" :size="14" />
              <Check v-else-if="saveSuccess" class="text-white" :size="14" />
              <span>{{ saveSuccess ? 'Parametreler Güncellendi!' : 'Modeli Kaydet & Uygula' }}</span>
            </button>
          </form>
        </div>

        <!-- Sağ: PRD Bölüm 12 Karşılaştırmalı Değerlendirme Tablosu -->
        <div class="lg:col-span-2 rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <FileText :size="18" class="text-blue-400" />
              PRD Bölüm 12: 6 Modelin Değerlendirme Çerçevesi
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Ürün analiz dokümanında masaya yatırılan modellerin risk, avantaj ve platform kararları.
            </p>
          </div>

          <div class="space-y-3">
            <div 
              v-for="model in prdModels" 
              :key="model.id"
              class="p-4 rounded-xl border transition-all"
              :class="model.id.includes('Hibrit') || model.id.includes('%4') 
                ? 'bg-slate-950/80 border-emerald-500/30' 
                : 'bg-slate-950/40 border-slate-800/80'"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <h3 class="text-xs font-bold text-white">{{ model.id }}</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                    {{ model.target }}
                  </span>
                </div>
                <span 
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="model.status.includes('Standart') || model.status.includes('Platform')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'"
                >
                  {{ model.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span class="text-emerald-400 font-bold block mb-0.5">Avantaj:</span>
                  <p class="text-slate-300 leading-relaxed">{{ model.advantages }}</p>
                </div>
                <div>
                  <span class="text-amber-400 font-bold block mb-0.5">Risk / Ürün Etkisi:</span>
                  <p class="text-slate-400 leading-relaxed">{{ model.risks }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 2. TAB: DİNAMİK GELİR SİMÜLATÖRÜ -->
    <div v-if="activeTab === 'simulasyon'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Simülasyon Girdi Alanları -->
        <div class="lg:col-span-1 rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Sliders :size="18" class="text-emerald-400" />
            Projeksiyon Değişkenleri
          </h2>
          <p class="text-xs text-slate-400">
            Aylık hacim ve katılımcı senaryolarını test ederek platform gelir ve tasarruf potansiyelini simüle edin.
          </p>

          <div class="space-y-4 pt-2">
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Aylık Sonuçlanan İhale Adedi</span>
                <span class="text-emerald-400 font-mono">{{ simParams.monthlyTenderCount }} Adet</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="300" 
                step="5"
                v-model.number="simParams.monthlyTenderCount"
                @input="runSimulation"
                class="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Ortalama İhale Bedeli</span>
                <span class="text-emerald-400 font-mono">{{ simParams.avgTenderAmount.toLocaleString('tr-TR') }} ₺</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="2000000" 
                step="25000"
                v-model.number="simParams.avgTenderAmount"
                @input="runSimulation"
                class="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Kurumsal Pro Abone Sayısı</span>
                <span class="text-blue-400 font-mono">{{ simParams.proSubscriberCount }} Firma (1.800 ₺/ay)</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="150" 
                step="5"
                v-model.number="simParams.proSubscriberCount"
                @input="runSimulation"
                class="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Kurumsal Enterprise Abone Sayısı</span>
                <span class="text-purple-400 font-mono">{{ simParams.enterpriseSubscriberCount }} Firma (4.500 ₺/ay)</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="1"
                v-model.number="simParams.enterpriseSubscriberCount"
                @input="runSimulation"
                class="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div class="pt-2">
              <button
                type="button"
                @click="runSimulation"
                class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator :size="14" />
                <span>Projeksiyonu Yeniden Hesapla</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Simülasyon Çıktı Kartları -->
        <div class="lg:col-span-2 space-y-6">
          <div v-if="simResult" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div class="rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
              <div class="text-xs text-slate-400 font-medium">Toplam Ticaret Hacmi (GMV)</div>
              <div class="text-2xl font-black text-white font-mono mt-1">
                {{ simResult.totalGrossMerchandiseVolume.toLocaleString('tr-TR') }} ₺
              </div>
              <div class="text-[11px] text-slate-400 mt-2">
                {{ simResult.monthlyTenderCount }} ihale × {{ simResult.avgTenderAmount.toLocaleString('tr-TR') }} ₺ ortalama
              </div>
            </div>

            <div class="rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
              <div class="text-xs text-slate-400 font-medium">Satıcı Komisyon Geliri</div>
              <div class="text-2xl font-black text-emerald-400 font-mono mt-1">
                {{ simResult.sellerCommissionRevenue.toLocaleString('tr-TR') }} ₺
              </div>
              <div class="text-[11px] text-emerald-300 mt-2">
                Standart %4.0 + Pro %2.5 + Enterprise %1.5
              </div>
            </div>

            <div class="rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
              <div class="text-xs text-slate-400 font-medium">SaaS Abonelik Geliri</div>
              <div class="text-2xl font-black text-blue-400 font-mono mt-1">
                {{ simResult.totalSubscriptionRevenue.toLocaleString('tr-TR') }} ₺
              </div>
              <div class="text-[11px] text-blue-300 mt-2">
                Pro ({{ simResult.proSubscriptionRevenue.toLocaleString('tr-TR') }} ₺) + Ent ({{ simResult.enterpriseSubscriptionRevenue.toLocaleString('tr-TR') }} ₺)
              </div>
            </div>

            <div class="rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20 sm:col-span-2">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider">Aylık Toplam Net Platform Ciro</div>
                  <div class="text-3xl font-black text-white font-mono mt-1">
                    {{ simResult.netPlatformRevenue.toLocaleString('tr-TR') }} ₺
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">Efektif Take-Rate</div>
                  <div class="text-xl font-bold text-emerald-400 font-mono">
                    %{{ simResult.effectiveTakeRate }}
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between">
                <span>Alıcı Komisyon Geliri: <strong class="text-white">0 ₺ (Ücretsiz)</strong></span>
                <span>Yıllık Tahmini Projeksiyon: <strong class="text-emerald-400 font-mono">{{ (simResult.netPlatformRevenue * 12).toLocaleString('tr-TR') }} ₺</strong></span>
              </div>
            </div>

            <div class="rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20">
              <div class="text-xs text-amber-400 font-bold uppercase tracking-wider">Alıcıların Sağladığı Tasarruf</div>
              <div class="text-2xl font-black text-white font-mono mt-1">
                {{ simResult.buyerSavingsEstimated.toLocaleString('tr-TR') }} ₺
              </div>
              <div class="text-[11px] text-amber-200/80 mt-2">
                Açık eksiltme ile sağlanan ortalama %14.2 satın alma tasarrufu
              </div>
            </div>

          </div>

          <!-- Finansal Şeffaflık & Fatura Dağılımı -->
          <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Vergi & Tevkifat Dağılım Modeli
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span class="text-slate-400 block mb-1">Hesaplanan KDV (%20):</span>
                <span class="text-white font-mono font-bold text-sm">
                  {{ simResult?.totalVatLiability?.toLocaleString('tr-TR') || 0 }} ₺
                </span>
              </div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span class="text-slate-400 block mb-1">Satıcı Tarafından Tevkif Edilen (5/10):</span>
                <span class="text-emerald-400 font-mono font-bold text-sm">
                  {{ Math.round((simResult?.totalVatLiability || 0) * 0.5).toLocaleString('tr-TR') }} ₺
                </span>
              </div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span class="text-slate-400 block mb-1">Platforma Doğrudan Ödenen KDV:</span>
                <span class="text-blue-400 font-mono font-bold text-sm">
                  {{ Math.round((simResult?.totalVatLiability || 0) * 0.5).toLocaleString('tr-TR') }} ₺
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- 3. TAB: TAHAKKUK TABLOSU -->
    <div v-if="activeTab === 'tahakkuk'" class="space-y-6">
      <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <Receipt :size="18" class="text-emerald-400" />
              İhale Sonuç Tutanağı Komisyon Tahakkukları
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Tamamlanan ve onaylanan ihalelerden satıcı tarafına tahakkuk ettirilen platform hizmet bedelleri.
            </p>
          </div>

          <button 
            type="button"
            @click="loadData"
            class="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw :size="13" />
            <span>Listeyi Yenile</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th class="py-3 px-3">Tahakkuk / İhale No</th>
                <th class="py-3 px-3">İhale Başlığı & Taraflar</th>
                <th class="py-3 px-3">Nihai İhale Bedeli</th>
                <th class="py-3 px-3">Oran & Hizmet Bedeli</th>
                <th class="py-3 px-3">KDV & Net Ödenecek</th>
                <th class="py-3 px-3">Fatura Durumu</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="acc in accruals" :key="acc.id" class="hover:bg-slate-950/40 transition">
                <td class="py-3 px-3 font-mono">
                  <div class="text-white font-bold">{{ acc.id }}</div>
                  <div class="text-[10px] text-slate-400">{{ acc.tenderId }}</div>
                </td>
                <td class="py-3 px-3 max-w-xs">
                  <div class="text-white font-semibold truncate" :title="acc.tenderTitle">{{ acc.tenderTitle }}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">
                    Alıcı: {{ acc.buyerCompany }} | Satıcı: <strong class="text-slate-300">{{ acc.awardedSupplier }}</strong> (VKN: {{ acc.awardedSupplierVkn }})
                  </div>
                </td>
                <td class="py-3 px-3 font-mono text-white font-bold">
                  {{ acc.tenderFinalAmount.toLocaleString('tr-TR') }} ₺
                </td>
                <td class="py-3 px-3 font-mono">
                  <div class="text-emerald-400 font-bold">%{{ acc.commissionRate }} Komisyon</div>
                  <div class="text-[10px] text-slate-300">{{ acc.grossCommission.toLocaleString('tr-TR') }} ₺ Brüt</div>
                </td>
                <td class="py-3 px-3 font-mono">
                  <div class="text-white font-bold">{{ acc.netPayableCommission.toLocaleString('tr-TR') }} ₺</div>
                  <div class="text-[10px] text-slate-400">+{{ acc.vatAmount.toLocaleString('tr-TR') }} KDV (-{{ acc.withholdingAmount.toLocaleString('tr-TR') }} Tevkifat)</div>
                </td>
                <td class="py-3 px-3">
                  <span 
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1"
                    :class="{
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': acc.status === 'COLLECTED',
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30': acc.status === 'INVOICED',
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30': acc.status === 'PENDING_INVOICE'
                    }"
                  >
                    {{ acc.status === 'COLLECTED' ? 'Tahsil Edildi' : (acc.status === 'INVOICED' ? 'Faturalandı (' + acc.invoiceNo + ')' : 'Fatura Bekliyor') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4. TAB: KURUMSAL ÜYELİK PAKETLERİ -->
    <div v-if="activeTab === 'paketler'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="tier in corporateTiers" 
          :key="tier.id"
          class="rounded-2xl p-6 border transition-all flex flex-col justify-between"
          :class="tier.isPopular 
            ? 'border-emerald-500/50 bg-slate-900 shadow-2xl relative' 
            : 'border-slate-800 bg-slate-900/70'"
        >
          <div v-if="tier.isPopular" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
            En Popüler Kurumsal Plan
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-black text-white">{{ tier.name }}</h3>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400">
                %{{ tier.commissionRate }} Komisyon
              </span>
            </div>

            <div class="my-4">
              <div class="text-3xl font-black text-white font-mono">
                {{ tier.monthlyPrice === 0 ? 'Ücretsiz' : tier.monthlyPrice.toLocaleString('tr-TR') + ' ₺' }}
                <span v-if="tier.monthlyPrice > 0" class="text-xs text-slate-400 font-normal">/ ay</span>
              </div>
              <div v-if="tier.annualPrice > 0" class="text-xs text-emerald-400 font-medium mt-1">
                Yıllık peşin: {{ tier.annualPrice.toLocaleString('tr-TR') }} ₺ (%17 ek indirim)
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div v-for="(feat, idx) in tier.features" :key="idx" class="flex items-start gap-2 text-slate-300">
                <CheckCircle2 :size="14" class="text-emerald-400 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-slate-800/80">
            <NuxtLink
              to="/abonelik"
              class="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-2"
              :class="tier.isPopular ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-white'"
            >
              <span>{{ tier.monthlyPrice === 0 ? 'Mevcut Planınız' : 'Bu Pakete Geç' }}</span>
              <ArrowUpRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
