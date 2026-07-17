<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  User, 
  Building2, 
  MapPin, 
  Bell, 
  Heart, 
  History, 
  Award, 
  Sliders, 
  Camera, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Save, 
  Lock,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  Building,
  Shield,
  Clock,
  LogOut,
  Laptop,
  Check,
  RotateCw,
  Globe,
  FileText
} from 'lucide-vue-next'

definePageMeta({ 
  layout: 'dashboard' 
})

// Sub-navigation tabs matching screenshot
const activeSubTab = ref<'kisisel' | 'sirket' | 'adresler' | 'bildirimler' | 'takip' | 'ticaret' | 'uyelik' | 'ayarlar'>('kisisel')

// Personal Profile data
const profileForm = ref({
  name: 'Ali',
  surname: 'Turan',
  email: 'alituran88@gmail.com',
  phone: '5437340860',
  title: 'Yönetici'
})

// Company & Verification details
const companyVerified = ref(false)
const companyForm = ref({
  name: 'Ali Turan',
  legalName: 'Ali Turan',
  contactPerson: 'Çehre',
  taxNo: '45624685040',
  taxOffice: 'Çanakkale Vergi Dairesi Müdürlüğü',
  sectors: 'Yazılım & IT Hizmetleri, Reklam & Pazarlama, Elektrik & Elektronik',
  mersis: '',
  sicilNo: '',
  kep: '',
  faturaAdresi: '17100 Çanakkale İsmet Paşa Mah. Merkez Çanakkale 17100',
  iban: '',
  accountHolder: '',
  is2FaEnabled: false
})

// Document Upload status counters
const uploadedDocs = ref<Record<string, boolean>>({
  vergi: false,
  sicil: false,
  imza: false,
  faaliyet: false,
  kimlikOn: false,
  kimlikArka: false
})

const docsCount = computed(() => {
  return Object.values(uploadedDocs.value).filter(Boolean).length
})

function uploadDoc(key: string) {
  uploadedDocs.value[key] = true
}

// Addresses list tabs
const activeAddressType = ref<'teslimat' | 'fatura'>('teslimat')

// Notification preferences
const notifyMail = ref(true)
const notifySms = ref(false)
const notifyBrowser = ref(true)

// Theme and preferences
const activeTheme = ref<'sistem' | 'acik' | 'koyu'>('sistem')
const selectedLanguage = ref('Türkçe')
const timeFormat = ref('24 saat')
const timezone = ref('Europe/Istanbul (GMT+3)')

// KVKK Request
const kvkkRequestType = ref('Veri Erişim Talebi')
const kvkkDescription = ref('')
const kvkkSuccess = ref(false)

function submitKvkk() {
  if (kvkkDescription.value.length >= 10) {
    kvkkSuccess.value = true
    setTimeout(() => {
      kvkkSuccess.value = false
      kvkkDescription.value = ''
    }, 3000)
  }
}

const isSaved = ref(false)

