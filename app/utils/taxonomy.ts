// app/utils/taxonomy.ts
// İhaleciBurada B2B E-İhale ve Tedarik Pazaryeri Standart Taksonomisi

export const ALL_81_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
];

/**
 * 🌐 Güvenli Harici URL Temizleyici & Normalleştirici
 * Kullanıcı "www.site.com", "site.com" veya "http//site.com" girse bile 
 * başına eksiksiz "https://" ekler ve relative link hatalarını (404) önler.
 */
export function sanitizeExternalUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return ''
  let cleaned = url.trim()
  if (!cleaned || cleaned === '#' || cleaned === '/' || cleaned.toLowerCase() === 'http://' || cleaned.toLowerCase() === 'https://') return ''
  // Başta hatalı girilen http://, https://, http//, https//, http:/, https:/ temizle
  cleaned = cleaned.replace(/^https?:?\/{0,2}/i, '')
  if (!cleaned) return ''
  return `https://${cleaned}`
}


export const ALL_40_CATEGORIES = [
  { id: 99, name: 'Diğer İhale ve İlanlar', short: 'Diğer', icon: '✨', orderRank: 1 },
  { id: 41, name: 'Konut / Ev', short: 'Konut / Ev', icon: '🏠', orderRank: 2 },
  { id: 42, name: 'Arsa / Arazi', short: 'Arsa / Arazi', icon: '🗺️', orderRank: 2.1 },
  { id: 43, name: 'İşyeri / Ticari Gayrimenkul', short: 'İşyeri & Ticari', icon: '🏢', orderRank: 2.2 },
  { id: 44, name: 'Bina', short: 'Bina', icon: '🏬', orderRank: 2.3 },
  { id: 45, name: 'Turizm Tesisi', short: 'Turizm Tesisi', icon: '🏨', orderRank: 2.4 },
  { id: 46, name: 'Özel Amaçlı Gayrimenkul', short: 'Özel Amaçlı', icon: '🏛️', orderRank: 2.5 },
  { id: 40, name: 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri', short: 'Emlak & Gayrimenkul (Genel)', icon: '🏢', orderRank: 2.6 },
  { id: 1, name: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri', short: 'İnşaat & Altyapı', icon: '🏗️', orderRank: 3 },
  { id: 3, name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri', short: 'Tarım & Gıda', icon: '🌾', orderRank: 4 },
  { id: 2, name: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri', short: 'Sağlık & Medikal', icon: '💊', orderRank: 5 },
  { id: 29, name: 'Hazır Yemek - Lokantacılık İhaleleri', short: 'Hazır Yemek & İkram', icon: '🍽️', orderRank: 6 },
  { id: 32, name: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri', short: 'Temizlik & Geri Dönüşüm', icon: '🧹', orderRank: 7 },
  { id: 10, name: 'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri', short: 'Nakliye & Lojistik', icon: '🚚', orderRank: 8 },
  { id: 35, name: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri', short: 'Özel Güvenlik', icon: '👮', orderRank: 9 },
  { id: 7, name: 'Akaryakıt - Gazyağı - Madeni Yağ İhaleleri', short: 'Akaryakıt & Madeni Yağ', icon: '⛽', orderRank: 10 },
  { id: 9, name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri', short: 'Yazılım & Bilişim', icon: '💻', orderRank: 11 },
  { id: 6, name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri', short: 'Enerji & Elektrik', icon: '⚡', orderRank: 12 },
  { id: 22, name: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri', short: 'Taşıt & İş Makinesi', icon: '🚜', orderRank: 13 },
  { id: 4, name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları İhaleleri', short: 'Tıbbi Cihaz & Hastane', icon: '🩺', orderRank: 14 },
  { id: 8, name: 'Endüstriyel Makine - Motor - Konveyör İhaleleri', short: 'Endüstriyel Makine', icon: '⚙️', orderRank: 15 },
  { id: 11, name: 'Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri', short: 'Mobilya & Ofis', icon: '🪑', orderRank: 16 },
  { id: 15, name: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri', short: 'Matbaa & Kırtasiye', icon: '📦', orderRank: 17 },
  { id: 12, name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri', short: 'Hırdavat & Metal', icon: '🔩', orderRank: 18 },
  { id: 33, name: 'Tekstil - Giyim - Spor Ekipmanları İhaleleri', short: 'Tekstil & Giyim', icon: '👕', orderRank: 19 },
  { id: 34, name: 'İş Sağlığı - İş Güvenliği ve Ekipmanları İhaleleri', short: 'İş Sağlığı & Güvenliği', icon: '⛑️', orderRank: 20 },
  { id: 17, name: 'Mühendislik - Mimarlık - Danışmanlık İhaleleri', short: 'Mühendislik & Mimarlık', icon: '📐', orderRank: 21 },
  { id: 20, name: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı İhaleleri', short: 'Klima & Havalandırma', icon: '❄️', orderRank: 22 },
  { id: 5, name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri', short: 'Kanalizasyon & Su', icon: '🚰', orderRank: 23 },
  { id: 13, name: 'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri', short: 'Yangın & Güvenlik', icon: '🧯', orderRank: 24 },
  { id: 14, name: 'Kimyasal Maddeler - Dezenfektan - Gübre İhaleleri', short: 'Kimyasal & Gübre', icon: '🧪', orderRank: 25 },
  { id: 30, name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar İhaleleri', short: 'Elektronik & Bilgisayar', icon: '🖥️', orderRank: 26 },
  { id: 24, name: 'Reklam - Tabela - Billboard - Tanıtım Materyalleri İhaleleri', short: 'Reklam & Tanıtım', icon: '📢', orderRank: 27 },
  { id: 25, name: 'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri', short: 'Ormancılık & Peyzaj', icon: '🌲', orderRank: 28 },
  { id: 36, name: 'Eğitim - Araştırma - Anket - Tercümanlık İhaleleri', short: 'Eğitim & Tercümanlık', icon: '📚', orderRank: 29 },
  { id: 23, name: 'Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri', short: 'Turizm & Organizasyon', icon: '🎪', orderRank: 30 },
  { id: 19, name: 'Asansör - Yapı Otomasyon - Mekanik Güvenlik İhaleleri', short: 'Asansör & Otomasyon', icon: '🛗', orderRank: 31 },
  { id: 39, name: 'Menkul Mallar - Araç Satışı ve Hurda İhaleleri', short: 'Araç & Hurda Satışı', icon: '🚗', orderRank: 32 },
  { id: 16, name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama İhaleleri', short: 'Kent Mobilyaları', icon: '🏙️', orderRank: 33 },
  { id: 26, name: 'Hayvancılık - Veterinerlik - Hayvan Yemi İhaleleri', short: 'Hayvancılık & Yem', icon: '🐄', orderRank: 34 },
  { id: 38, name: 'Sigortacılık - Mali ve Hukuki Hizmetler İhaleleri', short: 'Sigorta & Finans', icon: '⚖️', orderRank: 35 },
  { id: 37, name: 'İşletmecilik - İşçilik - Sosyal Hizmetler İhaleleri', short: 'İşletmecilik & Hizmet', icon: '🤝', orderRank: 36 },
  { id: 18, name: 'Madencilik - Doğal Kaynaklar - Sondaj İhaleleri', short: 'Madencilik & Sondaj', icon: '⛏️', orderRank: 37 },
  { id: 21, name: 'Savunma Sanayi, Silah - Denizcilik - Havacılık İhaleleri', short: 'Savunma & Havacılık', icon: '🛡️', orderRank: 38 },
  { id: 31, name: 'Uydu Takip - Kamera - Scada - Haberleşme Sistemleri İhaleleri', short: 'Kamera & Güvenlik', icon: '📹', orderRank: 39 },
  { id: 28, name: 'Odun - Kömür - Katıyakıt İhaleleri', short: 'Odun & Kömür', icon: '🪵', orderRank: 40 },
  { id: 27, name: 'Sanat Eserleri - Müzik Aletleri - Heykel - Maket İhaleleri', short: 'Sanat & Heykel', icon: '🎨', orderRank: 41 }
];

export const CATEGORY_SUBCATEGORIES_MAP: Record<number, string[]> = {
  1: ['Bina Yapımı & Taahhüt', 'Yol, Köprü & Viyadük', 'Hafriyat, Kazı & Dolgu', 'Çelik Konstrüksiyon', 'Prefabrik Yapılar', 'İzolasyon & Su Yalıtımı', 'Boya, Sıva & Alçıpan', 'Tadilat & Restorasyon'],
  2: ['Tıbbi Cihaz & Sarf Malzemeleri', 'İlaç & Serum Tedariği', 'Laboratuvar Kitleri & Reaktifler', 'Ortopedi & Protez Ürünleri', 'Kişisel Koruyucu Hijyen', 'Dental & Diş Sağlığı'],
  3: ['Kuru Gıda, Bakliyat & Hububat', 'Et, Tavuk & Şarküteri', 'Süt & Süt Ürünleri', 'Sebze & Meyve Toptan', 'Un, Şeker & Yağ', 'Konserve, Salça & Sos', 'Dondurulmuş Gıda'],
  4: ['Görüntüleme & Radyoloji (MR, CT)', 'Hasta Başı Monitörleri', 'Cerrahi El Aletleri', 'Sterilizatör & Otoklav', 'Hastane Yatağı & Mobilyası', 'Laboratuvar Analiz Cihazları'],
  5: ['Kanalizasyon & Altyapı Boruları', 'İçme Suyu Şebekesi', 'Doğalgaz Boru & Tesisatı', 'Sıhhi Tesisat & Armatürler', 'Pompalar & Hidroforlar', 'Vana, Sayaç & Ek Parçalar'],
  6: ['Güneş Enerjisi (GES) Sistemleri', 'Trafo, Pano & Kablolar', 'Sokak & Çevre Aydınlatma', 'İç Mekan LED Aydınlatma', 'Jeneratör & Kesintisiz Güç Kaynağı', 'Elektrik Tesisat Malzemeleri'],
  7: ['Motorin & Mazot Alımı', 'Kurşunsuz Benzin', 'Madeni Yağ & Gres', 'LPG & Otogaz', 'Gazyağı & Özel Yakıtlar'],
  8: ['CNC & Takım Tezgahları', 'Kompresör & Basınçlı Hava', 'Konveyör & Bant Sistemleri', 'Endüstriyel Motor & Redüktör', 'Paketleme & Dolum Makineleri', 'Hidrolik & Pnömatik Aksam'],
  9: ['Özel Yazılım Geliştirme', 'ERP & Kurumsal Yazılımlar', 'Bulut Sunucu & Hosting', 'Siber Güvenlik & Firewall', 'Veri Tabanı & Yedekleme', 'Mobil Uygulama Geliştirme'],
  10: ['Şehirlerarası Karayolu Nakliye', 'Personel & Öğrenci Servis Taşımacılığı', 'Denizyolu & Konteyner', 'Havayolu Kargo', 'Depolama & Lojistik Dağıtım', 'Soğuk Hava Zinciri Taşımacılığı'],
  11: ['Ofis & Büro Mobilyaları', 'Mutfak Ekipmanları & Endüstriyel Mutfak', 'Beyaz Eşya & Ankastre', 'Otel & Yurt Mobilyaları', 'Depo & Arşiv Raf Sistemleri', 'Züccaciye & Porselen'],
  12: ['Civata, Somun & Bağlantı Elemanları', 'El Aletleri & Güç Aletleri', 'Sac, Profil & Demir Ürünleri', 'Plastik Hammadde & Boru', 'Kilit, Menteşe & Nalburiye', 'Boya Tabancası & Aşındırıcılar'],
  13: ['Yangın Algılama & İhbar Panelleri', 'Otomatik Sprinkler Söndürme', 'Yangın Tüpleri & Dolapları', 'Davlumbaz Söndürme Sistemleri', 'Gazlı Söndürme (FM200)', 'Yangın Kapıları & Kaçış Donanımları'],
  14: ['Endüstriyel Kimyasallar', 'Tarımsal Gübreler & Zirai İlaç', 'Su Şartlandırma Kimyasalları', 'Yüzey Temizleme Kimyasalları', 'Havuz Kimyasalları', 'Laboratuvar Saf Kimyasalları'],
  15: ['Ofset & Dijital Matbaa Baskısı', 'Orijinal & Muadil Toner/Kartuş', 'Koli, Karton Kutu & Ambalaj', 'Kağıt, Fotokopi & Kırtasiye', 'Etiket, Barkod & Ribon', 'Promosyon Ürünleri & Baskı'],
  16: ['Park & Bahçe Kent Mobilyaları', 'Prefabrik Şantiye & Ofis Yapıları', 'Alüminyum & PVC Doğrama', 'Otobüs Durağı & Kamelya', 'Çocuk Oyun Parkı Ekipmanları', 'Güvenlik Kulübeleri'],
  17: ['Statik & Betonarme Projelendirme', 'Mimari Tasarım & 3D Modelleme', 'Zemin Etüdü & Geoteknik', 'Mekanik & Elektrik Proje Çizimi', 'Harita & İmar Danışmanlığı', 'Teknik Müşavirlik & Kontrollük'],
  18: ['Sondaj & Kuyu Açma Hizmetleri', 'Mermer, Granit & Taş Ocakları', 'Maden Çıkarma & Kırma-Eleme', 'Kömür & Linyit Ocak İşletmeciliği', 'Jeolojik Etüt & Rezerv Tespiti'],
  19: ['Yolcu & Yük Asansörleri', 'Yürüyen Merdiven & Bantlar', 'Bina Otomasyon Sistemleri (BMS)', 'Otomatik Kapı & Bariyer Sistemleri', 'Asansör Periyodik Bakım & Revizyon'],
  20: ['Merkezi VRF/VRV Klima Sistemleri', 'Chiller Soğutma Grupları', 'Havalandırma Kanalları & Menfezler', 'Kazan Dairesi & Isıtma Tesisatı', 'Hassas Kontrollü Sistem Klimaları', 'Rooftop Paket Klimalar'],
  21: ['Savunma Elektroniği & İletişim', 'Deniz Araçları & Bot Bakım-Onarım', 'Havacılık Yedek Parça & Sarf', 'Askeri Üniforma & Taktik Donanım', 'Balistik Koruyucu Yelek & Kask'],
  22: ['Binek & Ticari Araç Alımı', 'İş Makinesi Alım & Kiralama', 'Otomotiv Orijinal Yedek Parça', 'Kamyon, Çekici & Dorse', 'Lastik, Akü & Filtre Setleri', 'Araç Periyodik Bakım & Onarım'],
  23: [
    'Düğün, Nişan, Kına & Nikah Organizasyonu',
    'Evlilik Teklifi & Doğum Günü Organizasyonları',
    'Toplu Yeme-İçme & İftar Organizasyonları',
    'Konser, Festival, Sahne & Müzik Organizasyonları',
    'Hac ve Umre Organizasyon Paketleri',
    'Kültür, Doğa & Gezi Turları',
    'Kurumsal Kongre, Seminer, Fuar & Lansman',
    'Catering & Açık Büfe İkram Hizmetleri',
    'Ses, Işık, Truss & Sahne Sistemleri Kiralama'
  ],
  24: ['Işıklı & Işıksız Tabela', 'Billboard & Raket Reklam Üniteleri', 'Totem & Yönlendirme Panoları', 'Araç Giydirme & Cephe Kaplama', 'Fuar Standı Tasarım & Kurulumu', 'Dijital LED Ekran Sistemleri'],
  25: ['Peyzaj Proje & Uygulama', 'Otomatik Bahçe Sulama Sistemleri', 'Ağaçlandırma & Fidan Dikimi', 'Rulo Çim & Çimlendirme', 'Mevsimlik Çiçek & Süs Bitkileri', 'Budama, Çim Biçme & Bakım'],
  26: ['Büyükbaş & Küçükbaş Besi Yemi', 'Kanatlı Yemi & Premiks', 'Veteriner Aşı & İlaçları', 'Sağım & Ahır Ekipmanları', 'Canlı Hayvan Alım & Satımı', 'Suni Tohumlama Malzemeleri'],
  27: ['Bronz, Mermer & Fiber Heykel Yapımı', 'Mimari & Şehir Maketleri', 'Müzik Aletleri & Ses Teçhizatı', 'Geleneksel El Sanatları & Rölyef', 'Dekoratif Sanat Panoları'],
  28: ['Sanayi & Isınma Kömürü', 'Pelet & Briket Yakıtı', 'Odun & Odun Briketi', 'Kok Kömürü & Biyokütle Yakıt'],
  29: ['Toplu Tabldot Yemek Üretimi', 'Özel Davet & Protokol İkramları', 'Kumanya & Sandviç Paketleri', 'Kantin & Kafeterya İşletmeciliği', 'Hastane & Okul Diyet Menüleri'],
  30: ['Masaüstü PC & İş İstasyonları', 'Dizüstü Bilgisayar (Laptop)', 'Sunucu (Server) & Storage', 'Ağ Anahtarı (Switch) & Router', 'Lazer Yazıcı & Fotokopi Makineleri', 'Ölçü Aletleri (Multimetre, Osiloskop)'],
  31: ['IP Güvenlik Kamerası & NVR Sistemleri', 'Araç Takip & Filo Yönetimi GPS', 'SCADA & Uzaktan İzleme Telemetri', 'Telsiz & Trunk Haberleşme', 'Plaka Tanıma (PTS) Sistemleri'],
  32: [
    'Bina, Tesis & Ofis Temizliği',
    'Hastane & Sağlık Kuruluşu Hijyen Temizliği',
    'Okul, Üniversite & Yurt Temizliği',
    'Endüstriyel Fabrika & Atölye Temizliği',
    'Dış Cephe & Cam Temizleme',
    'Haşere & Kemirgen İlaçlama (Pest Kontrol)',
    'Dezenfeksiyon & Sterilizasyon Hizmetleri',
    'Geri Dönüşüm, Hurda & Atık Yönetimi',
    'Çöp Toplama & Katı Atık Nakliyesi'
  ],
  33: ['Kurumsal İş Kıyafetleri & Tulum', 'Güvenlik Görevlisi Üniformaları', 'Spor Kıyafetleri & Formalar', 'İş Ayakkabısı, Çizme & Çelik Burun', 'Termal İçlik & Yağmurluk', 'Spor Malzemeleri & Saha Donanımları'],
  34: ['Baret, Emniyet Kemeri & Yaşam Hattı', 'Koruyucu Gözlük & Kulaklık', 'Solunum Maskeleri (FFP2/FFP3/Gaz)', 'Yanmaz & Antistatik İş Elbiseleri', 'İlk Yardım & Acil Müdahale Dolapları', 'İSG Uyarı & İkaz Levhaları'],
  35: ['Silahlı & Silahsız Özel Güvenlik', 'Tesis & Şantiye Bekçilik Hizmeti', 'VIP Yakın Koruma & Refakat', 'Etkinlik & Konser Güvenliği', 'X-Ray & Kapı Dedektörü Operatörlüğü'],
  36: ['Yeminli Tercüme & Çeviri Hizmetleri', 'Kurumsal Personel Eğitimleri', 'Piyasa Araştırması & Anket Hizmeti', 'Mesleki Yeterlilik & Sertifikasyon', 'Akademik & Stratejik Raporlama'],
  37: ['Sosyal Tesis & Misafirhane İşletmeciliği', 'Danışma, Karşılama & Resepsiyon Hizmeti', 'Bina & Site Yönetim Hizmetleri', 'Bordrolama & Destek Personeli Temini', 'Posta, Evrak Dağıtım & Kurye'],
  38: ['Filo Kasko & Trafik Sigortası', 'Yangın & Deprem (DASK) Sigortası', 'Grup Sağlık & Ferdi Kaza Sigortası', 'Mali Müşavirlik & Bağımsız Denetim', 'Hukuki Danışmanlık & Tahkim'],
  39: ['Hacizli & Kurum İkinci El Araç Satışı', 'Hurda Demir, Bakır & Alüminyum', 'Hurda Kağıt, Karton & Plastik', 'Kullanım Dışı Elektronik Hurda (E-Atık)', 'Ekonomik Ömrünü Tamamlamış Taşıt Satışı'],
  41: [
    'Daire',
    'Müstakil Ev',
    'Villa',
    'İkiz Villa',
    'Yazlık',
    'Rezidans',
    'Çiftlik Evi',
    'Köy Evi',
    'Yalı',
    'Yalı Dairesi'
  ],
  42: [
    'Konut İmarlı Arsa',
    'Ticaret İmarlı Arsa',
    'Konut + Ticaret İmarlı Arsa',
    'Turizm İmarlı Arsa',
    'Sanayi İmarlı Arsa',
    'Tarla',
    'Bağ',
    'Bahçe',
    'Zeytinlik',
    'İmarsız Arazi'
  ],
  43: [
    'Dükkân',
    'Mağaza',
    'Ofis',
    'Büro',
    'Depo',
    'Atölye',
    'Fabrika',
    'İmalathane',
    'Plaza',
    'İş Hanı',
    'Alışveriş Merkezi'
  ],
  44: [
    'Apartman',
    'Ticari Bina',
    'Karma Kullanımlı Bina',
    'Müstakil Bina'
  ],
  45: [
    'Otel',
    'Butik Otel',
    'Pansiyon',
    'Apart Otel',
    'Tatil Köyü',
    'Kamp Alanı',
    'Günübirlik Tesis'
  ],
  46: [
    'Akaryakıt İstasyonu',
    'Otopark',
    'Özel Okul',
    'Öğrenci Yurdu',
    'Sağlık Tesisi',
    'Spor Tesisi',
    'Tarımsal İşletme'
  ],
  40: [
    'Konut / Ev',
    'Arsa / Arazi',
    'İşyeri & Ticari Gayrimenkul',
    'Bina',
    'Turizm Tesisi',
    'Özel Amaçlı Gayrimenkul',
    'Kantin & Kafeterya',
    'Diğer'
  ],
  99: ['Genel İlanlar', 'Özel Talep & Teklifler', 'Serbest Piyasa İlanları', 'Diğer Satış ve Kiralama', 'Diğer']
};

/**
 * 🏡 Emlak / Gayrimenkul Standart İşlem Türleri, Teklif Yöntemleri ve İlan Veren Tanımları
 * Satılık ve Kiralık alt kategori DEĞİLDİR; İşlem Türü olarak yönetilir.
 */
export const REAL_ESTATE_TRANSACTION_TYPES = [
  'Satılık',
  'Kiralık',
  'Devren Satılık',
  'Devren Kiralık',
  'Kat Karşılığı'
] as const;

export const REAL_ESTATE_BID_METHODS = [
  'Sabit Fiyat',
  'Teklif Al',
  'Açık Artırma'
] as const;

export const REAL_ESTATE_SELLER_TYPES = [
  'Sahibinden',
  'Emlak Ofisinden',
  'İnşaat Firmasından',
  'Kurumdan'
] as const;

export const TENDER_TYPES = [
  'Tümü',
  'Mal Alımı',
  'Hizmet Alımı',
  'Yapım İşi (İnşaat)',
  'Danışmanlık',
  'Satış & Kiralama'
];

export const TENDER_METHODS = [
  'Tümü',
  'Açık Eksiltme (Ters İhale)',
  'Açık Artırma',
  'Kapalı Zarf Usulü',
  'Sabit Fiyatlı Paket & Kontenjan',
  'İhalesiz İlan (Net Fiyat)',
  'Doğrudan Temin / Fiyat Araştırması',
  'Pazarlık Usulü'
];

export const COMMON_TAX_OFFICES = [
  'Çanakkale Vergi Dairesi Müdürlüğü',
  'İstanbul Büyük Mükellefler Vergi Dairesi',
  'İstanbul Beşiktaş Vergi Dairesi',
  'İstanbul Kadıköy Vergi Dairesi',
  'Ankara Kızılbey Vergi Dairesi',
  'Ankara Çankaya Vergi Dairesi',
  'İzmir Kordon Vergi Dairesi',
  'İzmir Konak Vergi Dairesi',
  'Bursa Osmangazi Vergi Dairesi',
  'Balıkesir Karesi Vergi Dairesi',
  'Kocaeli Alemdar Vergi Dairesi',
  'Gaziantep Şahinbey Vergi Dairesi',
  'Antalya Muratpaşa Vergi Dairesi',
  'Adana Seyhan Vergi Dairesi',
  'Konya Mevlana Vergi Dairesi',
  'Tekirdağ Süleymanpaşa Vergi Dairesi'
];

/**
 * Normalizes text for Turkish-aware, punctuation-insensitive keyword comparison.
 */
function normTr(str: string): string {
  return (str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/['".,/\\()\-&|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Category-specific keyword heuristics for robust B2B classification
 */
const CATEGORY_KEYWORDS: Record<number, string[]> = {
  1: ['inşaat', 'yapım', 'altyapı', 'üstyapı', 'bina yapımı', 'yıkım', 'demir', 'çelik', 'hafriyat', 'şantiye', 'beton', 'restorasyon', 'tadilat', 'çatı', 'mantolama'],
  2: ['sağlık', 'medikal', 'ilaç', 'serum', 'hastane', 'doktor', 'eczane', 'hijyen'],
  3: ['gıda', 'tarım', 'yiyecek', 'içecek', 'bakliyat', 'hububat', 'un', 'şeker', 'yağ', 'toptan gıda', 'pirinç', 'mercimek'],
  4: ['tıbbi cihaz', 'laboratuvar', 'hastane ekipman', 'monitör', 'cerrahi', 'otoklav', 'mr', 'röntgen'],
  5: ['kanalizasyon', 'su şebeke', 'boru', 'doğalgaz', 'sıhhi tesisat', 'vana', 'pompa', 'drenaj'],
  6: ['enerji', 'elektrik', 'aydınlatma', 'ges', 'güneş enerji', 'trafo', 'jeneratör', 'sinyalizasyon'],
  7: ['akaryakıt', 'motorin', 'mazot', 'benzin', 'madeni yağ', 'gazyağı', 'lpg', 'otogaz', 'yakıt'],
  8: ['makine', 'cnc', 'kompresör', 'konveyör', 'motor', 'redüktör', 'dolum', 'paketleme', 'takım tezgah'],
  9: ['yazılım', 'bilişim', 'bilgi yönetim', 'erp', 'crm', 'bulut', 'sunucu', 'siber', 'yazılım geliştirme'],
  10: ['nakliye', 'taşımacılık', 'lojistik', 'servis', 'kargo', 'antrepo', 'tır', 'konteyner', 'depolama', 'kara nakliye'],
  11: ['mobilya', 'ofis', 'büro', 'beyaz eşya', 'mutfak', 'züccaciye', 'masa', 'koltuk', 'dolap'],
  12: ['hırdavat', 'nalburiye', 'metal', 'plastik', 'civata', 'vida', 'sac', 'profil', 'profil demir'],
  13: ['yangın', 'söndürme', 'ihbar', 'sprinkler', 'yangın tüp', 'yangın kapısı'],
  14: ['kimyasal', 'gübre', 'dezenfektan', 'zirai ilaç', 'su şartlandırma'],
  15: ['matbaa', 'kırtasiye', 'toner', 'kartuş', 'ambalaj', 'koli', 'baskı', 'kağıt', 'ofset'],
  16: ['kent mobilyaları', 'prefabrik', 'kamelya', 'bank', 'otobüs durağı', 'oyun parkı'],
  17: ['mühendislik', 'mimarlık', 'danışmanlık', 'statik', 'proje çizim', 'zemin etüdü', 'müşavirlik'],
  18: ['madencilik', 'hammadde', 'sondaj', 'mermer', 'maden', 'kömür', 'taş ocak', 'granit'],
  19: ['asansör', 'otomasyon', 'yürüyen merdiven', 'bina otomasyon', 'bms'],
  20: ['klima', 'soğutma', 'ısıtma', 'havalandırma', 'vrf', 'vrv', 'chiller', 'menfez'],
  21: ['savunma', 'silah', 'denizcilik', 'havacılık', 'askeri', 'taktik', 'balistik'],
  22: ['taşıt', 'iş makinesi', 'araç', 'ekskavatör', 'kamyon', 'binek', 'yedek parça', 'loder', 'kepçe', 'kiralama', 'çekici', 'iş makinesi kiralama'],
  23: ['turizm', 'organizasyon', 'etkinlik', 'kongre', 'fuar', 'ödüllendirme', 'otel'],
  24: ['reklam', 'tabela', 'billboard', 'tanıtım', 'totem', 'led ekran'],
  25: ['peyzaj', 'bahçe', 'ormancılık', 'bitki', 'sulama', 'rulo çim', 'ağaç', 'fidan', 'bahçıvanlık', 'otomatik sulama'],
  26: ['hayvancılık', 'yem', 'veteriner', 'canlı hayvan', 'besi', 'küçükbaş', 'büyükbaş'],
  27: ['sanat', 'heykel', 'müzik', 'maket', 'rölyef'],
  28: ['odun', 'kömür', 'katıyakıt', 'pelet', 'briket'],
  29: ['hazır yemek', 'lokantacılık', 'tabldot', 'catering', 'toplu yemek', 'öğle yemeği', 'ikram'],
  30: ['elektronik', 'bilgisayar', 'laptop', 'ölçü aletleri', 'switch', 'router', 'multimetre'],
  31: ['kamera', 'güvenlik kamera', 'scada', 'gps', 'takip', 'telsiz', 'nvr', 'pts'],
  32: ['temizlik', 'ilaçlama', 'geri dönüşüm', 'hijyen', 'pest kontrol', 'atık', 'çöp', 'bina temizliği', 'dezenfeksiyon'],
  33: ['tekstil', 'giyim', 'iş kıyafet', 'üniforma', 'ayakkabı', 'tulum'],
  34: ['isg', 'iş sağlığı', 'iş güvenliği', 'baret', 'emniyet kemeri', 'koruyucu'],
  35: ['özel güvenlik', 'koruma', 'bekçilik', 'güvenlik görevlisi', 'tesis güvenlik'],
  36: ['eğitim', 'tercümanlık', 'çeviri', 'anket', 'araştırma'],
  37: ['işletmecilik', 'işçilik', 'sosyal hizmetler', 'tesis yönetim', 'resepsiyon'],
  38: ['sigorta', 'mali', 'hukuki', 'kasko', 'dask', 'denetim'],
  39: ['araç satış', 'hurda', 'menkul mal', 'hurda demir'],
  41: ['konut', 'ev', 'daire', 'müstakil ev', 'villa', 'ikiz villa', 'yazlık', 'rezidans', 'çiftlik evi', 'köy evi', 'yalı', 'yalı dairesi'],
  42: ['arsa', 'arazi', 'konut imarlı', 'ticaret imarlı', 'turizm imarlı', 'sanayi imarlı', 'tarla', 'bağ', 'bahçe', 'zeytinlik', 'imarsız arazi', 'ada', 'parsel'],
  43: ['işyeri', 'ticari', 'dükkan', 'dükkân', 'mağaza', 'ofis', 'büro', 'depo', 'atölye', 'fabrika', 'imalathane', 'plaza', 'iş hanı', 'alışveriş merkezi', 'avm'],
  44: ['bina', 'apartman', 'ticari bina', 'karma kullanımlı bina', 'müstakil bina'],
  45: ['turizm', 'otel', 'butik otel', 'pansiyon', 'apart otel', 'tatil köyü', 'kamp alanı', 'günübirlik tesis'],
  46: ['özel amaçlı', 'akaryakıt istasyonu', 'benzinlik', 'otopark', 'özel okul', 'öğrenci yurdu', 'sağlık tesisi', 'spor tesisi', 'tarımsal işletme'],
  40: ['gayrimenkul', 'arsa', 'ev', 'konut', 'daire', 'ofis', 'işyeri', 'dükkan', 'kantin', 'tarla', 'kat karşılığı'],
  99: ['diğer', 'diger', 'özel ilan', 'serbest', 'muhtelif', 'reklam']
};

/**
 * Merkezi Kategori Eşleştirme Motoru
 * İhaleleri (veya ilanları) 40 ana taksonomi kategorisinden herhangi biriyle akıllıca eşleştirir.
 */
export function matchTenderToCategory(tender: any, catInput: any): boolean {
  if (!tender) return false;

  let catObj: any = null;
  if (typeof catInput === 'object' && catInput !== null) {
    catObj = catInput;
  } else if (typeof catInput === 'number') {
    catObj = ALL_40_CATEGORIES.find(c => c.id === catInput);
  } else if (typeof catInput === 'string') {
    const s = normTr(catInput);
    if (!s || s === 'tumu' || s === 'all') return true;
    catObj = ALL_40_CATEGORIES.find(c => {
      const cNameNorm = normTr(c.name);
      const cShortNorm = normTr(c.short);
      return cNameNorm === s || cShortNorm === s || cNameNorm.includes(s) || s.includes(cShortNorm);
    });
  }

  const catId = catObj ? catObj.id : (typeof catInput === 'number' ? catInput : null);

  // 1. Doğrudan Kategori ID eşleşmesi
  if (catId && tender.categoryId && Number(tender.categoryId) === Number(catId)) {
    return true;
  }

  // 2. Normalleştirilmiş metin alanları
  const tCat = normTr(tender.kategori);
  const tMain = normTr(tender.mainCategory);
  const tSub = normTr(tender.subCategory);
  const tTitle = normTr(tender.baslik);
  const tDesc = normTr(tender.aciklama);
  const fType = (tender.formType || tender.customFields?.formType || '').toString().toUpperCase();

  // Özel Durum: Kategori 99 (Diğer İhale ve İlanlar)
  if (catId === 99 || (catObj && catObj.id === 99) || (typeof catInput === 'string' && (normTr(catInput) === 'diger' || normTr(catInput).includes('diger')))) {
    if (
      Number(tender.categoryId) === 99 ||
      fType === 'DIGER' ||
      fType === 'REKLAM_ILANI' ||
      fType === 'REKLAM' ||
      tender.ihaleYonu === 'reklam' ||
      tender.customFields?.altKategoriDiger ||
      tender.customFields?.anaKategoriDiger ||
      tender.customFields?.digerMetni ||
      tCat.includes('diğer') ||
      tCat.includes('diger') ||
      tMain.includes('diğer') ||
      tMain.includes('diger') ||
      tSub.includes('diğer') ||
      tSub.includes('diger')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 41 (Konut / Ev)
  if (catId === 41 || (catObj && catObj.id === 41) || (typeof catInput === 'string' && (normTr(catInput).includes('konut') || normTr(catInput) === 'ev'))) {
    if (
      Number(tender.categoryId) === 41 ||
      fType === 'EV' ||
      tender.ihaleYonu === 'ev' ||
      tCat.includes('konut') ||
      tCat.includes('ev') ||
      tSub.includes('daire') ||
      tSub.includes('villa') ||
      tSub.includes('rezidans') ||
      tSub.includes('yazlık') ||
      tSub.includes('müstakil') ||
      tTitle.includes('daire') ||
      tTitle.includes('villa') ||
      tTitle.includes('konut')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 42 (Arsa / Arazi)
  if (catId === 42 || (catObj && catObj.id === 42) || (typeof catInput === 'string' && (normTr(catInput).includes('arsa') || normTr(catInput).includes('arazi')))) {
    if (
      Number(tender.categoryId) === 42 ||
      fType === 'ARSA' ||
      tender.ihaleYonu === 'arsa' ||
      tCat.includes('arsa') ||
      tCat.includes('arazi') ||
      tSub.includes('arsa') ||
      tSub.includes('tarla') ||
      tSub.includes('zeytinlik') ||
      tSub.includes('bağ') ||
      tSub.includes('bahçe') ||
      tTitle.includes('arsa') ||
      tTitle.includes('tarla')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 43 (İşyeri / Ticari Gayrimenkul)
  if (catId === 43 || (catObj && catObj.id === 43) || (typeof catInput === 'string' && (normTr(catInput).includes('işyeri') || normTr(catInput).includes('ticari')))) {
    if (
      Number(tender.categoryId) === 43 ||
      tCat.includes('işyeri') ||
      tCat.includes('ticari') ||
      tSub.includes('dükkan') ||
      tSub.includes('dükkân') ||
      tSub.includes('ofis') ||
      tSub.includes('büro') ||
      tSub.includes('depo') ||
      tSub.includes('fabrika') ||
      tSub.includes('plaza') ||
      tTitle.includes('dükkan') ||
      tTitle.includes('ofis')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 44 (Bina)
  if (catId === 44 || (catObj && catObj.id === 44) || (typeof catInput === 'string' && normTr(catInput) === 'bina')) {
    if (
      Number(tender.categoryId) === 44 ||
      tCat.includes('bina') ||
      tSub.includes('apartman') ||
      tSub.includes('ticari bina') ||
      tSub.includes('müstakil bina') ||
      tTitle.includes('bina')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 45 (Turizm Tesisi)
  if (catId === 45 || (catObj && catObj.id === 45) || (typeof catInput === 'string' && normTr(catInput).includes('turizm tesisi'))) {
    if (
      Number(tender.categoryId) === 45 ||
      tCat.includes('turizm tesisi') ||
      tSub.includes('otel') ||
      tSub.includes('pansiyon') ||
      tSub.includes('tatil köyü') ||
      tTitle.includes('otel')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 46 (Özel Amaçlı Gayrimenkul)
  if (catId === 46 || (catObj && catObj.id === 46) || (typeof catInput === 'string' && normTr(catInput).includes('özel amaçlı'))) {
    if (
      Number(tender.categoryId) === 46 ||
      tCat.includes('özel amaçlı') ||
      tSub.includes('akaryakıt') ||
      tSub.includes('otopark') ||
      tSub.includes('okul') ||
      tSub.includes('yurt') ||
      tTitle.includes('akaryakıt istasyonu')
    ) {
      return true;
    }
  }

  // Özel Durum: Kategori 40 (Genel Gayrimenkul & Arsa & Ev & Ofis & İşyeri)
  if (catId === 40 || (catObj && catObj.id === 40) || (typeof catInput === 'string' && (normTr(catInput).includes('gayrimenkul') || normTr(catInput).includes('emlak')))) {
    if (
      Number(tender.categoryId) === 40 ||
      Number(tender.categoryId) === 41 ||
      Number(tender.categoryId) === 42 ||
      Number(tender.categoryId) === 43 ||
      Number(tender.categoryId) === 44 ||
      Number(tender.categoryId) === 45 ||
      Number(tender.categoryId) === 46 ||
      fType === 'ARSA' ||
      fType === 'EV' ||
      fType === 'GAYRIMENKUL' ||
      tCat.includes('gayrimenkul') ||
      tCat.includes('arsa') ||
      tCat.includes('konut') ||
      tCat.includes('emlak') ||
      tSub.includes('ev') ||
      tSub.includes('arsa') ||
      tSub.includes('ofis') ||
      tSub.includes('işyeri') ||
      tSub.includes('isyeri')
    ) {
      return true;
    }
  }

  if (catObj) {
    const cName = normTr(catObj.name);
    const cShort = normTr(catObj.short);

    // Tam veya doğrudan alt dize eşleşmesi
    if (tCat === cName || tCat === cShort || tMain === cName || tMain === cShort) return true;
    if (tCat && (cName.includes(tCat) || cShort.includes(tCat) || tCat.includes(cShort))) return true;
    if (tMain && (cName.includes(tMain) || cShort.includes(tMain) || tMain.includes(cShort))) return true;

    // Alt kategoriler haritasından kontrol
    const subList = CATEGORY_SUBCATEGORIES_MAP[catObj.id] || [];
    if (subList.some(sub => {
      const s = normTr(sub);
      return tSub === s || tCat.includes(s) || tSub.includes(s) || s.includes(tSub);
    })) {
      return true;
    }

    // Anahtar kelime kümesi kontrolü
    const keywords = CATEGORY_KEYWORDS[catObj.id] || [];
    if (keywords.some(kw => {
      const nKw = normTr(kw);
      return tCat.includes(nKw) || tMain.includes(nKw) || tSub.includes(nKw) || tTitle.includes(nKw);
    })) {
      return true;
    }
  }

  // 3. catObj bulunamadıysa serbest metin araması
  if (typeof catInput === 'string') {
    const q = normTr(catInput);
    if (!q || q === 'tumu') return true;
    if (tCat.includes(q) || tMain.includes(q) || tSub.includes(q) || tTitle.includes(q) || q.includes(tCat)) {
      return true;
    }
  }

  return false;
}

