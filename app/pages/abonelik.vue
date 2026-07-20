<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ArrowRight, ShieldCheck, CreditCard, Building, CheckCircle, X, ShoppingCart, Lock, Sparkles, Building2, HelpCircle } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

definePageMeta({
  layout: 'public'
})

const router = useRouter()

// Pricing Packages from EKAP Screenshot
const subscriptionPackages = ref([
  { 
    id: '1-ay', 
    name: 'Üyelik başvurusu - 1 ay', 
    price: 900, 
    monthly: '₺900,00 / ay',
    desc: '1 Aylık kesintisiz EKAP ve ihale izleme üyeliği.',
    isPromo: false
  },
  { 
    id: '3-ay', 
    name: 'Üyelik başvurusu - 3 ay', 
    price: 1800, 
    monthly: '₺600,00 / ay',
    desc: '3 Aylık kesintisiz EKAP ve ihale izleme üyeliği.',
    isPromo: true
  },
  { 
    id: '6-ay', 
    name: 'Üyelik başvurusu - 6 ay', 
    price: 2700, 
    monthly: '₺450,00 / ay',
    desc: '6 Aylık kesintisiz EKAP ve ihale izleme üyeliği.',
    isPromo: false
  },
  { 
    id: '9-ay', 
    name: 'Üyelik başvurusu - 9 ay', 
    price: 3600, 
    monthly: '₺400,00 / ay',
    desc: '9 Aylık kesintisiz EKAP ve ihale izleme üyeliği.',
    isPromo: false
  }
])

// Features list from EKAP Screenshot
const allFeatures = [
  // Column 1
  { text: 'Ekap ihaleleri', col: 1 },
  { text: 'Ekap ihale sonuçları', col: 1 },
  { text: 'Doğrudan teminler', col: 1 },
  { text: 'Satış ve Kiralamalar', col: 1 },
  { text: 'K Kik Kararları', col: 1 },
  { text: 'Sınır değer hesaplama', col: 1 },
  // Column 2
  { text: 'Arama önerileri', col: 2 },
  { text: 'Yaklaşan ihale bildirimleri', col: 2 },
  { text: 'Kazanılan ihale bildirimleri', col: 2 },
  { text: 'İptal-Düzeltme-Sonuç bildirimleri', col: 2 },
  { text: 'Sınırsız bildirim (Sms+Email)', col: 2 },
  { text: 'Sınırsız raporlama (Excel)', col: 2 },
  // Column 3
  { text: 'Yüklenici analizleri', col: 3 },
  { text: 'İdare analizleri', col: 3 },
  { text: 'Sektör analizleri', col: 3 },
  { text: 'Rakip analizleri', col: 3 },
  { text: 'Mobil uyumluluk', col: 3 }
]

// Interactive States
const { cmsData, saveCmsData } = useCmsData()
const userSession = ref<any>({})

