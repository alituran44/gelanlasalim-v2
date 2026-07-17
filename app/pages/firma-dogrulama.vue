<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Building2, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Bell,
  HeartHandshake
} from 'lucide-vue-next'

definePageMeta({
  layout: 'public' // Header & Footer matching public pages
})

const router = useRouter()

// Wizard Steps: 1: Şirket Bilgileri, 2: Kişisel Bilgiler, 3: Özet & Beyan, 4: Bildirim Tercihleri
const currentStep = ref<1 | 2 | 3 | 4>(1)

// Step 1: Şirket Bilgileri
const firmaUnvani = ref('Ali Turan')
const firmaTuru = ref('Şahıs İşletmesi')
const vergiNo = ref('43624665040')
const vergiDairesi = ref('Çanakkale Vergi Dairesi Müdürlüğü')
const il = ref('Çanakkale')
const ilce = ref('Merkez')
const mahalle = ref('İsmet Paşa Mah.')
const postaKodu = ref('17100')
const acikAdres = ref('17100 Çanakkale')
const faturaAdresiAyni = ref(true)

// Step 2: Kişisel Bilgiler
const ad = ref('Ali')
const soyad = ref('Turan')
const yetkiliTckn = ref('43624665040')
const unvanRol = ref('Yönetici')
const faaliyetSektoru = ref<string[]>([
  'Yazılım & IT Hizmetleri',
  'Reklam & Pazarlama',
  'Elektrik & Elektronik'
])

// Step 3: Beyan
const beyanKabul = ref(true)

// Step 4: Bildirim Tercihleri
const bildirimTeklifler = ref(true)
const bildirimIhaleler = ref(true)
const bildirimKesif = ref(true)
const bildirimSozlesme = ref(true)
const bildirimDokumanlar = ref(true)
const bildirimGenel = ref(true)

// Static selections
const companyTypes = ['Şahıs İşletmesi', 'Limited Şirket (LTD)', 'Anonim Şirket (A.Ş.)', 'Kolektif Şirket']
const taxOffices = [
  'Çanakkale Vergi Dairesi Müdürlüğü',
  'İstanbul Büyük Mükellefler Vergi Dairesi',
  'Ankara Kızılbey Vergi Dairesi',
  'İzmir Kordon Vergi Dairesi',
  'Balıkesir Karesi Vergi Dairesi'
]
const roles = ['Yönetici', 'Satın Alma Sorumlusu', 'Tedarik Yöneticisi', 'Finans Direktörü']
const sectorsList = [
  'Elektrik & Elektronik',
  'Hammadde & Kimya',
  'Hırdavat',
  'Tarım & Tarımsal Ekipmanlar',
  'Tekstil',
  'Otomotiv',
  'İnşaat & Yapı',
  'Lojistik',
  'Reklam & Pazarlama',
  'Ofis & Kırtasiye',
  'Makine & İş Makineleri',
  'Yazılım & IT Hizmetleri',
  'Temizlik',
  'Güvenlik',
  'Sağlık & Kozmetik',
  'Spor & Outdoor'
]

// Form Validation States
const step1Errors = ref<Record<string, string>>({})
const step2Errors = ref<Record<string, string>>({})
const step3Errors = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    if (session.firstName) {
      ad.value = session.firstName
      soyad.value = session.lastName || ''
      firmaUnvani.value = session.company || `${session.firstName} ${session.lastName}`
    }
  }
})

