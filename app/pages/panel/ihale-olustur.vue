<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AlertCircle, Calendar, UploadCloud, FileText, FileSpreadsheet, FileCode, X, Camera, Eye, Trash2, Plus, ShieldAlert, FileCheck, CheckCircle2, FilePlus2, ArrowLeft, Pencil, CreditCard, MapPin, Lock } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import DeepSeekAssistantModal from '~/components/ai/DeepSeekAssistantModal.vue'
import { useDeepSeekAgent } from '~/composables/useDeepSeekAgent'
import { usePublicApis } from '~/composables/usePublicApis'
import CategorySpecificFields from '~/components/tender/CategorySpecificFields.vue'
import { resolveSectorKey } from '~/utils/categoryFieldsSchema'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const route = useRoute()
const { cmsData, saveCmsData } = useCmsData()
const { fetchTrHolidays, trPublicHolidays } = usePublicApis()

const editingTenderId = ref<string | null>(null)
const isEditMode = computed(() => Boolean(editingTenderId.value))
const existingTender = ref<any>(null)

// Sektöre Özgü Dinamik Şartname Parametreleri
const categorySpecificData = ref<Record<string, any>>({})
const currentSectorKey = ref<string>('gayrimenkul_arsa')

// Şartname Belirleme Yöntemi: 'upload' (Kendi dosyasını yükleme) | 'platform' (Platform akıllı şartname formu) | 'both' (Her ikisi)
const specMethod = ref<'upload' | 'platform' | 'both'>('upload')

function handleSectorChanged(key: string) {
  currentSectorKey.value = key
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)

const isBudgetUnspecified = ref(true)
const showAdvancedOptions = ref(false)
const form = ref({
  ihaleYonu: 'kapali_zarf', // 'kapali_zarf' | 'eksiltme' | 'artirma' | 'sabit_paket' | 'ihalesiz_ilan'
  netFiyat: '',
  ilanTuru: 'satis' as 'satis' | 'alim',
  stokMiktar: '',
  stokBirim: 'Adet',
  pazarlikDurumu: 'net' as 'net' | 'pazarlikli',
  visibility: 'public' as 'public' | 'private_invited',
  invitedSuppliers: '',
  baslik: '',
  kategori: 'Gayrimenkul',
  sure: '7 gün',
  minButce: '',
  maxButce: '',
  butce: '',
  kisiBasiFiyat: '',
  currency: 'TRY', // TND-005
  vatType: 'vat_included', // TND-005
  minStep: 1000, // TND-009
  reservePrice: '', // TND-008
  minBidsCount: 1, // TND-011
  awardMode: 'ALL_OR_NOTHING', // TND-003, TND-004
  kalemler: [] as Array<{ id: string; ad: string; miktar: number; birim: string; teknikAciklama?: string }>, // TND-002
  hedefKontenjan: 40,
  paketDahilHizmetler: [] as string[],
  aciklama: '',
  sehir: 'Balıkesir',
  teslimatAdresi: '',
  ownerPhone: '',
  ownerEmail: '',
  ownerCompany: '',
  websiteUrl: '',
  odemeYontemi: '🛡️ İhaleciBurada Güvenli Emanet Havuz (Escrow - Mal Kabul Onaylı)',
  faturaTuru: '🏢 Kurumsal E-Fatura (%20 KDV)',
  images: [] as { url: string; name: string }[],
  files: [] as { name: string; size: string; progress: number; type: string }[]
})

function addKalem() {
  form.value.kalemler.push({
    id: 'KLM-' + (form.value.kalemler.length + 1),
    ad: '',
    miktar: 1,
    birim: 'Adet',
    teknikAciklama: ''
  })
}

function removeKalem(index: number) {
  form.value.kalemler.splice(index, 1)
}

function toggleFeature(feat: string) {
  const idx = form.value.paketDahilHizmetler.indexOf(feat)
  if (idx >= 0) {
    form.value.paketDahilHizmetler.splice(idx, 1)
  } else {
    form.value.paketDahilHizmetler.push(feat)
  }
}

onMounted(async () => {
  await fetchTrHolidays(2026)
})

// Calculate deadline excluding official holidays
const estimatedDeadlineDate = computed(() => {
  const days = parseInt(form.value.sure) || 7
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })
})

const selectedSubcategory = ref('')

// Dinamik İhale & İlan Başlığı Placeholder
const titlePlaceholder = computed(() => {
  const cat = String(form.value.kategori || '').toLowerCase()
  const sub = String(selectedSubcategory.value || '').toLowerCase()
  if (cat.includes('gayrimenkul') || isRealEstateCategory.value) {
    if (sub.includes('arsa') || sub.includes('tarla') || sub.includes('arazi') || sub.includes('bağ') || sub.includes('bahçe') || sub.includes('çiftlik')) {
      return "Örn: Çanakkale Kepez'de 1.500 m² %50 Kat Karşılığı Konut İmarlı Arsa"
    }
    if (sub.includes('işyeri') || sub.includes('dükkan') || sub.includes('ofis') || sub.includes('plaza') || sub.includes('depo') || sub.includes('fabrika') || sub.includes('avm') || sub.includes('otel')) {
      return "Örn: Kadıköy Çarşıda Satılık / Kiralık 120 m² Çift Cepheli Dükkan"
    }
    return "Örn: Kadıköy Moda'da 3+1 145 m² Geniş Balkonlu İskânlı Satılık Daire"
  }
  if (cat.includes('peyzaj') || sub.includes('peyzaj') || sub.includes('bahçe') || sub.includes('fidan') || sub.includes('çim')) {
    return "Örn: Bodrum Yalıkavak'ta 2.500 m² Lüks Villa Peyzaj Projesi & Otomatik Sulama Uygulaması"
  }
  if (cat.includes('araç') || cat.includes('makine')) {
    return 'Örn: 2023 Model 5 Adet Dizel Forklift veya Ekskavatör Kiralama'
  }
  if (cat.includes('inşaat') || cat.includes('yapı')) {
    return 'Örn: Anahtar Teslim Konut İnşaatı Kaba & İnce İşçilik Alımı'
  }
  if (cat.includes('mühendislik') || cat.includes('mimarlık')) {
    return 'Örn: Kadıköy Konut Projesi Statik & Mimari Çizim ve Zemin Etüdü'
  }
  return 'Örn: 20.000 Adet Mukavva Kutu Alımı veya Malzeme Tedariği'
})

// Dinamik Şartname & Açıklama Placeholder
const descPlaceholder = computed(() => {
  if (isRealEstateCategory.value) {
    return "Örn: Kadıköy Moda merkezde, sahile ve metroya 5 dakika yürüme mesafesinde, 145 m² brüt, 3+1, kombili, çift balkonlu, güney cepheli, masrafsız lüks satılık daire. Krediye tam uygundur, takas teklifleri değerlendirilebilir..."
  }
  const cat = String(form.value.kategori || '').toLowerCase()
  const sub = String(selectedSubcategory.value || '').toLowerCase()
  if (cat.includes('peyzaj') || sub.includes('peyzaj')) {
    return "Örn: 2.500 m² ortak ve özel bahçe alanı için peyzaj mimarlığı projelendirme, rulo çim serme, ithal palmiye dikimi, otomatik rotor sulama sistemi montajı yapılacaktır. Detaylı teknik projeler ve keşif metrajları web sitemizde yer almaktadır..."
  }
  return "İhaleye ait teslimat süreleri, teknik şartnameler, kalite belgeleri (ISO, CE vb.) ve muayene kabul şartlarını buraya yazabilirsiniz..."
})

// Yalnızca Ev / Arsa / Gayrimenkul kategorilerinde şartname kriter formu geçerlidir
const isRealEstateCategory = computed(() => {
  const cat = String(form.value.kategori || '').toLowerCase()
  const sub = String(selectedSubcategory.value || '').toLowerCase()
  const combined = `${cat} ${sub}`
  return (
    combined.includes('gayrimenkul') ||
    combined.includes('arsa') ||
    combined.includes('arazi') ||
    combined.includes('tarla') ||
    combined.includes('konut') ||
    combined.includes('daire') ||
    combined.includes('villa') ||
    combined.includes('işyeri') ||
    combined.includes('dükkan') ||
    combined.includes('depo') ||
    cat === 'gayrimenkul'
  )
})

// Kategori ev/arsa ise doğrudan platform şartnamesini ve sektör anahtarını devreye sok
watch(
  [() => form.value.kategori, () => selectedSubcategory.value],
  ([newCat, newSub]) => {
    if (isRealEstateCategory.value) {
      specMethod.value = 'platform'
      const detected = resolveSectorKey(newCat, newSub)
      currentSectorKey.value = detected
    } else {
      specMethod.value = 'upload'
      categorySpecificData.value = {}
    }
  },
  { immediate: true }
)

