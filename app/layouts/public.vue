<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Handshake, Menu, X, ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Home, User, LogOut, LayoutDashboard, Plus, FileText } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, setLocale, detectLocale, t } from '~/composables/useLocale'

const { cmsData } = useCmsData()
const mobileMenuOpen = ref(false)
const userSession = ref<any>(null)

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.id || userSession.value.companyName || userSession.value.firstName)
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
  detectLocale()
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
  }
})

const activeTenders = ref([
  { title: "Metro Lojistik A.Ş. - 10.000 Litre Motorin Yakıt Tedariki İhalesi", time: "2 Saat Kaldı", savings: "Hedef Tasarruf: %15" },
  { title: "Özgür İnşaat A.Ş. - 120 Ton Hazır Beton Alım İhalesi", time: "1 Gün Kaldı", savings: "Hedef Tasarruf: %12" },
  { title: "Tekstil Sanayi Ltd. - 5.000 Metre Dokuma Kumaş Tedariki", time: "5 Saat Kaldı", savings: "Hedef Tasarruf: %18" },
  { title: "Mega Gıda A.Ş. - 50.000 Adet Oluklu Ambalaj Koli Alımı", time: "7 Saat Kaldı", savings: "Hedef Tasarruf: %20" }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#0052FF] selection:text-white flex flex-col">
    <!-- Sticky Header Wrapper containing both Announcement Banner & Nav Header -->
    <div class="sticky top-0 z-50 w-full flex flex-col bg-white shadow-xs">
      
      <!-- Announcement Banner -->
      <div class="w-full bg-[#0F223D] text-white py-2 px-6 overflow-hidden border-b border-blue-900/40 relative z-50 text-[11px] font-bold">
        <div class="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 shrink-0">
            <span class="bg-[#0052FF] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 animate-pulse shadow-sm">
              ⚡ YAYINDAKİ İHALELER
            </span>
            <span class="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[10px] font-medium border-l border-slate-700 pl-3">
              <span>📞 Destek:</span>
              <a href="tel:08503080000" class="text-[#FF5938] font-bold hover:underline">0850 308 00 00</a>
            </span>
          </div>

          <div class="relative w-full overflow-hidden h-4 flex items-center mx-4">
            <div class="absolute whitespace-nowrap flex gap-12 animate-marquee hover:pause-animation">
              <span v-for="(tender, idx) in activeTenders" :key="idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#00C2FF] bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-[#FF5938] bg-[#FF5938]/10 border border-[#FF5938]/20 px-1.5 py-0.2 rounded text-[9px] font-black">{{ tender.savings }}</span>
              </span>
              <!-- Duplicate for seamless scroll loop -->
              <span v-for="(tender, idx) in activeTenders" :key="'dup-' + idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#00C2FF] bg-[#00C2FF]/10 border border-[#00C2FF]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-[#FF5938] bg-[#FF5938]/10 border border-[#FF5938]/20 px-1.5 py-0.2 rounded text-[9px] font-black">{{ tender.savings }}</span>
              </span>
            </div>
          </div>

          <a href="/#ihale-gezgini" class="text-[#00C2FF] hover:underline flex items-center gap-0.5 text-[10px] shrink-0 font-black">
            İncele <ArrowRight :size="12" />
          </a>
        </div>
      </div>

      <!-- Header -->
      <header class="w-full bg-white border-b transition-all" style="border-color: #E2E8F0;">
      <div class="mx-auto flex h-[84px] sm:h-[90px] max-w-7xl items-center justify-between px-6">

        <!-- Sol: Logo (İhaleciBurada.com) -->
        <NuxtLink to="/" class="flex items-center gap-3.5 hover:opacity-95 transition shrink-0 group py-1">
          <img 
            src="/logo.png" 
            alt="İhaleciBurada.com Logo" 
            class="h-14 sm:h-16 md:h-20 lg:h-22 max-h-[76px] w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-all duration-200" 
          />
          <span class="hidden xl:inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-[#0052FF] border border-blue-200 shadow-2xs">
            ✓ ONAYLI B2B
          </span>
        </NuxtLink>

        <!-- Orta: Hızlı Ana Sayfa, İhalelerim & Teklif Erişim Buton Şeridi -->
        <div class="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <NuxtLink 
            to="/" 
            class="px-3.5 py-1.5 text-xs font-black text-slate-800 hover:text-[#0052FF] bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm border border-slate-200/60"
          >
            <Home :size="14" class="text-[#0052FF]" />
            <span>Ana Sayfa</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/ilanlarim" 
            class="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            📋 <span>İhalelerim</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/gelen-teklifler" 
            class="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            📥 <span>Gelen Teklifler</span>
          </NuxtLink>
          <NuxtLink 
            to="/panel/yaptigim-teklifler" 
            class="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            📤 <span>Verdiğim Teklifler</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Profilim & İhale Aç / Giriş Butonları -->
        <div class="hidden sm:flex items-center gap-2">

          <!-- 🟢 KULLANICI GİRİŞ YAPTIĞINDA: İHALE AÇ BUTONU -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ihale-olustur"
            class="flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl text-white transition-all shadow-md bg-gradient-to-r from-[#0052FF] to-[#00C2FF] hover:opacity-95 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98"
          >
            <Plus :size="15" class="text-white stroke-[3]" />
            <span>İhale Aç</span>
          </NuxtLink>

          <!-- PROFILIM BUTTON (Sadece oturum AÇIKKEN gösterilir) -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ayarlar"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl border transition-all text-slate-800 bg-blue-50/70 hover:bg-blue-100/80 border-blue-200 shadow-sm"
          >
            <User :size="15" class="text-[#0052FF]" />
            <span>Profilim</span>
          </NuxtLink>

          <!-- PANELLE GEÇİŞ (Oturum açıkken) -->
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl text-white transition-all shadow-sm bg-[#0F223D] hover:bg-[#1A3358]"
          >
            <LayoutDashboard :size="14" />
            <span>Panel</span>
          </NuxtLink>

          <!-- ÇIKIŞ YAP BUTONU (Oturum açıkken) -->
          <button
            v-if="isLoggedIn"
            type="button"
            @click="handleLogout"
            class="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut :size="14" />
            <span>Çıkış</span>
          </button>

          <!-- MISAFIR GIRISI BUTTON (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik?tab=guest"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border-slate-300 shadow-xs"
            title="Şifresiz Misafir Girişi Yaparak Platformu İnceleyin"
          >
            <span>👁️</span>
            <span>Misafir Girişi</span>
          </NuxtLink>

          <!-- GIRIS YAP (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik"
            class="px-3 py-2 text-xs font-bold rounded-xl transition-all text-slate-700 hover:bg-slate-100"
          >
            Giriş Yap
          </NuxtLink>

          <!-- KURUMSAL HESAP AC (Sadece oturum KAPALIYKEN gösterilir) -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/uyelik"
            class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white transition-all shadow-md shadow-blue-950/10 hover:shadow-lg bg-gradient-to-r from-[#0F223D] via-[#0052FF] to-[#0F223D] border border-blue-400"
          >
            <span class="text-[#FF5938]">✨</span>
            <span>Kurumsal Hesap Aç</span>
            <ArrowRight :size="13" class="text-[#00C2FF]" />
          </NuxtLink>
        </div>

        <!-- Mobil Menü Butonu -->
        <div class="flex items-center gap-2 lg:hidden">
          <NuxtLink
            v-if="isLoggedIn"
            to="/panel/ihale-olustur"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-lg text-white bg-[#0052FF]"
          >
            <Plus :size="13" /> <span>İhale Aç</span>
          </NuxtLink>
          <button class="p-2 rounded-lg transition hover:bg-slate-100" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menü">
            <X :size="20" v-if="mobileMenuOpen" style="color: #475569;" />
            <Menu :size="20" v-else style="color: #475569;" />
          </button>
        </div>
      </div>

      <!-- Mobil Menü -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="border-t bg-white px-6 py-5 lg:hidden" style="border-color: #F1F5F9;">
          <div class="flex flex-col gap-3 text-sm font-semibold" style="color: #475569;">
            <a href="/#nasil-calisir" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Nasıl Çalışır</a>
            <a href="/#ozellikler" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Özellikler</a>
            <a href="/#ihale-gezgini" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">İhale Marketi</a>
            <NuxtLink to="/abonelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ t('pricing') }}</NuxtLink>
            <a href="/#sss" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">SSS</a>
            
            <div class="border-t my-1" style="border-color: #F1F5F9;"></div>
            
            <!-- Mobil İhale Aç / Profilim / Panel (Oturum açıkken) -->
            <NuxtLink v-if="isLoggedIn" to="/panel/ihale-olustur" @click="mobileMenuOpen = false" class="py-2 px-3 bg-[#0052FF] text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Plus :size="16" /> İhale Aç
            </NuxtLink>
            <NuxtLink v-if="isLoggedIn" to="/panel/ilanlarim" @click="mobileMenuOpen = false" class="py-1.5 text-slate-800 font-bold flex items-center gap-2">
              <FileText :size="16" /> İhalelerim
            </NuxtLink>
            <NuxtLink v-if="isLoggedIn" to="/panel/ayarlar" @click="mobileMenuOpen = false" class="py-1.5 text-blue-700 font-bold flex items-center gap-2">
              <User :size="16" /> Profilim
            </NuxtLink>
            <NuxtLink v-if="isLoggedIn" to="/panel" @click="mobileMenuOpen = false" class="py-1.5 text-slate-800 font-bold flex items-center gap-2">
              <LayoutDashboard :size="16" /> Yönetim Paneli
            </NuxtLink>
            <button v-if="isLoggedIn" @click="handleLogout(); mobileMenuOpen = false" class="py-1.5 text-rose-600 font-bold text-left flex items-center gap-2">
              <LogOut :size="16" /> Çıkış Yap
            </button>

            <!-- Mobil Giriş / Kayıt (Oturum kapalıyken) -->
            <NuxtLink v-if="!isLoggedIn" to="/uyelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Giriş Yap</NuxtLink>
            <NuxtLink
              v-if="!isLoggedIn"
              to="/uyelik"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 rounded-xl py-3 text-white font-bold bg-[#0052FF]"
            >
              Kurumsal Hesap Aç <ArrowRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </transition>
    </header>
  </div>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-[#0F223D] text-slate-300 border-t border-slate-800">
      <div class="mx-auto max-w-7xl px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <!-- Column 1: Brand Info -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="flex items-center gap-2.5">
              <img src="/logo.png" alt="İhaleciBurada Logo" class="h-9 w-auto bg-white p-1 rounded-lg" />
            </div>
            
            <p class="text-xs leading-relaxed font-medium text-slate-400">
              B2B satın alma taleplerini, tedarikçi tekliflerini, canlı eksiltmeleri ve pazarlık süreçlerini tek çatı altında yöneten kurumsal ters ihale platformu.
            </p>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 text-[9px] font-black text-[#00C2FF] uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-[#00C2FF]"></span>
                KVKK Kapsamında
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 text-[9px] font-black text-[#00C2FF] uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-[#00C2FF]"></span>
                HTTPS/TLS 1.3 Şifreli
              </span>
            </div>

            <!-- Social Links -->
            <div class="flex gap-2.5 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Facebook :size="14" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Instagram :size="14" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#00C2FF] hover:border-[#00C2FF] transition-all">
                <Linkedin :size="14" />
              </a>
            </div>
          </div>

          <!-- Column 2: Platform Links -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">PLATFORM</h4>
            <div class="flex flex-col gap-4 sm:gap-3 text-[11px] font-bold text-slate-300">
              <a href="#nasil-calisir" class="hover:text-[#00C2FF] transition-colors py-1">Nasıl Çalışır</a>
              <a href="#ihale-gezgini" class="hover:text-[#00C2FF] transition-colors py-1">İhale Marketi</a>
              <NuxtLink to="/panel/ilanlarim" class="hover:text-[#00C2FF] transition-colors py-1">İhalelerim</NuxtLink>
              <NuxtLink to="/abonelik" class="hover:text-[#00C2FF] transition-colors py-1">{{ t('pricing') }}</NuxtLink>
              <NuxtLink to="/entegrasyonlar" class="hover:text-[#00C2FF] transition-colors py-1">Entegrasyonlar</NuxtLink>
            </div>
          </div>

          <!-- Column 3: Company Links -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">ŞİRKET</h4>
            <div class="flex flex-col gap-4 sm:gap-3 text-[11px] font-bold text-slate-300">
              <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="hover:text-[#00C2FF] transition-colors py-1">Hakkımızda</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kariyer" class="hover:text-[#00C2FF] transition-colors py-1">Kariyer</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-[#00C2FF] transition-colors py-1">Blog & Haberler</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=is-ortakligi" class="hover:text-[#00C2FF] transition-colors py-1">İş Ortaklığı</NuxtLink>
              <NuxtLink to="/yardim" class="hover:text-[#00C2FF] transition-colors py-1">Yardım Merkezi</NuxtLink>
            </div>
          </div>

          <!-- Column 4: Contact details -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase tracking-wider text-[#00C2FF]">İLETİŞİM & DESTEK</h4>
              <p class="text-[11px] leading-relaxed text-slate-400 font-medium whitespace-pre-line">
                Maslak Mah. Büyükdere Cad. No:122 Şişli / İstanbul, Türkiye
              </p>
              <div class="text-[11px] font-bold text-slate-200 space-y-2">
                <a href="mailto:info@ihaleciburada.com" class="block hover:text-[#00C2FF] py-0.5">
                  info@ihaleciburada.com
                </a>
                <a href="mailto:ihaleciburada@hs01.kep.tr" class="block hover:text-[#00C2FF] font-mono text-[10px] py-0.5 text-slate-400">
                  ihaleciburada@hs01.kep.tr
                </a>
                <div class="pt-1 text-[#FF5938] font-bold">
                  📞 0850 308 00 00
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <h4 class="text-xs font-black uppercase text-[#00C2FF] tracking-wider">DESTEK SAATLERİ</h4>
              <p class="text-[11px] text-slate-400 font-medium leading-relaxed">
                Hafta İçi: 09:00 - 18:00 | Cumartesi: 10:00 - 14:00
              </p>
            </div>
          </div>

        </div>

        <hr class="border-slate-800 my-10" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-black uppercase tracking-wider">
          <div>© 2026 İhaleciBurada.com — Tüm Hakları Saklıdır.</div>
          <div class="flex flex-wrap gap-x-6 gap-y-3 justify-center sm:justify-end">
            <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-[#00C2FF] transition-colors py-1">KVKK Metni</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-[#00C2FF] transition-colors py-1">Kullanım Koşulları</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-[#00C2FF] transition-colors py-1">Gizlilik Politikası</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}

.hover\:pause-animation:hover {
  animation-play-state: paused;
}
</style>
