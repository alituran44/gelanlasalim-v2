<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Search, 
  SlidersHorizontal, 
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
  BadgeCheck,
  Layers,
  RotateCcw,
  Calendar,
  Filter,
  BarChart3,
  FileSpreadsheet,
  Newspaper,
  X,
  Users
} from 'lucide-vue-next'
import { useCmsData, DEFAULT_CMS_DATA } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({
  layout: "public"
})

useSeoMeta({
  title: 'İhale Portalı & Canlı Eksiltme Pazar Yeri - İhaleciBurada',
  description: 'Türkiye genelinde güncel B2B ihaleleri, satın alma şartnameleri, malzeme listeleri ve sözleşme kayıtları.',
  ogTitle: 'İhale Portalı & Canlı Eksiltme Pazar Yeri - İhaleciBurada',
  ogDescription: 'Güncel B2B ihaleleri, satın alma şartnameleri, malzeme listeleri ve sözleşme kayıtları.'
})

const route = useRoute()
const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const activeTab = ref<'guncel' | 'gecmis' | 'sonuc' | 'detayli'>('guncel')
const viewMode = ref<'gelismis' | 'basit'>('gelismis')
const hideRead = ref(false)

const searchQuery = ref('')
const selectedCategory = ref<string>('Tümü')
const selectedMethod = ref<string>('Tümü')
const selectedType = ref<string>('Tümü')
const selectedCity = ref<string>('Tümü')
const selectedCostRange = ref<string>('Tümü')
const dateStart = ref('')
const dateEnd = ref('')
const selectedSort = ref<'otomatik' | 'views' | 'sozlesme' | 'sehir'>('otomatik')
const currentPage = ref(1)

const selectedTenderForDetail = ref<any>(null)
const showSpecModal = ref(false)
const selectedSpecTender = ref<any>(null)
const specActiveTab = ref<'malzeme' | 'idari' | 'teknik'>('malzeme')

const showBidModal = ref(false)
const selectedTenderForBid = ref<any>(null)
const userSession = ref<any>({})

const bidForm = ref({
  fiyat: '',
  sure: '7 gün',
  notum: '',
  firmaAdi: 'Ali Turan Sanayi ve Ticaret A.Ş.'
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (userSession.value.companyName || userSession.value.company) {
        bidForm.value.firmaAdi = userSession.value.companyName || userSession.value.company
      }

      if (!cmsData.value?.dashboard?.tenders || cmsData.value.dashboard.tenders.length === 0) {
        if (!cmsData.value.dashboard) {
          cmsData.value.dashboard = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.dashboard))
        } else {
          cmsData.value.dashboard.tenders = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.dashboard.tenders))
        }
        saveCmsData(cmsData.value)
      }
    } catch (e) {}
  }

  if (route.query.q) {
    searchQuery.value = String(route.query.q)
  }
  if (route.query.search) {
    searchQuery.value = String(route.query.search)
  }
  if (route.query.kategori) {
    selectedCategory.value = String(route.query.kategori)
  }
})

const allTenders = computed(() => {
  const list = cmsData.value?.dashboard?.tenders || []
  if (list.length > 0) return list
  return DEFAULT_CMS_DATA.dashboard.tenders || []
})

const categories = [
  'Tümü',
  'İnşaat - Altyapı - Üstyapı - Yapım İşi',
  'Sanayi ve Makine Ekipmanları',
  'Lojistik ve Nakliye Hizmetleri',
  'Ambalaj, Koli ve Kağıt',
  'Bilişim, Yazılım ve IT Ekipmanı',
  'Enerji, Akaryakıt ve GES Tesisatı',
  'Gıda, İkram ve Yemek Hizmetleri',
  'Medikal ve Sağlık Sarf Malzemeleri'
]

const types = [
  'Tümü',
  'Mal Alımı',
  'Hizmet Alımı',
  'Yapım İşi',
  'Danışmanlık'
]

const methods = [
  'Tümü',
  'Açık İhale',
  'Açık Eksiltme',
  'Pazarlık Usulü (21/f)',
  'Doğrudan Temin',
  'Belli İstekliler'
]

const cities = [
  'Tümü',
  'Ankara',
  'İstanbul',
  'İzmir',
  'Bursa',
  'Kocaeli',
  'Çanakkale',
  'Gaziantep',
  'Adana',
  'Tekirdağ',
  'Antalya',
  'Konya'
]

const costRanges = [
  'Tümü',
  '0 - 500.000 ₺',
  '500.000 - 2.000.000 ₺',
  '2.000.000 - 10.000.000 ₺',
  '10.000.000 ₺ Üstü'
]

