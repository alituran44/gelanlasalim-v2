import { ref } from 'vue'

// Default contents in Turkish for authentic local B2B portal experience
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
    title: 'CNC Fason Üretim İş Emri Serisi',
    remainingTime: '02:21',
    bestBid: 396800,
    openingPrice: 412000,
    savingsText: 'TASARRUF %3.7',
    competitors: [
      { name: 'Tedarikçi #A47', price: 396800, leader: true },
      { name: 'Tedarikçi #D08', price: 404500, leader: false }
    ]
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
    { value: '12.4M ₺+', label: 'Toplam Ticaret Hacmi' },
    { value: '150+', label: 'Doğrulanmış B2B Üretici' },
    { value: '%14.2', label: 'Ortalama Tedarik Tasarrufu' },
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
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 1 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın. Kullanıcılara 1 ay ücretsiz deneme, ihale açma, teklif verme, ihale ve satın alma konularında yardımcı ol.'
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
    templates: [
      {
        id: 'trial-welcome',
        name: '🎉 1 Ay Ücretsiz Lansman Hoş Geldin & Aktivasyon',
        subject: 'İhaleciBurada.com: 1 Aylık %100 Ücretsiz Lansman Deneme Paketiniz Aktif!',
        content: `Sayın Yetkili,\n\nİhaleciBurada B2B İhale ve Satın Alma ve Satın Alma Platformu'na hoş geldiniz!\n\nLansmanımıza özel olarak tanımlanan 1 Aylık %100 Ücretsiz Kurumsal Deneme Paketiniz başarıyla aktifleştirildi.\n\n✓ 1 Ay Boyunca 0 ₺ Ücret (Kredi Kartı Gerekmez)\n✓ Sınırsız İhale Açma & Canlı Tersine Eksiltme\n✓ Doğrulanmış Kurumsal Firmalardan Belgeli Teklif Toplama\n✓ Geçerlilik Bitiş Tarihi: 25 Eylül 2026\n\nPanele gitmek ve ilk ihalenizi oluşturmak için: https://gelanlasalim-v2.vercel.app/panel\n\nSaygılarımızla,\nİhaleciBurada Müşteri Başarı Ekibi\nihalecib@gmail.com | 0850 840 86 95`
      },
      {
        id: 'new-tender',
        name: '📢 Yeni İhale Yayınlandı Bildirimi',
        subject: 'Yeni İhale Yayında: Sektörünüze Uygun Yeni Bir Satın Alma İlanı Açıldı',
        content: `Sayın Tedarikçimiz,\n\nFaaliyet alanınıza uygun yeni bir B2B satın alma ihalesi yayına alınmıştır.\n\nİhale Başlığı: [İhale Başlığı]\nKategori: [Sektör / Kategori]\nKalan Süre: [Kalan Süre]\n\nŞartnameyi incelemek ve teklifinizi iletmek için hemen tıklayın:\nhttps://gelanlasalim-v2.vercel.app/panel/gelen-teklifler\n\nİhaleciBurada B2B Operasyon Merkezi\nihalecib@gmail.com`
      },
      {
        id: 'live-auction',
        name: '⚡ Canlı Tersine Eksiltme Başladı & Teklif Uyarısı',
        subject: 'İhale ve Satın Alma Başladı: İhalede Fiyatlar Düşüyor!',
        content: `Sayın İhale Katılımcısı,\n\nKayıt olduğunuz ihalenin CANLI TERSİNE EKSİLTME (Canlı Pazarlık) seansı başlamıştır.\n\nAnlık Lider Teklif: [Lider Fiyat]\nKalan Süre: [Süre]\n\nCanlı odaya bağlanmak ve yeni teklifinizi vermek için:\nhttps://gelanlasalim-v2.vercel.app/panel/canli-etkinlikler\n\nBol kazançlı ihaleler dileriz,\nİhaleciBurada.com`
      },
      {
        id: 'kyc-approved',
        name: '🛡️ Kurumsal Firma Doğrulama & KYC Onayı',
        subject: 'Firma Belgeleriniz Doğrulandı — Mavi Rozetiniz Aktif!',
        content: `Tebrikler!\n\nYüklemiş olduğunuz vergi levhası ve ticaret sicil belgeleri uzmanlarımız tarafından incelenmiş ve onaylanmıştır.\n\nProfilinize 'DOĞRULANMIŞ KURUMSAL ÜRETİCİ / ALICI' mavi rozeti eklenmiştir.\n\nİhaleciBurada Güvenlik ve Uyumluluk Departmanı\nihalecib@gmail.com`
      },
      {
        id: 'weekly-digest',
        name: '📊 Haftalık B2B İhale ve Tasarruf Bülteni',
        subject: 'Haftalık B2B Tedarik Özeti: 12.4M ₺ Hacim ve Öne Çıkan İhaleler',
        content: `Bu hafta İhaleciBurada'da gerçekleşen öne çıkan ihaleler ve ortalama %14.2 tasarruf fırsatları bülteninizde!\n\nAktif İhale Sayısı: 48+\nTamamlanan İşlem Hacmi: 12.4M ₺+\n\nTüm güncel fırsatları listelemek için: https://gelanlasalim-v2.vercel.app/pazar-yeri\n\nİhaleciBurada B2B Bülten\nihalecib@gmail.com`
      }
    ]
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
    maintenanceNotice: 'Platformumuzda planlı altyapı güçlendirme çalışması yapılmaktadır. Sistem en kısa sürede tekrar aktif olacaktır.',
    metaTitle: 'İhaleciBurada.com | Türkiye’nin Öncü B2B İhale ve Satın Alma & Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, canlı tersine eksiltme ile rekabetçi teklifler toplayın, kurumsal tedarik maliyetlerinizi %14.2 düşürün.',
    announcementTicker: '⚡ LANSMANA ÖZEL: Tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi! Kredi kartı gerekmez, 0 ₺ bedelsiz anında aktivasyon.',
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

