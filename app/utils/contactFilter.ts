/**
 * contactFilter.ts - İhaleciBurada B2B Güvenli İletişim & Harici İletişim Engelleme Motoru
 * 
 * Kurallar:
 * 1. Sistem içi mesajlaşmalarda telefon, e-posta, web sitesi veya harici haberleşme (WhatsApp, Telegram vb.) paylaşımı kesinlikle yasaktır.
 * 2. İhale sonuçlanana kadar alıcı ve teklif veren doğrudan iletişim bilgileri gizli/korumalı tutulur.
 * 3. Üye olmayan misafir kullanıcılara firma isimleri ve kurumsal iletişim bilgileri puslu/bulanık gösterilir.
 */

// 1. Standart ve ayrık/noktalı/tireli telefon numaraları (TR & Uluslararası)
const PHONE_PATTERNS = [
  // Standart formatlar: +90 532..., 0532..., (0532)...
  /(?:\+?90\s*|\b0\s*)?\(?([1-9][0-9]{2})\)?[\s\.\-_/\\*]*([0-9]{3})[\s\.\-_/\\*]*([0-9]{2})[\s\.\-_/\\*]*([0-9]{2})\b/g,
  // Ayrık veya aralıklı yazılmış 10-11 haneli rakam grupları: 0 5 3 2 1 2 3 4 5 6 7
  /\b0?[\s\.\-_/\\*]*5[\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9][\s\.\-_/\\*]*[0-9]\b/g,
  // 7 haneli yerel numara blokları: 212 444 55 66 veya 444 0 444
  /\b(?:0?[2-4][0-9]{2})[\s\.\-_/\\*]*[0-9]{3}[\s\.\-_/\\*]*[0-9]{2}[\s\.\-_/\\*]*[0-9]{2}\b/g,
  // 444'lü veya 0850'li kurumsal numaralar
  /\b(?:444[\s\.\-_/\\*]*[0-9]{3,4}|0?850[\s\.\-_/\\*]*[0-9]{3}[\s\.\-_/\\*]*[0-9]{2}[\s\.\-_/\\*]*[0-9]{2})\b/g,
  // Harf ile gizlenmiş 05... (o532..., O542...)
  /\b[oO0]5[0-9]{2}[\s\.\-_/\\*]*[0-9]{3}[\s\.\-_/\\*]*[0-9]{2}[\s\.\-_/\\*]*[0-9]{2}\b/g
]

// 2. E-posta adresleri (Standart ve [at] / [dot] şeklinde gizlenmiş)
const EMAIL_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  /[a-zA-Z0-9._%+-]+\s*(?:@|\[at\]|\(at\)|et|at)\s*[a-zA-Z0-9.-]+\s*(?:\.|\[dot\]|\(dot\)|nokta|dot)\s*(?:com|net|org|com\.tr|gov\.tr|edu\.tr|io|co|xyz|me)/gi,
  /\b[a-zA-Z0-9._%+-]+(?:\s*@\s*|\s+at\s+)(?:gmail|hotmail|yahoo|outlook|yandex|icloud|protonmail|kurumsal)(?:\.com|\.net|\.org|\.com\.tr)?\b/gi
]

