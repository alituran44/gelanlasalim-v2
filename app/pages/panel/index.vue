<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  ChevronRight
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useUserSession } from '~/composables/useUserSession'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const { cmsData } = useCmsData()
const { 
  userSession, 
  isCompanyMode, 
  userName, 
  companyName: sessionCompanyName,
  isLoggedIn 
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

function reloadSession() {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (session.role) {
        userRole.value = session.role
      }
    } catch (e) {
      console.error(e)
    }
  }
}

onMounted(() => {
  reloadSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', reloadSession)
    window.addEventListener('user-session-changed', reloadSession)
  }
})
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
        <NuxtLink 
          :to="isCompanyMode ? '/panel/ayarlar?tab=sirket' : '/panel/ayarlar?tab=kisisel'" 
          class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 v-if="isCompanyMode" :size="15" class="text-sky-300" />
          <User v-else :size="15" class="text-sky-300" />
          <span>{{ isCompanyMode ? '🏢 Kurumsal Ayarlar' : '👤 Profil Ayarları' }}</span>
        </NuxtLink>
      </div>
    </div>

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

  </div>
</template>
