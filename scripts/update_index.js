const fs = require('fs');

const content = `<script setup lang="ts">
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
  ExternalLink
} from 'lucide-vue-next'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'İhaleciBurada — B2B Canlı Eksiltme ve Satın Alma Borsası',
  description: 'Tedarik maliyetlerinizi canlı eksiltme ihaleleri ve doğrudan fiyat pazarlığı ile düşürün. Onaylı B2B üreticilerden anında teklif toplayın.'
})

// ==================== STATE MANAGEMENT ====================
const searchMode = ref<'buyer' | 'seller'>('buyer')
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedCity = ref('all')
const activeModal = ref<string | null>(null)
const selectedTenderForBid = ref<any>(null)
const selectedBidForCounter = ref<any>(null)
const selectedCompanyForRating = ref<any>(null)

// Kullanıcı Oturumu
const userSession = ref<any>(null)
const isLoggedIn = computed(() => {
  return !!(userSession.value && (userSession.value.email || userSession.value.id || userSession.value.companyName))
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== '{}') {
        userSession.value = JSON.parse(raw)
      } else {
        userSession.value = null
      }
    } catch {
      userSession.value = null
    }
  }
}

// 1. Profil Bilgileri
const userProfile = ref({
  companyName: 'Metropol İnşaat & Taahhüt A.Ş.',
  taxOffice: 'Çanakkale V.D.',
  taxNumber: '4700854210',
  authorizedPerson: 'Ali Turan',
  phone: '0850 308 00 00',
  mobile: '0532 123 45 67',
  email: 'iletisim@metropolinsaat.com.tr',
  city: 'Çanakkale / Merkez',
  address: 'Barbaros Mah. Atatürk Cad. No: 142 Kat: 4',
  rating: 4.9,
  ratingCount: 128,
  verified: true,
  bio: 'Altyapı, endüstriyel tesis ve toplu konut inşaatı alanında 15 yıllık B2B tedarik tecrübesi.'
})

const isEditingProfile = ref(false)
const profileEditForm = ref({ ...userProfile.value })

function saveProfile() {
  userProfile.value = { ...profileEditForm.value }
  isEditingProfile.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('companyProfile', JSON.stringify(userProfile.value))
  }
  alert('✓ Profil bilgileriniz başarıyla güncellendi!')
}

// 2. Bildirimler Listesi
const notifications = ref([
  {
    id: 1,
    type: 'bid_reaction',
    title: 'Yeni Teklif Geldi ⚡',
    message: '"1.500 Ton Nervürlü Demir Alımı" ihalenize Anadolu Demir Çelik A.Ş. 14.100.000 ₺ teklif sundu.',
    time: '5 dakika önce',
    unread: true
  },
  {
    id: 2,
    type: 'expiring',
    title: '⚠️ İlan Süresi Dolmak Üzere!',
    message: '"Üretim Tesisi Trafo & Jeneratör Alımı" ihalenizin bitmesine son 6 saat kaldı. Teklifleri değerlendiriniz.',
    time: '25 dakika önce',
    unread: true
  },
  {
    id: 3,
    type: 'counter_offer',
    title: 'Karşı Teklif Yanıtı 💬',
    message: 'Marmara Lojistik, ilettiğiniz karşı teklifi incelemeye aldı.',
    time: '2 saat önce',
    unread: false
  }
])

// 3. İlanlarım (Teklif Ver Butonu Olmayan Liste)
const myTenders = ref([
  {
    id: 1001,
    title: '1.500 Ton B420C Nervürlü İnşaat Demiri Alımı',
    category: 'İnşaat & Yapı',
    budget: '14.500.000 ₺',
    bidsCount: 4,
    deadline: '2 Gün Kaldı',
    status: 'Yayında',
    city: 'Çanakkale'
  },
  {
    id: 1002,
    title: '100.000 Adet Oluklu Mukavva Koli Üretimi',
    category: 'Ambalaj & Matbaa',
    budget: '350.000 ₺',
    bidsCount: 6,
    deadline: '4 Gün Kaldı',
    status: 'Yayında',
    city: 'İstanbul'
  }
])

// 4. Gelen Teklifler (Kabul / Ret / Karşı Teklif)
const incomingBids = ref([
  {
    id: 201,
    tenderId: 1001,
    tenderTitle: '1.500 Ton B420C Nervürlü İnşaat Demiri Alımı',
    bidderCompany: 'Anadolu Demir Çelik San. ve Tic. A.Ş.',
    bidderRating: 4.9,
    bidderPhone: '0850 441 20 20',
    bidderEmail: 'kurumsal@anadoludemir.com.tr',
    bidderCity: 'Kocaeli / Gebze',
    amount: 14100000,
    amountFormatted: '14.100.000 ₺',
    deliveryDays: 7,
    notes: 'TSE belgeli, fabrika teslim veya şantiye sahasına nakliye dahil fiyatımızdır.',
    status: 'Değerlendiriliyor'
  },
  {
    id: 202,
    tenderId: 1001,
    tenderTitle: '1.500 Ton B420C Nervürlü İnşaat Demiri Alımı',
    bidderCompany: 'Ege Metal & Haddane A.Ş.',
    bidderRating: 4.8,
    bidderPhone: '0232 555 88 99',
    bidderEmail: 'teklif@egemetal.com.tr',
    bidderCity: 'İzmir / Aliağa',
    amount: 14250000,
    amountFormatted: '14.250.000 ₺',
    deliveryDays: 5,
    notes: 'Stoktan anında sevkiyat garantisi.',
    status: 'Değerlendiriliyor'
  },
  {
    id: 203,
    tenderId: 1002,
    tenderTitle: '100.000 Adet Oluklu Mukavva Koli Üretimi',
    bidderCompany: 'Marmara Ambalaj Sanayi Ltd.',
    bidderRating: 4.7,
    bidderPhone: '0212 660 10 20',
    bidderEmail: 'info@marmaraambalaj.com.tr',
    bidderCity: 'İstanbul / Hadımköy',
    amount: 320000,
    amountFormatted: '320.000 ₺',
    deliveryDays: 10,
    notes: 'Numune 24 saat içinde kargolanır.',
    status: 'Değerlendiriliyor'
  }
])

// 5. Verdiğim Teklifler
const myBids = ref([
  {
    id: 301,
    tenderTitle: '500 KVA Dizel Jeneratör ve Senkronizasyon Panosu',
    targetCompany: 'Doğa Sağlık Grubu A.Ş.',
    myOffer: '850.000 ₺',
    status: 'Değerlendirmede ⏳',
    date: 'Bugün, 14:30'
  },
  {
    id: 302,
    tenderTitle: 'Lojistik & Konteyner Nakliye Hizmeti (50 Sefer)',
    targetCompany: 'Borusan Lojistik A.Ş.',
    myOffer: '420.000 ₺',
    status: 'Karşı Teklif Geldi 💬',
    date: 'Dün, 17:15'
  }
])

// 6. Üye Firma Listesi & Rehberi
const memberCompanies = ref([
  {
    id: 1,
    name: 'Anadolu Demir Çelik San. A.Ş.',
    category: 'İnşaat & Metal',
    city: 'Kocaeli / Gebze',
    phone: '0850 441 20 20',
    email: 'kurumsal@anadoludemir.com.tr',
    rating: 4.9,
    ratingCount: 84,
    verified: true
  },
  {
    id: 2,
    name: 'Marmara Ambalaj & Koli Sanayi',
    category: 'Ambalaj & Matbaa',
    city: 'İstanbul / Hadımköy',
    phone: '0212 660 10 20',
    email: 'info@marmaraambalaj.com.tr',
    rating: 4.8,
    ratingCount: 52,
    verified: true
  },
  {
    id: 3,
    name: 'Ege Lojistik & Antrepo Hizmetleri',
    category: 'Lojistik & Taşımacılık',
    city: 'İzmir / Kemalpaşa',
    phone: '0232 878 90 00',
    email: 'operasyon@egelojistik.com.tr',
    rating: 4.7,
    ratingCount: 39,
    verified: true
  },
  {
    id: 4,
    name: 'TeknoEnerji Güneş & Trafo Ltd.',
    category: 'Enerji & Elektrik',
    city: 'Ankara / Ostim',
    phone: '0312 385 40 50',
    email: 'ihale@teknoenerji.com.tr',
    rating: 4.9,
    ratingCount: 110,
    verified: true
  }
])

// Kategoriler
const categories = [
  { slug: 'insaat', name: 'İnşaat, Yapı & Malzeme' },
  { slug: 'sanayi', name: 'Sanayi, Makine & Ekipman' },
  { slug: 'lojistik', name: 'Lojistik, Taşımacılık & Depo' },
  { slug: 'enerji', name: 'Enerji, Elektrik & Aydınlatma' },
  { slug: 'ambalaj', name: 'Ambalaj, Matbaa & Kağıt' },
  { slug: 'tarim', name: 'Tarım, Hayvancılık & Gıda' },
  { slug: 'bilisim', name: 'Bilişim, Yazılım & Elektronik' },
  { slug: 'guvenlik', name: 'Güvenlik & Tesis Hizmetleri' },
  { slug: 'hizmet', name: 'Danışmanlık, Sigorta & Finans' }
]

// Tüm İhaleler (En son girilen hep en üstte)
const allTenders = ref([
  {
    id: 1,
    title: '1.500 Ton B420C Nervürlü İnşaat Demiri Alımı',
    company: 'Metropol İnşaat Taahhüt A.Ş.',
    companyRating: 4.9,
    companyRatingCount: 128,
    category: 'İnşaat, Yapı & Malzeme',
    categorySlug: 'insaat',
    budget: '14.500.000 ₺',
    deadline: '4 Gün 12 Saat',
    city: 'Çanakkale',
    bidsCount: 8,
    description: 'Şantiye teslimi, TSE belgeli 12m standart nervürlü inşaat demiri tedariği yapılacaktır.',
    createdAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 2,
    title: '100.000 Adet Özel E-Ticaret Taşıma Kolisi Üretimi',
    company: 'Global Retail Dağıtım A.Ş.',
    companyRating: 4.8,
    companyRatingCount: 64,
    category: 'Ambalaj, Matbaa & Kağıt',
    categorySlug: 'ambalaj',
    budget: '350.000 ₺',
    deadline: '6 Gün Kaldı',
    city: 'İstanbul',
    bidsCount: 12,
    description: 'Çift oluklu dayanıklı kraft koli üretimi ve baskı işi.',
    createdAt: Date.now() - 1000 * 60 * 45
  },
  {
    id: 3,
    title: 'Fabrika Çatısı 1.2 MW Güneş Enerji Santrali (GES) Kurulumu',
    company: 'Anadolu Döküm Sanayi Ltd. Şti.',
    companyRating: 4.9,
    companyRatingCount: 95,
    category: 'Enerji, Elektrik & Aydınlatma',
    categorySlug: 'enerji',
    budget: '18.200.000 ₺',
    deadline: '9 Gün Kaldı',
    city: 'Kocaeli',
    bidsCount: 5,
    description: 'Anahtar teslim panel temini, inverter montajı ve TEDAŞ kabul işlemleri dahil.',
    createdAt: Date.now() - 1000 * 60 * 120
  },
  {
    id: 4,
    title: '250 Seferlik Konteyner Liman-Fabrika Karayolu Nakliyesi',
    company: 'Marmara Kimya İthalat A.Ş.',
    companyRating: 4.7,
    companyRatingCount: 41,
    category: 'Lojistik, Taşımacılık & Depo',
    categorySlug: 'lojistik',
    budget: '1.250.000 ₺',
    deadline: '3 Gün Kaldı',
    city: 'Tekirdağ',
    bidsCount: 9,
    description: 'Asyaport çıkışlı Çorlu fabrika sahasına 40ft konteyner taşımacılığı.',
    createdAt: Date.now() - 1000 * 60 * 240
  },
  {
    id: 5,
    title: 'CNC 5 Eksen Dik İşleme Merkezi Makine Alımı',
    company: 'Savunma ve Havacılık Pres A.Ş.',
    companyRating: 5.0,
    companyRatingCount: 33,
    category: 'Sanayi, Makine & Ekipman',
    categorySlug: 'sanayi',
    budget: '6.800.000 ₺',
    deadline: '12 Gün Kaldı',
    city: 'Ankara',
    bidsCount: 3,
    description: 'Yüksek hassasiyetli havacılık parça üretimine uygun yeni nesil CNC tezgah.',
    createdAt: Date.now() - 1000 * 60 * 360
  }
])

function loadUserCustomTenders() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('myTenders') || localStorage.getItem('userTenders')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userItems = parsed.map((item: any, i: number) => ({
            id: item.id || (5000 + i),
            title: item.title || item.baslik || 'Özel Kurumsal İhale',
            company: item.company || userProfile.value.companyName,
            companyRating: 4.9,
            companyRatingCount: 14,
            category: item.category || item.kategori || 'İnşaat, Yapı & Malzeme',
            categorySlug: 'insaat',
            budget: item.budget || (item.budgetNumeric ? item.budgetNumeric + ' ₺' : 'Açık Eksiltme'),
            deadline: item.deadline || '7 Gün Kaldı',
            city: item.city || item.sehir || 'Çanakkale',
            bidsCount: item.bidsCount || 0,
            description: item.description || item.aciklama || item.title,
            createdAt: item.createdAt || Date.now()
          }))
          allTenders.value = [...userItems, ...allTenders.value]
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

const filteredTenders = computed(() => {
  return allTenders.value.filter(t => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLocaleLowerCase('tr').trim()
      const inTitle = t.title.toLocaleLowerCase('tr').includes(q)
      const inCompany = t.company.toLocaleLowerCase('tr').includes(q)
      const inDesc = t.description.toLocaleLowerCase('tr').includes(q)
      if (!inTitle && !inCompany && !inDesc) return false
    }

    if (selectedCategory.value !== 'all') {
      if (selectedCategory.value === 'other') {
        const standardSlugs = categories.map(c => c.slug)
        if (standardSlugs.includes(t.categorySlug)) return false
      } else {
        if (t.categorySlug !== selectedCategory.value) return false
      }
    }

    if (selectedCity.value !== 'all') {
      if (t.city !== selectedCity.value) return false
    }

    return true
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

// ==================== AKSİYONLAR ====================
const quickBidPrice = ref('')
const quickBidDays = ref(7)
const quickBidNotes = ref('')

function handleBidClick(tender: any) {
  if (!isLoggedIn.value) {
    alert('⚠️ TEKLİF VEREBİLMEK İÇİN ÜYELİK GEREKLİDİR\\n\\nKurumsal teklifinizi iletmek için lütfen ücretsiz üye olun veya kurumsal hesabınıza giriş yapın.')
    activeModal.value = 'auth'
    return
  }
  selectedTenderForBid.value = tender
  quickBidPrice.value = ''
  quickBidNotes.value = ''
  activeModal.value = 'bid'
}

function submitQuickBid() {
  if (!quickBidPrice.value) {
    alert('Lütfen teklif tutarınızı giriniz.')
    return
  }
  myBids.value.unshift({
    id: Date.now(),
    tenderTitle: selectedTenderForBid.value.title,
    targetCompany: selectedTenderForBid.value.company,
    myOffer: Number(quickBidPrice.value).toLocaleString('tr-TR') + ' ₺',
    status: 'Teklif İletildi ⚡',
    date: 'Şimdi'
  })
  activeModal.value = null
  alert(`🎉 TEKLİFİNİZ BAŞARIYLA İLETİLDİ!\\n\\n${selectedTenderForBid.value.company} firmasına ${Number(quickBidPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki teklifiniz anında ulaştırılmıştır.`)
}

function handleCreateTenderClick() {
  if (!isLoggedIn.value) {
    alert('⚠️ İHALE AÇABİLMEK İÇİN ÜYE GİRİŞİ GEREKLİDİR\\n\\nİhale yayınlamak için lütfen kurumsal hesabınızı oluşturun.')
    activeModal.value = 'auth'
    return
  }
  navigateTo('/panel/ihale-olustur')
}

function acceptBid(bid: any) {
  bid.status = 'Kabul Edildi ✓'
  alert(`🎉 TEBRİKLER!\\n\\n${bid.bidderCompany} firmasının ${bid.amountFormatted} tutarındaki teklifini KABUL ettiniz. Zaman damgalı e-tutanak oluşturuldu.`)
}

function rejectBid(bid: any) {
  bid.status = 'Reddedildi ✕'
  alert(`${bid.bidderCompany} firmasının teklifi reddedildi. İsterseniz karşı teklif sunabilirsiniz.`)
}

const counterPrice = ref('')
const counterNotes = ref('')

function openCounterOfferModal(bid: any) {
  selectedBidForCounter.value = bid
  counterPrice.value = String(Math.round(bid.amount * 0.95))
  counterNotes.value = 'Hedef fiyatımıza revize etmeniz durumunda ihaleyi onaylayacağız.'
  activeModal.value = 'counter-offer'
}

function submitCounterOffer() {
  if (!counterPrice.value) {
    alert('Lütfen karşı teklif tutarını giriniz.')
    return
  }
  selectedBidForCounter.value.status = 'Karşı Teklif İletildi (Pazarlık) 💬'
  activeModal.value = null
  alert(`💬 KARŞI TEKLİFİNİZ GÖNDERİLDİ!\\n\\n${selectedBidForCounter.value.bidderCompany} firmasına ${Number(counterPrice.value).toLocaleString('tr-TR')} ₺ hedef fiyat teklifiniz iletildi.`)
}

const ratingStars = ref(5)
const ratingComment = ref('')

function openRateCompanyModal(company: any) {
  selectedCompanyForRating.value = company
  ratingStars.value = 5
  ratingComment.value = ''
  activeModal.value = 'rate-company'
}

function submitCompanyRating() {
  alert(`⭐ TEŞEKKÜRLER!\\n\\n${selectedCompanyForRating.value.name || selectedCompanyForRating.value.companyName || selectedCompanyForRating.value.company || 'Firma'} için ${ratingStars.value} yıldızlı değerlendirmeniz başarıyla kaydedildi.`)
  activeModal.value = null
}

const authForm = ref({
  companyName: '',
  email: '',
  phone: '',
  password: '',
  category: 'TÜMÜ',
  agreeTerms: true,
  plan: 'trial'
})

function submitQuickAuth() {
  if (!authForm.value.email || !authForm.value.password) {
    alert('Lütfen e-posta ve şifrenizi giriniz.')
    return
  }
  const session = {
    id: Date.now(),
    companyName: authForm.value.companyName || 'Yeni B2B Üye',
    email: authForm.value.email,
    phone: authForm.value.phone,
    role: 'verified_member'
  }
  userSession.value = session
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(session))
  }
  activeModal.value = null
  alert('🎉 Kurumsal hesabınızla başarıyla giriş yapıldı! Şimdi teklif verebilir ve ihale açabilirsiniz.')
}

onMounted(() => {
  checkSession()
  loadUserCustomTenders()
})
</script>

<template>
  <div class="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-[#0052FF] selection:text-white flex flex-col">

    <!-- ========================================================================= -->
    <!-- 🏛️ 1. PDF HEADER: LOGO, PROFİLİM, BİLDİRİM, İLANLARIM, TEKLİFLER, REHBER -->
    <!-- ========================================================================= -->
    <header class="sticky top-0 z-40 bg-[#0B1528]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-3">

          <!-- LOGO -->
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0 group">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg group-hover:scale-105 transition-transform">
              İ
            </div>
            <div>
              <span class="text-base font-black tracking-tight text-white block leading-tight">İhaleci<span class="text-[#00C2FF]">Burada</span></span>
              <span class="text-[9px] font-bold text-slate-400 tracking-wider block">B2B TEDARİK & EKSİLTME BORSASI</span>
            </div>
          </NuxtLink>

          <!-- PDF 7'Lİ ÜST MENÜ ŞERİDİ -->
          <nav class="hidden lg:flex items-center gap-1 text-xs font-bold">
            
            <!-- 1. PROFİLİM & PUAN VER -->
            <button 
              @click="activeModal = 'profile'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>👤 Profilim</span>
              <span class="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black">
                ⭐ {{ userProfile.rating }}
              </span>
            </button>

            <!-- 2. BİLDİRİM (SÜRE DOLUMU & REAKSİYON) -->
            <button 
              @click="activeModal = 'notifications'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer relative"
            >
              <span>🔔 Bildirimler</span>
              <span v-if="notifications.length > 0" class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                {{ notifications.length }}
              </span>
            </button>

            <!-- 3. YAYINDAKİ İLANLARIM (TEKLİF VER BUTONU OLMAYAN LİSTE) -->
            <button 
              @click="activeModal = 'my-tenders'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>📋 Yayındaki İlanlarım</span>
              <span class="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px]">
                {{ myTenders.length }}
              </span>
            </button>

            <!-- 4. GELEN TEKLİFLER (KABUL / RET / KARŞI TEKLİF) -->
            <button 
              @click="activeModal = 'incoming-bids'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥 Gelen Teklifler</span>
              <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                {{ incomingBids.length }}
              </span>
            </button>

            <!-- 5. VERİLEN TEKLİFLER -->
            <button 
              @click="activeModal = 'my-bids'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>📤 Verilen Teklifler</span>
              <span class="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                {{ myBids.length }}
              </span>
            </button>

            <!-- 6. ÜYE FİRMA LİSTESİ VE İLETİŞİM REHBERİ -->
            <button 
              @click="activeModal = 'directory'" 
              class="px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🏢 Firma Rehberi</span>
            </button>

            <!-- 7. ANA SAYFAYA GEÇ -->
            <button 
              @click="selectedCategory = 'all'; searchQuery = '';" 
              class="px-3 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <span>🏠 Ana Sayfa</span>
            </button>

          </nav>

          <!-- SAĞ: + İLAN VER & GİRİŞ/KAYIT -->
          <div class="flex items-center gap-2 shrink-0">
            <button 
              @click="handleCreateTenderClick" 
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
            >
              <Plus :size="14" class="stroke-[3]" />
              <span>+ İlan Ver</span>
            </button>

            <button 
              v-if="!isLoggedIn" 
              @click="activeModal = 'auth'" 
              class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              Giriş / Üye Ol
            </button>

            <div v-else class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-300 hidden sm:inline truncate max-w-[120px]">{{ userSession.companyName }}</span>
              <button 
                @click="userSession = null; if (typeof window !== 'undefined') localStorage.removeItem('userSession')" 
                class="px-2 py-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-[10px] font-bold hover:bg-red-900 transition cursor-pointer"
              >
                Çıkış
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>

    <!-- ========================================================================= -->
    <!-- 📋 2. ANA GÖVDE: SOL ARAMA MENÜSÜ & ORTA CANLI İLAN AKIŞI (2 KOLON DÜZEN) -->
    <!-- ========================================================================= -->
    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- ==================== SOL KOLON: ARAMA MENÜSÜ ==================== -->
        <aside class="lg:col-span-4 bg-[#0d1117] border border-slate-800 rounded-3xl p-5 space-y-6 sticky top-20 shadow-2xl">
          
          <!-- 1. ARAMA MENÜSÜ: ALICI ? / SATICI ? -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ARAMA MODU</span>
              <span class="text-[10px] text-blue-400 font-bold">{{ searchMode === 'buyer' ? 'Alıcı İhtiyaçları' : 'Tedarikçi İşleri' }}</span>
            </div>
            <div class="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button 
                @click="searchMode = 'buyer'" 
                :class="searchMode === 'buyer' ? 'bg-blue-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white font-bold'"
                class="py-2.5 text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🛒 ALICI ARAMASI</span>
              </button>
              <button 
                @click="searchMode = 'seller'" 
                :class="searchMode === 'seller' ? 'bg-emerald-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white font-bold'"
                class="py-2.5 text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🏭 SATICI / TEDARİK</span>
              </button>
            </div>
          </div>

          <!-- 2. KELİME & FİRMA ARAMASI -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">İlan Başlığı / Şirket / Malzeme Ara</label>
            <div class="relative">
              <Search :size="14" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Örn: Çimento, Koli, Trafo, Lojistik..." 
                class="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <!-- 3. KATEGORİ LİSTESİ (TÜMÜ & DİĞER DAHİL) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">KATEGORİLER & SEKTÖRLER</span>
              <span class="text-[10px] text-blue-400 font-bold">{{ filteredTenders.length }} İlan</span>
            </div>

            <div class="space-y-1 max-h-64 overflow-y-auto pr-1 text-xs custom-scrollbar">
              <!-- 🌐 TÜMÜ SEÇENEĞİ -->
              <button 
                @click="selectedCategory = 'all'" 
                :class="selectedCategory === 'all' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-300 hover:bg-slate-800/80 font-medium'"
                class="w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between cursor-pointer"
              >
                <span>🌐 TÜM KATEGORİLER (TÜMÜ)</span>
                <span class="text-[10px] opacity-80">{{ allTenders.length }}</span>
              </button>

              <!-- STANDART KATEGORİLER -->
              <button 
                v-for="cat in categories" 
                :key="cat.slug"
                @click="selectedCategory = cat.slug" 
                :class="selectedCategory === cat.slug ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-300 hover:bg-slate-800/80 font-medium'"
                class="w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between cursor-pointer"
              >
                <span>{{ cat.name }}</span>
              </button>

              <!-- 🏷️ DİĞER KATEGORİ SEÇENEĞİ -->
              <button 
                @click="selectedCategory = 'other'" 
                :class="selectedCategory === 'other' ? 'bg-amber-600 text-white font-black shadow-sm' : 'text-amber-400/90 hover:bg-slate-800/80 font-medium'"
                class="w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between cursor-pointer border border-amber-500/20"
              >
                <span>🏷️ DİĞER KATEGORİ SEÇENEĞİ</span>
                <span class="text-[10px] opacity-80">Özel</span>
              </button>
            </div>
          </div>

          <!-- 4. ŞEHİR / 81 İL FİLTRESİ -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Şehir / Lokasyon</label>
            <select 
              v-model="selectedCity" 
              class="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tüm Türkiye (81 İl)</option>
              <option value="Çanakkale">Çanakkale</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Kocaeli">Kocaeli</option>
              <option value="Tekirdağ">Tekirdağ</option>
              <option value="Gaziantep">Gaziantep</option>
              <option value="Konya">Konya</option>
              <option value="Adana">Adana</option>
              <option value="Antalya">Antalya</option>
            </select>
          </div>

          <!-- TEMİZLE BUTONU -->
          <button 
            v-if="searchQuery || selectedCategory !== 'all' || selectedCity !== 'all'"
            @click="searchQuery = ''; selectedCategory = 'all'; selectedCity = 'all'" 
            class="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw :size="12" />
            <span>Filtreleri Sıfırla</span>
          </button>

        </aside>

        <!-- ==================== ORTA KOLON: CANLI İLAN AKIŞI ==================== -->
        <main class="lg:col-span-8 space-y-4">
          
          <!-- ÜST BİLGİ ŞERİDİ -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1117] border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl">
            <div>
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h1 class="text-base sm:text-lg font-black text-white">Canlı B2B İhale ve İlan Akışı</h1>
              </div>
              <p class="text-xs text-slate-400 mt-0.5 font-medium">
                Mouse tekerleği veya kaydırma çubuğu ile gezinebilirsiniz. <strong>Son girilen ilan daima en üsttedir.</strong>
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl text-xs font-mono font-bold">
                ● {{ filteredTenders.length }} Canlı İlan
              </span>
            </div>
          </div>

          <!-- BOŞ LİSTE UYARISI -->
          <div v-if="filteredTenders.length === 0" class="p-12 rounded-3xl bg-[#0d1117] border border-dashed border-slate-800 text-center space-y-3">
            <p class="text-sm font-bold text-slate-400">Aramanıza uygun ilan bulunamadı.</p>
            <button @click="searchQuery = ''; selectedCategory = 'all'; selectedCity = 'all'" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">
              Tüm İlanları Göster
            </button>
          </div>

          <!-- PDF İLAN AKIŞI LİSTESİ (SON GİRİLEN EN ÜSTTE SIRALANIR) -->
          <div class="space-y-3.5">
            <div 
              v-for="tender in filteredTenders" 
              :key="tender.id"
              class="bg-[#0d1117] border border-slate-800 hover:border-slate-700/90 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-xl hover:shadow-2xl space-y-4 text-left group"
            >
              
              <!-- ÜST SATIR: KATEGORİ + BAŞLIK + TEKLİF VER BUTONU (PDF KURALI) -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 font-mono text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                      {{ tender.category }}
                    </span>
                    <span class="text-[10px] font-bold text-slate-500">İhale No: #{{ 2026000 + tender.id }}</span>
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-white group-hover:text-[#00C2FF] transition-colors leading-snug cursor-pointer">
                    {{ tender.title }}
                  </h3>
                </div>

                <!-- PDF TEKLİF VER BUTONU -->
                <button 
                  @click="handleBidClick(tender)" 
                  class="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition active:scale-98 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap :size="14" class="text-amber-300 fill-amber-300" />
                  <span>Teklif Ver ➔</span>
                </button>
              </div>

              <!-- ORTA AÇIKLAMA -->
              <p class="text-xs text-slate-300 leading-relaxed font-medium">
                {{ tender.description }}
              </p>

              <!-- ALT METRİKLER: FİRMA İSMİ + PUANI + BÜTÇE + SÜRE + KONUM -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800/60">
                
                <!-- İlan Sahibi & Puan (PDF Kuralı) -->
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold block">İlan Sahibi Firma</span>
                  <span class="font-black text-white block truncate">{{ tender.company }}</span>
                  <button 
                    @click="openRateCompanyModal(tender)" 
                    class="text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                    title="Bu firmayı değerlendir ve puan ver"
                  >
                    <span>⭐ {{ tender.companyRating }} ({{ tender.companyRatingCount }} Puan)</span>
                    <span class="text-[9px] text-blue-400">• Puan Ver</span>
                  </button>
                </div>

                <!-- Bütçe -->
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold block">Tahmini Bütçe</span>
                  <span class="font-black text-emerald-400 font-mono text-sm sm:text-base block mt-0.5">{{ tender.budget }}</span>
                </div>

                <!-- Kalan Süre -->
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold block">Kalan Süre</span>
                  <span class="font-bold text-amber-300 block mt-0.5">⏱️ {{ tender.deadline }}</span>
                </div>

                <!-- Konum & Teklif Sayısı -->
                <div>
                  <span class="text-[10px] text-slate-500 uppercase font-bold block">Konum / Teklifler</span>
                  <span class="font-bold text-slate-300 block mt-0.5">📍 {{ tender.city }} ({{ tender.bidsCount }} Teklif)</span>
                </div>

              </div>

            </div>
          </div>

        </main>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🛡️ 3. ALT KISIM: TEKNİK DESTEKLER, İLETİŞİM & HUKUKSAL KONULAR (PDF KURALI) -->
    <!-- ========================================================================= -->
    <footer class="mt-12 bg-[#050B16] border-t border-slate-800 text-slate-400 text-xs py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- 1. KUTU: TEKNİK KISIM & DESTEKLER -->
        <div class="bg-[#0d1117] border border-slate-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span class="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">TEKNİK KISIM & YARDIM</span>
            <h3 class="text-base font-black text-white">7/24 B2B Destek Masası</h3>
            <p class="text-xs text-slate-400 mt-1">İhale açma, teklif verme veya şartname yükleme süreçlerinizde teknik ekibimiz anında yanınızda.</p>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-3 md:col-span-2 justify-end">
            <a href="tel:08503080000" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition">
              <Phone :size="14" />
              <span>0850 308 00 00 (Canlı Destek)</span>
            </a>
            <NuxtLink to="/videolar" class="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition">
              <Play :size="14" class="text-blue-400" />
              <span>Video Rehberleri İzle</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 2. KUTU: İLETİŞİM VE HUKUKSAL KONULAR -->
        <div class="bg-[#0d1117] border border-slate-800 rounded-3xl p-6 space-y-6 text-left">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">KURUMSAL GÜVENCE</span>
              <h4 class="text-sm font-black text-white mt-0.5">İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş.</h4>
              <p class="text-xs text-slate-400 mt-0.5">Çanakkale V.D. 4700854210 • MERSİS: 0470085421000001 • Sicil: 14520 • KEP: ihaleciburada@hs01.kep.tr</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                ✓ 256-Bit SSL TLS 1.3
              </span>
            </div>
          </div>

          <!-- 13 YASAL SÖZLEŞME LİNKLERİ -->
          <div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">YASAL SÖZLEŞMELER & POLİTİKALAR</span>
            <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-white transition underline decoration-slate-700">Ön Bilgilendirme Formu</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-white transition underline decoration-slate-700">Mesafeli Satış Sözleşmesi</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-white transition underline decoration-slate-700">İptal ve İade Koşulları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=teslimat" class="hover:text-white transition underline decoration-slate-700">Teslimat ve Dijital İfa</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-white transition underline decoration-slate-700">Gizlilik ve KVKK Politikası</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=ihale-kurallari" class="hover:text-white transition underline decoration-slate-700">B2B İhale ve Eksiltme Kuralları</NuxtLink>
              <NuxtLink to="/hakkimizda" class="hover:text-white transition underline decoration-slate-700">Hakkımızda & Ticaret Sicil</NuxtLink>
            </div>
          </div>

          <!-- RESMİ ÖDEME ROZETLERİ -->
          <div class="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div class="text-[11px] text-slate-500">
              © 2026 İhaleciBurada A.Ş. Tüm hakları saklıdır. Platform üzerindeki tüm ihaleler zaman damgalı tutanakla mühürlenir.
            </div>
            <div class="flex items-center gap-2">
              <PaymentBadges />
            </div>
          </div>
        </div>

      </div>
    </footer>

    <!-- ========================================================================= -->
    <!-- 🪟 4. MODALLAR: PROFİL, BİLDİRİM, İLANLARIM, GELEN/GİDEN TEKLİFLER, REHBER -->
    <!-- ========================================================================= -->

    <!-- MODAL 1: PROFİLİM & PUAN VER -->
    <div v-if="activeModal === 'profile'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">👤</div>
            <div>
              <h3 class="text-base font-black text-white">Firma Profilim & Değerlendirmeler</h3>
              <p class="text-xs text-slate-400">Herkesin göreceği kurumsal firma ve iletişim bilgileriniz</p>
            </div>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div v-if="!isEditingProfile" class="space-y-4 text-xs">
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-black text-white">{{ userProfile.companyName }}</h4>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">⭐ {{ userProfile.rating }} / 5.0 ({{ userProfile.ratingCount }} Değerlendirme)</span>
            </div>
            <p class="text-slate-400">{{ userProfile.bio }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3 text-slate-300">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] text-slate-500 uppercase font-bold block">Vergi Bilgileri</span>
              <span class="font-bold text-white block mt-0.5">{{ userProfile.taxOffice }} - {{ userProfile.taxNumber }}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] text-slate-500 uppercase font-bold block">Yetkili Kişi</span>
              <span class="font-bold text-white block mt-0.5">{{ userProfile.authorizedPerson }}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] text-slate-500 uppercase font-bold block">Telefonlar</span>
              <span class="font-bold text-white block mt-0.5">{{ userProfile.phone }} / {{ userProfile.mobile }}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span class="text-[10px] text-slate-500 uppercase font-bold block">E-Posta</span>
              <span class="font-bold text-white block mt-0.5">{{ userProfile.email }}</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <span class="text-[10px] text-slate-500 uppercase font-bold block">Adres & Şehir</span>
            <span class="font-bold text-white block mt-0.5">{{ userProfile.address }} ({{ userProfile.city }})</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <button @click="isEditingProfile = true" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
              <Edit3 :size="14" />
              <span>Profili Düzenle</span>
            </button>
            <button @click="openRateCompanyModal(userProfile)" class="px-4 py-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-600 hover:text-white transition cursor-pointer">
              ⭐ Bu Firmaya Puan Ver
            </button>
          </div>
        </div>

        <!-- PROFİL DÜZENLEME FORMU -->
        <div v-else class="space-y-3 text-xs">
          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Firma Ticari Unvanı</label>
            <input v-model="profileEditForm.companyName" type="text" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Yetkili Kişi</label>
              <input v-model="profileEditForm.authorizedPerson" type="text" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
            </div>
            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Telefon</label>
              <input v-model="profileEditForm.phone" type="text" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
            </div>
          </div>
          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Adres</label>
            <input v-model="profileEditForm.address" type="text" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button @click="isEditingProfile = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">İptal</button>
            <button @click="saveProfile" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer">Kaydet</button>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL 2: BİLDİRİMLER -->
    <div v-if="activeModal === 'notifications'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔔</span>
            <h3 class="text-base font-black text-white">İlan Bildirimleri & Reaksiyonlar</h3>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar text-xs">
          <div 
            v-for="n in notifications" 
            :key="n.id" 
            class="p-3.5 rounded-2xl border transition"
            :class="n.unread ? 'bg-blue-950/40 border-blue-800/80 text-blue-100' : 'bg-slate-900/60 border-slate-800 text-slate-300'"
          >
            <div class="flex items-center justify-between">
              <h4 class="font-black text-white">{{ n.title }}</h4>
              <span class="text-[10px] text-slate-500 font-mono">{{ n.time }}</span>
            </div>
            <p class="mt-1 text-slate-300 leading-relaxed font-medium">{{ n.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 3: YAYINDAKİ İLANLARIM -->
    <div v-if="activeModal === 'my-tenders'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-white">📋 Yayındaki İlanlarım (İlan Yönetimi)</h3>
            <p class="text-xs text-slate-400">Kendi ilanlarınızın listesidir. (Bu ekranda teklif verme butonu bulunmaz)</p>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar text-xs">
          <div 
            v-for="tender in myTenders" 
            :key="tender.id"
            class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">{{ tender.category }}</span>
              <h4 class="text-sm font-black text-white mt-1">{{ tender.title }}</h4>
              <div class="flex items-center gap-3 text-slate-400 mt-1 text-[11px]">
                <span>💰 Bütçe: <strong class="text-emerald-400">{{ tender.budget }}</strong></span>
                <span>⏱️ {{ tender.deadline }}</span>
                <span>📥 {{ tender.bidsCount }} Teklif Geldi</span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button @click="activeModal = 'incoming-bids'" class="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer">
                Teklifleri İncele ({{ tender.bidsCount }})
              </button>
              <button @click="alert('İlan düzenleme penceresine yönlendiriliyorsunuz.')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">
                Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 4: GELEN TEKLİFLER -->
    <div v-if="activeModal === 'incoming-bids'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-white">📥 Gelen Teklifler & Karar Masası</h3>
            <p class="text-xs text-slate-400">Teklif veren firma profilini, puanını ve iletişimini inceleyip karar verin.</p>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar text-xs">
          <div 
            v-for="bid in incomingBids" 
            :key="bid.id"
            class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div>
                <span class="text-[10px] text-slate-500 block">İhale: {{ bid.tenderTitle }}</span>
                <div class="flex items-center gap-2 mt-0.5">
                  <h4 class="font-black text-white text-sm">{{ bid.bidderCompany }}</h4>
                  <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">⭐ {{ bid.bidderRating }} / 5.0</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">📍 {{ bid.bidderCity }} | 📞 {{ bid.bidderPhone }} | ✉️ {{ bid.bidderEmail }}</p>
              </div>

              <div class="text-right">
                <span class="text-[10px] text-slate-500 uppercase font-bold block">Teklif Tutarı</span>
                <span class="text-base font-black text-emerald-400 font-mono">{{ bid.amountFormatted }}</span>
                <span class="text-[10px] text-slate-400 block">⏱️ {{ bid.deliveryDays }} Günde Teslimat</span>
              </div>
            </div>

            <p class="text-xs text-slate-300 font-medium bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              📝 <strong>Firma Notu:</strong> {{ bid.notes }}
            </p>

            <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span class="text-[11px] font-bold text-blue-400">Durum: {{ bid.status }}</span>
              <div class="flex items-center gap-2">
                <button @click="acceptBid(bid)" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer">
                  ✓ Teklifi Kabul Et
                </button>
                <button @click="openCounterOfferModal(bid)" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer">
                  ⇄ Karşı Teklif Ver
                </button>
                <button @click="rejectBid(bid)" class="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 text-xs font-bold transition cursor-pointer">
                  ✕ Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 5: KARŞI TEKLİF VERME PENCERESİ -->
    <div v-if="activeModal === 'counter-offer'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-black text-white">⇄ Karşı Teklif (Pazarlık) Sun</h3>
          <button @click="activeModal = 'incoming-bids'" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-300">
            <strong>{{ selectedBidForCounter?.bidderCompany }}</strong> firmasına yeni bir hedef fiyat teklif ediyorsunuz.
          </p>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Hedeflediğiniz Karşı Fiyat (₺)</label>
            <input v-model="counterPrice" type="number" class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm" />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Karşı Teklif Notunuz / Talepleriniz</label>
            <textarea v-model="counterNotes" rows="3" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button @click="activeModal = 'incoming-bids'" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Geri</button>
            <button @click="submitCounterOffer" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black cursor-pointer">Karşı Teklifi Gönder ➔</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 6: VERİLEN TEKLİFLER -->
    <div v-if="activeModal === 'my-bids'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-black text-white">📤 Başka İhalelere Verdiğim Teklifler</h3>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar text-xs">
          <div v-for="bid in myBids" :key="bid.id" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 class="font-black text-white text-sm">{{ bid.tenderTitle }}</h4>
              <span class="text-[11px] text-slate-400">Hedef Firma: {{ bid.targetCompany }}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-black text-emerald-400 font-mono">{{ bid.myOffer }}</span>
              <span class="text-[10px] text-blue-400 block font-bold">{{ bid.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 7: ÜYE FİRMA REHBERİ -->
    <div v-if="activeModal === 'directory'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-white">🏢 Üye Firma Listesi ve İletişim Bilgileri</h3>
            <p class="text-xs text-slate-400">Platformdaki doğrulanmış kurumsal tedarikçi ve alıcı şirketler</p>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar text-xs">
          <div v-for="comp in memberCompanies" :key="comp.id" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-black text-white text-sm">{{ comp.name }}</h4>
                <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">{{ comp.category }}</span>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">⭐ {{ comp.rating }}</span>
            </div>
            <div class="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800/80">
              <div>📍 {{ comp.city }}</div>
              <div>📞 {{ comp.phone }}</div>
              <div>✉️ {{ comp.email }}</div>
            </div>
            <button @click="openRateCompanyModal(comp)" class="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold transition cursor-pointer">
              ⭐ Bu Firmaya Puan Ver
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 8: HIZLI TEKLİF VERME PENCERESİ -->
    <div v-if="activeModal === 'bid'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-white">⚡ Teklif Ver</h3>
            <p class="text-xs text-slate-400">{{ selectedTenderForBid?.company }}</p>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300">
            <h4 class="font-black text-white text-xs mb-1">{{ selectedTenderForBid?.title }}</h4>
            <span>Hedef Bütçe: <strong class="text-emerald-400">{{ selectedTenderForBid?.budget }}</strong></span>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Teklif Ettiğiniz Toplam Tutar (₺)</label>
            <input v-model="quickBidPrice" type="number" placeholder="Örn: 14000000" class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-base" />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Teslimat Süresi (Gün)</label>
            <input v-model="quickBidDays" type="number" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono" />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Teklif Notu & Teknik Detaylar</label>
            <textarea v-model="quickBidNotes" rows="2" placeholder="Şartnameye uygunluk, garanti ve teslimat şartları..." class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button @click="activeModal = null" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">İptal</button>
            <button @click="submitQuickBid" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black cursor-pointer">
              Teklifi Gönder ➔
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 9: BU FİRMAYA PUAN VER -->
    <div v-if="activeModal === 'rate-company'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-black text-white">⭐ Bu Firmaya Puan Ver</h3>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <p class="text-slate-300">
            <strong>{{ selectedCompanyForRating?.name || selectedCompanyForRating?.companyName || selectedCompanyForRating?.company }}</strong> firması ile olan ticari deneyiminizi puanlayın:
          </p>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Puanınız (1 - 5 Yıldız)</label>
            <div class="flex items-center gap-2 text-2xl text-amber-400">
              <button v-for="star in 5" :key="star" type="button" @click="ratingStars = star" class="cursor-pointer hover:scale-125 transition-transform">
                {{ star <= ratingStars ? '★' : '☆' }}
              </button>
              <span class="text-sm font-bold text-slate-300 ml-2">{{ ratingStars }} / 5 Yıldız</span>
            </div>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Yorumunuz (Opsiyonel)</label>
            <textarea v-model="ratingComment" rows="3" placeholder="Teslimat hızı, malzeme kalitesi ve iletişim deneyiminiz..." class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button @click="activeModal = null" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Kapat</button>
            <button @click="submitCompanyRating" class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black cursor-pointer">Puanı Kaydet ⭐</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 10: ÜYELİK & ZİYARETÇİ DÖNÜŞÜM FORMU -->
    <div v-if="activeModal === 'auth'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#0d1117] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-black text-white">Hızlı Kurumsal Kayıt & Giriş</h3>
            <p class="text-xs text-slate-400">İhalelere teklif vermek ve ilan açmak için üye olun</p>
          </div>
          <button @click="activeModal = null" class="text-slate-400 hover:text-white p-1 cursor-pointer"><X :size="18" /></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Firma Ticari Unvanı</label>
            <input v-model="authForm.companyName" type="text" placeholder="Örn: ABC İnşaat San. A.Ş." class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Kurumsal E-Posta</label>
              <input v-model="authForm.email" type="email" placeholder="ad@sirket.com" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
            </div>
            <div>
              <label class="text-[10px] text-slate-400 font-bold block mb-1">Telefon Numarası</label>
              <input v-model="authForm.phone" type="tel" placeholder="05XX XXX XX XX" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
            </div>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Şifre Belirleyin</label>
            <input v-model="authForm.password" type="password" placeholder="••••••••" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">İlgilendiğiniz Kategori</label>
            <select v-model="authForm.category" class="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white">
              <option value="TÜMÜ">🌐 TÜM KATEGORİLER (TÜMÜ)</option>
              <option v-for="c in categories" :key="c.slug" :value="c.name">{{ c.name }}</option>
              <option value="Diğer Kategori">🏷️ Diğer Kategori Seçeneği</option>
            </select>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 font-bold block mb-1">Üyelik Modeli</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                type="button"
                @click="authForm.plan = 'trial'" 
                :class="authForm.plan === 'trial' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'"
                class="p-2 rounded-xl border text-center cursor-pointer"
              >
                1 Ay Ücretsiz Deneme
              </button>
              <button 
                type="button"
                @click="authForm.plan = 'paid'" 
                :class="authForm.plan === 'paid' ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'"
                class="p-2 rounded-xl border text-center cursor-pointer"
              >
                Kurumsal Paket Satın Al
              </button>
            </div>
          </div>

          <div class="flex items-start gap-2 pt-1">
            <input type="checkbox" id="termsCheck" v-model="authForm.agreeTerms" class="mt-0.5 accent-blue-600" />
            <label for="termsCheck" class="text-[10px] text-slate-400 leading-tight cursor-pointer">
              Ön Bilgilendirme Formu, Mesafeli Satış Sözleşmesi ve KVKK metnini okudum, kabul ediyorum.
            </label>
          </div>

          <button @click="submitQuickAuth" class="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition shadow-lg mt-2 cursor-pointer">
            Kaydı Tamamla & Giriş Yap ➔
          </button>
        </div>
      </div>
    </div>

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
`;

fs.writeFileSync('C:/Users/Hp/gelanlasalim-v2/app/pages/index.vue', content, 'utf8');
console.log('Successfully written index.vue!');
