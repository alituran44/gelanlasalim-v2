// Shared server-side store for tenders to synchronize across all devices and browsers
import fs from 'node:fs'
import path from 'node:path'

export type TenderStatus = 
  | 'DRAFT' 
  | 'APPROVAL_PENDING' 
  | 'SCHEDULED' 
  | 'LIVE' 
  | 'SUSPENDED' 
  | 'CLOSED' 
  | 'EVALUATION' 
  | 'PROVISIONAL_RESULT' 
  | 'FINAL_APPROVAL_PENDING' 
  | 'FINALIZED' 
  | 'UNSUCCESSFUL' 
  | 'CANCELLED'

export type TenderReasonCode =
  | 'NO_BIDS'
  | 'INSUFFICIENT_BIDS'
  | 'ALL_TECHNICALLY_REJECTED'
  | 'ALL_COMMERCIALLY_REJECTED'
  | 'RESERVE_NOT_MET'
  | 'BUDGET_EXCEEDED'
  | 'WINNER_WITHDREW'
  | 'NEED_CANCELLED'
  | 'SPECIFICATION_ERROR'
  | 'SCOPE_CHANGED'
  | 'SYSTEM_ISSUE'
  | 'BUSINESS_DECISION'
  | 'OTHER'

export interface TenderItemSpec {
  id: string
  lotNo?: number
  ad: string
  miktar: number
  birim: string
  teknikAciklama?: string
  kazananFirma?: string
  kazananFiyat?: string
}

export interface TenderLot {
  lotNo: number
  baslik: string
  aciklama?: string
  kalemler: TenderItemSpec[]
  kazananFirma?: string
  kazananFiyat?: string
}

export interface TenderItem {
  id: string
  baslik: string
  aciklama?: string
  kategori?: string
  categoryId?: number
  mainCategory?: string
  subCategory?: string
  city?: string
  ownerCompany?: string
  ownerEmail?: string
  authority?: string
  butce?: string
  sure?: string
  durum?: string
  statusCode?: TenderStatus
  reasonCode?: TenderReasonCode
  reasonNote?: string
  awardMode?: 'ALL_OR_NOTHING' | 'LOT_BASED' | 'ITEM_BASED'
  kalemler?: TenderItemSpec[]
  lotlar?: TenderLot[]
  currency?: 'TRY' | 'USD' | 'EUR'
  vatType?: 'vat_included' | 'vat_excluded'
  deliveryLocation?: string
  deliveryDuration?: string
  paymentTerms?: string
  startPrice?: number
  reservePrice?: number
  minStep?: number
  requiresParticipationApproval?: boolean
  minBidsCount?: number
  specVersion?: number
  parentTenderId?: string
  specHistory?: Array<{
    version: number
    changedAt: string
    changedBy: string
    changeNote: string
  }>
  ihaleYonu?: string
  tur?: string
  usul?: string
  teklifSayisi?: number
  liderTeklif?: string
  adminApproved?: boolean
  aiApproved?: boolean
  aiScore?: number
  olusturma?: string
  startDate?: string
  endDate?: string
  extensionCount?: number
  totalExtendedMinutes?: number
  antiSnipingActive?: boolean
  lastExtendedAt?: string
  isBaseline?: boolean
  websiteUrl?: string
  ownerPhone?: string
  isIlan?: boolean
  [key: string]: any
}

