<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Camera,
  Video,
  FileCheck,
  ShieldCheck,
  Building2,
  User,
  Plus
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const route = useRoute()
const { cmsData, saveCmsData } = useCmsData()
const { userSession, userName, isCompanyMode } = useUserSession()

// =========================================================================
// 🗂️ AKTİF FORM TÜRÜ (Kullanıcı Çizimlerine Göre: 4 Ana Şablon)
// 1. ACIK EKSILTME
// 2. ARSA İÇİN
// 3. EV
// 4. DİĞER İLAN MENULERİ
// =========================================================================
type FormMode = 'eksiltme' | 'arsa' | 'ev' | 'diger'
const activeFormMode = ref<FormMode>('eksiltme')

// 81 İl Listesi
const CITIES = [
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

// Standart Kategoriler Haritası
const categoryMap: Record<string, string[]> = {
  'İnşaat ve Yapı': [
    'Anahtar Teslim İnşaat', 'Kaba İnşaat', 'İnce İşçilik', 'Çatı ve Yalıtım', 'Boya Badana',
    'Elektrik ve Tesisat', 'Peyzaj ve Çevre Düzenleme', 'Yıkım ve Moloz', 'DİĞER'
  ],
  'Sanayi ve Makine': [
    'Üretim Makineleri', 'CNC ve Torna', 'Endüstriyel Otomasyon', 'Kompresör ve Pompa',
    'Kaynak ve Metal İşleme', 'Paketleme Makineleri', 'Yedek Parça', 'DİĞER'
  ],
  'Bilgisayar ve Teknoloji': [
    'Yazılım Geliştirme', 'Web ve Mobil Tasarım', 'Sunucu ve Bulut', 'Donanım ve Bilgisayar',
    'Ağ ve Güvenlik', 'ERP / CRM Sistemleri', 'DİĞER'
  ],
  'Peyzaj ve Bahçe': [
    'Otomatik Sulama Sistemleri', 'Rulo Çim Uygulaması', 'Fidan ve Ağaçlandırma',
    'Bahçe Bakım Hizmetleri', 'Sert Zemin ve Parke Taşı', 'DİĞER'
  ],
  'Mühendislik ve Mimarlık': [
    'Statik Proje Çizimi', 'Mimari Tasarım ve 3D', 'Mekanik Tesisat Çizimi',
    'Zemin Etüdü ve Geoteknik', 'Yapı Denetim ve Kontrollük', 'DİĞER'
  ],
  'Nakliye ve Lojistik': [
    'Şehirler Arası Nakliye', 'Fabrika Taşımacılığı', 'Depolama ve Dağıtım',
    'Vinç ve Ağır Nakliyat', 'Kurye ve Dağıtım', 'DİĞER'
  ],
  'Mobilya ve Ofis': [
    'Büro Mobilyaları', 'Okul ve Hastane Donanımı', 'Özel İmalat Ahşap',
    'Metal Raf Sistemleri', 'Koltuk ve Sandalye', 'DİĞER'
  ],
  'Medikal ve Sağlık': [
    'Tıbbi Sarf Malzeme', 'Laboratuvar Ekipmanları', 'Dezenfektan ve Hijyen',
    'Hasta Karyolası ve Donanım', 'DİĞER'
  ],
  'Gıda ve Catering': [
    'Kurumsal Yemek / Catering', 'Toptan Bakliyat & Gıda', 'Et ve Süt Ürünleri',
    'Kantin ve İkram Hizmetleri', 'DİĞER'
  ],
  'DİĞER': ['Genel Alım', 'Özel Proje', 'DİĞER']
}

const mainCategoryList = Object.keys(categoryMap)

// =========================================================================
// 1. AÇIK EKSİLTME STATE (Görsel 1)
// =========================================================================
const eksiltmeForm = reactive({
  anaKategori: 'İnşaat ve Yapı',
  anaKategoriDiger: '',
  altKategori: 'Anahtar Teslim İnşaat',
  altKategoriDiger: '',
  baslik: '',
  beklentiAltSinir: '',
  beklentiUstSinir: '',
  sartnameDosyasi: null as File | null,
  sartnameDosyaAdi: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '7 gün'
})

// =========================================================================
// 2. ARSA STATE (Görsel 2)
// =========================================================================
const arsaForm = reactive({
  anaKategori: 'GAYRİMENKUL İLANI',
  anaKategoriDiger: '',
  islemTuru: 'SATILIK', // KİRALIK | SATILIK | TAKAS | DİĞER
  islemTuruDiger: '',
  altKategori: 'ARSA', // ARSA | KONUT İMARLI | İŞYERİ İMARLI | TARLA | ZEYTİNLİK | MEYVELİK | DİĞER
  altKategoriDiger: '',
  il: 'Balıkesir',
  ilce: '',
  mahalle: '',
  ada: '',
  parsel: '',
  tabanFiyat: '',
  ekspertizYap: false,
  ekspertizDosyasi: null as File | null,
  ekspertizDosyaAdi: '',
  baslik: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '15 gün'
})

// =========================================================================
// 3. EV STATE (Görsel 3)
// =========================================================================
const evForm = reactive({
  anaKategori: 'GAYRİMENKUL İLANI',
  anaKategoriDiger: '',
  islemTuru: 'SATILIK', // KİRALIK | SATILIK | TAKAS | DİĞER
  islemTuruDiger: '',
  altKategori: 'EV', // EV | VİLLA | OFİS | İŞYERİ | SİTE İÇİ EV | ARSA | DİĞER
  altKategoriDiger: '',
  il: 'Balıkesir',
  ilce: '',
  mahalle: '',
  tabanFiyat: '',
  ekspertizYap: false,
  ekspertizDosyasi: null as File | null,
  ekspertizDosyaAdi: '',
  baslik: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  odaSayisi: '3+1',
  yasi: '0 (Sıfır Bina)',
  banyoSayisi: '1',
  katAdedi: '5',
  bulunduguKat: '2. Kat',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '15 gün'
})

// =========================================================================
// 4. DİĞER İLAN MENULERİ STATE (Görsel 4)
// =========================================================================
const digerForm = reactive({
  anaKategori: 'Sanayi ve Makine',
  anaKategoriDiger: '',
  altKategori: 'Üretim Makineleri',
  altKategoriDiger: '',
  baslik: '',
  tabanFiyat: '',
  tavanFiyat: '',
  sartnameDosyasi: null as File | null,
  sartnameDosyaAdi: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '7 gün'
})

// Dinamik Alt Kategori Listeleri
const currentEksiltmeSubcategories = computed(() => {
  return categoryMap[eksiltmeForm.anaKategori] || ['Genel', 'DİĞER']
})

const currentDigerSubcategories = computed(() => {
  return categoryMap[digerForm.anaKategori] || ['Genel', 'DİĞER']
})

// Sayfa yüklendiğinde oturum bilgilerini otomatik formlara doldur
onMounted(() => {
  const s = userSession.value || {}
  const defaultName = userName.value || s.companyName || s.name || s.email?.split('@')[0] || ''
  const defaultPhone = s.phone || ''
  const defaultCity = s.city || 'Balıkesir'
  const defaultWeb = s.website || ''

  // Eksiltme
  eksiltmeForm.ilanVeren = defaultName
  eksiltmeForm.telefon = defaultPhone
  eksiltmeForm.adres = defaultCity
  eksiltmeForm.webSayfasi = defaultWeb

  // Arsa
  arsaForm.ilanVeren = defaultName
  arsaForm.telefon = defaultPhone
  arsaForm.adres = defaultCity
  arsaForm.webSayfasi = defaultWeb

  // Ev
  evForm.ilanVeren = defaultName
  evForm.telefon = defaultPhone
  evForm.adres = defaultCity
  evForm.webSayfasi = defaultWeb

  // Diğer
  digerForm.ilanVeren = defaultName
  digerForm.telefon = defaultPhone
  digerForm.adres = defaultCity
  digerForm.webSayfasi = defaultWeb

  // URL query ile mod belirleme varsa (?mode=arsa vb.)
  const qMode = route.query.mode as FormMode
  if (qMode && ['eksiltme', 'arsa', 'ev', 'diger'].includes(qMode)) {
    activeFormMode.value = qMode
  }
})

// Dosya & Resim Yükleme Yardımcıları
function handleSingleFileUpload(e: Event, targetForm: any, fieldKey: string, nameKey: string) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    targetForm[fieldKey] = file
    targetForm[nameKey] = file.name
  }
}

