// Shared server-side store for tenders to synchronize across all devices and browsers
import fs from 'node:fs'
import path from 'node:path'

export interface TenderItem {
  id: string
  baslik: string
  aciklama?: string
  kategori?: string
  categoryId?: number
  mainCategory?: string
  subCategory?: string
  city?: string
  ownerCompany?: string
  ownerEmail?: string
  authority?: string
  butce?: string
  sure?: string
  durum?: string
  ihaleYonu?: string
  tur?: string
  usul?: string
  teklifSayisi?: number
  liderTeklif?: string
  adminApproved?: boolean
  aiApproved?: boolean
  aiScore?: number
  olusturma?: string
  startDate?: string
  endDate?: string
  isBaseline?: boolean
  [key: string]: any
}

const BASELINE_TENDERS: TenderItem[] = [
  {
    id: "IHC-2026-901",
    baslik: "Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi",
    aciklama: "Balıkesir Organize Sanayi Bölgesinde 12.000 m² kapalı alana sahip çelik konstrüksiyon üretim tesisi, sandviç panel çatı ve cephe kaplama işleri anahtar teslim ihale usulüyle yaptırılacaktır.",
    kategori: "İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri",
    categoryId: 1,
    mainCategory: "İnşaat & Yapı",
    subCategory: "Çelik Yapı & Çatı",
    city: "Balıkesir",
    ownerCompany: "Marmara Çelik ve Ağır Sanayi A.Ş.",
    ownerEmail: "ihale@marmaracelik.com.tr",
    authority: "Balıkesir OSB Müdürlüğü",
    butce: "18.500.000 ₺",
    sure: "24 gün kaldı",
    durum: "active",
    ihaleYonu: "kapali_zarf",
    tur: "Yapım İşi",
    usul: "Kapalı Zarf Teklif Usulü",
    teklifSayisi: 8,
    liderTeklif: "17.850.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.2,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-10-02T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-902",
    baslik: "Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi",
    aciklama: "Çanakkale ve Balıkesir limanlarından Bursa, Kocaeli ve İzmir fabrikalarına yıl boyu 15.000 ton dökme ve paletli hammadde taşımacılığı için özmal/kiralık araç filosu temin ihalesidir.",
    kategori: "Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri",
    categoryId: 10,
    mainCategory: "Lojistik & Taşımacılık",
    subCategory: "Karayolu Nakliye",
    city: "Çanakkale",
    ownerCompany: "Mega Lojistik ve Dağıtım A.Ş.",
    ownerEmail: "lojistik@megadagitim.com.tr",
    authority: "T.C. Ulaştırma ve Altyapı Bakanlığı",
    butce: "4.200.000 ₺",
    sure: "18 gün kaldı",
    durum: "active",
    ihaleYonu: "eksiltme",
    tur: "Hizmet Alımı",
    usul: "Açık Eksiltme",
    teklifSayisi: 14,
    liderTeklif: "3.890.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 98.7,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-26T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-903",
    baslik: "Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı",
    aciklama: "Otomotiv yan sanayi parça üretimi için yüksek hassasiyetli 2 adet 5 eksenli dikey CNC dik işleme merkezi, takım tutucular ve robotik yükleme hücresi satın alma ihalesidir.",
    kategori: "Endüstriyel Makine - Motor - Konveyör İhaleleri",
    categoryId: 8,
    mainCategory: "Makine & Ekipman",
    subCategory: "CNC & Takım Tezgahları",
    city: "Bursa",
    ownerCompany: "Anadolu Çelik ve Metal Sanayi A.Ş.",
    ownerEmail: "satinalma@anadolucelik.com.tr",
    authority: "Bursa Organize Sanayi Bölgesi",
    butce: "8.900.000 ₺",
    sure: "15 gün kaldı",
    durum: "active",
    ihaleYonu: "kapali_zarf",
    tur: "Mal Alımı",
    usul: "Doğrudan Teklif Alma",
    teklifSayisi: 6,
    liderTeklif: "8.450.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 98.4,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-23T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-904",
    baslik: "100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği",
    aciklama: "Gıda ve tekstil ihracatında kullanılmak üzere dopel oluklu mukavva, flexo 4 renk baskılı koli, separatör ve kraft kutu alımı için yıllık çerçeve sözleşme ihalesi.",
    kategori: "Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri",
    categoryId: 15,
    mainCategory: "Ambalaj & Kağıt",
    subCategory: "Mukavva Koli",
    city: "İzmir",
    ownerCompany: "Ege Ambalaj ve İhracat Sanayi A.Ş.",
    ownerEmail: "kurumsal@egeambalaj.com.tr",
    authority: "Ege İhracatçı Birlikleri",
    butce: "1.650.000 ₺",
    sure: "12 gün kaldı",
    durum: "active",
    ihaleYonu: "eksiltme",
    tur: "Mal Alımı",
    usul: "Canlı Açık Eksiltme",
    teklifSayisi: 19,
    liderTeklif: "1.420.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-20T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-905",
    baslik: "Bandırma 2.5 MW Endüstriyel Çatı Güneş Enerji Santrali (GES) EPC Kurulumu",
    aciklama: "Fabrika çatısına 2.5 MWp gücünde monokristal güneş panelleri, inverterler, OG trafo merkezi, SCADA izleme sistemi ve TEDAŞ kabulü dahil anahtar teslim GES kurulumu.",
    kategori: "Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri",
    categoryId: 6,
    mainCategory: "Enerji & Elektrik",
    subCategory: "GES & Güneş Paneli",
    city: "Balıkesir",
    ownerCompany: "Global Enerji ve Güneş Sistemleri",
    ownerEmail: "proje@globalenerji.com.tr",
    authority: "Balıkesir Bandırma Belediyesi",
    butce: "28.000.000 ₺",
    sure: "20 gün kaldı",
    durum: "active",
    ihaleYonu: "kapali_zarf",
    tur: "Yapım İşi",
    usul: "Kapalı Zarf Usulü",
    teklifSayisi: 11,
    liderTeklif: "26.400.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.5,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-28T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-906",
    baslik: "Kurumsal Bulut Sunucu Altyapısı, Firewall Donanımı & 3 Yıllık Siber Güvenlik Hizmeti",
    aciklama: "Şirket merkez ve bölge ofisleri için Tier-3 sertifikalı hibrit bulut sunucuları, yedekli NGFW güvenlik duvarı cihazları ve 7/24 SOC izleme hizmet alımı ihalesidir.",
    kategori: "Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri",
    categoryId: 9,
    mainCategory: "Teknoloji & Yazılım",
    subCategory: "Sunucu & Donanım",
    city: "İstanbul",
    ownerCompany: "Avrasya Bilişim ve Yazılım A.Ş.",
    ownerEmail: "bilgi@avrasyabilisim.com.tr",
    authority: "Bilişim Vadisi Teknopark",
    butce: "3.400.000 ₺",
    sure: "9 gün kaldı",
    durum: "active",
    ihaleYonu: "eksiltme",
    tur: "Hizmet Alımı",
    usul: "Açık Eksiltme",
    teklifSayisi: 7,
    liderTeklif: "3.050.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 98.9,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-17T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-907",
    baslik: "1.200 Ton Sertifikalı Ekmeklik Buğday & Endüstriyel Un Tedarik İhalesi",
    aciklama: "Marmara Bölgesi un fabrikaları ve fırın işletmeleri için yüksek proteinli, analiz raporlu 1.200 ton ekmeklik buğday doğrudan alım ihalesidir.",
    kategori: "Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri",
    categoryId: 3,
    mainCategory: "Tarım & Gıda",
    subCategory: "Tahıl & Un",
    city: "Çanakkale",
    ownerCompany: "Akdeniz Gıda ve Soğuk Depo A.Ş.",
    ownerEmail: "tedarik@akdenizgida.com.tr",
    authority: "Toprak Mahsulleri Ofisi (TMO)",
    butce: "14.500.000 ₺",
    sure: "16 gün kaldı",
    durum: "active",
    ihaleYonu: "kapali_zarf",
    tur: "Mal Alımı",
    usul: "Doğrudan Teklif Alma",
    teklifSayisi: 12,
    liderTeklif: "13.900.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.1,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-24T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-908",
    baslik: "Şehir Hastaneleri 2026 Yılı Tıbbi Sarf, Cerrahi Setler & Sterilizasyon Malzemeleri",
    aciklama: "Steril ameliyathane örtü setleri, cerrahi eldivenler, kan alma tüpleri ve antiseptik solüsyon alımı için 1 yıllık toplu tedarik ihalesidir.",
    kategori: "Sağlık - İlaç - Kozmetik - Medikal İhaleleri",
    categoryId: 2,
    mainCategory: "Sağlık & Medikal",
    subCategory: "Tıbbi Sarf",
    city: "Balıkesir",
    ownerCompany: "Balıkesir Sağlık ve Medikal Grubu",
    ownerEmail: "medikal@balikesirsaglik.com.tr",
    authority: "Balıkesir İl Sağlık Müdürlüğü",
    butce: "6.800.000 ₺",
    sure: "22 gün kaldı",
    durum: "active",
    ihaleYonu: "eksiltme",
    tur: "Mal Alımı",
    usul: "Açık Eksiltme",
    teklifSayisi: 15,
    liderTeklif: "6.120.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.4,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-30T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-909",
    baslik: "300.000 Litre Euro Dizel Motorin & Madeni Yağ Filo Tedarik İhalesi",
    aciklama: "Şirket lojistik filosu ve iş makineleri için istasyondan taşıt tanıma sistemi (TTS) ve şantiye dökme akaryakıt tankı teslimli motorin tedarik ihalesidir.",
    kategori: "Akaryakıt - Gazyağı - Madeni Yağ İhaleleri",
    categoryId: 7,
    mainCategory: "Akaryakıt & Enerji",
    subCategory: "Euro Dizel",
    city: "Kocaeli",
    ownerCompany: "Marmara Altyapı ve İnşaat Grubu",
    ownerEmail: "yakit@marmaraaltyapi.com.tr",
    authority: "Kocaeli Dilovası OSB",
    butce: "12.600.000 ₺",
    sure: "14 gün kaldı",
    durum: "active",
    ihaleYonu: "eksiltme",
    tur: "Mal Alımı",
    usul: "Açık Eksiltme",
    teklifSayisi: 8,
    liderTeklif: "11.850.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 98.8,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-22T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-910",
    baslik: "250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı",
    aciklama: "Yeni açılacak kurumsal genel müdürlük binası için E1 normunda ahşap çalışma istasyonları, fileli ergonomik çalışma koltukları ve kilitli çelik evrak dolapları alımıdır.",
    kategori: "Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri",
    categoryId: 11,
    mainCategory: "Ofis & Mobilya",
    subCategory: "Ofis Donanımı",
    city: "Ankara",
    ownerCompany: "Avrasya Bilişim ve Yazılım A.Ş.",
    ownerEmail: "idari@avrasyabilisim.com.tr",
    authority: "Ankara OSTİM OSB",
    butce: "2.100.000 ₺",
    sure: "11 gün kaldı",
    durum: "active",
    ihaleYonu: "kapali_zarf",
    tur: "Mal Alımı",
    usul: "Doğrudan Teklif Alma",
    teklifSayisi: 9,
    liderTeklif: "1.890.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.1,
    olusturma: "01.09.2026",
    startDate: "2026-09-01T08:00:00.000Z",
    endDate: "2026-09-19T17:00:00.000Z",
    isBaseline: true
  },
  {
    id: "IHC-2026-900",
    baslik: "Kocaeli OSB Endüstriyel Atık Su Arıtma Tesisi Bakım & Filtre Değişim İşi",
    aciklama: "Kocaeli Dilovası OSB atık su arıtma tesisinde membran filtre değişimi ve 6 aylık periyodik bakım ihalesi süresi dolup tamamlanmıştır.",
    kategori: "Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri",
    categoryId: 5,
    mainCategory: "Kanalizasyon & Su",
    subCategory: "Arıtma Tesisi",
    city: "Kocaeli",
    ownerCompany: "Dilovası OSB Atıksu Arıtma A.Ş.",
    ownerEmail: "ihale@dilovasiosb.org.tr",
    authority: "Kocaeli Dilovası OSB",
    butce: "1.450.000 ₺",
    sure: "Sona Erdi / Kapandı",
    durum: "closed",
    ihaleYonu: "kapali_zarf",
    tur: "Hizmet Alımı",
    usul: "Kapalı Zarf Usulü",
    teklifSayisi: 5,
    liderTeklif: "1.380.000 ₺",
    adminApproved: true,
    aiApproved: true,
    aiScore: 99.4,
    olusturma: "20.08.2026",
    startDate: "2026-08-20T08:00:00.000Z",
    endDate: "2026-09-05T17:00:00.000Z",
    isBaseline: true
  }
]

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_TENDERS__: TenderItem[] | undefined
}

