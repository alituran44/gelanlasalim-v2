<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessageSquare, Send, CheckCheck, FileText, Search, User, Paperclip, Phone, ShieldCheck, ExternalLink, Package, ArrowLeft } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const { cmsData, saveCmsData } = useCmsData()

const defaultInitialChats = [
  {
    id: 'chat-178',
    tenderId: 'IHC-2026-178',
    tender: 'aesredtruıo85urıy (Lojistik ve Havayolu)',
    company: 'Ata Akademi San. Tic. A.Ş.',
    buyerCompany: 'Ali Turan San. Tic. A.Ş.',
    initial: 'A',
    status: 'online',
    orderCode: 'SIP-2026-8819',
    amount: '75.000 ₺',
    lastMessage: 'İhale mutabakatı sağlandı. Sevkiyat planlamasını buradan koordine edebilirsiniz.',
    time: 'Az önce',
    unread: 0,
    messages: [
      { 
        sender: 'system', 
        text: '🎉 TEBRİKLER! "aesredtruıo85urıy" ihalesinde 75.000 ₺ bedelle mutabakat sağlandı. TCMB lisanslı güvenli havuz açıldı. Sevkiyat, faturalandırma ve teslimat detaylarını buradan görüşebilirsiniz.', 
        time: 'Bugün' 
      },
      { 
        sender: 'them', 
        text: 'Merhaba Ali Bey, hayırlı olsun. Lojistik ve taşıma belgelerini hazırlıyoruz, yarın sabah sevkiyata hazır olacağız.', 
        time: '10:15' 
      },
      { 
        sender: 'me', 
        text: 'Teşekkürler. İrsaliye kopyasını sisteme yükledikten sonra takip numarasını buradan da iletirseniz mal kabul ekibimizi bilgilendireceğiz.', 
        time: '10:30' 
      }
    ]
  },
  {
    id: 'chat-089',
    tenderId: 'IHC-2026-089',
    tender: 'Toptan Motorin ve Madeni Yağ Temini',
    company: 'Petrol Taşımacılık Sanayi A.Ş.',
    buyerCompany: 'Ege İnşaat Madencilik A.Ş.',
    initial: 'P',
    status: 'online',
    orderCode: 'SIP-2026-6621',
    amount: '450.000 ₺',
    lastMessage: 'Tanker dolumu tamamlandı, irsaliye sisteme girildi.',
    time: '14:25',
    unread: 0,
    messages: [
      { 
        sender: 'system', 
        text: '🎉 TEBRİKLER! "Toptan Motorin ve Madeni Yağ Temini" ihalesi için 450.000 ₺ bedelle anlaşma sağlandı.', 
        time: 'Dün' 
      },
      { sender: 'them', text: 'Tanker filomuz yola çıktı, takip kodunu sisteme girdik.', time: '14:20' },
      { sender: 'me', text: 'Teşekkür ederiz, şantiyede karşılama ekibimiz hazır bekliyor.', time: '14:25' }
    ]
  },
  {
    id: 'chat-114',
    tenderId: 'IHC-2026-114',
    tender: 'Ofis Malzemeleri & Kırtasiye Alımı',
    company: 'ABC Ofis Malzemeleri A.Ş.',
    buyerCompany: 'Ali Turan San. Tic. A.Ş.',
    initial: 'A',
    status: 'offline',
    orderCode: 'SIP-2026-3104',
    amount: '38.500 ₺',
    lastMessage: 'Fiyat teklifimizi güncelledik, onayınızı bekliyoruz.',
    time: '2 gün önce',
    unread: 0,
    messages: [
      { sender: 'them', text: 'Merhabalar, mukavva dosya ve A4 kağıt kalemleri için teklifimizi ilettik.', time: '10:15' },
      { sender: 'me', text: 'Selamlar, teslimat süresi bizim için kritik. En erken ne zaman teslim edebilirsiniz?', time: '10:30' },
      { sender: 'them', text: 'İstanbul içine kendi araçlarımızla 3 iş günü içerisinde teslimat garantisi veriyoruz.', time: '10:45' }
    ]
  }
]