// Subcategory Map (Photo 4 Alt Kategoriler)
const categoryMap = reactive<Record<string, string[]>>({
  'Mühendislik ve Mimarlık Hizmetleri': [
    'Statik & Betonarme Projelendirme',
    'Mimari Tasarım ve 3D Modelleme',
    'Mekanik Tesisat Proje Çizimi',
    'Elektrik Tesisat Proje Çizimi',
    'Zemin Etüdü ve Geoteknik Rapor',
    'Harita, İmar ve Kadastro Danışmanlığı',
    'Yapı Denetim ve Kontrollük Hizmetleri',
    'Kentsel Dönüşüm Danışmanlığı',
    'Enerji Kimlik Belgesi (EKB)',
    'Yangın Algılama ve Tahliye Projesi',
    'Akustik Rapor ve İzolasyon Projesi',
    'İç Mimarlık ve Dekorasyon',
    'Restorasyon ve Rölöve Projesi',
    'Çevre Mühendisliği ve ÇED Raporu',
    'Şantiye ve Proje Yönetimi'
  ],
  'Peyzaj, Çevre Düzenleme ve Bahçe': [
    'Peyzaj Mimarlığı ve Proje Uygulama',
    'Otomatik Bahçe Sulama Sistemleri',
    'Rulo Çim ve Çimlendirme İşleri',
    'Ağaçlandırma ve Fidan Dikimi',
    'Bahçe Bakımı, Çim Biçme ve Budama',
    'Sert Zemin, Kilit Parke ve Bordür Taş İşleri',
    'Süs Havuzları, Şelale ve Gölet Yapımı',
    'Ahşap Kamelya, Pergole, Gazebo ve Çardak',
    'Çit, Tel Örgü ve Panel Çit Sistemleri',
    'Açık Alan Bahçe ve Park Aydınlatması',
    'Dikey Bahçe ve Yeşil Duvar Sistemleri',
    'Toprak Dolgu, Tesviye ve Drenaj',
    'Park ve Çocuk Oyun Alanı Kurulumu',
    'Mevsimlik Çiçeklendirme ve Süs Bitkileri',
    'Zirai İlaçlama ve Gübreleme'
  ],
  'İnşaat ve Yapı': [
    'Anahtar Teslim İnşaat', 'Konut İnşaatı', 'Ticari Bina İnşaatı', 'Fabrika İnşaatı', 'Yol Yapımı',
    'Köprü Yapımı', 'Altyapı Çalışmaları', 'Kanalizasyon', 'İçme Suyu Hatları', 'Doğalgaz Hatları',
    'Elektrik Altyapısı', 'Çatı İşleri', 'Cephe Kaplama', 'Mantolama', 'Boya Badana',
    'Seramik Döşeme', 'Mermer İşleri', 'Demir-Çelik İşleri', 'Kalıp ve İskele', 'Beton İşleri',
    'Asfalt', 'Parke', 'Peyzaj ve Çevre Düzenleme', 'Yıkım İşleri', 'Restorasyon'
  ],
  'Gayrimenkul': [
    'Arsa', 'Tarla', 'Bağ', 'Bahçe', 'Konut', 'Villa', 'Daire', 'Ofis', 'Dükkan', 'Plaza',
    'Fabrika', 'Depo', 'AVM', 'Otel', 'Turistik Tesis', 'Kiralık Gayrimenkul', 'Satılık Gayrimenkul'
  ],
  'Araç ve İş Makineleri': [
    'Otomobil', 'Ticari Araç', 'Kamyon', 'Tır', 'Otobüs', 'Minibüs', 'Traktör', 'İş Makinesi',
    'Ekskavatör', 'Loder', 'Greyder', 'Silindir', 'Forklift', 'Vinç', 'Jeneratör', 'Römork',
    'Araç Kiralama', 'İş Makinesi Kiralama'
  ],
  'Sanayi ve Makine': [
    'Üretim Makineleri', 'CNC', 'Torna', 'Freze', 'Pres', 'Kompresör', 'Konveyör', 'Paketleme Makinesi',
    'Gıda Makinesi', 'Plastik Makinesi', 'Tekstil Makinesi', 'Ahşap İşleme', 'Kaynak Makinesi',
    'Robotik Sistemler', 'Endüstriyel Otomasyon'
  ],
  'Bilgisayar ve Teknoloji': [
    'Masaüstü Bilgisayar', 'Laptop', 'Sunucu', 'Veri Depolama', 'Ağ Sistemleri', 'Firewall',
    'Yazıcı', 'Tarayıcı', 'Yazılım Lisansları', 'ERP', 'CRM', 'Web Yazılımı', 'Mobil Uygulama',
    'Bulut Hizmetleri', 'Siber Güvenlik', 'Yapay Zeka', 'SEO', 'GEO', 'Veri Analizi'
  ],
  'Elektronik': [
    'Telefon', 'Tablet', 'Kamera', 'Güvenlik Kamerası', 'Alarm Sistemleri', 'Televizyon',
    'Ses Sistemleri', 'Projektör', 'UPS', 'Elektronik Kartlar', 'Akıllı Ev Sistemleri'
  ],
  'Mobilya ve Ofis': [
    'Büro Mobilyası', 'Okul Mobilyası', 'Hastane Mobilyası', 'Otel Mobilyası', 'Raf Sistemleri',
    'Dosyalama Sistemleri', 'Toplantı Masaları', 'Ofis Sandalyeleri', 'Bekleme Koltukları'
  ],
  'Sağlık ve Medikal': [
    'Tıbbi Cihazlar', 'Laboratuvar Cihazları', 'Sarf Malzemeleri', 'Hastane Mobilyaları',
    'Ambulans', 'Medikal Gaz Sistemleri', 'Röntgen', 'MR', 'Ultrason', 'Dental Ürünler'
  ],
  'Eğitim': [
    'Akıllı Tahta', 'Bilgisayar Laboratuvarı', 'Eğitim Yazılımları', 'Online Eğitim',
    'Eğitim Danışmanlığı', 'Kurs Hizmetleri', 'Kitap', 'Kırtasiye', 'Laboratuvar Malzemeleri'
  ],
  'Gıda ve Catering': [
    'Hazır Yemek', 'Catering', 'Personel Yemeği', 'Kumanya', 'Et Ürünleri', 'Süt Ürünleri',
    'Sebze Meyve', 'Unlu Mamuller', 'İçecek', 'Kuru Gıda'
  ],
  'Tekstil ve Giyim': [
    'İş Elbiseleri', 'Okul Kıyafetleri', 'Güvenlik Kıyafetleri', 'Promosyon Tekstil',
    'Ayakkabı', 'Bot', 'Eldiven', 'Kişisel Koruyucu Donanım'
  ],
  'Tarım ve Hayvancılık': [
    'Gübre', 'Tohum', 'Sulama Sistemleri', 'Tarım Makinaları', 'Traktör', 'Sera', 'Hayvan Yemi',
    'Veteriner Ürünleri', 'Büyükbaş', 'Küçükbaş', 'Kanatlı Hayvan'
  ],
  'Enerji': [
    'Güneş Enerjisi', 'Rüzgar Enerjisi', 'Jeneratör', 'Elektrik Malzemeleri', 'Trafo',
    'LED Aydınlatma', 'Enerji Verimliliği', 'Şarj İstasyonları'
  ],
  'Çevre ve Geri Dönüşüm': [
    'Atık Yönetimi', 'Geri Dönüşüm', 'Hurda', 'Çevre Danışmanlığı', 'Arıtma Tesisi',
    'Tehlikeli Atık', 'Sıfır Atık', 'Temizlik Araçları'
  ],
  'Lojistik ve Taşımacılık': [
    'Karayolu Taşımacılığı', 'Denizyolu', 'Havayolu', 'Demiryolu', 'Depolama', 'Soğuk Zincir',
    'Kargo', 'Kurye', 'Nakliye'
  ],
  'Güvenlik Sistemleri': [
    'Kamera Sistemleri', 'Alarm Sistemleri', 'Yangın Alarmı', 'Kartlı Geçiş', 'Turnike',
    'X-Ray', 'Bariyer', 'Bekçi Tur Sistemi'
  ],
  'Temizlik Hizmetleri': [
    'Bina Temizliği', 'Hastane Temizliği', 'Okul Temizliği', 'Fabrika Temizliği', 'Cam Temizliği',
    'Halı Yıkama', 'İlaçlama', 'Çöp Toplama'
  ],
  'Turizm ve Konaklama': [
    'Otel Hizmeti', 'Konaklama', 'Uçak Bileti', 'Araç Kiralama', 'Organizasyon', 'Rehberlik',
    'Tur Paketleri'
  ],
  'Reklam ve Medya': [
    'Dijital Pazarlama', 'SEO', 'GEO', 'Google Ads', 'Sosyal Medya Yönetimi', 'Grafik Tasarım',
    'Logo Tasarımı', 'Baskı Hizmetleri', 'Video Prodüksiyon', 'Fotoğraf Çekimi', 'Tanıtım Filmi'
  ],
  'Ambalaj ve Baskı': [
    'Karton Kutu', 'Etiket', 'Poşet', 'Koli', 'Promosyon Ürünleri', 'Matbaa', 'Dijital Baskı',
    'Ofset Baskı'
  ],
  'Telekomünikasyon': [
    'Fiber Altyapı', 'IP Telefon', 'Santral', 'İnternet Hizmeti', 'GSM Hizmetleri', 'Baz İstasyonu'
  ],
  'Danışmanlık': [
    'Hukuk Danışmanlığı', 'Mali Müşavirlik', 'İnsan Kaynakları', 'Kalite Yönetimi',
    'ISO Belgelendirme', 'Proje Danışmanlığı', 'Eğitim Danışmanlığı'
  ],
  'Sigorta': [
    'Araç Sigortası', 'Sağlık Sigortası', 'İş Yeri Sigortası', 'Nakliyat Sigortası',
    'İnşaat Sigortası', 'Hayat Sigortası'
  ],
  'Finans': [
    'Finansal Danışmanlık', 'Leasing', 'Faktoring', 'Kredi Hizmetleri', 'POS Hizmetleri',
    'Ödeme Sistemleri'
  ],
  'Hukuk Hizmetleri': [
    'Avukatlık', 'Arabuluculuk', 'İcra Takibi', 'Sözleşme Hazırlama', 'Marka Tescili',
    'Patent İşlemleri'
  ],
  'Bakım ve Onarım': [
    'Elektrik Bakımı', 'Mekanik Bakım', 'Asansör Bakımı', 'Klima Bakımı', 'Makine Bakımı',
    'Bilgisayar Bakımı', 'Sunucu Bakımı'
  ],
  'Organizasyon ve Etkinlik': [
    'Düğün, Nişan, Kına & Nikah Organizasyonu',
    'Doğum Günü, Baby Shower & Özel Parti',
    'Evlilik Teklifi & Sürpriz Organizasyonları',
    'Toplu Yeme-İçme & İftar Organizasyonları',
    'Konser, Festival, Sahne & Müzik Organizasyonları',
    'Kurumsal Etkinlik, Kongre, Fuar & Lansman',
    'Catering & Kokteyl Hizmetleri',
    'Ses, Işık, Truss & Sahne Sistemleri',
    'Mezuniyet, Balo & Özel Gün Kutlamaları',
    'Sünnet & Dini Merasim Organizasyonları',
    'Fuar Standı Kurulumu & Hostes Hizmetleri'
  ],
  'Turizm, Hac-Umre ve Gezi Turları': [
    'Hac ve Umre Organizasyon Paketleri',
    'Yurt Dışı Kültür & Turistik Tatil Turları',
    'Yurt İçi Kültür & Doğa Gezileri',
    'Günübirlik Turlar & Boğaz / Tekne Gezileri',
    'Okul, Üniversite & Gençlik Turları',
    'Kurumsal Bayi & Teşvik (Incentive) Gezileri',
    'Otel, Konaklama & Havalimanı Transfer Hizmetleri',
    'Vize Danışmanlığı & Seyahat Sigortası'
  ],
  'Diğer': [
    'Muhtelif Alımlar', 'Karma İhaleler', 'Özel Projeler', 'Açık Artırmalar', 'Tasfiye Satışları',
    'Hurda Satışları', 'İkinci El Ürünler'
  ]
})

const categories = computed(() => Object.keys(categoryMap))

const currentSubcategories = computed(() => {
  return categoryMap[form.value.kategori] || ['Genel', 'Diğer']
})

watch(() => form.value.kategori, (newCat) => {
  const subs = categoryMap[newCat]
  if (subs && subs.length > 0) {
    if (!subs.includes(selectedSubcategory.value)) {
      selectedSubcategory.value = subs[0]
    }
  }
}, { immediate: true })

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

const durations = [
  '3 gün',
  '5 gün',
  '7 gün',
  '10 gün',
  '15 gün',
  '30 gün'
]

