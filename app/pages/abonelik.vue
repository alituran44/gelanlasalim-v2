<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Building, 
  CheckCircle, 
  X, 
  ShoppingCart, 
  Lock, 
  Sparkles, 
  Building2, 
  HelpCircle, 
  Globe, 
  DollarSign, 
  Euro, 
  CheckCircle2, 
  Shield 
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, t } from '~/composables/useLocale'

definePageMeta({
  layout: 'public'
})

const router = useRouter()

// Region Selector: domestic (Türkiye / TRY ₺) vs international (Global / USD $ - EUR €)
const paymentRegion = ref<'domestic' | 'international'>('domestic')
const internationalCurrency = ref<'USD' | 'EUR'>('USD')

// Domestic Pricing Packages (TRY ₺)
const domesticPackages = [
  { 
    id: '1-ay-tr', 
    name: 'Üyelik Başvurusu - 1 Ay', 
    price: 900, 
    monthly: '₺900,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPromo: false
  },
  { 
    id: '3-ay-tr', 
    name: 'Üyelik Başvurusu - 3 Ay', 
    price: 1800, 
    monthly: '₺600,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı',
    isPromo: true
  },
  { 
    id: '6-ay-tr', 
    name: 'Üyelik Başvurusu - 6 Ay', 
    price: 2700, 
    monthly: '₺450,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı',
    isPromo: false
  },
  { 
    id: '9-ay-tr', 
    name: 'Üyelik Başvurusu - 9 Ay', 
    price: 3600, 
    monthly: '₺400,00 / ay',
    desc: '9 Aylık Kurumsal Avantaj Paketinde Net %55 Tasarruf',
    isPromo: false
  }
]

// International Pricing Packages (USD $ / EUR €)
const internationalPackagesUSD = [
  { 
    id: '1-month-global-usd', 
    name: 'Global Pass - 1 Month', 
    price: 29, 
    monthly: '$29.00 / mo',
    desc: '1 Month Full Access to Global B2B Auction Arena (VAT Exempt)',
    isPromo: false
  },
  { 
    id: '3-months-global-usd', 
    name: 'Global Business - 3 Months', 
    price: 75, 
    monthly: '$25.00 / mo',
    desc: '3 Months Global Access with 15% Quarterly Discount',
    isPromo: true
  },
  { 
    id: '6-months-global-usd', 
    name: 'Global Enterprise - 6 Months', 
    price: 120, 
    monthly: '$20.00 / mo',
    desc: '6 Months Global Tier with 30% Bi-Annual Discount',
    isPromo: false
  },
  { 
    id: '12-months-global-usd', 
    name: 'Global Annual Pass - 12 Months', 
    price: 180, 
    monthly: '$15.00 / mo',
    desc: '12 Months Annual Pass with Maximum 50% Savings',
    isPromo: false
  }
]

const internationalPackagesEUR = [
  { 
    id: '1-month-global-eur', 
    name: 'Global Pass - 1 Month', 
    price: 25, 
    monthly: '€25.00 / mo',
    desc: '1 Month Full Access to Global B2B Auction Arena (VAT Exempt)',
    isPromo: false
  },
  { 
    id: '3-months-global-eur', 
    name: 'Global Business - 3 Months', 
    price: 65, 
    monthly: '€21.66 / mo',
    desc: '3 Months Global Access with 15% Quarterly Discount',
    isPromo: true
  },
  { 
    id: '6-months-global-eur', 
    name: 'Global Enterprise - 6 Months', 
    price: 105, 
    monthly: '€17.50 / mo',
    desc: '6 Months Global Tier with 30% Bi-Annual Discount',
    isPromo: false
  },
  { 
    id: '12-months-global-eur', 
    name: 'Global Annual Pass - 12 Months', 
    price: 155, 
    monthly: '€12.91 / mo',
    desc: '12 Months Annual Pass with Maximum 50% Savings',
    isPromo: false
  }
]

// Active Packages depending on selected region and currency
const activePackages = computed(() => {
  if (paymentRegion.value === 'domestic') {
    return domesticPackages
  }
  return internationalCurrency.value === 'EUR' ? internationalPackagesEUR : internationalPackagesUSD
})

const currencySymbol = computed(() => {
  if (paymentRegion.value === 'domestic') return '₺'
  return internationalCurrency.value === 'EUR' ? '€' : '$'
})

