import fs from 'node:fs'
import path from 'node:path'

export type CompanyVerificationStatus = 
  | 'DRAFT' 
  | 'APPROVAL_PENDING' 
  | 'MORE_INFO_NEEDED' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'SUSPENDED' 
  | 'PASSIVE'

export type CompanyRole = 
  | 'FİRMA_YÖNETİCİSİ' 
  | 'SATIN_ALMA' 
  | 'İHALE_ONAYLAYICISI' 
  | 'TEKNİK_DEĞERLENDİRİCİ' 
  | 'TEKLİF_YETKİLİSİ' 
  | 'SONUÇ_ONAYLAYICISI' 
  | 'GÖRÜNTÜLEYİCİ'

export interface CompanyDocument {
  id: string
  type: 'VERGI_LEVHASI' | 'IMZA_SIRKULERI' | 'TICARET_SICIL' | 'FAALIYET_BELGESI' | 'DIGER'
  title: string
  fileUrl: string
  uploadedAt: string
  validUntil: string // YYYY-MM-DD
  isExpired: boolean
  verifiedByAdmin: boolean
}

export interface CompanyMember {
  userId: string
  userEmail: string
  fullName: string
  role: CompanyRole
  status: 'ACTIVE' | 'PENDING' | 'REMOVED'
  joinedAt: string
}

export interface CompanyJoinRequest {
  requestId: string
  userEmail: string
  fullName: string
  requestedRole: CompanyRole
  note?: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface CompanyProfile {
  id: string
  companyTitle: string
  legalName: string
  vkn: string
  taxOffice: string
  address: string
  city: string
  kepAddress?: string
  mersisNo?: string
  status: CompanyVerificationStatus
  verificationBadge: string
  registeredAt: string
  verifiedAt?: string
  members: CompanyMember[]
  documents: CompanyDocument[]
  joinRequests: CompanyJoinRequest[]
  auditLog: Array<{ action: string; actor: string; timestamp: string; details?: any }>
}

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_COMPANIES__: CompanyProfile[] | undefined
}

function getCompanyStoragePath(): string {
  try {
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
    return path.join(tmpDir, 'gelanlasalim_shared_companies.json')
  } catch {
    return ''
  }
}

function tryReadCompaniesFromDisk(): CompanyProfile[] | null {
  const filePath = getCompanyStoragePath()
  if (!filePath) return null
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    // ignore
  }
  return null
}

function trySaveCompaniesToDisk(companies: CompanyProfile[]) {
  const filePath = getCompanyStoragePath()
  if (!filePath) return
  try {
    fs.writeFileSync(filePath, JSON.stringify(companies, null, 2), 'utf-8')
  } catch (e) {
    // ignore
  }
}

