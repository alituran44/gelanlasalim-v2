<script setup lang="ts">
import { ref, computed } from 'vue'
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
  FileCheck2,
  FileSpreadsheet,
  X
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({
  layout: "public"
})

const { cmsData, saveCmsData } = useCmsData()
const { sendSms } = useNetGsm()

const searchQuery = ref('')
const selectedCategory = ref<string>('Tümü')
const selectedMethod = ref<string>('Tümü')
const selectedCity = ref<string>('Tümü')
const selectedSort = ref<'newest' | 'budget-desc' | 'budget-asc' | 'ending-soon'>('newest')

const selectedTenderForDetail = ref<any>(null)
const showSpecModal = ref(false)
const selectedSpecTender = ref<any>(null)
const specActiveTab = ref<'malzeme' | 'idari' | 'teknik'>('malzeme')

const showBidModal = ref(false)
const selectedTenderForBid = ref<any>(null)

const userSession = ref<any>({})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (userSession.value.companyName || userSession.value.company) {
        bidForm.value.firmaAdi = userSession.value.companyName || userSession.value.company
      }
    } catch (e) {}
  }
})

const bidForm = ref({
  fiyat: '',
  sure: '7 gün',
  notum: '',
  firmaAdi: 'Ali Turan Sanayi ve Ticaret A.Ş.'
})

const allTenders = computed(() => {
  return cmsData.value?.dashboard?.tenders || []
})

const categories = [
  'Tümü',
  'İnşaat ve Yapı',
  'Sanayi ve Makine',
  'Lojistik ve Taşımacılık',
  'Ambalaj ve Kağıt',
  'Bilgisayar ve Teknoloji',
  'Gıda ve Hizmet',
  'Enerji ve Altyapı'
]

const methods = [
  'Tümü',
  'Açık İhale',
  'Kapalı Zarf',
  'Doğrudan Temin'
]

const cities = [
  'Tümü',
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Kocaeli',
  'Gaziantep',
  'Adana'
]

const filteredTenders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = allTenders.value.filter(t => {
    // Category filter
    if (selectedCategory.value !== 'Tümü' && !t.kategori?.toLowerCase().includes(selectedCategory.value.toLowerCase())) {
      return false
    }

    // Method filter
    if (selectedMethod.value !== 'Tümü' && !t.tur?.toLowerCase().includes(selectedMethod.value.toLowerCase()) && !t.type?.toLowerCase().includes(selectedMethod.value.toLowerCase())) {
      return false
    }

    // City filter
    if (selectedCity.value !== 'Tümü' && !t.city?.toLowerCase().includes(selectedCity.value.toLowerCase())) {
      return false
    }

    // Search query
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

  // Sorting
  if (selectedSort.value === 'budget-desc') {
    list.sort((a, b) => (parseInt(b.butce?.replace(/\D/g, '') || '0') - parseInt(a.butce?.replace(/\D/g, '') || '0')))
  } else if (selectedSort.value === 'budget-asc') {
    list.sort((a, b) => (parseInt(a.butce?.replace(/\D/g, '') || '0') - parseInt(b.butce?.replace(/\D/g, '') || '0')))
  }

  return list
})

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

