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
    ]
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
  }
}

export function useCmsData() {
  const cmsData = ref(DEFAULT_CMS_DATA)

  // Initialize and load data on client side
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cmsData')
    if (saved) {
      try {
        cmsData.value = JSON.parse(saved)
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
