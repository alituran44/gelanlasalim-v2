<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Inbox, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Clock, 
  Building2, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  RotateCcw,
  Sparkles,
  Award,
  MessageSquare,
  Lock,
  X
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const expandedIlan = ref<string | null>(route.query.ilan as string || null)

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const ilanlar = computed(() => cmsData.value?.dashboard?.receivedBids || [])

function toggle(id: string) {
  expandedIlan.value = expandedIlan.value === id ? null : id
}

// Modal States
const showNegotiationModal = ref(false)
const selectedTeklifForNegotiation = ref<any>(null)
const currentIlan = ref<any>(null)
const counterOfferPrice = ref('')
const counterOfferNotes = ref('')

const showDisputeModal = ref(false)
const selectedIlanForDispute = ref<any>(null)
const disputeReason = ref('Mücbir Sebep - Tedarik zinciri aksaması ve hammadde yokluğu')

const showReviewModal = ref(false)
const reviewCompany = ref<any>(null)
const reviewRating = ref(5)
const reviewComment = ref('')
const reviewTags = ref<string[]>([])

// Open Negotiation Modal
function openNegotiation(teklif: any, ilan: any) {
  selectedTeklifForNegotiation.value = teklif
  currentIlan.value = ilan
  const numericPrice = parseInt((teklif.fiyat || '').replace(/[^0-9]/g, '')) || 0
  counterOfferPrice.value = numericPrice ? String(Math.round(numericPrice * 0.95)) : ''
  counterOfferNotes.value = 'Teklifinizi inceledik. Belirttiğimiz hedef fiyata çekilmesi durumunda ihale tarafınıza verilecektir.'
  showNegotiationModal.value = true
}

// Submit Counter Offer (Pazarlık)
async function submitCounterOffer() {
  if (!counterOfferPrice.value) {
    alert('Lütfen karşı teklif / hedef pazarlık tutarını giriniz.')
    return
  }

  const teklif = selectedTeklifForNegotiation.value
  const formattedPrice = Number(counterOfferPrice.value).toLocaleString('tr-TR') + ' ₺'
  const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  teklif.durum = 'pazarlik'
  if (!teklif.pazarlikGecmisi) teklif.pazarlikGecmisi = []
  
  teklif.pazarlikGecmisi.unshift({
    kim: 'Alıcı Firma (Siz)',
    mesaj: `Karşı Teklif: ${formattedPrice} — ${counterOfferNotes.value}`,
    tarih: now,
    fiyat: formattedPrice
  })

  // Update matching submittedBid for supplier view
  const matchingSubmitted = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === teklif.id)
  if (matchingSubmitted) {
    matchingSubmitted.durum = 'pazarlik'
    if (!matchingSubmitted.pazarlikGecmisi) matchingSubmitted.pazarlikGecmisi = []
    matchingSubmitted.pazarlikGecmisi.unshift({
      kim: 'Alıcı Firma',
      mesaj: `Karşı Teklif İletildi: ${formattedPrice} — ${counterOfferNotes.value}`,
      tarih: now,
      fiyat: formattedPrice
    })
  }

  saveCmsData(cmsData.value)

  // Send NetGSM SMS to supplier
  await sendSms({
    recipientPhone: teklif.telefon || '+90 532 555 01 23',
    recipientName: teklif.firma,
    templateName: 'Karşı Teklif Pazarlık Bildirimi',
    messageBody: `Sayın ${teklif.yetkili || teklif.firma}, "${currentIlan.value?.baslik}" ihalesinde alıcı firma ${formattedPrice} karşı teklif iletmiştir. Panelinizi inceleyiniz.`
  })

  showNegotiationModal.value = false
  alert(`💬 PAZARLIK TEKLİFİNİZ İLETİLDİ!\n\n${teklif.firma} firmasına ${formattedPrice} tutarındaki karşı teklifiniz başarıyla gönderilmiştir. NetGSM SMS bildirimi yapıldı.`)
}

