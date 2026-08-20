<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Database,
  Cpu,
  Network,
  FileSpreadsheet,
  RefreshCw,
  Key,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Lock,
  Plus
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const activeTab = ref<'sap' | 'logo' | 'dynamics' | 'api'>('sap')

onMounted(() => {
  if (route.query.tab && ['sap', 'logo', 'dynamics', 'api'].includes(route.query.tab as string)) {
    activeTab.value = route.query.tab as 'sap' | 'logo' | 'dynamics' | 'api'
  }
})

/* =========================================================
   SAP ENTEGRASYONU SIMULASYON STATE'LERİ
========================================================= */
const sapPrNumber = ref('PR-2026-9018')
const sapStatus = ref<'idle' | 'syncing' | 'success' | 'error'>('idle')
const sapResult = ref('')

function runSapSync() {
  if (!sapPrNumber.value) return
  sapStatus.value = 'syncing'
  sapResult.value = ''
  
  setTimeout(() => {
    sapStatus.value = 'success'
    sapResult.value = `SAP Sisteminden ${sapPrNumber.value} nolu satın alma talebi (Purchase Requisition) başarıyla çekildi. Talebe bağlı 5 kalem malzeme ile '500 Paket A4 Kağıt Alımı' ihalesi otomatik olarak oluşturuldu.`
  }, 1800)
}

/* =========================================================
   LOGO & NETSIS ENTEGRASYONU SIMULASYON STATE'LERİ
========================================================= */
const logoHost = ref('192.168.1.100')
const logoDb = ref('LKSDB_2026')
const logoStatus = ref<'idle' | 'syncing' | 'success'>('idle')
const syncedMaterialsCount = ref(0)
const syncedCarisCount = ref(0)

function runLogoSync() {
  logoStatus.value = 'syncing'
  syncedMaterialsCount.value = 0
  syncedCarisCount.value = 0
  
  let mProgress = 0
  let cProgress = 0
  
  const interval = setInterval(() => {
    mProgress += 25
    cProgress += 8
    
    syncedMaterialsCount.value = Math.min(125, mProgress)
    syncedCarisCount.value = Math.min(42, cProgress)
    
    if (mProgress >= 125 && cProgress >= 42) {
      clearInterval(interval)
      logoStatus.value = 'success'
    }
  }, 300)
}

/* =========================================================
   MICROSOFT DYNAMICS ENTEGRASYONU SIMULASYON STATE'LERİ
========================================================= */
const dynClientId = ref('3f90b1c0-429f-43b2-9a00-1d8d9c0e4b56')
const dynAutoSync = ref(true)
const dynStatus = ref<'connected' | 'disconnected'>('connected')

/* =========================================================
   REST API & EXCEL ENTEGRASYONU STATE'LERİ
========================================================= */
const apiKey = ref('gla_live_83b27acdf90e3810a9a16f2c4')
const keyCopied = ref(false)
const excelParseStatus = ref<'idle' | 'parsed' | 'imported'>('idle')
const selectedExcelFile = ref('')
const parsedItems = ref<any[]>([])

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  keyCopied.value = true
  setTimeout(() => {
    keyCopied.value = false
  }, 2000)
}

function rotateApiKey() {
  const chars = '0123456789abcdef'
  let newKey = 'gla_live_'
  for (let i = 0; i < 16; i++) {
    newKey += chars[Math.floor(Math.random() * chars.length)]
  }
  apiKey.value = newKey
}

function handleExcelUpload() {
  excelParseStatus.value = 'parsed'
  selectedExcelFile.value = 'malzeme_talep_listesi.xlsx'
  parsedItems.value = [
    { name: 'Kraft Dopel Ambalaj Kutusu (25x20x10cm)', qty: '50.000', unit: 'Adet' },
    { name: 'Baskılı Selefonlu E-Ticaret Kutusu (15x15x8cm)', qty: '50.000', unit: 'Adet' },
    { name: 'Koli Bandı (Şeffaf, 45mm x 100m)', qty: '1.200', unit: 'Rulo' }
  ]
}

function importExcelItems() {
  excelParseStatus.value = 'imported'
  setTimeout(() => {
    // Redirect simulation or success toast
    excelParseStatus.value = 'idle'
    selectedExcelFile.value = ''
    parsedItems.value = []
    alert("Excel'den yüklenen malzemeler ile fason üretim ihalesi başarıyla oluşturuldu!")
  }, 1000)
}
</script>