const detailActiveTab = ref<'ilan' | 'malzeme' | 'idari' | 'sozlesme' | 'firmalar' | 'sonuc' | 'gecmis'>('ilan')
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 text-left">
    <div class="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      <!-- Top Header & Terminal Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#070F1E] p-5 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div class="absolute right-0 top-0 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#00C2FF] text-xs font-black">
            <span class="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse"></span>
            B2B TİCARET & CANLI İHALE TERMİNALİ
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">İhale Pazarı & Pazar Yeri</h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Türkiye genelinde doğrulanmış şirketlerin açtığı satın alma ihalelerini inceleyin, şartnameleri indirin ve güvenli havuz (Escrow) korumasıyla anında teklif verin.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <NuxtLink
            to="/firmalar"
            class="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Building2 :size="15" class="text-amber-400" />
            <span>🏢 Firmalar</span>
          </NuxtLink>
          <NuxtLink
            to="/panel/ihale-olustur"
            class="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus :size="16" class="text-[#00C2FF]" />
            <span>Yeni İhale Başlat</span>
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <span>Kurumsal Üyelik</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Trading Terminal Command Filter Bar -->
      <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <!-- Main Search & Sort Row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-8 relative">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="İhale adı, malzeme (beton, demir, koli, fason), şehir veya ihale no ile ara..."
              class="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/70"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <select
              v-model="selectedSort"
              class="w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="newest">Sıralama: En Yeni İlanlar</option>
              <option value="budget-desc">Bütçe: Yüksekten Düşüğe</option>
              <option value="budget-asc">Bütçe: Düşükten Yükseğe</option>
            </select>
          </div>
        </div>

        <!-- Filter Dropdowns Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Sektör & Kategori</label>
            <select
              v-model="selectedCategory"
              class="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">İhale Usulü</label>
            <select
              v-model="selectedMethod"
              class="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Teslimat / Şehir</label>
            <select
              v-model="selectedCity"
              class="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option v-for="ci in cities" :key="ci" :value="ci">{{ ci }}</option>
            </select>
          </div>
        </div>

        <!-- Results Counter & Reset Strip -->
        <div class="flex items-center justify-between pt-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-[11px]">
              {{ filteredTenders.length }} Aktif Sonuç
            </span>
            <span v-if="selectedCategory !== 'Tümü' || selectedMethod !== 'Tümü' || selectedCity !== 'Tümü' || searchQuery" class="text-slate-400 text-[11px]">
              (Filtrelenmiş sonuçlar)
            </span>
          </div>

          <button
            v-if="selectedCategory !== 'Tümü' || selectedMethod !== 'Tümü' || selectedCity !== 'Tümü' || searchQuery"
            @click="selectedCategory = 'Tümü'; selectedMethod = 'Tümü'; selectedCity = 'Tümü'; searchQuery = ''"
            class="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Filtreleri Sıfırla ✕
          </button>
        </div>
      </div>

      <!-- Tenders Grid (Terminal-Grade Card Layout) -->
      <div v-if="filteredTenders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tender in filteredTenders"
          :key="tender.id"
          class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Image Box with Badges -->
          <div 
            @click="selectedTenderForDetail = tender"
            class="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer"
            title="İhale detaylarını görüntüle"
          >
            <img 
              :src="tender.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'" 
              :alt="tender.baslik"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-black uppercase tracking-wider border border-white/20">
                #{{ tender.id }}
              </span>
            </div>

            <div class="absolute top-3 right-3">
              <span 
                class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 text-white"
                :class="tender.durum === 'closed' ? 'bg-amber-600' : (tender.durum === 'expired' ? 'bg-slate-600' : 'bg-emerald-600')"
              >
                <span v-if="tender.durum === 'closed'">🔒 Mutabakat Sağlandı</span>
                <span v-else-if="tender.durum === 'expired'">⌛ Süresi Doldu</span>
                <span v-else>{{ tender.sure || 'Aktif İhale' }}</span>
              </span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <div class="flex items-center gap-1 font-bold">
                <MapPin :size="13" class="text-[#00C2FF]" />
                <span>{{ tender.city || 'Türkiye Geneli' }}</span>
              </div>
              <div class="flex items-center gap-1 font-bold">
                <Tag :size="13" class="text-amber-400" />
                <span>{{ tender.teklifSayisi || 0 }} Teklif</span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  {{ tender.kategori }}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {{ tender.tur || 'Açık İhale' }}
                </span>
              </div>

              <h2 
                @click="selectedTenderForDetail = tender"
                class="text-base font-black text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                title="İhale detaylarını görüntüle"
              >
                {{ tender.baslik }}
              </h2>

              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ tender.aciklama || 'Şartnameye uygun teklifler kabul edilmektedir.' }}
              </p>
            </div>

            <!-- Price, Spec Preview & Actions Footer -->
            <div class="pt-4 border-t border-slate-100 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase block">Tahmini Hacim:</span>
                  <span class="text-sm font-black font-mono text-slate-900">{{ tender.butce || 'Açık İhale' }}</span>
                </div>
                
                <button
                  type="button"
                  @click="openSpecModal(tender)"
                  class="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer"
                >
                  <FileText :size="13" />
                  <span>Şartname İncele</span>
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
                  :class="tender.durum === 'closed' ? 'bg-amber-700/80 cursor-not-allowed' : (tender.durum === 'expired' ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0F223D] hover:bg-blue-600')"
                >
                  <Send :size="12" />
                  <span>{{ tender.durum === 'closed' ? '🔒 Anlaşıldı' : (tender.durum === 'expired' ? '⌛ Süresi Doldu' : 'Teklif Ver') }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Clean Empty State -->
      <div v-else class="bg-white rounded-3xl border border-slate-200 p-12 sm:p-16 text-center space-y-4 shadow-xs">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-[#0F223D] flex items-center justify-center mx-auto border border-blue-100">
          <FileText :size="28" />
        </div>
        <div class="space-y-1.5 max-w-md mx-auto">
          <h3 class="text-base font-black text-slate-800">
            {{ allTenders.length === 0 ? 'Henüz Yayında İhale Bulunmuyor' : 'Aramanıza Uygun İhale Bulunamadı' }}
          </h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            {{ allTenders.length === 0 ? 'Platformda açılan onaylı yeni B2B satın alma ihaleleri ve canlı tersine eksiltmeler burada listelenecektir.' : `"${searchQuery}" kriterine veya seçili filtrelere ait ihale bulunamadı.` }}
          </p>
        </div>
        <div class="pt-2 flex flex-wrap items-center justify-center gap-2">
          <NuxtLink
            to="/panel/ihale-olustur"
            class="px-5 py-2.5 rounded-xl bg-[#0F223D] hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus :size="14" />
            <span>Yeni İhale Başlat</span>
          </NuxtLink>
          <button
            v-if="allTenders.length > 0 && (searchQuery || selectedCategory !== 'Tümü')"
            @click="searchQuery = ''; selectedCategory = 'Tümü'; selectedMethod = 'Tümü'; selectedCity = 'Tümü'"
            class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>

    </div>

    <!-- 🟢 INTERACTIVE ŞARTNAME & MALZEME LİSTESİ ÖNİZLEME MODALI -->
    <div v-if="showSpecModal && selectedSpecTender" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-left">
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div>
            <span class="text-xs font-black text-blue-600 uppercase tracking-wider block">{{ selectedSpecTender.kategori }}</span>
            <h2 class="text-xl font-black text-slate-900 mt-1">{{ selectedSpecTender.baslik }}</h2>
            <span class="text-xs text-slate-400 font-mono">İhale Dosyası: #{{ selectedSpecTender.id }}</span>
          </div>
          <button @click="showSpecModal = false" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
            <X :size="20" />
          </button>
        </div>

        <!-- Spec Modal Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-black">
          <button
            type="button"
            @click="specActiveTab = 'malzeme'"
            class="px-4 py-2 rounded-xl transition cursor-pointer"
            :class="specActiveTab === 'malzeme' ? 'bg-[#0F223D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            1. Malzeme Listesi & Metraj
          </button>
          <button
            type="button"
            @click="specActiveTab = 'idari'"
            class="px-4 py-2 rounded-xl transition cursor-pointer"
            :class="specActiveTab === 'idari' ? 'bg-[#0F223D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            2. İdari Şartname & Teslimat
          </button>
          <button
            type="button"
            @click="specActiveTab = 'teknik'"
            class="px-4 py-2 rounded-xl transition cursor-pointer"
            :class="specActiveTab === 'teknik' ? 'bg-[#0F223D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            3. Teknik Standartlar & ISO
          </button>
        </div>

        <!-- Tab 1: Malzeme Listesi -->
        <div v-if="specActiveTab === 'malzeme'" class="space-y-4 text-xs">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="font-bold text-slate-800">Kalem Açıklaması & Talep Detayı:</div>
            <p class="text-slate-600 leading-relaxed">{{ selectedSpecTender.aciklama || 'Şartnamede yer alan standart malzeme ve üretim parametreleri geçerlidir.' }}</p>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-black">
                <tr>
                  <th class="p-3">Sıra</th>
                  <th class="p-3">Malzeme / İş Kalemi</th>
                  <th class="p-3">Metraj / Miktar</th>
                  <th class="p-3">Birim</th>
                  <th class="p-3">Birim Bütçe</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="p-3 font-mono">01</td>
                  <td class="p-3 font-bold text-slate-800">{{ selectedSpecTender.baslik }}</td>
                  <td class="p-3 font-mono">1</td>
                  <td class="p-3">Paket / Proje</td>
                  <td class="p-3 font-mono text-emerald-600 font-black">{{ selectedSpecTender.butce }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: İdari Şartname -->
        <div v-if="specActiveTab === 'idari'" class="space-y-3 text-xs text-slate-600">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-800">Teslimat Lokasyonu:</span>
              <span class="font-black text-slate-900">{{ selectedSpecTender.city || 'Belirtilmedi' }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-800">Ödeme Modeli:</span>
              <span class="font-black text-emerald-600">TCMB/BDDK Uyumlu Güvenli Havuz (Escrow)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800">Mal Kabul Kriteri:</span>
              <span class="font-black text-slate-900">İrsaliye & Fiziksel Kalite Kontrol Tutanağı</span>
            </div>
          </div>
        </div>

        <!-- Tab 3: Teknik Standartlar -->
        <div v-if="specActiveTab === 'teknik'" class="space-y-3 text-xs text-slate-600">
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-blue-900">
            <div class="font-black flex items-center gap-1.5">
              <ShieldCheck :size="16" class="text-blue-600" />
              <span>Zorunlu Kalite Belgeleri:</span>
            </div>
            <ul class="list-disc list-inside space-y-1 text-[11px] text-blue-800">
              <li>TSE / CE / ISO 9001 Uygunluk Belgesi</li>
              <li>Akredite Laboratuvar Test Raporları</li>
              <li>İmalatçı Yeterlilik & Vergi Levhası Doğrulaması</li>
            </ul>
          </div>
        </div>

        <!-- Spec Modal Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="downloadAllSpecs(selectedSpecTender)"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Download :size="14" />
            <span>Şartname Dosyasını İndir (.TXT)</span>
          </button>

          <div class="flex items-center gap-2">
            <button 
              @click="showSpecModal = false" 
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Kapat
            </button>
            <button
              v-if="selectedSpecTender.durum !== 'closed' && selectedSpecTender.durum !== 'expired'"
              @click="openBidModal(selectedSpecTender); showSpecModal = false"
              class="px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send :size="13" />
              <span>Teklif Ver</span>
            </button>
          </div>
        </div>
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
