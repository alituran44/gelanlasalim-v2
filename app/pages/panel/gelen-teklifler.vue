<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  X,
  CreditCard,
  Eye,
  FileCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  BadgeCheck,
  ShieldCheck,
  Printer
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const expandedIlan = ref<string | null>(route.query.ilan as string || null)

const { cmsData, saveCmsData, fetchServerTenders, fetchServerBids } = useCmsData()
const { sendSms } = useNetGsm()

const userSession = ref<any>({})

const filteredReceivedBids = computed(() => {
  const currentEmail = (userSession.value?.email || '').trim().toLowerCase()
  const allReceived = cmsData.value?.dashboard?.receivedBids || []
  const allTenders = cmsData.value?.dashboard?.tenders || []

  let localMyTenderIds: string[] = []
  let localMyTenderTitles: string[] = []
  if (typeof window !== 'undefined') {
    try {
      const localMy = JSON.parse(localStorage.getItem('myTenders') || '[]')
      localMyTenderIds = localMy.map((t: any) => t.id).filter(Boolean)
      localMyTenderTitles = localMy.map((t: any) => (t.baslik || '').trim().toLowerCase()).filter(Boolean)
    } catch (e) {}
  }

  // Check user's own tenders by email or local storage
  const myTenders = allTenders.filter((t: any) => {
    const ownerEmail = (t.ownerEmail || '').trim().toLowerCase()
    if (currentEmail && ownerEmail && currentEmail === ownerEmail) return true
    if (localMyTenderIds.includes(t.id)) return true
    if (localMyTenderTitles.includes((t.baslik || '').trim().toLowerCase())) return true
    return false
  })
  const myTenderIds = myTenders.map((t: any) => t.id).concat(localMyTenderIds)

  if (myTenderIds.length > 0) {
    const matched = allReceived.filter((g: any) => 
      myTenderIds.includes(g.id) || 
      myTenders.some((mt: any) => mt.baslik === g.baslik) ||
      localMyTenderTitles.includes((g.baslik || '').trim().toLowerCase())
    )
    if (matched.length > 0) return matched
  }

  // Fallback: Return all received tender groups so data is never lost or hidden
  return allReceived
})

const toplamGelenTeklifler = computed(() => {
  let count = 0
  const list = filteredReceivedBids.value || []
  list.forEach((item: any) => {
    count += (item.teklifler || []).length
  })
  return count
})

const ilanlar = computed(() => filteredReceivedBids.value || [])

onMounted(async () => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }
  if (fetchServerTenders) {
    try {
      await fetchServerTenders()
    } catch (e) {}
  }
  if (fetchServerBids) {
    try {
      await fetchServerBids()
    } catch (e) {}
  }
  if (typeof window !== 'undefined') {
    if (!expandedIlan.value && ilanlar.value.length > 0) {
      expandedIlan.value = ilanlar.value[0].id
    }
  }
})

function toggle(id: string) {
  expandedIlan.value = expandedIlan.value === id ? null : id
}

// Modal States
const showNegotiationModal = ref(false)
const selectedTeklifForNegotiation = ref<any>(null)
const currentIlan = ref<any>(null)
const counterOfferPrice = ref('')
const counterOfferNotes = ref('')

const showDocModal = ref(false)
const selectedTeklifForDocs = ref<any>(null)

const showDisputeModal = ref(false)
const selectedIlanForDispute = ref<any>(null)
const disputeReason = ref('Mücbir Sebep - Tedarik zinciri aksaması ve hammadde yokluğu')

const showReviewModal = ref(false)
const reviewCompany = ref<any>(null)
const reviewRating = ref(5)
const reviewComment = ref('')
const reviewTags = ref<string[]>([])

const isSupplierProfileModalOpen = ref(false)
const selectedSupplierForProfile = ref<any>(null)
const selectedIlanForProfile = ref<any>(null)

function openSupplierProfileModal(teklif: any, ilan: any) {
  selectedSupplierForProfile.value = teklif
  selectedIlanForProfile.value = ilan
  isSupplierProfileModalOpen.value = true
}

// Open Document Viewer Modal
function openDocModal(teklif: any) {
  selectedTeklifForDocs.value = teklif
  showDocModal.value = true
}

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

  const rawNum = parseInt(String(counterOfferPrice.value).replace(/\D/g, '')) || 0
  if (rawNum <= 0) {
    alert('Lütfen geçerli pozitif bir teklif tutarı giriniz.')
    return
  }

  const teklif = selectedTeklifForNegotiation.value
  const formattedPrice = Number(rawNum).toLocaleString('tr-TR') + ' ₺'
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
  try {
    await sendSms({
      recipientPhone: teklif.telefon || '+90 532 555 01 23',
      recipientName: teklif.firma,
      templateName: 'Karşı Teklif Pazarlık Bildirimi',
      messageBody: `Sayın ${teklif.yetkili || teklif.firma}, "${currentIlan.value?.baslik || 'İhale'}" ihalesinde alıcı firma ${formattedPrice} karşı teklif iletmiştir. Panelinizi inceleyiniz.`
    })
  } catch (e) {}

  showNegotiationModal.value = false
  alert(`💬 PAZARLIK TEKLİFİNİZ İLETİLDİ!\n\n${teklif.firma} firmasına ${formattedPrice} tutarındaki karşı teklifiniz başarıyla gönderilmiştir.`)
}

