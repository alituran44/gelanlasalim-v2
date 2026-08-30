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
  Download
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada.com — Türkiye’nin En Kapsamlı İhale ve Satın Alma Portalı',
  description: 'Günlük ihaleler, kamu ve özel sektör satın alma ilanları, şartnameler, doğrudan teklif verme ve sonuç takip sistemi.'
})

// ==================== MENÜ VE GÖRÜNÜM SEÇİMİ ====================
const activeSubMenu = ref<'kategoriler' | 'sehirler' | 'sektorler' | 'idareler' | 'firmalar'>('kategoriler')
const activeTimeTab = ref<'guncel' | 'gecmis' | 'sonuc' | 'detayli'>('guncel')
const viewLayout = ref<'list' | 'grid'>('list') // 'list' = Sahibinden Liste Görünümü, 'grid' = Vitrin Görünümü
const viewMode = ref<'gelismis' | 'basit'>('gelismis')
const readMode = ref<'goster' | 'gizle'>('goster')

// ==================== ARAMA VE FİLTRE DURUMLARI ====================
const selectedCategory = ref<string>('Tümü')
const categorySearchQuery = ref('')
const filterCity = ref('Tümü')
const filterType = ref('Tümü')
const filterMethod = ref('Tümü')
const filterSource = ref('Tümü')
const filterCost = ref('Tümü')
const filterKeyword = ref('')
const minPriceFilter = ref<number | ''>('')
const maxPriceFilter = ref<number | ''>('')
const filterStartDate = ref('')
const searchScope = ref('icerik')
const selectedSort = ref<'otomatik' | 'price_asc' | 'price_desc' | 'date_new' | 'bids'>('otomatik')
const currentPage = ref(1)

// ==================== FİRMA, SEKTÖR VE İDARE ARAMA FİLTRELERİ ====================
const contractorSearchCategory = ref('Tümü')
const contractorSearchName = ref('')
const contractorPage = ref(1)

const sectorSearchCategory = ref('Tümü')
const sectorSearchName = ref('')

const authoritySearchType = ref('Tümü')
const authoritySearchCity = ref('Tümü')
const authoritySearchName = ref('')
const authorityTableSearch = ref('')
const authorityPage = ref(1)

// ==================== MODALLAR VE TEKLİF FORMU ====================
const selectedTenderModal = ref<any>(null)
const detailActiveTab = ref<'ilan' | 'malzeme' | 'idari' | 'sozlesme' | 'firmalar' | 'sonuc'>('ilan')
const showQuickBidModal = ref(false)
const quickBidTender = ref<any>(null)
const quickOfferPrice = ref('')
const quickOfferNotes = ref('')
const quickOfferDuration = ref('7 gün')
const userSession = ref<any>({})

const { cmsData } = useCmsData()
const { sendSms } = useNetGsm()

