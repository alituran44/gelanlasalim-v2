<script setup lang="ts">
import { ref } from 'vue'
import { Handshake, Menu, X, ArrowRight, Mail, Phone, MapPin } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all">
      <div class="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-95 transition-opacity">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Handshake :size="22" />
          </div>
          <div>
            <div class="text-xl font-black tracking-tight leading-none text-slate-900">
              Gel<span class="text-blue-600">Anlaşalım</span>
            </div>
            <div class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 mt-1">
              İhale & Tedarik Arenası
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/50 p-1">
          <a href="#nasil-calisir" class="rounded-full px-5 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-all">
            Nasıl Çalışır?
          </a>
          <a href="#ihale-gezgini" class="rounded-full px-5 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-all">
            İhale Gezgini
          </a>
          <a href="#sss" class="rounded-full px-5 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 transition-all">
            Sıkça Sorulanlar
          </a>
        </nav>

        <!-- CTA Buttons -->
        <div class="hidden lg:flex items-center gap-3">
          <NuxtLink to="/uyelik" class="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
            Giriş Yap
          </NuxtLink>
          <NuxtLink to="/uyelik" class="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-600/10 hover:bg-blue-700 hover:shadow-blue-600/20 transition-all">
            İhale Oluştur
            <ArrowRight :size="14" />
          </NuxtLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="lg:hidden p-2 text-slate-600 hover:text-slate-900" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu Toggle">
          <X :size="22" v-if="mobileMenuOpen" />
          <Menu :size="22" v-else />
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="border-t border-slate-200 bg-white p-6 lg:hidden shadow-xl">
          <div class="flex flex-col gap-4 font-bold text-sm text-slate-700">
            <a href="#nasil-calisir" @click="mobileMenuOpen = false" class="hover:text-blue-600 py-1">Nasıl Çalışır?</a>
            <a href="#ihale-gezgini" @click="mobileMenuOpen = false" class="hover:text-blue-600 py-1">İhale Gezgini</a>
            <a href="#sss" @click="mobileMenuOpen = false" class="hover:text-blue-600 py-1">Sıkça Sorulanlar</a>
            <hr class="border-slate-100" />
            <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="hover:text-blue-600 py-1">Giriş Yap / Kayıt Ol</NuxtLink>
            <NuxtLink to="/uyelik" @click="mobileMenuOpen = false" class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 p-3 text-white">
              İhale Oluştur <ArrowRight :size="14" />
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
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/10">
                <Handshake :size="20" />
              </div>
              <div>
                <span class="text-lg font-black text-slate-900 tracking-tight leading-none">GelAnlaşalım</span>
                <span class="block text-[8px] font-black uppercase text-slate-400 mt-1 tracking-wider">B2B TERS İHALE PLATFORMU</span>
              </div>
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
              <a href="#" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all text-xs font-bold">F</a>
              <a href="#" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all text-xs font-bold">I</a>
              <a href="#" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all text-xs font-bold">L</a>
              <a href="#" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all text-xs font-bold">T</a>
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
              <a href="#" class="hover:text-blue-600 transition-colors">Hakkımızda</a>
              <a href="#" class="hover:text-blue-600 transition-colors">Kariyer</a>
              <a href="#" class="hover:text-blue-600 transition-colors">Blog</a>
              <a href="#" class="hover:text-blue-600 transition-colors">Basın Odası</a>
              <a href="#sss" class="hover:text-blue-600 transition-colors">İletişim</a>
              <a href="#" class="hover:text-blue-600 transition-colors">İş Ortaklığı Programı</a>
            </div>
          </div>

          <!-- Column 4: Contact details -->
          <div class="md:col-span-4 flex flex-col gap-5 text-left">
            <div class="space-y-3">
              <h4 class="text-[10px] font-black uppercase text-blue-600 tracking-wider">İLETİŞİM</h4>
              <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
                Bahçelievler Mahallesi 5083 Sokak, No:11/A Altıeylül,<br />
                Balıkesir, Türkiye
              </p>
              <div class="text-[11px] font-bold text-slate-700 space-y-1.5">
                <a href="mailto:info@gelanlasalim.com" class="block hover:text-blue-600">info@gelanlasalim.com</a>
                <a href="#" class="block hover:text-blue-600 font-mono text-[10px]">gelanlasalim@hs01.kep.tr</a>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-[9px] font-black uppercase text-slate-400 tracking-wider">DESTEK SAATLERİ</h4>
              <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
                Pazartesi - Cuma: 09:00 - 18:00 <br />
                Cumartesi: 10:00 - 14:00
              </p>
            </div>
          </div>

        </div>

        <hr class="border-slate-200 my-10" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-black uppercase tracking-wider">
          <div>© 2026 GelAnlaşalım. Tüm Hakları Saklıdır.</div>
          <div class="flex gap-4">
            <a href="#" class="hover:text-blue-600 transition-colors">KVKK Metni</a>
            <a href="#" class="hover:text-blue-600 transition-colors">Kullanım Koşulları</a>
            <a href="#" class="hover:text-blue-600 transition-colors">Gizlilik Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
