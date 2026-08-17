<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { locale } from '~/composables/useLocale'
import { AlertCircle, Calendar } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { usePublicApis } from '~/composables/usePublicApis'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const { cmsData, saveCmsData } = useCmsData()
const { fetchTrHolidays, trPublicHolidays } = usePublicApis()

const form = ref({
  baslik: '',
  kategori: 'İnşaat ve Yapı',
  sure: '7 gün',
  butce: '',
  aciklama: '',
  sehir: 'Balıkesir',
  teslimatAdresi: '',
  odemeYontemi: 'Vadeli 30 Gün',
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

const fileInputRef = ref<HTMLInputElement | null>(null)
const showSuccess = ref(false)
const createdId = ref('')

function triggerFileSelect() {
  fileInputRef.value?.click()
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

    const fileObj = {
      name: file.name,
      size: fileSizeMB,
      progress: 0,
      type: fileType
    }

    form.value.files.push(fileObj)

    // Simulate progress bar upload
    let interval = setInterval(() => {
      if (fileObj.progress < 100) {
        fileObj.progress += 20
      } else {
        clearInterval(interval)
      }
    }, 150)
  }
}

function removeFile(index: number) {
  form.value.files.splice(index, 1)
}

function handleSubmit() {
  if (!form.value.baslik || !form.value.butce || !form.value.teslimatAdresi) return

  // Format budget with currency sign if missing
  let budgetVal = form.value.butce.trim()
  if (!budgetVal.startsWith('₺')) {
    budgetVal = '₺' + budgetVal
  }

  // Generate unique B2B procurement ID
  const newId = 'IHC-2026-' + Math.floor(100 + Math.random() * 900)
  createdId.value = newId

  const combinedCategory = `${form.value.kategori} / ${selectedSubcategory.value}`

  // Add to active tenders list
  cmsData.value.dashboard.tenders.unshift({
    id: newId,
    baslik: form.value.baslik,
    kategori: combinedCategory,
    sure: form.value.sure,
    teklifSayisi: 0,
    durum: 'active',
    butce: budgetVal,
    city: form.value.sehir,
    olusturma: 'Bugün'
  })

  // Create matching empty received bids slot
  cmsData.value.dashboard.receivedBids.unshift({
    id: newId,
    baslik: form.value.baslik,
    kategori: combinedCategory,
    bitis: form.value.sure,
    teklifler: []
  })

  // Persist to localStorage
  saveCmsData(cmsData.value)

  showSuccess.value = true
  setTimeout(() => {
    router.push('/panel/ilanlarim')
  }, 2000)
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto text-left">
    
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
        {{ 'İlanlarıma Dön' }}
      </NuxtLink>

      <button type="button" @click="saveDraftManually" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-200 shadow-xs">
        💾 {{ 'Taslağı Kaydet' }}
      </button>
    </div>

    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <FilePlus2 class="text-blue-600" :size="22" />
        {{ 'Yeni İhale İlanı Oluştur' }}
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Satın alma talebiniz için tedarikçilerden rekabetçi canlı teklifler toplayın</p>
    </div>

    <!-- Başarı Mesajı -->
    <div v-if="showSuccess" class="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center transition-all animate-bounce">
      <CheckCircle2 class="text-emerald-500 mx-auto mb-2" :size="36" />
      <h3 class="text-sm font-bold text-emerald-800">İhale Başarıyla Oluşturuldu!</h3>
      <p class="text-xs text-emerald-600 mt-1">İhale Kodu: <strong>{{ createdId }}</strong>. İlanlarım listesine yönlendiriliyorsunuz...</p>
    </div>

    <!-- İhale Formu -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- KART 1: GENEL BİLGİLER -->
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
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

          <!-- Yaklaşık Bütçe -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">YAKLAŞIK BÜTÇE (₺) *</label>
            <input 
              v-model="form.butce" 
              type="text" 
              required 
              placeholder="Örn: 150.000" 
              class="w-full rounded-lg border p-3 text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              style="border-color: #CBD5E1; color: #0F172A;"
            />
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
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">2. Lojistik & Ödeme Şartları</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Ödeme Yöntemi Tercihi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">ÖDEME YÖNTEMİ TERCİHİ</label>
            <div class="relative">
              <CreditCard :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                v-model="form.odemeYontemi" 
                class="w-full pl-9 pr-4 py-3 rounded-lg border text-xs outline-none bg-white transition focus:border-blue-600"
                style="border-color: #CBD5E1; color: #0F172A;"
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
                class="w-full pl-9 pr-4 py-3 rounded-lg border text-xs outline-none bg-white transition focus:border-blue-600 font-bold"
                style="border-color: #CBD5E1; color: #0F172A;"
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
                class="w-full pl-9 pr-4 py-2.5 rounded-lg border text-xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style="border-color: #CBD5E1; color: #0F172A;"
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
            class="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
          >
            🚀 Yeni Kategori Öner
          </button>
        </div>
      </div>

      <!-- KART 3: TEKNİK AÇIKLAMALAR -->
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">3. Teknik Açıklama & Kalem Detayları</h2>
        
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

      <!-- KART 4: DOSYA & ŞARTNAME YÜKLEME -->
      <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
        <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">4. Şartname & Ek Belgeler Yükleme</h2>
        
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
              class="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition"
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
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 transition shadow-lg shadow-blue-500/10 cursor-pointer"
        >
          <FilePlus2 :size="16" />
          İhaleyi Başlat ve İlan Et
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
