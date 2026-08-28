<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  User, 
  Building2, 
  MapPin, 
  Bell, 
  Heart, 
  History, 
  Award,
  Star, 
  Sliders, 
  Camera, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Save, 
  Lock,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  Building,
  Shield,
  Clock,
  LogOut,
  Laptop,
  Check,
  RotateCw,
  Globe,
  FileText,
  Key,
  ShieldAlert,
  Smartphone,
  Eye,
  Settings,
  HelpCircle,
  ArrowRight,
  X,
  CheckSquare,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronDown
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { locale, detectLocale } from '~/composables/useLocale'

definePageMeta({ 
  layout: 'dashboard' 
})

const userSession = ref<any>({})

onMounted(() => {
  detectLocale()
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      userSession.value = session
      if (session.email) {
        profileForm.value.email = session.email
        companyForm.value.email = session.email
      }
      if (session.firstName || session.name) {
        profileForm.value.name = session.firstName || session.name
        companyForm.value.contactPerson = session.name || session.firstName
      }
      if (session.lastName) profileForm.value.surname = session.lastName
      if (session.phone) {
        profileForm.value.phone = session.phone
        companyForm.value.phone = session.phone
      }
      if (session.companyName || session.company) {
        companyForm.value.name = session.companyName || session.company
        companyForm.value.legalName = session.legalName || session.companyName || session.company
      }
      if (session.taxNo) companyForm.value.taxNo = session.taxNo
      if (session.taxOffice) companyForm.value.taxOffice = session.taxOffice
      if (session.sectors) companyForm.value.sectors = Array.isArray(session.sectors) ? session.sectors.join(', ') : session.sectors
      if (session.mersis) companyForm.value.mersis = session.mersis
      if (session.sicilNo) companyForm.value.sicilNo = session.sicilNo
      if (session.tcKimlik) companyForm.value.tcKimlik = session.tcKimlik
      if (session.iban) companyForm.value.iban = session.iban
      if (session.faturaAdresi) companyForm.value.faturaAdresi = session.faturaAdresi
    } catch (e) {
      console.error(e)
    }
  }
})

const route = useRoute()
const router = useRouter()

// Sub-navigation tabs matching query parameter tab
const activeSubTab = computed(() => {
  return (route.query.tab as 'kisisel' | 'sirket' | 'adresler' | 'bildirimler' | 'takip' | 'ticaret' | 'uyelik' | 'ayarlar') || 'ayarlar'
})

// Toast Notification State
const toasts = ref<{ id: number, message: string, type: 'success' | 'error' | 'warning' }[]>([])
let toastId = 0
function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  const id = toastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

// Membership & Pricing State
const membershipPricingRegion = ref<'domestic' | 'international'>('domestic')

const membershipPricingDomestic = [
  {
    id: '1-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 1 AY',
    badge: 'KURUMSAL KULLANIM',
    price: 900,
    monthly: '₺900,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPopular: false,
    duration: '1 Ay'
  },
  {
    id: '3-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 3 AY',
    badge: '⚡ EN ÇOK TERCİH EDİLEN POPÜLER PLAN',
    price: 1800,
    monthly: '₺600,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı',
    isPopular: true,
    duration: '3 Ay'
  },
  {
    id: '6-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 6 AY',
    badge: 'KURUMSAL KULLANIM',
    price: 2700,
    monthly: '₺450,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı',
    isPopular: false,
    duration: '6 Ay'
  },
  {
    id: '9-ay-tr',
    name: 'ÜYELİK BAŞVURUSU - 9 AY',
    badge: 'YILLIK AVANTAJ',
    price: 3600,
    monthly: '₺400,00 / ay',
    desc: '9 Aylık Avantaj Paketinde Net %55 Tasarruf',
    isPopular: false,
    duration: '9 Ay'
  }
]

const membershipPricingGlobalUSD = [
  {
    id: '1-mo-usd',
    name: 'MEMBERSHIP - 1 MONTH',
    badge: 'STANDARD B2B',
    price: 49,
    monthly: '$49.00 / mo',
    desc: '1 Month Global B2B Reverse Auction & Tender Access',
    isPopular: false,
    duration: '1 Month'
  },
  {
    id: '3-mo-usd',
    name: 'MEMBERSHIP - 3 MONTHS',
    badge: '⚡ MOST POPULAR GLOBAL PLAN',
    price: 99,
    monthly: '$33.00 / mo',
    desc: '3 Months Global Access with 33% Savings',
    isPopular: true,
    duration: '3 Months'
  },
  {
    id: '6-mo-usd',
    name: 'MEMBERSHIP - 6 MONTHS',
    badge: 'ENTERPRISE GLOBAL',
    price: 149,
    monthly: '$25.00 / mo',
    desc: '6 Months Global Package with 50% Savings',
    isPopular: false,
    duration: '6 Months'
  },
  {
    id: '9-mo-usd',
    name: 'MEMBERSHIP - 9 MONTHS',
    badge: 'ANNUAL ADVANTAGE',
    price: 199,
    monthly: '$22.00 / mo',
    desc: '9 Months Full Access with 55% Savings',
    isPopular: false,
    duration: '9 Months'
  }
]

// Personal Profile data
const profileForm = ref({
  name: 'Ali',
  surname: 'Turan',
  email: 'alituran88@gmail.com',
  phone: '5437340860',
  title: 'Yönetici'
})

// Company & Verification details
const companyVerified = ref(false)
const companyForm = ref({
  name: 'Ali Turan',
  legalName: 'Ali Turan Ticaret A.Ş.',
  contactPerson: 'Ali Turan',
  phone: '0850 840 86 95',
  email: 'ihalcib@gmail.com',
  tcKimlik: '12345678901',
  taxNo: '4700854210',
  taxOffice: 'Çanakkale Vergi Dairesi',
  sectors: 'Ambalaj & Kağıt, İnşaat & Yapı, Lojistik & Nakliye',
  mersis: '0470-0854-2100-0001',
  sicilNo: '14520',
  faturaAdresi: 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale',
  iban: 'TR56 0006 2000 0001 2345 6789 01',
  accountHolder: 'Ali Turan',
  is2FaEnabled: true
})

function saveCompanyInfo() {
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.company = companyForm.value.name
    session.companyName = companyForm.value.name
    session.legalName = companyForm.value.legalName
    session.taxNo = companyForm.value.taxNo
    session.taxOffice = companyForm.value.taxOffice
    session.sectors = companyForm.value.sectors
    session.mersis = companyForm.value.mersis
    session.sicilNo = companyForm.value.sicilNo
    session.tcKimlik = companyForm.value.tcKimlik
    session.contactPerson = companyForm.value.contactPerson
    session.phone = companyForm.value.phone
    session.faturaAdresi = companyForm.value.faturaAdresi
    session.iban = companyForm.value.iban
    session.accountHolder = companyForm.value.accountHolder
    session.verified = true
    localStorage.setItem('userSession', JSON.stringify(session))
    userSession.value = session
  }
  showToast("Kurumsal firma ve vergi bilgileriniz başarıyla kaydedildi.", "success")
}

// Document Upload status counters
const uploadedDocs = ref<Record<string, boolean>>({
  vergi: true,
  sicil: true,
  imza: false,
  faaliyet: false,
  kimlikOn: true,
  kimlikArka: true
})

const docsCount = computed(() => {
  return Object.values(uploadedDocs.value).filter(Boolean).length
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const currentUploadKey = ref('')

function triggerDocUpload(key: string) {
  currentUploadKey.value = key
  fileInputRef.value?.click()
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        profileAvatarUrl.value = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }

  const key = currentUploadKey.value
  if (key === 'kapak') {
    showToast(`Kapak görseli olarak "${file.name}" yüklendi.`, "success")
  } else if (key === 'profil_logo') {
    showToast(`Profil görseli olarak "${file.name}" yüklendi.`, "success")
  } else {
    uploadedDocs.value[key] = true
    showToast(`"${file.name}" belgesi başarıyla sisteme yüklendi.`, "success")
  }

  // Clear target value to allow uploading the same file again
  target.value = ''
}

// Password verification state
const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const showPassword3 = ref(false)

const ruleLength = computed(() => newPassword.value.length >= 10)
const ruleCase = computed(() => /[A-Z]/.test(newPassword.value) && /[a-z]/.test(newPassword.value))
const ruleDigit = computed(() => /[0-9]/.test(newPassword.value))
const ruleSpecial = computed(() => /[^A-Za-z0-9]/.test(newPassword.value))
const ruleNoPattern = computed(() => !/(.)\1{2,}/.test(newPassword.value) && !newPassword.value.toLowerCase().includes('123') && !newPassword.value.toLowerCase().includes('qwerty'))
const ruleNoSpace = computed(() => !/\s/.test(newPassword.value) && newPassword.value.length > 0)
const ruleNotOld = computed(() => newPassword.value !== currentPassword.value || !newPassword.value)
const ruleMatch = computed(() => newPassword.value === newPasswordConfirm.value && newPassword.value.length > 0)

const rulesMetCount = computed(() => {
  return [
    ruleLength.value,
    ruleCase.value,
    ruleDigit.value,
    ruleSpecial.value,
    ruleNoPattern.value,
    ruleNoSpace.value,
    ruleNotOld.value,
    ruleMatch.value
  ].filter(Boolean).length
})

const isPasswordFormValid = computed(() => {
  return rulesMetCount.value === 8 && currentPassword.value.length > 0
})

function updatePassword() {
  if (isPasswordFormValid.value) {
    showToast("Şifreniz başarıyla güncellenmiştir! Güvenliğiniz için diğer cihazlardaki oturumlar sonlandırıldı.")
    currentPassword.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
  }
}

// 2FA state toggle
function toggle2FA() {
  companyForm.value.is2FaEnabled = !companyForm.value.is2FaEnabled
  showToast(
    companyForm.value.is2FaEnabled ? "E-posta ile İki Aşamalı Doğrulama başarıyla aktifleştirildi." : "İki aşamalı doğrulama kapatıldı.",
    companyForm.value.is2FaEnabled ? "success" : "warning"
  )
}

const profileAvatarUrl = ref<string>('')

// Active sessions state
const sessions = ref([
  { id: 1, device: 'Windows · Chrome', lastActive: '17 Temmuz 2026 23:55', ip: '85.105.112.45', isCurrent: true },
  { id: 2, device: 'iPhone 15 · Safari Mobile', lastActive: '17 Temmuz 2026 18:24', ip: '176.43.98.11', isCurrent: false },
  { id: 3, device: 'macOS Monterey · Firefox', lastActive: '15 Temmuz 2026 12:08', ip: '94.54.201.88', isCurrent: false }
])

function closeSession(id: number) {
  sessions.value = sessions.value.filter(s => s.id !== id)
  showToast("Oturum sonlandırıldı. İlgili cihaza ilk istekte şifre sorulacaktır.")
}

function terminateOtherSessions() {
  sessions.value = sessions.value.filter(s => s.isCurrent)
  showToast("Geçerli tarayıcı haricindeki tüm aktif cihaz oturumları kapatıldı.", "warning")
}

function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
  showToast("Oturum sonlandırıldı, çıkış yapılıyor...", "warning")
  setTimeout(() => {
    router.push('/uyelik')
  }, 1000)
}

