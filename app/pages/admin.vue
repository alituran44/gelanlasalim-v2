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
  Edit
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

// Page config
definePageMeta({
  layout: false // Custom full screen admin dashboard
})

const router = useRouter()
const { cmsData, saveCmsData, resetCmsData } = useCmsData()

// Auth State
const isLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const authError = ref('')

// Tabs
type AdminTab = 
  | 'hero' 
  | 'tender' 
  | 'plans' 
  | 'features' 
  | 'contact' 
  | 'support_ai' 
  | 'crm_leads' 
  | 'email_center' 
  | 'newsletter_subs' 
  | 'db_payments' 
  | 'db_tenders' 
  | 'db_received' 
  | 'db_submitted'

const activeTab = ref<AdminTab>('support_ai')

// Local copy for editing
const formState = reactive(JSON.parse(JSON.stringify(cmsData.value)))

// Ensure safety defaults for new modules if missing
if (!formState.supportSettings) {
  formState.supportSettings = {
    whatsappEnabled: true,
    whatsappNumber: '908503080000',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale süreçleri ve 6 ay ücretsiz deneme paketi hakkında bilgi almak istiyorum.',
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
    subscribers: [
      { id: 1, email: 'info@kalyon.com', companyName: 'Kalyon Tedarik Ltd.', source: 'Kayıt Formu', subscribedAt: '2026-08-20', status: 'Aktif' },
      { id: 2, email: 'satinalma@anadolu.com', companyName: 'Anadolu Lojistik A.Ş.', source: 'Bülten Aboneliği', subscribedAt: '2026-08-21', status: 'Aktif' },
      { id: 3, email: 'kurumsal@megaambalaj.com', companyName: 'Mega Ambalaj Sanayi', source: 'İhale Katılımı', subscribedAt: '2026-08-22', status: 'Aktif' }
    ],
    templates: []
  }
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'info'>('success')

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
    triggerToast('Yönetim paneline başarıyla giriş yapıldı!', 'success')
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

function triggerToast(msg: string, type: 'success' | 'info' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function handleSave() {
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  triggerToast('Tüm değişiklikler başarıyla kaydedildi ve yayına alındı!', 'success')
}

function handleReset() {
  if (confirm('Tüm içerikleri fabrika varsayılan ayarlarına döndürmek istediğinize emin misiniz?')) {
    resetCmsData()
    Object.assign(formState, JSON.parse(JSON.stringify(cmsData.value)))
    triggerToast('İçerikler varsayılan ayarlara sıfırlandı.', 'info')
  }
}

// ----------------------------------------------------
// CRM Leads Management State & Helpers
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
    alert('Lütfen en az firma adı ve e-posta adresini giriniz.')
    return
  }
  const newId = Date.now()
  const today = new Date().toISOString().split('T')[0]
  formState.crmSettings.leads.unshift({
    id: newId,
    companyName: newLeadForm.companyName,
    contactName: newLeadForm.contactName || 'Yetkili',
    email: newLeadForm.email,
    phone: newLeadForm.phone || '-',
    status: newLeadForm.status,
    notes: newLeadForm.notes || 'Yeni eklenen B2B üye adayı.',
    createdAt: today
  })

  // Reset Form
  newLeadForm.companyName = ''
  newLeadForm.contactName = ''
  newLeadForm.email = ''
  newLeadForm.phone = ''
  newLeadForm.notes = ''
  triggerToast('Yeni CRM müşteri kaydı başarıyla eklendi!', 'success')
}

function removeLead(index: number) {
  formState.crmSettings.leads.splice(index, 1)
  triggerToast('Müşteri kaydı silindi.', 'info')
}

// ----------------------------------------------------
// Email & Template Management State & Helpers
// ----------------------------------------------------
const selectedTemplateIdx = ref(0)
const testEmailTarget = ref('kurumsal@firma.com')

const currentTemplate = computed(() => {
  return formState.emailSettings?.templates?.[selectedTemplateIdx.value] || null
})

