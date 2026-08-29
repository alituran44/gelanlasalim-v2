<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  MapPin,
  Building2,
  Building,
  Clock3,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Scale,
  Globe2,
  Handshake,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  X,
  Zap,
  Briefcase,
  Play,
  User,
  Bell,
  Inbox,
  Send,
  Users,
  Home,
  Check,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  Eye,
  MessageSquare,
  HelpCircle,
  Award,
  RefreshCw,
  ExternalLink,
  Calendar,
  Folder,
  FolderOpen,
  RotateCcw,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada.com — Türkiye’nin En Kapsamlı İhale ve Satın Alma Portalı',
  description: 'Günlük ihaleler, kamu ve özel sektör satın alma ilanları, şartnameler, doğrudan teklif verme ve sonuç takip sistemi.'
})

// ==================== MENÜ SEÇİMİ (SADECE 4 ANA MENÜ) ====================
// Kullanıcı talimatı: KİK Kararları ve İdareler kaldırıldı, sadece bu 4 menü aktif!
const activeSubMenu = ref<'kategoriler' | 'sehirler' | 'sektorler' | 'firmalar'>('kategoriler')
const activeTimeTab = ref('guncel')

// Arama Filtreleri
const filterCategory = ref('Tümü')
const filterCity = ref('Tümü')
const filterType = ref('Tümü')
const filterMethod = ref('Tümü')
const filterCost = ref('Tümü')
const filterKeyword = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const searchScope = ref('icerik')
const viewMode = ref<'gelismis' | 'basit'>('gelismis')
const readMode = ref<'goster' | 'gizle'>('goster')

// Yüklenici Arama Filtresi
const contractorSearchCategory = ref('Tümü')
const contractorSearchName = ref('')
const contractorPage = ref(1)

// Sektör Arama Filtresi
const sectorSearchCategory = ref('Tümü')
const sectorSearchName = ref('')

// İhale Detay Modalı
const selectedTenderModal = ref<any>(null)
const quickOfferPrice = ref('')
const quickOfferNotes = ref('')
const selectedItemName = ref<string | null>(null)

import { useCmsData } from '~/composables/useCmsData'

// ==================== DİNAMİK CMS VERİ BAĞLANTISI ====================
const { cmsData } = useCmsData()
const allTenders = computed(() => cmsData.value?.dashboard?.tenders || [])

const todayPublishedCount = computed(() => allTenders.value.filter(t => t.durum !== 'closed').length)
const todayOngoingCount = computed(() => allTenders.value.filter(t => t.durum === 'active').length)
const todayFinishedCount = computed(() => allTenders.value.filter(t => t.durum === 'closed').length)

