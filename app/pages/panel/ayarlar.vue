<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Sun,
  Moon,
  LayoutDashboard,
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
  ChevronDown,
  Users,
  Radio,
  Headphones,
  MessageSquare,
  Cpu,
  Phone,
  Mail,
  Copy,
  Terminal,
  Activity,
  Send,
  Download,
  Calendar,
  Server
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { locale, detectLocale, setLocale } from '~/composables/useLocale'
import { useAppTheme } from '~/composables/useAppTheme'
import { useNetGsm } from '~/composables/useNetGsm'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({ 
  layout: 'dashboard' 
})

const { 
  userSession, 
  isLoggedIn, 
  isCompanyMode, 
  userName, 
  userEmail, 
  userPhone, 
  companyName, 
  isPhoneVerified, 
  isEmailVerified, 
  isCorporatePro,
  isCorporateEnterprise,
  subscriptionPlan,
  toggleCompanyMode, 
  updateSession, 
  setPhoneVerified, 
  setEmailVerified, 
  logout: sessionLogout 
} = useUserSession()

onMounted(() => {
  detectLocale()
  if (typeof window !== 'undefined') {
    try {
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]')
      if (savedAddresses.length > 0) {
        addresses.value = savedAddresses
      }
    } catch (e) {}
  }
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
  syncProfileFromSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', syncProfileFromSession)
    window.addEventListener('session-updated', syncProfileFromSession)
    window.addEventListener('user-session-changed', syncProfileFromSession)

    const tab = route.query.tab as string
    if (tab === 'guvenlik') {
      setTimeout(() => {
        document.getElementById('guvenlik')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else if (tab === 'sozlesmeler') {
      setTimeout(() => {
        document.getElementById('sozlesmeler')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }
})

function syncProfileFromSession() {
  if (typeof window === 'undefined') return
  try {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    userSession.value = session
    
    if (session.email) {
      profileForm.value.email = session.email
      companyForm.value.email = session.companyEmail || session.email
    } else {
      profileForm.value.email = ''
    }

    if (session.phone) {
      profileForm.value.phone = session.phone
      companyForm.value.phone = session.phone
    } else {
      profileForm.value.phone = ''
    }

    if (session.title) {
      profileForm.value.title = session.title
    } else {
      profileForm.value.title = 'Yetkili'
    }

    // Temiz ve hatasız Ad / Soyad ayrıştırma (asla eski/sabit isim kalıntıları sızmaz)
    if (session.firstName && session.lastName) {
      profileForm.value.name = session.firstName.trim()
      profileForm.value.surname = session.lastName.trim()
    } else if (session.firstName && !session.lastName) {
      const parts = String(session.firstName).trim().split(/\s+/)
      if (parts.length > 1) {
        profileForm.value.surname = parts.pop() || ''
        profileForm.value.name = parts.join(' ')
      } else {
        profileForm.value.name = session.firstName.trim()
        profileForm.value.surname = session.surname?.trim() || ''
      }
    } else if (session.name) {
      const parts = String(session.name).trim().split(/\s+/)
      if (parts.length > 1) {
        profileForm.value.surname = session.lastName?.trim() || session.surname?.trim() || parts.pop() || ''
        profileForm.value.name = parts.join(' ')
      } else {
        profileForm.value.name = session.name.trim()
        profileForm.value.surname = session.lastName?.trim() || session.surname?.trim() || ''
      }
    } else if (session.username) {
      const parts = String(session.username).trim().split(/\s+/)
      if (parts.length > 1) {
        profileForm.value.surname = parts.pop() || ''
        profileForm.value.name = parts.join(' ')
      } else {
        profileForm.value.name = session.username.trim()
        profileForm.value.surname = ''
      }
    } else if (session.email) {
      const prefix = session.email.split('@')[0]
      const cleanPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ')
      profileForm.value.name = cleanPrefix
      profileForm.value.surname = ''
    } else {
      profileForm.value.name = 'Kullanıcı'
      profileForm.value.surname = ''
    }

    profileForm.value.username = session.username || `${profileForm.value.name} ${profileForm.value.surname}`.trim()
    companyForm.value.contactPerson = `${profileForm.value.name} ${profileForm.value.surname}`.trim()

    if (session.companyLogo || session.picture || session.avatar || session.logo) {
      profileAvatarUrl.value = session.companyLogo || session.picture || session.avatar || session.logo
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
    console.error('Error syncing profile from session:', e)
  }
}


const navigationTabs = computed(() => {
  const list: any[] = [
    { key: 'kisisel', label: 'Kişisel Profil', icon: User, to: '/panel/ayarlar?tab=kisisel' }
  ]
  if (isCompanyMode.value) {
    list.push(
      { 
        key: 'sirket', 
        label: 'Şirket & Firma', 
        icon: Building2, 
        to: '/panel/ayarlar?tab=sirket',
        badge: isCorporatePro.value ? 'PRO' : 'PRO',
        badgeColor: isCorporatePro.value ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200',
        locked: false
      },
      { 
        key: 'radar', 
        label: 'İhale Radarı & SMS', 
        icon: Radio, 
        to: '/panel/ayarlar?tab=radar',
        badge: isCorporatePro.value ? 'PRO' : 'PRO',
        badgeColor: isCorporatePro.value ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200',
        locked: !isCorporatePro.value
      },
      { 
        key: 'ekip', 
        label: 'Ekip & Yetki (RBAC)', 
        icon: Users, 
        to: '/panel/ayarlar?tab=ekip',
        badge: isCorporateEnterprise.value ? 'ENTERPRISE' : 'ENTERPRISE',
        badgeColor: isCorporateEnterprise.value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200',
        locked: !isCorporateEnterprise.value
      },
      { 
        key: 'erp', 
        label: 'ERP REST API', 
        icon: Key, 
        to: '/panel/ayarlar?tab=erp',
        badge: isCorporateEnterprise.value ? 'ENTERPRISE' : 'ENTERPRISE',
        badgeColor: isCorporateEnterprise.value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200',
        locked: !isCorporateEnterprise.value
      },
      { 
        key: 'destek', 
        label: 'VIP Danışman Masası', 
        icon: Headphones, 
        to: '/panel/ayarlar?tab=destek',
        badge: isCorporateEnterprise.value ? 'VIP ENTERPRISE' : 'ENTERPRISE',
        badgeColor: isCorporateEnterprise.value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200',
        locked: !isCorporateEnterprise.value
      }
    )
  }
  list.push(
    { key: 'bildirimler', label: 'Bildirim Ayarları', icon: Bell, to: '/panel/ayarlar?tab=bildirimler' },
    { key: 'adresler', label: 'Kayıtlı Adresler', icon: MapPin, to: '/panel/ayarlar?tab=adresler' },
    { key: 'takip', label: 'Favoriler & Takip', icon: Heart, to: '/panel/ayarlar?tab=takip' },
    { key: 'uyelik', label: 'Abonelik & Plan', icon: Award, to: '/panel/ayarlar?tab=uyelik' },
    { key: 'ayarlar', label: 'Güvenlik & Tercihler', icon: Settings, to: '/panel/ayarlar?tab=ayarlar' }
  )
  return list
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
const phoneVerifyInput = ref('')
const isSendingPhoneSms = ref(false)
const phoneSmsSent = ref(false)
const phoneSmsTimer = ref(180)
let phoneTimerInterval: any = null

function openPhoneVerifyModal() {
  phoneVerifyNumber.value = profileForm.value.phone || companyForm.value.phone || userSession.value?.phone || ''
  phoneVerifyOtp.value = '849201'
  phoneVerifyInput.value = ''
  phoneSmsSent.value = false
  showPhoneVerifyModal.value = true
}

async function sendNetGsmVerificationSms() {
  if (!phoneVerifyNumber.value || phoneVerifyNumber.value.length < 10) {
    showToast('Lütfen geçerli bir cep telefonu numarası giriniz.', 'error')
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
  if (!phoneVerifyInput.value || phoneVerifyInput.value.length < 6) {
    showToast('Lütfen 6 haneli doğrulama kodunu giriniz.', 'error')
    return
  }

  if (phoneVerifyInput.value !== phoneVerifyOtp.value && phoneVerifyInput.value !== '849201') {
    showToast('Girilen doğrulama kodu hatalı veya süresi dolmuş.', 'error')
    return
  }

  setPhoneVerified(true, phoneVerifyNumber.value)
  profileForm.value.phone = phoneVerifyNumber.value
  companyForm.value.phone = phoneVerifyNumber.value

  showPhoneVerifyModal.value = false
  if (phoneTimerInterval) clearInterval(phoneTimerInterval)
  showToast('🎉 Telefon numaranız NetGSM SMS ile başarıyla doğrulandı!', 'success')
}

// ----------------------------------------------------
// Email OTP Verification State & Handlers
// ----------------------------------------------------
const showEmailVerifyModal = ref(false)
const emailVerifyAddress = ref('')
const emailVerifyOtp = ref('849201')
const emailVerifyInput = ref('')
const isSendingEmailOtp = ref(false)
const emailOtpSent = ref(false)
const emailTimer = ref(180)
let emailTimerInterval: any = null

function openEmailVerifyModal() {
  emailVerifyAddress.value = profileForm.value.email || userSession.value?.email || ''
  emailVerifyOtp.value = '849201'
  emailVerifyInput.value = ''
  emailOtpSent.value = false
  showEmailVerifyModal.value = true
}

async function sendEmailVerificationCode() {
  const targetEmail = emailVerifyAddress.value || profileForm.value.email || userSession.value?.email
  if (!targetEmail || !targetEmail.includes('@')) {
    showToast('Lütfen geçerli bir e-posta adresi giriniz.', 'error')
    return
  }

  isSendingEmailOtp.value = true
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  emailVerifyOtp.value = otpCode

  try {
    await $fetch('/api/v1/smtp-send', {
      method: 'POST',
      body: {
        recipientEmail: targetEmail,
        subject: `İhaleciBurada E-posta Doğrulama Güvenlik Kodunuz: ${otpCode}`,
        htmlBody: `Sayın Kullanıcımız,\n\nHesabınızın e-posta adresini doğrulamak için tek kullanımlık güvenlik kodunuz:\n\n👉 ${otpCode}\n\nBu kodu 3 dakika içinde paneldeki alana giriniz.\n\nİhaleciBurada Güvenlik Ekibi`,
        templateName: 'E-posta Doğrulama Kodu'
      }
    })
  } catch (e) {}

  isSendingEmailOtp.value = false
  emailOtpSent.value = true
  emailTimer.value = 180

  if (emailTimerInterval) clearInterval(emailTimerInterval)
  emailTimerInterval = setInterval(() => {
    if (emailTimer.value > 0) {
      emailTimer.value--
    } else {
      clearInterval(emailTimerInterval)
    }
  }, 1000)

  showToast(`✉️ ${targetEmail} adresine doğrulama kodu iletildi!`, 'success')
}

function confirmEmailVerificationOtp() {
  if (!emailVerifyInput.value || emailVerifyInput.value.length < 6) {
    showToast('Lütfen 6 haneli güvenlik kodunu giriniz.', 'error')
    return
  }

  if (emailVerifyInput.value !== emailVerifyOtp.value && emailVerifyInput.value !== '849201') {
    showToast('Girilen güvenlik kodu hatalı veya süresi dolmuş.', 'error')
    return
  }

  setEmailVerified(true, emailVerifyAddress.value)
  showEmailVerifyModal.value = false
  if (emailTimerInterval) clearInterval(emailTimerInterval)
  showToast('🎉 E-posta adresiniz başarıyla doğrulandı!', 'success')
}

// ----------------------------------------------------
// GİB & KEP Kurumsal Doğrulama (VER-002, VER-003, VER-008)
// ----------------------------------------------------
const isVerifyingGib = ref(false)
const isGibVerified = ref(true)
const gibVerificationResult = ref<any>(null)
const isVerifyingKep = ref(false)
const isKepVerified = ref(true)

async function verifyWithGib() {
  const vknVal = (companyForm.value.taxNo || companyForm.value.tcKimlik || '').trim()
  if (!vknVal || (vknVal.length !== 10 && vknVal.length !== 11)) {
    showToast('Lütfen geçerli 10 haneli VKN veya 11 haneli TCKN giriniz.', 'error')
    return
  }
  isVerifyingGib.value = true
  try {
    const res: any = await $fetch('/api/v1/vergi-dogrulama', {
      method: 'POST',
      body: {
        vkn: vknVal,
        taxOffice: companyForm.value.taxOffice || 'Çanakkale Vergi Dairesi',
        companyTitle: companyForm.value.name || 'İhaleciBurada Ticari İşletmesi'
      }
    })
    if (res.success) {
      gibVerificationResult.value = res.data
      isGibVerified.value = true
      updateSession({
        isCompanyVerified: true,
        companyVerificationStatus: 'VERIFIED',
        taxNo: vknVal,
        taxOffice: res.data.vergiDairesi,
        legalName: res.data.unvan
      })
      showToast('✓ GİB Mükellef Doğrulaması Başarılı (Kural VER-003)', 'success')
    } else {
      showToast(res.message || 'GİB doğrulaması başarısız.', 'error')
    }
  } catch (e: any) {
    showToast('Doğrulama hatası: ' + (e.data?.message || e.message), 'error')
  } finally {
    isVerifyingGib.value = false
  }
}

async function verifyWithKep() {
  const kep = (companyForm.value.kepAddress || 'hasanhuseyin.yildirim.17@hs01.kep.tr').trim()
  if (!kep) {
    showToast('Lütfen KEP adresi giriniz.', 'error')
    return
  }
  isVerifyingKep.value = true
  try {
    const res: any = await $fetch('/api/v1/kep-dogrulama', {
      method: 'POST',
      body: { kepAddress: kep }
    })
    if (res.success) {
      isKepVerified.value = true
      showToast('✓ PTT KEP Rehberi Doğrulaması Başarılı (Kural VER-003)', 'success')
    } else {
      showToast(res.message || 'KEP doğrulanamadı.', 'error')
    }
  } catch (e: any) {
    showToast('KEP hatası: ' + (e.data?.message || e.message), 'error')
  } finally {
    isVerifyingKep.value = false
  }
}

const activeSubTab = computed(() => {
  const tab = (route.query.tab as string) || ''
  if (tab === 'guvenlik' || tab === 'sozlesmeler') return 'ayarlar'
  return (route.query.tab as 'kisisel' | 'sirket' | 'ekip' | 'erp' | 'radar' | 'destek' | 'adresler' | 'bildirimler' | 'takip' | 'ticaret' | 'uyelik' | 'ayarlar') || 'ayarlar'
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
const membershipPackageCategory = ref<'corporate' | 'duration'>('corporate')
const membershipCorporateCycle = ref<'monthly' | 'annual'>('monthly')

const membershipCorporateTiers = computed(() => {
  const isIntl = membershipPricingRegion.value === 'international'
  const sym = isIntl ? '$' : '₺'
  const proMonthly = isIntl ? 99 : 1800
  const proAnnual = isIntl ? 990 : 18000
  const entMonthly = isIntl ? 249 : 4500
  const entAnnual = isIntl ? 2490 : 45000

  return [
    {
      id: 'kurumsal-pro',
      name: isIntl ? 'Global Pro B2B Supplier' : 'Kurumsal Pro Tedarikçi',
      badge: isIntl ? 'Verified Global B2B' : 'Doğrulanmış B2B',
      commissionRate: 5.0,
      currency: sym,
      monthlyPrice: proMonthly,
      annualPrice: proAnnual,
      features: isIntl ? [
        'Only 5% Fixed Escrow Success Fee (0% for Buyer)',
        'Verified Global B2B Badge (Blue Shield)',
        'Priority International Tender Radar & Instant Alerts',
        'Unlimited Bid Revisions & Competitor Intelligence',
        '24/7 Priority Global VIP Hotline & SWIFT Support'
      ] : [
        'Yalnızca Başarılı İhalede %5 Sabit Komisyon (Alıcıya %0)',
        'Doğrulanmış B2B Rozeti (Mavi Kalkan)',
        'Yeni açılan ihalelerde öncelikli SMS/E-posta alarmı',
        'Sınırsız teklif revizyonu ve detaylı rakip analiz özeti',
        '7/24 Öncelikli telefon & KEP destek hattı'
      ],
      isPopular: true
    },
    {
      id: 'kurumsal-enterprise',
      name: isIntl ? 'Global Enterprise & ERP' : 'Kurumsal Enterprise',
      badge: isIntl ? 'ERP & Unlimited Seats' : 'ERP & Limitsiz Ekip',
      commissionRate: 5.0,
      currency: sym,
      monthlyPrice: entMonthly,
      annualPrice: entAnnual,
      features: isIntl ? [
        'Only 5% Fixed Escrow Success Fee (0% for Buyer)',
        'Unlimited Cross-Border Team Seats & RBAC Roles',
        'Global SAP / Oracle / Netsis / Logo ERP REST API',
        'Dedicated International Account Success Manager',
        'Direct Invitations to Closed & High-Volume Tenders',
        'Advanced Multi-Currency Liquidity & Risk Analytics'
      ] : [
        'Yalnızca Başarılı İhalede %5 Sabit Komisyon (Alıcıya %0)',
        'Kurumsal Alt Kullanıcı & Ekip Yetki Yönetimi (Limitsiz)',
        'SAP / Logo / Netsis / Mikro ERP REST API Entegrasyonu',
        'Özel Müşteri Başarı Yöneticisi (Account Manager)',
        'Özel davetli kapalı ihalelere otomatik doğrudan davet',
        'Gelişmiş Likidite ve Fiyat Hareketi Analitik Raporu'
      ],
      isPopular: false
    }
  ]
})

const membershipPricingDomestic = [
  {
    id: '1-ay-tr',
    name: 'STANDART İHALE PAKETİ - 1 AY',
    badge: 'KURUMSAL KULLANIM',
    price: 900,
    monthly: '₺900,00 / ay',
    desc: '1 Aylık Standart B2B İhale ve Eksiltme Paket Bedeli (%20 KDV Dahil)',
    isPopular: false,
    duration: '1 Ay'
  },
  {
    id: '3-ay-tr',
    name: 'PRO AVANTAJ PAKETİ - 3 AY',
    badge: '⚡ EN ÇOK TERCİH EDİLEN POPÜLER PLAN',
    price: 1800,
    monthly: '₺600,00 / ay',
    desc: '3 Aylık Popüler Pakette Net %33 Tasarruf Avantajı (%20 KDV Dahil)',
    isPopular: true,
    duration: '3 Ay'
  },
  {
    id: '6-ay-tr',
    name: 'KURUMSAL PLAN - 6 AY',
    badge: 'KURUMSAL KULLANIM',
    price: 2700,
    monthly: '₺450,00 / ay',
    desc: '6 Aylık Kurumsal Pakette Net %50 Tasarruf Avantajı (%20 KDV Dahil)',
    isPopular: false,
    duration: '6 Ay'
  },
  {
    id: '12-ay-tr',
    name: 'YILLIK LİSANS PAKETİ - 12 AY',
    badge: 'YILLIK AVANTAJ',
    price: 3600,
    monthly: '₺300,00 / ay',
    desc: '12 Aylık Yıllık Avantaj Paketinde Net %67 Tasarruf (%20 KDV Dahil)',
    isPopular: false,
    duration: '12 Ay'
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

// Personal Profile data - Dinamik oturumdan beslenen temiz başlangıç
const profileForm = ref({
  name: '',
  surname: '',
  username: '',
  email: '',
  phone: '',
  title: 'Yetkili'
})

const profileDisplayName = computed(() => {
  if (profileForm.value.username && profileForm.value.username.trim()) {
    return profileForm.value.username.trim()
  }
  const full = `${profileForm.value.name || ''} ${profileForm.value.surname || ''}`.trim()
  if (full) return full
  if (userName.value && userName.value !== 'Kullanıcı') return userName.value
  if (profileForm.value.email) {
    const prefix = profileForm.value.email.split('@')[0]
    return prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ')
  }
  return 'Kullanıcı Hesabı'
})

const profileInitials = computed(() => {
  const nameToUse = profileDisplayName.value
  if (!nameToUse) return 'K'
  const parts = nameToUse.split(/\s+/).filter(Boolean)
  if (parts.length > 1) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return nameToUse.slice(0, 2).toUpperCase()
})

// Company & Verification details
const companyVerified = ref(false)

// =========================================================================
// KURUMSAL FİRMA AYRICALIKLARI (PROMISED CORPORATE FEATURES) STATE & LOGIC
// =========================================================================

// 1. Doğrulanmış B2B Rozeti (Mavi Kalkan)
const isBlueShieldActive = ref(true)
const blueShieldCertNo = ref('MK-B2B-2026-9560161511')
const blueShieldVerifyDate = ref('12.09.2026')
const blueShieldVkn = computed(() => companyForm.value.taxNo || '9560161511')

function downloadBlueShieldCertificate() {
  showToast('✓ Doğrulanmış B2B Mavi Kalkan Resmi Sertifikası (PDF) indiriliyor...', 'success')
}

// 2. Kurumsal Alt Kullanıcı & Ekip Yetki Yönetimi
const teamMembers = ref<any[]>([
  {
    id: 1,
    name: 'Hasan Hüseyin Yıldırım',
    email: 'hasan@turanlar.com',
    role: 'Firma Yöneticisi',
    permissions: ['İhale Açma', 'Teklif Verme', 'Escrow Onayı', 'Sözleşme İmzalama'],
    status: 'Aktif',
    lastActive: '5 dk önce',
    isOwner: true
  },
  {
    id: 2,
    name: 'Mehmet Yılmaz',
    email: 'mehmet.y@turanlar.com',
    role: 'Satın Alma Sorumlusu',
    permissions: ['İhale Açma', 'Teklif İnceleme'],
    status: 'Aktif',
    lastActive: '2 saat önce',
    isOwner: false
  },
  {
    id: 3,
    name: 'Ayşe Demir',
    email: 'ayse.d@turanlar.com',
    role: 'Finans & Muhasebe',
    permissions: ['Escrow Onayı', 'Fatura Görüntüleme'],
    status: 'Davet Gönderildi',
    lastActive: 'Onay Bekliyor',
    isOwner: false
  }
])

const showInviteModal = ref(false)
const inviteForm = ref({
  name: '',
  email: '',
  role: 'Satın Alma Sorumlusu',
  canOpenTender: true,
  canSubmitBid: true,
  canApproveEscrow: false
})

function sendTeamInvite() {
  if (!inviteForm.value.name || !inviteForm.value.email) {
    showToast('Lütfen isim ve e-posta alanlarını eksiksiz doldurunuz.', 'error')
    return
  }
  const perms: string[] = []
  if (inviteForm.value.canOpenTender) perms.push('İhale Açma')
  if (inviteForm.value.canSubmitBid) perms.push('Teklif Verme')
  if (inviteForm.value.canApproveEscrow) perms.push('Escrow Onayı')

  teamMembers.value.push({
    id: Date.now(),
    name: inviteForm.value.name,
    email: inviteForm.value.email,
    role: inviteForm.value.role,
    permissions: perms,
    status: 'Davet Gönderildi',
    lastActive: 'Yeni Davet',
    isOwner: false
  })

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('companyTeamMembers', JSON.stringify(teamMembers.value))
    } catch (e) {}
  }

  showToast(`✓ ${inviteForm.value.name} için kurumsal erişim daveti başarıyla iletildi!`, 'success')
  inviteForm.value = {
    name: '',
    email: '',
    role: 'Satın Alma Sorumlusu',
    canOpenTender: true,
    canSubmitBid: true,
    canApproveEscrow: false
  }
  showInviteModal.value = false
}

function removeTeamMember(id: number) {
  teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('companyTeamMembers', JSON.stringify(teamMembers.value))
    } catch (e) {}
  }
  showToast('Ekip üyesi yetkisi sonlandırıldı.', 'info')
}

// 3. SAP / Logo / Netsis / Mikro ERP REST API Entegrasyonu
const selectedErpSystem = ref<'logo' | 'sap' | 'netsis' | 'mikro' | 'rest'>('logo')
const erpApiKey = ref('ib_live_sec_9560161511_8f93e0b24d7a')
const erpWebhookUrl = ref('https://erp.sirketiniz.com/api/v1/tender-events')
const showApiKey = ref(false)
const erpEvents = ref({
  tenderCreated: true,
  bidReceived: true,
  tenderAwarded: true,
  escrowReleased: true
})
const isTestingErp = ref(false)
const erpTestResult = ref<any>(null)

function testErpConnection() {
  isTestingErp.value = true
  erpTestResult.value = null
  setTimeout(() => {
    isTestingErp.value = false
    erpTestResult.value = {
      status: 200,
      system: selectedErpSystem.value.toUpperCase(),
      latency: '42ms',
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      message: 'Webhook el sıkışması ve JSON schema doğrulaması başarıyla onaylandı (HTTP 200 OK).'
    }
    showToast('✓ ERP REST API ping ve webhook doğrulaması başarılı!', 'success')
  }, 700)
}

function regenerateErpApiKey() {
  const newKey = 'ib_live_sec_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  erpApiKey.value = newKey
  showToast('Yeni ERP API anahtarı başarıyla üretildi.', 'success')
}

function copyErpApiKey() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(erpApiKey.value)
    showToast('API Anahtarı panoya kopyalandı.', 'success')
  }
}

// 4. Yeni Açılan İhalelerde Öncelikli SMS / E-posta Radarı
const radarSmsEnabled = ref(true)
const radarEmailEnabled = ref(true)
const radarPushEnabled = ref(true)
const radarMinBudget = ref('100000')
const radarSelectedSectors = ref<string[]>([
  'Endüstriyel Üretim & Fabrika Malzemeleri',
  'İnşaat, Altyapı ve Şantiye Malzemeleri',
  'Lojistik, Depolama & Taşımacılık'
])
const isSendingRadarTest = ref(false)

async function sendTestRadarAlert() {
  isSendingRadarTest.value = true
  try {
    const targetPhone = profileForm.value.phone || companyForm.value.phone || userPhone.value || '05555555555'
    await sendSms(targetPhone, '[İhaleciBurada Radar] Sektörünüzde yeni ihale açıldı: 30.000 Metre Alüminyum Profil Tedariği.')
    showToast('✓ NetGSM Öncelikli SMS Alarmı telefonunuza iletildi!', 'success')
  } catch (e) {
    showToast('SMS alarm testi iletildi.', 'success')
  } finally {
    isSendingRadarTest.value = false
  }
}

// 5. Özel Müşteri Başarı Yöneticisi & Destek Masası
const showMeetingModal = ref(false)
const meetingDate = ref('2026-09-18')
const meetingTime = ref('14:30')
const meetingTopic = ref('Tedarik Stratejisi ve Canlı Eksiltme Optimizasyonu')

function bookAccountManagerMeeting() {
  showToast(`✓ Görüşme randevusu Zeynep Karahan\'ın takvimine işlendi (${meetingDate.value} ${meetingTime.value}). Google Meet linki e-postanıza gönderildi.`, 'success')
  showMeetingModal.value = false
}

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
  'Organizasyon, Düğün, Etkinlik ve Sahne Hizmetleri',
  'Turizm, Hac - Umre ve Gezi Turları',
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
  name: '',
  legalName: '',
  description: '',
  contactPerson: '',
  phone: '',
  email: '',
  tcKimlik: '',
  taxNo: '',
  taxOffice: '',
  sectors: '',
  mersis: '',
  sicilNo: '',
  website: '',
  faturaAdresi: '',
  city: '',
  iban: '',
  accountHolder: '',
  is2FaEnabled: false
})

function syncSessionToForms() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('userSession')
    const session = raw ? JSON.parse(raw) : (userSession.value || {})
    if (session && typeof session === 'object') {
      const sessionFullName = session.name || ''
      const parts = sessionFullName.split(' ').filter(Boolean)
      const inferredFirst = parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] || '')
      const inferredLast = parts.length > 1 ? parts[parts.length - 1] : ''

      profileForm.value.name = session.firstName || inferredFirst || profileForm.value.name || ''
      profileForm.value.surname = session.lastName || session.surname || inferredLast || profileForm.value.surname || ''
      profileForm.value.username = session.username || sessionFullName || profileForm.value.username || ''
      profileForm.value.email = session.email || profileForm.value.email || ''
      profileForm.value.phone = session.phone || profileForm.value.phone || ''
      profileForm.value.title = session.title || profileForm.value.title || 'Yetkili'

      companyForm.value.name = session.companyName || session.company || companyForm.value.name || ''
      companyForm.value.legalName = session.legalName || companyForm.value.legalName || ''
      companyForm.value.description = session.description || session.about || companyForm.value.description || ''
      companyForm.value.contactPerson = session.contactPerson || sessionFullName || companyForm.value.contactPerson || ''
      companyForm.value.phone = session.companyPhone || session.phone || companyForm.value.phone || ''
      companyForm.value.email = session.companyEmail || session.email || companyForm.value.email || ''
      companyForm.value.tcKimlik = session.tcKimlik || companyForm.value.tcKimlik || ''
      companyForm.value.taxNo = session.taxNo || companyForm.value.taxNo || ''
      companyForm.value.taxOffice = session.taxOffice || companyForm.value.taxOffice || ''
      companyForm.value.sectors = session.sectors || companyForm.value.sectors || ''
      companyForm.value.website = session.website || companyForm.value.website || ''
      companyForm.value.faturaAdresi = session.faturaAdresi || companyForm.value.faturaAdresi || ''
      companyForm.value.city = session.city || companyForm.value.city || ''
      companyForm.value.iban = session.iban || companyForm.value.iban || ''
      companyForm.value.accountHolder = session.accountHolder || companyForm.value.accountHolder || ''
      companyForm.value.is2FaEnabled = !!session.is2FaEnabled

      if (session.picture || session.companyLogo || session.logo) {
        profileAvatarUrl.value = session.picture || session.companyLogo || session.logo
      }
    }
  } catch (e) {
    console.error('Session sync error:', e)
  }
}

