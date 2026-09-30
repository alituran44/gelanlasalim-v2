import { Tender, BidItem, CategoryItem } from '../types/tender'
import { ALL_40_CATEGORIES, formatExternalUrl } from '../constants/taxonomy'

const API_BASE_URL = 'https://ihaleciburada.com/api'

// High-fidelity seed dataset matching Turkish founder requirements and real platform tenders
export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'tender-101',
    baslik: 'Bodrum Yalıkavak Panoramik Deniz Manzaralı Müstakil Villa İhalesi',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Ev',
    categoryId: 40,
    ihaleYonu: 'satis',
    tur: 'Açık Teklif',
    rekabetTuru: 'Fiyat Teklifi',
    sure: '6 Gün Kaldı',
    teklifSayisi: 14,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '42.500.000 ₺',
    city: 'Muğla',
    teslimatAdresi: 'Yalıkavak Mah. Marina Yolu No:18, Bodrum / Muğla',
    odemeYontemi: 'Banka Teminat Mektubu / Nakit',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Bodrum Yalıkavak bölgesinde yer alan, 850 m² arsa paylı, özel sonsuzluk havuzlu, akıllı ev otomasyonlu müstakil lüks villa. Tapusu hazır, ipoteksiz ve hemen teslime uygundur.',
    customFields: {
      adaParsel: '142 / 8',
      imarDurumu: 'Konut İmarlı',
      metrekare: '450 m²',
      odaSayisi: '5+2',
      formType: 'GAYRIMENKUL'
    },
    websiteUrl: 'https://ihaleciburada.com/ilan/bodrum-yalikavak-villa',
    ownerPhone: '+90 532 111 22 33',
    ownerEmail: 'gayrimenkul@bodrumyatirim.com',
    ownerCompany: 'Ege Lüks Gayrimenkul Yatırım A.Ş.',
    olusturma: '2026-09-26'
  },
  {
    id: 'tender-102',
    baslik: '✨ Özel Proje: Endüstriyel Drone ile Güneş Enerjisi Santrali Termal Denetim Hizmeti',
    kategori: 'Diğer İhale ve İlanlar',
    mainCategory: 'Diğer İhale ve İlanlar',
    subCategory: 'Diğer',
    categoryId: 99,
    ihaleYonu: 'hizmet_alimi',
    tur: 'Kapalı Zarf',
    rekabetTuru: 'Hizmet İhalesi',
    sure: '3 Gün Kaldı',
    teklifSayisi: 8,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '380.000 ₺',
    city: 'Konya',
    teslimatAdresi: 'Karapınar Güneş Enerjisi İhtisas Bölgesi, Konya',
    odemeYontemi: '%40 Avans + Hakediş',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: '50 MW gücündeki Karapınar GES sahamız için termal kameralı endüstriyel İHA ile arıza, hot-spot tespiti ve detaylı IEC uyumlu raporlama hizmeti alınacaktır.',
    customFields: {
      altKategoriDiger: 'Endüstriyel Drone & GES Denetimi',
      digerMetni: 'Endüstriyel Drone & GES Denetimi',
      formType: 'STANDART'
    },
    websiteUrl: 'https://solarenerji.com.tr/ihale',
    ownerPhone: '+90 332 444 55 66',
    ownerEmail: 'ihale@karapinarges.com',
    ownerCompany: 'Anadolu Solar Enerji Üretim A.Ş.',
    olusturma: '2026-09-27'
  },
  {
    id: 'tender-103',
    baslik: '📢 Reklam İlanı: Kadıköy Moda Caddesi Köşe Başı Devren Kiralık Butik Kafe & Restoran',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'İşyeri',
    categoryId: 40,
    ihaleYonu: 'reklam',
    tur: 'Reklam İlanı',
    rekabetTuru: 'Devren Kiralık',
    sure: '12 Gün Kaldı',
    teklifSayisi: 22,
    durum: 'Öne Çıkan',
    statusCode: 'promoted',
    statusLabel: '📢 Reklam İlanı',
    butce: '3.750.000 ₺ (Devir Bedeli)',
    city: 'İstanbul',
    teslimatAdresi: 'Caferağa Mah. Moda Cad. No:84, Kadıköy / İstanbul',
    odemeYontemi: 'Nakit / Peşin Devir',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Moda Caddesi üzerinde köşe konumda, bacalı, tam teşekküllü profesyonel mutfak ekipmanları, İtalyan espresso makinesi ve hazır müşteri potansiyeli ile devren satılıktır.',
    customFields: {
      formType: 'REKLAM_ILANI',
      kapasite: '75 Kişi',
      ruhsat: 'İçkisiz Restoran & Kafe Ruhsatlı'
    },
    websiteUrl: 'https://modakafe.net',
    ownerPhone: '+90 216 333 44 55',
    ownerEmail: 'iletisim@modakafe.net',
    ownerCompany: 'Kadıköy Gastronomi İşletmeleri',
    olusturma: '2026-09-25'
  },
  {
    id: 'tender-104',
    baslik: 'Başakşehir Şehir Hastanesi Civarı 12.000 m² Ticari + Konut İmarlı Arsa İhalesi',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Arsa',
    categoryId: 40,
    ihaleYonu: 'satis',
    tur: 'Açık Artırma',
    rekabetTuru: 'En Yüksek Fiyat',
    sure: '9 Gün Kaldı',
    teklifSayisi: 19,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '115.000.000 ₺',
    city: 'İstanbul',
    teslimatAdresi: 'Ziya Gökalp Mah. Olimpiyat Yolu, Başakşehir / İstanbul',
    odemeYontemi: '%30 Peşin, 18 Ay Vade',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Kuzey Marmara Otoyolu ve metro durağına yürüme mesafesinde, Emsal: 2.0 Hmax: Serbest inşaat ruhsatına hazır köşe parsel arsa ihalesi.',
    customFields: {
      adaParsel: '890 / 14',
      imarDurumu: 'Ticaret + Konut (E:2.0)',
      formType: 'GAYRIMENKUL'
    },
    websiteUrl: 'https://ihaleciburada.com/arsa-basaksehir',
    ownerPhone: '+90 212 999 88 77',
    ownerEmail: 'ihale@istanbularsa.com.tr',
    ownerCompany: 'Marmara Gayrimenkul Geliştirme A.Ş.',
    olusturma: '2026-09-24'
  },
  {
    id: 'tender-105',
    baslik: 'Metro Projesi Kapsamında 15.000 Ton Hazır Beton ve Pompalama Hizmeti Alımı',
    kategori: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    mainCategory: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
    subCategory: 'Hazır Beton',
    categoryId: 1,
    ihaleYonu: 'satin_alma',
    tur: 'Eksiltme İhalesi',
    rekabetTuru: 'Birim Fiyat',
    sure: '4 Gün Kaldı',
    teklifSayisi: 11,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '48.000.000 ₺',
    city: 'Ankara',
    teslimatAdresi: 'Keçiören - Ovacık Metro Şantiye Sahası, Ankara',
    odemeYontemi: '60 Gün Vadeli Çek',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Keçiören metro uzatma hattı istasyon yapılarında kullanılmak üzere C35/45 sınıfı sülfata dayanıklı hazır beton tedariği ve sahada transmikser/pompa hizmeti alımı yapılacaktır.',
    customFields: {
      betonSinifi: 'C35/45',
      miktar: '15.000 m³',
      formType: 'STANDART'
    },
    websiteUrl: 'https://baskentyapi.com.tr/ihaleler',
    ownerPhone: '+90 312 222 33 44',
    ownerEmail: 'satinalma@baskentyapi.com.tr',
    ownerCompany: 'Başkent Altyapı İnşaat Konsorsiyumu',
    olusturma: '2026-09-23'
  },
  {
    id: 'tender-106',
    baslik: 'Çukurova Bölgesi 1.200 Ton Sert Ekmeklik Buğday Toplu Alım İhalesi',
    kategori: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri',
    mainCategory: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri',
    subCategory: 'Hububat & Tahıl',
    categoryId: 3,
    ihaleYonu: 'satin_alma',
    tur: 'Açık Teklif',
    rekabetTuru: 'En Uygun Teklif',
    sure: '7 Gün Kaldı',
    teklifSayisi: 9,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '13.800.000 ₺',
    city: 'Adana',
    teslimatAdresi: 'Yüreğir Lisanslı Depo Tesisleri Silo Sahası, Adana',
    odemeYontemi: 'Teslimatta Nakit / Havale',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Un fabrikamızın üretim hattı için protein oranı min %13.5, hektolitre min 78 kg olan 2026 mahsulü sert kırmızı ekmeklik buğday alımı yapılacaktır.',
    customFields: {
      proteinOrani: '%13.5',
      miktar: '1.200 Ton',
      formType: 'STANDART'
    },
    websiteUrl: 'https://cukurovaun.com.tr',
    ownerPhone: '+90 322 555 66 77',
    ownerEmail: 'tedarik@cukurovaun.com.tr',
    ownerCompany: 'Çukurova Un ve Yem Sanayi A.Ş.',
    olusturma: '2026-09-26'
  },
  {
    id: 'tender-107',
    baslik: '✨ Özel İmalat: 5 Eksenli CNC İşleme Merkezi İçin Titanyum Parça Fason Üretim',
    kategori: 'Diğer İhale ve İlanlar',
    mainCategory: 'Diğer İhale ve İlanlar',
    subCategory: 'Diğer',
    categoryId: 99,
    ihaleYonu: 'fason_uretim',
    tur: 'Teklif Toplama',
    rekabetTuru: 'Teknik Yeterlilik & Fiyat',
    sure: '5 Gün Kaldı',
    teklifSayisi: 6,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '1.850.000 ₺',
    city: 'Eskişehir',
    teslimatAdresi: 'Eskişehir Organize Sanayi Bölgesi 22. Cadde No:14',
    odemeYontemi: 'Hakediş Usulü',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Havacılık standartlarında AS9100 sertifikalı tedarikçilerden Ti-6Al-4V kalite titanyum alaşımlı flanş ve braket parçalarının hassas 5 eksenli CNC fason işçilik ihalesidir.',
    customFields: {
      altKategoriDiger: 'Havacılık Titanyum Fason Talaşlı İmalat',
      digerMetni: 'Havacılık Titanyum Fason Talaşlı İmalat',
      formType: 'STANDART'
    },
    websiteUrl: 'https://eskisehirhavacilik.com',
    ownerPhone: '+90 222 333 44 55',
    ownerEmail: 'fason@eskisehirhavacilik.com',
    ownerCompany: 'Eskişehir İleri Havacılık Teknolojileri A.Ş.',
    olusturma: '2026-09-27'
  },
  {
    id: 'tender-108',
    baslik: 'Maslak Plaza Katında 650 m² Hazır Ofis ve Toplantı Salonları Kiralama İhalesi',
    kategori: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    mainCategory: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri',
    subCategory: 'Ofis',
    categoryId: 40,
    ihaleYonu: 'kiralama',
    tur: 'Açık Teklif',
    rekabetTuru: 'Aylık Kira Teklifi',
    sure: '11 Gün Kaldı',
    teklifSayisi: 17,
    durum: 'Aktif İhale',
    statusCode: 'active',
    statusLabel: 'Yayında',
    butce: '420.000 ₺ / Ay',
    city: 'İstanbul',
    teslimatAdresi: 'Büyükdere Cad. Maslak Plaza Kat:14, Sarıyer / İstanbul',
    odemeYontemi: '3 Aylık Peşin Kira',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
    ],
    aciklama: 'Büyükdere Caddesi üzerinde A+ plazada, tam eşyalı, 8 bağımsız yönetici odası, 60 kişilik açık ofis alanı ve konferans salonuna sahip kurumsal ofis katı kiralama ihalesi.',
    customFields: {
      metrekare: '650 m²',
      kapasite: '75 Personel',
      formType: 'GAYRIMENKUL'
    },
    websiteUrl: 'https://maslakplaza.com.tr',
    ownerPhone: '+90 212 888 77 66',
    ownerEmail: 'kiralama@maslakplaza.com.tr',
    ownerCompany: 'Maslak Gayrimenkul Yatırım Ortaklığı',
    olusturma: '2026-09-24'
  }
]

