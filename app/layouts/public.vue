<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowRight, 
  Home, 
  User, 
  LogOut, 
  Plus, 
  Phone,
  Mail,
  Zap,
  Key,
  ShieldCheck,
  Building,
  Scale,
  FileText,
  LockKeyhole
} from 'lucide-vue-next'
import FloatingSupportWidget from '~/components/common/FloatingSupportWidget.vue'
import PaymentBadges from '~/components/common/PaymentBadges.vue'
import Footer from '~/components/landing/Footer.vue'

const route = useRoute()
const userSession = ref<any>(null)
const activeNavTab = ref('anasayfa')

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.company || userSession.value.username || userSession.value.name)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && (parsed.email || parsed.name || parsed.username || parsed.company || parsed.companyName)) {
          userSession.value = parsed
          return
        }
      }
      userSession.value = null
    } catch {
      userSession.value = null
    }
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('userSession')
      localStorage.removeItem('guestSession')
    } catch (e) {}
  }
  userSession.value = null
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'))
    window.location.reload()
  }
}

watch(() => route.fullPath, () => {
  checkSession()
})

onMounted(() => {
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
    window.addEventListener('focus', checkSession)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F2F5] font-sans text-slate-800 flex flex-col justify-between">
    
    <!-- ========================================================================= -->
    <!-- 📞 1. EN ÜST İNCE BİLGİ ŞERİDİ (GÖRSELDEKİ BİREBİR ÜST BAR) -->
    <!-- ========================================================================= -->
    <div class="bg-white border-b border-slate-300 py-1.5 px-4 sm:px-6 text-[11px] text-slate-600">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1">
            <span class="text-rose-600">📞</span>
            <strong>Destek:</strong> 
            <a href="tel:08508408695" class="text-blue-700 hover:underline">0850 840 86 95</a> / 0850 840 86 95
          </span>
          <span class="hidden sm:flex items-center gap-1">
            <span class="text-indigo-600">✉</span>
            <strong>E-posta:</strong> 
            <a href="mailto:ihalecib@gmail.com" class="text-blue-700 hover:underline">ihalecib@gmail.com</a>
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

        <!-- SOL: ORİJİNAL MARKA LOGOSU (İHALECİBURADA.COM) -->
        <NuxtLink to="/" class="flex items-center gap-3.5 hover:opacity-95 transition shrink-0 group py-1" title="İhaleciBurada.com Ana Sayfa">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 540 120" 
            class="h-10 sm:h-12 w-auto max-w-[230px] sm:max-w-[260px] object-contain drop-shadow-xs group-hover:scale-102 transition-transform duration-200" 
            fill="none" 
            role="img" 
            aria-label="İhaleciBurada.com"
          >
            <g transform="translate(10, 10)">
              <!-- Turuncu Nokta -->
              <circle cx="106" cy="18" r="14" fill="#FF5938" />
              <!-- 3 Adet Hız Çizgisi -->
              <path d="M 38 68 L 86 63 L 83 58 L 32 64 Z" fill="#0052FF" />
              <path d="M 18 84 L 78 78 L 75 73 L 12 80 Z" fill="#0084FF" />
              <path d="M 0 98 L 70 91 L 67 86 L -4 94 Z" fill="#00C2FF" />
              <!-- Koyu Lacivert Gövde -->
              <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#0B1E3B" />
            </g>
            <!-- ihaleciburada Metni -->
            <text x="152" y="84" fill="#0B1E3B" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
            <!-- .com Uzantısı -->
            <text x="430" y="84" fill="#0052FF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
          </svg>
        </NuxtLink>

        <!-- SAĞ: KURUMSAL ÜST MENÜ SEKMELERİ (DERİN KURUMSAL MAVİ / LACİVERT) -->
        <div class="flex flex-wrap items-center gap-1.5 text-white font-bold text-xs">
          <!-- 1. Ana Sayfa -->
          <NuxtLink 
            to="/"
            @click="activeNavTab = 'anasayfa'" 
            :class="activeNavTab === 'anasayfa' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white shadow-inner' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🏠 Ana Sayfa</span>
          </NuxtLink>
          
          <!-- 2. Profilim -->
          <NuxtLink 
            to="/panel/ayarlar" 
            @click="activeNavTab = 'profilim'" 
            :class="activeNavTab === 'profilim' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>👤 Profilim</span>
          </NuxtLink>

          <!-- 3. Bildirimler -->
          <NuxtLink 
            to="/panel/bildirimler" 
            @click="activeNavTab = 'bildirimler'" 
            :class="activeNavTab === 'bildirimler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer relative shadow-xs"
          >
            <span>🔔 Bildirimler</span>
            <span class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">3</span>
          </NuxtLink>

          <!-- 4. Yayındaki İhalelerim -->
          <NuxtLink 
            to="/panel/ilanlarim" 
            @click="activeNavTab = 'ilanlarim'" 
            :class="activeNavTab === 'ilanlarim' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📑 Yayındaki İhalelerim</span>
          </NuxtLink>

          <!-- 5. Gelen Teklifler -->
          <NuxtLink 
            to="/panel/gelen-teklifler" 
            @click="activeNavTab = 'gelen-teklifler'" 
            :class="activeNavTab === 'gelen-teklifler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📥 Gelen Teklifler</span>
          </NuxtLink>

          <!-- 6. Verilen Teklifler -->
          <NuxtLink 
            to="/panel/yaptigim-teklifler" 
            @click="activeNavTab = 'verilen-teklifler'" 
            :class="activeNavTab === 'verilen-teklifler' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📤 Verilen Teklifler</span>
          </NuxtLink>

          <!-- 7. Üye Firmalar -->
          <NuxtLink 
            to="/panel/firmalar" 
            @click="activeNavTab = 'firmalar'" 
            :class="activeNavTab === 'firmalar' ? 'bg-[#0F223D] border-b-2 border-amber-400 text-white' : 'bg-[#1E3A8A] hover:bg-[#172554] text-slate-100'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>🏢 Üye Firmalar</span>
          </NuxtLink>
        </div>

      </div>

      <!-- ALT İKİNCİ ŞERİT: YENİ ÜYELİK, GİRİŞ YAP, ÜYELİK UZAT & İHALE AÇ -->
      <div class="max-w-[1400px] mx-auto mt-2 pt-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <!-- Sol: Kurumsal Butonlar Grubu -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- 1. Yeni Üyelik (Giriş yapılmamışsa görünür) -->
          <NuxtLink 
            v-if="!isLoggedIn" 
            to="/uyelik?tab=register" 
            class="px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-emerald-700/30 transition cursor-pointer"
          >
            <span>👤+ Yeni üyelik</span>
          </NuxtLink>

          <!-- 2. Giriş Yap (Giriş yapılmamışsa görünür, giriş yapılınca otomatik gizlenir) -->
          <NuxtLink 
            v-if="!isLoggedIn" 
            to="/uyelik?tab=login" 
            class="px-3.5 py-1.5 rounded-lg bg-[#0F223D] hover:bg-[#1E293B] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-slate-700/40 transition cursor-pointer"
          >
            <span>🔑 Giriş Yap</span>
          </NuxtLink>

          <!-- 3. Üyelik Uzat -->
          <NuxtLink to="/abonelik" class="px-3.5 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs flex items-center gap-1 border border-sky-700/30 transition cursor-pointer">
            <span>🔄 Üyelik uzat</span>
          </NuxtLink>

          <!-- 4. İhale Aç (Büyük, Yatayda Geniş ve Yanıp Sönen Dikkat Çekici Buton) -->
          <NuxtLink 
            to="/panel/ihale-olustur" 
            class="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-[length:200%_auto] hover:bg-right text-white font-black text-sm shadow-md shadow-orange-600/30 flex items-center gap-1.5 border border-orange-400 transition-all duration-300 animate-pulse hover:scale-105 cursor-pointer tracking-wide"
          >
            <span class="text-base leading-none">✨</span>
            <span>+ İHALE AÇ</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Giriş Yapılmışsa Kullanıcı Profili ve Çıkış Butonu -->
        <div v-if="isLoggedIn" class="flex items-center gap-2.5 text-xs">
          <NuxtLink 
            to="/panel/ayarlar"
            class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center gap-1.5 transition"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span class="truncate max-w-[180px]">{{ (userSession?.isCompanyActive ? (userSession?.companyName || userSession?.company) : '') || userSession?.name || userSession?.firstName || userSession?.username || 'Hesabım' }}</span>
          </NuxtLink>

          <NuxtLink 
            to="/panel" 
            class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1 shadow-xs"
          >
            <span>🎛️ Panelime Git</span>
          </NuxtLink>

          <button 
            @click="handleLogout" 
            class="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition flex items-center gap-1 cursor-pointer"
            title="Güvenli Çıkış Yap"
          >
            <LogOut :size="13" />
            <span>Çıkış Yap</span>
          </button>
        </div>

      </div>
    </header>

    <!-- SAYFA İÇERİĞİ -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- ========================================================================= -->
    <!-- 🛡️ 3. MODERN KURUMSAL VE HUKUKİ FOOTER ALANI -->
    <!-- ========================================================================= -->
    <Footer />

    <!-- Floating Destek Butonu -->
    <FloatingSupportWidget />

  </div>
</template>

