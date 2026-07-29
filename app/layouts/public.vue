<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Handshake, Menu, X, ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { locale, setLocale, detectLocale, t } from '~/composables/useLocale'

const { cmsData } = useCmsData()
const mobileMenuOpen = ref(false)

onMounted(() => {
  detectLocale()
})

const activeTenders = ref([
  { title: "Metro Logistics Inc. - 10,000 Liters Diesel Fuel Procurement", time: "2 Hours Left", savings: "Target Savings: 15%" },
  { title: "Ozgur Construction - 120 Tons Ready-Mix Concrete Supply", time: "1 Day Left", savings: "Target Savings: 12%" },
  { title: "Textile Industries Ltd. - 5,000 Meters Woven Fabric", time: "5 Hours Left", savings: "Target Savings: 18%" },
  { title: "Mega Food Corp. - 50,000 Units Corrugated Packaging Boxes", time: "7 Hours Left", savings: "Target Savings: 20%" }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
    <!-- Sticky Header Wrapper containing both Announcement Banner & Nav Header -->
    <div class="sticky top-0 z-50 w-full flex flex-col bg-white" style="box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <!-- Announcement Banner -->
      <div class="w-full bg-[#001D36] text-white py-2.5 px-6 overflow-hidden border-b border-blue-900/40 relative z-50 text-[11px] font-bold">
        <div class="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <span class="bg-[#1EAE4C] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
            ⚡ {{ locale === 'tr' ? 'YAYINDAKİ İHALELER' : 'ACTIVE TENDERS' }}
          </span>
          <div class="relative w-full overflow-hidden h-4 flex items-center mx-4">
            <div class="absolute whitespace-nowrap flex gap-12 animate-marquee hover:pause-animation">
              <span v-for="(tender, idx) in activeTenders" :key="idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#1EAE4C] bg-[#1EAE4C]/10 border border-[#1EAE4C]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-blue-300 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.savings }}</span>
              </span>
              <!-- Duplicate for seamless scroll loop -->
              <span v-for="(tender, idx) in activeTenders" :key="'dup-' + idx" class="flex items-center gap-2">
                <span class="text-slate-400">#{{ idx + 1 }}</span>
                <span class="text-white">{{ tender.title }}</span>
                <span class="text-[#1EAE4C] bg-[#1EAE4C]/10 border border-[#1EAE4C]/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.time }}</span>
                <span class="text-blue-300 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded text-[9px]">{{ tender.savings }}</span>
              </span>
            </div>
          </div>
          <a href="/#ihale-gezgini" class="text-[#1EAE4C] hover:underline flex items-center gap-0.5 text-[10px] shrink-0 font-black">
            {{ locale === 'tr' ? 'İncele' : 'Review' }} <ArrowRight :size="12" />
          </a>
        </div>
      </div>

      <!-- Header -->
      <header class="w-full bg-white border-b transition-all" style="border-color: #E2E8F0;">
      <div class="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">

        <!-- Sol: Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition shrink-0">
          <img src="/logo.png" alt="GelAnlaşalım B2B Tersine İhale Platformu Logo" class="h-9 w-auto" />
        </NuxtLink>

        <!-- Orta: Nav Linkleri -->
        <nav class="hidden lg:flex items-center rounded-full border p-1" style="border-color: #E2E8F0; background: #F8FAFC;">
          <a
            href="/#nasil-calisir"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'; this.style.boxShadow='none'"
          >{{ locale === 'tr' ? 'Nasıl Çalışır' : 'How it Works' }}</a>
          <a
            href="/#ozellikler"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'; this.style.boxShadow='none'"
          >{{ locale === 'tr' ? 'Özellikler' : 'Features' }}</a>
          <a
            href="/#ihale-gezgini"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'; this.style.boxShadow='none'"
          >{{ locale === 'tr' ? 'Market' : 'Market' }}</a>
          <NuxtLink
            to="/abonelik"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'; this.style.boxShadow='none'"
          >{{ t('pricing') }}</NuxtLink>
          <a
            href="/#sss"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'; this.style.boxShadow='none'"
          >{{ locale === 'tr' ? 'SSS' : 'FAQ' }}</a>
        </nav>

        <!-- Sağ: CTA Butonlar -->
        <div class="hidden lg:flex items-center gap-2">
          <!-- Dil Seçimi (Dropdown) -->
          <button 
            type="button" 
            @click="setLocale(locale === 'tr' ? 'en' : 'tr')"
            class="flex items-center gap-1.5 hover:bg-slate-100 px-3 py-2 rounded-xl text-xs font-black uppercase text-slate-600 transition"
          >
            🌐 {{ locale === 'tr' ? 'EN' : 'TR' }}
          </button>

          <NuxtLink
            to="/uyelik"
            class="px-4 py-2.5 text-xs font-semibold rounded-lg transition-all"
            style="color: #0F172A;"
            onmouseover="this.style.background='#F1F5F9'; this.style.color='#003057'"
            onmouseout="this.style.background='transparent'; this.style.color='#0F172A'"
          >
            {{ t('login') }}
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all"
            style="background: #003057;"
            onmouseover="this.style.background='#1EAE4C'"
            onmouseout="this.style.background='#003057'"
          >
            {{ locale === 'tr' ? 'Kurumsal hesap aç' : 'Open business account' }}
            <ArrowRight :size="13" />
          </NuxtLink>
        </div>

        <!-- Mobil Menü Butonu ve Dil Seçimi -->
        <div class="flex items-center gap-2 lg:hidden">
          <button 
            type="button" 
            @click="setLocale(locale === 'tr' ? 'en' : 'tr')"
            class="text-[10px] font-black p-2 rounded-lg border uppercase hover:bg-slate-50 transition"
            style="border-color: #E2E8F0; color: #475569;"
          >
            🌐 {{ locale === 'tr' ? 'EN' : 'TR' }}
          </button>
          
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
            <a href="/#nasil-calisir" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'Nasıl Çalışır' : 'How it Works' }}</a>
            <a href="/#ozellikler" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'Özellikler' : 'Features' }}</a>
            <a href="/#ihale-gezgini" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'Market' : 'Market' }}</a>
            <NuxtLink to="/abonelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ t('pricing') }}</NuxtLink>
            <a href="/#sss" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ locale === 'tr' ? 'SSS' : 'FAQ' }}</a>
            <div class="border-t my-1" style="border-color: #F1F5F9;"></div>
            <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">{{ t('login') }}</NuxtLink>
            <NuxtLink
              to="/uyelik"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 rounded-xl py-3 text-white font-bold"
              style="background: #003057;"
            >
              {{ locale === 'tr' ? 'Kurumsal hesap aç' : 'Open business account' }} <ArrowRight :size="14" />
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
    <footer class="bg-white text-slate-600 border-t border-slate-200">
      <div class="mx-auto max-w-7xl px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <!-- Column 1: Brand Info -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="flex items-center gap-2.5">
              <img src="/logo.png" alt="GelAnlaşalım B2B Platformu Logo" class="h-9 w-auto" />
            </div>
            
            <p class="text-xs leading-relaxed font-medium text-slate-500">
              {{ locale === 'tr' ? 'B2B satın alma taleplerini, tedarikçi tekliflerini ve karar kayıtlarını tek ters ihale akışında yöneten kurumsal platform.' : 'Enterprise platform managing B2B procurement requests, supplier bids, and decision records in a single reverse auction workflow.' }}
            </p>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                {{ locale === 'tr' ? 'KVKK Kapsamında' : 'KVKK Compliant' }}
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                {{ locale === 'tr' ? 'HTTPS/TLS Şifreli' : 'HTTPS/TLS Encrypted' }}
              </span>
            </div>

            <!-- Social Links -->
            <div class="flex gap-2.5 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1EAE4C] hover:border-[#1EAE4C] transition-all">
                <Facebook :size="14" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1EAE4C] hover:border-[#1EAE4C] transition-all">
                <Instagram :size="14" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1EAE4C] hover:border-[#1EAE4C] transition-all">
                <Linkedin :size="14" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1EAE4C] hover:border-[#1EAE4C] transition-all">
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Platform Links -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-blue-600 tracking-wider">{{ locale === 'tr' ? 'PLATFORM' : 'PLATFORM' }}</h4>
            <div class="flex flex-col gap-4 sm:gap-3 text-[11px] font-bold text-slate-700">
              <a href="#nasil-calisir" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Nasıl Çalışır' : 'How it Works' }}</a>
              <a href="#ihale-gezgini" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Özellikler' : 'Features' }}</a>
              <NuxtLink to="/abonelik" class="hover:text-blue-600 transition-colors py-1">{{ t('pricing') }}</NuxtLink>
              <a href="#ihale-gezgini" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Pazar Yeri' : 'Marketplace' }}</a>
              <NuxtLink to="/entegrasyonlar" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Entegrasyonlar' : 'Integrations' }}</NuxtLink>
              <a href="#sss" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Yardım Merkezi' : 'Help Center' }}</a>
            </div>
          </div>

          <!-- Column 3: Company Links -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-blue-600 tracking-wider">{{ locale === 'tr' ? 'ŞİRKET' : 'COMPANY' }}</h4>
            <div class="flex flex-col gap-4 sm:gap-3 text-[11px] font-bold text-slate-700">
              <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Hakkımızda' : 'About Us' }}</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kariyer" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Kariyer' : 'Careers' }}</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Blog' : 'Blog' }}</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Basın Odası' : 'Press Room' }}</NuxtLink>
              <a href="#sss" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'İletişim' : 'Contact' }}</a>
              <NuxtLink to="/sozlesmeler?tab=is-ortakligi" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'İş Ortaklığı Programı' : 'Partnership Program' }}</NuxtLink>
            </div>
          </div>

          <!-- Column 4: Contact details -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="space-y-3">
              <h4 class="text-xs font-black uppercase tracking-wider" style="color: #003057;">{{ locale === 'tr' ? 'İLETİŞİM' : 'CONTACT' }}</h4>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium whitespace-pre-line">
                {{ locale === 'tr' ? (cmsData.contact ? cmsData.contact.address : 'Bahçelievler Mahallesi 5083 Sokak, No:11/A Altıeylül,\nBalıkesir, Türkiye') : 'Bahcelievler District 5083 Street, No:11/A Altieylul,\nBalikesir, Turkey' }}
              </p>
              <div class="text-[11px] font-bold text-slate-700 space-y-3">
                <a :href="'mailto:' + (cmsData.contact ? cmsData.contact.email : 'info@gelanlasalim.com')" class="block hover:text-[#1EAE4C] py-1">
                  {{ cmsData.contact ? cmsData.contact.email : 'info@gelanlasalim.com' }}
                </a>
                <a :href="'mailto:' + (cmsData.contact ? cmsData.contact.kep : 'gelanlasalim@hs01.kep.tr')" class="block hover:text-[#1EAE4C] font-mono text-[10px] py-1">
                  {{ cmsData.contact ? cmsData.contact.kep : 'gelanlasalim@hs01.kep.tr' }}
                </a>
              </div>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-black uppercase text-[#003057] tracking-wider">{{ locale === 'tr' ? 'DESTEK SAATLERİ' : 'SUPPORT HOURS' }}</h4>
              <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                {{ locale === 'tr' ? (cmsData.contact ? cmsData.contact.workHoursWeekdays : 'Pazartesi - Cuma: 09:00 - 18:00') : 'Monday - Friday: 09:00 - 18:00' }} <br />
                {{ locale === 'tr' ? (cmsData.contact ? cmsData.contact.workHoursSaturday : 'Cumartesi: 10:00 - 14:00') : 'Saturday: 10:00 - 14:00' }}
              </p>
            </div>
          </div>

        </div>

        <hr class="border-slate-200 my-10" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-black uppercase tracking-wider">
          <div>© 2026 {{ locale === 'tr' ? 'GelAnlaşalım. Tüm Hakları Saklıdır.' : 'GelAnlasalim. All Rights Reserved.' }}</div>
          <div class="flex flex-wrap gap-x-6 gap-y-3 justify-center sm:justify-end">
            <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'KVKK Metni' : 'KVKK Policy' }}</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use' }}</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-600 transition-colors py-1">{{ locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy' }}</NuxtLink>
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
