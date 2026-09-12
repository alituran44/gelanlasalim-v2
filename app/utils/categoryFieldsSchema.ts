/**
 * Sektöre Özgü Dinamik İhale Parametreleri ve Şartname Şeması
 * 
 * İhaleciBurada platformundaki ihalelerin sektör dinamiklerine (İnşaat, Akaryakıt, Arsa, Konut vb.)
 * tam uyumlu, teknik ve ticari şartname kriterlerini dinamik olarak yönetir.
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
  // 1. ⛽ AKARYAKIT & ENERJİ İHALELERİ
  // =========================================================================
  akaryakit_enerji: {
    key: 'akaryakit_enerji',
    name: 'Akaryakıt & Enerji İhalesi',
    icon: 'Fuel',
    badgeText: '⛽ Akaryakıt Şartnamesi',
    description: 'Motorin, benzin, fuel-oil, LPG/LNG alımları için EPDK lisansı, taşıt tanıma ve pompa iskontosu parametreleri.',
    groups: {
      teknik: { title: '1. Yakıt Türü & Miktar Kriterleri', desc: 'Satın alınacak akaryakıt cinsi ve metrik büyüklükler' },
      mevzuat: { title: '2. EPDK Mevzuat & Lisans Zorunlulukları', desc: 'Resmî dağıtıcı yetkisi ve sayaç mühür şartları' },
      ticari: { title: '3. Fiyatlandırma & Teslimat Modeli', desc: 'Pompa tavan fiyat iskontosu ve teslim yöntemi' }
    },
    quickPresets: [
      {
        label: '50.000 Litre Saha Tanker Motorin Alımı',
        values: {
          yakitTuru: 'Motorin Ultra EuroDiesel (10 ppm)',
          miktarLitre: 50000,
          teslimatYontemi: 'Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)',
          fiyatlandirmaUsulu: 'EPDK Pompa Tavan Fiyatı Üzerinden % İskonto',
          iskontoOrani: 6.5,
          epdkLisansZorunlu: true,
          sayacMuhurolcek: true,
          analizRaporuSarti: true
        }
      },
      {
        label: 'Kurumsal Taşıt Tanıma (TTS) Filo Yakıt İhalesi',
        values: {
          yakitTuru: 'Motorin Ultra EuroDiesel (10 ppm)',
          miktarLitre: 120000,
          teslimatYontemi: 'İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)',
          fiyatlandirmaUsulu: 'EPDK Pompa Tavan Fiyatı Üzerinden % İskonto',
          iskontoOrani: 8.0,
          epdkLisansZorunlu: true,
          sayacMuhurolcek: true,
          analizRaporuSarti: false
        }
      }
    ],
    fields: [
      {
        id: 'yakitTuru',
        label: 'Akaryakıt / Enerji Ürün Cinsi',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Motorin Ultra EuroDiesel (10 ppm)',
          'Kurşunsuz Benzin 95 Oktan',
          'Fuel Oil No: 4 / Kal-Yak',
          'LNG (Sıvılaştırılmış Doğalgaz)',
          'LPG / Otogaz',
          'AdBlue (Egzoz Emisyon Sıvısı)'
        ],
        helpText: 'EPDK standartlarına uygun ürün türünü seçiniz.'
      },
      {
        id: 'miktarLitre',
        label: 'Talep Edilen Toplam Miktar',
        type: 'number',
        unit: 'Litre',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 50000',
        helpText: 'İhale kapsamındaki toplam yakıt hacmi.'
      },
      {
        id: 'teslimatYontemi',
        label: 'Teslimat ve Dağıtım Şekli',
        type: 'badge-group',
        group: 'teknik',
        required: true,
        defaultValue: 'Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)',
        options: [
          'Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)',
          'İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)',
          'Spot Rafineri / Dolum Tesisi Teslimi'
        ]
      },
      {
        id: 'fiyatlandirmaUsulu',
        label: 'Fiyatlandırma Usulü',
        type: 'select',
        group: 'ticari',
        required: true,
        options: [
          'EPDK Pompa Tavan Fiyatı Üzerinden % İskonto',
          'Sabit Birim Fiyat (TL/Litre)',
          'TÜPRAŞ Rafineri Çıkış Fiyatı + Sabit Dağıtıcı Marjı'
        ],
        helpText: 'Akaryakıt piyasasında en yaygın usul EPDK pompa tavan fiyatı üzerinden iskonto teklifidir.'
      },
      {
        id: 'iskontoOrani',
        label: 'Beklenen Asgari İskonto Oranı (%)',
        type: 'number',
        unit: '%',
        group: 'ticari',
        placeholder: 'Örn: 6.5',
        helpText: 'Tedarikçilerin bu oranın üzerinde teklif vermesi beklenir.'
      },
      {
        id: 'epdkLisansZorunlu',
        label: 'EPDK Dağıtıcı / Bayilik Lisansı Zorunlu mu?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'Yalnızca resmî EPDK kayıtlı tedarikçilerin teklif vermesine izin verilir.'
      },
      {
        id: 'sayacMuhurolcek',
        label: 'Sanayi Bakanlığı Mühürlü Sayaç / Kalibrasyon Raporu Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'Tanker sevkiyatlarında debimetre ve sayaç mühürlerinin eksiksiz olması şarttır.'
      },
      {
        id: 'analizRaporuSarti',
        label: 'Her Partide Akredite Laboratuvar Numune Analizi',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: false,
        helpText: 'Kükürt, yoğunluk ve parlama noktası analiz raporu ibrazı şartı.'
      }
    ]
  },

  // =========================================================================
  // 2. 🏗️ İNŞAAT & TAAHHÜT & YAPI İHALELERİ
  // =========================================================================
  insaat_yapi: {
    key: 'insaat_yapi',
    name: 'İnşaat & Taahhüt & Yapı İhalesi',
    icon: 'HardHat',
    badgeText: '🏗️ İnşaat Şartnamesi',
    description: 'Kaba/ince inşaat, taahhüt, altyapı projeleri için müteahhitlik belgesi, hakediş planı ve metraj kriterleri.',
    groups: {
      teknik: { title: '1. Yapı Türü & Metraj Bilgileri', desc: 'Toplam inşaat alanı, taşıyıcı sistem ve ruhsat durumu' },
      mevzuat: { title: '2. Müteahhitlik Yeterlilik & İş Güvenliği', desc: 'Yetki belge grubu, şantiye şefi ve iş bitirme şartları' },
      ticari: { title: '3. Hakediş & Geçici/Kesin Kabul', desc: 'Ödeme takvimi ve kesin teminat oranları' }
    },
    quickPresets: [
      {
        label: 'Anahtar Teslim 2.500 m² Konut / Ticari Yapı',
        values: {
          projeTuru: 'Anahtar Teslim Komple Bina İnşaatı',
          toplamInsaatAlani: 2500,
          yapiTasiyiciSistem: 'Betonarme Karkas',
          ruhsatDurumu: 'İnşaat Ruhsatı Alındı (Hemen Başlanabilir)',
          muteahhitlikBelgeGrubu: 'C veya D Grubu Müteahhitlik Belgesi',
          hakedisModeli: 'Aylık Hakediş Usulü (İmalat Tutanağı İle)',
          isBitirmeOrani: 50,
          santiyeSefiSarti: true,
          allRiskSigortaSarti: true
        }
      },
      {
        label: 'Çelik Konstrüksiyon Fabrika / Depo Binası',
        values: {
          projeTuru: 'Çelik Konstrüksiyon & Sandviç Panel İmalatı',
          toplamInsaatAlani: 4000,
          yapiTasiyiciSistem: 'Ağır Çelik Konstrüksiyon',
          ruhsatDurumu: 'Mimari ve Statik Projeler Hazır',
          muteahhitlikBelgeGrubu: 'B veya C Grubu Müteahhitlik Belgesi',
          hakedisModeli: 'Aşamalı (Temel, Çelik Montaj, Çatı Kapanış, Teslim)',
          allRiskSigortaSarti: true
        }
      }
    ],
    fields: [
      {
        id: 'projeTuru',
        label: 'İnşaat Projesi Kapsamı',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Anahtar Teslim Komple Bina İnşaatı',
          'Kaba İnşaat (Kalıp, Demir, Beton İmalatı)',
          'İnce İşler (Alçı, Boya, Seramik, Zemin)',
          'Çelik Konstrüksiyon & Sandviç Panel İmalatı',
          'Altyapı, Kazı, Hafriyat & İstinat Duvarı',
          'Cephe Kaplama, Mantolama & Yalıtım',
          'Güçlendirme & Restorasyon Projesi'
        ]
      },
      {
        id: 'toplamInsaatAlani',
        label: 'Toplam İnşaat / İmalat Alanı',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 2500',
        helpText: 'Toplam kapalı inşaat alanı veya metraj büyüklüğü.'
      },
      {
        id: 'yapiTasiyiciSistem',
        label: 'Taşıyıcı Sistem Niteliği',
        type: 'badge-group',
        group: 'teknik',
        defaultValue: 'Betonarme Karkas',
        options: [
          'Betonarme Karkas',
          'Ağır Çelik Konstrüksiyon',
          'Prefabrik Beton Elemanlar',
          'Karma (Çelik + Betonarme)'
        ]
      },
      {
        id: 'ruhsatDurumu',
        label: 'İmar & Ruhsat Statüsü',
        type: 'select',
        group: 'mevzuat',
        required: true,
        options: [
          'İnşaat Ruhsatı Alındı (Hemen Başlanabilir)',
          'Ruhsat Başvurusu Yapıldı / Onay Bekleniyor',
          'Mimari ve Statik Projeler Hazır',
          'Tadilat & Güçlendirme Ruhsatı Mevcut'
        ]
      },
      {
        id: 'muteahhitlikBelgeGrubu',
        label: 'ÇŞİDB Müteahhitlik Yetki Belge Sınıfı',
        type: 'select',
        group: 'mevzuat',
        options: [
          'A Grubu (Sınırsız Büyüklük)',
          'B Grubu (Büyük Ölçekli)',
          'C veya D Grubu Müteahhitlik Belgesi',
          'E veya F Grubu Yetki Belgesi',
          'Geçici / Belge Şartı Aranmıyor'
        ],
        helpText: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı yetki belge şartı.'
      },
      {
        id: 'hakedisModeli',
        label: 'Hakediş & Ödeme Takvimi',
        type: 'badge-group',
        group: 'ticari',
        required: true,
        defaultValue: 'Aylık Hakediş Usulü (İmalat Tutanağı İle)',
        options: [
          'Aylık Hakediş Usulü (İmalat Tutanağı İle)',
          'Aşamalı (Temel, Kaba, Çatı, İnce, İskan)',
          'Anahtar Teslim Geçici Kabul Sonrası'
        ]
      },
      {
        id: 'allRiskSigortaSarti',
        label: 'Şantiye İnşaat All-Risk Sigortası Zorunlu mu?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'İşveren ve 3. şahıs mali mesuliyet all-risk poliçesi.'
      },
      {
        id: 'santiyeSefiSarti',
        label: 'Tam Zamanlı Şantiye Şefi (İnşaat Mühendisi/Mimar) Zorunluluğu',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      }
    ]
  },

  // =========================================================================
  // 3. 🏞️ GAYRİMENKUL — ARSA & ARAZİ İHALELERİ
  // =========================================================================
  arsa_arazi: {
    key: 'arsa_arazi',
    name: 'Gayrimenkul — Arsa & Arazi İhalesi',
    icon: 'MapPin',
    badgeText: '🏞️ Arsa / Arazi Şartnamesi',
    description: 'Arsa satışı, kat karşılığı inşaat, hasılat paylaşımı ve tarla ihaleleri için ada/parsel, emsal ve imar kriterleri.',
    groups: {
      teknik: { title: '1. Kadastro & İmar Parametreleri', desc: 'Ada, parsel, yüzölçümü, KAKS/Emsal ve TAKS oranları' },
      mevzuat: { title: '2. Tapu Mülkiyeti & Şerh Durumu', desc: 'Müstakil/hisseli tapu niteliği ve zemin etüt raporu' },
      ticari: { title: '3. İhale & Teklif Modeli', desc: 'Kat karşılığı oranı, nakit satış veya hasılat paylaşımı' }
    },
    quickPresets: [
      {
        label: 'Kat Karşılığı Konut İmarlı Arsa İhalesi',
        values: {
          adaParselNo: 'Ada: 104, Parsel: 12',
          toplamYuzolcumuM2: 3850,
          imarDurumu: 'Konut İmarlı',
          emsalKaks: '1.50',
          taksOrani: '0.35',
          gabariKatSiniri: 'Hmax: 18.50 m (6 Kat)',
          tapuNiteligi: 'Müstakil Parsel (Tek Tapu)',
          ihaleTeklifModeli: 'Kat Karşılığı İnşaat (% Oranı Teklifi)',
          asgariKatKarsiligiOrani: 45,
          zeminEtudDurumu: 'Zemin Etüt Raporu Hazır & Onaylı'
        }
      },
      {
        label: 'Sanayi İmarlı Arsa Peşin Satış İhalesi',
        values: {
          adaParselNo: 'Ada: 215, Parsel: 3',
          toplamYuzolcumuM2: 10000,
          imarDurumu: 'Sanayi & Lojistik Depolama İmarlı',
          emsalKaks: '1.00',
          gabariKatSiniri: 'Sanayi Tipi Serbest Gabari',
          tapuNiteligi: 'Müstakil Parsel (Tek Tapu)',
          ihaleTeklifModeli: 'Nakit Satın Alma (Açık Artırma)',
          zeminEtudDurumu: 'Zemin Etüt Raporu Hazır & Onaylı'
        }
      }
    ],
    fields: [
      {
        id: 'adaParselNo',
        label: 'Resmî Ada / Parsel Numarası',
        type: 'text',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: Ada 104, Parsel 12',
        helpText: 'Tapu ve Kadastro Genel Müdürlüğü (TKGM) resmî parsel bilgisi.'
      },
      {
        id: 'toplamYuzolcumuM2',
        label: 'Arsa Toplam Yüzölçümü',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 3850',
        helpText: 'Arsanın net veya brüt tapu metrekaresi.'
      },
      {
        id: 'imarDurumu',
        label: 'İmar Planı Fonksiyonu',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Konut İmarlı',
          'Ticari İmarlı (Dükkan, Ofis, AVM)',
          'Karma İmarlı (Konut + Ticaret)',
          'Sanayi & Lojistik Depolama İmarlı',
          'Turizm & Otel İmarlı',
          'Tarla / Bağ / Bahçe (Tarım Arazisi)',
          'Kırsal Yerleşik Alan / Köy İçi'
        ]
      },
      {
        id: 'emsalKaks',
        label: 'Emsal (KAKS) Oranı',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: 1.50 veya 2.00',
        helpText: 'Arsa üzerinde inşa edilebilecek toplam alan katsayısı.'
      },
      {
        id: 'taksOrani',
        label: 'Taban Alanı Katsayısı (TAKS)',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: 0.30 veya 0.40'
      },
      {
        id: 'gabariKatSiniri',
        label: 'Gabari / Kat İzni Yüksekliği',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: Hmax: 15.50m (5 Kat) veya Serbest'
      },
      {
        id: 'tapuNiteligi',
        label: 'Tapu Mülkiyet Türü',
        type: 'badge-group',
        group: 'mevzuat',
        required: true,
        defaultValue: 'Müstakil Parsel (Tek Tapu)',
        options: [
          'Müstakil Parsel (Tek Tapu)',
          'Hisseli Tapu (Tüm Hissedarlar Muvafakatli)',
          'Tahsisli / İrtifak Hakkı'
        ]
      },
      {
        id: 'ihaleTeklifModeli',
        label: 'İhale / Sözleşme Teklif Türü',
        type: 'select',
        group: 'ticari',
        required: true,
        options: [
          'Kat Karşılığı İnşaat (% Oranı Teklifi)',
          'Hasılat Paylaşımı Esaslı Teklif (% Oranı)',
          'Nakit Satın Alma (Açık Artırma)',
          'Uzun Dönem Üst Kullanım Hakkı Kiralama'
        ],
        helpText: 'Kat karşılığında müteahhidin arsa sahibine vereceği bağımsız bölüm oranı yarıştırılır.'
      },
      {
        id: 'asgariKatKarsiligiOrani',
        label: 'Asgari Kat Karşılığı Beklentisi (%)',
        type: 'number',
        unit: '%',
        group: 'ticari',
        placeholder: 'Örn: 45',
        helpText: 'Örn: %45 arsa sahibine, %55 yükleniciye.'
      },
      {
        id: 'zeminEtudDurumu',
        label: 'Zemin Etüdü ve Jeolojik Sondaj Raporu',
        type: 'select',
        group: 'mevzuat',
        options: [
          'Zemin Etüt Raporu Hazır & Onaylı',
          'Sondaj Yapılmadı (Yüklenici Yaptıracak)',
          'Bölge Genel Jeolojik Raporu Mevcut'
        ]
      }
    ]
  },

  // =========================================================================
  // 4. 🏢 GAYRİMENKUL — KONUT & EV / DAİRE İHALELERİ
  // =========================================================================
  konut_daire: {
    key: 'konut_daire',
    name: 'Gayrimenkul — Konut & Ev / Daire İhalesi',
    icon: 'Home',
    badgeText: '🏢 Konut / Daire Şartnamesi',
    description: 'Daire, villa, rezidans alım-satım ihaleleri için oda sayısı, brüt/net m², kat no, ısınma ve iskan parametreleri.',
    groups: {
      teknik: { title: '1. Daire & Mimari Nitelikler', desc: 'Oda sayısı, kat konumu, net/brüt metrekare ve ısınma' },
      mevzuat: { title: '2. İskan, Kat Mülkiyeti & Yapı Yaşı', desc: 'Deprem yönetmeliği, kat mülkiyeti ve bina yaşı' },
      ticari: { title: '3. Teslimat, Site İmkanları & Otopark', desc: 'Anahtar teslim durumu, otopark ve kullanım durumu' }
    },
    quickPresets: [
      {
        label: '3+1 Sıfır Lüks Daire Satın Alma',
        values: {
          konutTipi: 'Daire (Apartman Katı)',
          odaSayisi: '3+1 (Üç Oda Bir Salon)',
          netMetrekare: 130,
          brutMetrekare: 155,
          bulunduguKat: '4. Kat (Toplam 8 Katlı)',
          isinmaTipi: 'Yerden Isıtma (Merkezi Payölçer)',
          binaYasi: '0 (Sıfır Yeni Bina)',
          tapuMulkDurumu: 'Kat Mülkiyetli (İskanlı)',
          teslimSekli: 'Anahtar Teslim (Taşınmaya Hazır)',
          otoparkDurumu: 'Kapalı Tahsisli Otopark (1 Araç)',
          siteOzellikleri: 'Site İçi (7/24 Güvenlik & Çocuk Parkı)'
        }
      },
      {
        label: 'Müstakil Lüks Bahçeli Villa',
        values: {
          konutTipi: 'Müstakil Bahçeli Villa',
          odaSayisi: '5+1 veya Üzeri',
          netMetrekare: 280,
          brutMetrekare: 340,
          isinmaTipi: 'Doğalgaz Kombi + Isı Pompası',
          binaYasi: '0 (Sıfır Yeni Bina)',
          tapuMulkDurumu: 'Kat Mülkiyetli (İskanlı)',
          teslimSekli: 'Anahtar Teslim (Taşınmaya Hazır)',
          otoparkDurumu: 'Müstakil Açık & Kapalı Otopark (2+ Araç)'
        }
      }
    ],
    fields: [
      {
        id: 'konutTipi',
        label: 'Konut / Gayrimenkul Tipi',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Daire (Apartman Katı)',
          'Rezidans / Akıllı Ev Dairesi',
          'Müstakil Bahçeli Villa',
          'İkiz Villa / Sıra Evler',
          'Çatı Dubleksi / Bahçe Dubleksi',
          'Prefabrik / Çelik Konut'
        ]
      },
      {
        id: 'odaSayisi',
        label: 'Oda ve Salon Sayısı',
        type: 'badge-group',
        group: 'teknik',
        required: true,
        defaultValue: '3+1 (Üç Oda Bir Salon)',
        options: [
          '1+1',
          '2+1',
          '3+1 (Üç Oda Bir Salon)',
          '4+1',
          '5+1 veya Üzeri',
          '1+0 (Stüdyo)'
        ]
      },
      {
        id: 'netMetrekare',
        label: 'Net Kullanım Alanı',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 125',
        helpText: 'Süpürülebilir net daire alanı.'
      },
      {
        id: 'brutMetrekare',
        label: 'Brüt Satış Alanı',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        placeholder: 'Örn: 150',
        helpText: 'Ortak alanlar ve balkonlar dahil brüt alan.'
      },
      {
        id: 'bulunduguKat',
        label: 'Bulunduğu Kat ve Toplam Kat',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: 4. Kat (Toplam 8 Kat)'
      },
      {
        id: 'isinmaTipi',
        label: 'Isınma Sistemi',
        type: 'select',
        group: 'teknik',
        options: [
          'Doğalgaz Bireysel Kombi',
          'Yerden Isıtma (Merkezi Payölçer)',
          'Merkezi Kalorifer (Pay Ölçerli)',
          'Isı Pompası / VRF İklimlendirme',
          'Klima / Elektrikli'
        ]
      },
      {
        id: 'binaYasi',
        label: 'Bina Yaşı',
        type: 'badge-group',
        group: 'mevzuat',
        defaultValue: '0 (Sıfır Yeni Bina)',
        options: [
          '0 (Sıfır Yeni Bina)',
          '1 - 5 Yaş',
          '6 - 10 Yaş',
          '11 - 20 Yaş',
          '21+ Yaş'
        ]
      },
      {
        id: 'tapuMulkDurumu',
        label: 'Tapu ve İskan Statüsü',
        type: 'select',
        group: 'mevzuat',
        required: true,
        options: [
          'Kat Mülkiyetli (İskanlı)',
          'Kat İrtifaklı (İskan Aşamasında)',
          'Arsa Paylı Tapu'
        ]
      },
      {
        id: 'teslimSekli',
        label: 'Daire Teslim Standardı',
        type: 'select',
        group: 'ticari',
        required: true,
        options: [
          'Anahtar Teslim (Taşınmaya Hazır)',
          'İleri Kaba (Şap, Alçı, Tesisat Tamam)',
          'Natamam (İç Dekorasyon Alıcıya Ait)'
        ]
      },
      {
        id: 'otoparkDurumu',
        label: 'Otopark İmkanı',
        type: 'badge-group',
        group: 'ticari',
        defaultValue: 'Kapalı Tahsisli Otopark (1 Araç)',
        options: [
          'Kapalı Tahsisli Otopark (1 Araç)',
          'Açık Otopark Alanı',
          'Kapalı Otopark (2 Araç)',
          'Otopark Bulunmuyor'
        ]
      }
    ]
  },

  // =========================================================================
  // 5. 🏬 GAYRİMENKUL — TİCARİ (OFİS, DÜKKAN, PLAZA, DEPO & FABRİKA)
  // =========================================================================
  ticari_gayrimenkul: {
    key: 'ticari_gayrimenkul',
    name: 'Gayrimenkul — Ticari (Plaza, Depo & Fabrika)',
    icon: 'Building2',
    badgeText: '🏬 Ticari Gayrimenkul Şartnamesi',
    description: 'Cadde dükkanı, plaza katı, antrepo, fabrika ve lojistik depo ihaleleri için tavan yüksekliği, trafo gücü ve rampa parametreleri.',
    groups: {
      teknik: { title: '1. Ticari Nitelik & Alanlar', desc: 'Kapalı/açık metrekare, tavan yüksekliği ve tır yanaşma rampası' },
      mevzuat: { title: '2. Ruhsat, İskan & Yangın Altyapısı', desc: 'Sanayi/ticari ruhsat, yangın sprinkleri ve ÇED uygunluğu' },
      ticari: { title: '3. Elektrik & Altyapı Kapasitesi', desc: 'Trafo gücü, sanayi elektriği ve vinç altyapısı' }
    },
    quickPresets: [
      {
        label: '5.000 m² Lojistik Depo & Antrepo Kiralama',
        values: {
          ticariNitelik: 'Lojistik Depo / Antrepo',
          kapaliAlanM2: 5000,
          acikSahaM2: 2500,
          tavanYuksekligiMetre: '9.50 Metre',
          tirRampasiSayisi: '4 Adet Hidrolik Yükleme Rampası',
          elektrikTrafoGucu: '400 kVA Özel Trafo',
          yanginSprinkler: true,
          zeminTasiyiciKapasite: '5 Ton/m² Toz Tutmaz Helikopter Zemin'
        }
      }
    ],
    fields: [
      {
        id: 'ticariNitelik',
        label: 'Ticari Gayrimenkul Niteliği',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Lojistik Depo / Antrepo',
          'Fabrika & Üretim Tesisi',
          'Cadde Dükkanı / Showroom & Mağaza',
          'Plaza Katı / Kurumsal Ofis',
          'Soğuk Hava Deposu (-18°C / +4°C)',
          'Müstakil Komple Ticari Plaza Binası'
        ]
      },
      {
        id: 'kapaliAlanM2',
        label: 'Toplam Kapalı Kullanım Alanı',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 5000'
      },
      {
        id: 'acikSahaM2',
        label: 'Manevra / Açık Saha Alanı',
        type: 'number',
        unit: 'm²',
        group: 'teknik',
        placeholder: 'Örn: 2000'
      },
      {
        id: 'tavanYuksekligiMetre',
        label: 'Net Tavan Yüksekliği (H)',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: 8.50 Metre veya 11 Metre',
        helpText: 'Tır ve istifleme makineleri için makas altı net yükseklik.'
      },
      {
        id: 'tirRampasiSayisi',
        label: 'Tır Yanaşma Rampası & Seksiyonel Kapı',
        type: 'badge-group',
        group: 'teknik',
        defaultValue: '2 Adet Hidrolik Rampa',
        options: [
          'Düz Giriş (Zemin Kat)',
          '2 Adet Hidrolik Rampa',
          '4+ Adet Hidrolik Yükleme Rampası',
          'Kamyonet / Panelvan Seviyesinde'
        ]
      },
      {
        id: 'elektrikTrafoGucu',
        label: 'Elektrik / Trafo Gücü Kapasitesi',
        type: 'text',
        group: 'ticari',
        placeholder: 'Örn: 250 kVA veya 1.000 kW Sanayi Elektriği'
      },
      {
        id: 'yanginSprinkler',
        label: 'Otomatik Yangın Sprinkler & Hidrant Sistemi Mevcut mu?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      },
      {
        id: 'vincAltyapisi',
        label: 'Tavan Gezer Köprü Vinç / Kreyn Altyapısı',
        type: 'select',
        group: 'ticari',
        options: [
          'Vinç Altyapısı Aranmıyor',
          'Köprü Vinç Kirişleri Hazır (Vinç Takılabilir)',
          '5 Ton veya 10 Ton Tavan Vinci Faal'
        ]
      }
    ]
  },

  // =========================================================================
  // 6. 🚜 ARAÇ, FİLO KİRALAMA & İŞ MAKİNESİ İHALELERİ
  // =========================================================================
  arac_is_makinesi: {
    key: 'arac_is_makinesi',
    name: 'Araç, Filo Kiralama & İş Makineleri',
    icon: 'Truck',
    badgeText: '🚜 Araç & İş Makinesi Şartnamesi',
    description: 'Binek filo, çekici/tır, ekskavatör ve forklift kiralama/satın alma için model yılı, bakım, kasko ve operatör şartları.',
    groups: {
      teknik: { title: '1. Araç & Makine Özellikleri', desc: 'Araç sınıfı, adet, asgari model yılı ve km/saat limiti' },
      mevzuat: { title: '2. Kasko, Muayene & Yetki Belgeleri', desc: 'Tam kasko, ikame araç ve SRC/operatörlük belgeleri' },
      ticari: { title: '3. Kiralama Süresi & Bakım Sorumluluğu', desc: 'Periyodik bakım, kış lastiği ve yakıt sorumluluğu' }
    },
    quickPresets: [
      {
        label: '10 Adet Binek Şirket Aracı 24 Ay Filo Kiralama',
        values: {
          talepTuru: 'Uzun Dönem Operasyonel Filo Kiralama (12-36 Ay)',
          aracSinifi: 'Binek Sedan / Hatchback (C Segmenti)',
          aracAdedi: 10,
          asgariModelYili: '2024 ve Üzeri',
          kiralamaSuresiAy: 24,
          yillikKmLimiti: '30.000 Km / Yıl',
          bakimLastikKaskoKimeAit: 'Tüm Bakım, Lastik, Kasko & İkame Araç Tedarikçiye Ait',
          operatorDurumu: 'Şoförsüz Teslimat'
        }
      },
      {
        label: 'Ekskavatör & Beko Loder Şantiye Kiralama',
        values: {
          talepTuru: 'Proje Bazlı İş Makinesi Kiralama',
          aracSinifi: 'Paletli Ekskavatör (22-30 Ton)',
          aracAdedi: 2,
          asgariModelYili: '2022 ve Üzeri',
          kiralamaSuresiAy: 6,
          bakimLastikKaskoKimeAit: 'Tüm Bakım, Lastik, Kasko & İkame Araç Tedarikçiye Ait',
          operatorDurumu: 'Sertifikalı Operatör Dahil (Yakıt Hariç)'
        }
      }
    ],
    fields: [
      {
        id: 'talepTuru',
        label: 'İhale Alım Modeli',
        type: 'badge-group',
        group: 'ticari',
        required: true,
        defaultValue: 'Uzun Dönem Operasyonel Filo Kiralama (12-36 Ay)',
        options: [
          'Uzun Dönem Operasyonel Filo Kiralama (12-36 Ay)',
          'Doğrudan Araç Satın Alma',
          'Proje Bazlı İş Makinesi Kiralama'
        ]
      },
      {
        id: 'aracSinifi',
        label: 'Araç / Makine Sınıfı',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Binek Sedan / Hatchback (C Segmenti)',
          'Hafif Ticari (Panelvan / Kamyonet)',
          'Çekici & Tır (4x2 / 6x4)',
          'Paletli Ekskavatör (22-30 Ton)',
          'Kazıcı Yükleyici (Beko Loder)',
          'Forklift (Dizel / Akülü 3-5 Ton)',
          'Mobil Vinç / Teleskopik Vinç'
        ]
      },
      {
        id: 'aracAdedi',
        label: 'Toplam Araç / Makine Adedi',
        type: 'number',
        unit: 'Adet',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 10'
      },
      {
        id: 'asgariModelYili',
        label: 'Asgari Model Yılı',
        type: 'select',
        group: 'teknik',
        options: [
          '2026 (Sıfır Km)',
          '2024 ve Üzeri',
          '2022 ve Üzeri',
          '2020 ve Üzeri'
        ]
      },
      {
        id: 'kiralamaSuresiAy',
        label: 'Kiralama Süresi (Kiralama ise)',
        type: 'number',
        unit: 'Ay',
        group: 'ticari',
        placeholder: 'Örn: 24'
      },
      {
        id: 'bakimLastikKaskoKimeAit',
        label: 'Bakım, Kasko ve İkame Araç Şartı',
        type: 'select',
        group: 'mevzuat',
        required: true,
        options: [
          'Tüm Bakım, Lastik, Kasko & İkame Araç Tedarikçiye Ait',
          'Sadece Kasko ve Trafik Sigortası Tedarikçiye Ait',
          'Bakım ve Kasko Kiralayana Ait'
        ]
      },
      {
        id: 'operatorDurumu',
        label: 'Operatör / Şoför Şartı',
        type: 'badge-group',
        group: 'ticari',
        defaultValue: 'Şoförsüz Teslimat',
        options: [
          'Şoförsüz Teslimat',
          'Sertifikalı Operatör Dahil (Yakıt Dahil)',
          'Sertifikalı Operatör Dahil (Yakıt Hariç)'
        ]
      }
    ]
  },

  // =========================================================================
  // 7. 🍽️ GIDA, CATERİNG & TOPLU YEMEK İHALELERİ
  // =========================================================================
  gida_catering: {
    key: 'gida_catering',
    name: 'Gıda, Catering & Toplu Yemek İhalesi',
    icon: 'UtensilsCrossed',
    badgeText: '🍽️ Catering Şartnamesi',
    description: 'Fabrika ve ofis yemek hizmetleri için günlük öğün sayısı, menü standardı, ISO 22000 ve helal gıda belgeleri.',
    groups: {
      teknik: { title: '1. Öğün & Menü Kapsamı', desc: 'Günlük kişi sayısı, kap adedi ve diyet menü alternatifleri' },
      mevzuat: { title: '2. Gıda Güvenliği & Hijyen Sertifikaları', desc: 'ISO 22000, HACCP, Helal Gıda ve şahit numune saklama' },
      ticari: { title: '3. Üretim & Dağıtım Modeli', desc: 'Taşımalı yemek veya yerinde mutfak işletmesi' }
    },
    quickPresets: [
      {
        label: 'Fabrika 350 Kişilik 4 Kap Taşımalı Yemek İhalesi',
        values: {
          hizmetModeli: 'Taşımalı Termobox Sıcak Yemek Hizmeti',
          gunlukKisiSayisi: 350,
          menuKapSayisi: '4 Kap Standart Menü (Çorba, Ana Yemek, Pilav/Makarna, Tatlı/Salata)',
          iso22000Zorunlu: true,
          helalGidaSertifikasi: true,
          sahitNumuneDolabi: true,
          kaloriTablosuSarti: true
        }
      }
    ],
    fields: [
      {
        id: 'hizmetModeli',
        label: 'Yemek Üretim ve Servis Modeli',
        type: 'badge-group',
        group: 'ticari',
        required: true,
        defaultValue: 'Taşımalı Termobox Sıcak Yemek Hizmeti',
        options: [
          'Taşımalı Termobox Sıcak Yemek Hizmeti',
          'İşveren Mutfağında Yerinde Pişirme ve Servis',
          'Toptan Kuru Gıda & Et-Süt Hammadde Alımı'
        ]
      },
      {
        id: 'gunlukKisiSayisi',
        label: 'Günlük Kişi / Öğün Sayısı',
        type: 'number',
        unit: 'Kişi/Gün',
        group: 'teknik',
        required: true,
        placeholder: 'Örn: 350'
      },
      {
        id: 'menuKapSayisi',
        label: 'Menü Standart Kap Sayısı',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          '4 Kap Standart Menü (Çorba, Ana Yemek, Pilav/Makarna, Tatlı/Salata)',
          '5 Kap Seçmeli Menü',
          'Tabldot + Salata Bar & İçecek',
          'Kumanya / Paketlenmiş Pratik Menü'
        ]
      },
      {
        id: 'iso22000Zorunlu',
        label: 'ISO 22000 Gıda Güvenliği Yönetim Sistemi Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      },
      {
        id: 'helalGidaSertifikasi',
        label: 'Helal Gıda Akreditasyon Sertifikası Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      },
      {
        id: 'sahitNumuneDolabi',
        label: '72 Saatlik Şahit Numune Saklama Dolabı Zorunluluğu',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'Resmî gıda denetimlerinde her öğünden 72 saat şahit numune saklanması kanuni zorunluluktur.'
      }
    ]
  },

  // =========================================================================
  // 8. 💻 BİLİŞİM, YAZILIM & IT ALTYAPI İHALELERİ
  // =========================================================================
  bilisim_teknoloji: {
    key: 'bilisim_teknoloji',
    name: 'Bilişim, Yazılım & IT Altyapı İhalesi',
    icon: 'Laptop',
    badgeText: '💻 IT & Yazılım Şartnamesi',
    description: 'Özel yazılım, donanım, sunucu ve bulut projeleri için SLA süreleri, fikri mülkiyet ve siber güvenlik test şartları.',
    groups: {
      teknik: { title: '1. Proje & Mimari Kapsam', desc: 'Özel yazılım, SaaS, donanım adedi ve bulut/on-prem mimari' },
      mevzuat: { title: '2. Fikri Mülkiyet, KVKK & Güvenlik', desc: 'Kaynak kod devri, ISO 27001 ve sızma testi onayları' },
      ticari: { title: '3. Garanti & SLA Müdahale Süreleri', desc: 'Uptime taahhüdü ve teknik servis müdahale hızı' }
    },
    quickPresets: [
      {
        label: 'Özel ERP / Kurumsal Web Yazılımı & Kaynak Kod Devri',
        values: {
          projeKapsami: 'Özel Kurumsal Web / Mobil Yazılım Geliştirme',
          mimariDagitim: 'Bulut Tabanlı (Cloud / SaaS)',
          kaynakKodDevri: true,
          slaMudahaleSuresi: '7/24 Kritik Hatalara 2 Saat İçinde Müdahale',
          kvkkOwaspTesti: true,
          garantiSureAy: 24
        }
      }
    ],
    fields: [
      {
        id: 'projeKapsami',
        label: 'Bilişim Projesi Kapsamı',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Özel Kurumsal Web / Mobil Yazılım Geliştirme',
          'ERP / CRM / Depo Yönetim Sistemi Entegrasyonu',
          'Kurumsal Donanım & Sunucu Tedariği (Laptop, Server, Ağ)',
          'Siber Güvenlik, Firewall & SOC Hizmeti',
          'Bulut (Cloud) Altyapı & Veri Tabanı Barındırma'
        ]
      },
      {
        id: 'mimariDagitim',
        label: 'Dağıtım & Barındırma Mimarisi',
        type: 'badge-group',
        group: 'teknik',
        defaultValue: 'Bulut Tabanlı (Cloud / SaaS)',
        options: [
          'Bulut Tabanlı (Cloud / SaaS)',
          'Şirket Kendi Sunucularında (On-Premises)',
          'Hibrit Bulut (Hybrid)'
        ]
      },
      {
        id: 'kaynakKodDevri',
        label: 'Tüm Kaynak Kodların (Source Code) Mülkiyeti Devredilecek mi?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'İşverene ait özel geliştirilen yazılımlarda tüm telif ve kaynak kodlar devredilmelidir.'
      },
      {
        id: 'slaMudahaleSuresi',
        label: 'SLA (Hizmet Seviyesi) Destek Taahhüdü',
        type: 'select',
        group: 'ticari',
        required: true,
        options: [
          '7/24 Kritik Hatalara 2 Saat İçinde Müdahale',
          'Mesai Saatleri İçinde (4 Saat İçinde Müdahale)',
          'NBD (Sonraki İş Günü Yerinde Müdahale)'
        ]
      },
      {
        id: 'kvkkOwaspTesti',
        label: 'TSE Onaylı Bağımsız Sızma (Pentest) ve KVKK Raporu Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      }
    ]
  },

  // =========================================================================
  // 9. 🏥 SAĞLIK, MEDİKAL CİHAZ & TIBBİ SARF İHALELERİ
  // =========================================================================
  saglik_medikal: {
    key: 'saglik_medikal',
    name: 'Sağlık, Medikal Cihaz & Sarf İhalesi',
    icon: 'Stethoscope',
    badgeText: '🏥 Medikal Şartname',
    description: 'Tıbbi cihaz ve sarf alımları için Sağlık Bakanlığı ÜTS barkod kaydı, CE/MDR belgeleri ve raf ömrü kriterleri.',
    groups: {
      teknik: { title: '1. Tıbbi Ürün Niteliği & Adet', desc: 'Cihaz veya sarf malzeme türü ve teknik parametreler' },
      mevzuat: { title: '2. ÜTS, CE & MDR Mevzuatı', desc: 'Sağlık Bakanlığı ÜTS kaydı ve ISO 13485 akreditasyonu' },
      ticari: { title: '3. Garanti, Servis & Raf Ömrü (Miad)', desc: 'Kalan raf ömrü ve periyodik kalibrasyon taahhüdü' }
    },
    fields: [
      {
        id: 'medikalUrunTuru',
        label: 'Tıbbi Ürün / Cihaz Sınıfı',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Tıbbi Sarf Malzeme (Enjektör, Eldiven, Gazlı Bez vb.)',
          'Biyomedikal / Tanı & Teşhis Cihazı',
          'Laboratuvar Kiti & Reaktifler',
          'Hastane Donanımı & Medikal Yatak/Demirbaş'
        ]
      },
      {
        id: 'utsKayitZorunlu',
        label: 'Sağlık Bakanlığı ÜTS (Ürün Takip Sistemi) Kayıt Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true,
        helpText: 'Türkiye Cumhuriyeti Sağlık Bakanlığı ÜTS sisteminde barkod ve firma kaydı zorunludur.'
      },
      {
        id: 'kalanRafOmruYuzde',
        label: 'Teslim Anında Asgari Raf Ömrü (Miad)',
        type: 'select',
        group: 'ticari',
        required: true,
        options: [
          'Toplam Raf Ömrünün En Az %75’i Kalmış Olmalı',
          'En Az 2 Yıl Kalan Miadlı',
          'En Az 1 Yıl Kalan Miadlı'
        ]
      },
      {
        id: 'ceMdrUygunluk',
        label: 'CE İşareti & ISO 13485 Tıbbi Cihaz Kalite Belgesi Şartı',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      }
    ]
  },

  // =========================================================================
  // 10. 🚚 LOJİSTİK, TAŞIMACILIK & DEPOLAMA İHALELERİ
  // =========================================================================
  lojistik_tasimacilik: {
    key: 'lojistik_tasimacilik',
    name: 'Lojistik & Taşımacılık İhalesi',
    icon: 'Truck',
    badgeText: '🚚 Lojistik Şartnamesi',
    description: 'Karayolu, soğuk zincir, parsiyel veya komple tır taşımacılığı için güzergah, tonaj ve emtia sigortası kriterleri.',
    groups: {
      teknik: { title: '1. Taşıma Modu & Yük Özellikleri', desc: 'Komple tır, parsiyel, soğuk zincir ve palet adedi' },
      mevzuat: { title: '2. Yetki Belgeleri & ADR Şartı', desc: 'K1 yetki belgesi, SRC ve tehlikeli madde (ADR) belgeleri' },
      ticari: { title: '3. Güzergah & Sigorta Teminatı', desc: 'Çıkış-varış noktası ve CMR / Nakliyat all-risk poliçesi' }
    },
    fields: [
      {
        id: 'tasimaModu',
        label: 'Taşımacılık ve Sevkiyat Modeli',
        type: 'select',
        group: 'teknik',
        required: true,
        options: [
          'Komple Tır Sevkiyatı (FTL)',
          'Parsiyel / Parça Yük Taşımacılığı (LTL)',
          'Soğuk Zincir / Frigorifik Taşıma (-18°C / +4°C)',
          'Konteyner Denizyolu Taşımacılığı',
          'Ağır Nakliyat & Gabari Dışı Proje Taşımacılığı'
        ]
      },
      {
        id: 'guzergahCikisVaris',
        label: 'Çıkış ve Varış Noktası (Güzergah)',
        type: 'text',
        group: 'ticari',
        required: true,
        placeholder: 'Örn: Balıkesir OSB -> Kocaeli Gebze Depo'
      },
      {
        id: 'toplamTonajHacim',
        label: 'Yük Tonajı veya Palet Sayısı',
        type: 'text',
        group: 'teknik',
        placeholder: 'Örn: 24 Ton (33 Euro Palet)'
      },
      {
        id: 'nakliyatEmtiaSigortasi',
        label: 'CMR & Nakliyat Emtia All-Risk Sigortası Zorunlu mu?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: true
      },
      {
        id: 'adrBelgesiZorunlu',
        label: 'ADR (Tehlikeli Madde Taşıma) Belgesi Gerekli mi?',
        type: 'boolean',
        group: 'mevzuat',
        defaultValue: false
      }
    ]
  }
}

/**
 * Verilen kategori ve alt kategoriye göre en uygun sektörel şemayı belirler.
 */
