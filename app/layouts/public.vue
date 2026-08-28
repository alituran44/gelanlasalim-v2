<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  ArrowRight, 
  Home, 
  User, 
  LogOut, 
  Plus, 
  Phone,
  Mail,
  Zap,
  Key
} from 'lucide-vue-next'
import FloatingSupportWidget from '~/components/common/FloatingSupportWidget.vue'

const userSession = ref<any>(null)
const loginUsername = ref('')
const loginPassword = ref('')
const activeNavTab = ref('anasayfa')

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.username)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        userSession.value = JSON.parse(raw)
      } else {
        userSession.value = null
      }
    } catch {
      userSession.value = null
    }
  }
}

function handleLogin() {
  if (!loginUsername.value || !loginPassword.value) {
    alert('Lütfen kullanıcı adı ve şifrenizi giriniz.')
    return
  }
  const session = {
    username: loginUsername.value,
    companyName: loginUsername.value.includes('@') ? loginUsername.value.split('@')[0] : loginUsername.value,
    role: 'member'
  }
  userSession.value = session
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(session))
  }
  alert(`✓ Hoş geldiniz, ${session.companyName}!`)
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('guestSession')
  }
  userSession.value = null
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

onMounted(() => {
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] font-sans text-slate-800 flex flex-col">
    
    <!-- ========================================================================= -->
    <!-- 📞 1. EN ÜST İNCE BİLGİ ŞERİDİ (GÖRSELDEKİ BİREBİR ÜST BAR) -->
    <!-- ========================================================================= -->
    <div class="bg-white border-b border-slate-300 py-1.5 px-4 sm:px-6 text-[11px] text-slate-600">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1">
            <span class="text-rose-600">📞</span>
            <strong>Destek:</strong> 
            <a href="tel:08503080000" class="text-blue-700 hover:underline">0850 308 00 00</a> / +90 555 962 73 20
          </span>
          <span class="hidden sm:flex items-center gap-1">
            <span class="text-indigo-600">✉</span>
            <strong>E-posta:</strong> 
            <a href="mailto:mail@ihaleciburada.com" class="text-blue-700 hover:underline">mail@ihaleciburada.com</a>
          </span>
        </div>
        <div>
          <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1">
            <span>Kurumsal bilgiler</span> <ArrowRight :size="11" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 🏛️ 2. ANA HEADER: LOGO, MENÜ SEKMELERİ & HIZLI GİRİŞ ŞERİDİ -->
    <!-- ========================================================================= -->
    <header class="bg-white border-b border-slate-300 pt-2 pb-2 px-4 sm:px-6 shadow-xs sticky top-0 z-50">
      <div class="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">

        <!-- SOL: LOGO (İHALECİBURADA.COM) -->
        <NuxtLink to="/" class="flex items-center gap-3 shrink-0 group py-1">
          <div class="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#0084B4] to-[#00A3C4] flex items-center justify-center font-black text-2xl text-white shadow-md">
            ⚖️
          </div>
          <div>
            <div class="text-2xl font-black tracking-tight text-[#0084B4] leading-tight flex items-center">
              <span>ihaleci</span><span class="text-[#1EAE4C]">burada</span><span class="text-slate-600 text-base font-bold">.com</span>
            </div>
            <span class="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">TÜRKİYE'NİN RESMİ B2B İHALE VE SATIN ALMA PORTALI</span>
          </div>
        </NuxtLink>

        <!-- SAĞ: TURUNCU / MAVİ MENÜ SEKMELERİ -->
        <div class="flex flex-wrap items-center gap-1 text-white font-bold text-xs">
          <NuxtLink 
            to="/"
            @click="activeNavTab = 'anasayfa'" 
            :class="activeNavTab === 'anasayfa' ? 'bg-[#0084B4] shadow-inner' : 'bg-[#0097CD] hover:bg-[#0084B4]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏠 Anasayfa</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/panel/bildirimler" 
            @click="activeNavTab = 'bultenler'" 
            :class="activeNavTab === 'bultenler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📑 Bültenlerim</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/istatistikler" 
            @click="activeNavTab = 'okuduklarim'" 
            :class="activeNavTab === 'okuduklarim' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>👁️ Okuduklarım</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/tekliflerim" 
            @click="activeNavTab = 'takip'" 
            :class="activeNavTab === 'takip' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>⭐ Takip listem</span>
          </NuxtLink>

          <NuxtLink 
            to="/sozlesmeler" 
            @click="activeNavTab = 'sozlesme'" 
            :class="activeNavTab === 'sozlesme' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏆 Sözleşme listem</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel/bildirimler" 
            @click="activeNavTab = 'bildirimler'" 
            :class="activeNavTab === 'bildirimler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-4 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer relative"
          >
            <span>🔔 Bildirimler</span>
            <span class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">3</span>
          </NuxtLink>
        </div>

      </div>

      <!-- ALT İKİNCİ ŞERİT: YENİ ÜYELİK & HIZLI GİRİŞ FORMU -->
      <div class="max-w-[1400px] mx-auto mt-2 pt-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <!-- Sol: Yeni Üyelik, Üyelik Uzat & İhale Aç -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/uyelik" class="px-3 py-1.5 rounded bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>👤+ Yeni üyelik</span>
          </NuxtLink>
          <NuxtLink to="/abonelik" class="px-3 py-1.5 rounded bg-[#0288D1] hover:bg-[#0277BD] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>🔄 Üyelik uzat</span>
          </NuxtLink>
          <NuxtLink to="/panel/ihale-olustur" class="px-3 py-1.5 rounded bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs shadow-xs flex items-center gap-1">
            <span>+ İhale Aç</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Hızlı Üye Girişi (Giriş Yapılmamışsa) -->
        <div v-if="!isLoggedIn" class="flex flex-wrap items-center gap-1.5 text-xs">
          <span class="font-bold text-slate-700 flex items-center gap-1">👤 Üye girişi:</span>
          <input 
            v-model="loginUsername" 
            type="text" 
            placeholder="Kullanıcı adı / E-posta" 
            class="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-36 sm:w-44" 
          />
          <input 
            v-model="loginPassword" 
            type="password" 
            placeholder="Şifre" 
            class="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-28 sm:w-32" 
          />
          <button 
            @click="handleLogin" 
            class="px-3 py-1 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold rounded text-xs transition cursor-pointer"
          >
            Giriş ➔
          </button>
          <button 
            @click="alert('Şifre sıfırlama linki e-postanıza gönderilecektir.')" 
            class="px-3 py-1 bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold rounded text-xs transition cursor-pointer"
          >
            🔑 Şifremi Unuttum
          </button>
        </div>

        <!-- Sağ: Giriş Yapılmışsa Kullanıcı Profili ve Çıkış -->
        <div v-else class="flex items-center gap-3 text-xs">
          <span class="font-bold text-slate-700">👤 {{ userSession.companyName || userSession.username }}</span>
          <NuxtLink to="/panel" class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold">Yönetim Paneli</NuxtLink>
          <button @click="handleLogout" class="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-bold border border-red-300 cursor-pointer">Çıkış</button>
        </div>

      </div>
    </header>

    <!-- SAYFA İÇERİĞİ -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Floating Destek Butonu -->
    <FloatingSupportWidget />

  </div>
</template>
