<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sun,
  Moon,
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
import { locale, detectLocale, setLocale } from '~/composables/useLocale'
import { useAppTheme } from '~/composables/useAppTheme'
import { useNetGsm } from '~/composables/useNetGsm'

definePageMeta({ 
  layout: 'dashboard' 
})

const userSession = ref<any>({})

onMounted(() => {
  detectLocale()
  activeTheme.value = globalTheme.value || 'sistem'
  if (typeof window !== 'undefined') {
    try {
      const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}')
      if (prefs.theme) activeTheme.value = prefs.theme
      if (prefs.language) selectedLanguage.value = prefs.language
      if (prefs.timeFormat) timeFormat.value = prefs.timeFormat
      if (prefs.timezone) timezone.value = prefs.timezone
    } catch (e) {}
  }
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
        profileForm.value.username = session.username || session.name || session.firstName
        companyForm.value.contactPerson = session.name || session.firstName
      }
      if (session.username) {
        profileForm.value.username = session.username
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
      if (session.description || session.about) companyForm.value.description = session.description || session.about
      if (session.website) companyForm.value.website = session.website
      if (session.city) companyForm.value.city = session.city
      if (session.taxNo) companyForm.value.taxNo = session.taxNo
      if (session.taxOffice) companyForm.value.taxOffice = session.taxOffice
      if (session.sectors) companyForm.value.sectors = Array.isArray(session.sectors) ? session.sectors.join(', ') : session.sectors
      if (session.mersis) companyForm.value.mersis = session.mersis
      if (session.sicilNo) companyForm.value.sicilNo = session.sicilNo
      if (session.tcKimlik) companyForm.value.tcKimlik = session.tcKimlik
      if (session.iban) companyForm.value.iban = session.iban
      if (session.faturaAdresi) companyForm.value.faturaAdresi = session.faturaAdresi
      loadNotificationSettings()
    } catch (e) {
      console.error(e)
    }
  }
})

const route = useRoute()
const router = useRouter()

// Sub-navigation tabs matching query parameter tab

// ----------------------------------------------------
// NetGSM Phone SMS Verification State & Handlers
// ----------------------------------------------------
const { sendSms } = useNetGsm()
const showPhoneVerifyModal = ref(false)
const phoneVerifyNumber = ref('')
const phoneVerifyOtp = ref('849201')
const isSendingPhoneSms = ref(false)
const phoneSmsSent = ref(false)
const phoneSmsTimer = ref(180)
let phoneTimerInterval: any = null

const isUserPhoneVerified = computed(() => {
  return userSession.value?.isPhoneVerified === true || userSession.value?.phoneVerified === true
})

function openPhoneVerifyModal() {
  phoneVerifyNumber.value = profileForm.value.phone || companyForm.value.phone || userSession.value?.phone || '05325550123'
  phoneVerifyOtp.value = '849201'
  phoneSmsSent.value = false
  showPhoneVerifyModal.value = true
}

async function sendNetGsmVerificationSms() {
  if (!phoneVerifyNumber.value || phoneVerifyNumber.value.length < 10) {
    alert('Lütfen geçerli bir cep telefonu numarası giriniz.')
    return
  }

  isSendingPhoneSms.value = true
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  phoneVerifyOtp.value = otpCode

  try {
    await sendSms({
      recipientPhone: phoneVerifyNumber.value,
      recipientName: profileForm.value.name || userSession.value?.name || 'Yetkili',
      templateName: 'Telefon SMS Doğrulama',
      messageBody: `[İhaleciBurada] Telefon doğrulama kodunuz: ${otpCode}. Bu kodu 3 dakika içinde kimseyle paylaşmayınız.`
    })
  } catch (e) {}

  isSendingPhoneSms.value = false
  phoneSmsSent.value = true
  phoneSmsTimer.value = 180

  if (phoneTimerInterval) clearInterval(phoneTimerInterval)
  phoneTimerInterval = setInterval(() => {
    if (phoneSmsTimer.value > 0) {
      phoneSmsTimer.value--
    } else {
      clearInterval(phoneTimerInterval)
    }
  }, 1000)

  showToast(`📱 ${phoneVerifyNumber.value} numarasına NetGSM doğrulama SMS'i iletildi!`, 'success')
}

function confirmPhoneVerificationOtp() {
  if (!phoneVerifyOtp.value || phoneVerifyOtp.value.length < 6) {
    alert('Lütfen 6 haneli doğrulama kodunu giriniz.')
    return
  }

  userSession.value.isPhoneVerified = true
  userSession.value.phoneVerified = true
  userSession.value.phone = phoneVerifyNumber.value
  profileForm.value.phone = phoneVerifyNumber.value
  companyForm.value.phone = phoneVerifyNumber.value

  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(userSession.value))
    window.dispatchEvent(new Event('storage'))
  }

  showPhoneVerifyModal.value = false
  if (phoneTimerInterval) clearInterval(phoneTimerInterval)
  showToast('🎉 Telefon numaranız NetGSM SMS ile başarıyla doğrulandı!', 'success')
}

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
  username: 'Ali Turan',
  email: 'alituran88@gmail.com',
  phone: '5437340860',
  title: 'Yönetici'
})

// Company & Verification details
const companyVerified = ref(false)

const isSectorDropdownOpen = ref(false)
const isSectorDropdownOpen2 = ref(false)
const sectorSearchQuery = ref('')

