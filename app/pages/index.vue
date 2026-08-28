<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  MapPin,
  Building2,
  Building,
  Clock3,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Scale,
  Globe2,
  Handshake,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  X,
  Zap,
  Briefcase,
  Play,
  User,
  Bell,
  Inbox,
  Send,
  Users,
  Home,
  Check,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  Eye,
  MessageSquare,
  HelpCircle,
  Award,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Camera,
  Filter,
  DollarSign,
  Layers,
  ThumbsUp,
  Share2
} from 'lucide-vue-next'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada — Letgo Kolaylığında B2B Teklif & Pazarlık Borsası',
  description: 'Tıpkı Letgo kolaylığında: İhtiyacını ilan ver, anında kurumsal teklifler al, mesajla pazarlık yap ve el sıkış!'
})

// ==================== STATE ====================
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedCity = ref('all')
const searchMode = ref<'all' | 'buyer' | 'seller'>('all')

// Modallar
const showNewTenderModal = ref(false)
const showChatModal = ref(false)
const showProfileModal = ref(false)
const showRateModal = ref(false)
const activeChatTender = ref<any>(null)
const activeChatMessages = ref<any[]>([])
const newChatMessage = ref('')
const offerInputPrice = ref('')
const counterOfferInputPrice = ref('')
const isBargaining = ref(false)

// Kullanıcı Oturumu
const userSession = ref<any>({
  companyName: 'Metropol İnşaat A.Ş.',
  phone: '0850 308 00 00',
  city: 'Çanakkale',
  rating: 4.9,
  ratingCount: 84
})

// Letgo Tarzı Yatay İkon Kategorileri
const iconCategories = [
  { slug: 'all', name: 'Tümü', icon: '🌐' },
  { slug: 'insaat', name: 'İnşaat & Yapı', icon: '🏗️' },
  { slug: 'sanayi', name: 'Sanayi & Makine', icon: '⚙️' },
  { slug: 'ambalaj', name: 'Ambalaj & Koli', icon: '📦' },
  { slug: 'lojistik', name: 'Lojistik & Nakliye', icon: '🚚' },
  { slug: 'enerji', name: 'Enerji & GES', icon: '⚡' },
  { slug: 'tarim', name: 'Tarım & Gıda', icon: '🌾' },
  { slug: 'bilisim', name: 'Bilişim & Yazılım', icon: '💻' },
  { slug: 'diger', name: 'Diğer Sektörler', icon: '🏷️' }
]

