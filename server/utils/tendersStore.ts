// Shared server-side store for tenders to synchronize across all devices and browsers
import fs from 'node:fs'
import path from 'node:path'

export type TenderStatus = 
  | 'DRAFT' 
  | 'APPROVAL_PENDING' 
  | 'SCHEDULED' 
  | 'LIVE' 
  | 'SUSPENDED' 
  | 'CLOSED' 
  | 'EVALUATION' 
  | 'PROVISIONAL_RESULT' 
  | 'FINAL_APPROVAL_PENDING' 
  | 'FINALIZED' 
  | 'UNSUCCESSFUL' 
  | 'CANCELLED'

export type TenderReasonCode =
  | 'NO_BIDS'
  | 'INSUFFICIENT_BIDS'
  | 'ALL_TECHNICALLY_REJECTED'
  | 'ALL_COMMERCIALLY_REJECTED'
  | 'RESERVE_NOT_MET'
  | 'BUDGET_EXCEEDED'
  | 'WINNER_WITHDREW'
  | 'NEED_CANCELLED'
  | 'SPECIFICATION_ERROR'
  | 'SCOPE_CHANGED'
  | 'SYSTEM_ISSUE'
  | 'BUSINESS_DECISION'
  | 'OTHER'

export interface TenderItemSpec {
  id: string
  lotNo?: number
  ad: string
  miktar: number
  birim: string
  teknikAciklama?: string
  kazananFirma?: string
  kazananFiyat?: string
}

export interface TenderLot {
  lotNo: number
  baslik: string
  aciklama?: string
  kalemler: TenderItemSpec[]
  kazananFirma?: string
  kazananFiyat?: string
}

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
  statusCode?: TenderStatus
  reasonCode?: TenderReasonCode
  reasonNote?: string
  awardMode?: 'ALL_OR_NOTHING' | 'LOT_BASED' | 'ITEM_BASED'
  kalemler?: TenderItemSpec[]
  lotlar?: TenderLot[]
  currency?: 'TRY' | 'USD' | 'EUR'
  vatType?: 'vat_included' | 'vat_excluded'
  deliveryLocation?: string
  deliveryDuration?: string
  paymentTerms?: string
  startPrice?: number
  reservePrice?: number
  minStep?: number
  requiresParticipationApproval?: boolean
  minBidsCount?: number
  specVersion?: number
  parentTenderId?: string
  specHistory?: Array<{
    version: number
    changedAt: string
    changedBy: string
    changeNote: string
  }>
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
  extensionCount?: number
  totalExtendedMinutes?: number
  antiSnipingActive?: boolean
  lastExtendedAt?: string
  isBaseline?: boolean
  websiteUrl?: string
  ownerPhone?: string
  isIlan?: boolean
  [key: string]: any
}

