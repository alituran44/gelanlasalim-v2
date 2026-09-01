<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  ArrowRight,
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  FileText,
  AlertTriangle,
  Scale,
  Clock,
  ExternalLink,
  Download,
  UploadCloud,
  X,
  Info,
  DollarSign,
  ChevronRight,
  RotateCcw
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const searchQuery = ref('')
const activeTab = ref<'all' | 'HAVUZDA_BLOKE' | 'SEVKIYATTA' | 'MAL_KABUL_BEKLIYOR' | 'TAMAMLANDI' | 'UYUSMAZLIK'>('all')

const orders = computed(() => {
  const list: any[] = []
  const seenIds = new Set()

  // 1. Check cmsData.value.dashboard.escrowOrders
  const dOrders = cmsData.value?.dashboard?.escrowOrders || []
  dOrders.forEach((o: any) => {
    if (!seenIds.has(o.id || o.tenderId)) {
      seenIds.add(o.id || o.tenderId)
      list.push(o)
    }
  })

  // 2. Check cmsData.value.escrowOrders
  const rootOrders = cmsData.value?.escrowOrders || []
  rootOrders.forEach((o: any) => {
    if (!seenIds.has(o.id || o.tenderId)) {
      seenIds.add(o.id || o.tenderId)
      list.push(o)
    }
  })

  // 3. Check receivedBids for any approved offers
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  receivedGroups.forEach((group: any) => {
    if (group.teklifler) {
      const approved = group.teklifler.find((t: any) => t.durum === 'onaylandi' || t.durum === 'anlasildi')
      if (approved && !seenIds.has(group.id)) {
        seenIds.add(group.id)
        const numVal = parseInt(String(approved.fiyat || '75000').replace(/\D/g, '')) || 75000
        list.unshift({
          id: 'ORD-2026-' + (group.id ? group.id.replace(/\D/g, '') : Math.floor(100 + Math.random() * 900)),
          orderCode: 'SIP-2026-' + Math.floor(1000 + Math.random() * 9000),
          tenderId: group.id,
          tenderTitle: group.baslik,
          buyerFirm: group.ownerCompany || userSession.value?.companyName || 'Kurumsal Alıcı Firma',
          buyerCompany: group.ownerCompany || userSession.value?.companyName || 'Kurumsal Alıcı Firma',
          supplierFirm: approved.firma,
          supplierCompany: approved.firma,
          totalAmount: approved.fiyat,
          amount: approved.fiyat,
          numericAmount: numVal,
          payoutAmount: Math.round(numVal * 0.97).toLocaleString('tr-TR') + ' ₺',
          commissionAmount: Math.round(numVal * 0.03).toLocaleString('tr-TR') + ' ₺',
          commissionRate: 3,
          status: 'HAVUZDA_BLOKE',
          statusLabel: 'Güvenli Havuzda Bloke Edildi',
          trackingCode: 'YK-8829104',
          trackingNumber: 'YK-8829104',
          shippingCompany: 'Yurtiçi Kargo & Borusan Lojistik',
          carrier: 'Yurtiçi Kargo & Borusan Lojistik',
          notes: 'İhale başarıyla sonuçlandı. Güvenli havuz ödemesi bloke edildi.',
          createdAt: 'Bugün',
          updatedAt: 'Şimdi'
        })
      }
    }
  })

  return list
})

const filteredOrders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return orders.value.filter(o => {
    if (activeTab.value !== 'all' && o.status !== activeTab.value) {
      return false
    }
    if (q) {
      const matchTitle = (o.tenderTitle || '').toLowerCase().includes(q)
      const matchId = (o.id || '').toLowerCase().includes(q)
      const matchSupplier = (o.supplierFirm || '').toLowerCase().includes(q)
      const matchBuyer = (o.buyerFirm || '').toLowerCase().includes(q)
      const matchTrack = (o.trackingCode || '').toLowerCase().includes(q)
      if (!matchTitle && !matchId && !matchSupplier && !matchBuyer && !matchTrack) return false
    }
    return true
  })
})

// Metrics calculations
const totalEscrowLocked = computed(() => {
  return orders.value
    .filter(o => o.status === 'HAVUZDA_BLOKE' || o.status === 'SEVKIYATTA' || o.status === 'MAL_KABUL_BEKLIYOR')
    .reduce((acc, o) => acc + (o.numericAmount || 0), 0)
})

