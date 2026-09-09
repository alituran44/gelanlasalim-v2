<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ShieldCheck, 
  User,
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  FileText, 
  Inbox, 
  Send, 
  Building2, 
  UploadCloud, 
  FileCheck, 
  Eye, 
  MessageSquare,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Mail,
  Phone,
  Save,
  MapPin,
  Lock,
  Bell
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useUserSession } from '~/composables/useUserSession'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const route = useRoute()
const router = useRouter()
const { cmsData } = useCmsData()
const { 
  userSession, 
  isCompanyMode, 
  userName, 
  companyName: sessionCompanyName,
  isLoggedIn,
  toggleCompanyMode 
} = useUserSession()

const displayName = computed(() => {
  if (isCompanyMode.value) {
    return sessionCompanyName.value || userSession.value?.companyName || userSession.value?.company || userName.value || 'Kurumsal Üye Hesabı'
  }
  return userName.value || 'Kullanıcı'
})

const calcAmount = ref('100.000')
const calcNum = computed(() => {
  return parseInt(String(calcAmount.value).replace(/\D/g, '')) || 0
})
const calcEscrowFee = computed(() => Math.round(calcNum.value * 0.04))
const calcNetPayout = computed(() => Math.round(calcNum.value * 0.96))

const userRole = ref('company')
const isVerified = ref(true)

// ==================== DİNAMİK İLANLAR & TEKLİFLER LİSTESİ ====================
const myActiveTenders = computed(() => {
  const currentEmail = (userSession.value?.email || '').trim().toLowerCase()
  const allTenders = cmsData.value?.dashboard?.tenders || []
  
  if (!currentEmail) return []

  return allTenders
    .filter((t: any) => {
      const ownerEmail = (t.ownerEmail || '').trim().toLowerCase()
      return ownerEmail && ownerEmail === currentEmail
    })
    .map((t: any, index: number) => ({
      id: t.id || index + 1,
      no: t.id || `2026/${14600 + index}`,
      title: t.baslik,
      bidsCount: t.teklifSayisi || 0,
      bestOffer: t.butce || 'Teklif Bekleniyor',
      date: t.sure || 'Aktif',
      status: t.durum === 'closed' ? 'Tamamlandı' : 'Yayında & Teklif Alıyor'
    }))
})

const recentBids = computed(() => {
  const list: any[] = []
  const currentEmail = (userSession.value?.email || '').trim().toLowerCase()
  const myTenderIds = myActiveTenders.value.map((t: any) => t.id)
  
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  receivedGroups
    .filter((g: any) => myTenderIds.includes(g.id))
    .forEach((g: any) => {
      (g.teklifler || []).forEach((b: any) => {
        list.push({
          id: b.id,
          tenderTitle: g.baslik,
          bidder: b.firma,
          score: `${b.puan || 5.0} ★`,
          amount: b.fiyat,
          date: 'Güncel',
          status: b.durum === 'anlasildi' ? 'Onaylandı' : 'İnceleniyor'
        })
      })
    })
  return list
})

const activeTab = ref<'genel_bakis' | 'profil'>(route.query.tab === 'profil' ? 'profil' : 'genel_bakis')

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'profil') activeTab.value = 'profil'
  else if (newTab === 'genel_bakis' || !newTab) activeTab.value = 'genel_bakis'
})

function setTab(tab: 'genel_bakis' | 'profil') {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

const editProfileForm = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  companyName: '',
  taxNo: '',
  taxOffice: '',
  sectors: '',
  city: 'Balıkesir'
})
const profileSaveSuccess = ref(false)

function syncProfileForm() {
  if (typeof window === 'undefined') return
  const s = userSession.value || {}
  editProfileForm.value = {
    name: s.name || userName.value || '',
    username: s.username || s.name || userName.value || '',
    email: s.email || '',
    phone: s.phone || '',
    companyName: s.companyName || s.company || '',
    taxNo: s.taxNo || '',
    taxOffice: s.taxOffice || '',
    sectors: s.sectors || '',
    city: s.city || 'Balıkesir'
  }
}

