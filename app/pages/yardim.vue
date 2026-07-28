<script setup lang="ts">
import { ref } from 'vue'
import { HelpCircle, Search, ChevronDown, Mail, Phone } from 'lucide-vue-next'

definePageMeta({
  layout: "public"
})

const searchQuery = ref('')
const openFaq = ref<number | null>(0)

const faqs = [
  { q: "GelAnlaşalım.com B2B İhale Platformu nedir?", a: "GelAnlaşalım.com, kurumsal alıcılar ile doğrulanmış tedarikçileri canlı tersine ihale (eksiltme) arenasında buluşturan dijital satın alma platformudur." },
  { q: "Tersine ihale (canlı eksiltme) sistemi nasıl çalışır?", a: "Alıcı firma satın almak istediği ürün veya hizmet için şartname ve bütçesini belirler. Tedarikçiler canlı sürede teklif vererek fiyat eksiltir; en uygun teklif sahibi ihaleyi kazanır." },
  { q: "Firmaların doğrulanması ve güvenliği nasıl sağlanır?", a: "Platforma üye olan her şirketin vergi kimlik numarası, MERSİS/KEP adresleri ve kurumsal belgeleri kontrol edilerek 'Onaylı Üye' rozeti tanımlanır." },
  { q: "Alıcı olarak üyelik komisyonu ödemem gerekiyor mu?", a: "Hayır. GelAnlaşalım platformunda alıcı şirketler için üyelik ve ihale açma süreçleri tamamen ücretsizdir." }
]
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto text-left space-y-8 py-12">
    
    <!-- Top Header -->
    <div class="border-b pb-6" style="border-color: #F1F5F9;">
      <h1 class="text-3xl font-black text-slate-800 flex items-center gap-3" style="color: #0F172A;">
        <HelpCircle class="text-blue-600" :size="28" />
        Rehber & Yardım Merkezi
      </h1>
      <p class="text-xs text-slate-500 mt-2">Platform kullanımı, ihale kuralları ve destek hizmetleri hakkında merak edilen tüm yanıtlar.</p>
    </div>

    <!-- Search -->
    <div class="relative max-w-2xl">
      <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Aramak istediğiniz soruyu yazın..."
        class="w-full rounded-xl border pl-11 pr-4 py-3 text-xs outline-none bg-white transition focus:border-blue-500 shadow-sm"
        style="border-color: #E2E8F0; color: #0F172A;"
      />
    </div>

    <!-- FAQ Accordions -->
    <div class="space-y-4 pt-4">
      <h2 class="text-lg font-bold text-slate-800">Sıkça Sorulan Sorular</h2>
      <div v-for="(faq, idx) in faqs" :key="idx" class="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
        <button @click="openFaq = openFaq === idx ? null : idx" class="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-xs sm:text-sm">
          <span>{{ faq.q }}</span>
          <ChevronDown :size="16" class="transition-transform text-slate-400" :class="{ 'rotate-180': openFaq === idx }" />
        </button>
        <div v-show="openFaq === idx" class="p-5 border-t border-slate-100 bg-slate-50/50 text-xs leading-relaxed text-slate-600">
          {{ faq.a }}
        </div>
      </div>
    </div>

    <!-- Contact Support Box -->
    <div class="rounded-2xl border bg-blue-50/50 p-8 border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 class="text-sm font-bold text-blue-900 uppercase tracking-wider">Aramakta olduğunuz soruyu bulamadınız mı?</h3>
        <p class="text-xs text-blue-700 mt-1">Destek ekibimiz 7/24 sorularınızı yanıtlamaktan memnuniyet duyar.</p>
      </div>
      <div class="flex gap-3 shrink-0">
        <a href="mailto:destek@gelanlasalim.com" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-2">
          <Mail :size="14" /> E-posta Gönder
        </a>
      </div>
    </div>

  </div>
</template>