export function useCmsData() {
  // Initialize and load data on client side once
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true
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

        // Clean out legacy mock dummy data if present
        if (Array.isArray(parsed.payments)) {
          parsed.payments = parsed.payments.filter((p: any) => !['ORD-894210', 'ORD-761234'].includes(p.id))
        }
        if (parsed.crmSettings && Array.isArray(parsed.crmSettings.leads)) {
          parsed.crmSettings.leads = parsed.crmSettings.leads.filter((l: any) => !['Kalyon Tedarik Ltd.', 'Anadolu Lojistik A.Ş.', 'Mega Ambalaj Sanayi'].includes(l.companyName))
        }
        if (parsed.emailSettings && Array.isArray(parsed.emailSettings.subscribers)) {
          parsed.emailSettings.subscribers = parsed.emailSettings.subscribers.filter((s: any) => !['info@kalyon.com', 'satinalma@anadolu.com', 'kurumsal@megaambalaj.com'].includes(s.email))
        }
        if (Array.isArray(parsed.kycVerifications)) {
          parsed.kycVerifications = parsed.kycVerifications.filter((k: any) => !['KYC-8921', 'KYC-7412', 'KYC-6320', 'KYC-5109'].includes(k.id))
        }
        if (Array.isArray(parsed.liveAuctionRooms)) {
          parsed.liveAuctionRooms = parsed.liveAuctionRooms.filter((r: any) => !['ROOM-101', 'ROOM-102', 'ROOM-103'].includes(r.id))
        }
        if (Array.isArray(parsed.escrowOrders)) {
          parsed.escrowOrders = parsed.escrowOrders.filter((e: any) => !['ESC-9041', 'ESC-8930', 'ESC-7721'].includes(e.id))
        }
        if (Array.isArray(parsed.auditLogs)) {
          parsed.auditLogs = parsed.auditLogs.filter((a: any) => !['LOG-9912', 'LOG-9911', 'LOG-9910', 'LOG-9909', 'LOG-9908'].includes(a.id))
        }

        // Synchronize any created user tenders from 'myTenders'
        try {
          const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
          if (Array.isArray(myTenders)) {
            myTenders.forEach((mt: any) => {
              const exists = parsed.dashboard.tenders.some((t: any) => t.id === mt.id)
              if (!exists) {
                parsed.dashboard.tenders.unshift(mt)
              }
            })
          }
        } catch (e) {}

        cmsDataRef.value = parsed
        localStorage.setItem('cmsData', JSON.stringify(parsed))
      } catch (e) {
        cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
        localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
      }
    } else {
      // First run: save clean DEFAULT_CMS_DATA
      cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  function saveCmsData(newData: typeof DEFAULT_CMS_DATA) {
    cmsDataRef.value = { ...newData }
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(newData))
    }
  }

  function resetCmsData() {
    cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  return {
    cmsData: cmsDataRef,
    saveCmsData,
    resetCmsData
  }
}

