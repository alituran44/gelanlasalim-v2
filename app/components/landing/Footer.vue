<script setup lang="ts">
import { ref } from 'vue'
import { Facebook, Instagram, Linkedin, Mail, CheckCircle2, ArrowRight } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

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
  { label: "Video Rehberler & Akademi", to: "/videolar" },
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
  <footer class="w-full bg-white border-t border-slate-200/80 pt-12 pb-12">
    <div class="mx-auto max-w-7xl px-6">
      
      <!-- Newsletter / E-Posta Abonelik Banner -->
      <div class="mb-12 rounded-3xl bg-gradient-to-r from-[#0F223D] via-blue-950 to-slate-900 p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-left">
        <div class="space-y-1.5 max-w-xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
            <Mail :size="12" />
            <span>B2B İHALE VE TASARRUF BÜLTENİ</span>
          </div>
          <h3 class="text-lg sm:text-xl font-black text-white tracking-tight">
            Sektörünüzdeki Yeni İhaleleri E-Posta ile Kaçırmayın
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed font-medium">
            Haftalık canlı tersine eksiltme duyuruları, yeni alım ilanları ve kurumsal tedarik fırsatları anında posta kutunuza gelsin.
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

      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        <!-- Column 1: Brand Info -->
        <div class="md:col-span-4 flex flex-col gap-5 text-left">
          <div class="flex items-center gap-2.5">
            <img src="/logo.png" alt="İhaleciBurada.com B2B Platformu Logo" class="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-xs" />
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
              <a href="mailto:info@ihaleciburada.com" class="block hover:text-blue-600 transition-colors">
                info@ihaleciburada.com
              </a>
              <a href="mailto:ihaleciburada@hs01.kep.tr" class="block hover:text-blue-600 font-mono text-[11px] transition-colors">
                ihaleciburada@hs01.kep.tr
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
        <div>© 2026 İhaleciBurada. Tüm Hakları Saklıdır.</div>
        <div class="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end">
          <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-blue-600 transition-colors">KVKK Metni</NuxtLink>
          <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-600 transition-colors">Kullanım Koşulları</NuxtLink>
          <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-600 transition-colors">Gizlilik Politikası</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>