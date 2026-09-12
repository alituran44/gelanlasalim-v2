# -*- coding: utf-8 -*-
# Sektörler 1 - 6
DATA = {}

# 1. İnşaat, Altyapı, Yapım & Yıkım
DATA['insaat_altyapi'] = {
    'key': 'insaat_altyapi',
    'name': 'İnşaat, Altyapı & Yapım İşi İhalesi',
    'icon': 'HardHat',
    'badgeText': '🏗️ İnşaat & Altyapı Şartnamesi',
    'description': 'Bina yapımı, yol, köprü, kazı-dolgu, çelik konstrüksiyon ve yıkım ihaleleri için ÇŞB yetki belgesi, şantiye şefi ve hakediş kriterleri.',
    'groups': {
        'teknik': {'title': '1. Yapım Alanı & Metrik Büyüklükler', 'desc': 'İnşaat alanı, beton sınıfı ve donatı tonajı'},
        'mevzuat': {'title': '2. Müteahhitlik Lisansı & Ruhsat Şartları', 'desc': 'ÇŞB yetki belgesi grubu ve yapı denetim gereksinimleri'},
        'ticari': {'title': '3. Hakediş, Teminat & Garanti Modeli', 'desc': 'Aylık hakediş ve kesin teminat oranı'}
    },
    'fields': [
        {'id': 'toplamInsaatAlani', 'label': 'Toplam İnşaat / Kazı Alanı', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 4500', 'group': 'teknik', 'required': True, 'defaultValue': 4500},
        {'id': 'projeTuru', 'label': 'Yapım / İhale Türü', 'type': 'select', 'group': 'teknik', 'options': ['Bina Yapımı & Taahhüt', 'Yol, Köprü & Viyadük', 'Hafriyat, Kazı & Dolgu', 'Çelik Konstrüksiyon Fabrika', 'Prefabrik Şantiye Yapıları', 'Tadilat & Güçlendirme'], 'defaultValue': 'Bina Yapımı & Taahhüt'},
        {'id': 'betonSinifi', 'label': 'Asgari Beton Sınıfı', 'type': 'select', 'group': 'teknik', 'options': ['C25/30', 'C30/37', 'C35/45', 'C40/50', 'BS 25'], 'defaultValue': 'C30/37'},
        {'id': 'demirTonaji', 'label': 'Tahmini Donatı Demir Tonajı', 'type': 'number', 'unit': 'Ton', 'placeholder': 'Örn: 220', 'group': 'teknik', 'defaultValue': 220},
        {'id': 'muteahhitlikBelgeGrubu', 'label': 'ÇŞB Müteahhitlik Yetki Belgesi Grubu', 'type': 'select', 'group': 'mevzuat', 'options': ['A Grubu (Sınırsız)', 'B Grubu', 'C Grubu', 'D Grubu', 'E Grubu', 'F Grubu', 'G Grubu', 'H Grubu'], 'defaultValue': 'C Grubu'},
        {'id': 'imarVeRuhsatDurumu', 'label': 'İmar & Yapı Ruhsatı Durumu', 'type': 'select', 'group': 'mevzuat', 'options': ['Yapı Ruhsatı Alınmış (İnşaata Hazır)', 'Ruhsat Başvurusu Aşamasında', 'İmar Çapı ve Aplikasyon Mevcut'], 'defaultValue': 'Yapı Ruhsatı Alınmış (İnşaata Hazır)'},
        {'id': 'santiyeSefiVeIsgSarti', 'label': 'Tam Zamanlı Şantiye Şefi & İSG Uzmanı Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'teminatOrani', 'label': 'Kesin Teminat Mektubu Oranı', 'type': 'number', 'unit': '%', 'placeholder': 'Örn: 6', 'group': 'ticari', 'defaultValue': 6},
        {'id': 'hakedisPeriyodu', 'label': 'Hakediş & Ödeme Modeli', 'type': 'select', 'group': 'ticari', 'options': ['Aylık İlerleme Hakedişi (Yeşil Defter)', 'Aşama Bazlı Hakediş (Subasman, Kaba, İnce)', 'Anahtar Teslim Götürü Bedel'], 'defaultValue': 'Aylık İlerleme Hakedişi (Yeşil Defter)'},
        {'id': 'kusurSorumlulukSuresi', 'label': 'Kusur Sorumluluk & Garanti Süresi', 'type': 'select', 'group': 'ticari', 'options': ['12 Ay', '24 Ay', '36 Ay', '60 Ay'], 'defaultValue': '24 Ay'}
    ],
    'quickPresets': [
        {'label': '4.500 m² Fabrika Binası Yapımı', 'values': {'toplamInsaatAlani': 4500, 'projeTuru': 'Çelik Konstrüksiyon Fabrika', 'betonSinifi': 'C30/37', 'demirTonaji': 180, 'muteahhitlikBelgeGrubu': 'C Grubu', 'teminatOrani': 6, 'kusurSorumlulukSuresi': '24 Ay'}},
        {'label': '20.000 m³ Kazı ve Hafriyat', 'values': {'toplamInsaatAlani': 20000, 'projeTuru': 'Hafriyat, Kazı & Dolgu', 'muteahhitlikBelgeGrubu': 'E Grubu', 'teminatOrani': 5}}
    ]
}

# 2. Sağlık, İlaç & Medikal Sarf
DATA['saglik_ilac'] = {
    'key': 'saglik_ilac',
    'name': 'Sağlık, İlaç & Medikal Sarf İhalesi',
    'icon': 'Stethoscope',
    'badgeText': '💊 Sağlık & İlaç Şartnamesi',
    'description': 'Hastaneler ve klinikler için ilaç, serum, cerrahi sarf, ortopedi ve kişisel hijyen malzemesi tedarik kriterleri.',
    'groups': {
        'teknik': {'title': '1. Tıbbi Sarf & Ürün Niteliği', 'desc': 'Etken madde, dozaj, kutu adedi ve soğuk zincir aralığı'},
        'mevzuat': {'title': '2. Sağlık Bakanlığı Ruhsat & İTS Şartları', 'desc': 'TİTCK ruhsatı, İlaç Takip Sistemi (İTS) ve GMP uygunluğu'},
        'ticari': {'title': '3. Raf Ömrü & Çağrılı Sevkiyat Modeli', 'desc': 'Kalan asgari raf ömrü ve kısmi teslimat takvimi'}
    },
    'fields': [
        {'id': 'ilacSarfKategorisi', 'label': 'Ürün Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Reçeteli Beşeri İlaç & Antibiyotik', 'Serum & Solüsyon (IV İntravenöz)', 'Cerrahi İplik & Dikiş Sarfları', 'Ortopedi & Protez Ürünleri', 'Laboratuvar Teşhis Kitleri', 'Tıbbi Dezenfektan & Kişisel Hijyen'], 'defaultValue': 'Serum & Solüsyon (IV İntravenöz)'},
        {'id': 'kutuAdedi', 'label': 'Talep Edilen Kutu / Paket Adedi', 'type': 'number', 'unit': 'Kutu', 'placeholder': 'Örn: 25000', 'group': 'teknik', 'required': True, 'defaultValue': 25000},
        {'id': 'saklamaKosulu', 'label': 'Saklama Sıcaklığı & Zincir Şartı', 'type': 'select', 'group': 'teknik', 'options': ['Soğuk Zincir (+2°C / +8°C)', 'Kontrollü Oda Sıcaklığı (15°C - 25°C)', 'Işıktan Muhafazalı Kuru Depolama'], 'defaultValue': 'Soğuk Zincir (+2°C / +8°C)'},
        {'id': 'titckRuhsati', 'label': 'TİTCK Sağlık Bakanlığı İlaç/Ürün Ruhsatı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'itsKarekodSarti', 'label': 'İlaç Takip Sistemi (İTS) Karekod Bildirimi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gmpSertifikasi', 'label': 'GMP (İyi İmalat Uygulamaları) Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'rafOmruKriteri', 'label': 'Asgari Kalan Raf Ömrü', 'type': 'select', 'group': 'ticari', 'options': ['En Az %75 Kalan Raf Ömrü', 'En Az %80 Kalan Raf Ömrü', 'Teslim Tarihinden İtibaren En Az 18 Ay'], 'defaultValue': 'En Az %75 Kalan Raf Ömrü'},
        {'id': 'teslimatPeriyodu', 'label': 'Sevkiyat & Dağıtım Takvimi', 'type': 'select', 'group': 'ticari', 'options': ['Aylık Düzenli Çağrılı Sevkiyat (3 Parti)', 'Tek Seferde Toplu Depo Teslimi', 'Haftalık İhtiyaç Siparişi'], 'defaultValue': 'Aylık Düzenli Çağrılı Sevkiyat (3 Parti)'}
    ],
    'quickPresets': [
        {'label': '50.000 Şişe IV Serum Alımı', 'values': {'ilacSarfKategorisi': 'Serum & Solüsyon (IV İntravenöz)', 'kutuAdedi': 50000, 'titckRuhsati': True, 'itsKarekodSarti': True}},
        {'label': 'Soğuk Zincir Biyolojik İlaç Tedariği', 'values': {'ilacSarfKategorisi': 'Reçeteli Beşeri İlaç & Antibiyotik', 'saklamaKosulu': 'Soğuk Zincir (+2°C / +8°C)', 'kutuAdedi': 10000}}
    ]
}

# 3. Gıda, Tarım Ürünleri & Hububat
DATA['gida_tarim'] = {
    'key': 'gida_tarim',
    'name': 'Gıda, Tarım Ürünleri & Hububat İhalesi',
    'icon': 'UtensilsCrossed',
    'badgeText': '🌾 Gıda & Tarım Şartnamesi',
    'description': 'Bakliyat, un, şeker, yağ, et, süt ve taze sebze-meyve toptan tedarikinde kodeks, analiz ve ambalaj şartları.',
    'groups': {
        'teknik': {'title': '1. Gıda Grubu & Metrik Miktar', 'desc': 'Ürün cinsi, tonaj ve rutubet/asitlik parametreleri'},
        'mevzuat': {'title': '2. Tarım Bakanlığı İzin & Kalite Standartları', 'desc': 'Türk Gıda Kodeksi, işletme kayıt/onay no ve Helal sertifikası'},
        'ticari': {'title': '3. Ambalaj, Numune & Sevkiyat', 'desc': 'Soğuk zincir ve bağımsız akredite laboratuvar analizi'}
    },
    'fields': [
        {'id': 'gidaGrubu', 'label': 'Gıda Ürün Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)', 'Un, İrmik & Şeker Toptan', 'Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)', 'Kırmızı Et & Beyaz Et Ürünleri', 'Süt, Peynir & Şarküteri', 'Sebze & Meyve Toptan', 'Salça, Konserve & Sos'], 'defaultValue': 'Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)'},
        {'id': 'miktarTon', 'label': 'Toplam Sipariş Miktarı', 'type': 'number', 'unit': 'Ton', 'placeholder': 'Örn: 25', 'group': 'teknik', 'required': True, 'defaultValue': 25},
        {'id': 'ambalajSekli', 'label': 'Ambalaj & Paketleme Şekli', 'type': 'select', 'group': 'teknik', 'options': ['25 kg / 50 kg Gıdaya Uygun PP Çuval', '1 kg / 5 kg Orijinal Vakumlu Koli', '5 Litre / 18 Litre Teneke (Yağ)', 'Kasa / Plastik Palet (Taze Ürün)', 'Silobas / Dökme Tanker'], 'defaultValue': '25 kg / 50 kg Gıdaya Uygun PP Çuval'},
        {'id': 'tarimBakanligiOnayNo', 'label': 'Tarım ve Orman Bakanlığı İşletme Onay / Kayıt No', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'turkGidaKodeksiUygunlugu', 'label': 'Türk Gıda Kodeksi Uygunluk Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'helalGidaSertifikasi', 'label': 'Helal Akreditasyon Kurumu (HAK) Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'analizRaporuSarti', 'label': 'Her Partide Akredite Laboratuvar Rutubet/Pestisit Analizi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'sogukZincirSevkiyat', 'label': 'Frigofirik (+4°C / -18°C) Soğuk Zincir Taşımacılık', 'type': 'boolean', 'group': 'ticari', 'defaultValue': False},
        {'id': 'numuneOnayProseduru', 'label': 'Teklif Aşamasında Fiziksel Numune Onay Şartı', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '50 Ton Pirinç & Kırmızı Mercimek', 'values': {'gidaGrubu': 'Kuru Bakliyat & Hububat (Pirinç, Fasulye, Mercimek)', 'miktarTon': 50, 'tarimBakanligiOnayNo': True, 'turkGidaKodeksiUygunlugu': True}},
        {'label': '10 Ton Yemeklik Ayçiçek Yağı Alımı', 'values': {'gidaGrubu': 'Yemeklik Bitkisel Sıvı Yağ (Ayçiçek / Zeytinyağı)', 'miktarTon': 10, 'analizRaporuSarti': True}}
    ]
}

# 4. Tıbbi Cihaz & Hastane Ekipmanları
DATA['tibbi_cihaz'] = {
    'key': 'tibbi_cihaz',
    'name': 'Tıbbi Cihaz & Hastane Ekipmanları İhalesi',
    'icon': 'Stethoscope',
    'badgeText': '🩺 Tıbbi Cihaz & Laboratuvar Şartnamesi',
    'description': 'Radyoloji, yoğun bakım, cerrahi ve laboratuvar cihazları için TİTCK ÜTS kaydı, CE MDR ve 10 yıl yedek parça taahhüdü.',
    'groups': {
        'teknik': {'title': '1. Cihaz Sınıfı & Teknik Kapasite', 'desc': 'Cihaz kategorisi, adedi, menşei ve kalibrasyon'},
        'mevzuat': {'title': '2. Sağlık Bakanlığı ÜTS & CE MDR Standartları', 'desc': 'TİTCK Ürün Takip Sistemi kaydı ve tıbbi cihaz direktifleri'},
        'ticari': {'title': '3. Yerinde Montaj, Garanti & Yedek Parça', 'desc': 'Yetkili servislik, kullanıcı eğitimi ve 10 yıl parça güvencesi'}
    },
    'fields': [
        {'id': 'cihazSinifi', 'label': 'Cihaz Sınıfı / Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Görüntüleme & Radyoloji (MR, CT, Röntgen)', 'Yoğun Bakım & Mekanik Ventilatör', 'Hasta Başı Monitör & Defibrilatör', 'Cerrahi Operasyon & Lazer Cihazları', 'Laboratuvar Biyokimya & Hemogram Analizörleri', 'Buharlı Hastane Otoklav & Sterilizatör', 'Motorlu Hasta Yatağı & Diyaliz Koltuğu'], 'defaultValue': 'Hasta Başı Monitör & Defibrilatör'},
        {'id': 'cihazAdedi', 'label': 'Alınacak Cihaz Adedi', 'type': 'number', 'unit': 'Adet', 'placeholder': 'Örn: 15', 'group': 'teknik', 'required': True, 'defaultValue': 15},
        {'id': 'cihazMensei', 'label': 'Menşei Tercihi', 'type': 'select', 'group': 'teknik', 'options': ['Yerli Malı Belgeli (%15 Fiyat Avantajı)', 'AB / ABD / Japonya Menşeili', 'Serbest'], 'defaultValue': 'Serbest'},
        {'id': 'utsKayitZorunlulugu', 'label': 'Sağlık Bakanlığı TİTCK ÜTS (Ürün Takip Sistemi) Kaydı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'ceMdrUygunlugu', 'label': 'Avrupa Tıbbi Cihaz Regülasyonu (CE MDR 2017/745)', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kalibrasyonSertifikasi', 'label': 'TÜRKAK Akredite İlk Biyomedikal Kalibrasyon Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'garantiSuresiYil', 'label': 'Tam Garanti Süresi', 'type': 'select', 'group': 'ticari', 'options': ['2 Yıl Tam Garanti', '3 Yıl Tam Garanti', '5 Yıl Kapsamlı Garanti'], 'defaultValue': '2 Yıl Tam Garanti'},
        {'id': 'yedekParcaTeminTaahhudu', 'label': 'Ücreti Mukabili Yedek Parça Bulundurma Taahhüdü', 'type': 'select', 'group': 'ticari', 'options': ['5 Yıl Yedek Parça', '10 Yıl Kesintisiz Yedek Parça'], 'defaultValue': '10 Yıl Kesintisiz Yedek Parça'},
        {'id': 'montajVeEgitimDahil', 'label': 'Yerinde Kurulum, Montaj ve Biyomedikal Kullanıcı Eğitimi Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '20 Adet Hasta Başı Monitör Seti', 'values': {'cihazSinifi': 'Hasta Başı Monitör & Defibrilatör', 'cihazAdedi': 20, 'utsKayitZorunlulugu': True, 'garantiSuresiYil': '3 Yıl Tam Garanti'}},
        {'label': 'Buharlı Hastane Otoklav Cihazı', 'values': {'cihazSinifi': 'Buharlı Hastane Otoklav & Sterilizatör', 'cihazAdedi': 2, 'kalibrasyonSertifikasi': True}}
    ]
}

# 5. Kanalizasyon, Su Şebekesi & Doğalgaz
DATA['kanalizasyon_su'] = {
    'key': 'kanalizasyon_su',
    'name': 'Kanalizasyon, Su Şebekesi & Doğalgaz Tesisatı İhalesi',
    'icon': 'Layers',
    'badgeText': '🚰 Su & Tesisat Şartnamesi',
    'description': 'İçme suyu, kanalizasyon, doğalgaz altyapı boruları, vana, sayaç ve hidrofor sistemleri kalite kriterleri.',
    'groups': {
        'teknik': {'title': '1. Boru & Malzeme Spesifikasyonu', 'desc': 'Boru hammaddesi, anma çapı, basınç dayanımı ve metraj'},
        'mevzuat': {'title': '2. İSKİ / DSI / TSE Standartları', 'desc': 'TSE EN 12201, içme suyu temas izni ve hidrostatik test'},
        'ticari': {'title': '3. Lojistik, İndirme & Kabul Şartları', 'desc': 'Şantiye sahasına indirme dahil teslimat ve test raporları'}
    },
    'fields': [
        {'id': 'boruTuru', 'label': 'Boru & Altyapı Malzemesi Cinsi', 'type': 'select', 'group': 'teknik', 'options': ['HDPE 100 Polietilen İçme Suyu Borusu', 'SN8 Koruge Çift Cidarlı Kanalizasyon Borusu', 'Çelik Çekme / Spiral Kaynaklı Doğalgaz Borusu', 'Duktil Döküm İçme Suyu Borusu', 'PPRC & PVC Temiz/Pis Su Tesisat Malzemesi', 'Sürgülü Vana, Kelebek Vana & Yangın Hidrantı'], 'defaultValue': 'HDPE 100 Polietilen İçme Suyu Borusu'},
        {'id': 'boruCapi', 'label': 'Boru Anma Çapı', 'type': 'select', 'group': 'teknik', 'options': ['DN63', 'DN110', 'DN160', 'DN200', 'DN300', 'DN400', 'DN600', 'DN800', 'DN1000+'], 'defaultValue': 'DN110'},
        {'id': 'basincDayanimi', 'label': 'Basınç Dayanım Sınıfı', 'type': 'select', 'group': 'teknik', 'options': ['PN6', 'PN10', 'PN16', 'PN25', 'SN4', 'SN8'], 'defaultValue': 'PN16'},
        {'id': 'toplamMetraj', 'label': 'Toplam Metraj / Miktar', 'type': 'number', 'unit': 'Metre', 'placeholder': 'Örn: 5000', 'group': 'teknik', 'required': True, 'defaultValue': 5000},
        {'id': 'tseUygunlukBelgesi', 'label': 'TSE EN 12201 / TSE EN 13476 Standart Uygunluk Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gidaTemasIcmeSuyuOnayi', 'label': 'İçme Suyuna Temas Uygunluk (Hıfzıssıhha Sağlık Raporu)', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'hidrostatikBasincTesti', 'label': 'Fabrika Hidrostatik Basınç ve Et Kalınlığı Test Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'sahayaIndirmeDahil', 'label': 'Yüklenici Araçlarıyla Şantiye Hattı Boyunca İndirme Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '10.000 Metre HDPE 100 PN16 DN110 Hattı', 'values': {'boruTuru': 'HDPE 100 Polietilen İçme Suyu Borusu', 'boruCapi': 'DN110', 'basincDayanimi': 'PN16', 'toplamMetraj': 10000}},
        {'label': '3.000 Metre SN8 DN400 Koruge Boru', 'values': {'boruTuru': 'SN8 Koruge Çift Cidarlı Kanalizasyon Borusu', 'boruCapi': 'DN400', 'basincDayanimi': 'SN8', 'toplamMetraj': 3000}}
    ]
}

# 6. Enerji & Elektrik Tesisatı
DATA['enerji_elektrik'] = {
    'key': 'enerji_elektrik',
    'name': 'Enerji, Elektrik Tesisatı & Aydınlatma İhalesi',
    'icon': 'Fuel',
    'badgeText': '⚡ Enerji & Elektrik Şartnamesi',
    'description': 'Güneş enerjisi (GES), trafo merkezleri, jeneratörler, AG/OG dağıtım panoları ve LED aydınlatma kriterleri.',
    'groups': {
        'teknik': {'title': '1. Elektrik & Güç Parametreleri', 'desc': 'Sistem tipi, kurulu güç, kablo kesiti ve jeneratör kVA'},
        'mevzuat': {'title': '2. TEDAŞ / TEİAŞ & EPDK Proje Onayları', 'desc': 'Resmî şebeke bağlantı anlaşması ve EMO onaylı elektrik projesi'},
        'ticari': {'title': '3. EPC Kurulum, Devreye Alma & Performans', 'desc': 'Kabul testleri, invertör ve panel garantileri'}
    },
    'fields': [
        {'id': 'sistemTipi', 'label': 'Enerji / Elektrik Sistem Tipi', 'type': 'select', 'group': 'teknik', 'options': ['Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)', 'Arazi Tipi Lisanssız GES Yatırımı', '1.600 kVA Dağıtım Trafosu & OG Hücreleri', 'Dizel Otomatik Jeneratör & Transfer Panosu', 'Fabrika Ana Dağıtım & Kompanzasyon Panoları', 'Çevre & Otoyol LED Aydınlatma Direkleri'], 'defaultValue': 'Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)'},
        {'id': 'kuruluGucKva', 'label': 'Kurulu Güç Kapasitesi', 'type': 'number', 'unit': 'kVA / kWp', 'placeholder': 'Örn: 1000', 'group': 'teknik', 'required': True, 'defaultValue': 1000},
        {'id': 'kabloVeSalterStandarti', 'label': 'Kablo & Şalt Malzeme Standardı', 'type': 'select', 'group': 'teknik', 'options': ['Halogen Free (Alev İletmez, HFFR)', 'Standart PVC / XLPE Yeraltı Zırhlı', 'Solar PV 6mm² Çift İzolasyonlu'], 'defaultValue': 'Solar PV 6mm² Çift İzolasyonlu'},
        {'id': 'tedasTeiasOnayi', 'label': 'TEDAŞ / Dağıtım Şirketi Onaylı Proje ve Kabul Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'epdkBaglantiAnlasmasi', 'label': 'EPDK Bağlantı Anlaşması Çağrı Mektubu Mevcut', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'emoMuhendislikOnayi', 'label': 'EMO Tescilli Mühendislik & Topraklama Ölçüm Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'anahtarTeslimDevreyeAlma', 'label': 'EPC Anahtar Teslim Montaj, Şebeke Senkronizasyonu Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'sistemPerformansGarantisi', 'label': 'Performans & Üretim Garantisi', 'type': 'select', 'group': 'ticari', 'options': ['10 Yıl İnvertör / 25 Yıl Lineer Panel Garantisi', '2 Yıl Genel Tesisat & Malzeme Garantisi', '5 Yıl Kesintisiz Servis Garantisi'], 'defaultValue': '10 Yıl İnvertör / 25 Yıl Lineer Panel Garantisi'}
    ],
    'quickPresets': [
        {'label': '1 MWp Çatı GES Kurulumu', 'values': {'sistemTipi': 'Endüstriyel Çatı Güneş Enerji Santrali (Çatı GES)', 'kuruluGucKva': 1000, 'tedasTeiasOnayi': True, 'anahtarTeslimDevreyeAlma': True}},
        {'label': '800 kVA Dizel Jeneratör Sistemi', 'values': {'sistemTipi': 'Dizel Otomatik Jeneratör & Transfer Panosu', 'kuruluGucKva': 800}}
    ]
}
