<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClipboardList, Plus, Clock, CheckCircle2, XCircle, Eye, Users } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const filter = ref<'all' | 'active' | 'closed'>('all')

const ilanlar = ref([
  {
    id: 'IHC-2024-001',
    baslik: 'Ofis Malzemeleri Alımı',
    kategori: 'Kırtasiye & Ofis',
    sure: '2 gün',
    teklifSayisi: 7,
    durum: 'active',
    butce: '₺45.000',
    olusturma: '14 Tem 2024'
  },
  {
    id: 'IHC-2024-002',
    baslik: 'Güvenlik Kamera Sistemi',
    kategori: 'Teknoloji & Yazılım',
    sure: '5 gün',
    teklifSayisi: 12,
    durum: 'active',
    butce: '₺180.000',
    olusturma: '12 Tem 2024'
  },
  {
    id: 'IHC-2024-003',
    baslik: 'Tarımsal Sulama Ekipmanı',
    kategori: 'Tarım & Gıda',
    sure: 'Sona erdi',
    teklifSayisi: 4,
    durum: 'closed',
    butce: '₺320.000',
    olusturma: '01 Tem 2024'
  },
  {
    id: 'IHC-2024-004',
    baslik: 'Lojistik Hizmet Alımı',
    kategori: 'Lojistik & Nakliye',
    sure: '10 gün',
    teklifSayisi: 3,
    durum: 'active',
    butce: '₺95.000',
    olusturma: '10 Tem 2024'
  },
])

const filtered = computed(() =>
  filter.value === 'all' ? ilanlar.value : ilanlar.value.filter(i => i.durum === filter.value)
)
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- Başlık -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold" style="color: #0F172A;">İlanlarım</h1>
        <p class="text-sm mt-0.5" style="color: #64748B;">Oluşturduğunuz ihale ilanlarını buradan yönetin</p>
      </div>
      <NuxtLink
        to="/panel/ihale-olustur"
        class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
        style="background: #1E3A5F;"
        onmouseover="this.style.background='#F59E0B'"
        onmouseout="this.style.background='#1E3A5F'"
      >
        <Plus :size="16" />
        Yeni İlan Oluştur
      </NuxtLink>
    </div>

    <!-- Filtre Sekmeleri -->
    <div class="flex gap-1 mb-5 rounded-lg p-1 w-fit" style="background: #F1F5F9;">
      <button
        v-for="tab in [{ key: 'all', label: 'Tümü' }, { key: 'active', label: 'Aktif' }, { key: 'closed', label: 'Kapandı' }]"
        :key="tab.key"
        @click="filter = tab.key as any"
        class="rounded-md px-4 py-1.5 text-sm font-medium transition"
        :style="filter === tab.key
          ? 'background: #1E3A5F; color: white;'
          : 'color: #64748B;'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- İlan Listesi -->
    <div class="space-y-3">
      <div
        v-for="ilan in filtered"
        :key="ilan.id"
        class="rounded-xl border bg-white p-5 transition hover:shadow-sm"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono" style="color: #94A3B8;">{{ ilan.id }}</span>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                :style="ilan.durum === 'active'
                  ? 'background: rgba(34,197,94,0.1); color: #16A34A;'
                  : 'background: rgba(148,163,184,0.15); color: #64748B;'"
              >
                <CheckCircle2 v-if="ilan.durum === 'active'" :size="11" />
                <XCircle v-else :size="11" />
                {{ ilan.durum === 'active' ? 'Aktif' : 'Kapandı' }}
              </span>
            </div>

            <h3 class="font-semibold" style="color: #0F172A;">{{ ilan.baslik }}</h3>
            <p class="text-sm mt-0.5" style="color: #64748B;">{{ ilan.kategori }}</p>
          </div>

          <div class="flex items-center gap-6 shrink-0 text-sm">
            <!-- Kalan Süre -->
            <div class="text-center">
              <div class="flex items-center gap-1" style="color: #0F172A;">
                <Clock :size="14" style="color: #F59E0B;" />
                <span class="font-semibold text-sm">{{ ilan.sure }}</span>
              </div>
              <div class="text-xs" style="color: #94A3B8;">Kalan Süre</div>
            </div>

            <!-- Teklif Sayısı -->
            <div class="text-center">
              <div class="flex items-center gap-1 font-semibold" style="color: #1E3A5F;">
                <Users :size="14" />
                {{ ilan.teklifSayisi }}
              </div>
              <div class="text-xs" style="color: #94A3B8;">Teklif</div>
            </div>

            <!-- Bütçe -->
            <div class="text-center">
              <div class="font-semibold text-sm" style="color: #0F172A;">{{ ilan.butce }}</div>
              <div class="text-xs" style="color: #94A3B8;">Bütçe</div>
            </div>

            <!-- Görüntüle -->
            <NuxtLink
              :to="`/panel/gelen-teklifler?ilan=${ilan.id}`"
              class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50"
              style="border-color: #E2E8F0; color: #475569;"
            >
              <Eye :size="13" />
              Teklifleri Gör
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-if="filtered.length === 0" class="rounded-xl border bg-white py-16 text-center" style="border-color: #E2E8F0;">
        <ClipboardList :size="40" class="mx-auto mb-3" style="color: #CBD5E1;" />
        <p class="font-medium" style="color: #0F172A;">Henüz ilan yok</p>
        <p class="text-sm mt-1" style="color: #94A3B8;">İlk ihalenizi oluşturmak için yukarıdaki butona tıklayın.</p>
      </div>
    </div>

  </div>
</template>
