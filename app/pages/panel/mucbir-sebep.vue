<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Scale, 
  AlertTriangle, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  X, 
  Building2, 
  ShieldCheck,
  FileCheck,
  ChevronRight,
  HelpCircle,
  ArrowLeft
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: 'dashboard'
})

const { cmsData, saveCmsData } = useCmsData()

const userSession = ref<any>({})
const showNewDisputeModal = ref(false)
const selectedFilter = ref<'all' | 'pending' | 'resolved'>('all')

// Form State
const disputeForm = ref({
  tenderTitle: '',
  selectedTenderId: '',
  counterparty: '',
  amount: '',
  category: 'Doğal Afet (Deprem, Sel, Yangın vb.)',
  description: '',
  files: [] as { name: string; size: string; url: string }[]
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)
const successMessage = ref('')

const disputeCategories = [
  'Doğal Afet (Deprem, Sel, Yangın, Fırtına vb.)',
  'Resmi İdare Kararı & Hukuki Mevzuat Değişikliği',
  'Ağır Hammadde İthalat Kısıtı & Lojistik Ambargo',
  'İflas, Konkordato veya Şirket Tasfiyesi',
  'Genel Salgın & Karantina Tedbirleri',
  'Öngörülemeyen Ağır Mali Çöküş / Mücbir Sebep',
  'Diğer Haklı Fesih Gerekçesi'
]

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch (e) {}
  }
})

// User's own tenders or bids to select from
const availableTenders = computed(() => {
  const all = cmsData.value?.dashboard?.tenders || []
  return all.map((t: any) => ({
    id: t.id,
    title: t.baslik,
    company: t.ownerCompany || 'İhaleci Firma',
    amount: t.butce || 'Belirtilmemiş'
  }))
})

// All disputes filtered for this user
const myDisputes = computed(() => {
  const disputes = cmsData.value?.dashboard?.disputes || []
  return disputes.filter((d: any) => {
    if (selectedFilter.value === 'pending') return d.status === 'INCELEMEDE' || d.status === 'INCELENIYOR'
    if (selectedFilter.value === 'resolved') return d.status === 'FESİH_ONAYLANDI' || d.status === 'REDDEDILDI'
    return true
  })
})

function onTenderSelect() {
  const found = availableTenders.value.find(t => t.id === disputeForm.value.selectedTenderId)
  if (found) {
    disputeForm.value.tenderTitle = found.title
    disputeForm.value.counterparty = found.company
    disputeForm.value.amount = found.amount
  }
}

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  for (let i = 0; i < target.files.length; i++) {
    const file = target.files[i]
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    const reader = new FileReader()
    reader.onload = (e) => {
      disputeForm.value.files.push({
        name: file.name,
        size: sizeMB,
        url: (e.target?.result as string) || ''
      })
    }
    reader.readAsDataURL(file)
  }
}

function removeFile(index: number) {
  disputeForm.value.files.splice(index, 1)
}

function submitDispute() {
  if (!disputeForm.value.tenderTitle || !disputeForm.value.description) {
    alert('Lütfen ihale adını ve mücbir sebep fesih gerekçenizi detaylıca açıklayınız.')
    return
  }

  isSubmitting.value = true

  const myCompany = userSession.value?.companyName || userSession.value?.company || userSession.value?.name || 'Yetkili Firma'
  const newDisputeId = 'FSH-2026-' + Math.floor(100 + Math.random() * 900)

  const disputeItem = {
    id: newDisputeId,
    tenderId: disputeForm.value.selectedTenderId || 'IHC-MANUAL',
    tenderTitle: disputeForm.value.tenderTitle,
    applicant: myCompany,
    applicantEmail: userSession.value?.email || 'ihalecib@gmail.com',
    parties: `${myCompany} ↔ ${disputeForm.value.counterparty || 'Karşı Taraf Firma'}`,
    amount: disputeForm.value.amount || 'Pazarlık Tutarı',
    category: disputeForm.value.category,
    reason: `${disputeForm.value.category} — ${disputeForm.value.description}`,
    files: disputeForm.value.files.map(f => f.name),
    status: 'INCELENIYOR',
    statusLabel: 'Hakem Heyeti İnceliyor',
    date: 'Bugün',
    decisionNote: ''
  }

  if (!Array.isArray(cmsData.value.dashboard.disputes)) {
    cmsData.value.dashboard.disputes = []
  }

  cmsData.value.dashboard.disputes.unshift(disputeItem)
  saveCmsData(cmsData.value)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'))
  }

  setTimeout(() => {
    isSubmitting.value = false
    showNewDisputeModal.value = false
    successMessage.value = `✓ Mücbir Sebep & Fesih başvurunuz (${newDisputeId}) İhaleciBurada Hukuk ve Hakem Heyeti Masası'na iletildi.`
    
    // Reset form
    disputeForm.value = {
      tenderTitle: '',
      selectedTenderId: '',
      counterparty: '',
      amount: '',
      category: 'Doğal Afet (Deprem, Sel, Yangın vb.)',
      description: '',
      files: []
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 6000)
  }, 500)
}
</script>

