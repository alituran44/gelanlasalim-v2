<script setup lang="ts">
import { ref } from 'vue'
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Lock,
  Phone,
  MapPin,
  Building2,
  FileText,
  Scale,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

const { cmsData, saveCmsData } = useCmsData()

const subscriberEmail = ref('')
const isSubscribed = ref(false)

function handleSubscribe() {
  const email = subscriberEmail.value.trim().toLowerCase()
  if (!email || !email.includes('@')) return

  if (cmsData.value?.emailSettings?.subscribers) {
    const today = new Date().toISOString().split('T')[0]
    cmsData.value.emailSettings.subscribers.unshift({
      id: Date.now(),
      email,
      companyName: 'Bülten Abonesi',
      source: 'Alt Bilgi (Footer)',
      subscribedAt: today,
      status: 'Aktif'
    })
    saveCmsData(JSON.parse(JSON.stringify(cmsData.value)))
  }

  isSubscribed.value = true
  subscriberEmail.value = ''
}

const platformLinks = [
  { label: "B2B Pazar Yeri & İlanlar", to: "/pazar-yeri" },
  { label: "Yeni İhale Aç & Teklif Al", to: "/panel/ihale-olustur" },
  { label: "Canlı Tersine Eksiltme", to: "/panel/canli-etkinlikler" },
  { label: "Üyelik & Lansman Planları", to: "/abonelik" },
  { label: "Firma Doğrulama (Mavi Rozet)", to: "/firma-dogrulama" },
  { label: "Video Rehberler & Akademi", to: "/videolar" },
  { label: "Entegrasyonlar & API", to: "/entegrasyonlar" }
]

const legalLinks = [
  { label: "Kullanım Şartları & Hizmet Sözleşmesi", to: "/sozlesmeler?tab=kullanim" },
  { label: "Gizlilik Politikası & KVKK Aydınlatma", to: "/sozlesmeler?tab=gizlilik" },
  { label: "Mesafeli Satış & Abonelik Sözleşmesi", to: "/sozlesmeler?tab=mesafeli-satis" },
  { label: "B2B İhale ve Satın Alma Kuralları", to: "/sozlesmeler?tab=ihale-kurallari" },
  { label: "Çerez (Cookie) Politikası", to: "/sozlesmeler?tab=cerezler" },
  { label: "Hakkımızda & Vizyonumuz", to: "/sozlesmeler?tab=hakkimizda" }
]
</script>

