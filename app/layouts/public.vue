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
  Key,
  ShieldCheck,
  Building,
  Scale,
  FileText,
  LockKeyhole
} from 'lucide-vue-next'
import FloatingSupportWidget from '~/components/common/FloatingSupportWidget.vue'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

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

    <!-- ========================================================================= -->
    <!-- 🛡️ 3. ZENGİN KURUMSAL VE HUKUKİ FOOTER ALANI -->
    <!-- ========================================================================= -->
    <footer class="mt-12 bg-[#050B16] border-t border-slate-800 text-slate-400 text-xs py-12">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10 text-left">
        
        <!-- 4 Kolonlu Zengin Footer Izgarası -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Kolon 1: Şirket ve Borsa Hakkında -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">⚖️</span>
              <span class="text-base font-black text-white">İhaleciBurada.com</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Türkiye'nin onaylı B2B tersine ihale ve doğrudan satın alma platformu. Kurumsal firmalar için güvenli ticaret, şeffaf eksiltme ve dijital sözleşme altyapısı.
            </p>
            <div class="pt-2 text-[11px] text-slate-300 space-y-1">
              <div>📍 İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale</div>
              <div>🏛️ Çanakkale V.D. 4700854210</div>
              <div>📋 MERSİS: 0470085421000001</div>
            </div>
          </div>

          <!-- Kolon 2: Hızlı Bağlantılar -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">PLATFORM</h4>
            <div class="flex flex-col gap-2 text-slate-300 text-[11px]">
              <NuxtLink to="/" class="hover:text-sky-400 transition-colors">▪ Ana Sayfa</NuxtLink>
              <NuxtLink to="/pazar-yeri" class="hover:text-sky-400 transition-colors">▪ B2B Pazar Yeri</NuxtLink>
              <NuxtLink to="/panel/ihale-olustur" class="hover:text-sky-400 transition-colors">▪ İhale Oluştur & Eksiltme</NuxtLink>
              <NuxtLink to="/abonelik" class="hover:text-sky-400 transition-colors">▪ Üyelik Paketleri</NuxtLink>
              <NuxtLink to="/videolar" class="hover:text-sky-400 transition-colors">▪ Video Rehberler</NuxtLink>
            </div>
          </div>

          <!-- Kolon 3: 13 Yasal Sözleşme -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">HUKUKİ SÖZLEŞMELER</h4>
            <div class="flex flex-col gap-1.5 text-slate-300 text-[11px]">
              <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-amber-300 text-amber-200">▪ Ön Bilgilendirme Formu</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-blue-300 text-blue-200">▪ Mesafeli Satış Sözleşmesi</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-emerald-300 text-emerald-200">▪ İptal ve İade Koşulları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-sky-400">▪ Gizlilik Politikası</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-sky-400">▪ KVKK Aydınlatma Metni</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=escrow" class="hover:text-sky-400">▪ Escrow Güvenli Havuz</NuxtLink>
            </div>
          </div>

          <!-- Kolon 4: 7/24 Destek & Güvenlik -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">DESTEK & İLETİŞİM</h4>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
              <div class="font-bold text-white flex items-center gap-1.5">
                <span>📞</span>
                <span>0850 308 00 00</span>
              </div>
              <div class="text-slate-400">
                <span>✉</span>
                <span class="ml-1 text-sky-300">mail@ihaleciburada.com</span>
              </div>
              <div class="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Hafta İçi: 09:00 - 18:00 | 7/24 Online Destek
              </div>
            </div>
          </div>

        </div>

        <!-- Güvenlik Mührü ve Ödeme Kuruluşları (PayTR & iyzico 256-Bit SSL) -->
        <div class="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ShieldCheck :size="16" />
            <span>PayTR & iyzico 256-Bit SSL TLS 1.3 3D Secure Güvenli Ödeme</span>
          </div>
          <div>
            <PaymentBadges />
          </div>
        </div>

        <!-- En Alt Telif Satırı -->
        <div class="text-center text-slate-500 text-[11px] pt-4 border-t border-slate-800/50">
          © 2026 İhaleciBurada.com — B2B Canlı Eksiltme & Satın Alma Platformu. Tüm Hakları Saklıdır.
        </div>

      </div>
    </footer>

    <!-- Floating Destek Butonu -->
    <FloatingSupportWidget />

  </div>
</template>