export function resolveSectorKey(kategori: string, altKategori: string = ''): string {
  const cat = (kategori || '').toLowerCase()
  const sub = (altKategori || '').toLowerCase()
  const combined = `${cat} ${sub}`

  // 1. Akaryakıt & Enerji
  if (
    combined.includes('akaryakıt') ||
    combined.includes('benzin') ||
    combined.includes('motorin') ||
    combined.includes('dizel') ||
    combined.includes('lpg') ||
    combined.includes('lng') ||
    combined.includes('fuel oil') ||
    (cat.includes('enerji') && !sub.includes('güneş') && !sub.includes('rüzgar'))
  ) {
    return 'akaryakit_enerji'
  }

  // 2. Gayrimenkul alt kategorileri (Arsa, Konut, Ticari ayrımı)
  if (combined.includes('gayrimenkul') || combined.includes('emlak')) {
    if (
      sub.includes('arsa') ||
      sub.includes('tarla') ||
      sub.includes('bağ') ||
      sub.includes('bahçe') ||
      sub.includes('arazi')
    ) {
      return 'arsa_arazi'
    }

    if (
      sub.includes('konut') ||
      sub.includes('daire') ||
      sub.includes('villa') ||
      sub.includes('ev') ||
      sub.includes('rezidans') ||
      sub.includes('dubleks')
    ) {
      return 'konut_daire'
    }

    if (
      sub.includes('ofis') ||
      sub.includes('dükkan') ||
      sub.includes('plaza') ||
      sub.includes('fabrika') ||
      sub.includes('depo') ||
      sub.includes('antrepo') ||
      sub.includes('avm') ||
      sub.includes('tesis')
    ) {
      return 'ticari_gayrimenkul'
    }

    return 'konut_daire'
  }

  // 3. Doğrudan Arsa araması
  if (combined.includes('arsa') || combined.includes('tarla') || combined.includes('arazi')) {
    return 'arsa_arazi'
  }

  // 4. Doğrudan Konut araması
  if (combined.includes('konut') || combined.includes('daire') || combined.includes('villa')) {
    return 'konut_daire'
  }

  // 5. İnşaat ve Yapı
  if (
    combined.includes('inşaat') ||
    combined.includes('yapı') ||
    combined.includes('müteahhit') ||
    combined.includes('kaba inşaat') ||
    combined.includes('tadilat') ||
    combined.includes('hafriyat') ||
    combined.includes('beton')
  ) {
    return 'insaat_yapi'
  }

  // 6. Araç & İş Makineleri
  if (
    combined.includes('araç') ||
    combined.includes('filo') ||
    combined.includes('iş makine') ||
    combined.includes('ekskavatör') ||
    combined.includes('kamyon') ||
    combined.includes('tır') ||
    combined.includes('forklift') ||
    combined.includes('otomobil')
  ) {
    return 'arac_is_makinesi'
  }

  // 7. Gıda & Catering
  if (
    combined.includes('gıda') ||
    combined.includes('catering') ||
    combined.includes('yemek') ||
    combined.includes('kumanya') ||
    combined.includes('tabldot')
  ) {
    return 'gida_catering'
  }

  // 8. Bilişim & Teknoloji
  if (
    combined.includes('bilişim') ||
    combined.includes('bilgisayar') ||
    combined.includes('yazılım') ||
    combined.includes('teknoloji') ||
    combined.includes('sunucu') ||
    combined.includes('erp') ||
    combined.includes('bulut')
  ) {
    return 'bilisim_teknoloji'
  }

  // 9. Sağlık & Medikal
  if (
    combined.includes('sağlık') ||
    combined.includes('medikal') ||
    combined.includes('tıbbi') ||
    combined.includes('hastane') ||
    combined.includes('ilaç')
  ) {
    return 'saglik_medikal'
  }

  // 10. Lojistik & Nakliye
  if (
    combined.includes('lojistik') ||
    combined.includes('nakliye') ||
    combined.includes('taşımacılık') ||
    combined.includes('kargo')
  ) {
    return 'lojistik_tasimacilik'
  }

  // Varsayılan sektör
  return 'insaat_yapi'
}

