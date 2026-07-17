<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ArrowRight, ShieldCheck, CreditCard, Building, CheckCircle, X, ShoppingCart, Lock, Sparkles, Building2, Eye, Laptop, Camera, Video, AlertCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const router = useRouter()

// Pricing Packages from Screenshot
const subscriptionPackages = ref([
  { 
    id: 'temel', 
    name: 'Temel', 
    badge: 'TEDARİKÇİ TABANI',
    price: 5000, 
    monthly: '₺417,00 / ay',
    desc: 'Tüm segmentlerde pasif ilan, genel teklif girişi.',
    features: [
      '1 segmentte teklif erişimi',
      'Sınırsız teklif verme ve katılım',
      'Firma vitrininde temel görünürlük'
    ]
  },
  { 
    id: 'profesyonel', 
    name: 'Profesyonel', 
    badge: 'ALICI EKİP AKSİYONU',
    isPromo: true,
    price: 8000,
    monthly: '₺667,00 / ay',
    desc: 'Yılda max 36 ihale açın, tüm pazarlara kapasite arttırın.',
    features: [
      'Aylık 3 - yıllık 36 ihale açma hakkı',
      '3 segmentte yayın ve teklif akışı',
      'Ek ihale paketleriyle kapasite arttırımı'
    ]
  },
  { 
    id: 'kurumsal', 
    name: 'Kurumsal', 
    badge: 'ÇOK EKİPLİ OPERASYON',
    price: 15000, 
    monthly: '₺1.250,00 / ay',
    desc: 'Sınırsız kapasite, ekip yönetimi ve özel destek kurumsal güç.',
    features: [
      'Sınırsız ihale açma ve yönetim',
      'Ekip yönetimi ve eş zamanlı ihale oturumları',
      'Öncelikli firma görünürlüğü ve doğrulanmış kimlik etiketi'
    ]
  }
])

// Interactive States
const selectedPackage = ref<typeof subscriptionPackages.value[0] | null>(null)
const isCheckoutOpen = ref(false)
const activePaymentMethod = ref<'paytr' | 'iyzigo' | 'bank_transfer'>('paytr')

// Payment Form Fields
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const selectedBank = ref('garanti')
const transferName = ref('')

const isProcessing = ref(false)
const showSuccessScreen = ref(false)

// Calculated Values
const vatAmount = computed(() => {
  if (!selectedPackage.value) return 0
  if (selectedPackage.value.price === 0) return 0
  return Math.round(selectedPackage.value.price * 0.20) // 20% tax on top
})

const netAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return selectedPackage.value.price
})

const totalAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return netAmount.value + vatAmount.value
})

function openCheckout(pkg: typeof subscriptionPackages.value[0]) {
  selectedPackage.value = pkg
  isCheckoutOpen.value = true
  showSuccessScreen.value = false
  isProcessing.value = false
}

function handlePayment() {
  if (selectedPackage.value?.price === 0) {
    // Free launch package directly registers
    isProcessing.value = true
    setTimeout(() => {
      isProcessing.value = false
      showSuccessScreen.value = true
      upgradeSession()
    }, 1000)
    return
  }

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

  // Simulate gateway request
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
}

