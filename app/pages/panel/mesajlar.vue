<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessageSquare, Send, CheckCheck, FileText, Search, User } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const chats = ref([
  {
    id: 'chat-1',
    tender: 'Ofis Malzemeleri Alımı (IHC-DEMO)',
    company: 'ABC Ofis Malzemeleri A.Ş.',
    initial: 'A',
    status: 'online',
    lastMessage: 'Fiyat teklifimizi güncelledik, onayınızı bekliyoruz.',
    time: '14:25',
    unread: 1,
    messages: [
      { sender: 'them', text: 'Merhabalar, mukavva dosya ve A4 kağıt kalemleri için teklifimizi ilettik.', time: '10:15' },
      { sender: 'me', text: 'Selamlar, teklifinizi inceledik. Teslimat süresi bizim için kritik. En erken ne zaman teslim edebilirsiniz?', time: '10:30' },
      { sender: 'them', text: 'İstanbul içine kendi araçlarımızla 3 iş günü içerisinde teslimat garantisi veriyoruz.', time: '10:45' },
      { sender: 'me', text: 'Harika. Fiyatta küçük bir iskonto yapmanız mümkün müdür?', time: '11:15' },
      { sender: 'them', text: 'Sizin için toplam fiyatta %5 indirim uygulayıp teklifimizi 38.500 ₺ olarak güncelledik.', time: '14:25' }
    ]
  },
  {
    id: 'chat-2',
    tender: 'Güvenlik Kamera Sistemi (IHC-DEMO)',
    company: 'SecureTech Sistemleri',
    initial: 'S',
    status: 'offline',
    lastMessage: 'Kamera montaj kılavuzu ve teknik PDF ekte yer alıyor.',
    time: 'Dün',
    unread: 0,
    messages: [
      { sender: 'them', text: 'Merhabalar, teklif ettiğimiz IP kameralar 4K çözünürlüğe sahip ve gece görüş desteklidir.', time: 'Dün 15:20' },
      { sender: 'me', text: 'Harika, montaj dahil midir yoksa sadece ürün tedariği mi?', time: 'Dün 15:45' },
      { sender: 'them', text: 'Montaj ve 2 yıllık yerinde garanti hizmeti fiyata dahildir. Teknik PDF dosyasını inceleyebilirsiniz.', time: 'Dün 16:00' }
    ]
  },
  {
    id: 'chat-3',
    tender: 'Lojistik Hizmet Alımı (IHC-DEMO)',
    company: 'HızlıNakliye Ltd.',
    initial: 'H',
    status: 'online',
    lastMessage: 'SRC-4 belgelerimiz ve sigorta detaylarımız sisteme yüklendi.',
    time: '2 gün önce',
    unread: 0,
    messages: [
      { sender: 'them', text: 'Merhaba, İzmir-Kocaeli hattı için tır bazında navlun teklifimizi sunduk.', time: '2 gün önce' },
      { sender: 'me', text: 'Belgeleriniz eksiksiz mi? CMR sigortanız bulunuyor mu?', time: '2 gün önce' }
    ]
  }
])

const activeChatIndex = ref(0)
const activeChat = computed(() => chats.value[activeChatIndex.value])
const newMessage = ref('')

