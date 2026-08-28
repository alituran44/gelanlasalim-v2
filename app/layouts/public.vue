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
            <a href="tel:08508408695" class="text-blue-700 hover:underline">0850 840 86 95</a> / 0850 840 86 95
          </span>
          <span class="hidden sm:flex items-center gap-1">
            <span class="text-indigo-600">✉</span>
            <strong>E-posta:</strong> 
            <a href="mailto:ihalcib@gmail.com" class="text-blue-700 hover:underline">ihalcib@gmail.com</a>
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

        <!-- SAĞ: TASLAKTAKİ ORİJİNAL MENÜ SEKMELERİ (TURUNCU / MAVİ) -->
        <div class="flex flex-wrap items-center gap-1 text-white font-bold text-xs">
          <!-- 1. Ana Sayfa -->
          <NuxtLink 
            to="/"
            @click="activeNavTab = 'anasayfa'" 
            :class="activeNavTab === 'anasayfa' ? 'bg-[#0084B4] shadow-inner' : 'bg-[#0097CD] hover:bg-[#0084B4]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏠 Ana Sayfa</span>
          </NuxtLink>
          
          <!-- 2. Profilim -->
          <NuxtLink 
            to="/panel/ayarlar" 
            @click="activeNavTab = 'profilim'" 
            :class="activeNavTab === 'profilim' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>👤 Profilim</span>
          </NuxtLink>

          <!-- 3. Bildirimler -->
          <NuxtLink 
            to="/panel/bildirimler" 
            @click="activeNavTab = 'bildirimler'" 
            :class="activeNavTab === 'bildirimler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer relative"
          >
            <span>🔔 Bildirimler</span>
            <span class="h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">3</span>
          </NuxtLink>

          <!-- 4. Yayındaki İlanlarım -->
          <NuxtLink 
            to="/panel/ilanlarim" 
            @click="activeNavTab = 'ilanlarim'" 
            :class="activeNavTab === 'ilanlarim' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📑 Yayındaki İlanlarım</span>
          </NuxtLink>

          <!-- 5. Gelen Teklifler -->
          <NuxtLink 
            to="/panel/gelen-teklifler" 
            @click="activeNavTab = 'gelen-teklifler'" 
            :class="activeNavTab === 'gelen-teklifler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥 Gelen Teklifler</span>
          </NuxtLink>

          <!-- 6. Verilen Teklifler -->
          <NuxtLink 
            to="/panel/yaptigim-teklifler" 
            @click="activeNavTab = 'verilen-teklifler'" 
            :class="activeNavTab === 'verilen-teklifler' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📤 Verilen Teklifler</span>
          </NuxtLink>

          <!-- 7. Üye Firmalar -->
          <NuxtLink 
            to="/panel/firmalar" 
            @click="activeNavTab = 'firmalar'" 
            :class="activeNavTab === 'firmalar' ? 'bg-[#E65100]' : 'bg-[#F57C00] hover:bg-[#E65100]'"
            class="px-3.5 py-2 rounded-t-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏢 Üye Firmalar</span>
          </NuxtLink>
        </div>

      </div>

      <!-- ALT İKİNCİ ŞERİT: YENİ ÜYELİK, GİRİŞ YAP, MİSAFİR GİRİŞİ, ÜYELİK UZAT & İHALE AÇ -->
      <div class="max-w-[1400px] mx-auto mt-2 pt-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <!-- Sol: Butonlar Grubu -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- 1. Yeni Üyelik -->
          <NuxtLink to="/uyelik?tab=register" class="px-3.5 py-1.5 rounded bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>👤+ Yeni üyelik</span>
          </NuxtLink>

          <!-- 2. Giriş Yap -->
          <NuxtLink to="/uyelik?tab=login" class="px-3.5 py-1.5 rounded bg-[#0F223D] hover:bg-[#003057] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>🔑 Giriş Yap</span>
          </NuxtLink>

          <!-- 3. Misafir Girişi -->
          <NuxtLink to="/uyelik?tab=guest" class="px-3.5 py-1.5 rounded bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>👁️ Misafir Girişi</span>
          </NuxtLink>

          <!-- 4. Üyelik Uzat -->
          <NuxtLink to="/abonelik" class="px-3.5 py-1.5 rounded bg-[#0288D1] hover:bg-[#0277BD] text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <span>🔄 Üyelik uzat</span>
          </NuxtLink>

          <!-- 5. İhale Aç -->
          <NuxtLink to="/panel/ihale-olustur" class="px-3.5 py-1.5 rounded bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs shadow-xs flex items-center gap-1">
            <span>+ İhale Aç</span>
          </NuxtLink>
        </div>

        <!-- Sağ: Giriş Yapılmışsa Kullanıcı Profili ve Çıkış -->
        <div v-if="isLoggedIn" class="flex items-center gap-3 text-xs">
          <span class="font-bold text-slate-700">👤 {{ userSession?.companyName || userSession?.name || userSession?.username }}</span>
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
    <!-- 🛡️ 3. ZENGİN KURUMSAL VE HUKUKİ FOOTER ALANI (13 YASAL SÖZLEŞME VE KÜNYE) -->
    <!-- ========================================================================= -->
    <footer class="mt-12 bg-[#050B16] border-t border-slate-800 text-slate-400 text-xs py-12">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10 text-left">
        
        <!-- ÜST KISIM: 4 KOLONLU ZENGİN FOOTER IZGARASI -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <!-- Kolon 1: Şirket Künyesi (lg:col-span-1) -->
          <div class="space-y-3">
            <NuxtLink to="/" class="inline-block py-1 hover:opacity-95 transition" title="İhaleciBurada.com">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 540 120" 
                class="h-8 sm:h-9 w-auto max-w-[210px] object-contain drop-shadow-xs" 
                fill="none" 
                role="img" 
                aria-label="İhaleciBurada.com"
              >
                <g transform="translate(10, 10)">
                  <!-- Turuncu Nokta -->
                  <circle cx="106" cy="18" r="14" fill="#FF5938" />
                  <!-- 3 Adet Hız Çizgisi -->
                  <path d="M 38 68 L 86 63 L 83 58 L 32 64 Z" fill="#0084FF" />
                  <path d="M 18 84 L 78 78 L 75 73 L 12 80 Z" fill="#00C2FF" />
                  <path d="M 0 98 L 70 91 L 67 86 L -4 94 Z" fill="#38BDF8" />
                  <!-- Gövde -->
                  <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#38BDF8" />
                </g>
                <!-- ihaleciburada Metni (Beyaz) -->
                <text x="152" y="84" fill="#FFFFFF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
                <!-- .com Uzantısı (Mavi) -->
                <text x="430" y="84" fill="#0084FF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
              </svg>
            </NuxtLink>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Türkiye'nin onaylı B2B ihale ve doğrudan satın alma platformu. Kurumsal firmalar için güvenli ticaret, şeffaf teklif ve dijital sözleşme altyapısı.
            </p>
            <div class="pt-2 text-[11px] text-slate-300 space-y-1">
              <div>📍 İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale</div>
              <div>🏛️ Çanakkale V.D. 4700854210</div>
              <div>📋 MERSİS: 0470085421000001</div>
              <div>🏢 Ticaret Sicil: 14520</div>
              <div>📨 KEP: ihaleciburada@hs01.kep.tr</div>
            </div>
          </div>

          <!-- Kolon 2: Platform & Kurumsal (lg:col-span-1) -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">KURUMSAL & PLATFORM</h4>
            <div class="flex flex-col gap-2 text-slate-300 text-[11px]">
              <NuxtLink to="/" class="hover:text-sky-400 transition-colors">▪ Ana Sayfa</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="hover:text-sky-400 transition-colors">▪ Hakkımızda & Vizyon</NuxtLink>
              <NuxtLink to="/pazar-yeri" class="hover:text-sky-400 transition-colors">▪ B2B Pazar Yeri</NuxtLink>
              <NuxtLink to="/panel/ihale-olustur" class="hover:text-sky-400 transition-colors">▪ İhale Aç & Teklif Al</NuxtLink>
              <NuxtLink to="/abonelik" class="hover:text-sky-400 transition-colors">▪ Üyelik Paketleri</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kariyer" class="hover:text-sky-400 transition-colors">▪ Kariyer Fırsatları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=is-ortakligi" class="hover:text-sky-400 transition-colors">▪ İş Ortaklığı & Komisyon</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-sky-400 transition-colors">▪ Blog & Makaleler</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=basin" class="hover:text-sky-400 transition-colors">▪ Basın Odası & Medya Kiti</NuxtLink>
            </div>
          </div>

          <!-- Kolon 3: Hukuki Sözleşmeler Bölüm 1 (lg:col-span-1) -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">RESMİ SÖZLEŞMELER (I)</h4>
            <div class="flex flex-col gap-1.5 text-slate-300 text-[11px]">
              <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-sky-300">1. Kullanım Şartları & Hizmet (MSA)</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-sky-300">2. Gizlilik & Veri Güvenliği</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-sky-300">3. KVKK Aydınlatma & Veri İşleme (DPA)</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-amber-300 text-amber-200">4. Ön Bilgilendirme Formu</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-blue-300 text-blue-200">5. Mesafeli Satış & Abonelik Sözleşmesi</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-emerald-300 text-emerald-200">6. İptal, İade ve Cayma Koşulları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=teslimat" class="hover:text-sky-300">7. Teslimat ve Dijital İfa Politikası</NuxtLink>
            </div>
          </div>

          <!-- Kolon 4: Hukuki Sözleşmeler Bölüm 2 (lg:col-span-1) -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">RESMİ SÖZLEŞMELER (II)</h4>
            <div class="flex flex-col gap-1.5 text-slate-300 text-[11px]">
              <NuxtLink to="/sozlesmeler?tab=ihale-kurallari" class="hover:text-sky-300">8. B2B İhale ve Satın Alma Kuralları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=cerezler" class="hover:text-sky-300">9. Çerez Politikası & Takip Şartları</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=tedarikci-uyum" class="hover:text-sky-300">10. Tedarikçi Doğrulama & KYC Beyanı</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=sla" class="hover:text-sky-300">11. Servis Seviyesi Taahhüdü (SLA)</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=bilgi-guvenligi" class="hover:text-sky-300">12. Bilgi Güvenliği & ISO 27001</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=escrow" class="hover:text-sky-300">13. Güvenli Havuz (Escrow) Sözleşmesi</NuxtLink>
            </div>
          </div>

          <!-- Kolon 5: Destek ve Güvenlik (lg:col-span-1) -->
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase text-sky-400 tracking-wider">DESTEK & İLETİŞİM</h4>
            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
              <div class="font-bold text-white flex items-center gap-1.5">
                <span>📞</span>
                <a href="tel:08508408695" class="hover:underline text-emerald-400">0850 840 86 95</a>
              </div>
              <div class="text-slate-400">
                <span>✉</span>
                <a href="mailto:ihalcib@gmail.com" class="ml-1 text-sky-300 hover:underline">ihalcib@gmail.com</a>
              </div>
              <div class="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Hafta İçi: 09:00 - 18:00 | 7/24 Canlı Destek Masası
              </div>
            </div>
          </div>

        </div>

        <!-- Güvenlik Mührü ve Ödeme Kuruluşları (PayTR & iyzico 256-Bit SSL) -->
        <div class="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ShieldCheck :size="16" />
            <span>PayTR & iyzico 256-Bit SSL TLS 1.3 3D Secure Güvenli Ödeme Altyapısı</span>
          </div>
          <div>
            <PaymentBadges />
          </div>
        </div>

        <!-- En Alt Telif Satırı -->
        <div class="text-center text-slate-500 text-[11px] pt-4 border-t border-slate-800/50">
          © 2026 İhaleciBurada.com — B2B İhale ve Satın Alma & Satın Alma Platformu. Tüm Hakları Saklıdır.
        </div>

      </div>
    </footer>

    <!-- Floating Destek Butonu -->
    <FloatingSupportWidget />

  </div>
</template>
