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
  Shield,
  Award,
  Clock,
  ArrowUpRight,
  User
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, t } from '~/composables/useLocale'
import { useUserSession } from '~/composables/useUserSession'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'Kurumsal Üyelik & İhale Paketleri | İhaleciBurada',
  description: 'Türkiye geneli B2B satın alma ihalelerine katılın, sınırsız teklif verin ve doğrulanmış kurumsal tedarikçi rozeti kazanın.'
})

const router = useRouter()
const route = useRoute()
const { isCompanyMode, toggleCompanyMode } = useUserSession()

// Region Selector: domestic (Türkiye / TRY ₺) vs international (Global / USD $ - EUR €)
const paymentRegion = ref<'domestic' | 'international'>('domestic')
const internationalCurrency = ref<'USD' | 'EUR'>('USD')

// Corporate Billing Cycle: monthly vs annual (12 Ay %17 Ek İndirim)
const corporateBillingCycle = ref<'monthly' | 'annual'>('monthly')

// Kurumsal Üyelik Paketleri (Firma Modu Aktif Olduğunda Açığa Çıkar - Standart Ücretsiz Kaldırıldı)
const corporatePackages = computed(() => [
  {
    id: 'kurumsal-pro',
    name: 'Kurumsal Pro Tedarikçi',
    badge: '%2.5 Komisyon',
    commissionRate: 2.5,
    price: corporateBillingCycle.value === 'annual' ? 18000 : 1800,
    monthlyPrice: 1800,
    annualPrice: 18000,
    monthly: corporateBillingCycle.value === 'annual' ? '₺1.500,00 / ay (Peşin Yıllık)' : '₺1.800,00 / ay',
    desc: 'İndirimli %2.5 platform başarı komisyonu (%37.5 tasarruf) ve Mavi Kalkan kurumsal tedarikçi rozeti.',
    features: [
      'İndirimli %2.5 platform başarı komisyonu (%37.5 tasarruf)',
      'Doğrulanmış B2B Rozeti (Mavi Kalkan)',
      'Yeni açılan ihalelerde 15 dakika öncelikli SMS/E-posta alarmı',
      'Sınırsız teklif revizyonu ve detaylı rakip analiz özeti',
      '7/24 Öncelikli telefon & KEP destek hattı'
    ],
    isPopular: true,
    isFree: false
  },
  {
    id: 'kurumsal-enterprise',
    name: 'Kurumsal Enterprise',
    badge: '%1.5 Komisyon',
    commissionRate: 1.5,
    price: corporateBillingCycle.value === 'annual' ? 45000 : 4500,
    monthlyPrice: 4500,
    annualPrice: 45000,
    monthly: corporateBillingCycle.value === 'annual' ? '₺3.750,00 / ay (Peşin Yıllık)' : '₺4.500,00 / ay',
    desc: 'En düşük %1.5 komisyon oranı, kurumsal ekip yetkilendirmesi ve SAP/Logo/Netsis ERP REST API entegrasyonu.',
    features: [
      'Özel indirimli %1.5 platform başarı komisyonu (%62.5 tasarruf)',
      'Kurumsal Alt Kullanıcı & Ekip Yetki Yönetimi (Limitsiz)',
      'SAP / Logo / Netsis / Mikro ERP REST API Entegrasyonu',
      'Özel Müşteri Başarı Yöneticisi (Account Manager)',
      'Özel davetli kapalı ihalelere otomatik doğrudan davet',
      'Gelişmiş Likidite ve Fiyat Hareketi Analitik Raporu'
    ],
    isPopular: false,
    isFree: false
  }
])

