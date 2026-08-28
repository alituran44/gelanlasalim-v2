<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Clock,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Building,
  Upload,
  ArrowRight,
  TrendingDown,
  Layers,
  FileSpreadsheet
} from 'lucide-vue-next'

export interface VideoGuide {
  id: string
  title: string
  subtitle: string
  duration: string
  totalSeconds: number
  badge: string
  category: 'genel' | 'alici' | 'satici' | 'guvenlik' | 'entegrasyon'
  targetRoute: string
  targetLabel: string
  thumbnailUrl: string
  chapters: {
    title: string
    startSeconds: number
    description: string
    subtitleText: string
  }[]
  checklist: string[]
}

const props = defineProps<{
  modelValue: boolean
  initialVideoId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// Video Catalogue
const videoCatalogue: VideoGuide[] = [
  {
    id: 'intro-3min',
    title: '3 Dakikada İhaleciBurada Rehberi',
    subtitle: 'Ters ihale modeli, ihale ve satın alma mantığı ve %14.2 ortalama tedarik tasarrufu sağlama adımları.',
    duration: '03:15',
    totalSeconds: 195,
    badge: 'TEMEL BAŞLANGIÇ',
    category: 'genel',
    targetRoute: '/uyelik',
    targetLabel: 'Hemen Ücretsiz Başla',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    chapters: [
      {
        title: 'Bölüm 1: Satın Alma İhtiyacını Dijitalleştirme',
        startSeconds: 0,
        description: 'Alıcı firmanın satın almak istediği hammadde, ürün veya hizmeti şartnameyle sisteme girmesi.',
        subtitleText: 'İhaleciBurada platformunda alıcı şirketler hiçbir komisyon ödemeden satın alma talebini dakikalar içinde yayınlar.'
      },
      {
        title: 'Bölüm 2: Doğrulanmış Tedarikçi Eşleşmesi',
        startSeconds: 45,
        description: 'Sistemdeki 150+ onaylı üretici ve satıcıya anlık e-posta ve SMS ile ihale daveti iletilir.',
        subtitleText: 'Tüm tedarikçiler GİB vergi levhası ve MERSİS kayıtlarından onaylanmış güvenilir kurumsal firmalardır.'
      },
      {
        title: 'Bölüm 3: İhale ve Satın Alma Arenasında Rekabet',
        startSeconds: 100,
        description: 'Tedarikçiler geri sayım süresince anlık fiyat kırarak en avantajlı teklifi sunmak için yarışır.',
        subtitleText: 'Fiyatlar şeffaf şekilde anlık düşer; alıcı bütçesine en uygun optimum maliyet koşuluna kolayca ulaşır.'
      },
      {
        title: 'Bölüm 4: Sözleşme & Güvenli Teslimat',
        startSeconds: 150,
        description: 'En iyi teklif veren firma seçilir, resmi sözleşme oluşturulur ve teslimat süreci izlenir.',
        subtitleText: 'Zaman damgalı işlem izleri ve hukuki sözleşmelerle ticaret güvenle tamamlanır.'
      }
    ],
    checklist: [
      'Alıcı ve satıcı rolleri için tek hesap üzerinden işlem yapabilme',
      'Canlı tersine ihale geri sayımını gerçek zamanlı izleme',
      'Kurumsal onaylı firma profillerini inceleme',
      'Zaman damgalı teklif geçmişi ve tasarruf raporu alma'
    ]
  },
  {
    id: 'ihale-acma',
    title: 'İhale Nasıl Açılır & Şartname Yüklenir?',
    subtitle: 'Adım adım yeni ihale oluşturma sihirbazı, malzeme kalemi ekleme ve numune görselleri yükleme.',
    duration: '02:40',
    totalSeconds: 160,
    badge: 'ALICI REHBERİ',
    category: 'alici',
    targetRoute: '/panel/ihale-olustur',
    targetLabel: 'Yeni İhale Oluştur',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    chapters: [
      {
        title: 'Adım 1: İhale Başlığı ve Kategori Seçimi',
        startSeconds: 0,
        description: 'İhale türünü (Mal, Hizmet, Yapım) ve ilgili sektörü belirleyin.',
        subtitleText: 'Öncelikle ihalenin konusunu net bir başlıkla tanımlayın ve doğru tedarikçilere ulaşmak için sektör kategorisini seçin.'
      },
      {
        title: 'Adım 2: Teknik Şartname & Malzeme Listesi',
        startSeconds: 40,
        description: 'Malzeme kalemlerini, birimlerini (Adet, Kg, Metre) ve teknik kriterleri girin.',
        subtitleText: 'Her malzeme kalemi için birim miktarını yazın veya varsa mevcut PDF/Excel şartnamenizi tek tıkla yükleyin.'
      },
      {
        title: 'Adım 3: Numune ve Ürün Fotoğrafları Ekleme',
        startSeconds: 85,
        description: 'İhaleye ilişkin teknik çizim, numune veya ürün fotoğraflarını yükleyin.',
        subtitleText: 'Fotoğraf eklemek tedarikçilerin doğru ürün için en net fiyatı vermesini sağlar ve teklif kalitesini artırır.'
      },
      {
        title: 'Adım 4: Hedef Bütçe, Süre & Yayınlama',
        startSeconds: 120,
        description: 'İhale bitiş tarihini, eksiltme süresini ve tahmini bütçeyi onaylayıp ihaleyi başlatın.',
        subtitleText: 'İhaleyi yayınladığınız anda sistem onaylı tedarikçilere anında bildirim gönderir ve teklif süreci başlar.'
      }
    ],
    checklist: [
      'İhale başlığı ve net kategori tanımlaması',
      'Birim bazında malzeme listesi veya teknik şartname yükleme',
      'Teknik çizim ve numune fotoğraflarının eklenmesi',
      'Son teklif verme süresinin ve eksiltme kurallarının belirlenmesi'
    ]
  },
  {
    id: 'teklif-verme',
    title: 'Nasıl Teklif Verilir & Arenaya Katılınır?',
    subtitle: 'Tedarikçi olarak aktif ihaleleri filtreleme, şartname inceleme ve ihale ve satın almade fiyat kırma.',
    duration: '02:50',
    totalSeconds: 170,
    badge: 'TEDARİKÇİ REHBERİ',
    category: 'satici',
    targetRoute: '/pazar-yeri',
    targetLabel: 'İhaleleri İncele',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    chapters: [
      {
        title: 'Adım 1: Sektör ve Şehir Bazlı Arama',
        startSeconds: 0,
        description: 'Pazaryerinde firmanızın faaliyet gösterdiği alandaki aktif ihaleleri bulun.',
        subtitleText: 'Filtreler yardımıyla kendi sektörünüzdeki, şehrinizdeki ve teslimat kapasitenize uygun ihaleleri listeleyin.'
      },
      {
        title: 'Adım 2: Şartname ve Numune İncelemesi',
        startSeconds: 45,
        description: 'Alıcının yayınladığı teknik şartnameyi, malzeme tablosunu ve fotoğrafları inceleyin.',
        subtitleText: 'Teknik şartname sekmesinden kalite kriterlerini, idari şartnameden ise ödeme ve teslimat koşullarını kontrol edin.'
      },
      {
        title: 'Adım 3: Birim Fiyat Teklifini Hazırlama',
        startSeconds: 90,
        description: 'Her kalem için birim fiyatınızı girin; sistem toplam teklif bedelini otomatik hesaplasın.',
        subtitleText: 'Birim fiyatlarınızı yazdığınızda KDV dahil toplam teklif tutarı ve teslim süresi taahhüdünüz oluşturulur.'
      },
      {
        title: 'Adım 4: İhale ve Satın Alma Arenasında Yarışma',
        startSeconds: 130,
        description: 'Geri sayım biterken rakiplerinizin önüne geçmek için teklifinizi anlık olarak güncelleyin.',
        subtitleText: 'Yeşil liderlik rozetini korumak için ihale ve satın alma ekranında rekabetçi teklifinizi verin ve ihaleyi kazanın.'
      }
    ],
    checklist: [
      'Gelişmiş arama motoru ile sektörel ihale filtreleme',
      'Teknik şartname ve ürün fotoğraflarını detaylı inceleme',
      'Birim maliyet ve teslimat süresi teklif girişi',
      'Canlı eksiltme süresince anlık fiyat kırarak liderliği alma'
    ]
  },
  {
    id: 'kyc-dogrulama',
    title: 'Firma Doğrulama (KYC) & MERSİS Onayı',
    subtitle: 'Vergi levhası doğrulama, e-Devlet kurumsal kimlik entegrasyonu ve Onaylı Tedarikçi Rozeti.',
    duration: '02:15',
    totalSeconds: 135,
    badge: 'GÜVENLİK & ONAY',
    category: 'guvenlik',
    targetRoute: '/firma-dogrulama',
    targetLabel: 'Firmamı Doğrula',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    chapters: [
      {
        title: 'Adım 1: Vergi Kimlik No (VKN) Doğrulama',
        startSeconds: 0,
        description: '10 haneli VKN veya 11 haneli TCKN girerek GİB algoritma kontrolünü başlatın.',
        subtitleText: 'Sistem Gelir İdaresi Başkanlığı algoritması ile vergi numaranızın faal mükellefiyet durumunu anlık doğrular.'
      },
      {
        title: 'Adım 2: Kurumsal Evrak Yükleme',
        startSeconds: 35,
        description: 'Son yıla ait Vergi Levhası, İmza Sirküleri ve Ticaret Sicil Gazetesi yükleyin.',
        subtitleText: 'PDF veya görsel formatındaki resmi evraklarınız şifreli ortamda güvenlik denetim uzmanlarımızca incelenir.'
      },
      {
        title: 'Adım 3: e-Devlet & MERSİS Otomatik Eşleşmesi',
        startSeconds: 75,
        description: 'e-Devlet Kapısı kurumsal kimlik doğrulaması ile yetkili imza sahibini teyit edin.',
        subtitleText: 'e-Devlet SSO entegrasyonu sayesinde evrak bekleme süresi ortadan kalkar ve şirketiniz anında onaylanır.'
      },
      {
        title: 'Adım 4: Mavi Onaylı Rozet & Güven Endeksi',
        startSeconds: 105,
        description: 'Onaylı rozetiniz profilinize eklenir ve ihale açma/teklif verme yetkileriniz aktif olur.',
        subtitleText: 'Doğrulanmış kurumsal rozet, diğer alıcı ve satıcılar nezdinde güvenilirlik puanınızı en üst seviyeye taşır.'
      }
    ],
    checklist: [
      'GİB ve MERSİS faal mükellefiyet sorgulama',
      'Resmi evrak (Vergi Levhası, İmza Sirküleri) yükleme',
      'e-Devlet Kapısı ile anında yetkili kimlik doğrulaması',
      'Profilde Mavi Doğrulanmış Firma rozeti kazanma'
    ]
  },
  {
    id: 'erp-entegrasyon',
    title: 'ERP & Excel Entegrasyon Rehberi',
    subtitle: 'SAP, Logo, Microsoft Dynamics ve Excel ile satın alma taleplerini tek tıkla ihaleye dönüştürme.',
    duration: '02:30',
    totalSeconds: 150,
    badge: 'KURUMSAL ENTEGRASYON',
    category: 'entegrasyon',
    targetRoute: '/entegrasyonlar',
    targetLabel: 'Entegrasyonları Yönet',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    chapters: [
      {
        title: 'Adım 1: ERP Sistemini Bağlama (SAP / Logo / Dynamics)',
        startSeconds: 0,
        description: 'Kurumsal ERP sisteminizin API ve Webhook bağlantılarını ayarlayın.',
        subtitleText: 'İhaleciBurada REST API ve önceden tanımlı ERP bağlayıcıları ile kurumsal sisteminizi dakikalar içinde bağlayın.'
      },
      {
        title: 'Adım 2: Satın Alma Taleplerini (PR) İçe Aktarma',
        startSeconds: 45,
        description: 'ERP üzerindeki onaylanmış PR taleplerini otomatik ihale taslağına dönüştürün.',
        subtitleText: 'SAP EBAN veya Logo malzeme talepleri tek tıkla malzeme kalemleri ve teknik detaylarıyla ihaleye aktarılır.'
      },
      {
        title: 'Adım 3: Excel ile Toplu Malzeme Yükleme',
        startSeconds: 90,
        description: 'Binlerce satırlık malzeme listesini Excel/CSV şablonuyla saniyeler içinde yükleyin.',
        subtitleText: 'Standart Excel formatındaki listenizi sürükleyip bırakın; sistem malzeme adlarını, birimlerini ve miktarlarını anında ayrıştırsın.'
      },
      {
        title: 'Adım 4: Teklif Sonuçlarını ERP ye Geri Yazma',
        startSeconds: 125,
        description: 'İhale sonucunda en uygun teklifi veren tedarikçi ve birim fiyatlar otomatik PO (Satın Alma Siparişi) olarak ERP ye aktarılır.',
        subtitleText: 'İhale tamamlandığında kazanan teklif ve birim fiyatlar otomatik olarak ERP sisteminizde sipariş kaydına dönüştürülür.'
      }
    ],
    checklist: [
      'SAP PR ve Logo Tiger malzeme taleplerini otomatik çekme',
      'Excel dosyasından toplu ihale kalemi ayrıştırma',
      'API anahtarı ve Webhook entegrasyon ayarları',
      'Sonuçlanan ihalelerin otomatik PO siparişine dönüştürülmesi'
    ]
  }
]

const selectedVideoId = ref<string>(props.initialVideoId || 'intro-3min')
const isPlaying = ref(true)
const currentTime = ref(0)
const playbackSpeed = ref<number>(1)
const isMuted = ref(false)
const activeTab = ref<'simulation' | 'script' | 'checklist'>('simulation')

// Voiceover State
const voiceoverEnabled = ref(true)
const isSpeaking = ref(false)
const speechSynthesisVoice = ref<SpeechSynthesisVoice | null>(null)
const lastSpokenKey = ref<string>('')

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const voices = window.speechSynthesis.getVoices()
  const trVoice = voices.find(v => v.lang === 'tr-TR' || v.lang.startsWith('tr'))
  if (trVoice) {
    speechSynthesisVoice.value = trVoice
  }
}

