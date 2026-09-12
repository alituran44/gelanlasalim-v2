# -*- coding: utf-8 -*-
# Sektörler 7 - 14
DATA = {}

# 7. Akaryakıt, Gazyağı & Madeni Yağ
DATA['akaryakit_enerji'] = {
    'key': 'akaryakit_enerji',
    'name': 'Akaryakıt, Madeni Yağ & Otogaz İhalesi',
    'icon': 'Fuel',
    'badgeText': '⛽ Akaryakıt & Enerji Şartnamesi',
    'description': 'Motorin, benzin, madeni yağ ve otogaz toptan alımları için EPDK dağıtıcı lisansı, sayaç mühür ve iskonto kriterleri.',
    'groups': {
        'teknik': {'title': '1. Yakıt Türü & Miktar Kriterleri', 'desc': 'Satın alınacak akaryakıt cinsi, oktan ve metrik büyüklükler'},
        'mevzuat': {'title': '2. EPDK Mevzuat & Lisans Zorunlulukları', 'desc': 'Resmî dağıtıcı yetkisi ve sayaç mühür şartları'},
        'ticari': {'title': '3. Fiyatlandırma & Teslimat Modeli', 'desc': 'Pompa tavan fiyat iskontosu ve teslim yöntemi'}
    },
    'fields': [
        {'id': 'yakitTuru', 'label': 'Akaryakıt / Enerji Ürün Cinsi', 'type': 'select', 'group': 'teknik', 'options': ['Motorin Ultra EuroDiesel (10 ppm)', 'Kurşunsuz Benzin 95 Oktan', 'Fuel Oil No: 4 / Kal-Yak', 'LPG / Otogaz Dökme & Tüplü', 'Madeni Yağ & Endüstriyel Gres', 'AdBlue (Egzoz Emisyon Sıvısı)'], 'defaultValue': 'Motorin Ultra EuroDiesel (10 ppm)'},
        {'id': 'miktarLitre', 'label': 'Toplam Talep Edilen Hacim', 'type': 'number', 'unit': 'Litre', 'placeholder': 'Örn: 50000', 'group': 'teknik', 'required': True, 'defaultValue': 50000},
        {'id': 'teslimatYontemi', 'label': 'Teslimat & İkmal Yöntemi', 'type': 'select', 'group': 'teknik', 'options': ['Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)', 'İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)', 'Tedarikçi İstasyonundan Doğrudan Alım', 'Varil / IBC Ambalajlı Depo Teslimi'], 'defaultValue': 'Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)'},
        {'id': 'epdkLisansZorunlu', 'label': 'EPDK Dağıtıcı / Bayilik Lisansı Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'sayacMuhurolcek', 'label': 'Sanayi Bakanlığı Damgalı ve Mühürlü Sayaç Taahhüdü', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'analizRaporuSarti', 'label': 'TÜRKAK Akredite Laboratuvardan Akaryakıt Analiz Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'fiyatlandirmaUsulu', 'label': 'Fiyatlandırma Esası', 'type': 'select', 'group': 'ticari', 'options': ['EPDK Pompa Tavan Fiyatı Üzerinden % İskonto', 'TÜPRAŞ Rafineri Çıkış Fiyatı + Dağıtıcı Marjı', 'Sabit Birim Fiyatlı Sözleşme'], 'defaultValue': 'EPDK Pompa Tavan Fiyatı Üzerinden % İskonto'},
        {'id': 'iskontoOrani', 'label': 'Asgari İskonto Oranı', 'type': 'number', 'unit': '%', 'placeholder': 'Örn: 6.5', 'group': 'ticari', 'defaultValue': 6.5}
    ],
    'quickPresets': [
        {'label': '50.000 Litre Saha Tanker Motorin Alımı', 'values': {'yakitTuru': 'Motorin Ultra EuroDiesel (10 ppm)', 'miktarLitre': 50000, 'teslimatYontemi': 'Alıcı Sahasında Tank Dolumu (Tanker Sevkiyatı)', 'fiyatlandirmaUsulu': 'EPDK Pompa Tavan Fiyatı Üzerinden % İskonto', 'iskontoOrani': 6.5, 'epdkLisansZorunlu': True}},
        {'label': 'Kurumsal Taşıt Tanıma (TTS) Filo Yakıt İhalesi', 'values': {'yakitTuru': 'Motorin Ultra EuroDiesel (10 ppm)', 'miktarLitre': 120000, 'teslimatYontemi': 'İstasyon Otomasyon Kartı / Taşıt Tanıma Sistemi (TTS)', 'iskontoOrani': 8.0}}
    ]
}

