# -*- coding: utf-8 -*-
# Sektörler 41 - 43 (Özelleşmiş Gayrimenkul & Arsa Alt Sektörleri) ve Geriye Uyumlu Alias'lar
DATA = {}

# 41. Arsa, Arazi & Kat Karşılığı İhaleleri (Özel)
DATA['arsa_arazi'] = {
    'key': 'arsa_arazi',
    'name': 'Arsa, Arazi & Kat Karşılığı İhalesi',
    'icon': 'MapPin',
    'badgeText': '🗺️ Arsa & İmar Şartnamesi',
    'description': 'Kat karşılığı konut/ticari inşaat, arsa satışı, hasılat paylaşımı ve kentsel dönüşüm alanları için imar çapı, emsal ve tapu kriterleri.',
    'groups': {
        'teknik': {'title': '1. Parsel Büyüklüğü & İmar Parametreleri', 'desc': 'Ada/parsel, yüzölçümü, imar fonksiyonu, KAKS (Emsal) ve TAKS'},
        'mevzuat': {'title': '2. Tapu Kaydı & Hukuki Durum', 'desc': 'Müstakil/hisseli tapu, şerh-ipotek durumu ve terk şartları'},
        'ticari': {'title': '3. Kat Karşılığı Oranı & Teminat Şartı', 'desc': 'Arsa sahibi asgari paylaşım oranı ve müteahhit teminatı'}
    },
    'fields': [
        {'id': 'adaParselNo', 'label': 'Ada / Parsel Numarası', 'type': 'text', 'placeholder': 'Örn: 1045 Ada, 12 Parsel', 'group': 'teknik', 'required': True, 'defaultValue': '1045 Ada, 12 Parsel'},
        {'id': 'toplamYuzolcumuM2', 'label': 'Toplam Arsa Yüzölçümü', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 3200', 'group': 'teknik', 'required': True, 'defaultValue': 3200},
        {'id': 'imarDurumu', 'label': 'İmar Fonksiyonu', 'type': 'select', 'group': 'teknik', 'options': ['Konut Alanı İmarı', 'Ticaret + Konut Karma İmar (TİCK)', 'Sanayi & Depolama Alanı İmarı', 'Turizm & Otel Alanı', 'Kentsel Dönüşüm / Rezerv Alan'], 'defaultValue': 'Ticaret + Konut Karma İmar (TİCK)'},
        {'id': 'kaksEmsalOrani', 'label': 'KAKS / Emsal Oranı', 'type': 'select', 'group': 'teknik', 'options': ['E: 1.00', 'E: 1.50', 'E: 1.80', 'E: 2.00', 'E: 2.50', 'E: 3.00+'], 'defaultValue': 'E: 2.00'},
        {'id': 'gabariHmax', 'label': 'Gabari (Maksimum Bina Yüksekliği)', 'type': 'select', 'group': 'teknik', 'options': ['Hmax: 12.50m (4 Kat)', 'Hmax: 15.50m (5 Kat)', 'Hmax: 24.50m (8 Kat)', 'Serbest (Yüksek Yapı)'], 'defaultValue': 'Hmax: 15.50m (5 Kat)'},
        {'id': 'tapuMulkDurumu', 'label': 'Tapu & Mülkiyet Statüsü', 'type': 'select', 'group': 'mevzuat', 'options': ['Müstakil Tapu (Tek Malik)', 'Hisseli Tapu (Tüm Hissedarlar Muvafakatli)', 'Şüyuulandırılmış Parsel'], 'defaultValue': 'Müstakil Tapu (Tek Malik)'},
        {'id': 'terklerYapildi', 'label': 'Yola ve Yeşile Terkleri Yapılmış / Net Parsel', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'asgariKatKarsiligiOrani', 'label': 'Asgari Kat Karşılığı Paylaşım Oranı', 'type': 'number', 'unit': '%', 'placeholder': 'Örn: 50', 'group': 'ticari', 'required': True, 'defaultValue': 50},
        {'id': 'insaatTeminatMektubu', 'label': 'Müteahhitten İnşaat Tamamlama Teminat Mektubu Zorunlu', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': '3.200 m² %50 Kat Karşılığı Karma İmarlı Arsa', 'values': {'adaParselNo': '1045 Ada, 12 Parsel', 'toplamYuzolcumuM2': 3200, 'imarDurumu': 'Ticaret + Konut Karma İmar (TİCK)', 'kaksEmsalOrani': 'E: 2.00', 'asgariKatKarsiligiOrani': 50, 'tapuMulkDurumu': 'Müstakil Tapu (Tek Malik)'}},
        {'label': '5.000 m² Sanayi & Depolama Parseli Satışı', 'values': {'adaParselNo': '2030 Ada, 4 Parsel', 'toplamYuzolcumuM2': 5000, 'imarDurumu': 'Sanayi & Depolama Alanı İmarı', 'kaksEmsalOrani': 'E: 1.50', 'asgariKatKarsiligiOrani': 0}}
    ]
}

# 42. Konut, Daire & Toplu Konut Projeleri (Özel)
DATA['konut_daire'] = {
    'key': 'konut_daire',
    'name': 'Konut, Daire & Toplu Konut İhalesi',
    'icon': 'Home',
    'badgeText': '🏠 Konut & Daire Şartnamesi',
    'description': 'Daire, rezidans, villa ve lojman toplu satın alma, kiralama ve satış ihaleleri için oda sayısı, metrekare ve iskân kriterleri.',
    'groups': {
        'teknik': {'title': '1. Konut Özellikleri & Metrekare', 'desc': 'Oda planı (2+1, 3+1 vb.), net/brüt alan, kat ve ısınma'},
        'mevzuat': {'title': '2. İskân & Deprem Yönetmeliği Uygunluğu', 'desc': 'Yapı kullanım izin belgesi (iskân), kat mülkiyeti ve DASK'},
        'ticari': {'title': '3. Fiyatlandırma, Teslimat & Aidat Durumu', 'desc': 'KDV oranı, tapu devir masrafı ve teslime hazır durumu'}
    },
    'fields': [
        {'id': 'odaSayisi', 'label': 'Oda Sayısı ve Dağılımı', 'type': 'select', 'group': 'teknik', 'options': ['1+1 Rezidans / Daire', '2+1 Standart Daire', '3+1 Aile Tipi Daire', '4+1 Geniş Daire', 'Müstakil Villa / Dubleks'], 'defaultValue': '3+1 Aile Tipi Daire'},
        {'id': 'netMetrekare', 'label': 'Net Kullanım Alanı', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 125', 'group': 'teknik', 'required': True, 'defaultValue': 125},
        {'id': 'brutMetrekare', 'label': 'Brüt Kullanım Alanı', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 148', 'group': 'teknik', 'defaultValue': 148},
        {'id': 'binaYasi', 'label': 'Bina Yaşı', 'type': 'select', 'group': 'teknik', 'options': ['Sıfır Bina (İlk Kullanım)', '1 - 5 Yaşında', '6 - 10 Yaşında', '11 - 15 Yaşında'], 'defaultValue': 'Sıfır Bina (İlk Kullanım)'},
        {'id': 'isinmaTipi', 'label': 'Isınma & İklimlendirme', 'type': 'select', 'group': 'teknik', 'options': ['Bireysel Doğalgaz Kombi & Yerden Isıtma', 'Merkezi Sistem (Isı Pay Ölçer)', 'VRF / Isı Pompası Sistemi'], 'defaultValue': 'Bireysel Doğalgaz Kombi & Yerden Isıtma'},
        {'id': 'tapuMulkDurumu', 'label': 'Tapu Durumu', 'type': 'select', 'group': 'mevzuat', 'options': ['Kat Mülkiyetli (İskânlı & Ruhsatlı)', 'Kat İrtifaklı', 'Tahsisli Kurum Lojmanı'], 'defaultValue': 'Kat Mülkiyetli (İskânlı & Ruhsatlı)'},
        {'id': 'depremYonetmeligi2018', 'label': '2018 Türkiye Bina Deprem Yönetmeliğine Tam Uygunluk', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'kapaliOtoparkVeDepo', 'label': 'Tahsisli Kapalı Otopark ve Bodrum Depo Alanı Mevcut', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True},
        {'id': 'hemenTeslimOturumaHazir', 'label': 'Daire Boş ve Hemen Teslime Hazır', 'type': 'boolean', 'group': 'ticari', 'defaultValue': True}
    ],
    'quickPresets': [
        {'label': 'Sıfır 3+1 125 m² İskânlı Daire Satışı', 'values': {'odaSayisi': '3+1 Aile Tipi Daire', 'netMetrekare': 125, 'brutMetrekare': 148, 'binaYasi': 'Sıfır Bina (İlk Kullanım)', 'tapuMulkDurumu': 'Kat Mülkiyetli (İskânlı & Ruhsatlı)', 'depremYonetmeligi2018': True}},
        {'label': 'Toplu Kurumsal Lojman Alımı (10 Adet 2+1)', 'values': {'odaSayisi': '2+1 Standart Daire', 'netMetrekare': 90, 'brutMetrekare': 110, 'binaYasi': 'Sıfır Bina (İlk Kullanım)'}}
    ]
}

# 43. Ticari Gayrimenkul, Plaza, Depo & Dükkan (Özel)
DATA['ticari_gayrimenkul'] = {
    'key': 'ticari_gayrimenkul',
    'name': 'Ticari Gayrimenkul, Plaza & Depo İhalesi',
    'icon': 'Building2',
    'badgeText': '🏢 Ticari Mülk & Depo Şartnamesi',
    'description': 'Plaza ofis katları, cadde mağazaları, lojistik depolar ve fabrika binaları için tavan yüksekliği, rampa ve güç kriterleri.',
    'groups': {
        'teknik': {'title': '1. Ticari Nitelik, Alan & Tavan Yüksekliği', 'desc': 'Kullanım amacı, kapalı alan m², aks aralığı ve tavan yüksekliği h'},
        'mevzuat': {'title': '2. İtfaiye Uygunluk & Sanayi/Ticaret Ruhsatı', 'desc': 'İşyeri açma ruhsatı, itfaiye yangın raporu ve GSM 1. sınıf uygunluğu'},
        'ticari': {'title': '3. Tır Yanaşma, Elektrik Gücü & Kira Koşulları', 'desc': 'Hidrolik rampa adedi, trafo kurulu gücü kW ve kira artış modeli'}
    },
    'fields': [
        {'id': 'ticariNitelik', 'label': 'Ticari Gayrimenkul Niteliği', 'type': 'select', 'group': 'teknik', 'options': ['Lojistik Depo & Antrepo Binası', 'Üretim / İmalat Fabrika Binası', 'A+ Plaza Bağımsız Ofis Katı', 'Ana Cadde Cepheli Kurumsal Mağaza / Dükkan', 'Soğuk Hava Deposu Tesisi'], 'defaultValue': 'Lojistik Depo & Antrepo Binası'},
        {'id': 'kapaliAlanM2', 'label': 'Toplam Net Kapalı Alan', 'type': 'number', 'unit': 'm²', 'placeholder': 'Örn: 4500', 'group': 'teknik', 'required': True, 'defaultValue': 4500},
        {'id': 'tavanYuksekligiMetre', 'label': 'Net Tavan Yüksekliği (h)', 'type': 'select', 'group': 'teknik', 'options': ['h: 10.50m - 12.00m (Lojistik Yüksek Tavan)', 'h: 7.50m - 9.00m (Standart Depo/Üretim)', 'h: 4.00m - 5.50m (Mağaza / Showroom)', 'h: 3.20m (Ofis Katı)'], 'defaultValue': 'h: 10.50m - 12.00m (Lojistik Yüksek Tavan)'},
        {'id': 'sanayiElektrigiGucuKw', 'label': 'Mevcut Trafo / Elektrik Kurulu Gücü', 'type': 'number', 'unit': 'kW / kVA', 'placeholder': 'Örn: 630', 'group': 'teknik', 'defaultValue': 630},
        {'id': 'itfaiyeRaporuUygun', 'label': 'Belediye İtfaiye Yangın Güvenlik Raporu Mevcut', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'isyeriAcmaRuhsatiUygun', 'label': 'Sanayi / Ticaret İşyeri Açma ve Çalışma Ruhsatına Haiz', 'type': 'boolean', 'group': 'mevzuat', 'defaultValue': True},
        {'id': 'tirYuklemeRampasiAdedi', 'label': 'Körüklü Hidrolik Tır Yükleme Rampası Adedi', 'type': 'number', 'unit': 'Rampa', 'placeholder': 'Örn: 6', 'group': 'ticari', 'defaultValue': 6},
        {'id': 'zeminYukKapasitesi', 'label': 'Zemin Taşıma Kapasitesi (Ton/m²)', 'type': 'select', 'group': 'ticari', 'options': ['5 Ton/m² Endüstriyel Helikopter Zemin', '7.5 Ton/m² Ağır Yük Zemin', 'Standart Ticari Zemin'], 'defaultValue': '5 Ton/m² Endüstriyel Helikopter Zemin'}
    ],
    'quickPresets': [
        {'label': '5.000 m² 12m Tavanlı Lojistik Depo Kiralama', 'values': {'ticariNitelik': 'Lojistik Depo & Antrepo Binası', 'kapaliAlanM2': 5000, 'tavanYuksekligiMetre': 'h: 10.50m - 12.00m (Lojistik Yüksek Tavan)', 'tirYuklemeRampasiAdedi': 6, 'itfaiyeRaporuUygun': True}},
        {'label': '1.000 m² Cadde Mağazası Satışı', 'values': {'ticariNitelik': 'Ana Cadde Cepheli Kurumsal Mağaza / Dükkan', 'kapaliAlanM2': 1000, 'tavanYuksekligiMetre': 'h: 4.00m - 5.50m (Mağaza / Showroom)'}}
    ]
}

# Aliases are handled during compilation from p1/p2/p3/p4/p5/p6
