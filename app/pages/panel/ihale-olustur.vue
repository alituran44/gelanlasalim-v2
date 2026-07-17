<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FilePlus2, ArrowLeft, CheckCircle2 } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const { cmsData, saveCmsData } = useCmsData()

const form = ref({
  baslik: '',
  kategori: 'Hammadde & Metal',
  sure: '7 gün',
  butce: '',
  aciklama: ''
})

const categories = [
  'Hammadde & Metal',
  'Lojistik & Nakliye',
  'Kırtasiye & Ofis',
  'Teknoloji & Yazılım',
  'İnşaat & Taahhüt',
  'Enerji & Yakıt',
  'Pazarlama & Reklam'
]

const durations = [
  '3 gün',
  '5 gün',
  '7 gün',
  '10 gün',
  '15 gün',
  '30 gün'
]

const showSuccess = ref(false)
const createdId = ref('')

function handleSubmit() {
  if (!form.value.baslik || !form.value.butce) return

  // Format budget with currency sign if missing
  let budgetVal = form.value.butce.trim()
  if (!budgetVal.startsWith('₺')) {
    budgetVal = '₺' + budgetVal
  }

  // Generate unique B2B procurement ID
  const newId = 'IHC-2026-' + Math.floor(100 + Math.random() * 900)
  createdId.value = newId

  // Add to active tenders
  cmsData.value.dashboard.tenders.unshift({
    id: newId,
    baslik: form.value.baslik,
    kategori: form.value.kategori,
    sure: form.value.sure,
    teklifSayisi: 0,
    durum: 'active',
    butce: budgetVal,
    olusturma: 'Bugün'
  })

  // Create matching empty received bids slot
  cmsData.value.dashboard.receivedBids.unshift({
    id: newId,
    baslik: form.value.baslik,
    kategori: form.value.kategori,
    bitis: form.value.sure,
    teklifler: []
  })

  // Persist to localStorage
  saveCmsData(cmsData.value)

  showSuccess.value = true
  setTimeout(() => {
    router.push('/panel/ilanlarim')
  }, 2000)
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto text-left">
    
    <!-- Geri Dönüş Linki -->
    <div class="mb-5">
      <NuxtLink to="/panel/ilanlarim" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft :size="14" />
        İlanlarıma Dön
      </NuxtLink>
    </div>

    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <FilePlus2 class="text-blue-600" :size="22" />
        Yeni İhale İlanı Oluştur
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Satın alma talebiniz için tedarikçilerden rekabetçi canlı teklifler toplayın</p>
    </div>

    <!-- Başarı Mesajı -->
    <div v-if="showSuccess" class="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center transition-all animate-bounce">
      <CheckCircle2 class="text-emerald-500 mx-auto mb-2" :size="36" />
      <h3 class="text-sm font-bold text-emerald-800">İhale Başarıyla Oluşturuldu!</h3>
      <p class="text-xs text-emerald-600 mt-1">İhale Kodu: <strong>{{ createdId }}</strong>. İlanlarım listesine yönlendiriliyorsunuz...</p>
    </div>

    <!-- İhale Formu -->
    <form v-else @submit.prevent="handleSubmit" class="rounded-xl border bg-white p-6 shadow-sm space-y-5" style="border-color: #E2E8F0;">
      
      <!-- İhale Başlığı -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">İHALE BAŞLIĞI *</label>
        <input 
          v-model="form.baslik" 
          type="text" 
          required 
          placeholder="Örn: 20.000 Adet Mukavva Kutu Alımı" 
          class="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" 
          style="border-color: #CBD5E1; color: #0F172A;"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Kategori -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">İHALE KATEGORİSİ</label>
          <select 
            v-model="form.kategori" 
            class="w-full rounded-lg border p-3 text-sm outline-none bg-white transition focus:border-blue-600"
            style="border-color: #CBD5E1; color: #0F172A;"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Yaklaşık Bütçe -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">YAKLAŞIK BÜTÇE (₺) *</label>
          <input 
            v-model="form.butce" 
            type="text" 
            required 
            placeholder="Örn: 150.000" 
            class="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            style="border-color: #CBD5E1; color: #0F172A;"
          />
        </div>
      </div>

      <!-- İhale Süresi -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">TEKLİF TOPLAMA SÜRESİ</label>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button 
            v-for="dur in durations" 
            :key="dur" 
            type="button"
            @click="form.sure = dur"
            class="rounded-lg border py-2 text-xs font-bold transition text-center"
            :style="form.sure === dur 
              ? 'background: #1E3A5F; border-color: #1E3A5F; color: white;' 
              : 'background: white; border-color: #CBD5E1; color: #475569;'"
          >
            {{ dur }}
          </button>
        </div>
      </div>

      <!-- Teknik Açıklama & Şartname -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">TEKNİK ŞARTNAME & AÇIKLAMA</label>
        <textarea 
          v-model="form.aciklama" 
          rows="4" 
          placeholder="İhale kalemlerinin miktarlarını, teslimat şartlarını ve kalite standartlarını belirtin..." 
          class="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          style="border-color: #CBD5E1; color: #0F172A;"
        ></textarea>
      </div>

      <!-- Gönder Butonu -->
      <div class="pt-2">
        <button 
          type="submit" 
          class="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 transition shadow-lg shadow-blue-500/10"
        >
          <FilePlus2 :size="16" />
          İhaleyi Başlat ve İlan Et
        </button>
      </div>

    </form>
  </div>
</template>
