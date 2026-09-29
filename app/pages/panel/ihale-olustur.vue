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
  Building2,
  User,
  Tag,
  Megaphone
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useUserSession } from '~/composables/useUserSession'
import { ALL_40_CATEGORIES, CATEGORY_SUBCATEGORIES_MAP, sanitizeExternalUrl } from '~/utils/taxonomy'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const route = useRoute()
const { cmsData, saveCmsData } = useCmsData()
const { userSession, userName, isCompanyMode } = useUserSession()

// =========================================================================
// 🗂️ AKTİF FORM TÜRÜ (Kullanıcı Çizimlerine Göre: 6 Ana Şablon)
// 1. ACIK EKSILTME
// 2. SABİT FİYAT
// 3. REKLAM ILANI
// 4. ARSA İÇİN
// 5. EV
// 6. DİĞER İLAN MENULERİ
// =========================================================================
type FormMode = 'eksiltme' | 'sabit_fiyat' | 'reklam' | 'arsa' | 'ev' | 'diger'
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

// =========================================================================
// 🗂️ 40 ANA KATEGORİ VE ALT KATEGORİ HARİTASI (Merkezi Taksonomi)
// =========================================================================
const categoryMap: Record<string, string[]> = {}

// Tüm 40 kategoriyi ve alt kategorilerini doldur
ALL_40_CATEGORIES.forEach(cat => {
  const subs = [...(CATEGORY_SUBCATEGORIES_MAP[cat.id] || []), 'DİĞER']
  categoryMap[cat.name] = subs
  categoryMap[cat.short] = subs
})

// Kullanıcı dostu kısa adlar ve hiyerarşik uyumluluklar
categoryMap['Diğer İhale ve İlanlar'] = ['Genel İlanlar', 'Özel Talep & Teklifler', 'Serbest Piyasa İlanları', 'Diğer Satış ve Kiralama', 'DİĞER']
categoryMap['DİĞER'] = ['Genel İlanlar', 'Özel Talep & Teklifler', 'Serbest Piyasa İlanları', 'DİĞER']
categoryMap['Gayrimenkul'] = ['Ev', 'Arsa', 'Ofis', 'İşyeri', 'Satılık Konut', 'Kiralık Konut', 'Satılık Arsa', 'Kiralık Arsa', 'Tarla & Bağ-Bahçe', 'Ticari Gayrimenkul', 'DİĞER']
categoryMap['Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri'] = ['Ev', 'Arsa', 'Ofis', 'İşyeri', 'Satılık Konut', 'Kiralık Konut', 'Satılık Arsa', 'Kiralık Arsa', 'Tarla & Bağ-Bahçe', 'Ticari Gayrimenkul', 'DİĞER']
categoryMap['İnşaat ve Yapı'] = categoryMap['İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri'] || ['Bina Yapımı & Taahhüt', 'Yol, Köprü & Viyadük', 'DİĞER']
categoryMap['Sanayi ve Makine'] = categoryMap['Endüstriyel Makine - Motor - Konveyör İhaleleri'] || ['Üretim Makineleri', 'CNC & Takım Tezgahları', 'DİĞER']
categoryMap['Bilgisayar ve Teknoloji'] = categoryMap['Yazılım - Bilgi Yönetim Hizmetleri - Bilişim İhaleleri'] || ['Özel Yazılım Geliştirme', 'ERP & Kurumsal Yazılımlar', 'DİĞER']
categoryMap['Peyzaj ve Bahçe'] = categoryMap['Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri'] || ['Peyzaj Proje & Uygulama', 'Otomatik Bahçe Sulama Sistemleri', 'DİĞER']
categoryMap['Mühendislik ve Mimarlık'] = categoryMap['Mühendislik - Mimarlık - Danışmanlık İhaleleri'] || ['Statik & Betonarme Projelendirme', 'Mimari Tasarım & 3D Modelleme', 'DİĞER']
categoryMap['Nakliye ve Lojistik'] = categoryMap['Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri'] || ['Şehirlerarası Karayolu Nakliye', 'Personel & Öğrenci Servis Taşımacılığı', 'DİĞER']
categoryMap['Mobilya ve Ofis'] = categoryMap['Mobilya - Beyaz Eşya - Mutfak - Züccaciye İhaleleri'] || ['Ofis & Büro Mobilyaları', 'Mutfak Ekipmanları & Endüstriyel Mutfak', 'DİĞER']
categoryMap['Medikal ve Sağlık'] = categoryMap['Sağlık - İlaç - Kozmetik - Medikal İhaleleri'] || ['Tıbbi Cihaz & Sarf Malzemeleri', 'İlaç & Serum Tedariği', 'DİĞER']
categoryMap['Gıda ve Catering'] = categoryMap['Gıda - Tarım Ürünleri - Yiyecek - İçecek İhaleleri'] || ['Kuru Gıda, Bakliyat & Hububat', 'Et, Tavuk & Şarküteri', 'DİĞER']

// Ana Kategori listesi (Kullanıcı dropdown'ında 1. Diğer, 2. Emlak, 3. İnşaat, 4. Tarım...)
const mainCategoryList = [
  ...ALL_40_CATEGORIES.map(c => c.name),
  'DİĞER'
]

function getCategoryLabel(catName: string): string {
  if (catName === 'DİĞER' || catName === 'Diğer İhale ve İlanlar') return '✨ Diğer İhale ve İlanlar (DİĞER)'
  const found = ALL_40_CATEGORIES.find(c => c.name === catName || c.short === catName)
  if (found) {
    return `${found.icon} ${found.name}`
  }
  return catName
}

function formatWebsiteUrl(url: string): string {
  return sanitizeExternalUrl(url)
}

// =========================================================================
// 🏢 SAHİBİNDEN.COM STANDART GAYRİMENKUL (EV & ARSA) LİSTELERİ
// =========================================================================
const SAHIBINDEN_ODA_SAYISI = [
  '1+0 (Stüdyo)',
  '1+1',
  '2+0',
  '2+1',
  '2+2',
  '3+1',
  '3+2',
  '4+1',
  '4+2',
  '5+1',
  '5+2',
  '6+ ve üzeri'
]

const SAHIBINDEN_BINA_YASI = [
  '0 (Yeni)',
  '1 Yaşında',
  '2 Yaşında',
  '3 Yaşında',
  '4 Yaşında',
  '5-10 arası',
  '11-15 arası',
  '16-20 arası',
  '21-25 arası',
  '26-30 arası',
  '31 ve üzeri'
]

const SAHIBINDEN_BULUNDUGU_KAT = [
  'Kot 4',
  'Kot 3',
  'Kot 2',
  'Kot 1',
  'Bodrum Kat',
  'Zemin Kat',
  'Bahçe Katı',
  'Giriş Katı',
  'Yüksek Giriş',
  'Müstakil / Villa',
  '1. Kat',
  '2. Kat',
  '3. Kat',
  '4. Kat',
  '5. Kat',
  '6. Kat',
  '7. Kat',
  '8. Kat',
  '9. Kat',
  '10. Kat ve üzeri',
  'Ara Kat',
  'Çatı Katı',
  'En Üst Kat',
  'Dubleks',
  'Teras Katı'
]

const SAHIBINDEN_KAT_SAYISI = [
  '1 Katlı',
  '2 Katlı',
  '3 Katlı',
  '4 Katlı',
  '5 Katlı',
  '6 Katlı',
  '7 Katlı',
  '8 Katlı',
  '9 Katlı',
  '10 Katlı',
  '11-15 Katlı',
  '16-20 Katlı',
  '20 ve üzeri'
]

const SAHIBINDEN_ISITMA = [
  'Doğalgaz (Kombi)',
  'Yerden Isıtma',
  'Merkezi Sistem',
  'Merkezi Sistem (Pay Ölçer)',
  'Klima',
  'Soba',
  'Doğalgaz Sobası',
  'Isı Pompası',
  'Jeotermal',
  'Güneş Enerjisi',
  'Yok'
]

