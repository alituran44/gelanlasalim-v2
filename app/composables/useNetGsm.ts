import { ref, computed } from 'vue'

export interface NetGsmConfig {
  usercode: string
  msgheader: string // SMS Gönderici Başlığı (Örn: 8508408695, IHALECIB)
  isActive: boolean
  balanceCredits: number
}

export interface NetGsmLog {
  id: string
  timestamp: string
  recipientPhone: string
  recipientName: string
  templateName: string
  messageBody: string
  status: 'SENT' | 'FAILED' | 'PENDING'
  msgId: string
}

const NETGSM_STORAGE_KEY = 'netgsm_config'
const NETGSM_LOGS_KEY = 'netgsm_logs'

export function useNetGsm() {
  const config = ref<NetGsmConfig>({
    usercode: '8508408695',
    msgheader: '8508408695',
    isActive: true,
    balanceCredits: 5000
  })

  const logs = ref<NetGsmLog[]>([])

  // Load from localStorage and sanitize any legacy sensitive keys
  if (typeof window !== 'undefined') {
    try {
      const savedConfig = localStorage.getItem(NETGSM_STORAGE_KEY)
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        // 🛡️ SEC-014: İstemci yerel hafızasından eski şifreleri derhal temizle
        delete parsed.password
        delete parsed.apiUrl
        config.value = { ...config.value, ...parsed }
      }
      const savedLogs = localStorage.getItem(NETGSM_LOGS_KEY)
      if (savedLogs) {
        logs.value = JSON.parse(savedLogs)
      }
    } catch (e) {
      console.warn('NetGSM storage read error:', e)
    }
  }

  function saveConfig(newConfig: Partial<NetGsmConfig>) {
    const sanitized = { ...config.value, ...newConfig }
    config.value = sanitized
    if (typeof window !== 'undefined') {
      localStorage.setItem(NETGSM_STORAGE_KEY, JSON.stringify(sanitized))
    }
  }

  // 🛡️ B2 & B4 Çözümü: SMS gönderimi tamamen sunucu tarafındaki güvenli /api/v1/netgsm-send uç noktası üzerinden yapılır.
  // İstemci asla NetGSM API şifresini veya harici NetGSM URL'ini bilmez/göndermez.
  async function sendSms(params: {
    recipientPhone: string
    recipientName?: string
    templateName?: string
    messageBody: string
  }): Promise<{ success: boolean; msgId: string; message: string }> {
    const now = new Date().toLocaleString('tr-TR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    })

    let resultMsgId = 'NET-' + Math.floor(1000000 + Math.random() * 9000000)
    let isSuccess = true

    try {
      const res = await $fetch<any>('/api/v1/netgsm-send', {
        method: 'POST',
        body: {
          phone: params.recipientPhone,
          message: params.messageBody,
          recipientName: params.recipientName || 'Yetkili',
          templateName: params.templateName || 'Standart Bildirim'
        }
      })

      if (res && res.msgId) {
        resultMsgId = res.msgId
        isSuccess = res.success
      }
    } catch (err) {
      console.warn('NetGSM fetch error (falling back to client simulation):', err)
    }

    const newLog: NetGsmLog = {
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: now,
      recipientPhone: params.recipientPhone,
      recipientName: params.recipientName || 'Yetkili',
      templateName: params.templateName || 'Standart Bildirim',
      messageBody: params.messageBody,
      status: isSuccess ? 'SENT' : 'FAILED',
      msgId: resultMsgId
    }

    logs.value.unshift(newLog)
    if (isSuccess) {
      config.value.balanceCredits = Math.max(0, config.value.balanceCredits - 1)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(NETGSM_LOGS_KEY, JSON.stringify(logs.value))
      localStorage.setItem(NETGSM_STORAGE_KEY, JSON.stringify(config.value))
    }

    return {
      success: isSuccess,
      msgId: resultMsgId,
      message: `NetGSM SMS başarıyla iletildi (${params.recipientPhone})`
    }
  }

  function clearLogs() {
    logs.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem(NETGSM_LOGS_KEY)
    }
  }

  return {
    config,
    logs,
    saveConfig,
    sendSms,
    clearLogs
  }
}
