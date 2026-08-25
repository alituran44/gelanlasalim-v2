<script setup lang="ts">
import { ref } from 'vue'
import {
  Play,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Layers,
  FileSpreadsheet,
  Volume2
} from 'lucide-vue-next'
import VideoGuideModal from '~/components/common/VideoGuideModal.vue'

const showModal = ref(false)
const selectedVideoId = ref('intro-3min')

const guides = [
  {
    id: 'intro-3min',
    title: '3 Dakikada İhaleciBurada Tanıtımı',
    desc: 'Ters ihale modeli, canlı eksiltme mantığı ve %14.2 ortalama tedarik tasarrufu sağlama rehberi.',
    duration: '03:15',
    badge: 'TEMEL BAŞLANGIÇ',
    category: 'Ters İhale & B2B',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles
  },
  {
    id: 'ihale-acma',
    title: 'İhale Nasıl Açılır & Şartname Yüklenir?',
    desc: 'Teknik şartname oluşturma, malzeme kalemi ekleme ve numune görselleri yükleme adımları.',
    duration: '02:40',
    badge: 'ALICI REHBERİ',
    category: 'İhale Oluşturma',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    icon: Zap
  },
  {
    id: 'teklif-verme',
    title: 'Nasıl Teklif Verilir & Arenaya Katılınır?',
    desc: 'Tedarikçi olarak aktif ihaleleri filtreleme, birim fiyat girişi ve canlı eksiltmede fiyat kırma.',
    duration: '02:50',
    badge: 'TEDARİKÇİ REHBERİ',
    category: 'Teklif & Eksiltme',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    icon: TrendingDown
  },
  {
    id: 'kyc-dogrulama',
    title: 'Firma Doğrulama (KYC) & MERSİS Onayı',
    desc: 'Vergi levhası doğrulama, e-Devlet kurumsal kimlik entegrasyonu ve Onaylı Firma Rozeti.',
    duration: '02:15',
    badge: 'GÜVENLİK & ONAY',
    category: 'Doğrulama (KYC)',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    icon: ShieldCheck
  }
]

function openVideo(id: string) {
  selectedVideoId.value = id
  showModal.value = true
}
</script>

<template>
  <section class="bg-slate-950 py-20 relative overflow-hidden text-left border-t border-slate-800">
    <!-- Ambient glow -->
    <div class="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none"></div>

    <div class="mx-auto max-w-7xl px-6 relative z-10">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              <BookOpen :size="13" />
              İHALECİBURADA AKADEMİ
            </span>
            <span class="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Volume2 :size="12" />
              TÜRKÇE SESLENDİRMELİ
            </span>
          </div>
          <h2 class="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sitenin Kullanımı İçin Video Rehberler
          </h2>
          <p class="mt-2 text-sm text-slate-400 max-w-2xl font-medium">
            İhale açmaktan canlı eksiltmeye katılmaya, şartname yüklemekten kurumsal doğrulamaya kadar tüm adımları interaktif video simülasyonlarıyla izleyin.
          </p>
        </div>

        <button
          @click="openVideo('intro-3min')"
          class="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-xs font-black text-white transition shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Play :size="14" class="fill-white" />
          <span>Tüm Rehberleri İzle</span>
        </button>
      </div>

      <!-- Video Grid (4 Cards) -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="guide in guides"
          :key="guide.id"
          @click="openVideo(guide.id)"
          class="group rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <!-- Thumbnail Container -->
          <div class="relative aspect-video w-full overflow-hidden bg-slate-800">
            <img
              :src="guide.thumbnail"
              :alt="guide.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-108 opacity-80 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

            <!-- Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/90 text-white shadow-xl backdrop-blur-xs transition group-hover:scale-110 group-hover:bg-blue-500">
                <Play :size="18" class="fill-white translate-x-0.5" />
              </div>
            </div>

            <!-- Duration & Category Badge -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span class="text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                {{ guide.category }}
              </span>
              <span class="text-[9px] font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                {{ guide.duration }}
              </span>
            </div>
          </div>

          <!-- Body Info -->
          <div class="p-5 flex flex-col justify-between flex-1 space-y-3">
            <div>
              <div class="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-400 mb-1">
                <component :is="guide.icon" :size="12" />
                <span>{{ guide.badge }}</span>
              </div>
              <h3 class="text-sm font-bold text-white group-hover:text-blue-400 transition leading-snug">
                {{ guide.title }}
              </h3>
              <p class="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium">
                {{ guide.desc }}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>Simülasyonu Başlat</span>
              <ArrowRight :size="14" class="transition group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Interactive Video Guide Modal Component -->
    <VideoGuideModal
      v-model="showModal"
      :initial-video-id="selectedVideoId"
    />
  </section>
</template>
