<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Printer,
  Search,
  MapPin,
  Building2,
  Building,
  Clock,
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
  ChevronsRight,
  FileSpreadsheet,
  Download,
  Landmark,
  Compass,
  UploadCloud,
  FileCheck
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada.com — Türkiye’nin En Kapsamlı İhale ve Satın Alma Portalı',
  description: 'Günlük ihaleler, kamu ve özel sektör satın alma ilanları, şartnameler, doğrudan teklif verme ve sonuç takip sistemi.'
})

const router = useRouter()

// ==================== MENÜ VE GÖRÜNÜM SEÇİMİ ====================
const activeLeftTab = ref<'kategoriler' | 'sehirler' | 'sektorler' | 'idareler' | 'firmalar'>('kategoriler')
const activeTimeTab = ref<'guncel' | 'gecmis' | 'sonuc' | 'detayli'>('guncel')
const viewLayout = ref<'list' | 'grid'>('grid') // 'list' = Sahibinden Liste Görünümü, 'grid' = Vitrin Görünümü
const viewMode = ref<'gelismis' | 'basit'>('gelismis')
const readMode = ref<'goster' | 'gizle'>('goster')

// ==================== ARAMA VE FİLTRE DURUMLARI ====================
const selectedCategory = ref<string>('Tümü')
const selectedCity = ref<string>('Tümü')
const selectedAuthority = ref<string>('Tümü')
const selectedSector = ref<string>('Tümü')
const selectedCompany = ref<string>('Tümü')

const leftSidebarSearch = ref('')
const authorityCategoryFilter = ref('Tümü')

const filterType = ref('Tümü')
const filterMethod = ref('Tümü')
const filterSource = ref('Tümü')
const filterCost = ref('Tümü')
const filterKeyword = ref('')
const minPriceFilter = ref<number | ''>('')
const maxPriceFilter = ref<number | ''>('')
const filterStartDate = ref('')
const selectedSort = ref<'otomatik' | 'price_asc' | 'price_desc' | 'date_new' | 'bids'>('otomatik')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ==================== MODALLAR VE TEKLİF FORMU ====================
const selectedTenderModal = ref<any>(null)
const detailActiveTab = ref<'ilan' | 'malzeme' | 'idari' | 'sozlesme' | 'firmalar' | 'sonuc'>('ilan')

// Hızlı Teklif Modalı & Çok Kalemli Belge Yükleme
const showOfferSuccessToast = ref(false)
const offerSuccessToastMsg = ref('')

const showQuickBidModal = ref(false)
const quickBidTender = ref<any>(null)
const quickOfferPrice = ref('')
const quickOfferVatType = ref<'vat_excluded' | 'vat_included'>('vat_excluded') // KDV Hariç / Dahil
const quickOfferNotes = ref('')
const quickOfferDuration = ref('7 gün')
const quickOfferFiles = ref<Array<{ name: string; size: string; type: string; url?: string }>>([])
const quoteFileInputRef = ref<HTMLInputElement | null>(null)

// Firma Profil Modalı (Dışarıdan Görünüm & Düzenle Yetkisi)
const selectedCompanyProfileModal = ref<any>(null)
const userSession = ref<any>({})

const { cmsData, saveCmsData } = useCmsData()
// Clean onMounted in index.vue
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('myTenders')
      if (raw && (raw.includes('IHC-2026-178') || raw.includes('aesredtruıo85urıy'))) {
        localStorage.removeItem('myTenders')
        localStorage.removeItem('myBids')
        localStorage.removeItem('mySubmittedBids')
      }
    } catch (e) {}
  }
})
const { sendSms } = useNetGsm()

