<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Lock, 
  User, 
  Home, 
  Activity, 
  CreditCard, 
  ListPlus,
  CheckCircle,
  Plus,
  Trash2,
  Folder,
  Download,
  Upload,
  AlertCircle,
  Phone,
  MessageSquare,
  Bot,
  Sparkles,
  Users,
  Mail,
  Send,
  Eye,
  CheckCheck,
  Inbox,
  Filter,
  Globe,
  FileText,
  Calendar,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Edit,
  Tag,
  Video,
  Play,
  Pause,
  PlusCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Package,
  Truck,
  Layers,
  Award,
  AlertTriangle,
  FileCheck,
  XCircle,
  ShieldAlert,
  Server,
  Settings,
  Ticket,
  Copy,
  BarChart3,
  RefreshCw,
  Zap,
  Smartphone,
  Scale
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

// Page config
definePageMeta({
  layout: false // Custom full screen admin dashboard
})

const router = useRouter()
const { cmsData, saveCmsData, resetCmsData } = useCmsData()
const { netGsmConfig, smsLogs, sendSms } = useNetGsm()

// Auth State
const isLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const authError = ref('')

// Test SMS Form
const testSmsForm = ref({
  phone: '05325550123',
  name: 'Test Yetkilisi',
  template: 'Sistem Test Bildirimi',
  body: 'İhaleciBurada NetGSM SMS Gateway testi başarıyla tamamlandı. Canlı eksiltme ve teklif bildirimleriniz anlık olarak iletilecektir.'
})

async function sendTestSms() {
  await sendSms({
    recipientPhone: testSmsForm.value.phone,
    recipientName: testSmsForm.value.name,
    templateName: testSmsForm.value.template,
    messageBody: testSmsForm.value.body
  })
  alert(`📱 NetGSM SMS GÖNDERİLDİ!\n\nAlıcı: ${testSmsForm.value.phone}\nİçerik: ${testSmsForm.value.body}`)
}

function resolveDispute(dispute: any, action: 'approved' | 'rejected') {
  if (action === 'approved') {
    dispute.status = 'FESİH_ONAYLANDI'
    alert(`⚖️ MÜCBİR SEBEP FESİH TALEBİ ONAYLANDI\n\nTalep No: ${dispute.id}\nCezai şartsız iptal onaylandı ve bloke ödeme serbest bırakıldı.`)
  } else {
    dispute.status = 'REDDEDILDI'
    alert(`❌ MÜCBİR SEBEP TALEBİ REDDEDİLDİ\n\nTalep No: ${dispute.id}\nSözleşme yükümlülükleri geçerliliğini korumaktadır.`)
  }
  saveCmsData(cmsData.value)
}

// Tabs
export type AdminTab = 
  | 'overview'
  | 'kyc_desk'
  | 'live_rooms'
  | 'escrow_delivery'
  | 'disputes_desk'
  | 'categories'
  | 'video_cms'
  | 'promo_codes'
  | 'audit_logs'
  | 'site_settings'
  | 'support_ai' 
  | 'netgsm_sms'
  | 'crm_leads' 
  | 'email_center' 
  | 'newsletter_subs' 
  | 'hero' 
  | 'tender' 
  | 'plans' 
  | 'contact' 
  | 'db_payments' 
  | 'db_tenders' 
  | 'db_received' 
  | 'db_submitted'

const activeTab = ref<AdminTab>('overview')

// Local copy for editing
const formState = reactive(JSON.parse(JSON.stringify(cmsData.value)))

// Ensure safety defaults for all enterprise modules
if (!formState.supportSettings) {
  formState.supportSettings = {
    whatsappEnabled: true,
    whatsappNumber: '908503080000',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale ve 6 ay ücretsiz deneme hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 6 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın. Kullanıcılara 6 ay ücretsiz deneme, ihale açma, teklif verme, canlı eksiltme konularında yardımcı ol.'
  }
}

if (!formState.crmSettings) {
  formState.crmSettings = {
    leads: [
      { id: 1, companyName: 'Kalyon Tedarik Ltd.', contactName: 'Ahmet Kalyoncu', email: 'ahmet@kalyon.com', phone: '0532 111 22 33', status: '6 Ay Deneme Aktif', stage: 'active', notes: 'İnşaat malzemesi ihalesi açacak.', createdAt: '2026-08-20' },
      { id: 2, companyName: 'Anadolu Lojistik A.Ş.', contactName: 'Mehmet Yılmaz', email: 'mehmet@anadolulojistik.com', phone: '0544 555 66 77', status: 'Teklif Veren', stage: 'qualified', notes: 'Akaryakıt ihalesine teklif verdi.', createdAt: '2026-08-21' },
      { id: 3, companyName: 'Mega Ambalaj Sanayi', contactName: 'Selin Erdem', email: 'selin@megaambalaj.com', phone: '0555 888 99 00', status: 'Görüşülüyor', stage: 'contacted', notes: 'Kurumsal SAP entegrasyonu talebi var.', createdAt: '2026-08-22' }
    ]
  }
}

if (!formState.emailSettings) {
  formState.emailSettings = {
    senderName: 'İhaleciBurada B2B Operasyon',
    senderEmail: 'info@ihaleciburada.com',
    replyToEmail: 'destek@ihaleciburada.com',
    smtpHost: 'smtp.ihaleciburada.com',
    smtpPort: 587,
    smtpUser: 'info@ihaleciburada.com',
    subscribers: [],
    templates: []
  }
}

if (!formState.kycVerifications) {
  formState.kycVerifications = []
}

if (!formState.liveAuctionRooms) {
  formState.liveAuctionRooms = []
}

if (!formState.escrowOrders) {
  formState.escrowOrders = []
}

if (!formState.categories) {
  formState.categories = []
}

if (!formState.promoCodes) {
  formState.promoCodes = []
}

if (!formState.auditLogs) {
  formState.auditLogs = []
}

if (!formState.siteSettings) {
  formState.siteSettings = {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı bakım çalışması yapılmaktadır.',
    metaTitle: 'İhaleciBurada.com | Türkiye’nin Öncü B2B Canlı Eksiltme & Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, canlı tersine eksiltme ile rekabetçi teklifler toplayın.',
    announcementTicker: '⚡ LANSMANA ÖZEL: İlk 6 ay boyunca %100 ücretsiz kurumsal deneme paketi (0 ₺)!',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 308 00 00',
    supportEmail: 'info@ihaleciburada.com'
  }
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'info' | 'error'>('success')

onMounted(() => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (token === 'ihaleciburada_authorized_session') {
      isLoggedIn.value = true
    }
  }
})

function handleLogin() {
  const e = email.value.trim().toLowerCase()
  const p = password.value.trim()

  if (
    (e === 'admin_test@ihaleciburada.com' && p === 'demo-password') ||
    (e === 'admin@ihaleciburada.com' && p === 'admin123') ||
    (e === 'admin@ihaleciburada.com' && p === 'demo-password') ||
    (e === 'admin' && p === 'admin')
  ) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', 'ihaleciburada_authorized_session')
    }
    isLoggedIn.value = true
    authError.value = ''
    triggerToast('Yönetim ve Operasyon paneline başarıyla giriş yapıldı!', 'success')
  } else {
    authError.value = 'Hatalı e-posta adresi veya şifre girdiniz.'
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
  isLoggedIn.value = false
  triggerToast('Oturum sonlandırıldı.', 'info')
}

function triggerToast(msg: string, type: 'success' | 'info' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3200)
}

