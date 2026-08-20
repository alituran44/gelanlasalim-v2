import { ref } from 'vue'

// Default contents in Turkish for authentic local B2B portal experience
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: "ÖZEL SEKTÖRÜN CANLI TERS İHALE VE PAZARLIK ARENASI",
    titleLine1: 'İhale Aç.',
    titleLine2: 'Teklif Topla.',
    titleItalic: "İhaleci Burada.",
    description: 'İhaleciBurada.com; e-ihale, canlı eksiltme, teklif toplama ve doğrudan fiyat pazarlığı süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, rekabetçi tekliflerle tasarruf edin.',
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
    { title: 'Nasıl İhale Açılır?', desc: 'İlk canlı eksiltme ihalenizi dakikalar içinde başlatın', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak canlı eksiltmeye katılma rehberi', videoUrl: '' },
    { title: 'Yönetim Paneli Rehberi', desc: 'Kontrol panelini ve raporlamaları etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [
      {
        id: 'IHC-2024-001',
        baslik: 'Kurumsal Ofis Malzemeleri Alımı',
        kategori: 'Kırtasiye & Ofis',
        sure: '2 gün kaldı',
        teklifSayisi: 7,
        durum: 'active',
        butce: '45.000 ₺',
        olusturma: '14 Tem 2024'
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamerası Sistemi Kurulumu',
        kategori: 'Teknoloji & Yazılım',
        sure: '5 gün kaldı',
        teklifSayisi: 12,
        durum: 'active',
        butce: '180.000 ₺',
        olusturma: '12 Tem 2024'
      },
      {
        id: 'IHC-2024-003',
        baslik: 'Tarımsal Sulama Ekipmanları Alımı',
        kategori: 'Tarım & Gıda',
        sure: 'Tamamlandı',
        teklifSayisi: 4,
        durum: 'closed',
        butce: '320.000 ₺',
        olusturma: '01 Tem 2024'
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Lojistik Taşımacılık Hizmeti Alımı',
        kategori: 'Lojistik & Taşımacılık',
        sure: '10 gün kaldı',
        teklifSayisi: 3,
        durum: 'active',
        butce: '95.000 ₺',
        olusturma: '10 Tem 2024'
      }
    ],
    receivedBids: [
      {
        id: 'IHC-2024-001',
        baslik: 'Kurumsal Ofis Malzemeleri Alımı',
        kategori: 'Kırtasiye & Ofis',
        bitis: '16 Tem 2024',
        teklifler: [
          { id: 'TKF-001', firma: 'ABC Kırtasiye A.Ş.', fiyat: '38.500 ₺', sure: '7 gün', puan: 4.8, durum: 'bekliyor' },
          { id: 'TKF-002', firma: 'Delta Ofis Ltd.', fiyat: '41.200 ₺', sure: '5 gün', puan: 4.2, durum: 'bekliyor' },
          { id: 'TKF-003', firma: 'OfisPro Lojistik', fiyat: '36.900 ₺', sure: '10 gün', puan: 4.6, durum: 'onaylandi' }
        ]
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamerası Sistemi Kurulumu',
        kategori: 'Teknoloji & Yazılım',
        bitis: '21 Tem 2024',
        teklifler: [
          { id: 'TKF-004', firma: 'SecureTek Sistemleri', fiyat: '162.000 ₺', sure: '14 gün', puan: 4.9, durum: 'bekliyor' },
          { id: 'TKF-005', firma: 'Kamera Dünyası A.Ş.', fiyat: '175.000 ₺', sure: '7 gün', puan: 4.1, durum: 'bekliyor' }
        ]
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Lojistik Taşımacılık Hizmeti Alımı',
        kategori: 'Lojistik & Taşımacılık',
        bitis: '26 Tem 2024',
        teklifler: [
          { id: 'TKF-006', firma: 'Hızlı Kargo Lojistik Ltd.', fiyat: '88.000 ₺', sure: '30 gün', puan: 4.7, durum: 'bekliyor' }
        ]
      }
    ],
    submittedBids: [
      {
        id: 'TKF-008',
        ilanBaslik: 'Yazılım Geliştirme & API Hizmetleri',
        aliciFirma: '****** A.Ş.',
        kategori: 'Teknoloji & Yazılım',
        teklifFiyatim: '95.000 ₺',
        sure: '45 gün',
        durum: 'bekliyor',
        tarih: '14 Tem 2024',
        bitisTarihi: '20 Tem 2024',
        notum: 'Teslimat süresini 30 güne düşürebiliriz.'
      },
      {
        id: 'TKF-009',
        ilanBaslik: 'Tarımsal Gübre Tedariki',
        aliciFirma: '****** Ltd.',
        kategori: 'Tarım & Gıda',
        teklifFiyatim: '210.000 ₺',
        sure: '14 gün',
        durum: 'onaylandi',
        tarih: '10 Tem 2024',
        bitisTarihi: '18 Tem 2024',
        notum: 'ISO sertifikalı ürünler. Numune gönderilebilir.'
      },
      {
        id: 'TKF-010',
        ilanBaslik: 'Yönetici Ofis Mobilyaları Alımı',
        aliciFirma: '****** Grup',
        kategori: 'Kırtasiye & Ofis',
        teklifFiyatim: '78.500 ₺',
        sure: '21 gün',
        durum: 'reddedildi',
        tarih: '08 Tem 2024',
        bitisTarihi: '15 Tem 2024',
        notum: ''
      }
    ]
  },
  contact: {
    address: 'Bahçelievler Mahallesi 5083 Sokak, No:11/A Altıeylül, Balıkesir, Türkiye',
    email: 'info@ihaleciburada.com',
    kep: 'ihaleciburada@hs01.kep.tr',
    workHoursWeekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
    workHoursSaturday: 'Cumartesi: 10:00 - 14:00'
  },
  payments: [
    {
      id: 'ORD-894210',
      referenceCode: 'GA-9B432',
      userName: 'Ahmet Yılmaz',
      companyName: 'Ekspres Lojistik A.Ş.',
      packageName: 'Profesyonel Üyelik Planı',
      amount: '960 ₺',
      paymentMethod: 'Banka Havalesi / EFT',
      status: 'pending',
      date: '17 Temmuz 2026'
    },
    {
      id: 'ORD-761234',
      referenceCode: '-',
      userName: 'Elif Kaya',
      companyName: 'Kaya Mimarlık Ltd.',
      packageName: 'Kurumsal Enterprise Plan',
      amount: '1.800 ₺',
      paymentMethod: 'PayTR / Kredi Kartı',
      status: 'approved',
      date: '16 Temmuz 2026'
    }
  ]
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
        const str = saved.toLowerCase()
        // If saved data contains any legacy English or outdated schema, purge and overwrite with pure Turkish default
        if (str.includes('how does') || str.includes('private sector') || str.includes('construction') || str.includes('procurement') || str.includes('technology') || str.includes('electronics')) {
          cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
          localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
        } else {
          cmsDataRef.value = JSON.parse(saved)
        }
      } catch (e) {
        cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
        localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
      }
    } else {
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
