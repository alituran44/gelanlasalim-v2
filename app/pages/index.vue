<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  MapPin,
  Building2,
  Clock3,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  BadgeCheck,
  LockKeyhole,
  Scale,
  Globe2,
  Handshake,
  CheckCircle2,
  Plus
} from 'lucide-vue-next'

// Nuxt Layout Meta
definePageMeta({
  layout: 'public'
})

/* =========================================================
   GENEL DURUMLAR & TABLAR
========================================================= */
const activeAudience = ref<'buyer' | 'supplier'>('buyer')
const openFaq = ref<number | null>(0)
const showCookieConsent = ref(true)

// Tasarruf Hesaplama Modülü
const annualVolume = ref(5000000)
const savingsRate = 0.142
const calculatedSavings = computed(() => Math.round(annualVolume.value * savingsRate))
const savedHours = computed(() => Math.round((annualVolume.value / 100000) * 1.5))
const connectedSuppliersCount = computed(() => Math.round((annualVolume.value / 1000000) * 8 + 32))

// İletişim Formu Modülü
const contactMethod = ref<'email' | 'phone'>('email')
const contactEmail = ref('')
const contactPhone = ref('')
const contactMessage = ref('')
const contactSubmitted = ref(false)
const contactError = ref('')

function submitContactForm() {
  if (contactMethod.value === 'email' && !contactEmail.value) {
    contactError.value = 'Lütfen kurumsal e-posta adresinizi girin.'
    return
  }
  if (contactMethod.value === 'phone' && !contactPhone.value) {
    contactError.value = 'Lütfen telefon numaranızı girin.'
    return
  }
  contactSubmitted.value = true
  contactError.value = ''
  
  setTimeout(() => {
    contactSubmitted.value = false
    contactEmail.value = ''
    contactPhone.value = ''
    contactMessage.value = ''
    alert('Mesajınız başarıyla iletildi. Ekibimiz en kısa sürede dönüş yapacaktır.')
  }, 1200)
}

/* =========================================================
   FİLTRE STATE'LERİ
========================================================= */
const explorerSearch = ref('')
const selectedCity = ref('')
const selectedCat = ref('')
const selectedSubcategory = ref('')
const selectedSector = ref('')
const selectedType = ref('')
const selectedMethod = ref('')
const selectedPricingType = ref('')

const expandedCategory = ref<string | null>(null)
const expandedFilterSection = ref<string | null>('categories')

const expandedTenderId = ref<number | null>(null)
const activeDetailTab = ref<string | null>(null)

/* =========================================================
   SABİT VERİ TANIMLARI
========================================================= */
const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

const detailedCategories = [
  {
    name: 'İnşaat, Altyapı ve Yapı İşleri',
    count: 248,
    children: ['İnşaat Malzemeleri', 'Tadilat ve Renovasyon', 'Taahhüt İşleri', 'Yapı ve Yıkım İşleri']
  },
  {
    name: 'Kanalizasyon, Boru ve Tesisat',
    count: 61,
    children: ['Boru ve Bağlantı Elemanları', 'Su Tesisatı', 'Doğalgaz Tesisatı', 'Sıhhi Tesisat']
  },
  {
    name: 'Kent Mobilyaları ve Prefabrik Yapılar',
    count: 40,
    children: ['Kent Mobilyaları', 'Prefabrik Yapılar', 'Konteyner', 'Doğramacılık']
  },
  {
    name: 'Mühendislik, Mimarlık ve Danışmanlık',
    count: 95,
    children: ['Mimarlık Hizmetleri', 'Mühendislik Hizmetleri', 'Proje ve Çizim', 'Teknik Danışmanlık']
  },
  {
    name: 'Madencilik, Sondaj ve Doğal Kaynaklar',
    count: 24,
    children: ['Madencilik', 'Sondaj', 'Doğal Kaynaklar', 'Hammadde']
  },
  {
    name: 'Hırdavat, Metal ve Plastik Ürünler',
    count: 106,
    children: ['Hırdavat', 'Nalbur Malzemeleri', 'Metal Ürünler', 'Plastik Ürünler']
  },
  {
    name: 'Enerji, Elektrik ve Aydınlatma',
    count: 117,
    children: ['Elektrik Malzemeleri', 'Aydınlatma', 'Güneş Enerjisi', 'Elektrik Tesisatı']
  },
  {
    name: 'Yangın ve Güvenlik Sistemleri',
    count: 94,
    children: ['Yangın Algılama', 'Yangın Söndürme', 'Alarm Sistemleri', 'Güvenlik Ekipmanları']
  },
  {
    name: 'Asansör ve Yapı Otomasyonu',
    count: 75,
    children: ['Asansör', 'Yürüyen Merdiven', 'Bina Otomasyonu', 'Geçiş Sistemleri']
  },
  {
    name: 'Klima, Isıtma ve Havalandırma',
    count: 207,
    children: ['Klima', 'Soğutma', 'Isıtma', 'Havalandırma']
  },
  {
    name: 'Endüstriyel Makine ve Üretim',
    count: 323,
    children: ['Endüstriyel Makine', 'Motor ve Redüktör', 'Konveyör', 'Üretim Ekipmanları']
  },
  {
    name: 'Taşıt, İş Makinesi ve Yedek Parça',
    count: 271,
    children: ['Otomobil', 'Ticari Araç', 'İş Makinesi', 'Yedek Parça']
  },
  {
    name: 'Nakliye, Lojistik ve Taşımacılık',
    count: 169,
    children: ['Kara Taşımacılığı', 'Personel Taşıma', 'Depolama', 'Dağıtım']
  },
  {
    name: 'Turizm ve Organizasyon',
    count: 68,
    children: ['Otel Hizmetleri', 'Organizasyon', 'Seyahat', 'Etkinlik']
  },
  {
    name: 'Reklam, Tanıtım ve Pazarlama',
    count: 142,
    children: ['Dijital Reklam', 'Tabela ve Baskı', 'Organizasyon', 'Promosyon']
  },
  {
    name: 'Matbaa, Kırtasiye ve Ambalaj',
    count: 337,
    children: ['Matbaa', 'Kırtasiye', 'Toner ve Kartuş', 'Ambalaj']
  },
  {
    name: 'Peyzaj, Bahçe ve Ormancılık',
    count: 165,
    children: ['Peyzaj', 'Bahçe Bakımı', 'Bitki ve Fidan', 'Ormancılık']
  },
  {
    name: 'Sağlık, Medikal ve Tıbbi Cihaz',
    count: 251,
    children: ['Medikal Ürünler', 'Tıbbi Cihazlar', 'Laboratuvar Ekipmanları', 'Sarf Malzemeleri']
  },
  {
    name: 'Akaryakıt, Yakıt ve Madeni Yağ',
    count: 123,
    children: ['Akaryakıt', 'Madeni Yağ', 'Endüstriyel Yağ', 'Yakıt Ürünleri']
  },
  {
    name: 'Gıda, Tarım ve Catering',
    count: 337,
    children: ['Gıda Ürünleri', 'Tarım Ürünleri', 'Hazır Yemek', 'Catering']
  },
  {
    name: 'Elektronik, Bilgisayar ve İletişim',
    count: 352,
    children: ['Bilgisayar ve Laptop', 'Sunucu ve Veri Merkezi', 'Network Ürünleri', 'Elektronik Ekipmanlar']
  },
  {
    name: 'Yazılım, Bilişim ve Dijital Hizmetler',
    count: 149,
    children: ['Web Yazılım', 'Mobil Uygulama', 'Kurumsal Yazılım', 'Bulut Hizmetleri']
  },
  {
    name: 'Kamera, Otomasyon ve Haberleşme',
    count: 122,
    children: ['Kamera Sistemleri', 'Otomasyon', 'Takip Sistemleri', 'Haberleşme']
  },
  {
    name: 'Temizlik, İlaçlama ve Geri Dönüşüm',
    count: 247,
    children: ['Temizlik Hizmetleri', 'Temizlik Malzemeleri', 'İlaçlama', 'Geri Dönüşüm']
  },
  {
    name: 'Kimyasal Maddeler ve Endüstriyel Ürünler',
    count: 225,
    children: ['Endüstriyel Kimyasallar', 'Dezenfektan', 'Boya ve Kaplama', 'Hammadde']
  },
  {
    name: 'Tekstil, Giyim ve İş Kıyafetleri',
    count: 273,
    children: ['Tekstil', 'Personel Kıyafeti', 'İş Elbiseleri', 'Ayakkabı']
  },
  {
    name: 'İş Sağlığı ve Güvenliği',
    count: 131,
    children: ['İSG Ekipmanları', 'Koruyucu Ekipman', 'İSG Hizmetleri', 'İş Güvenliği Eğitimi']
  },
  {
    name: 'Mobilya, Ofis ve Dekorasyon',
    count: 208,
    children: ['Ofis Mobilyaları', 'Ev Mobilyaları', 'Dekorasyon', 'Mutfak Ekipmanları']
  },
  {
    name: 'Özel Güvenlik ve Koruma',
    count: 85,
    children: ['Özel Güvenlik', 'Koruma Hizmetleri', 'Bekçilik', 'Güvenlik Danışmanlığı']
  },
  {
    name: 'Eğitim ve Kurumsal Gelişim',
    count: 76,
    children: ['Kurumsal Eğitim', 'Online Eğitim', 'Eğitim Materyalleri', 'Danışmanlık']
  },
  {
    name: 'İnsan Kaynakları ve Sosyal Hizmetler',
    count: 163,
    children: ['İnsan Kaynakları', 'Personel Temini', 'Bordrolama', 'Kurumsal Hizmetler']
  },
  {
    name: 'Sigorta, Mali ve Hukuki Hizmetler',
    count: 56,
    children: ['Sigorta', 'Mali Müşavirlik', 'Hukuk', 'Finansal Danışmanlık']
  },
  {
    name: 'Gayrimenkul ve İşyeri Hizmetleri',
    count: 122,
    children: ['Gayrimenkul', 'İşyeri Kiralama', 'Tesis Yönetimi', 'Emlak Hizmetleri']
  }
]

