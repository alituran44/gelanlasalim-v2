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
  Send
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({ layout: 'dashboard' })

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

// MFA Interactive Test State (SEC-009)
const mfaPhone = ref('')
const mfaPurpose = ref('HIGH_VALUE_AWARD')
const mfaCodeSent = ref(false)
const mfaInputCode = ref('')
const mfaDemoCode = ref('')
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
  const list = securityData.value?.events || []
  if (selectedFilter.value === 'ALL') return list
  if (selectedFilter.value === 'COLLUSION') return list.filter((e: any) => e.eventType === 'COLLUSION_SIGNAL_DETECTED')
  if (selectedFilter.value === 'IDOR') return list.filter((e: any) => e.eventType === 'IDOR_ATTEMPT')
  if (selectedFilter.value === 'MFA') return list.filter((e: any) => e.eventType?.includes('MFA'))
  if (selectedFilter.value === 'FILE') return list.filter((e: any) => e.eventType === 'MALICIOUS_FILE_BLOCKED')
  if (selectedFilter.value === 'HIGH') return list.filter((e: any) => e.severity === 'HIGH' || e.severity === 'CRITICAL')
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
      mfaDemoCode.value = res.demoCode || ''
      mfaStatusMessage.value = `SMS kodu gönderildi! Test Kodu: ${res.demoCode}`
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
</script>

