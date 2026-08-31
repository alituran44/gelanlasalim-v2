<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { locale } from '~/composables/useLocale'
import { AlertCircle, Calendar, UploadCloud, FileText, FileSpreadsheet, X, Camera, Eye, Trash2, Plus, ShieldAlert, FileCheck, CheckCircle2, FilePlus2, ArrowLeft } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { usePublicApis } from '~/composables/usePublicApis'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const { cmsData, saveCmsData } = useCmsData()
const { fetchTrHolidays, trPublicHolidays } = usePublicApis()

const fileInputRef = ref<HTMLInputElement | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  baslik: '',
  kategori: 'İnşaat ve Yapı',
  sure: '7 gün',
  minButce: '',
  maxButce: '',
  butce: '',
  aciklama: '',
  sehir: 'Balıkesir',
  teslimatAdresi: '',
  odemeYontemi: 'Vadeli 30 Gün',
  images: [] as { url: string; name: string }[],
  files: [] as { name: string; size: string; progress: number; type: string }[]
})

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

// Subcategory Map (Photo 4 Alt Kategoriler)
const categoryMap = {
  'İnşaat ve Yapı': [
    'Anahtar Teslim İnşaat', 'Konut İnşaatı', 'Ticari Bina İnşaatı', 'Fabrika İnşaatı', 'Yol Yapımı',
    'Köprü Yapımı', 'Altyapı Çalışmaları', 'Kanalizasyon', 'İçme Suyu Hatları', 'Doğalgaz Hatları',
    'Elektrik Altyapısı', 'Çatı İşleri', 'Cephe Kaplama', 'Mantolama', 'Boya Badana',
    'Seramik Döşeme', 'Mermer İşleri', 'Demir-Çelik İşleri', 'Kalıp ve İskele', 'Beton İşleri',
    'Asfalt', 'Parke', 'Peyzaj', 'Yıkım İşleri', 'Restorasyon'
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
    'Fuar Organizasyonu', 'Kongre', 'Seminer', 'Konser', 'Festival', 'Catering',
    'Sahne Sistemleri', 'Ses ve Işık Sistemleri'
  ],
  'Diğer': [
    'Muhtelif Alımlar', 'Karma İhaleler', 'Özel Projeler', 'Açık Artırmalar', 'Tasfiye Satışları',
    'Hurda Satışları', 'İkinci El Ürünler'
  ]
}

const categories = Object.keys(categoryMap)

const currentSubcategories = computed(() => {
  return (categoryMap as any)[form.value.kategori] || []
})

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
  'Vadeli 30 Gün',
  'Vadeli 60 Gün',
  'Vadeli 90 Gün',
  'Peşin Ödeme / Havale',
  'Akreditif (L/C)',
  'Mal Mukabili'
]

const hasDraft = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
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
      if (e.target?.result) {
        form.value.images.push({
          url: e.target.result as string,
          name: file.name
        })
      }
    }
    reader.readAsDataURL(file)
  }
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
    if (file.name.endsWith('.pdf')) fileType = 'pdf'
    else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) fileType = 'excel'

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = (e.target?.result as string) || ''
      const fileObj = {
        name: file.name,
        size: fileSizeMB,
        progress: 100,
        type: fileType,
        url: dataUrl
      }
      form.value.files.push(fileObj)
    }
    reader.readAsDataURL(file)
  }
}

function removeFile(index: number) {
  form.value.files.splice(index, 1)
}

