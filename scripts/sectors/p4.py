# -*- coding: utf-8 -*-
# Sektörler 23 - 30
DATA = {}

# 23. Turizm - Ödüllendirme Hizmetleri - Organizasyon
DATA['turizm_organizasyon'] = {
    'key': 'turizm_organizasyon',
    'name': 'Turizm, Kongre & Etkinlik Organizasyonu İhalesi',
    'icon': 'Calendar',
    'badgeText': '🎪 Turizm & Organizasyon Şartnamesi',
    'description': 'Kurumsal kongre, seminer, festival, düğün ve sahne-ışık kiralama hizmetleri için TÜRSAB A grubu ve teknik prodüksiyon kriterleri.',
    'groups': {
        'teknik': {'title': '1. Etkinlik Türü & Katılımcı Kapasitesi', 'desc': 'Kişi sayısı, konaklama, salon düzeni ve sahne/ışık donanımı'},
        'mevzuat': {'title': '2. TÜRSAB & Turizm Bakanlığı İzinleri', 'desc': 'A Grubu seyahat acentası işletme belgesi ve etkinlik sigortası'},
        'ticari': {'title': '3. Karşılama, Transfer & İkram Paketi', 'desc': 'Havalimanı VIP transferi, gala yemeği ve no-show esnekliği'}
    },
    'fields': [
        {'id': 'etkinlikTuru', 'label': 'Organizasyon / Etkinlik Türü', 'type': 'select', 'group': 'teknik', 'options': ['Kurumsal Kongre, Seminer & Lansman', 'Konser, Festival, Sahne & Müzik Etkinliği', 'Düğün, Nişan & Protokol Davetleri', 'Kültür, Doğa & Yurt Dışı Gezi Turları', 'Hac ve Umre Organizasyon Paketleri'], 'defaultValue': 'Kurumsal Kongre, Seminer & Lansman'},
        {'id': 'katilimciSayisi', 'label': 'Tahmini Katılımcı / Davetli Sayısı', 'type': 'number', 'unit': 'Kişi', 'placeholder': 'Örn: 350', 'group': 'teknik', 'required': True, 'defaultValue': 350},
        {'id': 'teknikProduksiyonDahil', 'label': 'Profesyonel Ses, Işık, Truss & LED Ekran Dahil', 'type': 'boolean', 'group': 'teknik', 'defaultValue': True},
        {'id': 'tursabAGrubuBelgesi', 'label': 'TÜRSAB A Grubu Seyahat Acentası İşletme Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'etkinlikMaliMesuliyetSigortasi', 'label': 'Üçüncü Şahıs Mali Mesuliyet ve Etkinlik Sigortası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'vipTransferVeKarsilama', 'label': 'Havalimanı - Otel VIP Transfer ve Karşılama Hizmeti Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'fiyatlandirmaModeli', 'label': 'Fiyatlandırma Şekli', 'type': 'select', 'group': 'ticari', 'options': ['Kişi Başı Her Şey Dahil Paket Fiyat', 'Kalem Bazlı Şeffaf Bütçeleme + Ajans Komisyonu', 'Götürü Bedel Anahtar Teslim'], 'defaultValue': 'Kişi Başı Her Şey Dahil Paket Fiyat'}
    ],
    'quickPresets': [
        {'label': '300 Kişilik 3 Günlük Kurumsal Kongre', 'values': {'etkinlikTuru': 'Kurumsal Kongre, Seminer & Lansman', 'katilimciSayisi': 300, 'teknikProduksiyonDahil': True, 'tursabAGrubuBelgesi': True}},
        {'label': 'Büyük Ölçekli Açık Hava Festivali', 'values': {'etkinlikTuru': 'Konser, Festival, Sahne & Müzik Etkinliği', 'katilimciSayisi': 2500, 'teknikProduksiyonDahil': True}}
    ]
}

# 24. Reklam - Tabela - Billboard - Tanıtım Materyalleri
DATA['reklam_tanitim'] = {
    'key': 'reklam_tanitim',
    'name': 'Açıkhava Reklam, Tabela, Billboard & Stand İhalesi',
    'icon': 'Megaphone',
    'badgeText': '📢 Reklam & Tanıtım Şartnamesi',
    'description': 'Işıklı totem tabela, billboard kiralama, araç giydirme, dijital LED ekran ve modüler fuar standı tedarik standartları.',
    'groups': {
        'teknik': {'title': '1. Reklam Ürünü, Boyutlar & Işıklandırma', 'desc': 'Kutu harf, totem yüksekliği, LED piksel aralığı ve ebatlar'},
        'mevzuat': {'title': '2. Belediye İlan/Reklam İzni & Statik Hesap', 'desc': 'Rüzgar statik dayanımı, CE/IP65 sertifikası ve belediye vergisi'},
        'ticari': {'title': '3. Saha Montajı, Vinç & LED Modül Garantisi', 'desc': 'Vinçli montaj dahil teslim ve trafo/LED garantisi'}
    },
    'fields': [
        {'id': 'reklamTuru', 'label': 'Reklam / Tanıtım Ünitesi Türü', 'type': 'select', 'group': 'teknik', 'options': ['Işıklı Kutu Harf Cephe Tabelası', 'Ağır Hizmet Çift Taraflı Otoyol Totemi', 'Billboard & Raket (CLP) Açıkhava Ağı', 'Dış Mekan SMD Dijital LED Ekran Paneli', 'Özel Tasarım Ahşap / Alüminyum Fuar Standı', 'Cast Folyo Araç Filosu Giydirme'], 'defaultValue': 'Işıklı Kutu Harf Cephe Tabelası'},
        {'id': 'olcuM2VeyaAdet', 'label': 'Toplam Ölçü (m²) veya Ünite Adedi', 'type': 'number', 'unit': 'm² / Adet', 'placeholder': 'Örn: 24', 'group': 'teknik', 'required': True, 'defaultValue': 24},
        {'id': 'isiklandirmaStandarti', 'label': 'Aydınlatma / LED Teknolojisi', 'type': 'select', 'group': 'teknik', 'options': ['IP67 Su Geçirmez Samsung/Seoul LED Modül', 'P3.91 / P4.81 Dış Mekan Yüksek Parlaklık LED Panel', 'İçten Floresan / Floresansız', 'Işıksız Mat Baskı'], 'defaultValue': 'IP67 Su Geçirmez Samsung/Seoul LED Modül'},
        {'id': 'ruzgarStatikHesapRaporu', 'label': 'Totem ve Çatılarda İnşaat Mühendisi İmzalı Rüzgar Statik Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'belediyeVergiTakibi', 'label': 'Belediye İlan ve Reklam Vergisi Projelendirme Desteği', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'sahadaVincliMontaj', 'label': 'Sepetli Vinç ile Şantiye/Bina Cephesine Montaj Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'ledVeTrafoGarantisi', 'label': 'LED Modül ve Güç Kaynağı Garantisi', 'type': 'select', 'group': 'ticari', 'options': ['2 Yıl Parça ve İşçilik Garantisi', '3 Yıl Kapsamlı Garanti', '5 Yıl LED Modül Garantisi'], 'defaultValue': '2 Yıl Parça ve İşçilik Garantisi'}
    ],
    'quickPresets': [
        {'label': '12 Metre Işıklı Otoyol Totem Tabelası', 'values': {'reklamTuru': 'Ağır Hizmet Çift Taraflı Otoyol Totemi', 'olcuM2VeyaAdet': 36, 'ruzgarStatikHesapRaporu': True, 'sahadaVincliMontaj': True}},
        {'label': 'Kurumsal Cephe Işıklı Kutu Harf Tabela', 'values': {'reklamTuru': 'Işıklı Kutu Harf Cephe Tabelası', 'olcuM2VeyaAdet': 15, 'isiklandirmaStandarti': 'IP67 Su Geçirmez Samsung/Seoul LED Modül'}}
    ]
}

# 25. Ormancılık, Bahçıvanlık, Bitki - Peyzaj İhaleleri
DATA['peyzaj_ormancilik'] = {
    'key': 'peyzaj_ormancilik',
    'name': 'Peyzaj Uygulama, Rulo Çim & Bahçe Sulama İhalesi',
    'icon': 'Trees',
    'badgeText': '🌲 Peyzaj & Ormancılık Şartnamesi',
    'description': 'Hazır rulo çim serme, otomatik pop-up sulama hattı, fidan/ağaç dikimi ve periyodik yeşil alan bakım kriterleri.',
    'groups': {
        'teknik': {'title': '1. Peyzaj Alanı & Bitki Özellikleri', 'desc': 'Yeşil alan m², çim türü, ağaç boyu ve sulama bölge sayısı'},
        'mevzuat': {'title': '2. Bitki Pasaportu & Ziraat Mühendisi Denetimi', 'desc': 'Tarım Bakanlığı bitki sağlık sertifikası ve ziraat mühendisi kontrolü'},
        'ticari': {'title': '3. Tutma Garantisi & Periyodik Bakım', 'desc': '1 yıllık kuruma/tutma garantisi ve mevsimlik çim biçme takvimi'}
    },
    'fields': [
        {'id': 'peyzajKapsami', 'label': 'Peyzaj & Bahçe Uygulama Türü', 'type': 'select', 'group': 'teknik', 'options': ['Hazır Doğal Rulo Çim Temini ve Serimi', 'Otomatik Pop-Up Bahçe Sulama Sistemi Kurulumu', 'Yetişkin İbreli / Yapraklı Ağaç Fidanı Dikimi', 'Mevsimlik Çiçeklendirme & Çalı Grubu Dikimi', 'Yıllık Periyodik Yeşil Alan Bakımı (Biçme/İlaçlama/Gübreleme)'], 'defaultValue': 'Hazır Doğal Rulo Çim Temini ve Serimi'},
        {'id': 'toplamAlanM2', 'label': 'Uygulama Yapılacak Alan', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 2500', 'group': 'teknik', 'required': True, 'defaultValue': 2500},
        {'id': 'cimTuru', 'label': 'Çim / Bitki Karışımı Türü', 'type': 'select', 'group': 'teknik', 'options': ['4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim', 'Bermuda (Uganda) Sıcağa Dayanıklı Çim', 'İthal 6 Karışım Villa Çimi', 'Karışımsız / Serbest'], 'defaultValue': '4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim'},
        {'id': 'bitkiPasaportu', 'label': 'Tarım Bakanlığı Onaylı Resmi Bitki Pasaportu Zorunluluğu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'ziraatMuhendisiKontrolu', 'label': 'Uygulamanın Ziraat / Peyzaj Mühendisi Nezaretinde Yapılması', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'bitkiTutmaGarantisi', 'label': 'Dikilen Bitki ve Çimlerde 1 Yıl Birebir Tutma/Yenileme Garantisi', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'otomatikSulamaOtomasyonu', 'label': 'Yağmur Sensörlü ve Wi-Fi Kontrollü Sulama Kontrol Ünitesi', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '3.000 m² Otomatik Sulamalı Rulo Çim Uygulaması', 'values': {'peyzajKapsami': 'Hazır Doğal Rulo Çim Temini ve Serimi', 'toplamAlanM2': 3000, 'cimTuru': '4 Karışım Özel Dayanıklı Spor/Gölge Rulo Çim', 'bitkiTutmaGarantisi': True, 'otomatikSulamaOtomasyonu': True}},
        {'label': 'Yıllık Kurumsal Kampüs Yeşil Alan Bakım Hizmeti', 'values': {'peyzajKapsami': 'Yıllık Periyodik Yeşil Alan Bakımı (Biçme/İlaçlama/Gübreleme)', 'toplamAlanM2': 10000}}
    ]
}

# 26. Hayvancılık - Veterinerlik - Hayvan Yemi
DATA['hayvancilik_yem'] = {
    'key': 'hayvancilik_yem',
    'name': 'Hayvancılık, Karma Yem & Veterinerlik İhalesi',
    'icon': 'Beef',
    'badgeText': '🐄 Hayvancılık & Yem Şartnamesi',
    'description': 'Büyükbaş/küçükbaş karma besi ve süt yemi, veteriner aşıları ve canlı damızlık hayvan alım parametreleri.',
    'groups': {
        'teknik': {'title': '1. Yem / Hayvan Cinsi & Besin Değerleri', 'desc': 'Ham protein %, ham selüloz, ME enerji ve hayvan ırkı'},
        'mevzuat': {'title': '2. Tarım Bakanlığı TÜRKVET & Sağlık Sertifikası', 'desc': 'TÜRKVET küpe kaydı, ari işletme belgesi ve aşı kartları'},
        'ticari': {'title': '3. Çuvallı/Dökme Silobas Teslim & Numune Analizi', 'desc': 'Çiftlik silolarına silobasla basım ve bağımsız analiz onayı'}
    },
    'fields': [
        {'id': 'yemHayvanKategorisi', 'label': 'Kategori', 'type': 'select', 'group': 'teknik', 'options': ['Büyükbaş Süt & Besi Karma Yemi', 'Küçükbaş Kuzu & Koyun Büyütme Yemi', 'Kanatlı Etlik & Yumurta Piliç Yemi', 'Canlı Damızlık Gebe Düve / Koç Alımı', 'Veteriner İlaç, Aşı & Biyolojik Ürünler'], 'defaultValue': 'Büyükbaş Süt & Besi Karma Yemi'},
        {'id': 'miktarTonVeyaBas', 'label': 'Toplam Talep Miktarı', 'type': 'number', 'unit': 'Ton / Baş', 'placeholder': 'Örn: 30', 'group': 'teknik', 'required': True, 'defaultValue': 30},
        {'id': 'hamProteinOrani', 'label': 'Asgari Ham Protein Oranı', 'type': 'select', 'group': 'teknik', 'options': ['En Az %18 HP (Yüksek Verim Süt)', 'En Az %16 HP (Standart Besi)', 'En Az %21 HP (Buzağı / Kuzu Başlangıç)', 'Belirtilmedi / Canlı Hayvan'], 'defaultValue': 'En Az %18 HP (Yüksek Verim Süt)'},
        {'id': 'turkvetKayitBelgesi', 'label': 'Tarım Bakanlığı TÜRKVET Sistem Kaydı ve Kulak Küpesi Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'hastaliktanAriIsletme', 'label': 'Tüberküloz ve Brusellozdan Ari İşletme Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'aflatoksinVeMikotoksinRaporu', 'label': 'Her Sevkiyatta Akredite Mikotoksin / Aflatoksin Analiz Raporu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'silobasVeyaCuvalTeslimat', 'label': 'Teslimat Şekli', 'type': 'select', 'group': 'ticari', 'options': ['Dökme Silobas ile Çiftlik Yem Silosuna Dolum', '50 kg Polipropilen Çuvallı Paletli Teslim', 'Canlı Nakil Aracı ile Çiftlik İndirmeli'], 'defaultValue': 'Dökme Silobas ile Çiftlik Yem Silosuna Dolum'}
    ],
    'quickPresets': [
        {'label': '60 Ton %18 Proteinli Pelet Süt Yemi (Silobas)', 'values': {'yemHayvanKategorisi': 'Büyükbaş Süt & Besi Karma Yemi', 'miktarTonVeyaBas': 60, 'hamProteinOrani': 'En Az %18 HP (Yüksek Verim Süt)', 'silobasVeyaCuvalTeslimat': 'Dökme Silobas ile Çiftlik Yem Silosuna Dolum'}},
        {'label': '20 Baş Simental Gebe Düve Alımı', 'values': {'yemHayvanKategorisi': 'Canlı Damızlık Gebe Düve / Koç Alımı', 'miktarTonVeyaBas': 20, 'turkvetKayitBelgesi': True, 'hastaliktanAriIsletme': True}}
    ]
}

# 27. Sanat Eserleri - Müzik Aletleri - Heykel - Maket
DATA['sanat_heykel'] = {
    'key': 'sanat_heykel',
    'name': 'Sanat Eseri, Anıt Heykel & Mimari Maket İhalesi',
    'icon': 'Palette',
    'badgeText': '🎨 Sanat & Heykel Şartnamesi',
    'description': 'Meydan anıtı bronz döküm heykeller, mimari ölçekli maketler, sanatsal rölyefler ve müzik enstrümanı kriterleri.',
    'groups': {
        'teknik': {'title': '1. Sanat Eseri Türü, Boyut & Malzeme', 'desc': 'Bronz, fiber, mermer cinsi, maket ölçeği ve enstrüman markası'},
        'mevzuat': {'title': '2. Heykeltıraş Eser Hakkı & Fikir Sanat Eserleri', 'desc': '5846 sayılı FSEK telif devri ve jüri/seçici kurul onayı'},
        'ticari': {'title': '3. Kaide İnşaatı, Işıklandırma & Taşıma', 'desc': 'Betonarme kaide montajı ve özel korumalı sandıkta teslimat'}
    },
    'fields': [
        {'id': 'eserTuru', 'label': 'Eser / Ürün Türü', 'type': 'select', 'group': 'teknik', 'options': ['Bronz Döküm Anıt & Meydan Heykeli', 'Mimari Satış & Tanıtım Maketi (Işıklı)', 'Sanatsal Duvar Rölyefi & Seramik Pano', 'Senfoni & Konservatuvar Müzik Aletleri', 'Tarihi Eser Konservasyon & Restorasyonu'], 'defaultValue': 'Bronz Döküm Anıt & Meydan Heykeli'},
        {'id': 'malzemeCinsi', 'label': 'Ana Malzeme', 'type': 'select', 'group': 'teknik', 'options': ['Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)', '1. Sınıf Beyaz Muğla / Marmara Mermeri', 'Poliüretan Korumalı Fiberglas (CTP)', 'Pleksiglas & Ahşap Detaylı Pleksi Maket'], 'defaultValue': 'Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)'},
        {'id': 'olcekVeyaEbatMetre', 'label': 'Heykel Yüksekliği (m) veya Maket Ölçeği', 'type': 'select', 'group': 'teknik', 'options': ['1/100 Ölçekli Mimari Maket', '1/50 Ölçekli Detaylı Maket', '3.00 Metre Yükseklik (Kaide Hariç)', '4.50 Metre Anıtsal Yükseklik', 'Doğal Boyut (1:1)'], 'defaultValue': '3.00 Metre Yükseklik (Kaide Hariç)'},
        {'id': 'fsekTelifDevri', 'label': '5846 Sayılı FSEK Kapsamında Tüm Mali Hakların Süresiz Devri', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'heykeltrasSeciciKurulOnayi', 'label': '1/10 Boyutlu Çamur/Alçı Eskizin Seçici Kurulca Onaylanması', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kaideVeAydinlatmaDahil', 'label': 'Granit Kaplı Betonarme Kaide ve Gece LED Aydınlatması Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'ozelSandikliNakliye', 'label': 'Titreşim Önleyici Özel İklimlendirmeli Sandık ile Teslimat', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '3 Metrelik Bronz Döküm Meydan Heykeli', 'values': {'eserTuru': 'Bronz Döküm Anıt & Meydan Heykeli', 'malzemeCinsi': 'Kalıp Döküm Bronz (En Az %85 Bakır Alaşım)', 'olcekVeyaEbatMetre': '3.00 Metre Yükseklik (Kaide Hariç)', 'fsekTelifDevri': True, 'kaideVeAydinlatmaDahil': True}},
        {'label': '1/100 Ölçekli Işıklı Konut Projesi Maketi', 'values': {'eserTuru': 'Mimari Satış & Tanıtım Maketi (Işıklı)', 'olcekVeyaEbatMetre': '1/100 Ölçekli Mimari Maket'}}
    ]
}

# 28. Odun - Kömür - Katıyakıt
DATA['odun_komur'] = {
    'key': 'odun_komur',
    'name': 'Sanayi Kömürü, Pelet & Odun Katı Yakıt İhalesi',
    'icon': 'Flame',
    'badgeText': '🪵 Katı Yakıt & Kömür Şartnamesi',
    'description': 'Sanayi/ısınma kömürü, odun peleti, meşe/çam odunu toptan alımları için kalori analiz raporu ve çevre satış izin belgesi.',
    'groups': {
        'teknik': {'title': '1. Yakıt Türü, Kalori Değeri & Kül Oranı', 'desc': 'Alt ısıl değer kcal/kg, kükürt oranı, rutubet ve ebatlar'},
        'mevzuat': {'title': '2. Çevre Bakanlığı İzin & Uygunluk Belgesi', 'desc': 'Hava kalitesi yönetmeliği uygunluk belgesi ve orman işletme nakliyesi'},
        'ticari': {'title': '3. Torbalı/Dökme Teslimat & Kantar Tartımı', 'desc': '25 kg kraft/polipropilen torba ve alıcı kantarı tartımı'}
    },
    'fields': [
        {'id': 'katiYakitTuru', 'label': 'Katı Yakıt Türü', 'type': 'select', 'group': 'teknik', 'options': ['İthal Fındık / Ceviz Sanayi & Isınma Kömürü', 'Yerli Yıkanmış Linyit Kömürü (Torbalı)', 'DIN Plus / EN Plus A1 Odun Peleti', 'Fırınlanmış Meşe / Gürgen Şömine Odunu', 'Prina / Biyokütle Katı Yakıt'], 'defaultValue': 'İthal Fındık / Ceviz Sanayi & Isınma Kömürü'},
        {'id': 'siparisMiktariTon', 'label': 'Toplam Talep Edilen Miktar', 'type': 'number', 'unit': 'Ton', 'placeholder': 'Örn: 100', 'group': 'teknik', 'required': True, 'defaultValue': 100},
        {'id': 'asgariKaloriDegeri', 'label': 'Asgari Alt Isıl Değer', 'type': 'select', 'group': 'teknik', 'options': ['En Az 7.000 kcal/kg (1. Kalite İthal)', 'En Az 6.000 kcal/kg', 'En Az 4.500 kcal/kg (Yerli Linyit)', 'En Az 4.800 kcal/kg (A1 Pelet)'], 'defaultValue': 'En Az 7.000 kcal/kg (1. Kalite İthal)'},
        {'id': 'maksimumKulKukurt', 'label': 'Kül ve Kükürt Sınırı', 'type': 'select', 'group': 'teknik', 'options': ['Kül: Azami %8, Kükürt: Azami %0.9', 'Kül: Azami %12, Kükürt: Azami %1.5', 'Kül: Azami %0.7 (ENplus A1 Pelet)'], 'defaultValue': 'Kül: Azami %8, Kükürt: Azami %0.9'},
        {'id': 'cevreVeSehircilikSatisIzinBelgesi', 'label': 'Çevre ve Şehircilik İl Müdürlüğü Katı Yakıt Satış İzin Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'ormanIsletmeNakliyeMakbuzu', 'label': 'Orman Genel Müdürlüğü Onaylı Resmi Nakliye Tezkeresi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'torbaliPaketleme', 'label': 'Ambalaj Şekli', 'type': 'select', 'group': 'ticari', 'options': ['25 kg Orijinal Lamineli Çuval / Torba', '1.000 kg Big-Bag Çuval', 'Dökme Kamyon ile Depo Sahasına Boşaltım'], 'defaultValue': '25 kg Orijinal Lamineli Çuval / Torba'}
    ],
    'quickPresets': [
        {'label': '100 Ton İthal 7.000 Kalori Fındık Kömür', 'values': {'katiYakitTuru': 'İthal Fındık / Ceviz Sanayi & Isınma Kömürü', 'siparisMiktariTon': 100, 'asgariKaloriDegeri': 'En Az 7.000 kcal/kg (1. Kalite İthal)', 'cevreVeSehircilikSatisIzinBelgesi': True}},
        {'label': '50 Ton ENplus A1 Çam Odun Peleti Alımı', 'values': {'katiYakitTuru': 'DIN Plus / EN Plus A1 Odun Peleti', 'siparisMiktariTon': 50, 'asgariKaloriDegeri': 'En Az 4.800 kcal/kg (A1 Pelet)'}}
    ]
}

# 29. Hazır Yemek - Lokantacılık
DATA['hazir_yemek_ikram'] = {
    'key': 'hazir_yemek_ikram',
    'name': 'Hazır Yemek, Tabldot Catering & Kumanya İhalesi',
    'icon': 'UtensilsCrossed',
    'badgeText': '🍽️ Catering & Hazır Yemek Şartnamesi',
    'description': 'Kurumsal fabrikalar ve kurumlar için 4 kap sıcak tabldot yemek, yerinde üretim veya taşımalı servis, kalori ve ISO 22000 şartları.',
    'groups': {
        'teknik': {'title': '1. Menü Yapısı & Günlük Kişi Sayısı', 'desc': 'Kişi sayısı, öğün (öğle/akşam/gece), 4 kap menü ve kalori aralığı'},
        'mevzuat': {'title': '2. Tarım Bakanlığı İzin & ISO 22000 Gıda Güvenliği', 'desc': 'Gıda üretim izni, HACCP ve gıda mühendisi istihdamı zorunluluğu'},
        'ticari': {'title': '3. Servis Modeli, Termobox & Servis Personeli', 'desc': 'Taşımalı termobox veya mutfakta yerinde pişirme, servis elemanı'}
    },
    'fields': [
        {'id': 'gunlukKisiSayisi', 'label': 'Günlük Yemek Yiyecek Kişi Sayısı', 'type': 'number', 'unit': 'Kişi/Gün', 'placeholder': 'Örn: 300', 'group': 'teknik', 'required': True, 'defaultValue': 300},
        {'id': 'servisBicimi', 'label': 'Hizmet & Üretim Modeli', 'type': 'select', 'group': 'teknik', 'options': ['Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)', 'Müşteri Mutfağında Yerinde Pişirme ve Sunum', 'Paketli Kumanya & Sandviç Dağıtımı', 'Açık Büfe / Protokol VIP Tabldot'], 'defaultValue': 'Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)'},
        {'id': 'menuKapSayisi', 'label': 'Menü Kapsamı', 'type': 'select', 'group': 'teknik', 'options': ['4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)', '5 Kap Geniş Menü + Salata Bar', '3 Kap Diyet / Hafif Menü'], 'defaultValue': '4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)'},
        {'id': 'asgariKaloriDegeri', 'label': 'Öğün Başına Asgari Kalori', 'type': 'select', 'group': 'teknik', 'options': ['850 - 1.100 kcal (Ağır Sanayi / Şantiye)', '700 - 850 kcal (Ofis / Standart)', '550 - 700 kcal (Hafif Kalorili)'], 'defaultValue': '850 - 1.100 kcal (Ağır Sanayi / Şantiye)'},
        {'id': 'iso22000HaccpBelgesi', 'label': 'ISO 22000 Gıda Güvenliği Yönetim Sistemi ve HACCP Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'gidaMuhendisiSarti', 'label': 'Üretim Tesisinde Tam Zamanlı Gıda Mühendisi / Diyetisyen Denetimi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'servisPersoneliVeBulasikDahil', 'label': 'Yemek Dağıtım Garsonu, Ekmek/Baharat ve Bulaşık Yıkama Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '500 Kişilik Fabrika Taşımalı Tabldot Hizmeti', 'values': {'gunlukKisiSayisi': 500, 'servisBicimi': 'Taşımalı Yemek (Termobox ile Sıcak Sevkiyat)', 'menuKapSayisi': '4 Kap Standart Menü (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve)', 'iso22000HaccpBelgesi': True, 'servisPersoneliVeBulasikDahil': True}},
        {'label': '150 Kişilik Yerinde Pişirmeli Kurumsal Yemek', 'values': {'gunlukKisiSayisi': 150, 'servisBicimi': 'Müşteri Mutfağında Yerinde Pişirme ve Sunum', 'gidaMuhendisiSarti': True}}
    ]
}

# 30. Elektronik - Ölçü Aletleri - İletişim - Bilgisayar
DATA['elektronik_bilgisayar'] = {
    'key': 'elektronik_bilgisayar',
    'name': 'Bilgisayar Donanımı, Sunucu & Ölçü Aletleri İhalesi',
    'icon': 'Monitor',
    'badgeText': '🖥️ Donanım & Bilişim Şartnamesi',
    'description': 'Dizüstü iş bilgisayarları, veri merkezi sunucuları, network anahtarları ve akredite kalibrasyonlu laboratuvar ölçü aletleri.',
    'groups': {
        'teknik': {'title': '1. Donanım Türü, İşlemci & Bellek', 'desc': 'CPU nesli, RAM GB, NVMe SSD boyutu ve port sayısı'},
        'mevzuat': {'title': '2. CE, Enerji Verimliliği & Kalibrasyon', 'desc': 'CE uygunluğu, Energy Star belgesi ve TÜRKAK onaylı kalibrasyon'},
        'ticari': {'title': '3. Yerinde Servis Garantisi & Kurulum', 'desc': 'Ertesi iş günü yerinde müdahale (NBD On-site) garantisi'}
    },
    'fields': [
        {'id': 'donanimTuru', 'label': 'Elektronik / Bilişim Cihaz Türü', 'type': 'select', 'group': 'teknik', 'options': ['Kurumsal Dizüstü Bilgisayar (Laptop)', 'Masaüstü İş İstasyonu (Workstation PC)', 'Rack Tipi Veri Merkezi Sunucusu (Server)', 'Yönetilebilir Ağ Anahtarı (PoE Switch & Router)', 'Hassas Elektronik Ölçü Aleti (Multimetre / Osiloskop)'], 'defaultValue': 'Kurumsal Dizüstü Bilgisayar (Laptop)'},
        {'id': 'cihazAdedi', 'label': 'Alınacak Donanım Adedi', 'type': 'number', 'unit': 'Adet', 'placeholder': 'Örn: 50', 'group': 'teknik', 'required': True, 'defaultValue': 50},
        {'id': 'islemciVeBellekKapasitesi', 'label': 'İşlemci / RAM / Depolama Standardı', 'type': 'select', 'group': 'teknik', 'options': ['Intel Core i7 / 32GB RAM / 1TB NVMe SSD', 'Intel Core i5 / 16GB RAM / 512GB NVMe SSD', 'Çift Intel Xeon / 128GB ECC RAM / 8TB SAS RAID (Sunucu)', 'Kalibre Edilmiş Yüksek Hassasiyetli Laboratuvar Sınıfı'], 'defaultValue': 'Intel Core i7 / 32GB RAM / 1TB NVMe SSD'},
        {'id': 'ceVeEnergyStar', 'label': 'CE ve Energy Star Uluslararası Enerji Verimliliği Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'turkakKalibrasyonSertifikasi', 'label': 'Ölçü Aletlerinde TÜRKAK Akredite İlk Kalibrasyon Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'yerindeGarantiTuru', 'label': 'Garanti ve Teknik Servis Seviyesi', 'type': 'select', 'group': 'ticari', 'options': ['3 Yıl Yerinde Müdahale (Next Business Day On-Site)', '2 Yıl Standart Yetkili Servis Garantisi', '5 Yıl 7/24 4 Saat İçinde Kritik Parça Değişimi (Mission Critical)'], 'defaultValue': '3 Yıl Yerinde Müdahale (Next Business Day On-Site)'},
        {'id': 'isletimSistemiVeKurulum', 'label': 'Orijinal Windows Pro Lisansı ve İmaj Yükleme Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '50 Adet i7 32GB Kurumsal Laptop Alımı', 'values': {'donanimTuru': 'Kurumsal Dizüstü Bilgisayar (Laptop)', 'cihazAdedi': 50, 'islemciVeBellekKapasitesi': 'Intel Core i7 / 32GB RAM / 1TB NVMe SSD', 'yerindeGarantiTuru': '3 Yıl Yerinde Müdahale (Next Business Day On-Site)'}},
        {'label': '2 Adet Çift Xeon Veri Merkezi Sunucusu', 'values': {'donanimTuru': 'Rack Tipi Veri Merkezi Sunucusu (Server)', 'cihazAdedi': 2, 'islemciVeBellekKapasitesi': 'Çift Intel Xeon / 128GB ECC RAM / 8TB SAS RAID (Sunucu)'}}
    ]
}