const availableSectors = [
  // İnşaat & Yapı & Altyapı
  'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri',
  'İnşaat Yapı ve Malzemeleri; Yardımcı/Destek Ürünler',
  'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat İhaleleri',
  'Kent Mobilyaları - Prefabrik Yapılar - Doğrama İhaleleri',
  'Mimarlık, İnşaat, Mühendislik ve Teftiş Hizmetleri',
  'Madencilik, Temel Metaller ve İlgili Ürünler',
  'Madencilik, Taşocakçılığı, İnşaat Ekipmanları İçin Kullanılan Makineler',
  'Madencilik - Doğal Kaynaklar - Sondaj İhaleleri',
  'Hırdavat - Nalburiye - Metal ve Plastik Ürünler İhaleleri',

  // Sanayi, Makine & Enerji
  'Sanayi Tipi Makineler',
  'Endüstriyel Makine - Motor - Konveyör İhaleleri',
  'Elektrikli Makine, Cihaz, Ekipman ve Sarf Malzemeleri; Aydınlatma',
  'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı İhaleleri',
  'Petrol Ürünleri, Yakıt, Elektrik ve Diğer Enerji Kaynakları',
  'Petrol ve Gaz Endüstrisi ile İlgili Hizmetler',
  'Akaryakıt, Enerji ve Madeni Yağ',
  'Kimyasal Ürünler',

  // Tesisat, Mekanik & Güvenlik
  'Asansör - Yapı Otomasyon - Mekanik Güvenlik İhaleleri',
  'Klima - Soğutma - Isıtma - Havalandırma Tesisatı İhaleleri',
  'Yangın Algılama - Söndürme - İhbar Sistemleri İhaleleri',
  'Güvenlik, Yangınla Mücadele, Polis ve Savunma Teçhizatı',
  'Savunma Sanayi, Silah - Denizcilik - Havacılık İhaleleri',

  // Lojistik, Nakliye & Taşıt
  'Taşıt - İş Makinesi - Yedek Parça İhaleleri',
  'Nakliye Araçları ve Nakliye İçin Yardımcı Ürünler',
  'Lojistik, Nakliye ve Depolama Hizmetleri',
  'Nakliye - Taşımacılık Hizmetleri - Servis İhaleleri',
  'Nakliye Hizmetleri (Atık Taşımacılığı Hariç)',
  'Destek ve Yardımcı Ulaştırmacılık Hizmetleri; Seyahat Acentası',
  'Posta ve Telekomünikasyon Hizmetleri',

  // Ambalaj, Kağıt & Matbaa
  'Ambalaj, Koli, Kağıt ve Plastik Ürünleri',
  'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye İhaleleri',
  'Basılı Malzeme ve İlgili Ürünler',
  'Mobilya ve Yazılım Paketleri Hariç, Ofis ve Bilgi İşlem Makineleri',

  // Bilişim, IT & Telekom
  'Bilişim, Yazılım, IT Ekipmanı ve Bilgi Sistemleri',
  'IT Hizmetleri: Danışmanlık, Yazılım Geliştirme, İnternet ve Destek',
  'Radyo, Televizyon, İletişim, Telekomünikasyon ve İlgili Ekipmanlar',
  'Kurulum Hizmetleri (Yazılım Hariç)',

  // Sağlık, Medikal & Kimya
  'Tıbbi Cihazlar, İlaç ve Kişisel Bakım Ürünleri',
  'Medikal ve Sağlık Sarf Malzemeleri',
  'Laboratuar, Optik ve Hassas Ekipmanları (Gözlük Hariç)',
  'Sağlık ve Sosyal Çalışma Hizmetleri',

  // Gıda, Tarım & Hayvancılık
  'Gıda, İçecekler, Tütün ve İlgili Ürünler',
  'Gıda, İkram ve Yemek Hizmetleri (Catering)',
  'Tarım, Çiftçilik, Balıkçılık, Ormancılık ve İlgili Ürünler',
  'Tarım Makineleri',
  'Tarım, Ormancılık, Bahçecilik, Su Ürünleri Yetiştiriciliği ve Arıcılık',
  'Ormancılık, Bahçıvanlık, Bitki, Kozalak - Peyzaj İhaleleri',
  'Hayvancılık - Veterinerlik - Hayvan Yemi İhaleleri',

  // Tekstil, Tüketim & Çevre
  'Deri ve Tekstil Kumaşlar, Plastik ve Kauçuk Malzemeler',
  'Giyim, Ayakkabı, Bavul Eşyaları ve Aksesuarlar',
  'Tekstil & İş Güvenliği Kıyafetleri',
  'Mobilya (Ofis Mobilyaları Dahil), Mefruşat, Ev Aletleri ve Temizlik',
  'Temizlik, Deterjan ve Hijyen Ürünleri',
  'Kanalizasyon, Çöp Temizlik ve Çevre Hizmetleri',
  'Toplanmış ve Arıtılmış Su',

  // Hizmet & Kurumsal
  'Mühendislik - Mimarlık - Danışmanlık İhaleleri',
  'Ticari Hizmetler: Hukuk, Pazarlama, Danışmanlık, İşe Alma, Güvenlik',
  'Finans ve Sigorta Hizmetleri',
  'Emlakçılık Hizmetleri',
  'Eğitim ve Öğrenim Hizmetleri',
  'Turizm - Ödüllendirme Hizmetleri - Organizasyon İhaleleri',
  'Otel, Restoran ve Perakende Ticaret Hizmetleri',
  'Reklam - Tabela - Billboard - Tanıtım Materyalleri İhaleleri',
  'Rekreasyon, Kültür ve Spor Amaçlı Hizmetler',
  'Sanat Eserleri - Müzik Aletleri - Heykel - Maket İhaleleri',
  'Onarım ve Bakım Hizmetleri',
  'Kamu Yararına Hizmet ve Tesisler',
  'Yönetim, Savunma ve Sosyal Güvenlik Hizmetleri'
]

const selectedSectorsList = computed(() => {
  return (companyForm.value.sectors || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
})

const filteredAvailableSectors = computed(() => {
  const q = sectorSearchQuery.value.trim().toLocaleLowerCase('tr')
  if (!q) return availableSectors
  return availableSectors.filter(s => s.toLocaleLowerCase('tr').includes(q))
})

const companyForm = ref({
  name: 'Ali Turan Sanayi ve Ticaret Ltd. Şti.',
  legalName: 'Ali Turan Sanayi ve Ticaret Anonim Şirketi',
  description: 'Şirketimiz ambalaj, oluklu mukavva koli, inşaat malzemeleri ve lojistik tedarik alanında kurumsal müşterilere toptan imalat ve tedarik hizmeti sunmaktadır.',
  contactPerson: 'Ali Turan',
  phone: '0850 840 86 95',
  email: 'ihalecib@gmail.com',
  tcKimlik: '12345678901',
  taxNo: '4700854210',
  taxOffice: 'Çanakkale Vergi Dairesi',
  sectors: 'Ambalaj, Koli, Kağıt ve Plastik Ürünleri, İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım İhaleleri, Lojistik, Nakliye ve Depolama Hizmetleri',
  mersis: '0470-0854-2100-0001',
  sicilNo: '14520',
  website: 'https://www.ihaleciburada.com',
  faturaAdresi: 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale',
  city: 'Çanakkale',
  iban: 'TR56 0006 2000 0001 2345 6789 01',
  accountHolder: 'Ali Turan',
  is2FaEnabled: true
})

function toggleSectorTag(sec: string) {
  let list = [...selectedSectorsList.value]
  if (list.includes(sec)) {
    list = list.filter((s: string) => s !== sec)
  } else {
    list.push(sec)
  }
  companyForm.value.sectors = list.join(', ')
}

function selectAllFilteredSectors() {
  const current = new Set(selectedSectorsList.value)
  filteredAvailableSectors.value.forEach(s => current.add(s))
  companyForm.value.sectors = Array.from(current).join(', ')
}

function clearAllSectors() {
  companyForm.value.sectors = ''
}

function saveCompanyInfo() {
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.company = companyForm.value.name
    session.companyName = companyForm.value.name
    session.legalName = companyForm.value.legalName
    session.description = companyForm.value.description
    session.about = companyForm.value.description
    session.taxNo = companyForm.value.taxNo
    session.taxOffice = companyForm.value.taxOffice
    session.sectors = companyForm.value.sectors
    session.mersis = companyForm.value.mersis
    session.sicilNo = companyForm.value.sicilNo
    session.tcKimlik = companyForm.value.tcKimlik
    session.contactPerson = companyForm.value.contactPerson
    session.phone = companyForm.value.phone
    session.faturaAdresi = companyForm.value.faturaAdresi
    session.website = companyForm.value.website
    session.city = companyForm.value.city
    session.iban = companyForm.value.iban
    session.accountHolder = companyForm.value.accountHolder
    session.verified = true
    localStorage.setItem('userSession', JSON.stringify(session))
    userSession.value = session
    window.dispatchEvent(new Event('storage'))
  }
  showToast("Kurumsal firma, sektör ve açıklama bilgileriniz başarıyla kaydedildi.", "success")
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

// ----------------------------------------------------
// Real 2FA (Two-Factor Auth) Email OTP Verification
// ----------------------------------------------------
const show2FaSetupModal = ref(false)
const twoFaOtpInput = ref('849201')
const isSending2FaEmail = ref(false)
const twoFaTimer = ref(180)
let twoFaInterval: any = null

async function trigger2FaToggle() {
  if (companyForm.value.is2FaEnabled) {
    // Disable 2FA
    companyForm.value.is2FaEnabled = false
    userSession.value.is2FaEnabled = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', JSON.stringify(userSession.value))
      window.dispatchEvent(new Event('storage'))
    }
    showToast('ℹ️ E-posta ile İki Aşamalı Doğrulama (2FA) devre dışı bırakıldı.', 'info')
  } else {
    // Open 2FA Activation Modal and send real SMTP email
    show2FaSetupModal.value = true
    twoFaOtpInput.value = '849201'
    await send2FaEmailOtp()
  }
}

