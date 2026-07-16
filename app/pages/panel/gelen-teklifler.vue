<script setup lang="ts">
import { ref, computed } from 'vue'
import { Inbox, Shield, ChevronDown, ChevronUp, Star, Clock, Building2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const expandedIlan = ref<string | null>(route.query.ilan as string || null)

// Kapalı zarf modeli: Her ilan için teklifler sadece ilan sahibine görünür
// Tedarikçiler birbirlerinin tekliflerini GÖREMEZ
const ilanlar = ref([
  {
    id: 'IHC-2024-001',
    baslik: 'Ofis Malzemeleri Alımı',
    kategori: 'Kırtasiye & Ofis',
    bitis: '16 Tem 2024',
    teklifler: [
      { id: 'TKF-001', firma: 'ABC Ofis Malzemeleri A.Ş.', fiyat: '₺38.500', sure: '7 gün', puan: 4.8, durum: 'bekliyor' },
      { id: 'TKF-002', firma: 'Delta Kırtasiye Ltd.', fiyat: '₺41.200', sure: '5 gün', puan: 4.2, durum: 'bekliyor' },
      { id: 'TKF-003', firma: 'OfficePro Tedarik', fiyat: '₺36.900', sure: '10 gün', puan: 4.6, durum: 'onaylandi' },
    ]
  },
  {
    id: 'IHC-2024-002',
    baslik: 'Güvenlik Kamera Sistemi',
    kategori: 'Teknoloji & Yazılım',
    bitis: '21 Tem 2024',
    teklifler: [
      { id: 'TKF-004', firma: 'SecureTech Sistemleri', fiyat: '₺162.000', sure: '14 gün', puan: 4.9, durum: 'bekliyor' },
      { id: 'TKF-005', firma: 'Kamera Dünyası A.Ş.', fiyat: '₺175.000', sure: '7 gün', puan: 4.1, durum: 'bekliyor' },
    ]
  },
  {
    id: 'IHC-2024-004',
    baslik: 'Lojistik Hizmet Alımı',
    kategori: 'Lojistik & Nakliye',
    bitis: '26 Tem 2024',
    teklifler: [
      { id: 'TKF-006', firma: 'HızlıNakliye Ltd.', fiyat: '₺88.000', sure: '30 gün', puan: 4.7, durum: 'bekliyor' },
    ]
  },
])

function toggle(id: string) {
  expandedIlan.value = expandedIlan.value === id ? null : id
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- Başlık + Gizlilik Notu -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold" style="color: #0F172A;">Gelen Teklifler</h1>
        <p class="text-sm mt-0.5" style="color: #64748B;">İlanlarınıza gelen teklifler — sadece siz görebilirsiniz</p>
      </div>

      <!-- Kapalı Zarf Bilgi Bandı -->
      <div
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
        style="background: rgba(30,58,95,0.06); color: #1E3A5F; border: 1px solid rgba(30,58,95,0.12);"
      >
        <Shield :size="14" style="color: #F59E0B;" />
        Kapalı Zarf — Teklifler Gizlidir
      </div>
    </div>

    <!-- İlan Grupları -->
    <div class="space-y-3">
      <div
        v-for="ilan in ilanlar"
        :key="ilan.id"
        class="rounded-xl border bg-white overflow-hidden"
        style="border-color: #E2E8F0;"
      >
        <!-- İlan Başlık Satırı -->
        <button
          @click="toggle(ilan.id)"
          class="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              style="background: rgba(30,58,95,0.06);"
            >
              <Inbox :size="18" style="color: #1E3A5F;" />
            </div>
            <div>
              <h3 class="font-semibold text-sm" style="color: #0F172A;">{{ ilan.baslik }}</h3>
              <p class="text-xs mt-0.5" style="color: #94A3B8;">{{ ilan.kategori }} · Bitiş: {{ ilan.bitis }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              style="background: rgba(245,158,11,0.1); color: #D97706;"
            >
              {{ ilan.teklifler.length }} Teklif
            </span>
            <ChevronDown v-if="expandedIlan !== ilan.id" :size="18" style="color: #94A3B8;" />
            <ChevronUp v-else :size="18" style="color: #94A3B8;" />
          </div>
        </button>

        <!-- Teklif Detayları (sadece ilan sahibine açık) -->
        <div v-if="expandedIlan === ilan.id" class="border-t" style="border-color: #F1F5F9;">
          <div class="px-5 py-3" style="background: #FFFBEB;">
            <div class="flex items-center gap-2 text-xs font-medium" style="color: #92400E;">
              <Shield :size="13" />
              Bu teklifler gizlidir. Tedarikçiler birbirlerinin tekliflerini göremez.
            </div>
          </div>

          <div class="divide-y" style="border-color: #F1F5F9;">
            <div
              v-for="teklif in ilan.teklifler"
              :key="teklif.id"
              class="flex items-center justify-between px-5 py-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style="background: #1E3A5F;"
                >
                  {{ teklif.firma.charAt(0) }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold" style="color: #0F172A;">{{ teklif.firma }}</span>
                    <span class="flex items-center gap-0.5 text-xs" style="color: #F59E0B;">
                      <Star :size="11" fill="#F59E0B" />
                      {{ teklif.puan }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mt-0.5 text-xs" style="color: #94A3B8;">
                    <span class="flex items-center gap-1"><Clock :size="11" /> {{ teklif.sure }} teslimat</span>
                    <span class="font-mono text-xs" style="color: #CBD5E1;">{{ teklif.id }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <span class="text-base font-bold" style="color: #1E3A5F;">{{ teklif.fiyat }}</span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-medium"
                  :style="teklif.durum === 'onaylandi'
                    ? 'background: rgba(34,197,94,0.1); color: #16A34A;'
                    : 'background: rgba(148,163,184,0.12); color: #64748B;'"
                >
                  {{ teklif.durum === 'onaylandi' ? '✓ Onaylandı' : 'Değerlendiriliyor' }}
                </span>
                <button
                  v-if="teklif.durum !== 'onaylandi'"
                  class="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition"
                  style="background: #1E3A5F;"
                  onmouseover="this.style.background='#F59E0B'"
                  onmouseout="this.style.background='#1E3A5F'"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