const searchQuery = ref('')
const filteredChats = computed(() => 
  chats.value.filter(c => 
    c.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.tender.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function sendMessage() {
  if (!newMessage.value.trim()) return

  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  activeChat.value.messages.push({
    sender: 'me',
    text: newMessage.value.trim(),
    time: timeStr
  })

  activeChat.value.lastMessage = newMessage.value.trim()
  activeChat.value.time = timeStr
  newMessage.value = ''

  // Simulate supplier reply automatically after 1.5 seconds
  setTimeout(() => {
    if (activeChatIndex.value === 0) {
      activeChat.value.messages.push({
        sender: 'them',
        text: 'Anlaşıldı efendim, taleplerinizi operasyon ekibimize bildirdik. İyi çalışmalar dileriz.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      activeChat.value.lastMessage = 'Anlaşıldı efendim, taleplerinizi operasyon ekibimize...'
    }
  }, 1500)
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left">
    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <MessageSquare class="text-blue-600" :size="22" />
        Mesajlar & Pazarlık Arenası
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Tedarikçilerle teklif şartlarını, vade, fiyat ve lojistik detaylarını canlı görüşün</p>
    </div>

    <!-- Sohbet Arayüzü -->
    <div class="grid grid-cols-1 md:grid-cols-3 rounded-2xl border bg-white shadow-sm overflow-hidden h-[600px]" style="border-color: #E2E8F0;">
      
      <!-- Sol Sütun: Konuşmalar Listesi -->
      <div class="border-r flex flex-col bg-slate-50/50" style="border-color: #E2E8F0;">
        <!-- Arama Kutusu -->
        <div class="p-4 border-b" style="border-color: #E2E8F0;">
          <div class="relative">
            <Search class="absolute left-3 top-2.5 text-slate-400" :size="15" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Firma veya İhale Ara..." 
              class="w-full rounded-lg border py-2 pl-9 pr-3 text-xs outline-none bg-white focus:border-blue-500 transition" 
              style="border-color: #CBD5E1; color: #0F172A;"
            />
          </div>
        </div>

        <!-- Sohbet Kartları -->
        <div class="flex-1 overflow-y-auto space-y-1 p-2">
          <button 
            v-for="(chat, idx) in filteredChats" 
            :key="chat.id"
            @click="() => { activeChatIndex = idx; chat.unread = 0 }"
            class="w-full flex items-start gap-3 rounded-xl p-3 text-left transition"
            :class="activeChatIndex === idx ? 'bg-blue-50/70 border border-blue-100 shadow-sm' : 'hover:bg-slate-100/50 border border-transparent'"
          >
            <!-- Avatar -->
            <div class="relative">
              <div 
                class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                style="background: linear-gradient(135deg, #1E3A5F, #2563EB);"
              >
                {{ chat.initial }}
              </div>
              <span 
                class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white"
                :class="chat.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'"
              ></span>
            </div>

            <!-- Kart Bilgileri -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-0.5">
                <h4 class="text-xs font-bold text-slate-900 truncate">{{ chat.company }}</h4>
                <span class="text-[10px] text-slate-400 shrink-0 font-medium">{{ chat.time }}</span>
              </div>
              <div class="text-[10px] font-semibold text-blue-600 truncate mb-1">{{ chat.tender }}</div>
              <p class="text-xs text-slate-500 truncate">{{ chat.lastMessage }}</p>
            </div>

            <!-- Okunmamış Sayacı -->
            <span 
              v-if="chat.unread > 0" 
              class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white self-center"
              style="background: #EF4444;"
            >
              {{ chat.unread }}
            </span>
          </button>
        </div>
      </div>

      <!-- Sağ Sütun: Aktif Mesajlaşma Ekranı -->
      <div class="md:col-span-2 flex flex-col h-full bg-slate-50">
        
        <!-- Üst Bilgi Barı -->
        <div class="px-6 py-4 border-b bg-white flex items-center justify-between" style="border-color: #E2E8F0;">
          <div>
            <h3 class="font-bold text-sm text-slate-900">{{ activeChat.company }}</h3>
            <p class="text-xs text-blue-600 font-semibold">{{ activeChat.tender }}</p>
          </div>
          <span 
            class="text-[10px] font-bold rounded px-2 py-0.5"
            :class="activeChat.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
          >
            {{ activeChat.status === 'online' ? 'Aktif' : 'Çevrimdışı' }}
          </span>
        </div>

        <!-- Mesaj Akışı -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div 
            v-for="msg in activeChat.messages" 
            :key="msg.text"
            class="flex flex-col max-w-[70%] rounded-2xl p-4 shadow-sm"
            :class="msg.sender === 'me' 
              ? 'ml-auto bg-blue-600 text-white rounded-br-none' 
              : 'bg-white text-slate-800 border rounded-bl-none'"
            :style="msg.sender === 'me' ? '' : 'border-color: #E2E8F0;'"
          >
            <p class="text-sm leading-relaxed">{{ msg.text }}</p>
            <span 
              class="text-[9px] mt-1.5 self-end flex items-center gap-1 font-medium"
              :class="msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'"
            >
              {{ msg.time }}
              <CheckCheck v-if="msg.sender === 'me'" :size="12" />
            </span>
          </div>
        </div>

        <!-- Mesaj Yazma Paneli -->
        <form @submit.prevent="sendMessage" class="p-4 border-t bg-white flex items-center gap-3" style="border-color: #E2E8F0;">
          <input 
            v-model="newMessage"
            type="text" 
            placeholder="Mesajınızı yazın..." 
            class="flex-1 rounded-xl border p-3 text-sm outline-none transition focus:border-blue-500" 
            style="border-color: #CBD5E1; color: #0F172A;"
          />
          <button 
            type="submit" 
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg shadow-blue-500/10"
          >
            <Send :size="16" />
          </button>
        </form>

      </div>

    </div>
  </div>
</template>