const selectedPackage = ref<typeof subscriptionPackages.value[0] | null>(null)
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
    amount: `₺${totalAmount.value.toLocaleString('tr-TR')}`,
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
        <h1 class="text-2xl font-black tracking-tight" style="color: #003057; font-family: 'Outfit', sans-serif;">Platform Üyeliği ve Erişim Paketleri</h1>
        <p class="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          GelAnlaşalım platformunun gelişmiş ihale arama, KİK analizleri ve anlık sms/e-posta bildirim servislerinden yararlanmak için üyeliğinizi hemen başlatın.
        </p>
      </div>

      <!-- >> ÜYE KAYIT SECTION HEADER -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-md bg-[#003057]/5 border border-[#003057]/10 px-3 py-1.5 text-xs font-black" style="color: #003057; font-family: 'Outfit', sans-serif;">
          &gt;&gt; Üye kayıt
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
            <span v-if="pkg.isPromo" class="absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] bg-white font-black text-amber-700">EN POPÜLER</span>
          </div>
          
          <!-- Price Content Area -->
          <div class="p-6 text-center flex-grow flex flex-col justify-center bg-white border-b border-slate-100">
            <div class="text-3xl font-black tracking-tight font-mono text-slate-800">
              ₺{{ pkg.price.toLocaleString('tr-TR') }}
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
              class="w-full text-center rounded-xl font-bold text-xs py-3 transition shadow-xs flex items-center justify-center gap-1.5 text-white"
              :style="pkg.isPromo ? 'background-color: #F59E0B;' : 'background-color: #003057;'"
            >
              Seç <ArrowRight :size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAX NOTICE BAR -->
      <div class="rounded-xl border border-slate-200 bg-slate-100/50 py-2.5 px-4 text-center text-xs font-bold text-slate-500">
        Fiyatlara %20 KDV dahildir.
      </div>

      <!-- >> ÖZELLİKLER SECTION HEADER -->
      <div class="flex items-center gap-2 pt-4">
        <span class="inline-flex items-center rounded-md bg-[#003057]/5 border border-[#003057]/10 px-3 py-1.5 text-xs font-black" style="color: #003057; font-family: 'Outfit', sans-serif;">
          &gt;&gt; Özellikler
        </span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- FEATURES BOX -->
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <!-- Banner Title -->
        <div class="py-2.5 px-4 text-center text-xs font-black tracking-wide text-slate-700 bg-slate-50 border-b border-slate-200">
          Tüm paketler için geçerlidir
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
          <h4 class="text-xs font-bold text-blue-900">Eğer üyeliğiniz varsa aşağıdaki bağlantıya tıklayıp %20 indirimli fiyatlarla üyeliğinizi uzatabilirsiniz.</h4>
        </div>
        <button 
          type="button" 
          @click="handleRenewalClick"
          class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 transition shrink-0 shadow-xs flex items-center gap-1.5"
        >
          Üyelik uzat <ArrowRight :size="14" />
        </button>
      </div>

      <!-- DISCLAIMER TEXT (Kırmızı uyarı yazısı) -->
      <div class="text-center pt-4">
        <p class="text-[10px] font-semibold leading-relaxed max-w-4xl mx-auto text-red-500">
          Bu hizmet Özgürsoft Bilişim A.Ş. tarafından sunulmaktadır. Şirketimizin Kamu İhale Kurumu (EKAP) veya başka bir kamu kurumu ile herhangi bir bağlantısı bulunmamaktadır.
        </p>
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
              <h2 class="text-sm font-bold text-slate-800">Sipariş & Ödeme Sepeti</h2>
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
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">SEÇİLEN PAKET</div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-bold text-slate-800">{{ selectedPackage?.name }}</h3>
                    <p class="text-[11px] text-slate-500 mt-0.5">{{ selectedPackage?.desc }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-base font-black text-slate-900 font-mono">₺{{ selectedPackage?.price.toLocaleString('tr-TR') }}</span>
                  </div>
                </div>
                
                <hr class="border-slate-200 my-3" />
                
                <!-- Pricing breakdown -->
                <div class="space-y-1.5 text-xs text-slate-500 font-medium">
                  <div class="flex justify-between">
                    <span>Net Tutar:</span>
                    <span class="font-mono">₺{{ netAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>KDV (%20 - Dahil):</span>
                    <span class="font-mono">₺{{ vatAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                  <div class="flex justify-between text-slate-800 font-bold border-t border-slate-200/60 pt-1.5 mt-1.5">
                    <span>Toplam Ödeme:</span>
                    <span class="font-mono text-blue-600">₺{{ totalAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Method Tabs -->
              <div class="space-y-6">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">ÖDEME KANALI SEÇİN</label>
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
                      <span class="text-[10px] font-bold">Havale/EFT</span>
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
                    <span>Tutar (KDV Dahil):</span>
                    <span class="font-mono text-[#003057]">₺{{ selectedPackage?.price.toLocaleString('tr-TR') }}</span>
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
              <span v-if="isProcessing">Güvenli Ödeme Doğrulanıyor...</span>
              <span v-else>₺{{ selectedPackage?.price.toLocaleString('tr-TR') }} Güvenli Ödeme Yap</span>
              <ArrowRight v-if="!isProcessing" :size="14" />
            </button>
            <button 
              v-else
              @click="completeCheckout"
              class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white shadow-lg transition-all bg-slate-900 hover:bg-slate-800 shadow-slate-900/15"
            >
              Paneli Başlat
              <ArrowRight :size="14" />
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>