function getStoragePath(): string {
  try {
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
    return path.join(tmpDir, 'gelanlasalim_shared_tenders.json')
  } catch {
    return ''
  }
}

function tryReadFromDisk(): TenderItem[] | null {
  const filePath = getStoragePath()
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

function trySaveToDisk(tenders: TenderItem[]) {
  const filePath = getStoragePath()
  if (!filePath) return
  try {
    fs.writeFileSync(filePath, JSON.stringify(tenders), 'utf-8')
  } catch (e) {
    // ignore on read-only environments
  }
}

export function computeTenderTiming(tender: TenderItem): {
  durum: string
  durumLabel: string
  sureText: string
  isExpired: boolean
  remainingMs: number
} {
  const now = Date.now()
  const start = tender.startDate ? new Date(tender.startDate).getTime() : 0
  const end = tender.endDate ? new Date(tender.endDate).getTime() : 0

  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi') {
    return {
      durum: 'closed',
      durumLabel: 'Sona Erdi / Kapandı',
      sureText: 'Süre Doldu',
      isExpired: true,
      remainingMs: 0
    }
  }

  if (start > 0 && start > now) {
    const diff = start - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return {
      durum: 'planned',
      durumLabel: 'Yakında Başlayacak',
      sureText: days > 0 ? `${days} gün ${hours} saat sonra başlıyor` : `${hours} saat sonra başlıyor`,
      isExpired: false,
      remainingMs: diff
    }
  }

  if (end > 0 && end <= now) {
    return {
      durum: 'closed',
      durumLabel: 'Sona Erdi / Kapandı',
      sureText: 'Süre Doldu',
      isExpired: true,
      remainingMs: 0
    }
  }

  if (end > 0) {
    const diff = end - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    let sureText = ''
    if (days > 0) {
      sureText = `${days} gün kaldı`
    } else if (hours > 0) {
      sureText = `${hours} saat ${minutes} dk kaldı`
    } else {
      sureText = `${minutes} dakika kaldı`
    }
    return {
      durum: 'active',
      durumLabel: 'Canlı İhale',
      sureText,
      isExpired: false,
      remainingMs: diff
    }
  }

  return {
    durum: tender.durum || 'active',
    durumLabel: tender.durum === 'closed' ? 'Sona Erdi' : 'Canlı İhale',
    sureText: tender.sure || 'Canlı İhale',
    isExpired: tender.durum === 'closed',
    remainingMs: 0
  }
}