// Canlı İlanlar (Letgo Kart Akışı)
const tenders = ref([
  {
    id: 1,
    title: '1.500 Ton Nervürlü İnşaat Demiri Alımı',
    company: 'Metropol İnşaat Taahhüt A.Ş.',
    companyPhone: '0850 308 00 00',
    rating: 4.9,
    ratingCount: 128,
    category: 'insaat',
    categoryName: 'İnşaat & Yapı',
    price: '14.500.000 ₺',
    priceNumeric: 14500000,
    priceType: 'Hedef Bütçe',
    city: 'Çanakkale',
    timeAgo: '15 dk önce',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    description: 'Şantiye teslimi TSE belgeli 12 metre nervürlü inşaat demiri aranıyor. Anında nakit/teminatlı ödeme.',
    bidsCount: 6,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 2,
    title: '100.000 Adet Çift Oluklu Taşıma Kolisi',
    company: 'Global Retail Dağıtım A.Ş.',
    companyPhone: '0212 555 10 20',
    rating: 4.8,
    ratingCount: 64,
    category: 'ambalaj',
    categoryName: 'Ambalaj & Koli',
    price: '350.000 ₺',
    priceNumeric: 350000,
    priceType: 'Hedef Fiyat',
    city: 'İstanbul',
    timeAgo: '40 dk önce',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    description: 'Özel logo baskılı 60x40x40 e-ticaret sevkiyat kolisi üretimi. Numune onayından sonra hemen sipariş.',
    bidsCount: 9,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 40
  },
  {
    id: 3,
    title: 'Fabrika Çatısı 1.2 MW Güneş Enerji Santrali (GES)',
    company: 'Anadolu Döküm Sanayi Ltd.',
    companyPhone: '0262 444 80 90',
    rating: 4.9,
    ratingCount: 95,
    category: 'enerji',
    categoryName: 'Enerji & GES',
    price: '18.200.000 ₺',
    priceNumeric: 18200000,
    priceType: 'Yaklaşık Maliyet',
    city: 'Kocaeli',
    timeAgo: '1 saat önce',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    description: 'Anahtar teslim çatı GES kurulumu, invertör ve TEDAŞ onay süreçleri dahil teklif toplanmaktadır.',
    bidsCount: 4,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 60
  },
  {
    id: 4,
    title: '50 Seferlik Liman - Fabrika Konteyner Taşımacılığı',
    company: 'Marmara Kimya İthalat A.Ş.',
    companyPhone: '0282 333 40 50',
    rating: 4.7,
    ratingCount: 41,
    category: 'lojistik',
    categoryName: 'Lojistik & Nakliye',
    price: '450.000 ₺',
    priceNumeric: 450000,
    priceType: 'Toplam Bütçe',
    city: 'Tekirdağ',
    timeAgo: '2 saat önce',
    image: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800&auto=format&fit=crop&q=80',
    description: 'Asyaport çıkışlı Çorlu fabrika sahasına 40ft konteyner nakliyesi. Günlük 4 araç düzenli sevkiyat.',
    bidsCount: 8,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 120
  },
  {
    id: 5,
    title: 'CNC 5 Eksen Dik İşleme Merkezi Makine Alımı',
    company: 'Savunma ve Havacılık Pres A.Ş.',
    companyPhone: '0312 800 90 00',
    rating: 5.0,
    ratingCount: 33,
    category: 'sanayi',
    categoryName: 'Sanayi & Makine',
    price: '6.800.000 ₺',
    priceNumeric: 6800000,
    priceType: 'Satın Alma Bütçesi',
    city: 'Ankara',
    timeAgo: '3 saat önce',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    description: 'Havacılık standartlarında parça imalatı için 5 eksen CNC işleme merkezi alınacaktır.',
    bidsCount: 3,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 180
  },
  {
    id: 6,
    title: '500 Ton Organik Sıvı Solucan Gübresi Alımı',
    company: 'Doğa Tarım ve Seracılık A.Ş.',
    companyPhone: '0242 700 11 22',
    rating: 4.8,
    ratingCount: 50,
    category: 'tarim',
    categoryName: 'Tarım & Gıda',
    price: '850.000 ₺',
    priceNumeric: 850000,
    priceType: 'Bütçe',
    city: 'Antalya',
    timeAgo: '4 saat önce',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    description: 'Sera üretiminde kullanılmak üzere sertifikalı sıvı organik gübre tedarikçisi aranıyor.',
    bidsCount: 5,
    status: 'Aktif Pazarlık 💬',
    createdAt: Date.now() - 1000 * 60 * 240
  }
])

// localStorage'dan eklenen ilanları da yükle
function loadStoredTenders() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('myTenders') || localStorage.getItem('userTenders')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item: any, idx: number) => ({
            id: item.id || (5000 + idx),
            title: item.title || item.baslik || 'Özel B2B İhale İlanı',
            company: item.company || userSession.value.companyName,
            companyPhone: item.phone || userSession.value.phone,
            rating: 4.9,
            ratingCount: 12,
            category: 'diger',
            categoryName: item.category || 'Özel Kategori',
            price: item.budget || (item.budgetNumeric ? Number(item.budgetNumeric).toLocaleString('tr-TR') + ' ₺' : 'Pazarlıklı'),
            priceNumeric: item.budgetNumeric || 100000,
            priceType: 'Hedef Bütçe',
            city: item.city || item.sehir || 'Türkiye',
            timeAgo: 'Yeni İlan ⚡',
            image: item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
            description: item.description || item.aciklama || item.title,
            bidsCount: 0,
            status: 'Yeni İlan ⚡',
            createdAt: item.createdAt || Date.now()
          }))
          tenders.value = [...formatted, ...tenders.value]
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