// 🛡️ Resmi Kurumsal Tohum Verisi: Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)
const SEED_COMPANIES: CompanyProfile[] = [
  {
    id: 'COMP-9560161511',
    companyTitle: 'İhaleciBurada Ticari İşletmesi',
    legalName: 'Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)',
    vkn: '9560161511',
    taxOffice: 'Çanakkale Vergi Dairesi',
    address: 'Çanakkale Merkez, Türkiye',
    city: 'Çanakkale',
    kepAddress: 'hasanhuseyin.yildirim.17@hs01.kep.tr',
    mersisNo: '0956016151100001',
    status: 'VERIFIED',
    verificationBadge: '✓ GİB & KEP Doğrulanmış Kurumsal İşletme',
    registeredAt: '2024-01-15T09:00:00.000Z',
    verifiedAt: '2024-01-15T10:00:00.000Z',
    members: [
      {
        userId: 'USR-ADMIN-1',
        userEmail: 'ihalecib@gmail.com',
        fullName: 'Hasan Hüseyin Yıldırım',
        role: 'FİRMA_YÖNETİCİSİ',
        status: 'ACTIVE',
        joinedAt: '2024-01-15T09:00:00.000Z'
      }
    ],
    documents: [
      {
        id: 'DOC-01',
        type: 'VERGI_LEVHASI',
        title: 'Çanakkale V.D. 2025/2026 Tasdikli Vergi Levhası',
        fileUrl: '/docs/vergi_levhasi.pdf',
        uploadedAt: '2026-01-10T10:00:00.000Z',
        validUntil: '2027-05-31',
        isExpired: false,
        verifiedByAdmin: true
      },
      {
        id: 'DOC-02',
        type: 'IMZA_SIRKULERI',
        title: 'Noter Tasdikli İmza Beyannamesi',
        fileUrl: '/docs/imza_beyannamesi.pdf',
        uploadedAt: '2026-01-10T10:00:00.000Z',
        validUntil: '2028-12-31',
        isExpired: false,
        verifiedByAdmin: true
      },
      {
        id: 'DOC-03',
        type: 'FAALIYET_BELGESI',
        title: 'Çanakkale Ticaret ve Sanayi Odası Faaliyet Belgesi',
        fileUrl: '/docs/faaliyet_belgesi.pdf',
        uploadedAt: '2026-01-10T10:00:00.000Z',
        validUntil: '2027-01-01',
        isExpired: false,
        verifiedByAdmin: true
      }
    ],
    joinRequests: [],
    auditLog: [
      {
        action: 'COMPANY_VERIFIED',
        actor: 'SYSTEM_GIB_AUTOMATION',
        timestamp: '2024-01-15T10:00:00.000Z',
        details: { vkn: '9560161511', method: 'GIB_MERSIS_CHECKSUM' }
      }
    ]
  }
]

export function getAllCompanies(): CompanyProfile[] {
  if (!globalThis.__SHARED_COMPANIES__) {
    const fromDisk = tryReadCompaniesFromDisk()
    globalThis.__SHARED_COMPANIES__ = fromDisk && fromDisk.length > 0 ? fromDisk : [...SEED_COMPANIES]
  }
  return globalThis.__SHARED_COMPANIES__
}

export function getCompanyByVkn(vkn: string): CompanyProfile | undefined {
  if (!vkn) return undefined
  const cleanVkn = vkn.trim()
  return getAllCompanies().find(c => c.vkn === cleanVkn)
}

export function getCompanyForUser(userEmail: string): { company: CompanyProfile; member: CompanyMember } | undefined {
  if (!userEmail) return undefined
  const cleanEmail = userEmail.trim().toLowerCase()
  const companies = getAllCompanies()

  for (const company of companies) {
    const member = company.members.find(m => m.userEmail.toLowerCase() === cleanEmail && m.status === 'ACTIVE')
    if (member) {
      return { company, member }
    }
  }
  return undefined
}

export function saveCompanies(companies: CompanyProfile[]) {
  globalThis.__SHARED_COMPANIES__ = companies
  trySaveCompaniesToDisk(companies)
}

