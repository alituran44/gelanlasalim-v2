<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Tv, 
  Radio, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  AlertCircle, 
  Sparkles,
  TrendingDown,
  Gavel,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowDownRight,
  Flame,
  Volume2,
  X,
  Send
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const activeTab = ref<'all' | 'live' | 'upcoming' | 'ended'>('all')
const searchQuery = ref('')

const rooms = computed(() => {
  return cmsData.value?.liveAuctionRooms || []
})

const filteredRooms = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return rooms.value.filter(r => {
    if (activeTab.value === 'live' && r.status !== 'live') return false
    if (activeTab.value === 'upcoming' && r.status !== 'upcoming') return false
    if (activeTab.value === 'ended' && r.status !== 'ended') return false

    if (q) {
      const matchTitle = (r.tenderTitle || '').toLowerCase().includes(q)
      const matchCat = (r.category || '').toLowerCase().includes(q)
      const matchLeader = (r.leaderSupplier || '').toLowerCase().includes(q)
      if (!matchTitle && !matchCat && !matchLeader) return false
    }
    return true
  })
})

// Metrics
const activeLiveCount = computed(() => rooms.value.filter(r => r.status === 'live').length)
const totalVolume = computed(() => {
  return rooms.value.reduce((acc, r) => acc + (r.currentBestBid || r.ceilingPrice || 0), 0)
})

// Active Room & Bidding Modal
const selectedRoom = ref<any>(null)
const customBidAmount = ref('')
const bidLog = ref<{ time: string; firm: string; amount: number; isMe: boolean }[]>([])

// Countdown Timer Interval
let timer: any = null

