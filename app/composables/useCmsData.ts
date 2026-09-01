import { ref } from 'vue'

const SCHEMA_VERSION = 'v2026_09_01_baseline_inventory_v6'

// Clean state for platform - zero dummy / mock data
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: "ÖZEL SEKTÖRÜN CANLI TERS İHALE VE PAZARLIK ARENASI",
    titleLine1: 'İhale Aç.',
    titleLine2: 'Teklif Topla.',
    titleItalic: "İhaleci Burada.",
    description: 'İhaleciBurada.com; e-ihale, ihale ve satın alma, teklif toplama ve doğrudan fiyat pazarlığı süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, rekabetçi tekliflerle tasarruf edin.',
    badgeStrip: [
      'KVKK & GDPR UYUMLU',
      'BELGE DENETİMİ & ZAMAN DAMGASI',
      'ŞİFRELİ VERİ İLETİMİ',
      'DOĞRUDAN PAZARLIK MODÜLÜ'
    ],
    heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-corporate-team-working-together-in-an-office-42790-large.mp4'
  },
  liveTender: {
    title: 'Canlı İhale Bekleniyor',
    remainingTime: '00:00',
    bestBid: 0,
    openingPrice: 0,
    savingsText: 'TASARRUF %0',
    competitors: []
  },
  pricing: {
    vatNotice: 'Fiyatlara %20 KDV dahildir.',
    disclaimer: 'Bu hizmet İhaleciBurada Bilişim ve Tedarik A.Ş. tarafından yürütülmektedir.',
    packages: [
      { id: '1_month', name: 'Üyelik Başvurusu - 1 Ay', price: 900, months: 1, monthlyPrice: 900, badge: 'KURUMSAL KULLANIM' },
      { id: '3_months', name: 'Üyelik Başvurusu - 3 Ay', price: 1800, months: 3, monthlyPrice: 600, badge: 'EN ÇOK TERCİH EDİLEN POPÜLER PLAN', popular: true },
      { id: '6_months', name: 'Üyelik Başvurusu - 6 Ay', price: 2700, months: 6, monthlyPrice: 450, badge: 'KURUMSAL KULLANIM' },
      { id: '9_months', name: 'Üyelik Başvurusu - 9 Ay', price: 3600, months: 9, monthlyPrice: 400, badge: 'YILLIK AVANTAJ' }
    ],
    features: [
      [
        'Kamu ihale arama',
        'İhale sonuçları analizi',
        'Doğrudan temin ilanları',
        'Satış ve kiralama duyuruları',
        'Hukuki mevzuat kararları',
        'Eşik değer hesaplama'
      ],
      [
        'Akıllı arama önerileri',
        'Yaklaşan ihale bildirimleri',
        'Sonuçlanan ihale uyarıları',
        'İptal ve düzeltme duyuruları',
        'Sınırsız bildirim (SMS+E-Posta)',
        'Sınırsız raporlama (Excel)'
      ],
      [
        'Yüklenici firma analizleri',
        'İdare/Kurum analizleri',
        'Sektörel pazar analizleri',
        'Rakip firma analizleri',
        'Mobil uyumlu uygulama'
      ]
    ]
  },
  faqs: [
    { q: "Tersine ihale (eksiltme) sistemi nasıl çalışır?", a: "Alıcı firma satın almak istediği malzeme veya hizmet için miktar ve teknik şartname belirterek ihale açar. Doğrulanmış tedarikçiler canlı sürede fiyat eksilterek yarışır." },
    { q: "Platformda şirket doğrulaması nasıl yapılıyor?", a: "Vergi levhası, imza sirküleri ve ticaret sicil gazetesi ekibimizce kontrol edilir. Yalnızca onaylanmış kurumsal hesaplar ihale açabilir ve teklif verebilir." },
    { q: "Ödeme ve teslimat süreçleri güvenli mi?", a: "Evet. Alıcı firma ihale bedelini güvenli hesaba yatırır. Teslimat onaylanıp denetlendikten sonra ödeme tedarikçiye aktarılır." },
    { q: "Alıcı firmalar komisyon veya ücret öder mi?", a: "Hayır. İhaleciBurada platformu alıcı firmalar için tamamen ücretsizdir." },
    { q: "Hangi sektörlerde ihale açabilirim?", a: "Tarım, inşaat, sağlık, teknoloji, lojistik, ambalaj, otomotiv ve tüm kurumsal satın alma kategorilerinde ihale açabilirsiniz." }
  ],
  problems: [
    { title: "Şartnameler ve teklifler dağınık kalır.", desc: "Tedarikçilere ayrı formlar ve e-postalar göndermek karmaşa ve hatalara yol açar." },
    { title: "Fiyat karşılaştırması manuel ve hataya açıktır.", desc: "Karmaşık Excel dosyaları, telefon trafiği ve uzayan e-posta zincirlerinde zaman kaybedilir." },
    { title: "Tedarikçi kalifikasyonu belgesizdir.", desc: "Evrak ve sicil denetimi yapılmadan yazılan sözleşmeler ticari risk yaratır." }
  ],
  features: [
    { title: "Ters İhale Arenası", desc: "Kapalı zarf usulü yerine canlı ve şeffaf eksiltmeli fiyat rekabeti." },
    { title: "Nitelikli Tedarikçi Akışı", desc: "Evrak kontrolünden geçmiş doğrulanmış kurumsal firma profilleri." },
    { title: "Belgeli Teklif Akışı", desc: "Şartname yükleyin, karşılaştırılabilir yapıda teklifler alın." },
    { title: "Detaylı Analitik", desc: "Maliyet geçmişi takibi, teklif kıyaslama ve karar çıktıları." }
  ],
  trustStandards: [
    { title: "TLS 1.2+", subtitle: "ŞİFRELİ VERİ", desc: "Tüm veri iletimlerinde HTTPS/SSL şifreleme." },
    { title: "KVKK Uyumlu", subtitle: "VERİ KORUMA", desc: "Kişisel verilerin korunması kanununa tam uyumluluk." },
    { title: "İşlem Günlüğü", subtitle: "KAYIT İZİ", desc: "Her teklif ve işlem için zaman damgalı tutulan kayıtlar." },
    { title: "TR · EN", subtitle: "ÇOKLU DİL", desc: "Türkçe ve İngilizce çift dil arayüz desteği." }
  ],
  stats: [
    { value: '0 ₺', label: 'Toplam Ticaret Hacmi' },
    { value: '0', label: 'Doğrulanmış B2B Üretici' },
    { value: '%0', label: 'Ortalama Tedarik Tasarrufu' },
    { value: '0 ₺', label: 'Alıcı Üyelik Komisyonu' }
  ],
  videoGuides: [
    { title: 'Nasıl Kayıt Olunur?', desc: 'Adım adım üyelik ve firma kaydı rehberi', videoUrl: '' },
    { title: 'Nasıl İhale Açılır?', desc: 'İlk ihale ve satın alma ihalenizi dakikalar içinde başlatın', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak ihale ve satın almaye katılma rehberi', videoUrl: '' },
    { title: 'Yönetim Paneli Rehberi', desc: 'Kontrol panelini ve raporlamaları etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [
  {
    "id": "IHC-2026-901",
    "baslik": "Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi",
    "aciklama": "Balıkesir Organize Sanayi Bölgesinde 12.000 m² kapalı alana sahip çelik konstrüksiyon üretim tesisi, sandviç panel çatı ve cephe kaplama işleri anahtar teslim ihale usulüyle yaptırılacaktır.",
    "kategori": "İnşaat - Altyapı - Üstyapı - Yapım İşi",
    "mainCategory": "İnşaat & Yapı",
    "subCategory": "Çelik Yapı & Çatı",
    "city": "Balıkesir",
    "ownerCompany": "Marmara Çelik ve Ağır Sanayi A.Ş.",
    "authority": "Balıkesir OSB Müdürlüğü",
    "butce": "18.500.000 ₺",
    "sure": "24 gün kaldı",
    "durum": "active",
    "ihaleYonu": "kapali_zarf",
    "tur": "Yapım İşi",
    "usul": "Kapalı Zarf Teklif Usulü",
    "teklifSayisi": 8,
    "liderTeklif": "17.850.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99.2,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-902",
    "baslik": "Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi",
    "aciklama": "Çanakkale ve Balıkesir limanlarından Bursa, Kocaeli ve İzmir fabrikalarına yıl boyu 15.000 ton dökme ve paletli hammadde taşımacılığı için özmal/kiralık araç filosu temin ihalesidir.",
    "kategori": "Lojistik ve Nakliye Hizmetleri",
    "mainCategory": "Lojistik & Taşımacılık",
    "subCategory": "Karayolu Nakliye",
    "city": "Çanakkale",
    "ownerCompany": "Mega Lojistik ve Dağıtım A.Ş.",
    "authority": "T.C. Ulaştırma ve Altyapı Bakanlığı",
    "butce": "4.200.000 ₺",
    "sure": "18 gün kaldı",
    "durum": "active",
    "ihaleYonu": "eksiltme",
    "tur": "Hizmet Alımı",
    "usul": "Açık Eksiltme",
    "teklifSayisi": 14,
    "liderTeklif": "3.890.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 98.7,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-903",
    "baslik": "Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı",
    "aciklama": "Otomotiv yan sanayi parça üretimi için yüksek hassasiyetli 2 adet 5 eksenli dikey CNC dik işleme merkezi, takım tutucular ve robotik yükleme hücresi satın alma ihalesidir.",
    "kategori": "Sanayi ve Makine Ekipmanları",
    "mainCategory": "Makine & Ekipman",
    "subCategory": "CNC & Takım Tezgahları",
    "city": "Bursa",
    "ownerCompany": "Anadolu Çelik ve Metal Sanayi A.Ş.",
    "authority": "Bursa Organize Sanayi Bölgesi",
    "butce": "8.900.000 ₺",
    "sure": "15 gün kaldı",
    "durum": "active",
    "ihaleYonu": "kapali_zarf",
    "tur": "Mal Alımı",
    "usul": "Doğrudan Teklif Alma",
    "teklifSayisi": 6,
    "liderTeklif": "8.450.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 98.4,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-904",
    "baslik": "100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği",
    "aciklama": "Gıda ve tekstil ihracatında kullanılmak üzere dopel oluklu mukavva, flexo 4 renk baskılı koli, separatör ve kraft kutu alımı için yıllık çerçeve sözleşme ihalesi.",
    "kategori": "Ambalaj, Koli ve Kağıt",
    "mainCategory": "Ambalaj & Kağıt",
    "subCategory": "Mukavva Koli",
    "city": "İzmir",
    "ownerCompany": "Ege Ambalaj ve İhracat Sanayi A.Ş.",
    "authority": "Ege İhracatçı Birlikleri",
    "butce": "1.650.000 ₺",
    "sure": "12 gün kaldı",
    "durum": "active",
    "ihaleYonu": "eksiltme",
    "tur": "Mal Alımı",
    "usul": "Canlı Açık Eksiltme",
    "teklifSayisi": 19,
    "liderTeklif": "1.420.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-905",
    "baslik": "Bandırma 2.5 MW Endüstriyel Çatı Güneş Enerji Santrali (GES) EPC Kurulumu",
    "aciklama": "Fabrika çatısına 2.5 MWp gücünde monokristal güneş panelleri, inverterler, OG trafo merkezi, SCADA izleme sistemi ve TEDAŞ kabulü dahil anahtar teslim GES kurulumu.",
    "kategori": "Enerji, Akaryakıt ve GES Tesisatı",
    "mainCategory": "Enerji & Elektrik",
    "subCategory": "GES & Güneş Paneli",
    "city": "Balıkesir",
    "ownerCompany": "Global Enerji ve Güneş Sistemleri",
    "authority": "Balıkesir Bandırma Belediyesi",
    "butce": "28.000.000 ₺",
    "sure": "20 gün kaldı",
    "durum": "active",
    "ihaleYonu": "kapali_zarf",
    "tur": "Yapım İşi",
    "usul": "Kapalı Zarf Usulü",
    "teklifSayisi": 11,
    "liderTeklif": "26.400.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99.5,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-906",
    "baslik": "Kurumsal Bulut Sunucu Altyapısı, Firewall Donanımı & 3 Yıllık Siber Güvenlik Hizmeti",
    "aciklama": "Şirket merkez ve bölge ofisleri için Tier-3 sertifikalı hibrit bulut sunucuları, yedekli NGFW güvenlik duvarı cihazları ve 7/24 SOC izleme hizmet alımı ihalesidir.",
    "kategori": "Bilişim, Yazılım ve IT Ekipmanı",
    "mainCategory": "Teknoloji & Yazılım",
    "subCategory": "Sunucu & Donanım",
    "city": "İstanbul",
    "ownerCompany": "Avrasya Bilişim ve Yazılım A.Ş.",
    "authority": "Bilişim Vadisi Teknopark",
    "butce": "3.400.000 ₺",
    "sure": "9 gün kaldı",
    "durum": "active",
    "ihaleYonu": "eksiltme",
    "tur": "Hizmet Alımı",
    "usul": "Açık Eksiltme",
    "teklifSayisi": 7,
    "liderTeklif": "3.050.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 98.9,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-907",
    "baslik": "1.200 Ton Sertifikalı Ekmeklik Buğday & Endüstriyel Un Tedarik İhalesi",
    "aciklama": "Marmara Bölgesi un fabrikaları ve fırın işletmeleri için yüksek proteinli, analiz raporlu 1.200 ton ekmeklik buğday doğrudan alım ihalesidir.",
    "kategori": "Gıda, İkram ve Yemek Hizmetleri",
    "mainCategory": "Tarım & Gıda",
    "subCategory": "Tahıl & Un",
    "city": "Çanakkale",
    "ownerCompany": "Akdeniz Gıda ve Soğuk Depo A.Ş.",
    "authority": "Toprak Mahsulleri Ofisi (TMO)",
    "butce": "14.500.000 ₺",
    "sure": "16 gün kaldı",
    "durum": "active",
    "ihaleYonu": "kapali_zarf",
    "tur": "Mal Alımı",
    "usul": "Doğrudan Teklif Alma",
    "teklifSayisi": 12,
    "liderTeklif": "13.900.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99.1,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-908",
    "baslik": "Şehir Hastaneleri 2026 Yılı Tıbbi Sarf, Cerrahi Setler & Sterilizasyon Malzemeleri",
    "aciklama": "Steril ameliyathane örtü setleri, cerrahi eldivenler, kan alma tüpleri ve antiseptik solüsyon alımı için 1 yıllık toplu tedarik ihalesidir.",
    "kategori": "Medikal ve Sağlık Sarf Malzemeleri",
    "mainCategory": "Sağlık & Medikal",
    "subCategory": "Tıbbi Sarf",
    "city": "Balıkesir",
    "ownerCompany": "Balıkesir Sağlık ve Medikal Grubu",
    "authority": "Balıkesir İl Sağlık Müdürlüğü",
    "butce": "6.800.000 ₺",
    "sure": "22 gün kaldı",
    "durum": "active",
    "ihaleYonu": "eksiltme",
    "tur": "Mal Alımı",
    "usul": "Açık Eksiltme",
    "teklifSayisi": 15,
    "liderTeklif": "6.120.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99.4,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-909",
    "baslik": "300.000 Litre Euro Dizel Motorin & Madeni Yağ Filo Tedarik İhalesi",
    "aciklama": "Şirket lojistik filosu ve iş makineleri için istasyondan taşıt tanıma sistemi (TTS) ve şantiye dökme akaryakıt tankı teslimli motorin tedarik ihalesidir.",
    "kategori": "Enerji, Akaryakıt ve GES Tesisatı",
    "mainCategory": "Akaryakıt & Enerji",
    "subCategory": "Euro Dizel",
    "city": "Kocaeli",
    "ownerCompany": "Marmara Altyapı ve İnşaat Grubu",
    "authority": "Kocaeli Dilovası OSB",
    "butce": "12.600.000 ₺",
    "sure": "14 gün kaldı",
    "durum": "active",
    "ihaleYonu": "eksiltme",
    "tur": "Mal Alımı",
    "usul": "Açık Eksiltme",
    "teklifSayisi": 8,
    "liderTeklif": "11.850.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 98.8,
    "olusturma": "01.09.2026",
    "isBaseline": true
  },
  {
    "id": "IHC-2026-910",
    "baslik": "250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı",
    "aciklama": "Yeni açılacak kurumsal genel müdürlük binası için E1 normunda ahşap çalışma istasyonları, fileli ergonomik çalışma koltukları ve kilitli çelik evrak dolapları alımıdır.",
    "kategori": "İnşaat - Altyapı - Üstyapı - Yapım İşi",
    "mainCategory": "Ofis & Mobilya",
    "subCategory": "Ofis Donanımı",
    "city": "Ankara",
    "ownerCompany": "Avrasya Bilişim ve Yazılım A.Ş.",
    "authority": "Ankara OSTİM OSB",
    "butce": "2.100.000 ₺",
    "sure": "11 gün kaldı",
    "durum": "active",
    "ihaleYonu": "kapali_zarf",
    "tur": "Mal Alımı",
    "usul": "Doğrudan Teklif Alma",
    "teklifSayisi": 9,
    "liderTeklif": "1.890.000 ₺",
    "adminApproved": true,
    "aiApproved": true,
    "aiScore": 99.1,
    "olusturma": "01.09.2026",
    "isBaseline": true
  }
] as any[],
    receivedBids: [] as any[],
    submittedBids: [] as any[],
    disputes: [] as any[],
    companyReviews: [] as any[],
    sectorAlerts: [] as any[],
    escrowOrders: [] as any[]
  },
  registeredCompanies: [] as any[],
  contact: {
    address: 'İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye',
    email: 'ihalecib@gmail.com',
    workHoursWeekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
    workHoursSaturday: 'Cumartesi: 10:00 - 14:00'
  },
  payments: [] as any[],
  supportSettings: {
    whatsappEnabled: true,
    whatsappNumber: '908508408695',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale süreçleri ve 1 ay ücretsiz deneme paketi hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme veya üyelik süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın.'
  },
  crmSettings: {
    leads: [] as any[]
  },
  emailSettings: {
    senderName: 'İhaleciBurada B2B Operasyon',
    senderEmail: 'ihalecib@gmail.com',
    replyToEmail: 'ihalecib@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'ihalecib@gmail.com',
    smtpPassword: '••••••••',
    smtpEncryption: 'TLS',
    autoNotifications: {
      onRegister: true,
      onNewTender: true,
      onNewBid: true,
      onAuction: true,
      onEscrow: true
    },
    subscribers: [] as any[],
    templates: [
    {
        "id": "TPL_WELCOME",
        "name": "Kurumsal Hoş Geldiniz & KYC Onayı",
        "subject": "İhaleciBurada.com Kurumsal Üyeliğiniz ve 1 Ay Ücretsiz Deneme Paketiniz Onaylandı!",
        "content": "Sayın [Firma Adı] Yetkilisi,\n\nİhaleciBurada.com B2B satın alma ve ihale platformuna hoş geldiniz!\n\nKurumsal şirket kaydınız onaylanmış ve hesabınıza 1 Ay %100 Ücretsiz Lansman Paketi ile Onaylı Mavi Rozet tanımlanmıştır.\n\nArtık Türkiye genelindeki tüm satın alma ihalelerine teklif sunabilir veya kendi şartnamenizle canlı eksiltme ihaleleri açabilirsiniz.\n\nKurumsal Yönetim Paneli: [Panel Linki]\n\nSaygılarımızla,\nİhaleciBurada Platform A.Ş.\nİletişim: 0850 840 86 95 | ihalecib@gmail.com"
    },
    {
        "id": "TPL_NEW_TENDER",
        "name": "Yeni İhale Yayını & Şartname Teklif Çağrısı",
        "subject": "Yeni İhale İlanı: [İhale Başlığı] için Teklif Süreci Başladı",
        "content": "Sayın Tedarikçimiz,\n\nFaaliyet gösterdiğiniz sektörde yeni bir satın alma ihalesi onaylanarak yayına alınmıştır.\n\n• İhale Başlığı: [İhale Başlığı]\n• Başlangıç Bütçesi: [Lider Fiyat]\n• Kalan Süre: [Kalan Süre]\n\nTeknik şartnameyi indirmek ve doğrudan fiyat teklifinizi iletmek için bağlantıyı ziyaret ediniz:\n[Panel Linki]\n\nİhaleciBurada.com Satın Alma Masası"
    },
    {
        "id": "TPL_NEW_BID",
        "name": "İhaleye Yeni Teklif Geldi Bildirimi",
        "subject": "İhalenize Yeni Teklif Geldi: [İhale Başlığı]",
        "content": "Sayın Alıcı Yetkilisi,\n\nYayınlamış olduğunuz \"[İhale Başlığı]\" başlıklı satın alma ilanı için onaylı bir tedarikçi firma tarafından yeni bir fiyat teklifi sunuldu.\n\n• Sunulan Teklif: [Lider Fiyat] TL\n• Teklif Veren: [Firma Adı]\n\nTeklifi incelemek ve karşı pazarlık teklifinizi iletmek için kurumsal panelinize giriş yapınız:\n[Panel Linki]\n\nİhaleciBurada B2B Operasyon"
    },
    {
        "id": "TPL_AUCTION_START",
        "name": "Canlı Tersine Eksiltme Başladı Uyarısı",
        "subject": "Canlı İhale Başladı: [İhale Başlığı] İhalesinde Fiyatlar Eksiliyor!",
        "content": "Sayın Yetkili,\n\nTakip ettiğiniz \"[İhale Başlığı]\" ihalesi için canlı tersine eksiltme odası açılmıştır.\n\nTedarikçiler anlık olarak en iyi fiyatı sunmak için yarışmaktadır. Canlı odaya katılarak teklifinizi güncelleyebilir veya süreci izleyebilirsiniz:\n[Panel Linki]\n\nİhaleciBurada Canlı İhale Odası"
    },
    {
        "id": "TPL_ESCROW_RELEASE",
        "name": "Escrow Güvenli Tahsilat & Mal Kabul Makbuzu",
        "subject": "Güvenli Havuz Ödemesi Serbest Bırakıldı: [İhale Başlığı]",
        "content": "Sayın [Firma Adı],\n\n[İhale Başlığı] kapsamındaki siparişin mal kabulü ve irsaliye denetimi alıcı firma tarafından başarıyla onaylanmıştır.\n\nGüvenli havuzda (Escrow) bloke edilen hakediş tutarınız banka hesabınıza transfer edilmek üzere serbest bırakılmıştır.\n\nDetaylı hakediş ve fatura dökümünüzü görüntülemek için:\n[Panel Linki]\n\nİhaleciBurada Güvenli Ticaret Masası"
    }
]
  },
  kycVerifications: [] as any[],
  liveAuctionRooms: [] as any[],
  escrowOrders: [] as any[],
  commissionSettings: {
    defaultRate: 3.0,
    minTransactionFee: 50,
    vatRate: 20,
    sectorRates: [
      {
            "id": "sec-1",
            "name": "İnşaat, Altyapı & Yapım İşi",
            "rate": 2.5,
            "icon": "🏗️",
            "description": "Kaba inşaat, hazır beton, çimento, hafriyat ve şantiye yapım ihaleleri"
      },
      {
            "id": "sec-2",
            "name": "Sağlık, İlaç & Kozmetik",
            "rate": 3,
            "icon": "💊",
            "description": "İlaç, serum, sarf malzeme, aşı ve kozmetik tedariği"
      },
      {
            "id": "sec-3",
            "name": "Gıda, Tarım Ürünleri & İçecek",
            "rate": 2,
            "icon": "🌾",
            "description": "Toptan un, bakliyat, yağ, et, süt, yaş sebze/meyve ve içecek"
      },
      {
            "id": "sec-4",
            "name": "Tıbbi Cihaz, Laboratuvar & Hastane",
            "rate": 3,
            "icon": "🩺",
            "description": "Görüntüleme sistemleri, ameliyathane donanımı ve laboratuvar kitleri"
      },
      {
            "id": "sec-5",
            "name": "Kanalizasyon, Boru, Su & Tesisat",
            "rate": 2.5,
            "icon": "🚰",
            "description": "Altyapı boruları, vana, pompa, su arıtma ve sıhhi tesisat"
      },
      {
            "id": "sec-6",
            "name": "Enerji, Aydınlatma & Elektrik",
            "rate": 2.5,
            "icon": "⚡",
            "description": "Trafo, jeneratör, kablo, aydınlatma armatürleri ve güneş panelleri"
      },
      {
            "id": "sec-7",
            "name": "Akaryakıt, Gazyağı & Madeni Yağ",
            "rate": 1.5,
            "icon": "⛽",
            "description": "Toptan motorin, benzin, sanayi yakıtı ve madeni yağlar"
      },
      {
            "id": "sec-8",
            "name": "Endüstriyel Makine & Motor",
            "rate": 3.5,
            "icon": "⚙️",
            "description": "CNC tezgahları, sanayi presleri, elektrik motorları ve konveyörler"
      },
      {
            "id": "sec-9",
            "name": "Yazılım, Bilişim & IT Hizmetleri",
            "rate": 5,
            "icon": "💻",
            "description": "ERP, CRM, özel yazılım, sunucu, bulut lisansları ve IT altyapısı"
      },
      {
            "id": "sec-10",
            "name": "Nakliye, Taşımacılık & Lojistik",
            "rate": 4,
            "icon": "🚚",
            "description": "Komple tır, parsiyel kargo, antrepo, filo kiralama ve personel servisi"
      },
      {
            "id": "sec-11",
            "name": "Mobilya, Beyaz Eşya & Ofis",
            "rate": 3.5,
            "icon": "🪑",
            "description": "Büro mobilyası, dayanıklı tüketim malları ve mutfak ekipmanları"
      },
      {
            "id": "sec-12",
            "name": "Hırdavat, Nalburiye, Metal & Plastik",
            "rate": 3,
            "icon": "🔩",
            "description": "Bağlantı elemanları, el aletleri, profil sac ve endüstriyel plastik"
      },
      {
            "id": "sec-13",
            "name": "Yangın Algılama, Söndürme & Güvenlik",
            "rate": 3,
            "icon": "🧯",
            "description": "Yangın dolapları, sprinkler, duman dedektörleri ve alarm panoları"
      },
      {
            "id": "sec-14",
            "name": "Kimyasal Maddeler, Dezenfektan & Gübre",
            "rate": 2.5,
            "icon": "🧪",
            "description": "Sanayi kimyasalları, tarımsal gübre, ziraat ilaçları ve dezenfektan"
      },
      {
            "id": "sec-15",
            "name": "Matbaa, Toner, Ambalaj & Kırtasiye",
            "rate": 3,
            "icon": "📦",
            "description": "Oluklu mukavva koli, ambalaj streci, fotokopi kağıdı ve toner"
      },
      {
            "id": "sec-16",
            "name": "Kent Mobilyaları, Prefabrik & Çelik",
            "rate": 3,
            "icon": "🏙️",
            "description": "Park ekipmanları, konteyner, prefabrik binalar ve çelik konstrüksiyon"
      },
      {
            "id": "sec-17",
            "name": "Mühendislik, Mimarlık & Müşavirlik",
            "rate": 4,
            "icon": "📐",
            "description": "Statik proje, zemin etüdü, harita mühendisliği ve müşavirlik"
      },
      {
            "id": "sec-18",
            "name": "Madencilik, Doğal Kaynak & Sondaj",
            "rate": 2.5,
            "icon": "⛏️",
            "description": "Mermer, kireçtaşı, agrega, maden cevheri ve sondaj ekipmanları"
      },
      {
            "id": "sec-19",
            "name": "Asansör, Yürüyen Merdiven & Otomasyon",
            "rate": 3.5,
            "icon": "🛗",
            "description": "Yolcu/yük asansörleri, yürüyen bantlar ve bina otomasyonu"
      },
      {
            "id": "sec-20",
            "name": "Klima, Havalandırma & Soğutma",
            "rate": 3,
            "icon": "❄️",
            "description": "VRF sistemleri, soğuk hava depoları, kazanlar ve havalandırma kanalları"
      },
      {
            "id": "sec-21",
            "name": "Savunma Sanayii, Denizcilik & Havacılık",
            "rate": 3,
            "icon": "🛡️",
            "description": "Taktik ekipman, bot donanımı, aviyonik aksam ve kompozit malzemeler"
      },
      {
            "id": "sec-22",
            "name": "Taşıt, İş Makinesi & Yedek Parça",
            "rate": 2.5,
            "icon": "🚜",
            "description": "Ekskavatör, loder, forklift, kamyon ve orijinal yedek parçalar"
      },
      {
            "id": "sec-23",
            "name": "Turizm, Konaklama & Organizasyon",
            "rate": 4,
            "icon": "🎪",
            "description": "Kongre, fuar organizasyonu, otel konaklama ve catering"
      },
      {
            "id": "sec-24",
            "name": "Reklam, Tabela & Tanıtım Materyalleri",
            "rate": 4.5,
            "icon": "📢",
            "description": "Işıklı tabela, led ekran, totem, açık hava reklamcılığı ve promosyon"
      },
      {
            "id": "sec-25",
            "name": "Ormancılık, Fidan, Bitki & Peyzaj",
            "rate": 3,
            "icon": "🌲",
            "description": "Fidan üretimi, çimleme, ağaçlandırma ve çevre düzenleme"
      },
      {
            "id": "sec-26",
            "name": "Hayvancılık, Veterinerlik & Yem",
            "rate": 2,
            "icon": "🐄",
            "description": "Büyükbaş/küçükbaş hayvan, karma yem, premiks ve veteriner ilaçları"
      },
      {
            "id": "sec-27",
            "name": "Sanat Eserleri, Enstrüman & Heykel",
            "rate": 5,
            "icon": "🎨",
            "description": "Sanatsal anıt, kent heykelleri, enstrüman ve müze sergileme"
      },
      {
            "id": "sec-28",
            "name": "Odun, Kömür & Katı Yakıtlar",
            "rate": 2,
            "icon": "🪵",
            "description": "Toptan linyit kömürü, odun, pelet ve briket yakıt"
      },
      {
            "id": "sec-29",
            "name": "Hazır Yemek, Tabldot & Lokantacılık",
            "rate": 2.5,
            "icon": "🍽️",
            "description": "Toplu yemek üretimi, şantiye/hastane yemekhanesi ve kumanya"
      },
      {
            "id": "sec-30",
            "name": "Elektronik, Bilgisayar & Ölçü Aletleri",
            "rate": 3.5,
            "icon": "🖥️",
            "description": "PC, tablet, endüstriyel switch, multimetre ve kalibrasyon aletleri"
      },
      {
            "id": "sec-31",
            "name": "Kamera, CCTV & Haberleşme",
            "rate": 3.5,
            "icon": "📹",
            "description": "IP kamera sistemleri, NVR, telsiz, fiber optik ve telsiz kuleleri"
      },
      {
            "id": "sec-32",
            "name": "Temizlik, İlaçlama & Atık Yönetimi",
            "rate": 3,
            "icon": "🧹",
            "description": "Tesis temizliği, vektör ilaçlama, geri dönüşüm ve tıbbi atık bertarafı"
      },
      {
            "id": "sec-33",
            "name": "Tekstil, İş Elbiseleri & Giyim",
            "rate": 3,
            "icon": "👕",
            "description": "Reflektörlü iş kıyafetleri, üniforma, ayakkabı ve kurumsal tekstil"
      },
      {
            "id": "sec-34",
            "name": "İş Sağlığı & Güvenliği (İSG)",
            "rate": 3.5,
            "icon": "⛑️",
            "description": "Baret, emniyet kemeri, gaz maskesi, iş gözlüğü ve İSG donanımları"
      },
      {
            "id": "sec-35",
            "name": "Özel Güvenlik & Koruma Hizmetleri",
            "rate": 3.5,
            "icon": "👮",
            "description": "Fiziki güvenlik, koruma personeli, x-ray ve güvenlik bariyerleri"
      },
      {
            "id": "sec-36",
            "name": "Eğitim, Tercümanlık & Danışmanlık",
            "rate": 4.5,
            "icon": "📚",
            "description": "Kurumsal eğitimler, yeminli tercüme, anket ve pazar araştırması"
      },
      {
            "id": "sec-37",
            "name": "İşletmecilik & Tesis Yönetimi",
            "rate": 3.5,
            "icon": "🤝",
            "description": "Bina yönetimi, resepsiyon, kurye ve veri giriş personeli"
      },
      {
            "id": "sec-38",
            "name": "Sigortacılık, Finans & Hukuk",
            "rate": 4,
            "icon": "⚖️",
            "description": "Kurumsal kasko, all-risk sigorta, bağımsız denetim ve danışmanlık"
      },
      {
            "id": "sec-39",
            "name": "Araç Satışı & Hurda İhaleleri",
            "rate": 2,
            "icon": "🚗",
            "description": "Filo araç satışları, demir/bakır hurda ve atık malzeme ihaleleri"
      },
      {
            "id": "sec-40",
            "name": "Gayrimenkul, Arsa & Kiralama",
            "rate": 2,
            "icon": "🏢",
            "description": "Ticari bina, fabrika, arsa satışı, depo ve büfe/kantin kiralama"
      }
],
    planDiscountRates: [
      { planName: 'Ücretsiz / Standart Üyelik', commissionRate: 3.0, badge: 'Standart' },
      { planName: '1 Ay Lansman Deneme', commissionRate: 0.0, badge: '%100 Komisyonsuz' },
      { planName: '3 Aylık Kurumsal', commissionRate: 2.5, badge: '%0.5 İndirimli' },
      { planName: '6 Aylık Kurumsal Pro', commissionRate: 2.0, badge: '%1.0 İndirimli' },
      { planName: '12 Aylık Enterprise Plus', commissionRate: 1.0, badge: '%2.0 İndirimli' }
    ]
  },
  categories: [
    { id: 'kat-1', name: 'İnşaat, Yapı & Şantiye', icon: 'Building2', targetSavings: '%16.5', activeTendersCount: 0, description: 'Demir, çimento, hazır beton, yalıtım ve kaba inşaat malzemeleri.' },
    { id: 'kat-2', name: 'Makine, Yedek Parça & Metal', icon: 'Wrench', targetSavings: '%14.2', activeTendersCount: 0, description: 'CNC fason talaşlı imalat, torna, sac işleme ve hidrolik aksam.' },
    { id: 'kat-3', name: 'Akaryakıt, Enerji & Madeni Yağ', icon: 'Fuel', targetSavings: '%11.8', activeTendersCount: 0, description: 'Toptan motorin, benzin, sanayi elektriği ve endüstriyel madeni yağ.' },
    { id: 'kat-4', name: 'Ambalaj, Koli & Plastik', icon: 'Package', targetSavings: '%18.0', activeTendersCount: 0, description: 'Oluklu mukavva koli, streç film, palet ve esnek ambalaj ürünleri.' },
    { id: 'kat-5', name: 'Lojistik, Nakliye & Depolama', icon: 'Truck', targetSavings: '%15.4', activeTendersCount: 0, description: 'Yurt içi komple tır, parsiyel sevkiyat, antrepo ve soğuk hava depolama.' },
    { id: 'kat-6', name: 'Kırtasiye, Ofis & Teknoloji', icon: 'Laptop', targetSavings: '%21.0', activeTendersCount: 0, description: 'Fotokopi kağıdı, toner, bilgisayar donanımı ve ofis mobilyası.' }
  ],
  promoCodes: [] as any[],
  auditLogs: [] as any[],
  siteSettings: {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı altyapı güçlendirme çalışması yapılmaktadır.',
    metaTitle: 'İhaleciBurada.com | B2B İhale ve Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, onaylı tedarikçilerden rekabetçi teklifler toplayın.',
    announcementTicker: '⚡ Tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi!',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 840 86 95',
    supportEmail: 'ihalecib@gmail.com',
    primaryCurrency: 'TRY (₺)',
    allowGuestBrowsing: true,
    enableEmailAlerts: true
  }
}

