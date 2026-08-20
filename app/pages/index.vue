<script setup lang="ts">
import { ref, computed } from 'vue'
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
  TrendingDown,
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
  Folder,
  Zap,
  Briefcase,
  Volume2,
  Settings,
  Hourglass,
  Cookie,
  ListTodo,
  Sparkles,
  Check,
  Info,
  Camera,
  Eye,
  Image as ImageIcon
} from 'lucide-vue-next'

// Nuxt Layout Meta
definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada — B2B Canlı Eksiltme ve Satın Alma Platformu',
  ogTitle: 'İhaleciBurada — B2B Canlı Eksiltme ve Satın Alma Platformu',
  description: 'Tedarik maliyetlerinizi canlı eksiltme ihaleleri ve doğrudan fiyat pazarlığı ile düşürün. Doğrulanmış kurumsal tedarikçilerden anında belgeli teklif toplayın.',
  ogDescription: 'Tedarik maliyetlerinizi canlı eksiltme ihaleleri ve doğrudan fiyat pazarlığı ile düşürün. Doğrulanmış kurumsal tedarikçilerden anında belgeli teklif toplayın.',
  ogImage: 'https://ihaleciburada.com/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'İhaleciBurada — B2B Canlı Eksiltme ve Satın Alma Platformu',
  twitterDescription: 'Tedarik maliyetlerinizi %14\'e varan oranlarda düşürün. Şeffaf ve şifreli B2B e-ihale arenası dakikalar içinde yayında.',
  twitterImage: 'https://ihaleciburada.com/logo.png'
})

useHead({
  htmlAttrs: {
    lang: 'tr'
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' },
    { rel: 'preload', as: 'image', href: '/hero_port_background.png', fetchpriority: 'high' },
    { rel: 'canonical', href: 'https://ihaleciburada.com' }
  ],
  meta: [
    { name: 'keywords', content: 'ihale, b2b ihale, ters ihale, eksiltme ihalesi, kurumsal satın alma, tedarikçi yönetimi, canlı teklif, rfq, e-ihale, ihaleciburada' },
    { name: 'author', content: 'İhaleciBurada Bilişim ve Tedarik A.Ş.' },
    { name: 'robots', content: 'index, follow' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'İhaleciBurada',
        'url': 'https://ihaleciburada.com',
        'description': 'B2B Canlı Eksiltme ve Kurumsal Satın Alma Platformu',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://ihaleciburada.com/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'İhaleciBurada A.Ş.',
        'url': 'https://ihaleciburada.com',
        'logo': 'https://ihaleciburada.com/logo.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+90-850-308-00-00',
          'contactType': 'customer service',
          'email': 'info@ihaleciburada.com',
          'availableLanguage': 'Turkish'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Tersine ihale (eksiltme) sistemi nasıl çalışır?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Alıcı firma satın almak istediği malzeme veya hizmet için miktar ve teknik şartname belirterek ihale açar. Doğrulanmış tedarikçiler canlı sürede fiyat eksilterek yarışır.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Platformda şirket doğrulaması nasıl yapılıyor?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Vergi levhası, imza sirküleri ve ticaret sicil gazetesi ekibimizce kontrol edilir. Yalnızca onaylanmış kurumsal hesaplar ihale açabilir ve teklif verebilir.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Ödeme ve teslimat süreçleri güvenli mi?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Evet. Alıcı firma ihale bedelini güvenli hesaba yatırır. Teslimat onaylanıp denetlendikten sonra ödeme tedarikçiye aktarılır.'
            }
          }
        ]
      })
    }
  ]
})

import { onMounted } from 'vue'
import { locale, detectLocale, t } from '~/composables/useLocale'

const { cmsData } = useCmsData()

const heroVideoRef = ref<HTMLVideoElement | null>(null)
const userSession = ref<any>(null)

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.firstName)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        userSession.value = JSON.parse(raw)
      } else {
        userSession.value = null
      }
    } catch {
      userSession.value = null
    }
  }
}

onMounted(() => {
  detectLocale()
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
  }
  if (heroVideoRef.value) {
    heroVideoRef.value.play().catch(err => {
      console.warn('Autoplay prevented:', err)
    })
  }
  if (typeof window !== 'undefined') {
    const accepted = localStorage.getItem('cookieConsentAccepted')
    if (accepted === 'true') {
      showCookieConsent.value = false
    }
  }
})

const currencySymbol = computed(() => '₺')

const localizedHero = computed(() => cmsData.value.hero)
const localizedLiveTender = computed(() => cmsData.value.liveTender)
const localizedTrustStrip = computed(() => [
  { title: 'Firma Doğrulama', desc: 'Güvenli ve onaylı ticaret zinciri' },
  { title: 'Güvenli İşlem Akışı', desc: 'KVKK uyumlu, zaman damgalı kayıt izleri' },
  { title: 'Şeffaf Karşılaştırma', desc: 'Teknik & idari detaylar tek ekranda' },
  { title: '81 İlde Hizmet', desc: 'Tüm Türkiye sınırlarında tedarik ağı' }
])
const localizedStats = computed(() => cmsData.value.stats)
const localizedVideoGuides = computed(() => cmsData.value.videoGuides)
const localizedFeatures = computed(() => cmsData.value.features)
const localizedTrustStandards = computed(() => cmsData.value.trustStandards)
const localizedProblems = computed(() => cmsData.value.problems)
const localizedFaqs = computed(() => (cmsData.value?.faqs || []).map(f => ({ question: f?.q || f?.question || '', answer: f?.a || f?.answer || '' })))

function acceptCookieConsent() {
  showCookieConsent.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('cookieConsentAccepted', 'true')
  }
}

/* =========================================================
   GENEL DURUMLAR & TABLAR
========================================================= */
const activeAudience = ref<'buyer' | 'supplier'>('buyer')
const openFaq = ref<number | null>(0)
const showCookieConsent = ref(true)

// Tasarruf Hesaplama Modülü
const annualVolume = ref(5000000)
const savingsRate = 0.142
const calculatedSavings = computed(() => Math.round(annualVolume.value * savingsRate))
const savedHours = computed(() => Math.round((annualVolume.value / 100000) * 1.5))
const connectedSuppliersCount = computed(() => Math.round((annualVolume.value / 1000000) * 8 + 32))

// İletişim Formu Modülü
const contactMethod = ref<'email' | 'phone'>('email')
const contactEmail = ref('')
const contactPhone = ref('')
const contactMessage = ref('')
const contactSubmitted = ref(false)
const contactError = ref('')
const contactSuccess = ref(false)

function submitContactForm() {
  contactError.value = ''
  contactSuccess.value = false
  
  if (contactMethod.value === 'email' && !contactEmail.value) {
    contactError.value = 'Lütfen geçerli bir kurumsal e-posta adresi girin.'
    return
  }
  if (contactMethod.value === 'phone' && !contactPhone.value) {
    contactError.value = 'Lütfen geçerli bir telefon numarası girin.'
    return
  }
  
  contactSubmitted.value = true
  
  setTimeout(() => {
    contactSubmitted.value = false
    contactSuccess.value = true
    contactEmail.value = ''
    contactPhone.value = ''
    contactMessage.value = ''
  }, 1200)
}

// Firma Profilleri ve Yorumlar Veritabanı
const companyProfiles: Record<string, {
  name: string
  logo?: string
  verified: boolean
  sector: string
  phone: string
  email: string
  address: string
  kep: string
  mersis: string
  rating: number
  reviews: Array<{ author: string, company: string, rating: number, comment: string, date: string }>
}> = {
  'Anadolu E-Ticaret A.Ş.': {
    name: 'Anadolu E-Ticaret A.Ş.',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Matbaa, Kırtasiye ve Ambalaj / Bilişim',
    phone: '+90 (312) 444 0 262',
    email: 'info@anadoluecommerce.com',
    address: 'Çankaya, Ankara, Türkiye',
    kep: 'anadoluecommerce@hs01.kep.tr',
    mersis: '0086-0442-9910-0015',
    rating: 4.9,
    reviews: [
      { author: 'Kemal Yılmaz', company: 'Yılmaz Lojistik A.Ş.', rating: 5, comment: 'Süreç yönetimi ve ambalaj kalitesinden son derece memnun kaldık. Zamanında teslimat.', date: '12 Haz 2026' },
      { author: 'Derya Bulut', company: 'Grafik Tasarım Ofisi', rating: 4.8, comment: 'Canlı ihale aşamasında çok profesyonel davrandılar. Güvenilir iş ortağı.', date: '28 May 2026' },
      { author: 'Can Demir', company: 'Demir İnşaat Ltd.', rating: 5, comment: 'Kurumsal satıcı şartnamelerine tam uyum sağlayan mükemmel bir operasyon.', date: '10 Nis 2026' }
    ]
  },
  'Marmara Teknoloji Yatırımları A.Ş.': {
    name: 'Marmara Teknoloji Yatırımları A.Ş.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Teknoloji, Donanım ve Entegrasyon',
    phone: '+90 (212) 222 34 56',
    email: 'contact@marmaratech.com',
    address: 'Levent, İstanbul, Türkiye',
    kep: 'marmaratech@hs01.kep.tr',
    mersis: '0612-0894-3310-0022',
    rating: 4.7,
    reviews: [
      { author: 'Ahmet Yıldız', company: 'Yıldız Ambalaj Sanayi', rating: 4.5, comment: 'Entegrasyon süreçlerinde teknik ekipleri son derece destekleyiciydi.', date: '04 Tem 2026' },
      { author: 'Elif Kaya', company: 'Kaya Mimarlık', rating: 5, comment: 'Teknoloji donanım ihalemizde en rekabetçi ve şeffaf teklifleri sundular.', date: '15 Haz 2026' }
    ]
  },
  'Bursa Endüstri Üretim A.Ş.': {
    name: 'Bursa Endüstri Üretim A.Ş.',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Sanayi, Yedek Parça ve Makine',
    phone: '+90 (224) 444 16 16',
    email: 'info@bursaindustry.com.tr',
    address: 'Nilüfer OSB, Bursa, Türkiye',
    kep: 'bursaindustry@hs01.kep.tr',
    mersis: '0188-0234-9912-0048',
    rating: 4.8,
    reviews: [
      { author: 'Selin Şahin', company: 'Pazarlama Acentesi', rating: 4.8, comment: 'Fason yedek parça üretim standartları yüksek. Denetim süreçlerinden başarıyla geçtiler.', date: '19 Haz 2026' }
    ]
  },
  'Ege Gıda Sanayi Ltd. Şti.': {
    name: 'Ege Gıda Sanayi Ltd. Şti.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Tarım, Gıda ve Paketleme',
    phone: '+90 (232) 777 88 99',
    email: 'satis@egefood.com',
    address: 'Bornova, İzmir, Türkiye',
    kep: 'egegida@hs01.kep.tr',
    mersis: '0344-0125-7734-0019',
    rating: 4.6,
    reviews: [
      { author: 'Mehmet Öz', company: 'Mali Müşavirlik', rating: 4.6, comment: 'Gıda tedarik sözleşmelerinde şartname kriterlerine tam sadakat gösteriyorlar.', date: '01 Tem 2026' }
    ]
  },
  'Atlas Holding A.Ş.': {
    name: 'Atlas Holding A.Ş.',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Lojistik, Taşımacılık ve Depolama',
    phone: '+90 (216) 555 12 34',
    email: 'operasyon@atlasholding.com.tr',
    address: 'Ataşehir, İstanbul, Türkiye',
    kep: 'atlasholding@hs01.kep.tr',
    mersis: '0077-0941-2245-0012',
    rating: 4.9,
    reviews: [
      { author: 'Onur Koç', company: 'E-Ticaret Danışmanlığı', rating: 5, comment: 'Lojistik ve sevkiyat takip sistemleri çok gelişmiş. Güven veren işleyiş.', date: '10 Tem 2026' }
    ]
  }
}

const showCompanyModal = ref(false)
const selectedCompany = ref<any>(null)

const showImageLightboxModal = ref(false)
const lightboxImageUrl = ref('')
const lightboxTitle = ref('')

function openImageLightbox(tender: any) {
  if (tender.image) {
    lightboxImageUrl.value = tender.image
    lightboxTitle.value = tender.title
    showImageLightboxModal.value = true
  }
}

function openCompanyModal(companyName: string) {
  const profile = companyProfiles[companyName]
  if (profile) {
    selectedCompany.value = profile
  } else {
    selectedCompany.value = {
      name: companyName,
      logo: '',
      verified: false,
      sector: 'Genel B2B Tedarik ve Hizmet',
      phone: '+90 (850) 888 00 00',
      email: 'info@' + companyName.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '') + '.com',
      address: 'Türkiye',
      kep: companyName.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '') + '@hs01.kep.tr',
      mersis: '0XXX-XXXX-XXXX-XXXX',
      rating: 4.5,
      reviews: [
        { author: 'Sistem Yöneticisi', company: 'GelAnlaşalım Platformu', rating: 5, comment: 'B2B platform üyesi kurumsal satıcı.', date: 'Temmuz 2026' }
      ]
    }
  }
  showCompanyModal.value = true
}

/* =========================================================
   FİLTRE STATE'LERİ
========================================================= */
const explorerSearch = ref('')
const selectedCity = ref('')
const selectedCat = ref('')
const showAdvancedFilters = ref(false)
const selectedSubcategory = ref('')
const selectedSector = ref('')
const selectedType = ref('')
const selectedMethod = ref('')
const selectedPricingType = ref('')

const expandedCategory = ref<string | null>(null)
const expandedFilterSection = ref<string | null>('categories')

const expandedTenderId = ref<number | null>(null)
const activeDetailTab = ref<string | null>(null)