const SAHIBINDEN_BANYO_SAYISI = [
  'Yok',
  '1',
  '2',
  '3',
  '4',
  '5 ve üzeri'
]

const SAHIBINDEN_TAPU_KONUT = [
  'Kat Mülkiyetli',
  'Kat İrtifaklı',
  'Hisseli Tapu',
  'Müstakil Tapu',
  'Arsa Tapulu',
  'Tahsis'
]

const SAHIBINDEN_KULLANIM_DURUMU = [
  'Boş',
  'Mülk Sahibi Oturuyor',
  'Kiracılı'
]

const SAHIBINDEN_OTOPARK = [
  'Açık Otopark',
  'Kapalı Otopark',
  'Açık & Kapalı Otopark',
  'Yok'
]

const SAHIBINDEN_ARSA_IMAR = [
  'Konut İmarlı',
  'Ticari İmarlı',
  'Ticari + Konut',
  'Sanayi İmarlı',
  'Turizm İmarlı',
  'Tarla',
  'Bağ & Bahçe',
  'Zeytinlik',
  'Çiftlik',
  'Depolama & Antrepo',
  'Villa İmarlı',
  'Sit Alanı / İmarsız',
  'DİĞER'
]

const SAHIBINDEN_KAKS = [
  'Belirtilmemiş',
  '0.10 - 0.30',
  '0.40 - 0.60',
  '0.70 - 1.00',
  '1.20 - 1.50',
  '1.60 - 2.00',
  '2.00 ve üzeri',
  'Emsalsiz / Serbest'
]

const SAHIBINDEN_GABARI = [
  'Belirtilmemiş',
  'Serbest',
  '6.50 m (2 Kat)',
  '9.50 m (3 Kat)',
  '12.50 m (4 Kat)',
  '15.50 m (5 Kat)',
  '18.50 m (6 Kat)',
  '21.50 m (7 Kat)',
  '30.50 m (10 Kat)'
]

const SAHIBINDEN_TAPU_ARSA = [
  'Müstakil Parsel (Tek Tapu)',
  'Hisseli Tapu',
  'Tahsis',
  'Zilliyet'
]

const SAHIBINDEN_ALTYAPI_LIST = [
  'Elektrik',
  'Su',
  'Doğalgaz',
  'Kanalizasyon',
  'Yol Açılmış',
  'Telefon / İnternet',
  'Sanayi Elektriği',
  'Kuyu / Sondaj'
]

// =========================================================================
// 1. AÇIK EKSİLTME STATE (Görsel 1 & 4)
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
// 2. SABİT FİYAT STATE (Yeni Görsel: SABİT FİYAT)
// =========================================================================
const sabitFiyatForm = reactive({
  anaKategori: 'Sanayi ve Makine',
  anaKategoriDiger: '',
  altKategori: 'Üretim Makineleri',
  altKategoriDiger: '',
  sabitFiyat: '',
  paraCinsi: 'TRY (₺)', // TRY | USD | EUR
  baslik: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  dosya: null as File | null,
  dosyaAdi: '',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '15 gün'
})

// =========================================================================
// 3. REKLAM İLANI STATE (Yeni Görsel: REKLAM ILANI)
// =========================================================================
const reklamForm = reactive({
  anaKategori: 'Bilgisayar ve Teknoloji',
  anaKategoriDiger: '',
  altKategori: 'Web ve Mobil Tasarım',
  altKategoriDiger: '',
  baslik: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',
  dosya: null as File | null,
  dosyaAdi: '',
  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '30 gün'
})

// =========================================================================
// 4. ARSA STATE (Görsel: ARSA İÇİN)
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
  pafta: '',
  haritaIsaretlendi: false,
  haritaKonumBilgisi: '',
  tabanFiyat: '',
  ekspertizYap: false,
  ekspertizDosyasi: null as File | null,
  ekspertizDosyaAdi: '',
  baslik: '',
  resimler: [] as { name: string; url: string }[],
  videoUrl: '',
  videoDosyasi: null as File | null,
  videoDosyaAdi: '',

  // 🗺️ Sahibinden.com Standart Arsa Nitelikleri
  imarDurumu: 'Konut İmarlı',
  imarDurumuDiger: '',
  m2Alan: '',
  m2Fiyati: '',
  kaks: '1.20 - 1.50',
  gabari: 'Serbest',
  tapuDurumu: 'Müstakil Parsel (Tek Tapu)',
  katKarsiligi: 'Evet',
  krediyeUygun: 'Evet',
  takas: 'Hayır',
  altyapi: ['Elektrik', 'Su', 'Yol Açılmış', 'Doğalgaz'] as string[],

  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '15 gün'
})

// =========================================================================
// 5. EV STATE (Görsel: EV)
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

  // 🏠 Sahibinden.com Standart Konut Nitelikleri
  m2Brut: '',
  m2Net: '',
  odaSayisi: '3+1',
  yasi: '0 (Yeni)',
  katAdedi: '5 Katlı',
  bulunduguKat: '2. Kat',
  isitma: 'Doğalgaz (Kombi)',
  banyoSayisi: '1',
  balkon: 'Var',
  asansor: 'Var',
  otopark: 'Açık & Kapalı Otopark',
  esyali: 'Hayır',
  kullanimDurumu: 'Boş',
  siteIcerisinde: 'Hayır',
  krediyeUygun: 'Evet',
  tapuDurumu: 'Kat Mülkiyetli',
  takas: 'Hayır',
  aidat: '',

  ilanVeren: '',
  adres: 'Balıkesir',
  telefon: '',
  webSayfasi: '',
  aciklama: '',
  sure: '15 gün'
})

// =========================================================================
// 6. DİĞER İLAN MENULERİ STATE (Görsel: DİĞER İLAN MENULERİ)
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

const currentSabitFiyatSubcategories = computed(() => {
  return categoryMap[sabitFiyatForm.anaKategori] || ['Genel', 'DİĞER']
})

const currentReklamSubcategories = computed(() => {
  return categoryMap[reklamForm.anaKategori] || ['Genel', 'DİĞER']
})

const currentDigerSubcategories = computed(() => {
  return categoryMap[digerForm.anaKategori] || ['Genel', 'DİĞER']
})

// Ana Kategori değiştikçe Alt Kategoriyi otomatik ilk seçeneğe güncelle
watch(() => eksiltmeForm.anaKategori, (newCat) => {
  const subs = categoryMap[newCat] || ['Genel', 'DİĞER']
  if (!subs.includes(eksiltmeForm.altKategori)) {
    eksiltmeForm.altKategori = subs[0] || 'Genel'
  }
})

watch(() => sabitFiyatForm.anaKategori, (newCat) => {
  const subs = categoryMap[newCat] || ['Genel', 'DİĞER']
  if (!subs.includes(sabitFiyatForm.altKategori)) {
    sabitFiyatForm.altKategori = subs[0] || 'Genel'
  }
})

watch(() => reklamForm.anaKategori, (newCat) => {
  const subs = categoryMap[newCat] || ['Genel', 'DİĞER']
  if (!subs.includes(reklamForm.altKategori)) {
    reklamForm.altKategori = subs[0] || 'Genel'
  }
})

watch(() => digerForm.anaKategori, (newCat) => {
  const subs = categoryMap[newCat] || ['Genel', 'DİĞER']
  if (!subs.includes(digerForm.altKategori)) {
    digerForm.altKategori = subs[0] || 'Genel'
  }
})

