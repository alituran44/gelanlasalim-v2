<script setup lang="ts">
import { ref, computed } from 'vue'
import { Inbox, Shield, ChevronDown, ChevronUp, Star, Clock, Building2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const expandedIlan = ref<string | null>(route.query.ilan as string || null)

const { cmsData } = useCmsData()

const ilanlar = computed(() => cmsData.value.dashboard.receivedBids || [])

function toggle(id: string) {
  expandedIlan.value = expandedIlan.value === id ? null : id
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto text-left space-y-6">

    <!-- Başlık + Gizlilik Notu -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          {{ 'Gelen Teklifler' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'İlanlarınıza gelen teklifler — sadece siz görebilirsiniz' }}
        </p>
      </div>

      <!-- Kapalı Zarf Bilgi Bandı -->
      <div
        class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold shrink-0 self-start sm:self-auto"
        style="background: rgba(0,48,87,0.06); color: #003057; border: 1px solid rgba(0,48,87,0.12);"
      >
        <Shield :size="14" style="color: #1EAE4C;" />
        <span>{{ 'Kapalı Zarf — Teklifler Gizlidir' }}</span>
      </div>
    </div>

    <!-- İlan Grupları -->
    <div class="space-y-3">
      <div
        v-for="ilan in ilanlar"
        :key="ilan.id"
        class="rounded-2xl border bg-white overflow-hidden shadow-xs"
        style="border-color: #E2E8F0;"
      >
        <!-- İlan Başlık Satırı -->
        <button
          @click="toggle(ilan.id)"
          class="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50/80 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style="background: rgba(30,58,95,0.06);"
            >
              <Inbox :size="18" style="color: #1E3A5F;" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-800">{{ ilan.baslik }}</h3>
              <p class="text-xs text-slate-400 mt-0.5 font-medium">
                {{ ilan.kategori }} • {{ 'Bitiş:' }} {{ ilan.bitis }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              style="background: rgba(245,158,11,0.1); color: #D97706;"
            >
              {{ ilan.teklifler.length }} {{ 'Teklif' }}
            </span>
            <ChevronDown v-if="expandedIlan !== ilan.id" :size="18" style="color: #94A3B8;" />
            <ChevronUp v-else :size="18" style="color: #94A3B8;" />
          </div>
        </button>

        <!-- Teklif Detayları (sadece ilan sahibine açık) -->
        <div v-if="expandedIlan === ilan.id" class="border-t" style="border-color: #F1F5F9;">
          <div class="px-5 py-3" style="background: #FFFBEB;">
            <div class="flex items-center gap-2 text-xs font-bold" style="color: #92400E;">
              <Shield :size="13" />
              <span>
                {{ 'Bu teklifler gizlidir. Tedarikçiler birbirlerinin tekliflerini göremez.' 
                }}
              </span>
            </div>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="teklif in ilan.teklifler"
              :key="teklif.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                  style="background: #003057;"
                >
                  {{ teklif.firma.charAt(0) }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-800">{{ teklif.firma }}</span>
                    <span class="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                      <Star :size="11" fill="#16A34A" class="text-emerald-600" />
                      {{ teklif.puan }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mt-0.5 text-xs text-slate-400 font-medium">
                    <span class="flex items-center gap-1"><Clock :size="11" /> {{ teklif.sure }} {{ 'teslimat' }}</span>
                    <span class="font-mono text-xs text-slate-400">{{ teklif.id }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 justify-between sm:justify-end">
                <span class="text-base font-black font-mono text-slate-900">{{ teklif.fiyat }}</span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :style="teklif.durum === 'onaylandi'
                    ? 'background: rgba(34,197,94,0.1); color: #16A34A;'
                    : 'background: rgba(148,163,184,0.12); color: #64748B;'"
                >
                  {{ teklif.durum === 'onaylandi' ? ('✓ Onaylandı') : ('Değerlendiriliyor') }}
                </span>
                <button
                  v-if="teklif.durum !== 'onaylandi'"
                  class="rounded-xl px-4 py-2 text-xs font-bold text-white transition cursor-pointer hover:bg-emerald-600"
                  style="background: #003057;"
                >
                  {{ 'Onayla' }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