// Filtrelenmiş İlanlar
const filteredTenders = computed(() => {
  return tenders.value.filter(item => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLocaleLowerCase('tr').trim()
      const inTitle = item.title.toLocaleLowerCase('tr').includes(q)
      const inCompany = item.company.toLocaleLowerCase('tr').includes(q)
      const inDesc = item.description.toLocaleLowerCase('tr').includes(q)
      if (!inTitle && !inCompany && !inDesc) return false
    }

    if (selectedCategory.value !== 'all') {
      if (item.category !== selectedCategory.value) return false
    }

    if (selectedCity.value !== 'all') {
      if (item.city !== selectedCity.value) return false
    }

    return true
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

// ==================== LETGO SOHBET & PAZARLIK MASASI ====================
function openChatForTender(tender: any) {
  activeChatTender.value = tender
  offerInputPrice.value = String(Math.round(tender.priceNumeric * 0.95))
  counterOfferInputPrice.value = ''
  isBargaining.value = false

  // Örnek başlangıç sohbeti
  activeChatMessages.value = [
    {
      id: 1,
      sender: tender.company,
      isMe: false,
      text: `Merhaba! "${tender.title}" ilanımız için şartnameye uygun teklifinizi veya sorularınızı buradan iletebilirsiniz.`,
      time: '10:00'
    },
    {
      id: 2,
      sender: 'Sistem',
      isSystem: true,
      text: `💰 İlan Sahibi Hedef Bütçesi: ${tender.price} | 📍 Konum: ${tender.city}`,
      time: '10:01'
    }
  ]

  showChatModal.value = true
}

function sendTextMessage() {
  if (!newChatMessage.value.trim()) return
  activeChatMessages.value.push({
    id: Date.now(),
    sender: userSession.value.companyName,
    isMe: true,
    text: newChatMessage.value.trim(),
    time: 'Şimdi'
  })
  newChatMessage.value = ''

  // Karşı taraftan otomatik gerçekçi yanıt simülasyonu
  setTimeout(() => {
    activeChatMessages.value.push({
      id: Date.now() + 1,
      sender: activeChatTender.value.company,
      isMe: false,
      text: 'Mesajınızı aldık. Teknik ekibimiz şartname uygunluğunu inceliyor; fiyat teklifinizi onaylayabilir veya karşı teklif sunabiliriz.',
      time: 'Şimdi'
    })
  }, 1200)
}

function makeOffer() {
  if (!offerInputPrice.value) {
    alert('Lütfen teklif tutarınızı giriniz.')
    return
  }
  const priceFormatted = Number(offerInputPrice.value).toLocaleString('tr-TR') + ' ₺'
  activeChatMessages.value.push({
    id: Date.now(),
    sender: userSession.value.companyName,
    isMe: true,
    isOffer: true,
    offerAmount: priceFormatted,
    text: `⚡ TEKLİF SUNDUM: ${priceFormatted}`,
    time: 'Şimdi'
  })

  setTimeout(() => {
    activeChatMessages.value.push({
      id: Date.now() + 1,
      sender: activeChatTender.value.company,
      isMe: false,
      isCounterOffer: true,
      counterAmount: Number(Number(offerInputPrice.value) * 1.02).toLocaleString('tr-TR') + ' ₺',
      text: `💬 Teklifinizi gördük. ${Number(Number(offerInputPrice.value) * 1.02).toLocaleString('tr-TR')} ₺ yaparsanız hemen el sıkışıp sözleşmeyi imzalayabiliriz!`,
      time: 'Şimdi'
    })
  }, 1500)
}

function acceptDeal() {
  alert(`🤝 TEBRİKLER! EL SIKIŞILDI VE ANLAŞMA SAĞLANDI!\n\n${activeChatTender.value.company} ile mutabakat sağlandı. Zaman damgalı e-tutanak ve fatura bilgileri oluşturuldu.`)
  activeChatMessages.value.push({
    id: Date.now(),
    sender: 'Sistem',
    isSystem: true,
    text: `🎉 TEBRİKLER! İKİ TARAF DA ANLAŞTI VE EL SIKIŞILDI 🤝 (İhale Kilitlendi)`,
    time: 'Şimdi'
  })
}

// ==================== LETGO TARZI 30 SANİYEDE İLAN VER ====================
const newTenderForm = ref({
  title: '',
  category: 'insaat',
  budget: '',
  city: 'Çanakkale',
  description: '',
  phone: '0850 308 00 00'
})

function submitNewTender() {
  if (!newTenderForm.value.title || !newTenderForm.value.budget) {
    alert('Lütfen ilan başlığı ve bütçenizi giriniz.')
    return
  }

  const createdItem = {
    id: Date.now(),
    title: newTenderForm.value.title,
    company: userSession.value.companyName,
    companyPhone: newTenderForm.value.phone,
    rating: 5.0,
    ratingCount: 1,
    category: newTenderForm.value.category,
    categoryName: iconCategories.find(c => c.slug === newTenderForm.value.category)?.name || 'Genel',
    price: Number(newTenderForm.value.budget).toLocaleString('tr-TR') + ' ₺',
    priceNumeric: Number(newTenderForm.value.budget),
    priceType: 'Hedef Bütçe',
    city: newTenderForm.value.city,
    timeAgo: 'Az önce',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    description: newTenderForm.value.description || newTenderForm.value.title,
    bidsCount: 0,
    status: 'Yayında ⚡',
    createdAt: Date.now()
  }

  // Listeye en üste ekle
  tenders.value.unshift(createdItem)

  // LocalStorage'a kaydet
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('myTenders') || '[]')
      existing.unshift(createdItem)
      localStorage.setItem('myTenders', JSON.stringify(existing))
    } catch (e) {
      console.error(e)
    }
  }

  showNewTenderModal.value = false
  newTenderForm.value = {
    title: '',
    category: 'insaat',
    budget: '',
    city: 'Çanakkale',
    description: '',
    phone: '0850 308 00 00'
  }

  alert('🎉 İLANINIZ LETGO HIZIYLA ANINDA YAYINA ALINDI!\n\nTedarikçiler anında ilanınızı görüp teklif ve mesaj göndermeye başlayabilir.')
}