function savePanelProfile() {
  if (typeof window === 'undefined') return
  const current = JSON.parse(localStorage.getItem('userSession') || '{}')
  current.name = editProfileForm.value.name.trim() || current.name
  current.username = editProfileForm.value.username.trim() || current.username
  current.phone = editProfileForm.value.phone.trim()
  current.companyName = editProfileForm.value.companyName.trim()
  current.company = editProfileForm.value.companyName.trim()
  current.taxNo = editProfileForm.value.taxNo.trim()
  current.taxOffice = editProfileForm.value.taxOffice.trim()
  current.sectors = editProfileForm.value.sectors.trim()
  current.city = editProfileForm.value.city.trim()

  localStorage.setItem('userSession', JSON.stringify(current))
  userSession.value = current
  window.dispatchEvent(new Event('storage'))
  window.dispatchEvent(new CustomEvent('user-session-changed', { detail: current }))

  profileSaveSuccess.value = true
  setTimeout(() => {
    profileSaveSuccess.value = false
  }, 3000)
}

function reloadSession() {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (session.role) {
        userRole.value = session.role
      }
      syncProfileForm()
    } catch (e) {
      console.error(e)
    }
  }
}

onMounted(() => {
  reloadSession()
  syncProfileForm()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', reloadSession)
    window.addEventListener('user-session-changed', reloadSession)
  }
})

watch(() => userSession.value, () => {
  syncProfileForm()
}, { deep: true })
</script>

