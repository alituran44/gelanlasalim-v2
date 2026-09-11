import fs from 'node:fs'
import path from 'node:path'
import type { TenderItem } from './tendersStore'
import { canUserSubmitBid } from './companyVerificationStore'

export interface BidItem {
  id: string
  tenderId: string
  tenderTitle: string
  ownerEmail?: string
  firma: string
  fiyat: string
  sure?: string
  puan?: number
  durum?: string // 'bekliyor' | 'onaylandi' | 'reddedildi' | 'degerlendirmede'
  yetkili?: string
  telefon?: string
  eposta?: string
  vergiDairesi?: string
  adres?: string
  notum?: string
  tarih?: string
  createdAt?: string
  pazarlikGecmisi?: any[]
  isMine?: boolean
  vkn?: string
  specVersionAccepted?: number // 🛡️ VER-010
  specAcceptedAt?: string // 🛡️ VER-010
  specAcceptedByUser?: string // 🛡️ VER-010
  specAcceptedByCompany?: string // 🛡️ VER-010
  isCompanyVerified?: boolean // 🛡️ VER-001
  companyRole?: string // 🛡️ VER-004
  [key: string]: any
}

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_BIDS__: BidItem[] | undefined
}

// 🎯 Baseline Bids for Initial Seed Tenders (8, 14, 6, 19, 11, 7, 12, 15, 8, 9, 5)
const BASELINE_BIDS: BidItem[] = []

function getBidsStoragePath(): string {
  try {
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
    return path.join(tmpDir, 'gelanlasalim_shared_bids.json')
  } catch {
    return ''
  }
}