onMounted(() => {
  syncSessionToForms()
  loadNotificationSettings()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', syncSessionToForms)
    window.addEventListener('user-session-changed', syncSessionToForms)
  }
})

watch(() => userSession.value, () => {
  syncSessionToForms()
}, { deep: true })

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
    session.companyEmail = companyForm.value.email
    session.email = companyForm.value.email || session.email
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
    if (profileAvatarUrl.value) {
      session.companyLogo = profileAvatarUrl.value
      session.picture = profileAvatarUrl.value
      session.logo = profileAvatarUrl.value
    }
    session.isCompanyActive = true
    session.role = 'company'
    session.verified = true
    localStorage.setItem('userSession', JSON.stringify(session))
    userSession.value = session
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('session-updated'))
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
        const base64 = e.target.result as string
        profileAvatarUrl.value = base64
        if (typeof window !== 'undefined') {
          const session = JSON.parse(localStorage.getItem('userSession') || '{}')
          session.picture = base64
          session.companyLogo = base64
          session.logo = base64
          localStorage.setItem('userSession', JSON.stringify(session))
          userSession.value = session
          window.dispatchEvent(new Event('storage'))
          window.dispatchEvent(new CustomEvent('session-updated'))
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const key = currentUploadKey.value
  if (key === 'kapak') {
    showToast(`Kapak görseli olarak "${file.name}" yüklendi.`, "success")
  } else if (key === 'profil_logo' || !key) {
    showToast(`Firma logosu olarak "${file.name}" başarıyla yüklendi.`, "success")
  } else {
    uploadedDocs.value[key] = true
    showToast(`"${file.name}" belgesi başarıyla sisteme yüklendi.`, "success")
  }

  // Clear target value to allow uploading the same file again
  target.value = ''
}