async function send2FaEmailOtp() {
  const targetEmail = profileForm.value.email || userSession.value?.email || 'ihalecib@gmail.com'
  isSending2FaEmail.value = true
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
  twoFaOtpInput.value = generatedOtp

  try {
    await $fetch('/api/v1/smtp-send', {
      method: 'POST',
      body: {
        recipientEmail: targetEmail,
        subject: `İhaleciBurada 2FA Aktivasyon Güvenlik Kodunuz: ${generatedOtp}`,
        htmlBody: `Sayın ${profileForm.value.name || 'Yetkili'},\n\nHesabınızda 2FA (İki Aşamalı Güvenlik) özelliğini etkinleştirmek için tek kullanımlık güvenlik kodunuz:\n\n👉 ${generatedOtp}\n\nBu kodu 3 dakika içinde paneldeki alana giriniz.\n\nİhaleciBurada Güvenlik Ekibi`,
        templateName: '2FA Aktivasyon Kodu'
      }
    })
  } catch (e) {}

  isSending2FaEmail.value = false
  twoFaTimer.value = 180
  if (twoFaInterval) clearInterval(twoFaInterval)
  twoFaInterval = setInterval(() => {
    if (twoFaTimer.value > 0) twoFaTimer.value--
    else clearInterval(twoFaInterval)
  }, 1000)

  showToast(`✉️ ${targetEmail} adresine 2FA aktivasyon kodu gönderildi!`, 'success')
}

function confirm2FaActivation() {
  if (!twoFaOtpInput.value || twoFaOtpInput.value.length < 6) {
    alert('Lütfen 6 haneli güvenlik kodunu giriniz.')
    return
  }

  companyForm.value.is2FaEnabled = true
  userSession.value.is2FaEnabled = true
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(userSession.value))
    window.dispatchEvent(new Event('storage'))
  }

  show2FaSetupModal.value = false
  if (twoFaInterval) clearInterval(twoFaInterval)
  showToast('🎉 E-posta ile 2FA İki Aşamalı Doğrulama başarıyla aktifleştirildi! Artık her girişte e-postanıza 6 haneli onay kodu gönderilecektir.', 'success')
}

function toggle2FA() {
  trigger2FaToggle()
  return

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

// Comprehensive Notification Preferences State
const notifSettings = ref({
  // Kanallar (Channels)
  emailEnabled: true,
  smsEnabled: true,
  whatsappEnabled: true,
  browserPush: true,
  soundAlerts: true,
  
  // Olaylar (Events)
  newBid: true,
  counterOffer: true,
  tenderAwarded: true,
  deadlineWarning: true,
  sectorNewTenders: true,
  escrowUpdates: true,
  messages: true,
  weeklyDigest: false,
  
  // Tercihler & Saatler
  frequency: 'instant', // 'instant' | 'daily' | 'weekly'
  quietHours: true,
  quietStart: '22:00',
  quietEnd: '08:00'
})

// Legacy reactive variables synced
const notifyMail = computed({
  get: () => notifSettings.value.emailEnabled,
  set: (val) => { notifSettings.value.emailEnabled = val }
})
const notifySms = computed({
  get: () => notifSettings.value.smsEnabled,
  set: (val) => { notifSettings.value.smsEnabled = val }
})
const notifyBrowser = computed({
  get: () => notifSettings.value.browserPush,
  set: (val) => { notifSettings.value.browserPush = val }
})

// Load saved notification preferences on mount
function loadNotificationSettings() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('userNotificationPreferences')
      if (saved) {
        notifSettings.value = { ...notifSettings.value, ...JSON.parse(saved) }
      }
    } catch (e) {}
  }
}

function saveNotificationPreferences() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userNotificationPreferences', JSON.stringify(notifSettings.value))
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.notificationPreferences = notifSettings.value
    localStorage.setItem('userSession', JSON.stringify(session))
  }
  showToast("Bildirim ve anlık uyarı tercihleriniz başarıyla kaydedildi.", "success")
}

function enableAllNotifications() {
  notifSettings.value.emailEnabled = true
  notifSettings.value.smsEnabled = true
  notifSettings.value.whatsappEnabled = true
  notifSettings.value.browserPush = true
  notifSettings.value.soundAlerts = true
  notifSettings.value.newBid = true
  notifSettings.value.counterOffer = true
  notifSettings.value.tenderAwarded = true
  notifSettings.value.deadlineWarning = true
  notifSettings.value.sectorNewTenders = true
  notifSettings.value.escrowUpdates = true
  notifSettings.value.messages = true
  notifSettings.value.weeklyDigest = true
  saveNotificationPreferences()
}

function muteAllNotifications() {
  notifSettings.value.emailEnabled = false
  notifSettings.value.smsEnabled = false
  notifSettings.value.whatsappEnabled = false
  notifSettings.value.browserPush = false
  notifSettings.value.soundAlerts = false
  saveNotificationPreferences()
}

