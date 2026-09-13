<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Building2, 
  Users, 
  CreditCard, 
  Plus, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Tag, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  X,
  FileText
} from 'lucide-vue-next'
import { useAgencyManagement, type RealEstateAgent } from '~/composables/useAgencyManagement'
import { 
  downloadAgentExcelTemplate, 
  downloadListingExcelTemplate, 
  parseAgentCsv, 
  parseListingCsv 
} from '~/utils/excelTemplates'

definePageMeta({
  layout: 'public'
})

useHead({
  title: 'Emlak Ofisi & Danışman Yönetim Merkezi | İhaleciBurada'
})

const {
  currentAgency,
  agentsList,
  creditLedger,
  listingPriceNet,
  vatRate,
  listingPriceGross,
  addAgent,
  updateAgent,
  deleteAgent,
  addAgentsBulk,
  consumeListingCredit,
  topupCredits
} = useAgencyManagement()

// Active Tab
const activeTab = ref<'agents' | 'listings' | 'ledger'>('agents')
const searchQuery = ref('')

// Modals
const showAddAgentModal = ref(false)
const showBulkAgentModal = ref(false)
const showBulkListingModal = ref(false)
const showTopupModal = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

function triggerToast(msg: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

// Single Agent Form
const newAgentForm = ref({
  name: '',
  surname: '',
  email: '',
  phone: '',
  title: 'Gayrimenkul Danışmanı',
  mykCertificateNo: '',
  monthlyCreditQuota: undefined as number | undefined
})

function handleAddSingleAgent() {
  if (!newAgentForm.value.name || !newAgentForm.value.email) {
    triggerToast('Lütfen Danışman Adı ve E-posta adresini giriniz.', 'error')
    return
  }

  addAgent({
    name: newAgentForm.value.name,
    surname: newAgentForm.value.surname,
    email: newAgentForm.value.email,
    phone: newAgentForm.value.phone || '05XX XXX XX XX',
    title: newAgentForm.value.title || 'Gayrimenkul Danışmanı',
    mykCertificateNo: newAgentForm.value.mykCertificateNo || `YB0217/17UY0333-5/00/${Math.floor(1000 + Math.random() * 9000)}`,
    monthlyCreditQuota: newAgentForm.value.monthlyCreditQuota,
    role: 'agent',
    isActive: true
  })

  triggerToast(`${newAgentForm.value.name} ${newAgentForm.value.surname} başarıyla danışman olarak eklendi.`, 'success')
  showAddAgentModal.value = false
  newAgentForm.value = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    title: 'Gayrimenkul Danışmanı',
    mykCertificateNo: '',
    monthlyCreditQuota: undefined
  }
}

// Bulk Agent Upload State
const bulkAgentCsvText = ref('')
const bulkAgentFile = ref<File | null>(null)
const bulkAgentParseResult = ref<{ success: boolean; agents: any[]; errors: string[] } | null>(null)

function handleAgentFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    bulkAgentFile.value = file
    const reader = new FileReader()
    reader.onload = (event) => {
      bulkAgentCsvText.value = (event.target?.result as string) || ''
      previewBulkAgents()
    }
    reader.readAsText(file, 'UTF-8')
  }
}

function previewBulkAgents() {
  if (!bulkAgentCsvText.value.trim()) return
  bulkAgentParseResult.value = parseAgentCsv(bulkAgentCsvText.value)
}

function commitBulkAgents() {
  if (!bulkAgentParseResult.value || !bulkAgentParseResult.value.agents.length) return

  const added = addAgentsBulk(bulkAgentParseResult.value.agents)
  triggerToast(`${added.length} adet danışman ofis bünyesine başarıyla aktarıldı!`, 'success')
  showBulkAgentModal.value = false
  bulkAgentCsvText.value = ''
  bulkAgentFile.value = null
  bulkAgentParseResult.value = null
}

// Bulk Listing Upload State
const bulkListingCsvText = ref('')
const bulkListingFile = ref<File | null>(null)
const bulkListingParseResult = ref<{ success: boolean; listings: any[]; errors: string[] } | null>(null)

function handleListingFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    bulkListingFile.value = file
    const reader = new FileReader()
    reader.onload = (event) => {
      bulkListingCsvText.value = (event.target?.result as string) || ''
      previewBulkListings()
    }
    reader.readAsText(file, 'UTF-8')
  }
}

function previewBulkListings() {
  if (!bulkListingCsvText.value.trim()) return
  bulkListingParseResult.value = parseListingCsv(bulkListingCsvText.value)
}

function commitBulkListings() {
  if (!bulkListingParseResult.value || !bulkListingParseResult.value.listings.length) return
  const count = bulkListingParseResult.value.listings.length

  if (currentAgency.value.creditBalance < count) {
    triggerToast(`Yetersiz Bakiye! ${count} adet ilan için ${count} kontör gereklidir. Mevcut bakiye: ${currentAgency.value.creditBalance}`, 'error')
    return
  }

  // Deduct credits and save mock listings
  bulkListingParseResult.value.listings.forEach(l => {
    consumeListingCredit('agent-bulk', l.id, l.baslik)
  })

  triggerToast(`${count} adet ilan başarıyla yayına alındı ve cüzdandan ${count} kontör düşüldü!`, 'success')
  showBulkListingModal.value = false
  bulkListingCsvText.value = ''
  bulkListingFile.value = null
  bulkListingParseResult.value = null
}

// Topup State
const selectedPack = ref(50)
const topupPacks = [
  { credits: 10, label: '10 İlan Kontörü', bonus: 0, tag: 'Başlangıç' },
  { credits: 50, label: '50 İlan Kontörü', bonus: 2, tag: 'Popüler & Avantajlı', popular: true },
  { credits: 100, label: '100 İlan Kontörü', bonus: 5, tag: 'Büyük Ofis' },
  { credits: 250, label: '250 İlan Kontörü', bonus: 15, tag: 'Broker Network' }
]

function handleTopup() {
  const pack = topupPacks.find(p => p.credits === selectedPack.value) || topupPacks[1]
  const totalCredits = pack.credits + pack.bonus
  topupCredits(totalCredits, `${pack.label} Satın Alma (${pack.bonus ? '+' + pack.bonus + ' Hediye' : ''})`)
  triggerToast(`🎉 Tebrikler! ${totalCredits} adet kontör ofis cüzdanınıza tanımlandı.`, 'success')
  showTopupModal.value = false
}

