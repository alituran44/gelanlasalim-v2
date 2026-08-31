import { ref } from 'vue'

const SCHEMA_VERSION = 'v2026_08_31_quota_safe_final_v2'

// Clean state for platform - zero dummy / mock data
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: "ÖZEL SEKTÖRÜN CANLI TERS İHALE VE PAZARLIK ARENASI",
    titleLine1: 'İhale Aç.',
    titleLine2: 'Teklif Topla.',
    titleItalic: "İhaleci Burada.",
    description: 'İhaleciBurada.com; e-ihale, ihale ve satın alma, teklif toplama ve doğrudan fiyat pazarlığı süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, rekabetçi tekliflerle tasarruf edin.',
    badgeStrip: [
      'KVKK & GDPR UYUMLU',
      'BELGE DENETİMİ & ZAMAN DAMGASI',
      'ŞİFRELİ VERİ İLETİMİ',
      'DOĞRUDAN PAZARLIK MODÜLÜ'
    ],
    heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-corporate-team-working-together-in-an-office-42790-large.mp4'
  },
  liveTender: {
    title: 'Canlı İhale Bekleniyor',
    remainingTime: '00:00',
    bestBid: 0,
    openingPrice: 0,
    savingsText: 'TASARRUF %0',
    competitors: []
  },
  pricing: {
    vatNotice: 'Fiyatlara %20 KDV dahildir.',
    disclaimer: 'Bu hizmet İhaleciBurada Bilişim ve Tedarik A.Ş. tarafından yürütülmektedir.',
    packages: [
      { id: '1_month', name: 'Üyelik Başvurusu - 1 Ay', price: 900, months: 1, monthlyPrice: 900, badge: 'KURUMSAL KULLANIM' },
      { id: '3_months', name: 'Üyelik Başvurusu - 3 Ay', price: 1800, months: 3, monthlyPrice: 600, badge: 'EN ÇOK TERCİH EDİLEN POPÜLER PLAN', popular: true },
      { id: '6_months', name: 'Üyelik Başvurusu - 6 Ay', price: 2700, months: 6, monthlyPrice: 450, badge: 'KURUMSAL KULLANIM' },
      { id: '9_months', name: 'Üyelik Başvurusu - 9 Ay', price: 3600, months: 9, monthlyPrice: 400, badge: 'YILLIK AVANTAJ' }
    ],
    features: [
      [
        'Kamu ihale arama',
        'İhale sonuçları analizi',
        'Doğrudan temin ilanları',
        'Satış ve kiralama duyuruları',
        'Hukuki mevzuat kararları',
        'Eşik değer hesaplama'
      ],
      [
        'Akıllı arama önerileri',
        'Yaklaşan ihale bildirimleri',
        'Sonuçlanan ihale uyarıları',
        'İptal ve düzeltme duyuruları',
        'Sınırsız bildirim (SMS+E-Posta)',
        'Sınırsız raporlama (Excel)'
      ],
      [
        'Yüklenici firma analizleri',
        'İdare/Kurum analizleri',
        'Sektörel pazar analizleri',
        'Rakip firma analizleri',
        'Mobil uyumlu uygulama'
      ]
    ]
  },
  faqs: [
    { q: "Tersine ihale (eksiltme) sistemi nasıl çalışır?", a: "Alıcı firma satın almak istediği malzeme veya hizmet için miktar ve teknik şartname belirterek ihale açar. Doğrulanmış tedarikçiler canlı sürede fiyat eksilterek yarışır." },
    { q: "Platformda şirket doğrulaması nasıl yapılıyor?", a: "Vergi levhası, imza sirküleri ve ticaret sicil gazetesi ekibimizce kontrol edilir. Yalnızca onaylanmış kurumsal hesaplar ihale açabilir ve teklif verebilir." },
    { q: "Ödeme ve teslimat süreçleri güvenli mi?", a: "Evet. Alıcı firma ihale bedelini güvenli hesaba yatırır. Teslimat onaylanıp denetlendikten sonra ödeme tedarikçiye aktarılır." },
    { q: "Alıcı firmalar komisyon veya ücret öder mi?", a: "Hayır. İhaleciBurada platformu alıcı firmalar için tamamen ücretsizdir." },
    { q: "Hangi sektörlerde ihale açabilirim?", a: "Tarım, inşaat, sağlık, teknoloji, lojistik, ambalaj, otomotiv ve tüm kurumsal satın alma kategorilerinde ihale açabilirsiniz." }
  ],
  problems: [
    { title: "Şartnameler ve teklifler dağınık kalır.", desc: "Tedarikçilere ayrı formlar ve e-postalar göndermek karmaşa ve hatalara yol açar." },
    { title: "Fiyat karşılaştırması manuel ve hataya açıktır.", desc: "Karmaşık Excel dosyaları, telefon trafiği ve uzayan e-posta zincirlerinde zaman kaybedilir." },
    { title: "Tedarikçi kalifikasyonu belgesizdir.", desc: "Evrak ve sicil denetimi yapılmadan yazılan sözleşmeler ticari risk yaratır." }
  ],
  features: [
    { title: "Ters İhale Arenası", desc: "Kapalı zarf usulü yerine canlı ve şeffaf eksiltmeli fiyat rekabeti." },
    { title: "Nitelikli Tedarikçi Akışı", desc: "Evrak kontrolünden geçmiş doğrulanmış kurumsal firma profilleri." },
    { title: "Belgeli Teklif Akışı", desc: "Şartname yükleyin, karşılaştırılabilir yapıda teklifler alın." },
    { title: "Detaylı Analitik", desc: "Maliyet geçmişi takibi, teklif kıyaslama ve karar çıktıları." }
  ],
  trustStandards: [
    { title: "TLS 1.2+", subtitle: "ŞİFRELİ VERİ", desc: "Tüm veri iletimlerinde HTTPS/SSL şifreleme." },
    { title: "KVKK Uyumlu", subtitle: "VERİ KORUMA", desc: "Kişisel verilerin korunması kanununa tam uyumluluk." },
    { title: "İşlem Günlüğü", subtitle: "KAYIT İZİ", desc: "Her teklif ve işlem için zaman damgalı tutulan kayıtlar." },
    { title: "TR · EN", subtitle: "ÇOKLU DİL", desc: "Türkçe ve İngilizce çift dil arayüz desteği." }
  ],
  stats: [
    { value: '0 ₺', label: 'Toplam Ticaret Hacmi' },
    { value: '0', label: 'Doğrulanmış B2B Üretici' },
    { value: '%0', label: 'Ortalama Tedarik Tasarrufu' },
    { value: '0 ₺', label: 'Alıcı Üyelik Komisyonu' }
  ],
  videoGuides: [
    { title: 'Nasıl Kayıt Olunur?', desc: 'Adım adım üyelik ve firma kaydı rehberi', videoUrl: '' },
    { title: 'Nasıl İhale Açılır?', desc: 'İlk ihale ve satın alma ihalenizi dakikalar içinde başlatın', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak ihale ve satın almaye katılma rehberi', videoUrl: '' },
    { title: 'Yönetim Paneli Rehberi', desc: 'Kontrol panelini ve raporlamaları etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [],
    receivedBids: [],
    submittedBids: [],
    disputes: [],
    companyReviews: [],
    sectorAlerts: [],
    escrowOrders: []
  },
  registeredCompanies: [],
  contact: {
    address: 'İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye',
    email: 'ihalecib@gmail.com',
    workHoursWeekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
    workHoursSaturday: 'Cumartesi: 10:00 - 14:00'
  },
  payments: [],
  supportSettings: {
    whatsappEnabled: true,
    whatsappNumber: '908508408695',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale süreçleri ve 1 ay ücretsiz deneme paketi hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme veya üyelik süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın.'
  },
  crmSettings: {
    leads: []
  },
  emailSettings: {
    senderName: 'İhaleciBurada B2B Operasyon',
    senderEmail: 'ihalecib@gmail.com',
    replyToEmail: 'ihalecib@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'ihalecib@gmail.com',
    subscribers: [],
    templates: []
  },
  kycVerifications: [],
  liveAuctionRooms: [],
  escrowOrders: [],
  categories: [
    { id: 'kat-1', name: 'İnşaat, Yapı & Şantiye', icon: 'Building2', targetSavings: '%16.5', activeTendersCount: 0, description: 'Demir, çimento, hazır beton, yalıtım ve kaba inşaat malzemeleri.' },
    { id: 'kat-2', name: 'Makine, Yedek Parça & Metal', icon: 'Wrench', targetSavings: '%14.2', activeTendersCount: 0, description: 'CNC fason talaşlı imalat, torna, sac işleme ve hidrolik aksam.' },
    { id: 'kat-3', name: 'Akaryakıt, Enerji & Madeni Yağ', icon: 'Fuel', targetSavings: '%11.8', activeTendersCount: 0, description: 'Toptan motorin, benzin, sanayi elektriği ve endüstriyel madeni yağ.' },
    { id: 'kat-4', name: 'Ambalaj, Koli & Plastik', icon: 'Package', targetSavings: '%18.0', activeTendersCount: 0, description: 'Oluklu mukavva koli, streç film, palet ve esnek ambalaj ürünleri.' },
    { id: 'kat-5', name: 'Lojistik, Nakliye & Depolama', icon: 'Truck', targetSavings: '%15.4', activeTendersCount: 0, description: 'Yurt içi komple tır, parsiyel sevkiyat, antrepo ve soğuk hava depolama.' },
    { id: 'kat-6', name: 'Kırtasiye, Ofis & Teknoloji', icon: 'Laptop', targetSavings: '%21.0', activeTendersCount: 0, description: 'Fotokopi kağıdı, toner, bilgisayar donanımı ve ofis mobilyası.' }
  ],
  promoCodes: [],
  auditLogs: [],
  siteSettings: {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı altyapı güçlendirme çalışması yapılmaktadır.',
    metaTitle: 'İhaleciBurada.com | B2B İhale ve Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, onaylı tedarikçilerden rekabetçi teklifler toplayın.',
    announcementTicker: '⚡ Tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi!',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 840 86 95',
    supportEmail: 'ihalecib@gmail.com',
    primaryCurrency: 'TRY (₺)',
    allowGuestBrowsing: true,
    enableEmailAlerts: true
  }
}

const cmsDataRef = ref({ ...DEFAULT_CMS_DATA })
let isInitialized = false


function stripHeavyDataUrls(obj: any, depth = 0): any {
  if (!obj || typeof obj !== 'object' || depth > 8) return obj
  try {
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (typeof val === 'string' && (val.startsWith('data:') || val.length > 25000)) {
        if (key.includes('img') || key.includes('image') || key === 'url') {
          obj[key] = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'
        } else {
          obj[key] = ''
        }
      } else if (typeof val === 'object') {
        stripHeavyDataUrls(val, depth + 1)
      }
    }
  } catch (e) {}
  return obj
}