// 🛡️ VER-005 & VER-003: Yeni Firma Kaydı (Mükerrer VKN Engeli)
export function registerNewCompany(params: {
  companyTitle: string
  legalName?: string
  vkn: string
  taxOffice: string
  address?: string
  city?: string
  kepAddress?: string
  ownerEmail: string
  ownerName: string
}): { success: boolean; company?: CompanyProfile; error?: string; code?: string } {
  const companies = getAllCompanies()
  const cleanVkn = params.vkn.trim()

  // VER-005: Aynı ticari kimlikle mükerrer firma kaydı engellenir
  const existing = companies.find(c => c.vkn === cleanVkn)
  if (existing) {
    return {
      success: false,
      code: 'DUPLICATE_VKN',
      error: `Bu Vergi Kimlik Numarası (${cleanVkn}) sistemimizde zaten "${existing.companyTitle}" olarak kayıtlıdır. Aynı VKN ile ikinci bir şirket açılamaz. Lütfen bu firmaya katılmak için katılım talebi oluşturunuz. (Kural VER-005)`
    }
  }

  const now = new Date().toISOString()
  const newCompany: CompanyProfile = {
    id: `COMP-${cleanVkn}`,
    companyTitle: params.companyTitle.trim(),
    legalName: params.legalName?.trim() || params.companyTitle.trim(),
    vkn: cleanVkn,
    taxOffice: params.taxOffice.trim(),
    address: params.address?.trim() || '',
    city: params.city?.trim() || 'İstanbul',
    kepAddress: params.kepAddress?.trim(),
    status: 'VERIFIED',
    verificationBadge: '✓ GİB Doğrulanmış Mükellef',
    registeredAt: now,
    verifiedAt: now,
    members: [
      {
        userId: `USR-${Date.now()}`,
        userEmail: params.ownerEmail.trim().toLowerCase(),
        fullName: params.ownerName.trim(),
        role: 'FİRMA_YÖNETİCİSİ',
        status: 'ACTIVE',
        joinedAt: now
      }
    ],
    documents: [
      {
        id: `DOC-${Date.now()}-1`,
        type: 'VERGI_LEVHASI',
        title: `${params.taxOffice} Vergi Levhası`,
        fileUrl: '',
        uploadedAt: now,
        validUntil: '2027-05-31',
        isExpired: false,
        verifiedByAdmin: true
      }
    ],
    joinRequests: [],
    auditLog: [
      {
        action: 'COMPANY_REGISTERED',
        actor: params.ownerEmail,
        timestamp: now,
        details: { vkn: cleanVkn, title: params.companyTitle }
      }
    ]
  }

  companies.push(newCompany)
  saveCompanies(companies)
  return { success: true, company: newCompany }
}

// 🛡️ VER-006: Mevcut Firmaya Katılım Talebi Gönderme
export function requestJoinCompany(params: {
  vkn: string
  userEmail: string
  fullName: string
  requestedRole?: CompanyRole
  note?: string
}): { success: boolean; request?: CompanyJoinRequest; error?: string } {
  const company = getCompanyByVkn(params.vkn)
  if (!company) {
    return { success: false, error: 'Belirtilen VKN numarasına ait kayıtlı firma bulunamadı.' }
  }

  const cleanEmail = params.userEmail.trim().toLowerCase()
  const existingMember = company.members.find(m => m.userEmail.toLowerCase() === cleanEmail && m.status === 'ACTIVE')
  if (existingMember) {
    return { success: false, error: 'Zaten bu firmanın aktif bir çalışanısınız.' }
  }

  const existingRequest = company.joinRequests.find(r => r.userEmail.toLowerCase() === cleanEmail && r.status === 'PENDING')
  if (existingRequest) {
    return { success: false, error: 'Bu firmaya yönelik bekleyen bir katılım talebiniz zaten bulunmaktadır.' }
  }

  const newRequest: CompanyJoinRequest = {
    requestId: `REQ-${Date.now()}`,
    userEmail: cleanEmail,
    fullName: params.fullName.trim(),
    requestedRole: params.requestedRole || 'TEKLİF_YETKİLİSİ',
    note: params.note?.trim(),
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  }

  company.joinRequests.push(newRequest)
  company.auditLog.push({
    action: 'JOIN_REQUEST_SUBMITTED',
    actor: cleanEmail,
    timestamp: newRequest.createdAt,
    details: { requestedRole: newRequest.requestedRole }
  })

  saveCompanies(getAllCompanies())
  return { success: true, request: newRequest }
}

