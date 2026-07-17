<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  User, 
  Building2, 
  MapPin, 
  Bell, 
  CreditCard, 
  History, 
  Award, 
  Sliders, 
  Camera, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Save 
} from 'lucide-vue-next'

definePageMeta({ 
  layout: 'dashboard' 
})

const activeSubTab = ref<'kisisel' | 'sirket' | 'adresler' | 'bildirimler' | 'odemeler' | 'gecmis' | 'uyelik' | 'ayarlar'>('kisisel')

const profileForm = ref({
  name: 'Ali',
  surname: 'Turan',
  email: 'alituran88@gmail.com',
  phone: '5437340860',
  title: 'Yönetici'
})

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
    
    <!-- Top Header -->
    <div>
      <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Hesap Merkezi</span>
      <h1 class="text-2xl font-black text-slate-800 mt-1" style="color: #0F172A;">Hesap Merkezi</h1>
      <p class="text-xs text-slate-500 mt-1">Kişisel bilgilerinizi, medya varlıklarınızı ve iletişim tercihlerinizi tek yerden yönetin.</p>
    </div>

    <!-- Main Layout with Sub-Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <!-- Left Submenu (1 Column) -->
      <div class="space-y-1">
        <button 
          v-for="sub in [
            { id: 'kisisel', label: 'Kişisel', icon: User },
            { id: 'sirket', label: 'Şirket & Doğrulama', icon: Building2 },
            { id: 'adresler', label: 'Kayıtlı Adresler', icon: MapPin },
            { id: 'bildirimler', label: 'Bildirimler', icon: Bell },
            { id: 'odemeler', label: 'Kolay Ödemeler', icon: CreditCard },
            { id: 'gecmis', label: 'Geçmiş Ödemelerim', icon: History },
            { id: 'uyelik', label: 'Üyelik', icon: Award },
            { id: 'ayarlar', label: 'Ayarlar', icon: Sliders }
          ]"
          :key="sub.id"
          type="button"
          @click="activeSubTab = sub.id as any"
          class="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-bold transition text-left"
          :class="activeSubTab === sub.id 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-slate-500 hover:bg-slate-50'"
        >
          <component :is="sub.icon" :size="14" />
          {{ sub.label }}
        </button>
      </div>

      <!-- Right Content Area (3 Columns) -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- Kişisel Tab Content -->
        <div v-if="activeSubTab === 'kisisel'" class="space-y-6">
          
          <!-- Top Banner Card -->
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
                <span class="inline-flex items-center gap-1 mt-1 ml-2 rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[8px] font-black uppercase">
                  Müşteri Temsilcisi
                </span>
                <p class="text-[10px] text-slate-400 mt-2 font-mono">{{ profileForm.email }}</p>
              </div>
            </div>

            <!-- Complete Verification box -->
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

          <!-- Quick badges row -->
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

          <!-- Profil Kalite Skoru Card -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-6" style="border-color: #E2E8F0;">
            
            <!-- Circle progress indicator left -->
            <div class="md:col-span-2 flex flex-col items-center justify-center text-center gap-3">
              <div class="relative h-24 w-24 flex items-center justify-center">
                <!-- SVG Circle representation -->
                <svg class="absolute transform -rotate-90 w-full h-full">
                  <circle cx="48" cy="48" r="40" stroke="#F1F5F9" stroke-width="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#3B82F6" stroke-width="8" fill="transparent" stroke-dasharray="251.2" stroke-dashoffset="150.7" />
                </svg>
                <span class="text-base font-black text-slate-800">%40</span>
              </div>
              <div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PROFİL KALİTE SKORU</span>
                <span class="text-xs font-bold text-slate-700 block mt-0.5">Güven kaydınız</span>
                <p class="text-[10px] text-slate-400 mt-1 leading-normal max-w-[180px]">Bu skor şirketinizin doğrulanabilirliğini ve piyasadaki itibarını arttırır.</p>
              </div>
            </div>

            <!-- Steps list right -->
            <div class="md:col-span-3 space-y-3">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">SONRAKİ ADIMLAR</span>
              
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0"></span>
                  Fotoğraf ekleyin
                </div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0"></span>
                  Tanıtım videosu ekleyin
                </div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 :size="10" />
                  Sektörler ekleyin
                </div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0"></span>
                  Şirket açıklamasını tamamlayın
                </div>
              </div>
            </div>

          </div>

          <!-- Kişisel Bilgiler Form -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2 border-b pb-2" style="border-color: #F1F5F9;">
              <User :size="15" class="text-blue-600" />
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">Kişisel Bilgiler</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">İsim</label>
                <input 
                  v-model="profileForm.name"
                  type="text"
                  class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                  style="border-color: #E2E8F0; color: #0F172A;"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Soyisim</label>
                <input 
                  v-model="profileForm.surname"
                  type="text"
                  class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                  style="border-color: #E2E8F0; color: #0F172A;"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">E-posta</label>
                <input 
                  v-model="profileForm.email"
                  type="email"
                  class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                  style="border-color: #E2E8F0;"
                  disabled
                />
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Telefon</label>
                <input 
                  v-model="profileForm.phone"
                  type="text"
                  class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition font-mono"
                  style="border-color: #E2E8F0; color: #0F172A;"
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Unvan</label>
              <input 
                v-model="profileForm.title"
                type="text"
                class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                style="border-color: #E2E8F0; color: #0F172A;"
              />
            </div>
          </div>

          <!-- Tanıtım Galerisi Upload Section -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2 border-b pb-2" style="border-color: #F1F5F9;">
              <Camera :size="15" class="text-blue-600" />
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">Tanıtım Galerisi</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Photo Upload Box -->
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <div class="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Camera :size="16" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-700">Fotoğraf Ekle</h4>
                  <p class="text-[9px] text-slate-400 leading-normal mt-0.5">Yasal ve firmanızı temsil eden görseller yükleyin (maks. 10 adet)</p>
                </div>
                <button type="button" class="rounded-lg border px-4 py-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50" style="border-color: #E2E8F0;">
                  Fotoğraf Yükle
                </button>
              </div>

              <!-- Video Upload Box -->
              <div class="rounded-xl border-2 border-dashed p-6 text-center space-y-3 flex flex-col items-center justify-center" style="border-color: #E2E8F0;">
                <div class="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Video :size="16" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-700">Video Yüklemek İçin Tıklayın</h4>
                  <p class="text-[9px] text-slate-400 leading-normal mt-0.5">Maks. 50MB büyüklüğünde tanıtıcı veya imalat süreçlerinizi gösteren video.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dijital Varlıklar Link Section -->
          <div class="rounded-2xl border bg-white p-6 shadow-sm space-y-4" style="border-color: #E2E8F0;">
            <div class="flex items-center gap-2 border-b pb-2" style="border-color: #F1F5F9;">
              <Sliders :size="15" class="text-blue-600" />
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">Dijital Varlıklar</h3>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Linkedin</label>
                <div class="flex">
                  <span class="inline-flex items-center rounded-l-xl border-y border-l bg-slate-50 px-3 text-xs text-slate-400" style="border-color: #E2E8F0;">
                    linkedin.com/in/
                  </span>
                  <input 
                    type="text"
                    placeholder="kullanici-adi"
                    class="w-full rounded-r-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                    style="border-color: #E2E8F0; color: #0F172A;"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Web sitesi</label>
                <input 
                  type="text"
                  placeholder="https://company.com"
                  class="w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
                  style="border-color: #E2E8F0; color: #0F172A;"
                />
              </div>
            </div>
          </div>

          <!-- Footer Save Card -->
          <div class="rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between" style="border-color: #E2E8F0;">
            <span class="text-[10px] text-slate-400 font-bold">Tüm değişiklikleri kaydedin</span>
            <button 
              type="button" 
              @click="saveProfile"
              class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 shadow transition"
            >
              <Save :size="14" />
              Profili Güncelle
            </button>
          </div>

          <!-- Toast Alert Success -->
          <div v-if="isSaved" class="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-xs font-bold animate-bounce">
            <CheckCircle2 :size="16" />
            Profil bilgileriniz başarıyla güncellendi!
          </div>

        </div>

        <!-- Placeholder for other tabs -->
        <div v-else class="rounded-2xl border bg-white p-12 text-center space-y-4" style="border-color: #E2E8F0;">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border text-slate-400">
            <AlertCircle :size="20" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-700">Bu sekme şu anda aktif değil</h3>
            <p class="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
              Ayarların bu alt menüsü kişiselleştirilmiş ayarlar kısmında yer almaktadır.
            </p>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