const chats = ref<any[]>([])
const activeChatIndex = ref(0)
const activeChat = computed(() => chats.value[activeChatIndex.value] || chats.value[0])
const newMessage = ref('')
const searchQuery = ref('')

function loadChats() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('b2b_messages_chats')
      if (saved) {
        chats.value = JSON.parse(saved)
      } else {
        chats.value = defaultInitialChats
        localStorage.setItem('b2b_messages_chats', JSON.stringify(defaultInitialChats))
      }
    } catch (e) {
      chats.value = defaultInitialChats
    }
  } else {
    chats.value = defaultInitialChats
  }

  // Handle URL Query Params (e.g. ?tenderId=IHC-2026-178&company=...)
  const queryTenderId = route.query.tenderId as string
  const queryCompany = route.query.company as string
  const queryTenderTitle = route.query.title as string
  const queryOrderCode = route.query.orderCode as string
  const queryAmount = route.query.amount as string

  if (queryTenderId || queryCompany) {
    let foundIdx = chats.value.findIndex(c => 
      (queryTenderId && c.tenderId === queryTenderId) ||
      (queryCompany && c.company.toLowerCase().includes(queryCompany.toLowerCase()))
    )

    if (foundIdx === -1) {
      // Create new chat thread
      const compName = queryCompany || 'Kurumsal Firma'
      const newChatObj = {
        id: 'chat-' + Date.now(),
        tenderId: queryTenderId || 'IHC-' + Date.now(),
        tender: queryTenderTitle || (queryTenderId ? `İhale (${queryTenderId})` : 'Kurumsal Satın Alma İhalesi'),
        company: compName,
        buyerCompany: 'Ali Turan San. Tic. A.Ş.',
        initial: compName.charAt(0).toUpperCase(),
        status: 'online',
        orderCode: queryOrderCode || 'SIP-2026-' + Math.floor(1000 + Math.random() * 9000),
        amount: queryAmount || 'Belirtildi',
        lastMessage: 'Mutabakat sağlandı. Görüşme başlatıldı.',
        time: 'Şimdi',
        unread: 0,
        messages: [
          {
            sender: 'system',
            text: `🎉 TEBRİKLER! "${queryTenderTitle || queryTenderId || 'Satın Alma Talebi'}" için mutabakat sağlandı. Karşılıklı faturalandırma, irsaliye ve teslimat detaylarını buradan görüşebilirsiniz.`,
            time: 'Şimdi'
          },
          {
            sender: 'them',
            text: 'Merhaba, anlaşma için teşekkür ederiz. Sipariş hazırlıklarına başladık. Herhangi bir sorunuz olursa buradan yazabilirsiniz.',
            time: 'Şimdi'
          }
        ]
      }
      chats.value.unshift(newChatObj)
      foundIdx = 0
      saveChatsToStorage()
    }

    activeChatIndex.value = foundIdx
  }
}

function saveChatsToStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('b2b_messages_chats', JSON.stringify(chats.value))
    } catch (e) {}
  }
}

onMounted(() => {
  loadChats()
})

watch(() => route.query, () => {
  loadChats()
})