# 8. Endüstriyel Makine - Motor - Konveyör
DATA['endustriyel_makine'] = {
    'key': 'endustriyel_makine',
    'name': 'Endüstriyel Makine, CNC & Konveyör İhalesi',
    'icon': 'Cpu',
    'badgeText': '⚙️ Makine & Teçhizat Şartnamesi',
    'description': 'CNC işleme merkezleri, hava kompresörleri, konveyör hatları ve redüktörler için CE ve yerinde montaj kriterleri.',
    'groups': {
        'teknik': {'title': '1. Makine Türü & Motor Gücü', 'desc': 'İşleme kapasitesi, motor gücü kW ve eksen sayısı'},
        'mevzuat': {'title': '2. Makine Emniyeti & Direktifler', 'desc': '2006/42/AT direktifi, CE belgesi ve topraklama'},
        'ticari': {'title': '3. Kurulum, Devreye Alma & Garanti', 'desc': 'Yerinde FAT/SAT kabul testleri ve yedek parça taahhüdü'}
    },
    'fields': [
        {'id': 'makineKategorisi', 'label': 'Makine & Teçhizat Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['CNC Dik İşleme Merkezi & Torna', 'Vidalı Hava Kompresörü & Basınçlı Hava', 'Endüstriyel Konveyör & Bant Hattı', 'Elektrik Motoru & Helisel Redüktör', 'Otomatik Paketleme & Dolum Makinesi', 'Hidrolik Pres & Pnömatik Üniteler'], 'defaultValue': 'CNC Dik İşleme Merkezi & Torna'},
        {'id': 'motorGucuKw', 'label': 'Toplam Motor / Bağlantı Gücü', 'type': 'number', 'unit': 'kW', 'placeholder': 'Örn: 45', 'group': 'teknik', 'defaultValue': 45},
        {'id': 'makineAdedi', 'label': 'Talep Edilen Makine Adedi', 'type': 'number', 'unit': 'Adet', 'placeholder': 'Örn: 2', 'group': 'teknik', 'required': True, 'defaultValue': 2},
        {'id': 'ceMakineEmniyetDirektifi', 'label': '2006/42/AT Makine Emniyeti CE Uygunluk Beyanı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'iso9001VeTse', 'label': 'İmalatçı ISO 9001 ve TSE Standart Uygunluğu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'yerindeKurulumVeSatTesti', 'label': 'Yerinde Kurulum, Devreye Alma ve Saha Kabul (SAT) Testi', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'operatorEgitimiDahil', 'label': 'Operatör ve Bakım Personeli Sertifikalı Eğitimi Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'makineGarantiSuresi', 'label': 'Tam Garanti Süresi', 'type': 'select', 'group': 'ticari', 'options': ['1 Yıl Mekanik & Elektrik Garanti', '2 Yıl Tam Garanti', '3 Yıl Kapsamlı Garanti'], 'defaultValue': '2 Yıl Tam Garanti'}
    ],
    'quickPresets': [
        {'label': '5 Eksen CNC Dik İşleme Merkezi', 'values': {'makineKategorisi': 'CNC Dik İşleme Merkezi & Torna', 'motorGucuKw': 35, 'makineAdedi': 1, 'makineGarantiSuresi': '2 Yıl Tam Garanti'}},
        {'label': '75 kW Vidalı Kompresör & Kurutucu Seti', 'values': {'makineKategorisi': 'Vidalı Hava Kompresörü & Basınçlı Hava', 'motorGucuKw': 75, 'makineAdedi': 2}}
    ]
}

# 9. Yazılım - Bilgi Yönetim Hizmetleri - Bilişim
DATA['bilisim_teknoloji'] = {
    'key': 'bilisim_teknoloji',
    'name': 'Yazılım, ERP & Bilişim Altyapı İhalesi',
    'icon': 'Laptop',
    'badgeText': '💻 Bilişim & Yazılım Şartnamesi',
    'description': 'Özel yazılım, kurumsal ERP, bulut barındırma ve siber güvenlik hizmetleri için SLA ve ISO 27001 şartları.',
    'groups': {
        'teknik': {'title': '1. Yazılım Kapsamı & Mimari', 'desc': 'Kapsam türü, kullanıcı lisans adedi ve mimari yapı'},
        'mevzuat': {'title': '2. Bilgi Güvenliği & KVKK Standartları', 'desc': 'ISO 27001, KVKK uyumu ve kaynak kod teslimi'},
        'ticari': {'title': '3. SLA Hizmet Seviyesi & Bakım Modeli', 'desc': 'Çözüm süresi SLA ve periyodik sürüm desteği'}
    },
    'fields': [
        {'id': 'projeKapsami', 'label': 'Bilişim & Yazılım Kapsamı', 'type': 'select', 'group': 'teknik', 'options': ['Özel Web & Mobil Yazılım Geliştirme', 'Kurumsal ERP / CRM Entegrasyonu', 'Bulut Sunucu & Veri Merkezi Altyapısı', 'Siber Güvenlik & Penetrasyon Testi', 'Veritabanı Yönetimi & Felaket Kurtarma'], 'defaultValue': 'Özel Web & Mobil Yazılım Geliştirme'},
        {'id': 'kullaniciKapasitesi', 'label': 'Kullanıcı / Lisans Kapasitesi', 'type': 'number', 'unit': 'Kullanıcı', 'placeholder': 'Örn: 250', 'group': 'teknik', 'defaultValue': 250},
        {'id': 'teknolojiYigini', 'label': 'Tercih Edilen Mimari / Platform', 'type': 'select', 'group': 'teknik', 'options': ['Mikroservis & Bulut-Yerel (Kubernetes / Docker)', 'Modern Web (Vue / React / Node.js / Go)', 'Kurumsal Java / .NET Core Mimarisi', 'Açık Kaynak Esnek Mimari'], 'defaultValue': 'Modern Web (Vue / React / Node.js / Go)'},
        {'id': 'iso27001Sertifikasi', 'label': 'Yüklenicide ISO 27001 Bilgi Güvenliği Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kvkkVeVeriYerliligi', 'label': 'KVKK Uyumu ve Türkiye Lokasyonlu Veri Merkezi Zorunluluğu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kaynakKodTeslimi', 'label': 'Fikri Mülkiyet ve Kaynak Kodların Eksiksiz Teslimi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'slaHedefi', 'label': 'SLA Arıza Müdahale & Çözüm Seviyesi', 'type': 'select', 'group': 'ticari', 'options': ['%99.9 Uptime & 2 Saat Kritik Müdahale', '%99.5 Uptime & 4 Saat Kritik Müdahale', 'Mesai Saatleri İçinde 8 Saat Müdahale'], 'defaultValue': '%99.9 Uptime & 2 Saat Kritik Müdahale'},
        {'id': 'destekBakimSuresi', 'label': 'Garanti Kapsamında Ücretsiz Bakım & Güncelleme', 'type': 'select', 'group': 'ticari', 'options': ['12 Ay Ücretsiz Bakım', '24 Ay Kapsamlı Destek', '36 Ay 7/24 Teknik Destek'], 'defaultValue': '12 Ay Ücretsiz Bakım'}
    ],
    'quickPresets': [
        {'label': 'Özel B2B Portal & Mobil Uygulama', 'values': {'projeKapsami': 'Özel Web & Mobil Yazılım Geliştirme', 'kullaniciKapasitesi': 500, 'iso27001Sertifikasi': True, 'kaynakKodTeslimi': True, 'slaHedefi': '%99.9 Uptime & 2 Saat Kritik Müdahale'}},
        {'label': 'Kurumsal ERP Entegrasyonu', 'values': {'projeKapsami': 'Kurumsal ERP / CRM Entegrasyonu', 'kullaniciKapasitesi': 150, 'destekBakimSuresi': '24 Ay Kapsamlı Destek'}}
    ]
}

# 10. Nakliye - Taşımacılık - Servis İhaleleri
DATA['lojistik_tasimacilik'] = {
    'key': 'lojistik_tasimacilik',
    'name': 'Nakliye, Taşımacılık & Servis Hizmeti İhalesi',
    'icon': 'Truck',
    'badgeText': '🚚 Lojistik & Nakliye Şartnamesi',
    'description': 'Karayolu FTL/parsiyel, personel/öğrenci servis taşımacılığı ve konteyner nakliyesi için K1/D2 belgesi ve araç yaşı kriterleri.',
    'groups': {
        'teknik': {'title': '1. Taşımacılık Türü & Kapasite', 'desc': 'Taşıma modu, sefer sayısı, araç tipi ve tonaj'},
        'mevzuat': {'title': '2. Ulaştırma Bakanlığı Yetki Belgeleri', 'desc': 'K1, K2, D2 yetki belgesi, SRC ve psikoteknik şartları'},
        'ticari': {'title': '3. Fiyatlandırma & Araç Yaşı Şartı', 'desc': 'Sefer/tonaj bazlı fiyatlandırma ve maksimum araç yaşı'}
    },
    'fields': [
        {'id': 'tasimaTuru', 'label': 'Taşımacılık Türü', 'type': 'select', 'group': 'teknik', 'options': ['Şehirlerarası Karayolu Nakliye (FTL Komple Tır)', 'Şehir İçi Dağıtım & Parsiyel Taşımacılık', 'Personel & Öğrenci Servis Hizmeti', 'Konteyner & Liman Sahası Nakliyesi', 'Soğuk Hava Frigofirik Taşımacılık'], 'defaultValue': 'Şehirlerarası Karayolu Nakliye (FTL Komple Tır)'},
        {'id': 'seferSayisi', 'label': 'Aylık Tahmini Sefer / Araç Sayısı', 'type': 'number', 'unit': 'Sefer', 'placeholder': 'Örn: 45', 'group': 'teknik', 'required': True, 'defaultValue': 45},
        {'id': 'aracMaksimumYasi', 'label': 'Maksimum Araç Model Yaşı', 'type': 'select', 'group': 'teknik', 'options': ['En Fazla 5 Yaşında', 'En Fazla 8 Yaşında', 'En Fazla 12 Yaşında (Servis Mevzuatı)'], 'defaultValue': 'En Fazla 5 Yaşında'},
        {'id': 'ulastirmaBakanligiYetkiBelgesi', 'label': 'Yetki Belgesi Şartı (K1 / L2 / D2)', 'type': 'select', 'group': 'mevzuat', 'options': ['K1 Yetki Belgesi (Eşya Taşımacılığı)', 'L2 Yetki Belgesi (Uluslararası Lojistik)', 'D2 Yetki Belgesi (Arızi Yolcu Taşımacılığı)'], 'defaultValue': 'K1 Yetki Belgesi (Eşya Taşımacılığı)'},
        {'id': 'srcVePsikoteknikSarti', 'label': 'Tüm Şoförlerde SRC ve Psikoteknik Raporu Zorunluluğu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'emtiaNakliyatSigortasi', 'label': 'Sefer Başına En Az 2.000.000 ₺ Emtia Nakliyat Sigortası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gpsFiloTakipPaylasimi', 'label': 'Gerçek Zamanlı GPS Araç Takip Sistemi Paylaşımı', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'fiyatlandirmaBirimi', 'label': 'Fiyatlandırma Birimi', 'type': 'select', 'group': 'ticari', 'options': ['Sefer Başına Sabit Fiyat', 'Kilometre Başına Fiyat (Km x Katsayı)', 'Tonaj / Desi Başına Fiyat'], 'defaultValue': 'Sefer Başına Sabit Fiyat'}
    ],
    'quickPresets': [
        {'label': 'Aylık 50 Sefer FTL Tır Nakliyesi', 'values': {'tasimaTuru': 'Şehirlerarası Karayolu Nakliye (FTL Komple Tır)', 'seferSayisi': 50, 'aracMaksimumYasi': 'En Fazla 5 Yaşında', 'ulastirmaBakanligiYetkiBelgesi': 'K1 Yetki Belgesi (Eşya Taşımacılığı)'}},
        {'label': '10 Güzergah Personel Servis Taşımacılığı', 'values': {'tasimaTuru': 'Personel & Öğrenci Servis Hizmeti', 'seferSayisi': 200, 'aracMaksimumYasi': 'En Fazla 8 Yaşında', 'ulastirmaBakanligiYetkiBelgesi': 'D2 Yetki Belgesi (Arızi Yolcu Taşımacılığı)'}}
    ]
}

# 11. Mobilya - Beyaz Eşya - Mutfak - Züccaciye
DATA['mobilya_ofis'] = {
    'key': 'mobilya_ofis',
    'name': 'Mobilya, Endüstriyel Mutfak & Ofis Donanımı İhalesi',
    'icon': 'Armchair',
    'badgeText': '🪑 Mobilya & Mutfak Şartnamesi',
    'description': 'Ofis mobilyaları, endüstriyel mutfak paslanmaz ekipmanları, arşiv rafları ve beyaz eşya tedarik standartları.',
    'groups': {
        'teknik': {'title': '1. Ürün Grubu & Malzeme Niteliği', 'desc': 'Ahşap/çelik niteliği, AISI 304 paslanmaz sac ve adetler'},
        'mevzuat': {'title': '2. TSE Standartları & E0/E1 Emisyon', 'desc': 'TSE EN 527 ofis mobilyası ve formaldehit E1 sertifikası'},
        'ticari': {'title': '3. Montaj, Yerleşim & Garanti', 'desc': 'Katlara taşıma, anahtar teslim montaj ve garanti süresi'}
    },
    'fields': [
        {'id': 'mobilyaGrubu', 'label': 'Ürün Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Ofis Çalışma Masası, Keson & Dolap Grubu', 'Ergonomik Fileli / Deri Yönetici Koltukları', 'Endüstriyel Mutfak (AISI 304 Paslanmaz Çelik)', 'Ağır Yük & Arşiv Raf Sistemleri', 'Kurumsal Beyaz Eşya & Ankastre Set'], 'defaultValue': 'Ofis Çalışma Masası, Keson & Dolap Grubu'},
        {'id': 'toplamTakimAdedi', 'label': 'Toplam Takım / Parça Adedi', 'type': 'number', 'unit': 'Adet / Takım', 'placeholder': 'Örn: 80', 'group': 'teknik', 'required': True, 'defaultValue': 80},
        {'id': 'malzemeKalitesi', 'label': 'Ahşap / Metal Gövde Standardı', 'type': 'select', 'group': 'teknik', 'options': ['1. Sınıf E1 Melamin Kaplı Yonga Levha (25mm Tabla)', 'Elektrostatik Toz Boyalı Kutu Profil Çelik Ayak', 'AISI 304 Kalite 18/10 Paslanmaz Çelik Sac', 'Doğal Masif / Doğal Ahşap Kaplama'], 'defaultValue': '1. Sınıf E1 Melamin Kaplı Yonga Levha (25mm Tabla)'},
        {'id': 'tseMobilyaStandarti', 'label': 'TSE EN 527 ve TSE EN 1335 Standart Uygunluk Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'e1FormaldehitSertifikasi', 'label': 'E1 Kanserojen Madde İçermez Emisyon Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'katlaraTasimaVeMontaj', 'label': 'Belirtilen Katlara Taşıma ve Yerinde Montaj Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'mobilyaGarantiSuresi', 'label': 'Garanti ve Servis Süresi', 'type': 'select', 'group': 'ticari', 'options': ['2 Yıl Tam Garanti', '3 Yıl Kapsamlı Garanti', '5 Yıl Mekanizma Garantisi'], 'defaultValue': '2 Yıl Tam Garanti'}
    ],
    'quickPresets': [
        {'label': '50 Kişilik Açık Ofis Çalışma İstasyonu Seti', 'values': {'mobilyaGrubu': 'Ofis Çalışma Masası, Keson & Dolap Grubu', 'toplamTakimAdedi': 50, 'tseMobilyaStandarti': True, 'katlaraTasimaVeMontaj': True}},
        {'label': 'Paslanmaz Endüstriyel Mutfak Donanımı', 'values': {'mobilyaGrubu': 'Endüstriyel Mutfak (AISI 304 Paslanmaz Çelik)', 'malzemeKalitesi': 'AISI 304 Kalite 18/10 Paslanmaz Çelik Sac', 'toplamTakimAdedi': 25}}
    ]
}

# 12. Hırdavat - Nalburiye - Metal ve Plastik Ürünler
DATA['hirdavat_metal'] = {
    'key': 'hirdavat_metal',
    'name': 'Hırdavat, Metal, Profil & Plastik Hammadde İhalesi',
    'icon': 'Wrench',
    'badgeText': '🔩 Hırdavat & Metal Şartnamesi',
    'description': 'Civata, somun, kutu profil, sac, polimer plastik granül ve endüstriyel el aletleri toptan tedarik kriterleri.',
    'groups': {
        'teknik': {'title': '1. Metal / Hammadde Cinsi & Metraj', 'desc': 'Çelik kalitesi, et kalınlığı, tonaj ve parça adedi'},
        'mevzuat': {'title': '2. EN 10204 3.1 & TSE Standartları', 'desc': 'Malzeme test sertifikası 3.1 ve galvaniz kaplama mikronu'},
        'ticari': {'title': '3. Paketleme, İstif & Sevk Şartları', 'desc': 'Bağ halinde sevkiyat ve fabrika kantar tartımı'}
    },
    'fields': [
        {'id': 'hammaddeTuru', 'label': 'Metal / Hırdavat Malzeme Türü', 'type': 'select', 'group': 'teknik', 'options': ['Kutu Profil, Boru & Sanayi Profilleri', 'S235JR / S355JR Sıcak/Soğuk Haddelenmiş Sac', '8.8 / 10.9 Kalite Galvanizli Civata & Somun', 'Polietilen / Polipropilen Plastik Granül', 'Endüstriyel Elektrikli El Aletleri & Sarf Malzemeleri'], 'defaultValue': 'Kutu Profil, Boru & Sanayi Profilleri'},
        {'id': 'siparisMiktari', 'label': 'Toplam Sipariş Tonajı / Miktarı', 'type': 'number', 'unit': 'Ton / Adet', 'placeholder': 'Örn: 40', 'group': 'teknik', 'required': True, 'defaultValue': 40},
        {'id': 'celikKaliteSinifi', 'label': 'Çelik / Malzeme Kalite Sınıfı', 'type': 'select', 'group': 'teknik', 'options': ['S235JR (St 37-2)', 'S275JR (St 44-2)', 'S355JR (St 52-3)', 'AISI 304 Paslanmaz Çelik', '8.8 Yüksek Mukavemetli Çelik'], 'defaultValue': 'S235JR (St 37-2)'},
        {'id': 'en10204TestSertifikasi', 'label': 'EN 10204 3.1 Kimyasal ve Mekanik Test Sertifikası Zorunlu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'sicakDaldirmaGalvaniz', 'label': 'TSE EN ISO 1461 Sıcak Daldırma Galvaniz Kaplama Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'kantarTartimProseduru', 'label': 'Alıcı Tesis Kantarında Yapılan Net Tartım Esas Alınacaktır', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'baglamaVePaketleme', 'label': 'Standart Çelik Şeritli Bağ & Nem Önleyici Ambalaj', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '50 Ton S235JR Sanayi Boru ve Profil Alımı', 'values': {'hammaddeTuru': 'Kutu Profil, Boru & Sanayi Profilleri', 'siparisMiktari': 50, 'celikKaliteSinifi': 'S235JR (St 37-2)', 'en10204TestSertifikasi': True}},
        {'label': '10.000 Adet 8.8 Kalite M16 Civata & Somun Seti', 'values': {'hammaddeTuru': '8.8 / 10.9 Kalite Galvanizli Civata & Somun', 'siparisMiktari': 10000, 'celikKaliteSinifi': '8.8 Yüksek Mukavemetli Çelik'}}
    ]
}

# 13. Yangın Algılama - Söndürme - İhbar Sistemleri
DATA['yangin_guvenlik'] = {
    'key': 'yangin_guvenlik',
    'name': 'Yangın Algılama & Otomatik Söndürme Sistemleri İhalesi',
    'icon': 'Flame',
    'badgeText': '🧯 Yangın & Güvenlik Şartnamesi',
    'description': 'Adresli yangın algılama, sulu sprinkler, FM200/Novec gazlı söndürme ve yangın kapısı şartnameleri.',
    'groups': {
        'teknik': {'title': '1. Sistem Türü & Saha Kapasitesi', 'desc': 'Adresli dedektör sayısı, sprinkler hattı ve gazlı oda hacmi'},
        'mevzuat': {'title': '2. BYKHY & EN 54 / UL-FM Standartları', 'desc': 'Binaların Yangından Korunması Yönetmeliği ve EN 54 belgesi'},
        'ticari': {'title': '3. Test, İtfaiye Uygunluk & Periyodik Bakım', 'desc': 'İtfaiye yangın raporu desteği ve yıllık bakım taahhüdü'}
    },
    'fields': [
        {'id': 'sistemTipi', 'label': 'Yangın Güvenlik Sistem Türü', 'type': 'select', 'group': 'teknik', 'options': ['Adresli Yangın Algılama & İhbar Paneli', 'Islak / Kuru Borulu Otomatik Sprinkler Söndürme', 'Gazlı Söndürme Sistemi (FM-200 / Novec 1230)', 'Davlumbaz Otomatik Yangın Söndürme', 'Yangın Pompa Grubu (Dizel + Elektrik + Jokey)', 'Panik Barlı Yangına Dayanıklı Çelik Kapı'], 'defaultValue': 'Adresli Yangın Algılama & İhbar Paneli'},
        {'id': 'noktaVeyaHacim', 'label': 'Nokta Dedektör Adedi veya Alan m²', 'type': 'number', 'unit': 'Nokta / m²', 'placeholder': 'Örn: 250', 'group': 'teknik', 'required': True, 'defaultValue': 250},
        {'id': 'en54VdUlfmsertifikasi', 'label': 'EN 54 / VdS / UL-FM Uluslararası Sertifikasyon', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'bykhyUygunlugu', 'label': 'Binaların Yangından Korunması Hakkında Yönetmelik Tam Uyumu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'itfaiyeRuhsatDestegi', 'label': 'Belediye İtfaiye Uygunluk Raporu Alımına Teknik Müşavirlik Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'periyodikBakimPaketi', 'label': 'Montaj Sonrası Periyodik Test & Bakım Taahhüdü', 'type': 'select', 'group': 'ticari', 'options': ['1 Yıl (4 Periyot) Sözleşmeli Bakım', '2 Yıl (8 Periyot) Kapsamlı Bakım', 'Yalnızca İlk Devreye Alma Testi'], 'defaultValue': '1 Yıl (4 Periyot) Sözleşmeli Bakım'}
    ],
    'quickPresets': [
        {'label': '300 Dedektörlü Adresli Yangın Algılama Sistemi', 'values': {'sistemTipi': 'Adresli Yangın Algılama & İhbar Paneli', 'noktaVeyaHacim': 300, 'en54VdUlfmsertifikasi': True, 'bykhyUygunlugu': True}},
        {'label': 'Sistem Odası FM-200 Gazlı Söndürme', 'values': {'sistemTipi': 'Gazlı Söndürme Sistemi (FM-200 / Novec 1230)', 'noktaVeyaHacim': 80, 'en54VdUlfmsertifikasi': True}}
    ]
}

# 14. Kimyasal Maddeler - Dezenfektan - Gübre
DATA['kimyasal_gubre'] = {
    'key': 'kimyasal_gubre',
    'name': 'Endüstriyel Kimyasal, Gübre & Dezenfektan İhalesi',
    'icon': 'TestTube',
    'badgeText': '🧪 Kimyasal & Gübre Şartnamesi',
    'description': 'Endüstriyel asit/bazlar, tarımsal kompoze gübreler, su şartlandırma kimyasalları ve biyosidal ürün standartları.',
    'groups': {
        'teknik': {'title': '1. Kimyasal Grubu & Saflık Derecesi', 'desc': 'Kimyasal formül, konsantrasyon % ve ambalaj tipi'},
        'mevzuat': {'title': '2. Güvenlik Bilgi Formu (GBF/MSDS) & Ruhsat', 'desc': 'Sağlık Bakanlığı biyosidal ruhsatı ve ADR uygunluğu'},
        'ticari': {'title': '3. IBC/Tanker Teslimi & Pompalama', 'desc': 'Alıcı sahası stok tankına pompalama ve analiz şahit numunesi'}
    },
    'fields': [
        {'id': 'kimyasalKategorisi', 'label': 'Kimyasal / Gübre Sınıfı', 'type': 'select', 'group': 'teknik', 'options': ['Endüstriyel Temel Kimyasal (Kostik, Asit, Klor)', 'Tarımsal Katı / Sıvı Gübre (Üre, DAP, NPK)', 'İçme/Kazan Suyu Şartlandırma Kimyasalları', 'Sağlık Bakanlığı Onaylı Biyosidal Dezenfektan', 'Yüzey İşlem ve Boya Sökücü Kimyasallar'], 'defaultValue': 'Endüstriyel Temel Kimyasal (Kostik, Asit, Klor)'},
        {'id': 'siparisMiktariTon', 'label': 'Toplam Talep Edilen Miktar', 'type': 'number', 'unit': 'Ton / Litre', 'placeholder': 'Örn: 20', 'group': 'teknik', 'required': True, 'defaultValue': 20},
        {'id': 'konsantrasyonSaflik', 'label': 'Asgari Konsantrasyon / Saflık Derecesi', 'type': 'select', 'group': 'teknik', 'options': ['%98 - %99 Teknik Saf', '%48 - %50 Sıvı Konsantre', '%30 - %33 Konsantre Çözelti', 'Gıda Tipi / Analitik Saflık'], 'defaultValue': '%48 - %50 Sıvı Konsantre'},
        {'id': 'msdsGbfFormu', 'label': 'Türkçe Güvenlik Bilgi Formu (GBF / SDS) Mevcut', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'biyosidalRuhsat', 'label': 'Sağlık Bakanlığı Biyosidal Ürün Ruhsatı (Gereken Ürünlerde)', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'adrTasimaUygunlugu', 'label': 'ADR Tehlikeli Madde Karayolu Taşımacılığı Uygunluk Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'ambalajSekli', 'label': 'Ambalaj ve Sevkiyat Yöntemi', 'type': 'select', 'group': 'ticari', 'options': ['1.000 Litrelik Çelik Kafesli IBC Tank', 'Dökme Tanker ile Alıcı Stok Tankına Boşaltım', '25 kg / 50 kg Polietilen Bidon / Çuval', 'Varil (200 Litre)'], 'defaultValue': '1.000 Litrelik Çelik Kafesli IBC Tank'}
    ],
    'quickPresets': [
        {'label': '20 Ton Sıvı Klor / Hipoklorit Alımı', 'values': {'kimyasalKategorisi': 'İçme/Kazan Suyu Şartlandırma Kimyasalları', 'siparisMiktariTon': 20, 'konsantrasyonSaflik': '%48 - %50 Sıvı Konsantre', 'msdsGbfFormu': True, 'ambalajSekli': '1.000 Litrelik Çelik Kafesli IBC Tank'}},
        {'label': '40 Ton Katı Üre / Kompoze Gübre Tedariği', 'values': {'kimyasalKategorisi': 'Tarımsal Katı / Sıvı Gübre (Üre, DAP, NPK)', 'siparisMiktariTon': 40, 'ambalajSekli': '25 kg / 50 kg Polietilen Bidon / Çuval'}}
    ]
}