function sanitizeForStorage(data: any): any {
  try {
    const copy = JSON.parse(JSON.stringify(data))
    stripHeavyDataUrls(copy)
    return copy
  } catch (e) {
    return data
  }
}

function safeLocalStorageSet(key: string, value: any) {
  if (typeof window === 'undefined') return
  try {
    const jsonStr = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, jsonStr)
  } catch (err) {
    console.warn(`localStorage quota reached on key "${key}", cleaning...`, err)
    try {
      localStorage.removeItem('tenderDraft')
      localStorage.removeItem('userNotifications')
      localStorage.removeItem('allRegisteredUsers')
      const sanitized = sanitizeForStorage(value)
      localStorage.setItem(key, JSON.stringify(sanitized))
    } catch (e2) {
      console.warn('Could not save to localStorage (relying on memory state):', e2)
    }
  }
}

export function useCmsData() {
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true

    // Check version migration - force clean slate if old version detected
    const savedVersion = localStorage.getItem('cms_schema_version')
    if (savedVersion !== SCHEMA_VERSION) {
      localStorage.removeItem('cmsData')
      localStorage.removeItem('myTenders')
      localStorage.setItem('cms_schema_version', SCHEMA_VERSION)
      cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
      return {
        cmsData: cmsDataRef,
        saveCmsData,
        resetCmsData
      }
    }

    const saved = localStorage.getItem('cmsData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (!parsed.dashboard) {
          parsed.dashboard = { ...DEFAULT_CMS_DATA.dashboard }
        }
        if (!Array.isArray(parsed.dashboard.tenders)) {
          parsed.dashboard.tenders = []
        }
        if (!Array.isArray(parsed.kycVerifications)) {
          parsed.kycVerifications = []
        }
        if (!Array.isArray(parsed.registeredCompanies)) {
          parsed.registeredCompanies = []
        }

        // Clean out any legacy mock dummy items
        parsed.dashboard.tenders = (parsed.dashboard.tenders || []).filter(
          (t: any) => !t.id?.startsWith('IHC-2024-') && !t.id?.startsWith('IHC-DEMO')
        )
        parsed.kycVerifications = (parsed.kycVerifications || []).filter(
          (k: any) => !['KYC-8921', 'KYC-7412', 'KYC-6320', 'KYC-5109'].includes(k.id)
        )

        cmsDataRef.value = parsed
        localStorage.setItem('cmsData', JSON.stringify(parsed))
      } catch (e) {
        cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
        localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
      }
    } else {
      cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  function sanitizeForStorage(data: any): any {
    try {
      const copy = JSON.parse(JSON.stringify(data))
      if (copy?.dashboard?.tenders && Array.isArray(copy.dashboard.tenders)) {
        copy.dashboard.tenders = copy.dashboard.tenders.map((t: any) => {
          const tCopy = { ...t }
          if (Array.isArray(tCopy.images)) {
            tCopy.images = tCopy.images.map((img: any) => ({
              name: img.name || 'Görsel',
              url: (typeof img.url === 'string' && img.url.length > 50000)
                ? 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'
                : img.url
            }))
          }
          if (typeof tCopy.image === 'string' && tCopy.image.length > 50000) {
            tCopy.image = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'
          }
          if (Array.isArray(tCopy.files)) {
            tCopy.files = tCopy.files.map((f: any) => ({
              name: f.name,
              size: f.size,
              type: f.type,
              progress: 100
            }))
          }
          return tCopy
        })
      }
      return copy
    } catch (e) {
      return data
    }
  }

  function saveCmsData(newData: typeof DEFAULT_CMS_DATA) {
    cmsDataRef.value = { ...newData }
    if (typeof window !== 'undefined') {
      const sanitized = sanitizeForStorage(newData)
      safeLocalStorageSet('cmsData', sanitized)
    }
  }

  function resetCmsData() {
    cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
    if (typeof window !== 'undefined') {
      safeLocalStorageSet('cmsData', DEFAULT_CMS_DATA)
      localStorage.removeItem('myTenders')
    }
  }

  return {
    cmsData: cmsDataRef,
    saveCmsData,
    resetCmsData
  }
}