// Security Logs state
const securityLogs = ref([
  { id: 1, title: 'Güvenlik olayı - Şifre Değişimi', time: '17 Temmuz 2026 23:29', status: 'Bilinmeyen', device: 'Windows / Chrome', level: 'info' },
  { id: 2, title: 'Yeni Cihaz Girişi', time: '15 Temmuz 2026 11:42', status: 'Başarılı', device: 'macOS / Firefox', level: 'info' },
  { id: 3, title: 'İki Aşamalı Doğrulama (2FA) Açma', time: '14 Temmuz 2026 09:15', status: 'Başarılı', device: 'iPhone 15', level: 'success' }
])

const filterDays = ref('30')
const filterType = ref('Tümü')

const filteredLogs = computed(() => {
  return securityLogs.value.filter(log => {
    if (filterType.value !== 'Tümü' && !log.title.includes(filterType.value)) return false
    return true
  })
})

// Preferences state
const activeTheme = ref<'sistem' | 'acik' | 'koyu'>('sistem')
const selectedLanguage = ref('Türkçe')
const timeFormat = ref('24 saat')
const timezone = ref('Europe/Istanbul (GMT+3)')

function savePreferences() {
  showToast("Uygulama tercihleri başarıyla kaydedildi.")
}

function resetPreferences() {
  activeTheme.value = 'sistem'
  selectedLanguage.value = 'Türkçe'
  timeFormat.value = '24 saat'
  timezone.value = 'Europe/Istanbul (GMT+3)'
  showToast("Tercihler varsayılan değerlere sıfırlandı.", "warning")
}

// Addresses list tabs
const activeAddressType = ref<'teslimat' | 'fatura'>('teslimat')
const addresses = ref([
  { id: 1, type: 'teslimat', title: 'Merkez Ofis Depo', address: 'İsmet Paşa Mah. Çanakkale', city: 'Merkez / Çanakkale', zip: '17100', isDefault: true },
  { id: 2, type: 'fatura', title: 'Ali Turan Şahıs Şirketi', address: '17100 Çanakkale İsmet Paşa Mah. Merkez Çanakkale', city: 'Merkez / Çanakkale', zip: '17100', isDefault: true }
])

function deleteAddress(id: number) {
  addresses.value = addresses.value.filter(a => a.id !== id)
  showToast("Adres silindi.")
}

// New address states and actions
const isNewAddressModalOpen = ref(false)
const newAddressForm = ref({
  type: 'teslimat' as 'teslimat' | 'fatura',
  title: '',
  address: '',
  city: '',
  district: '',
  zip: '',
  isDefault: false
})

function addAddress() {
  if (!newAddressForm.value.title.trim()) {
    showToast("Lütfen adres başlığı giriniz.", "error")
    return
  }
  if (!newAddressForm.value.address.trim()) {
    showToast("Lütfen açık adres giriniz.", "error")
    return
  }
  if (!newAddressForm.value.city.trim()) {
    showToast("Lütfen il giriniz.", "error")
    return
  }
  if (!newAddressForm.value.district.trim()) {
    showToast("Lütfen ilçe giriniz.", "error")
    return
  }

  if (newAddressForm.value.isDefault) {
    addresses.value.forEach(a => {
      if (a.type === newAddressForm.value.type) {
        a.isDefault = false
      }
    })
  }

  addresses.value.push({
    id: Date.now(),
    type: newAddressForm.value.type,
    title: newAddressForm.value.title,
    address: newAddressForm.value.address,
    city: `${newAddressForm.value.district} / ${newAddressForm.value.city}`,
    zip: `${newAddressForm.value.zip || '17100'}`,
    isDefault: newAddressForm.value.isDefault
  })

  showToast("Yeni adres başarıyla eklendi.")
  isNewAddressModalOpen.value = false

  // Reset form
  newAddressForm.value = {
    type: 'teslimat',
    title: '',
    address: '',
    city: '',
    district: '',
    zip: '',
    isDefault: false
  }
}

// Scroll Helper
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Notification toggles
const notifyMail = ref(true)
const notifySms = ref(false)
const notifyBrowser = ref(true)

function saveNotifications() {
  showToast("Bildirim tercihleri güncellendi.")
}

// Sözleşmeler modal & consent checkboxes
const consents = ref<Record<string, boolean>>({
  'Platform Abonelik ve Kullanım Sözleşmesi': true,
  'Ticari Elektronik İleti ve İletişim Açık Rıza Beyanı': true,
  'Ticari İletişim ve Pazarlama Açık Rızası': true,
  'Dijital Varlıklar ve Görsel Verilerin İşlenmesi Açık Rızası': true,
  'Kişisel Verilerin Yurt Dışı Aktarımı Açık Rızası': true,
  'Diğer Verilerin İşlenmesi Açık Rızası': true,
  'Profil Kalite Skoru ve İstatistiksel Analiz Açık Rızası': true,
  'ACISCO B2B ELEKTRONİK TİCARET PLATFORMU ANA SÖZLEŞMESİ': true
})

const selectedAgreement = ref<{ title: string, content: string } | null>(null)

function openAgreement(title: string) {
  selectedAgreement.value = {
    title,
    content: `${title} yasal metni ve KVKK aydınlatma bildirimleri. Bu sözleşme kapsamında B2B platformunun adil kullanım standartları, işlem güvenliği protokolleri ve kişisel/kurumsal verilerinizin 6698 sayılı KVKK kapsamında işlenmesine dair detaylar yer almaktadır.`
  }
}

function closeAgreement() {
  selectedAgreement.value = null
}

function toggleConsent(key: string) {
  consents.value[key] = !consents.value[key]
  showToast(
    consents.value[key] ? `"${key}" onaylandı.` : `"${key}" onayı geri çekildi.`,
    consents.value[key] ? "success" : "warning"
  )
}

// KVKK Request State
const kvkkRequestType = ref('Veri Erişim Talebi')
const kvkkDescription = ref('')
const kvkkSuccess = ref(false)

function submitKvkk() {
  if (kvkkDescription.value.length >= 10) {
    kvkkSuccess.value = true
    showToast("KVKK veri talebiniz işleme alınmıştır.")
    setTimeout(() => {
      kvkkSuccess.value = false
      kvkkDescription.value = ''
    }, 4000)
  } else {
    showToast("Lütfen talebinizi açıklayan en az 10 karakterlik bir mesaj yazınız.", "error")
  }
}

// Account delete warning modal
const isDeleteModalOpen = ref(false)
const deletePassword = ref('')

function confirmAccountDelete() {
  if (deletePassword.value.length >= 6) {
    showToast("Hesap kapatma talebiniz başarıyla alınmıştır. Sistem yöneticilerimiz manuel inceleme sonrasında sizinle irtibata geçecektir.", "success")
    isDeleteModalOpen.value = false
    deletePassword.value = ''
  } else {
    showToast("Lütfen hesabınızı onaylamak için şifrenizi giriniz.", "error")
  }
}

