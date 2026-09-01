<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  SendHorizonal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Inbox, 
  Send, 
  Star, 
  Scale, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  RotateCw,
  Lock,
  Truck,
  MessageSquare,
  ChevronRight,
  X 
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

function getBidRankStatus(bid: any) {
  const tenderId = bid.tenderId || bid.id
  const matchingGroup = (cmsData.value?.dashboard?.receivedBids || []).find((g: any) => g.id === tenderId || g.baslik === bid.ilanBaslik)
  if (!matchingGroup || !matchingGroup.teklifler || matchingGroup.teklifler.length === 0) {
    return { isLeader: true, leaderPrice: bid.teklifFiyatim, rank: 1, totalBids: 1 }
  }

  const sorted = [...matchingGroup.teklifler].sort((a, b) => {
    const pA = parseInt(String(a.fiyat || '0').replace(/\D/g, '')) || 0
    const pB = parseInt(String(b.fiyat || '0').replace(/\D/g, '')) || 0
    return pA - pB
  })

  const lowest = sorted[0]
  const myPriceNum = parseInt(String(bid.teklifFiyatim || '0').replace(/\D/g, '')) || 0
  const lowestNum = parseInt(String(lowest.fiyat || '0').replace(/\D/g, '')) || 0

  const isLeader = myPriceNum <= lowestNum
  const rank = sorted.findIndex(t => t.id === bid.id || t.firma === bid.bidderName) + 1 || (isLeader ? 1 : 2)

  return {
    isLeader,
    leaderPrice: lowest.fiyat,
    rank,
    totalBids: sorted.length
  }
}

const userSession = ref<any>({})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
    window.addEventListener('storage', () => {
      try {
        userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      } catch (e) {}
    })
  }
})

const teklifler = computed(() => {
  const currentEmail = (userSession.value?.email || '').trim().toLowerCase()
  const currentComp = (userSession.value?.companyName || userSession.value?.company || userSession.value?.name || userSession.value?.username || '').trim().toLowerCase()
  
  const list: any[] = []
  
  // 1. Check localStorage 'mySubmittedBids'
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      stored.forEach((s: any) => {
        list.push({
          id: s.id,
          tenderId: s.tenderId,
          kategori: s.tenderCategory || 'Genel Satın Alma',
          ilanBaslik: s.tenderTitle || 'Satın Alma İhalesi',
          aliciFirma: s.buyerCompany || 'Kurumsal Alıcı',
          teklifFiyatim: s.price || s.teklifFiyatim,
          sure: s.validityDuration || s.sure || '7 gün',
          durum: s.status === 'Onaylandı' ? 'onaylandi' : (s.durum || 'bekliyor'),
          pazarlikGecmisi: s.pazarlikGecmisi || [],
          bidderName: s.bidderName
        })
      })
    } catch (e) {}
  }

  // 2. Check cmsData.value.dashboard.receivedBids for this company/user bids
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  receivedGroups.forEach((g: any) => {
    (g.teklifler || []).forEach((b: any) => {
      const bFirma = (b.firma || '').trim().toLowerCase()
      const bEmail = (b.bidderEmail || '').trim().toLowerCase()
      const isMine = (currentEmail && bEmail && currentEmail === bEmail) || (currentComp && bFirma && (bFirma.includes(currentComp) || currentComp.includes(bFirma)))
      
      if (isMine) {
        const alreadyInList = list.find(item => item.id === b.id || (item.tenderId === g.id && item.teklifFiyatim === b.fiyat))
        if (!alreadyInList) {
          list.push({
            id: b.id,
            tenderId: g.id,
            kategori: g.kategori || 'Genel Satın Alma',
            ilanBaslik: g.baslik,
            aliciFirma: g.ownerCompany || 'Kurumsal Satın Alma Masası',
            teklifFiyatim: b.fiyat,
            sure: b.sure || '7 gün',
            durum: b.durum === 'anlasildi' || b.durum === 'onaylandi' ? 'onaylandi' : 'bekliyor',
            pazarlikGecmisi: b.pazarlikGecmisi || [],
            bidderName: b.firma
          })
        }
      }
    })
  })

  // 3. Clean production state - zero mock fallback injection

  return list
})

