<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Sparkles, Bot, ShieldCheck, TrendingUp, HelpCircle, FileText, Send, X, CheckCircle2, AlertTriangle } from 'lucide-vue-next'
import { useDeepSeekAgent } from '~/composables/useDeepSeekAgent'

const props = defineProps<{
  isOpen: boolean
  tender: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'applySuggestedBid', price: string): void
}>()

const { isAnalyzing, lastAnalysis, aiChatHistory, analyzeTenderSpec, askAiAssistant } = useDeepSeekAgent()

const activeAiTab = ref<'ozet' | 'metraj' | 'strateji' | 'sohbet'>('ozet')
const chatInput = ref('')

watch(() => props.isOpen, async (open) => {
  if (open && props.tender) {
    await analyzeTenderSpec({
      title: props.tender.baslik || props.tender.title || 'Kurumsal Satın Alma İhalesi',
      category: props.tender.kategori || 'Genel Satın Alma',
      description: props.tender.aciklama,
      city: props.tender.city,
      budget: props.tender.butce
    })
  }
})

async function handleSendMessage() {
  if (!chatInput.value.trim()) return
  const q = chatInput.value.trim()
  chatInput.value = ''
  await askAiAssistant(q, props.tender)
}
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn text-left"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-scaleUp">
      
      <!-- Top Header -->
      <div class="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles :size="20" class="animate-pulse" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-black text-white">DeepSeek Akıllı İhale & Şartname Asistanı</h3>
              <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black border border-blue-500/30">
                DeepSeek-V3 Reasoner
              </span>
            </div>
            <p class="text-[11px] text-slate-400 font-medium truncate max-w-md">
              {{ tender?.baslik || 'Teknik Şartname & Metraj Analiz Masası' }}
            </p>
          </div>
        </div>

        <button 
          type="button" 
          @click="emit('close')" 
          class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1.5 px-4 pt-3 bg-slate-950/60 border-b border-slate-800 text-xs font-bold overflow-x-auto">
        <button 
          type="button"
          @click="activeAiTab = 'ozet'"
          class="px-3.5 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          :class="activeAiTab === 'ozet' ? 'bg-slate-900 text-blue-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200'"
        >
          <Bot :size="14" />
          <span>Şartname Analizi</span>
        </button>
        <button 
          type="button"
          @click="activeAiTab = 'metraj'"
          class="px-3.5 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          :class="activeAiTab === 'metraj' ? 'bg-slate-900 text-blue-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200'"
        >
          <FileText :size="14" />
          <span>Metraj & Yaklaşık Maliyet</span>
        </button>
        <button 
          type="button"
          @click="activeAiTab = 'strateji'"
          class="px-3.5 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          :class="activeAiTab === 'strateji' ? 'bg-slate-900 text-blue-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200'"
        >
          <TrendingUp :size="14" />
          <span>Karlı Teklif Stratejisi</span>
        </button>
        <button 
          type="button"
          @click="activeAiTab = 'sohbet'"
          class="px-3.5 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          :class="activeAiTab === 'sohbet' ? 'bg-slate-900 text-blue-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200'"
        >
          <HelpCircle :size="14" />
          <span>AI Soru-Cevap</span>
        </button>
      </div>

      <!-- Content Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
        
        <!-- Loading State -->
        <div v-if="isAnalyzing && !lastAnalysis" class="py-12 text-center space-y-3">
          <div class="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-400 font-medium">DeepSeek AI şartname ve metraj verilerini inceliyor...</p>
        </div>

        <div v-else-if="lastAnalysis" class="space-y-4">
          
          <!-- TAB 1: ŞARTNAME ANALİZİ -->
          <div v-if="activeAiTab === 'ozet'" class="space-y-4">
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-black text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck :size="15" class="text-emerald-400" />
                  Şartname Özet Değerlendirmesi
                </span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                  Güven Skoru: %{{ lastAnalysis.confidenceScore }}
                </span>
              </div>
              <p class="text-slate-300 leading-relaxed">{{ lastAnalysis.summary }}</p>
            </div>

            <!-- 4'lü Özet İstatistik -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-0.5">
                <span class="text-[10px] text-slate-400 font-bold block">Risk Seviyesi</span>
                <span class="text-emerald-400 font-black text-sm">{{ lastAnalysis.riskLevel }}</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-0.5">
                <span class="text-[10px] text-slate-400 font-bold block">Mevzuat Uyumu</span>
                <span class="text-blue-400 font-black text-sm">%{{ lastAnalysis.complianceScore }}</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-0.5">
                <span class="text-[10px] text-slate-400 font-bold block">Teslimat Kolaylığı</span>
                <span class="text-emerald-400 font-black text-xs">{{ lastAnalysis.deliveryFeasibility }}</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-0.5">
                <span class="text-[10px] text-slate-400 font-bold block">Önerilen Fiyat</span>
                <span class="text-amber-400 font-black text-xs font-mono">{{ lastAnalysis.recommendedBidPrice }}</span>
              </div>
            </div>

            <!-- Kritik Gereksinimler Listesi -->
            <div class="space-y-2">
              <h4 class="text-[11px] font-black uppercase text-slate-400 tracking-wider">Kritik Şartname Maddeleri:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(req, idx) in lastAnalysis.keyRequirements" :key="idx" class="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <CheckCircle2 :size="14" class="text-emerald-400 shrink-0 mt-0.5" />
                  <span class="text-slate-300">{{ req }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: METRAJ & YAKLAŞIK MALİYET -->
          <div v-else-if="activeAiTab === 'metraj'" class="space-y-4">
            <div class="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-2">
              <span class="text-[11px] font-black uppercase text-blue-300 tracking-wider block">DeepSeek Yaklaşık Maliyet Aralığı:</span>
              <div class="text-2xl font-black font-mono text-emerald-400">{{ lastAnalysis.estimatedCostFormatted }}</div>
              <p class="text-slate-400 text-[11px]">
                Bu maliyet aralığı piyasadaki benzer B2B satın alma sözleşmeleri, hammadde endeksleri ve lojistik maliyetleri baz alınarak yapay zeka tarafından hesaplanmıştır.
              </p>
            </div>

            <!-- Otonom Denetim Kontrol Raporu -->
            <div class="space-y-2">
              <h4 class="text-[11px] font-black uppercase text-slate-400 tracking-wider">Otomatik Güvenlik & Denetim Kontrolleri:</h4>
              <div class="space-y-1.5">
                <div v-for="(chk, i) in lastAnalysis.aiInspectionReport.checks" :key="i" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                  <span class="font-bold text-slate-200">{{ chk.name }}</span>
                  <span class="text-emerald-400 font-bold text-[11px]">✓ {{ chk.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: KARLI TEKLİF STRATEJİSİ -->
          <div v-else-if="activeAiTab === 'strateji'" class="space-y-4">
            <div class="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 space-y-2">
              <span class="text-[11px] font-black uppercase text-amber-400 tracking-wider block">Kazanma İhtimali Yüksek Teklif Fiyatı:</span>
              <div class="text-2xl font-black font-mono text-amber-300">{{ lastAnalysis.recommendedBidPrice }}</div>
              <p class="text-slate-300 text-xs leading-relaxed">
                {{ lastAnalysis.recommendedBidAdvice }}
              </p>
            </div>

            <div class="flex justify-end">
              <button 
                type="button" 
                @click="emit('applySuggestedBid', lastAnalysis.recommendedBidPrice)"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>✓ Bu Strateji Fiyatını Teklif Formuna Aktar ({{ lastAnalysis.recommendedBidPrice }})</span>
              </button>
            </div>
          </div>

          <!-- TAB 4: AI SOHBET & SORU-CEVAP -->
          <div v-else-if="activeAiTab === 'sohbet'" class="space-y-3">
            <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-2 bg-slate-950 rounded-2xl border border-slate-800">
              <div v-if="aiChatHistory.length === 0" class="text-center py-6 text-slate-500 text-xs">
                DeepSeek AI'a bu ihale hakkında aklınıza takılan her türlü teknik veya ticari soruyu sorabilirsiniz.
              </div>
              <div v-for="(msg, mIdx) in aiChatHistory" :key="mIdx" class="flex flex-col space-y-1" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                <div 
                  class="p-3 rounded-2xl max-w-lg leading-relaxed text-xs"
                  :class="msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'"
                >
                  <p class="whitespace-pre-line">{{ msg.text }}</p>
                </div>
                <span class="text-[9px] text-slate-500 px-1">{{ msg.time }}</span>
              </div>
            </div>

            <!-- Chat input -->
            <form @submit.prevent="handleSendMessage" class="flex items-center gap-2">
              <input 
                v-model="chatInput" 
                type="text" 
                placeholder="Örn: Bu ihalede yaklaşık kar marjı ne kadar? / Hangi evraklar lazım?" 
                class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500"
              />
              <button 
                type="submit" 
                class="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shrink-0"
              >
                <Send :size="15" />
              </button>
            </form>
          </div>

        </div>

      </div>

      <!-- Bottom Footer -->
      <div class="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span class="flex items-center gap-1.5">
          <Sparkles :size="13" class="text-blue-400" />
          <span>DeepSeek-V3 Reasoning Engine Entegrasyonu Aktif</span>
        </span>
        <button 
          type="button" 
          @click="emit('close')" 
          class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
        >
          Kapat
        </button>
      </div>

    </div>
  </div>
</template>
