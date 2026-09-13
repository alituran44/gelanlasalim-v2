<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  Copy, 
  X, 
  Check,
  RefreshCw,
  Award,
  Layers
} from 'lucide-vue-next'
import { useAiMatcher, type MatchCandidate } from '~/composables/useAiMatcher'

const props = defineProps<{
  isOpen: boolean
  target: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const {
  isMatching,
  isSendingInvite,
  currentResult,
  error,
  inviteStatus,
  findMatches,
  sendInvitation
} = useAiMatcher()

const activeTab = ref<'candidates' | 'templates'>('candidates')
const copiedSms = ref(false)
const bulkSending = ref(false)
const bulkSentSuccess = ref(false)

const targetTitle = computed(() => {
  if (!props.target) return 'İhale / Gayrimenkul İlanı'
  return props.target.baslik || props.target.title || props.target.ad || 'Satın Alma Talebi'
})

const targetCategory = computed(() => {
  if (!props.target) return 'Genel Ticaret'
  return props.target.kategori || props.target.category || 'Kurumsal Portföy'
})

const targetCity = computed(() => {
  if (!props.target) return 'Türkiye Geneli'
  return props.target.city || props.target.sehir || 'Tüm İller'
})

const targetBudget = computed(() => {
  if (!props.target) return undefined
  return props.target.butce || props.target.budget || props.target.fiyat
})

watch(() => props.isOpen, async (open) => {
  if (open && props.target) {
    activeTab.value = 'candidates'
    bulkSentSuccess.value = false
    await runMatching()
  }
})

async function runMatching() {
  await findMatches({
    id: props.target?.id,
    title: targetTitle.value,
    category: targetCategory.value,
    city: targetCity.value,
    budget: targetBudget.value,
    description: props.target?.aciklama || props.target?.description
  })
}

async function handleSingleInvite(candidate: MatchCandidate) {
  await sendInvitation(candidate.id, 'all')
}

async function handleBulkInvite() {
  if (!currentResult.value?.topMatches.length) return
  bulkSending.value = true
  for (const candidate of currentResult.value.topMatches) {
    await sendInvitation(candidate.id, 'all')
  }
  bulkSending.value = false
  bulkSentSuccess.value = true
  setTimeout(() => {
    bulkSentSuccess.value = false
  }, 4000)
}

function copySmsDraft() {
  if (!currentResult.value?.recommendedNotificationDraft.smsText) return
  navigator.clipboard.writeText(currentResult.value.recommendedNotificationDraft.smsText)
  copiedSms.value = true
  setTimeout(() => copiedSms.value = false, 2500)
}
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-left"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
      
      <!-- Top Header -->
      <div class="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Sparkles :size="24" class="animate-pulse text-emerald-400" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-base sm:text-lg font-black text-white tracking-tight">AI Tabanlı Akıllı Eşleştirme Motoru</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck :size="12" />
                <span>Doğrulanmış B2B & Fon Havuzu</span>
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              NACE Kodu (%35), Lokasyon (%25), Bütçe (%20) ve Semantik Analiz (%20) ile en uygun adaylar listelendi.
            </p>
          </div>
        </div>

        <button 
          @click="emit('close')" 
          class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Kapat"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Target Info Summary Bar -->
      <div class="px-6 py-3.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          <span class="text-slate-400">Hedef İlan:</span>
          <span class="font-bold text-white truncate max-w-xs sm:max-w-md">{{ targetTitle }}</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">{{ targetCategory }}</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1">
            <MapPin :size="11" class="text-emerald-400" />
            {{ targetCity }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="runMatching"
            :disabled="isMatching"
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw :size="12" :class="{ 'animate-spin': isMatching }" />
            <span>Yeniden Analiz Et</span>
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex items-center gap-4 text-xs font-bold">
        <button 
          @click="activeTab = 'candidates'"
          :class="activeTab === 'candidates' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-2.5' : 'text-slate-400 hover:text-white pb-2.5'"
          class="transition flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 :size="14" />
          <span>Eşleşen Firmalar & Fonlar</span>
          <span 
            v-if="currentResult?.topMatches?.length" 
            class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]"
          >
            {{ currentResult.topMatches.length }}
          </span>
        </button>

        <button 
          @click="activeTab = 'templates'"
          :class="activeTab === 'templates' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-2.5' : 'text-slate-400 hover:text-white pb-2.5'"
          class="transition flex items-center gap-1.5 cursor-pointer"
        >
          <Mail :size="14" />
          <span>Otomatik Bildirim Taslakları (SMS & E-Posta)</span>
        </button>
      </div>

      <!-- Main Body Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6">
        
        <!-- Loading State -->
        <div v-if="isMatching" class="py-16 text-center space-y-4">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
            <Sparkles :size="28" class="animate-spin" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Yapay Zeka Portföy ve Firma Veritabanını Tarıyor...</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Sektörel NACE uyumu, geçmiş teklif geçmişi ve bütçe büyüklükleri algoritmik olarak puanlanıyor.
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
          <X :size="16" class="text-rose-400 shrink-0" />
          <div>
            <span class="font-bold">Eşleştirme Tamamlanamadı:</span> {{ error }}
          </div>
        </div>

        <!-- TAB 1: MATCHED CANDIDATES -->
        <div v-else-if="activeTab === 'candidates'" class="space-y-4">
          
          <!-- Bulk Action Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div>
              <span class="text-xs font-bold text-white block">
                {{ currentResult?.matchedCount || 0 }} adet yüksek uyumlu tedarikçi/yatırımcı tespit edildi
              </span>
              <span class="text-[11px] text-slate-400">
                Tek tıkla tüm listeye NetGSM SMS ve kurumsal davet e-postası iletebilirsiniz.
              </span>
            </div>

            <button 
              @click="handleBulkInvite"
              :disabled="bulkSending || !currentResult?.topMatches.length"
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30 disabled:opacity-50 cursor-pointer"
            >
              <Send :size="14" />
              <span>{{ bulkSending ? 'Davetler Gönderiliyor...' : 'Tüm Listeye Toplu Davet Gönder' }}</span>
            </button>
          </div>

          <!-- Bulk Success Alert -->
          <div v-if="bulkSentSuccess" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 :size="16" />
            <span>Tüm adaylara kurumsal SMS ve e-posta davetleri başarıyla sevk edildi!</span>
          </div>

          <!-- Candidate List Cards -->
          <div class="grid grid-cols-1 gap-3.5">
            <div 
              v-for="candidate in currentResult?.topMatches || []" 
              :key="candidate.id"
              class="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div class="flex items-start gap-4">
                <!-- Match Score Badge -->
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <span class="text-base font-black text-emerald-400 font-mono">%{{ candidate.matchScore }}</span>
                  <span class="text-[9px] font-bold text-emerald-500/80 tracking-wider uppercase">Uyum</span>
                </div>

                <div class="space-y-1.5 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-sm font-bold text-white">{{ candidate.companyName }}</h4>
                    <span 
                      v-if="candidate.verified"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold"
                    >
                      <ShieldCheck :size="10" />
                      GİB Onaylı
                    </span>
                    <span class="text-xs text-amber-400 flex items-center gap-0.5 font-mono">
                      ★ {{ candidate.rating.toFixed(1) }}
                    </span>
                  </div>

                  <p class="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                    <span class="font-medium text-slate-300">{{ candidate.contactName }}</span>
                    <span class="flex items-center gap-1">
                      <Phone :size="11" class="text-slate-500" />
                      <span class="font-mono text-slate-400">{{ candidate.phone }}</span>
                    </span>
                    <span class="flex items-center gap-1">
                      <Mail :size="11" class="text-slate-500" />
                      <span class="text-slate-400">{{ candidate.email }}</span>
                    </span>
                    <span class="flex items-center gap-1">
                      <MapPin :size="11" class="text-emerald-400" />
                      <span>{{ candidate.city }}</span>
                    </span>
                  </p>

                  <div class="flex items-center gap-2 flex-wrap pt-1">
                    <span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                      NACE: {{ candidate.naceCode }}
                    </span>
                    <span class="text-[11px] text-emerald-400 font-medium">
                      ✓ {{ candidate.matchReason }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex items-center gap-2 shrink-0 md:self-center">
                <button 
                  @click="handleSingleInvite(candidate)"
                  :disabled="inviteStatus[candidate.id] === 'sending' || inviteStatus[candidate.id] === 'sent'"
                  :class="inviteStatus[candidate.id] === 'sent' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'"
                  class="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                >
                  <Check v-if="inviteStatus[candidate.id] === 'sent'" :size="13" class="text-emerald-400" />
                  <Send v-else :size="13" />
                  <span>
                    {{ inviteStatus[candidate.id] === 'sent' ? 'Davet Gönderildi' : (inviteStatus[candidate.id] === 'sending' ? 'Gönderiliyor...' : 'Davet Gönder') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: TEMPLATES PREVIEW -->
        <div v-else-if="activeTab === 'templates'" class="space-y-6">
          <!-- SMS Preview Card -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Phone :size="16" class="text-emerald-400" />
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">NetGSM SMS Davet Metni</h4>
              </div>
              <button 
                @click="copySmsDraft"
                class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-800 transition cursor-pointer"
              >
                <Check v-if="copiedSms" :size="12" class="text-emerald-400" />
                <Copy v-else :size="12" />
                <span>{{ copiedSms ? 'Kopyalandı!' : 'Metni Kopyala' }}</span>
              </button>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed">
              {{ currentResult?.recommendedNotificationDraft.smsText }}
            </div>
            <p class="text-[11px] text-slate-500">
              * NetGSM 850 Başlıklı SMS API üzerinden otomatik sevk edilir.
            </p>
          </div>

          <!-- Email Preview Card -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Mail :size="16" class="text-blue-400" />
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Google SMTP E-Posta Şablonu</h4>
              </div>
              <span class="text-[11px] font-mono text-slate-400">
                Konu: {{ currentResult?.recommendedNotificationDraft.emailSubject }}
              </span>
            </div>

            <div 
              class="p-5 rounded-xl bg-white text-slate-900 text-xs leading-relaxed overflow-x-auto shadow-inner"
              v-html="currentResult?.recommendedNotificationDraft.emailBodyHtml"
            ></div>
            <p class="text-[11px] text-slate-500">
              * ihalecib@gmail.com kurumsal Google SMTP kanalı üzerinden teslim edilir.
            </p>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-slate-500">
          Algoritma Motoru: <strong class="text-slate-300">SmartMatcher v2.4 Enterprise</strong>
        </span>
        <button 
          @click="emit('close')"
          class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
        >
          Kapat
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}

.animate-scaleUp {
  animation: scaleUp 0.15s ease-out forwards;
}
</style>
