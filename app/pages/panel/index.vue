<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Lock, 
  FileText, 
  Plus, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-vue-next'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

import StatsCards from "~/components/dashboard/StatsCards.vue"
import DashboardChart from "~/components/dashboard/DashboardChart.vue"
import QuickActions from "~/components/dashboard/QuickActions.vue"
import RecentTenders from "~/components/dashboard/RecentTenders.vue"
import RecentOffers from "~/components/dashboard/RecentOffers.vue"
import ActivityFeed from "~/components/dashboard/ActivityFeed.vue"
import Notifications from "~/components/dashboard/Notifications.vue"

const verified = ref(false)
const companyName = ref('Ali Turan')

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      verified.value = !!session.verified
      if (session.company) {
        companyName.value = session.company
      }
    } catch (e) {
      console.error('Error parsing session', e)
    }
  }
})
</script>

<template>
  <div>
    <!-- VERIFIED DASHBOARD (Normal Panel) -->
    <div v-if="verified" class="space-y-6">
      
      <!-- Hoşgeldin Bilgi Bandı -->
      <div class="rounded-2xl border bg-white p-6 shadow-xs flex items-center justify-between" style="border-color: #E2E8F0;">
        <div>
          <h1 class="text-base font-black flex items-center gap-2 text-slate-800 tracking-tight">
            <ShieldCheck class="text-emerald-500" :size="20" />
            {{ locale === 'tr' ? 'Şirket Profiliniz Doğrulandı!' : 'Corporate Profile Verified!' }}
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-1">
            {{ locale === 'tr' 
              ? `Tebrikler ${companyName}, tüm B2B ihale açma, teklif verme ve sözleşme süreçleriniz aktiftir.` 
              : `Welcome ${companyName}, all your B2B auction creation, bidding, and contract operations are active.` 
            }}
          </p>
        </div>
        <div class="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
          ✓ {{ locale === 'tr' ? 'Onaylı Üye' : 'Verified Member' }}
        </div>
      </div>

      <!-- İstatistik Kartları -->
      <StatsCards />

      <!-- Grafik + Hızlı İşlemler -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <DashboardChart />
        </div>
        <QuickActions />
      </div>

      <!-- Son İhaleler + Gelen Teklifler -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentTenders />
        <RecentOffers />
      </div>

      <!-- Aktivite + Bildirim -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityFeed />
        <Notifications />
      </div>
    </div>

    <!-- UNVERIFIED DASHBOARD (Verification Pending Panel) -->
    <div v-else class="max-w-6xl mx-auto space-y-6 text-left">
      
      <!-- Top banner + Steps Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Checklist and Status -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Welcome Status Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-xs flex items-start justify-between relative overflow-hidden" style="border-color: #E2E8F0;">
            <div class="space-y-2 max-w-md">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-black uppercase text-blue-600 tracking-wider">
                {{ locale === 'tr' ? 'KURUMSAL DOĞRULAMA' : 'CORPORATE VERIFICATION' }}
              </span>
              <h2 class="text-lg font-black text-slate-800 leading-tight">
                {{ locale === 'tr' ? 'Kontrol paneliniz hazır; doğrulama bekleniyor.' : 'Your dashboard is ready; verification pending.' }}
              </h2>
              <p class="text-xs text-slate-500 font-medium leading-relaxed">
                {{ locale === 'tr' 
                  ? 'Kurumsal ihale, teklif ve sözleşme işlemlerini başlatmak için şirket doğrulamanızı tamamlamanız gerekir.' 
                  : 'To start B2B auction creation and supplier bidding, please complete your corporate KYC verification.' 
                }}
              </p>
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider pt-2">
                {{ locale === 'tr' ? 'HESAP SAHİBİ:' : 'ACCOUNT OWNER:' }} {{ companyName }}
              </div>
            </div>
            
            <div class="h-10 w-10 shrink-0 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
              <ShieldAlert :size="20" />
            </div>
          </div>

          <!-- Tamamlanması Gerekenler Listesi -->
          <div class="rounded-2xl border bg-white p-6 shadow-xs space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">
              {{ locale === 'tr' ? 'TAMAMLANMASI GEREKENLER' : 'REQUIRED VERIFICATION STEPS' }}
            </h3>
            
            <div class="divide-y divide-slate-100">
              
              <!-- 01: Şirket Kimliği -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">01</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Şirket kimliği' : 'Company Identity' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ locale === 'tr' ? 'Şirket temel bilgileri hazır.' : 'Basic company credentials registered.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ locale === 'tr' ? 'TAMAMLANDI' : 'COMPLETED' }}
                </span>
              </div>

              <!-- 02: Fatura Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">02</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Fatura bilgileri' : 'Billing Information' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ locale === 'tr' ? 'Fatura bilgileri hazır.' : 'VAT tax details verified.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ locale === 'tr' ? 'TAMAMLANDI' : 'COMPLETED' }}
                </span>
              </div>

              <!-- 03: IBAN Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">03</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'IBAN bilgileri' : 'Bank IBAN Account' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ locale === 'tr' ? 'TR / SWIFT IBAN bilgisi eklenebilir.' : 'Bank IBAN account details.' }}</p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ locale === 'tr' ? 'EKLE' : 'ADD' }}
                </NuxtLink>
              </div>

              <!-- 04: Zorunlu Belgeler -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">04</span>
                  <div class="max-w-xs sm:max-w-md">
                    <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Zorunlu belgeler (KYC)' : 'Required KYC Documents' }}</h4>
                    <p class="text-[10px] text-slate-400 leading-normal truncate sm:whitespace-normal">
                      {{ locale === 'tr' 
                        ? 'Vergi Levhası, Ticaret Sicil Gazetesi, İmza Sirküleri.' 
                        : 'Tax Certificate, Trade Gazette, Signature Circulars.' 
                      }}
                    </p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ locale === 'tr' ? 'YÜKLE' : 'UPLOAD' }}
                </NuxtLink>
              </div>

              <!-- 05: Yetkili Kişi Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">05</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Yetkili kişi bilgileri' : 'Authorized Signatory Details' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ locale === 'tr' ? 'Yetkili kişi bilgileri kayıtlı.' : 'Authorized person registered.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ locale === 'tr' ? 'TAMAMLANDI' : 'COMPLETED' }}
                </span>
              </div>

            </div>
          </div>
        </div>

        <!-- Right Column: Verification Actions and Locks -->
        <div class="space-y-6">
          
          <!-- Action Box -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-4 text-center" style="border-color: #E2E8F0;">
            <NuxtLink 
              to="/firma-dogrulama"
              class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 shadow-lg shadow-blue-500/20 transition"
            >
              {{ locale === 'tr' ? 'Doğrulamaya Git →' : 'Complete Verification →' }}
            </NuxtLink>
            <button 
              type="button"
              @click="verified = true"
              class="w-full border rounded-xl py-3 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
              style="border-color: #E2E8F0; color: #64748B;"
            >
              {{ locale === 'tr' ? 'Hızlı İnceleme Modu (Demo)' : 'Quick Preview Mode (Demo)' }}
            </button>
            <p class="text-[9px] text-slate-400 leading-normal max-w-[220px] mx-auto">
              {{ locale === 'tr' 
                ? 'Erteleme yalnızca bu hatırlatmayı giderir; ihale işlemleri doğrulama tamamlanana kadar kilitlidir.' 
                : 'Demo preview unlocks dashboard widgets for evaluation.' 
              }}
            </p>
          </div>

          <!-- Verification Summary Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ locale === 'tr' ? 'DOĞRULAMA ÖZETİ' : 'VERIFICATION SUMMARY' }}
            </h4>
            <span class="text-xs font-bold text-slate-700 block">
              {{ locale === 'tr' ? 'Tamamlanması gereken adımlar var' : 'Pending verification requirements' }}
            </span>
            <p class="text-[10px] text-slate-400 leading-relaxed bg-slate-50 border p-3 rounded-xl">
              {{ locale === 'tr' 
                ? 'Evraklarınızı yükleyerek 1 iş günü içinde onay alabilirsiniz.' 
                : 'Upload required documents to complete KYC within 1 business day.' 
              }}
            </p>
          </div>

          <!-- Neler Etkilenir Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ locale === 'tr' ? 'NELER ETKİLENİR?' : 'LOCKED FEATURES' }}
            </h4>
            
            <div class="space-y-2.5">
              
              <!-- Item 1: İhale Oluşturma -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ locale === 'tr' ? 'İhale oluşturma' : 'Auction creation' }}</span>
              </div>

              <!-- Item 2: Teklif Verme -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ locale === 'tr' ? 'Teklif verme' : 'Submitting bids' }}</span>
              </div>

              <!-- Item 3: Sözleşme ve Teslimat -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ locale === 'tr' ? 'Sözleşme ve teslimat takibi' : 'Contract & delivery tracking' }}</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
