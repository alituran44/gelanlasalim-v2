import { ref } from 'vue'

// Default contents in Turkish for authentic local B2B portal experience
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
    title: 'CNC Fason Üretim İş Emri Serisi',
    remainingTime: '02:21',
    bestBid: 396800,
    openingPrice: 412000,
    savingsText: 'TASARRUF %3.7',
    competitors: [
      { name: 'Tedarikçi #A47', price: 396800, leader: true },
      { name: 'Tedarikçi #D08', price: 404500, leader: false }
    ]
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
    { value: '12.4M ₺+', label: 'Toplam Ticaret Hacmi' },
    { value: '150+', label: 'Doğrulanmış B2B Üretici' },
    { value: '%14.2', label: 'Ortalama Tedarik Tasarrufu' },
    { value: '0 ₺', label: 'Alıcı Üyelik Komisyonu' }
  ],
  videoGuides: [
    { title: 'Nasıl Kayıt Olunur?', desc: 'Adım adım üyelik ve firma kaydı rehberi', videoUrl: '' },
    { title: 'Nasıl İhale Açılır?', desc: 'İlk ihale ve satın alma ihalenizi dakikalar içinde başlatın', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak ihale ve satın almaye katılma rehberi', videoUrl: '' },
    { title: 'Yönetim Paneli Rehberi', desc: 'Kontrol panelini ve raporlamaları etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [],
    receivedBids: [],
    submittedBids: [],
    disputes: [],
    companyReviews: [],
    sectorAlerts: [],
    escrowOrders: []
  },
  contact: {
    address: 'İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye',
    email: 'ihalcib@gmail.com',
    workHoursWeekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
    workHoursSaturday: 'Cumartesi: 10:00 - 14:00'
  },
  payments: [
    {
      id: 'ORD-894210',
      referenceCode: 'GA-9B432',
      userName: 'Ahmet Yılmaz',
      companyName: 'Ekspres Lojistik A.Ş.',
      packageName: 'Profesyonel Üyelik Planı',
      amount: '960 ₺',
      paymentMethod: 'Banka Havalesi / EFT',
      status: 'pending',
      date: '17 Temmuz 2026'
    },
    {
      id: 'ORD-761234',
      referenceCode: '-',
      userName: 'Elif Kaya',
      companyName: 'Kaya Mimarlık Ltd.',
      packageName: 'Kurumsal Enterprise Plan',
      amount: '1.800 ₺',
      paymentMethod: 'PayTR / Kredi Kartı',
      status: 'approved',
      date: '16 Temmuz 2026'
    }
  ],
  supportSettings: {
    whatsappEnabled: true,
    whatsappNumber: '908508408695',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale süreçleri ve 1 ay ücretsiz deneme paketi hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 1 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın. Kullanıcılara 1 ay ücretsiz deneme, ihale açma, teklif verme, ihale ve satın alma konularında yardımcı ol.'
  },
  crmSettings: {
    leads: [
      { id: 1, companyName: 'Kalyon Tedarik Ltd.', contactName: 'Ahmet Kalyoncu', email: 'ahmet@kalyon.com', phone: '0532 111 22 33', status: '1 Ay Deneme Aktif', stage: 'active', notes: 'İnşaat malzemesi ihalesi açacak.', createdAt: '2026-08-20' },
      { id: 2, companyName: 'Anadolu Lojistik A.Ş.', contactName: 'Mehmet Yılmaz', email: 'mehmet@anadolulojistik.com', phone: '0544 555 66 77', status: 'Teklif Veren', stage: 'qualified', notes: 'Akaryakıt ihalesine teklif verdi.', createdAt: '2026-08-21' },
      { id: 3, companyName: 'Mega Ambalaj Sanayi', contactName: 'Selin Erdem', email: 'selin@megaambalaj.com', phone: '0555 888 99 00', status: 'Görüşülüyor', stage: 'contacted', notes: 'Kurumsal SAP entegrasyonu talebi var.', createdAt: '2026-08-22' }
    ]
  },
  emailSettings: {
    senderName: 'İhaleciBurada B2B Operasyon',
    senderEmail: 'ihalcib@gmail.com',
    replyToEmail: 'ihalcib@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'ihalcib@gmail.com',
    subscribers: [
      { id: 1, email: 'info@kalyon.com', companyName: 'Kalyon Tedarik Ltd.', source: 'Kayıt Formu', subscribedAt: '2026-08-20', status: 'Aktif' },
      { id: 2, email: 'satinalma@anadolu.com', companyName: 'Anadolu Lojistik A.Ş.', source: 'Bülten Aboneliği', subscribedAt: '2026-08-21', status: 'Aktif' },
      { id: 3, email: 'kurumsal@megaambalaj.com', companyName: 'Mega Ambalaj Sanayi', source: 'İhale Katılımı', subscribedAt: '2026-08-22', status: 'Aktif' }
    ],
    templates: [
      {
        id: 'trial-welcome',
        name: '🎉 1 Ay Ücretsiz Lansman Hoş Geldin & Aktivasyon',
        subject: 'İhaleciBurada.com: 1 Aylık %100 Ücretsiz Lansman Deneme Paketiniz Aktif!',
        content: `Sayın Yetkili,\n\nİhaleciBurada B2B İhale ve Satın Alma ve Satın Alma Platformu'na hoş geldiniz!\n\nLansmanımıza özel olarak tanımlanan 1 Aylık %100 Ücretsiz Kurumsal Deneme Paketiniz başarıyla aktifleştirildi.\n\n✓ 1 Ay Boyunca 0 ₺ Ücret (Kredi Kartı Gerekmez)\n✓ Sınırsız İhale Açma & Canlı Tersine Eksiltme\n✓ Doğrulanmış Kurumsal Firmalardan Belgeli Teklif Toplama\n✓ Geçerlilik Bitiş Tarihi: 25 Eylül 2026\n\nPanele gitmek ve ilk ihalenizi oluşturmak için: https://gelanlasalim-v2.vercel.app/panel\n\nSaygılarımızla,\nİhaleciBurada Müşteri Başarı Ekibi\nihalcib@gmail.com | 0850 840 86 95`
      },
      {
        id: 'new-tender',
        name: '📢 Yeni İhale Yayınlandı Bildirimi',
        subject: 'Yeni İhale Yayında: Sektörünüze Uygun Yeni Bir Satın Alma İlanı Açıldı',
        content: `Sayın Tedarikçimiz,\n\nFaaliyet alanınıza uygun yeni bir B2B satın alma ihalesi yayına alınmıştır.\n\nİhale Başlığı: [İhale Başlığı]\nKategori: [Sektör / Kategori]\nKalan Süre: [Kalan Süre]\n\nŞartnameyi incelemek ve teklifinizi iletmek için hemen tıklayın:\nhttps://gelanlasalim-v2.vercel.app/panel/gelen-teklifler\n\nİhaleciBurada B2B Operasyon Merkezi\nihalcib@gmail.com`
      },
      {
        id: 'live-auction',
        name: '⚡ Canlı Tersine Eksiltme Başladı & Teklif Uyarısı',
        subject: 'İhale ve Satın Alma Başladı: İhalede Fiyatlar Düşüyor!',
        content: `Sayın İhale Katılımcısı,\n\nKayıt olduğunuz ihalenin CANLI TERSİNE EKSİLTME (Canlı Pazarlık) seansı başlamıştır.\n\nAnlık Lider Teklif: [Lider Fiyat]\nKalan Süre: [Süre]\n\nCanlı odaya bağlanmak ve yeni teklifinizi vermek için:\nhttps://gelanlasalim-v2.vercel.app/panel/canli-etkinlikler\n\nBol kazançlı ihaleler dileriz,\nİhaleciBurada.com`
      },
      {
        id: 'kyc-approved',
        name: '🛡️ Kurumsal Firma Doğrulama & KYC Onayı',
        subject: 'Firma Belgeleriniz Doğrulandı — Mavi Rozetiniz Aktif!',
        content: `Tebrikler!\n\nYüklemiş olduğunuz vergi levhası ve ticaret sicil belgeleri uzmanlarımız tarafından incelenmiş ve onaylanmıştır.\n\nProfilinize 'DOĞRULANMIŞ KURUMSAL ÜRETİCİ / ALICI' mavi rozeti eklenmiştir.\n\nİhaleciBurada Güvenlik ve Uyumluluk Departmanı\nihalcib@gmail.com`
      },
      {
        id: 'weekly-digest',
        name: '📊 Haftalık B2B İhale ve Tasarruf Bülteni',
        subject: 'Haftalık B2B Tedarik Özeti: 12.4M ₺ Hacim ve Öne Çıkan İhaleler',
        content: `Bu hafta İhaleciBurada'da gerçekleşen öne çıkan ihaleler ve ortalama %14.2 tasarruf fırsatları bülteninizde!\n\nAktif İhale Sayısı: 48+\nTamamlanan İşlem Hacmi: 12.4M ₺+\n\nTüm güncel fırsatları listelemek için: https://gelanlasalim-v2.vercel.app/pazar-yeri\n\nİhaleciBurada B2B Bülten\nihalcib@gmail.com`
      }
    ]
  },
  kycVerifications: [
    {
      id: 'KYC-8921',
      companyName: 'Turan Bilişim & Tedarik Ltd.',
      companyType: 'Limited Şirket (LTD)',
      taxNo: '43624665040',
      taxOffice: 'Çanakkale Vergi Dairesi',
      authorizedPerson: 'Ali Turan (Yönetici)',
      phone: '0850 840 86 95',
      email: 'ali@turanbilisim.com',
      uploadedDocs: ['Vergi Levhası (2025/2026)', 'İmza Sirküleri', 'Ticaret Sicil Gazetesi'],
      status: 'pending',
      badgeGranted: false,
      createdAt: '2026-08-22 14:30',
      rejectionReason: ''
    },
    {
      id: 'KYC-7412',
      companyName: 'Kalyon İnşaat & Yapı Malzemeleri A.Ş.',
      companyType: 'Anonim Şirket (A.Ş.)',
      taxNo: '58402918231',
      taxOffice: 'Büyük Mükellefler V.D.',
      authorizedPerson: 'Ahmet Kalyoncu (Genel Müdür)',
      phone: '0532 111 22 33',
      email: 'ahmet@kalyon.com',
      uploadedDocs: ['Vergi Levhası', 'Faaliyet Belgesi', 'İmza Sirküleri'],
      status: 'approved',
      badgeGranted: true,
      createdAt: '2026-08-20 11:15',
      rejectionReason: ''
    },
    {
      id: 'KYC-6320',
      companyName: 'Anadolu Akaryakıt & Lojistik A.Ş.',
      companyType: 'Anonim Şirket (A.Ş.)',
      taxNo: '10928374652',
      taxOffice: 'Ankara Kızılbey V.D.',
      authorizedPerson: 'Mehmet Yılmaz (Satın Alma Direktörü)',
      phone: '0544 555 66 77',
      email: 'mehmet@anadolulojistik.com',
      uploadedDocs: ['Vergi Levhası', 'EPDK Lisans Belgesi'],
      status: 'approved',
      badgeGranted: true,
      createdAt: '2026-08-19 16:45',
      rejectionReason: ''
    },
    {
      id: 'KYC-5109',
      companyName: 'Hızlı Kargo & Paketleme Şahıs İşletmesi',
      companyType: 'Şahıs İşletmesi',
      taxNo: '99283746102',
      taxOffice: 'İzmir Kordon V.D.',
      authorizedPerson: 'Caner Demir',
      phone: '0555 333 44 55',
      email: 'caner@hizlikargo.com',
      uploadedDocs: ['Kimlik Fotokopisi'],
      status: 'rejected',
      badgeGranted: false,
      createdAt: '2026-08-18 09:20',
      rejectionReason: 'Vergi levhası ve imza beyannamesi eksik yüklenmiştir.'
    }
  ],
  liveAuctionRooms: [
    {
      id: 'ROOM-101',
      tenderTitle: 'CNC Fason Üretim İş Emri Serisi (5.000 Adet Parça)',
      category: 'Makine & Metal Sanayi',
      ceilingPrice: 420000,
      currentBestBid: 396800,
      minStep: 1000,
      participantsCount: 6,
      remainingSeconds: 340,
      status: 'live',
      leaderSupplier: 'Tedarikçi #A47 (Ege Hassas Talaşlı Üretim)'
    },
    {
      id: 'ROOM-102',
      tenderTitle: '10.000 Litre Euro Dizel Motorin Yakıt Alımı',
      category: 'Akaryakıt & Enerji',
      ceilingPrice: 480000,
      currentBestBid: 435000,
      minStep: 500,
      participantsCount: 4,
      remainingSeconds: 720,
      status: 'live',
      leaderSupplier: 'Tedarikçi #K12 (Petrol Dağıtım A.Ş.)'
    },
    {
      id: 'ROOM-103',
      tenderTitle: '50.000 Adet Özel Baskılı Çift Dalga Koli Alımı',
      category: 'Ambalaj & Koli',
      ceilingPrice: 185000,
      currentBestBid: 162000,
      minStep: 250,
      participantsCount: 5,
      remainingSeconds: 0,
      status: 'ended',
      leaderSupplier: 'Mega Ambalaj Sanayi Ltd.'
    }
  ],
  escrowOrders: [
    {
      id: 'ESC-9041',
      orderCode: 'SIP-2026-8812',
      tenderTitle: '120 Ton Hazır Beton C30/37 Alımı',
      buyerCompany: 'Özgür İnşaat A.Ş.',
      supplierCompany: 'Çanakkale Çimento & Beton Sanayi',
      totalAmount: '450.000 ₺',
      escrowStatus: 'sevkiyat_bekliyor',
      deliveryDate: '28 Ağustos 2026',
      trackingNumber: 'TRK-9812401'
    },
    {
      id: 'ESC-8930',
      orderCode: 'SIP-2026-7645',
      tenderTitle: 'Kurumsal Ofis Ergonomik Çalışma Koltukları (40 Adet)',
      buyerCompany: 'Metro Teknoloji A.Ş.',
      supplierCompany: 'Büroline Mobilya Ltd.',
      totalAmount: '128.000 ₺',
      escrowStatus: 'teslim_onaylandi',
      deliveryDate: '21 Ağustos 2026',
      trackingNumber: 'TRK-6641209'
    },
    {
      id: 'ESC-7721',
      orderCode: 'SIP-2026-6102',
      tenderTitle: '5.000 Metre Su Geçirmez Brandalı Kumaş',
      buyerCompany: 'Tekstil Sanayi Ltd.',
      supplierCompany: 'Dokuma İplik A.Ş.',
      totalAmount: '89.500 ₺',
      escrowStatus: 'odeme_cozuldu',
      deliveryDate: '15 Ağustos 2026',
      trackingNumber: 'TRK-5519800'
    }
  ],
  categories: [
    { id: 'kat-1', name: 'İnşaat, Yapı & Şantiye', icon: 'Building2', targetSavings: '%16.5', activeTendersCount: 0, description: 'Demir, çimento, hazır beton, yalıtım ve kaba inşaat malzemeleri.' },
    { id: 'kat-2', name: 'Makine, Yedek Parça & Metal', icon: 'Wrench', targetSavings: '%14.2', activeTendersCount: 0, description: 'CNC fason talaşlı imalat, torna, sac işleme ve hidrolik aksam.' },
    { id: 'kat-3', name: 'Akaryakıt, Enerji & Madeni Yağ', icon: 'Fuel', targetSavings: '%11.8', activeTendersCount: 0, description: 'Toptan motorin, benzin, sanayi elektriği ve endüstriyel madeni yağ.' },
    { id: 'kat-4', name: 'Ambalaj, Koli & Plastik', icon: 'Package', targetSavings: '%18.0', activeTendersCount: 0, description: 'Oluklu mukavva koli, streç film, palet ve esnek ambalaj ürünleri.' },
    { id: 'kat-5', name: 'Lojistik, Nakliye & Depolama', icon: 'Truck', targetSavings: '%15.4', activeTendersCount: 0, description: 'Yurt içi komple tır, parsiyel sevkiyat, antrepo ve soğuk hava depolama.' },
    { id: 'kat-6', name: 'Kırtasiye, Ofis & Teknoloji', icon: 'Laptop', targetSavings: '%21.0', activeTendersCount: 0, description: 'Fotokopi kağıdı, toner, bilgisayar donanımı ve ofis mobilyası.' }
  ],
  promoCodes: [
    { code: 'LANSMAN1AY', discountType: 'free_trial_months', value: '1 Ay Bedelsiz', usageLimit: 1000, usedCount: 142, expiryDate: '25 Eylül 2026', status: 'active' },
    { code: 'LANSMAN20', discountType: 'percent_discount', value: '%20 İndirim', usageLimit: 500, usedCount: 45, expiryDate: '31 Aralık 2026', status: 'active' },
    { code: 'VIP2026', discountType: 'percent_discount', value: '%100 İndirim', usageLimit: 250, usedCount: 38, expiryDate: '31 Aralık 2026', status: 'active' },
    { code: 'B2BTASARRUF', discountType: 'fixed_amount', value: '1.000 ₺ Kredi', usageLimit: 500, usedCount: 89, expiryDate: '01 Ocak 2027', status: 'active' }
  ],
  auditLogs: [
    { id: 'LOG-9912', timestamp: '2026-08-23 02:10:14', userEmail: 'admin@ihaleciburada.com', action: 'Yönetici Girişi Yapıldı', ipAddress: '176.240.12.84', status: 'success', details: 'TLS 1.3 şifreli oturum başlatıldı.' },
    { id: 'LOG-9911', timestamp: '2026-08-22 23:05:42', userEmail: 'admin@ihaleciburada.com', action: 'WhatsApp & AI Ayarları Güncellendi', ipAddress: '176.240.12.84', status: 'success', details: 'Numara: 908508408695 olarak kaydedildi.' },
    { id: 'LOG-9910', timestamp: '2026-08-22 22:58:19', userEmail: 'admin@ihaleciburada.com', action: '1 Ay Lansman Planı Yayına Alındı', ipAddress: '176.240.12.84', status: 'success', details: '0 TL bedelsiz deneme paketi aktif edildi.' },
    { id: 'LOG-9909', timestamp: '2026-08-22 21:40:05', userEmail: 'sistem@ihaleciburada.com', action: 'Otomatik Veritabanı Yedeği Alındı', ipAddress: '127.0.0.1', status: 'success', details: 'JSON veri yedeği disk alanına arşivlendi.' },
    { id: 'LOG-9908', timestamp: '2026-08-22 19:15:33', userEmail: 'ahmet@kalyon.com', action: 'KYC Belgesi Yüklendi', ipAddress: '88.241.90.11', status: 'warning', details: 'Vergi levhası inceleme kuyruğuna alındı.' }
  ],
  siteSettings: {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı altyapı güçlendirme çalışması yapılmaktadır. Sistem en kısa sürede tekrar aktif olacaktır.',
    metaTitle: 'İhaleciBurada.com | Türkiye’nin Öncü B2B İhale ve Satın Alma & Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, canlı tersine eksiltme ile rekabetçi teklifler toplayın, kurumsal tedarik maliyetlerinizi %14.2 düşürün.',
    announcementTicker: '⚡ LANSMANA ÖZEL: Tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi! Kredi kartı gerekmez, 0 ₺ bedelsiz anında aktivasyon.',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 840 86 95',
    supportEmail: 'ihalcib@gmail.com',
    primaryCurrency: 'TRY (₺)',
    allowGuestBrowsing: true,
    enableEmailAlerts: true
  }
}

const cmsDataRef = ref({ ...DEFAULT_CMS_DATA })
let isInitialized = false

export function useCmsData() {
  // Initialize and load data on client side once
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true
    const saved = localStorage.getItem('cmsData')
    if (saved) {
      try {
        const str = saved.toLowerCase()
        // If saved data contains old seeded mock tenders or legacy demo content, purge completely
        if (
          str.includes('2026/14589') ||
          str.includes('kalyon & kolin') ||
          str.includes('nervürlü inşaat demiri') ||
          str.includes('dopel kraft') ||
          str.includes('ihc-2026-101') || 
          str.includes('ihc-2024-001') || 
          str.includes('mıcır') || 
          str.includes('micir') || 
          str.includes('harita ölçüm') || 
          str.includes('harita olcum')
        ) {
          const fresh = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
          cmsDataRef.value = fresh
          localStorage.setItem('cmsData', JSON.stringify(fresh))
        } else {
          cmsDataRef.value = JSON.parse(saved)
          if (!cmsDataRef.value.dashboard) {
            cmsDataRef.value.dashboard = { ...DEFAULT_CMS_DATA.dashboard }
          }
          if (!Array.isArray(cmsDataRef.value.dashboard.tenders)) {
            cmsDataRef.value.dashboard.tenders = []
          }
        }
      } catch (e) {
        cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
        localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
      }
    } else {
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  function saveCmsData(newData: typeof DEFAULT_CMS_DATA) {
    cmsDataRef.value = { ...newData }
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(newData))
    }
  }

  function resetCmsData() {
    cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
    if (typeof window !== 'undefined') {
      localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
    }
  }

  return {
    cmsData: cmsDataRef,
    saveCmsData,
    resetCmsData
  }
}