function speakCurrentNarration(force = false) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  if (!voiceoverEnabled.value || isMuted.value || !isPlaying.value) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }

  const text = currentChapter.value.subtitleText
  const currentKey = `${selectedVideoId.value}-${currentChapter.value.index}-${text}`

  if (!force && lastSpokenKey.value === currentKey && isSpeaking.value) {
    return
  }

  lastSpokenKey.value = currentKey
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = playbackSpeed.value
  utterance.pitch = 1.02
  if (speechSynthesisVoice.value) {
    utterance.voice = speechSynthesisVoice.value
  }

  utterance.onstart = () => {
    isSpeaking.value = true
  }
  utterance.onend = () => {
    isSpeaking.value = false
  }
  utterance.onerror = () => {
    isSpeaking.value = false
  }

  window.speechSynthesis.speak(utterance)
}

function toggleVoiceover() {
  voiceoverEnabled.value = !voiceoverEnabled.value
  if (voiceoverEnabled.value) {
    speakCurrentNarration(true)
  } else {
    stopVoiceover()
  }
}

function stopVoiceover() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  isSpeaking.value = false
}

let timerInterval: any = null

const currentVideo = computed<VideoGuide>(() => {
  return videoCatalogue.find(v => v.id === selectedVideoId.value) || videoCatalogue[0]
})

