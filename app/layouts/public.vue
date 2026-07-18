<script setup lang="ts">
import { ref } from 'vue'
import { Handshake, Menu, X, ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

const { cmsData } = useCmsData()
const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b transition-all" style="border-color: #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <div class="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">

        <!-- Sol: Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition shrink-0">
          <img src="/logo.png" alt="GelAnlaşalım" class="h-9 w-auto" />
        </NuxtLink>

        <!-- Orta: Nav Linkleri -->
        <nav class="hidden lg:flex items-center rounded-full border p-1" style="border-color: #E2E8F0; background: #F8FAFC;">
          <a
            href="/#nasil-calisir"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'; this.style.boxShadow='none'"
          >Nasıl Çalışır</a>
          <a
            href="/#ozellikler"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'; this.style.boxShadow='none'"
          >Özellikler</a>
          <a
            href="/#ihale-gezgini"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'; this.style.boxShadow='none'"
          >Market</a>
          <NuxtLink
            to="/abonelik"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'; this.style.boxShadow='none'"
          >Fiyatlandırma</NuxtLink>
          <a
            href="/#sss"
            class="rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='white'; this.style.color='#003057'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'; this.style.boxShadow='none'"
          >SSS</a>
        </nav>

        <!-- Sağ: CTA Butonlar -->
        <div class="hidden lg:flex items-center gap-2">
          <NuxtLink
            to="/uyelik"
            class="px-4 py-2.5 text-xs font-semibold rounded-lg transition-all"
            style="color: #475569;"
            onmouseover="this.style.background='#F1F5F9'; this.style.color='#003057'"
            onmouseout="this.style.background='transparent'; this.style.color='#475569'"
          >
            Giriş Yap
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all"
            style="background: #003057;"
            onmouseover="this.style.background='#1EAE4C'"
            onmouseout="this.style.background='#003057'"
          >
            Kurumsal hesap aç
            <ArrowRight :size="13" />
          </NuxtLink>
        </div>

        <!-- Mobil Menü Butonu -->
        <button class="lg:hidden p-2 rounded-lg transition hover:bg-slate-100" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menü">
          <X :size="20" v-if="mobileMenuOpen" style="color: #475569;" />
          <Menu :size="20" v-else style="color: #475569;" />
        </button>
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
            <a href="/#ihale-gezgini" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Market</a>
            <NuxtLink to="/abonelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Fiyatlandırma</NuxtLink>
            <a href="/#sss" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">SSS</a>
            <div class="border-t my-1" style="border-color: #F1F5F9;"></div>
            <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="py-1.5 hover:text-blue-600 transition-colors">Giriş Yap</NuxtLink>
            <NuxtLink
              to="/uyelik"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 rounded-xl py-3 text-white font-bold"
              style="background: #003057;"
            >
              Kurumsal hesap aç <ArrowRight :size="14" />
            </NuxtLink>
          </div>
        </div>
      </transition>
    </header>

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
              <img src="/logo.png" alt="GelAnlaşalım" class="h-9 w-auto" />
            </div>
            
            <p class="text-xs leading-relaxed font-medium text-slate-500">
              B2B satın alma taleplerini, tedarikçi tekliflerini ve karar kayıtlarını tek ters ihale akışında yöneten kurumsal platform.
            </p>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                KVKK Kapsamında
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wide">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                HTTPS/TLS Şifreli
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
            <h4 class="text-[10px] font-black uppercase text-blue-600 tracking-wider">PLATFORM</h4>
            <div class="flex flex-col gap-3 text-[11px] font-bold text-slate-700">
              <a href="#nasil-calisir" class="hover:text-blue-600 transition-colors">Nasıl Çalışır</a>
              <a href="#ihale-gezgini" class="hover:text-blue-600 transition-colors">Özellikler</a>
              <NuxtLink to="/abonelik" class="hover:text-blue-600 transition-colors">Fiyatlandırma</NuxtLink>
              <a href="#ihale-gezgini" class="hover:text-blue-600 transition-colors">Pazar Yeri</a>
              <NuxtLink to="/entegrasyonlar" class="hover:text-blue-600 transition-colors">Entegrasyonlar</NuxtLink>
              <a href="#sss" class="hover:text-blue-600 transition-colors">Yardım Merkezi</a>
            </div>
          </div>

          <!-- Column 3: Company Links -->
          <div class="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 class="text-[10px] font-black uppercase text-blue-600 tracking-wider">ŞİRKET</h4>
            <div class="flex flex-col gap-3 text-[11px] font-bold text-slate-700">
              <NuxtLink to="/sozlesmeler?tab=hakkimizda" class="hover:text-blue-600 transition-colors">Hakkımızda</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=kariyer" class="hover:text-blue-600 transition-colors">Kariyer</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-blue-600 transition-colors">Blog</NuxtLink>
              <NuxtLink to="/sozlesmeler?tab=blog" class="hover:text-blue-600 transition-colors">Basın Odası</NuxtLink>
              <a href="#sss" class="hover:text-blue-600 transition-colors">İletişim</a>
              <NuxtLink to="/sozlesmeler?tab=is-ortakligi" class="hover:text-blue-600 transition-colors">İş Ortaklığı Programı</NuxtLink>
            </div>
          </div>

          <!-- Column 4: Contact details -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="space-y-3">
              <h4 class="text-[10px] font-black uppercase tracking-wider" style="color: #003057;">İLETİŞİM</h4>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium whitespace-pre-line">
                {{ cmsData.contact ? cmsData.contact.address : 'Bahçelievler Mahallesi 5083 Sokak, No:11/A Altıeylül,\nBalıkesir, Türkiye' }}
              </p>
              <div class="text-[11px] font-bold text-slate-700 space-y-1.5">
                <a :href="'mailto:' + (cmsData.contact ? cmsData.contact.email : 'info@gelanlasalim.com')" class="block hover:text-[#1EAE4C]">
                  {{ cmsData.contact ? cmsData.contact.email : 'info@gelanlasalim.com' }}
                </a>
                <a :href="'mailto:' + (cmsData.contact ? cmsData.contact.kep : 'gelanlasalim@hs01.kep.tr')" class="block hover:text-[#1EAE4C] font-mono text-[10px]">
                  {{ cmsData.contact ? cmsData.contact.kep : 'gelanlasalim@hs01.kep.tr' }}
                </a>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">DESTEK SAATLERİ</h4>
              <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                {{ cmsData.contact ? cmsData.contact.workHoursWeekdays : 'Pazartesi - Cuma: 09:00 - 18:00' }} <br />
                {{ cmsData.contact ? cmsData.contact.workHoursSaturday : 'Cumartesi: 10:00 - 14:00' }}
              </p>
            </div>
          </div>

        </div>

        <hr class="border-slate-200 my-10" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-black uppercase tracking-wider">
          <div>© 2026 GelAnlaşalım. Tüm Hakları Saklıdır.</div>
          <div class="flex gap-4">
            <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-blue-600 transition-colors">KVKK Metni</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-600 transition-colors">Kullanım Koşulları</NuxtLink>
            <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-600 transition-colors">Gizlilik Politikası</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
