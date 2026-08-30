<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
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
const viewLayout = ref<'list' | 'grid'>('list') // 'list' = Sahibinden Liste Görünümü, 'grid' = Vitrin Görünümü
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

const { cmsData } = useCmsData()
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
  // --- BAKANLIKLAR & MERKEZİ İDARELER ---
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
  
  // --- GENEL MÜDÜRLÜKLER, KİT & KAMU KURULUŞLARI ---
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

  // --- BÜYÜKŞEHİR VE İL BELEDİYELERİ ---
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

  // --- ÜNİVERSİTELER & TEKNOPARKLAR ---
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
  { name: 'Bilişim Vadisi Teknopark', type: 'Üniversite & Teknokent', city: 'Kocaeli', icon: '🚀' },
  { name: 'İTÜ ARI Teknokent', type: 'Üniversite & Teknokent', city: 'İstanbul', icon: '🚀' },
  { name: 'ODTÜ Teknokent', type: 'Üniversite & Teknokent', city: 'Ankara', icon: '🚀' },

  // --- ORGANİZE SANAYİ BÖLGELERİ & ODALAR ---
  { name: 'Çanakkale OSB & Sanayi Odası', type: 'OSB & Sanayi Odası', city: 'Çanakkale', icon: '🏭' },
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
  { name: 'Balıkesir Organize Sanayi Bölgesi', type: 'OSB & Sanayi Odası', city: 'Balıkesir', icon: '🏭' },

  // --- ÖZEL SEKTÖR B2B SATIN ALMA MASALARI ---
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
const allCompaniesList = [
  { name: 'Çanakkale Mimarlık & Altyapı A.Ş.', city: 'Çanakkale', sector: 'İnşaat & Yapı', verified: true, score: 9.8, vkn: '4700854210', completedTenders: 28, contactProtection: true },
  { name: 'Ege Tıbbi Sistemler ve Medikal Ltd.', city: 'İzmir', sector: 'Sağlık & Medikal', verified: true, score: 9.9, vkn: '3210984567', completedTenders: 42, contactProtection: true },
  { name: 'Bursa Tarım & Sera Üretim A.Ş.', city: 'Bursa', sector: 'Gıda & Tarım', verified: true, score: 9.9, vkn: '1987654320', completedTenders: 34, contactProtection: true },
  { name: 'Anadolu Endüstriyel Boru ve Vana San.', city: 'Bursa', sector: 'Tesisat & Altyapı', verified: true, score: 9.7, vkn: '5647382910', completedTenders: 19, contactProtection: true },
  { name: 'Marmara Bilişim ve Siber Güvenlik A.Ş.', city: 'İstanbul', sector: 'Yazılım & Bilişim', verified: true, score: 9.9, vkn: '8901234567', completedTenders: 31, contactProtection: true },
  { name: 'Mega Filo Lojistik ve Taşımacılık', city: 'Kocaeli', sector: 'Nakliye & Lojistik', verified: true, score: 9.6, vkn: '2345678901', completedTenders: 56, contactProtection: true },
  { name: 'Başkent Enerji ve Trafo Sistemleri', city: 'Ankara', sector: 'Elektrik & Enerji', verified: true, score: 9.8, vkn: '7890123456', completedTenders: 22, contactProtection: true },
  { name: 'Akdeniz Gıda ve Soğuk Zincir Dağıtım', city: 'Antalya', sector: 'Gıda & Tarım', verified: true, score: 9.7, vkn: '4567890123', completedTenders: 38, contactProtection: true },
  { name: 'Eskişehir Gezer Vinç ve Makine İmalatı', city: 'Eskişehir', sector: 'Makine & İmalat', verified: true, score: 9.8, vkn: '6789012345', completedTenders: 15, contactProtection: true }
]