// Sayfa açıldığında oturum bilgilerini formlara doldur
onMounted(() => {
  const s = userSession.value || {}
  const defaultName = userName.value || s.companyName || s.name || s.email?.split('@')[0] || ''
  const defaultPhone = s.phone || ''
  const defaultCity = s.city || 'Balıkesir'
  const defaultWeb = s.website || ''

  const allForms = [eksiltmeForm, sabitFiyatForm, reklamForm, arsaForm, evForm, digerForm]
  allForms.forEach(f => {
    f.ilanVeren = defaultName
    f.telefon = defaultPhone
    f.adres = defaultCity
    f.webSayfasi = defaultWeb
  })

  // URL query ile mod belirleme varsa (?mode=sabit_fiyat vb.)
  const qMode = route.query.mode as FormMode
  if (qMode && ['eksiltme', 'sabit_fiyat', 'reklam', 'arsa', 'ev', 'diger'].includes(qMode)) {
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

const isCompressingImages = ref(false)

function compressImageFile(file: File, maxWidth = 960, maxHeight = 960, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('')
      return
    }

    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string || '')
      reader.onerror = () => resolve('')
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string || '')
          return
        }

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        } catch {
          resolve(e.target?.result as string || '')
        }
      }
      img.onerror = () => resolve(e.target?.result as string || '')
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

