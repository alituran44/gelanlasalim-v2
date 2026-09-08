import fs from 'node:fs'
import path from 'node:path'
import type { TenderItem } from './tendersStore'

export interface BidItem {
  id: string
  tenderId: string
  tenderTitle: string
  ownerEmail?: string
  firma: string
  fiyat: string
  sure?: string
  puan?: number
  durum?: string // 'bekliyor' | 'onaylandi' | 'reddedildi' | 'degerlendirmede'
  yetkili?: string
  telefon?: string
  eposta?: string
  vergiDairesi?: string
  adres?: string
  notum?: string
  tarih?: string
  createdAt?: string
  pazarlikGecmisi?: any[]
  isMine?: boolean
  [key: string]: any
}

declare global {
  // eslint-disable-next-line no-var
  var __SHARED_BIDS__: BidItem[] | undefined
}

// 🎯 Baseline Bids for Initial Seed Tenders (8, 14, 6, 19, 11, 7, 12, 15, 8, 9, 5)
const BASELINE_BIDS: BidItem[] = [
  // IHC-2026-901 (8 Teklif - Lider: 17.850.000 ₺)
  { id: 'TKF-901-1', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Akdeniz Çelik Yapı Sanayi A.Ş.', fiyat: '17.850.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Mustafa Demir', telefon: '0532 441 82 90', eposta: 'teklif@akdenizcelik.com.tr', adres: 'Balıkesir OSB 4. Cad. No:12' },
  { id: 'TKF-901-2', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Kalyon Ağır Sanayi A.Ş.', fiyat: '17.920.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Sedat Öz', telefon: '0533 210 94 11', eposta: 'info@kalyonsanayi.com.tr', adres: 'Bursa Nilüfer OSB' },
  { id: 'TKF-901-3', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Balıkesir Prefabrik ve Çelik Ltd.', fiyat: '18.100.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Hasan Yılmaz', telefon: '0542 334 12 77', eposta: 'info@balikesirprefabrik.com' },
  { id: 'TKF-901-4', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Ege Endüstriyel Montaj A.Ş.', fiyat: '18.250.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Orhan Kaya', telefon: '0535 889 01 22', eposta: 'projeler@egemontaj.com' },
  { id: 'TKF-901-5', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Anadolu Metal Konstrüksiyon Ltd.', fiyat: '18.300.000 ₺', puan: 4.6, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Kemal Tekin', telefon: '0530 671 22 99', eposta: 'teklif@anadolumetal.com' },
  { id: 'TKF-901-6', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Marmara Çatı & Sandviç Panel A.Ş.', fiyat: '18.400.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Ayhan Kurt', telefon: '0541 220 89 44', eposta: 'satis@marmarapanel.com' },
  { id: 'TKF-901-7', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Özdemirler Çelik Yapı Ltd.', fiyat: '18.450.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Recep Özdemir', telefon: '0538 991 30 14', eposta: 'info@ozdemirlercelik.com' },
  { id: 'TKF-901-8', tenderId: 'IHC-2026-901', tenderTitle: 'Balıkesir OSB Çelik Konstrüksiyon Fabrika Binası & Çatı Kaplama Yapım İşi', firma: 'Atlas Yapı Mühendislik A.Ş.', fiyat: '18.500.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Barış Koç', telefon: '0532 770 12 30', eposta: 'ihaleler@atlasyapi.com.tr' },

  // IHC-2026-902 (14 Teklif - Lider: 3.890.000 ₺)
  { id: 'TKF-902-1', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Ege Kargo & Filo Lojistik A.Ş.', fiyat: '3.890.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Ahmet Karaca' },
  { id: 'TKF-902-2', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'TransMarmara Lojistik Ltd.', fiyat: '3.920.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Cemil Doğan' },
  { id: 'TKF-902-3', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Körfez Ağır Nakliyat A.Ş.', fiyat: '3.950.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Murat Şahin' },
  { id: 'TKF-902-4', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Çanakkale Liman Taşımacılık', fiyat: '3.980.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Selçuk Yıldız' },
  { id: 'TKF-902-5', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Ulusal Filo & Kargo A.Ş.', fiyat: '4.020.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Okan Aslan' },
  { id: 'TKF-902-6', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Balıkesir Nakliyat Kooperatifi', fiyat: '4.050.000 ₺', puan: 4.6, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Kemal Gül' },
  { id: 'TKF-902-7', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'İzmir Liman Nakliyat A.Ş.', fiyat: '4.080.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Serhat Çetin' },
  { id: 'TKF-902-8', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Batı Lojistik Hizmetleri Ltd.', fiyat: '4.100.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Volkan Polat' },
  { id: 'TKF-902-9', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Kocaeli Ağır Yük Taşımacılığı', fiyat: '4.120.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Bülent Eren' },
  { id: 'TKF-902-10', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Trakya Ekspres Filo Ltd.', fiyat: '4.140.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Uğur Keskin' },
  { id: 'TKF-902-11', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Güven Taşımacılık A.Ş.', fiyat: '4.150.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Ali Tan' },
  { id: 'TKF-902-12', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Rota Nakliye & Depolama Ltd.', fiyat: '4.170.000 ₺', puan: 4.6, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Levent Şen' },
  { id: 'TKF-902-13', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Kaya Filo Taşımacılık', fiyat: '4.190.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Sedat Kaya' },
  { id: 'TKF-902-14', tenderId: 'IHC-2026-902', tenderTitle: 'Marmara & Ege Bölgesi 15.000 Tonluk Endüstriyel Hammadde Nakliye & Lojistik İhalesi', firma: 'Hedef Lojistik Çözümleri A.Ş.', fiyat: '4.200.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Emre Çakır' },

  // IHC-2026-903 (6 Teklif - Lider: 8.450.000 ₺)
  { id: 'TKF-903-1', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'Tezmaksan Makine ve Robotik A.Ş.', fiyat: '8.450.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Koray Başer' },
  { id: 'TKF-903-2', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'Bursa Takım Tezgahları Ltd.', fiyat: '8.520.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Caner Dural' },
  { id: 'TKF-903-3', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'Anadolu CNC Teknolojileri A.Ş.', fiyat: '8.600.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Metin Şen' },
  { id: 'TKF-903-4', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'İleri Otomasyon & Robotik Ltd.', fiyat: '8.700.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Harun Vural' },
  { id: 'TKF-903-5', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'Marmara Torna & Freze Sistemleri', fiyat: '8.800.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Gökhan Yavuz' },
  { id: 'TKF-903-6', tenderId: 'IHC-2026-903', tenderTitle: 'Endüstriyel 5 Eksenli CNC İşleme Merkezi & Talaşlı İmalat Robotik Hücre Alımı', firma: 'Sanayi Tezgahları İthalat Ltd.', fiyat: '8.880.000 ₺', puan: 4.6, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Tarık Akın' },

  // IHC-2026-904 (19 Teklif - Lider: 1.420.000 ₺)
  { id: 'TKF-904-1', tenderId: 'IHC-2026-904', tenderTitle: '100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği', firma: 'İzmir Koli & Ambalaj Sanayi A.Ş.', fiyat: '1.420.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Deniz Sarp' },
  { id: 'TKF-904-2', tenderId: 'IHC-2026-904', tenderTitle: '100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği', firma: 'Marmara Oluklu Mukavva Ltd.', fiyat: '1.440.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Onur Acar' },
  { id: 'TKF-904-3', tenderId: 'IHC-2026-904', tenderTitle: '100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği', firma: 'Ege Karton & Matbaacılık A.Ş.', fiyat: '1.460.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Selin Yıldırım' },
  { id: 'TKF-904-4', tenderId: 'IHC-2026-904', tenderTitle: '100.000 Adet Ofset Baskılı Oluklu Mukavva Koli & İhracat Ambalajı Tedariği', firma: 'Bursa Kutu Sanayi Ltd.', fiyat: '1.480.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Kadir Balcı' },

  // IHC-2026-905 (11 Teklif - Lider: 26.400.000 ₺)
  { id: 'TKF-905-1', tenderId: 'IHC-2026-905', tenderTitle: 'Bandırma 2.5 MW Endüstriyel Çatı Güneş Enerji Santrali (GES) EPC Kurulumu', firma: 'SolarTürk Enerji & GES Kurulum A.Ş.', fiyat: '26.400.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Mühendis Tolga Can' },
  { id: 'TKF-905-2', tenderId: 'IHC-2026-905', tenderTitle: 'Bandırma 2.5 MW Endüstriyel Çatı Güneş Enerji Santrali (GES) EPC Kurulumu', firma: 'GüneşTeknik Mühendislik Ltd.', fiyat: '26.550.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Burak Yalçın' },
  { id: 'TKF-905-3', tenderId: 'IHC-2026-905', tenderTitle: 'Bandırma 2.5 MW Endüstriyel Çatı Güneş Enerji Santrali (GES) EPC Kurulumu', firma: 'Ege Solar Enerji Sistemleri A.Ş.', fiyat: '26.700.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Serhat Tunç' },

  // IHC-2026-906 (7 Teklif - Lider: 3.050.000 ₺)
  { id: 'TKF-906-1', tenderId: 'IHC-2026-906', tenderTitle: 'Kurumsal Bulut Sunucu Altyapısı, Firewall Donanımı & 3 Yıllık Siber Güvenlik Hizmeti', firma: 'Radore Veri Merkezi & Bilişim A.Ş.', fiyat: '3.050.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Alper Kurt' },
  { id: 'TKF-906-2', tenderId: 'IHC-2026-906', tenderTitle: 'Kurumsal Bulut Sunucu Altyapısı, Firewall Donanımı & 3 Yıllık Siber Güvenlik Hizmeti', firma: 'DorukNet Siber Güvenlik Hizmetleri', fiyat: '3.120.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Sinan Ersoy' },

  // IHC-2026-907 (12 Teklif - Lider: 13.900.000 ₺)
  { id: 'TKF-907-1', tenderId: 'IHC-2026-907', tenderTitle: '1.200 Ton Sertifikalı Ekmeklik Buğday & Endüstriyel Un Tedarik İhalesi', firma: 'Trakya Un Fabrikaları Birliği A.Ş.', fiyat: '13.900.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Halil İbrahim Arslan' },
  { id: 'TKF-907-2', tenderId: 'IHC-2026-907', tenderTitle: '1.200 Ton Sertifikalı Ekmeklik Buğday & Endüstriyel Un Tedarik İhalesi', firma: 'Çanakkale Zahireciler Kooperatifi', fiyat: '13.980.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Nuri Sevim' },

  // IHC-2026-908 (15 Teklif - Lider: 6.120.000 ₺)
  { id: 'TKF-908-1', tenderId: 'IHC-2026-908', tenderTitle: 'Şehir Hastaneleri 2026 Yılı Tıbbi Sarf, Cerrahi Setler & Sterilizasyon Malzemeleri', firma: 'Bıçakçılar Tıbbi Cihazlar A.Ş.', fiyat: '6.120.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Ecz. Serkan Güler' },
  { id: 'TKF-908-2', tenderId: 'IHC-2026-908', tenderTitle: 'Şehir Hastaneleri 2026 Yılı Tıbbi Sarf, Cerrahi Setler & Sterilizasyon Malzemeleri', firma: 'Anadolu Medikal Sağlık Ürünleri Ltd.', fiyat: '6.180.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Berna Çelik' },

  // IHC-2026-909 (8 Teklif - Lider: 11.850.000 ₺)
  { id: 'TKF-909-1', tenderId: 'IHC-2026-909', tenderTitle: '300.000 Litre Euro Dizel Motorin & Madeni Yağ Filo Tedarik İhalesi', firma: 'Petrol Ofisi Kurumsal Dağıtım A.Ş.', fiyat: '11.850.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Cengizhan Güven' },
  { id: 'TKF-909-2', tenderId: 'IHC-2026-909', tenderTitle: '300.000 Litre Euro Dizel Motorin & Madeni Yağ Filo Tedarik İhalesi', firma: 'OPET Ticari Yakıt Masası', fiyat: '11.950.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Zafer Bayraktar' },

  // IHC-2026-910 (9 Teklif - Lider: 1.890.000 ₺ - MOBİLYA İHALESİ)
  { id: 'TKF-910-1', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Bürotime Kurumsal Ofis Mobilyaları A.Ş.', fiyat: '1.890.000 ₺', puan: 5.0, durum: 'bekliyor', tarih: '05.09.2026', yetkili: 'Tasarımcı Erdem Soylu', telefon: '0312 395 14 20', eposta: 'proje@burotime.com', adres: 'Ankara OSTİM Mobilyacılar Sitesi' },
  { id: 'TKF-910-2', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Koleksiyon Mobilya Sanayi A.Ş.', fiyat: '1.920.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Merve Çağlar', telefon: '0212 284 10 00', eposta: 'ihale@koleksiyon.com.tr' },
  { id: 'TKF-910-3', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Goldsit Büro Mobilyaları Ltd.', fiyat: '1.950.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '04.09.2026', yetkili: 'Süleyman Koç', telefon: '0224 443 12 30', eposta: 'bursa@goldsit.com' },
  { id: 'TKF-910-4', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Tuna Ofis & Ergonomi Sistemleri A.Ş.', fiyat: '1.980.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Ali Kemal Tuna' },
  { id: 'TKF-910-5', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Bürosan Endüstriyel Donanım Ltd.', fiyat: '2.010.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '03.09.2026', yetkili: 'Fatih Dağ' },
  { id: 'TKF-910-6', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Modoko Kurumsal Proje Grubu', fiyat: '2.030.000 ₺', puan: 4.9, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Yasin Karaca' },
  { id: 'TKF-910-7', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Ankara Siteler Ahşap & Metal Ltd.', fiyat: '2.050.000 ₺', puan: 4.6, durum: 'bekliyor', tarih: '02.09.2026', yetkili: 'Hikmet Öz' },
  { id: 'TKF-910-8', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'ErgoDesign Çalışma İstasyonları A.Ş.', fiyat: '2.070.000 ₺', puan: 4.8, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Oğuzhan Çetinkaya' },
  { id: 'TKF-910-9', tenderId: 'IHC-2026-910', tenderTitle: '250 Takım Ergonomik Ofis Çalışma Masası, Koltuk & Arşiv Dolapları Alımı', firma: 'Norm Ofis Çelik Dolap Sistemleri', fiyat: '2.090.000 ₺', puan: 4.7, durum: 'bekliyor', tarih: '01.09.2026', yetkili: 'Cihan Altın' },

  // IHC-2026-900 (5 Teklif - Kapalı İhale Örneği)
  { id: 'TKF-900-1', tenderId: 'IHC-2026-900', tenderTitle: 'Kocaeli OSB Endüstriyel Atık Su Arıtma Tesisi Bakım & Filtre Değişim İşi', firma: 'ArıtmaTek Mühendislik A.Ş.', fiyat: '1.380.000 ₺', puan: 5.0, durum: 'onaylandi', tarih: '25.08.2026' }
]

function getBidsStoragePath(): string {
  try {
    const tmpDir = process.env.TEMP || process.env.TMP || '/tmp'
    return path.join(tmpDir, 'gelanlasalim_shared_bids.json')
  } catch {
    return ''
  }
}

function tryReadBidsFromDisk(): BidItem[] | null {
  const filePath = getBidsStoragePath()
  if (!filePath) return null
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    // ignore
  }
  return null
}

function trySaveBidsToDisk(bids: BidItem[]) {
  const filePath = getBidsStoragePath()
  if (!filePath) return
  try {
    fs.writeFileSync(filePath, JSON.stringify(bids), 'utf-8')
  } catch (e) {
    // ignore on read-only environments
  }
}

export function sanitizeInput(str: string | undefined): string {
  if (!str) return ''
  return String(str)
    .replace(/[<>]/g, '') // strip potential HTML tags
    .trim()
}

export function validateBidSubmission(
  tender: TenderItem | undefined,
  bidData: { eposta?: string; fiyat: string; firma?: string; bidderName?: string }
): { valid: boolean; error?: string; statusCode?: number } {
  if (!tender) {
    return { valid: false, error: 'Teklif verilmek istenen ihale bulunamadı.', statusCode: 404 }
  }

  // Check if tender is closed or completed
  if (tender.durum === 'closed' || tender.durum === 'mutabakat' || tender.durum === 'anlasildi') {
    return {
      valid: false,
      error: `"${tender.baslik}" ihalesi sonuçlandığı veya mutabakat sağlandığı için yeni teklif verilemez.`,
      statusCode: 400
    }
  }

  // Check if tender deadline passed
  if (tender.endDate) {
    const endMs = new Date(tender.endDate).getTime()
    if (endMs <= Date.now()) {
      return {
        valid: false,
        error: `"${tender.baslik}" ihalesinin teklif toplama süresi dolmuştur.`,
        statusCode: 400
      }
    }
  }

  // Prevent self-bidding
  const bidderEmail = (bidData.eposta || '').trim().toLowerCase()
  const ownerEmail = (tender.ownerEmail || '').trim().toLowerCase()
  if (bidderEmail && ownerEmail && bidderEmail === ownerEmail) {
    return {
      valid: false,
      error: 'Kendi açtığınız bir ihaleye teklif sunamazsınız.',
      statusCode: 403
    }
  }

  // Validate price
  const rawNum = String(bidData.fiyat).replace(/\D/g, '')
  const priceNum = parseInt(rawNum, 10)
  if (isNaN(priceNum) || priceNum <= 0) {
    return {
      valid: false,
      error: 'Lütfen geçerli bir teklif tutarı giriniz.',
      statusCode: 400
    }
  }

  return { valid: true }
}

export function getAllBids(): BidItem[] {
  if (!globalThis.__SHARED_BIDS__) {
    const diskBids = tryReadBidsFromDisk()
    if (diskBids && diskBids.length > 0) {
      // Merge disk bids with any missing baseline bids
      const existingIds = new Set(diskBids.map(b => b.id))
      const missingBaselines = BASELINE_BIDS.filter(b => !existingIds.has(b.id))
      globalThis.__SHARED_BIDS__ = [...diskBids, ...missingBaselines]
    } else {
      globalThis.__SHARED_BIDS__ = [...BASELINE_BIDS]
    }
  }
  return globalThis.__SHARED_BIDS__
}

export function addBid(bid: BidItem): BidItem {
  const list = getAllBids()
  const existingIdx = list.findIndex(b => b.id === bid.id)
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...bid }
  } else {
    list.unshift(bid)
  }
  globalThis.__SHARED_BIDS__ = list
  trySaveBidsToDisk(list)
  return bid
}

export function getBidsForTender(tenderId: string): BidItem[] {
  return getAllBids().filter(b => b.tenderId === tenderId)
}

export function updateBidStatus(bidId: string, status: string): boolean {
  const list = getAllBids()
  const target = list.find(b => b.id === bidId)
  if (target) {
    target.durum = status
    globalThis.__SHARED_BIDS__ = list
    trySaveBidsToDisk(list)
    return true
  }
  return false
}

export function removeBid(bidId: string): boolean {
  let list = getAllBids()
  const initLen = list.length
  list = list.filter(b => b.id !== bidId)
  globalThis.__SHARED_BIDS__ = list
  trySaveBidsToDisk(list)
  return list.length < initLen
}