function sendTestEmail() {
  if (!testEmailTarget.value) {
    alert('Lütfen bir test e-posta adresi yazınız.')
    return
  }
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
// Hero Badge Helpers
// ----------------------------------------------------
function addBadge() {
  formState.hero.badgeStrip.push('YENİ ÖZELLİK VURGUSU')
}
function removeBadge(index: number) {
  formState.hero.badgeStrip.splice(index, 1)
}

// ----------------------------------------------------
// Live Tender Helpers
// ----------------------------------------------------
function addCompetitor() {
  formState.liveTender.competitors.push({
    name: 'Tedarikçi #' + Math.floor(100 + Math.random() * 900),
    price: 410000,
    leader: false
  })
}
function removeCompetitor(index: number) {
  formState.liveTender.competitors.splice(index, 1)
}
function setLeader(index: number) {
  formState.liveTender.competitors.forEach((c: any, i: number) => {
    c.leader = i === index
  })
  if (formState.liveTender.competitors[index]) {
    formState.liveTender.bestBid = formState.liveTender.competitors[index].price
  }
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
    
    <!-- Login Overlay -->
    <div v-if="!isLoggedIn" class="flex-grow flex items-center justify-center p-6 relative overflow-hidden" style="background-image: radial-gradient(circle at top right, rgba(37,99,235,0.15), transparent), radial-gradient(circle at bottom left, rgba(16,185,129,0.1), transparent);">
      <div class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
        
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="İhaleciBurada Yönetici Giriş Logosu" class="h-10 w-auto brightness-0 invert" />
          <h2 class="mt-4 text-lg font-black tracking-tight text-white">İhaleciBurada Yönetim & CRM Paneli</h2>
          <p class="text-xs text-slate-400 mt-1 text-center">Platform içeriklerini, WhatsApp & AI asistanını, CRM müşteri verilerini ve e-posta bültenlerini yönetin.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">E-POSTA ADRESİ</label>
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

          <!-- Quick Hint for user credentials -->
          <div class="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-[11px] text-blue-300 space-y-1">
            <div class="font-bold flex items-center gap-1.5"><ShieldCheck :size="13" class="text-emerald-400" /> Yönetici Giriş Bilgileri:</div>
            <div>E-Posta: <strong class="text-white font-mono">admin@ihaleciburada.com</strong></div>
            <div>Şifre: <strong class="text-white font-mono">admin123</strong> (veya <span class="font-mono">demo-password</span>)</div>
          </div>

          <div v-if="authError" class="text-red-500 text-xs font-bold py-1">
            ⚠️ {{ authError }}
          </div>

          <button type="submit" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            Yönetim Paneline Giriş Yap
          </button>
        </form>
      </div>
    </div>

    <!-- Authorized CMS Workspace -->
    <div v-else class="flex-grow flex flex-col md:flex-row">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between shrink-0">
        <div>
          <!-- Title & Brand -->
          <div class="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="/logo.png" alt="İhaleciBurada Logo" class="h-7 w-auto brightness-0 invert" />
              <span class="text-[8px] bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">ADMIN & CRM</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            
            <div class="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-4 mb-2 flex items-center gap-1">
              <Sparkles :size="10" /> İLETİŞİM & YAPAY ZEKA
            </div>

            <!-- WhatsApp & AI Tab -->
            <button 
              @click="activeTab = 'support_ai'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'support_ai' ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <MessageSquare :size="15" />
              WhatsApp & AI Asistan
            </button>

            <div class="text-[9px] font-black text-blue-400 uppercase tracking-widest px-4 pt-4 mb-2 flex items-center gap-1">
              <Users :size="10" /> MÜŞTERİ & E-POSTA CRM
            </div>

            <!-- CRM Leads Tab -->
            <button 
              @click="activeTab = 'crm_leads'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'crm_leads' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Users :size="15" />
              CRM Müşteri / Adaylar
            </button>

            <!-- Email Center & Templates Tab -->
            <button 
              @click="activeTab = 'email_center'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'email_center' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Mail :size="15" />
              E-Posta Şablonları & Gönderim
            </button>

            <!-- Newsletter Subscribers Tab -->
            <button 
              @click="activeTab = 'newsletter_subs'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'newsletter_subs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Inbox :size="15" />
              Mail Aboneleri & Bülten
            </button>

            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 pt-4 mb-2">SİTE CMS İÇERİK</div>

            <button 
              @click="activeTab = 'hero'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'hero' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Home :size="15" />
              Ana Sayfa (Hero & Bant)
            </button>

            <button 
              @click="activeTab = 'tender'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'tender' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Activity :size="15" />
              Canlı İhale Kartı
            </button>

            <button 
              @click="activeTab = 'plans'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'plans' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <CreditCard :size="15" />
              Abonelik & Fiyatlandırma
            </button>

            <button 
              @click="activeTab = 'contact'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'contact' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Phone :size="15" />
              İletişim & Destek
            </button>

            <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 pt-4 mb-2">B2B VERİTABANI İZLEME</div>

            <button 
              @click="activeTab = 'db_tenders'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_tenders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Folder :size="15" />
              İlanlarım (Tenders)
            </button>

            <button 
              @click="activeTab = 'db_received'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_received' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Download :size="15" />
              Gelen Teklifler
            </button>

            <button 
              @click="activeTab = 'db_submitted'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_submitted' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Upload :size="15" />
              Verilen Teklifler
            </button>

            <button 
              @click="activeTab = 'db_payments'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_payments' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <CreditCard :size="15" />
              Gelen Ödemeler
            </button>

          </nav>
        </div>

        <!-- Sidebar Footer Action -->
        <div class="p-4 border-t border-slate-800 space-y-2">
          <NuxtLink to="/" target="_blank" class="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition">
            <ExternalLink :size="13" />
            Canlı Siteyi Aç
          </NuxtLink>
          <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 px-4 py-2 text-xs font-bold transition cursor-pointer">
            Çıkış Yap
          </button>
        </div>
      </aside>

      <!-- Main Workspace Area -->
      <main class="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen text-left">
        
        <!-- Header Toolbar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
          <div>
            <h1 class="text-xl font-black text-white flex items-center gap-2">
              <span v-if="activeTab === 'support_ai'">💬 WhatsApp & Yapay Zeka Canlı Asistan Yönetimi</span>
              <span v-else-if="activeTab === 'crm_leads'">👥 CRM Müşteri & Aday Yönetim Merkezi</span>
              <span v-else-if="activeTab === 'email_center'">📧 E-Posta Şablonları & Bildirim Merkezi</span>
              <span v-else-if="activeTab === 'newsletter_subs'">📬 Bülten & E-Posta Aboneleri</span>
              <span v-else-if="activeTab === 'hero'">🏠 Ana Sayfa İçerik & Bant Yönetimi</span>
              <span v-else-if="activeTab === 'tender'">⚡ Canlı İhale Simülasyonu</span>
              <span v-else-if="activeTab === 'plans'">💳 Abonelik Paketleri & 6 Ay Deneme</span>
              <span v-else-if="activeTab === 'contact'">📞 İletişim & Destek Bilgileri</span>
              <span v-else>🗄️ B2B Veritabanı Kontrolü</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">İhaleciBurada platform altyapısını ve iletişim kanallarını canlı yönetin.</p>
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

        <!-- TAB CONTENT CONTAINERS -->
        <div class="space-y-6">

          <!-- ========================================================================= -->
          <!-- TAB 1: WHATSAPP & AI ASİSTAN YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'support_ai'" class="space-y-6">
            
            <!-- WhatsApp Settings Card -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <MessageSquare :size="16" />
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-white">WhatsApp Canlı Destek Butonu Ayarları</h3>
                    <p class="text-[11px] text-slate-400">Sağ alt köşede görünen WhatsApp butonunu ve hedef numarayı yapılandırın.</p>
                  </div>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.whatsappEnabled" class="rounded border-slate-700 bg-slate-950 text-emerald-500" />
                  <span>WhatsApp Butonunu Göster</span>
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">WHATSAPP DESTEK TELEFON NUMARASI (Ülke kodu ile)</label>
                  <input 
                    v-model="formState.supportSettings.whatsappNumber" 
                    type="text" 
                    placeholder="908503080000" 
                    class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono" 
                  />
                  <span class="text-[10px] text-slate-500 mt-1 block">Örn: 908503080000 veya 905437340860</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">VARSAYILAN BAŞLANGIÇ MESAJI</label>
                  <input 
                    v-model="formState.supportSettings.whatsappMessage" 
                    type="text" 
                    placeholder="Merhaba İhaleciBurada ekibi..." 
                    class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <!-- AI Assistant Settings Card -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Bot :size="18" />
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-white">Yapay Zeka (AI) Canlı Karşılama Asistanı</h3>
                    <p class="text-[11px] text-slate-400">Siteyi ziyaret eden kullanıcılara 7/24 rehberlik eden akıllı asistan ayarları.</p>
                  </div>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.aiEnabled" class="rounded border-slate-700 bg-slate-950 text-blue-500" />
                  <span>AI Asistanını Aktif Et</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">ASİSTAN BOT ADI</label>
                  <input 
                    v-model="formState.supportSettings.aiBotName" 
                    type="text" 
                    placeholder="İhaleciBurada AI Asistanı" 
                    class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" 
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">İLK KARŞILAMA VE HOŞ GELDİN MESAJI</label>
                  <textarea 
                    v-model="formState.supportSettings.aiGreeting" 
                    rows="3" 
                    class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed" 
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">AI SİSTEM TALİMATI / BİLGİ TABANI (PROMPT CONTEXT)</label>
                  <textarea 
                    v-model="formState.supportSettings.aiPromptContext" 
                    rows="3" 
                    class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none font-mono text-[11px]" 
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB 2: CRM MÜŞTERİ & ADAY YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6">
            
            <!-- CRM KPI Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div class="p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
                <span class="text-[10px] font-bold text-slate-400 uppercase">TOPLAM CRM KAYDI</span>
                <div class="text-2xl font-black text-white mt-1">{{ formState.crmSettings.leads.length }}</div>
              </div>
              <div class="p-4 rounded-2xl border border-emerald-900/60 bg-emerald-950/20">
                <span class="text-[10px] font-bold text-emerald-400 uppercase">6 AY DENEME AKTİF</span>
                <div class="text-2xl font-black text-emerald-400 mt-1">
                  {{ formState.crmSettings.leads.filter((l: any) => l.status.includes('Deneme')).length }}
                </div>
              </div>
              <div class="p-4 rounded-2xl border border-blue-900/60 bg-blue-950/20">
                <span class="text-[10px] font-bold text-blue-400 uppercase">TEKLİF VERENLER</span>
                <div class="text-2xl font-black text-blue-400 mt-1">
                  {{ formState.crmSettings.leads.filter((l: any) => l.status.includes('Teklif')).length }}
                </div>
              </div>
              <div class="p-4 rounded-2xl border border-amber-900/60 bg-amber-950/20">
                <span class="text-[10px] font-bold text-amber-400 uppercase">GÖRÜŞÜLEN FİRMALAR</span>
                <div class="text-2xl font-black text-amber-400 mt-1">
                  {{ formState.crmSettings.leads.filter((l: any) => l.status.includes('Görüş')).length }}
                </div>
              </div>
            </div>

            <!-- New Lead Add Form -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni Müşteri / Kurumsal Aday Ekle
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.companyName" type="text" placeholder="Şirket / Firma Unvanı *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <input v-model="newLeadForm.contactName" type="text" placeholder="Yetkili Adı Soyadı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <input v-model="newLeadForm.email" type="email" placeholder="E-Posta Adresi *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.phone" type="text" placeholder="Telefon (05XX...)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <select v-model="newLeadForm.status" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none">
                  <option value="6 Ay Deneme Aktif">6 Ay Deneme Aktif</option>
                  <option value="Teklif Veren">Teklif Veren</option>
                  <option value="İhale Açan">İhale Açan</option>
                  <option value="Görüşülüyor">Görüşülüyor</option>
                  <option value="Yeni Üye">Yeni Üye</option>
                </select>
                <input v-model="newLeadForm.notes" type="text" placeholder="Müşteri Notu / Talep Detayı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
              </div>

              <div class="flex justify-end">
                <button @click="addLead" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer">
                  <Plus :size="14" /> Müşteriyi Kaydet
                </button>
              </div>
            </div>

            <!-- Leads Table Filter Bar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="relative w-full sm:w-80">
                <Search :size="14" class="absolute left-3.5 top-3 text-slate-500" />
                <input v-model="crmSearchQuery" type="text" placeholder="Firma, yetkili veya mail ara..." class="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 pl-10 text-xs text-white focus:outline-none" />
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400 font-bold">Durum:</span>
                <select v-model="crmStatusFilter" class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="6 Ay Deneme Aktif">6 Ay Deneme Aktif</option>
                  <option value="Teklif Veren">Teklif Veren</option>
                  <option value="İhale Açan">İhale Açan</option>
                  <option value="Görüşülüyor">Görüşülüyor</option>
                </select>
              </div>
            </div>

            <!-- Leads Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-950/80 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">FİRMA & YETKİLİ</th>
                    <th class="p-3.5">İLETİŞİM</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5">NOTLAR</th>
                    <th class="p-3.5">TARİH</th>
                    <th class="p-3.5 text-right">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(lead, idx) in filteredLeads" :key="lead.id" class="hover:bg-slate-850/50 transition">
                    <td class="p-3.5 font-bold text-white">
                      <div>{{ lead.companyName }}</div>
                      <div class="text-[10px] text-slate-400 font-normal">{{ lead.contactName }}</div>
                    </td>
                    <td class="p-3.5 text-slate-300">
                      <div>{{ lead.email }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ lead.phone }}</div>
                    </td>
                    <td class="p-3.5">
                      <span 
                        class="px-2 py-0.5 rounded text-[10px] font-black"
                        :class="lead.status.includes('Deneme') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (lead.status.includes('Teklif') ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800')"
                      >
                        {{ lead.status }}
                      </span>
                    </td>
                    <td class="p-3.5 text-slate-400 text-[11px] max-w-xs truncate">{{ lead.notes }}</td>
                    <td class="p-3.5 text-slate-500 font-mono text-[10px]">{{ lead.createdAt }}</td>
                    <td class="p-3.5 text-right">
                      <button @click="removeLead(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded-lg transition cursor-pointer" title="Sil">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB 3: E-POSTA ŞABLONLARI & BİLDİRİM MERKEZİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'email_center'" class="space-y-6">
            
            <!-- Sender Configuration Bar -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Mail :size="16" class="text-blue-500" />
                <h3 class="text-sm font-black text-white">Sitenin Sahip Olduğu E-Posta & SMTP Gönderici Ayarları</h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">GÖNDERİCİ E-POSTA ADRESİ</label>
                  <input v-model="formState.emailSettings.senderEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">GÖNDERİCİ BAŞLIĞI (NAME)</label>
                  <input v-model="formState.emailSettings.senderName" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">YANIT E-POSTA (REPLY-TO)</label>
                  <input v-model="formState.emailSettings.replyToEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
              </div>
            </div>

            <!-- Template Selector & Editor Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              <!-- Templates List Sidebar -->
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

              <!-- Template Editor & Live Preview -->
              <div v-if="currentTemplate" class="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 class="text-sm font-black text-white">{{ currentTemplate.name }}</h4>
                  <span class="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded">{{ currentTemplate.id }}</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">E-POSTA KONUSU (SUBJECT)</label>
                  <input v-model="currentTemplate.subject" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">E-POSTA İÇERİK METNİ (BODY / HTML)</label>
                  <textarea v-model="currentTemplate.content" rows="10" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none font-sans leading-relaxed"></textarea>
                </div>

                <!-- Test Email Send Box -->
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div class="flex items-center gap-2 w-full sm:w-auto flex-1">
                    <Mail :size="14" class="text-slate-500 shrink-0" />
                    <input v-model="testEmailTarget" type="email" placeholder="Test alıcı e-posta..." class="w-full bg-transparent border-0 text-xs text-white focus:outline-none font-mono" />
                  </div>
                  <button @click="sendTestEmail" class="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                    <Send :size="13" />
                    <span>Örnek Gönderim Yap</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB 4: BÜLTEN & E-POSTA ABONELERİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'newsletter_subs'" class="space-y-6">
            
            <!-- Quick Add Subscriber Form -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni E-Posta / Bülten Abonesi Ekle
              </h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <input v-model="newSubscriberEmail" type="email" placeholder="Abone E-Posta Adresi *" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <input v-model="newSubscriberCompany" type="text" placeholder="Firma Adı (Opsiyonel)" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                <button @click="addSubscriber" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <Plus :size="14" /> Abone Ekle
                </button>
              </div>
            </div>

            <!-- Subscribers Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-950/80 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">E-POSTA</th>
                    <th class="p-3.5">FİRMA</th>
                    <th class="p-3.5">KAYNAK</th>
                    <th class="p-3.5">KAYIT TARİHİ</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(sub, idx) in formState.emailSettings.subscribers" :key="sub.id" class="hover:bg-slate-850/50 transition">
                    <td class="p-3.5 font-bold text-white font-mono">{{ sub.email }}</td>
                    <td class="p-3.5 text-slate-300">{{ sub.companyName }}</td>
                    <td class="p-3.5 text-slate-400">{{ sub.source }}</td>
                    <td class="p-3.5 text-slate-500 font-mono text-[10px]">{{ sub.subscribedAt }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ sub.status }}</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button @click="removeSubscriber(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded-lg transition cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB 5: HERO / ANASAYFA -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'hero'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ANA SAYFA BAŞLIK VE AÇIKLAMA METİNLERİ</h3>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">ÜST KÜÇÜK SLOGAN (TAGLINE)</label>
                <input v-model="formState.hero.tagline" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 1. SATIR</label>
                  <input v-model="formState.hero.titleLine1" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 2. SATIR</label>
                  <input v-model="formState.hero.titleLine2" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">AÇIKLAMA METNİ</label>
                <textarea v-model="formState.hero.description" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none leading-relaxed"></textarea>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 6: CANLI İHALE KARTI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'tender'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">CANLI EKSİLTME DEMO KARTI AYARLARI</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">İHALE BAŞLIĞI</label>
                  <input v-model="formState.liveTender.title" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">AÇILIŞ FİYATI (₺)</label>
                  <input v-model="formState.liveTender.openingPrice" type="number" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none font-mono" />
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 7: ABONELİK PLANLARI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">B2B ABONELİK FİYATLARI</h3>
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
          <!-- TAB 8: İLETİŞİM BİLGİLERİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'contact'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">İLETİŞİM BİLGİLERİ</h3>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">E-POSTA</label>
                <input v-model="formState.contact.email" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">ADRES</label>
                <input v-model="formState.contact.address" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 9: VERİTABANI İLANLARIM -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_tenders'" class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-400">YAYINDAKİ İHALELER LİSTESİ</label>
              <button @click="addDashboardTender" class="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition">
                <Plus :size="14" /> Yeni İhale
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(tender, index) in formState.dashboard.tenders" :key="tender.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-mono text-blue-400 font-bold bg-blue-950/30 px-2 py-0.5 rounded">{{ tender.id }}</span>
                  <button @click="removeDashboardTender(index)" class="p-2 bg-red-950/20 hover:bg-red-950 text-red-400 rounded-lg transition">
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
          <!-- TAB 10: GELEN TEKLİFLER -->
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
                  <button @click="removeReceivedBid(tIdx, bIdx)" class="p-1.5 bg-red-950/20 text-red-400 rounded">
                    <Trash2 :size="12" />
                  </button>
                </div>
                <button @click="addReceivedBid(tIdx)" class="text-xs text-blue-400 font-bold flex items-center gap-1">
                  <Plus :size="12" /> Teklif Ekle
                </button>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 11: VERİLEN TEKLİFLER -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_submitted'" class="space-y-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-slate-400">YAPTIĞIM TEKLİFLER</label>
              <button @click="addSubmittedBid" class="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition">
                <Plus :size="14" /> Teklif Ekle
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="(bid, index) in formState.dashboard.submittedBids" :key="bid.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div class="flex justify-between">
                  <span class="text-xs font-mono text-blue-400 font-bold">{{ bid.id }} - {{ bid.ilanBaslik }}</span>
                  <button @click="removeSubmittedBid(index)" class="text-red-400">
                    <Trash2 :size="13" />
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input v-model="bid.teklifFiyatim" type="text" class="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white" />
                  <input v-model="bid.aliciFirma" type="text" class="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white" />
                  <input v-model="bid.durum" type="text" class="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 12: GELEN ÖDEMELER -->
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
            * Tüm değişiklikler anında yerel depolama ve sisteme kaydedilir.
          </div>
          <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            <Save :size="15" />
            Değişiklikleri Kaydet
          </button>
        </div>

      </main>
    </div>

    <!-- Global Toast Notification -->
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
