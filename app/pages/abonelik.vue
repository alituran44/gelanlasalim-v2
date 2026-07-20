<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ArrowRight, ShieldCheck, CreditCard, Building, CheckCircle, X, ShoppingCart, Lock, Sparkles, Building2, HelpCircle } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, t } from '~/composables/useLocale'

definePageMeta({
  layout: 'public'
})

const router = useRouter()

// Pricing Packages with auto-currency and localizations
const subscriptionPackages = computed(() => {
  if (locale.value === 'en') {
    return [
      { 
        id: '1-ay', 
        name: 'Membership application - 1 month', 
        price: 29, 
        monthly: '$29.00 / month',
        desc: '1 month subscription fee',
        isPromo: false
      },
      { 
        id: '3-ay', 
        name: 'Membership application - 3 months', 
        price: 79, 
        monthly: '$26.33 / month',
        desc: '3 months subscription fee',
        isPromo: true
      },
      { 
        id: '6-ay', 
        name: 'Membership application - 6 months', 
        price: 149, 
        monthly: '$24.83 / month',
        desc: '6 months subscription fee',
        isPromo: false
      },
      { 
        id: '9-ay', 
        name: 'Membership application - 9 months', 
        price: 199, 
        monthly: '$22.11 / month',
        desc: '9 months subscription fee',
        isPromo: false
      }
    ]
  } else {
    return [
      { 
        id: '1-ay', 
        name: 'Üyelik başvurusu - 1 ay', 
        price: 900, 
        monthly: '₺900,00 / ay',
        desc: '1 aylık abonelik bedeli',
        isPromo: false
      },
      { 
        id: '3-ay', 
        name: 'Üyelik başvurusu - 3 ay', 
        price: 1800, 
        monthly: '₺600,00 / ay',
        desc: '3 aylık abonelik bedeli',
        isPromo: true
      },
      { 
        id: '6-ay', 
        name: 'Üyelik başvurusu - 6 ay', 
        price: 2700, 
        monthly: '₺450,00 / ay',
        desc: '6 aylık abonelik bedeli',
        isPromo: false
      },
      { 
        id: '9-ay', 
        name: 'Üyelik başvurusu - 9 ay', 
        price: 3600, 
        monthly: '₺400,00 / ay',
        desc: '9 aylık abonelik bedeli',
        isPromo: false
      }
    ]
  }
})

// Currency symbol selection helper
const currencySymbol = computed(() => locale.value === 'en' ? '$' : '₺')

// Features list from EKAP Screenshot, dynamically translated
const allFeatures = computed(() => [
  // Column 1
  { text: t('feat_ekap_tenders'), col: 1 },
  { text: t('feat_ekap_results'), col: 1 },
  { text: t('feat_direct_proc'), col: 1 },
  { text: t('feat_sales_leases'), col: 1 },
  { text: t('feat_limit_calc'), col: 1 },
  // Column 2
  { text: t('feat_search_suggest'), col: 2 },
  { text: t('feat_upcoming_notif'), col: 2 },
  { text: t('feat_won_notif'), col: 2 },
  { text: t('feat_cancel_notif'), col: 2 },
  { text: t('feat_unlimit_notif'), col: 2 },
  { text: t('feat_unlimit_report'), col: 2 },
  // Column 3
  { text: t('feat_contractor_anal'), col: 3 },
  { text: t('feat_admin_anal'), col: 3 },
  { text: t('feat_sector_anal'), col: 3 },
  { text: t('feat_competitor_anal'), col: 3 },
  { text: t('feat_mobile_compat'), col: 3 }
])

// Interactive States
const { cmsData, saveCmsData } = useCmsData()
const userSession = ref<any>({})

const selectedPackage = ref<any>(null)
const isCheckoutOpen = ref(false)
const activePaymentMethod = ref<'paytr' | 'iyzigo' | 'bank_transfer'>('paytr')

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('userSession')
      if (saved) {
        userSession.value = JSON.parse(saved)
        // Auto-fill user's name
        const fullName = (userSession.value.firstName || '') + ' ' + (userSession.value.lastName || '')
        transferName.value = fullName.trim()
        cardName.value = fullName.trim()
      }
    } catch (e) {
      console.error('Failed to load user session', e)
    }
  }
})

