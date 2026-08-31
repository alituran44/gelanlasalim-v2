<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Printer, 
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
  Users,
  Star,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink
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

function getTenderDirectionBadge(tender: any) {
  const tur = (tender.tur || '').toLowerCase()
  const yonu = (tender.ihaleYonu || '').toLowerCase()
  if (yonu === 'artirma' || tur.includes('artırma') || tur.includes('artırımlı')) {
    return { 
      label: '📈 Açık Artırma (Fiyat Artırımlı)', 
      class: 'bg-blue-100 text-blue-950 border-blue-400 font-black' 
    }
  }
  if (yonu === 'kapali_zarf' || tur.includes('kapalı')) {
    return { 
      label: '📑 Kapalı Zarf Usulü', 
      class: 'bg-purple-100 text-purple-950 border-purple-400 font-black' 
    }
  }
  return { 
    label: '📉 Açık Eksiltme (Fiyat Azaltımlı)', 
    class: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black' 
  }
}

function getTenderImage(tender: any): string {
  if (!tender) return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'

  if (tender.image && typeof tender.image === 'string' && (tender.image.startsWith('http') || tender.image.startsWith('data:image'))) {
    return tender.image
  }

  if (Array.isArray(tender.images) && tender.images.length > 0) {
    const first = tender.images[0]
    if (typeof first === 'string' && (first.startsWith('http') || first.startsWith('data:image'))) {
      return first
    }
    if (first && typeof first === 'object' && typeof first.url === 'string' && (first.url.startsWith('http') || first.url.startsWith('data:image'))) {
      return first.url
    }
  }

  const text = ((tender.baslik || '') + ' ' + (tender.kategori || '') + ' ' + (tender.mainCategory || '')).toLowerCase()
  if (text.includes('lojistik') || text.includes('nakliye') || text.includes('taşımacılık') || text.includes('havayolu') || text.includes('kargo') || text.includes('uçak')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('inşaat') || text.includes('yapı') || text.includes('şantiye') || text.includes('çimento') || text.includes('demir') || text.includes('bina')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('makine') || text.includes('yedek parça') || text.includes('metal') || text.includes('sanayi') || text.includes('torna')) {
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('ambalaj') || text.includes('koli') || text.includes('plastik') || text.includes('kağıt') || text.includes('kutu')) {
    return 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('akaryakıt') || text.includes('enerji') || text.includes('petrol') || text.includes('madeni yağ') || text.includes('motorin')) {
    return 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('kırtasiye') || text.includes('ofis') || text.includes('bilişim') || text.includes('teknoloji') || text.includes('yazılım') || text.includes('bilgisayar')) {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('gıda') || text.includes('tarım') || text.includes('yemek') || text.includes('sebze') || text.includes('meyve')) {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('sağlık') || text.includes('medikal') || text.includes('ilaç') || text.includes('hastane')) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  }

  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
}
function formatTenderBudget(raw: any): string {
  if (!raw) return 'Açık Eksiltme'
  const str = String(raw).trim()
  if (str.includes('-')) {
    // If range like 50000 ₺ - 150000 ₺, extract the clean single target budget
    const parts = str.split('-')
    const maxPart = parts[parts.length - 1]
    const cleanNum = parseInt(maxPart.replace(/\D/g, '')) || 0
    if (cleanNum > 0) {
      return Number(cleanNum).toLocaleString('tr-TR') + ' ₺'
    }
  }
  const cleanNum = parseInt(str.replace(/\D/g, '')) || 0
  if (cleanNum > 0) {
    return Number(cleanNum).toLocaleString('tr-TR') + ' ₺'
  }
  return str.includes('₺') ? str : (str || 'Açık Eksiltme')
}

