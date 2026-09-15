<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Percent, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Coins, 
  ArrowRight, 
  Receipt,
  FileText,
  Lock,
  Package,
  Building2,
  Sparkles,
  HelpCircle,
  Truck,
  DollarSign,
  Search,
  Scale
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'
import { useCmsData } from '~/composables/useCmsData'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Sipariş, Teslimat & Güvenli Havuz (Escrow) ve Komisyon Bilgisi | İhaleciBurada'
})

const { userSession } = useUserSession()
const { cmsData } = useCmsData()

// =========================================================================
// 1. ESCROW & SİPARİŞ TESLİMAT DURUMU (FOTO 1)
// =========================================================================
const escrowSearchQuery = ref('')
const activeEscrowTab = ref<'all' | 'HAVUZDA_BLOKE' | 'MAL_KABUL_BEKLIYOR' | 'TAMAMLANDI'>('all')

const orders = computed(() => {
  const list: any[] = []
  const seenIds = new Set()

  // 1. Check cmsData.value.dashboard.escrowOrders
  const dOrders = cmsData.value?.dashboard?.escrowOrders || []
  dOrders.forEach((o: any) => {
    if (!seenIds.has(o.id || o.tenderId)) {
      seenIds.add(o.id || o.tenderId)
      list.push(o)
    }
  })

  // 2. Check cmsData.value.escrowOrders
  const rootOrders = cmsData.value?.escrowOrders || []
  rootOrders.forEach((o: any) => {
    if (!seenIds.has(o.id || o.tenderId)) {
      seenIds.add(o.id || o.tenderId)
      list.push(o)
    }
  })

  // 3. Check receivedBids for approved offers
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  receivedGroups.forEach((group: any) => {
    if (group.teklifler) {
      const approved = group.teklifler.find((t: any) => t.durum === 'onaylandi' || t.durum === 'anlasildi')
      if (approved && !seenIds.has(group.id)) {
        seenIds.add(group.id)
        const numVal = parseInt(String(approved.fiyat || '75000').replace(/\D/g, '')) || 75000
        list.unshift({
          id: 'ORD-2026-' + (group.id ? group.id.replace(/\D/g, '') : Math.floor(100 + Math.random() * 900)),
          orderCode: 'SIP-2026-' + Math.floor(1000 + Math.random() * 9000),
          tenderId: group.id,
          tenderTitle: group.baslik,
          buyerFirm: group.ownerCompany || userSession.value?.companyName || 'Kurumsal Alıcı Firma',
          supplierFirm: approved.firma,
          totalAmount: approved.fiyat,
          numericAmount: numVal,
          payoutAmount: Math.round(numVal * 0.95).toLocaleString('tr-TR') + ' ₺',
          commissionAmount: Math.round(numVal * 0.05).toLocaleString('tr-TR') + ' ₺',
          commissionRate: 5,
          status: 'HAVUZDA_BLOKE',
          trackingCode: 'YK-8829104',
          shippingCompany: 'Yurtiçi Kargo & Borusan Lojistik',
          createdAt: 'Bugün'
        })
      }
    }
  })

  return list
})

const filteredOrders = computed(() => {
  const q = escrowSearchQuery.value.trim().toLowerCase()
  return orders.value.filter(o => {
    if (activeEscrowTab.value !== 'all' && o.status !== activeEscrowTab.value) {
      return false
    }
    if (q) {
      const matchTitle = (o.tenderTitle || '').toLowerCase().includes(q)
      const matchId = (o.id || '').toLowerCase().includes(q)
      const matchSupplier = (o.supplierFirm || '').toLowerCase().includes(q)
      const matchBuyer = (o.buyerFirm || '').toLowerCase().includes(q)
      if (!matchTitle && !matchId && !matchSupplier && !matchBuyer) return false
    }
    return true
  })
})

const totalEscrowLocked = computed(() => {
  return orders.value
    .filter(o => o.status === 'HAVUZDA_BLOKE' || o.status === 'SEVKIYATTA' || o.status === 'MAL_KABUL_BEKLIYOR')
    .reduce((acc, o) => acc + (o.numericAmount || 0), 0)
})