function completeCheckout() {
  isCheckoutOpen.value = false
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-left">
    <div class="max-w-7xl mx-auto space-y-12">
      
      <!-- HEADER -->
      <div>
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">ÜYELİK PAKETLERİ</span>
        <h1 class="text-3xl font-black text-slate-800 mt-1" style="color: #0F172A;">Şeffaf Fiyat, Net Erişim</h1>
        <p class="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Temel plan teklif veren firmalar, Profesyonel plan ihale açan alıcı ekipler, Kurumsal plan ise çok ekipli operasyonlar için konumlanır. Tüm fiyatlar yıllık ve KDV hariçtir.
        </p>
      </div>

      <!-- Horizontal Lanse Card (Screenshot middle segment) -->
      <div class="rounded-2xl border border-blue-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1 text-[8px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1.5 rounded-lg shrink-0">DESTEK TALEBİ AÇIK</span>
          <div>
            <h4 class="text-xs font-bold text-slate-800">Profesyonel plan ile ihalelerinizi kolayca yönetin.</h4>
            <p class="text-[10px] text-slate-400 mt-0.5">İhale açmak ve tedarikçileri tek panelde toplamak isteyen ekipler için en ideal başlangıç yolu.</p>
          </div>
        </div>
        <button 
          type="button" 
          @click="router.push('/uyelik?tab=register&role=buyer')"
          class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition shrink-0 shadow-sm"
        >
          Kurumsal hesap aç ->
        </button>
      </div>

      <!-- The Three Side-by-Side Plans Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Loop over packages -->
        <div 
          v-for="pkg in subscriptionPackages"
          :key="pkg.id"
          class="rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md animate-fadeIn"
          :class="pkg.isPromo ? 'border-blue-300 ring-2 ring-blue-500/5 relative scale-102 shadow-md' : 'border-slate-200'"
        >
          <!-- Selected badge on top for promo -->
          <span v-if="pkg.isPromo" class="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full">POPÜLER</span>

          <div class="space-y-5">
            <div>
              <span class="text-[8px] font-black text-slate-300 uppercase tracking-wider block">{{ pkg.badge }}</span>
              <h4 class="text-base font-black text-slate-800 mt-1.5">{{ pkg.name }}</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">{{ pkg.desc }}</p>
            </div>
            
            <div>
              <!-- Old price display -->
              <div v-if="pkg.oldPrice" class="text-xs text-slate-300 font-bold line-through">
                ₺{{ pkg.oldPrice.toLocaleString('tr-TR') }},00
              </div>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-3xl font-black text-slate-800">{{ pkg.price === 0 ? 'Ücretsiz' : `₺${pkg.price.toLocaleString('tr-TR')},00` }}</span>
                <span class="text-[9px] text-slate-400 font-bold" v-if="pkg.price > 0">/ yıl + KDV</span>
                <span class="text-[9px] text-slate-400 font-bold" v-else>lansman erişimi</span>
              </div>
            </div>
            
            <!-- Monthly Equivalent Pill -->
            <div>
              <span 
                class="inline-block text-[9px] font-bold px-2.5 py-1 rounded"
                :class="pkg.isPromo ? 'text-blue-700 bg-blue-50 border border-blue-100' : 'text-slate-500 bg-slate-50 border border-slate-100'"
              >
                {{ pkg.price === 0 ? 'LANSMANA ÖZEL' : `Aylık karşılığı: ${pkg.monthly}` }}
              </span>
            </div>

            <!-- Promo Text Block -->
            <p v-if="pkg.promoText" class="text-[9px] text-slate-400 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100">
              {{ pkg.promoText }}
            </p>
            
            <hr class="border-slate-100" />
            
            <!-- Features list -->
            <ul class="space-y-3 text-[10px] font-bold text-slate-600">
              <li v-for="feat in pkg.features" :key="feat" class="flex items-start gap-2">
                <Check :size="12" class="text-blue-600 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>
          
          <div class="pt-6">
            <button 
              type="button" 
              @click="openCheckout(pkg)"
              class="w-full text-center rounded-xl font-bold text-xs py-3 transition shadow-sm"
              :class="pkg.isPromo ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'"
            >
              Hemen Başla ->
            </button>
          </div>
        </div>

      </div>

      <!-- Bottom banner -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs text-xs font-bold text-slate-500">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>Ticari ekosistem erişimi ile tedarik ağınızı genişletin. Tüm planlar KVKK ilkeleri ve ticari denetim süreçlerine göre işletilir.</span>
        </div>
        <button 
          type="button" 
          @click="router.push('/uyelik?tab=register&role=buyer')"
          class="text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          Kurumsal Hesap aç ->
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
              <ShoppingCart :size="18" class="text-blue-600" />
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
                    <span class="text-base font-black text-slate-900 font-mono">₺{{ selectedPackage?.price.toLocaleString('tr-TR') }} <span class="text-[10px] text-slate-500 font-bold">+KDV</span></span>
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
                    <span>KDV (%20):</span>
                    <span class="font-mono">₺{{ vatAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                  <div class="flex justify-between text-slate-800 font-bold border-t border-slate-200/60 pt-1.5 mt-1.5">
                    <span>Toplam Ödeme:</span>
                    <span class="font-mono text-blue-600">₺{{ totalAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                </div>
              </div>

              <!-- Lansmana Özel Ücretsiz Package Display -->
              <div v-if="selectedPackage?.price === 0" class="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 space-y-2 text-emerald-800">
                <span class="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">LANSMAN PROMOSYONU</span>
                <h4 class="text-xs font-bold mt-1">Ödeme Yapmanız Gerekmez!</h4>
                <p class="text-[10px] leading-relaxed">Lansman dönemine özel bu paketi hiçbir ücret ödemeden hemen başlatabilir, ihalelerinizi yayına alabilirsiniz.</p>
              </div>

              <!-- Payment Method Tabs for Paid Packages -->
              <div v-else class="space-y-6">
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
                      <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">GA-3M485</span>
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
                    <span class="font-semibold text-slate-800 uppercase" v-if="selectedPackage?.price > 0">{{ activePaymentMethod }} Gateway</span>
                    <span class="font-semibold text-slate-800 uppercase" v-else>Promosyon Aktivasyonu</span>
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
                    <span>Tutar:</span>
                    <span class="font-mono text-blue-600">₺{{ selectedPackage?.price.toLocaleString('tr-TR') }}</span>
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
              class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white shadow-lg transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-600/15 disabled:opacity-50"
            >
              <span v-if="isProcessing">Güvenli Ödeme Doğrulanıyor...</span>
              <span v-else-if="selectedPackage?.price === 0">Ücretsiz Üyeliği Hemen Başlat</span>
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