// Payment Form Fields
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const selectedBank = ref('garanti')
const transferName = ref('')

const isProcessing = ref(false)
const showSuccessScreen = ref(false)

// Calculated Values (VAT inclusive calculation)
const totalAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return selectedPackage.value.price
})

const vatAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return Math.round(selectedPackage.value.price - (selectedPackage.value.price / 1.2))
})

const netAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return totalAmount.value - vatAmount.value
})

function openCheckout(pkg: typeof subscriptionPackages.value[0]) {
  selectedPackage.value = pkg
  isCheckoutOpen.value = true
  showSuccessScreen.value = false
  isProcessing.value = false
}

function handleRenewalClick() {
  // Trigger checkout for renewal with 3-Month package by default
  openCheckout(subscriptionPackages.value[1])
}

function handlePayment() {
  if (activePaymentMethod.value !== 'bank_transfer') {
    if (!cardName.value || !cardNumber.value || !cardExpiry.value || !cardCvc.value) {
      alert('Lütfen tüm kart bilgilerini doldurun.')
      return
    }
  } else {
    if (!transferName.value) {
      alert('Lütfen havale yapan kişinin adını girin.')
      return
    }
  }

  isProcessing.value = true

  // Simulate payment gateway request
  setTimeout(() => {
    isProcessing.value = false
    showSuccessScreen.value = true
    upgradeSession()
  }, 2000)
}

function upgradeSession() {
  const currentSession = localStorage.getItem('userSession')
  if (currentSession) {
    const parsed = JSON.parse(currentSession)
    parsed.isPremium = true
    parsed.plan = selectedPackage.value?.name || 'Premium Üyelik'
    localStorage.setItem('userSession', JSON.stringify(parsed))
  }

  // Create payment record and save to CMS
  const paymentObj = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    referenceCode: activePaymentMethod.value === 'bank_transfer' ? 'GA-EKAP' : '-',
    userName: activePaymentMethod.value === 'bank_transfer' ? transferName.value : cardName.value,
    companyName: userSession.value.company || 'Bireysel Kullanıcı',
    packageName: selectedPackage.value?.name || 'Üyelik başvurusu - 1 ay',
    amount: `${currencySymbol.value}${totalAmount.value.toLocaleString(locale.value === 'tr' ? 'tr-TR' : 'en-US')}`,
    paymentMethod: activePaymentMethod.value === 'bank_transfer' ? 'Havale/EFT' : (activePaymentMethod.value === 'paytr' ? 'PayTR' : 'iyzigo'),
    status: 'bekliyor',
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  
  if (!cmsData.value.payments) {
    cmsData.value.payments = []
  }
  cmsData.value.payments.unshift(paymentObj)
  saveCmsData(cmsData.value)
}

