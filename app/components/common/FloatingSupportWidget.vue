<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  PhoneCall,
  RotateCcw
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

const { cmsData } = useCmsData()

const isChatOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const chatMessagesContainer = ref<HTMLDivElement | null>(null)

// Support CMS Configuration
const supportConfig = computed(() => {
  return cmsData.value?.supportSettings || {
    whatsappEnabled: true,
    whatsappNumber: '908508408695',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale ve 1 ay ücretsiz deneme hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 1 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?'
  }
})

// WhatsApp Direct URL
const whatsappUrl = computed(() => {
  const num = (supportConfig.value.whatsappNumber || '908508408695').replace(/[^0-9]/g, '')
  const msg = encodeURIComponent(supportConfig.value.whatsappMessage || 'Merhaba')
  return `https://wa.me/${num}?text=${msg}`
})

// Chat Message History
interface ChatMessage {
  id: number
  sender: 'bot' | 'user'
  text: string
  time: string
  actionLink?: { text: string; url: string }
}

const messages = ref<ChatMessage[]>([])

onMounted(() => {
  resetChat()
})

function resetChat() {
  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  messages.value = [
    {
      id: 1,
      sender: 'bot',
      text: supportConfig.value.aiGreeting,
      time: now
    }
  ]
}

function scrollToBottom() {
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

function sendPreset(text: string) {
  userInput.value = text
  handleSendMessage()
}

function handleSendMessage() {
  const text = userInput.value.trim()
  if (!text) return

  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  
  // Add User Message
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text,
    time: now
  })
  userInput.value = ''
  scrollToBottom()

  // Generate AI Response
  isTyping.value = true
  setTimeout(() => {
    generateBotResponse(text)
    isTyping.value = false
    scrollToBottom()
  }, 750)
}

function generateBotResponse(userQuery: string) {
  const q = userQuery.toLowerCase()
  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  let replyText = ''
  let actionLink: { text: string; url: string } | undefined

  if (q.includes('1 ay') || q.includes('deneme') || q.includes('ücretsiz') || q.includes('fiyat') || q.includes('ücret') || q.includes('bedava')) {
    replyText = '🎁 Lansmanımıza özel olarak ilk 1 AY boyunca tüm alıcı ve tedarikçi firmalarımıza sistem %100 ÜCRETSİZDİR! Kredi kartı bilgisi gerekmez, 0 komisyon ile sınırsız ihale açabilir ve teklif verebilirsiniz.'
    actionLink = { text: '1 Ay Ücretsiz Denemeyi Başlat →', url: '/abonelik' }
  } else if (q.includes('ihale aç') || q.includes('ihale nasıl') || q.includes('satın alma') || q.includes('talep')) {
    replyText = '📢 İhale açmak çok kolay! Şartnamenizi ve malzeme miktarınızı belirleyerek dakikalar içinde canlı eksiltmeli B2B ihale başlatabilirsiniz. Doğrulanmış üreticiler size anında belgeli teklif sunar.'
    actionLink = { text: 'Hemen İhale Oluştur →', url: '/panel/ihale-olustur' }
  } else if (q.includes('teklif ver') || q.includes('tedarikçi') || q.includes('üretici') || q.includes('ihale bul')) {
    replyText = '💼 Tedarikçi olarak Pazar Yeri bölümündeki aktif alım ilanlarını filtreleyebilir, şartnameleri inceleyip doğrudan karşı teklif veya canlı eksiltmeye katılabilirsiniz.'
    actionLink = { text: 'Yayındaki İhaleleri İncele →', url: '/pazar-yeri' }
  } else if (q.includes('eksiltme') || q.includes('tersine') || q.includes('nasıl çalışır')) {
    replyText = '⚡ Canlı Tersine Eksiltme; alıcının belirlediği tavan fiyattan tedarikçilerin canlı sürede fiyat kırarak (eksiltme yaparak) yarıştığı şeffaf bir dijital pazarlık odasıdır. Alıcıya ortalama %14.2 tasarruf sağlar!'
    actionLink = { text: 'Video Rehberi İzle →', url: '/videolar' }
  } else if (q.includes('whatsapp') || q.includes('temsilci') || q.includes('insan') || q.includes('telefon') || q.includes('destek')) {
    replyText = '💬 Müşteri temsilcimizle doğrudan WhatsApp üzerinden görüşmek için aşağıdaki bağlantıyı kullanabilirsiniz. 7/24 hizmetinizdeyiz!'
    actionLink = { text: 'WhatsApp Canlı Desteğe Bağlan →', url: whatsappUrl.value }
  } else {
    replyText = `Sorunuz için teşekkürler! İhaleciBurada platformunda 1 ay ücretsiz lansman denemesi ile ihale açabilir, kurumsal teklif toplayabilir veya canlı eksiltme yapabilirsiniz. Daha detaylı canlı bilgi için WhatsApp hattımıza da yazabilirsiniz.`
    actionLink = { text: 'Tüm Video Rehberleri İncele →', url: '/videolar' }
  }

  messages.value.push({
    id: Date.now() + 1,
    sender: 'bot',
    text: replyText,
    time: now,
    actionLink
  })
}
</script>