onMounted(() => {
  loadStoredTenders()
})
</script>

<template>
  <div class="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">

    <!-- ========================================================================= -->
    <!-- 🟢 1. LETGO TARZI ULTRA SADE ÜST BAR (SEARCH + İLAN VER + SOHBET) -->
    <!-- ========================================================================= -->
    <header class="sticky top-0 z-40 bg-[#0B1528]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-3 sm:gap-4">

          <!-- LOGO (LETGO STİLİ DİNAMİK ROZET) -->
          <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0 group">
            <div class="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg group-hover:scale-105 transition-transform">
              🤝
            </div>
            <div>
              <span class="text-lg font-black tracking-tight text-white block leading-tight">İhaleci<span class="text-emerald-400">Burada</span></span>
              <span class="text-[9px] font-bold text-slate-400 tracking-wider block">B2B TEKLİF & PAZARLIK</span>
            </div>
          </NuxtLink>

          <!-- ORTA: LETGO ARAMA ÇUBUĞU (NE ARIYORSUNUZ?) -->
          <div class="flex-1 max-w-xl relative hidden md:block">
            <Search :size="16" class="absolute left-4 top-3 text-slate-400" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Ne satın almak veya satmak istiyorsunuz? (Demir, Koli, Trafo, Lojistik...)" 
              class="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X :size="14" />
            </button>
          </div>

          <!-- SAĞ: ŞEHİR + + İLAN VER + SOHBETLERİM -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <!-- ŞEHİR SEÇİCİ -->
            <select 
              v-model="selectedCity" 
              class="hidden sm:block px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">📍 Tüm Türkiye</option>
              <option value="Çanakkale">📍 Çanakkale</option>
              <option value="İstanbul">📍 İstanbul</option>
              <option value="Ankara">📍 Ankara</option>
              <option value="İzmir">📍 İzmir</option>
              <option value="Kocaeli">📍 Kocaeli</option>
              <option value="Bursa">📍 Bursa</option>
            </select>

            <!-- LETGO: + İLAN VER (BÜYÜK VE PARLAK BUTON) -->
            <button 
              @click="showNewTenderModal = true" 
              class="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus :size="16" class="stroke-[3]" />
              <span>İlan Ver</span>
            </button>

            <!-- PROFİL / FİRMA -->
            <button 
              @click="showProfileModal = true" 
              class="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Profilim ve İlanlarım"
            >
              <User :size="15" class="text-emerald-400" />
              <span class="hidden md:inline">Profilim</span>
            </button>

          </div>

        </div>

        <!-- MOBİL ARAMA ÇUBUĞU -->
        <div class="pb-3 md:hidden">
          <div class="relative">
            <Search :size="14" class="absolute left-3.5 top-2.5 text-slate-400" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Ne arıyorsunuz? (Demir, Koli, Lojistik...)" 
              class="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

      </div>
    </header>

    <!-- ========================================================================= -->
    <!-- 🔘 2. LETGO TARZI YATAY KATEGORİ ŞERİDİ (DAİRESEL İKONLAR) -->
    <!-- ========================================================================= -->
    <div class="bg-[#0B1528] border-b border-slate-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex items-center gap-2.5 sm:gap-4 overflow-x-auto custom-scrollbar pb-1">
        <button 
          v-for="cat in iconCategories" 
          :key="cat.slug"
          @click="selectedCategory = cat.slug" 
          :class="selectedCategory === cat.slug ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-105' : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'"
          class="px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span class="text-base">{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🛍️ 3. LETGO KART VİTRİNİ (GRID DÜZENİ: GÖRSEL + FİYAT + PAZARLIK YAP BUTONU) -->
    <!-- ========================================================================= -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <!-- BAŞLIK & İLAN SAYISI -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Canlı B2B İlanlar & Fırsatlar</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              {{ filteredTenders.length }} İlan
            </span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">İstediğin ilana tıkla, doğrudan firma ile <strong>canlı mesajlaş ve pazarlık yap!</strong></p>
        </div>
      </div>

      <!-- LETGO KART IZGARASI (GRID: 1 - 2 - 3 SÜTUN) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="tender in filteredTenders" 
          :key="tender.id"
          class="bg-[#0d1117] border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden transition-all duration-200 shadow-xl hover:shadow-2xl flex flex-col justify-between group"
        >
          
          <!-- ÜST: GÖRSEL & KONUM & ZAMAN -->
          <div class="relative h-48 w-full overflow-hidden bg-slate-900">
            <img 
              :src="tender.image" 
              :alt="tender.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            
            <!-- Kategori Rozeti -->
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-emerald-400 text-[10px] font-black border border-slate-700/60 shadow-md">
              {{ tender.categoryName }}
            </span>

            <!-- Şehir & Zaman -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-slate-200">
              <span class="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded-lg backdrop-blur-2xs">
                📍 {{ tender.city }}
              </span>
              <span class="text-slate-400 font-mono text-[10px]">
                ⏱️ {{ tender.timeAgo }}
              </span>
            </div>
          </div>

          <!-- ORTA: FİYAT + BAŞLIK + AÇIKLAMA -->
          <div class="p-5 space-y-3 flex-1 flex flex-col justify-between text-left">
            <div class="space-y-1.5">
              <!-- BÜYÜK LETGO FİYAT / BÜTÇE ETİKETİ -->
              <div class="flex items-baseline justify-between">
                <span class="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-tight">
                  {{ tender.price }}
                </span>
                <span class="text-[10px] uppercase font-bold text-slate-500">
                  {{ tender.priceType }}
                </span>
              </div>

              <!-- İlan Başlığı -->
              <h3 class="text-sm sm:text-base font-black text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                {{ tender.title }}
              </h3>

              <!-- Açıklama -->
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {{ tender.description }}
              </p>
            </div>

            <!-- FİRMA BİLGİSİ VE PUANI -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div class="min-w-0 pr-2">
                <span class="text-[10px] text-slate-500 uppercase block font-bold">İlan Sahibi</span>
                <span class="font-bold text-white block truncate">{{ tender.company }}</span>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold text-[11px] shrink-0">
                ⭐ {{ tender.rating }}
              </span>
            </div>
          </div>

          <!-- ALT AKSİYON: LETGO PAZARLIK YAP & TEKLİF VER BUTONU -->
          <div class="p-4 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-2">
            <button 
              @click="openChatForTender(tender)" 
              class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-md hover:shadow-emerald-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle :size="15" class="fill-slate-950" />
              <span>Pazarlık Yap & Teklif Ver 💬</span>
            </button>
          </div>

        </div>
      </div>

    </main>

    <!-- ========================================================================= -->
    <!-- 💬 4. LETGO SOHBET & ANLIK PAZARLIK ÇEKMECESİ (DRAWER / CHAT MODAL) -->
    <!-- ========================================================================= -->
    <div v-if="showChatModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col justify-between shadow-2xl overflow-hidden">
        
        <!-- SOHBET ÜST BAR: İLAN BİLGİSİ & FİRMA -->
        <div class="p-4 bg-[#0B1528] border-b border-slate-800 flex items-center justify-between text-left">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
              <img :src="activeChatTender?.image" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-white">{{ activeChatTender?.company }}</h3>
                <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">⭐ {{ activeChatTender?.rating }}</span>
              </div>
              <p class="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                {{ activeChatTender?.title }} (Bütçe: {{ activeChatTender?.price }})
              </p>
            </div>
          </div>
          <button @click="showChatModal = false" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="20" /></button>
        </div>

        <!-- SOHBET MESAJ AKIŞI -->
        <div class="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
          
          <div 
            v-for="msg in activeChatMessages" 
            :key="msg.id"
            class="flex flex-col"
            :class="msg.isMe ? 'items-end' : (msg.isSystem ? 'items-center' : 'items-start')"
          >
            <!-- Sistem Mesajı -->
            <div v-if="msg.isSystem" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] text-center max-w-md">
              {{ msg.text }}
            </div>

            <!-- Teklif / Karşı Teklif Baloncuğu -->
            <div 
              v-else-if="msg.isOffer || msg.isCounterOffer"
              class="p-4 rounded-2xl max-w-sm space-y-2 text-left shadow-lg border"
              :class="msg.isMe ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100' : 'bg-blue-950/80 border-blue-500 text-blue-100'"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider">{{ msg.isCounterOffer ? '💬 KARŞI TEKLİF' : '⚡ RESMİ TEKLİF' }}</span>
                <span class="text-[10px] opacity-70">{{ msg.time }}</span>
              </div>
              <div class="text-xl font-black font-mono">
                {{ msg.offerAmount || msg.counterAmount }}
              </div>
              <p class="text-xs opacity-90">{{ msg.text }}</p>

              <!-- El Sıkış & Anlaş Butonu -->
              <div v-if="!msg.isMe" class="pt-2 border-t border-blue-800/60 flex gap-2">
                <button 
                  @click="acceptDeal" 
                  class="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Handshake :size="14" />
                  <span>Kabul Et & Anlaş 🤝</span>
                </button>
              </div>
            </div>

            <!-- Standart Sohbet Baloncuğu -->
            <div 
              v-else
              class="p-3 rounded-2xl max-w-xs sm:max-w-md text-left leading-relaxed"
              :class="msg.isMe ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-xs' : 'bg-slate-800 text-slate-100 font-medium rounded-tl-xs'"
            >
              <p>{{ msg.text }}</p>
              <span class="text-[9px] opacity-70 block text-right mt-1 font-mono">{{ msg.time }}</span>
            </div>

          </div>

        </div>

        <!-- SOHBET ALT: HIZLI TEKLİF VERME VE MESAJ GÖNDERME -->
        <div class="p-3 bg-[#0B1528] border-t border-slate-800 space-y-2">
          
          <!-- HIZLI PAZARLIK / TEKLİF ÇUBUĞU (LETGO STİLİ) -->
          <div class="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
            <span class="text-[11px] font-bold text-emerald-400 pl-2 shrink-0">Fiyat Teklifi:</span>
            <input 
              v-model="offerInputPrice" 
              type="number" 
              placeholder="Örn: 14000000" 
              class="flex-1 bg-transparent text-xs text-white font-mono font-bold focus:outline-none"
            />
            <button 
              @click="makeOffer" 
              class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              Teklif Gönder ⚡
            </button>
          </div>

          <!-- MESAJ YAZMA KUTUSU -->
          <div class="flex items-center gap-2">
            <input 
              v-model="newChatMessage" 
              @keyup.enter="sendTextMessage"
              type="text" 
              placeholder="Mesajınızı yazın (Örn: Kaç günde teslim edebilirsiniz?)..." 
              class="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button 
              @click="sendTextMessage" 
              class="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
            >
              <Send :size="14" />
              <span>Gönder</span>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ➕ 5. LETGO TARZI 30 SANİYEDE İLAN VERME MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showNewTenderModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚡</span>
            <div>
              <h3 class="text-base font-black text-white">Hemen İlan Ver (30 Saniyede)</h3>
              <p class="text-xs text-slate-400">İhtiyacınızı yazın, tedarikçilerden anında teklif toplayın</p>
            </div>
          </div>
          <button @click="showNewTenderModal = false" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Ne Satın Almak veya Yaptırmak İstiyorsunuz?</label>
            <input 
              v-model="newTenderForm.title" 
              type="text" 
              placeholder="Örn: 500 Ton Çimento, 50.000 Koli, Forklift Kiralama..." 
              class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Kategori</label>
              <select v-model="newTenderForm.category" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white">
                <option value="insaat">🏗️ İnşaat & Yapı</option>
                <option value="sanayi">⚙️ Sanayi & Makine</option>
                <option value="ambalaj">📦 Ambalaj & Koli</option>
                <option value="lojistik">🚚 Lojistik & Nakliye</option>
                <option value="enerji">⚡ Enerji & GES</option>
                <option value="tarim">🌾 Tarım & Gıda</option>
                <option value="diger">🏷️ Diğer Sektörler</option>
              </select>
            </div>

            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Şehir</label>
              <select v-model="newTenderForm.city" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white">
                <option value="Çanakkale">Çanakkale</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Kocaeli">Kocaeli</option>
                <option value="Bursa">Bursa</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Hedef Bütçeniz veya Yaklaşık Fiyat (₺)</label>
            <input 
              v-model="newTenderForm.budget" 
              type="number" 
              placeholder="Örn: 250000" 
              class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-black text-base"
            />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Detaylar / Şartlar (Opsiyonel)</label>
            <textarea 
              v-model="newTenderForm.description" 
              rows="2" 
              placeholder="Teslimat yeri, fatura şartları, malzeme özellikleri..." 
              class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
            ></textarea>
          </div>

          <button 
            @click="submitNewTender" 
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg mt-2 cursor-pointer"
          >
            İlanı Hemen Yayına Al ➔
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 👤 6. KULLANICI PROFİLİ VE İLANLARIM MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showProfileModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-black text-white">👤 Profilim & Firma Bilgilerim</h3>
          <button @click="showProfileModal = false" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <h4 class="font-black text-white text-sm">{{ userSession.companyName }}</h4>
            <p class="text-slate-400">📞 {{ userSession.phone }} | 📍 {{ userSession.city }}</p>
            <span class="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] mt-1">
              ⭐ {{ userSession.rating }} / 5.0 ({{ userSession.ratingCount }} Değerlendirme)
            </span>
          </div>

          <NuxtLink to="/panel" class="block w-full py-2.5 text-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition">
            Gelişmiş Yönetim Paneline Geç ➔
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🛡️ 7. SADE VE ŞIK ALT BİLGİ (FOOTER) -->
    <!-- ========================================================================= -->
    <footer class="mt-12 bg-[#050B16] border-t border-slate-800 text-slate-400 text-xs py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-center sm:text-left">
          <span class="font-black text-white block">İhaleciBurada B2B Borsa Platformu</span>
          <span class="text-[11px] text-slate-500">© 2026 İhaleciBurada A.Ş. • Canlı B2B Teklif, Pazarlık ve Anlaşma Arayüzü</span>
        </div>
        <div class="flex items-center gap-2">
          <PaymentBadges />
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0d1117;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>