function validateStep1() {
  step1Errors.value = {}
  
  if (!firmaUnvani.value.trim()) {
    step1Errors.value.firmaUnvani = 'Geçerli bir firma ünvanı girin'
  }
  if (!firmaTuru.value) {
    step1Errors.value.firmaTuru = 'Geçerli bir firma türü seçin'
  }
  if (!vergiNo.value || (vergiNo.value.length !== 10 && vergiNo.value.length !== 11)) {
    step1Errors.value.vergiNo = 'Geçerli bir VKN (10 hane) veya TCKN (11 hane) girin'
  }
  if (!vergiDairesi.value) {
    step1Errors.value.vergiDairesi = 'Vergi dairesi 2 ile 120 karakter arasında olmalı'
  }
  if (!il.value) {
    step1Errors.value.il = 'Geçerli bir il seçin'
  }
  if (!ilce.value) {
    step1Errors.value.ilce = 'Seçilen ile bağlı geçerli bir ilçe seçin'
  }
  if (!mahalle.value || mahalle.value.length < 2) {
    step1Errors.value.mahalle = 'Mahalle 2 ile 120 karakter arasında olmalı'
  }
  if (!postaKodu.value || postaKodu.value.length !== 5) {
    step1Errors.value.postaKodu = 'Posta kodu 5 haneli sayı olmalı'
  }
  if (!acikAdres.value || acikAdres.value.length < 10) {
    step1Errors.value.acikAdres = 'Açık adres 10 ile 500 karakter arasında olmalı'
  }

  return Object.keys(step1Errors.value).length === 0
}

function validateStep2() {
  step2Errors.value = {}
  
  if (!ad.value.trim()) step2Errors.value.ad = 'Ad boş olamaz'
  if (!soyad.value.trim()) step2Errors.value.soyad = 'Soyad boş olamaz'
  if (!yetkiliTckn.value || yetkiliTckn.value.length !== 11) {
    step2Errors.value.yetkiliTckn = 'Yetkili T.C. Kimlik numarası 11 haneli olmalıdır'
  }
  if (!unvanRol.value) step2Errors.value.unvanRol = 'Lütfen rolünüzü seçin'
  if (faaliyetSektoru.value.length === 0) {
    step2Errors.value.sektorler = 'En az 1 faaliyet sektörü seçmelisiniz'
  } else if (faaliyetSektoru.value.length > 3) {
    step2Errors.value.sektorler = 'En fazla 3 faaliyet sektörü seçebilirsiniz'
  }

  return Object.keys(step2Errors.value).length === 0
}

function handleStep1Next() {
  if (validateStep1()) {
    currentStep.value = 2
  }
}

function handleStep2Next() {
  if (validateStep2()) {
    currentStep.value = 3
  }
}

function toggleSector(sector: string) {
  const index = faaliyetSektoru.value.indexOf(sector)
  if (index >= 0) {
    faaliyetSektoru.value.splice(index, 1)
  } else {
    if (faaliyetSektoru.value.length < 3) {
      faaliyetSektoru.value.push(sector)
    }
  }
}

function submitVerification() {
  if (!beyanKabul.value) {
    step3Errors.value = 'Devam etmek için beyannameyi kabul etmelisiniz.'
    return
  }
  step3Errors.value = ''
  currentStep.value = 4 // Open preferences step
}