<template>
  <div class="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-left font-sans">
    
    <!-- Üst Başlık & Açıklama -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black shadow-xs">
            <Scale :size="22" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              Mücbir Sebep & Sözleşme Feshi Masası
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Beklenmedik mücbir sebeplerde cezai şartsız sözleşme feshi ve hakem heyeti uyuşmazlık çözüm talepleri.
            </p>
          </div>
        </div>
      </div>

      <!-- Yeni Başvuru Butonu -->
      <button 
        type="button" 
        @click="showNewDisputeModal = true"
        class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer shrink-0"
      >
        <Plus :size="15" />
        <span>+ Yeni Fesih / Mücbir Sebep Başvurusu</span>
      </button>
    </div>

    <!-- Başarı Bildirim Bannerı -->
    <div v-if="successMessage" class="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-sm">
      <div class="flex items-center gap-2">
        <CheckCircle2 :size="18" class="text-emerald-600" />
        <span>{{ successMessage }}</span>
      </div>
      <button type="button" @click="successMessage = ''" class="text-emerald-700 hover:text-emerald-900">✕</button>
    </div>

    <!-- Hukuki Bilgilendirme Kartı -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div class="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <ShieldCheck :size="16" class="text-emerald-600" />
          <span>Cezai Şartsız Fesih Hakkı</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed">
          6098 sayılı Türk Borçlar Kanunu ve platform ihale şartnameleri uyarınca, tarafların kusurundan kaynaklanmayan mücbir sebeplerde teminat irat kaydedilmeden sözleşme feshedilebilir.
        </p>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div class="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Scale :size="16" class="text-blue-600" />
          <span>Bağımsız Hakem İncelemesi</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed">
          İletilen resmi evraklar ve gerekçeler, platformun bağımsız hukuk ve denetim kurulu tarafından 48 saat içinde değerlendirilerek karara bağlanır.
        </p>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div class="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <FileCheck :size="16" class="text-amber-600" />
          <span>Escrow Ödeme Koruması</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed">
          Fesih başvurusu onaylandığında, havuzda bloke tutulan ödeme bedelleri herhangi bir komisyon veya ceza kesintisi yapılmadan alıcıya iade edilir.
        </p>
      </div>
    </div>

    <!-- Filtre Sekmeleri -->
    <div class="flex items-center justify-between gap-3 pt-2">
      <div class="flex items-center gap-1.5">
        <button 
          type="button" 
          @click="selectedFilter = 'all'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="selectedFilter === 'all' ? 'bg-[#0F223D] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        >
          Tüm Başvurular ({{ (cmsData?.dashboard?.disputes || []).length }})
        </button>
        <button 
          type="button" 
          @click="selectedFilter = 'pending'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="selectedFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        >
          İncelemede Olanlar ({{ (cmsData?.dashboard?.disputes || []).filter((d: any) => d.status === 'INCELENIYOR' || d.status === 'INCELEMEDE').length }})
        </button>
        <button 
          type="button" 
          @click="selectedFilter = 'resolved'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="selectedFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        >
          Sonuçlanan Kararlar ({{ (cmsData?.dashboard?.disputes || []).filter((d: any) => d.status === 'FESİH_ONAYLANDI' || d.status === 'REDDEDILDI').length }})
        </button>
      </div>
    </div>

    <!-- Başvurular Tablosu / Listesi -->
    <div class="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div v-if="myDisputes.length === 0" class="p-12 text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Scale :size="28" />
        </div>
        <h3 class="font-black text-slate-800 text-sm">Aktif Mücbir Sebep & Fesih Başvurusu Bulunmuyor</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Şu ana kadar açılmış herhangi bir sözleşme feshi veya mücbir sebep ihtilaf kaydınız bulunmamaktadır.
        </p>
        <button 
          type="button" 
          @click="showNewDisputeModal = true"
          class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition cursor-pointer"
        >
          + Başvuru Oluştur
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <th class="p-4">TALEP NO & İHALE</th>
              <th class="p-4">TARAFLAR & TUTAR</th>
              <th class="p-4">MÜCBİR SEBEP GEREKÇESİ</th>
              <th class="p-4">DURUM</th>
              <th class="p-4 text-right">HAKEM HEYETİ KARARI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="disp in myDisputes" :key="disp.id" class="hover:bg-slate-50/70 transition">
              <td class="p-4">
                <div class="font-bold text-slate-900">{{ disp.tenderTitle }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ disp.id }} · {{ disp.date }}</div>
              </td>
              <td class="p-4 text-slate-700">
                <div class="font-medium">{{ disp.parties }}</div>
                <div class="text-emerald-700 font-mono font-bold mt-0.5">{{ disp.amount }}</div>
              </td>
              <td class="p-4 text-slate-600 max-w-sm">
                <div class="text-[11px] leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {{ disp.reason }}
                </div>
                <div v-if="disp.files && disp.files.length > 0" class="mt-1 flex items-center gap-1 text-[10px] text-blue-600 font-mono">
                  <span>📎 Ekli Belgeler:</span>
                  <span>{{ disp.files.join(', ') }}</span>
                </div>
              </td>
              <td class="p-4">
                <span 
                  v-if="disp.status === 'FESİH_ONAYLANDI'"
                  class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black flex items-center gap-1 w-fit"
                >
                  <CheckCircle2 :size="12" /> Fesih Onaylandı
                </span>
                <span 
                  v-else-if="disp.status === 'REDDEDILDI'"
                  class="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-black flex items-center gap-1 w-fit"
                >
                  <XCircle :size="12" /> Talep Reddedildi
                </span>
                <span 
                  v-else
                  class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black flex items-center gap-1 w-fit animate-pulse"
                >
                  <Clock :size="12" /> İnceleniyor
                </span>
              </td>
              <td class="p-4 text-right">
                <div v-if="disp.status === 'FESİH_ONAYLANDI'" class="text-xs font-bold text-emerald-700">
                  ✓ Cezai şartsız feshedildi & teminat serbest
                </div>
                <div v-else-if="disp.status === 'REDDEDILDI'" class="text-xs font-bold text-red-600">
                  ✕ Sözleşme yükümlülüğü devam ediyor
                </div>
                <div v-else class="text-xs text-slate-400 font-mono">
                  Karar Bekleniyor (Maks. 48 Saat)
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- YENİ MÜCBİR SEBEP & FESİH BAŞVURU MODALI -->
    <!-- ========================================================================= -->
    <div v-if="showNewDisputeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl text-left space-y-5 max-h-[92vh] overflow-y-auto">
        
        <!-- Modal Başlık -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <Scale :size="20" class="text-red-600" />
            <h3 class="text-base font-black text-slate-900">Mücbir Sebep & Fesih Başvurusu Oluştur</h3>
          </div>
          <button type="button" @click="showNewDisputeModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="submitDispute" class="space-y-4 text-xs">
          
          <!-- İhale Seçimi -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">İhale / Sözleşme Seçimi</label>
            <select 
              v-model="disputeForm.selectedTenderId" 
              @change="onTenderSelect"
              class="w-full rounded-xl border p-2.5 bg-white outline-none font-medium focus:border-blue-500 text-slate-800"
              style="border-color: #CBD5E1;"
            >
              <option value="">İhale seçiniz veya aşağıya manuel yazınız...</option>
              <option v-for="t in availableTenders" :key="t.id" :value="t.id">{{ t.id }} - {{ t.title }}</option>
            </select>
          </div>

          <!-- İhale Başlığı Manuel Giriş -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">İhale / Alım Başlığı *</label>
            <input 
              v-model="disputeForm.tenderTitle" 
              type="text" 
              placeholder="Örn: 10 KM Mıcır Yol Yapım İşi veya Ofis Malzemeleri Alımı" 
              class="w-full rounded-xl border p-2.5 bg-white outline-none font-medium focus:border-blue-500"
              style="border-color: #CBD5E1;"
              required
            />
          </div>

          <!-- Karşı Taraf ve Bütçe -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Karşı Taraf Firma / Kurum</label>
              <input 
                v-model="disputeForm.counterparty" 
                type="text" 
                placeholder="Örn: ABC İnşaat A.Ş." 
                class="w-full rounded-xl border p-2.5 bg-white outline-none font-medium focus:border-blue-500"
                style="border-color: #CBD5E1;"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Sözleşme / İhale Tutarı</label>
              <input 
                v-model="disputeForm.amount" 
                type="text" 
                placeholder="Örn: 450.000 ₺" 
                class="w-full rounded-xl border p-2.5 bg-white outline-none font-medium focus:border-blue-500"
                style="border-color: #CBD5E1;"
              />
            </div>
          </div>

          <!-- Mücbir Sebep Türü -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">Mücbir Sebep Kategorisi *</label>
            <select 
              v-model="disputeForm.category" 
              class="w-full rounded-xl border p-2.5 bg-white outline-none font-medium focus:border-blue-500 text-slate-800"
              style="border-color: #CBD5E1;"
            >
              <option v-for="cat in disputeCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Detaylı Gerekçe Açıklaması -->
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">
              Fesih Gerekçesi & Olay Açıklaması *
            </label>
            <textarea 
              v-model="disputeForm.description" 
              rows="4" 
              placeholder="Mücbir sebebin ne zaman meydana geldiğini, sözleşme ifasını nasıl imkansız kıldığını ve talebinizi detaylıca açıklayınız..."
              class="w-full rounded-xl border p-3 bg-white outline-none font-medium focus:border-blue-500 text-xs leading-relaxed"
              style="border-color: #CBD5E1;"
              required
            ></textarea>
          </div>

          <!-- Resmi Belge & Rapor Yükleme -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase">
              Resmi Kanıt & Rapor Belgeleri (AFAD, İtfaiye, Mahkeme, Ticaret Odası vb.)
            </label>
            <input 
              ref="fileInputRef" 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.png" 
              @change="handleFileUpload" 
              class="hidden" 
            />
            <div 
              @click="triggerFileSelect"
              class="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/20 transition cursor-pointer text-center space-y-1"
            >
              <UploadCloud :size="24" class="text-slate-400 mx-auto" />
              <div class="font-bold text-slate-700 text-xs">Belge Yüklemek İçin Tıklayınız (PDF / JPEG / PNG)</div>
              <div class="text-[10px] text-slate-400">Resmi raporlar inceleme sürecini hızlandıracaktır.</div>
            </div>

            <!-- Yüklenen Dosyalar Listesi -->
            <div v-if="disputeForm.files.length > 0" class="space-y-1.5 pt-1">
              <div 
                v-for="(f, idx) in disputeForm.files" 
                :key="idx"
                class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div class="flex items-center gap-2 truncate font-mono text-[11px]">
                  <FileText :size="14" class="text-blue-600 shrink-0" />
                  <span class="truncate">{{ f.name }} ({{ f.size }})</span>
                </div>
                <button type="button" @click="removeFile(idx)" class="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                  <X :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- Butonlar -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              @click="showNewDisputeModal = false"
              class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Vazgeç
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer disabled:opacity-50"
            >
              <Scale :size="14" />
              <span>{{ isSubmitting ? 'İletiliyor...' : 'Hakem Heyetine Başvuruyu Gönder' }}</span>
            </button>
          </div>

        </form>

      </div>
    </div>

  </div>
</template>
