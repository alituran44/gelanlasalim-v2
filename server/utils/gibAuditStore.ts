import fs from 'node:fs'
import path from 'node:path'

export interface GibAuditLogItem {
  id: string
  tenderId: string
  tenderTitle: string
  action: 'IHALE_ACILDI' | 'IHALE_GUNCELLENDI' | 'IHALE_MUTABAKAT' | 'IHALE_IPTAL'
  actionLabel: string
  category: string
  budget: string
  direction: string
  taxIdType: 'VKN' | 'TCKN'
  taxId: string
  taxOffice: string
  companyOrFullName: string
  ownerEmail: string
  ownerPhone: string
  city: string
  address: string
  ipAddress: string
  port?: string
  userAgent?: string
  timestamp: string
  period: string // YYYY-MM
  status: 'HAZIR' | 'BILDIRILDI' | 'EKSIK_BILGI'
  url?: string
}

// In-memory cache
let inMemoryGibLogs: GibAuditLogItem[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.gib_audit_logs.json')
const TMP_FILE = '/tmp/ihaleciburada_gib_audit_logs.json'

function getFilePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) {
      return TMP_FILE
    }
  } catch (e) {}
  return BACKUP_FILE
}

const SEED_GIB_LOGS: GibAuditLogItem[] = [
  {
    id: 'GIB-2026-0901',
    tenderId: 'IHC-2026-901',
    tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi',
    action: 'IHALE_ACILDI',
    actionLabel: 'Yeni İhale İlanı Oluşturuldu',
    category: 'İnşaat ve Yapı / Çelik Yapı & Çatı',
    budget: '18.500.000 ₺',
    direction: 'Kapalı Zarf Usulü',
    taxIdType: 'VKN',
    taxId: '5920192847',
    taxOffice: 'Balıkesir Vergi Dairesi',
    companyOrFullName: 'Marmara Çelik ve Ağır Sanayi A.Ş.',
    ownerEmail: 'satinalma@marmaracelik.com.tr',
    ownerPhone: '+90 266 281 10 00',
    city: 'Balıkesir',
    address: 'Organize Sanayi Bölgesi 14. Cadde No:8 Balıkesir',
    ipAddress: '176.240.112.45',
    port: '54128',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    timestamp: '2026-09-01T09:14:22.000Z',
    period: '2026-09',
    status: 'HAZIR',
    url: 'https://www.ihaleciburada.com/panel/pazar-yeri?id=IHC-2026-901'
  },
  {
    id: 'GIB-2026-0902',
    tenderId: 'IHC-2026-902',
    tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi',
    action: 'IHALE_ACILDI',
    actionLabel: 'Yeni İhale İlanı Oluşturuldu',
    category: 'Lojistik ve Taşımacılık / Karayolu Nakliye',
    budget: '4.200.000 ₺',
    direction: 'Açık Eksiltme (Fiyat Azaltımlı)',
    taxIdType: 'VKN',
    taxId: '4700854210',
    taxOffice: 'Çanakkale Vergi Dairesi',
    companyOrFullName: 'Mega Lojistik ve Dağıtım A.Ş.',
    ownerEmail: 'operasyon@megalojistik.com.tr',
    ownerPhone: '+90 286 217 40 50',
    city: 'Çanakkale',
    address: 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale',
    ipAddress: '88.255.190.12',
    port: '49821',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2026-09-01T11:30:15.000Z',
    period: '2026-09',
    status: 'HAZIR',
    url: 'https://www.ihaleciburada.com/panel/pazar-yeri?id=IHC-2026-902'
  },
  {
    id: 'GIB-2026-0903',
    tenderId: 'IHC-2026-903',
    tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı',
    action: 'IHALE_ACILDI',
    actionLabel: 'Yeni İhale İlanı Oluşturuldu',
    category: 'Sanayi ve Makine / CNC & Takım Tezgahları',
    budget: '8.900.000 ₺',
    direction: 'Kapalı Zarf Usulü',
    taxIdType: 'VKN',
    taxId: '0681928471',
    taxOffice: 'Bursa Nilüfer Vergi Dairesi',
    companyOrFullName: 'Anadolu Çelik ve Metal Sanayi A.Ş.',
    ownerEmail: 'tedarik@anadolumetal.com.tr',
    ownerPhone: '+90 224 441 90 90',
    city: 'Bursa',
    address: 'Nilüfer Organize Sanayi Bölgesi Mavi Cadde Bursa',
    ipAddress: '195.175.204.60',
    port: '51204',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    timestamp: '2026-09-02T14:45:00.000Z',
    period: '2026-09',
    status: 'HAZIR',
    url: 'https://www.ihaleciburada.com/panel/pazar-yeri?id=IHC-2026-903'
  },
  {
    id: 'GIB-2026-0904',
    tenderId: 'IHC-2026-904',
    tenderTitle: 'E-Ticaret & İhracat Ambalajı İçin 200.000 Adet Çift Dalga Kraft Koli Alımı',
    action: 'IHALE_ACILDI',
    actionLabel: 'Yeni İhale İlanı Oluşturuldu',
    category: 'Ambalaj ve Kağıt / Oluklu Mukavva Koli',
    budget: '1.650.000 ₺',
    direction: 'Açık Eksiltme',
    taxIdType: 'VKN',
    taxId: '3819283746',
    taxOffice: 'İlyasbey Vergi Dairesi',
    companyOrFullName: 'Paketle Ambalaj ve Lojistik Sanayi Ltd. Şti.',
    ownerEmail: 'info@paketleambalaj.com.tr',
    ownerPhone: '+90 262 642 11 22',
    city: 'Kocaeli',
    address: 'Gebze Plastikçiler OSB Kocaeli',
    ipAddress: '212.156.40.18',
    port: '48320',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0.0.0',
    timestamp: '2026-09-03T16:10:00.000Z',
    period: '2026-09',
    status: 'HAZIR',
    url: 'https://www.ihaleciburada.com/panel/pazar-yeri?id=IHC-2026-904'
  }
]