function handleSubmit() {
  if (!form.value.baslik) {
    alert(locale.value === 'tr' ? 'Lütfen ihale başlığını giriniz.' : 'Please enter a tender title.')
    return
  }

  // Format budget with min-max range or open auction
  let budgetVal = ''
  const min = form.value.minButce ? form.value.minButce.replace(/[^\d.,]/g, '').trim() : ''
  const max = form.value.maxButce ? form.value.maxButce.replace(/[^\d.,]/g, '').trim() : ''

  if (min && max) {
    budgetVal = `${min} ₺ - ${max} ₺`
  } else if (min && !max) {
    budgetVal = `Min. ${min} ₺`
  } else if (!min && max) {
    budgetVal = `Maks. ${max} ₺`
  } else if (form.value.butce) {
    budgetVal = form.value.butce.includes('₺') ? form.value.butce : `${form.value.butce} ₺`
  } else {
    budgetVal = 'Teklif Usulü (Açık İhale)'
  }

  const deliveryAddress = form.value.teslimatAdresi || `${form.value.sehir} Merkez Teslimat`

  // Generate unique B2B procurement ID
  const newId = 'IHC-2026-' + Math.floor(100 + Math.random() * 900)
  createdId.value = newId

  const subCat = selectedSubcategory.value || 'Genel Satın Alma'
  const combinedCategory = `${form.value.kategori} / ${subCat}`
  const primaryImg = form.value.images[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60'
  const imgList = form.value.images.map(img => img.url)

  let session: any = {}
  if (typeof window !== 'undefined') {
    try {
      session = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }
  const ownerEmail = session.email || 'ihalecib@gmail.com'
  const ownerName = session.name || session.firstName || 'Ali Turan'
  const ownerCompany = session.companyName || session.company || 'Ali Turan Sanayi A.Ş.'

  const tenderObject = {
    id: newId,
    baslik: form.value.baslik,
    kategori: combinedCategory,
    mainCategory: form.value.kategori,
    subCategory: subCat,
    sure: form.value.sure || '7 gün kaldı',
    teklifSayisi: 0,
    durum: 'pending_approval',
    adminApproved: false,
    statusLabel: 'Yönetici Onayı Bekliyor',
    butce: budgetVal,
    city: form.value.sehir || 'Balıkesir',
    teslimatAdresi: deliveryAddress,
    odemeYontemi: form.value.odemeYontemi,
    image: primaryImg,
    images: imgList.length > 0 ? imgList : [primaryImg],
    files: form.value.files,
    documents: form.value.files,
    aciklama: form.value.aciklama || form.value.baslik,
    ownerEmail,
    ownerName,
    ownerCompany,
    isMine: true,
    olusturma: 'Bugün'
  }

  // Add to active tenders list in CMS
  cmsData.value.dashboard.tenders.unshift(tenderObject)

  // Create matching empty received bids slot
  cmsData.value.dashboard.receivedBids.unshift({
    id: newId,
    baslik: form.value.baslik,
    kategori: combinedCategory,
    bitis: form.value.sure || '7 gün kaldı',
    image: primaryImg,
    teklifler: []
  })

  // Persist to localStorage
  saveCmsData(cmsData.value)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'))

  if (typeof window !== 'undefined') {
    try {
      const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
      myTenders.unshift(tenderObject)
      localStorage.setItem('myTenders', JSON.stringify(myTenders))

      // Trigger automatic category notification
      const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]')
      notifications.unshift({
        id: Date.now(),
        title: 'İhale Admin Onayına İletildi',
        desc: `"${form.value.baslik}" başlıklı satın alma talebiniz oluşturuldu ve Admin Onay Masası'na gönderildi. Onaylandıktan sonra Pazar Yeri'nde yayınlanacaktır.`,
        date: 'Şimdi',
        read: false,
        type: 'tender'
      })
      localStorage.setItem('userNotifications', JSON.stringify(notifications))
    } catch (e) {}
  }

  // Summary object for persistent success view
  submittedTenderSummary.value = {
    id: newId,
    baslik: form.value.baslik,
    kategori: combinedCategory,
    butce: budgetVal,
    city: form.value.sehir || 'Balıkesir',
    filesCount: form.value.files.length,
    imagesCount: form.value.images.length,
    files: [...form.value.files]
  }

  // Clear draft
  clearDraft()

  showSuccess.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <FilePlus2 class="text-blue-600" :size="22" />
        {{ 'Yeni İhale Talebi Oluştur' }}
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Satın alma talebiniz için tedarikçilerden rekabetçi canlı teklifler toplayın</p>
    </div>



    <!-- ZENGİN İHALE ONAY VE GÖNDERİLDİ EKRANI -->
    <div v-if="showSuccess" class="mb-8 rounded-3xl bg-white border border-emerald-300 p-6 sm:p-8 text-center space-y-5 shadow-xl animate-fadeIn">
      <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 :size="36" />
      </div>
      
      <div class="space-y-1">
        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider inline-block">
          ✓ İhale İlanınız Başarıyla Oluşturuldu ve Gönderildi
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
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- KART 1: GENEL BİLGİLER -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-4 border-slate-200">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">1. İhale Genel Bilgileri</h2>
        
        <!-- İhale Başlığı -->
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">İHALE BAŞLIĞI *</label>
          <input 
            v-model="form.baslik" 
            type="text" 
            required 
            placeholder="Örn: 20.000 Adet Mukavva Kutu Alımı" 
            class="w-full rounded-lg border p-3 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" 
            style="border-color: #CBD5E1; color: #0F172A;"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Kategori -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">ANA KATEGORİ</label>
            <select 
              v-model="form.kategori" 
              class="w-full rounded-lg border p-3 text-xs outline-none bg-white transition focus:border-blue-600"
              style="border-color: #CBD5E1; color: #0F172A;"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Alt Kategori (Photo 4 Alt Kategoriler) -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">ALT KATEGORİ *</label>
            <select 
              v-model="selectedSubcategory" 
              class="w-full rounded-lg border p-3 text-xs outline-none bg-white transition focus:border-blue-600"
              style="border-color: #CBD5E1; color: #0F172A;"
            >
              <option v-for="sub in currentSubcategories" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>

          <!-- Pazarlık & Bütçe Aralığı (Min Taban - Maks Tavan) -->
          <div class="col-span-1 md:col-span-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>💰 PAZARLIK VE BÜTÇE ARALIĞI</span>
              </label>
              <span class="text-[10px] font-bold text-slate-400 lowercase">(isteğe bağlı / boş bırakılabilir)</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Minimum Alt Değer / Taban Fiyat -->
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">
                  MİNİMUM ALT DEĞER (TABAN ₺)
                </label>
                <input 
                  v-model="form.minButce" 
                  type="text" 
                  placeholder="Örn: 50.000 (Pazarlık alt sınırı)" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
                  style="border-color: #CBD5E1; color: #0F172A;"
                />
              </div>

              <!-- Maksimum Tavan Bütçe -->
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">
                  MAKSİMUM TAVAN BÜTÇE (₺)
                </label>
                <input 
                  v-model="form.maxButce" 
                  type="text" 
                  placeholder="Örn: 150.000 (Hedef üst sınır)" 
                  class="w-full rounded-xl border p-2.5 text-xs outline-none bg-white transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
                  style="border-color: #CBD5E1; color: #0F172A;"
                />
              </div>
            </div>

            <p class="text-[10px] text-slate-500 leading-relaxed">
              💡 Tedarikçilerin teklif verirken baz alacağı minimum başlangıç tabanını ve maksimum hedef bütçeyi belirleyebilirsiniz. Boş bırakırsanız <strong>"Teklif Usulü (Açık İhale)"</strong> olarak yayınlanır.
            </p>
          </div>
        </div>

        <!-- İhale Süresi -->
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TEKLİF TOPLAMA SÜRESİ</label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button 
              v-for="dur in durations" 
              :key="dur" 
              type="button"
              @click="form.sure = dur"
              class="rounded-lg border py-2 text-xs font-bold transition text-center"
              :style="form.sure === dur 
                ? 'background: #1E3A5F; border-color: #1E3A5F; color: white;' 
                : 'background: white; border-color: #CBD5E1; color: #475569;'"
            >
              {{ dur }}
            </button>
          </div>
        </div>
      </div>

      <!-- KART 2: LOJİSTİK VE ÖDEME ŞARTLARI -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-4 border-slate-200">
        <h2 class="text-xs font-black uppercase tracking-wider text-[#003057] mb-2">2. Lojistik & Ödeme Şartları</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Ödeme Yöntemi Tercihi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">ÖDEME YÖNTEMİ TERCİHİ</label>
            <div class="relative">
              <CreditCard :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                v-model="form.odemeYontemi" 
                class="w-full pl-9 pr-4 py-3 rounded-xl border text-xs outline-none bg-white transition focus:border-[#003057] border-slate-300 text-slate-900"
              >
                <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
              </select>
            </div>
          </div>

          <!-- İl / Bölge Seçimi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TESLİMAT İLİ / BÖLGESİ *</label>
            <div class="relative">
              <MapPin :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                v-model="form.sehir" 
                class="w-full pl-9 pr-4 py-3 rounded-xl border text-xs outline-none bg-white transition focus:border-[#003057] font-bold border-slate-300 text-slate-900"
              >
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>

          <!-- Teslimat Adresi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TESLİMAT / SEVK ADRESİ *</label>
            <div class="relative">
              <MapPin :size="14" class="absolute left-3 top-3 text-slate-400" />
              <textarea 
                v-model="form.teslimatAdresi" 
                rows="1"
                required
                placeholder="Örn: Balıkesir OSB, 3. Yol No: 12" 
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs outline-none transition focus:border-[#003057] border-slate-300 text-slate-900"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Kategori Öner Modülü (Photo 3 Kategori Öner) -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Aradığınız sektörel kategoriyi listede bulamadınız mı?</span>
          <button 
            type="button" 
            @click="showSuggestModal = true" 
            class="text-[#003057] hover:text-[#1EAE4C] font-bold flex items-center gap-1 hover:underline"
          >
            🚀 Yeni Kategori Öner
          </button>
        </div>
      </div>

      <!-- KART 3: TEKNİK AÇIKLAMALAR -->
      <div class="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm space-y-4 border-slate-200">
        <h2 class="text-xs font-black uppercase tracking-wider text-[#003057] mb-2">3. Teknik Açıklama & Kalem Detayları</h2>
        
        <!-- Teknik Açıklama -->
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TEKNİK ŞARTNAME & AÇIKLAMA</label>
          <textarea 
            v-model="form.aciklama" 
            rows="4" 
            placeholder="İhale kalemlerinin net miktarlarını, kalite gereksinimlerini ve sevkiyat şartlarını buraya yazabilirsiniz..." 
            class="w-full rounded-lg border p-3 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            style="border-color: #CBD5E1; color: #0F172A;"
          ></textarea>
        </div>
      </div>

      <!-- KART 4: İHALE & NUMUNE GÖRSELLERİ YÜKLEME -->
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Camera :size="15" />
            <span>4. İhale & Numune Görselleri Yükleme (Fotoğraf)</span>
          </h2>
          <span class="text-[10px] text-slate-400 font-bold">İsteğe Bağlı</span>
        </div>
        
        <!-- Image Upload Drag & Drop Zone -->
        <div 
          @click="triggerImageSelect"
          class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group border-slate-300"
        >
          <Camera :size="28" class="text-slate-400 group-hover:text-blue-600 transition" />
          <div>
            <span class="text-xs font-bold text-slate-700">İhale Ürün Fotoğrafı veya Numune Görseli Yükleyin</span>
            <p class="text-[10px] text-slate-400 mt-1">JPG, PNG veya WEBP (Maks: 5MB)</p>
          </div>
          <input 
            ref="imageInputRef"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleImageChange"
          />
        </div>

        <!-- Predefined sample quick-add buttons -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <span class="text-[10px] font-bold text-slate-400">Hızlı Numune Ekle:</span>
          <button 
            type="button" 
            @click="addSampleImage('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', 'Kurumsal Donanım Numunesi')"
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center gap-1"
          >
            <Plus :size="10" /> 💻 Donanım / Laptop
          </button>
          <button 
            type="button" 
            @click="addSampleImage('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80', 'İnşaat / Çatı Numunesi')"
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center gap-1"
          >
            <Plus :size="10" /> 🏗️ Çatı / İnşaat
          </button>
          <button 
            type="button" 
            @click="addSampleImage('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80', 'Kutu & Koli Ambalaj Numunesi')"
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center gap-1"
          >
            <Plus :size="10" /> 📦 Ambalaj / Kutu
          </button>
        </div>

        <!-- Uploaded Images Preview Grid -->
        <div v-if="form.images.length > 0" class="space-y-2 mt-3 pt-3 border-t border-slate-100">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider">YÜKLENEN GÖRSELLER ({{ form.images.length }})</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              v-for="(img, idx) in form.images" 
              :key="idx"
              class="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group h-28"
            >
              <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
              <button 
                type="button"
                @click="removeImage(idx)"
                class="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                title="Görseli Sil"
              >
                <Trash2 :size="12" />
              </button>
              <div class="absolute bottom-0 inset-x-0 bg-slate-900/80 p-1 text-[9px] text-white truncate px-1.5">
                {{ img.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KART 5: DOSYA & ŞARTNAME YÜKLEME -->
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">5. Şartname & Ek Belgeler Yükleme</h2>
        
        <!-- Drag & Drop Zone -->
        <div 
          @click="triggerFileSelect"
          class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group"
          style="border-color: #CBD5E1;"
        >
          <UploadCloud :size="28" class="text-slate-400 group-hover:text-blue-600 transition" />
          <div>
            <span class="text-xs font-bold text-slate-700">Teknik veya İdari Şartname Dosyası Yükleyin</span>
            <p class="text-[10px] text-slate-400 mt-1">PDF, Word veya Excel (Maks: 10MB)</p>
          </div>
          <input 
            ref="fileInputRef"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <!-- Uploaded Files List -->
        <div v-if="form.files.length > 0" class="space-y-2 mt-4">
          <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider">YÜKLENEN BELGELER</label>
          <div 
            v-for="(file, index) in form.files" 
            :key="index"
            class="flex items-center gap-3 p-3 bg-slate-50 border rounded-xl"
            style="border-color: #E2E8F0;"
          >
            <!-- File Icon type -->
            <FileText v-if="file.type === 'pdf'" :size="16" class="text-red-500 shrink-0" />
            <FileSpreadsheet v-else-if="file.type === 'excel'" :size="16" class="text-emerald-600 shrink-0" />
            <FileText v-else :size="16" class="text-blue-600 shrink-0" />

            <!-- File details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700 truncate pr-4">{{ file.name }}</span>
                <span class="text-[10px] text-slate-400 shrink-0 font-medium">{{ file.size }}</span>
              </div>
              
              <!-- Progress Bar -->
              <div class="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  class="bg-blue-600 h-full rounded-full transition-all duration-300"
                  :style="{ width: file.progress + '%' }"
                ></div>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[9px] font-bold text-blue-600">
                  {{ file.progress < 100 ? `Yükleniyor %${file.progress}` : 'Hazır / Yüklendi ✓' }}
                </span>
              </div>
            </div>

            <!-- Remove file button -->
            <button 
              type="button"
              @click="removeFile(index)"
              class="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <X :size="14" />
            </button>
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
          type="submit" 
          class="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0F223D] hover:bg-[#003057] text-white font-black text-sm py-4 transition shadow-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <FilePlus2 :size="16" class="text-emerald-400" />
          <span>İhaleyi Oluştur ve Admin Onayına Gönder</span>
        </button>
      </div>

    </form>

    <!-- Kategori Öneri Modalı (Photo 3 Kategori Öner) -->
    <div v-if="showSuggestModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl text-left space-y-4">
        <div class="flex justify-between items-start">
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">YENİ KATEGORİ ÖNER</h3>
          <button @click="showSuggestModal = false" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X :size="16" />
          </button>
        </div>
        
        <p class="text-xs text-slate-500 leading-relaxed font-medium">
          Platformumuzda ihale açarken veya teklif verirken görmek istediğiniz sektörel kategorileri önerin, hemen ekleyelim.
        </p>

        <div v-if="suggestSuccess" class="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold text-center">
          Kategori öneriniz alınmıştır, teşekkür ederiz!
        </div>

        <div v-else class="space-y-3">
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">ÖNERİLEN KATEGORİ ADI *</label>
            <input 
              v-model="suggestedCategory" 
              type="text" 
              required
              placeholder="Örn: Medikal Cihaz Yedek Parçaları" 
              class="w-full rounded-xl border p-3 text-xs outline-none focus:border-blue-600 text-slate-800"
              style="border-color: #E2E8F0;"
            />
          </div>
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">AÇIKLAMA (OPSİYONEL)</label>
            <textarea 
              v-model="suggestedDesc" 
              rows="2" 
              placeholder="Neden bu kategoriye ihtiyaç duyduğunuzu kısaca açıklayabilirsiniz..." 
              class="w-full rounded-xl border p-3 text-xs outline-none focus:border-blue-600 resize-none text-slate-800"
              style="border-color: #E2E8F0;"
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-2 justify-end pt-2">
          <button type="button" @click="showSuggestModal = false" class="rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50" style="border-color: #E2E8F0;">İptal</button>
          <button type="button" @click="submitCategorySuggestion" class="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition">Öneriyi Gönder</button>
        </div>
      </div>
    </div>

  </div>
</template>

