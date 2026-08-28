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
  Calendar,
  Folder,
  FolderOpen
} from 'lucide-vue-next'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'İhaleciBurada.com — Türkiye’nin En Kapsamlı İhale ve Satın Alma Portalı',
  description: 'Günlük ihaleler, kamu ve özel sektör satın alma ilanları, şartnameler, doğrudan teklif verme ve sonuç takip sistemi.'
})

// ==================== STATE MANAGEMENT ====================
const activeNavTab = ref('anasayfa') // 'anasayfa' | 'bultenler' | 'okuduklarim' | 'takip' | 'sozlesme' | 'bildirimler'
const activeSubMenu = ref('kategoriler') // 'kategoriler' | 'sehirler' | 'sektorler' | 'idareler' | 'yukleniciler' | 'kik'
const activeTimeTab = ref('guncel') // 'guncel' | 'gecmis' | 'sonuc' | 'detayli'

// Hızlı Arama Filtreleri
const filterCategory = ref('Tümü')
const filterCity = ref('Tümü')
const filterType = ref('Tümü')
const filterMethod = ref('Tümü')
const filterCost = ref('Tümü')
const filterKeyword = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const searchScope = ref('icerik')
const viewMode = ref<'gelismis' | 'basit'>('gelismis')
const readMode = ref<'goster' | 'gizle'>('goster')

// Giriş Formu
const loginUsername = ref('')
const loginPassword = ref('')
const userSession = ref<any>(null)

function handleLogin() {
  if (!loginUsername.value || !loginPassword.value) {
    alert('Lütfen kullanıcı adı ve şifrenizi giriniz.')
    return
  }
  const session = {
    username: loginUsername.value,
    companyName: loginUsername.value.includes('@') ? loginUsername.value.split('@')[0] : loginUsername.value,
    role: 'member'
  }
  userSession.value = session
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(session))
  }
  alert(`✓ Hoş geldiniz, ${session.companyName}!`)
}

function handleLogout() {
  userSession.value = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
}

// Seçili Kategori / Modal İnceleme
const selectedCategoryName = ref<string | null>(null)
const selectedTenderModal = ref<any>(null)
const quickOfferPrice = ref('')
const quickOfferNotes = ref('')