<template>
  <!-- FLOATING WIDGET WRAPPER -->
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">

    <!-- EXPANDED AI CHAT WINDOW -->
    <transition name="chat-popup">
      <div 
        v-if="isChatOpen" 
        class="w-[360px] sm:w-[390px] h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fadeIn"
      >
        <!-- Chat Header -->
        <div class="p-4 bg-gradient-to-r from-[#0F223D] via-blue-950 to-blue-900 text-white flex items-center justify-between shadow-md">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5 shadow-sm">
                <div class="w-full h-full bg-[#0F223D] rounded-[14px] flex items-center justify-center text-emerald-400">
                  <Bot :size="20" />
                </div>
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0F223D]"></span>
            </div>
            <div>
              <div class="text-xs font-black tracking-wide flex items-center gap-1.5">
                <span>{{ supportConfig.aiBotName }}</span>
                <Sparkles :size="12" class="text-amber-400" />
              </div>
              <div class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span>🟢 Çevrimiçi</span>
                <span class="text-slate-400">• 7/24 B2B Destek</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button 
              @click="resetChat" 
              title="Sohbeti Sıfırla"
              class="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RotateCcw :size="14" />
            </button>
            <button 
              @click="isChatOpen = false" 
              class="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- 1-Month Free Trial Promo Strip inside Chat -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3.5 py-1.5 text-[10px] font-bold flex items-center justify-between shadow-inner">
          <span class="flex items-center gap-1.5">
            <Sparkles :size="12" class="text-amber-300" />
            <span>Lansmana Özel: 1 Ay %100 Ücretsiz</span>
          </span>
          <NuxtLink to="/abonelik" @click="isChatOpen = false" class="underline hover:text-amber-200 font-black">
            Aktif Et (0 ₺)
          </NuxtLink>
        </div>

        <!-- Message Stream Area -->
        <div 
          ref="chatMessagesContainer" 
          class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs"
        >
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="flex flex-col"
            :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
          >
            <div 
              class="max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed"
              :class="msg.sender === 'user' 
                ? 'bg-[#0052FF] text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'"
            >
              <p class="whitespace-pre-line">{{ msg.text }}</p>

              <!-- Optional Action Link inside Bot Message -->
              <div v-if="msg.actionLink" class="mt-2.5 pt-2 border-t border-slate-100">
                <a 
                  v-if="msg.actionLink.url.startsWith('http')"
                  :href="msg.actionLink.url" 
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black shadow-xs transition"
                >
                  <span>{{ msg.actionLink.text }}</span>
                  <ExternalLink :size="12" />
                </a>
                <NuxtLink 
                  v-else
                  :to="msg.actionLink.url" 
                  @click="isChatOpen = false"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0052FF] hover:bg-blue-700 text-white text-[11px] font-black shadow-xs transition"
                >
                  <span>{{ msg.actionLink.text }}</span>
                  <ArrowRight :size="12" />
                </NuxtLink>
              </div>
            </div>
            <span class="text-[9px] text-slate-400 mt-1 px-1">{{ msg.time }}</span>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex items-center gap-1 text-slate-400 text-[10px] bg-white p-2.5 rounded-2xl w-24 border border-slate-200 shadow-xs">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"></span>
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
            <span class="ml-1 text-[9px] font-bold">Yazıyor...</span>
          </div>
        </div>

        <!-- Quick Question Chips -->
        <div class="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px] font-bold text-slate-600 scrollbar-none">
          <button 
            @click="sendPreset('1 Ay Ücretsiz Deneme nasıl başlatılır?')"
            class="whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
          >
            🎁 1 Ay Ücretsiz Deneme
          </button>
          <button 
            @click="sendPreset('İhale nasıl açabilirim?')"
            class="whitespace-nowrap px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
          >
            📢 İhale Nasıl Açılır?
          </button>
          <button 
            @click="sendPreset('Tedarikçi olarak nasıl teklif veririm?')"
            class="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            💼 Teklif Verme
          </button>
          <button 
            @click="sendPreset('Canlı tersine eksiltme nedir?')"
            class="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            ⚡ Tersine Eksiltme
          </button>
        </div>

        <!-- Direct WhatsApp switch bar -->
        <div class="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-[10px]">
          <span class="text-slate-500 font-medium">Yetkili ile canlı görüşmek ister misiniz?</span>
          <a 
            :href="whatsappUrl" 
            target="_blank"
            class="font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>WhatsApp Destek</span>
            <ExternalLink :size="10" />
          </a>
        </div>

        <!-- Chat Input Form -->
        <form @submit.prevent="handleSendMessage" class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input 
            v-model="userInput" 
            type="text" 
            placeholder="Bir soru yazın veya konu seçin..." 
            class="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052FF] focus:outline-none bg-slate-50"
          />
          <button 
            type="submit" 
            :disabled="!userInput.trim()"
            class="h-9 w-9 rounded-xl bg-[#0052FF] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <Send :size="15" />
          </button>
        </form>
      </div>
    </transition>

    <!-- FLOATING ACTION BUTTONS (WHATSAPP + AI BOT) -->
    <div class="flex items-center gap-2.5">
      
      <!-- WHATSAPP DIRECT BUTTON -->
      <a 
        v-if="supportConfig.whatsappEnabled"
        :href="whatsappUrl" 
        target="_blank"
        title="WhatsApp Canlı Destek"
        class="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-xs font-black"
      >
        <!-- WhatsApp Icon SVG -->
        <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.54 1.761.819 2.796.819 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.503-4.497 10-10 10-1.758 0-3.411-.458-4.857-1.258l-7.143 1.87 1.902-6.953c-.878-1.503-1.378-3.238-1.378-5.079 0-5.503 4.497-10 10-10 5.503 0 10 4.497 10 10z"/>
        </svg>
        <span class="hidden sm:inline-block">WhatsApp Destek</span>
      </a>

      <!-- AI ASSISTANT TOGGLE BUTTON -->
      <button 
        v-if="supportConfig.aiEnabled"
        @click="isChatOpen = !isChatOpen"
        class="group relative flex items-center gap-2 px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-xs font-black text-white"
        :class="isChatOpen ? 'bg-slate-900' : 'bg-gradient-to-r from-[#0F223D] via-blue-900 to-[#0052FF]'"
      >
        <!-- Animated pulse ring when chat is closed -->
        <span v-if="!isChatOpen" class="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping"></span>

        <div class="relative flex items-center gap-2">
          <Bot v-if="!isChatOpen" :size="18" class="text-emerald-400" />
          <X v-else :size="18" />
          <span class="hidden sm:inline-block">{{ isChatOpen ? 'Kapat' : 'AI Asistan' }}</span>
          <span v-if="!isChatOpen" class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </button>

    </div>

  </div>
</template>

<style scoped>
.chat-popup-enter-active, .chat-popup-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-popup-enter-from, .chat-popup-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
