import fs from 'node:fs'
import path from 'node:path'
import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'

export interface LegalDocumentMetadata {
  code: string
  title: string
  version: string
  effectiveDate: string
  lawReference: string
  description: string
  isRequiredForBidding: boolean
}

export interface UserContractAcceptance {
  id: string
  userEmail: string
  companyVkn?: string
  documentCode: string
  documentVersion: string
  acceptedAt: string
  ipAddress: string
  userAgent?: string
  channel: 'WEB' | 'MOBILE' | 'MFA_CONFIRMED'
  isExplicitConsent: boolean // 🛡️ LEG-006: Açık Rıza ayrımı
  isCommercialCommConsent?: boolean // 🛡️ LEG-006: Ticari İleti İzni ayrımı
}

export interface DataInventoryItem {
  category: string
  dataFields: string[]
  processingPurposes: string[]
  legalBasis: string // KVKK Md. 5/2 vs Md. 5/1
  recipientGroups: string[]
  retentionPeriod: string // 🛡️ LEG-007
  destructionMethod: 'SILME' | 'YOK_ETME' | 'ANONIMLESTIRME'
}

export interface PlatformSanctionItem {
  code: string
  title: string
  description: string
  severity: 'UYARI' | 'GECICI_ASKA' | 'TEKLIF_IPTALI' | 'SUREKLI_MEN'
  reasoningRequired: boolean // 🛡️ LEG-009
  appealProcedure: string // 🛡️ LEG-010
}

// 🛡️ LEG-001 - LEG-003: Platform Resmi Sözleşme ve Politika Seti
export const OFFICIAL_LEGAL_DOCUMENTS: LegalDocumentMetadata[] = [
  {
    code: 'TERMS_OF_USE',
    title: 'Platform Kullanım ve Üyelik Sözleşmesi',
    version: '2.1',
    effectiveDate: '2026-09-12',
    lawReference: '6098 s. TBK, 6102 s. TTK',
    description: 'Platform ile kullanıcı/firma arasındaki ilişki ve genel platform kuralları.',
    isRequiredForBidding: true
  },
  {
    code: 'INTERMEDIARY_FRAMEWORK',
    title: 'Aracı Hizmet Sağlayıcı Elektronik Ortam Sözleşmesi',
    version: '2.0',
    effectiveDate: '2026-09-12',
    lawReference: '6563 s. ETK Madde 9',
    description: 'İhaleciBurada mal/hizmetin tarafı değildir; elektronik ihale ortamını ve izlenebilirliği sağlar (LEG-001, LEG-002).',
    isRequiredForBidding: true
  },
  {
    code: 'AUCTION_RULES',
    title: 'İhale Katılım, Teklif ve İptal Kuralları',
    version: '2.0',
    effectiveDate: '2026-09-12',
    lawReference: '6098 s. TBK Md. 270-281 (Artırma/Eksiltme)',
    description: 'Açık eksiltme, kapalı zarf, teklif bağlayıcılığı, anti-sniping ve standart iptal gerekçeleri.',
    isRequiredForBidding: true
  },
  {
    code: 'VERIFICATION_POLICY',
    title: 'Firma Doğrulama Politikası ve Rozet Kapsamı',
    version: '1.5',
    effectiveDate: '2026-09-12',
    lawReference: '6102 s. TTK Md. 39 & VUK',
    description: 'Firma rozetlerinin kapsamı: Ticari kayıt, imza sirküleri ve VKN doğrulandı. Ödeme gücü veya mal kalitesi garantisi değildir (LEG-003).',
    isRequiredForBidding: true
  },
  {
    code: 'KVKK_DISCLOSURE',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    version: '2.0',
    effectiveDate: '2026-09-12',
    lawReference: '6698 s. KVKK Madde 10 & 11',
    description: 'Veri sorumlusu Hasan Hüseyin Yıldırım (İhaleciBurada) kişisel veri işleme faaliyetleri ve haklar (LEG-005, LEG-006).',
    isRequiredForBidding: true
  },
  {
    code: 'DATA_RETENTION_POLICY',
    title: 'Veri Saklama ve İmha Politikası',
    version: '1.2',
    effectiveDate: '2026-09-12',
    lawReference: '213 s. VUK Md. 253, 5651 s. Kanun',
    description: 'Veri kategorisi bazında saklama süreleri ve periyodik imha prosedürü (LEG-007).',
    isRequiredForBidding: false
  },
  {
    code: 'DISPUTE_RESOLUTION',
    title: 'Platform İçi İtiraz ve Uyuşmazlık Çözüm Bildirimi',
    version: '1.0',
    effectiveDate: '2026-09-12',
    lawReference: '6100 s. HMK & 6325 s. Hukuk Uyuşmazlıklarında Arabuluculuk K.',
    description: 'Platform içi şikâyet/itiraz mekanizması yargı yolunun yerine geçmez (LEG-010).',
    isRequiredForBidding: false
  }
]