const filteredTenders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = allTenders.value.filter(t => {
    if (activeTab.value === 'sonuc' && t.durum !== 'closed') {
      return false
    }
    if (activeTab.value === 'gecmis' && t.durum !== 'closed' && t.durum !== 'expired') {
      return false
    }
    if (activeTab.value === 'guncel' && t.durum === 'closed') {
      return false
    }

    if (selectedCategory.value !== 'Tümü' && !t.kategori?.toLowerCase().includes(selectedCategory.value.toLowerCase())) {
      return false
    }

    if (selectedType.value !== 'Tümü' && !t.tur?.toLowerCase().includes(selectedType.value.toLowerCase()) && !t.type?.toLowerCase().includes(selectedType.value.toLowerCase())) {
      return false
    }

    if (selectedMethod.value !== 'Tümü' && !t.tur?.toLowerCase().includes(selectedMethod.value.toLowerCase()) && !t.method?.toLowerCase().includes(selectedMethod.value.toLowerCase())) {
      return false
    }

    if (selectedCity.value !== 'Tümü' && !t.city?.toLowerCase().includes(selectedCity.value.toLowerCase())) {
      return false
    }

    if (q) {
      const matchTitle = (t.baslik || '').toLowerCase().includes(q)
      const matchCat = (t.kategori || '').toLowerCase().includes(q)
      const matchDesc = (t.aciklama || '').toLowerCase().includes(q)
      const matchCity = (t.city || '').toLowerCase().includes(q)
      const matchId = (t.id || '').toLowerCase().includes(q)
      const matchAuth = (t.authority || '').toLowerCase().includes(q)
      if (!matchTitle && !matchCat && !matchDesc && !matchCity && !matchId && !matchAuth) {
        return false
      }
    }

    return true
  })

  if (selectedSort.value === 'sozlesme') {
    list.sort((a, b) => (parseInt(b.butce?.replace(/\D/g, '') || '0') - parseInt(a.butce?.replace(/\D/g, '') || '0')))
  } else if (selectedSort.value === 'views') {
    list.sort((a, b) => ((b.teklifSayisi || 0) - (a.teklifSayisi || 0)))
  } else if (selectedSort.value === 'sehir') {
    list.sort((a, b) => (a.city || '').localeCompare(b.city || ''))
  }

  return list
})

function openModalWithTab(tender: any, tab: 'ilan' | 'malzeme' | 'idari' | 'sozlesme' | 'firmalar' | 'sonuc' | 'gecmis') {
  selectedTenderForDetail.value = tender
  detailActiveTab.value = tab
}

function resetFilters() {
  selectedCategory.value = 'Tümü'
  selectedMethod.value = 'Tümü'
  selectedType.value = 'Tümü'
  selectedCity.value = 'Tümü'
  selectedCostRange.value = 'Tümü'
  searchQuery.value = ''
  dateStart.value = ''
  dateEnd.value = ''
}

function openSpecModal(tender: any) {
  selectedSpecTender.value = tender
  specActiveTab.value = 'malzeme'
  showSpecModal.value = true
}