// Modal States
const showReviseModal = ref(false)
const selectedBidForRevise = ref<any>(null)
const revisedPrice = ref('')
const revisedNotes = ref('')

const showDisputeModal = ref(false)
const selectedBidForDispute = ref<any>(null)
const disputeReason = ref('Mücbir Sebep - Lojistik ve hammadde tedarik zinciri aksaması')

const showReviewModal = ref(false)
const reviewBuyer = ref<any>(null)
const reviewRating = ref(5)
const reviewComment = ref('')

function openReviseModal(bid: any) {
  selectedBidForRevise.value = bid
  const numericPrice = parseInt((bid.teklifFiyatim || '').replace(/[^0-9]/g, '')) || 0
  revisedPrice.value = numericPrice ? String(Math.round(numericPrice * 0.95)) : ''
  revisedNotes.value = 'Müşteri talebi doğrultusunda revize indirimli teklifimizdir.'
  showReviseModal.value = true
}

async function acceptCounterOffer(teklif: any) {
  // Extract latest counter offer price if available
  let latestPrice = teklif.teklifFiyatim
  if (teklif.pazarlikGecmisi && teklif.pazarlikGecmisi.length > 0) {
    const lastEntry = teklif.pazarlikGecmisi[0]
    if (lastEntry.fiyat) {
      latestPrice = lastEntry.fiyat
    }
  }

  const confirmAccept = confirm(`🎉 Alıcı firmanın ${latestPrice} tutarındaki karşı teklifini kabul edip sözleşmeyi onaylamak istiyor musunuz?\n\nBu işlemle birlikte ihale mutabakatla sonuçlanacak ve sevkiyat süreci başlayacaktır.`)
  if (!confirmAccept) return

  const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  // 1. Mark supplier bid as 'onaylandi'
  teklif.durum = 'onaylandi'
  teklif.teklifFiyatim = latestPrice
  if (!teklif.pazarlikGecmisi) teklif.pazarlikGecmisi = []
  teklif.pazarlikGecmisi.unshift({
    kim: 'Tedarikçi (Siz)',
    mesaj: `✓ Karşı teklif kabul edildi (${latestPrice}). Mutabakat sağlandı.`,
    tarih: now,
    fiyat: latestPrice
  })

  // 2. Sync to matching receivedBid slot in cmsData
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  let matchingGroup = receivedGroups.find((g: any) => g.id === teklif.tenderId || g.baslik === teklif.ilanBaslik)
  if (matchingGroup && matchingGroup.teklifler) {
    matchingGroup.teklifler.forEach((b: any) => {
      if (b.id === teklif.id || b.firma === teklif.bidderName) {
        b.durum = 'onaylandi'
        b.fiyat = latestPrice
        if (!b.pazarlikGecmisi) b.pazarlikGecmisi = []
        b.pazarlikGecmisi.unshift({
          kim: 'Tedarikçi Firma',
          mesaj: `✓ Karşı teklif kabul edildi (${latestPrice}). Mutabakat sağlandı.`,
          tarih: now,
          fiyat: latestPrice
        })
      } else {
        b.durum = 'elendi'
      }
    })
  }

  // 3. Mark the tender as closed
  const tendersList = cmsData.value?.dashboard?.tenders || []
  const tenderObj = tendersList.find((t: any) => t.id === teklif.tenderId || t.baslik === teklif.ilanBaslik)
  if (tenderObj) {
    tenderObj.durum = 'closed'
    tenderObj.sure = 'Sonuçlandı (Mutabakat Sağlandı)'
  }

  // 4. Update localStorage
  if (typeof window !== 'undefined') {
    try {
      const myBids = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      myBids.forEach((mb: any) => {
        if (mb.id === teklif.id || mb.tenderId === teklif.tenderId) {
          mb.status = 'Onaylandı'
          mb.durum = 'onaylandi'
          mb.price = latestPrice
        }
      })
      localStorage.setItem('mySubmittedBids', JSON.stringify(myBids))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {}
  }

  // 5. Create or sync Escrow Orders
  if (!cmsData.value.escrowOrders) cmsData.value.escrowOrders = []
  if (!cmsData.value.dashboard.escrowOrders) cmsData.value.dashboard.escrowOrders = []

  const numVal = parseInt(String(latestPrice || '75000').replace(/\D/g, '')) || 75000
  const payoutStr = Math.round(numVal * 0.97).toLocaleString('tr-TR') + ' ₺'
  const commStr = Math.round(numVal * 0.03).toLocaleString('tr-TR') + ' ₺'

  const orderItem = {
    id: 'ORD-2026-' + (teklif.tenderId ? String(teklif.tenderId).replace(/\D/g, '') : Math.floor(100 + Math.random() * 900)),
    orderCode: 'SIP-2026-' + Math.floor(1000 + Math.random() * 9000),
    tenderId: teklif.tenderId || 'IHC-2026-178',
    tenderTitle: teklif.ilanBaslik,
    buyerCompany: teklif.aliciFirma || userSession.value?.companyName || 'Kurumsal Alıcı Firma',
    buyerFirm: teklif.aliciFirma || userSession.value?.companyName || 'Kurumsal Alıcı Firma',
    buyerEmail: 'alituran44@gmail.com',
    supplierCompany: teklif.firma || 'Ata Akademi San. Tic. A.Ş.',
    supplierFirm: teklif.firma || 'Ata Akademi San. Tic. A.Ş.',
    supplierEmail: 'tedarikci@gmail.com',
    totalAmount: latestPrice,
    amount: latestPrice,
    numericAmount: numVal,
    payoutAmount: payoutStr,
    commissionAmount: commStr,
    commissionRate: 3,
    status: 'HAVUZDA_BLOKE',
    statusLabel: 'Güvenli Havuzda Bloke Edildi',
    escrowStatus: 'havuzda_bloke',
    trackingNumber: 'YK-' + Math.floor(1000000 + Math.random() * 9000000),
    trackingCode: 'YK-' + Math.floor(1000000 + Math.random() * 9000000),
    carrier: 'Yurtiçi Kargo / Borusan Lojistik',
    shippingCompany: 'Yurtiçi Kargo & Borusan Lojistik',
    deliveryDate: '3 iş günü',
    notes: 'İhale mutabakatı tamamlandı. Havuz ödemesi bloke edildi.',
    paymentMethod: 'PayTR / iyzico 3D Güvenli Havuz',
    createdAt: new Date().toLocaleDateString('tr-TR'),
    updatedAt: 'Şimdi'
  }

  const existingRoot = cmsData.value.escrowOrders.find((o: any) => o.tenderId === teklif.tenderId || o.tenderTitle === teklif.ilanBaslik)
  if (!existingRoot) cmsData.value.escrowOrders.unshift(orderItem)

  const existingDash = cmsData.value.dashboard.escrowOrders.find((o: any) => o.tenderId === teklif.tenderId || o.tenderTitle === teklif.ilanBaslik)
  if (!existingDash) cmsData.value.dashboard.escrowOrders.unshift(orderItem)

  if (typeof window !== 'undefined') {
    try {
      const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
      myTenders.forEach((mt: any) => {
        if (mt.id === teklif.tenderId || mt.baslik === teklif.ilanBaslik) {
          mt.durum = 'closed'
          mt.statusLabel = 'Sonuçlandı (Mutabakat Sağlandı)'
        }
      })
      localStorage.setItem('myTenders', JSON.stringify(myTenders))
    } catch (e) {}
  }

  saveCmsData(cmsData.value)

  // Send NetGSM SMS to buyer
  await sendSms({
    recipientPhone: '+90 532 000 11 22',
    recipientName: teklif.aliciFirma,
    templateName: 'Karşı Teklif Kabulü Bildirimi',
    messageBody: `Sayın Yetkili, "${teklif.ilanBaslik}" ihalesinde ilettiğiniz ${latestPrice} karşı teklif tedarikçi tarafından KABUL EDİLMİŞTİR. İhale mutabakatla sonuçlanmıştır.`
  })

  alert(`✓ MUTABAKAT SAĞLANDI!\n\n"${teklif.ilanBaslik}" ihalesinde ${latestPrice} tutarında anlaşma onaylandı. Sevkiyat ve faturalandırma aşamasına geçebilirsiniz.`)
}

async function rejectCounterOffer(teklif: any) {
  const confirmReject = confirm(`Alıcı firmanın karşı teklifini reddetmek istediğinize emin misiniz?`)
  if (!confirmReject) return

  teklif.durum = 'reddedildi'
  const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (!teklif.pazarlikGecmisi) teklif.pazarlikGecmisi = []
  teklif.pazarlikGecmisi.unshift({
    kim: 'Tedarikçi (Siz)',
    mesaj: '✕ Karşı teklif reddedildi.',
    tarih: now
  })

  saveCmsData(cmsData.value)
  alert('Karşı teklif reddedildi.')
}

async function submitRevise() {
  if (!revisedPrice.value) {
    alert('Lütfen revize teklif tutarınızı giriniz.')
    return
  }

  const bid = selectedBidForRevise.value
  const formattedPrice = Number(revisedPrice.value).toLocaleString('tr-TR') + ' ₺'
  const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  bid.teklifFiyatim = formattedPrice
  bid.durum = 'pazarlik_geldi'
  if (!bid.pazarlikGecmisi) bid.pazarlikGecmisi = []

  bid.pazarlikGecmisi.unshift({
    kim: 'Tedarikçi (Siz)',
    mesaj: `Tedarikçi Karşı Teklifi / Pazarlık Yanıtı: ${formattedPrice} — ${revisedNotes.value}`,
    tarih: now,
    fiyat: formattedPrice
  })

  // Sync to matching receivedBid slot for the buyer
  let matchingSlot = (cmsData.value.dashboard.receivedBids || []).find(
    (g: any) => g.id === bid.tenderId || g.baslik === bid.ilanBaslik
  )
  if (matchingSlot && matchingSlot.teklifler) {
    const matchingOffer = matchingSlot.teklifler.find((t: any) => t.id === bid.id)
    if (matchingOffer) {
      matchingOffer.fiyat = formattedPrice
      matchingOffer.durum = 'pazarlik_geldi'
      if (!matchingOffer.pazarlikGecmisi) matchingOffer.pazarlikGecmisi = []
      matchingOffer.pazarlikGecmisi.unshift({
        kim: 'Tedarikçi Firma (Pazarlık Yanıtı)',
        mesaj: `Tedarikçi Karşı Teklifi: ${formattedPrice} — ${revisedNotes.value}`,
        tarih: now,
        fiyat: formattedPrice
      })
    }
  }

  saveCmsData(cmsData.value)

  // Send NetGSM SMS to buyer
  await sendSms({
    recipientPhone: '+90 532 000 11 22',
    recipientName: bid.aliciFirma,
    templateName: 'Revize Teklif Bildirimi',
    messageBody: `Sayın Yetkili, "${bid.ilanBaslik}" ihalesinde tedarikçi ${formattedPrice} tutarında revize indirimli teklif sunmuştur.`
  })

  showReviseModal.value = false
  alert(`🎉 REVİZE TEKLİFİNİZ İLETİLDİ!\n\n"${bid.ilanBaslik}" ihalesine ${formattedPrice} tutarındaki güncel teklifiniz alıcı firmaya sunulmuştur.`)
}

function openDisputeModal(bid: any) {
  selectedBidForDispute.value = bid
  showDisputeModal.value = true
}

function submitDispute() {
  const newDispute = {
    id: 'DSP-2026-' + Math.floor(100 + Math.random() * 900),
    tenderTitle: selectedBidForDispute.value?.ilanBaslik,
    contractId: 'SZL-' + Math.floor(1000 + Math.random() * 9000),
    parties: `Tedarikçi (Siz) ⟷ ${selectedBidForDispute.value?.aliciFirma}`,
    amount: selectedBidForDispute.value?.teklifFiyatim,
    reason: disputeReason.value,
    status: 'INCELENIYOR',
    requestedBy: 'Tedarikçi Firma (Siz)',
    date: new Date().toLocaleString('tr-TR')
  }

  if (!cmsData.value.dashboard.disputes) {
    cmsData.value.dashboard.disputes = []
  }
  cmsData.value.dashboard.disputes.unshift(newDispute)
  saveCmsData(cmsData.value)

  showDisputeModal.value = false
  alert(`⚖️ MÜCBİR SEBEP & İPTAL TALEBİNİZ ALINDI\n\nTalep No: ${newDispute.id}\nİhale: ${newDispute.tenderTitle}\n\nHakem heyeti durumu inceleyerek cezai şartsız fesih sürecini işletecektir.`)
}

function openReviewModal(bid: any) {
  reviewBuyer.value = bid
  reviewRating.value = 5
  reviewComment.value = ''
  showReviewModal.value = true
}

function submitReview() {
  const newReview = {
    id: 'REV-' + Math.floor(100 + Math.random() * 900),
    companyName: reviewBuyer.value?.aliciFirma,
    rating: reviewRating.value,
    reviewer: 'Doğrulanmış B2B Tedarikçi',
    tags: ['Zamanında Ödeme', 'Net Şartname', 'Kolay İletişim'],
    comment: reviewComment.value || 'Alıcı firma ödemesini zamanında havuzdan serbest bıraktı.',
    date: new Date().toLocaleDateString('tr-TR')
  }

  if (!cmsData.value.dashboard.companyReviews) {
    cmsData.value.dashboard.companyReviews = []
  }
  cmsData.value.dashboard.companyReviews.unshift(newReview)
  saveCmsData(cmsData.value)

  showReviewModal.value = false
  alert(`⭐ DEĞERLENDİRMENİZ KAYDEDİLDİ!\n\n${reviewBuyer.value?.aliciFirma} firmasına verdiğiniz ${reviewRating.value} yıldızlı puan kaydedildi.`)
}
</script>

<template>
  <div class="p-3 sm:p-6 max-w-5xl mx-auto text-left space-y-6">

    <!-- Başlık -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          Verdiğim Teklifler (Yaptığım)
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          İhalelere verdiğiniz tekliflerin durumunu, karşı teklifleri ve onaylanan sözleşmeleri takip edin.
        </p>
      </div>

      <NuxtLink
        to="/panel/pazar-yeri"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs shadow-md transition self-start sm:self-auto"
      >
        <SendHorizonal :size="14" />
        Pazar Yerinde İhalelere Teklif Ver
      </NuxtLink>
    </div>

    <!-- Hızlı Geçiş Segment Sekmeleri -->
    <div class="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
      <NuxtLink
        to="/panel/gelen-teklifler"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
      >
        <Inbox :size="15" class="text-slate-400" />
        <span>Aldığım Teklifler (Gelen)</span>
      </NuxtLink>
      <NuxtLink
        to="/panel/yaptigim-teklifler"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-sm transition-all bg-white text-[#003057]"
      >
        <Send :size="15" class="text-[#1EAE4C]" />
        <span>Verdiğim Teklifler (Yaptığım)</span>
      </NuxtLink>
    </div>

    <!-- Bilgi Notu -->
    <div
      class="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-bold shadow-2xs"
      style="background: rgba(0,48,87,0.05); border: 1px solid rgba(0,48,87,0.1); color: #003057;"
    >
      <Eye :size="16" style="color: #1EAE4C;" class="shrink-0" />
      <span>
        Teklifiniz alıcı tarafından kabul edildiğinde veya karşı teklif verildiğinde anlık SMS ve e-posta bildirimi iletilir.
      </span>
    </div>

    <!-- Teklif Kartları Listesi -->
    <div v-if="teklifler.length > 0" class="space-y-4">
      <div
        v-for="teklif in teklifler"
        :key="teklif.id"
        class="rounded-3xl border bg-white p-4 sm:p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
        :class="teklif.durum === 'onaylandi' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">{{ teklif.kategori }}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">{{ teklif.id }}</span>
            </div>
            <h3 class="text-base font-black text-slate-900">{{ teklif.ilanBaslik }}</h3>
            <p class="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>Alıcı Firma: <strong>{{ teklif.aliciFirma }}</strong></span>
              <span>•</span>
              <span class="flex items-center gap-1"><Clock :size="12" /> Teslimat: {{ teklif.sure }}</span>
            </p>
          </div>

          <div class="flex items-center gap-3 justify-between sm:justify-end">
            <div class="text-right">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Verdiğiniz Teklif:</span>
              <span class="text-lg font-black font-mono text-slate-900">{{ teklif.teklifFiyatim }}</span>
            </div>

            <!-- Durum Rozeti -->
            <span
              class="rounded-xl px-3.5 py-1.5 text-xs font-black shrink-0"
              :class="{
                'bg-emerald-100 text-emerald-800 border border-emerald-300': teklif.durum === 'onaylandi',
                'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse': teklif.durum === 'pazarlik',
                'bg-red-100 text-red-800 border border-red-200': teklif.durum === 'reddedildi',
                'bg-slate-100 text-slate-600': teklif.durum === 'bekliyor'
              }"
            >
              {{ 
                teklif.durum === 'onaylandi' ? 'Kabul Edildi' :
                teklif.durum === 'pazarlik' ? 'Karşı Teklif Geldi' :
                teklif.durum === 'reddedildi' ? 'Reddedildi' : 'Değerlendiriliyor'
              }}
            </span>

            <!-- Eylem Butonları (Karşı Teklif Geldiğinde Onayla veya Pazarlık Yap) -->
            <div class="flex items-center gap-2 flex-wrap justify-end">
              
              <!-- ⚡ KARŞI TEKLİF GELDİĞİNDE: 1. ONAYLA (KABUL ET) | 2. PAZARLIK YAP (REVİZE TEKLİF) | 3. REDDET -->
              <template v-if="teklif.durum === 'pazarlik'">
                <button
                  type="button"
                  @click="acceptCounterOffer(teklif)"
                  class="rounded-xl px-3.5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  title="Alıcının önerdiği karşı teklifi kabul et ve ihaleyi kazan"
                >
                  <CheckCircle2 :size="13" />
                  <span>Karşı Teklifi Kabul Et (Onayla)</span>
                </button>

                <button
                  type="button"
                  @click="openReviseModal(teklif)"
                  class="rounded-xl px-3 py-2 text-xs font-black bg-amber-400 hover:bg-amber-500 text-slate-950 transition shadow-sm flex items-center gap-1.5 cursor-pointer border border-amber-300"
                  title="Farklı bir indirimli teklif sun"
                >
                  <RotateCw :size="13" />
                  <span>Pazarlık Yap (Revize Ver)</span>
                </button>

                <button
                  type="button"
                  @click="rejectCounterOffer(teklif)"
                  class="rounded-xl px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                  title="Karşı teklifi reddet"
                >
                  <X :size="13" />
                </button>
              </template>

              <!-- REDDEDİLDİYSE VEYA BEKLİYORSA YENİDEN REVİZE VER -->
              <template v-else-if="teklif.durum === 'reddedildi' || teklif.durum === 'bekliyor'">
                <button
                  type="button"
                  @click="openReviseModal(teklif)"
                  class="rounded-xl px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <RotateCw :size="12" />
                  <span>Teklifi Güncelle / Revize Et</span>
                </button>
              </template>

              <!-- ONAYLANDIYSA DEĞERLENDİRME & MÜCBİR SEBEP -->
              <template v-else-if="teklif.durum === 'onaylandi'">
                <button
                  type="button"
                  @click="openReviewModal(teklif)"
                  class="rounded-xl px-3 py-2 text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 flex items-center gap-1 shadow-2xs"
                >
                  <Star :size="13" class="text-amber-500 fill-amber-500" />
                  <span>Puanla</span>
                </button>
                <button
                  type="button"
                  @click="openDisputeModal(teklif)"
                  class="rounded-xl px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200"
                  title="Mücbir Sebep İptali Bildir"
                >
                  <Scale :size="13" />
                </button>
              </template>

            </div>
          </div>
        </div>

        <!-- 🟢 KABUL EDİLDİYSE: ALICI FİRMA AÇILAN İRTİBAT KARTI & ESCROW HAVUZ DURUMU -->
        <div v-if="teklif.durum === 'onaylandi'" class="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-2 gap-2">
            <span class="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 :size="15" class="text-emerald-600" />
              ALICI FİRMA DOĞRUDAN İLETİŞİM & SEVKİYAT DETAYLARI (AÇILDI)
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <Lock :size="11" class="text-emerald-600" />
                <span>Alıcı Ödemesi Havuzda Güvencede</span>
              </span>
              <NuxtLink
                to="/panel/siparis-teslimat"
                class="text-[11px] font-black text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1"
              >
                <Truck :size="13" class="text-blue-600" />
                <span>Sevkiyatı Başlat (İrsaliye Gir)</span>
                <ChevronRight :size="12" />
              </NuxtLink>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">Alıcı Yetkilisi</span>
              <strong class="text-slate-800">{{ teklif.yetkili || 'Ahmet Yılmaz' }}</strong>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">İletişim Telefonu</span>
              <a :href="`tel:${teklif.telefon || '+908508408695'}`" class="text-blue-600 font-bold hover:underline">{{ teklif.telefon || '0850 840 86 95' }}</a>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">E-Posta</span>
              <a :href="`mailto:${teklif.eposta || 'satinlama@firma.com'}`" class="text-blue-600 font-bold hover:underline">{{ teklif.eposta || 'satinlama@firma.com' }}</a>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">Sevkiyat / Fatura Adresi</span>
              <strong class="text-slate-800">{{ teklif.adres || 'Bahçelievler Mah. Balıkesir' }}</strong>
            </div>
          </div>
        </div>

        <!-- Pazarlık Geçmişi Kutusu -->
        <div v-if="teklif.pazarlikGecmisi && teklif.pazarlikGecmisi.length > 0" class="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1.5">
          <span class="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <MessageSquare :size="12" />
            <span>Pazarlık & Karşı Teklif Geçmişi</span>
          </span>
          <div v-for="(paz, pIdx) in teklif.pazarlikGecmisi" :key="pIdx" class="flex justify-between items-center text-slate-700 bg-white p-2 rounded-lg border border-amber-100">
            <span><strong>{{ paz.kim }}:</strong> {{ paz.mesaj }}</span>
            <span class="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{{ paz.tarih }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- CLEAN EMPTY STATE -->
    <div v-else class="rounded-3xl border bg-white p-12 sm:p-16 text-center space-y-4 shadow-xs border-slate-200">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
        <Send :size="24" />
      </div>
      <div class="space-y-1 max-w-md mx-auto">
        <h3 class="text-sm font-black text-slate-800">Henüz Bir İhaleye Teklif Vermediniz</h3>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          Pazar yerindeki aktif B2B satın alma ihalelerini inceleyerek şartnamelerine uygun ilk teklifinizi hemen sunabilirsiniz.
        </p>
      </div>
      <div class="pt-1">
        <NuxtLink
          to="/panel/pazar-yeri"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-sm"
        >
          <Send :size="14" />
          <span>Pazar Yerini İncele ↗</span>
        </NuxtLink>
      </div>
    </div>

    <!-- MODAL 1: REVİZE TEKLİF VERME -->
    <div v-if="showReviseModal && selectedBidForRevise" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span class="text-xs font-black text-[#1EAE4C] uppercase tracking-wider">REVİZE TEKLİF</span>
            <h3 class="text-base font-black text-slate-900 mt-0.5">{{ selectedBidForRevise.ilanBaslik }}</h3>
          </div>
          <button @click="showReviseModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-4">
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-500">Mevcut Teklifiniz:</span>
              <strong class="font-mono text-slate-900">{{ selectedBidForRevise.teklifFiyatim }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Alıcı Firma:</span>
              <strong class="text-slate-800">{{ selectedBidForRevise.aliciFirma }}</strong>
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              YENİ / REVİZE İNDİRİMLİ FİYATINIZ (₺) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-[#1EAE4C] text-sm">₺</span>
              <input
                v-model="revisedPrice"
                type="number"
                placeholder="Örn: 1.150.000"
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-[#1EAE4C] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              REVİZE ŞARTLARINIZ & NOTUNUZ
            </label>
            <textarea
              v-model="revisedNotes"
              rows="3"
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#1EAE4C] focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            @click="showReviseModal = false"
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="submitRevise"
            class="w-2/3 py-3 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Revize Teklifi Alıcıya İlet</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: MÜCBİR SEBEP & İPTAL TALEBİ -->
    <div v-if="showDisputeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div class="flex items-center gap-2">
            <Scale :size="20" class="text-red-600" />
            <h3 class="text-base font-black text-slate-900">Mücbir Sebep & Fesih Talebi</h3>
          </div>
          <button @click="showDisputeModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-500 leading-relaxed">
            Ağır kaza, yangın, iflas veya uluslararası hammadde tedarik zinciri aksaması durumunda gerekçeli fesih talebinizi hakem heyetine iletebilirsiniz.
          </p>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">MÜCBİR SEBEP GEREKÇESİ *</label>
            <textarea
              v-model="disputeReason"
              rows="4"
              class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-red-500"
              placeholder="Gerekçenizi detaylıca açıklayınız..."
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button @click="showDisputeModal = false" class="px-4 py-2.5 rounded-xl border text-xs font-bold text-slate-600">
            Vazgeç
          </button>
          <button
            @click="submitDispute"
            class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md"
          >
            Hakem Heyetine Gönder
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 3: DEĞERLENDİRME -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <span class="text-xs font-black text-amber-600 uppercase">ALICIYI DEĞERLENDİR</span>
            <h3 class="text-base font-black text-slate-900 mt-0.5">{{ reviewBuyer?.aliciFirma }}</h3>
          </div>
          <button @click="showReviewModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="text-center py-2 bg-slate-50 rounded-2xl">
            <span class="text-[10px] font-bold text-slate-400 block mb-1">PUANINIZ</span>
            <div class="flex items-center justify-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="reviewRating = star"
                class="p-1 hover:scale-125 transition cursor-pointer"
              >
                <Star :size="24" :class="star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">GÖRÜŞÜNÜZ</label>
            <textarea
              v-model="reviewComment"
              rows="3"
              placeholder="Alıcı firmanın mal kabul hızı ve ödeme onayını değerlendiriniz..."
              class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-[#1EAE4C]"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button @click="showReviewModal = false" class="px-4 py-2.5 rounded-xl border text-xs font-bold text-slate-600">
            Kapat
          </button>
          <button
            @click="submitReview"
            class="px-5 py-2.5 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs shadow-md"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