const totalCompletedVolume = computed(() => {
  return orders.value
    .filter(o => o.status === 'TAMAMLANDI')
    .reduce((acc, o) => acc + (o.numericAmount || 0), 0)
})

const totalPlatformCommission = computed(() => {
  return orders.value
    .filter(o => o.status === 'TAMAMLANDI')
    .reduce((acc, o) => {
      const comm = (o.numericAmount || 0) * ((o.commissionRate || 3) / 100)
      return acc + comm
    }, 0)
})

// Modal states
const showPaymentModal = ref(false)
const selectedOrderForPayment = ref<any>(null)
const paymentCardNumber = ref('4543 **** **** 8921')
const paymentCardExpiry = ref('12/28')
const paymentCardCvc = ref('***')
const paymentInstallment = ref('6')
const isPaying = ref(false)

const showReleaseModal = ref(false)
const selectedOrderForRelease = ref<any>(null)
const qualityRating = ref(5)
const inspectionNotes = ref('Malzeme şartnameye uygun teslim alındı, seri numaraları ve fatura kontrol edildi.')
const isReleasing = ref(false)

const showShippingModal = ref(false)
const selectedOrderForShipping = ref<any>(null)
const shippingCarrier = ref('Yurtiçi Lojistik / Ambar')
const shippingTracking = ref('')
const shippingNotes = ref('')

const showDisputeModal = ref(false)
const selectedOrderForDispute = ref<any>(null)
const disputeReason = ref('Kusurlu / Eksik Malzeme Muayenesi — Hakem Heyeti İncelemesi Talebi')

// Open Payment Modal
function openPaymentModal(order: any) {
  selectedOrderForPayment.value = order
  showPaymentModal.value = true
}

async function processEscrowPayment() {
  if (!selectedOrderForPayment.value) return
  isPaying.value = true

  setTimeout(async () => {
    isPaying.value = false
    const order = selectedOrderForPayment.value
    order.status = 'HAVUZDA_BLOKE'
    order.updatedAt = 'Şimdi'
    if (!order.history) order.history = []
    order.history.unshift({
      title: `Güvenli Havuz Ödemesi Bloke Edildi (${order.totalAmount})`,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      by: 'İyzico / PayTR Pazaryeri Escrow'
    })

    saveCmsData(cmsData.value)
    showPaymentModal.value = false

    await sendSms({
      recipientPhone: '+90 532 555 01 23',
      recipientName: order.supplierFirm,
      templateName: 'Havuz Ödeme Bloke Bildirimi',
      messageBody: `GÜVENLİ HAVUZ BİLDİRİMİ: "${order.tenderTitle}" ihalesi için ${order.totalAmount} tutarındaki alıcı ödemesi İyzico güvenceli havuz hesabında bloke edilmiştir. Sevkiyata başlayabilirsiniz.`
    })

    alert(`🔒 ÖDEME GÜVENLİ HAVUZDA BLOKE EDİLDİ!\n\n${order.totalAmount} tutarındaki sipariş bedeli İyzico/PayTR BDDK güvenceli havuz hesabına alınmıştır.\nTedarikçi firmaya sevkiyat başlatma bildirimi SMS ile iletildi.`)
  }, 1200)
}

// Open Shipping Modal
function openShippingModal(order: any) {
  selectedOrderForShipping.value = order
  shippingTracking.value = 'IRS-' + Math.floor(10000 + Math.random() * 90000)
  shippingNotes.value = 'Ürünler mühürlü ambalajında sevk edilmiştir.'
  showShippingModal.value = true
}

function submitShipping() {
  if (!shippingTracking.value) {
    alert('Lütfen sevk irsaliyesi veya kargo takip kodunu giriniz.')
    return
  }
  const order = selectedOrderForShipping.value
  order.status = 'MAL_KABUL_BEKLIYOR'
  order.trackingCode = shippingTracking.value
  order.shippingCompany = shippingCarrier.value
  order.shippingDate = 'Bugün'
  order.updatedAt = 'Şimdi'
  if (!order.history) order.history = []
  order.history.unshift({
    title: `Sevkiyat Başlatıldı (${shippingCarrier.value} - ${shippingTracking.value})`,
    date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    by: 'Tedarikçi Firma'
  })

  saveCmsData(cmsData.value)
  showShippingModal.value = false
  alert(`🚚 SEVKİYAT BİLGİSİ KAYDEDİLDİ!\n\nİrsaliye No: ${shippingTracking.value}\nAlıcı firmaya mal kabul ve kalite kontrol bildirimi iletildi.`)
}