const paymentMethods = [
  '🛡️ İhaleciBurada Güvenli Emanet Havuz (Escrow - Mal Kabul Onaylı)',
  '🤝 Mal Tesliminde Peşin Banka Havalesi / EFT',
  '📄 30 Gün Vadeli Ticari Çek / Havale',
  '📄 60 Gün Vadeli Ticari Ödeme',
  '📄 90 Gün Vadeli Kurumsal Ödeme',
  '💳 3D Secure Kurumsal Kredi Kartı',
  '🏛️ Akreditifli (L/C) Banka Teminatlı Ödeme'
]

const invoiceTypes = [
  '🏢 Kurumsal E-Fatura (%20 KDV)',
  '📑 Tevkifatlı E-Fatura (Satın Alma Türüne Göre)',
  '🌱 KDV Muaf / İstisnalı Fatura',
  '📄 Serbest Meslek Makbuzu / Hizmet Faturası'
]

const hasDraft = ref(false)

async function loadTenderForEdit(tenderId: string) {
  try {
    let tender: any = null
    // 1. Check local storage
    if (typeof window !== 'undefined') {
      try {
        const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        tender = myTenders.find((t: any) => t.id === tenderId)
      } catch (e) {}
    }
    // 2. Check cmsData
    if (!tender && cmsData.value?.dashboard?.tenders) {
      tender = cmsData.value.dashboard.tenders.find((t: any) => t.id === tenderId)
    }
    // 3. Fetch from server API
    if (!tender) {
      try {
        const res = await $fetch<{ success: boolean; tenders: any[] }>('/api/tenders')
        if (res && res.tenders) {
          tender = res.tenders.find((t: any) => t.id === tenderId)
        }
      } catch (e) {}
    }

    if (!tender) {
      alert(`⚠️ #${tenderId} numaralı ihale bulunamadı.`)
      return
    }

    existingTender.value = tender
    form.value.baslik = tender.baslik || ''
    form.value.ihaleYonu = tender.ihaleYonu || (tender.tur?.includes('Eksiltme') ? 'eksiltme' : (tender.tur?.includes('Artırma') ? 'artirma' : (tender.tur?.includes('Paket') ? 'sabit_paket' : (tender.tur?.includes('İhalesiz') ? 'ihalesiz_ilan' : 'kapali_zarf'))))
    if (tender.netFiyat) form.value.netFiyat = tender.netFiyat
    if (tender.ilanTuru) form.value.ilanTuru = tender.ilanTuru
    if (tender.stokMiktar) form.value.stokMiktar = tender.stokMiktar
    if (tender.stokBirim) form.value.stokBirim = tender.stokBirim
    if (tender.pazarlikDurumu) form.value.pazarlikDurumu = tender.pazarlikDurumu
    
    // Category mapping
    if (tender.mainCategory) {
      form.value.kategori = tender.mainCategory
      selectedSubcategory.value = tender.subCategory || ''
    } else if (tender.kategori && tender.kategori.includes('/')) {
      const parts = tender.kategori.split('/')
      form.value.kategori = parts[0].trim()
      selectedSubcategory.value = parts[1].trim()
    } else if (tender.kategori) {
      form.value.kategori = tender.kategori
      selectedSubcategory.value = tender.subCategory || ''
    }

    form.value.sure = tender.sure || '7 gün'
    form.value.butce = tender.butce || ''
    if (tender.butce && !tender.butce.includes('Teklif Usulü')) {
      isBudgetUnspecified.value = false
    }
    form.value.sehir = tender.city || 'Balıkesir'
    form.value.teslimatAdresi = tender.teslimatAdresi || ''
    form.value.aciklama = tender.aciklama || ''
    if (tender.odemeYontemi) form.value.odemeYontemi = tender.odemeYontemi
    if (tender.faturaTuru) form.value.faturaTuru = tender.faturaTuru
    if (tender.currency) form.value.currency = tender.currency
    if (tender.vatType) form.value.vatType = tender.vatType
    if (tender.minStep) form.value.minStep = tender.minStep
    if (tender.reservePrice) form.value.reservePrice = String(tender.reservePrice)
    if (tender.minBidsCount) form.value.minBidsCount = tender.minBidsCount
    if (tender.awardMode) form.value.awardMode = tender.awardMode
    if (tender.kisiBasiFiyat) form.value.kisiBasiFiyat = tender.kisiBasiFiyat
    if (tender.hedefKontenjan) form.value.hedefKontenjan = tender.hedefKontenjan
    if (Array.isArray(tender.paketDahilHizmetler)) form.value.paketDahilHizmetler = [...tender.paketDahilHizmetler]
    
    if (Array.isArray(tender.kalemler) && tender.kalemler.length > 0) {
      form.value.kalemler = JSON.parse(JSON.stringify(tender.kalemler))
    }
    if (Array.isArray(tender.images) && tender.images.length > 0) {
      form.value.images = JSON.parse(JSON.stringify(tender.images))
    } else if (tender.image) {
      form.value.images = [{ url: tender.image, name: 'Kapak Görseli' }]
    }
    if (Array.isArray(tender.files) && tender.files.length > 0) {
      form.value.files = JSON.parse(JSON.stringify(tender.files))
    }
    if (tender.categorySpecificData || tender.customFields) {
      categorySpecificData.value = JSON.parse(JSON.stringify(tender.categorySpecificData || tender.customFields))
    }
    if (tender.sectorKey) {
      currentSectorKey.value = tender.sectorKey
    }
    if (tender.websiteUrl) form.value.websiteUrl = tender.websiteUrl
    if (tender.ownerPhone) form.value.ownerPhone = tender.ownerPhone
    if (tender.ownerEmail) form.value.ownerEmail = tender.ownerEmail
    if (tender.ownerCompany) form.value.ownerCompany = tender.ownerCompany
  } catch (err) {
    console.error('Failed to load tender for editing:', err)
  }
}

onMounted(async () => {
  // Panelden adres ve iletişim bilgilerini otomatik çekme (Pre-fill)
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (session) {
        if (session.city || session.il) form.value.sehir = session.city || session.il
        if (session.address || session.adres) form.value.teslimatAdresi = session.address || session.adres
        if (session.phone || session.telefon) form.value.ownerPhone = session.phone || session.telefon
        if (session.email) form.value.ownerEmail = session.email
        if (session.companyName || session.company) form.value.ownerCompany = session.companyName || session.company
        if (session.website || session.webSitesi) form.value.websiteUrl = session.website || session.webSitesi
      }
    } catch (e) {}
  }

  const editId = route.query.edit as string | undefined
  if (editId) {
    editingTenderId.value = editId
    await loadTenderForEdit(editId)
  } else if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tenderDraft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.baslik) {
          hasDraft.value = true
        }
      } catch (e) {}
    }
  }
})

function loadDraft() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tenderDraft')
    if (saved) {
      form.value = JSON.parse(saved)
      hasDraft.value = false
    }
  }
}

function saveDraftManually() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tenderDraft', JSON.stringify(form.value))
    alert(locale.value === 'tr' ? 'İhale taslağınız başarıyla kaydedildi!' : 'Your draft tender has been saved!')
  }
}

function clearDraft() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tenderDraft')
    hasDraft.value = false
  }
}

const showSuccess = ref(false)
const createdId = ref('')
const submittedTenderSummary = ref<any>(null)

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function triggerImageSelect() {
  imageInputRef.value?.click()
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const reader = new FileReader()
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string
      if (!rawDataUrl) return

      try {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxDimension = 500
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const compressed = canvas.toDataURL('image/jpeg', 0.6)
            form.value.images.push({
              url: compressed,
              name: file.name
            })
          } else {
            form.value.images.push({
              url: rawDataUrl,
              name: file.name
            })
          }
        }
        img.src = rawDataUrl
      } catch (err) {
        form.value.images.push({
          url: rawDataUrl,
          name: file.name
        })
      }
    }
    reader.readAsDataURL(file)
  }
  target.value = ''
}

function removeImage(index: number) {
  form.value.images.splice(index, 1)
}

function addSampleImage(url: string, name: string) {
  form.value.images.push({ url, name })
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    let fileType = 'word'
    const lowerName = file.name.toLowerCase()
    if (lowerName.endsWith('.pdf')) fileType = 'pdf'
    else if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) fileType = 'excel'
    else if (lowerName.endsWith('.dwg') || lowerName.endsWith('.dxf')) fileType = 'cad'

    form.value.files.push({
      name: file.name,
      size: fileSizeMB,
      progress: 100,
      type: fileType
    })
  }
  target.value = ''
}

function removeFile(index: number) {
  form.value.files.splice(index, 1)
}


const titleInputRef = ref<HTMLInputElement | null>(null)
const isSubmittingTender = ref(false)
const showDeepSeekModal = ref(false)
const { inspectTenderAutonomous, checkAccountCompleteness, generateTenderDraftWithAi, getPopularTenderTemplates } = useDeepSeekAgent()

// 🌟 Kategori Öneri Modalı State & Handlers
const showSuggestModal = ref(false)
const suggestSuccess = ref(false)
const suggestedCategory = ref('')
const suggestedDesc = ref('')
const isSubmittingSuggestion = ref(false)

function submitCategorySuggestion() {
  const cat = suggestedCategory.value.trim()
  if (!cat) {
    alert('Lütfen önermek istediğiniz kategori adını yazınız.')
    return
  }

  isSubmittingSuggestion.value = true

  // 1. Dinamik olarak categoryMap'e ekle (Kullanıcı beklemeden hemen ilanını verebilir)
  if (!categoryMap[cat]) {
    categoryMap[cat] = ['Genel', 'Diğer', `${cat} Hizmetleri`, `${cat} Malzemeleri`]
  }

  // 2. Seçili kategoriyi önerilen kategori yap ve formu güncelle
  form.value.kategori = cat
  selectedSubcategory.value = 'Genel'

  // 3. Başarılı bildirimi göster
  suggestSuccess.value = true

  // 4. Öneriyi yerel hafızaya kaydet
  try {
    const existing = JSON.parse(localStorage.getItem('suggested_categories') || '[]')
    existing.push({
      category: cat,
      desc: suggestedDesc.value,
      date: new Date().toISOString()
    })
    localStorage.setItem('suggested_categories', JSON.stringify(existing))
  } catch (e) {}

  setTimeout(() => {
    suggestSuccess.value = false
    suggestedCategory.value = ''
    suggestedDesc.value = ''
    showSuggestModal.value = false
    isSubmittingSuggestion.value = false
  }, 1200)
}

// 🤖 DeepSeek AI İhale Hazırlama Asistanı State
const aiPromptInput = ref('')
const isGeneratingAiSpec = ref(false)
const generatedAiDraft = ref<any>(null)
const showTemplatePicker = ref(false)
const popularTemplates = getPopularTenderTemplates()

