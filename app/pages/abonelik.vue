<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ArrowRight, ShieldCheck, CreditCard, Building, CheckCircle, X, ShoppingCart, Lock } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const router = useRouter()

// Subscriptions
const subscriptionPackages = [
  { id: '1_ay', name: 'Üyelik başvurusu - 1 ay', price: 900, months: 1 },
  { id: '3_ay', name: 'Üyelik başvurusu - 3 ay', price: 1800, months: 3 },
  { id: '6_ay', name: 'Üyelik başvurusu - 6 ay', price: 2700, months: 6 },
  { id: '9_ay', name: 'Üyelik başvurusu - 9 ay', price: 3600, months: 9 }
]

// Features divided into three columns
const featureColumns = [
  [
    'Ekap ihaleleri',
    'Ekap ihale sonuçları',
    'Doğrudan teminler',
    'Satış ve Kiralamalar',
    'KİK Kararları',
    'Sınır değer hesaplama'
  ],
  [
    'Arama önerileri',
    'Yaklaşan ihale bildirimleri',
    'Kazanılan ihale bildirimleri',
    'İptal-Düzeltme-Sonuç bildirimleri',
    'Sınırsız bildirim (Sms+Email)',
    'Sınırsız raporlama (Excel)'
  ],
  [
    'Yüklenici analizleri',
    'İdare analizleri',
    'Sektör analizleri',
    'Rakip analizleri',
    'Mobil uyumluluk'
  ]
]

// Interactive States
const selectedPackage = ref<typeof subscriptionPackages[0] | null>(null)
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
  return Math.round(selectedPackage.value.price * 0.1667) // 20% included tax formula: Price - (Price / 1.20)
})

const netAmount = computed(() => {
  if (!selectedPackage.value) return 0
  return selectedPackage.value.price - vatAmount.value
})

function openCheckout(pkg: typeof subscriptionPackages[0]) {
  selectedPackage.value = pkg
  isCheckoutOpen.value = true
  showSuccessScreen.value = false
  isProcessing.value = false
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

  // Simulate gateway request
  setTimeout(() => {
    isProcessing.value = false
    showSuccessScreen.value = true

    // Upgrade localStorage user session
    const currentSession = localStorage.getItem('userSession')
    if (currentSession) {
      const parsed = JSON.parse(currentSession)
      parsed.isPremium = true
      parsed.plan = selectedPackage.value?.name || 'Premium Üyelik'
      localStorage.setItem('userSession', JSON.stringify(parsed))
    }
  }, 2000)
}