/**
 * İhale kartlarında gösterilmek üzere doldurulmuş sektörel parametrelerden
 * özet rozetler türetir.
 */
export function formatSectorSummaryBadges(
  categorySpecificData: Record<string, any> = {},
  sectorKey: string = ''
): Array<{ label: string; value: string }> {
  if (!categorySpecificData || Object.keys(categorySpecificData).length === 0) {
    return []
  }

  // Auto-resolve sectorKey if not explicitly provided
  let effectiveKey = sectorKey || categorySpecificData._sectorKey || ''
  if (!effectiveKey) {
    if (categorySpecificData.yakitTuru || categorySpecificData.miktarLitre) effectiveKey = 'akaryakit_enerji'
    else if (categorySpecificData.toplamInsaatAlani || categorySpecificData.projeTuru || categorySpecificData.muteahhitlikBelgeGrubu) effectiveKey = 'insaat_yapi'
    else if (categorySpecificData.adaParselNo || categorySpecificData.toplamYuzolcumuM2 || categorySpecificData.imarDurumu) effectiveKey = 'arsa_arazi'
    else if (categorySpecificData.odaSayisi || categorySpecificData.netMetrekare) effectiveKey = 'konut_daire'
    else if (categorySpecificData.ticariNitelik || categorySpecificData.kapaliAlanM2) effectiveKey = 'ticari_gayrimenkul'
    else if (categorySpecificData.aracSinifi || categorySpecificData.aracAdedi) effectiveKey = 'arac_is_makinesi'
    else if (categorySpecificData.gunlukKisiSayisi || categorySpecificData.menuKapSayisi) effectiveKey = 'gida_catering'
    else if (categorySpecificData.projeKapsami || categorySpecificData.teknolojiYigini) effectiveKey = 'bilisim_teknoloji'
    else if (categorySpecificData.urunKategorisi || categorySpecificData.utsKayitZorunlulugu) effectiveKey = 'saglik_medikal'
    else if (categorySpecificData.tasimaTuru || categorySpecificData.rotaCinsi) effectiveKey = 'lojistik_tasimacilik'
    else effectiveKey = 'insaat_yapi'
  }

  const badges: Array<{ label: string; value: string }> = []

  if (effectiveKey === 'akaryakit_enerji') {
    if (categorySpecificData.yakitTuru) {
      badges.push({ label: 'Ürün', value: String(categorySpecificData.yakitTuru) })
    }
    if (categorySpecificData.miktarLitre) {
      badges.push({ label: 'Hacim', value: `${Number(categorySpecificData.miktarLitre).toLocaleString('tr-TR')} Litre` })
    }
    if (categorySpecificData.iskontoOrani) {
      badges.push({ label: 'İskonto', value: `%${categorySpecificData.iskontoOrani}` })
    }
  } else if (effectiveKey === 'insaat_yapi') {
    if (categorySpecificData.toplamInsaatAlani) {
      badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamInsaatAlani).toLocaleString('tr-TR')} m²` })
    }
    if (categorySpecificData.projeTuru) {
      badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeTuru) })
    }
    if (categorySpecificData.muteahhitlikBelgeGrubu) {
      badges.push({ label: 'Belge', value: String(categorySpecificData.muteahhitlikBelgeGrubu) })
    }
  } else if (effectiveKey === 'arsa_arazi') {
    if (categorySpecificData.adaParselNo) {
      badges.push({ label: 'Ada/Parsel', value: String(categorySpecificData.adaParselNo) })
    }
    if (categorySpecificData.toplamYuzolcumuM2) {
      badges.push({ label: 'Yüzölçümü', value: `${Number(categorySpecificData.toplamYuzolcumuM2).toLocaleString('tr-TR')} m²` })
    }
    if (categorySpecificData.imarDurumu) {
      badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
    }
    if (categorySpecificData.asgariKatKarsiligiOrani) {
      badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.asgariKatKarsiligiOrani}` })
    }
  } else if (effectiveKey === 'konut_daire') {
    if (categorySpecificData.odaSayisi) {
      badges.push({ label: 'Oda', value: String(categorySpecificData.odaSayisi) })
    }
    if (categorySpecificData.netMetrekare) {
      badges.push({ label: 'Net', value: `${categorySpecificData.netMetrekare} m²` })
    }
    if (categorySpecificData.tapuMulkDurumu) {
      badges.push({ label: 'Tapu', value: String(categorySpecificData.tapuMulkDurumu) })
    }
  } else if (effectiveKey === 'ticari_gayrimenkul') {
    if (categorySpecificData.ticariNitelik) {
      badges.push({ label: 'Tip', value: String(categorySpecificData.ticariNitelik) })
    }
    if (categorySpecificData.kapaliAlanM2) {
      badges.push({ label: 'Kapalı Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
    }
  } else if (effectiveKey === 'arac_is_makinesi') {
    if (categorySpecificData.aracSinifi) {
      badges.push({ label: 'Sınıf', value: String(categorySpecificData.aracSinifi) })
    }
    if (categorySpecificData.aracAdedi) {
      badges.push({ label: 'Adet', value: `${categorySpecificData.aracAdedi} Adet` })
    }
  } else if (effectiveKey === 'gida_catering') {
    if (categorySpecificData.gunlukKisiSayisi) {
      badges.push({ label: 'Kapasite', value: `${categorySpecificData.gunlukKisiSayisi} Kişi/Gün` })
    }
    if (categorySpecificData.menuKapSayisi) {
      badges.push({ label: 'Menü', value: String(categorySpecificData.menuKapSayisi) })
    }
  } else if (effectiveKey === 'bilisim_teknoloji') {
    if (categorySpecificData.projeKapsami) {
      badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeKapsami) })
    }
    if (categorySpecificData.slaHedefi) {
      badges.push({ label: 'SLA', value: String(categorySpecificData.slaHedefi) })
    }
  } else if (effectiveKey === 'saglik_medikal') {
    if (categorySpecificData.urunKategorisi) {
      badges.push({ label: 'Kategori', value: String(categorySpecificData.urunKategorisi) })
    }
    if (categorySpecificData.utsKayitZorunlulugu) {
      badges.push({ label: 'ÜTS', value: 'Kayıt Şartı Var' })
    }
  } else if (effectiveKey === 'lojistik_tasimacilik') {
    if (categorySpecificData.tasimaTuru) {
      badges.push({ label: 'Mod', value: String(categorySpecificData.tasimaTuru) })
    }
    if (categorySpecificData.seferSayisi) {
      badges.push({ label: 'Sefer', value: `${categorySpecificData.seferSayisi} Sefer` })
    }
  }

  return badges
}