function completeCheckout() {
  isCheckoutOpen.value = false
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left animate-fadeIn">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- H1 / HEADER BLOCK -->
      <div>
        <h1 class="text-2xl font-black tracking-tight" style="color: #003057; font-family: 'Outfit', sans-serif;">{{ t('pricing_title') }}</h1>
        <p class="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {{ t('pricing_desc') }}
        </p>
      </div>

      <!-- >> ÜYE KAYIT SECTION HEADER -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-md bg-[#003057]/5 border border-[#003057]/10 px-3 py-1.5 text-xs font-black" style="color: #003057; font-family: 'Outfit', sans-serif;">
          &gt;&gt; {{ locale === 'tr' ? 'Üye kayıt' : 'Member signup' }}
        </span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- FOUR COLUMNS PACKAGE GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="pkg in subscriptionPackages" 
          :key="pkg.id" 
          class="border rounded-2xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-lg shadow-sm"
          :style="pkg.isPromo ? 'border-color: #F59E0B; ring: 2px; ring-color: #F59E0B;' : 'border-color: #E2E8F0;'"
        >
          <!-- Package Title Bar -->
          <div class="py-3 px-4 text-center font-bold text-xs text-white uppercase tracking-wider transition-colors relative" :style="pkg.isPromo ? 'background-color: #F59E0B;' : 'background-color: #003057;'">
            {{ pkg.name }}
            <span v-if="pkg.isPromo" class="absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] bg-white font-black text-amber-700">{{ t('pricing_popular') }}</span>
          </div>
          
          <!-- Price Content Area -->
          <div class="p-6 text-center flex-grow flex flex-col justify-center bg-white border-b border-slate-100">
            <div class="text-3xl font-black tracking-tight font-mono text-slate-800">
              {{ currencySymbol }}{{ pkg.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}
            </div>
            <div class="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
              {{ pkg.monthly }}
            </div>
            <p class="text-[10px] text-slate-400 mt-2 leading-relaxed px-2">{{ pkg.desc }}</p>
          </div>

          <!-- Action Button Bar -->
          <div class="p-4 bg-slate-50/50">
            <button 
              @click="openCheckout(pkg)"
              class="w-full text-center rounded-xl font-bold text-xs py-3 transition shadow-xs flex items-center justify-center gap-1.5 text-white animate-pulse"
              :style="pkg.isPromo ? 'background-color: #F59E0B;' : 'background-color: #003057;'"
            >
              {{ t('pricing_select') }} <ArrowRight :size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAX NOTICE BAR -->
      <div class="rounded-xl border border-slate-200 bg-slate-100/50 py-2.5 px-4 text-center text-xs font-bold text-slate-500">
        {{ t('pricing_vat_notice') }}
      </div>

      <!-- >> ÖZELLİKLER SECTION HEADER -->
      <div class="flex items-center gap-2 pt-4">
        <span class="inline-flex items-center rounded-md bg-[#003057]/5 border border-[#003057]/10 px-3 py-1.5 text-xs font-black" style="color: #003057; font-family: 'Outfit', sans-serif;">
          &gt;&gt; {{ locale === 'tr' ? 'Özellikler' : 'Features' }}
        </span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- FEATURES BOX -->
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <!-- Banner Title -->
        <div class="py-2.5 px-4 text-center text-xs font-black tracking-wide text-slate-700 bg-slate-50 border-b border-slate-200">
          {{ t('pricing_features_title') }}
        </div>

        <!-- 3 Column Grid -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <!-- Col 1 -->
          <div class="space-y-3">
            <div v-for="feat in allFeatures.filter(f => f.col === 1)" :key="feat.text" class="flex items-center gap-2">
              <Check :size="14" class="text-emerald-500 shrink-0" />
              <span class="text-xs font-semibold text-slate-700">{{ feat.text }}</span>
            </div>
          </div>
          <!-- Col 2 -->
          <div class="space-y-3">
            <div v-for="feat in allFeatures.filter(f => f.col === 2)" :key="feat.text" class="flex items-center gap-2">
              <Check :size="14" class="text-emerald-500 shrink-0" />
              <span class="text-xs font-semibold text-slate-700">{{ feat.text }}</span>
            </div>
          </div>
          <!-- Col 3 -->
          <div class="space-y-3">
            <div v-for="feat in allFeatures.filter(f => f.col === 3)" :key="feat.text" class="flex items-center gap-2">
              <Check :size="14" class="text-emerald-500 shrink-0" />
              <span class="text-xs font-semibold text-slate-700">{{ feat.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RENEWAL BANNER -->
      <div class="rounded-2xl border border-blue-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs" style="background-color: #E0F2FE;">
        <div>
          <h4 class="text-xs font-bold text-blue-900">{{ t('pricing_renewal') }}</h4>
        </div>
        <button 
          type="button" 
          @click="handleRenewalClick"
          class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 transition shrink-0 shadow-xs flex items-center gap-1.5"
        >
          {{ t('pricing_renewal_btn') }} <ArrowRight :size="14" />
        </button>
      </div>

    </div>

    <!-- Checkout Slide-over Drawer / Modal -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isCheckoutOpen" class="fixed inset-0 z-50 overflow-hidden flex justify-end" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" @click="isCheckoutOpen = false"></div>

        <!-- Panel container -->
        <div class="relative w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition duration-300 ease-in-out h-full border-l border-slate-200">
          
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div class="flex items-center gap-2">
              <ShoppingCart :size="18" class="text-[#003057]" />
              <h2 class="text-sm font-bold text-slate-800">{{ locale === 'tr' ? 'Sipariş & Ödeme Sepeti' : 'Order & Payment Cart' }}</h2>
            </div>
            <button @click="isCheckoutOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
              <X :size="18" />
            </button>
          </div>

          <!-- Checkout Content -->
          <div class="flex-grow overflow-y-auto px-6 py-6 text-left">
            <div v-if="!showSuccessScreen">
              <!-- Order Summary Card -->
              <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 mb-6">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{{ locale === 'tr' ? 'SEÇİLEN PAKET' : 'SELECTED PACKAGE' }}</div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-bold text-slate-800">{{ selectedPackage?.name }}</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5">{{ selectedPackage?.desc }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-base font-black text-slate-900 font-mono">{{ currencySymbol }}{{ selectedPackage?.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
                  </div>
                </div>
                
                <hr class="border-slate-200 my-3" />
                
                <!-- Pricing breakdown -->
                <div class="space-y-1.5 text-xs text-slate-500 font-medium">
                  <div class="flex justify-between">
                    <span>{{ locale === 'tr' ? 'Net Tutar:' : 'Net Amount:' }}</span>
                    <span class="font-mono">{{ currencySymbol }}{{ netAmount.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>{{ locale === 'tr' ? 'KDV (%20 - Dahil):' : 'VAT (20% - Incl.):' }}</span>
                    <span class="font-mono">{{ currencySymbol }}{{ vatAmount.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
                  </div>
                  <div class="flex justify-between text-slate-800 font-bold border-t border-slate-200/60 pt-1.5 mt-1.5">
                    <span>{{ locale === 'tr' ? 'Toplam Ödeme:' : 'Total Payment:' }}</span>
                    <span class="font-mono text-blue-600">{{ currencySymbol }}{{ totalAmount.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Method Tabs -->
              <div class="space-y-6">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{{ locale === 'tr' ? 'ÖDEME KANALI SEÇİN' : 'CHOOSE PAYMENT CHANNEL' }}</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button 
                      @click="activePaymentMethod = 'paytr'"
                      class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1.5"
                      :class="activePaymentMethod === 'paytr' ? 'border-blue-600 bg-blue-50/20 text-blue-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                    >
                      <CreditCard :size="16" />
                      <span class="text-[10px] font-bold">PayTR</span>
                    </button>

                    <button 
                      @click="activePaymentMethod = 'iyzigo'"
                      class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1.5"
                      :class="activePaymentMethod === 'iyzigo' ? 'border-blue-600 bg-blue-50/20 text-blue-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                    >
                      <CreditCard :size="16" />
                      <span class="text-[10px] font-bold">iyzigo</span>
                    </button>

                    <button 
                      @click="activePaymentMethod = 'bank_transfer'"
                      class="flex flex-col items-center justify-center p-3 border rounded-xl transition duration-150 gap-1.5"
                      :class="activePaymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50/20 text-blue-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'"
                    >
                      <Building :size="16" />
                      <span class="text-[10px] font-bold">{{ locale === 'tr' ? 'Havale/EFT' : 'Bank Transfer' }}</span>
                    </button>
                  </div>
                </div>

                <!-- PayTR & iyzigo Card Details Form -->
                <div v-if="activePaymentMethod !== 'bank_transfer'" class="space-y-4">
                  <div class="flex items-center gap-1.5 border border-slate-100 bg-slate-50 p-2.5 rounded-lg mb-2">
                    <Lock :size="14" class="text-emerald-600" />
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                      {{ activePaymentMethod === 'paytr' ? 'PAYTR SECURE GATEWAY' : 'IYZIGO 3D SECURE ENTEGRASYONU' }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kart Üzerindeki İsim</label>
                    <input 
                      v-model="cardName" 
                      type="text" 
                      placeholder="John Doe" 
                      class="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none" 
                    />
                    <div class="text-[10px] text-slate-500 mt-1 font-bold">
                      Kayıtlı Şirket: <span class="text-[#003057] font-black uppercase">{{ userSession?.company || 'Bireysel Kullanıcı' }}</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kart Numarası</label>
                    <input 
                      v-model="cardNumber" 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      class="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none" 
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Son Kullanma (AA/YY)</label>
                      <input 
                        v-model="cardExpiry" 
                        type="text" 
                        placeholder="MM/YY" 
                        class="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">CVC / Güvenlik Kodu</label>
                      <input 
                        v-model="cardCvc" 
                        type="text" 
                        placeholder="123" 
                        class="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <!-- Havale/EFT Details -->
                <div v-else class="space-y-4">
                  <div class="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-800 space-y-2">
                    <div class="font-bold flex items-center gap-1.5">
                      <span>💡 Önemli Bilgi:</span>
                    </div>
                    <p class="leading-relaxed">Havale yaparken açıklama kısmına otomatik üretilecek referans kodunu yazmayı unutmayınız. Ödemeniz onaylandığı an üyeliğiniz başlayacaktır.</p>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Banka Hesabı</label>
                    <select v-model="selectedBank" class="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white">
                      <option value="garanti">Garanti BBVA - GelAnlaşalım A.Ş.</option>
                      <option value="akbank">Akbank - GelAnlaşalım A.Ş.</option>
                      <option value="ziraat">Ziraat Bankası - GelAnlaşalım A.Ş.</option>
                    </select>
                  </div>

                  <div class="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                      <span>IBAN:</span>
                      <span class="font-mono text-slate-800 select-all">TR91 0006 2000 0001 2345 6789 99</span>
                    </div>
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                      <span>Referans Kodu:</span>
                      <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">GA-EKAP</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Gönderen Adı Soyadı</label>
                    <input 
                      v-model="transferName" 
                      type="text" 
                      placeholder="Adınız Soyadınız" 
                      class="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none" 
                    />
                    <div class="text-[10px] text-slate-500 mt-1 font-bold">
                      Kayıtlı Şirket: <span class="text-[#003057] font-black uppercase">{{ userSession?.company || 'Bireysel Kullanıcı' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Success Screen -->
            <div v-else class="h-full flex flex-col items-center justify-center text-center py-12">
              <div class="h-16 w-16 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mb-6">
                <CheckCircle :size="36" />
              </div>
              <h3 class="text-lg font-bold text-slate-800">İşlem Başarılı!</h3>
              <p class="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                Tebrikler, aboneliğiniz başarıyla etkinleştirildi. Artık EKAP ihalelerini ve doğrudan temin tekliflerini kesintisiz yönetebilirsiniz.
              </p>
              
              <div class="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4 w-full">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">İŞLEM MAKBUZU</div>
                <div class="space-y-1.5 text-xs text-slate-600 font-medium text-left mt-3">
                  <div class="flex justify-between">
                    <span>Ödeme Tipi:</span>
                    <span class="font-semibold text-slate-800 uppercase">{{ activePaymentMethod }} Gateway</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Sipariş No:</span>
                    <span class="font-mono text-slate-800 font-bold">ORD-{{ Math.floor(100000 + Math.random() * 900000) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Paket:</span>
                    <span class="font-semibold text-slate-800">{{ selectedPackage?.name }}</span>
                  </div>
                  <div class="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5 text-slate-800 font-bold">
                    <span>{{ locale === 'tr' ? 'Tutar (KDV Dahil):' : 'Amount (VAT Incl.):' }}</span>
                    <span class="font-mono text-[#003057]">{{ currencySymbol }}{{ selectedPackage?.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-6 border-t border-slate-100 bg-slate-50">
            <button 
              v-if="!showSuccessScreen"
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white shadow-lg transition-all disabled:opacity-50"
              style="background-color: #003057;"
            >
              <span v-if="isProcessing">{{ locale === 'tr' ? 'Güvenli Ödeme Doğrulanıyor...' : 'Verifying Secure Payment...' }}</span>
              <span v-else>{{ currencySymbol }}{{ selectedPackage?.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }} {{ locale === 'tr' ? 'Güvenli Ödeme Yap' : 'Pay Securely' }}</span>
              <ArrowRight v-if="!isProcessing" :size="14" />
            </button>
            <button 
              v-else
              @click="completeCheckout"
              class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white shadow-lg transition-all bg-slate-900 hover:bg-slate-800 shadow-slate-900/15"
            >
              {{ locale === 'tr' ? 'Paneli Başlat' : 'Launch Dashboard' }}
              <ArrowRight :size="14" />
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>
