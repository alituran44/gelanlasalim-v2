<script setup lang="ts">
import { ref } from 'vue'
import {
  Play,
  BookOpen,
  Sparkles,
  Zap,
  TrendingDown,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Upload,
  Search,
  Volume2
} from 'lucide-vue-next'
import VideoGuideModal from '~/components/common/VideoGuideModal.vue'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'Video Rehberler & Akademi — İhaleciBurada',
  description: 'İhaleciBurada B2B platformunun kullanımını 5 adımda anlatan görüntülü video simülasyonları ve rehberleri.',
  ogTitle: 'Video Rehberler & Akademi — İhaleciBurada',
  ogDescription: 'İhale açma, canlı eksiltmeye katılma, şartname yükleme ve kurumsal doğrulama video eğitimleri.'
})

const showModal = ref(false)
const selectedVideoId = ref('intro-3min')
const activeFilter = ref<'tumu' | 'alici' | 'satici' | 'guvenlik' | 'entegrasyon'>('tumu')

const videos = [
  {
    id: 'intro-3min',
    title: '3 Dakikada İhaleciBurada Tanıtımı',
    subtitle: 'Ters ihale modeli, canlı eksiltme kuralları ve ortalama %14.2 tedarik tasarrufu sağlama rehberi.',
    duration: '03:15',
    category: 'genel',
    badge: 'TEMEL BAŞLANGIÇ',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
    targetRoute: '/uyelik',
    targetLabel: 'Ücretsiz Başla',
    steps: [
      'Satın alma ihtiyacını şartnameyle sisteme girme',
      'Onaylı 150+ üreticiye anlık davet iletimi',
      'Canlı eksiltme arenasında anlık fiyat rekabeti',
      'Resmi sözleşme ve zaman damgalı güvenli teslimat'
    ]
  },
  {
    id: 'ihale-acma',
    title: 'İhale Nasıl Açılır & Şartname Yükleme',
    subtitle: 'Yeni ihale oluşturma sihirbazı, malzeme kalemi tanımlama, numune fotoğrafı ekleme ve bütçe belirleme.',
    duration: '02:40',
    category: 'alici',
    badge: 'ALICI REHBERİ',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    icon: Zap,
    targetRoute: '/panel/ihale-olustur',
    targetLabel: 'İhale Oluştur',
    steps: [
      'İhale başlığı ve sektör kategorisi seçimi',
      'Birim ve teknik şartname listesi hazırlama',
      'Numune ve teknik çizim fotoğrafları ekleme',
      'Son teklif süresini onaylayıp ihaleyi başlatma'
    ]
  },
  {
    id: 'teklif-verme',
    title: 'Nasıl Teklif Verilir & Canlı Eksiltme',
    subtitle: 'Tedarikçi olarak aktif ihaleleri filtreleme, birim fiyat teklifi hazırlama ve canlı arenada fiyat kırma.',
    duration: '02:50',
    category: 'satici',
    badge: 'TEDARİKÇİ REHBERİ',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    icon: TrendingDown,
    targetRoute: '/pazar-yeri',
    targetLabel: 'İhaleleri İncele',
    steps: [
      'Sektör ve şehre göre ihale arama',
      'Teknik şartname ve ürün fotoğraflarını inceleme',
      'Birim fiyat ve teslim süresi teklifi verme',
      'Geri sayım bitmeden anlık fiyat kırarak lider olma'
    ]
  },
  {
    id: 'kyc-dogrulama',
    title: 'Firma Doğrulama (KYC) & MERSİS/KEP',
    subtitle: 'GİB vergi levhası sorgulama, resmi evrak yükleme, e-Devlet entegrasyonu ve Onaylı Rozet alma.',
    duration: '02:15',
    category: 'guvenlik',
    badge: 'GÜVENLİK & ONAY',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    icon: ShieldCheck,
    targetRoute: '/firma-dogrulama',
    targetLabel: 'Doğrulama Yap',
    steps: [
      '10 haneli VKN / TCKN kontrolü',
      'Vergi Levhası ve İmza Sirküleri yükleme',
      'e-Devlet ile kurumsal imza yetkilisi doğrulaması',
      'Mavi Doğrulanmış Firma rozeti kazanma'
    ]
  },
  {
    id: 'erp-entegrasyon',
    title: 'ERP & Excel Entegrasyon Rehberi',
    subtitle: 'SAP, Logo, Microsoft Dynamics ve Excel ile satın alma taleplerini otomatik ihaleye dönüştürme.',
    duration: '02:30',
    category: 'entegrasyon',
    badge: 'KURUMSAL ENTEGRASYON',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    icon: Layers,
    targetRoute: '/entegrasyonlar',
    targetLabel: 'Entegrasyonu Aç',
    steps: [
      'ERP API ve Webhook bağlantılarını kurma',
      'SAP EBAN veya Logo malzeme taleplerini içe aktarma',
      'Excel tablosundan toplu malzeme listesi yükleme',
      'Kazanan teklifi otomatik PO siparişine dönüştürme'
    ]
  }
]

function openVideo(id: string) {
  selectedVideoId.value = id
  showModal.value = true
}

