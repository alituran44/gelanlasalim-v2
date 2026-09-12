# -*- coding: utf-8 -*-
# Sektörler 31 - 40
DATA = {}

# 31. Uydu Takip - Kamera - Scada - Haberleşme Sistemleri
DATA['kamera_guvenlik_scada'] = {
    'key': 'kamera_guvenlik_scada',
    'name': 'Kamera Güvenlik, Plaka Tanıma & SCADA Telemetri İhalesi',
    'icon': 'Camera',
    'badgeText': '📹 Kamera & SCADA Şartnamesi',
    'description': 'IP CCTV güvenlik kameraları, Plaka Tanıma Sistemi (PTS), SCADA uzaktan izleme telemetri ve GPS filo takibi şartları.',
    'groups': {
        'teknik': {'title': '1. Sistem Türü, Çözünürlük & Depolama', 'desc': 'Kamera adedi, 4K/4MP çözünürlük, NVR kanal sayısı ve RAID kayıt'},
        'mevzuat': {'title': '2. EGM Kent Güvenlik (KGYS/PTS) & KVKK', 'desc': 'Emniyet Genel Müdürlüğü KGYS entegrasyonu ve KVKK tabela şartı'},
        'ticari': {'title': '3. Fiber Optik Kablolama, Montaj & 7/24 İzleme', 'desc': 'Altyapı kablolaması, devreye alma ve uzaktan izleme merkezi desteği'}
    },
    'fields': [
        {'id': 'guvenlikSistemiTuru', 'label': 'Güvenlik / Otomasyon Sistemi', 'type': 'select', 'group': 'teknik', 'options': ['IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi', 'Otoyol / Tesis Girişi Plaka Tanıma Sistemi (PTS)', 'SCADA & Endüstriyel Telemetri Uzaktan İzleme', 'Kurumsal Filo GPS Araç Takip & Canbus Entegrasyonu', 'DMR Dijital Telsiz & Trunk Haberleşme Ağı'], 'defaultValue': 'IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi'},
        {'id': 'kameraKanalAdedi', 'label': 'Kamera / İzleme Noktası Sayısı', 'type': 'number', 'unit': 'Nokta / Kamera', 'placeholder': 'Örn: 32', 'group': 'teknik', 'required': True, 'defaultValue': 32},
        {'id': 'cozunurlukVeOptik', 'label': 'Kamera Çözünürlüğü & Gece Görüş', 'type': 'select', 'group': 'teknik', 'options': ['4MP WDR Smart IR (En Az 30m Gece Görüş)', '4K Ultra HD Motorize Varifokal Lens', 'PTZ 360° 32x Optik Zoom Uzun Mesafe IR (150m)', 'Termal Çift Spektrumlu Çevre Güvenlik'], 'defaultValue': '4MP WDR Smart IR (En Az 30m Gece Görüş)'},
        {'id': 'kayitSuresiVeRaid', 'label': 'Kayıt Süresi ve Disk Güvenliği', 'type': 'select', 'group': 'teknik', 'options': ['En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)', 'En Az 60 Gün Kesintisiz Kayıt', 'En Az 90 Gün Kayıt Depolama'], 'defaultValue': 'En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)'},
        {'id': 'onvifVeCeUygunlugu', 'label': 'ONVIF Profile S/G/T ve CE Uygunluk Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'egmPlakaTanimaUyumu', 'label': 'Emniyet Genel Müdürlüğü (EGM) PTS Veritabanı Entegrasyon Uyumu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'fiberAltyapiVeMontajDahil', 'label': 'Fiber Optik / Cat6 Altyapı Kablolaması ve Direk Montajı Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '32 Kameralı 4MP IP CCTV & NVR Kayıt Sistemi', 'values': {'guvenlikSistemiTuru': 'IP Güvenlik Kamerası (CCTV) & NVR Kayıt Sistemi', 'kameraKanalAdedi': 32, 'cozunurlukVeOptik': '4MP WDR Smart IR (En Az 30m Gece Görüş)', 'kayitSuresiVeRaid': 'En Az 30 Gün Kesintisiz Kayıt (RAID 5 Destekli)', 'fiberAltyapiVeMontajDahil': True}},
        {'label': 'Çift Şerit Otoyol Plaka Tanıma Sistemi (PTS)', 'values': {'guvenlikSistemiTuru': 'Otoyol / Tesis Girişi Plaka Tanıma Sistemi (PTS)', 'kameraKanalAdedi': 4, 'egmPlakaTanimaUyumu': True}}
    ]
}

# 32. Temizlik - İlaçlama - Geri Dönüşüm
DATA['temizlik_geri_donusum'] = {
    'key': 'temizlik_geri_donusum',
    'name': 'Endüstriyel Temizlik, İlaçlama & Atık Yönetimi İhalesi',
    'icon': 'Sparkles',
    'badgeText': '🧹 Temizlik & Atık Yönetimi Şartnamesi',
    'description': 'Tesis/hastane temizliği, haşere/pest kontrol ilaçlama, tehlikesiz katı atık toplama ve geri dönüşüm ayrıştırma kriterleri.',
    'groups': {
        'teknik': {'title': '1. Tesis Alanı & Temizlik Kapsamı', 'desc': 'Kapalı/açık alan m², personel sayısı ve makine parkuru'},
        'mevzuat': {'title': '2. Çevre Bakanlığı İzin & Sağlık Bakanlığı Biyosidal', 'desc': 'Tehlikesiz atık toplama-ayırma lisansı ve mesleki yeterlilik belgesi'},
        'ticari': {'title': '3. Sarf Malzemeleri, Otomatlar & Vardiya Düzeni', 'desc': 'Zemin temizlik otomatları, kimyasal sarf ve 3 vardiya hizmeti'}
    },
    'fields': [
        {'id': 'temizlikKapsami', 'label': 'Hizmet / Faaliyet Türü', 'type': 'select', 'group': 'teknik', 'options': ['Entegre Tesis, Ofis & Fabrika Temizliği', 'Hastane & Sağlık Kuruluşu Dezenfeksiyon Temizliği', 'Haşere, Kemirgen İlaçlama & Pest Kontrol', 'Katı Atık Toplama & Geri Dönüşüm Yönetimi', 'Dış Cephe & Yüksek Cam Vinçli Temizlik'], 'defaultValue': 'Entegre Tesis, Ofis & Fabrika Temizliği'},
        {'id': 'kapaliAlanM2', 'label': 'Hizmet Verilecek Toplam Alan', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 15000', 'group': 'teknik', 'required': True, 'defaultValue': 15000},
        {'id': 'personelSayisi', 'label': 'Görevlendirilecek Asgari Personel Sayısı', 'type': 'number', 'unit': 'Kişi', 'placeholder': 'Örn: 12', 'group': 'teknik', 'defaultValue': 12},
        {'id': 'saglikBakanligiBiyosidalIzin', 'label': 'Sağlık Bakanlığı Onaylı Biyosidal İlaç Uygulama İzin Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'cevreVeSehircilikGeriDonusumLisansi', 'label': 'Çevre ve Şehircilik Bakanlığı Atık Toplama / Geri Dönüşüm Lisansı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'temizlikKimyasallariDahil', 'label': 'Tüm Temizlik Kimyasalları, Kağıt Havlu, Sıvı Sabun vb. Sarflar Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'biniciliOtomatTemini', 'label': 'Yüklenici Tarafından Binicili Zemin Yıkama Otomatı Tahsisi Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '15.000 m² Fabrika Entegre Temizlik & Makine Parkı', 'values': {'temizlikKapsami': 'Entegre Tesis, Ofis & Fabrika Temizliği', 'kapaliAlanM2': 15000, 'personelSayisi': 10, 'temizlikKimyasallariDahil': True, 'biniciliOtomatTemini': True}},
        {'label': 'Yıllık Periyodik Pest Kontrol & İlaçlama Hizmeti', 'values': {'temizlikKapsami': 'Haşere, Kemirgen İlaçlama & Pest Kontrol', 'kapaliAlanM2': 25000, 'saglikBakanligiBiyosidalIzin': True}}
    ]
}

# 33. Tekstil - Giyim - Spor Ekipmanları
DATA['tekstil_giyim'] = {
    'key': 'tekstil_giyim',
    'name': 'Kurumsal İş Kıyafeti, Üniforma & Tekstil İhalesi',
    'icon': 'Shirt',
    'badgeText': '👕 İş Kıyafeti & Tekstil Şartnamesi',
    'description': 'Kışlık/yazlık iş tulumları, reflektif montlar, S3 çelik burun iş ayakkabıları ve güvenlik üniformaları şartnamesi.',
    'groups': {
        'teknik': {'title': '1. Kıyafet Türü, Kumaş Gramajı & Beden Dağılımı', 'desc': 'Kumaş karışımı pamuk/polyester, reflektif şerit ve takım adedi'},
        'mevzuat': {'title': '2. EN ISO 20471 & OEKO-TEX Standartları', 'desc': 'Yüksek görünürlük sertifikası ve OEKO-TEX Standard 100 onayı'},
        'ticari': {'title': '3. Kurumsal Logo Nakışı, Beden Deneme & Paketleme', 'desc': 'Personel isimli paketleme ve teklif aşamasında numune onayı'}
    },
    'fields': [
        {'id': 'tekstilUrunTuru', 'label': 'İş Kıyafeti / Tekstil Ürün Grubu', 'type': 'select', 'group': 'teknik', 'options': ['Yazlık & Kışlık Şantiye İş Tulumu / Pantolon', 'Yüksek Görünürlüklü Reflektif Parka / Yelek (EN ISO 20471)', 'Özel Güvenlik Görevlisi Takım Üniforması', 'S3 Çelik/Kompozit Burunlu Su Geçirmez İş Ayakkabısı', 'Kurumsal Polo Yaka Tişört & Sweatshirt Grubu'], 'defaultValue': 'Yazlık & Kışlık Şantiye İş Tulumu / Pantolon'},
        {'id': 'toplamTakimAdedi', 'label': 'Toplam Takım / Adet Miktarı', 'type': 'number', 'unit': 'Takım / Adet', 'placeholder': 'Örn: 250', 'group': 'teknik', 'required': True, 'defaultValue': 250},
        {'id': 'kumasKarisimi', 'label': 'Kumaş Spesifikasyonu ve Gramajı', 'type': 'select', 'group': 'teknik', 'options': ['%65 Pamuk - %35 Polyester 245 g/m² Gabardin', '%100 Pamuk Alev Almaz / Antistatik Kumaş (Proban)', 'Su ve Rüzgar Geçirmez Bonded Kumaş Kışlık Parka', 'Nefes Alabilir %100 Pamuk Penye 180 g/m²'], 'defaultValue': '%65 Pamuk - %35 Polyester 245 g/m² Gabardin'},
        {'id': 'enIso20471Sertifikasi', 'label': 'EN ISO 20471 Yüksek Görünürlük Reflektif Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'oekoTexStandarti', 'label': 'OEKO-TEX Standard 100 İnsan Sağlığına Zararsızlık Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kurumsalLogoNakisiDahil', 'label': 'Göğüs ve Sırtta Kurumsal Nakış / Reflektif Baskı Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'personelAdinaPaketleme', 'label': 'Personel Adı ve Bedenine Göre Ayrı Ayrı Poşetlenmiş Teslimat', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '300 Takım Şantiye İş Pantolonu & Yeleği', 'values': {'tekstilUrunTuru': 'Yazlık & Kışlık Şantiye İş Tulumu / Pantolon', 'toplamTakimAdedi': 300, 'kumasKarisimi': '%65 Pamuk - %35 Polyester 245 g/m² Gabardin', 'kurumsalLogoNakisiDahil': True}},
        {'label': '150 Adet EN ISO 20471 Reflektif Kışlık Parka', 'values': {'tekstilUrunTuru': 'Yüksek Görünürlüklü Reflektif Parka / Yelek (EN ISO 20471)', 'toplamTakimAdedi': 150, 'enIso20471Sertifikasi': True}}
    ]
}

# 34. İş Sağlığı - İş Güvenliği ve Ekipmanları
DATA['is_sagligi_guvenligi'] = {
    'key': 'is_sagligi_guvenligi',
    'name': 'Kişisel Koruyucu Donanım (KKD) & İSG Malzemeleri İhalesi',
    'icon': 'ShieldAlert',
    'badgeText': '⛑️ İSG & KKD Şartnamesi',
    'description': 'Baretler, paraşüt tipi emniyet kemerleri, yaşam hatları, gaz maskeleri ve acil durum duşları tedarik standartları.',
    'groups': {
        'teknik': {'title': '1. KKD Türü & Koruma Seviyesi', 'desc': 'Baret standardı EN 397, kemer EN 361 ve maske filtre sınıfı'},
        'mevzuat': {'title': '2. AB 2016/425 KKD Yönetmeliği & CE Belgesi', 'desc': 'Kategori III KKD onaylanmış kuruluş CE sertifikası'},
        'ticari': {'title': '3. Toplu Paketleme, Kullanım Kılavuzu & Değişim', 'desc': 'Türkçe kılavuz, raf ömrü garantisi ve hatalı parça değişimi'}
    },
    'fields': [
        {'id': 'kkdKategorisi', 'label': 'İSG Donanım Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Endüstriyel Emniyet Bareti (EN 397)', 'Paraşüt Tipi Emniyet Kemeri & Yaşam Hattı (EN 361)', 'FFP2 / FFP3 Solunum & Gaz Maskeleri (EN 149)', 'Çapak & Kimyasal Koruyucu Gözlük / Yüz Siperi', 'Gürültü Önleyici Kulaklık & Kulak Tıkacı (EN 352)', 'Boy & Göz Acil Emniyet Duşu İstasyonu'], 'defaultValue': 'Endüstriyel Emniyet Bareti (EN 397)'},
        {'id': 'siparisAdedi', 'label': 'Talep Edilen Toplam Adet', 'type': 'number', 'unit': 'Adet', 'placeholder': 'Örn: 500', 'group': 'teknik', 'required': True, 'defaultValue': 500},
        {'id': 'ceKategoriIiiSertifikasi', 'label': 'Kategori III (Ölümcül Risk) Onaylanmış Kuruluş CE Sertifikası', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'tseEnUygunlukBelgesi', 'label': 'İlgili TSE EN Standart Uygunluk Belgesi Zorunlu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'yeniUretimRafOmru', 'label': 'Maksimum 6 Ay Önce Üretilmiş Yeni Tarihli Ürün Taahhüdü', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'numuneOnayProseduru', 'label': 'İSG Uzmanı Tarafından Numune Testi ve Onayı Şartı', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '500 Adet EN 397 Vidalı Ayarlı Şantiye Bareti', 'values': {'kkdKategorisi': 'Endüstriyel Emniyet Bareti (EN 397)', 'siparisAdedi': 500, 'ceKategoriIiiSertifikasi': True, 'yeniUretimRafOmru': True}},
        {'label': '100 Adet Paraşüt Tipi Düşüş Durdurma Kemeri', 'values': {'kkdKategorisi': 'Paraşüt Tipi Emniyet Kemeri & Yaşam Hattı (EN 361)', 'siparisAdedi': 100, 'ceKategoriIiiSertifikasi': True}}
    ]
}

# 35. Özel Güvenlik - Koruma - Bekçilik
DATA['ozel_guvenlik'] = {
    'key': 'ozel_guvenlik',
    'name': '5188 Sayılı Kanun Kapsamında Özel Güvenlik Hizmeti İhalesi',
    'icon': 'ShieldCheck',
    'badgeText': '👮 Özel Güvenlik Şartnamesi',
    'description': 'Silahlı/silahsız güvenlik personeli temini, şantiye/fabrika gece bekçiliği, devriye tur kalemi ve X-ray kontrol kriterleri.',
    'groups': {
        'teknik': {'title': '1. Vardiya Düzeni, Personel & Teçhizat', 'desc': 'Kişi sayısı, vardiya saati (8/16 veya 12/36) ve devriye tur kalemi'},
        'mevzuat': {'title': '2. 5188 Sayılı Kanun & Valilik İzni', 'desc': 'İçişleri Bakanlığı faaliyet izin belgesi ve özel güvenlik mali sorumluluk sigortası'},
        'ticari': {'title': '3. Üniforma, Telsiz, Cop/Kelepçe & Yemek Dahil', 'desc': 'Tüm ekipman, telsiz ağı ve personel yemek/yol giderleri dahil'}
    },
    'fields': [
        {'id': 'guvenlikTuru', 'label': 'Özel Güvenlik Hizmet Türü', 'type': 'select', 'group': 'teknik', 'options': ['Silahsız Özel Güvenlik Personeli Temini', 'Silahlı Özel Güvenlik (Banka / Değerli Tesis)', 'Tesis & Şantiye Gece Bekçiliği Hizmeti', 'VIP Yakın Koruma & Özel Protokol Refakati', 'Konser, Fuar & Etkinlik Geçici Güvenliği'], 'defaultValue': 'Silahsız Özel Güvenlik Personeli Temini'},
        {'id': 'personelSayisi', 'label': 'Görevlendirilecek Personel Sayısı', 'type': 'number', 'unit': 'Kişi', 'placeholder': 'Örn: 8', 'group': 'teknik', 'required': True, 'defaultValue': 8},
        {'id': 'vardiyaSistemi', 'label': 'Vardiya ve Çalışma Düzeni', 'type': 'select', 'group': 'teknik', 'options': ['3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)', '2 Vardiya 12 Saat Sistem', 'Yalnızca Gece Vardiyası (18:00 - 08:00)', 'Hafta Sonu & Resmi Tatil Nöbeti'], 'defaultValue': '3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)'},
        {'id': 'faaliyetIzinBelgesi5188', 'label': 'İçişleri Bakanlığı 5188 Sayılı Özel Güvenlik Şirketi Faaliyet İzin Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'maliSorumlulukSigortasi', 'label': 'Zorunlu Özel Güvenlik Mali Sorumluluk Sigortası Poliçesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'tumPersonelKimlikKartli', 'label': 'Tüm Görevlilerin Geçerli Özel Güvenlik Kimlik Kartına Sahip Olması', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'tehizatVeUniformaDahil', 'label': 'Yazlık/Kışlık Üniforma, Telsiz, El Dedektörü ve Devriye Kalemi Dahil', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '7/24 Fabrika Koruma (8 Kişilik Silahsız Güvenlik)', 'values': {'guvenlikTuru': 'Silahsız Özel Güvenlik Personeli Temini', 'personelSayisi': 8, 'vardiyaSistemi': '3 Vardiya 8 Saat (7/24 Kesintisiz Koruma)', 'faaliyetIzinBelgesi5188': True, 'tehizatVeUniformaDahil': True}},
        {'label': 'Şantiye Gece Bekçiliği (2 Personel 12 Saat)', 'values': {'guvenlikTuru': 'Tesis & Şantiye Gece Bekçiliği Hizmeti', 'personelSayisi': 2, 'vardiyaSistemi': 'Yalnızca Gece Vardiyası (18:00 - 08:00)'}}
    ]
}

# 36. Eğitim - Araştırma - Anket - Tercümanlık
DATA['egitim_tercume'] = {
    'key': 'egitim_tercume',
    'name': 'Yeminli Tercüme, Kurumsal Eğitim & Saha Araştırması İhalesi',
    'icon': 'GraduationCap',
    'badgeText': '📚 Eğitim & Tercümanlık Şartnamesi',
    'description': 'Noter yeminli teknik/hukuki tercüme, kurumsal yabancı dil/liderlik eğitimleri ve kantitatif saha anketi standartları.',
    'groups': {
        'teknik': {'title': '1. Hizmet Türü, Sayfa / Saat / Örneklem', 'desc': 'Karakter sayısı, eğitim saati, anketör sayısı ve metodoloji'},
        'mevzuat': {'title': '2. Noter Yemin Zaptı & MEB/TÜRKAK Akreditasyonu', 'desc': 'Noter yemin zaptı, MEB onaylı eğitmenlik veya ISO 20252 belgesi'},
        'ticari': {'title': '3. Sertifikasyon, Noter Tasdik Harcı & Raporlama', 'desc': 'Katılımcı sertifikaları, çapraz tablo analizi ve gizlilik sözleşmesi'}
    },
    'fields': [
        {'id': 'hizmetAlani', 'label': 'Hizmet Kategorisi', 'type': 'select', 'group': 'teknik', 'options': ['Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri', 'Kurumsal Yönetici & Personel Yetkinlik Eğitimleri', 'Kantitatif Saha Kamuoyu & Pazar Araştırması Anketi', 'Akademik, Finansal & Stratejik Fizibilite Raporlaması'], 'defaultValue': 'Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri'},
        {'id': 'hacimBirimSayisi', 'label': 'Hacim (Karakter / Saat / Denek Sayısı)', 'type': 'number', 'unit': 'Birim', 'placeholder': 'Örn: 50000', 'group': 'teknik', 'required': True, 'defaultValue': 50000},
        {'id': 'hedefDilVeyaKonu', 'label': 'Hedef Dil / Eğitim Alanı', 'type': 'select', 'group': 'teknik', 'options': ['İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri', 'Arapça, Rusça, Çince Özel Çeviri', 'Liderlik, Satış & Müzakere Teknikleri Eğitimi', 'Tüm Türkiye Temsili N=2.000 Saha Anketi'], 'defaultValue': 'İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri'},
        {'id': 'noterYeminZapti', 'label': 'Tercümanların T.C. Noterlerinden Onaylı Yemin Zaptı Zorunluluğu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'iso20252ArastirmaStandarti', 'label': 'Piyasa Araştırmalarında ISO 20252 Kalite Standardı Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'gizlilikSozlesmesiVeNda', 'label': 'Kurumsal Gizlilik Sözleşmesi (NDA) ve Veri İmhası Taahhüdü', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'noterMasraflariDahil', 'label': 'Noter Tasdik ve Apostil Harç Bedelleri Yükleniciye Ait', 'type': 'boolean', 'group': 'ticari', 'defaultValue': False}
    ],
    'quickPresets': [
        {'label': '100.000 Karakter Teknik Şartname Yeminli Tercümesi', 'values': {'hizmetAlani': 'Noter Yeminli Mütercim Tercümanlık & Simültane Çeviri', 'hacimBirimSayisi': 100000, 'hedefDilVeyaKonu': 'İngilizce, Almanca, Fransızca Teknik/Hukuki Çeviri', 'noterYeminZapti': True, 'gizlilikSozlesmesiVeNda': True}},
        {'label': 'N=1.500 Örneklemli Saha Tüketici Araştırması', 'values': {'hizmetAlani': 'Kantitatif Saha Kamuoyu & Pazar Araştırması Anketi', 'hacimBirimSayisi': 1500, 'iso20252ArastirmaStandarti': True}}
    ]
}

# 37. İşletmecilik - İşçilik - Sosyal Hizmetler
DATA['isletmecilik_hizmet'] = {
    'key': 'isletmecilik_hizmet',
    'name': 'Tesis İşletmeciliği, Resepsiyon & Destek Personeli İhalesi',
    'icon': 'Briefcase',
    'badgeText': '🤝 Tesis İşletmeciliği Şartnamesi',
    'description': 'Sosyal tesis işletmeciliği, danışma/resepsiyon hizmeti, veri giriş elemanı ve bordrolama personeli temin şartları.',
    'groups': {
        'teknik': {'title': '1. Personel Kadrosu, Nitelik & Görev Alanı', 'desc': 'Kişi sayısı, lise/önlisans/lisans mezuniyeti ve vardiya'},
        'mevzuat': {'title': '2. İŞKUR Özel İstihdam Bürosu & SGK Uyumu', 'desc': 'İŞKUR izin belgesi, sıfır SGK borçsuzluk belgesi ve İSG eğitimi'},
        'ticari': {'title': '3. Asgari Ücret Farkı, Tazminat & Kıyafet', 'desc': 'Resmî asgari ücret artış yansıtması ve kıdem tazminatı karşılığı'}
    },
    'fields': [
        {'id': 'isletmeKapsami', 'label': 'İşletmecilik / Hizmet Türü', 'type': 'select', 'group': 'teknik', 'options': ['Bina, Plaza & Site Entegre Tesis Yönetimi', 'Danışma, Karşılama, Santral & Resepsiyon Hizmeti', 'Veri Giriş, Arşivleme & Büro Destek Personeli', 'Sosyal Tesis, Misafirhane & Lokal İşletmeciliği', 'Kurye, İç Dağıtım & Ofis İçi Lojistik Personeli'], 'defaultValue': 'Bina, Plaza & Site Entegre Tesis Yönetimi'},
        {'id': 'personelSayisi', 'label': 'İstihdam Edilecek Asgari Personel', 'type': 'number', 'unit': 'Personel', 'placeholder': 'Örn: 15', 'group': 'teknik', 'required': True, 'defaultValue': 15},
        {'id': 'iskurOzelIstihdamIzni', 'label': 'İŞKUR Özel İstihdam Bürosu İzin Belgesi Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'aylikSgkBorcsuzlukBelgesi', 'label': 'Her Hakedişte SGK ve Vergi Borcu Yoktur Belgesi İbrazı Zorunlu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kidemTazminatiKarsiligi', 'label': 'Sözleşme Sonunda Personel Kıdem Tazminatı Sorumluluğu Yükleniciye Ait', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'asgariUcretFarkiGuncellemesi', 'label': 'Resmî Asgari Ücret Artışlarında Yasal Fark Fiyata Birebir Yansıtılır', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '10 Kişilik Danışma ve Resepsiyon Destek Hizmeti', 'values': {'isletmeKapsami': 'Danışma, Karşılama, Santral & Resepsiyon Hizmeti', 'personelSayisi': 10, 'iskurOzelIstihdamIzni': True, 'aylikSgkBorcsuzlukBelgesi': True}},
        {'label': 'Entegre Plaza Yönetimi ve Destek Personeli', 'values': {'isletmeKapsami': 'Bina, Plaza & Site Entegre Tesis Yönetimi', 'personelSayisi': 25, 'kidemTazminatiKarsiligi': True}}
    ]
}

# 38. Sigortacılık - Mali ve Hukuki Hizmetler
DATA['sigorta_finans'] = {
    'key': 'sigorta_finans',
    'name': 'Kurumsal Sigorta, Filo Kasko & Bağımsız Denetim İhalesi',
    'icon': 'Scale',
    'badgeText': '⚖️ Sigorta & Finans Şartnamesi',
    'description': 'Filo kasko/trafik poliçeleri, fabrika yangın/all-risk sigortası, KGK bağımsız denetimi ve mali müşavirlik şartnamesi.',
    'groups': {
        'teknik': {'title': '1. Sigorta / Denetim Türü & Teminat Limiti', 'desc': 'Kasko adet, kümülatif bina/makine bedeli ve denetim kapsamı'},
        'mevzuat': {'title': '2. SEDDK Ruhsatı & KGK Bağımsız Denetim Yetkisi', 'desc': 'Sigortacılık Düzenleme Kurumu ruhsatı ve Kamu Gözetimi Kurumu yetkisi'},
        'ticari': {'title': '3. Muafiyet Oranları, Hasarsızlık & Taksit', 'desc': 'Deprem muafiyeti, ikame araç teminatı ve 9 eşit taksit imkanı'}
    },
    'fields': [
        {'id': 'sigortaFinansTuru', 'label': 'Sigorta / Mali Hizmet Türü', 'type': 'select', 'group': 'teknik', 'options': ['Kurumsal Araç Filo Kasko & Trafik Poliçesi', 'Fabrika Yangın, Deprem, Terör & All-Risk Sigortası', 'Grup Sağlık & Ferdi Kaza Sigortası', 'KGK Yetkili Bağımsız Dış Denetim & Raporlama', 'Tam Tasdik Yeminli Mali Müşavirlik (YMM) Hizmeti'], 'defaultValue': 'Kurumsal Araç Filo Kasko & Trafik Poliçesi'},
        {'id': 'aracVeyaVarlikSayisi', 'label': 'Araç Sayısı veya Tesis Adedi', 'type': 'number', 'unit': 'Adet / Tesis', 'placeholder': 'Örn: 40', 'group': 'teknik', 'required': True, 'defaultValue': 40},
        {'id': 'toplamSigortaBedeliTl', 'label': 'Tahmini Toplam Sigorta / Varlık Bedeli', 'type': 'number', 'unit': '₺', 'placeholder': 'Örn: 80000000', 'group': 'teknik', 'defaultValue': 80000000},
        {'id': 'seddkYetkiliSigortaci', 'label': 'SEDDK Yetkili A Grubu Sigorta Şirketi Poliçesi Şartı', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kgkDenetimYetkisi', 'label': 'KGK (Kamu Gözetimi Kurumu) Bağımsız Denetim Yetki Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'sinirsizIhtiyariMaliMesuliyet', 'label': 'Kaskoda Sınırsız İMM (İhtiyari Mali Mesuliyet) Teminatı', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'ikameAracSegmenti', 'label': 'Arıza ve Kaza Durumunda C Segmenti Kesintisiz İkame Araç', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '50 Araçlık Filo Genişletilmiş Kasko ve Trafik', 'values': {'sigortaFinansTuru': 'Kurumsal Araç Filo Kasko & Trafik Poliçesi', 'aracVeyaVarlikSayisi': 50, 'seddkYetkiliSigortaci': True, 'sinirsizIhtiyariMaliMesuliyet': True, 'ikameAracSegmenti': True}},
        {'label': 'Fabrika Yangın ve Endüstriyel All-Risk Poliçesi', 'values': {'sigortaFinansTuru': 'Fabrika Yangın, Deprem, Terör & All-Risk Sigortası', 'aracVeyaVarlikSayisi': 1, 'toplamSigortaBedeliTl': 150000000}}
    ]
}

# 39. Menkul Mallar - Araç Satışı ve Hurda İhaleleri
DATA['hurda_arac_satisi'] = {
    'key': 'hurda_arac_satisi',
    'name': 'Hurda Malzeme, E-Atık & Kurum Taşıt Satışı İhalesi',
    'icon': 'Recycle',
    'badgeText': '🚗 Hurda & Taşıt Satış Şartnamesi',
    'description': 'Ekonomik ömrünü tamamlamış resmi taşıtlar, hurda demir/bakır metalleri ve kullanım dışı elektronik atık (e-atık) satış ihaleleri.',
    'groups': {
        'teknik': {'title': '1. Hurda / Taşıt Türü & Tahmini Tonaj/Adet', 'desc': 'Hurda metal sınıfı, araç markası, model yılı ve tahmini tonaj'},
        'mevzuat': {'title': '2. Çevre Bakanlığı Lisansı & Noter Devri', 'desc': 'Tehlikesiz atık geri kazanım lisansı, ÖTA teslim yeri ve noter satışı'},
        'ticari': {'title': '3. Peşin Bedel, Saha Tahliyesi & Kantar Tartımı', 'desc': 'Kantar tartımı, bedelin peşin yatırılması ve 15 günde saha temizliği'}
    },
    'fields': [
        {'id': 'satisTuru', 'label': 'Satışa Konu Malzeme Türü', 'type': 'select', 'group': 'teknik', 'options': ['Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı', 'Hurda DKP Demir, İmalat Artığı & Karışık Metal', 'Hurda Bakır, Alüminyum, Sarı & Kablo', 'Kullanım Dışı Elektronik Hurda (E-Atık / Bilgisayar / Kart)', 'Hurda Kağıt, Karton & Plastik Ambalaj'], 'defaultValue': 'Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı'},
        {'id': 'tahminiMiktarTonVeyaAdet', 'label': 'Tahmini Miktar (Ton veya Araç Adedi)', 'type': 'number', 'unit': 'Ton / Adet', 'placeholder': 'Örn: 20', 'group': 'teknik', 'required': True, 'defaultValue': 20},
        {'id': 'asgariMuhammenBedel', 'label': 'Asgari Muhammen (Başlangıç) Satış Bedeli', 'type': 'number', 'unit': '₺', 'placeholder': 'Örn: 450000', 'group': 'ticari', 'required': True, 'defaultValue': 450000},
        {'id': 'cevreLisansiGeriKazanim', 'label': 'Çevre Bakanlığı Hurda Metal / E-Atık Geri Kazanım Lisansı Zorunlu', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'otaBertarafYetkisi', 'label': 'Ömrünü Tamamlamış Araç (ÖTA) Lisanslı Teslim Yeri Belgesi', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': False},
        {'id': 'pesinOdemeVeNoterDevri', 'label': 'İhale Bedelinin Peşin Ödenmesi ve Masrafların Alıcıya Ait Olması', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'sahaTahliyeSuresi', 'label': 'Malzemenin Sahadan Tahliye Edilme Süresi', 'type': 'select', 'group': 'ticari', 'options': ['Sözleşme Sonrası 10 İş Günü İçinde', 'Sözleşme Sonrası 15 İş Günü İçinde', 'Sözleşme Sonrası 30 İş Günü İçinde'], 'defaultValue': 'Sözleşme Sonrası 15 İş Günü İçinde'}
    ],
    'quickPresets': [
        {'label': '10 Adet İkinci El Kurum Binek Araç Satışı', 'values': {'satisTuru': 'Hacizli / Kurum İkinci El Taşıt ve İş Makinesi Satışı', 'tahminiMiktarTonVeyaAdet': 10, 'asgariMuhammenBedel': 3500000, 'pesinOdemeVeNoterDevri': True}},
        {'label': '50 Ton Hurda DKP Demir ve İmalat Artığı Satışı', 'values': {'satisTuru': 'Hurda DKP Demir, İmalat Artığı & Karışık Metal', 'tahminiMiktarTonVeyaAdet': 50, 'cevreLisansiGeriKazanim': True}}
    ]
}

# 40. Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri
DATA['gayrimenkul_arsa'] = {
    'key': 'gayrimenkul_arsa',
    'name': 'Gayrimenkul, Arsa Satışı & Ticari Alan Kiralama İhalesi',
    'icon': 'Building2',
    'badgeText': '🏢 Gayrimenkul & Mülk Şartnamesi',
    'description': 'Kat karşılığı arsa yapımı, belediye/vakıf mülk satışları, ticari dükkan ve okul/hastane kantin kiralama standartları.',
    'groups': {
        'teknik': {'title': '1. Mülk Türü, İmar & Yüzölçümü', 'desc': 'İmar durumu, ada/parsel, arsa m² ve kapalı alan büyüklüğü'},
        'mevzuat': {'title': '2. Tapu Durumu & İhale Mevzuatı (2886/Devlet İhale)', 'desc': 'Müstakil tapu, şerh/ipotek durumu ve 2886 sayılı DİK uygunluğu'},
        'ticari': {'title': '3. Muhammen Bedel, Kat Karşılığı & Kira Süresi', 'desc': 'Asgari muhammen bedel, kat karşılığı paylaşım % ve yıllık kira'}
    },
    'fields': [
        {'id': 'gayrimenkulTuru', 'label': 'Gayrimenkul / İhale Türü', 'type': 'select', 'group': 'teknik', 'options': ['Arsa Satışı / Kat Karşılığı Yapım İhalesi', 'Ticari Dükkan, Mağaza & Ofis Satışı', 'Kantin, Çay Ocağı & Kafeterya Kiralama İhalesi', 'Tesis, Fabrika Binası & Depo Kiralama', 'Açık Otopark İşletmesi Kiralama'], 'defaultValue': 'Arsa Satışı / Kat Karşılığı Yapım İhalesi'},
        {'id': 'toplamAlanM2', 'label': 'Toplam Arsa / Kapalı Alan (m²)', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 2500', 'group': 'teknik', 'required': True, 'defaultValue': 2500},
        {'id': 'imarDurumu', 'label': 'İmar Durumu ve Emsal', 'type': 'select', 'group': 'teknik', 'options': ['Konut İmarı (Emsal: 1.50 - 2.00)', 'Ticaret + Konut Karma İmar (Emsal: 2.50)', 'Sanayi & Depolama Alanı İmarı (E: 1.00)', 'Kira İhalesi / Ticari İşyeri Mevcut', 'İmarsız / Tarla / Ham Arazi'], 'defaultValue': 'Ticaret + Konut Karma İmar (Emsal: 2.50)'},
        {'id': 'tapuDurumu', 'label': 'Tapu Mülkiyet Durumu', 'type': 'select', 'group': 'mevzuat', 'options': ['Müstakil Parsel (Sorunsuz Tek Tapu)', 'Hisseli Tapu (Şüyuulandırılmış)', 'Belediye / Kamu Mülkiyeti 2886 İhalesi'], 'defaultValue': 'Müstakil Parsel (Sorunsuz Tek Tapu)'},
        {'id': 'muhammenBedelTl', 'label': 'Asgari Muhammen Satış / Kira Bedeli', 'type': 'number', 'unit': '₺', 'placeholder': 'Örn: 15000000', 'group': 'ticari', 'required': True, 'defaultValue': 15000000},
        {'id': 'katKarsiligiAsgariOran', 'label': 'Arsa Sahibi Asgari Kat Karşılığı Payı', 'type': 'number', 'unit': '%', 'placeholder': 'Örn: 48', 'group': 'ticari', 'defaultValue': 48},
        {'id': 'kiraSuresiYil', 'label': 'Kiralama İhalesi Süresi', 'type': 'select', 'group': 'ticari', 'options': ['Satış İhalesi (Mülkiyet Devri)', '3 Yıl Kiralama Sözleşmesi', '5 Yıl Kiralama Sözleşmesi', '10 Yıl İntifa / Kiralama'], 'defaultValue': 'Satış İhalesi (Mülkiyet Devri)'}
    ],
    'quickPresets': [
        {'label': '3.000 m² Kat Karşılığı Konut+Ticaret Arsa İhalesi', 'values': {'gayrimenkulTuru': 'Arsa Satışı / Kat Karşılığı Yapım İhalesi', 'toplamAlanM2': 3000, 'imarDurumu': 'Ticaret + Konut Karma İmar (Emsal: 2.50)', 'katKarsiligiAsgariOran': 50, 'tapuDurumu': 'Müstakil Parsel (Sorunsuz Tek Tapu)'}},
        {'label': 'Hastane/Okul Kantini 3 Yıllık Kiralama İhalesi', 'values': {'gayrimenkulTuru': 'Kantin, Çay Ocağı & Kafeterya Kiralama İhalesi', 'toplamAlanM2': 120, 'muhammenBedelTl': 360000, 'kiraSuresiYil': '3 Yıl Kiralama Sözleşmesi'}}
    ]
}