// 2 Sütunlu İhale Kategorileri (Görseldeki Birebir Liste ve İhale Sayıları)
const categoryListLeft = [
  { id: 1, name: 'İnşaat - Altyapı - Üstyapı - Yapım işi ve Yıkım ihaleleri', count: 2103, tag: 'insaat' },
  { id: 2, name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat ihaleleri', count: 618, tag: 'tesisat' },
  { id: 3, name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama ihaleleri', count: 442, tag: 'prefabrik' },
  { id: 4, name: 'Mühendislik - Mimarlık - Danışmanlık ihaleleri', count: 165, tag: 'muhendislik' },
  { id: 5, name: 'Madencilik - Doğal Kaynaklar - Sondaj ihaleleri', count: 33, tag: 'maden' },
  { id: 6, name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler ihaleleri', count: 838, tag: 'hirdavat' },
  { id: 7, name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı ihaleleri', count: 737, tag: 'enerji' },
  { id: 8, name: 'Yangın Algılama - Söndürme - İhbar Sistemleri ihaleleri', count: 75, tag: 'yangin' },
  { id: 9, name: 'Asansör - Yapı Otomasyon - Mekanik Güvenlik ihaleleri', count: 107, tag: 'asansor' },
  { id: 10, name: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı ihaleleri', count: 237, tag: 'hvac' },
  { id: 11, name: 'Endüstriyel Makine - Motor - Konveyör ihaleleri', count: 756, tag: 'makine' },
  { id: 12, name: 'Savunma Sanayi, Silah - Denizcilik - Havacılık ihaleleri', count: 82, tag: 'savunma' }
]

const categoryListRight = [
  { id: 13, name: 'Sağlık - İlaç - Kozmetik - Medikal ihaleleri', count: 2615, tag: 'saglik' },
  { id: 14, name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları ihaleleri', count: 1399, tag: 'tibbi' },
  { id: 15, name: 'Akaryakıt - Gazyağı - Madeni Yağ ihaleleri', count: 143, tag: 'akaryakit' },
  { id: 16, name: 'Odun - Kömür - Katıyakıt ihaleleri', count: 66, tag: 'yakit' },
  { id: 17, name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek ihaleleri', count: 582, tag: 'gida' },
  { id: 18, name: 'Hazır Yemek - Lokantacılık ihaleleri', count: 89, tag: 'yemek' },
  { id: 19, name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar ihaleleri', count: 859, tag: 'elektronik' },
  { id: 20, name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim ihaleleri', count: 243, tag: 'yazilim' },
  { id: 21, name: 'Uydu Takip - Kamera - Scada - Haberleşme Sistemleri ihaleleri', count: 151, tag: 'kamera' },
  { id: 22, name: 'Temizlik - İlaçlama - Geri Dönüşüm ihaleleri', count: 317, tag: 'temizlik' },
  { id: 23, name: 'Kimyasal Maddeler - Dezenfektan - Gübre ihaleleri', count: 260, tag: 'kimya' },
  { id: 24, name: 'Tekstil - Giyim - Spor Ekipmanları ihaleleri', count: 381, tag: 'tekstil' }
]

// Aktif İhale Listesi (Gerçek Veriler ve Örnek İhaleler)
const rawTenders = ref([
  {
    id: 101,
    no: '2026/14589',
    title: '1.500 Ton B420C Nervürlü İnşaat Demiri ve Hasır Çelik Temini İşi',
    authority: 'Karayolları 14. Bölge Müdürlüğü / Çanakkale Köprü Bağlantı Şantiyesi',
    city: 'Çanakkale',
    category: 'İnşaat - Altyapı - Üstyapı - Yapım işi ve Yıkım ihaleleri',
    type: 'Mal Alımı',
    method: 'Açık İhale (4734 / 19. Madde)',
    cost: '14.500.000 ₺',
    date: '05.09.2026 14:00',
    daysLeft: 8,
    status: 'Güncel İhale',
    specText: 'TSE 708 normlarına uygun nervürlü donatı çeliği temini ve şantiyeye nakli.',
    bids: 7
  },
  {
    id: 102,
    no: '2026/14590',
    title: '100.000 Adet Çift Oluklu Baskılı Koli ve Ambalaj Malzemesi Alımı',
    authority: 'Devlet Malzeme Ofisi (DMO) Genel Müdürlüğü',
    city: 'İstanbul',
    category: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler ihaleleri',
    type: 'Mal Alımı',
    method: 'Açık Eksiltme',
    cost: '350.000 ₺',
    date: '02.09.2026 11:30',
    daysLeft: 5,
    status: 'Güncel İhale',
    specText: 'E-ticaret ve lojistik sevkiyatlarına uygun dopel kraft koli üretimi.',
    bids: 12
  },
  {
    id: 103,
    no: '2026/14591',
    title: 'Üniversite Hastanesi Binası 1.2 MW Çatı Güneş Enerji Santrali (GES) Yapım İşi',
    authority: 'Çanakkale Onsekiz Mart Üniversitesi Rektörlüğü',
    city: 'Çanakkale',
    category: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik Tesisatı ihaleleri',
    type: 'Yapım İşi',
    method: 'Açık İhale',
    cost: '18.200.000 ₺',
    date: '10.09.2026 10:00',
    daysLeft: 13,
    status: 'Güncel İhale',
    specText: 'Anahtar teslim panel, inverter, pano temini ve TEDAŞ onay süreçleri.',
    bids: 4
  },
  {
    id: 104,
    no: '2026/14592',
    title: '250 Seferlik Liman İçi ve Şehirlerarası Konteyner Lojistik Hizmeti',
    authority: 'Türkiye Kömür İşletmeleri Kurumu',
    city: 'Tekirdağ',
    category: 'Klima - Soğutma - Isıtma - Havalandırma Tesisatı ihaleleri',
    type: 'Hizmet Alımı',
    method: 'Pazarlık Usulü (21/f)',
    cost: '1.250.000 ₺',
    date: '01.09.2026 15:00',
    daysLeft: 4,
    status: 'Güncel İhale',
    specText: '40ft konteynerlerin limandan tesis sahasına güvenli nakliyesi.',
    bids: 9
  },
  {
    id: 105,
    no: '2026/14593',
    title: 'Yüksek Hassasiyetli 5 Eksen CNC Freze ve Dik İşleme Merkezi Alımı',
    authority: 'TUSAŞ Havacılık ve Uzay Sanayii A.Ş.',
    city: 'Ankara',
    category: 'Endüstriyel Makine - Motor - Konveyör ihaleleri',
    type: 'Mal Alımı',
    method: 'Belli İstekliler Arasında',
    cost: '6.800.000 ₺',
    date: '15.09.2026 14:00',
    daysLeft: 18,
    status: 'Güncel İhale',
    specText: 'Havacılık parçaları üretimine tam uyumlu 5 eksen CNC işleme tezgahı.',
    bids: 3
  }
])

// LocalStorage'dan kullanıcının açtığı ilanları da ekle
function loadUserTenders() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('myTenders') || localStorage.getItem('userTenders')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item: any, idx: number) => ({
            id: item.id || (9000 + idx),
            no: `2026/${50000 + idx}`,
            title: item.title || item.baslik || 'Özel B2B Satın Alma İhalesi',
            authority: item.company || 'Doğrulanmış B2B İhale Sahibi Firma',
            city: item.city || item.sehir || 'Çanakkale',
            category: item.category || 'İnşaat - Altyapı - Üstyapı - Yapım işi ve Yıkım ihaleleri',
            type: 'Mal / Hizmet Alımı',
            method: 'Doğrudan Teklif / Canlı Eksiltme',
            cost: item.budget || (item.budgetNumeric ? Number(item.budgetNumeric).toLocaleString('tr-TR') + ' ₺' : 'Pazarlıklı'),
            date: 'Güncel',
            daysLeft: 7,
            status: 'Yeni İlan ⚡',
            specText: item.description || item.aciklama || item.title,
            bids: item.bidsCount || 0
          }))
          rawTenders.value = [...formatted, ...rawTenders.value]
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

// Filtrelenmiş İhaleler Listesi
const filteredTendersList = computed(() => {
  return rawTenders.value.filter(t => {
    // Kategori
    if (selectedCategoryName.value && !t.category.includes(selectedCategoryName.value) && !selectedCategoryName.value.includes(t.category)) {
      // Eğer kategoriye tıklandıysa
    }
    if (filterCategory.value !== 'Tümü' && !t.category.includes(filterCategory.value)) {
      return false
    }
    // Şehir
    if (filterCity.value !== 'Tümü' && t.city !== filterCity.value) {
      return false
    }
    // Kelime Arama
    if (filterKeyword.value) {
      const q = filterKeyword.value.toLocaleLowerCase('tr').trim()
      const inTitle = t.title.toLocaleLowerCase('tr').includes(q)
      const inNo = t.no.toLocaleLowerCase('tr').includes(q)
      const inAuth = t.authority.toLocaleLowerCase('tr').includes(q)
      if (!inTitle && !inNo && !inAuth) return false
    }
    return true
  })
})

function selectCategory(catName: string) {
  selectedCategoryName.value = catName
  filterCategory.value = catName
  // Sayfayı ihale listesine kaydır
  const el = document.getElementById('ihale-listesi-alani')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function openTenderDetail(tender: any) {
  selectedTenderModal.value = tender
  quickOfferPrice.value = tender.cost.replace(/[^0-9]/g, '') ? String(Math.round(Number(tender.cost.replace(/[^0-9]/g, '')) * 0.95)) : ''
  quickOfferNotes.value = ''
}

function submitOffer() {
  if (!quickOfferPrice.value) {
    alert('Lütfen teklif tutarınızı giriniz.')
    return
  }
  alert(`✓ TEKLİFİNİZ BAŞARIYLA İLETİLDİ!\n\n${selectedTenderModal.value.no} numaralı "${selectedTenderModal.value.title}" ihalesine ${Number(quickOfferPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki teklifiniz zaman damgalı tutanakla kaydedilmiştir.`)
  selectedTenderModal.value = null
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('userSession')
    if (raw) {
      try { userSession.value = JSON.parse(raw) } catch {}
    }
  }
  loadUserTenders()
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans text-xs flex flex-col">

    <!-- ========================================================================= -->
    <!-- 📞 1. EN ÜST İNCE BİLGİ ŞERİDİ (GÖRSELDEKİ BİREBİR ÜST BAR) -->
    <!-- ========================================================================= -->
    <div class="bg-white border-b border-slate-300 py-1 px-4 sm:px-6 text-[11px] text-slate-600">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span>📞 <strong>Destek:</strong> <a href="tel:08503080000" class="text-blue-700 hover:underline">0850 308 00 00</a> / +90 555 962 73 20</span>
          <span class="hidden sm:inline">✉ <strong>E-posta:</strong> <a href="mailto:mail@ihaleciburada.com" class="text-blue-700 hover:underline">mail@ihaleciburada.com</a></span>
        </div>
        <div>
          <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1">
            <span>Kurumsal bilgiler</span> <ArrowRight :size="11" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏛️ 2. ANA HEADER: LOGO, RENKLİ MENÜ SEKMELERİ & HIZLI ÜYE GİRİŞİ -->
    <!-- ========================================================================= -->
    <header class="bg-white border-b border-slate-300 pt-2 pb-2 px-4 sm:px-6 shadow-xs">
      <div class="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">

        <!-- SOL: LOGO (İHALECİBURADA.COM - ÇEKİÇLİ VE B2B SİMGELİ) -->
        <NuxtLink to="/" class="flex items-center gap-3 shrink-0 group">
          <div class="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#0084B4] to-[#00A3C4] flex items-center justify-center font-black text-2xl text-white shadow-md">
            ⚖️
          </div>
          <div>
            <div class="text-2xl font-black tracking-tight text-[#0084B4] leading-tight flex items-center">
              <span>ihaleci</span><span class="text-[#1EAE4C]">burada</span><span class="text-slate-600 text-base font-bold">.com</span>
            </div>
            <span class="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">TÜRKİYE'NİN RESMİ B2B İHALE VE SATIN ALMA PORTALI</span>
          </div>
        </NuxtLink>

        <!-- SAĞ: TURUNCU / MAVİ MENÜ SEKMELERİ -->
        <div class="flex flex-wrap items-center gap-1 text-white font-bold text-xs">
          <button 
            @click="activeNavTab = 'anasayfa'" 
            :class="activeNavTab === 'anasayfa' ? 'bg-[#0084B4] shadow-inner' : 'bg-[#0097CD] hover:bg-[#0084B4]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏠 Anasayfa</span>
          </button>
          
          <button 
            @click="activeNavTab = 'bultenler'" 
            :class="activeNavTab === 'bultenler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📑 Bültenlerim</span>
          </button>

          <button 
            @click="activeNavTab = 'okuduklarim'" 
            :class="activeNavTab === 'okuduklarim' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>👁️ Okuduklarım</span>
          </button>

          <button 
            @click="activeNavTab = 'takip'" 
            :class="activeNavTab === 'takip' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>⭐ Takip listem</span>
          </button>

          <button 
            @click="activeNavTab = 'sozlesme'" 
            :class="activeNavTab === 'sozlesme' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏆 Sözleşme listem</span>
          </button>

          <button 
            @click="activeNavTab = 'bildirimler'" 
            :class="activeNavTab === 'bildirimler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer relative"
          >
            <span>🔔 Bildirimler</span>
            <span class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">3</span>
          </button>
        </div>

      </div>

      <!-- ALT İKİNCİ ŞERİT: YENİ ÜYELİK & HIZLI GİRİŞ FORMU -->
      <div class="max-w-[1400px] mx-auto mt-2 pt-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <!-- Sol: Yeni Üyelik & Üyelik Uzat -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/uyelik" class="px-3 py-1.5 rounded bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>👤+ Yeni üyelik</span>
          </NuxtLink>
          <NuxtLink to="/abonelik" class="px-3 py-1.5 rounded bg-[#0288D1] hover:bg-[#0277BD] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>🔄 Üyelik uzat</span>
          </NuxtLink>
          <NuxtLink to="/panel/ihale-olustur" class="px-3 py-1.5 rounded bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs shadow-xs flex items-center gap-1">
            <span>+ İhale Aç</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Hızlı Üye Girişi -->
        <div v-if="!userSession" class="flex flex-wrap items-center gap-1.5 text-xs">
          <span class="font-bold text-slate-700 flex items-center gap-1">👤 Üye girişi:</span>
          <input 
            v-model="loginUsername" 
            type="text" 
            placeholder="Kullanıcı adı / E-posta" 
            class="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-36 sm:w-44" 
          />
          <input 
            v-model="loginPassword" 
            type="password" 
            placeholder="Şifre" 
            class="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-28 sm:w-32" 
          />
          <button 
            @click="handleLogin" 
            class="px-3 py-1 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold rounded text-xs transition cursor-pointer"
          >
            Giriş ➔
          </button>
          <button 
            @click="alert('Şifre sıfırlama linki e-postanıza gönderilecektir.')" 
            class="px-3 py-1 bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold rounded text-xs transition cursor-pointer"
          >
            🔑 Şifremi Unuttum
          </button>
        </div>

        <!-- Oturum Açıkken -->
        <div v-else class="flex items-center gap-3 text-xs">
          <span class="font-bold text-slate-700">👤 {{ userSession.companyName || userSession.username }}</span>
          <NuxtLink to="/panel" class="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">Yönetim Paneli</NuxtLink>
          <button @click="handleLogout" class="px-2.5 py-1 rounded bg-red-100 text-red-700 font-bold border border-red-300">Çıkış</button>
        </div>

      </div>
    </header>

    <!-- ========================================================================= -->
    <!-- 🔵 3. MAVİ KATEGORİ VE MODÜL ŞERİDİ (GÖRSELDEKİ KOYU MAVİ BUTONLAR) -->
    <!-- ========================================================================= -->
    <div class="bg-[#0084B4] border-b border-[#00739D] text-white font-bold text-xs">
      <div class="max-w-[1400px] mx-auto flex flex-wrap items-center">
        
        <button 
          @click="activeSubMenu = 'kategoriler'" 
          :class="activeSubMenu === 'kategoriler' ? 'bg-[#E1F5FE] text-[#0084B4] border-t-2 border-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-[#00739D]"
        >
          <span>📁 Kategoriler</span>
        </button>

        <button 
          @click="activeSubMenu = 'sehirler'" 
          :class="activeSubMenu === 'sehirler' ? 'bg-[#E1F5FE] text-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-[#00739D]"
        >
          <span>🏙️ Şehirler</span>
        </button>

        <button 
          @click="activeSubMenu = 'sektorler'" 
          :class="activeSubMenu === 'sektorler' ? 'bg-[#E1F5FE] text-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-[#00739D]"
        >
          <span>🏭 Sektörler</span>
        </button>

        <button 
          @click="activeSubMenu = 'idareler'" 
          :class="activeSubMenu === 'idareler' ? 'bg-[#E1F5FE] text-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-[#00739D]"
        >
          <span>🏛️ İdareler / Kurumlar</span>
        </button>

        <button 
          @click="activeSubMenu = 'yukleniciler'" 
          :class="activeSubMenu === 'yukleniciler' ? 'bg-[#E1F5FE] text-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer border-r border-[#00739D]"
        >
          <span>👥 Yükleniciler & Firmalar</span>
        </button>

        <button 
          @click="activeSubMenu = 'kik'" 
          :class="activeSubMenu === 'kik' ? 'bg-[#E1F5FE] text-[#0084B4] font-black' : 'hover:bg-[#00739D] text-white'"
          class="px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚖️ KİK Kararları & Mevzuat</span>
        </button>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🔍 4. GELİŞMİŞ İHALE ARAMA VE FİLTRELEME KONSOLU (GÖRSELDEKİ BİREBİR TABLO) -->
    <!-- ========================================================================= -->
    <div class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4">
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4">
        
        <!-- ÜST ZAMAN SEKMELERİ VE SAĞ ARAMA KUTUSU -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
          
          <!-- Zaman Butonları -->
          <div class="flex items-center gap-1 text-xs font-bold">
            <button 
              @click="activeTimeTab = 'guncel'" 
              :class="activeTimeTab === 'guncel' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🕒 Güncel</span>
            </button>
            <button 
              @click="activeTimeTab = 'gecmis'" 
              :class="activeTimeTab === 'gecmis' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>📅 Geçmiş</span>
            </button>
            <button 
              @click="activeTimeTab = 'sonuc'" 
              :class="activeTimeTab === 'sonuc' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🎯 Sonuç</span>
            </button>
            <button 
              @click="activeTimeTab = 'detayli'" 
              :class="activeTimeTab === 'detayli' ? 'bg-slate-100 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'"
              class="px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer"
            >
              <span>🔍 Detaylı Ara</span>
            </button>
          </div>

          <!-- Sağ: Kelime Arama -->
          <div class="flex items-center gap-1 w-full md:w-auto">
            <input 
              v-model="filterKeyword" 
              type="text" 
              placeholder="Kelime ara..." 
              class="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 flex-1 md:w-60"
            />
            <select v-model="searchScope" class="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700">
              <option value="icerik">İçerik</option>
              <option value="baslik">Başlık</option>
              <option value="no">İhale No</option>
              <option value="idare">İdare Adı</option>
            </select>
            <button class="px-4 py-1.5 bg-[#0084B4] hover:bg-[#00739D] text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer">
              <Search :size="13" />
              <span>Ara</span>
            </button>
          </div>

        </div>

        <!-- 7'Lİ ARAMA VE SEÇİM DROPDOWN'LARI (GÖRSELDEKİ BİREBİR GRID) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs text-slate-700">
          
          <!-- Kategori -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">Kategori:</label>
            <select v-model="filterCategory" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="İnşaat">İnşaat - Altyapı</option>
              <option value="Sağlık">Sağlık & Medikal</option>
              <option value="Enerji">Enerji & Elektrik</option>
              <option value="Gıda">Gıda & Tarım</option>
              <option value="Makine">Endüstriyel Makine</option>
              <option value="Hırdavat">Hırdavat & Metal</option>
            </select>
          </div>

          <!-- Şehir -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">Şehir:</label>
            <select v-model="filterCity" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Çanakkale">Çanakkale</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Kocaeli">Kocaeli</option>
              <option value="Bursa">Bursa</option>
              <option value="Tekirdağ">Tekirdağ</option>
            </select>
          </div>

          <!-- İhale Türü -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale türü:</label>
            <select v-model="filterType" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Mal Alımı">Mal Alımı</option>
              <option value="Hizmet Alımı">Hizmet Alımı</option>
              <option value="Yapım İşi">Yapım İşi</option>
              <option value="Danışmanlık">Danışmanlık</option>
            </select>
          </div>

          <!-- İhale Usulü -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale usulü:</label>
            <select v-model="filterMethod" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="Açık İhale">Açık İhale</option>
              <option value="Pazarlık Usulü">Pazarlık Usulü</option>
              <option value="Belli İstekliler">Belli İstekliler</option>
              <option value="Doğrudan Temin">Doğrudan Temin</option>
            </select>
          </div>

          <!-- Yaklaşık Maliyet -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">Yaklaşık maliyet:</label>
            <select v-model="filterCost" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs">
              <option value="Tümü">Tümü</option>
              <option value="1">0 - 500.000 ₺</option>
              <option value="2">500.000 ₺ - 5.000.000 ₺</option>
              <option value="3">5.000.000 ₺ ve üzeri</option>
            </select>
          </div>

          <!-- İhale İçeriği -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">İhale içeriği:</label>
            <input v-model="filterKeyword" type="text" placeholder="Kelime ara" class="w-full p-1.5 bg-white border border-slate-300 rounded text-xs" />
          </div>

          <!-- Yayın Tarihi -->
          <div>
            <label class="font-bold block mb-1 text-slate-600">Yayın tarihi:</label>
            <input v-model="filterStartDate" type="date" class="w-full p-1 bg-white border border-slate-300 rounded text-[11px]" />
          </div>

        </div>

        <!-- RADYO BUTONLARI VE MAVİ ARA BUTONU -->
        <div class="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-3">
          <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="basit" v-model="viewMode" name="viewMode" class="accent-blue-600" />
              <span>Basit görünüm</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="gelismis" v-model="viewMode" name="viewMode" class="accent-blue-600" />
              <span>Gelişmiş görünüm</span>
            </label>
            <span class="text-slate-300">|</span>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="gizle" v-model="readMode" name="readMode" class="accent-blue-600" />
              <span>Okuduklarımı gizle</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value="goster" v-model="readMode" name="readMode" class="accent-blue-600" />
              <span>Okuduklarımı göster</span>
            </label>
          </div>

          <button class="px-6 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Search :size="14" />
            <span>Ara 🔍</span>
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ⚡ 5. GÜNLÜK İHALE SAYAÇLARI (GÖRSELDEKİ 3 MAVİ KUTU) -->
    <!-- ========================================================================= -->
    <div class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-2">
      <div class="bg-white border border-slate-300 rounded-lg p-3 shadow-xs space-y-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-black text-xs border border-slate-300">
          ⚡ Günlük
        </span>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- 1. Bugün Yayınlananlar -->
          <div class="p-2.5 rounded border border-sky-300 bg-sky-50 flex items-center justify-between hover:bg-sky-100 transition cursor-pointer">
            <span class="font-bold text-sky-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-sky-700" />
              <span>Bugün yayınlananlar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-sky-300 text-sky-800 font-black text-xs font-mono shadow-2xs">
              2.215 İhale
            </span>
          </div>

          <!-- 2. Bugün Yapılacaklar -->
          <div class="p-2.5 rounded border border-blue-300 bg-blue-50 flex items-center justify-between hover:bg-blue-100 transition cursor-pointer">
            <span class="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-blue-700" />
              <span>Bugün yapılacaklar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-blue-300 text-blue-800 font-black text-xs font-mono shadow-2xs">
              2.627 İhale
            </span>
          </div>

          <!-- 3. Bugün Sonuçlananlar -->
          <div class="p-2.5 rounded border border-emerald-300 bg-emerald-50 flex items-center justify-between hover:bg-emerald-100 transition cursor-pointer">
            <span class="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <Search :size="14" class="text-emerald-700" />
              <span>Bugün sonuçlananlar</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-emerald-300 text-emerald-800 font-black text-xs font-mono shadow-2xs">
              1.681 İhale
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📁 6. İHALE KATEGORİLERİ (GÖRSELDEKİ 2 SÜTUNLU RESMİ LİSTE) -->
    <!-- ========================================================================= -->
    <div class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-2">
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-3">
        
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 class="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <Folder :size="16" class="text-[#0084B4]" />
            <span>Kategoriler</span>
          </h3>
          <span class="text-xs text-slate-500 font-bold">Toplam: <strong>24 Ana Sektör</strong></span>
        </div>

        <!-- 2 SÜTUNLU LİSTE -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          
          <!-- SOL SÜTUN (12 KATEGORİ) -->
          <div class="space-y-1.5">
            <div 
              v-for="cat in categoryListLeft" 
              :key="cat.id"
              class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-sky-50/60 flex items-center justify-between transition group"
            >
              <div 
                @click="selectCategory(cat.name)" 
                class="flex items-center gap-2 flex-1 cursor-pointer pr-2"
              >
                <Folder :size="14" class="text-[#0084B4] shrink-0 group-hover:scale-110 transition-transform" />
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ cat.name }}</span>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px] text-slate-700 shadow-2xs">
                  {{ cat.count.toLocaleString('tr-TR') }} İhale
                </span>
                <select class="p-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 focus:outline-none cursor-pointer">
                  <option>Günlük ⌄</option>
                  <option>Haftalık</option>
                  <option>Tümü</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SAĞ SÜTUN (12 KATEGORİ) -->
          <div class="space-y-1.5">
            <div 
              v-for="cat in categoryListRight" 
              :key="cat.id"
              class="p-2 rounded border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-sky-50/60 flex items-center justify-between transition group"
            >
              <div 
                @click="selectCategory(cat.name)" 
                class="flex items-center gap-2 flex-1 cursor-pointer pr-2"
              >
                <Folder :size="14" class="text-[#0084B4] shrink-0 group-hover:scale-110 transition-transform" />
                <span class="font-bold text-slate-700 group-hover:text-blue-700 truncate">{{ cat.name }}</span>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-2 py-0.5 rounded border border-slate-300 bg-white font-mono font-bold text-[11px] text-slate-700 shadow-2xs">
                  {{ cat.count.toLocaleString('tr-TR') }} İhale
                </span>
                <select class="p-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-slate-600 focus:outline-none cursor-pointer">
                  <option>Günlük ⌄</option>
                  <option>Haftalık</option>
                  <option>Tümü</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📋 7. GÜNCEL İHALE VE SATIN ALMA TABLOSU (EKAP / İHALECİLER LİSTE ALANI) -->
    <!-- ========================================================================= -->
    <div id="ihale-listesi-alani" class="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4">
      <div class="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-4 text-left">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-black text-base text-slate-800 flex items-center gap-2">
              <span>📋 Güncel İhale & Satın Alma İlanları</span>
              <span v-if="selectedCategoryName" class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                {{ selectedCategoryName }}
              </span>
            </h3>
            <p class="text-slate-500 text-xs mt-0.5">Şartnameleri inceleyebilir, resmi ihale dosyalarını indirebilir veya anında online teklif verebilirsiniz.</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-600">{{ filteredTendersList.length }} İlan Listeleniyor</span>
            <button v-if="selectedCategoryName" @click="selectedCategoryName = null; filterCategory = 'Tümü'" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
              ✕ Filtreyi Kaldır
            </button>
          </div>
        </div>

        <!-- İHALE TABLOSU / KARTLARI -->
        <div class="space-y-3">
          <div 
            v-for="tender in filteredTendersList" 
            :key="tender.id"
            class="p-4 rounded-lg border border-slate-300 hover:border-[#0084B4] bg-white hover:bg-sky-50/30 transition-all duration-150 shadow-2xs space-y-3"
          >
            <!-- Üst Başlık & İhale No -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-[#0084B4] text-white font-mono font-black text-[10px]">
                    İHALE NO: {{ tender.no }}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[10px]">
                    {{ tender.type }}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-800 font-bold text-[10px]">
                    {{ tender.method }}
                  </span>
                </div>
                <h4 
                  @click="openTenderDetail(tender)" 
                  class="font-black text-sm sm:text-base text-slate-900 hover:text-blue-700 transition-colors cursor-pointer leading-snug"
                >
                  {{ tender.title }}
                </h4>
              </div>

              <!-- Teklif Ver & İncele Butonu -->
              <div class="flex items-center gap-2 shrink-0">
                <button 
                  @click="openTenderDetail(tender)" 
                  class="px-4 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Zap :size="13" class="text-amber-300 fill-amber-300" />
                  <span>Teklif Ver / İncele ➔</span>
                </button>
              </div>
            </div>

            <!-- Alt Bilgiler: İdare, Şehir, Maliyet, İhale Tarihi -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">İdare / Satın Alma Ekibi</span>
                <span class="font-bold text-slate-800 block truncate">{{ tender.authority }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">Yaklaşık Maliyet / Bütçe</span>
                <span class="font-black text-emerald-700 font-mono text-sm block">{{ tender.cost }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">İhale Tarihi & Saati</span>
                <span class="font-bold text-rose-700 block font-mono">⏱️ {{ tender.date }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 block uppercase">İl & Teklif Sayısı</span>
                <span class="font-bold text-slate-700 block">📍 {{ tender.city }} ({{ tender.bids }} Teklif)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🪟 8. İHALE DETAY VE TEKLİF VERME MODALI -->
    <!-- ========================================================================= -->
    <div v-if="selectedTenderModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white border border-slate-300 rounded-xl max-w-2xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span class="px-2 py-0.5 rounded bg-[#0084B4] text-white font-mono font-bold text-[10px]">
              İHALE NO: {{ selectedTenderModal.no }}
            </span>
            <h3 class="text-base font-black text-slate-900 mt-1">{{ selectedTenderModal.title }}</h3>
          </div>
          <button @click="selectedTenderModal = null" class="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"><X :size="20" /></button>
        </div>

        <div class="space-y-3 text-xs text-slate-700">
          <div class="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div><strong>İdare:</strong> {{ selectedTenderModal.authority }}</div>
            <div><strong>Konum:</strong> {{ selectedTenderModal.city }} / Türkiye</div>
            <div><strong>Tahmini Bütçe:</strong> <span class="font-bold text-emerald-700 font-mono">{{ selectedTenderModal.cost }}</span></div>
            <div><strong>İhale Tarihi:</strong> <span class="font-bold text-rose-700 font-mono">{{ selectedTenderModal.date }}</span></div>
          </div>

          <div>
            <strong class="block mb-1 text-slate-800">Şartname ve İhale Özeti:</strong>
            <p class="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed">{{ selectedTenderModal.specText }}</p>
          </div>

          <!-- Teklif Giriş Formu -->
          <div class="p-3 rounded border border-blue-200 bg-blue-50/50 space-y-2">
            <label class="font-bold text-blue-900 block">Teklif Ettiğiniz Tutar (₺):</label>
            <input v-model="quickOfferPrice" type="number" placeholder="Örn: 14200000" class="w-full p-2.5 bg-white border border-blue-300 rounded text-slate-900 font-mono font-black text-base" />
            
            <label class="font-bold text-blue-900 block mt-1">Teklif Notu & Teslimat Şartları:</label>
            <textarea v-model="quickOfferNotes" rows="2" placeholder="Şartname uygunluğu, garanti ve nakliye detayları..." class="w-full p-2 bg-white border border-blue-300 rounded text-slate-800 text-xs"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button @click="selectedTenderModal = null" class="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer">Kapat</button>
            <button @click="submitOffer" class="px-5 py-2 rounded bg-[#0084B4] hover:bg-[#00739D] text-white font-black text-xs cursor-pointer shadow-xs">
              Resmi Teklifi İlet ➔
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>