async function generateSpecWithAi() {
  if (!aiPromptInput.value || !aiPromptInput.value.trim()) {
    alert('Lütfen ne almak veya satmak istediğinizi birkaç kelimeyle yazınız (Örn: 500 ton inşaat demiri, 20.000 adet koli vb.)')
    return
  }
  isGeneratingAiSpec.value = true
  try {
    const draft = await generateTenderDraftWithAi(aiPromptInput.value, form.value.kategori || 'İnşaat ve Yapı', form.value.sehir || 'Balıkesir')
    generatedAiDraft.value = draft
  } finally {
    isGeneratingAiSpec.value = false
  }
}

function applyDraftToForm(draft: any) {
  if (!draft) return
  form.value.baslik = draft.title
  form.value.aciklama = draft.description
  if (draft.category) form.value.kategori = draft.category
  if (draft.subCategory) selectedSubcategory.value = draft.subCategory
  if (draft.city) form.value.sehir = draft.city
  if (draft.minBudget) form.value.minButce = draft.minBudget
  if (draft.maxBudget) form.value.maxButce = draft.maxBudget
  if (draft.sure) form.value.sure = draft.sure
  isBudgetUnspecified.value = false
  generatedAiDraft.value = null
  showTemplatePicker.value = false
  alert('✨ DeepSeek tarafından hazırlanan profesyonel şartname ve ihale bilgileri forma başarıyla aktarıldı!')
}

function appendQuickClause(clauseText: string) {
  if (!form.value.aciklama) form.value.aciklama = ''
  form.value.aciklama = form.value.aciklama.trim() + '\n\n' + clauseText
}