export const BASELINE_TENDERS: TenderItem[] = [
  {
    id: 'IHC-2026-101',
    baslik: 'Bodrum Yalıkavak 2.500 m² Lüks Villa Sitesi Peyzaj ve Otomatik Sulama Projesi',
    aciklama: 'Bodrum Yalıkavak sırtlarında bulunan 8 villalık site projemizin 2.500 m² ortak ve özel bahçe alanları için peyzaj mimarlığı projelendirme, rulo çim serme, ithal palmiye dikimi, Hunter marka otomatik damlama ve rotor sulama altyapısı montajı yapılacaktır. Detaylı teknik projeler ve keşif metrajları için web sayfamızı ziyaret edebilir veya doğrudan iletişime geçebilirsiniz.',
    kategori: 'Peyzaj, Çevre Düzenleme ve Bahçe / Peyzaj Mimarlığı ve Proje Uygulama',
    mainCategory: 'Peyzaj, Çevre Düzenleme ve Bahçe',
    subCategory: 'Peyzaj Mimarlığı ve Proje Uygulama',
    city: 'Muğla',
    ownerCompany: 'Yıldırım Mimarlık & Peyzaj Proje A.Ş.',
    ownerEmail: 'proje@yildirimmimarlik.com.tr',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Proje & Hizmet İlanı',
    usul: 'Doğrudan Teklif & İletişim',
    butce: '850.000 ₺ · Net Fiyat',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80', name: 'Peyzaj Uygulaması' }],
    teklifSayisi: 0,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-102',
    baslik: "Çanakkale Kepez Sahilinde 1.500 m² %50 Kat Karşılığı Konut İmarlı Arsa",
    aciklama: 'Çanakkale Kepez sahil bandına 200 metre mesafede, 1.500 m² yüzölçümlü, KAKS: 1.50, Emsal 4 kat konut imarlı müstakil parsel arsa. Kat karşılığı sözleşme düzenlemek isteyen kurumsal inşaat firmaları aranmaktadır. Tapu ve imar çapı evrakları mevcuttur.',
    kategori: 'Gayrimenkul / Arsa',
    mainCategory: 'Gayrimenkul',
    subCategory: 'Arsa',
    city: 'Çanakkale',
    ownerCompany: 'Hasan Hüseyin Yıldırım Emlak & Yatırım',
    ownerEmail: 'emlak@ihaleciburada.com',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Proje & Gayrimenkul İlanı',
    usul: 'Kat Karşılığı Görüşme',
    butce: 'Kat Karşılığı (%50)',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', name: 'İmarlı Arsa Parsel' }],
    teklifSayisi: 0,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-103',
    baslik: 'Balıkesir OSB Fabrika İnşaatı 250 Ton Nervürlü İnşaat Demiri (Ø8-Ø32) Alımı',
    aciklama: 'Balıkesir Organize Sanayi Bölgesi 2. Etap fabrika inşaatımızda kullanılmak üzere B420C kalite 250 ton nervürlü inşaat demiri eksiltme usulüyle satın alınacaktır. Sevkiyat şantiye sahamıza parça parça yapılacaktır.',
    kategori: 'İnşaat ve Yapı / Demir-Çelik İşleri',
    mainCategory: 'İnşaat ve Yapı',
    subCategory: 'Demir-Çelik İşleri',
    city: 'Balıkesir',
    ownerCompany: 'Balıkesir Sanayi Yapı Endüstri A.Ş.',
    ownerEmail: 'satinalma@balikesirsanayi.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltmeli Satın Alma',
    usul: 'Fiyat Azaltımlı Açık Eksiltme',
    butce: '6.450.000 ₺',
    sure: '12 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80', name: 'İnşaat Demiri' }],
    teklifSayisi: 3,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-104',
    baslik: "İstanbul Kadıköy Moda'da 145 m² 3+1 Lüks Sıfır Balkonlu Daire",
    aciklama: 'Kadıköy Moda sahil yürüyüş yoluna 3 dakika mesafede, kapalı otoparklı, çift asansörlü, yerden ısıtmalı ve akıllı ev altyapısına sahip sıfır daire. Krediye tam uygundur.',
    kategori: 'Gayrimenkul / Konut',
    mainCategory: 'Gayrimenkul',
    subCategory: 'Konut',
    city: 'İstanbul',
    ownerCompany: 'Kalyoncu Gayrimenkul Yatırım Ofisi',
    ownerEmail: 'moda@kalyoncugayrimenkul.com',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Gayrimenkul Vitrin İlanı',
    usul: 'Doğrudan Satış',
    butce: '14.750.000 ₺',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', name: 'Moda Daire' }],
    teklifSayisi: 0,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-105',
    baslik: 'Bursa Nilüfer Projesi 6 Ay Süreli 2 Adet 22 Ton Paletli Ekskavatör Kiralama',
    aciklama: 'Nilüfer konut şantiyemizde 6 ay boyunca hafriyat ve kanal kazısı işlerinde çalışacak, 2021 model ve üzeri, bakımları eksiksiz 2 adet 22 ton paletli ekskavatör operatörsüz olarak kiralanacaktır.',
    kategori: 'Araç ve İş Makineleri / İş Makinesi Kiralama',
    mainCategory: 'Araç ve İş Makineleri',
    subCategory: 'İş Makinesi Kiralama',
    city: 'Bursa',
    ownerCompany: 'Marmara Altyapı ve Hafriyat Ltd. Şti.',
    ownerEmail: 'operasyon@marmarahafriyat.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'kapali_zarf',
    tur: 'Kapalı Zarf Usulü Teklif Alma',
    usul: 'Kapalı Zarf',
    butce: '1.200.000 ₺',
    sure: '8 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 96,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80', name: 'Ekskavatör' }],
    teklifSayisi: 2,
    olusturma: '2 gün önce',
    isBaseline: true
  },
  {
    id: 'IHC-2026-106',
    baslik: 'İzmir Kemalpaşa Fabrikası 350 Kişilik Günlük Tabldot Yemek & Catering Hizmeti',
    aciklama: 'Fabrikamızda çalışan 350 personelin öğle yemeği ihtiyacı için 12 ay süreli 4 kap sıcak tabldot yemek alımı ihalesidir. ISO 22000 Gıda Güvenliği belgesi zorunludur.',
    kategori: 'Gıda ve Catering / Hazır Yemek',
    mainCategory: 'Gıda ve Catering',
    subCategory: 'Hazır Yemek',
    city: 'İzmir',
    ownerCompany: 'Ege Ambalaj ve Sanayi A.Ş.',
    ownerEmail: 'ik@egeambalaj.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltme İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '3.150.000 ₺',
    sure: '5 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80', name: 'Catering' }],
    teklifSayisi: 4,
    olusturma: '3 gün önce',
    isBaseline: true
  }
]

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_TENDERS__: TenderItem[] | undefined
}