// 🛡️ LEG-005: Kişisel Veri Envanteri
export const OFFICIAL_DATA_INVENTORY: DataInventoryItem[] = [
  {
    category: 'Kimlik Bilgisi',
    dataFields: ['Ad', 'Soyad', 'T.C. Kimlik No (Yetkili)', 'İmza Sirküleri Yetkili Bilgisi'],
    processingPurposes: ['Üyelik sözleşmesinin kurulması', 'Firma adına yetkili temsil doğrulama (USR-001/002)', 'Yasal yükümlülükler'],
    legalBasis: 'KVKK Md. 5/2 (c) Sözleşmenin ifası & (ç) Hukuki yükümlülük',
    recipientGroups: ['Yetkili Kamu Kurumları (GİB, Adli Merciler)'],
    retentionPeriod: 'Üyelik sona ermesinden itibaren 10 yıl (TTK Md. 82 / TBK Md. 146)',
    destructionMethod: 'SILME'
  },
  {
    category: 'İletişim Bilgisi',
    dataFields: ['E-posta Adresi', 'Cep Telefonu No', 'Şirket KEP Adresi', 'Firma Adresi'],
    processingPurposes: ['İhale bildirimleri (COM-001)', 'MFA güvenlik kodları gönderimi (SEC-009)', 'Resmî tebligat'],
    legalBasis: 'KVKK Md. 5/2 (c) & Ticari İleti için Md. 5/1 Açık Rıza',
    recipientGroups: ['SMS Sağlayıcı (NetGSM - Yurtiçi)', 'E-Posta Servisi (SMTP)'],
    retentionPeriod: 'Sözleşme süresi + 3 yıl (İYS / Ticari Elektronik İleti mevzuatı)',
    destructionMethod: 'SILME'
  },
  {
    category: 'İşlem Güvenliği & Trafik Verisi',
    dataFields: ['IP Adresi', 'Port Bilgisi', 'User-Agent', 'Oturum Zaman Damgaları', 'Audit Logları'],
    processingPurposes: ['5651 SK uyarınca trafik kaydı tutma', 'Danışıklı teklif önleme (SEC-014)', 'Sistem güvenliği (SEC-006)'],
    legalBasis: 'KVKK Md. 5/2 (ç) Kanunlarda açıkça öngörülmesi & (f) Meşru menfaat',
    recipientGroups: ['BTK / Adli Makamlar (Yalnız talep halinde)'],
    retentionPeriod: '2 yıl (5651 sayılı Kanun gereğince zorunlu saklama)',
    destructionMethod: 'ANONIMLESTIRME'
  },
  {
    category: 'Teklif & Finansal Ticari İşlem',
    dataFields: ['Teklif Tutarı', 'Banka Bilgisi', 'Fatura Bilgisi', 'İhale Sonuç Tutanağı'],
    processingPurposes: ['İhale sonucunun belgelenmesi (AWD-010)', 'Escrow havuz mutabakatı', 'Vergi mevzuatı uyumu'],
    legalBasis: 'KVKK Md. 5/2 (a) Kanunlarda öngörülme & (c) Sözleşmenin ifası',
    recipientGroups: ['Alıcı ve Satıcı Taraflar', 'BDDK Onaylı Ödeme Kuruluşu'],
    retentionPeriod: '10 yıl (213 s. VUK Madde 253 & 6102 s. TTK)',
    destructionMethod: 'ANONIMLESTIRME'
  }
]