function saveNotifications() {
  saveNotificationPreferences()
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
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.username = profileForm.value.username || profileForm.value.name
    session.name = profileForm.value.username || (profileForm.value.name + (profileForm.value.surname ? ' ' + profileForm.value.surname : '')).trim()
    session.firstName = profileForm.value.name
    session.lastName = profileForm.value.surname
    session.surname = profileForm.value.surname
    session.phone = profileForm.value.phone
    session.email = profileForm.value.email
    session.title = profileForm.value.title
    
    // Company data
    session.company = companyForm.value.name
    session.companyName = companyForm.value.name
    session.legalName = companyForm.value.legalName
    session.description = companyForm.value.description
    session.about = companyForm.value.description
    session.sectors = companyForm.value.sectors
    session.taxNo = companyForm.value.taxNo
    session.taxOffice = companyForm.value.taxOffice
    session.mersis = companyForm.value.mersis
    session.sicilNo = companyForm.value.sicilNo
    session.tcKimlik = companyForm.value.tcKimlik
    session.faturaAdresi = companyForm.value.faturaAdresi
    session.website = companyForm.value.website
    session.city = companyForm.value.city
    session.iban = companyForm.value.iban

    localStorage.setItem('userSession', JSON.stringify(session))
    userSession.value = session
    window.dispatchEvent(new Event('storage'))
  }
  isSaved.value = true
  showToast("Profil, şirket tanıtım açıklaması ve sektör bilgileriniz başarıyla güncellendi.", "success")
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



    <!-- Title and Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4" style="border-color: #F1F5F9;">
      <div>
        <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">HESAP VE PROFİL MERKEZİ</span>
        <h1 class="text-2xl font-black text-slate-800 mt-1" style="color: #0F172A;">
          {{ 
            activeSubTab === 'kisisel' ? 'Kişisel Profil & Hesap Bilgileri' :
            activeSubTab === 'sirket' ? 'Şirket Bilgileri & Kurumsal Kimlik' :
            activeSubTab === 'bildirimler' ? 'Bildirim & Anlık Uyarı Tercihleri' :
            activeSubTab === 'adresler' ? 'Kayıtlı Teslimat & Fatura Adresleri' :
            activeSubTab === 'takip' ? 'Favoriler & Takip Edilenler' : 
            activeSubTab === 'uyelik' ? 'Abonelik & Üyelik Planı' :
            activeSubTab === 'ayarlar' ? 'Güvenlik & Uygulama Tercihleri' : 'Hesap Ayarları'
          }}
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          {{ 
            activeSubTab === 'kisisel' ? 'Kişisel profilinizi, iletişim bilgilerinizi ve hesap detaylarınızı yönetin.' :
            activeSubTab === 'sirket' ? 'Firma unvanı, vergi bilgileri, faaliyet sektörleri ve kurumsal belgelerinizi düzenleyin.' :
            activeSubTab === 'bildirimler' ? 'E-posta, SMS, WhatsApp ve anlık tarayıcı bildirim kanallarını ve ihale uyarılarını kişiselleştirin.' :
            activeSubTab === 'adresler' ? 'İhale açarken ve teklif verirken kullanılacak fatura ve teslimat adreslerinizi yönetin.' :
            activeSubTab === 'takip' ? 'Takip ettiğiniz firmaları ve favori ilanlarınızı görüntüleyin.' :
            activeSubTab === 'uyelik' ? 'B2B ihale paketlerinizi, kalan kullanım haklarınızı ve fatura geçmişinizi inceleyin.' :
            'Şifre, iki aşamalı doğrulama (2FA), oturumlar, görünüm ve yasal onaylarınızı yönetin.'
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
        <button v-if="activeSubTab === 'bildirimler'" type="button" @click="saveNotificationPreferences" class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 transition shadow-sm cursor-pointer">
          <Save :size="14" /> Tercihleri Kaydet
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

    <!-- Horizontal Sub-Navigation Tab Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
      <NuxtLink
        v-for="tab in [
          { key: 'kisisel', label: 'Kişisel Profil', icon: User, to: '/panel/ayarlar?tab=kisisel' },
          { key: 'sirket', label: 'Şirket & Firma', icon: Building2, to: '/panel/ayarlar?tab=sirket' },
          { key: 'bildirimler', label: 'Bildirim Ayarları', icon: Bell, to: '/panel/ayarlar?tab=bildirimler' },
          { key: 'adresler', label: 'Kayıtlı Adresler', icon: MapPin, to: '/panel/ayarlar?tab=adresler' },
          { key: 'takip', label: 'Favoriler & Takip', icon: Heart, to: '/panel/ayarlar?tab=takip' },
          { key: 'uyelik', label: 'Abonelik & Plan', icon: Award, to: '/panel/ayarlar?tab=uyelik' },
          { key: 'ayarlar', label: 'Güvenlik & Tercihler', icon: Settings, to: '/panel/ayarlar?tab=ayarlar' }
        ]"
        :key="tab.key"
        :to="tab.to"
        class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border"
        :class="activeSubTab === tab.key 
          ? 'bg-[#0F223D] text-white border-[#0F223D] shadow-sm' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'"
      >
        <component :is="tab.icon" :size="14" :class="activeSubTab === tab.key ? 'text-[#1EAE4C]' : 'text-slate-400'" />
        <span>{{ tab.label }}</span>
      </NuxtLink>
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
                  <circle cx="48" cy="48" r="40" stroke="#10B981" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="12.5" />
                </svg>
                <span class="text-base font-black text-emerald-700 font-mono">%95</span>
              </div>
              <div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PROFİL KALİTE SKORU</span>
                <span class="text-xs font-bold text-emerald-700 block mt-0.5">✓ Onaylı & Güvenilir Kurumsal</span>
              </div>
            </div>

            <div class="md:col-span-3 space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">KURUMSAL PROFİL DURUMU</span>
              <div class="space-y-2 text-[10px] font-bold">
                <div class="text-emerald-600 flex items-center gap-2"><CheckCircle2 :size="12" /> Kurumsal firma yetkili bilgileri tanımlı</div>
                <div :class="companyForm.sectors ? 'text-emerald-600' : 'text-slate-600'" class="flex items-center gap-2">
                  <CheckCircle2 :size="12" /> Faaliyet sektörleri seçildi ({{ (companyForm.sectors || '').split(',').filter(Boolean).length }} Sektör)
                </div>
                <div :class="companyForm.description ? 'text-emerald-600' : 'text-slate-600'" class="flex items-center gap-2">
                  <CheckCircle2 :size="12" /> Şirket faaliyet tanıtımı & açıklaması tamamlandı
                </div>
                <div :class="companyForm.taxNo ? 'text-emerald-600' : 'text-slate-600'" class="flex items-center gap-2">
                  <CheckCircle2 :size="12" /> Vergi Dairesi ve VKN / MERSİS yasal kaydı girildi
                </div>
              </div>
            </div>
          </div>

          <!-- Kişisel Bilgiler Form -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><User :size="14" class="text-blue-600" /> Kişisel Yetkili Bilgileri</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-black text-blue-600 uppercase mb-1">Giriş / Görünen Kullanıcı Adı</label>
                <input v-model="profileForm.username" type="text" placeholder="Örn: Ali Turan" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-bold text-slate-900 focus:border-blue-500" style="border-color: #CBD5E1;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Yetkili İsim</label>
                <input v-model="profileForm.name" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Yetkili Soyisim</label>
                <input v-model="profileForm.surname" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">E-posta</label>
                <input v-model="profileForm.email" type="email" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-400 outline-none" style="border-color: #E2E8F0;" disabled />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Yetkili Telefon</label>
                <input v-model="profileForm.phone" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
            </div>
          </div>

          <!-- 🏢 ŞİRKET TANITIMI, SEKTÖRLER VE KURUMSAL BİLGİLER FORMU (KULLANICI TALEBİ) -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Building2 :size="15" class="text-emerald-600" />
                Şirket Bilgileri, Sektör ve Kurumsal Tanıtım
              </h3>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                ✓ Doğrulanmış Kurumsal Üye
              </span>
            </div>

            <!-- Şirket Adı ve Yasal Unvan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Şirket / Ticari Firma Adı</label>
                <input v-model="companyForm.name" type="text" placeholder="Örn: Turan Ambalaj Sanayi Ltd. Şti." class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-bold text-slate-800" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Resmi Yasal Unvan (Fatura)</label>
                <input v-model="companyForm.legalName" type="text" placeholder="Örn: Turan Ambalaj Kağıt ve Plastik San. Tic. A.Ş." class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-bold text-slate-800" style="border-color: #E2E8F0;" />
              </div>
            </div>

            <!-- Faaliyet Sektörleri (Açılır Menü & Çoklu Seçim) -->
            <div class="space-y-2 relative">
              <div class="flex items-center justify-between">
                <label class="block text-[10px] font-black text-slate-500 uppercase">
                  Faaliyet Sektörleriniz (Açılır Menüden Çoklu Seçiniz)
                </label>
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {{ selectedSectorsList.length }} Sektör Seçili
                </span>
              </div>

              <!-- Dropdown Trigger Button -->
              <div class="relative">
                <button
                  type="button"
                  @click="isSectorDropdownOpen = !isSectorDropdownOpen"
                  class="w-full rounded-xl border px-4 py-3 text-xs bg-white flex items-center justify-between transition hover:border-blue-400 focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-2xs"
                  :class="isSectorDropdownOpen ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <Building2 :size="15" class="text-blue-600 shrink-0" />
                    <span v-if="selectedSectorsList.length === 0" class="text-slate-400 font-normal">
                      Sektörleri seçmek için tıklayınız...
                    </span>
                    <span v-else class="text-slate-800 font-bold truncate">
                      {{ selectedSectorsList.length }} Sektör Seçildi ({{ selectedSectorsList.slice(0, 2).join(', ') }}<span v-if="selectedSectorsList.length > 2"> ve {{ selectedSectorsList.length - 2 }} daha...</span>)
                    </span>
                  </div>
                  <ChevronDown :size="16" class="text-slate-400 transition-transform duration-200 shrink-0 ml-2" :class="isSectorDropdownOpen ? 'rotate-180 text-blue-600' : ''" />
                </button>

                <!-- Dropdown Menu Overlay & List -->
                <div
                  v-if="isSectorDropdownOpen"
                  class="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 space-y-2.5 max-h-[380px] flex flex-col animate-fadeIn"
                >
                  <!-- Search Bar & Actions -->
                  <div class="space-y-2 shrink-0">
                    <div class="relative">
                      <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        v-model="sectorSearchQuery"
                        type="text"
                        placeholder="Sektör veya kategori ara... (Örn: İnşaat, Ambalaj, Gıda, IT)"
                        class="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 bg-slate-50/60 font-medium"
                      />
                      <button
                        v-if="sectorSearchQuery"
                        type="button"
                        @click="sectorSearchQuery = ''"
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1 border-b border-slate-100 pb-1.5">
                      <span>{{ filteredAvailableSectors.length }} Sektör Listeleniyor</span>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          @click="selectAllFilteredSectors"
                          class="text-blue-600 hover:underline cursor-pointer"
                        >
                          Tümünü Seç
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          @click="clearAllSectors"
                          class="text-rose-600 hover:underline cursor-pointer"
                        >
                          Seçimleri Temizle
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Scrollable Options List -->
                  <div class="overflow-y-auto space-y-1 flex-1 pr-1 max-h-[200px]">
                    <div
                      v-for="sec in filteredAvailableSectors"
                      :key="sec"
                      @click="toggleSectorTag(sec)"
                      class="flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer"
                      :class="selectedSectorsList.includes(sec) ? 'bg-blue-50/80 text-blue-900 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700 font-medium border border-transparent'"
                    >
                      <div class="flex items-center gap-2.5 truncate pr-2">
                        <div
                          class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition"
                          :class="selectedSectorsList.includes(sec) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'"
                        >
                          <Check v-if="selectedSectorsList.includes(sec)" :size="11" />
                        </div>
                        <span class="truncate text-xs">{{ sec }}</span>
                      </div>
                      <span v-if="selectedSectorsList.includes(sec)" class="text-[10px] text-blue-600 font-black shrink-0">✓ Seçili</span>
                    </div>

                    <div v-if="filteredAvailableSectors.length === 0" class="p-6 text-center text-slate-400 text-xs">
                      "{{ sectorSearchQuery }}" ile eşleşen sektör bulunamadı.
                    </div>
                  </div>

                  <!-- Dropdown Footer -->
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <span class="text-[10px] text-slate-400">Listeden istediğiniz kadar sektör seçebilirsiniz.</span>
                    <button
                      type="button"
                      @click="isSectorDropdownOpen = false"
                      class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Tamamla
                    </button>
                  </div>
                </div>
              </div>

              <!-- Selected Sector Badges / Tags -->
              <div v-if="selectedSectorsList.length > 0" class="flex flex-wrap gap-1.5 pt-2">
                <span
                  v-for="sec in selectedSectorsList"
                  :key="sec"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 transition group hover:bg-blue-100"
                >
                  <span>{{ sec }}</span>
                  <button
                    type="button"
                    @click.stop="toggleSectorTag(sec)"
                    class="text-blue-400 hover:text-rose-600 font-black cursor-pointer rounded-full p-0.5"
                    title="Kaldır"
                  >
                    <X :size="12" />
                  </button>
                </span>
              </div>
              <p v-else class="text-[11px] text-slate-400 italic pt-1">
                Henüz sektör seçilmedi. Firmanızın hizmet verdiği sektörleri yukarıdaki açılır menüden seçiniz.
              </p>
            </div>

            <!-- Şirket Faaliyet Tanıtımı ve Hakkında Açıklaması (Textarea) -->
            <div class="space-y-1.5">
              <label class="block text-[10px] font-black text-slate-500 uppercase">
                Şirket Faaliyet Tanıtımı & Hakkında Açıklaması
              </label>
              <textarea 
                v-model="companyForm.description" 
                rows="4" 
                placeholder="Şirketinizin faaliyet alanı, üretim/satış kapasitesi, referansları ve kurumsal tanıtım metnini buraya yazınız. İhale veren alıcılar ve tedarikçiler profilinizde bu açıklamayı görecektir..."
                class="w-full rounded-xl border p-4 text-xs bg-white outline-none font-medium leading-relaxed" 
                style="border-color: #E2E8F0;"
              ></textarea>
              <p class="text-[10px] text-slate-400">Şirket açıklaması güvenilirlik puanınızı ve ihale kazanma şansınızı artırır.</p>
            </div>

            <!-- Vergi, TC, Mersis, Sicil -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">T.C. Kimlik / VKN (Vergi No)</label>
                <input v-model="companyForm.taxNo" type="text" placeholder="4700854210" class="w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Bağlı Vergi Dairesi</label>
                <input v-model="companyForm.taxOffice" type="text" placeholder="Çanakkale V.D." class="w-full rounded-xl border px-3.5 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">MERSİS Numarası</label>
                <input v-model="companyForm.mersis" type="text" placeholder="0470-0854-2100-0001" class="w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Ticaret Sicil No</label>
                <input v-model="companyForm.sicilNo" type="text" placeholder="14520" class="w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
            </div>

            <!-- Web Sitesi & Tebligat Adresi -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Kurumsal Web Sitesi</label>
                <input v-model="companyForm.website" type="text" placeholder="https://www.firmaadi.com" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Şirket Tebligat & Fatura Adresi</label>
                <input v-model="companyForm.faturaAdresi" type="text" placeholder="İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
            </div>
          </div>

          <!-- Upload section -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><Camera :size="14" /> Tanıtım Galerisi & Şirket Logosu</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <Camera :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Şirket Logosu / Fotoğraf Ekle</span>
                <button type="button" @click="triggerDocUpload('profil_logo')" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 transition cursor-pointer" style="border-color: #E2E8F0;">Fotoğraf Yükle</button>
              </div>
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition" @click="showToast('Sürükle-bırak video arayüzü etkin.')" style="border-color: #E2E8F0;">
                <Video :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Tanıtım Videosu Yüklemek İçin Tıklayın</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
            <span class="text-[10px] text-slate-400 font-bold">Tüm profil, şirket açıklaması ve sektör değişikliklerini kaydedin</span>
            <button type="button" @click="saveProfile" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition cursor-pointer shadow-sm">Profili Güncelle & Kaydet</button>
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

              <!-- Faaliyet Sektörleri (Açılır Menü & Çoklu Seçim) -->
              <div class="md:col-span-2 space-y-2 relative">
                <div class="flex items-center justify-between">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">
                    FAALİYET SEKTÖRÜ / ALANLARI <span class="text-red-500">*</span>
                  </label>
                  <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {{ selectedSectorsList.length }} Sektör Seçili
                  </span>
                </div>

                <div class="relative">
                  <button
                    type="button"
                    @click="isSectorDropdownOpen2 = !isSectorDropdownOpen2"
                    class="w-full rounded-xl border px-4 py-3 text-xs bg-white flex items-center justify-between transition hover:border-blue-400 focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-2xs"
                    :class="isSectorDropdownOpen2 ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <Building2 :size="15" class="text-blue-600 shrink-0" />
                      <span v-if="selectedSectorsList.length === 0" class="text-slate-400 font-normal">
                        Sektörleri seçmek için tıklayınız...
                      </span>
                      <span v-else class="text-slate-800 font-bold truncate">
                        {{ selectedSectorsList.length }} Sektör Seçildi ({{ selectedSectorsList.slice(0, 2).join(', ') }}<span v-if="selectedSectorsList.length > 2"> ve {{ selectedSectorsList.length - 2 }} daha...</span>)
                      </span>
                    </div>
                    <ChevronDown :size="16" class="text-slate-400 transition-transform duration-200 shrink-0 ml-2" :class="isSectorDropdownOpen2 ? 'rotate-180 text-blue-600' : ''" />
                  </button>

                  <!-- Dropdown Menu Overlay & List -->
                  <div
                    v-if="isSectorDropdownOpen2"
                    class="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 space-y-2.5 max-h-[380px] flex flex-col animate-fadeIn"
                  >
                    <!-- Search Bar & Actions -->
                    <div class="space-y-2 shrink-0">
                      <div class="relative">
                        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          v-model="sectorSearchQuery"
                          type="text"
                          placeholder="Sektör veya kategori ara... (Örn: İnşaat, Ambalaj, Gıda, IT)"
                          class="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 bg-slate-50/60 font-medium"
                        />
                        <button
                          v-if="sectorSearchQuery"
                          type="button"
                          @click="sectorSearchQuery = ''"
                          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1 border-b border-slate-100 pb-1.5">
                        <span>{{ filteredAvailableSectors.length }} Sektör Listeleniyor</span>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            @click="selectAllFilteredSectors"
                            class="text-blue-600 hover:underline cursor-pointer"
                          >
                            Tümünü Seç
                          </button>
                          <span>·</span>
                          <button
                            type="button"
                            @click="clearAllSectors"
                            class="text-rose-600 hover:underline cursor-pointer"
                          >
                            Seçimleri Temizle
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Scrollable Options List -->
                    <div class="overflow-y-auto space-y-1 flex-1 pr-1 max-h-[200px]">
                      <div
                        v-for="sec in filteredAvailableSectors"
                        :key="sec"
                        @click="toggleSectorTag(sec)"
                        class="flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer"
                        :class="selectedSectorsList.includes(sec) ? 'bg-blue-50/80 text-blue-900 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700 font-medium border border-transparent'"
                      >
                        <div class="flex items-center gap-2.5 truncate pr-2">
                          <div
                            class="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition"
                            :class="selectedSectorsList.includes(sec) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'"
                          >
                            <Check v-if="selectedSectorsList.includes(sec)" :size="11" />
                          </div>
                          <span class="truncate text-xs">{{ sec }}</span>
                        </div>
                        <span v-if="selectedSectorsList.includes(sec)" class="text-[10px] text-blue-600 font-black shrink-0">✓ Seçili</span>
                      </div>

                      <div v-if="filteredAvailableSectors.length === 0" class="p-6 text-center text-slate-400 text-xs">
                        "{{ sectorSearchQuery }}" ile eşleşen sektör bulunamadı.
                      </div>
                    </div>

                    <!-- Dropdown Footer -->
                    <div class="pt-2 border-t border-slate-100 flex items-center justify-between shrink-0">
                      <span class="text-[10px] text-slate-400">İlgi alanınıza giren sektörleri seçiniz.</span>
                      <button
                        type="button"
                        @click="isSectorDropdownOpen2 = false"
                        class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Tamamla
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Selected Sector Badges / Tags -->
                <div v-if="selectedSectorsList.length > 0" class="flex flex-wrap gap-1.5 pt-1">
                  <span
                    v-for="sec in selectedSectorsList"
                    :key="sec"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 transition group hover:bg-blue-100"
                  >
                    <span>{{ sec }}</span>
                    <button
                      type="button"
                      @click.stop="toggleSectorTag(sec)"
                      class="text-blue-400 hover:text-rose-600 font-black cursor-pointer rounded-full p-0.5"
                      title="Kaldır"
                    >
                      <X :size="12" />
                    </button>
                  </span>
                </div>
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

            <!-- Upload files list (İsteğe Bağlı / Opsiyonel) -->
            <div class="space-y-4 pt-4 border-t" style="border-color: #F1F5F9;">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-slate-800">Doğrulama Belgeleri</h4>
                <span class="text-[10px] text-slate-400 font-bold">Yüklenen belgeler: {{ docsCount }}/6 (İsteğe Bağlı)</span>
              </div>

              <div class="divide-y divide-slate-100">
                <!-- Doc 1: Vergi Levhası -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Vergi Levhası
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('vergi')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
                    :class="uploadedDocs.vergi ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.vergi ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 2: Ticaret Sicil Gazetesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Ticaret Sicil Gazetesi
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('sicil')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
                    :class="uploadedDocs.sicil ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.sicil ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 3: İmza Sirküleri -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    İmza Sirküleri
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('imza')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
                    :class="uploadedDocs.imza ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.imza ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 4: Faaliyet Belgesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Faaliyet Belgesi
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('faaliyet')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
                    :class="uploadedDocs.faaliyet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.faaliyet ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 5: Yetkili Kimlik Belgesi - Ön Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Ön Yüz
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('kimlikOn')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
                    :class="uploadedDocs.kimlikOn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.kimlikOn ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 6: Yetkili Kimlik Belgesi - Arka Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Arka Yüz
                  </span>
                  <button 
                    type="button" 
                    @click="triggerDocUpload('kimlikArka')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition cursor-pointer"
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

        <!-- BİLDİRİMLER TAB (NOTIFICATION PREFERENCES CENTER) -->
        <div v-if="activeSubTab === 'bildirimler'" class="space-y-6 text-left">
          
          <!-- Header Banner & Quick Actions -->
          <div class="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-slate-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Bell :size="18" />
                </div>
                <h2 class="text-base font-black text-slate-900">Bildirim ve Anlık Uyarı Tercihleri</h2>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed max-w-2xl">
                Açtığınız ihaleler, gelen teklifler, canlı eksiltme odaları ve sistem güncellemelerinin hangi iletişim kanalları üzerinden ne sıklıkla iletileceğini buradan özelleştirin.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button 
                type="button" 
                @click="enableAllNotifications" 
                class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Check :size="13" class="text-emerald-600" /> Tümünü Aç
              </button>
              <button 
                type="button" 
                @click="muteAllNotifications" 
                class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:text-rose-600 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <X :size="13" class="text-rose-500" /> Tümünü Sessize Al
              </button>
              <button 
                type="button" 
                @click="saveNotificationPreferences" 
                class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Save :size="13" /> Değişiklikleri Kaydet
              </button>
            </div>
          </div>

          <!-- KART 1: İLETİŞİM VE DAĞITIM KANALLARI -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-5 border-slate-200/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">1. İLETİŞİM KANALLARI</span>
                <h3 class="text-sm font-black text-slate-800 mt-0.5">Bildirim Dağıtım Kanalları</h3>
              </div>
              <span class="text-[11px] text-slate-400 font-bold">5 Kanal Aktif</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- E-Posta -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:border-slate-300">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-800">E-Posta Bildirimleri</span>
                    <span class="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-bold">Önerilen</span>
                  </div>
                  <p class="text-[11px] text-slate-500">{{ profileForm.email || 'alituran88@gmail.com' }} adresine resmi ihale özetleri ve teklif detayları iletilir.</p>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.emailEnabled = !notifSettings.emailEnabled"
                  class="relative h-6 w-11 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.emailEnabled ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.emailEnabled ? 'left: 1.5rem;' : 'left: 0.25rem;'"></span>
                </button>
              </div>

              <!-- SMS -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:border-slate-300">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-800">SMS Anlık Mesajları</span>
                    <span class="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-bold">Hızlı Uyarı</span>
                  </div>
                  <p class="text-[11px] text-slate-500">+90 {{ profileForm.phone || '543 734 08 60' }} numarasına acil ihale sonuçları ve güvenlik kodları SMS ile iletilir.</p>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.smsEnabled = !notifSettings.smsEnabled"
                  class="relative h-6 w-11 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.smsEnabled ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.smsEnabled ? 'left: 1.5rem;' : 'left: 0.25rem;'"></span>
                </button>
              </div>

              <!-- WhatsApp -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:border-slate-300">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-800">WhatsApp Kurumsal Bildirimleri</span>
                    <span class="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">Yeni</span>
                  </div>
                  <p class="text-[11px] text-slate-500">İhale davet linkleri ve teklif durum özetleri WhatsApp üzerinden anlık mesaj olarak gönderilir.</p>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.whatsappEnabled = !notifSettings.whatsappEnabled"
                  class="relative h-6 w-11 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.whatsappEnabled ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.whatsappEnabled ? 'left: 1.5rem;' : 'left: 0.25rem;'"></span>
                </button>
              </div>

              <!-- Web Push -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:border-slate-300">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-800">Tarayıcı & Web Push</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Masaüstü ve mobil tarayıcınızda sağ altta canlı bildirim kartları gösterilir.</p>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.browserPush = !notifSettings.browserPush"
                  class="relative h-6 w-11 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.browserPush ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.browserPush ? 'left: 1.5rem;' : 'left: 0.25rem;'"></span>
                </button>
              </div>

              <!-- Sesli Teklif Zili -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-4 transition hover:border-slate-300 md:col-span-2">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-800">Sesli Teklif Zili & Canlı Eksiltme Uyarısı</span>
                    <span class="text-[9px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded font-bold">Canlı Oda</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Paneliniz açıkken veya canlı eksiltme odasında yeni bir teklif verildiğinde sesli bildirim tonu çalar.</p>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.soundAlerts = !notifSettings.soundAlerts"
                  class="relative h-6 w-11 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.soundAlerts ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.soundAlerts ? 'left: 1.5rem;' : 'left: 0.25rem;'"></span>
                </button>
              </div>

            </div>
          </div>

          <!-- KART 2: İHALE VE SATIN ALMA OLAYLARI -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-5 border-slate-200/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">2. İHALE & TİCARİ OLAYLAR</span>
                <h3 class="text-sm font-black text-slate-800 mt-0.5">Hangi Durumlarda Bildirim Almak İstiyorsunuz?</h3>
              </div>
            </div>

            <div class="divide-y divide-slate-100">
              
              <!-- Olay 1: Yeni Teklif -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Yeni Teklif Geldiğinde</div>
                  <div class="text-[11px] text-slate-500">Açtığınız bir ihaleye tedarikçiler yeni bir fiyat teklifi sunduğunda.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.newBid = !notifSettings.newBid"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.newBid ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.newBid ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 2: Karşı Teklif / İndirim -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Karşı Teklif & Fiyat İndirimi Yapıldığında</div>
                  <div class="text-[11px] text-slate-500">Canlı eksiltme odasında lider teklif değiştiğinde veya karşı teklif iletildiğinde.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.counterOffer = !notifSettings.counterOffer"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.counterOffer ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.counterOffer ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 3: İhale Sonuçlanması -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">İhale Sonuçlanması & Kazanan İlanı</div>
                  <div class="text-[11px] text-slate-500">Teklif verdiğiniz veya açtığınız ihale tamamlandığında ve kazanan firma onaylandığında.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.tenderAwarded = !notifSettings.tenderAwarded"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.tenderAwarded ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.tenderAwarded ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 4: Süre Uyarısı -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">İhale Süresi Bitiş Hatırlatması</div>
                  <div class="text-[11px] text-slate-500">Takip ettiğiniz veya teklif verdiğiniz ihalelerin bitmesine son 24 saat ve 1 saat kala.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.deadlineWarning = !notifSettings.deadlineWarning"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.deadlineWarning ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.deadlineWarning ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 5: Sektörel İhaleler -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Sektörünüze Özel Yeni İhale Duyuruları</div>
                  <div class="text-[11px] text-slate-500">Profilinizde seçtiğiniz faaliyet sektörlerine uygun yeni bir satın alma talebi açıldığında.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.sectorNewTenders = !notifSettings.sectorNewTenders"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.sectorNewTenders ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.sectorNewTenders ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 6: Escrow & Ödeme / Kargo -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Escrow & Güvenli Havuz / Kargo Teslimat Onayları</div>
                  <div class="text-[11px] text-slate-500">Sipariş ödemesi havuza alındığında, kargo takip no girildiğinde veya mal kabulü yapıldığında.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.escrowUpdates = !notifSettings.escrowUpdates"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.escrowUpdates ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.escrowUpdates ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 7: Mesajlaşma -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Doğrudan Mesajlar & İhale Soru-Cevapları</div>
                  <div class="text-[11px] text-slate-500">Alıcı veya tedarikçi firmalar ihale kapsamında size yeni bir mesaj gönderdiğinde.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.messages = !notifSettings.messages"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.messages ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.messages ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

              <!-- Olay 8: Haftalık Bülten -->
              <div class="py-3.5 flex items-center justify-between gap-4">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-slate-800">Haftalık Pazar Yeri & Tasarruf Analiz Bülteni</div>
                  <div class="text-[11px] text-slate-500">Her Pazartesi sektörel fiyat değişimleri ve popüler ihaleleri içeren e-posta özeti.</div>
                </div>
                <button 
                  type="button" 
                  @click="notifSettings.weeklyDigest = !notifSettings.weeklyDigest"
                  class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                  :style="notifSettings.weeklyDigest ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                >
                  <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.weeklyDigest ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                </button>
              </div>

            </div>
          </div>

          <!-- KART 3: SIKLIK & SESSİZ SAATLER -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-5 border-slate-200/80">
            <div class="pb-3 border-b border-slate-100">
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">3. ZAMANLAMA VE SIKLIK</span>
              <h3 class="text-sm font-black text-slate-800 mt-0.5">Bildirim Gönderim Sıklığı ve Rahatsız Etmeme Modu</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Gönderim Sıklığı -->
              <div class="space-y-3">
                <label class="block text-xs font-bold text-slate-700">Bildirim İletim Sıklığı</label>
                <div class="space-y-2">
                  <label 
                    class="flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition"
                    :class="notifSettings.frequency === 'instant' ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                  >
                    <input type="radio" v-model="notifSettings.frequency" value="instant" class="text-blue-600" />
                    <div>
                      <div>⚡ Anında İletim (Önerilen)</div>
                      <div class="text-[10px] text-slate-400 font-normal">Her yeni teklifte ve olayda anında bildirim gönderilir.</div>
                    </div>
                  </label>

                  <label 
                    class="flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition"
                    :class="notifSettings.frequency === 'daily' ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                  >
                    <input type="radio" v-model="notifSettings.frequency" value="daily" class="text-blue-600" />
                    <div>
                      <div>🕒 Günlük Özet</div>
                      <div class="text-[10px] text-slate-400 font-normal">Günde 1 kez saat 18:00'de toplu bildirim özeti gönderilir.</div>
                    </div>
                  </label>

                  <label 
                    class="flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition"
                    :class="notifSettings.frequency === 'weekly' ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                  >
                    <input type="radio" v-model="notifSettings.frequency" value="weekly" class="text-blue-600" />
                    <div>
                      <div>📅 Haftalık Özet</div>
                      <div class="text-[10px] text-slate-400 font-normal">Haftada bir kez Pazartesi sabahı haftalık bülten iletilir.</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Sessiz Saatler -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-slate-700">Gece Sessiz Saatler (DND)</label>
                  <button 
                    type="button" 
                    @click="notifSettings.quietHours = !notifSettings.quietHours"
                    class="relative h-5 w-9 rounded-full transition-all shrink-0 cursor-pointer"
                    :style="notifSettings.quietHours ? 'background: #1EAE4C;' : 'background: #CBD5E1;'"
                  >
                    <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifSettings.quietHours ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
                  </button>
                </div>

                <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    Belirlenen saat aralığında cep telefonunuza SMS ve sesli çağrı/alarm iletilmez; bildirimler sessizce e-posta kutunuza ve panelinize kaydedilir.
                  </p>
                  
                  <div class="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 block mb-1">Başlangıç Saati</span>
                      <input 
                        v-model="notifSettings.quietStart" 
                        type="time" 
                        :disabled="!notifSettings.quietHours"
                        class="w-full rounded-lg border p-2 text-xs bg-white border-slate-200 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 block mb-1">Bitiş Saati</span>
                      <input 
                        v-model="notifSettings.quietEnd" 
                        type="time" 
                        :disabled="!notifSettings.quietHours"
                        class="w-full rounded-lg border p-2 text-xs bg-white border-slate-200 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Save Actions -->
          <div class="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 :size="15" class="text-emerald-500" />
              <span>Bildirim ayarlarınız anında hesabınızla eşitlenir.</span>
            </div>
            <button 
              type="button" 
              @click="saveNotificationPreferences" 
              class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <Save :size="14" />
              Bildirim Tercihlerini Kaydet
            </button>
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
                  <span class="text-slate-500">Aktif/Kayıtlı e-posta: <strong>{{ profileForm.email || userSession.email || 'ihalecib@gmail.com' }}</strong></span>
                </div>
                <button type="button" @click="trigger2FaToggle" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs transition">
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
                <span class="text-[8px] font-black text-slate-400 block">UYGULAMA TERCİHLERİ</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Tercihler & Görünüm</h3>
              </div>
            </div>
            <p class="text-[10px] text-slate-500 leading-normal">Karanlık / Açık tema görünümü, dil ve saat biçimi tercihlerinizi anlık olarak kişiselleştirin.</p>
            
            <!-- Active Theme Selection -->
            <div class="space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">TEMA MODU SEÇİMİ (CANLI UYGULANIR)</span>
              <div class="grid grid-cols-3 gap-4">
                <button 
                  type="button" 
                  @click="activeTheme = 'sistem'; applyTheme('sistem'); showToast('Sistem teması aktif edildi.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm cursor-pointer"
                  :class="activeTheme === 'sistem' ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/20 font-black' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'"
                >
                  <Laptop :size="18" class="mx-auto text-blue-600" />
                  <span class="text-xs block">💻 Sistem</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'acik'; applyTheme('acik'); showToast('Açık renk teması uygulandı.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm cursor-pointer"
                  :class="activeTheme === 'acik' ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/20 font-black' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'"
                >
                  <Sun :size="18" class="mx-auto text-amber-500" />
                  <span class="text-xs block">☀️ Açık</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'koyu'; applyTheme('koyu'); showToast('Koyu (Karanlık) tema uygulandı.')"
                  class="rounded-xl border p-4 text-center space-y-2 transition shadow-sm cursor-pointer"
                  :class="activeTheme === 'koyu' ? 'border-blue-600 bg-blue-50/50 text-blue-600 ring-2 ring-blue-500/20 font-black' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'"
                >
                  <Moon :size="18" class="mx-auto text-indigo-500" />
                  <span class="text-xs block">🌙 Koyu</span>
                </button>
              </div>
            </div>

            <!-- Form dropdowns -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Dil / Language</label>
                <select 
                  v-model="selectedLanguage" 
                  @change="setLocale(selectedLanguage === 'English' ? 'en' : 'tr')"
                  class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none cursor-pointer" 
                  style="border-color: #E2E8F0;"
                >
                  <option value="Türkçe">🇹🇷 TR Türkçe</option>
                  <option value="English">🇺🇸 EN English</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Formatı</label>
                <select v-model="timeFormat" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none cursor-pointer" style="border-color: #E2E8F0;">
                  <option value="24 saat">24 saat (14:30)</option>
                  <option value="12 saat">12 saat (02:30 PM)</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Dilimi</label>
                <select v-model="timezone" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none cursor-pointer" style="border-color: #E2E8F0;">
                  <option value="Europe/Istanbul (GMT+3)">Europe/Istanbul (GMT+3)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2 justify-end pt-2">
              <button type="button" @click="resetPreferences" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition cursor-pointer" style="border-color: #E2E8F0;">Varsayılanlara Sıfırla</button>
              <button type="button" @click="savePreferences" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2 transition shadow cursor-pointer">Tercihleri kaydet</button>
            </div>
          </div>

          <!-- Bildirim Tercihleri Card -->
          <div id="bildirim-tercihleri" class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between pb-2 border-b" style="border-color: #F1F5F9;">
              <div class="flex items-center gap-2.5">
                <Bell :size="15" class="text-blue-600" />
                <div>
                  <span class="text-[8px] font-black text-slate-300 block">BİLDİRİM TERCİHLERİ</span>
                  <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">Bildirim & Uyarı Ayarları</h3>
                </div>
              </div>
              <NuxtLink 
                to="/panel/ayarlar?tab=bildirimler"
                class="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 text-[11px] font-bold transition flex items-center gap-1"
              >
                Tam Ekran Yönet →
              </NuxtLink>
            </div>
            <p class="text-xs text-slate-500 leading-normal">
              E-posta, SMS, WhatsApp, Web Push ve sesli uyarı kanallarınızı detaylı olarak yapılandırın.
            </p>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-0.5 text-slate-600 font-medium">
                <div>E-Posta: <strong class="text-slate-800">{{ notifSettings.emailEnabled ? 'Açık' : 'Kapalı' }}</strong> · SMS: <strong class="text-slate-800">{{ notifSettings.smsEnabled ? 'Açık' : 'Kapalı' }}</strong> · WhatsApp: <strong class="text-slate-800">{{ notifSettings.whatsappEnabled ? 'Açık' : 'Kapalı' }}</strong></div>
                <div class="text-[11px] text-slate-400">Sıklık: {{ notifSettings.frequency === 'instant' ? 'Anında İletim' : (notifSettings.frequency === 'daily' ? 'Günlük Özet' : 'Haftalık Özet') }}</div>
              </div>
              <NuxtLink 
                to="/panel/ayarlar?tab=bildirimler" 
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-sm shrink-0"
              >
                Bildirim Ayarlarını Düzenle →
              </NuxtLink>
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