function saveAllAndRedirect() {
  if (typeof window !== 'undefined') {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    
    // Save detailed verified company details into session
    session.company = firmaUnvani.value
    session.companyType = firmaTuru.value
    session.vkn = vergiNo.value
    session.taxOffice = vergiDairesi.value
    session.address = `${mahalle.value} ${ilce.value}/${il.value}`
    session.roleTitle = unvanRol.value
    session.sektorler = faaliyetSektoru.value
    session.verified = true
    session.notificationPrefs = {
      teklifler: bildirimTeklifler.value,
      ihaleler: bildirimIhaleler.value,
      kesif: bildirimKesif.value,
      sozlesme: bildirimSozlesme.value,
      dokumanlar: bildirimDokumanlar.value,
      genel: bildirimGenel.value
    }
    
    localStorage.setItem('userSession', JSON.stringify(session))
  }
  
  // Verification done, redirect to plan selection or panel directly
  router.push('/panel')
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
    <div class="max-w-4xl mx-auto">
      
      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-800" style="color: #0F172A;">Firma Doğrulama</h1>
        <p class="text-sm text-slate-500 mt-1">Panele erişmeden önce firma bilgilerinizi tamamlayın. Kayıt sırasında verdiğiniz bilgileri tekrar istemiyoruz.</p>
      </div>

      <!-- PROGRESS INDICATOR STICK (Steps 1, 2, 3) -->
      <div v-if="currentStep <= 3" class="relative flex items-center justify-between mb-10 max-w-2xl">
        <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
        <div 
          class="absolute left-0 top-1/2 h-0.5 bg-blue-600 -translate-y-1/2 -z-10 transition-all duration-300"
          :style="{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }"
        ></div>

        <!-- Step 1 Badge -->
        <button 
          @click="currentStep = 1" 
          class="flex items-center gap-2.5 bg-slate-50 pr-4"
        >
          <div 
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition"
            :class="currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-200 text-slate-500'"
          >
            1
          </div>
          <span class="text-xs font-bold" :class="currentStep === 1 ? 'text-blue-600' : 'text-slate-500'">Şirket Bilgileri</span>
        </button>

        <!-- Step 2 Badge -->
        <button 
          @click="currentStep = currentStep > 1 ? 2 : 1" 
          class="flex items-center gap-2.5 bg-slate-50 px-4"
        >
          <div 
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition"
            :class="currentStep >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-200 text-slate-500'"
          >
            2
          </div>
          <span class="text-xs font-bold" :class="currentStep === 2 ? 'text-blue-600' : 'text-slate-500'">Kişisel Bilgiler</span>
        </button>

        <!-- Step 3 Badge -->
        <button 
          @click="currentStep = currentStep > 2 ? 3 : currentStep" 
          class="flex items-center gap-2.5 bg-slate-50 pl-4"
        >
          <div 
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition"
            :class="currentStep >= 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-200 text-slate-500'"
          >
            3
          </div>
          <span class="text-xs font-bold" :class="currentStep === 3 ? 'text-blue-600' : 'text-slate-500'">Özet & Beyan</span>
        </button>
      </div>

      <!-- STEP 1: ŞİRKET BİLGİLERİ -->
      <div v-if="currentStep === 1" class="space-y-6">
        
        <!-- Firma Kimliği Card -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <h3 class="text-sm font-bold text-slate-800 border-b pb-2" style="border-color: #F1F5F9;">Firma Kimliği</h3>
          
          <!-- Firma Ünvanı -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Firma Ünvanı *</label>
            <input 
              v-model="firmaUnvani" 
              type="text" 
              class="w-full rounded-xl border px-4 py-3 text-xs outline-none transition" 
              :class="step1Errors.firmaUnvani ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'"
              placeholder="Yasal firma unvanı girin"
            />
            <p v-if="step1Errors.firmaUnvani" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.firmaUnvani }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Firma Türü -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Firma Türü *</label>
              <select 
                v-model="firmaTuru" 
                class="w-full rounded-xl border px-4 py-3 text-xs bg-white outline-none transition"
                :class="step1Errors.firmaTuru ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'"
              >
                <option v-for="type in companyTypes" :key="type" :value="type">{{ type }}</option>
              </select>
              <p v-if="step1Errors.firmaTuru" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.firmaTuru }}</p>
            </div>

            <!-- Vergi Kimlik No / TC -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Vergi Kimlik No / TC *</label>
              <input 
                v-model="vergiNo" 
                type="text" 
                class="w-full rounded-xl border px-4 py-3 text-xs outline-none transition"
                :class="step1Errors.vergiNo ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'"
                placeholder="10 haneli VKN veya 11 haneli TCKN"
              />
              <p v-if="step1Errors.vergiNo" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.vergiNo }}</p>
            </div>
          </div>

          <!-- Vergi Dairesi -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Vergi Dairesi *</label>
            <select 
              v-model="vergiDairesi" 
              class="w-full rounded-xl border px-4 py-3 text-xs bg-white outline-none transition"
              :class="step1Errors.vergiDairesi ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'"
            >
              <option v-for="office in taxOffices" :key="office" :value="office">{{ office }}</option>
            </select>
            <p v-if="step1Errors.vergiDairesi" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.vergiDairesi }}</p>
          </div>
        </div>

        <!-- Fatura Adresi Card -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <h3 class="text-sm font-bold text-slate-800 border-b pb-2" style="border-color: #F1F5F9;">Fatura Adresi</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- İl -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">İl *</label>
              <select v-model="il" class="w-full rounded-xl border px-4 py-3 text-xs bg-white outline-none" :class="step1Errors.il ? 'border-red-500' : 'border-slate-200'">
                <option value="Çanakkale">Çanakkale</option>
                <option value="Balıkesir">Balıkesir</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
              </select>
              <p v-if="step1Errors.il" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.il }}</p>
            </div>

            <!-- İlçe -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">İlçe *</label>
              <select v-model="ilce" class="w-full rounded-xl border px-4 py-3 text-xs bg-white outline-none" :class="step1Errors.ilce ? 'border-red-500' : 'border-slate-200'">
                <option value="Merkez">Merkez</option>
                <option value="Ayvalık">Ayvalık</option>
                <option value="Çankaya">Çankaya</option>
                <option value="Kadıköy">Kadıköy</option>
              </select>
              <p v-if="step1Errors.ilce" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.ilce }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Mahalle -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Mahalle *</label>
              <input v-model="mahalle" type="text" placeholder="Örn: İsmet Paşa Mah." class="w-full rounded-xl border px-4 py-3 text-xs outline-none" :class="step1Errors.mahalle ? 'border-red-500' : 'border-slate-200'" />
              <p v-if="step1Errors.mahalle" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.mahalle }}</p>
            </div>

            <!-- Posta Kodu -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Posta Kodu *</label>
              <input v-model="postaKodu" type="text" placeholder="Örn: 17100" class="w-full rounded-xl border px-4 py-3 text-xs outline-none" :class="step1Errors.postaKodu ? 'border-red-500' : 'border-slate-200'" />
              <p v-if="step1Errors.postaKodu" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.postaKodu }}</p>
            </div>
          </div>

          <!-- Açık Adres -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Açık Adres *</label>
            <textarea v-model="acikAdres" rows="3" placeholder="Sokak, bina, daire bilgileri" class="w-full rounded-xl border p-4 text-xs outline-none" :class="step1Errors.acikAdres ? 'border-red-500' : 'border-slate-200'"></textarea>
            <p v-if="step1Errors.acikAdres" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step1Errors.acikAdres }}</p>
          </div>
        </div>

        <!-- Teslimat Adresi Card -->
        <div class="rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Teslimat Adresi</h4>
            <p class="text-[10px] text-slate-400 mt-0.5">Fatura adresiniz teslimat adresi olarak kaydedilecek.</p>
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="faturaAdresiAyni" type="checkbox" class="h-4.5 w-4.5 rounded text-blue-600 border-slate-300" />
            <span class="text-xs font-bold text-slate-700">Fatura adresini teslimat adresi olarak kullan</span>
          </label>
        </div>

        <!-- Navigation Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button 
            @click="handleStep1Next"
            class="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 shadow-lg shadow-blue-500/10 transition"
          >
            İleri
            <ChevronRight :size="14" />
          </button>
        </div>

      </div>

      <!-- STEP 2: KİŞİSEL BİLGİLER -->
      <div v-if="currentStep === 2" class="space-y-6">
        
        <!-- Yetkili Kişi Card -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <h3 class="text-sm font-bold text-slate-800 border-b pb-2" style="border-color: #F1F5F9;">Yetkili Kişi</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Ad -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Ad *</label>
              <input v-model="ad" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-blue-500" />
              <p v-if="step2Errors.ad" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step2Errors.ad }}</p>
            </div>

            <!-- Soyad -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Soyad *</label>
              <input v-model="soyad" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-blue-500" />
              <p v-if="step2Errors.soyad" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step2Errors.soyad }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- TCKN -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Kişinin T.C. Kimlik Numarası *</label>
              <input 
                v-model="yetkiliTckn" 
                type="text" 
                class="w-full rounded-xl border px-4 py-3 text-xs outline-none"
                :class="step2Errors.yetkiliTckn ? 'border-red-500' : 'border-slate-200'"
                placeholder="11 haneli T.C. No"
              />
              <p v-if="step2Errors.yetkiliTckn" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step2Errors.yetkiliTckn }}</p>
            </div>

            <!-- Rol / Ünvan -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Ünvan / Rol *</label>
              <select v-model="unvanRol" class="w-full rounded-xl border px-4 py-3 text-xs bg-white outline-none" :class="step2Errors.unvanRol ? 'border-red-500' : 'border-slate-200'">
                <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
              </select>
              <p v-if="step2Errors.unvanRol" class="text-[10px] text-red-500 mt-1 font-semibold">{{ step2Errors.unvanRol }}</p>
            </div>
          </div>
        </div>

        <!-- Faaliyet Sektörü Card -->
        <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
            <h3 class="text-sm font-bold text-slate-800">Faaliyet Sektörü</h3>
            <span class="text-[10px] font-bold text-slate-400">Şirket Faaliyet Sektörleri * <strong class="text-blue-600">{{ faaliyetSektoru.length }}/3</strong></span>
          </div>

          <!-- Sector Chips Selector -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sec in sectorsList"
              :key="sec"
              type="button"
              @click="toggleSector(sec)"
              class="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all border"
              :style="faaliyetSektoru.includes(sec)
                ? 'background: #2563EB; border-color: #2563EB; color: white;'
                : 'background: white; border-color: #E2E8F0; color: #64748B;'"
            >
              <span v-if="faaliyetSektoru.includes(sec)">✓</span>
              {{ sec }}
            </button>
          </div>
          <p v-if="step2Errors.sektorler" class="text-xs text-red-500 font-semibold mt-2">{{ step2Errors.sektorler }}</p>
          <p class="text-[10px] text-slate-400 mt-2">İlk seçtiğiniz sektör ana faaliyet sektörünüz olarak kaydedilir. En az 1, en fazla 3 sektör seçin.</p>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between gap-3 pt-4">
          <button 
            @click="currentStep = 1"
            class="rounded-xl border px-6 py-3.5 text-xs font-bold transition hover:bg-slate-100"
            style="border-color: #E2E8F0; color: #64748B;"
          >
            Geri
          </button>
          <button 
            @click="handleStep2Next"
            class="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 shadow-lg shadow-blue-500/10 transition"
          >
            İleri
            <ChevronRight :size="14" />
          </button>
        </div>

      </div>

      <!-- STEP 3: ÖZET & BEYAN -->
      <div v-if="currentStep === 3" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Box 1: Şirket Bilgileri -->
          <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3 relative" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Şirket Bilgileri</h4>
              <button @click="currentStep = 1" class="text-[10px] font-bold text-blue-600 hover:underline">Düzenle</button>
            </div>
            <div class="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px]">
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Firma Ünvanı</span>
                <span class="font-bold text-slate-700">{{ firmaUnvani }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Firma Türü</span>
                <span class="font-bold text-slate-700">{{ firmaTuru }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Vergi Kimlik No / TC</span>
                <span class="font-bold text-slate-700 font-mono">{{ vergiNo }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Vergi Dairesi</span>
                <span class="font-bold text-slate-700">{{ vergiDairesi }}</span>
              </div>
            </div>
          </div>

          <!-- Box 2: Yetkili Kişi -->
          <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3 relative" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Yetkili Kişi</h4>
              <button @click="currentStep = 2" class="text-[10px] font-bold text-blue-600 hover:underline">Düzenle</button>
            </div>
            <div class="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px]">
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Ad</span>
                <span class="font-bold text-slate-700">{{ ad }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Soyad</span>
                <span class="font-bold text-slate-700">{{ soyad }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Kişinin T.C. Kimlik No</span>
                <span class="font-bold text-slate-700 font-mono">{{ yetkiliTckn }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Ünvan / Rol</span>
                <span class="font-bold text-slate-700">{{ unvanRol }}</span>
              </div>
            </div>
            <div class="mt-2 pt-2 border-t" style="border-color: #F1F5F9;">
              <span class="text-slate-400 block uppercase text-[9px] font-black">Şirket Faaliyet Sektörleri</span>
              <span class="font-bold text-slate-700 text-[10px]">{{ faaliyetSektoru.join(', ') }}</span>
            </div>
          </div>

          <!-- Box 3: Fatura Adresi -->
          <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3 relative" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Fatura Adresi</h4>
              <button @click="currentStep = 1" class="text-[10px] font-bold text-blue-600 hover:underline">Düzenle</button>
            </div>
            <div class="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px]">
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">İl</span>
                <span class="font-bold text-slate-700">{{ il }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">İlçe</span>
                <span class="font-bold text-slate-700">{{ ilce }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Mahalle</span>
                <span class="font-bold text-slate-700">{{ mahalle }}</span>
              </div>
              <div>
                <span class="text-slate-400 block uppercase text-[9px] font-black">Posta Kodu</span>
                <span class="font-bold text-slate-700 font-mono">{{ postaKodu }}</span>
              </div>
            </div>
            <div class="mt-2 pt-2 border-t" style="border-color: #F1F5F9;">
              <span class="text-slate-400 block uppercase text-[9px] font-black">Açık Adres</span>
              <span class="font-bold text-slate-700 text-[10px]">{{ acikAdres }}</span>
            </div>
          </div>

          <!-- Box 4: Teslimat Adresi -->
          <div class="rounded-xl border bg-white p-5 shadow-sm space-y-3 relative" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-1.5" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Teslimat Adresi</h4>
              <button @click="currentStep = 1" class="text-[10px] font-bold text-blue-600 hover:underline">Düzenle</button>
            </div>
            <div class="text-[11px]">
              <span class="text-slate-400 block uppercase text-[9px] font-black">Teslimat Adresi Durumu</span>
              <p class="font-bold text-slate-700 text-[11px] mt-1">
                {{ faturaAdresiAyni ? 'Fatura adresi ile aynı.' : 'Farklı bir teslimat adresi belirtildi.' }}
              </p>
            </div>
          </div>

        </div>

        <!-- Beyan Checkbox -->
        <div class="rounded-xl border bg-white p-4 shadow-sm mt-6 flex items-start gap-3" style="border-color: #E2E8F0;">
          <input v-model="beyanKabul" id="beyan" type="checkbox" class="h-4.5 w-4.5 rounded text-blue-600 border-slate-300 mt-0.5" />
          <label for="beyan" class="text-xs font-bold text-slate-600 cursor-pointer">
            Beyan: <span class="font-medium text-slate-500">Verdiğim bilgilerin doğru ve güncel olduğunu, beyanımın gerçeği yansıttığını kabul ediyorum.</span>
          </label>
        </div>
        <p v-if="step3Errors" class="text-xs text-red-500 font-bold mt-2">⚠️ {{ step3Errors }}</p>

        <!-- Navigation Buttons -->
        <div class="flex justify-between gap-3 pt-4">
          <button 
            @click="currentStep = 2"
            class="rounded-xl border px-6 py-3.5 text-xs font-bold transition hover:bg-slate-100"
            style="border-color: #E2E8F0; color: #64748B;"
          >
            Geri
          </button>
          <button 
            @click="submitVerification"
            class="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 shadow-lg shadow-blue-500/10 transition"
          >
            Doğrulamayı Tamamla
          </button>
        </div>

      </div>

      <!-- STEP 4: BİLDİRİM TERCİHLERİ SCREEN (Welcome Screen) -->
      <div v-if="currentStep === 4" class="max-w-2xl mx-auto py-4 space-y-6">
        
        <div class="text-center space-y-2">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2">
            <HeartHandshake :size="24" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block">HOŞ GELDİNİZ</span>
          <h2 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Bildirim tercihlerini seç</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">Tüm bildirimler açık. Dilediğiniz zaman bildirim ayarlarından değiştirebilirsiniz.</p>
        </div>

        <!-- Quick selection links -->
        <div class="flex justify-end gap-3 text-[11px] font-bold text-slate-400 mb-2">
          <button 
            type="button" 
            @click="bildirimTeklifler=true; bildirimIhaleler=true; bildirimKesif=true; bildirimSozlesme=true; bildirimDokumanlar=true; bildirimGenel=true;"
            class="hover:text-blue-600"
          >
            Tümünü seç
          </button>
          <span>·</span>
          <button 
            type="button" 
            @click="bildirimTeklifler=false; bildirimIhaleler=false; bildirimKesif=false; bildirimSozlesme=false; bildirimDokumanlar=false; bildirimGenel=false;"
            class="hover:text-blue-600"
          >
            Hiçbiri
          </button>
        </div>

        <!-- Grid of 6 Notification Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Opt 1: Teklifler -->
          <button 
            type="button" 
            @click="bildirimTeklifler = !bildirimTeklifler"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimTeklifler ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimTeklifler ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Teklifler</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">Teklif durumu ve sonuçları bildirimleri</p>
            </div>
          </button>

          <!-- Opt 2: İhaleler -->
          <button 
            type="button" 
            @click="bildirimIhaleler = !bildirimIhaleler"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimIhaleler ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimIhaleler ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">İhaleler</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">İhale süreçleri ve sonuçları bildirimleri</p>
            </div>
          </button>

          <!-- Opt 3: Keşif ve Takip -->
          <button 
            type="button" 
            @click="bildirimKesif = !bildirimKesif"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimKesif ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimKesif ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Keşif ve Takip</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">Yeni fırsatlar ve takip edilen firmalar</p>
            </div>
          </button>

          <!-- Opt 4: Sözleşme ve Teslimat -->
          <button 
            type="button" 
            @click="bildirimSozlesme = !bildirimSozlesme"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimSozlesme ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimSozlesme ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Sözleşme ve Teslimat</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">Sözleşme ve sevkiyat süreçleri bildirimleri</p>
            </div>
          </button>

          <!-- Opt 5: Dokümanlar -->
          <button 
            type="button" 
            @click="bildirimDokumanlar = !bildirimDokumanlar"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimDokumanlar ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimDokumanlar ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Dokümanlar</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">Doküman onay ve red bildirimleri</p>
            </div>
          </button>

          <!-- Opt 6: Genel -->
          <button 
            type="button" 
            @click="bildirimGenel = !bildirimGenel"
            class="flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all"
            :class="bildirimGenel ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'"
          >
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold mt-0.5" :class="bildirimGenel ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent'">✓</div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Genel</h4>
              <p class="text-[10px] text-slate-400 mt-1 leading-normal">Ekip, etkinlik ve değerlendirmeler</p>
            </div>
          </button>

        </div>

        <!-- Footer notification badge -->
        <div class="rounded-xl p-3 text-[10px] font-bold text-blue-700 bg-blue-50 flex items-center gap-2 max-w-sm mx-auto">
          <Bell :size="14" />
          <span>Tercihlerin paneline kaydedilecek.</span>
        </div>

        <!-- Submit actions -->
        <div class="flex items-center justify-between pt-6 border-t" style="border-color: #F1F5F9;">
          <button 
            type="button" 
            @click="saveAllAndRedirect"
            class="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Şimdilik geç
          </button>
          
          <button 
            type="button"
            @click="saveAllAndRedirect"
            class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3.5 shadow-lg shadow-blue-500/10 transition"
          >
            Kaydet ve devam et
          </button>
        </div>

      </div>

    </div>
  </div>
</template>