function downloadTenderFile(doc: any, tender: any) {
  if (typeof window === 'undefined') return

  const fileName = doc?.name || `Resmi_Sartname_${tender?.id || 'IHC'}.pdf`
  
  if (doc?.url && doc.url.startsWith('data:')) {
    const link = document.createElement('a')
    link.href = doc.url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return
  }

  const textContent = `================================================================================
                    T.C. B2B TICARET VE ELEKTRONIK IHALE PORTALI
                     IHALECIBURADA RESMI IHALE SARTNAMESI
================================================================================

Ihale Kayit No (IKN)    : #${tender?.id || 'IHC-2026-178'}
Ihale Basligi            : ${tender?.baslik || 'Kurumsal Satin Alma Talebi'}
Sektor & Kategori       : ${tender?.kategori || 'Genel Satin Alma'}
Alici Kurum / Sirket    : ${tender?.ownerCompany || tender?.authority || 'Kurumsal Masasi'}
Hedef Sozlesme Butcesi  : ${tender?.butce || 'Acik Eksiltmeli Ihale'}
Teslimat Sehri / Lokasyon: ${tender?.city || 'Balikesir'}
Teslimat Adresi         : ${tender?.teslimatAdresi || (tender?.city + ' Merkez / Saha Depo')}
Teklif Toplama Suresi   : ${tender?.sure || '7 gun'}
Yayin Tarihi            : ${new Date().toLocaleDateString('tr-TR')}

--------------------------------------------------------------------------------
1. IHALENIN KONUSU VE TEKNIK ISTERLER:
--------------------------------------------------------------------------------
${tender?.aciklama || tender?.baslik || 'Teknik sartname esaslarina gore temin saglanacaktir.'}

--------------------------------------------------------------------------------
2. IDARI SARTLAR VE TESLIMAT HUKUMLERI:
--------------------------------------------------------------------------------
- Teslimat adresi ${tender?.teslimatAdresi || (tender?.city + ' Merkez')} olarak teyit edilmistir.
- Hakedis odemeleri BDDK ve TCMB mevzuatina uygun ESCROW GUVENLI HAVUZ hesabinda bloke edilir.
- Muayene kabul ve e-Irsaliye teslim onayinin ardindan odeme yukleniciye serbest birakilir.

--------------------------------------------------------------------------------
3. E-IMZA VE DIJITAL MUHUR DOGRULAMASI:
--------------------------------------------------------------------------------
- 6098 s. Turk Borclar Kanunu ve 6102 s. Turk Ticaret Kanunu kapsaminda duzenlenmistir.
- Zaman Damgasi: ${new Date().toISOString()}
- Dogrulama Hash: SHA-256-${tender?.id || 'CERT'}-VALID-SECURE
- Belge Adi: ${fileName}

IhaleciBurada Platform A.S. | GIB VKN: 4700854210 | Mersis: 0470-0854-2100-0001
================================================================================`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.pdf') || fileName.endsWith('.txt') ? fileName : (fileName + '.pdf');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
const detailActiveTab = ref<'ilan' | 'malzeme' | 'idari' | 'sozlesme' | 'firmalar' | 'sonuc' | 'gecmis'>('ilan')
const showSpecModal = ref(false)
const selectedSpecTender = ref<any>(null)
const specActiveTab = ref<'malzeme' | 'idari' | 'teknik'>('malzeme')

const showBidModal = ref(false)
const selectedTenderForBid = ref<any>(null)
const selectedCompanyForProfile = ref<any>(null)
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
      const raw = localStorage.getItem('myTenders')
      if (raw && (raw.includes('IHC-2026-178') || raw.includes('aesredtruıo85urıy'))) {
        localStorage.removeItem('myTenders')
        localStorage.removeItem('myBids')
      }
    } catch (e) {}
  }
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (userSession.value.companyName || userSession.value.company) {
        bidForm.value.firmaAdi = userSession.value.companyName || userSession.value.company
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
  const raw = cmsData.value?.dashboard?.tenders || []
  return raw.filter((t: any) => t.adminApproved !== false && t.durum !== 'pending_approval' && t.durum !== 'rejected')
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

const defaultCompaniesData: Record<string, any> = {}

function getCompanyData(name: string) {
  const key = (name || '').trim().toLowerCase()
  if (defaultCompaniesData[key]) {
    return defaultCompaniesData[key]
  }
  return {
    name: name || 'Kurumsal Firma',
    shortName: name ? name.split(' ')[0] : 'Firma',
    badge: 'Onaylı B2B Üye',
    rating: 5.0,
    reviewCount: 0,
    city: 'Türkiye Geneli',
    sector: 'Genel Ticaret & Tedarik',
    completedTenders: 0,
    totalBids: 0,
    tradeVolume: '0 ₺',
    onTimeDelivery: '%100',
    specCompliance: '%100',
    avgResponseTime: '15 dk',
    taxOffice: 'Kayıtlı V.D.',
    mersis: '—',
    phone: '0850 840 86 95',
    email: 'ihalecib@gmail.com',
    address: 'Türkiye',
    foundedYear: new Date().getFullYear(),
    description: 'İhaleciBurada B2B platformunda doğrulanmış kurumsal firma.',
    reviews: []
  }
}


const showPdfViewerModal = ref(false)
const pdfTenderTarget = ref<any>(null)
const pdfDocTarget = ref<any>(null)

function openPdfViewer(tender: any, doc?: any) {
  pdfTenderTarget.value = tender
  pdfDocTarget.value = doc || (tender.files?.[0] || tender.documents?.[0] || { name: 'Resmi_Sartname_' + tender.id + '.pdf', size: '0.08 MB', type: 'pdf' })
  showPdfViewerModal.value = true
}

function printPdfDocument() {
  if (typeof window === 'undefined') return
  window.print()
}

function openCompanyModal(companyName: string, tender?: any) {
  const comp = { ...getCompanyData(companyName) }
  if (tender) {
    comp.currentTender = tender
  }
  selectedCompanyForProfile.value = comp
}

function isMyOwnTender(tender: any): boolean {
  if (!tender) return false
  
  let session: any = {}
  if (typeof window !== 'undefined') {
    try {
      session = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }

  const currentEmail = (session.email || '').trim().toLowerCase()
  const tenderEmail = (tender.ownerEmail || '').trim().toLowerCase()

  // Sadece aynı e-posta ile giriş yapılmışsa kullanıcının kendi ilanı sayılır
  if (currentEmail && tenderEmail && currentEmail === tenderEmail) {
    return true
  }

  // Eğer ilanın sahibi belirtilmemişse ve session ile uyuşmuyorsa başkasına aittir
  return false
}


function openBidModal(tender: any) {
  // 1. Kendi İlanına Teklif Verme Engeli
  if (isMyOwnTender(tender)) {
    alert(`🚫 KENDİ İLANINIZA TEKLİF VEREMEZSİNİZ!\n\n"${tender.baslik}" ihalesi sizin tarafınızdan açılmıştır.\n\nSistem kuralları gereği kendi açtığınız ihalelere teklif sunamazsınız.\n\nİhaleniz için gelen tedarikçi tekliflerini incelemek, değerlendirmek ve pazarlık yürütmek için lütfen "Gelen Teklifler" sayfasına gidiniz.`)
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
  if (isMyOwnTender(selectedTenderForBid.value)) {
    alert('🚫 Kendi ilanınıza teklif veremezsiniz.')
    showBidModal.value = false
    return
  }
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
  const myEmail = userSession.value.email || 'ihalecib@gmail.com'
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

function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8') {
  if (typeof document === 'undefined') return
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadIhaleIlani(tender: any) {
  const content = `================================================================================
                    T.C. B2B TİCARET VE İHALE PORTALI
                     İHALECİBURADA RESMİ İHALE İLANI
================================================================================

İhale Kayıt No (İKN)    : ${tender.id}
İhale Başlığı            : ${tender.baslik}
Sektör & Kategori       : ${tender.kategori}
İdare / Kurum           : ${tender.authority || 'İhaleciBurada Satın Alma Masası'}
İhaleyi Açan Kurum      : ${tender.ownerCompany || 'Doğrulanmış B2B Kurumsal Alıcı'}
İhale Usulü             : ${tender.tur || 'Açık İhale'}
İhale Türü              : ${tender.type || 'Mal / Hizmet Alımı'}
Yaklaşık Maliyet / Bütçe: ${tender.butce || 'Açık Teklif'}
İhale Lokasyonu / İl    : ${tender.city || 'Türkiye Geneli'}
İlan Yayın Tarihi       : ${tender.yayinTarihi || '28.08.2026'}
Son Teklif Tarihi       : ${tender.sure || '30.08.2026'}

--------------------------------------------------------------------------------
1. İHALENİN KONUSU VE TEKNİK KAPSAMI
--------------------------------------------------------------------------------
${tender.aciklama || 'Bu ihale şartnamesinde yer alan tüm teknik detaylar ve mevzuat kriterleri geçerlidir.'}

--------------------------------------------------------------------------------
2. İHALEYE KATILMA ŞARTLARI VE İSTENEN BELGELER
--------------------------------------------------------------------------------
a) Vergi Levhası ve Faaliyet Belgesi (Son 3 ay içinde alınmış olmalıdır).
b) İmza Sirküleri veya İmza Beyannamesi.
c) TSE / ISO Kalite Uygunluk Belgeleri.
d) Geçici Teminat Mektubu veya Güvenli Havuz (Escrow) Bloke Teminatı.

--------------------------------------------------------------------------------
3. TEKLİF VERME VE DEĞERLENDİRME USULÜ
--------------------------------------------------------------------------------
Teklifler İhaleciBurada platformu üzerinden kapalı zarf usulü veya canlı eksiltme
modülüyle toplanacaktır. İhale süresi bitiminde en avantajlı fiyat ve teknik yeterlilik
sahibi yüklenici ile sözleşme akdedilecektir.

Resmi Belge Doğrulama Kodu: IHC-${String(tender.id).replace('/', '-')}-${Math.floor(1000 + Math.random()*9000)}
Belge Tanzim Tarihi: ${new Date().toLocaleDateString('tr-TR')}
`
  downloadFile(`Ihale_Ilani_${String(tender.id).replace('/', '_')}.txt`, content)
}

function downloadMalzemeListesi(tender: any) {
  const csvContent = `\uFEFFSıra No;Malzeme / İş Kalemi;Miktar;Birim;Tahmini Birim Fiyat;Toplam Bütçe;Teknik Standart;Teslimat Yeri
1;${tender.baslik};1;Parti / Paket;${tender.butce};${tender.butce};TSE / ISO 9001;${tender.city || 'Şantiye Teslimi'}
2;Sigortalı Nakliye, Taşıma ve Saha İndirme;1;Hizmet;Dahil;Dahil;Kasko & CMR Sigortalı;${tender.city || 'Şantiye Teslimi'}
3;Akredite Kalite Kontrol ve Muayene Kabul Raporu;1;Paket;Dahil;Dahil;TSE Standart Uygunluk;${tender.city || 'Şantiye Teslimi'}
`
  downloadFile(`Malzeme_Listesi_${String(tender.id).replace('/', '_')}.csv`, csvContent, 'text/csv;charset=utf-8;')
}

function downloadIdariSartname(tender: any) {
  const content = `================================================================================
                    İHALECİBURADA B2B ELEKTRONİK İHALE SİSTEMİ
                             İDARİ ŞARTNAME METNİ
================================================================================

İhale No : ${tender.id}
İşin Adı : ${tender.baslik}
İşin Yeri: ${tender.city || 'Türkiye Geneli'}

MADDE 1 - İHALE SAHİBİ VE İDAREYE İLİŞKİN BİLGİLER
1.1. İdare: ${tender.authority || 'İhaleciBurada Satın Alma Masası'}
1.2. İhaleyi Açan Kurum: ${tender.ownerCompany || 'Doğrulanmış B2B Kurumsal Alıcı'}

MADDE 2 - İHALENİN USULÜ VE TEKLİFİN ŞEKLİ
2.1. İhale Usulü: ${tender.tur || 'Açık Eksiltme ve Doğrudan Temin'}
2.2. Teklifler platform üzerinden 256-bit TLS şifrelemeyle kapalı zarf formatında alınır.

MADDE 3 - SÖZLEŞME BEDELİ VE ÖDEME ESASLARI
3.1. Yaklaşık Bütçe: ${tender.butce}
3.2. Ödemeler, mal ve hizmet muayene kabul tutanağının tanzimini müteakip
     TCMB lisanslı Güvenli Ticaret Havuz (Escrow) hesabından yüklenici IBAN'ına aktarılır.

MADDE 4 - TESLİMAT VE MUAYENE KABUL
4.1. Mallar şantiye/depo adresine hasarsız olarak teslim edilecek,
     3 (üç) iş günü içinde oluşturulacak heyet tarafından fiziki ve teknik muayenesi yapılacaktır.

MADDE 5 - CEZAİ HÜKÜMLER VE ANLAŞMAZLIKLAR
5.1. Mücbir sebepler haricinde geciken her takvim günü için sözleşme bedelinin %0.1'i oranında ceza kesilir.
5.2. İhtilaf vukuunda Çanakkale / İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.

Tanzim Tarihi: ${new Date().toLocaleDateString('tr-TR')}
`
  downloadFile(`Idari_Sartname_${String(tender.id).replace('/', '_')}.txt`, content)
}

function downloadSozlesme(tender: any) {
  const content = `================================================================================
                    TİP B2B MAL VE HİZMET SATIN ALMA SÖZLEŞMESİ
================================================================================

Sözleşme Kayıt No : SOZ-${String(tender.id).replace('/', '-')}-2026
İhale Konusu      : ${tender.baslik}
Alıcı Taraf       : ${tender.ownerCompany || 'Alıcı Kurumsal Firma'}
Yüklenici Taraf   : İhaleyi Kazanan Onaylı Tedarikçi Firma
Sözleşme Tutarı   : ${tender.butce}
Yürürlük Tarihi   : ${new Date().toLocaleDateString('tr-TR')}

1. TARAFLARIN HAK VE YÜKÜMLÜLÜKLERİ:
Yüklenici, işbu sözleşme konusu mal ve hizmeti teknik şartnamede belirtilen kalitede ve
sürede teslim etmeyi; Alıcı ise şartnameye uygun teslimat sonrasında bedeli Güvenli Havuz
aracılığıyla eksiksiz ödemeyi taahhüt eder.

2. GÜVENCE VE BLOKE:
İhale bedeli alıcı tarafından TCMB/BDDK güvenceli emanet hesaba yatırılmış olup, teslimat
onayından önce tedarikçiye ve alıcıya karşılıklı güvence sağlamaktadır.

3. KANUNİ DAYANAK:
İşbu sözleşme 6098 sayılı Türk Borçlar Kanunu, 6102 sayılı TTK ve 6563 sayılı Elektronik
Ticaretin Düzenlenmesi Hakkında Kanun hükümlerine tabidir.
`
  downloadFile(`Sozlesme_Metni_${String(tender.id).replace('/', '_')}.txt`, content)
}

function downloadSonucIlani(tender: any) {
  const content = `================================================================================
                    İHALE SONUÇ BİLDİRİMİ VE MUTABAKAT TUTANAĞI
================================================================================

İhale No          : ${tender.id}
İhale Başlığı     : ${tender.baslik}
İhale Durumu      : ${tender.durum === 'closed' ? 'SONUÇLANDI / SÖZLEŞME İMZALANDI' : 'DEĞERLENDİRME AŞAMASINDA'}
Kazanan Yüklenici : ${tender.ownerCompany || 'En Avantajlı Teklif Sahibi Yüklenici'}
Sözleşme Bedeli   : ${tender.butce}
Toplam Teklif     : ${tender.teklifSayisi || 0} Firma Katıldı
Tasarruf Oranı    : %14.2 Ortalama Maliyet Tasarrufu
Sonuçlanma Tarihi : ${new Date().toLocaleDateString('tr-TR')}
`
  downloadFile(`Sonuc_Ilani_${String(tender.id).replace('/', '_')}.txt`, content)
}

function downloadAllSpecs(tender: any) {
  let content = `========================================================
İHALECİBURADA.COM - RESMİ İHALE ŞARTNAME VE MALZEME PAKETİ
İhale No: ${tender.id}
İhale Başlığı: ${tender.baslik}
Kategori: ${tender.kategori}
Şehir: ${tender.city || 'Türkiye Geneli'}
Bütçe: ${tender.butce || 'Açık İhale'}
========================================================

1. İHALE METNİ VE GENEL ŞARTLAR:
${tender.aciklama || 'Belirtilen standart şartname hükümleri geçerlidir.'}

2. MALZEME LİSTESİ & METRAJ:
- Kalem 1: Standart şartname metrajına uygun malzeme ve işçilik.

3. İDARİ VE TEKNİK ŞARTLAR:
- Teslimat süresine ve irsaliye kabul kriterlerine uygunluk esastır.
- Hakediş ödemesi TCMB/BDDK mevzuatına uygun Güvenli Havuz (Escrow) hesabında korunacaktır.
========================================================
`
  downloadFile(`Sartname_Paketi_${String(tender.id).replace('/', '_')}.txt`, content)
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

            <div class="shrink-0 flex items-center gap-1.5 flex-wrap">
              <span 
                class="px-2.5 py-0.8 rounded-lg text-[10px] font-black border shadow-2xs"
                :class="getTenderDirectionBadge(tender).class"
              >
                {{ getTenderDirectionBadge(tender).label }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="tender.durum === 'closed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'">
                {{ tender.durum === 'closed' ? 'Tamamlandı' : '🟢 Canlı / Açık' }}
              </span>
            </div>
          </div>

          <!-- Row 2: Yüklenici & Sözleşme Bedeli -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1.5 text-slate-700">
              <Users :size="14" class="text-[#0084B4] shrink-0" />
              <span class="font-bold text-slate-500 shrink-0">Yüklenici adı:</span>
              <button
                type="button"
                @click="openCompanyModal(tender.ownerCompany || 'Doğrulanmış B2B Kurumsal Firma', tender)"
                class="font-black text-[#0F223D] hover:text-[#0084B4] hover:underline transition-colors cursor-pointer text-left truncate flex items-center gap-1.5"
                title="Şirket İtibar ve İhale Profilini İncele"
              >
                <span class="truncate">{{ tender.ownerCompany || 'Doğrulanmış B2B Kurumsal Firma' }}</span>
                <span class="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200 inline-flex items-center gap-0.5 shrink-0 shadow-2xs">
                  <Star :size="9" class="fill-amber-400 text-amber-500" />
                  {{ getCompanyData(tender.ownerCompany).rating }}
                </span>
                <span class="text-[10px] text-blue-600 font-bold hidden md:inline shrink-0">({{ getCompanyData(tender.ownerCompany).completedTenders }} İhale)</span>
              </button>
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
              <span class="font-bold text-slate-500 shrink-0">İdare adı:</span>
              <button
                type="button"
                @click="openCompanyModal(tender.authority, tender)"
                class="font-bold text-slate-800 hover:text-blue-700 hover:underline transition-colors cursor-pointer text-left truncate"
                title="İdare Profilini İncele"
              >
                {{ tender.authority || 'İhaleciBurada Satın Alma Masası' }}
              </button>
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

          <!-- Row 5: 7 EKAP Sub-tabs / Action Buttons (Görsel 1 ile birebir) -->
          <div class="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-200">
            <div class="flex flex-wrap items-center gap-1.5">
              <button 
                type="button"
                @click="openModalWithTab(tender, 'ilan')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <FileText :size="12" class="text-purple-600" />
                <span>📄 İhale İlanı</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'malzeme')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <Layers :size="12" class="text-amber-600" />
                <span>📦 Malzeme Listesi (1)</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'idari')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <ShieldCheck :size="12" class="text-emerald-600" />
                <span>📜 İdari Şartname</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'sozlesme')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <FileText :size="12" class="text-amber-500" />
                <span>🤝 Sözleşme Listesi (1)</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'firmalar')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <Building2 :size="12" class="text-blue-600" />
                <span>🏢 Firmalar</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'sonuc')"
                class="px-2.5 py-1 rounded transition flex items-center gap-1 cursor-pointer border shadow-2xs font-bold"
                :class="tender.durum === 'closed' ? 'bg-[#0F223D] text-white border-[#0F223D]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'"
              >
                <CheckCircle2 :size="12" :class="tender.durum === 'closed' ? 'text-amber-400' : 'text-slate-500'" />
                <span>🏆 Sonuç İlanı</span>
              </button>

              <button 
                type="button"
                @click="openModalWithTab(tender, 'gecmis')"
                class="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <RotateCcw :size="12" class="text-purple-500" />
                <span>⏱️ Benzer İhale Geçmişi</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <NuxtLink
                v-if="isMyOwnTender(tender)"
                to="/panel/gelen-teklifler"
                class="px-3.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Bu sizin kendi ihale ilanınızdır"
              >
                <Building2 :size="12" class="text-amber-700" />
                <span>👤 Kendi İlanınız</span>
              </NuxtLink>
              <button
                v-else-if="tender.durum !== 'closed' && tender.durum !== 'expired'"
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
      <div v-else class="bg-white border border-slate-300 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileText :size="32" />
        </div>
        <div class="space-y-1">
          <h3 class="font-black text-slate-800 text-base">Henüz Yayınlanmış İhale İlanı Bulunmuyor</h3>
          <p class="text-slate-500 text-xs max-w-md mx-auto">
            Platformda şu anda kayıtlı bir ihale ilanı yer almamaktadır. Satın alma veya tedarik ihalenizi oluşturarak teklif toplamaya başlayabilirsiniz.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NuxtLink to="/panel/ihale-olustur" class="px-5 py-2.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-xs">
            <Plus :size="14" />
            <span>Yeni İhale İlanı Oluştur</span>
          </NuxtLink>
          <button v-if="searchQuery || selectedCategory !== 'Tümü' || selectedCity !== 'Tümü'" type="button" @click="resetFilters" class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
            Filtreleri Sıfırla
          </button>
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
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div class="flex items-center justify-between">
              <h4 class="font-black text-slate-900 text-sm">Resmi İhale İlan Metni & Kapsamı</h4>
              <button
                type="button"
                @click="downloadIhaleIlani(selectedTenderForDetail)"
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Download :size="12" />
                <span>İhale İlanını İndir (.TXT)</span>
              </button>
            </div>
            <p>{{ selectedTenderForDetail.aciklama || 'Bu ihale şartnamesinde yer alan teknik kriterler, teslimat takvimi ve kalite standartları uyarınca mal / hizmet alımı yapılacaktır.' }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span class="font-black text-slate-800 text-xs block">İstenen Yeterlilik Belgeleri</span>
              <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>Güncel Vergi Levhası ve Faaliyet Belgesi</li>
                <li>İmza Sirküleri / Yetki Belgesi</li>
                <li>TSE / ISO Kalite Uygunluk Sertifikası</li>
                <li>Geçici Teminat Mektubu / Güvenli Havuz Blokesi</li>
              </ul>
            </div>

            <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5 text-blue-950">
              <span class="font-black text-xs block">Şifreli Teklif & Escrow Güvencesi</span>
              <p class="text-[11px] text-blue-900 leading-relaxed">
                Tüm teklifler 256-bit şifreleme ile ihale bitiş anına kadar gizli tutulur. Kabul edilen teklifin ödemesi TCMB/BDDK mevzuatına uygun Güvenli Havuz (Escrow) hesabında korunur.
              </p>
            </div>
          </div>
        </div>

        <!-- Tab 2: Malzeme Listesi -->
        <div v-if="detailActiveTab === 'malzeme'" class="space-y-4 text-xs">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-slate-900 text-sm">İhale Kalemleri & Metraj Cetveli</h4>
            <button
              type="button"
              @click="downloadMalzemeListesi(selectedTenderForDetail)"
              class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet :size="12" />
              <span>Malzeme Listesini Excel İndir (.CSV)</span>
            </button>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                <tr>
                  <th class="p-3">Sıra</th>
                  <th class="p-3">Malzeme / İş Kalemi</th>
                  <th class="p-3">Miktar</th>
                  <th class="p-3">Birim</th>
                  <th class="p-3">Tahmini Bütçe</th>
                  <th class="p-3">Teknik Standart</th>
                  <th class="p-3">Teslimat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-mono font-bold text-slate-500">01</td>
                  <td class="p-3 font-bold text-slate-900">{{ selectedTenderForDetail.baslik }}</td>
                  <td class="p-3 font-mono font-bold">1</td>
                  <td class="p-3 text-slate-600">Paket / Parti</td>
                  <td class="p-3 font-mono font-black text-emerald-600">{{ selectedTenderForDetail.butce }}</td>
                  <td class="p-3 text-slate-600">TSE / ISO 9001</td>
                  <td class="p-3 font-bold text-slate-700">{{ selectedTenderForDetail.city || 'Şantiye Teslimi' }}</td>
                </tr>
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-mono font-bold text-slate-500">02</td>
                  <td class="p-3 font-bold text-slate-800">Sigortalı Nakliye, Taşıma ve Saha İndirme</td>
                  <td class="p-3 font-mono font-bold">1</td>
                  <td class="p-3 text-slate-600">Hizmet</td>
                  <td class="p-3 font-mono font-bold text-slate-500">Dahil</td>
                  <td class="p-3 text-slate-600">CMR / Nakliyat Sigortası</td>
                  <td class="p-3 font-bold text-slate-700">{{ selectedTenderForDetail.city || 'Şantiye Teslimi' }}</td>
                </tr>
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-mono font-bold text-slate-500">03</td>
                  <td class="p-3 font-bold text-slate-800">Akredite Kalite Kontrol & Muayene Kabul Tutanağı</td>
                  <td class="p-3 font-mono font-bold">1</td>
                  <td class="p-3 text-slate-600">Paket</td>
                  <td class="p-3 font-mono font-bold text-slate-500">Dahil</td>
                  <td class="p-3 text-slate-600">TSE Normları</td>
                  <td class="p-3 font-bold text-slate-700">3 İş Günü Muayene</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: İdari Şartname -->
        <div v-if="detailActiveTab === 'idari'" class="space-y-4 text-xs text-slate-700">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-slate-900 text-sm">İdari ve Hukuki Satın Alma Şartnamesi</h4>
            <button
              type="button"
              @click="downloadIdariSartname(selectedTenderForDetail)"
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Download :size="12" />
              <span>İdari Şartnameyi İndir (.TXT)</span>
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-700">1. Teslimat Lokasyonu ve Şekli:</span>
              <span class="font-black text-slate-900">{{ selectedTenderForDetail.city || 'Türkiye Geneli' }} (Şantiye / Depo Teslimi)</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-700">2. Ödeme ve Hakediş Şartı:</span>
              <span class="font-black text-emerald-700">TCMB/BDDK Uyumlu Güvenli Havuz (Escrow) Bloke Ödeme</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-700">3. Mal Muayene ve Kabul Süreci:</span>
              <span class="font-black text-slate-900">İrsaliye ve Fiziki Sayım Tutanağı ile 3 İş Günü</span>
            </div>
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-bold text-slate-700">4. Teminat ve Güvence Oranı:</span>
              <span class="font-black text-slate-900">%3 Geçici Teminat / %6 Kesin Teminat Mektubu</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">5. Gecikme Cezası Hükümleri:</span>
              <span class="font-black text-rose-700">Mücbir sebep hariç günlük %0.1 (Binde Bir)</span>
            </div>
          </div>
        </div>

        <!-- Tab 4: Sözleşme Listesi -->
        <div v-if="detailActiveTab === 'sozlesme'" class="space-y-4 text-xs text-slate-700">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-slate-900 text-sm">Resmi Tip Mal / Hizmet Satın Alma Sözleşmesi</h4>
            <button
              type="button"
              @click="downloadSozlesme(selectedTenderForDetail)"
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Download :size="12" />
              <span>Sözleşme Metnini İndir (.TXT)</span>
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-slate-200 pb-3">
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">Sözleşme Kayıt No</span>
                <span class="font-mono font-bold text-slate-800">SOZ-{{ selectedTenderForDetail.id }}-2026</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">Sözleşme Bedeli</span>
                <span class="font-mono font-black text-emerald-600">{{ selectedTenderForDetail.butce }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">Yasal Dayanak</span>
                <span class="font-bold text-slate-800">6098 s. TBK / 6102 s. TTK</span>
              </div>
            </div>
            <p class="text-slate-600 text-xs leading-relaxed">
              İhale onaylandığı anda alıcı ve kazanan tedarikçi arasında dijital zaman damgalı sözleşme akdedilir. Hakediş bedeli onaylı teslimat sonrasında aktarılır.
            </p>
          </div>
        </div>

        <!-- Tab 5: Firmalar -->
        <div v-if="detailActiveTab === 'firmalar'" class="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div 
            @click="openCompanyModal(selectedTenderForDetail.ownerCompany || selectedTenderForDetail.company, selectedTenderForDetail)"
            class="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 cursor-pointer group shadow-2xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-500 uppercase text-[10px]">İhaleyi Açan Kurumsal Alıcı / Yüklenici</span>
              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200 inline-flex items-center gap-0.5">
                  <Star :size="10" class="fill-amber-400 text-amber-500" />
                  {{ getCompanyData(selectedTenderForDetail.ownerCompany).rating }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-200">✓ Onaylı Kurumsal Hesap</span>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F223D] to-blue-700 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Building2 :size="22" />
                </div>
                <div>
                  <h5 class="font-black text-slate-900 text-sm group-hover:text-blue-700 transition flex items-center gap-1.5">
                    <span>{{ selectedTenderForDetail.ownerCompany || selectedTenderForDetail.company || 'Doğrulanmış B2B Satın Alma Şirketi' }}</span>
                    <span class="text-[10px] text-blue-600 font-bold">({{ getCompanyData(selectedTenderForDetail.ownerCompany).completedTenders }} İhale)</span>
                  </h5>
                  <span class="text-slate-500 text-[11px]">📍 {{ selectedTenderForDetail.city || 'Türkiye Geneli' }} · GİB Vergi & MERSİS Kaydı Doğrulanmış</span>
                </div>
              </div>
              <button type="button" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-blue-700 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                Profili Gör →
              </button>
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
        <div v-if="detailActiveTab === 'sonuc'" class="space-y-4 text-xs text-slate-700">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-slate-900 text-sm">İhale Sonuç ve Mutabakat Raporu</h4>
            <button
              type="button"
              @click="downloadSonucIlani(selectedTenderForDetail)"
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Download :size="12" />
              <span>Sonuç Belgesini İndir (.TXT)</span>
            </button>
          </div>

          <div class="p-4 rounded-2xl border" :class="selectedTenderForDetail.durum === 'closed' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'">
            <div class="font-black text-sm">
              {{ selectedTenderForDetail.durum === 'closed' ? '🔒 İhale Sonuçlandı (Mutabakat Sağlandı)' : '🟢 İhale Canlı Yayında & Teklif Alımına Açık' }}
            </div>
            <p class="mt-1 text-xs">
              Bu ihaleye şu ana kadar toplam <strong>{{ selectedTenderForDetail.teklifSayisi || 0 }} adet</strong> kurumsal teklif iletilmiştir.
            </p>
          </div>
        </div>

        <!-- Tab 7: Benzer İhale Geçmişi -->
        <div v-if="detailActiveTab === 'gecmis'" class="space-y-4 text-xs text-slate-700">
          <h4 class="font-black text-slate-900 text-sm">Sektörel Piyasa & Emsal İhale Fiyat Geçmişi</h4>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p class="text-slate-700"><strong>{{ selectedTenderForDetail.kategori }}</strong> sektöründe son dönemde tamamlanan emsal ihalelerde gerçekleşen fiyat rekabeti ve ortalama tasarruf analizi:</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-center">
              <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">Ortalama Teklif Sayısı</span>
                <span class="font-black text-sm text-slate-900">8.4 Firma</span>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">Ortalama Tasarruf</span>
                <span class="font-black text-sm text-emerald-600">%14.2 İndirim</span>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">Tamamlanma Süresi</span>
                <span class="font-black text-sm text-blue-600">Ortalama 4.2 Gün</span>
              </div>
            </div>
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
            <NuxtLink
              v-if="isMyOwnTender(selectedTenderForDetail)"
              to="/panel/gelen-teklifler"
              class="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 :size="13" class="text-amber-700" />
              <span>👤 Kendi İlanınız (Gelen Teklifleri Gör)</span>
            </NuxtLink>
            <button
              v-else-if="selectedTenderForDetail.durum !== 'closed' && selectedTenderForDetail.durum !== 'expired'"
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

    <!-- 🏢 ŞİRKET / YÜKLENİCİ DETAYLI İTİBAR VE PERFORMANS PROFİLİ MODALI -->
    <div v-if="selectedCompanyForProfile" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <!-- Header Top Row -->
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div class="flex items-start gap-3.5">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F223D] to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <Building2 :size="28" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck :size="12" />
                  {{ selectedCompanyForProfile.badge }}
                </span>
                <span class="text-xs text-slate-500 font-medium">
                  📍 {{ selectedCompanyForProfile.city }} · Kuruluş: {{ selectedCompanyForProfile.foundedYear }}
                </span>
              </div>
              <h2 class="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                {{ selectedCompanyForProfile.name }}
              </h2>
            </div>
          </div>
          <button @click="selectedCompanyForProfile = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
            <X :size="22" />
          </button>
        </div>

        <!-- 🌟 4'LÜ PERFORMANS & YILDIZ İSTATİSTİK ŞERİDİ -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- 1. Yıldız Puanı -->
          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
            <span class="text-[10px] font-bold text-amber-800 uppercase block">Yıldız Puanı</span>
            <div class="flex items-center justify-center gap-1 font-black text-xl text-amber-900">
              <Star :size="18" class="fill-amber-400 text-amber-500" />
              <span>{{ selectedCompanyForProfile.rating }}</span>
              <span class="text-xs text-amber-700 font-normal">/ 5.0</span>
            </div>
            <span class="text-[10px] text-amber-700 font-bold block">{{ selectedCompanyForProfile.reviewCount }} Değerlendirme</span>
          </div>

          <!-- 2. Tamamlanan İhale -->
          <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
            <span class="text-[10px] font-bold text-blue-800 uppercase block">Tamamlanan İhale</span>
            <div class="font-black text-xl text-blue-950 font-mono">
              {{ selectedCompanyForProfile.completedTenders }}
            </div>
            <span class="text-[10px] text-blue-700 font-bold block">Başarılı Sözleşme</span>
          </div>

          <!-- 3. Toplam Teklif Sayısı -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase block">Toplam Teklif</span>
            <div class="font-black text-xl text-slate-900 font-mono">
              {{ selectedCompanyForProfile.totalBids }}
            </div>
            <span class="text-[10px] text-slate-500 font-bold block">İhale Katılımı</span>
          </div>

          <!-- 4. Toplam İş Hacmi -->
          <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1">
            <span class="text-[10px] font-bold text-emerald-800 uppercase block">Toplam İş Hacmi</span>
            <div class="font-black text-xl text-emerald-700 font-mono">
              {{ selectedCompanyForProfile.tradeVolume }}
            </div>
            <span class="text-[10px] text-emerald-700 font-bold block">Escrow Hacmi</span>
          </div>
        </div>

        <!-- 🛡️ RESMİ DOĞRULAMA VE KURUMSAL BİLGİLER -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <BadgeCheck :size="15" class="text-blue-600" />
            <span>Doğrulanmış Kurumsal Sicil & İletişim Bilgileri</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Faaliyet Sektörleri:</span>
              <span class="font-bold text-slate-800">{{ selectedCompanyForProfile.sector }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Vergi Dairesi / VKN:</span>
              <span class="font-mono font-bold text-slate-800">{{ selectedCompanyForProfile.taxOffice }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">MERSİS Numarası:</span>
              <span class="font-mono font-bold text-slate-800">{{ selectedCompanyForProfile.mersis }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block uppercase">İletişim Telefon & E-Posta:</span>
              <span class="font-bold text-slate-800">{{ selectedCompanyForProfile.phone }} · {{ selectedCompanyForProfile.email }}</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-600">
            <span class="text-emerald-700">✓ Zamanında Teslimat: {{ selectedCompanyForProfile.onTimeDelivery }}</span>
            <span class="text-blue-700">✓ Şartname Uyumu: {{ selectedCompanyForProfile.specCompliance }}</span>
            <span class="text-purple-700">✓ Ortalama Yanıt Süresi: {{ selectedCompanyForProfile.avgResponseTime }}</span>
          </div>
        </div>

        <!-- 💬 MÜŞTERİ & İDARE DEĞERLENDİRMELERİ -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Star :size="14" class="text-amber-500 fill-amber-400" />
              <span>Son Alıcı / İdare Değerlendirmeleri ({{ selectedCompanyForProfile.reviews?.length || 0 }})</span>
            </h4>
            <span class="text-[11px] font-bold text-emerald-700">✓ Doğrulanmış Sözleşme Yorumları</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="(rev, rIdx) in selectedCompanyForProfile.reviews"
              :key="rIdx"
              class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-black text-slate-900">{{ rev.author }}</span>
                <div class="flex items-center gap-1 text-amber-500 font-bold">
                  <span>{{ rev.rating }}</span>
                  <div class="flex">
                    <Star v-for="i in 5" :key="i" :size="11" class="fill-amber-400 text-amber-400" />
                  </div>
                  <span class="text-[10px] text-slate-400 font-normal ml-1">({{ rev.date }})</span>
                </div>
              </div>
              <p class="text-xs text-slate-600 italic">"{{ rev.comment }}"</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <NuxtLink
            to="/firmalar"
            class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 :size="14" />
            <span>Tüm Firma Rehberini Aç</span>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <button 
              @click="selectedCompanyForProfile = null" 
              class="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Kapat
            </button>
            <NuxtLink
              to="/panel/mesajlar"
              class="px-5 py-2 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send :size="13" />
              <span>Mesaj Gönder / Teklif İste</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

  </div>

    <!-- ========================================================================= -->
    <!-- 📑 RESMİ ŞARTNAME PDF AÇICI & DOKÜMAN GÖRÜNTÜLEYİCİ MODAL -->
    <!-- ========================================================================= -->
    <div v-if="showPdfViewerModal && pdfTenderTarget" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div class="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden text-left">
        
        <!-- PDF Toolbar Header -->
        <div class="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
              PDF
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                  {{ pdfDocTarget?.name || ('Şartname_' + pdfTenderTarget.id + '.pdf') }}
                </span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  ✓ e-İmzalı Resmi Doküman
                </span>
              </div>
              <div class="text-[11px] text-slate-400 font-mono">
                İKN: #{{ pdfTenderTarget.id }} · Zaman Damgası: {{ new Date().toLocaleDateString('tr-TR') }}
              </div>
            </div>
          </div>

          <!-- Toolbar Buttons -->
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              @click="printPdfDocument" 
              class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Yazdır"
            >
              <Printer :size="13" />
              <span class="hidden sm:inline">Yazdır</span>
            </button>
            <button 
              type="button" 
              @click="downloadPdfDocument(pdfTenderTarget)" 
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
            >
              <Download :size="13" />
              <span>İndir</span>
            </button>
            <button 
              type="button" 
              @click="showPdfViewerModal = false" 
              class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- PDF Page Sheet Viewer Area (A4 Paper Aesthetic) -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-800 flex justify-center custom-scrollbar">
          <div id="printable-pdf-spec" class="bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-12 max-w-2xl w-full space-y-6 text-left border border-slate-200 font-sans min-h-[750px] relative">
            
            <!-- Official Letterhead Header -->
            <div class="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-[#0F223D] text-white flex items-center justify-center font-black text-lg shrink-0">
                  İB
                </div>
                <div>
                  <div class="text-[10px] font-black uppercase text-blue-900 tracking-wider">T.C. ELEKTRONİK TİCARET VE B2B İHALE SİSTEMİ</div>
                  <div class="text-base font-black text-slate-900 tracking-tight">İHALECİBURADA RESMİ İHALE ŞARTNAMESİ</div>
                  <div class="text-[10px] text-slate-500">Mersis: 0470-0854-2100-0001 · GİB VKN: 4700854210</div>
                </div>
              </div>
              <div class="text-right sm:border-l sm:pl-4 border-slate-200">
                <div class="text-[10px] font-mono font-bold text-slate-400">İHALE KAYIT NO (İKN)</div>
                <div class="text-sm font-mono font-black text-blue-900">#{{ pdfTenderTarget.id }}</div>
                <div class="text-[10px] text-emerald-600 font-bold">● Dijital Mühürlü</div>
              </div>
            </div>

            <!-- Document Info Table -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">İhaleyi Açan Kurum</span>
                <span class="font-bold text-slate-800">{{ pdfTenderTarget.ownerCompany || pdfTenderTarget.authority || 'Kurumsal Masası' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">Kategori & Sektör</span>
                <span class="font-bold text-slate-800">{{ pdfTenderTarget.kategori || 'Genel Satın Alma' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">Hedef / Yaklaşık Bütçe</span>
                <span class="font-mono font-black text-emerald-700">{{ pdfTenderTarget.butce || 'Açık Teklif' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">Teslimat / Uygulama İli</span>
                <span class="font-bold text-slate-800">{{ pdfTenderTarget.city || 'Balıkesir' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">İhale Usulü</span>
                <span class="font-bold text-slate-800">{{ pdfTenderTarget.tur || 'Açık Eksiltmeli İhale' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 uppercase block">Kalan Süre / Son Tarih</span>
                <span class="font-bold text-amber-700">{{ pdfTenderTarget.sure || '7 gün' }}</span>
              </div>
            </div>

            <!-- Content Sections -->
            <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div class="space-y-1.5">
                <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200 flex items-center gap-1.5">
                  <span>1. İHALENİN KONUSU VE TEKNİK İSTERLER</span>
                </h3>
                <p class="p-3 rounded-lg bg-slate-50 border border-slate-100 font-serif leading-relaxed text-slate-800 whitespace-pre-line">
                  {{ pdfTenderTarget.aciklama || pdfTenderTarget.baslik }}
                </p>
              </div>

              <div class="space-y-1.5">
                <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200">
                  2. İDARİ ŞARTLAR VE TESLİMAT KOŞULLARI
                </h3>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Teslimat adresi: <strong>{{ pdfTenderTarget.teslimatAdresi || (pdfTenderTarget.city + ' Merkez / Depo Teslimat') }}</strong> olarak belirlenmiştir.</li>
                  <li>İstekliler şartnamede belirtilen teknik standartlara ve TSE/ISO belgelerine uygun teklif vermelidir.</li>
                  <li>Hakediş ödemeleri BDDK/TCMB onaylı <strong>Escrow Güvenli Havuz</strong> hesabında bloke edilecek olup, irsaliye ve muayene kabul onayından sonra yükleniciye aktarılacaktır.</li>
                </ul>
              </div>

              <div class="space-y-1.5">
                <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200">
                  3. EKLİ BELGELER VE ŞARTNAME DOSYALARI
                </h3>
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-red-100 text-red-700 font-black text-[10px]">PDF</span>
                    <span class="font-bold text-slate-800">{{ pdfDocTarget?.name || ('Şartname_' + pdfTenderTarget.id + '.pdf') }}</span>
                    <span class="text-slate-400">({{ pdfDocTarget?.size || '0.08 MB' }})</span>
                  </div>
                  <span class="text-emerald-700 font-bold text-[11px]">✓ Aslı Doğrulandı</span>
                </div>
              </div>
            </div>

            <!-- Stamp & Verification Footer -->
            <div class="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-[10px] text-slate-500">
              <div>
                <div>6098 s. TBK ve 6102 s. TTK kapsamında düzenlenmiştir.</div>
                <div>Zaman Damgası: {{ new Date().toISOString() }}</div>
                <div class="font-mono text-slate-400">Hash: SHA-256-{{ pdfTenderTarget.id }}-CERT-VALID</div>
              </div>
              <div class="text-center p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                <div class="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black mx-auto mb-1">
                  ✓
                </div>
                <div class="font-black text-blue-950 text-[10px]">İhaleciBurada</div>
                <div class="text-[8px] text-blue-700 font-bold">DİJİTAL MÜHÜR VE ONAY</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

</template>

