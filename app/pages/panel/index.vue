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
  ShieldCheck
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

const verified = ref(false)
const companyName = ref('Ali Turan')

// Firmanın İhalesine Gelen Teklifler ve Pazarlık Masası
const incomingBids = ref([
  {
    id: 101,
    tenderTitle: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
    tenderId: 1,
    bidderFirm: 'TeknoBilişim Dağıtım Ltd. Şti.',
    verified: true,
    bidAmount: 5120000,
    originalValue: 5500000,
    savings: '%6.9 Tasarruf',
    deliveryDays: 14,
    notes: 'TSE belgeli 3 yıl yerinde garantili teslimat.',
    status: 'Yeni Teklif ⚡',
    timeAgo: '12 dk önce',
    negotiationHistory: []
  },
  {
    id: 102,
    tenderTitle: 'Üretim Tesisi Çatı ve İzolasyon Yenileme İşi',
    tenderId: 2,
    bidderFirm: 'Marmara Yapı & İzolasyon A.Ş.',
    verified: true,
    bidAmount: 1140000,
    originalValue: 1250000,
    savings: '%8.8 Tasarruf',
    deliveryDays: 20,
    notes: 'Yangın dayanımlı taşyünü ve membran kaplama dahildir.',
    status: 'Pazarlık Sürecinde 💬',
    timeAgo: '45 dk önce',
    negotiationHistory: [
      { sender: 'Siz', text: 'Birim fiyatı 1.100.000 ₺ yapabilirseniz hemen onaylayacağız.', price: 1100000, date: '1 saat önce' }
    ]
  },
  {
    id: 103,
    tenderTitle: '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi',
    tenderId: 4,
    bidderFirm: 'Anadolu Ambalaj & Koli Sanayi',
    verified: true,
    bidAmount: 318000,
    originalValue: 350000,
    savings: '%9.1 Tasarruf',
    deliveryDays: 10,
    notes: 'Numune baskı 48 saatte onayınıza sunulur.',
    status: 'Yeni Teklif ⚡',
    timeAgo: '2 saat önce',
    negotiationHistory: []
  }
])

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
  bid.status = 'Teklif Kabul Edildi ✓'
  alert(`🎉 TEBRİKLER!\n\n${bid.bidderFirm} firmasının teklifini kabul ettiniz. Sözleşme ve onay aşamasına geçilmiştir.`)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      verified.value = !!session.verified
      if (session.company) {
        companyName.value = session.company
      }
    } catch (e) {
      console.error('Error parsing session', e)
    }
  }
})
</script>

<template>
  <div>
    <!-- VERIFIED DASHBOARD (Normal Panel) -->
    <div v-if="verified" class="space-y-6">
      
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
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052FF] text-[10px] font-black uppercase tracking-wider mb-1.5">
              <span>💬 CANLI PAZARLIK & TEKLİF AKIŞI</span>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
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

            <!-- Action Buttons: Fiyat Pazarlığı Yap & Kabul Et -->
            <div class="pt-2 flex items-center gap-2 border-t border-slate-200">
              <button
                type="button"
                @click="openNegotiationModal(bid)"
                class="flex-1 py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>💬 Pazarlık</span>
              </button>
              <button
                type="button"
                @click="acceptBid(bid)"
                class="flex-1 py-2 px-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>✓ Kabul Et</span>
              </button>
            </div>
          </div>
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
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-4 text-center" style="border-color: #E2E8F0;">
            <NuxtLink 
              to="/firma-dogrulama"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 shadow-lg shadow-blue-500/20 transition"
            >
              {{ 'Doğrulamaya Git →' }}
            </NuxtLink>
            <button 
              type="button"
              @click="verified = true"
              class="w-full border rounded-xl py-3 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
              style="border-color: #E2E8F0; color: #64748B;"
            >
              {{ 'Hızlı İnceleme Modu (Demo)' }}
            </button>
            <p class="text-[9px] text-slate-400 leading-normal max-w-[220px] mx-auto">
              {{ 'Erteleme yalnızca bu hatırlatmayı giderir; ihale işlemleri doğrulama tamamlanana kadar kilitlidir.' 
              }}
            </p>
          </div>

          <!-- Verification Summary Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ 'DOĞRULAMA ÖZETİ' }}
            </h4>
            <span class="text-xs font-bold text-slate-700 block">
              {{ 'Tamamlanması gereken adımlar var' }}
            </span>
            <p class="text-[10px] text-slate-400 leading-relaxed bg-slate-50 border p-3 rounded-xl">
              {{ 'Evraklarınızı yükleyerek 1 iş günü içinde onay alabilirsiniz.' 
              }}
            </p>
          </div>

          <!-- Neler Etkilenir Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ 'NELER ETKİLENİR?' }}
            </h4>
            
            <div class="space-y-2.5">
              
              <!-- Item 1: İhale Oluşturma -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'İhale oluşturma' }}</span>
              </div>

              <!-- Item 2: Teklif Verme -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'Teklif verme' }}</span>
              </div>

              <!-- Item 3: Sözleşme ve Teslimat -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'Sözleşme ve teslimat takibi' }}</span>
              </div>

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
            <div class="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-600 uppercase tracking-wider block">B2B FİYAT PAZARLIĞI</span>
              <h3 class="text-sm font-black text-slate-900">Tedarikçi ile Pazarlık & Karşı Teklif</h3>
            </div>
          </div>
          <button @click="showNegotiationModal = false" class="text-slate-400 hover:text-slate-700 transition">
            ✕
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
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="submitCounterOffer"
            class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <span>💬 Karşı Teklifi İlet</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