// Open Release / Payout Modal
function openReleaseModal(order: any) {
  selectedOrderForRelease.value = order
  showReleaseModal.value = true
}

async function releaseEscrowFunds() {
  if (!selectedOrderForRelease.value) return
  isReleasing.value = true

  setTimeout(async () => {
    isReleasing.value = false
    const order = selectedOrderForRelease.value
    order.status = 'TAMAMLANDI'
    order.updatedAt = 'Şimdi'
    if (!order.history) order.history = []
    order.history.unshift({
      title: `Mal Kabulü Onaylandı ➔ Split Payment: ${order.payoutAmount} Tedarikçi IBAN'ına, ${order.commissionAmount} Komisyon Platforma Aktarıldı ✓`,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      by: 'Alıcı Onayı & İyzico Dağıtım API'
    })

    saveCmsData(cmsData.value)
    showReleaseModal.value = false

    await sendSms({
      recipientPhone: '+90 532 555 01 23',
      recipientName: order.supplierFirm,
      templateName: 'Hakediş Ödeme Transferi',
      messageBody: `TEBRİKLER! "${order.tenderTitle}" siparişinde alıcı mal kabul onayını vermiştir. ${order.payoutAmount} tutarındaki hakedişiniz IBAN hesabınıza transfer edilmiştir.`
    })

    alert(`🎉 HAKEDİŞ BAŞARIYLA AKTARILDI (SPLIT PAYMENT TAMAMLANDI)!\n\n✓ Tedarikçiye Transfer Edilen Hakediş: ${order.payoutAmount}\n✓ İhaleciBurada Platform Komisyonu (%${order.commissionRate}): ${order.commissionAmount}\n\nİşlem zaman damgalı olarak kayıtlara geçmiş ve e-dekont oluşturulmuştur.`)
  }, 1200)
}

// Open Dispute Modal
function openDisputeModal(order: any) {
  selectedOrderForDispute.value = order
  showDisputeModal.value = true
}