<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-left">
    <!-- ========================================================================= -->
    <!-- 🏢 1. ÜST HOŞ GELDİNİZ VE KURUMSAL AKSİYON KARTI -->
    <!-- ========================================================================= -->
    <div class="bg-gradient-to-r from-[#0F223D] via-[#1A365D] to-[#0F223D] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span 
            class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border"
            :class="isCompanyMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'"
          >
            <ShieldCheck v-if="isCompanyMode" :size="12" />
            <User v-else :size="12" />
            <span>{{ isCompanyMode ? 'Onaylı Kurumsal Firma' : 'Kişisel / Bireysel Hesap' }}</span>
          </span>
          <span class="text-xs text-slate-300">|</span>
          <span class="text-xs text-slate-300">{{ isCompanyMode ? '1 Ay Ücretsiz Kurumsal Deneme' : 'Kişisel Çalışma Alanı' }}</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black tracking-tight">{{ displayName }}</h1>
        <p class="text-xs text-slate-300">
          {{ isCompanyMode 
              ? 'İhalelerinizi yönetebilir, gelen teklifleri inceleyebilir ve satın alma süreçlerinizi takip edebilirsiniz.' 
              : 'Bireysel kullanıcı olarak açık ihaleleri inceleyebilir, teklif verebilir veya dilediğinizde Firma Modunu aktif edebilirsiniz.' }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink 
          to="/panel/ihale-olustur" 
          class="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus :size="15" />
          <span>+ Yeni İhale / İlan Aç</span>
        </NuxtLink>
        <button 
          type="button"
          @click="setTab(activeTab === 'profil' ? 'genel_bakis' : 'profil')"
          class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 v-if="isCompanyMode" :size="15" class="text-sky-300" />
          <User v-else :size="15" class="text-sky-300" />
          <span>{{ activeTab === 'profil' ? '📊 Genel Bakışa Dön' : (isCompanyMode ? '🏢 Kurumsal Profil & Hesap' : '👤 Profil & Hesap') }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🔀 SEKME DEĞİŞTİRİCİ: GENEL BAKIŞ & PROFİL BİRLEŞİMİ -->
    <!-- ========================================================================= -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
      <button 
        type="button" 
        @click="setTab('genel_bakis')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
        :class="activeTab === 'genel_bakis' 
          ? 'bg-[#0F223D] text-white border-[#0F223D] shadow-xs' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'"
      >
        <LayoutDashboard :size="15" />
        <span>📊 Genel Bakış & İhale İstatistikleri</span>
      </button>

      <button 
        type="button" 
        @click="setTab('profil')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
        :class="activeTab === 'profil' 
          ? 'bg-[#0F223D] text-white border-[#0F223D] shadow-xs' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'"
      >
        <User :size="15" />
        <span>👤 Profil & Hesap Bilgileri</span>
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- GÖRÜNÜM A: GENEL BAKIŞ & METRİKLER -->
    <!-- ========================================================================= -->
    <template v-if="activeTab === 'genel_bakis'">
    <!-- ========================================================================= -->
    <!-- 📊 2. SADE 4'LÜ DURUM VE SAYAÇ KARTLARI -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Kart 1: İhalelerim -->
      <NuxtLink to="/panel/ilanlarim" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Yayındaki İhalelerim</span>
          <FileText :size="18" class="text-blue-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">{{ myActiveTenders.length }} İhale</div>
        <div class="text-[11px] font-bold flex items-center gap-1" :class="myActiveTenders.length > 0 ? 'text-emerald-600' : 'text-slate-400'">
          <span>{{ myActiveTenders.length > 0 ? '● Aktif teklif toplanıyor' : 'Henüz ihale açılmadı' }}</span>
        </div>
      </NuxtLink>

      <!-- Kart 2: Gelen Teklifler -->
      <NuxtLink to="/panel/gelen-teklifler" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Gelen Teklifler</span>
          <Inbox :size="18" class="text-emerald-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">{{ recentBids.length }} Teklif</div>
        <div class="text-[11px] font-bold flex items-center gap-1" :class="recentBids.length > 0 ? 'text-amber-600' : 'text-slate-400'">
          <span>{{ recentBids.length > 0 ? `⚡ ${recentBids.length} Teklif incelenmeyi bekliyor` : 'Henüz gelen teklif yok' }}</span>
        </div>
      </NuxtLink>

      <!-- Kart 3: Verdiğim Teklifler -->
      <NuxtLink to="/panel/yaptigim-teklifler" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Verdiğim Teklifler</span>
          <Send :size="18" class="text-orange-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">{{ cmsData?.dashboard?.submittedBids?.length || 0 }} Teklif</div>
        <div class="text-[11px] font-bold flex items-center gap-1" :class="(cmsData?.dashboard?.submittedBids?.length || 0) > 0 ? 'text-blue-600' : 'text-slate-400'">
          <span>{{ (cmsData?.dashboard?.submittedBids?.length || 0) > 0 ? 'Aktif ihalelere katılım' : 'Henüz teklif verilmedi' }}</span>
        </div>
      </NuxtLink>

      <!-- Kart 4: Pazar Yeri & İhale Keşfet -->
      <NuxtLink to="/" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Canlı İhale Havuzu</span>
          <Building2 :size="18" class="text-sky-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-700 font-mono">İhaleci Burada</div>
        <div class="text-[11px] text-blue-600 font-bold flex items-center gap-1">
          <span>🔍 Tüm canlı ihaleleri incele</span>
        </div>
      </NuxtLink>

    </div>

    <!-- ========================================================================= -->
    <!-- 🛡️ 3. SABİT %4 ESCROW GÜVENLİ HAVUZ VE KOMİSYON PANOSU (SEKTÖR AYRIMSIZ) -->
    <!-- ========================================================================= -->
    <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white border-2 border-emerald-500/40 shadow-xl space-y-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
            🛡️
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                SEKTÖR AYRIMSIZ STANDART ORAN
              </span>
              <span class="text-xs text-slate-400 font-mono">TCMB & BDDK Lisanslı Güvenli Havuz</span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-white mt-1">
              Tüm Sektörlerde Sabit %4 Escrow & Platform Komisyonu
            </h2>
          </div>
        </div>

        <NuxtLink 
          to="/sozlesmeler?tab=kullanim"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md flex items-center gap-1.5 shrink-0"
        >
          <span>📋 Resmi Sözleşme Şartları</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div class="lg:col-span-7 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            İhaleciBurada'da sürpriz veya gizli maliyet yoktur. Hangi sektörde ihale açarsanız açın veya teklif verirseniz verin, <strong>sektör ayrımı yapılmaksızın sabit %4 (+ KDV)</strong> Escrow Güvenli Havuz komisyonu uygulanır.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-emerald-300">
              <span class="font-black text-base">✓</span>
              <span><strong>İptal / Başarısız İhalelerde:</strong> %0 (Hiçbir komisyon alınmaz)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-emerald-300">
              <span class="font-black text-base">✓</span>
              <span><strong>Tahsilat Garantisi:</strong> Mal kabulü yapılmadan hakediş serbest kalmaz</span>
            </div>
          </div>
        </div>

        <!-- Hızlı Canlı Hesaplayıcı -->
        <div class="lg:col-span-5 p-3.5 rounded-xl bg-slate-800/90 border border-emerald-500/30 space-y-2.5">
          <div class="text-[11px] font-bold text-slate-300 flex justify-between items-center">
            <span>Canlı Komisyon Hesaplama:</span>
            <span class="text-emerald-400 font-mono font-black">%4 Sabit</span>
          </div>
          <div class="relative">
            <input 
              v-model="calcAmount" 
              type="text" 
              placeholder="Örn: 100.000"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-black text-white outline-none focus:border-emerald-500"
            />
            <span class="absolute right-3 top-2 text-xs text-slate-400 font-bold">₺</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-slate-700">
            <div>
              <span class="text-[10px] text-slate-400 uppercase block">Escrow Kesintisi (%4)</span>
              <span class="text-amber-400 font-bold font-mono">{{ calcEscrowFee.toLocaleString('tr-TR') }} ₺</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 uppercase block">Net Hakediş</span>
              <span class="text-emerald-400 font-black font-mono">{{ calcNetPayout.toLocaleString('tr-TR') }} ₺</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📋 4. YAYINDAKİ İLANLARIM VE GELEN TEKLİFLER -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Sol: Yayındaki İhalelerim -->
      <div class="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 class="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <span>📑 Yayındaki İhalelerim ({{ myActiveTenders.length }})</span>
          </h3>
          <NuxtLink to="/panel/ihale-olustur" class="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1">
            <Plus :size="12" />
            <span>İhale Aç</span>
          </NuxtLink>
        </div>

        <div v-if="myActiveTenders.length > 0" class="space-y-2.5">
          <div 
            v-for="item in myActiveTenders" 
            :key="item.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-sky-50/40 transition space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                {{ item.no }}
              </span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">🟢 Canlı İhale</span>
            </div>

            <h4 class="font-bold text-xs text-slate-800 line-clamp-1">{{ item.title }}</h4>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              <span>{{ item.bidsCount }} Teklif Geldi</span>
              <NuxtLink :to="`/panel/gelen-teklifler`" class="text-blue-600 font-bold hover:underline">
                Teklifleri İncele ➔
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-200">
          <FileText :size="24" class="mx-auto text-slate-400" />
          <p class="text-xs text-slate-600 font-bold">Henüz açtığınız bir ihale bulunmuyor.</p>
          <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:underline">
            <span>İlk İhalenizi Oluşturun</span>
            <ArrowRight :size="12" />
          </NuxtLink>
        </div>
      </div>

      <!-- Sağ: Son Gelen Teklifler (Pazarlık & Kabul) -->
      <div class="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 class="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <span>📥 Son Gelen Teklifler ({{ recentBids.length }})</span>
          </h3>
          <NuxtLink to="/panel/gelen-teklifler" class="text-blue-600 hover:underline text-xs font-bold">
            Pazarlık Masası ➔
          </NuxtLink>
        </div>

        <div v-if="recentBids.length > 0" class="space-y-2.5">
          <div 
            v-for="bid in recentBids" 
            :key="bid.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/30 transition space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-slate-800 truncate pr-2">{{ bid.bidder }}</span>
              <span class="font-black text-xs text-emerald-700 font-mono shrink-0">{{ bid.amount }}</span>
            </div>

            <p class="text-[10px] text-slate-500 truncate">{{ bid.tenderTitle }}</p>

            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
              <span class="text-amber-600 font-bold">{{ bid.score }} Puan</span>
              <NuxtLink to="/panel/gelen-teklifler" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]">
                Kabul / Karşı Teklif ➔
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-200">
          <Inbox :size="24" class="mx-auto text-slate-400" />
          <p class="text-xs text-slate-600 font-bold">Henüz gelen bir teklif bulunmuyor.</p>
          <p class="text-[11px] text-slate-400">İhalelerinize gelen teklifler burada listelenecektir.</p>
        </div>
      </div>

    </div>
    </template>

    <!-- ========================================================================= -->
    <!-- GÖRÜNÜM B: ENTEGRE PROFİL & HESAP YÖNETİMİ -->
    <!-- ========================================================================= -->
    <template v-else-if="activeTab === 'profil'">
      <div class="space-y-6">
        
        <!-- Üst Profil Bilgi & Statü Özeti -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style="border-color: #E2E8F0;">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-[#0F223D] text-emerald-400 flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
              {{ (editProfileForm.name || displayName || 'K').charAt(0).toUpperCase() }}
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-xl font-black text-slate-900">{{ editProfileForm.name || displayName }}</h2>
                <span 
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border"
                  :class="isCompanyMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
                >
                  <ShieldCheck :size="12" />
                  <span>{{ isCompanyMode ? 'Onaylı Kurumsal Firma' : 'Kişisel / Bireysel Hesap' }}</span>
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium flex items-center gap-3 flex-wrap">
                <span v-if="editProfileForm.email" class="flex items-center gap-1">
                  <Mail :size="12" class="text-slate-400" /> {{ editProfileForm.email }}
                </span>
                <span v-if="editProfileForm.phone" class="flex items-center gap-1">
                  <Phone :size="12" class="text-slate-400" /> {{ editProfileForm.phone }}
                </span>
                <span v-if="editProfileForm.city" class="flex items-center gap-1">
                  <MapPin :size="12" class="text-slate-400" /> {{ editProfileForm.city }}
                </span>
              </p>
            </div>
          </div>

          <!-- Firma Modu / Bireysel Mod Hızlı Geçiş -->
          <div class="flex items-center gap-3 shrink-0">
            <button
              type="button"
              @click="toggleCompanyMode(!isCompanyMode)"
              class="px-4 py-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              :class="isCompanyMode 
                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100' 
                : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'"
            >
              <Building2 :size="14" />
              <span>{{ isCompanyMode ? '👤 Kişisel Moda Geç' : '🏢 Firma Modunu Aktif Et' }}</span>
            </button>
          </div>
        </div>

        <!-- Başarı Mesajı Bildirimi -->
        <div v-if="profileSaveSuccess" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 :size="16" class="text-emerald-600 shrink-0" />
          <span>Profil ve hesap bilgileriniz başarıyla güncellendi ve sisteme kaydedildi.</span>
        </div>

        <!-- 1. Kişisel & Yetkili Bilgileri Formu -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <User :size="15" class="text-blue-600" />
              Kişisel Yetkili Bilgileri
            </h3>
            <span class="text-[10px] font-bold text-slate-400">Temel İletişim</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Ad ve Soyad</label>
              <input 
                v-model="editProfileForm.name" 
                type="text" 
                placeholder="Adınız ve Soyadınız" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-bold focus:border-blue-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Giriş / Görünen Kullanıcı Adı</label>
              <input 
                v-model="editProfileForm.username" 
                type="text" 
                placeholder="Kullanıcı adınız" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-bold focus:border-blue-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-black text-slate-600 uppercase">E-posta Adresi</label>
                <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 :size="10" /> Doğrulandı
                </span>
              </div>
              <input 
                v-model="editProfileForm.email" 
                type="email" 
                disabled 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
                style="border-color: #E2E8F0;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Telefon Numarası</label>
              <input 
                v-model="editProfileForm.phone" 
                type="text" 
                placeholder="05XXXXXXXXX" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-mono font-medium focus:border-blue-600"
                style="border-color: #CBD5E1;"
              />
            </div>
          </div>
        </div>

        <!-- 2. Kurumsal Firma Bilgileri Formu (Firma Modu) -->
        <div v-if="isCompanyMode" class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 :size="15" class="text-emerald-600" />
              Kurumsal Şirket Bilgileri
            </h3>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
              🏢 Kurumsal Üye
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Şirket / Ticari Firma Adı</label>
              <input 
                v-model="editProfileForm.companyName" 
                type="text" 
                placeholder="Örn: ABC Tedarik Ltd. Şti." 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-bold focus:border-emerald-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Kayıtlı Şehir / İl</label>
              <input 
                v-model="editProfileForm.city" 
                type="text" 
                placeholder="Örn: Balıkesir" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-bold focus:border-emerald-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Vergi Dairesi</label>
              <input 
                v-model="editProfileForm.taxOffice" 
                type="text" 
                placeholder="Örn: Balıkesir Vergi Dairesi" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-medium focus:border-emerald-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Vergi Kimlik Numarası (VKN)</label>
              <input 
                v-model="editProfileForm.taxNo" 
                type="text" 
                placeholder="10 Haneli VKN" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-mono font-medium focus:border-emerald-600"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-slate-600 uppercase mb-1">Faaliyet Sektörleri</label>
              <input 
                v-model="editProfileForm.sectors" 
                type="text" 
                placeholder="Örn: İnşaat, Organizasyon ve Etkinlik, Turizm ve Hac-Umre, Gıda, Lojistik" 
                class="w-full rounded-xl border p-3 text-xs outline-none bg-white text-slate-900 font-medium focus:border-emerald-600"
                style="border-color: #CBD5E1;"
              />
            </div>
          </div>
        </div>

        <!-- Kaydet Butonu -->
        <div class="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p class="text-xs text-slate-500 font-medium">
            Bilgilerinizi güncelledikten sonra aşağıdaki butona tıklayarak değişiklikleri sisteme kaydedebilirsiniz.
          </p>
          <button 
            type="button" 
            @click="savePanelProfile"
            class="px-6 py-3 rounded-xl bg-[#0F223D] hover:bg-[#003057] text-white font-black text-xs transition flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <Save :size="15" class="text-emerald-400" />
            <span>💾 Profil Bilgilerini Kaydet</span>
          </button>
        </div>

        <!-- 3. Gelişmiş Ayarlar Hızlı Erişim Kartları -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <NuxtLink 
            to="/panel/ayarlar?tab=guvenlik" 
            class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition shadow-xs group space-y-1.5"
          >
            <div class="flex items-center justify-between text-slate-500">
              <span class="text-xs font-bold text-slate-800">Şifre & 2FA Güvenliği</span>
              <Lock :size="16" class="text-blue-600 group-hover:scale-110 transition" />
            </div>
            <p class="text-[11px] text-slate-500">E-posta onaylı 2FA iki aşamalı giriş ve şifre yönetimi</p>
          </NuxtLink>

          <NuxtLink 
            to="/panel/ayarlar?tab=sirket" 
            class="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition shadow-xs group space-y-1.5"
          >
            <div class="flex items-center justify-between text-slate-500">
              <span class="text-xs font-bold text-slate-800">Şirket Evrakları & VKN</span>
              <Building2 :size="16" class="text-emerald-600 group-hover:scale-110 transition" />
            </div>
            <p class="text-[11px] text-slate-500">Vergi levhası, imza sirküleri ve faaliyet belgeleri</p>
          </NuxtLink>

          <NuxtLink 
            to="/panel/ayarlar?tab=bildirimler" 
            class="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 transition shadow-xs group space-y-1.5"
          >
            <div class="flex items-center justify-between text-slate-500">
              <span class="text-xs font-bold text-slate-800">Bildirim Tercihleri</span>
              <Bell :size="16" class="text-amber-600 group-hover:scale-110 transition" />
            </div>
            <p class="text-[11px] text-slate-500">E-posta, SMS ve anlık ihale teklif uyarı ayarları</p>
          </NuxtLink>

          <NuxtLink 
            to="/panel/ayarlar?tab=sozlesmeler" 
            class="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-500 transition shadow-xs group space-y-1.5"
          >
            <div class="flex items-center justify-between text-slate-500">
              <span class="text-xs font-bold text-slate-800">Sözleşmeler & KVKK</span>
              <FileCheck :size="16" class="text-purple-600 group-hover:scale-110 transition" />
            </div>
            <p class="text-[11px] text-slate-500">Platform ana sözleşmesi, gizlilik ve rıza onayları</p>
          </NuxtLink>
        </div>

      </div>
    </template>

  </div>
</template>
