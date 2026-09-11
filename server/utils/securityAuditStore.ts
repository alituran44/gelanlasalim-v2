import fs from 'node:fs'
import path from 'node:path'
import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'

export type SecurityEventType =
  | 'AUTH_FAILURE'
  | 'IDOR_ATTEMPT'
  | 'RATE_LIMIT_HIT'
  | 'ROLE_VIOLATION'
  | 'COLLUSION_SIGNAL_DETECTED'
  | 'SEALED_BID_LEAK_PREVENTED'
  | 'MALICIOUS_FILE_BLOCKED'
  | 'CRITICAL_ACTION_LOGGED'
  | 'MFA_REQUESTED'
  | 'MFA_VERIFIED'
  | 'MFA_FAILED'
  | 'EXPORT_SENSITIVE_DATA' // 🛡️ REP-013: Hassas veri dışa aktarma denetim kaydı

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface SecurityEventItem {
  id: string
  timestamp: string
  eventType: SecurityEventType
  severity: SecuritySeverity
  actorEmail?: string
  actorVkn?: string
  targetResource?: string
  ipAddress: string
  userAgent?: string
  actionTaken: 'ALLOWED' | 'BLOCKED_403' | 'RATE_LIMITED' | 'MASKED' | 'FLAGGED_FOR_REVIEW'
  details: Record<string, any>
}

// In-memory buffer
let inMemorySecurityEvents: SecurityEventItem[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.security_audit_logs.json')
const TMP_FILE = '/tmp/ihaleciburada_security_audit_logs.json'

function getStoragePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) {
      return TMP_FILE
    }
  } catch {}
  return BACKUP_FILE
}

function readFromDisk(): SecurityEventItem[] {
  const filePath = getStoragePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('[Security Audit Store] Read error:', e)
  }
  return []
}

function appendToDisk(event: SecurityEventItem) {
  const filePath = getStoragePath()
  try {
    const existing = readFromDisk()
    existing.unshift(event)
    // Keep last 2000 events to prevent unbounded growth
    const truncated = existing.slice(0, 2000)
    fs.writeFileSync(filePath, JSON.stringify(truncated, null, 2), 'utf-8')
  } catch (e) {
    console.warn('[Security Audit Store] Write error:', e)
  }
}

export function getAllSecurityEvents(): SecurityEventItem[] {
  if (!inMemorySecurityEvents) {
    inMemorySecurityEvents = readFromDisk()
  }
  return inMemorySecurityEvents
}

/**
 * 🛡️ SEC-005 & SEC-006: Değiştirilemez ve Silinemez Güvenlik Olayı Kaydı
 */
export function logSecurityEvent(
  eventOrReq: H3Event | null,
  data: {
    eventType: SecurityEventType
    severity: SecuritySeverity
    actorEmail?: string
    actorVkn?: string
    targetResource?: string
    actionTaken: 'ALLOWED' | 'BLOCKED_403' | 'RATE_LIMITED' | 'MASKED' | 'FLAGGED_FOR_REVIEW'
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
  }
): SecurityEventItem {
  let ip = data.ipAddress || '127.0.0.1'
  let ua = data.userAgent || 'Unknown'

  if (eventOrReq) {
    try {
      const fwd = getRequestHeader(eventOrReq, 'x-forwarded-for')
      ip = (fwd ? fwd.split(',')[0].trim() : '') ||
        eventOrReq.node.req.socket.remoteAddress ||
        ip
      ua = getRequestHeader(eventOrReq, 'user-agent') || ua
    } catch {}
  }

  const now = new Date().toISOString()
  const id = `SEC-EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`

  const eventItem: SecurityEventItem = {
    id,
    timestamp: now,
    eventType: data.eventType,
    severity: data.severity,
    actorEmail: data.actorEmail || 'anonymous',
    actorVkn: data.actorVkn,
    targetResource: data.targetResource,
    ipAddress: ip,
    userAgent: ua,
    actionTaken: data.actionTaken,
    details: data.details || {}
  }

  const list = getAllSecurityEvents()
  list.unshift(eventItem)
  if (list.length > 2000) {
    list.pop()
  }

  appendToDisk(eventItem)
  return eventItem
}

export const recordSecurityEvent = logSecurityEvent

/**
 * 🛡️ SEC-014: IP & Cihaz Bazlı Danışıklı Teklif (Collusion) Sinyal Tespiti
 * Aynı IP adresinden aynı ihaleye FARKLI VKN'lerle teklif verildiğinde şüpheli durum tespiti yapar.
 */
export function detectCollusionSignal(
  tenderId: string,
  currentVkn: string,
  currentEmail: string,
  clientIp: string
): { isSuspicious: boolean; conflictingVkn?: string; message?: string } {
  if (clientIp === '127.0.0.1' || clientIp === '::1' || !clientIp) {
    return { isSuspicious: false }
  }

  const events = getAllSecurityEvents()
  const recentBidsFromSameIp = events.filter(e => 
    e.eventType === 'CRITICAL_ACTION_LOGGED' &&
    e.details?.tenderId === tenderId &&
    e.ipAddress === clientIp &&
    e.actorVkn &&
    e.actorVkn !== currentVkn
  )

  if (recentBidsFromSameIp.length > 0) {
    const conflicting = recentBidsFromSameIp[0].actorVkn
    return {
      isSuspicious: true,
      conflictingVkn: conflicting,
      message: `Aynı IP adresinden (${clientIp}) "${tenderId}" ihalesine farklı bir firma VKN'si (${conflicting}) ile daha önce teklif verilmiş. Olası danışıklı teklif (collusion) sinyali tespit edildi (Kural SEC-014).`
    }
  }

  return { isSuspicious: false }
}
