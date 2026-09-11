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
  [key: string]: any
}

const BASELINE_TENDERS: TenderItem[] = []

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
    return {
      durum: 'active',
      durumLabel: 'Canlı İhale',
      sureText,
      isExpired: false,
      remainingMs: diff
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
    if (diskTenders && Array.isArray(diskTenders)) {
      globalThis.__SHARED_TENDERS__ = diskTenders
    } else {
      globalThis.__SHARED_TENDERS__ = []
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
  }

  return tenders
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
