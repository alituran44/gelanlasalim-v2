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
  type: 'text' | 'number' | 'select' | 'badge-group' | 'radio' | 'boolean' | 'date' | 'multi-select'
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
    name: "Arsa, Arazi, Tarla & Kat Karşılığı İhalesi",
    icon: "MapPin",
    badgeText: "🗺️ Arsa & İmar Şartnamesi",
    description: "Kat karşılığı konut/ticari inşaat, arsa satışı, hasılat paylaşımı ve kentsel dönüşüm alanları için ada/parsel, KAKS, TAKS, altyapı ve imar çapı kriterleri.",
    groups: {
      teknik: { title: "1. İmar Fonksiyonu, Ada/Parsel, KAKS & Altyapı Donanımları", desc: "İmar türü, ada/parsel, arsa yüzölçümü, emsal (KAKS), TAKS, gabari ve zengin altyapı/konum özellikleri" },
      mevzuat: { title: "2. Tapu Mülkiyeti, İmar Çapı, Aplikasyon & Hukuki Durum", desc: "Müstakil tapu, terkler, LİHKAB aplikasyon krokisi, jeolojik zemin etüdü ve şerh/ipotek temizliği" },
      ticari: { title: "3. Kat Karşılığı Oranı, Satış Bedeli & Müteahhit Yükümlülükleri", desc: "Asgari arsa sahibi payı %, kira yardımı, teminat mektubu zorunluluğu, azami teslim süresi ve yetki belgesi" }
    },
    quickPresets: [
      {
        label: "3.200 m² %50 Kat Karşılığı Konut İmarlı Arsa",
        values: {"imarDurumu": "Konut Alanı İmarı", "adaParselNo": "1045 Ada, 12 Parsel", "toplamYuzolcumuM2": 3200, "kaksEmsalOrani": "E: 2.00 (Yüksek Yoğunluk Karma)", "gabariHmax": "Hmax: 15.50m (5 Kat)", "taksOrani": "TAKS: 0.35", "ihaleTuru": "Kat Karşılığı İnşaat Yapım İhalesi", "asgariKatKarsiligiOrani": 50, "tapuMulkDurumu": "Müstakil Parsel (Tek Malik / Tek Tapu - Sorunsuz Devir)", "terklerYapildi": true, "imarCapiMevcut": true, "aplikasyonKrokisi": true, "insaatTeminatMektubu": true, "azamiTeslimSuresiAy": "24 Ay Anahtar Teslim"}
      },
      {
        label: "5.000 m² Sanayi & Lojistik Parseli Satışı",
        values: {"imarDurumu": "Sanayi & Fabrika Alanı İmarı", "adaParselNo": "2030 Ada, 4 Parsel", "toplamYuzolcumuM2": 5000, "kaksEmsalOrani": "E: 1.50 (Orta Yoğunluk Konut)", "gabariHmax": "Hmax: 15.50m (5 Kat)", "ihaleTuru": "Doğrudan Arsa Satış İhalesi (Nakit Bedel)", "asgariKatKarsiligiOrani": 0, "m2BirimFiyati": 18000, "tapuMulkDurumu": "Müstakil Parsel (Tek Malik / Tek Tapu - Sorunsuz Devir)"}
      },
      {
        label: "1.500 m² Villa İmarlı Emsal 0.50 Parsel",
        values: {"imarDurumu": "Konut Alanı İmarı", "adaParselNo": "412 Ada, 6 Parsel", "toplamYuzolcumuM2": 1500, "kaksEmsalOrani": "E: 0.50 (Villa / Konut)", "gabariHmax": "Hmax: 6.50m (2 Kat - Villa)", "taksOrani": "TAKS: 0.25", "ihaleTuru": "Kat Karşılığı İnşaat Yapım İhalesi", "asgariKatKarsiligiOrani": 45}
      }
    ],
    fields: [
      {
        id: "imarDurumu",
        label: "İmar Durumu & Fonksiyonu",
        type: "select",
        group: "teknik",
        required: true,
        options: ["Konut Alanı İmarı", "Ticaret + Konut Karma İmar (TİCK)", "Ticari Alan İmarı (Plaza / AVM / Çarşı)", "Sanayi & Fabrika Alanı İmarı", "Lojistik & Antrepo Depolama İmarı", "Turizm & Otel Alanı İmarı", "Küçük Sanayi Sitesi (KSS) İmarı", "Özel Sağlık / Eğitim Tesisi Alanı İmarı", "Kentsel Dönüşüm / Riskli Yapı Rezerv Parseli", "Tarla (İmar Plan Sınırında / Yatırımlık)", "Bağ & Bahçe / Zeytinlik Arazisi", "Çiftlik & Hayvancılık Alanı", "1/1000 Uygulama İmar Planı Aşamasında"],
        defaultValue: "Konut Alanı İmarı"
      },
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
        id: "paftaNo",
        label: "Pafta Numarası (Varsa)",
        type: "text",
        group: "teknik",
        placeholder: "Örn: 24-K-IV / 12",
        defaultValue: "24-K-IV"
      },
      {
        id: "toplamYuzolcumuM2",
        label: "Toplam Arsa Yüzölçümü (m²)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 3200",
        defaultValue: 3200
      },
      {
        id: "m2BirimFiyati",
        label: "m² Birim Fiyatı (Satış İhalesi için)",
        type: "number",
        group: "teknik",
        unit: "₺/m²",
        placeholder: "Örn: 15000",
        defaultValue: 15000
      },
      {
        id: "kaksEmsalOrani",
        label: "KAKS / Emsal Oranı (İnşaat Yoğunluğu)",
        type: "select",
        group: "teknik",
        required: true,
        options: ["E: 0.20 (Düşük Yoğunluk / Villa)", "E: 0.30", "E: 0.50 (Villa / Konut)", "E: 0.80", "E: 1.00 (Standart Konut)", "E: 1.20", "E: 1.50 (Orta Yoğunluk Konut)", "E: 1.80", "E: 2.00 (Yüksek Yoğunluk Karma)", "E: 2.50 (Merkezi Ticari / Konut)", "E: 3.00 ve Üzeri (Yoğun İmar)", "Serbest Emsal (Kentsel Dönüşüm / Özel Proje)"],
        defaultValue: "E: 2.00 (Yüksek Yoğunluk Karma)"
      },
      {
        id: "gabariHmax",
        label: "Gabari (Maksimum Bina Yüksekliği)",
        type: "select",
        group: "teknik",
        required: true,
        options: ["Hmax: 6.50m (2 Kat - Villa)", "Hmax: 9.50m (3 Kat)", "Hmax: 12.50m (4 Kat)", "Hmax: 15.50m (5 Kat)", "Hmax: 18.50m (6 Kat)", "Hmax: 21.50m (7 Kat)", "Hmax: 24.50m (8 Kat)", "Hmax: 30.50m (10 Kat)", "Serbest Gabari (Yüksek Katlı Rezidans / Kule)"],
        defaultValue: "Hmax: 15.50m (5 Kat)"
      },
      {
        id: "taksOrani",
        label: "TAKS (Taban Alanı Kat Sayısı)",
        type: "select",
        group: "teknik",
        options: ["TAKS: 0.15 (Geniş Bahçeli Villa)", "TAKS: 0.20", "TAKS: 0.25", "TAKS: 0.30", "TAKS: 0.35", "TAKS: 0.40 (Maksimum Oturum)", "TAKS: 0.50 (Sanayi / Ticari)", "Serbest TAKS"],
        defaultValue: "TAKS: 0.35"
      },
      {
        id: "kotAvantaji",
        label: "Kot Farkından Kat Kazanımı Avantajı Mevcut",
        type: "boolean",
        group: "teknik",
        defaultValue: true
      },
      {
        id: "altyapiOzellikleri",
        label: "Altyapı Özellikleri",
        type: "multi-select",
        group: "teknik",
        options: ["Elektrik Hattı (Mevcut / Aktif Abone)", "Sanayi Elektriği / Trafo (OG/AG Kurulu Güç)", "Şebeke Suyu (İSKİ / ASKİ vb. Bağlı)", "Sondaj & Artezyen Kuyu Suyu (Ruhsatlı)", "Doğalgaz Altyapısı (Parsel Önünde / Kapıda)", "Kanalizasyon Şebekesi Mevcut", "Yağmur Suyu Drenaj Hattı", "Fiber İnternet & Telekomünikasyon Hattı", "Açılmış Kadastro Yolu Mevcut", "Asfalt Yola Cepheli", "Stabilize Yol Mevcut", "Zemin Düzleştirilmiş / Hafriyat İşi Yapılmış", "Parsel Tel Örgü / Taş Duvar ile Çevrili", "Zemin Etüdü ve Sondajı Tamamlanmış"],
        defaultValue: ["Elektrik Hattı (Mevcut / Aktif Abone)", "Şebeke Suyu (İSKİ / ASKİ vb. Bağlı)", "Doğalgaz Altyapısı (Parsel Önünde / Kapıda)", "Kanalizasyon Şebekesi Mevcut", "Açılmış Kadastro Yolu Mevcut", "Asfalt Yola Cepheli", "Fiber İnternet & Telekomünikasyon Hattı"]
      },
      {
        id: "konumCevreOzellikleri",
        label: "Konum & Çevre Avantajları",
        type: "multi-select",
        group: "teknik",
        options: ["Anayol / Çevre Yoluna Cepheli (E-5 / TEM / Otoyol)", "Köşe Parsel (Çift Yola Cepheli)", "Geniş Yol Cephesi (> 20 Metre Ön Cephe)", "Organize Sanayi Bölgesi (OSB) İçi veya Bitişiğinde", "Köy Yerleşik Alanı Sınırları İçinde", "Şehir Merkezine / İmar Gelişme Aksına Yakın", "Havalimanına Kolay Ulaşım Aksında", "Liman, Antrepo & Lojistik Üsse Yakın", "Toplu Ulaşıma & Raylı Sistem İstasyonuna Yakın", "Denize Sıfır / Yürüme Mesafesinde", "Göl & Baraj Havzası Kıyısında", "Orman & Milli Park Sınırında", "Hızlı Değer Kazanan Gelişme Aksında"],
        defaultValue: ["Anayol / Çevre Yoluna Cepheli (E-5 / TEM / Otoyol)", "Köşe Parsel (Çift Yola Cepheli)", "Geniş Yol Cephesi (> 20 Metre Ön Cephe)", "Şehir Merkezine / İmar Gelişme Aksına Yakın", "Hızlı Değer Kazanan Gelişme Aksında"]
      },
      {
        id: "arsaManzarasi",
        label: "Arsa Manzarası",
        type: "multi-select",
        group: "teknik",
        options: ["Panoramik Deniz Manzaralı", "Boğaz Manzaralı", "Doğa & Çam Ormanı Manzaralı", "Göl / Baraj Manzaralı", "Panoramik Şehir Manzaralı", "Vadi & Dağ Manzaralı"],
        defaultValue: ["Doğa & Çam Ormanı Manzaralı"]
      },
      {
        id: "tapuMulkDurumu",
        label: "Tapu & Mülkiyet Statüsü",
        type: "select",
        group: "mevzuat",
        required: true,
        options: ["Müstakil Parsel (Tek Malik / Tek Tapu - Sorunsuz Devir)", "Hisseli Tapu (Tüm Hissedarlar Satışa/Kat Karşılığına Muvafakatli)", "İfrazlı Parsel (Müstakil İmar Parseli Haline Getirilmiş)", "Tevhid Edilmiş Parsel (Birleştirilmiş Geniş Parsel)", "Tahsisli Kamu / Vakıf Mülkiyeti (2886 İhale Kapsamında)", "Köy Senedi / Zilliyetlik"],
        defaultValue: "Müstakil Parsel (Tek Malik / Tek Tapu - Sorunsuz Devir)"
      },
      {
        id: "terklerYapildi",
        label: "Yola, Yeşile ve Kamuya Terkleri Yapılmış (Net İmar Parseli)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "imarCapiMevcut",
        label: "Güncel Belediye Onaylı İmar Durum Belgesi (İmar Çapı) Mevcut",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "aplikasyonKrokisi",
        label: "LİHKAB / Harita Mühendisi Onaylı Aplikasyon ve Röperli Kroki Hazır",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "zeminEtutRaporu",
        label: "Jeolojik & Jeoteknik Zemin Etüt ve Sondaj Raporu Hazır",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "serhIpotekTemiz",
        label: "Parsel Üzerinde İpotek, Haciz, Şerh veya Kamulaştırma Kararı Yoktur (Temiz Parsel)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "krediyeUygunluk",
        label: "Krediye Uygunluk Durumu",
        type: "select",
        group: "mevzuat",
        options: ["Arsa Kredisine Tam Uygun", "Proje / Ticari Krediye Uygun", "Krediye Uygun Değil (Yalnızca Özkaynak / Nakit)"],
        defaultValue: "Arsa Kredisine Tam Uygun"
      },
      {
        id: "ihaleTuru",
        label: "İhale Türü & Model Tercihi",
        type: "select",
        group: "ticari",
        required: true,
        options: ["Kat Karşılığı İnşaat Yapım İhalesi", "Doğrudan Arsa Satış İhalesi (Nakit Bedel)", "Hasılat Paylaşımı Modeli İhalesi", "Uzun Dönem Üst Kullanım Hakkı Kiralama"],
        defaultValue: "Kat Karşılığı İnşaat Yapım İhalesi"
      },
      {
        id: "asgariKatKarsiligiOrani",
        label: "Arsa Sahibi Asgari Kat Karşılığı Paylaşım Oranı (%)",
        type: "number",
        group: "ticari",
        required: true,
        unit: "%",
        placeholder: "Örn: 50",
        defaultValue: 50
      },
      {
        id: "kiraYardimiAylikTl",
        label: "Kat Karşılığı İnşaat Süresince Aylık Kira Yardımı Talebi",
        type: "number",
        group: "ticari",
        unit: "₺ / Ay",
        placeholder: "Örn: 50000",
        defaultValue: 50000
      },
      {
        id: "insaatTeminatMektubu",
        label: "Müteahhitten Kesin İnşaat Tamamlama Teminat Mektubu Zorunluluğu (%10 - %15)",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "asgariMuteahhitlikSinifi",
        label: "İhaleye Katılacak Müteahhit Asgari Yetki Belgesi Grubu",
        type: "select",
        group: "ticari",
        options: ["A Grubu Müteahhitlik Yetki Belgesi (Büyük Ölçekli)", "B Grubu veya Üzeri Müteahhitlik Belgesi", "C Grubu veya Üzeri Müteahhitlik Belgesi", "Firma Teknik Yeterliliği ve Referansları İncelenecektir"],
        defaultValue: "B Grubu veya Üzeri Müteahhitlik Belgesi"
      },
      {
        id: "azamiTeslimSuresiAy",
        label: "Ruhsat Alımından İtibaren Azami Teslim Süresi",
        type: "select",
        group: "ticari",
        options: ["18 Ay Anahtar Teslim", "24 Ay Anahtar Teslim", "30 Ay Anahtar Teslim", "36 Ay Anahtar Teslim"],
        defaultValue: "24 Ay Anahtar Teslim"
      },
      {
        id: "noterOnayliTeknikSartname",
        label: "Noter Onaylı İnşaat Sözleşmesi ve Detaylı Mahal Listesi Şartı",
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
    name: "Konut, Daire, Rezidans & Villa İhalesi",
    icon: "Home",
    badgeText: "🏠 Konut & Daire Şartnamesi",
    description: "Daire, rezidans, villa ve müstakil konut alım-satım ve kiralama ihaleleri için oda sayısı, metrekare, iç/dış donanım, iskân ve deprem kriterleri.",
    groups: {
      teknik: { title: "1. Konut Tipi, Metrekare, Kat & Temel Nitelikler", desc: "Emlak tipi, oda sayısı, net/brüt m², kat, bina yaşı, ısınma, cephe ve donanım özellikleri" },
      mevzuat: { title: "2. İskân, Tapu & 2018 Deprem Yönetmeliği Uygunluğu", desc: "Kat mülkiyeti, iskân belgesi, enerji kimlik belgesi (EKB), DASK ve takyidat temizliği" },
      ticari: { title: "3. Fiyatlandırma, Teslimat, Aidat & Mali Koşullar", desc: "KDV oranı, tapu masrafı paylaşımı, teslim durumu, tahsisli otopark ve depozito" }
    },
    quickPresets: [
      {
        label: "3+1 Sıfır İskânlı Lüks Rezidans Dairesi",
        values: {"konutTipi": "Rezidans (A+ Hizmetli)", "odaSayisi": "3+1 Aile Tipi Daire", "netMetrekare": 135, "brutMetrekare": 165, "binaYasi": "0 (Sıfır Bina / İlk Kullanım)", "bulunduguKat": "6 - 10. Kat Arası", "isinmaTipi": "Yerden Isıtma (Merkezi Pay Ölçerli)", "tapuMulkDurumu": "Kat Mülkiyetli (İskânı Alınmış, Bağımsız Bölüm Tapusu)", "krediyeUygunluk": "Konut Kredisine Tam Uygun (Ekspertiz Engeli Yok)", "depremYonetmeligi2018": true, "otoparkDurumu": "Tahsisli Kapalı Otopark (1 Araç)", "siteIcerisinde": "Site İçerisinde (Güvenlikli & Sosyal Tesisli)", "hemenTeslimOturumaHazir": true}
      },
      {
        label: "Site İçi 2+1 Ebeveyn Banyolu Daire",
        values: {"konutTipi": "Daire (Standart Apartman)", "odaSayisi": "2+1 Standart Daire", "netMetrekare": 95, "brutMetrekare": 118, "binaYasi": "1 Yaşında", "bulunduguKat": "2. Kat", "isinmaTipi": "Bireysel Doğalgaz Kombi", "tapuMulkDurumu": "Kat Mülkiyetli (İskânı Alınmış, Bağımsız Bölüm Tapusu)", "krediyeUygunluk": "Konut Kredisine Tam Uygun (Ekspertiz Engeli Yok)", "depremYonetmeligi2018": true}
      },
      {
        label: "Müstakil Havuzlu Bahçeli Villa",
        values: {"konutTipi": "Villa (Müstakil / İkiz)", "odaSayisi": "5+1 Lüks Daire / Villa", "netMetrekare": 320, "brutMetrekare": 390, "binaYasi": "0 (Sıfır Bina / İlk Kullanım)", "bulunduguKat": "Bahçe Katı", "isinmaTipi": "Yerden Isıtma (Bireysel Kombili)", "tapuMulkDurumu": "Müstakil Parsel Tapusu (Villa / Müstakil Ev)", "krediyeUygunluk": "Konut Kredisine Tam Uygun (Ekspertiz Engeli Yok)", "banyoSayisi": "4 Banyo ve Üzeri", "otoparkDurumu": "Tahsisli Kapalı Otopark (2+ Araç)"}
      }
    ],
    fields: [
      {
        id: "konutTipi",
        label: "Konut / Emlak Tipi",
        type: "select",
        group: "teknik",
        required: true,
        options: ["Daire (Standart Apartman)", "Rezidans (A+ Hizmetli)", "Müstakil Ev / Köşk", "Villa (Müstakil / İkiz)", "Çiftlik Evi / Bağ Evi", "Köy Evi / Taş Ev", "Yalı / Yalı Dairesi", "Yazlık Konut", "Prefabrik Konut", "Loft Daire", "Çatı Dubleksi", "Bahçe Dubleksi", "Ters Dubleks", "Tripleks Konut"],
        defaultValue: "Daire (Standart Apartman)"
      },
      {
        id: "odaSayisi",
        label: "Oda Sayısı ve Dağılımı",
        type: "select",
        group: "teknik",
        required: true,
        options: ["1+0 (Stüdyo)", "1+1 Daire", "2+0 Daire", "2+1 Standart Daire", "2+2 Daire", "3+1 Aile Tipi Daire", "3+2 Dubleks Daire", "4+1 Geniş Daire", "4+2 Geniş Dubleks", "5+1 Lüks Daire / Villa", "5+2 ve Üzeri Villa / Konut"],
        defaultValue: "3+1 Aile Tipi Daire"
      },
      {
        id: "netMetrekare",
        label: "Net Kullanım Alanı (Süpürülebilir Alan)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 125",
        defaultValue: 125
      },
      {
        id: "brutMetrekare",
        label: "Brüt Kullanım Alanı (Ortak Alanlar Dahil)",
        type: "number",
        group: "teknik",
        required: true,
        unit: "m²",
        placeholder: "Örn: 150",
        defaultValue: 150
      },
      {
        id: "binaYasi",
        label: "Bina Yaşı",
        type: "select",
        group: "teknik",
        required: true,
        options: ["0 (Sıfır Bina / İlk Kullanım)", "1 Yaşında", "2 Yaşında", "3 Yaşında", "4 Yaşında", "5 - 10 Yaş Arası", "11 - 15 Yaş Arası", "16 - 20 Yaş Arası", "21 - 25 Yaş Arası", "26 - 30 Yaş Arası", "31 ve Üzeri"],
        defaultValue: "0 (Sıfır Bina / İlk Kullanım)"
      },
      {
        id: "bulunduguKat",
        label: "Bulunduğu Kat",
        type: "select",
        group: "teknik",
        required: true,
        options: ["Bahçe Katı", "Giriş Katı", "Yüksek Giriş", "1. Kat", "2. Kat", "3. Kat", "4. Kat", "5. Kat", "6 - 10. Kat Arası", "11 - 15. Kat Arası", "16 - 20. Kat Arası", "20. Kat ve Üzeri", "Ara Kat (Avantajlı)", "En Üst Kat", "Çatı Katı / Dubleks", "Bodrum Kat / Kot 1-2"],
        defaultValue: "3. Kat"
      },
      {
        id: "toplamKatSayisi",
        label: "Binanın Toplam Kat Sayısı",
        type: "select",
        group: "teknik",
        options: ["1 Katlı (Müstakil)", "2 Katlı", "3 Katlı", "4 Katlı", "5 Katlı", "6 - 8 Katlı", "9 - 12 Katlı", "13 - 18 Katlı", "20 Kat ve Üzeri (Rezidans Kule)"],
        defaultValue: "5 Katlı"
      },
      {
        id: "isinmaTipi",
        label: "Isıtma & İklimlendirme Tipi",
        type: "select",
        group: "teknik",
        required: true,
        options: ["Bireysel Doğalgaz Kombi", "Yerden Isıtma (Bireysel Kombili)", "Yerden Isıtma (Merkezi Pay Ölçerli)", "Merkezi Sistem (Isı Pay Ölçer)", "Merkezi Doğalgaz Kalorifer", "VRF / Çoklu Split Klima Sistemi", "Isı Pompası (Enerji Tasarruflu)", "Fancoil Ünitesi", "Doğalgaz Sobası", "Katı Yakıt Sobası", "Güneş Enerjisi Destekli", "Jeotermal Isıtma", "Isıtma Yok"],
        defaultValue: "Bireysel Doğalgaz Kombi"
      },
      {
        id: "banyoSayisi",
        label: "Banyo Sayısı",
        type: "select",
        group: "teknik",
        options: ["1 Banyo", "2 Banyo (Ebeveyn Banyolu)", "3 Banyo", "4 Banyo ve Üzeri"],
        defaultValue: "2 Banyo (Ebeveyn Banyolu)"
      },
      {
        id: "balkonTerasDurumu",
        label: "Balkon & Teras Durumu",
        type: "select",
        group: "teknik",
        options: ["1 Geniş Balkon", "2 Balkon (Biri Cam Balkon Kapalı)", "3 ve Üzeri Balkon", "Geniş Açık Teras", "Balkon / Teras Yok"],
        defaultValue: "1 Geniş Balkon"
      },
      {
        id: "otoparkDurumu",
        label: "Otopark İmkanı",
        type: "select",
        group: "teknik",
        options: ["Tahsisli Kapalı Otopark (1 Araç)", "Tahsisli Kapalı Otopark (2+ Araç)", "Açık Site Otoparkı", "Açık & Kapalı Otopark Mevcut", "Otopark Alanı Yok"],
        defaultValue: "Tahsisli Kapalı Otopark (1 Araç)"
      },
      {
        id: "asansorDurumu",
        label: "Asansör Durumu",
        type: "select",
        group: "teknik",
        options: ["Tek Yolcu Asansörü", "Çift Hızlı Yolcu Asansörü", "Yolcu + Geniş Yük / Sedye Asansörü", "Asansör Bulunmamaktadır"],
        defaultValue: "Tek Yolcu Asansörü"
      },
      {
        id: "esyaliDurumu",
        label: "Eşya Durumu",
        type: "select",
        group: "teknik",
        options: ["Boş (Eşyasız)", "Full Mobilyalı & Beyaz Eşyalı", "Kısmi Eşyalı (Ankastre Setli)"],
        defaultValue: "Boş (Eşyasız)"
      },
      {
        id: "kullanimDurumu",
        label: "Mevcut Kullanım Durumu",
        type: "select",
        group: "teknik",
        options: ["Boş (Hemen Oturuma / Taşınmaya Hazır)", "Mülk Sahibi Oturuyor (Satışta Tahliye Edilecek)", "Kiracılı (Kira Getirili Yatırımlık)", "İnşaat / Kaba Yapı Aşamasında"],
        defaultValue: "Boş (Hemen Oturuma / Taşınmaya Hazır)"
      },
      {
        id: "siteIcerisinde",
        label: "Site İçerisinde mi?",
        type: "select",
        group: "teknik",
        options: ["Site İçerisinde (Güvenlikli & Sosyal Tesisli)", "Butik Site (2-3 Blok)", "Bağımsız Apartman Binası", "Müstakil Parselli Konut"],
        defaultValue: "Site İçerisinde (Güvenlikli & Sosyal Tesisli)"
      },
      {
        id: "cepheYonu",
        label: "Cephe / Güneş Alma Yönü",
        type: "select",
        group: "teknik",
        options: ["Güney Cephe (Gün Boyu Güneşli)", "Güney - Doğu Cephe", "Güney - Batı Cephe", "Doğu Cephe (Sabah Güneşi)", "Batı Cephe (Akşam Güneşi)", "Kuzey Cephe", "3 Cepheli (Köşe Daire)"],
        defaultValue: "Güney - Doğu Cephe"
      },
      {
        id: "icOzellikler",
        label: "İç Özellikler & Donanım",
        type: "multi-select",
        group: "teknik",
        options: ["Ankastre Mutfak Seti (Ocak/Fırın/Davlumbaz)", "Ebeveyn Banyosu", "Yerden Isıtma Tesisatı", "Giyinme Odası & Özel Dolaplar", "Akıllı Ev Otomasyon Altyapısı", "Klima / Split Klima Tesisatı", "Çelik Kapı (Yüksek Güvenlikli)", "Görüntülü Renkli Diyafon", "Gömme Vestiyer & Portmanto", "Duşakabin & Hilton Banyo Dolabı", "Isıcamlı PVC / Alüminyum Doğrama", "Spot & Gizli LED Tavan Aydınlatma", "1. Sınıf Laminat / Masif Parke", "Amerikan Panel İç Kapılar", "Alaturka Tuvalet / WC", "Kiler / Çamaşır Odası", "Jakuzi / Küvet", "Şömine (Aktif Bacalı)", "Otomatik Motorlu Panjur", "Fiber İnternet & Cat6 Altyapısı", "Hırsız & Duman Alarm Sistemi"],
        defaultValue: ["Ankastre Mutfak Seti (Ocak/Fırın/Davlumbaz)", "Ebeveyn Banyosu", "Çelik Kapı (Yüksek Güvenlikli)", "Görüntülü Renkli Diyafon", "Gömme Vestiyer & Portmanto", "Duşakabin & Hilton Banyo Dolabı", "Fiber İnternet & Cat6 Altyapısı"]
      },
      {
        id: "disOzellikler",
        label: "Dış Özellikler & Sosyal Tesis Donanımları",
        type: "multi-select",
        group: "teknik",
        options: ["7/24 Fiziki Güvenlik & Danışma", "CCTV Kapalı Devre Güvenlik Kamerası", "Açık Yüzme Havuzu", "Kapalı Isıtmalı Yüzme Havuzu", "Fitness & Kardiyo Spor Salonu", "Sauna & Fin Hamamı", "Geleneksel Türk Hamamı", "Çocuk Oyun Parkı & Aktivite Alanı", "Tam Beslemeli Kesintisiz Jeneratör", "Su Deposu & Hidrofor Pompası", "Dış Cephe Mantolama (Isı Yalıtımı)", "Elektrikli Araç Şarj İstasyonu (EV)", "Tahsisli Numaralı Kapalı Otopark", "Site İçi Yürüyüş & Koşu Parkuru", "Müstakil / Peyzajlı Ortak Bahçe & Kamelya", "Basketbol & Voleybol Sahası", "Tenis Kortu", "Yangın Merdiveni & Otomatik Sprinkler", "Sedye / Yük Taşımaya Uygun Asansör", "Apartman Görevlisi (Kapıcı Hizmeti)"],
        defaultValue: ["7/24 Fiziki Güvenlik & Danışma", "CCTV Kapalı Devre Güvenlik Kamerası", "Tam Beslemeli Kesintisiz Jeneratör", "Su Deposu & Hidrofor Pompası", "Dış Cephe Mantolama (Isı Yalıtımı)", "Tahsisli Numaralı Kapalı Otopark", "Çocuk Oyun Parkı & Aktivite Alanı"]
      },
      {
        id: "muhitVeUlasim",
        label: "Muhit, Lokasyon & Ulaşım Kolaylıkları",
        type: "multi-select",
        group: "teknik",
        options: ["Metro İstasyonuna Yürüme Mesafesinde", "Metrobüs Durağına Yürüme Mesafesinde", "Marmaray Hattına Kolay Erişim", "Otobüs / Minibüs Durağı Bina Önünde", "E-5 & TEM Otoyol Bağlantı Aksında", "Havalimanına Kolay & Hızlı Ulaşım", "AVM & Alışveriş Merkezlerine Yakın", "Hastane & Sağlık Kuruluşlarına Yakın", "İlk/Orta/Lise Okullarına Yakın", "Üniversite Kampüslerine Yakın", "Zincir Marketler & Semt Pazarı Yanı", "Sahil, Deniz & Kordon Yürüme Mesafesi", "Şehir Merkezi & Ana Meydana Yakın"],
        defaultValue: ["Metro İstasyonuna Yürüme Mesafesinde", "Otobüs / Minibüs Durağı Bina Önünde", "AVM & Alışveriş Merkezlerine Yakın", "Hastane & Sağlık Kuruluşlarına Yakın", "Zincir Marketler & Semt Pazarı Yanı"]
      },
      {
        id: "manzaraSecenekleri",
        label: "Manzara Seçenekleri",
        type: "multi-select",
        group: "teknik",
        options: ["Panoramik Deniz Manzarası", "Boğaz / Boğaziçi Manzarası", "Doğa & Çam Ormanı Manzarası", "Göl / Baraj Manzarası", "Açık Panoramik Şehir Manzarası", "Site İçi Havuz & Peyzaj Manzarası", "Geniş Cadde & Park Manzarası"],
        defaultValue: ["Açık Panoramik Şehir Manzarası"]
      },
      {
        id: "tapuMulkDurumu",
        label: "Tapu & Mülkiyet Durumu",
        type: "select",
        group: "mevzuat",
        required: true,
        options: ["Kat Mülkiyetli (İskânı Alınmış, Bağımsız Bölüm Tapusu)", "Kat İrtifaklı (Yapı Ruhsatlı, İnşaat Tamamlanma Aşamasında)", "Müstakil Parsel Tapusu (Villa / Müstakil Ev)", "Hisseli Tapu (Muvafakatnameli)", "Arsa Payı Tapulu", "Tahsisli Kurumsal Lojman Statüsü"],
        defaultValue: "Kat Mülkiyetli (İskânı Alınmış, Bağımsız Bölüm Tapusu)"
      },
      {
        id: "krediyeUygunluk",
        label: "Konut Kredisine Uygunluk",
        type: "select",
        group: "mevzuat",
        required: true,
        options: ["Konut Kredisine Tam Uygun (Ekspertiz Engeli Yok)", "Krediye Uygun Değil (Nakit Satış)", "Bilinmiyor / Ön Ekspertiz Gerekli"],
        defaultValue: "Konut Kredisine Tam Uygun (Ekspertiz Engeli Yok)"
      },
      {
        id: "depremYonetmeligi2018",
        label: "2018 Türkiye Bina Deprem Yönetmeliğine Tam Uygunluk (Radye Temel / C30-C35 Beton)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "enerjiKimlikBelgesi",
        label: "Enerji Kimlik Belgesi (EKB)",
        type: "select",
        group: "mevzuat",
        options: ["A Sınıfı EKB (En Yüksek Enerji Tasarrufu)", "B Sınıfı EKB (Yüksek Verimlilik)", "C Sınıfı EKB (Yasal Standart Verimlilik)", "EKB Belgesi Henüz Çıkarılmadı / Hazırlanıyor"],
        defaultValue: "B Sınıfı EKB (Yüksek Verimlilik)"
      },
      {
        id: "ipotekHacizTemiz",
        label: "Mülk Üzerinde İpotek, Haciz, İhtiyati Tedbir veya Şerh Yoktur (Temiz Tapu)",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "yapiDenetimRaporuTam",
        label: "Yapı Denetim Hakedişleri ve Zemin Etüdü Onaylı Tam Dosya",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "daskSigortasiAktif",
        label: "Geçerli Zorunlu Deprem Sigortası (DASK) Poliçesi Mevcut",
        type: "boolean",
        group: "mevzuat",
        defaultValue: true
      },
      {
        id: "hemenTeslimOturumaHazir",
        label: "Konut Boş, Taşınmaya ve Hemen Teslime Hazır",
        type: "boolean",
        group: "ticari",
        defaultValue: true
      },
      {
        id: "tahminiAidatTl",
        label: "Aylık Tahmini Site / Apartman Aidatı",
        type: "number",
        group: "ticari",
        unit: "₺ / Ay",
        placeholder: "Örn: 2500",
        defaultValue: 2500
      },
      {
        id: "tapuHarcPaylasimi",
        label: "Tapu Devir Harcı Paylaşımı",
        type: "select",
        group: "ticari",
        options: ["Mevzuata Uygun: Alıcı %2 + Satıcı %2 Eşit Paylaşım", "Tüm Tapu Harç ve Masrafları Alıcıya Aittir", "Tüm Tapu Harç ve Masrafları Satıcıya Aittir"],
        defaultValue: "Mevzuata Uygun: Alıcı %2 + Satıcı %2 Eşit Paylaşım"
      },
      {
        id: "kdvDurumu",
        label: "Fiyata KDV Dahil mi?",
        type: "select",
        group: "ticari",
        options: ["Fiyat KDV Dahildir (%1 Konut KDV)", "Fiyat KDV Dahildir (%10 KDV)", "Fiyat KDV Dahildir (%20 KDV)", "KDV Muaf / Şahıs Satışı"],
        defaultValue: "KDV Muaf / Şahıs Satışı"
      },
      {
        id: "takasDurumu",
        label: "Takas Tekliflerine Açık mı?",
        type: "select",
        group: "ticari",
        options: ["Takasa Kapalı (Yalnızca Nakit / Finansman)", "Üzerine Nakit Alınabilecek Araç Takasına Açık", "Değerinde Gayrimenkul / Arsa Takasına Açık"],
        defaultValue: "Takasa Kapalı (Yalnızca Nakit / Finansman)"
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
}

/**
 * Kategori ve Alt Kategori bilgilerine göre en uygun sektör şema anahtarını döndürür.
 * İhaleciBurada platformunda yalnızca Ev, Arsa & Gayrimenkul şartnameleri tutulmaktadır:
 * - gayrimenkul_arsa
 * - arsa_arazi
 * - konut_daire
 * - ticari_gayrimenkul
 */
export function resolveSectorKey(category?: string | number, subCategory?: string): string {
  const catStr = String(category || '').trim().toLowerCase()
  const subStr = String(subCategory || '').trim().toLowerCase()
  const combined = `${catStr} ${subStr}`

  // 1. Arsa & İmar & Tarla & Kat Karşılığı
  if (
    subStr.includes('arsa') ||
    subStr.includes('arazi') ||
    subStr.includes('tarla') ||
    subStr.includes('bahçe') ||
    subStr.includes('çiftlik') ||
    subStr.includes('zeytinlik') ||
    subStr.includes('kat karşılığı') ||
    combined.includes('arsa') ||
    combined.includes('arazi') ||
    combined.includes('tarla')
  ) {
    return 'arsa_arazi'
  }

  // 2. Konut & Daire & Villa & Rezidans
  if (
    subStr.includes('konut') ||
    subStr.includes('daire') ||
    subStr.includes('rezidans') ||
    subStr.includes('villa') ||
    subStr.includes('müstakil') ||
    subStr.includes('yazlık') ||
    subStr.includes('prefabrik') ||
    subStr.includes('lojman') ||
    combined.includes('konut') ||
    combined.includes('daire') ||
    combined.includes('ev')
  ) {
    return 'konut_daire'
  }

  // 3. Ticari Mülk & Dükkan & Depo & İşyeri
  if (
    subStr.includes('dükkan') ||
    subStr.includes('işyeri') ||
    subStr.includes('plaza') ||
    subStr.includes('mağaza') ||
    subStr.includes('ofis') ||
    subStr.includes('büro') ||
    subStr.includes('depo') ||
    subStr.includes('antrepo') ||
    subStr.includes('fabrika') ||
    subStr.includes('imalathane') ||
    subStr.includes('otopark') ||
    subStr.includes('kantin') ||
    combined.includes('dükkan') ||
    combined.includes('ticari') ||
    combined.includes('işyeri') ||
    combined.includes('depo')
  ) {
    return 'ticari_gayrimenkul'
  }

  // 4. Genel Gayrimenkul & Mülk Şartnamesi
  return 'gayrimenkul_arsa'
}

/**
 * İhale kartlarında ve detay sayfalarında gösterilmek üzere
 * şartnameye özgü en kritik 3-4 parametreyi rozet (badge) formatında döndürür.
 */
export function formatSectorSummaryBadges(
  categorySpecificData: Record<string, any> | undefined | null,
  sectorKeyInput?: string
): Array<{ label: string; value: string }> {
  if (!categorySpecificData || typeof categorySpecificData !== 'object') return []

  const sectorKey = sectorKeyInput || categorySpecificData._sectorKey || ''
  const badges: Array<{ label: string; value: string }> = []

  switch (sectorKey) {
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
      if (categorySpecificData.kaksEmsalOrani) badges.push({ label: 'KAKS/Emsal', value: String(categorySpecificData.kaksEmsalOrani) })
      if (categorySpecificData.gabariHmax) badges.push({ label: 'Gabari', value: String(categorySpecificData.gabariHmax) })
      if (categorySpecificData.asgariKatKarsiligiOrani && Number(categorySpecificData.asgariKatKarsiligiOrani) > 0) {
        badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.asgariKatKarsiligiOrani}` })
      }
      if (categorySpecificData.tapuMulkDurumu) badges.push({ label: 'Tapu', value: String(categorySpecificData.tapuMulkDurumu) })
      if (Array.isArray(categorySpecificData.altyapiOzellikleri) && categorySpecificData.altyapiOzellikleri.length > 0) {
        badges.push({ label: 'Altyapı', value: `${categorySpecificData.altyapiOzellikleri.length} Donanım` })
      }
      break

    case 'konut_daire':
      if (categorySpecificData.odaSayisi) badges.push({ label: 'Oda', value: String(categorySpecificData.odaSayisi) })
      if (categorySpecificData.netMetrekare) badges.push({ label: 'Net Alan', value: `${categorySpecificData.netMetrekare} m²` })
      if (categorySpecificData.konutTipi) badges.push({ label: 'Tip', value: String(categorySpecificData.konutTipi) })
      if (categorySpecificData.binaYasi) badges.push({ label: 'Yaş', value: String(categorySpecificData.binaYasi) })
      if (categorySpecificData.bulunduguKat) badges.push({ label: 'Kat', value: String(categorySpecificData.bulunduguKat) })
      if (categorySpecificData.isinmaTipi) badges.push({ label: 'Isıtma', value: String(categorySpecificData.isinmaTipi) })
      if (categorySpecificData.tapuMulkDurumu) badges.push({ label: 'Tapu', value: String(categorySpecificData.tapuMulkDurumu) })
      if (Array.isArray(categorySpecificData.icOzellikler) && categorySpecificData.icOzellikler.length > 0) {
        badges.push({ label: 'İç Donanım', value: `${categorySpecificData.icOzellikler.length} Özellik` })
      }
      if (Array.isArray(categorySpecificData.disOzellikler) && categorySpecificData.disOzellikler.length > 0) {
        badges.push({ label: 'Sosyal Tesis', value: `${categorySpecificData.disOzellikler.length} Donanım` })
      }
      break

    case 'ticari_gayrimenkul':
      if (categorySpecificData.ticariNitelik) badges.push({ label: 'Tip', value: String(categorySpecificData.ticariNitelik) })
      if (categorySpecificData.kapaliAlanM2) badges.push({ label: 'Kapalı Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.tavanYuksekligiMetre) badges.push({ label: 'Yükseklik', value: String(categorySpecificData.tavanYuksekligiMetre) })
      if (categorySpecificData.tirYuklemeRampasiAdedi) badges.push({ label: 'Rampa', value: `${categorySpecificData.tirYuklemeRampasiAdedi} Adet` })
      break

    default:
      if (categorySpecificData.gayrimenkulTuru) badges.push({ label: 'Mülk', value: String(categorySpecificData.gayrimenkulTuru) })
      if (categorySpecificData.toplamAlanM2 || categorySpecificData.toplamYuzolcumuM2 || categorySpecificData.netMetrekare) {
        badges.push({ label: 'Alan', value: `${categorySpecificData.toplamAlanM2 || categorySpecificData.toplamYuzolcumuM2 || categorySpecificData.netMetrekare} m²` })
      }
      if (categorySpecificData.imarDurumu) badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
      break
  }

  return badges
}
