<script setup lang="ts">
import { ref } from 'vue'
import { SendHorizonal, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const teklifler = ref([
  {
    id: 'TKF-008',
    ilanBaslik: 'Yazılım Geliştirme Hizmeti',
    aliciFirma: '****** A.Ş.',   // Gizli — sadece id gösterilir, isim kapatılır
    kategori: 'Teknoloji & Yazılım',
    teklifFiyatim: '₺95.000',
    sure: '45 gün',
    durum: 'bekliyor',
    tarih: '14 Tem 2024',
    bitisTarihi: '20 Tem 2024',
    notum: 'Teslim süresini 30 güne indirebilirim.'
  },
  {
    id: 'TKF-009',
    ilanBaslik: 'Tarımsal Gübre Tedariki',
    aliciFirma: '****** Ltd.',
    kategori: 'Tarım & Gıda',
    teklifFiyatim: '₺210.000',
    sure: '14 gün',
    durum: 'onaylandi',
    tarih: '10 Tem 2024',
    bitisTarihi: '18 Tem 2024',
    notum: 'ISO belgeli ürünler. Numune gönderebilirim.'
  },
  {
    id: 'TKF-010',
    ilanBaslik: 'Ofis Mobilyası Alımı',
    aliciFirma: '****** Grup',
    kategori: 'Kırtasiye & Ofis',
    teklifFiyatim: '₺78.500',
    sure: '21 gün',
    durum: 'reddedildi',
    tarih: '08 Tem 2024',
    bitisTarihi: '15 Tem 2024',
    notum: ''
  },
])

const durumConfig: Record<string, { label: string, icon: any, style: string }> = {
  bekliyor: { label: 'Değerlendiriliyor', icon: AlertCircle, style: 'background: rgba(245,158,11,0.1); color: #D97706;' },
  onaylandi: { label: 'Kabul Edildi ✓', icon: CheckCircle2, style: 'background: rgba(34,197,94,0.1); color: #16A34A;' },
  reddedildi: { label: 'Reddedildi', icon: XCircle, style: 'background: rgba(239,68,68,0.1); color: #DC2626;' },
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold" style="color: #0F172A;">Yaptığım Teklifler</h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Verdiğiniz tekliflerin durumunu takip edin</p>
    </div>

    <!-- Bilgi Notu -->
    <div
      class="flex items-center gap-2 rounded-lg px-4 py-3 mb-5 text-sm"
      style="background: rgba(30,58,95,0.05); border: 1px solid rgba(30,58,95,0.1); color: #1E3A5F;"
    >
      <Eye :size="15" style="color: #F59E0B;" />
      <span>Alıcı firma bilgileri gizlidir. Teklif kabul edildiğinde iletişim bilgileri açılır.</span>
    </div>

    <!-- Teklif Kartları -->
    <div class="space-y-3">
      <div
        v-for="teklif in teklifler"
        :key="teklif.id"
        class="rounded-xl border bg-white p-5 transition hover:shadow-sm"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-start justify-between gap-6">

          <div class="flex-1 min-w-0">
            <!-- İlan Başlığı -->
            <div class="flex items-center gap-2 mb-2">
              <SendHorizonal :size="15" style="color: #F59E0B;" />
              <span class="font-semibold text-sm" style="color: #0F172A;">{{ teklif.ilanBaslik }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs" style="color: #94A3B8;">
              <span>{{ teklif.kategori }}</span>
              <span>·</span>
              <span>Alıcı: <b style="color: #475569;">{{ teklif.aliciFirma }}</b></span>
              <span>·</span>
              <span class="font-mono">{{ teklif.id }}</span>
            </div>

            <!-- Not -->
            <p v-if="teklif.notum" class="mt-2 text-xs rounded-md px-3 py-2" style="background: #F8FAFC; color: #475569; border-left: 3px solid #E2E8F0;">
              "{{ teklif.notum }}"
            </p>
          </div>

          <!-- Sağ taraf -->
          <div class="flex flex-col items-end gap-3 shrink-0">
            <!-- Durum Badge -->
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              :style="durumConfig[teklif.durum].style"
            >
              <component :is="durumConfig[teklif.durum].icon" :size="12" />
              {{ durumConfig[teklif.durum].label }}
            </span>

            <!-- Fiyat + Süre -->
            <div class="text-right">
              <div class="text-lg font-bold" style="color: #1E3A5F;">{{ teklif.teklifFiyatim }}</div>
              <div class="flex items-center gap-1 text-xs" style="color: #94A3B8;">
                <Clock :size="11" />
                {{ teklif.sure }} teslimat
              </div>
            </div>

            <!-- Bitiş tarihi -->
            <div class="text-xs" style="color: #CBD5E1;">
              İlan bitiş: {{ teklif.bitisTarihi }}
            </div>
          </div>

        </div>
      </div>

      <!-- Boş durum -->
      <div
        v-if="teklifler.length === 0"
        class="rounded-xl border bg-white py-16 text-center"
        style="border-color: #E2E8F0;"
      >
        <SendHorizonal :size="40" class="mx-auto mb-3" style="color: #CBD5E1;" />
        <p class="font-medium" style="color: #0F172A;">Henüz teklif vermediniz</p>
        <p class="text-sm mt-1" style="color: #94A3B8;">Aktif ihaleleri inceleyerek teklif verebilirsiniz.</p>
      </div>

    </div>
  </div>
</template>