const currentChapter = computed(() => {
  const chapters = currentVideo.value.chapters
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (currentTime.value >= chapters[i].startSeconds) {
      return { ...chapters[i], index: i }
    }
  }
  return { ...chapters[0], index: 0 }
})

const formattedCurrentTime = computed(() => {
  const mins = Math.floor(currentTime.value / 60).toString().padStart(2, '0')
  const secs = Math.floor(currentTime.value % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
})

const progressPercent = computed(() => {
  if (!currentVideo.value.totalSeconds) return 0
  return Math.min(100, (currentTime.value / currentVideo.value.totalSeconds) * 100)
})

function selectVideo(id: string) {
  selectedVideoId.value = id
  currentTime.value = 0
  isPlaying.value = true
  lastSpokenKey.value = ''
  setTimeout(() => {
    speakCurrentNarration(true)
  }, 100)
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (!isPlaying.value) {
    stopVoiceover()
  } else {
    speakCurrentNarration(true)
  }
}

function restartVideo() {
  currentTime.value = 0
  isPlaying.value = true
  lastSpokenKey.value = ''
  setTimeout(() => {
    speakCurrentNarration(true)
  }, 100)
}

function seekTo(seconds: number) {
  currentTime.value = Math.max(0, Math.min(seconds, currentVideo.value.totalSeconds))
  lastSpokenKey.value = ''
  setTimeout(() => {
    speakCurrentNarration(true)
  }, 100)
}

function handleProgressBarClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const ratio = clickX / rect.width
  seekTo(ratio * currentVideo.value.totalSeconds)
}

