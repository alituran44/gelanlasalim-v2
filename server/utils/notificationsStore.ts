import fs from 'node:fs'
import path from 'node:path'

export type NotificationCategory = 'CRITICAL' | 'INFO' | 'MARKETING'
export type NotificationChannel = 'IN_APP' | 'SMS' | 'EMAIL'

export interface NotificationItem {
  id: string
  recipientEmail: string
  recipientPhone?: string
  recipientVkn?: string
  title: string
  message: string
  category: NotificationCategory
  isMandatory: boolean // 🛡️ COM-003: Kritik bildirimler kullanıcı tarafından kapatılamaz
  relatedTenderId?: string
  relatedBidId?: string
  actionUrl?: string
  channels: NotificationChannel[]
  deliveryStatus: 'SENT' | 'DELIVERED' | 'FAILED'
  createdAt: string
  readAt?: string
  read: boolean
}

let inMemoryNotifications: NotificationItem[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.notifications_store.json')
const TMP_FILE = '/tmp/ihaleciburada_notifications.json'

function getStoragePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) return TMP_FILE
  } catch {}
  return BACKUP_FILE
}

function readFromDisk(): NotificationItem[] {
  const filePath = getStoragePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('[Notifications Store] Read error:', e)
  }
  return []
}

function writeToDisk(items: NotificationItem[]) {
  const filePath = getStoragePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(items.slice(0, 1000), null, 2), 'utf-8')
  } catch (e) {
    console.warn('[Notifications Store] Write error:', e)
  }
}

export function getAllNotifications(): NotificationItem[] {
  if (!inMemoryNotifications) {
    inMemoryNotifications = readFromDisk()
    if (inMemoryNotifications.length === 0) {
      // Seed default system notification
      inMemoryNotifications = [
        {
          id: 'NTF-INIT-1',
          recipientEmail: 'ihalecib@gmail.com',
          title: 'Sisteme Hoş Geldiniz',
          message: 'İhaleciBurada B2B E-İhale ve Tedarik Pazaryeri sistem bildirim kanalınız aktif edilmiştir.',
          category: 'CRITICAL',
          isMandatory: true,
          channels: ['IN_APP', 'EMAIL'],
          deliveryStatus: 'DELIVERED',
          createdAt: new Date().toISOString(),
          read: true,
          readAt: new Date().toISOString()
        }
      ]
      writeToDisk(inMemoryNotifications)
    }
  }
  return inMemoryNotifications
}

/**
 * 🛡️ COM-001, COM-002, COM-003, COM-008: Sistem İçi Bildirim Üretimi
 */
export function createNotification(data: {
  recipientEmail: string
  recipientPhone?: string
  recipientVkn?: string
  title: string
  message: string
  category?: NotificationCategory
  isMandatory?: boolean
  relatedTenderId?: string
  relatedBidId?: string
  actionUrl?: string
  channels?: NotificationChannel[]
}): NotificationItem {
  const list = getAllNotifications()
  const now = new Date().toISOString()
  const id = `NTF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`

  const category = data.category || 'INFO'
  // Critical notifications are mandatory by rule COM-003
  const isMandatory = category === 'CRITICAL' ? true : Boolean(data.isMandatory)

  const item: NotificationItem = {
    id,
    recipientEmail: data.recipientEmail.toLowerCase().trim(),
    recipientPhone: data.recipientPhone,
    recipientVkn: data.recipientVkn,
    title: data.title,
    message: data.message,
    category,
    isMandatory,
    relatedTenderId: data.relatedTenderId,
    relatedBidId: data.relatedBidId,
    actionUrl: data.actionUrl,
    channels: data.channels || ['IN_APP'],
    deliveryStatus: 'DELIVERED',
    createdAt: now,
    read: false
  }

  list.unshift(item)
  writeToDisk(list)
  return item
}

export function getNotificationsForUser(email: string): NotificationItem[] {
  const cleanEmail = email.toLowerCase().trim()
  return getAllNotifications().filter(n => 
    n.recipientEmail === cleanEmail || 
    n.recipientEmail === 'all' || 
    cleanEmail === 'ihalecib@gmail.com'
  )
}

export function markAsRead(id: string, userEmail: string): boolean {
  const list = getAllNotifications()
  const target = list.find(n => n.id === id)
  if (target) {
    target.read = true
    target.readAt = new Date().toISOString() // 🛡️ COM-009: Okundu zamanı kaydı
    writeToDisk(list)
    return true
  }
  return false
}

export function markAllAsReadForUser(email: string): number {
  const cleanEmail = email.toLowerCase().trim()
  const list = getAllNotifications()
  let count = 0
  const now = new Date().toISOString()

  list.forEach(n => {
    if ((n.recipientEmail === cleanEmail || cleanEmail === 'ihalecib@gmail.com') && !n.read) {
      n.read = true
      n.readAt = now // 🛡️ COM-009
      count++
    }
  })

  if (count > 0) {
    writeToDisk(list)
  }
  return count
}