const cmsDataRef = ref({ ...DEFAULT_CMS_DATA })
let isInitialized = false

function stripHeavyDataUrls(obj: any, depth = 0): any {
  if (!obj || typeof obj !== 'object' || depth > 8) return obj
  try {
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (typeof val === 'string' && (val.startsWith('data:') || val.length > 25000)) {
        if (key.includes('img') || key.includes('image') || key === 'url') {
          obj[key] = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'
        } else {
          obj[key] = ''
        }
      } else if (typeof val === 'object') {
        stripHeavyDataUrls(val, depth + 1)
      }
    }
  } catch (e) {}
  return obj
}

function sanitizeForStorage(data: any): any {
  try {
    const copy = JSON.parse(JSON.stringify(data))
    stripHeavyDataUrls(copy)
    return copy
  } catch (e) {
    return data
  }
}

function safeLocalStorageSet(key: string, value: any) {
  if (typeof window !== 'undefined') {
    try {
      const jsonStr = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(key, jsonStr)
    } catch (err) {
      console.warn(`localStorage quota reached on key "${key}", cleaning...`, err)
      try {
        localStorage.removeItem('tenderDraft')
        localStorage.removeItem('userNotifications')
        const sanitized = sanitizeForStorage(value)
        localStorage.setItem(key, JSON.stringify(sanitized))
      } catch (e2) {
        console.warn('Could not save to localStorage (relying on memory state):', e2)
      }
    }
  }
}

