<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, RotateCw, Search, LayoutGrid, List, FileText, ChevronRight, Lock, Clock, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const { cmsData, saveCmsData } = useCmsData()
const isLoading = ref(true)
const activeTab = ref<'aktif' | 'tamamlanan' | 'suresi_dolan' | 'tum'>('tum')
const activePeriod = ref<'7gun' | '30gun' | '90gun' | '1yil'>('30gun')
const searchQuery = ref('')

const localTendersState = ref<any[]>([])

function reloadTenders() {
  const cmsList = cmsData.value?.dashboard?.tenders || []
  let localList: any[] = []
  if (typeof window !== 'undefined') {
    try {
      localList = JSON.parse(localStorage.getItem('myTenders') || '[]')
    } catch (e) {}
  }
  
  const map = new Map<string, any>()
  localList.forEach(item => map.set(item.id, item))
  cmsList.forEach(item => map.set(item.id, item))
  
  localTendersState.value = Array.from(map.values())
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
    window.addEventListener('storage', () => {
      try {
        userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      } catch (e) {}
    })
  }
  reloadTenders()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

watch(() => cmsData.value?.dashboard?.tenders, () => {
  reloadTenders()
}, { deep: true })

function getTenderDirectionBadge(tender: any) {
  const tur = (tender.tur || '').toLowerCase()
  const yonu = (tender.ihaleYonu || '').toLowerCase()
  if (yonu === 'artirma' || tur.includes('artırma') || tur.includes('artırımlı')) {
    return { label: '📈 Açık Artırma (Fiyat Artırımlı)', class: 'bg-blue-100 text-blue-800 border-blue-200' }
  }
  if (yonu === 'kapali_zarf' || tur.includes('kapalı')) {
    return { label: '📑 Kapalı Zarf Usulü', class: 'bg-purple-100 text-purple-800 border-purple-200' }
  }
  return { label: '📉 Açık Eksiltme (Fiyat Azaltımlı)', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
}

const userSession = ref<any>({})

const tendersList = computed(() => {
  const currentEmail = (userSession.value?.email || '').trim().toLowerCase()
  const cmsList = cmsData.value?.dashboard?.tenders || []
  
  if (!currentEmail) return []

  return cmsList.filter((t: any) => {
    const ownerEmail = (t.ownerEmail || '').trim().toLowerCase()
    return ownerEmail && ownerEmail === currentEmail
  })
})

const filteredTenders = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return tendersList.value.filter(t => {
    // Status filter
    if (activeTab.value === 'aktif' && (t.durum === 'closed' || t.durum === 'expired' || t.sure?.includes('Süresi Doldu') || t.sure?.includes('Sonuçlandı'))) {
      return false
    }
    if (activeTab.value === 'tamamlanan' && t.durum !== 'closed' && !t.sure?.includes('Sonuçlandı') && !t.sure?.includes('Mutabakat')) {
      return false
    }
    if (activeTab.value === 'suresi_dolan' && t.durum !== 'expired' && !t.sure?.includes('Süresi Doldu')) {
      return false
    }

    // Search query
    if (q) {
      const matchTitle = (t.baslik || '').toLowerCase().includes(q)
      const matchCat = (t.kategori || '').toLowerCase().includes(q)
      const matchCity = (t.city || '').toLowerCase().includes(q)
      const matchId = (t.id || '').toLowerCase().includes(q)
      if (!matchTitle && !matchCat && !matchCity && !matchId) return false
    }

    return true
  })
})

function republishTender(tender: any) {
  tender.durum = 'active'
  tender.sure = '30 gün'
  
  // Also reset receivedBids if closed
  const receivedGroup = (cmsData.value.dashboard.receivedBids || []).find((g: any) => g.id === tender.id || g.baslik === tender.baslik)
  if (receivedGroup) {
    receivedGroup.bitis = '30 gün'
    receivedGroup.teklifler.forEach((t: any) => {
      if (t.durum === 'elendi') t.durum = 'bekliyor'
    })
  }

  saveCmsData(cmsData.value)
  alert(`🎉 İLAN YENİDEN YAYINLANDI!\n\n"${tender.baslik}" ihalesi 30 gün süreyle Pazar Yeri'nde yeniden yayına alınmıştır.`)
}