function readFromDisk(): GibAuditLogItem[] | null {
  const filePath = getFilePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('[GIB Audit Store] read error:', e)
  }
  return null
}

function writeToDisk(logs: GibAuditLogItem[]): void {
  const filePath = getFilePath()
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf-8')
  } catch (e) {
    console.warn('[GIB Audit Store] write error:', e)
  }
}

export function getAllGibLogs(): GibAuditLogItem[] {
  if (inMemoryGibLogs === null) {
    const disk = readFromDisk()
    if (disk && disk.length > 0) {
      inMemoryGibLogs = disk
    } else {
      inMemoryGibLogs = [...SEED_GIB_LOGS]
      writeToDisk(inMemoryGibLogs)
    }
  }
  return inMemoryGibLogs
}

export function addGibLog(item: Partial<GibAuditLogItem>): GibAuditLogItem {
  const logs = getAllGibLogs()
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const period = item.period || `${year}-${month}`

  const id = item.id || `GIB-${year}-${Math.floor(1000 + Math.random() * 9000)}`

  // Validate required tax id
  const hasTaxId = Boolean(item.taxId && item.taxId.trim().length >= 10)
  const status: 'HAZIR' | 'BILDIRILDI' | 'EKSIK_BILGI' = item.status || (hasTaxId ? 'HAZIR' : 'EKSIK_BILGI')

  const fullItem: GibAuditLogItem = {
    id,
    tenderId: item.tenderId || `IHC-${year}-${Math.floor(100 + Math.random() * 900)}`,
    tenderTitle: item.tenderTitle || 'Kurumsal Satın Alma İhalesi',
    action: item.action || 'IHALE_ACILDI',
    actionLabel: item.actionLabel || 'Yeni İhale İlanı Oluşturuldu',
    category: item.category || 'Genel Satın Alma',
    budget: item.budget || 'Teklif Usulü',
    direction: item.direction || 'Kapalı Zarf Usulü',
    taxIdType: item.taxIdType || (item.taxId && item.taxId.length === 11 ? 'TCKN' : 'VKN'),
    taxId: item.taxId || '4700854210',
    taxOffice: item.taxOffice || 'Kayıtlı Vergi Dairesi',
    companyOrFullName: item.companyOrFullName || 'Doğrulanmış Kullanıcı',
    ownerEmail: item.ownerEmail || 'ihalecib@gmail.com',
    ownerPhone: item.ownerPhone || '0850 840 86 95',
    city: item.city || 'Türkiye Geneli',
    address: item.address || 'Türkiye',
    ipAddress: item.ipAddress || '127.0.0.1',
    port: item.port || '443',
    userAgent: item.userAgent || 'Web Browser',
    timestamp: item.timestamp || now.toISOString(),
    period,
    status,
    url: item.url || `https://www.ihaleciburada.com/panel/pazar-yeri?id=${item.tenderId}`
  }

  logs.unshift(fullItem)
  inMemoryGibLogs = logs
  writeToDisk(logs)
  return fullItem
}

export function getGibLogsByPeriod(period?: string): GibAuditLogItem[] {
  const all = getAllGibLogs()
  if (!period || period === 'all' || period === 'Tümü') {
    return all
  }
  return all.filter(l => l.period === period)
}

