export interface NetGsmSendOptions {
  phone: string
  message: string
  usercode?: string
  password?: string
  msgheader?: string
  recipientName?: string
}

export interface NetGsmSendResult {
  success: boolean
  code: string
  msgId: string
  message: string
  rawResponse?: string
  timestamp: string
}

/**
 * 🛡️ Enterprise NetGSM SMS Dispatch Client
 * Formats Turkish GSM numbers (905XXXXXXXXX), communicates with NetGSM API,
 * and handles response codes according to NetGSM documentation.
 */
export async function sendViaNetGsm(options: NetGsmSendOptions): Promise<NetGsmSendResult> {
  const cleanPhone = (options.phone || '').replace(/[^0-9]/g, '')
  const timestamp = new Date().toISOString()
  const msgId = `NETGSM_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`

  if (!cleanPhone || !options.message) {
    return {
      success: false,
      code: 'INVALID_INPUT',
      msgId,
      message: 'Geçerli bir telefon numarası ve mesaj metni gereklidir.',
      timestamp
    }
  }

  // NetGSM GSM format check (must start with 905...)
  let formattedPhone = cleanPhone
  if (formattedPhone.startsWith('0')) {
    formattedPhone = formattedPhone.substring(1)
  }
  if (!formattedPhone.startsWith('90') && formattedPhone.length === 10) {
    formattedPhone = '90' + formattedPhone
  }

  const usercode = options.usercode || process.env.NETGSM_USERCODE || '8508408695'
  const password = options.password || process.env.NETGSM_PASSWORD || '0ZE3LG59'
  const msgheader = options.msgheader || process.env.NETGSM_HEADER || '8508408695'

  try {
    // If real credentials are provided (not dummy), make actual NetGSM HTTP call
    if (usercode && password && password !== '••••••••' && usercode !== '8503080000') {
      const netgsmUrl = `https://api.netgsm.com.tr/sms/send/get/?usercode=${encodeURIComponent(usercode)}&password=${encodeURIComponent(password)}&gsmno=${encodeURIComponent(formattedPhone)}&message=${encodeURIComponent(options.message)}&msgheader=${encodeURIComponent(msgheader)}&dil=TR`
      
      const response = await fetch(netgsmUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(6000)
      })
      const textResponse = (await response.text()).trim()

      // NetGSM response codes:
      // 00 veya 01 02 -> Başarılı (Görev ID döner)
      // 20 -> Mesaj metninde hata
      // 30 -> Geçersiz kullanıcı adı/şifre
      // 40 -> Gönderici adı (başlık) hatalı
      // 50 -> Abone hesabında kredi yok
      // 70 -> Hatalı sorgulama
      const isSuccess = textResponse.startsWith('00') || 
                        textResponse.startsWith('01') || 
                        textResponse.startsWith('02') || 
                        /^\d{5,}/.test(textResponse)

      return {
        success: isSuccess,
        code: isSuccess ? '00' : textResponse.slice(0, 10),
        msgId,
        rawResponse: textResponse,
        message: isSuccess 
          ? `NetGSM SMS başarıyla iletildi (${formattedPhone})` 
          : `NetGSM API yanıtı: ${textResponse}`,
        timestamp
      }
    }
  } catch (error: any) {
    console.warn('[NetGSM Client] Dispatch warning:', error.message)
    return {
      success: false,
      code: 'NETWORK_ERROR',
      msgId,
      message: `NetGSM servisi yanıt vermedi: ${error.message}`,
      timestamp
    }
  }

  // Fallback simulator for demo / local test environment
  return {
    success: true,
    code: '00',
    msgId,
    rawResponse: `00 ${msgId}`,
    message: `NetGSM SMS simülasyonu başarıyla çalıştı (${formattedPhone})`,
    timestamp
  }
}
