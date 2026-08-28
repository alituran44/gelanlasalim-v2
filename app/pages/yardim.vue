<script setup lang="ts">
import { ref } from 'vue'
import { HelpCircle, Search, ChevronDown, Mail, Phone, Play, BookOpen, Sparkles, Zap, TrendingDown, ShieldCheck, Layers } from 'lucide-vue-next'
import VideoGuideModal from '~/components/common/VideoGuideModal.vue'

definePageMeta({
  layout: "public"
})

const searchQuery = ref('')
const openFaq = ref<number | null>(0)
const showVideoModal = ref(false)
const selectedVideoId = ref('intro-3min')

function playVideo(id: string) {
  selectedVideoId.value = id
  showVideoModal.value = true
}

const faqs = [
  { q: "İhaleciBurada.com B2B İhale Platformu nedir?", a: "İhaleciBurada.com, kurumsal alıcılar ile doğrulanmış tedarikçileri canlı tersine ihale (eksiltme) arenasında buluşturan dijital satın alma platformudur." },
  { q: "Ödeme altyapınız güvenli mi? Hangi yöntemler destekleniyor?", a: "Ödemeleriniz TCMB ve BDDK lisanslı ödeme kuruluşları (PayTR ve iyzico) güvencesiyle 256-Bit SSL şifrelemeli 3D Secure protokolü üzerinden gerçekleşir. Troy, Visa, MasterCard, American Express ve kurumsal banka havalesi desteklenmektedir. Kart bilgileriniz asla sunucularımızda saklanmaz." },
  { q: "Abonelik iptali ve iade koşulları nelerdir?", a: "B2B dijital SaaS platformumuzda satın alınan paketler anında aktive edilir. Mükerrer çekimlerde 24 saatte kesintisiz iade yapılır. Henüz sisteme giriş yapmamış veya aktif ihale başlatmamış hesaplar için 14 gün içinde yazılı başvuru ile iade talebi oluşturulabilir. İadeler kredi kartına 3-7 iş günü, banka hesabına 1-3 iş gününde yansır." },
  { q: "E-Faturam ne zaman düzenlenir?", a: "Ödemenizin tamamlanmasını takiben faturanız beyan ettiğiniz şirket unvanı, vergi dairesi ve VKN/TCKN bilgileriyle 213 sayılı VUK uyarınca en geç 7 iş günü içinde e-Fatura/e-Arşiv olarak düzenlenip kurumsal e-posta adresinize iletilir." },
  { q: "Tersine ihale (ihale ve satın alma) sistemi nasıl çalışır?", a: "Alıcı firma satın almak istediği ürün veya hizmet için şartname ve bütçesini belirler. Tedarikçiler canlı sürede teklif vererek fiyat eksiltir; en uygun teklif sahibi ihaleyi kazanır." },
  { q: "Firmaların doğrulanması ve güvenliği nasıl sağlanır?", a: "Platforma üye olan her şirketin vergi kimlik numarası, MERSİS bilgileri ve kurumsal belgeleri kontrol edilerek 'Onaylı Üye' rozeti tanımlanır." },
  { q: "Alıcı olarak üyelik komisyonu ödemem gerekiyor mu?", a: "Hayır. İhaleciBurada platformunda alıcı şirketler için üyelik ve ihale açma süreçleri lansmana özel tamamen ücretsizdir." }
]

const videoCards = [
  {
    id: 'intro-3min',
    title: '3 Dakikada İhaleciBurada Tanıtımı',
    desc: 'Ters ihale modeli, ihale ve satın alma kuralları ve tedarik tasarrufu sağlama.',
    duration: '03:15',
    badge: 'GENEL TANITIM',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles
  },
  {
    id: 'ihale-acma',
    title: 'İhale Nasıl Açılır & Şartname Yükleme',
    desc: 'Sıfırdan ihale oluşturma, malzeme kalemi tanımlama ve fotoğraf ekleme.',
    duration: '02:40',
    badge: 'ALICI REHBERİ',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    icon: Zap
  },
  {
    id: 'teklif-verme',
    title: 'Nasıl Teklif Verilir & İhale ve Satın Alma',
    desc: 'Tedarikçi olarak ihaleye katılma, birim fiyat girme ve anlık fiyat kırma.',
    duration: '02:50',
    badge: 'TEDARİKÇİ REHBERİ',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    icon: TrendingDown
  },
  {
    id: 'kyc-dogrulama',
    title: 'Firma Doğrulama (KYC) & MERSİS Onayı',
    desc: 'Vergi levhası doğrulama, e-Devlet entegrasyonu ve Onaylı Rozet alma.',
    duration: '02:15',
    badge: 'GÜVENLİK & ONAY',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    icon: ShieldCheck
  },
  {
    id: 'erp-entegrasyon',
    title: 'SAP, Logo & Excel Entegrasyonu',
    desc: 'ERP sistemlerinden satın alma taleplerini otomatik ihaleye dönüştürme.',
    duration: '02:30',
    badge: 'ERP & EXCEL',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    icon: Layers
  }
]
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto text-left space-y-10 py-12">
    
    <!-- Top Header -->
    <div class="border-b pb-6" style="border-color: #F1F5F9;">
      <h1 class="text-3xl font-black text-slate-800 flex items-center gap-3" style="color: #0F172A;">
        <HelpCircle class="text-blue-600" :size="28" />
        Rehber & Yardım Merkezi
      </h1>
      <p class="text-xs text-slate-500 mt-2">Platform kullanımı, ihale kuralları ve destek hizmetleri hakkında merak edilen tüm yanıtlar ve görüntülü eğitim videoları.</p>
    </div>

    <!-- Search -->
    <div class="relative max-w-2xl">
      <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Aramak istediğiniz konuyu veya soruyu yazın..."
        class="w-full rounded-xl border pl-11 pr-4 py-3 text-xs outline-none bg-white transition focus:border-blue-500 shadow-sm"
        style="border-color: #E2E8F0; color: #0F172A;"
      />
    </div>

    <!-- VIDEO REHBERLER BÖLÜMÜ -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            GÖRSEL & VİDEO EĞİTİMLER
          </span>
          <h2 class="text-lg font-black text-slate-800 mt-1">Platform Kullanım Videoları</h2>
        </div>
        <button
          @click="playVideo('intro-3min')"
          class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <Play :size="13" class="fill-blue-600" />
          <span>Tümünü İzle</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="video in videoCards"
          :key="video.id"
          @click="playVideo(video.id)"
          class="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div class="relative aspect-video w-full overflow-hidden bg-slate-800">
            <img :src="video.thumbnail" :alt="video.title" class="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
            <div class="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg group-hover:scale-110 transition">
                <Play :size="16" class="fill-white translate-x-0.5" />
              </div>
            </div>
            <span class="absolute bottom-2 right-2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
              {{ video.duration }}
            </span>
          </div>

          <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[8px] font-black uppercase text-blue-600 block">{{ video.badge }}</span>
              <h3 class="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                {{ video.title }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {{ video.desc }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
              <span>Simülasyonu İzle</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
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
        <a href="mailto:ihalcib@gmail.com" class="px-5 py-2.5 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm">
          <Mail :size="14" /> E-posta Gönder
        </a>
      </div>
    </div>

    <!-- Video Modal -->
    <VideoGuideModal
      v-model="showVideoModal"
      :initial-video-id="selectedVideoId"
    />

  </div>
</template>