function getStoragePath(): string {
  try {
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
    return path.join(tmpDir, 'gelanlasalim_shared_tenders.json')
  } catch {
    return ''
  }
}

function tryReadFromDisk(): TenderItem[] | null {
  const filePath = getStoragePath()
  if (!filePath) return null
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    // ignore
  }
  return null
}

function trySaveToDisk(tenders: TenderItem[]) {
  const filePath = getStoragePath()
  if (!filePath) return
  try {
    fs.writeFileSync(filePath, JSON.stringify(tenders), 'utf-8')
  } catch (e) {
    // ignore on read-only environments
  }
}

export function computeTenderTiming(tender: TenderItem): {
  durum: string
  durumLabel: string
  sureText: string
  isExpired: boolean
  remainingMs: number
} {
  const now = Date.now()
  const start = tender.startDate ? new Date(tender.startDate).getTime() : 0
  const end = tender.endDate ? new Date(tender.endDate).getTime() : 0

  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi') {
    return {
      durum: 'closed',
      durumLabel: 'Sona Erdi / Kapandı',
      sureText: 'Süre Doldu',
      isExpired: true,
      remainingMs: 0
    }
  }

  if (start > 0 && start > now) {
    const diff = start - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return {
      durum: 'planned',
      durumLabel: 'Yakında Başlayacak',
      sureText: days > 0 ? `${days} gün ${hours} saat sonra başlıyor` : `${hours} saat sonra başlıyor`,
      isExpired: false,
      remainingMs: diff
    }
  }

  if (end > 0 && end <= now) {
    return {
      durum: 'closed',
      durumLabel: 'Sona Erdi / Kapandı',
      sureText: 'Süre Doldu',
      isExpired: true,
      remainingMs: 0
    }
  }

  if (end > 0) {
    const diff = end - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    let sureText = ''
    if (days > 0) {
      sureText = `${days} gün kaldı`
    } else if (hours > 0) {
      sureText = `${hours} saat ${minutes} dk kaldı`
    } else {
      sureText = `${minutes} dakika kaldı`
    }
    if (tender.isIlan || tender.ihaleYonu === 'ihalesiz_ilan') {
      return {
        durum: 'active',
        durumLabel: '📢 Proje & Hizmet İlanı',
        sureText,
        isExpired: false,
        remainingMs: diff
      }
    }
    return {
      durum: 'active',
      durumLabel: 'Canlı İhale',
      sureText,
      isExpired: false,
      remainingMs: diff
    }
  }

  if (tender.isIlan || tender.ihaleYonu === 'ihalesiz_ilan') {
    return {
      durum: tender.durum || 'active',
      durumLabel: '📢 Proje & Hizmet İlanı',
      sureText: tender.sure || 'Yayında',
      isExpired: tender.durum === 'closed',
      remainingMs: 0
    }
  }

  return {
    durum: tender.durum || 'active',
    durumLabel: tender.durum === 'closed' ? 'Sona Erdi' : 'Canlı İhale',
    sureText: tender.sure || 'Canlı İhale',
    isExpired: tender.durum === 'closed',
    remainingMs: 0
  }
}

export function getAllTenders(): TenderItem[] {
  if (!globalThis.__SHARED_TENDERS__) {
    const diskTenders = tryReadFromDisk()
    if (diskTenders && Array.isArray(diskTenders) && diskTenders.length > 0) {
      const diskIds = new Set(diskTenders.map(t => t.id))
      const merged = [...diskTenders]
      for (const b of BASELINE_TENDERS) {
        if (!diskIds.has(b.id)) {
          merged.push(b)
        }
      }
      globalThis.__SHARED_TENDERS__ = merged
    } else {
      globalThis.__SHARED_TENDERS__ = [...BASELINE_TENDERS]
      trySaveToDisk(globalThis.__SHARED_TENDERS__)
    }
  }

  // Auto-normalize and calculate dynamic timing for all items
  const tenders = globalThis.__SHARED_TENDERS__ || []
  for (const t of tenders) {
    if (t.id === 'IHC-2026-910') {
      t.categoryId = 11
      t.kategori = 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri'
      t.mainCategory = 'Ofis & Mobilya'
    }
    const timing = computeTenderTiming(t)
    t.durum = timing.durum
    t.sure = timing.sureText
    if (t.isIlan || t.ihaleYonu === 'ihalesiz_ilan') {
      t.durumLabel = '📢 Proje & Hizmet İlanı'
    }
  }

  return tenders
}