const filteredChats = computed(() => 
  chats.value.filter(c => 
    (c.company || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (c.tender || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (c.orderCode || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function sendMessage() {
  if (!newMessage.value.trim() || !activeChat.value) return

  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const userMsg = {
    sender: 'me',
    text: newMessage.value.trim(),
    time: timeStr
  }

  activeChat.value.messages.push(userMsg)
  activeChat.value.lastMessage = newMessage.value.trim()
  activeChat.value.time = timeStr
  newMessage.value = ''
  saveChatsToStorage()

  // Simulate automated realistic partner reply
  setTimeout(() => {
    if (activeChat.value) {
      activeChat.value.messages.push({
        sender: 'them',
        text: 'Mesajınız operasyon ekibimiz tarafından alındı. İşlemleriniz güvenli havuz protokolüne uygun olarak sürdürülmektedir.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      activeChat.value.lastMessage = 'Mesajınız operasyon ekibimiz tarafından alındı...'
      saveChatsToStorage()
    }
  }, 1200)
}

function handleAttachment() {
  const mockFiles = ['Teknik_Sartname_Onayli.pdf', 'Irsaliye_Belgesi_2026.pdf', 'Urun_Katalogu_V2.pdf', 'Numune_Fotograflari.zip']
  const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)]
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (activeChat.value) {
    activeChat.value.messages.push({
      sender: 'me',
      text: `📎 Dosya Eki Gönderildi: ${randomFile}`,
      fileAttachment: randomFile,
      time: timeStr
    })
    activeChat.value.lastMessage = `📎 ${randomFile}`
    activeChat.value.time = timeStr
    saveChatsToStorage()
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto text-left space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black flex items-center gap-2.5 text-slate-900 dark:text-white">
          <MessageSquare class="text-blue-600" :size="24" />
          B2B Canlı Mesajlaşma & Anlaşma Arenası
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Onaylanan ihalelerdeki alıcı ve tedarikçiler ile doğrudan, şifreli ve sözleşme kayıtlı iletişim kurun.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink 
          to="/panel/siparis-teslimat" 
          class="px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition flex items-center gap-1.5 border border-blue-500/20"
        >
          <Package :size="14" />
          <span>Sipariş & Escrow Masası →</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Chat Workspace -->
    <div class="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-h-[680px]">
      
      <!-- Sol Sütun: Konuşmalar Listesi (4 Kolon) -->
      <div class="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-950/60">
        
        <!-- Arama Kutusu -->
        <div class="p-3.5 border-b border-slate-200 dark:border-slate-800">
          <div class="relative">
            <Search class="absolute left-3 top-2.5 text-slate-400" :size="15" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Firma, İhale veya Sipariş No Ara..." 
              class="w-full rounded-xl border border-slate-200 dark:border-slate-800 py-2 pl-9 pr-3 text-xs outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 transition shadow-2xs" 
            />
          </div>
        </div>

        <!-- Sohbet Listesi -->
        <div class="flex-1 overflow-y-auto space-y-1.5 p-2.5">
          <button 
            v-for="(chat, idx) in filteredChats" 
            :key="chat.id || idx"
            @click="() => { activeChatIndex = idx; chat.unread = 0; saveChatsToStorage() }"
            class="w-full flex items-start gap-3 rounded-2xl p-3 text-left transition relative cursor-pointer"
            :class="activeChatIndex === idx ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-transparent'"
          >
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div 
                class="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black shadow-xs"
                :class="activeChatIndex === idx ? 'bg-white text-blue-600' : 'bg-gradient-to-br from-blue-700 to-indigo-800 text-white'"
              >
                {{ chat.initial || (chat.company ? chat.company.charAt(0).toUpperCase() : 'B') }}
              </div>
              <span 
                class="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2"
                :class="[
                  activeChatIndex === idx ? 'ring-blue-600' : 'ring-white dark:ring-slate-900',
                  chat.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                ]"
              ></span>
            </div>

            <!-- Thread Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <span class="font-black text-xs truncate" :class="activeChatIndex === idx ? 'text-white' : 'text-slate-900 dark:text-white'">
                  {{ chat.company }}
                </span>
                <span class="text-[10px] font-mono shrink-0" :class="activeChatIndex === idx ? 'text-blue-100' : 'text-slate-400'">
                  {{ chat.time }}
                </span>
              </div>

              <div class="text-[11px] font-bold truncate mt-0.5" :class="activeChatIndex === idx ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'">
                {{ chat.tender }}
              </div>

              <div class="flex items-center justify-between gap-2 mt-1">
                <p class="text-[11px] truncate flex-1" :class="activeChatIndex === idx ? 'text-blue-100/90' : 'text-slate-500 dark:text-slate-400'">
                  {{ chat.lastMessage }}
                </p>
                <span v-if="chat.orderCode" class="text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 font-bold" :class="activeChatIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'">
                  {{ chat.orderCode }}
                </span>
              </div>
            </div>
          </button>

          <div v-if="filteredChats.length === 0" class="text-center py-12 text-slate-400 text-xs">
            Aramanıza uygun mesajlaşma bulunamadı.
          </div>
        </div>
      </div>

      <!-- Sağ Sütun: Aktif Mesaj Penceresi (8 Kolon) -->
      <div v-if="activeChat" class="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
        
        <!-- Chat Header -->
        <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-950/40">
          <div class="flex items-center gap-3 min-w-0">
            <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {{ activeChat.initial || activeChat.company.charAt(0) }}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-black text-sm text-slate-900 dark:text-white truncate">{{ activeChat.company }}</h3>
                <span class="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck :size="10" /> Doğrulanmış Firma
                </span>
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 truncate">
                <span class="font-bold text-blue-600 dark:text-blue-400 truncate">{{ activeChat.tender }}</span>
                <span v-if="activeChat.amount" class="text-emerald-600 dark:text-emerald-400 font-mono font-black">• {{ activeChat.amount }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink 
              :to="`/panel/siparis-teslimat`" 
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 shadow-2xs"
            >
              <Package :size="13" class="text-blue-500" />
              <span>Sipariş Detayı</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Chat Messages Feed -->
        <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-50/20 dark:bg-slate-950/20">
          <div 
            v-for="(msg, mIdx) in activeChat.messages" 
            :key="mIdx"
            class="flex flex-col"
            :class="msg.sender === 'me' ? 'items-end' : (msg.sender === 'system' ? 'items-center' : 'items-start')"
          >
            <!-- System Milestone Message -->
            <div v-if="msg.sender === 'system'" class="my-2 max-w-lg p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 text-xs text-center leading-relaxed font-medium shadow-2xs">
              {{ msg.text }}
            </div>

            <!-- Regular Chat Bubbles -->
            <div 
              v-else 
              class="max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs transition"
              :class="msg.sender === 'me' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-blue-600/10' 
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-none'"
            >
              <div class="leading-relaxed whitespace-pre-line">{{ msg.text }}</div>
              <div 
                v-if="msg.fileAttachment" 
                class="mt-2 p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold"
                :class="msg.sender === 'me' ? 'bg-blue-700/60 border-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400'"
              >
                <div class="flex items-center gap-1.5 truncate">
                  <FileText :size="13" />
                  <span class="truncate">{{ msg.fileAttachment }}</span>
                </div>
                <button type="button" class="underline text-[10px] cursor-pointer">İndir</button>
              </div>
              <div 
                class="text-[10px] flex items-center justify-end gap-1"
                :class="msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'"
              >
                <span>{{ msg.time }}</span>
                <CheckCheck v-if="msg.sender === 'me'" :size="12" class="text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Footer -->
        <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2">
            <button 
              type="button" 
              @click="handleAttachment"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Şartname / Belge / İrsaliye Ekle"
            >
              <Paperclip :size="16" />
            </button>

            <input 
              v-model="newMessage"
              type="text" 
              placeholder="Mesajınızı yazın (Fiyat, vade, teslimat ve şartname detayları)..." 
              class="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 transition" 
            />

            <button 
              type="submit" 
              class="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Send :size="14" />
              <span class="hidden sm:inline">Gönder</span>
            </button>
          </form>
          <div class="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>🔒 Mesajlaşmalar KVKK ve İhaleciBurada B2B Güvenli Ticaret Protokolü ile kayıt altına alınmaktadır.</span>
            <span>Escrow Güvenceli Sohbet</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