export const BASELINE_TENDERS: TenderItem[] = [
  {
    id: 'IHC-2026-101',
    baslik: 'Bodrum Yalıkavak 2.500 m² Lüks Villa Sitesi Peyzaj ve Otomatik Sulama Projesi',
    aciklama: 'Bodrum Yalıkavak sırtlarında bulunan 8 villalık site projemizin 2.500 m² ortak ve özel bahçe alanları için peyzaj mimarlığı projelendirme, rulo çim serme, ithal palmiye dikimi, Hunter marka otomatik damlama ve rotor sulama altyapısı montajı yapılacaktır. Detaylı teknik projeler ve keşif metrajları için web sayfamızı ziyaret edebilir veya doğrudan iletişime geçebilirsiniz.',
    categoryId: 25,
    kategori: 'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri / Peyzaj Proje & Uygulama',
    mainCategory: 'Peyzaj, Çevre Düzenleme ve Bahçe',
    subCategory: 'Peyzaj Proje & Uygulama',
    city: 'Muğla',
    ownerCompany: 'Yıldırım Mimarlık & Peyzaj Proje A.Ş.',
    ownerEmail: 'proje@yildirimmimarlik.com.tr',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Proje & Hizmet İlanı',
    usul: 'Doğrudan Teklif & İletişim',
    butce: '850.000 ₺ · Net Fiyat',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80', name: 'Peyzaj Uygulaması' }],
    teklifSayisi: 0,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-102',
    baslik: "Çanakkale Kepez Sahilinde 1.500 m² %50 Kat Karşılığı Konut İmarlı Arsa",
    aciklama: 'Çanakkale Kepez sahil bandına 200 metre mesafede, 1.500 m² yüzölçümlü, KAKS: 1.50, Emsal 4 kat konut imarlı müstakil parsel arsa. Kat karşılığı sözleşme düzenlemek isteyen kurumsal inşaat firmaları aranmaktadır. Tapu ve imar çapı evrakları mevcuttur.',
    categoryId: 40,
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri / Arsa, Arazi & Tarla Satışı',
    mainCategory: 'Gayrimenkul',
    subCategory: 'Arsa, Arazi & Tarla Satışı',
    city: 'Çanakkale',
    ownerCompany: 'Hasan Hüseyin Yıldırım Emlak & Yatırım',
    ownerEmail: 'emlak@ihaleciburada.com',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Proje & Gayrimenkul İlanı',
    usul: 'Kat Karşılığı Görüşme',
    butce: 'Kat Karşılığı (%50)',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', name: 'İmarlı Arsa Parsel' }],
    teklifSayisi: 0,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-103',
    baslik: 'Balıkesir OSB Fabrika İnşaatı 250 Ton Nervürlü İnşaat Demiri (Ø8-Ø32) Alımı',
    aciklama: 'Balıkesir Organize Sanayi Bölgesi 2. Etap fabrika inşaatımızda kullanılmak üzere B420C kalite 250 ton nervürlü inşaat demiri eksiltme usulüyle satın alınacaktır. Sevkiyat şantiye sahamıza parça parça yapılacaktır.',
    categoryId: 1,
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri / Çelik Konstrüksiyon',
    mainCategory: 'İnşaat ve Yapı',
    subCategory: 'Çelik Konstrüksiyon',
    city: 'Balıkesir',
    ownerCompany: 'Balıkesir Sanayi Yapı Endüstri A.Ş.',
    ownerEmail: 'satinalma@balikesirsanayi.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltmeli Satın Alma',
    usul: 'Fiyat Azaltımlı Açık Eksiltme',
    butce: '6.450.000 ₺',
    sure: '12 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80', name: 'İnşaat Demiri' }],
    teklifSayisi: 3,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-104',
    baslik: "İstanbul Kadıköy Moda'da 145 m² 3+1 Lüks Sıfır Balkonlu Daire",
    aciklama: 'Kadıköy Moda sahil yürüyüş yoluna 3 dakika mesafede, kapalı otoparklı, çift asansörlü, yerden ısıtmalı ve akıllı ev altyapısına sahip sıfır daire. Krediye tam uygundur.',
    categoryId: 40,
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri / Konut & Daire Satışı',
    mainCategory: 'Gayrimenkul',
    subCategory: 'Konut & Daire Satışı',
    city: 'İstanbul',
    ownerCompany: 'Kalyoncu Gayrimenkul Yatırım Ofisi',
    ownerEmail: 'moda@kalyoncugayrimenkul.com',
    ownerPhone: '0850 840 86 95',
    websiteUrl: 'https://www.ihaleciburada.com',
    isIlan: true,
    ihaleYonu: 'ihalesiz_ilan',
    tur: 'Gayrimenkul Vitrin İlanı',
    usul: 'Doğrudan Satış',
    butce: '14.750.000 ₺',
    sure: 'Yayında (Aktif İlan)',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', name: 'Moda Daire' }],
    teklifSayisi: 0,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-105',
    baslik: 'Bursa Nilüfer Projesi 6 Ay Süreli 2 Adet 22 Ton Paletli Ekskavatör Kiralama',
    aciklama: 'Nilüfer konut şantiyemizde 6 ay boyunca hafriyat ve kanal kazısı işlerinde çalışacak, 2021 model ve üzeri, bakımları eksiksiz 2 adet 22 ton paletli ekskavatör operatörsüz olarak kiralanacaktır.',
    categoryId: 22,
    kategori: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri / İş Makinesi Alım & Kiralama',
    mainCategory: 'Araç ve İş Makineleri',
    subCategory: 'İş Makinesi Alım & Kiralama',
    city: 'Bursa',
    ownerCompany: 'Marmara Altyapı ve Hafriyat Ltd. Şti.',
    ownerEmail: 'operasyon@marmarahafriyat.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'kapali_zarf',
    tur: 'Kapalı Zarf Usulü Teklif Alma',
    usul: 'Kapalı Zarf',
    butce: '1.200.000 ₺',
    sure: '8 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 96,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80', name: 'Ekskavatör' }],
    teklifSayisi: 2,
    olusturma: '2 gün önce',
    isBaseline: true
  },
  {
    id: 'IHC-2026-106',
    baslik: 'İzmir Kemalpaşa Fabrikası 350 Kişilik Günlük Tabldot Yemek & Catering Hizmeti',
    aciklama: 'Fabrikamızda çalışan 350 personelin öğle yemeği ihtiyacı için 12 ay süreli 4 kap sıcak tabldot yemek alımı ihalesidir. ISO 22000 Gıda Güvenliği belgesi zorunludur.',
    categoryId: 29,
    kategori: 'Hazır Yemek - Lokantacılık İhaleleri / Toplu Tabldot Yemek Üretimi',
    mainCategory: 'Gıda ve Catering',
    subCategory: 'Toplu Tabldot Yemek Üretimi',
    city: 'İzmir',
    ownerCompany: 'Ege Ambalaj ve Sanayi A.Ş.',
    ownerEmail: 'ik@egeambalaj.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Açık Eksiltme İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '3.150.000 ₺',
    sure: '5 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80', name: 'Catering' }],
    teklifSayisi: 4,
    olusturma: '3 gün önce',
    isBaseline: true
  },
  {
    id: 'IHC-2026-107',
    baslik: 'Bursa Şehir Hastanesi 50.000 Adet Steril Cerrahi Önlük ve Medikal Sarf Malzeme Alımı',
    aciklama: 'Bursa Şehir Hastanesi ve bağlı ek poliklinik binaları için 50.000 adet lamine steril cerrahi önlük, tek kullanımlık muayene eldiveni ve dezenfektan alımı yapılacaktır. CE ve UTS kayıt belgeleri zorunludur.',
    categoryId: 2,
    kategori: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri / Tıbbi Cihaz & Sarf Malzemeleri',
    mainCategory: 'Sağlık ve Medikal',
    subCategory: 'Tıbbi Cihaz & Sarf Malzemeleri',
    city: 'Bursa',
    ownerCompany: 'Güney Marmara Sağlık Yatırımları A.Ş.',
    ownerEmail: 'satinalma@guneymarmarasaglik.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Toplu Medikal Alım İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '1.850.000 ₺',
    sure: '10 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80', name: 'Medikal Sarf' }],
    teklifSayisi: 5,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-108',
    baslik: 'Konya Karatay Toptan 120 Ton Kırmızı Mercimek ve Baldo Pirinç Tedarik İhalesi',
    aciklama: 'Fabrika ve paketleme tesislerimiz için 2026 mahsulü, 1. sınıf kalite 60 ton kırmızı mercimek ve 60 ton Gönen baldo pirinç satın alınacaktır. Ürünler 50 kg çuvallarda silo teslimi kabul edilecektir.',
    categoryId: 3,
    kategori: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri / Kuru Gıda, Bakliyat & Hububat',
    mainCategory: 'Gıda ve Tarım',
    subCategory: 'Kuru Gıda, Bakliyat & Hububat',
    city: 'Konya',
    ownerCompany: 'Anadolu Bakliyat ve Hububat San. Tic. A.Ş.',
    ownerEmail: 'ticaret@anadolubakliyat.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Toptan Tarım ve Bakliyat Alımı',
    usul: 'Fiyat Eksiltmeli',
    butce: '4.200.000 ₺',
    sure: '6 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80', name: 'Bakliyat ve Pirinç' }],
    teklifSayisi: 3,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-109',
    baslik: 'İstanbul Maslak Finans Merkezi 14 Katlı İş Kulesi 1 Yıllık Tesis Temizliği ve Pest Kontrol',
    aciklama: 'Maslak iş kulemizin 14 kat ortak alanları, dış cephe cam temizliği ve periyodik haşere ilaçlama hizmeti için 12 ay süreli kurumsal temizlik hizmeti ihalesidir. 8 tam zamanlı personel ve makine parkuru talep edilmektedir.',
    categoryId: 32,
    kategori: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri / Bina, Tesis & Ofis Temizliği',
    mainCategory: 'Temizlik ve Hijyen',
    subCategory: 'Bina, Tesis & Ofis Temizliği',
    city: 'İstanbul',
    ownerCompany: 'Maslak Plaza Yönetim ve Hizmet A.Ş.',
    ownerEmail: 'yonetim@maslakplaza.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Kurumsal Tesis Hizmet İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '2.400.000 ₺',
    sure: '14 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80', name: 'Tesis Temizliği' }],
    teklifSayisi: 6,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-110',
    baslik: 'Kocaeli Dilovası Limanı - Ankara OSB Arası 60 Seferlik Konteyner Karayolu Taşımacılığı',
    aciklama: 'Dilovası Yılport konteyner terminalinden Ankara 1. OSB fabrikamıza 60 adet 40 HC konteynerin karayolu nakliyesi ve boş konteyner dönüş organizasyonu ihalesidir. Araç takip sistemi zorunludur.',
    categoryId: 10,
    kategori: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri / Şehirlerarası Karayolu Nakliye',
    mainCategory: 'Lojistik ve Taşımacılık',
    subCategory: 'Şehirlerarası Karayolu Nakliye',
    city: 'Kocaeli',
    ownerCompany: 'TransGlobal Lojistik ve Antrepo A.Ş.',
    ownerEmail: 'operasyon@transgloballojistik.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Konteyner Nakliye İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '1.950.000 ₺',
    sure: '9 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 96,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80', name: 'Konteyner Tır' }],
    teklifSayisi: 4,
    olusturma: '2 gün önce',
    isBaseline: true
  },
  {
    id: 'IHC-2026-111',
    baslik: 'İzmir Aliağa Organize Sanayi Bölgesi 24/7 Silahsız Özel Güvenlik ve Giriş-Çıkış Kontrol Hizmeti',
    aciklama: 'Aliağa OSB genişleme sahası 120 dönüm sanayi alanı için 5188 sayılı kanuna uygun 12 kişilik silahsız özel güvenlik görevlisi ve devriye aracı temini ihalesidir. 12 ay sürelidir.',
    categoryId: 35,
    kategori: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri / Silahlı & Silahsız Özel Güvenlik',
    mainCategory: 'Özel Güvenlik',
    subCategory: 'Silahlı & Silahsız Özel Güvenlik',
    city: 'İzmir',
    ownerCompany: 'Aliağa Sanayi Tesisleri İşletme Kooperatifi',
    ownerEmail: 'guvenlik@aliagasanayi.org.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Özel Güvenlik Hizmet İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '3.600.000 ₺',
    sure: '11 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80', name: 'Güvenlik Hizmeti' }],
    teklifSayisi: 3,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-112',
    baslik: 'Balıkesir Edremit Şantiye Araç Filosu İçin 80.000 Litre Euro Diesel Motorin Alımı',
    aciklama: 'Körfez otoyol ve altyapı şantiye sahasında bulunan iş makineleri ve kamyonlarımız için 80.000 litre Euro 5 motorin tankere teslim eksiltme usulüyle satın alınacaktır. EPDK lisanslı dağıtıcılar teklif verebilir.',
    categoryId: 7,
    kategori: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri / Motorin & Mazot Alımı',
    mainCategory: 'Akaryakıt ve Enerji',
    subCategory: 'Motorin & Mazot Alımı',
    city: 'Balıkesir',
    ownerCompany: 'Körfez Hazır Beton & Asfalt Ltd. Şti.',
    ownerEmail: 'akaryakit@korfezasfalt.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Akaryakıt Tedarik İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '3.360.000 ₺',
    sure: '4 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80', name: 'Akaryakıt Tankeri' }],
    teklifSayisi: 5,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-113',
    baslik: 'Kurumsal B2B Bulut Tabanlı ERP, Satın Alma & Envanter Yönetimi Entegrasyon Yazılımı',
    aciklama: 'Holding bünyesindeki 4 üretim tesisi ve 12 dağıtım deposunun uçtan uca satın alma, canlı eksiltme, envanter sayımı ve e-fatura/e-irsaliye süreçlerini birleştirecek özel bulut ERP yazılım geliştirme ihalesidir.',
    categoryId: 9,
    kategori: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri / ERP & Kurumsal Yazılımlar',
    mainCategory: 'Yazılım ve Bilişim',
    subCategory: 'ERP & Kurumsal Yazılımlar',
    city: 'Ankara',
    ownerCompany: 'Atlas Bilişim Teknolojileri San. Tic. A.Ş.',
    ownerEmail: 'proje@atlasbilisim.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Kurumsal Yazılım İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '1.650.000 ₺',
    sure: '15 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 99,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', name: 'Yazılım Projesi' }],
    teklifSayisi: 2,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-114',
    baslik: 'Antalya Manavgat Otel Yenileme 4.000 m² Seramik, Sıva ve Alçıpan Yapım İşi',
    aciklama: '5 yıldızlı tatil köyümüzün 120 oda ve ortak koridorlarında 4.000 m² granit seramik kaplama, ses yalıtımlı alçıpan asma tavan ve su bazlı silikonlu boya yapım işleri anahtar teslimi ihale edilecektir.',
    categoryId: 1,
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri / Tadilat & Restorasyon',
    mainCategory: 'İnşaat ve Yapı',
    subCategory: 'Tadilat & Restorasyon',
    city: 'Antalya',
    ownerCompany: 'Akdeniz Turizm ve İnşaat Yatırımları A.Ş.',
    ownerEmail: 'teknik@akdenizturizminsaat.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Tadilat ve Yapım İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '2.800.000 ₺',
    sure: '7 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80', name: 'İnşaat Tadilat' }],
    teklifSayisi: 4,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-115',
    baslik: 'İzmir Çeşme 500 kWp Çatı GES Güneş Enerjisi Santrali Kurulumu ve TEDAŞ Onayı',
    aciklama: 'Soğuk hava depomuzun çatısına 500 kWp gücünde anahtar teslimi Güneş Enerjisi Santrali (GES) kurulumu, invertör, çift yüzlü monokristal paneller, TEDAŞ proje çizimi ve kabul onay süreçleri ihalesidir.',
    categoryId: 6,
    kategori: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri / Güneş Enerjisi (GES) Sistemleri',
    mainCategory: 'Enerji ve Elektrik',
    subCategory: 'Güneş Enerjisi (GES) Sistemleri',
    city: 'İzmir',
    ownerCompany: 'Ege Soğuk Depoculuk ve Lojistik A.Ş.',
    ownerEmail: 'enerji@egesogukdepo.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Güneş Enerjisi GES İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '5.600.000 ₺',
    sure: '16 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80', name: 'GES Projesi' }],
    teklifSayisi: 5,
    olusturma: '3 gün önce',
    isBaseline: true
  },
  {
    id: 'IHC-2026-116',
    baslik: 'Bursa Nilüfer OSB Otomotiv Parça İmalatı İçin 3 Eksenli CNC Dik İşleme Merkezi Alımı',
    aciklama: 'Otomotiv yedek parça kalıp üretimimiz için X: 1100 mm, Y: 600 mm hareket kabiliyetine sahip, 12.000 RPM fener mili hızlı, Fanuc kontrol üniteli 1 adet sıfır CNC dik işleme merkezi satın alınacaktır.',
    categoryId: 8,
    kategori: 'Endüstriyel Makine - Motor - Konveyör İhaleleri / CNC & Takım Tezgahları',
    mainCategory: 'Sanayi ve Makine',
    subCategory: 'CNC & Takım Tezgahları',
    city: 'Bursa',
    ownerCompany: 'Nilüfer Kalıp ve Pres Sanayi A.Ş.',
    ownerEmail: 'uretim@niluferkalip.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Endüstriyel Makine Alımı',
    usul: 'Fiyat Eksiltmeli',
    butce: '4.800.000 ₺',
    sure: '8 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 96,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', name: 'CNC Makine' }],
    teklifSayisi: 3,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-117',
    baslik: 'İstanbul Şişli Genel Müdürlük Binası 80 Kişilik Ergonomik Ofis Mobilyaları & Çalışma İstasyonları',
    aciklama: 'Genel müdürlük binamızın 2 katı için 80 kişilik modern çalışma masası, file sırtlı ortopedik çalışma koltuğu, keson ve akustik seperatör panelleri satın alınacaktır. Montaj dahil teslim şarttır.',
    categoryId: 11,
    kategori: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri / Ofis & Büro Mobilyaları',
    mainCategory: 'Ofis ve Mobilya',
    subCategory: 'Ofis & Büro Mobilyaları',
    city: 'İstanbul',
    ownerCompany: 'Kuzey Finansal Danışmanlık A.Ş.',
    ownerEmail: 'idari@kuzeyfinansal.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Ofis Mobilyası Alım İhalesi',
    usul: 'Fiyat Eksiltmeli',
    butce: '1.450.000 ₺',
    sure: '9 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80', name: 'Ofis Mobilyaları' }],
    teklifSayisi: 4,
    olusturma: 'Dün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-118',
    baslik: 'Manisa OSB Fabrika Üretim Hattı İçin 20 Ton Paslanmaz Kutu Profil ve Nalburiye Cıvata Alımı',
    aciklama: 'AISI 304 kalite 40x40 ve 60x60 ölçülerinde 20 ton paslanmaz kutu profil ile 100.000 adet paslanmaz A2 cıvata somun bağlantı elemanı alımı yapılacaktır. Fabrika sahamıza teslim edilecektir.',
    categoryId: 12,
    kategori: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri / Sac, Profil & Demir Ürünleri',
    mainCategory: 'Hırdavat ve Metal',
    subCategory: 'Sac, Profil & Demir Ürünleri',
    city: 'Manisa',
    ownerCompany: 'Ege Paslanmaz ve Metal İşleme Ltd. Şti.',
    ownerEmail: 'tedarik@egepaslanmaz.com',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Metal Profil ve Hırdavat Alımı',
    usul: 'Fiyat Eksiltmeli',
    butce: '1.750.000 ₺',
    sure: '5 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 97,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80', name: 'Metal Profil' }],
    teklifSayisi: 3,
    olusturma: 'Bugün',
    isBaseline: true
  },
  {
    id: 'IHC-2026-119',
    baslik: 'İzmir Bornova 50.000 Adet Kurumsal Ürün Kataloğu Baskısı ve Oluklu Mukavva Koli Alımı',
    aciklama: '2026/2027 ürün yılı için 64 sayfa, mat kuşe 170 gr iç, 350 gr mat selefonlu laklı kapak 50.000 adet katalog ofset baskısı ile ürün sevkiyatı için 10.000 adet dopel oluklu mukavva koli alımıdır.',
    categoryId: 15,
    kategori: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri / Ofset & Dijital Matbaa Baskısı',
    mainCategory: 'Matbaa ve Ambalaj',
    subCategory: 'Ofset & Dijital Matbaa Baskısı',
    city: 'İzmir',
    ownerCompany: 'Körfez Kozmetik & Kimya Üretim A.Ş.',
    ownerEmail: 'pazarlama@korfezkozmetik.com.tr',
    ownerPhone: '0850 840 86 95',
    ihaleYonu: 'eksiltme',
    tur: 'Matbaa ve Ambalaj Alımı',
    usul: 'Fiyat Eksiltmeli',
    butce: '920.000 ₺',
    sure: '6 gün kaldı',
    durum: 'active',
    statusCode: 'LIVE',
    adminApproved: true,
    aiApproved: true,
    aiScore: 98,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
    images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80', name: 'Katalog ve Matbaa' }],
    teklifSayisi: 5,
    olusturma: 'Bugün',
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
    if (tender.isIlan || tender.ihaleYonu === 'ihalesiz_ilan') {
      return {
        durum: 'active',
        durumLabel: '📢 Proje & Hizmet İlanı',
        sureText,
        isExpired: false,
        remainingMs: diff
      }
    }
    return {
      durum: 'active',
      durumLabel: 'Canlı İhale',
      sureText,
      isExpired: false,
      remainingMs: diff
    }
  }

  if (tender.isIlan || tender.ihaleYonu === 'ihalesiz_ilan') {
    return {
      durum: tender.durum || 'active',
      durumLabel: '📢 Proje & Hizmet İlanı',
      sureText: tender.sure || 'Yayında',
      isExpired: tender.durum === 'closed',
      remainingMs: 0
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
    if (diskTenders && Array.isArray(diskTenders) && diskTenders.length > 0) {
      // Filter out test dummy tenders
      const cleanDisk = diskTenders.filter(t => t && t.id && !t.id.startsWith('TND-IDOR') && !t.id.startsWith('TND-TEST'))
      const merged = [...cleanDisk]
      for (const b of BASELINE_TENDERS) {
        const existing = merged.find(m => m.id === b.id)
        if (!existing) {
          merged.push(b)
        } else {
          if (!existing.categoryId && b.categoryId) existing.categoryId = b.categoryId
          if (b.kategori && (!existing.kategori || existing.kategori === 'Hammadde')) existing.kategori = b.kategori
          if (b.mainCategory && !existing.mainCategory) existing.mainCategory = b.mainCategory
          if (b.subCategory && !existing.subCategory) existing.subCategory = b.subCategory
        }
      }
      globalThis.__SHARED_TENDERS__ = merged
      trySaveToDisk(merged)
    } else {
      globalThis.__SHARED_TENDERS__ = [...BASELINE_TENDERS]
      trySaveToDisk(globalThis.__SHARED_TENDERS__)
    }
  }

  // Auto-normalize and calculate dynamic timing for all items
  const tenders = globalThis.__SHARED_TENDERS__ || []
  for (const t of tenders) {
    if (t.id === 'IHC-2026-910') {
      t.categoryId = 11
      t.kategori = 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri'
      t.mainCategory = 'Ofis & Mobilya'
    }
    const timing = computeTenderTiming(t)
    t.durum = timing.durum
    t.sure = timing.sureText
    if (t.isIlan || t.ihaleYonu === 'ihalesiz_ilan') {
      t.durumLabel = '📢 Proje & Hizmet İlanı'
    }
  }

  return tenders
}