export function syncTendersBatch(incomingTenders: TenderItem[]): TenderItem[] {
  if (!Array.isArray(incomingTenders) || incomingTenders.length === 0) {
    return getAllTenders()
  }
  const current = getAllTenders()
  const map = new Map<string, TenderItem>()
  current.forEach(t => { if (t && t.id) map.set(t.id, t) })
  incomingTenders.forEach(t => {
    if (t && t.id) {
      const existing = map.get(t.id)
      map.set(t.id, { ...existing, ...t })
    }
  })
  const updated = Array.from(map.values())
  globalThis.__SHARED_TENDERS__ = updated
  trySaveToDisk(updated)
  return updated
}

export function addTender(tender: TenderItem): TenderItem {
  const list = getAllTenders()
  const existingIdx = list.findIndex(t => t.id === tender.id)
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...tender }
  } else {
    list.unshift(tender)
  }
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
  return tender
}

export function removeTender(id: string): boolean {
  let list = getAllTenders()
  const initialLen = list.length
  list = list.filter(t => t.id !== id)
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
  return list.length < initialLen
}

export function saveTenders(list: TenderItem[]): void {
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
}

export function clearAllTenders(): void {
  globalThis.__SHARED_TENDERS__ = []
  trySaveToDisk([])
}

export function validateTenderStatusTransition(
  current: TenderStatus | string | undefined,
  target: TenderStatus
): { allowed: boolean; error?: string } {
  const normCurrent = (current || 'LIVE').toUpperCase() as TenderStatus
  if (normCurrent === target) return { allowed: true }

  const validTransitions: Record<TenderStatus, TenderStatus[]> = {
    DRAFT: ['APPROVAL_PENDING', 'SCHEDULED', 'LIVE', 'CANCELLED'],
    APPROVAL_PENDING: ['DRAFT', 'SCHEDULED', 'LIVE', 'CANCELLED'],
    SCHEDULED: ['LIVE', 'CANCELLED'],
    LIVE: ['CLOSED', 'SUSPENDED', 'CANCELLED', 'EVALUATION'],
    SUSPENDED: ['LIVE', 'CANCELLED'],
    CLOSED: ['EVALUATION', 'UNSUCCESSFUL', 'CANCELLED'],
    EVALUATION: ['PROVISIONAL_RESULT', 'UNSUCCESSFUL', 'CANCELLED', 'FINALIZED'],
    PROVISIONAL_RESULT: ['FINAL_APPROVAL_PENDING', 'FINALIZED', 'EVALUATION', 'UNSUCCESSFUL', 'CANCELLED'],
    FINAL_APPROVAL_PENDING: ['FINALIZED', 'PROVISIONAL_RESULT', 'UNSUCCESSFUL', 'CANCELLED'],
    FINALIZED: [], // Terminal
    UNSUCCESSFUL: [], // Terminal
    CANCELLED: [] // Terminal
  }

  const allowedTargets = validTransitions[normCurrent] || []
  if (!allowedTargets.includes(target)) {
    return {
      allowed: false,
      error: `Geçersiz statü geçişi: "${normCurrent}" durumundaki bir ihale "${target}" durumuna geçirilemez (PRD Bölüm 3.3).`
    }
  }

  return { allowed: true }
}

export function updateTenderStatus(
  id: string,
  targetStatus: TenderStatus,
  options?: { reasonCode?: TenderReasonCode; reasonNote?: string }
): { success: boolean; tender?: TenderItem; error?: string } {
  const list = getAllTenders()
  const target = list.find(t => t.id === id)
  if (!target) {
    return { success: false, error: 'İhale bulunamadı.' }
  }

  const currentStatus = (target.statusCode || (target.durum === 'closed' ? 'CLOSED' : 'LIVE')) as TenderStatus
  const check = validateTenderStatusTransition(currentStatus, targetStatus)
  if (!check.allowed) {
    return { success: false, error: check.error }
  }

  target.statusCode = targetStatus
  target.durum = targetStatus.toLowerCase()
  if (options?.reasonCode) target.reasonCode = options.reasonCode
  if (options?.reasonNote) target.reasonNote = options.reasonNote

  addTender(target)
  return { success: true, tender: target }
}