// 3. Web siteleri, URL'ler ve alan adları
const URL_PATTERNS = [
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
  /\b(?:www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi,
  /\b[a-zA-Z0-9.-]+\.(?:com\.tr|com|net|org|gov\.tr|edu\.tr|gen\.tr|co|io|xyz|app|me|site|info|online|shop|store)\b/gi
]

// 4. Harici iletişim uygulamaları ve kanalları (WhatsApp, Telegram, vb.)
const APP_EVASION_PATTERNS = [
  /\b(?:wp|whatsapp|whats\s*app|vatsap|vat\s*sap|vatsapp)\b/gi,
  /\b(?:t\.me|telegram|teleg|tg)\/?[a-zA-Z0-9_]+/gi,
  /\b(?:wa\.me|api\.whatsapp)\/[0-9]+/gi,
  /\b(?:instagram|instam|instadan|ig:|ig\s*:)\s*@?[a-zA-Z0-9._]+/gi,
  /\b(?:skype|zoom|teams|discord|signal|bip|viber)\s*[:\-]?\s*@?[a-zA-Z0-9._]+/gi
]

// 5. Yazıyla yazılan rakam ve iletişim kaçırma ifadeleri (Türkçe)
const WRITTEN_NUMBER_KEYWORDS = [
  'sıfır', 'sifir', 'bir', 'iki', 'üç', 'uc', 'dört', 'dort', 'beş', 'bes',
  'altı', 'alti', 'yedi', 'sekiz', 'dokuz', 'on', 'yirmi', 'otuz', 'kırk', 'kirk',
  'elli', 'altmış', 'altmis', 'yetmiş', 'yetmis', 'seksen', 'doksan', 'yüz', 'yuz'
]

const CONTACT_CUES = [
  'özelden yaz', 'ozelden yaz', 'özelden ara', 'ozelden ara',
  'dışarıdan görüş', 'disaridan gorus', 'elden konuş', 'elden konus',
  'numaramı veriyorum', 'numarami veriyorum', 'numaram:', 'numaram :',
  'cepten ara', 'cepten yaz', 'bana ulaş:', 'bana ulas:', 'ulaşabilirsiniz:', 'ulasabilirsiniz:',
  'telden ara', 'arayın görüşelim', 'arayin goruselim', 'bana yaz tel', 'cep no', 'tel no'
]

export interface ContactDetectionResult {
  hasContact: boolean
  reason?: string
  matches: string[]
}

/**
 * Metin içinde harici iletişim bilgisi (telefon, e-posta, URL, harici uygulama) bulunup bulunmadığını kontrol eder.
 */
export function containsContactInfo(text: string): ContactDetectionResult {
  if (!text || typeof text !== 'string') {
    return { hasContact: false, matches: [] }
  }

  const matches: string[] = []
  const normalized = text.toLowerCase()

  // 1. Telefon taraması
  for (const pattern of PHONE_PATTERNS) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  // 2. E-posta taraması
  for (const pattern of EMAIL_PATTERNS) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  // 3. Web & URL taraması
  for (const pattern of URL_PATTERNS) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  // 4. Harici uygulama taraması
  for (const pattern of APP_EVASION_PATTERNS) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  // 5. İletişim kaçırma ifadeleri
  for (const cue of CONTACT_CUES) {
    if (normalized.includes(cue)) {
      matches.push(cue)
    }
  }

  // 6. Yazıyla yazılan telefon numaraları tespiti (ardışık en az 4 rakam kelimesi)
  const tokens = normalized.replace(/[^a-zçğıöşü\s]/g, ' ').split(/\s+/).filter(Boolean)
  let consecutiveNumbers = 0
  for (const tok of tokens) {
    if (WRITTEN_NUMBER_KEYWORDS.includes(tok)) {
      consecutiveNumbers++
      if (consecutiveNumbers >= 4) {
        matches.push('Yazıyla telefon numarası paylaşımı')
        break
      }
    } else {
      consecutiveNumbers = 0
    }
  }

  const uniqueMatches = Array.from(new Set(matches))

  if (uniqueMatches.length > 0) {
    return {
      hasContact: true,
      reason: '🛡️ Güvenlik Kuralı: İhale sonuçlanana kadar telefon numarası, e-posta, web sitesi veya harici iletişim kanalı paylaşımı yasaktır.',
      matches: uniqueMatches
    }
  }

  return { hasContact: false, matches: [] }
}

/**
 * Metindeki tüm harici iletişim bilgilerini güvenlik uyarısı etiketiyle sansürler.
 */
export function maskContactInfo(text: string): string {
  if (!text || typeof text !== 'string') return ''

  let result = text

  // Telefon numaralarını sansürle
  for (const pattern of PHONE_PATTERNS) {
    result = result.replace(pattern, '[🔒 Telefon Bilgisi Gizlendi]')
  }

  // E-postaları sansürle
  for (const pattern of EMAIL_PATTERNS) {
    result = result.replace(pattern, '[🔒 E-Posta Bilgisi Gizlendi]')
  }

  // Web / URL sansürle
  for (const pattern of URL_PATTERNS) {
    result = result.replace(pattern, '[🔒 Harici Bağlantı Gizlendi]')
  }

  // Harici uygulamaları sansürle
  for (const pattern of APP_EVASION_PATTERNS) {
    result = result.replace(pattern, '[🔒 Harici İletişim Kanalı Engellendi]')
  }

  return result
}

/**
 * Bir ihalenin sonuçlanıp sonuçlanmadığını kontrol eder.
 * İhale sonuçlanmadan önce alıcı/yüklenici iletişim bilgileri gizli tutulmalıdır.
 */
export function isTenderConcluded(tender: any): boolean {
  if (!tender) return false
  
  const status = (tender.durum || tender.status || '').toLowerCase()
  const durationText = (tender.sure || tender.kalanSure || tender.bitisTarihi || '').toLowerCase()

  if (status === 'closed' || status === 'tamamlandi' || status === 'onaylandi' || status === 'mutabakat' || status === 'sonuclandi') {
    return true
  }

  if (durationText.includes('sonuçlandı') || durationText.includes('sonuclandi') || durationText.includes('tamamlandı') || durationText.includes('mutabakat')) {
    return true
  }

  return false
}