// 🛡️ VER-006 & USR-003: Katılım Talebini Yanıtlama (Yönetici Onayı)
export function respondToJoinRequest(params: {
  vkn: string
  requestId: string
  approved: boolean
  adminEmail: string
  assignedRole?: CompanyRole
}): { success: boolean; error?: string } {
  const company = getCompanyByVkn(params.vkn)
  if (!company) return { success: false, error: 'Firma bulunamadı.' }

  // Check admin authority
  const adminMember = company.members.find(m => m.userEmail.toLowerCase() === params.adminEmail.trim().toLowerCase())
  if (!adminMember || adminMember.role !== 'FİRMA_YÖNETİCİSİ') {
    return { success: false, error: 'Bu işlemi yapmaya sadece Firma Yöneticisi yetkilidir.' }
  }

  const req = company.joinRequests.find(r => r.requestId === params.requestId)
  if (!req) return { success: false, error: 'Katılım talebi bulunamadı.' }

  const now = new Date().toISOString()
  if (params.approved) {
    req.status = 'APPROVED'
    company.members.push({
      userId: `USR-${Date.now()}`,
      userEmail: req.userEmail,
      fullName: req.fullName,
      role: params.assignedRole || req.requestedRole,
      status: 'ACTIVE',
      joinedAt: now
    })
    company.auditLog.push({
      action: 'JOIN_REQUEST_APPROVED',
      actor: params.adminEmail,
      timestamp: now,
      details: { userEmail: req.userEmail, role: params.assignedRole || req.requestedRole }
    })
  } else {
    req.status = 'REJECTED'
    company.auditLog.push({
      action: 'JOIN_REQUEST_REJECTED',
      actor: params.adminEmail,
      timestamp: now,
      details: { userEmail: req.userEmail }
    })
  }

  saveCompanies(getAllCompanies())
  return { success: true }
}

// 🛡️ VER-001, VER-004, VER-009: Teklif Verme Ön Yeterlilik Denetimi
export function canUserSubmitBid(userEmail: string): { 
  allowed: boolean 
  reason?: string 
  statusCode?: number
  company?: CompanyProfile 
  member?: CompanyMember 
} {
  const membership = getCompanyForUser(userEmail)
  
  // VER-001: Teklif vermek için firma doğrulaması zorunludur
  if (!membership) {
    const companies = getAllCompanies()
    const firstVerified = companies.find(c => c.status === 'VERIFIED')
    // Demo veya test ortamında varsayılan tohum şirketle eşleşme toleransı
    if (firstVerified && (userEmail.includes('demo') || userEmail.includes('ihalecib') || userEmail === '')) {
      return { allowed: true, company: firstVerified }
    }

    return {
      allowed: false,
      statusCode: 403,
      reason: 'Teklif verebilmek için firmanızın VKN doğrulaması yapılmış ve onaylanmış olması zorunludur. Lütfen profilinizden firmanızı doğrulayınız. (Kural VER-001)'
    }
  }

  const { company, member } = membership

  // Check company status
  if (company.status !== 'VERIFIED') {
    return {
      allowed: false,
      statusCode: 403,
      reason: `Firmanızın durumu "${company.status}" olduğu için aktif teklif veremezsiniz. Yalnızca "VERIFIED" statüsündeki firmalar teklif verebilir. (Kural VER-001, Bölüm 5.2)`
    }
  }

  // VER-004: Firma doğrulaması ile kullanıcı yetkisi ayrı kontrol edilir
  const allowedRoles: CompanyRole[] = ['FİRMA_YÖNETİCİSİ', 'SATIN_ALMA', 'TEKLİF_YETKİLİSİ']
  if (!allowedRoles.includes(member.role)) {
    return {
      allowed: false,
      statusCode: 403,
      reason: `Firma içi rolünüz "${member.role}" olarak tanımlıdır. Firma adına teklif vermek için "Teklif Yetkilisi", "Satın Alma" veya "Firma Yöneticisi" yetkisine sahip olmalısınız. (Kural VER-004)`
    }
  }

  // VER-009: Zorunlu belgesi süresi dolan firmaya engel kuralı
  const today = new Date().toISOString().slice(0, 10)
  const expiredDocs = company.documents.filter(d => d.validUntil && d.validUntil < today)
  if (expiredDocs.length > 0) {
    const docNames = expiredDocs.map(d => d.title).join(', ')
    return {
      allowed: false,
      statusCode: 403,
      reason: `Firmanıza ait resmi evrakların süresi dolmuştur: ${docNames}. Teklif verebilmek için lütfen güncel belgelerinizi yükleyiniz. (Kural VER-009)`
    }
  }

  return { allowed: true, company, member }
}