const totalCompletedVolume = computed(() => {
  return orders.value
    .filter(o => o.status === 'TAMAMLANDI')
    .reduce((acc, o) => acc + (o.numericAmount || 0), 0)
})

const totalPlatformCommission = computed(() => {
  return orders.value
    .filter(o => o.status === 'TAMAMLANDI')
    .reduce((acc, o) => {
      const comm = (o.numericAmount || 0) * ((o.commissionRate || 5) / 100)
      return acc + comm
    }, 0)
})

// =========================================================================
// 2. KOMİSYON HESAPLAYICI DURUMU (FOTO 2)
// =========================================================================
const calcAmount = ref<number>(100000)
const selectedRole = ref<'seller' | 'buyer'>('seller')

const calcSellerCommission = computed(() => Math.round(calcAmount.value * 0.05))
const calcSellerVat = computed(() => Math.round(calcSellerCommission.value * 0.20))
const calcSellerTotalDeduction = computed(() => calcSellerCommission.value + calcSellerVat.value)
const calcSellerNetPayout = computed(() => Math.max(0, calcAmount.value - calcSellerCommission.value))

// Örnek Kullanıcı Hakediş / Kesinti Geçmişi
const userTransactions = ref([
  {
    id: 'İHL-2026-089',
    title: '400 Ton Nervürlü İnşaat Demiri Alımı',
    role: 'Satıcı (Tedarikçi)',
    tenderAmount: 420000,
    rate: 5,
    commissionAmount: 21000,
    netPayout: 399000,
    status: 'Tamamlandı (Hakediş Ödendi)',
    date: '10 Eylül 2026'
  },
  {
    id: 'İHL-2026-074',
    title: '50 Adet Kurumsal Dizüstü Bilgisayar & Monitör',
    role: 'Alıcı (Kurum)',
    tenderAmount: 285000,
    rate: 0,
    commissionAmount: 0,
    netPayout: 285000,
    status: 'Tamamlandı (%0 Masraf)',
    date: '02 Eylül 2026'
  },
  {
    id: 'İHL-2026-061',
    title: 'Fabrika Güneş Enerji Paneli ve Trafo Donanımı',
    role: 'Satıcı (Tedarikçi)',
    tenderAmount: 750000,
    rate: 5,
    commissionAmount: 37500,
    netPayout: 712500,
    status: 'Emanet Havuzunda (Teslimat Aşamasında)',
    date: '28 Ağustos 2026'
  }
])
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto text-left">

    <!-- ========================================================================= -->
    <!-- 1. BÖLÜM: SİPARİŞ, TESLİMAT & GÜVENLİ HAVUZ (ESCROW) (FOTO 1) -->
    <!-- ========================================================================= -->
    <div class="space-y-6">
      <!-- Top Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
            <ShieldCheck :size="13" />
            <span>TCMB & BDDK MEVZUATINA UYGUN PAZARYERİ GÜVENLİ HAVUZ (ESCROW)</span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sipariş, Teslimat & Güvenli Havuz (Escrow)
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            İhale mutabakatı sağlanan siparişlerin ödemelerini havuzda güvenceye alın, sevkiyatı izleyin ve mal kabulünde hakedişi aktarın.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <NuxtLink
            to="/sozlesmeler?tab=escrow"
            class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileText :size="13" class="text-blue-600" />
            <span>Havuz Sözleşmesi</span>
          </NuxtLink>
          <NuxtLink
            to="/panel/gelen-teklifler"
            class="px-4 py-2 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Gelen Teklifler</span>
            <ArrowRight :size="13" />
          </NuxtLink>
        </div>
      </div>

      <!-- ESCROW STATS CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Card 1: Havuzda Bloke Tutar -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-[#0F223D] to-[#152B4D] text-white shadow-md relative overflow-hidden">
          <div class="flex items-center justify-between text-slate-300 text-xs font-bold">
            <span>Güvenli Havuzda Bloke</span>
            <Lock :size="16" class="text-amber-400" />
          </div>
          <div class="text-2xl font-black font-mono mt-2 text-[#00C2FF]">
            {{ totalEscrowLocked.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[10px] text-slate-300 mt-1 font-medium flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Paynkolay Korumalı Hesapta
          </div>
        </div>

        <!-- Card 2: Sevkiyatta / Mal Kabul -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Sevkiyat & Mal Kabul</span>
            <Truck :size="16" class="text-blue-600" />
          </div>
          <div class="text-2xl font-black font-mono mt-2 text-slate-900 dark:text-white">
            {{ orders.filter(o => o.status === 'SEVKIYATTA' || o.status === 'MAL_KABUL_BEKLIYOR').length }} Sipariş
          </div>
          <div class="text-[10px] text-slate-400 mt-1 font-medium">
            Kargo ve İrsaliye Takibinde
          </div>
        </div>

        <!-- Card 3: Tamamlanan Hacim -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Başarıyla Tamamlanan</span>
            <CheckCircle2 :size="16" class="text-emerald-600" />
          </div>
          <div class="text-2xl font-black font-mono mt-2 text-emerald-600">
            {{ totalCompletedVolume.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[10px] text-slate-400 mt-1 font-medium">
            Hakedişi Dağıtılmış Ticaret
          </div>
        </div>

        <!-- Card 4: Platform Komisyon Geliri -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Platform Komisyon Geliri</span>
            <DollarSign :size="16" class="text-[#1EAE4C]" />
          </div>
          <div class="text-2xl font-black font-mono mt-2 text-[#003057] dark:text-emerald-400">
            {{ totalPlatformCommission.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[10px] text-slate-400 mt-1 font-medium">
            Otomatik Split Payment Kesintisi
          </div>
        </div>

      </div>

      <!-- TABS & SEARCH -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- Status Tabs -->
        <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-2xl border p-1.5 shadow-xs overflow-x-auto border-slate-200 dark:border-slate-800">
          <button
            type="button"
            @click="activeEscrowTab = 'all'"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            :class="activeEscrowTab === 'all' ? 'bg-[#003057] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            Tüm Siparişler ({{ orders.length }})
          </button>
          <button
            type="button"
            @click="activeEscrowTab = 'HAVUZDA_BLOKE'"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
            :class="activeEscrowTab === 'HAVUZDA_BLOKE' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            <Lock :size="12" />
            <span>Havuzda Bloke ({{ orders.filter(o => o.status === 'HAVUZDA_BLOKE').length }})</span>
          </button>
          <button
            type="button"
            @click="activeEscrowTab = 'MAL_KABUL_BEKLIYOR'"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
            :class="activeEscrowTab === 'MAL_KABUL_BEKLIYOR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            <Package :size="12" />
            <span>Mal Kabul Bekleyen ({{ orders.filter(o => o.status === 'MAL_KABUL_BEKLIYOR').length }})</span>
          </button>
          <button
            type="button"
            @click="activeEscrowTab = 'TAMAMLANDI'"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
            :class="activeEscrowTab === 'TAMAMLANDI' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            <CheckCircle2 :size="12" />
            <span>Tamamlanan ({{ orders.filter(o => o.status === 'TAMAMLANDI').length }})</span>
          </button>
        </div>

        <!-- Search Box -->
        <div class="relative flex-1 md:max-w-xs">
          <Search :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="escrowSearchQuery"
            type="text"
            placeholder="Sipariş no, ihale adı, firma..."
            class="w-full rounded-2xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white dark:bg-slate-900 transition focus:border-blue-500 font-medium border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          />
        </div>

      </div>

      <!-- ORDERS LIST OR EMPTY STATE -->
      <div v-if="filteredOrders.length > 0" class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="rounded-3xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all hover:shadow-md border-slate-200 dark:border-slate-800 text-left"
        >
          <!-- Card Header -->
          <div class="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white shadow-2xs">
                  {{ order.id }}
                </span>
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs font-bold text-slate-500 font-mono">İhale: {{ order.tenderId }}</span>
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs text-slate-400 font-medium">{{ order.createdAt }}</span>
              </div>
              <h2 class="text-base font-black text-slate-900 dark:text-white mt-1">
                {{ order.tenderTitle }}
              </h2>
            </div>

            <!-- Status Badge -->
            <div>
              <span
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs"
                :class="{
                  'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300': order.status === 'HAVUZDA_BLOKE',
                  'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300': order.status === 'SEVKIYATTA' || order.status === 'MAL_KABUL_BEKLIYOR',
                  'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300': order.status === 'TAMAMLANDI'
                }"
              >
                <Lock v-if="order.status === 'HAVUZDA_BLOKE'" :size="13" />
                <Truck v-else-if="order.status === 'SEVKIYATTA' || order.status === 'MAL_KABUL_BEKLIYOR'" :size="13" />
                <CheckCircle2 v-else :size="13" />

                {{
                  order.status === 'HAVUZDA_BLOKE' ? 'ÖDEME HAVUZDA BLOKE (GÜVENCEDE)' :
                  order.status === 'SEVKIYATTA' ? 'SEVKİYAT AŞAMASINDA' :
                  order.status === 'MAL_KABUL_BEKLIYOR' ? 'MAL KABUL & ONAY BEKLİYOR' :
                  'TAMAMLANDI & HAKEDİŞ ÖDENDİ ✓'
                }}
              </span>
            </div>
          </div>

          <!-- Body details -->
          <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span class="text-slate-400 text-[11px] block">Alıcı Firma:</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ order.buyerFirm }}</span>
            </div>
            <div>
              <span class="text-slate-400 text-[11px] block">Tedarikçi Firma:</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ order.supplierFirm }}</span>
            </div>
            <div>
              <span class="text-slate-400 text-[11px] block">Toplam İhale Bedeli:</span>
              <span class="font-mono font-black text-slate-900 dark:text-white text-sm">{{ order.totalAmount }}</span>
            </div>
            <div class="flex items-center justify-start sm:justify-end">
              <NuxtLink
                to="/panel/siparis-teslimat"
                class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition flex items-center gap-1.5"
              >
                <span>İşlemleri Yönet</span>
                <ArrowRight :size="13" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE (EXACTLY AS IN PHOTO 1) -->
      <div v-else class="rounded-3xl border bg-white dark:bg-slate-900/70 p-12 text-center shadow-xs border-slate-200 dark:border-slate-800">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          <Package :size="28" />
        </div>
        <h3 class="text-sm font-black text-slate-800 dark:text-white">
          Seçilen Kriterde Sipariş Bulunamadı
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
          İhale mutabakatı sağlandığında alıcı ödemeleri ve sevkiyat takip süreçleri bu ekranda otomatik listelenir.
        </p>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 2. BÖLÜM: KOMİSYON ORANLARI & KESİNTİ BİLGİSİ (FOTO 2) -->
    <!-- ========================================================================= -->
    <div class="rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs relative overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2 max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck :size="14" />
              %100 ŞEFFAF VE SABİT KOMİSYON POLİTİKASI
            </span>
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              ALICILARA %0 MASRAF
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Coins class="text-emerald-500 shrink-0" :size="30" />
            Komisyon Oranları & Kesinti Bilgisi
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            İhaleciBurada platformunda gizli ücret, aidat veya peşin listeleme masrafı yoktur. 
            Alıcı kurumlar tüm satın alma süreçlerini <strong>sıfır maliyetle (%0)</strong> yürütür; kazanan tedarikçi firmalar ise yalnızca mal veya hizmet teslimatı alıcı tarafından onaylandığında <strong>sabit net %5 başarı bedeli</strong> öder.
          </p>
        </div>

        <!-- Özet Oran Rozet Kartı -->
        <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div class="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Percent :size="24" />
          </div>
          <div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Geçerli Başarı Oranı</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white font-mono">
              %5 <span class="text-xs font-semibold text-slate-400">Sabit</span>
            </div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Yalnızca Onaylanan Teslimatta</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Temel İlke Kartı (Net ve Sade) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      <!-- İlke 1: Alıcı -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
          %0
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Alıcı Şirketler İçin %0 Masraf</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            İhale açmak, şartname yayınlamak, teklif toplamak ve satıcı seçmek tamamen ücretsizdir. Alıcılardan hiçbir aşamada komisyon kesilmez.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Sınırsız ihale açma</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Sıfır üyelik ve aidat maliyeti</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Doğrulanmış üreticilere doğrudan erişim</li>
        </ul>
      </div>

      <!-- İlke 2: Satıcı -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
          %5
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Satıcılar İçin Sabit %5 Başarı Komisyonu</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            İhalelere teklif vermek ücretsizdir. Komisyon sadece ihale kazanılıp alıcı malı/hizmeti teslim aldığında hakediş tutarından kesilir.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Yalnızca kazandığınızda ödeme</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Sektörden bağımsız sabit %5 kuralı</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Resmi e-Fatura / e-Arşiv kesintisi</li>
        </ul>
      </div>

      <!-- İlke 3: Sıfır Risk -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
          <Lock :size="18" />
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Kayıp / İptal Durumunda Sıfır Risk</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Kazanamadığınız, alıcı tarafından iptal edilen veya mutabakat sağlanamayan ihaleler için hiçbir bedel ödemezsiniz.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Başarısız tekliflerde 0 ₺ kesinti</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Lisanslı ödeme havuzu güvencesi</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Sürpriz ek maliyet veya ceza yok</li>
        </ul>
      </div>

    </div>

    <!-- Hızlı Şeffaf Hakediş & Kesinti Hesaplayıcı -->
    <div class="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator class="text-blue-600" :size="20" />
            Canlı Komisyon & Net Hakediş Hesaplayıcı
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            İhale tutarını girerek hesabınıza geçecek net tutarı ve platform komisyonunu anında hesaplayın.
          </p>
        </div>

        <!-- Rol Seçici -->
        <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
          <button 
            type="button" 
            @click="selectedRole = 'seller'" 
            class="px-3 py-1.5 rounded-lg transition cursor-pointer"
            :class="selectedRole === 'seller' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            Tedarikçi (Satıcı) Gözüyle
          </button>
          <button 
            type="button" 
            @click="selectedRole = 'buyer'" 
            class="px-3 py-1.5 rounded-lg transition cursor-pointer"
            :class="selectedRole === 'buyer' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            Satın Alıcı Gözüyle
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <!-- Giriş Alanı -->
        <div class="lg:col-span-5 space-y-4">
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              İhale / Sipariş Bedeli (₺)
            </label>
            <div class="relative">
              <input 
                v-model.number="calcAmount" 
                type="number" 
                step="5000"
                min="1000"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-base font-black font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 font-mono">₺</span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <button 
                v-for="amt in [50000, 100000, 250000, 500000, 1000000]" 
                :key="amt"
                type="button"
                @click="calcAmount = amt"
                class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
              >
                {{ (amt / 1000) }}K ₺
              </button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
            <div class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Lock :size="13" class="text-blue-600" />
              TCMB Lisanslı Havuz Güvencesi:
            </div>
            <p>
              Tutar alıcı tarafından yatırıldığında lisanslı banka havuzunda bloke edilir. Siz şartnameye uygun malı/hizmeti teslim edip alıcı onay verene kadar hiçbir kesinti veya para transferi gerçekleşmez.
            </p>
          </div>
        </div>

        <!-- Sonuç Kartları (Satıcı Gözüyle) -->
        <div v-if="selectedRole === 'seller'" class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
            <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Platform Hizmet Bedeli (%5)</span>
            <div class="text-2xl font-black font-mono text-blue-700 dark:text-blue-400">
              {{ calcSellerCommission.toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">+ KDV (Faturanız sistemden iletilir)</p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Hesabınıza Aktarılacak Net Tutar (%95)</span>
            <div class="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {{ calcSellerNetPayout.toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Mal kabul onayında doğrudan IBAN'ınıza aktarılır</p>
          </div>

          <div class="sm:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
            <span class="text-slate-600 dark:text-slate-400">Başarısız / Kazanılamayan İhalelerde Kesinti:</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-mono font-bold">0,00 ₺ (%0 Komisyon)</strong>
          </div>
        </div>

        <!-- Sonuç Kartları (Alıcı Gözüyle) -->
        <div v-else class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Alıcı Komisyon Bedeli</span>
            <div class="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              0,00 ₺ (%0)
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Alıcı firmalardan hiçbir komisyon alınmaz</p>
          </div>

          <div class="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
            <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Toplam Ödeyeceğiniz Tutar</span>
            <div class="text-2xl font-black font-mono text-blue-700 dark:text-blue-400">
              {{ Number(calcAmount).toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Yalnızca ihalede kabul ettiğiniz mal bedeli</p>
          </div>

          <div class="sm:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
            <span class="text-slate-600 dark:text-slate-400">Platform İhale Açma & Şartname Masrafı:</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Tamamen Ücretsiz (0 ₺)</strong>
          </div>
        </div>

      </div>
    </div>

    <!-- Hakediş & Sipariş Dökümü (Şeffaf Tablo) -->
    <div class="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt class="text-emerald-500" :size="18" />
            İhale Hakediş & Kesinti Dökümüm
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sonuçlanan işlemlerinizde uygulanan resmi komisyon oranları ve net hakediş durumları.
          </p>
        </div>

        <NuxtLink 
          to="/panel/siparis-teslimat" 
          class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Tüm Escrow İşlemlerini Gör</span>
          <ArrowRight :size="14" />
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <th class="py-3 px-3">İhale No & Başlık</th>
              <th class="py-3 px-3">Rol</th>
              <th class="py-3 px-3 text-right">İşlem Tutarı</th>
              <th class="py-3 px-3 text-center">Komisyon Oranı</th>
              <th class="py-3 px-3 text-right">Kesinti Tutarı</th>
              <th class="py-3 px-3 text-right">Net Hakediş</th>
              <th class="py-3 px-3 text-right">Durum</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr v-for="t in userTransactions" :key="t.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
              <td class="py-3.5 px-3">
                <div class="font-bold text-slate-900 dark:text-white">{{ t.title }}</div>
                <div class="text-[10px] font-mono text-slate-400">{{ t.id }} · {{ t.date }}</div>
              </td>
              <td class="py-3.5 px-3">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="t.role.includes('Alıcı') ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'"
                >
                  {{ t.role }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                {{ t.tenderAmount.toLocaleString('tr-TR') }} ₺
              </td>
              <td class="py-3.5 px-3 text-center font-mono font-bold" :class="t.rate === 0 ? 'text-emerald-600' : 'text-blue-600'">
                %{{ t.rate }}
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-bold" :class="t.commissionAmount === 0 ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'">
                {{ t.commissionAmount > 0 ? '-' + t.commissionAmount.toLocaleString('tr-TR') + ' ₺' : '0 ₺' }}
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                {{ t.netPayout.toLocaleString('tr-TR') }} ₺
              </td>
              <td class="py-3.5 px-3 text-right">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ t.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alt Bilgilendirme & Yasal Dayanak -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
      <div class="flex items-center gap-2">
        <FileText :size="16" class="text-blue-600 shrink-0" />
        <span>Tüm komisyon ve hakediş kuralları <strong>Platform Aracılık Sözleşmesi (6563 SK Md. 9)</strong> kapsamında güvence altındadır.</span>
      </div>
      <NuxtLink 
        to="/sozlesmeler?tab=aracilik" 
        class="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
      >
        Yasal Şartları İncele →
      </NuxtLink>
    </div>

  </div>
</template>