// Features list
const allFeatures = computed(() => [
  { text: t('feat_ekap_tenders'), col: 1 },
  { text: t('feat_ekap_results'), col: 1 },
  { text: t('feat_direct_proc'), col: 1 },
  { text: t('feat_sales_leases'), col: 1 },
  { text: t('feat_limit_calc'), col: 1 },
  { text: t('feat_search_suggest'), col: 2 },
  { text: t('feat_upcoming_notif'), col: 2 },
  { text: t('feat_won_notif'), col: 2 },
  { text: t('feat_cancel_notif'), col: 2 },
  { text: t('feat_unlimit_notif'), col: 2 },
  { text: t('feat_unlimit_report'), col: 2 },
  { text: t('feat_contractor_anal'), col: 3 },
  { text: t('feat_admin_anal'), col: 3 },
  { text: t('feat_sector_anal'), col: 3 },
  { text: t('feat_competitor_anal'), col: 3 },
  { text: t('feat_mobile_compat'), col: 3 }
])

const { cmsData } = useCmsData()
const userSession = ref<any>({})

const selectedPackage = ref<any>(null)
const isCheckoutOpen = ref(false)
const activePaymentChannel = ref<string>('paytr')

// Checkout Form Fields
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const selectedBank = ref('garanti')
const transferName = ref('')

const isProcessing = ref(false)
const showSuccessScreen = ref(false)
const distanceSalesApproved = ref(true)

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('userSession')
      if (saved) {
        userSession.value = JSON.parse(saved)
        const fullName = (userSession.value.firstName || '') + ' ' + (userSession.value.lastName || '')
        transferName.value = fullName.trim()
        cardName.value = fullName.trim()
      }
    } catch (e) {
      console.error('Failed to load user session', e)
    }
  }
})

const freeTrialPackage = {
  id: '6-ay-ucretsiz-deneme',
  name: '6 Ay Ücretsiz Lansman Deneme Paketi',
  price: 0,
  monthly: '0,00 ₺ / ay',
  desc: 'Lansmana özel ilk 6 ay boyunca sınırsız ihale açma, teklif verme, canlı eksiltme ve tüm analiz modülleri %100 ücretsizdir.',
  isTrial: true,
  isPromo: true
}

function startFreeTrial() {
  openCheckout(freeTrialPackage)
}

function openCheckout(pkg: any) {
  selectedPackage.value = pkg
  if (paymentRegion.value === 'domestic') {
    activePaymentChannel.value = 'paytr'
  } else {
    activePaymentChannel.value = 'stripe'
  }
  showSuccessScreen.value = false
  isCheckoutOpen.value = true
}

function handlePayment() {
  if (!distanceSalesApproved.value) {
    alert(locale.value === 'tr' ? 'Lütfen Mesafeli Satış Sözleşmesini onaylayınız.' : 'Please agree to the Distance Sales Terms.')
    return
  }

  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    showSuccessScreen.value = true

    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('userSession') || '{}')
      current.isPremium = true
      current.subscriptionPlan = selectedPackage.value?.name
      current.subscriptionRegion = paymentRegion.value
      current.isTrial = selectedPackage.value?.isTrial || false
      current.trialExpiresAt = '22 Şubat 2027'
      localStorage.setItem('userSession', JSON.stringify(current))
    }
  }, selectedPackage.value?.isTrial ? 600 : 1200)
}

