import fs from 'node:fs'
import path from 'node:path'
import type { H3Event } from 'h3'

export interface BidAuditLogItem {
  id: string
  timestamp: string
  action: 'BID_SUBMITTED' | 'BID_REJECTED' | 'BID_CANCEL_REQUEST'
  tenderId: string
  tenderTitle: string
  bidId?: string
  firma: string
  yetkili?: string
  eposta?: string
  fiyat: string
  ipAddress: string
  userAgent?: string
  result: 'SUCCESS' | 'REJECTED'
  reason?: string
  antiSnipingTriggered?: boolean
}

let inMemoryBidAuditLogs: BidAuditLogItem[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.bid_audit_logs.json')
const TMP_FILE = '/tmp/ihaleciburada_bid_audit_logs.json'

function getFilePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) {
      return TMP_FILE
    }
  } catch (e) {}
  return BACKUP_FILE
}

function readFromDisk(): BidAuditLogItem[] | null {
  const filePath = getFilePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('[Bid Audit Store] read error:', e)
  }
  return null
}

function writeToDisk(logs: BidAuditLogItem[]) {
  const filePath = getFilePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf-8')
  } catch (e) {
    console.warn('[Bid Audit Store] write error:', e)
  }
}

export function getAllBidAuditLogs(): BidAuditLogItem[] {
  if (!inMemoryBidAuditLogs) {
    const fromDisk = readFromDisk()
    inMemoryBidAuditLogs = fromDisk || []
  }
  return inMemoryBidAuditLogs
}

export function logBidEvent(
  event: H3Event,
  data: Omit<BidAuditLogItem, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>
): BidAuditLogItem {
  const allLogs = getAllBidAuditLogs()
  const headers = getRequestHeaders(event)
  const forwardedFor = headers['x-forwarded-for'] as string | undefined
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : (getRequestIP(event) || '127.0.0.1')
  const userAgent = (headers['user-agent'] as string) || 'Unknown'

  const auditItem: BidAuditLogItem = {
    id: `AUD-BID-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent,
    ...data
  }

  allLogs.unshift(auditItem)
  if (allLogs.length > 500) {
    allLogs.length = 500
  }

  writeToDisk(allLogs)
  return auditItem
}