export function getAllTenders(): TenderItem[] {
  if (!globalThis.__SHARED_TENDERS__) {
    const diskTenders = tryReadFromDisk()
    if (diskTenders && diskTenders.length > 0) {
      globalThis.__SHARED_TENDERS__ = diskTenders
    } else {
      globalThis.__SHARED_TENDERS__ = [...BASELINE_TENDERS]
    }
  }

  // Auto-normalize and calculate dynamic timing for all items
  const tenders = globalThis.__SHARED_TENDERS__
  for (const t of tenders) {
    // Fix office furniture category mapping if still on old value
    if (t.id === 'IHC-2026-910') {
      t.categoryId = 11
      t.kategori = 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri'
      t.mainCategory = 'Ofis & Mobilya'
    }
    // Dynamic lifecycle status
    const timing = computeTenderTiming(t)
    t.durum = timing.durum
    t.sure = timing.sureText
  }

  return tenders
}

export function addTender(tender: TenderItem): TenderItem {
  const list = getAllTenders()
  // Check if exists
  const existingIdx = list.findIndex(t => t.id === tender.id)
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...tender }
  } else {
    list.unshift(tender)
  }
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
  return tender
}

export function removeTender(id: string): boolean {
  let list = getAllTenders()
  const initialLen = list.length
  list = list.filter(t => t.id !== id)
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
  return list.length < initialLen
}
