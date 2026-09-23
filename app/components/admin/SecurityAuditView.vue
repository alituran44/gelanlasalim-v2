<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Activity,
  Users,
  Smartphone,
  RotateCw,
  Eye,
  Server,
  Terminal,
  Send,
  Download,
  Search,
  Filter
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

const { userSession } = useUserSession()

const isLoading = ref(true)
const securityData = ref<any>({
  metrics: {
    totalEvents: 0,
    collusionSignals: 0,
    idorAttempts: 0,
    mfaVerifications: 0,
    maliciousFilesBlocked: 0,
    rateLimitsHit: 0,
    roleViolations: 0
  },
  systemHealth: {
    tenantIsolationActive: true,
    rateLimitingActive: true,
    sealedBidMaskingActive: true,
    immutableAuditActive: true,
    xssSanitizationActive: true,
    fileValidationActive: true
  },
  events: []
})

const selectedFilter = ref('ALL')
const searchQuery = ref('')

// MFA Interactive Test State (SEC-009)
const mfaPhone = ref('')
const mfaPurpose = ref('HIGH_VALUE_AWARD')
const mfaCodeSent = ref(false)
const mfaInputCode = ref('')
const mfaStatusMessage = ref('')
const isSendingMfa = ref(false)
const isVerifyingMfa = ref(false)

async function fetchSecurityEvents() {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/admin/security/events')
    if (res?.success) {
      securityData.value = res
    }
  } catch (e: any) {
    console.error('Security events fetch error:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (userSession.value?.phone) {
    mfaPhone.value = userSession.value.phone
  } else {
    mfaPhone.value = '0850 840 86 95'
  }
  fetchSecurityEvents()
})

const filteredEvents = computed(() => {
  let list = securityData.value?.events || []
  
  if (selectedFilter.value === 'COLLUSION') list = list.filter((e: any) => e.eventType === 'COLLUSION_SIGNAL_DETECTED')
  else if (selectedFilter.value === 'IDOR') list = list.filter((e: any) => e.eventType === 'IDOR_ATTEMPT')
  else if (selectedFilter.value === 'MFA') list = list.filter((e: any) => e.eventType?.includes('MFA'))
  else if (selectedFilter.value === 'FILE') list = list.filter((e: any) => e.eventType === 'MALICIOUS_FILE_BLOCKED')
  else if (selectedFilter.value === 'HIGH') list = list.filter((e: any) => e.severity === 'HIGH' || e.severity === 'CRITICAL')

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((e: any) => 
      e.id?.toLowerCase().includes(q) ||
      e.eventType?.toLowerCase().includes(q) ||
      e.actorEmail?.toLowerCase().includes(q) ||
      e.actorVkn?.toLowerCase().includes(q) ||
      e.targetResource?.toLowerCase().includes(q) ||
      JSON.stringify(e.details || {}).toLowerCase().includes(q)
    )
  }

  return list
})

async function sendMfaOtp() {
  if (!mfaPhone.value) {
    alert('Lütfen telefon veya e-posta adresi giriniz.')
    return
  }

  isSendingMfa.value = true
  mfaStatusMessage.value = ''
  try {
    const res: any = await $fetch('/api/auth/mfa/send', {
      method: 'POST',
      body: {
        phoneOrEmail: mfaPhone.value,
        purpose: mfaPurpose.value
      }
    })

    if (res?.success) {
      mfaCodeSent.value = true
      mfaStatusMessage.value = res.message || 'Güvenlik doğrulama kodu başarıyla iletildi.'
    }
  } catch (e: any) {
    alert('MFA kod gönderim hatası: ' + (e.data?.message || e.message))
  } finally {
    isSendingMfa.value = false
  }
}

async function verifyMfaOtpCode() {
  if (!mfaInputCode.value) {
    alert('Lütfen 6 haneli doğrulama kodunu giriniz.')
    return
  }

  isVerifyingMfa.value = true
  try {
    const res: any = await $fetch('/api/auth/mfa/verify', {
      method: 'POST',
      body: {
        phoneOrEmail: mfaPhone.value,
        code: mfaInputCode.value
      }
    })

    if (res?.success) {
      alert(`✅ İKİ FAKTÖRLÜ DOĞRULAMA BAŞARILI (Kural SEC-009)!\n\nDoğrulama Jetonu: ${res.actionToken}\nİşlem güvenle onaylandı.`)
      mfaCodeSent.value = false
      mfaInputCode.value = ''
      mfaStatusMessage.value = 'MFA Doğrulandı ✓'
      fetchSecurityEvents()
    }
  } catch (e: any) {
    alert('MFA doğrulama hatası: ' + (e.data?.message || e.message))
  } finally {
    isVerifyingMfa.value = false
  }
}

function exportAuditLogsJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(securityData.value?.events || [], null, 2))
  const dlAnchorElem = document.createElement('a')
  dlAnchorElem.setAttribute('href', dataStr)
  dlAnchorElem.setAttribute('download', `ihale-audit-logs-${new Date().toISOString().slice(0, 10)}.json`)
  dlAnchorElem.click()
}
</script>

<template>
  <div class="space-y-6 text-left">

    <!-- Üst Başlık ve Rozet -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck :size="24" />
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Güvenlik, Yetki & Manipülasyon İzleme Merkezi
          </h2>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700 uppercase font-mono">
            SEC-001 ~ SEC-020
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          Yalnızca yetkili yöneticilere açık denetim katmanı: Tenant izolasyonu, değiştirilemez denetim izi, kapalı zarf backend gizliliği ve danışıklı teklif (collusion) tespiti.
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          @click="fetchSecurityEvents"
          class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Yenile"
        >
          <RotateCw :size="14" :class="{ 'animate-spin': isLoading }" />
          <span>Yenile</span>
        </button>

        <button
          type="button"
          @click="exportAuditLogsJson"
          class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Logları İndir (JSON)"
        >
          <Download :size="14" />
          <span>Logları İndir</span>
        </button>

        <div class="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold bg-[#003057] text-white shadow-xs">
          <ShieldCheck :size="15" class="text-emerald-400" />
          <span>Sistem Koruma Katmanı Aktif</span>
        </div>
      </div>
    </div>

    <!-- Sistem Güvenlik Durumu Şeridi -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Tenant İzolasyonu</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 :size="13" class="text-emerald-600" />
          <span>SEC-002 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Kapalı Zarf Maskeleme</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <Lock :size="13" class="text-emerald-600" />
          <span>SEC-004 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Değiştirilemez Log</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <Shield :size="13" class="text-emerald-600" />
          <span>SEC-005 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Rate Limiting</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <Activity :size="13" class="text-emerald-600" />
          <span>SEC-008 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Dosya & MIME Filtresi</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <FileCheck :size="13" class="text-emerald-600" />
          <span>SEC-012 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">XSS / SQL Filtresi</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
          <Terminal :size="13" class="text-emerald-600" />
          <span>SEC-013 Aktif</span>
        </div>
      </div>
    </div>

    <!-- Metrik Kartları -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOPLAM DENETİM OLAYI</span>
        <div class="text-2xl font-black font-mono text-slate-900 dark:text-white">{{ securityData.metrics?.totalEvents || 0 }}</div>
        <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Değiştirilemez Olay Kaydı</span>
      </div>

      <div class="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">DANIŞIKLI TEKLİF SİNYALİ</span>
        <div class="text-2xl font-black font-mono text-amber-900 dark:text-amber-300">{{ securityData.metrics?.collusionSignals || 0 }}</div>
        <span class="text-[11px] text-amber-700 dark:text-amber-400 font-medium block">Aynı IP / Rakip VKN (SEC-014)</span>
      </div>

      <div class="p-4 rounded-3xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-red-800 dark:text-red-400 uppercase tracking-wider block">ENGELLENEN IDOR / YETKİ</span>
        <div class="text-2xl font-black font-mono text-red-900 dark:text-red-300">{{ (securityData.metrics?.idorAttempts || 0) + (securityData.metrics?.roleViolations || 0) }}</div>
        <span class="text-[11px] text-red-700 dark:text-red-400 font-medium block">Tenant İzolasyon Koruma (SEC-002)</span>
      </div>

      <div class="p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider block">MFA İKİ FAKTÖRLÜ ONAY</span>
        <div class="text-2xl font-black font-mono text-blue-900 dark:text-blue-300">{{ securityData.metrics?.mfaVerifications || 0 }}</div>
        <span class="text-[11px] text-blue-700 dark:text-blue-400 font-medium block">Kritik İşlem Güvenliği (SEC-009)</span>
      </div>
    </div>

    <!-- İki Kolon: Sol MFA Kontrol Masası | Sağ Collusion & Danışıklı Teklif -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- KART 1: MFA (İki Faktörlü Doğrulama) Kontrol Masası (SEC-009) -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black">
            <Smartphone :size="20" />
          </div>
          <div>
            <span class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider block">KURAL SEC-009</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">MFA İki Faktörlü Kimlik Doğrulama Test Masası</h3>
          </div>
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Yüksek tutarlı ihaleler, yetki devirleri ve şartname revizyonlarında 6 haneli OTP kodu ile ikinci faktör onayı zorunludur. Burada simülasyon ve anlık doğrulama yapabilirsiniz.
        </p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              DOĞRULAMA YAPILACAK TELEFON / E-POSTA
            </label>
            <input
              v-model="mfaPhone"
              type="text"
              class="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-bold font-mono text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              KRİTİK İŞLEM KAPSAMI
            </label>
            <select
              v-model="mfaPurpose"
              class="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500"
            >
              <option value="HIGH_VALUE_AWARD">Yüksek Tutarlı İhale Sonuç Onayı (AWD-007)</option>
              <option value="TENDER_CANCELLATION">İhale İptal ve Fesih Kararı (TND-013)</option>
              <option value="ROLE_CHANGE">Firma Yöneticisi / Yetki Değişimi (USR-003)</option>
              <option value="SPEC_CHANGE">Canlı Şartname Versiyon Revizyonu (TND-012)</option>
            </select>
          </div>

          <!-- Kod Gönder Butonu -->
          <div v-if="!mfaCodeSent" class="pt-1">
            <button
              type="button"
              :disabled="isSendingMfa"
              @click="sendMfaOtp"
              class="w-full py-2.5 rounded-xl bg-[#003057] hover:bg-[#002240] text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send :size="13" />
              <span>{{ isSendingMfa ? 'Gönderiliyor...' : '6 Haneli SMS / MFA Doğrulama Kodu İste' }}</span>
            </button>
          </div>

          <!-- Kod Doğrulama Alanı -->
          <div v-else class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-3">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-bold text-blue-900 dark:text-blue-200">SMS / E-Posta Güvenlik Kodu Giriniz:</span>
              <span class="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                ⏱️ 3 Dakika Geçerli
              </span>
            </div>

            <div class="flex gap-2">
              <input
                v-model="mfaInputCode"
                type="text"
                maxlength="6"
                placeholder="6 haneli kod"
                class="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-xl text-center text-base font-black font-mono text-slate-900 dark:text-white outline-none tracking-widest focus:border-blue-600"
              />
              <button
                type="button"
                :disabled="isVerifyingMfa"
                @click="verifyMfaOtpCode"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 :size="14" />
                <span>{{ isVerifyingMfa ? 'Kontrol...' : 'Onayla' }}</span>
              </button>
            </div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">Kod 3 dakika boyunca geçerlidir. Başarıyla doğrulandığında tek kullanımlık güvenlik jetonu üretilir.</p>
          </div>

        </div>
      </div>

      <!-- KART 2: Danışıklı Teklif (Collusion) Analiz Masası (SEC-014) -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div class="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black">
            <AlertTriangle :size="20" />
          </div>
          <div>
            <span class="text-[9px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">KURAL SEC-014 & BÖLÜM 8.8</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">Danışıklı Teklif & Risk Sinyalleri</h3>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div class="font-black flex items-center gap-1">
            <ShieldAlert :size="14" class="text-amber-600 dark:text-amber-400" />
            <span>İlke P-06 Hatırlatması:</span>
          </div>
          <p class="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
            Aynı IP veya cihaz tek başına hile kanıtı sayılmaz; doğrudan suçlama yapılmaz. Sistem risk skoru üretir, olayı denetim günlüğüne bayraklar ve insan incelemesine sunar.
          </p>
        </div>

        <div class="space-y-2.5 text-xs">
          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            PLATFORM TARAFINDAN İZLENEN RİSK ÖRÜNTÜLERİ:
          </h4>

          <div class="space-y-2">
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 dark:text-slate-200 block text-xs">Aynı IP + Rakip Firma VKN'si</strong>
                <span class="text-[10px] text-slate-400">Aynı ağdan rakip tekliflerin verilmesi</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">Yüksek Öncelik</span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 dark:text-slate-200 block text-xs">Aynı Cihaz / Tarayıcı Parmak İzi</strong>
                <span class="text-[10px] text-slate-400">Farklı firmalarla oturum açma sıklığı</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">Orta Öncelik</span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 dark:text-slate-200 block text-xs">Aşırı Hızlı Teklif Frekansı</strong>
                <span class="text-[10px] text-slate-400">Otomatik bot şüphesi ve rate limit aşımı</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">Otomatik Limit</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MERKEZİ GÜVENLİK VE DENETİM GÜNLÜĞÜ (SEC-005, SEC-018) -->
    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span class="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider block">KURAL SEC-005 & SEC-018</span>
          <h3 class="text-base font-black text-slate-900 dark:text-white">Merkezi Güvenlik Olayları Günlüğü (Audit Log)</h3>
          <p class="text-xs text-slate-400 mt-0.5">Admin dahil silinemez, değiştirilemez; zaman damgasıyla saklanır.</p>
        </div>

        <!-- Filtre ve Arama -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Arama Kutusu -->
          <div class="relative">
            <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Olay, VKN veya IP ara..."
              class="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-purple-500 w-44"
            />
          </div>

          <!-- Filtre Segmenti -->
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs flex-wrap">
            <button
              v-for="flt in [
                { id: 'ALL', label: 'Tümü' },
                { id: 'COLLUSION', label: 'Danışıklı Teklif' },
                { id: 'IDOR', label: 'Yetki/IDOR' },
                { id: 'MFA', label: 'MFA' },
                { id: 'FILE', label: 'Dosya' },
                { id: 'HIGH', label: 'Kritik/Yüksek' }
              ]"
              :key="flt.id"
              type="button"
              @click="selectedFilter = flt.id"
              class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
              :class="selectedFilter === flt.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ flt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tablo -->
      <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-black border-b border-slate-200 dark:border-slate-800 text-[11px]">
              <tr>
                <th class="p-3">Olay ID & Zaman</th>
                <th class="p-3">Olay Türü</th>
                <th class="p-3">Şiddet</th>
                <th class="p-3">Kullanıcı / VKN</th>
                <th class="p-3">Alınan Aksiyon</th>
                <th class="p-3">Ayrıntı & Hedef Kaynak</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-if="filteredEvents.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-400 dark:text-slate-500">
                  Filtreye veya aramaya uygun güvenlik olayı bulunamadı.
                </td>
              </tr>
              <tr
                v-for="evt in filteredEvents"
                :key="evt.id"
                class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
              >
                <td class="p-3 font-mono text-[11px]">
                  <strong class="text-slate-800 dark:text-slate-200 block">{{ evt.id }}</strong>
                  <span class="text-slate-400 text-[10px]">{{ new Date(evt.timestamp).toLocaleString('tr-TR') }}</span>
                </td>

                <td class="p-3">
                  <span class="font-bold text-slate-900 dark:text-white text-xs font-mono">{{ evt.eventType }}</span>
                </td>

                <td class="p-3">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300': evt.severity === 'CRITICAL' || evt.severity === 'HIGH',
                      'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300': evt.severity === 'MEDIUM',
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400': evt.severity === 'LOW'
                    }"
                  >
                    {{ evt.severity }}
                  </span>
                </td>

                <td class="p-3 text-slate-700 dark:text-slate-300">
                  <span class="font-bold block">{{ evt.actorEmail || 'Anonim' }}</span>
                  <span v-if="evt.actorVkn" class="font-mono text-[10px] text-slate-400 block">VKN: {{ evt.actorVkn }}</span>
                </td>

                <td class="p-3">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-black"
                    :class="{
                      'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800': evt.actionTaken === 'BLOCKED_403',
                      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800': evt.actionTaken === 'FLAGGED_FOR_REVIEW',
                      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800': evt.actionTaken === 'RATE_LIMITED' || evt.actionTaken === 'MASKED',
                      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800': evt.actionTaken === 'ALLOWED'
                    }"
                  >
                    {{ evt.actionTaken }}
                  </span>
                </td>

                <td class="p-3 text-[11px] text-slate-600 dark:text-slate-300">
                  <span class="font-mono text-slate-500 dark:text-slate-400 block text-[10px]">{{ evt.targetResource || '-' }}</span>
                  <span class="text-slate-700 dark:text-slate-300 block">{{ evt.details?.message || evt.details?.reason || JSON.stringify(evt.details) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>