function getCategoryCount(catName: string) {
  const words = catName.toLowerCase()
    .replace(/[-–,/()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['ihaleleri', 'ürünler', 'hizmetleri', 'alım', 'işleri', 'satışı'].includes(w))

  return allTenders.value.filter((t: any) => {
    const k = (t.kategori || '').toLowerCase()
    const b = (t.baslik || '').toLowerCase()
    return words.some(w => k.includes(w) || b.includes(w))
  }).length
}

function getCityCount(cityName: string) {
  return allTenders.value.filter((t: any) => {
    const city = (t.city || '').toLowerCase()
    return city.includes(cityName.toLowerCase())
  }).length
}

function getFilterCount(filterName: string) {
  const clean = filterName.toLowerCase().split(' ')[0]
  return allTenders.value.filter((t: any) => {
    const tur = (t.tur || t.type || '').toLowerCase()
    const usul = (t.usul || t.method || '').toLowerCase()
    const kaynak = (t.kaynak || '').toLowerCase()
    const kat = (t.kategori || '').toLowerCase()
    return tur.includes(clean) || usul.includes(clean) || kaynak.includes(clean) || kat.includes(clean)
  }).length
}

// ==================== 1. KATEGORİLER LİSTESİ (GÖRSEL 1: 36 KATEGORİ) ====================
const rawCategoriesLeft = [
  { id: 1, name: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri' },
  { id: 2, name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri' },
  { id: 3, name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama İhaleleri' },
  { id: 4, name: 'Mühendislik - Mimarlık - Danışmanlık İhaleleri' },
  { id: 5, name: 'Madencilik - Doğal Kaynaklar - Sondaj İhaleleri' },
  { id: 6, name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri' },
  { id: 7, name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri' },
  { id: 8, name: 'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri' },
  { id: 9, name: 'Asansör - Yapı Otomasyon - Mekanik Güvenlik İhaleleri' },
  { id: 10, name: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı İhaleleri' },
  { id: 11, name: 'Endüstriyel Makine - Motor - Konveyör İhaleleri' },
  { id: 12, name: 'Savunma Sanayi, Silah - Denizcilik - Havacılık İhaleleri' },
  { id: 13, name: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri' },
  { id: 14, name: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri' },
  { id: 15, name: 'Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri' },
  { id: 16, name: 'Reklam - Tabela - Billboard - Tanıtım Materyalleri İhaleleri' },
  { id: 17, name: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri' },
  { id: 18, name: 'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri' },
  { id: 19, name: 'Hayvancılık - Veterinerlik - Hayvan Yemi İhaleleri' },
  { id: 20, name: 'Sanat Eserleri - Müzik Aletleri - Heykel - Maket İhaleleri' }
]

const rawCategoriesRight = [
  { id: 21, name: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri' },
  { id: 22, name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri' },
  { id: 23, name: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri' },
  { id: 24, name: 'Odun - Kömür - Katıyakıt İhaleleri' },
  { id: 25, name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri' },
  { id: 26, name: 'Hazır Yemek - Lokantacılık İhaleleri' },
  { id: 27, name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar İhaleleri' },
  { id: 28, name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri' },
  { id: 29, name: 'Uydu Takip - Kamera - Scada - Haberleşme Sistemleri İhaleleri' },
  { id: 30, name: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri' },
  { id: 31, name: 'Kimyasal Maddeler - Dezenfektan - Gübre İhaleleri' },
  { id: 32, name: 'Tekstil - Giyim - Spor Ekipmanları İhaleleri' },
  { id: 33, name: 'İş Sağlığı - İş Güvenliği ve Ekipmanları İhaleleri' },
  { id: 34, name: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri' },
  { id: 35, name: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri' },
  { id: 36, name: 'Eğitim - Araştırma - Anket - Tercümanlık İhaleleri' },
  { id: 37, name: 'İşletmecilik - İşçilik - Sosyal Hizmetler İhaleleri' },
  { id: 38, name: 'Sigortacılık - Mali ve Hukuki Hizmetler İhaleleri' },
  { id: 39, name: 'Menkul Mallar - Araç Satışı ve Hurda İhaleleri' },
  { id: 40, name: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri' }
]

const categoriesLeft = computed(() => {
  return rawCategoriesLeft.map(c => ({
    ...c,
    count: getCategoryCount(c.name)
  }))
})

const categoriesRight = computed(() => {
  return rawCategoriesRight.map(c => ({
    ...c,
    count: getCategoryCount(c.name)
  }))
})

// ==================== 2. EK FİLTRE BLOKLARI (GÖRSEL 1 ALT KISIM) ====================
const rawIhaleKaynaklari = [
  { name: 'Ekap İhaleleri' },
  { name: 'Gazete İhaleleri' },
  { name: 'İstihbarat İhaleleri' }
]

const rawIhaleTurleri = [
  { name: 'Yapım İşi İhaleleri' },
  { name: 'Mal Alımı İhaleleri' },
  { name: 'Hizmet Alımı İhaleleri' },
  { name: 'Satış İhaleleri' },
  { name: 'Kiralama İhaleleri' }
]

const rawIhaleUsulleri = [
  { name: 'Açık İhale Usulü İhaleleri' },
  { name: 'Doğrudan Temin İhaleleri' },
  { name: 'Fiyat Araştırması İhaleleri' },
  { name: 'Belli İstekliler İhaleleri' },
  { name: 'Pazarlık Usulü İhaleleri' },
  { name: 'İstisna İhaleleri' }
]

const rawTeklifTurleri = [
  { name: 'E-İhale İhaleleri' },
  { name: 'Kısmi Teklif Verilebilir İhaleleri' },
  { name: 'Kısmi Teklif Verilemez İhaleleri' },
  { name: 'Birim Fiyat Usulü İhaleleri' },
  { name: 'Götürü Bedel Usulü İhaleleri' },
  { name: 'Sadece Yerli İstekliler İhaleleri' },
  { name: 'Yerli ve Yabancı İstekliler İhaleleri' }
]

const rawIcerikTurleri = [
  { name: 'Düzeltme İlanı' },
  { name: 'İptal İlanı' },
  { name: 'Zeyilname' }
]

const ihaleKaynaklari = computed(() => rawIhaleKaynaklari.map(item => ({ name: item.name, count: getFilterCount(item.name) })))
const ihaleTurleri = computed(() => rawIhaleTurleri.map(item => ({ name: item.name, count: getFilterCount(item.name) })))
const ihaleUsulleri = computed(() => rawIhaleUsulleri.map(item => ({ name: item.name, count: getFilterCount(item.name) })))
const teklifTurleri = computed(() => rawTeklifTurleri.map(item => ({ name: item.name, count: getFilterCount(item.name) })))
const icerikTurleri = computed(() => rawIcerikTurleri.map(item => ({ name: item.name, count: getFilterCount(item.name) })))

// ==================== 3. ŞEHİRLER LİSTESİ (GÖRSEL 2: 81 İL) ====================
const rawCityNamesCol1 = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce'
]

const rawCityNamesCol2 = [
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya'
]

const rawCityNamesCol3 = [
  'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

const cityListCol1 = computed(() => rawCityNamesCol1.map(name => ({ name, count: getCityCount(name) })))
const cityListCol2 = computed(() => rawCityNamesCol2.map(name => ({ name, count: getCityCount(name) })))
const cityListCol3 = computed(() => rawCityNamesCol3.map(name => ({ name, count: getCityCount(name) })))

// ==================== 4. SEKTÖRLER LİSTESİ (GÖRSEL 3: 38 CPV SEKTÖR) ====================
const sectorsLeft = [
  'Tarım, Çiftçilik, Balıkçılık, Ormancılık Ve İlgili Ürünler',
  'Madencilik, Temel Metaller Ve İlgili Ürünler',
  'Tarım Makineleri',
  'Deri Ve Tekstil Kumaşlar, Plastik Ve Kauçuk Malzemeler',
  'Kimyasal Ürünler',
  'Elektrikli Makine, Cihaz, Ekipman Ve Sarf Malzemeleri; Aydınlatma',
  'Tıbbi Cihazlar, İlaç Ve Kişisel Bakım Ürünleri',
  'Güvenlik, Yangınla Mücadele, Polis Ve Savunma Teçhizatı',
  'Laboratuar, Optik Ve Hassas Ekipmanları (Gözlük Hariç)',
  'Toplanmış Ve Arıtılmış Su',
  'Madencilik, Taşocakçılığı, İnşaat Ekipmanları İçin Kullanılan Makineler',
  'İnşaat İşleri',
  'Onarım Ve Bakım Hizmetleri',
  'Otel, Restoran Ve Perakende Ticaret Hizmetleri',
  'Destek Ve Yardımcı Ulaştırmacılık Hizmetleri; Seyahat Acentası Hizmetleri',
  'Kamu Yararına Hizmet Ve Tesisler',
  'Emlakçılık Hizmetleri',
  'IT Hizmetleri: Danışmanlık, Yazılım Geliştirme, İnternet Ve Destek',
  'Yönetim, Savunma Ve Sosyal Güvenlik Hizmetleri',
  'Tarım, Ormancılık, Bahçecilik, Su Ürünleri Yetiştiriciliği Ve Arıcılık Hizmetleri',
  'Eğitim Ve Öğrenim Hizmetleri',
  'Kanalizasyon, Çöp Temizlik Ve Çevre Hizmetleri',
  'Diğer Sosyal, Toplumsal Ve Kişisel Hizmetler'
]

const sectorsRight = [
  'Petrol Ürünleri, Yakıt, Elektrik Ve Diğer Enerji Kaynakları',
  'Gıda, İçecekler, Tütün Ve İlgili Ürünler',
  'Giyim, Ayakkabı, Bavul Eşyaları Ve Aksesuarlar',
  'Basılı Malzeme Ve İlgili Ürünler',
  'Mobilya Ve Yazılım Paketleri Hariç, Ofis Ve Bilgi İşlem Makineleri, Ekipman Ve Malzemeleri',
  'Radyo, Televizyon, İletişim, Telekomünikasyon Ve İlgili Ekipmanlar',
  'Nakliye Araçları Ve Nakliye İçin Yardımcı Ürünler',
  'Müzik Aletleri, Spor Ürünleri, Oyunlar, Oyuncaklar, El Sanatları, Sanat',
  'Mobilya (Ofis Mobilyaları Dahil) , Mefruşat, Ev Aletleri (Aydınlatma Hariç) Ve Temizlik Ürünleri',
  'Sanayi Tipi Makineler',
  'İnşaat Yapı Ve Malzemeleri; İnşaatlarda Kullanılan Yardımcı/Destek Ürünler',
  'Yazılım Paketi Ve Bilgi Sistemleri',
  'Kurulum Hizmetleri (Yazılım Hariç)',
  'Nakliye Hizmetleri (Atık Taşımacılığı Hariç)',
  'Posta Ve Telekomünikasyon Hizmetleri',
  'Finans Ve Sigorta Hizmetleri',
  'Mimarlık, İnşaat, Mühendislik Ve Teftiş Hizmetleri',
  'Araştırma Ve Geliştirme Hizmetleri Ve İlgili Danışmanlık Hizmetleri',
  'Petrol Ve Gaz Endüstrisi İle İlgili Hizmetler',
  'Ticari Hizmetler: Hukuk, Pazarlama, Danışmanlık, İşe Alma Ve İstihdam, Baskı Ve Güvenlik',
  'Sağlık Ve Sosyal Çalışma Hizmetleri',
  'Rekreasyon, Kültür Ve Spor Amaçlı Hizmetler'
]

// ==================== 5. YÜKLENİCİLER TABLOSU (GÖRSEL 4: YÜKLENİCİLER) ====================
const contractorsList = ref<any[]>([])

const filteredContractors = computed(() => {
  return contractorsList.value.filter(c => {
    if (contractorSearchName.value) {
      const q = contractorSearchName.value.toLocaleLowerCase('tr').trim()
      if (!c.name.toLocaleLowerCase('tr').includes(q)) return false
    }
    return true
  })
})

// ==================== 6. CANLI İHALE LİSTESİ ====================
const tenders = ref<any[]>([])

function handleSelectFilter(item: string) {
  navigateTo({
    path: '/pazar-yeri',
    query: { q: item }
  })
}
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans text-xs flex flex-col">

    <!-- ========================================================================= -->
    <!-- 🔵 4'LÜ KURUMSAL ANA MENÜ ŞERİDİ (KATEGORİLER, ŞEHİRLER, SEKTÖRLER, YÜKLENİCİLER) -->
    <!-- ========================================================================= -->
    <div class="bg-[#0F223D] border-b border-slate-800 text-white font-bold text-xs sticky top-[108px] z-40 shadow-sm">
      <div class="max-w-[1400px] mx-auto flex flex-wrap items-center">
        
        <!-- 1. KATEGORİLER -->
        <button 
          @click="activeSubMenu = 'kategoriler'" 
          :class="activeSubMenu === 'kategoriler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>📁 Kategoriler</span>
        </button>

        <!-- 2. ŞEHİRLER -->
        <button 
          @click="activeSubMenu = 'sehirler'" 
          :class="activeSubMenu === 'sehirler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏙️ Şehirler</span>
        </button>

        <!-- 3. SEKTÖRLER -->
        <button 
          @click="activeSubMenu = 'sektorler'" 
          :class="activeSubMenu === 'sektorler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏭 Sektörler</span>
        </button>

        <!-- 4. FİRMALAR -->
        <button 
          @click="activeSubMenu = 'firmalar'" 
          :class="activeSubMenu === 'firmalar' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏢 Firmalar</span>
        </button>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🔍 ORTAK GELİŞMİŞ ARAMA KONSOLU & SAYAÇLAR (KATEGORİLER & ŞEHİRLER İÇİN) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'kategoriler' || activeSubMenu === 'sehirler'" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-4">
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4">
        
        <!-- ÜST ZAMAN SEKMELERİ VE SAĞ ARAMA KUTUSU -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div class="flex items-center gap-1 text-xs font-bold">
            <button 
              @click="activeTimeTab = 'guncel'" 
              :class="activeTimeTab === 'guncel' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🕒 Güncel</span>
            </button>
            <button 
              @click="activeTimeTab = 'gecmis'" 
              :class="activeTimeTab === 'gecmis' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>📅 Geçmiş</span>
            </button>
            <button 
              @click="activeTimeTab = 'sonuc'" 
              :class="activeTimeTab === 'sonuc' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🎯 Sonuç</span>
            </button>
            <button 
              @click="activeTimeTab = 'detayli'" 
              :class="activeTimeTab === 'detayli' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🔍 Detaylı Ara</span>
            </button>
          </div>

          <div class="flex items-center gap-1 w-full md:w-auto">
            <input 
              v-model="filterKeyword" 
              type="text" 
              placeholder="Kelime ara..." 
              class="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 flex-1 md:w-60"
            />
            <select v-model="searchScope" class="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700">
              <option value="icerik">İçerik</option>
              <option value="baslik">Başlık</option>
              <option value="no">İhale No</option>
            </select>
            <button class="px-4 py-1.5 bg-[#0084B4] hover:bg-[#00739D] text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer">
              <Search :size="13" />
              <span>Ara</span>
            </button>
          </div>
        </div>

        <!-- 7'Lİ ARAMA DROPDOWN'LARI -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs text-slate-700">
          <div>
            <label class="font-bold block mb-1 text-slate-600">Kategori:</label>
            <select v-model="filterCategory" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="İnşaat">İnşaat</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Enerji">Enerji</option>
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">Şehir:</label>
            <select v-model="filterCity" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Çanakkale">Çanakkale</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale türü:</label>
            <select v-model="filterType" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Mal Alımı">Mal Alımı</option>
              <option value="Hizmet Alımı">Hizmet Alımı</option>
              <option value="Yapım İşi">Yapım İşi</option>
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale usulü:</label>
            <select v-model="filterMethod" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Açık İhale">Açık İhale</option>
              <option value="Doğrudan Temin">Doğrudan Temin</option>
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">Yaklaşık maliyet:</label>
            <select v-model="filterCost" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="1">0 - 500.000 ₺</option>
              <option value="2">500.000 ₺ - 5.000.000 ₺</option>
            </select>
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale içeriği:</label>
            <input v-model="filterKeyword" type="text" placeholder="Kelime ara" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs" />
          </div>
          <div>
            <label class="font-bold block mb-1 text-slate-600">Yayın tarihi:</label>
            <input v-model="filterStartDate" type="date" class="w-full p-1 bg-white border border-slate-300 rounded text-[11px]" />
          </div>
        </div>

        <!-- RADYO SEÇENEKLERİ -->
        <div class="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-3">
          <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="basit" v-model="viewMode" name="viewMode" class="accent-blue-600" />
              <span>Basit görünüm</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="gelismis" v-model="viewMode" name="viewMode" class="accent-blue-600" />
              <span>Gelişmiş görünüm</span>
            </label>
            <span class="text-slate-300">|</span>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="gizle" v-model="readMode" name="readMode" class="accent-blue-600" />
              <span>Okuduklarımı gizle</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="goster" v-model="readMode" name="readMode" class="accent-blue-600" />
              <span>Okuduklarımı göster</span>
            </label>
          </div>
          <button class="px-6 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Search :size="14" />
            <span>Ara 🔍</span>
          </button>
        </div>

      </div>

      <!-- 3'LÜ GÜNLÜK SAYAÇ KUTULARI -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2 mt-3">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-black text-xs border border-slate-300">
          ⚡ Günlük
        </span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-2.5 rounded border border-sky-300 bg-sky-50 flex items-center justify-between hover:bg-sky-100 transition cursor-pointer">
            <span class="font-bold text-sky-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-sky-700" />
              <span>Bugün yayınlananlar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-sky-300 text-sky-800 font-black text-xs font-mono">
              {{ todayPublishedCount }} İhale
            </span>
          </div>
          <div class="p-2.5 rounded border border-blue-300 bg-blue-50 flex items-center justify-between hover:bg-blue-100 transition cursor-pointer">
            <span class="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-blue-700" />
              <span>Bugün yapılacaklar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-blue-300 text-blue-800 font-black text-xs font-mono">
              {{ todayOngoingCount }} İhale
            </span>
          </div>
          <div class="p-2.5 rounded border border-emerald-300 bg-emerald-50 flex items-center justify-between hover:bg-emerald-100 transition cursor-pointer">
            <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-emerald-700" />
              <span>Bugün sonuçlananlar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-emerald-300 text-emerald-800 font-black text-xs font-mono">
              {{ todayFinishedCount }} İhale
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📁 SEKME 1: KATEGORİLER (GÖRSEL 1: 36 KATEGORİ + EK FİLTRE BLOKLARI) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'kategoriler'" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      
      <!-- 36 ANA KATEGORİ KUTUSU -->
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <Folder :size="14" class="text-[#0084B4]" />
            <span>Kategoriler</span>
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          <!-- Sol Sütun (18 Kategori) -->
          <div class="space-y-1.5">
            <div 
              v-for="cat in categoriesLeft" 
              :key="cat.id"
              class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-sky-50/60 flex items-center justify-between transition group"
            >
              <div @click="handleSelectFilter(cat.name)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <Folder :size="14" class="text-[#0084B4] shrink-0" />
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ cat.name }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px] text-slate-700 shadow-2xs">
                  {{ cat.count.toLocaleString('tr-TR') }} İhale
                </span>
                <select class="p-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 cursor-pointer">
                  <option>Günlük ⌄</option>
                  <option>Haftalık</option>
                  <option>Tümü</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Sağ Sütun (18 Kategori) -->
          <div class="space-y-1.5">
            <div 
              v-for="cat in categoriesRight" 
              :key="cat.id"
              class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-sky-50/60 flex items-center justify-between transition group"
            >
              <div @click="handleSelectFilter(cat.name)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <Folder :size="14" class="text-[#0084B4] shrink-0" />
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ cat.name }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px] text-slate-700 shadow-2xs">
                  {{ cat.count.toLocaleString('tr-TR') }} İhale
                </span>
                <select class="p-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 cursor-pointer">
                  <option>Günlük ⌄</option>
                  <option>Haftalık</option>
                  <option>Tümü</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. İHALE KAYNAKLARI -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          🏛️ İhale Kaynakları
        </span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div v-for="item in ihaleKaynaklari" :key="item.name" class="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-sky-50 cursor-pointer">
            <span class="font-bold text-slate-700">📁 {{ item.name }}</span>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ item.count }} İhale</span>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>Günlük ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. İHALE TÜRLERİ -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          ⚙️ İhale Türleri
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div v-for="item in ihaleTurleri" :key="item.name" class="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-sky-50 cursor-pointer">
            <span class="font-bold text-slate-700">📁 {{ item.name }}</span>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ item.count }} İhale</span>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>Günlük ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. İHALE USULLERİ -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          📜 İhale Usulleri
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div v-for="item in ihaleUsulleri" :key="item.name" class="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-sky-50 cursor-pointer">
            <span class="font-bold text-slate-700">📁 {{ item.name }}</span>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ item.count }} İhale</span>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>Günlük ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. TEKLİF TÜRLERİ -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          💼 Teklif Türleri
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div v-for="item in teklifTurleri" :key="item.name" class="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-sky-50 cursor-pointer">
            <span class="font-bold text-slate-700">📁 {{ item.name }}</span>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ item.count }} İhale</span>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>Günlük ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. İÇERİK TÜRLERİ -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          📑 İçerik Türleri
        </span>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div v-for="item in icerikTurleri" :key="item.name" class="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-sky-50 cursor-pointer">
            <span class="font-bold text-slate-700">📁 {{ item.name }}</span>
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ item.count }} İhale</span>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>Günlük ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 🏙️ SEKME 2: ŞEHİRLER (GÖRSEL 2: 81 İL 3 SÜTUNLU LİSTE) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'sehirler'" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <span>🇹🇷 Türkiye (81 İl)</span>
          </span>
          <span class="text-xs font-bold text-slate-500">Tüm Şehirler ve İlçeler İhale Takibi</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
          <!-- Sütun 1 -->
          <div class="space-y-1.5">
            <div v-for="c in cityListCol1" :key="c.name" class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition group">
              <div @click="handleSelectFilter(c.name)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <span class="text-[#0084B4] font-bold">🚩</span>
                <span class="font-bold text-slate-700 group-hover:text-blue-700">{{ c.name }} İhaleleri</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ c.count }} İhale</span>
                <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>İlçeler ⌄</option></select>
              </div>
            </div>
          </div>

          <!-- Sütun 2 -->
          <div class="space-y-1.5">
            <div v-for="c in cityListCol2" :key="c.name" class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition group">
              <div @click="handleSelectFilter(c.name)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <span class="text-[#0084B4] font-bold">🚩</span>
                <span class="font-bold text-slate-700 group-hover:text-blue-700">{{ c.name }} İhaleleri</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ c.count }} İhale</span>
                <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>İlçeler ⌄</option></select>
              </div>
            </div>
          </div>

          <!-- Sütun 3 -->
          <div class="space-y-1.5">
            <div v-for="c in cityListCol3" :key="c.name" class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition group">
              <div @click="handleSelectFilter(c.name)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <span class="text-[#0084B4] font-bold">🚩</span>
                <span class="font-bold text-slate-700 group-hover:text-blue-700">{{ c.name }} İhaleleri</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px]">{{ c.count }} İhale</span>
                <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px]"><option>İlçeler ⌄</option></select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏭 SEKME 3: SEKTÖRLER (GÖRSEL 3: 38 CPV SEKTÖRÜ VE ARAMA KONSOLU) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'sektorler'" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      
      <!-- Sektör Arama Konsolu -->
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
          🔍 Sektör Ara
        </span>

        <div class="max-w-md mx-auto space-y-2 text-xs">
          <div class="flex items-center gap-3">
            <label class="w-24 font-bold text-slate-600 text-right">Kategori:</label>
            <select v-model="sectorSearchCategory" class="flex-1 p-2 bg-white border border-slate-300 rounded">
              <option value="Tümü">Tümü</option>
              <option value="Tarım">Tarım & Ormancılık</option>
              <option value="İnşaat">İnşaat & Yapı</option>
              <option value="Sanayi">Sanayi & Makine</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="w-24 font-bold text-slate-600 text-right">Sektör adı:</label>
            <input v-model="sectorSearchName" type="text" placeholder="Kelime ara" class="flex-1 p-2 bg-white border border-slate-300 rounded" />
          </div>

          <div class="text-center pt-2">
            <button class="px-6 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-bold text-xs shadow-xs cursor-pointer">
              Ara 🔍
            </button>
          </div>
        </div>
      </div>

      <!-- Sektörler Tablosu (2 Sütunlu) -->
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2">
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            📁 Kategoriler / Sektörler
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          <!-- Sol Sütun -->
          <div class="space-y-1.5">
            <div v-for="sec in sectorsLeft" :key="sec" class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition group">
              <div @click="handleSelectFilter(sec)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <span class="text-[#0084B4] font-bold">↪️</span>
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ sec }}</span>
              </div>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px] shrink-0"><option>İhaleler ⌄</option></select>
            </div>
          </div>

          <!-- Sağ Sütun -->
          <div class="space-y-1.5">
            <div v-for="sec in sectorsRight" :key="sec" class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between transition group">
              <div @click="handleSelectFilter(sec)" class="flex items-center gap-2 flex-1 cursor-pointer pr-2">
                <span class="text-[#0084B4] font-bold">↪️</span>
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ sec }}</span>
              </div>
              <select class="p-0.5 rounded border border-slate-300 bg-white text-[10px] shrink-0"><option>İhaleler ⌄</option></select>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 🏢 SEKME 4: FİRMALAR (GÖRSEL 4: FİRMA LİSTESİ VE DİZİNİ) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'firmalar'" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      
      <!-- Firma Arama Konsolu -->
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            🔍 Firma Ara
          </span>
          <button @click="activeSubMenu = 'kategoriler'" class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300">
            ⬅ Geri Dön
          </button>
        </div>

        <div class="max-w-md mx-auto space-y-2 text-xs">
          <div class="flex items-center gap-3">
            <label class="w-24 font-bold text-slate-600 text-right">Kategori:</label>
            <select v-model="contractorSearchCategory" class="flex-1 p-2 bg-white border border-slate-300 rounded">
              <option value="Tümü">Tümü</option>
              <option value="İnşaat">İnşaat</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Sanayi & Makine">Sanayi & Makine</option>
              <option value="Lojistik">Lojistik</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="w-24 font-bold text-slate-600 text-right">Firma adı:</label>
            <input v-model="contractorSearchName" type="text" placeholder="Kelime ara" class="flex-1 p-2 bg-white border border-slate-300 rounded" />
          </div>

          <div class="text-center pt-2">
            <button class="px-6 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-bold text-xs shadow-xs cursor-pointer">
              Ara 🔍
            </button>
          </div>
        </div>

        <div class="flex justify-center gap-2 pt-2 border-t border-slate-200 text-xs">
          <button @click="contractorSearchName = ''" class="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 font-bold">✖ Sıfırla</button>
          <button class="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 font-bold">⇅ Sırala</button>
          <button class="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 font-bold">🔄 Yenile</button>
        </div>
      </div>

      <!-- Toplam Bulunan Sayacı & Sayfalama Üst -->
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-3">
        <div class="text-center font-bold text-slate-700 border-b border-slate-200 pb-2">
          📑 Toplam bulunan: <strong>{{ filteredContractors.length }} Onaylı Firma</strong>
        </div>

        <div v-if="filteredContractors.length > 0" class="flex items-center justify-center gap-2 text-xs">
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">⏮ İlk sayfa</button>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">‹ Önceki sayfa</button>
          <select v-model="contractorPage" class="p-1 rounded border border-slate-300 bg-white font-bold">
            <option :value="1">1. Sayfa</option>
            <option :value="2">2. Sayfa</option>
            <option :value="3">3. Sayfa</option>
          </select>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">Sonraki sayfa ›</button>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">Son sayfa ⏭</button>
        </div>

        <!-- Firmalar Tablosu -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700 border-y border-slate-300 font-black">
                <th class="py-2.5 px-3 w-8">#</th>
                <th class="py-2.5 px-3">Firma adı</th>
                <th class="py-2.5 px-3 text-center">Katıldığı ihaleler ⇅</th>
                <th class="py-2.5 px-3 text-center">Devam eden işler ⇅</th>
                <th class="py-2.5 px-3 text-center">Tamamlanan işler ⇅</th>
                <th class="py-2.5 px-3 text-center">Toplam sözleşme ⇅</th>
              </tr>
            </thead>
            <tbody v-if="filteredContractors.length > 0" class="divide-y divide-slate-200">
              <tr v-for="c in filteredContractors" :key="c.id" class="hover:bg-sky-50/50 transition">
                <td class="py-3 px-3 font-bold text-slate-500">{{ c.id }}</td>
                <td class="py-3 px-3 font-bold text-slate-800">
                  <NuxtLink to="/firmalar" class="hover:text-[#0084B4] hover:underline">
                    {{ c.name }}
                  </NuxtLink>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold block text-slate-700">{{ c.bidsCount }} İhale</span>
                  <NuxtLink to="/pazar-yeri" class="mt-1 inline-block px-2 py-0.5 rounded border border-sky-400 bg-sky-50 text-sky-800 text-[10px] font-bold">📊 Listele</NuxtLink>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold block text-slate-700">{{ c.activeCount }} İhale</span>
                  <NuxtLink to="/pazar-yeri" class="mt-1 inline-block px-2 py-0.5 rounded border border-blue-400 bg-blue-50 text-blue-800 text-[10px] font-bold">📊 Listele</NuxtLink>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold block text-slate-700">{{ c.completedCount }} İhale</span>
                  <NuxtLink to="/pazar-yeri?tab=sonuc" class="mt-1 inline-block px-2 py-0.5 rounded border border-emerald-400 bg-emerald-50 text-emerald-800 text-[10px] font-bold">📊 Listele</NuxtLink>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold block text-slate-400">***</span>
                  <NuxtLink to="/panel/istatistikler" class="mt-1 inline-block px-2 py-0.5 rounded border border-indigo-400 bg-indigo-50 text-indigo-800 text-[10px] font-bold">📈 Analiz</NuxtLink>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6" class="text-center py-10 text-slate-500 text-xs">
                  Sistemde henüz listelenen kayıtlı firma bulunmamaktadır.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sayfalama Alt -->
        <div class="flex items-center justify-center gap-2 text-xs pt-3 border-t border-slate-200">
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">⏮ İlk sayfa</button>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">‹ Önceki sayfa</button>
          <select v-model="contractorPage" class="p-1 rounded border border-slate-300 bg-white font-bold">
            <option :value="1">1. Sayfa</option>
            <option :value="2">2. Sayfa</option>
          </select>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">Sonraki sayfa ›</button>
          <button class="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 font-bold">Son sayfa ⏭</button>
        </div>
      </div>

    </div>

  </div>
</template>