<template>
  <div class="space-y-6 text-left">
    <!-- Header -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">ERP & Sistem Entegrasyonları</h1>
      <p class="text-xs text-slate-500 font-medium">Kurumsal kaynak planlama ve harici veri kaynaklarınızı İhaleciBurada B2B portalına bağlayın.</p>
    </div>

    <!-- Main Card Tabs Layout -->
    <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <!-- Sidebar Tab Toggles -->
      <aside class="border-r border-slate-200 bg-slate-50/50 p-4 flex flex-col gap-2">
        <button
          @click="activeTab = 'sap'"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold transition-all text-left"
          :class="activeTab === 'sap' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        >
          <Cpu :size="16" />
          <span>SAP Entegrasyonu</span>
        </button>

        <button
          @click="activeTab = 'logo'"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold transition-all text-left"
          :class="activeTab === 'logo' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        >
          <Database :size="16" />
          <span>Logo & Netsis Sync</span>
        </button>

        <button
          @click="activeTab = 'dynamics'"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold transition-all text-left"
          :class="activeTab === 'dynamics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        >
          <Network :size="16" />
          <span>Dynamics 365</span>
        </button>

        <button
          @click="activeTab = 'api'"
          class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold transition-all text-left"
          :class="activeTab === 'api' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        >
          <FileSpreadsheet :size="16" />
          <span>REST API & Excel</span>
        </button>
      </aside>

      <!-- Main Panel View -->
      <div class="p-8">
        <!-- 1. SAP ENTEGRASYONU -->
        <div v-if="activeTab === 'sap'" class="space-y-6">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-base font-black text-slate-800">SAP RFQ & Purchase Requisition Entegrasyonu</h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                SAP sisteminizdeki onaylanmış PR taleplerini API aracılığıyla çekerek dakikalar içinde canlı tersine ihale arenasına açın.
              </p>
            </div>
            <span class="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-black text-blue-700 uppercase shrink-0">ERP CONNECTED</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
            <!-- PR Trigger settings -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Talebi İçe Aktar</h4>
              <div>
                <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">SAP PR Belge Numarası</label>
                <input v-model="sapPrNumber" type="text" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>
              <button @click="runSapSync" :disabled="sapStatus === 'syncing'" class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/10">
                <RefreshCw :size="14" class="animate-spin" v-if="sapStatus === 'syncing'" />
                <Play :size="14" v-else />
                <span>SAP Verilerini Senkronize Et</span>
              </button>
            </div>

            <!-- Mapping visual -->
            <div class="border border-slate-200 rounded-2xl bg-white p-5 flex flex-col justify-center gap-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">SAP Alan Eşleştirmesi</span>
              <div class="space-y-2 text-[11px] font-medium text-slate-600">
                <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border">
                  <span>SAP EBAN-BANFN (PR No)</span>
                  <span class="text-blue-600 font-bold">→ İhale No</span>
                </div>
                <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border">
                  <span>SAP EBAN-TXZ01 (Kısa Metin)</span>
                  <span class="text-blue-600 font-bold">→ Malzeme Kalemi</span>
                </div>
                <div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border">
                  <span>SAP EBAN-MENGE (Miktar)</span>
                  <span class="text-blue-600 font-bold">→ Talep Miktarı</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Simulated outcome -->
          <transition name="fade">
            <div v-if="sapStatus === 'success'" class="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-emerald-800 text-xs flex gap-3">
              <CheckCircle2 :size="20" class="text-emerald-600 shrink-0" />
              <div>
                <h4 class="font-black">Senkronizasyon Başarılı</h4>
                <p class="mt-1 leading-relaxed font-medium text-emerald-700">{{ sapResult }}</p>
              </div>
            </div>
          </transition>
        </div>

        <!-- 2. LOGO & NETSIS SYNC -->
        <div v-if="activeTab === 'logo'" class="space-y-6">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-base font-black text-slate-800">Logo Tiger & Netsis Veritabanı Canlı Eşitleme</h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                Logo veritabanındaki Malzeme Kartları (ITEMS) ve Cari Tedarikçi Kartlarını (CLCARD) platform ile otomatik eşitleyin.
              </p>
            </div>
            <span class="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-black text-blue-700 uppercase shrink-0">API READY</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- DB Connection Fields -->
            <div class="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Veritabanı Bağlantı Ayarları</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">SQL Server Host</label>
                  <input v-model="logoHost" type="text" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">Veritabanı Adı</label>
                  <input v-model="logoDb" type="text" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500" />
                </div>
              </div>
              <button @click="runLogoSync" :disabled="logoStatus === 'syncing'" class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/10">
                <RefreshCw :size="14" class="animate-spin" v-if="logoStatus === 'syncing'" />
                <Play :size="14" v-else />
                <span>Malzeme & Cari Kartları Eşitle</span>
              </button>
            </div>

            <!-- Sync counters -->
            <div class="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Eşitlenen Cari & Malzeme</span>
              
              <div class="space-y-4 py-4">
                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Malzeme Kartı (ITEMS)</span>
                    <span class="font-mono text-blue-600">{{ syncedMaterialsCount }} / 125</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full transition-all duration-300" :style="`width: ${(syncedMaterialsCount/125)*100}%`"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Tedarikçi Cari (CLCARD)</span>
                    <span class="font-mono text-blue-600">{{ syncedCarisCount }} / 42</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full transition-all duration-300" :style="`width: ${(syncedCarisCount/42)*100}%`"></div>
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 font-bold uppercase">Son Eşitleme: Bugün, 11:24</div>
            </div>
          </div>
        </div>

        <!-- 3. MICROSOFT DYNAMICS -->
        <div v-if="activeTab === 'dynamics'" class="space-y-6">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-base font-black text-slate-800">Microsoft Dynamics 365 Cloud Bağlantısı</h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                Microsoft Azure AD / OAuth 2.0 üzerinden güvenli kurumsal bulut eşleşmesi.
              </p>
            </div>
            <span class="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[9px] font-black text-emerald-700 uppercase shrink-0">ACTIVE CONNECT</span>
          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- App registration -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Azure App Registration Ayarları</h4>
              <div>
                <label class="text-[9px] font-black uppercase text-slate-400 block mb-1">Application (Client) ID</label>
                <div class="relative">
                  <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input v-model="dynClientId" type="text" class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none" readonly />
                </div>
              </div>
              <div class="flex items-center gap-3">
                <input v-model="dynAutoSync" id="autosync" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label for="autosync" class="text-[10px] font-black text-slate-600 uppercase tracking-wider">Otomatik Günlük Senkronizasyon (Her gece 02:00)</label>
              </div>
            </div>

            <!-- Sync frequency chart placeholder -->
            <div class="border border-slate-200 rounded-2xl bg-white p-5 flex flex-col justify-between">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Dynamics API Çağrı Frekansı</span>
              <div class="flex h-32 items-end justify-between gap-2 pt-4">
                <div class="w-full bg-blue-100 h-1/4 rounded-t-lg"></div>
                <div class="w-full bg-blue-100 h-2/5 rounded-t-lg"></div>
                <div class="w-full bg-blue-100 h-1/2 rounded-t-lg"></div>
                <div class="w-full bg-blue-600 h-4/5 rounded-t-lg"></div>
                <div class="w-full bg-blue-100 h-1/3 rounded-t-lg"></div>
              </div>
              <div class="text-[10px] text-center text-slate-400 font-bold uppercase mt-2">Günlük Ortalama 450 İstek</div>
            </div>
          </div>
        </div>

        <!-- 4. REST API & EXCEL -->
        <div v-if="activeTab === 'api'" class="space-y-6">
          <div class="flex justify-between items-start gap-4">
            <div>
              <h3 class="text-base font-black text-slate-800">Geliştirici REST API & Excel İhale Yükleme</h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                REST API kullanarak kendi uygulamalarınızdan ihale açın veya Excel dosyası yükleyerek toplu malzeme listesi oluşturun.
              </p>
            </div>
            <span class="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-black text-blue-700 uppercase shrink-0">DEVELOPER SUITE</span>
          </div>

          <!-- API credentials -->
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
            <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">REST API Yetkilendirme Anahtarı</h4>
            <div class="flex gap-2">
              <div class="relative flex-grow">
                <Key :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input v-model="apiKey" type="text" class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none" readonly />
              </div>
              <button @click="copyApiKey" class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                <Copy :size="14" />
                <span>{{ keyCopied ? 'Kopyalandı' : 'Kopyala' }}</span>
              </button>
              <button @click="rotateApiKey" class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50">
                Anahtarı Yenile
              </button>
            </div>
          </div>

          <!-- Excel upload simulator -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left: drag drop -->
            <div @click="handleExcelUpload" class="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-blue-50/20 hover:border-blue-500/50 p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px]">
              <FileSpreadsheet :size="36" class="text-slate-400 mb-3" />
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Excel Malzeme Listesi Yükleyin</h4>
              <p class="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                İhale kalemi oluşturmak için excel (.xlsx) şablon dosyasını buraya sürükleyin veya göz atın.
              </p>
              <span v-if="selectedExcelFile" class="mt-4 rounded bg-blue-100 border border-blue-200 px-3 py-1.5 text-[10px] font-black text-blue-700 flex items-center gap-1.5">
                <FileText :size="12" /> {{ selectedExcelFile }}
              </span>
            </div>

            <!-- Right: parsed items -->
            <div class="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between min-h-[220px]">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-3">Ayrıştırılan Excel Verileri</span>
              
              <div v-if="parsedItems.length > 0" class="flex-grow space-y-2">
                <div v-for="(item, idx) in parsedItems" :key="idx" class="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div class="min-w-0 pr-4 text-left">
                    <div class="text-[11px] font-bold text-slate-800 truncate">{{ item.name }}</div>
                  </div>
                  <span class="shrink-0 font-mono text-[10px] font-black text-slate-700">{{ item.qty }} {{ item.unit }}</span>
                </div>
              </div>
              <div v-else class="flex-grow flex items-center justify-center text-xs text-slate-400 font-medium">
                Dosya seçildiğinde kalemler burada listelenir.
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100" v-if="parsedItems.length > 0">
                <button @click="importExcelItems" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10">
                  <span>Bu Malzemelerle İhale Oluştur</span>
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