function deleteTender(tender: any) {
  const confirmDelete = confirm(`⚠️ DİKKAT: "${tender.baslik}" ihalesini ve bu ihaleye ait tüm teklif kayıtlarını sistemden tamamen silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`)
  if (!confirmDelete) return

  // 1. Remove from cmsData dashboard tenders
  if (cmsData.value?.dashboard?.tenders) {
    cmsData.value.dashboard.tenders = cmsData.value.dashboard.tenders.filter(
      (t: any) => t.id !== tender.id && t.baslik !== tender.baslik
    )
  }

  // 2. Remove from receivedBids group
  if (cmsData.value?.dashboard?.receivedBids) {
    cmsData.value.dashboard.receivedBids = cmsData.value.dashboard.receivedBids.filter(
      (g: any) => g.id !== tender.id && g.baslik !== tender.baslik
    )
  }

  // 3. Remove from localStorage 'myTenders'
  if (typeof window !== 'undefined') {
    try {
      const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]').filter(
        (t: any) => t.id !== tender.id && t.baslik !== tender.baslik
      )
      localStorage.setItem('myTenders', JSON.stringify(myTenders))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {}
  }

  saveCmsData(cmsData.value)
  reloadTenders()
  alert(`🗑️ İhale Başarıyla Silindi!\n\n"${tender.baslik}" ihalesi ve bağlantılı verileri platformdan kaldırılmıştır.`)
}

function cancelTenderAgreement(tender: any) {
  const confirmCancel = confirm(`⚠️ "${tender.baslik}" ihalesindeki mutabakatı iptal edip ihaleyi tekrar teklif alımına açmak istiyor musunuz?`)
  if (!confirmCancel) return

  tender.durum = 'active'
  tender.sure = '15 gün'

  // Reset bids
  const receivedGroup = (cmsData.value.dashboard.receivedBids || []).find((g: any) => g.id === tender.id || g.baslik === tender.baslik)
  if (receivedGroup) {
    receivedGroup.teklifler.forEach((t: any) => {
      t.durum = 'bekliyor'
      const matchingSubmitted = (cmsData.value.dashboard.submittedBids || []).find((b: any) => b.id === t.id)
      if (matchingSubmitted) {
        matchingSubmitted.durum = 'bekliyor'
      }
    })
  }

  saveCmsData(cmsData.value)
  alert(`🔄 MUTABAKAT İPTAL EDİLDİ\n\n"${tender.baslik}" ihalesi tekrar teklif toplamaya açılmıştır.`)
}

const periods = computed(() => {
  if (locale.value === 'en') {
    return [
      { id: '7gun', label: 'Last 7 Days' },
      { id: '30gun', label: 'Last 30 Days' },
      { id: '90gun', label: 'Last 90 Days' },
      { id: '1yil', label: 'Last 1 Year' }
    ]
  } else {
    return [
      { id: '7gun', label: 'Son 7 Gün' },
      { id: '30gun', label: 'Son 30 Gün' },
      { id: '90gun', label: 'Son 90 Gün' },
      { id: '1yil', label: 'Son 1 Yıl' }
    ]
  }
})