export function syncTendersBatch(incomingTenders: TenderItem[]): TenderItem[] {
  if (!Array.isArray(incomingTenders) || incomingTenders.length === 0) {
    return getAllTenders()
  }
  const current = getAllTenders()
  const map = new Map<string, TenderItem>()
  current.forEach(t => { if (t && t.id) map.set(t.id, t) })
  incomingTenders.forEach(t => {
    if (t && t.id) {
      const existing = map.get(t.id)
      map.set(t.id, { ...existing, ...t })
    }
  })
  const updated = Array.from(map.values())
  globalThis.__SHARED_TENDERS__ = updated
  trySaveToDisk(updated)
  return updated
}

export function addTender(tender: TenderItem): TenderItem {
  const list = getAllTenders()
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

export function saveTenders(list: TenderItem[]): void {
  globalThis.__SHARED_TENDERS__ = list
  trySaveToDisk(list)
}

export function clearAllTenders(): void {
  globalThis.__SHARED_TENDERS__ = []
  trySaveToDisk([])
}

export function validateTenderStatusTransition(
  current: TenderStatus | string | undefined,
  target: TenderStatus
): { allowed: boolean; error?: string } {
  const normCurrent = (current || 'LIVE').toUpperCase() as TenderStatus
  if (normCurrent === target) return { allowed: true }

  const validTransitions: Record<TenderStatus, TenderStatus[]> = {
    DRAFT: ['APPROVAL_PENDING', 'SCHEDULED', 'LIVE', 'CANCELLED'],
    APPROVAL_PENDING: ['DRAFT', 'SCHEDULED', 'LIVE', 'CANCELLED'],
    SCHEDULED: ['LIVE', 'CANCELLED'],
    LIVE: ['CLOSED', 'SUSPENDED', 'CANCELLED', 'EVALUATION'],
    SUSPENDED: ['LIVE', 'CANCELLED'],
    CLOSED: ['EVALUATION', 'UNSUCCESSFUL', 'CANCELLED'],
    EVALUATION: ['PROVISIONAL_RESULT', 'UNSUCCESSFUL', 'CANCELLED', 'FINALIZED'],
    PROVISIONAL_RESULT: ['FINAL_APPROVAL_PENDING', 'FINALIZED', 'EVALUATION', 'UNSUCCESSFUL', 'CANCELLED'],
    FINAL_APPROVAL_PENDING: ['FINALIZED', 'PROVISIONAL_RESULT', 'UNSUCCESSFUL', 'CANCELLED'],
    FINALIZED: [], // Terminal
    UNSUCCESSFUL: [], // Terminal
    CANCELLED: [] // Terminal
  }

  const allowedTargets = validTransitions[normCurrent] || []
  if (!allowedTargets.includes(target)) {
    return {
      allowed: false,
      error: `Geçersiz statü geçişi: "${normCurrent}" durumundaki bir ihale "${target}" durumuna geçirilemez (PRD Bölüm 3.3).`
    }
  }

  return { allowed: true }
}

export function updateTenderStatus(
  id: string,
  targetStatus: TenderStatus,
  options?: { reasonCode?: TenderReasonCode; reasonNote?: string }
): { success: boolean; tender?: TenderItem; error?: string } {
  const list = getAllTenders()
  const target = list.find(t => t.id === id)
  if (!target) {
    return { success: false, error: 'İhale bulunamadı.' }
  }

  const currentStatus = (target.statusCode || (target.durum === 'closed' ? 'CLOSED' : 'LIVE')) as TenderStatus
  const check = validateTenderStatusTransition(currentStatus, targetStatus)
  if (!check.allowed) {
    return { success: false, error: check.error }
  }

  target.statusCode = targetStatus
  target.durum = targetStatus.toLowerCase()
  if (options?.reasonCode) target.reasonCode = options.reasonCode
  if (options?.reasonNote) target.reasonNote = options.reasonNote

  addTender(target)
  return { success: true, tender: target }
}
