<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Lock, 
  FileText, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Gift, 
  Zap, 
  MessageSquare,
  Send,
  X 
} from 'lucide-vue-next'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

import StatsCards from "~/components/dashboard/StatsCards.vue"
import DashboardChart from "~/components/dashboard/DashboardChart.vue"
import QuickActions from "~/components/dashboard/QuickActions.vue"
import RecentTenders from "~/components/dashboard/RecentTenders.vue"
import RecentOffers from "~/components/dashboard/RecentOffers.vue"
import ActivityFeed from "~/components/dashboard/ActivityFeed.vue"
import Notifications from "~/components/dashboard/Notifications.vue"

const verified = ref(true)
const companyName = ref('Ali Turan')

// Firmanın İhalesine Gelen Teklifler ve Pazarlık Masası (Örnek teklifler temizlendi)
const incomingBids = ref<any[]>([])

const showNegotiationModal = ref(false)
const selectedBidForNegotiation = ref<any>(null)
const counterOfferPrice = ref('')
const counterOfferNotes = ref('')

function openNegotiationModal(bid: any) {
  selectedBidForNegotiation.value = bid
  counterOfferPrice.value = bid.bidAmount ? String(Math.round(bid.bidAmount * 0.96)) : ''
  counterOfferNotes.value = 'Teklifinizi inceledik. Belirttiğimiz hedef fiyata çekilmesi durumunda ihale tarafınıza verilecektir.'
  showNegotiationModal.value = true
}

function submitCounterOffer() {
  if (!counterOfferPrice.value) {
    alert('Lütfen karşı teklif / hedef pazarlık tutarını giriniz.')
    return
  }
  if (selectedBidForNegotiation.value) {
    selectedBidForNegotiation.value.status = 'Karşı Teklif İletildi (Pazarlık) 💬'
    if (!selectedBidForNegotiation.value.negotiationHistory) {
      selectedBidForNegotiation.value.negotiationHistory = []
    }
    selectedBidForNegotiation.value.negotiationHistory.push({
      sender: 'Siz (İhale Sahibi)',
      price: Number(counterOfferPrice.value),
      text: counterOfferNotes.value,
      date: 'Şimdi'
    })
  }
  showNegotiationModal.value = false
  alert(`💬 PAZARLIK TEKLİFİNİZ İLETİLDİ!\n\n${selectedBidForNegotiation.value?.bidderFirm} firmasına ${Number(counterOfferPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki karşı teklifiniz başarıyla gönderilmiştir.`)
}

function acceptBid(bid: any) {
  // Check if this tender already has an accepted bid
  const existingWinner = incomingBids.value.find(b => b.tenderId === bid.tenderId && (b.status.includes('Kabul Edildi') || b.status.includes('Mutabakat')))
  if (existingWinner && existingWinner.id !== bid.id) {
    alert(`⚠️ GEÇERSİZ İŞLEM: "${bid.tenderTitle}" ihalesinde zaten "${existingWinner.bidderFirm}" firması ile mutabakat sağlanmıştır!\n\nBir ihaleye yalnızca 1 adet kazanan teklif atanabilir. Farklı bir teklifi onaylamak istiyorsanız önce mevcut mutabakatı iptal etmeniz gerekir.`)
    return
  }

  const confirmAccept = confirm(`🎉 "${bid.bidderFirm}" firmasının ${bid.bidAmount.toLocaleString('tr-TR')} ₺ tutarındaki teklifini onaylayıp mutabakat sağlamak istiyor musunuz?\n\nBu işlem sonucunda ihale sonuçlanacak ve diğer teklifler elenecektir.`)
  if (!confirmAccept) return

  // 1. Set winning bid
  bid.status = 'Mutabakat Sağlandı ✓'

  // 2. Eliminate other bids of the same tender
  incomingBids.value.forEach(b => {
    if (b.tenderId === bid.tenderId && b.id !== bid.id) {
      b.status = 'Elendi (Başka Teklifle Anlaşıldı)'
    }
  })

  alert(`🎉 TEBRİKLER! MUTABAKAT SAĞLANDI!\n\n"${bid.tenderTitle}" ihalesi için ${bid.bidderFirm} firması ile ${bid.bidAmount.toLocaleString('tr-TR')} ₺ bedel üzerinden mutabakat sağlanmıştır. İhale tekliflere kapatıldı.`)
}