const statusTabs = computed(() => {
  const total = tendersList.value.length
  const activeCount = tendersList.value.filter(t => t.durum !== 'closed' && t.durum !== 'expired' && !t.sure?.includes('Süresi Doldu') && !t.sure?.includes('Sonuçlandı')).length
  const closedCount = tendersList.value.filter(t => t.durum === 'closed' || t.sure?.includes('Sonuçlandı') || t.sure?.includes('Mutabakat')).length
  const expiredCount = tendersList.value.filter(t => t.durum === 'expired' || t.sure?.includes('Süresi Doldu')).length

  return [
    { id: 'tum', label: 'Tüm İhalelerim', count: total },
    { id: 'aktif', label: 'Yayında (Aktif)', count: activeCount },
    { id: 'tamamlanan', label: 'Mutabakat Sağlanan', count: closedCount },
    { id: 'suresi_dolan', label: 'Süresi Dolanlar', count: expiredCount }
  ]
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          {{ 'İhalelerim' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'Oluşturduğunuz ihaleleri durum, tarih ve teklif sürecine göre yönetin.' }}
        </p>
      </div>

      <NuxtLink 
        to="/panel/ihale-olustur"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
      >
        <Plus :size="14" />
        <span>{{ 'Yeni İhale' }}</span>
      </NuxtLink>
    </div>

    <!-- Date Period Tabs Bar -->
    <div class="flex items-center justify-between bg-white rounded-xl border p-2 shadow-xs" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-1.5 overflow-x-auto">
        <button 
          v-for="period in periods"
          :key="period.id"
          type="button"
          @click="activePeriod = period.id as any"
          class="rounded-lg px-4 py-2 text-xs font-bold transition shrink-0 cursor-pointer"
          :class="activePeriod === period.id ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ period.label }}
        </button>
      </div>

      <button 
        type="button" 
        @click="isLoading = true; setTimeout(() => isLoading = false, 500)"
        class="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
      >
        <RotateCw :size="14" />
      </button>
    </div>

    <!-- Status Tabs & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Status Buttons Grid -->
      <div class="flex items-center gap-1.5 bg-white rounded-xl border p-1 shadow-xs" style="border-color: #E2E8F0;">
        <button 
          v-for="tab in statusTabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id as any"
          class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer"
          :class="activeTab === tab.id 
            ? 'bg-blue-900 text-white shadow-xs' 
            : 'text-slate-500 hover:bg-slate-50'"
        >
          <span>{{ tab.label }}</span>
          <span 
            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search and View Switcher -->
      <div class="flex items-center gap-2 flex-1 md:max-w-md justify-end">
        <div class="relative flex-1 w-full">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text"
            :placeholder="'İhale adı, kategori veya şehir ile ara...'"
            class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500 font-medium"
            style="border-color: #E2E8F0; color: #0F172A;"
          />
        </div>
      </div>

    </div>

    <!-- SKELETON LOADER -->
    <div v-if="isLoading" class="space-y-3">
      <div 
        v-for="i in 4" 
        :key="i"
        class="h-20 w-full rounded-xl border bg-white animate-pulse flex items-center justify-between px-6"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-center gap-4 w-2/3">
          <div class="h-10 w-10 bg-slate-100 rounded-lg shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            <div class="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
        </div>
        <div class="h-4 bg-slate-200 rounded w-24"></div>
      </div>
    </div>

    <!-- DATA LIST -->
    <div v-else-if="filteredTenders.length > 0" class="space-y-3">
      <div 
        v-for="tender in filteredTenders"
        :key="tender.id"
        class="rounded-2xl border bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style="border-color: #E2E8F0;"
      >
        <div class="flex items-start gap-4">
          <!-- İhale Kapak Görseli veya İkonu -->
          <div class="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-2xs">
            <img 
              v-if="tender.image" 
              :src="tender.image" 
              :alt="tender.baslik" 
              class="h-full w-full object-cover" 
            />
            <FileText v-else :size="22" class="text-blue-600" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-sm text-slate-800">{{ tender.baslik }}</h3>
              <!-- Durum Rozeti -->
              <span 
                v-if="tender.durum === 'pending_approval' || tender.adminApproved === false"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse"
              >
                <Clock :size="11" />
                <span>⏳ Yönetici Onayı Bekliyor</span>
              </span>
              <span 
                v-else-if="tender.durum === 'rejected'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300 flex items-center gap-1"
              >
                <AlertCircle :size="11" />
                <span>✕ Reddedildi</span>
              </span>
              <span 
                v-else-if="tender.durum === 'closed' || tender.sure?.includes('Sonuçlandı') || tender.sure?.includes('Mutabakat')"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1"
              >
                <Lock :size="11" />
                <span>Mutabakat Sağlandı</span>
              </span>
              <span 
                v-else-if="tender.durum === 'expired' || tender.sure?.includes('Süresi Doldu')"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1"
              >
                <Clock :size="11" />
                <span>Süresi Doldu</span>
              </span>
              <span 
                v-else
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"
              >
                <CheckCircle2 :size="11" />
                <span>🟢 Yayında (Aktif)</span>
              </span>
            </div>

            <div v-if="tender.rejectionReason" class="mt-1.5 text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
              <strong>Yönetici Ret Gerekçesi:</strong> {{ tender.rejectionReason }}
            </div>

            <p class="text-xs text-slate-400 mt-1 font-medium">
              {{ 'İhale Kodu:' }} <strong class="font-mono text-slate-700">{{ tender.id }}</strong> • 
              {{ 'Kategori:' }} {{ tender.kategori }}
            </p>
            
            <div class="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
              <span class="rounded bg-slate-100 px-2 py-0.5 font-bold uppercase tracking-wider text-[8px] text-slate-700">{{ tender.olusturma }}</span>
              <span>{{ 'Bütçe / Fiyat:' }} <strong>{{ tender.butce }}</strong></span>
              <span>{{ 'Kalan Süre / Durum:' }} <strong>{{ tender.durum === 'closed' ? 'Sonuçlandı (Mutabakat)' : tender.sure }}</strong></span>
              
              <!-- Ekli PDF / Şartname Dosyası Varsa -->
              <span v-if="tender.files?.length || tender.documents?.length" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                📄 {{ (tender.files || tender.documents)[0]?.name || 'Şartname (PDF)' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            {{ tender.teklifSayisi }} {{ 'Teklif Alındı' }}
          </span>

          <!-- Eğer Mutabakat Sağlandıysa: İptal Butonu -->
          <button
            v-if="tender.durum === 'closed' || tender.sure?.includes('Sonuçlandı') || tender.sure?.includes('Mutabakat')"
            type="button"
            @click="cancelTenderAgreement(tender)"
            class="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
            title="Mutabakatı iptal edip ihaleyi tekrar teklife aç"
          >
            <AlertCircle :size="12" />
            <span>Mutabakatı İptal Et</span>
          </button>

          <!-- Eğer Süresi Dolduysa: Tekrar İlan Ver Butonu -->
          <button
            v-else-if="tender.durum === 'expired' || tender.sure?.includes('Süresi Doldu')"
            type="button"
            @click="republishTender(tender)"
            class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
            title="İlanı 30 gün süreyle yeniden yayına al"
          >
            <RotateCw :size="12" />
            <span>Tekrar İlan Ver</span>
          </button>

          <!-- Gelen Tekliflere Git Linki -->
          <NuxtLink 
            :to="`/panel/gelen-teklifler?ilan=${tender.id}`" 
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 transition border border-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <span>Teklifleri İncele</span>
            <ChevronRight :size="13" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-3xl border bg-white p-12 sm:p-16 text-center space-y-4 shadow-xs" style="border-color: #E2E8F0;">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
        <FileText :size="24" />
      </div>
      <div class="space-y-1 max-w-md mx-auto">
        <h3 class="text-sm font-black text-slate-800">
          {{ tendersList.length === 0 ? 'Henüz Açtığınız Bir İhale Bulunmuyor' : 'Seçilen Filtrede İhale Bulunamadı' }}
        </h3>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          {{ tendersList.length === 0 ? 'Şartnamenizi yükleyerek ve malzeme listenizi belirterek ilk B2B satın alma ihalenizi hemen başlatabilirsiniz.' : 'Lütfen filtre kriterlerinizi değiştiriniz.' }}
        </p>
      </div>
      <div class="pt-1">
        <NuxtLink
          to="/panel/ihale-olustur"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-sm"
        >
          <Plus :size="14" />
          <span>Yeni İhale Aç</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