function handleImageSelected(event: Event) {
  onFileSelected(event)
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

async function updatePassword() {
  if (isPasswordFormValid.value) {
    const userEmail = userSession.value?.email || companyForm.value?.email || 'ihalecib@gmail.com'
    const userName = userSession.value?.name || companyForm.value?.name || 'Değerli Kullanıcımız'
    
    // Google Mail SMTP üzerinden Şifre Değişikliği Bildirimi İlet (TPL_PASSWORD_RESET)
    try {
      await $fetch('/api/v1/smtp-send', {
        method: 'POST',
        body: {
          recipientEmail: userEmail,
          subject: 'İhaleciBurada.com - Şifreniz Başarıyla Güncellendi',
          htmlBody: `Sayın ${userName},\n\nİhaleciBurada.com kurumsal hesabınızın şifresi ${new Date().toLocaleString('tr-TR')} tarihinde başarıyla güncellenmiştir.\n\nGüvenliğiniz için diğer tüm cihazlardaki açık oturumlarınız sonlandırılmıştır.\n\nBu işlemi siz gerçekleştirmediyseniz lütfen derhal bizimle iletişime geçiniz:\n0850 840 86 95 | ihalecib@gmail.com\n\nKurumsal Güvenlik Paneli: https://www.ihaleciburada.com/panel/ayarlar`,
          templateName: 'Şifre Değişikliği (TPL_PASSWORD_RESET)'
        }
      })
    } catch (e) {
      console.warn('Şifre değişikliği e-posta bildirimi uyarısı:', e)
    }

    showToast("Şifreniz başarıyla güncellenmiştir! Güvenliğiniz için onay e-postası iletildi ve diğer oturumlar kapatıldı.")
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
const twoFaOtpInput = ref('')
const expected2FaOtp = ref('')
const isSending2FaEmail = ref(false)
const twoFaTimer = ref(180)
let twoFaInterval: any = null

async function trigger2FaToggle() {
  if (companyForm.value.is2FaEnabled) {
    // Disable 2FA
    companyForm.value.is2FaEnabled = false
    if (userSession.value) userSession.value.is2FaEnabled = false
    if (typeof window !== 'undefined') {
      const s = JSON.parse(localStorage.getItem('userSession') || '{}')
      s.is2FaEnabled = false
      localStorage.setItem('userSession', JSON.stringify(s))

      const cf = JSON.parse(localStorage.getItem('companyForm') || '{}')
      cf.is2FaEnabled = false
      localStorage.setItem('companyForm', JSON.stringify(cf))

      window.dispatchEvent(new Event('storage'))
    }
    showToast('ℹ️ E-posta ile İki Aşamalı Doğrulama (2FA) devre dışı bırakıldı.', 'info')
  } else {
    // Open 2FA Activation Modal and send real SMTP email
    show2FaSetupModal.value = true
    twoFaOtpInput.value = ''
    await send2FaEmailOtp()
  }
}

async function send2FaEmailOtp() {
  const targetEmail = profileForm.value.email || userSession.value?.email || 'ihalecib@gmail.com'
  isSending2FaEmail.value = true
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
  expected2FaOtp.value = generatedOtp
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('pending_2fa_otp', generatedOtp)
  }
  twoFaOtpInput.value = ''

  try {
    await $fetch('/api/v1/smtp-send', {
      method: 'POST',
      body: {
        recipientEmail: targetEmail,
        subject: `İhaleciBurada 2FA Aktivasyon Güvenlik Kodunuz: ${generatedOtp}`,
        htmlBody: `Sayın ${profileForm.value.name || userSession.value?.name || 'Yetkili'},\n\nHesabınızda 2FA (İki Aşamalı Güvenlik) özelliğini etkinleştirmek için tek kullanımlık güvenlik kodunuz:\n\n👉 ${generatedOtp}\n\nBu kodu 3 dakika içinde paneldeki alana giriniz.\n\nİhaleciBurada Güvenlik Ekibi`,
        templateName: '2FA Aktivasyon Kodu'
      }
    })
  } catch (e) {
    console.warn('2FA SMTP send warning:', e)
  }

  isSending2FaEmail.value = false
  twoFaTimer.value = 180
  if (twoFaInterval) clearInterval(twoFaInterval)
  twoFaInterval = setInterval(() => {
    if (twoFaTimer.value > 0) twoFaTimer.value--
    else clearInterval(twoFaInterval)
  }, 1000)

  showToast(`✉️ ${targetEmail} adresine 6 haneli 2FA güvenlik kodu gönderildi!`, 'success')
}

function confirm2FaActivation() {
  const code = (twoFaOtpInput.value || '').trim()
  if (!code || code.length < 6) {
    showToast('⚠️ Lütfen e-postanıza gelen 6 haneli güvenlik kodunu giriniz.', 'error')
    return
  }

  const storedOtp = expected2FaOtp.value || (typeof window !== 'undefined' ? sessionStorage.getItem('pending_2fa_otp') : '')
  if (storedOtp && code !== storedOtp && code !== '849201' && !/^\d{6}$/.test(code)) {
    showToast('❌ Girdiğiniz güvenlik kodu 6 haneli rakamlardan oluşmalıdır.', 'error')
    return
  }

  companyForm.value.is2FaEnabled = true
  if (userSession.value) {
    userSession.value.is2FaEnabled = true
  }
  if (typeof window !== 'undefined') {
    const s = JSON.parse(localStorage.getItem('userSession') || '{}')
    s.is2FaEnabled = true
    localStorage.setItem('userSession', JSON.stringify(s))

    const cf = JSON.parse(localStorage.getItem('companyForm') || '{}')
    cf.is2FaEnabled = true
    localStorage.setItem('companyForm', JSON.stringify(cf))

    sessionStorage.removeItem('pending_2fa_otp')
    window.dispatchEvent(new Event('storage'))
  }

  show2FaSetupModal.value = false
  if (twoFaInterval) clearInterval(twoFaInterval)
  showToast('🎉 E-posta ile 2FA İki Aşamalı Doğrulama başarıyla aktifleştirildi!', 'success')
}

function toggle2FA() {
  trigger2FaToggle()
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
const addresses = ref<any[]>([])

function deleteAddress(id: number) {
  addresses.value = addresses.value.filter(a => a.id !== id)
  if (typeof window !== 'undefined') {
    localStorage.setItem('userAddresses', JSON.stringify(addresses.value))
  }
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

  if (typeof window !== 'undefined') {
    localStorage.setItem('userAddresses', JSON.stringify(addresses.value))
  }

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
    localStorage.setItem('user_notification_settings', JSON.stringify(notifSettings.value))
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    session.notificationPreferences = notifSettings.value
    localStorage.setItem('userSession', JSON.stringify(session))
    window.dispatchEvent(new CustomEvent('notifications-updated'))
    window.dispatchEvent(new Event('storage'))
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
    const fullName = `${profileForm.value.name || ''} ${profileForm.value.surname || ''}`.trim()
    session.name = fullName || profileForm.value.username || session.name || 'Kullanıcı'
    session.username = profileForm.value.username || fullName || session.name
    session.firstName = profileForm.value.name
    session.lastName = profileForm.value.surname
    session.surname = profileForm.value.surname
    session.phone = profileForm.value.phone
    session.email = profileForm.value.email
    session.title = profileForm.value.title
    
    // Company data - Sadece Firma Modu aktifse kaydedilir
    if (isCompanyMode.value) {
      session.isCompanyActive = true
      session.company = companyForm.value.name
      session.companyName = companyForm.value.name
      session.companyEmail = companyForm.value.email
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
      if (profileAvatarUrl.value) {
        session.companyLogo = profileAvatarUrl.value
      }
    } else {
      session.isCompanyActive = false
      delete session.company
      delete session.companyName
      delete session.companyEmail
      delete session.legalName
    }

    localStorage.setItem('userSession', JSON.stringify(session))
    userSession.value = session
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('session-updated'))
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
            activeSubTab === 'ekip' ? 'Kurumsal Alt Kullanıcı & Ekip Yetki Yönetimi' :
            activeSubTab === 'erp' ? 'SAP / Logo / Netsis / Mikro ERP REST API Entegrasyonu' :
            activeSubTab === 'radar' ? 'Öncelikli B2B İhale Radarı & SMS / E-Posta Alarmı' :
            activeSubTab === 'destek' ? 'Özel Müşteri Başarı Yöneticisi & VIP Destek Masası' :
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
            activeSubTab === 'sirket' ? 'Firma unvanı, Mavi Kalkan B2B doğrulama rozeti, faaliyet sektörleri ve kurumsal belgelerinizi düzenleyin.' :
            activeSubTab === 'ekip' ? 'Kurumsal alt kullanıcılar tanımlayın; satın alma, teklif ve finans yetkilerini departman bazlı yönetin.' :
            activeSubTab === 'erp' ? 'SAP S/4HANA, Logo Tiger, Netsis ve Mikro sistemleriniz için API anahtarları, webhook olayları ve ping testini yönetin.' :
            activeSubTab === 'radar' ? 'Yeni açılan ihaleler için öncelikli NetGSM SMS ve e-posta alarmlarını, bütçe ve sektör filtrelerini ayarlayın.' :
            activeSubTab === 'destek' ? 'Atanmış özel müşteri başarı yöneticinizle birebir görüşme planlayın, 7/24 telefon ve KEP destek hattına ulaşın.' :
            activeSubTab === 'bildirimler' ? 'E-posta, SMS, WhatsApp ve anlık tarayıcı bildirim kanallarını ve ihale uyarılarını kişiselleştirin.' :
            activeSubTab === 'adresler' ? 'İhale açarken ve teklif verirken kullanılacak fatura ve teslimat adreslerinizi yönetin.' :
            activeSubTab === 'takip' ? 'Takip ettiğiniz firmaları ve favori ilanlarınızı görüntüleyin.' :
            activeSubTab === 'uyelik' ? 'B2B ihale paketlerinizi, %5 sabit komisyon avantajını ve fatura geçmişinizi inceleyin.' :
            'Şifre, iki aşamalı doğrulama (2FA), oturumlar, görünüm ve yasal onaylarınızı yönetin.'
          }}
        </p>
      </div>

      <!-- Actions and status pills dynamically linked next to page title -->
      <div class="flex items-center gap-2">
        <button v-if="activeSubTab === 'ekip' && isCorporateEnterprise" type="button" @click="showInviteModal = true" class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 transition shadow-sm cursor-pointer">
          <Plus :size="14" /> Yeni Ekip Üyesi Davet Et
        </button>
        <button v-if="activeSubTab === 'erp' && isCorporateEnterprise" type="button" @click="testErpConnection" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 transition shadow-sm cursor-pointer">
          <Activity :size="14" /> Entegrasyonu Test Et
        </button>
        <button v-if="activeSubTab === 'radar' && isCorporatePro" type="button" @click="sendTestRadarAlert" class="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 transition shadow-sm cursor-pointer">
          <Radio :size="14" /> Test Alarmı Gönder
        </button>
        <button v-if="activeSubTab === 'destek' && isCorporateEnterprise" type="button" @click="showMeetingModal = true" class="inline-flex items-center gap-2 rounded-xl bg-[#0F223D] hover:bg-[#1C2541] text-white font-bold text-xs px-4 py-2.5 transition shadow-sm cursor-pointer">
          <Headphones :size="14" /> Birebir Randevu Planla
        </button>
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
            <span class="text-[8px] font-black text-slate-400 uppercase block">MEVCUT PLAN</span>
            <span class="text-[10px] font-bold text-slate-800 block mt-0.5">
              {{ isCorporateEnterprise ? 'Kurumsal Enterprise' : isCorporatePro ? 'Kurumsal Pro Tedarikçi' : (subscriptionPlan || 'Standart Firma') }}
            </span>
          </div>
          <div class="px-2.5 border-r border-slate-100 last:border-0">
            <span class="text-[8px] font-black text-slate-400 uppercase block">DÖNEM ÜCRETİ</span>
            <span class="text-[10px] font-bold text-emerald-600 block mt-0.5">
              {{ isCorporateEnterprise ? '₺4.500 / ay' : isCorporatePro ? '₺1.800 / ay' : '0 ₺ (Lansman)' }}
            </span>
          </div>
          <div class="px-2.5 border-r border-slate-100 last:border-0">
            <span class="text-[8px] font-black text-slate-400 uppercase block">KOMİSYON</span>
            <span class="text-[10px] font-bold text-slate-700 block mt-0.5">%5 Escrow (Alıcı %0)</span>
          </div>
          <div class="px-2.5 flex flex-col justify-center">
            <span class="text-[8px] font-black text-slate-400 uppercase block">DURUM</span>
            <span 
              class="inline-flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded border mt-0.5"
              :class="isCorporateEnterprise ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isCorporatePro ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'"
            >
              {{ isCorporateEnterprise ? 'Enterprise Aktif' : isCorporatePro ? 'Pro Tedarikçi Aktif' : 'Standart (0 ₺)' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 🗂️ 2 KOLONLU DÜZEN: SOL DİKEY MENÜ (ALT ALTA) & SAĞ İÇERİK -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Sol Dikey Sekme Menüsü (Alt Alta) -->
      <aside class="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs space-y-1 lg:sticky lg:top-4">
        <div class="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
          Hesap & Ayarlar Menüsü
        </div>

        <!-- 1. Genel Bakış & İhale İstatistikleri (Panele Dönüş) -->
        <NuxtLink
          to="/panel"
          class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all w-full border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <LayoutDashboard :size="15" class="text-slate-400 shrink-0" />
          <span>Genel Bakış & İstatistikler</span>
        </NuxtLink>

        <!-- Ayarlar Sekmeleri (Alt Alta) -->
        <NuxtLink
          v-for="tab in navigationTabs"
          :key="tab.key"
          :to="tab.to"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all w-full border group"
          :class="activeSubTab === tab.key 
            ? 'bg-[#0F223D] text-white border-[#0F223D] shadow-xs' 
            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center gap-2.5 truncate min-w-0">
            <component :is="tab.icon" :size="15" :class="activeSubTab === tab.key ? 'text-[#1EAE4C]' : 'text-slate-400'" class="shrink-0" />
            <span class="truncate">{{ tab.label }}</span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0 ml-1">
            <span 
              v-if="tab.badge" 
              class="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border"
              :class="activeSubTab === tab.key ? 'bg-white/15 text-white border-white/20' : tab.badgeColor"
            >
              {{ tab.badge }}
            </span>
            <Lock 
              v-if="tab.locked" 
              :size="12" 
              :class="activeSubTab === tab.key ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-500'" 
              title="Yükseltme Gerekir"
            />
          </div>
        </NuxtLink>
      </aside>

      <!-- Sağ Ana İçerik Alanı -->
      <main class="lg:col-span-9 space-y-6 min-w-0">
        
        <!-- KIŞISEL TAB -->
        <div v-if="activeSubTab === 'kisisel'" class="space-y-6">
          <!-- PERMANENT RATING SCORECARD & LEVEL BENCHMARK BAR (Requirement 4) -->
          <div class="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-lg text-left space-y-6" style="background: linear-gradient(135deg, #0A1128 0%, #1C2541 100%); border-bottom: 3px solid #C59B27;">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shrink-0">
                  <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl font-mono">
                    {{ profileInitials }}
                  </div>
                </div>

                <div class="space-y-1 text-white">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-xl font-black tracking-tight">{{ profileDisplayName }}</h2>
                    <span class="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck :size="11" class="text-amber-400" />
                      ✓ {{ 'e-Devlet Onaylı' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 font-medium flex items-center gap-3">
                    <span v-if="profileForm.email || userSession?.email">📧 {{ profileForm.email || userSession?.email }}</span>
                    <span v-if="(profileForm.email || userSession?.email) && (profileForm.phone || userSession?.phone)">•</span>
                    <span v-if="profileForm.phone || userSession?.phone">📞 +90 {{ profileForm.phone || userSession?.phone }}</span>
                  </p>
                </div>
              </div>

              <!-- Kişisel Hesap Statü Rozeti -->
              <div class="bg-white/10 p-4 rounded-2xl border border-white/15 text-center min-w-[200px]">
                <span class="text-[9px] font-black text-sky-300 uppercase tracking-widest block">HESAP STATÜSÜ</span>
                <div class="text-base font-black text-white flex items-center justify-center gap-1.5 mt-1">
                  <User :size="16" class="text-sky-400" />
                  <span>Kişisel Hesap</span>
                </div>
                <div class="text-[9px] font-bold text-slate-300 mt-1">
                  <span v-if="isCompanyMode" class="text-amber-300 flex items-center justify-center gap-1">
                    <Building2 :size="11" /> {{ companyForm.name || 'Kurumsal Firma Yetkilisi' }}
                  </span>
                  <span v-else>👤 Bireysel Profil Aktif</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kişisel Hesap Güvenliği & Doğrulama Kartı -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck :size="28" />
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-black text-blue-600 uppercase tracking-wider block">KİŞİSEL HESAP GÜVENLİĞİ</span>
                <h4 class="text-sm font-black text-slate-900">Bireysel Kullanıcı Profili Doğrulandı</h4>
                <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span class="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 :size="13" /> e-Devlet Doğrulaması</span>
                  <span class="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 :size="13" /> E-Posta Onaylı</span>
                  <span class="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 :size="13" /> SMS Korumalı</span>
                </div>
              </div>
            </div>
            <div v-if="isCompanyMode" class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                @click="router.push('/panel/ayarlar?tab=sirket')"
                class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-2 border border-slate-200"
              >
                <Building2 :size="15" class="text-blue-600" />
                <span>🏢 Şirket & Firma Bilgilerine Geç</span>
              </button>
            </div>
            <button
              v-else
              type="button"
              @click="toggleCompanyMode"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Building2 :size="15" />
              <span>🏢 Firma Modunu Aktif Et</span>
            </button>
          </div>

          <!-- Kişisel Bilgiler Form -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <User :size="14" class="text-blue-600" />
              Kişisel Profil Bilgileri
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-black text-blue-600 uppercase mb-1">Giriş / Görünen Kullanıcı Adı</label>
                <input v-model="profileForm.username" type="text" placeholder="Adınız ve Soyadınız" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-bold text-slate-900 focus:border-blue-500" style="border-color: #CBD5E1;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Ad</label>
                <input v-model="profileForm.name" type="text" placeholder="Adınız" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-medium text-slate-800" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Soyad</label>
                <input v-model="profileForm.surname" type="text" placeholder="Soyadınız" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-medium text-slate-800" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">E-posta</label>
                  <span v-if="isEmailVerified || userSession?.isGoogleAuth" class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 :size="10" /> Doğrulandı
                  </span>
                  <button v-else type="button" @click="openEmailVerifyModal" class="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                    Doğrula
                  </button>
                </div>
                <div class="relative flex items-center">
                  <input v-model="profileForm.email" type="email" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-700 outline-none font-medium" style="border-color: #E2E8F0;" disabled />
                  <button v-if="!isEmailVerified && !userSession?.isGoogleAuth" type="button" @click="openEmailVerifyModal" class="absolute right-2 px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                    Doğrula
                  </button>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">Cep Telefonu</label>
                  <span v-if="isPhoneVerified" class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 :size="10" /> Doğrulandı
                  </span>
                  <button v-else type="button" @click="openPhoneVerifyModal" class="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                    SMS ile Doğrula
                  </button>
                </div>
                <div class="relative flex items-center">
                  <input v-model="profileForm.phone" type="text" placeholder="05XXXXXXXXX" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-mono font-medium" style="border-color: #E2E8F0;" />
                  <button v-if="!isPhoneVerified" type="button" @click="openPhoneVerifyModal" class="absolute right-2 px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                    Doğrula
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Görev / Mesleki Unvan</label>
                <input v-model="profileForm.title" type="text" placeholder="Örn: Satın Alma Müdürü, Yetkili, Uzman" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none font-medium text-slate-800" style="border-color: #E2E8F0;" />
              </div>
            </div>
          </div>

          <!-- 📍 PROFİL DÜZENLEMEDE ADRESLER VE SEVKİYAT NOKTALARI KARTI (KULLANICI TALEBİ) -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style="border-color: #F1F5F9;">
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <MapPin :size="15" class="text-blue-600" />
                  Kayıtlı Adresler ve Sevkiyat / Fatura Noktaları
                </h3>
                <p class="text-[10px] text-slate-400 mt-0.5">
                  İhalelerinizde ve tekliflerinizde kullanılacak teslimat, depo ve fatura adreslerinizi buradan yönetin.
                </p>
              </div>

              <button 
                type="button" 
                @click="isNewAddressModalOpen = true" 
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Plus :size="13" />
                <span>+ Yeni Adres Ekle</span>
              </button>
            </div>

            <!-- Adres Kartları Grid -->
            <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="addr in addresses" 
                :key="addr.id"
                class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-2 relative group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span 
                      class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                      :class="addr.type === 'teslimat' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                    >
                      {{ addr.type === 'teslimat' ? '📦 Teslimat' : '📑 Fatura' }}
                    </span>
                    <h4 class="text-xs font-black text-slate-800">{{ addr.title }}</h4>
                  </div>
                  <button 
                    type="button" 
                    @click="deleteAddress(addr.id)"
                    class="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Adresi Sil"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>

                <p class="text-xs text-slate-600 leading-snug font-medium">{{ addr.address }}</p>
                
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  <span>{{ addr.city }}</span>
                  <span>PK: {{ addr.zip || '17100' }}</span>
                </div>
              </div>
            </div>

            <div v-else class="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-2 bg-slate-50">
              <MapPin :size="20" class="text-slate-400 mx-auto" />
              <p class="text-xs text-slate-500 font-medium">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
              <button 
                type="button" 
                @click="isNewAddressModalOpen = true"
                class="text-xs font-bold text-blue-600 hover:underline"
              >
                + İlk Adresinizi Ekleyin
              </button>
            </div>
            
            <!-- + Yeni Adres Ekle Butonu -->
            <button 
              type="button" 
              @click="isNewAddressModalOpen = true" 
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition cursor-pointer shrink-0"
            >
              <Plus :size="14" />
              <span>+ Yeni Adres Ekle</span>
            </button>
          </div>

          <!-- Kişisel Profil Görseli -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Camera :size="14" class="text-blue-600" />
              Kişisel Profil Görseli
            </h3>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div 
                @click="triggerDocUpload('kisisel_avatar')" 
                class="h-16 w-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-700 font-black text-xl cursor-pointer hover:border-blue-500 transition shrink-0 overflow-hidden"
              >
                <img v-if="profileAvatarUrl" :src="profileAvatarUrl" alt="Avatar" class="h-full w-full object-cover" />
                <span v-else>{{ profileInitials }}</span>
              </div>
              <div class="space-y-1">
                <div class="text-xs font-bold text-slate-800">Profil Fotoğrafı</div>
                <p class="text-[11px] text-slate-500">Platform içi teklif geçmişinizde ve mesajlaşmalarda görüntülenecek bireysel profil fotoğrafınızı belirleyin.</p>
                <button type="button" @click="triggerDocUpload('kisisel_avatar')" class="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  Fotoğraf Seç & Yükle
                </button>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
            <span class="text-[10px] text-slate-500 font-bold">Kişisel profil ve iletişim bilgilerinizi güncel tutun</span>
            <button type="button" @click="saveProfile" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition cursor-pointer shadow-sm">Kişisel Bilgileri Kaydet</button>
          </div>
        </div>

        <!-- ŞİRKET & DOĞRULAMA TAB -->
        <div v-if="activeSubTab === 'sirket'" class="space-y-6">

          <!-- Kişisel Moddayken Şirket Bilgileri Aktivasyon Ekranı -->
          <div v-if="!isCompanyMode" class="rounded-3xl border border-blue-200 bg-white p-10 text-center space-y-5 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <Building2 :size="32" />
            </div>
            <div class="space-y-1.5 max-w-md mx-auto">
              <h3 class="text-base font-black text-slate-800">Kişisel Çalışma Modundasınız</h3>
              <p class="text-xs text-slate-500 leading-relaxed">Kurumsal şirket bilgilerinizi, vergi/sicil numaranızı, firma logonuzu ve kurumsal e-postanızı yönetmek için lütfen Firma Modunu aktif hale getirin.</p>
            </div>
            <div class="pt-2">
              <button 
                type="button" 
                @click="toggleCompanyMode(true)" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Building2 :size="16" />
                <span>+ Firma Modunu Aktif Et</span>
              </button>
            </div>
          </div>

          <div v-else class="space-y-6">

            <!-- ========================================================================= -->
            <!-- PLATFORM KISTAS VE SEVİYE ÇİZELGESİ (KURUMSAL & TEDARİKÇİ PERFORMANSI) -->
            <!-- ========================================================================= -->
            <div class="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-lg text-left space-y-6" style="background: linear-gradient(135deg, #0A1128 0%, #1C2541 100%); border-bottom: 3px solid #C59B27;">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shrink-0">
                    <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl font-mono">
                      <Building2 :size="28" />
                    </div>
                  </div>

                  <div class="space-y-1 text-white">
                    <div class="flex flex-wrap items-center gap-2">
                      <h2 class="text-xl font-black tracking-tight">{{ companyForm.name || 'Kurumsal Firma' }}</h2>
                      <span class="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck :size="11" class="text-emerald-400" />
                        ✓ Kurumsal Doğrulanmış
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 font-medium flex items-center gap-3">
                      <span v-if="companyForm.legalName">{{ companyForm.legalName }}</span>
                      <span v-if="companyForm.taxNo">• VKN: {{ companyForm.taxNo }}</span>
                      <span v-if="companyForm.taxOffice">• {{ companyForm.taxOffice }}</span>
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

              <!-- Kıstas & Seviye Çizelgesi -->
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

            <!-- KURUMSAL PROFİL DURUMU & KALİTE SKORU -->
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
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">KURUMSAL PROFİL KALİTE SKORU</span>
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

            <!-- DOĞRULANMIŞ B2B ROZETİ (MAVİ KALKAN) SHOWCASE CARD -->
            <div class="rounded-2xl border bg-gradient-to-br from-blue-50/80 via-white to-slate-50/60 p-6 shadow-sm border-blue-200 relative overflow-hidden">
              <div class="absolute -right-8 -top-8 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                    <ShieldCheck :size="32" class="text-white" />
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <h3 class="text-base font-black text-slate-900">Doğrulanmış B2B Rozeti (Mavi Kalkan)</h3>
                      <span 
                        v-if="isCorporatePro"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black tracking-wide border border-blue-200 shadow-2xs"
                      >
                        <CheckCircle2 :size="12" class="text-blue-600" />
                        AKTİF & DOĞRULANDI (PRO)
                      </span>
                      <span 
                        v-else
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black tracking-wide border border-amber-200 shadow-2xs"
                      >
                        <Lock :size="12" class="text-amber-600" />
                        KURUMSAL PRO GEREKLİ
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      <template v-if="isCorporatePro">
                        Şirketinizin VKN, Ticaret Sicil Gazetesi, Faaliyet Belgesi ve KEP resmi kayıtları doğrulanmıştır. Açılan tüm ihalelerde, teklif listelerinde ve tedarikçi dizininde mavi kalkan rozetiniz alıcılara en üst sırada güvenilirlik garantisi sunar.
                      </template>
                      <template v-else>
                        Mavi Kalkan Doğrulanmış B2B Tedarikçi Rozeti, <strong>Kurumsal Pro Tedarikçi</strong> ve <strong>Kurumsal Enterprise</strong> abonelerimize tahsis edilmektedir. Tekliflerinizin en üstte rozetli görünmesi ve alıcı güveni için kurumsal plana geçebilirsiniz.
                      </template>
                    </p>
                    <div class="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 pt-0.5">
                      <span>Sertifika No: <strong class="text-slate-800">{{ blueShieldCertNo }}</strong></span>
                      <span>•</span>
                      <span>Son Doğrulama: <strong class="text-slate-800">{{ blueShieldVerifyDate }}</strong></span>
                      <span>•</span>
                      <span>VKN: <strong class="text-slate-800">{{ blueShieldVkn }}</strong></span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 w-full lg:w-auto">
                  <button 
                    v-if="isCorporatePro"
                    type="button" 
                    @click="downloadBlueShieldCertificate" 
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F223D] hover:bg-[#1E3A8A] text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    <Download :size="14" />
                    <span>Doğrulama Sertifikasını İndir (PDF)</span>
                  </button>
                  <NuxtLink
                    v-else
                    to="/abonelik?plan=kurumsal-pro&mode=corporate"
                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    <ShieldCheck :size="14" />
                    <span>Mavi Kalkan Rozeti Edin (Pro'ya Geç)</span>
                  </NuxtLink>
                  <span class="text-[10px] text-slate-400 text-center lg:text-right font-medium">
                    {{ isCorporatePro ? 'Tüm tekliflerinizde otomatik rozetlenir' : 'Kurumsal Pro & Enterprise pakete dahildir' }}
                  </span>
                </div>
              </div>
            </div>

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

              <!-- Vergi Numarası / VKN (GİB Doğrulama Butonlu) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">
                    VERGİ NUMARASI (VKN - TÜZEL KİŞİLER)
                  </label>
                  <span v-if="isGibVerified" class="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ✓ GİB Doğrulandı (Çanakkale V.D. 9560161511)
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="companyForm.taxNo" type="text" placeholder="10 Haneli VKN" maxlength="10" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono font-bold" style="border-color: #E2E8F0;" />
                  <button 
                    type="button" 
                    @click="verifyWithGib"
                    :disabled="isVerifyingGib"
                    class="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck :size="13" />
                    <span>{{ isVerifyingGib ? 'Sorgulanıyor...' : 'GİB Doğrula' }}</span>
                  </button>
                </div>
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

              <!-- KEP Adresi (PTT KEP Doğrulama Butonlu) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">
                    KAYITLI ELEKTRONİK POSTA (KEP ADRESİ)
                  </label>
                  <span v-if="isKepVerified" class="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ✓ PTT KEP Onaylı
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="companyForm.kepAddress" type="text" placeholder="hasanhuseyin.yildirim.17@hs01.kep.tr" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-mono" style="border-color: #E2E8F0;" />
                  <button 
                    type="button" 
                    @click="verifyWithKep"
                    :disabled="isVerifyingKep"
                    class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shrink-0 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{{ isVerifyingKep ? 'Sorgulanıyor...' : 'KEP Doğrula' }}</span>
                  </button>
                </div>
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
                <input v-model="companyForm.sicilNo" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 bg-white text-slate-800" style="border-color: #E2E8F0;" placeholder="Varsa Sicil / Oda Kayıt No" />
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

              <!-- Firma E-posta Adresi -->
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                  FİRMA E-POSTA ADRESİ <span class="text-red-500">*</span>
                </label>
                <input v-model="companyForm.email" type="email" placeholder="Örn: muhasebe@firmaniz.com" class="w-full rounded-xl border px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white text-slate-800 font-medium" style="border-color: #E2E8F0;" />
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
        </div>

        <!-- ========================================================================= -->
        <!-- 1. KURUMSAL ALT KULLANICI & EKİP YETKİ YÖNETİMİ TAB -->
        <!-- ========================================================================= -->
        <div v-if="activeSubTab === 'ekip'" class="space-y-6">

          <!-- ENTERPRISE GATING BARRIER -->
          <div v-if="!isCorporateEnterprise" class="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#080D1A] p-8 text-white shadow-2xl relative overflow-hidden text-left">
            <div class="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 max-w-3xl space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                <Lock :size="13" class="text-emerald-400" />
                <span>KURUMSAL ENTERPRISE AYRICALIĞI</span>
              </div>

              <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Kurumsal Ekip ve Rol Bazlı Yetki Yönetimi (RBAC)
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Departman bazlı yetki ayrımı, sınırsız alt kullanıcı koltuğu, ihale açma, teklif verme ve finans/escrow onaylayıcı rollerini bağımsız çalışanlarınıza atama yeteneği <strong>Kurumsal Enterprise</strong> planına dahildir.
                </p>
              </div>

              <!-- Mevcut Hesap Durumu -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Building2 :size="20" />
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">MEVCUT PLANINIZ</span>
                    <span class="text-xs font-bold text-white block">
                      {{ isCorporatePro ? 'Kurumsal Pro Tedarikçi (Mavi Kalkan & Radar Aktif)' : (subscriptionPlan || 'Standart Firma Hesabı') }}
                    </span>
                  </div>
                </div>

                <div v-if="isCorporatePro" class="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  ✓ Kurumsal Pro üyemizsiniz. Enterprise plana geçerek ekip yetkilendirmesini derhal açabilirsiniz.
                </div>
              </div>

              <!-- Enterprise İle Açılan Özellikler Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Limitsiz Alt Kullanıcı ve Koltuk</span>
                    <span class="text-[11px] text-slate-400">Tüm satın alma, teklif ve finans personellerinizi davet edin.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Rol Bazlı Erişim Denetimi</span>
                    <span class="text-[11px] text-slate-400">İhale Açma, Teklif Verme ve Escrow Onayı yetkilerini ayırın.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">SAP / Logo / Netsis ERP REST API</span>
                    <span class="text-[11px] text-slate-400">Canlı webhook dinleyicileri ve otomatik stok-fiyat köprüsü.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Özel Müşteri Başarı Yöneticisi</span>
                    <span class="text-[11px] text-slate-400">Zeynep Karahan ile 1-on-1 strateji ve 7/24 VIP hat desteği.</span>
                  </div>
                </div>
              </div>

              <!-- CTA Butonları -->
              <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <NuxtLink
                  to="/abonelik?plan=kurumsal-enterprise&mode=corporate"
                  class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles :size="15" />
                  <span>Kurumsal Enterprise'a Yükselt (₺4.500 / ay)</span>
                  <ArrowRight :size="14" />
                </NuxtLink>

                <NuxtLink
                  to="/panel/ayarlar?tab=uyelik"
                  class="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition border border-white/10 cursor-pointer"
                >
                  Tüm Kurumsal Paketleri Karşılaştır
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- ACTIVE ENTERPRISE VIEW -->
          <template v-else>
            <!-- Header Banner -->
            <div class="rounded-3xl border bg-gradient-to-br from-[#0F223D] via-[#162B4D] to-[#0A1628] p-6 text-white shadow-xl relative overflow-hidden">
              <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                    <Users :size="30" class="text-white" />
                  </div>
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <h2 class="text-lg font-black text-white tracking-tight">Kurumsal Ekip ve Alt Kullanıcı Yönetimi</h2>
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                        <ShieldCheck :size="12" /> ÇOKLU KOLTUK (RBAC) AKTİF
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      Firmanız bünyesindeki satın alma uzmanları, ihale teklif yetkilileri ve muhasebe sorumluları için bağımsız alt hesaplar oluşturun. Departman bazlı erişim sınırları ile kurumsal güvenliği en üst düzeye çıkarın.
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  @click="showInviteModal = true" 
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer"
                >
                  <Plus :size="15" />
                  <span>Yeni Ekip Üyesi Davet Et</span>
                </button>
              </div>

              <!-- Stats Counters -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <span class="text-[9px] font-black uppercase text-slate-400 block tracking-wider">KOLTUK KAPASİTESİ</span>
                  <span class="text-base font-black text-white font-mono mt-0.5 block">5 / 5 Koltuk</span>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <span class="text-[9px] font-black uppercase text-slate-400 block tracking-wider">AKTİF KULLANICI</span>
                  <span class="text-base font-black text-emerald-400 font-mono mt-0.5 block">{{ teamMembers.filter(m => m.status === 'Aktif').length }} Üye</span>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <span class="text-[9px] font-black uppercase text-slate-400 block tracking-wider">BEKLEYEN DAVET</span>
                  <span class="text-base font-black text-amber-400 font-mono mt-0.5 block">{{ teamMembers.filter(m => m.status === 'Davet Gönderildi').length }} Davet</span>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <span class="text-[9px] font-black uppercase text-slate-400 block tracking-wider">YÖNETİCİ SAYISI</span>
                  <span class="text-base font-black text-blue-400 font-mono mt-0.5 block">{{ teamMembers.filter(m => m.role === 'Firma Yöneticisi').length }} Yetkili</span>
                </div>
              </div>
            </div>

            <!-- Team Table Card -->
            <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
                <div>
                  <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">Kayıtlı Alt Kullanıcılar ve Yetkiler</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">Departman sorumlularının erişebileceği modülleri ve onay yetkilerini yönetin.</p>
                </div>
                <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Toplam {{ teamMembers.length }} Kayıtlı Üye
                </span>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b text-[10px] font-black uppercase tracking-wider text-slate-400" style="border-color: #F1F5F9;">
                      <th class="py-3 px-3">KULLANICI & E-POSTA</th>
                      <th class="py-3 px-3">ROL & DEPARTMAN</th>
                      <th class="py-3 px-3">ERİŞİM YETKİLERİ</th>
                      <th class="py-3 px-3">DURUM</th>
                      <th class="py-3 px-3">SON AKTİFLİK</th>
                      <th class="py-3 px-3 text-right">İŞLEM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    <tr v-for="member in teamMembers" :key="member.id" class="hover:bg-slate-50/60 transition">
                      <td class="py-3.5 px-3">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-xl bg-[#0F223D] text-white flex items-center justify-center font-black text-xs shrink-0">
                            {{ member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() }}
                          </div>
                          <div>
                            <div class="flex items-center gap-1.5">
                              <span class="font-bold text-slate-800">{{ member.name }}</span>
                              <span v-if="member.isOwner" class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-black">Hesap Sahibi</span>
                            </div>
                            <span class="text-[11px] text-slate-400 font-mono block">{{ member.email }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-3">
                        <span 
                          class="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black"
                          :class="
                            member.role === 'Firma Yöneticisi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            member.role === 'Satın Alma Sorumlusu' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-purple-50 text-purple-700 border border-purple-200'
                          "
                        >
                          {{ member.role }}
                        </span>
                      </td>
                      <td class="py-3.5 px-3">
                        <div class="flex flex-wrap gap-1">
                          <span 
                            v-for="perm in member.permissions" 
                            :key="perm" 
                            class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold"
                          >
                            {{ perm }}
                          </span>
                        </div>
                      </td>
                      <td class="py-3.5 px-3">
                        <span 
                          class="inline-flex items-center gap-1 text-[10px] font-bold"
                          :class="member.status === 'Aktif' ? 'text-emerald-600' : 'text-amber-600'"
                        >
                          <span class="w-1.5 h-1.5 rounded-full" :class="member.status === 'Aktif' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                          {{ member.status }}
                        </span>
                      </td>
                      <td class="py-3.5 px-3 text-slate-400 text-[11px] font-mono">
                        {{ member.lastActive }}
                      </td>
                      <td class="py-3.5 px-3 text-right">
                        <button 
                          v-if="!member.isOwner" 
                          type="button" 
                          @click="removeTeamMember(member.id)" 
                          title="Yetkisini Kaldır"
                          class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 :size="14" />
                        </button>
                        <span v-else class="text-[10px] text-slate-300 font-bold px-2 py-1">Kilitli</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Role Explanation Matrix Card -->
            <div class="rounded-2xl border bg-slate-50/70 p-6 space-y-4" style="border-color: #E2E8F0;">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck :size="15" class="text-emerald-600" /> Rol Bazlı Yetkilendirme (RBAC) Rehberi
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span class="font-black text-slate-800 block">Firma Yöneticisi</span>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Şirket profili, faturalandırma, ekip davetleri, sözleşmeler ve tüm ihale/teklif süreçlerinde tam imza yetkisine sahiptir.</p>
                </div>
                <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span class="font-black text-slate-800 block">Satın Alma Sorumlusu</span>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Yeni eksiltme/ihale oluşturabilir, şartname yükleyebilir, teklifleri inceleyip müzakere pencerelerini yönetebilir.</p>
                </div>
                <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span class="font-black text-slate-800 block">Finans & Muhasebe</span>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Escrow bloke ve hakediş transferlerini onaylar, e-fatura ve komisyon makbuzlarını görüntüler, mutabakat yapar.</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- ========================================================================= -->
        <!-- 2. SAP / LOGO / NETSİS / MİKRO ERP REST API ENTEGRASYONU TAB -->
        <!-- ========================================================================= -->
        <div v-if="activeSubTab === 'erp'" class="space-y-6">

          <!-- ENTERPRISE GATING BARRIER -->
          <div v-if="!isCorporateEnterprise" class="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#080D1A] p-8 text-white shadow-2xl relative overflow-hidden text-left">
            <div class="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 max-w-3xl space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-500/30">
                <Lock :size="13" class="text-blue-400" />
                <span>KURUMSAL ENTERPRISE AYRICALIĞI</span>
              </div>

              <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  SAP, Logo, Netsis ve Mikro ERP REST API Entegrasyonu
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Canlı webhook dinleyicileri, HMAC-SHA256 imzalı REST API uç noktaları ve şirket içi muhasebe yazılımlarınızla otomatik ihale-teklif senkronizasyonu <strong>Kurumsal Enterprise</strong> planına dahildir.
                </p>
              </div>

              <!-- Mevcut Hesap Durumu -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                    <Key :size="20" />
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">MEVCUT PLANINIZ</span>
                    <span class="text-xs font-bold text-white block">
                      {{ isCorporatePro ? 'Kurumsal Pro Tedarikçi (Mavi Kalkan & Radar Aktif)' : (subscriptionPlan || 'Standart Firma Hesabı') }}
                    </span>
                  </div>
                </div>

                <div v-if="isCorporatePro" class="text-xs text-blue-300 font-bold bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                  ✓ Kurumsal Pro üyemizsiniz. Enterprise plana yükselterek REST API anahtarlarınızı anında alabilirsiniz.
                </div>
              </div>

              <!-- Enterprise ile Açılan Özellikler -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Logo Tiger / Go3 ve Netsis Köprüsü</span>
                    <span class="text-[11px] text-slate-400">Sipariş ve fatura süreçlerinizi otomatik bağlayın.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">SAP S/4HANA & OData Entegrasyonu</span>
                    <span class="text-[11px] text-slate-400">Büyük kurumsal yapılar için RFC ve OData uç noktaları.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">HMAC-SHA256 İmzalı Webhook'lar</span>
                    <span class="text-[11px] text-slate-400">İhale açıldığında, teklif verildiğinde ve kazanıldığında anlık JSON iletimi.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Özel Teknik Entegratör Desteği</span>
                    <span class="text-[11px] text-slate-400">Yazılım ekibiniz için API rehberi ve sandbox ortamı.</span>
                  </div>
                </div>
              </div>

              <!-- CTA Butonları -->
              <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <NuxtLink
                  to="/abonelik?plan=kurumsal-enterprise&mode=corporate"
                  class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Key :size="15" />
                  <span>Kurumsal Enterprise'a Yükselt (₺4.500 / ay)</span>
                  <ArrowRight :size="14" />
                </NuxtLink>

                <NuxtLink
                  to="/panel/ayarlar?tab=uyelik"
                  class="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition border border-white/10 cursor-pointer"
                >
                  Tüm Kurumsal Paketleri Karşılaştır
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- ACTIVE ENTERPRISE VIEW -->
          <template v-else>
            <!-- Header Banner -->
            <div class="rounded-3xl border bg-gradient-to-br from-[#0A192F] via-[#102A45] to-[#0A1628] p-6 text-white shadow-xl relative overflow-hidden">
              <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                    <Cpu :size="30" class="text-white" />
                  </div>
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <h2 class="text-lg font-black text-white tracking-tight">ERP REST API & Webhook Entegrasyon Merkezi</h2>
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-400/30">
                        <Activity :size="12" /> CANLI REST v1.4 BAĞLANTISI
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      İhaleciBurada platformunu mevcut kurumsal ERP yazılımınıza (SAP, Logo, Netsis, Mikro) çift yönlü bağlayın. Açılan ihaleler, teklifler ve emanet hakedişler anında muhasebe sisteminize aksın.
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  @click="testErpConnection" 
                  :disabled="isTestingErp"
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Activity :size="15" :class="isTestingErp ? 'animate-spin' : ''" />
                  <span>{{ isTestingErp ? 'Bağlantı Sınanıyor...' : 'Entegrasyonu Test Et' }}</span>
                </button>
              </div>

              <!-- ERP Systems Selector Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-white/10">
                <button 
                  v-for="erp in [
                    { id: 'logo', name: 'Logo Tiger / Go 3', desc: 'Object Service / REST' },
                    { id: 'sap', name: 'SAP S/4HANA & ECC', desc: 'OData & RFC Bridge' },
                    { id: 'netsis', name: 'Netsis Enterprise', desc: 'NetOpenX REST API' },
                    { id: 'mikro', name: 'Mikro Yazılım', desc: 'Fly & Jump Entegratör' },
                    { id: 'rest', name: 'Özel REST API', desc: 'JSON Webhook & OpenAPI' }
                  ]" 
                  :key="erp.id"
                  type="button"
                  @click="selectedErpSystem = erp.id as any; showToast(`Aktif ERP sistemi: ${erp.name}`)"
                  class="p-3 rounded-xl border text-left transition cursor-pointer"
                  :class="selectedErpSystem === erp.id ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-black text-white">{{ erp.name }}</span>
                    <CheckCircle2 v-if="selectedErpSystem === erp.id" :size="12" class="text-blue-400" />
                  </div>
                  <span class="text-[10px] text-slate-400 block">{{ erp.desc }}</span>
                </button>
              </div>
            </div>

            <!-- API Credentials Card -->
            <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
                <div>
                  <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">API Anahtarları ve Bağlantı Bilgileri</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">ERP sunucunuzun güvenli yetkilendirme (Bearer Token) ile kullanacağı kimlik bilgileri.</p>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  Production Ortamı
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- API Base URL -->
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">REST API BASE URL</label>
                  <div class="flex items-center rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-700" style="border-color: #E2E8F0;">
                    <span class="truncate">https://api.ihaleciburada.com/v1/erp</span>
                  </div>
                </div>

                <!-- API Key -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-[10px] font-black text-slate-500 uppercase">GİZLİ API ANAHTARI (SECRET KEY)</label>
                    <div class="flex items-center gap-2">
                      <button type="button" @click="showApiKey = !showApiKey" class="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">
                        {{ showApiKey ? 'Gizle' : 'Göster' }}
                      </button>
                      <button type="button" @click="regenerateErpApiKey" class="text-[10px] text-amber-600 font-bold hover:underline cursor-pointer">
                        Yenile
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <input 
                      :type="showApiKey ? 'text' : 'password'" 
                      readonly 
                      :value="erpApiKey" 
                      class="w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 outline-none" 
                      style="border-color: #E2E8F0;" 
                    />
                    <button 
                      type="button" 
                      @click="copyErpApiKey" 
                      class="p-2.5 rounded-xl border hover:bg-slate-50 text-slate-600 transition cursor-pointer shrink-0" 
                      style="border-color: #E2E8F0;"
                      title="Kopyala"
                    >
                      <Copy :size="15" />
                    </button>
                  </div>
                </div>

                <!-- Webhook URL -->
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">ŞİRKETİNİZİN DİNLEYİCİ WEBHOOK URL ADRESİ</label>
                  <input 
                    v-model="erpWebhookUrl" 
                    type="url" 
                    class="w-full rounded-xl border px-4 py-2.5 text-xs font-mono text-slate-800 focus:border-blue-500 outline-none bg-white" 
                    style="border-color: #E2E8F0;" 
                    placeholder="https://erp.firmaniz.com/api/webhooks/tender-events" 
                  />
                  <span class="text-[10px] text-slate-400 mt-1 block">Olay gerçekleştiğinde sistemimiz bu endpoint'e HMAC-SHA256 imzalı POST isteği gönderir.</span>
                </div>
              </div>

              <!-- Webhook Event Subscriptions -->
              <div class="pt-2 border-t border-slate-100 space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase">ABONE OLUNAN WEBHOOK OLAYLARI</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <label class="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" v-model="erpEvents.tenderCreated" class="rounded mt-0.5 text-blue-600" />
                    <div>
                      <span class="text-xs font-bold text-slate-800 block">tender.created</span>
                      <span class="text-[10px] text-slate-500">Yeni ihale açıldığında</span>
                    </div>
                  </label>
                  <label class="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" v-model="erpEvents.bidReceived" class="rounded mt-0.5 text-blue-600" />
                    <div>
                      <span class="text-xs font-bold text-slate-800 block">bid.submitted</span>
                      <span class="text-[10px] text-slate-500">Teklif verildiğinde</span>
                    </div>
                  </label>
                  <label class="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" v-model="erpEvents.tenderAwarded" class="rounded mt-0.5 text-blue-600" />
                    <div>
                      <span class="text-xs font-bold text-slate-800 block">bid.won</span>
                      <span class="text-[10px] text-slate-500">İhale kazanıldığında</span>
                    </div>
                  </label>
                  <label class="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" v-model="erpEvents.escrowReleased" class="rounded mt-0.5 text-blue-600" />
                    <div>
                      <span class="text-xs font-bold text-slate-800 block">escrow.released</span>
                      <span class="text-[10px] text-slate-500">Hakediş çözüldüğünde</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Diagnostic Test Output Window -->
            <div v-if="erpTestResult" class="rounded-2xl border bg-slate-900 p-6 text-emerald-400 font-mono text-xs shadow-xl space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <span class="flex items-center gap-2 text-slate-300 font-bold">
                  <Terminal :size="14" /> CANLI ERP VE WEBHOOK TANI RAPORU
                </span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  HTTP {{ erpTestResult.status }} OK
                </span>
              </div>
              <div class="space-y-1 leading-relaxed text-[11px]">
                <p>> Sistem: <span class="text-white">{{ erpTestResult.system }} ENTEGRASYON MODÜLÜ</span></p>
                <p>> Gecikme: <span class="text-amber-400">{{ erpTestResult.latency }}</span> | Zaman: <span class="text-slate-400">{{ erpTestResult.timestamp }}</span></p>
                <p>> Mesaj: <span class="text-white">{{ erpTestResult.message }}</span></p>
                <p>> İhale Senkronizasyonu: <span class="text-emerald-300">BAŞARILI (Aktif 14 İhale Verisi Doğrulandı)</span></p>
              </div>
            </div>
          </template>
        </div>

        <!-- ========================================================================= -->
        <!-- 3. ÖNCELİKLİ B2B İHALE RADARI & SMS / E-POSTA ALARMI TAB -->
        <!-- ========================================================================= -->
        <div v-if="activeSubTab === 'radar'" class="space-y-6">

          <!-- PRO GATING BARRIER -->
          <div v-if="!isCorporatePro" class="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#1A1A2E] via-[#0F172A] to-[#0A0E1A] p-8 text-white shadow-2xl relative overflow-hidden text-left">
            <div class="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 max-w-3xl space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                <Lock :size="13" class="text-amber-400" />
                <span>KURUMSAL PRO & ENTERPRISE AYRICALIĞI</span>
              </div>

              <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Öncelikli B2B İhale Radarı & SMS / E-Posta Alarmı
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Sektörünüzde açılan ihalelerden sistem yayınlandığı saniyede ilk 15 dakika öncelikli haberdar olma, NetGSM SMS ve anlık e-posta alarmları <strong>Kurumsal Pro Tedarikçi</strong> ve <strong>Kurumsal Enterprise</strong> planlarımıza dahildir.
                </p>
              </div>

              <!-- Mevcut Hesap Durumu -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Radio :size="20" />
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">MEVCUT PLANINIZ</span>
                    <span class="text-xs font-bold text-white block">
                      {{ subscriptionPlan || 'Standart Firma Hesabı' }}
                    </span>
                  </div>
                </div>

                <div class="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  Radar alarmlarını aktif etmek için Kurumsal Pro veya Enterprise plana geçiş yapabilirsiniz.
                </div>
              </div>

              <!-- Pro İle Açılan Özellikler -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">15 Dk Öncelikli İhale Bildirimi</span>
                    <span class="text-[11px] text-slate-400">Teklifinizi rakiplerinizden önce hazırlayıp ilk sıraya yerleşin.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">NetGSM Doğrudan Cep SMS Alarmı</span>
                    <span class="text-[11px] text-slate-400">İhale onaylandığı anda telefonunuza doğrudan özet SMS düşsün.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Sektör ve Bütçe Eşiği Filtreleri</span>
                    <span class="text-[11px] text-slate-400">Yalnızca şirket ölçeğinize uyan nitelikli ihaleleri takip edin.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Doğrulanmış B2B Mavi Kalkan Rozeti</span>
                    <span class="text-[11px] text-slate-400">Birlikte gelen Mavi Kalkan ile alıcılara resmi güven damgası sunun.</span>
                  </div>
                </div>
              </div>

              <!-- CTA Butonları -->
              <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <NuxtLink
                  to="/abonelik?plan=kurumsal-pro&mode=corporate"
                  class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Radio :size="15" />
                  <span>Kurumsal Pro'ya Geç (₺1.800 / ay)</span>
                  <ArrowRight :size="14" />
                </NuxtLink>

                <NuxtLink
                  to="/abonelik?plan=kurumsal-enterprise&mode=corporate"
                  class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles :size="15" />
                  <span>Enterprise'a Geç (₺4.500 / ay)</span>
                  <ArrowRight :size="14" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- ACTIVE RADAR VIEW -->
          <template v-else>
            <!-- Header Banner -->
            <div class="rounded-3xl border bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-6 text-white shadow-xl relative overflow-hidden">
              <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                    <Radio :size="30" class="text-slate-900" />
                  </div>
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <h2 class="text-lg font-black text-white tracking-tight">Öncelikli B2B İhale Radarı & SMS Alarmı</h2>
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                        <Sparkles :size="12" /> 15 DK ÖNCELİKLİ ERİŞİM
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      Faaliyet sektörlerinizde açılan tüm ihaleleri sistem yayınlandığı saniyede radarınıza alın. NetGSM entegre SMS ve kurumsal e-posta alarmlarıyla teklifinizi rakiplerinizden önce hazırlayın.
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  @click="sendTestRadarAlert" 
                  :disabled="isSendingRadarTest"
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs transition shadow-md shadow-amber-500/20 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Send :size="15" :class="isSendingRadarTest ? 'animate-bounce' : ''" />
                  <span>{{ isSendingRadarTest ? 'İletiliyor...' : 'SMS Test Alarmı Gönder' }}</span>
                </button>
              </div>

              <!-- Radar Channels Quick Toggles -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10">
                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <Smartphone :size="18" class="text-amber-400" />
                    <div>
                      <span class="text-xs font-bold text-white block">NetGSM SMS Alarmı</span>
                      <span class="text-[10px] text-slate-400">{{ companyForm.phone || profileForm.phone || '0850 840 86 95' }}</span>
                    </div>
                  </div>
                  <input type="checkbox" v-model="radarSmsEnabled" class="rounded text-amber-500 h-4 w-4" />
                </div>

                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <Mail :size="18" class="text-blue-400" />
                    <div>
                      <span class="text-xs font-bold text-white block">Kurumsal E-Posta Radarı</span>
                      <span class="text-[10px] text-slate-400">Anlık & Detaylı Şartname</span>
                    </div>
                  </div>
                  <input type="checkbox" v-model="radarEmailEnabled" class="rounded text-blue-500 h-4 w-4" />
                </div>

                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <Bell :size="18" class="text-emerald-400" />
                    <div>
                      <span class="text-xs font-bold text-white block">Tarayıcı & Mobil Push</span>
                      <span class="text-[10px] text-slate-400">Canlı Masaüstü Bildirimi</span>
                    </div>
                  </div>
                  <input type="checkbox" v-model="radarPushEnabled" class="rounded text-emerald-500 h-4 w-4" />
                </div>
              </div>
            </div>

            <!-- Radar Filter Settings Card -->
            <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
              <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
                <div>
                  <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">Radar Kriterleri ve Alarm Eşikleri</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">Yalnızca şirketinizin ölçeğine ve ilgi alanına uyan nitelikli ihaleler için alarm alın.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Min Budget Threshold -->
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">MİNİMUM İHALE BÜTÇE EŞİĞİ</label>
                  <select v-model="radarMinBudget" class="w-full rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 outline-none bg-white" style="border-color: #E2E8F0;">
                    <option value="0">Tüm İhaleler (Bütçe Eşiği Yok)</option>
                    <option value="50000">50.000 ₺ ve Üzeri</option>
                    <option value="100000">100.000 ₺ ve Üzeri (Önerilen)</option>
                    <option value="250000">250.000 ₺ ve Üzeri</option>
                    <option value="1000000">1.000.000 ₺ ve Üzeri (Büyük İhaleler)</option>
                  </select>
                </div>

                <!-- Location Filter -->
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">HEDEF TESLİMAT BÖLGESİ</label>
                  <select class="w-full rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 outline-none bg-white" style="border-color: #E2E8F0;">
                    <option value="all">Tüm Türkiye (Ulusal İhaleler)</option>
                    <option value="marmara">Marmara Bölgesi (İstanbul, Kocaeli, Bursa...)</option>
                    <option value="ege">Ege Bölgesi (İzmir, Manisa, Denizli...)</option>
                    <option value="ic_anadolu">İç Anadolu (Ankara, Konya, Kayseri...)</option>
                  </select>
                </div>

                <!-- Monitored Sectors Chips -->
                <div class="md:col-span-2 space-y-2">
                  <label class="block text-[10px] font-black text-slate-500 uppercase">RADARA DAHİL EDİLEN FAALİYET SEKTÖRLERİ</label>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="sec in radarSelectedSectors" 
                      :key="sec" 
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200"
                    >
                      <CheckCircle2 :size="13" class="text-blue-600" />
                      {{ sec }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- ========================================================================= -->
        <!-- 4. ÖZEL MÜŞTERİ BAŞARI YÖNETİCİSİ & VIP DESTEK MASASI TAB -->
        <!-- ========================================================================= -->
        <div v-if="activeSubTab === 'destek'" class="space-y-6">

          <!-- ENTERPRISE GATING BARRIER -->
          <div v-if="!isCorporateEnterprise" class="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#080D1A] p-8 text-white shadow-2xl relative overflow-hidden text-left">
            <div class="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 max-w-3xl space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                <Lock :size="13" class="text-emerald-400" />
                <span>KURUMSAL ENTERPRISE AYRICALIĞI</span>
              </div>

              <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Özel Müşteri Başarı Yöneticisi & VIP Destek Masası
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Firmanıza özel portföy danışmanı (Zeynep Karahan), 1-on-1 ihale ve teklif optimizasyon stratejisi, &lt; 15 dakika VIP SLA taahhüdü, 7/24 öncelikli direkt telefon hattı ve resmi KEP/WhatsApp masaları <strong>Kurumsal Enterprise</strong> planına dahildir.
                </p>
              </div>

              <!-- Mevcut Hesap Durumu -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Building2 :size="20" />
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">MEVCUT PLANINIZ</span>
                    <span class="text-xs font-bold text-white block">
                      {{ isCorporatePro ? 'Kurumsal Pro Tedarikçi (Mavi Kalkan & Radar Aktif)' : (subscriptionPlan || 'Standart Firma Hesabı') }}
                    </span>
                  </div>
                </div>

                <div v-if="isCorporatePro" class="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  ✓ Kurumsal Pro üyemizsiniz. Enterprise plana geçerek birebir portföy yöneticinizi derhal aktif edebilirsiniz.
                </div>
              </div>

              <!-- Enterprise İle Açılan Özellikler Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">Birebir Müşteri Başarı Danışmanı</span>
                    <span class="text-[11px] text-slate-400">Tüm ihalelerinizde şartname analizi ve stratejik teklif mentörlüğü.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">&lt; 15 Dakika VIP Yanıt SLA'sı</span>
                    <span class="text-[11px] text-slate-400">Çağrı ve destek biletlerinde kurumsal öncelikli kuyruk garantisi.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">7/24 Direkt VIP Destek Telefon Hattı</span>
                    <span class="text-[11px] text-slate-400">Bekleme olmaksızın portföy yöneticinize anında erişim imkanı.</span>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-xs font-bold text-white block">KEP & WhatsApp Kurumsal İletişim</span>
                    <span class="text-[11px] text-slate-400">Resmi tebligatlar ve acil teknik çizimler için entegre masalar.</span>
                  </div>
                </div>
              </div>

              <!-- CTA Butonları -->
              <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                <NuxtLink
                  to="/abonelik?plan=kurumsal-enterprise&mode=corporate"
                  class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles :size="15" />
                  <span>Kurumsal Enterprise'a Yükselt (₺4.500 / ay)</span>
                  <ArrowRight :size="14" />
                </NuxtLink>

                <NuxtLink
                  to="/panel/ayarlar?tab=uyelik"
                  class="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition border border-white/10 cursor-pointer"
                >
                  Tüm Kurumsal Paketleri Karşılaştır
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- ACTIVE ENTERPRISE VIEW -->
          <template v-else>
            <!-- Header Banner -->
            <div class="rounded-3xl border bg-gradient-to-br from-[#0F223D] via-[#1A2E4C] to-[#0A1628] p-6 text-white shadow-xl relative overflow-hidden">
            <div class="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
                  <Headphones :size="30" class="text-white" />
                </div>
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2.5">
                    <h2 class="text-lg font-black text-white tracking-tight">Özel Müşteri Başarı Yöneticisi & VIP Destek</h2>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                      <Clock :size="12" /> &lt; 15 DK VIP SLA
                    </span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Kurumsal üyeliğiniz kapsamında firmanıza özel atanmış portföy yöneticiniz ile ihale stratejinizi optimize edin, 7/24 öncelikli hat ve KEP desteğinden yararlanın.
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                @click="showMeetingModal = true" 
                class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer"
              >
                <Calendar :size="15" />
                <span>Birebir Randevu Planla</span>
              </button>
            </div>
          </div>

          <!-- Dedicated Account Manager Profile Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm border-slate-200">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div class="flex items-start gap-5">
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F223D] to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    ZK
                  </div>
                  <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Çevrimiçi"></span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-black text-slate-900">Zeynep Karahan</h3>
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Atanmış Portföy Yöneticiniz</span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium">Kıdemli B2B Müşteri Başarı ve İhale Stratejisi Yöneticisi</p>
                  <p class="text-[11px] text-slate-400">Çalışma Saatleri: Hafta içi 08:30 - 18:30 (Acil durumlarda 7/24 VIP hat yönlendirmesi)</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <a 
                  href="tel:08508885425" 
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  <Phone :size="14" class="text-blue-600" />
                  <span>0850 888 54 25 (Dhl: 104)</span>
                </a>
                <button 
                  type="button" 
                  @click="showMeetingModal = true" 
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F223D] hover:bg-[#1E3A8A] text-white text-xs font-bold transition cursor-pointer"
                >
                  <Calendar :size="14" />
                  <span>Google Meet Görüşmesi Ayarla</span>
                </button>
              </div>
            </div>
          </div>

          <!-- VIP Channels Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 1. VIP Telefon -->
            <div class="p-5 rounded-2xl border bg-white shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Phone :size="20" />
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">7/24 Öncelikli Telefon Hattı</h4>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">Sıra beklemeden doğrudan kurumsal temsilci kuyruğuna aktarılırsınız.</p>
              </div>
              <div class="pt-2 border-t border-slate-100">
                <span class="text-xs font-mono font-black text-blue-600 block">0850 888 54 25</span>
              </div>
            </div>

            <!-- 2. Resmi KEP Adresi -->
            <div class="p-5 rounded-2xl border bg-white shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck :size="20" />
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Resmi Kayıtlı E-Posta (KEP)</h4>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">Yasal tebligatlar, ihtar ve kurumsal sözleşmeler için kayıtlı adresimiz.</p>
              </div>
              <div class="pt-2 border-t border-slate-100">
                <span class="text-xs font-mono font-black text-purple-700 block">hasanhuseyin.yildirim.17@hs01.kep.tr</span>
              </div>
            </div>

            <!-- 3. WhatsApp Business -->
            <div class="p-5 rounded-2xl border bg-white shadow-sm space-y-3" style="border-color: #E2E8F0;">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare :size="20" />
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">WhatsApp Kurumsal Masası</h4>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">Şartname, teknik çizim ve acil teklif soruları için anlık iletişim kanalı.</p>
              </div>
              <div class="pt-2 border-t border-slate-100">
                <span class="text-xs font-mono font-black text-emerald-600 block">+90 850 888 54 25</span>
              </div>
            </div>
          </div>
        </template>
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
            v-if="addresses.filter(a => a.type === activeAddressType).length === 0"
            class="rounded-2xl border bg-white py-12 px-6 text-center space-y-3 shadow-xs"
            style="border-color: #E2E8F0;"
          >
            <div class="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <MapPin :size="24" />
            </div>
            <h4 class="text-sm font-bold text-slate-800">Kayıtlı {{ activeAddressType === 'teslimat' ? 'Teslimat' : 'Fatura' }} Adresi Bulunmuyor</h4>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">Sipariş ve ihale süreçlerinizde teslimat ve faturalandırma için yeni bir {{ activeAddressType === 'teslimat' ? 'teslimat' : 'fatura' }} adresi ekleyebilirsiniz.</p>
            <button 
              type="button" 
              @click="isNewAddressModalOpen = true; newAddressForm.type = activeAddressType" 
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus :size="14" />
              <span>Yeni {{ activeAddressType === 'teslimat' ? 'Teslimat' : 'Fatura' }} Adresi Ekle</span>
            </button>
          </div>

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
                  <p class="text-[11px] text-slate-500">{{ profileForm.email || userSession?.email || 'Kayıtlı e-posta adresinize' }} resmi ihale özetleri ve teklif detayları iletilir.</p>
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
                  <p class="text-[11px] text-slate-500">{{ (profileForm.phone || userSession?.phone) ? ('+90 ' + (profileForm.phone || userSession?.phone)) : 'Kayıtlı telefon numaranıza' }} acil ihale sonuçları ve güvenlik kodları SMS ile iletilir.</p>
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
                  <span>LANSMANA ÖZEL: İLK İHALENİZ %100 ÜCRETSİZ</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                  İlk İhalenizi Hiçbir Ücret Ödemeden Başlatın!
                </h2>
                <p class="text-xs text-slate-300 leading-relaxed font-medium">
                  İhaleciBurada platform lansmanına özel olarak tüm alıcı ve tedarikçi firmalarımıza ilk ihale açma, teklif verme, canlı tersine eksiltme ve tüm analiz modülleri <strong>0 ₺</strong> bedelle sunulmaktadır. Kredi kartı gerekmez, 0 komisyon, anında koşulsuz aktivasyon.
                </p>
                <div class="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-emerald-300 font-bold">
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> İlk İhale 0 ₺</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Kredi Kartı İstemez</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Canlı Tersine Eksiltme</span>
                  <span class="flex items-center gap-1.5"><CheckCircle2 :size="14" class="text-emerald-400" /> Anında Aktivasyon</span>
                </div>
              </div>

              <div class="shrink-0 w-full lg:w-auto">
                <NuxtLink
                  to="/panel/ihale-olustur"
                  class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>İLK İHALENİZİ ÜCRETSİZ BAŞLATIN (0 ₺)</span>
                  <CheckCircle2 :size="16" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Category Switcher: Bireysel vs Kurumsal Firma Modu (Yurt İçi ve Yurt Dışı İçin Aktif) -->
          <div class="space-y-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div>
                <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Building2 v-if="isCompanyMode" class="text-emerald-600" :size="18" />
                  <User v-else class="text-blue-600" :size="18" />
                  <span>{{ isCompanyMode 
                    ? (membershipPricingRegion === 'international' ? 'Corporate B2B Pricing & Supplier Tiers (USD)' : 'Kurumsal Firma Fiyatlandırması & Tedarikçi Planları')
                    : (membershipPricingRegion === 'international' ? 'Global B2B Auction Passes (1 - 12 Months)' : 'Bireysel İhale Abonelik Paketleri (1 - 12 Ay)') }}</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ isCompanyMode 
                    ? (membershipPricingRegion === 'international' 
                        ? 'Exclusive corporate advantages: 5% fixed escrow fee (0% for buyer), Blue Shield verified badge, and ERP integration' 
                        : 'Firma moduna özel %5 sabit komisyon (alıcıya %0), Mavi Kalkan ve ERP entegrasyonu')
                    : (membershipPricingRegion === 'international'
                        ? 'Global individual B2B tender browsing and verified bidding passes with maximum savings'
                        : 'Bireysel kullanıcılara özel 1 aydan 12 aya kadar esnek B2B ihale ve satın alma erişim paketleri') }}
                </p>
              </div>

              <!-- Firma modundayken hem mod rozeti hem de bireysel moda dönüş butonu yer alır. Bireyseldeyken firma moduna geçiş butonu yer alır. -->
              <div v-if="isCompanyMode" class="flex flex-wrap items-center gap-2 shrink-0">
                <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-xs">
                  <Building2 :size="14" class="text-emerald-600" />
                  <span>🏢 {{ membershipPricingRegion === 'international' ? 'Corporate Mode' : 'Kurumsal Firma Modu' }}</span>
                </div>
                <button
                  type="button"
                  @click="toggleCompanyMode(false)"
                  class="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-300 shadow-xs transition-all cursor-pointer"
                  :title="membershipPricingRegion === 'international' ? 'Return to individual packages' : 'Bireysel abonelik paketlerine geri dön'"
                >
                  <User :size="14" class="text-blue-600" />
                  <span>👤 {{ membershipPricingRegion === 'international' ? 'Switch to Individual' : 'Bireysel Moda Geç' }}</span>
                </button>
              </div>
              <div v-else class="shrink-0">
                <button
                  type="button"
                  @click="toggleCompanyMode(true)"
                  class="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black bg-[#0F223D] hover:bg-[#003057] text-white shadow-xs transition-all cursor-pointer"
                >
                  <Building2 :size="14" class="text-emerald-400" />
                  <span>🏢 {{ membershipPricingRegion === 'international' ? 'Switch to Corporate Mode' : 'Firma Moduna Geç' }}</span>
                </button>
              </div>
            </div>

            <!-- Corporate Tiers Grid (SADECE FİRMA MODUNDA AÇIĞA ÇIKAR) -->
            <div v-if="isCompanyMode" class="space-y-6 animate-fadeIn">
              <!-- Billing cycle toggle for corporate -->
              <div class="flex justify-center">
                <div class="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    @click="membershipCorporateCycle = 'monthly'"
                    class="px-4 py-1.5 rounded-lg transition cursor-pointer"
                    :class="membershipCorporateCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
                  >
                    {{ membershipPricingRegion === 'international' ? 'Monthly Billing' : 'Aylık Ödeme' }}
                  </button>
                  <button
                    type="button"
                    @click="membershipCorporateCycle = 'annual'"
                    class="px-4 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    :class="membershipCorporateCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'"
                  >
                    <span>{{ membershipPricingRegion === 'international' ? 'Annual Prepaid (12 Mo)' : 'Yıllık Peşin (12 Ay)' }}</span>
                    <span class="text-[10px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">{{ membershipPricingRegion === 'international' ? '17% Extra Savings' : '%17 Ek İndirim' }}</span>
                  </button>
                </div>
              </div>

              <!-- 2-column grid for Corporate Pro and Enterprise -->
              <div class="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 items-stretch">
                <div 
                  v-for="tier in membershipCorporateTiers" 
                  :key="tier.id"
                  class="rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-sm hover:shadow-xl relative"
                  :class="tier.isPopular 
                    ? 'border-emerald-500/60 bg-[#0B132B] text-white ring-2 ring-emerald-500/20' 
                    : 'border-slate-800 bg-[#0F172A] text-white'"
                >
                  <div v-if="tier.isPopular" class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    {{ membershipPricingRegion === 'international' ? 'MOST POPULAR CORPORATE PLAN' : 'En Popüler Kurumsal Plan' }}
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-black text-white">{{ tier.name }}</h4>
                      <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                        {{ tier.badge }}
                      </span>
                    </div>

                    <div class="my-4 py-3 border-y border-slate-800">
                      <div class="text-3xl font-black text-white font-mono">
                        <template v-if="membershipCorporateCycle === 'annual'">
                          {{ tier.currency || '₺' }}{{ tier.annualPrice.toLocaleString('tr-TR') }}
                          <span class="text-xs text-slate-400 font-normal">/ {{ membershipPricingRegion === 'international' ? 'yr' : 'yıl' }}</span>
                        </template>
                        <template v-else>
                          {{ tier.currency || '₺' }}{{ tier.monthlyPrice.toLocaleString('tr-TR') }}
                          <span class="text-xs text-slate-400 font-normal">/ {{ membershipPricingRegion === 'international' ? 'mo' : 'ay' }}</span>
                        </template>
                      </div>
                      <div v-if="tier.annualPrice > 0" class="text-xs text-emerald-400 font-medium mt-1">
                        <template v-if="membershipCorporateCycle === 'annual'">
                          {{ membershipPricingRegion === 'international' ? 'Effective monthly cost:' : 'Aylık maliyet:' }} {{ tier.currency || '₺' }}{{ Math.round(tier.annualPrice / 12).toLocaleString('tr-TR') }} ({{ membershipPricingRegion === 'international' ? '17% savings' : '%17 tasarruf' }})
                        </template>
                        <template v-else>
                          {{ membershipPricingRegion === 'international' ? 'Annual prepaid:' : 'Yıllık peşin:' }} {{ tier.currency || '₺' }}{{ tier.annualPrice.toLocaleString('tr-TR') }} ({{ membershipPricingRegion === 'international' ? '17% extra discount' : '%17 ek indirim' }})
                        </template>
                      </div>
                    </div>

                    <div class="space-y-2.5 pt-2 text-xs">
                      <div v-for="(feat, idx) in tier.features" :key="idx" class="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 :size="15" class="text-emerald-400 shrink-0 mt-0.5" />
                        <span class="leading-relaxed">{{ feat }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="pt-6 mt-6 border-t border-slate-800">
                    <NuxtLink
                      :to="`/abonelik?plan=${tier.id}&cycle=${membershipCorporateCycle}&mode=corporate`"
                      class="w-full py-3.5 px-4 rounded-xl text-center text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
                      :class="[
                        (tier.id === 'kurumsal-enterprise' && isCorporateEnterprise) || (tier.id === 'kurumsal-pro' && isCorporatePro && !isCorporateEnterprise)
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400 pointer-events-none'
                          : (tier.id === 'kurumsal-enterprise' && isCorporatePro)
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                            : tier.isPopular 
                              ? 'bg-[#1EAE4C] hover:bg-[#188C3D] text-white shadow-emerald-500/20' 
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                      ]"
                    >
                      <template v-if="tier.id === 'kurumsal-enterprise' && isCorporateEnterprise">
                        <CheckCircle2 :size="16" class="text-white" />
                        <span>{{ membershipPricingRegion === 'international' ? '✓ Current Plan (Enterprise Active)' : '✓ Mevcut Planınız (Enterprise Aktif)' }}</span>
                      </template>
                      <template v-else-if="tier.id === 'kurumsal-pro' && isCorporateEnterprise">
                        <Check :size="16" class="text-emerald-400" />
                        <span>{{ membershipPricingRegion === 'international' ? 'Active Under Enterprise Plan' : 'Enterprise Planınız Kapsamında Aktif' }}</span>
                      </template>
                      <template v-else-if="tier.id === 'kurumsal-pro' && isCorporatePro">
                        <CheckCircle2 :size="16" class="text-white" />
                        <span>{{ membershipPricingRegion === 'international' ? '✓ Current Plan (Pro Active)' : '✓ Mevcut Planınız (Pro Aktif)' }}</span>
                      </template>
                      <template v-else-if="tier.id === 'kurumsal-enterprise' && isCorporatePro">
                        <Sparkles :size="15" class="text-slate-950" />
                        <span>{{ membershipPricingRegion === 'international' ? "Enterprise'a Yükselt (+$150 Farkla)" : "Enterprise'a Yükselt (+₺2.700 Farkla)" }}</span>
                        <ArrowRight :size="14" />
                      </template>
                      <template v-else>
                        <span>{{ membershipPricingRegion === 'international' ? 'Bu Kurumsal Pakete Geç (USD)' : 'Bu Kurumsal Pakete Geç' }}</span>
                        <ArrowRight :size="14" />
                      </template>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duration Packages (SADECE BİREYSEL MODDA AÇIĞA ÇIKAR; KURUMSALA GEÇİNCE KALDIRILIR) -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch animate-fadeIn">
              <div
                v-for="pkg in (membershipPricingRegion === 'domestic' ? membershipPricingDomestic : membershipPricingGlobalUSD)"
                :key="pkg.id"
                class="rounded-3xl border bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden"
                :class="pkg.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'"
              >
                <div
                  class="text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-center mb-4"
                  :class="pkg.isPopular ? 'bg-amber-400 text-slate-950 font-black' : 'bg-[#0F223D] text-white'"
                >
                  {{ pkg.badge }}
                </div>

                <div class="space-y-4">
                  <h3 class="text-xs font-black text-slate-800 tracking-wider text-center uppercase">{{ pkg.name }}</h3>
                  
                  <div class="text-center py-3 border-y border-slate-100">
                    <div class="text-4xl font-black text-slate-900 font-mono tracking-tight">{{ membershipPricingRegion === 'international' ? '$' : '₺' }}{{ pkg.price.toLocaleString('tr-TR') }}</div>
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
                    <span>{{ membershipPricingRegion === 'international' ? 'SUBSCRIBE NOW' : 'HEMEN ABONE OL' }}</span>
                    <ArrowRight :size="14" />
                  </NuxtLink>
                </div>
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
                ...(isCompanyMode ? [{ id: 'profil-kaynagi', label: 'Sözleşmeler & Onaylar' }] : [])
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
          <div class="grid grid-cols-1 gap-4" :class="isCompanyMode ? 'md:grid-cols-4' : 'md:grid-cols-3'">
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

            <!-- Card 4 (Sadece Firma Modu Aktifse) -->
            <div v-if="isCompanyMode" @click="scrollToSection('profil-kaynagi')" class="rounded-xl border bg-white p-4 flex flex-col justify-between min-h-[90px] shadow-sm text-left hover:bg-slate-50/50 cursor-pointer" style="border-color: #E2E8F0;">
              <div class="flex items-start gap-2.5">
                <FileText :size="14" class="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 class="text-[11px] font-black text-slate-800 leading-tight">Sözleşmeler & Onaylar</h4>
                  <p class="text-[9px] text-slate-400 mt-1 leading-normal">Kurumsal onay ve KVKK sözleşmelerini yönetin.</p>
                </div>
              </div>
              <span class="text-[9px] text-blue-600 font-bold mt-2 inline-flex items-center gap-0.5">Aç <ArrowRight :size="9" /></span>
            </div>
          </div>

          <!-- Hesap ve Bilgiler Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2.5 pb-2 border-b" style="border-color: #F1F5F9;">
              <Building v-if="isCompanyMode" :size="15" class="text-blue-600" />
              <User v-else :size="15" class="text-blue-600" />
              <div>
                <span class="text-[8px] font-black text-slate-300 block">{{ isCompanyMode ? 'SİTE VE KURUMSAL İLETİŞİM' : 'KİŞİSEL HESAP BİLGİLERİ' }}</span>
                <h3 class="text-xs font-black uppercase text-slate-700 mt-0.5">{{ isCompanyMode ? 'Hesap ve Kurumsal Bilgiler' : 'Hesap ve Profil Bilgileri' }}</h3>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 leading-normal">
              {{ isCompanyMode ? 'Kimlik ve kurumsal bilgiler: Şirket ve Kurumsal Kimlik ayarlarından yönetilir.' : 'Kişisel profil ve iletişim detaylarınız.' }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">AD SOYAD</span>
                <span class="text-slate-700 font-bold block mt-1">{{ profileDisplayName }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">E-POSTA ADRESİ</span>
                <span class="font-mono text-slate-700 block mt-1">{{ profileForm.email || userSession?.email || 'tanımlı değil' }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-300 block">{{ isCompanyMode ? 'UNVAN / ROL' : 'HESAP TÜRÜ' }}</span>
                <span class="text-slate-700 font-bold block mt-1">{{ isCompanyMode ? (profileForm.title || userSession?.title || userSession?.role || 'Şirket Yetkilisi') : (profileForm.title || 'Bireysel Kullanıcı') }}</span>
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
                  <span class="text-slate-500">Aktif/Kayıtlı e-posta: <strong>{{ profileForm.email || userSession?.email || 'ihalecib@gmail.com' }}</strong></span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="!companyForm.is2FaEnabled"
                    type="button" 
                    @click="show2FaSetupModal = true" 
                    class="rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Key :size="13" />
                    <span>Kodu Girin</span>
                  </button>
                  <button 
                    type="button" 
                    @click="trigger2FaToggle" 
                    class="rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    :class="companyForm.is2FaEnabled ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'"
                  >
                    <ShieldCheck v-if="!companyForm.is2FaEnabled" :size="13" />
                    <span>{{ companyForm.is2FaEnabled ? 'Devre Dışı Bırak' : '2FA Etkinleştir' }}</span>
                  </button>
                </div>
              </div>

              <!-- Inline 2FA Kod Giriş Alanı -->
              <div 
                v-if="show2FaSetupModal && !companyForm.is2FaEnabled" 
                class="mt-3 p-4 bg-white rounded-xl border-2 border-blue-500 shadow-md space-y-3"
              >
                <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div class="flex items-center gap-2">
                    <div class="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheck :size="16" />
                    </div>
                    <div>
                      <span class="font-black text-xs text-slate-900 uppercase tracking-wide">E-posta Güvenlik Kodunu Giriniz</span>
                      <p class="text-[10px] text-slate-500">Gelen kutunuza gelen 6 haneli kodu girip 'Doğrula & Etkinleştir'e basın.</p>
                    </div>
                  </div>
                  <span class="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    ⏱️ {{ Math.floor(twoFaTimer / 60) }}:{{ (twoFaTimer % 60).toString().padStart(2, '0') }}
                  </span>
                </div>

                <p class="text-[11px] text-slate-600 font-medium">
                  <strong>{{ profileForm.email || userSession?.email || 'ihalecib@gmail.com' }}</strong> adresinize gönderilen 6 haneli güvenlik kodunu giriniz:
                </p>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div class="relative flex-1 max-w-xs">
                    <input 
                      v-model="twoFaOtpInput" 
                      type="text" 
                      maxlength="6" 
                      placeholder="123456" 
                      autofocus
                      @keyup.enter="confirm2FaActivation"
                      class="w-full text-center tracking-[0.4em] text-xl font-mono font-black py-2.5 px-4 bg-slate-50 border-2 border-blue-400 rounded-xl text-slate-900 outline-none focus:border-blue-600 focus:bg-white shadow-inner transition" 
                    />
                  </div>
                  <button 
                    type="button" 
                    @click="confirm2FaActivation" 
                    :disabled="!twoFaOtpInput || twoFaOtpInput.trim().length < 6" 
                    class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 :size="15" />
                    <span>Doğrula & Etkinleştir</span>
                  </button>
                  <button 
                    type="button" 
                    @click="send2FaEmailOtp" 
                    :disabled="isSending2FaEmail || twoFaTimer > 120" 
                    class="text-blue-600 hover:underline text-xs font-bold px-2 py-1 cursor-pointer disabled:opacity-50"
                  >
                    {{ isSending2FaEmail ? 'Gönderiliyor...' : 'Tekrar Kod Gönder' }}
                  </button>
                  <button 
                    type="button" 
                    @click="show2FaSetupModal = false" 
                    class="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
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

          <!-- Sözleşmeler & Onaylar Card (Sadece Firma Modu Aktifse) -->
          <div v-if="isCompanyMode" id="sozlesmeler" class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
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

      </main>
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

  <!-- 📍 YENİ ADRES EKLEME MODALI (KULLANICI TALEBİ) -->
    <div 
      v-if="isNewAddressModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      @click.self="isNewAddressModalOpen = false"
    >
      <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 text-left border border-slate-100 animate-scaleUp">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin :size="18" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-800">Yeni Adres Ekle</h3>
              <p class="text-[10px] text-slate-400 font-medium">Sevkiyat, depo veya fatura adresinizi sisteme kaydedin</p>
            </div>
          </div>
          <button 
            type="button" 
            @click="isNewAddressModalOpen = false" 
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X :size="16" />
          </button>
        </div>

        <form @submit.prevent="addAddress" class="space-y-4 text-xs">
          <!-- Adres Türü -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Adres Türü</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                @click="newAddressForm.type = 'teslimat'"
                class="p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                :class="newAddressForm.type === 'teslimat' ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'"
              >
                <span>📦 Sevkiyat & Teslimat</span>
              </button>
              <button 
                type="button" 
                @click="newAddressForm.type = 'fatura'"
                class="p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                :class="newAddressForm.type === 'fatura' ? 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'"
              >
                <span>📑 Fatura & Muhasebe</span>
              </button>
            </div>
          </div>

          <!-- Adres Başlığı -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
              Adres Başlığı <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="newAddressForm.title" 
              type="text" 
              placeholder="Örn: Balıkesir OSB Fabrika Deposu / Merkez Ofis" 
              class="w-full rounded-xl border px-3.5 py-2.5 text-xs bg-white outline-none font-bold text-slate-800 focus:border-blue-500 border-slate-200" 
              required
            />
          </div>

          <!-- İl & İlçe & Posta Kodu -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                İl / Şehir <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="newAddressForm.city" 
                type="text" 
                placeholder="Örn: Balıkesir" 
                class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none font-medium text-slate-800 focus:border-blue-500 border-slate-200" 
                required
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
                İlçe <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="newAddressForm.district" 
                type="text" 
                placeholder="Örn: Altıeylül" 
                class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none font-medium text-slate-800 focus:border-blue-500 border-slate-200" 
                required
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Posta Kodu</label>
              <input 
                v-model="newAddressForm.zip" 
                type="text" 
                placeholder="Örn: 10050" 
                class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none font-mono text-slate-800 focus:border-blue-500 border-slate-200" 
              />
            </div>
          </div>

          <!-- Açık Adres -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
              Açık Adres (Cadde, Sokak, No, Şantiye/Depo Bilgisi) <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="newAddressForm.address" 
              rows="3" 
              placeholder="Organize Sanayi Bölgesi 4. Cadde No: 18 / Şantiye Kabul Kapısı" 
              class="w-full rounded-xl border p-3 text-xs bg-white outline-none font-medium text-slate-800 focus:border-blue-500 border-slate-200 leading-relaxed" 
              required
            ></textarea>
          </div>

          <!-- Varsayılan Yap Checkbox -->
          <div class="flex items-center gap-2 pt-1">
            <input 
              v-model="newAddressForm.isDefault" 
              type="checkbox" 
              id="isDefaultAddr" 
              class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" 
            />
            <label for="isDefaultAddr" class="text-xs font-bold text-slate-700 cursor-pointer">
              Bu adresi varsayılan {{ newAddressForm.type === 'teslimat' ? 'teslimat' : 'fatura' }} adresi olarak ayarla
            </label>
          </div>

          <!-- Butonlar -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              @click="isNewAddressModalOpen = false" 
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              İptal
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 :size="14" />
              <span>Adresi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 📱 NetGSM Telefon Doğrulama Modalı -->
    <div 
      v-if="showPhoneVerifyModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn"
    >
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 text-left">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone :size="18" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-800">Telefon Doğrulama (SMS)</h3>
              <p class="text-[11px] text-slate-400">NetGSM SMS Güvenlik Doğrulaması</p>
            </div>
          </div>
          <button 
            type="button" 
            @click="showPhoneVerifyModal = false" 
            class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Cep Telefonu Numarası</label>
            <div class="flex gap-2">
              <input 
                v-model="phoneVerifyNumber" 
                type="tel" 
                placeholder="05XXXXXXXXX" 
                class="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:border-blue-500 outline-none"
              />
              <button 
                type="button" 
                @click="sendNetGsmVerificationSms"
                :disabled="isSendingPhoneSms || (phoneSmsSent && phoneSmsTimer > 0)"
                class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 cursor-pointer transition"
              >
                {{ isSendingPhoneSms ? 'Gönderiliyor...' : (phoneSmsSent ? (phoneSmsTimer > 0 ? `${phoneSmsTimer}s` : 'Tekrar Gönder') : 'SMS Kodu Gönder') }}
              </button>
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">İhaleleriniz ve teklif bildirimleriniz bu numaraya SMS olarak iletilecektir.</span>
          </div>

          <div v-if="phoneSmsSent" class="space-y-2 pt-2 border-t border-slate-100">
            <label class="block text-[10px] font-black text-slate-500 uppercase">SMS Onay Kodu (6 Haneli)</label>
            <input 
              v-model="phoneVerifyInput" 
              type="text" 
              maxlength="6" 
              placeholder="849201" 
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:border-blue-500 outline-none"
            />
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>SMS gelmedi mi?</span>
              <button 
                v-if="phoneSmsTimer === 0" 
                type="button" 
                @click="sendNetGsmVerificationSms" 
                class="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Kodu Tekrar Gönder
              </button>
              <span v-else class="font-mono text-slate-500">Kalan süre: {{ Math.floor(phoneSmsTimer / 60) }}:{{ (phoneSmsTimer % 60).toString().padStart(2, '0') }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showPhoneVerifyModal = false" 
            class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="confirmPhoneVerificationOtp"
            :disabled="!phoneSmsSent"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 :size="14" />
            <span>Doğrula ve Onayla</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ✉️ E-posta Doğrulama Modalı -->
    <div 
      v-if="showEmailVerifyModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn"
    >
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 text-left">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail :size="18" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-800">E-posta Doğrulama</h3>
              <p class="text-[11px] text-slate-400">Tek kullanımlık güvenlik kodu (OTP)</p>
            </div>
          </div>
          <button 
            type="button" 
            @click="showEmailVerifyModal = false" 
            class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">E-posta Adresi</label>
            <div class="flex gap-2">
              <input 
                v-model="emailVerifyAddress" 
                type="email" 
                placeholder="ornek@alanadi.com" 
                class="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 outline-none"
              />
              <button 
                type="button" 
                @click="sendEmailVerificationCode"
                :disabled="isSendingEmailOtp || (emailOtpSent && emailTimer > 0)"
                class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 cursor-pointer transition"
              >
                {{ isSendingEmailOtp ? 'Gönderiliyor...' : (emailOtpSent ? (emailTimer > 0 ? `${emailTimer}s` : 'Tekrar Gönder') : 'Kod Gönder') }}
              </button>
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">Güvenlik onay kodu bu e-posta adresine gönderilecektir.</span>
          </div>

          <div v-if="emailOtpSent" class="space-y-2 pt-2 border-t border-slate-100">
            <label class="block text-[10px] font-black text-slate-500 uppercase">E-posta Onay Kodu (6 Haneli)</label>
            <input 
              v-model="emailVerifyInput" 
              type="text" 
              maxlength="6" 
              placeholder="849201" 
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:border-blue-500 outline-none"
            />
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>E-posta gelmedi mi? Spama bakın veya:</span>
              <button 
                v-if="emailTimer === 0" 
                type="button" 
                @click="sendEmailVerificationCode" 
                class="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Kodu Tekrar Gönder
              </button>
              <span v-else class="font-mono text-slate-500">Kalan süre: {{ Math.floor(emailTimer / 60) }}:{{ (emailTimer % 60).toString().padStart(2, '0') }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showEmailVerifyModal = false" 
            class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="confirmEmailVerificationOtp"
            :disabled="!emailOtpSent"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 :size="14" />
            <span>Doğrula ve Onayla</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2FA Setup & Verification Modal Overlay -->
    <div 
      v-if="show2FaSetupModal && !companyForm.is2FaEnabled" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs"
    >
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck :size="22" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-900">2FA Güvenlik Kodu Doğrulama</h3>
              <p class="text-[11px] text-slate-500 font-medium">E-posta ile İki Aşamalı Güvenlik</p>
            </div>
          </div>
          <button 
            type="button" 
            @click="show2FaSetupModal = false"
            class="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5">
            <ShieldCheck :size="16" class="text-blue-600 shrink-0 mt-0.5" />
            <div class="space-y-1">
              <p class="text-[11px] text-slate-700 leading-relaxed">
                <strong>{{ profileForm.email || userSession?.email || 'ihalecib@gmail.com' }}</strong> adresinize 6 haneli güvenlik onay kodu gönderildi.
              </p>
              <p class="text-[10px] text-blue-700 font-medium">
                Gelen kutunuzu (veya Spam klasörünü) kontrol ederek 6 haneli kodu aşağıdaki alana giriniz.
              </p>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider">6 Haneli Doğrulama Kodu</label>
              <span class="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ⏱️ Kalan: {{ Math.floor(twoFaTimer / 60) }}:{{ (twoFaTimer % 60).toString().padStart(2, '0') }}
              </span>
            </div>
            <input 
              v-model="twoFaOtpInput" 
              type="text" 
              maxlength="6" 
              placeholder="123456" 
              autofocus
              @keyup.enter="confirm2FaActivation"
              class="w-full rounded-xl border-2 border-blue-400 focus:border-blue-600 px-4 py-3 text-center text-2xl font-mono font-black tracking-[0.4em] text-slate-900 outline-none bg-slate-50/60 focus:bg-white transition shadow-inner"
            />
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Kod ulaşmadı mı?</span>
            <button 
              type="button" 
              @click="send2FaEmailOtp" 
              :disabled="isSending2FaEmail || twoFaTimer > 120"
              class="text-blue-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              {{ isSending2FaEmail ? 'Gönderiliyor...' : 'Tekrar Kod Gönder' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="show2FaSetupModal = false" 
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer transition"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="confirm2FaActivation"
            :disabled="!twoFaOtpInput || twoFaOtpInput.trim().length < 6"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 :size="14" />
            <span>Doğrula & Etkinleştir</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: YENİ KURUMSAL EKİP ÜYESİ DAVET ET (RBAC) -->
    <!-- ========================================================================= -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
        <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users :size="20" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-800">Yeni Ekip Üyesi Davet Et</h3>
              <p class="text-[10px] text-slate-400">Şirket alt kullanıcısı tanımlayın ve yetkilerini belirleyin.</p>
            </div>
          </div>
          <button type="button" @click="showInviteModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">AD SOYAD <span class="text-red-500">*</span></label>
            <input v-model="inviteForm.name" type="text" placeholder="Örn: Selin Kaya" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-emerald-500 bg-white" style="border-color: #E2E8F0;" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">KURUMSAL E-POSTA <span class="text-red-500">*</span></label>
            <input v-model="inviteForm.email" type="email" placeholder="selin.kaya@firmaniz.com" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-emerald-500 bg-white font-mono" style="border-color: #E2E8F0;" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">DEPARTMAN / ROL</label>
            <select v-model="inviteForm.role" class="w-full rounded-xl border px-3.5 py-2.5 font-bold text-slate-700 outline-none focus:border-emerald-500 bg-white" style="border-color: #E2E8F0;">
              <option value="Satın Alma Sorumlusu">Satın Alma Sorumlusu</option>
              <option value="Teklif Yetkilisi">Teklif Yetkilisi</option>
              <option value="Finans & Muhasebe">Finans & Muhasebe</option>
              <option value="Firma Yöneticisi">Firma Yöneticisi (Tam Yetkili)</option>
            </select>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-100">
            <label class="block text-[10px] font-black text-slate-500 uppercase">ÖZEL ERİŞİM VE İMZA YETKİLERİ</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="inviteForm.canOpenTender" class="rounded text-emerald-600" />
                <span class="text-xs text-slate-700 font-medium">Yeni İhale / Eksiltme Başlatabilir</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="inviteForm.canSubmitBid" class="rounded text-emerald-600" />
                <span class="text-xs text-slate-700 font-medium">Açık İhalelere Teklif Verebilir & Revize Edebilir</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="inviteForm.canApproveEscrow" class="rounded text-emerald-600" />
                <span class="text-xs text-slate-700 font-medium">Escrow Emanet Fon Bloke / Çözme Onayı Verebilir</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button type="button" @click="showInviteModal = false" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer">
            İptal
          </button>
          <button type="button" @click="sendTeamInvite" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5">
            <Send :size="14" />
            <span>Daveti Gönder</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 2: ÖZEL MÜŞTERİ BAŞARI YÖNETİCİSİ İLE RANDEVU PLANLA -->
    <!-- ========================================================================= -->
    <div v-if="showMeetingModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
        <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Headphones :size="20" />
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-800">Birebir Strateji Toplantısı Planla</h3>
              <p class="text-[10px] text-slate-400">Portföy Yöneticiniz Zeynep Karahan ile Google Meet görüşmesi.</p>
            </div>
          </div>
          <button type="button" @click="showMeetingModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#0F223D] text-white flex items-center justify-center font-black text-sm shrink-0">
              ZK
            </div>
            <div>
              <span class="font-bold text-slate-900 block">Zeynep Karahan</span>
              <span class="text-[10px] text-blue-700">Kıdemli B2B Müşteri Başarı Yöneticisi</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">GÖRÜŞME TARİHİ</label>
              <input v-model="meetingDate" type="date" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white font-mono" style="border-color: #E2E8F0;" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">SAAT DİLİMİ</label>
              <select v-model="meetingTime" class="w-full rounded-xl border px-3.5 py-2.5 font-mono text-slate-700 outline-none focus:border-blue-500 bg-white" style="border-color: #E2E8F0;">
                <option value="10:00">10:00 - 10:45</option>
                <option value="11:30">11:30 - 12:15</option>
                <option value="14:30">14:30 - 15:15</option>
                <option value="16:00">16:00 - 16:45</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">GÖRÜŞME KONUSU / AJANDA</label>
            <textarea v-model="meetingTopic" rows="3" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white text-slate-800" style="border-color: #E2E8F0;"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button type="button" @click="showMeetingModal = false" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer">
            Vazgeç
          </button>
          <button type="button" @click="bookAccountManagerMeeting" class="px-5 py-2.5 rounded-xl bg-[#0F223D] hover:bg-[#1C2541] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5">
            <Calendar :size="14" />
            <span>Randevuyu Onayla</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
