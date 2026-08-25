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
  layout: "public"
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
    alert(`⚠️ BU İHALEDE MUTABAKAT SAĞLANDI:\n\n"${tender.baslik}" ihalesinde alıcı ve tedarikçi arasında mutabakat sağlandığı için yeni teklif verilemez.\n\nİhale sahibi veya anlaşmalı tedarikçi mutabakatı iptal ederse ihale yeniden teklif alımına açılabilir.`)
    return
  }

  // Check if tender has expired
  if (tender.durum === 'expired' || (tender.sure && tender.sure.includes('Süresi Doldu'))) {
    alert(`⚠️ SÜRESİ DOLDU:\n\n"${tender.baslik}" ihalesinin süresi dolduğu için yeni teklif kabul edilmemektedir.`)
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
  <div class="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Header & Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#003057] to-[#0F223D] p-8 rounded-3xl text-white shadow-xl">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1EAE4C]/20 border border-[#1EAE4C]/40 text-[#1EAE4C] text-xs font-black">
            <span class="w-2 h-2 rounded-full bg-[#1EAE4C] animate-pulse"></span>
            CANLI B2B İHALE VE SATIN ALMA PAZARI
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight">İhale Pazarı & Pazar Yeri</h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Türkiye genelinde doğrulanmış firmaların açtığı aktif satın alma ihalelerini inceleyin, kapalı zarf veya canlı eksiltmeyle anında teklif verin.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <NuxtLink
            to="/panel/ihale-olustur"
            class="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1EAE4C] hover:bg-[#188c3d] text-white font-black text-xs shadow-lg shadow-[#1EAE4C]/30 transition-all hover:scale-105"
          >
            <Plus :size="16" />
            Ücretsiz İhale Aç
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
          >
            Kurumsal Üyelik
          </NuxtLink>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <!-- Search Input Row -->
        <div class="flex flex-col md:flex-row items-center gap-3">
          <div class="relative flex-1 w-full">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="İhale adı, malzeme (mıcır, harita, kağıt vb.), şehir, şartname veya ilan no ile arayın..."
              class="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm outline-none transition focus:border-[#1EAE4C] focus:ring-4 focus:ring-[#1EAE4C]/10 bg-slate-50/50"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              Temizle ✕
            </button>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <span class="text-xs font-black text-slate-500 bg-slate-100 px-3 py-3 rounded-2xl">
              {{ filteredTenders.length }} İhale Listeleniyor
            </span>
          </div>
        </div>

        <!-- Category Pills Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="selectedCategory = cat"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
            :class="selectedCategory === cat 
              ? 'bg-[#003057] text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ cat }}
          </button>
        </div>

      </div>

      <!-- Tenders Grid -->
      <div v-if="filteredTenders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tender in filteredTenders"
          :key="tender.id"
          class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
        >
          <!-- Image Box with Badge -->
          <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
            <img 
              :src="tender.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'" 
              :alt="tender.baslik"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                {{ tender.id }}
              </span>
            </div>

            <div class="absolute top-3 right-3">
              <span 
                class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 text-white"
                :class="tender.durum === 'closed' ? 'bg-amber-600' : (tender.durum === 'expired' ? 'bg-slate-600' : 'bg-[#1EAE4C]')"
              >
                <span v-if="tender.durum === 'closed'">🔒 Mutabakat Sağlandı</span>
                <span v-else-if="tender.durum === 'expired'">⌛ Süresi Doldu</span>
                <span v-else>{{ tender.sure || 'Aktif' }}</span>
              </span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <div class="flex items-center gap-1 font-bold">
                <MapPin :size="13" class="text-[#1EAE4C]" />
                <span>{{ tender.city || 'Türkiye Geneli' }}</span>
              </div>
              <div class="flex items-center gap-1 font-bold">
                <Tag :size="13" class="text-amber-400" />
                <span>{{ tender.teklifSayisi || 0 }} Teklif Verildi</span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  {{ tender.kategori }}
                </span>
                <span v-if="tender.durum === 'closed'" class="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  🔒 Anlaşıldı
                </span>
              </div>
              <h2 class="text-base font-black text-slate-800 line-clamp-2 group-hover:text-[#003057] transition-colors">
                {{ tender.baslik }}
              </h2>
              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ tender.aciklama || 'Şartnameye uygun teklifler kabul edilmektedir.' }}
              </p>
            </div>

            <!-- Price & Actions Footer -->
            <div class="pt-4 border-t border-slate-100 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase block">Hedef / Bütçe:</span>
                  <span class="text-sm font-black text-slate-900">{{ tender.butce || 'Açık Eksiltme' }}</span>
                </div>
                <button
                  type="button"
                  @click="downloadAllSpecs(tender)"
                  class="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                  title="Şartname İndir"
                >
                  <Download :size="13" />
                  <span>Şartname (.ZIP)</span>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="selectedTenderForDetail = tender"
                  class="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center cursor-pointer"
                >
                  Detayları Gör
                </button>
                <button
                  type="button"
                  @click="openBidModal(tender)"
                  :disabled="tender.durum === 'closed' || tender.durum === 'expired'"
                  class="w-full py-2.5 rounded-xl text-xs font-black text-white transition text-center flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
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
      <div v-else class="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 shadow-sm">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Search :size="28" />
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-black text-slate-800">Aramanıza Uygun İhale Bulunamadı</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            "{{ searchQuery }}" arama kriterine veya seçili kategoriye ait ihale bulunamadı. Filtreleri temizleyebilir veya yeni bir arama yapabilirsiniz.
          </p>
        </div>
        <button
          @click="searchQuery = ''; selectedCategory = 'Tümü'"
          class="px-5 py-2.5 rounded-xl bg-[#003057] text-white text-xs font-bold hover:bg-[#1EAE4C] transition"
        >
          Tüm İhaleleri Göster
        </button>
      </div>

    </div>

    <!-- TENDER DETAIL MODAL -->
    <div v-if="selectedTenderForDetail" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div>
            <span class="text-xs font-black text-[#1EAE4C] uppercase tracking-wider block">{{ selectedTenderForDetail.kategori }}</span>
            <h2 class="text-xl font-black text-slate-900 mt-1">{{ selectedTenderForDetail.baslik }}</h2>
            <span class="text-xs text-slate-400">İlan No: {{ selectedTenderForDetail.id }} · {{ selectedTenderForDetail.city }}</span>
          </div>
          <button @click="selectedTenderForDetail = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl">
            <X :size="20" />
          </button>
        </div>

        <div class="space-y-4 text-xs text-slate-600 leading-relaxed">
          <!-- Mutabakat Bildirim Kutusu -->
          <div v-if="selectedTenderForDetail.durum === 'closed'" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-2.5">
            <AlertCircle :size="18" class="text-amber-600 shrink-0" />
            <span>⚠️ Bu ihalede taraflar arasında mutabakat sağlanmıştır. Yeni teklif verilemez veya başka bir teklif onaylanamaz.</span>
          </div>

          <div>
            <h4 class="font-black text-slate-800 text-sm mb-1">İhale Açıklaması & Şartname Özeti</h4>
            <p class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {{ selectedTenderForDetail.aciklama || 'Bu ihale için belirtilen standart teknik şartname kuralları geçerlidir.' }}
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">Hedef Bütçe</span>
              <span class="font-black text-slate-800 text-sm">{{ selectedTenderForDetail.butce }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">Durum / Süre</span>
              <span class="font-black text-slate-800 text-sm">{{ selectedTenderForDetail.durum === 'closed' ? 'Mutabakat Sağlandı' : selectedTenderForDetail.sure }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 font-bold block">Gelen Teklif</span>
              <span class="font-black text-slate-800 text-sm">{{ selectedTenderForDetail.teklifSayisi }} Firma</span>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <FileText :size="24" class="text-blue-600" />
              <div>
                <div class="font-black text-blue-900 text-xs">Teknik Şartname & Ek Dosyalar (.ZIP)</div>
                <div class="text-[10px] text-blue-600">PDF, Excel Şartname ve Çizimler</div>
              </div>
            </div>
            <button 
              @click="downloadAllSpecs(selectedTenderForDetail)"
              class="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download :size="13" />
              İndir
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            @click="selectedTenderForDetail = null" 
            class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Kapat
          </button>
          <button
            v-if="selectedTenderForDetail.durum !== 'closed' && selectedTenderForDetail.durum !== 'expired'"
            @click="openBidModal(selectedTenderForDetail); selectedTenderForDetail = null"
            class="px-6 py-2.5 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send :size="13" />
            Hemen Teklif Ver
          </button>
          <button
            v-else
            disabled
            class="px-6 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs cursor-not-allowed"
          >
            Teklife Kapalı
          </button>
        </div>
      </div>
    </div>

    <!-- SUBMIT BID MODAL -->
    <div v-if="showBidModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div>
            <span class="text-xs font-black text-[#1EAE4C] uppercase tracking-wider block">KAPALI ZARF TEKLİF VERME</span>
            <h3 class="text-lg font-black text-slate-900 mt-1">{{ selectedTenderForBid?.baslik }}</h3>
          </div>
          <button @click="showBidModal = false" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl">
            <X :size="20" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TEKLİF FİYATINIZ (₺ / KDV DAHİL) *</label>
            <input 
              v-model="bidForm.fiyat"
              type="text"
              placeholder="Örn: 1.250.000 ₺"
              class="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 outline-none focus:border-[#1EAE4C] focus:ring-4 focus:ring-[#1EAE4C]/10"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TESLİMAT SÜRESİ</label>
              <input 
                v-model="bidForm.sure"
                type="text"
                placeholder="Örn: 10 gün"
                class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#1EAE4C]"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">FİRMA ADINIZ</label>
              <input 
                v-model="bidForm.firmaAdi"
                type="text"
                class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#1EAE4C]"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TEKLİF NOTU & AVANTAJLAR</label>
            <textarea
              v-model="bidForm.notum"
              rows="3"
              placeholder="Teknik şartnameye uygunluk, garanti koşulları, ücretsiz nakliye vb. notlarınızı yazınız..."
              class="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#1EAE4C]"
            ></textarea>
          </div>

          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck :size="16" class="text-amber-600 shrink-0 mt-0.5" />
            <span>Teklifiniz şifrelenerek alıcıya iletilir. İhale süresi bitene kadar diğer tedarikçiler fiyatınızı göremez.</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            @click="showBidModal = false" 
            class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            @click="submitBid"
            class="px-6 py-2.5 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs transition shadow-lg flex items-center gap-1.5"
          >
            <Send :size="13" />
            Teklifi Gönder & NetGSM SMS İlet
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