onMounted(() => {
  timer = setInterval(() => {
    rooms.value.forEach(r => {
      if (r.status === 'live' && r.remainingSeconds > 0) {
        r.remainingSeconds--
        if (r.remainingSeconds === 0) {
          r.status = 'ended'
        }
      }
    })
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function formatTime(seconds: number) {
  if (!seconds || seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function openRoom(room: any) {
  selectedRoom.value = room
  customBidAmount.value = String(room.currentBestBid - room.minStep)
  bidLog.value = [
    { time: '12:04', firm: room.leaderSupplier, amount: room.currentBestBid, isMe: false },
    { time: '12:02', firm: 'Tedarikçi #B18', amount: room.currentBestBid + room.minStep * 2, isMe: false },
    { time: '12:00', firm: 'Tedarikçi #C92', amount: room.ceilingPrice, isMe: false }
  ]
}

async function placeBid(decrementAmount?: number) {
  if (!selectedRoom.value) return
  const room = selectedRoom.value

  let targetAmount = 0
  if (decrementAmount) {
    targetAmount = room.currentBestBid - decrementAmount
  } else {
    targetAmount = parseInt(customBidAmount.value.replace(/[^0-9]/g, '')) || 0
  }

  if (targetAmount >= room.currentBestBid) {
    alert(`⚠️ GEÇERSİZ TEKLİF!\n\nTersine eksiltmede mevcut en iyi teklif olan ${room.currentBestBid.toLocaleString('tr-TR')} ₺'den daha DÜŞÜK bir fiyat vermelisiniz.`)
    return
  }

  if (room.currentBestBid - targetAmount < room.minStep) {
    alert(`⚠️ MİNİMUM İNDİRİM ADIMI İHLALİ!\n\nMinimum indirim adımı ${room.minStep.toLocaleString('tr-TR')} ₺'dir.`)
    return
  }

  // Anti-Sniping Check: If remaining time < 120s, extend by +120s (+2 minutes)
  let extended = false
  if (room.remainingSeconds < 120) {
    room.remainingSeconds += 120
    extended = true
  }

  // Update room state
  room.currentBestBid = targetAmount
  let userSession: any = {}
  if (typeof window !== 'undefined') {
    try {
      userSession = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }
  const myFirmName = userSession.companyName || userSession.company || 'Tedarikçi (Siz)'
  room.leaderSupplier = `${myFirmName} (Lider)`

  const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  bidLog.value.unshift({
    time: nowTime,
    firm: myFirmName + ' (Siz)',
    amount: targetAmount,
    isMe: true
  })

  saveCmsData(cmsData.value)

  // NetGSM SMS to Room Subscribers
  await sendSms({
    recipientPhone: '+90 532 555 01 23',
    recipientName: 'İhale Takipçileri',
    templateName: 'Canlı Eksiltme Yeni Lider Teklif',
    messageBody: `CANLI EKSİLTME: "${room.tenderTitle}" ihalesinde ${targetAmount.toLocaleString('tr-TR')} ₺ tutarında yeni lider teklif verildi!`
  })

  alert(`🎉 TEKLİFİNİZ LİDER OLDU!\n\n${targetAmount.toLocaleString('tr-TR')} ₺ ile canlı eksiltmede 1. sıraya yerleştiniz!${extended ? '\n\n⚡ Anti-Sniping devreye girdi: Süre +2 Dakika uzatıldı.' : ''}`)
}
</script>

<template>
  <div class="p-3 sm:p-6 max-w-7xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Radio class="text-red-500 animate-pulse" :size="24" />
          <span>Canlı Tersine Eksiltme Arenası</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1 font-medium">
          Tedarikçilerin anlık fiyat kırarak yarıştığı, dinamik süreli ve şeffaf B2B canlı ihale odaları.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-black text-emerald-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          {{ activeLiveCount }} Canlı Eksiltme Yayında
        </span>
      </div>
    </div>

    <!-- Metrics Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border bg-white p-5 border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">YAYINDAKİ ODALAR</span>
          <span class="text-2xl font-black text-slate-900 block mt-0.5">{{ activeLiveCount }}</span>
        </div>
        <div class="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
          <Radio :size="20" class="animate-pulse" />
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-5 border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CANLI TİCARET HACMİ</span>
          <span class="text-2xl font-black text-slate-900 block mt-0.5 font-mono">{{ totalVolume.toLocaleString('tr-TR') }} ₺</span>
        </div>
        <div class="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <TrendingDown :size="20" />
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-5 border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ANTİ-SNİPİNG KORUMASI</span>
          <span class="text-2xl font-black text-blue-600 block mt-0.5">+2 Dakika</span>
        </div>
        <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Clock :size="20" />
        </div>
      </div>

      <div class="rounded-2xl border bg-white p-5 border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">GÜVENLİ HAVUZ (ESCROW)</span>
          <span class="text-2xl font-black text-slate-900 block mt-0.5">TCMB / BDDK</span>
        </div>
        <div class="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <ShieldCheck :size="20" />
        </div>
      </div>
    </div>

    <!-- Filter and Search controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          v-for="tab in [
            { id: 'all', label: 'Tüm Odalar' },
            { id: 'live', label: '🔴 Canlı Yayın' },
            { id: 'upcoming', label: 'Yaklaşan' },
            { id: 'ended', label: 'Sonuçlanan' }
          ]"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id as any"
          class="rounded-lg px-3.5 py-2 text-xs font-black transition cursor-pointer"
          :class="activeTab === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search input -->
      <div class="relative w-full sm:w-72">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="İhale veya sektör ara..."
          class="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs outline-none bg-white transition focus:border-blue-500 text-slate-900"
        />
      </div>

    </div>

    <!-- Live Auction Cards Grid -->
    <div v-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        class="rounded-3xl border bg-white p-6 border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5 relative overflow-hidden"
      >
        <!-- Room Status Badge Top Ribbon -->
        <div class="flex items-center justify-between">
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
            :class="room.status === 'live' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'"
          >
            <span v-if="room.status === 'live'" class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            {{ room.status === 'live' ? 'CANLI EKSİLTME' : (room.status === 'ended' ? 'SONUÇLANDI' : 'YAKLAŞAN') }}
          </span>

          <span class="text-xs font-mono font-bold text-slate-400">{{ room.id }}</span>
        </div>

        <!-- Room Header & Category -->
        <div class="space-y-1.5">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-wide block">{{ room.category }}</span>
          <h3 class="text-sm font-black text-slate-900 leading-snug line-clamp-2">{{ room.tenderTitle }}</h3>
        </div>

        <!-- Price Breakdown Box -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-400 font-medium">Tavan Başlangıç:</span>
            <span class="font-mono text-slate-500 line-through">{{ room.ceilingPrice.toLocaleString('tr-TR') }} ₺</span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-xs font-black text-emerald-800">Lider Teklif (En Düşük):</span>
            <span class="text-lg font-black font-mono text-emerald-600">{{ room.currentBestBid.toLocaleString('tr-TR') }} ₺</span>
          </div>

          <div class="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200 text-slate-500 font-medium">
            <span>Minimum İndirim: <strong>-{{ room.minStep.toLocaleString('tr-TR') }} ₺</strong></span>
            <span>Katılımcı: <strong>{{ room.participantsCount }} Firma</strong></span>
          </div>
        </div>

        <!-- Countdown & Leader Info -->
        <div class="space-y-3 pt-1">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 text-slate-700 font-bold">
              <Clock :size="14" :class="room.remainingSeconds < 120 ? 'text-red-600 animate-pulse' : 'text-slate-500'" />
              <span>Kalan Süre:</span>
              <strong class="font-mono" :class="room.remainingSeconds < 120 ? 'text-red-600 font-black' : 'text-slate-900'">
                {{ formatTime(room.remainingSeconds) }}
              </strong>
            </div>

            <span class="text-[10px] text-slate-400 truncate max-w-[140px]" :title="room.leaderSupplier">
              👑 {{ room.leaderSupplier }}
            </span>
          </div>

          <button
            type="button"
            @click="openRoom(room)"
            class="w-full py-3 rounded-xl font-black text-xs text-white transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            :class="room.status === 'live' ? 'bg-[#003057] hover:bg-[#1EAE4C]' : 'bg-slate-800 hover:bg-slate-700'"
          >
            <Gavel :size="14" />
            <span>{{ room.status === 'live' ? 'Odaya Gir & Fiyat Kır (Teklif Ver)' : 'İhale Detayını Gör' }}</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Empty State View -->
    <div v-else class="rounded-3xl border bg-white py-16 px-6 text-center space-y-4 border-slate-200 shadow-xs">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
        <Radio :size="20" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Filtreye uygun canlı eksiltme odası bulunamadı.</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Pazar Yeri'nden yeni bir satın alma ihalesi açabilir veya tedarikçi olarak aktif odaları takip edebilirsiniz.
        </p>
      </div>
    </div>

    <!-- LIVE BIDDING ARENA MODAL -->
    <div v-if="selectedRoom" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div class="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b pb-4 border-slate-100">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> CANLI ODA
              </span>
              <span class="text-xs font-mono text-slate-400 font-bold">{{ selectedRoom.id }}</span>
            </div>
            <h3 class="text-base font-black text-slate-900">{{ selectedRoom.tenderTitle }}</h3>
          </div>
          <button @click="selectedRoom = null" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <!-- Room Live Stats Bar -->
        <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <span class="text-[9px] font-black text-slate-400 uppercase block">BAŞLANGIÇ TAVAN</span>
            <strong class="text-xs font-mono text-slate-500 line-through">{{ selectedRoom.ceilingPrice.toLocaleString('tr-TR') }} ₺</strong>
          </div>
          <div class="bg-emerald-50 rounded-xl py-1 border border-emerald-200">
            <span class="text-[9px] font-black text-emerald-800 uppercase block">GÜNCEL LİDER FİYAT</span>
            <strong class="text-sm sm:text-base font-mono text-emerald-600 font-black">{{ selectedRoom.currentBestBid.toLocaleString('tr-TR') }} ₺</strong>
          </div>
          <div>
            <span class="text-[9px] font-black text-slate-400 uppercase block">KALAN SÜRE</span>
            <strong class="text-xs font-mono font-black text-red-600">{{ formatTime(selectedRoom.remainingSeconds) }}</strong>
          </div>
        </div>

        <!-- Quick Decrement Buttons -->
        <div class="space-y-2">
          <label class="block text-xs font-black text-slate-800 uppercase tracking-wide">
            Hızlı Fiyat İndirimi (- Adım)
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="placeBid(selectedRoom.minStep)"
              class="py-3 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <ArrowDownRight :size="14" class="text-blue-600" />
              <span>-{{ selectedRoom.minStep.toLocaleString('tr-TR') }} ₺</span>
            </button>

            <button
              type="button"
              @click="placeBid(selectedRoom.minStep * 2)"
              class="py-3 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <ArrowDownRight :size="14" class="text-blue-600" />
              <span>-{{ (selectedRoom.minStep * 2).toLocaleString('tr-TR') }} ₺</span>
            </button>

            <button
              type="button"
              @click="placeBid(selectedRoom.minStep * 5)"
              class="py-3 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <Flame :size="14" class="text-emerald-600" />
              <span>-{{ (selectedRoom.minStep * 5).toLocaleString('tr-TR') }} ₺ (Agresif)</span>
            </button>
          </div>
        </div>

        <!-- Custom Bid Input -->
        <div class="space-y-2">
          <label class="block text-xs font-black text-slate-800 uppercase tracking-wide">
            Özel Teklif Tutarı Giriniz (₺)
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="customBidAmount"
              type="text"
              class="flex-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-600"
              placeholder="Örn: 390.000"
            />
            <button
              type="button"
              @click="placeBid()"
              class="px-6 py-3 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <Send :size="14" />
              <span>Teklifi Gönder</span>
            </button>
          </div>
          <p class="text-[10px] text-slate-500 font-medium">
            * Son 2 dakika kala verilen her yeni lider teklif süreyi otomatik olarak <strong>+2 dakika</strong> uzatır (Anti-Sniping).
          </p>
        </div>

        <!-- Live Bidding Feed Log -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ANLIK TEKLİF AKIŞI (CANLI)</span>
          <div class="space-y-1.5 max-h-36 overflow-y-auto">
            <div
              v-for="(log, idx) in bidLog"
              :key="idx"
              class="p-2.5 rounded-xl border flex items-center justify-between text-xs transition"
              :class="log.isMe ? 'bg-emerald-50 border-emerald-200 font-bold text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'"
            >
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] text-slate-400">{{ log.time }}</span>
                <span>{{ log.firm }}</span>
              </div>
              <strong class="font-mono text-slate-900">{{ log.amount.toLocaleString('tr-TR') }} ₺</strong>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end pt-3 border-t border-slate-100">
          <button @click="selectedRoom = null" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer">
            Odadan Ayrıl
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