async function handleMultipleImages(e: Event, targetForm: any) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    isCompressingImages.value = true
    try {
      const files = Array.from(input.files)
      for (const file of files) {
        const compressedUrl = await compressImageFile(file)
        if (compressedUrl) {
          targetForm.resimler.push({ name: file.name, url: compressedUrl })
        }
      }
    } finally {
      isCompressingImages.value = false
      input.value = ''
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
// 🗺️ ARSA CANLI HARİTA YÖNETİMİ (Kullanıcı Bilgi Girdikçe Anında Odaklanır)
// =========================================================================
const arsaMapType = ref<'roadmap' | 'satellite'>('roadmap')
const debouncedArsaQuery = ref('Balıkesir, Türkiye')
let arsaDebounceTimer: any = null

const arsaLocationQuery = computed(() => {
  const parts: string[] = []
  if (arsaForm.mahalle && arsaForm.mahalle.trim()) parts.push(arsaForm.mahalle.trim())
  if (arsaForm.ilce && arsaForm.ilce.trim()) parts.push(arsaForm.ilce.trim())
  if (arsaForm.il && arsaForm.il.trim()) parts.push(arsaForm.il.trim())
  if (parts.length === 0) return 'Balıkesir, Türkiye'
  return parts.join(', ') + ', Türkiye'
})

const arsaLocationDisplay = computed(() => {
  const parts: string[] = []
  if (arsaForm.il) parts.push(arsaForm.il)
  if (arsaForm.ilce) parts.push(arsaForm.ilce)
  if (arsaForm.mahalle) parts.push(arsaForm.mahalle)
  return parts.length > 0 ? parts.join(' / ') : 'Balıkesir'
})

const arsaAdaParselDisplay = computed(() => {
  const items: string[] = []
  if (arsaForm.ada && arsaForm.ada.trim()) items.push(`Ada: ${arsaForm.ada.trim()}`)
  if (arsaForm.parsel && arsaForm.parsel.trim()) items.push(`Parsel: ${arsaForm.parsel.trim()}`)
  return items.join(', ')
})

const arsaMapEmbedUrl = computed(() => {
  const q = encodeURIComponent(debouncedArsaQuery.value)
  const zoom = arsaForm.mahalle && arsaForm.mahalle.trim() ? 16 : (arsaForm.ilce && arsaForm.ilce.trim() ? 14 : 11)
  const mapTypeParam = arsaMapType.value === 'satellite' ? 'k' : 'm'
  return `https://maps.google.com/maps?q=${q}&t=${mapTypeParam}&z=${zoom}&ie=UTF8&iwloc=&output=embed`
})

// İl, İlçe, Mahalle, Ada veya Parsel girildiğinde anında debounce ile haritayı güncelle
watch(
  () => [arsaForm.il, arsaForm.ilce, arsaForm.mahalle, arsaForm.ada, arsaForm.parsel],
  () => {
    clearTimeout(arsaDebounceTimer)
    arsaDebounceTimer = setTimeout(() => {
      debouncedArsaQuery.value = arsaLocationQuery.value
    }, 400)

    const loc = arsaLocationDisplay.value
    const adaParsel = arsaAdaParselDisplay.value
    arsaForm.haritaKonumBilgisi = `${loc}${adaParsel ? ` (${adaParsel})` : ''} - Haritada Canlı İşaretlendi`
    arsaForm.haritaIsaretlendi = true
  },
  { immediate: true }
)

function toggleHaritaIsaretle() {
  arsaForm.haritaIsaretlendi = !arsaForm.haritaIsaretlendi
  if (arsaForm.haritaIsaretlendi) {
    const loc = arsaLocationDisplay.value
    const adaParsel = arsaAdaParselDisplay.value
    arsaForm.haritaKonumBilgisi = `${loc}${adaParsel ? ` (${adaParsel})` : ''} - Haritada Canlı İşaretlendi`
  } else {
    arsaForm.haritaKonumBilgisi = ''
  }
}

function openArsaInGoogleMaps() {
  const q = encodeURIComponent(arsaLocationQuery.value)
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer')
}

function openArsaInTKGM() {
  window.open('https://parselsorgu.tkgm.gov.tr/', '_blank', 'noopener,noreferrer')
}

// =========================================================================
// 🏠 EV / KONUT CANLI HARİTA YÖNETİMİ
// =========================================================================
const evMapType = ref<'roadmap' | 'satellite'>('roadmap')
const debouncedEvQuery = ref('Balıkesir, Türkiye')
let evDebounceTimer: any = null

const evLocationQuery = computed(() => {
  const parts: string[] = []
  if (evForm.mahalle && evForm.mahalle.trim()) parts.push(evForm.mahalle.trim())
  if (evForm.ilce && evForm.ilce.trim()) parts.push(evForm.ilce.trim())
  if (evForm.il && evForm.il.trim()) parts.push(evForm.il.trim())
  if (parts.length === 0) return 'Balıkesir, Türkiye'
  return parts.join(', ') + ', Türkiye'
})

const evLocationDisplay = computed(() => {
  const parts: string[] = []
  if (evForm.il) parts.push(evForm.il)
  if (evForm.ilce) parts.push(evForm.ilce)
  if (evForm.mahalle) parts.push(evForm.mahalle)
  return parts.length > 0 ? parts.join(' / ') : 'Balıkesir'
})

const evMapEmbedUrl = computed(() => {
  const q = encodeURIComponent(debouncedEvQuery.value)
  const zoom = evForm.mahalle && evForm.mahalle.trim() ? 16 : (evForm.ilce && evForm.ilce.trim() ? 14 : 11)
  const mapTypeParam = evMapType.value === 'satellite' ? 'k' : 'm'
  return `https://maps.google.com/maps?q=${q}&t=${mapTypeParam}&z=${zoom}&ie=UTF8&iwloc=&output=embed`
})

watch(
  () => [evForm.il, evForm.ilce, evForm.mahalle],
  () => {
    clearTimeout(evDebounceTimer)
    evDebounceTimer = setTimeout(() => {
      debouncedEvQuery.value = evLocationQuery.value
    }, 400)
  },
  { immediate: true }
)

function openEvInGoogleMaps() {
  const q = encodeURIComponent(evLocationQuery.value)
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener,noreferrer')
}

function toggleArsaAltyapi(item: string) {
  const idx = arsaForm.altyapi.indexOf(item)
  if (idx > -1) {
    arsaForm.altyapi.splice(idx, 1)
  } else {
    arsaForm.altyapi.push(item)
  }
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
      if (!eksiltmeForm.baslik.trim()) throw new Error('Lütfen ihale başlığını giriniz.')
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

    } else if (activeFormMode.value === 'sabit_fiyat') {
      if (!sabitFiyatForm.baslik.trim()) throw new Error('Lütfen sabit fiyatlı ilan başlığını giriniz.')
      finalBaslik = sabitFiyatForm.baslik.trim()
      finalCategory = sabitFiyatForm.anaKategori === 'DİĞER' ? (sabitFiyatForm.anaKategoriDiger || 'Diğer') : sabitFiyatForm.anaKategori
      finalSubCategory = sabitFiyatForm.altKategori === 'DİĞER' ? (sabitFiyatForm.altKategoriDiger || 'Diğer') : sabitFiyatForm.altKategori
      finalDirection = 'sabit_fiyat'
      
      const symbol = sabitFiyatForm.paraCinsi.includes('USD') ? '$' : (sabitFiyatForm.paraCinsi.includes('EUR') ? '€' : '₺')
      finalBudget = sabitFiyatForm.sabitFiyat ? `${sabitFiyatForm.sabitFiyat} ${symbol}` : 'Fiyat Belirtilmedi'

      if (sabitFiyatForm.dosyaAdi) {
        finalFiles.push({ name: sabitFiyatForm.dosyaAdi, size: 'İlan Belgesi / Şartname', type: 'doc' })
      }
      finalImages = sabitFiyatForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'SABIT_FIYAT',
        sabitFiyat: sabitFiyatForm.sabitFiyat,
        paraCinsi: sabitFiyatForm.paraCinsi,
        dosyaAdi: sabitFiyatForm.dosyaAdi,
        videoUrl: sabitFiyatForm.videoUrl,
        videoDosyaAdi: sabitFiyatForm.videoDosyaAdi
      }
      finalOwner = sabitFiyatForm.ilanVeren
      finalAddress = sabitFiyatForm.adres
      finalPhone = sabitFiyatForm.telefon
      finalWeb = sabitFiyatForm.webSayfasi
      finalAciklama = sabitFiyatForm.aciklama

    } else if (activeFormMode.value === 'reklam') {
      if (!reklamForm.baslik.trim()) throw new Error('Lütfen reklam ilan başlığını giriniz.')
      finalBaslik = reklamForm.baslik.trim()
      finalCategory = reklamForm.anaKategori === 'DİĞER' ? (reklamForm.anaKategoriDiger || 'Diğer') : reklamForm.anaKategori
      finalSubCategory = reklamForm.altKategori === 'DİĞER' ? (reklamForm.altKategoriDiger || 'Diğer') : reklamForm.altKategori
      finalDirection = 'reklam'
      finalBudget = 'Tanıtım / Reklam İlanı'

      if (reklamForm.dosyaAdi) {
        finalFiles.push({ name: reklamForm.dosyaAdi, size: 'Katalog / Broşür', type: 'doc' })
      }
      finalImages = reklamForm.resimler.map(r => r.url)
      finalCustomFields = {
        formType: 'REKLAM_ILANI',
        dosyaAdi: reklamForm.dosyaAdi,
        videoUrl: reklamForm.videoUrl,
        videoDosyaAdi: reklamForm.videoDosyaAdi
      }
      finalOwner = reklamForm.ilanVeren
      finalAddress = reklamForm.adres
      finalPhone = reklamForm.telefon
      finalWeb = reklamForm.webSayfasi
      finalAciklama = reklamForm.aciklama

    } else if (activeFormMode.value === 'arsa') {
      if (!arsaForm.baslik.trim()) throw new Error('Lütfen arsa ilan başlığını giriniz.')
      finalBaslik = arsaForm.baslik.trim()
      finalCategory = 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri'
      const islem = arsaForm.islemTuru === 'DİĞER' ? (arsaForm.islemTuruDiger || 'İlan') : arsaForm.islemTuru
      const altK = arsaForm.altKategori === 'DİĞER' ? (arsaForm.altKategoriDiger || 'Arsa') : arsaForm.altKategori
      finalSubCategory = `${islem} ${altK}`
      finalDirection = islem === 'KİRALIK' ? 'kiralik' : 'arsa'
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
        pafta: arsaForm.pafta,
        imarDurumu: arsaForm.imarDurumu === 'DİĞER' ? (arsaForm.imarDurumuDiger || 'Diğer') : arsaForm.imarDurumu,
        m2Alan: arsaForm.m2Alan,
        m2Fiyati: arsaForm.m2Fiyati,
        kaks: arsaForm.kaks,
        gabari: arsaForm.gabari,
        tapuDurumu: arsaForm.tapuDurumu,
        katKarsiligi: arsaForm.katKarsiligi,
        krediyeUygun: arsaForm.krediyeUygun,
        takas: arsaForm.takas,
        altyapi: [...arsaForm.altyapi],
        tabanFiyat: arsaForm.tabanFiyat,
        ekspertizYap: arsaForm.ekspertizYap,
        haritaIsaretlendi: arsaForm.haritaIsaretlendi,
        haritaKonumBilgisi: arsaForm.haritaKonumBilgisi,
        videoUrl: arsaForm.videoUrl,
        videoDosyaAdi: arsaForm.videoDosyaAdi
      }
      finalOwner = arsaForm.ilanVeren
      finalPhone = arsaForm.telefon
      finalWeb = arsaForm.webSayfasi
      finalAciklama = arsaForm.aciklama

    } else if (activeFormMode.value === 'ev') {
      if (!evForm.baslik.trim()) throw new Error('Lütfen ev / konut ilan başlığını giriniz.')
      finalBaslik = evForm.baslik.trim()
      finalCategory = 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri'
      const islem = evForm.islemTuru === 'DİĞER' ? (evForm.islemTuruDiger || 'İlan') : evForm.islemTuru
      const altK = evForm.altKategori === 'DİĞER' ? (evForm.altKategoriDiger || 'Ev') : evForm.altKategori
      finalSubCategory = `${islem} ${altK}`
      finalDirection = islem === 'KİRALIK' ? 'kiralik' : 'ev'
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
        haritaKonumBilgisi: evLocationDisplay.value,
        haritaIsaretlendi: true,
        tabanFiyat: evForm.tabanFiyat,
        ekspertizYap: evForm.ekspertizYap,
        m2Brut: evForm.m2Brut,
        m2Net: evForm.m2Net,
        odaSayisi: evForm.odaSayisi,
        yasi: evForm.yasi,
        banyoSayisi: evForm.banyoSayisi,
        katAdedi: evForm.katAdedi,
        bulunduguKat: evForm.bulunduguKat,
        isitma: evForm.isitma,
        balkon: evForm.balkon,
        asansor: evForm.asansor,
        otopark: evForm.otopark,
        esyali: evForm.esyali,
        kullanimDurumu: evForm.kullanimDurumu,
        siteIcerisinde: evForm.siteIcerisinde,
        krediyeUygun: evForm.krediyeUygun,
        tapuDurumu: evForm.tapuDurumu,
        takas: evForm.takas,
        aidat: evForm.aidat,
        videoUrl: evForm.videoUrl,
        videoDosyaAdi: evForm.videoDosyaAdi
      }
      finalOwner = evForm.ilanVeren
      finalPhone = evForm.telefon
      finalWeb = evForm.webSayfasi
      finalAciklama = evForm.aciklama

    } else if (activeFormMode.value === 'diger') {
      if (!digerForm.baslik.trim()) throw new Error('Lütfen ilan başlığını giriniz.')
      finalBaslik = digerForm.baslik.trim()
      finalCategory = 'Diğer İhale ve İlanlar'
      const customSub = digerForm.altKategoriDiger?.trim() || (digerForm.altKategori === 'DİĞER' ? 'Diğer' : digerForm.altKategori) || digerForm.anaKategoriDiger?.trim() || 'Genel İlanlar'
      finalSubCategory = customSub
      finalDirection = 'diger'
      
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
        altKategoriDiger: digerForm.altKategoriDiger,
        anaKategoriDiger: digerForm.anaKategoriDiger,
        digerMetni: customSub,
        videoUrl: digerForm.videoUrl,
        videoDosyaAdi: digerForm.videoDosyaAdi
      }
      finalOwner = digerForm.ilanVeren
      finalAddress = digerForm.adres
      finalPhone = digerForm.telefon
      finalWeb = digerForm.webSayfasi
      finalAciklama = digerForm.aciklama
    }

    const combinedText = ((finalBaslik || '') + ' ' + (finalCategory || '') + ' ' + (finalSubCategory || '')).toLowerCase()
    const primaryImg = finalImages[0] || (
      activeFormMode.value === 'arsa' 
        ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' 
        : (activeFormMode.value === 'ev' 
          ? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80' 
          : (combinedText.includes('peyzaj') || combinedText.includes('sulama') || combinedText.includes('bahçe') || combinedText.includes('proje')
            ? 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=600&q=80'))
    )
    const newId = `TND-${Date.now().toString().slice(-6)}`
    const ownerEmail = userSession.value?.email || 'kullanici@ihaleciburada.com'

    // Kategori ID Çözümleme
    let finalCategoryId = 99
    if (
      activeFormMode.value === 'diger' || 
      finalCategory === 'Diğer İhale ve İlanlar' || 
      finalCategory === 'DİĞER' ||
      finalCategory.toLowerCase().includes('diğer') ||
      finalCustomFields?.anaKategoriDiger ||
      finalCustomFields?.altKategoriDiger ||
      finalCustomFields?.digerMetni
    ) {
      finalCategoryId = 99
      finalCategory = 'Diğer İhale ve İlanlar'
    } else if (
      activeFormMode.value === 'arsa' || 
      activeFormMode.value === 'ev' || 
      finalCategory.toLowerCase().includes('gayrimenkul') || 
      finalCategory.toLowerCase().includes('arsa') || 
      finalCategory.toLowerCase().includes('emlak')
    ) {
      finalCategoryId = 40
      finalCategory = 'Gayrimenkul, Arsa Satışı, İşyeri ve Kantin İhaleleri'
    } else {
      const selectedCatObj = ALL_40_CATEGORIES.find(c => c.name === finalCategory || c.short === finalCategory)
      finalCategoryId = selectedCatObj?.id || 99
    }

    // İlan Türü Belirleme (2. Fotoğraftaki 6 Kategori Standardı)
    let ilanTuru = 'Diğer İlanlar'
    if (activeFormMode.value === 'eksiltme') ilanTuru = 'Açık Eksiltme'
    else if (activeFormMode.value === 'sabit_fiyat') ilanTuru = 'Sabit Fiyat'
    else if (activeFormMode.value === 'reklam') ilanTuru = 'Reklam İlanı'
    else if (activeFormMode.value === 'arsa') ilanTuru = arsaForm.islemTuru === 'KİRALIK' ? 'Kiralık Arsa İlanı' : 'Arsa İçin'
    else if (activeFormMode.value === 'ev') ilanTuru = evForm.islemTuru === 'KİRALIK' ? 'Kiralık Ev İlanı' : 'Ev'
    else if (activeFormMode.value === 'diger') ilanTuru = 'Diğer İlanlar'

    const normalizedWeb = sanitizeExternalUrl(finalWeb)
    const isAdListing = activeFormMode.value === 'reklam' || activeFormMode.value === 'sabit_fiyat' || activeFormMode.value === 'arsa' || activeFormMode.value === 'ev' || activeFormMode.value === 'diger' || finalDirection !== 'eksiltme'
    const computedFormType = activeFormMode.value === 'reklam' 
      ? 'REKLAM_ILANI' 
      : (activeFormMode.value === 'diger' 
        ? 'DIGER' 
        : (activeFormMode.value === 'arsa' 
          ? 'ARSA' 
          : (activeFormMode.value === 'ev' 
            ? 'EV' 
            : (activeFormMode.value === 'sabit_fiyat' ? 'SABIT_FIYAT' : 'ACIK_EKSILTME'))))

    const tenderObject: any = {
      id: newId,
      baslik: finalBaslik,
      kategori: `${finalCategory} / ${finalSubCategory}`,
      mainCategory: finalCategory,
      subCategory: finalSubCategory,
      categoryId: finalCategoryId,
      ihaleYonu: finalDirection,
      tur: ilanTuru,
      formType: computedFormType,
      isIlan: isAdListing,
      rekabetTuru: finalDirection === 'eksiltme' ? 'Eksiltme' : 'Doğrudan İlan',
      sure: '7 gün kaldı',
      teklifSayisi: 0,
      durum: 'active',
      statusCode: 'LIVE',
      adminApproved: true,
      statusLabel: 'Canlı Yayında',
      isBaseline: false,
      butce: finalBudget,
      city: finalCity,
      teslimatAdresi: finalAddress,
      odemeYontemi: '🛡️ Güvenli İhaleciBurada Escrow ve Anlaşma Teminatı',
      image: primaryImg,
      images: finalImages.length ? finalImages : [primaryImg],
      files: finalFiles,
      documents: finalFiles,
      aciklama: finalAciklama || finalBaslik,
      customFields: {
        ...finalCustomFields,
        formType: computedFormType,
        websiteUrl: normalizedWeb,
        webSayfasi: normalizedWeb
      },
      categorySpecificData: finalCustomFields,
      websiteUrl: normalizedWeb,
      webSayfasi: normalizedWeb,
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
        body: {
          ...tenderObject,
          websiteUrl: normalizedWeb,
          formType: computedFormType
        }
      })
    } catch (err) {
      console.warn('API sync warn:', err)
    }

    // 3. LocalStorage sync
    if (typeof window !== 'undefined') {
      try {
        const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        myTenders.unshift(tenderObject)
        try {
          localStorage.setItem('myTenders', JSON.stringify(myTenders.slice(0, 30)))
        } catch (quotaErr) {
          // LocalStorage 5MB aşıldıysa eski ilanların ağır resimlerini kırp
          const slimTenders = myTenders.slice(0, 20).map((t, idx) => {
            if (idx === 0) return t
            return { ...t, images: [t.image || ''] }
          })
          localStorage.setItem('myTenders', JSON.stringify(slimTenders))
        }
      } catch {}
    }

    submitSuccess.value = true

    // Yayındaki İlanlarım sayfasına yönlendir
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
            class="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
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
        class="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
      >
        <span>Yayındaki İlanlarım →</span>
      </NuxtLink>
    </div>

    <!-- ========================================================================= -->
    <!-- 🎛️ 6 ANA ŞABLON SEÇİCİ SEKMELERİ (Görsel 1, 2, 3, 4, Sabit Fiyat, Reklam) -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      
      <!-- 1. Açık Eksiltme (Görsel: ACIK EKSILTME) -->
      <button
        type="button"
        @click="activeFormMode = 'eksiltme'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'eksiltme' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>📉 AÇIK EKSİLTME</span>
          <span v-if="activeFormMode === 'eksiltme'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Tersine ihale & alım</span>
      </button>

      <!-- 2. Sabit Fiyat (Yeni Görsel: SABİT FİYAT) -->
      <button
        type="button"
        @click="activeFormMode = 'sabit_fiyat'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'sabit_fiyat' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>🏷️ SABİT FİYAT</span>
          <span v-if="activeFormMode === 'sabit_fiyat'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Sabit fiyat & para cinsi</span>
      </button>

      <!-- 3. Reklam İlanı (Yeni Görsel: REKLAM ILANI) -->
      <button
        type="button"
        @click="activeFormMode = 'reklam'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'reklam' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>📢 REKLAM İLANI</span>
          <span v-if="activeFormMode === 'reklam'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Fiyatsız vitrin tanıtımı</span>
      </button>

      <!-- 4. Arsa İçin (Görsel: ARSA İÇİN) -->
      <button
        type="button"
        @click="activeFormMode = 'arsa'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'arsa' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>🗺️ ARSA İÇİN</span>
          <span v-if="activeFormMode === 'arsa'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Ada, parsel, tarla</span>
      </button>

      <!-- 5. Ev (Görsel: EV) -->
      <button
        type="button"
        @click="activeFormMode = 'ev'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'ev' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>🏠 EV</span>
          <span v-if="activeFormMode === 'ev'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Konut, daire, villa</span>
      </button>

      <!-- 6. Diğer İlan Menüleri (Görsel: DİĞER İLAN MENULERİ) -->
      <button
        type="button"
        @click="activeFormMode = 'diger'"
        class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-xs"
        :class="activeFormMode === 'diger' 
          ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900' 
          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'"
      >
        <span class="text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
          <span>📦 DİĞER İLANLAR</span>
          <span v-if="activeFormMode === 'diger'" class="text-pink-600 text-xs">✓</span>
        </span>
        <span class="text-[9px] text-slate-500 font-medium">Taban & tavan fiyat</span>
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
    <!-- 📄 FORM 1: ACIK EKSILTME (Görsel: ACIK EKSILTME) -->
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
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
            </option>
          </select>

          <!-- DİĞER: Elle Girilsin -->
          <div v-if="eksiltmeForm.anaKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="eksiltmeForm.anaKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold text-slate-900 outline-none"
            />
          </div>
        </div>

        <!-- Alt Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ALT KATAGORİ</label>
          <select 
            v-model="eksiltmeForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
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
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold text-slate-900 outline-none"
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
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, eksiltmeForm)" />
            </label>
          </div>
          <div v-if="eksiltmeForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in eksiltmeForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 group">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(eksiltmeForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
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
    <!-- 📄 FORM 2: SABİT FİYAT (Yeni Görsel: SABİT FİYAT Birebir) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeFormMode === 'sabit_fiyat'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">SABİT FİYAT</h2>
        <p class="text-[11px] text-slate-400">Sabit fiyatlı ürün, ekipman veya doğrudan satış ilanı</p>
      </div>

      <!-- Kategori ve Alt Kategori (Seç / Diğer - Elle Girilsin) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Ana Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
          <select 
            v-model="sabitFiyatForm.anaKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">{{ getCategoryLabel(cat) }}</option>
          </select>
          <div v-if="sabitFiyatForm.anaKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="sabitFiyatForm.anaKategoriDiger"
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
            v-model="sabitFiyatForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="sub in currentSabitFiyatSubcategories" :key="sub" :value="sub">{{ sub }}</option>
          </select>
          <div v-if="sabitFiyatForm.altKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="sabitFiyatForm.altKategoriDiger"
              type="text"
              placeholder="ELLE GİRİLSİN"
              class="w-full rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/30 p-2.5 text-xs font-bold outline-none"
            />
          </div>
        </div>

      </div>

      <!-- SABİT FİYAT & PARA CİNSİ (Görseldeki Özel Alan) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/40">
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-800 mb-1">SABİT FİYAT *</label>
          <input 
            v-model="sabitFiyatForm.sabitFiyat"
            type="text"
            placeholder="Fiyatı Yazınız (Örn: 75.000)"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-900 bg-white outline-none focus:border-pink-500"
          />
        </div>

        <div>
          <label class="block text-[11px] font-black uppercase text-slate-800 mb-1">PARA CİNSİ *</label>
          <select 
            v-model="sabitFiyatForm.paraCinsi"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
          >
            <option value="TRY (₺)">TRY (₺) - Türk Lirası</option>
            <option value="USD ($)">USD ($) - Amerikan Doları</option>
            <option value="EUR (€)">EUR (€) - Euro</option>
          </select>
        </div>
      </div>

      <!-- İLAN BAŞLIĞI EKLE -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-black uppercase tracking-wider text-slate-700">İLAN BAŞLIĞI EKLE *</label>
        <input 
          v-model="sabitFiyatForm.baslik"
          type="text"
          placeholder="Örn: Sıfır Ayarında Hidrolik Pres veya 500 Adet Ahşap Sandalye"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
        />
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, sabitFiyatForm)" />
            </label>
          </div>
          <div v-if="sabitFiyatForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in sabitFiyatForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(sabitFiyatForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Ürüne ait görselleri yükleyin.</p>
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
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, sabitFiyatForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="sabitFiyatForm.videoUrl"
              type="text"
              placeholder="Veya Video Linki"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="sabitFiyatForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ Yüklenen Video: {{ sabitFiyatForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- DOSYA / TEKNİK ŞARTNAME / BELGE EKLE -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileText :size="14" class="text-pink-600" />
            <span>DOSYA / TEKNİK ŞARTNAME / BELGE EKLE</span>
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
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png"
              @change="e => handleSingleFileUpload(e, sabitFiyatForm, 'dosya', 'dosyaAdi')"
            />
          </label>
          <span v-if="sabitFiyatForm.dosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ sabitFiyatForm.dosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">PDF, Word, Excel, Şartname veya Ürün Belgesi Yükleyin</span>
        </div>
      </div>

      <!-- İLAN VEREN BİLGİSİ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="sabitFiyatForm.ilanVeren"
          type="text"
          placeholder="İlan Veren Ad Soyad / Şirket Unvanı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="sabitFiyatForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Açık Adres"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="sabitFiyatForm.telefon"
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
              v-model="sabitFiyatForm.webSayfasi"
              type="text"
              placeholder="https://www.orneksite.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="sabitFiyatForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(sabitFiyatForm.webSayfasi)"
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
          v-model="sabitFiyatForm.aciklama"
          rows="3"
          placeholder="Ürün durumu, teknik özellikler, teslimat ve fatura koşulları..."
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
          <span v-else>🚀 SABİT FİYATLI İLANI YAYINLA</span>
        </button>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 3: REKLAM İLANI (Yeni Görsel: REKLAM ILANI Birebir) -->
    <!-- ========================================================================= -->
    <div v-else-if="activeFormMode === 'reklam'" class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      
      <!-- Pembe Çizim Başlığı -->
      <div class="border-b border-pink-100 pb-3">
        <h2 class="text-sm font-black uppercase tracking-wider text-pink-600">REKLAM ILANI</h2>
        <p class="text-[11px] text-slate-400">Şirket, hizmet, proje ve kurumsal tanıtım reklam ilanı</p>
      </div>

      <!-- Kategori ve Alt Kategori (Seç / Diğer - Elle Girilsin) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Ana Kategori -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-black uppercase tracking-wider text-emerald-600">ANA KATAGORİ</label>
          <select 
            v-model="reklamForm.anaKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">{{ getCategoryLabel(cat) }}</option>
          </select>
          <div v-if="reklamForm.anaKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="reklamForm.anaKategoriDiger"
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
            v-model="reklamForm.altKategori"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
          >
            <option v-for="sub in currentReklamSubcategories" :key="sub" :value="sub">{{ sub }}</option>
          </select>
          <div v-if="reklamForm.altKategori === 'DİĞER'" class="pt-1.5">
            <span class="block text-[10px] font-black text-pink-600 uppercase">DİĞER:</span>
            <input 
              v-model="reklamForm.altKategoriDiger"
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
          v-model="reklamForm.baslik"
          type="text"
          placeholder="Örn: Fabrika Otomasyon & Yazılım Çözümleri Tanıtımı veya Kurumsal Danışmanlık"
          class="w-full rounded-xl border border-slate-300 p-3.5 text-xs font-bold text-slate-900 outline-none focus:border-pink-500"
        />
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, reklamForm)" />
            </label>
          </div>
          <div v-if="reklamForm.resimler.length > 0" class="flex flex-wrap gap-2 pt-1">
            <div v-for="(img, idx) in reklamForm.resimler" :key="idx" class="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
              <img :src="img.url" class="w-full h-full object-cover" />
              <button type="button" @click="removeImage(reklamForm, idx)" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded p-0.5">
                <Trash2 :size="10" />
              </button>
            </div>
          </div>
          <p v-else class="text-[10px] text-slate-400">Reklam afişi, logo veya ürün fotoğrafları yükleyin.</p>
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
              <input type="file" accept="video/*" class="hidden" @change="e => handleSingleFileUpload(e, reklamForm, 'videoDosyasi', 'videoDosyaAdi')" />
            </label>
          </div>
          <div class="space-y-1">
            <input 
              v-model="reklamForm.videoUrl"
              type="text"
              placeholder="Veya Tanıtım Video Linki (YouTube / Vimeo)"
              class="w-full rounded-xl border border-slate-300 p-2 text-[11px] text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <span v-if="reklamForm.videoDosyaAdi" class="text-[11px] font-bold text-emerald-700 block">
              ✓ Yüklenen Video: {{ reklamForm.videoDosyaAdi }}
            </span>
          </div>
        </div>

      </div>

      <!-- DOSYA / KATALOG / BROŞÜR EKLE -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase text-slate-800 flex items-center gap-1.5">
            <FileText :size="14" class="text-pink-600" />
            <span>DOSYA / KATALOG / BROŞÜR EKLE</span>
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
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png"
              @change="e => handleSingleFileUpload(e, reklamForm, 'dosya', 'dosyaAdi')"
            />
          </label>
          <span v-if="reklamForm.dosyaAdi" class="text-xs font-bold text-slate-800 flex items-center gap-1">
            ✓ {{ reklamForm.dosyaAdi }}
          </span>
          <span v-else class="text-xs text-slate-400">PDF, Tanıtım Kataloğu, Fiyat Listesi veya Broşür Yükleyin</span>
        </div>
      </div>

      <!-- İLAN VEREN BİLGİSİ -->
      <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
        <label class="block text-[11px] font-black uppercase text-slate-800">İLAN VEREN BİLGİSİ</label>
        <input 
          v-model="reklamForm.ilanVeren"
          type="text"
          placeholder="İlan Veren Ad Soyad / Şirket Unvanı"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">ADRES</label>
            <input 
              v-model="reklamForm.adres"
              type="text"
              placeholder="Şehir / İlçe veya Açık Adres"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase text-slate-600 mb-1">TELEFON</label>
            <input 
              v-model="reklamForm.telefon"
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
              v-model="reklamForm.webSayfasi"
              type="text"
              placeholder="https://www.orneksite.com"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 outline-none bg-white focus:border-pink-500"
            />
            <button
              v-if="reklamForm.webSayfasi"
              type="button"
              @click="openWebsiteUrl(reklamForm.webSayfasi)"
              class="px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ExternalLink :size="13" />
              <span>Aç</span>
            </button>
          </div>
        </div>
      </div>

      <!-- İsteğe Bağlı Açıklama / Reklam Metni -->
      <div class="space-y-1">
        <label class="block text-[11px] font-black uppercase text-slate-700">REKLAM & TANITIM METNİ (OPSİYONEL)</label>
        <textarea 
          v-model="reklamForm.aciklama"
          rows="4"
          placeholder="Hizmet detayları, referanslar, kampanya koşulları ve tanıtım açıklaması..."
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
          <span v-else>🚀 REKLAM İLANINI YAYINLA</span>
        </button>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- 📄 FORM 4: ARSA İÇİN (Görsel: ARSA İÇİN Birebir) -->
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
        <select 
          v-model="arsaForm.anaKategori"
          class="w-full rounded-xl border border-slate-300 p-3 text-xs font-bold text-slate-800 outline-none bg-white focus:border-pink-500"
        >
          <option value="GAYRİMENKUL İLANI">GAYRİMENKUL İLANI</option>
          <option value="DİĞER">DİĞER</option>
        </select>
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

      <!-- Sol & Sağ Menü (Görsel): KİRALIK/SATILIK/TAKAS vs. ARSA/KONUT/TARLA -->
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
            <option value="EV">EV</option>
            <option value="ARSA">ARSA</option>
            <option value="OFİS">OFİS</option>
            <option value="İŞYERİ">İŞYERİ</option>
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

        <!-- ADA & PARSEL (Görsel) -->
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

        <!-- HARİTADA KENDİN SEÇ / İŞARETLE & CANLI ARSA HARİTASI -->
        <div class="pt-3 border-t border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-black uppercase text-emerald-700 flex items-center gap-1.5">
              <span>📍 CANLI ARSA KONUMU & HARİTA</span>
            </span>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Bilgi Girdikçe Anında Odaklanır</span>
              </span>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 shadow-xs">
            <!-- Harita Üst Bilgi Barı: Girilen Konum ve Görünüm Seçenekleri -->
            <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">📍</span>
                <div class="min-w-0">
                  <div class="text-xs font-black text-slate-800 truncate">
                    {{ arsaLocationDisplay }}
                    <span v-if="arsaAdaParselDisplay" class="text-pink-600 font-bold ml-1">
                      ({{ arsaAdaParselDisplay }})
                    </span>
                  </div>
                  <div class="text-[10px] font-medium text-slate-500 truncate">
                    {{ arsaLocationQuery }}
                  </div>
                </div>
              </div>

              <!-- Harita Türü Seçimi (Sokak / Uydu) -->
              <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  @click="arsaMapType = 'roadmap'"
                  class="px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer"
                  :class="arsaMapType === 'roadmap' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                >
                  🗺️ Sokak
                </button>
                <button
                  type="button"
                  @click="arsaMapType = 'satellite'"
                  class="px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer"
                  :class="arsaMapType === 'satellite' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                >
                  🛰️ Uydu
                </button>
              </div>
            </div>

            <!-- Canlı İframe Harita Kutusu -->
            <div class="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe 
                class="w-full h-full border-0"
                :src="arsaMapEmbedUrl"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Arsa Harita Konumu"
              ></iframe>

              <!-- Harita Üzeri Ada/Parsel Rozeti -->
              <div v-if="arsaForm.ada || arsaForm.parsel" class="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>Ada: {{ arsaForm.ada || '-' }} / Parsel: {{ arsaForm.parsel || '-' }}</span>
              </div>

              <!-- Sağ Üst: Canlı Konum Rozeti -->
              <div class="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 border border-emerald-400/40">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>Canlı Konum Aktif</span>
              </div>
            </div>

            <!-- Alt Araç Butonları (Google Maps & TKGM Parsel Sorgu) -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div class="flex items-center gap-1.5 text-xs text-slate-500">
                <span class="text-[11px]">💡 İl, ilçe, mahalle, ada veya parsel yazdıkça harita anında bu konuma odaklanır.</span>
              </div>

              <div class="flex items-center gap-2">
                <!-- TKGM Parsel Sorgu Butonu -->
                <button
                  type="button"
                  @click="openArsaInTKGM"
                  title="Tapu ve Kadastro Genel Müdürlüğü Resmi Parsel Sorgu Uygulamasında Doğrula"
                  class="px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                >
                  <span>📐 TKGM Parsel Sorgu</span>
                </button>

                <!-- Google Haritalar Butonu -->
                <button
                  type="button"
                  @click="openArsaInGoogleMaps"
                  class="px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  <span>↗️ Google Haritalar</span>
                </button>

                <!-- İşaretle / Onayla Butonu -->
                <button
                  type="button"
                  @click="toggleHaritaIsaretle"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border"
                  :class="arsaForm.haritaIsaretlendi 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs' 
                    : 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600 shadow-xs'"
                >
                  <span>{{ arsaForm.haritaIsaretlendi ? '✓ KONUM SABİTLENDİ' : '📍 KONUMU SABİTLE' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- 🗺️ ARSA & ARAZİ ÖZELLİKLERİ (sahibinden.com Standart) -->
      <!-- ========================================================================= -->
      <div class="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/40 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <span class="block text-[11px] font-black text-slate-800 uppercase tracking-wider">ARSA & ARAZİ ÖZELLİKLERİ</span>
          <span class="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">sahibinden.com Standardı</span>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          <!-- İMAR DURUMU -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">İMAR DURUMU</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.imarDurumu"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_ARSA_IMAR" :key="item" :value="item">{{ item }}</option>
            </select>
            <div v-if="arsaForm.imarDurumu === 'DİĞER'" class="pt-1">
              <input 
                v-model="arsaForm.imarDurumuDiger"
                type="text"
                placeholder="ELLE GİRİLSİN"
                class="w-full rounded-xl border-2 border-dashed border-pink-400 p-2 text-xs font-bold"
              />
            </div>
          </div>

          <!-- m² (ARSA ALANI) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">m² (ARSA ALANI)</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="arsaForm.m2Alan"
              type="text"
              placeholder="Örn: 2500"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <!-- m² BİRİM FİYATI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">m² FİYATI (₺)</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="arsaForm.m2Fiyati"
              type="text"
              placeholder="Örn: 3500 ₺"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <!-- PAFTA NO -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">PAFTA NO</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="arsaForm.pafta"
              type="text"
              placeholder="Örn: 24-K-IV"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <!-- KAKS (EMSAL) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KAKS (EMSAL)</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.kaks"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_KAKS" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- GABARİ -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">GABARİ</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.gabari"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_GABARI" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- TAPU DURUMU -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">TAPU DURUMU</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.tapuDurumu"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_TAPU_ARSA" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- KAT KARŞILIĞINA UYGUN -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KAT KARŞILIĞI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.katKarsiligi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>

          <!-- KREDİYE UYGUN -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KREDİYE UYGUN</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.krediyeUygun"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>

          <!-- TAKAS -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">TAKAS</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="arsaForm.takas"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Hayır">Hayır</option>
              <option value="Evet">Evet</option>
            </select>
          </div>

        </div>

        <!-- ALTYAPI ÖZELLİKLERİ (Hızlı Rozetler) -->
        <div class="pt-2 border-t border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <label class="text-[10px] font-black uppercase text-slate-700">ALTYAPI ÖZELLİKLERİ</label>
            <span class="text-[10px] font-bold text-slate-400">ÇOKLU SEÇ</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="alt in SAHIBINDEN_ALTYAPI_LIST"
              :key="alt"
              type="button"
              @click="toggleArsaAltyapi(alt)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5"
              :class="arsaForm.altyapi.includes(alt)
                ? 'bg-pink-600 text-white border-pink-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'"
            >
              <span v-if="arsaForm.altyapi.includes(alt)">✓</span>
              <span>{{ alt }}</span>
            </button>
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, arsaForm)" />
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

      <!-- İLAN VEREN BİLGİSİ -->
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
    <!-- 📄 FORM 5: EV (Görsel: EV Birebir) -->
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

      <!-- Sol & Sağ Menü (Görsel): KİRALIK/SATILIK vs EV/VİLLA/OFİS/İŞYERİ/SİTE İÇİ EV -->
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
            <option value="ARSA">ARSA</option>
            <option value="OFİS">OFİS</option>
            <option value="İŞYERİ">İŞYERİ</option>
            <option value="VİLLA">VİLLA</option>
            <option value="SİTE İÇİ EV">SİTE İÇİ EV</option>
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

        <!-- 📍 CANLI KONUT HARİTA GÖRÜNÜMÜ -->
        <div class="pt-2 border-t border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-black uppercase text-emerald-700">📍 CANLI KONUM HARİTASI</span>
              <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Anında Odaklanır</span>
              </span>
            </div>
            <div class="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                @click="evMapType = 'roadmap'"
                class="px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer"
                :class="evMapType === 'roadmap' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'"
              >
                Sokak
              </button>
              <button
                type="button"
                @click="evMapType = 'satellite'"
                class="px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer"
                :class="evMapType === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'"
              >
                Uydu
              </button>
            </div>
          </div>

          <div class="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
            <iframe 
              class="w-full h-full border-0"
              :src="evMapEmbedUrl"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Konut Harita Konumu"
            ></iframe>
            <div class="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
              <span>📍 {{ evLocationDisplay }}</span>
            </div>
          </div>

          <div class="flex items-center justify-end">
            <button
              type="button"
              @click="openEvInGoogleMaps"
              class="px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <span>↗️ Google Haritalar'da Aç</span>
            </button>
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, evForm)" />
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
      <!-- 🏠 EV & DAİRE ÖZELLİKLERİ (sahibinden.com Standart) -->
      <!-- ========================================================================= -->
      <div class="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/40 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <span class="block text-[11px] font-black text-slate-800 uppercase tracking-wider">EV & DAİRE ÖZELLİKLERİ</span>
          <span class="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">sahibinden.com Standardı</span>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          <!-- m² (BRÜT) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">m² (BRÜT)</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="evForm.m2Brut"
              type="text"
              placeholder="Örn: 145"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

          <!-- m² (NET) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">m² (NET)</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="evForm.m2Net"
              type="text"
              placeholder="Örn: 125"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

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
              <option v-for="item in SAHIBINDEN_ODA_SAYISI" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- BİNA YAŞI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">BİNA YAŞI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.yasi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_BINA_YASI" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- BULUNDUĞU KAT -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">BULUNDUĞU KAT</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.bulunduguKat"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_BULUNDUGU_KAT" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- KAT SAYISI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KAT SAYISI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.katAdedi"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_KAT_SAYISI" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- ISITMA -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">ISITMA</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.isitma"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_ISITMA" :key="item" :value="item">{{ item }}</option>
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
              <option v-for="item in SAHIBINDEN_BANYO_SAYISI" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- BALKON -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">BALKON</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.balkon"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Var">Var</option>
              <option value="Yok">Yok</option>
            </select>
          </div>

          <!-- ASANSÖR -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">ASANSÖR</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.asansor"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Var">Var</option>
              <option value="Yok">Yok</option>
            </select>
          </div>

          <!-- OTOPARK -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">OTOPARK</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.otopark"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_OTOPARK" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- EŞYALI -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">EŞYALI</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.esyali"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Hayır">Hayır</option>
              <option value="Evet">Evet</option>
            </select>
          </div>

          <!-- KULLANIM DURUMU -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KULLANIM DURUMU</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.kullanimDurumu"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_KULLANIM_DURUMU" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- SİTE İÇERİSİNDE -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">SİTE İÇERİSİNDE</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.siteIcerisinde"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Hayır">Hayır</option>
              <option value="Evet">Evet</option>
            </select>
          </div>

          <!-- KREDİYE UYGUN -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">KREDİYE UYGUN</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.krediyeUygun"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>

          <!-- TAPU DURUMU -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">TAPU DURUMU</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.tapuDurumu"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option v-for="item in SAHIBINDEN_TAPU_KONUT" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- TAKAS -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">TAKAS</label>
              <span class="text-[10px] font-bold text-slate-400">SEÇ</span>
            </div>
            <select 
              v-model="evForm.takas"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            >
              <option value="Hayır">Hayır</option>
              <option value="Evet">Evet</option>
            </select>
          </div>

          <!-- AİDAT (₺) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[10px] font-black uppercase text-slate-700">AİDAT (₺)</label>
              <span class="text-[10px] font-bold text-slate-400">YAZ</span>
            </div>
            <input 
              v-model="evForm.aidat"
              type="text"
              placeholder="Örn: 850 ₺"
              class="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-800 bg-white outline-none focus:border-pink-500"
            />
          </div>

        </div>
      </div>

      <!-- İLAN VEREN BİLGİSİ -->
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
    <!-- 📄 FORM 6: DİĞER İLAN MENULERİ (Görsel: DİĞER İLAN MENULERİ Birebir) -->
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
            <option v-for="cat in mainCategoryList" :key="cat" :value="cat">{{ getCategoryLabel(cat) }}</option>
          </select>
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
            <option v-for="sub in currentDigerSubcategories" :key="sub" :value="sub">{{ sub }}</option>
          </select>
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

      <!-- TABAN FİYAT & TAVAN FİYAT -->
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
            <label class="px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-black cursor-pointer transition flex items-center gap-1">
              <span v-if="isCompressingImages" class="inline-block animate-spin mr-0.5">⌛</span>
              <span>{{ isCompressingImages ? 'İşleniyor...' : '+ EKLE' }}</span>
              <input type="file" multiple accept="image/*" class="hidden" :disabled="isCompressingImages" @change="e => handleMultipleImages(e, digerForm)" />
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