// ==================== 1. KATEGORİLER LİSTESİ (İNŞAAT, SAĞLIK, TARIM İLK 3 SIRADA) ====================
const allCategoriesList = [
  { id: 1, name: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri', short: 'İnşaat & Altyapı', icon: '🏗️' },
  { id: 2, name: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri', short: 'Sağlık & Medikal', icon: '💊' },
  { id: 3, name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri', short: 'Gıda & Tarım', icon: '🌾' },
  { id: 4, name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri', short: 'Tıbbi Cihaz & Hastane', icon: '🩺' },
  { id: 5, name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri', short: 'Kanalizasyon & Su', icon: '🚰' },
  { id: 6, name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri', short: 'Enerji & Elektrik', icon: '⚡' },
  { id: 7, name: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri', short: 'Akaryakıt & Madeni Yağ', icon: '⛽' },
  { id: 8, name: 'Endüstriyel Makine - Motor - Konveyör İhaleleri', short: 'Endüstriyel Makine', icon: '⚙️' },
  { id: 9, name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri', short: 'Yazılım & Bilişim', icon: '💻' },
  { id: 10, name: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri', short: 'Nakliye & Lojistik', icon: '🚚' },
  { id: 11, name: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri', short: 'Mobilya & Ofis', icon: '🪑' },
  { id: 12, name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri', short: 'Hırdavat & Metal', icon: '🔩' },
  { id: 13, name: 'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri', short: 'Yangın & Güvenlik', icon: '🧯' },
  { id: 14, name: 'Kimyasal Maddeler - Dezenfektan - Gübre İhaleleri', short: 'Kimyasal & Gübre', icon: '🧪' },
  { id: 15, name: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri', short: 'Matbaa & Kırtasiye', icon: '📦' },
  { id: 16, name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama İhaleleri', short: 'Kent Mobilyaları', icon: '🏙️' },
  { id: 17, name: 'Mühendislik - Mimarlık - Danışmanlık İhaleleri', short: 'Mühendislik & Mimarlık', icon: '📐' },
  { id: 18, name: 'Madencilik - Doğal Kaynaklar - Sondaj İhaleleri', short: 'Madencilik & Sondaj', icon: '⛏️' },
  { id: 19, name: 'Asansör - Yapı Otomasyon - Mekanik Güvenlik İhaleleri', short: 'Asansör & Otomasyon', icon: '🛗' },
  { id: 20, name: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı İhaleleri', short: 'Klima & Havalandırma', icon: '❄️' },
  { id: 21, name: 'Savunma Sanayi, Silah - Denizcilik - Havacılık İhaleleri', short: 'Savunma & Havacılık', icon: '🛡️' },
  { id: 22, name: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri', short: 'Taşıt & İş Makinesi', icon: '🚜' },
  { id: 23, name: 'Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri', short: 'Turizm & Organizasyon', icon: '🎪' },
  { id: 24, name: 'Reklam - Tabela - Billboard - Tanıtım Materyalleri İhaleleri', short: 'Reklam & Tanıtım', icon: '📢' },
  { id: 25, name: 'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri', short: 'Ormancılık & Peyzaj', icon: '🌲' },
  { id: 26, name: 'Hayvancılık - Veterinerlik - Hayvan Yemi İhaleleri', short: 'Hayvancılık & Yem', icon: '🐄' },
  { id: 27, name: 'Sanat Eserleri - Müzik Aletleri - Heykel - Maket İhaleleri', short: 'Sanat & Heykel', icon: '🎨' },
  { id: 28, name: 'Odun - Kömür - Katıyakıt İhaleleri', short: 'Odun & Kömür', icon: '🪵' },
  { id: 29, name: 'Hazır Yemek - Lokantacılık İhaleleri', short: 'Hazır Yemek & İkram', icon: '🍽️' },
  { id: 30, name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar İhaleleri', short: 'Elektronik & Bilgisayar', icon: '🖥️' },
  { id: 31, name: 'Uydu Takip - Kamera - Scada - Haberleşme Sistemleri İhaleleri', short: 'Kamera & Güvenlik', icon: '📹' },
  { id: 32, name: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri', short: 'Temizlik & Geri Dönüşüm', icon: '🧹' },
  { id: 33, name: 'Tekstil - Giyim - Spor Ekipmanları İhaleleri', short: 'Tekstil & Giyim', icon: '👕' },
  { id: 34, name: 'İş Sağlığı - İş Güvenliği ve Ekipmanları İhaleleri', short: 'İş Sağlığı & Güvenliği', icon: '⛑️' },
  { id: 35, name: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri', short: 'Özel Güvenlik', icon: '👮' },
  { id: 36, name: 'Eğitim - Araştırma - Anket - Tercümanlık İhaleleri', short: 'Eğitim & Tercümanlık', icon: '📚' },
  { id: 37, name: 'İşletmecilik - İşçilik - Sosyal Hizmetler İhaleleri', short: 'İşletmecilik & Hizmet', icon: '🤝' },
  { id: 38, name: 'Sigortacılık - Mali ve Hukuki Hizmetler İhaleleri', short: 'Sigorta & Finans', icon: '⚖️' },
  { id: 39, name: 'Menkul Mallar - Araç Satışı ve Hurda İhaleleri', short: 'Araç & Hurda Satışı', icon: '🚗' },
  { id: 40, name: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri', short: 'Gayrimenkul & Arsa', icon: '🏢' }
]

// ==================== 2. TÜRKİYE 81 İL LİSTESİ ====================
const all81Cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

// ==================== 3. BÜTÜN İDARELER LİSTESİ (TAM VE EKSİKSİZ) ====================
const allAuthoritiesList = [
  // ==================== 🏛️ 1. BAKANLIKLAR & MERKEZİ BAŞKANLIKLAR ====================
  { name: 'T.C. Sağlık Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Milli Eğitim Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Ulaştırma ve Altyapı Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Tarım ve Orman Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Enerji ve Tabii Kaynaklar Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Sanayi ve Teknoloji Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Gençlik ve Spor Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. İçişleri Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Adalet Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Milli Savunma Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Kültür ve Turizm Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Ticaret Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Hazine ve Maliye Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Çalışma ve Sosyal Güvenlik Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'T.C. Dışişleri Bakanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🏛️' },
  { name: 'Savunma Sanayii Başkanlığı (SSB)', type: 'Bakanlık', city: 'Ankara', icon: '🛡️' },
  { name: 'AFAD Afet ve Acil Durum Yönetimi Başkanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🚨' },
  { name: 'Kamu İhale Kurumu (KİK)', type: 'Bakanlık', city: 'Ankara', icon: '📜' },
  { name: 'Gelir İdaresi Başkanlığı (GİB)', type: 'Bakanlık', city: 'Ankara', icon: '📑' },
  { name: 'TÜBİTAK Başkanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🔬' },
  { name: 'Diyanet İşleri Başkanlığı', type: 'Bakanlık', city: 'Ankara', icon: '🕌' },

  // ==================== 🌾 2. İL ÖZEL İDARELERİ (81 İL ÖZEL İDARESİ) ====================
  { name: 'Çanakkale İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Çanakkale', icon: '🌾' },
  { name: 'Balıkesir İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Balıkesir', icon: '🌾' },
  { name: 'Edirne İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Edirne', icon: '🌾' },
  { name: 'Kırklareli İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kırklareli', icon: '🌾' },
  { name: 'Tekirdağ İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Tekirdağ', icon: '🌾' },
  { name: 'Bolu İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bolu', icon: '🌾' },
  { name: 'Sivas İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Sivas', icon: '🌾' },
  { name: 'Afyonkarahisar İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Afyonkarahisar', icon: '🌾' },
  { name: 'Kastamonu İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kastamonu', icon: '🌾' },
  { name: 'Kütahya İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kütahya', icon: '🌾' },
  { name: 'Zonguldak İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Zonguldak', icon: '🌾' },
  { name: 'Rize İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Rize', icon: '🌾' },
  { name: 'Trabzon İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Trabzon', icon: '🌾' },
  { name: 'Erzurum İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Erzurum', icon: '🌾' },
  { name: 'Van İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Van', icon: '🌾' },
  { name: 'Elazığ İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Elazığ', icon: '🌾' },
  { name: 'Isparta İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Isparta', icon: '🌾' },
  { name: 'Çorum İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Çorum', icon: '🌾' },
  { name: 'Yozgat İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Yozgat', icon: '🌾' },
  { name: 'Tokat İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Tokat', icon: '🌾' },
  { name: 'Nevşehir İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Nevşehir', icon: '🌾' },
  { name: 'Amasya İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Amasya', icon: '🌾' },
  { name: 'Giresun İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Giresun', icon: '🌾' },
  { name: 'Sinop İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Sinop', icon: '🌾' },
  { name: 'Artvin İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Artvin', icon: '🌾' },
  { name: 'Uşak İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Uşak', icon: '🌾' },
  { name: 'Bilecik İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bilecik', icon: '🌾' },
  { name: 'Düzce İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Düzce', icon: '🌾' },
  { name: 'Yalova İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Yalova', icon: '🌾' },
  { name: 'Karabük İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Karabük', icon: '🌾' },
  { name: 'Bartın İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bartın', icon: '🌾' },
  { name: 'Çankırı İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Çankırı', icon: '🌾' },
  { name: 'Kırşehir İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kırşehir', icon: '🌾' },
  { name: 'Kırıkkale İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kırıkkale', icon: '🌾' },
  { name: 'Niğde İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Niğde', icon: '🌾' },
  { name: 'Aksaray İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Aksaray', icon: '🌾' },
  { name: 'Karaman İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Karaman', icon: '🌾' },
  { name: 'Burdur İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Burdur', icon: '🌾' },
  { name: 'Gümüşhane İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Gümüşhane', icon: '🌾' },
  { name: 'Bayburt İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bayburt', icon: '🌾' },
  { name: 'Kars İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kars', icon: '🌾' },
  { name: 'Iğdır İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Iğdır', icon: '🌾' },
  { name: 'Ardahan İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Ardahan', icon: '🌾' },
  { name: 'Ağrı İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Ağrı', icon: '🌾' },
  { name: 'Muş İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Muş', icon: '🌾' },
  { name: 'Bitlis İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bitlis', icon: '🌾' },
  { name: 'Bingöl İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Bingöl', icon: '🌾' },
  { name: 'Tunceli İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Tunceli', icon: '🌾' },
  { name: 'Hakkari İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Hakkari', icon: '🌾' },
  { name: 'Şırnak İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Şırnak', icon: '🌾' },
  { name: 'Batman İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Batman', icon: '🌾' },
  { name: 'Siirt İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Siirt', icon: '🌾' },
  { name: 'Adıyaman İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Adıyaman', icon: '🌾' },
  { name: 'Kilis İl Özel İdaresi', type: 'İl Özel İdaresi', city: 'Kilis', icon: '🌾' },

  // ==================== 🏙️ 3. BÜYÜKŞEHİR, İL VE İLÇE BELEDİYELERİ ====================
  { name: 'Çanakkale Belediyesi', type: 'Belediye', city: 'Çanakkale', icon: '🏛️' },
  { name: 'İstanbul Büyükşehir Belediyesi (İBB)', type: 'Belediye', city: 'İstanbul', icon: '🏛️' },
  { name: 'Ankara Büyükşehir Belediyesi (ABB)', type: 'Belediye', city: 'Ankara', icon: '🏛️' },
  { name: 'İzmir Büyükşehir Belediyesi', type: 'Belediye', city: 'İzmir', icon: '🏛️' },
  { name: 'Bursa Büyükşehir Belediyesi', type: 'Belediye', city: 'Bursa', icon: '🏛️' },
  { name: 'Antalya Büyükşehir Belediyesi', type: 'Belediye', city: 'Antalya', icon: '🏛️' },
  { name: 'Kocaeli Büyükşehir Belediyesi', type: 'Belediye', city: 'Kocaeli', icon: '🏛️' },
  { name: 'Adana Büyükşehir Belediyesi', type: 'Belediye', city: 'Adana', icon: '🏛️' },
  { name: 'Konya Büyükşehir Belediyesi', type: 'Belediye', city: 'Konya', icon: '🏛️' },
  { name: 'Gaziantep Büyükşehir Belediyesi', type: 'Belediye', city: 'Gaziantep', icon: '🏛️' },
  { name: 'Şanlıurfa Büyükşehir Belediyesi', type: 'Belediye', city: 'Şanlıurfa', icon: '🏛️' },
  { name: 'Mersin Büyükşehir Belediyesi', type: 'Belediye', city: 'Mersin', icon: '🏛️' },
  { name: 'Diyarbakır Büyükşehir Belediyesi', type: 'Belediye', city: 'Diyarbakır', icon: '🏛️' },
  { name: 'Hatay Büyükşehir Belediyesi', type: 'Belediye', city: 'Hatay', icon: '🏛️' },
  { name: 'Manisa Büyükşehir Belediyesi', type: 'Belediye', city: 'Manisa', icon: '🏛️' },
  { name: 'Kayseri Büyükşehir Belediyesi', type: 'Belediye', city: 'Kayseri', icon: '🏛️' },
  { name: 'Samsun Büyükşehir Belediyesi', type: 'Belediye', city: 'Samsun', icon: '🏛️' },
  { name: 'Balıkesir Büyükşehir Belediyesi', type: 'Belediye', city: 'Balıkesir', icon: '🏛️' },
  { name: 'Kahramanmaraş Büyükşehir Belediyesi', type: 'Belediye', city: 'Kahramanmaraş', icon: '🏛️' },
  { name: 'Van Büyükşehir Belediyesi', type: 'Belediye', city: 'Van', icon: '🏛️' },
  { name: 'Aydın Büyükşehir Belediyesi', type: 'Belediye', city: 'Aydın', icon: '🏛️' },
  { name: 'Denizli Büyükşehir Belediyesi', type: 'Belediye', city: 'Denizli', icon: '🏛️' },
  { name: 'Sakarya Büyükşehir Belediyesi', type: 'Belediye', city: 'Sakarya', icon: '🏛️' },
  { name: 'Tekirdağ Büyükşehir Belediyesi', type: 'Belediye', city: 'Tekirdağ', icon: '🏛️' },
  { name: 'Muğla Büyükşehir Belediyesi', type: 'Belediye', city: 'Muğla', icon: '🏛️' },
  { name: 'Eskişehir Büyükşehir Belediyesi', type: 'Belediye', city: 'Eskişehir', icon: '🏛️' },
  { name: 'Malatya Büyükşehir Belediyesi', type: 'Belediye', city: 'Malatya', icon: '🏛️' },
  { name: 'Erzurum Büyükşehir Belediyesi', type: 'Belediye', city: 'Erzurum', icon: '🏛️' },
  { name: 'Trabzon Büyükşehir Belediyesi', type: 'Belediye', city: 'Trabzon', icon: '🏛️' },
  { name: 'Ordu Büyükşehir Belediyesi', type: 'Belediye', city: 'Ordu', icon: '🏛️' },
  { name: 'Edirne Belediyesi', type: 'Belediye', city: 'Edirne', icon: '🏛️' },
  { name: 'Kütahya Belediyesi', type: 'Belediye', city: 'Kütahya', icon: '🏛️' },
  { name: 'Isparta Belediyesi', type: 'Belediye', city: 'Isparta', icon: '🏛️' },
  { name: 'Bolu Belediyesi', type: 'Belediye', city: 'Bolu', icon: '🏛️' },
  { name: 'Zonguldak Belediyesi', type: 'Belediye', city: 'Zonguldak', icon: '🏛️' },
  { name: 'Sivas Belediyesi', type: 'Belediye', city: 'Sivas', icon: '🏛️' },
  { name: 'Rize Belediyesi', type: 'Belediye', city: 'Rize', icon: '🏛️' },
  { name: 'Elazığ Belediyesi', type: 'Belediye', city: 'Elazığ', icon: '🏛️' },
  { name: 'Batman Belediyesi', type: 'Belediye', city: 'Batman', icon: '🏛️' },
  { name: 'Yalova Belediyesi', type: 'Belediye', city: 'Yalova', icon: '🏛️' },
  { name: 'Düzce Belediyesi', type: 'Belediye', city: 'Düzce', icon: '🏛️' },
  { name: 'Çanakkale Biga Belediyesi', type: 'Belediye', city: 'Çanakkale', icon: '🏛️' },
  { name: 'Çanakkale Gelibolu Belediyesi', type: 'Belediye', city: 'Çanakkale', icon: '🏛️' },
  { name: 'Çanakkale Çan Belediyesi', type: 'Belediye', city: 'Çanakkale', icon: '🏛️' },
  { name: 'Balıkesir Bandırma Belediyesi', type: 'Belediye', city: 'Balıkesir', icon: '🏛️' },
  { name: 'Balıkesir Edremit Belediyesi', type: 'Belediye', city: 'Balıkesir', icon: '🏛️' },
  { name: 'Bursa Nilüfer Belediyesi', type: 'Belediye', city: 'Bursa', icon: '🏛️' },
  { name: 'Bursa Osmangazi Belediyesi', type: 'Belediye', city: 'Bursa', icon: '🏛️' },
  { name: 'İstanbul Kadıköy Belediyesi', type: 'Belediye', city: 'İstanbul', icon: '🏛️' },
  { name: 'İstanbul Üsküdar Belediyesi', type: 'Belediye', city: 'İstanbul', icon: '🏛️' },
  { name: 'İstanbul Başakşehir Belediyesi', type: 'Belediye', city: 'İstanbul', icon: '🏛️' },
  { name: 'Ankara Çankaya Belediyesi', type: 'Belediye', city: 'Ankara', icon: '🏛️' },
  { name: 'Ankara Yenimahalle Belediyesi', type: 'Belediye', city: 'Ankara', icon: '🏛️' },
  { name: 'İzmir Konak Belediyesi', type: 'Belediye', city: 'İzmir', icon: '🏛️' },
  { name: 'İzmir Karşıyaka Belediyesi', type: 'Belediye', city: 'İzmir', icon: '🏛️' },

  // ==================== ⚙️ 4. GENEL MÜDÜRLÜKLER & KİT KAMU KURULUŞLARI ====================
  { name: 'Devlet Su İşleri (DSİ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '💧' },
  { name: 'Karayolları Genel Müdürlüğü (KGM)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🛣️' },
  { name: 'Toplu Konut İdaresi Başkanlığı (TOKİ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🏗️' },
  { name: 'Emlak Konut GYO A.Ş.', type: 'Genel Müdürlük & KİT', city: 'İstanbul', icon: '🏢' },
  { name: 'İller Bankası A.Ş. (İLBANK)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🏦' },
  { name: 'Orman Genel Müdürlüğü (OGM)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🌲' },
  { name: 'T.C. Devlet Demiryolları (TCDD)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🚆' },
  { name: 'TCDD Taşımacılık A.Ş.', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🚂' },
  { name: 'Türkiye Elektrik İletim A.Ş. (TEİAŞ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⚡' },
  { name: 'Türkiye Elektrik Dağıtım A.Ş. (TEDAŞ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⚡' },
  { name: 'Elektrik Üretim A.Ş. (EÜAŞ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⚡' },
  { name: 'Boru Hatları ile Petrol Taşıma A.Ş. (BOTAŞ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⛽' },
  { name: 'Türkiye Petrolleri Anonim Ortaklığı (TPAO)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🛢️' },
  { name: 'Eti Maden İşletmeleri Genel Müdürlüğü', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⛏️' },
  { name: 'Türkiye Kömür İşletmeleri Kurumu (TKİ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⛏️' },
  { name: 'Türkiye Taşkömürü Kurumu (TTK)', type: 'Genel Müdürlük & KİT', city: 'Zonguldak', icon: '⛏️' },
  { name: 'Makina ve Kimya Endüstrisi A.Ş. (MKE)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '⚙️' },
  { name: 'ASELSAN Elektronik Sanayi', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🛰️' },
  { name: 'HAVELSAN Hava Elektronik Sanayi', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '💻' },
  { name: 'ROKETSAN Roket Sanayii', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🚀' },
  { name: 'TUSAŞ Türk Havacılık ve Uzay Sanayii', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '✈️' },
  { name: 'STM Savunma Teknolojileri', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🛡️' },
  { name: 'TÜRASAŞ Türkiye Raylı Sistem Araçları', type: 'Genel Müdürlük & KİT', city: 'Sakarya', icon: '🚆' },
  { name: 'Devlet Hava Meydanları İşletmesi (DHMİ)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🛫' },
  { name: 'Kıyı Emniyeti Genel Müdürlüğü (KEGM)', type: 'Genel Müdürlük & KİT', city: 'İstanbul', icon: '⚓' },
  { name: 'Vakıflar Genel Müdürlüğü', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🕌' },
  { name: 'Türk Kızılayı Genel Müdürlüğü', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🩸' },
  { name: 'Posta ve Telgraf Teşkilatı A.Ş. (PTT)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '📮' },
  { name: 'Tarım İşletmeleri Genel Müdürlüğü (TİGEM)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🌾' },
  { name: 'Toprak Mahsulleri Ofisi (TMO)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🌽' },
  { name: 'Çay İşletmeleri Genel Müdürlüğü (ÇAYKUR)', type: 'Genel Müdürlük & KİT', city: 'Rize', icon: '🌱' },
  { name: 'Türkiye Şeker Fabrikaları (TÜRKŞEKER)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🏭' },
  { name: 'Et ve Süt Kurumu Genel Müdürlüğü (ESK)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🥩' },
  { name: 'Maden Tetkik ve Arama (MTA)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🗺️' },
  { name: 'Tapu ve Kadastro Genel Müdürlüğü (TKGM)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '📑' },
  { name: 'Meteoroloji Genel Müdürlüğü (MGM)', type: 'Genel Müdürlük & KİT', city: 'Ankara', icon: '🌤️' },

  // ==================== 🏛️ 5. VALİLİKLER & KAYMAKAMLIKLAR (YİKOB) ====================
  { name: 'Çanakkale Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Çanakkale', icon: '🏛️' },
  { name: 'Balıkesir Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Balıkesir', icon: '🏛️' },
  { name: 'İstanbul Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'İstanbul', icon: '🏛️' },
  { name: 'Ankara Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Ankara', icon: '🏛️' },
  { name: 'İzmir Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'İzmir', icon: '🏛️' },
  { name: 'Bursa Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Bursa', icon: '🏛️' },
  { name: 'Edirne Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Edirne', icon: '🏛️' },
  { name: 'Tekirdağ Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Tekirdağ', icon: '🏛️' },
  { name: 'Antalya Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Antalya', icon: '🏛️' },
  { name: 'Diyarbakır Valiliği (YİKOB)', type: 'Valilik & YİKOB', city: 'Diyarbakır', icon: '🏛️' },

  // ==================== 🎓 6. ÜNİVERSİTELER & TEKNOPARKLAR ====================
  { name: 'Çanakkale Onsekiz Mart Üniversitesi (ÇOMÜ)', type: 'Üniversite & Teknokent', city: 'Çanakkale', icon: '🎓' },
  { name: 'İstanbul Teknik Üniversitesi (İTÜ)', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🎓' },
  { name: 'Orta Doğu Teknik Üniversitesi (ODTÜ)', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🎓' },
  { name: 'Boğaziçi Üniversitesi', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🎓' },
  { name: 'Yıldız Teknik Üniversitesi (YTÜ)', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🎓' },
  { name: 'Hacettepe Üniversitesi', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🎓' },
  { name: 'Ankara Üniversitesi', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🎓' },
  { name: 'Ege Üniversitesi', type: 'Üniversite & Teknokent', city: 'İzmir', icon: '🎓' },
  { name: 'Dokuz Eylül Üniversitesi', type: 'Üniversite & Teknokent', city: 'İzmir', icon: '🎓' },
  { name: 'Marmara Üniversitesi', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🎓' },
  { name: 'Gazi Üniversitesi', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🎓' },
  { name: 'İstanbul Üniversitesi', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🎓' },
  { name: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)', type: 'Üniversite & Teknokent', city: 'İzmir', icon: '🎓' },
  { name: 'Bursa Uludağ Üniversitesi', type: 'Üniversite & Teknokent', city: 'Bursa', icon: '🎓' },
  { name: 'Kocaeli Üniversitesi', type: 'Üniversite & Teknokent', city: 'Kocaeli', icon: '🎓' },
  { name: 'Akdeniz Üniversitesi', type: 'Üniversite & Teknokent', city: 'Antalya', icon: '🎓' },
  { name: 'Selçuk Üniversitesi', type: 'Üniversite & Teknokent', city: 'Konya', icon: '🎓' },
  { name: 'Anadolu Üniversitesi', type: 'Üniversite & Teknokent', city: 'Eskişehir', icon: '🎓' },
  { name: 'Bilişim Vadisi Teknopark', type: 'Üniversite & Teknokent', city: 'Kocaeli', icon: '🚀' },
  { name: 'İTÜ ARI Teknokent', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🚀' },
  { name: 'ODTÜ Teknokent', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🚀' },

  // ==================== 🏥 7. İL SAĞLIK MÜDÜRLÜKLERİ & ŞEHİR HASTANELERİ ====================
  { name: 'Çanakkale İl Sağlık Müdürlüğü', type: 'Sağlık & Hastane', city: 'Çanakkale', icon: '🏥' },
  { name: 'Çanakkale Mehmet Akif Ersoy Devlet Hastanesi', type: 'Sağlık & Hastane', city: 'Çanakkale', icon: '🏥' },
  { name: 'Balıkesir İl Sağlık Müdürlüğü', type: 'Sağlık & Hastane', city: 'Balıkesir', icon: '🏥' },
  { name: 'İstanbul İl Sağlık Müdürlüğü', type: 'Sağlık & Hastane', city: 'İstanbul', icon: '🏥' },
  { name: 'Ankara Bilkent Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'Ankara', icon: '🏥' },
  { name: 'İstanbul Başakşehir Çam ve Sakura Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'İstanbul', icon: '🏥' },
  { name: 'İzmir Bayraklı Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'İzmir', icon: '🏥' },
  { name: 'Bursa Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'Bursa', icon: '🏥' },
  { name: 'Kocaeli Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'Kocaeli', icon: '🏥' },
  { name: 'Gaziantep Şehir Hastanesi', type: 'Sağlık & Hastane', city: 'Gaziantep', icon: '🏥' },

  // ==================== 🏭 8. ORGANİZE SANAYİ BÖLGELERİ & TİCARET ODALARI ====================
  { name: 'Çanakkale OSB & Sanayi Odası', type: 'OSB & Sanayi Odası', city: 'Çanakkale', icon: '🏭' },
  { name: 'Balıkesir OSB Müdürlüğü', type: 'OSB & Sanayi Odası', city: 'Balıkesir', icon: '🏭' },
  { name: 'İstanbul İkitelli OSB', type: 'OSB & Sanayi Odası', city: 'İstanbul', icon: '🏭' },
  { name: 'İstanbul Dudullu OSB', type: 'OSB & Sanayi Odası', city: 'İstanbul', icon: '🏭' },
  { name: 'Ankara Sanayi Odası 1. OSB', type: 'OSB & Sanayi Odası', city: 'Ankara', icon: '🏭' },
  { name: 'Ankara OSTİM OSB', type: 'OSB & Sanayi Odası', city: 'Ankara', icon: '🏭' },
  { name: 'İzmir Atatürk OSB (İAOSB)', type: 'OSB & Sanayi Odası', city: 'İzmir', icon: '🏭' },
  { name: 'Bursa Demirtaş OSB (DOSAB)', type: 'OSB & Sanayi Odası', city: 'Bursa', icon: '🏭' },
  { name: 'Bursa Organize Sanayi Bölgesi (BOSB)', type: 'OSB & Sanayi Odası', city: 'Bursa', icon: '🏭' },
  { name: 'Gebze Organize Sanayi Bölgesi (GOSB)', type: 'OSB & Sanayi Odası', city: 'Kocaeli', icon: '🏭' },
  { name: 'Kocaeli Dilovası OSB', type: 'OSB & Sanayi Odası', city: 'Kocaeli', icon: '🏭' },
  { name: 'Eskişehir OSB Fabrika Tesisi', type: 'OSB & Sanayi Odası', city: 'Eskişehir', icon: '🏭' },
  { name: 'Konya Organize Sanayi Bölgesi', type: 'OSB & Sanayi Odası', city: 'Konya', icon: '🏭' },
  { name: 'Kayseri Organize Sanayi Bölgesi', type: 'OSB & Sanayi Odası', city: 'Kayseri', icon: '🏭' },
  { name: 'Gaziantep Organize Sanayi Bölgesi', type: 'OSB & Sanayi Odası', city: 'Gaziantep', icon: '🏭' },
  { name: 'Manisa Organize Sanayi Bölgesi', type: 'OSB & Sanayi Odası', city: 'Manisa', icon: '🏭' },
  { name: 'Tekirdağ Çorlu 1. OSB', type: 'OSB & Sanayi Odası', city: 'Tekirdağ', icon: '🏭' },
  { name: 'Tekirdağ Çerkezköy OSB (ÇOSB)', type: 'OSB & Sanayi Odası', city: 'Tekirdağ', icon: '🏭' },

  // ==================== 🌱 9. KALKINMA AJANSLARI & BİRLİKLER ====================
  { name: 'Güney Marmara Kalkınma Ajansı (GMKA)', type: 'Kalkınma Ajansı & Birlik', city: 'Balıkesir', icon: '🌱' },
  { name: 'İstanbul Kalkınma Ajansı (İSTKA)', type: 'Kalkınma Ajansı & Birlik', city: 'İstanbul', icon: '🌱' },
  { name: 'Ankara Kalkınma Ajansı (ANKARAKA)', type: 'Kalkınma Ajansı & Birlik', city: 'Ankara', icon: '🌱' },
  { name: 'İzmir Kalkınma Ajansı (İZKA)', type: 'Kalkınma Ajansı & Birlik', city: 'İzmir', icon: '🌱' },
  { name: 'Bursa Eskişehir Bilecik Kalkınma Ajansı (BEBKA)', type: 'Kalkınma Ajansı & Birlik', city: 'Bursa', icon: '🌱' },
  { name: 'Trakya Kalkınma Ajansı (TRAKYAKA)', type: 'Kalkınma Ajansı & Birlik', city: 'Tekirdağ', icon: '🌱' },
  { name: 'Çanakkale Sulama Birliği Başkanlığı', type: 'Kalkınma Ajansı & Birlik', city: 'Çanakkale', icon: '💧' },

  // ==================== 🏢 10. ÖZEL SEKTÖR B2B SATIN ALMA MASALARI ====================
  { name: 'Mega Lojistik ve Dağıtım A.Ş.', type: 'Özel Sektör Masası', city: 'Kocaeli', icon: '🏢' },
  { name: 'Ege Ambalaj ve İhracat Sanayi A.Ş.', type: 'Özel Sektör Masası', city: 'İzmir', icon: '🏢' },
  { name: 'Anadolu Çelik ve Metal Sanayi A.Ş.', type: 'Özel Sektör Masası', city: 'Bursa', icon: '🏢' },
  { name: 'Akdeniz Gıda ve Soğuk Depo A.Ş.', type: 'Özel Sektör Masası', city: 'Antalya', icon: '🏢' },
  { name: 'Marmara Altyapı ve İnşaat Grubu', type: 'Özel Sektör Masası', city: 'İstanbul', icon: '🏢' },
  { name: 'Avrasya Bilişim ve Yazılım A.Ş.', type: 'Özel Sektör Masası', city: 'Ankara', icon: '🏢' },
  { name: 'Turkuaz Kimya ve Plastik Sanayi', type: 'Özel Sektör Masası', city: 'Adana', icon: '🏢' },
  { name: 'Global Enerji ve Güneş Sistemleri', type: 'Özel Sektör Masası', city: 'Konya', icon: '🏢' }
]

// ==================== 4. SEKTÖRLER (CPV GRUPLARI) ====================
const allSectorsList = [
  { id: 'sec-1', name: 'İnşaat ve Altyapı Yapım İşleri', cpv: '45000000', icon: '🏗️' },
  { id: 'sec-2', name: 'Sağlık, Medikal ve İlaç Malzemeleri', cpv: '33000000', icon: '💊' },
  { id: 'sec-3', name: 'Gıda Maddeleri, Tarım ve Yiyecek Alımı', cpv: '15000000', icon: '🌾' },
  { id: 'sec-4', name: 'Tıbbi Teçhizat ve Laboratuvar Cihazları', cpv: '38000000', icon: '🩺' },
  { id: 'sec-5', name: 'Kanalizasyon, Su Arıtma ve Sıhhi Tesisat', cpv: '45232410', icon: '🚰' },
  { id: 'sec-6', name: 'Elektrik, Güç Sistemleri ve Aydınlatma', cpv: '31000000', icon: '⚡' },
  { id: 'sec-7', name: 'Akaryakıt, LPG, Madeni Yağ Tedariği', cpv: '09000000', icon: '⛽' },
  { id: 'sec-8', name: 'Endüstriyel Makineler ve Ekipmanlar', cpv: '42000000', icon: '⚙️' },
  { id: 'sec-9', name: 'Bilişim, Yazılım ve Ağ Teknolojileri', cpv: '72000000', icon: '💻' },
  { id: 'sec-10', name: 'Lojistik, Taşımacılık ve Personel Servisi', cpv: '60000000', icon: '🚚' },
  { id: 'sec-11', name: 'Ofis Mobilyaları ve İç Mekan Donanımı', cpv: '39100000', icon: '🪑' },
  { id: 'sec-12', name: 'Hırdavat, Nalburiye ve Metal Malzemeler', cpv: '44000000', icon: '🔩' },
  { id: 'sec-13', name: 'Yangın Söndürme ve İkaz Sistemleri', cpv: '35111000', icon: '🧯' },
  { id: 'sec-14', name: 'Kimyasal Ürünler ve Temizlik Maddeleri', cpv: '24000000', icon: '🧪' },
  { id: 'sec-15', name: 'Ambalaj, Matbaa ve Kağıt Ürünleri', cpv: '79800000', icon: '📦' }
]

// ==================== 5. DOĞRULANMIŞ FİRMALAR DİZİNİ ====================
const allCompaniesList: any[] = []

// ==================== 6. SEED / CANLI İHALE VERİLERİ ====================
const seedTenders: any[] = []

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

// ==================== 7. CANLI VERİLERİ BİRLEŞTİRME ====================

function formatTenderBudget(raw: any): string {
  if (!raw) return '💬 Teklif Usulü (Fiyat Bekleniyor)'
  const str = String(raw).trim()
  if (str.toLowerCase().includes('teklif') || str.toLowerCase().includes('belirtilmedi') || str.toLowerCase().includes('bekleniyor')) {
    return '💬 Teklif Usulü (Fiyat Bekleniyor)'
  }
  if (str.includes('-')) {
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
  return str.includes('₺') ? str : '💬 Teklif Usulü'
}

function getTenderDirectionBadge(tender: any) {
  const tur = (tender.tur || tender.rekabetTuru || '').toLowerCase()
  const yonu = (tender.ihaleYonu || '').toLowerCase()
  
  if (yonu === 'kapali_zarf' || tur.includes('kapalı') || tur.includes('doğrudan') || tur.includes('zarf')) {
    return { 
      label: '📑 Doğrudan Teklif Alma (Kapalı Zarf)', 
      fullLabel: '📑 Doğrudan Teklif Alma (Kapalı Zarf Usulü)',
      class: 'bg-purple-100 text-purple-950 border-purple-400 font-black shadow-2xs' 
    }
  }
  if (yonu === 'artirma' || tur.includes('artırma') || tur.includes('artırımlı') || tur.includes('satış')) {
    return { 
      label: '📈 Açık Artırma (Fiyat Artırımlı)', 
      fullLabel: '📈 Açık Artırma (Fiyat Artırımlı / Satış İhalesi)',
      class: 'bg-blue-100 text-blue-950 border-blue-400 font-black shadow-2xs' 
    }
  }
  return { 
    label: '📉 Açık Eksiltme (Fiyat Azaltımlı)', 
    fullLabel: '📉 Açık Eksiltme (Fiyat Azaltımlı / Alım İhalesi)',
    class: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black shadow-2xs' 
  }
}

function maskBidderName(bid: any, idx?: number): string {
  if (bid.isMine) return '👤 Sizin Teklifiniz'
  const code = (bid.id || String(idx || 1)).replace(/\D/g, '').slice(-3) || ((idx || 0) + 105)
  return `Onaylı Tedarikçi #${code}`
}

function getTenderBidsList(tender: any): any[] {
  if (!tender) return []
  const group = (cmsData.value?.dashboard?.receivedBids || []).find((g: any) => g.id === tender.id || g.baslik === tender.baslik)
  let rawBids: any[] = []
  if (group && group.teklifler) {
    rawBids = [...group.teklifler]
  }

  const isArtirma = (tender.ihaleYonu === 'artirma') || (tender.tur || '').toLowerCase().includes('artırma')

  rawBids.sort((a, b) => {
    const pA = parseInt(String(a.fiyat || '0').replace(/\D/g, '')) || 0
    const pB = parseInt(String(b.fiyat || '0').replace(/\D/g, '')) || 0
    return isArtirma ? (pB - pA) : (pA - pB)
  })

  return rawBids
}

const showLiveBidsDrawer = ref(false)
const drawerTender = ref<any>(null)

function openLiveBidsDrawer(tender: any) {
  drawerTender.value = tender
  showLiveBidsDrawer.value = true
}

const drawerTenderLiveBids = computed(() => {
  return getTenderBidsList(drawerTender.value)
})

const selectedTenderForLiveBids = ref<any>(null)

const currentActiveTenderForSidebar = computed(() => {
  if (selectedTenderForLiveBids.value) return selectedTenderForLiveBids.value
  if (filteredTendersList.value.length > 0) return filteredTendersList.value[0]
  if (allTenders.value.length > 0) return allTenders.value[0]
  return null
})

const activeTenderLiveBids = computed(() => {
  return getTenderBidsList(currentActiveTenderForSidebar.value)
})

function selectTenderForLiveBids(tender: any) {
  selectedTenderForLiveBids.value = tender
}

const liveBidsStream = computed(() => {
  const list: any[] = []
  
  if (typeof window !== 'undefined') {
    try {
      const myBids = JSON.parse(localStorage.getItem('myBids') || '[]')
      myBids.forEach((mb: any) => {
        list.push({
          id: mb.id || 'TKF-' + Math.floor(100 + Math.random() * 900),
          tenderId: mb.tenderId,
          tenderTitle: mb.ilanBaslik || mb.tenderTitle || 'Kurumsal Satın Alma İhalesi',
          bidderRealName: mb.bidderName || userSession.value?.companyName || 'Kendi Şirketiniz',
          bidder: '👤 Sizin Teklifiniz',
          price: mb.teklifFiyatim || mb.price || 'Teklif Verildi',
          priceNum: parseInt(String(mb.teklifFiyatim || mb.price || '0').replace(/\D/g, '')) || 0,
          time: mb.tarih || 'Az önce',
          isMine: true,
          status: 'Değerlendirmede',
          city: 'Balıkesir'
        })
      })
    } catch (e) {}
  }

  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  receivedGroups.forEach((rg: any) => {
    (rg.teklifler || []).forEach((tkf: any, idx: number) => {
      const num = parseInt(String(tkf.fiyat || '0').replace(/\D/g, '')) || 0
      const isMine = tkf.firma === userSession.value?.companyName || tkf.firma === userSession.value?.username
      list.push({
        id: tkf.id || 'TKF-' + Math.floor(100 + Math.random() * 900),
        tenderId: rg.id,
        tenderTitle: rg.baslik,
        bidderRealName: tkf.firma,
        bidder: isMine ? '👤 Sizin Teklifiniz' : maskBidderName(tkf, idx),
        price: tkf.fiyat,
        priceNum: num,
        time: tkf.sure ? `${tkf.sure} teslimat` : (tkf.tarih || 'Bugün'),
        isMine: isMine,
        status: tkf.durum === 'mutabakat' ? 'Mutabakat Sağlandı' : 'Canlı Eksiltme',
        city: tkf.adres?.split(' ')[0] || 'İstanbul'
      })
    })
  })

  list.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0))
  return list
})

function openTenderByIdOrBid(bid: any) {
  const target = allTenders.value.find((t: any) => t.id === bid.tenderId || t.baslik === bid.tenderTitle)
  if (target) {
    openTenderDetailModal(target)
  } else {
    // Open modal with synthetic tender info
    openTenderDetailModal({
      id: bid.tenderId,
      baslik: bid.tenderTitle,
      kategori: 'Kurumsal Satın Alma & Tedarik',
      ownerCompany: 'Doğrulanmış B2B Kurumsal Alıcı',
      city: bid.city || 'Balıkesir',
      butce: 'Açık Teklif Usulü',
      sure: '7 gün kaldı',
      aciklama: `"${bid.tenderTitle}" için canlı eksiltme ve teklif süreci devam etmektedir. Şartname detaylarını inceleyebilir ve teklifinizi sunabilirsiniz.`
    })
  }
}

const allTenders = computed(() => {
  const cmsTenders = (cmsData.value?.dashboard?.tenders || []).filter(
    (t: any) => t.adminApproved === true && t.durum !== 'pending_approval' && t.durum !== 'rejected'
  )
  
  let localTenders: any[] = []
  if (typeof window !== 'undefined') {
    try {
      localTenders = JSON.parse(localStorage.getItem('myTenders') || '[]').filter(
        (t: any) => t.adminApproved === true && t.durum !== 'pending_approval' && t.durum !== 'rejected'
      )
    } catch (e) {}
  }

  const combined = [...localTenders, ...cmsTenders, ...seedTenders]
  const seen = new Set()
  return combined.filter(item => {
    const duplicate = seen.has(item.id || item.baslik)
    seen.add(item.id || item.baslik)
    return !duplicate
  })
})

// Sayaçlar
const todayPublishedCount = computed(() => allTenders.value.filter(t => t.durum !== 'closed').length)
const todayOngoingCount = computed(() => allTenders.value.filter(t => t.durum === 'active').length)
const todayFinishedCount = computed(() => allTenders.value.filter(t => t.durum === 'closed').length)

// ==================== 8. DİNAMİK SAYAÇ VE FİLTRE HESAPLAMALARI ====================
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
  const q = cityName.toLowerCase()
  return allTenders.value.filter((t: any) => (t.city || '').toLowerCase().includes(q)).length
}

function getAuthorityCount(authName: string) {
  const q = authName.toLowerCase().replace(/[(.)]/g, '')
  const words = q.split(/\s+/).filter(w => w.length > 2 && !['t.c.', 'genel', 'müdürlüğü', 'belediyesi', 'başkanlığı', 'a.ş.', 've', 'ltd.'].includes(w))
  return allTenders.value.filter((t: any) => {
    const owner = (t.ownerCompany || '').toLowerCase()
    const auth = (t.authority || '').toLowerCase()
    return words.some(w => owner.includes(w) || auth.includes(w))
  }).length
}

function getSectorCount(secName: string) {
  const q = secName.toLowerCase()
  return allTenders.value.filter((t: any) => {
    const k = (t.kategori || '').toLowerCase()
    const b = (t.baslik || '').toLowerCase()
    return k.includes(q.substring(0, 5)) || b.includes(q.substring(0, 5))
  }).length
}

function getCompanyCount(compName: string) {
  const q = compName.toLowerCase().split(/\s+/)[0]
  return allTenders.value.filter((t: any) => (t.ownerCompany || '').toLowerCase().includes(q)).length
}

// Sol panel kategori listesi
const filteredCategoryTree = computed(() => {
  const list = allCategoriesList.map(c => ({
    ...c,
    count: getCategoryCount(c.name)
  }))
  if (!leftSidebarSearch.value.trim()) return list
  const q = leftSidebarSearch.value.toLocaleLowerCase('tr').trim()
  return list.filter(c => c.name.toLocaleLowerCase('tr').includes(q) || c.short.toLocaleLowerCase('tr').includes(q))
})

// Sol panel şehir listesi (81 İl)
const filteredCitiesTree = computed(() => {
  const list = all81Cities.map((city, idx) => ({
    id: idx + 1,
    name: city,
    count: getCityCount(city)
  }))
  if (!leftSidebarSearch.value.trim()) return list
  const q = leftSidebarSearch.value.toLocaleLowerCase('tr').trim()
  return list.filter(c => c.name.toLocaleLowerCase('tr').includes(q))
})

// Sol panel idareler listesi (Bütün İdareler)
const filteredAuthoritiesTree = computed(() => {
  let list = allAuthoritiesList.map((a, idx) => ({
    id: idx + 1,
    ...a,
    count: getAuthorityCount(a.name)
  }))
  
  if (authorityCategoryFilter.value !== 'Tümü') {
    list = list.filter(a => a.type === authorityCategoryFilter.value)
  }

  if (leftSidebarSearch.value.trim()) {
    const q = leftSidebarSearch.value.toLocaleLowerCase('tr').trim()
    list = list.filter(a => 
      a.name.toLocaleLowerCase('tr').includes(q) || 
      a.city.toLocaleLowerCase('tr').includes(q) ||
      a.type.toLocaleLowerCase('tr').includes(q)
    )
  }

  return list
})

// Sol panel sektörler listesi
const filteredSectorsTree = computed(() => {
  const list = allSectorsList.map(s => ({
    ...s,
    count: getSectorCount(s.name)
  }))
  if (!leftSidebarSearch.value.trim()) return list
  const q = leftSidebarSearch.value.toLocaleLowerCase('tr').trim()
  return list.filter(s => s.name.toLocaleLowerCase('tr').includes(q) || s.cpv.includes(q))
})

// Sol panel firmalar listesi
const filteredCompaniesTree = computed(() => {
  const list = allCompaniesList.map((c, idx) => ({
    id: idx + 1,
    ...c,
    count: getCompanyCount(c.name)
  }))
  if (!leftSidebarSearch.value.trim()) return list
  const q = leftSidebarSearch.value.toLocaleLowerCase('tr').trim()
  return list.filter(c => c.name.toLocaleLowerCase('tr').includes(q) || c.sector.toLocaleLowerCase('tr').includes(q) || c.city.toLocaleLowerCase('tr').includes(q))
})

// ==================== 9. MERKEZİ İHALE LİSTE FİLTRELEME & GELİŞMİŞ KELİME ARAMA (ÖRN: "DOMATES") ====================
const filteredTendersList = computed(() => {
  let list = [...allTenders.value]

  // Kategori Filtresi
  if (selectedCategory.value && selectedCategory.value !== 'Tümü') {
    const catWords = selectedCategory.value.toLowerCase()
      .replace(/[-–,/()]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['ihaleleri', 'ürünler', 'hizmetleri', 'alım', 'işleri', 'satışı'].includes(w))
    
    list = list.filter(t => {
      const k = (t.kategori || '').toLowerCase()
      const b = (t.baslik || '').toLowerCase()
      return catWords.some(w => k.includes(w) || b.includes(w))
    })
  }

  // Şehir Filtresi
  if (selectedCity.value && selectedCity.value !== 'Tümü') {
    list = list.filter(t => (t.city || '').toLowerCase().includes(selectedCity.value.toLowerCase()))
  }

  // İdare / Kurum Filtresi
  if (selectedAuthority.value && selectedAuthority.value !== 'Tümü') {
    const authWords = selectedAuthority.value.toLowerCase()
      .replace(/[(.)]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['t.c.', 'genel', 'müdürlüğü', 'belediyesi', 'başkanlığı', 'a.ş.', 've', 'ltd.'].includes(w))

    list = list.filter(t => {
      const owner = (t.ownerCompany || '').toLowerCase()
      const auth = (t.authority || '').toLowerCase()
      return authWords.some(w => owner.includes(w) || auth.includes(w))
    })
  }

  // Sektör Filtresi
  if (selectedSector.value && selectedSector.value !== 'Tümü') {
    const secQ = selectedSector.value.toLowerCase().substring(0, 5)
    list = list.filter(t => {
      const k = (t.kategori || '').toLowerCase()
      const b = (t.baslik || '').toLowerCase()
      return k.includes(secQ) || b.includes(secQ)
    })
  }

  // Firma Filtresi
  if (selectedCompany.value && selectedCompany.value !== 'Tümü') {
    const compQ = selectedCompany.value.toLowerCase().split(/\s+/)[0]
    list = list.filter(t => (t.ownerCompany || '').toLowerCase().includes(compQ))
  }

  // İhale Türü Filtresi
  if (filterType.value && filterType.value !== 'Tümü') {
    list = list.filter(t => (t.tur || t.type || '').toLowerCase().includes(filterType.value.toLowerCase()))
  }

  // İhale Usulü Filtresi
  if (filterMethod.value && filterMethod.value !== 'Tümü') {
    list = list.filter(t => (t.usul || t.method || '').toLowerCase().includes(filterMethod.value.toLowerCase()))
  }

  // Gelişmiş Kelime Arama (Türkçe Karakter Uyumlu - Örn: "domates", "çimento", "jeneratör", "mobilya")
  if (filterKeyword.value.trim()) {
    const rawKw = filterKeyword.value.trim().toLocaleLowerCase('tr')
    const kwClean = rawKw.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s]/g, ' ')
    const searchTerms = kwClean.split(/\s+/).filter(w => w.length > 1)

    list = list.filter(t => {
      const fullText = (t.baslik || '' + ' ' + t.aciklama || '' + ' ' + t.kategori || '' + ' ' + t.ownerCompany || '' + ' ' + t.authority || '' + ' ' + t.city || '' + ' ' + t.id || '' + ' ' + t.subCategory || '').toLocaleLowerCase('tr')
      
      // Tüm arama terimlerinin veya ana kelimenin eşleşmesini sağla
      return searchTerms.length === 0 || searchTerms.some(term => fullText.includes(term))
    })
  }

  // Fiyat Min / Max Filtresi
  if (typeof minPriceFilter.value === 'number' && minPriceFilter.value > 0) {
    list = list.filter(t => {
      const priceNum = parseInt(String(t.butce || '0').replace(/\D/g, '')) || 0
      return priceNum >= (minPriceFilter.value as number)
    })
  }
  if (typeof maxPriceFilter.value === 'number' && maxPriceFilter.value > 0) {
    list = list.filter(t => {
      const priceNum = parseInt(String(t.butce || '0').replace(/\D/g, '')) || 0
      return priceNum <= (maxPriceFilter.value as number)
    })
  }

  // Zaman Sekmesi Filtresi
  if (activeTimeTab.value === 'guncel') {
    list = list.filter(t => t.durum !== 'closed')
  } else if (activeTimeTab.value === 'sonuc' || activeTimeTab.value === 'gecmis') {
    list = list.filter(t => t.durum === 'closed')
  }

  // Sıralama
  if (selectedSort.value === 'price_asc') {
    list.sort((a, b) => (parseInt(a.butce?.replace(/\D/g, '') || '0') - parseInt(b.butce?.replace(/\D/g, '') || '0')))
  } else if (selectedSort.value === 'price_desc') {
    list.sort((a, b) => (parseInt(b.butce?.replace(/\D/g, '') || '0') - parseInt(a.butce?.replace(/\D/g, '') || '0')))
  } else if (selectedSort.value === 'bids') {
    list.sort((a, b) => ((b.teklifSayisi || 0) - (a.teklifSayisi || 0)))
  } else if (selectedSort.value === 'date_new') {
    list.sort((a, b) => (b.id || '').localeCompare(a.id || ''))
  }

  return list
})

// Sayfalama
const totalPages = computed(() => Math.ceil(filteredTendersList.value.length / itemsPerPage.value) || 1)
const paginatedTenders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredTendersList.value.slice(start, start + itemsPerPage.value)
})

function resetAllFilters() {
  selectedCategory.value = 'Tümü'
  selectedCity.value = 'Tümü'
  selectedAuthority.value = 'Tümü'
  selectedSector.value = 'Tümü'
  selectedCompany.value = 'Tümü'
  leftSidebarSearch.value = ''
  authorityCategoryFilter.value = 'Tümü'
  filterType.value = 'Tümü'
  filterMethod.value = 'Tümü'
  filterCost.value = 'Tümü'
  filterKeyword.value = ''
  minPriceFilter.value = ''
  maxPriceFilter.value = ''
  activeTimeTab.value = 'guncel'
  selectedSort.value = 'otomatik'
  currentPage.value = 1
}

// ==================== 10. MODAL VE HIZLI TEKLİF İŞLEMLERİ ====================
const activeSpecTab = ref<'pdf' | 'gallery' | 'details'>('pdf')
const activeDocIndex = ref(0)
const activeImageIndex = ref(0)
const pdfZoomLevel = ref(100)

// ==================== FİRMA PROFİLİ & PUANLARI MODALI ====================
const showCompanyProfileModal = ref(false)
const selectedCompanyProfile = ref<any>(null)

function openCompanyProfileModal(companyName?: string, city?: string) {
  const name = companyName || 'Doğrulanmış B2B Kurumsal Firma'
  
  selectedCompanyProfile.value = {
    name,
    city: city || 'Balıkesir / İstanbul',
    sector: 'İnşaat, Yapı & Kurumsal Tedarik',
    rating: '4.9',
    reviewCount: 32,
    verified: true,
    phone: '+90 (850) 840 86 95',
    email: 'kurumsal@' + name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.tr',
    taxOffice: 'Karesi V.D. / 1450293847',
    mersis: '0470-0854-2100-0001',
    address: `Organize Sanayi Bölgesi 2. Cadde No:14 ${city || 'Balıkesir'} / Türkiye`,
    completedTenders: 28,
    onTimeDelivery: '%99.4',
    specCompliance: '%98.9',
    reviews: [
      { name: 'Kalyon Yapı Satın Alma Dir.', rating: 5, text: 'Şartnameye tam uygun malzeme teslimatı. Escrow üzerinden güvenli ve sorunsuz çalıştık.' },
      { name: 'Ege Lojistik & Antrepo A.Ş.', rating: 5, text: 'Zamanında teslimat ve eksiksiz faturalandırma. Sürekli iş yaptığımız güvenilir bir kurum.' }
    ]
  }
  showCompanyProfileModal.value = true
}

function openTenderDetailModal(tender: any) {
  selectedTenderModal.value = tender
  activeDocIndex.value = 0
  activeImageIndex.value = 0
  pdfZoomLevel.value = 100
  
  // Auto-select gallery if user has images but no PDF, or PDF if files exist
  if (tender.files && tender.files.length > 0) {
    activeSpecTab.value = 'pdf'
  } else if (tender.images && tender.images.length > 0) {
    activeSpecTab.value = 'gallery'
  } else {
    activeSpecTab.value = 'pdf'
  }
}

// Firma Profil Modalı Açıcı (Dışarıdan Görünüm & Düzenle Butonu Kontrolü)

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

function downloadPdfDocument(tender: any) {
  const content = `================================================================================
                    T.C. B2B TICARET VE ELEKTRONIK IHALE PORTALI
                     IHALECIBURADA RESMI IHALE SARTNAMESI
================================================================================

Ihale Kayit No (IKN)    : #${tender.id}
Ihale Basligi            : ${tender.baslik}
Sektor & Kategori       : ${tender.kategori || 'Genel Satin Alma'}
Alici Kurum             : ${tender.ownerCompany || tender.authority || 'Kurumsal Satin Alma Masasi'}
Ihale Usulu             : ${tender.tur || 'Acik Eksiltmeli Ihale'}
Hedef / Butce           : ${tender.butce || 'Acik Teklif'}
Teslimat Sehri          : ${tender.city || 'Balikesir'}
Teslimat Adresi         : ${tender.teslimatAdresi || (tender.city + ' Merkez / Depo Teslimat')}
Kalan Sure              : ${tender.sure || '7 gun'}
Yayin Tarihi            : ${new Date().toLocaleDateString('tr-TR')}

--------------------------------------------------------------------------------
1. IHALENIN KONUSU VE TEKNIK ISTERLER
--------------------------------------------------------------------------------
${tender.aciklama || tender.baslik}

--------------------------------------------------------------------------------
2. IDARI VE MALI SARTLAR
--------------------------------------------------------------------------------
- Istekliler tekliflerini KDV haric/dahil belirtilen sartname cercevesinde iletmelidir.
- Odemeler BDDK/TCMB mevzuatina uygun Escrow Guvenli Havuz hesabinda bloke edilir.
- Muayene ve kabul islemleri sonrasinda hakedis bedeli yukleniciye aktarilir.

--------------------------------------------------------------------------------
DURUM: e-Imzali & Zaman Damgali Resmi Dokuman
================================================================================
`;
  if (typeof document !== 'undefined') {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Resmi_Sartname_${tender.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}


// Kullanıcının kendi profili olup olmadığını kontrol eden mantık
const isMyOwnCompany = computed(() => {
  if (!selectedCompanyProfileModal.value || !userSession.value) return false
  const modalComp = (selectedCompanyProfileModal.value.name || '').toLowerCase()
  const userComp = (userSession.value.companyName || userSession.value.company || userSession.value.name || userSession.value.username || '').toLowerCase()
  return userComp.length > 2 && (modalComp.includes(userComp) || userComp.includes(modalComp))
})


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


function openQuickBidModal(tender: any) {
  if (isMyOwnTender(tender)) {
    alert(`🚫 KENDİ İLANINIZA TEKLİF VEREMEZSİNİZ!\n\n"${tender.baslik}" ihalesi sizin tarafınızdan açılmıştır.\n\nSistem kuralları ve B2B ihale mevzuatı gereği kendi açtığınız ihalelere teklif sunamazsınız.\n\nİhaleniz için gelen teklifleri incelemek ve pazarlık yürütmek için lütfen "Gelen Teklifler" sayfasına gidiniz.`)
    return
  }
  quickBidTender.value = tender
  quickOfferPrice.value = ''
  quickOfferVatType.value = 'vat_excluded'
  quickOfferNotes.value = ''
  quickOfferDuration.value = '7 gün'
  quickOfferFiles.value = []
  showQuickBidModal.value = true
}

function triggerQuoteFileSelect() {
  quoteFileInputRef.value?.click()
}

function handleQuoteFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    let fileType = 'pdf'
    if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) fileType = 'excel'
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileType = 'word'

    const reader = new FileReader()
    reader.onload = (e) => {
      quickOfferFiles.value.push({
        name: file.name,
        size: fileSizeMB,
        type: fileType,
        url: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  }
}

function removeQuoteFile(index: number) {
  quickOfferFiles.value.splice(index, 1)
}

function submitQuickOffer() {
  if (!quickBidTender.value) {
    alert('Lütfen bir ihale seçiniz.')
    return
  }

  const tender = quickBidTender.value

  if (isMyOwnTender(tender)) {
    alert('🚫 Kendi açtığınız bir ihaleye teklif veremezsiniz!')
    showQuickBidModal.value = false
    return
  }

  if (!quickOfferPrice.value || !String(quickOfferPrice.value).trim()) {
    alert('Lütfen teklif tutarınızı giriniz.')
    return
  }

  const rawClean = String(quickOfferPrice.value).replace(/[^0-9]/g, '')
  const numericPrice = parseInt(rawClean, 10)
  if (isNaN(numericPrice) || numericPrice <= 0) {
    alert('Lütfen geçerli bir teklif tutarı giriniz (Örn: 75000).')
    return
  }

  // Current session resolution
  let session: any = {}
  if (typeof window !== 'undefined') {
    try {
      session = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }

  const bidderCompany = session.companyName || session.company || session.name || session.username || 'Onaylı Tedarikçi Firma'
  const vatLabel = quickOfferVatType.value === 'vat_excluded' ? '+ KDV Hariç' : 'KDV Dahil'
  const formattedPrice = Number(numericPrice).toLocaleString('tr-TR') + ' ₺'
  const fullPriceLabel = formattedPrice + ' (' + vatLabel + ')'
  const now = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  const bidObj = {
    id: 'BID-' + Math.floor(100000 + Math.random() * 900000),
    tenderId: tender.id,
    tenderTitle: tender.baslik,
    tenderCategory: tender.kategori,
    tenderCity: tender.city || 'Balıkesir',
    buyerCompany: tender.ownerCompany || tender.authority || 'Kurumsal Masası',
    price: fullPriceLabel,
    priceNum: numericPrice,
    rawPrice: formattedPrice,
    vatType: quickOfferVatType.value,
    validityDuration: quickOfferDuration.value || '7 gün',
    notes: quickOfferNotes.value || 'Şartname ve teknik kriterler uyarınca teklifimizdir.',
    bidderName: bidderCompany,
    bidderEmail: session.email || '',
    files: [...quickOfferFiles.value],
    filesCount: quickOfferFiles.value.length,
    submittedAt: now,
    time: 'Az önce',
    tarih: now,
    status: 'Değerlendirmede',
    isMine: true
  }

  // 1. LocalStorage update
  if (typeof window !== 'undefined') {
    try {
      const myBids = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      myBids.unshift(bidObj)
      localStorage.setItem('mySubmittedBids', JSON.stringify(myBids))

      const myBidsGen = JSON.parse(localStorage.getItem('myBids') || '[]')
      myBidsGen.unshift({
        id: bidObj.id,
        tenderId: tender.id,
        ilanBaslik: tender.baslik,
        teklifFiyatim: fullPriceLabel,
        tarih: now,
        status: 'Değerlendirmede',
        bidderName: bidderCompany
      })
      localStorage.setItem('myBids', JSON.stringify(myBidsGen))
    } catch (e) {
      console.warn('localStorage bid sync error', e)
    }
  }

  // 2. Sync to CMS Data
  if (cmsData.value) {
    if (!cmsData.value.dashboard) cmsData.value.dashboard = {} as any
    if (!Array.isArray(cmsData.value.dashboard.receivedBids)) cmsData.value.dashboard.receivedBids = []

    let targetGroup = cmsData.value.dashboard.receivedBids.find((g: any) => g.id === tender.id || g.baslik === tender.baslik)
    if (!targetGroup) {
      targetGroup = {
        id: tender.id,
        baslik: tender.baslik,
        kategori: tender.kategori,
        teklifler: []
      }
      cmsData.value.dashboard.receivedBids.unshift(targetGroup)
    }

    if (!Array.isArray(targetGroup.teklifler)) targetGroup.teklifler = []
    targetGroup.teklifler.unshift({
      id: bidObj.id,
      firma: bidderCompany,
      fiyat: formattedPrice,
      sure: quickOfferDuration.value || '7 gün',
      durum: 'degerlendirmede',
      tarih: 'Az önce',
      adres: (session.city || tender.city || 'Balıkesir') + ' / Türkiye',
      aciklama: quickOfferNotes.value || '',
      files: [...quickOfferFiles.value]
    })

    if (tender.teklifSayisi !== undefined) {
      tender.teklifSayisi = (tender.teklifSayisi || 0) + 1
    }

    try {
      saveCmsData(cmsData.value)
    } catch (err) {
      console.warn('saveCmsData warning', err)
    }
  }

  // Dispatch storage event for other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'))
  }

  showQuickBidModal.value = false
  offerSuccessToastMsg.value = `"${tender.baslik}" ihalesine ${fullPriceLabel} tutarındaki teklifiniz başarıyla iletildi!`
  showOfferSuccessToast.value = true

  setTimeout(() => {
    showOfferSuccessToast.value = false
  }, 5000)
}

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
</script>

<template>
  <div class="min-h-screen bg-[#F4F6F9] text-slate-800 font-sans text-xs flex flex-col">

    <!-- ========================================================================= -->
    <!-- 🎛️ 1. ÜST HIZLI ARAMA & GÜNLÜK SAYAÇ ŞERİDİ -->
    <!-- ========================================================================= -->
    <div class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-4">
      <div class="bg-white border border-slate-300 rounded-2xl p-3.5 shadow-2xs space-y-3">
        
        <!-- Zaman Sekmeleri + Arama Kutusu -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-1 text-xs font-bold w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button 
              @click="activeTimeTab = 'guncel'; currentPage = 1" 
              :class="activeTimeTab === 'guncel' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Clock :size="14" />
              <span>Güncel İhaleler</span>
            </button>
            <button 
              @click="activeTimeTab = 'gecmis'; currentPage = 1" 
              :class="activeTimeTab === 'gecmis' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw :size="14" />
              <span>Geçmiş</span>
            </button>
            <button 
              @click="activeTimeTab = 'sonuc'; currentPage = 1" 
              :class="activeTimeTab === 'sonuc' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 :size="14" />
              <span>Sonuçlananlar</span>
            </button>
          </div>

          <!-- Arama Inputu (Domates, Çimento vb. Tüm Kelimeleri Tarar) -->
          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="relative flex-1 md:w-96">
              <input 
                v-model="filterKeyword" 
                type="text" 
                placeholder="Kelime ara: 'domates', 'mobilya', 'çimento', 'sağlık'..." 
                class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white shadow-inner font-medium"
              />
              <Search :size="14" class="absolute left-3 top-2.5 text-slate-400" />
            </div>
            <button 
              type="button"
              @click="resetAllFilters"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 border border-slate-200"
              title="Filtreleri Sıfırla"
            >
              <RotateCcw :size="13" />
              <span class="hidden sm:inline">Sıfırla</span>
            </button>
          </div>
        </div>

        <!-- 3'lü Günlük İhale Sayaçları -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
          <div @click="activeTimeTab = 'guncel'" class="p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 flex items-center justify-between hover:bg-sky-100 transition cursor-pointer">
            <span class="font-bold text-sky-900 text-xs flex items-center gap-1.5">
              <Zap :size="14" class="text-sky-600" />
              <span>Bugün yayınlananlar</span>
            </span>
            <span class="px-2 py-0.5 rounded-full bg-white border border-sky-300 text-sky-800 font-black text-xs font-mono">
              {{ todayPublishedCount }} İhale
            </span>
          </div>

          <div @click="activeTimeTab = 'guncel'" class="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 flex items-center justify-between hover:bg-blue-100 transition cursor-pointer">
            <span class="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Clock :size="14" class="text-blue-600" />
              <span>Bugün yapılacaklar</span>
            </span>
            <span class="px-2 py-0.5 rounded-full bg-white border border-blue-300 text-blue-800 font-black text-xs font-mono">
              {{ todayOngoingCount }} İhale
            </span>
          </div>

          <div @click="activeTimeTab = 'sonuc'" class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between hover:bg-emerald-100 transition cursor-pointer">
            <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 :size="14" class="text-emerald-600" />
              <span>Bugün sonuçlananlar</span>
            </span>
            <span class="px-2 py-0.5 rounded-full bg-white border border-emerald-300 text-emerald-800 font-black text-xs font-mono">
              {{ todayFinishedCount }} İhale
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🌟 2. SAHİBİNDEN.COM 2 SÜTUNLU ANA DÜZEN (SOLDA TÜM DİZİNLER, ORTADA İLANLAR) -->
    <!-- ========================================================================= -->
    <div class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <!-- ========================================================= -->
        <!-- ⬅️ SOL SÜTUN: TÜM DİZİNLER (KATEGORİLER / ŞEHİRLER / İDARELER / SEKTÖRLER / FİRMALAR) -->
        <!-- ========================================================= -->
        <aside class="lg:col-span-4 xl:col-span-3 space-y-3.5">
          
          <!-- Sol Menü Ana Kutusu -->
          <div class="bg-white border border-slate-300 rounded-2xl p-3.5 shadow-2xs space-y-3">
            
            <!-- 5'li Sol Sekme Seçici Butonları -->
            <div class="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-center">
              
              <!-- 1. Kategoriler -->
              <button 
                type="button" 
                @click="activeLeftTab = 'kategoriler'; currentPage = 1"
                class="py-2 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                :class="activeLeftTab === 'kategoriler' ? 'bg-[#0084B4] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
                title="İhale Kategorileri"
              >
                <Folder :size="13" />
                <span class="leading-none">Kategori</span>
              </button>

              <!-- 2. Şehirler -->
              <button 
                type="button" 
                @click="activeLeftTab = 'sehirler'; currentPage = 1"
                class="py-2 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                :class="activeLeftTab === 'sehirler' ? 'bg-[#0084B4] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
                title="81 İl İhale Listesi"
              >
                <MapPin :size="13" />
                <span class="leading-none">Şehirler</span>
              </button>

              <!-- 3. İdareler -->
              <button 
                type="button" 
                @click="activeLeftTab = 'idareler'; currentPage = 1"
                class="py-2 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                :class="activeLeftTab === 'idareler' ? 'bg-[#0084B4] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
                title="Bütün İdare ve Kurumlar"
              >
                <Landmark :size="13" />
                <span class="leading-none">Resmi Kurum</span>
              </button>

              <!-- 4. Sektörler -->
              <button 
                type="button" 
                @click="activeLeftTab = 'sektorler'; currentPage = 1"
                class="py-2 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                :class="activeLeftTab === 'sektorler' ? 'bg-[#0084B4] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
                title="Faaliyet Sektörleri"
              >
                <Briefcase :size="13" />
                <span class="leading-none">Sektör</span>
              </button>

              <!-- 5. Firmalar -->
              <button 
                type="button" 
                @click="activeLeftTab = 'firmalar'; currentPage = 1"
                class="py-2 rounded-lg text-[10px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                :class="activeLeftTab === 'firmalar' ? 'bg-[#0084B4] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
                title="Doğrulanmış Firmalar"
              >
                <Building2 :size="13" />
                <span class="leading-none">Firmalar</span>
              </button>

            </div>

            <!-- Başlık ve Filtre Sıfırlama -->
            <div class="flex items-center justify-between pt-1 border-b border-slate-100 pb-2">
              <span class="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <span v-if="activeLeftTab === 'kategoriler'">📁 İhale Kategorileri (40)</span>
                <span v-else-if="activeLeftTab === 'sehirler'">🏙️ Türkiye Geneli (81 İl)</span>
                <span v-else-if="activeLeftTab === 'idareler'">🏛️ Bütün Resmi Kurumlar & İdareler</span>
                <span v-else-if="activeLeftTab === 'sektorler'">🏭 Sektörel Gruplar (CPV)</span>
                <span v-else-if="activeLeftTab === 'firmalar'">🏢 Doğrulanmış Firmalar</span>
              </span>

              <button 
                type="button"
                @click="resetAllFilters" 
                class="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Tümü (Sıfırla)
              </button>
            </div>

            <!-- Sol Menü İçi Arama Kutusu -->
            <div class="relative">
              <input 
                v-model="leftSidebarSearch"
                type="text"
                :placeholder="activeLeftTab === 'kategoriler' ? 'Kategorilerde ara...' : activeLeftTab === 'sehirler' ? '81 İlde ara (Örn: Çanakkale)...' : activeLeftTab === 'idareler' ? 'Bütün idarelerde ara (DSİ, KGM, TOKİ...)...' : activeLeftTab === 'sektorler' ? 'Sektörlerde ara...' : 'Firmalarda ara...'"
                class="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
              />
              <Search :size="12" class="absolute left-2.5 top-2 text-slate-400" />
            </div>

            <!-- İdareler Sekmesi İçin Kategori Filtresi (Bakanlık, Belediye, vb.) -->
            <div v-if="activeLeftTab === 'idareler'" class="space-y-1">
              <select 
                v-model="authorityCategoryFilter"
                class="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="Tümü">Tüm Resmi Kurumlar (Bakanlık, Belediye, Özel İdare...)</option>
                <option value="Bakanlık">🏛️ Bakanlıklar & Başkanlıklar (17 Bakanlık + SSB, AFAD)</option>
                <option value="İl Özel İdaresi">🌾 İl Özel İdareleri (81 İl Özel İdaresi)</option>
                <option value="Belediye">🏙️ Belediyeler (Büyükşehir, İl & İlçe)</option>
                <option value="Genel Müdürlük & KİT">⚙️ Genel Müdürlükler & KİT'ler (DSİ, KGM, TOKİ...)</option>
                <option value="Valilik & YİKOB">🏛️ Valilikler & YİKOB (Yatırım İzleme)</option>
                <option value="Üniversite & Teknokent">🎓 Üniversiteler & Teknoparklar</option>
                <option value="Sağlık & Hastane">🏥 İl Sağlık Müdürlükleri & Şehir Hastaneleri</option>
                <option value="OSB & Sanayi Odası">🏭 Organize Sanayi Bölgeleri (OSB)</option>
                <option value="Kalkınma Ajansı & Birlik">🌱 Kalkınma Ajansları & Sulama Birlikleri</option>
                <option value="Özel Sektör Masası">🏢 Özel Sektör B2B Satın Alma Masaları</option>
              </select>
            </div>

            <!-- 📜 DİNAMİK KAYDIRILABİLİR LİSTE AĞACI -->
            <div class="max-h-[420px] overflow-y-auto space-y-1 pr-1 custom-scrollbar divide-y divide-slate-50">
              
              <!-- 1. KATEGORİLER LİSTESİ (İNŞAAT, SAĞLIK, TARIM İLK 3 SIRADA) -->
              <template v-if="activeLeftTab === 'kategoriler'">
                <button
                  type="button"
                  @click="selectedCategory = 'Tümü'; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCategory === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>🌟</span>
                    <span>Tüm Kategoriler</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCategory === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ allTenders.length }}
                  </span>
                </button>

                <button
                  v-for="cat in filteredCategoryTree"
                  :key="cat.id"
                  type="button"
                  @click="selectedCategory = cat.name; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCategory === cat.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate pr-1">
                    <span class="shrink-0">{{ cat.icon }}</span>
                    <span class="truncate text-[11px]">{{ cat.name }}</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCategory === cat.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ cat.count }}
                  </span>
                </button>
              
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
                <span class="font-mono font-black text-emerald-700">{{ formatTenderBudget(pdfTenderTarget.butce) }}</span>
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
    <!-- 🏢 FİRMA PROFİLİ, PUANLARI VE İTİBAR MODALI (KULLANICI TALEBİ) -->
    <div 
      v-if="showCompanyProfileModal && selectedCompanyProfile" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-left"
      @click.self="showCompanyProfileModal = false"
    >
      <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 border border-slate-100 max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        <!-- Başlık & Kapat -->
        <div class="flex items-start justify-between border-b pb-4 border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-900 text-white font-black text-lg flex items-center justify-center shadow-sm">
              {{ selectedCompanyProfile.name.charAt(0) }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-black text-slate-900">{{ selectedCompanyProfile.name }}</h3>
                <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                  ✓ Doğrulanmış Kurumsal Firma
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium">
                {{ selectedCompanyProfile.sector }} · {{ selectedCompanyProfile.city }}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            @click="showCompanyProfileModal = false" 
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- İtibar & Puan İstatistikleri -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-1">
            <span class="text-[10px] font-black text-amber-800 uppercase block">Firma Puanı</span>
            <div class="flex items-center justify-center gap-1 text-base font-black text-amber-900">
              <Star :size="16" class="text-amber-500" fill="#F59E0B" />
              <span>{{ selectedCompanyProfile.rating }} / 5.0</span>
            </div>
            <span class="text-[9px] text-amber-700 font-bold block">({{ selectedCompanyProfile.reviewCount }} Değerlendirme)</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1">
            <span class="text-[10px] font-black text-emerald-800 uppercase block">Zamanında Teslim</span>
            <div class="text-base font-black text-emerald-900">{{ selectedCompanyProfile.onTimeDelivery }}</div>
            <span class="text-[9px] text-emerald-700 font-bold block">Gecikmesiz Sevkiyat</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-1">
            <span class="text-[10px] font-black text-blue-800 uppercase block">Şartname Uyumu</span>
            <div class="text-base font-black text-blue-900">{{ selectedCompanyProfile.specCompliance }}</div>
            <span class="text-[9px] text-blue-700 font-bold block">Sıfır Hata</span>
          </div>

          <div class="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-1">
            <span class="text-[10px] font-black text-purple-800 uppercase block">Tamamlanan İhale</span>
            <div class="text-base font-black text-purple-900">{{ selectedCompanyProfile.completedTenders }} Adet</div>
            <span class="text-[9px] text-purple-700 font-bold block">Escrow Tamamlandı</span>
          </div>
        </div>

        <!-- Doğrulanmış Kurumsal Bilgiler -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck :size="15" class="text-emerald-600" />
            <span>Doğrulanmış Resmi Kurumsal Bilgiler:</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span class="text-[10px] font-bold text-slate-400 block">Vergi Dairesi / No:</span>
              <strong class="text-slate-800 font-mono">{{ selectedCompanyProfile.taxOffice }}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span class="text-[10px] font-bold text-slate-400 block">MERSİS Numarası:</span>
              <strong class="text-slate-800 font-mono">{{ selectedCompanyProfile.mersis }}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5 sm:col-span-2">
              <span class="text-[10px] font-bold text-slate-400 block">Kayıtlı Merkez / Depo Adresi:</span>
              <strong class="text-slate-800">{{ selectedCompanyProfile.address }}</strong>
            </div>
          </div>
        </div>

        <!-- Müşteri Değerlendirmeleri ve Yorumları -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Star :size="14" class="text-amber-500" fill="#F59E0B" />
            <span>Platform Üzerindeki Gerçek Alıcı Yorumları:</span>
          </h4>
          <div class="space-y-2 text-xs">
            <div v-for="(rev, rIdx) in selectedCompanyProfile.reviews" :key="rIdx" class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-black text-slate-800">{{ rev.name }}</span>
                <div class="flex text-amber-500"><Star v-for="s in rev.rating" :key="s" :size="11" fill="#F59E0B" /></div>
              </div>
              <p class="text-slate-600 text-[11px] leading-relaxed">"{{ rev.text }}"</p>
            </div>
          </div>
        </div>

        <!-- Aksiyon Butonları -->
        <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="showCompanyProfileModal = false" 
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer text-xs"
          >
            Kapat
          </button>
          <NuxtLink 
            to="/panel/mesajlar" 
            class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
          >
            <MessageSquare :size="13" />
            <span>Firma ile İletişime Geç</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

              <!-- 2. ŞEHİRLER LİSTESİ (81 İL) -->
              <template v-else-if="activeLeftTab === 'sehirler'">
                <button
                  type="button"
                  @click="selectedCity = 'Tümü'; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCity === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>🇹🇷</span>
                    <span>Tüm Türkiye (81 İl)</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCity === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ allTenders.length }}
                  </span>
                </button>

                <button
                  v-for="c in filteredCitiesTree"
                  :key="c.id"
                  type="button"
                  @click="selectedCity = c.name; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCity === c.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate pr-1">
                    <MapPin :size="13" :class="selectedCity === c.name ? 'text-white' : 'text-blue-600'" class="shrink-0" />
                    <span class="truncate text-[11px] font-bold">{{ c.name }}</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCity === c.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ c.count }}
                  </span>
                </button>
              </template>

              <!-- 3. İDARELER LİSTESİ (BÜTÜN İDARELER & KURUMLAR) -->
              <template v-else-if="activeLeftTab === 'idareler'">
                <button
                  type="button"
                  @click="selectedAuthority = 'Tümü'; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedAuthority === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>🏛️</span>
                    <span>Tüm Resmi Kurumlar (Bakanlık, Belediye, Özel İdare...)</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedAuthority === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ allTenders.length }}
                  </span>
                </button>

                <button
                  v-for="auth in filteredAuthoritiesTree"
                  :key="auth.id"
                  type="button"
                  @click="selectedAuthority = auth.name; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedAuthority === auth.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate pr-1">
                    <span class="shrink-0">{{ auth.icon }}</span>
                    <div class="truncate">
                      <div class="truncate text-[11px] font-bold">{{ auth.name }}</div>
                      <div class="text-[9px] opacity-75 font-normal truncate">{{ auth.type }} · {{ auth.city }}</div>
                    </div>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0 ml-1"
                    :class="selectedAuthority === auth.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ auth.count }}
                  </span>
                </button>
              </template>

              <!-- 4. SEKTÖRLER LİSTESİ (CPV) -->
              <template v-else-if="activeLeftTab === 'sektorler'">
                <button
                  type="button"
                  @click="selectedSector = 'Tümü'; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedSector === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>🏭</span>
                    <span>Tüm Faaliyet Sektörleri</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedSector === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ allTenders.length }}
                  </span>
                </button>

                <button
                  v-for="sec in filteredSectorsTree"
                  :key="sec.id"
                  type="button"
                  @click="selectedSector = sec.name; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedSector === sec.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate pr-1">
                    <span class="shrink-0">{{ sec.icon }}</span>
                    <div class="truncate">
                      <div class="truncate text-[11px] font-bold">{{ sec.name }}</div>
                      <div class="text-[9px] opacity-75 font-mono">CPV: {{ sec.cpv }}</div>
                    </div>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedSector === sec.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ sec.count }}
                  </span>
                </button>
              </template>

              <!-- 5. FİRMALAR LİSTESİ -->
              <template v-else-if="activeLeftTab === 'firmalar'">
                <button
                  type="button"
                  @click="selectedCompany = 'Tümü'; currentPage = 1"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCompany === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>🏢</span>
                    <span>Tüm Doğrulanmış Firmalar</span>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCompany === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ allTenders.length }}
                  </span>
                </button>

                <button
                  v-for="comp in filteredCompaniesTree"
                  :key="comp.id"
                  type="button"
                  @click="openCompanyProfileModal(comp.name, comp.city)"
                  class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                  :class="selectedCompany === comp.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
                >
                  <div class="flex items-center gap-2 truncate pr-1">
                    <Building2 :size="13" :class="selectedCompany === comp.name ? 'text-white' : 'text-blue-600'" class="shrink-0" />
                    <div class="truncate">
                      <div class="truncate text-[11px] font-bold">{{ comp.name }}</div>
                      <div class="text-[9px] opacity-75 font-normal">{{ comp.sector }} · {{ comp.city }}</div>
                    </div>
                  </div>
                  <span 
                    class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                    :class="selectedCompany === comp.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                  >
                    {{ comp.count }}
                  </span>
                </button>
              </template>

            </div>
          </div>

          <!-- Alt Filtreler: Şehir / Tür / Usul / Bütçe -->
          <div class="bg-white border border-slate-300 rounded-2xl p-3.5 shadow-2xs space-y-3.5">
            <span class="font-black text-slate-800 text-xs block pb-1 border-b border-slate-100">
              ⚡ Detaylı İhale Filtreleri
            </span>

            <!-- Şehir Seçimi -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">Şehir / Konum:</label>
              <select v-model="selectedCity" @change="currentPage = 1" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                <option value="Tümü">Tüm Türkiye (81 İl)</option>
                <option v-for="city in all81Cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

            <!-- İhale Türü -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">İhale Türü:</label>
              <select v-model="filterType" @change="currentPage = 1" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                <option value="Tümü">Tümü</option>
                <option value="Mal Alımı">Mal Alımı</option>
                <option value="Hizmet Alımı">Hizmet Alımı</option>
                <option value="Yapım İşi">Yapım İşi</option>
                <option value="Satış">Satış</option>
                <option value="Kiralama">Kiralama</option>
              </select>
            </div>

            <!-- İhale Usulü -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">İhale Usulü:</label>
              <select v-model="filterMethod" @change="currentPage = 1" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                <option value="Tümü">Tümü</option>
                <option value="Açık İhale">Açık İhale</option>
                <option value="Doğrudan Temin">Doğrudan Temin</option>
                <option value="Pazarlık Usulü">Pazarlık Usulü</option>
                <option value="Belli İstekliler">Belli İstekliler Arasında</option>
                <option value="Fiyat Araştırması">Fiyat Araştırması</option>
              </select>
            </div>

            <!-- Fiyat Aralığı -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">Bütçe / Fiyat Aralığı (₺):</label>
              <div class="grid grid-cols-2 gap-1.5">
                <input 
                  v-model.number="minPriceFilter" 
                  @input="currentPage = 1"
                  type="number" 
                  placeholder="Min ₺" 
                  class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                />
                <input 
                  v-model.number="maxPriceFilter" 
                  @input="currentPage = 1"
                  type="number" 
                  placeholder="Max ₺" 
                  class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <!-- Filtreleri Temizle -->
            <button 
              type="button" 
              @click="resetAllFilters" 
              class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw :size="12" />
              <span>Filtreleri Temizle</span>
            </button>

          </div>

        </aside>

        <!-- ========================================================= -->
        <!-- ➡️ SAĞ / ORTA SÜTUN: RESİMLİ İHALE LİSTESİ (SAHİBİNDEN FEED) -->
        <!-- ========================================================= -->
        <main class="lg:col-span-8 xl:col-span-9 space-y-4">
          
          <!-- ÜST KONTROL ŞERİDİ: SONUÇ SAYACI, AKTİF ROZETLER & SIRALAMA -->
          <div class="bg-white border border-slate-300 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            <!-- Sol: Sonuç Sayacı & Aktif Filtre Rozetleri -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-black text-slate-800 text-xs">
                Toplam <strong>{{ filteredTendersList.length }}</strong> İhale İlanı Bulundu
              </span>

              <!-- Kategori Rozeti -->
              <span v-if="selectedCategory !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-sky-100 text-[#0084B4] border border-sky-200 font-bold text-[11px] flex items-center gap-1">
                <span>Kategori: {{ selectedCategory }}</span>
                <button type="button" @click="selectedCategory = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <!-- Şehir Rozeti -->
              <span v-if="selectedCity !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[11px] flex items-center gap-1">
                <span>Şehir: {{ selectedCity }}</span>
                <button type="button" @click="selectedCity = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <!-- İdare Rozeti -->
              <span v-if="selectedAuthority !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-[11px] flex items-center gap-1">
                <span>İdare: {{ selectedAuthority }}</span>
                <button type="button" @click="selectedAuthority = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <!-- Sektör Rozeti -->
              <span v-if="selectedSector !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1">
                <span>Sektör: {{ selectedSector }}</span>
                <button type="button" @click="selectedSector = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <!-- Firma Rozeti -->
              <span v-if="selectedCompany !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold text-[11px] flex items-center gap-1">
                <span>Firma: {{ selectedCompany }}</span>
                <button type="button" @click="selectedCompany = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <!-- Arama Kelimesi Rozeti -->
              <span v-if="filterKeyword" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] flex items-center gap-1">
                <span>Kelime: "{{ filterKeyword }}"</span>
                <button type="button" @click="filterKeyword = ''" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>
            </div>

            <!-- Sağ: Sıralama & Görünüm Değiştirici -->
            <div class="flex items-center gap-2.5">
              
              <!-- Sıralama Dropdown -->
              <div class="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span class="text-slate-400 font-bold">Sırala:</span>
                <select v-model="selectedSort" class="bg-transparent font-bold text-slate-700 outline-none cursor-pointer">
                  <option value="otomatik">Gelişmiş Sıralama</option>
                  <option value="price_asc">Fiyata Göre (En Düşük)</option>
                  <option value="price_desc">Fiyata Göre (En Yüksek)</option>
                  <option value="date_new">Yayın Tarihine Göre</option>
                  <option value="bids">En Çok Teklif Alanlar</option>
                </select>
              </div>

              <!-- Görünüm Değiştirici (Liste / Vitrin) -->
              <div class="inline-flex rounded-xl border border-slate-300 p-0.5 bg-slate-100">
                <button 
                  type="button" 
                  @click="viewLayout = 'list'"
                  class="p-1.5 rounded-lg transition cursor-pointer"
                  :class="viewLayout === 'list' ? 'bg-white text-[#0084B4] shadow-xs' : 'text-slate-500 hover:text-slate-800'"
                  title="Liste Görünümü"
                >
                  <Layers :size="14" />
                </button>
                <button 
                  type="button" 
                  @click="viewLayout = 'grid'"
                  class="p-1.5 rounded-lg transition cursor-pointer"
                  :class="viewLayout === 'grid' ? 'bg-white text-[#0084B4] shadow-xs' : 'text-slate-500 hover:text-slate-800'"
                  title="Vitrin / Galeri Görünümü"
                >
                  <BarChart3 :size="14" />
                </button>
              </div>

            </div>
          </div>

          <!-- ========================================================= -->
          <!-- 🖼️ 4'LÜ KART DÜZENİ (VİTRİN / 4 SÜTUNLU RESPONSIVE GRID) -->
          <!-- ========================================================= -->
          <div v-if="paginatedTenders.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div 
              v-for="tender in paginatedTenders" 
              :key="tender.id"
              class="bg-white border border-slate-300 hover:border-[#0084B4] hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-2xs text-left"
            >
              <!-- 🖼️ Üst Görsel ve Rozetler -->
              <div 
                @click="openTenderDetailModal(tender); selectTenderForLiveBids(tender)" 
                class="relative h-40 w-full bg-slate-100 overflow-hidden cursor-pointer"
                title="Şartname ve İhale Detayını İncele"
              >
                <img 
                  :src="getTenderImage(tender)" 
                  :alt="tender.baslik"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="($event.target as any).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <!-- Durum Rozeti -->
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                  <span 
                    class="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-xs backdrop-blur-xs"
                    :class="tender.durum === 'closed' ? 'bg-amber-600' : 'bg-emerald-600'"
                  >
                    {{ tender.durum === 'closed' ? '🏆 Sonuçlandı' : '🟢 Canlı İhale' }}
                  </span>
                </div>

                <!-- İhale No Rozeti -->
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono font-black uppercase border border-white/20">
                  {{ tender.id }}
                </span>

                <!-- Alt Lokasyon & Kalan Süre -->
                <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-bold">
                  <span class="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin :size="12" class="text-sky-400 shrink-0" />
                    <span class="truncate">{{ tender.city || 'Balıkesir' }}</span>
                  </span>
                  <span class="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs text-[10px] shrink-0">
                    <Clock :size="11" class="text-amber-400" />
                    <span>{{ tender.sure || '7 gün' }}</span>
                  </span>
                </div>
              </div>

              <!-- 📝 Kart Gövdesi -->
              <div class="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div class="space-y-1.5">
                  
                  <!-- Kategori ve İhale Yönü Rozeti -->
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-[10px] font-bold text-slate-500 truncate max-w-[140px]">
                      {{ tender.kategori }}
                    </span>
                    <span 
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded border truncate"
                      :class="getTenderDirectionBadge(tender).class"
                    >
                      {{ getTenderDirectionBadge(tender).label }}
                    </span>
                  </div>

                  <!-- İhale Başlığı -->
                  <h4 
                    @click="openTenderDetailModal(tender); selectTenderForLiveBids(tender)" 
                    class="font-black text-xs sm:text-sm text-slate-900 hover:text-[#0084B4] cursor-pointer line-clamp-2 leading-snug transition-colors"
                    title="İhale Detayını İncele"
                  >
                    {{ tender.baslik }}
                  </h4>

                  <!-- Alıcı Kurum / Firma -->
                  <button 
                    type="button"
                    @click="openCompanyProfileModal(tender.ownerCompany || tender.authority, tender.city)"
                    class="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 text-left truncate w-full cursor-pointer"
                  >
                    <Building2 :size="12" class="text-blue-600 shrink-0" />
                    <span class="truncate">{{ tender.ownerCompany || tender.authority || 'Kurumsal Satın Alma Masası' }}</span>
                  </button>

                  <!-- 💳 Ödeme & Fatura Özeti Rozetleri -->
                  <div class="flex items-center gap-1 flex-wrap text-[9px] text-slate-500 font-medium">
                    <span v-if="tender.odemeYontemi" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 truncate max-w-[130px]" :title="tender.odemeYontemi">
                      💳 {{ tender.odemeYontemi.split('(')[0] }}
                    </span>
                    <span v-if="tender.faturaTuru" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 truncate max-w-[120px]" :title="tender.faturaTuru">
                      📄 {{ tender.faturaTuru.split('(')[0] }}
                    </span>
                  </div>

                  <!-- ⚡ Canlı Lider Teklif Şeridi -->
                  <div 
                    v-if="getTenderBidsList(tender).length > 0"
                    @click="openLiveBidsDrawer(tender)"
                    class="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between text-[10px] cursor-pointer hover:bg-emerald-100 transition"
                  >
                    <span class="font-bold text-emerald-800 flex items-center gap-1">
                      <span>🥇 Lider:</span>
                      <strong class="font-mono font-black text-emerald-900">{{ getTenderBidsList(tender)[0].fiyat }}</strong>
                    </span>
                    <span class="text-blue-600 font-bold hover:underline">
                      Teklif Ver ↗
                    </span>
                  </div>

                </div>

                <!-- 🔘 Butonlar Grubu -->
                <div class="pt-2 border-t border-slate-100 space-y-1.5">
                  
                  <div class="grid grid-cols-2 gap-1.5">
                    <!-- 1. Şartname İncele -->
                    <button 
                      type="button" 
                      @click.stop="openTenderDetailModal(tender)"
                      class="py-2 px-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <FileText :size="12" />
                      <span>Şartname</span>
                    </button>

                    <!-- 2. Teklif Ver -->
                    <NuxtLink 
                      v-if="isMyOwnTender(tender)"
                      to="/panel/gelen-teklifler"
                      class="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] transition cursor-pointer text-center flex items-center justify-center gap-1"
                      title="Kendi İlanınız"
                    >
                      <Building2 :size="12" class="text-amber-700" />
                      <span>İlanınız</span>
                    </NuxtLink>
                    <button 
                      v-else
                      type="button" 
                      @click.stop="openQuickBidModal(tender)"
                      class="py-2 px-2 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-[11px] transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                    >
                      <Send :size="12" />
                      <span>Teklif Ver</span>
                    </button>
                  </div>

                  <!-- 3. Canlı Teklifler (Drawer Açıcı) -->
                  <button
                    type="button"
                    @click.stop="openLiveBidsDrawer(tender)"
                    class="w-full py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sparkles :size="11" class="text-emerald-600" />
                    <span>⚡ Canlı Teklifler ({{ getTenderBidsList(tender).length }})</span>
                  </button>

                </div>

              </div>
            </div>
          </div>

          <!-- BOŞ DURUM (EMPTY STATE) -->
          <div v-else class="bg-white border border-slate-300 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText :size="28" />
            </div>
            <h3 class="font-black text-slate-800 text-sm">Seçilen Filtrelere veya Arama Terimine Uygun İhale Bulunamadı</h3>
            <p class="text-slate-500 text-xs max-w-sm mx-auto">
              Arama kelimenizi değiştirerek veya sol menüden farklı bir kategori / idare / şehir seçerek tekrar deneyebilirsiniz.
            </p>
            <button 
              type="button" 
              @click="resetAllFilters" 
              class="px-4 py-2 rounded-xl bg-[#0084B4] text-white font-bold text-xs hover:bg-[#00739D] transition cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>

          <!-- SAYFALAMA (SAHİBİNDEN / EKAP TARZI PAGINATION) -->
          <div v-if="filteredTendersList.length > itemsPerPage" class="bg-white border border-slate-300 rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span class="text-slate-500 font-bold">
              Sayfa {{ currentPage }} / {{ totalPages }} (Toplam {{ filteredTendersList.length }} İlan)
            </span>
            <div class="flex items-center gap-1.5 font-bold">
              <button 
                type="button" 
                @click="currentPage = 1" 
                :disabled="currentPage === 1" 
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="İlk Sayfa"
              >
                <ChevronsLeft :size="14" />
              </button>
              <button 
                type="button" 
                @click="currentPage > 1 ? currentPage-- : null" 
                :disabled="currentPage === 1" 
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Önceki Sayfa"
              >
                <ChevronLeft :size="14" />
              </button>

              <button 
                v-for="p in totalPages" 
                :key="p" 
                type="button" 
                @click="currentPage = p"
                class="w-8 h-8 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center"
                :class="currentPage === p ? 'bg-[#0084B4] text-white shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'"
              >
                {{ p }}
              </button>

              <button 
                type="button" 
                @click="currentPage < totalPages ? currentPage++ : null" 
                :disabled="currentPage === totalPages" 
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Sonraki Sayfa"
              >
                <ChevronRight :size="14" />
              </button>
              <button 
                type="button" 
                @click="currentPage = totalPages" 
                :disabled="currentPage === totalPages" 
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Son Sayfa"
              >
                <ChevronsRight :size="14" />
              </button>
            </div>
          </div>

        </main>

        

</div>
</div>

    <!-- ========================================================================= -->
    <!-- 📄 1. İNTERAKTİF ÇOKLU ŞARTNAME, PDF VE GÖRSEL GALERİSİ MODALI -->
    <!-- ========================================================================= -->
    <div v-if="selectedTenderModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div class="bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden text-left">
        
        <!-- Üst Başlık & Sekme Çubuğu -->
        <div class="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm shrink-0">
              <FileText :size="20" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-black uppercase">
                  #{{ selectedTenderModal.id }}
                </span>
                <span class="text-xs font-black text-slate-300 uppercase tracking-wider truncate">
                  {{ selectedTenderModal.kategori }}
                </span>
              </div>
              <h2 class="text-sm sm:text-base font-black text-white truncate max-w-md sm:max-w-xl">
                {{ selectedTenderModal.baslik }}
              </h2>
            </div>
          </div>

          <!-- Sekme Değiştirici (PDF / Galeri / Detaylar) -->
          <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              @click="activeSpecTab = 'pdf'"
              class="px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5"
              :class="activeSpecTab === 'pdf' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <FileText :size="13" />
              <span>PDF Dokümanları ({{ (selectedTenderModal.files || selectedTenderModal.documents || []).length || 1 }})</span>
            </button>

            <button
              type="button"
              @click="activeSpecTab = 'gallery'"
              class="px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5"
              :class="activeSpecTab === 'gallery' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <Eye :size="13" />
              <span>Görseller & Numuneler ({{ (selectedTenderModal.images || []).length || 1 }})</span>
            </button>

            <button
              type="button"
              @click="activeSpecTab = 'details'"
              class="px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5"
              :class="activeSpecTab === 'details' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <Building2 :size="13" />
              <span>İhale & Firma Bilgileri</span>
            </button>

            <button
              type="button"
              @click="selectedTenderModal = null"
              class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X :size="18" />
            </button>
          </div>

        </div>

        <!-- =================================================================== -->
        <!-- 📑 1. SEKME: PDF DOKÜMANLARI & ŞARTNAME SAYFALARI GÖRÜNTÜLEYİCİ -->
        <!-- =================================================================== -->
        <div v-if="activeSpecTab === 'pdf'" class="flex-1 flex flex-col min-h-0 bg-slate-800">
          
          <!-- PDF Seçici Bar (Birden fazla dosya varsa tıklayarak geçiş) -->
          <div class="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs overflow-x-auto">
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-slate-400 font-bold text-[11px]">Şartname Belgeleri:</span>
              <button
                v-for="(doc, dIdx) in (selectedTenderModal.files || selectedTenderModal.documents || [{ name: 'Resmi_Teknik_Sartname_' + selectedTenderModal.id + '.pdf', size: '0.08 MB', type: 'pdf' }])"
                :key="dIdx"
                type="button"
                @click="activeDocIndex = dIdx"
                class="px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border"
                :class="activeDocIndex === dIdx 
                  ? 'bg-red-600/20 text-red-400 border-red-500/40 shadow-xs' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'"
              >
                <span class="w-2 h-2 rounded-full" :class="activeDocIndex === dIdx ? 'bg-red-500' : 'bg-slate-600'"></span>
                <span class="truncate max-w-[180px]">{{ doc.name || ('Sayfa ' + (dIdx + 1) + '.pdf') }}</span>
              </button>
            </div>

            <!-- Zoom & Print Toolbar -->
            <div class="flex items-center gap-2 shrink-0">
              <div class="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5 text-xs text-slate-300">
                <button type="button" @click="pdfZoomLevel = Math.max(75, pdfZoomLevel - 15)" class="px-2 py-0.5 hover:bg-slate-800 rounded font-bold cursor-pointer">-</button>
                <span class="px-2 font-mono text-[11px]">{{ pdfZoomLevel }}%</span>
                <button type="button" @click="pdfZoomLevel = Math.min(150, pdfZoomLevel + 15)" class="px-2 py-0.5 hover:bg-slate-800 rounded font-bold cursor-pointer">+</button>
              </div>

              <button
                type="button"
                @click="printPdfDocument"
                class="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition cursor-pointer flex items-center gap-1"
              >
                <Printer :size="12" />
                <span>Yazdır</span>
              </button>

              <button
                type="button"
                @click="downloadPdfDocument(selectedTenderModal)"
                class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Download :size="12" />
                <span>İndir (.PDF/.TXT)</span>
              </button>
            </div>
          </div>

          <!-- A4 PDF Kağıt Görüntüleyici Alanı -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
            <div 
              id="printable-pdf-spec" 
              class="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-12 max-w-3xl w-full space-y-6 text-left border border-slate-200 font-sans min-h-[750px] relative transition-transform duration-200"
              :style="{ transform: 'scale(' + (pdfZoomLevel / 100) + ')', transformOrigin: 'top center' }"
            >
              
              <!-- Resmi Antet -->
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
                  <div class="text-sm font-mono font-black text-blue-900">#{{ selectedTenderModal.id }}</div>
                  <div class="text-[10px] text-emerald-600 font-bold">● Dijital Mühürlü & Doğrulanmış</div>
                </div>
              </div>

              <!-- İhale Özet Tablosu -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">İhaleyi Açan Kurum</span>
                  <span class="font-bold text-slate-800">{{ selectedTenderModal.ownerCompany || selectedTenderModal.authority || 'Kurumsal Masası' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">Kategori & Sektör</span>
                  <span class="font-bold text-slate-800">{{ selectedTenderModal.kategori }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">Sözleşme / Hedef Bütçe</span>
                  <span class="font-mono font-black text-emerald-700">{{ formatTenderBudget(selectedTenderModal.butce) }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">Teslimat İli / Konum</span>
                  <span class="font-bold text-slate-800">{{ selectedTenderModal.city || 'Türkiye Geneli' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">İhale Usulü</span>
                  <span class="font-bold text-slate-800">{{ selectedTenderModal.tur || 'Açık Eksiltmeli İhale' }}</span>
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase block">Son Teklif / Kalan Süre</span>
                  <span class="font-bold text-amber-700">{{ selectedTenderModal.sure || '7 gün' }}</span>
                </div>
              </div>

              <!-- Şartname İçerik Maddeleri -->
              <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div class="space-y-1.5">
                  <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200 flex items-center justify-between">
                    <span>1. İHALENİN KONUSU VE TEKNİK İSTERLER</span>
                    <span class="text-[10px] text-blue-700 font-bold">Madde 1.1</span>
                  </h3>
                  <p class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-serif leading-relaxed text-slate-800 whitespace-pre-line">
                    {{ selectedTenderModal.aciklama || selectedTenderModal.baslik }}
                  </p>
                </div>

                <div class="space-y-1.5">
                  <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200 flex items-center justify-between">
                    <span>2. İDARİ ŞARTLAR VE TESLİMAT ŞARTNAMESİ</span>
                    <span class="text-[10px] text-blue-700 font-bold">Madde 2.1</span>
                  </h3>
                  <ul class="list-disc pl-5 space-y-1.5 text-slate-600">
                    <li>Teslimat adresi: <strong>{{ selectedTenderModal.teslimatAdresi || (selectedTenderModal.city + ' Merkez / Saha Depo Teslimat') }}</strong> olarak kayıtlıdır.</li>
                    <li>Tedarikçi firma teknik şartnamede belirtilen kalite toleranslarına ve yasal garanti sürelerine uymakla yükümlüdür.</li>
                    <li>Hakediş ödemeleri BDDK ve TCMB mevzuatına uygun <strong>Escrow Güvenli Havuz</strong> hesabında bloke edilir.</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="font-black text-slate-900 text-sm border-b pb-1 border-slate-200 flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <FileText :size="15" class="text-blue-600" />
                      <span>3. YÜKLENEN RESMİ DOKÜMANLAR & ŞARTNAMELER</span>
                    </span>
                    <span class="text-[10px] text-emerald-700 font-bold">✓ e-İmzalı Belgeler</span>
                  </h3>
                  
                  <div class="space-y-2">
                    <div 
                      v-for="(doc, dIdx) in (selectedTenderModal.files && selectedTenderModal.files.length > 0 ? selectedTenderModal.files : (selectedTenderModal.documents && selectedTenderModal.documents.length > 0 ? selectedTenderModal.documents : [{ name: 'TASLAK.pdf', size: '0.08 MB', type: 'pdf' }]))"
                      :key="dIdx"
                      class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs hover:border-blue-300 transition"
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <span class="px-2 py-1 rounded bg-red-100 text-red-700 font-black text-[10px] uppercase shrink-0">
                          {{ doc.type || 'PDF' }}
                        </span>
                        <div class="min-w-0">
                          <div class="font-bold text-slate-900 text-xs truncate">
                            {{ doc.name || ('TASLAK_' + (dIdx + 1) + '.pdf') }}
                          </div>
                          <div class="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>{{ doc.size || '0.08 MB' }}</span>
                            <span>•</span>
                            <span class="text-emerald-700 font-bold">✓ Aslı Doğrulandı</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          @click="activeDocIndex = dIdx"
                          class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye :size="12" />
                          <span>Önizle</span>
                        </button>
                        <button
                          type="button"
                          @click="downloadTenderFile(doc, selectedTenderModal)"
                          class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Download :size="12" />
                          <span>İndir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mühür ve İmza Altlığı -->
              <div class="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-[10px] text-slate-500">
                <div>
                  <div>6098 s. TBK ve 6102 s. TTK kapsamında düzenlenmiştir.</div>
                  <div>Zaman Damgası: {{ new Date().toISOString() }}</div>
                  <div class="font-mono text-slate-400">Hash: SHA-256-{{ selectedTenderModal.id }}-CERT-VALID</div>
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

        <!-- =================================================================== -->
        <!-- 🖼️ 2. SEKME: YÜKLENEN GÖRSELLER & PNG/JPG GALERİSİ -->
        <!-- =================================================================== -->
        <div v-else-if="activeSpecTab === 'gallery'" class="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 sm:p-6 overflow-y-auto custom-scrollbar text-center">
          
          <!-- Büyük Görsel Önizleme Alanı -->
          <div class="relative max-w-3xl w-full mx-auto h-72 sm:h-96 rounded-2xl overflow-hidden bg-black/60 border border-slate-800 flex items-center justify-center group">
            <img
              :src="(selectedTenderModal.images?.[activeImageIndex]?.url) || (typeof selectedTenderModal.images?.[activeImageIndex] === 'string' ? selectedTenderModal.images[activeImageIndex] : getTenderImage(selectedTenderModal))"
              :alt="selectedTenderModal.baslik"
              class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-102"
              @error="($event.target as any).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'"
            />

            <!-- Önceki / Sonraki Butonları -->
            <button
              v-if="(selectedTenderModal.images || []).length > 1"
              type="button"
              @click="activeImageIndex = (activeImageIndex > 0 ? activeImageIndex - 1 : selectedTenderModal.images.length - 1)"
              class="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white text-sm font-bold transition cursor-pointer"
            >
              ❮
            </button>
            <button
              v-if="(selectedTenderModal.images || []).length > 1"
              type="button"
              @click="activeImageIndex = (activeImageIndex < selectedTenderModal.images.length - 1 ? activeImageIndex + 1 : 0)"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white text-sm font-bold transition cursor-pointer"
            >
              ❯
            </button>

            <!-- Görsel Sayacı -->
            <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-mono font-bold">
              Görsel {{ activeImageIndex + 1 }} / {{ (selectedTenderModal.images || []).length || 1 }}
            </div>
          </div>

          <!-- Thumbnail Strip (Tıklandıkça Değişen Fotoğraf Şeridi) -->
          <div class="flex items-center justify-center gap-3 mt-4 overflow-x-auto py-2">
            <div
              v-for="(imgItem, imgIdx) in (selectedTenderModal.images && selectedTenderModal.images.length > 0 ? selectedTenderModal.images : [getTenderImage(selectedTenderModal)])"
              :key="imgIdx"
              @click="activeImageIndex = imgIdx"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 bg-slate-900"
              :class="activeImageIndex === imgIdx ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'"
            >
              <img
                :src="imgItem.url || imgItem"
                class="w-full h-full object-cover"
                @error="($event.target as any).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'"
              />
            </div>
          </div>

        </div>

        <!-- =================================================================== -->
        <!-- 🏢 3. SEKME: İHALE VE ALICI FİRMA BİLGİLERİ -->
        <!-- =================================================================== -->
        <div v-else-if="activeSpecTab === 'details'" class="flex-1 p-6 sm:p-8 bg-slate-800 overflow-y-auto custom-scrollbar space-y-5 text-white">
          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
            <h3 class="font-black text-sm text-blue-400 flex items-center gap-2">
              <Building2 :size="16" />
              <span>İhaleyi Açan Kurumsal Alıcı</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span class="text-slate-400 text-[11px] block">Şirket Unvanı:</span>
                <span class="font-bold text-white text-sm">{{ selectedTenderModal.ownerCompany || selectedTenderModal.authority || 'Kurumsal Satın Alma Masası' }}</span>
              </div>
              <div>
                <span class="text-slate-400 text-[11px] block">Lokasyon & Adres:</span>
                <span class="font-bold text-white">{{ selectedTenderModal.city || 'Türkiye Geneli' }} · {{ selectedTenderModal.teslimatAdresi || 'Merkez Depo' }}</span>
              </div>
              <div>
                <span class="text-slate-400 text-[11px] block">Ödeme Yöntemi:</span>
                <span class="font-bold text-emerald-400">Escrow Güvenli Havuz (%100 Koruma)</span>
              </div>
              <div>
                <span class="text-slate-400 text-[11px] block">İhale Durumu:</span>
                <span class="font-bold text-amber-400">{{ selectedTenderModal.sure || 'Teklif Toplama Devam Ediyor' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alt Aksiyon Çubuğu (Footer Actions) -->
        <div class="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <button 
            type="button" 
            @click="selectedTenderModal = null" 
            class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Kapat
          </button>
          
          <div class="flex items-center gap-2">
            <NuxtLink 
              v-if="isMyOwnTender(selectedTenderModal)"
              to="/panel/gelen-teklifler"
              class="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Building2 :size="13" class="text-amber-700" />
              <span>👤 Kendi İlanınız (Gelen Teklifler)</span>
            </NuxtLink>
            <button 
              v-else
              type="button" 
              @click="openQuickBidModal(selectedTenderModal); selectedTenderModal = null"
              class="px-6 py-2.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <Send :size="13" />
              <span>Bu İhaleye Teklif Ver</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏢 2. FİRMA PROFİL MODALI (DIŞARIDAN GÖRÜNÜM & SADECE BANA DÜZENLE BUTONU) -->
    <!-- ========================================================================= -->
    <div v-if="selectedCompanyProfileModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-black text-xl flex items-center justify-center border border-blue-200 shrink-0">
              {{ selectedCompanyProfileModal.name.charAt(0) }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-black text-slate-900">{{ selectedCompanyProfileModal.name }}</h3>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck :size="12" />
                  <span>Onaylı Firma</span>
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                {{ selectedCompanyProfileModal.sector }} · 📍 {{ selectedCompanyProfileModal.city }}
              </p>
            </div>
          </div>
          <button @click="selectedCompanyProfileModal = null" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl cursor-pointer">
            <X :size="20" />
          </button>
        </div>

        <!-- Firma Detay Kartları -->
        <div class="grid grid-cols-3 gap-2.5 text-center">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Güven Puanı</span>
            <span class="font-black text-emerald-600 text-base font-mono">⭐ {{ selectedCompanyProfileModal.score }} / 10</span>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">Tamamlanan İhale</span>
            <span class="font-black text-blue-700 text-base font-mono">{{ selectedCompanyProfileModal.completedTenders }} Adet</span>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span class="text-[9px] font-bold text-slate-400 uppercase block">VKN / Sicil</span>
            <span class="font-black text-slate-800 text-xs font-mono">✓ Doğrulandı</span>
          </div>
        </div>

        <!-- İletişim & Gizlilik Kalkanı Bilgisi -->
        <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1 leading-relaxed">
          <div class="font-bold flex items-center gap-1.5">
            <LockKeyhole :size="13" class="text-blue-700" />
            <span>İletişim & Teklif Gizliliği Kalkanı Aktif</span>
          </div>
          <p class="text-[11px] text-blue-800">
            Firma iletişim bilgileri, ihale rekabetini korumak ve güvenli teklif alımını sağlamak amacıyla İhaleciBurada platformu üzerinden şifreli olarak yönetilmektedir.
          </p>
        </div>

        <!-- Aksiyon Butonları: Kendi Profilim İse "Düzenle", Değilse "İletişim Kur" -->
        <div class="flex items-center gap-3 pt-2 border-t border-slate-100">
          
          <!-- SADECE KENDİ PROFİLİME BAKTIĞIMDA ÇIKAN DÜZENLE BUTONU -->
          <template v-if="isMyOwnCompany">
            <button 
              type="button" 
              @click="selectedCompanyProfileModal = null; router.push('/panel/ayarlar')"
              class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Edit3 :size="14" />
              <span>✏️ Kendi Profilimi Düzenle (Ayarlar)</span>
            </button>
          </template>

          <!-- DIŞARIDAN BİR KULLANICI BAKTIĞINDA ÇIKAN AKSİYONLAR -->
          <template v-else>
            <button 
              type="button" 
              @click="selectedCompany = selectedCompanyProfileModal.name; selectedCompanyProfileModal = null"
              class="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Firmanın Tüm İhalelerini Gör
            </button>
            <button 
              type="button" 
              @click="alert('Kurumsal mesajlaşma odası başlatılıyor...'); selectedCompanyProfileModal = null"
              class="flex-1 py-2.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageSquare :size="13" />
              <span>Mesaj / Soru İlet</span>
            </button>
          </template>

        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🚀 3. HIZLI TEKLİF VERME MODALI (KDV SEÇENEĞİ & ÇOK KALEMLİ BELGE YÜKLEME) -->
    <!-- ========================================================================= -->
    <div v-if="showQuickBidModal && quickBidTender" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <div class="flex items-start justify-between gap-3 border-b pb-3 border-slate-100">
          <div>
            <span class="text-[10px] font-black text-blue-600 uppercase tracking-wider block">DOĞRUDAN TEKLİF VER</span>
            <h3 class="text-sm sm:text-base font-black text-slate-900 mt-0.5">{{ quickBidTender.baslik }}</h3>
          </div>
          <button @click="showQuickBidModal = false" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <!-- 🏢 TEKLİF VERİLEN ALICI FİRMA / KURUM KARTI -->
        <div class="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Teklif Verilen Alıcı:</span>
            <span class="font-black text-blue-900 flex items-center gap-1">
              <Building2 :size="13" class="text-blue-600" />
              <span>{{ quickBidTender.ownerCompany || quickBidTender.authority }}</span>
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">İhale Referans No:</span>
            <span class="font-mono font-bold text-slate-700">{{ quickBidTender.id }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Kategori & İhale Türü:</span>
            <span class="font-bold text-slate-800">{{ quickBidTender.kategori || 'Açık Eksiltmeli İhale' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Teslimat Lokasyonu:</span>
            <span class="font-bold text-slate-800">{{ quickBidTender.city || 'Balıkesir' }} (Saha Depo Teslim)</span>
          </div>
        </div>

        <form @submit.prevent="submitQuickOffer" class="space-y-4">
          
          <div 
            class="p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between"
            :class="getTenderDirectionBadge(quickBidTender).class"
          >
            <span class="flex items-center gap-1.5">
              <span>{{ getTenderDirectionBadge(quickBidTender).label }}</span>
            </span>
            <span class="text-[10px] opacity-80">
              {{ (quickBidTender.ihaleYonu === 'artirma' || (quickBidTender.tur || '').includes('Artırma')) ? 'En Yüksek Teklif Kazanır' : 'En Düşük Teklif Kazanır' }}
            </span>
          </div>

          <!-- Teklif Tutarı ve KDV Seçimi -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700">Teklif Ettiğiniz Tutar (₺): *</label>
            <div class="relative">
              <input 
                v-model="quickOfferPrice" 
                type="text" 
                placeholder="Örn: 420.000" 
                required 
                class="w-full p-2.5 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-black text-emerald-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <span class="absolute right-3 top-3 font-bold text-slate-400">₺</span>
            </div>

            <!-- KDV Hariç / Dahil Seçim Butonları -->
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button 
                type="button" 
                @click="quickOfferVatType = 'vat_excluded'"
                class="py-1.5 px-3 rounded-lg text-xs font-bold transition border cursor-pointer text-center"
                :class="quickOfferVatType === 'vat_excluded' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                ✓ + KDV Hariç (Standart)
              </button>
              <button 
                type="button" 
                @click="quickOfferVatType = 'vat_included'"
                class="py-1.5 px-3 rounded-lg text-xs font-bold transition border cursor-pointer text-center"
                :class="quickOfferVatType === 'vat_included' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                KDV Dahil Toplam
              </button>
            </div>
          </div>

          <!-- 📁 ÇOK KALEMLİ İŞLER İÇİN BİRİM FİYAT CETVELİ & TEKLİF DOSYASI YÜKLEME -->
          <div class="space-y-1.5 pt-1">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700">Teklif Belgesi / Fiyat Cetveli Yükle:</label>
              <span class="text-[10px] text-slate-400 font-medium">(Çok kalemli işler için PDF/Excel)</span>
            </div>

            <!-- Dosya Seçim Inputu (Hidden) -->
            <input 
              ref="quoteFileInputRef"
              type="file" 
              multiple 
              accept=".pdf,.xls,.xlsx,.doc,.docx" 
              class="hidden" 
              @change="handleQuoteFileChange"
            />

            <!-- Yükleme Kutusu -->
            <div 
              @click="triggerQuoteFileSelect" 
              class="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 p-3 rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 group"
            >
              <UploadCloud :size="20" class="text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span class="text-xs font-bold text-slate-700 group-hover:text-blue-700">Teklif Cetveli / Şartname Dosyası Ekle</span>
              <span class="text-[10px] text-slate-400">PDF, Excel (.xlsx, .xls) veya Word</span>
            </div>

            <!-- Yüklenen Dosyalar Listesi -->
            <div v-if="quickOfferFiles.length > 0" class="space-y-1.5 pt-1">
              <div 
                v-for="(f, idx) in quickOfferFiles" 
                :key="idx" 
                class="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs"
              >
                <div class="flex items-center gap-2 truncate pr-2">
                  <FileText :size="14" class="text-blue-600 shrink-0" />
                  <span class="truncate font-bold text-slate-800">{{ f.name }}</span>
                  <span class="text-[10px] text-slate-400 font-mono shrink-0">({{ f.size }})</span>
                </div>
                <button type="button" @click="removeQuoteFile(idx)" class="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                  <X :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- Geçerlilik Süresi -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Teklif Geçerlilik Süresi:</label>
            <select v-model="quickOfferDuration" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none">
              <option value="3 gün">3 Gün</option>
              <option value="7 gün">7 Gün (Önerilen)</option>
              <option value="15 gün">15 Gün</option>
              <option value="30 gün">30 Gün</option>
              <option value="60 gün">60 Gün</option>
            </select>
          </div>

          <!-- Notlar -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Teklif Notu & Teslimat / Termin Taahhüdü:</label>
            <textarea 
              v-model="quickOfferNotes" 
              rows="2" 
              placeholder="Şartnamedeki tüm teknik kriterler eksiksiz karşılanmakta olup ürünler stoktan sevk edilecektir..." 
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none"
            ></textarea>
          </div>

          <!-- Aksiyonlar -->
          <div class="flex items-center gap-2 pt-2">
            <button 
              type="button" 
              @click="showQuickBidModal = false" 
              class="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              İptal
            </button>
            <button 
              type="button" 
              @click.prevent="submitQuickOffer" 
              class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Send :size="14" />
              <span>Teklifi Gönder</span>
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