function handleSave() {
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  // Add audit log
  const now = new Date().toLocaleString('tr-TR')
  formState.auditLogs.unshift({
    id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: now,
    userEmail: 'admin@ihaleciburada.com',
    action: 'CMS & Operasyon Verileri Kaydedildi',
    ipAddress: '176.240.12.84',
    status: 'success',
    details: 'Tüm sekmelerdeki değişiklikler yayına alındı.'
  })
  triggerToast('Tüm değişiklikler başarıyla kaydedildi ve anında yayına alındı!', 'success')
}

function handleReset() {
  if (confirm('Tüm içerikleri fabrika varsayılan ayarlarına döndürmek istediğinize emin misiniz?')) {
    resetCmsData()
    Object.assign(formState, JSON.parse(JSON.stringify(cmsData.value)))
    triggerToast('İçerikler varsayılan ayarlara sıfırlandı.', 'info')
  }
}

function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formState, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `ihaleciburada_backup_${new Date().toISOString().split('T')[0]}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  triggerToast('JSON Veritabanı Yedeği Bilgisayarınıza İndirildi.', 'success')
}

// ----------------------------------------------------
// KYC Approval Handlers
// ----------------------------------------------------
function approveKyc(kyc: any) {
  kyc.status = 'approved'
  kyc.badgeGranted = true
  kyc.rejectionReason = ''
  triggerToast(`"${kyc.companyName}" kurumsal hesabı ONAYLANDI ve Mavi Rozet verildi!`, 'success')
}

function rejectKyc(kyc: any) {
  const reason = prompt('Lütfen ret gerekçesini giriniz:', 'Yüklenen vergi levhası güncel değildir veya imza sirküleri eksiktir.')
  if (reason) {
    kyc.status = 'rejected'
    kyc.badgeGranted = false
    kyc.rejectionReason = reason
    triggerToast(`"${kyc.companyName}" başvurusu reddedildi.`, 'info')
  }
}

// ----------------------------------------------------
// Live Room Operator Handlers
// ----------------------------------------------------
function extendRoomTime(room: any, extraSeconds = 300) {
  room.remainingSeconds = (room.remainingSeconds || 0) + extraSeconds
  room.status = 'live'
  triggerToast(`"${room.tenderTitle}" odasına +5 DAKİKA süre eklendi!`, 'success')
}

function toggleRoomStatus(room: any) {
  if (room.status === 'live') {
    room.status = 'paused'
    triggerToast(`Oda geçici olarak duraklatıldı (PAUSE).`, 'info')
  } else if (room.status === 'paused') {
    room.status = 'live'
    triggerToast(`Oda canlı yayına devam ediyor.`, 'success')
  } else {
    room.status = 'live'
    room.remainingSeconds = 600
    triggerToast(`Oda yeniden başlatıldı!`, 'success')
  }
}

function endRoomWithWinner(room: any) {
  if (confirm(`İhaleyi "${room.leaderSupplier}" lider tedarikçisine (${room.currentBestBid.toLocaleString('tr-TR')} ₺) kazandırarak kapatmak istiyor musunuz?`)) {
    room.status = 'ended'
    room.remainingSeconds = 0
    triggerToast(`İhale başarıyla sonuçlandırıldı ve kazanan ilan edildi!`, 'success')
  }
}

// ----------------------------------------------------
// Escrow Delivery Order Handlers
// ----------------------------------------------------
function updateEscrowStatus(order: any, nextStatus: string) {
  order.escrowStatus = nextStatus
  triggerToast(`Sipariş ${order.orderCode} durumu "${nextStatus}" olarak güncellendi.`, 'success')
}

// ----------------------------------------------------
// Category Management Handlers
// ----------------------------------------------------
const newCategory = reactive({
  name: '',
  icon: 'Building2',
  targetSavings: '%15.0',
  description: ''
})

function addCategory() {
  if (!newCategory.name) return
  formState.categories.push({
    id: 'kat-' + (formState.categories.length + 1),
    name: newCategory.name,
    icon: newCategory.icon,
    targetSavings: newCategory.targetSavings || '%15.0',
    activeTendersCount: 0,
    description: newCategory.description || 'Yeni B2B tedarik kategorisi.'
  })
  newCategory.name = ''
  newCategory.description = ''
  triggerToast('Yeni B2B sektörü ve kategorisi eklendi!', 'success')
}

function removeCategory(idx: number) {
  formState.categories.splice(idx, 1)
  triggerToast('Kategori silindi.', 'info')
}

// ----------------------------------------------------
// Promo Code Handlers
// ----------------------------------------------------
const newPromo = reactive({
  code: '',
  discountType: 'free_trial_months',
  value: '6 Ay Bedelsiz',
  usageLimit: 500,
  expiryDate: '2027-02-22'
})

function addPromoCode() {
  if (!newPromo.code) return
  formState.promoCodes.push({
    code: newPromo.code.toUpperCase().replace(/\s/g, ''),
    discountType: newPromo.discountType,
    value: newPromo.value,
    usageLimit: newPromo.usageLimit,
    usedCount: 0,
    expiryDate: newPromo.expiryDate,
    status: 'active'
  })
  newPromo.code = ''
  triggerToast('Yeni promosyon kupon kodu tanımlandı!', 'success')
}

function removePromoCode(idx: number) {
  formState.promoCodes.splice(idx, 1)
  triggerToast('Kupon silindi.', 'info')
}

// ----------------------------------------------------
// CRM Leads State & Helpers
// ----------------------------------------------------
const crmSearchQuery = ref('')
const crmStatusFilter = ref('ALL')

const filteredLeads = computed(() => {
  let list = formState.crmSettings?.leads || []
  if (crmStatusFilter.value !== 'ALL') {
    list = list.filter((item: any) => item.status === crmStatusFilter.value)
  }
  if (crmSearchQuery.value.trim()) {
    const q = crmSearchQuery.value.toLowerCase()
    list = list.filter((item: any) => 
      item.companyName.toLowerCase().includes(q) ||
      item.contactName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.includes(q)
    )
  }
  return list
})

const newLeadForm = reactive({
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  status: '6 Ay Deneme Aktif',
  notes: ''
})

function addLead() {
  if (!newLeadForm.companyName || !newLeadForm.email) {
    alert('Lütfen firma adı ve e-posta adresini giriniz.')
    return
  }
  const today = new Date().toISOString().split('T')[0]
  formState.crmSettings.leads.unshift({
    id: Date.now(),
    companyName: newLeadForm.companyName,
    contactName: newLeadForm.contactName || 'Yetkili',
    email: newLeadForm.email,
    phone: newLeadForm.phone || '-',
    status: newLeadForm.status,
    notes: newLeadForm.notes || 'Yeni eklenen B2B üye adayı.',
    createdAt: today
  })
  newLeadForm.companyName = ''
  newLeadForm.contactName = ''
  newLeadForm.email = ''
  newLeadForm.phone = ''
  newLeadForm.notes = ''
  triggerToast('Yeni CRM müşteri kaydı eklendi!', 'success')
}

function removeLead(index: number) {
  formState.crmSettings.leads.splice(index, 1)
  triggerToast('Müşteri kaydı silindi.', 'info')
}

// ----------------------------------------------------
// Email & Template Helpers
// ----------------------------------------------------
const selectedTemplateIdx = ref(0)
const testEmailTarget = ref('kurumsal@firma.com')

const currentTemplate = computed(() => {
  return formState.emailSettings?.templates?.[selectedTemplateIdx.value] || null
})

function sendTestEmail() {
  if (!testEmailTarget.value) return
  triggerToast(`"${formState.emailSettings.senderEmail}" üzerinden "${testEmailTarget.value}" adresine test e-postası başarıyla iletildi!`, 'success')
}

const newSubscriberEmail = ref('')
const newSubscriberCompany = ref('')

function addSubscriber() {
  if (!newSubscriberEmail.value) return
  const today = new Date().toISOString().split('T')[0]
  formState.emailSettings.subscribers.unshift({
    id: Date.now(),
    email: newSubscriberEmail.value,
    companyName: newSubscriberCompany.value || 'B2B Şirket',
    source: 'Manuel Eklendi',
    subscribedAt: today,
    status: 'Aktif'
  })
  newSubscriberEmail.value = ''
  newSubscriberCompany.value = ''
  triggerToast('Yeni e-posta abonesi listeye kaydedildi!', 'success')
}

function removeSubscriber(index: number) {
  formState.emailSettings.subscribers.splice(index, 1)
  triggerToast('Abone listeden çıkarıldı.', 'info')
}

// ----------------------------------------------------
// Dashboard Tenders / Bids Helpers
// ----------------------------------------------------
function addDashboardTender() {
  const newId = 'IHC-2026-' + Math.floor(100 + Math.random() * 900)
  formState.dashboard.tenders.push({
    id: newId,
    baslik: 'Yeni İhale Başlığı',
    kategori: 'Kırtasiye & Ofis',
    sure: '7 gün',
    teklifSayisi: 0,
    durum: 'active',
    butce: '₺50.000',
    olusturma: 'Bugün'
  })
  formState.dashboard.receivedBids.push({
    id: newId,
    baslik: 'Yeni İhale Başlığı',
    kategori: 'Kırtasiye & Ofis',
    bitis: 'Gelecek Hafta',
    teklifler: []
  })
}
function removeDashboardTender(index: number) {
  const idToDelete = formState.dashboard.tenders[index].id
  formState.dashboard.tenders.splice(index, 1)
  const rIdx = formState.dashboard.receivedBids.findIndex((rb: any) => rb.id === idToDelete)
  if (rIdx !== -1) {
    formState.dashboard.receivedBids.splice(rIdx, 1)
  }
}

function addReceivedBid(tenderIdx: number) {
  formState.dashboard.receivedBids[tenderIdx].teklifler.push({
    id: 'TKF-' + Math.floor(100 + Math.random() * 900),
    firma: 'Yeni Tedarikçi Ltd.',
    fiyat: '₺40.000',
    sure: '5 gün',
    puan: 4.5,
    durum: 'bekliyor'
  })
}
function removeReceivedBid(tenderIdx: number, bidIdx: number) {
  formState.dashboard.receivedBids[tenderIdx].teklifler.splice(bidIdx, 1)
}

function addSubmittedBid() {
  formState.dashboard.submittedBids.push({
    id: 'TKF-' + Math.floor(100 + Math.random() * 900),
    ilanBaslik: 'Firma Hizmet Alımı İlanı',
    aliciFirma: '****** A.Ş.',
    kategori: 'Lojistik & Nakliye',
    teklifFiyatim: '₺100.000',
    sure: '10 gün',
    durum: 'bekliyor',
    tarih: 'Bugün',
    bitisTarihi: 'Gelecek Hafta',
    notum: 'Fiyat teklifimizi ilettik.'
  })
}
function removeSubmittedBid(index: number) {
  formState.dashboard.submittedBids.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    
    <!-- LOGIN OVERLAY -->
    <div v-if="!isLoggedIn" class="flex-grow flex items-center justify-center p-6 relative overflow-hidden" style="background-image: radial-gradient(circle at top right, rgba(37,99,235,0.15), transparent), radial-gradient(circle at bottom left, rgba(16,185,129,0.1), transparent);">
      <div class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        
        <div class="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="İhaleciBurada Logo" class="h-10 w-auto brightness-0 invert" />
          <h2 class="mt-4 text-lg font-black tracking-tight text-white">İhaleciBurada Yönetim & Operasyon Suite</h2>
          <p class="text-xs text-slate-400 mt-1 text-center">Kurumsal KYC, Canlı Eksiltme, Escrow Teslimat, CRM ve E-Posta Merkezi.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">YÖNETİCİ E-POSTA</label>
            <div class="relative">
              <User :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="email" 
                type="text" 
                placeholder="admin@ihaleciburada.com" 
                class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-11 text-xs text-white focus:border-blue-500 focus:outline-none" 
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">ŞİFRE</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-11 text-xs text-white focus:border-blue-500 focus:outline-none" 
                required
              />
            </div>
          </div>

          <div class="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-[11px] text-blue-300 space-y-1">
            <div class="font-bold flex items-center gap-1.5"><ShieldCheck :size="13" class="text-emerald-400" /> Giriş Yetkisi:</div>
            <div>E-Posta: <strong class="text-white font-mono">admin@ihaleciburada.com</strong></div>
            <div>Şifre: <strong class="text-white font-mono">admin123</strong> (veya <span class="font-mono">demo-password</span>)</div>
          </div>

          <div v-if="authError" class="text-red-500 text-xs font-bold py-1">
            ⚠️ {{ authError }}
          </div>

          <button type="submit" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            Operasyon Merkezine Giriş Yap
          </button>
        </form>
      </div>
    </div>

    <!-- AUTHORIZED WORKSPACE -->
    <div v-else class="flex-grow flex flex-col md:flex-row">
      
      <!-- SIDEBAR -->
      <aside class="w-full md:w-68 border-r border-slate-800 bg-slate-900 flex flex-col justify-between shrink-0">
        <div>
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="/logo.png" alt="İhaleciBurada Logo" class="h-7 w-auto brightness-0 invert" />
              <span class="text-[8px] bg-emerald-600/30 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-black">ENTERPRISE</span>
            </div>
          </div>

          <!-- Grouped Nav Links -->
          <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-left">
            
            <!-- OVERVIEW -->
            <button 
              @click="activeTab = 'overview'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer mb-2"
              :class="activeTab === 'overview' ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
            >
              <BarChart3 :size="15" class="text-amber-400" />
              <span>Yönetici Özeti & KPI</span>
            </button>

            <!-- GROUP: ONAY & GÜVENLİK -->
            <div class="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <ShieldCheck :size="10" /> KURUMSAL ONAY & GÜVENLİK
            </div>

            <button 
              @click="activeTab = 'kyc_desk'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'kyc_desk' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <span class="flex items-center gap-2.5"><FileCheck :size="14" /> KYC & Mavi Rozet</span>
              <span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                {{ formState.kycVerifications.filter((k: any) => k.status === 'pending').length }} Bekleyen
              </span>
            </button>

            <button 
              @click="activeTab = 'audit_logs'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'audit_logs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <ShieldAlert :size="14" />
              Güvenlik & Audit Log
            </button>

            <!-- GROUP: İHALE & OPERASYON -->
            <div class="text-[9px] font-black text-rose-400 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Zap :size="10" /> İHALE & OPERASYON
            </div>

            <button 
              @click="activeTab = 'live_rooms'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'live_rooms' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <span class="flex items-center gap-2.5"><Activity :size="14" /> Canlı Eksiltme Odası</span>
              <span class="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>

            <button 
              @click="activeTab = 'escrow_delivery'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'escrow_delivery' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Package :size="14" />
              Sipariş & Escrow Havuz
            </button>

            <button 
              @click="activeTab = 'disputes_desk'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'disputes_desk' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <span class="flex items-center gap-2.5"><Scale :size="14" /> Mücbir Sebep & Fesih</span>
              <span class="text-[9px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.2 rounded font-mono">
                {{ (formState.dashboard.disputes || []).filter((d: any) => d.status === 'INCELENIYOR').length }} Talep
              </span>
            </button>

            <button 
              @click="activeTab = 'categories'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Layers :size="14" />
              Sektör & Kategoriler
            </button>

            <button 
              @click="activeTab = 'video_cms'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'video_cms' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Video :size="14" />
              Video Rehberler & Akademi
            </button>

            <!-- GROUP: İLETİŞİM & AI -->
            <div class="text-[9px] font-black text-teal-400 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Bot :size="10" /> İLETİŞİM & AI ASİSTAN
            </div>

            <button 
              @click="activeTab = 'support_ai'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'support_ai' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <MessageSquare :size="14" />
              WhatsApp & AI Asistan
            </button>

            <button 
              @click="activeTab = 'netgsm_sms'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'netgsm_sms' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <span class="flex items-center gap-2.5"><Smartphone :size="14" /> NetGSM SMS Gateway</span>
              <span class="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                Canlı
              </span>
            </button>

            <!-- GROUP: MÜŞTERİ & PAZARLAMA -->
            <div class="text-[9px] font-black text-amber-400 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Users :size="10" /> MÜŞTERİ & PAZARLAMA
            </div>

            <button 
              @click="activeTab = 'crm_leads'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'crm_leads' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Users :size="14" />
              CRM Müşteri Adayları
            </button>

            <button 
              @click="activeTab = 'email_center'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'email_center' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Mail :size="14" />
              E-Posta Şablonları & Gönderim
            </button>

            <button 
              @click="activeTab = 'newsletter_subs'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'newsletter_subs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Inbox :size="14" />
              Bülten Aboneleri
            </button>

            <button 
              @click="activeTab = 'promo_codes'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'promo_codes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Ticket :size="14" />
              Kupon & Kampanya Kodları
            </button>

            <!-- GROUP: SİTE AYARLARI -->
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 pt-3 mb-1.5">SİTE CMS & ALTYAPI</div>

            <button 
              @click="activeTab = 'site_settings'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'site_settings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Settings :size="14" />
              Site Ayarları & Bakım Modu
            </button>

            <button 
              @click="activeTab = 'hero'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'hero' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Home :size="14" />
              Hero & Duyuru Bantları
            </button>

            <button 
              @click="activeTab = 'plans'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'plans' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <CreditCard :size="14" />
              Abonelik & 6 Ay Deneme
            </button>

            <!-- GROUP: VERİTABANI İZLEME -->
            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 pt-3 mb-1.5">B2B VERİTABANI</div>

            <button 
              @click="activeTab = 'db_tenders'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_tenders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Folder :size="14" />
              İlanlarım (Tenders)
            </button>

            <button 
              @click="activeTab = 'db_received'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_received' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Download :size="14" />
              Gelen Teklifler
            </button>

            <button 
              @click="activeTab = 'db_payments'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_payments' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <DollarSign :size="14" />
              Gelen Ödemeler
            </button>

          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-800 space-y-2">
          <button @click="exportDataBackup" class="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition cursor-pointer">
            <Download :size="13" />
            JSON Veri Yedeği İndir
          </button>
          <NuxtLink to="/" target="_blank" class="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition">
            <ExternalLink :size="13" />
            Canlı Siteyi Gör
          </NuxtLink>
          <button @click="handleLogout" class="w-full flex items-center justify-center gap-1.5 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 px-3 py-1.5 text-xs font-bold transition cursor-pointer">
            Çıkış Yap
          </button>
        </div>
      </aside>

      <!-- MAIN WORKSPACE -->
      <main class="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen text-left">
        
        <!-- Header Toolbar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
          <div>
            <h1 class="text-xl font-black text-white flex items-center gap-2.5">
              <span v-if="activeTab === 'overview'">📊 İhaleciBurada Yönetici Özeti & Finansal KPI</span>
              <span v-else-if="activeTab === 'kyc_desk'">🛡️ Kurumsal Firma Doğrulama & KYC Masası (Mavi Rozet)</span>
              <span v-else-if="activeTab === 'live_rooms'">🔴 Canlı Tersine Eksiltme Odası Operatörü</span>
              <span v-else-if="activeTab === 'escrow_delivery'">📦 Sipariş, Güvenli Havuz (Escrow) & Teslimat</span>
              <span v-else-if="activeTab === 'categories'">🏷️ B2B Sektör & Kategori Yönetimi</span>
              <span v-else-if="activeTab === 'video_cms'">🎬 Video Rehberler & B2B Akademi CMS</span>
              <span v-else-if="activeTab === 'promo_codes'">🎟️ Kupon & Lansman Promosyon Kodları</span>
              <span v-else-if="activeTab === 'audit_logs'">🔒 Sistem Denetim İzi & Güvenlik Günlüğü</span>
              <span v-else-if="activeTab === 'site_settings'">⚙️ Site Genel Ayarları, SEO & Bakım Modu</span>
              <span v-else-if="activeTab === 'support_ai'">💬 WhatsApp & Yapay Zeka Canlı Asistan</span>
              <span v-else-if="activeTab === 'crm_leads'">👥 CRM Müşteri / Aday Yönetim Merkezi</span>
              <span v-else-if="activeTab === 'email_center'">📧 E-Posta Şablonları & Gönderim Merkezi</span>
              <span v-else-if="activeTab === 'newsletter_subs'">📬 Bülten & E-Posta Aboneleri</span>
              <span v-else-if="activeTab === 'hero'">🏠 Ana Sayfa İçerik & Bant Yönetimi</span>
              <span v-else-if="activeTab === 'plans'">💳 Abonelik & 6 Ay Deneme Fiyatlandırması</span>
              <span v-else>🗄️ B2B Veritabanı Kontrolü</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">İhaleciBurada platform altyapısını, güvenlik denetimlerini ve ticari operasyonları yönetin.</p>
          </div>

          <div class="flex items-center gap-3">
            <button @click="handleReset" class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer">
              <RotateCcw :size="13" />
              Sıfırla
            </button>
            <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
              <Save :size="14" />
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>

        <!-- TAB VIEWS -->
        <div class="space-y-6">

          <!-- ========================================================================= -->
          <!-- TAB: OVERVIEW & EXECUTIVE KPI DASHBOARD -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <!-- Metric Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOPLAM TİCARET HACMİ</span>
                <div class="text-2xl font-black text-white mt-1.5">12.4M ₺+</div>
                <span class="text-[11px] text-emerald-400 font-bold mt-1 block">↗ %14.2 Ortalama Tasarruf</span>
              </div>
              <div class="p-5 rounded-2xl border border-emerald-900/50 bg-emerald-950/20">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">6 AY DENEME AKTİF FİRMALAR</span>
                <div class="text-2xl font-black text-emerald-400 mt-1.5">142 Firma</div>
                <span class="text-[11px] text-emerald-300 font-bold mt-1 block">0 ₺ Bedelsiz Lansman Üyeliği</span>
              </div>
              <div class="p-5 rounded-2xl border border-blue-900/50 bg-blue-950/20">
                <span class="text-[10px] font-black text-blue-400 uppercase tracking-wider">AKTİF İHALE SAYISI</span>
                <div class="text-2xl font-black text-blue-400 mt-1.5">{{ formState.dashboard?.tenders?.length || 48 }}+</div>
                <span class="text-[11px] text-blue-300 font-bold mt-1 block">Canlı Eksiltme Yayında</span>
              </div>
              <div class="p-5 rounded-2xl border border-amber-900/50 bg-amber-950/20">
                <span class="text-[10px] font-black text-amber-400 uppercase tracking-wider">ONAY BEKLEYEN KYC EVRAKLARI</span>
                <div class="text-2xl font-black text-amber-400 mt-1.5">
                  {{ formState.kycVerifications.filter((k: any) => k.status === 'pending').length }} Başvuru
                </div>
                <button @click="activeTab = 'kyc_desk'" class="text-[11px] text-amber-300 hover:underline font-bold mt-1 block cursor-pointer">
                  Hemen İncele & Onayla →
                </button>
              </div>
            </div>

            <!-- Quick Operational Actions -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Zap :size="14" class="text-amber-400" /> Hızlı Operasyon Kısayolları
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button @click="activeTab = 'kyc_desk'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition text-left cursor-pointer">
                  <FileCheck :size="18" class="text-emerald-400 mb-2" />
                  <div class="text-xs font-bold text-white">KYC Evraklarını İncele</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Firmalara Mavi Rozet ver</div>
                </button>
                <button @click="activeTab = 'live_rooms'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition text-left cursor-pointer">
                  <Activity :size="18" class="text-rose-400 mb-2" />
                  <div class="text-xs font-bold text-white">Canlı Eksiltme Yönet</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Odalara +5 dk ekle / sonuçlandır</div>
                </button>
                <button @click="activeTab = 'email_center'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition text-left cursor-pointer">
                  <Mail :size="18" class="text-blue-400 mb-2" />
                  <div class="text-xs font-bold text-white">Toplu Mail & Şablonlar</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">info@ üzerinden bildirim gönder</div>
                </button>
                <button @click="activeTab = 'support_ai'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition text-left cursor-pointer">
                  <Bot :size="18" class="text-teal-400 mb-2" />
                  <div class="text-xs font-bold text-white">WhatsApp & AI Ayarları</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Canlı asistan promptunu güncelle</div>
                </button>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 1: KYC & FIRMA DOĞRULAMA MASASI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'kyc_desk'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck :size="16" class="text-emerald-400" />
                    Kurumsal Firma Doğrulama & KYC Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Firmaların yüklediği vergi levhası, imza sirküleri ve ticaret sicil evraklarını inceleyip Mavi Rozet onayını verin.</p>
                </div>
              </div>

              <!-- KYC Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="kyc in formState.kycVerifications" 
                  :key="kyc.id"
                  class="p-5 rounded-2xl border bg-slate-950 space-y-3 transition relative overflow-hidden"
                  :class="kyc.status === 'approved' ? 'border-emerald-500/40 bg-emerald-950/10' : (kyc.status === 'rejected' ? 'border-red-900/40 bg-red-950/10' : 'border-amber-500/40 bg-amber-950/10')"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-black text-white">{{ kyc.companyName }}</span>
                        <span v-if="kyc.badgeGranted" class="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          ✓ MAVİ ROZET
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5">{{ kyc.companyType }} • {{ kyc.taxOffice }} (Vergi No: {{ kyc.taxNo }})</div>
                    </div>
                    <span 
                      class="px-2.5 py-1 rounded text-[10px] font-black uppercase"
                      :class="kyc.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (kyc.status === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse')"
                    >
                      {{ kyc.status === 'approved' ? 'Onaylandı' : (kyc.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor') }}
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-300 space-y-1 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div><strong>Yetkili:</strong> {{ kyc.authorizedPerson }}</div>
                    <div><strong>İletişim:</strong> {{ kyc.phone }} | {{ kyc.email }}</div>
                    <div><strong>Yüklenen Evraklar:</strong> 
                      <span class="text-blue-400 font-mono"> {{ kyc.uploadedDocs.join(', ') }}</span>
                    </div>
                    <div v-if="kyc.rejectionReason" class="text-red-400">
                      <strong>Ret Nedeni:</strong> {{ kyc.rejectionReason }}
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-[10px] text-slate-500 font-mono">{{ kyc.createdAt }}</span>
                    <div class="flex items-center gap-2">
                      <button 
                        v-if="kyc.status !== 'approved'" 
                        @click="approveKyc(kyc)"
                        class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 :size="13" /> Onayla & Mavi Rozet Ver
                      </button>
                      <button 
                        v-if="kyc.status !== 'rejected'" 
                        @click="rejectKyc(kyc)"
                        class="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle :size="13" /> Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 2: CANLI TERSİNE EKSİLTME ODASI OPERATÖRÜ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'live_rooms'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Activity :size="16" class="text-rose-500" />
                    Canlı Tersine Eksiltme (Canlı Pazarlık) Odaları Operatör Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Odalara anlık müdahale edin, süre uzatın, duraklatın veya lider teklifi kabul ederek kazananı ilan edin.</p>
                </div>
              </div>

              <!-- Live Rooms Grid -->
              <div class="grid grid-cols-1 gap-4">
                <div 
                  v-for="room in formState.liveAuctionRooms" 
                  :key="room.id"
                  class="p-5 rounded-2xl border bg-slate-950 space-y-4 transition"
                  :class="room.status === 'live' ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-slate-800'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-mono bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-bold">{{ room.id }}</span>
                        <span class="text-sm font-black text-white">{{ room.tenderTitle }}</span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-1">Kategori: {{ room.category }} • Katılımcı: {{ room.participantsCount }} Tedarikçi</div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span 
                        class="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5"
                        :class="room.status === 'live' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : (room.status === 'paused' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400')"
                      >
                        <span v-if="room.status === 'live'" class="h-2 w-2 rounded-full bg-rose-500"></span>
                        <span>{{ room.status === 'live' ? 'CANLI PAZARLIKTA' : (room.status === 'paused' ? 'DURAKLATILDI' : 'TAMAMLANDI') }}</span>
                      </span>
                    </div>
                  </div>

                  <!-- Price & Leader Bar -->
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">TAVAN AÇILIŞ</span>
                      <span class="text-sm font-mono font-bold text-slate-300">{{ room.ceilingPrice.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">LİDER EKSİLTME TEKLİFİ</span>
                      <span class="text-sm font-mono font-black text-emerald-400">{{ room.currentBestBid.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">MİNİMUM EKSİLTME ADIMI</span>
                      <span class="text-sm font-mono font-bold text-blue-400">{{ room.minStep.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">LİDER TEDARİKÇİ</span>
                      <span class="text-xs font-bold text-amber-300 truncate block">{{ room.leaderSupplier }}</span>
                    </div>
                  </div>

                  <!-- Operator Action Controls -->
                  <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                    <div class="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock :size="14" class="text-blue-400" />
                      <span>Kalan Süre: <strong>{{ Math.floor(room.remainingSeconds / 60) }} dk {{ room.remainingSeconds % 60 }} sn</strong></span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        @click="extendRoomTime(room, 300)" 
                        class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle :size="13" /> +5 Dakika Ekle
                      </button>
                      <button 
                        @click="toggleRoomStatus(room)" 
                        class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pause v-if="room.status === 'live'" :size="13" />
                        <Play v-else :size="13" />
                        <span>{{ room.status === 'live' ? 'Duraklat' : 'Devam Ettir' }}</span>
                      </button>
                      <button 
                        v-if="room.status !== 'ended'"
                        @click="endRoomWithWinner(room)" 
                        class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <Award :size="13" /> Kazananla Sonuçlandır
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 3: SİPARİŞ & GÜVENLİ HAVUZ (ESCROW) -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'escrow_delivery'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Package :size="16" class="text-blue-400" />
                    Sipariş & Güvenli Havuz (Escrow) Teslimat Denetim Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Sonuçlanan ihalelerin bloke ödemelerini, sevkiyat takip kodlarını ve teslimat onaylarını yönetin.</p>
                </div>
              </div>

              <!-- Escrow Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">SİPARİŞ & İHALE</th>
                      <th class="p-3.5">ALICI & TEDARİKÇİ</th>
                      <th class="p-3.5">TUTAR</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5">SEVKİYAT / KARGO</th>
                      <th class="p-3.5 text-right">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="order in formState.escrowOrders" :key="order.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5">
                        <div class="font-bold text-white">{{ order.tenderTitle }}</div>
                        <div class="text-[10px] text-blue-400 font-mono">{{ order.orderCode }}</div>
                      </td>
                      <td class="p-3.5 text-slate-300">
                        <div><strong>Alıcı:</strong> {{ order.buyerCompany }}</div>
                        <div class="text-slate-400"><strong>Tedarikçi:</strong> {{ order.supplierCompany }}</div>
                      </td>
                      <td class="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                        {{ order.totalAmount }}
                      </td>
                      <td class="p-3.5">
                        <span 
                          class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase"
                          :class="order.escrowStatus === 'odeme_cozuldu' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (order.escrowStatus === 'teslim_onaylandi' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800')"
                        >
                          {{ order.escrowStatus.replace('_', ' ') }}
                        </span>
                      </td>
                      <td class="p-3.5 text-[11px] text-slate-400 font-mono">
                        <div>{{ order.trackingNumber }}</div>
                        <div class="text-[10px] text-slate-500">{{ order.deliveryDate }}</div>
                      </td>
                      <td class="p-3.5 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="updateEscrowStatus(order, 'odeme_cozuldu')"
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black cursor-pointer"
                          >
                            Ödemeyi Çöz
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: MÜCBİR SEBEP & FESİH HAKEM HEYETİ MASASI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'disputes_desk'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Scale :size="16" class="text-red-400" />
                    Mücbir Sebep, Sözleşme İptali & Hakem Heyeti Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Ölüm, iflas, hammadde krizleri gibi beklenmedik mücbir sebeplerde tarafların fesih taleplerini inceleyin ve karara bağlayın.</p>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">TALEP NO & İHALE</th>
                      <th class="p-3.5">TARAFLAR & TUTAR</th>
                      <th class="p-3.5">MÜCBİR SEBEP GEREKÇESİ</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5 text-right">HAKEM KARARI</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="disp in formState.dashboard.disputes" :key="disp.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5">
                        <div class="font-bold text-white">{{ disp.tenderTitle }}</div>
                        <div class="text-[10px] text-red-400 font-mono">{{ disp.id }} • {{ disp.date }}</div>
                      </td>
                      <td class="p-3.5 text-slate-300">
                        <div>{{ disp.parties }}</div>
                        <div class="text-emerald-400 font-mono font-bold">{{ disp.amount }}</div>
                      </td>
                      <td class="p-3.5 text-slate-300 max-w-xs">
                        <div class="text-[11px] leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {{ disp.reason }}
                        </div>
                      </td>
                      <td class="p-3.5">
                        <span 
                          class="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider"
                          :class="disp.status === 'FESİH_ONAYLANDI' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (disp.status === 'REDDEDILDI' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse')"
                        >
                          {{ disp.status }}
                        </span>
                      </td>
                      <td class="p-3.5 text-right">
                        <div v-if="disp.status === 'INCELENIYOR'" class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="resolveDispute(disp, 'approved')"
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black cursor-pointer"
                          >
                            ✓ Fesihi Onayla (Cezasız)
                          </button>
                          <button 
                            @click="resolveDispute(disp, 'rejected')"
                            class="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-black cursor-pointer"
                          >
                            ✕ Reddet
                          </button>
                        </div>
                        <span v-else class="text-[10px] text-slate-500">İşlem Tamamlandı</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: NETGSM SMS GATEWAY & CANLI LOGLAR -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'netgsm_sms'" class="space-y-6">
            <!-- NetGSM Configuration -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Smartphone :size="16" class="text-emerald-400" />
                    NetGSM SMS Altyapısı & Başlık Ayarları
                  </h3>
                  <p class="text-[11px] text-slate-400">İhale onayları, karşı teklif bildirimleri ve güvenlik kodları için NetGSM kurumsal SMS entegrasyonu.</p>
                </div>
                <div class="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
                  <span>SMS Kredi Bakiyesi:</span>
                  <strong>{{ netGsmConfig.balance }} SMS</strong>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">NETGSM KULLANICI KODU</label>
                  <input v-model="netGsmConfig.userCode" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">API ŞİFRESİ</label>
                  <input v-model="netGsmConfig.password" type="password" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">GÖNDERİCİ BAŞLIĞI (ALFANUMERİK)</label>
                  <input v-model="netGsmConfig.header" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono font-bold text-emerald-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">DURUM</label>
                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Entegre & Aktif (HTTP GET/POST)
                  </div>
                </div>
              </div>
            </div>

            <!-- Test SMS Dispatch -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Send :size="14" class="text-emerald-400" /> Manuel Test SMS Gönderimi
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="testSmsForm.phone" type="text" placeholder="Telefon (0532...)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="testSmsForm.name" type="text" placeholder="Yetkili Adı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="testSmsForm.template" type="text" placeholder="Şablon Başlığı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
              </div>
              <div>
                <textarea v-model="testSmsForm.body" rows="2" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"></textarea>
              </div>
              <div class="flex justify-end">
                <button @click="sendTestSms" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-md">
                  <Smartphone :size="13" /> NetGSM İle SMS Gönder
                </button>
              </div>
            </div>

            <!-- Live SMS Logs -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock :size="14" class="text-blue-400" /> Canlı NetGSM İşlem & Gönderim Günlükleri
              </h3>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">ZAMAN & MSG ID</th>
                      <th class="p-3.5">ALICI GSM & FİRMA</th>
                      <th class="p-3.5">ŞABLON</th>
                      <th class="p-3.5">İÇERİK (SMS GÖVDESİ)</th>
                      <th class="p-3.5 text-right">DURUM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="log in smsLogs" :key="log.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 font-mono text-[11px]">
                        <div class="text-slate-300">{{ log.timestamp }}</div>
                        <div class="text-[10px] text-blue-400">{{ log.messageId }}</div>
                      </td>
                      <td class="p-3.5">
                        <div class="font-bold text-white">{{ log.recipientPhone }}</div>
                        <div class="text-[11px] text-slate-400">{{ log.recipientName }}</div>
                      </td>
                      <td class="p-3.5">
                        <span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                          {{ log.templateName }}
                        </span>
                      </td>
                      <td class="p-3.5 text-[11px] text-slate-300 max-w-md">
                        {{ log.messageBody }}
                      </td>
                      <td class="p-3.5 text-right">
                        <span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                          {{ log.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 4: SEKTÖR & KATEGORİ YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'categories'" class="space-y-6">
            <!-- Add New Category Form -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni B2B Sektör / Kategori Ekle
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newCategory.name" type="text" placeholder="Kategori Adı (Örn: Kimya & Plastik)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <input v-model="newCategory.targetSavings" type="text" placeholder="Hedef Tasarruf Oranı (Örn: %18.5)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <input v-model="newCategory.description" type="text" placeholder="Kısa Açıklama & Malzeme Kapsamı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
              </div>
              <div class="flex justify-end">
                <button @click="addCategory" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Kategoriyi Kaydet
                </button>
              </div>
            </div>

            <!-- Categories Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(cat, idx) in formState.categories" :key="cat.id" class="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 relative">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-xs font-black text-white">{{ cat.name }}</h4>
                    <span class="text-[10px] text-emerald-400 font-black mt-0.5 block">Hedef Tasarruf: {{ cat.targetSavings }}</span>
                  </div>
                  <button @click="removeCategory(idx)" class="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-950 rounded cursor-pointer">
                    <Trash2 :size="13" />
                  </button>
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">{{ cat.description }}</p>
                <div class="text-[10px] text-blue-400 font-bold bg-blue-950/40 px-2 py-1 rounded inline-block">
                  {{ cat.activeTendersCount }} Aktif İhale
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 5: VİDEO REHBERLER & AKADEMİ CMS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'video_cms'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Video :size="14" class="text-blue-500" /> B2B Akademi & Video Rehber İçerik Yönetimi
              </h3>
              <p class="text-[11px] text-slate-400">Sitede ve Hero butonunda açılan 4 ana rehber videosunun URL, başlık ve seslendirme metinlerini güncelleyin.</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(v, idx) in formState.videoGuides" :key="idx" class="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-bold">REHBER #{{ idx + 1 }}</span>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 mb-1">VİDEO BAŞLIĞI</label>
                    <input v-model="v.title" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 mb-1">AÇIKLAMA</label>
                    <input v-model="v.desc" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 mb-1">VİDEO MP4 / YOUTUBE BAĞLANTI URL'İ</label>
                    <input v-model="v.videoUrl" type="text" placeholder="https://assets.mixkit.co/..." class="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 6: KUPON & PROMOSYON KODLARI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'promo_codes'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Ticket :size="14" class="text-blue-500" /> Promosyon & Kampanya Kuponu Oluştur
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input v-model="newPromo.code" type="text" placeholder="Kupon Kodu (Örn: LANSMAN2026)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white uppercase font-mono" />
                <input v-model="newPromo.value" type="text" placeholder="Kupon Değeri (Örn: 6 Ay Bedelsiz)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newPromo.usageLimit" type="number" placeholder="Kullanım Limiti" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                <button @click="addPromoCode" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Kupon Tanımla
                </button>
              </div>
            </div>

            <!-- Promo Codes Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">KUPON KODU</th>
                    <th class="p-3.5">DEĞER / KAMPANYA</th>
                    <th class="p-3.5">KULLANIM LİMİTİ</th>
                    <th class="p-3.5">GEÇERLİLİK</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(p, idx) in formState.promoCodes" :key="p.code" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-mono font-bold text-white">{{ p.code }}</td>
                    <td class="p-3.5 text-emerald-400 font-bold">{{ p.value }}</td>
                    <td class="p-3.5 text-slate-300 font-mono">{{ p.usedCount }} / {{ p.usageLimit }} Kullanım</td>
                    <td class="p-3.5 text-slate-400 font-mono text-[10px]">{{ p.expiryDate }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ p.status }}</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button @click="removePromoCode(idx)" class="p-2 bg-red-950/30 text-red-400 rounded hover:bg-red-950 cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 7: GÜVENLİK & AUDIT LOG -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'audit_logs'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <ShieldAlert :size="16" class="text-blue-400" />
                    Sistem Denetim İzi & Güvenlik Günlüğü (Audit Log)
                  </h3>
                  <p class="text-[11px] text-slate-400">KVKK ve ISO 27001 gereğince tüm yönetici ve kullanıcı kritik işlem kayıtları zaman damgalı olarak tutulur.</p>
                </div>
              </div>

              <!-- Log Stream Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">ZAMAN DAMGASI</th>
                      <th class="p-3.5">KULLANICI</th>
                      <th class="p-3.5">İŞLEM</th>
                      <th class="p-3.5">IP ADRESİ</th>
                      <th class="p-3.5">DETAY</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 text-[11px]">
                    <tr v-for="log in formState.auditLogs" :key="log.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 text-slate-400">{{ log.timestamp }}</td>
                      <td class="p-3.5 font-bold text-white">{{ log.userEmail }}</td>
                      <td class="p-3.5 text-emerald-400 font-sans font-bold">{{ log.action }}</td>
                      <td class="p-3.5 text-blue-400">{{ log.ipAddress }}</td>
                      <td class="p-3.5 text-slate-300 font-sans">{{ log.details }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 8: SİTE GENEL AYARLARI & BAKIM MODU -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'site_settings'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Settings :size="16" class="text-blue-400" />
                    Platform Genel Yapılandırması & Bakım Modu
                  </h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                  <input type="checkbox" v-model="formState.siteSettings.maintenanceMode" class="rounded border-slate-700 bg-slate-950 text-amber-500" />
                  <span>Bakım Modunu Aktif Et (Maintenance)</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">PLATFORM META BAŞLIĞI (SEO TITLE)</label>
                  <input v-model="formState.siteSettings.metaTitle" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">META AÇIKLAMA (SEO DESCRIPTION)</label>
                  <textarea v-model="formState.siteSettings.metaDescription" rows="2" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">ÜST DUYURU BANDI METNİ (TICKER)</label>
                  <input v-model="formState.siteSettings.announcementTicker" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">GOOGLE ANALYTICS / GTM ID</label>
                    <input v-model="formState.siteSettings.googleAnalyticsId" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">DESTEK E-POSTA</label>
                    <input v-model="formState.siteSettings.supportEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: WHATSAPP & AI ASİSTAN YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'support_ai'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <MessageSquare :size="16" class="text-emerald-400" />
                  <h3 class="text-sm font-black text-white">WhatsApp Canlı Destek Butonu Ayarları</h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.whatsappEnabled" class="rounded border-slate-700 bg-slate-950 text-emerald-500" />
                  <span>WhatsApp Butonunu Göster</span>
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">WHATSAPP NUMARASI</label>
                  <input v-model="formState.supportSettings.whatsappNumber" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLANGIÇ MESAJI</label>
                  <input v-model="formState.supportSettings.whatsappMessage" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <Bot :size="18" class="text-blue-400" />
                  <h3 class="text-sm font-black text-white">Yapay Zeka (AI) Canlı Karşılama Asistanı</h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.aiEnabled" class="rounded border-slate-700 bg-slate-950 text-blue-500" />
                  <span>AI Asistanını Aktif Et</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">ASİSTAN BOT ADI</label>
                  <input v-model="formState.supportSettings.aiBotName" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">İLK KARŞILAMA VE HOŞ GELDİN MESAJI</label>
                  <textarea v-model="formState.supportSettings.aiGreeting" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white leading-relaxed"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">AI SİSTEM TALİMATI / PROMPT CONTEXT</label>
                  <textarea v-model="formState.supportSettings.aiPromptContext" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono text-[11px]"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: CRM LEADS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni Müşteri / Kurumsal Aday Ekle
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.companyName" type="text" placeholder="Şirket Unvanı *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.contactName" type="text" placeholder="Yetkili Kişi" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.email" type="email" placeholder="E-Posta Adresi *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.phone" type="text" placeholder="Telefon (05XX...)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <select v-model="newLeadForm.status" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white">
                  <option value="6 Ay Deneme Aktif">6 Ay Deneme Aktif</option>
                  <option value="Teklif Veren">Teklif Veren</option>
                  <option value="İhale Açan">İhale Açan</option>
                  <option value="Görüşülüyor">Görüşülüyor</option>
                </select>
                <input v-model="newLeadForm.notes" type="text" placeholder="Not / Talep Detayı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
              </div>
              <div class="flex justify-end">
                <button @click="addLead" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Müşteriyi Kaydet
                </button>
              </div>
            </div>

            <!-- Leads Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">FİRMA & YETKİLİ</th>
                    <th class="p-3.5">İLETİŞİM</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5">NOTLAR</th>
                    <th class="p-3.5 text-right">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(lead, idx) in filteredLeads" :key="lead.id" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-bold text-white">
                      <div>{{ lead.companyName }}</div>
                      <div class="text-[10px] text-slate-400 font-normal">{{ lead.contactName }}</div>
                    </td>
                    <td class="p-3.5 text-slate-300">
                      <div>{{ lead.email }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ lead.phone }}</div>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {{ lead.status }}
                      </span>
                    </td>
                    <td class="p-3.5 text-slate-400 text-[11px]">{{ lead.notes }}</td>
                    <td class="p-3.5 text-right">
                      <button @click="removeLead(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: EMAIL CENTER & TEMPLATES -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'email_center'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Mail :size="16" class="text-blue-500" />
                <h3 class="text-sm font-black text-white">info@ihaleciburada.com Gönderici Yapılandırması</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">GÖNDERİCİ E-POSTA</label>
                  <input v-model="formState.emailSettings.senderEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">GÖNDERİCİ ADI</label>
                  <input v-model="formState.emailSettings.senderName" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">REPLY-TO E-POSTA</label>
                  <input v-model="formState.emailSettings.replyToEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
              </div>
            </div>

            <!-- Templates List & Editor -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">HAZIR E-POSTA ŞABLONLARI</span>
                <button
                  v-for="(tpl, idx) in formState.emailSettings.templates"
                  :key="tpl.id"
                  @click="selectedTemplateIdx = idx"
                  class="w-full text-left p-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer"
                  :class="selectedTemplateIdx === idx ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'"
                >
                  <span class="truncate pr-2">{{ tpl.name }}</span>
                  <span class="text-[10px] opacity-75 shrink-0">Düzenle</span>
                </button>
              </div>

              <div v-if="currentTemplate" class="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 class="text-sm font-black text-white">{{ currentTemplate.name }}</h4>
                  <span class="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded">{{ currentTemplate.id }}</span>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">KONU (SUBJECT)</label>
                  <input v-model="currentTemplate.subject" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">İÇERİK METNİ</label>
                  <textarea v-model="currentTemplate.content" rows="10" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-sans leading-relaxed"></textarea>
                </div>
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input v-model="testEmailTarget" type="email" placeholder="Test alıcı e-posta..." class="w-full sm:w-auto flex-1 bg-transparent border-0 text-xs text-white font-mono" />
                  <button @click="sendTestEmail" class="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <Send :size="13" /> Test Gönderimi Yap
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: NEWSLETTER SUBSCRIBERS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'newsletter_subs'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni Abone Ekle
              </h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <input v-model="newSubscriberEmail" type="email" placeholder="E-Posta *" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newSubscriberCompany" type="text" placeholder="Firma Adı" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <button @click="addSubscriber" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Abone Ekle
                </button>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">E-POSTA</th>
                    <th class="p-3.5">FİRMA</th>
                    <th class="p-3.5">KAYNAK</th>
                    <th class="p-3.5">TARİH</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(sub, idx) in formState.emailSettings.subscribers" :key="sub.id" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-bold text-white font-mono">{{ sub.email }}</td>
                    <td class="p-3.5 text-slate-300">{{ sub.companyName }}</td>
                    <td class="p-3.5 text-slate-400">{{ sub.source }}</td>
                    <td class="p-3.5 text-slate-500 font-mono text-[10px]">{{ sub.subscribedAt }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ sub.status }}</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button @click="removeSubscriber(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: HERO / HOMEPAGE -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'hero'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ANA SAYFA BAŞLIK VE METİNLERİ</h3>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">SLOGAN (TAGLINE)</label>
                <input v-model="formState.hero.tagline" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 1. SATIR</label>
                  <input v-model="formState.hero.titleLine1" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 2. SATIR</label>
                  <input v-model="formState.hero.titleLine2" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">AÇIKLAMA METNİ</label>
                <textarea v-model="formState.hero.description" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white leading-relaxed"></textarea>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: PLANS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">B2B ABONELİK PLANLARI (4 KART)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="pkg in formState.pricing.packages" :key="pkg.id" class="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div class="font-bold text-xs text-white">{{ pkg.name }}</div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 font-bold">Fiyat (₺):</span>
                    <input v-model="pkg.price" type="number" class="w-28 rounded border border-slate-800 bg-slate-900 p-1.5 text-xs text-white font-mono font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: DB TENDERS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_tenders'" class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-400">YAYINDAKİ İHALELER LİSTESİ</label>
              <button @click="addDashboardTender" class="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer">
                <Plus :size="14" /> Yeni İhale
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="(tender, index) in formState.dashboard.tenders" :key="tender.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-mono text-blue-400 font-bold bg-blue-950/30 px-2 py-0.5 rounded">{{ tender.id }}</span>
                  <button @click="removeDashboardTender(index)" class="p-2 bg-red-950/20 hover:bg-red-950 text-red-400 rounded-lg transition cursor-pointer">
                    <Trash2 :size="14" />
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input v-model="tender.baslik" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                  <input v-model="tender.kategori" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                  <input v-model="tender.butce" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: DB RECEIVED BIDS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_received'" class="space-y-4">
            <div class="space-y-4">
              <div v-for="(item, tIdx) in formState.dashboard.receivedBids" :key="item.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div class="font-bold text-xs text-white">{{ item.baslik }} ({{ item.id }})</div>
                <div v-for="(bid, bIdx) in item.teklifler" :key="bid.id" class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div class="font-bold text-white">{{ bid.firma }}</div>
                    <div class="text-[11px] text-slate-400 font-mono">{{ bid.fiyat }} • {{ bid.sure }}</div>
                  </div>
                  <button @click="removeReceivedBid(tIdx, bIdx)" class="p-1.5 bg-red-950/20 text-red-400 rounded cursor-pointer">
                    <Trash2 :size="12" />
                  </button>
                </div>
                <button @click="addReceivedBid(tIdx)" class="text-xs text-blue-400 font-bold flex items-center gap-1 cursor-pointer">
                  <Plus :size="12" /> Teklif Ekle
                </button>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: DB PAYMENTS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_payments'" class="space-y-4">
            <div class="space-y-4">
              <div v-for="payment in formState.payments" :key="payment.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-white">{{ payment.companyName }} ({{ payment.amount }})</div>
                  <div class="text-[11px] text-slate-400">{{ payment.packageName }} • {{ payment.paymentMethod }}</div>
                </div>
                <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ payment.status }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Floating Bottom Save Bar -->
        <div class="mt-8 border-t border-slate-800 pt-6 flex justify-between items-center">
          <div class="text-xs text-slate-400">
            * Tüm kurumsal ayarlar ve operasyon değişiklikleri anında sisteme yansıtılır.
          </div>
          <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            <Save :size="15" />
            Değişiklikleri Kaydet
          </button>
        </div>

      </main>
    </div>

    <!-- GLOBAL TOAST -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border p-4 shadow-xl text-xs font-bold bg-slate-900 border-slate-800 text-white">
        <CheckCircle :size="16" class="text-emerald-500" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>