// ==================== 6. SEED / CANLI İHALE VERİLERİ (DOMATES & ÇİMENTO VB. KELİME TESTLERİ DAHİL) ====================
const seedTenders = [
  {
    id: 'IHC-2024-001',
    baslik: 'Kurumsal Ofis Mobilyaları ve Ergonomik Çalışma İstasyonları Alımı',
    kategori: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri',
    ownerCompany: 'Çanakkale Belediyesi Destek Hizmetleri Md.',
    authority: 'Çanakkale Belediyesi',
    city: 'Çanakkale',
    butce: '450.000 ₺',
    sure: '3 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 4,
    yayinTarihi: '28.08.2026',
    aciklama: '120 Adet Çalışma Masası, 45 Adet Fileli Yönetici Koltuğu ve Toplantı Masası Grubu alımı yapılacaktır. İrsaliye teslimatı Çanakkale Merkez Şantiyesine yapılacaktır.'
  },
  {
    id: 'IHC-2024-002',
    baslik: 'Şehir Hastaneleri İçin Dijital Röntgen, Ultrasonografi ve Biyokimya Cihazları Tedariği',
    kategori: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri',
    ownerCompany: 'T.C. Sağlık Bakanlığı Kamu Hastaneleri Genel Müdürlüğü',
    authority: 'T.C. Sağlık Bakanlığı',
    city: 'Ankara',
    butce: '3.800.000 ₺',
    sure: '5 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 7,
    yayinTarihi: '27.08.2026',
    aciklama: '2 Adet 64 Kesitli BT Cihazı, 4 Adet Renkli Doppler Ultrason ve 100.000 Testlik Biyokimya Otoanalizör reaktifi alımı ve 3 yıllık bakım garantisi dahil ihaledir.'
  },
  {
    id: 'IHC-2024-003',
    baslik: 'Tarihi Taş Mektep Restorasyonu, Çevre Düzenlemesi ve Peyzaj Yapım İşi',
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    ownerCompany: 'Balıkesir Büyükşehir Belediyesi Fen İşleri Daire Başkanlığı',
    authority: 'Balıkesir Büyükşehir Belediyesi',
    city: 'Balıkesir',
    butce: '5.250.000 ₺',
    sure: '7 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 3,
    yayinTarihi: '29.08.2026',
    aciklama: 'Kültür Varlıklarını Koruma Kurulu onaylı rölöve ve restorasyon projeleri doğrultusunda taş duvar derz yenileme, ahşap çatı konstrüksiyonu, çimento harçları ve aydınlatma işidir.'
  },
  {
    id: 'IHC-2024-013',
    baslik: 'Büyükşehir Sosyal Tesisleri ve Aşevleri İçin 50 Ton Salçalık ve Sofralık Domates Alımı',
    kategori: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri',
    ownerCompany: 'Bursa Tarım & Sera Üretim A.Ş.',
    authority: 'Bursa Büyükşehir Belediyesi',
    city: 'Bursa',
    butce: '850.000 ₺',
    sure: '4 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Doğrudan Temin',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 5,
    yayinTarihi: '30.08.2026',
    aciklama: 'Sosyal tesisler, aşevleri ve belediye yemekhaneleri için 1. sınıf sofralık ve salçalık domates, sera sebze ve taze tarım ürünleri toplu tedarik ihalesidir.'
  },
  {
    id: 'IHC-2024-004',
    baslik: 'Organize Sanayi Bölgesi İçin 5.000 Metre Doğalgaj Çelik Boru Hattı ve Basınç Düşürme İstasyonu',
    kategori: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri',
    ownerCompany: 'Ankara Sanayi Odası 1. OSB Müdürlüğü',
    authority: 'Ankara Sanayi Odası 1. OSB',
    city: 'Ankara',
    butce: '1.950.000 ₺',
    sure: '2 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Pazarlık Usulü',
    kaynak: 'Doğrudan B2B',
    durum: 'active',
    teklifSayisi: 5,
    yayinTarihi: '28.08.2026',
    aciklama: '12 inç API 5L Grade B çelik boru döşenmesi, katodik koruma, vana odaları ve RMS-A tipi basınç düşürme istasyonu anahtar teslim kurulum ihalesidir.'
  },
  {
    id: 'IHC-2024-005',
    baslik: 'Kurumsal Veri Merkezi Sunucu, Depolama (SAN) ve Ağ Güvenlik Duvarı Donanımları Alımı',
    kategori: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri',
    ownerCompany: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE) Teknopark Yönetimi',
    authority: 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)',
    city: 'İzmir',
    butce: '850.000 ₺',
    sure: '4 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 6,
    yayinTarihi: '26.08.2026',
    aciklama: '3 Adet Rack Tipi Sunucu (2x AMD EPYC, 512GB RAM), 10G Fiber switch grubu ve Next-Gen Firewall donanım tedariği ve devreye alma ihalesidir.'
  },
  {
    id: 'IHC-2024-006',
    baslik: 'Tarımsal Sulama Hatları İçin HDPE 100 Polietilen Boru ve Ek Parçaları Alımı',
    kategori: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri',
    ownerCompany: 'Devlet Su İşleri (DSİ) 25. Bölge Müdürlüğü',
    authority: 'Devlet Su İşleri (DSİ)',
    city: 'Bursa',
    butce: '2.100.000 ₺',
    sure: '1 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Doğrudan Temin',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 8,
    yayinTarihi: '28.08.2026',
    aciklama: 'Ø110 mm - Ø250 mm PN16 HDPE 100 boru (12.000 metre) ve elektrofüzyon ekleme parçaları alımı ihalesidir.'
  },
  {
    id: 'IHC-2024-007',
    baslik: 'Yurt İçi 120 Sefer Komple TIR Lojistik ve Paletli Taşımacılık Hizmeti',
    kategori: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri',
    ownerCompany: 'Mega Lojistik ve Dağıtım A.Ş.',
    authority: 'Mega Lojistik ve Dağıtım A.Ş.',
    city: 'Kocaeli',
    butce: '720.000 ₺',
    sure: '6 gün kaldı',
    tur: 'Hizmet Alımı',
    usul: 'Pazarlık Usulü',
    kaynak: 'Doğrudan B2B',
    durum: 'active',
    teklifSayisi: 4,
    yayinTarihi: '29.08.2026',
    aciklama: 'Gebze depolarından İç Anadolu ve Ege bölge depolarına 120 seferlik tenteli ve kapalı kasa komple tır sevkiyat ihalesidir.'
  },
  {
    id: 'IHC-2024-008',
    baslik: 'Sanayi Tesisleri İçin 4 Adet 20 Tonluk Gezer Köprülü Vinç ve Konveyör Sistemi',
    kategori: 'Endüstriyel Makine - Motor - Konveyör İhaleleri',
    ownerCompany: 'Eskişehir OSB Fabrika Tesisi',
    authority: 'Eskişehir OSB Fabrika Tesisi',
    city: 'Eskişehir',
    butce: '4.400.000 ₺',
    sure: '8 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 2,
    yayinTarihi: '25.08.2026',
    aciklama: '24 metre açıklıklı, 20 ton kaldırma kapasiteli çift kiriş gezer köprülü vinç imalatı, montajı ve CE test sertifikalandırma işidir.'
  },
  {
    id: 'IHC-2024-009',
    baslik: 'Belediye Hizmet Binaları ve Sosyal Tesisler İçin 800 kW Çatı Güneş Enerjisi (GES) Kurulumu',
    kategori: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri',
    ownerCompany: 'İstanbul Büyükşehir Belediyesi (İBB) Enerji A.Ş.',
    authority: 'İstanbul Büyükşehir Belediyesi (İBB)',
    city: 'İstanbul',
    butce: '6.800.000 ₺',
    sure: '4 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 9,
    yayinTarihi: '27.08.2026',
    aciklama: 'Tier-1 monokristal 550W half-cut güneş panelleri, string inverterler ve SCADA uzaktan izleme sistemi anahtar teslim kurulum ihalesidir.'
  },
  {
    id: 'IHC-2024-010',
    baslik: '1 Yıllık Kurumsal Personel Servis Taşımacılığı Hizmet Alımı (35 Hat, 16+1 ve 27+1 Araçlar)',
    kategori: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri',
    ownerCompany: 'Çanakkale Onsekiz Mart Üniversitesi (ÇOMÜ)',
    authority: 'Çanakkale Onsekiz Mart Üniversitesi (ÇOMÜ)',
    city: 'Çanakkale',
    butce: '1.350.000 ₺',
    sure: '2 gün kaldı',
    tur: 'Hizmet Alımı',
    usul: 'Pazarlık Usulü',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 4,
    yayinTarihi: '28.08.2026',
    aciklama: 'Terzioğlu ve Anafartalar yerleşkeleri ile şehir merkezi arası akademik/idari personel için 35 güzergahta servis taşımacılığı işidir.'
  },
  {
    id: 'IHC-2024-011',
    baslik: 'Devlet Karayolları 14. Bölge Ağır Bakım ve Asfalt Kaplama Onarım İşi',
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    ownerCompany: 'Karayolları Genel Müdürlüğü (KGM) 14. Bölge Md.',
    authority: 'Karayolları Genel Müdürlüğü (KGM)',
    city: 'Bursa',
    butce: '9.400.000 ₺',
    sure: '12 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 5,
    yayinTarihi: '24.08.2026',
    aciklama: 'Bursa - Yalova devlet yolu güzergahında 45 km bölünmüş yol bitümlü sıcak karışım (BSK) aşınma tabakası yenileme ve menfez işleridir.'
  },
  {
    id: 'IHC-2024-012',
    baslik: 'Güneydoğu Anadolu Toplu Konutları 800 Daire Elektrik Trafo ve Şebeke Dağıtım İşi',
    kategori: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri',
    ownerCompany: 'Toplu Konut İdaresi Başkanlığı (TOKİ)',
    authority: 'Toplu Konut İdaresi Başkanlığı (TOKİ)',
    city: 'Gaziantep',
    butce: '14.200.000 ₺',
    sure: '10 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 6,
    yayinTarihi: '22.08.2026',
    aciklama: '800 Konutluk yerleşim alanı için 4 adet 1600 kVA modüler hücreli trafo merkezi, OG/AG yer altı kablolama ve sokak aydınlatma yapımıdır.'
  }
]

