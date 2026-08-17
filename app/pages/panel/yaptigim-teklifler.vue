<script setup lang="ts">
import { ref, computed } from 'vue'
import { SendHorizonal, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const { cmsData } = useCmsData()

const teklifler = computed(() => cmsData.value.dashboard.submittedBids || [])

const getDurumConfig = (durum: string) => {
  if (locale.value === 'en') {
    switch (durum) {
      case 'onaylandi':
        return { label: 'Accepted ✓', icon: CheckCircle2, style: 'background: rgba(34,197,94,0.1); color: #16A34A;' }
      case 'reddedildi':
        return { label: 'Rejected', icon: XCircle, style: 'background: rgba(239,68,68,0.1); color: #DC2626;' }
      default:
        return { label: 'Under Evaluation', icon: AlertCircle, style: 'background: rgba(245,158,11,0.1); color: #D97706;' }
    }
  } else {
    switch (durum) {
      case 'onaylandi':
        return { label: 'Kabul Edildi ✓', icon: CheckCircle2, style: 'background: rgba(34,197,94,0.1); color: #16A34A;' }
      case 'reddedildi':
        return { label: 'Reddedildi', icon: XCircle, style: 'background: rgba(239,68,68,0.1); color: #DC2626;' }
      default:
        return { label: 'Değerlendiriliyor', icon: AlertCircle, style: 'background: rgba(245,158,11,0.1); color: #D97706;' }
    }
  }
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto text-left space-y-6">

    <!-- Başlık -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          {{ 'Verdiğim Teklifler' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'İhalelere verdiğiniz tekliflerin durumunu ve sürecini takip edin' }}
        </p>
      </div>
    </div>

    <!-- Bilgi Notu -->
    <div
      class="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold"
      style="background: rgba(0,48,87,0.05); border: 1px solid rgba(0,48,87,0.1); color: #003057;"
    >
      <Eye :size="15" style="color: #1EAE4C;" class="shrink-0" />
      <span>
        {{ 'Alıcı firma bilgileri gizlidir. Teklif kabul edildiğinde iletişim bilgileri doğrudan açılır.' 
        }}
      </span>
    </div>

    <!-- Teklif Kartları -->
    <div class="space-y-3">
      <div
        v-for="teklif in teklifler"
        :key="teklif.id"
        class="rounded-2xl border bg-white p-5 transition hover:shadow-md shadow-xs"
        style="border-color: #E2E8F0;"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

          <div class="flex-1 min-w-0 space-y-2">
            <!-- İlan Başlığı -->
            <div class="flex items-center gap-2">
              <SendHorizonal :size="15" style="color: #1EAE4C;" class="shrink-0" />
              <span class="font-bold text-sm text-slate-800">{{ teklif.ilanBaslik }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <span>{{ teklif.kategori }}</span>
              <span>•</span>
              <span>{{ 'Alıcı:' }} <b class="text-slate-700 font-bold">{{ teklif.aliciFirma }}</b></span>
              <span>•</span>
              <span class="font-mono text-slate-400">{{ teklif.id }}</span>
            </div>

            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
              <Clock :size="13" class="text-slate-400" />
              <span>{{ 'Teslimat Süresi:' }} <strong>{{ teklif.teslimSuresi }}</strong></span>
              <span>•</span>
              <span>{{ 'Teklif Tarihi:' }} {{ teklif.tarih }}</span>
            </div>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
            <span class="text-lg font-black font-mono text-slate-900" style="color: #003057;">
              {{ teklif.verilenTeklif }}
            </span>

            <span
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              :style="getDurumConfig(teklif.durum).style"
            >
              <component :is="getDurumConfig(teklif.durum).icon" :size="12" />
              {{ getDurumConfig(teklif.durum).label }}
            </span>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
