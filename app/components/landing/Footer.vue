<script setup lang="ts">
import { Facebook, Instagram, Linkedin } from 'lucide-vue-next'

const platformLinks = [
  { label: "Nasıl Çalışır", to: "/#nasil-calisir" },
  { label: "Özellikler", to: "/#ihale-gezgini" },
  { label: "Abonelik Paketleri", to: "/abonelik" },
  { label: "Pazar Yeri", to: "/pazar-yeri" },
  { label: "Entegrasyonlar", to: "/entegrasyonlar" },
  { label: "Yardım Merkezi", to: "/yardim" }
]

const companyLinks = [
  { label: "Hakkımızda", to: "/sozlesmeler?tab=hakkimizda" },
  { label: "Kariyer", to: "/sozlesmeler?tab=kariyer" },
  { label: "Blog", to: "/sozlesmeler?tab=blog" },
  { label: "Basın Odası", to: "/sozlesmeler?tab=basin" },
  { label: "İletişim", to: "/yardim" },
  { label: "İş Ortaklığı Programı", to: "/sozlesmeler?tab=is-ortakligi" }
]
</script>

<template>
  <footer class="w-full bg-white border-t border-slate-200/80 pt-16 pb-12">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        <!-- Column 1: Brand Info -->
        <div class="md:col-span-4 flex flex-col gap-5 text-left">
          <div class="flex items-center gap-2.5">
            <img src="/logo.png" alt="GelAnlaşalım B2B Platformu Logo" class="h-10 w-auto" />
          </div>
          
          <p class="text-xs leading-relaxed font-medium text-slate-500 max-w-sm">
            B2B satın alma taleplerini, tedarikçi tekliflerini ve karar kayıtlarını tek ters ihale akışında yöneten kurumsal platform.
          </p>

          <!-- Status badges -->
          <div class="flex flex-wrap gap-2 pt-1">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wider">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              KVKK KAPSAMINDA
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[9px] font-black text-blue-700 uppercase tracking-wider">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              HTTPS/TLS ŞİFRELİ
            </span>
          </div>

          <!-- Social Links -->
          <div class="flex gap-2.5 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Facebook :size="14" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Instagram :size="14" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Linkedin :size="14" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Platform Links -->
        <div class="md:col-span-2 flex flex-col gap-4 text-left">
          <h4 class="text-xs font-black uppercase text-blue-900 tracking-wider">PLATFORM</h4>
          <div class="flex flex-col gap-3 text-xs font-bold text-slate-700">
            <NuxtLink v-for="item in platformLinks" :key="item.to" :to="item.to" class="hover:text-blue-600 transition-colors">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Column 3: Company Links -->
        <div class="md:col-span-2 flex flex-col gap-4 text-left">
          <h4 class="text-xs font-black uppercase text-blue-900 tracking-wider">ŞİRKET</h4>
          <div class="flex flex-col gap-3 text-xs font-bold text-slate-700">
            <NuxtLink v-for="item in companyLinks" :key="item.to" :to="item.to" class="hover:text-blue-600 transition-colors">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Column 4: Contact & Support Hours -->
        <div class="md:col-span-4 flex flex-col gap-5 text-left">
          <div class="space-y-3">
            <h4 class="text-xs font-black uppercase tracking-wider text-blue-900">İLETİŞİM</h4>
            <p class="text-xs leading-relaxed text-slate-500 font-medium whitespace-pre-line">
              Bahçelievler Mahallesi 5083 Sokak, No:11/A Altıeylül,
              Balıkesir, Türkiye
            </p>
            <div class="text-xs font-bold text-slate-700 space-y-1.5 pt-1">
              <a href="mailto:info@gelanlasalim.com" class="block hover:text-blue-600 transition-colors">
                info@gelanlasalim.com
              </a>
              <a href="mailto:gelanlasalim@hs01.kep.tr" class="block hover:text-blue-600 font-mono text-[11px] transition-colors">
                gelanlasalim@hs01.kep.tr
              </a>
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <h4 class="text-xs font-black uppercase tracking-wider text-blue-900">DESTEK SAATLERİ</h4>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              Pazartesi - Cuma: 09:00 - 18:00 <br />
              Cumartesi: 10:00 - 14:00
            </p>
          </div>
        </div>

      </div>

      <hr class="border-slate-200 my-10" />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        <div>© 2026 GelAnlaşalım. Tüm Hakları Saklıdır.</div>
        <div class="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end">
          <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-blue-600 transition-colors">KVKK Metni</NuxtLink>
          <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-600 transition-colors">Kullanım Koşulları</NuxtLink>
          <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-600 transition-colors">Gizlilik Politikası</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>