// Görsel eşleştirme
function getTenderImage(tender: any): string {
  if (tender.images && tender.images.length > 0) {
    return tender.images[0].url || tender.images[0]
  }
  const text = (tender.baslik || '' + ' ' + tender.kategori || '').toLowerCase()
  if (text.includes('domates') || text.includes('tarım') || text.includes('gıda') || text.includes('sebze')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('mobilya') || text.includes('koltuk') || text.includes('masa')) {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('tıbbi') || text.includes('hastane') || text.includes('sağlık') || text.includes('röntgen')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('inşaat') || text.includes('restorasyon') || text.includes('bina') || text.includes('konut') || text.includes('asfalt')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('enerji') || text.includes('güneş') || text.includes('ges') || text.includes('trafo') || text.includes('elektrik')) {
    return 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('bilişim') || text.includes('sunucu') || text.includes('yazılım') || text.includes('donanım')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('lojistik') || text.includes('tır') || text.includes('nakliye') || text.includes('taşımacılık') || text.includes('servis')) {
    return 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('vinç') || text.includes('makine') || text.includes('motor') || text.includes('konveyör')) {
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('boru') || text.includes('kanalizasyon') || text.includes('tesisat') || text.includes('su') || text.includes('doğalgaz')) {
    return 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80'
  }
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
}

