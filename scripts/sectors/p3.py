# -*- coding: utf-8 -*-
# Sektörler 15 - 22
DATA = {}

# 15. Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye
DATA['matbaa_kirtasiye'] = {
    'key': 'matbaa_kirtasiye',
    'name': 'Matbaa, Ambalaj Koli & Kırtasiye İhalesi',
    'icon': 'Package',
    'badgeText': '📦 Matbaa & Ambalaj Şartnamesi',
    'description': 'Ofset/dijital baskı, oluklu mukavva koli, orijinal toner ve fotokopi kağıdı toptan alımları için FSC ve baskı prova kriterleri.',
    'groups': {
        'teknik': {'title': '1. Ürün Türü, Gramaj & Baskı Detayları', 'desc': 'Kağıt cinsi g/m², mukavva dalga cinsi ve adetler'},
        'mevzuat': {'title': '2. FSC & Çevre Standartları', 'desc': 'FSC sertifikalı kağıt, geri dönüştürülebilirlik ve gıda uyumu'},
        'ticari': {'title': '3. Baskı Provası, Koli İçi Paket & Teslimat', 'desc': 'Baskı öncesi renk provası onayı ve kısmi depo teslimatı'}
    },
    'fields': [
        {'id': 'kirtasiyeMatbaaTuru', 'label': 'Ürün Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Ofset / Dijital Süreli Yayın & Kitapçık Baskısı', 'Oluklu Mukavva Koli & Karton Ambalaj Kutusu', 'A4 / A3 80g Fotokopi Kağıdı Toptan', 'Orijinal / Yüksek Kapasiteli Lazer Toner', 'Kurumsal Baskılı Promosyon & Etiket Grubu'], 'defaultValue': 'Ofset / Dijital Süreli Yayın & Kitapçık Baskısı'},
        {'id': 'siparisAdedi', 'label': 'Talep Edilen Miktar / Adet', 'type': 'number', 'unit': 'Adet / Paket', 'placeholder': 'Örn: 10000', 'group': 'teknik', 'required': True, 'defaultValue': 10000},
        {'id': 'kagitGramajiVeCinsi', 'label': 'Kağıt / Mukavva Özelliği', 'type': 'select', 'group': 'teknik', 'options': ['80 g/m² 1. Hamur Beyaz Kağıt', '135 g/m² - 170 g/m² Parlak Kuşe Kağıt', 'Çift Dalga (Dopel) B/C Dalga Kraft Koli', 'Amerikan Bristol 300 g/m² Selofanlı', 'Doğal Kraft Geri Dönüştürülmüş'], 'defaultValue': '80 g/m² 1. Hamur Beyaz Kağıt'},
        {'id': 'fscSertifikasi', 'label': 'FSC (Orman Yönetim Konseyi) Sürdürülebilirlik Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gidaTemasUygunlugu', 'label': 'Gıda Temasına Uygunluk (Gıda Kolisi/Ambalajı İçin)', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'baskiProvasiOnayi', 'label': 'Baskı Öncesi Fiziksel Renk Provası (Proof) Islak İmza Onayı', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'paletliVeStrecliTeslim', 'label': 'Euro Palet Üzerinde Streçlenmiş ve Barkodlu Teslimat', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '1.000 Koli 80g A4 Fotokopi Kağıdı', 'values': {'kirtasiyeMatbaaTuru': 'A4 / A3 80g Fotokopi Kağıdı Toptan', 'siparisAdedi': 1000, 'kagitGramajiVeCinsi': '80 g/m² 1. Hamur Beyaz Kağıt', 'fscSertifikasi': True}},
        {'label': '25.000 Adet Çift Dalga Dopel İhracat Kolisi', 'values': {'kirtasiyeMatbaaTuru': 'Oluklu Mukavva Koli & Karton Ambalaj Kutusu', 'siparisAdedi': 25000, 'kagitGramajiVeCinsi': 'Çift Dalga (Dopel) B/C Dalga Kraft Koli'}}
    ]
}