function cancelBidAgreement(bid: any) {
  const confirmCancel = confirm(`⚠️ "${bid.tenderTitle}" ihalesindeki mutabakatı iptal edip ihaleyi tekrar teklife açmak istiyor musunuz?`)
  if (!confirmCancel) return

  incomingBids.value.forEach(b => {
    if (b.tenderId === bid.tenderId) {
      b.status = 'Yeni Teklif ⚡'
    }
  })

  alert(`🔄 MUTABAKAT İPTAL EDİLDİ\n\n"${bid.tenderTitle}" ihalesi yeniden teklif toplamaya açılmıştır. Tedarikçiler tekrar teklif iletebilir.`)
}

// 🟢 1 AYLIK ABONELİK VE DENEME SÜRESİ CANLI SAYACI & SATIN ALMA KANCASI (PAYWALL HOOK)
const subscriptionPlan = ref({
  name: '1 Aylık Ücretsiz Kurumsal Deneme Planı',
  startDate: '25 Ağustos 2026',
  endDate: '25 Eylül 2026',
  price: '0 ₺',
  totalDays: 30,
  remainingDays: 29,
  hours: 23,
  minutes: 54,
  seconds: 12,
  percentRemaining: 96,
  status: 'Aktif'
})

const isTrialExpired = ref(false)
const showPaywallModal = ref(false)
const copiedCoupon = ref(false)
let timerInterval: any = null

function updateCountdown() {
  if (isTrialExpired.value) return
  if (subscriptionPlan.value.seconds > 0) {
    subscriptionPlan.value.seconds--
  } else {
    subscriptionPlan.value.seconds = 59
    if (subscriptionPlan.value.minutes > 0) {
      subscriptionPlan.value.minutes--
    } else {
      subscriptionPlan.value.minutes = 59
      if (subscriptionPlan.value.hours > 0) {
        subscriptionPlan.value.hours--
      } else {
        subscriptionPlan.value.hours = 23
        if (subscriptionPlan.value.remainingDays > 0) {
          subscriptionPlan.value.remainingDays--
        } else {
          expireTrialForDemo()
        }
      }
    }
  }
}

function expireTrialForDemo() {
  subscriptionPlan.value.remainingDays = 0
  subscriptionPlan.value.hours = 0
  subscriptionPlan.value.minutes = 0
  subscriptionPlan.value.seconds = 0
  subscriptionPlan.value.percentRemaining = 0
  subscriptionPlan.value.status = 'Süresi Doldu'
  isTrialExpired.value = true
  showPaywallModal.value = true
  if (typeof window !== 'undefined') {
    localStorage.setItem('trialExpired', 'true')
  }
}

function extendTrial(days = 7) {
  subscriptionPlan.value.remainingDays = days
  subscriptionPlan.value.hours = 12
  subscriptionPlan.value.minutes = 30
  subscriptionPlan.value.seconds = 45
  subscriptionPlan.value.percentRemaining = Math.round((days / 30) * 100)
  subscriptionPlan.value.status = 'Aktif'
  isTrialExpired.value = false
  showPaywallModal.value = false
  if (typeof window !== 'undefined') {
    localStorage.removeItem('trialExpired')
  }
}

function copyCoupon(code = 'LANSMAN20') {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(code)
  }
  copiedCoupon.value = true
  setTimeout(() => {
    copiedCoupon.value = false
  }, 2000)
}

function quickVerify() {
  verified.value = true
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.verified = true
    session.isPremium = true
    session.subscriptionPlan = '1 Ay Ücretsiz Kurumsal Deneme'
    localStorage.setItem('userSession', JSON.stringify(session))
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      // Default to verified unless explicitly set to false
      verified.value = session.verified !== false
      if (session.company) {
        companyName.value = session.company
      }
      if (session.subscriptionPlan) {
        subscriptionPlan.value.name = session.subscriptionPlan
      }
      if (localStorage.getItem('trialExpired') === 'true') {
        expireTrialForDemo()
      }
    } catch (e) {
      console.error('Error parsing session', e)
    }

    timerInterval = setInterval(updateCountdown, 1000)
  }
})
</script>

