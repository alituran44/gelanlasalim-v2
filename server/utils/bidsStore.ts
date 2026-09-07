import fs from 'node:fs'
import path from 'node:path'

export interface BidItem {
  id: string
  tenderId: string
  tenderTitle: string
  ownerEmail?: string
  firma: string
  fiyat: string
  sure?: string
  puan?: number
  durum?: string // 'bekliyor' | 'onaylandi' | 'reddedildi'
  yetkili?: string
  telefon?: string
  eposta?: string
  vergiDairesi?: string
  adres?: string
  notum?: string
  tarih?: string
  createdAt?: string
  pazarlikGecmisi?: any[]
  [key: string]: any
}

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_BIDS__: BidItem[] | undefined
}

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
      if (Array.isArray(parsed)) {
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

export function getAllBids(): BidItem[] {
  if (!globalThis.__SHARED_BIDS__) {
    const diskBids = tryReadBidsFromDisk()
    globalThis.__SHARED_BIDS__ = diskBids || []
  }
  return globalThis.__SHARED_BIDS__
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
