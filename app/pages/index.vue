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
  Info
} from 'lucide-vue-next'

// Nuxt Layout Meta
definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'GelAnlaşalım - B2B Reverse Auction & Procurement Platform',
  ogTitle: 'GelAnlaşalım - B2B Reverse Auction & Procurement Platform',
  description: 'Lower your procurement costs with live reverse auctions. Gather instant documented bids from verified corporate suppliers.',
  ogDescription: 'Lower your procurement costs with live reverse auctions. Gather instant documented bids from verified corporate suppliers.',
  ogImage: 'https://gelanlasalim-v2.vercel.app/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'GelAnlaşalım - B2B Live Auction & Supplier Platform',
  twitterDescription: 'Reduce procurement costs by up to 14%. Transparent and encrypted B2B reverse auctions live in minutes.',
  twitterImage: 'https://gelanlasalim-v2.vercel.app/logo.png'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' },
    { rel: 'canonical', href: 'https://gelanlasalim-v2.vercel.app' }
  ],
  meta: [
    { name: 'keywords', content: 'b2b auction, reverse auction, corporate procurement, supplier management, live bidding, rfq' },
    { name: 'author', content: 'GelAnlaşalım Inc.' },
    { name: 'robots', content: 'index, follow' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'GelAnlaşalım',
        'url': 'https://gelanlasalim-v2.vercel.app',
        'description': 'B2B Reverse Auction & Corporate Procurement Platform',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://gelanlasalim-v2.vercel.app/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'GelAnlaşalım Inc.',
        'url': 'https://gelanlasalim-v2.vercel.app',
        'logo': 'https://gelanlasalim-v2.vercel.app/logo.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+90-555-555-55-55',
          'contactType': 'customer service',
          'email': 'info@gelanlasalim.com',
          'availableLanguage': 'English'
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
            'name': 'How does the reverse auction system work?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The buyer opens a tender specifying quantities and technical specs. Verified suppliers compete in real time by lowering their bids before the clock expires.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How are companies verified on the platform?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Tax registration, signature circulars, and trade registry documents are verified by our team. Only approved corporate accounts can open tenders and place bids.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Are payment and delivery processes secure?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes. The buyer deposits funds into a secure account. Payment is released to the supplier only after inspection and approval.'
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

onMounted(() => {
  detectLocale()
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

const currencySymbol = computed(() => locale.value === 'en' ? '$' : '₺')

const localizedHero = computed(() => {
  if (locale.value === 'en') {
    return {
      tagline: t('hero_tagline'),
      titleLine1: 'Start Tenders,',
      titleLine2: 'Get Bids.',
      titleItalic: "Let's Agree.",
      description: t('hero_desc'),
      badgeStrip: [
        'KVKK COMPLIANT',
        'DOCUMENT TRACKING & TIMESTAMP',
        'ENCRYPTED DATA TRANSFER',
        'FREE DURING LAUNCH'
      ]
    }
  } else {
    return cmsData.value.hero
  }
})

const localizedLiveTender = computed(() => {
  if (locale.value === 'en') {
    return {
      title: 'CNC Custom Manufacturing Batch',
      remainingTime: cmsData.value.liveTender.remainingTime,
      bestBid: 12500,
      openingPrice: 13000,
      savingsText: 'SAVINGS 3.8%',
      competitors: [
        { name: 'Supplier #A47', price: 12500, leader: true },
        { name: 'Supplier #D08', price: 12800, leader: false }
      ]
    }
  } else {
    return cmsData.value.liveTender
  }
})

const localizedTrustStrip = computed(() => {
  if (locale.value === 'en') {
    return [
      { title: 'Company Verification', desc: 'Verified and approved B2B supply chain' },
      { title: 'Secure Workflow', desc: 'KVKK compliant, timestamped audit logs' },
      { title: 'Transparent Comparison', desc: 'Technical & administrative specs on one screen' },
      { title: 'Nationwide Service', desc: 'Supply network across all 81 provinces of Turkey' }
    ]
  } else {
    return [
      { title: 'Firma Doğrulama', desc: 'Güvenli ve onaylı ticaret zinciri' },
      { title: 'Güvenli İşlem Akışı', desc: 'KVKK uyumlu, time-stamped kayıt izleri' },
      { title: 'Şeffaf Karşılaştırma', desc: 'Teknik & idari detaylar tek ekranda' },
      { title: '81 İlde Hizmet', desc: 'Tüm Türkiye sınırlarında tedarik ağı' }
    ]
  }
})

const localizedStats = computed(() => {
  if (locale.value === 'en') {
    return [
      { value: '$420K+', label: 'Total Trade Volume' },
      { value: '150+', label: 'Verified B2B Manufacturers' },
      { value: '14.2%', label: 'Average Savings' },
      { value: '$0', label: 'Buyer Membership Commission' }
    ]
  } else {
    return cmsData.value.stats
  }
})

const localizedVideoGuides = computed(() => {
  if (locale.value === 'en') {
    return [
      { title: 'How to Register?', desc: 'Step-by-step membership guide', videoUrl: '' },
      { title: 'How to Launch a Tender?', desc: 'Create your first reverse auction in minutes', videoUrl: '' },
      { title: 'How to Submit a Bid?', desc: 'Supplier bidding process step-by-step', videoUrl: '' },
      { title: 'Control Panel Guide', desc: 'Mastering the administrative dashboard', videoUrl: '' }
    ]
  } else {
    return cmsData.value.videoGuides
  }
})

const localizedFeatures = computed(() => {
  if (locale.value === 'en') {
    return [
      { title: 'Reverse Auction System', desc: 'Live price reductions in real-time instead of sealed bid envelopes.' },
      { title: 'Qualified Supplier Stream', desc: 'Verified business profiles with document checking.' },
      { title: 'Documented Bid Flow', desc: 'Upload specifications, receive structured bids.' },
      { title: 'Detailed Analytics', desc: 'Bid comparison, cost history tracking, and decision exports.' }
    ]
  } else {
    return cmsData.value.features
  }
})

const localizedTrustStandards = computed(() => {
  if (locale.value === 'en') {
    return [
      { title: 'TLS 1.2+', subtitle: 'ENCRYPTED DATA', desc: 'HTTPS/SSL encryption for all data transmissions.' },
      { title: 'KVKK & GDPR', subtitle: 'DATA PROTECTION', desc: 'Strict compliance with data privacy regulations.' },
      { title: 'Audit Trail', subtitle: 'TRANSACTION LOGS', desc: 'Time-stamped logging for every action and bid.' },
      { title: 'TR · EN', subtitle: 'MULTI-LANGUAGE', desc: 'Turkish and English dual interface support.' }
    ]
  } else {
    return cmsData.value.trustStandards
  }
})

const localizedProblems = computed(() => {
  if (locale.value === 'en') {
    return [
      { title: 'Specifications & bids remain scattered.', desc: 'Separate forms sent to suppliers create chaos.' },
      { title: 'Price comparison is manual and error-prone.', desc: 'Lost in endless Excel sheets and email threads.' },
      { title: 'Supplier qualification lacks verification.', desc: 'Contracts made without thorough background checks.' }
    ]
  } else {
    return cmsData.value.problems
  }
})

const localizedFaqs = computed(() => {
  if (locale.value === 'en') {
    return [
      { question: 'How does the reverse auction system work?', answer: 'The buyer opens a tender specifying quantities and technical specs. Verified suppliers compete in real time by lowering their bids before the clock expires.' },
      { question: 'How are companies verified on the platform?', answer: 'Tax registration, signature circulars, and trade registry documents are verified by our team. Only approved corporate accounts can open tenders and place bids.' },
      { question: 'Are payment and delivery processes secure?', answer: 'Yes. The buyer deposits funds into a secure account. Payment is released to the supplier only after inspection and approval.' },
      { question: 'Do buyers pay any commission fee?', answer: 'No. GelAnlaşalım is free for buyers.' },
      { question: 'Which industries can I open tenders in?', answer: 'Agriculture, construction, healthcare, technology, logistics, packaging, and more.' }
    ]
  } else {
    return (cmsData.value?.faqs || []).map(f => ({ question: f?.q || f?.question || '', answer: f?.a || f?.answer || '' }))
  }
})

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

// Firma Profilleri ve Yorumlar Veritabanı (Photo 2 / 4 / 5 Feedbacks)
const companyProfiles: Record<string, {
  name: string
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

function openCompanyModal(companyName: string) {
  const profile = companyProfiles[companyName]
  if (profile) {
    selectedCompany.value = profile
  } else {
    selectedCompany.value = {
      name: companyName,
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
    name: 'İnşaat ve Yapı',
    count: 248,
    children: [
      'Anahtar Teslim İnşaat', 'Konut İnşaatı', 'Ticari Bina İnşaatı', 'Fabrika İnşaatı', 'Yol Yapımı',
      'Köprü Yapımı', 'Altyapı Çalışmaları', 'Kanalizasyon', 'İçme Suyu Hatları', 'Doğalgaz Hatları',
      'Elektrik Altyapısı', 'Çatı İşleri', 'Cephe Kaplama', 'Mantolama', 'Boya Badana',
      'Seramik Döşeme', 'Mermer İşleri', 'Demir-Çelik İşleri', 'Kalıp ve İskele', 'Beton İşleri',
      'Asfalt', 'Parke', 'Peyzaj', 'Yıkım İşleri', 'Restorasyon'
    ]
  },
  {
    name: 'Gayrimenkul',
    count: 122,
    children: [
      'Arsa', 'Tarla', 'Bağ', 'Bahçe', 'Konut', 'Villa', 'Daire', 'Ofis', 'Dükkan', 'Plaza',
      'Fabrika', 'Depo', 'AVM', 'Otel', 'Turistik Tesis', 'Kiralık Gayrimenkul', 'Satılık Gayrimenkul'
    ]
  },
  {
    name: 'Araç ve İş Makineleri',
    count: 271,
    children: [
      'Otomobil', 'Ticari Araç', 'Kamyon', 'Tır', 'Otobüs', 'Minibüs', 'Traktör', 'İş Makinesi',
      'Ekskavatör', 'Loder', 'Greyder', 'Silindir', 'Forklift', 'Vinç', 'Jeneratör', 'Römork',
      'Araç Kiralama', 'İş Makinesi Kiralama'
    ]
  },
  {
    name: 'Sanayi ve Makine',
    count: 323,
    children: [
      'Üretim Makineleri', 'CNC', 'Torna', 'Freze', 'Pres', 'Kompresör', 'Konveyör', 'Paketleme Makinesi',
      'Gıda Makinesi', 'Plastik Makinesi', 'Tekstil Makinesi', 'Ahşap İşleme', 'Kaynak Makinesi',
      'Robotik Sistemler', 'Endüstriyel Otomasyon'
    ]
  },
  {
    name: 'Bilgisayar ve Teknoloji',
    count: 352,
    children: [
      'Masaüstü Bilgisayar', 'Laptop', 'Sunucu', 'Veri Depolama', 'Ağ Sistemleri', 'Firewall',
      'Yazıcı', 'Tarayıcı', 'Yazılım Lisansları', 'ERP', 'CRM', 'Web Yazılımı', 'Mobil Uygulama',
      'Bulut Hizmetleri', 'Siber Güvenlik', 'Yapay Zeka', 'SEO', 'GEO', 'Veri Analizi'
    ]
  },
  {
    name: 'Elektronik',
    count: 122,
    children: [
      'Telefon', 'Tablet', 'Kamera', 'Güvenlik Kamerası', 'Alarm Sistemleri', 'Televizyon',
      'Ses Sistemleri', 'Projektör', 'UPS', 'Elektronik Kartlar', 'Akıllı Ev Sistemleri'
    ]
  },
  {
    name: 'Mobilya ve Ofis',
    count: 208,
    children: [
      'Büro Mobilyası', 'Okul Mobilyası', 'Hastane Mobilyası', 'Otel Mobilyası', 'Raf Sistemleri',
      'Dosyalama Sistemleri', 'Toplantı Masaları', 'Ofis Sandalyeleri', 'Bekleme Koltukları'
    ]
  },
  {
    name: 'Sağlık ve Medikal',
    count: 251,
    children: [
      'Tıbbi Cihazlar', 'Laboratuvar Cihazları', 'Sarf Malzemeleri', 'Hastane Mobilyaları',
      'Ambulans', 'Medikal Gaz Sistemleri', 'Röntgen', 'MR', 'Ultrason', 'Dental Ürünler'
    ]
  },
  {
    name: 'Eğitim',
    count: 76,
    children: [
      'Akıllı Tahta', 'Bilgisayar Laboratuvarı', 'Eğitim Yazılımları', 'Online Eğitim',
      'Eğitim Danışmanlığı', 'Kurs Hizmetleri', 'Kitap', 'Kırtasiye', 'Laboratuvar Malzemeleri'
    ]
  },
  {
    name: 'Gıda ve Catering',
    count: 337,
    children: [
      'Hazır Yemek', 'Catering', 'Personel Yemeği', 'Kumanya', 'Et Ürünleri', 'Süt Ürünleri',
      'Sebze Meyve', 'Unlu Mamuller', 'İçecek', 'Kuru Gıda'
    ]
  },
  {
    name: 'Tekstil ve Giyim',
    count: 273,
    children: [
      'İş Elbiseleri', 'Okul Kıyafetleri', 'Güvenlik Kıyafetleri', 'Promosyon Tekstil',
      'Ayakkabı', 'Bot', 'Eldiven', 'Kişisel Koruyucu Donanım'
    ]
  },
  {
    name: 'Tarım ve Hayvancılık',
    count: 84,
    children: [
      'Gübre', 'Tohum', 'Sulama Sistemleri', 'Tarım Makinaları', 'Traktör', 'Sera', 'Hayvan Yemi',
      'Veteriner Ürünleri', 'Büyükbaş', 'Küçükbaş', 'Kanatlı Hayvan'
    ]
  },
  {
    name: 'Enerji',
    count: 117,
    children: [
      'Güneş Enerjisi', 'Rüzgar Enerjisi', 'Jeneratör', 'Elektrik Malzemeleri', 'Trafo',
      'LED Aydınlatma', 'Enerji Verimliliği', 'Şarj İstasyonları'
    ]
  },
  {
    name: 'Çevre ve Geri Dönüşüm',
    count: 247,
    children: [
      'Atık Yönetimi', 'Geri Dönüşüm', 'Hurda', 'Çevre Danışmanlığı', 'Arıtma Tesisi',
      'Tehlikeli Atık', 'Sıfır Atık', 'Temizlik Araçları'
    ]
  },
  {
    name: 'Lojistik ve Taşımacılık',
    count: 169,
    children: [
      'Karayolu Taşımacılığı', 'Denizyolu', 'Havayolu', 'Demiryolu', 'Depolama', 'Soğuk Zincir',
      'Kargo', 'Kurye', 'Nakliye'
    ]
  },
  {
    name: 'Güvenlik Sistemleri',
    count: 94,
    children: [
      'Kamera Sistemleri', 'Alarm Sistemleri', 'Yangın Alarmı', 'Kartlı Geçiş', 'Turnike',
      'X-Ray', 'Bariyer', 'Bekçi Tur Sistemi'
    ]
  },
  {
    name: 'Temizlik Hizmetleri',
    count: 247,
    children: [
      'Bina Temizliği', 'Hastane Temizliği', 'Okul Temizliği', 'Fabrika Temizliği', 'Cam Temizliği',
      'Halı Yıkama', 'İlaçlama', 'Çöp Toplama'
    ]
  },
  {
    name: 'Turizm ve Konaklama',
    count: 68,
    children: [
      'Otel Hizmeti', 'Konaklama', 'Uçak Bileti', 'Araç Kiralama', 'Organizasyon', 'Rehberlik',
      'Tur Paketleri'
    ]
  },
  {
    name: 'Reklam ve Medya',
    count: 142,
    children: [
      'Dijital Pazarlama', 'SEO', 'GEO', 'Google Ads', 'Sosyal Medya Yönetimi', 'Grafik Tasarım',
      'Logo Tasarımı', 'Baskı Hizmetleri', 'Video Prodüksiyon', 'Fotoğraf Çekimi', 'Tanıtım Filmi'
    ]
  },
  {
    name: 'Ambalaj ve Baskı',
    count: 337,
    children: [
      'Karton Kutu', 'Etiket', 'Poşet', 'Koli', 'Promosyon Ürünleri', 'Matbaa', 'Dijital Baskı',
      'Ofset Baskı'
    ]
  },
  {
    name: 'Telekomünikasyon',
    count: 122,
    children: [
      'Fiber Altyapı', 'IP Telefon', 'Santral', 'İnternet Hizmeti', 'GSM Hizmetleri', 'Baz İstasyonu'
    ]
  },
  {
    name: 'Danışmanlık',
    count: 163,
    children: [
      'Hukuk Danışmanlığı', 'Mali Müşavirlik', 'İnsan Kaynakları', 'Kalite Yönetimi',
      'ISO Belgelendirme', 'Proje Danışmanlığı', 'Eğitim Danışmanlığı'
    ]
  },
  {
    name: 'Sigorta',
    count: 56,
    children: [
      'Araç Sigortası', 'Sağlık Sigortası', 'İş Yeri Sigortası', 'Nakliyat Sigortası',
      'İnşaat Sigortası', 'Hayat Sigortası'
    ]
  },
  {
    name: 'Finans',
    count: 115,
    children: [
      'Finansal Danışmanlık', 'Leasing', 'Faktoring', 'Kredi Hizmetleri', 'POS Hizmetleri',
      'Ödeme Sistemleri'
    ]
  },
  {
    name: 'Hukuk Hizmetleri',
    count: 76,
    children: [
      'Avukatlık', 'Arabuluculuk', 'İcra Takibi', 'Sözleşme Hazırlama', 'Marka Tescili',
      'Patent İşlemleri'
    ]
  },
  {
    name: 'Bakım ve Onarım',
    count: 118,
    children: [
      'Elektrik Bakımı', 'Mekanik Bakım', 'Asansör Bakımı', 'Klima Bakımı', 'Makine Bakımı',
      'Bilgisayar Bakımı', 'Sunucu Bakımı'
    ]
  },
  {
    name: 'Organizasyon ve Etkinlik',
    count: 76,
    children: [
      'Fuar Organizasyonu', 'Kongre', 'Seminer', 'Konser', 'Festival', 'Catering',
      'Sahne Sistemleri', 'Ses ve Işık Sistemleri'
    ]
  },
  {
    name: 'Diğer',
    count: 109,
    children: [
      'Muhtelif Alımlar', 'Karma İhaleler', 'Özel Projeler', 'Açık Artırmalar', 'Tasfiye Satışları',
      'Hurda Satışları', 'İkinci El Ürünler'
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

const tenderTypes = computed(() => {
  if (locale.value === 'en') {
    return [
      { name: 'Goods Procurement', count: 578 },
      { name: 'Service Procurement', count: 207 },
      { name: 'Construction Work', count: 180 },
      { name: 'Contract Manufacturing', count: 92 },
      { name: 'Leasing / Rental', count: 85 },
      { name: 'Sales Request', count: 39 }
    ]
  } else {
    return [
      { name: 'Mal Alımı', count: 578 },
      { name: 'Hizmet Alımı', count: 207 },
      { name: 'Yapım İşi', count: 180 },
      { name: 'Fason Üretim', count: 92 },
      { name: 'Kiralama', count: 85 },
      { name: 'Satış Talebi', count: 39 }
    ]
  }
})

const offerMethods = computed(() => {
  if (locale.value === 'en') {
    return [
      { name: 'Open Bidding', count: 546 },
      { name: 'Sealed Bidding', count: 395 },
      { name: 'Invited Tender', count: 151 },
      { name: 'Reverse Auction', count: 98 },
      { name: 'Price Research', count: 68 },
      { name: 'Direct RFQ', count: 57 }
    ]
  } else {
    return [
      { name: 'Açık Teklif', count: 546 },
      { name: 'Kapalı Teklif', count: 395 },
      { name: 'Davetli İhale', count: 151 },
      { name: 'Ters İhale', count: 98 },
      { name: 'Fiyat Araştırması', count: 68 },
      { name: 'Doğrudan Teklif Talebi', count: 57 }
    ]
  }
})

const pricingTypes = computed(() => {
  if (locale.value === 'en') {
    return [
      { name: 'Lump Sum / Total Price', count: 214 },
      { name: 'Unit Price', count: 323 },
      { name: 'Partial Bids Allowed', count: 115 },
      { name: 'Partial Bids Not Allowed', count: 277 }
    ]
  } else {
    return [
      { name: 'Toplam / Götürü Bedel', count: 214 },
      { name: 'Birim Fiyat', count: 323 },
      { name: 'Kısmi Teklif Verilebilir', count: 115 },
      { name: 'Kısmi Teklif Verilemez', count: 277 }
    ]
  }
})

const tenders = [
  {
    id: 1,
    featured: true,
    title: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
    company: 'Marmara Teknoloji Yatırımları A.Ş.',
    verified: true,
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

const buyerSteps = computed(() => {
  if (locale.value === 'en') {
    return [
      { number: '01', title: 'Publish Request', text: 'Define your product or service requirement. Upload technical and administrative specifications.' },
      { number: '02', title: 'Watch Competition Arena', text: 'Track the live reverse auction arena where verified suppliers compete with instant price cuts.' },
      { number: '03', title: 'Finalize Deal with Best Bid', text: 'Select the optimal proposal based on price, quality, and delivery terms, and lock the deal.' }
    ]
  } else {
    return [
      { number: '01', title: 'İhtiyacını Yayınla', text: 'Ürün veya hizmet ihtiyacını oluştur. Teknik ve idari şartname belgelerini yükle.' },
      { number: '02', title: 'Rekabet Arenasını İzle', text: 'Tedarikçilerin anlık fiyat kırarak yarıştığı tersine ihale arenasını canlı takip et.' },
      { number: '03', title: 'En Uygun Teklifle Anlaş', text: 'Fiyat, kalite ve teslimat şartlarına göre en doğru kararı ver ve anlaşmayı kilitlesin.' }
    ]
  }
})

const supplierSteps = computed(() => {
  if (locale.value === 'en') {
    return [
      { number: '01', title: 'Explore Opportunities', text: 'Find active corporate tenders tailored to your sector and expertise in seconds.' },
      { number: '02', title: 'Submit Proposal', text: 'Review technical specifications and securely submit your itemized unit price proposal.' },
      { number: '03', title: 'Grow Client Portfolio', text: 'Close direct B2B deals with verified buyers and expand your corporate sales volume.' }
    ]
  } else {
    return [
      { number: '01', title: 'İş Fırsatlarını Keşfet', text: 'Sektörüne ve uzmanlık alanına uygun güncel kurumsal ihaleleri saniyeler içinde bul.' },
      { number: '02', title: 'Teklifini Gönder', text: 'Teknik şartları incele, malzeme bazlı birim fiyat teklifini güvenle ilet.' },
      { number: '03', title: 'Yeni Portföy Kazan', text: 'Doğrulanmış B2B alıcılar ile doğrudan iş anlaşmaları yap ve ticaret hacmini büyüt.' }
    ]
  }
})

const activeSteps = computed(() => activeAudience.value === 'buyer' ? buyerSteps.value : supplierSteps.value)

const localizedTenders = computed(() => {
  if (locale.value === 'en') {
    return (tenders || []).map(t => ({
      ...t,
      title: t.title === '500 Adet Kurumsal Dizüstü Bilgisayar Alımı' ? '500 Units Corporate Laptop Procurement' :
             t.title === 'Üretim Tesisi Çatı ve İzolasyon Yenileme İşi' ? 'Manufacturing Facility Roof & Insulation Renovation' :
             t.title === '12 Aylık Personel Taşıma Hizmeti' ? '12-Month Staff Shuttle Transportation Service' :
             t.title === '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi' ? '100,000 Units Custom Box Manufacturing' :
             t.title === 'Kurumsal Web Yazılım ve Mobil Uygulama Projesi' ? 'Corporate Web Software & Mobile App Project' : t.title,
      type: t.type === 'Mal Alımı' ? 'Goods Procurement' : t.type === 'Yapım İşi' ? 'Construction Work' : t.type === 'Hizmet Alımı' ? 'Service Procurement' : t.type === 'Fason Üretim' ? 'Contract Manufacturing' : t.type,
      method: t.method === 'Kapalı Teklif' ? 'Sealed Bidding' : t.method === 'Açık Teklif' ? 'Open Bidding' : t.method === 'Ters İhale' ? 'Reverse Auction' : t.method === 'Davetli İhale' ? 'Invited Tender' : t.method,
      pricing: t.pricing === 'Birim Fiyat' ? 'Unit Price' : t.pricing === 'Toplam / Götürü Bedel' ? 'Lump Sum / Total Price' : t.pricing,
      value: (t.value || '').replace('₺', '$').replace('5.500.000', '180,000').replace('1.250.000', '42,000').replace('840.000', '28,000').replace('350.000', '11,500').replace('2.800.000', '92,000'),
      description: t.id === 1 ? 'Procurement of 500 corporate laptop computers in accordance with technical specs.' :
                   t.id === 2 ? 'Roof cladding and thermal insulation renovation for factory production facility.' :
                   t.id === 3 ? '12-month employee shuttle service for production plant staff.' :
                   t.id === 4 ? 'Contract production of custom printed packaging boxes.' :
                   'Development of corporate portal, mobile app, and admin control panel.'
    }))
  } else {
    return tenders || []
  }
})

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
   YARDIMCI FONKSİYONLAR & HIZLI TEKLİF
========================================================= */
const showQuickBidModal = ref(false)
const quickBidTender = ref<any>(null)
const quickBidPrice = ref('')
const quickBidDeliveryDays = ref('')
const quickBidNotes = ref('')
const isSubmittingQuickBid = ref(false)

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

function openQuickBidModal(tender: any) {
  quickBidTender.value = tender
  quickBidPrice.value = ''
  quickBidDeliveryDays.value = '7'
  quickBidNotes.value = ''
  showQuickBidModal.value = true
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
    alert(`🎉 TEKLİFİNİZ İLETİLDİ!\n\n${quickBidTender.value?.company} firmasına ${quickBidPrice.value} ₺ tutarındaki teklifiniz anında başarıyla iletilmiştir.`)
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
    <!-- HERO SECTION -->
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
          <div class="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]" style="color: #1EAE4C;">
            <span class="h-px w-8" style="background-color: #1EAE4C;"></span>
            {{ localizedHero.tagline }}
          </div>
          <h1 class="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {{ localizedHero.titleLine1 }}<br />
            {{ localizedHero.titleLine2 }}<br />
            <span class="font-serif italic font-medium" style="color: #1EAE4C;">{{ localizedHero.titleItalic }}</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            {{ localizedHero.description }}
          </p>
          
          <!-- Buttons -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink to="/uyelik" class="flex items-center gap-2 rounded-xl px-6 py-4 text-xs font-black text-white shadow-xl shadow-blue-600/10 hover:opacity-90 transition-all" style="background: #003057;">
              {{ locale === 'tr' ? 'Hemen kurumsal hesap aç' : 'Open business account' }}
              <ArrowRight :size="15" />
            </NuxtLink>
            <a href="#nasil-calisir" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-4 text-xs font-black text-slate-700 hover:bg-white transition-all">
              {{ locale === 'tr' ? 'Nasıl çalışır' : 'How it works' }}
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
              {{ locale === 'tr' ? 'Video rehberlerini izle' : 'Watch video guides' }}
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
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span> {{ locale === 'tr' ? 'TEMSİLİ CANLI İHALE' : 'LIVE AUCTION PREVIEW' }}
                </span>
                <h3 class="mt-1.5 text-base font-black text-slate-800">{{ localizedLiveTender.title }}</h3>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">{{ locale === 'tr' ? 'KALAN SÜRE' : 'TIME REMAINING' }}</span>
                <div class="mt-1 font-mono text-sm font-black text-slate-800">{{ localizedLiveTender.remainingTime }}</div>
              </div>
            </div>

            <!-- Price and Savings info -->
            <div class="py-6 flex justify-between items-start">
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">{{ locale === 'tr' ? 'GÜNCEL EN İYİ TEKLİF' : 'CURRENT BEST BID' }}</span>
                <div class="mt-1 text-4xl font-black text-slate-900 tracking-tight font-mono">
                  {{ currencySymbol }}{{ localizedLiveTender.bestBid.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}
                </div>
                <div class="mt-2 text-[10px] text-slate-400 font-bold">
                  {{ locale === 'tr' ? 'AÇILIŞ FİYATI' : 'OPENING PRICE' }} <span class="font-mono text-slate-600 line-through">{{ currencySymbol }}{{ localizedLiveTender.openingPrice.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
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
                {{ localizedLiveTender.competitors.length }} {{ locale === 'tr' ? 'TEDARİKÇİ YARIŞIYOR' : 'SUPPLIERS BIDDING' }}
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
                  <span v-if="comp.leader" class="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-black text-blue-700">{{ locale === 'tr' ? 'ÖNDE' : 'LEADER' }}</span>
                </div>
                <span class="font-mono font-bold text-xs" :class="comp.leader ? 'text-slate-800' : 'text-slate-500'">
                  {{ currencySymbol }}{{ comp.price.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}
                </span>
              </div>
            </div>

            <!-- Bottom Tabs Inside Card -->
            <div class="grid grid-cols-4 gap-1 mt-6 border-t border-slate-100 pt-4 text-center">
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ locale === 'tr' ? 'TALEP' : 'REQUEST' }}</span>
              <span class="text-[8px] font-black text-blue-600 py-1 border-b-2 border-blue-600">+ {{ locale === 'tr' ? 'TEKLİF' : 'BIDS' }}</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ locale === 'tr' ? 'KARAR' : 'DECISION' }}</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">{{ locale === 'tr' ? 'TESLİMAT' : 'DELIVERY' }}</span>
            </div>

            <div class="mt-4 text-center text-[9px] italic text-slate-400">
              {{ locale === 'tr' ? 'Temsili veridir - Gerçek teklif değildir' : 'Mock data - Not a real bid' }}
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

    <!-- B2B EXPLORER SECTION -->
    <section id="ihale-gezgini" class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <!-- Explorer Header -->
        <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end text-left">
          <div>
            <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'İHALE PAZARI' : 'TENDER MARKETPLACE' }}</span>
            <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Doğru Firmayla Doğru Şartlarda Anlaşın' : 'Agree on the Right Terms with the Right Partner' }}</h2>
            <p class="mt-3 max-w-2xl text-xs text-slate-500">{{ locale === 'tr' ? 'Sektörünüze özel ihaleleri sol panelden filtreleyin; teklif süreçlerini canlı takip edin.' : 'Filter tenders tailored to your industry; follow bidding workflows live in real-time.' }}</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3.5 flex flex-col gap-1 items-start">
            <span class="text-xs font-black text-blue-900">{{ filteredTenders.length }} {{ locale === 'tr' ? 'Aktif Sonuç' : 'Active Results' }}</span>
            <span class="text-[10px] text-blue-600">{{ locale === 'tr' ? 'Kriterlere göre anlık güncellenir' : 'Updated live based on criteria' }}</span>
          </div>
        </div>

        <!-- Explorer Main 2-Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT SIDEBAR: Sahibinden-Style Accordion Category & Sector Tree -->
          <aside class="lg:col-span-4 bg-slate-50/90 border border-slate-200/90 rounded-3xl p-5 text-left shadow-sm sticky top-24">
            <div class="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-3.5">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Folder :size="16" class="text-blue-600" />
                <span>{{ locale === 'tr' ? 'Kategoriler & Sektörler' : 'Categories & Sectors' }}</span>
              </h3>
              <button 
                v-if="selectedCat || selectedSubcategory" 
                @click="clearFilters" 
                class="text-[10px] font-black text-rose-600 hover:underline uppercase"
              >
                {{ locale === 'tr' ? 'Tümünü Gör' : 'Clear Filter' }}
              </button>
            </div>

            <!-- Vertical Accordion List -->
            <div class="space-y-1.5 max-h-[540px] overflow-y-auto pr-1.5 custom-scrollbar text-xs font-medium">
              <div 
                v-for="cat in detailedCategories" 
                :key="cat.name"
                class="rounded-xl transition-all"
              >
                <!-- Main Category Expandable Button -->
                <button 
                  @click="toggleCategory(cat.name)"
                  class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-white hover:text-blue-600 font-bold transition-all text-left group"
                  :class="expandedCategory === cat.name || selectedCat === cat.name ? 'bg-blue-600 text-white hover:text-white font-extrabold shadow-sm' : ''"
                >
                  <div class="flex items-center gap-2 truncate pr-2">
                    <ChevronRight 
                      :size="14" 
                      class="transition-transform shrink-0" 
                      :class="{ 'rotate-90': expandedCategory === cat.name }" 
                    />
                    <span class="truncate">{{ cat.name }}</span>
                  </div>
                  <span 
                    class="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold shrink-0"
                    :class="expandedCategory === cat.name || selectedCat === cat.name ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700'"
                  >
                    {{ cat.count }}
                  </span>
                </button>

                <!-- Subcategories Accordion Panel (Scrollable with max-height) -->
                <div 
                  v-if="expandedCategory === cat.name" 
                  class="ml-4 pl-3 border-l-2 border-blue-200 space-y-1 my-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar"
                >
                  <button 
                    v-for="sub in cat.children" 
                    :key="sub"
                    @click="selectSubcategory(cat.name, sub)"
                    class="w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] transition-colors truncate"
                    :class="selectedSubcategory === sub ? 'font-black text-blue-600 bg-blue-50 border border-blue-200/80 shadow-xs' : 'text-slate-600 hover:bg-white hover:text-blue-600'"
                  >
                    • {{ sub }}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <!-- RIGHT MAIN FEED: Search, Filter Bar & Tender Cards -->
          <main class="lg:col-span-8 space-y-6 text-left">
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
                    :placeholder="locale === 'tr' ? 'İlan başlığı, malzeme veya firma adı ile arayın...' : 'Search by title, item, or company...'" 
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
                    <option value="">{{ locale === 'tr' ? 'Tüm Türkiye (81 İl)' : 'All Turkey (81 Cities)' }}</option>
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
                  {{ locale === 'tr' ? 'Gelişmiş Filtreler (Tür & Yöntem)' : 'Advanced Filters (Type & Method)' }}
                  <ChevronDown :size="12" class="transition-transform" :class="{ 'rotate-180': showAdvancedFilters }" />
                </button>

                <button 
                  v-if="selectedCat || selectedSubcategory || selectedSector || selectedCity || selectedType || selectedMethod || selectedPricingType || explorerSearch"
                  @click="clearFilters" 
                  class="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase flex items-center gap-1"
                >
                  <X :size="12" />
                  {{ locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters' }}
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
                    {{ locale === 'tr' ? 'İhale Türü' : 'Tender Type' }}
                  </label>
                  <select 
                    v-model="selectedType" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ locale === 'tr' ? 'Tüm Türler' : 'All Types' }}</option>
                    <option v-for="t in tenderTypes" :key="t.name" :value="t.name">{{ t.name }}</option>
                  </select>
                </div>

                <!-- Bidding Method -->
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <SlidersHorizontal :size="11" class="text-blue-600" />
                    {{ locale === 'tr' ? 'Teklif Yöntemi' : 'Bidding Method' }}
                  </label>
                  <select 
                    v-model="selectedMethod" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ locale === 'tr' ? 'Tüm Yöntemler' : 'All Methods' }}</option>
                    <option v-for="m in offerMethods" :key="m.name" :value="m.name">{{ m.name }}</option>
                  </select>
                </div>

                <!-- Pricing Type -->
                <div class="space-y-1.5">
                  <label class="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <FileText :size="11" class="text-blue-600" />
                    {{ locale === 'tr' ? 'Fiyatlandırma Türü' : 'Pricing Type' }}
                  </label>
                  <select 
                    v-model="selectedPricingType" 
                    class="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">{{ locale === 'tr' ? 'Tüm Türler' : 'All Types' }}</option>
                    <option v-for="p in pricingTypes" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Active Filter Badges -->
            <div v-if="selectedCat || selectedSubcategory || selectedSector || selectedCity || selectedType || selectedMethod || selectedPricingType" class="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-left">
              <div class="text-[9px] font-black uppercase tracking-wider text-blue-600 mb-2">{{ locale === 'tr' ? 'Aktif Filtreler' : 'Active Filters' }}</div>
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

              <div v-for="res in filteredTenders" :key="res.id" class="p-6 rounded-2xl bg-white border premium-shadow flex flex-col text-left">
                  <div class="flex flex-col lg:flex-row lg:justify-between gap-6">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span v-if="res.featured" class="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[9px] font-black text-orange-700 uppercase">🔥 {{ locale === 'tr' ? 'Öne Çıkan' : 'Featured' }}</span>
                        <span class="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-black text-blue-700 uppercase">{{ res.type }}</span>
                        <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.method }}</span>
                        <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.pricing }}</span>
                      </div>

                      <h3 class="mt-4 text-base font-black text-slate-800 hover:text-blue-600 transition-colors leading-snug">{{ res.title }}</h3>
                      <div @click="openCompanyModal(res.company)" class="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-amber-600 transition-colors select-none" title="Firma profilini, puanlarını ve kıstas seviyesini gör">
                        <Building2 :size="14" class="text-slate-400" />
                        <span class="underline decoration-slate-300 font-extrabold">{{ res.company }}</span>
                        <span v-if="res.verified" class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wider flex items-center gap-0.5">
                          <ShieldCheck :size="10" /> {{ locale === 'tr' ? 'ONAYLI ÜYE' : 'VERIFIED MEMBER' }}
                        </span>
                        <span class="rounded-lg bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 text-[9px] font-black tracking-wide transition shadow-2xs">
                          👁️ {{ locale === 'tr' ? 'Profili & Puanları Gör' : 'View Profile & Rating' }}
                        </span>
                      </div>
                    <p class="mt-3 text-xs leading-relaxed text-slate-500 font-medium">{{ res.description }}</p>

                    <div class="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                      <span class="flex items-center gap-1.5"><MapPin :size="14" /> {{ res.city }}</span>
                      <span class="flex items-center gap-1.5"><Clock3 :size="14" /> {{ res.offers }} {{ locale === 'tr' ? 'teklif toplandı' : 'bids submitted' }}</span>
                      <a 
                        :href="'data:text/plain;charset=utf-8,' + encodeURIComponent('TEKNİK VE İDARİ ŞARTNAME DOSYASI\n----------------------------------------\nİhale No: 2026/' + (100000 + res.id) + '\nİhale Başlığı: ' + res.title + '\nAlıcı Firma: ' + res.company + '\nTeslimat Şehri: ' + res.city + '\n\nİŞİN NİTELİĞİ VE AÇIKLAMA:\n' + res.description + '\n\nMALZEME / HİZMET LİSTESİ:\n' + res.material_list + '\n\nİDARİ ŞARTLAR:\n' + res.admin_spec + '\n\nTEKNİK ŞARTLAR:\n' + res.tech_spec)" 
                        :download="'Ihale_Sartnamesi_2026_' + res.id + '.txt'" 
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
                        title="İhale şartname ve malzeme listesi dosyasını bilgisayara indir"
                      >
                        <Download :size="13" class="text-emerald-600" />
                        <span>{{ locale === 'tr' ? '📄 Şartnameyi İndir (.PDF)' : '📄 Download Spec (.PDF)' }}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Right panel within card -->
                  <div class="flex min-w-[200px] flex-col justify-between border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <div class="text-[9px] font-black uppercase text-slate-400">{{ locale === 'tr' ? 'Son Teklif Tarihi' : 'Deadline' }}</div>
                      <div class="mt-1 text-sm font-black text-slate-800">{{ res.deadline }}</div>
                      <div class="mt-1 text-xs font-black text-red-500">{{ res.daysLeft }} {{ locale === 'tr' ? 'gün kaldı' : 'days left' }}</div>
                    </div>
                    
                    <div class="space-y-2 mt-6">
                      <button 
                        @click="openQuickBidModal(res)" 
                        class="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-3 shadow-md hover:shadow-lg transition-all border border-amber-300 cursor-pointer"
                      >
                        <Zap :size="15" class="fill-slate-950 text-slate-950" />
                        <span>{{ locale === 'tr' ? '⚡ Hızlı Teklif Ver' : '⚡ Submit Instant Bid' }}</span>
                      </button>

                      <button 
                        @click="expandedTenderId = expandedTenderId === res.id ? null : res.id; activeDetailTab = 'malzeme'" 
                        class="w-full flex items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all"
                      >
                        {{ expandedTenderId === res.id ? (locale === 'tr' ? 'Detayı Kapat' : 'Hide Details') : (locale === 'tr' ? 'İhale Detayları' : 'Tender Details') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Detay Kartı Açılımı (EKAP Stili) -->
                <div v-if="expandedTenderId === res.id" class="w-full mt-6 p-4 rounded-xl bg-sky-50/30 text-slate-700 border border-sky-200 text-xs flex flex-col gap-4 shadow-sm">
                  <div class="flex items-center gap-2 pb-2 border-b border-sky-100">
                    <span class="bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded"># {{ locale === 'tr' ? 'İHALE NO' : 'TENDER NO' }}</span>
                    <span class="font-bold text-slate-800 text-xs">2026/{{ 100000 + res.id }} - {{ res.title }}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-6">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ locale === 'tr' ? 'İşin Niteliği' : 'Scope of Work' }}</span>
                      <p class="mt-1 text-slate-700 leading-relaxed">{{ res.description }}</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ locale === 'tr' ? 'Teslim Yeri' : 'Delivery Location' }}</span>
                      <p class="mt-1 text-slate-700 font-bold">{{ res.city }} / Turkey</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">{{ locale === 'tr' ? 'Yaklaşık Maliyet Hacmi' : 'Estimated Budget' }}</span>
                      <p class="mt-1 text-slate-900 font-mono font-black text-sm">{{ res.value }}</p>
                    </div>
                  </div>

                  <!-- Sekmeler -->
                  <div class="border-t border-sky-100 pt-3 flex flex-wrap gap-2">
                    <button 
                      v-for="tab in ['malzeme', 'ilan', 'idari', 'teknik', 'benzer']" 
                      :key="tab" 
                      @click="activeDetailTab = tab" 
                      class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all uppercase tracking-wider flex items-center gap-1.5" 
                      :class="activeDetailTab === tab ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
                    >
                      <template v-if="tab === 'malzeme'">
                        <ListTodo :size="12" />
                        <span>{{ locale === 'tr' ? 'Malzeme Listesi' : 'Material List' }}</span>
                      </template>
                      <template v-else-if="tab === 'ilan'">
                        <Volume2 :size="12" />
                        <span>{{ locale === 'tr' ? 'İhale İlanı' : 'Tender Announcement' }}</span>
                      </template>
                      <template v-else-if="tab === 'idari'">
                        <ShieldCheck :size="12" />
                        <span>{{ locale === 'tr' ? 'İdari Şartname' : 'Administrative Spec' }}</span>
                      </template>
                      <template v-else-if="tab === 'teknik'">
                        <Settings :size="12" />
                        <span>{{ locale === 'tr' ? 'Teknik Şartname' : 'Technical Spec' }}</span>
                      </template>
                      <template v-else-if="tab === 'benzer'">
                        <Hourglass :size="12" />
                        <span>{{ locale === 'tr' ? 'Canlı Eksiltme' : 'Live Reverse Auction' }}</span>
                      </template>
                    </button>
                  </div>

                  <!-- Sekme İçerikleri -->
                  <div class="bg-white border border-slate-200 rounded-xl p-4 mt-2">
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
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {{ locale === 'tr' ? 'Güncel Teklif Eksiltme Günlüğü (Audit Trail)' : 'Live Bidding Log (Audit Trail)' }}
                      </h4>
                      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 font-mono text-[11px] sm:text-xs text-slate-400">
                        <div class="flex justify-between">
                          <span>[15:42:01] {{ locale === 'tr' ? 'Tedarikçi #8 (Demir A.Ş.)' : 'Supplier #8 (Demir Inc.)' }}</span>
                          <span class="text-red-400 font-semibold">- {{ currencySymbol }}8,500 {{ locale === 'tr' ? 'indirim yaptı' : 'discounted' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>[15:39:12] {{ locale === 'tr' ? 'Tedarikçi #3 (Öz Yapı)' : 'Supplier #3 (Oz Construction)' }}</span>
                          <span class="text-red-400 font-semibold">- {{ currencySymbol }}12,000 {{ locale === 'tr' ? 'indirim yaptı' : 'discounted' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>[15:35:50] {{ locale === 'tr' ? 'Sistem' : 'System' }}</span>
                          <span class="text-slate-500">{{ locale === 'tr' ? 'İhale canlı eksiltme aşamasına geçti' : 'Tender transitioned to live bidding stage' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sonuç Yok -->
              <div v-if="filteredTenders.length === 0" class="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Search :size="32" class="mx-auto text-slate-300 mb-3" />
                <h3 class="text-sm font-black text-slate-800">{{ locale === 'tr' ? 'Arama Kriterlerine Uygun İhale Bulunamadı' : 'No Tenders Matching Search Criteria' }}</h3>
                <p class="text-xs text-slate-500 mt-1">{{ locale === 'tr' ? 'Lütfen filtre seçeneklerini değiştirerek yeniden arayın.' : 'Please adjust your search filters and try again.' }}</p>
                <button @click="clearFilters" class="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all">{{ locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters' }}</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- TASARRUF HESAPLAMA ARACI (ROI) -->
    <section id="ozellikler" class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'VERİMLİLİK & ROI' : 'EFFICIENCY & ROI' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Tedarik Tasarrufunuzu Hesaplayın' : 'Calculate Your Procurement Savings' }}</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ locale === 'tr' ? 'Yıllık satın alma hacminizi belirleyin, GelAnlaşalım B2B tersine ihale arenası ile elde edeceğiniz tahmini kazancı anında görün.' : 'Set your annual procurement volume to instantly estimate your potential savings in the reverse auction arena.' }}</p>
        </div>

        <div class="mx-auto max-w-4xl rounded-3xl border bg-white p-8 md:p-12 premium-shadow flex flex-col gap-8 md:gap-12 text-left">
          <!-- Slider area -->
          <div class="space-y-4">
            <div class="flex justify-between items-baseline">
              <label for="annualVolumeInput" class="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">{{ locale === 'tr' ? 'Yıllık Satın Alma Hacminiz' : 'Annual Procurement Volume' }}</label>
              <span class="font-mono text-xl font-black text-blue-600">{{ currencySymbol }}{{ annualVolume.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
            </div>
            <input
              type="range"
              id="annualVolumeInput"
              min="500000"
              max="50000000"
              step="500000"
              v-model.number="annualVolume"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{{ currencySymbol }}500K</span>
              <span>{{ currencySymbol }}25M</span>
              <span>{{ currencySymbol }}50M</span>
            </div>
          </div>

          <!-- Calculated values grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Col 1: Net Savings -->
            <div class="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-blue-600 tracking-wider">{{ locale === 'tr' ? 'Tahmini Yıllık Tasarruf (%14.2)' : 'Estimated Annual Savings (14.2%)' }}</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ currencySymbol }}{{ calculatedSavings.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') }}</span>
              <span class="text-[10px] text-slate-400">{{ locale === 'tr' ? 'Canlı eksiltme arenaları ortalama verisidir.' : 'Based on average reverse auction results.' }}</span>
            </div>

            <!-- Col 2: Labor hours saved -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">{{ locale === 'tr' ? 'Kazanılan İş Gücü' : 'Labor Hours Saved' }}</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ Math.round(savedHours) }} {{ locale === 'tr' ? 'Adam/Ay' : 'Man/Months' }}</span>
              <span class="text-[10px] text-slate-400">{{ locale === 'tr' ? 'Excel kıyaslama ve e-posta takibi elenir.' : 'Eliminates Excel comparison & email chaos.' }}</span>
            </div>

            <!-- Col 3: Qualified suppliers reached -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">{{ locale === 'tr' ? 'Nitelikli Tedarikçi Erişimi' : 'Qualified Supplier Access' }}</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ connectedSuppliersCount }} {{ locale === 'tr' ? 'Firma' : 'Vendors' }}</span>
              <span class="text-[10px] text-slate-400">{{ locale === 'tr' ? 'İhalelerinize katılım sağlayacak hazır ağ.' : 'Ready network participating in your tenders.' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- KRİPTOGRAFİK ZAMAN DAMGASI & GÜVENLİK (AUDIT TRAIL TIMELINE) -->
    <section class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-16">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'ŞEFFAFLIK & GÜVENLİK' : 'TRANSPARENCY & SECURITY' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Kriptografik ve Damgalı İşlem Takibi' : 'Cryptographic & Timestamped Action Tracking' }}</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ locale === 'tr' ? 'Satın alma süreçleriniz, KVKK ve Türk Ticaret Kanunu uyumlu, TLS 1.2+ şifreli ve zaman damgalı değişmez bir log günlüğünde saklanır.' : 'Your procurement workflows are secured with TLS 1.2+ encryption, GDPR compliance, and timestamped immutable audit logs.' }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 relative text-left">
          <!-- Connector line for desktop -->
          <div class="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0"></div>

          <!-- Step 1 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">1</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ locale === 'tr' ? 'Şartname Damgalama' : 'Specification Timestamping' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ locale === 'tr' ? 'Yayınladığınız şartname dosyalarının kriptografik hash kodları çıkarılarak sisteme damgalanır.' : 'Cryptographic hash codes of your specification documents are timestamped to ensure file integrity.' }}
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">2</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ locale === 'tr' ? 'TLS 1.2+ Şifreli Teklifler' : 'TLS 1.2+ Encrypted Bids' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ locale === 'tr' ? 'Tedarikçilerin gönderdiği fiyat ve belgeler SSL/TLS katmanında şifrelenir.' : 'Bids and documents submitted by vendors are encrypted via SSL/TLS layers.' }}
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">3</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ locale === 'tr' ? 'Canlı Eksiltme Günlüğü' : 'Live Auction Audit Log' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ locale === 'tr' ? 'Ters ihale arenalarındaki her fiyat düşüşü, zaman damgasıyla denetim izine yazılır.' : 'Every price reduction in reverse auctions is logged with a timestamp into an immutable audit trail.' }}
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">4</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ locale === 'tr' ? 'KVKK Uyumlu Arşivleme' : 'GDPR Compliant Archiving' }}</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                {{ locale === 'tr' ? 'Sonuçlanan ihaleler yasal saklama sürelerine uygun olarak güvenli sunucularda saklanır.' : 'Completed tenders are archived on secure servers in compliance with data protection laws.' }}
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
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'ERP BAĞLANTILARI' : 'ERP INTEGRATIONS' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Kurumsal Sistemlerinizle Tam Entegrasyon' : 'Full Integration with Enterprise Systems' }}</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ locale === 'tr' ? 'Satın alma, teklif, sipariş ve tedarikçi verilerinizi mevcut ERP, CRM ve finans sistemlerinize kontrollü API entegrasyonu ile bağlayın.' : 'Connect purchase requisitions, bids, orders, and supplier master data directly into your existing ERP, CRM, and finance tools via APIs.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <!-- ERP Card 1: SAP -->
          <div class="p-6 bg-white border premium-shadow rounded-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">{{ locale === 'tr' ? 'SAP Entegrasyonu' : 'SAP Integration' }}</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ locale === 'tr' ? 'Satın alma taleplerinizi (Purchase Requisitions) SAP üzerinden otomatik çekin; ihale sonuçlarını SAP sipariş fişi (Purchase Order) olarak geri aktarın.' : 'Automatically sync Purchase Requisitions from SAP and export winning bids back as Purchase Orders.' }}
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">ERP CONNECTED</span>
          </div>

          <!-- ERP Card 2: Logo -->
          <div class="p-6 bg-white border premium-shadow rounded-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">{{ locale === 'tr' ? 'Logo & Netsis Entegrasyonu' : 'Logo & Netsis Integration' }}</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ locale === 'tr' ? 'Logo Tiger, Go3 veya Netsis sistemlerinizdeki malzeme kartlarını, birimlerini ve tedarikçi cari hesaplarını anlık olarak platformla senkronize edin.' : 'Instantly synchronize item catalogs, units of measure, and supplier ledgers from Logo & Netsis.' }}
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">API READY</span>
          </div>

          <!-- ERP Card 3: MS Dynamics -->
          <div class="p-6 bg-white border premium-shadow rounded-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">Microsoft Dynamics 365</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ locale === 'tr' ? 'Dynamics 365 Supply Chain Management modülüyle iki yönlü canlı veri eşleştirmesi sağlayarak teklif toplama süreçlerinizi hızlandırın.' : 'Accelerate bidding cycles with two-way real-time data mapping with Dynamics 365 Supply Chain.' }}
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">AUTOMATED SYNC</span>
          </div>

          <!-- ERP Card 4: Excel & REST API -->
          <div class="p-6 bg-white border premium-shadow rounded-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">{{ locale === 'tr' ? 'REST API & Excel Entegrasyonu' : 'REST API & Excel Integration' }}</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                {{ locale === 'tr' ? 'Özel şirket içi yazılımlarınız için RESTful API uç noktaları. Veya tek tıkla gelişmiş Excel tablosu yükleme ve karşılaştırma aracı.' : 'RESTful API endpoints for custom internal software, plus one-click bulk Excel upload and matrix analysis.' }}
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">RESTFUL API / XLS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- NASIL ÇALIŞIR SECTION -->
    <section id="nasil-calisir" class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6 text-center">
        <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'SÜREÇ REHBERİ' : 'PROCESS GUIDE' }}</span>
        <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Platform Nasıl Çalışıyor?' : 'How Does the Platform Work?' }}</h2>
        <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">{{ locale === 'tr' ? 'Alıcı veya tedarikçi rolünüze uygun adımları takip ederek süreci başlatın.' : 'Follow the step-by-step workflow tailored to your role as a buyer or supplier.' }}</p>

        <!-- Tab switcher -->
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-full border border-slate-200 bg-white p-1">
            <button @click="activeAudience = 'buyer'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'buyer' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              {{ locale === 'tr' ? 'Alıcı Şirketler İçin' : 'For Buyers' }}
            </button>
            <button @click="activeAudience = 'supplier'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'supplier' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              {{ locale === 'tr' ? 'Tedarikçi Firmalar İçin' : 'For Suppliers' }}
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

    <!-- FAQ SECTION -->
    <section id="sss" class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-4xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">{{ locale === 'tr' ? 'SIKÇA SORULANLAR' : 'FREQUENTLY ASKED QUESTIONS' }}</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">{{ locale === 'tr' ? 'Merak Edilen Konular' : 'Frequently Asked Questions' }}</h2>
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
              <BadgeCheck :size="12" /> E-E-A-T {{ locale === 'tr' ? 'DOĞRULANMIŞ PLATFORM' : 'VERIFIED PLATFORM' }}
            </span>
            <h2 class="text-xl font-black text-slate-900 tracking-tight md:text-2xl">
              {{ locale === 'tr' ? 'Editöryal Standartlar ve Güvenli Tedarik Güvencesi' : 'Editorial Standards & Secure Procurement Guarantee' }}
            </h2>
            <p class="text-xs text-slate-500 font-medium leading-relaxed font-sans">
              {{ locale === 'tr' ? 'Platformumuzdaki canlı eksiltme kuralları, B2B tasarruf verileri ve sözleşme şablonları, satın alma profesyonelleri ve hukuk müşavirleri tarafından denetlenerek onaylanmaktadır.' : 'Live auction rules, B2B savings telemetry, and contract templates across our platform are reviewed and certified by seasoned procurement directors and legal advisors.' }}
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
                {{ locale === 'tr' ? 'Uzman Kurulu Tarafından Onaylandı' : 'Certified by Expert Board' }}
              </div>
              <div class="text-[9px] text-slate-400 font-bold mt-0.5">
                {{ locale === 'tr' ? 'Son İnceleme: Temmuz 2026' : 'Last Review: July 2026' }}
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
          ⚡ {{ locale === 'tr' ? 'ÜCRETSİZ LANSMAN DÖNEMİ' : 'FREE LAUNCH PERIOD' }}
        </span>
        <h2 class="text-3xl font-black tracking-tight sm:text-4xl">
          {{ locale === 'tr' ? 'Tedarik Süreçlerinizi Bugün Dijitalleştirin' : 'Digitalize Your Procurement Workflows Today' }}
        </h2>
        <p class="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {{ locale === 'tr' ? 'Ters ihale arenamıza katılın, malzeme ve lojistik maliyetlerinizi canlı eksiltme ile düşürün. Satın alma taleplerinizi tek merkezden yönetmeye hemen başlayın.' : 'Join our reverse auction arena, cut material and logistics costs with live bidding, and manage all RFQs centrally.' }}
        </p>
        <div class="pt-4 flex flex-wrap justify-center gap-4">
          <NuxtLink 
            to="/uyelik" 
            class="flex items-center gap-2 rounded-xl px-8 py-4 text-xs font-black text-white bg-[#1EAE4C] shadow-lg shadow-[#1EAE4C]/20 hover:bg-[#158f3d] transition-all"
          >
            {{ locale === 'tr' ? 'Hemen Ücretsiz Katılın' : 'Join Free Now' }}
            <ArrowRight :size="15" />
          </NuxtLink>
          <a 
            href="#sss" 
            class="flex items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-xs font-black text-white hover:bg-slate-800 transition-all"
          >
            {{ locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions' }}
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
              <span class="text-[10px] font-black uppercase tracking-widest" style="color: #1EAE4C;">{{ locale === 'tr' ? 'BİZİMLE İLETİŞİME GEÇİN' : 'GET IN TOUCH' }}</span>
              <h2 class="text-3xl font-black text-slate-900 tracking-tight md:text-5xl leading-tight">
                {{ locale === 'tr' ? 'Satın alma süreçlerinizi' : 'Consolidate your procurement' }} <br class="hidden sm:inline" />
                <span class="italic" style="color: #1EAE4C;">{{ locale === 'tr' ? 'tek panelde toplayın.' : 'into a single dashboard.' }}</span>
              </h2>
              <p class="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium max-w-md">
                {{ locale === 'tr' ? 'Ekibimiz satın alma süreçlerinizde size yardımcı olmaya hazır. İletişim bilgilerinizi bırakın, en kısa sürede dönüş yapalım.' : 'Our team is ready to assist your business. Leave your contact information and we will reach out promptly.' }}
              </p>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ locale === 'tr' ? 'Hızlı kurumsal kurulum' : 'Fast enterprise setup' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ locale === 'tr' ? 'KVKK kapsamında altyapı' : 'GDPR compliant infrastructure' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ locale === 'tr' ? 'Hızlı onboarding' : 'Rapid onboarding' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">{{ locale === 'tr' ? 'Yerli destek ekibi' : 'Dedicated support team' }}</span>
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
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">{{ locale === 'tr' ? 'TALEBİNİZ ALINDI!' : 'REQUEST RECEIVED!' }}</h3>
                  <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                    {{ locale === 'tr' ? 'Mesajınız başarıyla iletildi. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.' : 'Your message has been sent successfully. Our team will contact you shortly.' }}
                  </p>
                </div>
                <button 
                  type="button" 
                  @click="contactSuccess = false" 
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  {{ locale === 'tr' ? 'Yeni Mesaj Gönder' : 'Send New Message' }}
                </button>
              </div>

              <!-- Form State -->
              <div v-else class="space-y-6">
                <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{{ locale === 'tr' ? 'SİZİNLE İLETİŞİME GEÇELİM' : 'LET US REACH OUT TO YOU' }}</span>
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">{{ locale === 'tr' ? 'BİZE NASIL ULAŞALIM?' : 'HOW SHOULD WE CONNECT?' }}</h3>
                </div>

                <!-- Contact Method Toggle Tabs -->
                <div class="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border">
                  <button
                    type="button"
                    @click="contactMethod = 'email'"
                    class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                    :class="contactMethod === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                  >
                    {{ locale === 'tr' ? 'E-posta' : 'Email' }}
                  </button>
                  <button
                    type="button"
                    @click="contactMethod = 'phone'"
                    class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                    :class="contactMethod === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                  >
                    {{ locale === 'tr' ? 'Telefon' : 'Phone' }}
                  </button>
                </div>

                <!-- Inputs -->
                <div class="space-y-4">
                  <!-- E-posta field -->
                  <div v-if="contactMethod === 'email'">
                    <label for="contactEmailInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ locale === 'tr' ? 'E-posta Adresiniz' : 'Your Email Address' }}</label>
                    <input
                      v-model="contactEmail"
                      type="email"
                      id="contactEmailInput"
                      :placeholder="locale === 'tr' ? 'ornek@sirket.com.tr' : 'name@company.com'"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <!-- Telefon field -->
                  <div v-else>
                    <label for="contactPhoneInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ locale === 'tr' ? 'Telefon Numaranız' : 'Your Phone Number' }}</label>
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
                    <label for="contactMessageInput" class="text-[9px] font-black uppercase text-slate-400 block mb-1">{{ locale === 'tr' ? 'Size nasıl yardımcı olabiliriz?' : 'How can we help you?' }}</label>
                    <textarea
                      v-model="contactMessage"
                      rows="3"
                      id="contactMessageInput"
                      :placeholder="locale === 'tr' ? 'Taleplerinizi belirtin...' : 'Tell us about your requirements...'"
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
                  <span v-if="contactSubmitted">{{ locale === 'tr' ? 'Gönderiliyor...' : 'Sending...' }}</span>
                  <span v-else class="flex items-center gap-1">{{ locale === 'tr' ? 'Gönder' : 'Submit' }} <ArrowRight :size="14" /></span>
                </button>

                <!-- Footer Sublinks -->
                <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 pt-2">
                  <a href="#nasil-calisir" class="hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'Önce nasıl çalıştığını inceleyin →' : 'See how it works first →' }}</a>
                  <NuxtLink to="/uyelik" class="hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'Kurumsal hesap aç →' : 'Create business account →' }}</NuxtLink>
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
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shrink-0">
              <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl font-mono">
                {{ selectedCompany.name.charAt(0) }}
              </div>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-lg font-black text-white tracking-tight truncate">{{ selectedCompany.name }}</h3>
                <span v-if="selectedCompany.verified" class="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck :size="11" class="text-amber-400" />
                  ✓ {{ locale === 'tr' ? 'e-Devlet & MERSİS ONAYLI' : 'e-Devlet VERIFIED' }}
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
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ locale === 'tr' ? 'Genel Puan' : 'Overall Score' }}</div>
              <div class="text-lg font-black text-white font-mono flex items-center justify-center gap-1 mt-0.5">
                <Star :size="14" class="text-amber-400 fill-amber-400" />
                <span>{{ selectedCompany.rating || '4.9' }}</span>
                <span class="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ locale === 'tr' ? 'Teslimat Hızı' : 'Delivery Speed' }}</div>
              <div class="text-lg font-black text-emerald-400 font-mono mt-0.5">%98</div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ locale === 'tr' ? 'Şartname Uyum' : 'Spec Accuracy' }}</div>
              <div class="text-lg font-black text-blue-400 font-mono mt-0.5">%100</div>
            </div>
            <div class="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <div class="text-[9px] font-black uppercase text-amber-300 tracking-wider">{{ locale === 'tr' ? 'İhale Hacmi' : 'Trade Volume' }}</div>
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
                {{ locale === 'tr' ? 'İLETİŞİM BİLGİLERİ' : 'CONTACT DETAILS' }}
              </h4>
              <div class="text-xs text-slate-600 space-y-2 font-medium">
                <div><strong class="text-slate-400">{{ locale === 'tr' ? 'Telefon:' : 'Phone:' }}</strong> {{ selectedCompany.phone }}</div>
                <div><strong class="text-slate-400">{{ locale === 'tr' ? 'E-Posta:' : 'Email:' }}</strong> {{ selectedCompany.email }}</div>
                <div><strong class="text-slate-400">{{ locale === 'tr' ? 'Adres:' : 'Address:' }}</strong> {{ selectedCompany.address }}</div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck :size="14" class="text-amber-600" />
                {{ locale === 'tr' ? 'RESMİ BİLGİLER & DOĞRULAMA' : 'OFFICIAL CREDENTIALS' }}
              </h4>
              <div class="text-xs text-slate-600 space-y-2 font-medium">
                <div><strong class="text-slate-400">{{ locale === 'tr' ? 'KEP Adresi:' : 'KEP Mail:' }}</strong> {{ selectedCompany.kep }}</div>
                <div><strong class="text-slate-400">{{ locale === 'tr' ? 'MERSİS / VKN No:' : 'Tax / Reg No:' }}</strong> {{ selectedCompany.mersis }}</div>
                <div class="flex items-center gap-1 pt-1">
                  <strong class="text-slate-400">{{ locale === 'tr' ? 'Doğrulama:' : 'Verification:' }}</strong>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                    ✓ {{ locale === 'tr' ? 'TİCARET SİCİL ONAYLI' : 'REGISTRY APPROVED' }}
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
                {{ locale === 'tr' ? 'ALDIĞI PUANLAR VE MÜŞTERİ DEĞERLENDİRMELERİ' : 'RATINGS & REVIEWS' }} ({{ selectedCompany.reviews ? selectedCompany.reviews.length : 0 }})
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
              {{ locale === 'tr' ? 'Kapat' : 'Close' }}
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
                placeholder="Örn: 45.000" 
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs" 
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
                placeholder="7" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all" 
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

    <!-- COOKIES CONSENT BANNER -->
    <transition name="fade">
      <div v-if="showCookieConsent" class="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl text-left flex flex-col gap-3">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Cookie :size="16" class="text-blue-600" />
          {{ locale === 'tr' ? 'Çerez Onayı & KVKK' : 'Cookie Consent & Privacy' }}
        </h4>
        <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
          {{ locale === 'tr' ? 'Platform kullanım deneyiminizi optimize etmek ve güvenli bir B2B ihale süreci sağlamak adına çerezleri kullanıyoruz.' : 'We use cookies to optimize your platform experience and guarantee secure B2B tender operations.' }}
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="acceptCookieConsent" class="rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-black text-white hover:bg-blue-700 transition-colors">
            {{ locale === 'tr' ? 'Kabul Et' : 'Accept' }}
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