const filteredVideos = computed(() => {
  if (activeFilter.value === 'tumu') return videos
  return videos.filter(v => v.category === activeFilter.value)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 text-left font-sans selection:bg-blue-600 selection:text-white">
    <div class="max-w-7xl mx-auto space-y-12">
      
      <!-- HERO HEADER -->
      <div class="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div class="flex flex-wrap items-center justify-center gap-2">
          <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-blue-400">
            <BookOpen :size="14" />
            <span>İHALECİBURADA VİDEO AKADEMİ</span>
          </div>

          <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-400">
            <Volume2 :size="13" />
            <span>TÜRKÇE SESLENDİRME DESTEKLİ</span>
          </div>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Sitenin Kullanımı İçin <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">Video Rehberler</span>
        </h1>

        <p class="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
          İhaleciBurada platformunda ihale açma, teklif verme, canlı eksiltme arenası ve kurumsal doğrulama adımlarını interaktif video simülasyonlarıyla adım adım izleyin.
        </p>

        <!-- Category Filters -->
        <div class="flex flex-wrap justify-center gap-2 pt-4">
          <button
            v-for="cat in [
              { id: 'tumu', label: 'Tüm Videolar' },
              { id: 'alici', label: 'Alıcı Rehberi' },
              { id: 'satici', label: 'Tedarikçi Rehberi' },
              { id: 'guvenlik', label: 'Güvenlik & KYC' },
              { id: 'entegrasyon', label: 'ERP & Entegrasyon' }
            ]"
            :key="cat.id"
            @click="activeFilter = cat.id as any"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="activeFilter === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- FEATURED VIDEO SHOWCASE BANNER -->
      <div class="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <!-- Left: Big Thumbnail with Play Trigger -->
          <div
            @click="openVideo('intro-3min')"
            class="lg:col-span-7 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
              alt="3 Dakikada İhaleciBurada Tanıtımı"
              class="h-full w-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
            />
            <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl group-hover:scale-110 group-hover:bg-blue-500 transition duration-300">
                <Play :size="24" class="fill-white translate-x-0.5" />
              </div>
            </div>
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span class="text-[10px] font-black uppercase text-blue-300 bg-blue-950/90 px-3 py-1 rounded-lg border border-blue-800 backdrop-blur-xs">
                ÖNERİLEN BAŞLANGIÇ
              </span>
              <span class="text-xs font-mono font-bold text-white bg-slate-950/90 px-2.5 py-1 rounded-lg">
                03:15 HD
              </span>
            </div>
          </div>

          <!-- Right: Summary & Action -->
          <div class="lg:col-span-5 space-y-4 text-left">
            <span class="text-[10px] font-black uppercase tracking-widest text-amber-400">1. MODÜL · GENEL BAKIŞ</span>
            <h2 class="text-2xl font-black text-white tracking-tight">
              3 Dakikada İhaleciBurada Nasıl Çalışır?
            </h2>
            <p class="text-xs text-slate-300 leading-relaxed font-medium">
              Alıcı firmaların hiçbir komisyon ödemeden satın alma taleplerini yayınlamasını, onaylı üreticilerin anlık fiyat kırarak yarışmasını ve ortalama %14.2 tasarruf elde etmeyi canlı simülasyonla görün.
            </p>

            <div class="space-y-2 pt-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-400" />
                <span>Ters ihale ve canlı eksiltme çalışma prensibi</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-400" />
                <span>GİB ve MERSİS onaylı kurumsal tedarikçi havuzu</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 :size="14" class="text-emerald-400" />
                <span>Zaman damgalı teklif günlükleri ve tasarruf raporu</span>
              </div>
            </div>

            <div class="pt-4 flex items-center gap-3">
              <button
                @click="openVideo('intro-3min')"
                class="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-xs font-black text-white transition shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Play :size="14" class="fill-white" />
                <span>Simülasyonu İzle</span>
              </button>

              <NuxtLink
                to="/uyelik"
                class="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-3 text-xs font-bold text-slate-300 transition"
              >
                Ücretsiz Kaydol
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>

      <!-- ALL VIDEO MODULES GRID -->
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 class="text-xl font-black text-white tracking-tight">Tüm Eğitim Modülleri</h3>
          <span class="text-xs text-slate-400 font-mono">{{ filteredVideos.length }} Video Rehber</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="v in filteredVideos"
            :key="v.id"
            @click="openVideo(v.id)"
            class="group rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-blue-500/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video w-full overflow-hidden bg-slate-800">
              <img
                :src="v.thumbnail"
                :alt="v.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-108 opacity-80 group-hover:opacity-100"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/90 text-white shadow-xl group-hover:scale-110 group-hover:bg-blue-500 transition">
                  <Play :size="18" class="fill-white translate-x-0.5" />
                </div>
              </div>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span class="text-[9px] font-black uppercase text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60">
                  {{ v.badge }}
                </span>
                <span class="text-[9px] font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded">
                  {{ v.duration }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">
                  {{ v.title }}
                </h3>
                <p class="mt-2 text-xs text-slate-400 leading-relaxed font-medium">
                  {{ v.subtitle }}
                </p>

                <!-- Steps -->
                <div class="mt-4 space-y-1.5 pt-3 border-t border-slate-800/60 text-[11px] text-slate-300">
                  <div v-for="(s, idx) in v.steps" :key="idx" class="flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                    <span class="truncate">{{ s }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span class="flex items-center gap-1.5">
                  <Play :size="12" class="fill-current" />
                  Videoyu Başlat
                </span>
                <ArrowRight :size="14" class="transition group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Video Modal Player -->
    <VideoGuideModal
      v-model="showModal"
      :initial-video-id="selectedVideoId"
    />
  </div>
</template>