<template>
  <div>
    <!-- VERIFIED DASHBOARD (Normal Panel) -->
    <div v-if="verified" class="space-y-6">
      
      <!-- 🟢 1. AKTİF ABONELİK DURUMU & CANLI KALAN SÜRE SAYACI -->
      <div 
        class="rounded-3xl border text-white p-6 shadow-xl relative overflow-hidden text-left space-y-5 transition-all duration-300"
        :class="isTrialExpired 
          ? 'bg-gradient-to-r from-[#2A0C14] via-[#3B121D] to-[#2A0C14] border-red-500/50' 
          : 'bg-gradient-to-r from-[#0F223D] via-[#152B4D] to-[#0F223D] border-blue-900/60'"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border"
                :class="isTrialExpired 
                  ? 'bg-red-500/20 text-red-300 border-red-400/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'"
              >
                <span 
                  class="h-1.5 w-1.5 rounded-full"
                  :class="isTrialExpired ? 'bg-red-400' : 'bg-emerald-400 animate-ping'"
                ></span>
                {{ subscriptionPlan.status }} Lisans
              </span>
              <span class="text-xs font-bold" :class="isTrialExpired ? 'text-red-200' : 'text-blue-200'">• {{ subscriptionPlan.name }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span v-if="!isTrialExpired">1 Aylık Kurumsal Denemeniz Aktif</span>
              <span v-else class="text-red-300">⚠️ 1 Aylık Deneme Süreniz Sona Erdi!</span>
            </h2>
            <p class="text-xs text-slate-300 max-w-xl">
              <span v-if="!isTrialExpired">
                İhale açma, kapalı zarf eksiltmeye katılma, doğrudan temin ve canlı fiyat pazarlığı yetkileriniz sınırsızdır. Bitiş: <strong class="text-white">{{ subscriptionPlan.endDate }}</strong>.
              </span>
              <span v-else class="text-red-200 font-medium">
                1 aylık ücretsiz deneme süreniz tamamlandı. İhalelere teklif vermeye ve tasarruf sağlamaya devam etmek için üyeliğinizi hemen başlatın.
              </span>
            </p>
          </div>

          <!-- Digital Countdown Blocks -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <!-- Days -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[70px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono" :class="isTrialExpired ? 'text-red-400' : 'text-[#00C2FF]'">{{ subscriptionPlan.remainingDays }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">GÜN</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Hours -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-white">{{ String(subscriptionPlan.hours).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">SAAT</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Minutes -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-white">{{ String(subscriptionPlan.minutes).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">DAKİKA</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Seconds -->
            <div class="bg-black/40 border backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center" :class="isTrialExpired ? 'border-red-400/40' : 'border-amber-400/40'">
              <div class="text-2xl sm:text-3xl font-black font-mono" :class="isTrialExpired ? 'text-red-400' : 'text-amber-400'">{{ String(subscriptionPlan.seconds).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black uppercase tracking-widest block mt-0.5" :class="isTrialExpired ? 'text-red-300' : 'text-amber-300'">SANİYE</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar & Actions -->
        <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1 max-w-md space-y-1.5">
            <div class="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Deneme & Abonelik Durumu</span>
              <span class="font-mono" :class="isTrialExpired ? 'text-red-400' : 'text-[#00C2FF]'">%{{ subscriptionPlan.percentRemaining }} {{ isTrialExpired ? 'Süresi Doldu' : 'Aktif' }}</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                class="h-2 rounded-full transition-all duration-500" 
                :class="isTrialExpired ? 'bg-red-500' : 'bg-gradient-to-r from-[#0052FF] to-[#00C2FF]'"
                :style="`width: ${subscriptionPlan.percentRemaining}%`"
              ></div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Satın Alma Kancası & Plan Seç Butonu -->
            <button
              v-if="isTrialExpired"
              @click="showPaywallModal = true"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer animate-pulse"
            >
              <span>🛒 Satın Alma Kancası & Planları Aç</span>
              <ArrowRight :size="14" />
            </button>

            <NuxtLink
              v-else
              to="/abonelik"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>⚡ Aboneliği Yenile / Plan Seç</span>
              <ArrowRight :size="14" />
            </NuxtLink>

            <!-- Test Modu: Deneme Süresini Bitir (Kancayı Test Et) -->
            <button
              v-if="!isTrialExpired"
              @click="expireTrialForDemo"
              class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
              title="1 Aylık Deneme Süresi bittiğinde satın alma kancasının nasıl açıldığını test edin"
            >
              <Zap :size="13" class="text-amber-400" />
              <span>⚡ Deneme Süresini Bitir (Kancayı Test Et)</span>
            </button>

            <!-- Test Modu: 7 Gün Süre Ekle -->
            <button
              v-else
              @click="extendTrial(7)"
              class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Zap :size="13" class="text-emerald-400" />
              <span>⚡ Test: 7 Gün Süre Ekle</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Hoşgeldin Bilgi Bandı -->
      <div class="rounded-2xl border bg-white p-6 shadow-xs flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <h1 class="text-base font-black flex items-center gap-2 text-slate-800 tracking-tight">
            <ShieldCheck class="text-emerald-500" :size="20" />
            {{ 'Şirket Profiliniz Doğrulandı!' }}
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-1">
            {{ `Tebrikler ${companyName}, tüm B2B ihale açma, teklif verme ve sözleşme süreçleriniz aktiftir.` }}
          </p>
        </div>
        <div class="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
          ✓ {{ 'Onaylı Üye' }}
        </div>
      </div>

      <!-- İstatistik Kartları -->
      <StatsCards />

      <!-- 🟢 FİRMANIZIN İHALELERİNE GELEN CANLI TEKLİFLER & FİYAT PAZARLIĞI MASASI -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 text-left">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052FF] text-[10px] font-black uppercase tracking-wider mb-1.5">
              <MessageSquare :size="12" />
              <span>CANLI PAZARLIK & TEKLİF AKIŞI</span>
            </div>
            <h2 class="text-lg font-black text-slate-800 tracking-tight">
              Firmanızın İhalelerine Gelen Son Teklifler
            </h2>
            <p class="text-xs text-slate-500 font-medium">
              Yayındaki ihalelerinize tedarikçilerden gelen fiyat tekliflerini anlık görün, doğrudan pazarlık yapın veya karşı teklif iletin.
            </p>
          </div>
          <NuxtLink
            to="/panel/gelen-teklifler"
            class="inline-flex items-center gap-1.5 rounded-xl bg-[#0F223D] hover:bg-[#1A3358] text-white text-xs font-black px-4 py-2.5 transition self-start sm:self-auto shadow-xs"
          >
            <span>Tüm Teklifleri Yönet ({{ incomingBids.length }})</span>
            <ArrowRight :size="14" class="text-[#00C2FF]" />
          </NuxtLink>
        </div>

        <!-- Incoming Bids Grid -->
        <div v-if="incomingBids.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="bid in incomingBids"
            :key="bid.id"
            class="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-[#0052FF] border border-blue-200">
                  {{ bid.status }}
                </span>
                <span class="text-[10px] text-slate-400 font-bold font-mono">{{ bid.timeAgo }}</span>
              </div>

              <div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">İHALE BAŞLIĞI</span>
                <h3 class="text-xs font-black text-slate-800 line-clamp-1 mt-0.5">{{ bid.tenderTitle }}</h3>
              </div>

              <!-- Teklif Veren Firma & Fiyat -->
              <div class="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500 font-medium text-[11px]">Teklif Veren:</span>
                  <span class="font-bold text-slate-800 truncate max-w-[150px]">{{ bid.bidderFirm }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500 font-medium text-[11px]">Teklif Tutarı:</span>
                  <span class="font-black text-sm font-mono text-emerald-600">{{ bid.bidAmount.toLocaleString('tr-TR') }} ₺</span>
                </div>
                <div class="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                  <span class="text-slate-400 font-semibold">Tasarruf:</span>
                  <span class="font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{{ bid.savings }}</span>
                </div>
              </div>

              <p class="text-[11px] text-slate-500 leading-snug italic">
                "{{ bid.notes }}"
              </p>
            </div>

            <!-- Action Buttons: Fiyat Pazarlığı Yap & Kabul Et & Mutabakat İptali -->
            <div class="pt-2 flex items-center gap-2 border-t border-slate-200">
              <!-- Anlaşıldıysa İptal Butonu -->
              <template v-if="bid.status.includes('Mutabakat')">
                <button
                  type="button"
                  @click="cancelBidAgreement(bid)"
                  class="w-full py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Anlaşmayı iptal edip ihaleyi tekrar teklife aç"
                >
                  <AlertCircle :size="13" />
                  <span>Mutabakatı İptal Et (Teklife Aç)</span>
                </button>
              </template>

              <!-- Elendiyse -->
              <template v-else-if="bid.status.includes('Elendi')">
                <div class="w-full py-2 px-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-bold text-center flex items-center justify-center gap-1">
                  <Lock :size="12" />
                  <span>İhalede Başka Teklifle Anlaşıldı</span>
                </div>
              </template>

              <!-- Açık Teklifse: Pazarlık ve Kabul Butonları -->
              <template v-else>
                <button
                  type="button"
                  @click="openNegotiationModal(bid)"
                  class="flex-1 py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageSquare :size="12" />
                  <span>Pazarlık</span>
                </button>
                <button
                  type="button"
                  @click="acceptBid(bid)"
                  class="flex-1 py-2 px-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 :size="12" />
                  <span>Kabul Et</span>
                </button>
              </template>
            </div>
          </div>
        </div>

        <div v-else class="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <p class="text-xs text-slate-500 font-medium">Henüz ihalelerinize verilmiş bir teklif bulunmuyor. Yeni bir satın alma ihalesi açarak onaylı tedarikçilerden teklif toplayabilirsiniz.</p>
          <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm">
            + Yeni İhale Aç
          </NuxtLink>
        </div>
      </div>

      <!-- Grafik + Hızlı İşlemler -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <DashboardChart />
        </div>
        <QuickActions />
      </div>

      <!-- Son İhaleler + Gelen Teklifler -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentTenders />
        <RecentOffers />
      </div>

      <!-- Aktivite + Bildirim -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityFeed />
        <Notifications />
      </div>
    </div>

    <!-- UNVERIFIED DASHBOARD (Verification Pending Panel) -->
    <div v-else class="max-w-6xl mx-auto space-y-6 text-left">
      
      <!-- 🟢 AKTİF ABONELİK DURUMU & CANLI KALAN SÜRE SAYACI -->
      <div class="rounded-3xl border bg-gradient-to-r from-[#0F223D] via-[#152B4D] to-[#0F223D] text-white p-6 shadow-xl relative overflow-hidden text-left space-y-5">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {{ subscriptionPlan.status }} Lisans
              </span>
              <span class="text-xs text-blue-200 font-bold">• {{ subscriptionPlan.name }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight text-white">
              Kurumsal B2B Aboneliğiniz Aktif
            </h2>
            <p class="text-xs text-slate-300 max-w-xl">
              İhale açma, teklif verme ve doğrudan fiyat pazarlığı işlemleriniz için kalan abonelik süreniz. Bitiş: <strong class="text-white">{{ subscriptionPlan.endDate }}</strong>.
            </p>
          </div>

          <!-- Digital Countdown Blocks -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <!-- Days -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[70px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-[#00C2FF]">{{ subscriptionPlan.remainingDays }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">GÜN</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Hours -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-white">{{ String(subscriptionPlan.hours).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">SAAT</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Minutes -->
            <div class="bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-white">{{ String(subscriptionPlan.minutes).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">DAKİKA</span>
            </div>
            <span class="text-xl font-bold text-slate-500">:</span>

            <!-- Seconds -->
            <div class="bg-black/40 border border-amber-400/40 backdrop-blur-md rounded-2xl p-3 min-w-[65px] text-center">
              <div class="text-2xl sm:text-3xl font-black font-mono text-amber-400">{{ String(subscriptionPlan.seconds).padStart(2, '0') }}</div>
              <span class="text-[9px] font-black text-amber-300 uppercase tracking-widest block mt-0.5">SANİYE</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar & Actions -->
        <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1 max-w-md space-y-1.5">
            <div class="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Abonelik Geçerlilik Oranı</span>
              <span class="font-mono text-[#00C2FF]">%{{ subscriptionPlan.percentRemaining }} Aktif</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-[#0052FF] to-[#00C2FF] h-2 rounded-full transition-all duration-500" :style="`width: ${subscriptionPlan.percentRemaining}%`"></div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              to="/abonelik"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg"
            >
              <span>⚡ Aboneliği Yenile / Uzat</span>
              <ArrowRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Top banner + Steps Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Checklist and Status -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Welcome Status Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-xs flex items-start justify-between relative overflow-hidden" style="border-color: #E2E8F0;">
            <div class="space-y-2 max-w-md">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-black uppercase text-blue-600 tracking-wider">
                {{ 'KURUMSAL DOĞRULAMA' }}
              </span>
              <h2 class="text-lg font-black text-slate-800 leading-tight">
                {{ 'Kontrol paneliniz hazır; doğrulama bekleniyor.' }}
              </h2>
              <p class="text-xs text-slate-500 font-medium leading-relaxed">
                {{ 'Kurumsal ihale, teklif ve sözleşme işlemlerini başlatmak için şirket doğrulamanızı tamamlamanız gerekir.' 
                }}
              </p>
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider pt-2">
                {{ 'HESAP SAHİBİ:' }} {{ companyName }}
              </div>
            </div>
            
            <div class="h-10 w-10 shrink-0 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
              <ShieldAlert :size="20" />
            </div>
          </div>

          <!-- Tamamlanması Gerekenler Listesi -->
          <div class="rounded-2xl border bg-white p-6 shadow-xs space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">
              {{ 'TAMAMLANMASI GEREKENLER' }}
            </h3>
            
            <div class="divide-y divide-slate-100">
              
              <!-- 01: Şirket Kimliği -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">01</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Şirket kimliği' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Şirket temel bilgileri hazır.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
                </span>
              </div>

              <!-- 02: Fatura Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">02</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Fatura bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Fatura bilgileri hazır.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
                </span>
              </div>

              <!-- 03: IBAN Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">03</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'IBAN bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'TR / SWIFT IBAN bilgisi eklenebilir.' }}</p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ 'EKLE' }}
                </NuxtLink>
              </div>

              <!-- 04: Zorunlu Belgeler -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">04</span>
                  <div class="max-w-xs sm:max-w-md">
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Zorunlu belgeler (KYC)' }}</h4>
                    <p class="text-[10px] text-slate-400 leading-normal truncate sm:whitespace-normal">
                      {{ 'Vergi Levhası, Ticaret Sicil Gazetesi, İmza Sirküleri.' 
                      }}
                    </p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ 'YÜKLE' }}
                </NuxtLink>
              </div>

              <!-- 05: Yetkili Kişi Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">05</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Yetkili kişi bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Yetkili kişi bilgileri kayıtlı.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
                </span>
              </div>

            </div>
          </div>
        </div>

        <!-- Right Column: Verification Actions and Locks -->
        <div class="space-y-6">
          
          <!-- Action Box -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3 text-center border-slate-200">
            <button 
              type="button"
              @click="quickVerify"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1EAE4C] hover:bg-[#188C3D] text-white font-black text-xs py-3.5 shadow-lg shadow-[#1EAE4C]/25 transition cursor-pointer"
            >
              <Sparkles :size="15" />
              <span>⚡ 6 Ay Ücretsiz: Tek Tıkla Doğrula & Başla</span>
            </button>

            <NuxtLink 
              to="/firma-dogrulama"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F223D] hover:bg-[#003057] text-white font-bold text-xs py-3 shadow-md transition"
            >
              <ShieldCheck :size="15" class="text-emerald-400" />
              <span>Resmi Evraklarla Doğrula (KYC) →</span>
            </NuxtLink>

            <p class="text-[10px] text-slate-400 leading-normal max-w-[240px] mx-auto">
              Lansmana özel olarak tüm yetkileri anında açabilir veya kurumsal onaylı mavi rozet için evrak yükleyebilirsiniz.
            </p>
          </div>

          <!-- Verification Summary Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3 border-slate-200 text-left">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-[#003057] flex items-center gap-1.5">
              <ShieldAlert :size="14" class="text-amber-500" />
              <span>DOĞRULAMA DURUMU</span>
            </h4>
            <span class="text-xs font-bold text-slate-800 block">
              Tamamlanması gereken adımlar var
            </span>
            <p class="text-[10px] text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-xl">
              Evraklarınızı yükleyerek Mavi Rozet alabilir veya 6 aylık ücretsiz denemeyi tek tıkla başlatabilirsiniz.
            </p>
          </div>

          <!-- Neler Etkilenir Card (Interactive & Clickable) -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3 border-slate-200 text-left">
            <div class="flex items-center justify-between">
              <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-500">
                NELER ETKİLENİR?
              </h4>
              <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Modüller Aktif
              </span>
            </div>
            
            <div class="space-y-2">
              
              <!-- Item 1: İhale Oluşturma -->
              <NuxtLink 
                to="/panel/ihale-olustur" 
                class="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl transition border border-slate-200 group"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#003057] group-hover:border-[#003057]">
                    <Plus :size="14" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-800 block group-hover:text-[#003057]">İhale oluşturma</span>
                    <span class="text-[10px] text-slate-400">Yeni ilan ve şartname aç</span>
                  </div>
                </div>
                <ChevronRight :size="14" class="text-slate-400 group-hover:text-[#003057] group-hover:translate-x-0.5 transition" />
              </NuxtLink>

              <!-- Item 2: Teklif Verme -->
              <NuxtLink 
                to="/panel/pazar-yeri" 
                class="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl transition border border-slate-200 group"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#003057] group-hover:border-[#003057]">
                    <Sparkles :size="14" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-800 block group-hover:text-[#003057]">Teklif verme</span>
                    <span class="text-[10px] text-slate-400">Canlı eksiltme pazar yeri</span>
                  </div>
                </div>
                <ChevronRight :size="14" class="text-slate-400 group-hover:text-[#003057] group-hover:translate-x-0.5 transition" />
              </NuxtLink>

              <!-- Item 3: Sözleşme ve Teslimat -->
              <NuxtLink 
                to="/panel/siparis-teslimat" 
                class="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl transition border border-slate-200 group"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#003057] group-hover:border-[#003057]">
                    <FileText :size="14" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-800 block group-hover:text-[#003057]">Sözleşme ve teslimat takibi</span>
                    <span class="text-[10px] text-slate-400">İşlem ve sevkiyat takibi</span>
                  </div>
                </div>
                <ChevronRight :size="14" class="text-slate-400 group-hover:text-[#003057] group-hover:translate-x-0.5 transition" />
              </NuxtLink>

            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- 🟢 FİYAT PAZARLIĞI VE KARŞI TEKLİF MODALI -->
    <div v-if="showNegotiationModal && selectedBidForNegotiation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MessageSquare :size="20" />
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-600 uppercase tracking-wider block">B2B FİYAT PAZARLIĞI</span>
              <h3 class="text-sm font-black text-slate-900">Tedarikçi ile Pazarlık & Karşı Teklif</h3>
            </div>
          </div>
          <button @click="showNegotiationModal = false" class="text-slate-400 hover:text-slate-700 transition cursor-pointer">
            <X :size="20" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Tedarikçi Firma:</span>
              <span class="font-black text-slate-800">{{ selectedBidForNegotiation.bidderFirm }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Mevcut Teklif Tutarı:</span>
              <span class="font-black text-emerald-600 font-mono text-sm">{{ selectedBidForNegotiation.bidAmount.toLocaleString('tr-TR') }} ₺</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-slate-400">İhale:</span>
              <span class="text-slate-700 font-bold line-clamp-1">{{ selectedBidForNegotiation.tenderTitle }}</span>
            </div>
          </div>

          <!-- Hedef Pazarlık Fiyatı -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              HEDEF PAZARLIK / KARŞI TEKLİF TUTARI (₺) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-amber-600 text-sm">₺</span>
              <input
                v-model="counterOfferPrice"
                type="number"
                placeholder="Örn: 4.900.000"
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
              />
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">Tedarikçiye iletilecek revize hedef teklif tutarı.</span>
          </div>

          <!-- Pazarlık Notu / Şartları -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              PAZARLIK ŞARTLARI VE NOTUNUZ *
            </label>
            <textarea
              v-model="counterOfferNotes"
              rows="3"
              placeholder="Örn: Belirtilen fiyata inilmesi durumunda ihale tarafınıza verilecektir."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            @click="showNegotiationModal = false"
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="submitCounterOffer"
            class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <Send :size="13" />
            <span>Karşı Teklifi İlet</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 🛒 SATIN ALMA KANCASI (PAYWALL MODAL) -->
    <div 
      v-if="showPaywallModal" 
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div class="relative w-full max-w-2xl bg-[#0F223D] border border-amber-400/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden text-left space-y-6 max-h-[92vh] overflow-y-auto">
        <!-- Glow Effects -->
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-[#1EAE4C]/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Close Button -->
        <button 
          @click="showPaywallModal = false" 
          class="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X :size="18" />
        </button>

        <!-- Header -->
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
            <Clock :size="13" />
            <span>1 AYLIK ÜCRETSİZ DENEME SÜRENİZ SONA ERDİ</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            İhalelere ve Canlı Eksiltmeye Kesintisiz Devam Edin!
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Sayın <strong class="text-white">{{ companyName }}</strong> yetkilisi, 1 aylık ücretsiz deneme sürecinizi tamamladınız. Canlı eksiltmelerle ortalama <strong class="text-emerald-400">%14.2 satın alma tasarrufu</strong> elde etmeye, yeni ihale açmaya ve doğrulanmış B2B üreticilerden teklif toplamaya devam etmek için kurumsal üyeliğinizi hemen başlatın.
          </p>
        </div>

        <!-- Special Discount Hook Box -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black">
              <Gift :size="20" />
            </div>
            <div>
              <div class="text-xs font-black text-amber-300">Lansmana Özel Ekstra %20 İndirim Kuponu</div>
              <div class="text-[11px] text-slate-300 font-medium">Tüm kurumsal üyelik paketlerinde anında geçerlidir.</div>
            </div>
          </div>
          <button 
            @click="copyCoupon('LANSMAN20')"
            class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>LANSMAN20</span>
            <span class="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-sans">{{ copiedCoupon ? 'Kopyalandı ✓' : 'Kodu Kopyala' }}</span>
          </button>
        </div>

        <!-- 4 Quick Plan Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NuxtLink to="/abonelik" class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all text-center group cursor-pointer block">
            <div class="text-[10px] font-bold text-slate-400">1 AYLIK</div>
            <div class="text-base font-black text-white group-hover:text-amber-300 transition">960 ₺</div>
            <div class="text-[9px] text-slate-400">Tek Seferlik</div>
          </NuxtLink>

          <NuxtLink to="/abonelik" class="p-3.5 rounded-2xl bg-[#1EAE4C]/15 border-2 border-[#1EAE4C] hover:border-[#1EAE4C] transition-all text-center relative group cursor-pointer block">
            <span class="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1EAE4C] text-[8px] font-black text-white rounded-full">POPÜLER</span>
            <div class="text-[10px] font-bold text-emerald-300">3 AYLIK</div>
            <div class="text-base font-black text-white group-hover:text-emerald-300 transition">1.800 ₺</div>
            <div class="text-[9px] text-emerald-400 font-bold">600 ₺ / ay</div>
          </NuxtLink>

          <NuxtLink to="/abonelik" class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all text-center group cursor-pointer block">
            <div class="text-[10px] font-bold text-slate-400">6 AYLIK</div>
            <div class="text-base font-black text-white group-hover:text-amber-300 transition">2.700 ₺</div>
            <div class="text-[9px] text-slate-400">450 ₺ / ay</div>
          </NuxtLink>

          <NuxtLink to="/abonelik" class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all text-center group cursor-pointer block">
            <div class="text-[10px] font-bold text-slate-400">12 AYLIK</div>
            <div class="text-base font-black text-white group-hover:text-amber-300 transition">3.800 ₺</div>
            <div class="text-[9px] text-slate-400">316 ₺ / ay</div>
          </NuxtLink>
        </div>

        <!-- Features list -->
        <div class="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
          <div class="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Abonelikle Kesintisiz Açık Kalacak Özellikler:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-400 shrink-0" /> Sınırsız B2B İhale ve Canlı Eksiltme</div>
            <div class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-400 shrink-0" /> Doğrulanmış Kurumsal Üretici Ağı</div>
            <div class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-400 shrink-0" /> Anlık NetGSM SMS & E-posta Alarmları</div>
            <div class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-400 shrink-0" /> Güvenli Sözleşme & Escrow Ödeme</div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <NuxtLink 
            to="/abonelik"
            class="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-sm transition shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 text-center"
          >
            <span>Planları İncele & Abone Ol (%0 Komisyon)</span>
            <ArrowRight :size="16" />
          </NuxtLink>
          
          <!-- Demo extension button for testing -->
          <button 
            @click="extendTrial(7)"
            class="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap :size="14" class="text-amber-400" />
            <span>Test: 7 Gün Süre Ekle</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
