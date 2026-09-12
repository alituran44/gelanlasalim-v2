/**
 * Sektöre Özgü Dinamik İhale Parametreleri ve Şartname Şeması
 * 
 * İhaleciBurada platformundaki 40 ana taksonomi kategorisinin tamamı ve
 * özelleşmiş alt sektörler (Arsa, Konut, Ticari Gayrimenkul) için teknik,
 * mevzuat ve ticari şartname kriterlerini dinamik olarak yönetir.
 */

export interface CategoryFieldDef {
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'badge-group' | 'radio' | 'boolean' | 'date'
  placeholder?: string
  unit?: string
  options?: Array<string | { value: string; label: string }>
  helpText?: string
  group: 'teknik' | 'mevzuat' | 'ticari'
  required?: boolean
  defaultValue?: any
}

export interface SectorDefinition {
  key: string
  name: string
  icon: string
  badgeText: string
  description: string
  groups: {
    teknik: { title: string; desc: string }
    mevzuat: { title: string; desc: string }
    ticari: { title: string; desc: string }
  }
  fields: CategoryFieldDef[]
  quickPresets?: Array<{
    label: string
    values: Record<string, any>
  }>
}

export const SECTOR_DEFINITIONS: Record<string, SectorDefinition> = {
  // =========================================================================
  // INSAAT_ALTYAPI
  // =========================================================================
  insaat_altyapi: {
    key: "insaat_altyapi",
    name: "İnşaat, Altyapı & Yapım İşi İhalesi",
    icon: "HardHat",
    badgeText: "🏗️ İnşaat & Altyapı Şartnamesi",
    description: "Bina yapımı, yol, köprü, kazı-dolgu, çelik konstrüksiyon ve yıkım ihaleleri için ÇŞB yetki belgesi, şantiye şefi ve hakediş kriterleri.",
    groups: {
      teknik: { title: "1. Yapım Alanı & Metrik Büyüklükler", desc: "İnşaat alanı, beton sınıfı ve donatı tonajı" },
      mevzuat: { title: "2. Müteahhitlik Lisansı & Ruhsat Şartları", desc: "ÇŞB yetki belgesi grubu ve yapı denetim gereksinimleri" },
      ticari: { title: "3. Hakediş, Teminat & Garanti Modeli", desc: "Aylık hakediş ve kesin teminat oranı" }
    },
    quickPresets: [
      {
        label: "4.500 m² Fabrika Binası Yapımı",
        values: {"toplamInsaatAlani": 4500, "projeTuru": "Çelik Konstrüksiyon Fabrika", "betonSinifi": "C30/37", "demirTonaji": 180, "muteahhitlikBelgeGrubu": "C Grubu", "teminatOrani": 6, "kusurSorumlulukSuresi": "24 Ay"}
      },
      {
        label: "20.000 m³ Kazı ve Hafriyat",
        values: {"toplamInsaatAlani": 20000, "projeTuru": "Hafriyat, Kazı & Dolgu", "muteahhitlikBelgeGrubu": "E Grubu", "teminatOrani": 5}
      }
    ],
    fields: [
      {
        id: "toplamInsaatAlani",
        label: "Toplam İnşaat / Kazı Alanı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 4500",
        defaultValue: 4500
      },
      {
        id: "projeTuru",
        label: "Yapım / İhale Türü",
        type: "select",
        group: "teknik",
        options: ["Bina Yapımı & Taahhüt", "Yol, Köprü & Viyadük", "Hafriyat, Kazı & Dolgu", "Çelik Konstrüksiyon Fabrika", "Prefabrik Şantiye Yapıları", "Tadilat & Güçlendirme"],
        defaultValue: "Bina Yapımı & Taahhüt"
      },
      {
        id: "betonSinifi",
        label: "Asgari Beton Sınıfı",
        type: "select",
        group: "teknik",
        options: ["C25/30", "C30/37", "C35/45", "C40/50", "BS 25"],
        defaultValue: "C30/37"
      },
      {
        id: "demirTonaji",
        label: "Tahmini Donatı Demir Tonajı",
        type: "number",
        group: "teknik",
        unit: "Ton",
        placeholder: "Örn: 220",
        defaultValue: 220
      },
      {
        id: "muteahhitlikBelgeGrubu",
        label: "ÇŞB Müteahhitlik Yetki Belgesi Grubu",
        type: "select",
        group: "mevzuat",
        options: ["A Grubu (Sınırsız)", "B Grubu", "C Grubu", "D Grubu", "E Grubu", "F Grubu", "G Grubu", "H Grubu"],
        defaultValue: "C Grubu"
      },
      {
        id: "imarVeRuhsatDurumu",
        label: "İmar & Yapı Ruhsatı Durumu",
        type: "select",
        group: "mevzuat",
        options: ["Yapı Ruhsatı Alınmış (İnşaata Hazır)", "Ruhsat Başvurusu Aşamasında", "İmar Çapı ve Aplikasyon Mevcut"],
        defaultValue: "Yapı Ruhsatı Alınmış (İnşaata Hazır)"
      },
      {
        id: "santiyeSefiVeIsgSarti",
        label: "Tam Zamanlı Şantiye Şefi & İSG Uzmanı Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "teminatOrani",
        label: "Kesin Teminat Mektubu Oranı",
        type: "number",
        group: "ticari",
        unit: "%",
        placeholder: "Örn: 6",
        defaultValue: 6
      },
      {
        id: "hakedisPeriyodu",
        label: "Hakediş & Ödeme Modeli",
        type: "select",
        group: "ticari",
        options: ["Aylık İlerleme Hakedişi (Yeşil Defter)", "Aşama Bazlı Hakediş (Subasman, Kaba, İnce)", "Anahtar Teslim Götürü Bedel"],
        defaultValue: "Aylık İlerleme Hakedişi (Yeşil Defter)"
      },
      {
        id: "kusurSorumlulukSuresi",
        label: "Kusur Sorumluluk & Garanti Süresi",
        type: "select",
        group: "ticari",
        options: ["12 Ay", "24 Ay", "36 Ay", "60 Ay"],
        defaultValue: "24 Ay"
      }
    ]
  },
  // =========================================================================
  // SAGLIK_ILAC
  // =========================================================================
  saglik_ilac: {
    key: "saglik_ilac",
    name: "Sağlık, İlaç & Medikal Sarf İhalesi",
    icon: "Stethoscope",
    badgeText: "💊 Sağlık & İlaç Şartnamesi",
    description: "Hastaneler ve klinikler için ilaç, serum, cerrahi sarf, ortopedi ve kişisel hijyen malzemesi tedarik kriterleri.",
    groups: {
      teknik: { title: "1. Tıbbi Sarf & Ürün Niteliği", desc: "Etken madde, dozaj, kutu adedi ve soğuk zincir aralığı" },
      mevzuat: { title: "2. Sağlık Bakanlığı Ruhsat & İTS Şartları", desc: "TİTCK ruhsatı, İlaç Takip Sistemi (İTS) ve GMP uygunluğu" },
      ticari: { title: "3. Raf Ömrü & Çağrılı Sevkiyat Modeli", desc: "Kalan asgari raf ömrü ve kısmi teslimat takvimi" }
    },
    quickPresets: [
      {
        label: "50.000 Şişe IV Serum Alımı",
        values: {"ilacSarfKategorisi": "Serum & Solüsyon (IV İntravenöz)", "kutuAdedi": 50000, "titckRuhsati": true, "itsKarekodSarti": true}
      },
      {
        label: "Soğuk Zincir Biyolojik İlaç Tedariği",
        values: {"ilacSarfKategorisi": "Reçeteli Beşeri İlaç & Antibiyotik", "saklamaKosulu": "Soğuk Zincir (+2°C / +8°C)", "kutuAdedi": 10000}
      }
    ],
    fields: [
      {
        id: "ilacSarfKategorisi",
        label: "Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Reçeteli Beşeri İlaç & Antibiyotik", "Serum & Solüsyon (IV İntravenöz)", "Cerrahi İplik & Dikiş Sarfları", "Ortopedi & Protez Ürünleri", "Laboratuvar Teşhis Kitleri", "Tıbbi Dezenfektan & Kişisel Hijyen"],
        defaultValue: "Serum & Solüsyon (IV İntravenöz)"
      },
      {
        id: "kutuAdedi",
        label: "Talep Edilen Kutu / Paket Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Kutu",
        placeholder: "Örn: 25000",
        defaultValue: 25000
      },
      {
        id: "saklamaKosulu",
        label: "Saklama Sıcaklığı & Zincir Şartı",
        type: "select",
        group: "teknik",
        options: ["Soğuk Zincir (+2°C / +8°C)", "Kontrollü Oda Sıcaklığı (15°C - 25°C)", "Işıktan Muhafazalı Kuru Depolama"],
        defaultValue: "Soğuk Zincir (+2°C / +8°C)"
      },
      {
        id: "titckRuhsati",
        label: "TİTCK Sağlık Bakanlığı İlaç/Ürün Ruhsatı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "itsKarekodSarti",
        label: "İlaç Takip Sistemi (İTS) Karekod Bildirimi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gmpSertifikasi",
        label: "GMP (İyi İmalat Uygulamaları) Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "rafOmruKriteri",
        label: "Asgari Kalan Raf Ömrü",
        type: "select",
        group: "ticari",
        options: ["En Az %75 Kalan Raf Ömrü", "En Az %80 Kalan Raf Ömrü", "Teslim Tarihinden İtibaren En Az 18 Ay"],
        defaultValue: "En Az %75 Kalan Raf Ömrü"
      },
      {
        id: "teslimatPeriyodu",
        label: "Sevkiyat & Dağıtım Takvimi",
        type: "select",
        group: "ticari",
        options: ["Aylık Düzenli Çağrılı Sevkiyat (3 Parti)", "Tek Seferde Toplu Depo Teslimi", "Haftalık İhtiyaç Siparişi"],
        defaultValue: "Aylık Düzenli Çağrılı Sevkiyat (3 Parti)"
      }
    ]
  },
  // =========================================================================
  // GIDA_TARIM
  // =========================================================================
  gida_tarim: {
    key: "gida_tarim",
    name: "Gıda, Tarım Ürünleri & Hububat İhalesi",
    icon: "UtensilsCrossed",
    badgeText: "🌾 Gıda & Tarım Şartnamesi",
    description: "Bakliyat, un, şeker, yağ, et, süt ve taze sebze-meyve toptan tedarikinde kodeks, analiz ve ambalaj şartları.",
    groups: {
      teknik: { title: "1. Gıda Grubu & Metrik Miktar", desc: "Ürün cinsi, tonaj ve rutubet/asitlik parametreleri" },
      mevzuat: { title: "2. Tarım Bakanlığı İzin & Kalite Standartları", desc: "Türk Gıda Kodeksi, işletme kayıt/onay no ve Helal sertifikası" },
      ticari: { title: "3. Ambalaj, Numune & Sevkiyat", desc: "Soğuk zincir ve bağımsız akredite laboratuvar analizi" }
    },
    quickPresets: [
      {
        label: "50 Ton Pirinç & Kırmızı Mercimek",
        values: {"gidaGrubu": "Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)", "miktarTon": 50, "tarimBakanligiOnayNo": true, "turkGidaKodeksiUygunlugu": true}
      },
      {
        label: "10 Ton Yemeklik Ayçiçek Yağı Alımı",
        values: {"gidaGrubu": "Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)", "miktarTon": 10, "analizRaporuSarti": true}
      }
    ],
    fields: [
      {
        id: "gidaGrubu",
        label: "Gıda Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)", "Un, İrmik & Şeker Toptan", "Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)", "Kırmızı Et & Beyaz Et Ürünleri", "Süt, Peynir & Şarküteri", "Sebze & Meyve Toptan", "Salça, Konserve & Sos"],
        defaultValue: "Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)"
      },
      {
        id: "miktarTon",
        label: "Toplam Sipariş Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton",
        placeholder: "Örn: 25",
        defaultValue: 25
      },
      {
        id: "ambalajSekli",
        label: "Ambalaj & Paketleme Şekli",
        type: "select",
        group: "teknik",
        options: ["25 kg / 50 kg Gıdaya Uygun PP Çuval", "1 kg / 5 kg Orijinal Vakumlu Koli", "5 Litre / 18 Litre Teneke (Yağ)", "Kasa / Plastik Palet (Taze Ürün)", "Silobas / Dökme Tanker"],
        defaultValue: "25 kg / 50 kg Gıdaya Uygun PP Çuval"
      },
      {
        id: "tarimBakanligiOnayNo",
        label: "Tarım ve Orman Bakanlığı İşletme Onay / Kayıt No",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "turkGidaKodeksiUygunlugu",
        label: "Türk Gıda Kodeksi Uygunluk Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "helalGidaSertifikasi",
        label: "Helal Akreditasyon Kurumu (HAK) Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "analizRaporuSarti",
        label: "Her Partide Akredite Laboratuvar Rutubet/Pestisit Analizi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sogukZincirSevkiyat",
        label: "Frigofirik (+4°C / -18°C) Soğuk Zincir Taşımacılık",
        type: "boolean",
        group: "ticari",
        defaultValue: false
      },
      {
        id: "numuneOnayProseduru",
        label: "Teklif Aşamasında Fiziksel Numune Onay Şartı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // TIBBI_CIHAZ
  // =========================================================================
  tibbi_cihaz: {
    key: "tibbi_cihaz",
    name: "Tıbbi Cihaz & Hastane Ekipmanları İhalesi",
    icon: "Stethoscope",
    badgeText: "🩺 Tıbbi Cihaz & Laboratuvar Şartnamesi",
    description: "Radyoloji, yoğun bakım, cerrahi ve laboratuvar cihazları için TİTCK ÜTS kaydı, CE MDR ve 10 yıl yedek parça taahhüdü.",
    groups: {
      teknik: { title: "1. Cihaz Sınıfı & Teknik Kapasite", desc: "Cihaz kategorisi, adedi, menşei ve kalibrasyon" },
      mevzuat: { title: "2. Sağlık Bakanlığı ÜTS & CE MDR Standartları", desc: "TİTCK Ürün Takip Sistemi kaydı ve tıbbi cihaz direktifleri" },
      ticari: { title: "3. Yerinde Montaj, Garanti & Yedek Parça", desc: "Yetkili servislik, kullanıcı eğitimi ve 10 yıl parça güvencesi" }
    },
    quickPresets: [
      {
        label: "20 Adet Hasta Başı Monitör Seti",
        values: {"cihazSinifi": "Hasta Başı Monitör & Defibrilatör", "cihazAdedi": 20, "utsKayitZorunlulugu": true, "garantiSuresiYil": "3 Yıl Tam Garanti"}
      },
      {
        label: "Buharlı Hastane Otoklav Cihazı",
        values: {"cihazSinifi": "Buharlı Hastane Otoklav & Sterilizatör", "cihazAdedi": 2, "kalibrasyonSertifikasi": true}
      }
    ],
    fields: [
      {
        id: "cihazSinifi",
        label: "Cihaz Sınıfı / Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Görüntüleme & Radyoloji (MR, CT, Röntgen)", "Yoğun Bakım & Mekanik Ventilatör", "Hasta Başı Monitör & Defibrilatör", "Cerrahi Operasyon & Lazer Cihazları", "Laboratuvar Biyokimya & Hemogram Analizörleri", "Buharlı Hastane Otoklav & Sterilizatör", "Motorlu Hasta Yatağı & Diyaliz Koltuğu"],
        defaultValue: "Hasta Başı Monitör & Defibrilatör"
      },
      {
        id: "cihazAdedi",
        label: "Alınacak Cihaz Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet",
        placeholder: "Örn: 15",
        defaultValue: 15
      },
      {
        id: "cihazMensei",
        label: "Menşei Tercihi",
        type: "select",
        group: "teknik",
        options: ["Yerli Malı Belgeli (%15 Fiyat Avantajı)", "AB / ABD / Japonya Menşeili", "Serbest"],
        defaultValue: "Serbest"
      },
      {
        id: "utsKayitZorunlulugu",
        label: "Sağlık Bakanlığı TİTCK ÜTS (Ürün Takip Sistemi) Kaydı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "ceMdrUygunlugu",
        label: "Avrupa Tıbbi Cihaz Regülasyonu (CE MDR 2017/745)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kalibrasyonSertifikasi",
        label: "TÜRKAK Akredite İlk Biyomedikal Kalibrasyon Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "garantiSuresiYil",
        label: "Tam Garanti Süresi",
        type: "select",
        group: "ticari",
        options: ["2 Yıl Tam Garanti", "3 Yıl Tam Garanti", "5 Yıl Kapsamlı Garanti"],
        defaultValue: "2 Yıl Tam Garanti"
      },
      {
        id: "yedekParcaTeminTaahhudu",
        label: "Ücreti Mukabili Yedek Parça Bulundurma Taahhüdü",
        type: "select",
        group: "ticari",
        options: ["5 Yıl Yedek Parça", "10 Yıl Kesintisiz Yedek Parça"],
        defaultValue: "10 Yıl Kesintisiz Yedek Parça"
      },
      {
        id: "montajVeEgitimDahil",
        label: "Yerinde Kurulum, Montaj ve Biyomedikal Kullanıcı Eğitimi Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // KANALIZASYON_SU
  // =========================================================================
  kanalizasyon_su: {
    key: "kanalizasyon_su",
    name: "Kanalizasyon, Su Şebekesi & Doğalgaz Tesisatı İhalesi",
    icon: "Layers",
    badgeText: "🚰 Su & Tesisat Şartnamesi",
    description: "İçme suyu, kanalizasyon, doğalgaz altyapı boruları, vana, sayaç ve hidrofor sistemleri kalite kriterleri.",
    groups: {
      teknik: { title: "1. Boru & Malzeme Spesifikasyonu", desc: "Boru hammaddesi, anma çapı, basınç dayanımı ve metraj" },
      mevzuat: { title: "2. İSKİ / DSI / TSE Standartları", desc: "TSE EN 12201, içme suyu temas izni ve hidrostatik test" },
      ticari: { title: "3. Lojistik, İndirme & Kabul Şartları", desc: "Şantiye sahasına indirme dahil teslimat ve test raporları" }
    },
    quickPresets: [
      {
        label: "10.000 Metre HDPE 100 PN16 DN110 Hattı",
        values: {"boruTuru": "HDPE 100 Polietilen İçme Suyu Borusu", "boruCapi": "DN110", "basincDayanimi": "PN16", "toplamMetraj": 10000}
      },
      {
        label: "3.000 Metre SN8 DN400 Koruge Boru",
        values: {"boruTuru": "SN8 Koruge Çift Cidarlı Kanalizasyon Borusu", "boruCapi": "DN400", "basincDayanimi": "SN8", "toplamMetraj": 3000}
      }
    ],
    fields: [
      {
        id: "boruTuru",
        label: "Boru & Altyapı Malzemesi Cinsi",
        type: "select",
        group: "teknik",
        options: ["HDPE 100 Polietilen İçme Suyu Borusu", "SN8 Koruge Çift Cidarlı Kanalizasyon Borusu", "Çelik Çekme / Spiral Kaynaklı Doğalgaz Borusu", "Duktil Döküm İçme Suyu Borusu", "PPRC & PVC Temiz/Pis Su Tesisat Malzemesi", "Sürgülü Vana, Kelebek Vana & Yangın Hidrantı"],
        defaultValue: "HDPE 100 Polietilen İçme Suyu Borusu"
      },
      {
        id: "boruCapi",
        label: "Boru Anma Çapı",
        type: "select",
        group: "teknik",
        options: ["DN63", "DN110", "DN160", "DN200", "DN300", "DN400", "DN600", "DN800", "DN1000+"],
        defaultValue: "DN110"
      },
      {
        id: "basincDayanimi",
        label: "Basınç Dayanım Sınıfı",
        type: "select",
        group: "teknik",
        options: ["PN6", "PN10", "PN16", "PN25", "SN4", "SN8"],
        defaultValue: "PN16"
      },
      {
        id: "toplamMetraj",
        label: "Toplam Metraj / Miktar",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Metre",
        placeholder: "Örn: 5000",
        defaultValue: 5000
      },
      {
        id: "tseUygunlukBelgesi",
        label: "TSE EN 12201 / TSE EN 13476 Standart Uygunluk Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gidaTemasIcmeSuyuOnayi",
        label: "İçme Suyuna Temas Uygunluk (Hıfzıssıhha Sağlık Raporu)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "hidrostatikBasincTesti",
        label: "Fabrika Hidrostatik Basınç ve Et Kalınlığı Test Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sahayaIndirmeDahil",
        label: "Yüklenici Araçlarıyla Şantiye Hattı Boyunca İndirme Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // ENERJI_ELEKTRIK
  // =========================================================================
  enerji_elektrik: {
    key: "enerji_elektrik",
    name: "Enerji, Elektrik Tesisatı & Aydınlatma İhalesi",
    icon: "Fuel",
    badgeText: "⚡ Enerji & Elektrik Şartnamesi",
    description: "Güneş enerjisi (GES), trafo merkezleri, jeneratörler, AG/OG dağıtım panoları ve LED aydınlatma kriterleri.",
    groups: {
      teknik: { title: "1. Elektrik & Güç Parametreleri", desc: "Sistem tipi, kurulu güç, kablo kesiti ve jeneratör kVA" },
      mevzuat: { title: "2. TEDAŞ / TEİAŞ & EPDK Proje Onayları", desc: "Resmî şebeke bağlantı anlaşması ve EMO onaylı elektrik projesi" },
      ticari: { title: "3. EPC Kurulum, Devreye Alma & Performans", desc: "Kabul testleri, invertör ve panel garantileri" }
    },
    quickPresets: [
      {
        label: "1 MWp Çatı GES Kurulumu",
        values: {"sistemTipi": "Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)", "kuruluGucKva": 1000, "tedasTeiasOnayi": true, "anahtarTeslimDevreyeAlma": true}
      },
      {
        label: "800 kVA Dizel Jeneratör Sistemi",
        values: {"sistemTipi": "Dizel Otomatik Jeneratör & Transfer Panosu", "kuruluGucKva": 800}
      }
    ],
    fields: [
      {
        id: "sistemTipi",
        label: "Enerji / Elektrik Sistem Tipi",
        type: "select",
        group: "teknik",
        options: ["Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)", "Arazi Tipi Lisanssız GES Yatırımı", "1.600 kVA Dağıtım Trafosu & OG Hücreleri", "Dizel Otomatik Jeneratör & Transfer Panosu", "Fabrika Ana Dağıtım & Kompanzasyon Panoları", "Çevre & Otoyol LED Aydınlatma Direkleri"],
        defaultValue: "Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)"
      },
      {
        id: "kuruluGucKva",
        label: "Kurulu Güç Kapasitesi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "kVA / kWp",
        placeholder: "Örn: 1000",
        defaultValue: 1000
      },
      {
        id: "kabloVeSalterStandarti",
        label: "Kablo & Şalt Malzeme Standardı",
        type: "select",
        group: "teknik",
        options: ["Halogen Free (Alev İletmez, HFFR)", "Standart PVC / XLPE Yeraltı Zırhlı", "Solar PV 6mm² Çift İzolasyonlu"],
        defaultValue: "Solar PV 6mm² Çift İzolasyonlu"
      },
      {
        id: "tedasTeiasOnayi",
        label: "TEDAŞ / Dağıtım Şirketi Onaylı Proje ve Kabul Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "epdkBaglantiAnlasmasi",
        label: "EPDK Bağlantı Anlaşması Çağrı Mektubu Mevcut",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "emoMuhendislikOnayi",
        label: "EMO Tescilli Mühendislik & Topraklama Ölçüm Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "anahtarTeslimDevreyeAlma",
        label: "EPC Anahtar Teslim Montaj, Şebeke Senkronizasyonu Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "sistemPerformansGarantisi",
        label: "Performans & Üretim Garantisi",
        type: "select",
        group: "ticari",
        options: ["10 Yıl İnvertör / 25 Yıl Lineer Panel Garantisi", "2 Yıl Genel Tesisat & Malzeme Garantisi", "5 Yıl Kesintisiz Servis Garantisi"],
        defaultValue: "10 Yıl İnvertör / 25 Yıl Lineer Panel Garantisi"
      }
    ]
  },
  // =========================================================================
  // AKARYAKIT_ENERJI
  // =========================================================================
  akaryakit_enerji: {
    key: "akaryakit_enerji",
    name: "Akaryakıt, Madeni Yağ & Otogaz İhalesi",
    icon: "Fuel",
    badgeText: "⛽ Akaryakıt & Enerji Şartnamesi",
    description: "Motorin, benzin, madeni yağ ve otogaz toptan alımları için EPDK dağıtıcı lisansı, sayaç mühür ve iskonto kriterleri.",
    groups: {
      teknik: { title: "1. Yakıt Türü & Miktar Kriterleri", desc: "Satın alınacak akaryakıt cinsi, oktan ve metrik büyüklükler" },
      mevzuat: { title: "2. EPDK Mevzuat & Lisans Zorunlulukları", desc: "Resmî dağıtıcı yetkisi ve sayaç mühür şartları" },
      ticari: { title: "3. Fiyatlandırma & Teslimat Modeli", desc: "Pompa tavan fiyat iskontosu ve teslim yöntemi" }
    },
    quickPresets: [
      {
        label: "50.000 Litre Saha Tanker Motorin Alımı",
        values: {"yakitTuru": "Motorin Ultra EuroDiesel (10 ppm)", "miktarLitre": 50000, "teslimatYontemi": "Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)", "fiyatlandirmaUsulu": "EPDK Pompa Tavan Fiyatı Üzerinden % İskonto", "iskontoOrani": 6.5, "epdkLisansZorunlu": true}
      },
      {
        label: "Kurumsal Taşıt Tanıma (TTS) Filo Yakıt İhalesi",
        values: {"yakitTuru": "Motorin Ultra EuroDiesel (10 ppm)", "miktarLitre": 120000, "teslimatYontemi": "İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)", "iskontoOrani": 8.0}
      }
    ],
    fields: [
      {
        id: "yakitTuru",
        label: "Akaryakıt / Enerji Ürün Cinsi",
        type: "select",
        group: "teknik",
        options: ["Motorin Ultra EuroDiesel (10 ppm)", "Kurşunsuz Benzin 95 Oktan", "Fuel Oil No: 4 / Kal-Yak", "LPG / Otogaz Dökme & Tüplü", "Madeni Yağ & Endüstriyel Gres", "AdBlue (Egzoz Emisyon Sıvısı)"],
        defaultValue: "Motorin Ultra EuroDiesel (10 ppm)"
      },
      {
        id: "miktarLitre",
        label: "Toplam Talep Edilen Hacim",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Litre",
        placeholder: "Örn: 50000",
        defaultValue: 50000
      },
      {
        id: "teslimatYontemi",
        label: "Teslimat & İkmal Yöntemi",
        type: "select",
        group: "teknik",
        options: ["Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)", "İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)", "Tedarikçi İstasyonundan Doğrudan Alım", "Varil / IBC Ambalajlı Depo Teslimi"],
        defaultValue: "Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)"
      },
      {
        id: "epdkLisansZorunlu",
        label: "EPDK Dağıtıcı / Bayilik Lisansı Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sayacMuhurolcek",
        label: "Sanayi Bakanlığı Damgalı ve Mühürlü Sayaç Taahhüdü",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "analizRaporuSarti",
        label: "TÜRKAK Akredite Laboratuvardan Akaryakıt Analiz Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "fiyatlandirmaUsulu",
        label: "Fiyatlandırma Esası",
        type: "select",
        group: "ticari",
        options: ["EPDK Pompa Tavan Fiyatı Üzerinden % İskonto", "TÜPRAŞ Rafineri Çıkış Fiyatı + Dağıtıcı Marjı", "Sabit Birim Fiyatlı Sözleşme"],
        defaultValue: "EPDK Pompa Tavan Fiyatı Üzerinden % İskonto"
      },
      {
        id: "iskontoOrani",
        label: "Asgari İskonto Oranı",
        type: "number",
        group: "ticari",
        unit: "%",
        placeholder: "Örn: 6.5",
        defaultValue: 6.5
      }
    ]
  },
  // =========================================================================
  // ENDUSTRIYEL_MAKINE
  // =========================================================================
  endustriyel_makine: {
    key: "endustriyel_makine",
    name: "Endüstriyel Makine, CNC & Konveyör İhalesi",
    icon: "Cpu",
    badgeText: "⚙️ Makine & Teçhizat Şartnamesi",
    description: "CNC işleme merkezleri, hava kompresörleri, konveyör hatları ve redüktörler için CE ve yerinde montaj kriterleri.",
    groups: {
      teknik: { title: "1. Makine Türü & Motor Gücü", desc: "İşleme kapasitesi, motor gücü kW ve eksen sayısı" },
      mevzuat: { title: "2. Makine Emniyeti & Direktifler", desc: "2006/42/AT direktifi, CE belgesi ve topraklama" },
      ticari: { title: "3. Kurulum, Devreye Alma & Garanti", desc: "Yerinde FAT/SAT kabul testleri ve yedek parça taahhüdü" }
    },
    quickPresets: [
      {
        label: "5 Eksen CNC Dik İşleme Merkezi",
        values: {"makineKategorisi": "CNC Dik İşleme Merkezi & Torna", "motorGucuKw": 35, "makineAdedi": 1, "makineGarantiSuresi": "2 Yıl Tam Garanti"}
      },
      {
        label: "75 kW Vidalı Kompresör & Kurutucu Seti",
        values: {"makineKategorisi": "Vidalı Hava Kompresörü & Basınçlı Hava", "motorGucuKw": 75, "makineAdedi": 2}
      }
    ],
    fields: [
      {
        id: "makineKategorisi",
        label: "Makine & Teçhizat Kategorisi",
        type: "select",
        group: "teknik",
        options: ["CNC Dik İşleme Merkezi & Torna", "Vidalı Hava Kompresörü & Basınçlı Hava", "Endüstriyel Konveyör & Bant Hattı", "Elektrik Motoru & Helisel Redüktör", "Otomatik Paketleme & Dolum Makinesi", "Hidrolik Pres & Pnömatik Üniteler"],
        defaultValue: "CNC Dik İşleme Merkezi & Torna"
      },
      {
        id: "motorGucuKw",
        label: "Toplam Motor / Bağlantı Gücü",
        type: "number",
        group: "teknik",
        unit: "kW",
        placeholder: "Örn: 45",
        defaultValue: 45
      },
      {
        id: "makineAdedi",
        label: "Talep Edilen Makine Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet",
        placeholder: "Örn: 2",
        defaultValue: 2
      },
      {
        id: "ceMakineEmniyetDirektifi",
        label: "2006/42/AT Makine Emniyeti CE Uygunluk Beyanı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "iso9001VeTse",
        label: "İmalatçı ISO 9001 ve TSE Standart Uygunluğu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "yerindeKurulumVeSatTesti",
        label: "Yerinde Kurulum, Devreye Alma ve Saha Kabul (SAT) Testi",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "operatorEgitimiDahil",
        label: "Operatör ve Bakım Personeli Sertifikalı Eğitimi Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "makineGarantiSuresi",
        label: "Tam Garanti Süresi",
        type: "select",
        group: "ticari",
        options: ["1 Yıl Mekanik & Elektrik Garanti", "2 Yıl Tam Garanti", "3 Yıl Kapsamlı Garanti"],
        defaultValue: "2 Yıl Tam Garanti"
      }
    ]
  },
  // =========================================================================
  // BILISIM_TEKNOLOJI
  // =========================================================================
  bilisim_teknoloji: {
    key: "bilisim_teknoloji",
    name: "Yazılım, ERP & Bilişim Altyapı İhalesi",
    icon: "Laptop",
    badgeText: "💻 Bilişim & Yazılım Şartnamesi",
    description: "Özel yazılım, kurumsal ERP, bulut barındırma ve siber güvenlik hizmetleri için SLA ve ISO 27001 şartları.",
    groups: {
      teknik: { title: "1. Yazılım Kapsamı & Mimari", desc: "Kapsam türü, kullanıcı lisans adedi ve mimari yapı" },
      mevzuat: { title: "2. Bilgi Güvenliği & KVKK Standartları", desc: "ISO 27001, KVKK uyumu ve kaynak kod teslimi" },
      ticari: { title: "3. SLA Hizmet Seviyesi & Bakım Modeli", desc: "Çözüm süresi SLA ve periyodik sürüm desteği" }
    },
    quickPresets: [
      {
        label: "Özel B2B Portal & Mobil Uygulama",
        values: {"projeKapsami": "Özel Web & Mobil Yazılım Geliştirme", "kullaniciKapasitesi": 500, "iso27001Sertifikasi": true, "kaynakKodTeslimi": true, "slaHedefi": "%99.9 Uptime & 2 Saat Kritik Müdahale"}
      },
      {
        label: "Kurumsal ERP Entegrasyonu",
        values: {"projeKapsami": "Kurumsal ERP / CRM Entegrasyonu", "kullaniciKapasitesi": 150, "destekBakimSuresi": "24 Ay Kapsamlı Destek"}
      }
    ],
    fields: [
      {
        id: "projeKapsami",
        label: "Bilişim & Yazılım Kapsamı",
        type: "select",
        group: "teknik",
        options: ["Özel Web & Mobil Yazılım Geliştirme", "Kurumsal ERP / CRM Entegrasyonu", "Bulut Sunucu & Veri Merkezi Altyapısı", "Siber Güvenlik & Penetrasyon Testi", "Veritabanı Yönetimi & Felaket Kurtarma"],
        defaultValue: "Özel Web & Mobil Yazılım Geliştirme"
      },
      {
        id: "kullaniciKapasitesi",
        label: "Kullanıcı / Lisans Kapasitesi",
        type: "number",
        group: "teknik",
        unit: "Kullanıcı",
        placeholder: "Örn: 250",
        defaultValue: 250
      },
      {
        id: "teknolojiYigini",
        label: "Tercih Edilen Mimari / Platform",
        type: "select",
        group: "teknik",
        options: ["Mikroservis & Bulut-Yerel (Kubernetes / Docker)", "Modern Web (Vue / React / Node.js / Go)", "Kurumsal Java / .NET Core Mimarisi", "Açık Kaynak Esnek Mimari"],
        defaultValue: "Modern Web (Vue / React / Node.js / Go)"
      },
      {
        id: "iso27001Sertifikasi",
        label: "Yüklenicide ISO 27001 Bilgi Güvenliği Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kvkkVeVeriYerliligi",
        label: "KVKK Uyumu ve Türkiye Lokasyonlu Veri Merkezi Zorunluluğu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kaynakKodTeslimi",
        label: "Fikri Mülkiyet ve Kaynak Kodların Eksiksiz Teslimi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "slaHedefi",
        label: "SLA Arıza Müdahale & Çözüm Seviyesi",
        type: "select",
        group: "ticari",
        options: ["%99.9 Uptime & 2 Saat Kritik Müdahale", "%99.5 Uptime & 4 Saat Kritik Müdahale", "Mesai Saatleri İçinde 8 Saat Müdahale"],
        defaultValue: "%99.9 Uptime & 2 Saat Kritik Müdahale"
      },
      {
        id: "destekBakimSuresi",
        label: "Garanti Kapsamında Ücretsiz Bakım & Güncelleme",
        type: "select",
        group: "ticari",
        options: ["12 Ay Ücretsiz Bakım", "24 Ay Kapsamlı Destek", "36 Ay 7/24 Teknik Destek"],
        defaultValue: "12 Ay Ücretsiz Bakım"
      }
    ]
  },
  // =========================================================================
  // LOJISTIK_TASIMACILIK
  // =========================================================================
  lojistik_tasimacilik: {
    key: "lojistik_tasimacilik",
    name: "Nakliye, Taşımacılık & Servis Hizmeti İhalesi",
    icon: "Truck",
    badgeText: "🚚 Lojistik & Nakliye Şartnamesi",
    description: "Karayolu FTL/parsiyel, personel/öğrenci servis taşımacılığı ve konteyner nakliyesi için K1/D2 belgesi ve araç yaşı kriterleri.",
    groups: {
      teknik: { title: "1. Taşımacılık Türü & Kapasite", desc: "Taşıma modu, sefer sayısı, araç tipi ve tonaj" },
      mevzuat: { title: "2. Ulaştırma Bakanlığı Yetki Belgeleri", desc: "K1, K2, D2 yetki belgesi, SRC ve psikoteknik şartları" },
      ticari: { title: "3. Fiyatlandırma & Araç Yaşı Şartı", desc: "Sefer/tonaj bazlı fiyatlandırma ve maksimum araç yaşı" }
    },
    quickPresets: [
      {
        label: "Aylık 50 Sefer FTL Tır Nakliyesi",
        values: {"tasimaTuru": "Şehirlerarası Karayolu Nakliye (FTL Komple Tır)", "seferSayisi": 50, "aracMaksimumYasi": "En Fazla 5 Yaşında", "ulastirmaBakanligiYetkiBelgesi": "K1 Yetki Belgesi (Eşya Taşımacılığı)"}
      },
      {
        label: "10 Güzergah Personel Servis Taşımacılığı",
        values: {"tasimaTuru": "Personel & Öğrenci Servis Hizmeti", "seferSayisi": 200, "aracMaksimumYasi": "En Fazla 8 Yaşında", "ulastirmaBakanligiYetkiBelgesi": "D2 Yetki Belgesi (Arızi Yolcu Taşımacılığı)"}
      }
    ],
    fields: [
      {
        id: "tasimaTuru",
        label: "Taşımacılık Türü",
        type: "select",
        group: "teknik",
        options: ["Şehirlerarası Karayolu Nakliye (FTL Komple Tır)", "Şehir İçi Dağıtım & Parsiyel Taşımacılık", "Personel & Öğrenci Servis Hizmeti", "Konteyner & Liman Sahası Nakliyesi", "Soğuk Hava Frigofirik Taşımacılık"],
        defaultValue: "Şehirlerarası Karayolu Nakliye (FTL Komple Tır)"
      },
      {
        id: "seferSayisi",
        label: "Aylık Tahmini Sefer / Araç Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Sefer",
        placeholder: "Örn: 45",
        defaultValue: 45
      },
      {
        id: "aracMaksimumYasi",
        label: "Maksimum Araç Model Yaşı",
        type: "select",
        group: "teknik",
        options: ["En Fazla 5 Yaşında", "En Fazla 8 Yaşında", "En Fazla 12 Yaşında (Servis Mevzuatı)"],
        defaultValue: "En Fazla 5 Yaşında"
      },
      {
        id: "ulastirmaBakanligiYetkiBelgesi",
        label: "Yetki Belgesi Şartı (K1 / L2 / D2)",
        type: "select",
        group: "mevzuat",
        options: ["K1 Yetki Belgesi (Eşya Taşımacılığı)", "L2 Yetki Belgesi (Uluslararası Lojistik)", "D2 Yetki Belgesi (Arızi Yolcu Taşımacılığı)"],
        defaultValue: "K1 Yetki Belgesi (Eşya Taşımacılığı)"
      },
      {
        id: "srcVePsikoteknikSarti",
        label: "Tüm Şoförlerde SRC ve Psikoteknik Raporu Zorunluluğu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "emtiaNakliyatSigortasi",
        label: "Sefer Başına En Az 2.000.000 ₺ Emtia Nakliyat Sigortası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gpsFiloTakipPaylasimi",
        label: "Gerçek Zamanlı GPS Araç Takip Sistemi Paylaşımı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "fiyatlandirmaBirimi",
        label: "Fiyatlandırma Birimi",
        type: "select",
        group: "ticari",
        options: ["Sefer Başına Sabit Fiyat", "Kilometre Başına Fiyat (Km x Katsayı)", "Tonaj / Desi Başına Fiyat"],
        defaultValue: "Sefer Başına Sabit Fiyat"
      }
    ]
  },
  // =========================================================================
  // MOBILYA_OFIS
  // =========================================================================
  mobilya_ofis: {
    key: "mobilya_ofis",
    name: "Mobilya, Endüstriyel Mutfak & Ofis Donanımı İhalesi",
    icon: "Armchair",
    badgeText: "🪑 Mobilya & Mutfak Şartnamesi",
    description: "Ofis mobilyaları, endüstriyel mutfak paslanmaz ekipmanları, arşiv rafları ve beyaz eşya tedarik standartları.",
    groups: {
      teknik: { title: "1. Ürün Grubu & Malzeme Niteliği", desc: "Ahşap/çelik niteliği, AISI 304 paslanmaz sac ve adetler" },
      mevzuat: { title: "2. TSE Standartları & E0/E1 Emisyon", desc: "TSE EN 527 ofis mobilyası ve formaldehit E1 sertifikası" },
      ticari: { title: "3. Montaj, Yerleşim & Garanti", desc: "Katlara taşıma, anahtar teslim montaj ve garanti süresi" }
    },
    quickPresets: [
      {
        label: "50 Kişilik Açık Ofis Çalışma İstasyonu Seti",
        values: {"mobilyaGrubu": "Ofis Çalışma Masası, Keson & Dolap Grubu", "toplamTakimAdedi": 50, "tseMobilyaStandarti": true, "katlaraTasimaVeMontaj": true}
      },
      {
        label: "Paslanmaz Endüstriyel Mutfak Donanımı",
        values: {"mobilyaGrubu": "Endüstriyel Mutfak (AISI 304 Paslanmaz Çelik)", "malzemeKalitesi": "AISI 304 Kalite 18/10 Paslanmaz Çelik Sac", "toplamTakimAdedi": 25}
      }
    ],
    fields: [
      {
        id: "mobilyaGrubu",
        label: "Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Ofis Çalışma Masası, Keson & Dolap Grubu", "Ergonomik Fileli / Deri Yönetici Koltukları", "Endüstriyel Mutfak (AISI 304 Paslanmaz Çelik)", "Ağır Yük & Arşiv Raf Sistemleri", "Kurumsal Beyaz Eşya & Ankastre Set"],
        defaultValue: "Ofis Çalışma Masası, Keson & Dolap Grubu"
      },
      {
        id: "toplamTakimAdedi",
        label: "Toplam Takım / Parça Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet / Takım",
        placeholder: "Örn: 80",
        defaultValue: 80
      },
      {
        id: "malzemeKalitesi",
        label: "Ahşap / Metal Gövde Standardı",
        type: "select",
        group: "teknik",
        options: ["1. Sınıf E1 Melamin Kaplı Yonga Levha (25mm Tabla)", "Elektrostatik Toz Boyalı Kutu Profil Çelik Ayak", "AISI 304 Kalite 18/10 Paslanmaz Çelik Sac", "Doğal Masif / Doğal Ahşap Kaplama"],
        defaultValue: "1. Sınıf E1 Melamin Kaplı Yonga Levha (25mm Tabla)"
      },
      {
        id: "tseMobilyaStandarti",
        label: "TSE EN 527 ve TSE EN 1335 Standart Uygunluk Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "e1FormaldehitSertifikasi",
        label: "E1 Kanserojen Madde İçermez Emisyon Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "katlaraTasimaVeMontaj",
        label: "Belirtilen Katlara Taşıma ve Yerinde Montaj Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "mobilyaGarantiSuresi",
        label: "Garanti ve Servis Süresi",
        type: "select",
        group: "ticari",
        options: ["2 Yıl Tam Garanti", "3 Yıl Kapsamlı Garanti", "5 Yıl Mekanizma Garantisi"],
        defaultValue: "2 Yıl Tam Garanti"
      }
    ]
  },
  // =========================================================================
  // HIRDAVAT_METAL
  // =========================================================================
  hirdavat_metal: {
    key: "hirdavat_metal",
    name: "Hırdavat, Metal, Profil & Plastik Hammadde İhalesi",
    icon: "Wrench",
    badgeText: "🔩 Hırdavat & Metal Şartnamesi",
    description: "Civata, somun, kutu profil, sac, polimer plastik granül ve endüstriyel el aletleri toptan tedarik kriterleri.",
    groups: {
      teknik: { title: "1. Metal / Hammadde Cinsi & Metraj", desc: "Çelik kalitesi, et kalınlığı, tonaj ve parça adedi" },
      mevzuat: { title: "2. EN 10204 3.1 & TSE Standartları", desc: "Malzeme test sertifikası 3.1 ve galvaniz kaplama mikronu" },
      ticari: { title: "3. Paketleme, İstif & Sevk Şartları", desc: "Bağ halinde sevkiyat ve fabrika kantar tartımı" }
    },
    quickPresets: [
      {
        label: "50 Ton S235JR Sanayi Boru ve Profil Alımı",
        values: {"hammaddeTuru": "Kutu Profil, Boru & Sanayi Profilleri", "siparisMiktari": 50, "celikKaliteSinifi": "S235JR (St 37-2)", "en10204TestSertifikasi": true}
      },
      {
        label: "10.000 Adet 8.8 Kalite M16 Civata & Somun Seti",
        values: {"hammaddeTuru": "8.8 / 10.9 Kalite Galvanizli Civata & Somun", "siparisMiktari": 10000, "celikKaliteSinifi": "8.8 Yüksek Mukavemetli Çelik"}
      }
    ],
    fields: [
      {
        id: "hammaddeTuru",
        label: "Metal / Hırdavat Malzeme Türü",
        type: "select",
        group: "teknik",
        options: ["Kutu Profil, Boru & Sanayi Profilleri", "S235JR / S355JR Sıcak/Soğuk Haddelenmiş Sac", "8.8 / 10.9 Kalite Galvanizli Civata & Somun", "Polietilen / Polipropilen Plastik Granül", "Endüstriyel Elektrikli El Aletleri & Sarf Malzemeleri"],
        defaultValue: "Kutu Profil, Boru & Sanayi Profilleri"
      },
      {
        id: "siparisMiktari",
        label: "Toplam Sipariş Tonajı / Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton / Adet",
        placeholder: "Örn: 40",
        defaultValue: 40
      },
      {
        id: "celikKaliteSinifi",
        label: "Çelik / Malzeme Kalite Sınıfı",
        type: "select",
        group: "teknik",
        options: ["S235JR (St 37-2)", "S275JR (St 44-2)", "S355JR (St 52-3)", "AISI 304 Paslanmaz Çelik", "8.8 Yüksek Mukavemetli Çelik"],
        defaultValue: "S235JR (St 37-2)"
      },
      {
        id: "en10204TestSertifikasi",
        label: "EN 10204 3.1 Kimyasal ve Mekanik Test Sertifikası Zorunlu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sicakDaldirmaGalvaniz",
        label: "TSE EN ISO 1461 Sıcak Daldırma Galvaniz Kaplama Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "kantarTartimProseduru",
        label: "Alıcı Tesis Kantarında Yapılan Net Tartım Esas Alınacaktır",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "baglamaVePaketleme",
        label: "Standart Çelik Şeritli Bağ & Nem Önleyici Ambalaj",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // YANGIN_GUVENLIK
  // =========================================================================
  yangin_guvenlik: {
    key: "yangin_guvenlik",
    name: "Yangın Algılama & Otomatik Söndürme Sistemleri İhalesi",
    icon: "Flame",
    badgeText: "🧯 Yangın & Güvenlik Şartnamesi",
    description: "Adresli yangın algılama, sulu sprinkler, FM200/Novec gazlı söndürme ve yangın kapısı şartnameleri.",
    groups: {
      teknik: { title: "1. Sistem Türü & Saha Kapasitesi", desc: "Adresli dedektör sayısı, sprinkler hattı ve gazlı oda hacmi" },
      mevzuat: { title: "2. BYKHY & EN 54 / UL-FM Standartları", desc: "Binaların Yangından Korunması Yönetmeliği ve EN 54 belgesi" },
      ticari: { title: "3. Test, İtfaiye Uygunluk & Periyodik Bakım", desc: "İtfaiye yangın raporu desteği ve yıllık bakım taahhüdü" }
    },
    quickPresets: [
      {
        label: "300 Dedektörlü Adresli Yangın Algılama Sistemi",
        values: {"sistemTipi": "Adresli Yangın Algılama & İhbar Paneli", "noktaVeyaHacim": 300, "en54VdUlfmsertifikasi": true, "bykhyUygunlugu": true}
      },
      {
        label: "Sistem Odası FM-200 Gazlı Söndürme",
        values: {"sistemTipi": "Gazlı Söndürme Sistemi (FM-200 / Novec 1230)", "noktaVeyaHacim": 80, "en54VdUlfmsertifikasi": true}
      }
    ],
    fields: [
      {
        id: "sistemTipi",
        label: "Yangın Güvenlik Sistem Türü",
        type: "select",
        group: "teknik",
        options: ["Adresli Yangın Algılama & İhbar Paneli", "Islak / Kuru Borulu Otomatik Sprinkler Söndürme", "Gazlı Söndürme Sistemi (FM-200 / Novec 1230)", "Davlumbaz Otomatik Yangın Söndürme", "Yangın Pompa Grubu (Dizel + Elektrik + Jokey)", "Panik Barlı Yangına Dayanıklı Çelik Kapı"],
        defaultValue: "Adresli Yangın Algılama & İhbar Paneli"
      },
      {
        id: "noktaVeyaHacim",
        label: "Nokta Dedektör Adedi veya Alan m²",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Nokta / m²",
        placeholder: "Örn: 250",
        defaultValue: 250
      },
      {
        id: "en54VdUlfmsertifikasi",
        label: "EN 54 / VdS / UL-FM Uluslararası Sertifikasyon",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "bykhyUygunlugu",
        label: "Binaların Yangından Korunması Hakkında Yönetmelik Tam Uyumu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "itfaiyeRuhsatDestegi",
        label: "Belediye İtfaiye Uygunluk Raporu Alımına Teknik Müşavirlik Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "periyodikBakimPaketi",
        label: "Montaj Sonrası Periyodik Test & Bakım Taahhüdü",
        type: "select",
        group: "ticari",
        options: ["1 Yıl (4 Periyot) Sözleşmeli Bakım", "2 Yıl (8 Periyot) Kapsamlı Bakım", "Yalnızca İlk Devreye Alma Testi"],
        defaultValue: "1 Yıl (4 Periyot) Sözleşmeli Bakım"
      }
    ]
  },
  // =========================================================================
  // KIMYASAL_GUBRE
  // =========================================================================
  kimyasal_gubre: {
    key: "kimyasal_gubre",
    name: "Endüstriyel Kimyasal, Gübre & Dezenfektan İhalesi",
    icon: "TestTube",
    badgeText: "🧪 Kimyasal & Gübre Şartnamesi",
    description: "Endüstriyel asit/bazlar, tarımsal kompoze gübreler, su şartlandırma kimyasalları ve biyosidal ürün standartları.",
    groups: {
      teknik: { title: "1. Kimyasal Grubu & Saflık Derecesi", desc: "Kimyasal formül, konsantrasyon % ve ambalaj tipi" },
      mevzuat: { title: "2. Güvenlik Bilgi Formu (GBF/MSDS) & Ruhsat", desc: "Sağlık Bakanlığı biyosidal ruhsatı ve ADR uygunluğu" },
      ticari: { title: "3. IBC/Tanker Teslimi & Pompalama", desc: "Alıcı sahası stok tankına pompalama ve analiz şahit numunesi" }
    },
    quickPresets: [
      {
        label: "20 Ton Sıvı Klor / Hipoklorit Alımı",
        values: {"kimyasalKategorisi": "İçme/Kazan Suyu Şartlandırma Kimyasalları", "siparisMiktariTon": 20, "konsantrasyonSaflik": "%48 - %50 Sıvı Konsantre", "msdsGbfFormu": true, "ambalajSekli": "1.000 Litrelik Çelik Kafesli IBC Tank"}
      },
      {
        label: "40 Ton Katı Üre / Kompoze Gübre Tedariği",
        values: {"kimyasalKategorisi": "Tarımsal Katı / Sıvı Gübre (Üre, DAP, NPK)", "siparisMiktariTon": 40, "ambalajSekli": "25 kg / 50 kg Polietilen Bidon / Çuval"}
      }
    ],
    fields: [
      {
        id: "kimyasalKategorisi",
        label: "Kimyasal / Gübre Sınıfı",
        type: "select",
        group: "teknik",
        options: ["Endüstriyel Temel Kimyasal (Kostik, Asit, Klor)", "Tarımsal Katı / Sıvı Gübre (Üre, DAP, NPK)", "İçme/Kazan Suyu Şartlandırma Kimyasalları", "Sağlık Bakanlığı Onaylı Biyosidal Dezenfektan", "Yüzey İşlem ve Boya Sökücü Kimyasallar"],
        defaultValue: "Endüstriyel Temel Kimyasal (Kostik, Asit, Klor)"
      },
      {
        id: "siparisMiktariTon",
        label: "Toplam Talep Edilen Miktar",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton / Litre",
        placeholder: "Örn: 20",
        defaultValue: 20
      },
      {
        id: "konsantrasyonSaflik",
        label: "Asgari Konsantrasyon / Saflık Derecesi",
        type: "select",
        group: "teknik",
        options: ["%98 - %99 Teknik Saf", "%48 - %50 Sıvı Konsantre", "%30 - %33 Konsantre Çözelti", "Gıda Tipi / Analitik Saflık"],
        defaultValue: "%48 - %50 Sıvı Konsantre"
      },
      {
        id: "msdsGbfFormu",
        label: "Türkçe Güvenlik Bilgi Formu (GBF / SDS) Mevcut",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "biyosidalRuhsat",
        label: "Sağlık Bakanlığı Biyosidal Ürün Ruhsatı (Gereken Ürünlerde)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "adrTasimaUygunlugu",
        label: "ADR Tehlikeli Madde Karayolu Taşımacılığı Uygunluk Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "ambalajSekli",
        label: "Ambalaj ve Sevkiyat Yöntemi",
        type: "select",
        group: "ticari",
        options: ["1.000 Litrelik Çelik Kafesli IBC Tank", "Dökme Tanker ile Alıcı Stok Tankına Boşaltım", "25 kg / 50 kg Polietilen Bidon / Çuval", "Varil (200 Litre)"],
        defaultValue: "1.000 Litrelik Çelik Kafesli IBC Tank"
      }
    ]
  },
  // =========================================================================
  // MATBAA_KIRTASIYE
  // =========================================================================
  matbaa_kirtasiye: {
    key: "matbaa_kirtasiye",
    name: "Matbaa, Ambalaj Koli & Kırtasiye İhalesi",
    icon: "Package",
    badgeText: "📦 Matbaa & Ambalaj Şartnamesi",
    description: "Ofset/dijital baskı, oluklu mukavva koli, orijinal toner ve fotokopi kağıdı toptan alımları için FSC ve baskı prova kriterleri.",
    groups: {
      teknik: { title: "1. Ürün Türü, Gramaj & Baskı Detayları", desc: "Kağıt cinsi g/m², mukavva dalga cinsi ve adetler" },
      mevzuat: { title: "2. FSC & Çevre Standartları", desc: "FSC sertifikalı kağıt, geri dönüştürülebilirlik ve gıda uyumu" },
      ticari: { title: "3. Baskı Provası, Koli İçi Paket & Teslimat", desc: "Baskı öncesi renk provası onayı ve kısmi depo teslimatı" }
    },
    quickPresets: [
      {
        label: "1.000 Koli 80g A4 Fotokopi Kağıdı",
        values: {"kirtasiyeMatbaaTuru": "A4 / A3 80g Fotokopi Kağıdı Toptan", "siparisAdedi": 1000, "kagitGramajiVeCinsi": "80 g/m² 1. Hamur Beyaz Kağıt", "fscSertifikasi": true}
      },
      {
        label: "25.000 Adet Çift Dalga Dopel İhracat Kolisi",
        values: {"kirtasiyeMatbaaTuru": "Oluklu Mukavva Koli & Karton Ambalaj Kutusu", "siparisAdedi": 25000, "kagitGramajiVeCinsi": "Çift Dalga (Dopel) B/C Dalga Kraft Koli"}
      }
    ],
    fields: [
      {
        id: "kirtasiyeMatbaaTuru",
        label: "Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Ofset / Dijital Süreli Yayın & Kitapçık Baskısı", "Oluklu Mukavva Koli & Karton Ambalaj Kutusu", "A4 / A3 80g Fotokopi Kağıdı Toptan", "Orijinal / Yüksek Kapasiteli Lazer Toner", "Kurumsal Baskılı Promosyon & Etiket Grubu"],
        defaultValue: "Ofset / Dijital Süreli Yayın & Kitapçık Baskısı"
      },
      {
        id: "siparisAdedi",
        label: "Talep Edilen Miktar / Adet",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet / Paket",
        placeholder: "Örn: 10000",
        defaultValue: 10000
      },
      {
        id: "kagitGramajiVeCinsi",
        label: "Kağıt / Mukavva Özelliği",
        type: "select",
        group: "teknik",
        options: ["80 g/m² 1. Hamur Beyaz Kağıt", "135 g/m² - 170 g/m² Parlak Kuşe Kağıt", "Çift Dalga (Dopel) B/C Dalga Kraft Koli", "Amerikan Bristol 300 g/m² Selofanlı", "Doğal Kraft Geri Dönüştürülmüş"],
        defaultValue: "80 g/m² 1. Hamur Beyaz Kağıt"
      },
      {
        id: "fscSertifikasi",
        label: "FSC (Orman Yönetim Konseyi) Sürdürülebilirlik Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gidaTemasUygunlugu",
        label: "Gıda Temasına Uygunluk (Gıda Kolisi/Ambalajı İçin)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "baskiProvasiOnayi",
        label: "Baskı Öncesi Fiziksel Renk Provası (Proof) Islak İmza Onayı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "paletliVeStrecliTeslim",
        label: "Euro Palet Üzerinde Streçlenmiş ve Barkodlu Teslimat",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // KENT_MOBILYALARI
  // =========================================================================
  kent_mobilyalari: {
    key: "kent_mobilyalari",
    name: "Kent Mobilyaları, Prefabrik & Alüminyum Doğrama İhalesi",
    icon: "Building",
    badgeText: "🏙️ Kent Mobilyaları Şartnamesi",
    description: "Park bankları, duraklar, çocuk oyun parkları, prefabrik şantiye yapıları ve dış cephe doğrama alım kriterleri.",
    groups: {
      teknik: { title: "1. Ürün Cinsi, Malzeme & Ebatlar", desc: "Ahşap emprenye cinsi, metal karkas ve prefabrik panel kalınlığı" },
      mevzuat: { title: "2. TSE EN 1176 Güvenlik Standartları", desc: "Çocuk oyun alanları güvenliği ve kar/rüzgar yükü hesapları" },
      ticari: { title: "3. Ankraj, Zemin Montajı & Garanti", desc: "Betonarme zemine çelik dübelli montaj ve dış hava dayanım garantisi" }
    },
    quickPresets: [
      {
        label: "100 Adet Ahşap-Döküm Park Bankı",
        values: {"urunTuru": "Park & Bahçe Bankları ve Çöp Kovaları", "toplamMiktarAdet": 100, "malzemeOzelligi": "Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap", "sahadaAnkrajVeMontaj": true}
      },
      {
        label: "250 m² Prefabrik Şantiye Ofis Binası",
        values: {"urunTuru": "Prefabrik Şantiye Ofisi / Yatakhane Binası", "toplamMiktarAdet": 250, "karVeRuzgarStatikRaporu": true}
      }
    ],
    fields: [
      {
        id: "urunTuru",
        label: "Kent Mobilyası / Yapı Türü",
        type: "select",
        group: "teknik",
        options: ["Park & Bahçe Bankları ve Çöp Kovaları", "Prefabrik Şantiye Ofisi / Yatakhane Binası", "Alüminyum & Isı Yalıtımlı Çift Cam Doğrama", "Çocuk Oyun Parkı Grubu & Kauçuk Zemin", "Modern Otobüs Durağı & Güvenlik Kulübesi"],
        defaultValue: "Park & Bahçe Bankları ve Çöp Kovaları"
      },
      {
        id: "toplamMiktarAdet",
        label: "Toplam Miktar / Adet veya m²",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet / m²",
        placeholder: "Örn: 50",
        defaultValue: 50
      },
      {
        id: "malzemeOzelligi",
        label: "Hammadde ve Kaplama Özelliği",
        type: "select",
        group: "teknik",
        options: ["Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap", "Elektrostatik Fırın Boyalı Döküm/Çelik Ayak", "Poliüretan Dolgulu Sandviç Panel (Dış Duvar 50mm)", "Termal Bariyerli Alüminyum Profil Serisi"],
        defaultValue: "Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap"
      },
      {
        id: "tseEn1176Guvenlik",
        label: "TSE EN 1176 / TSE EN 1177 Oyun Alanı Güvenlik Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "karVeRuzgarStatikRaporu",
        label: "Prefabrik Yapılarda İlgili Bölge Kar ve Rüzgar Statik Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sahadaAnkrajVeMontaj",
        label: "Saha Zeminine Çelik Ankraj ile Sabitleme ve Montaj Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "disHavaGarantiSuresi",
        label: "Dış Hava Şartlarına Karşı Paslanmazlık/Çürümezlik Garantisi",
        type: "select",
        group: "ticari",
        options: ["2 Yıl Garanti", "3 Yıl Garanti", "5 Yıl Kapsamlı Garanti"],
        defaultValue: "3 Yıl Garanti"
      }
    ]
  },
  // =========================================================================
  // MUHENDISLIK_MIMARLIK
  // =========================================================================
  muhendislik_mimarlik: {
    key: "muhendislik_mimarlik",
    name: "Mühendislik, Mimarlık & Müşavirlik İhalesi",
    icon: "Compass",
    badgeText: "📐 Mühendislik & Proje Şartnamesi",
    description: "Statik betonarme/çelik hesapları, mimari uygulama projeleri, zemin etütleri ve teknik müşavirlik şartları.",
    groups: {
      teknik: { title: "1. Mühendislik Disiplini & Metraj", desc: "Statik, mimari, mekanik, elektrik veya geoteknik kapsam" },
      mevzuat: { title: "2. TMMOB Büro Tescil & Mesleki Sorumluluk", desc: "İlgili oda tescil belgesi (BTB) ve mesleki sorumluluk sigortası" },
      ticari: { title: "3. Belediye/Resmî Kurum Onay Taahhüdü", desc: "Ruhsat onayına kadar revizyon taahhüdü ve hakediş" }
    },
    quickPresets: [
      {
        label: "10.000 m² Karma Yapı Mimari & Statik Projesi",
        values: {"projeDisiplini": "Statik Betonarme & Çelik Konstrüksiyon Hesap Raporu", "toplamProjeAlaniM2": 10000, "tmmobBuroTescilBelgesi": true, "resmiKurumOnayTaahhudu": true}
      },
      {
        label: "Sondajlı Geoteknik Zemin Etüt Raporu",
        values: {"projeDisiplini": "Geoteknik Rapor & Sismik Zemin Etüdü", "toplamProjeAlaniM2": 5000}
      }
    ],
    fields: [
      {
        id: "projeDisiplini",
        label: "Mühendislik / Mimarlık Alanı",
        type: "select",
        group: "teknik",
        options: ["Mimari & 3D Görselleştirme Uygulama Projesi", "Statik Betonarme & Çelik Konstrüksiyon Hesap Raporu", "Geoteknik Rapor & Sismik Zemin Etüdü", "Mekanik & Sıhhi Tesisat Yangın Tahliye Projesi", "Elektrik AG/OG & Zayıf Akım Projelendirme", "Teknik Müşavirlik, Kontrollük & Hakediş Danışmanlığı"],
        defaultValue: "Mimari & 3D Görselleştirme Uygulama Projesi"
      },
      {
        id: "toplamProjeAlaniM2",
        label: "Projelendirilecek Toplam Alan",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 8500",
        defaultValue: 8500
      },
      {
        id: "tmmobBuroTescilBelgesi",
        label: "TMMOB İlgili Odadan Onaylı Güncel Büro Tescil Belgesi (BTB)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "meslekiSorumlulukSigortasi",
        label: "Proje Bedelini Kapsayan Mesleki Sorumluluk Sigortası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "resmiKurumOnayTaahhudu",
        label: "İlgili Belediye / Kurum Onaylanana Kadar Ücretsiz Revizyon",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "bimVeDwgTeslimat",
        label: "BIM (Revit / IFC) ve DWG Formatında Eksiksiz Dijital Teslimat",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // MADENCILIK_SONDAJ
  // =========================================================================
  madencilik_sondaj: {
    key: "madencilik_sondaj",
    name: "Madencilik, Kuyu Sondajı & Taş Ocağı İhalesi",
    icon: "Mountain",
    badgeText: "⛏️ Madencilik & Sondaj Şartnamesi",
    description: "Derin su/jeotermal sondajı, taş ocağı işletmeciliği, kırma-eleme ve maden rezerv tespit çalışmaları.",
    groups: {
      teknik: { title: "1. Sondaj Metrajı & Makine Kapasitesi", desc: "Kuyu derinliği metre, borulama çapı ve kırma-eleme tonajı" },
      mevzuat: { title: "2. MAPEG Maden Ruhsatı & DSİ İzinleri", desc: "Maden İşleri Genel Müdürlüğü işletme izni ve ÇED raporu" },
      ticari: { title: "3. İnkişaf, Pompa Testi & Metre Başı İlerleme", desc: "Metre başı birim fiyat, inkişaf ve debi ölçüm raporu" }
    },
    quickPresets: [
      {
        label: "300 Metre Derin Su Sondajı ve Borulama",
        values: {"sondajTuru": "Derin Artezyen Su Sondajı & Kuyulama", "hedefDerinlikMetre": 300, "mapegVeDsiIzni": true, "kuyuInkisafVeDebiTesti": true}
      },
      {
        label: "50.000 Ton Kırma Eleme Taş Ocağı Hizmeti",
        values: {"sondajTuru": "Taş Ocağı Kalker/Bazalt Kırma-Eleme İşi", "hedefDerinlikMetre": 50000}
      }
    ],
    fields: [
      {
        id: "sondajTuru",
        label: "Madencilik / Sondaj Faaliyet Türü",
        type: "select",
        group: "teknik",
        options: ["Derin Artezyen Su Sondajı & Kuyulama", "Jeotermal & Maden Arama Karotlu Sondajı", "Taş Ocağı Kalker/Bazalt Kırma-Eleme İşi", "Mermer & Granit Blok Çıkarma Hizmeti", "Jeolojik Rezerv & Jeofizik Etüt Raporu"],
        defaultValue: "Derin Artezyen Su Sondajı & Kuyulama"
      },
      {
        id: "hedefDerinlikMetre",
        label: "Hedeflenen Derinlik / Metraj",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Metre / Ton",
        placeholder: "Örn: 350",
        defaultValue: 350
      },
      {
        id: "boruVeKuyuCapi",
        label: "Kuyu / Delgi Çapı",
        type: "select",
        group: "teknik",
        options: ["8 1/2 inç (Su Sondajı)", "12 1/4 inç Ağır Tip Delgi", "HQ / NQ Karot Çapı", "Serbest Delme Çapı"],
        defaultValue: "8 1/2 inç (Su Sondajı)"
      },
      {
        id: "mapegVeDsiIzni",
        label: "DSİ Yeraltı Suyu Arama/Kullanma veya MAPEG İzni Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "cedUygunlukRaporu",
        label: "ÇED Gerekli Değildir / ÇED Olumlu Kararı Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kuyuInkisafVeDebiTesti",
        label: "Basınçlı Hava ile İnkişaf ve 24 Saatlik Debi Pompa Testi Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "fiyatlandirmaYontemi",
        label: "Ödeme Esası",
        type: "select",
        group: "ticari",
        options: ["Metre İlerleme Başına Birim Fiyat", "Su Çıkması Halinde Götürü Bedel", "Aylık Makine & Ekipman Kiralama"],
        defaultValue: "Metre İlerleme Başına Birim Fiyat"
      }
    ]
  },
  // =========================================================================
  // ASANSOR_OTOMASYON
  // =========================================================================
  asansor_otomasyon: {
    key: "asansor_otomasyon",
    name: "Asansör, Yürüyen Merdiven & Bina Otomasyonu İhalesi",
    icon: "ArrowUpDown",
    badgeText: "🛗 Asansör & Otomasyon Şartnamesi",
    description: "MRL dişlisiz yolcu/yük asansörleri, yürüyen merdivenler ve BMS bina otomasyonu için EN 81-20 ve yeşil etiket kriterleri.",
    groups: {
      teknik: { title: "1. Asansör Türü, Durak Sayısı & Hız", desc: "Kişi/kg kapasitesi, durak sayısı ve kabin tasarımı" },
      mevzuat: { title: "2. EN 81-20/50 & CE Asansör Yönetmeliği", desc: "Avrupa asansör direktifi 2014/33/AB ve A tipi muayene yeşil etiketi" },
      ticari: { title: "3. Montaj, Ruhsatlandırma & Bakım", desc: "Belediye tescili, yeşil etiket alımı ve 2 yıl ücretsiz aylık bakım" }
    },
    quickPresets: [
      {
        label: "10 Durak 800 kg MRL Dişlisiz Yolcu Asansörü",
        values: {"asansorTipi": "MRL Makine Dairesiz Dişlisiz Yolcu Asansörü", "kapasiteKg": "800 kg (10 Kişilik)", "durakSayisi": 10, "kabinHizi": "1.6 m/sn", "yesilEtiketRuhsatSarti": true}
      },
      {
        label: "1000 kg Sedye Asansörü",
        values: {"asansorTipi": "Hastane Sedye Asansörü (Geniş Kabin)", "kapasiteKg": "1000 kg (13 Kişilik Sedye)", "durakSayisi": 6}
      }
    ],
    fields: [
      {
        id: "asansorTipi",
        label: "Asansör / Otomasyon Tipi",
        type: "select",
        group: "teknik",
        options: ["MRL Makine Dairesiz Dişlisiz Yolcu Asansörü", "Ağır Hizmet Tipi Hidrolik Yük Asansörü", "Halka Açık Alan Ağır Tip Yürüyen Merdiven / Bant", "Hastane Sedye Asansörü (Geniş Kabin)", "Entegre Bina Otomasyon Sistemi (BMS / HVAC/Aydınlatma)"],
        defaultValue: "MRL Makine Dairesiz Dişlisiz Yolcu Asansörü"
      },
      {
        id: "kapasiteKg",
        label: "Taşıma Kapasitesi",
        type: "select",
        group: "teknik",
        options: ["630 kg (8 Kişilik)", "800 kg (10 Kişilik)", "1000 kg (13 Kişilik Sedye)", "1600 kg - 2500 kg (Ağır Yük)", "5000 kg (Araç Asansörü)"],
        defaultValue: "800 kg (10 Kişilik)"
      },
      {
        id: "durakSayisi",
        label: "Durak Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Durak",
        placeholder: "Örn: 10",
        defaultValue: 10
      },
      {
        id: "kabinHizi",
        label: "Kabin Seyir Hızı",
        type: "select",
        group: "teknik",
        options: ["1.0 m/sn", "1.6 m/sn", "2.0 m/sn", "2.5 m/sn+"],
        defaultValue: "1.6 m/sn"
      },
      {
        id: "en81StandartUygunlugu",
        label: "TSE EN 81-20 / EN 81-50 Güvenlik ve İmalat Standart Uyumu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "yesilEtiketRuhsatSarti",
        label: "Belediye Tescili ve A Tipi Muayene Yeşil Etiket Alım Taahhüdü",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "aylikPeriyodikBakimDahil",
        label: "2 Yıl Garanti Süresince Aylık Periyodik Bakım ve Acil Servis Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // KLIMA_HAVALANDIRMA
  // =========================================================================
  klima_havalandirma: {
    key: "klima_havalandirma",
    name: "Klima, Soğutma, Isıtma & Havalandırma (HVAC) İhalesi",
    icon: "Fan",
    badgeText: "❄️ HVAC & Havalandırma Şartnamesi",
    description: "Merkezi VRF/VRV klima sistemleri, su soğutmalı chiller grupları, galvaniz havalandırma kanalları ve kazan dairesi kriterleri.",
    groups: {
      teknik: { title: "1. Isıtma/Soğutma Kapasitesi & Sistem Cinsi", desc: "kW/BTU gücü, dış ünite sayısı ve kanal metrajı" },
      mevzuat: { title: "2. Eurovent, ERP Ecodesign & Çevre İzinleri", desc: "Eurovent sertifikası, ERP 2021 Ecodesign ve ozon dostu R32 gazı" },
      ticari: { title: "3. Montaj, Bakır Borulama & Test-Ayar (TAB)", desc: "Test, Ayar, Dengeleme (TAB) devreye alma raporu" }
    },
    quickPresets: [
      {
        label: "250 kW Isı Pompalı VRF Klima Sistemi",
        values: {"hvacSistemi": "Merkezi Değişken Debili VRF / VRV Klima Sistemi", "toplamSogutmaGucuKw": 250, "gazCinsi": "R32 (Düşük Küresel Isınma Potansiyeli GWP)", "euroventSertifikasi": true, "bakirBoruVeIzolasyonDahil": true}
      },
      {
        label: "400 kW Vidalı Kompresörlü Su Soğutma Grubu (Chiller)",
        values: {"hvacSistemi": "Hava / Su Soğutmalı Chiller Soğutma Grubu", "toplamSogutmaGucuKw": 400}
      }
    ],
    fields: [
      {
        id: "hvacSistemi",
        label: "Sistem Türü",
        type: "select",
        group: "teknik",
        options: ["Merkezi Değişken Debili VRF / VRV Klima Sistemi", "Hava / Su Soğutmalı Chiller Soğutma Grubu", "Klima Santrali (AHU) & Hijyenik Santral", "Galvaniz Sac Havalandırma Kanal İmalatı & Menfezler", "Kaskad Yoğuşmalı Kazan Dairesi Isıtma Tesisatı"],
        defaultValue: "Merkezi Değişken Debili VRF / VRV Klima Sistemi"
      },
      {
        id: "toplamSogutmaGucuKw",
        label: "Toplam Isıtma / Soğutma Gücü",
        type: "number",
        group: "teknik",
        required: true,
        unit: "kW",
        placeholder: "Örn: 220",
        defaultValue: 220
      },
      {
        id: "gazCinsi",
        label: "Soğutucu Akışkan Cinsi",
        type: "select",
        group: "teknik",
        options: ["R32 (Düşük Küresel Isınma Potansiyeli GWP)", "R410A Çevre Dostu Gaz", "R134a / R1234ze (Chiller Gazı)"],
        defaultValue: "R32 (Düşük Küresel Isınma Potansiyeli GWP)"
      },
      {
        id: "euroventSertifikasi",
        label: "Eurovent ve CE Standart Onay Sertifikası Zorunlu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "erpEcodesignUygunluk",
        label: "Avrupa Birliği ErP Lot 21 Ecodesign Enerji Verimliliği",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "bakirBoruVeIzolasyonDahil",
        label: "Tüm Bakır Borulama, Armaflex İzolasyon ve Kablolama Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "tabDevreyeAlmaRaporu",
        label: "Test, Ayar ve Dengeleme (TAB) Devreye Alma Raporu Teslimi",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // SAVUNMA_HAVACILIK
  // =========================================================================
  savunma_havacilik: {
    key: "savunma_havacilik",
    name: "Savunma Sanayi, Denizcilik & Havacılık İhalesi",
    icon: "Shield",
    badgeText: "🛡️ Savunma & Havacılık Şartnamesi",
    description: "Taktik balistik koruyucu donanım, askeri haberleşme elektroniği, deniz botu yedek parça ve havacılık sarf kriterleri.",
    groups: {
      teknik: { title: "1. Savunma / Havacılık Sınıfı & Kapsam", desc: "Balistik seviye NIJ, askeri haberleşme frekansı ve adetler" },
      mevzuat: { title: "2. MSB Üretim İzni & Askeri Standartlar", desc: "Milli Savunma Bakanlığı izinleri, NATO Kodlandırma ve MIL-STD" },
      ticari: { title: "3. Gizlilik Sözleşmesi (NDA) & Muayene", desc: "Kurumsal gizlilik taahhüdü ve askeri kabul muayene heyeti onay" }
    },
    quickPresets: [
      {
        label: "1.000 Adet NIJ Level IV Balistik Yelek & Plaka",
        values: {"savunmaAlani": "Balistik Koruyucu Yelek, Kask & Kompozit Plaka", "balistikKorumaSeviyesi": "NIJ Level IV (Zırh Delici Mühimmat)", "talepMiktariAdet": 1000, "msbUretimIzni": true, "milStdAskeriUygunluk": true}
      },
      {
        label: "Askeri Frekans Taktik El Telsizi Seti",
        values: {"savunmaAlani": "Askeri Taktik Telsiz & Şifreli Haberleşme Donanımı", "balistikKorumaSeviyesi": "Balistik Şartı Yok / Elektronik Teçhizat", "talepMiktariAdet": 100}
      }
    ],
    fields: [
      {
        id: "savunmaAlani",
        label: "Savunma / Havacılık Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Balistik Koruyucu Yelek, Kask & Kompozit Plaka", "Askeri Taktik Telsiz & Şifreli Haberleşme Donanımı", "Devriye Botu / Deniz Araçları Bakım & Yedek Parça", "Havacılık Yapısal & Aviyonik Sarf Malzemeleri", "Askeri Saha Çadırı & Taktik Donanım"],
        defaultValue: "Balistik Koruyucu Yelek, Kask & Kompozit Plaka"
      },
      {
        id: "balistikKorumaSeviyesi",
        label: "Balistik Koruma Seviyesi (Varsa)",
        type: "select",
        group: "teknik",
        options: ["NIJ Level III-A (Tabanca Mühimmatı)", "NIJ Level III (7.62x51mm NATO Tüfek)", "NIJ Level IV (Zırh Delici Mühimmat)", "Balistik Şartı Yok / Elektronik Teçhizat"],
        defaultValue: "NIJ Level IV (Zırh Delici Mühimmat)"
      },
      {
        id: "talepMiktariAdet",
        label: "Talep Edilen Parça / Takım Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet / Takım",
        placeholder: "Örn: 500",
        defaultValue: 500
      },
      {
        id: "msbUretimIzni",
        label: "MSB (Milli Savunma Bakanlığı) Tesis Güvenlik ve Üretim İzni",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "milStdAskeriUygunluk",
        label: "MIL-STD-810G Askeri Çevre Koşulları Test Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "natoStokNumarasi",
        label: "NATO Stok Numarası (NSN) Kaydı Taahhüdü",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gizlilikSozlesmesiNda",
        label: "Gizlilik Sözleşmesi (NDA) ve Fikri Mülkiyet Devri İmzası",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // ARAC_IS_MAKINESI
  // =========================================================================
  arac_is_makinesi: {
    key: "arac_is_makinesi",
    name: "Taşıt, İş Makinesi & Filo Tedarik İhalesi",
    icon: "Truck",
    badgeText: "🚜 Taşıt & İş Makinesi Şartnamesi",
    description: "Ekskavatör, beko loder, binek/ticari filo kiralama ve satın alma ihaleleri için çalışma saati ve yetkili servis kriterleri.",
    groups: {
      teknik: { title: "1. Taşıt / Makine Sınıfı & Tonaj", desc: "Kova hacmi, tonaj, motor beygir gücü (HP) ve adetler" },
      mevzuat: { title: "2. Karayolu Uygunluk & Periyodik Muayene", desc: "TÜVTÜRK muayenesi, ruhsat tescili ve CE işareti" },
      ticari: { title: "3. Kiralama/Satın Alma & Servis Bakım", desc: "Operatörlü/operatörsüz seçenek ve 7/24 yerinde mobil servis" }
    },
    quickPresets: [
      {
        label: "3 Adet Sıfır 30 Ton Paletli Ekskavatör Alımı",
        values: {"aracSinifi": "Paletli / Lastikli Ekskavatör (22 - 35 Ton)", "aracAdedi": 3, "maksimumCalismaSaati": "Sıfır km / 0 Çalışma Saati", "sozlesmeTuru": "Doğrudan Satın Alma & Devir"}
      },
      {
        label: "10 Adet Hafif Ticari Çift Kabin Kiralama",
        values: {"aracSinifi": "Hafif Ticari Panelvan & Çift Kabin Kamyonet", "aracAdedi": 10, "sozlesmeTuru": "Uzun Dönem Operasyonel Kiralama (12 - 36 Ay)"}
      }
    ],
    fields: [
      {
        id: "aracSinifi",
        label: "Taşıt / İş Makinesi Türü",
        type: "select",
        group: "teknik",
        options: ["Paletli / Lastikli Ekskavatör (22 - 35 Ton)", "Kazıcı Yükleyici (Beko Loder 4x4)", "Teleskopik Yükleyici (Telehandler)", "Binek Otomobil & SUV Filo Alımı / Kiralama", "Hafif Ticari Panelvan & Çift Kabin Kamyonet", "Damperli Hafriyat Kamyonu (8x4 / 6x4)"],
        defaultValue: "Paletli / Lastikli Ekskavatör (22 - 35 Ton)"
      },
      {
        id: "aracAdedi",
        label: "İhale Kapsamındaki Araç Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet",
        placeholder: "Örn: 5",
        defaultValue: 5
      },
      {
        id: "maksimumCalismaSaati",
        label: "Maksimum Çalışma Saati / Kilometre",
        type: "select",
        group: "teknik",
        options: ["Sıfır km / 0 Çalışma Saati", "En Fazla 2.500 Çalışma Saati / 40.000 km", "En Fazla 5.000 Çalışma Saati / 80.000 km"],
        defaultValue: "Sıfır km / 0 Çalışma Saati"
      },
      {
        id: "sozlesmeTuru",
        label: "Edinim Modeli",
        type: "select",
        group: "ticari",
        options: ["Doğrudan Satın Alma & Devir", "Uzun Dönem Operasyonel Kiralama (12 - 36 Ay)", "Operatörlü & Yakıt Hariç Proje Bazlı Kiralama"],
        defaultValue: "Doğrudan Satın Alma & Devir"
      },
      {
        id: "ceVeMuayeneUygunlugu",
        label: "İş Makinesi CE Sertifikası ve Geçerli Periyodik Kontrol Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kaskoVeTrafikDahil",
        label: "Tam Kapsamlı Genişletilmiş Kasko ve Trafik Sigortası Dahil",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "yerindeMobilServis",
        label: "Arıza Durumunda 24 Saat İçinde Sahada Mobil Servis / İkame Araç",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // TURIZM_ORGANIZASYON
  // =========================================================================
  turizm_organizasyon: {
    key: "turizm_organizasyon",
    name: "Turizm, Kongre & Etkinlik Organizasyonu İhalesi",
    icon: "Calendar",
    badgeText: "🎪 Turizm & Organizasyon Şartnamesi",
    description: "Kurumsal kongre, seminer, festival, düğün ve sahne-ışık kiralama hizmetleri için TÜRSAB A grubu ve teknik prodüksiyon kriterleri.",
    groups: {
      teknik: { title: "1. Etkinlik Türü & Katılımcı Kapasitesi", desc: "Kişi sayısı, konaklama, salon düzeni ve sahne/ışık donanımı" },
      mevzuat: { title: "2. TÜRSAB & Turizm Bakanlığı İzinleri", desc: "A Grubu seyahat acentası işletme belgesi ve etkinlik sigortası" },
      ticari: { title: "3. Karşılama, Transfer & İkram Paketi", desc: "Havalimanı VIP transferi, gala yemeği ve no-show esnekliği" }
    },
    quickPresets: [
      {
        label: "300 Kişilik 3 Günlük Kurumsal Kongre",
        values: {"etkinlikTuru": "Kurumsal Kongre, Seminer & Lansman", "katilimciSayisi": 300, "teknikProduksiyonDahil": true, "tursabAGrubuBelgesi": true}
      },
      {
        label: "Büyük Ölçekli Açık Hava Festivali",
        values: {"etkinlikTuru": "Konser, Festival, Sahne & Müzik Etkinliği", "katilimciSayisi": 2500, "teknikProduksiyonDahil": true}
      }
    ],
    fields: [
      {
        id: "etkinlikTuru",
        label: "Organizasyon / Etkinlik Türü",
        type: "select",
        group: "teknik",
        options: ["Kurumsal Kongre, Seminer & Lansman", "Konser, Festival, Sahne & Müzik Etkinliği", "Düğün, Nişan & Protokol Davetleri", "Kültür, Doğa & Yurt Dışı Gezi Turları", "Hac ve Umre Organizasyon Paketleri"],
        defaultValue: "Kurumsal Kongre, Seminer & Lansman"
      },
      {
        id: "katilimciSayisi",
        label: "Tahmini Katılımcı / Davetli Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Kişi",
        placeholder: "Örn: 350",
        defaultValue: 350
      },
      {
        id: "teknikProduksiyonDahil",
        label: "Profesyonel Ses, Işık, Truss & LED Ekran Dahil",
        type: "boolean",
        group: "teknik",
        defaultValue: true
      },
      {
        id: "tursabAGrubuBelgesi",
        label: "TÜRSAB A Grubu Seyahat Acentası İşletme Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "etkinlikMaliMesuliyetSigortasi",
        label: "Üçüncü Şahıs Mali Mesuliyet ve Etkinlik Sigortası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "vipTransferVeKarsilama",
        label: "Havalimanı - Otel VIP Transfer ve Karşılama Hizmeti Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "fiyatlandirmaModeli",
        label: "Fiyatlandırma Şekli",
        type: "select",
        group: "ticari",
        options: ["Kişi Başı Her Şey Dahil Paket Fiyat", "Kalem Bazlı Şeffaf Bütçeleme + Ajans Komisyonu", "Götürü Bedel Anahtar Teslim"],
        defaultValue: "Kişi Başı Her Şey Dahil Paket Fiyat"
      }
    ]
  },
  // =========================================================================
  // REKLAM_TANITIM
  // =========================================================================
  reklam_tanitim: {
    key: "reklam_tanitim",
    name: "Açıkhava Reklam, Tabela, Billboard & Stand İhalesi",
    icon: "Megaphone",
    badgeText: "📢 Reklam & Tanıtım Şartnamesi",
    description: "Işıklı totem tabela, billboard kiralama, araç giydirme, dijital LED ekran ve modüler fuar standı tedarik standartları.",
    groups: {
      teknik: { title: "1. Reklam Ürünü, Boyutlar & Işıklandırma", desc: "Kutu harf, totem yüksekliği, LED piksel aralığı ve ebatlar" },
      mevzuat: { title: "2. Belediye İlan/Reklam İzni & Statik Hesap", desc: "Rüzgar statik dayanımı, CE/IP65 sertifikası ve belediye vergisi" },
      ticari: { title: "3. Saha Montajı, Vinç & LED Modül Garantisi", desc: "Vinçli montaj dahil teslim ve trafo/LED garantisi" }
    },
    quickPresets: [
      {
        label: "12 Metre Işıklı Otoyol Totem Tabelası",
        values: {"reklamTuru": "Ağır Hizmet Çift Taraflı Otoyol Totemi", "olcuM2VeyaAdet": 36, "ruzgarStatikHesapRaporu": true, "sahadaVincliMontaj": true}
      },
      {
        label: "Kurumsal Cephe Işıklı Kutu Harf Tabela",
        values: {"reklamTuru": "Işıklı Kutu Harf Cephe Tabelası", "olcuM2VeyaAdet": 15, "isiklandirmaStandarti": "IP67 Su Geçirmez Samsung/Seoul LED Modül"}
      }
    ],
    fields: [
      {
        id: "reklamTuru",
        label: "Reklam / Tanıtım Ünitesi Türü",
        type: "select",
        group: "teknik",
        options: ["Işıklı Kutu Harf Cephe Tabelası", "Ağır Hizmet Çift Taraflı Otoyol Totemi", "Billboard & Raket (CLP) Açıkhava Ağı", "Dış Mekan SMD Dijital LED Ekran Paneli", "Özel Tasarım Ahşap / Alüminyum Fuar Standı", "Cast Folyo Araç Filosu Giydirme"],
        defaultValue: "Işıklı Kutu Harf Cephe Tabelası"
      },
      {
        id: "olcuM2VeyaAdet",
        label: "Toplam Ölçü (m²) veya Ünite Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m² / Adet",
        placeholder: "Örn: 24",
        defaultValue: 24
      },
      {
        id: "isiklandirmaStandarti",
        label: "Aydınlatma / LED Teknolojisi",
        type: "select",
        group: "teknik",
        options: ["IP67 Su Geçirmez Samsung/Seoul LED Modül", "P3.91 / P4.81 Dış Mekan Yüksek Parlaklık LED Panel", "İçten Floresan / Floresansız", "Işıksız Mat Baskı"],
        defaultValue: "IP67 Su Geçirmez Samsung/Seoul LED Modül"
      },
      {
        id: "ruzgarStatikHesapRaporu",
        label: "Totem ve Çatılarda İnşaat Mühendisi İmzalı Rüzgar Statik Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "belediyeVergiTakibi",
        label: "Belediye İlan ve Reklam Vergisi Projelendirme Desteği",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "sahadaVincliMontaj",
        label: "Sepetli Vinç ile Şantiye/Bina Cephesine Montaj Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "ledVeTrafoGarantisi",
        label: "LED Modül ve Güç Kaynağı Garantisi",
        type: "select",
        group: "ticari",
        options: ["2 Yıl Parça ve İşçilik Garantisi", "3 Yıl Kapsamlı Garanti", "5 Yıl LED Modül Garantisi"],
        defaultValue: "2 Yıl Parça ve İşçilik Garantisi"
      }
    ]
  },
  // =========================================================================
  // PEYZAJ_ORMANCILIK
  // =========================================================================
  peyzaj_ormancilik: {
    key: "peyzaj_ormancilik",
    name: "Peyzaj Uygulama, Rulo Çim & Bahçe Sulama İhalesi",
    icon: "Trees",
    badgeText: "🌲 Peyzaj & Ormancılık Şartnamesi",
    description: "Hazır rulo çim serme, otomatik pop-up sulama hattı, fidan/ağaç dikimi ve periyodik yeşil alan bakım kriterleri.",
    groups: {
      teknik: { title: "1. Peyzaj Alanı & Bitki Özellikleri", desc: "Yeşil alan m², çim türü, ağaç boyu ve sulama bölge sayısı" },
      mevzuat: { title: "2. Bitki Pasaportu & Ziraat Mühendisi Denetimi", desc: "Tarım Bakanlığı bitki sağlık sertifikası ve ziraat mühendisi kontrolü" },
      ticari: { title: "3. Tutma Garantisi & Periyodik Bakım", desc: "1 yıllık kuruma/tutma garantisi ve mevsimlik çim biçme takvimi" }
    },
    quickPresets: [
      {
        label: "3.000 m² Otomatik Sulamalı Rulo Çim Uygulaması",
        values: {"peyzajKapsami": "Hazır Doğal Rulo Çim Temini ve Serimi", "toplamAlanM2": 3000, "cimTuru": "4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim", "bitkiTutmaGarantisi": true, "otomatikSulamaOtomasyonu": true}
      },
      {
        label: "Yıllık Kurumsal Kampüs Yeşil Alan Bakım Hizmeti",
        values: {"peyzajKapsami": "Yıllık Periyodik Yeşil Alan Bakımı (Biçme/İlaçlama/Gübreleme)", "toplamAlanM2": 10000}
      }
    ],
    fields: [
      {
        id: "peyzajKapsami",
        label: "Peyzaj & Bahçe Uygulama Türü",
        type: "select",
        group: "teknik",
        options: ["Hazır Doğal Rulo Çim Temini ve Serimi", "Otomatik Pop-Up Bahçe Sulama Sistemi Kurulumu", "Yetişkin İbreli / Yapraklı Ağaç Fidanı Dikimi", "Mevsimlik Çiçeklendirme & Çalı Grubu Dikimi", "Yıllık Periyodik Yeşil Alan Bakımı (Biçme/İlaçlama/Gübreleme)"],
        defaultValue: "Hazır Doğal Rulo Çim Temini ve Serimi"
      },
      {
        id: "toplamAlanM2",
        label: "Uygulama Yapılacak Alan",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 2500",
        defaultValue: 2500
      },
      {
        id: "cimTuru",
        label: "Çim / Bitki Karışımı Türü",
        type: "select",
        group: "teknik",
        options: ["4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim", "Bermuda (Uganda) Sıcağa Dayanıklı Çim", "İthal 6 Karışım Villa Çimi", "Karışımsız / Serbest"],
        defaultValue: "4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim"
      },
      {
        id: "bitkiPasaportu",
        label: "Tarım Bakanlığı Onaylı Resmi Bitki Pasaportu Zorunluluğu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "ziraatMuhendisiKontrolu",
        label: "Uygulamanın Ziraat / Peyzaj Mühendisi Nezaretinde Yapılması",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "bitkiTutmaGarantisi",
        label: "Dikilen Bitki ve Çimlerde 1 Yıl Birebir Tutma/Yenileme Garantisi",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "otomatikSulamaOtomasyonu",
        label: "Yağmur Sensörlü ve Wi-Fi Kontrollü Sulama Kontrol Ünitesi",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // HAYVANCILIK_YEM
  // =========================================================================
  hayvancilik_yem: {
    key: "hayvancilik_yem",
    name: "Hayvancılık, Karma Yem & Veterinerlik İhalesi",
    icon: "Beef",
    badgeText: "🐄 Hayvancılık & Yem Şartnamesi",
    description: "Büyükbaş/küçükbaş karma besi ve süt yemi, veteriner aşıları ve canlı damızlık hayvan alım parametreleri.",
    groups: {
      teknik: { title: "1. Yem / Hayvan Cinsi & Besin Değerleri", desc: "Ham protein %, ham selüloz, ME enerji ve hayvan ırkı" },
      mevzuat: { title: "2. Tarım Bakanlığı TÜRKVET & Sağlık Sertifikası", desc: "TÜRKVET küpe kaydı, ari işletme belgesi ve aşı kartları" },
      ticari: { title: "3. Çuvallı/Dökme Silobas Teslim & Numune Analizi", desc: "Çiftlik silolarına silobasla basım ve bağımsız analiz onayı" }
    },
    quickPresets: [
      {
        label: "60 Ton %18 Proteinli Pelet Süt Yemi (Silobas)",
        values: {"yemHayvanKategorisi": "Büyükbaş Süt & Besi Karma Yemi", "miktarTonVeyaBas": 60, "hamProteinOrani": "En Az %18 HP (Yüksek Verim Süt)", "silobasVeyaCuvalTeslimat": "Dökme Silobas ile Çiftlik Yem Silosuna Dolum"}
      },
      {
        label: "20 Baş Simental Gebe Düve Alımı",
        values: {"yemHayvanKategorisi": "Canlı Damızlık Gebe Düve / Koç Alımı", "miktarTonVeyaBas": 20, "turkvetKayitBelgesi": true, "hastaliktanAriIsletme": true}
      }
    ],
    fields: [
      {
        id: "yemHayvanKategorisi",
        label: "Kategori",
        type: "select",
        group: "teknik",
        options: ["Büyükbaş Süt & Besi Karma Yemi", "Küçükbaş Kuzu & Koyun Büyütme Yemi", "Kanatlı Etlik & Yumurta Piliç Yemi", "Canlı Damızlık Gebe Düve / Koç Alımı", "Veteriner İlaç, Aşı & Biyolojik Ürünler"],
        defaultValue: "Büyükbaş Süt & Besi Karma Yemi"
      },
      {
        id: "miktarTonVeyaBas",
        label: "Toplam Talep Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton / Baş",
        placeholder: "Örn: 30",
        defaultValue: 30
      },
      {
        id: "hamProteinOrani",
        label: "Asgari Ham Protein Oranı",
        type: "select",
        group: "teknik",
        options: ["En Az %18 HP (Yüksek Verim Süt)", "En Az %16 HP (Standart Besi)", "En Az %21 HP (Buzağı / Kuzu Başlangıç)", "Belirtilmedi / Canlı Hayvan"],
        defaultValue: "En Az %18 HP (Yüksek Verim Süt)"
      },
      {
        id: "turkvetKayitBelgesi",
        label: "Tarım Bakanlığı TÜRKVET Sistem Kaydı ve Kulak Küpesi Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "hastaliktanAriIsletme",
        label: "Tüberküloz ve Brusellozdan Ari İşletme Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "aflatoksinVeMikotoksinRaporu",
        label: "Her Sevkiyatta Akredite Mikotoksin / Aflatoksin Analiz Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "silobasVeyaCuvalTeslimat",
        label: "Teslimat Şekli",
        type: "select",
        group: "ticari",
        options: ["Dökme Silobas ile Çiftlik Yem Silosuna Dolum", "50 kg Polipropilen Çuvallı Paletli Teslim", "Canlı Nakil Aracı ile Çiftlik İndirmeli"],
        defaultValue: "Dökme Silobas ile Çiftlik Yem Silosuna Dolum"
      }
    ]
  },
  // =========================================================================
  // SANAT_HEYKEL
  // =========================================================================
  sanat_heykel: {
    key: "sanat_heykel",
    name: "Sanat Eseri, Anıt Heykel & Mimari Maket İhalesi",
    icon: "Palette",
    badgeText: "🎨 Sanat & Heykel Şartnamesi",
    description: "Meydan anıtı bronz döküm heykeller, mimari ölçekli maketler, sanatsal rölyefler ve müzik enstrümanı kriterleri.",
    groups: {
      teknik: { title: "1. Sanat Eseri Türü, Boyut & Malzeme", desc: "Bronz, fiber, mermer cinsi, maket ölçeği ve enstrüman markası" },
      mevzuat: { title: "2. Heykeltıraş Eser Hakkı & Fikir Sanat Eserleri", desc: "5846 sayılı FSEK telif devri ve jüri/seçici kurul onayı" },
      ticari: { title: "3. Kaide İnşaatı, Işıklandırma & Taşıma", desc: "Betonarme kaide montajı ve özel korumalı sandıkta teslimat" }
    },
    quickPresets: [
      {
        label: "3 Metrelik Bronz Döküm Meydan Heykeli",
        values: {"eserTuru": "Bronz Döküm Anıt & Meydan Heykeli", "malzemeCinsi": "Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)", "olcekVeyaEbatMetre": "3.00 Metre Yükseklik (Kaide Hariç)", "fsekTelifDevri": true, "kaideVeAydinlatmaDahil": true}
      },
      {
        label: "1/100 Ölçekli Işıklı Konut Projesi Maketi",
        values: {"eserTuru": "Mimari Satış & Tanıtım Maketi (Işıklı)", "olcekVeyaEbatMetre": "1/100 Ölçekli Mimari Maket"}
      }
    ],
    fields: [
      {
        id: "eserTuru",
        label: "Eser / Ürün Türü",
        type: "select",
        group: "teknik",
        options: ["Bronz Döküm Anıt & Meydan Heykeli", "Mimari Satış & Tanıtım Maketi (Işıklı)", "Sanatsal Duvar Rölyefi & Seramik Pano", "Senfoni & Konservatuvar Müzik Aletleri", "Tarihi Eser Konservasyon & Restorasyonu"],
        defaultValue: "Bronz Döküm Anıt & Meydan Heykeli"
      },
      {
        id: "malzemeCinsi",
        label: "Ana Malzeme",
        type: "select",
        group: "teknik",
        options: ["Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)", "1. Sınıf Beyaz Muğla / Marmara Mermeri", "Poliüretan Korumalı Fiberglas (CTP)", "Pleksiglas & Ahşap Detaylı Pleksi Maket"],
        defaultValue: "Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)"
      },
      {
        id: "olcekVeyaEbatMetre",
        label: "Heykel Yüksekliği (m) veya Maket Ölçeği",
        type: "select",
        group: "teknik",
        options: ["1/100 Ölçekli Mimari Maket", "1/50 Ölçekli Detaylı Maket", "3.00 Metre Yükseklik (Kaide Hariç)", "4.50 Metre Anıtsal Yükseklik", "Doğal Boyut (1:1)"],
        defaultValue: "3.00 Metre Yükseklik (Kaide Hariç)"
      },
      {
        id: "fsekTelifDevri",
        label: "5846 Sayılı FSEK Kapsamında Tüm Mali Hakların Süresiz Devri",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "heykeltrasSeciciKurulOnayi",
        label: "1/10 Boyutlu Çamur/Alçı Eskizin Seçici Kurulca Onaylanması",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kaideVeAydinlatmaDahil",
        label: "Granit Kaplı Betonarme Kaide ve Gece LED Aydınlatması Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "ozelSandikliNakliye",
        label: "Titreşim Önleyici Özel İklimlendirmeli Sandık ile Teslimat",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // ODUN_KOMUR
  // =========================================================================
  odun_komur: {
    key: "odun_komur",
    name: "Sanayi Kömürü, Pelet & Odun Katı Yakıt İhalesi",
    icon: "Flame",
    badgeText: "🪵 Katı Yakıt & Kömür Şartnamesi",
    description: "Sanayi/ısınma kömürü, odun peleti, meşe/çam odunu toptan alımları için kalori analiz raporu ve çevre satış izin belgesi.",
    groups: {
      teknik: { title: "1. Yakıt Türü, Kalori Değeri & Kül Oranı", desc: "Alt ısıl değer kcal/kg, kükürt oranı, rutubet ve ebatlar" },
      mevzuat: { title: "2. Çevre Bakanlığı İzin & Uygunluk Belgesi", desc: "Hava kalitesi yönetmeliği uygunluk belgesi ve orman işletme nakliyesi" },
      ticari: { title: "3. Torbalı/Dökme Teslimat & Kantar Tartımı", desc: "25 kg kraft/polipropilen torba ve alıcı kantarı tartımı" }
    },
    quickPresets: [
      {
        label: "100 Ton İthal 7.000 Kalori Fındık Kömür",
        values: {"katiYakitTuru": "İthal Fındık / Ceviz Sanayi & Isınma Kömürü", "siparisMiktariTon": 100, "asgariKaloriDegeri": "En Az 7.000 kcal/kg (1. Kalite İthal)", "cevreVeSehircilikSatisIzinBelgesi": true}
      },
      {
        label: "50 Ton ENplus A1 Çam Odun Peleti Alımı",
        values: {"katiYakitTuru": "DIN Plus / EN Plus A1 Odun Peleti", "siparisMiktariTon": 50, "asgariKaloriDegeri": "En Az 4.800 kcal/kg (A1 Pelet)"}
      }
    ],
    fields: [
      {
        id: "katiYakitTuru",
        label: "Katı Yakıt Türü",
        type: "select",
        group: "teknik",
        options: ["İthal Fındık / Ceviz Sanayi & Isınma Kömürü", "Yerli Yıkanmış Linyit Kömürü (Torbalı)", "DIN Plus / EN Plus A1 Odun Peleti", "Fırınlanmış Meşe / Gürgen Şömine Odunu", "Prina / Biyokütle Katı Yakıt"],
        defaultValue: "İthal Fındık / Ceviz Sanayi & Isınma Kömürü"
      },
      {
        id: "siparisMiktariTon",
        label: "Toplam Talep Edilen Miktar",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton",
        placeholder: "Örn: 100",
        defaultValue: 100
      },
      {
        id: "asgariKaloriDegeri",
        label: "Asgari Alt Isıl Değer",
        type: "select",
        group: "teknik",
        options: ["En Az 7.000 kcal/kg (1. Kalite İthal)", "En Az 6.000 kcal/kg", "En Az 4.500 kcal/kg (Yerli Linyit)", "En Az 4.800 kcal/kg (A1 Pelet)"],
        defaultValue: "En Az 7.000 kcal/kg (1. Kalite İthal)"
      },
      {
        id: "maksimumKulKukurt",
        label: "Kül ve Kükürt Sınırı",
        type: "select",
        group: "teknik",
        options: ["Kül: Azami %8, Kükürt: Azami %0.9", "Kül: Azami %12, Kükürt: Azami %1.5", "Kül: Azami %0.7 (ENplus A1 Pelet)"],
        defaultValue: "Kül: Azami %8, Kükürt: Azami %0.9"
      },
      {
        id: "cevreVeSehircilikSatisIzinBelgesi",
        label: "Çevre ve Şehircilik İl Müdürlüğü Katı Yakıt Satış İzin Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "ormanIsletmeNakliyeMakbuzu",
        label: "Orman Genel Müdürlüğü Onaylı Resmi Nakliye Tezkeresi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "torbaliPaketleme",
        label: "Ambalaj Şekli",
        type: "select",
        group: "ticari",
        options: ["25 kg Orijinal Lamineli Çuval / Torba", "1.000 kg Big-Bag Çuval", "Dökme Kamyon ile Depo Sahasına Boşaltım"],
        defaultValue: "25 kg Orijinal Lamineli Çuval / Torba"
      }
    ]
  },
  // =========================================================================
  // HAZIR_YEMEK_IKRAM
  // =========================================================================
  hazir_yemek_ikram: {
    key: "hazir_yemek_ikram",
    name: "Hazır Yemek, Tabldot Catering & Kumanya İhalesi",
    icon: "UtensilsCrossed",
    badgeText: "🍽️ Catering & Hazır Yemek Şartnamesi",
    description: "Kurumsal fabrikalar ve kurumlar için 4 kap sıcak tabldot yemek, yerinde üretim veya taşımalı servis, kalori ve ISO 22000 şartları.",
    groups: {
      teknik: { title: "1. Menü Yapısı & Günlük Kişi Sayısı", desc: "Kişi sayısı, öğün (öğle/akşam/gece), 4 kap menü ve kalori aralığı" },
      mevzuat: { title: "2. Tarım Bakanlığı İzin & ISO 22000 Gıda Güvenliği", desc: "Gıda üretim izni, HACCP ve gıda mühendisi istihdamı zorunluluğu" },
      ticari: { title: "3. Servis Modeli, Termobox & Servis Personeli", desc: "Taşımalı termobox veya mutfakta yerinde pişirme, servis elemanı" }
    },
    quickPresets: [
      {
        label: "500 Kişilik Fabrika Taşımalı Tabldot Hizmeti",
        values: {"gunlukKisiSayisi": 500, "servisBicimi": "Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)", "menuKapSayisi": "4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)", "iso22000HaccpBelgesi": true, "servisPersoneliVeBulasikDahil": true}
      },
      {
        label: "150 Kişilik Yerinde Pişirmeli Kurumsal Yemek",
        values: {"gunlukKisiSayisi": 150, "servisBicimi": "Müşteri Mutfağında Yerinde Pişirme ve Sunum", "gidaMuhendisiSarti": true}
      }
    ],
    fields: [
      {
        id: "gunlukKisiSayisi",
        label: "Günlük Yemek Yiyecek Kişi Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Kişi/Gün",
        placeholder: "Örn: 300",
        defaultValue: 300
      },
      {
        id: "servisBicimi",
        label: "Hizmet & Üretim Modeli",
        type: "select",
        group: "teknik",
        options: ["Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)", "Müşteri Mutfağında Yerinde Pişirme ve Sunum", "Paketli Kumanya & Sandviç Dağıtımı", "Açık Büfe / Protokol VIP Tabldot"],
        defaultValue: "Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)"
      },
      {
        id: "menuKapSayisi",
        label: "Menü Kapsamı",
        type: "select",
        group: "teknik",
        options: ["4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)", "5 Kap Geniş Menü + Salata Bar", "3 Kap Diyet / Hafif Menü"],
        defaultValue: "4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)"
      },
      {
        id: "asgariKaloriDegeri",
        label: "Öğün Başına Asgari Kalori",
        type: "select",
        group: "teknik",
        options: ["850 - 1.100 kcal (Ağır Sanayi / Şantiye)", "700 - 850 kcal (Ofis / Standart)", "550 - 700 kcal (Hafif Kalorili)"],
        defaultValue: "850 - 1.100 kcal (Ağır Sanayi / Şantiye)"
      },
      {
        id: "iso22000HaccpBelgesi",
        label: "ISO 22000 Gıda Güvenliği Yönetim Sistemi ve HACCP Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gidaMuhendisiSarti",
        label: "Üretim Tesisinde Tam Zamanlı Gıda Mühendisi / Diyetisyen Denetimi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "servisPersoneliVeBulasikDahil",
        label: "Yemek Dağıtım Garsonu, Ekmek/Baharat ve Bulaşık Yıkama Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // ELEKTRONIK_BILGISAYAR
  // =========================================================================
  elektronik_bilgisayar: {
    key: "elektronik_bilgisayar",
    name: "Bilgisayar Donanımı, Sunucu & Ölçü Aletleri İhalesi",
    icon: "Monitor",
    badgeText: "🖥️ Donanım & Bilişim Şartnamesi",
    description: "Dizüstü iş bilgisayarları, veri merkezi sunucuları, network anahtarları ve akredite kalibrasyonlu laboratuvar ölçü aletleri.",
    groups: {
      teknik: { title: "1. Donanım Türü, İşlemci & Bellek", desc: "CPU nesli, RAM GB, NVMe SSD boyutu ve port sayısı" },
      mevzuat: { title: "2. CE, Enerji Verimliliği & Kalibrasyon", desc: "CE uygunluğu, Energy Star belgesi ve TÜRKAK onaylı kalibrasyon" },
      ticari: { title: "3. Yerinde Servis Garantisi & Kurulum", desc: "Ertesi iş günü yerinde müdahale (NBD On-site) garantisi" }
    },
    quickPresets: [
      {
        label: "50 Adet i7 32GB Kurumsal Laptop Alımı",
        values: {"donanimTuru": "Kurumsal Dizüstü Bilgisayar (Laptop)", "cihazAdedi": 50, "islemciVeBellekKapasitesi": "Intel Core i7 / 32GB RAM / 1TB NVMe SSD", "yerindeGarantiTuru": "3 Yıl Yerinde Müdahale (Next Business Day On-Site)"}
      },
      {
        label: "2 Adet Çift Xeon Veri Merkezi Sunucusu",
        values: {"donanimTuru": "Rack Tipi Veri Merkezi Sunucusu (Server)", "cihazAdedi": 2, "islemciVeBellekKapasitesi": "Çift Intel Xeon / 128GB ECC RAM / 8TB SAS RAID (Sunucu)"}
      }
    ],
    fields: [
      {
        id: "donanimTuru",
        label: "Elektronik / Bilişim Cihaz Türü",
        type: "select",
        group: "teknik",
        options: ["Kurumsal Dizüstü Bilgisayar (Laptop)", "Masaüstü İş İstasyonu (Workstation PC)", "Rack Tipi Veri Merkezi Sunucusu (Server)", "Yönetilebilir Ağ Anahtarı (PoE Switch & Router)", "Hassas Elektronik Ölçü Aleti (Multimetre / Osiloskop)"],
        defaultValue: "Kurumsal Dizüstü Bilgisayar (Laptop)"
      },
      {
        id: "cihazAdedi",
        label: "Alınacak Donanım Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet",
        placeholder: "Örn: 50",
        defaultValue: 50
      },
      {
        id: "islemciVeBellekKapasitesi",
        label: "İşlemci / RAM / Depolama Standardı",
        type: "select",
        group: "teknik",
        options: ["Intel Core i7 / 32GB RAM / 1TB NVMe SSD", "Intel Core i5 / 16GB RAM / 512GB NVMe SSD", "Çift Intel Xeon / 128GB ECC RAM / 8TB SAS RAID (Sunucu)", "Kalibre Edilmiş Yüksek Hassasiyetli Laboratuvar Sınıfı"],
        defaultValue: "Intel Core i7 / 32GB RAM / 1TB NVMe SSD"
      },
      {
        id: "ceVeEnergyStar",
        label: "CE ve Energy Star Uluslararası Enerji Verimliliği Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "turkakKalibrasyonSertifikasi",
        label: "Ölçü Aletlerinde TÜRKAK Akredite İlk Kalibrasyon Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "yerindeGarantiTuru",
        label: "Garanti ve Teknik Servis Seviyesi",
        type: "select",
        group: "ticari",
        options: ["3 Yıl Yerinde Müdahale (Next Business Day On-Site)", "2 Yıl Standart Yetkili Servis Garantisi", "5 Yıl 7/24 4 Saat İçinde Kritik Parça Değişimi (Mission Critical)"],
        defaultValue: "3 Yıl Yerinde Müdahale (Next Business Day On-Site)"
      },
      {
        id: "isletimSistemiVeKurulum",
        label: "Orijinal Windows Pro Lisansı ve İmaj Yükleme Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // KAMERA_GUVENLIK_SCADA
  // =========================================================================
  kamera_guvenlik_scada: {
    key: "kamera_guvenlik_scada",
    name: "Kamera Güvenlik, Plaka Tanıma & SCADA Telemetri İhalesi",
    icon: "Camera",
    badgeText: "📹 Kamera & SCADA Şartnamesi",
    description: "IP CCTV güvenlik kameraları, Plaka Tanıma Sistemi (PTS), SCADA uzaktan izleme telemetri ve GPS filo takibi şartları.",
    groups: {
      teknik: { title: "1. Sistem Türü, Çözünürlük & Depolama", desc: "Kamera adedi, 4K/4MP çözünürlük, NVR kanal sayısı ve RAID kayıt" },
      mevzuat: { title: "2. EGM Kent Güvenlik (KGYS/PTS) & KVKK", desc: "Emniyet Genel Müdürlüğü KGYS entegrasyonu ve KVKK tabela şartı" },
      ticari: { title: "3. Fiber Optik Kablolama, Montaj & 7/24 İzleme", desc: "Altyapı kablolaması, devreye alma ve uzaktan izleme merkezi desteği" }
    },
    quickPresets: [
      {
        label: "32 Kameralı 4MP IP CCTV & NVR Kayıt Sistemi",
        values: {"guvenlikSistemiTuru": "IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi", "kameraKanalAdedi": 32, "cozunurlukVeOptik": "4MP WDR Smart IR (En Az 30m Gece Görüş)", "kayitSuresiVeRaid": "En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)", "fiberAltyapiVeMontajDahil": true}
      },
      {
        label: "Çift Şerit Otoyol Plaka Tanıma Sistemi (PTS)",
        values: {"guvenlikSistemiTuru": "Otoyol / Tesis Girişi Plaka Tanıma Sistemi (PTS)", "kameraKanalAdedi": 4, "egmPlakaTanimaUyumu": true}
      }
    ],
    fields: [
      {
        id: "guvenlikSistemiTuru",
        label: "Güvenlik / Otomasyon Sistemi",
        type: "select",
        group: "teknik",
        options: ["IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi", "Otoyol / Tesis Girişi Plaka Tanıma Sistemi (PTS)", "SCADA & Endüstriyel Telemetri Uzaktan İzleme", "Kurumsal Filo GPS Araç Takip & Canbus Entegrasyonu", "DMR Dijital Telsiz & Trunk Haberleşme Ağı"],
        defaultValue: "IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi"
      },
      {
        id: "kameraKanalAdedi",
        label: "Kamera / İzleme Noktası Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Nokta / Kamera",
        placeholder: "Örn: 32",
        defaultValue: 32
      },
      {
        id: "cozunurlukVeOptik",
        label: "Kamera Çözünürlüğü & Gece Görüş",
        type: "select",
        group: "teknik",
        options: ["4MP WDR Smart IR (En Az 30m Gece Görüş)", "4K Ultra HD Motorize Varifokal Lens", "PTZ 360° 32x Optik Zoom Uzun Mesafe IR (150m)", "Termal Çift Spektrumlu Çevre Güvenlik"],
        defaultValue: "4MP WDR Smart IR (En Az 30m Gece Görüş)"
      },
      {
        id: "kayitSuresiVeRaid",
        label: "Kayıt Süresi ve Disk Güvenliği",
        type: "select",
        group: "teknik",
        options: ["En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)", "En Az 60 Gün Kesintisiz Kayıt", "En Az 90 Gün Kayıt Depolama"],
        defaultValue: "En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)"
      },
      {
        id: "onvifVeCeUygunlugu",
        label: "ONVIF Profile S/G/T ve CE Uygunluk Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "egmPlakaTanimaUyumu",
        label: "Emniyet Genel Müdürlüğü (EGM) PTS Veritabanı Entegrasyon Uyumu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "fiberAltyapiVeMontajDahil",
        label: "Fiber Optik / Cat6 Altyapı Kablolaması ve Direk Montajı Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // TEMIZLIK_GERI_DONUSUM
  // =========================================================================
  temizlik_geri_donusum: {
    key: "temizlik_geri_donusum",
    name: "Endüstriyel Temizlik, İlaçlama & Atık Yönetimi İhalesi",
    icon: "Sparkles",
    badgeText: "🧹 Temizlik & Atık Yönetimi Şartnamesi",
    description: "Tesis/hastane temizliği, haşere/pest kontrol ilaçlama, tehlikesiz katı atık toplama ve geri dönüşüm ayrıştırma kriterleri.",
    groups: {
      teknik: { title: "1. Tesis Alanı & Temizlik Kapsamı", desc: "Kapalı/açık alan m², personel sayısı ve makine parkuru" },
      mevzuat: { title: "2. Çevre Bakanlığı İzin & Sağlık Bakanlığı Biyosidal", desc: "Tehlikesiz atık toplama-ayırma lisansı ve mesleki yeterlilik belgesi" },
      ticari: { title: "3. Sarf Malzemeleri, Otomatlar & Vardiya Düzeni", desc: "Zemin temizlik otomatları, kimyasal sarf ve 3 vardiya hizmeti" }
    },
    quickPresets: [
      {
        label: "15.000 m² Fabrika Entegre Temizlik & Makine Parkı",
        values: {"temizlikKapsami": "Entegre Tesis, Ofis & Fabrika Temizliği", "kapaliAlanM2": 15000, "personelSayisi": 10, "temizlikKimyasallariDahil": true, "biniciliOtomatTemini": true}
      },
      {
        label: "Yıllık Periyodik Pest Kontrol & İlaçlama Hizmeti",
        values: {"temizlikKapsami": "Haşere, Kemirgen İlaçlama & Pest Kontrol", "kapaliAlanM2": 25000, "saglikBakanligiBiyosidalIzin": true}
      }
    ],
    fields: [
      {
        id: "temizlikKapsami",
        label: "Hizmet / Faaliyet Türü",
        type: "select",
        group: "teknik",
        options: ["Entegre Tesis, Ofis & Fabrika Temizliği", "Hastane & Sağlık Kuruluşu Dezenfeksiyon Temizliği", "Haşere, Kemirgen İlaçlama & Pest Kontrol", "Katı Atık Toplama & Geri Dönüşüm Yönetimi", "Dış Cephe & Yüksek Cam Vinçli Temizlik"],
        defaultValue: "Entegre Tesis, Ofis & Fabrika Temizliği"
      },
      {
        id: "kapaliAlanM2",
        label: "Hizmet Verilecek Toplam Alan",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 15000",
        defaultValue: 15000
      },
      {
        id: "personelSayisi",
        label: "Görevlendirilecek Asgari Personel Sayısı",
        type: "number",
        group: "teknik",
        unit: "Kişi",
        placeholder: "Örn: 12",
        defaultValue: 12
      },
      {
        id: "saglikBakanligiBiyosidalIzin",
        label: "Sağlık Bakanlığı Onaylı Biyosidal İlaç Uygulama İzin Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "cevreVeSehircilikGeriDonusumLisansi",
        label: "Çevre ve Şehircilik Bakanlığı Atık Toplama / Geri Dönüşüm Lisansı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "temizlikKimyasallariDahil",
        label: "Tüm Temizlik Kimyasalları, Kağıt Havlu, Sıvı Sabun vb. Sarflar Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "biniciliOtomatTemini",
        label: "Yüklenici Tarafından Binicili Zemin Yıkama Otomatı Tahsisi Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // TEKSTIL_GIYIM
  // =========================================================================
  tekstil_giyim: {
    key: "tekstil_giyim",
    name: "Kurumsal İş Kıyafeti, Üniforma & Tekstil İhalesi",
    icon: "Shirt",
    badgeText: "👕 İş Kıyafeti & Tekstil Şartnamesi",
    description: "Kışlık/yazlık iş tulumları, reflektif montlar, S3 çelik burun iş ayakkabıları ve güvenlik üniformaları şartnamesi.",
    groups: {
      teknik: { title: "1. Kıyafet Türü, Kumaş Gramajı & Beden Dağılımı", desc: "Kumaş karışımı pamuk/polyester, reflektif şerit ve takım adedi" },
      mevzuat: { title: "2. EN ISO 20471 & OEKO-TEX Standartları", desc: "Yüksek görünürlük sertifikası ve OEKO-TEX Standard 100 onayı" },
      ticari: { title: "3. Kurumsal Logo Nakışı, Beden Deneme & Paketleme", desc: "Personel isimli paketleme ve teklif aşamasında numune onayı" }
    },
    quickPresets: [
      {
        label: "300 Takım Şantiye İş Pantolonu & Yeleği",
        values: {"tekstilUrunTuru": "Yazlık & Kışlık Şantiye İş Tulumu / Pantolon", "toplamTakimAdedi": 300, "kumasKarisimi": "%65 Pamuk - %35 Polyester 245 g/m² Gabardin", "kurumsalLogoNakisiDahil": true}
      },
      {
        label: "150 Adet EN ISO 20471 Reflektif Kışlık Parka",
        values: {"tekstilUrunTuru": "Yüksek Görünürlüklü Reflektif Parka / Yelek (EN ISO 20471)", "toplamTakimAdedi": 150, "enIso20471Sertifikasi": true}
      }
    ],
    fields: [
      {
        id: "tekstilUrunTuru",
        label: "İş Kıyafeti / Tekstil Ürün Grubu",
        type: "select",
        group: "teknik",
        options: ["Yazlık & Kışlık Şantiye İş Tulumu / Pantolon", "Yüksek Görünürlüklü Reflektif Parka / Yelek (EN ISO 20471)", "Özel Güvenlik Görevlisi Takım Üniforması", "S3 Çelik/Kompozit Burunlu Su Geçirmez İş Ayakkabısı", "Kurumsal Polo Yaka Tişört & Sweatshirt Grubu"],
        defaultValue: "Yazlık & Kışlık Şantiye İş Tulumu / Pantolon"
      },
      {
        id: "toplamTakimAdedi",
        label: "Toplam Takım / Adet Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Takım / Adet",
        placeholder: "Örn: 250",
        defaultValue: 250
      },
      {
        id: "kumasKarisimi",
        label: "Kumaş Spesifikasyonu ve Gramajı",
        type: "select",
        group: "teknik",
        options: ["%65 Pamuk - %35 Polyester 245 g/m² Gabardin", "%100 Pamuk Alev Almaz / Antistatik Kumaş (Proban)", "Su ve Rüzgar Geçirmez Bonded Kumaş Kışlık Parka", "Nefes Alabilir %100 Pamuk Penye 180 g/m²"],
        defaultValue: "%65 Pamuk - %35 Polyester 245 g/m² Gabardin"
      },
      {
        id: "enIso20471Sertifikasi",
        label: "EN ISO 20471 Yüksek Görünürlük Reflektif Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "oekoTexStandarti",
        label: "OEKO-TEX Standard 100 İnsan Sağlığına Zararsızlık Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kurumsalLogoNakisiDahil",
        label: "Göğüs ve Sırtta Kurumsal Nakış / Reflektif Baskı Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "personelAdinaPaketleme",
        label: "Personel Adı ve Bedenine Göre Ayrı Ayrı Poşetlenmiş Teslimat",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // IS_SAGLIGI_GUVENLIGI
  // =========================================================================
  is_sagligi_guvenligi: {
    key: "is_sagligi_guvenligi",
    name: "Kişisel Koruyucu Donanım (KKD) & İSG Malzemeleri İhalesi",
    icon: "ShieldAlert",
    badgeText: "⛑️ İSG & KKD Şartnamesi",
    description: "Baretler, paraşüt tipi emniyet kemerleri, yaşam hatları, gaz maskeleri ve acil durum duşları tedarik standartları.",
    groups: {
      teknik: { title: "1. KKD Türü & Koruma Seviyesi", desc: "Baret standardı EN 397, kemer EN 361 ve maske filtre sınıfı" },
      mevzuat: { title: "2. AB 2016/425 KKD Yönetmeliği & CE Belgesi", desc: "Kategori III KKD onaylanmış kuruluş CE sertifikası" },
      ticari: { title: "3. Toplu Paketleme, Kullanım Kılavuzu & Değişim", desc: "Türkçe kılavuz, raf ömrü garantisi ve hatalı parça değişimi" }
    },
    quickPresets: [
      {
        label: "500 Adet EN 397 Vidalı Ayarlı Şantiye Bareti",
        values: {"kkdKategorisi": "Endüstriyel Emniyet Bareti (EN 397)", "siparisAdedi": 500, "ceKategoriIiiSertifikasi": true, "yeniUretimRafOmru": true}
      },
      {
        label: "100 Adet Paraşüt Tipi Düşüş Durdurma Kemeri",
        values: {"kkdKategorisi": "Paraşüt Tipi Emniyet Kemeri & Yaşam Hattı (EN 361)", "siparisAdedi": 100, "ceKategoriIiiSertifikasi": true}
      }
    ],
    fields: [
      {
        id: "kkdKategorisi",
        label: "İSG Donanım Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Endüstriyel Emniyet Bareti (EN 397)", "Paraşüt Tipi Emniyet Kemeri & Yaşam Hattı (EN 361)", "FFP2 / FFP3 Solunum & Gaz Maskeleri (EN 149)", "Çapak & Kimyasal Koruyucu Gözlük / Yüz Siperi", "Gürültü Önleyici Kulaklık & Kulak Tıkacı (EN 352)", "Boy & Göz Acil Emniyet Duşu İstasyonu"],
        defaultValue: "Endüstriyel Emniyet Bareti (EN 397)"
      },
      {
        id: "siparisAdedi",
        label: "Talep Edilen Toplam Adet",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet",
        placeholder: "Örn: 500",
        defaultValue: 500
      },
      {
        id: "ceKategoriIiiSertifikasi",
        label: "Kategori III (Ölümcül Risk) Onaylanmış Kuruluş CE Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "tseEnUygunlukBelgesi",
        label: "İlgili TSE EN Standart Uygunluk Belgesi Zorunlu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "yeniUretimRafOmru",
        label: "Maksimum 6 Ay Önce Üretilmiş Yeni Tarihli Ürün Taahhüdü",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "numuneOnayProseduru",
        label: "İSG Uzmanı Tarafından Numune Testi ve Onayı Şartı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // OZEL_GUVENLIK
  // =========================================================================
  ozel_guvenlik: {
    key: "ozel_guvenlik",
    name: "5188 Sayılı Kanun Kapsamında Özel Güvenlik Hizmeti İhalesi",
    icon: "ShieldCheck",
    badgeText: "👮 Özel Güvenlik Şartnamesi",
    description: "Silahlı/silahsız güvenlik personeli temini, şantiye/fabrika gece bekçiliği, devriye tur kalemi ve X-ray kontrol kriterleri.",
    groups: {
      teknik: { title: "1. Vardiya Düzeni, Personel & Teçhizat", desc: "Kişi sayısı, vardiya saati (8/16 veya 12/36) ve devriye tur kalemi" },
      mevzuat: { title: "2. 5188 Sayılı Kanun & Valilik İzni", desc: "İçişleri Bakanlığı faaliyet izin belgesi ve özel güvenlik mali sorumluluk sigortası" },
      ticari: { title: "3. Üniforma, Telsiz, Cop/Kelepçe & Yemek Dahil", desc: "Tüm ekipman, telsiz ağı ve personel yemek/yol giderleri dahil" }
    },
    quickPresets: [
      {
        label: "7/24 Fabrika Koruma (8 Kişilik Silahsız Güvenlik)",
        values: {"guvenlikTuru": "Silahsız Özel Güvenlik Personeli Temini", "personelSayisi": 8, "vardiyaSistemi": "3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)", "faaliyetIzinBelgesi5188": true, "tehizatVeUniformaDahil": true}
      },
      {
        label: "Şantiye Gece Bekçiliği (2 Personel 12 Saat)",
        values: {"guvenlikTuru": "Tesis & Şantiye Gece Bekçiliği Hizmeti", "personelSayisi": 2, "vardiyaSistemi": "Yalnızca Gece Vardiyası (18:00 - 08:00)"}
      }
    ],
    fields: [
      {
        id: "guvenlikTuru",
        label: "Özel Güvenlik Hizmet Türü",
        type: "select",
        group: "teknik",
        options: ["Silahsız Özel Güvenlik Personeli Temini", "Silahlı Özel Güvenlik (Banka / Değerli Tesis)", "Tesis & Şantiye Gece Bekçiliği Hizmeti", "VIP Yakın Koruma & Özel Protokol Refakati", "Konser, Fuar & Etkinlik Geçici Güvenliği"],
        defaultValue: "Silahsız Özel Güvenlik Personeli Temini"
      },
      {
        id: "personelSayisi",
        label: "Görevlendirilecek Personel Sayısı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Kişi",
        placeholder: "Örn: 8",
        defaultValue: 8
      },
      {
        id: "vardiyaSistemi",
        label: "Vardiya ve Çalışma Düzeni",
        type: "select",
        group: "teknik",
        options: ["3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)", "2 Vardiya 12 Saat Sistem", "Yalnızca Gece Vardiyası (18:00 - 08:00)", "Hafta Sonu & Resmi Tatil Nöbeti"],
        defaultValue: "3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)"
      },
      {
        id: "faaliyetIzinBelgesi5188",
        label: "İçişleri Bakanlığı 5188 Sayılı Özel Güvenlik Şirketi Faaliyet İzin Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "maliSorumlulukSigortasi",
        label: "Zorunlu Özel Güvenlik Mali Sorumluluk Sigortası Poliçesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "tumPersonelKimlikKartli",
        label: "Tüm Görevlilerin Geçerli Özel Güvenlik Kimlik Kartına Sahip Olması",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "tehizatVeUniformaDahil",
        label: "Yazlık/Kışlık Üniforma, Telsiz, El Dedektörü ve Devriye Kalemi Dahil",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // EGITIM_TERCUME
  // =========================================================================
  egitim_tercume: {
    key: "egitim_tercume",
    name: "Yeminli Tercüme, Kurumsal Eğitim & Saha Araştırması İhalesi",
    icon: "GraduationCap",
    badgeText: "📚 Eğitim & Tercümanlık Şartnamesi",
    description: "Noter yeminli teknik/hukuki tercüme, kurumsal yabancı dil/liderlik eğitimleri ve kantitatif saha anketi standartları.",
    groups: {
      teknik: { title: "1. Hizmet Türü, Sayfa / Saat / Örneklem", desc: "Karakter sayısı, eğitim saati, anketör sayısı ve metodoloji" },
      mevzuat: { title: "2. Noter Yemin Zaptı & MEB/TÜRKAK Akreditasyonu", desc: "Noter yemin zaptı, MEB onaylı eğitmenlik veya ISO 20252 belgesi" },
      ticari: { title: "3. Sertifikasyon, Noter Tasdik Harcı & Raporlama", desc: "Katılımcı sertifikaları, çapraz tablo analizi ve gizlilik sözleşmesi" }
    },
    quickPresets: [
      {
        label: "100.000 Karakter Teknik Şartname Yeminli Tercümesi",
        values: {"hizmetAlani": "Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri", "hacimBirimSayisi": 100000, "hedefDilVeyaKonu": "İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri", "noterYeminZapti": true, "gizlilikSozlesmesiVeNda": true}
      },
      {
        label: "N=1.500 Örneklemli Saha Tüketici Araştırması",
        values: {"hizmetAlani": "Kantitatif Saha Kamuoyu & Pazar Araştırması Anketi", "hacimBirimSayisi": 1500, "iso20252ArastirmaStandarti": true}
      }
    ],
    fields: [
      {
        id: "hizmetAlani",
        label: "Hizmet Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri", "Kurumsal Yönetici & Personel Yetkinlik Eğitimleri", "Kantitatif Saha Kamuoyu & Pazar Araştırması Anketi", "Akademik, Finansal & Stratejik Fizibilite Raporlaması"],
        defaultValue: "Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri"
      },
      {
        id: "hacimBirimSayisi",
        label: "Hacim (Karakter / Saat / Denek Sayısı)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Birim",
        placeholder: "Örn: 50000",
        defaultValue: 50000
      },
      {
        id: "hedefDilVeyaKonu",
        label: "Hedef Dil / Eğitim Alanı",
        type: "select",
        group: "teknik",
        options: ["İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri", "Arapça, Rusça, Çince Özel Çeviri", "Liderlik, Satış & Müzakere Teknikleri Eğitimi", "Tüm Türkiye Temsili N=2.000 Saha Anketi"],
        defaultValue: "İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri"
      },
      {
        id: "noterYeminZapti",
        label: "Tercümanların T.C. Noterlerinden Onaylı Yemin Zaptı Zorunluluğu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "iso20252ArastirmaStandarti",
        label: "Piyasa Araştırmalarında ISO 20252 Kalite Standardı Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "gizlilikSozlesmesiVeNda",
        label: "Kurumsal Gizlilik Sözleşmesi (NDA) ve Veri İmhası Taahhüdü",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "noterMasraflariDahil",
        label: "Noter Tasdik ve Apostil Harç Bedelleri Yükleniciye Ait",
        type: "boolean",
        group: "ticari",
        defaultValue: false
      }
    ]
  },
  // =========================================================================
  // ISLETMECILIK_HIZMET
  // =========================================================================
  isletmecilik_hizmet: {
    key: "isletmecilik_hizmet",
    name: "Tesis İşletmeciliği, Resepsiyon & Destek Personeli İhalesi",
    icon: "Briefcase",
    badgeText: "🤝 Tesis İşletmeciliği Şartnamesi",
    description: "Sosyal tesis işletmeciliği, danışma/resepsiyon hizmeti, veri giriş elemanı ve bordrolama personeli temin şartları.",
    groups: {
      teknik: { title: "1. Personel Kadrosu, Nitelik & Görev Alanı", desc: "Kişi sayısı, lise/önlisans/lisans mezuniyeti ve vardiya" },
      mevzuat: { title: "2. İŞKUR Özel İstihdam Bürosu & SGK Uyumu", desc: "İŞKUR izin belgesi, sıfır SGK borçsuzluk belgesi ve İSG eğitimi" },
      ticari: { title: "3. Asgari Ücret Farkı, Tazminat & Kıyafet", desc: "Resmî asgari ücret artış yansıtması ve kıdem tazminatı karşılığı" }
    },
    quickPresets: [
      {
        label: "10 Kişilik Danışma ve Resepsiyon Destek Hizmeti",
        values: {"isletmeKapsami": "Danışma, Karşılama, Santral & Resepsiyon Hizmeti", "personelSayisi": 10, "iskurOzelIstihdamIzni": true, "aylikSgkBorcsuzlukBelgesi": true}
      },
      {
        label: "Entegre Plaza Yönetimi ve Destek Personeli",
        values: {"isletmeKapsami": "Bina, Plaza & Site Entegre Tesis Yönetimi", "personelSayisi": 25, "kidemTazminatiKarsiligi": true}
      }
    ],
    fields: [
      {
        id: "isletmeKapsami",
        label: "İşletmecilik / Hizmet Türü",
        type: "select",
        group: "teknik",
        options: ["Bina, Plaza & Site Entegre Tesis Yönetimi", "Danışma, Karşılama, Santral & Resepsiyon Hizmeti", "Veri Giriş, Arşivleme & Büro Destek Personeli", "Sosyal Tesis, Misafirhane & Lokal İşletmeciliği", "Kurye, İç Dağıtım & Ofis İçi Lojistik Personeli"],
        defaultValue: "Bina, Plaza & Site Entegre Tesis Yönetimi"
      },
      {
        id: "personelSayisi",
        label: "İstihdam Edilecek Asgari Personel",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Personel",
        placeholder: "Örn: 15",
        defaultValue: 15
      },
      {
        id: "iskurOzelIstihdamIzni",
        label: "İŞKUR Özel İstihdam Bürosu İzin Belgesi Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "aylikSgkBorcsuzlukBelgesi",
        label: "Her Hakedişte SGK ve Vergi Borcu Yoktur Belgesi İbrazı Zorunlu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kidemTazminatiKarsiligi",
        label: "Sözleşme Sonunda Personel Kıdem Tazminatı Sorumluluğu Yükleniciye Ait",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "asgariUcretFarkiGuncellemesi",
        label: "Resmî Asgari Ücret Artışlarında Yasal Fark Fiyata Birebir Yansıtılır",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // SIGORTA_FINANS
  // =========================================================================
  sigorta_finans: {
    key: "sigorta_finans",
    name: "Kurumsal Sigorta, Filo Kasko & Bağımsız Denetim İhalesi",
    icon: "Scale",
    badgeText: "⚖️ Sigorta & Finans Şartnamesi",
    description: "Filo kasko/trafik poliçeleri, fabrika yangın/all-risk sigortası, KGK bağımsız denetimi ve mali müşavirlik şartnamesi.",
    groups: {
      teknik: { title: "1. Sigorta / Denetim Türü & Teminat Limiti", desc: "Kasko adet, kümülatif bina/makine bedeli ve denetim kapsamı" },
      mevzuat: { title: "2. SEDDK Ruhsatı & KGK Bağımsız Denetim Yetkisi", desc: "Sigortacılık Düzenleme Kurumu ruhsatı ve Kamu Gözetimi Kurumu yetkisi" },
      ticari: { title: "3. Muafiyet Oranları, Hasarsızlık & Taksit", desc: "Deprem muafiyeti, ikame araç teminatı ve 9 eşit taksit imkanı" }
    },
    quickPresets: [
      {
        label: "50 Araçlık Filo Genişletilmiş Kasko ve Trafik",
        values: {"sigortaFinansTuru": "Kurumsal Araç Filo Kasko & Trafik Poliçesi", "aracVeyaVarlikSayisi": 50, "seddkYetkiliSigortaci": true, "sinirsizIhtiyariMaliMesuliyet": true, "ikameAracSegmenti": true}
      },
      {
        label: "Fabrika Yangın ve Endüstriyel All-Risk Poliçesi",
        values: {"sigortaFinansTuru": "Fabrika Yangın, Deprem, Terör & All-Risk Sigortası", "aracVeyaVarlikSayisi": 1, "toplamSigortaBedeliTl": 150000000}
      }
    ],
    fields: [
      {
        id: "sigortaFinansTuru",
        label: "Sigorta / Mali Hizmet Türü",
        type: "select",
        group: "teknik",
        options: ["Kurumsal Araç Filo Kasko & Trafik Poliçesi", "Fabrika Yangın, Deprem, Terör & All-Risk Sigortası", "Grup Sağlık & Ferdi Kaza Sigortası", "KGK Yetkili Bağımsız Dış Denetim & Raporlama", "Tam Tasdik Yeminli Mali Müşavirlik (YMM) Hizmeti"],
        defaultValue: "Kurumsal Araç Filo Kasko & Trafik Poliçesi"
      },
      {
        id: "aracVeyaVarlikSayisi",
        label: "Araç Sayısı veya Tesis Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Adet / Tesis",
        placeholder: "Örn: 40",
        defaultValue: 40
      },
      {
        id: "toplamSigortaBedeliTl",
        label: "Tahmini Toplam Sigorta / Varlık Bedeli",
        type: "number",
        group: "teknik",
        unit: "₺",
        placeholder: "Örn: 80000000",
        defaultValue: 80000000
      },
      {
        id: "seddkYetkiliSigortaci",
        label: "SEDDK Yetkili A Grubu Sigorta Şirketi Poliçesi Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kgkDenetimYetkisi",
        label: "KGK (Kamu Gözetimi Kurumu) Bağımsız Denetim Yetki Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "sinirsizIhtiyariMaliMesuliyet",
        label: "Kaskoda Sınırsız İMM (İhtiyari Mali Mesuliyet) Teminatı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "ikameAracSegmenti",
        label: "Arıza ve Kaza Durumunda C Segmenti Kesintisiz İkame Araç",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // HURDA_ARAC_SATISI
  // =========================================================================
  hurda_arac_satisi: {
    key: "hurda_arac_satisi",
    name: "Hurda Malzeme, E-Atık & Kurum Taşıt Satışı İhalesi",
    icon: "Recycle",
    badgeText: "🚗 Hurda & Taşıt Satış Şartnamesi",
    description: "Ekonomik ömrünü tamamlamış resmi taşıtlar, hurda demir/bakır metalleri ve kullanım dışı elektronik atık (e-atık) satış ihaleleri.",
    groups: {
      teknik: { title: "1. Hurda / Taşıt Türü & Tahmini Tonaj/Adet", desc: "Hurda metal sınıfı, araç markası, model yılı ve tahmini tonaj" },
      mevzuat: { title: "2. Çevre Bakanlığı Lisansı & Noter Devri", desc: "Tehlikesiz atık geri kazanım lisansı, ÖTA teslim yeri ve noter satışı" },
      ticari: { title: "3. Peşin Bedel, Saha Tahliyesi & Kantar Tartımı", desc: "Kantar tartımı, bedelin peşin yatırılması ve 15 günde saha temizliği" }
    },
    quickPresets: [
      {
        label: "10 Adet İkinci El Kurum Binek Araç Satışı",
        values: {"satisTuru": "Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı", "tahminiMiktarTonVeyaAdet": 10, "asgariMuhammenBedel": 3500000, "pesinOdemeVeNoterDevri": true}
      },
      {
        label: "50 Ton Hurda DKP Demir ve İmalat Artığı Satışı",
        values: {"satisTuru": "Hurda DKP Demir, İmalat Artığı & Karışık Metal", "tahminiMiktarTonVeyaAdet": 50, "cevreLisansiGeriKazanim": true}
      }
    ],
    fields: [
      {
        id: "satisTuru",
        label: "Satışa Konu Malzeme Türü",
        type: "select",
        group: "teknik",
        options: ["Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı", "Hurda DKP Demir, İmalat Artığı & Karışık Metal", "Hurda Bakır, Alüminyum, Sarı & Kablo", "Kullanım Dışı Elektronik Hurda (E-Atık / Bilgisayar / Kart)", "Hurda Kağıt, Karton & Plastik Ambalaj"],
        defaultValue: "Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı"
      },
      {
        id: "tahminiMiktarTonVeyaAdet",
        label: "Tahmini Miktar (Ton veya Araç Adedi)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton / Adet",
        placeholder: "Örn: 20",
        defaultValue: 20
      },
      {
        id: "asgariMuhammenBedel",
        label: "Asgari Muhammen (Başlangıç) Satış Bedeli",
        type: "number",
        group: "ticari",
        required: true,
        unit: "₺",
        placeholder: "Örn: 450000",
        defaultValue: 450000
      },
      {
        id: "cevreLisansiGeriKazanim",
        label: "Çevre Bakanlığı Hurda Metal / E-Atık Geri Kazanım Lisansı Zorunlu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "otaBertarafYetkisi",
        label: "Ömrünü Tamamlamış Araç (ÖTA) Lisanslı Teslim Yeri Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: false
      },
      {
        id: "pesinOdemeVeNoterDevri",
        label: "İhale Bedelinin Peşin Ödenmesi ve Masrafların Alıcıya Ait Olması",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "sahaTahliyeSuresi",
        label: "Malzemenin Sahadan Tahliye Edilme Süresi",
        type: "select",
        group: "ticari",
        options: ["Sözleşme Sonrası 10 İş Günü İçinde", "Sözleşme Sonrası 15 İş Günü İçinde", "Sözleşme Sonrası 30 İş Günü İçinde"],
        defaultValue: "Sözleşme Sonrası 15 İş Günü İçinde"
      }
    ]
  },
  // =========================================================================
  // GAYRIMENKUL_ARSA
  // =========================================================================
  gayrimenkul_arsa: {
    key: "gayrimenkul_arsa",
    name: "Gayrimenkul, Arsa Satışı & Ticari Alan Kiralama İhalesi",
    icon: "Building2",
    badgeText: "🏢 Gayrimenkul & Mülk Şartnamesi",
    description: "Kat karşılığı arsa yapımı, belediye/vakıf mülk satışları, ticari dükkan ve okul/hastane kantin kiralama standartları.",
    groups: {
      teknik: { title: "1. Mülk Türü, İmar & Yüzölçümü", desc: "İmar durumu, ada/parsel, arsa m² ve kapalı alan büyüklüğü" },
      mevzuat: { title: "2. Tapu Durumu & İhale Mevzuatı (2886/Devlet İhale)", desc: "Müstakil tapu, şerh/ipotek durumu ve 2886 sayılı DİK uygunluğu" },
      ticari: { title: "3. Muhammen Bedel, Kat Karşılığı & Kira Süresi", desc: "Asgari muhammen bedel, kat karşılığı paylaşım % ve yıllık kira" }
    },
    quickPresets: [
      {
        label: "3.000 m² Kat Karşılığı Konut+Ticaret Arsa İhalesi",
        values: {"gayrimenkulTuru": "Arsa Satışı / Kat Karşılığı Yapım İhalesi", "toplamAlanM2": 3000, "imarDurumu": "Ticaret + Konut Karma İmar (Emsal: 2.50)", "katKarsiligiAsgariOran": 50, "tapuDurumu": "Müstakil Parsel (Sorunsuz Tek Tapu)"}
      },
      {
        label: "Hastane/Okul Kantini 3 Yıllık Kiralama İhalesi",
        values: {"gayrimenkulTuru": "Kantin, Çay Ocağı & Kafeterya Kiralama İhalesi", "toplamAlanM2": 120, "muhammenBedelTl": 360000, "kiraSuresiYil": "3 Yıl Kiralama Sözleşmesi"}
      }
    ],
    fields: [
      {
        id: "gayrimenkulTuru",
        label: "Gayrimenkul / İhale Türü",
        type: "select",
        group: "teknik",
        options: ["Arsa Satışı / Kat Karşılığı Yapım İhalesi", "Ticari Dükkan, Mağaza & Ofis Satışı", "Kantin, Çay Ocağı & Kafeterya Kiralama İhalesi", "Tesis, Fabrika Binası & Depo Kiralama", "Açık Otopark İşletmesi Kiralama"],
        defaultValue: "Arsa Satışı / Kat Karşılığı Yapım İhalesi"
      },
      {
        id: "toplamAlanM2",
        label: "Toplam Arsa / Kapalı Alan (m²)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 2500",
        defaultValue: 2500
      },
      {
        id: "imarDurumu",
        label: "İmar Durumu ve Emsal",
        type: "select",
        group: "teknik",
        options: ["Konut İmarı (Emsal: 1.50 - 2.00)", "Ticaret + Konut Karma İmar (Emsal: 2.50)", "Sanayi & Depolama Alanı İmarı (E: 1.00)", "Kira İhalesi / Ticari İşyeri Mevcut", "İmarsız / Tarla / Ham Arazi"],
        defaultValue: "Ticaret + Konut Karma İmar (Emsal: 2.50)"
      },
      {
        id: "tapuDurumu",
        label: "Tapu Mülkiyet Durumu",
        type: "select",
        group: "mevzuat",
        options: ["Müstakil Parsel (Sorunsuz Tek Tapu)", "Hisseli Tapu (Şüyuulandırılmış)", "Belediye / Kamu Mülkiyeti 2886 İhalesi"],
        defaultValue: "Müstakil Parsel (Sorunsuz Tek Tapu)"
      },
      {
        id: "muhammenBedelTl",
        label: "Asgari Muhammen Satış / Kira Bedeli",
        type: "number",
        group: "ticari",
        required: true,
        unit: "₺",
        placeholder: "Örn: 15000000",
        defaultValue: 15000000
      },
      {
        id: "katKarsiligiAsgariOran",
        label: "Arsa Sahibi Asgari Kat Karşılığı Payı",
        type: "number",
        group: "ticari",
        unit: "%",
        placeholder: "Örn: 48",
        defaultValue: 48
      },
      {
        id: "kiraSuresiYil",
        label: "Kiralama İhalesi Süresi",
        type: "select",
        group: "ticari",
        options: ["Satış İhalesi (Mülkiyet Devri)", "3 Yıl Kiralama Sözleşmesi", "5 Yıl Kiralama Sözleşmesi", "10 Yıl İntifa / Kiralama"],
        defaultValue: "Satış İhalesi (Mülkiyet Devri)"
      }
    ]
  },
  // =========================================================================
  // ARSA_ARAZI
  // =========================================================================
  arsa_arazi: {
    key: "arsa_arazi",
    name: "Arsa, Arazi & Kat Karşılığı İhalesi",
    icon: "MapPin",
    badgeText: "🗺️ Arsa & İmar Şartnamesi",
    description: "Kat karşılığı konut/ticari inşaat, arsa satışı, hasılat paylaşımı ve kentsel dönüşüm alanları için imar çapı, emsal ve tapu kriterleri.",
    groups: {
      teknik: { title: "1. Parsel Büyüklüğü & İmar Parametreleri", desc: "Ada/parsel, yüzölçümü, imar fonksiyonu, KAKS (Emsal) ve TAKS" },
      mevzuat: { title: "2. Tapu Kaydı & Hukuki Durum", desc: "Müstakil/hisseli tapu, şerh-ipotek durumu ve terk şartları" },
      ticari: { title: "3. Kat Karşılığı Oranı & Teminat Şartı", desc: "Arsa sahibi asgari paylaşım oranı ve müteahhit teminatı" }
    },
    quickPresets: [
      {
        label: "3.200 m² %50 Kat Karşılığı Karma İmarlı Arsa",
        values: {"adaParselNo": "1045 Ada, 12 Parsel", "toplamYuzolcumuM2": 3200, "imarDurumu": "Ticaret + Konut Karma İmar (TİCK)", "kaksEmsalOrani": "E: 2.00", "asgariKatKarsiligiOrani": 50, "tapuMulkDurumu": "Müstakil Tapu (Tek Malik)"}
      },
      {
        label: "5.000 m² Sanayi & Depolama Parseli Satışı",
        values: {"adaParselNo": "2030 Ada, 4 Parsel", "toplamYuzolcumuM2": 5000, "imarDurumu": "Sanayi & Depolama Alanı İmarı", "kaksEmsalOrani": "E: 1.50", "asgariKatKarsiligiOrani": 0}
      }
    ],
    fields: [
      {
        id: "adaParselNo",
        label: "Ada / Parsel Numarası",
        type: "text",
        group: "teknik",
        required: true,
        placeholder: "Örn: 1045 Ada, 12 Parsel",
        defaultValue: "1045 Ada, 12 Parsel"
      },
      {
        id: "toplamYuzolcumuM2",
        label: "Toplam Arsa Yüzölçümü",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 3200",
        defaultValue: 3200
      },
      {
        id: "imarDurumu",
        label: "İmar Fonksiyonu",
        type: "select",
        group: "teknik",
        options: ["Konut Alanı İmarı", "Ticaret + Konut Karma İmar (TİCK)", "Sanayi & Depolama Alanı İmarı", "Turizm & Otel Alanı", "Kentsel Dönüşüm / Rezerv Alan"],
        defaultValue: "Ticaret + Konut Karma İmar (TİCK)"
      },
      {
        id: "kaksEmsalOrani",
        label: "KAKS / Emsal Oranı",
        type: "select",
        group: "teknik",
        options: ["E: 1.00", "E: 1.50", "E: 1.80", "E: 2.00", "E: 2.50", "E: 3.00+"],
        defaultValue: "E: 2.00"
      },
      {
        id: "gabariHmax",
        label: "Gabari (Maksimum Bina Yüksekliği)",
        type: "select",
        group: "teknik",
        options: ["Hmax: 12.50m (4 Kat)", "Hmax: 15.50m (5 Kat)", "Hmax: 24.50m (8 Kat)", "Serbest (Yüksek Yapı)"],
        defaultValue: "Hmax: 15.50m (5 Kat)"
      },
      {
        id: "tapuMulkDurumu",
        label: "Tapu & Mülkiyet Statüsü",
        type: "select",
        group: "mevzuat",
        options: ["Müstakil Tapu (Tek Malik)", "Hisseli Tapu (Tüm Hissedarlar Muvafakatli)", "Şüyuulandırılmış Parsel"],
        defaultValue: "Müstakil Tapu (Tek Malik)"
      },
      {
        id: "terklerYapildi",
        label: "Yola ve Yeşile Terkleri Yapılmış / Net Parsel",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "asgariKatKarsiligiOrani",
        label: "Asgari Kat Karşılığı Paylaşım Oranı",
        type: "number",
        group: "ticari",
        required: true,
        unit: "%",
        placeholder: "Örn: 50",
        defaultValue: 50
      },
      {
        id: "insaatTeminatMektubu",
        label: "Müteahhitten İnşaat Tamamlama Teminat Mektubu Zorunlu",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // KONUT_DAIRE
  // =========================================================================
  konut_daire: {
    key: "konut_daire",
    name: "Konut, Daire & Toplu Konut İhalesi",
    icon: "Home",
    badgeText: "🏠 Konut & Daire Şartnamesi",
    description: "Daire, rezidans, villa ve lojman toplu satın alma, kiralama ve satış ihaleleri için oda sayısı, metrekare ve iskân kriterleri.",
    groups: {
      teknik: { title: "1. Konut Özellikleri & Metrekare", desc: "Oda planı (2+1, 3+1 vb.), net/brüt alan, kat ve ısınma" },
      mevzuat: { title: "2. İskân & Deprem Yönetmeliği Uygunluğu", desc: "Yapı kullanım izin belgesi (iskân), kat mülkiyeti ve DASK" },
      ticari: { title: "3. Fiyatlandırma, Teslimat & Aidat Durumu", desc: "KDV oranı, tapu devir masrafı ve teslime hazır durumu" }
    },
    quickPresets: [
      {
        label: "Sıfır 3+1 125 m² İskânlı Daire Satışı",
        values: {"odaSayisi": "3+1 Aile Tipi Daire", "netMetrekare": 125, "brutMetrekare": 148, "binaYasi": "Sıfır Bina (İlk Kullanım)", "tapuMulkDurumu": "Kat Mülkiyetli (İskânlı & Ruhsatlı)", "depremYonetmeligi2018": true}
      },
      {
        label: "Toplu Kurumsal Lojman Alımı (10 Adet 2+1)",
        values: {"odaSayisi": "2+1 Standart Daire", "netMetrekare": 90, "brutMetrekare": 110, "binaYasi": "Sıfır Bina (İlk Kullanım)"}
      }
    ],
    fields: [
      {
        id: "odaSayisi",
        label: "Oda Sayısı ve Dağılımı",
        type: "select",
        group: "teknik",
        options: ["1+1 Rezidans / Daire", "2+1 Standart Daire", "3+1 Aile Tipi Daire", "4+1 Geniş Daire", "Müstakil Villa / Dubleks"],
        defaultValue: "3+1 Aile Tipi Daire"
      },
      {
        id: "netMetrekare",
        label: "Net Kullanım Alanı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 125",
        defaultValue: 125
      },
      {
        id: "brutMetrekare",
        label: "Brüt Kullanım Alanı",
        type: "number",
        group: "teknik",
        unit: "m²",
        placeholder: "Örn: 148",
        defaultValue: 148
      },
      {
        id: "binaYasi",
        label: "Bina Yaşı",
        type: "select",
        group: "teknik",
        options: ["Sıfır Bina (İlk Kullanım)", "1 - 5 Yaşında", "6 - 10 Yaşında", "11 - 15 Yaşında"],
        defaultValue: "Sıfır Bina (İlk Kullanım)"
      },
      {
        id: "isinmaTipi",
        label: "Isınma & İklimlendirme",
        type: "select",
        group: "teknik",
        options: ["Bireysel Doğalgaz Kombi & Yerden Isıtma", "Merkezi Sistem (Isı Pay Ölçer)", "VRF / Isı Pompası Sistemi"],
        defaultValue: "Bireysel Doğalgaz Kombi & Yerden Isıtma"
      },
      {
        id: "tapuMulkDurumu",
        label: "Tapu Durumu",
        type: "select",
        group: "mevzuat",
        options: ["Kat Mülkiyetli (İskânlı & Ruhsatlı)", "Kat İrtifaklı", "Tahsisli Kurum Lojmanı"],
        defaultValue: "Kat Mülkiyetli (İskânlı & Ruhsatlı)"
      },
      {
        id: "depremYonetmeligi2018",
        label: "2018 Türkiye Bina Deprem Yönetmeliğine Tam Uygunluk",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "kapaliOtoparkVeDepo",
        label: "Tahsisli Kapalı Otopark ve Bodrum Depo Alanı Mevcut",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "hemenTeslimOturumaHazir",
        label: "Daire Boş ve Hemen Teslime Hazır",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  },
  // =========================================================================
  // TICARI_GAYRIMENKUL
  // =========================================================================
  ticari_gayrimenkul: {
    key: "ticari_gayrimenkul",
    name: "Ticari Gayrimenkul, Plaza & Depo İhalesi",
    icon: "Building2",
    badgeText: "🏢 Ticari Mülk & Depo Şartnamesi",
    description: "Plaza ofis katları, cadde mağazaları, lojistik depolar ve fabrika binaları için tavan yüksekliği, rampa ve güç kriterleri.",
    groups: {
      teknik: { title: "1. Ticari Nitelik, Alan & Tavan Yüksekliği", desc: "Kullanım amacı, kapalı alan m², aks aralığı ve tavan yüksekliği h" },
      mevzuat: { title: "2. İtfaiye Uygunluk & Sanayi/Ticaret Ruhsatı", desc: "İşyeri açma ruhsatı, itfaiye yangın raporu ve GSM 1. sınıf uygunluğu" },
      ticari: { title: "3. Tır Yanaşma, Elektrik Gücü & Kira Koşulları", desc: "Hidrolik rampa adedi, trafo kurulu gücü kW ve kira artış modeli" }
    },
    quickPresets: [
      {
        label: "5.000 m² 12m Tavanlı Lojistik Depo Kiralama",
        values: {"ticariNitelik": "Lojistik Depo & Antrepo Binası", "kapaliAlanM2": 5000, "tavanYuksekligiMetre": "h: 10.50m - 12.00m (Lojistik Yüksek Tavan)", "tirYuklemeRampasiAdedi": 6, "itfaiyeRaporuUygun": true}
      },
      {
        label: "1.000 m² Cadde Mağazası Satışı",
        values: {"ticariNitelik": "Ana Cadde Cepheli Kurumsal Mağaza / Dükkan", "kapaliAlanM2": 1000, "tavanYuksekligiMetre": "h: 4.00m - 5.50m (Mağaza / Showroom)"}
      }
    ],
    fields: [
      {
        id: "ticariNitelik",
        label: "Ticari Gayrimenkul Niteliği",
        type: "select",
        group: "teknik",
        options: ["Lojistik Depo & Antrepo Binası", "Üretim / İmalat Fabrika Binası", "A+ Plaza Bağımsız Ofis Katı", "Ana Cadde Cepheli Kurumsal Mağaza / Dükkan", "Soğuk Hava Deposu Tesisi"],
        defaultValue: "Lojistik Depo & Antrepo Binası"
      },
      {
        id: "kapaliAlanM2",
        label: "Toplam Net Kapalı Alan",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 4500",
        defaultValue: 4500
      },
      {
        id: "tavanYuksekligiMetre",
        label: "Net Tavan Yüksekliği (h)",
        type: "select",
        group: "teknik",
        options: ["h: 10.50m - 12.00m (Lojistik Yüksek Tavan)", "h: 7.50m - 9.00m (Standart Depo/Üretim)", "h: 4.00m - 5.50m (Mağaza / Showroom)", "h: 3.20m (Ofis Katı)"],
        defaultValue: "h: 10.50m - 12.00m (Lojistik Yüksek Tavan)"
      },
      {
        id: "sanayiElektrigiGucuKw",
        label: "Mevcut Trafo / Elektrik Kurulu Gücü",
        type: "number",
        group: "teknik",
        unit: "kW / kVA",
        placeholder: "Örn: 630",
        defaultValue: 630
      },
      {
        id: "itfaiyeRaporuUygun",
        label: "Belediye İtfaiye Yangın Güvenlik Raporu Mevcut",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "isyeriAcmaRuhsatiUygun",
        label: "Sanayi / Ticaret İşyeri Açma ve Çalışma Ruhsatına Haiz",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "tirYuklemeRampasiAdedi",
        label: "Körüklü Hidrolik Tır Yükleme Rampası Adedi",
        type: "number",
        group: "ticari",
        unit: "Rampa",
        placeholder: "Örn: 6",
        defaultValue: 6
      },
      {
        id: "zeminYukKapasitesi",
        label: "Zemin Taşıma Kapasitesi (Ton/m²)",
        type: "select",
        group: "ticari",
        options: ["5 Ton/m² Endüstriyel Helikopter Zemin", "7.5 Ton/m² Ağır Yük Zemin", "Standart Ticari Zemin"],
        defaultValue: "5 Ton/m² Endüstriyel Helikopter Zemin"
      }
    ]
  },
  // =========================================================================
  // INSAAT_YAPI
  // =========================================================================
  insaat_yapi: {
    key: "insaat_yapi",
    name: "İnşaat, Altyapı & Yapım İşi İhalesi",
    icon: "HardHat",
    badgeText: "🏗️ İnşaat & Altyapı Şartnamesi",
    description: "Bina yapımı, yol, köprü, kazı-dolgu, çelik konstrüksiyon ve yıkım ihaleleri için ÇŞB yetki belgesi, şantiye şefi ve hakediş kriterleri.",
    groups: {
      teknik: { title: "1. Yapım Alanı & Metrik Büyüklükler", desc: "İnşaat alanı, beton sınıfı ve donatı tonajı" },
      mevzuat: { title: "2. Müteahhitlik Lisansı & Ruhsat Şartları", desc: "ÇŞB yetki belgesi grubu ve yapı denetim gereksinimleri" },
      ticari: { title: "3. Hakediş, Teminat & Garanti Modeli", desc: "Aylık hakediş ve kesin teminat oranı" }
    },
    quickPresets: [
      {
        label: "4.500 m² Fabrika Binası Yapımı",
        values: {"toplamInsaatAlani": 4500, "projeTuru": "Çelik Konstrüksiyon Fabrika", "betonSinifi": "C30/37", "demirTonaji": 180, "muteahhitlikBelgeGrubu": "C Grubu", "teminatOrani": 6, "kusurSorumlulukSuresi": "24 Ay"}
      },
      {
        label: "20.000 m³ Kazı ve Hafriyat",
        values: {"toplamInsaatAlani": 20000, "projeTuru": "Hafriyat, Kazı & Dolgu", "muteahhitlikBelgeGrubu": "E Grubu", "teminatOrani": 5}
      }
    ],
    fields: [
      {
        id: "toplamInsaatAlani",
        label: "Toplam İnşaat / Kazı Alanı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 4500",
        defaultValue: 4500
      },
      {
        id: "projeTuru",
        label: "Yapım / İhale Türü",
        type: "select",
        group: "teknik",
        options: ["Bina Yapımı & Taahhüt", "Yol, Köprü & Viyadük", "Hafriyat, Kazı & Dolgu", "Çelik Konstrüksiyon Fabrika", "Prefabrik Şantiye Yapıları", "Tadilat & Güçlendirme"],
        defaultValue: "Bina Yapımı & Taahhüt"
      },
      {
        id: "betonSinifi",
        label: "Asgari Beton Sınıfı",
        type: "select",
        group: "teknik",
        options: ["C25/30", "C30/37", "C35/45", "C40/50", "BS 25"],
        defaultValue: "C30/37"
      },
      {
        id: "demirTonaji",
        label: "Tahmini Donatı Demir Tonajı",
        type: "number",
        group: "teknik",
        unit: "Ton",
        placeholder: "Örn: 220",
        defaultValue: 220
      },
      {
        id: "muteahhitlikBelgeGrubu",
        label: "ÇŞB Müteahhitlik Yetki Belgesi Grubu",
        type: "select",
        group: "mevzuat",
        options: ["A Grubu (Sınırsız)", "B Grubu", "C Grubu", "D Grubu", "E Grubu", "F Grubu", "G Grubu", "H Grubu"],
        defaultValue: "C Grubu"
      },
      {
        id: "imarVeRuhsatDurumu",
        label: "İmar & Yapı Ruhsatı Durumu",
        type: "select",
        group: "mevzuat",
        options: ["Yapı Ruhsatı Alınmış (İnşaata Hazır)", "Ruhsat Başvurusu Aşamasında", "İmar Çapı ve Aplikasyon Mevcut"],
        defaultValue: "Yapı Ruhsatı Alınmış (İnşaata Hazır)"
      },
      {
        id: "santiyeSefiVeIsgSarti",
        label: "Tam Zamanlı Şantiye Şefi & İSG Uzmanı Şartı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "teminatOrani",
        label: "Kesin Teminat Mektubu Oranı",
        type: "number",
        group: "ticari",
        unit: "%",
        placeholder: "Örn: 6",
        defaultValue: 6
      },
      {
        id: "hakedisPeriyodu",
        label: "Hakediş & Ödeme Modeli",
        type: "select",
        group: "ticari",
        options: ["Aylık İlerleme Hakedişi (Yeşil Defter)", "Aşama Bazlı Hakediş (Subasman, Kaba, İnce)", "Anahtar Teslim Götürü Bedel"],
        defaultValue: "Aylık İlerleme Hakedişi (Yeşil Defter)"
      },
      {
        id: "kusurSorumlulukSuresi",
        label: "Kusur Sorumluluk & Garanti Süresi",
        type: "select",
        group: "ticari",
        options: ["12 Ay", "24 Ay", "36 Ay", "60 Ay"],
        defaultValue: "24 Ay"
      }
    ]
  },
  // =========================================================================
  // SAGLIK_MEDIKAL
  // =========================================================================
  saglik_medikal: {
    key: "saglik_medikal",
    name: "Sağlık, İlaç & Medikal Sarf İhalesi",
    icon: "Stethoscope",
    badgeText: "💊 Sağlık & İlaç Şartnamesi",
    description: "Hastaneler ve klinikler için ilaç, serum, cerrahi sarf, ortopedi ve kişisel hijyen malzemesi tedarik kriterleri.",
    groups: {
      teknik: { title: "1. Tıbbi Sarf & Ürün Niteliği", desc: "Etken madde, dozaj, kutu adedi ve soğuk zincir aralığı" },
      mevzuat: { title: "2. Sağlık Bakanlığı Ruhsat & İTS Şartları", desc: "TİTCK ruhsatı, İlaç Takip Sistemi (İTS) ve GMP uygunluğu" },
      ticari: { title: "3. Raf Ömrü & Çağrılı Sevkiyat Modeli", desc: "Kalan asgari raf ömrü ve kısmi teslimat takvimi" }
    },
    quickPresets: [
      {
        label: "50.000 Şişe IV Serum Alımı",
        values: {"ilacSarfKategorisi": "Serum & Solüsyon (IV İntravenöz)", "kutuAdedi": 50000, "titckRuhsati": true, "itsKarekodSarti": true}
      },
      {
        label: "Soğuk Zincir Biyolojik İlaç Tedariği",
        values: {"ilacSarfKategorisi": "Reçeteli Beşeri İlaç & Antibiyotik", "saklamaKosulu": "Soğuk Zincir (+2°C / +8°C)", "kutuAdedi": 10000}
      }
    ],
    fields: [
      {
        id: "ilacSarfKategorisi",
        label: "Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Reçeteli Beşeri İlaç & Antibiyotik", "Serum & Solüsyon (IV İntravenöz)", "Cerrahi İplik & Dikiş Sarfları", "Ortopedi & Protez Ürünleri", "Laboratuvar Teşhis Kitleri", "Tıbbi Dezenfektan & Kişisel Hijyen"],
        defaultValue: "Serum & Solüsyon (IV İntravenöz)"
      },
      {
        id: "kutuAdedi",
        label: "Talep Edilen Kutu / Paket Adedi",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Kutu",
        placeholder: "Örn: 25000",
        defaultValue: 25000
      },
      {
        id: "saklamaKosulu",
        label: "Saklama Sıcaklığı & Zincir Şartı",
        type: "select",
        group: "teknik",
        options: ["Soğuk Zincir (+2°C / +8°C)", "Kontrollü Oda Sıcaklığı (15°C - 25°C)", "Işıktan Muhafazalı Kuru Depolama"],
        defaultValue: "Soğuk Zincir (+2°C / +8°C)"
      },
      {
        id: "titckRuhsati",
        label: "TİTCK Sağlık Bakanlığı İlaç/Ürün Ruhsatı",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "itsKarekodSarti",
        label: "İlaç Takip Sistemi (İTS) Karekod Bildirimi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "gmpSertifikasi",
        label: "GMP (İyi İmalat Uygulamaları) Belgesi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "rafOmruKriteri",
        label: "Asgari Kalan Raf Ömrü",
        type: "select",
        group: "ticari",
        options: ["En Az %75 Kalan Raf Ömrü", "En Az %80 Kalan Raf Ömrü", "Teslim Tarihinden İtibaren En Az 18 Ay"],
        defaultValue: "En Az %75 Kalan Raf Ömrü"
      },
      {
        id: "teslimatPeriyodu",
        label: "Sevkiyat & Dağıtım Takvimi",
        type: "select",
        group: "ticari",
        options: ["Aylık Düzenli Çağrılı Sevkiyat (3 Parti)", "Tek Seferde Toplu Depo Teslimi", "Haftalık İhtiyaç Siparişi"],
        defaultValue: "Aylık Düzenli Çağrılı Sevkiyat (3 Parti)"
      }
    ]
  },
  // =========================================================================
  // GIDA_CATERING
  // =========================================================================
  gida_catering: {
    key: "gida_catering",
    name: "Gıda, Tarım Ürünleri & Hububat İhalesi",
    icon: "UtensilsCrossed",
    badgeText: "🌾 Gıda & Tarım Şartnamesi",
    description: "Bakliyat, un, şeker, yağ, et, süt ve taze sebze-meyve toptan tedarikinde kodeks, analiz ve ambalaj şartları.",
    groups: {
      teknik: { title: "1. Gıda Grubu & Metrik Miktar", desc: "Ürün cinsi, tonaj ve rutubet/asitlik parametreleri" },
      mevzuat: { title: "2. Tarım Bakanlığı İzin & Kalite Standartları", desc: "Türk Gıda Kodeksi, işletme kayıt/onay no ve Helal sertifikası" },
      ticari: { title: "3. Ambalaj, Numune & Sevkiyat", desc: "Soğuk zincir ve bağımsız akredite laboratuvar analizi" }
    },
    quickPresets: [
      {
        label: "50 Ton Pirinç & Kırmızı Mercimek",
        values: {"gidaGrubu": "Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)", "miktarTon": 50, "tarimBakanligiOnayNo": true, "turkGidaKodeksiUygunlugu": true}
      },
      {
        label: "10 Ton Yemeklik Ayçiçek Yağı Alımı",
        values: {"gidaGrubu": "Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)", "miktarTon": 10, "analizRaporuSarti": true}
      }
    ],
    fields: [
      {
        id: "gidaGrubu",
        label: "Gıda Ürün Kategorisi",
        type: "select",
        group: "teknik",
        options: ["Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)", "Un, İrmik & Şeker Toptan", "Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)", "Kırmızı Et & Beyaz Et Ürünleri", "Süt, Peynir & Şarküteri", "Sebze & Meyve Toptan", "Salça, Konserve & Sos"],
        defaultValue: "Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)"
      },
      {
        id: "miktarTon",
        label: "Toplam Sipariş Miktarı",
        type: "number",
        group: "teknik",
        required: true,
        unit: "Ton",
        placeholder: "Örn: 25",
        defaultValue: 25
      },
      {
        id: "ambalajSekli",
        label: "Ambalaj & Paketleme Şekli",
        type: "select",
        group: "teknik",
        options: ["25 kg / 50 kg Gıdaya Uygun PP Çuval", "1 kg / 5 kg Orijinal Vakumlu Koli", "5 Litre / 18 Litre Teneke (Yağ)", "Kasa / Plastik Palet (Taze Ürün)", "Silobas / Dökme Tanker"],
        defaultValue: "25 kg / 50 kg Gıdaya Uygun PP Çuval"
      },
      {
        id: "tarimBakanligiOnayNo",
        label: "Tarım ve Orman Bakanlığı İşletme Onay / Kayıt No",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "turkGidaKodeksiUygunlugu",
        label: "Türk Gıda Kodeksi Uygunluk Raporu",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "helalGidaSertifikasi",
        label: "Helal Akreditasyon Kurumu (HAK) Sertifikası",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "analizRaporuSarti",
        label: "Her Partide Akredite Laboratuvar Rutubet/Pestisit Analizi",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "sogukZincirSevkiyat",
        label: "Frigofirik (+4°C / -18°C) Soğuk Zincir Taşımacılık",
        type: "boolean",
        group: "ticari",
        defaultValue: false
      },
      {
        id: "numuneOnayProseduru",
        label: "Teklif Aşamasında Fiziksel Numune Onay Şartı",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      }
    ]
  }
}

/**
 * Kategori ve Alt Kategori bilgilerine göre en uygun sektör şema anahtarını döndürür.
 * 40 ana taksonomi kategorisinin tamamını ve özel alt sektörleri tam olarak çözer.
 */
export function resolveSectorKey(category?: string | number, subCategory?: string): string {
  const catStr = String(category || '').trim().toLowerCase()
  const subStr = String(subCategory || '').trim().toLowerCase()
  const combined = `${catStr} ${subStr}`

  // 1. Doğrudan Kategori ID Eşleşmeleri
  if (catStr === '1') return 'insaat_altyapi'
  if (catStr === '2') return 'saglik_ilac'
  if (catStr === '3') return 'gida_tarim'
  if (catStr === '4') return 'tibbi_cihaz'
  if (catStr === '5') return 'kanalizasyon_su'
  if (catStr === '6') return 'enerji_elektrik'
  if (catStr === '7') return 'akaryakit_enerji'
  if (catStr === '8') return 'endustriyel_makine'
  if (catStr === '9') return 'bilisim_teknoloji'
  if (catStr === '10') return 'lojistik_tasimacilik'
  if (catStr === '11') return 'mobilya_ofis'
  if (catStr === '12') return 'hirdavat_metal'
  if (catStr === '13') return 'yangin_guvenlik'
  if (catStr === '14') return 'kimyasal_gubre'
  if (catStr === '15') return 'matbaa_kirtasiye'
  if (catStr === '16') return 'kent_mobilyalari'
  if (catStr === '17') return 'muhendislik_mimarlik'
  if (catStr === '18') return 'madencilik_sondaj'
  if (catStr === '19') return 'asansor_otomasyon'
  if (catStr === '20') return 'klima_havalandirma'
  if (catStr === '21') return 'savunma_havacilik'
  if (catStr === '22') return 'arac_is_makinesi'
  if (catStr === '23') return 'turizm_organizasyon'
  if (catStr === '24') return 'reklam_tanitim'
  if (catStr === '25') return 'peyzaj_ormancilik'
  if (catStr === '26') return 'hayvancilik_yem'
  if (catStr === '27') return 'sanat_heykel'
  if (catStr === '28') return 'odun_komur'
  if (catStr === '29') return 'hazir_yemek_ikram'
  if (catStr === '30') return 'elektronik_bilgisayar'
  if (catStr === '31') return 'kamera_guvenlik_scada'
  if (catStr === '32') return 'temizlik_geri_donusum'
  if (catStr === '33') return 'tekstil_giyim'
  if (catStr === '34') return 'is_sagligi_guvenligi'
  if (catStr === '35') return 'ozel_guvenlik'
  if (catStr === '36') return 'egitim_tercume'
  if (catStr === '37') return 'isletmecilik_hizmet'
  if (catStr === '38') return 'sigorta_finans'
  if (catStr === '39') return 'hurda_arac_satisi'
  if (catStr === '40') {
    // 40. kategoride alt kategoriye göre spesifik alt sektör
    if (subStr.includes('arsa') || subStr.includes('arazi') || subStr.includes('tarla') || subStr.includes('kat karşılığı')) {
      return 'arsa_arazi'
    }
    if (subStr.includes('dükkan') || subStr.includes('işyeri') || subStr.includes('kantin') || subStr.includes('depo') || subStr.includes('otopark')) {
      return 'ticari_gayrimenkul'
    }
    return 'gayrimenkul_arsa'
  }

  // 2. Özelleşmiş Alt Kategori Anahtarları
  if (subStr.includes('arsa') || subStr.includes('arazi') || subStr.includes('tarla') || combined.includes('kat karşılığı')) {
    return 'arsa_arazi'
  }
  if (subStr.includes('konut') || subStr.includes('daire') || subStr.includes('rezidans') || subStr.includes('villa') || subStr.includes('lojman')) {
    return 'konut_daire'
  }
  if (subStr.includes('dükkan') || subStr.includes('işyeri') || subStr.includes('plaza') || subStr.includes('mağaza') || subStr.includes('antrepo')) {
    return 'ticari_gayrimenkul'
  }

  // 3. Metin Tabanlı Kategori & Alt Kategori Eşleştirmeleri
  if (combined.includes('akaryakıt') || combined.includes('benzin') || combined.includes('motorin') || combined.includes('madeni yağ') || combined.includes('otogaz') || combined.includes('lpg')) {
    return 'akaryakit_enerji'
  }
  if (combined.includes('tıbbi cihaz') || combined.includes('hastane ekipman') || combined.includes('radyoloji') || combined.includes('otoklav') || combined.includes('cerrahi')) {
    return 'tibbi_cihaz'
  }
  if (combined.includes('ilaç') || combined.includes('serum') || combined.includes('sağlık') || combined.includes('medikal') || combined.includes('titck') || combined.includes('biyomedikal')) {
    return 'saglik_ilac'
  }
  if (combined.includes('tabldot') || combined.includes('kumanya') || combined.includes('catering') || combined.includes('hazır yemek') || combined.includes('lokantacılık')) {
    return 'hazir_yemek_ikram'
  }
  if (combined.includes('gıda') || combined.includes('tarım') || combined.includes('hububat') || combined.includes('bakliyat') || combined.includes('un') || combined.includes('şeker') || combined.includes('yağ')) {
    return 'gida_tarim'
  }
  if (combined.includes('kanalizasyon') || combined.includes('şebeke') || combined.includes('su borusu') || combined.includes('koruge') || combined.includes('hdpe') || combined.includes('sıhhi tesisat') || combined.includes('vana')) {
    return 'kanalizasyon_su'
  }
  if (combined.includes('güneş') || combined.includes('ges') || combined.includes('trafo') || combined.includes('elektrik tesisatı') || combined.includes('aydınlatma') || combined.includes('jeneratör')) {
    return 'enerji_elektrik'
  }
  if (combined.includes('cnc') || combined.includes('endüstriyel makine') || combined.includes('kompresör') || combined.includes('konveyör') || combined.includes('redüktör') || combined.includes('torna')) {
    return 'endustriyel_makine'
  }
  if (combined.includes('yazılım') || combined.includes('bilişim') || combined.includes('erp') || combined.includes('bulut') || combined.includes('siber') || combined.includes('web')) {
    return 'bilisim_teknoloji'
  }
  if (combined.includes('nakliye') || combined.includes('taşımacılık') || combined.includes('lojistik') || combined.includes('servis') || combined.includes('kargo') || combined.includes('ftl') || combined.includes('konteyner')) {
    return 'lojistik_tasimacilik'
  }
  if (combined.includes('mobilya') || combined.includes('ofis') || combined.includes('büro') || combined.includes('endüstriyel mutfak') || combined.includes('beyaz eşya') || combined.includes('raf')) {
    return 'mobilya_ofis'
  }
  if (combined.includes('hırdavat') || combined.includes('civata') || combined.includes('nalburiye') || combined.includes('metal') || combined.includes('profil') || combined.includes('sac') || combined.includes('plastik hammadde')) {
    return 'hirdavat_metal'
  }
  if (combined.includes('yangın') || combined.includes('sprinkler') || combined.includes('fm200') || combined.includes('davlumbaz') || combined.includes('söndürme') || combined.includes('ihbar')) {
    return 'yangin_guvenlik'
  }
  if (combined.includes('kimyasal') || combined.includes('gübre') || combined.includes('dezenfektan') || combined.includes('asit') || combined.includes('klor') || combined.includes('biyosidal')) {
    return 'kimyasal_gubre'
  }
  if (combined.includes('matbaa') || combined.includes('baskı') || combined.includes('koli') || combined.includes('ambalaj') || combined.includes('toner') || combined.includes('kartuş') || combined.includes('kırtasiye') || combined.includes('fotokopi')) {
    return 'matbaa_kirtasiye'
  }
  if (combined.includes('kent mobilya') || combined.includes('prefabrik') || combined.includes('bank') || combined.includes('doğrama') || combined.includes('çocuk oyun') || combined.includes('durak')) {
    return 'kent_mobilyalari'
  }
  if (combined.includes('mühendislik') || combined.includes('mimarlık') || combined.includes('statik') || combined.includes('müşavirlik') || combined.includes('zemin etüdü') || combined.includes('geoteknik')) {
    return 'muhendislik_mimarlik'
  }
  if (combined.includes('maden') || combined.includes('sondaj') || combined.includes('kuyu') || combined.includes('taş ocağı') || combined.includes('mermer') || combined.includes('mapeg')) {
    return 'madencilik_sondaj'
  }
  if (combined.includes('asansör') || combined.includes('yürüyen merdiven') || combined.includes('bms') || combined.includes('otomasyon') || combined.includes('en 81')) {
    return 'asansor_otomasyon'
  }
  if (combined.includes('klima') || combined.includes('soğutma') || combined.includes('hvac') || combined.includes('havalandırma') || combined.includes('vrf') || combined.includes('chiller') || combined.includes('kazan dairesi')) {
    return 'klima_havalandirma'
  }
  if (combined.includes('savunma') || combined.includes('silah') || combined.includes('denizcilik') || combined.includes('havacılık') || combined.includes('balistik') || combined.includes('askeri')) {
    return 'savunma_havacilik'
  }
  if (combined.includes('iş makine') || combined.includes('taşıt') || combined.includes('ekskavatör') || combined.includes('loder') || combined.includes('kamyon') || combined.includes('filo kiralama') || combined.includes('traktör')) {
    return 'arac_is_makinesi'
  }
  if (combined.includes('turizm') || combined.includes('organizasyon') || combined.includes('kongre') || combined.includes('seminer') || combined.includes('festival') || combined.includes('düğün') || combined.includes('türsab')) {
    return 'turizm_organizasyon'
  }
  if (combined.includes('reklam') || combined.includes('tabela') || combined.includes('billboard') || combined.includes('totem') || combined.includes('led ekran') || combined.includes('fuar standı')) {
    return 'reklam_tanitim'
  }
  if (combined.includes('peyzaj') || combined.includes('bahçe') || combined.includes('rulo çim') || combined.includes('sulama') || combined.includes('ormancılık') || combined.includes('fidan')) {
    return 'peyzaj_ormancilik'
  }
  if (combined.includes('hayvancılık') || combined.includes('yem') || combined.includes('büyükbaş') || combined.includes('küçükbaş') || combined.includes('veteriner') || combined.includes('damızlık')) {
    return 'hayvancilik_yem'
  }
  if (combined.includes('sanat') || combined.includes('heykel') || combined.includes('maket') || combined.includes('müzik alet') || combined.includes('rölyef') || combined.includes('enstrüman')) {
    return 'sanat_heykel'
  }
  if (combined.includes('odun') || combined.includes('kömür') || combined.includes('pelet') || combined.includes('katı yakıt') || combined.includes('linyit')) {
    return 'odun_komur'
  }
  if (combined.includes('elektronik') || combined.includes('bilgisayar') || combined.includes('laptop') || combined.includes('sunucu') || combined.includes('ölçü alet') || combined.includes('server')) {
    return 'elektronik_bilgisayar'
  }
  if (combined.includes('kamera') || combined.includes('cctv') || combined.includes('scada') || combined.includes('plaka tanıma') || combined.includes('pts') || combined.includes('gps') || combined.includes('uydu takip')) {
    return 'kamera_guvenlik_scada'
  }
  if (combined.includes('temizlik') || combined.includes('ilaçlama') || combined.includes('geri dönüşüm') || combined.includes('pest kontrol') || combined.includes('katı atık') || combined.includes('dezenfeksiyon')) {
    return 'temizlik_geri_donusum'
  }
  if (combined.includes('tekstil') || combined.includes('giyim') || combined.includes('iş kıyafeti') || combined.includes('tulum') || combined.includes('üniforma') || combined.includes('iş ayakkabısı')) {
    return 'tekstil_giyim'
  }
  if (combined.includes('iş sağlığı') || combined.includes('iş güvenliği') || combined.includes('isg') || combined.includes('kkd') || combined.includes('baret') || combined.includes('emniyet kemeri')) {
    return 'is_sagligi_guvenligi'
  }
  if (combined.includes('özel güvenlik') || combined.includes('5188') || combined.includes('bekçilik') || combined.includes('koruma') || combined.includes('devriye')) {
    return 'ozel_guvenlik'
  }
  if (combined.includes('tercüme') || combined.includes('çeviri') || combined.includes('eğitim') || combined.includes('anket') || combined.includes('araştırma') || combined.includes('yeminli')) {
    return 'egitim_tercume'
  }
  if (combined.includes('işletmecilik') || combined.includes('resepsiyon') || combined.includes('bordrolama') || combined.includes('destek personeli') || combined.includes('sosyal hizmetler') || combined.includes('tesis işletme')) {
    return 'isletmecilik_hizmet'
  }
  if (combined.includes('sigorta') || combined.includes('kasko') || combined.includes('bağımsız denetim') || combined.includes('mali müşavir') || combined.includes('hukuki')) {
    return 'sigorta_finans'
  }
  if (combined.includes('hurda') || combined.includes('araç satışı') || combined.includes('menkul') || combined.includes('e-atık') || combined.includes('ikinci el taşıt')) {
    return 'hurda_arac_satisi'
  }
  if (combined.includes('gayrimenkul') || combined.includes('arsa satışı') || combined.includes('kantin') || combined.includes('işyeri kiralama')) {
    return 'gayrimenkul_arsa'
  }
  if (combined.includes('inşaat') || combined.includes('altyapı') || combined.includes('yapım') || combined.includes('yıkım') || combined.includes('hafriyat') || combined.includes('müteahhit')) {
    return 'insaat_altyapi'
  }

  // Varsayılan sektör
  return 'insaat_altyapi'
}

/**
 * İhale kartlarında gösterilmek üzere doldurulmuş sektörel parametrelerden
 * özet rozetler türetir. Tüm 40 sektör ve özelleşmiş alt sektörleri destekler.
 */
export function formatSectorSummaryBadges(
  categorySpecificData: Record<string, any> = {},
  sectorKey: string = ''
): Array<{ label: string; value: string }> {
  if (!categorySpecificData || Object.keys(categorySpecificData).length === 0) {
    return []
  }

  // Otomatik tespit (eğer sectorKey verilmemişse)
  let effectiveKey = sectorKey || categorySpecificData._sectorKey || ''
  if (!effectiveKey) {
    if (categorySpecificData.yakitTuru || categorySpecificData.miktarLitre) effectiveKey = 'akaryakit_enerji'
    else if (categorySpecificData.toplamInsaatAlani || categorySpecificData.projeTuru || categorySpecificData.muteahhitlikBelgeGrubu) effectiveKey = 'insaat_altyapi'
    else if (categorySpecificData.adaParselNo || categorySpecificData.toplamYuzolcumuM2 || categorySpecificData.imarDurumu) effectiveKey = 'arsa_arazi'
    else if (categorySpecificData.odaSayisi || categorySpecificData.netMetrekare) effectiveKey = 'konut_daire'
    else if (categorySpecificData.ticariNitelik || categorySpecificData.kapaliAlanM2) effectiveKey = 'ticari_gayrimenkul'
    else if (categorySpecificData.aracSinifi || categorySpecificData.aracAdedi) effectiveKey = 'arac_is_makinesi'
    else if (categorySpecificData.gunlukKisiSayisi || categorySpecificData.menuKapSayisi) effectiveKey = 'hazir_yemek_ikram'
    else if (categorySpecificData.projeKapsami || categorySpecificData.teknolojiYigini) effectiveKey = 'bilisim_teknoloji'
    else if (categorySpecificData.ilacSarfKategorisi || categorySpecificData.kutuAdedi) effectiveKey = 'saglik_ilac'
    else if (categorySpecificData.cihazSinifi || categorySpecificData.cihazAdedi) effectiveKey = 'tibbi_cihaz'
    else if (categorySpecificData.gidaGrubu || categorySpecificData.miktarTon) effectiveKey = 'gida_tarim'
    else if (categorySpecificData.tasimaTuru || categorySpecificData.seferSayisi) effectiveKey = 'lojistik_tasimacilik'
    else effectiveKey = 'insaat_altyapi'
  }

  const badges: Array<{ label: string; value: string }> = []

  switch (effectiveKey) {
    case 'insaat_altyapi':
    case 'insaat_yapi':
      if (categorySpecificData.toplamInsaatAlani) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamInsaatAlani).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.projeTuru) badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeTuru) })
      if (categorySpecificData.betonSinifi) badges.push({ label: 'Beton', value: String(categorySpecificData.betonSinifi) })
      if (categorySpecificData.muteahhitlikBelgeGrubu) badges.push({ label: 'Yetki', value: String(categorySpecificData.muteahhitlikBelgeGrubu) })
      break

    case 'saglik_ilac':
    case 'saglik_medikal':
      if (categorySpecificData.ilacSarfKategorisi || categorySpecificData.urunKategorisi) badges.push({ label: 'Kategori', value: String(categorySpecificData.ilacSarfKategorisi || categorySpecificData.urunKategorisi) })
      if (categorySpecificData.kutuAdedi) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.kutuAdedi).toLocaleString('tr-TR')} Kutu` })
      if (categorySpecificData.saklamaKosulu) badges.push({ label: 'Saklama', value: String(categorySpecificData.saklamaKosulu) })
      if (categorySpecificData.itsKarekodSarti) badges.push({ label: 'İTS', value: 'Karekod Zorunlu' })
      break

    case 'gida_tarim':
    case 'gida_catering':
      if (categorySpecificData.gidaGrubu) badges.push({ label: 'Ürün', value: String(categorySpecificData.gidaGrubu) })
      if (categorySpecificData.miktarTon) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.miktarTon).toLocaleString('tr-TR')} Ton` })
      if (categorySpecificData.ambalajSekli) badges.push({ label: 'Ambalaj', value: String(categorySpecificData.ambalajSekli) })
      if (categorySpecificData.sogukZincirSevkiyat) badges.push({ label: 'Lojistik', value: 'Soğuk Zincir (+4°C/-18°C)' })
      break

    case 'tibbi_cihaz':
      if (categorySpecificData.cihazSinifi) badges.push({ label: 'Cihaz', value: String(categorySpecificData.cihazSinifi) })
      if (categorySpecificData.cihazAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.cihazAdedi} Adet` })
      if (categorySpecificData.garantiSuresiYil) badges.push({ label: 'Garanti', value: String(categorySpecificData.garantiSuresiYil) })
      if (categorySpecificData.utsKayitZorunlulugu) badges.push({ label: 'ÜTS', value: 'Kayıtlı' })
      break

    case 'kanalizasyon_su':
      if (categorySpecificData.boruTuru) badges.push({ label: 'Boru', value: String(categorySpecificData.boruTuru) })
      if (categorySpecificData.boruCapi) badges.push({ label: 'Çap', value: String(categorySpecificData.boruCapi) })
      if (categorySpecificData.basincDayanimi) badges.push({ label: 'Basınç', value: String(categorySpecificData.basincDayanimi) })
      if (categorySpecificData.toplamMetraj) badges.push({ label: 'Metraj', value: `${Number(categorySpecificData.toplamMetraj).toLocaleString('tr-TR')} m` })
      break

    case 'enerji_elektrik':
      if (categorySpecificData.sistemTipi) badges.push({ label: 'Sistem', value: String(categorySpecificData.sistemTipi) })
      if (categorySpecificData.kuruluGucKva) badges.push({ label: 'Güç', value: `${Number(categorySpecificData.kuruluGucKva).toLocaleString('tr-TR')} kVA/kWp` })
      if (categorySpecificData.anahtarTeslimDevreyeAlma) badges.push({ label: 'Model', value: 'EPC Anahtar Teslim' })
      break

    case 'akaryakit_enerji':
      if (categorySpecificData.yakitTuru) badges.push({ label: 'Yakıt', value: String(categorySpecificData.yakitTuru) })
      if (categorySpecificData.miktarLitre) badges.push({ label: 'Hacim', value: `${Number(categorySpecificData.miktarLitre).toLocaleString('tr-TR')} L` })
      if (categorySpecificData.iskontoOrani) badges.push({ label: 'İskonto', value: `%${categorySpecificData.iskontoOrani}` })
      if (categorySpecificData.teslimatYontemi) badges.push({ label: 'Teslimat', value: String(categorySpecificData.teslimatYontemi) })
      break

    case 'endustriyel_makine':
      if (categorySpecificData.makineKategorisi) badges.push({ label: 'Makine', value: String(categorySpecificData.makineKategorisi) })
      if (categorySpecificData.makineAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.makineAdedi} Adet` })
      if (categorySpecificData.motorGucuKw) badges.push({ label: 'Güç', value: `${categorySpecificData.motorGucuKw} kW` })
      if (categorySpecificData.makineGarantiSuresi) badges.push({ label: 'Garanti', value: String(categorySpecificData.makineGarantiSuresi) })
      break

    case 'bilisim_teknoloji':
      if (categorySpecificData.projeKapsami) badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeKapsami) })
      if (categorySpecificData.kullaniciKapasitesi) badges.push({ label: 'Kapasite', value: `${categorySpecificData.kullaniciKapasitesi} Kullanıcı` })
      if (categorySpecificData.slaHedefi) badges.push({ label: 'SLA', value: String(categorySpecificData.slaHedefi) })
      break

    case 'lojistik_tasimacilik':
      if (categorySpecificData.tasimaTuru) badges.push({ label: 'Taşıma', value: String(categorySpecificData.tasimaTuru) })
      if (categorySpecificData.seferSayisi) badges.push({ label: 'Sefer', value: `${categorySpecificData.seferSayisi} Sefer` })
      if (categorySpecificData.ulastirmaBakanligiYetkiBelgesi) badges.push({ label: 'Belge', value: String(categorySpecificData.ulastirmaBakanligiYetkiBelgesi) })
      break

    case 'mobilya_ofis':
      if (categorySpecificData.mobilyaGrubu) badges.push({ label: 'Mobilya', value: String(categorySpecificData.mobilyaGrubu) })
      if (categorySpecificData.toplamTakimAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.toplamTakimAdedi} Parça` })
      if (categorySpecificData.katlaraTasimaVeMontaj) badges.push({ label: 'Montaj', value: 'Yerinde Kurulum Dahil' })
      break

    case 'hirdavat_metal':
      if (categorySpecificData.hammaddeTuru) badges.push({ label: 'Malzeme', value: String(categorySpecificData.hammaddeTuru) })
      if (categorySpecificData.siparisMiktari) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.siparisMiktari).toLocaleString('tr-TR')} Ton/Adet` })
      if (categorySpecificData.celikKaliteSinifi) badges.push({ label: 'Kalite', value: String(categorySpecificData.celikKaliteSinifi) })
      break

    case 'yangin_guvenlik':
      if (categorySpecificData.sistemTipi) badges.push({ label: 'Sistem', value: String(categorySpecificData.sistemTipi) })
      if (categorySpecificData.noktaVeyaHacim) badges.push({ label: 'Kapasite', value: `${categorySpecificData.noktaVeyaHacim} Nokta/m²` })
      if (categorySpecificData.en54VdUlfmsertifikasi) badges.push({ label: 'Standart', value: 'EN 54 / UL-FM' })
      break

    case 'kimyasal_gubre':
      if (categorySpecificData.kimyasalKategorisi) badges.push({ label: 'Kimyasal', value: String(categorySpecificData.kimyasalKategorisi) })
      if (categorySpecificData.siparisMiktariTon) badges.push({ label: 'Tonaj', value: `${categorySpecificData.siparisMiktariTon} Ton` })
      if (categorySpecificData.konsantrasyonSaflik) badges.push({ label: 'Saflık', value: String(categorySpecificData.konsantrasyonSaflik) })
      break

    case 'matbaa_kirtasiye':
      if (categorySpecificData.kirtasiyeMatbaaTuru) badges.push({ label: 'Ürün', value: String(categorySpecificData.kirtasiyeMatbaaTuru) })
      if (categorySpecificData.siparisAdedi) badges.push({ label: 'Adet', value: `${Number(categorySpecificData.siparisAdedi).toLocaleString('tr-TR')} Adet` })
      if (categorySpecificData.baskiProvasiOnayi) badges.push({ label: 'Prova', value: 'Fiziksel Renk Onaylı' })
      break

    case 'kent_mobilyalari':
      if (categorySpecificData.urunTuru) badges.push({ label: 'Tip', value: String(categorySpecificData.urunTuru) })
      if (categorySpecificData.toplamMiktarAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.toplamMiktarAdet} Adet/m²` })
      if (categorySpecificData.sahadaAnkrajVeMontaj) badges.push({ label: 'Montaj', value: 'Ankraj Sabitlemeli' })
      break

    case 'muhendislik_mimarlik':
      if (categorySpecificData.projeDisiplini) badges.push({ label: 'Disiplin', value: String(categorySpecificData.projeDisiplini) })
      if (categorySpecificData.toplamProjeAlaniM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamProjeAlaniM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.tmmobBuroTescilBelgesi) badges.push({ label: 'TMMOB', value: 'BTB Tescilli' })
      break

    case 'madencilik_sondaj':
      if (categorySpecificData.sondajTuru) badges.push({ label: 'Faaliyet', value: String(categorySpecificData.sondajTuru) })
      if (categorySpecificData.hedefDerinlikMetre) badges.push({ label: 'Metraj', value: `${Number(categorySpecificData.hedefDerinlikMetre).toLocaleString('tr-TR')} m` })
      if (categorySpecificData.kuyuInkisafVeDebiTesti) badges.push({ label: 'Test', value: 'Debi Raporlu' })
      break

    case 'asansor_otomasyon':
      if (categorySpecificData.asansorTipi) badges.push({ label: 'Tip', value: String(categorySpecificData.asansorTipi) })
      if (categorySpecificData.kapasiteKg) badges.push({ label: 'Kapasite', value: String(categorySpecificData.kapasiteKg) })
      if (categorySpecificData.durakSayisi) badges.push({ label: 'Durak', value: `${categorySpecificData.durakSayisi} Durak` })
      if (categorySpecificData.yesilEtiketRuhsatSarti) badges.push({ label: 'Ruhsat', value: 'Yeşil Etiket Dahil' })
      break

    case 'klima_havalandirma':
      if (categorySpecificData.hvacSistemi) badges.push({ label: 'HVAC', value: String(categorySpecificData.hvacSistemi) })
      if (categorySpecificData.toplamSogutmaGucuKw) badges.push({ label: 'Kapasite', value: `${categorySpecificData.toplamSogutmaGucuKw} kW` })
      if (categorySpecificData.gazCinsi) badges.push({ label: 'Gaz', value: String(categorySpecificData.gazCinsi) })
      break

    case 'savunma_havacilik':
      if (categorySpecificData.savunmaAlani) badges.push({ label: 'Kategori', value: String(categorySpecificData.savunmaAlani) })
      if (categorySpecificData.balistikKorumaSeviyesi) badges.push({ label: 'Balistik', value: String(categorySpecificData.balistikKorumaSeviyesi) })
      if (categorySpecificData.talepMiktariAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.talepMiktariAdet} Adet` })
      break

    case 'arac_is_makinesi':
      if (categorySpecificData.aracSinifi) badges.push({ label: 'Sınıf', value: String(categorySpecificData.aracSinifi) })
      if (categorySpecificData.aracAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.aracAdedi} Adet` })
      if (categorySpecificData.sozlesmeTuru) badges.push({ label: 'Model', value: String(categorySpecificData.sozlesmeTuru) })
      break

    case 'turizm_organizasyon':
      if (categorySpecificData.etkinlikTuru) badges.push({ label: 'Etkinlik', value: String(categorySpecificData.etkinlikTuru) })
      if (categorySpecificData.katilimciSayisi) badges.push({ label: 'Katılımcı', value: `${Number(categorySpecificData.katilimciSayisi).toLocaleString('tr-TR')} Kişi` })
      if (categorySpecificData.tursabAGrubuBelgesi) badges.push({ label: 'TÜRSAB', value: 'A Grubu Belgeli' })
      break

    case 'reklam_tanitim':
      if (categorySpecificData.reklamTuru) badges.push({ label: 'Reklam', value: String(categorySpecificData.reklamTuru) })
      if (categorySpecificData.olcuM2VeyaAdet) badges.push({ label: 'Ölçü', value: `${categorySpecificData.olcuM2VeyaAdet} m²/Adet` })
      if (categorySpecificData.isiklandirmaStandarti) badges.push({ label: 'LED', value: String(categorySpecificData.isiklandirmaStandarti) })
      break

    case 'peyzaj_ormancilik':
      if (categorySpecificData.peyzajKapsami) badges.push({ label: 'Uygulama', value: String(categorySpecificData.peyzajKapsami) })
      if (categorySpecificData.toplamAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.bitkiTutmaGarantisi) badges.push({ label: 'Garanti', value: '1 Yıl Tutma Garantili' })
      break

    case 'hayvancilik_yem':
      if (categorySpecificData.yemHayvanKategorisi) badges.push({ label: 'Yem/Hayvan', value: String(categorySpecificData.yemHayvanKategorisi) })
      if (categorySpecificData.miktarTonVeyaBas) badges.push({ label: 'Miktar', value: `${categorySpecificData.miktarTonVeyaBas} Ton/Baş` })
      if (categorySpecificData.hamProteinOrani) badges.push({ label: 'Protein', value: String(categorySpecificData.hamProteinOrani) })
      break

    case 'sanat_heykel':
      if (categorySpecificData.eserTuru) badges.push({ label: 'Eser', value: String(categorySpecificData.eserTuru) })
      if (categorySpecificData.malzemeCinsi) badges.push({ label: 'Malzeme', value: String(categorySpecificData.malzemeCinsi) })
      if (categorySpecificData.olcekVeyaEbatMetre) badges.push({ label: 'Boyut', value: String(categorySpecificData.olcekVeyaEbatMetre) })
      break

    case 'odun_komur':
      if (categorySpecificData.katiYakitTuru) badges.push({ label: 'Yakıt', value: String(categorySpecificData.katiYakitTuru) })
      if (categorySpecificData.siparisMiktariTon) badges.push({ label: 'Tonaj', value: `${categorySpecificData.siparisMiktariTon} Ton` })
      if (categorySpecificData.asgariKaloriDegeri) badges.push({ label: 'Kalori', value: String(categorySpecificData.asgariKaloriDegeri) })
      break

    case 'hazir_yemek_ikram':
      if (categorySpecificData.gunlukKisiSayisi) badges.push({ label: 'Kapasite', value: `${categorySpecificData.gunlukKisiSayisi} Kişi/Gün` })
      if (categorySpecificData.menuKapSayisi) badges.push({ label: 'Menü', value: String(categorySpecificData.menuKapSayisi) })
      if (categorySpecificData.servisBicimi) badges.push({ label: 'Servis', value: String(categorySpecificData.servisBicimi) })
      break

    case 'elektronik_bilgisayar':
      if (categorySpecificData.donanimTuru) badges.push({ label: 'Donanım', value: String(categorySpecificData.donanimTuru) })
      if (categorySpecificData.cihazAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.cihazAdedi} Adet` })
      if (categorySpecificData.yerindeGarantiTuru) badges.push({ label: 'Garanti', value: String(categorySpecificData.yerindeGarantiTuru) })
      break

    case 'kamera_guvenlik_scada':
      if (categorySpecificData.guvenlikSistemiTuru) badges.push({ label: 'Sistem', value: String(categorySpecificData.guvenlikSistemiTuru) })
      if (categorySpecificData.kameraKanalAdedi) badges.push({ label: 'Kanal', value: `${categorySpecificData.kameraKanalAdedi} Nokta` })
      if (categorySpecificData.kayitSuresiVeRaid) badges.push({ label: 'Kayıt', value: String(categorySpecificData.kayitSuresiVeRaid) })
      break

    case 'temizlik_geri_donusum':
      if (categorySpecificData.temizlikKapsami) badges.push({ label: 'Hizmet', value: String(categorySpecificData.temizlikKapsami) })
      if (categorySpecificData.kapaliAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Kadrosu', value: `${categorySpecificData.personelSayisi} Personel` })
      break

    case 'tekstil_giyim':
      if (categorySpecificData.tekstilUrunTuru) badges.push({ label: 'Ürün', value: String(categorySpecificData.tekstilUrunTuru) })
      if (categorySpecificData.toplamTakimAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.toplamTakimAdedi} Takım` })
      if (categorySpecificData.kurumsalLogoNakisiDahil) badges.push({ label: 'Baskı', value: 'Logo Nakışlı' })
      break

    case 'is_sagligi_guvenligi':
      if (categorySpecificData.kkdKategorisi) badges.push({ label: 'KKD', value: String(categorySpecificData.kkdKategorisi) })
      if (categorySpecificData.siparisAdedi) badges.push({ label: 'Adet', value: `${Number(categorySpecificData.siparisAdedi).toLocaleString('tr-TR')} Adet` })
      if (categorySpecificData.ceKategoriIiiSertifikasi) badges.push({ label: 'Belge', value: 'Kat III CE Sertifikalı' })
      break

    case 'ozel_guvenlik':
      if (categorySpecificData.guvenlikTuru) badges.push({ label: 'Güvenlik', value: String(categorySpecificData.guvenlikTuru) })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Personel', value: `${categorySpecificData.personelSayisi} Güvenlik Görevlisi` })
      if (categorySpecificData.vardiyaSistemi) badges.push({ label: 'Vardiya', value: String(categorySpecificData.vardiyaSistemi) })
      break

    case 'egitim_tercume':
      if (categorySpecificData.hizmetAlani) badges.push({ label: 'Hizmet', value: String(categorySpecificData.hizmetAlani) })
      if (categorySpecificData.hacimBirimSayisi) badges.push({ label: 'Hacim', value: `${Number(categorySpecificData.hacimBirimSayisi).toLocaleString('tr-TR')} Birim` })
      if (categorySpecificData.noterYeminZapti) badges.push({ label: 'Yemin', value: 'Noter Yeminli' })
      break

    case 'isletmecilik_hizmet':
      if (categorySpecificData.isletmeKapsami) badges.push({ label: 'İşletme', value: String(categorySpecificData.isletmeKapsami) })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Personel', value: `${categorySpecificData.personelSayisi} Kişi` })
      if (categorySpecificData.iskurOzelIstihdamIzni) badges.push({ label: 'İZİN', value: 'İŞKUR İzinli' })
      break

    case 'sigorta_finans':
      if (categorySpecificData.sigortaFinansTuru) badges.push({ label: 'Poliçe', value: String(categorySpecificData.sigortaFinansTuru) })
      if (categorySpecificData.aracVeyaVarlikSayisi) badges.push({ label: 'Varlık', value: `${categorySpecificData.aracVeyaVarlikSayisi} Adet/Tesis` })
      if (categorySpecificData.toplamSigortaBedeliTl) badges.push({ label: 'Teminat', value: `${Number(categorySpecificData.toplamSigortaBedeliTl).toLocaleString('tr-TR')} ₺` })
      break

    case 'hurda_arac_satisi':
      if (categorySpecificData.satisTuru) badges.push({ label: 'Satış', value: String(categorySpecificData.satisTuru) })
      if (categorySpecificData.tahminiMiktarTonVeyaAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.tahminiMiktarTonVeyaAdet} Ton/Adet` })
      if (categorySpecificData.asgariMuhammenBedel) badges.push({ label: 'Muhammen', value: `${Number(categorySpecificData.asgariMuhammenBedel).toLocaleString('tr-TR')} ₺` })
      break

    case 'gayrimenkul_arsa':
      if (categorySpecificData.gayrimenkulTuru) badges.push({ label: 'Mülk', value: String(categorySpecificData.gayrimenkulTuru) })
      if (categorySpecificData.toplamAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.imarDurumu) badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
      if (categorySpecificData.katKarsiligiAsgariOran) badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.katKarsiligiAsgariOran}` })
      break

    case 'arsa_arazi':
      if (categorySpecificData.adaParselNo) badges.push({ label: 'Ada/Parsel', value: String(categorySpecificData.adaParselNo) })
      if (categorySpecificData.toplamYuzolcumuM2) badges.push({ label: 'Yüzölçümü', value: `${Number(categorySpecificData.toplamYuzolcumuM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.imarDurumu) badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
      if (categorySpecificData.asgariKatKarsiligiOrani) badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.asgariKatKarsiligiOrani}` })
      break

    case 'konut_daire':
      if (categorySpecificData.odaSayisi) badges.push({ label: 'Oda', value: String(categorySpecificData.odaSayisi) })
      if (categorySpecificData.netMetrekare) badges.push({ label: 'Net', value: `${categorySpecificData.netMetrekare} m²` })
      if (categorySpecificData.tapuMulkDurumu) badges.push({ label: 'Tapu', value: String(categorySpecificData.tapuMulkDurumu) })
      if (categorySpecificData.binaYasi) badges.push({ label: 'Yaş', value: String(categorySpecificData.binaYasi) })
      break

    case 'ticari_gayrimenkul':
      if (categorySpecificData.ticariNitelik) badges.push({ label: 'Tip', value: String(categorySpecificData.ticariNitelik) })
      if (categorySpecificData.kapaliAlanM2) badges.push({ label: 'Kapalı Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.tavanYuksekligiMetre) badges.push({ label: 'Yükseklik', value: String(categorySpecificData.tavanYuksekligiMetre) })
      if (categorySpecificData.tirYuklemeRampasiAdedi) badges.push({ label: 'Rampa', value: `${categorySpecificData.tirYuklemeRampasiAdedi} Adet` })
      break
  }

  return badges
}
