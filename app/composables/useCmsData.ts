import { ref } from 'vue'

// Default contents to use on first load or if localStorage is empty
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: 'ÖZEL SEKTÖRÜN CANLI TERS İHALE ARENASI',
    titleLine1: 'ihale Ver.',
    titleLine2: 'Teklif Al.',
    titleItalic: 'Gel Anlaşalım.',
    description: 'GelAnlaşalım; e-ihale, teklif toplama, sipariş ve tedarik süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, zamandan tasarruf edin ve satın alma operasyonlarınızı daha verimli yönetin.',
    badgeStrip: [
      'KVKK KAPSAMINDA',
      'BELGE İZİ & ZAMAN DAMGASI',
      'ŞİFRELİ VERİ AKTARIMI',
      'LANSMAN DÖNEMİNDE ÜCRETSİZ'
    ],
    heroVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  liveTender: {
    title: 'CNC Fason Üretim Partisi',
    remainingTime: '02:21',
    bestBid: 396800,
    openingPrice: 412000,
    savingsText: 'TASARRUF %3,7',
    competitors: [
      { name: 'Tedarikçi #A47', price: 396800, leader: true },
      { name: 'Tedarikçi #D08', price: 404500, leader: false }
    ]
  },
  pricing: {
    vatNotice: 'Fiyatlara %20 KDV dahildir.',
    disclaimer: 'Bu hizmet GelAnlaşalım Bilişim A.Ş. tarafından sunulmaktadır. Şirketimizin Kamu İhale Kurumu (EKAP) veya başka bir kamu kurumu ile herhangi bir bağlantısı bulunmamaktadır.',
    packages: [
      { id: '1_ay', name: 'Üyelik başvurusu - 1 ay', price: 900, months: 1 },
      { id: '3_ay', name: 'Üyelik başvurusu - 3 ay', price: 1800, months: 3 },
      { id: '6_ay', name: 'Üyelik başvurusu - 6 ay', price: 2700, months: 6 },
      { id: '9_ay', name: 'Üyelik başvurusu - 9 ay', price: 3600, months: 9 }
    ],
    features: [
      [
        'Ekap ihaleleri',
        'Ekap ihale sonuçları',
        'Doğrudan teminler',
        'Satış ve Kiralamalar',
        'KİK Kararları',
        'Sınır değer hesaplama'
      ],
      [
        'Arama önerileri',
        'Yaklaşan ihale bildirimleri',
        'Kazanılan ihale bildirimleri',
        'İptal-Düzeltme-Sonuç bildirimleri',
        'Sınırsız bildirim (Sms+Email)',
        'Sınırsız raporlama (Excel)'
      ],
      [
        'Yüklenici analizleri',
        'İdare analizleri',
        'Sektör analizleri',
        'Rakip analizleri',
        'Mobil uyumluluk'
      ]
    ]
  },
  faqs: [
    { q: "Tersine ihale (eksiltme) sistemi nasıl çalışır?", a: "Alıcı firma satın almak istediği ürün veya hizmet için şartname ve bütçesini belirler. Tedarikçiler canlı sürede teklif vererek fiyat eksiltir; en uygun teklif sahibi ihaleyi kazanır." },
    { q: "Firmaların doğrulanması nasıl sağlanıyor?", a: "Platforma üye olan her şirketin vergi kimlik numarası, MERSİS/KEP adresleri ve kurumsal belgeleri kontrol edilerek 'Onaylı Üye' rozeti tanımlanır." },
    { q: "Ödeme ve teslimat süreçleri güvenli mi?", a: "Evet. Alıcı ihale bedelini güvenli hesaba yatırır. Teslimat onaylandıktan sonra ödeme tedarikçiye aktarılır." },
    { q: "Alıcı olarak komisyon ödemem gerekiyor mu?", a: "Hayır. GelAnlaşalım platformunda alıcı şirketler için üyelik ve ihale açma tamamen ücretsizdir." },
    { q: "Hangi sektörlerde ihale açabilirim?", a: "İnşaat, teknoloji, lojistik, tarım, ambalaj, medikal, otomotiv ve tüm kurumsal tedarik alanlarında ihale açabilirsiniz." }
  ],
  problems: [
    { title: "Şartname ve teklif penceresi herkes için ayrı zeminde kalır.", desc: "Tedarikçilere ayrı e-postalar gönderilmesi karmaşaya neden olur." },
    { title: "Fiyat kıyaslaması manuel ve hataya açıktır.", desc: "Excel tabloları ve e-posta zincirlerinde zaman kaybolur." },
    { title: "Tedarikçi kalifikasyonu belgesizdir.", desc: "Referans ve belge kontrolü yapılmadan anlaşma riski doğar." }
  ],
  features: [
    { title: "Ters İhale Sistemi", desc: "Kapalı zarf yerine canlı fiyatta rekabetçi eksiltme arenası." },
    { title: "Nitelikli Tedarikçi Akışı", desc: "Vergi ve belge onaylı kurumsal firma profilleri." },
    { title: "Belgeli Teklif Akışı", desc: "Şartname yükleme ve standart formatta teklif alma." },
    { title: "Detaylı Analitik", desc: "Maliyet takibi, teklif kıyaslama ve karar raporları." }
  ],
  trustStandards: [
    { title: "TLS 1.2+", subtitle: "ŞİFRELİ İLETİŞİM", desc: "HTTPS/SSL ile şifreli veri iletimi." },
    { title: "KVKK", subtitle: "KİŞİSEL VERİ KORUMA", desc: "6698 sayılı kanuna tam uyumluluk." },
    { title: "Kayıt İzi", subtitle: "İŞLEM GÜNLÜKLERİ", desc: "Her işlem zaman damgalı günlüklerde saklanır." },
    { title: "TR · EN", subtitle: "ÇOK DİL DESTEĞİ", desc: "Türkçe ve İngilizce tam arayüz desteği." }
  ],
  stats: [
    { value: '12.4M ₺+', label: 'Toplam Ticaret Hacmi' },
    { value: '150+', label: 'Doğrulanmış B2B Üretici' },
    { value: '%14.2', label: 'Ortalama Tedarik Tasarrufu' },
    { value: '0 ₺', label: 'Alıcı Üyelik Komisyonu' }
  ],
  videoGuides: [
    { title: 'Nasıl Kayıt Olunur?', desc: 'Adım adım üyelik rehberi', videoUrl: '' },
    { title: 'Nasıl İhale Açılır?', desc: 'İlk ihalenizi dakikalar içinde oluşturun', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak teklif verme süreci', videoUrl: '' },
    { title: 'Yönetim Paneli', desc: 'Kontrol panelini etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [
      {
        id: 'IHC-2024-001',
        baslik: 'Ofis Malzemeleri Alımı',
        kategori: 'Kırtasiye & Ofis',
        sure: '2 gün',
        teklifSayisi: 7,
        durum: 'active',
        butce: '₺45.000',
        olusturma: '14 Tem 2024'
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamera Sistemi',
        kategori: 'Teknoloji & Yazılım',
        sure: '5 gün',
        teklifSayisi: 12,
        durum: 'active',
        butce: '₺180.000',
        olusturma: '12 Tem 2024'
      },
      {
        id: 'IHC-2024-003',
        baslik: 'Tarımsal Sulama Ekipmanı',
        kategori: 'Tarım & Gıda',
        sure: 'Sona erdi',
        teklifSayisi: 4,
        durum: 'closed',
        butce: '₺320.000',
        olusturma: '01 Tem 2024'
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Lojistik Hizmet Alımı',
        kategori: 'Lojistik & Nakliye',
        sure: '10 gün',
        teklifSayisi: 3,
        durum: 'active',
        butce: '₺95.000',
        olusturma: '10 Tem 2024'
      }
    ],
    receivedBids: [
      {
        id: 'IHC-2024-001',
        baslik: 'Ofis Malzemeleri Alımı',
        kategori: 'Kırtasiye & Ofis',
        bitis: '16 Tem 2024',
        teklifler: [
          { id: 'TKF-001', firma: 'ABC Ofis Malzemeleri A.Ş.', fiyat: '₺38.500', sure: '7 gün', puan: 4.8, durum: 'bekliyor' },
          { id: 'TKF-002', firma: 'Delta Kırtasiye Ltd.', fiyat: '₺41.200', sure: '5 gün', puan: 4.2, durum: 'bekliyor' },
          { id: 'TKF-003', firma: 'OfficePro Tedarik', fiyat: '₺36.900', sure: '10 gün', puan: 4.6, durum: 'onaylandi' }
        ]
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamera Sistemi',
        kategori: 'Teknoloji & Yazılım',
        bitis: '21 Tem 2024',
        teklifler: [
          { id: 'TKF-004', firma: 'SecureTech Sistemleri', fiyat: '₺162.000', sure: '14 gün', puan: 4.9, durum: 'bekliyor' },
          { id: 'TKF-005', firma: 'Kamera Dünyası A.Ş.', fiyat: '₺175.000', sure: '7 gün', puan: 4.1, durum: 'bekliyor' }
        ]
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Lojistik Hizmet Alımı',
        kategori: 'Lojistik & Nakliye',
        bitis: '26 Tem 2024',
        teklifler: [
          { id: 'TKF-006', firma: 'HızlıNakliye Ltd.', fiyat: '₺88.000', sure: '30 gün', puan: 4.7, durum: 'bekliyor' }
        ]
      }
    ],
    submittedBids: [
      {
        id: 'TKF-008',
        ilanBaslik: 'Yazılım Geliştirme Hizmeti',
        aliciFirma: '****** A.Ş.',
        kategori: 'Teknoloji & Yazılım',
        teklifFiyatim: '₺95.000',
        sure: '45 gün',
        durum: 'bekliyor',
        tarih: '14 Tem 2024',
        bitisTarihi: '20 Tem 2024',
        notum: 'Teslim süresini 30 güne indirebilirim.'
      },
      {
        id: 'TKF-009',
        ilanBaslik: 'Tarımsal Gübre Tedariki',
        aliciFirma: '****** Ltd.',
        kategori: 'Tarım & Gıda',
        teklifFiyatim: '₺210.000',
        sure: '14 gün',
        durum: 'onaylandi',
        tarih: '10 Tem 2024',
        bitisTarihi: '18 Tem 2024',
        notum: 'ISO belgeli ürünler. Numune gönderebilirim.'
      },
      {
        id: 'TKF-010',
        ilanBaslik: 'Ofis Mobilyası Alımı',
        aliciFirma: '****** Grup',
        kategori: 'Kırtasiye & Ofis',
        teklifFiyatim: '₺78.500',
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
    email: 'info@gelanlasalim.com',
    kep: 'gelanlasalim@hs01.kep.tr',
    workHoursWeekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
    workHoursSaturday: 'Cumartesi: 10:00 - 14:00'
  },
  payments: [
    {
      id: 'ORD-894210',
      referenceCode: 'GA-9B432',
      userName: 'Ahmet Yılmaz',
      companyName: 'Yılmaz Lojistik A.Ş.',
      packageName: 'Profesyonel',
      amount: '₺9.600',
      paymentMethod: 'Havale/EFT',
      status: 'bekliyor',
      date: '17 Temmuz 2026'
    },
    {
      id: 'ORD-761234',
      referenceCode: '-',
      userName: 'Elif Kaya',
      companyName: 'Kaya Mimarlık Ltd. Şti.',
      packageName: 'Kurumsal',
      amount: '₺18.000',
      paymentMethod: 'PayTR',
      status: 'onaylandi',
      date: '16 Temmuz 2026'
    }
  ]
}

export function useCmsData() {
  const cmsData = ref({ ...DEFAULT_CMS_DATA })

  // Initialize and load data on client side
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cmsData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const merged = {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          faqs: (parsed && Array.isArray(parsed.faqs) && parsed.faqs.length > 0) ? parsed.faqs : DEFAULT_CMS_DATA.faqs,
          problems: (parsed && Array.isArray(parsed.problems) && parsed.problems.length > 0) ? parsed.problems : DEFAULT_CMS_DATA.problems,
          features: (parsed && Array.isArray(parsed.features) && parsed.features.length > 0) ? parsed.features : DEFAULT_CMS_DATA.features,
          trustStandards: (parsed && Array.isArray(parsed.trustStandards) && parsed.trustStandards.length > 0) ? parsed.trustStandards : DEFAULT_CMS_DATA.trustStandards,
          stats: (parsed && Array.isArray(parsed.stats) && parsed.stats.length > 0) ? parsed.stats : DEFAULT_CMS_DATA.stats,
          videoGuides: (parsed && Array.isArray(parsed.videoGuides) && parsed.videoGuides.length > 0) ? parsed.videoGuides : DEFAULT_CMS_DATA.videoGuides,
          hero: { ...DEFAULT_CMS_DATA.hero, ...((parsed && parsed.hero) || {}) },
          dashboard: { ...DEFAULT_CMS_DATA.dashboard, ...((parsed && parsed.dashboard) || {}) },
          contact: { ...DEFAULT_CMS_DATA.contact, ...((parsed && parsed.contact) || {}) },
          payments: (parsed && Array.isArray(parsed.payments) && parsed.payments.length > 0) ? parsed.payments : DEFAULT_CMS_DATA.payments
        }
        localStorage.setItem('cmsData', JSON.stringify(merged))
        cmsData.value = merged
      } catch (e) {
        console.error('Failed to parse saved CMS data, using defaults.', e)
        cmsData.value = { ...DEFAULT_CMS_DATA }
      }
    } else {
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  function saveCmsData(newData: typeof DEFAULT_CMS_DATA) {
    cmsData.value = { ...newData }
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(newData))
    }
  }

  function resetCmsData() {
    cmsData.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  return {
    cmsData,
    saveCmsData,
    resetCmsData
  }
}