<template>
  <footer class="w-full bg-[#070D18] border-t border-slate-800/80 text-slate-300 pt-12 pb-10 text-left">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- ========================================================================= -->
      <!-- 📩 1. B2B E-BÜLTEN & İHALE DUYURU ŞERİDİ -->
      <!-- ========================================================================= -->
      <div class="rounded-3xl bg-gradient-to-r from-[#0F223D] via-[#0A192F] to-[#0D2137] border border-blue-900/40 p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="space-y-1.5 max-w-xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
            <Mail :size="12" />
            <span>B2B İHALE VE TEDARİK BÜLTENİ</span>
          </div>
          <h3 class="text-lg sm:text-xl font-black text-white tracking-tight">
            Sektörünüzdeki Yeni Alım İhalelerini Kaçırmayın
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed font-medium">
            Haftalık canlı tersine eksiltme takvimi, yeni açılan kurumsal alım ilanları ve tedarik fırsatları anında e-postanıza gelsin.
          </p>
        </div>

        <div class="w-full lg:w-auto shrink-0">
          <form v-if="!isSubscribed" @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2 w-full sm:w-[380px]">
            <input 
              v-model="subscriberEmail" 
              type="email" 
              placeholder="Kurumsal e-posta adresiniz..." 
              class="flex-1 rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none" 
              required
            />
            <button 
              type="submit" 
              class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <span>Abone Ol</span>
              <ArrowRight :size="14" />
            </button>
          </form>
          <div v-else class="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <CheckCircle2 :size="16" class="text-emerald-400" />
            <span>Tebrikler! Bülten aboneliğiniz başarıyla kaydedildi.</span>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- 🏢 2. 4 KOLONLU KURUMSAL VE HUKUKİ IZGARA -->
      <!-- ========================================================================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
        
        <!-- Kolon 1: Marka Künyesi & Güvenlik Rozetleri (lg:col-span-4) -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <!-- Logo -->
          <NuxtLink to="/" class="inline-block hover:opacity-95 transition" title="İhaleciBurada.com">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 540 120" 
              class="h-8 sm:h-9 w-auto max-w-[210px] object-contain drop-shadow-xs" 
              fill="none" 
              role="img" 
              aria-label="İhaleciBurada.com"
            >
              <g transform="translate(10, 10)">
                <circle cx="106" cy="18" r="14" fill="#FF5938" />
                <path d="M 38 68 L 86 63 L 83 58 L 32 64 Z" fill="#0084FF" />
                <path d="M 18 84 L 78 78 L 75 73 L 12 80 Z" fill="#00C2FF" />
                <path d="M 0 98 L 70 91 L 67 86 L -4 94 Z" fill="#38BDF8" />
                <path d="M 94 33 C 90 33 82 37 81 40 L 89 40 C 97 40 94 48 91 58 L 79 97 C 76 107 84 105 91 101 C 101 95 108 78 114 55 C 117 42 110 33 94 33 Z" fill="#38BDF8" />
              </g>
              <text x="152" y="84" fill="#FFFFFF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1.2px">ihaleciburada</text>
              <text x="430" y="84" fill="#0084FF" font-family="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.8px">.com</text>
            </svg>
          </NuxtLink>
          
          <p class="text-xs leading-relaxed font-medium text-slate-400 max-w-sm">
            Türkiye'nin onaylı kurumsal B2B ihale, doğrudan satın alma ve canlı tersine eksiltme platformu. Güvenli ticaret, şeffaf teklif akışı ve TCMB lisanslı escrow altyapısı.
          </p>

          <!-- Güvenlik ve Uyumluluk Rozetleri -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span class="inline-flex items-center gap-1 rounded-md bg-blue-950/80 border border-blue-800/60 px-2.5 py-1 text-[9px] font-black text-blue-300 uppercase tracking-wider">
              <ShieldCheck :size="11" class="text-blue-400" />
              KVKK & ISO 27001
            </span>
            <span class="inline-flex items-center gap-1 rounded-md bg-blue-950/80 border border-blue-800/60 px-2.5 py-1 text-[9px] font-black text-blue-300 uppercase tracking-wider">
              <Lock :size="11" class="text-blue-400" />
              TLS 1.3 256-BIT SSL
            </span>
            <span class="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 text-[9px] font-black text-emerald-300 uppercase tracking-wider">
              <Scale :size="11" class="text-emerald-400" />
              TCMB & BDDK ESCROW
            </span>
          </div>

          <!-- Sosyal Medya İkonları -->
          <div class="flex items-center gap-2 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-xs" title="LinkedIn">
              <Linkedin :size="14" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all shadow-xs" title="Instagram">
              <Instagram :size="14" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-all shadow-xs" title="Facebook">
              <Facebook :size="14" />
            </a>
          </div>
        </div>

        <!-- Kolon 2: Platform & Hızlı Menü (lg:col-span-3) -->
        <div class="lg:col-span-3 flex flex-col gap-3">
          <h4 class="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
            <Building2 :size="13" />
            <span>PLATFORM VE ÇÖZÜMLER</span>
          </h4>
          <div class="flex flex-col gap-2 text-xs font-bold text-slate-300">
            <NuxtLink 
              v-for="item in platformLinks" 
              :key="item.to" 
              :to="item.to" 
              class="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span class="text-blue-500 text-[10px]">▪</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Kolon 3: 5 Temel Hukuki Sözleşme (lg:col-span-3) -->
        <div class="lg:col-span-3 flex flex-col gap-3">
          <h4 class="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
            <FileText :size="13" />
            <span>HUKUKİ VE SÖZLEŞMELER</span>
          </h4>
          <div class="flex flex-col gap-2 text-xs font-medium text-slate-300">
            <NuxtLink 
              v-for="item in legalLinks" 
              :key="item.to" 
              :to="item.to" 
              class="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span class="text-blue-500 text-[10px]">▪</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Kolon 4: Şirket Künyesi & İletişim (lg:col-span-2) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div class="space-y-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <MapPin :size="13" />
              <span>ŞİRKET KÜNYESİ</span>
            </h4>
            <p class="text-[11px] leading-relaxed text-slate-300 font-medium space-y-1">
              <strong class="text-white block font-bold">İhaleciBurada Platform A.Ş.</strong>
              <span class="text-slate-400 block">İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale</span>
              <span class="text-slate-400 block font-mono text-[10px]">Çanakkale V.D. / VKN: 4700854210</span>
              <span class="text-slate-400 block font-mono text-[10px]">MERSİS: 0470085421000001</span>
              <span class="text-slate-400 block font-mono text-[10px]">KEP: hasanhuseyin.yildirim.17@hs01.kep.tr</span>
            </p>
            
            <div class="text-xs font-bold text-slate-200 space-y-1.5 pt-2 border-t border-slate-800">
              <a href="tel:08508408695" class="flex items-center gap-1.5 text-[#FF5938] hover:text-[#ff785e] transition-colors font-bold">
                <Phone :size="13" />
                <span>0850 840 86 95</span>
              </a>
              <a href="mailto:ihalecib@gmail.com" class="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                <Mail :size="13" />
                <span>ihalecib@gmail.com</span>
              </a>
            </div>
          </div>

          <div class="space-y-1 pt-1 border-t border-slate-800">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">DESTEK SAATLERİ</span>
            <p class="text-[11px] text-slate-300 font-medium leading-relaxed">
              Hafta İçi: 09:00 - 18:00<br />
              Cumartesi: 10:00 - 14:00
            </p>
          </div>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- 💳 3. ÖDEME ALTYAPISI VE GÜVENLİK ŞERİDİ -->
      <!-- ========================================================================= -->
      <div class="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div class="text-slate-400 font-medium text-[11px] flex items-center gap-2">
          <span class="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 :size="13" /> PayTR & iyzico 3D Secure
          </span>
          <span>•</span>
          <span>TCMB & BDDK Lisanslı Güvenli Ödeme Altyapısı</span>
        </div>
        <PaymentBadges />
      </div>

      <!-- ========================================================================= -->
      <!-- ⚖️ 4. EN ALT TELİF VE HIZLI YASAL BAĞLANTILAR -->
      <!-- ========================================================================= -->
      <div class="pt-6 border-t border-slate-800/60 flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
        <div>
          © 2026 İhaleciBurada.com — B2B İhale ve Satın Alma Platformu. Tüm Hakları Saklıdır.
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-1.5 justify-center lg:justify-end text-slate-400">
          <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-400 transition-colors">Kullanım Şartları</NuxtLink>
          <span class="text-slate-700">•</span>
          <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-400 transition-colors">Gizlilik & KVKK</NuxtLink>
          <span class="text-slate-700">•</span>
          <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-blue-400 transition-colors font-bold text-blue-300">Mesafeli Satış & Abonelik</NuxtLink>
          <span class="text-slate-700">•</span>
          <NuxtLink to="/sozlesmeler?tab=ihale-kurallari" class="hover:text-blue-400 transition-colors">B2B İhale Kuralları</NuxtLink>
          <span class="text-slate-700">•</span>
          <NuxtLink to="/sozlesmeler?tab=cerezler" class="hover:text-blue-400 transition-colors">Çerez Politikası</NuxtLink>
        </div>
      </div>

    </div>
  </footer>
</template>