function handleMultipleImages(e: Event, targetForm: any) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i]
      const url = URL.createObjectURL(file)
      targetForm.resimler.push({ name: file.name, url })
    }
  }
}

function removeImage(targetForm: any, index: number) {
  targetForm.resimler.splice(index, 1)
}

function openWebsiteUrl(rawUrl: string) {
  if (!rawUrl) return
  let url = rawUrl.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

// =========================================================================
// 🚀 İLANI / İHALEYİ YAYINLAMA İŞLEMİ (SUBMIT)
// =========================================================================
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const errorMessage = ref('')

async function submitCurrentForm() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    let finalBaslik = ''
    let finalCategory = ''
    let finalSubCategory = ''
    let finalBudget = 'Belirtilmedi'
    let finalFiles: any[] = []
    let finalImages: any[] = []
    let finalCustomFields: Record<string, any> = {}
    let finalCity = 'Balıkesir'
    let finalAddress = ''
    let finalPhone = ''
    let finalWeb = ''
    let finalOwner = ''
    let finalAciklama = ''
    let finalDirection = 'eksiltme'

    // Form türüne göre verileri harmanla
    if (activeFormMode.value === 'eksiltme') {
      if (!eksiltmeForm.baslik.trim()) {
        throw new Error('Lütfen ilan başlığını giriniz.')
      }
      finalBaslik = eksiltmeForm.baslik.trim()
      finalCategory = eksiltmeForm.anaKategori === 'DİĞER' ? (eksiltmeForm.anaKategoriDiger || 'Diğer') : eksiltmeForm.anaKategori
      finalSubCategory = eksiltmeForm.altKategori === 'DİĞER' ? (eksiltmeForm.altKategoriDiger || 'Diğer') : eksiltmeForm.altKategori
      finalDirection = 'eksiltme'
      
      const alt = eksiltmeForm.beklentiAltSinir ? `${eksiltmeForm.beklentiAltSinir} ₺` : ''
      const ust = eksiltmeForm.beklentiUstSinir ? `${eksiltmeForm.beklentiUstSinir} ₺` : ''
      if (alt && ust) finalBudget = `${alt} - ${ust}`
      else if (alt) finalBudget = `Min ${alt}`
      else if (ust) finalBudget = `Maks ${ust}`

      if (eksiltmeForm.sartnameDosyaAdi) {
        finalFiles.push({ name: eksiltmeForm.sartnameDosyaAdi, size: 'Şartname Belgesi', type: 'doc' })
      }
      finalImages = eksiltmeForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'ACIK_EKSILTME',
        beklentiAltSinir: eksiltmeForm.beklentiAltSinir,
        beklentiUstSinir: eksiltmeForm.beklentiUstSinir,
        videoUrl: eksiltmeForm.videoUrl,
        videoDosyaAdi: eksiltmeForm.videoDosyaAdi
      }
      finalOwner = eksiltmeForm.ilanVeren
      finalAddress = eksiltmeForm.adres
      finalPhone = eksiltmeForm.telefon
      finalWeb = eksiltmeForm.webSayfasi
      finalAciklama = eksiltmeForm.aciklama

    } else if (activeFormMode.value === 'arsa') {
      if (!arsaForm.baslik.trim()) {
        throw new Error('Lütfen arsa ilan başlığını giriniz.')
      }
      finalBaslik = arsaForm.baslik.trim()
      finalCategory = 'Gayrimenkul'
      const islem = arsaForm.islemTuru === 'DİĞER' ? (arsaForm.islemTuruDiger || 'İlan') : arsaForm.islemTuru
      const altK = arsaForm.altKategori === 'DİĞER' ? (arsaForm.altKategoriDiger || 'Arsa') : arsaForm.altKategori
      finalSubCategory = `${islem} ${altK}`
      finalDirection = islem === 'KİRALIK' ? 'kiralik' : 'satis'
      finalCity = arsaForm.il || 'Balıkesir'
      finalAddress = `${arsaForm.il} / ${arsaForm.ilce || ''} ${arsaForm.mahalle ? ' - ' + arsaForm.mahalle : ''}`
      finalBudget = arsaForm.tabanFiyat ? `${arsaForm.tabanFiyat} ₺` : 'Fiyat Belirtilmedi'

      if (arsaForm.ekspertizDosyaAdi) {
        finalFiles.push({ name: arsaForm.ekspertizDosyaAdi, size: 'Ekspertiz Raporu', type: 'pdf' })
      }
      finalImages = arsaForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'ARSA',
        islemTuru: islem,
        altKategori: altK,
        il: arsaForm.il,
        ilce: arsaForm.ilce,
        mahalle: arsaForm.mahalle,
        ada: arsaForm.ada,
        parsel: arsaForm.parsel,
        tabanFiyat: arsaForm.tabanFiyat,
        ekspertizYap: arsaForm.ekspertizYap,
        videoUrl: arsaForm.videoUrl,
        videoDosyaAdi: arsaForm.videoDosyaAdi
      }
      finalOwner = arsaForm.ilanVeren
      finalPhone = arsaForm.telefon
      finalWeb = arsaForm.webSayfasi
      finalAciklama = arsaForm.aciklama

    } else if (activeFormMode.value === 'ev') {
      if (!evForm.baslik.trim()) {
        throw new Error('Lütfen ev / konut ilan başlığını giriniz.')
      }
      finalBaslik = evForm.baslik.trim()
      finalCategory = 'Gayrimenkul'
      const islem = evForm.islemTuru === 'DİĞER' ? (evForm.islemTuruDiger || 'İlan') : evForm.islemTuru
      const altK = evForm.altKategori === 'DİĞER' ? (evForm.altKategoriDiger || 'Ev') : evForm.altKategori
      finalSubCategory = `${islem} ${altK}`
      finalDirection = islem === 'KİRALIK' ? 'kiralik' : 'satis'
      finalCity = evForm.il || 'Balıkesir'
      finalAddress = `${evForm.il} / ${evForm.ilce || ''} ${evForm.mahalle ? ' - ' + evForm.mahalle : ''}`
      finalBudget = evForm.tabanFiyat ? `${evForm.tabanFiyat} ₺` : 'Fiyat Belirtilmedi'

      if (evForm.ekspertizDosyaAdi) {
        finalFiles.push({ name: evForm.ekspertizDosyaAdi, size: 'Ekspertiz Raporu', type: 'pdf' })
      }
      finalImages = evForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'EV',
        islemTuru: islem,
        altKategori: altK,
        il: evForm.il,
        ilce: evForm.ilce,
        mahalle: evForm.mahalle,
        tabanFiyat: evForm.tabanFiyat,
        ekspertizYap: evForm.ekspertizYap,
        odaSayisi: evForm.odaSayisi,
        yasi: evForm.yasi,
        banyoSayisi: evForm.banyoSayisi,
        katAdedi: evForm.katAdedi,
        bulunduguKat: evForm.bulunduguKat,
        videoUrl: evForm.videoUrl,
        videoDosyaAdi: evForm.videoDosyaAdi
      }
      finalOwner = evForm.ilanVeren
      finalPhone = evForm.telefon
      finalWeb = evForm.webSayfasi
      finalAciklama = evForm.aciklama

    } else if (activeFormMode.value === 'diger') {
      if (!digerForm.baslik.trim()) {
        throw new Error('Lütfen ilan başlığını giriniz.')
      }
      finalBaslik = digerForm.baslik.trim()
      finalCategory = digerForm.anaKategori === 'DİĞER' ? (digerForm.anaKategoriDiger || 'Diğer') : digerForm.anaKategori
      finalSubCategory = digerForm.altKategori === 'DİĞER' ? (digerForm.altKategoriDiger || 'Diğer') : digerForm.altKategori
      finalDirection = 'satis'
      
      const taban = digerForm.tabanFiyat ? `${digerForm.tabanFiyat} ₺` : ''
      const tavan = digerForm.tavanFiyat ? `${digerForm.tavanFiyat} ₺` : ''
      if (taban && tavan) finalBudget = `${taban} - ${tavan}`
      else if (taban) finalBudget = `Taban ${taban}`
      else if (tavan) finalBudget = `Tavan ${tavan}`

      if (digerForm.sartnameDosyaAdi) {
        finalFiles.push({ name: digerForm.sartnameDosyaAdi, size: 'Şartname Belgesi', type: 'doc' })
      }
      finalImages = digerForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'DIGER',
        tabanFiyat: digerForm.tabanFiyat,
        tavanFiyat: digerForm.tavanFiyat,
        videoUrl: digerForm.videoUrl,
        videoDosyaAdi: digerForm.videoDosyaAdi
      }
      finalOwner = digerForm.ilanVeren
      finalAddress = digerForm.adres
      finalPhone = digerForm.telefon
      finalWeb = digerForm.webSayfasi
      finalAciklama = digerForm.aciklama
    }

    // Default primary image fallback
    const primaryImg = finalImages[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=600&q=80'

    // İhale / İlan ID oluştur
    const newId = `TND-${Date.now().toString().slice(-6)}`
    const ownerEmail = userSession.value?.email || 'kullanici@ihaleciburada.com'

    const tenderObject: any = {
      id: newId,
      baslik: finalBaslik,
      kategori: `${finalCategory} / ${finalSubCategory}`,
      mainCategory: finalCategory,
      subCategory: finalSubCategory,
      ihaleYonu: finalDirection,
      tur: finalDirection === 'eksiltme' ? 'Açık Eksiltme İhalesi' : 'Pazaryeri İlanı',
      rekabetTuru: finalDirection === 'eksiltme' ? 'Eksiltme' : 'Doğrudan İlan',
      sure: '7 gün kaldı',
      teklifSayisi: 0,
      durum: 'active',
      statusCode: 'LIVE',
      adminApproved: true,
      statusLabel: 'Canlı Yayında',
      butce: finalBudget,
      city: finalCity,
      teslimatAdresi: finalAddress,
      odemeYontemi: '🛡️ Güvenli İhaleciBurada Escrow ve Anlaşma Teminatı',
      image: primaryImg,
      images: finalImages.length ? finalImages : [primaryImg],
      files: finalFiles,
      documents: finalFiles,
      aciklama: finalAciklama || finalBaslik,
      customFields: finalCustomFields,
      categorySpecificData: finalCustomFields,
      websiteUrl: finalWeb,
      ownerPhone: finalPhone,
      ownerEmail,
      ownerCompany: finalOwner,
      isMine: true,
      olusturma: 'Bugün'
    }

    // 1. CMS Data kaydı
    if (!cmsData.value) cmsData.value = {} as any
    if (!cmsData.value.dashboard) cmsData.value.dashboard = {} as any
    if (!Array.isArray(cmsData.value.dashboard.tenders)) cmsData.value.dashboard.tenders = []
    cmsData.value.dashboard.tenders.unshift(tenderObject)

    try {
      saveCmsData(cmsData.value)
    } catch {}

    // 2. Server API sync
    try {
      await $fetch('/api/tenders', {
        method: 'POST',
        headers: { 'x-user-email': ownerEmail },
        body: tenderObject
      })
    } catch (err) {
      console.warn('API sync warn:', err)
    }

    // 3. LocalStorage sync
    if (typeof window !== 'undefined') {
      try {
        const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        myTenders.unshift(tenderObject)
        localStorage.setItem('myTenders', JSON.stringify(myTenders.slice(0, 30)))
      } catch {}
    }

    submitSuccess.value = true

    // Yayındaki İlanlarım sayfasına aktar
    setTimeout(() => {
      router.push('/panel/ilanlarim')
    }, 1200)

  } catch (err: any) {
    errorMessage.value = err.message || 'İlan kaydedilirken bir hata oluştu.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-3 sm:p-6 max-w-5xl mx-auto space-y-6 text-left">
    
    <!-- Üst Başlık & Geri Dön -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <NuxtLink 
            to="/panel" 
            class="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Panele Dön"
          >
            <ArrowLeft :size="16" />
          </NuxtLink>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Yeni İhale & İlan Oluştur</h1>
        </div>
        <p class="text-xs text-slate-500 mt-1">Lütfen yayınlamak istediğiniz ilan formatını seçerek formu doldurun.</p>
      </div>

      <!-- Yayındaki İlanlarım Butonu -->
      <NuxtLink
        to="/panel/ilanlarim"
        class="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition"
      >
        <span>Yayındaki İlanlarım →</span>
      </NuxtLink>
    </div>

    <!-- ========================================================================= -->
    <!-- 🎛️ 4 ANA ŞABLON SEÇİCİ SEKMELERİ (Görsel 1, 2, 3, 4) -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <!-- 1. Açık Eksiltme (Görsel 1) -->
      <button
        type="button"
        @click="activeFormMode = 'eksiltme'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'eksiltme' 
          ? 'border-pink-500 bg-pink-50/70 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-xs font-black uppercase tracking-wider flex items-center justify-between">
          <span>📉 ACIK EKSILTME</span>
          <span v-if="activeFormMode === 'eksiltme'" class="text-pink-600 text-sm">✓</span>
        </span>
        <span class="text-[10px] text-slate-500 font-medium">Ters ihale & satın alma</span>
      </button>

      <!-- 2. Arsa İçin (Görsel 2) -->
      <button
        type="button"
        @click="activeFormMode = 'arsa'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'arsa' 
          ? 'border-pink-500 bg-pink-50/70 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-xs font-black uppercase tracking-wider flex items-center justify-between">
          <span>🗺️ ARSA İÇİN</span>
          <span v-if="activeFormMode === 'arsa'" class="text-pink-600 text-sm">✓</span>
        </span>
        <span class="text-[10px] text-slate-500 font-medium">Ada, parsel, tarla, arsa</span>
      </button>

      <!-- 3. Ev (Görsel 3) -->
      <button
        type="button"
        @click="activeFormMode = 'ev'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'ev' 
          ? 'border-pink-500 bg-pink-50/70 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-xs font-black uppercase tracking-wider flex items-center justify-between">
          <span>🏠 EV</span>
          <span v-if="activeFormMode === 'ev'" class="text-pink-600 text-sm">✓</span>
        </span>
        <span class="text-[10px] text-slate-500 font-medium">Konut, daire, villa, ofis</span>
      </button>

      <!-- 4. Diğer İlan Menüleri (Görsel 4) -->
      <button
        type="button"
        @click="activeFormMode = 'diger'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'diger' 
          ? 'border-pink-500 bg-pink-50/70 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-xs font-black uppercase tracking-wider flex items-center justify-between">
          <span>📦 DİĞER İLANLAR</span>
          <span v-if="activeFormMode === 'diger'" class="text-pink-600 text-sm">✓</span>
        </span>
        <span class="text-[10px] text-slate-500 font-medium">Malzeme, teçhizat, genel</span>
      </button>
    </div>

    <!-- Başarı ve Hata Bildirimleri -->
    <div v-if="submitSuccess" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
      <CheckCircle2 :size="16" class="text-emerald-600 shrink-0" />
      <span>İlanınız başarıyla yayınlandı! Yayındaki İlanlarım sayfasına yönlendiriliyorsunuz...</span>
    </div>

    <div v-if="errorMessage" class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
      <AlertCircle :size="16" class="text-red-600 shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 1: ACIK EKSILTME (Görsel 1 Birebir) -->
    <!-- ========================================================================= -->
    <div v-if="activeFormMode === 'eksiltme'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">ACIK EKSILTME</h2>
        <p class="text-[11px] text-slate-400">Tersine eksiltme usulü alım ve malzeme tedariği ihalesi</p>
      </div>

      <!-- Kategori ve Alt Kategori (Seç / Diğer - Elle Girilsin) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Ana Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
          <select 
            v-model="eksiltmeForm.anaKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
          >
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">
              {{ cat === 'DİĞER' ? 'DİĞER' : cat }}
            </option>
          </select>

          <!-- DİĞER: Elle Girilsin -->
          <div v-if="eksiltmeForm.anaKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="eksiltmeForm.anaKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white"
            />
          </div>
        </div>

        <!-- Alt Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ALT KATAGORİ</label>
          <select 
            v-model="eksiltmeForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
          >
            <option v-for="sub in currentEksiltmeSubcategories" :key="sub" :value="sub">
              {{ sub }}
            </option>
          </select>

          <!-- DİĞER: Elle Girilsin -->
          <div v-if="eksiltmeForm.altKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="eksiltmeForm.altKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white"
            />
          </div>
        </div>

      </div>

      <!-- İLAN BAŞLIĞI EKLE -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700">İLAN BAŞLIĞI EKLE *</label>
        <input 
          v-model="eksiltmeForm.baslik"
          type="text"
          placeholder="Örn: 50.000 Adet Oluklu Koli Alımı veya Şantiye Kaba İnşaat İşi"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
        />
      </div>

      <!-- BEKLENTİ ALT SINIR & ÜST SINIR -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Beklenti Alt Sınır -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-black uppercase text-slate-800">BEKLENTİ ALT SINIR</label>
            <span class="text-[10px] font-bold text-emerald-600">İSTEĞE BAĞLI / SATICI BİLSİN</span>
          </div>
          <div class="relative">
            <input 
              v-model="eksiltmeForm.beklentiAltSinir"
              type="text"
              placeholder="YAZ (Örn: 100.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

        <!-- Beklenti Üst Sınır -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-black uppercase text-slate-800">BEKLENTİ ÜST SINIR</label>
            <span class="text-[10px] font-bold text-emerald-600">İSTEĞE BAĞLI / SATICI BİLSİN</span>
          </div>
          <div class="relative">
            <input 
              v-model="eksiltmeForm.beklentiUstSinir"
              type="text"
              placeholder="YAZ (Örn: 250.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

      </div>

      <!-- VARSA TEKNİK ŞARTNAMENİZ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileText :size="14" class="text-pink-600" />
            <span>VARSA TEKNİK ŞARTNAMENİZ</span>
          </span>
          <span class="text-[10px] font-bold text-emerald-600">ALICI SATICI GÖREBİLSİN</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-pink-500 font-bold text-xs text-slate-700 transition cursor-pointer flex items-center gap-2 shadow-2xs">
            <UploadCloud :size="14" class="text-pink-600" />
            <span>Dosya Seç</span>
            <input 
              type="file" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip"
              @change="e => handleSingleFileUpload(e, eksiltmeForm, 'sartnameDosyasi', 'sartnameDosyaAdi')"
            />
          </label>
          <span v-if="eksiltmeForm.sartnameDosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ eksiltmeForm.sartnameDosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">PDF, Word, Excel veya DWG teknik şartname</span>
        </div>
      </div>

      <!-- MEDYA: RESİM EKLE & VİDEO EKLE -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- RESİM EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Camera :size="14" class="text-pink-600" />
              <span>RESİM EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" multiple accept="image/*" class="hidden" @change="e => handleMultipleImages(e, eksiltmeForm)" />
            </label>
          </div>
          <div v-if="eksiltmeForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in eksiltmeForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 group">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(eksiltmeForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5 opacity-90 hover:opacity-100">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Ürün veya numune fotoğraflarını seçin.</p>
        </div>

        <!-- VİDEO EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Video :size="14" class="text-pink-600" />
              <span>VİDEO EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, eksiltmeForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="eksiltmeForm.videoUrl"
              type="text"
              placeholder="Veya Video Linki (YouTube / Vimeo)"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="eksiltmeForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ Yüklenen Video: {{ eksiltmeForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- İLAN VEREN BİLGİSİ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="eksiltmeForm.ilanVeren"
          type="text"
          placeholder="İlan Veren Ad Soyad / Şirket Unvanı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="eksiltmeForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Açık Adres"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="eksiltmeForm.telefon"
              type="text"
              placeholder="05XX XXX XX XX"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
        </div>

        <!-- VARSA WEB SAYFASI -->
        <div class="pt-1">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-black uppercase text-slate-600">VARSA WEB SAYFASI</label>
            <span class="text-[10px] font-bold text-emerald-600">TIKLAYINCA YAZAN SAYFA ACILSIN</span>
          </div>
          <div class="flex items-center gap-2">
            <input 
              v-model="eksiltmeForm.webSayfasi"
              type="text"
              placeholder="https://www.orneksite.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="eksiltmeForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(eksiltmeForm.webSayfasi)"
              class="px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
              title="Yazan Sayfayı Aç"
            >
              <ExternalLink :size="13" />
              <span>Aç</span>
            </button>
          </div>
        </div>
      </div>

      <!-- İsteğe Bağlı Açıklama -->
      <div class="space-y-1">
        <label class="block text-[11px] font-black uppercase text-slate-700">DETAYLI AÇIKLAMA & ŞARTLAR (OPSİYONEL)</label>
        <textarea 
          v-model="eksiltmeForm.aciklama"
          rows="3"
          placeholder="İhale şartları, teslimat tarihleri, paketleme ve diğer özel detaylar..."
          class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none focus:border-pink-500"
        ></textarea>
      </div>

      <!-- Gönder Butonu -->
      <div class="pt-2">
        <button
          type="button"
          :disabled="isSubmitting"
          @click="submitCurrentForm"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="isSubmitting">Yayınlanıyor...</span>
          <span v-else>🚀 AÇIK EKSİLTME İHALESİNİ YAYINLA</span>
        </button>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 2: ARSA İÇİN (Görsel 2 Birebir) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeFormMode === 'arsa'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">ARSA İÇİN</h2>
        <p class="text-[11px] text-slate-400">Arsa, arazi, tarla, zeytinlik ve imarlı mülk ilanı</p>
      </div>

      <!-- Ana Kategori: GAYRİMENKUL İLANI (veya Diğer) -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
        <div class="flex items-center gap-3">
          <select 
            v-model="arsaForm.anaKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option value="GAYRİMENKUL İLANI">GAYRİMENKUL İLANI</option>
            <option value="DİĞER">DİĞER</option>
          </select>
        </div>
        <div v-if="arsaForm.anaKategori === 'DİĞER'" class="pt-1">
          <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
          <input 
            v-model="arsaForm.anaKategoriDiger"
            type="text"
            placeholder="ELLE GİRİLSİN"
            class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold outline-none"
          />
        </div>
      </div>

      <!-- Sol & Sağ Menü (Görsel 2): KİRALIK/SATILIK/TAKAS vs. ARSA/KONUT/TARLA -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Sol: İLAN TÜRÜ (KİRALIK, SATILIK, TAKAS, DİĞER) -->
        <div class="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/40">
          <span class="block text-[11px] font-black text-slate-700 uppercase">İŞLEM TÜRÜ</span>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="tur in ['KİRALIK', 'SATILIK', 'TAKAS']"
              :key="tur"
              type="button"
              @click="arsaForm.islemTuru = tur"
              class="py-2 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer border"
              :class="arsaForm.islemTuru === tur 
                ? 'bg-pink-600 text-white border-pink-600 shadow-2xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
            >
              {{ tur }}
            </button>
          </div>
          <button
            type="button"
            @click="arsaForm.islemTuru = 'DİĞER'"
            class="w-full py-1.5 px-2 rounded-xl text-xs font-black transition cursor-pointer border text-center"
            :class="arsaForm.islemTuru === 'DİĞER' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-300'"
          >
            DİĞER
          </button>
          <div v-if="arsaForm.islemTuru === 'DİĞER'" class="pt-1">
            <input 
              v-model="arsaForm.islemTuruDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 p-2 text-xs font-bold"
            />
          </div>
        </div>

        <!-- Sağ: ALT KATEGORİ (ARSA, KONUT İMARLI, İŞYERİ İMARLI, TARLA, ZEYTİNLİK, MEYVELİK, DİĞER) -->
        <div class="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/40">
          <div class="flex items-center justify-between">
            <span class="block text-[11px] font-black text-emerald-600 uppercase">ALT KATAGORİ</span>
            <span class="text-[10px] text-slate-400 font-bold">SEÇ</span>
          </div>
          <select 
            v-model="arsaForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
          >
            <option value="ARSA">ARSA</option>
            <option value="KONUT İMARLI">KONUT İMARLI</option>
            <option value="İŞYERİ İMARLI">İŞYERİ İMARLI</option>
            <option value="TARLA">TARLA</option>
            <option value="ZEYTİNLİK">ZEYTİNLİK</option>
            <option value="MEYVELİK">MEYVELİK</option>
            <option value="DİĞER">DİĞER</option>
          </select>
          <div v-if="arsaForm.altKategori === 'DİĞER'" class="pt-1">
            <input 
              v-model="arsaForm.altKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 p-2 text-xs font-bold"
            />
          </div>
        </div>

      </div>

      <!-- KİRALIK/SATILIK AYNI MENU - ARSA KONUM BİLGİLERİ -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/30 space-y-3">
        <span class="block text-[11px] font-black text-emerald-600 uppercase tracking-wider">KİRALIK/SATILIK AYNI MENU - ARSA KONUMU</span>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- İL -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">İL</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.il"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- İLÇE -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">İLÇE</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <input 
              v-model="arsaForm.ilce"
              type="text"
              placeholder="Örn: Edremit veya Kadıköy"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <!-- MAHALLE -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">MAHALLE</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <input 
              v-model="arsaForm.mahalle"
              type="text"
              placeholder="Örn: Akçay Mahallesi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <!-- ADA & PARSEL (Görsel 2) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">ADA</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="arsaForm.ada"
              type="text"
              placeholder="Örn: 104"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">PARSEL</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="arsaForm.parsel"
              type="text"
              placeholder="Örn: 12"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>
        </div>

      </div>

      <!-- TABAN FİYAT & EXPERTİZ YAP (ÜCRETLİ) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-800 mb-1">TABAN FİYAT</label>
          <div class="relative">
            <input 
              v-model="arsaForm.tabanFiyat"
              type="text"
              placeholder="YAZ (Örn: 2.500.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

        <div class="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between mt-4 sm:mt-0">
          <div>
            <span class="block text-xs font-black text-amber-950">EXPERTİZ YAP</span>
            <span class="text-[10px] text-amber-700 font-bold">(ÜCRETLİ LİSANSLI RAPOR)</span>
          </div>
          <input 
            v-model="arsaForm.ekspertizYap"
            type="checkbox"
            class="w-5 h-5 rounded text-pink-600 cursor-pointer"
          />
        </div>
      </div>

      <!-- İLAN BAŞLIĞI EKLE -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700">İLAN BAŞLIĞI EKLE *</label>
        <input 
          v-model="arsaForm.baslik"
          type="text"
          placeholder="Örn: Çanakkale Kepez'de 1.500 m² %50 Kat Karşılığı veya Satılık Konut İmarlı Arsa"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
        />
      </div>

      <!-- EXPERTİZ BELGESİ EKLE -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileCheck :size="14" class="text-pink-600" />
            <span>EXPERTİZ BELGESİ EKLE</span>
          </span>
          <span class="text-[10px] font-bold text-emerald-600">ALICI SATICI GÖREBİLSİN</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-pink-500 font-bold text-xs text-slate-700 transition cursor-pointer flex items-center gap-2 shadow-2xs">
            <UploadCloud :size="14" class="text-pink-600" />
            <span>Belge Seç</span>
            <input 
              type="file" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.jpg,.png"
              @change="e => handleSingleFileUpload(e, arsaForm, 'ekspertizDosyasi', 'ekspertizDosyaAdi')"
            />
          </label>
          <span v-if="arsaForm.ekspertizDosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ arsaForm.ekspertizDosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">Varsa mevcut ekspertiz veya tapu belgesi</span>
        </div>
      </div>

      <!-- MEDYA: ARSA RESİM & VİDEO EKLE -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- ARSA RESİM EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Camera :size="14" class="text-pink-600" />
              <span>ARSA RESİM EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" multiple accept="image/*" class="hidden" @change="e => handleMultipleImages(e, arsaForm)" />
            </label>
          </div>
          <div v-if="arsaForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in arsaForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(arsaForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Arsa fotoğraflarını veya harita görselini ekleyin.</p>
        </div>

        <!-- ARSA VİDEO EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Video :size="14" class="text-pink-600" />
              <span>ARSA VİDEO EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, arsaForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="arsaForm.videoUrl"
              type="text"
              placeholder="Veya Drone / Tanıtım Video Linki"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="arsaForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ {{ arsaForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- İLAN VEREN BİLGİSİ (Arsa İçin) -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="arsaForm.ilanVeren"
          type="text"
          placeholder="İlan Sahibi / Emlak Ofisi Adı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="arsaForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Ofis Adresi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="arsaForm.telefon"
              type="text"
              placeholder="05XX XXX XX XX"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
        </div>

        <!-- VARSA WEB SAYFASI -->
        <div class="pt-1">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-black uppercase text-slate-600">VARSA WEB SAYFASI</label>
            <span class="text-[10px] font-bold text-emerald-600">TIKLAYINCA YAZAN SAYFA ACILSIN</span>
          </div>
          <div class="flex items-center gap-2">
            <input 
              v-model="arsaForm.webSayfasi"
              type="text"
              placeholder="https://www.ornekarazi.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="arsaForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(arsaForm.webSayfasi)"
              class="px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ExternalLink :size="13" />
              <span>Aç</span>
            </button>
          </div>
        </div>
      </div>

      <!-- İsteğe Bağlı Açıklama -->
      <div class="space-y-1">
        <label class="block text-[11px] font-black uppercase text-slate-700">ARSA DETAYLI AÇIKLAMA (OPSİYONEL)</label>
        <textarea 
          v-model="arsaForm.aciklama"
          rows="3"
          placeholder="Yol durumu, elektrik/su altyapısı, takas koşulları veya özel şartlar..."
          class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none focus:border-pink-500"
        ></textarea>
      </div>

      <!-- Gönder Butonu -->
      <div class="pt-2">
        <button
          type="button"
          :disabled="isSubmitting"
          @click="submitCurrentForm"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="isSubmitting">Yayınlanıyor...</span>
          <span v-else>🚀 ARSA İLANINI YAYINLA</span>
        </button>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 3: EV (Görsel 3 Birebir) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeFormMode === 'ev'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">EV</h2>
        <p class="text-[11px] text-slate-400">Konut, daire, villa, rezidans, ofis ve mülk ilanı</p>
      </div>

      <!-- Ana Kategori: GAYRİMENKUL İLANI -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
        <select 
          v-model="evForm.anaKategori"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        >
          <option value="GAYRİMENKUL İLANI">GAYRİMENKUL İLANI</option>
          <option value="DİĞER">DİĞER</option>
        </select>
        <div v-if="evForm.anaKategori === 'DİĞER'" class="pt-1">
          <input 
            v-model="evForm.anaKategoriDiger"
            type="text"
            placeholder="ELLE GİRİLSİN"
            class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold outline-none"
          />
        </div>
      </div>

      <!-- Sol & Sağ Menü (Görsel 3): KİRALIK/SATILIK vs EV/VİLLA/OFİS/İŞYERİ/SİTE İÇİ EV -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Sol: İŞLEM TÜRÜ -->
        <div class="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/40">
          <span class="block text-[11px] font-black text-slate-700 uppercase">İŞLEM TÜRÜ</span>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="tur in ['KİRALIK', 'SATILIK', 'TAKAS']"
              :key="tur"
              type="button"
              @click="evForm.islemTuru = tur"
              class="py-2 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer border"
              :class="evForm.islemTuru === tur 
                ? 'bg-pink-600 text-white border-pink-600 shadow-2xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
            >
              {{ tur }}
            </button>
          </div>
          <button
            type="button"
            @click="evForm.islemTuru = 'DİĞER'"
            class="w-full py-1.5 px-2 rounded-xl text-xs font-black transition cursor-pointer border text-center"
            :class="evForm.islemTuru === 'DİĞER' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-300'"
          >
            DİĞER
          </button>
          <div v-if="evForm.islemTuru === 'DİĞER'" class="pt-1">
            <input 
              v-model="evForm.islemTuruDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 p-2 text-xs font-bold"
            />
          </div>
        </div>

        <!-- Sağ: ALT KATEGORİ (EV, VİLLA, OFİS, İŞYERİ, SİTE İÇİ EV, ARSA, DİĞER) -->
        <div class="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/40">
          <div class="flex items-center justify-between">
            <span class="block text-[11px] font-black text-emerald-600 uppercase">ALT KATAGORİ</span>
            <span class="text-[10px] text-slate-400 font-bold">SEÇ</span>
          </div>
          <select 
            v-model="evForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
          >
            <option value="EV">EV</option>
            <option value="VİLLA">VİLLA</option>
            <option value="OFİS">OFİS</option>
            <option value="İŞYERİ">İŞYERİ</option>
            <option value="SİTE İÇİ EV">SİTE İÇİ EV</option>
            <option value="ARSA">ARSA</option>
            <option value="DİĞER">DİĞER</option>
          </select>
          <div v-if="evForm.altKategori === 'DİĞER'" class="pt-1">
            <input 
              v-model="evForm.altKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 p-2 text-xs font-bold"
            />
          </div>
        </div>

      </div>

      <!-- KİRALIK/SATILIK AYNI MENU - KONUM (İL, İLÇE, MAHALLE) -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/30 space-y-3">
        <span class="block text-[11px] font-black text-emerald-600 uppercase tracking-wider">KİRALIK/SATILIK AYNI MENU - KONUM</span>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">İL</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.il"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">İLÇE</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <input 
              v-model="evForm.ilce"
              type="text"
              placeholder="Örn: Kadıköy veya Çankaya"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">MAHALLE</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <input 
              v-model="evForm.mahalle"
              type="text"
              placeholder="Örn: Moda Mahallesi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      <!-- TABAN FİYAT & EXPERTİZ YAP (ÜCRETLİ) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-800 mb-1">TABAN FİYAT</label>
          <div class="relative">
            <input 
              v-model="evForm.tabanFiyat"
              type="text"
              placeholder="YAZ (Örn: 4.850.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

        <div class="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between mt-4 sm:mt-0">
          <div>
            <span class="block text-xs font-black text-amber-950">EXPERTİZ YAP</span>
            <span class="text-[10px] text-amber-700 font-bold">(ÜCRETLİ DEĞERLEME)</span>
          </div>
          <input 
            v-model="evForm.ekspertizYap"
            type="checkbox"
            class="w-5 h-5 rounded text-pink-600 cursor-pointer"
          />
        </div>
      </div>

      <!-- İLAN BAŞLIĞI EKLE -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700">İLAN BAŞLIĞI EKLE *</label>
        <input 
          v-model="evForm.baslik"
          type="text"
          placeholder="Örn: Kadıköy Moda'da 3+1 145 m² Balkonlu İskânlı Satılık Lüks Daire"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
        />
      </div>

      <!-- EXPERTİZ BELGESİ EKLE -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileCheck :size="14" class="text-pink-600" />
            <span>EXPERTİZ BELGESİ EKLE</span>
          </span>
          <span class="text-[10px] font-bold text-emerald-600">ALICI SATICI GÖREBİLSİN</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-pink-500 font-bold text-xs text-slate-700 transition cursor-pointer flex items-center gap-2 shadow-2xs">
            <UploadCloud :size="14" class="text-pink-600" />
            <span>Belge Seç</span>
            <input 
              type="file" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.jpg,.png"
              @change="e => handleSingleFileUpload(e, evForm, 'ekspertizDosyasi', 'ekspertizDosyaAdi')"
            />
          </label>
          <span v-if="evForm.ekspertizDosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ evForm.ekspertizDosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">Varsa ekspertiz veya iskân belgesi</span>
        </div>
      </div>

      <!-- MEDYA: EV RESİM & VİDEO EKLE -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- EV RESİM EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Camera :size="14" class="text-pink-600" />
              <span>EV RESİM EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" multiple accept="image/*" class="hidden" @change="e => handleMultipleImages(e, evForm)" />
            </label>
          </div>
          <div v-if="evForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in evForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(evForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Oda, mutfak, banyo ve dış cephe fotoğrafları</p>
        </div>

        <!-- EV VİDEO EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Video :size="14" class="text-pink-600" />
              <span>EV VİDEO EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, evForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="evForm.videoUrl"
              type="text"
              placeholder="Veya Ev Turu Video Linki"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="evForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ {{ evForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- 🏠 EV ÖZELLİKLERİ (Görsel 3 Birebir Grid) -->
      <!-- ODA SAYISI | YASI | BANYO SAYISI | KAT ADEDİ | BULUNDUGU KAT -->
      <!-- ========================================================================= -->
      <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
        <span class="block text-[11px] font-black text-slate-800 uppercase tracking-wider">EV & DAİRE ÖZELLİKLERİ</span>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <!-- ODA SAYISI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">ODA SAYISI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.odaSayisi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="1+0 (Stüdyo)">1+0</option>
              <option value="1+1">1+1</option>
              <option value="2+1">2+1</option>
              <option value="3+1">3+1</option>
              <option value="4+1">4+1</option>
              <option value="5+1 ve üzeri">5+1 ve üzeri</option>
            </select>
          </div>

          <!-- YASI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">YASI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.yasi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="0 (Sıfır Bina)">Sıfır Bina</option>
              <option value="1-5 Yaş">1-5 Yaş</option>
              <option value="6-10 Yaş">6-10 Yaş</option>
              <option value="11-15 Yaş">11-15 Yaş</option>
              <option value="16-20 Yaş">16-20 Yaş</option>
              <option value="21+ Yaş">21+ Yaş</option>
            </select>
          </div>

          <!-- BANYO SAYISI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">BANYO SAYISI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.banyoSayisi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4 ve üzeri">4+</option>
            </select>
          </div>

          <!-- KAT ADEDİ -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KAT ADEDİ</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.katAdedi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="k in [1,2,3,4,5,6,7,8,9,10,12,15,20,30]" :key="k" :value="`${k} Katlı`">
                {{ k }} Katlı
              </option>
            </select>
          </div>

          <!-- BULUNDUGU KAT -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">BULUNDUGU KAT</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.bulunduguKat"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Bahçe Katı">Bahçe Katı</option>
              <option value="Giriş Kat">Giriş Kat</option>
              <option value="Yüksek Giriş">Yüksek Giriş</option>
              <option value="1. Kat">1. Kat</option>
              <option value="2. Kat">2. Kat</option>
              <option value="3. Kat">3. Kat</option>
              <option value="4. Kat">4. Kat</option>
              <option value="5. Kat">5. Kat</option>
              <option value="Ara Kat">Ara Kat</option>
              <option value="En Üst Kat">En Üst Kat</option>
              <option value="Çatı Dubleksi">Çatı Dubleksi</option>
              <option value="Müstakil / Villa">Müstakil / Villa</option>
            </select>
          </div>

        </div>
      </div>

      <!-- İLAN VEREN BİLGİSİ (Ev İçin) -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="evForm.ilanVeren"
          type="text"
          placeholder="İlan Sahibi / Emlak Ofisi Adı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="evForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Ofis Adresi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="evForm.telefon"
              type="text"
              placeholder="05XX XXX XX XX"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
        </div>

        <!-- VARSA WEB SAYFASI -->
        <div class="pt-1">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-black uppercase text-slate-600">VARSA WEB SAYFASI</label>
            <span class="text-[10px] font-bold text-emerald-600">TIKLAYINCA YAZAN SAYFA ACILSIN</span>
          </div>
          <div class="flex items-center gap-2">
            <input 
              v-model="evForm.webSayfasi"
              type="text"
              placeholder="https://www.ornekkonut.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="evForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(evForm.webSayfasi)"
              class="px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ExternalLink :size="13" />
              <span>Aç</span>
            </button>
          </div>
        </div>
      </div>

      <!-- İsteğe Bağlı Açıklama -->
      <div class="space-y-1">
        <label class="block text-[11px] font-black uppercase text-slate-700">EV DETAYLI AÇIKLAMA (OPSİYONEL)</label>
        <textarea 
          v-model="evForm.aciklama"
          rows="3"
          placeholder="Cephe, kombi/ısıtma türü, balkon, otopark, site aidatı ve diğer özel bilgiler..."
          class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none focus:border-pink-500"
        ></textarea>
      </div>

      <!-- Gönder Butonu -->
      <div class="pt-2">
        <button
          type="button"
          :disabled="isSubmitting"
          @click="submitCurrentForm"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="isSubmitting">Yayınlanıyor...</span>
          <span v-else>🚀 EV İLANINI YAYINLA</span>
        </button>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 4: DİĞER İLAN MENULERİ (Görsel 4 Birebir) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeFormMode === 'diger'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">DİĞER İLAN MENULERİ</h2>
        <p class="text-[11px] text-slate-400">Sanayi, teknoloji, malzeme, araç, ofis ve diğer kategoriler</p>
      </div>

      <!-- Kategori ve Alt Kategori (Seç / Diğer - Elle Girilsin) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Ana Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
          <select 
            v-model="digerForm.anaKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <!-- DİĞER: Elle Girilsin -->
          <div v-if="digerForm.anaKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="digerForm.anaKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold outline-none"
            />
          </div>
        </div>

        <!-- Alt Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ALT KATAGORİ</label>
          <select 
            v-model="digerForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="sub in currentDigerSubcategories" :key="sub" :value="sub">
              {{ sub }}
            </option>
          </select>

          <!-- DİĞER: Elle Girilsin -->
          <div v-if="digerForm.altKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="digerForm.altKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold outline-none"
            />
          </div>
        </div>

      </div>

      <!-- İLAN BAŞLIĞI EKLE -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700">İLAN BAŞLIĞI EKLE *</label>
        <input 
          v-model="digerForm.baslik"
          type="text"
          placeholder="Örn: CNC Torna Tezgahı veya 100 Adet Ergonomik Ofis Koltuğu"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
        />
      </div>

      <!-- TABAN FİYAT & TAVAN FİYAT (Görsel 4) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Taban Fiyat -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-black uppercase text-slate-800">TABAN FİYAT</label>
            <span class="text-[10px] font-bold text-emerald-600">İSTEĞE BAĞLI / SATICI BİLSİN</span>
          </div>
          <div class="relative">
            <input 
              v-model="digerForm.tabanFiyat"
              type="text"
              placeholder="YAZ (Örn: 50.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

        <!-- Tavan Fiyat -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-black uppercase text-slate-800">TAVAN FİYAT</label>
            <span class="text-[10px] font-bold text-emerald-600">İSTEĞE BAĞLI / SATICI BİLSİN</span>
          </div>
          <div class="relative">
            <input 
              v-model="digerForm.tavanFiyat"
              type="text"
              placeholder="YAZ (Örn: 80.000)"
              class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₺</span>
          </div>
        </div>

      </div>

      <!-- VARSA TEKNİK ŞARTNAMENİZ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileText :size="14" class="text-pink-600" />
            <span>VARSA TEKNİK ŞARTNAMENİZ</span>
          </span>
          <span class="text-[10px] font-bold text-emerald-600">ALICI SATICI GÖREBİLSİN</span>
        </div>
        <div class="flex items-center gap-3">
          <label class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-pink-500 font-bold text-xs text-slate-700 transition cursor-pointer flex items-center gap-2 shadow-2xs">
            <UploadCloud :size="14" class="text-pink-600" />
            <span>Dosya Seç</span>
            <input 
              type="file" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip"
              @change="e => handleSingleFileUpload(e, digerForm, 'sartnameDosyasi', 'sartnameDosyaAdi')"
            />
          </label>
          <span v-if="digerForm.sartnameDosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ digerForm.sartnameDosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">PDF, Word, Excel teknik şartname</span>
        </div>
      </div>

      <!-- MEDYA: RESİM EKLE & VİDEO EKLE -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- RESİM EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Camera :size="14" class="text-pink-600" />
              <span>RESİM EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" multiple accept="image/*" class="hidden" @change="e => handleMultipleImages(e, digerForm)" />
            </label>
          </div>
          <div v-if="digerForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in digerForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(digerForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Ürün veya malzeme fotoğrafları ekleyin.</p>
        </div>

        <!-- VİDEO EKLE -->
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1">
              <Video :size="14" class="text-pink-600" />
              <span>VİDEO EKLE</span>
            </span>
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition">
              + EKLE
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, digerForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="digerForm.videoUrl"
              type="text"
              placeholder="Veya Video Tanıtım Linki"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="digerForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ {{ digerForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- İLAN VEREN BİLGİSİ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="digerForm.ilanVeren"
          type="text"
          placeholder="İlan Veren Ad Soyad / Şirket Unvanı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="digerForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Açık Adres"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="digerForm.telefon"
              type="text"
              placeholder="05XX XXX XX XX"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
        </div>

        <!-- VARSA WEB SAYFASI -->
        <div class="pt-1">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-black uppercase text-slate-600">VARSA WEB SAYFASI</label>
            <span class="text-[10px] font-bold text-emerald-600">TIKLAYINCA YAZAN SAYFA ACILSIN</span>
          </div>
          <div class="flex items-center gap-2">
            <input 
              v-model="digerForm.webSayfasi"
              type="text"
              placeholder="https://www.orneksite.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="digerForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(digerForm.webSayfasi)"
              class="px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ExternalLink :size="13" />
              <span>Aç</span>
            </button>
          </div>
        </div>
      </div>

      <!-- İsteğe Bağlı Açıklama -->
      <div class="space-y-1">
        <label class="block text-[11px] font-black uppercase text-slate-700">DETAYLI AÇIKLAMA (OPSİYONEL)</label>
        <textarea 
          v-model="digerForm.aciklama"
          rows="3"
          placeholder="Ürün özellikleri, garanti süresi, kargo ve teslimat detayları..."
          class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none focus:border-pink-500"
        ></textarea>
      </div>

      <!-- Gönder Butonu -->
      <div class="pt-2">
        <button
          type="button"
          :disabled="isSubmitting"
          @click="submitCurrentForm"
          class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="isSubmitting">Yayınlanıyor...</span>
          <span v-else>🚀 İLANI YAYINLA</span>
        </button>
      </div>

    </div>

  </div>
</template>