// ==================== 7. CANLI VERİLERİ BİRLEŞTİRME ====================
const allTenders = computed(() => {
  const cmsTenders = (cmsData.value?.dashboard?.tenders || []).filter(
    (t: any) => t.adminApproved !== false && t.durum !== 'pending_approval' && t.durum !== 'rejected'
  )
  
  let localTenders: any[] = []
  if (typeof window !== 'undefined') {
    try {
      localTenders = JSON.parse(localStorage.getItem('myTenders') || '[]').filter(
        (t: any) => t.adminApproved !== false && t.durum !== 'pending_approval' && t.durum !== 'rejected'
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
function openTenderDetailModal(tender: any) {
  selectedTenderModal.value = tender
  detailActiveTab.value = 'ilan'
}

// Firma Profil Modalı Açıcı (Dışarıdan Görünüm & Düzenle Butonu Kontrolü)
function openCompanyProfileModal(companyName: string, city: string = 'Türkiye Geneli') {
  const found = allCompaniesList.find(c => c.name.toLowerCase().includes(companyName.toLowerCase()) || companyName.toLowerCase().includes(c.name.toLowerCase()))
  
  selectedCompanyProfileModal.value = {
    name: companyName,
    city: found?.city || city || 'Türkiye Geneli',
    sector: found?.sector || 'Kurumsal Satın Alma & Tedarik',
    verified: true,
    score: found?.score || 9.8,
    vkn: found?.vkn || '4700854210',
    completedTenders: found?.completedTenders || 24,
    contactProtection: true
  }
}

// Kullanıcının kendi profili olup olmadığını kontrol eden mantık
const isMyOwnCompany = computed(() => {
  if (!selectedCompanyProfileModal.value || !userSession.value) return false
  const modalComp = (selectedCompanyProfileModal.value.name || '').toLowerCase()
  const userComp = (userSession.value.companyName || userSession.value.company || userSession.value.name || userSession.value.username || '').toLowerCase()
  return userComp.length > 2 && (modalComp.includes(userComp) || userComp.includes(modalComp))
})

function openQuickBidModal(tender: any) {
  if (userSession.value && userSession.value.username && (tender.ownerCompany === userSession.value.username || tender.ownerCompany === userSession.value.companyName)) {
    alert('Kendi açtığınız bir ihaleye teklif veremezsiniz!')
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
  if (!quickOfferPrice.value || !quickOfferPrice.value.trim()) {
    alert('Lütfen geçerli bir teklif tutarı giriniz.')
    return
  }

  const numericPrice = parseFloat(quickOfferPrice.value.replace(/[^0-9.]/g, ''))
  if (isNaN(numericPrice) || numericPrice <= 0) {
    alert('Lütfen geçerli bir teklif tutarı giriniz.')
    return
  }

  const tender = quickBidTender.value
  if (!tender) return

  const vatLabel = quickOfferVatType.value === 'vat_excluded' ? '+ KDV Hariç' : 'KDV Dahil'

  const bidObj = {
    id: 'BID-' + Math.floor(100000 + Math.random() * 900000),
    tenderId: tender.id,
    tenderTitle: tender.baslik,
    tenderCategory: tender.kategori,
    tenderCity: tender.city,
    buyerCompany: tender.ownerCompany || tender.authority,
    price: Number(numericPrice).toLocaleString('tr-TR') + ' ₺ (' + vatLabel + ')',
    priceNum: numericPrice,
    vatType: quickOfferVatType.value,
    validityDuration: quickOfferDuration.value,
    notes: quickOfferNotes.value || 'Şartname koşulları ve birim fiyat cetveli uyarınca teklif sunulmuştur.',
    bidderName: userSession.value?.companyName || userSession.value?.username || 'Doğrulanmış Tedarikçi Firma',
    files: quickOfferFiles.value,
    filesCount: quickOfferFiles.value.length,
    submittedAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    status: 'Değerlendirmede'
  }

  if (typeof window !== 'undefined') {
    try {
      const myBids = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      myBids.unshift(bidObj)
      localStorage.setItem('mySubmittedBids', JSON.stringify(myBids))
    } catch (e) {}
  }

  const fileMsg = quickOfferFiles.value.length > 0 ? ('\n📁 Eklenen Belge: ' + quickOfferFiles.value.length + ' adet Birim Fiyat Cetveli/Şartname Belgesi') : ''

  alert('✓ TEKLİFİNİZ BAŞARIYLA İLETİLDİ!\n\nİhale: ' + tender.baslik + '\nAlıcı Kurum/Firma: ' + bidObj.buyerCompany + '\nTeklif Tutarı: ' + bidObj.price + fileMsg + '\n\nTeklifiniz alıcı firmanın kontrol paneline ve onay havuzuna güvenle aktarıldı.')
  showQuickBidModal.value = false
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
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
                <span class="leading-none">İdareler</span>
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
                <span v-else-if="activeLeftTab === 'idareler'">🏛️ Bütün İdareler & Kurumlar</span>
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
                class="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="Tümü">Tüm Kurum Tipleri (Bakanlık, KİT, Belediye, Üniversite)</option>
                <option value="Bakanlık">Bakanlıklar & Başkanlıklar</option>
                <option value="Genel Müdürlük & KİT">Genel Müdürlükler & KİT'ler (DSİ, KGM, TOKİ...)</option>
                <option value="Belediye">Büyükşehir & İl Belediyeleri</option>
                <option value="Üniversite & Teknokent">Üniversiteler & Teknoparklar</option>
                <option value="OSB & Sanayi Odası">Organize Sanayi Bölgeleri (OSB)</option>
                <option value="Özel Sektör Masası">Özel Sektör B2B Masaları</option>
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
                    <span>Tüm İdare ve Kurumlar</span>
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
          <!-- 📋 LİSTE GÖRÜNÜMÜ (SAHİBİNDEN.COM KLASİK RESİMLİ İLAN LİSTESİ) -->
          <!-- ========================================================= -->
          <div v-if="viewLayout === 'list' && paginatedTenders.length > 0" class="space-y-3">
            <div 
              v-for="tender in paginatedTenders" 
              :key="tender.id"
              class="bg-white border border-slate-300 hover:border-[#0084B4] hover:shadow-md rounded-2xl p-3 sm:p-4 transition-all flex flex-col sm:flex-row gap-4 items-start relative group"
            >
              
              <!-- 🖼️ 1. İhale Fotoğrafı / Thumbnail -->
              <div class="relative w-full sm:w-44 sm:h-32 h-44 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img 
                  :src="getTenderImage(tender)" 
                  :alt="tender.baslik"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <!-- Durum Rozeti -->
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                  <span 
                    class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white shadow-xs"
                    :class="tender.durum === 'closed' ? 'bg-amber-600' : 'bg-emerald-600'"
                  >
                    {{ tender.durum === 'closed' ? '🏆 Sonuçlandı' : '🟢 Canlı İhale' }}
                  </span>
                </div>

                <!-- Fotoğraf Rozeti -->
                <div class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-1">
                  <span>📷 Fotoğraflı</span>
                </div>
              </div>

              <!-- 📝 2. Orta Detay Bilgileri -->
              <div class="flex-1 space-y-2 min-w-0">
                
                <!-- İhale No ve Başlık -->
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.2 rounded text-[10px] border border-sky-200">
                      {{ tender.id }}
                    </span>
                    <span class="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold truncate max-w-[280px]">
                      {{ tender.kategori }}
                    </span>
                  </div>

                  <h3 
                    @click="openTenderDetailModal(tender)" 
                    class="text-sm sm:text-base font-black text-[#0F223D] hover:text-[#0084B4] cursor-pointer transition leading-snug line-clamp-2"
                  >
                    {{ tender.baslik }}
                  </h3>
                </div>

                <!-- Alıcı / Kurum & Şehir (Tıklanabilir Firma Profili İle) -->
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <button 
                    type="button"
                    @click="openCompanyProfileModal(tender.ownerCompany || tender.authority, tender.city)"
                    class="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer transition group/comp"
                    title="Firma Profilini İncele"
                  >
                    <Building2 :size="13" class="text-blue-600 shrink-0 group-hover/comp:scale-110 transition-transform" />
                    <span class="truncate max-w-[220px]">{{ tender.ownerCompany || tender.authority || 'Kurumsal Satın Alma Masası' }}</span>
                    <span class="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-black border border-blue-200">Profil ↗</span>
                  </button>

                  <span class="flex items-center gap-1 font-medium text-slate-500">
                    <MapPin :size="13" class="text-slate-400 shrink-0" />
                    <span>{{ tender.city || 'Türkiye Geneli' }}</span>
                  </span>

                  <span class="flex items-center gap-1 font-medium text-slate-500">
                    <Clock :size="13" class="text-amber-500 shrink-0" />
                    <span class="font-bold text-slate-700">{{ tender.sure || '3 gün kaldı' }}</span>
                  </span>
                </div>

                <!-- Şartname & Malzeme Özeti -->
                <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {{ tender.aciklama || 'Şartname ve malzeme listesi uyarınca mal/hizmet temini yapılacaktır. Teklifler kapalı havuzda toplanmaktadır.' }}
                </p>

              </div>

              <!-- 💰 3. Sağ Fiyat & Aksiyon Butonları -->
              <div class="w-full sm:w-44 shrink-0 flex sm:flex-col justify-between sm:justify-start items-end sm:items-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 text-right">
                
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase block">Sözleşme / Hedef Bütçe</span>
                  <span class="font-mono font-black text-base sm:text-lg text-emerald-700 block">
                    {{ tender.butce || 'Açık Teklif' }}
                  </span>
                </div>

                <div class="text-[11px] font-bold text-slate-500">
                  💬 {{ tender.teklifSayisi || (Math.floor(Math.random() * 6) + 2) }} Teklif Verildi
                </div>

                <div class="flex sm:flex-col gap-1.5 w-full sm:w-auto pt-1">
                  <button 
                    type="button" 
                    @click="openTenderDetailModal(tender)"
                    class="flex-1 sm:w-full px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Şartname İncele
                  </button>

                  <button 
                    type="button" 
                    @click="openQuickBidModal(tender)"
                    class="flex-1 sm:w-full px-3.5 py-1.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <Send :size="12" />
                    <span>Teklif Ver</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          <!-- ========================================================= -->
          <!-- 🖼️ VİTRİN / GALERİ GÖRÜNÜMÜ (SAHİBİNDEN VİTRİN KARTLARI) -->
          <!-- ========================================================= -->
          <div v-else-if="viewLayout === 'grid' && paginatedTenders.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="tender in paginatedTenders" 
              :key="tender.id"
              class="bg-white border border-slate-300 hover:border-[#0084B4] hover:shadow-md rounded-2xl overflow-hidden transition-all flex flex-col group"
            >
              <!-- Fotoğraf -->
              <div class="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img 
                  :src="getTenderImage(tender)" 
                  :alt="tender.baslik"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span 
                  class="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-xs"
                  :class="tender.durum === 'closed' ? 'bg-amber-600' : 'bg-emerald-600'"
                >
                  {{ tender.durum === 'closed' ? 'Sonuçlandı' : '🟢 Canlı' }}
                </span>
                <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono font-bold">
                  {{ tender.city }}
                </span>
              </div>

              <!-- İçerik -->
              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div class="space-y-1.5">
                  <div class="text-[10px] font-mono text-sky-700 font-bold">{{ tender.id }} · {{ tender.kategori }}</div>
                  <h4 @click="openTenderDetailModal(tender)" class="font-black text-xs text-slate-900 hover:text-[#0084B4] cursor-pointer line-clamp-2 leading-snug">
                    {{ tender.baslik }}
                  </h4>
                  <button 
                    type="button"
                    @click="openCompanyProfileModal(tender.ownerCompany || tender.authority, tender.city)"
                    class="text-[11px] font-bold text-blue-700 hover:underline text-left block truncate"
                  >
                    🏢 {{ tender.ownerCompany || tender.authority }}
                  </button>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span class="text-[8px] font-bold text-slate-400 uppercase block">Hedef Bütçe</span>
                    <span class="font-mono font-black text-emerald-700 text-sm">{{ tender.butce }}</span>
                  </div>
                  <button 
                    type="button" 
                    @click="openQuickBidModal(tender)"
                    class="px-3 py-1.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-bold text-xs transition cursor-pointer"
                  >
                    Teklif Ver
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
    <!-- 📄 1. İHALE DETAY MODALI -->
    <!-- ========================================================================= -->
    <div v-if="selectedTenderModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <div class="flex items-start justify-between gap-4 border-b pb-3 border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-mono font-black uppercase">
                #{{ selectedTenderModal.id }}
              </span>
              <span class="text-xs font-black text-blue-600 uppercase tracking-wider">
                {{ selectedTenderModal.kategori }}
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {{ selectedTenderModal.baslik }}
            </h2>
          </div>
          <button @click="selectedTenderModal = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
            <X :size="20" />
          </button>
        </div>

        <!-- Meta Strip -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">🏢 Alıcı / Kurum</span>
            <button 
              type="button" 
              @click="openCompanyProfileModal(selectedTenderModal.ownerCompany || selectedTenderModal.authority, selectedTenderModal.city); selectedTenderModal = null"
              class="font-bold text-blue-700 hover:underline text-left block"
            >
              {{ selectedTenderModal.ownerCompany || selectedTenderModal.authority || 'Kurumsal Masası' }} ↗
            </button>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">💰 Hedef / Sözleşme Bütçesi</span>
            <span class="font-mono font-black text-emerald-600 text-sm">{{ selectedTenderModal.butce || 'Açık Teklif' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">📍 Şehir</span>
            <span class="font-bold text-slate-800">{{ selectedTenderModal.city || 'Türkiye Geneli' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">⏱️ Kalan Süre</span>
            <span class="font-bold text-amber-600">{{ selectedTenderModal.sure || '3 gün kaldı' }}</span>
          </div>
        </div>

        <!-- İhale Açıklaması -->
        <div class="space-y-2 text-xs text-slate-700 leading-relaxed p-4 rounded-2xl bg-slate-50/50 border border-slate-200">
          <h4 class="font-black text-slate-900 text-xs">Şartname ve İhale Kapsamı:</h4>
          <p>{{ selectedTenderModal.aciklama }}</p>
        </div>

        <!-- Alt Aksiyonlar -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="selectedTenderModal = null" 
            class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Kapat
          </button>
          
          <button 
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
            <span class="text-slate-500 font-bold">Hedef / Yaklaşık Maliyet:</span>
            <span class="font-mono font-black text-emerald-700">{{ quickBidTender.butce || 'Açık Teklif' }}</span>
          </div>
        </div>

        <form @submit.prevent="submitQuickOffer" class="space-y-4">
          
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
              type="submit" 
              class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
            >
              <Send :size="13" />
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
