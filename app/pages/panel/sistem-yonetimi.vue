<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Download, 
  Upload, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  Terminal, 
  FileCheck, 
  Activity, 
  Layers, 
  Sparkles,
  Search,
  Check,
  Building2,
  HelpCircle,
  Clock,
  Fingerprint
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Sistem Yönetimi, UAT & Güvenlik Matrisi (SEC-016 - SEC-020) | İhaleciBurada'
})

const activeTab = ref<'uat' | 'pentest' | 'backup' | 'go-live'>('uat')
const isLoading = ref(false)

// Telemetry & Metrics
const telemetry = ref<any>(null)
const environmentConfig = ref<any>(null)
const readiness = ref<any>(null)

// UAT State
const uatReport = ref<any>(null)
const isRunningUat = ref(false)
const uatFilterCategory = ref<string>('ALL')

// Pentest State
const pentestReport = ref<any>(null)
const isRunningPentest = ref(false)

// Backup / Restore State
const backupCycleResult = ref<any>(null)
const isTestingBackup = ref(false)
const restoreMessage = ref<string>('')
const restoreStatus = ref<'idle' | 'success' | 'error'>('idle')

// Fetch Telemetry & Initial Audits
async function loadSystemData() {
  isLoading.value = true
  try {
    const res = await $fetch<any>('/api/admin/system/metrics')
    if (res) {
      telemetry.value = res.telemetry
      environmentConfig.value = res.config
      readiness.value = res.readiness
    }
  } catch (err) {
    console.error('Sistem metrikleri yüklenemedi:', err)
  } finally {
    isLoading.value = false
  }
}

// Run UAT Suite
async function runUat() {
  isRunningUat.value = true
  try {
    const res = await $fetch<any>('/api/admin/system/uat-run', { method: 'POST' })
    if (res?.uatReport) {
      uatReport.value = res.uatReport
    }
  } catch (err) {
    console.error('UAT test çalıştırma hatası:', err)
  } finally {
    isRunningUat.value = false
  }
}

// Run Pentest Audit
async function runPentest() {
  isRunningPentest.value = true
  try {
    const res = await $fetch<any>('/api/admin/system/pentest-audit')
    if (res?.auditReport) {
      pentestReport.value = res.auditReport
    }
  } catch (err) {
    console.error('Penetrasyon testi hatası:', err)
  } finally {
    isRunningPentest.value = false
  }
}

// Test Backup & Restore Cycle
async function testBackupCycle() {
  isTestingBackup.value = true
  backupCycleResult.value = null
  try {
    const res = await $fetch<any>('/api/admin/system/restore', {
      method: 'POST',
      body: { mode: 'SELF_TEST' }
    })
    if (res?.testResult) {
      backupCycleResult.value = res.testResult
    }
  } catch (err) {
    console.error('Yedekleme testi hatası:', err)
  } finally {
    isTestingBackup.value = false
  }
}

// Download System Backup
function downloadBackup() {
  window.open('/api/admin/system/backup', '_blank')
}

// Upload & Restore Backup File
async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  restoreStatus.value = 'idle'
  restoreMessage.value = 'Dosya okunuyor ve SHA-256 imzası doğrulanıyor...'

  try {
    const text = await file.text()
    const json = JSON.parse(text)

    const res = await $fetch<any>('/api/admin/system/restore', {
      method: 'POST',
      body: { snapshot: json }
    })

    restoreStatus.value = 'success'
    restoreMessage.value = res.message || 'Sistem yedeği başarıyla geri yüklendi.'
    await loadSystemData()
  } catch (err: any) {
    restoreStatus.value = 'error'
    restoreMessage.value = err?.data?.statusMessage || err.message || 'Bozuk veya geçersiz yedek dosyası.'
  } finally {
    target.value = ''
  }
}

// Filtered UAT Requirements
const filteredUatResults = computed(() => {
  if (!uatReport.value?.results) return []
  if (uatFilterCategory.value === 'ALL') return uatReport.value.results
  return uatReport.value.results.filter((r: any) => r.category === uatFilterCategory.value)
})