// Accept Offer & Close Tender (Single Award Rule)
async function acceptTeklif(teklif: any, ilan: any) {
  // Hard check: If another bid is already accepted, strictly block!
  const existingAccepted = ilan.teklifler?.find((t: any) => t.durum === 'onaylandi')
  if (existingAccepted && existingAccepted.id !== teklif.id) {
    alert(`⚠️ GEÇERSİZ İŞLEM: "${ilan.baslik}" ihalesinde zaten "${existingAccepted.firma}" firması ile mutabakat sağlanmıştır!\n\nBir ihaleye birden fazla onay verilemez. Farklı bir teklifi onaylamak istiyorsanız önce mevcut mutabakatı iptal etmeniz gerekir.`)
    return
  }

  const confirmAccept = confirm(`🎉 "${teklif.firma}" firmasının ${teklif.fiyat} tutarındaki teklifini onaylayıp mutabakat sağlamak istiyor musunuz?\n\nBu işlem sonucunda ihale sonuçlanacak, yeni tekliflere kapatılacak ve diğer teklifler elenecektir.`)
  if (!confirmAccept) return

  // 1. Mark winning bid as 'onaylandi'
  teklif.durum = 'onaylandi'

  // 2. Mark all other bids in this tender as 'elendi'
  ilan.teklifler.forEach((otherBid: any) => {
    if (otherBid.id !== teklif.id) {
      otherBid.durum = 'elendi'
    }
  })

  // 3. Mark the parent tender as 'closed'
  const tenderInStore = (cmsData.value.dashboard.tenders || []).find((t: any) => t.id === ilan.id || t.baslik === ilan.baslik)
  if (tenderInStore) {
    tenderInStore.durum = 'closed'
    tenderInStore.sure = 'Sonuçlandı (Mutabakat Sağlandı)'
  }

  // 4. Update matching submittedBid for supplier view
  const matchingSubmitted = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === teklif.id)
  if (matchingSubmitted) {
    matchingSubmitted.durum = 'onaylandi'
    matchingSubmitted.yetkili = 'Ahmet Yılmaz (Alıcı Yetkilisi)'
    matchingSubmitted.telefon = '+90 850 308 00 00'
    matchingSubmitted.eposta = 'satinlama@ihaleciburada.com'
    matchingSubmitted.vergiDairesi = 'Karesi V.D. / 4810293847'
    matchingSubmitted.adres = 'Bahçelievler Mah. Balıkesir'
  }

  saveCmsData(cmsData.value)

  // 5. Send NetGSM SMS
  await sendSms({
    recipientPhone: teklif.telefon || '+90 532 555 01 23',
    recipientName: teklif.firma,
    templateName: 'İhale Onay ve Anlaşma',
    messageBody: `TEBRİKLER! "${ilan.baslik}" ihalesinde teklifiniz onaylanmıştır. Alıcı irtibat ve sözleşme detayları panelinize açılmıştır.`
  })

  alert(`🎉 TEBRİKLER! MUTABAKAT SAĞLANDI!\n\n${teklif.firma} firması ile ${teklif.fiyat} bedel üzerinden anlaşma sağlandı. İhale teklif alımına kapatılmıştır. Karşılıklı kurumsal iletişim ve vergi bilgileri açılmıştır.`)
}

