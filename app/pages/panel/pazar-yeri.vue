<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  Heart, 
  MapPin, 
  Clock, 
  Building2, 
  Tag, 
  Send, 
  CheckCircle2, 
  FileText, 
  Download, 
  AlertCircle,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({
  layout: "dashboard"
})

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const activeSegment = ref<'all' | 'urun' | 'imalat' | 'proje'>('all')
const selectedCategory = ref<string>('Tümü')
const searchQuery = ref('')
const selectedTenderForDetail = ref<any>(null)
const showBidModal = ref(false)
const selectedTenderForBid = ref<any>(null)

const bidForm = ref({
  fiyat: '',
  sure: '7 gün',
  notum: '',
  firmaAdi: 'Kaya Tedarik & İnşaat Ltd.'
})

const allTenders = computed(() => {
  return cmsData.value?.dashboard?.tenders || []
})

const categories = [
  'Tümü',
  'İnşaat ve Yapı',
  'Sanayi ve Makine',
  'Bilgisayar ve Teknoloji',
  'Elektronik',
  'Mobilya ve Ofis',
  'Tarım ve Hayvancılık',
  'Araç ve İş Makineleri'
]

const filteredTenders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allTenders.value.filter(t => {
    // Category filter
    if (selectedCategory.value !== 'Tümü' && !t.kategori.toLowerCase().includes(selectedCategory.value.toLowerCase())) {
      return false
    }

    // Search query filter (matches title, description, category, city, id, keywords)
    if (q) {
      const matchTitle = (t.baslik || '').toLowerCase().includes(q)
      const matchCat = (t.kategori || '').toLowerCase().includes(q)
      const matchDesc = (t.aciklama || '').toLowerCase().includes(q)
      const matchCity = (t.city || '').toLowerCase().includes(q)
      const matchId = (t.id || '').toLowerCase().includes(q)
      if (!matchTitle && !matchCat && !matchDesc && !matchCity && !matchId) {
        return false
      }
    }

    return true
  })
})

function openBidModal(tender: any) {
  // Check if tender is closed or has mutabakat
  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi' || (tender.sure && (tender.sure.includes('Sonuçlandı') || tender.sure.includes('Mutabakat')))) {
    alert(`⚠️ BU İHALEDE MUTABAKAT SAĞLANDI:\n\n"${tender.baslik}" ihalesinde taraflar arasında anlaşma ve mutabakat sağlandığı için yeni teklif verilemez.\n\nİhale sahibi veya kazanan tedarikçi anlaşmayı iptal ederse ihale tekrar teklif alımına açılabilir.`)
    return
  }

  // Check if tender has expired
  if (tender.durum === 'expired' || (tender.sure && tender.sure.includes('Süresi Doldu'))) {
    alert(`⚠️ SÜRESİ DOLDU:\n\n"${tender.baslik}" ihalesinin yayın süresi dolduğu için yeni teklif kabul edilmemektedir.`)
    return
  }

  // Check if supplier already submitted a bid for this tender
  const existingBid = (cmsData.value.dashboard.submittedBids || []).find(
    (b: any) => b.tenderId === tender.id || b.ilanBaslik === tender.baslik
  )
  if (existingBid) {
    alert(`⚠️ DİKKAT: Bu ihaleye zaten daha önce ${existingBid.teklifFiyatim} tutarında bir teklif ilettiniz!\n\nLütfen mükerrer ayrı teklif açmak yerine panelinizdeki "Verdiğim Teklifler" sayfasından mevcut teklifinizi revize ediniz.`)
    return
  }

  selectedTenderForBid.value = tender
  bidForm.value.fiyat = ''
  bidForm.value.notum = ''
  showBidModal.value = true
}