function openBidModal(tender: any) {
  // 1. Kendi İlanına Teklif Verme Engeli
  const currentEmail = userSession.value?.email || ''
  if (tender.isMine || (currentEmail && tender.ownerEmail === currentEmail)) {
    alert(`⚠️ BU SİZİN KENDİ İLANINIZDIR:\n\n"${tender.baslik}" ihalesi sizin tarafınızdan açılmıştır. Kendi ihalelerinize teklif veremezsiniz.\n\nGelen teklifleri incelemek ve pazarlık yapmak için panelinizdeki "Gelen Teklifler" sayfasına gidebilirsiniz.`)
    return
  }

  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi' || (tender.sure && (tender.sure.includes('Sonuçlandı') || tender.sure.includes('Mutabakat')))) {
    alert(`⚠️ BU İHALEDE MUTABAKAT SAĞLANDI:\n\n"${tender.baslik}" ihalesinde alıcı ve tedarikçi arasında mutabakat sağlandığı için yeni teklif verilemez.\n\nİhale sahibi veya anlaşmalı tedarikçi mutabakatı iptal ederse ihale yeniden teklif alımına açılabilir.`)
    return
  }

  if (tender.durum === 'expired' || (tender.sure && tender.sure.includes('Süresi Doldu'))) {
    alert(`⚠️ SÜRESİ DOLDU:\n\n"${tender.baslik}" ihalesinin süresi dolduğu için yeni teklif kabul edilmemektedir.`)
    return
  }

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
  if (userSession.value.companyName || userSession.value.company) {
    bidForm.value.firmaAdi = userSession.value.companyName || userSession.value.company
  }
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

  const myCompanyName = userSession.value.companyName || userSession.value.company || bidForm.value.firmaAdi || 'Yetkili Firma'
  const myContact = userSession.value.name || userSession.value.firstName || 'Ali Turan'
  const myPhone = userSession.value.phone || '0850 840 86 95'
  const myEmail = userSession.value.email || 'ihalcib@gmail.com'
  const myTax = userSession.value.taxOffice ? `${userSession.value.taxOffice} / ${userSession.value.taxNo || ''}` : 'Çanakkale V.D. 4700854210'
  const myAddress = userSession.value.faturaAdresi || 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale'

  const newSubmittedBid = {
    id: newBidId,
    tenderId: tender.id,
    ilanBaslik: tender.baslik,
    aliciFirma: tender.ownerCompany || (tender.city + ' Kurumsal Alıcı'),
    kategori: tender.kategori,
    teklifFiyatim: formattedPrice,
    sure: bidForm.value.sure,
    durum: 'bekliyor',
    tarih: 'Bugün',
    bitisTarihi: tender.sure || '7 gün',
    notum: bidForm.value.notum,
    pazarlikGecmisi: []
  }

  cmsData.value.dashboard.submittedBids.unshift(newSubmittedBid)

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
    firma: myCompanyName,
    fiyat: formattedPrice,
    sure: bidForm.value.sure,
    puan: 5.0,
    durum: 'bekliyor',
    yetkili: myContact,
    telefon: myPhone,
    eposta: myEmail,
    vergiDairesi: myTax,
    adres: myAddress,
    pazarlikGecmisi: []
  })

  tender.teklifSayisi = (tender.teklifSayisi || 0) + 1
  saveCmsData(cmsData.value)

  if (typeof window !== 'undefined') {
    try {
      const myBids = JSON.parse(localStorage.getItem('myBids') || '[]')
      myBids.unshift(newSubmittedBid)
      localStorage.setItem('myBids', JSON.stringify(myBids))

      const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]')
      notifications.unshift({
        id: Date.now(),
        title: 'Teklifiniz Başarıyla İletildi',
        desc: `"${tender.baslik}" ihalesine ${formattedPrice} tutarındaki teklifiniz alıcı firmaya sunuldu.`,
        date: 'Şimdi',
        read: false,
        type: 'bid'
      })
      localStorage.setItem('userNotifications', JSON.stringify(notifications))
    } catch (e) {}
  }

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
  let content = `========================================================\nİHALECİBURADA.COM - RESMİ İHALE ŞARTNAME VE MALZEME PAKETİ\nİhale No: ${tender.id}\nİhale Başlığı: ${tender.baslik}\nKategori: ${tender.kategori}\nŞehir: ${tender.city || 'Türkiye Geneli'}\nBütçe: ${tender.butce || 'Açık İhale'}\n========================================================\n\n1. İHALE METNİ VE GENEL ŞARTLAR:\n${tender.aciklama || 'Belirtilen standart şartname hükümleri geçerlidir.'}\n\n2. MALZEME LİSTESİ & METRAJ:\n- Kalem 1: Standart şartname metrajına uygun malzeme ve işçilik.\n\n3. İDARİ VE TEKNİK ŞARTLAR:\n- Teslimat süresine ve irsaliye kabul kriterlerine uygunluk esastır.\n- Hakediş ödemesi TCMB/BDDK mevzuatına uygun Güvenli Havuz (Escrow) hesabında korunacaktır.\n========================================================\n`
  
  if (typeof document !== 'undefined') {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `Sartname_Paketi_${tender.id}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] py-4 px-2 sm:px-4 text-left font-sans text-xs">
    <div class="max-w-[1400px] mx-auto space-y-3">
      
      <!-- 🔵 1. TOP SUB-TABS STRIP (GÖRSEL 2: GÜNCEL, GEÇMİŞ, SONUÇ, DETAYLI ARA) -->
      <div class="flex items-center justify-between border-b border-slate-300 bg-white px-3 py-1.5 rounded-t-lg shadow-2xs">
        <div class="flex items-center gap-1 sm:gap-2">
          <button 
            type="button"
            @click="activeTab = 'guncel'"
            :class="activeTab === 'guncel' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'"
            class="px-3 sm:px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock :size="13" />
            <span>Güncel</span>
          </button>
          <button 
            type="button"
            @click="activeTab = 'gecmis'"
            :class="activeTab === 'gecmis' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'"
            class="px-3 sm:px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw :size="13" />
            <span>Geçmiş</span>
          </button>
          <button 
            type="button"
            @click="activeTab = 'sonuc'"
            :class="activeTab === 'sonuc' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'"
            class="px-3 sm:px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 :size="13" />
            <span>Sonuç</span>
          </button>
          <button 
            type="button"
            @click="activeTab = 'detayli'"
            :class="activeTab === 'detayli' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'"
            class="px-3 sm:px-4 py-1.5 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Search :size="13" />
            <span>Detaylı Ara</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink 
            to="/" 
            class="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1"
          >
            <span>← Geri dön</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 🎛️ 2. MULTI-FIELD SEARCH & FILTER BOX (GÖRSEL 2 FORMATI) -->
      <div class="bg-white border border-slate-300 p-3 sm:p-4 rounded-b-lg shadow-2xs space-y-3">
        <!-- 7-Field Filter Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Kategori:</label>
            <select v-model="selectedCategory" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Şehir:</label>
            <select v-model="selectedCity" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none">
              <option v-for="ci in cities" :key="ci" :value="ci">{{ ci }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">İhale türü:</label>
            <select v-model="selectedType" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none">
              <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">İhale usulü:</label>
            <select v-model="selectedMethod" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none">
              <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Yaklaşık maliyet:</label>
            <select v-model="selectedCostRange" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none">
              <option v-for="cr in costRanges" :key="cr" :value="cr">{{ cr }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">İhale içeriği:</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Kelime ara" 
              class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 font-bold text-xs outline-none"
            />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Yayın tarihi:</label>
            <div class="flex items-center gap-1">
              <input v-model="dateStart" type="text" placeholder="gg.aa.yyyy" class="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-[11px] outline-none" />
              <Calendar :size="14" class="text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        <!-- Radios & Search Button Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="basit" v-model="viewMode" class="text-[#0084B4]" />
              <span>Basit görünüm</span>
            </label>
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="gelismis" v-model="viewMode" class="text-[#0084B4]" />
              <span>Gelişmiş görünüm</span>
            </label>

            <label class="inline-flex items-center gap-1.5 cursor-pointer ml-2">
              <input type="checkbox" v-model="hideRead" class="text-[#0084B4]" />
              <span>Okuduklarımı gizle</span>
            </label>
          </div>

          <div class="flex items-center gap-2">
            <button 
              type="button"
              class="px-6 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Ara</span>
              <Search :size="13" />
            </button>
          </div>
        </div>
      </div>

      <!-- 🛠️ 3. ACTION TOOLBAR & FILTER TAGS -->
      <div class="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-300 shadow-2xs">
        <div class="flex flex-wrap items-center gap-1.5">
          <button 
            type="button"
            @click="resetFilters" 
            class="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <X :size="12" />
            <span>Sıfırla</span>
          </button>

          <span v-if="selectedCategory !== 'Tümü'" class="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs flex items-center gap-1">
            <span>Kategori: {{ selectedCategory }}</span>
            <button type="button" @click="selectedCategory = 'Tümü'" class="hover:text-red-600"><X :size="12" /></button>
          </span>

          <span v-if="searchQuery" class="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs flex items-center gap-1">
            <span>Arama: "{{ searchQuery }}"</span>
            <button type="button" @click="searchQuery = ''" class="hover:text-red-600"><X :size="12" /></button>
          </span>

          <button type="button" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <Filter :size="12" />
            <span>Filtrele</span>
          </button>
          <button type="button" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <SlidersHorizontal :size="12" />
            <span>Sırala</span>
          </button>
          <button type="button" @click="resetFilters" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <RotateCcw :size="12" />
            <span>Yenile</span>
          </button>
        </div>

        <div class="flex items-center gap-1.5">
          <NuxtLink to="/panel/istatistikler" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <BarChart3 :size="12" class="text-blue-600" />
            <span>Analiz</span>
          </NuxtLink>
          <button type="button" @click="downloadAllSpecs({ id: 'TOPLU', baslik: 'Tum_Guncel_Ihaleler' })" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <FileSpreadsheet :size="12" class="text-emerald-600" />
            <span>Rapor</span>
          </button>
          <NuxtLink to="/firmalar" class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1">
            <Building2 :size="12" class="text-amber-500" />
            <span>Firmalar</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 📊 4. TOTAL COUNT BANNER -->
      <div class="bg-sky-50/60 border border-sky-200 p-2.5 rounded-lg flex items-center justify-between text-slate-700 text-xs font-bold">
        <div class="flex items-center gap-2">
          <FileText :size="14" class="text-[#0084B4]" />
          <span>Toplam:</span>
          <span class="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-sky-300">
            {{ filteredTenders.length }} ihale
          </span>
        </div>
        <span class="text-slate-500 text-[11px]">Türkiye Geneli Canlı Kamu & Özel Sektör B2B İhaleleri</span>
      </div>

      <!-- 📑 5. SORTING BAR & PAGINATION -->
      <div class="bg-white border border-slate-300 p-2 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex flex-wrap items-center gap-3 font-bold text-slate-700">
          <div class="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            <span>Sırala:</span>
            <select v-model="selectedSort" class="bg-transparent font-bold outline-none text-slate-800">
              <option value="otomatik">Otomatik</option>
              <option value="views">Görüntülenme sayısı</option>
              <option value="sozlesme">Sözleşme tarihi / Bütçe</option>
              <option value="sehir">Şehir</option>
            </select>
          </div>

          <button type="button" @click="selectedSort = 'views'" class="hover:text-blue-700 cursor-pointer">⇅ Görüntülenme sayısı</button>
          <button type="button" @click="selectedSort = 'sozlesme'" class="hover:text-blue-700 cursor-pointer">⇅ Sözleşme tarihi</button>
          <button type="button" @click="selectedSort = 'sehir'" class="hover:text-blue-700 cursor-pointer">⇅ Şehir</button>
        </div>

        <!-- Pagination -->
        <div class="flex items-center gap-1 text-xs">
          <button type="button" class="px-2 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 font-bold">|‹ İlk sayfa</button>
          <button type="button" class="px-2 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 font-bold">‹ Önceki sayfa</button>
          <select v-model="currentPage" class="p-1 rounded border border-slate-300 bg-white font-bold">
            <option :value="1">1. Sayfa</option>
            <option :value="2">2. Sayfa</option>
          </select>
          <button type="button" class="px-2 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 font-bold">Sonraki sayfa ›</button>
          <button type="button" class="px-2 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 font-bold">Son sayfa ⏭</button>
        </div>
      </div>

      <!-- 📋 6. TENDER CARDS (EKAP / İHALEBUL FORMATI - GÖRSEL 2 İLE BİREBİR) -->
      <div v-if="filteredTenders.length > 0" class="space-y-3">
        <div 
          v-for="(tender, index) in filteredTenders" 
          :key="tender.id"
          class="bg-white border border-slate-300 hover:border-[#0084B4] rounded-lg p-3.5 sm:p-4 space-y-2.5 shadow-2xs transition-all duration-150"
        >
          <!-- Row 1: Number & Title -->
          <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-sky-100 text-[#0084B4] font-mono font-black text-xs shrink-0">
                # {{ index + 1 }}
              </span>
              <h3 
                @click="openModalWithTab(tender, 'ilan')"
                class="font-black text-sm sm:text-base text-[#0F223D] hover:text-[#0084B4] transition-colors cursor-pointer leading-snug"
              >
                {{ tender.id }}DT50*** - {{ tender.baslik }}
              </h3>
            </div>

            <div class="shrink-0 flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="tender.durum === 'closed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'">
                {{ tender.durum === 'closed' ? 'Tamamlandı' : '🟢 Canlı / Açık' }}
              </span>
            </div>
          </div>

          <!-- Row 2: Yüklenici & Sözleşme Bedeli -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1.5 text-slate-700">
              <Users :size="14" class="text-[#0084B4] shrink-0" />
              <span class="font-bold text-slate-500">Yüklenici adı:</span>
              <span class="font-bold text-slate-800 truncate">{{ tender.ownerCompany || 'Doğrulanmış B2B Kurumsal Firma' }}</span>
            </div>

            <div class="flex items-center sm:justify-end gap-1.5 text-xs">
              <span class="font-bold text-slate-500">Sözleşme bedeli:</span>
              <span class="font-mono font-black text-emerald-700 text-sm">{{ tender.butce || '***' }}</span>
            </div>
          </div>

          <!-- Row 3: İdare Adı & Şehir -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1.5 text-slate-700">
              <Building2 :size="14" class="text-slate-400 shrink-0" />
              <span class="font-bold text-slate-500">İdare adı:</span>
              <span class="font-bold text-slate-800 truncate">{{ tender.authority || 'İhaleciBurada Satın Alma Masası' }}</span>
            </div>

            <div class="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600 font-bold">
              <MapPin :size="13" class="text-slate-400" />
              <span>{{ tender.city || 'Ankara' }}</span>
            </div>
          </div>

          <!-- Row 4: Dates and Badges Strip -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <span>📅 <strong>Yayın tarihi:</strong> {{ tender.yayinTarihi || '28.08.2026' }}</span>
            <span>⏱️ <strong>Teklif tarihi:</strong> <span class="text-rose-700 font-bold font-mono">{{ tender.sure || '30.08.2026' }}</span></span>
            <span>📅 <strong>İş başlangıç:</strong> 01.09.2026</span>
            <span>📅 <strong>İş bitiş:</strong> 30.09.2026</span>
            <span>📝 <strong>Sözleşme tarihi:</strong> 28.08.2026</span>
            <span class="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">🏷️ Ekap</span>
            <span class="px-2 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">🏷️ {{ tender.tur || 'Doğrudan temin' }}</span>
          </div>

          <!-- Row 5: 6 EKAP Sub-tabs / Action Buttons (GÖRSEL 2 FORMATI) -->
          <div class="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-200">
            <div class="flex flex-wrap items-center gap-1.5">
              <button 
                type="button"
                @click="openModalWithTab(tender, 'sozlesme')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <FileText :size="12" />
                <span>Sözleşme listesi (1)</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'malzeme')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <Layers :size="12" />
                <span>Malzeme Listesi (1)</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'ilan')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <FileText :size="12" />
                <span>İhale ilanı</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'sonuc')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <CheckCircle2 :size="12" />
                <span>Sonuç ilanı</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'idari')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <ShieldCheck :size="12" />
                <span>İdari Şartname</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'firmalar')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <Building2 :size="12" />
                <span>Firmalar</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'gecmis')"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <RotateCcw :size="12" />
                <span>Benzer ihale geçmişi</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="tender.durum !== 'closed' && tender.durum !== 'expired'"
                type="button"
                @click="openBidModal(tender)"
                class="px-4 py-1.5 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Send :size="12" />
                <span>Teklif Ver</span>
              </button>
              <button
                v-else
                disabled
                type="button"
                class="px-4 py-1.5 rounded bg-slate-300 text-slate-500 font-bold text-xs cursor-not-allowed"
              >
                Teklife Kapalı
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white border border-slate-300 rounded-lg p-10 text-center space-y-3">
        <AlertCircle :size="36" class="mx-auto text-slate-400" />
        <h3 class="font-black text-slate-800 text-sm">Aramanıza Uygun İhale Bulunamadı</h3>
        <p class="text-slate-500 text-xs">Filtreleri sıfırlayarak tüm aktif ihaleleri görüntüleyebilirsiniz.</p>
        <button type="button" @click="resetFilters" class="px-4 py-2 rounded bg-[#0084B4] text-white font-bold text-xs cursor-pointer">
          Tüm İhaleleri Göster
        </button>
      </div>

    </div>

    <!-- TENDER DETAIL MODAL (EKAP STYLE FULL MULTI-TAB) -->
    <div v-if="selectedTenderForDetail" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <!-- Header Top Row -->
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-mono font-black uppercase">
                #{{ selectedTenderForDetail.id }}
              </span>
              <span class="text-xs font-black text-blue-600 uppercase tracking-wider">
                {{ selectedTenderForDetail.kategori }}
              </span>
              <span class="text-[10px] text-slate-400 font-medium">
                · {{ selectedTenderForDetail.city || 'Türkiye Geneli' }}
              </span>
            </div>
            <h2 class="text-lg sm:text-2xl font-black text-slate-900 mt-1">
              {{ selectedTenderForDetail.baslik }}
            </h2>
          </div>
          <button @click="selectedTenderForDetail = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
            <X :size="22" />
          </button>
        </div>

        <!-- EKAP Meta Info Strip (Görseldeki Format) -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">👥 Yüklenici / Alıcı</span>
            <span class="font-bold text-slate-800">{{ selectedTenderForDetail.ownerCompany || selectedTenderForDetail.company || 'Doğrulanmış B2B Kurum' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">🏢 İdare / Satın Alma</span>
            <span class="font-bold text-slate-800">{{ selectedTenderForDetail.authority || 'İhaleciBurada Satın Alma Masası' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">💰 İhale / Hedef Bedel</span>
            <span class="font-mono font-black text-emerald-600 text-sm">{{ selectedTenderForDetail.butce || 'Açık Teklif' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">📍 Konum</span>
            <span class="font-bold text-slate-800">{{ selectedTenderForDetail.city || 'Ankara' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">📅 Yayın Tarihi</span>
            <span class="font-mono text-slate-700">{{ selectedTenderForDetail.yayinTarihi || '28.08.2026' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">⏱️ Teklif Bitiş</span>
            <span class="font-mono font-bold text-red-600">{{ selectedTenderForDetail.sure || '30.08.2026' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">📅 İş Başlangıç / Bitiş</span>
            <span class="font-mono text-slate-700">01.09.2026 / 30.09.2026</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">🏷️ İhale Usulü</span>
            <span class="font-bold text-blue-700">{{ selectedTenderForDetail.tur || 'Açık Eksiltme' }}</span>
          </div>
        </div>

        <!-- 6 Interactive EKAP Sub-tabs (Görseldeki 6 Buton) -->
        <div class="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 text-xs font-black">
          <button
            type="button"
            @click="detailActiveTab = 'ilan'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'ilan' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <FileText :size="13" />
            <span>📄 İhale İlanı</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'malzeme'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'malzeme' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <Layers :size="13" />
            <span>📦 Malzeme Listesi (1)</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'idari'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'idari' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <ShieldCheck :size="13" />
            <span>📜 İdari Şartname</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'sozlesme'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'sozlesme' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <FileText :size="13" />
            <span>🤝 Sözleşme Listesi (1)</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'firmalar'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'firmalar' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <Building2 :size="13" />
            <span>🏢 Firmalar</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'sonuc'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'sonuc' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <CheckCircle2 :size="13" />
            <span>🏆 Sonuç İlanı</span>
          </button>
          <button
            type="button"
            @click="detailActiveTab = 'gecmis'"
            class="px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            :class="detailActiveTab === 'gecmis' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <RotateCcw :size="13" />
            <span>⏱️ Benzer İhale Geçmişi</span>
          </button>
        </div>

        <!-- Tab 1: İhale İlanı -->
        <div v-if="detailActiveTab === 'ilan'" class="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 class="font-black text-slate-900 text-sm">İhale Konusu & Açıklama Metni</h4>
            <p>{{ selectedTenderForDetail.aciklama || 'Bu ihale için belirtilen standart teknik şartname kuralları ve B2B satın alma şartları geçerlidir.' }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-blue-950 space-y-2">
            <h5 class="font-black text-xs">Teklif Verme & İşlem Güvenliği</h5>
            <p class="text-[11px] text-blue-900">Verilen teklifler ihale bitiş süresine kadar şifreli olarak saklanır. İhale süresi bittiğinde veya alıcı firma onay verdiğinde mutabakat sağlanır ve taraflar arasında güvenli havuz (Escrow) üzerinden resmi faturalandırma başlatılır.</p>
          </div>
        </div>

        <!-- Tab 2: Malzeme Listesi -->
        <div v-if="detailActiveTab === 'malzeme'" class="space-y-4 text-xs">
          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-black">
                <tr>
                  <th class="p-3">Sıra</th>
                  <th class="p-3">Malzeme / İş Kalemi</th>
                  <th class="p-3">Metraj / Miktar</th>
                  <th class="p-3">Birim</th>
                  <th class="p-3">Birim Bütçe</th>
                  <th class="p-3">Teknik Standart</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="p-3 font-mono font-bold">01</td>
                  <td class="p-3 font-bold text-slate-900">{{ selectedTenderForDetail.baslik }}</td>
                  <td class="p-3 font-mono">1</td>
                  <td class="p-3">Paket / Parti</td>
                  <td class="p-3 font-mono font-black text-emerald-600">{{ selectedTenderForDetail.butce }}</td>
                  <td class="p-3 text-slate-500">TSE / ISO 9001</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: İdari Şartname -->
        <div v-if="detailActiveTab === 'idari'" class="space-y-3 text-xs text-slate-700">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-800">Teslimat Lokasyonu:</span>
              <span class="font-black text-slate-900">{{ selectedTenderForDetail.city || 'Türkiye Geneli' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-800">Ödeme Şartı:</span>
              <span class="font-black text-emerald-600">TCMB/BDDK Uyumlu Güvenli Havuz (Escrow)</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-800">Mal Muayene & Kabul:</span>
              <span class="font-black text-slate-900">İrsaliye ve Fiziki Sayım Tutanağı ile 3 İş Günü</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800">Gecikme Cezası:</span>
              <span class="font-black text-slate-900">Günlük %0.1 (Binde Bir)</span>
            </div>
          </div>
        </div>

        <!-- Tab 4: Sözleşme Listesi -->
        <div v-if="detailActiveTab === 'sozlesme'" class="space-y-3 text-xs text-slate-700">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 class="font-black text-slate-900">Tip B2B Mal / Hizmet Satın Alma Sözleşmesi</h4>
            <p class="text-slate-600">İhale onaylandığı anda alıcı ve satıcı arasında 6098 sayılı Türk Borçlar Kanunu ve 6102 sayılı TTK hükümleri uyarınca dijital olarak akdedilir.</p>
          </div>
        </div>

        <!-- Tab 5: Firmalar (Doğrulanmış B2B Üye & Tedarikçi Firmalar) -->
        <div v-if="detailActiveTab === 'firmalar'" class="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-500 uppercase text-[10px]">İhaleyi Açan Kurumsal Alıcı</span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">✓ Onaylı Alıcı Firma</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
                <Building2 :size="20" />
              </div>
              <div>
                <h5 class="font-black text-slate-900 text-sm">{{ selectedTenderForDetail.ownerCompany || selectedTenderForDetail.company || 'Doğrulanmış B2B Satın Alma Şirketi' }}</h5>
                <span class="text-slate-500 text-[11px]">📍 {{ selectedTenderForDetail.city || 'Türkiye Geneli' }} · GİB Vergi & MERSİS Kaydı Doğrulanmış</span>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div class="flex items-center justify-between">
              <h5 class="font-black text-blue-950 text-xs">Bu Sektördeki Onaylı Tedarikçi Firmalar</h5>
              <NuxtLink to="/firmalar" class="text-blue-700 hover:text-blue-900 font-bold text-[11px] underline">
                Tüm B2B Firma Rehberini Aç →
              </NuxtLink>
            </div>
            <p class="text-[11px] text-blue-900">Bu ihaleye teklif verebilecek {{ selectedTenderForDetail.kategori }} sektöründe kayıtlı doğrulanmış üretici ve toptancı firmalar sistem tarafından bildirimle davet edilir.</p>
          </div>
        </div>

        <!-- Tab 6: Sonuç İlanı -->
        <div v-if="detailActiveTab === 'sonuc'" class="space-y-3 text-xs text-slate-700">
          <div class="p-4 rounded-2xl border" :class="selectedTenderForDetail.durum === 'closed' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'">
            <div class="font-black text-sm">
              {{ selectedTenderForDetail.durum === 'closed' ? '🔒 İhale Sonuçlandı (Mutabakat Sağlandı)' : '🟢 İhale Canlı Yayında & Tekliflere Açık' }}
            </div>
            <p class="mt-1 text-xs">
              Toplam {{ selectedTenderForDetail.teklifSayisi || 0 }} adet teklif iletilmiştir.
            </p>
          </div>
        </div>

        <!-- Tab 6: Benzer İhale Geçmişi -->
        <div v-if="detailActiveTab === 'gecmis'" class="space-y-3 text-xs text-slate-700">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 class="font-black text-slate-900">Sektörel Piyasa & Emsal İhale Karşılaştırması</h4>
            <p class="text-slate-600">{{ selectedTenderForDetail.kategori }} sektöründe son 30 günde tamamlanan ihalelerde ortalama %14.2 tedarik tasarrufu sağlanmıştır.</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="downloadAllSpecs(selectedTenderForDetail)"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Download :size="14" />
            <span>Şartname Dosyasını İndir (.TXT)</span>
          </button>

          <div class="flex items-center gap-2">
            <button 
              @click="selectedTenderForDetail = null" 
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Kapat
            </button>
            <button
              v-if="selectedTenderForDetail.durum !== 'closed' && selectedTenderForDetail.durum !== 'expired'"
              @click="openBidModal(selectedTenderForDetail); selectedTenderForDetail = null"
              class="px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send :size="13" />
              <span>Teklif Ver</span>
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
    </div>

    <!-- SUBMIT BID MODAL -->
    <div v-if="showBidModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div>
            <span class="text-xs font-black text-blue-600 uppercase tracking-wider block">KAPALI ZARF TEKLİF VERME</span>
            <h3 class="text-lg font-black text-slate-900 mt-1">{{ selectedTenderForBid?.baslik }}</h3>
          </div>
          <button @click="showBidModal = false" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
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
              class="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-black font-mono text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TESLİMAT SÜRESİ</label>
              <input 
                v-model="bidForm.sure"
                type="text"
                placeholder="Örn: 10 gün"
                class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">FİRMA ADINIZ</label>
              <input 
                v-model="bidForm.firmaAdi"
                type="text"
                class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TEKLİF NOTU & AVANTAJLAR</label>
            <textarea
              v-model="bidForm.notum"
              rows="3"
              placeholder="Teknik şartnameye uygunluk, garanti koşulları, ücretsiz nakliye vb. notlarınızı yazınız..."
              class="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck :size="16" class="text-blue-600 shrink-0 mt-0.5" />
            <span>Teklifiniz şifrelenerek alıcıya iletilir. İhale süresi bitene kadar diğer tedarikçiler fiyatınızı göremez.</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            @click="showBidModal = false" 
            class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            İptal
          </button>
          <button
            @click="submitBid"
            class="px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Send :size="13" />
            Teklifi Gönder & NetGSM SMS İlet
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