let inMemoryTenders: Tender[] = [...INITIAL_TENDERS]

const INITIAL_BIDS: BidItem[] = [
  {
    id: 'bid-1',
    tenderId: 'tender-101',
    tenderTitle: 'Bodrum Yalıkavak Panoramik Villa İhalesi',
    bidderCompany: 'Alp Emlak Yatırım Ltd. Şti.',
    amount: '41.250.000 ₺',
    date: '27.09.2026 14:20',
    status: 'pending'
  },
  {
    id: 'bid-2',
    tenderId: 'tender-103',
    tenderTitle: 'Kadıköy Moda Caddesi Köşe Başı Restoran',
    bidderCompany: 'Boğaziçi Kafe İşletmeciliği A.Ş.',
    amount: '3.600.000 ₺',
    date: '26.09.2026 11:45',
    status: 'accepted'
  },
  {
    id: 'bid-3',
    tenderId: 'tender-105',
    tenderTitle: 'Metro Projesi 15.000 Ton Hazır Beton Alımı',
    bidderCompany: 'Başkent Hazır Beton A.Ş.',
    amount: '46.800.000 ₺',
    date: '25.09.2026 16:10',
    status: 'pending'
  }
]

let inMemoryBids: BidItem[] = [...INITIAL_BIDS]

