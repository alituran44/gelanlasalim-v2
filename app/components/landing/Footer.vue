<script setup lang="ts">
import { ref } from 'vue'
import { Facebook, Instagram, Linkedin, Mail, CheckCircle2, ArrowRight } from 'lucide-vue-next'
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
const legalLinks = [
  { label: "Kullanım Şartları (MSA)", to: "/sozlesmeler?tab=kullanim" },
  { label: "Ön Bilgilendirme Formu", to: "/sozlesmeler?tab=on-bilgilendirme" },
  { label: "Mesafeli Satış & Abonelik", to: "/sozlesmeler?tab=mesafeli-satis" },
  { label: "İptal ve İade Koşulları", to: "/sozlesmeler?tab=iptal-iade" },
  { label: "Teslimat ve Dijital İfa", to: "/sozlesmeler?tab=teslimat" },
  { label: "Gizlilik & Ticari Sır", to: "/sozlesmeler?tab=gizlilik" },
  { label: "KVKK Aydınlatma & DPA", to: "/sozlesmeler?tab=kvkk" },
  { label: "Canlı Eksiltme Kuralları", to: "/sozlesmeler?tab=ihale-kurallari" },
  { label: "Çerez Politikası", to: "/sozlesmeler?tab=cerezler" },
  { label: "Tedarikçi KYC & Uyum", to: "/sozlesmeler?tab=tedarikci-uyum" },
  { label: "SLA Taahhüdü (%99.9)", to: "/sozlesmeler?tab=sla" },
  { label: "Bilgi Güvenliği (ISO 27001)", to: "/sozlesmeler?tab=bilgi-guvenligi" },
  { label: "Escrow Güvenli Havuz", to: "/sozlesmeler?tab=escrow" }
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

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- Column 1: Brand Info (md:col-span-3) -->
        <div class="md:col-span-3 flex flex-col gap-4 text-left">
          <div class="flex items-center gap-2.5">
            <NuxtLink to="/" class="inline-block hover:opacity-95 transition">
              <img src="/logo.png" alt="İhaleciBurada.com B2B Platformu Logo" class="h-10 sm:h-12 w-auto object-contain drop-shadow-xs" />
            </NuxtLink>
          </div>
          
          <p class="text-xs leading-relaxed font-medium text-slate-500 max-w-sm">
            B2B satın alma taleplerini, tedarikçi tekliflerini ve karar kayıtlarını tek ters ihale akışında yöneten kurumsal platform.
          </p>

          <!-- Status badges -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[8.5px] font-black text-blue-700 uppercase tracking-wider">
              <span class="h-1 w-1 rounded-full bg-blue-600"></span>
              KVKK KAPSAMINDA
            </span>
            <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[8.5px] font-black text-blue-700 uppercase tracking-wider">
              <span class="h-1 w-1 rounded-full bg-blue-600"></span>
              TLS 1.3 ŞİFRELİ
            </span>
            <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[8.5px] font-black text-emerald-700 uppercase tracking-wider">
              <span class="h-1 w-1 rounded-full bg-emerald-600"></span>
              TCMB ESCROW
            </span>
          </div>

          <!-- Social Links -->
          <div class="flex gap-2 mt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Facebook :size="13" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Instagram :size="13" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
              <Linkedin :size="13" />
            </a>
          </div>
        </div>

        <!-- Column 2: Platform Links (md:col-span-2) -->
        <div class="md:col-span-2 flex flex-col gap-3 text-left">
          <h4 class="text-xs font-black uppercase text-blue-900 tracking-wider">PLATFORM</h4>
          <div class="flex flex-col gap-2 text-xs font-bold text-slate-700">
            <NuxtLink v-for="item in platformLinks" :key="item.to" :to="item.to" class="hover:text-blue-600 transition-colors">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Column 3: Company Links (md:col-span-2) -->
        <div class="md:col-span-2 flex flex-col gap-3 text-left">
          <h4 class="text-xs font-black uppercase text-blue-900 tracking-wider">ŞİRKET</h4>
          <div class="flex flex-col gap-2 text-xs font-bold text-slate-700">
            <NuxtLink v-for="item in companyLinks" :key="item.to" :to="item.to" class="hover:text-blue-600 transition-colors">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Column 4: Legal Contracts Links (md:col-span-3) -->
        <div class="md:col-span-3 flex flex-col gap-3 text-left">
          <h4 class="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1">
            <span>HUKUKİ & SÖZLEŞMELER</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">13 Tab</span>
          </h4>
          <div class="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700">
            <NuxtLink v-for="item in legalLinks" :key="item.to" :to="item.to" class="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <span class="text-blue-600 text-[10px]">▪</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Column 5: Contact & Support Hours (md:col-span-2) -->
        <div class="md:col-span-2 flex flex-col gap-4 text-left">
          <div class="space-y-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-blue-900">ŞİRKET BİLGİLERİ</h4>
            <p class="text-[10px] leading-relaxed text-slate-600 font-medium">
              <strong class="text-slate-900 block">İhaleciBurada Platform A.Ş.</strong>
              İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale<br />
              <span class="text-slate-500">Çanakkale V.D. / VKN: 4700854210</span><br />
              <span class="text-slate-500 font-mono">MERSİS: 0470085421000001</span><br />
              <span class="text-slate-500">KEP: ihaleciburada@hs01.kep.tr</span>
            </p>
            <div class="text-xs font-bold text-slate-700 space-y-1 pt-1">
              <a href="mailto:ihalecib@gmail.com" class="block hover:text-blue-600 transition-colors">
                ihalecib@gmail.com
              </a>
              <div class="text-[#FF5938] font-bold">
                📞 0850 308 00 00
              </div>
            </div>
          </div>

          <div class="space-y-1 pt-1">
            <h4 class="text-xs font-black uppercase tracking-wider text-blue-900">DESTEK SAATLERİ</h4>
            <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
              Hafta İçi: 09:00 - 18:00 <br />
              Cumartesi: 10:00 - 14:00
            </p>
          </div>
        </div>

      </div>

      <!-- Payment Gateways & Brand Seals -->
      <div class="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div class="text-slate-500 font-medium text-[11px] flex items-center gap-2">
          <span class="text-emerald-600 font-bold">✓ PayTR & iyzico 3D Secure</span>
          <span>•</span>
          <span>TCMB & BDDK Lisanslı Güvenli Ödeme Altyapısı</span>
        </div>
        <PaymentBadges />
      </div>

      <hr class="border-slate-200 my-8" />

      <!-- Bottom Legal Ribbon -->
      <div class="flex flex-col lg:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-medium tracking-wide">
        <div>© 2026 İhaleciBurada.com. Tüm Hakları Saklıdır.</div>
        <div class="flex flex-wrap gap-x-4 gap-y-2 justify-center lg:justify-end">
          <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="hover:text-blue-600 transition-colors font-bold text-amber-600">Ön Bilgilendirme Formu</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="hover:text-blue-600 transition-colors font-bold text-blue-700">Mesafeli Satış</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="hover:text-blue-600 transition-colors font-bold text-emerald-600">İptal ve İade</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=teslimat" class="hover:text-blue-600 transition-colors">Teslimat</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=kullanim" class="hover:text-blue-600 transition-colors">Kullanım Koşulları</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=gizlilik" class="hover:text-blue-600 transition-colors">Gizlilik</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=kvkk" class="hover:text-blue-600 transition-colors">KVKK</NuxtLink>
          <span class="text-slate-300">•</span>
          <NuxtLink to="/sozlesmeler?tab=escrow" class="hover:text-blue-600 transition-colors">Escrow</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>