function saveProfile() {
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 3000)
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Global Banner for Unverified State -->
    <div 
      v-if="!companyVerified"
      class="rounded-xl border bg-emerald-50/50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-emerald-800"
      style="border-color: #A7F3D0;"
    >
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>🔋 Hesabınız henüz aktif değil. 3 kritik adım tamamlanmayı bekliyor.</span>
      </div>
      <button 
        type="button"
        @click="activeSubTab = 'sirket'"
        class="rounded-lg bg-emerald-800 text-white px-3 py-1.5 hover:bg-emerald-900 transition self-start sm:self-auto"
      >
        Zorunlu belgeleri yükleyin
      </button>
    </div>

    <!-- Title and Breadcrumbs -->
    <div>
      <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Hesap Merkezi</span>
      <h1 class="text-2xl font-black text-slate-800 mt-1" style="color: #0F172A;">
        {{ 
          activeSubTab === 'kisisel' ? 'Hesap Merkezi' :
          activeSubTab === 'sirket' ? 'Kurumsal Kimlik' :
          activeSubTab === 'adresler' ? 'Kayıtlı Adresler' :
          activeSubTab === 'takip' ? 'Takip Ettiklerim' : 
          activeSubTab === 'ayarlar' ? 'Ayarlar' : 'Ayarlar'
        }}
      </h1>
      <p class="text-xs text-slate-500 mt-1">
        {{ 
          activeSubTab === 'kisisel' ? 'Kişisel bilgilerinizi, medya varlıklarınızı ve iletişim tercihlerinizi yönetin.' :
          activeSubTab === 'sirket' ? 'Bağlı olduğunuz organizasyonun detaylarını ve doğrulama sürecini yönetin.' :
          activeSubTab === 'adresler' ? 'Teslimat adreslerinizi yönetin. İhale oluştururken hızlıca seçebilirsiniz.' :
          activeSubTab === 'takip' ? 'Takip ettiğiniz firmaları görüntüleyin ve güncellemelerini izleyin.' :
          'Güvenlik, görünüm, bildirim ve yasal tercihlerinizi tek yerden yönetin.'
        }}
      </p>
    </div>

    <!-- Main Grid Layout with Sub-Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Left Submenu Menu List (1 Column) -->
      <div class="space-y-4">
        
        <!-- Profile Category -->
        <div class="space-y-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-3 mb-1">PROFİL</span>
          
          <button 
            type="button"
            @click="activeSubTab = 'kisisel'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'kisisel' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <User :size="14" />
            Kişisel
          </button>
          
          <button 
            type="button"
            @click="activeSubTab = 'sirket'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'sirket' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <Building2 :size="14" />
            Şirket & Doğrulama
          </button>
        </div>

        <!-- İş Akışı Category -->
        <div class="space-y-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-3 mb-1">İŞ AKIŞI</span>
          
          <button 
            type="button"
            @click="activeSubTab = 'adresler'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'adresler' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <MapPin :size="14" />
            Kayıtlı Adresler
          </button>
          
          <button 
            type="button"
            @click="activeSubTab = 'bildirimler'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'bildirimler' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <Bell :size="14" />
            Bildirimler
          </button>

          <button 
            type="button"
            @click="activeSubTab = 'takip'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'takip' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <Heart :size="14" />
            Takip Ettiklerim
          </button>

          <button 
            type="button"
            @click="activeSubTab = 'ticaret'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'ticaret' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <History :size="14" />
            Geçmiş Ticaretlerim
          </button>
        </div>

        <!-- Hesap Category -->
        <div class="space-y-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-3 mb-1">HESAP</span>
          
          <button 
            type="button"
            @click="activeSubTab = 'uyelik'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'uyelik' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <Award :size="14" />
            Üyelik
          </button>

          <button 
            type="button"
            @click="activeSubTab = 'ayarlar'"
            class="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition text-left"
            :class="activeSubTab === 'ayarlar' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          >
            <Sliders :size="14" />
            Ayarlar
          </button>
        </div>

      </div>

      <!-- Right Panel details (3 Columns) -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- KIŞISEL TAB -->
        <div v-if="activeSubTab === 'kisisel'" class="space-y-6">
          <!-- Top Profile Banner -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" style="border-color: #E2E8F0;">
            <div class="flex items-start gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 border text-slate-700 text-base font-black">
                AT
              </div>
              <div>
                <h2 class="text-lg font-black text-slate-800">{{ profileForm.name }} {{ profileForm.surname }}</h2>
                <span class="inline-flex items-center gap-1 mt-1 rounded bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 text-[8px] font-black uppercase">
                  Doğrulanmamış
                </span>
                <p class="text-[10px] text-slate-400 mt-2 font-mono">{{ profileForm.email }}</p>
              </div>
            </div>

            <div class="rounded-xl border bg-slate-50 p-4 space-y-2 text-center md:text-right max-w-xs" style="border-color: #F1F5F9;">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">GÜVENLİK DÜZEYİ DURUMU</span>
              <span class="text-xs font-bold text-slate-700 block">Doğrulanmamış</span>
              <NuxtLink 
                to="/firma-dogrulama"
                class="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 shadow transition"
              >
                Doğrulamayı Tamamla
              </NuxtLink>
            </div>
          </div>

          <!-- Quick badges -->
          <div class="grid grid-cols-3 gap-4">
            <div class="rounded-xl border bg-white p-3 text-center" style="border-color: #E2E8F0;">
              <span class="text-[7px] font-black text-slate-300 uppercase block">PROFİL DURUMU</span>
              <span class="text-[10px] font-bold text-slate-700 block mt-1">Geliştirmeye açık</span>
            </div>
            <div class="rounded-xl border bg-white p-3 text-center" style="border-color: #E2E8F0;">
              <span class="text-[7px] font-black text-slate-300 uppercase block">DOĞRULAMA DURUMU</span>
              <span class="text-[10px] font-bold text-slate-700 block mt-1">Doğrulanmamış</span>
            </div>
            <div class="rounded-xl border bg-white p-3 text-center" style="border-color: #E2E8F0;">
              <span class="text-[7px] font-black text-slate-300 uppercase block">ŞİRKET</span>
              <span class="text-[10px] font-bold text-slate-700 block mt-1 truncate">Ali Turan</span>
            </div>
          </div>

          <!-- Strength Score -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-6" style="border-color: #E2E8F0;">
            <div class="md:col-span-2 flex flex-col items-center justify-center text-center gap-3">
              <div class="relative h-24 w-24 flex items-center justify-center">
                <svg class="absolute transform -rotate-90 w-full h-full">
                  <circle cx="48" cy="48" r="40" stroke="#F1F5F9" stroke-width="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#3B82F6" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="150.7" />
                </svg>
                <span class="text-base font-black text-slate-800">%40</span>
              </div>
              <div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PROFİL KALİTE SKORU</span>
                <span class="text-xs font-bold text-slate-700 block mt-0.5">Güven kaydınız</span>
              </div>
            </div>

            <div class="md:col-span-3 space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">SONRAKİ ADIMLAR</span>
              <div class="space-y-2 text-[10px] font-bold">
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Fotoğraf ekleyin</div>
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Tanıtım videosu ekleyin</div>
                <div class="text-emerald-600 flex items-center gap-2"><CheckCircle2 :size="10" /> Sektörler ekleyin</div>
                <div class="text-slate-600 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Şirket açıklamasını tamamlayın</div>
              </div>
            </div>
          </div>

          <!-- Kişisel Bilgiler Form -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><User :size="14" /> Kişisel Bilgiler</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">İsim</label>
                <input v-model="profileForm.name" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Soyisim</label>
                <input v-model="profileForm.surname" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">E-posta</label>
                <input v-model="profileForm.email" type="email" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-400 outline-none" style="border-color: #E2E8F0;" disabled />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Telefon</label>
                <input v-model="profileForm.phone" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
              </div>
            </div>
          </div>

          <!-- Upload section -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"><Camera :size="14" /> Tanıtım Galerisi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <Camera :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Fotoğraf Ekle</span>
                <button type="button" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold" style="border-color: #E2E8F0;">Fotoğraf Yükle</button>
              </div>
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <Video :size="16" class="text-slate-400" />
                <span class="text-xs font-bold text-slate-700">Video Yüklemek İçin Tıklayın</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
            <span class="text-[10px] text-slate-400 font-bold">Tüm değişiklikleri kaydedin</span>
            <button type="button" @click="saveProfile" class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition">Profili Güncelle</button>
          </div>
        </div>

        <!-- ŞİRKET & DOĞRULAMA TAB -->
        <div v-if="activeSubTab === 'sirket'" class="space-y-6">
          
          <!-- Top header with profile link -->
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <div>
              <h2 class="text-lg font-black text-slate-800">Kurumsal Kimlik</h2>
              <p class="text-xs text-slate-400">Bağlı olduğunuz organizasyonun detaylarını ve doğrulama sürecini yönetin.</p>
            </div>
            <button type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
              Profili önizle
            </button>
          </div>

          <!-- Genel Bilgiler Card (Screenshot 2 style) -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Genel Bilgiler</h3>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 border text-slate-700 text-base font-black">
                  AT
                </div>
                <div>
                  <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">KURUM</span>
                  <h3 class="text-lg font-black text-slate-800 mt-0.5">{{ companyForm.name }}</h3>
                  
                  <div class="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-bold">
                    <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[8px]">Admin, İlan, Tedarikçi</span>
                  </div>
                </div>
              </div>

              <!-- Quality level display -->
              <div class="rounded-xl border bg-slate-50 p-4 space-y-2 text-center md:text-right max-w-xs" style="border-color: #F1F5F9;">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">KURUMSAL PROFİL KALİTESİ</span>
                <span class="text-lg font-black text-slate-800 block">%89</span>
              </div>
            </div>

            <!-- Nested detail info boxes -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">VERGİ KİMLİK NO</span>
                <span class="font-mono text-slate-700 block mt-1">{{ companyForm.taxNo }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">ADRES</span>
                <span class="text-slate-700 block mt-1 truncate" :title="companyForm.faturaAdresi">Çanakkale</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">TELEFON</span>
                <span class="font-mono text-slate-700 block mt-1">{{ profileForm.phone }}</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span class="text-[8px] font-black text-slate-400 uppercase block">WEB SİTESİ</span>
                <span class="text-slate-500 block mt-1">Web Sitesi Girilmedi</span>
              </div>
            </div>

            <!-- Profile Quality score card details -->
            <div class="rounded-xl bg-blue-50/20 border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style="border-color: #DBEAFE;">
              <div>
                <h4 class="text-xs font-bold text-slate-800">Kurumsal Profil Kalitesi</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">Profil resmi, Şirket faturası, Kategoriler ve Doğrulama adımlarına göre hesaplanır.</p>
              </div>
              <button type="button" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 transition">
                Görsel Yükle
              </button>
            </div>
          </div>

          <!-- Kayıt & Doğrulama Bilgileri Form Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Kayıt & Doğrulama Bilgileri</h3>
              <div class="flex rounded-lg bg-slate-100 p-0.5">
                <button type="button" class="rounded px-2.5 py-1 text-[10px] font-black bg-white text-slate-800 shadow-sm">Kayıt Bilgisi</button>
                <button type="button" class="rounded px-2.5 py-1 text-[10px] font-black text-slate-500">Fatura & Banka</button>
              </div>
            </div>

            <p class="text-[10px] text-slate-400 leading-normal">
              <strong>Kayıt & Doğrulama Bilgileri.</strong> Kayıt ve firma doğrulama aşamasında alınan ve değiştirilemeyen yasal verileri tutar. Yerel yasalar doğrultusunda bayilik, yetkili arayan kurallar buradaki bilgilere göre denetlenmektedir.
            </p>

            <!-- Editable & Locked Fields Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Şirket Adı -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">ŞİRKET ADI</label>
                <div class="relative">
                  <input v-model="companyForm.name" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                  <Lock :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <!-- Yasal Firma Unvanı -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">YASAL FİRMA UNVANI</label>
                <div class="relative">
                  <input v-model="companyForm.legalName" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                  <Lock :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <!-- İrtibat İsim -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">İRTİBAT İSİM</label>
                <div class="relative">
                  <input v-model="companyForm.contactPerson" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                  <Lock :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <!-- Vergi Numarası -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">VERGİ NUMARASI</label>
                <div class="relative">
                  <input v-model="companyForm.taxNo" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                  <Lock :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <!-- Faaliyet Alanları -->
              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">FAALİYET ALANLARI</label>
                <div class="relative">
                  <input v-model="companyForm.sectors" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                  <Lock :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <!-- MERSİS No -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">MERSİS NO</label>
                <input v-model="companyForm.mersis" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none border-red-500 focus:border-red-600" placeholder="0XXX-XXXX-XXXX-XXXX" />
                <span class="text-[9px] text-red-500 block mt-1">Bu alanın doldurulması zorunludur.</span>
              </div>

              <!-- Ticaret Sicil No -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">TİCARET SİCİL NO</label>
                <input v-model="companyForm.sicilNo" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none border-red-500 focus:border-red-600" placeholder="Ticaret sicil numarası" />
                <span class="text-[9px] text-red-500 block mt-1">Bu alanın doldurulması zorunludur.</span>
              </div>

              <!-- KEP Adresi -->
              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">KEP ADRESİ</label>
                <input v-model="companyForm.kep" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none border-red-500 focus:border-red-600" placeholder="gelanlasalim@hs01.kep.tr" />
                <span class="text-[9px] text-red-500 block mt-1">Bu alanın doldurulması zorunludur.</span>
              </div>

              <!-- IBAN -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">IBAN</label>
                <input v-model="companyForm.iban" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none border-red-500 focus:border-red-600" placeholder="TR00 0000 0000 0000 0000 00" />
                <span class="text-[9px] text-red-500 block mt-1">Bu alanın doldurulması zorunludur.</span>
              </div>

              <!-- Hesap Sahibi -->
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">HESAP SAHİBİ</label>
                <input v-model="companyForm.accountHolder" type="text" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none border-red-500 focus:border-red-600" placeholder="Hesap sahibinin tam adı" />
                <span class="text-[9px] text-red-500 block mt-1">Bu alanın doldurulması zorunludur.</span>
              </div>

            </div>
          </div>

          <!-- Kapak Görseli Upload Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Kapak Görseli</h3>
            </div>
            <div class="rounded-xl border-2 border-dashed p-8 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
              <Camera :size="20" class="text-slate-400" />
              <div>
                <h4 class="text-xs font-bold text-slate-700">Kapak Görseli Yükle</h4>
                <p class="text-[9px] text-slate-400 leading-normal mt-0.5">Firma profil sayfanızın üst kısmında görünecek olan görsel (Önerilen boyut: 1200x300, JPEG veya PNG, Maks. 5 MB)</p>
              </div>
            </div>
          </div>

          <!-- 2FA Settings -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Güvenlik</h3>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/20 border" style="border-color: #FDE68A;">
              <div>
                <h4 class="text-xs font-bold text-slate-800">E-posta ile 2FA</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">Giriş güvenliğini artırmak için e-posta ile iki aşamalı doğrulamayı aktif edin.</p>
              </div>
              <button 
                type="button" 
                @click="companyForm.is2FaEnabled = !companyForm.is2FaEnabled"
                class="rounded-lg font-bold text-xs px-4 py-2 transition"
                :class="companyForm.is2FaEnabled ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'"
              >
                {{ companyForm.is2FaEnabled ? '2FA Aktif' : '2FA Etkinleştir' }}
              </button>
            </div>
          </div>

          <!-- Doğrulama ve Belgeler list -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Doğrulama ve Belgeler</h3>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Doğrulanmamış</span>
            </div>

            <!-- Steps list grid status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>E-posta</span>
                <span class="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Kayıtlı</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Telefon</span>
                <span class="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Doğrulanmamış</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Kimlik</span>
                <span class="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Bekliyor</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <span>Şirket Belgeleri</span>
                <span class="text-[9px] text-red-500 bg-red-50 px-2 py-0.5 rounded">Eksik</span>
              </div>
            </div>

            <!-- Yetkileriniz list tags -->
            <div class="space-y-2">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">YETKİLERİNİZ</span>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="roleTag in [
                    'Kullanıcı Yönetimi', 'Banka Hesapları', 'Fatura Görüntüleme', 
                    'İhale Oluşturma', 'Teklif Değerlendirme', 'Sözleşme Yönetimi', 
                    'Teklif Verme', 'Teklif Görüntüleme', 'Sözleşme Takibi'
                  ]" 
                  :key="roleTag"
                  class="text-[9px] font-bold text-slate-600 bg-slate-100 rounded px-2.5 py-1"
                >
                  {{ roleTag }}
                </span>
              </div>
            </div>

            <!-- Upload files list -->
            <div class="space-y-4 pt-4 border-t" style="border-color: #F1F5F9;">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-slate-800">Doğrulama Belgeleri</h4>
                <span class="text-[10px] text-slate-400 font-bold">Zorunlu belgeler: {{ docsCount }}/6</span>
              </div>

              <div class="divide-y divide-slate-100">
                <!-- Doc 1: Vergi Levhası -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Vergi Levhası <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('vergi')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.vergi ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.vergi ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 2: Ticaret Sicil Gazetesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Ticaret Sicil Gazetesi <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('sicil')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.sicil ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.sicil ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 3: İmza Sirküleri -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    İmza Sirküleri <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('imza')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.imza ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.imza ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 4: Faaliyet Belgesi -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Faaliyet Belgesi <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('faaliyet')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.faaliyet ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.faaliyet ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 5: Yetkili Kimlik Belgesi - Ön Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Ön Yüz <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('kimlikOn')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.kimlikOn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.kimlikOn ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>

                <!-- Doc 6: Yetkili Kimlik Belgesi - Arka Yüz -->
                <div class="flex items-center justify-between py-3">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    Yetkili Kimlik Belgesi - Arka Yüz <span class="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-black">ZORUNLU</span>
                  </span>
                  <button 
                    type="button" 
                    @click="uploadDoc('kimlikArka')" 
                    class="rounded-lg border px-4 py-1.5 text-[10px] font-bold transition"
                    :class="uploadedDocs.kimlikArka ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700'"
                    style="border-color: #E2E8F0;"
                  >
                    {{ uploadedDocs.kimlikArka ? 'Yüklendi' : 'Yükle' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Complete Submit -->
            <button 
              type="button" 
              @click="companyVerified = true"
              class="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 transition shadow"
            >
              Şirket Doğrulamasını Başlat
            </button>
          </div>

        </div>

        <!-- KAYITLI ADRESLER TAB -->
        <div v-if="activeSubTab === 'adresler'" class="space-y-6">
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <div>
              <h2 class="text-lg font-black text-slate-800">Kayıtlı Adresler</h2>
              <p class="text-xs text-slate-400">Teslimat adreslerinizi yönetin. İhale oluştururken hızlıca seçebilirsiniz.</p>
            </div>
            <button type="button" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 transition">
              <Plus :size="14" /> Yeni adres
            </button>
          </div>

          <!-- Tabs sub selector -->
          <div class="flex items-center justify-between bg-white border p-1 rounded-xl" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-1.5">
              <button 
                type="button"
                @click="activeAddressType = 'teslimat'"
                class="rounded-lg px-4 py-2 text-xs font-bold transition"
                :class="activeAddressType === 'teslimat' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'"
              >
                Teslimat Adresleri (1)
              </button>
              <button 
                type="button"
                @click="activeAddressType = 'fatura'"
                class="rounded-lg px-4 py-2 text-xs font-bold transition"
                :class="activeAddressType === 'fatura' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'"
              >
                Fatura Adresleri (1)
              </button>
            </div>
          </div>

          <span class="text-[10px] text-slate-400 font-bold block">1 / 20 teslimat adresi kullanılıyor</span>

          <!-- Address card matching screenshot layout -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between border-b pb-2" style="border-color: #F1F5F9;">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><MapPin :size="14" /></div>
                <div>
                  <span class="text-[8px] font-black text-slate-300 uppercase block">TESLİMAT ADRESİ</span>
                  <h4 class="text-xs font-bold text-slate-800">Teslimat Adresi</h4>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black uppercase">VARSYAYILAN</span>
                <button type="button" class="p-1.5 rounded-lg border text-slate-400 hover:text-slate-800" style="border-color: #E2E8F0;"><Edit2 :size="12" /></button>
                <button type="button" class="p-1.5 rounded-lg border text-slate-400 hover:text-red-600" style="border-color: #E2E8F0;"><Trash2 :size="12" /></button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">AÇIK ADRES</span>
                <span class="text-slate-700 font-bold">17100 Çanakkale</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">İL / İLÇE</span>
                <span class="text-slate-700 font-bold">Merkez, Çanakkale</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block mb-1">MAHALLE / POSTA KODU</span>
                <span class="text-slate-700 font-bold">İsmet Paşa Mah. / 17100</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAKIP ETTIKLERIM TAB -->
        <div v-if="activeSubTab === 'takip'" class="space-y-6">
          <div class="flex items-center justify-between border-b pb-3" style="border-color: #F1F5F9;">
            <div>
              <h2 class="text-lg font-black text-slate-800">Takip Ettiklerim</h2>
              <p class="text-xs text-slate-400">Takip ettiğiniz firmaları görüntüleyin, güncellemelerini izleyin ve hızlıca profillerine ulaşın.</p>
            </div>
            <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">Takip edilen firma: 0</span>
          </div>

          <!-- Empty state -->
          <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-4" style="border-color: #E2E8F0;">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Building :size="20" />
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-slate-800">Henüz firma takip etmiyorsunuz</h3>
              <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                İlgilendiğiniz firmaları takip ederek yeni ihalelerden ve güncellemelerden haberdar olabilirsiniz.
              </p>
            </div>
            <NuxtLink to="/panel/firmalar" class="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 shadow transition">
              Kurumsal firmaları keşfet
            </NuxtLink>
          </div>
        </div>

        <!-- GEÇMİŞ TİCARETLERİM TAB -->
        <div v-if="activeSubTab === 'ticaret'" class="space-y-6">
          <div class="border-b pb-3" style="border-color: #F1F5F9;">
            <h2 class="text-lg font-black text-slate-800">Geçmiş Ticaretlerim</h2>
            <p class="text-xs text-slate-400">Platform üzerinde tamamladığınız tüm ihaleler ve sözleşmeler.</p>
          </div>
          <div class="rounded-2xl border bg-white py-16 px-6 text-center space-y-3" style="border-color: #E2E8F0;">
            <History :size="24" class="text-slate-300 mx-auto" />
            <h3 class="text-xs font-bold text-slate-700">Henüz tamamlanmış bir ticaretiniz bulunmamaktadır.</h3>
          </div>
        </div>

        <!-- BİLDİRİMLER TAB -->
        <div v-if="activeSubTab === 'bildirimler'" class="space-y-6">
          <div class="border-b pb-3" style="border-color: #F1F5F9;">
            <h2 class="text-lg font-black text-slate-800">Bildirim Tercihleri</h2>
            <p class="text-xs text-slate-400">Hangi güncellemeleri hangi kanallar üzerinden almak istediğinizi belirtin.</p>
          </div>

          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-xs font-bold text-slate-800">E-posta bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Yeni teklif geldiğinde, ihale sonuçlandığında e-posta gönderilsin.</p>
              </div>
              <button 
                type="button" 
                @click="notifyMail = !notifyMail"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifyMail ? 'background: #1E3A5F;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifyMail ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-xs font-bold text-slate-800">SMS bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Önemli sözleşme ve kargo sevkiyat durumları telefona iletilsin.</p>
              </div>
              <button 
                type="button" 
                @click="notifySms = !notifySms"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifySms ? 'background: #1E3A5F;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifySms ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-slate-800">Tarayıcı anlık bildirimleri</h4>
                <p class="text-[10px] text-slate-400">Yeni mesaj veya canlı etkinlik başladığında tarayıcıda bildirim göster.</p>
              </div>
              <button 
                type="button" 
                @click="notifyBrowser = !notifyBrowser"
                class="relative h-5 w-9 rounded-full transition-all"
                :style="notifyBrowser ? 'background: #1E3A5F;' : 'background: #CBD5E1;'"
              >
                <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :style="notifyBrowser ? 'left: 1.25rem;' : 'left: 0.125rem;'"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- ÜYELİK TAB -->
        <div v-if="activeSubTab === 'uyelik'" class="space-y-6">
          <div class="border-b pb-3" style="border-color: #F1F5F9;">
            <h2 class="text-lg font-black text-slate-800">Üyelik Durumu</h2>
            <p class="text-xs text-slate-400">Platform üzerindeki aboneliğiniz ve üyelik paketi detaylarınız.</p>
          </div>
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">MEVCUT PAKET</span>
                <span class="text-sm font-bold text-slate-800 block mt-1">Profesyonel Üyelik</span>
              </div>
              <span class="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">Aktif</span>
            </div>
            <p class="text-[10px] text-slate-400">Bir sonraki faturalama tarihi: 17 Ağustos 2026. [Aboneliği Yönet]</p>
          </div>
        </div>

        <!-- AYARLAR (SETTINGS) TAB - FULLY EXPANDED EXACTLY MATCHING SCREENSHOTS -->
        <div v-if="activeSubTab === 'ayarlar'" class="space-y-6">
          
          <!-- Top Info metrics grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">GÜVENLİK</span>
                <span class="text-[11px] font-black text-emerald-600 block mt-1">🟢 1 aktif koruma</span>
              </div>
              <Shield :size="16" class="text-emerald-500" />
            </div>

            <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">DİL</span>
                <span class="text-[11px] font-black text-blue-600 block mt-1">🇹🇷 Türkçe</span>
              </div>
              <Globe :size="16" class="text-blue-500" />
            </div>

            <div class="rounded-xl border bg-white p-4 flex items-center justify-between" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">SAAT</span>
                <span class="text-[11px] font-black text-blue-600 block mt-1">⏱️ Operasyonel</span>
              </div>
              <Clock :size="16" class="text-blue-500" />
            </div>
          </div>

          <!-- Anchor sub-menus links -->
          <div class="flex items-center gap-1.5 bg-slate-50 border p-1 rounded-xl text-[10px] font-bold text-slate-500" style="border-color: #E2E8F0;">
            <span class="bg-white text-slate-800 shadow px-3 py-1.5 rounded-lg cursor-pointer">Uygulama tercihleri</span>
            <span class="hover:bg-white hover:text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">Güvenlik</span>
            <span class="hover:bg-white hover:text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">Bildirimler</span>
            <span class="hover:bg-white hover:text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">Profil kaynağı</span>
          </div>

          <!-- Hesap ve Kurumsal Bilgiler Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">HESAP VE KURUMSAL BİLGİLER</h3>
            <p class="text-[10px] text-slate-400 leading-normal">
              Kimlik ve kurumsal bilgiler: Önemli ve Kurumsal Kimlik sayfalarından yönetilir.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border">
                <span class="text-[8px] font-black text-slate-300 block">AD SOYAD</span>
                <span class="text-slate-700 font-bold block mt-1">Ali Turan</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border">
                <span class="text-[8px] font-black text-slate-300 block">E-POSTA ADRESİ</span>
                <span class="font-mono text-slate-700 block mt-1">alituran88@gmail.com</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border">
                <span class="text-[8px] font-black text-slate-300 block">UNVAN</span>
                <span class="text-slate-700 font-bold block mt-1">Yönetici</span>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border">
                <span class="text-[8px] font-black text-slate-300 block">İLETİŞİM DURUMU</span>
                <span class="text-emerald-600 font-bold block mt-1">🟢 Tanımlı</span>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="activeSubTab = 'kisisel'" type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
                Profil sayfasına git
              </button>
              <button @click="activeSubTab = 'sirket'" type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
                Kurumsal kimliğe git
              </button>
            </div>
          </div>

          <!-- Güvenlik Şifre Yönetimi Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">GÜVENLİK · Şifre ve Cihaz Kontrolü</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Form left -->
              <div class="lg:col-span-2 space-y-4">
                <h4 class="text-xs font-bold text-slate-800">Şifre Yönetimi</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Mevcut Şifre</label>
                    <input type="password" placeholder="••••••••" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-white" style="border-color: #E2E8F0;" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Yeni Şifre</label>
                    <input type="password" placeholder="••••••••" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-white" style="border-color: #E2E8F0;" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Yeni Şifre Tekrar</label>
                    <input type="password" placeholder="••••••••" class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-white" style="border-color: #E2E8F0;" />
                  </div>
                </div>
                <button type="button" class="rounded-xl bg-slate-100 text-slate-400 font-bold text-xs px-6 py-3 cursor-not-allowed" disabled>Şifreyi Güncelle</button>
              </div>

              <!-- Rules right -->
              <div class="p-4 rounded-xl bg-slate-50 border space-y-2 text-[9px] font-bold text-slate-500" style="border-color: #F1F5F9;">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">ŞİFRE GÜCÜ</span>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> En az 10 karakter</div>
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> Büyük/küçük harf</div>
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> Rakam</div>
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> Özel karakter</div>
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> Yaygın parola/tekrar eden örüntü olmaması</div>
                  <div class="flex items-center gap-1.5"><Check :size="10" class="text-emerald-500" /> Boşluk içermemesi</div>
                </div>
              </div>
            </div>

            <!-- Active Sessions list -->
            <div class="space-y-3 pt-4 border-t" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Aktif Oturumlar</h4>
              <div class="rounded-xl border p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style="border-color: #E2E8F0;">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Laptop :size="15" /></div>
                  <div>
                    <h5 class="text-xs font-bold text-slate-800">Windows · Chrome <span class="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black">BU CİHAZ</span></h5>
                    <p class="text-[9px] text-slate-400 mt-0.5">Son aktif: 17 Temmuz 2026 23:55 · IP: 85.105.**.**</p>
                  </div>
                </div>
                <button type="button" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100" style="border-color: #E2E8F0;">Oturumu Kapat</button>
              </div>
            </div>

            <!-- Security History Logs -->
            <div class="space-y-3 pt-4 border-t" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Güvenlik Geçmişi</h4>
              <div class="rounded-xl border bg-slate-50 p-4 text-[10px] text-slate-400 text-center" style="border-color: #E2E8F0;">
                Kritik olaylar (son 2FA kapatma, toplu çıkış, şifre değişimi) güvenlik loguna eklenmektedir.
              </div>
            </div>
          </div>

          <!-- Tercihler Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">TERCİHLER · Dil ve Bölge Ayarları</h3>
            
            <!-- Theme grids -->
            <div class="space-y-3">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Görünüm Teması</span>
              <div class="grid grid-cols-3 gap-4">
                <button 
                  type="button" 
                  @click="activeTheme = 'sistem'"
                  class="rounded-xl border p-4 text-center space-y-2 transition"
                  :class="activeTheme === 'sistem' ? 'border-blue-600 bg-blue-50/10 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50'"
                >
                  <Laptop :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Sistem</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'acik'"
                  class="rounded-xl border p-4 text-center space-y-2 transition"
                  :class="activeTheme === 'acik' ? 'border-blue-600 bg-blue-50/10 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50'"
                >
                  <Camera :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Açık</span>
                </button>

                <button 
                  type="button" 
                  @click="activeTheme = 'koyu'"
                  class="rounded-xl border p-4 text-center space-y-2 transition"
                  :class="activeTheme === 'koyu' ? 'border-blue-600 bg-blue-50/10 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50'"
                >
                  <Video :size="16" class="mx-auto" />
                  <span class="text-xs font-bold block">Koyu</span>
                </button>
              </div>
            </div>

            <!-- Form dropdowns -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Dil</label>
                <select v-model="selectedLanguage" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="Türkçe">🇹🇷 Türkçe</option>
                  <option value="English">🇺🇸 English</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Formatı</label>
                <select v-model="timeFormat" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="24 saat">24 saat</option>
                  <option value="12 saat">12 saat</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Saat Dilimi</label>
                <select v-model="timezone" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                  <option value="Europe/Istanbul (GMT+3)">Europe/Istanbul (GMT+3)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2 justify-end pt-2">
              <button type="button" class="rounded-lg border px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">Varsayılanlara Sıfırla</button>
              <button type="button" @click="saveProfile" class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 transition shadow">Tercihleri kaydet</button>
            </div>
          </div>

          <!-- Sözleşmeler & Onaylar Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-6" style="border-color: #E2E8F0;">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">SÖZLEŞMELER & ONAYLAR</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="agreement in [
                  'Platform Abonelik ve Kullanım Sözleşmesi',
                  'Ticari Elektronik İleti ve İletişim Açık Rıza Beyanı',
                  'Ticari İletişim ve Pazarlama Açık Rızası',
                  'Dijital Varlıklar ve Görsel Verilerin İşlenmesi Açık Rızası',
                  'Kişisel Verilerin Yurt Dışı Aktarımı Açık Rızası',
                  'Diğer Verilerin İşlenmesi Açık Rızası',
                  'Profil Kalite Skoru ve İstatistiksel Analiz Açık Rızası',
                  'ACISCO B2B ELEKTRONİK TİCARET PLATFORMU ANA SÖZLEŞMESİ'
                ]"
                :key="agreement"
                class="rounded-xl border p-4 bg-slate-50/50 flex flex-col justify-between h-28"
                style="border-color: #E2E8F0;"
              >
                <span class="text-[10px] font-bold text-slate-700 leading-normal block">{{ agreement }}</span>
                <div class="flex items-center justify-between text-[10px] font-bold mt-2">
                  <span class="text-emerald-600 flex items-center gap-1"><CheckCircle2 :size="10" /> Onaylandı</span>
                  <button class="text-blue-600 hover:underline">Sözleşmeyi Oku</button>
                </div>
              </div>
            </div>

            <!-- KVKK Request form -->
            <div class="space-y-4 pt-4 border-t" style="border-color: #F1F5F9;">
              <h4 class="text-xs font-bold text-slate-800">Veri Talebi Oluştur (KVKK)</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Talep Türü</label>
                  <select v-model="kvkkRequestType" class="w-full rounded-xl border px-3 py-2.5 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                    <option value="Veri Erişim Talebi">Veri Erişim Talebi</option>
                    <option value="Veri Silme Talebi">Veri Silme Talebi</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Açıklama</label>
                  <textarea 
                    v-model="kvkkDescription"
                    rows="3" 
                    placeholder="Talebinizi detaylı açıklamasıyla yazın..."
                    class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-white focus:border-blue-500 transition"
                    style="border-color: #E2E8F0;"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  @click="submitKvkk"
                  class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 transition shadow"
                >
                  Talep Gönder
                </button>
              </div>

              <div v-if="kvkkSuccess" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl mt-3 flex items-center gap-1.5">
                <CheckCircle2 :size="14" /> Talebiniz başarıyla alınmıştır. En kısa sürede işleme konulacaktır.
              </div>
            </div>
          </div>

          <!-- Veri ve Hesap Kapatma Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6" style="border-color: #E2E8F0;">
            <div class="p-5 rounded-xl bg-slate-50 border flex flex-col justify-between h-36" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">VERİ VE RAPORLAR</span>
                <h4 class="text-xs font-bold text-slate-800 mt-1">Veri dışa aktarma henüz hazır değil</h4>
                <p class="text-[10px] text-slate-400 mt-1 leading-normal">Geçmiş verilerinizi ve raporlarınızı indirmek için kurumsal temsilcinizle görüşün.</p>
              </div>
            </div>

            <div class="p-5 rounded-xl bg-slate-50 border flex flex-col justify-between h-36" style="border-color: #E2E8F0;">
              <div>
                <span class="text-[8px] font-black text-slate-300 uppercase block">HESAP İŞLEMLERİ</span>
                <h4 class="text-xs font-bold text-slate-800 mt-1">Hesap kapatma talebi manuel inceleme ile alınır</h4>
                <p class="text-[10px] text-slate-400 mt-1 leading-normal">Hesap kapatma talebiniz incelendikten sonra verileriniz silinir.</p>
              </div>
              <div class="flex gap-2">
                <button type="button" class="rounded-lg border px-3 py-1.5 text-[10px] font-bold bg-white text-slate-700 hover:bg-slate-100" style="border-color: #E2E8F0;">Oturumu Sonlandır</button>
                <button type="button" class="rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-[10px] px-3 py-1.5 transition">Hesabı Kapat</button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>