// Cancel Agreement & Re-open Tender
function cancelTeklifAgreement(ilan: any) {
  const confirmCancel = confirm(`⚠️ "${ilan.baslik}" ihalesindeki mutabakatı iptal edip ihaleyi tekrar teklif alımına açmak istiyor musunuz?\n\nBu işlem sonrasında tedarikçiler yeniden teklif verebilecek ve elenen teklifler aktif hale gelecektir.`)
  if (!confirmCancel) return

  // 1. Reset bids in this ilan
  ilan.teklifler.forEach((t: any) => {
    t.durum = 'bekliyor'
  })

  // 2. Re-open parent tender
  const tenderInStore = (cmsData.value.dashboard.tenders || []).find((t: any) => t.id === ilan.id || t.baslik === ilan.baslik)
  if (tenderInStore) {
    tenderInStore.durum = 'active'
    tenderInStore.sure = '7 gün'
  }

  // 3. Reset submitted bids
  ilan.teklifler.forEach((t: any) => {
    const matching = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === t.id)
    if (matching) {
      matching.durum = 'bekliyor'
    }
  })

  saveCmsData(cmsData.value)
  alert(`🔄 İHALE MUTABAKATI İPTAL EDİLDİ\n\n"${ilan.baslik}" ihalesi yeniden teklif toplamaya açılmıştır. Tüm tedarikçiler tekrar teklif sunabilir.`)
}

// Reject Bid
function rejectTeklif(teklif: any) {
  const confirmReject = confirm(`${teklif.firma} firmasının teklifini reddetmek istiyor musunuz?`)
  if (!confirmReject) return

  teklif.durum = 'reddedildi'
  const matchingSubmitted = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === teklif.id)
  if (matchingSubmitted) {
    matchingSubmitted.durum = 'reddedildi'
  }

  saveCmsData(cmsData.value)
  alert(`${teklif.firma} firmasının teklifi reddedildi. Tedarikçi dilerse revize yeni bir teklif iletebilir.`)
}

// Open Dispute Modal
function openDisputeModal(ilan: any) {
  selectedIlanForDispute.value = ilan
  showDisputeModal.value = true
}

function submitDispute() {
  const newDispute = {
    id: 'DSP-2026-' + Math.floor(100 + Math.random() * 900),
    tenderTitle: selectedIlanForDispute.value?.baslik,
    contractId: 'SZL-' + Math.floor(1000 + Math.random() * 9000),
    parties: `İhale Sahibi (Siz) ⟷ Anlaşılan Firma`,
    amount: 'Güvenli Havuzda',
    reason: disputeReason.value,
    status: 'INCELENIYOR',
    requestedBy: 'Alıcı Firma (Siz)',
    date: new Date().toLocaleString('tr-TR')
  }

  if (!cmsData.value.dashboard.disputes) {
    cmsData.value.dashboard.disputes = []
  }
  cmsData.value.dashboard.disputes.unshift(newDispute)
  saveCmsData(cmsData.value)

  showDisputeModal.value = false
  alert(`⚖️ MÜCBİR SEBEP / İPTAL TALEBİNİZ ALINDI\n\nTalep No: ${newDispute.id}\nİhale: ${newDispute.tenderTitle}\n\nPlatform yöneticileri ve Escrow hakem heyeti durumu inceleyerek cezai şartsız iptal ve iade sürecini başlatacaktır.`)
}

// Open Review Modal
function openReviewModal(teklif: any) {
  reviewCompany.value = teklif
  reviewRating.value = 5
  reviewComment.value = ''
  reviewTags.value = ['Zamanında Teslimat', 'Kaliteli Malzeme']
  showReviewModal.value = true
}

function submitReview() {
  const newReview = {
    id: 'REV-' + Math.floor(100 + Math.random() * 900),
    companyName: reviewCompany.value?.firma,
    rating: reviewRating.value,
    reviewer: 'İhale Sahibi Kurumsal Firma',
    tags: reviewTags.value,
    comment: reviewComment.value || 'İhale süreci ve malzeme kalitesi beklentilerimizi tam karşıladı.',
    date: new Date().toLocaleDateString('tr-TR')
  }

  if (!cmsData.value.dashboard.companyReviews) {
    cmsData.value.dashboard.companyReviews = []
  }
  cmsData.value.dashboard.companyReviews.unshift(newReview)
  saveCmsData(cmsData.value)

  showReviewModal.value = false
  alert(`⭐ DEĞERLENDİRMENİZ KAYDEDİLDİ!\n\n${reviewCompany.value?.firma} firmasına verdiğiniz ${reviewRating.value} yıldızlı puan profil güven skoruna yansıtıldı.`)
}
</script>

