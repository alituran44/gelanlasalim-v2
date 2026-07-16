<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const router = useRouter()
const isProcessing = ref<string | null>(null)

const plans = [
  {
    name: 'Temel Plan',
    price: '₺5.000',
    period: '/aylık',
    desc: 'Küçük ölçekli alıcılar ve yeni başlayan tedarikçiler için temel erişim.',
    features: [
      'Ayda 5 aktif ihale açma',
      'Standart tedarikçi eşleştirme',
      'E-posta ve temel destek',
      'Teklif geçmişi görüntüleme'
    ],
    cta: 'Temel Planı Başlat',
    popular: false,
    color: 'border-slate-200'
  },
  {
    name: 'Profesyonel Plan',
    price: 'Lansmana Özel Ücretsiz',
    period: '',
    desc: 'Orta ve büyük ölçekli firmalar için tam kapsamlı ihale ve tedarik yönetimi.',
    features: [
      'Sınırsız ihale yayınlama',
      'Canlı ters ihale (eksiltme) modülü',
      'Detaylı EKAP şartname entegrasyonu',
      'Öncelikli müşteri desteği (7/24)',
      'Gelişmiş veri analitiği ve tasarruf raporları',
      'Onaylı Tedarikçi Rozeti'
    ],
    cta: 'Ücretsiz Deneyimi Başlat',
    popular: true,
    color: 'border-blue-500 shadow-xl shadow-blue-500/5 ring-2 ring-blue-500/20'
  },
  {
    name: 'Kurumsal Plan',
    price: '₺15.000',
    period: '/aylık',
    desc: 'Çok şubeli holdingler ve özel entegrasyon arayan büyük ölçekli yapılar.',
    features: [
      'Her şey dahil Profesyonel özellikler',
      'Özel ERP ve Muhasebe API entegrasyonu',
      'Kurumsal alt firma/departman yönetimi',
      'Özel hesap temsilcisi (Account Manager)',
      'SLA garantili destek ve özel eğitimler'
    ],
    cta: 'Kurumsal İletişime Geç',
    popular: false,
    color: 'border-slate-200'
  }
]

function selectPlan(planName: string) {
  isProcessing.value = planName
  
  // Simulate payment processing
  setTimeout(() => {
    isProcessing.value = null
    
    // Retrieve current session and update to premium/plan
    const currentSession = localStorage.getItem('userSession')
    if (currentSession) {
      const parsed = JSON.parse(currentSession)
      parsed.isPremium = true
      parsed.plan = planName
      localStorage.setItem('userSession', JSON.stringify(parsed))
    }
    
    // Redirect to dashboard panel
    router.push('/panel')
  }, 1200)
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-16 px-6">
    <div class="mx-auto max-w-6xl text-center">
      <!-- Title -->
      <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">B2B ABONELİK PLANLARI</span>
      <h1 class="mt-3 text-3xl font-black text-slate-900 tracking-tight md:text-4xl lg:text-5xl">
        Üyeliğinizi Başlatın ve Ticareti Büyütün
      </h1>
      <p class="mt-4 max-w-xl mx-auto text-xs text-slate-500 leading-relaxed font-medium">
        Lansman dönemine özel Profesyonel Planı tamamen ücretsiz deneyebilirsiniz. Hiçbir gizli ücret veya komisyon ödemeden hemen başlayın.
      </p>

      <!-- Grid Plans -->
      <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch text-left">
        <div v-for="plan in plans" :key="plan.name" class="relative rounded-3xl bg-white border p-8 flex flex-col justify-between transition-all hover:shadow-md" :class="plan.color">
          <!-- Recommended Badge -->
          <div v-if="plan.popular" class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[9px] font-black text-white uppercase tracking-wider">
            Lansman Fırsatı
          </div>

          <div>
            <div class="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">{{ plan.name }}</div>
            <div class="flex items-baseline gap-1 mt-2">
              <span class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {{ plan.price }}
              </span>
              <span class="text-xs font-bold text-slate-400">
                {{ plan.period }}
              </span>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-slate-500 font-medium">
              {{ plan.desc }}
            </p>

            <hr class="border-slate-100 my-6" />

            <!-- Features -->
            <ul class="space-y-3.5 text-xs text-slate-600 font-medium">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <Check :size="16" class="text-blue-600 shrink-0 mt-0.5" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-8">
            <button @click="selectPlan(plan.name)" :disabled="isProcessing !== null" class="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black text-white shadow-lg transition-all" :class="plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'">
              <span v-if="isProcessing === plan.name">İşleniyor...</span>
              <span v-else>{{ plan.cta }}</span>
              <ArrowRight v-if="isProcessing !== plan.name" :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- Secure Info -->
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <span class="flex items-center gap-2">
          <ShieldCheck :size="16" class="text-blue-600" /> 256-Bit SSL Güvenli Ödeme
        </span>
        <span class="flex items-center gap-2">
          <HelpCircle :size="16" class="text-blue-600" /> Soru ve Yardım: destek@gelanlasalim.com
        </span>
      </div>
    </div>
  </div>
</template>
