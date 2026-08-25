import { ref } from 'vue'

// Default contents in Turkish for authentic local B2B portal experience
export const DEFAULT_CMS_DATA = {
  hero: {
    tagline: "ÖZEL SEKTÖRÜN CANLI TERS İHALE VE PAZARLIK ARENASI",
    titleLine1: 'İhale Aç.',
    titleLine2: 'Teklif Topla.',
    titleItalic: "İhaleci Burada.",
    description: 'İhaleciBurada.com; e-ihale, canlı eksiltme, teklif toplama ve doğrudan fiyat pazarlığı süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, rekabetçi tekliflerle tasarruf edin.',
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
    { title: 'Nasıl İhale Açılır?', desc: 'İlk canlı eksiltme ihalenizi dakikalar içinde başlatın', videoUrl: '' },
    { title: 'Nasıl Teklif Verilir?', desc: 'Tedarikçi olarak canlı eksiltmeye katılma rehberi', videoUrl: '' },
    { title: 'Yönetim Paneli Rehberi', desc: 'Kontrol panelini ve raporlamaları etkin kullanma', videoUrl: '' }
  ],
  dashboard: {
    tenders: [
      {
        id: 'IHC-2026-101',
        baslik: '10 KM Mıcır Yol Yapım İşi',
        kategori: 'İnşaat ve Yapı / Yol Yapımı',
        sure: '7 gün kaldı',
        teklifSayisi: 2,
        durum: 'active',
        butce: '1.450.000 ₺',
        city: 'Balıkesir',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60',
        aciklama: '10 kilometre yol boyunca 0-38 mm temel mıcır malzeme temini, serimi, finişer ve silindir ile sıkıştırma işi.',
        olusturma: '24 Ağu 2026'
      },
      {
        id: 'IHC-2026-102',
        baslik: 'Harita Ölçüm İşi & Plankote',
        kategori: 'İnşaat ve Yapı / Konut İnşaatı',
        sure: '5 gün kaldı',
        teklifSayisi: 1,
        durum: 'active',
        butce: '65.000 ₺',
        city: 'Bursa',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=60',
        aciklama: '35.000 m² sanayi arazisi halihazır harita alımı, plankote ve GNSS koordinatlandırma çalışması.',
        olusturma: '24 Ağu 2026'
      },
      {
        id: 'IHC-2024-001',
        baslik: 'Kurumsal Ofis Malzemeleri Alımı',
        kategori: 'Mobilya ve Ofis / Büro Mobilyası',
        sure: '2 gün kaldı',
        teklifSayisi: 3,
        durum: 'active',
        butce: '45.000 ₺',
        city: 'İstanbul',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60',
        aciklama: 'A4 fotokopi kağıtları, tonerler ve kurumsal kırtasiye paketleri toplu tedariki.',
        olusturma: '14 Tem 2024'
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamerası Sistemi Kurulumu',
        kategori: 'Elektronik / Güvenlik Kamerası',
        sure: '5 gün kaldı',
        teklifSayisi: 2,
        durum: 'active',
        butce: '180.000 ₺',
        city: 'Ankara',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=60',
        aciklama: '48 adet IP 4K PoE kamera, NVR sunucu ve Cat6 kablolama altyapı kurulumu.',
        olusturma: '12 Tem 2024'
      },
      {
        id: 'IHC-2024-003',
        baslik: 'Tarımsal Sulama Ekipmanları Alımı',
        kategori: 'Tarım ve Hayvancılık / Sulama Sistemleri',
        sure: 'Tamamlandı',
        teklifSayisi: 4,
        durum: 'closed',
        butce: '320.000 ₺',
        city: 'İzmir',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=60',
        aciklama: 'Damlama sulama boruları, ana hat vanaları ve filtreleme tankları alımı.',
        olusturma: '01 Tem 2024'
      },
      {
        id: 'IHC-2024-004',
        baslik: 'Lojistik Taşımacılık Hizmeti Alımı',
        kategori: 'Araç ve İş Makineleri / Kamyon',
        sure: '10 gün kaldı',
        teklifSayisi: 3,
        durum: 'active',
        butce: '95.000 ₺',
        city: 'Kocaeli',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60',
        aciklama: 'Gebze-Balıkesir arası haftalık 8 seferlik kapalı kasa tır taşımacılık hizmeti.',
        olusturma: '10 Tem 2024'
      }
    ],
    receivedBids: [
      {
        id: 'IHC-2026-101',
        baslik: '10 KM Mıcır Yol Yapım İşi',
        kategori: 'İnşaat ve Yapı / Yol Yapımı',
        bitis: '7 gün kaldı',
        teklifler: [
          {
            id: 'TKF-101',
            firma: 'Balıkesir Agrega & Mıcır Ltd.',
            fiyat: '1.380.000 ₺',
            sure: '15 gün',
            puan: 4.9,
            durum: 'bekliyor',
            yetkili: 'Mehmet Yılmaz',
            telefon: '+90 532 444 11 22',
            eposta: 'satis@balikesiragrega.com',
            vergiDairesi: 'Karesi V.D. / 1450293847',
            adres: 'Organize Sanayi Bölgesi 4. Cadde No:12 Balıkesir',
            pazarlikGecmisi: []
          },
          {
            id: 'TKF-102',
            firma: 'Kaya Taş Ocağı & İnşaat A.Ş.',
            fiyat: '1.420.000 ₺',
            sure: '12 gün',
            puan: 4.7,
            durum: 'bekliyor',
            yetkili: 'Cemil Kaya',
            telefon: '+90 533 888 77 66',
            eposta: 'ihale@kayatasocagi.com.tr',
            vergiDairesi: 'Altıeylül V.D. / 8740192834',
            adres: 'Değirmenboğazı Mevkii Taşocağı Yolu Balıkesir',
            pazarlikGecmisi: []
          }
        ]
      },
      {
        id: 'IHC-2026-102',
        baslik: 'Harita Ölçüm İşi & Plankote',
        kategori: 'İnşaat ve Yapı / Konut İnşaatı',
        bitis: '5 gün kaldı',
        teklifler: [
          {
            id: 'TKF-103',
            firma: 'Marmara Jeodezi & Harita Müh.',
            fiyat: '58.000 ₺',
            sure: '4 gün',
            puan: 4.8,
            durum: 'bekliyor',
            yetkili: 'Harun Demir (Harita Yük. Müh.)',
            telefon: '+90 535 777 99 00',
            eposta: 'harun@marmarajeodezi.com',
            vergiDairesi: 'Osmangazi V.D. / 6210984736',
            adres: 'FSM Bulvarı No:48 Nilüfer, Bursa',
            pazarlikGecmisi: []
          }
        ]
      },
      {
        id: 'IHC-2024-001',
        baslik: 'Kurumsal Ofis Malzemeleri Alımı',
        kategori: 'Mobilya ve Ofis / Büro Mobilyası',
        bitis: '16 Tem 2024',
        teklifler: [
          {
            id: 'TKF-001',
            firma: 'ABC Kırtasiye A.Ş.',
            fiyat: '38.500 ₺',
            sure: '7 gün',
            puan: 4.8,
            durum: 'bekliyor',
            yetkili: 'Ali Çelik',
            telefon: '+90 532 111 22 33',
            eposta: 'ali@abckirtasiye.com',
            vergiDairesi: 'Mecidiyeköy V.D. / 0192837465',
            adres: 'Büyükdere Cad. No:82 Şişli, İstanbul',
            pazarlikGecmisi: []
          },
          {
            id: 'TKF-002',
            firma: 'Delta Ofis Ltd.',
            fiyat: '41.200 ₺',
            sure: '5 gün',
            puan: 4.2,
            durum: 'bekliyor',
            yetkili: 'Selim Kurt',
            telefon: '+90 542 333 44 55',
            eposta: 'selim@deltaofis.com',
            vergiDairesi: 'Kozyatağı V.D. / 9988776655',
            adres: 'İnönü Cad. No:14 Kadıköy, İstanbul',
            pazarlikGecmisi: []
          },
          {
            id: 'TKF-003',
            firma: 'OfisPro Lojistik',
            fiyat: '36.900 ₺',
            sure: '10 gün',
            puan: 4.6,
            durum: 'bekliyor',
            yetkili: 'Burak Demir',
            telefon: '+90 533 555 66 77',
            eposta: 'burak@ofispro.com',
            vergiDairesi: 'Beyoğlu V.D. / 4455667788',
            adres: 'Karaköy Rıhtım Cad. No:5 İstanbul',
            pazarlikGecmisi: []
          }
        ]
      },
      {
        id: 'IHC-2024-002',
        baslik: 'Güvenlik Kamerası Sistemi Kurulumu',
        kategori: 'Elektronik / Güvenlik Kamerası',
        bitis: '21 Tem 2024',
        teklifler: [
          {
            id: 'TKF-004',
            firma: 'SecureTek Sistemleri',
            fiyat: '162.000 ₺',
            sure: '14 gün',
            puan: 4.9,
            durum: 'bekliyor',
            yetkili: 'Volkan Aktaş',
            telefon: '+90 530 123 45 67',
            eposta: 'proje@securetek.com',
            vergiDairesi: 'Çankaya V.D. / 3322110099',
            adres: 'Cinnah Cad. No:31 Çankaya, Ankara',
            pazarlikGecmisi: []
          },
          {
            id: 'TKF-005',
            firma: 'Kamera Dünyası A.Ş.',
            fiyat: '175.000 ₺',
            sure: '7 gün',
            puan: 4.1,
            durum: 'bekliyor',
            yetkili: 'Engin Koç',
            telefon: '+90 541 987 65 43',
            eposta: 'engin@kameradunyasi.com',
            vergiDairesi: 'Ulus V.D. / 7788990011',
            adres: 'Rüzgarlı Sok. No:19 Altındağ, Ankara',
            pazarlikGecmisi: []
          }
        ]
      }
    ],
    submittedBids: [
      {
        id: 'TKF-008',
        tenderId: 'IHC-2026-901',
        ilanBaslik: 'Yazılım Geliştirme & API Hizmetleri',
        aliciFirma: 'TechB2B Holding A.Ş.',
        kategori: 'Bilgisayar ve Teknoloji / Web Yazılımı',
        teklifFiyatim: '95.000 ₺',
        sure: '45 gün',
        durum: 'bekliyor',
        tarih: '24 Ağu 2026',
        bitisTarihi: '30 Ağu 2026',
        notum: 'Teslimat süresini 30 güne düşürebiliriz.',
        pazarlikGecmisi: []
      },
      {
        id: 'TKF-009',
        tenderId: 'IHC-2026-902',
        ilanBaslik: 'Tarımsal Gübre Tedariki',
        aliciFirma: 'Ege Tarım Birlik Ltd.',
        kategori: 'Tarım ve Hayvancılık / Gübre',
        teklifFiyatim: '210.000 ₺',
        sure: '14 gün',
        durum: 'onaylandi',
        tarih: '20 Ağu 2026',
        bitisTarihi: '28 Ağu 2026',
        notum: 'ISO sertifikalı ürünler. Numune gönderilebilir.',
        yetkili: 'Kenan Ege',
        telefon: '+90 532 999 88 77',
        eposta: 'kenan@egetarim.com',
        vergiDairesi: 'Konak V.D. / 1122334455',
        adres: 'Liman Cad. No:99 Konak, İzmir',
        pazarlikGecmisi: []
      },
      {
        id: 'TKF-010',
        tenderId: 'IHC-2026-903',
        ilanBaslik: 'Yönetici Ofis Mobilyaları Alımı',
        aliciFirma: 'Anadolu Finans Grup',
        kategori: 'Mobilya ve Ofis / Büro Mobilyası',
        teklifFiyatim: '78.500 ₺',
        sure: '21 gün',
        durum: 'reddedildi',
        tarih: '18 Ağu 2026',
        bitisTarihi: '25 Ağu 2026',
        notum: 'Üst segment ceviz kaplama masa takımı.',
        pazarlikGecmisi: [
          { kim: 'Alıcı Firma', mesaj: 'Fiyat bütçemizin üzerindedir. 65.000 TL bandında revize edebilir misiniz?', tarih: '20 Ağu 2026' }
        ]
      }
    ],
    disputes: [
      {
        id: 'DSP-2026-01',
        tenderTitle: 'Endüstriyel Trafo & Jeneratör Alımı',
        contractId: 'SZL-9482',
        parties: 'Atlas Enerji A.Ş. ⟷ Güçlü Elektrik Ltd.',
        amount: '420.000 ₺',
        reason: 'Mücbir Sebep - Uluslararası hammadde tedarik zinciri aksaması ve fabrikanın su baskını geçirmesi.',
        status: 'INCELENIYOR',
        requestedBy: 'Güçlü Elektrik Ltd. (Tedarikçi)',
        date: '24.08.2026 14:10'
      }
    ],
    companyReviews: [],
    sectorAlerts: [
      'İnşaat ve Yapı',
      'Bilgisayar ve Teknoloji',
      'Sanayi ve Makine',
      'Tarım ve Hayvancılık'
    ],
    escrowOrders: [
      {
        id: 'SIP-2026-801',
        tenderId: 'IHC-2026-902',
        tenderTitle: 'Tarımsal Gübre Tedariki (25 Ton)',
        buyerFirm: 'Ege Tarım Birlik Ltd. (Alıcı)',
        supplierFirm: 'Kenan Tarım Kimya A.Ş. (Tedarikçi)',
        totalAmount: '210.000 ₺',
        numericAmount: 210000,
        commissionRate: 3,
        commissionAmount: '6.300 ₺',
        payoutAmount: '203.700 ₺',
        paymentMethod: 'İyzico Pazaryeri / Güvenli Havuz (Kredi Kartı 6 Taksit)',
        status: 'HAVUZDA_BLOKE',
        createdAt: '24 Ağu 2026',
        updatedAt: 'Bugün 15:30',
        trackingCode: 'YK-894210982',
        shippingCompany: 'Yurtiçi Lojistik / Ambar',
        shippingDate: '25 Ağu 2026',
        notes: 'Ürünler İzmir liman deposundan sevk edildi. Sevk İrsaliyesi No: IRS-48201',
        deliveryEvidence: 'irsaliye_ege_tarim_25ton.pdf',
        history: [
          { title: 'İhale Onaylandı & Mutabakat Sağlandı', date: '24 Ağu 2026 14:00', by: 'Alıcı Firma' },
          { title: 'Güvenli Havuz Ödemesi Alındı (İyzico Bloke)', date: '24 Ağu 2026 15:30', by: 'İyzico Escrow API' },
          { title: 'Tedarikçi Sevkiyatı Başlattı (İrsaliye Yüklendi)', date: '25 Ağu 2026 09:15', by: 'Tedarikçi' }
        ]
      },
      {
        id: 'SIP-2026-802',
        tenderId: 'IHC-2026-784',
        tenderTitle: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
        buyerFirm: 'Ali Turan (Siz - Alıcı)',
        supplierFirm: 'TeknoBilişim Dağıtım Ltd. Şti.',
        totalAmount: '5.120.000 ₺',
        numericAmount: 5120000,
        commissionRate: 2.5,
        commissionAmount: '128.000 ₺',
        payoutAmount: '4.992.000 ₺',
        paymentMethod: 'PayTR B2B Sanal IBAN / Havale',
        status: 'MAL_KABUL_BEKLIYOR',
        createdAt: '22 Ağu 2026',
        updatedAt: 'Bugün 11:20',
        trackingCode: 'MNG-7748190',
        shippingCompany: 'MNG Kargo B2B Ağır Yük',
        shippingDate: '23 Ağu 2026',
        notes: '500 koli TSE mühürlü teslim edildi. Muayene ve seri no kontrolü yapılıyor.',
        deliveryEvidence: 'sevk_irsaliyesi_bilgisayar_500.pdf',
        history: [
          { title: 'Mutabakat Sağlandı & Sözleşme İmzalandı', date: '22 Ağu 2026', by: 'Sistem' },
          { title: 'B2B Havuz Ödemesi Bloke Edildi (5.120.000 ₺)', date: '22 Ağu 2026', by: 'PayTR Escrow' },
          { title: 'Sevkiyat ve İrsaliye Girişi Yapıldı', date: '23 Ağu 2026', by: 'TeknoBilişim Ltd.' },
          { title: 'Kargo Teslim Edildi — Muayene & Mal Kabul Bekleniyor', date: '25 Ağu 2026', by: 'Kargo Firması' }
        ]
      },
      {
        id: 'SIP-2026-799',
        tenderId: 'IHC-2026-610',
        tenderTitle: '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi',
        buyerFirm: 'Ali Turan (Siz - Alıcı)',
        supplierFirm: 'Anadolu Ambalaj Sanayi',
        totalAmount: '318.000 ₺',
        numericAmount: 318000,
        commissionRate: 3,
        commissionAmount: '9.540 ₺',
        payoutAmount: '308.460 ₺',
        paymentMethod: 'İyzico Pazaryeri / Kredi Kartı 12 Taksit',
        status: 'TAMAMLANDI',
        createdAt: '15 Ağu 2026',
        updatedAt: '20 Ağu 2026',
        trackingCode: 'AMB-1029384',
        shippingCompany: 'Özel Nakliye / Tır',
        shippingDate: '18 Ağu 2026',
        notes: 'Malzeme eksiksiz teslim alındı. Kalite onaylandı. Ödeme tedarikçi IBAN hesabına aktarıldı.',
        deliveryEvidence: 'teslim_tutanagi_onayli.pdf',
        history: [
          { title: 'Havuz Ödemesi Alındı', date: '15 Ağu 2026', by: 'İyzico' },
          { title: 'Sevkiyat Tamamlandı', date: '18 Ağu 2026', by: 'Anadolu Ambalaj' },
          { title: 'Mal Kabulü Onaylandı & Havuz Çözüldü', date: '20 Ağu 2026', by: 'Alıcı (Siz)' },
          { title: 'Split Payment: 308.460 ₺ Tedarikçiye, 9.540 ₺ Komisyon Platforma Aktarıldı ✓', date: '20 Ağu 2026', by: 'İyzico Dağıtım API' }
        ]
      }
    ]
  },
  contact: {
    address: 'İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye',
    email: 'ihalecib@gmail.com',
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
    whatsappNumber: '908503080000',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale süreçleri ve 1 ay ücretsiz deneme paketi hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 1 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın. Kullanıcılara 1 ay ücretsiz deneme, ihale açma, teklif verme, canlı eksiltme konularında yardımcı ol.'
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
    senderEmail: 'ihalecib@gmail.com',
    replyToEmail: 'ihalecib@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'ihalecib@gmail.com',
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
        content: `Sayın Yetkili,\n\nİhaleciBurada B2B Canlı Eksiltme ve Satın Alma Platformu'na hoş geldiniz!\n\nLansmanımıza özel olarak tanımlanan 1 Aylık %100 Ücretsiz Kurumsal Deneme Paketiniz başarıyla aktifleştirildi.\n\n✓ 1 Ay Boyunca 0 ₺ Ücret (Kredi Kartı Gerekmez)\n✓ Sınırsız İhale Açma & Canlı Tersine Eksiltme\n✓ Doğrulanmış Kurumsal Firmalardan Belgeli Teklif Toplama\n✓ Geçerlilik Bitiş Tarihi: 25 Eylül 2026\n\nPanele gitmek ve ilk ihalenizi oluşturmak için: https://gelanlasalim-v2.vercel.app/panel\n\nSaygılarımızla,\nİhaleciBurada Müşteri Başarı Ekibi\nihalecib@gmail.com | 0850 308 00 00`
      },
      {
        id: 'new-tender',
        name: '📢 Yeni İhale Yayınlandı Bildirimi',
        subject: 'Yeni İhale Yayında: Sektörünüze Uygun Yeni Bir Satın Alma İlanı Açıldı',
        content: `Sayın Tedarikçimiz,\n\nFaaliyet alanınıza uygun yeni bir B2B satın alma ihalesi yayına alınmıştır.\n\nİhale Başlığı: [İhale Başlığı]\nKategori: [Sektör / Kategori]\nKalan Süre: [Kalan Süre]\n\nŞartnameyi incelemek ve teklifinizi iletmek için hemen tıklayın:\nhttps://gelanlasalim-v2.vercel.app/panel/gelen-teklifler\n\nİhaleciBurada B2B Operasyon Merkezi\nihalecib@gmail.com`
      },
      {
        id: 'live-auction',
        name: '⚡ Canlı Tersine Eksiltme Başladı & Teklif Uyarısı',
        subject: 'Canlı Eksiltme Başladı: İhalede Fiyatlar Düşüyor!',
        content: `Sayın İhale Katılımcısı,\n\nKayıt olduğunuz ihalenin CANLI TERSİNE EKSİLTME (Canlı Pazarlık) seansı başlamıştır.\n\nAnlık Lider Teklif: [Lider Fiyat]\nKalan Süre: [Süre]\n\nCanlı odaya bağlanmak ve yeni teklifinizi vermek için:\nhttps://gelanlasalim-v2.vercel.app/panel/canli-etkinlikler\n\nBol kazançlı ihaleler dileriz,\nİhaleciBurada.com`
      },
      {
        id: 'kyc-approved',
        name: '🛡️ Kurumsal Firma Doğrulama & KYC Onayı',
        subject: 'Firma Belgeleriniz Doğrulandı — Mavi Rozetiniz Aktif!',
        content: `Tebrikler!\n\nYüklemiş olduğunuz vergi levhası ve ticaret sicil belgeleri uzmanlarımız tarafından incelenmiş ve onaylanmıştır.\n\nProfilinize 'DOĞRULANMIŞ KURUMSAL ÜRETİCİ / ALICI' mavi rozeti eklenmiştir.\n\nİhaleciBurada Güvenlik ve Uyumluluk Departmanı\nihalecib@gmail.com`
      },
      {
        id: 'weekly-digest',
        name: '📊 Haftalık B2B İhale ve Tasarruf Bülteni',
        subject: 'Haftalık B2B Tedarik Özeti: 12.4M ₺ Hacim ve Öne Çıkan İhaleler',
        content: `Bu hafta İhaleciBurada'da gerçekleşen öne çıkan ihaleler ve ortalama %14.2 tasarruf fırsatları bülteninizde!\n\nAktif İhale Sayısı: 48+\nTamamlanan İşlem Hacmi: 12.4M ₺+\n\nTüm güncel fırsatları listelemek için: https://gelanlasalim-v2.vercel.app/pazar-yeri\n\nİhaleciBurada B2B Bülten\nihalecib@gmail.com`
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
      phone: '0850 308 00 00',
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
    { id: 'kat-1', name: 'İnşaat, Yapı & Şantiye', icon: 'Building2', targetSavings: '%16.5', activeTendersCount: 14, description: 'Demir, çimento, hazır beton, yalıtım ve kaba inşaat malzemeleri.' },
    { id: 'kat-2', name: 'Makine, Yedek Parça & Metal', icon: 'Wrench', targetSavings: '%14.2', activeTendersCount: 18, description: 'CNC fason talaşlı imalat, torna, sac işleme ve hidrolik aksam.' },
    { id: 'kat-3', name: 'Akaryakıt, Enerji & Madeni Yağ', icon: 'Fuel', targetSavings: '%11.8', activeTendersCount: 9, description: 'Toptan motorin, benzin, sanayi elektriği ve endüstriyel madeni yağ.' },
    { id: 'kat-4', name: 'Ambalaj, Koli & Plastik', icon: 'Package', targetSavings: '%18.0', activeTendersCount: 12, description: 'Oluklu mukavva koli, streç film, palet ve esnek ambalaj ürünleri.' },
    { id: 'kat-5', name: 'Lojistik, Nakliye & Depolama', icon: 'Truck', targetSavings: '%15.4', activeTendersCount: 11, description: 'Yurt içi komple tır, parsiyel sevkiyat, antrepo ve soğuk hava depolama.' },
    { id: 'kat-6', name: 'Kırtasiye, Ofis & Teknoloji', icon: 'Laptop', targetSavings: '%21.0', activeTendersCount: 8, description: 'Fotokopi kağıdı, toner, bilgisayar donanımı ve ofis mobilyası.' }
  ],
  promoCodes: [
    { code: 'LANSMAN1AY', discountType: 'free_trial_months', value: '1 Ay Bedelsiz', usageLimit: 1000, usedCount: 142, expiryDate: '25 Eylül 2026', status: 'active' },
    { code: 'LANSMAN20', discountType: 'percent_discount', value: '%20 İndirim', usageLimit: 500, usedCount: 45, expiryDate: '31 Aralık 2026', status: 'active' },
    { code: 'VIP2026', discountType: 'percent_discount', value: '%100 İndirim', usageLimit: 250, usedCount: 38, expiryDate: '31 Aralık 2026', status: 'active' },
    { code: 'B2BTASARRUF', discountType: 'fixed_amount', value: '1.000 ₺ Kredi', usageLimit: 500, usedCount: 89, expiryDate: '01 Ocak 2027', status: 'active' }
  ],
  auditLogs: [
    { id: 'LOG-9912', timestamp: '2026-08-23 02:10:14', userEmail: 'admin@ihaleciburada.com', action: 'Yönetici Girişi Yapıldı', ipAddress: '176.240.12.84', status: 'success', details: 'TLS 1.3 şifreli oturum başlatıldı.' },
    { id: 'LOG-9911', timestamp: '2026-08-22 23:05:42', userEmail: 'admin@ihaleciburada.com', action: 'WhatsApp & AI Ayarları Güncellendi', ipAddress: '176.240.12.84', status: 'success', details: 'Numara: 908503080000 olarak kaydedildi.' },
    { id: 'LOG-9910', timestamp: '2026-08-22 22:58:19', userEmail: 'admin@ihaleciburada.com', action: '1 Ay Lansman Planı Yayına Alındı', ipAddress: '176.240.12.84', status: 'success', details: '0 TL bedelsiz deneme paketi aktif edildi.' },
    { id: 'LOG-9909', timestamp: '2026-08-22 21:40:05', userEmail: 'sistem@ihaleciburada.com', action: 'Otomatik Veritabanı Yedeği Alındı', ipAddress: '127.0.0.1', status: 'success', details: 'JSON veri yedeği disk alanına arşivlendi.' },
    { id: 'LOG-9908', timestamp: '2026-08-22 19:15:33', userEmail: 'ahmet@kalyon.com', action: 'KYC Belgesi Yüklendi', ipAddress: '88.241.90.11', status: 'warning', details: 'Vergi levhası inceleme kuyruğuna alındı.' }
  ],
  siteSettings: {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı altyapı güçlendirme çalışması yapılmaktadır. Sistem en kısa sürede tekrar aktif olacaktır.',
    metaTitle: 'İhaleciBurada.com | Türkiye’nin Öncü B2B Canlı Eksiltme & Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, canlı tersine eksiltme ile rekabetçi teklifler toplayın, kurumsal tedarik maliyetlerinizi %14.2 düşürün.',
    announcementTicker: '⚡ LANSMANA ÖZEL: Tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi! Kredi kartı gerekmez, 0 ₺ bedelsiz anında aktivasyon.',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 308 00 00',
    supportEmail: 'ihalecib@gmail.com',
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
        // If saved data contains any legacy English or outdated schema, purge and overwrite with pure Turkish default
        if (str.includes('how does') || str.includes('private sector') || str.includes('construction') || str.includes('procurement') || str.includes('technology') || str.includes('electronics')) {
          cmsDataRef.value = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA))
          localStorage.setItem('cmsData', JSON.stringify(DEFAULT_CMS_DATA))
        } else {
          cmsDataRef.value = JSON.parse(saved)
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