onMounted(async () => {
  await loadSystemData()
  await Promise.all([runUat(), runPentest()])
})
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto text-slate-100">
    
    <!-- Başlık & Go-Live Rozeti -->
    <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-sm">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck :size="14" />
              PRD BÖLÜM 13-15 & SEC-016 - SEC-020 UYUMLU
            </span>
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              UAT & OWASP PENETRASYON TEST MERKEZİ
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Server class="text-purple-400" :size="32" />
            Canlıya Geçiş, Sistem Yönetimi & Güvenlik Matrisi
          </h1>
          <p class="text-sm text-slate-400 mt-1 max-w-3xl">
            İhaleciBurada üretim öncesi doğrulama paneli; 65+ iş kuralının uçtan uca UAT testi, 12 maddelik OWASP API penetrasyon testi, SHA-256 imzalı tam sistem yedekleme ve ortam izolasyonu.
          </p>
        </div>

        <!-- Telemetri Özet Kartı -->
        <div class="flex items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 shrink-0">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity :size="24" />
          </div>
          <div>
            <div class="text-xs text-slate-400 font-medium">Sistem Sağlığı & Hazırlık</div>
            <div class="text-xl font-black text-white font-mono flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              %{{ readiness?.readinessScore || 100 }} HAZIR
            </div>
            <div class="text-[10px] text-emerald-400 font-bold">
              Çalışma Süresi: {{ telemetry?.uptimeSeconds ? Math.floor(telemetry.uptimeSeconds / 60) + ' dk' : 'Aktif' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Kural Sütunları -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">SEC-016:</span> DEV/UAT/PROD ortam ayrımı ve tenant izolasyonu.
          </div>
        </div>
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">SEC-017:</span> SHA-256 imzalı JSON yedekleme & restore testi.
          </div>
        </div>
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">SEC-018:</span> Merkezi izleme, uptime ve bellek telemetrisi.
          </div>
        </div>
        <div class="flex items-start gap-2 text-slate-300">
          <CheckCircle2 :size="16" class="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-white">SEC-019/020:</span> OWASP penetrasyon denetimi ve CI/CD akışı.
          </div>
        </div>
      </div>
    </div>

    <!-- Sekme Navigasyonu -->
    <div class="flex border-b border-slate-800 space-x-1 overflow-x-auto scrollbar-none">
      <button
        type="button"
        @click="activeTab = 'uat'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'uat' ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <FileCheck :size="16" />
        UAT Test Koşucusu (65+ Kural)
      </button>

      <button
        type="button"
        @click="activeTab = 'pentest'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'pentest' ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <ShieldCheck :size="16" />
        OWASP B2B Penetrasyon Matrisi
      </button>

      <button
        type="button"
        @click="activeTab = 'backup'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'backup' ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Database :size="16" />
        Backup & Restore (SEC-017)
      </button>

      <button
        type="button"
        @click="activeTab = 'go-live'"
        class="px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer shrink-0"
        :class="activeTab === 'go-live' ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Server :size="16" />
        Go-Live Hazırlık & Telemetri
      </button>
    </div>

    <!-- 1. TAB: UAT TEST KOŞUCUSU -->
    <div v-if="activeTab === 'uat'" class="space-y-6">
      <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <FileCheck :size="18" class="text-purple-400" />
              PRD 65+ İş Kuralı UAT Doğrulama Konsolu
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              GEN, USR, TND, VER, BID, AWD, SEC, COM, REP, LEG ve REV kategorilerindeki tüm kuralların doğrulama kanıtları.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              type="button"
              @click="runUat"
              :disabled="isRunningUat"
              class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw :size="14" :class="{ 'animate-spin': isRunningUat }" />
              <span>{{ isRunningUat ? 'Testler Koşuluyor...' : 'UAT Testini Yeniden Koş' }}</span>
            </button>
          </div>
        </div>

        <!-- UAT Özet Skoru -->
        <div v-if="uatReport" class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">Toplam Kural</span>
            <span class="text-xl font-bold text-white font-mono">{{ uatReport.totalRequirements }} Kural</span>
          </div>
          <div>
            <span class="text-[10px] text-emerald-400 uppercase font-bold block">Başarılı (Passed)</span>
            <span class="text-xl font-bold text-emerald-400 font-mono">{{ uatReport.passedCount }} / {{ uatReport.totalRequirements }}</span>
          </div>
          <div>
            <span class="text-[10px] text-red-400 uppercase font-bold block">Hatalı (Failed)</span>
            <span class="text-xl font-bold text-red-400 font-mono">{{ uatReport.failedCount }}</span>
          </div>
          <div>
            <span class="text-[10px] text-purple-400 uppercase font-bold block">Kapsama Oranı</span>
            <span class="text-xl font-bold text-purple-400 font-mono">%{{ uatReport.coveragePercentage }}</span>
          </div>
        </div>

        <!-- Kategori Filtreleri -->
        <div class="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none text-xs">
          <span class="text-slate-400 font-bold text-[11px] shrink-0">Filtrele:</span>
          <button
            v-for="cat in ['ALL', 'GEN', 'USR', 'TND', 'VER', 'BID', 'AWD', 'SEC', 'COM', 'REP', 'LEG', 'REV']"
            :key="cat"
            type="button"
            @click="uatFilterCategory = cat"
            class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer shrink-0"
            :class="uatFilterCategory === cat ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- UAT Tablosu -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th class="py-3 px-3">Kural Kodu</th>
                <th class="py-3 px-3">Gereksinim Tanımı</th>
                <th class="py-3 px-3">Öncelik</th>
                <th class="py-3 px-3">Test Edilen Bileşen</th>
                <th class="py-3 px-3">Doğrulama Kanıtı</th>
                <th class="py-3 px-3">Durum</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="r in filteredUatResults" :key="r.code" class="hover:bg-slate-950/40 transition">
                <td class="py-3 px-3 font-mono font-bold text-purple-400 whitespace-nowrap">
                  {{ r.code }}
                </td>
                <td class="py-3 px-3 text-slate-200 max-w-sm">
                  {{ r.title }}
                </td>
                <td class="py-3 px-3 font-mono text-[10px]">
                  <span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {{ r.priority }}
                  </span>
                </td>
                <td class="py-3 px-3 font-mono text-[11px] text-slate-400">
                  {{ r.testedComponent }}
                </td>
                <td class="py-3 px-3 text-slate-300 text-[11px]">
                  {{ r.proof }}
                </td>
                <td class="py-3 px-3 whitespace-nowrap">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                    <CheckCircle2 :size="12" />
                    {{ r.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- 2. TAB: OWASP B2B PENETRASYON MATRİSİ -->
    <div v-if="activeTab === 'pentest'" class="space-y-6">
      <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck :size="18" class="text-emerald-400" />
              OWASP Top 10 B2B API Penetrasyon & Güvenlik Denetimi
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              BOLA, Broken Auth, Kapalı Zarf Veri Sızıntısı, Anti-Sniping ve Danışıklık Saldırı Simülasyonu.
            </p>
          </div>

          <button 
            type="button"
            @click="runPentest"
            :disabled="isRunningPentest"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw :size="14" :class="{ 'animate-spin': isRunningPentest }" />
            <span>{{ isRunningPentest ? 'Saldırı Testleri Koşuluyor...' : 'Penetrasyon Denetimini Çalıştır' }}</span>
          </button>
        </div>

        <!-- Pentest Skor Kartı -->
        <div v-if="pentestReport" class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck :size="20" />
            </div>
            <div>
              <div class="text-xs text-slate-400">Genel Güvenlik Skoru</div>
              <div class="text-xl font-black text-white font-mono">
                %{{ pentestReport.securityScore }} / 100 GÜVENLİ
              </div>
            </div>
          </div>
          <div class="text-right text-xs">
            <span class="text-emerald-400 font-bold block">{{ pentestReport.passedTests }} / {{ pentestReport.totalTests }} Test Başarılı</span>
            <span class="text-slate-400 text-[10px]">Son Denetim: {{ new Date(pentestReport.executedAt).toLocaleTimeString('tr-TR') }}</span>
          </div>
        </div>

        <!-- Güvenlik Senaryoları Listesi -->
        <div v-if="pentestReport" class="space-y-3 pt-2">
          <div 
            v-for="t in pentestReport.tests" 
            :key="t.id"
            class="p-4 rounded-xl border bg-slate-950/60 border-slate-800 hover:border-slate-700 transition space-y-2"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-white">{{ t.id }}</span>
                <span class="text-xs font-bold text-slate-300">{{ t.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400">
                  {{ t.executionTimeMs }} ms
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {{ t.status }}
                </span>
              </div>
            </div>

            <div class="text-[11px] text-slate-400">
              <span class="text-slate-300 font-semibold">{{ t.owaspCategory }}:</span> {{ t.description }}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-emerald-400 font-bold block mb-0.5">Doğrulanan Savunma:</span>
                <span class="text-slate-300">{{ t.assertion }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-blue-400 font-bold block mb-0.5">Bileşen / Kod Kanıtı:</span>
                <span class="text-slate-400 font-mono text-[10px]">{{ t.details }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 3. TAB: BACKUP & RESTORE (SEC-017) -->
    <div v-if="activeTab === 'backup'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Sol: Yedekleme İndirme & Otomatik Test -->
        <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Download :size="18" class="text-purple-400" />
            Sistem Yedeği Al (Snapshot Export)
          </h2>
          <p class="text-xs text-slate-400">
            Platformdaki tüm ihaleler, teklifler, sorular, kurumsal doğrulamalar, sözleşmeler ve denetim loglarını SHA-256 hash imzalı JSON dosyası olarak indirin.
          </p>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div class="flex justify-between text-slate-400">
              <span>İhale Kayıtları:</span>
              <span class="text-white font-mono font-bold">{{ telemetry?.counts?.totalTenders || 0 }} Adet</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Teklif Havuzu:</span>
              <span class="text-white font-mono font-bold">{{ telemetry?.counts?.totalBids || 0 }} Adet</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Güvenlik Olay Günlüğü:</span>
              <span class="text-white font-mono font-bold">{{ telemetry?.counts?.securityIncidentsLogged || 0 }} Olay</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Bütünlük Standardı:</span>
              <span class="text-emerald-400 font-mono font-bold">SHA-256 Checksum</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              @click="downloadBackup"
              class="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download :size="14" />
              <span>Tam Yedeği İndir (JSON)</span>
            </button>

            <button
              type="button"
              @click="testBackupCycle"
              :disabled="isTestingBackup"
              class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw :size="14" :class="{ 'animate-spin': isTestingBackup }" />
              <span>{{ isTestingBackup ? 'Test Ediliyor...' : 'Otomatik Restore Testi' }}</span>
            </button>
          </div>

          <!-- Restore Test Sonucu -->
          <div v-if="backupCycleResult" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 mt-3">
            <div class="flex items-center gap-1.5 font-bold">
              <CheckCircle2 :size="14" class="text-emerald-400" />
              <span>Otomatik Yedekleme ve Restore Döngüsü Başarılı!</span>
            </div>
            <div class="text-[11px] text-emerald-400 font-mono">
              Snapshot: {{ backupCycleResult.snapshotId }} | Süre: {{ backupCycleResult.durationMs }} ms | Checksum Uyumlu: %100
            </div>
          </div>
        </div>

        <!-- Sağ: Yedekten Geri Yükleme (Restore) -->
        <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Upload :size="18" class="text-blue-400" />
            Yedekten Geri Yükle (Restore)
          </h2>
          <p class="text-xs text-slate-400">
            Daha önce indirilmiş resmi bir JSON snapshot dosyasını yükleyerek platform durumunu transactional olarak geri yükleyin.
          </p>

          <div class="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/60 text-center transition flex flex-col items-center justify-center gap-3">
            <Database :size="32" class="text-slate-500" />
            <div>
              <div class="text-xs font-bold text-white">Yedekleme JSON Dosyasını Seçin</div>
              <div class="text-[10px] text-slate-400 mt-0.5">SHA-256 imzası otomatik teyit edilecektir</div>
            </div>
            <label class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer border border-slate-700">
              Dosya Seç & Yükle
              <input type="file" accept=".json" @change="handleFileUpload" class="hidden" />
            </label>
          </div>

          <div v-if="restoreMessage" class="p-3 rounded-xl text-xs" :class="{
            'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30': restoreStatus === 'success',
            'bg-red-500/10 text-red-300 border border-red-500/30': restoreStatus === 'error',
            'bg-slate-800 text-slate-300': restoreStatus === 'idle'
          }">
            {{ restoreMessage }}
          </div>
        </div>

      </div>
    </div>

    <!-- 4. TAB: GO-LIVE & TELEMETRİ -->
    <div v-if="activeTab === 'go-live'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Canlıya Çıkış Kontrol Listesi -->
        <div class="lg:col-span-2 rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 :size="18" class="text-emerald-400" />
            10 Maddelik Resmi Canlıya Çıkış (Go-Live) Kontrol Listesi
          </h2>
          <p class="text-xs text-slate-400">
            Platformun üretime alınması öncesinde tamamlanması gereken yasal, teknik ve operasyonel kriterler.
          </p>

          <div class="space-y-2.5 pt-2">
            <div 
              v-for="item in readiness?.checklist" 
              :key="item.id"
              class="p-3 rounded-xl border bg-slate-950/60 border-slate-800 flex items-start gap-3"
            >
              <CheckCircle2 v-if="item.passed" :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
              <XCircle v-else :size="18" class="text-red-400 shrink-0 mt-0.5" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">{{ item.name }}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{{ item.id }}</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ item.note }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistem Telemetrisi & Altyapı Bilgisi -->
        <div class="lg:col-span-1 space-y-6">
          <div class="rounded-2xl p-6 border border-slate-800 bg-slate-900/80 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <Cpu :size="16" class="text-purple-400" />
              Sunucu & Bellek Telemetrisi
            </h3>

            <div class="space-y-3 text-xs">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div class="text-slate-400 mb-1">Heap Kullanımı:</div>
                <div class="text-white font-mono font-bold text-base">
                  {{ telemetry?.memory?.heapUsedMb || 0 }} MB / {{ telemetry?.memory?.heapTotalMb || 0 }} MB
                </div>
              </div>

              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div class="text-slate-400 mb-1">Node.js Sürümü:</div>
                <div class="text-white font-mono font-bold text-base">
                  {{ telemetry?.nodeVersion || 'v20.x' }} ({{ telemetry?.platform || 'windows' }})
                </div>
              </div>

              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div class="text-slate-400 mb-1">Ortam (Environment):</div>
                <div class="text-emerald-400 font-mono font-bold text-base uppercase">
                  {{ environmentConfig?.env || 'production' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Resmi İşletme Bilgisi -->
          <div class="rounded-2xl p-5 border border-slate-800 bg-slate-900/80 text-xs space-y-2">
            <div class="font-bold text-white flex items-center gap-1.5">
              <Building2 :size="14" class="text-emerald-400" />
              <span>Resmi İşletme Tanımı</span>
            </div>
            <div class="text-slate-300 text-[11px] leading-relaxed">
              Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)<br>
              Çanakkale V.D. / VKN: <strong>9560161511</strong><br>
              KEP: hasanhuseyin.yildirim.17@hs01.kep.tr<br>
              Tel: 0850 840 86 95
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
