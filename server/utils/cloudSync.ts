// server/utils/cloudSync.ts
// İhaleciBurada Cross-Device Cloud Persistence Engine
// Sunucusuz (Serverless Lambda) ortamlarda verilerin oturumlar, farklı bilgisayarlar ve
// konteyner yeniden başlatmaları arasında kalıcı olarak korunmasını sağlar.

const MASTER_TENDERS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/aefafaf'
const MASTER_BIDS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/aebfbcb'
const MASTER_SECURITY_KEY = 'ihaleciburada-prod-master-key-2026'

let lastTendersCloudFetch = 0
let isTendersCloudSyncing = false
let isBidsCloudSyncing = false

/**
 * ☁️ Bulut Depolamadan İhaleleri Getirir (Timeout ve Hata Korumalı)
 */
export async function fetchTendersFromCloud(): Promise<any[] | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(MASTER_TENDERS_BIN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data && Array.isArray(data.tenders)) {
        lastTendersCloudFetch = Date.now()
        return data.tenders
      }
    }
  } catch (err: any) {
    // Bulut erişimi başarısızsa yerel /tmp ve bellek havuzuna güvenli şekilde geri çekil
    console.warn('[CloudSync] Tenders fetch warning (using local fallback):', err?.message || err)
  }
  return null
}

/**
 * ☁️ Bulut Depolamaya İhaleleri Kaydeder (Asenkron & Güvenli)
 */
export async function persistTendersToCloud(tenders: any[]): Promise<boolean> {
  if (isTendersCloudSyncing) return false
  isTendersCloudSyncing = true
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)

    // Filtreleme: Yalnızca gerçek ihaleleri bulutta sakla (test IDOR vs. hariç)
    const cleanList = (tenders || []).filter(t => t && t.id && !t.id.startsWith('TND-IDOR') && !t.id.startsWith('TND-TEST'))

    const response = await fetch(MASTER_TENDERS_BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Security-key': MASTER_SECURITY_KEY
      },
      body: JSON.stringify({
        tenders: cleanList,
        updatedAt: new Date().toISOString(),
        count: cleanList.length
      }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      lastTendersCloudFetch = Date.now()
      return true
    }
  } catch (err: any) {
    console.warn('[CloudSync] Tenders persist warning:', err?.message || err)
  } finally {
    isTendersCloudSyncing = false
  }
  return false
}

/**
 * ☁️ Bulut Depolamadan Teklifleri Getirir
 */
export async function fetchBidsFromCloud(): Promise<any[] | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(MASTER_BIDS_BIN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data && Array.isArray(data.bids)) {
        return data.bids
      }
    }
  } catch (err: any) {
    console.warn('[CloudSync] Bids fetch warning:', err?.message || err)
  }
  return null
}

/**
 * ☁️ Bulut Depolamaya Teklifleri Kaydeder
 */
export async function persistBidsToCloud(bids: any[]): Promise<boolean> {
  if (isBidsCloudSyncing) return false
  isBidsCloudSyncing = true
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)

    const response = await fetch(MASTER_BIDS_BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Security-key': MASTER_SECURITY_KEY
      },
      body: JSON.stringify({
        bids: bids || [],
        updatedAt: new Date().toISOString(),
        count: (bids || []).length
      }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      return true
    }
  } catch (err: any) {
    console.warn('[CloudSync] Bids persist warning:', err?.message || err)
  } finally {
    isBidsCloudSyncing = false
  }
  return false
}

export function shouldRefreshFromCloud(ttlMs = 15000): boolean {
  return Date.now() - lastTendersCloudFetch > ttlMs
}