async function submitBid() {
  if (!bidForm.value.fiyat) {
    alert('Lütfen teklif fiyatınızı giriniz.')
    return
  }

  let formattedPrice = bidForm.value.fiyat.trim()
  if (!formattedPrice.includes('₺') && !formattedPrice.includes('$') && !formattedPrice.includes('€')) {
    formattedPrice = formattedPrice + ' ₺'
  }

  const tender = selectedTenderForBid.value
  const newBidId = 'TKF-' + Math.floor(100 + Math.random() * 900)

  // 1. Add to submittedBids
  cmsData.value.dashboard.submittedBids.unshift({
    id: newBidId,
    tenderId: tender.id,
    ilanBaslik: tender.baslik,
    aliciFirma: tender.city + ' Kurumsal Alıcı',
    kategori: tender.kategori,
    teklifFiyatim: formattedPrice,
    sure: bidForm.value.sure,
    durum: 'bekliyor',
    tarih: 'Bugün',
    bitisTarihi: tender.sure || '7 gün',
    notum: bidForm.value.notum,
    pazarlikGecmisi: []
  })

  // 2. Add to receivedBids matching slot
  let targetReceivedGroup = cmsData.value.dashboard.receivedBids.find((g: any) => g.id === tender.id || g.baslik === tender.baslik)
  if (!targetReceivedGroup) {
    targetReceivedGroup = {
      id: tender.id,
      baslik: tender.baslik,
      kategori: tender.kategori,
      bitis: tender.sure,
      teklifler: []
    }
    cmsData.value.dashboard.receivedBids.unshift(targetReceivedGroup)
  }

  targetReceivedGroup.teklifler.unshift({
    id: newBidId,
    firma: bidForm.value.firmaAdi,
    fiyat: formattedPrice,
    sure: bidForm.value.sure,
    puan: 4.8,
    durum: 'bekliyor',
    yetkili: 'Ahmet Yılmaz',
    telefon: '+90 532 999 00 11',
    eposta: 'teklif@kayatedarik.com',
    vergiDairesi: 'Balıkesir V.D. / 5920192847',
    adres: 'Organize Sanayi Bölgesi 2. Cadde Balıkesir',
    pazarlikGecmisi: []
  })

  // Increment bid count on tender
  tender.teklifSayisi = (tender.teklifSayisi || 0) + 1

  // Persist
  saveCmsData(cmsData.value)

  // Trigger NetGSM SMS simulation to buyer
  await sendSms({
    recipientPhone: '+90 532 000 11 22',
    recipientName: 'İhale Sahibi Firma',
    templateName: 'Yeni Teklif Bildirimi',
    messageBody: `Sayın Yetkili, "${tender.baslik}" ihaleniz için ${bidForm.value.firmaAdi} tarafından ${formattedPrice} tutarında yeni bir teklif verildi. Panelinizi inceleyiniz.`
  })

  showBidModal.value = false
  alert(`🎉 TEKLİFİNİZ BAŞARIYLA İLETİLDİ!\n\n"${tender.baslik}" ihalesine ${formattedPrice} tutarındaki teklifiniz kapalı zarf usulü ile alıcıya sunuldu. NetGSM SMS bilgilendirmesi yapıldı.`)
}