function completeCheckout() {
  isCheckoutOpen.value = false
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left animate-fadeIn font-sans">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- H1 / HEADER BLOCK -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider">
          ⚡ {{ 'KURUMSAL ABONELİK VE LİSANS PLANLARI' }}
        </span>
        <h1 class="text-3xl font-black tracking-tight text-slate-900">
          {{ 'İhtiyacınıza Uygun Esnek Ödeme Planı Seçin' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          {{ 'Yurt içi (₺ TRY) veya yurt dışı ($ USD / € EUR) ödeme seçeneklerimizden firmanıza en uygun paketi tercih edin. Şeffaf fiyatlandırma, 0 komisyon.' }}
        </p>

        <!-- MARKET REGION TOGGLE SWITCH -->
        <div class="pt-4 flex items-center justify-center">
          <div class="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex gap-2">
            <button 
              @click="paymentRegion = 'domestic'"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
              :class="paymentRegion === 'domestic' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
            >
              <span class="text-base">🇹🇷</span>
              <span>{{ 'Yurt İçi Ödeme (Türkiye / ₺ TRY)' }}</span>
            </button>

            <button 
              @click="paymentRegion = 'international'"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
              :class="paymentRegion === 'international' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Globe :size="15" class="text-emerald-400" />
              <span>{{ 'Yurt Dışı Ödeme (Global / $ USD - € EUR)' }}</span>
            </button>
          </div>
        </div>

        <!-- International Currency Switcher Sub-Bar -->
        <div v-if="paymentRegion === 'international'" class="pt-2 flex items-center justify-center gap-3">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{{ 'Para Birimi:' }}</span>
          <div class="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
            <button 
              @click="internationalCurrency = 'USD'" 
              class="px-3 py-1 rounded-lg transition"
              :class="internationalCurrency === 'USD' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
            >
              $ USD
            </button>
            <button 
              @click="internationalCurrency = 'EUR'" 
              class="px-3 py-1 rounded-lg transition"
              :class="internationalCurrency === 'EUR' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
            >
              € EUR
            </button>
          </div>
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ {{ '%0 KDV Muaf İhrakat Faturası' }}
          </span>
        </div>
      </div>

      <!-- 6-MONTH FREE TRIAL LAUNCH BANNER -->
      <div class="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-left">
        <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              <Sparkles :size="13" />
              <span>LANSMANA ÖZEL: 6 AY BOYUNCA %100 ÜCRETSİZ DENEME SÜRECİ</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              İlk 6 Ay Boyunca Hiçbir Ücret Ödemeden Tüm Sistemi Kullanın!
            </h2>
            <p class="text-xs text-slate-300 leading-relaxed font-medium">
              İhaleciBurada platform lansmanına özel olarak tüm alıcı ve tedarikçi firmalarımıza ilk 6 ay boyunca ihale açma, teklif verme, canlı tersine eksiltme ve tüm analiz modülleri <strong>0 ₺</strong> bedelle sunulmaktadır. Kredi kartı gerekmez, 0 komisyon, anında koşulsuz aktivasyon.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-emerald-300 font-bold">
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> 6 Ay Boyunca 0 ₺</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Kredi Kartı İstemez</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Sınırsız İhale & Eksiltme</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Anında Aktivasyon</span>
            </div>
          </div>

          <div class="shrink-0 w-full lg:w-auto">
            <button
              type="button"
              @click="startFreeTrial"
              class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>6 AYLIK ÜCRETSİZ DENEMEYİ HEMEN BAŞLAT (0 ₺)</span>
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- FOUR COLUMNS PACKAGE GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        <div 
          v-for="pkg in activePackages" 
          :key="pkg.id" 
          class="border rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl shadow-sm relative group"
          :class="pkg.isPromo ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'"
        >
          <!-- Promo Tag -->
          <div v-if="pkg.isPromo" class="bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest text-center py-1.5">
            ⚡ {{ 'EN ÇOK TERCİH EDİLEN POPÜLER PLAN' }}
          </div>
          <div v-else class="bg-blue-900 text-white font-bold text-[9px] uppercase tracking-widest text-center py-1.5">
            {{ 'KURUMSAL KULLANIM' }}
          </div>
          
          <!-- Price & Title Content Area -->
          <div class="p-6 text-center flex-grow flex flex-col justify-between bg-white">
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">{{ pkg.name }}</h3>
              <div class="text-3xl font-black tracking-tight font-mono text-slate-900 mt-4">
                {{ currencySymbol }}{{ pkg.price.toLocaleString('tr-TR') }}
              </div>
              <div class="text-[11px] text-blue-700 font-bold mt-1 bg-blue-50 py-1 px-2 rounded-lg inline-block">
                {{ pkg.monthly }}
              </div>
            </div>
            
            <p class="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              {{ pkg.desc }}
            </p>
          </div>

          <!-- Action Button Bar -->
          <div class="p-5 bg-slate-50/80 border-t border-slate-100">
            <button 
              @click="openCheckout(pkg)"
              class="w-full text-center rounded-xl font-black text-xs py-3.5 transition-all shadow-md flex items-center justify-center gap-2 text-white cursor-pointer hover:scale-[1.02]"
              :class="pkg.isPromo ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-blue-900 hover:bg-blue-950 text-white'"
            >
              <span>{{ 'HEMEN ABONE OL' }}</span>
              <ArrowRight :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAX & SECURITY NOTICE BAR -->
      <div class="border border-slate-200 bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600 shadow-xs">
        <div class="flex items-center gap-2">
          <CheckCircle2 :size="16" class="text-emerald-500 shrink-0" />
          <span>{{ 'Tüm fiyatlara %20 KDV dahildir. E-Faturanız 24 saat içinde şirket unvanınıza kesilir.' }}</span>
        </div>
        <div class="flex items-center gap-4 text-[11px] text-slate-400">
          <span class="flex items-center gap-1"><Lock :size="13" class="text-amber-500" /> 256-Bit TLS SSL</span>
          <span class="flex items-center gap-1 text-emerald-600"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Anında Aktivasyon</span>
        </div>
      </div>

      <!-- BOTTOM FEATURES ACCORDION / GRID -->
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-lg font-black text-slate-900">{{ 'Tüm Paketlerde Dahil Olan Standart Özellikler' }}</h2>
          <p class="text-xs text-slate-500 mt-0.5">{{ 'Herhangi bir gizli ücret veya ek komisyon bulunmamaktadır.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div class="space-y-3">
            <h4 class="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-blue-700 text-[10px]">1</span>
              {{ 'İHALE VE TEKLİF YÖNETİMİ' }}
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li v-for="(f, i) in allFeatures.filter(x => x.col === 1)" :key="i" class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-500 shrink-0" />
                <span>{{ f.text }}</span>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-blue-700 text-[10px]">2</span>
              {{ 'BİLDİRİM VE TAKİP SİSTEMİ' }}
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li v-for="(f, i) in allFeatures.filter(x => x.col === 2)" :key="i" class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-500 shrink-0" />
                <span>{{ f.text }}</span>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-blue-700 text-[10px]">3</span>
              {{ 'ANALİTİK VE MOBİL UYUM' }}
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              <li v-for="(f, i) in allFeatures.filter(x => x.col === 3)" :key="i" class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-500 shrink-0" />
                <span>{{ f.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <!-- CHECKOUT MODAL -->
    <transition name="fade">
      <div v-if="isCheckoutOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
          
          <!-- Modal Header -->
          <div class="p-6 text-white flex items-center justify-between" :class="selectedPackage?.isTrial ? 'bg-emerald-950' : 'bg-blue-900'">
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest block" :class="selectedPackage?.isTrial ? 'text-emerald-400' : 'text-blue-300'">
                {{ selectedPackage?.isTrial ? '🎁 LANSMAN KAMPANYASI • %100 ÜCRETSİZ' : (paymentRegion === 'domestic' ? 'TÜRKİYE YURT İÇİ ÖDEME' : 'INTERNATIONAL GLOBAL PAYMENT') }}
              </span>
              <h3 class="text-base font-black text-white mt-0.5">{{ selectedPackage?.name }}</h3>
            </div>
            <button @click="isCheckoutOpen = false" class="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer">
              <X :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <!-- FREE TRIAL SCREEN (NO CREDIT CARD NEEDED) -->
            <div v-if="!showSuccessScreen && selectedPackage?.isTrial" class="space-y-5 text-left">
              <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles :size="20" />
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-slate-900">6 Ay Koşulsuz Ücretsiz Deneme</h4>
                    <p class="text-xs text-emerald-800 font-medium">Kredi kartı gerekmez, 0 ₺ ücret!</p>
                  </div>
                </div>
                <hr class="border-emerald-200/60" />
                <ul class="space-y-2 text-xs text-slate-700 font-medium">
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> Sınırsız B2B İhale Açma & Canlı Eksiltme</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> Doğrulanmış Firmalardan Belgeli Teklif Toplama</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> 6 Ay Boyunca %0 Komisyon, 0 ₺ Bedel</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> 22 Şubat 2027 Tarihine Kadar Tam Erişim</li>
                </ul>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Ödenecek Tutar:</span>
                <span class="text-base font-black text-emerald-600">0,00 ₺ (Ücretsiz)</span>
              </div>
            </div>

            <!-- PAID SCREEN -->
            <div v-else-if="!showSuccessScreen" class="space-y-6">
              
              <!-- Payment Channels Switcher -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {{ 'ÖDEME KANALI SEÇİN' }}
                </label>
                
                <!-- Domestic Gateways -->
                <div v-if="paymentRegion === 'domestic'" class="grid grid-cols-3 gap-2">
                  <button 
                    @click="activePaymentChannel = 'paytr'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'paytr' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <CreditCard :size="16" />
                    <span class="text-[10px]">PayTR 3D</span>
                  </button>

                  <button 
                    @click="activePaymentChannel = 'iyzico'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'iyzico' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <CreditCard :size="16" />
                    <span class="text-[10px]">iyzico</span>
                  </button>

                  <button 
                    @click="activePaymentChannel = 'bank_transfer'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'bank_transfer' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <Building :size="16" />
                    <span class="text-[10px]">Havale / EFT</span>
                  </button>
                </div>

                <!-- International Gateways -->
                <div v-else class="grid grid-cols-3 gap-2">
                  <button 
                    @click="activePaymentChannel = 'stripe'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'stripe' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <CreditCard :size="16" />
                    <span class="text-[10px]">Stripe Global</span>
                  </button>

                  <button 
                    @click="activePaymentChannel = 'paypal'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <CreditCard :size="16" />
                    <span class="text-[10px]">PayPal</span>
                  </button>

                  <button 
                    @click="activePaymentChannel = 'swift'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'swift' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <Globe :size="16" />
                    <span class="text-[10px]">SWIFT Wire</span>
                  </button>
                </div>
              </div>

              <!-- Credit Card Form (Domestic & Stripe/PayPal) -->
              <div v-if="activePaymentChannel !== 'bank_transfer' && activePaymentChannel !== 'swift'" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">{{ 'Kart Üzerindeki İsim' }}</label>
                  <input v-model="cardName" type="text" placeholder="John Doe" class="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-blue-600 focus:outline-none" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">{{ 'Kart Numarası' }}</label>
                  <input v-model="cardNumber" type="text" placeholder="4543 0000 0000 0000" class="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">{{ 'Son Kullanma (AA/YY)' }}</label>
                    <input v-model="cardExpiry" type="text" placeholder="12/28" class="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">CVC / CVV</label>
                    <input v-model="cardCvc" type="text" placeholder="888" class="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>
              </div>

              <!-- Bank Transfer (Domestic) -->
              <div v-else-if="activePaymentChannel === 'bank_transfer'" class="space-y-4">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <div class="font-bold text-slate-800">Garanti BBVA TR - İhaleciBurada Bilişim A.Ş.</div>
                  <div class="font-mono text-blue-700 font-bold select-all text-[11px]">TR91 0006 2000 0001 2345 6789 99</div>
                  <div class="text-[10px] text-slate-500">Açıklama kısmına firma vergi numaranızı yazınız.</div>
                </div>
              </div>

              <!-- SWIFT Wire Transfer (International) -->
              <div v-else-if="activePaymentChannel === 'swift'" class="space-y-4">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <div class="font-bold text-slate-800">Garanti Bank International SWIFT Account</div>
                  <div class="font-mono text-blue-700 font-bold select-all text-[11px]">IBAN: TR44 0006 2000 0001 9999 8888 77</div>
                  <div class="font-mono text-slate-700 text-[10px]">BIC / SWIFT CODE: <strong>GBAKTRIS</strong></div>
                  <div class="text-[10px] text-slate-500">Please reference your Company Name in the SWIFT transfer note.</div>
                </div>
              </div>

            </div>

            <!-- Success Screen -->
            <div v-else class="text-center py-8 space-y-4">
              <div class="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 :size="36" />
              </div>
              <h3 class="text-lg font-black text-slate-900">
                {{ selectedPackage?.isTrial ? '🎉 6 Aylık Ücretsiz Denemeniz Aktif!' : 'Abonelik İşlemi Başarılı!' }}
              </h3>
              <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {{ selectedPackage?.isTrial 
                  ? '6 ay boyunca tüm kurumsal B2B ihale ve canlı eksiltme modüllerini 0 ₺ bedelle sınırsız kullanabilirsiniz.'
                  : 'Faturanız oluşturuldu ve kurumsal panel erişiminiz anında aktifleştirildi.' 
                }}
              </p>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-6 bg-slate-50 border-t border-slate-100">
            <div v-if="!showSuccessScreen" class="mb-3 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold">
              <input v-model="distanceSalesApproved" type="checkbox" id="modal-distance-check" class="rounded border-slate-300 cursor-pointer" />
              <label for="modal-distance-check" class="cursor-pointer">
                {{ 'Koşulları onaylayarak ' }}
                <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" target="_blank" class="text-blue-600 underline">
                  {{ 'Kullanım ve Hizmet Şartlarını' }}
                </NuxtLink>
                {{ ' kabul etmiş olursunuz.' }}
              </label>
            </div>

            <button 
              v-if="!showSuccessScreen"
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full py-3.5 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              :class="selectedPackage?.isTrial ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-900 hover:bg-blue-950'"
            >
              <span v-if="isProcessing">{{ selectedPackage?.isTrial ? 'Deneme Aktifleştiriliyor...' : 'Ödeme Doğrulanıyor...' }}</span>
              <span v-else-if="selectedPackage?.isTrial">{{ '6 AYLIK ÜCRETSİZ DENEMEYİ HEMEN BAŞLAT (0 ₺)' }}</span>
              <span v-else>{{ currencySymbol }}{{ selectedPackage?.price.toLocaleString('tr-TR') }} {{ 'Güvenli Ödeme Yap' }}</span>
              <ArrowRight v-if="!isProcessing" :size="14" />
            </button>

            <button 
              v-else
              @click="completeCheckout"
              class="w-full py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{{ 'Kurumsal Paneli Başlat' }}</span>
              <ArrowRight :size="14" />
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>