<template>
  <div class="p-3 sm:p-6 max-w-5xl mx-auto text-left space-y-6">

    <!-- Başlık + Gizlilik Notu -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          Aldığım Teklifler (Gelen)
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Açtığınız ihalelere tedarikçilerden gelen teklifleri inceleyin, canlı pazarlık yapın ve kazananı onaylayın.
        </p>
      </div>

      <!-- Kapalı Zarf Bilgi Bandı -->
      <div
        class="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shrink-0 self-start sm:self-auto shadow-xs"
        style="background: #003057; color: white;"
      >
        <Shield :size="14" class="text-[#1EAE4C]" />
        <span>Kapalı Zarf — Şifreli Teklif Akışı</span>
      </div>
    </div>

    <!-- Hızlı Geçiş Segment Sekmeleri -->
    <div class="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
      <NuxtLink
        to="/panel/gelen-teklifler"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-sm transition-all bg-white text-[#003057]"
      >
        <Inbox :size="15" class="text-[#1EAE4C]" />
        <span>Aldığım Teklifler (Gelen)</span>
      </NuxtLink>
      <NuxtLink
        to="/panel/yaptigim-teklifler"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
      >
        <Send :size="15" class="text-slate-400" />
        <span>Verdiğim Teklifler (Yaptığım)</span>
      </NuxtLink>
    </div>

    <!-- İlan Grupları Listesi -->
    <div v-if="ilanlar.length > 0" class="space-y-4">
      <div
        v-for="ilan in ilanlar"
        :key="ilan.id"
        class="rounded-3xl border bg-white overflow-hidden shadow-xs border-slate-200 transition hover:shadow-md"
      >
        <!-- İlan Başlık Satırı -->
        <button
          @click="toggle(ilan.id)"
          class="flex w-full items-center justify-between p-4 sm:p-6 text-left transition hover:bg-slate-50/80 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 bg-blue-50 border border-blue-100 text-[#003057]">
              <Inbox :size="20" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-black text-base text-slate-900">{{ ilan.baslik }}</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">{{ ilan.id }}</span>
              </div>
              <p class="text-xs text-slate-400 mt-1 font-medium">
                {{ ilan.kategori }} • <span class="text-slate-600 font-bold">Kalan Süre:</span> {{ ilan.bitis }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              class="rounded-xl px-3.5 py-1.5 text-xs font-black"
              :class="ilan.teklifler?.some((t: any) => t.durum === 'onaylandi') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
            >
              {{ ilan.teklifler?.some((t: any) => t.durum === 'onaylandi') ? '✓ Sonuçlandı' : `${ilan.teklifler?.length || 0} Teklif Geldi` }}
            </span>
            <ChevronDown v-if="expandedIlan !== ilan.id" :size="20" class="text-slate-400" />
            <ChevronUp v-else :size="20" class="text-slate-700" />
          </div>
        </button>

        <!-- Teklif Kartları & Pazarlık Arayüzü -->
        <div v-if="expandedIlan === ilan.id" class="border-t border-slate-100">
          
          <!-- Bilgilendirme ve Güven Şeridi / Mutabakat Durumu -->
          <div v-if="ilan.teklifler?.some((t: any) => t.durum === 'onaylandi')" class="px-6 py-3.5 bg-emerald-50 border-b border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs text-emerald-900 font-bold">
            <div class="flex items-center gap-2">
              <CheckCircle2 :size="16" class="text-emerald-600 shrink-0" />
              <span>🔒 BU İHALEDE MUTABAKAT SAĞLANMIŞTIR — İhale yeni teklif alımına kapatılmıştır.</span>
            </div>
            <div class="flex flex-wrap items-center gap-2.5">
              <NuxtLink
                to="/panel/siparis-teslimat"
                class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00C2FF] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs hover:opacity-95"
              >
                <CreditCard :size="13" />
                <span>💳 Güvenli Havuz Ödemesi & Sipariş Takibi</span>
              </NuxtLink>
              <button
                type="button"
                @click="cancelTeklifAgreement(ilan)"
                class="px-3.5 py-1.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-black transition cursor-pointer shadow-xs"
              >
                ⚠️ Mutabakatı İptal Et
              </button>
              <button 
                type="button"
                @click="openDisputeModal(ilan)"
                class="text-red-700 hover:text-red-900 underline text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Scale :size="13" />
                Mücbir Sebep / İptal
              </button>
            </div>
          </div>
          <div v-else class="px-6 py-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-bold">
            <div class="flex items-center gap-2">
              <Shield :size="14" class="text-amber-600" />
              <span>Teklifler gizli kapalı zarf korumasındadır. Bir teklifi onayladığınızda ihale kapanır ve diğer teklifler elenir.</span>
            </div>
          </div>

          <!-- Gelen Teklif Yoksa -->
          <div v-if="!ilan.teklifler || ilan.teklifler.length === 0" class="p-8 text-center text-slate-400 text-xs">
            Bu ihaleye henüz tedarikçilerden teklif gelmedi. İlanınız Pazar Yeri'nde yayınlanmaktadır.
          </div>

          <!-- Teklif Öğeleri -->
          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="teklif in ilan.teklifler"
              :key="teklif.id"
              class="p-6 space-y-4 transition"
              :class="teklif.durum === 'onaylandi' ? 'bg-emerald-50/40' : (teklif.durum === 'elendi' ? 'opacity-60 bg-slate-50/50' : '')"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <!-- Firma & Puan -->
                <div class="flex items-start sm:items-center gap-3">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black text-white shrink-0 shadow-sm"
                    :style="teklif.durum === 'onaylandi' ? 'background: #1EAE4C;' : 'background: #003057;'"
                  >
                    {{ teklif.firma.charAt(0) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-sm font-black text-slate-900">{{ teklif.firma }}</span>
                      <span class="inline-flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star :size="11" fill="#D97706" />
                        {{ teklif.puan }}
                      </span>
                      <span v-if="teklif.durum === 'onaylandi'" class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                        KAZANAN TEDARİKÇİ ✓
                      </span>
                      <span v-else-if="teklif.durum === 'elendi'" class="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold">
                        Elenmiş
                      </span>
                    </div>

                    <div class="flex items-center gap-4 mt-1 text-xs text-slate-400 font-medium">
                      <span class="flex items-center gap-1"><Clock :size="12" /> Teslimat: <strong>{{ teklif.sure }}</strong></span>
                      <span class="font-mono text-slate-400">Teklif ID: {{ teklif.id }}</span>
                    </div>
                  </div>
                </div>

                <!-- Fiyat ve Eylemler -->
                <div class="flex items-center gap-3 justify-between sm:justify-end">
                  <div class="text-right">
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Teklif Tutarı:</span>
                    <span class="text-lg font-black font-mono text-slate-900">{{ teklif.fiyat }}</span>
                  </div>

                  <!-- Durum Rozeti -->
                  <span
                    class="rounded-xl px-3 py-1.5 text-xs font-black shrink-0"
                    :class="{
                      'bg-emerald-100 text-emerald-800 border border-emerald-300': teklif.durum === 'onaylandi',
                      'bg-amber-100 text-amber-800 border border-amber-300': teklif.durum === 'pazarlik',
                      'bg-red-100 text-red-800 border border-red-200': teklif.durum === 'reddedildi',
                      'bg-slate-100 text-slate-600': teklif.durum === 'elendi' || teklif.durum === 'bekliyor'
                    }"
                  >
                    {{ 
                      teklif.durum === 'onaylandi' ? '✓ Onaylandı' :
                      teklif.durum === 'pazarlik' ? '💬 Pazarlıkta' :
                      teklif.durum === 'reddedildi' ? '✕ Reddedildi' :
                      teklif.durum === 'elendi' ? 'Elenmiş' : 'İncelemede'
                    }}
                  </span>

                  <!-- Eylem Butonları (Teklif henüz onaylanmamışsa) -->
                  <div v-if="!ilan.teklifler.some((t: any) => t.durum === 'onaylandi') && teklif.durum !== 'reddedildi'" class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openNegotiation(teklif, ilan)"
                      class="rounded-xl px-3.5 py-2 text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer shadow-2xs"
                    >
                      💬 Pazarlık
                    </button>
                    <button
                      type="button"
                      @click="acceptTeklif(teklif, ilan)"
                      class="rounded-xl px-4 py-2 text-xs font-black text-white transition cursor-pointer hover:bg-[#188c3d] bg-[#1EAE4C] shadow-md shadow-[#1EAE4C]/20"
                    >
                      Kabul Et & Bitir
                    </button>
                    <button
                      type="button"
                      @click="rejectTeklif(teklif)"
                      class="rounded-xl p-2 text-xs font-bold text-red-500 hover:bg-red-50 transition border border-red-200"
                      title="Teklifi Reddet"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- Anlaşıldıysa Değerlendirme & İptal Butonları -->
                  <div v-else-if="teklif.durum === 'onaylandi'" class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openReviewModal(teklif)"
                      class="rounded-xl px-3.5 py-2 text-xs font-black bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Star :size="13" class="text-amber-500" fill="#F59E0B" />
                      Puanla & Yorum Yaz
                    </button>
                    <button
                      type="button"
                      @click="cancelTeklifAgreement(ilan)"
                      class="rounded-xl px-3 py-2 text-xs font-black bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer"
                      title="Mutabakatı iptal et ve ihaleyi tekrar aç"
                    >
                      ⚠️ Mutabakatı İptal Et
                    </button>
                  </div>

                </div>

              </div>

              <!-- 🟢 EĞER ANLAŞMA SAĞLANDIYSA: DOĞRUDAN AÇILAN KURUMSAL İLETİŞİM KARTI -->
              <div v-if="teklif.durum === 'onaylandi'" class="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span class="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 :size="15" class="text-emerald-600" />
                    KAZANAN TEDARİKÇİ İRTİBAT VE FATURA BİLGİLERİ (AÇILDI)
                  </span>
                  <span class="text-[10px] font-bold text-slate-400">İhaleciBurada Sözleşme Güvencesi</span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-bold block">Yetkili Kişi</span>
                    <strong class="text-slate-800">{{ teklif.yetkili || 'Mehmet Yılmaz' }}</strong>
                  </div>
                  <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-bold block">Telefon (GSM)</span>
                    <a :href="`tel:${teklif.telefon || '+905324441122'}`" class="text-blue-600 font-bold hover:underline">{{ teklif.telefon || '+90 532 444 11 22' }}</a>
                  </div>
                  <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-bold block">Kurumsal E-Posta</span>
                    <a :href="`mailto:${teklif.eposta || 'satis@firma.com'}`" class="text-blue-600 font-bold hover:underline">{{ teklif.eposta || 'satis@firma.com' }}</a>
                  </div>
                  <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span class="text-[10px] text-slate-400 font-bold block">Vergi Dairesi / No</span>
                    <strong class="text-slate-800">{{ teklif.vergiDairesi || 'Karesi V.D. / 1450293847' }}</strong>
                  </div>
                </div>
              </div>

              <!-- Pazarlık Geçmişi Kutusu -->
              <div v-if="teklif.pazarlikGecmisi && teklif.pazarlikGecmisi.length > 0" class="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1.5">
                <span class="text-[10px] font-black text-amber-700 uppercase tracking-wider block">💬 Pazarlık & Karşı Teklif Geçmişi</span>
                <div v-for="(paz, pIdx) in teklif.pazarlikGecmisi" :key="pIdx" class="flex justify-between items-center text-slate-700 bg-white p-2 rounded-lg border border-amber-100">
                  <span><strong>{{ paz.kim }}:</strong> {{ paz.mesaj }}</span>
                  <span class="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{{ paz.tarih }}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- CLEAN EMPTY STATE -->
    <div v-else class="rounded-3xl border bg-white p-12 sm:p-16 text-center space-y-4 shadow-xs border-slate-200">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
        <Inbox :size="24" />
      </div>
      <div class="space-y-1 max-w-md mx-auto">
        <h3 class="text-sm font-black text-slate-800">Henüz Gelen Teklif Bulunmuyor</h3>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          Açtığınız B2B satın alma ihalelerine onaylı tedarikçiler tarafından teklif verildiğinde burada listelenecek ve canlı pazarlık masası açılacaktır.
        </p>
      </div>
      <div class="pt-1">
        <NuxtLink
          to="/panel/ihale-olustur"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-sm"
        >
          <Inbox :size="14" />
          <span>Yeni İhale Aç</span>
        </NuxtLink>
      </div>
    </div>

    <!-- MODAL 1: PAZARLIK & KARŞI TEKLİF -->
    <div v-if="showNegotiationModal && selectedTeklifForNegotiation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 sm:p-8 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MessageSquare :size="20" />
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-600 uppercase tracking-wider block">B2B FİYAT PAZARLIĞI</span>
              <h3 class="text-base font-black text-slate-900">Karşı Teklif & Hedef Fiyat İlet</h3>
            </div>
          </div>
          <button @click="showNegotiationModal = false" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
            <X :size="20" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Tedarikçi:</span>
              <span class="font-black text-slate-800">{{ selectedTeklifForNegotiation.firma }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Mevcut Teklif Tutarı:</span>
              <span class="font-black text-emerald-600 font-mono text-sm">{{ selectedTeklifForNegotiation.fiyat }}</span>
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              HEDEF PAZARLIK TUTARINIZ (₺ / KDV DAHİL) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-amber-600 text-sm">₺</span>
              <input
                v-model="counterOfferPrice"
                type="number"
                placeholder="Örn: 1.300.000"
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              PAZARLIK ŞARTLARINIZ & NOTUNUZ *
            </label>
            <textarea
              v-model="counterOfferNotes"
              rows="3"
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white resize-none"
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
            class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <Send :size="13" />
            <span>Karşı Teklifi Gönder & SMS İlet</span>
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
            <h3 class="text-base font-black text-slate-900">Mücbir Sebep & İptal Masası</h3>
          </div>
          <button @click="showDisputeModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-500 leading-relaxed">
            İflas, ölüm, ağır kaza, hammadde krizleri veya doğal afet gibi mücbir sebeplerden dolayı anlaşmanın feshedilmesi gerekiyorsa gerekçenizi bildiriniz.
          </p>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">MÜCBİR SEBEP / FESİH GEREKÇESİ *</label>
            <textarea
              v-model="disputeReason"
              rows="4"
              class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-red-500"
              placeholder="Ayrıntılı gerekçenizi yazınız..."
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
            Hakem Heyetine İlet
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 3: DEĞERLENDİRME & PUANLAMA -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <span class="text-xs font-black text-amber-600 uppercase">FİRMA DEĞERLENDİRME</span>
            <h3 class="text-base font-black text-slate-900 mt-0.5">{{ reviewCompany?.firma }}</h3>
          </div>
          <button @click="showReviewModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <!-- 5 Yıldız Seçici -->
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
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">YORUM & GÖRÜŞÜNÜZ</label>
            <textarea
              v-model="reviewComment"
              rows="3"
              placeholder="Tedarikçinin teslimat hızı, paketleme kalitesi ve iletişimini değerlendirin..."
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
            Puanı Kaydet
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