function downloadAllSpecs(tender: any) {
  alert(`📥 "${tender.baslik}" İHALESİNE AİT ŞARTNAME VE TEKNİK ÇİZİMLER İNDİRİLİYOR\n\nDosya: ${tender.id}_Teknik_Sartname_Paketi.zip\nBoyut: 8.4 MB\nİçerik: Teknik şartname PDF, DWG çizimler, malzeme listesi Excel.`)
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          İhale Pazar Yeri & Canlı Fırsatlar
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Aktif kurumsal ihaleleri inceleyin, teknik şartnameleri indirin ve doğrudan kapalı zarf teklif verin.
        </p>
      </div>

      <NuxtLink
        to="/panel/ihale-olustur"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1EAE4C] hover:bg-[#188c3d] text-white font-black text-xs shadow-md shadow-[#1EAE4C]/20 transition self-start sm:self-auto"
      >
        <Plus :size="15" />
        + Yeni İhale Aç
      </NuxtLink>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="relative flex-1 w-full">
          <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="İhale adı, malzeme (mıcır, yol, harita vb.), şehir veya ilan no ile arayın..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none transition focus:border-[#1EAE4C] bg-slate-50/50"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <span class="text-xs font-black text-slate-600 bg-slate-100 px-3 py-2.5 rounded-xl">
            {{ filteredTenders.length }} İhale Aktif
          </span>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedCategory = cat"
          class="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
          :class="selectedCategory === cat 
            ? 'bg-[#003057] text-white shadow-xs' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Tenders Grid -->
    <div v-if="filteredTenders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="tender in filteredTenders"
        :key="tender.id"
        class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
      >
        <!-- Image & Badges -->
        <div class="relative h-40 w-full bg-slate-100 overflow-hidden">
          <img 
            :src="tender.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'" 
            :alt="tender.baslik"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div class="absolute top-2.5 left-2.5">
            <span class="px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-black uppercase tracking-wider">
              {{ tender.id }}
            </span>
          </div>

          <div class="absolute top-2.5 right-2.5">
            <span 
              class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1"
              :class="tender.durum === 'closed' ? 'bg-amber-600' : (tender.durum === 'expired' ? 'bg-slate-600' : 'bg-[#1EAE4C]')"
            >
              <span v-if="tender.durum === 'closed'">🔒 Mutabakat Sağlandı</span>
              <span v-else-if="tender.durum === 'expired'">⌛ Süresi Doldu</span>
              <span v-else>{{ tender.sure || 'Aktif' }}</span>
            </span>
          </div>

          <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold">
            <div class="flex items-center gap-1">
              <MapPin :size="12" class="text-[#1EAE4C]" />
              <span>{{ tender.city || 'Balıkesir' }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Tag :size="12" class="text-amber-400" />
              <span>{{ tender.teklifSayisi || 0 }} Teklif</span>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                {{ tender.kategori }}
              </span>
              <span v-if="tender.durum === 'closed'" class="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                🔒 Anlaşıldı
              </span>
            </div>
            <h3 class="text-sm font-black text-slate-800 line-clamp-2">
              {{ tender.baslik }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {{ tender.aciklama || 'Şartnameye uygun teklifler kabul edilmektedir.' }}
            </p>
          </div>

          <!-- Bottom Price & Buttons -->
          <div class="pt-3 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[9px] font-bold text-slate-400 uppercase block">Bütçe:</span>
                <span class="text-xs font-black text-slate-900">{{ tender.butce || 'Açık Eksiltme' }}</span>
              </div>
              <button
                type="button"
                @click="downloadAllSpecs(tender)"
                class="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-blue-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 transition cursor-pointer"
              >
                <Download :size="12" />
                <span>Şartname (.ZIP)</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="selectedTenderForDetail = tender"
                class="w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center cursor-pointer"
              >
                Detaylar
              </button>
              <button
                type="button"
                @click="openBidModal(tender)"
                :disabled="tender.durum === 'closed' || tender.durum === 'expired'"
                class="w-full py-2 rounded-xl text-xs font-black text-white transition text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                :class="tender.durum === 'closed' ? 'bg-amber-700/80 cursor-not-allowed' : (tender.durum === 'expired' ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#003057] hover:bg-[#1EAE4C]')"
              >
                <Send :size="12" />
                <span>{{ tender.durum === 'closed' ? '🔒 Mutabakat Sağlandı' : (tender.durum === 'expired' ? '⌛ Süresi Doldu' : 'Teklif Ver') }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 text-[#003057] flex items-center justify-center mx-auto border border-blue-100">
        <FileText :size="24" />
      </div>
      <div class="space-y-1 max-w-md mx-auto">
        <h3 class="text-sm font-black text-slate-800">
          {{ allTenders.length === 0 ? 'Henüz Yayında İhale Bulunmuyor' : 'Eşleşen İhale Bulunamadı' }}
        </h3>
        <p class="text-xs text-slate-500 font-medium">
          {{ allTenders.length === 0 ? 'Örnek ilanlar temizlendi. Platformda açılan yeni onaylı ihaleler burada listelenecektir.' : `"${searchQuery}" aramanıza uygun ihale bulunamadı.` }}
        </p>
      </div>
      <div class="pt-1 flex flex-wrap items-center justify-center gap-2">
        <NuxtLink
          to="/panel/ihale-olustur"
          class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
        >
          <Plus :size="13" />
          <span>Yeni İhale Aç</span>
        </NuxtLink>
        <button
          v-if="allTenders.length > 0 && searchQuery"
          @click="searchQuery = ''; selectedCategory = 'Tümü'"
          class="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>

    <!-- MODAL 1: TENDER DETAIL -->
    <div v-if="selectedTenderForDetail" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-3 border-slate-100">
          <div>
            <span class="text-xs font-black text-[#1EAE4C] uppercase">{{ selectedTenderForDetail.kategori }}</span>
            <h3 class="text-lg font-black text-slate-900 mt-1">{{ selectedTenderForDetail.baslik }}</h3>
          </div>
          <button @click="selectedTenderForDetail = null" class="text-slate-400 hover:text-slate-700">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-600">
          <!-- Mutabakat Bildirim Kutusu -->
          <div v-if="selectedTenderForDetail.durum === 'closed'" class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-2">
            <AlertCircle :size="16" class="text-amber-600 shrink-0" />
            <span>⚠️ Bu ihalede taraflar arasında mutabakat sağlanmıştır. Yeni teklif verilemez veya ihale üzerinde başka bir teklif onaylanamaz.</span>
          </div>

          <p class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {{ selectedTenderForDetail.aciklama || 'Bu ihale için belirtilen standart teknik şartname kuralları geçerlidir.' }}
          </p>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-[10px] text-slate-400 block font-bold">Bütçe</span>
              <span class="font-black text-slate-800">{{ selectedTenderForDetail.butce }}</span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-[10px] text-slate-400 block font-bold">Durum / Süre</span>
              <span class="font-black text-slate-800">{{ selectedTenderForDetail.durum === 'closed' ? 'Mutabakat Sağlandı' : selectedTenderForDetail.sure }}</span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-[10px] text-slate-400 block font-bold">Teklifler</span>
              <span class="font-black text-slate-800">{{ selectedTenderForDetail.teklifSayisi }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="selectedTenderForDetail = null" class="px-4 py-2 rounded-lg border text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
            Kapat
          </button>
          <button 
            v-if="selectedTenderForDetail.durum !== 'closed' && selectedTenderForDetail.durum !== 'expired'"
            @click="openBidModal(selectedTenderForDetail); selectedTenderForDetail = null"
            class="px-5 py-2 rounded-lg bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs cursor-pointer shadow-sm"
          >
            Teklif Ver
          </button>
          <button
            v-else
            disabled
            class="px-5 py-2 rounded-lg bg-slate-300 text-slate-500 font-bold text-xs cursor-not-allowed"
          >
            Teklife Kapalı
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: SUBMIT BID -->
    <div v-if="showBidModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-3 border-slate-100">
          <div>
            <span class="text-xs font-black text-[#1EAE4C] uppercase">KAPALI ZARF TEKLİF</span>
            <h3 class="text-base font-black text-slate-900 mt-0.5">{{ selectedTenderForBid?.baslik }}</h3>
          </div>
          <button @click="showBidModal = false" class="text-slate-400 hover:text-slate-700">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">TEKLİF FİYATINIZ (₺) *</label>
            <input 
              v-model="bidForm.fiyat"
              type="text"
              placeholder="Örn: 1.250.000 ₺"
              class="w-full p-3 rounded-xl border border-slate-200 text-sm font-black text-slate-900 outline-none focus:border-[#1EAE4C]"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">TESLİMAT SÜRESİ</label>
              <input 
                v-model="bidForm.sure"
                type="text"
                class="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">FİRMA ADI</label>
              <input 
                v-model="bidForm.firmaAdi"
                type="text"
                class="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">TEKLİF NOTU</label>
            <textarea
              v-model="bidForm.notum"
              rows="2"
              placeholder="Şartnameye uygunluk veya teslimat notu..."
              class="w-full p-2.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#1EAE4C]"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="showBidModal = false" class="px-4 py-2 rounded-lg border text-xs font-bold text-slate-600">
            İptal
          </button>
          <button
            @click="submitBid"
            class="px-5 py-2 rounded-lg bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs flex items-center gap-1.5"
          >
            <Send :size="12" />
            Teklifi Gönder
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