// Filtered agents
const filteredAgents = computed(() => {
  if (!searchQuery.value.trim()) return agentsList.value
  const q = searchQuery.value.toLowerCase()
  return agentsList.value.filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.surname.toLowerCase().includes(q) || 
    a.email.toLowerCase().includes(q) || 
    a.phone.includes(q) ||
    a.title.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Toast Notification -->
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="toastMessage" :class="toastType === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'" class="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-white text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 v-if="toastType === 'success'" class="w-5 h-5 text-white" />
          <AlertCircle v-else class="w-5 h-5 text-white" />
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Office Profile Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start gap-4 sm:gap-5">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">{{ currentAgency.name }}</h1>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck class="w-3.5 h-3.5" />
                  TTB Onaylı: {{ currentAgency.ttbLicenseNumber }}
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Ana Şube / Broker
                </span>
              </div>
              <p class="text-sm text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>{{ currentAgency.tradeTitle }}</span>
                <span>•</span>
                <span>VKN: {{ currentAgency.taxNumber }} ({{ currentAgency.taxOffice }})</span>
                <span>•</span>
                <span>{{ currentAgency.district }}, {{ currentAgency.city }}</span>
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 shrink-0">
            <button 
              @click="showTopupModal = true" 
              class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition transform active:scale-95"
            >
              <CreditCard class="w-4 h-4" />
              Kontör Yükle
            </button>
            <NuxtLink 
              to="/panel/ihale-olustur" 
              class="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-900/30 transition transform active:scale-95"
            >
              <Plus class="w-4 h-4" />
              İlan / İhale Aç
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Financial & Metric Cards (30 TL + KDV Focus) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <!-- 1. Kalan Kontör Cüzdanı -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kalan İlan Kontörü</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Tag class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">{{ currentAgency.creditBalance }}</span>
            <span class="text-xs text-slate-400 font-semibold">Adet İlan Hakkı</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">Birim Fiyat:</span>
            <span class="font-mono font-bold text-emerald-400">{{ listingPriceNet }} TL + KDV ({{ listingPriceGross }} TL)</span>
          </div>
        </div>

        <!-- 2. Bağlı Danışman Sayısı -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/50 transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktif Danışmanlar</span>
            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">{{ agentsList.length }}</span>
            <span class="text-xs text-slate-400 font-semibold">Kayıtlı Uzman</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">Alt Hesap Limiti:</span>
            <span class="font-bold text-indigo-300">Sınırsız (Kurumsal)</span>
          </div>
        </div>

        <!-- 3. Yayındaki Toplam İlanlar -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Yayındaki Portföy</span>
            <div class="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Building2 class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">{{ currentAgency.activeListingsCount }}</span>
            <span class="text-xs text-slate-400 font-semibold">Aktif İlan / İhale</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">Danışman Künyeli:</span>
            <span class="font-bold text-cyan-400">%100 Doğrudan GSM</span>
          </div>
        </div>

        <!-- 4. Bu Ayki Tasarruf Oranı -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Sarı Siteye Göre Tasarruf</span>
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-emerald-400 font-mono">%92</span>
            <span class="text-xs text-slate-400 font-semibold">Maliyet Avantajı</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">Taahhütsüz Model:</span>
            <span class="font-bold text-amber-300">Açtığın Kadar Öde</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Tabs -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <button 
            @click="activeTab = 'agents'"
            :class="activeTab === 'agents' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900 text-slate-400 hover:text-white'"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition"
          >
            <Users class="w-4 h-4" />
            Danışmanlar ({{ agentsList.length }})
          </button>
          
          <button 
            @click="activeTab = 'listings'"
            :class="activeTab === 'listings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900 text-slate-400 hover:text-white'"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition"
          >
            <FileSpreadsheet class="w-4 h-4" />
            Toplu İlan Yükleme
          </button>

          <button 
            @click="activeTab = 'ledger'"
            :class="activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900 text-slate-400 hover:text-white'"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition"
          >
            <Clock class="w-4 h-4" />
            Kontör Harcama Defteri
          </button>
        </div>

        <!-- Action Tools for Active Tab -->
        <div v-if="activeTab === 'agents'" class="flex items-center gap-2">
          <button 
            @click="downloadAgentExcelTemplate" 
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
            title="Excel Şablonunu İndir"
          >
            <Download class="w-3.5 h-3.5 text-indigo-400" />
            Danışman Şablonu (.CSV)
          </button>
          <button 
            @click="showBulkAgentModal = true" 
            class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload class="w-3.5 h-3.5 text-emerald-400" />
            Toplu Excel Yükle
          </button>
          <button 
            @click="showAddAgentModal = true" 
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Plus class="w-3.5 h-3.5" />
            Danışman Ekle
          </button>
        </div>
      </div>

      <!-- TAB 1: DANISMANLAR MASASI -->
      <div v-if="activeTab === 'agents'" class="space-y-6">
        <!-- Search bar -->
        <div class="relative max-w-md">
          <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Danışman adı, e-posta, GSM veya uzmanlık alanı ara..." 
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Agents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="agent in filteredAgents" 
            :key="agent.id"
            class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <img 
                    :src="agent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'" 
                    :alt="agent.name" 
                    class="w-13 h-13 rounded-2xl object-cover border border-slate-700 shadow"
                  />
                  <div>
                    <h3 class="text-base font-bold text-white">{{ agent.name }} {{ agent.surname }}</h3>
                    <p class="text-xs text-indigo-400 font-semibold">{{ agent.title }}</p>
                    <span class="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-slate-400">
                      <Award class="w-3 h-3 text-amber-400" />
                      MYK: {{ agent.mykCertificateNo }}
                    </span>
                  </div>
                </div>
                
                <span 
                  :class="agent.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'" 
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                >
                  {{ agent.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </div>

              <!-- Contact & Info -->
              <div class="mt-4 space-y-2 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <Phone class="w-3.5 h-3.5 text-slate-500" />
                  <span class="font-mono">{{ agent.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Mail class="w-3.5 h-3.5 text-slate-500" />
                  <span class="truncate">{{ agent.email }}</span>
                </div>
              </div>
            </div>

            <!-- Agent Performance & Actions -->
            <div class="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span class="text-[11px] text-slate-500 block">Bu Ayki İlanları</span>
                <span class="font-bold text-white font-mono">{{ agent.usedCreditsThisMonth || 0 }} İlan ({{ (agent.usedCreditsThisMonth || 0) * 36 }} ₺)</span>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="deleteAgent(agent.id); triggerToast('Danışman kaydı silindi.', 'error')" 
                  class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition" 
                  title="Danışmanı Sil"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: TOPLU ILAN YUKLEME MASASI -->
      <div v-if="activeTab === 'listings'" class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet class="w-6 h-6 text-emerald-400" />
                Toplu Emlak İlanı Yükleme (Excel / CSV)
              </h2>
              <p class="text-xs sm:text-sm text-slate-400 mt-1">
                Sahibinden.com standartlarındaki dinamik konut ve arsa ilanlarınızı tek bir Excel dosyası ile sisteme aktarın.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                @click="downloadListingExcelTemplate" 
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 transition"
              >
                <Download class="w-4 h-4 text-emerald-400" />
                İlan Excel Şablonunu İndir (.CSV)
              </button>
            </div>
          </div>

          <!-- Upload Dropzone -->
          <div class="mt-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-8 text-center transition bg-slate-950/50">
            <input 
              type="file" 
              accept=".csv, .txt, .xlsx" 
              @change="handleListingFileUpload" 
              class="hidden" 
              id="listingFileInput" 
            />
            <label for="listingFileInput" class="cursor-pointer flex flex-col items-center justify-center">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Upload class="w-7 h-7" />
              </div>
              <span class="text-sm font-bold text-white">Excel veya CSV Dosyanızı Buraya Sürükleyin</span>
              <span class="text-xs text-slate-400 mt-1">veya bilgisayarınızdan seçmek için tıklayın</span>
              <span class="text-[11px] text-slate-500 mt-2">Desteklenen: .csv (Noktalı virgülle ayrılmış UTF-8)</span>
            </label>
          </div>

          <!-- Parse Preview -->
          <div v-if="bulkListingParseResult" class="mt-6 space-y-4">
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-emerald-400">{{ bulkListingParseResult.listings.length }} Geçerli İlan Tespit Edildi</span>
                <span v-if="bulkListingParseResult.errors.length" class="text-xs font-bold text-rose-400">({{ bulkListingParseResult.errors.length }} Hatalı Satır)</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-300">Gerekli Kontör: <strong class="text-emerald-400 font-mono">{{ bulkListingParseResult.listings.length }}</strong></span>
                <button 
                  @click="commitBulkListings" 
                  class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow transition"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  İlanları Yayına Al ({{ bulkListingParseResult.listings.length * 36 }} TL KDV Dahil)
                </button>
              </div>
            </div>

            <!-- Error list if any -->
            <div v-if="bulkListingParseResult.errors.length" class="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 space-y-1">
              <div class="font-bold mb-1">Düzeltilmesi Gereken Satırlar:</div>
              <div v-for="(err, idx) in bulkListingParseResult.errors" :key="idx">{{ err }}</div>
            </div>

            <!-- Preview Table -->
            <div class="overflow-x-auto border border-slate-800 rounded-xl">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th class="p-3">Başlık</th>
                    <th class="p-3">Kategori</th>
                    <th class="p-3">Fiyat</th>
                    <th class="p-3">Konum</th>
                    <th class="p-3">Atanan Danışman</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 bg-slate-900/50">
                  <tr v-for="item in bulkListingParseResult.listings" :key="item.id">
                    <td class="p-3 font-semibold text-white">{{ item.baslik }}</td>
                    <td class="p-3 font-mono text-indigo-400">{{ item.kategori }}</td>
                    <td class="p-3 font-mono font-bold text-emerald-400">{{ Number(item.fiyatTl).toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-3">{{ item.ilce }} / {{ item.il }}</td>
                    <td class="p-3 font-mono text-slate-400">{{ item.assignedAgentEmail || 'Ofis Yöneticisi' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: KONTOR HARCAMA DEFTERI (LEDGER) -->
      <div v-if="activeTab === 'ledger'" class="space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div class="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Clock class="w-6 h-6 text-indigo-400" />
                Kontör Cüzdanı & İşlem Günlüğü (Audit Ledger)
              </h2>
              <p class="text-xs sm:text-sm text-slate-400 mt-1">
                Ofis cüzdanınızdan düşülen tüm ilan harcamaları ve yüklemeler şeffaf olarak zaman damgalı tutulmaktadır.
              </p>
            </div>
            <button 
              @click="showTopupModal = true" 
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <CreditCard class="w-4 h-4" /> Kontör Satın Al
            </button>
          </div>

          <!-- Transactions Table -->
          <div class="mt-6 overflow-x-auto border border-slate-800 rounded-2xl">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="p-3.5">İşlem Tarihi</th>
                  <th class="p-3.5">Tür</th>
                  <th class="p-3.5">Danışman / Açıklama</th>
                  <th class="p-3.5 text-right">Kontör Değişimi</th>
                  <th class="p-3.5 text-right">Tutar (KDV Dahil)</th>
                  <th class="p-3.5 text-right">Kalan Bakiye</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 bg-slate-900/60">
                <tr v-for="tx in creditLedger" :key="tx.id" class="hover:bg-slate-800/40 transition">
                  <td class="p-3.5 font-mono text-slate-400">{{ tx.createdAt }}</td>
                  <td class="p-3.5">
                    <span 
                      :class="tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'" 
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                    >
                      {{ tx.type === 'TOPUP' ? 'YÜKLEME' : 'İLAN AÇIMI' }}
                    </span>
                  </td>
                  <td class="p-3.5">
                    <span class="font-semibold text-white block">{{ tx.description }}</span>
                    <span v-if="tx.agentName" class="text-[11px] text-slate-400">Danışman: {{ tx.agentName }}</span>
                  </td>
                  <td class="p-3.5 text-right font-mono font-bold" :class="tx.creditsChange > 0 ? 'text-emerald-400' : 'text-slate-200'">
                    {{ tx.creditsChange > 0 ? '+' + tx.creditsChange : tx.creditsChange }}
                  </td>
                  <td class="p-3.5 text-right font-mono font-bold text-white">
                    {{ tx.totalChargedTry }} ₺
                  </td>
                  <td class="p-3.5 text-right font-mono font-bold text-indigo-400">
                    {{ tx.balanceAfter }} Kontör
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL 1: TEKIL DANISMAN EKLE -->
      <div v-if="showAddAgentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <Users class="w-5 h-5 text-indigo-400" />
              Yeni Danışman Alt Hesabı Tanımla
            </h3>
            <button @click="showAddAgentModal = false" class="text-slate-400 hover:text-white p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-400 font-semibold mb-1">Danışman Adı *</label>
                <input v-model="newAgentForm.name" type="text" placeholder="Örn: Ahmet" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-slate-400 font-semibold mb-1">Danışman Soyadı *</label>
                <input v-model="newAgentForm.surname" type="text" placeholder="Örn: Yılmaz" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-slate-400 font-semibold mb-1">Giriş E-postası *</label>
              <input v-model="newAgentForm.email" type="email" placeholder="ahmet.yilmaz@remax-cadde.com" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-slate-400 font-semibold mb-1">GSM Telefonu (İlanlarda Görünecek) *</label>
              <input v-model="newAgentForm.phone" type="text" placeholder="0532 111 22 33" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-slate-400 font-semibold mb-1">Unvan</label>
              <input v-model="newAgentForm.title" type="text" placeholder="Örn: Lüks Konut & Villa Danışmanı" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
            </div>

            <div>
              <label class="block text-slate-400 font-semibold mb-1">MYK Seviye 5 Belge No</label>
              <input v-model="newAgentForm.mykCertificateNo" type="text" placeholder="YB0217/17UY0333-5/00/1234" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button @click="showAddAgentModal = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs">İptal</button>
            <button @click="handleAddSingleAgent" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow">Danışmanı Kaydet</button>
          </div>
        </div>
      </div>

      <!-- MODAL 2: TOPLU DANISMAN YUKLE -->
      <div v-if="showBulkAgentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <Upload class="w-5 h-5 text-emerald-400" />
              Excel / CSV ile Toplu Danışman Ekle
            </h3>
            <button @click="showBulkAgentModal = false" class="text-slate-400 hover:text-white p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-slate-300">Önceden hazırlanmış örnek CSV şablonunu indirin:</span>
              <button @click="downloadAgentExcelTemplate" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold flex items-center gap-1.5">
                <Download class="w-3.5 h-3.5" /> Şablonu İndir
              </button>
            </div>

            <!-- Upload input -->
            <div class="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-950/60">
              <input type="file" accept=".csv, .txt" @change="handleAgentFileUpload" class="hidden" id="agentFileInput" />
              <label for="agentFileInput" class="cursor-pointer flex flex-col items-center">
                <FileSpreadsheet class="w-8 h-8 text-indigo-400 mb-2" />
                <span class="font-bold text-white">CSV Dosyasını Seçin</span>
                <span class="text-[11px] text-slate-400 mt-1">veya doğrudan aşağıya CSV içeriğini yapıştırın</span>
              </label>
            </div>

            <div>
              <label class="block text-slate-400 font-semibold mb-1">CSV Metin Alanı</label>
              <textarea 
                v-model="bulkAgentCsvText" 
                @input="previewBulkAgents"
                rows="4" 
                placeholder="ad;soyad;eposta;telefon;unvan;myk_belge_no&#10;Ahmet;Yılmaz;ahmet@ornek.com;05321112233;Danışman;YB0217..."
                class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-[11px] text-white focus:border-indigo-500 outline-none"
              ></textarea>
            </div>

            <div v-if="bulkAgentParseResult" class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span class="font-bold text-emerald-400">{{ bulkAgentParseResult.agents.length }} danışman ayrıştırıldı.</span>
              <span v-if="bulkAgentParseResult.errors.length" class="text-rose-400 font-bold">{{ bulkAgentParseResult.errors.length }} hata var</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button @click="showBulkAgentModal = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs">Kapat</button>
            <button 
              @click="commitBulkAgents" 
              :disabled="!bulkAgentParseResult || !bulkAgentParseResult.agents.length" 
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow"
            >
              Danışmanları İçe Aktar
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL 3: KONTOR SATIN ALMA -->
      <div v-if="showTopupModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard class="w-5 h-5 text-emerald-400" />
                İlan Kontörü Satın Alma
              </h3>
              <p class="text-xs text-slate-400 mt-1">İlan başı birim fiyat: {{ listingPriceNet }} TL + %{{ vatRate }} KDV = <strong>{{ listingPriceGross }} TL</strong></p>
            </div>
            <button @click="showTopupModal = false" class="text-slate-400 hover:text-white p-1">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div 
              v-for="pack in topupPacks" 
              :key="pack.credits"
              @click="selectedPack = pack.credits"
              :class="selectedPack === pack.credits ? 'border-emerald-500 bg-emerald-500/10 shadow-lg' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'"
              class="p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 inline-block mb-2">{{ pack.tag }}</span>
                <div class="text-base font-black text-white font-mono">{{ pack.credits }} Kontör</div>
                <div v-if="pack.bonus" class="text-[11px] font-bold text-emerald-400 mt-0.5">+{{ pack.bonus }} Hediye İlan</div>
              </div>
              <div class="mt-4 pt-2 border-t border-slate-800/80 font-mono font-bold text-white">
                {{ (pack.credits * listingPriceGross).toFixed(2) }} ₺
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div class="flex justify-between text-slate-400">
              <span>Seçilen Paket:</span>
              <span class="text-white font-bold">{{ selectedPack }} İlan Kontörü</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>KDV Matrahı:</span>
              <span class="text-white font-mono">{{ (selectedPack * listingPriceNet).toFixed(2) }} ₺</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>%{{ vatRate }} KDV:</span>
              <span class="text-white font-mono">{{ (selectedPack * listingPriceNet * (vatRate / 100)).toFixed(2) }} ₺</span>
            </div>
            <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Toplam Ödeme:</span>
              <span class="text-emerald-400 font-mono">{{ (selectedPack * listingPriceGross).toFixed(2) }} ₺</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button @click="showTopupModal = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs">İptal</button>
            <button @click="handleTopup" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow">
              Ödemeyi Tamamla ve Kontör Yükle
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

