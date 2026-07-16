<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Lock, 
  User, 
  Home, 
  Activity, 
  CreditCard, 
  ListPlus,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

// Page config
definePageMeta({
  layout: false // Custom full screen admin dashboard
})

const router = useRouter()
const { cmsData, saveCmsData, resetCmsData } = useCmsData()

// Auth State
const isLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const authError = ref('')

// Tabs
const activeTab = ref<'hero' | 'tender' | 'plans' | 'features'>('hero')

// Local copy for editing
const formState = reactive(JSON.parse(JSON.stringify(cmsData.value)))

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'info'>('success')

onMounted(() => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (token === 'gelanlasalim_authorized_session') {
      isLoggedIn.value = true
    }
  }
})

function handleLogin() {
  if (email.value === 'admin_test@gelanlasalim.com' && password.value === 'demo-password') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', 'gelanlasalim_authorized_session')
    }
    isLoggedIn.value = true
    authError.value = ''
    triggerToast('Yönetim paneline başarıyla giriş yapıldı!', 'success')
  } else {
    authError.value = 'Hatalı e-posta adresi veya şifre girdiniz.'
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
  isLoggedIn.value = false
  triggerToast('Oturum sonlandırıldı.', 'info')
}

function triggerToast(msg: string, type: 'success' | 'info' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function handleSave() {
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  triggerToast('Tüm değişiklikler başarıyla kaydedildi ve yayına alındı!', 'success')
}

function handleReset() {
  if (confirm('Tüm içerikleri fabrika varsayılan ayarlarına döndürmek istediğinize emin misiniz?')) {
    resetCmsData()
    // Sync local state
    Object.assign(formState, JSON.parse(JSON.stringify(cmsData.value)))
    triggerToast('İçerikler varsayılan ayarlara sıfırlandı.', 'info')
  }
}

// Dynamic Helpers
function addBadge() {
  formState.hero.badgeStrip.push('YENİ ÖZELLİK VURGUSU')
}

function removeBadge(index: number) {
  formState.hero.badgeStrip.splice(index, 1)
}

function addCompetitor() {
  formState.liveTender.competitors.push({
    name: 'Tedarikçi #' + Math.floor(100 + Math.random() * 900),
    price: 410000,
    leader: false
  })
}

function removeCompetitor(index: number) {
  formState.liveTender.competitors.splice(index, 1)
}

function setLeader(index: number) {
  formState.liveTender.competitors.forEach((c: any, i: number) => {
    c.leader = i === index
  })
  // Auto update best bid
  if (formState.liveTender.competitors[index]) {
    formState.liveTender.bestBid = formState.liveTender.competitors[index].price
  }
}

function addFeature(colIdx: number) {
  formState.pricing.features[colIdx].push('Yeni e-ihale özelliği maddesi')
}

function removeFeature(colIdx: number, featIdx: number) {
  formState.pricing.features[colIdx].splice(featIdx, 1)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    
    <!-- Login Overlay -->
    <div v-if="!isLoggedIn" class="flex-grow flex items-center justify-center p-6 relative overflow-hidden" style="background-image: radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent), radial-gradient(circle at bottom left, rgba(13,148,136,0.08), transparent);">
      <div class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
        
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="flex items-center gap-2 border border-slate-700 rounded-xl px-3 py-1.5 bg-slate-800/40">
            <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#1E3A5F"/>
              <path d="M17 9C16.1 7.6 14.4 6.7 12.5 6.7C9.5 6.7 7 9.2 7 12.2C7 15.2 9.5 17.7 12.5 17.7C15.5 17.7 17.8 15.2 17.8 12.2H12.5" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="17.8" cy="12.2" r="1.5" fill="#FFFFFF"/>
            </svg>
            <span class="text-base font-bold text-white">Gel<span style="color: #F59E0B;">Anlaşalım</span></span>
          </div>
          <h2 class="mt-4 text-lg font-black tracking-tight text-white">CMS İçerik Kontrol Paneli</h2>
          <p class="text-xs text-slate-400 mt-1">Platform genelindeki başlıkları, fiyatları ve ihaleleri yönetin.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">E-POSTA ADRESİ</label>
            <div class="relative">
              <User :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="email" 
                type="email" 
                placeholder="admin_test@gelanlasalim.com" 
                class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-11 text-xs text-white focus:border-blue-500 focus:outline-none" 
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">ŞİFRE</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-11 text-xs text-white focus:border-blue-500 focus:outline-none" 
                required
              />
            </div>
          </div>

          <div v-if="authError" class="text-red-500 text-xs font-bold py-1">
            ⚠️ {{ authError }}
          </div>

          <button type="submit" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/10">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>

    <!-- Authorized CMS Workspace -->
    <div v-else class="flex-grow flex flex-col md:flex-row">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between">
        <div>
          <!-- Title & Brand -->
          <div class="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#1E3A5F"/>
                <path d="M17 9C16.1 7.6 14.4 6.7 12.5 6.7C9.5 6.7 7 9.2 7 12.2C7 15.2 9.5 17.7 12.5 17.7C15.5 17.7 17.8 15.2 17.8 12.2H12.5" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="17.8" cy="12.2" r="1.5" fill="#FFFFFF"/>
              </svg>
              <span class="text-sm font-bold text-white">Gel<span style="color: #F59E0B;">Anlaşalım</span> <span class="text-[8px] bg-blue-600/30 text-blue-400 px-1 py-0.5 rounded ml-1 font-mono">CMS</span></span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="p-4 space-y-1">
            <button 
              @click="activeTab = 'hero'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition text-left"
              :class="activeTab === 'hero' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Home :size="16" />
              Ana Sayfa (Hero & Bant)
            </button>

            <button 
              @click="activeTab = 'tender'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition text-left"
              :class="activeTab === 'tender' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <Activity :size="16" />
              Canlı İhale Kartı
            </button>

            <button 
              @click="activeTab = 'plans'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition text-left"
              :class="activeTab === 'plans' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <CreditCard :size="16" />
              Abonelik Planları
            </button>

            <button 
              @click="activeTab = 'features'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition text-left"
              :class="activeTab === 'features' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            >
              <ListPlus :size="16" />
              Özellikler Listesi
            </button>
          </nav>
        </div>

        <!-- Footer Actions inside Sidebar -->
        <div class="p-4 border-t border-slate-800 space-y-2">
          <NuxtLink to="/" class="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition">
            <ArrowLeft :size="14" />
            Siteye Dön
          </NuxtLink>
          <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 rounded-xl bg-red-900/30 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-900/50 transition">
            Oturumu Kapat
          </button>
        </div>
      </aside>

      <!-- Main Panel Body -->
      <main class="flex-grow p-6 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full text-left">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
          <div>
            <h1 class="text-xl font-black text-white uppercase tracking-tight">
              {{ activeTab === 'hero' ? 'Ana Sayfa Giriş & Tanıtım Ayarları' : activeTab === 'tender' ? 'Temsili Canlı İhale Kartı Verileri' : activeTab === 'plans' ? 'Abonelik & Fiyat Planları' : 'Detaylı Özellik Listesi' }}
            </h1>
            <p class="text-xs text-slate-400 mt-1">Gerekli düzenlemeleri yaptıktan sonra sağ alttaki "Kaydet" butonu ile yayına alabilirsiniz.</p>
          </div>
          
          <div class="flex items-center gap-2">
            <button @click="handleReset" class="flex items-center gap-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white transition">
              <RotateCcw :size="14" />
              Sıfırla
            </button>
          </div>
        </div>

        <!-- Forms -->
        <div class="flex-grow space-y-6">

          <!-- Tab 1: Hero & Taglines -->
          <div v-if="activeTab === 'hero'" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">ÜST SLOGAN (TAGLINE)</label>
              <input v-model="formState.hero.tagline" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK SATIR 1</label>
                <input v-model="formState.hero.titleLine1" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK SATIR 2</label>
                <input v-model="formState.hero.titleLine2" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK VURGU (İTALİK)</label>
                <input v-model="formState.hero.titleItalic" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">TANITIM METNİ (AÇIKLAMA)</label>
              <textarea v-model="formState.hero.description" rows="4" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"></textarea>
            </div>

            <!-- Badge list strip manager -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-slate-400">HER SAYFA ALTINDAKİ BANT MADDELERİ</label>
                <button @click="addBadge" class="flex items-center gap-1 rounded bg-blue-600/20 hover:bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:text-white transition">
                  <Plus :size="12" /> Ekle
                </button>
              </div>

              <div class="space-y-2">
                <div v-for="(badge, index) in formState.hero.badgeStrip" :key="index" class="flex gap-2">
                  <input v-model="formState.hero.badgeStrip[index]" type="text" class="flex-grow rounded-xl border border-slate-800 bg-slate-900/50 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" />
                  <button @click="removeBadge(index)" class="p-2.5 bg-red-950/20 hover:bg-red-950 text-red-400 rounded-xl transition">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Live Tender Box -->
          <div v-if="activeTab === 'tender'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">İHALE BAŞLIĞI</label>
                <input v-model="formState.liveTender.title" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">KALAN SÜRE</label>
                <input v-model="formState.liveTender.remainingTime" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">GÜNCEL EN İYİ TEKLİF (₺)</label>
                <input v-model.number="formState.liveTender.bestBid" type="number" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">AÇILIŞ FİYATI (₺)</label>
                <input v-model.number="formState.liveTender.openingPrice" type="number" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">TASARRUF VURGUSU ETİKETİ</label>
                <input v-model="formState.liveTender.savingsText" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <!-- Competitors List manager -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-slate-400">YARIŞAN TEDARİKÇİLER & FIYATLARI</label>
                <button @click="addCompetitor" class="flex items-center gap-1 rounded bg-blue-600/20 hover:bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:text-white transition">
                  <Plus :size="12" /> Tedarikçi Ekle
                </button>
              </div>

              <div class="space-y-3">
                <div v-for="(comp, index) in formState.liveTender.competitors" :key="index" class="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/30">
                  <div class="flex-grow grid grid-cols-2 gap-2">
                    <input v-model="comp.name" type="text" placeholder="Firma Adı" class="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" />
                    <input v-model.number="comp.price" type="number" placeholder="Teklif Fiyatı (₺)" class="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                  
                  <!-- Set Leader toggle -->
                  <button 
                    @click="setLeader(index)"
                    type="button"
                    class="px-3 py-2 text-[10px] font-bold rounded-lg border transition"
                    :class="comp.leader ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 text-slate-500 hover:text-white'"
                  >
                    Önde
                  </button>

                  <button @click="removeCompetitor(index)" class="p-2.5 bg-red-950/20 hover:bg-red-950 text-red-400 rounded-lg transition">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Subscription plans -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">KDV BİLGİSİ BANT YAZISI</label>
                <input v-model="formState.pricing.vatNotice" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">YASAL SORUMLULUK REDDİ (DISCLAIMER)</label>
                <input v-model="formState.pricing.disclaimer" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 mb-3">4 ANA PAKET FİYAT VE SÜRELERİ</label>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="pkg in formState.pricing.packages" :key="pkg.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                  <div class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{{ pkg.id }}</div>
                  
                  <div>
                    <label class="block text-[9px] font-bold text-slate-500 mb-1">PAKET BAŞLIĞI</label>
                    <input v-model="pkg.name" type="text" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:outline-none" />
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[9px] font-bold text-slate-500 mb-1">FİYAT (₺)</label>
                      <input v-model.number="pkg.price" type="number" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label class="block text-[9px] font-bold text-slate-500 mb-1">SÜRE (AY)</label>
                      <input v-model.number="pkg.months" type="number" class="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 4: Features grid -->
          <div v-if="activeTab === 'features'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Column manager for each of the 3 columns -->
              <div v-for="(col, colIdx) in formState.pricing.features" :key="colIdx" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Sütun {{ colIdx + 1 }} Maddeleri</span>
                  <button @click="addFeature(colIdx)" class="p-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition">
                    <Plus :size="12" />
                  </button>
                </div>

                <div class="space-y-2">
                  <div v-for="(feat, featIdx) in col" :key="featIdx" class="flex gap-2">
                    <input 
                      v-model="formState.pricing.features[colIdx][featIdx]" 
                      type="text" 
                      class="flex-grow rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:outline-none" 
                    />
                    <button @click="removeFeature(colIdx, featIdx)" class="p-2 bg-red-950/20 hover:bg-red-950 text-red-400 rounded-lg transition shrink-0">
                      <Trash2 :size="12" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Floating save & status action -->
        <div class="mt-8 border-t border-slate-800 pt-6 flex justify-between items-center">
          <div class="text-xs text-slate-400">
            * Değişiklikler anında yerel depolama üzerinden yayına alınacaktır.
          </div>
          <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/10">
            <Save :size="15" />
            Değişiklikleri Kaydet
          </button>
        </div>

      </main>
    </div>

    <!-- Global Toast Notification -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border p-4 shadow-xl text-xs font-bold bg-slate-900 border-slate-800 text-white">
        <CheckCircle :size="16" class="text-emerald-500" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>