function submitDispute() {
  const order = selectedOrderForDispute.value
  order.status = 'UYUSMAZLIK'
  order.updatedAt = 'Şimdi'
  if (!order.history) order.history = []
  order.history.unshift({
    title: `Uyuşmazlık / Hakem Heyeti İncelemesi Başlatıldı (${disputeReason.value})`,
    date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    by: 'Alıcı Firma Talebi'
  })

  // Also add to disputes registry
  if (!cmsData.value.dashboard.disputes) cmsData.value.dashboard.disputes = []
  cmsData.value.dashboard.disputes.unshift({
    id: 'DSP-2026-' + Math.floor(100 + Math.random() * 900),
    tenderTitle: order.tenderTitle,
    contractId: order.id,
    parties: `${order.buyerFirm} ⟷ ${order.supplierFirm}`,
    amount: order.totalAmount,
    reason: disputeReason.value,
    status: 'INCELENIYOR',
    requestedBy: order.buyerFirm,
    date: new Date().toLocaleString('tr-TR')
  })

  saveCmsData(cmsData.value)
  showDisputeModal.value = false
  alert(`⚖️ UYUŞMAZLIK İNCELEMESİ BAŞLATILDI\n\nHavuzdaki ${order.totalAmount} tutarındaki ödeme dondurulmuştur. Platform hakem heyeti ve bilirkişi heyeti inceleme başlatacaktır.`)
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1">
          <ShieldCheck :size="13" />
          <span>TCMB & BDDK MEVZUATINA UYGUN PAZARYERİ GÜVENLİ HAVUZ (ESCROW)</span>
        </div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          Sipariş, Teslimat & Güvenli Havuz (Escrow)
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          İhale mutabakatı sağlanan siparişlerin ödemelerini havuzda güvenceye alın, sevkiyatı izleyin ve mal kabulünde hakedişi aktarın.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <NuxtLink
          to="/sozlesmeler?tab=escrow"
          class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
        >
          <FileText :size="13" class="text-blue-600" />
          <span>Havuz Sözleşmesi</span>
        </NuxtLink>
        <NuxtLink
          to="/panel/gelen-teklifler"
          class="px-4 py-2 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs"
        >
          <span>Gelen Teklifler</span>
          <ArrowRight :size="13" />
        </NuxtLink>
      </div>
    </div>

    <!-- ESCROW STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Card 1: Havuzda Bloke Tutar -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-[#0F223D] to-[#152B4D] text-white shadow-md relative overflow-hidden">
        <div class="flex items-center justify-between text-slate-300 text-xs font-bold">
          <span>Güvenli Havuzda Bloke</span>
          <Lock :size="16" class="text-amber-400" />
        </div>
        <div class="text-2xl font-black font-mono mt-2 text-[#00C2FF]">
          {{ totalEscrowLocked.toLocaleString('tr-TR') }} ₺
        </div>
        <div class="text-[10px] text-slate-300 mt-1 font-medium flex items-center gap-1">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          İyzico / PayTR Korumalı Hesapta
        </div>
      </div>

      <!-- Card 2: Sevkiyatta / Mal Kabul -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Sevkiyat & Mal Kabul</span>
          <Truck :size="16" class="text-blue-600" />
        </div>
        <div class="text-2xl font-black font-mono mt-2 text-slate-900">
          {{ orders.filter(o => o.status === 'SEVKIYATTA' || o.status === 'MAL_KABUL_BEKLIYOR').length }} Sipariş
        </div>
        <div class="text-[10px] text-slate-400 mt-1 font-medium">
          Kargo ve İrsaliye Takibinde
        </div>
      </div>

      <!-- Card 3: Tamamlanan Hacim -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Başarıyla Tamamlanan</span>
          <CheckCircle2 :size="16" class="text-emerald-600" />
        </div>
        <div class="text-2xl font-black font-mono mt-2 text-emerald-600">
          {{ totalCompletedVolume.toLocaleString('tr-TR') }} ₺
        </div>
        <div class="text-[10px] text-slate-400 mt-1 font-medium">
          Hakedişi Dağıtılmış Ticaret
        </div>
      </div>

      <!-- Card 4: Platform Komisyonu -->
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Platform Komisyon Geliri</span>
          <DollarSign :size="16" class="text-[#1EAE4C]" />
        </div>
        <div class="text-2xl font-black font-mono mt-2 text-[#003057]">
          {{ totalPlatformCommission.toLocaleString('tr-TR') }} ₺
        </div>
        <div class="text-[10px] text-slate-400 mt-1 font-medium">
          Otomatik Split Payment Kesintisi
        </div>
      </div>

    </div>

    <!-- TABS & SEARCH -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 bg-white rounded-2xl border p-1.5 shadow-xs overflow-x-auto" style="border-color: #E2E8F0;">
        <button
          @click="activeTab = 'all'"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
          :class="activeTab === 'all' ? 'bg-[#003057] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'"
        >
          Tüm Siparişler ({{ orders.length }})
        </button>
        <button
          @click="activeTab = 'HAVUZDA_BLOKE'"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
          :class="activeTab === 'HAVUZDA_BLOKE' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'"
        >
          <Lock :size="12" />
          <span>Havuzda Bloke ({{ orders.filter(o => o.status === 'HAVUZDA_BLOKE').length }})</span>
        </button>
        <button
          @click="activeTab = 'MAL_KABUL_BEKLIYOR'"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
          :class="activeTab === 'MAL_KABUL_BEKLIYOR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'"
        >
          <Package :size="12" />
          <span>Mal Kabul Bekleyen ({{ orders.filter(o => o.status === 'MAL_KABUL_BEKLIYOR').length }})</span>
        </button>
        <button
          @click="activeTab = 'TAMAMLANDI'"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
          :class="activeTab === 'TAMAMLANDI' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'"
        >
          <CheckCircle2 :size="12" />
          <span>Tamamlanan ({{ orders.filter(o => o.status === 'TAMAMLANDI').length }})</span>
        </button>
      </div>

      <!-- Search Box -->
      <div class="relative flex-1 md:max-w-xs">
        <Search :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Sipariş no, ihale adı, firma..."
          class="w-full rounded-2xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500 font-medium"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

    </div>

    <!-- ORDERS LIST -->
    <div v-if="filteredOrders.length > 0" class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-3xl border bg-white shadow-xs overflow-hidden transition-all hover:shadow-md border-slate-200 text-left"
      >
        <!-- Card Header -->
        <div class="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 shadow-2xs">
                {{ order.id }}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs font-bold text-slate-500 font-mono">İhale: {{ order.tenderId }}</span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs text-slate-400 font-medium">{{ order.createdAt }}</span>
            </div>
            <h2 class="text-base font-black text-slate-900 mt-1">
              {{ order.tenderTitle }}
            </h2>
          </div>

          <!-- Status Badge -->
          <div>
            <span
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs"
              :class="{
                'bg-amber-100 text-amber-900 border border-amber-300': order.status === 'HAVUZDA_BLOKE',
                'bg-blue-100 text-blue-900 border border-blue-300': order.status === 'SEVKIYATTA' || order.status === 'MAL_KABUL_BEKLIYOR',
                'bg-emerald-100 text-emerald-900 border border-emerald-300': order.status === 'TAMAMLANDI',
                'bg-red-100 text-red-900 border border-red-300': order.status === 'UYUSMAZLIK'
              }"
            >
              <Lock v-if="order.status === 'HAVUZDA_BLOKE'" :size="13" />
              <Truck v-else-if="order.status === 'SEVKIYATTA' || order.status === 'MAL_KABUL_BEKLIYOR'" :size="13" />
              <CheckCircle2 v-else-if="order.status === 'TAMAMLANDI'" :size="13" />
              <Scale v-else :size="13" />

              {{
                order.status === 'HAVUZDA_BLOKE' ? 'ÖDEME HAVUZDA BLOKE (GÜVENCEDE)' :
                order.status === 'SEVKIYATTA' ? 'SEVKİYAT AŞAMASINDA' :
                order.status === 'MAL_KABUL_BEKLIYOR' ? 'MAL KABUL & ONAY BEKLİYOR' :
                order.status === 'TAMAMLANDI' ? 'TAMAMLANDI & HAKEDİŞ ÖDENDİ ✓' : 'UYUŞMAZLIK / HAKEM İNCELEMESİ'
              }}
            </span>
          </div>
        </div>

        <!-- 4-STEP LIVE ESCROW STEPPER -->
        <div class="px-6 py-4 bg-white border-b border-slate-100">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            
            <!-- Step 1: Ödeme Bloke -->
            <div class="p-3 rounded-2xl border transition-all" :class="order.status !== 'ODEME_BEKLENIYOR' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'">
              <div class="flex items-center justify-between font-black text-[11px] mb-1">
                <span>01. HAVUZ ÖDEMESİ</span>
                <CheckCircle2 v-if="order.status !== 'ODEME_BEKLENIYOR'" :size="14" class="text-emerald-600" />
                <Lock v-else :size="14" />
              </div>
              <p class="text-[10px] text-slate-500 font-medium leading-snug">İyzico/PayTR Güvenli Havuzunda Bloke</p>
            </div>

            <!-- Step 2: Sevkiyat -->
            <div class="p-3 rounded-2xl border transition-all" :class="['SEVKIYATTA', 'MAL_KABUL_BEKLIYOR', 'TAMAMLANDI'].includes(order.status) ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'">
              <div class="flex items-center justify-between font-black text-[11px] mb-1">
                <span>02. SEVKİYAT</span>
                <CheckCircle2 v-if="['SEVKIYATTA', 'MAL_KABUL_BEKLIYOR', 'TAMAMLANDI'].includes(order.status)" :size="14" class="text-emerald-600" />
                <Truck v-else :size="14" />
              </div>
              <p class="text-[10px] text-slate-500 font-medium leading-snug">{{ order.trackingCode || 'İrsaliye & Kargo Girişi' }}</p>
            </div>

            <!-- Step 3: Mal Kabul & Muayene -->
            <div class="p-3 rounded-2xl border transition-all" :class="['MAL_KABUL_BEKLIYOR', 'TAMAMLANDI'].includes(order.status) ? (order.status === 'MAL_KABUL_BEKLIYOR' ? 'bg-blue-50 border-blue-300 text-blue-900 animate-pulse' : 'bg-emerald-50/60 border-emerald-200 text-emerald-900') : 'bg-slate-50 border-slate-200 text-slate-400'">
              <div class="flex items-center justify-between font-black text-[11px] mb-1">
                <span>03. MAL KABUL</span>
                <CheckCircle2 v-if="order.status === 'TAMAMLANDI'" :size="14" class="text-emerald-600" />
                <Clock v-else :size="14" class="text-blue-600" />
              </div>
              <p class="text-[10px] text-slate-500 font-medium leading-snug">Muayene & Kalite Onayı</p>
            </div>

            <!-- Step 4: Split Payment Hakediş -->
            <div class="p-3 rounded-2xl border transition-all" :class="order.status === 'TAMAMLANDI' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'">
              <div class="flex items-center justify-between font-black text-[11px] mb-1">
                <span>04. HAKEDİŞ AKTARIMI</span>
                <CheckCircle2 v-if="order.status === 'TAMAMLANDI'" :size="14" class="text-emerald-600" />
                <DollarSign v-else :size="14" />
              </div>
              <p class="text-[10px] text-slate-500 font-medium leading-snug">Tedarikçi IBAN + Komisyon</p>
            </div>

          </div>
        </div>

        <!-- Card Body: Parties, Amounts, Actions -->
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Left: Taraflar -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TİCARİ TARAFLAR</span>
              <div>
                <span class="text-slate-400 font-bold block text-[10px]">Alıcı Şirket:</span>
                <strong class="text-slate-800">{{ order.buyerFirm }}</strong>
              </div>
              <div>
                <span class="text-slate-400 font-bold block text-[10px]">Tedarikçi (Satıcı):</span>
                <strong class="text-slate-800">{{ order.supplierFirm }}</strong>
              </div>
            </div>

            <!-- Middle: Finansal Döküm & Split Payment -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">FİNANSAL DÖKÜM (SPLIT PAYMENT)</span>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-medium">Toplam Sipariş Tutarı:</span>
                <strong class="font-mono text-slate-900 text-sm">{{ order.totalAmount }}</strong>
              </div>
              <div class="flex justify-between items-center text-[11px]">
                <span class="text-slate-500">Tedarikçi Hakedişi (%{{ 100 - (order.commissionRate || 3) }}):</span>
                <strong class="font-mono text-emerald-600">{{ order.payoutAmount }}</strong>
              </div>
              <div class="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                <span class="text-slate-500">Platform Komisyonu (%{{ order.commissionRate || 3 }}):</span>
                <strong class="font-mono text-blue-600">{{ order.commissionAmount }}</strong>
              </div>
            </div>

            <!-- Right: Sevkiyat & Not -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SEVKİYAT & BELGELER</span>
              <div>
                <span class="text-slate-400 font-bold block text-[10px]">Kargo / Lojistik:</span>
                <span class="font-bold text-slate-800">{{ order.shippingCompany || 'Belirtilmedi' }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold block text-[10px]">İrsaliye / Takip No:</span>
                <span class="font-mono font-bold text-blue-600">{{ order.trackingCode || '-' }}</span>
              </div>
              <div class="pt-1">
                <span class="text-[11px] text-slate-500 italic block line-clamp-1">"{{ order.notes }}"</span>
              </div>
            </div>

          </div>

          <!-- Bottom Actions Bar -->
          <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Left Info -->
            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck :size="15" class="text-emerald-600 shrink-0" />
              <span>Ödeme Yöntemi: <strong class="text-slate-700">{{ order.paymentMethod }}</strong></span>
            </div>

            <!-- Right Action Buttons -->
            <div class="flex flex-wrap items-center gap-2.5">
              
              <!-- 1. Alıcı Onayı / Mal Kabul & Havuz Çözme Butonu -->
              <button
                v-if="order.status === 'MAL_KABUL_BEKLIYOR' || order.status === 'SEVKIYATTA'"
                type="button"
                @click="openReleaseModal(order)"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <CheckCircle2 :size="14" />
                <span>Malı Teslim Aldım & Hakedişi Onayla</span>
              </button>

              <!-- 2. Tedarikçi İçin: Sevkiyat Girişi Butonu -->
              <button
                v-if="order.status === 'HAVUZDA_BLOKE'"
                type="button"
                @click="openShippingModal(order)"
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Truck :size="14" />
                <span>Sevkiyatı Başlat & İrsaliye Gir</span>
              </button>

              <!-- 3. Ödeme Bekleniyorsa: Güvenli Havuz Ödemesi Butonu -->
              <button
                v-if="order.status === 'ODEME_BEKLENIYOR'"
                type="button"
                @click="openPaymentModal(order)"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00C2FF] text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <CreditCard :size="14" />
                <span>Güvenli Havuz Ödemesi Yap</span>
              </button>

              <!-- 4. Uyuşmazlık / Hakem Heyeti Butonu -->
              <button
                v-if="order.status !== 'TAMAMLANDI' && order.status !== 'UYUSMAZLIK'"
                type="button"
                @click="openDisputeModal(order)"
                class="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Eksik veya kusurlu malzeme durumunda hakem heyetine bildir"
              >
                <Scale :size="13" />
                <span>Uyuşmazlık Bildir</span>
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-3xl border bg-white py-16 px-6 text-center space-y-4 border-slate-200">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        <Package :size="20" />
      </div>
      <div class="space-y-1">
        <h3 class="text-base font-bold text-slate-800">Seçilen Kriterde Sipariş Bulunamadı</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          İhale mutabakatı sağlandığında alıcı ödemeleri ve sevkiyat takip süreçleri bu ekranda otomatik listelenir.
        </p>
      </div>
    </div>

    <!-- =========================================================
         MODAL 1: GÜVENLİ HAVUZ ÖDEMESİ (ESCROW CHECKOUT)
    ========================================================= -->
    <div v-if="showPaymentModal && selectedOrderForPayment" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left animate-fadeIn">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck :size="22" />
            </div>
            <div>
              <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">GÜVENLİ HAVUZ ÖDEMESİ</span>
              <h3 class="text-base font-black text-slate-900">İyzico / PayTR Escrow Güvencesi</h3>
            </div>
          </div>
          <button @click="showPaymentModal = false" class="text-slate-400 hover:text-slate-700 p-2 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">İhale:</span>
            <strong class="text-slate-800">{{ selectedOrderForPayment.tenderTitle }}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Tedarikçi:</span>
            <strong class="text-slate-800">{{ selectedOrderForPayment.supplierFirm }}</strong>
          </div>
          <div class="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold">
            <span class="text-slate-800">Ödenecek Tutar:</span>
            <span class="font-mono text-emerald-600 font-black text-base">{{ selectedOrderForPayment.totalAmount }}</span>
          </div>
        </div>

        <!-- Kart ve Ödeme Formu -->
        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">KART NUMARASI (KURUMSAL / ŞAHSİ)</label>
            <input v-model="paymentCardNumber" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs font-mono font-bold bg-white text-slate-800 border-slate-200 outline-none focus:border-blue-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">SON KULLANMA</label>
              <input v-model="paymentCardExpiry" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs font-mono font-bold bg-white text-slate-800 border-slate-200 outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">CVC / GÜVENLİK</label>
              <input v-model="paymentCardCvc" type="password" class="w-full rounded-xl border px-4 py-2.5 text-xs font-mono font-bold bg-white text-slate-800 border-slate-200 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">TAKSİT SEÇENEĞİ (TÜM TİCARİ KARTLARA)</label>
            <select v-model="paymentInstallment" class="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white text-slate-800 border-slate-200 outline-none">
              <option value="1">Tek Çekim (Peşin Fiyatına)</option>
              <option value="3">3 Taksit (Vade Farksız)</option>
              <option value="6">6 Taksit (Vade Farksız)</option>
              <option value="12">12 Taksit (B2B Kurumsal Kart)</option>
            </select>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-2">
          <Info :size="15" class="text-amber-600 shrink-0 mt-0.5" />
          <span>Ödemeniz doğrudan satıcıya aktarılmaz. Mal teslim edilip onayınız alınana kadar lisanslı ödeme havuzunda güvence altında tutulur.</span>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button @click="showPaymentModal = false" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            Vazgeç
          </button>
          <button
            @click="processEscrowPayment"
            :disabled="isPaying"
            class="px-6 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Lock v-if="!isPaying" :size="13" />
            <span v-if="!isPaying">Havuz Ödemesini Onayla</span>
            <span v-else>İşlem Yapılıyor...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         MODAL 2: MAL KABUL & HAKEDİŞ AKTARIMI (SPLIT PAYMENT)
    ========================================================= -->
    <div v-if="showReleaseModal && selectedOrderForRelease" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left animate-fadeIn">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 :size="22" />
            </div>
            <div>
              <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">MAL KABUL & MUAYENE ONAYI</span>
              <h3 class="text-base font-black text-slate-900">Hakedişi Tedarikçiye Aktar</h3>
            </div>
          </div>
          <button @click="showReleaseModal = false" class="text-slate-400 hover:text-slate-700 p-2 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-600">Tedarikçi Firma:</span>
            <strong class="text-slate-900">{{ selectedOrderForRelease.supplierFirm }}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Serbest Bırakılacak Hakediş:</span>
            <strong class="font-mono text-emerald-700 text-sm font-black">{{ selectedOrderForRelease.payoutAmount }}</strong>
          </div>
          <div class="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-200/60">
            <span>Platform Komisyonu:</span>
            <span class="font-mono font-bold text-blue-600">{{ selectedOrderForRelease.commissionAmount }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">MAL KABUL & MUAYENE NOTU</label>
            <textarea v-model="inspectionNotes" rows="3" class="w-full rounded-xl border p-3 text-xs text-slate-800 border-slate-200 outline-none focus:border-emerald-500 bg-white" placeholder="Malzeme kontrol detaylarını yazınız..."></textarea>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-medium flex items-start gap-2">
          <Info :size="15" class="text-blue-600 shrink-0 mt-0.5" />
          <span>Bu işlemi onayladığınızda, lisanslı ödeme havuzundaki para çözülerek tedarikçinin tanımlı kurumsal IBAN hesabına anında transfer edilecektir.</span>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button @click="showReleaseModal = false" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            Vazgeç
          </button>
          <button
            @click="releaseEscrowFunds"
            :disabled="isReleasing"
            class="px-6 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 v-if="!isReleasing" :size="13" />
            <span v-if="!isReleasing">Mal Kabulü Onayla & Hakedişi Öde</span>
            <span v-else>Para Transfer Ediliyor...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         MODAL 3: SEVKİYAT VE İRSALİYE GİRİŞİ (TEDARİKÇİ)
    ========================================================= -->
    <div v-if="showShippingModal && selectedOrderForShipping" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left animate-fadeIn">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Truck :size="22" />
            </div>
            <div>
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">SEVKİYAT BİLGİSİ GİRİŞİ</span>
              <h3 class="text-base font-black text-slate-900">İrsaliye & Lojistik Takibi</h3>
            </div>
          </div>
          <button @click="showShippingModal = false" class="text-slate-400 hover:text-slate-700 p-2 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">LOJİSTİK / NAKLİYE ŞİRKETİ</label>
            <input v-model="shippingCarrier" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-800 border-slate-200 outline-none" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">SEVK İRSALİYESİ VEYA KARGO TAKİP NO *</label>
            <input v-model="shippingTracking" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs font-mono font-bold text-slate-800 border-slate-200 outline-none focus:border-blue-500" placeholder="Örn: IRS-94821 veya Kargo Kodu" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">SEVKİYAT NOTU</label>
            <textarea v-model="shippingNotes" rows="2" class="w-full rounded-xl border p-3 text-xs text-slate-800 border-slate-200 outline-none bg-white"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button @click="showShippingModal = false" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            Vazgeç
          </button>
          <button
            @click="submitShipping"
            class="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
          >
            <Truck :size="14" />
            <span>Sevkiyatı Başlat</span>
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         MODAL 4: UYUŞMAZLIK / HAKEM HEYETİ BİLDİRİMİ
    ========================================================= -->
    <div v-if="showDisputeModal && selectedOrderForDispute" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left animate-fadeIn">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Scale :size="22" />
            </div>
            <div>
              <span class="text-[9px] font-black text-red-600 uppercase tracking-wider block">UYUŞMAZLIK BİLDİRİMİ</span>
              <h3 class="text-base font-black text-slate-900">Escrow Hakem Heyeti İncelemesi</h3>
            </div>
          </div>
          <button @click="showDisputeModal = false" class="text-slate-400 hover:text-slate-700 p-2 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-red-50/60 border border-red-200 text-xs text-red-900 space-y-1.5 font-medium">
          <p>Uyuşmazlık bildirildiğinde havuzdaki <strong>{{ selectedOrderForDispute.totalAmount }}</strong> tutarındaki ödeme dondurulur ve tarafların sunduğu irsaliye/şartname belgeleri incelenir.</p>
        </div>

        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">UYUŞMAZLIK SEBEBİ</label>
          <textarea v-model="disputeReason" rows="3" class="w-full rounded-xl border p-3 text-xs text-slate-800 border-slate-200 outline-none focus:border-red-500 bg-white"></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button @click="showDisputeModal = false" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            Vazgeç
          </button>
          <button
            @click="submitDispute"
            class="px-6 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
          >
            <Scale :size="14" />
            <span>Hakem Heyetine İlet</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