<template>
  <div class="p-3 sm:p-6 max-w-6xl mx-auto text-left space-y-6">

    <!-- Üst Başlık ve Rozet -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Güvenlik, Yetki & Manipülasyon İzleme
          </h1>
          <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase font-mono">
            SEC-001 ~ SEC-020
          </span>
        </div>
        <p class="text-xs text-slate-500 font-medium mt-1">
          Bölüm 8 gereksinimleri: Tenant izolasyonu, değiştirilemez denetim izi, kapalı zarf backend gizliliği ve danışıklı teklif tespiti.
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          @click="fetchSecurityEvents"
          class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Yenile"
        >
          <RotateCw :size="14" :class="{ 'animate-spin': isLoading }" />
          <span>Yenile</span>
        </button>

        <div class="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold bg-[#003057] text-white shadow-xs">
          <ShieldCheck :size="15" class="text-emerald-400" />
          <span>Sistem Koruma Katmanı Aktif</span>
        </div>
      </div>
    </div>

    <!-- Sistem Güvenlik Durumu Şeridi -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Tenant İzolasyonu</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <CheckCircle2 :size="13" class="text-emerald-600" />
          <span>SEC-002 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Kapalı Zarf Maskeleme</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <Lock :size="13" class="text-emerald-600" />
          <span>SEC-004 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Değiştirilemez Log</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <Shield :size="13" class="text-emerald-600" />
          <span>SEC-005 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Rate Limiting</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <Activity :size="13" class="text-emerald-600" />
          <span>SEC-008 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Dosya & MIME Filtresi</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <FileCheck :size="13" class="text-emerald-600" />
          <span>SEC-012 Aktif</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">XSS / SQL Filtresi</span>
        <div class="flex items-center justify-center gap-1 text-xs font-black text-emerald-700">
          <Terminal :size="13" class="text-emerald-600" />
          <span>SEC-013 Aktif</span>
        </div>
      </div>
    </div>

    <!-- Metrik Kartları -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="p-4 rounded-3xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOPLAM DENETİM OLAYI</span>
        <div class="text-2xl font-black font-mono text-slate-900">{{ securityData.metrics?.totalEvents || 0 }}</div>
        <span class="text-[11px] text-slate-500 font-medium block">Değiştirilemez Olay Kaydı</span>
      </div>

      <div class="p-4 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-amber-800 uppercase tracking-wider block">DANIŞIKLI TEKLİF SİNYALİ</span>
        <div class="text-2xl font-black font-mono text-amber-900">{{ securityData.metrics?.collusionSignals || 0 }}</div>
        <span class="text-[11px] text-amber-700 font-medium block">Aynı IP / Rakip VKN (SEC-014)</span>
      </div>

      <div class="p-4 rounded-3xl bg-red-50/70 border border-red-200 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-red-800 uppercase tracking-wider block">ENGELLENEN IDOR / YETKİ</span>
        <div class="text-2xl font-black font-mono text-red-900">{{ (securityData.metrics?.idorAttempts || 0) + (securityData.metrics?.roleViolations || 0) }}</div>
        <span class="text-[11px] text-red-700 font-medium block">Tenant İzolasyon Koruma (SEC-002)</span>
      </div>

      <div class="p-4 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-1.5 shadow-xs">
        <span class="text-[10px] font-black text-blue-800 uppercase tracking-wider block">MFA İKİ FAKTÖRLÜ ONAY</span>
        <div class="text-2xl font-black font-mono text-blue-900">{{ securityData.metrics?.mfaVerifications || 0 }}</div>
        <span class="text-[11px] text-blue-700 font-medium block">Kritik İşlem Güvenliği (SEC-009)</span>
      </div>
    </div>

    <!-- İki Kolon: Sol MFA & Güvenlik Masası | Sağ Collusion & Danışıklı Teklif -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- KART 1: MFA (İki Faktörlü Doğrulama) Kontrol Masası (SEC-009) -->
      <div class="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black">
            <Smartphone :size="20" />
          </div>
          <div>
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">KURAL SEC-009</span>
            <h3 class="text-sm font-black text-slate-900">MFA İki Faktörlü Kimlik Doğrulama</h3>
          </div>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed">
          Firma yöneticileri ve teklif yetkilileri için yüksek tutarlı ihaleler, yetki devirleri ve sonuçlandırma işlemlerinde 6 haneli OTP kodu ile ikinci faktör onayı zorunludur.
        </p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              DOĞRULAMA YAPILACAK TELEFON / E-POSTA
            </label>
            <input
              v-model="mfaPhone"
              type="text"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              KRİTİK İŞLEM KAPSAMI
            </label>
            <select
              v-model="mfaPurpose"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
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
          <div v-else class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-bold text-blue-900">SMS Güvenlik Kodu Giriniz:</span>
              <span v-if="mfaDemoCode" class="font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Test Kodu: {{ mfaDemoCode }}
              </span>
            </div>

            <div class="flex gap-2">
              <input
                v-model="mfaInputCode"
                type="text"
                maxlength="6"
                placeholder="6 haneli kod"
                class="flex-1 p-2.5 bg-white border border-blue-300 rounded-xl text-center text-base font-black font-mono text-slate-900 outline-none tracking-widest focus:border-blue-600"
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
            <p class="text-[10px] text-slate-500">Kod 3 dakika boyunca geçerlidir. Başarıyla doğrulandığında tek kullanımlık güvenlik jetonu üretilir.</p>
          </div>

        </div>
      </div>

      <!-- KART 2: Danışıklı Teklif (Collusion) Analiz Masası (SEC-014) -->
      <div class="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black">
            <AlertTriangle :size="20" />
          </div>
          <div>
            <span class="text-[9px] font-black text-amber-700 uppercase tracking-wider block">KURAL SEC-014 & BÖLÜM 8.8</span>
            <h3 class="text-sm font-black text-slate-900">Danışıklı Teklif & Risk Sinyalleri</h3>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div class="font-black flex items-center gap-1">
            <ShieldAlert :size="14" class="text-amber-600" />
            <span>İlke P-06 Hatırlatması:</span>
          </div>
          <p class="text-[11px] text-amber-800 leading-relaxed">
            Aynı IP veya cihaz tek başına hile kanıtı sayılmaz; doğrudan suçlama yapılmaz. Sistem risk skoru üretir, olayı denetim günlüğüne bayraklar ve insan incelemesine sunar.
          </p>
        </div>

        <div class="space-y-2.5 text-xs">
          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-500">
            PLATFORM TARAFINDAN İZLENEN RİSK ÖRÜNTÜLERİ:
          </h4>

          <div class="space-y-2">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 block text-xs">Aynı IP + Rakip Firma VKN'si</strong>
                <span class="text-[10px] text-slate-400">Aynı ağdan rakip tekliflerin verilmesi</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-red-100 text-red-800">Yüksek Öncelik</span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 block text-xs">Aynı Cihaz / Tarayıcı Parmak İzi</strong>
                <span class="text-[10px] text-slate-400">Farklı firmalarla oturum açma sıklığı</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">Orta Öncelik</span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong class="text-slate-800 block text-xs">Aşırı Hızlı Teklif Frekansı</strong>
                <span class="text-[10px] text-slate-400">Otomatik bot şüphesi ve rate limit aşımı</span>
              </div>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">Otomatik Limit</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MERKEZİ GÜVENLİK VE DENETİM GÜNLÜĞÜ (SEC-005, SEC-018) -->
    <div class="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">KURAL SEC-005 & SEC-018</span>
          <h3 class="text-base font-black text-slate-900">Merkezi Güvenlik Olayları Günlüğü (Audit Log)</h3>
          <p class="text-xs text-slate-400 mt-0.5">Admin dahil silinemez, değiştirilemez; zaman damgasıyla saklanır.</p>
        </div>

        <!-- Filtre Segmenti -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs flex-wrap">
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
            :class="selectedFilter === flt.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ flt.label }}
          </button>
        </div>
      </div>

      <!-- Tablo -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden text-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-slate-700 font-black border-b border-slate-200 text-[11px]">
              <tr>
                <th class="p-3">Olay ID & Zaman</th>
                <th class="p-3">Olay Türü</th>
                <th class="p-3">Şiddet</th>
                <th class="p-3">Kullanıcı / VKN</th>
                <th class="p-3">Alınan Aksiyon</th>
                <th class="p-3">Ayrıntı & Hedef Kaynak</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredEvents.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-400">
                  Filtreye uygun güvenlik olayı bulunamadı.
                </td>
              </tr>
              <tr
                v-for="evt in filteredEvents"
                :key="evt.id"
                class="hover:bg-slate-50/80 transition"
              >
                <td class="p-3 font-mono text-[11px]">
                  <strong class="text-slate-800 block">{{ evt.id }}</strong>
                  <span class="text-slate-400 text-[10px]">{{ new Date(evt.timestamp).toLocaleString('tr-TR') }}</span>
                </td>

                <td class="p-3">
                  <span class="font-bold text-slate-900 text-xs font-mono">{{ evt.eventType }}</span>
                </td>

                <td class="p-3">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-red-100 text-red-800': evt.severity === 'CRITICAL' || evt.severity === 'HIGH',
                      'bg-amber-100 text-amber-800': evt.severity === 'MEDIUM',
                      'bg-slate-100 text-slate-600': evt.severity === 'LOW'
                    }"
                  >
                    {{ evt.severity }}
                  </span>
                </td>

                <td class="p-3 text-slate-700">
                  <span class="font-bold block">{{ evt.actorEmail || 'Anonim' }}</span>
                  <span v-if="evt.actorVkn" class="font-mono text-[10px] text-slate-400 block">VKN: {{ evt.actorVkn }}</span>
                </td>

                <td class="p-3">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-black"
                    :class="{
                      'bg-red-50 text-red-700 border border-red-200': evt.actionTaken === 'BLOCKED_403',
                      'bg-amber-50 text-amber-700 border border-amber-200': evt.actionTaken === 'FLAGGED_FOR_REVIEW',
                      'bg-blue-50 text-blue-700 border border-blue-200': evt.actionTaken === 'RATE_LIMITED' || evt.actionTaken === 'MASKED',
                      'bg-emerald-50 text-emerald-700 border border-emerald-200': evt.actionTaken === 'ALLOWED'
                    }"
                  >
                    {{ evt.actionTaken }}
                  </span>
                </td>

                <td class="p-3 text-[11px] text-slate-600">
                  <span class="font-mono text-slate-500 block text-[10px]">{{ evt.targetResource || '-' }}</span>
                  <span class="text-slate-700 block">{{ evt.details?.message || evt.details?.reason || JSON.stringify(evt.details) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>