// Domestic Pricing Packages (TRY ₺) - 1, 3, 6, 12 Ay
const domesticPackages = [
  { 
    id: '1-ay-tr', 
    name: 'STANDART İHALE PAKETİ - 1 AY', 
    price: 900, 
    monthly: '₺900,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPromo: false,
    duration: '1 Ay'
  },
  { 
    id: '3-ay-tr', 
    name: 'PRO AVANTAJ PAKETİ - 3 AY', 
    price: 1800, 
    monthly: '₺600,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı (%20 KDV Dahil)',
    isPromo: true,
    duration: '3 Ay'
  },
  { 
    id: '6-ay-tr', 
    name: 'KURUMSAL PLAN - 6 AY', 
    price: 2700, 
    monthly: '₺450,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı (%20 KDV Dahil)',
    isPromo: false,
    duration: '6 Ay'
  },
  { 
    id: '12-ay-tr', 
    name: 'YILLIK LİSANS PAKETİ - 12 AY', 
    price: 3600, 
    monthly: '₺300,00 / ay',
    desc: '12 Aylık Yıllık Avantaj Paketinde Net %67 Tasarruf (%20 KDV Dahil)',
    isPromo: false,
    duration: '12 Ay'
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
const activePaymentChannel = ref<string>('paynkolay')

// Corporate Billing Information Fields (Mandatory for Paynkolay / Aktif Bank)
const billingCompanyTitle = ref('')
const billingTaxNo = ref('')
const billingTaxOffice = ref('')
const billingAddress = ref('')
const billingCity = ref('İstanbul')
const billingDistrict = ref('Kadıköy')
const billingPhone = ref('')
const billingEmail = ref('')

// Checkout Form Fields
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const selectedBank = ref('garanti')
const transferName = ref('')

const isProcessing = ref(false)
const showSuccessScreen = ref(false)

// Compliance Checkboxes (Mandatory for Paynkolay / Aktif Bank)
const preInfoApproved = ref(true)
const distanceSalesApproved = ref(true)
const refundPolicyApproved = ref(true)

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('userSession')
      if (saved) {
        userSession.value = JSON.parse(saved)
        const fullName = (userSession.value.firstName || '') + ' ' + (userSession.value.lastName || '')
        transferName.value = fullName.trim()
        cardName.value = fullName.trim()
        billingCompanyTitle.value = userSession.value.companyName || (fullName.trim() ? fullName.trim() + ' Ticaret' : 'Örnek Sanayi ve Ticaret A.Ş.')
        billingTaxNo.value = userSession.value.taxNumber || '9560161511'
        billingTaxOffice.value = userSession.value.taxOffice || 'Çanakkale Vergi Dairesi'
        billingAddress.value = userSession.value.address || 'İsmetpaşa Mah. Büyük Hamam Sok. No:52/1'
        billingPhone.value = userSession.value.phone || '0850 840 86 95'
        billingEmail.value = userSession.value.email || 'ihalecib@gmail.com'
      }
    } catch (e) {
      console.error('Failed to load user session', e)
    }

    if (route.query.plan) {
      const planParam = String(route.query.plan).toLowerCase()
      if (planParam.includes('pro') || planParam.includes('enterprise')) {
        toggleCompanyMode(true)
      } else if (planParam.includes('ay') || planParam.includes('mo')) {
        toggleCompanyMode(false)
      }
    }
    if (route.query.mode === 'corporate' || route.query.mode === 'company') {
      toggleCompanyMode(true)
    } else if (route.query.mode === 'individual' || route.query.mode === 'bireysel') {
      toggleCompanyMode(false)
    }
    if (route.query.cycle === 'annual') {
      corporateBillingCycle.value = 'annual'
    }
  }
})

const freeTrialPackage = {
  id: '1-ay-ucretsiz-deneme',
  name: '1 Ay Ücretsiz Lansman Deneme Paketi',
  price: 0,
  monthly: '0,00 ₺ / ay',
  desc: 'Lansmana özel ilk 1 ay boyunca sınırsız ihale açma, teklif verme, ihale ve satın alma ve tüm analiz modülleri %100 ücretsizdir.',
  isTrial: true,
  isPromo: true
}

function startFreeTrial() {
  openCheckout(freeTrialPackage)
}

function selectCorporatePackage(tier: any) {
  if (tier.isFree) {
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('userSession') || '{}')
      current.isPremium = false
      current.subscriptionPlan = tier.name
      localStorage.setItem('userSession', JSON.stringify(current))
    }
    alert('Standart planınız başarıyla tanımlanmıştır. Tüm açık ihalelere ücretsiz katılabilir ve teklif verebilirsiniz.')
    return
  }

  const isAnnual = corporateBillingCycle.value === 'annual'
  const pkgToCheckout = {
    id: isAnnual ? `${tier.id}-annual` : `${tier.id}-monthly`,
    name: isAnnual ? `${tier.name} (12 Aylık Yıllık)` : `${tier.name} (Aylık)`,
    price: isAnnual ? tier.annualPrice : tier.monthlyPrice,
    monthly: isAnnual ? `₺${Math.round(tier.annualPrice / 12).toLocaleString('tr-TR')},00 / ay` : `₺${tier.monthlyPrice.toLocaleString('tr-TR')},00 / ay`,
    desc: tier.desc,
    isPromo: tier.isPopular
  }
  openCheckout(pkgToCheckout)
}

