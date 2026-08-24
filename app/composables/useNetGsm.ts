import { ref, computed } from 'vue'

export interface NetGsmConfig {
  usercode: string
  password: string
  msgheader: string // SMS Gönderici Başlığı (Örn: IHALECI, IHALECIBURADA)
  apiUrl: string
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
    usercode: '8503080000',
    password: '••••••••',
    msgheader: 'IHALECI',
    apiUrl: 'https://api.netgsm.com.tr/sms/send/get',
    isActive: true,
    balanceCredits: 4850
  })

  const logs = ref<NetGsmLog[]>([
    {
      id: 'SMS-1092',
      timestamp: '24.08.2026 17:45',
      recipientPhone: '+90 532 555 01 23',
      recipientName: 'Kaya İnşaat Malzemeleri Ltd.',
      templateName: 'Teklif Kabulü & Anlaşma',
      messageBody: 'Sayın Yetkili, "10 KM Mıcır Yol Yapım İşi" ihalenizde teklifiniz onaylanmıştır. Alıcı irtibat bilgileri panelinize iletildi. https://gelanlasalim-v2.vercel.app/panel',
      status: 'SENT',
      msgId: 'NET-8472910'
    },
    {
      id: 'SMS-1091',
      timestamp: '24.08.2026 15:20',
      recipientPhone: '+90 544 222 45 67',
      recipientName: 'Delta Ofis Sistemleri A.Ş.',
      templateName: 'Pazarlık & Karşı Teklif',
      messageBody: 'Sayın Yetkili, "Kurumsal Ofis Malzemeleri Alımı" ihalesinde alıcı firma 38.000 TL karşı teklif iletmiştir. Detay: https://gelanlasalim-v2.vercel.app/panel/yaptigim-teklifler',
      status: 'SENT',
      msgId: 'NET-8472909'
    }
  ])

  // Load from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedConfig = localStorage.getItem(NETGSM_STORAGE_KEY)
      if (savedConfig) {
        config.value = JSON.parse(savedConfig)
      }
      const savedLogs = localStorage.getItem(NETGSM_LOGS_KEY)
      if (savedLogs) {
        logs.value = JSON.parse(savedLogs)
      }
    } catch (e) {
      console.warn('NetGSM storage read error:', e)
    }
  }

  function saveConfig(newConfig: NetGsmConfig) {
    config.value = { ...newConfig }
    if (typeof window !== 'undefined') {
      localStorage.setItem(NETGSM_STORAGE_KEY, JSON.stringify(config.value))
    }
  }

  // Send SMS function (Simulates API dispatch with live logs & notifications)
  async function sendSms(params: {
    recipientPhone: string
    recipientName: string
    templateName: string
    messageBody: string
  }): Promise<{ success: boolean; msgId: string; message: string }> {
    const msgId = 'NET-' + Math.floor(1000000 + Math.random() * 9000000)
    const now = new Date().toLocaleString('tr-TR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    })

    const newLog: NetGsmLog = {
      id: 'SMS-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: now,
      recipientPhone: params.recipientPhone,
      recipientName: params.recipientName,
      templateName: params.templateName,
      messageBody: params.messageBody,
      status: 'SENT',
      msgId
    }

    logs.value.unshift(newLog)
    config.value.balanceCredits = Math.max(0, config.value.balanceCredits - 1)

    if (typeof window !== 'undefined') {
      localStorage.setItem(NETGSM_LOGS_KEY, JSON.stringify(logs.value))
      localStorage.setItem(NETGSM_STORAGE_KEY, JSON.stringify(config.value))
    }

    return {
      success: true,
      msgId,
      message: `NetGSM SMS başarıyla gönderildi (${params.recipientPhone})`
    }
  }

  return {
    config,
    logs,
    saveConfig,
    sendSms
  }
}