// ----------------------------------------------------
// 🛡️ MODÜL 4: AWD-001 ~ AWD-013 KAZANAN SEÇİMİ, GEREKÇELİ RET VE TUTANAK
// ----------------------------------------------------
const showAwardModal = ref(false)
const selectedTeklifForAward = ref<any>(null)
const selectedIlanForAward = ref<any>(null)
const isSubmittingAward = ref(false)
const awardForm = ref({
  isFinal: true,
  evaluationType: 'BEST_PRICE' as 'BEST_PRICE' | 'COMMERCIAL_REASON' | 'TECHNICAL_MERIT',
  awardReasonCode: 'BEST_VALID_PRICE' as any,
  awardReasonNote: ''
})

const showRejectModal = ref(false)
const selectedTeklifForReject = ref<any>(null)
const selectedIlanForReject = ref<any>(null)
const isSubmittingReject = ref(false)
const rejectForm = ref({
  reasonCode: 'TEKNIK_YETERSIZLIK' as any,
  reasonNote: ''
})

const showTutanakModal = ref(false)
const currentTutanak = ref<any>(null)
const isLoadingTutanak = ref(false)

function openAwardModal(teklif: any, ilan: any) {
  // Hard check: If another bid is already accepted
  const existingAccepted = ilan.teklifler?.find((t: any) => t.durum === 'onaylandi')
  if (existingAccepted && existingAccepted.id !== teklif.id) {
    alert(`⚠️ GEÇERSİZ İŞLEM: "${ilan.baslik}" ihalesinde zaten "${existingAccepted.firma}" firması ile mutabakat sağlanmıştır!\n\nBir ihaleye birden fazla onay verilemez.`)
    return
  }

  selectedTeklifForAward.value = teklif
  selectedIlanForAward.value = ilan

  // Determine if this is the lowest bid (for eksiltme)
  const isReduction = (ilan.tur || ilan.ihaleYonu || '').includes('eksiltme') || !ilan.tur?.includes('artirma')
  const myPriceNum = parseInt(String(teklif.fiyat).replace(/\D/g, ''), 10) || 0
  let isLowest = true

  if (ilan.teklifler && ilan.teklifler.length > 1) {
    for (const other of ilan.teklifler) {
      if (other.id !== teklif.id) {
        const otherPrice = parseInt(String(other.fiyat).replace(/\D/g, ''), 10) || 0
        if (isReduction && otherPrice > 0 && otherPrice < myPriceNum) {
          isLowest = false
          break
        }
      }
    }
  }

  awardForm.value = {
    isFinal: true,
    evaluationType: isLowest ? 'BEST_PRICE' : 'COMMERCIAL_REASON',
    awardReasonCode: isLowest ? 'BEST_VALID_PRICE' : 'FASTEST_DELIVERY',
    awardReasonNote: isLowest ? 'Şartnameye tam uygun en düşük geçerli teklif.' : ''
  }

  showAwardModal.value = true
}

async function submitAward() {
  if (!selectedTeklifForAward.value || !selectedIlanForAward.value) return
  const teklif = selectedTeklifForAward.value
  const ilan = selectedIlanForAward.value

  if (awardForm.value.evaluationType !== 'BEST_PRICE' && !awardForm.value.awardReasonNote.trim()) {
    alert('En düşük fiyat dışındaki bir teklifi kazanan seçerken gerekçe açıklaması yazılması zorunludur (Kural AWD-003).')
    return
  }

  isSubmittingAward.value = true
  try {
    const res: any = await $fetch(`/api/tenders/${ilan.id}/award`, {
      method: 'POST',
      body: {
        bidId: teklif.id,
        winnerCompany: teklif.firma,
        amount: teklif.fiyat,
        evaluationType: awardForm.value.evaluationType,
        awardReasonCode: awardForm.value.awardReasonCode,
        awardReasonNote: awardForm.value.awardReasonNote,
        evaluatedBy: userSession.value?.name || 'Hasan Hüseyin Yıldırım (Yetkili)',
        isFinal: awardForm.value.isFinal
      }
    })

    // Local state update
    teklif.durum = 'onaylandi'
    ilan.teklifler.forEach((otherBid: any) => {
      if (otherBid.id !== teklif.id) {
        otherBid.durum = 'elendi'
      }
    })

    const tenderInStore = (cmsData.value.dashboard.tenders || []).find((t: any) => t.id === ilan.id || t.baslik === ilan.baslik)
    if (tenderInStore) {
      tenderInStore.durum = awardForm.value.isFinal ? 'closed' : 'degerlendirmede'
      tenderInStore.statusCode = awardForm.value.isFinal ? 'FINALIZED' : 'PROVISIONAL_RESULT'
      tenderInStore.sure = awardForm.value.isFinal ? 'Sonuçlandı (Mutabakat Sağlandı)' : 'Geçici Sonuç Belirlendi'
    }

    saveCmsData(cmsData.value)

    showAwardModal.value = false
    alert(`🎉 İHALE SONUÇLANDIRILDI (Kural AWD-001 ~ AWD-010)!\n\n"${teklif.firma}" kazanan olarak belirlendi.\nTutanak No: ${res.tutanakNo}\n\nResmi İhale Sonuç Tutanağını "Tutanak Görüntüle" butonundan inceleyebilir ve yazdırabilirsiniz.`)
  } catch (e: any) {
    alert('Sonuçlandırma hatası: ' + (e.data?.message || e.message))
  } finally {
    isSubmittingAward.value = false
  }
}