function tryReadBidsFromDisk(): BidItem[] | null {
  const filePath = getBidsStoragePath()
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

function trySaveBidsToDisk(bids: BidItem[]) {
  const filePath = getBidsStoragePath()
  if (!filePath) return
  try {
    fs.writeFileSync(filePath, JSON.stringify(bids), 'utf-8')
  } catch (e) {
    // ignore on read-only environments
  }
}

export function sanitizeInput(str: string | undefined): string {
  if (!str) return ''
  return String(str)
    .replace(/[<>]/g, '') // strip potential HTML tags
    .trim()
}

export function validateBidSubmission(
  tender: TenderItem | undefined,
  bidData: { eposta?: string; fiyat: string; firma?: string; bidderName?: string }
): { valid: boolean; error?: string; statusCode?: number } {
  if (!tender) {
    return { valid: false, error: 'Teklif verilmek istenen ihale bulunamadı.', statusCode: 404 }
  }

  // Check if tender is closed or completed
  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi') {
    return {
      valid: false,
      error: `"${tender.baslik}" ihalesi sonuçlandığı veya mutabakat sağlandığı için yeni teklif verilemez.`,
      statusCode: 400
    }
  }

  // Check if tender deadline passed
  if (tender.endDate) {
    const endMs = new Date(tender.endDate).getTime()
    if (endMs <= Date.now()) {
      return {
        valid: false,
        error: `"${tender.baslik}" ihalesinin teklif toplama süresi dolmuştur.`,
        statusCode: 400
      }
    }
  }

  // Prevent self-bidding
  const bidderEmail = (bidData.eposta || '').trim().toLowerCase()
  const ownerEmail = (tender.ownerEmail || '').trim().toLowerCase()
  if (bidderEmail && ownerEmail && bidderEmail === ownerEmail) {
    return {
      valid: false,
      error: 'Kendi açtığınız bir ihaleye teklif sunamazsınız.',
      statusCode: 403
    }
  }

  // 🛡️ VER-001, VER-004, VER-009: Firma Doğrulama & Yetkililik & Evrak Süresi Kontrolü
  const userCheck = canUserSubmitBid(bidderEmail)
  if (!userCheck.allowed) {
    return {
      valid: false,
      error: userCheck.reason || 'Teklif verebilmek için firmanızın doğrulanmış olması zorunludur.',
      statusCode: userCheck.statusCode || 403
    }
  }

  // Validate price
  const rawNum = String(bidData.fiyat).replace(/\D/g, '')
  const priceNum = parseInt(rawNum, 10)
  if (isNaN(priceNum) || priceNum <= 0) {
    return {
      valid: false,
      error: 'Lütfen geçerli bir teklif tutarı giriniz.',
      statusCode: 400
    }
  }

  // 🛡️ BID-007 & BID-008: Açık İhalede Eşit Fiyat / Min Adım Kuralları
  const isSealed = tender.usul === 'Kapalı Zarf Usulü' || tender.tur === 'kapali_zarf'
  if (!isSealed && tender.liderTeklif) {
    const leaderNum = parseInt(String(tender.liderTeklif).replace(/\D/g, ''), 10)
    if (!isNaN(leaderNum) && leaderNum > 0) {
      const isAuction = tender.usul === 'Açık Artırma' || tender.ihaleYonu === 'artirma'
      if (isAuction) {
        // Açık artırmada teklif liderden YÜKSEK olmalı
        if (priceNum <= leaderNum) {
          return {
            valid: false,
            error: `Açık artırma kuralı gereğince yeni teklif güncel lider tekliften (${tender.liderTeklif}) daha yüksek olmalıdır. Eşit veya daha düşük teklif verilemez (BID-007).`,
            statusCode: 400
          }
        }
        if (tender.minStep && tender.minStep > 0 && priceNum - leaderNum < tender.minStep) {
          return {
            valid: false,
            error: `Teklif artış tutarı minimum teklif adımından (${tender.minStep.toLocaleString('tr-TR')} ₺) az olamaz.`,
            statusCode: 400
          }
        }
      } else {
        // Açık eksiltmede (ters ihale) teklif liderden DÜŞÜK olmalı
        if (priceNum >= leaderNum) {
          return {
            valid: false,
            error: `Açık eksiltme kuralı gereğince yeni teklif güncel lider tekliften (${tender.liderTeklif}) daha düşük olmalıdır. Eşit veya daha yüksek teklif verilemez (BID-007).`,
            statusCode: 400
          }
        }
        if (tender.minStep && tender.minStep > 0 && leaderNum - priceNum < tender.minStep) {
          return {
            valid: false,
            error: `Teklif düşüş tutarı minimum teklif adımından (${tender.minStep.toLocaleString('tr-TR')} ₺) az olamaz.`,
            statusCode: 400
          }
        }
      }
    }
  }

  return { valid: true }
}

export function getAllBids(): BidItem[] {
  if (!globalThis.__SHARED_BIDS__) {
    const diskBids = tryReadBidsFromDisk()
    globalThis.__SHARED_BIDS__ = diskBids || []
  }
  return globalThis.__SHARED_BIDS__
}

export function clearAllBids(): void {
  globalThis.__SHARED_BIDS__ = []
  trySaveBidsToDisk([])
}

export function saveBids(list: BidItem[]): void {
  globalThis.__SHARED_BIDS__ = list
  trySaveBidsToDisk(list)
}

export function addBid(bid: BidItem): BidItem {
  const list = getAllBids()
  const existingIdx = list.findIndex(b => b.id === bid.id)
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...bid }
  } else {
    list.unshift(bid)
  }
  globalThis.__SHARED_BIDS__ = list
  trySaveBidsToDisk(list)
  return bid
}

export function getBidsForTender(tenderId: string): BidItem[] {
  return getAllBids().filter(b => b.tenderId === tenderId)
}

export function updateBidStatus(bidId: string, status: string): boolean {
  const list = getAllBids()
  const target = list.find(b => b.id === bidId)
  if (target) {
    target.durum = status
    globalThis.__SHARED_BIDS__ = list
    trySaveBidsToDisk(list)
    return true
  }
  return false
}

export function removeBid(bidId: string): boolean {
  let list = getAllBids()
  const initLen = list.length
  list = list.filter(b => b.id !== bidId)
  globalThis.__SHARED_BIDS__ = list
  trySaveBidsToDisk(list)
  return list.length < initLen
}
