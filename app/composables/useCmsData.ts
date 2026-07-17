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
  }
}

export function useCmsData() {
  const cmsData = ref(DEFAULT_CMS_DATA)

  // Initialize and load data on client side
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cmsData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Ensure backward compatibility if dashboard property is missing in old localstorage
        if (!parsed.dashboard) {
          parsed.dashboard = DEFAULT_CMS_DATA.dashboard
        }
        if (!parsed.contact) {
          parsed.contact = DEFAULT_CMS_DATA.contact
        }
        // Migrate blocked third-party video URL or local big file to CDN video
        if (parsed.hero && parsed.hero.heroVideoUrl && (parsed.hero.heroVideoUrl.includes('mixkit.co') || parsed.hero.heroVideoUrl === '/hero_video.mp4')) {
          parsed.hero.heroVideoUrl = DEFAULT_CMS_DATA.hero.heroVideoUrl
        }
        localStorage.setItem('cmsData', JSON.stringify(parsed))
        cmsData.value = parsed
      } catch (e) {
        console.error('Failed to parse saved CMS data, using defaults.', e)
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