function openRejectModal(teklif: any, ilan: any) {
  selectedTeklifForReject.value = teklif
  selectedIlanForReject.value = ilan
  rejectForm.value = {
    reasonCode: 'TEKNIK_YETERSIZLIK',
    reasonNote: ''
  }
  showRejectModal.value = true
}

async function submitReject() {
  if (!selectedTeklifForReject.value || !selectedIlanForReject.value) return
  const teklif = selectedTeklifForReject.value
  const ilan = selectedIlanForReject.value

  isSubmittingReject.value = true
  try {
    await $fetch(`/api/tenders/${ilan.id}/reject-bid`, {
      method: 'PATCH',
      body: {
        bidId: teklif.id,
        reasonCode: rejectForm.value.reasonCode,
        reasonNote: rejectForm.value.reasonNote,
        rejectedBy: userSession.value?.name || 'Değerlendirme Yetkilisi'
      }
    })

    teklif.durum = 'reddedildi'
    teklif.rejectionReason = rejectForm.value.reasonCode
    teklif.rejectionNote = rejectForm.value.reasonNote

    const matchingSubmitted = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === teklif.id)
    if (matchingSubmitted) {
      matchingSubmitted.durum = 'reddedildi'
    }

    saveCmsData(cmsData.value)
    showRejectModal.value = false
    alert(`⛔ TEKLİF GEREKÇELİ ELENDİ (Kural AWD-002)!\n\n${teklif.firma} firmasının teklifi "${rejectForm.value.reasonCode}" gerekçesiyle reddedildi. Kayıt denetim izinde saklanmaktadır.`)
  } catch (e: any) {
    alert('Ret işlemi başarısız: ' + (e.data?.message || e.message))
  } finally {
    isSubmittingReject.value = false
  }
}

async function openTutanakModal(ilan: any) {
  isLoadingTutanak.value = true
  showTutanakModal.value = true
  try {
    const res: any = await $fetch(`/api/tenders/${ilan.id}/tutanak`)
    if (res?.tutanak) {
      currentTutanak.value = res.tutanak
    }
  } catch (e: any) {
    alert('Tutanak yüklenemedi: ' + (e.data?.message || e.message))
  } finally {
    isLoadingTutanak.value = false
  }
}

function printTutanak() {
  window.print()
}