/* =========================================================
   SABİT VERİ TANIMLARI
========================================================= */
const cities = [
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

const detailedCategories = [
  {
    name: 'İnşaat & Yapı İşleri',
    count: 248,
    children: [
      'Anahtar Teslim İnşaat', 'Konut İnşaatı', 'Ticari Bina İnşaatı', 'Fabrika İnşaatı', 'Yol İnşaatı',
      'Köprü İnşaatı', 'Altyapı Çalışmaları', 'Kanalizasyon & Drenaj', 'Su Şebekesi Hattı', 'Doğalgaz Boru Hattı',
      'Elektrik Altyapısı', 'Çatı İşleri', 'Cephe Kaplama', 'Isı Yalıtımı', 'Boya & Dekorasyon',
      'Seramik & Karo İşleri', 'Mermer İşleri', 'Demir & Çelik Konstrüksiyon', 'Kalıp & İskele İşleri', 'Beton İşleri',
      'Asfalt Kaplama', 'Parke Zemin Kaplama', 'Peyzaj Mimarlığı', 'Yıkım Hizmetleri', 'Bina Restorasyonu'
    ]
  },
  {
    name: 'Gayrimenkul & Emlak',
    count: 122,
    children: [
      'Arsa & Arazi', 'Tarım Arazisi & Tarla', 'Bağ & Bahçe', 'Konut & Daire', 'Lüks Villa', 'Rezidans', 'Ofis & Büro', 'Ticari Dükkan & Mağaza', 'İş Merkezi & Plaza',
      'Sanayi Tesisleri', 'Depo & Antrepo', 'Alışveriş Merkezi (AVM)', 'Otel & Turistik Tesis', 'Kiralık Gayrimenkul', 'Satılık Gayrimenkul'
    ]
  },
  {
    name: 'Taşıtlar & İş Makineleri',
    count: 271,
    children: [
      'Binek Otomobiller', 'Ticari Araçlar', 'Kamyon & Tır', 'Ağır Nakliye Araçları', 'Otobüs', 'Minibüs', 'Tarım Traktörleri', 'İş Makineleri',
      'Ekskavatör', 'Yükleyici (Loder)', 'Greyder', 'Silindir', 'Forklift & İstifleme', 'Mobil Vinç', 'Endüstriyel Jeneratör', 'Ağır Dorse & Treyler',
      'Araç Filo Kiralama', 'İş Makinesi Kiralama'
    ]
  },
  {
    name: 'Sanayi & İmalat Makineleri',
    count: 323,
    children: [
      'Üretim Makineleri', 'CNC İşleme Merkezleri', 'Torna Makineleri', 'Freze Makineleri', 'Endüstriyel Presler', 'Hava Kompresörleri', 'Konveyör Sistemleri', 'Ambalaj Makineleri',
      'Gıda İşleme Makineleri', 'Plastik İşleme Makineleri', 'Tekstil Makineleri', 'Ağaç İşleme Makineleri', 'Endüstriyel Kaynak Makineleri',
      'Robotik Otomasyon', 'Endüstriyel Otomasyon'
    ]
  },
  {
    name: 'Bilgisayar & Teknoloji',
    count: 352,
    children: [
      'Masaüstü İş İstasyonları', 'Dizüstü Bilgisayar (Laptop)', 'Kurumsal Sunucular (Server)', 'Veri Depolama (NAS/SAN)', 'Ağ Altyapısı (Network)', 'Kurumsal Güvenlik Duvarı (Firewall)',
      'Endüstriyel Yazıcılar', 'Doküman Tarayıcılar', 'Yazılım Lisansları', 'ERP Sistemleri', 'CRM Yazılımları', 'Web Geliştirme', 'Mobil Uygulama',
      'Bulut Hizmetleri (Cloud)', 'Siber Güvenlik', 'Yapay Zeka Çözümleri', 'SEO Hizmetleri', 'GEO Analitik', 'Büyük Veri Analizi'
    ]
  },
  {
    name: 'Elektronik & Güvenlik',
    count: 122,
    children: [
      'Akıllı Telefonlar', 'Tablet Bilgisayarlar', 'Profesyonel Kameralar', 'CCTV Kameralar', 'Hırsız Alarm Sistemleri', 'Televizyon & Ekranlar',
      'Ses Sistemleri', 'HD Projeksiyon Cihazları', 'Kesintisiz Güç Kaynağı (UPS)', 'Baskılı Devre Kartları (PCB)', 'Akıllı Ev Sistemleri'
    ]
  },
  {
    name: 'Mobilya & Ofis Gereçleri',
    count: 208,
    children: [
      'Ofis Mobilyaları', 'Eğitim Mobilyaları', 'Hastane Mobilyaları', 'Otel & Restoran Mobilyaları', 'Depo Raf Sistemleri',
      'Arşivleme Sistemleri', 'Yönetici Toplantı Masaları', 'Ergonomik Ofis Koltukları', 'Bekleme & Lobi Koltukları'
    ]
  },
  {
    name: 'Sağlık & Medikal Ürünler',
    count: 251,
    children: [
      'Tıbbi Cihazlar', 'Laboratuvar Ekipmanları', 'Tıbbi Sarf Malzemeleri', 'Hasta Karyolası & Hastane Mobilyası',
      'Ambulanslar', 'Tıbbi Gaz Sistemleri', 'Röntgen Cihazları', 'Emar (MR) Cihazları', 'Ultrason Cihazları', 'Ağız & Diş Sağlığı Ürünleri'
    ]
  },
  {
    name: 'Eğitim & Öğretim Hizmetleri',
    count: 76,
    children: [
      'İnteraktif Akıllı Tahtalar', 'Bilgisayar Laboratuvarları', 'Eğitim Yazılımları', 'E-Öğrenme Platformları',
      'Akademik Danışmanlık', 'Kurumsal Eğitim Hizmetleri', 'Kitap & Eğitim Materyalleri', 'Kırtasiye Malzemeleri', 'Laboratuvar Malzemeleri'
    ]
  },
  {
    name: 'Gıda & Yemek Hizmetleri',
    count: 337,
    children: [
      'Hazır Yemek (Tabldot)', 'Endüstriyel Catering', 'Personel Yemek Hizmetleri', 'Saha Kumanyası', 'Et & Et Ürünleri', 'Süt & Süt Ürünleri',
      'Meyve & Sebze', 'Unlu Mamüller', 'İçecek Grubu', 'Kuru Gıda & Bakliyat'
    ]
  },
  {
    name: 'Tekstil & Konfeksiyon',
    count: 273,
    children: [
      'İş Elbiseleri & Üniforma', 'Okul Kıyafetleri', 'Güvenlik Kıyafetleri', 'Promosyon Tekstil',
      'İş Güvenlik Ayakkabıları', 'Endüstriyel Çizmeler', 'İş Eldivenleri', 'Kişisel Koruyucu Donanım (KKD)'
    ]
  },
  {
    name: 'Tarım & Hayvancılık',
    count: 84,
    children: [
      'Gübre & Tarım Kimyasalları', 'Tohum & Fide', 'Sulama Sistemleri', 'Tarım Makineleri', 'Tarım Traktörleri', 'Sera Sistemleri', 'Hayvan Yemi',
      'Veterinerlik Ürünleri', 'Büyükbaş Hayvancılık', 'Küçükbaş Hayvancılık', 'Kanatlı Hayvancılık'
    ]
  },
  {
    name: 'Enerji & Elektrik Sistemleri',
    count: 117,
    children: [
      'Güneş Enerjisi (GES)', 'Rüzgar Enerjisi (RES)', 'Dizel Jeneratörler', 'Elektrik Ekipmanları', 'Güç Transformatörleri',
      'Endüstriyel LED Aydınlatma', 'Enerji Verimliliği', 'Elektrikli Araç Şarj İstasyonları'
    ]
  },
  {
    name: 'Çevre & Geri Dönüşüm',
    count: 247,
    children: [
      'Atık Yönetimi', 'Geri Dönüşüm Hizmetleri', 'Hurda Metal & Kağıt', 'Çevre Danışmanlığı', 'Su Arıtma Tesisleri',
      'Tehlikeli Atık Yönetimi', 'Sıfır Atık Sistemleri', 'Endüstriyel Süpürme Araçları'
    ]
  },
  {
    name: 'Lojistik & Taşımacılık',
    count: 169,
    children: [
      'Karayolu Taşımacılığı', 'Denizyolu Taşımacılığı', 'Havayolu Taşımacılığı', 'Demiryolu Taşımacılığı', 'Depolama & Antrepo', 'Soğuk Hava Lojistiği',
      'Hızlı Kargo', 'Kurye Hizmetleri', 'Şehir İçi Nakliye'
    ]
  },
  {
    name: 'Güvenlik Sistemleri',
    count: 94,
    children: [
      'Kamera Güvenlik Sistemleri', 'Hırsız Alarmları', 'Yangın İhbar Sistemleri', 'Geçiş Kontrol Kartları', 'Turnike Sistemleri',
      'X-Ray Tarama Cihazları', 'Otomatik Bariyerler', 'Bekçi Tur Kontrol Sistemleri'
    ]
  },
  {
    name: 'Temizlik & Hijyen Hizmetleri',
    count: 247,
    children: [
      'Tesis Temizliği', 'Hastane Hijyeni', 'Okul Temizliği', 'Fabrika Temizliği', 'Dış Cephe Cam Temizliği',
      'Halı & Koltuk Yıkama', 'İlaçlama & Haşere Kontrolü', 'Evsel & Endüstriyel Atık Toplama'
    ]
  },
  {
    name: 'Turizm & Konaklama',
    count: 68,
    children: [
      'Otel Rezervasyonları', 'Konaklama Hizmetleri', 'Uçak Bileti', 'Araç Kiralama (Fleet)', 'Etkinlik Yönetimi', 'Rehberlik Hizmetleri',
      'Seyahat Paketleri'
    ]
  },
  {
    name: 'Reklam & Medya Hizmetleri',
    count: 142,
    children: [
      'Dijital Pazarlama', 'SEO Danışmanlığı', 'GEO Analitik', 'Google Ads Yönetimi', 'Sosyal Medya Yönetimi', 'Grafik Tasarım',
      'Kurumsal Kimlik Tasarımı', 'Matbaa & Baskı İşleri', 'Video Prodüksiyon', 'Profesyonel Fotoğrafçılık', 'Tanıtım Filmi'
    ]
  },
  {
    name: 'Ambalaj & Matbaa',
    count: 337,
    children: [
      'Oluklu Mukavva Kutu', 'Etiket & Stiker', 'Poşet & Ambalaj', 'Taşıma Kolisi', 'Promosyon Ürünleri', 'Ofset Baskı', 'Dijital Baskı',
      'Serigrafi Baskı'
    ]
  },
  {
    name: 'Telekomünikasyon & İletişim',
    count: 122,
    children: [
      'Fiber Optik Altyapı', 'IP Santral & Telefon', 'PBX Santral', 'Kurumsal İnternet', 'Mobil Operatör Hizmetleri', 'Baz İstasyonu Altyapısı'
    ]
  },
  {
    name: 'Danışmanlık & Müşavirlik',
    count: 163,
    children: [
      'Hukuki Danışmanlık', 'Mali Müşavirlik & Muhasebe', 'İnsan Kaynakları Danışmanlığı', 'Kalite Yönetim Danışmanlığı',
      'ISO Sertifikasyon', 'Proje Yönetimi', 'Eğitim Danışmanlığı'
    ]
  },
  {
    name: 'Sigorta & Reasürans Hizmetleri',
    count: 56,
    children: [
      'Filo Araç Kaskosu', 'Özel Sağlık Sigortası', 'Ticari Mülk & İşyeri Sigortası', 'Emtia & Nakliyat Sigortası',
      'İnşaat All-Risk Sigortası', 'Hayat Sigortası'
    ]
  },
  {
    name: 'Finans & Bankacılık',
    count: 115,
    children: [
      'Finansal Danışmanlık', 'Ekipman Leasing', 'Fatura Faktoring', 'Kredi Hizmetleri', 'Üye İşyeri POS Hizmetleri',
      'Ödeme Kuruluşu Altyapısı'
    ]
  },
  {
    name: 'Hukuk & İcra Hizmetleri',
    count: 76,
    children: [
      'Dava & Avukatlık Hizmetleri', 'Ticari Arabuluculuk', 'İcra & Alacak Takibi', 'Sözleşme Hazırlama', 'Marka Tescili',
      'Patent Tescili'
    ]
  },
  {
    name: 'Bakım, Onarım & Servis',
    count: 118,
    children: [
      'Elektrik Bakımı', 'Mekanik Onarım', 'Asansör Bakım & Servis', 'İklimlendirme (HVAC) Bakımı', 'Endüstriyel Makine Servisi',
      'Bilgisayar & Donanım Desteği', 'Sunucu Bakım Hizmetleri'
    ]
  },
  {
    name: 'Etkinlik & Organizasyon',
    count: 76,
    children: [
      'Fuar Organizasyonu', 'Kurumsal Konferans', 'Seminer & Çalıştay', 'Konser Prodüksiyonu', 'Festival Organizasyonu', 'Catering & İkram',
      'Sahne & Kurulum Sistemleri', 'Ses & Işık Sistemleri'
    ]
  },
  {
    name: 'Diğer Satın Almalar',
    count: 109,
    children: [
      'Çeşitli Sarf Malzemeleri', 'Karma İhaleler', 'Özel Projeler', 'Kamu Açık Artırmaları', 'Tasfiye Satışları',
      'Hurda İhaleleri', 'İkinci El Varlıklar'
    ]
  }
]

const sectors = [
  { name: 'Tarım, Çiftçilik, Balıkçılık ve Ormancılık', count: 84 },
  { name: 'Petrol, Yakıt, Elektrik ve Enerji', count: 97 },
  { name: 'Madencilik, Metal ve Hammaddeler', count: 64 },
  { name: 'Gıda ve İçecek', count: 189 },
  { name: 'Tarım Makineleri', count: 42 },
  { name: 'Giyim, Ayakkabı ve Aksesuar', count: 73 },
  { name: 'Tekstil, Plastik ve Kauçuk', count: 126 },
  { name: 'Basılı Malzeme ve Matbaa', count: 58 },
  { name: 'Kimyasal Ürünler', count: 91 },
  { name: 'Mobilya, Ofis ve Bilgi İşlem Ekipmanları', count: 168 },
  { name: 'Elektrikli Makine, Cihaz ve Aydınlatma', count: 144 },
  { name: 'Radyo, TV, İletişim ve Telekomünikasyon', count: 76 },
  { name: 'Tıbbi Cihaz, İlaç ve Kişisel Bakım', count: 112 },
  { name: 'Nakliye Araçları ve Yardımcı Ürünler', count: 89 },
  { name: 'Güvenlik ve Yangınla Mücadele', count: 61 },
  { name: 'Spor, Oyun, Oyuncak ve Sanat', count: 34 },
  { name: 'Laboratuvar, Optik ve Hassas Ekipman', count: 52 },
  { name: 'Mobilya, Mefruşat ve Temizlik Ürünleri', count: 103 },
  { name: 'Su ve Arıtma Sistemleri', count: 48 },
  { name: 'Sanayi Tipi Makineler', count: 156 },
  { name: 'İnşaat Makinesi ve Ekipmanları', count: 137 },
  { name: 'İnşaat, Yapı ve Yapı Malzemeleri', count: 248 },
  { name: 'İnşaat ve Taahhüt İşleri', count: 176 },
  { name: 'Yazılım ve Bilgi Sistemleri', count: 149 },
  { name: 'Onarım ve Bakım Hizmetleri', count: 118 },
  { name: 'Kurulum ve Teknik Servis Hizmetleri', count: 96 },
  { name: 'Otel, Restoran ve Perakende Hizmetleri', count: 67 },
  { name: 'Nakliye ve Lojistik Hizmetleri', count: 169 },
  { name: 'Seyahat ve Organizasyon Hizmetleri', count: 44 },
  { name: 'Posta, Kurye ve Telekomünikasyon Hizmetleri', count: 39 },
  { name: 'Finans ve Sigorta Hizmetleri', count: 56 },
  { name: 'Gayrimenkul Hizmetleri', count: 42 },
  { name: 'Mimarlık, Mühendislik ve Denetim', count: 95 },
  { name: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri', count: 183 },
  { name: 'Araştırma, Geliştirme ve Danışmanlık', count: 71 },
  { name: 'Yönetim ve Kurumsal Hizmetler', count: 63 },
  { name: 'Enerji ve Petrol Endüstrisi Hizmetleri', count: 54 },
  { name: 'Pazarlama, Hukuk ve İnsan Kaynakları', count: 81 },
  { name: 'Eğitim ve Öğretim Hizmetleri', count: 76 },
  { name: 'Sağlık ve Sosyal Hizmetler', count: 92 },
  { name: 'Temizlik, Atık ve Çevre Hizmetleri', count: 114 },
  { name: 'Kültür, Rekreasyon ve Spor Hizmetleri', count: 38 }
]

const tenderTypes = computed(() => [
      { name: 'Mal Alımı', count: 578 },
      { name: 'Hizmet Alımı', count: 207 },
      { name: 'Yapım İşi', count: 180 },
      { name: 'Fason Üretim', count: 92 },
      { name: 'Kiralama', count: 85 },
      { name: 'Satış Talebi', count: 39 }
    ])

const offerMethods = computed(() => [
      { name: 'Açık Teklif', count: 546 },
      { name: 'Kapalı Teklif', count: 395 },
      { name: 'Davetli İhale', count: 151 },
      { name: 'Ters İhale', count: 98 },
      { name: 'Fiyat Araştırması', count: 68 },
      { name: 'Doğrudan Teklif Talebi', count: 57 }
    ])

const pricingTypes = computed(() => [
      { name: 'Toplam / Götürü Bedel', count: 214 },
      { name: 'Birim Fiyat', count: 323 },
      { name: 'Kısmi Teklif Verilebilir', count: 115 },
      { name: 'Kısmi Teklif Verilemez', count: 277 }
    ])

const tenders = [
  {
    id: 1,
    featured: true,
    title: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
    company: 'Marmara Teknoloji Yatırımları A.Ş.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Elektronik, Bilgisayar ve İletişim',
    sector: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri',
    city: 'İstanbul',
    type: 'Mal Alımı',
    method: 'Kapalı Teklif',
    pricing: 'Birim Fiyat',
    deadline: '22 Temmuz 2026',
    daysLeft: 7,
    offers: 14,
    value: '5.500.000 ₺',
    description: 'Kurumsal kullanım için teknik şartnameye uygun 500 adet dizüstü bilgisayar alımı.',
    material_list: '1. Intel i7 İşlemcili Dizüstü Bilgisayar - 350 Adet\n2. Intel i5 İşlemcili Dizüstü Bilgisayar - 150 Adet',
    admin_spec: '• Teklifler birim fiyat üzerinden toplanacaktır.\n• Teslimat süresi siparişten itibaren en fazla 30 gündür.',
    tech_spec: '• En az 16GB RAM ve 512GB NVMe SSD bulunmalıdır.\n• 3 yıl yerinde üretici garantisi zorunludur.',
    similar_history: '2025/1049 - 200 Adet Masaüstü Bilgisayar Alımı (Sonuç: 2.100.000 ₺)'
  },
  {
    id: 2,
    featured: false,
    title: 'Üretim Tesisi Çatı ve İzolasyon Yenileme İşi',
    company: 'Bursa Endüstri Üretim A.Ş.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'İnşaat, Altyapı ve Yapı İşleri',
    sector: 'İnşaat ve Taahhüt İşleri',
    city: 'Bursa',
    type: 'Yapım İşi',
    method: 'Açık Teklif',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '25 Temmuz 2026',
    daysLeft: 10,
    offers: 8,
    value: '1.250.000 ₺',
    description: 'Fabrika üretim tesisi çatı kaplama ve ısı izolasyon yenileme işi.',
    material_list: '1. Çatı Sandviç Panel Kaplama (40mm EPS) - 1.800 m²\n2. İzolasyon Membranı Uygulaması - 1.800 m²',
    admin_spec: '• İş tesliminde hakediş usulü ödeme yapılacaktır.\n• Geçici teminat mektubu talep edilmektedir.',
    tech_spec: '• Sandviç paneller TSE ve yangın dayanım belgeli olmalıdır.\n• Uygulama garantisi en az 5 yıl olmalıdır.',
    similar_history: '2025/4490 - Depo Çatı Tamiratı (Sonuç: 450.000 ₺)'
  },
  {
    id: 3,
    featured: false,
    title: '12 Aylık Personel Taşıma Hizmeti',
    company: 'Ege Gıda Sanayi Ltd. Şti.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Nakliye, Lojistik ve Taşımacılık',
    sector: 'Nakliye ve Lojistik Hizmetleri',
    city: 'İzmir',
    type: 'Hizmet Alımı',
    method: 'Kapalı Teklif',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '19 Temmuz 2026',
    daysLeft: 4,
    offers: 21,
    value: '840.000 ₺',
    description: 'Üretim tesisi çalışanları için 12 aylık personel servis taşımacılığı hizmeti.',
    material_list: '1. 27 Kişilik Servis Aracı (Günlük 2 Sefer) - 3 Hat\n2. 16 Kişilik Servis Aracı (Günlük 2 Sefer) - 2 Hat',
    admin_spec: '• Ödemeler aylık olarak düzenlenecek fatura karşılığında yapılacaktır.\n• Sürücülerin SRC belgeleri eksiksiz olmalıdır.',
    tech_spec: '• Araçların yaş sınırı en fazla 5 olmalıdır.\n• Koltuk sigortaları ve D2 belgeleri bulunmalıdır.',
    similar_history: '2025/1102 - 12 Aylık Servis Hizmeti (Sonuç: 720.000 ₺)'
  },
  {
    id: 4,
    featured: true,
    title: '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi',
    company: 'Anadolu E-Ticaret A.Ş.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Matbaa, Kırtasiye ve Ambalaj',
    sector: 'Basılı Malzeme ve Matbaa',
    city: 'Ankara',
    type: 'Fason Üretim',
    method: 'Ters İhale',
    pricing: 'Birim Fiyat',
    deadline: '18 Temmuz 2026',
    daysLeft: 3,
    offers: 17,
    value: '350.000 ₺',
    description: 'Marka standartlarına uygun baskılı ürün kutularının fason üretimi.',
    material_list: '1. Kraft Dopel Kutu (25x20x10 cm) - 50.000 Adet\n2. Selefonlu Baskılı Kutu (15x15x8 cm) - 50.000 Adet',
    admin_spec: '• Numune onayı alındıktan sonra seri üretime başlanacaktır.\n• Teslimat 3 parti halinde Ankara depomuza yapılacaktır.',
    tech_spec: '• Baskı kalitesi minimum 300 DPI olmalıdır.\n• Oluklu mukavva gramajı şartnameye uygun olmalıdır.',
    similar_history: '2025/9012 - Ambalaj Kolisi Alımı (Sonuç: 180.000 ₺)'
  },
  {
    id: 5,
    featured: false,
    title: 'Kurumsal Web Yazılım ve Mobil Uygulama Projesi',
    company: 'Atlas Holding A.Ş.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Yazılım, Bilişim ve Dijital Hizmetler',
    sector: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri',
    city: 'İstanbul',
    type: 'Hizmet Alımı',
    method: 'Davetli İhale',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '30 Temmuz 2026',
    daysLeft: 15,
    offers: 6,
    value: '2.800.000 ₺',
    description: 'Kurumsal portal, mobil uygulama ve yönetim paneli geliştirme hizmeti.',
    material_list: '1. UI/UX Tasarım Süreci - 1 Aşama\n2. Kurumsal Web Sitesi & CMS - 1 Sistem\n3. iOS & Android Mobil Uygulama - 2 Uygulama',
    admin_spec: '• Ödeme takvimi proje kilometre taşlarına (milestones) göre yapılacaktır.\n• Kaynak kodları teslim edilecektir.',
    tech_spec: '• Backend teknolojisi Node.js/Go, frontend Vue.js/React olmalıdır.\n• Test kapsamı ve dokümantasyon tam olmalıdır.',
    similar_history: '2025/7829 - CRM Entegrasyonu Projesi (Sonuç: 950.000 ₺)'
  }
]

const faqs = [
  {
    question: 'GelAnlaşalım nedir?',
    answer: 'GelAnlaşalım, özel sektördeki firmaların satın alma taleplerini yayınlayabildiği, tedarikçilerin ise bu taleplere teklif verebildiği dijital ihale ve iş fırsatları platformudur.'
  },
  {
    question: 'Kimler GelAnlaşalım kullanabilir?',
    answer: 'Satın alma yapan şirketler, KOBİ’ler, üreticiler, hizmet sağlayıcılar, tedarikçiler ve yeni müşterilere ulaşmak isteyen tüm işletmeler platformu kullanabilir.'
  },
  {
    question: 'Platformda kamu ihaleleri var mı?',
    answer: 'Hayır. GelAnlaşalım özel sektör odaklıdır. Platformun temel amacı şirketler arasındaki satın alma, teklif toplama ve tedarik süreçlerini B2B tersine ihale modeliyle dijitalleştirmektir.'
  },
  {
    question: 'İhale oluşturmak ücretli mi?',
    answer: 'Ücretlendirme modeli seçilen plana göre belirlenir. Temel planımız ile ücretsiz deneme yapabilir, profesyonel veya kurumsal paketlerimiz için lansmana özel indirimli fiyatlardan yararlanabilirsiniz.'
  },
  {
    question: 'Ters ihale (Eksiltme) nedir?',
    answer: 'Tersine ihalede satıcılar belirlenen süre içerisinde en rekabetçi teklifleri sunar. Fiyatların anlık düştüğü şeffaf rekabet arenasıyla alıcı firma en optimum ticari koşullara ulaşır.'
  }
]

const buyerSteps = computed(() => [
      { number: '01', title: 'İhtiyacını Yayınla', text: 'Ürün veya hizmet ihtiyacını oluştur. Teknik ve idari şartname belgelerini yükle.' },
      { number: '02', title: 'Rekabet Arenasını İzle', text: 'Tedarikçilerin anlık fiyat kırarak yarıştığı tersine ihale arenasını canlı takip et.' },
      { number: '03', title: 'En Uygun Teklifle Anlaş', text: 'Fiyat, kalite ve teslimat şartlarına göre en doğru kararı ver ve anlaşmayı kilitlesin.' }
    ])

const supplierSteps = computed(() => [
      { number: '01', title: 'İş Fırsatlarını Keşfet', text: 'Sektörüne ve uzmanlık alanına uygun güncel kurumsal ihaleleri saniyeler içinde bul.' },
      { number: '02', title: 'Teklifini Gönder', text: 'Teknik şartları incele, malzeme bazlı birim fiyat teklifini güvenle ilet.' },
      { number: '03', title: 'Yeni Portföy Kazan', text: 'Doğrulanmış B2B alıcılar ile doğrudan iş anlaşmaları yap ve ticaret hacmini büyüt.' }
    ])

const activeSteps = computed(() => activeAudience.value === 'buyer' ? buyerSteps.value : supplierSteps.value)

const localizedTenders = computed(() => tenders || [])

/* =========================================================
   İN-MEMORY FİLTRELEME MANTIĞI
========================================================= */
const filteredTenders = computed(() => {
  return localizedTenders.value.filter((t) => {
    const q = explorerSearch.value.toLocaleLowerCase('tr')
    const searchMatch = !explorerSearch.value || 
      t.title.toLocaleLowerCase('tr').includes(q) ||
      t.company.toLocaleLowerCase('tr').includes(q) ||
      t.description.toLocaleLowerCase('tr').includes(q)

    const cityMatch = !selectedCity.value || t.city === selectedCity.value
    const catMatch = !selectedCat.value || t.category === selectedCat.value
    const subcatMatch = !selectedSubcategory.value || t.description.toLocaleLowerCase('tr').includes(selectedSubcategory.value.toLocaleLowerCase('tr'))
    const sectorMatch = !selectedSector.value || t.sector === selectedSector.value
    const typeMatch = !selectedType.value || t.type === selectedType.value
    const methodMatch = !selectedMethod.value || t.method === selectedMethod.value
    const pricingMatch = !selectedPricingType.value || t.pricing === selectedPricingType.value

    return searchMatch && cityMatch && catMatch && subcatMatch && sectorMatch && typeMatch && methodMatch && pricingMatch
  })
})

/* =========================================================
   YARDIMCI FONKSİYONLAR & HIZLI TEKLİF & PAZARLIK SİSTEMİ
========================================================= */
const showQuickBidModal = ref(false)
const showAuthRequiredModal = ref(false)
const quickBidTender = ref<any>(null)
const quickBidPrice = ref('')
const quickBidDeliveryDays = ref('')
const quickBidNotes = ref('')
const isSubmittingQuickBid = ref(false)

// Firmanın İhalesine Gelen Teklifler Listesi
const incomingBids = ref([
  {
    id: 101,
    tenderTitle: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
    tenderId: 1,
    bidderFirm: 'TeknoBilişim Dağıtım Ltd. Şti.',
    verified: true,
    bidAmount: 5120000,
    originalValue: 5500000,
    savings: '%6.9 Tasarruf',
    deliveryDays: 14,
    notes: 'TSE belgeli 3 yıl yerinde garantili teslimat.',
    status: 'Yeni Teklif ⚡',
    timeAgo: '12 dk önce',
    negotiationHistory: []
  },
  {
    id: 102,
    tenderTitle: 'Üretim Tesisi Çatı ve İzolasyon Yenileme İşi',
    tenderId: 2,
    bidderFirm: 'Marmara Yapı & İzolasyon A.Ş.',
    verified: true,
    bidAmount: 1140000,
    originalValue: 1250000,
    savings: '%8.8 Tasarruf',
    deliveryDays: 20,
    notes: 'Yangın dayanımlı taşyünü ve membran kaplama dahildir.',
    status: 'Pazarlık Sürecinde 💬',
    timeAgo: '45 dk önce',
    negotiationHistory: [
      { sender: 'Siz', text: 'Birim fiyatı 1.100.000 ₺ yapabilirseniz hemen onaylayacağız.', price: 1100000, date: '1 saat önce' }
    ]
  },
  {
    id: 103,
    tenderTitle: '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi',
    tenderId: 4,
    bidderFirm: 'Anadolu Ambalaj & Koli Sanayi',
    verified: true,
    bidAmount: 318000,
    originalValue: 350000,
    savings: '%9.1 Tasarruf',
    deliveryDays: 10,
    notes: 'Numune baskı 48 saatte onayınıza sunulur.',
    status: 'Yeni Teklif ⚡',
    timeAgo: '2 saat önce',
    negotiationHistory: []
  }
])

const showNegotiationModal = ref(false)
const selectedBidForNegotiation = ref<any>(null)
const counterOfferPrice = ref('')
const counterOfferNotes = ref('')

function openNegotiationModal(bid: any) {
  selectedBidForNegotiation.value = bid
  counterOfferPrice.value = bid.bidAmount ? String(Math.round(bid.bidAmount * 0.96)) : ''
  counterOfferNotes.value = 'Teklifinizi inceledik. Belirttiğimiz hedef fiyata çekilmesi durumunda ihale tarafınıza verilecektir.'
  showNegotiationModal.value = true
}

function submitCounterOffer() {
  if (!counterOfferPrice.value) {
    alert('Lütfen karşı teklif / hedef pazarlık tutarını giriniz.')
    return
  }
  if (selectedBidForNegotiation.value) {
    selectedBidForNegotiation.value.status = 'Karşı Teklif İletildi (Pazarlık) 💬'
    if (!selectedBidForNegotiation.value.negotiationHistory) {
      selectedBidForNegotiation.value.negotiationHistory = []
    }
    selectedBidForNegotiation.value.negotiationHistory.push({
      sender: 'Siz (İhale Sahibi)',
      price: Number(counterOfferPrice.value),
      text: counterOfferNotes.value,
      date: 'Şimdi'
    })
  }
  showNegotiationModal.value = false
  alert(`💬 PAZARLIK TEKLİFİNİZ İLETİLDİ!\n\n${selectedBidForNegotiation.value?.bidderFirm} firmasına ${Number(counterOfferPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki karşı teklifiniz başarıyla gönderilmiştir.`)
}

function acceptBid(bid: any) {
  bid.status = 'Teklif Kabul Edildi ✓'
  alert(`🎉 TEBRİKLER!\n\n${bid.bidderFirm} firmasının teklifini kabul ettiniz. Sözleşme ve onay aşamasına geçilmiştir.`)
}

/* =========================================================
   KURUMSAL ABONELİK VE LİSANS PLANLARI (YURT İÇİ & YURT DIŞI)
========================================================= */
const homePricingRegion = ref<'domestic' | 'international'>('domestic')
const homePricingCurrency = ref<'USD' | 'EUR'>('USD')

const homePricingDomestic = [
  {
    id: '1-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 1 AY',
    price: 900,
    monthly: '₺900,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPopular: false,
    badge: 'KURUMSAL KULLANIM'
  },
  {
    id: '3-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 3 AY',
    price: 1800,
    monthly: '₺600,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı',
    isPopular: true,
    badge: '⚡ EN ÇOK TERCİH EDİLEN POPÜLER PLAN'
  },
  {
    id: '6-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 6 AY',
    price: 2700,
    monthly: '₺450,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı',
    isPopular: false,
    badge: 'KURUMSAL KULLANIM'
  },
  {
    id: '9-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 9 AY',
    price: 3600,
    monthly: '₺400,00 / ay',
    desc: '9 Aylık Avantaj Paketinde Net %55 Tasarruf',
    isPopular: false,
    badge: 'YILLIK AVANTAJ'
  }
]

const homePricingGlobalUSD = [
  {
    id: '1-mo-usd',
    name: 'GLOBAL PASS - 1 MONTH',
    price: 29,
    monthly: '$29.00 / mo',
    desc: '1 Month Full Access to Global B2B Auction Arena (VAT Exempt)',
    isPopular: false,
    badge: 'ENTERPRISE PLAN'
  },
  {
    id: '3-mo-usd',
    name: 'GLOBAL PASS - 3 MONTHS',
    price: 59,
    monthly: '$19.66 / mo',
    desc: '3 Months High Demand Tier with Instant Verification Priority',
    isPopular: true,
    badge: '⚡ MOST POPULAR GLOBAL PLAN'
  },
  {
    id: '6-mo-usd',
    name: 'GLOBAL PASS - 6 MONTHS',
    price: 89,
    monthly: '$14.83 / mo',
    desc: '6 Months International Sourcing & Unlimited RFQ Creation',
    isPopular: false,
    badge: 'ENTERPRISE PLAN'
  },
  {
    id: '9-mo-usd',
    name: 'GLOBAL PASS - 9 MONTHS',
    price: 119,
    monthly: '$13.22 / mo',
    desc: '9 Months Full Commercial & Tender Management License',
    isPopular: false,
    badge: 'ANNUAL ENTERPRISE'
  }
]

function scrollToFeed() {
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      const el = document.getElementById('ihale-gezgini-feed')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }
}

// 🟢 HIZLI TEKLİF VER: GİRİŞ YAPMA ZORUNLULUĞU KONTROLÜ
function openQuickBidModal(tender: any) {
  if (!isLoggedIn.value) {
    quickBidTender.value = tender
    showAuthRequiredModal.value = true
    return
  }
  quickBidTender.value = tender
  quickBidPrice.value = ''
  quickBidDeliveryDays.value = '7'
  quickBidNotes.value = ''
  showQuickBidModal.value = true
}

// 🟢 İHALE DOSYALARI MODAL & İNDİRME SİSTEMİ
const showTenderDocsModal = ref(false)
const selectedTenderForDocs = ref<any>(null)

function openTenderDocsModal(tender: any) {
  selectedTenderForDocs.value = tender
  showTenderDocsModal.value = true
}

function downloadDoc(docType: 'teknik' | 'idari' | 'malzeme' | 'ilan' | 'tum') {
  if (!selectedTenderForDocs.value) return
  const t = selectedTenderForDocs.value
  let filename = ''
  let content = ''

  if (docType === 'teknik') {
    filename = `Teknik_Sartname_Ihale_${100000 + t.id}.txt`
    content = `========================================================\nTEKNİK ŞARTNAME & KALİFİKASYON STANDARTLARI\nİhale No: 2026/${100000 + t.id}\nİhale Başlığı: ${t.title}\nAlıcı Kurum: ${t.company}\nTeslim Yeri: ${t.city}\nSon Teklif Tarihi: ${t.deadline}\n========================================================\n\nTEKNİK ŞARTNAME MADDELERİ:\n${t.tech_spec || 'Teknik şartnameye uygun teslimat zorunludur.'}\n\nGARANTİ VE KALİTE STANDARTLARI:\n- TSE / CE / ISO belgeli ürün teslimi zorunludur.\n- En az 2 yıl üretici veya ithalatçı garantisi aranır.\n- Hatalı ürünler 48 saat içerisinde yenisiyle değiştirilecektir.\n`
  } else if (docType === 'idari') {
    filename = `Idari_Sartname_Ihale_${100000 + t.id}.txt`
    content = `========================================================\nİDARİ ŞARTNAME & SÖZLEŞME GENEL HÜKÜMLERİ\nİhale No: 2026/${100000 + t.id}\nİhale Başlığı: ${t.title}\nAlıcı Kurum: ${t.company}\nTeslimat Şehri: ${t.city}\n========================================================\n\nİDARİ ŞARTLAR:\n${t.admin_spec || 'Tüm ödemeler teslim ve kabul tutanağını takiben 14 iş günü içinde yapılır.'}\n\nÖDEME VE TESLİMAT KOŞULLARI:\n- Ödeme: Kabul onayı sonrası banka havalesi / EFT ile gerçekleştirilir.\n- Gecikme Cezası: Her geciken gün için ihale bedelinin %0.5 oranında kesinti uygulanır.\n`
  } else if (docType === 'malzeme') {
    filename = `Malzeme_Ve_Birim_Fiyat_Cetveli_${100000 + t.id}.txt`
    content = `========================================================\nMALZEME VE BİRİM FİYAT TEKLİF CETVELİ\nİhale No: 2026/${100000 + t.id}\nİhale Başlığı: ${t.title}\n========================================================\n\nMALZEME / HİZMET KALEMLERİ:\n${t.material_list}\n\nNOT: Tedarikçiler bu cetveldeki tüm kalemlere birim fiyat girmelidir.\n`
  } else if (docType === 'ilan') {
    filename = `Resmi_Ihale_Ilani_${100000 + t.id}.txt`
    content = `========================================================\nRESMİ İHALE İLAN METNİ VE DUYURUSU\nİhale No: 2026/${100000 + t.id}\nİhale Adı: ${t.title}\nİhale Türü: ${t.type} - ${t.method}\nAlıcı Firma: ${t.company} (Onaylı Kurumsal Üye)\nTahmini Bütçe Hacmi: ${t.value}\nSon Teklif Verme Tarihi: ${t.deadline} (${t.daysLeft} gün kaldı)\n========================================================\n\nİLAN AÇIKLAMASI:\n${t.description}\n`
  } else {
    filename = `Ihale_Dosyasi_Paketi_2026_${100000 + t.id}.txt`
    content = `========================================================\nİHALECİBURADA.COM - RESMİ İHALE DOSYASI PAKETİ\nİhale No: 2026/${100000 + t.id}\nBaşlık: ${t.title}\nFirma: ${t.company}\nBölge: ${t.city}\nBütçe: ${t.value}\n========================================================\n\n1. İLAN METNİ:\n${t.description}\n\n2. MALZEME LİSTESİ:\n${t.material_list}\n\n3. İDARİ ŞARTNAME:\n${t.admin_spec}\n\n4. TEKNİK ŞARTNAME:\n${t.tech_spec}\n\n========================================================\nBu ihale dosyası İhaleciBurada platformu üzerinden resmi olarak üretilmiştir.\n`
  }

  if (typeof document !== 'undefined') {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

function submitQuickBid() {
  if (!quickBidPrice.value) {
    alert('Lütfen teklif tutarınızı giriniz.')
    return
  }
  isSubmittingQuickBid.value = true
  setTimeout(() => {
    isSubmittingQuickBid.value = false
    showQuickBidModal.value = false
    if (quickBidTender.value) {
      quickBidTender.value.offers = (quickBidTender.value.offers || 0) + 1
    }
    alert(`🎉 TEKLİFİNİZ İLETİLDİ!\n\n${quickBidTender.value?.company} firmasına ${Number(quickBidPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki teklifiniz anında başarıyla iletilmiştir.`)
  }, 500)
}

function clearFilters() {
  explorerSearch.value = ''
  selectedCity.value = ''
  selectedCat.value = ''
  selectedSubcategory.value = ''
  selectedSector.value = ''
  selectedType.value = ''
  selectedMethod.value = ''
  selectedPricingType.value = ''
  showAdvancedFilters.value = false
}

function toggleCategory(catName: string) {
  if (expandedCategory.value === catName) {
    expandedCategory.value = null
  } else {
    expandedCategory.value = catName
    selectedCat.value = catName
    selectedSubcategory.value = ''
    scrollToFeed()
  }
}

function selectSubcategory(catName: string, subcatName: string) {
  selectedCat.value = catName
  selectedSubcategory.value = subcatName
  scrollToFeed()
}

function toggleFilterSection(section: string) {
  expandedFilterSection.value = expandedFilterSection.value === section ? null : section
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    <!-- 🟢 1. B2B EXPLORER SECTION (İHALE PAZARI & GEZGİNİ) -->
    <section id="ihale-gezgini" class="border-b border-slate-200 bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <!-- Explorer Header -->
        <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end text-left">
          <div>
            <span class="text-[10px] font-black text-[#0052FF] uppercase tracking-widest">İHALE PAZARI</span>
            <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Doğru Firmayla Doğru Şartlarda Anlaşın</h2>
            <p class="mt-3 max-w-2xl text-xs text-slate-500">Sektörünüze özel ihaleleri sol panelden filtreleyin; teklif süreçlerini canlı takip edin.</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3.5 flex flex-col gap-1 items-start">
            <span class="text-xs font-black text-blue-900">{{ filteredTenders.length }} {{ 'Aktif Sonuç' }}</span>
            <span class="text-[10px] text-blue-600">{{ 'Kriterlere göre anlık güncellenir' }}</span>
          </div>
        </div>

        <!-- Explorer Main 2-Column Layout (Narrowed Sidebar & Swapped Order) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- RIGHT / NARROWED SIDEBAR: Categories & Sectors (order-2 on desktop) -->
          <aside class="lg:col-span-3 lg:order-2 bg-slate-50/90 border border-slate-200/90 rounded-3xl p-4 text-left shadow-sm sticky top-24">
            <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Folder :size="15" class="text-blue-600" />
                <span>{{ 'Kategoriler & Sektörler' }}</span>
              </h3>
              <button 
                v-if="selectedCat || selectedSubcategory" 
                @click="clearFilters" 
                class="text-[10px] font-black text-rose-600 hover:underline uppercase"
              >
                {{ 'Tümünü Gör' }}
              </button>
            </div>

            <!-- Vertical Accordion List -->
            <div class="space-y-1 max-h-[540px] overflow-y-auto pr-1 custom-scrollbar text-xs font-medium">
              <div 
                v-for="cat in detailedCategories" 
                :key="cat.name"
                class="rounded-xl transition-all"
              >
                <!-- Main Category Expandable Button -->
                <button 
                  @click="toggleCategory(cat.name)"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-white hover:text-blue-600 font-bold transition-all text-left group text-xs"
                  :class="expandedCategory === cat.name || selectedCat === cat.name ? 'bg-blue-600 text-white hover:text-white font-extrabold shadow-sm' : ''"
                >
                  <div class="flex items-center gap-1.5 truncate pr-1">
                    <ChevronRight 
                      :size="13" 
                      class="transition-transform shrink-0" 
                      :class="{ 'rotate-90': expandedCategory === cat.name }" 
                    />
                    <span class="truncate text-[11px]">{{ cat.name }}</span>
                  </div>
                  <span 
                    class="text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0"
                    :class="expandedCategory === cat.name || selectedCat === cat.name ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700'"
                  >
                    {{ cat.count }}
                  </span>
                </button>

                <!-- Subcategories Accordion Panel (Scrollable with max-height) -->
                <div 
                  v-if="expandedCategory === cat.name" 
                  class="ml-3 pl-2.5 border-l-2 border-blue-200 space-y-1 my-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar"
                >
                  <button 
                    v-for="sub in cat.children" 
                    :key="sub"
                    @click="selectSubcategory(cat.name, sub)"
                    class="w-full text-left py-1 px-2 rounded-lg text-[10px] transition-colors truncate"
                    :class="selectedSubcategory === sub ? 'font-black text-blue-600 bg-blue-50 border border-blue-200/80 shadow-xs' : 'text-slate-600 hover:bg-white hover:text-blue-600'"
                  >
                    • {{ sub }}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <!-- LEFT / MAIN FEED: Search, Filter Bar & Tender Cards (order-1 on desktop) -->
          <main class="lg:col-span-9 lg:order-1 space-y-6 text-left">
            <!-- Sleek Horizontal Filter Bar -->
            <div class="bg-white border border-slate-200/80 rounded-3xl p-5 premium-shadow space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Search query input (7 cols) -->
                <div class="md:col-span-7 relative">
                  <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    v-model="explorerSearch" 
                    type="text" 
                    id="explorerSearchInput" 
                    aria-label="İlan Arama" 
                    :placeholder="'İlan başlığı, malzeme veya firma adı ile arayın...'" 
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" 
                  />
                </div>

                <!-- City Select (5 cols) -->
                <div class="md:col-span-5 relative">
                  <MapPin :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    v-model="selectedCity" 
                    class="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white appearance-none transition-all cursor-pointer"
                  >
                    <option value="">{{ 'Tüm Türkiye (81 İl)' }}</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                  <ChevronDown :size="14" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <!-- Advanced Filters Trigger & Clear Button -->
              <div class="flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                <button 
                  @click="showAdvancedFilters = !showAdvancedFilters" 
                  class="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                >
                  <SlidersHorizontal :size="14" class="text-blue-600" />
                  {{ 'Gelişmiş Filtreler (Tür & Yöntem)' }}
                  <ChevronDown :size="12" class="transition-transform" :class="{ 'rotate-180': showAdvancedFilters }" />
                </button>

                <button 
                  v-if="selectedCat || selectedSubcategory || selectedSector || selectedCity || selectedType || selectedMethod || selectedPricingType || explorerSearch"
                  @click="clearFilters" 
                  class="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase flex items-center gap-1"
                >
                  <X :size="12" />
                  {{ 'Filtreleri Temizle' }}
                </button>
              </div>

              <!-- Advanced Filters Grid -->
              <div 
                v-if="showAdvancedFilters" 
                class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4"
              >
                <!-- Tender Type -->
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Briefcase :size="11" class="text-blue-600" />
                    {{ 'İhale Türü' }}
                  </label>
                  <select 
                    v-model="selectedType" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ 'Tüm Türler' }}</option>
                    <option v-for="t in tenderTypes" :key="t.name" :value="t.name">{{ t.name }}</option>
                  </select>
                </div>

                <!-- Bidding Method -->
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <SlidersHorizontal :size="11" class="text-blue-600" />
                    {{ 'Teklif Yöntemi' }}
                  </label>
                  <select 
                    v-model="selectedMethod" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ 'Tüm Yöntemler' }}</option>
                    <option v-for="m in offerMethods" :key="m.name" :value="m.name">{{ m.name }}</option>
                  </select>
                </div>

                <!-- Pricing Type -->
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <FileText :size="11" class="text-blue-600" />
                    {{ 'Fiyatlandırma Türü' }}
                  </label>
                  <select 
                    v-model="selectedPricingType" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ 'Tüm Türler' }}</option>
                    <option v-for="p in pricingTypes" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Active Filter Badges -->
            <div v-if="selectedCat || selectedSubcategory || selectedSector || selectedCity || selectedType || selectedMethod || selectedPricingType" class="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-left">
              <div class="text-[9px] font-black uppercase tracking-wider text-blue-600 mb-2">{{ 'Aktif Filtreler' }}</div>
              <div class="flex flex-wrap gap-2">
                <button v-if="selectedCat" @click="selectedCat = ''; selectedSubcategory = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Kategori: {{ selectedCat }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedSubcategory" @click="selectedSubcategory = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Alt Kategori: {{ selectedSubcategory }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedCity" @click="selectedCity = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Şehir: {{ selectedCity }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedType" @click="selectedType = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Tür: {{ selectedType }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedMethod" @click="selectedMethod = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Yöntem: {{ selectedMethod }} <span class="text-slate-400">×</span>
                </button>
              </div>
            </div>

            <!-- Tenders Feed Anchor & Active Filter Status Banner -->
            <div id="ihale-gezgini-feed" class="space-y-4">
              
              <!-- Active Category Status Banner -->
              <transition name="fade">
                <div v-if="selectedCat || selectedSubcategory" class="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 flex items-center justify-between flex-wrap gap-3 text-xs font-bold text-amber-950 shadow-xs">
                  <div class="flex items-center gap-2">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <span>
                      ⚡ <strong>{{ selectedCat }}</strong> <span v-if="selectedSubcategory">→ {{ selectedSubcategory }}</span> kategorisindeki ihaleler listeleniyor ({{ filteredTenders.length }} İhale)
                    </span>
                  </div>
                  <button @click="clearFilters" class="px-3 py-1.5 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs">
                    ✕ Tüm İlanları Göster
                  </button>
                </div>
              </transition>

              <!-- Empty State Card when filteredTenders has 0 items -->
              <div v-if="filteredTenders.length === 0" class="p-12 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-4 my-6">
                <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600 mb-2">
                  <Search :size="32" />
                </div>
                <h3 class="text-lg font-black text-slate-800">
                  {{ 'Aramanıza Uygun İhale Bulunamadı' }}
                </h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {{ 'Seçtiğiniz filtrelerde henüz aktif bir ihale bulunmuyor. Filtreleri temizleyebilir veya hemen ücretsiz bir ihale ilanı oluşturabilirsiniz.' }}
                </p>
                <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button @click="clearFilters" class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-xs cursor-pointer">
                    {{ 'Filtreleri Temizle' }}
                  </button>
                  <NuxtLink to="/panel/ihale-olustur" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md flex items-center gap-1.5">
                    <Plus :size="14" />
                    {{ 'Ücretsiz İhale Oluştur' }}
                  </NuxtLink>
                </div>
              </div>

              <div v-for="res in filteredTenders" :key="res.id" class="p-6 rounded-2xl bg-white border border-slate-200/80 premium-shadow flex flex-col text-left hover:border-blue-300 transition-all duration-200">
                  <div class="flex flex-col lg:flex-row lg:justify-between gap-6">
                    
                    <!-- 🖼️ İhale Görseli (Eğer görsel varsa gösterilir) -->
                    <div 
                      v-if="res.image" 
                      class="relative group/img shrink-0 rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 w-full sm:w-44 h-40 sm:h-36 cursor-pointer shadow-xs" 
                      @click="openImageLightbox(res)"
                      title="Görseli büyütmek için tıklayın"
                    >
                      <img 
                        :src="res.image" 
                        :alt="res.title" 
                        class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300" 
                      />
                      <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-black gap-1.5 backdrop-blur-2xs">
                        <Eye :size="16" class="text-amber-400" />
                        <span>Büyüt 🔍</span>
                      </div>
                      <span class="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Camera :size="10" class="text-amber-400" /> 
                        <span>{{ res.images?.length > 1 ? res.images.length + ' Fotoğraf' : 'Görsel' }}</span>
                      </span>
                    </div>

                    <!-- İhale Bilgileri -->
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span v-if="res.featured" class="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[9px] font-black text-orange-700 uppercase">🔥 {{ 'Öne Çıkan' }}</span>
                        <span class="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-black text-blue-700 uppercase">{{ res.type }}</span>
                        <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.method }}</span>
                        <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.pricing }}</span>
                      </div>

                      <h3 class="mt-4 text-base font-black text-slate-800 hover:text-blue-600 transition-colors leading-snug">{{ res.title }}</h3>
                      <div @click="openCompanyModal(res.company)" class="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-amber-600 transition-colors select-none" title="Firma profilini, puanlarını ve kıstas seviyesini gör">
                        <Building2 :size="14" class="text-slate-400" />
                        <span class="underline decoration-slate-300 font-extrabold">{{ res.company }}</span>
                        <span v-if="res.verified" class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wider flex items-center gap-0.5">
                          <ShieldCheck :size="10" /> {{ 'ONAYLI ÜYE' }}
                        </span>
                        <span class="rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 text-[9px] font-black tracking-wide transition shadow-2xs">
                          👁️ {{ 'Profili & Puanları Gör' }}
                        </span>
                      </div>
                    <p class="mt-3 text-xs leading-relaxed text-slate-500 font-medium">{{ res.description }}</p>

                    <div class="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                      <span class="flex items-center gap-1.5"><MapPin :size="14" /> {{ res.city }}</span>
                      <span class="flex items-center gap-1.5"><Clock3 :size="14" /> {{ res.offers }} {{ 'teklif toplandı' }}</span>
                      <button 
                        type="button"
                        @click="openTenderDocsModal(res)" 
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        title="İhale şartname ve resmi ihale dosyalarını aç ve bilgisayara indir"
                      >
                        <Download :size="13" class="text-emerald-600" />
                        <span>{{ '📄 İhale Dosyasını İndir (.PDF)' }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Right panel within card -->
                  <div class="flex min-w-[200px] flex-col justify-between border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <div class="text-[9px] font-black uppercase text-slate-400">{{ 'Son Teklif Tarihi' }}</div>
                      <div class="mt-1 text-sm font-black text-slate-800">{{ res.deadline }}</div>
                      <div class="mt-1 text-xs font-black text-red-500">{{ res.daysLeft }} {{ 'gün kaldı' }}</div>
                    </div>
                    
                    <div class="space-y-2 mt-6">
                      <button 
                        @click="openQuickBidModal(res)" 
                        class="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-3 shadow-md hover:shadow-lg transition-all border border-amber-300 cursor-pointer"
                      >
                        <Zap :size="15" class="fill-slate-950 text-slate-950" />
                        <span>{{ '⚡ Hızlı Teklif Ver' }}</span>
                      </button>

                      <button 
                        @click="expandedTenderId = expandedTenderId === res.id ? null : res.id; activeDetailTab = 'malzeme'" 
                        class="w-full flex items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all cursor-pointer"
                      >
                        {{ expandedTenderId === res.id ? ('Detayı Kapat') : ('İhale Detayları') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Detay Kartı Açılımı (EKAP Stili) -->
                <div v-if="expandedTenderId === res.id" class="w-full mt-6 p-4 rounded-xl bg-sky-50/30 text-slate-700 border border-sky-200 text-xs flex flex-col gap-4 shadow-sm">
                  <div class="flex items-center gap-2 pb-2 border-b border-sky-100">
                    <span class="bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded"># {{ 'İHALE NO' }}</span>
                    <span class="font-bold text-slate-800 text-xs">2026/{{ 100000 + res.id }} - {{ res.title }}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-6">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ 'İşin Niteliği' }}</span>
                      <p class="mt-1 text-slate-700 leading-relaxed">{{ res.description }}</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ 'Teslim Yeri' }}</span>
                      <p class="mt-1 text-slate-700 font-bold">{{ res.city }} / Turkey</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ 'Yaklaşık Maliyet Hacmi' }}</span>
                      <p class="mt-1 text-slate-900 font-mono font-black text-sm">{{ res.value }}</p>
                    </div>
                  </div>

                  <!-- Sekmeler -->
                  <div class="border-t border-sky-100 pt-3 flex flex-wrap gap-2">
                    <button 
                      v-for="tab in (res.image ? ['malzeme', 'ilan', 'goruntuler', 'idari', 'teknik', 'benzer'] : ['malzeme', 'ilan', 'idari', 'teknik', 'benzer'])" 
                      :key="tab" 
                      @click="activeDetailTab = tab" 
                      class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all uppercase tracking-wider flex items-center gap-1.5" 
                      :class="activeDetailTab === tab ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
                    >
                      <template v-if="tab === 'malzeme'">
                        <ListTodo :size="12" />
                        <span>{{ 'Malzeme Listesi' }}</span>
                      </template>
                      <template v-else-if="tab === 'ilan'">
                        <Volume2 :size="12" />
                        <span>{{ 'İhale İlanı' }}</span>
                      </template>
                      <template v-else-if="tab === 'goruntuler'">
                        <Camera :size="12" />
                        <span>{{ 'Fotoğraflar & Numune' }}</span>
                      </template>
                      <template v-else-if="tab === 'idari'">
                        <ShieldCheck :size="12" />
                        <span>{{ 'İdari Şartname' }}</span>
                      </template>
                      <template v-else-if="tab === 'teknik'">
                        <Settings :size="12" />
                        <span>{{ 'Teknik Şartname' }}</span>
                      </template>
                      <template v-else-if="tab === 'benzer'">
                        <Hourglass :size="12" />
                        <span>{{ 'Canlı Eksiltme' }}</span>
                      </template>
                    </button>
                  </div>

                  <!-- Sekme İçerikleri -->
                  <div class="bg-white border border-slate-200 rounded-xl p-4 mt-2">
                    <!-- Görseller & Numune Galerisi -->
                    <div v-if="activeDetailTab === 'goruntuler'" class="text-left space-y-3">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2 flex items-center gap-2">
                        <Camera :size="14" class="text-blue-600" />
                        <span>{{ 'İhale ve Numune Ürün Fotoğrafları' }}</span>
                      </h4>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div 
                          v-for="(imgUrl, imgIdx) in (res.images || [res.image])" 
                          :key="imgIdx"
                          class="relative rounded-2xl overflow-hidden border border-slate-200 group cursor-pointer h-48 bg-slate-100"
                          @click="lightboxImageUrl = imgUrl; lightboxTitle = res.title; showImageLightboxModal = true"
                        >
                          <img :src="imgUrl" :alt="res.title + ' Görsel ' + (imgIdx + 1)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div class="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-2xs">
                            <Eye :size="16" class="text-amber-400" /> <span>Tam Ekran Aç</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Malzeme Listesi -->
                    <div v-if="activeDetailTab === 'malzeme'">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Malzeme & Birim Fiyat Teklif Formu</h4>
                      <table class="w-full text-xs text-slate-600 border-collapse">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="p-2.5 text-left font-bold text-slate-700">Malzeme/Hizmet Kalemi</th>
                            <th class="p-2.5 text-center font-bold text-slate-700 w-24">Birim</th>
                            <th class="p-2.5 text-right font-bold text-slate-700 w-36">Birim Fiyat Teklifi (₺)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line, idx) in res.material_list.split('\n')" :key="idx" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                            <td class="p-2.5 font-medium text-slate-800 text-left">{{ line.split('-')[0]?.trim() }}</td>
                            <td class="p-2.5 text-center font-bold text-slate-500">{{ line.split('-')[1]?.trim() || '1 Adet' }}</td>
                            <td class="p-2.5 text-right">
                              <input type="number" aria-label="Birim Teklif Fiyatı" placeholder="0.00" class="w-32 text-right bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-600" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <span class="text-[10px] text-slate-400">Teklif vermek ve eksiltmeye katılmak için alıcı/satıcı portal girişi yapmalısınız.</span>
                        <NuxtLink to="/uyelik" class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xs flex items-center gap-1.5 shadow-sm">
                          Teklif Gönder ve Arenaya Katıl
                        </NuxtLink>
                      </div>
                    </div>

                    <!-- İhale İlanı -->
                    <div v-if="activeDetailTab === 'ilan'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Resmi İlan Özeti</h4>
                      <p>{{ res.description }} Bu ihale özel sektör satın alma kurallarına uygun olarak gelanlasalim.com altyapısında canlı eksiltme usulüyle yapılmaktadır.</p>
                    </div>

                    <!-- İdari Şartname -->
                    <div v-if="activeDetailTab === 'idari'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">İdari Şartname Maddeleri</h4>
                      <pre class="whitespace-pre-line font-sans">{{ res.admin_spec }}</pre>
                    </div>

                    <!-- Teknik Şartname -->
                    <div v-if="activeDetailTab === 'teknik'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Teknik Şartname & Yeterlilik</h4>
                      <pre class="whitespace-pre-line font-sans">{{ res.tech_spec }}</pre>
                    </div>

                    <!-- Benzer İhale Geçmişi / Canlı Eksiltme -->
                    <div v-if="activeDetailTab === 'benzer'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Sektör Geçmiş Sonuçları</h4>
                      <pre class="whitespace-pre-line font-sans text-emerald-600 font-bold mb-4">{{ res.similar_history }}</pre>

                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {{ 'Güncel Teklif Eksiltme Günlüğü (Audit Trail)' }}
                      </h4>
                      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 font-mono text-[11px] sm:text-xs text-slate-400">
                        <div class="flex justify-between">
                          <span class="text-slate-300 font-mono">[15:42:01] Tedarikçi #8 (Anonim Katılımcı)</span>
                          <span class="text-red-400 font-semibold">- {{ currencySymbol }}8.500 {{ 'indirim yaptı' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-300 font-mono">[15:39:12] Tedarikçi #3 (Anonim Katılımcı)</span>
                          <span class="text-red-400 font-semibold">- {{ currencySymbol }}12.000 {{ 'indirim yaptı' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-400 font-mono">[15:35:50] Sistem</span>
                          <span class="text-slate-500">{{ 'İhale canlı eksiltme aşamasına geçti' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sonuç Yok -->
              <div v-if="filteredTenders.length === 0" class="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Search :size="32" class="mx-auto text-slate-300 mb-3" />
                <h3 class="text-sm font-black text-slate-800">{{ 'Arama Kriterlerine Uygun İhale Bulunamadı' }}</h3>
                <p class="text-xs text-slate-500 mt-1">{{ 'Lütfen filtre seçeneklerini değiştirerek yeniden arayın.' }}</p>
                <button @click="clearFilters" class="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all">{{ 'Filtreleri Temizle' }}</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- 🟢 2. HERO SECTION -->
    <section class="relative overflow-hidden border-b border-slate-200 bg-slate-100 min-h-[640px]">
      <!-- Background Video -->
      <ClientOnly>
        <video 
          v-if="cmsData.hero.heroVideoUrl"
          ref="heroVideoRef"
          autoplay 
          loop 
          muted 
          playsinline 
          class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45"
        >
          <source :src="cmsData.hero.heroVideoUrl" type="video/mp4" />
        </video>
      </ClientOnly>
      <!-- Fallback image background if video is not available -->
      <div 
        v-if="!cmsData.hero.heroVideoUrl" 
        class="absolute inset-0 w-full h-full bg-cover bg-center z-0" 
        style="background-image: url('/hero_port_background.png'); opacity: 0.15;"
      ></div>

      <!-- Color Overlay for clean typography readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/85 to-white/95 z-0"></div>

      <!-- Decorative circles -->
      <div class="absolute right-[-10%] top-[-30%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl z-10"></div>
      <div class="absolute bottom-[-30%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl z-10"></div>

      <div class="relative z-20 mx-auto grid min-h-[640px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <!-- Hero Left -->
        <div class="text-left">
          <div class="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#0052FF]">
            <span class="h-px w-8 bg-[#0052FF]"></span>
            {{ localizedHero.tagline }}
          </div>
          <h1 class="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {{ localizedHero.titleLine1 }}<br />
            {{ localizedHero.titleLine2 }}<br />
            <span class="font-serif italic font-medium text-[#0052FF]">{{ localizedHero.titleItalic }}</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            {{ localizedHero.description }}
          </p>
          
          <!-- Buttons -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink to="/uyelik" class="flex items-center gap-2 rounded-xl px-6 py-4 text-xs font-black text-white shadow-xl shadow-blue-600/20 hover:opacity-95 transition-all bg-[#0F223D] hover:bg-[#0052FF]">
              {{ 'Hemen kurumsal hesap aç' }}
              <ArrowRight :size="15" class="text-[#00C2FF]" />
            </NuxtLink>
            <a href="#ihale-gezgini" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-4 text-xs font-black text-slate-700 hover:bg-white hover:text-[#0052FF] transition-all">
              {{ 'İhaleleri İncele' }}
              <ArrowRight :size="15" />
            </a>
          </div>

          <!-- Bottom Features Strip -->
          <div class="mt-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2">
            <template v-for="(badge, index) in localizedHero.badgeStrip" :key="index">
              <span>{{ badge }}</span>
              <span v-if="index < localizedHero.badgeStrip.length - 1" class="text-slate-300">•</span>
            </template>
          </div>

          <!-- Video Button -->
          <div class="mt-8">
            <button class="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
              {{ 'Video rehberlerini izle' }}
            </button>
          </div>
        </div>

        <!-- Hero Right (Live Card styled like the screenshot) -->
        <div class="relative">
          <div class="absolute -inset-8 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          <div class="relative mx-auto max-w-[460px] rounded-3xl border border-slate-200/80 bg-white/95 p-6 premium-shadow backdrop-blur-sm text-left">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span> {{ 'TEMSİLİ CANLI İHALE' }}
                </span>
                <h3 class="mt-1.5 text-base font-black text-slate-800">{{ localizedLiveTender.title }}</h3>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">{{ 'KALAN SÜRE' }}</span>
                <div class="mt-1 font-mono text-sm font-black text-slate-800">{{ localizedLiveTender.remainingTime }}</div>
              </div>
            </div>

            <!-- Price and Savings info -->
            <div class="py-6 flex justify-between items-start">
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">{{ 'GÜNCEL EN İYİ TEKLİF' }}</span>
                <div class="mt-1 text-4xl font-black text-slate-900 tracking-tight font-mono">
                  {{ currencySymbol }}{{ localizedLiveTender.bestBid.toLocaleString('tr-TR') }}
                </div>
                <div class="mt-2 text-[10px] text-slate-400 font-bold">
                  {{ 'AÇILIŞ FİYATI' }} <span class="font-mono text-slate-600 line-through">{{ currencySymbol }}{{ localizedLiveTender.openingPrice.toLocaleString('tr-TR') }}</span>
                </div>
              </div>
              
              <div class="text-right">
                <div class="rounded-lg px-2.5 py-1 text-[9px] font-black" style="background: rgba(30,174,76,0.08); color: #1EAE4C;">
                  {{ localizedLiveTender.savingsText }}
                </div>
              </div>
            </div>

            <!-- Competitor List -->
            <div class="space-y-2 border-t border-slate-100 pt-5">
              <div class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                {{ localizedLiveTender.competitors.length }} {{ 'TEDARİKÇİ YARIŞIYOR' }}
              </div>
              
              <div 
                v-for="comp in localizedLiveTender.competitors" 
                :key="comp.name" 
                class="flex items-center justify-between rounded-xl px-4 py-2.5"
                :class="comp.leader ? 'border border-blue-200/60 bg-blue-50/40' : 'bg-white border border-slate-200/60'"
              >
                <div class="flex items-center gap-2.5 text-xs font-bold" :class="comp.leader ? 'text-slate-800' : 'text-slate-500'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="comp.leader ? 'bg-blue-600' : 'bg-slate-300'"></span>
                  {{ comp.name }}
                  <span v-if="comp.leader" class="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-black text-blue-700">{{ 'ÖNDE' }}</span>
                </div>
                <span class="font-mono font-bold text-xs" :class="comp.leader ? 'text-slate-800' : 'text-slate-500'">
                  {{ currencySymbol }}{{ comp.price.toLocaleString('tr-TR') }}
                </span>
              </div>
            </div>

            <!-- Bottom Tabs Inside Card -->
            <div class="grid grid-cols-4 gap-1 mt-6 border-t border-slate-100 pt-4 text-center">
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ 'TALEP' }}</span>
              <span class="text-[8px] font-black text-blue-600 py-1 border-b-2 border-blue-600">+ {{ 'TEKLİF' }}</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ 'KARAR' }}</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ 'TESLİMAT' }}</span>
            </div>

            <div class="mt-4 text-center text-[9px] italic text-slate-400">
              {{ 'Temsili veridir - Gerçek teklif değildir' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Strip -->
      <div class="relative border-t border-slate-200/80 bg-white/60 py-6 backdrop-blur-md">
        <div class="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          <div v-for="(item, idx) in localizedTrustStrip" :key="idx" class="flex items-center gap-3">
            <ShieldCheck v-if="idx === 0" class="text-blue-600 shrink-0" :size="22" />
            <LockKeyhole v-else-if="idx === 1" class="text-blue-600 shrink-0" :size="22" />
            <Scale v-else-if="idx === 2" class="text-blue-600 shrink-0" :size="22" />
            <Globe2 v-else class="text-blue-600 shrink-0" :size="22" />
            <div>
              <div class="text-xs font-black text-slate-800">{{ item.title }}</div>
              <div class="text-[10px] text-slate-500">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- KRİPTOGRAFİK ZAMAN DAMGASI & GÜVENLİK (AUDIT TRAIL TIMELINE) -->
    <section class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-16">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ 'ŞEFFAFLIK & GÜVENLİK' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ 'Kriptografik ve Damgalı İşlem Takibi' }}</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ 'Satın alma süreçleriniz, KVKK ve Türk Ticaret Kanunu uyumlu, TLS 1.2+ şifreli ve zaman damgalı değişmez bir log günlüğünde saklanır.' }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 relative text-left">
          <!-- Connector line for desktop -->
          <div class="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0"></div>

          <!-- Step 1 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">1</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ 'Şartname Damgalama' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ 'Yayınladığınız şartname dosyalarının kriptografik hash kodları çıkarılarak sisteme damgalanır.' }}
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">2</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ 'TLS 1.2+ Şifreli Teklifler' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ 'Tedarikçilerin gönderdiği fiyat ve belgeler SSL/TLS katmanında şifrelenir.' }}
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">3</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ 'Canlı Eksiltme Günlüğü' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ 'Ters ihale arenalarındaki her fiyat düşüşü, zaman damgasıyla denetim izine yazılır.' }}
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">4</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ 'KVKK Uyumlu Arşivleme' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ 'Sonuçlanan ihaleler yasal saklama sürelerine uygun olarak güvenli sunucularda saklanır.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ERP & SİSTEM ENTEGRASYONLARI -->
    <section class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ 'ERP BAĞLANTILARI' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ 'Kurumsal Sistemlerinizle Tam Entegrasyon' }}</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ 'Satın alma, teklif, sipariş ve tedarikçi verilerinizi mevcut ERP, CRM ve finans sistemlerinize kontrollü API entegrasyonu ile bağlayın.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <!-- ERP Card 1: SAP -->
          <NuxtLink 
            to="/entegrasyonlar?tab=sap" 
            class="group p-6 bg-white border border-slate-200/80 hover:border-blue-500 premium-shadow hover:shadow-xl rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-200"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{{ 'SAP Entegrasyonu' }}</div>
                <ArrowRight :size="14" class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ 'Satın alma taleplerinizi (Purchase Requisitions) SAP üzerinden otomatik çekin; ihale sonuçlarını SAP sipariş fişi (Purchase Order) olarak geri aktarın.' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">ERP CONNECTED</span>
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">İncele →</span>
            </div>
          </NuxtLink>

          <!-- ERP Card 2: Logo -->
          <NuxtLink 
            to="/entegrasyonlar?tab=logo" 
            class="group p-6 bg-white border border-slate-200/80 hover:border-blue-500 premium-shadow hover:shadow-xl rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-200"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{{ 'Logo & Netsis Entegrasyonu' }}</div>
                <ArrowRight :size="14" class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ 'Logo Tiger, Go3 veya Netsis sistemlerinizdeki malzeme kartlarını, birimlerini ve tedarikçi cari hesaplarını anlık olarak platformla senkronize edin.' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">API READY</span>
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">İncele →</span>
            </div>
          </NuxtLink>

          <!-- ERP Card 3: MS Dynamics -->
          <NuxtLink 
            to="/entegrasyonlar?tab=dynamics" 
            class="group p-6 bg-white border border-slate-200/80 hover:border-blue-500 premium-shadow hover:shadow-xl rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-200"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">Microsoft Dynamics 365</div>
                <ArrowRight :size="14" class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ 'Dynamics 365 Supply Chain Management modülüyle iki yönlü canlı veri eşleştirmesi sağlayarak teklif toplama süreçlerinizi hızlandırın.' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">AUTOMATED SYNC</span>
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">İncele →</span>
            </div>
          </NuxtLink>

          <!-- ERP Card 4: Excel & REST API -->
          <NuxtLink 
            to="/entegrasyonlar?tab=api" 
            class="group p-6 bg-white border border-slate-200/80 hover:border-blue-500 premium-shadow hover:shadow-xl rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-200"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{{ 'REST API & Excel Entegrasyonu' }}</div>
                <ArrowRight :size="14" class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ 'Özel şirket içi yazılımlarınız için RESTful API uç noktaları. Veya tek tıkla gelişmiş Excel tablosu yükleme ve karşılaştırma aracı.' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">RESTFUL API / XLS</span>
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">İncele →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- NASIL ÇALIŞIR SECTION -->
    <section id="nasil-calisir" class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6 text-center">
        <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ 'SÜREÇ REHBERİ' }}</span>
        <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ 'Platform Nasıl Çalışıyor?' }}</h2>
        <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ 'Alıcı veya tedarikçi rolünüze uygun adımları takip ederek süreci başlatın.' }}</p>

        <!-- Tab switcher -->
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-full border border-slate-200 bg-white p-1">
            <button @click="activeAudience = 'buyer'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'buyer' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              {{ 'Alıcı Şirketler İçin' }}
            </button>
            <button @click="activeAudience = 'supplier'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'supplier' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              {{ 'Tedarikçi Firmalar İçin' }}
            </button>
          </div>
        </div>

        <!-- Steps Grid -->
        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
          <div v-for="step in activeSteps" :key="step.number" class="p-6 rounded-2xl bg-white border premium-shadow flex flex-col gap-4">
            <div class="text-3xl font-serif font-black text-blue-600/30">{{ step.number }}</div>
            <h3 class="text-base font-black text-slate-900">{{ step.title }}</h3>
            <p class="text-xs leading-relaxed text-slate-500 font-medium">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 🟢 KURUMSAL ABONELİK VE LİSANS PLANLARI -->
    <section id="fiyatlandirma" class="border-b border-slate-200 bg-slate-50/70 py-20">
      <div class="mx-auto max-w-7xl px-6 text-center space-y-12">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052FF] text-[10px] font-black uppercase tracking-wider">
            <span>⚡ KURUMSAL ABONELİK VE LİSANS PLANLARI</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            İhtiyacınıza Uygun Esnek Ödeme Planı Seçin
          </h2>
          <p class="max-w-2xl mx-auto text-xs sm:text-sm text-slate-500 font-medium">
            Yurt içi (₺ TRY) veya yurt dışı ($ USD / € EUR) ödeme seçeneklerimizden firmanıza en uygun paketi tercih edin. Şeffaf fiyatlandırma, 0 komisyon.
          </p>
        </div>

        <!-- Region Selector Switcher -->
        <div class="flex justify-center">
          <div class="inline-flex rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xs">
            <button
              type="button"
              @click="homePricingRegion = 'domestic'"
              class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer"
              :class="homePricingRegion === 'domestic' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              <span class="rounded bg-white/20 px-1 text-[10px]">TR</span>
              <span>Yurt İçi Ödeme (Türkiye / ₺ TRY)</span>
            </button>
            <button
              type="button"
              @click="homePricingRegion = 'international'"
              class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer"
              :class="homePricingRegion === 'international' ? 'bg-[#0052FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              <Globe :size="14" />
              <span>Yurt Dışı Ödeme (Global / $ USD - € EUR)</span>
            </button>
          </div>
        </div>

        <!-- Domestic Packages (TRY ₺) -->
        <div v-if="homePricingRegion === 'domestic'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left items-stretch">
          <div
            v-for="pkg in homePricingDomestic"
            :key="pkg.id"
            class="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden"
            :class="pkg.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'"
          >
            <!-- Badge banner -->
            <div
              class="text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-center mb-4"
              :class="pkg.isPopular ? 'bg-amber-400 text-slate-950 font-black' : 'bg-[#0F223D] text-white'"
            >
              {{ pkg.badge }}
            </div>

            <div class="space-y-4">
              <h3 class="text-xs font-black text-slate-800 tracking-wider text-center uppercase">{{ pkg.name }}</h3>
              
              <div class="text-center py-3 border-y border-slate-100">
                <div class="text-4xl font-black text-slate-900 font-mono tracking-tight">₺{{ pkg.price.toLocaleString('tr-TR') }}</div>
                <div class="text-xs font-bold text-slate-400 mt-1">{{ pkg.monthly }}</div>
              </div>

              <p class="text-[11px] text-slate-500 leading-relaxed text-center min-h-[36px]">
                {{ pkg.desc }}
              </p>
            </div>

            <div class="pt-6">
              <NuxtLink
                :to="`/abonelik?plan=${pkg.id}`"
                class="w-full py-3.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                :class="pkg.isPopular ? 'bg-amber-400 hover:bg-amber-500 text-slate-950' : 'bg-[#0F223D] hover:bg-[#0052FF] text-white'"
              >
                <span>HEMEN ABONE OL</span>
                <ArrowRight :size="14" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- International Packages (Global USD / EUR) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left items-stretch">
          <div
            v-for="pkg in homePricingGlobalUSD"
            :key="pkg.id"
            class="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden"
            :class="pkg.isPopular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80'"
          >
            <div
              class="text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-center mb-4"
              :class="pkg.isPopular ? 'bg-[#0052FF] text-white' : 'bg-slate-800 text-white'"
            >
              {{ pkg.badge }}
            </div>

            <div class="space-y-4">
              <h3 class="text-xs font-black text-slate-800 tracking-wider text-center uppercase">{{ pkg.name }}</h3>
              
              <div class="text-center py-3 border-y border-slate-100">
                <div class="text-4xl font-black text-slate-900 font-mono tracking-tight">${{ pkg.price }}</div>
                <div class="text-xs font-bold text-slate-400 mt-1">{{ pkg.monthly }}</div>
              </div>

              <p class="text-[11px] text-slate-500 leading-relaxed text-center min-h-[36px]">
                {{ pkg.desc }}
              </p>
            </div>

            <div class="pt-6">
              <NuxtLink
                :to="`/abonelik?region=international&plan=${pkg.id}`"
                class="w-full py-3.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer bg-[#0052FF] hover:bg-blue-700 text-white"
              >
                <span>SUBSCRIBE NOW</span>
                <ArrowRight :size="14" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Trust footer under pricing -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 font-medium">
          <div class="flex items-center gap-2">
            <CheckCircle2 :size="16" class="text-emerald-600" />
            <span>Tüm fiyatlara %20 KDV dahildir. E-Fatura 24 saat içinde iletilir.</span>
          </div>
          <div class="flex items-center gap-4 text-[11px] font-bold text-slate-400">
            <span>🔒 256-BIT TLS SSL</span>
            <span>⚡ ANINDA AKTİVASYON</span>
          </div>
        </div>

        <!-- Standart Özellikler Grid -->
        <div class="rounded-3xl border border-slate-200/90 bg-white p-8 text-left space-y-6 shadow-xs">
          <div>
            <h3 class="text-base font-black text-slate-900">Tüm Paketlerde Dahil Olan Standart Özellikler</h3>
            <p class="text-xs text-slate-400 mt-0.5">Herhangi bir gizli ücret veya ek komisyon bulunmamaktadır.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider">1. İHALE VE TEKLİF YÖNETİMİ</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız B2B İhale Açma</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Canlı Tersine Eksiltme Katılımı</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Doğrudan Temin & Teklif Toplama</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Satış ve Kiralama Duyuruları</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Fiyat Pazarlığı & Karşı Teklif Modülü</li>
              </ul>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider">2. BİLDİRİM VE TAKİP SİSTEMİ</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Akıllı Sektörel Arama Önerileri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Yaklaşan İhale Anlık Bildirimleri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sonuçlanan İhale & Teklif Uyarıları</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız Bildirim (SMS + E-Posta)</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız Excel Rapor İndirme</li>
              </ul>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider">3. ANALİTİK VE MOBİL UYUM</h4>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Yüklenici & Tedarikçi Firma Analizleri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> İdare ve Kurumsal Satın Alma Analizleri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sektörel Fiyat ve Pazar Eğilimleri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Rakip Firma Teklif Dağılım Grafikleri</li>
                <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Mobil Uyumlu Web & Panel Arayüzü</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section id="sss" class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-4xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ 'SIKÇA SORULANLAR' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ 'Merak Edilen Konular' }}</h2>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, idx) in localizedFaqs" :key="idx" class="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
            <button @click="openFaq = openFaq === idx ? null : idx" class="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-xs sm:text-sm">
              <span>{{ faq.question }}</span>
              <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': openFaq === idx }" />
            </button>
            <div v-show="openFaq === idx" class="p-5 border-t border-slate-200 bg-white text-xs leading-relaxed text-slate-600">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- E-E-A-T EDITORIAL & EXPERT VALIDATION SECTION -->
    <section class="border-b border-slate-200 bg-slate-50 py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="bg-white border border-slate-200 rounded-3xl p-8 premium-shadow text-left md:flex md:items-center md:justify-between gap-8">
          <div class="space-y-3 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
              <BadgeCheck :size="12" /> E-E-A-T {{ 'DOĞRULANMIŞ PLATFORM' }}
            </span>
            <h2 class="text-xl font-black text-slate-900 tracking-tight md:text-2xl">
              {{ 'Editöryal Standartlar ve Güvenli Tedarik Güvencesi' }}
            </h2>
            <p class="text-xs text-slate-500 font-medium leading-relaxed font-sans">
              {{ 'Platformumuzdaki canlı eksiltme kuralları, B2B tasarruf verileri ve sözleşme şablonları, satın alma profesyonelleri ve hukuk müşavirleri tarafından denetlenerek onaylanmaktadır.' }}
            </p>
          </div>
          
          <div class="mt-6 md:mt-0 flex items-center gap-3 shrink-0">
            <div class="flex -space-x-3 overflow-hidden">
              <div class="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">AT</div>
              <div class="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">SK</div>
              <div class="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">ZD</div>
            </div>
            <div class="text-left">
              <div class="text-[10px] font-black text-slate-800 uppercase tracking-wide">
                {{ 'Uzman Kurulu Tarafından Onaylandı' }}
              </div>
              <div class="text-[9px] text-slate-400 font-bold mt-0.5">
                {{ 'Son İnceleme: Temmuz 2026' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REGISTER CALL TO ACTION SECTION -->
    <section class="py-16 bg-[#001D36] text-white relative overflow-hidden">
      <!-- Glow background -->
      <div class="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl z-10"></div>
      <div class="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl z-10"></div>
      
      <div class="relative z-20 mx-auto max-w-5xl px-6 text-center space-y-6">
        <span class="bg-[#1EAE4C]/10 border border-[#1EAE4C]/20 text-[#1EAE4C] text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider inline-block animate-pulse">
          ⚡ {{ 'ÜCRETSİZ LANSMAN DÖNEMİ' }}
        </span>
        <h2 class="text-3xl font-black tracking-tight sm:text-4xl">
          {{ 'Tedarik Süreçlerinizi Bugün Dijitalleştirin' }}
        </h2>
        <p class="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {{ 'Ters ihale arenamıza katılın, malzeme ve lojistik maliyetlerinizi canlı eksiltme ile düşürün. Satın alma taleplerinizi tek merkezden yönetmeye hemen başlayın.' }}
        </p>
        <div class="pt-4 flex flex-wrap justify-center gap-4">
          <NuxtLink 
            to="/uyelik" 
            class="flex items-center gap-2 rounded-xl px-8 py-4 text-xs font-black text-white bg-[#1EAE4C] shadow-lg shadow-[#1EAE4C]/20 hover:bg-[#158f3d] transition-all"
          >
            {{ 'Hemen Ücretsiz Katılın' }}
            <ArrowRight :size="15" />
          </NuxtLink>
          <a 
            href="#sss" 
            class="flex items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-xs font-black text-white hover:bg-slate-800 transition-all"
          >
            {{ 'Sıkça Sorulan Sorular' }}
          </a>
        </div>
      </div>
    </section>

    <!-- BİZİMLE İLETİŞİME GEÇİN SECTION -->
    <section class="border-b border-slate-200 bg-slate-50 py-20 relative overflow-hidden">
      <!-- Background subtle graphics -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, #1eae4c 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <div class="mx-auto max-w-7xl px-6 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Content -->
          <div class="lg:col-span-6 text-left space-y-8">
            <div class="space-y-4">
              <span class="text-[10px] font-black uppercase tracking-widest" style="color: #1EAE4C;">{{ 'BİZİMLE İLETİŞİME GEÇİN' }}</span>
              <h2 class="text-3xl font-black text-slate-900 tracking-tight md:text-5xl leading-tight">
                {{ 'Satın alma süreçlerinizi' }} <br class="hidden sm:inline" />
                <span class="italic" style="color: #1EAE4C;">{{ 'tek panelde toplayın.' }}</span>
              </h2>
              <p class="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium max-w-md">
                {{ 'Ekibimiz satın alma süreçlerinizde size yardımcı olmaya hazır. İletişim bilgilerinizi bırakın, en kısa sürede dönüş yapalım.' }}
              </p>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ 'Hızlı kurumsal kurulum' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ 'KVKK kapsamında altyapı' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ 'Hızlı onboarding' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ 'Yerli destek ekibi' }}</span>
              </div>
            </div>
          </div>

          <!-- Right Form Card -->
          <div class="lg:col-span-6">
            <div class="bg-white border rounded-3xl p-8 premium-shadow space-y-6 text-left min-h-[360px] flex flex-col justify-center">
              
              <!-- Success State (Premium feedback card) -->
              <div v-if="contactSuccess" class="py-6 text-center space-y-5">
                <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 animate-bounce">
                  <CheckCircle2 :size="28" />
                </div>
                <div class="space-y-2">
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">{{ 'TALEBİNİZ ALINDI!' }}</h3>
                  <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                    {{ 'Mesajınız başarıyla iletildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.' }}
                  </p>
                </div>
                <button 
                  type="button" 
                  @click="contactSuccess = false" 
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  {{ 'Yeni Mesaj Gönder' }}
                </button>
              </div>

              <!-- Form State -->
              <div v-else class="space-y-6">
                <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{{ 'SİZİNLE İLETİŞİME GEÇELİM' }}</span>
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">{{ 'BİZE NASIL ULAŞALIM?' }}</h3>
                </div>

                <!-- Contact Method Toggle Tabs -->
                <div class="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border">
                  <button
                    type="button"
                    @click="contactMethod = 'email'"
                    class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                    :class="contactMethod === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                  >
                    {{ 'E-posta' }}
                  </button>
                  <button
                    type="button"
                    @click="contactMethod = 'phone'"
                    class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                    :class="contactMethod === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                  >
                    {{ 'Telefon' }}
                  </button>
                </div>

                <!-- Inputs -->
                <div class="space-y-4">
                  <!-- E-posta field -->
                  <div v-if="contactMethod === 'email'">
                    <label for="contactEmailInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ 'E-posta Adresiniz' }}</label>
                    <input
                      v-model="contactEmail"
                      type="email"
                      id="contactEmailInput"
                      :placeholder="'ornek@sirket.com.tr'"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <!-- Telefon field -->
                  <div v-else>
                    <label for="contactPhoneInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ 'Telefon Numaranız' }}</label>
                    <input
                      v-model="contactPhone"
                      type="tel"
                      id="contactPhoneInput"
                      placeholder="+1 (555) 000-0000"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <!-- Message field -->
                  <div>
                    <label for="contactMessageInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ 'Size nasıl yardımcı olabiliriz?' }}</label>
                    <textarea
                      v-model="contactMessage"
                      rows="3"
                      id="contactMessageInput"
                      :placeholder="'Taleplerinizi belirtin...'"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- Error Display (Premium Alert Box) -->
                <div v-if="contactError" class="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-2">
                  <AlertCircle :size="14" class="text-rose-600 shrink-0" />
                  <span>{{ contactError }}</span>
                </div>

                <!-- Submit button -->
                <button
                  type="button"
                  @click="submitContactForm"
                  :disabled="contactSubmitted"
                  class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 disabled:opacity-60"
                >
                  <span v-if="contactSubmitted">{{ 'Gönderiliyor...' }}</span>
                  <span v-else class="flex items-center gap-1">{{ 'Gönder' }} <ArrowRight :size="14" /></span>
                </button>

                <!-- Footer Sublinks -->
                <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 pt-2">
                  <a href="#nasil-calisir" class="hover:text-blue-600 transition-colors">{{ 'Önce nasıl çalıştığını inceleyin →' }}</a>
                  <NuxtLink to="/uyelik" class="hover:text-blue-600 transition-colors">{{ 'Kurumsal hesap aç →' }}</NuxtLink>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- FİRMA DETAY VE YORUM MODALI (Corporate User Profile & Rating Modal) -->
    <div v-if="showCompanyModal && selectedCompany" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl border border-amber-200/80 max-w-2xl w-full shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
        <!-- Gold/Navy Hero Header Card -->
        <div class="p-6 rounded-t-3xl text-white relative overflow-hidden" style="background: linear-gradient(135deg, #0A1128 0%, #1C2541 100%); border-bottom: 2px solid #C59B27;">
          <div class="absolute right-3 top-3">
            <button @click="showCompanyModal = false" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
              <X :size="18" />
            </button>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <!-- Firma Logosu / Monogram Avatar -->
            <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shrink-0 overflow-hidden">
              <img 
                v-if="selectedCompany.logo" 
                :src="selectedCompany.logo" 
                :alt="selectedCompany.name + ' Logosu'" 
                class="w-full h-full object-cover bg-white rounded-[14px]" 
              />
              <div v-else class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-2xl font-mono">
                {{ selectedCompany.name.charAt(0) }}
              </div>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-lg font-black text-white tracking-tight truncate">{{ selectedCompany.name }}</h3>
                <span v-if="selectedCompany.verified" class="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck :size="11" class="text-amber-400" />
                  ✓ {{ 'e-Devlet & MERSİS ONAYLI' }}
                </span>
              </div>
              <p class="text-xs text-slate-300 font-medium flex items-center gap-2">
                <Building2 :size="13" class="text-amber-400 shrink-0" />
                <span>{{ selectedCompany.sector }}</span>
                <span>•</span>
                <MapPin :size="13" class="text-amber-400 shrink-0" />
                <span>{{ selectedCompany.address ? selectedCompany.address.split(',')[0] : 'Türkiye' }}</span>
              </p>
            </div>
          </div>

          <!-- Rating & Score Bar inside Modal Header -->
          <div class="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ 'Genel Puan' }}</div>
              <div class="text-lg font-black text-white font-mono flex items-center justify-center gap-1 mt-0.5">
                <Star :size="14" class="text-amber-400 fill-amber-400" />
                <span>{{ selectedCompany.rating || '4.9' }}</span>
                <span class="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ 'Teslimat Hızı' }}</div>
              <div class="text-lg font-black text-emerald-400 font-mono mt-0.5">%98</div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ 'Şartname Uyum' }}</div>
              <div class="text-lg font-black text-blue-400 font-mono mt-0.5">%100</div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ 'İhale Hacmi' }}</div>
              <div class="text-lg font-black text-amber-400 font-mono mt-0.5">42+ İhale</div>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-6 pt-0">
          <!-- Details Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building :size="14" class="text-amber-600" />
                {{ 'İLETİŞİM BİLGİLERİ' }}
              </h4>
              <div class="text-xs text-slate-600 space-y-2 font-medium">
                <div><strong class="text-slate-400">{{ 'Telefon:' }}</strong> {{ selectedCompany.phone }}</div>
                <div><strong class="text-slate-400">{{ 'E-Posta:' }}</strong> {{ selectedCompany.email }}</div>
                <div><strong class="text-slate-400">{{ 'Adres:' }}</strong> {{ selectedCompany.address }}</div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck :size="14" class="text-amber-600" />
                {{ 'RESMİ BİLGİLER & DOĞRULAMA' }}
              </h4>
              <div class="text-xs text-slate-600 space-y-2 font-medium">
                <div><strong class="text-slate-400">{{ 'KEP Adresi:' }}</strong> {{ selectedCompany.kep }}</div>
                <div><strong class="text-slate-400">{{ 'MERSİS / VKN No:' }}</strong> {{ selectedCompany.mersis }}</div>
                <div class="flex items-center gap-1 pt-1">
                  <strong class="text-slate-400">{{ 'Doğrulama:' }}</strong>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                    ✓ {{ 'TİCARET SİCİL ONAYLI' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments & Reviews Breakdown -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Star :size="14" class="text-amber-500 fill-amber-500" />
                {{ 'ALDIĞI PUANLAR VE MÜŞTERİ DEĞERLENDİRMELERİ' }} ({{ selectedCompany.reviews ? selectedCompany.reviews.length : 0 }})
              </h4>
              <span class="text-xs font-bold text-amber-600 font-mono">{{ selectedCompany.rating }} / 5.0 (⭐⭐⭐⭐⭐)</span>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="(review, rIdx) in selectedCompany.reviews" 
                :key="rIdx"
                class="rounded-2xl border p-4 bg-slate-50/70 space-y-2 hover:border-amber-300 transition-colors"
                style="border-color: #E2E8F0;"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold text-slate-800 block">{{ review.author }}</span>
                    <span class="text-[10px] text-slate-500 font-semibold block">{{ review.company }}</span>
                  </div>
                  <div class="text-right">
                    <div class="flex text-amber-400 justify-end">
                      <Star v-for="i in 5" :key="i" :size="11" :fill="i <= review.rating ? 'currentColor' : 'none'" />
                    </div>
                    <span class="text-[9px] text-slate-400 font-mono block mt-0.5">{{ review.date }}</span>
                  </div>
                </div>
                <p class="text-xs leading-relaxed text-slate-600 font-medium">
                  "{{ review.comment }}"
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end pt-3 border-t" style="border-color: #F1F5F9;">
            <button @click="showCompanyModal = false" class="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 transition shadow-lg border border-slate-700">
              {{ 'Kapat' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ⚡ ULTRA-EASY 1-CLICK QUICK BID MODAL -->
    <div v-if="showQuickBidModal && quickBidTender" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left space-y-0">
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/30">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
              ⚡
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-400 uppercase tracking-widest block">1-TIK İLE ANINDA TEKLİF</span>
              <h3 class="text-sm font-black tracking-tight text-white line-clamp-1">{{ quickBidTender.title }}</h3>
            </div>
          </div>
          <button @click="showQuickBidModal = false" class="text-slate-400 hover:text-white transition p-1">
            <X :size="20" />
          </button>
        </div>

        <!-- Body Form -->
        <form @submit.prevent="submitQuickBid" class="p-6 space-y-4">
          <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 font-medium space-y-1">
            <div class="flex justify-between items-center text-slate-900 font-bold">
              <span>🏢 Alıcı Firma: {{ quickBidTender.company }}</span>
              <span class="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-black">📍 {{ quickBidTender.city }}</span>
            </div>
            <div class="text-[11px] text-slate-500">İhale No: 2026/{{ 100000 + quickBidTender.id }} • {{ quickBidTender.type }}</div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">TEKLİF TUTARINIZ (₺) *</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-amber-600 text-sm">₺</span>
              <input 
                v-model="quickBidPrice" 
                type="text" 
                required 
                aria-label="Teklif tutarınız"
                placeholder="Örn: 45.000" 
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs min-h-[44px]" 
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">TESLİMAT SÜRESİ (GÜN) *</label>
              <input 
                v-model="quickBidDeliveryDays" 
                type="number" 
                required 
                aria-label="Teslimat süresi gün sayısı"
                placeholder="7" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all min-h-[44px]" 
              />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">GARANTİ / UYUM</label>
              <div class="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-800 flex items-center justify-center">
                ✓ Şartnameye Tam Uyum
              </div>
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">TEKLİF NOTUNUZ (OPSİYONEL)</label>
            <textarea 
              v-model="quickBidNotes" 
              rows="2" 
              placeholder="Örn: Yerli üretim belgemiz mevcuttur, stoktan hemen kargolanır." 
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          <div class="pt-2 flex gap-3">
            <button type="button" @click="showQuickBidModal = false" class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition">
              İptal
            </button>
            <button 
              type="submit" 
              :disabled="isSubmittingQuickBid" 
              class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-300 disabled:opacity-60"
            >
              <Zap :size="16" class="fill-slate-950 text-slate-950" />
              <span>{{ isSubmittingQuickBid ? 'İletiliyor...' : '🚀 TEKLİFİ ANINDA GÖNDER' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 🟢 1. HIZLI TEKLİF VER: KAYIT OLMA / GİRİŞ YAPMA ZORUNLULUĞU MODALI -->
    <div v-if="showAuthRequiredModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5 text-[#0052FF]">
            <div class="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <LockKeyhole :size="20" class="text-[#0052FF]" />
            </div>
            <div>
              <span class="text-[9px] font-black text-[#FF5938] uppercase tracking-wider block">GÜVENLİ TEKLİF DOĞRULAMASI</span>
              <h3 class="text-sm font-black text-slate-900">Kurumsal Üyelik Zorunluluğu</h3>
            </div>
          </div>
          <button @click="showAuthRequiredModal = false" class="text-slate-400 hover:text-slate-700 transition">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div v-if="quickBidTender" class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span class="text-slate-400 font-bold block text-[10px]">SEÇİLEN İHALE:</span>
            <span class="font-black text-slate-800 line-clamp-1">{{ quickBidTender.title }}</span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            İhaleciBurada platformunda ihalelere teklif sunabilmek, fiyat kırabilmek ve doğrudan pazarlık yapabilmek için <strong>kurumsal üye girişi yapmanız veya ücretsiz kayıt olmanız gerekmektedir</strong>.
          </p>

          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <div class="font-black flex items-center gap-1.5">
              <span>✓ %100 Ücretsiz Tedarikçi Kaydı</span>
            </div>
            <p class="text-[11px] text-emerald-800/80">Kayıt işleminiz 1 dakikada tamamlanır, anında teklif vermeye başlayabilirsiniz.</p>
          </div>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row gap-2.5">
          <NuxtLink
            to="/uyelik"
            class="flex-1 py-3 rounded-xl bg-[#0052FF] hover:bg-blue-700 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <span>Giriş Yap</span>
            <ArrowRight :size="14" />
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0F223D] to-[#0052FF] text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md border border-blue-400"
          >
            <span>Ücretsiz Kayıt Ol</span>
            <Sparkles :size="14" class="text-[#00C2FF]" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 🟢 2. FİYAT PAZARLIĞI VE KARŞI TEKLİF MODALI -->
    <div v-if="showNegotiationModal && selectedBidForNegotiation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-600 uppercase tracking-wider block">B2B FİYAT PAZARLIĞI</span>
              <h3 class="text-sm font-black text-slate-900">Tedarikçi ile Pazarlık & Karşı Teklif</h3>
            </div>
          </div>
          <button @click="showNegotiationModal = false" class="text-slate-400 hover:text-slate-700 transition">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Tedarikçi Firma:</span>
              <span class="font-black text-slate-800">{{ selectedBidForNegotiation.bidderFirm }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Mevcut Teklif Tutarı:</span>
              <span class="font-black text-emerald-600 font-mono text-sm">{{ selectedBidForNegotiation.bidAmount.toLocaleString('tr-TR') }} ₺</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-slate-400">İhale:</span>
              <span class="text-slate-700 font-bold line-clamp-1">{{ selectedBidForNegotiation.tenderTitle }}</span>
            </div>
          </div>

          <!-- Hedef Pazarlık Fiyatı -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              HEDEF PAZARLIK / KARŞI TEKLİF TUTARI (₺) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-amber-600 text-sm">₺</span>
              <input
                v-model="counterOfferPrice"
                type="number"
                placeholder="Örn: 4.900.000"
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
              />
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">Tedarikçiye kabul etmesi için ileteceğiniz revize fiyat teklifi.</span>
          </div>

          <!-- Pazarlık Notu / Şartları -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              PAZARLIK ŞARTLARI VE NOTUNUZ *
            </label>
            <textarea
              v-model="counterOfferNotes"
              rows="3"
              placeholder="Örn: Belirtilen fiyata inilmesi ve peşin ödeme şartıyla ihaleyi hemen onaylamaya hazırız."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            @click="showNegotiationModal = false"
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="submitCounterOffer"
            class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <span>💬 Karşı Teklifi İlet</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 🟢 İHALE DOSYALARI & ŞARTNAME GÖRÜNTÜLEME / İNDİRME MODALI -->
    <div v-if="showTenderDocsModal && selectedTenderForDocs" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden animate-scale-in">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0052FF] text-[10px] font-black uppercase tracking-wider">
              <span>İHALE NO: 2026/{{ 100000 + selectedTenderForDocs.id }}</span>
            </div>
            <h3 class="text-lg font-black text-slate-900 tracking-tight">
              {{ selectedTenderForDocs.title }}
            </h3>
            <p class="text-xs text-slate-500 font-medium">
              İhale şartnameleri, birim fiyat cetveli ve resmi onay dokümanları
            </p>
          </div>
          <button 
            type="button" 
            @click="showTenderDocsModal = false"
            class="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <!-- Document List -->
        <div class="space-y-3">
          <!-- Doc 1: Teknik Şartname -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-blue-100/70 text-[#0052FF] flex items-center justify-center shrink-0">
                <FileText :size="20" />
              </div>
              <div>
                <div class="text-xs font-black text-slate-800">1. Teknik Şartname & Kalifikasyon Belgesi</div>
                <div class="text-[11px] text-slate-400">Ürün spesifikasyonları, TSE standartları ve kalite şartları (.PDF)</div>
              </div>
            </div>
            <button 
              type="button" 
              @click="downloadDoc('teknik')" 
              class="px-3.5 py-2 rounded-xl bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Download :size="13" />
              <span>İndir</span>
            </button>
          </div>

          <!-- Doc 2: İdari Şartname -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                <FileText :size="20" />
              </div>
              <div>
                <div class="text-xs font-black text-slate-800">2. İdari Şartname & Sözleşme Taslağı</div>
                <div class="text-[11px] text-slate-400">Ödeme vadeleri, teslimat şartları ve teminat hükümleri (.PDF)</div>
              </div>
            </div>
            <button 
              type="button" 
              @click="downloadDoc('idari')" 
              class="px-3.5 py-2 rounded-xl bg-[#0F223D] hover:bg-[#1A3358] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Download :size="13" />
              <span>İndir</span>
            </button>
          </div>

          <!-- Doc 3: Malzeme Cetveli -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText :size="20" />
              </div>
              <div>
                <div class="text-xs font-black text-slate-800">3. Malzeme ve Birim Fiyat Cetveli</div>
                <div class="text-[11px] text-slate-400">Kalem listesi, miktarlar ve birim fiyat teklif formu (.XLSX)</div>
              </div>
            </div>
            <button 
              type="button" 
              @click="downloadDoc('malzeme')" 
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Download :size="13" />
              <span>İndir</span>
            </button>
          </div>

          <!-- Doc 4: Resmi İhale İlanı -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                <Volume2 :size="20" />
              </div>
              <div>
                <div class="text-xs font-black text-slate-800">4. Resmi İhale İlan Metni & İdare Onayı</div>
                <div class="text-[11px] text-slate-400">İhale duyurusu, son başvuru ve teklif verme takvimi (.PDF)</div>
              </div>
            </div>
            <button 
              type="button" 
              @click="downloadDoc('ilan')" 
              class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Download :size="13" />
              <span>İndir</span>
            </button>
          </div>
        </div>

        <!-- Consolidated Download Button & Close -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button 
            type="button" 
            @click="downloadDoc('tum')"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00C2FF] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Download :size="15" />
            <span>📦 Tüm İhale Dosyalarını İndir (Tek Paket)</span>
          </button>

          <button 
            type="button" 
            @click="showTenderDocsModal = false"
            class="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>

    <!-- 📷 İHALE GÖRSELİ TAM EKRAN LIGHTBOX MODALI -->
    <transition name="fade">
      <div v-if="showImageLightboxModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4" @click.self="showImageLightboxModal = false">
        <div class="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
          <!-- Top Bar -->
          <div class="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
            <div class="flex items-center gap-2">
              <Camera :size="16" class="text-amber-400" />
              <span class="text-xs font-black text-slate-200 truncate">{{ lightboxTitle }}</span>
            </div>
            <button @click="showImageLightboxModal = false" class="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer">
              <X :size="18" />
            </button>
          </div>

          <!-- Main Image View -->
          <div class="p-2 sm:p-4 flex items-center justify-center bg-slate-950/50 min-h-[300px] max-h-[75vh]">
            <img :src="lightboxImageUrl" :alt="lightboxTitle" class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg" />
          </div>

          <!-- Footer Bar -->
          <div class="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span class="text-[11px]">HD Orijinal İhale & Numune Fotoğrafı</span>
            <button @click="showImageLightboxModal = false" class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer">
              Kapat
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- COOKIES CONSENT BANNER -->
    <transition name="fade">
      <div v-if="showCookieConsent" class="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl text-left flex flex-col gap-3">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Cookie :size="16" class="text-blue-600" />
          {{ 'Çerez Onayı & KVKK' }}
        </h4>
        <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
          {{ 'Platform kullanım deneyiminizi optimize etmek ve güvenli bir B2B ihale süreci sağlamak adına çerezleri kullanıyoruz.' }}
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="acceptCookieConsent" class="rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-black text-white hover:bg-blue-700 transition-colors">
            {{ 'Kabul Et' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>