function openCheckout(pkg: any) {
  selectedPackage.value = pkg
  if (paymentRegion.value === 'domestic') {
    activePaymentChannel.value = 'paynkolay'
  } else {
    activePaymentChannel.value = 'stripe'
  }
  showSuccessScreen.value = false
  isCheckoutOpen.value = true
}

function handlePayment() {
  if (!preInfoApproved.value || !distanceSalesApproved.value || !refundPolicyApproved.value) {
    alert(locale.value === 'tr' ? 'Lütfen Ön Bilgilendirme Formu, Mesafeli Satış Sözleşmesi ve İptal/İade Koşullarını onaylayınız.' : 'Please accept all legal agreements and distance sales terms.')
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
      current.trialExpiresAt = '28 Eylül 2026'
      current.billingInfo = {
        title: billingCompanyTitle.value,
        taxNo: billingTaxNo.value,
        taxOffice: billingTaxOffice.value,
        address: billingAddress.value,
        city: billingCity.value,
        district: billingDistrict.value,
        phone: billingPhone.value,
        email: billingEmail.value
      }
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
          {{ 'Alıcılar için %0 komisyon ile sınırsız ihale açma, tedarikçiler için şeffaf paketler ve yalnızca ihale kazanıldığında net %4 Escrow altyapı güvencesi.' }}
        </p>

        <!-- MARKET REGION TOGGLE SWITCH -->
        <div class="pt-4 flex items-center justify-center">
          <div class="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex gap-2">
            <button 
              @click="paymentRegion = 'domestic'"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
              :class="paymentRegion === 'domestic' ? 'bg-[#0F223D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
            >
              <span class="text-base">🇹🇷</span>
              <span>{{ 'Yurt İçi Ödeme (Türkiye / ₺ TRY)' }}</span>
            </button>

            <button 
              @click="paymentRegion = 'international'"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
              :class="paymentRegion === 'international' ? 'bg-[#0F223D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'"
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

      <!-- 1-MONTH FREE TRIAL LAUNCH BANNER -->
      <div class="rounded-3xl border border-emerald-500/40 bg-[#0F223D] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-left">
        <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-[#1EAE4C]/10 rounded-full blur-3xl"></div>
        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1EAE4C]/20 text-[#1EAE4C] text-[10px] font-black uppercase tracking-widest border border-[#1EAE4C]/30">
              <Sparkles :size="13" />
              <span>LANSMANA ÖZEL: 1 AY BOYUNCA %100 ÜCRETSİZ DENEME SÜRECİ</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              İlk 1 Ay Boyunca Hiçbir Ücret Ödemeden Tüm Sistemi Kullanın!
            </h2>
            <p class="text-xs text-slate-300 leading-relaxed font-medium">
              İhaleciBurada platform lansmanına özel olarak tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca ihale açma, teklif verme, canlı tersine eksiltme ve tüm analiz modülleri <strong>0 ₺</strong> bedelle sunulmaktadır. Kredi kartı gerekmez, 0 komisyon, anında koşulsuz aktivasyon.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-emerald-300 font-bold">
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-[#1EAE4C]" /> 1 Ay Boyunca 0 ₺</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-[#1EAE4C]" /> Kredi Kartı İstemez</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-[#1EAE4C]" /> Sınırsız İhale & Eksiltme</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-[#1EAE4C]" /> Anında Aktivasyon</span>
            </div>
          </div>

          <!-- Free Trial CTA Button -->
          <div class="shrink-0 w-full lg:w-auto">
            <button
              @click="openCheckout({
                id: '1-ay-ucretsiz-deneme',
                name: '1 AY ÜCRETSİZ KURUMSAL DENEME',
                price: 0,
                isTrial: true,
                desc: 'Lansmana özel 1 ay sınırsız ihale ve ihale ve satın alma erişimi.'
              })"
              class="w-full lg:w-auto px-8 py-4 rounded-2xl bg-[#1EAE4C] hover:bg-[#188C3D] text-white font-black text-sm transition-all shadow-xl shadow-[#1EAE4C]/30 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span>1 Ay Ücretsiz Başlat</span>
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- PACKAGE SELECTION BLOCK -->
      <div v-if="paymentRegion === 'domestic'" class="space-y-6 pt-2">
        
        <!-- Mode Switcher: Bireysel Hesap (Abonelik Paketleri) vs Kurumsal Firma Modu (Kurumsal Fiyatlar) -->
        <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300">
          <div class="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span 
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                  :class="isCompanyMode ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'"
                >
                  <Building2 v-if="isCompanyMode" :size="13" class="text-emerald-600" />
                  <User v-else :size="13" class="text-blue-600" />
                  <span>{{ isCompanyMode ? 'FİRMA MODU AKTİF' : 'BİREYSEL HESAP MODU' }}</span>
                </span>
                <span class="text-xs text-slate-400 font-medium">• Kolay Geçişli</span>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Building2 v-if="isCompanyMode" class="text-emerald-600" :size="22" />
                <Award v-else class="text-blue-600" :size="22" />
                <span>{{ isCompanyMode ? 'Kurumsal Firma Fiyatlandırması & Tedarikçi Planları' : 'Bireysel İhale Abonelik Sistemi (1 - 12 Ay)' }}</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl">
                {{ isCompanyMode 
                  ? 'Firma moduna özel %2.5 ve %1.5 indirimli komisyon oranları, Mavi Kalkan kurumsal rozeti, çoklu kullanıcı ve ERP API entegrasyonu.' 
                  : 'Bireysel kullanıcılara özel 1 aydan 12 aya kadar süreli ihale arama, teklif verme ve satın alma abonelik paketleri.' 
                }}
              </p>
            </div>

            <!-- Geçişli Mod Butonları -->
            <div class="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 inline-flex items-center gap-1.5 shrink-0 w-full md:w-auto justify-center">
              <button
                type="button"
                @click="toggleCompanyMode(false)"
                class="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                :class="!isCompanyMode ? 'bg-[#0F223D] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
              >
                <User :size="15" :class="!isCompanyMode ? 'text-blue-400' : 'text-slate-500'" />
                <span>👤 Bireysel Abonelik</span>
              </button>
              <button
                type="button"
                @click="toggleCompanyMode(true)"
                class="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                :class="isCompanyMode ? 'bg-[#0F223D] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
              >
                <Building2 :size="15" :class="isCompanyMode ? 'text-emerald-400' : 'text-slate-500'" />
                <span>🏢 Kurumsal Firma Modu</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 1. VIEW: KURUMSAL FİRMA FİYATLARI (SADECE FİRMA MODU AKTİFKEN AÇIĞA ÇIKAR) -->
        <div v-if="isCompanyMode" class="space-y-6 animate-fadeIn">
          
          <!-- Corporate Billing Cycle (Aylık vs 12 Ay Peşin) -->
          <div class="flex justify-center pt-1">
            <div class="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold items-center gap-1">
              <button
                type="button"
                @click="corporateBillingCycle = 'monthly'"
                class="px-4 py-1.5 rounded-lg transition cursor-pointer"
                :class="corporateBillingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
              >
                Aylık Faturalandırma
              </button>
              <button
                type="button"
                @click="corporateBillingCycle = 'annual'"
                class="px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                :class="corporateBillingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
              >
                <span>Yıllık Peşin (12 Ay)</span>
                <span class="text-[10px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">%17 Ek İndirim</span>
              </button>
            </div>
          </div>

          <!-- 2 Dark Obsidian Corporate Cards (Standart Ücretsiz Kartı Kaldırıldı) -->
          <div class="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
            <div 
              v-for="tier in corporatePackages" 
              :key="tier.id"
              class="rounded-3xl p-7 sm:p-8 border transition-all flex flex-col justify-between shadow-2xl relative"
              :class="tier.isPopular 
                ? 'border-emerald-500/60 bg-[#0B132B] text-white ring-2 ring-emerald-500/30' 
                : 'border-slate-800 bg-[#0F172A] text-white'"
            >
              <!-- Popüler Rozeti -->
              <div v-if="tier.isPopular" class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                EN POPÜLER KURUMSAL PLAN
              </div>

              <div>
                <div class="flex items-center justify-between mb-4 gap-2">
                  <h3 class="text-lg font-black text-white">{{ tier.name }}</h3>
                  <span class="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                    {{ tier.badge }}
                  </span>
                </div>

                <div class="my-4 py-4 border-y border-slate-800">
                  <div class="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    <template v-if="corporateBillingCycle === 'annual'">
                      {{ tier.annualPrice.toLocaleString('tr-TR') }} ₺
                      <span class="text-xs text-slate-400 font-normal">/ yıl</span>
                    </template>
                    <template v-else>
                      {{ tier.monthlyPrice.toLocaleString('tr-TR') }} ₺
                      <span class="text-xs text-slate-400 font-normal">/ ay</span>
                    </template>
                  </div>
                  <div class="text-xs text-emerald-400 font-medium mt-1.5">
                    <template v-if="corporateBillingCycle === 'annual'">
                      Aylık efektif maliyet: {{ Math.round(tier.annualPrice / 12).toLocaleString('tr-TR') }} ₺ (%17 ek tasarruf)
                    </template>
                    <template v-else>
                      Yıllık peşin: {{ tier.annualPrice.toLocaleString('tr-TR') }} ₺ (%17 ek indirim)
                    </template>
                  </div>
                  <p class="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {{ tier.desc }}
                  </p>
                </div>

                <!-- Features Checklist -->
                <div class="space-y-3 pt-2 text-xs">
                  <div v-for="(feat, idx) in tier.features" :key="idx" class="flex items-start gap-2.5 text-slate-300">
                    <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
                    <span class="leading-relaxed">{{ feat }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Button Bar -->
              <div class="pt-6 mt-6 border-t border-slate-800">
                <button
                  type="button"
                  @click="selectCorporatePackage(tier)"
                  class="w-full py-4 px-4 rounded-xl text-center text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02]"
                  :class="tier.isPopular ? 'bg-[#1EAE4C] hover:bg-[#188C3D] text-white shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white'"
                >
                  <span>{{ 'Bu Kurumsal Pakete Geç' }}</span>
                  <ArrowRight :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- Kurumsaldan Bireysele Hızlı Geçiş Kutusu -->
          <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-xs text-slate-600 font-medium">Bireysel dönemsel ihale paketlerini mi arıyorsunuz?</span>
            <button
              type="button"
              @click="toggleCompanyMode(false)"
              class="text-xs font-black text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer"
            >
              <span>Bireysel Abonelik Paketlerine Dön</span>
              <ArrowRight :size="12" />
            </button>
          </div>
        </div>

        <!-- 2. VIEW: BİREYSEL ABONELİK SİSTEMİ (SADECE BİREYSEL MODDA AÇIĞA ÇIKAR; KURUMSALA GEÇİNCE KALDIRILIR) -->
        <div v-else class="space-y-6 animate-fadeIn">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="pkg in domesticPackages" 
              :key="pkg.id" 
              class="border rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl shadow-sm relative group"
              :class="pkg.isPromo ? 'border-[#1EAE4C] ring-2 ring-[#1EAE4C]/30' : 'border-slate-200'"
            >
              <!-- Promo Tag -->
              <div v-if="pkg.isPromo" class="bg-[#1EAE4C] text-white font-black text-[9px] uppercase tracking-widest text-center py-1.5">
                ⚡ {{ 'EN ÇOK TERCİH EDİLEN POPÜLER PLAN' }}
              </div>
              <div v-else class="bg-[#0F223D] text-white font-bold text-[9px] uppercase tracking-widest text-center py-1.5">
                {{ pkg.id === '12-ay-tr' ? 'YILLIK AVANTAJ' : 'BİREYSEL KULLANIM' }}
              </div>
              
              <!-- Price & Title Content Area -->
              <div class="p-6 text-center flex-grow flex flex-col justify-between bg-white">
                <div>
                  <h3 class="text-xs font-black text-slate-900 uppercase tracking-tight">{{ pkg.name }}</h3>
                  <div class="text-3xl font-black tracking-tight font-mono text-slate-900 mt-4">
                    {{ currencySymbol }}{{ pkg.price.toLocaleString('tr-TR') }}
                  </div>
                  <div class="text-[11px] text-[#003057] font-bold mt-1 bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
                    {{ pkg.monthly }}
                  </div>
                </div>
                
                <p class="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[50px]">
                  {{ pkg.desc }}
                </p>
              </div>

              <!-- Action Button Bar -->
              <div class="p-5 bg-slate-50/80 border-t border-slate-100">
                <button 
                  type="button"
                  @click="openCheckout(pkg)"
                  class="w-full text-center rounded-xl font-black text-xs py-3.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                  :class="pkg.isPromo ? 'bg-[#1EAE4C] hover:bg-[#188C3D] text-white shadow-[#1EAE4C]/20' : 'bg-[#0F223D] hover:bg-[#003057] text-white'"
                >
                  <span>{{ 'HEMEN ABONE OL' }}</span>
                  <ArrowRight :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- Bireyselden Kurumsala Hızlı Geçiş Kutusu -->
          <div class="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-left">
              <span class="text-xs font-bold text-emerald-900 block">Şirket veya Kurumsal Tedarikçi misiniz?</span>
              <span class="text-[11px] text-emerald-700">Firma moduna geçerek indirimli %1.5 / %2.5 komisyonlu kurumsal fiyatları inceleyin.</span>
            </div>
            <button
              type="button"
              @click="toggleCompanyMode(true)"
              class="px-4 py-2 rounded-xl bg-[#0F223D] hover:bg-[#003057] text-white text-xs font-black transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <span>🏢 Firma Moduna Geç</span>
              <ArrowRight :size="12" />
            </button>
          </div>
        </div>

      </div>

      <!-- INTERNATIONAL GLOBAL PACKAGES -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        <div 
          v-for="pkg in activePackages" 
          :key="pkg.id" 
          class="border rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl shadow-sm relative group"
          :class="pkg.isPromo ? 'border-[#1EAE4C] ring-2 ring-[#1EAE4C]/30' : 'border-slate-200'"
        >
          <div v-if="pkg.isPromo" class="bg-[#1EAE4C] text-white font-black text-[9px] uppercase tracking-widest text-center py-1.5">
            ⚡ {{ 'MOST POPULAR GLOBAL PLAN' }}
          </div>
          <div v-else class="bg-[#0F223D] text-white font-bold text-[9px] uppercase tracking-widest text-center py-1.5">
            {{ 'GLOBAL ACCESS' }}
          </div>
          
          <div class="p-6 text-center flex-grow flex flex-col justify-between bg-white">
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-tight">{{ pkg.name }}</h3>
              <div class="text-3xl font-black tracking-tight font-mono text-slate-900 mt-4">
                {{ currencySymbol }}{{ pkg.price.toLocaleString('tr-TR') }}
              </div>
              <div class="text-[11px] text-[#003057] font-bold mt-1 bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
                {{ pkg.monthly }}
              </div>
            </div>
            
            <p class="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[50px]">
              {{ pkg.desc }}
            </p>
          </div>

          <div class="p-5 bg-slate-50/80 border-t border-slate-100">
            <button 
              type="button"
              @click="openCheckout(pkg)"
              class="w-full text-center rounded-xl font-black text-xs py-3.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              :class="pkg.isPromo ? 'bg-[#1EAE4C] hover:bg-[#188C3D] text-white shadow-[#1EAE4C]/20' : 'bg-[#0F223D] hover:bg-[#003057] text-white'"
            >
              <span>{{ 'SUBSCRIBE NOW' }}</span>
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
          <p class="text-xs text-slate-500 mt-0.5">{{ 'Alıcılar için her zaman %0 Komisyon; tedarikçiler için yalnızca teslimat onayında %4 Escrow altyapı bedeli.' }}</p>
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
                    <h4 class="text-sm font-black text-slate-900">1 Ay Koşulsuz Ücretsiz Deneme</h4>
                    <p class="text-xs text-emerald-800 font-medium">Kredi kartı gerekmez, 0 ₺ ücret!</p>
                  </div>
                </div>
                <hr class="border-emerald-200/60" />
                <ul class="space-y-2 text-xs text-slate-700 font-medium">
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> Sınırsız B2B İhale Açma & İhale ve Satın Alma</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> Doğrulanmış Firmalardan Belgeli Teklif Toplama</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> 1 Ay Boyunca %0 Komisyon, 0 ₺ Bedel</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-emerald-600 shrink-0" /> 25 Eylül 2026 Tarihine Kadar Tam Erişim</li>
                </ul>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Ödenecek Tutar:</span>
                <span class="text-base font-black text-emerald-600">0,00 ₺ (Ücretsiz)</span>
              </div>
            </div>

            <!-- PAID SCREEN (PAYNKOLAY FULL COMPLIANCE) -->
            <div v-else-if="!showSuccessScreen" class="space-y-5 text-left">
              
              <!-- Order Summary & Tax Breakdown Box -->
              <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                <div class="flex items-center justify-between text-slate-700">
                  <span>Seçilen Paket / Hizmet:</span>
                  <strong class="text-slate-900">{{ selectedPackage?.name }}</strong>
                </div>
                <div class="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Net Hizmet Tutarı:</span>
                  <span>{{ currencySymbol }}{{ ((selectedPackage?.price || 0) / 1.2).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Hesaplanan KDV (%20):</span>
                  <span>{{ currencySymbol }}{{ ((selectedPackage?.price || 0) - ((selectedPackage?.price || 0) / 1.2)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="pt-2 border-t border-blue-200 flex items-center justify-between font-black text-sm text-blue-950">
                  <span>Ödenecek Toplam Tutar:</span>
                  <span>{{ currencySymbol }}{{ (selectedPackage?.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
              </div>

              <!-- Corporate Billing Information Box -->
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Building :size="12" class="text-blue-600" />
                    FATURA VE VERGİ BİLGİLERİ
                  </span>
                  <span class="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Otomatik E-Fatura
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">Firma Unvanı *</label>
                    <input v-model="billingCompanyTitle" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="Şirket Tam Unvanı" />
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">Vergi No / TCKN *</label>
                    <input v-model="billingTaxNo" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="10 haneli VKN veya 11 haneli TCKN" />
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">Vergi Dairesi *</label>
                    <input v-model="billingTaxOffice" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="Vergi Dairesi Adı" />
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">Şehir & İlçe *</label>
                    <div class="grid grid-cols-2 gap-1">
                      <input v-model="billingCity" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="İl" />
                      <input v-model="billingDistrict" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="İlçe" />
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] text-slate-500 font-semibold mb-0.5">Fatura Adresi *</label>
                    <input v-model="billingAddress" type="text" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-blue-500 bg-white" placeholder="Açık adres (Cadde, Mahalle, Kapı No)" />
                  </div>
                </div>
              </div>
              
              <!-- Payment Channels Switcher -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {{ 'GÜVENLİ ÖDEME ALTYAPISI SEÇİN' }}
                </label>
                
                <!-- Domestic Gateways -->
                <div v-if="paymentRegion === 'domestic'" class="grid grid-cols-2 gap-2">
                  <button 
                    @click="activePaymentChannel = 'paynkolay'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'paynkolay' ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  >
                    <CreditCard :size="16" />
                    <span class="text-[10px]">Paynkolay 3D Secure</span>
                  </button>

                  <button 
                    @click="activePaymentChannel = 'bank_transfer'"
                    class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1 cursor-pointer"
                    :class="activePaymentChannel === 'bank_transfer' ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
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
              <div v-if="activePaymentChannel !== 'bank_transfer' && activePaymentChannel !== 'swift'" class="space-y-3">
                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-1">{{ 'Kart Üzerindeki İsim Soyisim' }}</label>
                  <input v-model="cardName" type="text" placeholder="Ahmet Yılmaz" class="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-none" />
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-1">{{ 'Kart Numarası (Tüm Yerli ve Yabancı Kartlar)' }}</label>
                  <input v-model="cardNumber" type="text" placeholder="5400 0000 0000 0000" class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 mb-1">{{ 'Son Kullanma (AA/YY)' }}</label>
                    <input v-model="cardExpiry" type="text" placeholder="12/28" class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 mb-1">Güvenlik Kodu (CVC / CVV)</label>
                    <input v-model="cardCvc" type="text" placeholder="888" class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-blue-600 focus:outline-none" />
                  </div>
                </div>

                <!-- 3D Secure Trust Note -->
                <div class="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 font-medium">
                  <ShieldCheck :size="15" class="text-emerald-600 shrink-0" />
                  <span>İşleminiz bankanızın SMS 3D Secure onay sayfası üzerinden 256-Bit SSL ile güvenle tamamlanacaktır.</span>
                </div>
              </div>

              <!-- Bank Transfer (Domestic) -->
              <div v-else-if="activePaymentChannel === 'bank_transfer'" class="space-y-3">
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <div class="font-bold text-slate-800">Garanti BBVA TR — Hasan Hüseyin Yıldırım (İhaleciBurada)</div>
                  <div class="font-mono text-blue-700 font-bold select-all text-[11px]">TR91 0006 2000 0001 2345 6789 99</div>
                  <div class="text-[10px] text-slate-500">Açıklama alanına firmanızın vergi numarasını veya unvanını yazınız.</div>
                </div>
              </div>

              <!-- SWIFT Wire Transfer (International) -->
              <div v-else-if="activePaymentChannel === 'swift'" class="space-y-3">
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
                {{ selectedPackage?.isTrial ? '🎉 1 Aylık Ücretsiz Denemeniz Aktif!' : 'Abonelik ve Ödeme İşlemi Başarılı!' }}
              </h3>
              <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {{ selectedPackage?.isTrial 
                  ? '1 ay boyunca tüm kurumsal B2B ihale ve ihale ve satın alma modüllerini 0 ₺ bedelle sınırsız kullanabilirsiniz.'
                  : 'Ödemeniz Paynkolay onayından geçti. E-Faturanız oluşturuldu ve kurumsal panel erişiminiz anında aktifleştirildi.' 
                }}
              </p>
            </div>

          </div>

          <!-- Modal Footer with Paynkolay Required Checkboxes -->
          <div class="p-5 bg-slate-50 border-t border-slate-100 space-y-3 text-left">
            <div v-if="!showSuccessScreen" class="space-y-2 text-[10px] text-slate-600 font-medium">
              <!-- Checkbox 1: Mesafeli Satış & Abonelik Sözleşmesi (Ön Bilgilendirme ve İptal/İade Dahil) -->
              <div class="flex items-start gap-2">
                <input v-model="distanceSalesApproved" type="checkbox" id="modal-distance-check" class="mt-0.5 rounded border-slate-300 text-blue-600 cursor-pointer" />
                <label for="modal-distance-check" class="cursor-pointer">
                  <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" target="_blank" class="text-blue-600 underline font-bold">
                    Mesafeli Satış, Ön Bilgilendirme ve İptal/İade Sözleşmesi
                  </NuxtLink>'ni okudum ve tüm şartları onaylıyorum.
                </label>
              </div>

              <!-- Checkbox 2: Gizlilik ve KVKK Aydınlatma Metni -->
              <div class="flex items-start gap-2">
                <input v-model="preInfoApproved" type="checkbox" id="modal-privacy-check" class="mt-0.5 rounded border-slate-300 text-blue-600 cursor-pointer" />
                <label for="modal-privacy-check" class="cursor-pointer">
                  <NuxtLink to="/sozlesmeler?tab=gizlilik" target="_blank" class="text-blue-600 underline font-bold">
                    Gizlilik Politikası ve KVKK Aydınlatma Metni
                  </NuxtLink>'ni okudum ve kabul ediyorum.
                </label>
              </div>
            </div>

            <!-- Payment Brand Trust Badges Strip -->
            <div v-if="!showSuccessScreen" class="pt-2 border-t border-slate-200/60 flex items-center justify-center">
              <PaymentBadges />
            </div>

            <button 
              v-if="!showSuccessScreen"
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full py-3.5 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              :class="selectedPackage?.isTrial ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-900 hover:bg-blue-950'"
            >
              <span v-if="isProcessing">{{ selectedPackage?.isTrial ? 'Deneme Aktifleştiriliyor...' : '3D Secure Doğrulanıyor...' }}</span>
              <span v-else-if="selectedPackage?.isTrial">{{ '1 AYLIK ÜCRETSİZ DENEMEYİ HEMEN BAŞLAT (0 ₺)' }}</span>
              <span v-else>{{ currencySymbol }}{{ selectedPackage?.price.toLocaleString('tr-TR') }} {{ 'Güvenli 3D Ödeme Yap' }}</span>
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