export function generateBtransXml(logs: GibAuditLogItem[], period = '2026-09'): string {
  const escapeXml = (str: string) => {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const nowStr = new Date().toISOString()
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<btrans:BTRANS_ILAN_BILDIRIMI xmlns:btrans="http://www.gib.gov.tr/btrans/vuk538" tebligNo="538_595_VUK" donem="${period}" olusturmaTarihi="${nowStr}">\n`
  xml += `  <btrans:AraciHizmetSaglayici>\n`
  xml += `    <btrans:Unvan>İHALECİBURADA B2B BİLGİ TEKNOLOJİLERİ VE TİCARET A.Ş.</btrans:Unvan>\n`
  xml += `    <btrans:VKN>4700854210</btrans:VKN>\n`
  xml += `    <btrans:VergiDairesi>Çanakkale Vergi Dairesi</btrans:VergiDairesi>\n`
  xml += `    <btrans:WebAdresi>https://www.ihaleciburada.com</btrans:WebAdresi>\n`
  xml += `    <btrans:IletisimEposta>ihalecib@gmail.com</btrans:IletisimEposta>\n`
  xml += `    <btrans:IletisimTelefon>0850 840 86 95</btrans:IletisimTelefon>\n`
  xml += `  </btrans:AraciHizmetSaglayici>\n`
  xml += `  <btrans:IlanKayitlari toplamKayit="${logs.length}">\n`

  logs.forEach(log => {
    xml += `    <btrans:Ilan>\n`
    xml += `      <btrans:LogId>${escapeXml(log.id)}</btrans:LogId>\n`
    xml += `      <btrans:IhaleNo>${escapeXml(log.tenderId)}</btrans:IhaleNo>\n`
    xml += `      <btrans:IslemTuru>${escapeXml(log.action)}</btrans:IslemTuru>\n`
    xml += `      <btrans:IhaleBasligi>${escapeXml(log.tenderTitle)}</btrans:IhaleBasligi>\n`
    xml += `      <btrans:Kategori>${escapeXml(log.category)}</btrans:Kategori>\n`
    xml += `      <btrans:IhaleTuru>${escapeXml(log.direction)}</btrans:IhaleTuru>\n`
    xml += `      <btrans:MuhammenTutar>${escapeXml(log.budget)}</btrans:MuhammenTutar>\n`
    xml += `      <btrans:ParaBirimi>TRY</btrans:ParaBirimi>\n`
    xml += `      <btrans:ZamanDamgasi>${escapeXml(log.timestamp)}</btrans:ZamanDamgasi>\n`
    xml += `      <btrans:IlanVeren>\n`
    xml += `        <btrans:KimlikTuru>${escapeXml(log.taxIdType)}</btrans:KimlikTuru>\n`
    xml += `        <btrans:KimlikNo>${escapeXml(log.taxId)}</btrans:KimlikNo>\n`
    xml += `        <btrans:UnvanAdSoyad>${escapeXml(log.companyOrFullName)}</btrans:UnvanAdSoyad>\n`
    xml += `        <btrans:VergiDairesi>${escapeXml(log.taxOffice)}</btrans:VergiDairesi>\n`
    xml += `        <btrans:Sehir>${escapeXml(log.city)}</btrans:Sehir>\n`
    xml += `        <btrans:Adres>${escapeXml(log.address)}</btrans:Adres>\n`
    xml += `        <btrans:Eposta>${escapeXml(log.ownerEmail)}</btrans:Eposta>\n`
    xml += `        <btrans:Telefon>${escapeXml(log.ownerPhone)}</btrans:Telefon>\n`
    xml += `      </btrans:IlanVeren>\n`
    xml += `      <btrans:TeknikIzKaydi>\n`
    xml += `        <btrans:IPAdresi>${escapeXml(log.ipAddress)}</btrans:IPAdresi>\n`
    xml += `        <btrans:Port>${escapeXml(log.port || '443')}</btrans:Port>\n`
    xml += `        <btrans:UserAgent>${escapeXml(log.userAgent || 'Unknown')}</btrans:UserAgent>\n`
    xml += `        <btrans:SayfaURL>${escapeXml(log.url || '')}</btrans:SayfaURL>\n`
    xml += `      </btrans:TeknikIzKaydi>\n`
    xml += `    </btrans:Ilan>\n`
  })

  xml += `  </btrans:IlanKayitlari>\n`
  xml += `</btrans:BTRANS_ILAN_BILDIRIMI>`
  return xml
}

export function generateBtransCsv(logs: GibAuditLogItem[]): string {
  // UTF-8 BOM for Excel compatibility with Turkish characters
  let csv = '\uFEFF'
  csv += 'Log ID;İhale No;İşlem Türü;İhale Başlığı;Kategori;İhale Yöntemi;Bütçe / Tutar;Mükellef Tipi;TCKN / VKN;Unvan / Ad Soyad;Vergi Dairesi;İl;Adres;E-Posta;Telefon;IP Adresi;Port;Zaman Damgası;Dönem;Durum\n'

  logs.forEach(log => {
    const clean = (str: string) => `"${(str || '').replace(/"/g, '""')}"`
    csv += [
      clean(log.id),
      clean(log.tenderId),
      clean(log.action),
      clean(log.tenderTitle),
      clean(log.category),
      clean(log.direction),
      clean(log.budget),
      clean(log.taxIdType),
      clean(log.taxId),
      clean(log.companyOrFullName),
      clean(log.taxOffice),
      clean(log.city),
      clean(log.address),
      clean(log.ownerEmail),
      clean(log.ownerPhone),
      clean(log.ipAddress),
      clean(log.port || '443'),
      clean(log.timestamp),
      clean(log.period),
      clean(log.status)
    ].join(';') + '\n'
  })

  return csv
}