const sectors = [
  { name: 'Tarım, Çiftçilik, Balıkçılık ve Ormancılık', count: 84 },
  { name: 'Petrol, Yakıt, Elektrik ve Enerji', count: 97 },
  { name: 'Madencilik, Metal ve Hammaddeler', count: 64 },
  { name: 'Gıda ve İçecek', count: 189 },
  { name: 'Tarım Makineleri', count: 42 },
  { name: 'Giyim, Ayakkabı ve Aksesuar', count: 73 },
  { name: 'Tekstil, Plastik ve Kauçuk', count: 126 },
  { name: 'Basılı Malzeme ve Matbaa', count: 58 },
  { name: 'Kimyasal Ürünler', count: 91 },
  { name: 'Mobilya, Ofis ve Bilgi İşlem Ekipmanları', count: 168 },
  { name: 'Elektrikli Makine, Cihaz ve Aydınlatma', count: 144 },
  { name: 'Radyo, TV, İletişim ve Telekomünikasyon', count: 76 },
  { name: 'Tıbbi Cihaz, İlaç ve Kişisel Bakım', count: 112 },
  { name: 'Nakliye Araçları ve Yardımcı Ürünler', count: 89 },
  { name: 'Güvenlik ve Yangınla Mücadele', count: 61 },
  { name: 'Spor, Oyun, Oyuncak ve Sanat', count: 34 },
  { name: 'Laboratuvar, Optik ve Hassas Ekipman', count: 52 },
  { name: 'Mobilya, Mefruşat ve Temizlik Ürünleri', count: 103 },
  { name: 'Su ve Arıtma Sistemleri', count: 48 },
  { name: 'Sanayi Tipi Makineler', count: 156 },
  { name: 'İnşaat Makinesi ve Ekipmanları', count: 137 },
  { name: 'İnşaat, Yapı ve Yapı Malzemeleri', count: 248 },
  { name: 'İnşaat ve Taahhüt İşleri', count: 176 },
  { name: 'Yazılım ve Bilgi Sistemleri', count: 149 },
  { name: 'Onarım ve Bakım Hizmetleri', count: 118 },
  { name: 'Kurulum ve Teknik Servis Hizmetleri', count: 96 },
  { name: 'Otel, Restoran ve Perakende Hizmetleri', count: 67 },
  { name: 'Nakliye ve Lojistik Hizmetleri', count: 169 },
  { name: 'Seyahat ve Organizasyon Hizmetleri', count: 44 },
  { name: 'Posta, Kurye ve Telekomünikasyon Hizmetleri', count: 39 },
  { name: 'Finans ve Sigorta Hizmetleri', count: 56 },
  { name: 'Gayrimenkul Hizmetleri', count: 42 },
  { name: 'Mimarlık, Mühendislik ve Denetim', count: 95 },
  { name: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri', count: 183 },
  { name: 'Araştırma, Geliştirme ve Danışmanlık', count: 71 },
  { name: 'Yönetim ve Kurumsal Hizmetler', count: 63 },
  { name: 'Enerji ve Petrol Endüstrisi Hizmetleri', count: 54 },
  { name: 'Pazarlama, Hukuk ve İnsan Kaynakları', count: 81 },
  { name: 'Eğitim ve Öğretim Hizmetleri', count: 76 },
  { name: 'Sağlık ve Sosyal Hizmetler', count: 92 },
  { name: 'Temizlik, Atık ve Çevre Hizmetleri', count: 114 },
  { name: 'Kültür, Rekreasyon ve Spor Hizmetleri', count: 38 }
]

const tenderTypes = [
  { name: 'Mal Alımı', count: 578 },
  { name: 'Hizmet Alımı', count: 207 },
  { name: 'Yapım İşi', count: 180 },
  { name: 'Fason Üretim', count: 92 },
  { name: 'Kiralama', count: 85 },
  { name: 'Satış Talebi', count: 39 }
]

const offerMethods = [
  { name: 'Açık Teklif', count: 546 },
  { name: 'Kapalı Teklif', count: 395 },
  { name: 'Davetli İhale', count: 151 },
  { name: 'Ters İhale', count: 98 },
  { name: 'Fiyat Araştırması', count: 68 },
  { name: 'Doğrudan Teklif Talebi', count: 57 }
]

const pricingTypes = [
  { name: 'Toplam / Götürü Bedel', count: 214 },
  { name: 'Birim Fiyat', count: 323 },
  { name: 'Kısmi Teklif Verilebilir', count: 115 },
  { name: 'Kısmi Teklif Verilemez', count: 277 }
]

const tenders = [
  {
    id: 1,
    featured: true,
    title: '500 Adet Kurumsal Dizüstü Bilgisayar Alımı',
    company: 'Marmara Teknoloji Yatırımları A.Ş.',
    verified: true,
    category: 'Elektronik, Bilgisayar ve İletişim',
    sector: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri',
    city: 'İstanbul',
    type: 'Mal Alımı',
    method: 'Kapalı Teklif',
    pricing: 'Birim Fiyat',
    deadline: '22 Temmuz 2026',
    daysLeft: 7,
    offers: 14,
    value: '5.500.000 ₺',
    description: 'Kurumsal kullanım için teknik şartnameye uygun 500 adet dizüstü bilgisayar alımı.',
    material_list: '1. Intel i7 İşlemcili Dizüstü Bilgisayar - 350 Adet\n2. Intel i5 İşlemcili Dizüstü Bilgisayar - 150 Adet',
    admin_spec: '• Teklifler birim fiyat üzerinden toplanacaktır.\n• Teslimat süresi siparişten itibaren en fazla 30 gündür.',
    tech_spec: '• En az 16GB RAM ve 512GB NVMe SSD bulunmalıdır.\n• 3 yıl yerinde üretici garantisi zorunludur.',
    similar_history: '2025/1049 - 200 Adet Masaüstü Bilgisayar Alımı (Sonuç: 2.100.000 ₺)'
  },
  {
    id: 2,
    featured: false,
    title: 'Üretim Tesisi Çatı ve İzolasyon Yenileme İşi',
    company: 'Bursa Endüstri Üretim A.Ş.',
    verified: true,
    category: 'İnşaat, Altyapı ve Yapı İşleri',
    sector: 'İnşaat ve Taahhüt İşleri',
    city: 'Bursa',
    type: 'Yapım İşi',
    method: 'Açık Teklif',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '25 Temmuz 2026',
    daysLeft: 10,
    offers: 8,
    value: '1.250.000 ₺',
    description: 'Fabrika üretim tesisi çatı kaplama ve ısı izolasyon yenileme işi.',
    material_list: '1. Çatı Sandviç Panel Kaplama (40mm EPS) - 1.800 m²\n2. İzolasyon Membranı Uygulaması - 1.800 m²',
    admin_spec: '• İş tesliminde hakediş usulü ödeme yapılacaktır.\n• Geçici teminat mektubu talep edilmektedir.',
    tech_spec: '• Sandviç paneller TSE ve yangın dayanım belgeli olmalıdır.\n• Uygulama garantisi en az 5 yıl olmalıdır.',
    similar_history: '2025/4490 - Depo Çatı Tamiratı (Sonuç: 450.000 ₺)'
  },
  {
    id: 3,
    featured: false,
    title: '12 Aylık Personel Taşıma Hizmeti',
    company: 'Ege Gıda Sanayi Ltd. Şti.',
    verified: true,
    category: 'Nakliye, Lojistik ve Taşımacılık',
    sector: 'Nakliye ve Lojistik Hizmetleri',
    city: 'İzmir',
    type: 'Hizmet Alımı',
    method: 'Kapalı Teklif',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '19 Temmuz 2026',
    daysLeft: 4,
    offers: 21,
    value: '840.000 ₺',
    description: 'Üretim tesisi çalışanları için 12 aylık personel servis taşımacılığı hizmeti.',
    material_list: '1. 27 Kişilik Servis Aracı (Günlük 2 Sefer) - 3 Hat\n2. 16 Kişilik Servis Aracı (Günlük 2 Sefer) - 2 Hat',
    admin_spec: '• Ödemeler aylık olarak düzenlenecek fatura karşılığında yapılacaktır.\n• Sürücülerin SRC belgeleri eksiksiz olmalıdır.',
    tech_spec: '• Araçların yaş sınırı en fazla 5 olmalıdır.\n• Koltuk sigortaları ve D2 belgeleri bulunmalıdır.',
    similar_history: '2025/1102 - 12 Aylık Servis Hizmeti (Sonuç: 720.000 ₺)'
  },
  {
    id: 4,
    featured: true,
    title: '100.000 Adet Özel Tasarım Ürün Kutusu Üretimi',
    company: 'Anadolu E-Ticaret A.Ş.',
    verified: true,
    category: 'Matbaa, Kırtasiye ve Ambalaj',
    sector: 'Basılı Malzeme ve Matbaa',
    city: 'Ankara',
    type: 'Fason Üretim',
    method: 'Ters İhale',
    pricing: 'Birim Fiyat',
    deadline: '18 Temmuz 2026',
    daysLeft: 3,
    offers: 17,
    value: '350.000 ₺',
    description: 'Marka standartlarına uygun baskılı ürün kutularının fason üretimi.',
    material_list: '1. Kraft Dopel Kutu (25x20x10 cm) - 50.000 Adet\n2. Selefonlu Baskılı Kutu (15x15x8 cm) - 50.000 Adet',
    admin_spec: '• Numune onayı alındıktan sonra seri üretime başlanacaktır.\n• Teslimat 3 parti halinde Ankara depomuza yapılacaktır.',
    tech_spec: '• Baskı kalitesi minimum 300 DPI olmalıdır.\n• Oluklu mukavva gramajı şartnameye uygun olmalıdır.',
    similar_history: '2025/9012 - Ambalaj Kolisi Alımı (Sonuç: 180.000 ₺)'
  },
  {
    id: 5,
    featured: false,
    title: 'Kurumsal Web Yazılım ve Mobil Uygulama Projesi',
    company: 'Atlas Holding A.Ş.',
    verified: true,
    category: 'Yazılım, Bilişim ve Dijital Hizmetler',
    sector: 'IT, Yazılım Geliştirme ve İnternet Hizmetleri',
    city: 'İstanbul',
    type: 'Hizmet Alımı',
    method: 'Davetli İhale',
    pricing: 'Toplam / Götürü Bedel',
    deadline: '30 Temmuz 2026',
    daysLeft: 15,
    offers: 6,
    value: '2.800.000 ₺',
    description: 'Kurumsal portal, mobil uygulama ve yönetim paneli geliştirme hizmeti.',
    material_list: '1. UI/UX Tasarım Süreci - 1 Aşama\n2. Kurumsal Web Sitesi & CMS - 1 Sistem\n3. iOS & Android Mobil Uygulama - 2 Uygulama',
    admin_spec: '• Ödeme takvimi proje kilometre taşlarına (milestones) göre yapılacaktır.\n• Kaynak kodları teslim edilecektir.',
    tech_spec: '• Backend teknolojisi Node.js/Go, frontend Vue.js/React olmalıdır.\n• Test kapsamı ve dokümantasyon tam olmalıdır.',
    similar_history: '2025/7829 - CRM Entegrasyonu Projesi (Sonuç: 950.000 ₺)'
  }
]

const faqs = [
  {
    question: 'GelAnlaşalım nedir?',
    answer: 'GelAnlaşalım, özel sektördeki firmaların satın alma taleplerini yayınlayabildiği, tedarikçilerin ise bu taleplere teklif verebildiği dijital ihale ve iş fırsatları platformudur.'
  },
  {
    question: 'Kimler GelAnlaşalım kullanabilir?',
    answer: 'Satın alma yapan şirketler, KOBİ’ler, üreticiler, hizmet sağlayıcılar, tedarikçiler ve yeni müşterilere ulaşmak isteyen tüm işletmeler platformu kullanabilir.'
  },
  {
    question: 'Platformda kamu ihaleleri var mı?',
    answer: 'Hayır. GelAnlaşalım özel sektör odaklıdır. Platformun temel amacı şirketler arasındaki satın alma, teklif toplama ve tedarik süreçlerini B2B tersine ihale modeliyle dijitalleştirmektir.'
  },
  {
    question: 'İhale oluşturmak ücretli mi?',
    answer: 'Ücretlendirme modeli üyelik planına göre belirlenir. Lansman döneminde kurumsal ve profesyonel planlar tamamen ücretsiz olarak sunulmaktadır.'
  },
  {
    question: 'Ters ihale (Eksiltme) nedir?',
    answer: 'Tersine ihalede satıcılar belirlenen süre içerisinde en rekabetçi teklifleri sunar. Fiyatların anlık düştüğü şeffaf rekabet arenasıyla alıcı firma en optimum ticari koşullara ulaşır.'
  }
]

const buyerSteps = [
  { number: '01', title: 'İhtiyacını Yayınla', text: 'Ürün veya hizmet ihtiyacını oluştur. Teknik ve idari şartname belgelerini yükle.' },
  { number: '02', title: 'Rekabet Arenasını İzle', text: 'Tedarikçilerin anlık fiyat kırarak yarıştığı tersine ihale arenasını canlı takip et.' },
  { number: '03', title: 'En Uygun Teklifle Anlaş', text: 'Fiyat, kalite ve teslimat şartlarına göre en doğru kararı ver ve anlaşmayı kilitlesin.' }
]

const supplierSteps = [
  { number: '01', title: 'İş Fırsatlarını Keşfet', text: 'Sektörüne ve uzmanlık alanına uygun güncel kurumsal ihaleleri saniyeler içinde bul.' },
  { number: '02', title: 'Teklifini Gönder', text: 'Teknik şartları incele, malzeme bazlı birim fiyat teklifini güvenle ilet.' },
  { number: '03', title: 'Yeni Portföy Kazan', text: 'Doğrulanmış B2B alıcılar ile doğrudan iş anlaşmaları yap ve ticaret hacmini büyüt.' }
]

const activeSteps = computed(() => activeAudience.value === 'buyer' ? buyerSteps : supplierSteps)

/* =========================================================
   İN-MEMORY FİLTRELEME MANTIĞI
========================================================= */
const filteredTenders = computed(() => {
  return tenders.filter((t) => {
    const q = explorerSearch.value.toLocaleLowerCase('tr')
    const searchMatch = !explorerSearch.value || 
      t.title.toLocaleLowerCase('tr').includes(q) ||
      t.company.toLocaleLowerCase('tr').includes(q) ||
      t.description.toLocaleLowerCase('tr').includes(q)

    const cityMatch = !selectedCity.value || t.city === selectedCity.value
    const catMatch = !selectedCat.value || t.category === selectedCat.value
    const subcatMatch = !selectedSubcategory.value || t.description.toLocaleLowerCase('tr').includes(selectedSubcategory.value.toLocaleLowerCase('tr'))
    const sectorMatch = !selectedSector.value || t.sector === selectedSector.value
    const typeMatch = !selectedType.value || t.type === selectedType.value
    const methodMatch = !selectedMethod.value || t.method === selectedMethod.value
    const pricingMatch = !selectedPricingType.value || t.pricing === selectedPricingType.value

    return searchMatch && cityMatch && catMatch && subcatMatch && sectorMatch && typeMatch && methodMatch && pricingMatch
  })
})

/* =========================================================
   YARDIMCI FONKSİYONLAR
========================================================= */
function clearFilters() {
  explorerSearch.value = ''
  selectedCity.value = ''
  selectedCat.value = ''
  selectedSubcategory.value = ''
  selectedSector.value = ''
  selectedType.value = ''
  selectedMethod.value = ''
  selectedPricingType.value = ''
}

function toggleCategory(catName: string) {
  expandedCategory.value = expandedCategory.value === catName ? null : catName
}

function selectMainCategory(catName: string) {
  selectedCat.value = catName
  selectedSubcategory.value = ''
}

function selectSubcategory(catName: string, subcatName: string) {
  selectedCat.value = catName
  selectedSubcategory.value = subcatName
}

function toggleFilterSection(section: string) {
  expandedFilterSection.value = expandedFilterSection.value === section ? null : section
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    <!-- HERO SECTION -->
    <section class="relative overflow-hidden border-b border-slate-200" style="background-image: linear-gradient(rgba(241, 245, 249, 0.92), rgba(255, 255, 255, 0.88)), url('/hero_port_background.png'); background-size: cover; background-position: center; background-attachment: scroll;">
      <!-- Decorative circles -->
      <div class="absolute right-[-10%] top-[-30%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl"></div>
      <div class="absolute bottom-[-30%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl"></div>

      <div class="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <!-- Hero Left -->
        <div class="text-left">
          <div class="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]" style="color: #1E3A5F;">
            <span class="h-px w-8" style="background-color: #1E3A5F;"></span>
            KURUMSAL SATIN ALMA EKİPLERİ İÇİN B2B TERS İHALE PLATFORMU
          </div>
          <h1 class="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Yeni Nesil Dijital<br />
            Satın alma ve<br />
            <span class="font-serif italic font-medium" style="color: #2563EB;">Akıllı İhale Platformu.</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            Acsisco; e-ihale, teklif toplama, sipariş ve tedarik süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, zamandan tasarruf edin ve satın alma operasyonlarınızı daha verimli yönetin.
          </p>
          
          <!-- Buttons -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink to="/uyelik" class="flex items-center gap-2 rounded-xl px-6 py-4 text-xs font-black text-white shadow-xl shadow-blue-600/10 hover:bg-blue-700 transition-all" style="background: #1D4ED8;">
              Ücretsiz kurumsal hesap aç
              <ArrowRight :size="15" />
            </NuxtLink>
            <a href="#nasil-calisir" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-4 text-xs font-black text-slate-700 hover:bg-white transition-all">
              Nasıl çalışır
              <ArrowRight :size="15" />
            </a>
          </div>

          <!-- Bottom Features Strip -->
          <div class="mt-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2">
            <span>KVKK KAPSAMINDA</span>
            <span class="text-slate-300">•</span>
            <span>BELGE İZİ & ZAMAN DAMGASI</span>
            <span class="text-slate-300">•</span>
            <span>ŞİFRELİ VERİ AKTARIMI</span>
            <span class="text-slate-300">•</span>
            <span>LANSMAN DÖNEMİNDE ÜCRETSİZ</span>
          </div>

          <!-- Video Button -->
          <div class="mt-8">
            <button class="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
              Video rehberlerini izle
            </button>
          </div>
        </div>

        <!-- Hero Right (Live Card styled like the screenshot) -->
        <div class="relative">
          <div class="absolute -inset-8 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          <div class="relative mx-auto max-w-[460px] rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-sm text-left">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span> TEMSİLİ CANLI İHALE
                </span>
                <h3 class="mt-1.5 text-base font-black text-slate-800">CNC Fason Üretim Partisi</h3>
              </div>
              <div class="text-right">
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">KALAN SÜRE</span>
                <div class="mt-1 font-mono text-sm font-black text-slate-800">02:21</div>
              </div>
            </div>

            <!-- Price and Savings info -->
            <div class="py-6 flex justify-between items-start">
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">GÜNCEL EN İYİ TEKLİF</span>
                <div class="mt-1 text-4xl font-black text-slate-900 tracking-tight font-mono">₺396.800</div>
                <div class="mt-2 text-[10px] text-slate-400 font-bold">
                  AÇILIŞ FİYATI <span class="font-mono text-slate-600 line-through">₺412.000</span>
                </div>
              </div>
              
              <div class="text-right">
                <div class="rounded-lg px-2.5 py-1 text-[9px] font-black" style="background: rgba(37,99,235,0.08); color: #2563EB;">
                  TASARRUF %3,7
                </div>
              </div>
            </div>

            <!-- Competitor List -->
            <div class="space-y-2 border-t border-slate-100 pt-5">
              <div class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">2 TEDARİKÇİ YARIŞIYOR</div>
              
              <!-- Leader -->
              <div class="flex items-center justify-between rounded-xl border border-blue-200/60 bg-blue-50/40 px-4 py-2.5">
                <div class="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  Tedarikçi #A47
                  <span class="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-black text-blue-700">ÖNDE</span>
                </div>
                <span class="font-mono font-bold text-xs text-slate-800">₺396.800</span>
              </div>
              
              <!-- Second -->
              <div class="flex items-center justify-between rounded-xl bg-white border border-slate-200/60 px-4 py-2.5">
                <div class="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                  Tedarikçi #D08
                </div>
                <span class="font-mono font-bold text-xs text-slate-500">₺404.500</span>
              </div>
            </div>

            <!-- Bottom Tabs Inside Card -->
            <div class="grid grid-cols-4 gap-1 mt-6 border-t border-slate-100 pt-4 text-center">
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">TALEP</span>
              <span class="text-[8px] font-black text-blue-600 py-1 border-b-2 border-blue-600">+ TEKLİF</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">KARAR</span>
              <span class="text-[8px] font-black text-slate-400 py-1 hover:text-slate-700 cursor-pointer">TESLİMAT</span>
            </div>

            <div class="mt-4 text-center text-[9px] italic text-slate-400">
              Temsili veridir - Gerçek teklif değildir
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Strip -->
      <div class="relative border-t border-slate-200/80 bg-white/60 py-6 backdrop-blur-md">
        <div class="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          <div class="flex items-center gap-3">
            <ShieldCheck class="text-blue-600 shrink-0" :size="22" />
            <div>
              <div class="text-xs font-black text-slate-800">Firma Doğrulama</div>
              <div class="text-[10px] text-slate-500">Güvenli ve onaylı ticaret zinciri</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <LockKeyhole class="text-blue-600 shrink-0" :size="22" />
            <div>
              <div class="text-xs font-black text-slate-800">Güvenli İşlem Akışı</div>
              <div class="text-[10px] text-slate-500">KVKK uyumlu, time-stamped kayıt izleri</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Scale class="text-blue-600 shrink-0" :size="22" />
            <div>
              <div class="text-xs font-black text-slate-800">Şeffaf Karşılaştırma</div>
              <div class="text-[10px] text-slate-500">Teknik & idari detaylar tek ekranda</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Globe2 class="text-blue-600 shrink-0" :size="22" />
            <div>
              <div class="text-xs font-black text-slate-800">81 İlde Hizmet</div>
              <div class="text-[10px] text-slate-500">Tüm Türkiye sınırlarında tedarik ağı</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- B2B EXPLORER SECTION -->
    <section id="ihale-gezgini" class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <!-- Explorer Header -->
        <div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end text-left">
          <div>
            <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">İHALE PAZARI</span>
            <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Doğru Firmayla Doğru Şartlarda Anlaşın</h2>
            <p class="mt-3 max-w-2xl text-xs text-slate-500">Sektörünüze özel ihaleleri sol panelden filtreleyin; teklif süreçlerini canlı takip edin.</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3.5 flex flex-col gap-1 items-start">
            <span class="text-xs font-black text-blue-900">{{ filteredTenders.length }} Aktif Sonuç</span>
            <span class="text-[10px] text-blue-600">Kriterlere göre anlık güncellenir</span>
          </div>
        </div>

        <!-- Explorer Main Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-8">
          <!-- Sol Filtre Paneli -->
          <aside class="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col text-left">
            <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4">
              <div class="flex items-center gap-2 font-black text-slate-800 text-xs uppercase tracking-wider">
                <SlidersHorizontal :size="16" class="text-blue-600" /> Filtreleme Seçenekleri
              </div>
              <button @click="clearFilters" class="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase">Temizle</button>
            </div>

            <!-- Kategoriler Filtresi -->
            <div class="border-b border-slate-200">
              <button @click="toggleFilterSection('categories')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>📂 Kategoriler</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'categories' }" />
              </button>
              <div v-if="expandedFilterSection === 'categories'" class="max-h-[300px] overflow-y-auto border-t border-slate-100">
                <div v-for="category in detailedCategories" :key="category.name" class="border-b border-slate-100 last:border-0">
                  <div class="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50" :class="{ 'bg-blue-50/50': selectedCat === category.name }">
                    <button @click="toggleCategory(category.name)" class="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 hover:text-blue-600">
                      <ChevronDown :size="12" class="transition-transform" :class="{ '-rotate-90': expandedCategory !== category.name }" />
                    </button>
                    <button @click="selectMainCategory(category.name)" class="min-w-0 flex-1 text-left text-[11px] font-bold text-slate-700 hover:text-blue-600 leading-4">
                      {{ category.name }}
                    </button>
                    <span class="shrink-0 rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-black text-slate-500">{{ category.count }}</span>
                  </div>
                  <div v-if="expandedCategory === category.name" class="bg-slate-50 border-t border-slate-100/50">
                    <button v-for="sub in category.children" :key="sub" @click="selectSubcategory(category.name, sub)" class="flex w-full items-center gap-1.5 px-8 py-2 text-left text-[11px] font-semibold text-slate-600 hover:bg-white hover:text-blue-600" :class="{ 'bg-white text-blue-600 font-bold': selectedSubcategory === sub }">
                      <span class="text-slate-300">└</span> {{ sub }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sektörler Filtresi -->
            <div class="border-b border-slate-200">
              <button @click="toggleFilterSection('sectors')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>🏭 Sektörler</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'sectors' }" />
              </button>
              <div v-if="expandedFilterSection === 'sectors'" class="max-h-[300px] overflow-y-auto border-t border-slate-100">
                <button v-for="sector in sectors" :key="sector.name" @click="selectedSector = sector.name" class="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50" :class="{ 'bg-blue-50/50 text-blue-600 font-bold': selectedSector === sector.name }">
                  <span class="min-w-0 text-[11px] font-bold text-slate-700 leading-4">{{ sector.name }}</span>
                  <span class="shrink-0 rounded border bg-white px-1.5 py-0.5 text-[9px] font-black text-slate-500">{{ sector.count }}</span>
                </button>
              </div>
            </div>

            <!-- İhale Türü -->
            <div class="border-b border-slate-200">
              <button @click="toggleFilterSection('types')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>🛠 İhale Türleri</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'types' }" />
              </button>
              <div v-if="expandedFilterSection === 'types'" class="border-t border-slate-100 p-3">
                <button v-for="t in tenderTypes" :key="t.name" @click="selectedType = t.name" class="mb-2 flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50" :class="{ 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold': selectedType === t.name }">
                  <span class="text-xs font-semibold text-slate-700">{{ t.name }}</span>
                  <span class="text-[9px] font-black text-slate-500">{{ t.count }}</span>
                </button>
              </div>
            </div>

            <!-- Teklif Yöntemleri -->
            <div class="border-b border-slate-200">
              <button @click="toggleFilterSection('methods')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>🔄 Teklif Yöntemleri</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'methods' }" />
              </button>
              <div v-if="expandedFilterSection === 'methods'" class="border-t border-slate-100 p-3">
                <button v-for="m in offerMethods" :key="m.name" @click="selectedMethod = m.name" class="mb-2 flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50" :class="{ 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold': selectedMethod === m.name }">
                  <span class="text-xs font-semibold text-slate-700">{{ m.name }}</span>
                  <span class="text-[9px] font-black text-slate-500">{{ m.count }}</span>
                </button>
              </div>
            </div>

            <!-- Fiyatlandırma Türleri -->
            <div class="border-b border-slate-200">
              <button @click="toggleFilterSection('pricing')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>📋 Fiyatlandırma Türleri</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'pricing' }" />
              </button>
              <div v-if="expandedFilterSection === 'pricing'" class="border-t border-slate-100 p-3">
                <button v-for="p in pricingTypes" :key="p.name" @click="selectedPricingType = p.name" class="mb-2 flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50" :class="{ 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold': selectedPricingType === p.name }">
                  <span class="text-xs font-semibold text-slate-700">{{ p.name }}</span>
                  <span class="text-[9px] font-black text-slate-500">{{ p.count }}</span>
                </button>
              </div>
            </div>

            <!-- Teslim Yeri (İl) -->
            <div>
              <button @click="toggleFilterSection('cities')" class="flex w-full items-center justify-between px-4 py-3.5 font-bold text-slate-700 text-xs">
                <span>📍 İş / Teslim Yeri</span>
                <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': expandedFilterSection === 'cities' }" />
              </button>
              <div v-if="expandedFilterSection === 'cities'" class="border-t border-slate-100 p-3">
                <select v-model="selectedCity" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500">
                  <option value="">Tüm Türkiye</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
            </div>
          </aside>

          <!-- Sağ Sonuçlar Paneli -->
          <div class="flex flex-col gap-4 text-left">
            <!-- Keyword search -->
            <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div class="flex gap-2">
                <div class="flex-1 relative">
                  <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="explorerSearch" type="text" placeholder="İlan başlığı, malzeme veya firma adı ile arayın..." class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            <!-- Aktif Filtre Rozetleri -->
            <div v-if="selectedCat || selectedSubcategory || selectedSector || selectedCity || selectedType || selectedMethod || selectedPricingType" class="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div class="text-[9px] font-black uppercase tracking-wider text-blue-600 mb-2">Aktif Filtreler</div>
              <div class="flex flex-wrap gap-2">
                <button v-if="selectedCat" @click="selectedCat = ''; selectedSubcategory = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Kategori: {{ selectedCat }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedSubcategory" @click="selectedSubcategory = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Alt Kategori: {{ selectedSubcategory }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedSector" @click="selectedSector = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Sektör: {{ selectedSector }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedCity" @click="selectedCity = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Şehir: {{ selectedCity }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedType" @click="selectedType = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Tür: {{ selectedType }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedMethod" @click="selectedMethod = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Yöntem: {{ selectedMethod }} <span class="text-slate-400">×</span>
                </button>
                <button v-if="selectedPricingType" @click="selectedPricingType = ''" class="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200 hover:text-blue-600 shadow-sm flex items-center gap-1">
                  Fiyatlandırma: {{ selectedPricingType }} <span class="text-slate-400">×</span>
                </button>
              </div>
            </div>

            <!-- Tenders List -->
            <div class="space-y-4">
              <div v-for="res in filteredTenders" :key="res.id" class="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col text-left">
                <div class="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span v-if="res.featured" class="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[9px] font-black text-orange-700 uppercase">🔥 Öne Çıkan</span>
                      <span class="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-black text-blue-700 uppercase">{{ res.type }}</span>
                      <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.method }}</span>
                      <span class="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[9px] font-black text-slate-600 uppercase">{{ res.pricing }}</span>
                    </div>

                    <h3 class="mt-4 text-base font-black text-slate-800 hover:text-blue-600 transition-colors leading-snug">{{ res.title }}</h3>
                    <div class="mt-2.5 flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Building2 :size="14" class="text-slate-400" />
                      <span>{{ res.company }}</span>
                      <span v-if="res.verified" class="rounded-full bg-blue-50 px-1 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100">ONAYLI ÜYE</span>
                    </div>
                    <p class="mt-3 text-xs leading-relaxed text-slate-500 font-medium">{{ res.description }}</p>

                    <div class="mt-5 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                      <span class="flex items-center gap-1.5"><MapPin :size="14" /> {{ res.city }}</span>
                      <span class="flex items-center gap-1.5"><Clock3 :size="14" /> {{ res.offers }} teklif toplandı</span>
                    </div>
                  </div>

                  <!-- Right panel within card -->
                  <div class="flex min-w-[200px] flex-col justify-between border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <div class="text-[9px] font-black uppercase text-slate-400">Son Teklif Tarihi</div>
                      <div class="mt-1 text-sm font-black text-slate-800">{{ res.deadline }}</div>
                      <div class="mt-1 text-xs font-black text-red-500">{{ res.daysLeft }} gün kaldı</div>
                    </div>
                    <button @click="expandedTenderId = expandedTenderId === res.id ? null : res.id; activeDetailTab = 'malzeme'" class="mt-6 w-full flex items-center justify-center rounded-xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-blue-600 transition-all">
                      {{ expandedTenderId === res.id ? 'Detayları Gizle' : 'Detayları Gör' }}
                    </button>
                  </div>
                </div>

                <!-- Detay Kartı Açılımı (EKAP Stili) -->
                <div v-if="expandedTenderId === res.id" class="w-full mt-6 p-4 rounded-xl bg-sky-50/30 text-slate-700 border border-sky-200 text-xs flex flex-col gap-4 shadow-sm">
                  <div class="flex items-center gap-2 pb-2 border-b border-sky-100">
                    <span class="bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded"># İHALE NO</span>
                    <span class="font-bold text-slate-800 text-xs">2026/{{ 100000 + res.id }} - {{ res.title }}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-6">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">İşin Niteliği</span>
                      <p class="mt-1 text-slate-700 leading-relaxed">{{ res.description }}</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">Teslim Yeri</span>
                      <p class="mt-1 text-slate-700 font-bold">{{ res.city }} / Türkiye</p>
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-bold text-slate-500 uppercase text-[9px] block">Yaklaşık Maliyet Hacmi</span>
                      <p class="mt-1 text-slate-900 font-mono font-black text-sm">{{ res.value }}</p>
                    </div>
                  </div>

                  <!-- Sekmeler -->
                  <div class="border-t border-sky-100 pt-3 flex flex-wrap gap-2">
                    <button v-for="tab in ['malzeme', 'ilan', 'idari', 'teknik', 'benzer']" :key="tab" @click="activeDetailTab = tab" class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all uppercase tracking-wider" :class="activeDetailTab === tab ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'">
                      {{ tab === 'malzeme' ? '📋 Malzeme Listesi' : tab === 'ilan' ? '📣 İhale İlanı' : tab === 'idari' ? '🛡 İdari Şartname' : tab === 'teknik' ? '⚙ Teknik Şartname' : '⏳ Canlı Eksiltme' }}
                    </button>
                  </div>

                  <!-- Sekme İçerikleri -->
                  <div class="bg-white border border-slate-200 rounded-xl p-4 mt-2">
                    <!-- Malzeme Listesi -->
                    <div v-if="activeDetailTab === 'malzeme'">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Malzeme & Birim Fiyat Teklif Formu</h4>
                      <table class="w-full text-xs text-slate-600 border-collapse">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="p-2.5 text-left font-bold text-slate-700">Malzeme/Hizmet Kalemi</th>
                            <th class="p-2.5 text-center font-bold text-slate-700 w-24">Birim</th>
                            <th class="p-2.5 text-right font-bold text-slate-700 w-36">Birim Fiyat Teklifi (₺)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line, idx) in res.material_list.split('\n')" :key="idx" class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                            <td class="p-2.5 font-medium text-slate-800 text-left">{{ line.split('-')[0]?.trim() }}</td>
                            <td class="p-2.5 text-center font-bold text-slate-500">{{ line.split('-')[1]?.trim() || '1 Adet' }}</td>
                            <td class="p-2.5 text-right">
                              <input type="number" placeholder="0.00" class="w-32 text-right bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-600" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <span class="text-[10px] text-slate-400">Teklif vermek ve eksiltmeye katılmak için alıcı/satıcı portal girişi yapmalısınız.</span>
                        <NuxtLink to="/uyelik" class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-xs flex items-center gap-1.5 shadow-sm">
                          Teklif Gönder ve Arenaya Katıl
                        </NuxtLink>
                      </div>
                    </div>

                    <!-- İhale İlanı -->
                    <div v-if="activeDetailTab === 'ilan'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Resmi İlan Özeti</h4>
                      <p>{{ res.description }} Bu ihale özel sektör satın alma kurallarına uygun olarak gelanlasalim.com altyapısında canlı eksiltme usulüyle yapılmaktadır.</p>
                    </div>

                    <!-- İdari Şartname -->
                    <div v-if="activeDetailTab === 'idari'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">İdari Şartname Maddeleri</h4>
                      <pre class="whitespace-pre-line font-sans">{{ res.admin_spec }}</pre>
                    </div>

                    <!-- Teknik Şartname -->
                    <div v-if="activeDetailTab === 'teknik'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Teknik Şartname & Yeterlilik</h4>
                      <pre class="whitespace-pre-line font-sans">{{ res.tech_spec }}</pre>
                    </div>

                    <!-- Benzer İhale Geçmişi / Canlı Eksiltme -->
                    <div v-if="activeDetailTab === 'benzer'" class="text-left text-xs leading-relaxed text-slate-600">
                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Sektör Geçmiş Sonuçları</h4>
                      <pre class="whitespace-pre-line font-sans text-emerald-600 font-bold mb-4">{{ res.similar_history }}</pre>

                      <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Güncel Teklif Eksiltme Günlüğü (Audit Trail)
                      </h4>
                      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 font-mono text-[10px] text-slate-400">
                        <div class="flex justify-between">
                          <span>[15:42:01] Tedarikçi #8 (Demir A.Ş.)</span>
                          <span class="text-red-400 font-semibold">- 8.500 ₺ indirim yaptı</span>
                        </div>
                        <div class="flex justify-between">
                          <span>[15:39:12] Tedarikçi #3 (Öz Yapı)</span>
                          <span class="text-red-400 font-semibold">- 12.000 ₺ indirim yaptı</span>
                        </div>
                        <div class="flex justify-between">
                          <span>[15:35:50] Sistem</span>
                          <span class="text-slate-500">İhale canlı eksiltme aşamasına geçti</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sonuç Yok -->
              <div v-if="filteredTenders.length === 0" class="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Search :size="32" class="mx-auto text-slate-300 mb-3" />
                <h3 class="text-sm font-black text-slate-800">Arama Kriterlerine Uygun İhale Bulunamadı</h3>
                <p class="text-xs text-slate-500 mt-1">Lütfen filtre seçeneklerini değiştirerek yeniden arayın.</p>
                <button @click="clearFilters" class="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all">Filtreleri Temizle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TASARRUF HESAPLAMA ARACI (ROI) -->
    <section id="ozellikler" class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">VERİMLİLİK & ROI</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Tedarik Tasarrufunuzu Hesaplayın</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">Yıllık satın alma hacminizi belirleyin, GelAnlaşalım B2B tersine ihale arenası ile elde edeceğiniz tahmini kazancı anında görün.</p>
        </div>

        <div class="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-xl shadow-slate-100 flex flex-col gap-8 md:gap-12 text-left">
          <!-- Slider area -->
          <div class="space-y-4">
            <div class="flex justify-between items-baseline">
              <label class="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">Yıllık Satın Alma Hacminiz</label>
              <span class="font-mono text-xl font-black text-blue-600">{{ annualVolume.toLocaleString('tr-TR') }} ₺</span>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="500000"
              v-model.number="annualVolume"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>500 Bin ₺</span>
              <span>25 Milyon ₺</span>
              <span>50 Milyon ₺</span>
            </div>
          </div>

          <!-- Calculated values grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Col 1: Net Savings -->
            <div class="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-blue-600 tracking-wider">Tahmini Yıllık Tasarruf (%14.2)</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ calculatedSavings.toLocaleString('tr-TR') }} ₺</span>
              <span class="text-[10px] text-slate-400">Canlı eksiltme arenaları ortalama verisidir.</span>
            </div>

            <!-- Col 2: Labor hours saved -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Kazanılan İş Gücü</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ Math.round(savedHours) }} Adam/Ay</span>
              <span class="text-[10px] text-slate-400">Excel kıyaslama ve e-posta takibi elenir.</span>
            </div>

            <!-- Col 3: Qualified suppliers reached -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Nitelikli Tedarikçi Erişimi</span>
              <span class="font-mono text-2xl font-black text-slate-955 tracking-tight">{{ connectedSuppliersCount }} Firma</span>
              <span class="text-[10px] text-slate-400">İhalelerinize katılım sağlayacak hazır ağ.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- KRİPTOGRAFİK ZAMAN DAMGASI & GÜVENLİK (AUDIT TRAIL TIMELINE) -->
    <section class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-16">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">ŞEFFAFLIK & GÜVENLİK</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Kriptografik ve Damgalı İşlem Takibi</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">Satın alma süreçleriniz, KVKK ve Türk Ticaret Kanunu uyumlu, TLS 1.2+ şifreli ve zaman damgalı değişmez bir log günlüğünde saklanır.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 relative text-left">
          <!-- Connector line for desktop -->
          <div class="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0"></div>

          <!-- Step 1 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">1</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">Şartname Damgalama</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                Yayınladığınız şartname dosyalarının kriptografik hash kodları çıkarılarak sisteme damgalanır. Dosya değişmezliği garanti altındadır.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">2</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">TLS 1.2+ Şifreli Teklifler</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                Tedarikçilerin gönderdiği fiyat ve belgeler SSL/TLS katmanında şifrelenir. Son teklif tarihine kadar kimse tarafından deşifre edilemez.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">3</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">Canlı Eksiltme Günlüğü</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                Ters ihale arenalarındaki her fiyat düşüşü, zaman damgasıyla değişmez denetim izine (audit trail) yazılır. Rekabet şeffaftır.
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="relative z-10 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-4">
            <div class="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/10">4</div>
            <div>
              <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">KVKK Uyumlu Arşivleme</h4>
              <p class="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
                Sonuçlanan ihaleler yasal saklama sürelerine uygun olarak güvenli sunucularda saklanır. Şirket içi denetimlere (audit) anında hazırdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ERP & SİSTEM ENTEGRASYONLARI -->
    <section class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">ERP BAĞLANTILARI</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Kurumsal Sistemlerinizle Tam Entegrasyon</h2>
          <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">Satın alma, teklif, sipariş ve tedarikçi verilerinizi mevcut ERP, CRM ve finans sistemlerinize kontrollü API entegrasyonu ile bağlayın.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <!-- ERP Card 1: SAP -->
          <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">SAP Entegrasyonu</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                Satın alma taleplerinizi (Purchase Requisitions) SAP üzerinden otomatik çekin; ihale sonuçlarını SAP sipariş fişi (Purchase Order) olarak geri aktarın.
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">ERP CONNECTED</span>
          </div>

          <!-- ERP Card 2: Logo -->
          <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">Logo & Netsis Entegrasyonu</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                Logo Tiger, Go3 veya Netsis sistemlerinizdeki malzeme kartlarını, birimlerini ve tedarikçi cari hesaplarını anlık olarak platformla senkronize edin.
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">API READY</span>
          </div>

          <!-- ERP Card 3: MS Dynamics -->
          <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">Microsoft Dynamics 365</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                Dynamics 365 Supply Chain Management modülüyle iki yönlü canlı veri eşleştirmesi sağlayarak teklif toplama süreçlerinizi hızlandırın.
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">AUTOMATED SYNC</span>
          </div>

          <!-- ERP Card 4: Excel & REST API -->
          <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="text-sm font-black text-slate-800 tracking-tight mb-2">REST API & Excel Entegrasyonu</div>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium font-sans">
                Özel şirket içi yazılımlarınız için RESTful API uç noktaları. Veya tek tıkla gelişmiş Excel tablosu yükleme ve karşılaştırma aracı.
              </p>
            </div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider">RESTFUL API / XLS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- NASIL ÇALIŞIR SECTION -->
    <section id="nasil-calisir" class="border-b border-slate-200 bg-slate-50 py-20">
      <div class="mx-auto max-w-7xl px-6 text-center">
        <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">SÜREÇ REHBERİ</span>
        <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Platform Nasıl Çalışıyor?</h2>
        <p class="mt-3 max-w-xl mx-auto text-xs text-slate-500">Alıcı veya tedarikçi rolünüze uygun adımları takip ederek süreci başlatın.</p>

        <!-- Tab switcher -->
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-full border border-slate-200 bg-white p-1">
            <button @click="activeAudience = 'buyer'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'buyer' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              Alıcı Şirketler İçin
            </button>
            <button @click="activeAudience = 'supplier'" class="rounded-full px-6 py-2.5 text-xs font-bold transition-all" :class="activeAudience === 'supplier' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'">
              Tedarikçi Firmalar İçin
            </button>
          </div>
        </div>

        <!-- Steps Grid -->
        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
          <div v-for="step in activeSteps" :key="step.number" class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
            <div class="text-3xl font-serif font-black text-blue-600/30">{{ step.number }}</div>
            <h3 class="text-base font-black text-slate-900">{{ step.title }}</h3>
            <p class="text-xs leading-relaxed text-slate-500 font-medium">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section id="sss" class="border-b border-slate-200 bg-white py-20">
      <div class="mx-auto max-w-4xl px-6">
        <div class="text-center mb-12">
          <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">SIKÇA SORULANLAR</span>
          <h2 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl">Merak Edilen Konular</h2>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, idx) in faqs" :key="idx" class="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
            <button @click="openFaq = openFaq === idx ? null : idx" class="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-xs sm:text-sm">
              <span>{{ faq.question }}</span>
              <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': openFaq === idx }" />
            </button>
            <div v-show="openFaq === idx" class="p-5 border-t border-slate-200 bg-white text-xs leading-relaxed text-slate-600">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BİZİMLE İLETİŞİME GEÇİN SECTION -->
    <section class="border-b border-slate-200 bg-slate-50 py-20 relative overflow-hidden">
      <!-- Background subtle graphics -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, #2563eb 1px, transparent 1px); background-size: 24px 24px;"></div>
      
      <div class="mx-auto max-w-7xl px-6 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Content -->
          <div class="lg:col-span-6 text-left space-y-8">
            <div class="space-y-4">
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">BİZİMLE İLETİŞİME GEÇİN</span>
              <h2 class="text-3xl font-black text-slate-900 tracking-tight md:text-5xl leading-tight">
                Satın alma süreçlerinizi <br class="hidden sm:inline" />
                <span class="text-blue-600 italic">tek panelde toplayın.</span>
              </h2>
              <p class="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium max-w-md">
                Ekibimiz satın alma süreçlerinizde size yardımcı olmaya hazır. İletişim bilgilerinizi bırakın, en kısa sürede dönüş yapalım.
              </p>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">Ücretsiz kurumsal hesap</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">KVKK kapsamında altyapı</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">Hızlı onboarding</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                  <CheckCircle2 :size="16" />
                </div>
                <span class="text-xs font-black text-slate-800 tracking-wide">Yerli destek ekibi</span>
              </div>
            </div>
          </div>

          <!-- Right Form Card -->
          <div class="lg:col-span-6">
            <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6 text-left">
              <div class="space-y-1">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">SİZİNLE İLETİŞİME GEÇELİM</span>
                <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">BİZE NASIL ULAŞALIM?</h3>
              </div>

              <!-- Contact Method Toggle Tabs -->
              <div class="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border">
                <button
                  type="button"
                  @click="contactMethod = 'email'"
                  class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                  :class="contactMethod === 'email' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                >
                  E-posta
                </button>
                <button
                  type="button"
                  @click="contactMethod = 'phone'"
                  class="rounded-lg py-2.5 text-xs font-bold text-center transition-all"
                  :class="contactMethod === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'"
                >
                  Telefon
                </button>
              </div>

              <!-- Inputs -->
              <div class="space-y-4">
                <!-- E-posta field -->
                <div v-if="contactMethod === 'email'">
                  <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">E-posta Adresiniz</label>
                  <input
                    v-model="contactEmail"
                    type="email"
                    placeholder="ornek@sirket.com.tr"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <!-- Telefon field -->
                <div v-else>
                  <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">Telefon Numaranız</label>
                  <input
                    v-model="contactPhone"
                    type="tel"
                    placeholder="+90 (555) 555 55 55"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <!-- Message field -->
                <div>
                  <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">Size nasıl yardımcı olabiliriz?</label>
                  <textarea
                    v-model="contactMessage"
                    rows="3"
                    placeholder="Taleplerinizi belirtin..."
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="contactError" class="text-[11px] font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle :size="12" /> {{ contactError }}
              </div>

              <!-- Submit button -->
              <button
                type="button"
                @click="submitContactForm"
                :disabled="contactSubmitted"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 disabled:opacity-60"
              >
                <span v-if="contactSubmitted">Gönderiliyor...</span>
                <span v-else class="flex items-center gap-1">Gönder <ArrowRight :size="14" /></span>
              </button>

              <!-- Footer Sublinks -->
              <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 pt-2">
                <a href="#nasil-calisir" class="hover:text-blue-600 transition-colors">Önce nasıl çalıştığını inceleyin →</a>
                <NuxtLink to="/uyelik" class="hover:text-blue-600 transition-colors">Kurumsal hesap aç →</NuxtLink>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- COOKIES CONSENT BANNER -->
    <transition name="fade">
      <div v-if="showCookieConsent" class="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl text-left flex flex-col gap-3">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          🍪 Çerez Onayı & KVKK
        </h4>
        <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
          Platform kullanım deneyiminizi optimize etmek ve güvenli bir B2B ihale süreci sağlamak adına çerezleri kullanıyoruz.
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="showCookieConsent = false" class="rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-black text-white hover:bg-blue-700 transition-colors">
            Kabul Et
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>