// Cancel Agreement & Re-open Tender
function cancelTeklifAgreement(ilan: any) {
  const confirmCancel = confirm(`⚠️ "${ilan.baslik}" ihalesindeki mutabakatı iptal edip ihaleyi tekrar teklif alımına açmak istiyor musunuz?\n\nBu işlem sonrasında tedarikçiler yeniden teklif verebilecek ve elenen teklifler aktif hale gelecektir. (Kural AWD-008, AWD-009)`)
  if (!confirmCancel) return

  // 1. Reset bids in this ilan
  ilan.teklifler.forEach((t: any) => {
    t.durum = 'bekliyor'
  })

  // 2. Re-open parent tender
  const tenderInStore = (cmsData.value.dashboard.tenders || []).find((t: any) => t.id === ilan.id || t.baslik === ilan.baslik)
  if (tenderInStore) {
    tenderInStore.durum = 'active'
    tenderInStore.statusCode = 'LIVE'
    tenderInStore.sure = '7 gün'
    tenderInStore.activeAward = undefined
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
              <button
                type="button"
                @click="openTutanakModal(ilan)"
                class="px-3.5 py-1.5 rounded-xl bg-[#003057] hover:bg-[#002240] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Resmi İhale Sonuç Tutanağını İncele ve Yazdır (Kural AWD-010)"
              >
                <FileText :size="13" />
                <span>Resmi Sonuç Tutanağı</span>
              </button>
              <NuxtLink
                to="/panel/siparis-teslimat"
                class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00C2FF] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs hover:opacity-95"
              >
                <CreditCard :size="13" />
                <span>Güvenli Havuz Ödemesi & Sipariş Takibi</span>
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
                      <button 
                        type="button" 
                        @click="openSupplierProfileModal(teklif, ilan)"
                        class="text-sm font-black text-slate-900 hover:text-blue-600 hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                        title="Firma Profilini ve Puanlarını İncele"
                      >
                        <span>{{ teklif.firma }}</span>
                        <BadgeCheck :size="15" class="text-blue-600 shrink-0" />
                      </button>
                      <button 
                        type="button" 
                        @click="openSupplierProfileModal(teklif, ilan)"
                        class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 transition cursor-pointer shadow-2xs"
                        title="Tüm Puanları ve Müşteri Yorumlarını Gör"
                      >
                        <Star :size="12" class="text-amber-500" fill="#F59E0B" />
                        <span>{{ teklif.puan || '4.9' }}</span>
                        <span class="text-[10px] text-amber-600 font-normal">({{ teklif.reviewCount || '28' }} Puan)</span>
                      </button>
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
                  <div v-if="!ilan.teklifler.some((t: any) => t.durum === 'onaylandi') && teklif.durum !== 'reddedildi'" class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      @click="openSupplierProfileModal(teklif, ilan)"
                      class="rounded-xl px-3 py-2 text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Onaylamadan önce firmanın geçmiş puanlarını ve tamamladığı işleri görün"
                    >
                      <Star :size="13" class="text-amber-500" fill="#F59E0B" />
                      <span>Puanları Gör</span>
                    </button>
                    <button
                      type="button"
                      @click="openDocModal(teklif)"
                      class="rounded-xl px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Firma Evraklarını ve Teklif Dosyalarını Gör"
                    >
                      <FileText :size="13" class="text-blue-600" />
                      <span>Evrakları Gör</span>
                    </button>
                    <button
                      type="button"
                      @click="openNegotiation(teklif, ilan)"
                      class="rounded-xl px-3.5 py-2 text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <MessageSquare :size="13" class="text-amber-600" />
                      <span>Pazarlık</span>
                    </button>
                    <button
                      type="button"
                      @click="openAwardModal(teklif, ilan)"
                      class="rounded-xl px-4 py-2 text-xs font-black text-white transition cursor-pointer hover:bg-[#188c3d] bg-[#1EAE4C] shadow-md shadow-[#1EAE4C]/20 flex items-center gap-1.5"
                    >
                      <Award :size="14" />
                      <span>Kazananı Belirle</span>
                    </button>
                    <button
                      type="button"
                      @click="openRejectModal(teklif, ilan)"
                      class="rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition border border-red-200 cursor-pointer flex items-center gap-1.5"
                      title="Teklifi Gerekçeli Reddet (AWD-002)"
                    >
                      <XCircle :size="13" />
                      <span>Gerekçeli Red</span>
                    </button>
                  </div>

                  <!-- Anlaşıldıysa Değerlendirme & İptal Butonları -->
                  <div v-else-if="teklif.durum === 'onaylandi'" class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="openTutanakModal(ilan)"
                      class="rounded-xl px-3.5 py-2 text-xs font-black bg-[#003057] hover:bg-[#002240] text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Resmi İhale Sonuç Tutanağını Görüntüle ve Yazdır (AWD-010)"
                    >
                      <FileText :size="13" />
                      <span>Resmi Tutanak</span>
                    </button>
                    <button
                      type="button"
                      @click="openDocModal(teklif)"
                      class="rounded-xl px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Firma Evraklarını Gör"
                    >
                      <FileText :size="13" class="text-blue-600" />
                      <span>Evraklar</span>
                    </button>
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
                      class="rounded-xl px-3 py-2 text-xs font-black bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer flex items-center gap-1"
                      title="Mutabakatı iptal et ve ihaleyi tekrar aç"
                    >
                      <RotateCcw :size="13" />
                      <span>Mutabakatı İptal Et</span>
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
                    <strong class="text-slate-800">{{ teklif.yetkili || teklif.yetkili || teklif.bidderName || teklif.firma || 'Firma Yetkilisi' }}</strong>
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

    <!-- MODAL 4: FİRMA EVRAKLARI & TEKLİF BELGELERİ GÖRÜNTÜLEYİCİ -->
    <div v-if="showDocModal && selectedTeklifForDocs" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b pb-4 border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black">
              <FileCheck :size="20" />
            </div>
            <div>
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-wider">KURUMSAL EVRAK KONTROLÜ</span>
              <h3 class="text-base font-black text-slate-900">{{ selectedTeklifForDocs?.firma }}</h3>
            </div>
          </div>
          <button @click="showDocModal = false" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <!-- Firma Kimlik Kartı -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 font-bold block">Vergi No / Daire</span>
            <strong class="text-slate-800">{{ selectedTeklifForDocs?.vergiDairesi || 'Karesi V.D. 9560161511' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold block">Yetkili</span>
            <strong class="text-slate-800">{{ selectedTeklifForDocs?.yetkili || teklif.yetkili || teklif.bidderName || teklif.firma || 'Firma Yetkilisi' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold block">Telefon</span>
            <strong class="text-blue-600 font-mono">{{ selectedTeklifForDocs?.telefon || '0850 840 86 95' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold block">Mavi Rozet</span>
            <span class="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700">
              <CheckCircle2 :size="13" class="text-emerald-600" /> Onaylı
            </span>
          </div>
        </div>

        <!-- Yüklenen Resmi Evraklar Listesi -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText :size="14" class="text-blue-600" />
            <span>Yüklenen Yasal Evraklar ve Teknik Şartnameler</span>
          </h4>

          <div class="space-y-2">
            <!-- Evrak 1: Vergi Levhası -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-center justify-between shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <FileText :size="18" />
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900">2025/2026 Onaylı Vergi Levhası</h5>
                  <p class="text-[10px] text-slate-400">GİB Barkodlu & Doğrulanmış PDF • 1.4 MB</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">GİB Onaylı</span>
                <button type="button" @click="alert('📄 Vergi Levhası Görüntüleniyor (GİB Barkodlu Resmi Belge)')" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="Görüntüle">
                  <Eye :size="14" />
                </button>
              </div>
            </div>

            <!-- Evrak 2: İmza Sirküleri & Yetki Belgesi -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-center justify-between shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <FileCheck :size="18" />
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900">Noter Onaylı İmza Sirküleri & Temsil Belgesi</h5>
                  <p class="text-[10px] text-slate-400">Noter Yevmiye No: 14820 • 2.8 MB</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Noter Tasdikli</span>
                <button type="button" @click="alert('📄 İmza Sirküleri Görüntüleniyor (Noter Tasdikli)')" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="Görüntüle">
                  <Eye :size="14" />
                </button>
              </div>
            </div>

            <!-- Evrak 3: Ticaret Odası Faaliyet Belgesi -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-center justify-between shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <FileSpreadsheet :size="18" />
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900">Ticaret ve Sanayi Odası Faaliyet Belgesi</h5>
                  <p class="text-[10px] text-slate-400">Son 6 Aylık Güncel Oda Kaydı • 980 KB</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Oda Onaylı</span>
                <button type="button" @click="alert('📄 Faaliyet Belgesi Görüntüleniyor')" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="Görüntüle">
                  <Eye :size="14" />
                </button>
              </div>
            </div>

            <!-- Evrak 4: Teklif Metni & Fiyat Kırılım Tablosu -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-center justify-between shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <FileText :size="18" />
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900">Teklif İzahnamesi & Birim Fiyat Tablosu</h5>
                  <p class="text-[10px] text-slate-400">Teklif Tutarı: {{ selectedTeklifForDocs?.fiyat }} • Teslimat: {{ selectedTeklifForDocs?.sure }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Teklif Dosyası</span>
                <button type="button" @click="alert(`📄 Teklif Tutarı: ${selectedTeklifForDocs?.fiyat}\nTeslimat Süresi: ${selectedTeklifForDocs?.sure}\nFirma: ${selectedTeklifForDocs?.firma}`)" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer" title="Görüntüle">
                  <Eye :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end pt-3 border-t border-slate-100">
          <button @click="showDocModal = false" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm">
            Kapat
          </button>
        </div>
      </div>
    </div>

  <!-- ⭐️ TEDARİKÇİ İTİBAR, PUAN VE PROFİL MODALI (HASAN BEY TALEBİ) -->
    <div 
      v-if="isSupplierProfileModalOpen && selectedSupplierForProfile" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      @click.self="isSupplierProfileModalOpen = false"
    >
      <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 text-left border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        <!-- Başlık & Kapat -->
        <div class="flex items-start justify-between border-b pb-4 border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-900 text-white font-black text-lg flex items-center justify-center shadow-sm">
              {{ selectedSupplierForProfile.firma?.charAt(0) || 'T' }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-slate-900">{{ selectedSupplierForProfile.firma }}</h3>
                <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                  ✓ Doğrulanmış Kurumsal Üretici
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium">
                Yetkili: <strong class="text-slate-700">{{ selectedSupplierForProfile.yetkili || selectedSupplierForProfile.bidderName || selectedSupplierForProfile.firma }}</strong> · {{ selectedSupplierForProfile.city || 'Balıkesir / İstanbul' }}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            @click="isSupplierProfileModalOpen = false" 
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Puan ve İtibar İstatistikleri -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-1">
            <span class="text-[10px] font-black text-amber-800 uppercase block">Genel Firma Puanı</span>
            <div class="flex items-center justify-center gap-1 text-base font-black text-amber-900">
              <Star :size="16" class="text-amber-500" fill="#F59E0B" />
              <span>{{ selectedSupplierForProfile.puan || '4.9' }} / 5.0</span>
            </div>
            <span class="text-[9px] text-amber-700 font-bold block">({{ selectedSupplierForProfile.reviewCount || '28' }} Değerlendirme)</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1">
            <span class="text-[10px] font-black text-emerald-800 uppercase block">Zamanında Teslim</span>
            <div class="text-base font-black text-emerald-900">%99.4</div>
            <span class="text-[9px] text-emerald-700 font-bold block">Gecikmesiz Sevkiyat</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-1">
            <span class="text-[10px] font-black text-blue-800 uppercase block">Şartname Uyumu</span>
            <div class="text-base font-black text-blue-900">%98.8</div>
            <span class="text-[9px] text-blue-700 font-bold block">0 Hata Oranı</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-1">
            <span class="text-[10px] font-black text-purple-800 uppercase block">Tamamlanan İhale</span>
            <div class="text-base font-black text-purple-900">24 Adet</div>
            <span class="text-[9px] text-purple-700 font-bold block">Escrow Güvenli Havuz</span>
          </div>
        </div>

        <!-- Doğrulanmış Kurumsal Belgeler -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck :size="15" class="text-emerald-600" />
            <span>Platform Tarafından Doğrulanmış Belgeler:</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-700">📑 Güncel Vergi Levhası</span>
              <span class="text-emerald-600 font-black text-[10px]">✓ DOĞRULANDI</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-700">🏢 Ticaret Sicil Gazetesi</span>
              <span class="text-emerald-600 font-black text-[10px]">✓ DOĞRULANDI</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-700">✍️ Yetkili İmza Sirküleri</span>
              <span class="text-emerald-600 font-black text-[10px]">✓ DOĞRULANDI</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-700">🛡️ ISO 9001 & ISO 27001</span>
              <span class="text-emerald-600 font-black text-[10px]">✓ AKTİF BELGE</span>
            </div>
          </div>
        </div>

        <!-- Müşteri Değerlendirmeleri ve Yorumları -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Star :size="14" class="text-amber-500" fill="#F59E0B" />
            <span>Önceki Alıcıların Gerçek Değerlendirmeleri:</span>
          </h4>
          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-black text-slate-800">Kalyon İnşaat Satın Alma Md.</span>
                <div class="flex text-amber-500"><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /></div>
              </div>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                "Şartnameye tam uygunluk sağlandı. 3.000 tonluk sevkiyat şantiyeye 2 gün önceden eksiksiz indirildi. Çok güvenilir bir tedarikçi."
              </p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-black text-slate-800">Ege Yapı Sanayi A.Ş.</span>
                <div class="flex text-amber-500"><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /><Star :size="11" fill="#F59E0B" /></div>
              </div>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                "Kalite belgeleri ve test raporları eksiksiz teslim edildi. Escrow sistemiyle sorunsuz mutabakat sağladık."
              </p>
            </div>
          </div>
        </div>

        <!-- Teklif Onay ve İletişim Butonları -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase block">Sunulan Teklif Fiyatı:</span>
            <span class="text-xl font-black font-mono text-emerald-700">{{ selectedSupplierForProfile.fiyat }}</span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button 
              type="button" 
              @click="isSupplierProfileModalOpen = false" 
              class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer text-xs"
            >
              Kapat
            </button>
            <button 
              v-if="selectedIlanForProfile && !selectedIlanForProfile.teklifler?.some((t: any) => t.durum === 'onaylandi')"
              type="button" 
              @click="isSupplierProfileModalOpen = false; openAwardModal(selectedSupplierForProfile, selectedIlanForProfile)" 
              class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Award :size="14" />
              <span>Kazanan Olarak Belirle</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🛡️ MODÜL 4: AWD-001 ~ AWD-007 KAZANAN BELİRLEME & GEREKÇELİ KARAR MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showAwardModal && selectedTeklifForAward" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        
        <!-- Modal Başlık -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black">
              <Award :size="20" />
            </div>
            <div>
              <span class="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">KURAL AWD-001 ~ AWD-007</span>
              <h3 class="text-base font-black text-slate-900">İhale Sonuçlandırma & Kazanan Kararı</h3>
            </div>
          </div>
          <button @click="showAwardModal = false" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <!-- Teklif Özeti -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">İhale:</span>
            <span class="font-bold text-slate-900">{{ selectedIlanForAward?.baslik }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">Aday Kazanan Tedarikçi:</span>
            <span class="font-black text-slate-900">{{ selectedTeklifForAward.firma }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">Kararlaştırılan Tutar:</span>
            <span class="font-black text-emerald-700 font-mono text-base">{{ selectedTeklifForAward.fiyat }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">Teslimat Süresi:</span>
            <span class="font-bold text-slate-700">{{ selectedTeklifForAward.sure }}</span>
          </div>
        </div>

        <!-- Form Alanları -->
        <div class="space-y-4 text-xs">
          
          <!-- Değerlendirme Kriteri -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1.5">
              DEĞERLENDİRME KRİTERİ & SEÇİM ESASI (AWD-001) *
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                @click="awardForm.evaluationType = 'BEST_PRICE'"
                class="p-3 rounded-xl border text-left transition cursor-pointer"
                :class="awardForm.evaluationType === 'BEST_PRICE' ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
              >
                <div class="text-[11px]">En Düşük Fiyat</div>
                <div class="text-[9px] text-slate-500 mt-0.5">Şartnameye uygun en uygun fiyat</div>
              </button>

              <button
                type="button"
                @click="awardForm.evaluationType = 'COMMERCIAL_REASON'"
                class="p-3 rounded-xl border text-left transition cursor-pointer"
                :class="awardForm.evaluationType === 'COMMERCIAL_REASON' ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
              >
                <div class="text-[11px]">Ticari / Lojistik</div>
                <div class="text-[9px] text-slate-500 mt-0.5">Teslim hızı & lokasyon avantajı</div>
              </button>

              <button
                type="button"
                @click="awardForm.evaluationType = 'TECHNICAL_MERIT'"
                class="p-3 rounded-xl border text-left transition cursor-pointer"
                :class="awardForm.evaluationType === 'TECHNICAL_MERIT' ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
              >
                <div class="text-[11px]">Teknik Nitelik</div>
                <div class="text-[9px] text-slate-500 mt-0.5">Kalite, sertifika & referans</div>
              </button>
            </div>
          </div>

          <!-- Gerekçe Kodu (En Düşük Fiyat Dışındaysa veya Her Durumda) -->
          <div v-if="awardForm.evaluationType !== 'BEST_PRICE'">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
              GEREKÇE KODU (KURAL AWD-003 ZORUNLU) *
            </label>
            <select
              v-model="awardForm.awardReasonCode"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
            >
              <option value="FASTEST_DELIVERY">FASTEST_DELIVERY — En Hızlı Teslimat & Acil İş Planı</option>
              <option value="BEST_WARRANTY">BEST_WARRANTY — En Kapsamlı Garanti ve Bakım Hizmeti</option>
              <option value="HIGH_QUALITY_SPEC">HIGH_QUALITY_SPEC — Üst Seviye Teknik Şartname Uyumu</option>
              <option value="PAST_PERFORMANCE">PAST_PERFORMANCE — Geçmiş Başarılı Tedarik Performansı</option>
              <option value="OTHER">OTHER — Diğer Belgeli Ticari / Teknik Neden</option>
            </select>
          </div>

          <!-- Gerekçe Açıklaması -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
              KARAR VE DEĞERLENDİRME AÇIKLAMASI {{ awardForm.evaluationType !== 'BEST_PRICE' ? '(ZORUNLU - AWD-003)' : '(İSTEĞE BAĞLI)' }}
            </label>
            <textarea
              v-model="awardForm.awardReasonNote"
              rows="3"
              placeholder="Karar gerekçesini ve seçim kriterlerinizi tutanakta yer alacak şekilde özetleyiniz..."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 resize-none"
            ></textarea>
          </div>

          <!-- İki Aşamalı Sonuçlandırma Seçeneği (AWD-007) -->
          <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <span class="text-[10px] font-black text-blue-900 uppercase tracking-wider block">SONUÇLANDIRMA AŞAMASI (AWD-007)</span>
            <div class="space-y-1.5">
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  :value="true"
                  v-model="awardForm.isFinal"
                  class="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span class="font-black text-slate-900 text-xs">Kesin Sonuç & Doğrudan Mutabakat (FINALIZED)</span>
                  <p class="text-[10px] text-slate-500">İhale kapatılır, resmi sonuç tutanağı oluşturulur, diğer teklifler elenir ve sipariş-teslimat süreci başlar.</p>
                </div>
              </label>

              <label class="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-blue-100">
                <input
                  type="radio"
                  :value="false"
                  v-model="awardForm.isFinal"
                  class="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span class="font-black text-slate-900 text-xs">Geçici Sonuç Bildirimi (PROVISIONAL_RESULT)</span>
                  <p class="text-[10px] text-slate-500">Aday kazanan belirlenir ancak ihale kesinleştirilmeden önce şirket içi yönetim onayına veya itiraz sürecine tabi tutulur.</p>
                </div>
              </label>
            </div>
          </div>

        </div>

        <!-- Butonlar -->
        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="showAwardModal = false"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            :disabled="isSubmittingAward"
            @click="submitAward"
            class="px-5 py-2.5 rounded-xl bg-[#1EAE4C] hover:bg-[#188c3d] text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 :size="14" />
            <span>{{ isSubmittingAward ? 'Kaydediliyor...' : 'Kararı Onayla & Tutanak Üret' }}</span>
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🛑 MODÜL 4: AWD-002 GEREKÇELİ TEKLİF RET / ELEME MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showRejectModal && selectedTeklifForReject" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-left">
        
        <!-- Modal Başlık -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-black">
              <XCircle :size="20" />
            </div>
            <div>
              <span class="text-[10px] font-black text-red-700 uppercase tracking-wider block">KURAL AWD-002</span>
              <h3 class="text-base font-black text-slate-900">Teklifi Gerekçeli Reddet</h3>
            </div>
          </div>
          <button @click="showRejectModal = false" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div class="font-black flex items-center gap-1.5">
            <AlertTriangle :size="14" class="text-amber-600" />
            <span>Denetim İzi Uyarısı (VUK 595 & AWD-002):</span>
          </div>
          <p class="text-[11px] text-amber-800">
            Teklifler sistemden tamamen silinmez. Gerekçeli ret kararı ve açıklamanız zaman damgasıyla kayıt altına alınır ve tedarikçiye resmi bildirim olarak iletilir.
          </p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="text-slate-500 font-medium">Reddedilecek Teklif Sahibi:</span>
            <strong class="text-slate-900 block mt-0.5">{{ selectedTeklifForReject.firma }} ({{ selectedTeklifForReject.fiyat }})</strong>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
              STANDART RET GEREKÇESİ (AWD-002) *
            </label>
            <select
              v-model="rejectForm.reasonCode"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-red-500"
            >
              <option value="TEKNIK_YETERSIZLIK">Teknik Şartname Maddelerine Uyumsuzluk</option>
              <option value="EVRAK_EKSIKLIGI">Zorunlu Yeterlilik / Ruhsat Evraklarında Eksiklik</option>
              <option value="ASIRI_DUSUK_ACIKLAMASIZ">Aşırı Düşük Teklif Analiz Açıklaması Sunulmadı</option>
              <option value="SARTNAME_AYKIRILIGI">İhale İdari ve Hukuki Koşullarına Aykırılık</option>
              <option value="DIGER">Diğer Ticari / Operasyonel Neden</option>
            </select>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
              DETAYLI RET GEREKÇESİ NOTU
            </label>
            <textarea
              v-model="rejectForm.reasonNote"
              rows="3"
              placeholder="Tedarikçinin incelemesi için gerekçeyi detaylandırınız..."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-red-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="showRejectModal = false"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            :disabled="isSubmittingReject"
            @click="submitReject"
            class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <XCircle :size="14" />
            <span>{{ isSubmittingReject ? 'İşleniyor...' : 'Gerekçeli Ret Kararını Kaydet' }}</span>
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📄 MODÜL 4: AWD-010 RESMİ İHALE SONUÇ TUTANAĞI MODALI (YAZDIRILABİLİR)     -->
    <!-- ========================================================================= -->
    <div v-if="showTutanakModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        <!-- Üst Bar & Eylemler -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#003057] text-white flex items-center justify-center font-black">
              <FileText :size="20" />
            </div>
            <div>
              <span class="text-[10px] font-black text-blue-700 uppercase tracking-wider block">KURAL AWD-010</span>
              <h3 class="text-base font-black text-slate-900">Resmi İhale Sonuç Tutanağı</h3>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="printTutanak"
              class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title="Tutanağı Yazdır veya PDF olarak kaydet"
            >
              <Printer :size="14" />
              <span>Yazdır / PDF</span>
            </button>
            <button @click="showTutanakModal = false" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
              <X :size="18" />
            </button>
          </div>
        </div>

        <!-- Yükleniyor Durumu -->
        <div v-if="isLoadingTutanak" class="py-12 text-center text-slate-400 text-xs font-bold">
          Resmi tutanak verileri ve denetim kayıtları yükleniyor...
        </div>

        <!-- Tutanak Belgesi İçeriği (Print Friendly) -->
        <div v-else-if="currentTutanak" class="space-y-5 print:p-0">
          
          <!-- Kurumsal Belge Anteti -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">İHALE DÜZENLEYEN KURUM</span>
              <strong class="text-sm font-black text-slate-900 block">{{ currentTutanak.ihaleSahibi?.unvan || 'Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)' }}</strong>
              <span class="text-slate-500 font-mono text-[11px] block mt-0.5">VKN: {{ currentTutanak.ihaleSahibi?.vkn || '9560161511' }} • {{ currentTutanak.ihaleSahibi?.vergiDairesi || 'Çanakkale V.D.' }}</span>
              <span class="text-slate-400 text-[10px] block">KEP: {{ currentTutanak.ihaleSahibi?.kep || 'hasanhuseyin.yildirim.17@hs01.kep.tr' }}</span>
            </div>
            <div class="text-right sm:border-l sm:pl-4 border-slate-200 shrink-0">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">TUTANAK NUMARASI</span>
              <strong class="font-mono text-sm font-black text-blue-900 block">{{ currentTutanak.tutanakNo }}</strong>
              <span class="text-slate-500 text-[11px] block mt-0.5">Tarih: {{ currentTutanak.tarih }}</span>
              <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black" :class="currentTutanak.kararStatüsü?.includes('KESİN') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'">
                {{ currentTutanak.kararStatüsü }}
              </span>
            </div>
          </div>

          <!-- İhale ve Kazanan Bilgileri -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <span class="text-[10px] font-black text-slate-400 uppercase block">İhale Detayı</span>
              <div class="font-black text-slate-900 text-sm">{{ currentTutanak.ihaleBasligi }}</div>
              <div class="text-slate-500 font-mono text-[11px]">İhale ID: {{ currentTutanak.ihaleId }}</div>
              <div class="text-slate-500">Kategori: {{ currentTutanak.kategori }}</div>
            </div>

            <div class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
              <span class="text-[10px] font-black text-emerald-800 uppercase block">Kazanan Teklif Sahibi (AWD-001)</span>
              <div class="font-black text-emerald-950 text-sm">{{ currentTutanak.kazanan?.firma }}</div>
              <div class="font-mono font-black text-emerald-700 text-base">{{ currentTutanak.kazanan?.tutar }}</div>
              <div class="text-emerald-800 text-[11px]">Değerlendiren: {{ currentTutanak.kazanan?.degerlendiren }}</div>
            </div>
          </div>

          <!-- Karar Gerekçesi (AWD-003) -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider block">KAZANAN SEÇİM GEREKÇESİ (KURAL AWD-003)</span>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">{{ currentTutanak.gerekce?.kod }}</span>
              <span class="font-bold text-slate-800">{{ currentTutanak.gerekce?.degerlendirmeTuru }}</span>
            </div>
            <p class="text-slate-600 text-xs leading-relaxed pt-1">
              {{ currentTutanak.gerekce?.aciklama }}
            </p>
          </div>

          <!-- Katılımcılar ve Teklifler Dağılım Cetveli -->
          <div class="space-y-2">
            <span class="text-[10px] font-black text-slate-600 uppercase tracking-wider block">KATILIMCI TEKLİF CETVELİ & ELENME DURUMU</span>
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table class="w-full text-left">
                <thead class="bg-slate-100 text-slate-700 font-black border-b border-slate-200 text-[11px]">
                  <tr>
                    <th class="p-2.5">Sıra</th>
                    <th class="p-2.5">Firma / Teklif Veren</th>
                    <th class="p-2.5">Teklif Tutarı</th>
                    <th class="p-2.5">Durum</th>
                    <th class="p-2.5">Gerekçe / Not</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(kat, idx) in currentTutanak.katilimcilar"
                    :key="kat.bidId"
                    :class="kat.durum === 'KAZANDI' ? 'bg-emerald-50/70 font-bold' : ''"
                  >
                    <td class="p-2.5 text-slate-400 font-mono">{{ idx + 1 }}</td>
                    <td class="p-2.5 text-slate-900 font-bold">{{ kat.firma }}</td>
                    <td class="p-2.5 font-mono text-slate-800">{{ kat.tutar }}</td>
                    <td class="p-2.5">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-black"
                        :class="kat.durum === 'KAZANDI' ? 'bg-emerald-600 text-white' : (kat.durum === 'REDDEDİLDİ' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600')"
                      >
                        {{ kat.durum }}
                      </span>
                    </td>
                    <td class="p-2.5 text-slate-500 text-[11px]">{{ kat.not || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Güvenlik Mührü ve Yasal Dipnot (AWD-010 & 5070 Sayılı Kanun) -->
          <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ShieldCheck :size="16" class="text-emerald-400" />
                <span class="font-black text-xs uppercase tracking-wider text-emerald-400">5070 Sayılı Elektronik İmza Kanunu Uyarınca Mühürlenmiştir</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono">VUK 595 UYUMLU</span>
            </div>
            <div class="font-mono text-[10px] text-slate-300 break-all">
              DİJİTAL HASH: {{ currentTutanak.guvenlikMuhru?.dijitalHash }}
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Zaman Damgası: {{ currentTutanak.guvenlikMuhru?.zamanDamgasi }}</span>
              <span>Doğrulama: {{ currentTutanak.guvenlikMuhru?.dogrulamaSunucusu }}</span>
            </div>
          </div>

        </div>

        <!-- Alt Bar -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <span class="text-[10px] text-slate-400">Bu belge İhaleciBurada B2B E-İhale ve Tedarik Sistemi tarafından resmi olarak üretilmiştir.</span>
          <button
            type="button"
            @click="showTutanakModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