// ==================== 1. KATEGORİLER LİSTESİ (40 KATEGORİ) ====================
const allCategoriesList = [
  { id: 1, name: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri', short: 'İnşaat & Altyapı' },
  { id: 2, name: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri', short: 'Sağlık & Medikal' },
  { id: 3, name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri', short: 'Tıbbi Cihaz & Hastane' },
  { id: 4, name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri', short: 'Kanalizasyon & Su' },
  { id: 5, name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri', short: 'Enerji & Elektrik' },
  { id: 6, name: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri', short: 'Akaryakıt & Madeni Yağ' },
  { id: 7, name: 'Endüstriyel Makine - Motor - Konveyör İhaleleri', short: 'Endüstriyel Makine' },
  { id: 8, name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri', short: 'Yazılım & Bilişim' },
  { id: 9, name: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri', short: 'Nakliye & Lojistik' },
  { id: 10, name: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri', short: 'Mobilya & Ofis' },
  { id: 11, name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri', short: 'Gıda & Tarım' },
  { id: 12, name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri', short: 'Hırdavat & Metal' },
  { id: 13, name: 'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri', short: 'Yangın & Güvenlik' },
  { id: 14, name: 'Kimyasal Maddeler - Dezenfektan - Gübre İhaleleri', short: 'Kimyasal & Gübre' },
  { id: 15, name: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri', short: 'Matbaa & Kırtasiye' },
  { id: 16, name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama İhaleleri', short: 'Kent Mobilyaları' },
  { id: 17, name: 'Mühendislik - Mimarlık - Danışmanlık İhaleleri', short: 'Mühendislik & Mimarlık' },
  { id: 18, name: 'Madencilik - Doğal Kaynaklar - Sondaj İhaleleri', short: 'Madencilik & Sondaj' },
  { id: 19, name: 'Asansör - Yapı Otomasyon - Mekanik Güvenlik İhaleleri', short: 'Asansör & Otomasyon' },
  { id: 20, name: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı İhaleleri', short: 'Klima & Havalandırma' },
  { id: 21, name: 'Savunma Sanayi, Silah - Denizcilik - Havacılık İhaleleri', short: 'Savunma & Havacılık' },
  { id: 22, name: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri', short: 'Taşıt & İş Makinesi' },
  { id: 23, name: 'Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri', short: 'Turizm & Organizasyon' },
  { id: 24, name: 'Reklam - Tabela - Billboard - Tanıtım Materyalleri İhaleleri', short: 'Reklam & Tanıtım' },
  { id: 25, name: 'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri', short: 'Ormancılık & Peyzaj' },
  { id: 26, name: 'Hayvancılık - Veterinerlik - Hayvan Yemi İhaleleri', short: 'Hayvancılık & Tarım' },
  { id: 27, name: 'Sanat Eserleri - Müzik Aletleri - Heykel - Maket İhaleleri', short: 'Sanat & Heykel' },
  { id: 28, name: 'Odun - Kömür - Katıyakıt İhaleleri', short: 'Odun & Kömür' },
  { id: 29, name: 'Hazır Yemek - Lokantacılık İhaleleri', short: 'Hazır Yemek & İkram' },
  { id: 30, name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar İhaleleri', short: 'Elektronik & Bilgisayar' },
  { id: 31, name: 'Uydu Takip - Kamera - Scada - Haberleşme Sistemleri İhaleleri', short: 'Kamera & Güvenlik' },
  { id: 32, name: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri', short: 'Temizlik & Geri Dönüşüm' },
  { id: 33, name: 'Tekstil - Giyim - Spor Ekipmanları İhaleleri', short: 'Tekstil & Giyim' },
  { id: 34, name: 'İş Sağlığı - İş Güvenliği ve Ekipmanları İhaleleri', short: 'İş Sağlığı & Güvenliği' },
  { id: 35, name: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri', short: 'Özel Güvenlik' },
  { id: 36, name: 'Eğitim - Araştırma - Anket - Tercümanlık İhaleleri', short: 'Eğitim & Tercümanlık' },
  { id: 37, name: 'İşletmecilik - İşçilik - Sosyal Hizmetler İhaleleri', short: 'İşletmecilik & Hizmet' },
  { id: 38, name: 'Sigortacılık - Mali ve Hukuki Hizmetler İhaleleri', short: 'Sigorta & Finans' },
  { id: 39, name: 'Menkul Mallar - Araç Satışı ve Hurda İhaleleri', short: 'Araç & Hurda Satışı' },
  { id: 40, name: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri', short: 'Gayrimenkul & Arsa' }
]

// ==================== 2. SEED / CANLI İHALE VERİLERİ (RESİMLİ SAHİBİNDEN MODELİ) ====================
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
    baslik: 'Şehir Hastanesi Tıbbi Sarf Malzemeleri ve Steril Enjektör Seti Tedariği',
    kategori: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri',
    ownerCompany: 'İstanbul İl Sağlık Müdürlüğü',
    authority: 'T.C. Sağlık Bakanlığı',
    city: 'İstanbul',
    butce: '1.250.000 ₺',
    sure: '5 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 7,
    yayinTarihi: '27.08.2026',
    aciklama: 'Başakşehir Çam ve Sakura Şehir Hastanesi için 250.000 adet steril enjektör, branül ve serum seti tedarik ihalesidir. TSE/CE belgeleri zorunludur.'
  },
  {
    id: 'IHC-2024-003',
    baslik: 'OSB Fabrika Binası Çelik Konstrüksiyon ve Çatı Kaplama Yapım İşi',
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    ownerCompany: 'Ankara Sanayi Odası 1. OSB Bölge Müdürlüğü',
    authority: 'ASO 1. OSB',
    city: 'Ankara',
    butce: '3.800.000 ₺',
    sure: '7 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Doğrudan B2B',
    durum: 'active',
    teklifSayisi: 3,
    yayinTarihi: '29.08.2026',
    aciklama: '1.800 m² kapalı alan çelik konstrüksiyon imalatı, sandviç panel çatı kaplaması ve temel ankraj işleri anahtar teslimi yapım ihalesidir.'
  },
  {
    id: 'IHC-2024-004',
    baslik: 'Belediye Araç Filosu İçin 150.000 Litre Euro Diesel Motorin Alımı',
    kategori: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri',
    ownerCompany: 'Balıkesir Büyükşehir Belediyesi Ulaşım Dairesi',
    authority: 'Balıkesir Büyükşehir',
    city: 'Balıkesir',
    butce: '5.900.000 ₺',
    sure: '2 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Gazete İhaleleri',
    durum: 'active',
    teklifSayisi: 5,
    yayinTarihi: '28.08.2026',
    aciklama: 'Belediye otobüs ve iş makineleri için EPDK lisanslı tanker teslimi 150.000 litre Euro Diesel motorin alımı ihalesidir.'
  },
  {
    id: 'IHC-2024-005',
    baslik: 'Kurumsal Veri Merkezi Sunucu, Güvenlik Duvarı ve Fiber Switch Donanımları',
    kategori: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri',
    ownerCompany: 'İzmir Teknoloji Geliştirme Bölgesi A.Ş.',
    authority: 'İzmir İYTE Teknopark',
    city: 'İzmir',
    butce: '850.000 ₺',
    sure: '4 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'İstihbarat İhaleleri',
    durum: 'active',
    teklifSayisi: 6,
    yayinTarihi: '26.08.2026',
    aciklama: '3 Adet Rack Tipi Sunucu (2x AMD EPYC, 512GB RAM), 10G Fiber switch grubu ve Next-Gen Firewall donanım tedariği ve devreye alma ihalesidir.'
  },
  {
    id: 'IHC-2024-006',
    baslik: 'Tarımsal Sulama Hatları İçin HDPE 100 Polietilen Boru ve Ek Parçaları',
    kategori: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri',
    ownerCompany: 'Devlet Su İşleri 25. Bölge Müdürlüğü',
    authority: 'Devlet Su İşleri',
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
    authority: 'Özel Sektör B2B Masası',
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
    ownerCompany: 'Eskişehir Organize Sanayi Bölgesi Fabrika Tesisi',
    authority: 'Eskişehir OSB',
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
    baslik: 'Organik Gübre, Bitki Besleme ve Damla Sulama Kimyasalları Tedariği',
    kategori: 'Kimyasal Maddeler - Dezenfektan - Gübre İhaleleri',
    ownerCompany: 'Antalya Tarım İşletmeleri Ltd. Şti.',
    authority: 'T.C. Tarım ve Orman Bakanlığı',
    city: 'Antalya',
    butce: '680.000 ₺',
    sure: '3 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Doğrudan B2B',
    durum: 'active',
    teklifSayisi: 5,
    yayinTarihi: '28.08.2026',
    aciklama: 'Seracılık bölgeleri için 50 ton sıvı hümik asit, aminoasit ve NPK damla sulama gübreleri alımı ihalesidir.'
  },
  {
    id: 'IHC-2024-010',
    baslik: 'Oluklu Mukavva Koli (50.000 Adet) ve Endüstriyel Streç Film Alımı',
    kategori: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri',
    ownerCompany: 'Ege Ambalaj ve İhracat Sanayi A.Ş.',
    authority: 'Manisa TSO Satın Alma Masası',
    city: 'Manisa',
    butce: '340.000 ₺',
    sure: '2 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Doğrudan B2B',
    durum: 'active',
    teklifSayisi: 9,
    yayinTarihi: '29.08.2026',
    aciklama: '60x40x40 cm DOPEL oluklu ihracat kolisi (50.000 adet) ve 17 mikron 500 rulo otomatik sarım streç film ihalesidir.'
  },
  {
    id: 'IHC-2024-011',
    baslik: 'Güneş Enerji Santrali (GES) 500 kWp Fotovoltaik Panel ve İnverter Alımı',
    kategori: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri',
    ownerCompany: 'Konya Yenilenebilir Enerji A.Ş.',
    authority: 'Konya Sanayi Odası',
    city: 'Konya',
    butce: '6.200.000 ₺',
    sure: '4 gün kaldı',
    tur: 'Mal Alımı',
    usul: 'Açık İhale',
    kaynak: 'Gazete İhaleleri',
    durum: 'active',
    teklifSayisi: 6,
    yayinTarihi: '27.08.2026',
    aciklama: '550W Tier-1 Monokristal Half-Cut fotovoltaik güneş paneli ve 100kW string inverter tedarik ihalesidir.'
  },
  {
    id: 'IHC-2024-012',
    baslik: 'Kurumsal Tesisler ve İş Merkezleri İçin Yangın Söndürme ve Sprinkler Sistemi',
    kategori: 'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri',
    ownerCompany: 'Tekirdağ Çorlu Serbest Bölge Yönetimi',
    authority: 'Çorlu Serbest Bölge',
    city: 'Tekirdağ',
    butce: '1.150.000 ₺',
    sure: '5 gün kaldı',
    tur: 'Yapım İşi',
    usul: 'Açık İhale',
    kaynak: 'Ekap İhaleleri',
    durum: 'active',
    teklifSayisi: 3,
    yayinTarihi: '26.08.2026',
    aciklama: 'NFPA 13 normlarına uygun sulu sprinkler yangın söndürme hattı, yangın dolapları ve yangın pompa grubu montaj işidir.'
  }
]

// ==================== 3. RESİM EŞLEŞTİRME YARDIMCISI (HD UNSPLASH) ====================
function getTenderImage(tender: any): string {
  if (tender.image && typeof tender.image === 'string' && tender.image.startsWith('http')) {
    return tender.image
  }
  const text = `${tender.kategori || ''} ${tender.baslik || ''}`.toLowerCase()
  
  if (text.includes('inşaat') || text.includes('yapı') || text.includes('altyapı') || text.includes('şantiye') || text.includes('yıkım')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('sağlık') || text.includes('ilaç') || text.includes('medikal') || text.includes('hastane')) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('tıbbi cihaz') || text.includes('laboratuvar') || text.includes('enjektör')) {
    return 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('makine') || text.includes('motor') || text.includes('vinç') || text.includes('konveyör') || text.includes('cnc')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('enerji') || text.includes('güneş') || text.includes('panel') || text.includes('elektrik')) {
    return 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('akaryakıt') || text.includes('motorin') || text.includes('benzin') || text.includes('yakıt') || text.includes('petrol')) {
    return 'https://images.unsplash.com/photo-1527018607637-02363bc80638?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('nakliye') || text.includes('taşımacılık') || text.includes('lojistik') || text.includes('kargo') || text.includes('tır')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('mobilya') || text.includes('ofis') || text.includes('masa') || text.includes('koltuk')) {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('gıda') || text.includes('tarım') || text.includes('yemek') || text.includes('gübre') || text.includes('sulama')) {
    return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('bilişim') || text.includes('yazılım') || text.includes('sunucu') || text.includes('bilgisayar') || text.includes('network')) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('ambalaj') || text.includes('koli') || text.includes('matbaa') || text.includes('kırtasiye') || text.includes('streç')) {
    return 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('yangın') || text.includes('sprinkler') || text.includes('güvenlik')) {
    return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80'
  }
  if (text.includes('boru') || text.includes('kanalizasyon') || text.includes('tesisat') || text.includes('su')) {
    return 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80'
  }
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
}

// ==================== 4. CANLI İHALE VERİ LİSTESİ BİRLEŞTİRME ====================
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

  // Birleştir ve tekilleştir
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

// Kategori bazlı sayaç
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

// Kategoriler Ağacı (Hesaplanmış sayaçlı)
const categoryTree = computed(() => {
  return allCategoriesList.map(c => ({
    ...c,
    count: getCategoryCount(c.name)
  }))
})

// Sol menüde aranan kategori filtresi
const filteredCategoryTree = computed(() => {
  if (!categorySearchQuery.value.trim()) return categoryTree.value
  const q = categorySearchQuery.value.toLocaleLowerCase('tr').trim()
  return categoryTree.value.filter(c => c.name.toLocaleLowerCase('tr').includes(q) || c.short.toLocaleLowerCase('tr').includes(q))
})

// ==================== 5. MERKEZİ İHALE LİSTE FİLTRELEME & SIRALAMA ====================
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
  if (filterCity.value && filterCity.value !== 'Tümü') {
    list = list.filter(t => (t.city || '').toLowerCase().includes(filterCity.value.toLowerCase()))
  }

  // İhale Türü Filtresi
  if (filterType.value && filterType.value !== 'Tümü') {
    list = list.filter(t => (t.tur || t.type || '').toLowerCase().includes(filterType.value.toLowerCase()))
  }

  // İhale Usulü Filtresi
  if (filterMethod.value && filterMethod.value !== 'Tümü') {
    list = list.filter(t => (t.usul || t.method || '').toLowerCase().includes(filterMethod.value.toLowerCase()))
  }

  // Kelime Arama
  if (filterKeyword.value.trim()) {
    const kw = filterKeyword.value.toLocaleLowerCase('tr').trim()
    list = list.filter(t => {
      return (
        (t.baslik || '').toLocaleLowerCase('tr').includes(kw) ||
        (t.aciklama || '').toLocaleLowerCase('tr').includes(kw) ||
        (t.ownerCompany || '').toLocaleLowerCase('tr').includes(kw) ||
        (t.id || '').toLocaleLowerCase('tr').includes(kw) ||
        (t.kategori || '').toLocaleLowerCase('tr').includes(kw)
      )
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

function resetAllFilters() {
  selectedCategory.value = 'Tümü'
  categorySearchQuery.value = ''
  filterCity.value = 'Tümü'
  filterType.value = 'Tümü'
  filterMethod.value = 'Tümü'
  filterCost.value = 'Tümü'
  filterKeyword.value = ''
  minPriceFilter.value = ''
  maxPriceFilter.value = ''
  activeTimeTab.value = 'guncel'
  selectedSort.value = 'otomatik'
}

// ==================== 6. MODAL VE HIZLI TEKLİF İŞLEMLERİ ====================
function openTenderDetailModal(tender: any) {
  selectedTenderModal.value = tender
  detailActiveTab.value = 'ilan'
}

function openQuickBidModal(tender: any) {
  const currentEmail = userSession.value?.email || ''
  if (tender.isMine || (currentEmail && tender.ownerEmail === currentEmail)) {
    alert(`⚠️ BU SİZİN KENDİ İLANINIZDIR:\n\n"${tender.baslik}" ihalesi sizin tarafınızdan açılmıştır. Kendi ihalelerinize teklif veremezsiniz.`)
    return
  }
  quickBidTender.value = tender
  quickOfferPrice.value = ''
  quickOfferNotes.value = ''
  quickOfferDuration.value = '7 gün'
  showQuickBidModal.value = true
}

function submitQuickBid() {
  if (!quickOfferPrice.value.trim()) {
    alert('Lütfen teklif fiyatınızı giriniz.')
    return
  }

  let formattedPrice = quickOfferPrice.value.trim()
  if (!formattedPrice.includes('₺') && !formattedPrice.includes('$') && !formattedPrice.includes('€')) {
    formattedPrice = formattedPrice + ' ₺'
  }

  const tender = quickBidTender.value
  const newBidId = 'TKF-' + Math.floor(100 + Math.random() * 900)

  const newSubmittedBid = {
    id: newBidId,
    tenderId: tender.id,
    ilanBaslik: tender.baslik,
    aliciFirma: tender.ownerCompany || tender.authority || 'Kurumsal Alıcı',
    kategori: tender.kategori,
    teklifFiyatim: formattedPrice,
    sure: quickOfferDuration.value,
    durum: 'bekliyor',
    tarih: 'Bugün',
    bitisTarihi: tender.sure || '7 gün',
    notum: quickOfferNotes.value,
    pazarlikGecmisi: []
  }

  if (typeof window !== 'undefined') {
    try {
      const existingBids = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      existingBids.unshift(newSubmittedBid)
      localStorage.setItem('mySubmittedBids', JSON.stringify(existingBids))

      // CMS sync
      if (!cmsData.value.dashboard.submittedBids) {
        cmsData.value.dashboard.submittedBids = []
      }
      cmsData.value.dashboard.submittedBids.unshift(newSubmittedBid)
    } catch (e) {}
  }

  showQuickBidModal.value = false
  alert(`✅ TEKLİFİNİZ BAŞARIYLA İLETİLDİ!\n\n"${tender.baslik}" ihalesine ${formattedPrice} tutarındaki teklifiniz alıcı firmaya güvenli havuz üzerinden sunulmuştur.\n\nTeklifinizin durumunu panelinizdeki "Verdiğim Teklifler" sayfasından takip edebilirsiniz.`)
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
    <!-- 🔵 1. ÜST 5'Lİ KURUMSAL MENÜ ŞERİDİ -->
    <!-- ========================================================================= -->
    <div class="bg-[#0F223D] border-b border-slate-800 text-white font-bold text-xs sticky top-[108px] z-40 shadow-sm">
      <div class="max-w-[1440px] mx-auto flex flex-wrap items-center">
        
        <button 
          @click="activeSubMenu = 'kategoriler'" 
          :class="activeSubMenu === 'kategoriler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>📁 Tüm İhaleler / Kategoriler</span>
        </button>

        <button 
          @click="activeSubMenu = 'sehirler'" 
          :class="activeSubMenu === 'sehirler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏙️ Şehirler</span>
        </button>

        <button 
          @click="activeSubMenu = 'sektorler'" 
          :class="activeSubMenu === 'sektorler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏭 Sektörler</span>
        </button>

        <button 
          @click="activeSubMenu = 'idareler'" 
          :class="activeSubMenu === 'idareler' ? 'bg-white text-[#0F223D] border-t-2 border-amber-500 font-black shadow-inner' : 'hover:bg-[#1E3A8A] text-slate-200'"
          class="px-6 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-slate-800"
        >
          <span>🏛️ İdareler</span>
        </button>

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
    <!-- 🎛️ 2. ÜST HIZLI ARAMA & GÜNLÜK SAYAÇ ŞERİDİ -->
    <!-- ========================================================================= -->
    <div class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-3">
      <div class="bg-white border border-slate-300 rounded-xl p-3 shadow-2xs space-y-2.5">
        
        <!-- Zaman Sekmeleri + Arama Kutusu -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-1 text-xs font-bold w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button 
              @click="activeTimeTab = 'guncel'" 
              :class="activeTimeTab === 'guncel' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Clock :size="13" />
              <span>Güncel İhaleler</span>
            </button>
            <button 
              @click="activeTimeTab = 'gecmis'" 
              :class="activeTimeTab === 'gecmis' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw :size="13" />
              <span>Geçmiş</span>
            </button>
            <button 
              @click="activeTimeTab = 'sonuc'" 
              :class="activeTimeTab === 'sonuc' ? 'bg-[#0084B4] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 :size="13" />
              <span>Sonuçlananlar</span>
            </button>
          </div>

          <!-- Arama Inputu -->
          <div class="flex items-center gap-1.5 w-full md:w-auto">
            <div class="relative flex-1 md:w-72">
              <input 
                v-model="filterKeyword" 
                type="text" 
                placeholder="İhale başlığı, malzeme, kurum ara..." 
                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <Search :size="13" class="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
            <button 
              type="button"
              @click="resetAllFilters"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
              title="Filtreleri Sıfırla"
            >
              <RotateCcw :size="13" />
            </button>
          </div>
        </div>

        <!-- 3'lü Günlük İhale Sayaçları -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
          <div @click="activeTimeTab = 'guncel'" class="p-2 rounded-lg border border-sky-200 bg-sky-50/70 flex items-center justify-between hover:bg-sky-100 transition cursor-pointer">
            <span class="font-bold text-sky-900 text-xs flex items-center gap-1.5">
              <Zap :size="13" class="text-sky-600" />
              <span>Bugün yayınlananlar</span>
            </span>
            <span class="px-2 py-0.2 rounded-full bg-white border border-sky-300 text-sky-800 font-black text-xs font-mono">
              {{ todayPublishedCount }} İhale
            </span>
          </div>

          <div @click="activeTimeTab = 'guncel'" class="p-2 rounded-lg border border-blue-200 bg-blue-50/70 flex items-center justify-between hover:bg-blue-100 transition cursor-pointer">
            <span class="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Clock :size="13" class="text-blue-600" />
              <span>Bugün yapılacaklar</span>
            </span>
            <span class="px-2 py-0.2 rounded-full bg-white border border-blue-300 text-blue-800 font-black text-xs font-mono">
              {{ todayOngoingCount }} İhale
            </span>
          </div>

          <div @click="activeTimeTab = 'sonuc'" class="p-2 rounded-lg border border-emerald-200 bg-emerald-50/70 flex items-center justify-between hover:bg-emerald-100 transition cursor-pointer">
            <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 :size="13" class="text-emerald-600" />
              <span>Bugün sonuçlananlar</span>
            </span>
            <span class="px-2 py-0.2 rounded-full bg-white border border-emerald-300 text-emerald-800 font-black text-xs font-mono">
              {{ todayFinishedCount }} İhale
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🌟 3. SAHİBİNDEN.COM TARZI 2 SÜTUNLU ANA DÜZEN (SOLDA KATEGORİ, ORTADA İLANLAR) -->
    <!-- ========================================================================= -->
    <div v-if="activeSubMenu === 'kategoriler'" class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <!-- ========================================================= -->
        <!-- ⬅️ SOL SÜTUN: KATEGORİLER VE FİLTRE AĞACI (SAHİBİNDEN SOL MENÜ) -->
        <!-- ========================================================= -->
        <aside class="lg:col-span-4 xl:col-span-3 space-y-3.5">
          
          <!-- Kategori Ağacı Kutusu -->
          <div class="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <span class="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <Folder :size="15" class="text-[#0084B4]" />
                İhale Kategorileri
              </span>
              <button 
                v-if="selectedCategory !== 'Tümü'" 
                @click="selectedCategory = 'Tümü'" 
                class="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Tümü (Sıfırla)
              </button>
            </div>

            <!-- Kategori İçi Arama -->
            <div class="relative">
              <input 
                v-model="categorySearchQuery" 
                type="text" 
                placeholder="Kategorilerde ara..." 
                class="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white"
              />
              <Search :size="12" class="absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            <!-- Kategori Listesi (Scrollable) -->
            <div class="space-y-0.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              
              <!-- Tüm Kategoriler Seçeneği -->
              <button
                type="button"
                @click="selectedCategory = 'Tümü'"
                class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs"
                :class="selectedCategory === 'Tümü' ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-100 font-bold'"
              >
                <div class="flex items-center gap-2 truncate pr-1">
                  <Layers :size="13" />
                  <span class="truncate">Tüm İhale İlanları</span>
                </div>
                <span 
                  class="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                  :class="selectedCategory === 'Tümü' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-600'"
                >
                  {{ allTenders.length }}
                </span>
              </button>

              <!-- Kategori Maddeleri -->
              <button
                v-for="cat in filteredCategoryTree"
                :key="cat.id"
                type="button"
                @click="selectedCategory = cat.name"
                class="w-full p-2 rounded-lg text-left flex items-center justify-between transition cursor-pointer text-xs group"
                :class="selectedCategory === cat.name ? 'bg-[#0084B4] text-white font-black shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-semibold'"
              >
                <div class="flex items-center gap-2 truncate pr-1">
                  <Folder :size="13" :class="selectedCategory === cat.name ? 'text-white' : 'text-[#0084B4]'" class="shrink-0" />
                  <span class="truncate text-[11px]">{{ cat.name }}</span>
                </div>
                <span 
                  class="px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0"
                  :class="selectedCategory === cat.name ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-medium group-hover:bg-blue-50 group-hover:text-blue-700'"
                >
                  {{ cat.count }}
                </span>
              </button>

            </div>
          </div>

          <!-- Alt Filtreler: Şehir / Tür / Usul / Bütçe -->
          <div class="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs space-y-3.5">
            <span class="font-black text-slate-800 text-xs block pb-1 border-b border-slate-100">
              ⚡ Detaylı Filtreler
            </span>

            <!-- Şehir Seçimi -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">Şehir / Konum:</label>
              <select v-model="filterCity" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                <option value="Tümü">Tüm Türkiye (81 İl)</option>
                <option value="Çanakkale">Çanakkale</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Bursa">Bursa</option>
                <option value="Antalya">Antalya</option>
                <option value="Kocaeli">Kocaeli</option>
                <option value="Eskişehir">Eskişehir</option>
                <option value="Balıkesir">Balıkesir</option>
                <option value="Konya">Konya</option>
                <option value="Manisa">Manisa</option>
                <option value="Tekirdağ">Tekirdağ</option>
              </select>
            </div>

            <!-- İhale Türü -->
            <div class="space-y-1">
              <label class="font-bold text-[11px] text-slate-600 block">İhale Türü:</label>
              <select v-model="filterType" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
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
              <select v-model="filterMethod" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                <option value="Tümü">Tümü</option>
                <option value="Açık İhale">Açık İhale</option>
                <option value="Doğrudan Temin">Doğrudan Temin</option>
                <option value="Pazarlık Usulü">Pazarlık Usulü</option>
                <option value="Fiyat Araştırması">Fiyat Araştırması</option>
              </select>
            </div>

            <!-- Fiyat / Bütçe Aralığı -->
            <div class="space-y-1.5">
              <label class="font-bold text-[11px] text-slate-600 block">Fiyat / Bütçe Aralığı (₺):</label>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="minPriceFilter" type="number" placeholder="Min ₺" class="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
                <input v-model="maxPriceFilter" type="number" placeholder="Max ₺" class="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
              </div>
            </div>

            <!-- Sıfırla Butonu -->
            <button 
              type="button" 
              @click="resetAllFilters" 
              class="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw :size="13" />
              <span>Filtreleri Temizle</span>
            </button>
          </div>

        </aside>

        <!-- ========================================================= -->
        <!-- ➡️ ORTA / ANA SÜTUN: RESİMLİ İHALE İLANLARI (SAHİBİNDEN LİSTE & VİTRİN) -->
        <!-- ========================================================= -->
        <main class="lg:col-span-8 xl:col-span-9 space-y-3">
          
          <!-- Tablo Başlığı ve Kontrol Barı -->
          <div class="bg-white border border-slate-300 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            <!-- Sol: Sonuç Sayacı & Aktif Filtre Rozetleri -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-black text-slate-800 text-xs">
                Toplam <strong>{{ filteredTendersList.length }}</strong> İhale İlanı Bulundu
              </span>

              <span v-if="selectedCategory !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-sky-100 text-[#0084B4] border border-sky-200 font-bold text-[11px] flex items-center gap-1">
                <span>{{ selectedCategory }}</span>
                <button type="button" @click="selectedCategory = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <span v-if="filterCity !== 'Tümü'" class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[11px] flex items-center gap-1">
                <span>{{ filterCity }}</span>
                <button type="button" @click="filterCity = 'Tümü'" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>

              <span v-if="filterKeyword" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] flex items-center gap-1">
                <span>"{{ filterKeyword }}"</span>
                <button type="button" @click="filterKeyword = ''" class="hover:text-red-600 cursor-pointer"><X :size="11" /></button>
              </span>
            </div>

            <!-- Sağ: Sıralama & Görünüm Değiştirici -->
            <div class="flex items-center gap-2.5">
              
              <!-- Sıralama Dropdown -->
              <div class="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
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
              <div class="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
                <button 
                  type="button" 
                  @click="viewLayout = 'list'"
                  class="p-1.5 rounded-md transition cursor-pointer"
                  :class="viewLayout === 'list' ? 'bg-white text-[#0084B4] shadow-xs' : 'text-slate-500 hover:text-slate-800'"
                  title="Liste Görünümü"
                >
                  <Layers :size="14" />
                </button>
                <button 
                  type="button" 
                  @click="viewLayout = 'grid'"
                  class="p-1.5 rounded-md transition cursor-pointer"
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
          <div v-if="viewLayout === 'list' && filteredTendersList.length > 0" class="space-y-3">
            <div 
              v-for="tender in filteredTendersList" 
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

                <!-- Alıcı / Kurum & Şehir -->
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span class="flex items-center gap-1 font-bold text-slate-800">
                    <Building2 :size="13" class="text-blue-600 shrink-0" />
                    <span class="truncate max-w-[220px]">{{ tender.ownerCompany || tender.authority || 'Kurumsal Satın Alma Masası' }}</span>
                  </span>

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
          <div v-else-if="viewLayout === 'grid' && filteredTendersList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="tender in filteredTendersList" 
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
                  <p class="text-[11px] text-slate-500 line-clamp-2">{{ tender.ownerCompany || tender.authority }}</p>
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
            <h3 class="font-black text-slate-800 text-sm">Seçilen Filtrelere Uygun İhale Bulunamadı</h3>
            <p class="text-slate-500 text-xs max-w-sm mx-auto">
              Arama kriterlerinizi değiştirerek veya sol menüden farklı bir kategori seçerek tekrar deneyebilirsiniz.
            </p>
            <button 
              type="button" 
              @click="resetAllFilters" 
              class="px-4 py-2 rounded-xl bg-[#0084B4] text-white font-bold text-xs hover:bg-[#00739D] transition cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>

        </main>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏙️ DİĞER SEKMELER (ŞEHİRLER, SEKTÖRLER, İDARELER, FİRMALAR) -->
    <!-- ========================================================================= -->

    <!-- SEKME: ŞEHİRLER -->
    <div v-if="activeSubMenu === 'sehirler'" class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div class="bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <span>🇹🇷 Türkiye Geneli (81 İl) İhale Listeleri</span>
          </span>
          <button @click="activeSubMenu = 'kategoriler'" class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer">
            ⬅ İhalelere Dön
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
          <button 
            v-for="city in ['Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce']" 
            :key="city"
            type="button"
            @click="filterCity = city; activeSubMenu = 'kategoriler'"
            class="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-sky-50 text-left font-bold text-slate-700 transition cursor-pointer flex items-center justify-between"
          >
            <span>🚩 {{ city }}</span>
            <span class="text-[10px] text-blue-600 font-mono">İhaleler →</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SEKME: SEKTÖRLER -->
    <div v-if="activeSubMenu === 'sektorler'" class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div class="bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <span>🏭 Faaliyet Sektörleri (CPV Kodlu)</span>
          </span>
          <button @click="activeSubMenu = 'kategoriler'" class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer">
            ⬅ İhalelere Dön
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <button 
            v-for="cat in allCategoriesList" 
            :key="cat.id"
            type="button"
            @click="selectedCategory = cat.name; activeSubMenu = 'kategoriler'"
            class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-sky-50 text-left font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
          >
            <span class="truncate pr-2">📁 {{ cat.name }}</span>
            <span class="text-blue-600 shrink-0 font-bold">Listele →</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SEKME: İDARELER -->
    <div v-if="activeSubMenu === 'idareler'" class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div class="bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <span>🏛️ Kamu ve Özel Kurum / İdare Listesi</span>
          </span>
          <button @click="activeSubMenu = 'kategoriler'" class="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer">
            ⬅ İhalelere Dön
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div 
            v-for="auth in ['Çanakkale Belediyesi', 'İstanbul Büyükşehir', 'Ankara Sanayi Odası 1. OSB', 'Balıkesir Büyükşehir', 'İzmir İYTE Teknopark', 'Devlet Su İşleri (DSİ)', 'Mega Lojistik ve Dağıtım', 'Eskişehir OSB', 'Antalya Tarım İşletmeleri', 'Ege Ambalaj ve İhracat', 'Konya Sanayi Odası', 'Çorlu Serbest Bölge']"
            :key="auth"
            @click="filterKeyword = auth; activeSubMenu = 'kategoriler'"
            class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-sky-50 text-left font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
          >
            <span class="truncate pr-1">🏢 {{ auth }}</span>
            <span class="text-blue-600 shrink-0 font-bold">İhaleler →</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SEKME: FİRMALAR -->
    <div v-if="activeSubMenu === 'firmalar'" class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div class="bg-white border border-slate-300 rounded-xl p-4 shadow-xs space-y-3">
        <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 font-black text-slate-800 text-xs border border-slate-300">
            <span>🏢 Doğrulanmış Kurumsal B2B Firmalar</span>
          </span>
          <NuxtLink to="/firmalar" class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs">
            Tüm Firma Dizinini Aç →
          </NuxtLink>
        </div>
        <p class="text-xs text-slate-500">
          İhaleciBurada platformunda kayıtlı, vergi levhası ve MERSİS kayıtları doğrulanmış tedarikçi ve alıcı firmalar.
        </p>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📄 İHALE DETAY MODALI (EKAP / İHALECİBURADA FULL MULTI-TAB) -->
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
            <span class="font-bold text-slate-800">{{ selectedTenderModal.ownerCompany || selectedTenderModal.authority || 'Kurumsal Masası' }}</span>
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
            class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
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
    <!-- 🚀 HIZLI TEKLİF VERME MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showQuickBidModal && quickBidTender" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-left border border-slate-200">
        
        <div class="flex items-start justify-between gap-3 border-b pb-3 border-slate-100">
          <div>
            <span class="text-[10px] font-black text-blue-600 uppercase tracking-wider block">DOĞRUDAN TEKLİF VER</span>
            <h3 class="text-sm sm:text-base font-black text-slate-900 mt-0.5">{{ quickBidTender.baslik }}</h3>
          </div>
          <button @click="showQuickBidModal = false" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">Alıcı Kurum:</span>
            <span class="font-bold">{{ quickBidTender.ownerCompany || quickBidTender.authority }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">Hedef Bütçe:</span>
            <span class="font-mono font-black text-emerald-700">{{ quickBidTender.butce }}</span>
          </div>
        </div>

        <!-- Teklif Formu -->
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Teklif Fiyatınız (KDV Dahil ₺) *</label>
            <input 
              v-model="quickOfferPrice" 
              type="text" 
              placeholder="Örn: 420.000 ₺" 
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Teslimat / Geçerlilik Süresi</label>
            <select v-model="quickOfferDuration" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium outline-none">
              <option value="3 gün">3 Gün İçinde Teslim</option>
              <option value="7 gün">7 Gün İçinde Teslim</option>
              <option value="15 gün">15 Gün İçinde Teslim</option>
              <option value="30 gün">30 Gün İçinde Teslim</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Teklif Notu & Açıklamanız (Opsiyonel)</label>
            <textarea 
              v-model="quickOfferNotes" 
              rows="2" 
              placeholder="Teknik şartnameye uygunluk, garanti ve nakliye detayları..." 
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button 
            type="button" 
            @click="showQuickBidModal = false" 
            class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
          >
            İptal
          </button>
          <button 
            type="button" 
            @click="submitQuickBid" 
            class="px-6 py-2.5 rounded-xl bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Send :size="13" />
            <span>Teklifi Onayla & Gönder</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>