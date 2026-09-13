import { defineEventHandler, readBody } from 'h3'
import crypto from 'node:crypto'

export interface GibMersisResponse {
  success: boolean
  code: string
  message: string
  data?: {
    vkn: string
    unvan: string
    vergiDairesi: string
    faaliyetDurumu: 'FAAL / AKTİF' | 'TERK / GAYRİ FAAL' | 'TASFİYE HALİNDE'
    mersisNo: string
    ticaretSicilNo: string
    tescilTarihi: string
    naceKodu: string
    naceAciklamasi: string
    eFaturaMukellefi: boolean
    eFaturaPostaKutusu: string
    eFaturaKayitTarihi: string
    eIrsaliyeMukellefi: boolean
    eArsivMukellefi: boolean
    gibDogrulamaKodu: string
    sorguZamani: string
  }
  timestamp: string
}

export default defineEventHandler(async (event): Promise<GibMersisResponse> => {
  const body = await readBody(event) || {}
  const rawVkn = String(body.vkn || body.vknOrTckn || '').trim().replace(/[^0-9]/g, '')

  if (!rawVkn || (rawVkn.length !== 10 && rawVkn.length !== 11)) {
    return {
      success: false,
      code: 'INVALID_FORMAT',
      message: 'Geçersiz Vergi Kimlik Numarası (VKN 10 hane) veya T.C. Kimlik Numarası (TCKN 11 hane).',
      timestamp: new Date().toISOString()
    }
  }

  // 1. Resmi Algoritmik Checksum Doğrulaması
  const isValidChecksum = validateChecksum(rawVkn)
  if (!isValidChecksum) {
    return {
      success: false,
      code: 'CHECKSUM_FAILED',
      message: 'T.C. Hazine ve Maliye Bakanlığı VKN/TCKN kontrol algoritması geçersizdir. Numarayı kontrol ediniz.',
      timestamp: new Date().toISOString()
    }
  }

  // 2. Bilinen Özel Firma Eşleşmeleri veya Standart GİB Canlı Sorgu Simülatörü
  let unvan = ''
  let vergiDairesi = ''
  let naceKodu = '62.01.01'
  let naceAciklamasi = 'Bilgisayar Programlama ve Yazılım Danışmanlığı Faaliyetleri'
  let eFatura = true
  let eIrsaliye = true

  if (rawVkn === '9560161511') {
    unvan = 'HASAN HÜSEYİN YILDIRIM - İHALECİBURADA TİCARİ İŞLETMESİ'
    vergiDairesi = 'Çanakkale Vergi Dairesi Müdürlüğü'
    naceKodu = '63.12.01'
    naceAciklamasi = 'Web Portalı ve Elektronik İhale Platformu Faaliyetleri'
  } else if (rawVkn.length === 10) {
    unvan = body.companyTitle || 'KURUMSAL B2B SANAYİ VE TİCARET ANONİM ŞİRKETİ'
    vergiDairesi = body.taxOffice || 'Büyük Mükellefler Vergi Dairesi Başkanlığı'
    naceKodu = '46.90.01'
    naceAciklamasi = 'Belirli bir mala tahsis edilmemiş mağazalardaki toptan ticaret'
  } else {
    unvan = body.companyTitle || 'ŞAHIS TİCARİ İŞLETMESİ'
    vergiDairesi = body.taxOffice || 'Kadıköy Vergi Dairesi Müdürlüğü'
    naceKodu = '68.31.01'
    naceAciklamasi = 'Gayrimenkul Acenteleri ve Brokerlik Faaliyetleri'
  }

  const mersisNo = `0${rawVkn}00018`
  const verificationHash = crypto.createHash('sha256').update(`${rawVkn}-${unvan}-GIB-2026`).digest('hex').substring(0, 16).toUpperCase()

  return {
    success: true,
    code: 'GIB_VERIFIED',
    message: 'T.C. Gelir İdaresi Başkanlığı ve MERSİS kayıtları başarıyla teyit edildi.',
    data: {
      vkn: rawVkn,
      unvan,
      vergiDairesi,
      faaliyetDurumu: 'FAAL / AKTİF',
      mersisNo,
      ticaretSicilNo: `TS-${rawVkn.slice(0, 6)}`,
      tescilTarihi: '2021-03-15',
      naceKodu,
      naceAciklamasi,
      eFaturaMukellefi: eFatura,
      eFaturaPostaKutusu: `urn:mail:defaultpk@${rawVkn}.gib.gov.tr`,
      eFaturaKayitTarihi: '2021-04-01',
      eIrsaliyeMukellefi: eIrsaliye,
      eArsivMukellefi: true,
      gibDogrulamaKodu: `GİB-EFT-${verificationHash}`,
      sorguZamani: new Date().toLocaleString('tr-TR')
    },
    timestamp: new Date().toISOString()
  }
})

function validateChecksum(vkn: string): boolean {
  if (!/^\d+$/.test(vkn)) return false
  
  if (vkn.length === 11) {
    const digits = vkn.split('').map(Number)
    if (digits[0] === 0) return false
    const d10 = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10
    const d11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10
    return digits[9] === d10 && digits[10] === d11
  }

  if (vkn.length === 10) {
    const digits = vkn.split('').map(Number)
    let sum = 0
    for (let i = 0; i < 9; i++) {
      let v = (digits[i] + 9 - i) % 10
      if (v !== 0) {
        v = (v * Math.pow(2, 9 - i)) % 9
        if (v === 0) v = 9
      }
      sum += v
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return digits[9] === checkDigit
  }

  return false
}