function changeSpeed(speed: number) {
  playbackSpeed.value = speed
  if (isSpeaking.value) {
    speakCurrentNarration(true)
  }
}

function closeModal() {
  isPlaying.value = false
  stopVoiceover()
  emit('update:modelValue', false)
}

// Timer Simulation Loop
onMounted(() => {
  initVoices()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = initVoices
  }

  timerInterval = setInterval(() => {
    if (isPlaying.value && props.modelValue) {
      if (currentTime.value >= currentVideo.value.totalSeconds) {
        currentTime.value = 0 // Loop or stop
      } else {
        currentTime.value += 1 * playbackSpeed.value
      }
    }
  }, 1000)

  if (props.modelValue && isPlaying.value) {
    speakCurrentNarration(true)
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  stopVoiceover()
})

// Watch chapter change for auto voice narration
watch(() => currentChapter.value.index, () => {
  if (isPlaying.value && props.modelValue) {
    speakCurrentNarration()
  }
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    isPlaying.value = true
    setTimeout(() => {
      speakCurrentNarration(true)
    }, 150)
  } else {
    stopVoiceover()
  }
})

watch(() => props.initialVideoId, (newVal) => {
  if (newVal) {
    selectedVideoId.value = newVal
    currentTime.value = 0
    isPlaying.value = true
    lastSpokenKey.value = ''
    setTimeout(() => {
      speakCurrentNarration(true)
    }, 150)
  }
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="relative w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left">
        
        <!-- TOP MODAL HEADER -->
        <header class="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen :size="18" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-blue-400">İhaleciBurada Akademi</span>
                <span class="rounded-md bg-blue-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-300 border border-blue-500/20">
                  {{ currentVideo.badge }}
                </span>
              </div>
              <h2 class="text-sm sm:text-base font-black text-white tracking-tight">
                {{ currentVideo.title }}
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              :to="currentVideo.targetRoute"
              @click="closeModal"
              class="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              <span>{{ currentVideo.targetLabel }}</span>
              <ArrowRight :size="14" />
            </NuxtLink>

            <button
              @click="closeModal"
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
            >
              <X :size="18" />
            </button>
          </div>
        </header>

        <!-- MAIN CONTENT: VIDEO PLAYER + PLAYLIST SIDEBAR -->
        <div class="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          <!-- LEFT / MAIN: INTERACTIVE ANIMATED SIMULATION PLAYER (8 cols) -->
          <div class="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
            
            <!-- STAGE SCREEN: INTERACTIVE SIMULATION CANVAS -->
            <div class="relative aspect-video w-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none border-b border-slate-800/80">
              
              <!-- Subtle Background Tech Grid -->
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none"></div>
              <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              <!-- Top Bar of Screen: Browser / App Frame -->
              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                  <span class="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                  <span class="ml-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
                    ihaleciburada.com/{{ currentVideo.category }}/canli-rehber
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[9px] font-black text-red-400 border border-red-500/30 animate-pulse">
                    <span class="h-1.5 w-1.5 rounded-full bg-red-400"></span> CANLI SİMÜLASYON
                  </span>
                </div>
              </div>

              <!-- CENTER STAGE: DYNAMIC ANIMATED WORKFLOW BASED ON CURRENT VIDEO & CHAPTER -->
              <div class="relative z-10 my-auto flex flex-col items-center justify-center p-2 text-center">
                
                <!-- ANIMATION 1: INTRO 3 MIN -->
                <div v-if="currentVideo.id === 'intro-3min'" class="w-full max-w-md space-y-3">
                  <div class="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md text-left transition-all duration-500">
                    <div class="flex items-center justify-between text-xs mb-2">
                      <span class="font-bold text-white flex items-center gap-2">
                        <Sparkles class="text-amber-400" :size="14" />
                        Ters İhale: Fason Metal İşleme
                      </span>
                      <span class="font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Kalan: {{ Math.max(0, 30 - Math.floor(currentTime % 30)) }}s
                      </span>
                    </div>

                    <!-- Live Bids Simulation -->
                    <div class="space-y-2 text-[11px]">
                      <div class="flex items-center justify-between bg-slate-800/80 p-2 rounded-xl border border-emerald-500/40">
                        <div class="flex items-center gap-2">
                          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950">1</span>
                          <span class="font-bold text-white">Tedarikçi #A47 (Doğrulanmış)</span>
                        </div>
                        <span class="font-mono font-black text-emerald-400">
                          ₺{{ (396000 - (Math.floor(currentTime * 120) % 15000)).toLocaleString('tr-TR') }}
                        </span>
                      </div>

                      <div class="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-slate-400">
                        <div class="flex items-center gap-2">
                          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[9px] font-bold text-slate-400">2</span>
                          <span>Tedarikçi #B12</span>
                        </div>
                        <span class="font-mono">₺408.000</span>
                      </div>
                    </div>

                    <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                      <span class="text-slate-400">Açılış: ₺425.000</span>
                      <span class="font-black text-amber-400">Tasarruf: %14.2 (₺59.000 ₺)</span>
                    </div>
                  </div>
                </div>

                <!-- ANIMATION 2: İHALE AÇMA -->
                <div v-else-if="currentVideo.id === 'ihale-acma'" class="w-full max-w-md space-y-3">
                  <div class="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md text-left transition-all">
                    <div class="flex items-center gap-2 text-xs font-black text-blue-400 mb-2">
                      <Upload :size="14" />
                      <span>İhale Oluşturma Sihirbazı (Adım {{ currentChapter.index + 1 }}/4)</span>
                    </div>
                    <div class="space-y-2 text-[11px]">
                      <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-[9px] text-slate-400 block font-bold uppercase">İHALE BAŞLIĞI</span>
                        <span class="text-white font-bold">50.000 Adet Baskılı E-Ticaret Kutusu Alımı</span>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                          <span class="text-[9px] text-slate-400 block font-bold uppercase">SEKTÖR</span>
                          <span class="text-white font-bold">Ambalaj & Matbaa</span>
                        </div>
                        <div class="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                          <span class="text-[9px] text-slate-400 block font-bold uppercase">HEDEF BÜTÇE</span>
                          <span class="text-emerald-400 font-mono font-black">₺180.000</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 bg-blue-950/40 border border-blue-800/40 p-2 rounded-xl text-blue-300 text-[10px]">
                        <CheckCircle2 :size="14" class="text-emerald-400 shrink-0" />
                        <span>2 Adet Numune Fotoğrafı & Şartname PDF Eklendi</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ANIMATION 3: TEKLİF VERME -->
                <div v-else-if="currentVideo.id === 'teklif-verme'" class="w-full max-w-md space-y-3">
                  <div class="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md text-left transition-all">
                    <div class="flex items-center justify-between text-xs mb-2">
                      <span class="font-bold text-white">İhale ve Satın Alma Teklif Girişi</span>
                      <span class="text-amber-400 font-mono font-bold text-[10px]">Lider Teklif: ₺385.000</span>
                    </div>
                    <div class="space-y-2 text-[11px]">
                      <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                        <label class="text-[9px] text-slate-400 font-bold uppercase block">YENİ BİRİM FİYAT TEKLİFİNİZ</label>
                        <div class="flex items-center gap-2">
                          <span class="text-slate-400 text-sm font-bold">₺</span>
                          <input
                            type="text"
                            :value="(380000 - Math.floor((currentTime % 10) * 1000)).toLocaleString('tr-TR')"
                            readonly
                            class="w-full bg-slate-950 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-xs font-mono font-black text-emerald-400 outline-none"
                          />
                          <button class="bg-emerald-600 px-3 py-1.5 rounded-lg text-white font-black text-xs hover:bg-emerald-500 shadow-md">
                            Gönder
                          </button>
                        </div>
                      </div>
                      <div class="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 justify-center pt-1">
                        <CheckCircle2 :size="12" /> Tebrikler! En Düşük Lider Teklifi Verdiniz.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ANIMATION 4: KYC DOĞRULAMA -->
                <div v-else-if="currentVideo.id === 'kyc-dogrulama'" class="w-full max-w-md space-y-3">
                  <div class="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md text-left transition-all">
                    <div class="flex items-center gap-2 text-xs font-black text-white mb-2">
                      <ShieldCheck class="text-blue-400" :size="16" />
                      <span>GİB & MERSİS Kurumsal Onay Süreci</span>
                    </div>
                    <div class="space-y-2 text-[11px]">
                      <div class="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-300">VKN Algoritma Doğrulaması:</span>
                        <span class="text-emerald-400 font-bold font-mono">✓ FAAL MÜKELLEF</span>
                      </div>
                      <div class="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-300">e-Devlet Yetkili Temsilci:</span>
                        <span class="text-emerald-400 font-bold">✓ DOĞRULANDI</span>
                      </div>
                      <div class="bg-blue-900/30 border border-blue-500/40 p-2.5 rounded-xl flex items-center gap-2 text-blue-200 text-[10px]">
                        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">★</span>
                        <span>Profilinize <strong>Doğrulanmış B2B Üretici</strong> rozeti tanımlandı.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ANIMATION 5: ERP ENTEGRASYON -->
                <div v-else class="w-full max-w-md space-y-3">
                  <div class="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md text-left transition-all">
                    <div class="flex items-center gap-2 text-xs font-black text-white mb-2">
                      <Layers class="text-amber-400" :size="16" />
                      <span>SAP / Logo / Dynamics & Excel Senkronizasyonu</span>
                    </div>
                    <div class="space-y-2 text-[11px]">
                      <div class="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-300">SAP EBAN Talep İçe Aktar:</span>
                        <span class="text-emerald-400 font-mono font-bold">PR-2026-9018 (3 Kalem)</span>
                      </div>
                      <div class="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-300">Excel Malzeme Listesi:</span>
                        <span class="text-blue-400 font-mono font-bold">120 Satır Ayrıştırıldı</span>
                      </div>
                      <div class="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl flex items-center gap-2 text-emerald-300 text-[10px]">
                        <CheckCircle2 :size="14" class="text-emerald-400 shrink-0" />
                        <span>İhale sonucu otomatik SAP PO siparişine dönüştürüldü.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- BOTTOM CAPTION / SUBTITLE WITH VOICEOVER SYNC -->
              <div class="relative z-10 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 text-center backdrop-blur-sm shadow-xl">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <div class="flex items-center gap-2">
                    <!-- Animated Equalizer Wave -->
                    <div v-if="voiceoverEnabled && isSpeaking" class="flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-md">
                      <span class="w-1 bg-blue-400 rounded-full animate-soundwave-1"></span>
                      <span class="w-1 bg-blue-400 rounded-full animate-soundwave-2"></span>
                      <span class="w-1 bg-blue-400 rounded-full animate-soundwave-3"></span>
                      <span class="w-1 bg-blue-400 rounded-full animate-soundwave-4"></span>
                      <span class="w-1 bg-blue-400 rounded-full animate-soundwave-5"></span>
                    </div>

                    <span class="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {{ currentChapter.title }}
                    </span>
                  </div>

                  <!-- Replay Voice Button -->
                  <button
                    @click="speakCurrentNarration(true)"
                    class="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/70 border border-blue-800/60 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    title="Bu adımı Türkçe sesli dinle"
                  >
                    <Volume2 :size="12" class="text-blue-400" />
                    <span>{{ isSpeaking ? 'Seslendiriliyor...' : 'Tekrar Dinle' }}</span>
                  </button>
                </div>

                <p class="text-xs text-slate-200 font-medium leading-relaxed">
                  "{{ currentChapter.subtitleText }}"
                </p>
              </div>

            </div>

            <!-- PLAYER CONTROLS & TIMELINE BAR -->
            <div class="bg-slate-900 p-4 space-y-3">
              
              <!-- Progress Bar -->
              <div
                class="relative h-2 w-full rounded-full bg-slate-800 cursor-pointer overflow-hidden group"
                @click="handleProgressBarClick"
              >
                <div
                  class="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-amber-400 transition-all duration-200"
                  :style="{ width: `${progressPercent}%` }"
                ></div>
              </div>

              <!-- Buttons, Time and Speed -->
              <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div class="flex items-center gap-3">
                  <button
                    @click="togglePlay"
                    class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer shadow-md"
                  >
                    <Pause v-if="isPlaying" :size="14" />
                    <Play v-else :size="14" />
                  </button>

                  <button
                    @click="restartVideo"
                    class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                    title="Başa Sar"
                  >
                    <RotateCcw :size="14" />
                  </button>

                  <div class="font-mono text-xs text-slate-300">
                    <span class="text-white font-bold">{{ formattedCurrentTime }}</span> / {{ currentVideo.duration }}
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Voiceover On/Off Button -->
                  <button
                    @click="toggleVoiceover"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer"
                    :class="voiceoverEnabled ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'"
                    :title="voiceoverEnabled ? 'Sesli anlatımı kapat' : 'Türkçe sesli anlatımı aç'"
                  >
                    <Volume2 v-if="voiceoverEnabled" :size="14" class="text-blue-400" :class="{ 'animate-pulse': isSpeaking }" />
                    <VolumeX v-else :size="14" />
                    <span class="text-[11px] font-bold">{{ voiceoverEnabled ? 'Türkçe Seslendirme: Açık' : 'Ses: Kapalı' }}</span>
                  </button>

                  <!-- Speed Selectors -->
                  <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold font-mono">
                    <button
                      v-for="s in [1, 1.5, 2]"
                      :key="s"
                      @click="changeSpeed(s)"
                      class="px-2 py-0.5 rounded-lg transition cursor-pointer"
                      :class="playbackSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
                    >
                      {{ s }}x
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- TABS: SİMÜLASYON ADIMLARI / TRANSCRIPT / EYLEM LİSTESİ -->
            <div class="p-4 bg-slate-950/50 border-t border-slate-800 flex-1">
              <div class="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3 text-xs font-bold">
                <button
                  @click="activeTab = 'simulation'"
                  class="pb-1 px-2 border-b-2 transition"
                  :class="activeTab === 'simulation' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'"
                >
                  Bölümler & Zaman Çizelgesi
                </button>
                <button
                  @click="activeTab = 'checklist'"
                  class="pb-1 px-2 border-b-2 transition"
                  :class="activeTab === 'checklist' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'"
                >
                  Uygulama Kontrol Listesi
                </button>
              </div>

              <!-- Chapters List Tab -->
              <div v-if="activeTab === 'simulation'" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div
                  v-for="(ch, idx) in currentVideo.chapters"
                  :key="idx"
                  @click="seekTo(ch.startSeconds)"
                  class="p-2.5 rounded-xl border transition cursor-pointer text-left"
                  :class="currentChapter.index === idx ? 'border-blue-500 bg-blue-950/30 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'"
                >
                  <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span class="font-bold text-blue-400">{{ ch.title.split(':')[0] }}</span>
                    <span>{{ Math.floor(ch.startSeconds / 60) }}:{{ (ch.startSeconds % 60).toString().padStart(2, '0') }}</span>
                  </div>
                  <div class="font-bold text-slate-200 text-[11px] leading-snug">
                    {{ ch.title.split(':')[1] || ch.title }}
                  </div>
                </div>
              </div>

              <!-- Checklist Tab -->
              <div v-else class="space-y-2 text-xs">
                <div
                  v-for="(item, idx) in currentVideo.checklist"
                  :key="idx"
                  class="flex items-center gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-slate-300"
                >
                  <CheckCircle2 :size="15" class="text-emerald-400 shrink-0" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT: ALL VIDEO GUIDES PLAYLIST (4 cols) -->
          <div class="lg:col-span-4 flex flex-col bg-slate-900 p-4 space-y-3 overflow-y-auto">
            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <span class="text-xs font-black uppercase tracking-wider text-slate-300">Tüm Video Rehberler ({{ videoCatalogue.length }})</span>
              <span class="text-[10px] font-mono text-slate-500">HD 1080p</span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="v in videoCatalogue"
                :key="v.id"
                @click="selectVideo(v.id)"
                class="group flex gap-3 p-2.5 rounded-2xl border transition cursor-pointer text-left"
                :class="selectedVideoId === v.id ? 'border-blue-500 bg-blue-950/40 shadow-md shadow-blue-900/20' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/60'"
              >
                <!-- Thumbnail Preview with Play Overlay -->
                <div class="relative h-16 w-24 shrink-0 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img :src="v.thumbnailUrl" :alt="v.title" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                  <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                      <Play :size="10" />
                    </div>
                  </div>
                  <span class="absolute bottom-1 right-1 rounded bg-slate-950/90 px-1 py-0.2 text-[8px] font-mono font-bold text-white">
                    {{ v.duration }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span class="text-[8px] font-black uppercase tracking-wider text-blue-400">{{ v.badge }}</span>
                    <h3 class="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">
                      {{ v.title }}
                    </h3>
                  </div>
                  <p class="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                    {{ v.subtitle }}
                  </p>
                </div>
              </div>
            </div>

            <!-- CTA Card in Sidebar -->
            <div class="mt-auto rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-slate-950 p-4 text-center space-y-2 pt-4">
              <h4 class="text-xs font-black text-white">Özel Destek veya Canlı Demo mu Lazım?</h4>
              <p class="text-[11px] text-slate-400">Satın alma ekibiniz için canlı B2B ihale simülasyonu talep edin.</p>
              <NuxtLink
                to="/yardim"
                @click="closeModal"
                class="inline-block w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-white transition border border-slate-700"
              >
                Destek Ekibine Ulaşın
              </NuxtLink>
            </div>

          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes soundwave {
  0%, 100% {
    height: 3px;
  }
  50% {
    height: 12px;
  }
}

.animate-soundwave-1 {
  animation: soundwave 0.7s ease-in-out infinite 0.1s;
}
.animate-soundwave-2 {
  animation: soundwave 0.7s ease-in-out infinite 0.3s;
}
.animate-soundwave-3 {
  animation: soundwave 0.7s ease-in-out infinite 0.5s;
}
.animate-soundwave-4 {
  animation: soundwave 0.7s ease-in-out infinite 0.2s;
}
.animate-soundwave-5 {
  animation: soundwave 0.7s ease-in-out infinite 0.4s;
}
</style>
