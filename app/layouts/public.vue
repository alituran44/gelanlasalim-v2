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
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <!-- Column 1: Info -->
          <div class="md:col-span-5 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Handshake :size="20" />
              </div>
              <span class="text-lg font-black text-white tracking-tight">GelAnlaşalım</span>
            </div>
            <p class="text-xs leading-relaxed text-slate-400 max-w-sm">
              GelAnlaşalım, kurumsal satın alma ihtiyaçlarınızı canlı eksiltme arenasında rekabete açarak tedarik maliyetlerinizi düşüren modern B2B ihale platformudur.
            </p>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
              Mersis: 0850-222-33440001 • KEP: gelanlasalim@hs01.kep.tr
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="md:col-span-3 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-white tracking-widest">Hızlı Bağlantılar</h4>
            <div class="flex flex-col gap-2.5 text-xs">
              <a href="#nasil-calisir" class="hover:text-white transition-colors">Nasıl Çalışır?</a>
              <a href="#ihale-gezgini" class="hover:text-white transition-colors">İhale Gezgini</a>
              <a href="#sss" class="hover:text-white transition-colors">Sıkça Sorulanlar</a>
              <NuxtLink to="/uyelik" class="hover:text-white transition-colors">Üye Girişi / Kayıt Ol</NuxtLink>
            </div>
          </div>

          <!-- Column 3: Contact -->
          <div class="md:col-span-4 flex flex-col gap-4 text-left">
            <h4 class="text-xs font-black uppercase text-white tracking-widest">İletişim Bilgileri</h4>
            <div class="flex flex-col gap-3 text-xs">
              <div class="flex items-center gap-3">
                <Mail :size="14" class="text-blue-500 shrink-0" />
                <span>info@gelanlasalim.com</span>
              </div>
              <div class="flex items-center gap-3">
                <Phone :size="14" class="text-blue-500 shrink-0" />
                <span>+90 (555) 555 55 55</span>
              </div>
              <div class="flex items-start gap-3">
                <MapPin :size="14" class="text-blue-500 shrink-0 mt-0.5" />
                <span>İTÜ Teknokent, Sarıyer, İstanbul</span>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-slate-800 my-8 lg:my-10" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          <div>© 2026 GelAnlaşalım. Tüm Hakları Saklıdır.</div>
          <div class="flex gap-4">
            <a href="#" class="hover:text-slate-400 transition-colors">KVKK Metni</a>
            <a href="#" class="hover:text-slate-400 transition-colors">Kullanım Koşulları</a>
            <a href="#" class="hover:text-slate-400 transition-colors">Gizlilik Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