// 🛡️ LEG-009: Platform Yaptırımları Kataloğu
export const OFFICIAL_SANCTIONS_CATALOG: PlatformSanctionItem[] = [
  {
    code: 'SANCT-01',
    title: 'Yazılı Uyarı ve İhtar',
    description: 'Hafif şartname ihlali veya sisteme yanıltıcı bilgi girişi teşebbüsü.',
    severity: 'UYARI',
    reasoningRequired: true,
    appealProcedure: 'Kullanıcı bildirim tarihinden itibaren 5 iş günü içinde destek masasına itiraz edebilir (LEG-010).'
  },
  {
    code: 'SANCT-02',
    title: 'Geçici Hesap Askıya Alma (15 - 90 Gün)',
    description: 'Kazandığı ihaleden haklı bir mücbir sebep olmaksızın vazgeçme veya temerrüde düşme.',
    severity: 'GECICI_ASKA',
    reasoningRequired: true,
    appealProcedure: 'Gerekçeli savunma ve mücbir sebep belgesi ile itiraz komisyonuna başvuru.'
  },
  {
    code: 'SANCT-03',
    title: 'Teklifin Re\'sen İptali ve Güvenlik İncelemesi',
    description: 'Danışıklı teklif verme (collusion) veya aynı IP/cihazdan rakip teklif sunulması şüphesi (SEC-014).',
    severity: 'TEKLIF_IPTALI',
    reasoningRequired: true,
    appealProcedure: 'Yönetim kuruluna ticari sicil ve bağımsızlık teyidi sunulması.'
  },
  {
    code: 'SANCT-04',
    title: 'Sürekli Men ve Kara Liste',
    description: 'Sahte vergi levhası, yetkisiz kimlik kullanımı veya manipülatif ihale bozma faaliyeti.',
    severity: 'SUREKLI_MEN',
    reasoningRequired: true,
    appealProcedure: 'Yasal adli yollara başvuru hakkı saklıdır.'
  }
]

let inMemoryAcceptances: UserContractAcceptance[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.legal_acceptances.json')
const TMP_FILE = '/tmp/ihaleciburada_legal_acceptances.json'

function getStoragePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) return TMP_FILE
  } catch {}
  return BACKUP_FILE
}

function readFromDisk(): UserContractAcceptance[] {
  const filePath = getStoragePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('[Legal Store] Read error:', e)
  }
  return []
}

function writeToDisk(items: UserContractAcceptance[]) {
  const filePath = getStoragePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(items.slice(0, 3000), null, 2), 'utf-8')
  } catch (e) {
    console.warn('[Legal Store] Write error:', e)
  }
}

export function getAllAcceptances(): UserContractAcceptance[] {
  if (!inMemoryAcceptances) {
    inMemoryAcceptances = readFromDisk()
    if (inMemoryAcceptances.length === 0) {
      // Seed default admin acceptance
      inMemoryAcceptances = [
        {
          id: 'ACC-INIT-001',
          userEmail: 'ihalecib@gmail.com',
          companyVkn: '9560161511',
          documentCode: 'TERMS_OF_USE',
          documentVersion: '2.1',
          acceptedAt: new Date().toISOString(),
          ipAddress: '127.0.0.1',
          channel: 'WEB',
          isExplicitConsent: true,
          isCommercialCommConsent: true
        }
      ]
      writeToDisk(inMemoryAcceptances)
    }
  }
  return inMemoryAcceptances
}

/**
 * 🛡️ LEG-001 & LEG-004 & LEG-006: Sözleşme Kabulünün Versiyon, Zaman ve IP ile Saklanması
 */
export function recordAcceptance(
  eventOrReq: H3Event | null,
  data: {
    userEmail: string
    companyVkn?: string
    documentCode: string
    documentVersion?: string
    channel?: 'WEB' | 'MOBILE' | 'MFA_CONFIRMED'
    isExplicitConsent?: boolean
    isCommercialCommConsent?: boolean
    ipAddress?: string
    userAgent?: string
  }
): UserContractAcceptance {
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

  // Belge bilgisi doğrula
  const docMeta = OFFICIAL_LEGAL_DOCUMENTS.find(d => d.code === data.documentCode)
  const version = data.documentVersion || (docMeta ? docMeta.version : '1.0')

  const list = getAllAcceptances()
  const id = `ACC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`

  const item: UserContractAcceptance = {
    id,
    userEmail: data.userEmail.toLowerCase().trim(),
    companyVkn: data.companyVkn,
    documentCode: data.documentCode,
    documentVersion: version,
    acceptedAt: new Date().toISOString(),
    ipAddress: ip,
    userAgent: ua,
    channel: data.channel || 'WEB',
    isExplicitConsent: Boolean(data.isExplicitConsent),
    isCommercialCommConsent: Boolean(data.isCommercialCommConsent)
  }

  list.unshift(item)
  writeToDisk(list)
  return item
}

export function getUserAcceptances(email: string): UserContractAcceptance[] {
  const cleanEmail = email.toLowerCase().trim()
  return getAllAcceptances().filter(a => a.userEmail === cleanEmail)
}

export function checkHasAcceptedLatest(email: string, documentCode: string): boolean {
  const docMeta = OFFICIAL_LEGAL_DOCUMENTS.find(d => d.code === documentCode)
  if (!docMeta) return false

  const userAcceptances = getUserAcceptances(email)
  return userAcceptances.some(a => a.documentCode === documentCode && a.documentVersion === docMeta.version)
}