export const apiService = {
  async getTenders(filter?: { categoryId?: number; search?: string; city?: string }): Promise<Tender[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)
      
      const res = await fetch(`${API_BASE_URL}/tenders`, { credentials: 'omit', signal: controller.signal })
      clearTimeout(timeoutId)
      
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          // Merge network data with local memory
          const serverIds = new Set(data.map((d: any) => d.id))
          const nonDuplicated = inMemoryTenders.filter(t => !serverIds.has(t.id))
          inMemoryTenders = [...data, ...nonDuplicated]
        }
      }
    } catch {
      // Fallback silently to offline dataset
    }

    let result = [...inMemoryTenders]

    if (filter?.categoryId) {
      result = result.filter(t => t.categoryId === filter.categoryId)
    }

    if (filter?.city && filter.city !== 'Tümü') {
      result = result.filter(t => t.city?.toLowerCase().includes(filter.city!.toLowerCase()))
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim()
      result = result.filter(t =>
        t.baslik.toLowerCase().includes(q) ||
        t.kategori.toLowerCase().includes(q) ||
        (t.aciklama && t.aciklama.toLowerCase().includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q))
      )
    }

    return result
  },

  async getTenderById(id: string): Promise<Tender | null> {
    const found = inMemoryTenders.find(t => t.id === id)
    if (found) return found

    try {
      const res = await fetch(`${API_BASE_URL}/tenders/${id}`)
      if (res.ok) {
        const item = await res.json()
        return item
      }
    } catch {
      // ignore
    }
    return null
  },

  async createTender(tender: Partial<Tender>): Promise<Tender> {
    const isDiger = tender.categoryId === 99 || tender.kategori?.includes('Diğer')
    const customBadge = tender.customFields?.altKategoriDiger || tender.customFields?.digerMetni

    const newTender: Tender = {
      id: `tender-${Date.now()}`,
      baslik: isDiger && customBadge ? `✨ ${customBadge}: ${tender.baslik}` : (tender.baslik || 'Yeni İhale'),
      kategori: tender.kategori || (isDiger ? 'Diğer İhale ve İlanlar' : 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri'),
      categoryId: tender.categoryId || (isDiger ? 99 : 40),
      mainCategory: tender.mainCategory || tender.kategori,
      subCategory: tender.subCategory || 'Genel',
      ihaleYonu: tender.ihaleYonu || 'teklif_toplama',
      tur: tender.tur || 'Açık İhale',
      rekabetTuru: tender.rekabetTuru || 'Teklif Usulü',
      sure: '15 Gün Kaldı',
      teklifSayisi: 0,
      durum: 'Yeni Yayında',
      statusCode: 'new',
      statusLabel: tender.ihaleYonu === 'reklam' ? '📢 Reklam İlanı' : 'Yeni Yayında',
      butce: tender.butce || 'Teklif Usulü',
      city: tender.city || 'İstanbul',
      teslimatAdresi: tender.teslimatAdresi || 'Belirtilmedi',
      odemeYontemi: tender.odemeYontemi || 'Anlaşmalı',
      image: tender.image || (tender.images && tender.images[0]) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      images: tender.images && tender.images.length > 0 ? tender.images : [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
      ],
      aciklama: tender.aciklama || 'Detaylı şartname ve koşullar başvuru sonrası paylaşılacaktır.',
      customFields: tender.customFields || {},
      websiteUrl: formatExternalUrl(tender.websiteUrl),
      ownerPhone: tender.ownerPhone || '+90 555 123 45 67',
      ownerEmail: tender.ownerEmail || 'info@ihaleciburada.com',
      ownerCompany: tender.ownerCompany || 'Bireysel / Kurumsal Üye',
      isMine: true,
      olusturma: new Date().toISOString().split('T')[0]
    }

    inMemoryTenders.unshift(newTender)

    // Attempt live server synchronization in the background
    try {
      fetch(`${API_BASE_URL}/tenders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTender)
      }).catch(() => {})
    } catch {
      // offline support
    }

    return newTender
  },

  getCategories(): CategoryItem[] {
    return [...ALL_40_CATEGORIES].sort((a, b) => a.orderRank - b.orderRank)
  },

  async getBids(): Promise<BidItem[]> {
    return [...inMemoryBids]
  },

  async submitBid(tenderId: string, amount: string, bidderCompany = 'Şirketim A.Ş.'): Promise<boolean> {
    const target = inMemoryTenders.find(t => t.id === tenderId)
    if (target) {
      target.teklifSayisi = (target.teklifSayisi || 0) + 1
    }

    const newBid: BidItem = {
      id: `bid-${Date.now()}`,
      tenderId,
      tenderTitle: target ? target.baslik : 'İhale Teklifi',
      bidderCompany,
      amount,
      date: new Date().toLocaleString('tr-TR'),
      status: 'pending'
    }

    inMemoryBids.unshift(newBid)
    return true
  }
}
