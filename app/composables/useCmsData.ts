import { ref } from 'vue'

const SCHEMA_VERSION = 'v2026_09_10_production_v3'

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
    title: 'Boğaziçi Konut Projesi 12.000 m³ C35/45 Hazır Beton Alımı',
    remainingTime: '04:18',
    bestBid: 17200000,
    openingPrice: 18500000,
    savingsText: 'TASARRUF %7.0',
    competitors: [
      { name: 'Marmara Hazır Beton A.Ş.', price: '17.200.000 ₺', isLeading: true },
      { name: 'Avrasya Çimento & Yapı Ltd.', price: '17.450.000 ₺', isLeading: false },
      { name: 'Trakya Agrega Sanayi', price: '17.800.000 ₺', isLeading: false }
    ]
  },
  pricing: {
    vatNotice: 'Fiyatlara %20 KDV dahildir.',
    disclaimer: 'Bu hizmet Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi) tarafından yürütülmektedir.',
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
    { value: '48.5M ₺+', label: 'Toplam Ticaret Hacmi' },
    { value: '180+', label: 'Doğrulanmış B2B Üretici' },
    { value: '%16.4', label: 'Ortalama Tedarik Tasarrufu' },
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
        "id": "IHL-2026-001",
        "baslik": "Konut & Yaşam Projesi 12.000 m³ C35/45 Hazır Beton & Nervürlü Demir Alımı",
        "kategori": "İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri",
        "altKategori": "Bina Yapımı & Taahhüt",
        "tur": "Mal Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "İstanbul",
        "butce": "18.500.000 ₺",
        "liderFiyat": "17.200.000 ₺",
        "teklifSayisi": 6,
        "sure": "6 gün kaldı",
        "yayinTarihi": "08.09.2026",
        "ownerCompany": "Boğaziçi Yapı Yatırımları A.Ş.",
        "aciklama": "İstanbul Anadolu yakası 240 konutluk şantiyemiz için TS EN 206 standartlarında 12.000 m³ C35/45 hazır beton ve 850 ton nervürlü inşaat demiri tedariği yapılacaktır.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "TS EN 206 C35/45 hazır beton, CEM I 42.5R çimento, slump S4 kıvamı. Nervürlü demir B420C standardında ve CE sertifikalı olmalıdır.",
            "delivery": "Haftalık beton döküm takvimine göre transmikser ve pompa ile şantiyeye teslim.",
            "payment": "Escrow güvenli havuz bloke, beton santrali irsaliyesi ve numune 28 günlük kırım test onayından sonra hakediş serbest bırakılır."
        },
        "materials": [
            {
                "name": "C35/45 Hazır Beton (Pompalı)",
                "qty": "12.000",
                "unit": "m³"
            },
            {
                "name": "Nervürlü İnşaat Demiri (Ø12-Ø28)",
                "qty": "850",
                "unit": "Ton"
            }
        ]
    },
    {
        "id": "IHL-2026-002",
        "baslik": "Özel Hastaneler Grubu 50.000 Kutu Cerrahi Steril Eldiven & Medikal Sarf Alımı",
        "kategori": "Sağlık - İlaç - Kozmetik - Medikal İhaleleri",
        "altKategori": "Tıbbi Cihaz & Sarf Malzemeleri",
        "tur": "Mal Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Ankara",
        "butce": "3.200.000 ₺",
        "liderFiyat": "2.850.000 ₺",
        "teklifSayisi": 8,
        "sure": "4 gün kaldı",
        "yayinTarihi": "07.09.2026",
        "ownerCompany": "Medipol Sağlık Hizmetleri Grubu",
        "aciklama": "Ankara ve çevre illerdeki 4 hastanemiz için 1 yıl vadeli, CE ve ISO 13485 sertifikalı pudrasız nitril cerrahi muayene eldiveni ve cerrahi set tedariği.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Pudrasız medikal nitril eldiven, EN 455 ve EN 374 standartlarına uygun, latex içermeyen, mikrotokluk testi yapılmış.",
            "delivery": "Aylık periyotlarla 4 hastane ana deposuna teslim.",
            "payment": "Mal kabul ve sterilite test onayının ardından 30 gün vadeli banka transferi."
        },
        "materials": [
            {
                "name": "Pudrasız Mavi Nitril Muayene Eldiveni (S/M/L)",
                "qty": "40.000",
                "unit": "Kutu"
            },
            {
                "name": "Cerrahi Steril Pudrasız Ameliyat Eldiveni (7.0 - 8.0)",
                "qty": "10.000",
                "unit": "Kutu"
            }
        ]
    },
    {
        "id": "IHL-2026-003",
        "baslik": "2026-2027 Sezonu Umre ve Kültür Turları Otel & Uçak Kontenjan Paketi",
        "kategori": "Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri",
        "altKategori": "Hac ve Umre Organizasyon Paketleri",
        "tur": "Hizmet Alımı",
        "method": "Sabit Fiyatlı Paket & Kontenjan",
        "city": "Bursa",
        "butce": "6.800.000 ₺",
        "liderFiyat": "6.300.000 ₺",
        "teklifSayisi": 5,
        "sure": "12 gün kaldı",
        "yayinTarihi": "09.09.2026",
        "ownerCompany": "Semerkand Turizm & Organizasyon",
        "aciklama": "Bursa çıkışlı 450 kişilik grup için Mekke ve Medine 4 yıldızlı otellerde yarım pansiyon konaklama, vize, transfer ve doğrudan uçuş kontenjanı alımı.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": true,
        "specs": {
            "technical": "Harem-i Şerif mesafesi azami 800 metre veya 24 saat ring servisli 4 yıldızlı oteller. THY veya Saudia tarifeli uçuş kontenjanı.",
            "delivery": "Kasım 2026 - Ocak 2027 tarihleri arasında 3 kafile halinde ifa edilecektir.",
            "payment": "Vize ve PNR rezervasyon onay belgeleri ile %40 peşin, kafile dönüşünde bakiye."
        },
        "materials": [
            {
                "name": "Mekke 4 Yıldızlı Otel Konaklama (Yarım Pansiyon)",
                "qty": "450",
                "unit": "Kişi"
            },
            {
                "name": "Medine 4 Yıldızlı Otel Konaklama (Yarım Pansiyon)",
                "qty": "450",
                "unit": "Kişi"
            },
            {
                "name": "Gidiş-Dönüş Tarifeli Uçak Bileti Kontenjanı",
                "qty": "450",
                "unit": "Bilet"
            }
        ]
    },
    {
        "id": "IHL-2026-004",
        "baslik": "Uluslararası B2B Zirvesi ve Fuarı İçin Ses, Işık, LED Ekran & Sahne Kurulumu",
        "kategori": "Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri",
        "altKategori": "Ses, Işık, Truss & Sahne Sistemleri Kiralama",
        "tur": "Hizmet Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "İzmir",
        "butce": "1.450.000 ₺",
        "liderFiyat": "1.280.000 ₺",
        "teklifSayisi": 4,
        "sure": "8 gün kaldı",
        "yayinTarihi": "06.09.2026",
        "ownerCompany": "Ege Kongre & Fuar Yönetimi A.Ş.",
        "aciklama": "Fuar İzmir ana holünde 3 gün sürecek uluslararası kongre için 120 m² P2.6 LED ekran, line-array ses sistemi, akıllı robot ışıklar ve truss karkas kurulumu.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Black face P2.6 yüksek çözünürlüklü LED ekran, L-Acoustics veya d&b audiotechnik ses sistemi, grandMA2 ışık masası ve profesyonel teknik reji ekibi.",
            "delivery": "Etkinlikten 24 saat önce genel prova hazır vaziyette teslim.",
            "payment": "Etkinlik bitimi ve kabul tutanağı akabinde 15 gün içinde."
        },
        "materials": [
            {
                "name": "P2.6 İç Mekan LED Ekran Modülü",
                "qty": "120",
                "unit": "m²"
            },
            {
                "name": "Line-Array Ses ve Kablosuz Yaka Mikrofonu Sistemi",
                "qty": "1",
                "unit": "Set"
            },
            {
                "name": "Alüminyum Truss Taşıyıcı Konstrüksiyon & Motor",
                "qty": "80",
                "unit": "Metre"
            }
        ]
    },
    {
        "id": "IHL-2026-005",
        "baslik": "Kurumsal ERP ve Bulut Veri Tabanı Altyapısı Lisanslama & Entegrasyon İhalesi",
        "kategori": "Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri",
        "altKategori": "ERP & Kurumsal Yazılımlar",
        "tur": "Hizmet Alımı",
        "method": "Pazarlık Usulü",
        "city": "Kocaeli",
        "butce": "4.500.000 ₺",
        "liderFiyat": "4.100.000 ₺",
        "teklifSayisi": 7,
        "sure": "9 gün kaldı",
        "yayinTarihi": "08.09.2026",
        "ownerCompany": "Kocaeli Sanayi Grubu A.Ş.",
        "aciklama": "14 fabrikamızın üretim, lojistik ve finans modüllerinin tek çatı altında toplanacağı ERP lisanslama, veri tabanı geçişi ve 2 yıllık SLA destek hizmeti.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Mikroservis mimarisinde, REST API entegrasyonlu, PostgreSQL/Oracle veri tabanı uyumlu, ISO 27001 sertifikalı bulut barındırma.",
            "delivery": "6 aylık aşamalı geçiş (Staging + Production canlıya alma).",
            "payment": "Faz bazlı hak ediş (%25 başlangıç, %50 UAT testi, %25 canlıya geçiş)."
        },
        "materials": [
            {
                "name": "ERP Çekirdek Kullanıcı Kurumsal Lisansı",
                "qty": "250",
                "unit": "Kullanıcı"
            },
            {
                "name": "Veri Tabanı Göçü ve Özel Entegrasyon Hizmeti",
                "qty": "1",
                "unit": "Proje"
            },
            {
                "name": "7/24 SLA Teknik Destek ve Bakım (24 Ay)",
                "qty": "24",
                "unit": "Ay"
            }
        ]
    },
    {
        "id": "IHL-2026-006",
        "baslik": "Endüstriyel Yemek Fabrikası İçin 25 Ton Bakliyat, Pirinç & Ayçiçek Yağı Alımı",
        "kategori": "Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri",
        "altKategori": "Kuru Gıda, Bakliyat & Hububat",
        "tur": "Mal Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Gaziantep",
        "butce": "2.100.000 ₺",
        "liderFiyat": "1.920.000 ₺",
        "teklifSayisi": 9,
        "sure": "5 gün kaldı",
        "yayinTarihi": "09.09.2026",
        "ownerCompany": "Lezzet Catering & Hazır Yemek Ltd.",
        "aciklama": "Günlük 15.000 tabldot kapasiteli yemek tesisimiz için 1. sınıf baldo pirinç, kırmızı mercimek, kuru fasulye ve 18 litrelik teneke rafine ayçiçek yağı alımı.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Türk Gıda Kodeksi uygunluk raporlu, rutubet azami %14, yabancı madde sıfır, 2026 mahsulü.",
            "delivery": "Her ayın 1. ve 15. günlerinde iki eşit parti halinde fabrika deposuna teslim.",
            "payment": "Laboratuvar analiz onayını takiben 21 gün içinde."
        },
        "materials": [
            {
                "name": "Yerli Baldo Pirinç (50 kg çuval)",
                "qty": "10.000",
                "unit": "kg"
            },
            {
                "name": "Kırmızı Futbol Mercimek (50 kg çuval)",
                "qty": "8.000",
                "unit": "kg"
            },
            {
                "name": "Dermason Kuru Fasulye (50 kg çuval)",
                "qty": "7.000",
                "unit": "kg"
            },
            {
                "name": "Rafine Ayçiçek Yağı (18 Litre Teneke)",
                "qty": "500",
                "unit": "Teneke"
            }
        ]
    },
    {
        "id": "IHL-2026-007",
        "baslik": "Otomotiv Yan Sanayi İçin 3 Eksenli CNC Dik İşleme Merkezi ve Konveyör Hattı",
        "kategori": "Endüstriyel Makine - Motor - Konveyör İhaleleri",
        "altKategori": "CNC & Takım Tezgahları",
        "tur": "Mal Alımı",
        "method": "Kapalı Zarf Usulü",
        "city": "Konya",
        "butce": "8.400.000 ₺",
        "liderFiyat": "7.950.000 ₺",
        "teklifSayisi": 4,
        "sure": "14 gün kaldı",
        "yayinTarihi": "05.09.2026",
        "ownerCompany": "Konya Hassas Döküm & Talaşlı İmalat",
        "aciklama": "BT40 milli, 12.000 RPM fener mili devirli, 30 takımlı magazinli 2 adet CNC dik işleme merkezi ve talaş tahliye konveyör sistemi temini.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Fanuc veya Siemens kontrol üniteli, X ekseni min 1000mm, Y ekseni min 600mm, rijit gövde, optik cetvelli.",
            "delivery": "Konya OSB fabrikamızda montaj, kalibrasyon ve test parça kesimi dahil.",
            "payment": "Akreditif veya Escrow havuzunda bloke, kabul tutanağı ile tahsilat."
        },
        "materials": [
            {
                "name": "3 Eksenli CNC Dik İşleme Merkezi (1000x600)",
                "qty": "2",
                "unit": "Adet"
            },
            {
                "name": "Menteşeli Paletli Talaş Konveyörü ve Araba",
                "qty": "2",
                "unit": "Set"
            }
        ]
    },
    {
        "id": "IHL-2026-008",
        "baslik": "Marmara - Ege Güzergahı Yıllık 1.200 Seferlik Konteyner & Parsiyel Taşımacılık",
        "kategori": "Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri",
        "altKategori": "Şehirlerarası Karayolu Nakliye",
        "tur": "Hizmet Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Çanakkale",
        "butce": "7.200.000 ₺",
        "liderFiyat": "6.750.000 ₺",
        "teklifSayisi": 6,
        "sure": "11 gün kaldı",
        "yayinTarihi": "08.09.2026",
        "ownerCompany": "Dardanel Lojistik & Depolama A.Ş.",
        "aciklama": "Çanakkale, Balıkesir, İzmir ve İstanbul depoları arasında 1 yıl boyunca haftalık planlı konteyner, tenteli tır ve soğuk zincir seferleri.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "K1 yetki belgesi zorunlu, araçlar Euro 6 motor, araç takip ve ısı kaydedici datalogger donanımlı olmalıdır.",
            "delivery": "Yıllık sözleşme kapsamında günlük sevk emirlerine göre 24 saat içinde yükleme.",
            "payment": "Her ay sonu fatura ve irsaliye mutabakatı ile 30 gün vadeli."
        },
        "materials": [
            {
                "name": "Tenteli Tır Seferi (Çanakkale - İstanbul)",
                "qty": "600",
                "unit": "Sefer"
            },
            {
                "name": "Frigorifik Soğuk Hava Seferi (Çanakkale - İzmir)",
                "qty": "600",
                "unit": "Sefer"
            }
        ]
    },
    {
        "id": "IHL-2026-009",
        "baslik": "Genel Müdürlük Yeni Binası 150 Çalışanlık Modüler Ofis Mobilyası & Ergonomik Koltuk",
        "kategori": "Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri",
        "altKategori": "Ofis & Büro Mobilyaları",
        "tur": "Mal Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Antalya",
        "butce": "2.800.000 ₺",
        "liderFiyat": "2.520.000 ₺",
        "teklifSayisi": 7,
        "sure": "7 gün kaldı",
        "yayinTarihi": "07.09.2026",
        "ownerCompany": "Akdeniz Finans & Danışmanlık A.Ş.",
        "aciklama": "Antalya Konyaaltı yeni plazamıza 150 adet elektrik motorlu yükseklik ayarlı çalışma masası, file sırtlı ergonomik yönetici/çalışma koltuğu ve ses yutucu akustik seperatörler.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "E1 sınıfı melamin kaplı tabla, çift motorlu teleskopik çelik ayak, EN 1335 ergonomi belgeli koltuklar.",
            "delivery": "Katlara dağıtım ve profesyonel montaj yükleniciye aittir.",
            "payment": "Montaj tamamlama ve eksiksiz kabul tutanağını takiben 15 gün."
        },
        "materials": [
            {
                "name": "Elektrikli Yükseklik Ayarlı İkili Çalışma Masası",
                "qty": "75",
                "unit": "Takım"
            },
            {
                "name": "Ergonomik File Sırtlı Çalışma Koltuğu",
                "qty": "150",
                "unit": "Adet"
            },
            {
                "name": "Kumaş Kaplı Akustik Masa Seperatörü",
                "qty": "75",
                "unit": "Adet"
            }
        ]
    },
    {
        "id": "IHL-2026-010",
        "baslik": "Fabrika Çatısı 1.2 MW Güneş Enerjisi Santrali (GES) Panel & İnverter Kurulumu",
        "kategori": "Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri",
        "altKategori": "Güneş Enerjisi (GES) Sistemleri",
        "tur": "Yapım İşi (İnşaat)",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Adana",
        "butce": "22.000.000 ₺",
        "liderFiyat": "20.600.000 ₺",
        "teklifSayisi": 5,
        "sure": "15 gün kaldı",
        "yayinTarihi": "06.09.2026",
        "ownerCompany": "Çukurova Tekstil Sanayi A.Ş.",
        "aciklama": "Adana OSB fabrikamızın çatısına anahtar teslimi 1.2 MWp kurulu gücünde Tier-1 TOPCon güneş panelleri, string inverterler, statik güçlendirme ve TEDAŞ kabulü dahil GES yapım işi.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Minimum 580Wp N-Type TOPCon bifacial güneş paneli (12 yıl ürün, 30 yıl performans garantisi), IP66 inverterler.",
            "delivery": "Sözleşme tarihinden itibaren 90 takvim günü içinde geçici kabul.",
            "payment": "Hakediş sistemi: Malzeme şantiye teslimi %40, montaj bitimi %30, TEDAŞ kabulü %30."
        },
        "materials": [
            {
                "name": "580Wp N-Type TOPCon Güneş Paneli",
                "qty": "2.070",
                "unit": "Adet"
            },
            {
                "name": "100 kW Endüstriyel Dizi İnverter",
                "qty": "12",
                "unit": "Adet"
            },
            {
                "name": "Alüminyum Konstrüksiyon & Güneş Kablosu Seti",
                "qty": "1",
                "unit": "Proje"
            }
        ]
    },
    {
        "id": "IHL-2026-011",
        "baslik": "E-Ticaret Deposu İçin 200.000 Adet Çift Oluklu Kraft Koli & Kargo Ambalajı",
        "kategori": "Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri",
        "altKategori": "Koli, Karton Kutu & Ambalaj",
        "tur": "Mal Alımı",
        "method": "Doğrudan Temin / Fiyat Araştırması",
        "city": "Tekirdağ",
        "butce": "950.000 ₺",
        "liderFiyat": "860.000 ₺",
        "teklifSayisi": 8,
        "sure": "3 gün kaldı",
        "yayinTarihi": "09.09.2026",
        "ownerCompany": "Trakya Hızlı Teslimat & E-Ticaret",
        "aciklama": "Farklı 4 ebatta (Desi 2, 4, 7, 12) çift oluklu dopel kraft karton koli, kendinden yapışkanlı kargo poşeti ve şerit güvenlik bandı alımı.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "Çift oluklu B+C dalga kraft kağıt, patlama mukavemeti min 8 kg/cm², su itici baskısız veya tek renk logolu.",
            "delivery": "Tekirdağ Çorlu lojistik merkezimize paletli ve streçli teslim.",
            "payment": "Depo kabulünden sonra 14 gün içinde."
        },
        "materials": [
            {
                "name": "Dopel Kraft Koli (30x20x15 cm - Desi 3)",
                "qty": "80.000",
                "unit": "Adet"
            },
            {
                "name": "Dopel Kraft Koli (45x35x25 cm - Desi 13)",
                "qty": "60.000",
                "unit": "Adet"
            },
            {
                "name": "Kendinden Yapışkanlı Cepli Kargo Poşeti",
                "qty": "60.000",
                "unit": "Adet"
            }
        ]
    },
    {
        "id": "IHL-2026-012",
        "baslik": "24.000 m² Lojistik Depo & İdari Bina Yıllık Endüstriyel Temizlik & Pest Kontrol",
        "kategori": "Temizlik - İlaçlama - Geri Dönüşüm İhaleleri",
        "altKategori": "Bina, Tesis & Ofis Temizliği",
        "tur": "Hizmet Alımı",
        "method": "Açık Eksiltme (Ters İhale)",
        "city": "Kayseri",
        "butce": "1.650.000 ₺",
        "liderFiyat": "1.480.000 ₺",
        "teklifSayisi": 5,
        "sure": "10 gün kaldı",
        "yayinTarihi": "08.09.2026",
        "ownerCompany": "Anadolu Dağıtım & Antrepo İşletmeleri",
        "aciklama": "Kayseri Serbest Bölge tesislerimizde 12 ay boyunca günlük zemin otomatı temizliği, yüksek irtifa toz alma, atık yönetimi ve aylık periyodik haşere/kemirgen ilaçlaması.",
        "adminApproved": true,
        "durum": "active",
        "isSabitPaket": false,
        "specs": {
            "technical": "İşletmede binicili zemin yıkama makineleri ve profesyonel kimyasallar kullanılacak, personelin tüm İSG ve SGK evrakları eksiksiz olacaktır.",
            "delivery": "12 ay boyunca haftanın 6 günü vardiyalı temizlik hizmeti.",
            "payment": "Aylık hakediş faturası karşılığı 30 gün vadeli."
        },
        "materials": [
            {
                "name": "Yıllık Depo & İdari Bina Temizlik Hizmeti (12 Ay)",
                "qty": "12",
                "unit": "Ay"
            },
            {
                "name": "Periyodik Haşere ve Kemirgen İlaçlama (Pest Kontrol)",
                "qty": "12",
                "unit": "Uygulama"
            }
        ]
    }
] as any[],
    receivedBids: [] as any[],
    submittedBids: [] as any[],
    disputes: [] as any[],
    companyReviews: [] as any[],
    sectorAlerts: [] as any[],
    escrowOrders: [] as any[]
  },
  registeredCompanies: [
    {
        "id": "F-101",
        "companyName": "Boğaziçi Yapı Yatırımları A.Ş.",
        "city": "İstanbul",
        "sector": "İnşaat & Yapı",
        "verified": true,
        "taxNo": "1800291823",
        "rating": 4.9,
        "completedTenders": 24,
        "badge": "Mavi Rozetli Doğrulanmış Firma"
    },
    {
        "id": "F-102",
        "companyName": "Medipol Sağlık Hizmetleri Grubu",
        "city": "Ankara",
        "sector": "Sağlık & Medikal",
        "verified": true,
        "taxNo": "6130982711",
        "rating": 4.8,
        "completedTenders": 18,
        "badge": "Mavi Rozetli Doğrulanmış Firma"
    },
    {
        "id": "F-103",
        "companyName": "Ege Kongre & Fuar Yönetimi A.Ş.",
        "city": "İzmir",
        "sector": "Organizasyon & Fuar",
        "verified": true,
        "taxNo": "3250192834",
        "rating": 4.9,
        "completedTenders": 15,
        "badge": "Mavi Rozetli Doğrulanmış Firma"
    },
    {
        "id": "F-104",
        "companyName": "Çukurova Tekstil Sanayi A.Ş.",
        "city": "Adana",
        "sector": "Tekstil & Sanayi",
        "verified": true,
        "taxNo": "2600182736",
        "rating": 4.7,
        "completedTenders": 31,
        "badge": "Mavi Rozetli Doğrulanmış Firma"
    }
] as any[],
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
    smtpPassword: '191214.Et',
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
        "id": "TPL_PASSWORD_RESET",
        "name": "Şifre Değişikliği / Sıfırlama Bildirimi",
        "subject": "İhaleciBurada.com - Şifreniz Başarıyla Güncellendi",
        "content": "Sayın [Yetkili Adı / Firma Adı],\n\nİhaleciBurada.com kurumsal hesabınızın şifresi başarıyla güncellenmiştir.\n\nİşlem Zamanı: [Tarih/Saat]\n\nBu işlemi siz gerçekleştirmediyseniz lütfen derhal hesabınıza giriş yaparak şifrenizi sıfırlayın veya 0850 840 86 95 numaralı kurumsal destek hattımızla iletişime geçin.\n\nHesap Güvenlik Paneli: [Panel Linki]\n\nSaygılarımızla,\nİhaleciBurada Güvenlik & Operasyon Masası"
    },
    {
        "id": "TPL_NEW_TENDER",
        "name": "Yeni İhale Açıldı & Yayına Alındı Bildirimi",
        "subject": "Yeni Satın Alma İhalesi: [İhale Başlığı]",
        "content": "Sayın [Firma Adı] Yetkilisi,\n\nPlatformumuzda oluşturduğunuz \"[İhale Başlığı]\" başlıklı satın alma ihalesi onaylanarak başarıyla yayına alınmıştır.\n\n• İhale Başlığı: [İhale Başlığı]\n• Kategori: [Kategori]\n• Başlangıç Bütçesi: [Lider Fiyat]\n• Kalan Süre: [Kalan Süre]\n\nİhale ilanınızı ve gelen teklifleri kurumsal yönetim panelinizden anlık olarak takip edebilirsiniz:\n[Panel Linki]\n\nİhaleciBurada.com Satın Alma Masası"
    },
    {
        "id": "TPL_BID_SUBMITTED",
        "name": "Teklif Verildi Teyidi (Tedarikçiye Bildirim)",
        "subject": "Teklifiniz Başarıyla İletildi: [İhale Başlığı]",
        "content": "Sayın [Firma Adı] Yetkilisi,\n\n\"[İhale Başlığı]\" başlıklı satın alma ihalesine sunmuş olduğunuz [Sunulan Fiyat] tutarındaki fiyat teklifiniz alıcı kuruma başarıyla ulaştırılmıştır.\n\n• Teklif Durumu: Değerlendirmede\n• İhale Sahibi Kurum: [Alıcı Kurum]\n\nTeklifinizin durumunu, karşı pazarlık tekliflerini ve canlı eksiltme odasını kurumsal panelinizden takip edebilirsiniz:\n[Panel Linki]\n\nİhaleciBurada Tedarik Zinciri Masası"
    },
    {
        "id": "TPL_NEW_BID",
        "name": "İhalenize Yeni Teklif Geldi (Alıcıya Bildirim)",
        "subject": "İhalenize Yeni Teklif Geldi: [İhale Başlığı]",
        "content": "Sayın Alıcı Yetkilisi,\n\nYayınlamış olduğunuz \"[İhale Başlığı]\" başlıklı satın alma ilanı için onaylı tedarikçi [Firma Adı] tarafından yeni bir fiyat teklifi sunuldu.\n\n• Sunulan Teklif: [Lider Fiyat] TL\n• Teklif Veren Firma: [Firma Adı]\n• Teslimat & Şartname: Uygun\n\nTeklifi incelemek, tedarikçinin belgelerini görüntülemek ve karşı pazarlık teklifinizi iletmek için kurumsal panelinize giriş yapınız:\n[Panel Linki]\n\nİhaleciBurada B2B Operasyon Masası"
    },
    {
        "id": "TPL_WELCOME",
        "name": "Kurumsal Hoş Geldiniz & KYC Onayı",
        "subject": "İhaleciBurada.com Kurumsal Üyeliğiniz ve 1 Ay Ücretsiz Deneme Paketiniz Onaylandı!",
        "content": "Sayın [Firma Adı] Yetkilisi,\n\nİhaleciBurada.com B2B satın alma ve ihale platformuna hoş geldiniz!\n\nKurumsal şirket kaydınız onaylanmış ve hesabınıza 1 Ay %100 Ücretsiz Lansman Paketi ile Onaylı Mavi Rozet tanımlanmıştır.\n\nArtık Türkiye genelindeki tüm satın alma ihalelerine teklif sunabilir veya kendi şartnamenizle canlı eksiltme ihaleleri açabilirsiniz.\n\nKurumsal Yönetim Paneli: [Panel Linki]\n\nSaygılarımızla,\nHasan Hüseyin Yıldırım (İhaleciBurada)\nİletişim: 0850 840 86 95 | ihalecib@gmail.com"
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
      localStorage.removeItem('myBids')
      localStorage.removeItem('mySubmittedBids')
      localStorage.removeItem('allRegisteredUsers')
      localStorage.removeItem('user_accounts_registry')
      localStorage.removeItem('registeredUsers')
      localStorage.removeItem('kycVerifications')
      localStorage.removeItem('companyVerificationDocs')
      localStorage.removeItem('b2b_messages_chats')
      localStorage.removeItem('tenderDraft')
      localStorage.removeItem('userNotifications')
      localStorage.removeItem('crmLeads')
      localStorage.removeItem('bids')
      localStorage.removeItem('adminAuditLogs')
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
    // Fetch live tenders and bids from server API so all devices stay synchronized
    fetchServerTenders()
    fetchServerBids()
  }

  async function fetchServerTenders() {
    if (typeof window === 'undefined') return
    try {
      const res = await $fetch<{ success: boolean; tenders: any[] }>('/api/tenders')
      if (res && res.success && Array.isArray(res.tenders)) {
        if (!cmsDataRef.value.dashboard) cmsDataRef.value.dashboard = {} as any
        const serverTenders = res.tenders
        const map = new Map<string, any>()
        // Server tenders first
        serverTenders.forEach((t: any) => {
          if (t && t.id) map.set(t.id, t)
        })
        // Local additions overlay
        ;(cmsDataRef.value.dashboard.tenders || []).forEach((t: any) => {
          if (t && t.id && !map.has(t.id)) {
            map.set(t.id, t)
          }
        })
        cmsDataRef.value.dashboard.tenders = Array.from(map.values())
        safeLocalStorageSet('cmsData', cmsDataRef.value)
      }
    } catch (e) {
      console.warn('Could not fetch server tenders:', e)
    }
  }

  async function fetchServerBids() {
    if (typeof window === 'undefined') return
    try {
      const res = await $fetch<{ success: boolean; bids: any[] }>('/api/bids')
      if (res && res.success && Array.isArray(res.bids)) {
        if (!cmsDataRef.value.dashboard) cmsDataRef.value.dashboard = {} as any
        if (!Array.isArray(cmsDataRef.value.dashboard.receivedBids)) {
          cmsDataRef.value.dashboard.receivedBids = []
        }

        const groupMap = new Map<string, any>()
        ;(cmsDataRef.value.dashboard.receivedBids || []).forEach((g: any) => {
          if (g && g.id) groupMap.set(g.id, { ...g, teklifler: [...(g.teklifler || [])] })
        })

        res.bids.forEach((bid: any) => {
          let group = groupMap.get(bid.tenderId)
          if (!group) {
            group = {
              id: bid.tenderId,
              baslik: bid.tenderTitle || 'Satın Alma İhalesi',
              kategori: bid.kategori || 'Genel',
              bitis: bid.sure || '7 gün kaldı',
              teklifler: []
            }
            groupMap.set(bid.tenderId, group)
          }
          const exists = (group.teklifler || []).some((t: any) => t.id === bid.id)
          if (!exists) {
            group.teklifler.unshift(bid)
          }
        })

        cmsDataRef.value.dashboard.receivedBids = Array.from(groupMap.values())
        safeLocalStorageSet('cmsData', cmsDataRef.value)
      }
    } catch (e) {
      console.warn('Could not fetch server bids:', e)
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
    resetCmsData,
    fetchServerTenders,
    fetchServerBids
  }
}