# 16. Kent Mobilyaları - Prefabrik Yapılar - Doğrama
DATA['kent_mobilyalari'] = {
    'key': 'kent_mobilyalari',
    'name': 'Kent Mobilyaları, Prefabrik & Alüminyum Doğrama İhalesi',
    'icon': 'Building',
    'badgeText': '🏙️ Kent Mobilyaları Şartnamesi',
    'description': 'Park bankları, duraklar, çocuk oyun parkları, prefabrik şantiye yapıları ve dış cephe doğrama alım kriterleri.',
    'groups': {
        'teknik': {'title': '1. Ürün Cinsi, Malzeme & Ebatlar', 'desc': 'Ahşap emprenye cinsi, metal karkas ve prefabrik panel kalınlığı'},
        'mevzuat': {'title': '2. TSE EN 1176 Güvenlik Standartları', 'desc': 'Çocuk oyun alanları güvenliği ve kar/rüzgar yükü hesapları'},
        'ticari': {'title': '3. Ankraj, Zemin Montajı & Garanti', 'desc': 'Betonarme zemine çelik dübelli montaj ve dış hava dayanım garantisi'}
    },
    'fields': [
        {'id': 'urunTuru', 'label': 'Kent Mobilyası / Yapı Türü', 'type': 'select', 'group': 'teknik', 'options': ['Park & Bahçe Bankları ve Çöp Kovaları', 'Prefabrik Şantiye Ofisi / Yatakhane Binası', 'Alüminyum & Isı Yalıtımlı Çift Cam Doğrama', 'Çocuk Oyun Parkı Grubu & Kauçuk Zemin', 'Modern Otobüs Durağı & Güvenlik Kulübesi'], 'defaultValue': 'Park & Bahçe Bankları ve Çöp Kovaları'},
        {'id': 'toplamMiktarAdet', 'label': 'Toplam Miktar / Adet veya m²', 'type': 'number', 'unit': 'Adet / m²', 'placeholder': 'Örn: 50', 'group': 'teknik', 'required': True, 'defaultValue': 50},
        {'id': 'malzemeOzelligi', 'label': 'Hammadde ve Kaplama Özelliği', 'type': 'select', 'group': 'teknik', 'options': ['Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap', 'Elektrostatik Fırın Boyalı Döküm/Çelik Ayak', 'Poliüretan Dolgulu Sandviç Panel (Dış Duvar 50mm)', 'Termal Bariyerli Alüminyum Profil Serisi'], 'defaultValue': 'Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap'},
        {'id': 'tseEn1176Guvenlik', 'label': 'TSE EN 1176 / TSE EN 1177 Oyun Alanı Güvenlik Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'karVeRuzgarStatikRaporu', 'label': 'Prefabrik Yapılarda İlgili Bölge Kar ve Rüzgar Statik Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'sahadaAnkrajVeMontaj', 'label': 'Saha Zeminine Çelik Ankraj ile Sabitleme ve Montaj Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'disHavaGarantiSuresi', 'label': 'Dış Hava Şartlarına Karşı Paslanmazlık/Çürümezlik Garantisi', 'type': 'select', 'group': 'ticari', 'options': ['2 Yıl Garanti', '3 Yıl Garanti', '5 Yıl Kapsamlı Garanti'], 'defaultValue': '3 Yıl Garanti'}
    ],
    'quickPresets': [
        {'label': '100 Adet Ahşap-Döküm Park Bankı', 'values': {'urunTuru': 'Park & Bahçe Bankları ve Çöp Kovaları', 'toplamMiktarAdet': 100, 'malzemeOzelligi': 'Vakumlu Emprenye Edilmiş 1. Sınıf Çam Ahşap', 'sahadaAnkrajVeMontaj': True}},
        {'label': '250 m² Prefabrik Şantiye Ofis Binası', 'values': {'urunTuru': 'Prefabrik Şantiye Ofisi / Yatakhane Binası', 'toplamMiktarAdet': 250, 'karVeRuzgarStatikRaporu': True}}
    ]
}

# 17. Mühendislik - Mimarlık - Danışmanlık
DATA['muhendislik_mimarlik'] = {
    'key': 'muhendislik_mimarlik',
    'name': 'Mühendislik, Mimarlık & Müşavirlik İhalesi',
    'icon': 'Compass',
    'badgeText': '📐 Mühendislik & Proje Şartnamesi',
    'description': 'Statik betonarme/çelik hesapları, mimari uygulama projeleri, zemin etütleri ve teknik müşavirlik şartları.',
    'groups': {
        'teknik': {'title': '1. Mühendislik Disiplini & Metraj', 'desc': 'Statik, mimari, mekanik, elektrik veya geoteknik kapsam'},
        'mevzuat': {'title': '2. TMMOB Büro Tescil & Mesleki Sorumluluk', 'desc': 'İlgili oda tescil belgesi (BTB) ve mesleki sorumluluk sigortası'},
        'ticari': {'title': '3. Belediye/Resmî Kurum Onay Taahhüdü', 'desc': 'Ruhsat onayına kadar revizyon taahhüdü ve hakediş'}
    },
    'fields': [
        {'id': 'projeDisiplini', 'label': 'Mühendislik / Mimarlık Alanı', 'type': 'select', 'group': 'teknik', 'options': ['Mimari & 3D Görselleştirme Uygulama Projesi', 'Statik Betonarme & Çelik Konstrüksiyon Hesap Raporu', 'Geoteknik Rapor & Sismik Zemin Etüdü', 'Mekanik & Sıhhi Tesisat Yangın Tahliye Projesi', 'Elektrik AG/OG & Zayıf Akım Projelendirme', 'Teknik Müşavirlik, Kontrollük & Hakediş Danışmanlığı'], 'defaultValue': 'Mimari & 3D Görselleştirme Uygulama Projesi'},
        {'id': 'toplamProjeAlaniM2', 'label': 'Projelendirilecek Toplam Alan', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 8500', 'group': 'teknik', 'required': True, 'defaultValue': 8500},
        {'id': 'tmmobBuroTescilBelgesi', 'label': 'TMMOB İlgili Odadan Onaylı Güncel Büro Tescil Belgesi (BTB)', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'meslekiSorumlulukSigortasi', 'label': 'Proje Bedelini Kapsayan Mesleki Sorumluluk Sigortası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'resmiKurumOnayTaahhudu', 'label': 'İlgili Belediye / Kurum Onaylanana Kadar Ücretsiz Revizyon', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'bimVeDwgTeslimat', 'label': 'BIM (Revit / IFC) ve DWG Formatında Eksiksiz Dijital Teslimat', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '10.000 m² Karma Yapı Mimari & Statik Projesi', 'values': {'projeDisiplini': 'Statik Betonarme & Çelik Konstrüksiyon Hesap Raporu', 'toplamProjeAlaniM2': 10000, 'tmmobBuroTescilBelgesi': True, 'resmiKurumOnayTaahhudu': True}},
        {'label': 'Sondajlı Geoteknik Zemin Etüt Raporu', 'values': {'projeDisiplini': 'Geoteknik Rapor & Sismik Zemin Etüdü', 'toplamProjeAlaniM2': 5000}}
    ]
}

# 18. Madencilik - Doğal Kaynaklar - Sondaj
DATA['madencilik_sondaj'] = {
    'key': 'madencilik_sondaj',
    'name': 'Madencilik, Kuyu Sondajı & Taş Ocağı İhalesi',
    'icon': 'Mountain',
    'badgeText': '⛏️ Madencilik & Sondaj Şartnamesi',
    'description': 'Derin su/jeotermal sondajı, taş ocağı işletmeciliği, kırma-eleme ve maden rezerv tespit çalışmaları.',
    'groups': {
        'teknik': {'title': '1. Sondaj Metrajı & Makine Kapasitesi', 'desc': 'Kuyu derinliği metre, borulama çapı ve kırma-eleme tonajı'},
        'mevzuat': {'title': '2. MAPEG Maden Ruhsatı & DSİ İzinleri', 'desc': 'Maden İşleri Genel Müdürlüğü işletme izni ve ÇED raporu'},
        'ticari': {'title': '3. İnkişaf, Pompa Testi & Metre Başı İlerleme', 'desc': 'Metre başı birim fiyat, inkişaf ve debi ölçüm raporu'}
    },
    'fields': [
        {'id': 'sondajTuru', 'label': 'Madencilik / Sondaj Faaliyet Türü', 'type': 'select', 'group': 'teknik', 'options': ['Derin Artezyen Su Sondajı & Kuyulama', 'Jeotermal & Maden Arama Karotlu Sondajı', 'Taş Ocağı Kalker/Bazalt Kırma-Eleme İşi', 'Mermer & Granit Blok Çıkarma Hizmeti', 'Jeolojik Rezerv & Jeofizik Etüt Raporu'], 'defaultValue': 'Derin Artezyen Su Sondajı & Kuyulama'},
        {'id': 'hedefDerinlikMetre', 'label': 'Hedeflenen Derinlik / Metraj', 'type': 'number', 'unit': 'Metre / Ton', 'placeholder': 'Örn: 350', 'group': 'teknik', 'required': True, 'defaultValue': 350},
        {'id': 'boruVeKuyuCapi', 'label': 'Kuyu / Delgi Çapı', 'type': 'select', 'group': 'teknik', 'options': ['8 1/2 inç (Su Sondajı)', '12 1/4 inç Ağır Tip Delgi', 'HQ / NQ Karot Çapı', 'Serbest Delme Çapı'], 'defaultValue': '8 1/2 inç (Su Sondajı)'},
        {'id': 'mapegVeDsiIzni', 'label': 'DSİ Yeraltı Suyu Arama/Kullanma veya MAPEG İzni Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'cedUygunlukRaporu', 'label': 'ÇED Gerekli Değildir / ÇED Olumlu Kararı Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kuyuInkisafVeDebiTesti', 'label': 'Basınçlı Hava ile İnkişaf ve 24 Saatlik Debi Pompa Testi Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'fiyatlandirmaYontemi', 'label': 'Ödeme Esası', 'type': 'select', 'group': 'ticari', 'options': ['Metre İlerleme Başına Birim Fiyat', 'Su Çıkması Halinde Götürü Bedel', 'Aylık Makine & Ekipman Kiralama'], 'defaultValue': 'Metre İlerleme Başına Birim Fiyat'}
    ],
    'quickPresets': [
        {'label': '300 Metre Derin Su Sondajı ve Borulama', 'values': {'sondajTuru': 'Derin Artezyen Su Sondajı & Kuyulama', 'hedefDerinlikMetre': 300, 'mapegVeDsiIzni': True, 'kuyuInkisafVeDebiTesti': True}},
        {'label': '50.000 Ton Kırma Eleme Taş Ocağı Hizmeti', 'values': {'sondajTuru': 'Taş Ocağı Kalker/Bazalt Kırma-Eleme İşi', 'hedefDerinlikMetre': 50000}}
    ]
}

# 19. Asansör - Yapı Otomasyon - Mekanik Güvenlik
DATA['asansor_otomasyon'] = {
    'key': 'asansor_otomasyon',
    'name': 'Asansör, Yürüyen Merdiven & Bina Otomasyonu İhalesi',
    'icon': 'ArrowUpDown',
    'badgeText': '🛗 Asansör & Otomasyon Şartnamesi',
    'description': 'MRL dişlisiz yolcu/yük asansörleri, yürüyen merdivenler ve BMS bina otomasyonu için EN 81-20 ve yeşil etiket kriterleri.',
    'groups': {
        'teknik': {'title': '1. Asansör Türü, Durak Sayısı & Hız', 'desc': 'Kişi/kg kapasitesi, durak sayısı ve kabin tasarımı'},
        'mevzuat': {'title': '2. EN 81-20/50 & CE Asansör Yönetmeliği', 'desc': 'Avrupa asansör direktifi 2014/33/AB ve A tipi muayene yeşil etiketi'},
        'ticari': {'title': '3. Montaj, Ruhsatlandırma & Bakım', 'desc': 'Belediye tescili, yeşil etiket alımı ve 2 yıl ücretsiz aylık bakım'}
    },
    'fields': [
        {'id': 'asansorTipi', 'label': 'Asansör / Otomasyon Tipi', 'type': 'select', 'group': 'teknik', 'options': ['MRL Makine Dairesiz Dişlisiz Yolcu Asansörü', 'Ağır Hizmet Tipi Hidrolik Yük Asansörü', 'Halka Açık Alan Ağır Tip Yürüyen Merdiven / Bant', 'Hastane Sedye Asansörü (Geniş Kabin)', 'Entegre Bina Otomasyon Sistemi (BMS / HVAC/Aydınlatma)'], 'defaultValue': 'MRL Makine Dairesiz Dişlisiz Yolcu Asansörü'},
        {'id': 'kapasiteKg', 'label': 'Taşıma Kapasitesi', 'type': 'select', 'group': 'teknik', 'options': ['630 kg (8 Kişilik)', '800 kg (10 Kişilik)', '1000 kg (13 Kişilik Sedye)', '1600 kg - 2500 kg (Ağır Yük)', '5000 kg (Araç Asansörü)'], 'defaultValue': '800 kg (10 Kişilik)'},
        {'id': 'durakSayisi', 'label': 'Durak Sayısı', 'type': 'number', 'unit': 'Durak', 'placeholder': 'Örn: 10', 'group': 'teknik', 'required': True, 'defaultValue': 10},
        {'id': 'kabinHizi', 'label': 'Kabin Seyir Hızı', 'type': 'select', 'group': 'teknik', 'options': ['1.0 m/sn', '1.6 m/sn', '2.0 m/sn', '2.5 m/sn+'], 'defaultValue': '1.6 m/sn'},
        {'id': 'en81StandartUygunlugu', 'label': 'TSE EN 81-20 / EN 81-50 Güvenlik ve İmalat Standart Uyumu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'yesilEtiketRuhsatSarti', 'label': 'Belediye Tescili ve A Tipi Muayene Yeşil Etiket Alım Taahhüdü', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'aylikPeriyodikBakimDahil', 'label': '2 Yıl Garanti Süresince Aylık Periyodik Bakım ve Acil Servis Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '10 Durak 800 kg MRL Dişlisiz Yolcu Asansörü', 'values': {'asansorTipi': 'MRL Makine Dairesiz Dişlisiz Yolcu Asansörü', 'kapasiteKg': '800 kg (10 Kişilik)', 'durakSayisi': 10, 'kabinHizi': '1.6 m/sn', 'yesilEtiketRuhsatSarti': True}},
        {'label': '1000 kg Sedye Asansörü', 'values': {'asansorTipi': 'Hastane Sedye Asansörü (Geniş Kabin)', 'kapasiteKg': '1000 kg (13 Kişilik Sedye)', 'durakSayisi': 6}}
    ]
}

# 20. Klima - Soğutma - Isıtma - Havalandırma Tesisatı
DATA['klima_havalandirma'] = {
    'key': 'klima_havalandirma',
    'name': 'Klima, Soğutma, Isıtma & Havalandırma (HVAC) İhalesi',
    'icon': 'Fan',
    'badgeText': '❄️ HVAC & Havalandırma Şartnamesi',
    'description': 'Merkezi VRF/VRV klima sistemleri, su soğutmalı chiller grupları, galvaniz havalandırma kanalları ve kazan dairesi kriterleri.',
    'groups': {
        'teknik': {'title': '1. Isıtma/Soğutma Kapasitesi & Sistem Cinsi', 'desc': 'kW/BTU gücü, dış ünite sayısı ve kanal metrajı'},
        'mevzuat': {'title': '2. Eurovent, ERP Ecodesign & Çevre İzinleri', 'desc': 'Eurovent sertifikası, ERP 2021 Ecodesign ve ozon dostu R32 gazı'},
        'ticari': {'title': '3. Montaj, Bakır Borulama & Test-Ayar (TAB)', 'desc': 'Test, Ayar, Dengeleme (TAB) devreye alma raporu'}
    },
    'fields': [
        {'id': 'hvacSistemi', 'label': 'Sistem Türü', 'type': 'select', 'group': 'teknik', 'options': ['Merkezi Değişken Debili VRF / VRV Klima Sistemi', 'Hava / Su Soğutmalı Chiller Soğutma Grubu', 'Klima Santrali (AHU) & Hijyenik Santral', 'Galvaniz Sac Havalandırma Kanal İmalatı & Menfezler', 'Kaskad Yoğuşmalı Kazan Dairesi Isıtma Tesisatı'], 'defaultValue': 'Merkezi Değişken Debili VRF / VRV Klima Sistemi'},
        {'id': 'toplamSogutmaGucuKw', 'label': 'Toplam Isıtma / Soğutma Gücü', 'type': 'number', 'unit': 'kW', 'placeholder': 'Örn: 220', 'group': 'teknik', 'required': True, 'defaultValue': 220},
        {'id': 'gazCinsi', 'label': 'Soğutucu Akışkan Cinsi', 'type': 'select', 'group': 'teknik', 'options': ['R32 (Düşük Küresel Isınma Potansiyeli GWP)', 'R410A Çevre Dostu Gaz', 'R134a / R1234ze (Chiller Gazı)'], 'defaultValue': 'R32 (Düşük Küresel Isınma Potansiyeli GWP)'},
        {'id': 'euroventSertifikasi', 'label': 'Eurovent ve CE Standart Onay Sertifikası Zorunlu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'erpEcodesignUygunluk', 'label': 'Avrupa Birliği ErP Lot 21 Ecodesign Enerji Verimliliği', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'bakirBoruVeIzolasyonDahil', 'label': 'Tüm Bakır Borulama, Armaflex İzolasyon ve Kablolama Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'tabDevreyeAlmaRaporu', 'label': 'Test, Ayar ve Dengeleme (TAB) Devreye Alma Raporu Teslimi', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '250 kW Isı Pompalı VRF Klima Sistemi', 'values': {'hvacSistemi': 'Merkezi Değişken Debili VRF / VRV Klima Sistemi', 'toplamSogutmaGucuKw': 250, 'gazCinsi': 'R32 (Düşük Küresel Isınma Potansiyeli GWP)', 'euroventSertifikasi': True, 'bakirBoruVeIzolasyonDahil': True}},
        {'label': '400 kW Vidalı Kompresörlü Su Soğutma Grubu (Chiller)', 'values': {'hvacSistemi': 'Hava / Su Soğutmalı Chiller Soğutma Grubu', 'toplamSogutmaGucuKw': 400}}
    ]
}

# 21. Savunma Sanayi, Silah - Denizcilik - Havacılık
DATA['savunma_havacilik'] = {
    'key': 'savunma_havacilik',
    'name': 'Savunma Sanayi, Denizcilik & Havacılık İhalesi',
    'icon': 'Shield',
    'badgeText': '🛡️ Savunma & Havacılık Şartnamesi',
    'description': 'Taktik balistik koruyucu donanım, askeri haberleşme elektroniği, deniz botu yedek parça ve havacılık sarf kriterleri.',
    'groups': {
        'teknik': {'title': '1. Savunma / Havacılık Sınıfı & Kapsam', 'desc': 'Balistik seviye NIJ, askeri haberleşme frekansı ve adetler'},
        'mevzuat': {'title': '2. MSB Üretim İzni & Askeri Standartlar', 'desc': 'Milli Savunma Bakanlığı izinleri, NATO Kodlandırma ve MIL-STD'},
        'ticari': {'title': '3. Gizlilik Sözleşmesi (NDA) & Muayene', 'desc': 'Kurumsal gizlilik taahhüdü ve askeri kabul muayene heyeti onay'}
    },
    'fields': [
        {'id': 'savunmaAlani', 'label': 'Savunma / Havacılık Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Balistik Koruyucu Yelek, Kask & Kompozit Plaka', 'Askeri Taktik Telsiz & Şifreli Haberleşme Donanımı', 'Devriye Botu / Deniz Araçları Bakım & Yedek Parça', 'Havacılık Yapısal & Aviyonik Sarf Malzemeleri', 'Askeri Saha Çadırı & Taktik Donanım'], 'defaultValue': 'Balistik Koruyucu Yelek, Kask & Kompozit Plaka'},
        {'id': 'balistikKorumaSeviyesi', 'label': 'Balistik Koruma Seviyesi (Varsa)', 'type': 'select', 'group': 'teknik', 'options': ['NIJ Level III-A (Tabanca Mühimmatı)', 'NIJ Level III (7.62x51mm NATO Tüfek)', 'NIJ Level IV (Zırh Delici Mühimmat)', 'Balistik Şartı Yok / Elektronik Teçhizat'], 'defaultValue': 'NIJ Level IV (Zırh Delici Mühimmat)'},
        {'id': 'talepMiktariAdet', 'label': 'Talep Edilen Parça / Takım Miktarı', 'type': 'number', 'unit': 'Adet / Takım', 'placeholder': 'Örn: 500', 'group': 'teknik', 'required': True, 'defaultValue': 500},
        {'id': 'msbUretimIzni', 'label': 'MSB (Milli Savunma Bakanlığı) Tesis Güvenlik ve Üretim İzni', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'milStdAskeriUygunluk', 'label': 'MIL-STD-810G Askeri Çevre Koşulları Test Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'natoStokNumarasi', 'label': 'NATO Stok Numarası (NSN) Kaydı Taahhüdü', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gizlilikSozlesmesiNda', 'label': 'Gizlilik Sözleşmesi (NDA) ve Fikri Mülkiyet Devri İmzası', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '1.000 Adet NIJ Level IV Balistik Yelek & Plaka', 'values': {'savunmaAlani': 'Balistik Koruyucu Yelek, Kask & Kompozit Plaka', 'balistikKorumaSeviyesi': 'NIJ Level IV (Zırh Delici Mühimmat)', 'talepMiktariAdet': 1000, 'msbUretimIzni': True, 'milStdAskeriUygunluk': True}},
        {'label': 'Askeri Frekans Taktik El Telsizi Seti', 'values': {'savunmaAlani': 'Askeri Taktik Telsiz & Şifreli Haberleşme Donanımı', 'balistikKorumaSeviyesi': 'Balistik Şartı Yok / Elektronik Teçhizat', 'talepMiktariAdet': 100}}
    ]
}

# 22. Taşıt - İş Makinesi - Yedek Parça
DATA['arac_is_makinesi'] = {
    'key': 'arac_is_makinesi',
    'name': 'Taşıt, İş Makinesi & Filo Tedarik İhalesi',
    'icon': 'Truck',
    'badgeText': '🚜 Taşıt & İş Makinesi Şartnamesi',
    'description': 'Ekskavatör, beko loder, binek/ticari filo kiralama ve satın alma ihaleleri için çalışma saati ve yetkili servis kriterleri.',
    'groups': {
        'teknik': {'title': '1. Taşıt / Makine Sınıfı & Tonaj', 'desc': 'Kova hacmi, tonaj, motor beygir gücü (HP) ve adetler'},
        'mevzuat': {'title': '2. Karayolu Uygunluk & Periyodik Muayene', 'desc': 'TÜVTÜRK muayenesi, ruhsat tescili ve CE işareti'},
        'ticari': {'title': '3. Kiralama/Satın Alma & Servis Bakım', 'desc': 'Operatörlü/operatörsüz seçenek ve 7/24 yerinde mobil servis'}
    },
    'fields': [
        {'id': 'aracSinifi', 'label': 'Taşıt / İş Makinesi Türü', 'type': 'select', 'group': 'teknik', 'options': ['Paletli / Lastikli Ekskavatör (22 - 35 Ton)', 'Kazıcı Yükleyici (Beko Loder 4x4)', 'Teleskopik Yükleyici (Telehandler)', 'Binek Otomobil & SUV Filo Alımı / Kiralama', 'Hafif Ticari Panelvan & Çift Kabin Kamyonet', 'Damperli Hafriyat Kamyonu (8x4 / 6x4)'], 'defaultValue': 'Paletli / Lastikli Ekskavatör (22 - 35 Ton)'},
        {'id': 'aracAdedi', 'label': 'İhale Kapsamındaki Araç Adedi', 'type': 'number', 'unit': 'Adet', 'placeholder': 'Örn: 5', 'group': 'teknik', 'required': True, 'defaultValue': 5},
        {'id': 'maksimumCalismaSaati', 'label': 'Maksimum Çalışma Saati / Kilometre', 'type': 'select', 'group': 'teknik', 'options': ['Sıfır km / 0 Çalışma Saati', 'En Fazla 2.500 Çalışma Saati / 40.000 km', 'En Fazla 5.000 Çalışma Saati / 80.000 km'], 'defaultValue': 'Sıfır km / 0 Çalışma Saati'},
        {'id': 'sozlesmeTuru', 'label': 'Edinim Modeli', 'type': 'select', 'group': 'ticari', 'options': ['Doğrudan Satın Alma & Devir', 'Uzun Dönem Operasyonel Kiralama (12 - 36 Ay)', 'Operatörlü & Yakıt Hariç Proje Bazlı Kiralama'], 'defaultValue': 'Doğrudan Satın Alma & Devir'},
        {'id': 'ceVeMuayeneUygunlugu', 'label': 'İş Makinesi CE Sertifikası ve Geçerli Periyodik Kontrol Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kaskoVeTrafikDahil', 'label': 'Tam Kapsamlı Genişletilmiş Kasko ve Trafik Sigortası Dahil', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'yerindeMobilServis', 'label': 'Arıza Durumunda 24 Saat İçinde Sahada Mobil Servis / İkame Araç', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '3 Adet Sıfır 30 Ton Paletli Ekskavatör Alımı', 'values': {'aracSinifi': 'Paletli / Lastikli Ekskavatör (22 - 35 Ton)', 'aracAdedi': 3, 'maksimumCalismaSaati': 'Sıfır km / 0 Çalışma Saati', 'sozlesmeTuru': 'Doğrudan Satın Alma & Devir'}},
        {'label': '10 Adet Hafif Ticari Çift Kabin Kiralama', 'values': {'aracSinifi': 'Hafif Ticari Panelvan & Çift Kabin Kamyonet', 'aracAdedi': 10, 'sozlesmeTuru': 'Uzun Dönem Operasyonel Kiralama (12 - 36 Ay)'}}
    ]
}
