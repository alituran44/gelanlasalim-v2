import { ref } from 'vue'

// Default contents in English to use on first load or if localStorage is empty
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: "PRIVATE SECTOR'S LIVE REVERSE AUCTION ARENA",
    titleLine1: 'Start Tenders.',
    titleLine2: 'Get Bids.',
    titleItalic: "Let's Agree.",
    description: 'GelAnlaşalım digitalizes your e-tenders, bid collection, orders, and procurement workflows in a single platform. Reduce your costs, save time, and manage your procurement operations efficiently.',
    badgeStrip: [
      'KVKK & GDPR COMPLIANT',
      'DOCUMENT AUDIT & TIMESTAMP',
      'ENCRYPTED DATA TRANSMISSION',
      'FREE DURING LAUNCH PERIOD'
    ],
    heroVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  liveTender: {
    title: 'CNC Contract Manufacturing Batch',
    remainingTime: '02:21',
    bestBid: 396800,
    openingPrice: 412000,
    savingsText: 'SAVINGS 3.7%',
    competitors: [
      { name: 'Supplier #A47', price: 396800, leader: true },
      { name: 'Supplier #D08', price: 404500, leader: false }
    ]
  },
  pricing: {
    vatNotice: 'Prices are inclusive of 20% VAT.',
    disclaimer: 'This service is operated by GelAnlaşalım Bilişim A.Ş. Our company has no affiliation with EKAP or any public institution.',
    packages: [
      { id: '1_month', name: 'Membership Application - 1 Month', price: 90, months: 1 },
      { id: '3_months', name: 'Membership Application - 3 Months', price: 180, months: 3 },
      { id: '6_months', name: 'Membership Application - 6 Months', price: 270, months: 6 },
      { id: '9_months', name: 'Membership Application - 9 Months', price: 360, months: 9 }
    ],
    features: [
      [
        'Public tender search',
        'Tender results analysis',
        'Direct procurement deals',
        'Sales & leasing listings',
        'Legal compliance decisions',
        'Threshold value calculation'
      ],
      [
        'Smart search suggestions',
        'Upcoming tender alerts',
        'Awarded tender notifications',
        'Cancellation & result alerts',
        'Unlimited notifications (SMS+Email)',
        'Unlimited reporting (Excel)'
      ],
      [
        'Contractor analytics',
        'Authority analytics',
        'Sector analytics',
        'Competitor analytics',
        'Mobile responsive app'
      ]
    ]
  },
  faqs: [
    { q: "How does the reverse auction system work?", a: "The buyer opens a tender specifying quantities and technical specs. Verified suppliers compete in real time by lowering their bids before the clock expires." },
    { q: "How are companies verified on the platform?", a: "Tax registration, signature circulars, and trade registry documents are verified by our team. Only approved corporate accounts can open tenders and place bids." },
    { q: "Are payment and delivery processes secure?", a: "Yes. The buyer deposits funds into a secure account. Payment is released to the supplier only after inspection and approval." },
    { q: "Do buyers pay any commission fee?", a: "No. GelAnlaşalım is free for buyers." },
    { q: "Which industries can I open tenders in?", a: "Agriculture, construction, healthcare, technology, logistics, packaging, automotive, and all corporate procurement categories." }
  ],
  problems: [
    { title: "Specifications & bids remain scattered.", desc: "Separate forms sent to suppliers create chaos and miscommunication." },
    { title: "Price comparison is manual and error-prone.", desc: "Lost in endless Excel sheets, phone calls, and email threads." },
    { title: "Supplier qualification lacks verification.", desc: "Contracts made without thorough background checks increase business risks." }
  ],
  features: [
    { title: "Reverse Auction Arena", desc: "Live competitive price reductions instead of sealed bid envelopes." },
    { title: "Qualified Supplier Stream", desc: "Verified corporate company profiles with document checks." },
    { title: "Documented Bid Flow", desc: "Upload specifications and receive structured, comparable bids." },
    { title: "Detailed Analytics", desc: "Cost tracking, bid comparison, and decision exports." }
  ],
  trustStandards: [
    { title: "TLS 1.2+", subtitle: "ENCRYPTED DATA", desc: "HTTPS/SSL encryption for all data transmissions." },
    { title: "KVKK & GDPR", subtitle: "DATA PROTECTION", desc: "Strict compliance with international data privacy standards." },
    { title: "Audit Trail", subtitle: "TRANSACTION LOGS", desc: "Time-stamped logging for every action and bid." },
    { title: "EN · TR", subtitle: "MULTI-LANGUAGE", desc: "Full English and Turkish dual interface support." }
  ],
  stats: [
    { value: '$12.4M+', label: 'Total Trade Volume' },
    { value: '150+', label: 'Verified B2B Suppliers' },
    { value: '14.2%', label: 'Average Procurement Savings' },
    { value: '$0', label: 'Buyer Membership Fee' }
  ],
  videoGuides: [
    { title: 'How to Register?', desc: 'Step-by-step membership guide', videoUrl: '' },
    { title: 'How to Launch a Tender?', desc: 'Create your first reverse auction in minutes', videoUrl: '' },
    { title: 'How to Submit a Bid?', desc: 'Supplier bidding process step-by-step', videoUrl: '' },
    { title: 'Control Panel Guide', desc: 'Mastering the administrative dashboard', videoUrl: '' }
  ],
  dashboard: {
    tenders: [
      {
        id: 'IHC-2024-001',
        baslik: 'Corporate Office Supplies Procurement',
        kategori: 'Stationery & Office',
        sure: '2 days left',
        teklifSayisi: 7,
        durum: 'active',
        butce: '$4,500',
        olusturma: '14 Jul 2024'
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Security Camera System Installation',
        kategori: 'Technology & Software',
        sure: '5 days left',
        teklifSayisi: 12,
        durum: 'active',
        butce: '$18,000',
        olusturma: '12 Jul 2024'
      },
      {
        id: 'IHC-2024-003',
        baslik: 'Agricultural Irrigation Equipment',
        kategori: 'Agriculture & Food',
        sure: 'Ended',
        teklifSayisi: 4,
        durum: 'closed',
        butce: '$32,000',
        olusturma: '01 Jul 2024'
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Logistics Transport Service Procurement',
        kategori: 'Logistics & Freight',
        sure: '10 days left',
        teklifSayisi: 3,
        durum: 'active',
        butce: '$9,500',
        olusturma: '10 Jul 2024'
      }
    ],
    receivedBids: [
      {
        id: 'IHC-2024-001',
        baslik: 'Corporate Office Supplies Procurement',
        kategori: 'Stationery & Office',
        bitis: '16 Jul 2024',
        teklifler: [
          { id: 'TKF-001', firma: 'ABC Office Supplies Corp.', fiyat: '$3,850', sure: '7 days', puan: 4.8, durum: 'bekliyor' },
          { id: 'TKF-002', firma: 'Delta Stationery Ltd.', fiyat: '$4,120', sure: '5 days', puan: 4.2, durum: 'bekliyor' },
          { id: 'TKF-003', firma: 'OfficePro Logistics', fiyat: '$3,690', sure: '10 days', puan: 4.6, durum: 'onaylandi' }
        ]
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Security Camera System Installation',
        kategori: 'Technology & Software',
        bitis: '21 Jul 2024',
        teklifler: [
          { id: 'TKF-004', firma: 'SecureTech Systems', fiyat: '$16,200', sure: '14 days', puan: 4.9, durum: 'bekliyor' },
          { id: 'TKF-005', firma: 'Camera World Inc.', fiyat: '$17,500', sure: '7 days', puan: 4.1, durum: 'bekliyor' }
        ]
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Logistics Transport Service Procurement',
        kategori: 'Logistics & Freight',
        bitis: '26 Jul 2024',
        teklifler: [
          { id: 'TKF-006', firma: 'FastFreight Express Ltd.', fiyat: '$8,800', sure: '30 days', puan: 4.7, durum: 'bekliyor' }
        ]
      }
    ],
    submittedBids: [
      {
        id: 'TKF-008',
        ilanBaslik: 'Software Development & API Services',
        aliciFirma: '****** Inc.',
        kategori: 'Technology & Software',
        teklifFiyatim: '$9,500',
        sure: '45 days',
        durum: 'bekliyor',
        tarih: '14 Jul 2024',
        bitisTarihi: '20 Jul 2024',
        notum: 'Can reduce delivery timeframe to 30 days.'
      },
      {
        id: 'TKF-009',
        ilanBaslik: 'Agricultural Fertilizer Supply',
        aliciFirma: '****** Ltd.',
        kategori: 'Agriculture & Food',
        teklifFiyatim: '$21,000',
        sure: '14 days',
        durum: 'onaylandi',
        tarih: '10 Jul 2024',
        bitisTarihi: '18 Jul 2024',
        notum: 'ISO certified products. Samples available on request.'
      },
      {
        id: 'TKF-010',
        ilanBaslik: 'Executive Office Furniture Supply',
        aliciFirma: '****** Group',
        kategori: 'Stationery & Office',
        teklifFiyatim: '$7,850',
        sure: '21 days',
        durum: 'reddedildi',
        tarih: '08 Jul 2024',
        bitisTarihi: '15 Jul 2024',
        notum: ''
      }
    ]
  },
  contact: {
    address: 'Bahçelievler Neighborhood 5083 Street, No:11/A Altıeylül, Balıkesir, Turkey',
    email: 'info@gelanlasalim.com',
    kep: 'gelanlasalim@hs01.kep.tr',
    workHoursWeekdays: 'Monday - Friday: 09:00 - 18:00',
    workHoursSaturday: 'Saturday: 10:00 - 14:00'
  },
  payments: [
    {
      id: 'ORD-894210',
      referenceCode: 'GA-9B432',
      userName: 'John Doe',
      companyName: 'Express Logistics Inc.',
      packageName: 'Professional Plan',
      amount: '$960',
      paymentMethod: 'Bank Transfer/Wire',
      status: 'pending',
      date: '17 July 2026'
    },
    {
      id: 'ORD-761234',
      referenceCode: '-',
      userName: 'Elif Smith',
      companyName: 'Kaya Architecture Ltd.',
      packageName: 'Enterprise Plan',
      amount: '$1,800',
      paymentMethod: 'PayTR / Credit Card',
      status: 'approved',
      date: '16 July 2026'
    }
  ]
}

export function useCmsData() {
  const cmsData = ref({ ...DEFAULT_CMS_DATA })

  // Initialize and load data on client side
  if (typeof window !== 'undefined') {
    // Force English locale default and reset CMS data to English
    localStorage.setItem('user_locale', 'en')
    localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    cmsData.value = { ...DEFAULT_CMS_DATA }
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
