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
    baslik: '50.000 Adet Çift Oluklu İhracat Kolisi ve Ambalaj Malzemesi Alımı',
    kategori: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri / Koli, Karton Kutu & Ambalaj',
    mainCategory: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri',
    subCategory: 'Koli, Karton Kutu & Ambalaj',
    categoryId: 15,
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltme İhalesi',
    rekabetTuru: 'Eksiltme',
    butce: '180.000 ₺ - 250.000 ₺',
    city: 'Çanakkale',
    authority: 'Ege Ambalaj ve İhracat Sanayi A.Ş.',
    ownerCompany: 'Ege Ambalaj ve İhracat Sanayi A.Ş.',
    ownerEmail: 'egeambalaj@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    sure: '5 gün kaldı',
    teklifSayisi: 3,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'İhracat sevkiyatlarımız için standart ebatlarda çift oluklu dopel koli ve koruyucu köşe karton temini için canlı eksiltme ihalesidir.'
  },
  {
    id: 'IHC-2026-102',
    baslik: 'Çanakkale Merkez Şantiye Kaba İnşaat ve Kalıp İşçiliği İhalesi',
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri / Kaba İnşaat',
    mainCategory: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    subCategory: 'Kaba İnşaat',
    categoryId: 1,
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltme İhalesi',
    rekabetTuru: 'Eksiltme',
    butce: '850.000 ₺ - 1.200.000 ₺',
    city: 'Çanakkale',
    authority: 'Marmara Altyapı ve İnşaat Grubu',
    ownerCompany: 'Marmara Altyapı ve İnşaat Grubu',
    ownerEmail: 'marmarayapi@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    sure: '6 gün kaldı',
    teklifSayisi: 4,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Merkez şantiyemizde 4 katlı betonarme konut projesi için kalıp, demir işçiliği ve kaba yapı uygulaması için taşeron teklifleri toplanmaktadır.'
  },
  {
    id: 'IHC-2026-103',
    baslik: 'Sıfır Ayarında 5 Eksen CNC Freze ve Takım Tezgahı',
    kategori: 'Endüstriyel Makine - Motor - Konveyör İhaleleri / CNC & Takım Tezgahları',
    mainCategory: 'Endüstriyel Makine - Motor - Konveyör İhaleleri',
    subCategory: 'CNC & Takım Tezgahları',
    categoryId: 8,
    ihaleYonu: 'sabit_paket',
    tur: 'Sabit Fiyatlı İlan',
    rekabetTuru: 'Doğrudan İlan',
    butce: '450.000 ₺',
    city: 'Bursa',
    authority: 'Anadolu Çelik ve Metal Sanayi A.Ş.',
    ownerCompany: 'Anadolu Çelik ve Metal Sanayi A.Ş.',
    ownerEmail: 'anadolucelik@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    sure: '12 gün kaldı',
    teklifSayisi: 2,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Fabrikamızda az kullanılmış, periyodik bakımları yetkili servis tarafından yapılmış yüksek hassasiyetli 5 eksen CNC freze tezgahı doğrudan satılıktır.'
  },
  {
    id: 'IHC-2026-104',
    baslik: 'Marmara Bölgesi Frigorifik Soğuk Hava Lojistiği ve Dağıtım Hizmetleri',
    kategori: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri / Soğuk Hava Zinciri Taşımacılığı',
    mainCategory: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri',
    subCategory: 'Soğuk Hava Zinciri Taşımacılığı',
    categoryId: 10,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Tanıtım & Reklam İlanı',
    rekabetTuru: 'Doğrudan İlan',
    isIlan: true,
    butce: 'Tanıtım / Kurumsal Hizmet',
    city: 'Balıkesir',
    authority: 'Mega Lojistik ve Dağıtım A.Ş.',
    ownerCompany: 'Mega Lojistik ve Dağıtım A.Ş.',
    ownerEmail: 'megalojistik@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    sure: 'Yayında',
    teklifSayisi: 0,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: '📢 Proje & Hizmet İlanı',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Balıkesir, Çanakkale, Bursa ve İstanbul hatlarında -18°C / +4°C kontrollü sıcaklıkta filo taşımacılığı ve lojistik antrepo çözümleri sunuyoruz.'
  },
  {
    id: 'IHC-2026-105',
    baslik: 'Çanakkale Kepez\'de 1.500 m² %50 Kat Karşılığı Konut İmarlı Arsa',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri / Kat Karşılığı Konut İmarlı',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Kat Karşılığı Konut İmarlı',
    categoryId: 40,
    ihaleYonu: 'satis',
    tur: 'Satılık Arsa İlanı',
    rekabetTuru: 'Doğrudan İlan',
    butce: '4.500.000 ₺',
    city: 'Çanakkale',
    authority: 'Doğrulanmış Mülk Sahibi',
    ownerCompany: 'Doğrulanmış Mülk Sahibi',
    ownerEmail: 'kepezarsa@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    sure: '21 gün kaldı',
    teklifSayisi: 1,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Kepez sahil bölgesine yakın, ana cadde cepheli 1.500 m² emsal 1.50 konut imarlı arsa %50 kat karşılığı veya doğrudan peşin satışa uygundur.'
  },
  {
    id: 'IHC-2026-106',
    baslik: 'Balıkesir Edremit Güre\'de 3.200 m² Satılık Zeytinlik & Yatırımlık Arazi',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri / Satılık Tarla & Zeytinlik',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Satılık Tarla & Zeytinlik',
    categoryId: 40,
    ihaleYonu: 'satis',
    tur: 'Satılık Arsa İlanı',
    rekabetTuru: 'Doğrudan İlan',
    butce: '2.750.000 ₺',
    city: 'Balıkesir',
    authority: 'Doğrulanmış Gayrimenkul Portföyü',
    ownerCompany: 'Doğrulanmış Gayrimenkul Portföyü',
    ownerEmail: 'gurezeytinlik@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    sure: '18 gün kaldı',
    teklifSayisi: 2,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Edremit Körfezi ve Kazdağları manzaralı, içerisinde yetişkin 70 adet Edremit cinsi zeytin ağacı bulunan tek tapu müstakil parsel.'
  },
  {
    id: 'IHC-2026-107',
    baslik: 'Balıkesir Karesi\'de Sıfır 3+1 Yerden Isıtmalı Ebeveyn Banyolu Lüks Daire',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri / Satılık Daire',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Satılık Daire',
    categoryId: 40,
    ihaleYonu: 'satis',
    tur: 'Satılık Konut İlanı',
    rekabetTuru: 'Doğrudan İlan',
    butce: '3.250.000 ₺',
    city: 'Balıkesir',
    authority: 'Doğrulanmış Konut Sahibi',
    ownerCompany: 'Doğrulanmış Konut Sahibi',
    ownerEmail: 'karesikonut@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
    sure: '14 gün kaldı',
    teklifSayisi: 1,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'Karesi merkezde sıfır bina, 145 m² brüt, 125 m² net, yerden ısıtma (kombi), ebeveyn banyosu, kapalı otopark ve asansörlü köşe daire.'
  },
  {
    id: 'IHC-2026-108',
    baslik: 'Fabrikadan Doğrudan Satış: 20 Ton Nervürlü İnşaat Demiri ve Çelik Profil',
    kategori: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri / Sac, Profil & Demir Ürünleri',
    mainCategory: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri',
    subCategory: 'Sac, Profil & Demir Ürünleri',
    categoryId: 12,
    ihaleYonu: 'satis',
    tur: 'Pazaryeri İlanı',
    rekabetTuru: 'Doğrudan İlan',
    butce: '520.000 ₺',
    city: 'Kocaeli',
    authority: 'Anadolu Çelik ve Metal Sanayi A.Ş.',
    ownerCompany: 'Anadolu Çelik ve Metal Sanayi A.Ş.',
    ownerEmail: 'anadolucelik@ihaleciburada.com',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
    sure: '9 gün kaldı',
    teklifSayisi: 3,
    durum: 'active',
    statusCode: 'LIVE',
    statusLabel: 'Canlı Yayında',
    adminApproved: true,
    isBaseline: false,
    olusturma: 'Bugün',
    aciklama: 'TSE belgeli nervürlü inşaat demiri (Q12, Q14, Q16) ve kutu profil partisi fabrika teslim peşin veya teminatlı vadeli teslimata hazırdır.'
  }
]


declare global {
  // eslint-disable-next-line no-var
  var __SHARED_TENDERS__: TenderItem[] | undefined
}

function getStoragePath(): string {
  try {
    const dataDir = path.resolve(process.cwd(), '.data')
    if (!fs.existsSync(dataDir)) {
      try { fs.mkdirSync(dataDir, { recursive: true }) } catch {}
    }
    if (fs.existsSync(dataDir)) {
      return path.join(dataDir, 'tenders.json')
    }
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
      // Filter out test dummy tenders and any legacy mock items
      const cleanDisk = diskTenders.filter(t => t && t.id && !t.id.startsWith('TND-IDOR') && !t.id.startsWith('TND-TEST') && !t.isBaseline)
      globalThis.__SHARED_TENDERS__ = cleanDisk.length > 0 ? cleanDisk : [...BASELINE_TENDERS]
      trySaveToDisk(globalThis.__SHARED_TENDERS__)
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

