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
            {{ 'Şirket Profiliniz Doğrulandı!' }}
          </h1>
          <p class="text-xs text-slate-500 font-medium mt-1">
            {{ `Tebrikler ${companyName}, tüm B2B ihale açma, teklif verme ve sözleşme süreçleriniz aktiftir.` }}
          </p>
        </div>
        <div class="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
          ✓ {{ 'Onaylı Üye' }}
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
                {{ 'KURUMSAL DOĞRULAMA' }}
              </span>
              <h2 class="text-lg font-black text-slate-800 leading-tight">
                {{ 'Kontrol paneliniz hazır; doğrulama bekleniyor.' }}
              </h2>
              <p class="text-xs text-slate-500 font-medium leading-relaxed">
                {{ 'Kurumsal ihale, teklif ve sözleşme işlemlerini başlatmak için şirket doğrulamanızı tamamlamanız gerekir.' 
                }}
              </p>
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider pt-2">
                {{ 'HESAP SAHİBİ:' }} {{ companyName }}
              </div>
            </div>
            
            <div class="h-10 w-10 shrink-0 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
              <ShieldAlert :size="20" />
            </div>
          </div>

          <!-- Tamamlanması Gerekenler Listesi -->
          <div class="rounded-2xl border bg-white p-6 shadow-xs space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">
              {{ 'TAMAMLANMASI GEREKENLER' }}
            </h3>
            
            <div class="divide-y divide-slate-100">
              
              <!-- 01: Şirket Kimliği -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">01</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Şirket kimliği' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Şirket temel bilgileri hazır.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
                </span>
              </div>

              <!-- 02: Fatura Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">02</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Fatura bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Fatura bilgileri hazır.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
                </span>
              </div>

              <!-- 03: IBAN Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">03</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'IBAN bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'TR / SWIFT IBAN bilgisi eklenebilir.' }}</p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ 'EKLE' }}
                </NuxtLink>
              </div>

              <!-- 04: Zorunlu Belgeler -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">04</span>
                  <div class="max-w-xs sm:max-w-md">
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Zorunlu belgeler (KYC)' }}</h4>
                    <p class="text-[10px] text-slate-400 leading-normal truncate sm:whitespace-normal">
                      {{ 'Vergi Levhası, Ticaret Sicil Gazetesi, İmza Sirküleri.' 
                      }}
                    </p>
                  </div>
                </div>
                <NuxtLink to="/firma-dogrulama" class="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-1.5 rounded-xl transition">
                  {{ 'YÜKLE' }}
                </NuxtLink>
              </div>

              <!-- 05: Yetkili Kişi Bilgileri -->
              <div class="flex items-center justify-between py-3.5">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 rounded-lg px-2 py-1 font-mono">05</span>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">{{ 'Yetkili kişi bilgileri' }}</h4>
                    <p class="text-[10px] text-slate-400 font-medium">{{ 'Yetkili kişi bilgileri kayıtlı.' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 :size="10" /> {{ 'TAMAMLANDI' }}
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
              {{ 'Doğrulamaya Git →' }}
            </NuxtLink>
            <button 
              type="button"
              @click="verified = true"
              class="w-full border rounded-xl py-3 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
              style="border-color: #E2E8F0; color: #64748B;"
            >
              {{ 'Hızlı İnceleme Modu (Demo)' }}
            </button>
            <p class="text-[9px] text-slate-400 leading-normal max-w-[220px] mx-auto">
              {{ 'Erteleme yalnızca bu hatırlatmayı giderir; ihale işlemleri doğrulama tamamlanana kadar kilitlidir.' 
              }}
            </p>
          </div>

          <!-- Verification Summary Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ 'DOĞRULAMA ÖZETİ' }}
            </h4>
            <span class="text-xs font-bold text-slate-700 block">
              {{ 'Tamamlanması gereken adımlar var' }}
            </span>
            <p class="text-[10px] text-slate-400 leading-relaxed bg-slate-50 border p-3 rounded-xl">
              {{ 'Evraklarınızı yükleyerek 1 iş günü içinde onay alabilirsiniz.' 
              }}
            </p>
          </div>

          <!-- Neler Etkilenir Card -->
          <div class="rounded-2xl border bg-white p-5 shadow-xs space-y-3" style="border-color: #E2E8F0;">
            <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {{ 'NELER ETKİLENİR?' }}
            </h4>
            
            <div class="space-y-2.5">
              
              <!-- Item 1: İhale Oluşturma -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'İhale oluşturma' }}</span>
              </div>

              <!-- Item 2: Teklif Verme -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'Teklif verme' }}</span>
              </div>

              <!-- Item 3: Sözleşme ve Teslimat -->
              <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div class="flex h-6 w-6 items-center justify-center rounded bg-amber-50 border border-amber-200 text-amber-500">
                  <Lock :size="12" />
                </div>
                <span class="text-xs font-bold text-slate-600">{{ 'Sözleşme ve teslimat takibi' }}</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
