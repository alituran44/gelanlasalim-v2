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
    price: 90, 
    monthly: '₺90,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPromo: false
  },
  { 
    id: '3-ay-tr', 
    name: 'Üyelik Başvurusu - 3 Ay', 
    price: 180, 
    monthly: '₺60,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı',
    isPromo: true
  },
  { 
    id: '6-ay-tr', 
    name: 'Üyelik Başvurusu - 6 Ay', 
    price: 270, 
    monthly: '₺45,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı',
    isPromo: false
  },
  { 
    id: '12-ay-tr', 
    name: 'Üyelik Başvurusu - 12 Ay (Yıllık)', 
    price: 360, 
    monthly: '₺30,00 / ay',
    desc: '12 Aylık Yıllık Avantaj Paketinde Net %66 Tasarruf',
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
      localStorage.setItem('userSession', JSON.stringify(current))
    }
  }, 1200)
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

      <!-- FOUR COLUMNS PACKAGE GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
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
      <div class="rounded-2xl border border-slate-200 bg-white p-4 text-center text-xs font-bold text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div class="flex items-center gap-2">
          <ShieldCheck :size="18" class="text-emerald-600" />
          <span>
            {{ paymentRegion === 'domestic' 
              ? ('Tüm fiyatlara %20 KDV dahildir. E-Fatura 24 saat içinde iletilir.')
              : ('Yurt dışı ödemelerde %0 KDV İhracat faturası kesilir.')
            }}
          </span>
        </div>

        <div class="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
          <span>🔒 256-BIT TLS SSL</span>
          <span>•</span>
          <span>⚡ INSTANT ACTIVATION</span>
        </div>
      </div>

      <!-- FEATURE LIST TABLE (3 COLUMNS) -->
      <div class="border border-slate-200 rounded-3xl bg-white p-8 shadow-xs space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h3 class="text-lg font-black text-slate-900 tracking-tight">
            {{ 'Tüm Paketlerde Dahil Olan Standart Özellikler' }}
          </h3>
          <p class="text-xs text-slate-500 mt-1 font-medium">
            {{ 'Herhangi bir gizli ücret veya ek komisyon bulunmamaktadır.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-3">
            <div class="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">1. İHALE VE TEKLİF YÖNETİMİ</div>
            <div v-for="(feat, idx) in allFeatures.filter(f => f.col === 1)" :key="idx" class="flex items-center gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 :size="14" class="text-emerald-600 shrink-0" />
              <span>{{ feat.text }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">2. BİLDİRİM VE TAKİP SİSTEMİ</div>
            <div v-for="(feat, idx) in allFeatures.filter(f => f.col === 2)" :key="idx" class="flex items-center gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 :size="14" class="text-emerald-600 shrink-0" />
              <span>{{ feat.text }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">3. ANALİTİK VE MOBİL UYUM</div>
            <div v-for="(feat, idx) in allFeatures.filter(f => f.col === 3)" :key="idx" class="flex items-center gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 :size="14" class="text-emerald-600 shrink-0" />
              <span>{{ feat.text }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- CHECKOUT MODAL -->
    <transition name="fade">
      <div v-if="isCheckoutOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
          
          <!-- Modal Header -->
          <div class="p-6 bg-blue-900 text-white flex items-center justify-between">
            <div>
              <span class="text-[10px] font-black text-blue-300 uppercase tracking-widest block">
                {{ paymentRegion === 'domestic' ? 'TÜRKİYE YURT İÇİ ÖDEME' : 'INTERNATIONAL GLOBAL PAYMENT' }}
              </span>
              <h3 class="text-base font-black text-white mt-0.5">{{ selectedPackage?.name }}</h3>
            </div>
            <button @click="isCheckoutOpen = false" class="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
              <X :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <div v-if="!showSuccessScreen" class="space-y-6">
              
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
                  <div class="font-bold text-slate-800">Garanti BBVA TR - GelAnlaşalım Bilişim A.Ş.</div>
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
              <h3 class="text-lg font-black text-slate-900">{{ 'Abonelik İşlemi Başarılı!' }}</h3>
              <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {{ 'Faturanız oluşturuldu ve kurumsal panel erişiminiz anında aktifleştirildi.' 
                }}
              </p>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-6 bg-slate-50 border-t border-slate-100">
            <div v-if="!showSuccessScreen" class="mb-3 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold">
              <input v-model="distanceSalesApproved" type="checkbox" id="modal-distance-check" class="rounded border-slate-300" />
              <label for="modal-distance-check" class="cursor-pointer">
                {{ 'Ödemeyi onaylayarak ' }}
                <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" target="_blank" class="text-blue-600 underline">
                  {{ 'Mesafeli Satış Sözleşmesini' }}
                </NuxtLink>
                {{ ' kabul etmiş olursunuz.' }}
              </label>
            </div>

            <button 
              v-if="!showSuccessScreen"
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="isProcessing">{{ 'Ödeme Doğrulanıyor...' }}</span>
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