function completeCheckout() {
  isCheckoutOpen.value = false
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-68px)] bg-slate-50 py-12 px-4 sm:px-6">
    <div class="mx-auto max-w-7xl">
      
      <!-- Section 1: Üye Kayıt -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-10 text-left">
        <!-- Tab Header -->
        <div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-bold text-lg">»</span>
            <h2 class="text-sm font-bold text-slate-800 tracking-wide uppercase">Üye Kayıt</h2>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Abonelik Seçenekleri</span>
        </div>

        <!-- Package Grid -->
        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="pkg in subscriptionPackages" 
              :key="pkg.id" 
              class="border rounded-xl bg-white overflow-hidden transition duration-300 hover:shadow-md flex flex-col justify-between"
              style="border-color: #E2E8F0;"
            >
              <!-- Package Title Bar -->
              <div class="py-3 px-4 text-center font-bold text-xs text-white uppercase tracking-wider" style="background-color: #0D9488;">
                » {{ pkg.name }} «
              </div>
              
              <!-- Content -->
              <div class="p-6 text-center flex-grow flex flex-col justify-center">
                <div class="text-4xl font-black text-slate-800 font-mono tracking-tight">
                  ₺{{ pkg.price.toLocaleString('tr-TR') }}
                </div>
              </div>

              <!-- Button Bar -->
              <div class="p-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  @click="openCheckout(pkg)"
                  class="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  Seç
                  <ArrowRight :size="13" />
                </button>
              </div>
            </div>
          </div>

          <!-- KDV Notice -->
          <div class="mt-6 text-center text-xs font-medium text-slate-500">
            Fiyatlara %20 KDV dahildir.
          </div>
        </div>
      </div>

      <!-- Section 2: Özellikler -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-10 text-left">
        <!-- Tab Header -->
        <div class="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-bold text-lg">»</span>
            <h2 class="text-sm font-bold text-slate-800 tracking-wide uppercase">Özellikler</h2>
          </div>
        </div>

        <div class="p-6">
          <!-- Table Header bar -->
          <div class="py-3 px-6 rounded-lg text-center text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 mb-6">
            Tüm paketler için geçerlidir
          </div>

          <!-- Features Grid Columns -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(col, colIdx) in featureColumns" :key="colIdx" class="space-y-3.5">
              <div v-for="feat in col" :key="feat" class="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                <Check :size="15" class="text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Promo Bar -->
      <div class="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
        <div>
          <h4 class="text-xs font-bold text-blue-900">Mevcut bir üyeliğiniz mi var?</h4>
          <p class="text-[11px] text-blue-700 mt-1">Eğer üyeliğiniz varsa aşağıdaki bağlantıya tıklayıp %20 indirimli fiyatlarla üyeliğinizi uzatabilirsiniz.</p>
        </div>
        <button class="shrink-0 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition">
          Üyelik uzat
          <ArrowRight :size="13" />
        </button>
      </div>

      <!-- Legal Disclaimer Footer -->
      <div class="mt-12 text-center max-w-4xl mx-auto px-6">
        <p class="text-[10px] leading-relaxed text-slate-400 italic font-medium">
          Bu hizmet GelAnlaşalım Bilişim A.Ş. tarafından sunulmaktadır. Şirketimizin Kamu İhale Kurumu (EKAP) veya başka bir kamu kurumu ile herhangi bir bağlantısı bulunmamaktadır.
        </p>
      </div>

    </div>

    <!-- Checkout Cart Slide-over Drawer / Modal -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isCheckoutOpen" class="fixed inset-0 z-50 overflow-hidden flex justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
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
                    <p class="text-[11px] text-slate-500 mt-0.5">Ekap, Doğrudan Temin ve KİK Kararları Dahil</p>
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
                    <span>KDV (%20):</span>
                    <span class="font-mono">₺{{ vatAmount.toLocaleString('tr-TR') }}</span>
                  </div>
                  <div class="flex justify-between text-slate-800 font-bold border-t border-slate-200/60 pt-1.5 mt-1.5">
                    <span>Toplam Ödeme:</span>
                    <span class="font-mono text-blue-600">₺{{ selectedPackage?.price.toLocaleString('tr-TR') }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Method Tabs -->
              <div class="mb-6">
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

                <!-- Bank Info Selector -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Banka Hesabı</label>
                  <select v-model="selectedBank" class="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white">
                    <option value="garanti">Garanti BBVA - GelAnlaşalım A.Ş.</option>
                    <option value="akbank">Akbank - GelAnlaşalım A.Ş.</option>
                    <option value="ziraat">Ziraat Bankası - GelAnlaşalım A.Ş.</option>
                  </select>
                </div>

                <!-- IBAN Display Box -->
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>IBAN:</span>
                    <span class="font-mono text-slate-800 select-all">TR91 0006 2000 0001 2345 6789 99</span>
                  </div>
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Referans Kodu:</span>
                    <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold font-mono">GA-{{ selectedPackage?.months }}M{{ Math.floor(100 + Math.random() * 900) }}</span>
                  </div>
                </div>

                <!-- Payer name -->
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

            <!-- Success Screen -->
            <div v-else class="h-full flex flex-col items-center justify-center text-center py-12">
              <div class="h-16 w-16 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mb-6">
                <CheckCircle :size="36" />
              </div>
              <h3 class="text-lg font-bold text-slate-800">Ödeme Başarılı!</h3>
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