async function handleSubmit() {
  if (isSubmittingTender.value) return

  // Profil doluluk şartı tamamen kaldırıldı - Her kullanıcı doğrudan ilan açabilir
  let currentSession = {} as any
  if (typeof window !== 'undefined') {
    try {
      currentSession = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }

  // ⚠️ Zorunlu İletişim ve Teslimat Bilgisi Kontrolü
  const effectivePhone = (form.value.ownerPhone || currentSession?.phone || '').trim()
  if (!effectivePhone) {
    alert('⚠️ Lütfen ihaleniz / ilanınız için iletişim telefon numarasını giriniz.')
    return
  }

  const effectiveAddress = (form.value.teslimatAdresi || currentSession?.address || '').trim()
  if (!effectiveAddress) {
    alert('⚠️ Lütfen teslimat veya işin yapılacağı açık adresi giriniz.')
    return
  }

  isSubmittingTender.value = true

  try {
    // 1. Default Title if empty
    if (!form.value.baslik || !form.value.baslik.trim()) {
      const subCat = selectedSubcategory.value || 'Malzeme & Hizmet'
      form.value.baslik = `${form.value.kategori || 'Kurumsal Satın Alma'} - ${subCat} Tedarik Talebi`
    }

    // 2. Format Budget (Optional - Default: Teklif Usulü)
    let budgetVal = '💬 Teklif Usulü (Tedarikçilerden Fiyat Bekleniyor)'
    if (!isBudgetUnspecified.value) {
      const rawAmt = form.value.butce || form.value.maxButce || form.value.minButce
      if (rawAmt) {
        const cleanNum = parseInt(String(rawAmt).replace(/\D/g, '')) || 0
        if (cleanNum > 0) {
          budgetVal = Number(cleanNum).toLocaleString('tr-TR') + ' ₺'
        }
      }
    }

    const deliveryCity = form.value.sehir || 'Balıkesir'
    const deliveryAddress = form.value.teslimatAdresi || `${deliveryCity} Merkez / Saha Depo Teslimat`

    // 3. Unique ID
    const ihaleYonuVal = form.value.ihaleYonu || 'eksiltme'
    const turLabel = ihaleYonuVal === 'ihalesiz_ilan'
      ? 'İhalesiz İlan (Net Fiyat)'
      : (ihaleYonuVal === 'sabit_paket'
        ? 'Sabit Fiyatlı Paket & Kontenjan Toplama'
        : (ihaleYonuVal === 'artirma' 
          ? 'Açık Artırma (Fiyat Artırımlı)' 
          : (ihaleYonuVal === 'kapali_zarf' ? 'Kapalı Zarf Usulü' : 'Açık Eksiltme (Fiyat Azaltımlı)')))

    const newId = isEditMode.value ? editingTenderId.value! : ('IHC-2026-' + Math.floor(100 + Math.random() * 900))
    createdId.value = newId

    const subCat = selectedSubcategory.value || 'Genel Satın Alma'
    const combinedCategory = `${form.value.kategori || 'İnşaat ve Yapı'} / ${subCat}`
    let primaryImg = form.value.images?.[0]?.url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
    const catLow = (form.value.kategori || '').toLowerCase()
    if (!form.value.images?.length) {
      if (catLow.includes('organizasyon') || catLow.includes('düğün') || catLow.includes('etkinlik') || catLow.includes('konser') || catLow.includes('iftar')) {
        primaryImg = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('hac') || catLow.includes('umre') || catLow.includes('turizm') || catLow.includes('gezi')) {
        primaryImg = 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('peyzaj') || catLow.includes('bahçe') || catLow.includes('fidan') || catLow.includes('çim')) {
        primaryImg = 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('mühendislik') || catLow.includes('mimarlık') || catLow.includes('statik') || catLow.includes('proje')) {
        primaryImg = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('lojistik') || catLow.includes('nakliye') || catLow.includes('havayolu')) {
        primaryImg = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('inşaat') || catLow.includes('yapı')) {
        primaryImg = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('makine') || catLow.includes('metal')) {
        primaryImg = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('ambalaj') || catLow.includes('koli')) {
        primaryImg = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
      } else if (catLow.includes('bilişim') || catLow.includes('ofis')) {
        primaryImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
      }
    }

    // 4. Otomatik açıklama (Kendi şartnamesini yükleyen kullanıcı için açıklama zorunluluğunu esnet)
    if (!form.value.aciklama || !form.value.aciklama.trim()) {
      if (form.value.files && form.value.files.length > 0) {
        form.value.aciklama = `Teknik şartname ve proje şartları ekteki belgelerde (${form.value.files.map(f => f.name).join(', ')}) detaylıca belirtilmiştir. Tedarikçilerimizin ekli şartname dosyasına göre teklif vermesi rica olunur.`
      } else {
        form.value.aciklama = `${form.value.baslik} kapsamında resmi şartnameye uygun teklifler toplanmaktadır.`
      }
    }

    let session: any = {}
    if (typeof window !== 'undefined') {
      try {
        session = JSON.parse(localStorage.getItem('userSession') || '{}')
      } catch (e) {}
    }
    const ownerEmail = (session.email || 'ihalecib@gmail.com').trim().toLowerCase()
    const ownerName = session.name || session.firstName || session.name || 'Şirket Yetkilisi'
    const ownerCompany = session.companyName || session.company || session.companyName || session.company || 'Kurumsal Şirket'

    const tenderDirection = form.value.ihaleYonu || 'kapali_zarf'
    let tenderTur = 'Doğrudan Teklif Alma (Kapalı Zarf)'
    if (tenderDirection === 'ihalesiz_ilan') tenderTur = 'İhalesiz İlan (Net Fiyat)'
    else if (tenderDirection === 'sabit_paket') tenderTur = 'Sabit Fiyatlı Paket & Kontenjan Toplama'
    else if (tenderDirection === 'eksiltme') tenderTur = 'Açık Eksiltme (Fiyat Azaltımlı / Alım)'
    else if (tenderDirection === 'artirma') tenderTur = 'Açık Artırma (Fiyat Artırımlı / Satış)'

    let calculatedBudget = budgetVal
    if (tenderDirection === 'ihalesiz_ilan') {
      const priceClean = form.value.netFiyat ? Number(String(form.value.netFiyat).replace(/\D/g, '')).toLocaleString('tr-TR') : '0'
      const currSymbol = form.value.currency === 'USD' ? '$' : (form.value.currency === 'EUR' ? '€' : '₺')
      const vatStr = form.value.vatType === 'vat_included' ? 'KDV Dâhil' : 'KDV Hariç'
      const pazarlikStr = form.value.pazarlikDurumu === 'pazarlikli' ? '(Pazarlığa Açık)' : '(Net Son Fiyat)'
      const miktarStr = form.value.stokMiktar ? `${form.value.stokMiktar} ${form.value.stokBirim || 'Adet'}` : ''
      calculatedBudget = `${priceClean} ${currSymbol} · ${vatStr} ${pazarlikStr}${miktarStr ? ' · ' + miktarStr : ''}`
    } else if (tenderDirection === 'sabit_paket') {
      const priceStr = form.value.kisiBasiFiyat ? Number(String(form.value.kisiBasiFiyat).replace(/\D/g, '')).toLocaleString('tr-TR') : '1.000'
      const currSymbol = form.value.currency === 'USD' ? '$' : (form.value.currency === 'EUR' ? '€' : '₺')
      const quota = form.value.hedefKontenjan || 40
      calculatedBudget = `Kişi Başı: ${priceStr} ${currSymbol} (${quota} Kişi Kontenjan)`
    }

    const aiInspection = inspectTenderAutonomous({
      baslik: form.value.baslik,
      aciklama: form.value.aciklama,
      kategori: combinedCategory,
      city: deliveryCity,
      files: form.value.files,
      images: form.value.images
    })

    if (aiInspection.status === 'rejected') {
      alert(aiInspection.reason)
      isSubmittingTender.value = false
      return
    }
    const tenderObject = {
      ...(existingTender.value || {}),
      aiApproved: aiInspection.status === 'approved',
      aiScore: aiInspection.score,
      aiReport: aiInspection,
      id: newId,
      baslik: form.value.baslik,
      kategori: combinedCategory,
      mainCategory: form.value.kategori || 'İnşaat ve Yapı',
      subCategory: subCat,
      ihaleYonu: tenderDirection,
      tur: tenderTur,
      rekabetTuru: tenderTur,
      sure: form.value.sure || '7 gün kaldı',
      teklifSayisi: isEditMode.value ? (existingTender.value?.teklifSayisi || 0) : 0,
      durum: isEditMode.value ? (existingTender.value?.durum || 'active') : 'active',
      statusCode: isEditMode.value ? (existingTender.value?.statusCode || 'LIVE') : 'LIVE',
      adminApproved: true,
      statusLabel: 'Canlı Yayında',
      butce: (tenderDirection === 'sabit_paket' || tenderDirection === 'ihalesiz_ilan') ? calculatedBudget : budgetVal,
      isSabitPaket: tenderDirection === 'sabit_paket',
      isIhalesiz: tenderDirection === 'ihalesiz_ilan',
      netFiyat: form.value.netFiyat,
      ilanTuru: form.value.ilanTuru || 'satis',
      stokMiktar: form.value.stokMiktar,
      stokBirim: form.value.stokBirim || 'Adet',
      pazarlikDurumu: form.value.pazarlikDurumu || 'net',
      kisiBasiFiyat: form.value.kisiBasiFiyat || '1000',
      currency: form.value.currency || 'TRY',
      vatType: form.value.vatType || 'vat_included',
      awardMode: form.value.awardMode || 'ALL_OR_NOTHING',
      kalemler: form.value.kalemler.length > 0 
        ? form.value.kalemler 
        : [{ id: 'KLM-1', ad: form.value.baslik, miktar: 1, birim: 'Parti/Paket', teknikAciklama: form.value.aciklama }],
      minStep: Number(form.value.minStep) || 1000,
      reservePrice: form.value.reservePrice ? parseInt(String(form.value.reservePrice).replace(/\D/g, ''), 10) : undefined,
      minBidsCount: Number(form.value.minBidsCount) || 1,
      specVersion: isEditMode.value ? (Number(existingTender.value?.specVersion || 1) + 1) : 1,
      hedefKontenjan: form.value.hedefKontenjan || 40,
      mevcutKatilimci: isEditMode.value ? (existingTender.value?.mevcutKatilimci || 0) : 0,
      paketDahilHizmetler: form.value.paketDahilHizmetler || [],
      city: deliveryCity,
      teslimatAdresi: deliveryAddress,
      odemeYontemi: form.value.odemeYontemi || '🛡️ İhaleciBurada Güvenli Emanet Havuz (Escrow - Mal Kabul Onaylı)',
      faturaTuru: form.value.faturaTuru || '🏢 Kurumsal E-Fatura (%20 KDV)',
      image: primaryImg,
      images: form.value.images?.length ? form.value.images : [primaryImg],
      files: (form.value.files || []).map(f => ({ name: f.name, size: f.size, type: f.type, progress: 100 })),
      documents: (form.value.files || []).map(f => ({ name: f.name, size: f.size, type: f.type, progress: 100 })),
      aciklama: form.value.aciklama || form.value.baslik,
      categorySpecificData: categorySpecificData.value,
      customFields: categorySpecificData.value,
      sectorKey: currentSectorKey.value || resolveSectorKey(form.value.kategori, selectedSubcategory.value),
      websiteUrl: form.value.websiteUrl || '',
      ownerPhone: form.value.ownerPhone || session.phone || '',
      ownerEmail: form.value.ownerEmail || existingTender.value?.ownerEmail || ownerEmail,
      ownerCompany: form.value.ownerCompany || existingTender.value?.ownerCompany || ownerCompany,
      isIlan: tenderDirection === 'ihalesiz_ilan' || tenderDirection === 'ilan',
      visibility: form.value.visibility || 'public',
      isPrivate: form.value.visibility === 'private_invited',
      invitedSuppliers: form.value.invitedSuppliers || '',
      isMine: false,
      olusturma: existingTender.value?.olusturma || 'Bugün'
    }

    // 4. Update CMS Data in memory & storage
    if (!cmsData.value) cmsData.value = {} as any
    if (!cmsData.value.dashboard) cmsData.value.dashboard = {} as any
    if (!Array.isArray(cmsData.value.dashboard.tenders)) cmsData.value.dashboard.tenders = []
    if (!Array.isArray(cmsData.value.dashboard.receivedBids)) cmsData.value.dashboard.receivedBids = []

    if (isEditMode.value) {
      const idx = cmsData.value.dashboard.tenders.findIndex((t: any) => t.id === newId)
      if (idx >= 0) {
        cmsData.value.dashboard.tenders[idx] = tenderObject
      } else {
        cmsData.value.dashboard.tenders.unshift(tenderObject)
      }
      const gIdx = cmsData.value.dashboard.receivedBids.findIndex((g: any) => g.id === newId)
      if (gIdx >= 0) {
        cmsData.value.dashboard.receivedBids[gIdx].baslik = form.value.baslik
        cmsData.value.dashboard.receivedBids[gIdx].kategori = combinedCategory
      }
    } else {
      cmsData.value.dashboard.tenders.unshift(tenderObject)
      cmsData.value.dashboard.receivedBids.unshift({
        id: newId,
        baslik: form.value.baslik,
        kategori: combinedCategory,
        bitis: form.value.sure || '7 gün kaldı',
        image: primaryImg,
        teklifler: []
      })
    }

    try {
      saveCmsData(cmsData.value)
    } catch (e) {
      console.warn('saveCmsData soft error ignored:', e)
    }

    // 4b. Sync with shared server API for cross-device visibility
    try {
      if (isEditMode.value) {
        await $fetch(`/api/tenders/${encodeURIComponent(newId)}`, {
          method: 'PUT',
          headers: {
            'x-user-email': ownerEmail
          },
          body: tenderObject
        })
      } else {
        await $fetch('/api/tenders', {
          method: 'POST',
          headers: {
            'x-user-email': ownerEmail
          },
          body: tenderObject
        })
      }
    } catch (apiErr) {
      console.warn('API sync warning:', apiErr)
    }

    // 4c. Register GİB BTRANS audit log per 538/595 VUK General Communiqué
    try {
      await $fetch('/api/gib/logs', {
        method: 'POST',
        body: {
          tenderId: newId,
          tenderTitle: form.value.baslik,
          action: isEditMode.value ? 'IHALE_GUNCELLENDI' : 'IHALE_ACILDI',
          actionLabel: isEditMode.value ? 'İhale Bilgileri Güncellendi' : 'Yeni İhale İlanı Oluşturuldu',
          category: combinedCategory,
          budget: budgetVal,
          direction: turLabel,
          taxIdType: (session.taxNo && session.taxNo.length === 11) ? 'TCKN' : 'VKN',
          taxId: session.taxNo || session.tcKimlik || '9560161511',
          taxOffice: session.taxOffice || 'Kayıtlı Vergi Dairesi',
          companyOrFullName: ownerCompany || ownerName,
          ownerEmail,
          ownerPhone: session.phone || '0850 840 86 95',
          city: deliveryCity,
          address: deliveryAddress,
          timestamp: new Date().toISOString()
        }
      })
    } catch (gibErr) {
      console.warn('GİB audit log sync warning:', gibErr)
    }

    // 5. Safe LocalStorage save
    if (typeof window !== 'undefined') {
      try {
        const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        if (isEditMode.value) {
          const idx = myTenders.findIndex((t: any) => t.id === newId)
          if (idx >= 0) {
            myTenders[idx] = tenderObject
          } else {
            myTenders.unshift(tenderObject)
          }
        } else {
          myTenders.unshift(tenderObject)
        }
        localStorage.setItem('myTenders', JSON.stringify(myTenders.slice(0, 20)))
        localStorage.setItem('recentTenderCreated', JSON.stringify({ id: newId, baslik: tenderObject.baslik }))
        localStorage.removeItem('tenderDraft')
      } catch (e) {
        console.warn('localStorage save soft error ignored:', e)
      }

      window.dispatchEvent(new Event('storage'))
    }

    submittedTenderSummary.value = {
      id: newId,
      baslik: form.value.baslik,
      kategori: combinedCategory,
      butce: budgetVal,
      city: deliveryCity,
      filesCount: (form.value.files || []).length,
      imagesCount: (form.value.images || []).length,
      files: [...(form.value.files || [])]
    }

    showSuccess.value = true

    // Direct transition to my tenders approval confirmation page
    setTimeout(() => {
      router.push('/panel/ilanlarim?created=' + encodeURIComponent(newId))
    }, 400)

  } catch (err: any) {
    console.warn('Silent fallback on tender creation:', err)
    // Even on any exception, redirect to panel/ilanlarim gracefully
    router.push('/panel/ilanlarim')
  } finally {
    isSubmittingTender.value = false
  }
}


function resetFormAndCreateNew() {
  form.value = {
    baslik: '',
    kategori: 'İnşaat ve Yapı',
    sure: '7 gün',
    butce: '',
    aciklama: '',
    sehir: 'Balıkesir',
    teslimatAdresi: '',
    odemeYontemi: 'Vadeli 30 Gün',
    images: [],
    files: []
  }
  showSuccess.value = false
  submittedTenderSummary.value = null
}
</script>

<template>
  <div class="p-3 sm:p-6 max-w-3xl mx-auto text-left">
    
    <!-- Saved Draft Banner (if draft exists) -->
    <div v-if="hasDraft" class="mb-5 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-amber-900 shadow-xs">
      <div class="flex items-center gap-2">
        <FileSpreadsheet class="text-amber-600 shrink-0" :size="18" />
        <span>{{ 'Tamamlanmamış kayıtlı bir ihale taslağınız bulunmaktadır.' }}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button type="button" @click="loadDraft" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition cursor-pointer">
          {{ 'Taslağı Yükle' }}
        </button>
        <button type="button" @click="clearDraft" class="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-bold text-xs transition cursor-pointer">
          {{ 'Sil' }}
        </button>
      </div>
    </div>

    <!-- Geri Dönüş Linki & Draft Save Action -->
    <div class="mb-5 flex items-center justify-between">
      <NuxtLink to="/panel/ilanlarim" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft :size="14" />
        {{ 'İhalelerime Dön' }}
      </NuxtLink>

      <button type="button" @click="saveDraftManually" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-200 shadow-xs">
        💾 {{ 'Taslağı Kaydet' }}
      </button>
    </div>

    <!-- Düzenleme Modu Bilgi Rozeti -->
    <div v-if="isEditMode" class="mb-5 rounded-2xl bg-blue-50 border border-blue-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-blue-900 shadow-xs animate-fadeIn">
      <div class="flex items-center gap-2">
        <Pencil class="text-blue-600 shrink-0" :size="18" />
        <span>Düzenleme Modu: <strong>#{{ editingTenderId }}</strong> numaralı ihalenin bilgilerini düzenliyorsunuz.</span>
      </div>
      <NuxtLink to="/panel/ilanlarim" class="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800 hover:bg-blue-100 font-bold text-xs transition">
        Vazgeç ve İhalelerime Dön
      </NuxtLink>
    </div>

    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <FilePlus2 v-if="!isEditMode" class="text-blue-600" :size="22" />
        <Pencil v-else class="text-blue-600" :size="22" />
        {{ isEditMode ? 'İhale Bilgilerini Düzenle' : 'Yeni İhale Talebi Oluştur' }}
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">
        {{ isEditMode ? `#${editingTenderId} numaralı ihalenin şartname, bütçe ve kalem detaylarını güncelleyerek kaydedebilirsiniz.` : 'Satın alma talebiniz için tedarikçilerden rekabetçi canlı teklifler toplayın' }}
      </p>
    </div>



    <!-- ZENGİN İHALE ONAY VE GÖNDERİLDİ EKRANI -->
    <div v-if="showSuccess" class="mb-8 rounded-3xl bg-white border border-emerald-300 p-6 sm:p-8 text-center space-y-5 shadow-xl animate-fadeIn">
      <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 :size="36" />
      </div>
      
      <div class="space-y-1">
        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider inline-block">
          {{ isEditMode ? '✓ İhale Bilgileriniz Başarıyla Güncellendi' : '✓ İhale İlanınız Başarıyla Oluşturuldu ve Gönderildi' }}
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-2">{{ submittedTenderSummary?.baslik }}</h2>
        <p class="text-xs text-slate-500">İhale Referans No: <strong class="font-mono text-blue-700 font-black">{{ createdId }}</strong></p>
      </div>

      <!-- Özet Detay Kartı -->
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-left">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase block">Kategori</span>
          <span class="font-bold text-slate-800">{{ submittedTenderSummary?.kategori }}</span>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase block">Pazarlık / Bütçe</span>
          <span class="font-mono font-black text-emerald-700">{{ submittedTenderSummary?.butce }}</span>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase block">Konum / Şehir</span>
          <span class="font-bold text-slate-800">{{ submittedTenderSummary?.city }}</span>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase block">Eklenen Belgeler</span>
          <span class="font-bold text-blue-700">{{ submittedTenderSummary?.filesCount }} Dosya · {{ submittedTenderSummary?.imagesCount }} Görsel</span>
        </div>
      </div>

      <!-- Eklenen Dosyaların Listesi -->
      <div v-if="submittedTenderSummary?.files?.length > 0" class="text-left space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
        <span class="font-bold text-slate-700 block text-[11px] flex items-center gap-1.5">
          <FileSpreadsheet :size="14" class="text-emerald-600" />
          <span>İlana Eklenen Teknik Şartname & Fiyat Cetveli Belgeleri ({{ submittedTenderSummary.files.length }} Adet):</span>
        </span>
        <div class="space-y-1">
          <div v-for="(f, i) in submittedTenderSummary.files" :key="i" class="text-slate-600 flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 font-mono text-[11px]">
            <div class="flex items-center gap-1.5 truncate">
              <FileCheck :size="13" class="text-emerald-600 shrink-0" />
              <span class="truncate font-bold text-slate-800">{{ f.name }}</span>
            </div>
            <span class="text-slate-400 shrink-0 text-[10px]">✓ Yüklendi ({{ f.size }})</span>
          </div>
        </div>
      </div>

      <!-- Aksiyon Butonları -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <NuxtLink to="/panel/ilanlarim" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-1.5">
          <span>📋 İlanlarım Sayfasına Git</span>
        </NuxtLink>
        <NuxtLink to="/" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-1.5">
          <span>🏠 Ana Sayfada Görüntüle</span>
        </NuxtLink>
        <button type="button" @click="resetFormAndCreateNew" class="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer">
          + Yeni İhale Daha Aç
        </button>
      </div>
    </div>

    <!-- İhale Formu -->
    <div v-else class="space-y-6">
      
      <!-- KART 1: GENEL BİLGİLER -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-4 border-slate-200">
        <!-- 🛡️ ALICI İÇİN %0 KOMİSYON VE ARACI KURUM BİLGİLENDİRMESİ -->
        <div class="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase shrink-0">%0 ALICI KOMİSYONU</span>
            <span class="font-medium text-[11px] text-emerald-900 leading-relaxed">İhale açmak ve teklif toplamak alıcı firmalar için <strong>%100 ücretsizdir</strong>. Tüm sektörlerde sabit <strong>%5 Escrow Güvenli Havuz</strong> güvencesiyle mal kabulü yapılmadan ödeme aktarılmaz.</span>
          </div>
          <NuxtLink to="/sozlesmeler?tab=kullanim" class="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] whitespace-nowrap transition">
            Komisyon & Escrow Şartları →
          </NuxtLink>
        </div>

        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">1. İhale Genel Bilgileri</h2>
        
        <!-- 🎯 İHALE REKABET USULÜ VE TEKLİF YÖNÜ -->
        <div class="space-y-2 p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between">
            <label class="block text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯 İHALE / İLAN TÜRÜ *</span>
            </label>
            <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Nasıl Teklif Almak İstiyorsunuz?
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
            <!-- 1. Doğrudan Teklif / Kapalı Zarf -->
            <button 
              type="button"
              @click="form.ihaleYonu = 'kapali_zarf'"
              class="p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              :class="form.ihaleYonu === 'kapali_zarf' ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-purple-900 flex items-center gap-1">📑 Kapalı Zarf</span>
                <span v-if="form.ihaleYonu === 'kapali_zarf'" class="text-purple-600 font-bold text-xs">✓</span>
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">Gizli doğrudan teklifler</span>
            </button>

            <!-- 2. Açık Eksiltme -->
            <button 
              type="button"
              @click="form.ihaleYonu = 'eksiltme'"
              class="p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              :class="form.ihaleYonu === 'eksiltme' ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-emerald-900 flex items-center gap-1">📉 Eksiltme</span>
                <span v-if="form.ihaleYonu === 'eksiltme'" class="text-emerald-600 font-bold text-xs">✓</span>
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">En düşük fiyat yarışı</span>
            </button>

            <!-- 3. Açık Artırma -->
            <button 
              type="button"
              @click="form.ihaleYonu = 'artirma'"
              class="p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              :class="form.ihaleYonu === 'artirma' ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-blue-900 flex items-center gap-1">📈 Artırma</span>
                <span v-if="form.ihaleYonu === 'artirma'" class="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">En yüksek teklif satışı</span>
            </button>

            <!-- 4. Sabit Paket -->
            <button 
              type="button"
              @click="form.ihaleYonu = 'sabit_paket'"
              class="p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              :class="form.ihaleYonu === 'sabit_paket' ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-amber-900 flex items-center gap-1">🏷️ Sabit Paket</span>
                <span v-if="form.ihaleYonu === 'sabit_paket'" class="text-amber-600 font-bold text-xs">✓</span>
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">Kişi başı sabit ücret</span>
            </button>

            <!-- 5. İhalesiz İlan -->
            <button 
              type="button"
              @click="form.ihaleYonu = 'ihalesiz_ilan'"
              class="p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between"
              :class="form.ihaleYonu === 'ihalesiz_ilan' ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
            >
              <div class="flex items-center justify-between">
                <span class="font-black text-xs text-teal-900 flex items-center gap-1">📢 Net İlan</span>
                <span v-if="form.ihaleYonu === 'ihalesiz_ilan'" class="text-teal-600 font-bold text-xs">✓</span>
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">İhalesiz doğrudan vitrin</span>
            </button>
          </div>
        </div>

        <!-- İhale Başlığı -->
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">İHALE / İLAN BAŞLIĞI *</label>
          <input 
            v-model="form.baslik" 
            type="text" 
            :placeholder="titlePlaceholder" 
            class="w-full rounded-xl border p-3 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold" 
            style="border-color: #CBD5E1; color: #0F172A;"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Kategori -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider">ANA KATEGORİ *</label>
              <button 
                type="button" 
                @click="showSuggestModal = true" 
                class="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                + Kategori Öner
              </button>
            </div>
            <select 
              v-model="form.kategori" 
              class="w-full rounded-xl border p-3 text-xs outline-none bg-white transition focus:border-blue-600 font-semibold"
              style="border-color: #CBD5E1; color: #0F172A;"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Alt Kategori -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">ALT KATEGORİ *</label>
            <select 
              v-model="selectedSubcategory" 
              class="w-full rounded-xl border p-3 text-xs outline-none bg-white transition focus:border-blue-600 font-semibold"
              style="border-color: #CBD5E1; color: #0F172A;"
            >
              <option v-for="sub in currentSubcategories" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>

          <!-- SABİT FİYATLI PAKET & KONTENJAN ALANI -->
          <div v-if="form.ihaleYonu === 'sabit_paket'" class="col-span-1 md:col-span-2 space-y-4 rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏷️ KİŞİ BAŞI SABİT PAKET ÜCRETİ & HEDEF KONTENJAN</span>
              </span>
              <span class="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded border border-amber-300">
                Sabit Fiyatlı Grup İlanı
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- Kişi Başı Paket Fiyatı -->
              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  KİŞİ BAŞI SABİT ÜCRET *
                </label>
                <div class="relative">
                  <input 
                    v-model="form.kisiBasiFiyat" 
                    type="text" 
                    placeholder="Örn: 1000 veya 1100" 
                    class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-bold pr-12"
                    style="border-color: #CBD5E1; color: #0F172A;"
                  />
                  <div class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 pointer-events-none">
                    {{ form.currency }}
                  </div>
                </div>
              </div>

              <!-- Para Birimi -->
              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  PARA BİRİMİ *
                </label>
                <select 
                  v-model="form.currency" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-bold cursor-pointer"
                  style="border-color: #CBD5E1; color: #0F172A;"
                >
                  <option value="USD">$ USD (Amerikan Doları)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="TRY">₺ TRY (Türk Lirası)</option>
                </select>
              </div>

              <!-- Hedef Kontenjan Sayısı -->
              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  HEDEF KONTENJAN (KİŞİ SAYISI) *
                </label>
                <input 
                  v-model.number="form.hedefKontenjan" 
                  type="number" 
                  min="1"
                  placeholder="Örn: 40" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-bold"
                  style="border-color: #CBD5E1; color: #0F172A;"
                />
              </div>
            </div>

            <!-- Pakete Dahil Hizmetler (Hızlı Etiketler) -->
            <div>
              <label class="block text-[10px] font-bold text-slate-700 mb-1.5">
                PAKETE DÂHİL HİZMETLER (İşaretleyin)
              </label>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="feature in ['Gidiş-Dönüş Uçak Bileti', 'Lüks Otel Konaklama', 'Vize & Pasaport İşlemleri', 'Rehberlik & Din Hizmetleri', 'Havalimanı & Otel Transfer', 'Sabah & Akşam Yemeği', 'Ziyaret Yerleri Gezisi', 'Seyahat Sağlık Sigortası', 'Ses-Işık & Sahne Ekipmanı', 'Fotoğraf & Video Çekimi', 'Düğün / Nişan Masa Süsleme', 'Toplu İftar Menüsü']"
                  :key="feature"
                  type="button"
                  @click="toggleFeature(feature)"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer"
                  :class="form.paketDahilHizmetler.includes(feature) ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'"
                >
                  <span v-if="form.paketDahilHizmetler.includes(feature)">✓ </span>{{ feature }}
                </button>
              </div>
            </div>
          </div>

          <!-- İHALESİZ İLAN & NET FİYAT ALANI -->
          <div v-else-if="form.ihaleYonu === 'ihalesiz_ilan'" class="col-span-1 md:col-span-2 space-y-4 rounded-2xl border-2 border-teal-400 bg-teal-50/70 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>💰 NET İLAN FİYATI VE PAZARLIK BİLGİLERİ</span>
              </span>
              <span class="text-[10px] font-black text-teal-900 bg-teal-200/80 px-2.5 py-0.5 rounded border border-teal-300">
                İhalesiz / Doğrudan İlan
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  NET İLAN FİYATI *
                </label>
                <div class="relative">
                  <input 
                    v-model="form.netFiyat" 
                    type="text" 
                    placeholder="Örn: 25.000" 
                    class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-bold pr-12"
                    style="border-color: #CBD5E1; color: #0F172A;"
                  />
                  <div class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 pointer-events-none">
                    {{ form.currency === 'TRY' ? '₺' : form.currency === 'USD' ? '$' : '€' }}
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  PARA BİRİMİ *
                </label>
                <select 
                  v-model="form.currency" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-bold cursor-pointer"
                  style="border-color: #CBD5E1; color: #0F172A;"
                >
                  <option value="TRY">₺ TRY (Türk Lirası)</option>
                  <option value="USD">$ USD (Amerikan Doları)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-700 mb-1">
                  PAZARLIK DURUMU *
                </label>
                <select 
                  v-model="form.pazarlikDurumu" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-bold cursor-pointer"
                  style="border-color: #CBD5E1; color: #0F172A;"
                >
                  <option value="net">Kesin Net Fiyat (Pazarlıksız)</option>
                  <option value="pazarlikli">Pazarlığa Açık (Teklife Göre)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Standart Bütçe Aralığı -->
          <div v-else class="col-span-1 md:col-span-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>💰 HEDEF BÜTÇE VEYA TAHMİNİ TUTAR</span>
              </label>
              <span class="text-[10px] font-bold text-slate-400 lowercase">(isteğe bağlı / teklif usulü)</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">
                  MİNİMUM TABAN TUTAR (₺)
                </label>
                <input 
                  v-model="form.minButce" 
                  type="text" 
                  placeholder="Örn: 50.000" 
                  class="w-full rounded-xl border p-2 text-xs outline-none bg-white transition focus:border-blue-600"
                  style="border-color: #CBD5E1; color: #0F172A;"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">
                  MAKSİMUM TAVAN BÜTÇE (₺)
                </label>
                <input 
                  v-model="form.maxButce" 
                  type="text" 
                  placeholder="Örn: 150.000" 
                  class="w-full rounded-xl border p-2 text-xs outline-none bg-white transition focus:border-blue-600"
                  style="border-color: #CBD5E1; color: #0F172A;"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- İhale Süresi -->
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">TEKLİF TOPLAMA SÜRESİ</label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button 
              v-for="dur in durations" 
              :key="dur" 
              type="button"
              @click="form.sure = dur"
              class="rounded-xl border py-2 text-xs font-bold transition text-center cursor-pointer"
              :style="form.sure === dur 
                ? 'background: #1E3A5F; border-color: #1E3A5F; color: white;' 
                : 'background: white; border-color: #CBD5E1; color: #475569;'"
            >
              {{ dur }}
            </button>
          </div>
        </div>
      </div>

      <!-- KART 2: AÇIKLAMA, ŞARTNAME & BELGELER -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-5 border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <span>2. Açıklama, Detaylar ve Belgeler</span>
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">İhtiyacınızı veya ürününüzü açıklayın, varsa şartname ve fotoğrafları ekleyin.</p>
          </div>
          <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✓ Kolay Giriş
          </span>
        </div>

        <!-- Açıklama Metni (Öne Alındı) -->
        <div>
          <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
            {{ isRealEstateCategory ? 'GAYRİMENKUL DETAYLI AÇIKLAMA & ÖZEL BİLGİLER' : 'İHALE / ALIM DETAYLI AÇIKLAMASI & ŞARTLARI' }}
          </label>
          <textarea 
            v-model="form.aciklama" 
            rows="4" 
            :placeholder="descPlaceholder" 
            class="w-full rounded-xl border p-3 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
            style="border-color: #CBD5E1; color: #0F172A;"
          ></textarea>
        </div>

        <!-- Gayrimenkul ise: Emlak Parametreleri (Sahibinden Standardı) -->
        <div v-if="isRealEstateCategory" class="rounded-2xl border border-amber-200 bg-amber-50/20 p-4 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🏡</span>
            <div>
              <span class="text-xs font-black text-slate-900 uppercase tracking-wider block">Gayrimenkul & Emlak Kriterleri</span>
              <span class="text-[10px] text-slate-500">Oda sayısı, m², kat ve tapu durumu gibi detayları belirleyin</span>
            </div>
          </div>
          <CategorySpecificFields
            v-model="categorySpecificData"
            :category="form.kategori"
            :sub-category="selectedSubcategory"
            :closeable="false"
            @sector-changed="handleSectorChanged"
          />
        </div>

        <!-- Kompakt Dosya & Fotoğraf Ekleme Alanı (Yan Yana) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <!-- 1. Şartname & Doküman Yükleme -->
          <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/60 space-y-3 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <FileText :size="15" class="text-blue-600" />
                <span>Şartname / Doküman Ekle</span>
              </span>
              <span class="text-[10px] text-slate-400 font-medium">PDF, Excel, Word, DWG</span>
            </div>
            
            <div 
              @click="triggerFileSelect"
              class="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center cursor-pointer transition hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 bg-white"
            >
              <UploadCloud :size="22" class="text-blue-600" />
              <span class="text-xs font-bold text-slate-700">Dosya Yüklemek İçin Tıklayın</span>
              <span class="text-[10px] text-slate-400">Teknik şartname, metraj veya tapu belgesi</span>
              <input 
                ref="fileInputRef"
                type="file"
                multiple
                accept=".dwg,.dxf,.pdf,.doc,.docx,.xls,.xlsx,application/acad,application/x-acad,application/autocad_dwg,image/vnd.dwg,application/dwg,application/x-dwg,application/octet-stream,*/*"
                class="hidden"
                @change="handleFileChange"
              />
            </div>

            <!-- Yüklenen Dosyalar -->
            <div v-if="form.files.length > 0" class="space-y-1.5 max-h-36 overflow-y-auto">
              <div 
                v-for="(file, index) in form.files" 
                :key="index"
                class="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <div class="flex items-center gap-1.5 truncate pr-2">
                  <FileText :size="13" class="text-blue-600 shrink-0" />
                  <span class="truncate font-bold text-slate-800 text-[11px]">{{ file.name }}</span>
                </div>
                <button type="button" @click="removeFile(index)" class="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>
          </div>

          <!-- 2. Fotoğraf / Numune Görseli Yükleme -->
          <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/60 space-y-3 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Camera :size="15" class="text-emerald-600" />
                <span>Fotoğraf / Görsel Ekle</span>
              </span>
              <span class="text-[10px] text-slate-400 font-medium">JPG, PNG, WEBP</span>
            </div>
            
            <div 
              @click="triggerImageSelect"
              class="border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center cursor-pointer transition hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-1.5 bg-white"
            >
              <Camera :size="22" class="text-emerald-600" />
              <span class="text-xs font-bold text-slate-700">Fotoğraf Seçmek İçin Tıklayın</span>
              <span class="text-[10px] text-slate-400">Ürün, numune veya emlak fotoğrafları</span>
              <input 
                ref="imageInputRef"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleImageChange"
              />
            </div>

            <!-- Yüklenen Fotoğraflar -->
            <div v-if="form.images.length > 0" class="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              <div 
                v-for="(img, idx) in form.images" 
                :key="idx"
                class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 group"
              >
                <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
                <button 
                  type="button" 
                  @click="removeImage(idx)" 
                  class="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KART 3: LOJİSTİK, TESLİMAT & İLETİŞİM BİLGİLERİ (ZORUNLU KONTROLLÜ) -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-4 border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <span>3. Lojistik, Teslimat & İletişim Bilgileri</span>
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">Tekliflerin ve teslimatın sorunsuz iletilebilmesi için adres ve telefon zorunludur.</p>
          </div>
          <span class="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            * Telefon ve Adres Zorunlu
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Teslimat İli -->
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
              TESLİMAT / İŞ İLİ *
            </label>
            <div class="relative">
              <MapPin :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                v-model="form.sehir" 
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none bg-white transition focus:border-blue-600 font-bold border-slate-300 text-slate-900"
              >
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>

          <!-- İletişim Telefonu (ZORUNLU) -->
          <div>
            <label class="block text-[10px] font-black text-red-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>İLETİŞİM TELEFONU (GSM) *</span>
              <span class="text-[9px] font-bold text-red-500">ZORUNLU</span>
            </label>
            <input 
              v-model="form.ownerPhone" 
              type="tel" 
              placeholder="Örn: 0532 123 45 67"
              class="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition focus:border-red-600 border-red-300 text-slate-900 bg-red-50/20 font-bold"
            />
          </div>

          <!-- Firma / Şahıs Yetkili Adı -->
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">FİRMA / YETKİLİ ADI</label>
            <input 
              v-model="form.ownerCompany" 
              type="text" 
              placeholder="Örn: Simay Peyzaj veya Hasan Bey"
              class="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition focus:border-blue-600 border-slate-300 text-slate-900 bg-white font-medium"
            />
          </div>

          <!-- Açık Teslimat Adresi (ZORUNLU) -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-black text-red-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>AÇIK TESLİMAT / İŞ ADRESİ *</span>
              <span class="text-[9px] font-bold text-red-500">ZORUNLU</span>
            </label>
            <input 
              v-model="form.teslimatAdresi" 
              type="text"
              placeholder="Örn: Balıkesir OSB 3. Yol No: 12 veya Çanakkale Kepez Sahil Yolu" 
              class="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition focus:border-red-600 border-red-300 text-slate-900 bg-red-50/20 font-medium"
            />
          </div>

          <!-- Kurumsal E-Posta -->
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">E-POSTA ADRESİ</label>
            <input 
              v-model="form.ownerEmail" 
              type="email" 
              placeholder="Örn: info@firmam.com"
              class="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition focus:border-blue-600 border-slate-300 text-slate-900 bg-white font-medium"
            />
          </div>

          <!-- Web Sayfası Linki -->
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>PROJE / FİRMA WEB SAYFASI LİNKİ</span>
              <span class="text-[9px] font-bold text-slate-400 font-normal">(Varsa İlanda Görünür)</span>
            </label>
            <input 
              v-model="form.websiteUrl" 
              type="url" 
              placeholder="Örn: https://www.peyzaj.com/proje"
              class="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition focus:border-emerald-600 border-emerald-300 text-slate-900 bg-emerald-50/20 font-bold"
            />
          </div>

          <!-- Ödeme Yöntemi Tercihi -->
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">ÖDEME YÖNTEMİ</label>
            <select 
              v-model="form.odemeYontemi" 
              class="w-full px-3 py-2.5 rounded-xl border text-xs outline-none bg-white transition focus:border-blue-600 border-slate-300 text-slate-900 font-medium"
            >
              <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ⚙️ GELİŞMİŞ İHALE SEÇENEKLERİ & KALEM LİSTESİ (İSTEĞE BAĞLI AKORDEON) -->
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <button 
          type="button" 
          @click="showAdvancedOptions = !showAdvancedOptions"
          class="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition flex items-center justify-between text-left cursor-pointer border-b border-slate-200"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-base">⚙️</span>
            <div>
              <span class="text-xs font-black text-slate-800 uppercase tracking-wider block">Gelişmiş İhale Seçenekleri & Kalem Listesi (İsteğe Bağlı)</span>
              <span class="text-[11px] text-slate-500">Parçalı kalemler, gizli rezerv fiyat, teklif adımı ve davetli erişim ayarları</span>
            </div>
          </div>
          <span class="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
            {{ showAdvancedOptions ? '▲ Seçenekleri Gizle' : '▼ Seçenekleri Göster' }}
          </span>
        </button>

        <div v-show="showAdvancedOptions" class="p-5 space-y-6 animate-fadeIn">
          <!-- Sonuçlandırma Modeli -->
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-800 uppercase tracking-wider">
              İHALE SONUÇLANDIRMA MODELİ
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                @click="form.awardMode = 'ALL_OR_NOTHING'"
                class="p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-1 text-left"
                :class="form.awardMode === 'ALL_OR_NOTHING' ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs" :class="form.awardMode === 'ALL_OR_NOTHING' ? 'text-blue-900' : 'text-slate-800'">
                    📦 Toplu Sonuçlandırma (Tek Kazanan)
                  </span>
                  <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]" :class="form.awardMode === 'ALL_OR_NOTHING' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'">
                    <span v-if="form.awardMode === 'ALL_OR_NOTHING'">✓</span>
                  </span>
                </div>
                <p class="text-[10px] text-slate-600">Tüm kalemler tek bir kazanana bütünüyle verilir.</p>
              </div>

              <div 
                @click="form.awardMode = 'ITEM_BASED'"
                class="p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-1 text-left"
                :class="form.awardMode === 'ITEM_BASED' ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:border-slate-300'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs" :class="form.awardMode === 'ITEM_BASED' ? 'text-indigo-900' : 'text-slate-800'">
                    🧩 Kalem Bazlı Kısmi Sonuçlandırma
                  </span>
                  <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]" :class="form.awardMode === 'ITEM_BASED' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'">
                    <span v-if="form.awardMode === 'ITEM_BASED'">✓</span>
                  </span>
                </div>
                <p class="text-[10px] text-slate-600">Her kalem bağımsız olarak en avantajlı farklı firmaya verilebilir.</p>
              </div>
            </div>
          </div>

          <!-- Kalemler Listesi -->
          <div class="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">İhale Kalemleri / Malzeme Listesi</h3>
                <p class="text-[10px] text-slate-500">Birden fazla ürün veya hizmet alıyorsanız kalem ekleyerek detaylandırın.</p>
              </div>
              <button 
                type="button" 
                @click="addKalem"
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus :size="14" />
                <span>Kalem Ekle</span>
              </button>
            </div>

            <div v-if="form.kalemler.length === 0" class="p-4 border border-dashed border-slate-300 rounded-lg text-center bg-white">
              <p class="text-xs text-slate-500">Henüz özel kalem tanımlanmadı. İhale başlığı tek ana kalem olarak işleme alınacaktır.</p>
            </div>

            <div v-else class="space-y-2.5">
              <div 
                v-for="(kalem, idx) in form.kalemler" 
                :key="kalem.id || idx"
                class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Kalem #{{ idx + 1 }}
                  </span>
                  <button type="button" @click="removeKalem(idx)" class="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 :size="13" />
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div class="sm:col-span-6">
                    <input 
                      v-model="kalem.ad" 
                      type="text" 
                      placeholder="Kalem / Malzeme Adı" 
                      class="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <input 
                      v-model.number="kalem.miktar" 
                      type="number" 
                      min="1" 
                      class="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-600 font-bold"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <select 
                      v-model="kalem.birim" 
                      class="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none bg-white focus:border-blue-600"
                    >
                      <option value="Adet">Adet</option>
                      <option value="Kg">Kg</option>
                      <option value="Ton">Ton</option>
                      <option value="Metre">Metre</option>
                      <option value="m²">m²</option>
                      <option value="Litre">Litre</option>
                      <option value="Paket">Paket</option>
                      <option value="Koli">Koli</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Standart Parametreler (Min Adım, Rezerv Fiyat, Asgari Teklif Sayısı) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">
                MİNİMUM TEKLİF ADIMI
              </label>
              <input 
                v-model.number="form.minStep" 
                type="number" 
                placeholder="Örn: 1000" 
                class="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none font-bold focus:border-blue-600"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>GİZLİ REZERV FİYAT</span>
                <span class="text-amber-600 text-[9px]">🔒 gizli</span>
              </label>
              <input 
                v-model="form.reservePrice" 
                type="text" 
                placeholder="Örn: 120.000" 
                class="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none font-bold focus:border-amber-600"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">
                ASGARİ TEKLİF SAYISI
              </label>
              <select 
                v-model.number="form.minBidsCount" 
                class="w-full rounded-xl border border-slate-300 p-2 text-xs outline-none bg-white font-bold focus:border-blue-600"
              >
                <option :value="1">En az 1 Geçerli Teklif</option>
                <option :value="2">En az 2 Geçerli Teklif</option>
                <option :value="3">En az 3 Geçerli Teklif</option>
              </select>
            </div>
          </div>

          <!-- Özel Davetli İhale Seçeneği -->
          <div class="pt-2 border-t border-slate-100">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                :checked="form.visibility === 'private_invited'"
                @change="form.visibility = ($event.target as HTMLInputElement).checked ? 'private_invited' : 'public'"
                class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <span class="text-xs font-bold text-slate-800">
                🔒 Özel Davetli Kapalı İhale (Yalnızca Belirttiğim Tedarikçiler Teklif Verebilsin)
              </span>
            </label>
            <div v-if="form.visibility === 'private_invited'" class="pt-2">
              <input 
                v-model="form.invitedSuppliers" 
                type="text" 
                placeholder="Davet edilecek e-posta veya VKN numaraları (virgülle ayırınız)" 
                class="w-full rounded-xl border border-indigo-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bilgi Bandı -->
      <div 
        class="flex items-start gap-2.5 p-4 rounded-xl border"
        style="background: rgba(245,158,11,0.04); border-color: rgba(245,158,11,0.15);"
      >
        <AlertCircle :size="16" class="text-amber-500 shrink-0 mt-0.5" />
        <p class="text-[11px] leading-relaxed text-amber-800 font-medium">
          <strong>Önemli Bilgilendirme:</strong> İhaleyi başlattığınızda, seçili sektöre kayıtlı tüm doğrulanmış tedarikçilere otomatik olarak anlık bildirim ve e-posta gönderilir. Canlı teklif toplama süreci hemen başlar.
        </p>
      </div>

            <!-- Gönder Butonu -->
      <div class="pt-2">
        <button 
          type="button" 
          @click="handleSubmit"
          :disabled="isSubmittingTender"
          class="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F223D] hover:bg-[#003057] active:bg-[#061220] text-white font-black text-sm py-4 transition-all shadow-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <FilePlus2 v-if="!isEditMode" :size="18" class="text-emerald-400" />
          <Pencil v-else :size="18" class="text-blue-400" />
          <span>{{ isSubmittingTender ? (isEditMode ? 'İhale Güncelleniyor...' : 'İhale Oluşturuluyor...') : (isEditMode ? 'İhale Bilgilerini Güncelle ve Kaydet' : 'İhaleyi Oluştur ve Admin Onayına Gönder') }}</span>
        </button>
      </div>

    </div>

    <!-- Kategori Öneri Modalı (Photo 3 Kategori Öner) -->
    <div v-if="showSuggestModal" @click.self="showSuggestModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl text-left space-y-4">
        <div class="flex justify-between items-start">
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">YENİ KATEGORİ ÖNER</h3>
          <button @click="showSuggestModal = false" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X :size="16" />
          </button>
        </div>
        
        <p class="text-xs text-slate-500 leading-relaxed font-medium">
          Platformumuzda ihale açarken veya teklif verirken görmek istediğiniz sektörel kategorileri önerin, anında ekleyelim.
        </p>

        <div v-if="suggestSuccess" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center space-y-1">
          <div class="flex items-center justify-center gap-1.5 text-emerald-600">
            <CheckCircle2 :size="18" />
            <span>Kategori Başarıyla Eklendi!</span>
          </div>
          <p class="text-[11px] text-emerald-700 font-normal">Önerdiğiniz kategori formunuza tanımlandı ve hemen seçildi.</p>
        </div>

        <div v-else class="space-y-3">
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">ÖNERİLEN KATEGORİ ADI *</label>
            <input 
              v-model="suggestedCategory" 
              type="text" 
              placeholder="Örn: Peyzaj ve Bahçe Düzenleme, Medikal..." 
              class="w-full rounded-xl border p-3 text-xs outline-none focus:border-blue-600 text-slate-800"
              style="border-color: #E2E8F0;"
              @keyup.enter="submitCategorySuggestion"
            />
          </div>
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">AÇIKLAMA (OPSİYONEL)</label>
            <textarea 
              v-model="suggestedDesc" 
              rows="2" 
              placeholder="İhtiyaç duyduğunuz alt başlıkları veya açıklamayı yazabilirsiniz..." 
              class="w-full rounded-xl border p-3 text-xs outline-none focus:border-blue-600 resize-none text-slate-800"
              style="border-color: #E2E8F0;"
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-2 justify-end pt-2">
          <button type="button" @click="showSuggestModal = false" class="rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer" style="border-color: #E2E8F0;">İptal</button>
          <button 
            type="button" 
            @click="submitCategorySuggestion" 
            :disabled="isSubmittingSuggestion"
            class="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <span v-if="isSubmittingSuggestion">Ekleniyor...</span>
            <span v-else>Öneriyi Gönder & Kullan</span>
          </button>
        </div>
      </div>
    </div>

  <DeepSeekAssistantModal 
      :isOpen="showDeepSeekModal" 
      :tender="{ baslik: form.baslik || 'Yeni İhale Şartnamesi', kategori: form.kategori, aciklama: form.aciklama, city: form.sehir, butce: form.butce }" 
      @close="showDeepSeekModal = false"
      @applySuggestedBid="(price) => { form.butce = price; showDeepSeekModal = false; }"
    />
  </div>
</template>