export function useCmsData() {
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true
// Strict clean slate: Wipe any old test tenders like IHC-2026-178 from localStorage
    try {
      const rawMyTenders = localStorage.getItem('myTenders')
      if (rawMyTenders && (rawMyTenders.includes('IHC-2026-178') || rawMyTenders.includes('aesredtruıo85urıy'))) {
        localStorage.removeItem('myTenders')
        localStorage.removeItem('myBids')
        localStorage.removeItem('mySubmittedBids')
        localStorage.removeItem('b2b_messages_chats')
      }
      const rawCms = localStorage.getItem('cmsData')
      if (rawCms && (rawCms.includes('IHC-2026-178') || rawCms.includes('aesredtruıo85urıy'))) {
        localStorage.removeItem('cmsData')
      }
    } catch (e) {}

    // Read previous data from localStorage
    const saved = localStorage.getItem('cmsData')
    const savedVer = localStorage.getItem('cmsData_version')

    if (savedVer !== SCHEMA_VERSION) {
      // Force clean slate for production
      localStorage.removeItem('cmsData')
      localStorage.removeItem('myTenders')
      localStorage.removeItem('mySubmittedBids')
      localStorage.removeItem('allRegisteredUsers')
      localStorage.removeItem('user_accounts_registry')
      localStorage.removeItem('companyVerificationDocs')
      localStorage.removeItem('b2b_messages_chats')
      localStorage.removeItem('tenderDraft')
      localStorage.removeItem('userNotifications')
      localStorage.setItem('cmsData_version', SCHEMA_VERSION)
      cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
      safeLocalStorageSet('cmsData', cmsDataRef.value)
    } else if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          cmsDataRef.value = {
            ...DEFAULT_CMS_DATA,
            ...parsed,
            commissionSettings: parsed.commissionSettings || DEFAULT_CMS_DATA.commissionSettings
          }
        }
      } catch (e) {
        console.warn('Failed to parse cmsData from localStorage, using clean defaults', e)
        cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
      }
    }
  }

  function saveCmsData(newData: any) {
    cmsDataRef.value = JSON.parse(JSON.stringify(newData))
    safeLocalStorageSet('cmsData', cmsDataRef.value)
  }

  function resetCmsData() {
    cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
    safeLocalStorageSet('cmsData', cmsDataRef.value)
  }

  return {
    cmsData: cmsDataRef,
    saveCmsData,
    resetCmsData
  }
}