// Profile save state
const isSaved = ref(false)
function saveProfile() {
  isSaved.value = true
  showToast("Kişisel ve iletişim bilgileriniz başarıyla güncellendi.")
  setTimeout(() => {
    isSaved.value = false
  }, 3000)
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6 relative">
    
    <!-- Hidden file input for file uploading -->
    <input 
      ref="fileInputRef" 
      type="file" 
      class="hidden" 
      accept="image/*,.pdf" 
      @change="onFileSelected" 
    />

    <!-- Toast Popup Notifications list at top right -->
    <div class="fixed top-5 right-5 z-50 space-y-2 pointer-events-none">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 bg-white transition-all duration-300 pointer-events-auto"
        :class="
          toast.type === 'success' ? 'border-emerald-200 text-emerald-800 bg-emerald-50/90' :
          toast.type === 'error' ? 'border-red-200 text-red-800 bg-red-50/90' :
          'border-amber-200 text-amber-800 bg-amber-50/90'
        "
      >
        <CheckCircle2 v-if="toast.type === 'success'" :size="14" />
        <AlertCircle v-else :size="14" />
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <!-- Top Global Banner for Unverified State -->
    <div 
      v-if="!companyVerified"
      class="rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold animate-pulse"
      :class="docsCount === 6 ? 'bg-blue-50/50 text-blue-800 border-blue-200' : 'bg-emerald-50/50 text-emerald-800 border-[#A7F3D0]'"
    >
      <div class="flex items-center gap-2 font-medium">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="docsCount === 6 ? 'bg-blue-400' : 'bg-emerald-400'"></span>
          <span class="relative inline-flex rounded-full h-2 w-2" :class="docsCount === 6 ? 'bg-blue-500' : 'bg-emerald-500'"></span>
        </span>
        <span v-if="docsCount === 6">
          {{ '🍀 Tüm belgeleriniz yüklendi. Doğrulama süreci tamamlanmak üzere inceleniyor.' }}
        </span>
        <span v-else>
          {{ `🏢 Şirket kimliği ve fatura bilgileriniz hazır. Tam hesap aktivasyonu için kalan eksik belgeleri (${6 - docsCount} adet) yükleyin.` }}
        </span>
      </div>
      <button 
        type="button"
        @click="activeSubTab = 'sirket'"
        class="rounded-lg text-white px-3 py-1.5 transition self-start sm:self-auto font-bold"
        :class="docsCount === 6 ? 'bg-blue-800 hover:bg-blue-900' : 'bg-emerald-800 hover:bg-emerald-900'"
      >
        {{ docsCount === 6 ? ('Belgeleri İncele') : ('Kalan Belgeleri Yükle') }}
      </button>
    </div>

    <!-- Title and Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4" style="border-color: #F1F5F9;">
      <div>
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">ACCOUNT CENTER</span>
        <h1 class="text-2xl font-black text-slate-800 mt-1" style="color: #0F172A;">
          {{ 
            activeSubTab === 'kisisel' ? 'Personal Account Center' :
            activeSubTab === 'sirket' ? 'Company & Verification' :
            activeSubTab === 'adresler' ? 'Saved Addresses' :
            activeSubTab === 'takip' ? 'Favorites & Follows' : 
            activeSubTab === 'uyelik' ? 'Membership Plan' :
            activeSubTab === 'ayarlar' ? 'Settings' : 'Settings'
          }}
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          {{ 
            activeSubTab === 'kisisel' ? 'Manage your personal profile, media assets, and contact preferences.' :
            activeSubTab === 'sirket' ? 'Manage your organization details and company verification status.' :
            activeSubTab === 'adresler' ? 'Manage delivery and billing addresses for fast tender creation.' :
            activeSubTab === 'takip' ? 'View saved companies and track their latest tender updates.' :
            activeSubTab === 'uyelik' ? 'Manage your B2B membership packages and active tender quotas.' :
            'Manage security, appearance, notification, and legal preferences in one place.'
          }}
        </p>
      </div>

      <!-- Actions and status pills dynamically linked next to page title -->
      <div class="flex items-center gap-2">
        <button v-if="activeSubTab === 'adresler'" type="button" @click="isNewAddressModalOpen = true" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 transition">
          <Plus :size="14" /> Yeni adres
        </button>
        <button v-if="activeSubTab === 'sirket'" type="button" @click="showToast('Firma profiliniz önizleniyor...')" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          Profili önizle
        </button>

        <!-- Üyelik summary pill matching design -->
        <div v-if="activeSubTab === 'uyelik'" class="flex gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm text-left">
          <div class="px-2.5 border-r border-slate-100 last:border-0">
            <span class="text-[8px] font-black text-slate-300 uppercase block">MEVCUT PLAN</span>
            <span class="text-[10px] font-bold text-slate-700 block mt-0.5">1 Ay Lansman Denemesi</span>
          </div>
          <div class="px-2.5 border-r border-slate-100 last:border-0">
            <span class="text-[8px] font-black text-slate-300 uppercase block">DÖNEM ÜCRETİ</span>
            <span class="text-[10px] font-bold text-emerald-600 block mt-0.5">0 ₺ <span class="text-[8px] text-emerald-500 font-medium">(Lansmana Özel Bedelsiz)</span></span>
          </div>
          <div class="px-2.5 border-r border-slate-100 last:border-0">
            <span class="text-[8px] font-black text-slate-300 uppercase block">BİTİŞ TARİHİ</span>
            <span class="text-[10px] font-bold text-slate-700 block mt-0.5">27 Eylül 2026 (1 Ay)</span>
          </div>
          <div class="px-2.5 flex flex-col justify-center">
            <span class="text-[8px] font-black text-slate-300 uppercase block">DURUM</span>
            <span class="inline-flex items-center gap-0.5 text-[8px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-0.5">
              Aktif Deneme
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="space-y-6">
        
        <!-- KIŞISEL TAB -->
        <div v-if="activeSubTab === 'kisisel'" class="space-y-6">
          <!-- PERMANENT RATING SCORECARD & LEVEL BENCHMARK BAR (Requirement 4) -->
          <div class="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-lg text-left space-y-6" style="background: linear-gradient(135deg, #0A1128 0%, #1C2541 100%); border-bottom: 3px solid #C59B27;">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shrink-0">
                  <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl font-mono">
                    {{ profileForm.name.charAt(0) }}{{ profileForm.surname.charAt(0) }}
                  </div>
                </div>

                <div class="space-y-1 text-white">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black tracking-tight">{{ profileForm.name }} {{ profileForm.surname }}</h2>
                    <span class="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck :size="11" class="text-amber-400" />
                      ✓ {{ 'e-Devlet & MERSİS ONAYLI' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 font-medium flex items-center gap-3">
                    <span>📧 {{ profileForm.email }}</span>
                    <span>•</span>
                    <span>📞 +90 {{ profileForm.phone }}</span>
                  </p>
                </div>
              </div>

              <!-- Overall Score Pill -->
              <div class="bg-white/10 p-4 rounded-2xl border border-white/15 text-center min-w-[200px]">
                <span class="text-[9px] font-black text-amber-300 uppercase tracking-widest block">GENEL VERİLEN PUAN</span>
                <div class="text-2xl font-black text-white font-mono flex items-center justify-center gap-1.5 mt-1">
                  <Star :size="18" class="text-amber-400 fill-amber-400" />
                  <span>4.9</span>
                  <span class="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <div class="text-[9px] font-bold text-amber-400 mt-1">⭐⭐⭐⭐⭐ (28 Onaylı Yorum)</div>
              </div>
            </div>

            <!-- Kıstas & Seviye Çizelgesi (Benchmark Gauge Bar) -->
            <div class="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-white font-bold gap-2">
                <span class="flex items-center gap-1.5 text-amber-300 uppercase text-[10px] font-black tracking-wider">
                  <Award :size="14" class="text-amber-400" />
                  PLATFORM KISTAS VE SEVİYE ÇİZELGESİ
                </span>
                <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black">
                  🌟 SEVİYE ÜSTÜ (SÜPER TEDARİKÇİ)
                </span>
              </div>

              <!-- Level Progress Bar -->
              <div class="space-y-1.5">
                <div class="w-full bg-slate-900/60 rounded-full h-3.5 p-0.5 border border-white/10 relative overflow-hidden">
                  <div class="bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 h-full rounded-full w-[88%] transition-all duration-500 shadow-sm"></div>
                </div>
                <div class="flex justify-between text-[9px] font-bold text-slate-300">
                  <span>Düşük Düzey (%0 - %40)</span>
                  <span>Ortalama Seviye (%40 - %70)</span>
                  <span class="text-amber-300 font-black">Seviye Üstü (%70 - %95) 🔥</span>
                  <span>Mükemmel (%95 - %100)</span>
                </div>
              </div>

              <!-- Score Matrix breakdown grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div class="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 text-center">
                  <span class="text-[8px] font-black uppercase text-slate-400 block">TESLİMAT HIZI</span>
                  <span class="text-xs font-black text-emerald-400 font-mono block mt-0.5">%98 (Seviye Üstü)</span>
                </div>
                <div class="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 text-center">
                  <span class="text-[8px] font-black uppercase text-slate-400 block">ŞARTNAME UYUM</span>
                  <span class="text-xs font-black text-blue-400 font-mono block mt-0.5">%100 (Mükemmel)</span>
                </div>
                <div class="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 text-center">
                  <span class="text-[8px] font-black uppercase text-slate-400 block">FİYAT REKABETİ</span>
                  <span class="text-xs font-black text-amber-400 font-mono block mt-0.5">%96 (Seviye Üstü)</span>
                </div>
                <div class="bg-slate-900/50 p-2.5 rounded-xl border border-white/10 text-center">
                  <span class="text-[8px] font-black uppercase text-slate-400 block">GÜVENİLİRLİK</span>
                  <span class="text-xs font-black text-emerald-400 font-mono block mt-0.5">%99 (Mükemmel)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Strength Score -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-6" style="border-color: #E2E8F0;">
            <div class="md:col-span-2 flex flex-col items-center justify-center text-center gap-3">
              <div class="relative h-24 w-24 flex items-center justify-center">
                <svg class="absolute transform -rotate-90 w-full h-full">
                  <circle cx="48" cy="48" r="40" stroke="#F1F5F9" stroke-width="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#3B82F6" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="150.7" />
                </svg>
                <span class="text-base font-black text-slate-800">%40</span>
              </div>
              <div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PROFİL KALİTE SKORU</span>
                <span class="text-xs font-bold text-slate-700 block mt-0.5">Güven kaydınız</span>
              </div>
            </div>

            <div class="md:col-span-3 space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">SONRAKİ ADIMLAR</span>
              <div class="space-y-2 text-[10px] font-bold">
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Fotoğraf ekleyin</div>
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Tanıtım videosu ekleyin</div>
                <div class="text-emerald-600 flex items-center gap-2"><CheckCircle2 :size="10" /> Sektörler ekleyin</div>
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Şirket açıklamasını tamamlayın</div>
              </div>
            </div>
          </div>

          <!-- Kişisel Bilgiler Form -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><User :size="14" /> Kişisel Bilgiler</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">İsim</label>
                <input v-model="profileForm.name" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Soyisim</label>
                <input v-model="profileForm.surname" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">E-posta</label>
                <input v-model="profileForm.email" type="email" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-400 outline-none" style="border-color: #E2E8F0;" disabled />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Telefon</label>
                <input v-model="profileForm.phone" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
            </div>
          </div>

          <!-- Upload section -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><Camera :size="14" /> Tanıtım Galerisi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <Camera :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Fotoğraf Ekle</span>
                <button type="button" @click="showToast('Fotoğraf yükleme arayüzü açıldı. Dosya bekleniyor...')" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 transition" style="border-color: #E2E8F0;">Fotoğraf Yükle</button>
              </div>
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition" @click="showToast('Sürükle-bırak video arayüzü etkin.')" style="border-color: #E2E8F0;">
                <Video :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Video Yüklemek İçin Tıklayın</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
            <span class="text-[10px] text-slate-400 font-bold">Tüm değişiklikleri kaydedin</span>
            <button type="button" @click="saveProfile" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition">Profili Güncelle</button>
          </div>
        </div>

        <!-- ŞİRKET & DOĞRULAMA TAB -->
        <div v-if="activeSubTab === 'sirket'" class="space-y-6">

          <!-- Genel Bilgiler Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">{{ 'Genel Bilgiler' }}</h3>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-start gap-4">
                <!-- Hidden File Input for Live Image Upload -->
                <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleImageSelected" />

                <div 
                  @click="triggerDocUpload()"
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 border text-slate-700 text-base font-black overflow-hidden cursor-pointer hover:opacity-90 transition shadow-xs"
                  :title="'Logo Değiştirmek İçin Tıklayın'"
                >
                  <img v-if="profileAvatarUrl" :src="profileAvatarUrl" alt="Avatar" class="h-full w-full object-cover" />
                  <span v-else>AT</span>
                </div>
                <div>
                  <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">{{ 'KURUM' }}</span>
                  <h3 class="text-lg font-black text-slate-800 mt-0.5">{{ companyForm.name }}</h3>
                  
                  <div class="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-bold">
                    <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[8px]">{{ 'Admin, İlan, Tedarikçi' }}</span>
                  </div>
                </div>
              </div>

              <!-- Quality level display -->
              <div class="rounded-xl border bg-slate-50 p-4 space-y-2 text-center md:text-right max-w-xs" style="border-color: #F1F5F9;">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{{ 'KURUMSAL PROFİL KALİTESİ' }}</span>
                <span class="text-lg font-black text-slate-800 block">%89</span>
              </div>
            </div>

            <!-- Nested detail info boxes -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">{{ 'VERGİ KİMLİK NO' }}</span>
                <span class="font-mono text-slate-700 block mt-1">{{ companyForm.taxNo }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">{{ 'ADRES' }}</span>
                <span class="text-slate-700 block mt-1 truncate" :title="companyForm.faturaAdresi">Çanakkale</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">{{ 'TELEFON' }}</span>
                <span class="font-mono text-slate-700 block mt-1">{{ profileForm.phone }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">{{ 'WEB SİTESİ' }}</span>
                <span class="text-slate-500 block mt-1">{{ 'Web Sitesi Girilmedi' }}</span>
              </div>
            </div>

            <!-- Profile Quality score card details -->
            <div class="rounded-xl bg-blue-50/20 border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style="border-color: #DBEAFE;">
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ 'Kurumsal Profil Kalitesi' }}</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">{{ 'Profil resmi, Şirket faturası, Kategoriler ve Doğrulama adımlarına göre hesaplanır.' }}</p>
              </div>
              <button type="button" @click="triggerDocUpload('profil_logo')" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 transition cursor-pointer">
                {{ 'Görsel Yükle' }}
              </button>
            </div>
          </div>

          <!-- Kayıt & Doğrulama Bilgileri Form Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            
            <!-- Google OAuth Connected Info Banner -->
            <div v-if="userSession?.isGoogleAuth || userSession?.authProvider === 'google'" class="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-base shrink-0 font-bold text-blue-600">
                  G
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-blue-900">Google Hesabı ile Oturum Açıldı:</span>
                    <span class="font-mono text-blue-800 text-[11px] font-semibold">{{ profileForm.email }}</span>
                  </div>
                  <p class="text-[11px] text-blue-700 mt-0.5">İhalelere teklif verebilmeniz veya ihale açabilmeniz için lütfen aşağıdaki kurumsal firma, sektör ve yasal vergi/kimlik bilgilerinizi doldurunuz.</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-[10px] whitespace-nowrap shadow-xs">
                Google Doğrulandı
              </span>
            </div>

            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">{{ 'Kurumsal & Yasal Firma Bilgileri' }}</h3>
              <div class="flex rounded-lg bg-slate-100 p-0.5">
                <button type="button" class="rounded px-2.5 py-1 text-[10px] font-black bg-white text-slate-800 shadow-sm">{{ 'Firma & Vergi Bilgisi' }}</button>
                <button type="button" @click="showToast('Fatura & Banka görünümüne geçiliyor...')" class="rounded px-2.5 py-1 text-[10px] font-black text-slate-500 cursor-pointer">{{ 'Fatura & Banka' }}</button>
              </div>
            </div>

            <p class="text-[10px] text-slate-400 leading-normal">
              <strong>{{ 'Yasal Kayıt & Doğrulama Bilgileri:' }}</strong> {{ 'Platformda güvenli ticaret yapabilmeniz, resmi faturalandırma ve ihale teklif verme yetkisi kazanabilmeniz için bu alanların eksiksiz doldurulması gerekmektedir.' }}
            </p>

            <!-- Editable Fields Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Şirket / Ticari Adı -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  ŞİRKET / TİCARİ ADI <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.name" type="text" placeholder="Örn: Yılmaz Ambalaj Sanayi" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800" style="border-color: #E2E8F0;" />
              </div>

              <!-- Yasal Firma Unvanı -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  YASAL FİRMA UNVANI (RESMİ) <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.legalName" type="text" placeholder="Örn: Yılmaz Ambalaj Sanayi ve Ticaret A.Ş." class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800" style="border-color: #E2E8F0;" />
              </div>

              <!-- Faaliyet Sektörleri -->
              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  FAALİYET SEKTÖRÜ / ALANLARI <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.sectors" type="text" placeholder="Örn: Ambalaj & Kağıt, İnşaat & Yapı Malzemeleri, Lojistik" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-medium" style="border-color: #E2E8F0;" />
                <span class="text-[9px] text-slate-400 mt-1 block">İlgi alanınıza giren sektörleri virgülle ayırarak yazınız. Size uygun ihaleler bu sektörlere göre filtrelenir.</span>
              </div>

              <!-- Vergi Numarası / VKN -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  VERGİ NUMARASI (VKN - TÜZEL KİŞİLER)
                </label>
                <input v-model="companyForm.taxNo" type="text" placeholder="10 Haneli VKN" maxlength="10" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono font-bold" style="border-color: #E2E8F0;" />
              </div>

              <!-- T.C. Kimlik No (Şahıs Şirketi) -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  T.C. KİMLİK NO (ŞAHIS ŞİRKETİ / BİREYSEL)
                </label>
                <input v-model="companyForm.tcKimlik" type="text" placeholder="11 Haneli T.C. Kimlik No" maxlength="11" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono font-bold" style="border-color: #E2E8F0;" />
              </div>

              <!-- Vergi Dairesi -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  BAĞLI OLDUĞU VERGİ DAİRESİ
                </label>
                <input v-model="companyForm.taxOffice" type="text" placeholder="Örn: Çanakkale Vergi Dairesi Müdürlüğü" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800" style="border-color: #E2E8F0;" />
              </div>

              <!-- MERSİS No -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  MERSİS NUMARASI (VARSA)
                </label>
                <input v-model="companyForm.mersis" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 bg-white text-slate-800 font-mono" style="border-color: #E2E8F0;" placeholder="0XXX-XXXX-XXXX-XXXX" />
              </div>

              <!-- Ticaret Sicil No -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  TİCARET SİCİL NO / ODA KAYIT NO
                </label>
                <input v-model="companyForm.sicilNo" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 bg-white text-slate-800" style="border-color: #E2E8F0;" placeholder="Örn: 14520 / Çanakkale TSO" />
              </div>

              <!-- İrtibat Yetkilisi -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  YETKİLİ ADI - SOYADI <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.contactPerson" type="text" placeholder="Yetkili kişi adı" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800" style="border-color: #E2E8F0;" />
              </div>

              <!-- Yetkili Telefon -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  YETKİLİ İLETİŞİM TELEFONU <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.phone" type="text" placeholder="Örn: 0850 840 86 95" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-medium" style="border-color: #E2E8F0;" />
              </div>

              <!-- Fatura ve Tebligat Adresi -->
              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  RESMİ FATURA VE TEBLİGAT ADRESİ
                </label>
                <textarea v-model="companyForm.faturaAdresi" rows="2" placeholder="İl, ilçe, mahalle, cadde, kapı no bilgileri" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800" style="border-color: #E2E8F0;"></textarea>
              </div>

              <!-- IBAN & Hakediş Hesabı (Escrow Sub-Merchant) -->
              <div class="md:col-span-2">
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">HAKEDİŞ & ÖDEME IBAN (ESCROW TRANSFER)</label>
                  <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Otomatik Dağıtım</span>
                </div>
                <input v-model="companyForm.iban" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 bg-white text-slate-800 font-mono font-bold" style="border-color: #E2E8F0;" placeholder="TR00 0000 0000 0000 0000 00" />
                <span class="text-[9px] text-slate-400 mt-1 block">İhaleleri kazandığınızda alıcı mal kabulü onayıyla hakedişiniz bu IBAN'a aktarılır.</span>
              </div>

            </div>

            <!-- Save Company Button -->
            <div class="flex items-center justify-between pt-4 border-t" style="border-color: #F1F5F9;">
              <span class="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck :size="14" class="text-emerald-600" /> Bilgileriniz 256-bit SSL ve KVKK güvencesiyle korunur.
              </span>
              <button type="button" @click="saveCompanyInfo" class="rounded-xl bg-[#0F223D] hover:bg-[#1E3A8A] text-white font-bold text-xs px-6 py-2.5 transition cursor-pointer shadow-xs">
                {{ 'Kurumsal Bilgileri Kaydet' }}
              </button>
            </div>
          </div>

          <!-- Kapak Görseli Upload Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Kapak Görseli</h3>
            </div>
            <div class="rounded-xl border-2 border-dashed p-8 text-center space-y-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition" @click="triggerDocUpload('kapak')" style="border-color: #E2E8F0;">
              <Camera :size="20" class="text-slate-400" />
              <div>
                <h4 class="text-xs font-bold text-slate-700">Kapak Görseli Yükle</h4>
                <p class="text-[9px] text-slate-400 leading-normal mt-0.5">Firma profil sayfanızın üst kısmında görünecek olan görsel (Önerilen boyut: 1200x300, JPEG veya PNG, Maks. 5 MB)</p>
              </div>
            </div>
          </div>

          <!-- Doğrulama ve Belgeler list -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Doğrulama ve Belgeler</h3>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Doğrulanmamış</span>
            </div>

            <!-- Steps list grid status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>E-posta</span>
                <span class="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Kayıtlı</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Telefon</span>
                <span class="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Doğrulanmamış</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Kimlik</span>
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Bekliyor</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Şirket Belgeleri</span>
                <span class="text-[9px] text-red-500 bg-red-50 px-2 py-0.5 rounded">Eksik</span>
              </div>
            </div>

            <!-- Upload files list -->
            <div class="space-y-4 pt-4 border-t" style="border-color: #F1F5F9;">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-slate-800">Doğrulama Belgeleri</h4>
                <span class="text-[10px] text-slate-400 font-bold">Zorunlu belgeler: {{ docsCount }}/6</span>
              </div>

              <div class="divide-y divide-slate-100">
                <!-- Doc 1: Vergi Levhası -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Vergi Levhası <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('vergi')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.vergi ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.vergi ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 2: Ticaret Sicil Gazetesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Ticaret Sicil Gazetesi <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('sicil')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.sicil ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.sicil ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 3: İmza Sirküleri -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    İmza Sirküleri <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('imza')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.imza ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.imza ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 4: Faaliyet Belgesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Faaliyet Belgesi <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('faaliyet')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.faaliyet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.faaliyet ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 5: Yetkili Kimlik Belgesi - Ön Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Ön Yüz <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('kimlikOn')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.kimlikOn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.kimlikOn ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 6: Yetkili Kimlik Belgesi - Arka Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Arka Yüz <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('kimlikArka')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.kimlikArka ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.kimlikArka ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Complete Submit -->
            <button 
              type="button" 
              @click="companyVerified = true; showToast('Şirket kimliğiniz doğrulanmak üzere kuyruğa alındı!')"
              class="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 transition shadow"
            >
              Şirket Doğrulamasını Başlat
            </button>
          </div>

        </div>

        <!-- KAYITLI ADRESLER TAB -->
        <div v-if="activeSubTab === 'adresler'" class="space-y-6">

          <!-- Tabs sub selector -->
          <div class="flex items-center justify-between bg-white border p-1 rounded-xl" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-1.5">
              <button 
                type="button"
                @click="activeAddressType = 'teslimat'"
                class="rounded-lg px-4 py-2 text-xs font-bold transition"
                :class="activeAddressType === 'teslimat' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'"
              >
                Teslimat Adresleri ({{ addresses.filter(a => a.type === 'teslimat').length }})
              </button>
              <button 
                type="button"
                @click="activeAddressType = 'fatura'"
                class="rounded-lg px-4 py-2 text-xs font-bold transition"
                :class="activeAddressType === 'fatura' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'"
              >
                Fatura Adresleri ({{ addresses.filter(a => a.type === 'fatura').length }})
              </button>
            </div>
          </div>

          <span class="text-[10px] text-slate-400 font-bold block">{{ addresses.length }} / 20 kayıtlı adres kullanılıyor</span>

          <!-- Address card list -->
          <div 
            v-for="addr in addresses.filter(a => a.type === activeAddressType)" 
            :key="addr.id"
            class="rounded-2xl border bg-white p-6 shadow-sm space-y-4 transition hover:border-slate-300" 
            style="border-color: #E2E8F0;"
          >
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><MapPin :size="14" /></div>
                <div>
                  <span class="text-[8px] font-black text-slate-300 uppercase block">{{ addr.type === 'teslimat' ? 'TESLİMAT ADRESİ' : 'FATURA ADRESİ' }}</span>
                  <h4 class="text-xs font-bold text-slate-800">{{ addr.title }}</h4>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black uppercase">VARSAYILAN</span>
                <button type="button" @click="showToast('Adres düzenleme modülü aktif.')" class="p-1.5 rounded-lg border text-slate-400 hover:text-slate-800" style="border-color: #E2E8F0;"><Edit2 :size="12" /></button>
                <button type="button" @click="deleteAddress(addr.id)" class="p-1.5 rounded-lg border text-slate-400 hover:text-red-600" style="border-color: #E2E8F0;"><Trash2 :size="12" /></button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">AÇIK ADRES</span>
                <span class="text-slate-700 font-bold">{{ addr.address }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">İL / İLÇE</span>
                <span class="text-slate-700 font-bold">{{ addr.city }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">MAHALLE / POSTA KODU</span>
                <span class="text-slate-700 font-bold">{{ addr.zip }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAKİP ETTİKLERİM TAB -->
        <div v-if="activeSubTab === 'takip'" class="space-y-6">
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <div>
              <h2 class="text-lg font-black text-slate-800">Takip Ettiklerim</h2>
              <p class="text-xs text-slate-400">Takip ettiğiniz firmaları görüntüleyin, güncellemelerini izleyin ve hızlıca profillerine ulaşın.</p>
            </div>
            <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">Takip edilen firma: 0</span>
          </div>

          <!-- Empty state -->
          <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4" style="border-color: #E2E8F0;">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Building :size="20" />
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-slate-800">Henüz firma takip etmiyorsunuz</h3>
              <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                İlgilendiğiniz firmaları takip ederek yeni ihalelerden ve güncellemelerden haberdar olabilirsiniz.
              </p>
            </div>
            <NuxtLink to="/panel/firmalar" class="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 shadow transition">
              Kurumsal firmaları keşfet
            </NuxtLink>
          </div>
        </div>

        <!-- GEÇMİŞ TİCARETLERİM TAB -->
        <div v-if="activeSubTab === 'ticaret'" class="space-y-6">
          <div class="border-b pb-3" style="border-color: #F1F5F9;">
            <h2 class="text-lg font-black text-slate-800">Geçmiş Ticaretlerim</h2>
            <p class="text-xs text-slate-400">Platform üzerinde tamamladığınız tüm ihaleler ve sözleşmeler.</p>
          </div>
          <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-3" style="border-color: #E2E8F0;">
            <History :size="24" class="text-slate-300 mx-auto" />
            <h3 class="text-xs font-bold text-slate-700">Henüz tamamlanmış bir ticaretiniz bulunmamaktadır.</h3>
          </div>
        </div>

        <!-- BİLDİRİMLER TAB -->
        <div v-if="activeSubTab === 'bildirimler'" class="space-y-6">
          <div class="border-b pb-3" style="border-color: #F1F5F9;">
            <h2 class="text-lg font-black text-slate-800">Bildirim Tercihleri</h2>
            <p class="text-xs text-slate-400">Hangi güncellemeleri hangi kanallar üzerinden almak istediğinizi belirtin.</p>
          </div>

          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-xs font-bold text-slate-800">E-posta bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Yeni teklif geldiğinde, ihale sonuçlandığında e-posta gönderilsin.</p>
              </div>
              <button 
                type="button" 
                @click="notifyMail = !notifyMail; showToast(notifyMail ? 'E-posta bildirimleri açıldı.' : 'E-posta bildirimleri sessize alındı.', 'warning')"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifyMail ? 'background: #003057;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifyMail ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-xs font-bold text-slate-800">SMS bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Önemli sözleşme ve kargo sevkiyat durumları telefona iletilsin.</p>
              </div>
              <button 
                type="button" 
                @click="notifySms = !notifySms; showToast(notifySms ? 'SMS bildirimleri açıldı.' : 'SMS bildirimleri sessize alındı.', 'warning')"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifySms ? 'background: #003057;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifySms ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-slate-800">Tarayıcı anlık bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Yeni mesaj veya canlı etkinlik başladığında tarayıcıda bildirim göster.</p>
              </div>
              <button 
                type="button" 
                @click="notifyBrowser = !notifyBrowser; showToast(notifyBrowser ? 'Tarayıcı bildirimleri açıldı.' : 'Tarayıcı bildirimleri kapatıldı.', 'warning')"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifyBrowser ? 'background: #003057;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifyBrowser ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>

            <div class="flex justify-end pt-2">
              <button type="button" @click="saveNotifications" class="rounded-xl bg-blue-600 text-white font-bold text-xs px-6 py-2.5 hover:bg-blue-700 transition">Bildirimleri Kaydet</button>
            </div>
          </div>
        </div>

        <!-- ÜYELİK TAB (Photo 2 Design: 4 Packages + Switcher + Security Strip + Standard Features) -->
        <div v-if="activeSubTab === 'uyelik'" class="space-y-8 text-left">
          
          <!-- Region Selector Switcher (Photo 2 Header) -->
          <div class="flex justify-center pt-2">
            <div class="inline-flex rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xs">
              <button
                type="button"
                @click="membershipPricingRegion = 'domestic'"
                class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer"
                :class="membershipPricingRegion === 'domestic' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              >
                <span class="rounded bg-white/20 px-1 text-[10px]">TR</span>
                <span>Yurt İçi Ödeme (Türkiye / ₺ TRY)</span>
              </button>
              <button
                type="button"
                @click="membershipPricingRegion = 'international'"
                class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer"
                :class="membershipPricingRegion === 'international' ? 'bg-[#0052FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
              >
                <Globe :size="14" />
                <span>Yurt Dışı Ödeme (Global / $ USD - € EUR)</span>
              </button>
            </div>
          </div>

          <!-- 6-MONTH FREE TRIAL LAUNCH BANNER (0 TL) -->
          <div class="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-left">
            <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div class="space-y-2 max-w-2xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                  <Sparkles :size="13" />
                  <span>LANSMANA ÖZEL: 1 AY BOYUNCA %100 ÜCRETSİZ DENEME SÜRECİ</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                  İlk 1 Ay Boyunca Hiçbir Ücret Ödemeden Tüm Sistemi Kullanın!
                </h2>
                <p class="text-xs text-slate-300 leading-relaxed font-medium">
                  İhaleciBurada platform lansmanına özel olarak tüm alıcı ve tedarikçi firmalarımıza ilk 1 ay boyunca ihale açma, teklif verme, canlı tersine eksiltme ve tüm analiz modülleri <strong>0 ₺</strong> bedelle sunulmaktadır. Kredi kartı gerekmez, 0 komisyon, anında koşulsuz aktivasyon.
                </p>
                <div class="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-emerald-300 font-bold">
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> 1 Ay Boyunca 0 ₺</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Kredi Kartı İstemez</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Sınırsız İhale & Eksiltme</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Anında Aktivasyon</span>
                </div>
              </div>

              <div class="shrink-0 w-full lg:w-auto">
                <NuxtLink
                  to="/abonelik"
                  class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>1 AYLIK ÜCRETSİZ DENEMENİZ AKTİF (0 ₺)</span>
                  <CheckCircle2 :size="16" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Domestic Packages (TRY ₺) - 4 Cards Grid (Photo 2) -->
          <div v-if="membershipPricingRegion === 'domestic'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div
              v-for="pkg in membershipPricingDomestic"
              :key="pkg.id"
              class="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden"
              :class="pkg.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'"
            >
              <!-- Badge banner -->
              <div
                class="text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-center mb-4"
                :class="pkg.isPopular ? 'bg-amber-400 text-slate-950 font-black' : 'bg-[#0F223D] text-white'"
              >
                {{ pkg.badge }}
              </div>

              <div class="space-y-4">
                <h3 class="text-xs font-black text-slate-800 tracking-wider text-center uppercase">{{ pkg.name }}</h3>
                
                <div class="text-center py-3 border-y border-slate-100">
                  <div class="text-4xl font-black text-slate-900 font-mono tracking-tight">₺{{ pkg.price.toLocaleString('tr-TR') }}</div>
                  <div class="text-xs font-bold text-slate-400 mt-1">{{ pkg.monthly }}</div>
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed text-center min-h-[36px]">
                  {{ pkg.desc }}
                </p>
              </div>

              <div class="pt-6">
                <NuxtLink
                  :to="`/abonelik?plan=${pkg.id}`"
                  class="w-full py-3.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  :class="pkg.isPopular ? 'bg-amber-400 hover:bg-amber-500 text-slate-950' : 'bg-[#0F223D] hover:bg-[#0052FF] text-white'"
                >
                  <span>HEMEN ABONE OL</span>
                  <ArrowRight :size="14" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- International Packages (Global USD / EUR) - 4 Cards Grid (Photo 2) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div
              v-for="pkg in membershipPricingGlobalUSD"
              :key="pkg.id"
              class="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden"
              :class="pkg.isPopular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80'"
            >
              <div
                class="text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-center mb-4"
                :class="pkg.isPopular ? 'bg-[#0052FF] text-white' : 'bg-slate-800 text-white'"
              >
                {{ pkg.badge }}
              </div>

              <div class="space-y-4">
                <h3 class="text-xs font-black text-slate-800 tracking-wider text-center uppercase">{{ pkg.name }}</h3>
                
                <div class="text-center py-3 border-y border-slate-100">
                  <div class="text-4xl font-black text-slate-900 font-mono tracking-tight">${{ pkg.price }}</div>
                  <div class="text-xs font-bold text-slate-400 mt-1">{{ pkg.monthly }}</div>
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed text-center min-h-[36px]">
                  {{ pkg.desc }}
                </p>
              </div>

              <div class="pt-6">
                <NuxtLink
                  :to="`/abonelik?plan=${pkg.id}`"
                  class="w-full py-3.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer bg-[#0052FF] hover:bg-blue-700 text-white"
                >
                  <span>SUBSCRIBE NOW</span>
                  <ArrowRight :size="14" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Trust & Security Sub-strip (Photo 2) -->
          <div class="rounded-2xl border border-slate-200/80 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 shadow-xs">
            <div class="flex items-center gap-2 font-medium">
              <CheckCircle2 :size="15" class="text-emerald-500 shrink-0" />
              <span>Tüm fiyatlara %20 KDV dahildir. E-Fatura 24 saat içinde iletilir.</span>
            </div>
            <div class="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span class="flex items-center gap-1"><Lock :size="12" class="text-amber-500" /> 256-BIT TLS SSL</span>
              <span class="flex items-center gap-1 text-emerald-600 font-black"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> ANINDA AKTİVASYON</span>
            </div>
          </div>

          <!-- Bottom Features Box ("Tüm Paketlerde Dahil Olan Standart Özellikler") (Photo 2) -->
          <div class="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
            <div>
              <h3 class="text-base font-black text-slate-900">Tüm Paketlerde Dahil Olan Standart Özellikler</h3>
              <p class="text-xs text-slate-500 mt-1 font-medium">Herhangi bir gizli ücret veya ek komisyon bulunmamaktadır.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
              <!-- Col 1 -->
              <div class="space-y-3">
                <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">1</span>
                  İHALE VE TEKLİF YÖNETİMİ
                </h4>
                <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız B2B İhale Açma</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Canlı Tersine Eksiltme Katılımı</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Doğrudan Temin & Teklif Toplama</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Satış ve Kiralama Duyuruları</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Fiyat Pazarlığı & Karşı Teklif Modülü</li>
                </ul>
              </div>

              <!-- Col 2 -->
              <div class="space-y-3">
                <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">2</span>
                  BİLDİRİM VE TAKİP SİSTEMİ
                </h4>
                <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Akıllı Sektörel Arama Önerileri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Yaklaşan İhale Anlık Bildirimleri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sonuçlanan İhale & Teklif Uyarıları</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız Bildirim (SMS + E-Posta)</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sınırsız Excel Rapor İndirme</li>
                </ul>
              </div>

              <!-- Col 3 -->
              <div class="space-y-3">
                <h4 class="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">3</span>
                  ANALİTİK VE MOBİL UYUM
                </h4>
                <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Yüklenici & Tedarikçi Firma Analizleri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> İdare ve Kurumsal Satın Alma Analizleri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Sektörel Fiyat ve Pazar Eğilimleri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Rakip Firma Teklif Dağılım Grafikleri</li>
                  <li class="flex items-center gap-2"><CheckCircle2 :size="14" class="text-emerald-500 shrink-0" /> Mobil Uyumlu Web & Panel Arayüzü</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Ek İhale Hakları Section -->
          <div class="space-y-4 pt-4">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <div>
                <h3 class="text-sm font-black text-slate-800">Profesyonel Paket Ek İhale Hakları</h3>
                <p class="text-[10px] text-slate-400 font-bold">Profesyonel paket kullanımınızı ek yıllık ihaleler alarak genişletin.</p>
              </div>
              
              <div class="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <span class="border rounded px-2 py-1 bg-white">TOPLAM EK LİMİT: +50 İHALE</span>
                <span>/</span>
                <span class="border rounded px-2 py-1 bg-white">ADET</span>
              </div>
            </div>

            <!-- The Two Horizontal Ek İhale Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Ek 50 Card -->
              <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition" style="border-color: #E2E8F0;">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[8px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">EK PAKET</span>
                    <h4 class="text-xs font-black text-slate-800 mt-1.5">Ek 50 İhale Hakkı</h4>
                  </div>
                  <div class="text-right">
                    <span class="text-[8px] font-black text-slate-300 block">TOPLAM EK BÜTÇE</span>
                    <span class="text-xs font-bold text-slate-700 block mt-0.5">₺2.500,00 <span class="text-[8px] text-slate-400 font-medium">+ KDV</span></span>
                  </div>
                </div>
                
                <button type="button" @click="showToast('Ek 50 İhale ödeme ekranına yönlendiriliyorsunuz...')" class="w-full text-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 transition" style="border-color: #E2E8F0;">
                  Ödemeye Geç
                </button>
              </div>

              <!-- Ek 100 Card -->
              <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition" style="border-color: #E2E8F0;">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[8px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">EK PAKET</span>
                    <h4 class="text-xs font-black text-slate-800 mt-1.5">Ek 100 İhale Hakkı</h4>
                  </div>
                  <div class="text-right">
                    <span class="text-[8px] font-black text-slate-300 block">TOPLAM EK BÜTÇE</span>
                    <span class="text-xs font-bold text-slate-700 block mt-0.5">₺4.500,00 <span class="text-[8px] text-slate-400 font-medium">+ KDV</span></span>
                  </div>
                </div>
                
                <button type="button" @click="showToast('Ek 100 İhale ödeme ekranına yönlendiriliyorsunuz...')" class="w-full text-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 transition" style="border-color: #E2E8F0;">
                  Ödemeye Geç
                </button>
              </div>

            </div>
          </div>

        </div>

        <!-- AYARLAR (SETTINGS) TAB -->
        <div v-if="activeSubTab === 'ayarlar'" class="space-y-6">
          
          <!-- Sticky Horizontal Navigation Bar -->
          <div class="flex items-center gap-2 sm:gap-6 bg-slate-50 border p-2 rounded-xl sticky top-0 z-20 shadow-sm" style="background: rgba(248, 250, 252, 0.95); backdrop-filter: blur(8px); border-color: #E2E8F0;">
            <button 
              v-for="sec in [
                { id: 'tercihler', label: 'Uygulama tercihleri' },
                { id: 'guvenlik', label: 'Güvenlik' },
                { id: 'bildirim-tercihleri', label: 'Bildirimler' },
                { id: 'profil-kaynagi', label: 'Profil kaynağı' }
              ]"
              :key="sec.id"
              type="button"
              @click="scrollToSection(sec.id)"
              class="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-blue-600 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {{ sec.label }}
            </button>
          </div>

          <!-- Top Info metrics grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="rounded-xl border bg-white p-4 flex items-center justify-between shadow-sm" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">GÜVENLİK</span>
                <span class="text-[11px] font-black text-emerald-600 block mt-1">🟢 1 aktif koruma</span>
              </div>
              <Shield :size="16" class="text-emerald-500" />
            </div>

            <div class="rounded-xl border bg-white p-4 flex items-center justify-between shadow-sm" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">DİL</span>
                <span class="text-[11px] font-black text-blue-600 block mt-1">🇹🇷 {{ selectedLanguage }}</span>
              </div>
              <Globe :size="16" class="text-blue-500" />
            </div>

            <div class="rounded-xl border bg-white p-4 flex items-center justify-between shadow-sm" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">SAAT DİLİMİ</span>
                <span class="text-[11px] font-black text-blue-600 block mt-1">⏱️ Operasyonel</span>
              </div>
              <Clock :size="16" class="text-blue-500" />
            </div>
          </div>

          <!-- Top horizontal card row (with icons on the left) -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Card 1 -->
            <div @click="scrollToSection('tercihler')" class="rounded-xl border bg-white p-4 flex flex-col justify-between min-h-[90px] shadow-sm text-left hover:bg-slate-50/50 cursor-pointer" style="border-color: #E2E8F0;">
              <div class="flex items-start gap-2.5">
                <Sliders :size="14" class="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 class="text-[11px] font-black text-slate-800 leading-tight">Uygulama tercihleri</h4>
                  <p class="text-[9px] text-slate-400 mt-1 leading-normal">Tümü, dil ve saat biçimi.</p>
                </div>
              </div>
              <span class="text-[9px] text-blue-600 font-bold mt-2 inline-flex items-center gap-0.5">Düzenle <ArrowRight :size="9" /></span>
            </div>

            <!-- Card 2 -->
            <div @click="scrollToSection('guvenlik')" class="rounded-xl border bg-white p-4 flex flex-col justify-between min-h-[90px] shadow-sm text-left hover:bg-slate-50/50 cursor-pointer" style="border-color: #E2E8F0;">
              <div class="flex items-start gap-2.5">
                <Shield :size="14" class="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 class="text-[11px] font-black text-slate-800 leading-tight">Güvenlik</h4>
                  <p class="text-[9px] text-slate-400 mt-1 leading-normal">Şifre, 2FA ve aktif oturumlar.</p>
                </div>
              </div>
              <span class="text-[9px] text-blue-600 font-bold mt-2 inline-flex items-center gap-0.5">Yönet <ArrowRight :size="9" /></span>
            </div>

            <!-- Card 3 -->
            <div @click="scrollToSection('bildirim-tercihleri')" class="rounded-xl border bg-white p-4 flex flex-col justify-between min-h-[90px] shadow-sm text-left hover:bg-slate-50/50 cursor-pointer" style="border-color: #E2E8F0;">
              <div class="flex items-start gap-2.5">
                <Bell :size="14" class="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 class="text-[11px] font-black text-slate-800 leading-tight">Bildirimler</h4>
                  <p class="text-[9px] text-slate-400 mt-1 leading-normal">Bildirim kanalları ve sessiz saatleri ayarlayın.</p>
                </div>
              </div>
              <span class="text-[9px] text-blue-600 font-bold mt-2 inline-flex items-center gap-0.5">Aç <ArrowRight :size="9" /></span>
            </div>

            <!-- Card 4 -->
            <div @click="scrollToSection('profil-kaynagi')" class="rounded-xl border bg-white p-4 flex flex-col justify-between min-h-[90px] shadow-sm text-left hover:bg-slate-50/50 cursor-pointer" style="border-color: #E2E8F0;">
              <div class="flex items-start gap-2.5">
                <FileText :size="14" class="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 class="text-[11px] font-black text-slate-800 leading-tight">Profil kaynağı</h4>
                  <p class="text-[9px] text-slate-400 mt-1 leading-normal">Profil veri korunması bilgileri tek kaynaktan düzenleyin.</p>
                </div>
              </div>
              <span class="text-[9px] text-blue-600 font-bold mt-2 inline-flex items-center gap-0.5">Aç <ArrowRight :size="9" /></span>
            </div>
          </div>

          <!-- Hesap ve Kurumsal Bilgiler Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2.5 pb-2 border-b" style="border-color: #F1F5F9;">
              <Building :size="15" class="text-blue-600" />
              <div>
                <span class="text-[8px] font-black text-slate-300 block">SİTE VE İLETİŞİM</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Hesap ve Kurumsal Bilgiler</h3>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 leading-normal">
              Kimlik ve kurumsal bilgiler: Önemli ve Kurumsal Kimlik sayfalarından yönetilir.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">AD SOYAD</span>
                <span class="text-slate-700 font-bold block mt-1">Ali Turan</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">E-POSTA ADRESİ</span>
                <span class="font-mono text-slate-700 block mt-1">alituran88@gmail.com</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">UNVAN</span>
                <span class="text-slate-700 font-bold block mt-1">Yönetici</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">İLETİŞİM DURUMU</span>
                <span class="text-emerald-600 font-bold block mt-1 flex items-center gap-1">🟢 Tanımlı</span>
              </div>
            </div>

            <!-- Lock Info Notice matching screenshot -->
            <div class="p-3 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold rounded-xl flex items-center gap-1.5">
              <AlertCircle :size="13" /> Kimlik ve kurumsal bilgiler Profil ve Kurumsal Kimlik sayfalarından yönetilir.
            </div>

            <div class="flex gap-2 pt-2 text-[10px] font-bold text-slate-500">
              <button @click="router.push('/panel/ayarlar?tab=kisisel')" type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1" style="border-color: #E2E8F0;">
                <User :size="11" /> Profil sayfasına git
              </button>
              <button @click="router.push('/panel/ayarlar?tab=sirket')" type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1" style="border-color: #E2E8F0;">
                <Building2 :size="11" /> Kurumsal kimliğe git
              </button>
            </div>
          </div>

          <!-- Güvenlik Şifre Yönetimi Card -->
          <div id="guvenlik" class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2.5 pb-2 border-b" style="border-color: #F1F5F9;">
              <Shield :size="15" class="text-blue-600" />
              <div>
                <span class="text-[8px] font-black text-slate-300 block">ŞİFRE VE YEDEK ALAN GÜVENLİĞİ</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Güvenlik</h3>
              </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Form left -->
              <div class="lg:col-span-2 space-y-4">
                <h4 class="text-xs font-bold text-slate-800">Şifre Yönetimi</h4>
                <p class="text-[10px] text-slate-400 leading-normal">
                  Hesabınızı korumak için güçlü bir şifre kullanın. Güncellemeden sonra yeni şifreyle giriş gerekir ve diğer oturumlar sonlandırılır.
                </p>

                <div class="space-y-3">
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Mevcut Şifre</label>
                    <div class="relative">
                      <input 
                        v-model="currentPassword"
                        :type="showPassword1 ? 'text' : 'password'" 
                        placeholder="••••••••" 
                        class="w-full rounded-xl border pl-4 pr-10 py-2.5 text-xs outline-none bg-white" 
                        style="border-color: #E2E8F0;" 
                      />
                      <button type="button" @click="showPassword1 = !showPassword1" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <Eye :size="14" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Yeni Şifre</label>
                    <div class="relative">
                      <input 
                        v-model="newPassword"
                        :type="showPassword2 ? 'text' : 'password'" 
                        placeholder="••••••••" 
                        class="w-full rounded-xl border pl-4 pr-10 py-2.5 text-xs outline-none bg-white" 
                        style="border-color: #E2E8F0;" 
                      />
                      <button type="button" @click="showPassword2 = !showPassword2" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <Eye :size="14" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Yeni Şifre Tekrar</label>
                    <div class="relative">
                      <input 
                        v-model="newPasswordConfirm"
                        :type="showPassword3 ? 'text' : 'password'" 
                        placeholder="••••••••" 
                        class="w-full rounded-xl border pl-4 pr-10 py-2.5 text-xs outline-none bg-white" 
                        style="border-color: #E2E8F0;" 
                      />
                      <button type="button" @click="showPassword3 = !showPassword3" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <Eye :size="14" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-2">
                  <button 
                    type="button" 
                    @click="updatePassword"
                    class="rounded-xl font-bold text-xs px-6 py-3 transition"
                    :class="isPasswordFormValid ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
                    :disabled="!isPasswordFormValid"
                  >
                    Şifreyi Güncelle
                  </button>
                  <span class="text-[9px] text-slate-400 font-bold">
                    {{ isPasswordFormValid ? 'Şifre güncellenmeye hazır!' : 'Yeni ve mevcut şifreleri giriniz' }}
                  </span>
                </div>
              </div>

              <!-- Rules right -->
              <div class="p-4 rounded-xl bg-slate-50 border space-y-2 text-[9px] font-bold text-slate-500" style="border-color: #F1F5F9;">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">ŞİFRE GÜCÜ</span>
                <span class="text-[9px] font-black text-slate-600 block border-b pb-1">
                  {{ rulesMetCount }}/8 Kriter Karşılandı
                </span>
                <div class="space-y-1.5 mt-2">
                  <div class="flex items-center gap-1.5" :class="ruleLength ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleLength" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    En az 10 karakter
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleCase ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleCase" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Büyük/küçük harf
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleDigit ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleDigit" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Rakam
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleSpecial ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleSpecial" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Özel karakter
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleNoPattern ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleNoPattern" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Yaygın parola, tekrar eden örüntü olmaması
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleNoSpace ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleNoSpace" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Boşluk içermemesi
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleNotOld ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleNotOld" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Önceki şifreyle aynı olmaması
                  </div>
                  <div class="flex items-center gap-1.5" :class="ruleMatch ? 'text-emerald-600' : 'text-slate-400'">
                    <Check v-if="ruleMatch" :size="10" />
                    <span v-else class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> 
                    Yeni şifre eşleşiyor
                  </div>
                </div>
              </div>
            </div>

            <!-- E-posta 2FA -->
            <div class="rounded-xl border bg-amber-50/10 p-5 space-y-3" style="border-color: #FDE68A;">
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1 text-[8px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">2FA</span>
                <span class="text-[9px] font-black uppercase" :class="companyForm.is2FaEnabled ? 'text-emerald-700' : 'text-amber-700'">
                  {{ companyForm.is2FaEnabled ? '🟢 ETKİN' : '🟠 DEVRE DIŞI' }}
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-800 mt-1">E-posta ile İki Aşamalı Doğrulama</h4>
              <p class="text-[10px] text-slate-500 leading-normal">
                Giriş ve hassas işlemler için e-posta adresinize 6 haneli doğrulama kodu gönderilir.
              </p>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-amber-200 text-[10px] font-bold">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">Durum:</span>
                  <span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100" v-if="companyForm.is2FaEnabled">Etkin</span>
                  <span class="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100" v-else>Devre Dışı</span>
                  <span class="text-slate-500">Aktif/Kayıtlı e-posta: alituran88@gmail.com</span>
                </div>
                <button type="button" @click="toggle2FA" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs transition">
                  {{ companyForm.is2FaEnabled ? 'Devre Dışı Bırak' : '2FA Etkinleştir' }}
                </button>
              </div>
            </div>

            <!-- Active Sessions list -->
            <div class="space-y-3 pt-4 border-t" style="border-color: #F1F5F9;">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Aktif Oturumlar</h4>
                  <p class="text-[9px] text-slate-400">Hesabınızın açık olduğu cihazları yönetin.</p>
                </div>
                <div class="flex gap-2">
                  <button type="button" @click="terminateOtherSessions" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50" style="border-color: #E2E8F0;">Diğer cihazlardan çıkış</button>
                  <button type="button" @click="logout" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold text-red-600 bg-white hover:bg-red-50 border-red-200">Çıkış Yap</button>
                </div>
              </div>

              <div class="space-y-2">
                <div 
                  v-for="s in sessions" 
                  :key="s.id"
                  class="rounded-xl border p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" 
                  style="border-color: #E2E8F0;"
                >
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Laptop :size="15" /></div>
                    <div>
                      <h5 class="text-xs font-bold text-slate-800">
                        {{ s.device }} 
                        <span v-if="s.isCurrent" class="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black ml-1.5">BU CİHAZ</span>
                      </h5>
                      <p class="text-[9px] text-slate-400 mt-0.5">Son aktif: {{ s.lastActive }} · IP: {{ s.ip }}</p>
                    </div>
                  </div>
                  <button type="button" @click="closeSession(s.id)" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100" style="border-color: #E2E8F0;">Oturumu Kapat</button>
                </div>
              </div>

              <p class="text-[9px] text-slate-400 leading-normal">
                <strong>Not:</strong> Bu listedeki cihaz hareketleri ve konumlar güvenlik kayıtlarına dayanır; her girişle anında güncellenir.
              </p>
            </div>

            <!-- Security History Logs -->
            <div class="space-y-3 pt-4 border-t" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Güvenlik Geçmişi</h4>
              <p class="text-[9px] text-slate-400">Hesabınızdaki güvenlik olayları.</p>
              <div class="rounded-xl border bg-slate-50 p-4 space-y-4" style="border-color: #E2E8F0;">
                <div class="p-3 bg-red-50/50 border border-red-200 text-red-800 text-[10px] font-bold rounded-lg">
                  Kritik olaylar (son 2FA kapatma, toplu çıkış, şifre değişimi) güvenlik loguna eklenmektedir.
                </div>
                
                <div class="flex items-center gap-3">
                  <select v-model="filterDays" class="rounded-lg border px-3 py-1.5 text-xs bg-white" style="border-color: #E2E8F0;">
                    <option value="30">Son 30 gün</option>
                    <option value="90">Son 90 gün</option>
                  </select>
                  <select v-model="filterType" class="rounded-lg border px-3 py-1.5 text-xs bg-white" style="border-color: #E2E8F0;">
                    <option value="Tümü">Tümü</option>
                    <option value="Şifre">Şifre Olayları</option>
                    <option value="Cihaz">Cihaz Girişleri</option>
                  </select>
                </div>

                <div 
                  v-for="log in filteredLogs" 
                  :key="log.id"
                  class="p-3 bg-white border rounded-lg flex items-center justify-between text-[10px] text-slate-600 transition" 
                  style="border-color: #E2E8F0;"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black">LOG</span>
                    <span class="font-bold text-slate-700">{{ log.title }}</span>
                  </div>
                  <div class="flex gap-4 font-bold text-slate-500">
                    <span>{{ log.time }}</span>
                    <span class="text-emerald-600">🟢 {{ log.status }}</span>
                    <span>{{ log.device }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tercihler Card -->
          <div id="tercihler" class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2.5 pb-2 border-b" style="border-color: #F1F5F9;">
              <Sliders :size="15" class="text-blue-600" />
              <div>
                <span class="text-[8px] font-black text-slate-300 block">UYGULAMA TERCİHLERİ</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Tercihler</h3>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 leading-normal">Görünüm, dil ve saat biçimi tercihlerinizi kişiselleştirin.</p>
            
            <!-- Theme grids -->
            <div class="space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Tema değişikliği yalnızca görünümü sembolize eder</span>
              <div class="grid grid-cols-3 gap-4">
                <button 
                  type="button" 
                  @click="activeTheme = 'sistem'; showToast('Sistem teması aktif edildi.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm"
                  :style="activeTheme === 'sistem' ? 'border-color: #2563EB; background: rgba(37,99,235,0.05); color: #2563EB;' : 'border-color: #E2E8F0;'"
                >
                  <Laptop :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Sistem</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'acik'; showToast('Açık renk şeması yüklendi.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm"
                  :style="activeTheme === 'acik' ? 'border-color: #2563EB; background: rgba(37,99,235,0.05); color: #2563EB;' : 'border-color: #E2E8F0;'"
                >
                  <Camera :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Açık</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'koyu'; showToast('Koyu (Karanlık) tema seçildi.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm"
                  :style="activeTheme === 'koyu' ? 'border-color: #2563EB; background: rgba(37,99,235,0.05); color: #2563EB;' : 'border-color: #E2E8F0;'"
                >
                  <Video :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Koyu</span>
                </button>
              </div>
            </div>

            <!-- Form dropdowns -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Dil</label>
                <select v-model="selectedLanguage" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="Türkçe">🇹🇷 Türkçe</option>
                  <option value="English">🇺🇸 English</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Formatı</label>
                <select v-model="timeFormat" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="24 saat">24 saat</option>
                  <option value="12 saat">12 saat</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Dilimi</label>
                <select v-model="timezone" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="Europe/Istanbul (GMT+3)">Europe/Istanbul (GMT+3)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2 justify-end pt-2">
              <button type="button" @click="resetPreferences" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">Varsayılanlara Sıfırla</button>
              <button type="button" @click="savePreferences" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 transition shadow">Tercihleri kaydet</button>
            </div>
          </div>

          <!-- Bildirim Tercihleri Card -->
          <div id="bildirim-tercihleri" class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between pb-2 border-b" style="border-color: #F1F5F9;">
              <div class="flex items-center gap-2.5">
                <Bell :size="15" class="text-blue-600" />
                <div>
                  <span class="text-[8px] font-black text-slate-300 block">BİLDİRİM TERCİHLERİ</span>
                  <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Bildirim Tercihleri</h3>
                </div>
              </div>
              <button type="button" @click="notifyMail = true; notifySms = true; notifyBrowser = true; showToast('Tüm alıcı bildirimleri açıldı.')" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100" style="border-color: #E2E8F0;">
                Alıcı Bildirimlerini Al
              </button>
            </div>
            <p class="text-[10px] text-slate-400 leading-normal">
              E-posta, uygulama içi ve anlık bildirim tercihlerinizi yönetin.
            </p>
            <div class="p-4 rounded-xl bg-slate-50 border text-[10px] text-slate-400 text-center" style="border-color: #E2E8F0;">
              Bildirim kanalları, sessiz saatler ve kategori tercihleri için bir ekrandan yönetilir.
            </div>
          </div>

          <!-- Sözleşmeler & Onaylar Card -->
          <div id="profil-kaynagi" class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2.5 pb-2 border-b" style="border-color: #F1F5F9;">
              <FileText :size="15" class="text-blue-600" />
              <div>
                <span class="text-[8px] font-black text-slate-300 block">YASAL ONAYLAR VE KVKK</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Sözleşmeler & Onaylar</h3>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 leading-normal">Onay yönetimi, sözleşme metinleri ve KVKK veri talepleri.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="agreement in [
                  'Platform Abonelik ve Kullanım Sözleşmesi',
                  'Ticari Elektronik İleti ve İletişim Açık Rıza Beyanı',
                  'Ticari İletişim ve Pazarlama Açık Rızası',
                  'Dijital Varlıklar ve Görsel Verilerin İşlenmesi Açık Rızası',
                  'Kişisel Verilerin Yurt Dışı Aktarımı Açık Rızası',
                  'Diğer Verilerin İşlenmesi Açık Rızası',
                  'Profil Kalite Skoru ve İstatistiksel Analiz Açık Rızası',
                  'ACISCO B2B ELEKTRONİK TİCARET PLATFORMU ANA SÖZLEŞMESİ'
                ]"
                :key="agreement"
                class="rounded-xl border p-4 bg-slate-50/50 flex flex-col justify-between h-28 border-slate-200 transition hover:border-slate-300"
              >
                <span class="text-[10px] font-bold text-slate-700 leading-normal block">{{ agreement }}</span>
                <div class="flex items-center justify-between text-[10px] font-bold mt-2">
                  <button 
                    type="button"
                    @click="toggleConsent(agreement)"
                    class="flex items-center gap-1.5"
                    :class="consents[agreement] ? 'text-emerald-600' : 'text-slate-400'"
                  >
                    <CheckCircle2 :size="12" />
                    <span>{{ consents[agreement] ? 'Onaylandı' : 'Onay Bekliyor' }}</span>
                  </button>
                  <button type="button" @click="openAgreement(agreement)" class="text-blue-600 hover:underline">Sözleşmeyi Oku</button>
                </div>
              </div>
            </div>

            <!-- KVKK Request form -->
            <div class="space-y-4 pt-4 border-t" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Veri Talebi Oluştur (KVKK)</h4>
              <p class="text-[9px] text-slate-400">Kimlik veya kişisel verilerinizin korunması kanunu kapsamında veri erişim, silme, düzeltme taleplerinizi oluşturabilirsiniz. Talepleriniz 30 gün içinde yanıtlanacaktır.</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Talep Türü</label>
                  <select v-model="kvkkRequestType" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                    <option value="Veri Erişim Talebi">Veri Erişim Talebi</option>
                    <option value="Veri Silme Talebi">Veri Silme Talebi</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Açıklama</label>
                  <textarea 
                    v-model="kvkkDescription"
                    rows="3" 
                    placeholder="Talebinizi detaylı açıklamasıyla yazın..."
                    class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-white focus:border-blue-500 transition"
                    style="border-color: #E2E8F0;"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  @click="submitKvkk"
                  class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition shadow"
                >
                  Talep Gönder
                </button>
              </div>

              <div v-if="kvkkSuccess" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl mt-3 flex items-center gap-1.5">
                <CheckCircle2 :size="14" /> Talebiniz başarıyla alınmıştır. En kısa sürede işleme konulacaktır.
              </div>
            </div>
          </div>

          <!-- 🟢 ÜYELİK VE HESAP İPTALİ / KVKK CARD -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-5" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between pb-3 border-b" style="border-color: #F1F5F9;">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-red-50 text-red-600">
                  <ShieldAlert :size="18" />
                </div>
                <div>
                  <span class="text-[9px] font-black text-red-500 tracking-wider block uppercase">GÜVENLİK & AYRILMA</span>
                  <h3 class="text-sm font-black text-slate-800">Üyelik ve Hesap İptali</h3>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Hesap Durumu: Aktif
              </span>
            </div>
            
            <p class="text-xs text-slate-500 leading-relaxed">
              İhaleciBurada.com üyeliğinizi veya kurumsal hesabınızı dilediğiniz an tek tıkla iptal edebilirsiniz. İptal işlemi sonrasında aktif ihaleleriniz sonlandırılır ve verileriniz 6698 sayılı KVKK kapsamında arşivlenir/silinir.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Oturumu Kapat</h4>
                  <p class="text-[10px] text-slate-400 mt-1">Bu cihazdaki mevcut oturumunuzu güvenli bir şekilde sonlandırır.</p>
                </div>
                <button type="button" @click="logout" class="mt-4 rounded-xl border px-3 py-2 text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5" style="border-color: #CBD5E1;">
                  <LogOut :size="13" /> Oturumu Sonlandır
                </button>
              </div>

              <div class="p-4 rounded-xl bg-red-50/60 border border-red-200 flex flex-col justify-between">
                <div>
                  <h4 class="text-xs font-bold text-red-900">Üyeliğimi Kalıcı Olarak İptal Et</h4>
                  <p class="text-[10px] text-red-700/80 mt-1">Hesabınızı, kurumsal firma profilinizi ve aboneliğinizi tamamen iptal eder.</p>
                </div>
                <button type="button" @click="isDeleteModalOpen = true" class="mt-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 transition shadow-xs flex items-center justify-center gap-1.5">
                  <Trash2 :size="13" /> Üyelik İptali Başlat
                </button>
              </div>
            </div>
          </div>

        </div>

    </div>

    <!-- 1. Sözleşme Detay Modalı (Modal System) -->
    <div v-if="selectedAgreement" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border text-left shadow-2xl relative">
        <button type="button" @click="closeAgreement" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X :size="16" />
        </button>

        <h3 class="text-sm font-black text-slate-800 pr-8">{{ selectedAgreement.title }}</h3>
        <div class="max-h-60 overflow-y-auto text-xs leading-relaxed text-slate-500 pr-2 border-y py-3" style="border-color: #F1F5F9;">
          {{ selectedAgreement.content }}
        </div>

        <div class="flex justify-end gap-2 text-xs font-bold pt-2">
          <button type="button" @click="closeAgreement" class="rounded-xl border px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700">Kapat</button>
          <button type="button" @click="consents[selectedAgreement.title] = true; closeAgreement(); showToast('Sözleşme onaylandı.')" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 transition">Onayla</button>
        </div>
      </div>
    </div>

    <!-- 2. Üyelik & Hesap İptali Güvenlik Modalı (Modal System) -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border text-left shadow-2xl relative">
        <button type="button" @click="isDeleteModalOpen = false" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X :size="16" />
        </button>

        <div class="flex items-center gap-2.5 text-red-600 border-b pb-3" style="border-color: #F1F5F9;">
          <ShieldAlert :size="22" />
          <div>
            <h3 class="text-sm font-black uppercase text-slate-800">Üyelik ve Hesap İptali</h3>
            <p class="text-[10px] text-slate-400 font-medium">Bu işlem geri alınamaz ve tüm aktif ihaleleriniz durdurulur.</p>
          </div>
        </div>

        <!-- İptal Nedeni -->
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Ayrılma / İptal Nedeni *</label>
          <select class="w-full rounded-xl border px-3 py-2.5 text-xs bg-slate-50 outline-none font-medium text-slate-700" style="border-color: #E2E8F0;">
            <option value="1">Yeterli teklif alamadım / Tasarruf oranından memnun kalmadım</option>
            <option value="2">Farklı bir B2B platformuna geçiş yapıyorum</option>
            <option value="3">Geçici olarak satın alma süreçlerimizi durdurduk</option>
            <option value="4">Firma faaliyetimiz veya departmanımız kapandı</option>
            <option value="5">Diğer / Kişisel tercih</option>
          </select>
        </div>

        <!-- Geri Bildirim Notu -->
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Görüş veya Öneriniz (Opsiyonel)</label>
          <textarea rows="2" placeholder="Hizmetimizi geliştirmemiz için deneyiminizi paylaşabilirsiniz..." class="w-full rounded-xl border px-3 py-2 text-xs bg-slate-50 outline-none resize-none" style="border-color: #E2E8F0;"></textarea>
        </div>

        <!-- Şifre Doğrulama -->
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Onay İçin Hesap Şifreniz *</label>
          <input v-model="deletePassword" type="password" placeholder="••••••••" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none focus:border-red-500" style="border-color: #E2E8F0;" />
        </div>

        <!-- KVKK Onay Kutusu -->
        <div class="flex items-start gap-2 pt-1">
          <input type="checkbox" id="kvkkDeleteCheck" checked class="mt-0.5 h-4 w-4 rounded text-red-600 border-slate-300" />
          <label for="kvkkDeleteCheck" class="text-[10px] text-slate-500 leading-tight">
            Hesabımın, teklif geçmişimin ve kurumsal verilerimin 6698 sayılı KVKK kapsamında kalıcı olarak silinmesini / anonimleştirilmesini onaylıyorum.
          </label>
        </div>

        <div class="flex justify-end gap-2 text-xs font-bold pt-3 border-t" style="border-color: #F1F5F9;">
          <button type="button" @click="isDeleteModalOpen = false" class="rounded-xl border px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700">Vazgeç</button>
          <button type="button" @click="confirmAccountDelete" class="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 transition shadow font-black">Üyeliğimi Kalıcı Olarak İptal Et</button>
        </div>
      </div>
    </div>

    <!-- 3. Yeni Adres Ekleme Modalı (Modal System) -->
    <div v-if="isNewAddressModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border text-left shadow-2xl relative">
        <button type="button" @click="isNewAddressModalOpen = false" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X :size="16" />
        </button>

        <h3 class="text-sm font-black text-slate-800 pr-8">Yeni Adres Ekle</h3>
        
        <div class="space-y-4">
          <!-- Adres Tipi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Adres Tipi</label>
            <div class="flex items-center gap-4">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                <input type="radio" v-model="newAddressForm.type" value="teslimat" class="text-blue-600 focus:ring-blue-500" />
                Teslimat Adresi
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                <input type="radio" v-model="newAddressForm.type" value="fatura" class="text-blue-600 focus:ring-blue-500" />
                Fatura Adresi
              </label>
            </div>
          </div>

          <!-- Adres Başlığı -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Adres Başlığı *</label>
            <input v-model="newAddressForm.title" type="text" placeholder="Örn: Merkez Depo, Fabrika, Şube" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- İl -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">İl *</label>
              <input v-model="newAddressForm.city" type="text" placeholder="Örn: Çanakkale" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
            </div>

            <!-- İlçe -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">İlçe *</label>
              <input v-model="newAddressForm.district" type="text" placeholder="Örn: Merkez" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Mahalle -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Mahalle</label>
              <input v-model="newAddressForm.zip" type="text" placeholder="Örn: İsmet Paşa Mah." class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
            </div>
            
            <!-- Posta Kodu -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Posta Kodu</label>
              <input v-model="newAddressForm.zip" type="text" placeholder="Örn: 17100" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
            </div>
          </div>

          <!-- Açık Adres -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Açık Adres *</label>
            <textarea v-model="newAddressForm.address" rows="3" placeholder="Sokak, bina no, daire no..." class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none resize-none" style="border-color: #E2E8F0;"></textarea>
          </div>

          <!-- Varsayılan Yap -->
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="newAddressForm.isDefault" id="isDefaultAddr" class="h-4.5 w-4.5 rounded text-blue-600 border-slate-300" />
            <label for="isDefaultAddr" class="text-xs font-bold text-slate-600 cursor-pointer">Bu adresi varsayılan olarak ayarla</label>
          </div>
        </div>

        <div class="flex justify-end gap-2 text-xs font-bold pt-2">
          <button type="button" @click="isNewAddressModalOpen = false" class="rounded-xl border px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700">İptal</button>
          <button type="button" @click="addAddress" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 transition shadow">Adresi Kaydet</button>
        </div>
      </div>
    </div>

  </div>
</template>
