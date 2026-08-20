<script setup lang="ts">
import { ref } from 'vue'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink,
  MessageSquare,
  Clock,
  Phone,
  CheckSquare,
  Square,
  AlertCircle,
  Play,
  BookOpen,
  Sparkles
} from 'lucide-vue-next'
import VideoGuideModal from '~/components/common/VideoGuideModal.vue'

definePageMeta({
  layout: "dashboard"
})

const searchQuery = ref('')
const activeCategory = ref<'tumu' | 'genel' | 'ihale' | 'segment' | 'uyelik' | 'guven'>('tumu')

const openFaq = ref<number | null>(0)
const showVideoModal = ref(false)
const selectedVideoId = ref('intro-3min')

function openVideoGuide(id: string) {
  selectedVideoId.value = id
  showVideoModal.value = true
}

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

// Support Form State
const supportSubject = ref('İhale ve Teklifler')
const supportEmail = ref('alituran88@gmail.com')
const supportMessage = ref('')
const kvkkAccepted1 = ref(false)
const kvkkAccepted2 = ref(false)
const isSubmitted = ref(false)

function submitSupport() {
  if (supportMessage.value.length >= 10 && kvkkAccepted1.value) {
    isSubmitted.value = true
    setTimeout(() => {
      isSubmitted.value = false
      supportMessage.value = ''
    }, 3000)
  }
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800 flex items-center gap-2" style="color: #0F172A;">
          <HelpCircle class="text-blue-600" :size="22" />
          Yardım Merkezi
        </h1>
        <p class="text-xs text-slate-500 mt-1">Sık sorulan sorular ve destek talebi oluşturma.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          type="button"
          @click="openVideoGuide('intro-3min')"
          class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 shadow transition cursor-pointer"
        >
          <Play :size="13" class="fill-white" />
          <span>Video Rehberler</span>
        </button>

        <button 
          type="button"
          @click="openFaq = null"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow transition self-start sm:self-auto cursor-pointer"
        >
          Destek Talebi Oluştur →
        </button>
      </div>
    </div>

    <!-- Video Tutorials Fast Strip -->
    <div class="bg-slate-900 rounded-3xl p-6 text-white space-y-4 border border-slate-800 shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">▶</span>
          <h3 class="text-sm font-bold">Görüntülü Kullanım ve Süreç Rehberleri</h3>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">5 Adımlı İnteraktif Akademi</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          @click="openVideoGuide('intro-3min')"
          class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500 text-left transition flex items-start gap-3 group cursor-pointer"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
            <Play :size="12" class="fill-current" />
          </div>
          <div>
            <div class="text-[9px] font-black uppercase text-blue-400">3 DAKİKADA TANITIM</div>
            <div class="text-xs font-bold text-slate-200 mt-0.5 group-hover:text-white">Nasıl Çalışır & Tasarruf?</div>
          </div>
        </button>

        <button
          type="button"
          @click="openVideoGuide('ihale-acma')"
          class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500 text-left transition flex items-start gap-3 group cursor-pointer"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
            <Play :size="12" class="fill-current" />
          </div>
          <div>
            <div class="text-[9px] font-black uppercase text-blue-400">ALICI REHBERİ</div>
            <div class="text-xs font-bold text-slate-200 mt-0.5 group-hover:text-white">İhale Açma & Şartname</div>
          </div>
        </button>

        <button
          type="button"
          @click="openVideoGuide('teklif-verme')"
          class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500 text-left transition flex items-start gap-3 group cursor-pointer"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
            <Play :size="12" class="fill-current" />
          </div>
          <div>
            <div class="text-[9px] font-black uppercase text-blue-400">TEDARİKÇİ REHBERİ</div>
            <div class="text-xs font-bold text-slate-200 mt-0.5 group-hover:text-white">Teklif Verme & Eksiltme</div>
          </div>
        </button>

        <button
          type="button"
          @click="openVideoGuide('kyc-dogrulama')"
          class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500 text-left transition flex items-start gap-3 group cursor-pointer"
        >
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
            <Play :size="12" class="fill-current" />
          </div>
          <div>
            <div class="text-[9px] font-black uppercase text-blue-400">GÜVENLİK & ONAY</div>
            <div class="text-xs font-bold text-slate-200 mt-0.5 group-hover:text-white">e-Devlet & MERSİS KYC</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column: Search & FAQ Accordions (2 Columns) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Search and Categories -->
        <div class="space-y-4">
          <div class="relative">
            <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Soru, süreç aratın, genel konulara göre hızlı ulaşın..."
              class="w-full rounded-xl border pl-9 pr-4 py-3 text-xs outline-none bg-white transition focus:border-blue-500 shadow-sm"
              style="border-color: #E2E8F0; color: #0F172A;"
            />
          </div>

          <!-- Category selectors grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button 
              v-for="cat in [
                { id: 'tumu', label: 'Tümü', count: 24 },
                { id: 'genel', label: 'Genel', count: 4 },
                { id: 'ihale', label: 'İhale Süreci', count: 10 },
                { id: 'segment', label: 'Segmentler', count: 3 },
                { id: 'uyelik', label: 'Üyelik & Belgeler', count: 4 },
                { id: 'guven', label: 'Güven & Ticaret', count: 3 }
              ]"
              :key="cat.id"
              type="button"
              @click="activeCategory = cat.id as any"
              class="rounded-xl border p-4 text-left transition relative"
              :class="activeCategory === cat.id 
                ? 'border-blue-600 bg-blue-50/10 text-blue-700 font-bold' 
                : 'border-slate-200 bg-white hover:bg-slate-50'"
            >
              <span class="text-xs block">{{ cat.label }}</span>
              <span class="text-[9px] text-slate-400 font-bold mt-1 block">Sorular: {{ cat.count }}</span>
            </button>
          </div>
        </div>

        <!-- FAQ Accordion items list -->
        <div class="space-y-3">
          
          <!-- Faq 0: İhaleciBurada nedir? -->
          <div class="rounded-xl border bg-white overflow-hidden transition" style="border-color: #E2E8F0;">
            <button 
              type="button"
              @click="toggleFaq(0)"
              class="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 text-left hover:bg-slate-50 transition"
            >
              <span class="flex items-center gap-2">
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">GENEL</span>
                İhaleciBurada nedir?
              </span>
              <ChevronUp v-if="openFaq === 0" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>

            <div v-if="openFaq === 0" class="p-4 border-t border-slate-100 space-y-4 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>İhaleciBurada,</strong> firmaların Ürün, Hizmet, Üretim ve proje bazlı sözleşmelerini platform üzerinden yönetebildiği kurumsal B2B ağdır. İhale açabilir, teklif verebilir, teklif verenlerle pazarlık yapabilir ve sevkiyat takip süreçlerini tamamlayabilirsiniz.
              </p>

              <div class="flex flex-wrap gap-2 text-[8px] font-black text-slate-400 uppercase">
                <span class="bg-slate-100 rounded px-1.5 py-0.5">platform</span>
                <span class="bg-slate-100 rounded px-1.5 py-0.5">üyelik</span>
                <span class="bg-slate-100 rounded px-1.5 py-0.5">genel</span>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-50 text-[10px] font-bold">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">Bu yanıt faydalı oldu mu?</span>
                  <button type="button" class="flex items-center gap-1 text-slate-600 hover:text-blue-600"><ThumbsUp :size="10" /> Evet (0)</button>
                  <button type="button" class="flex items-center gap-1 text-slate-600 hover:text-red-600"><ThumbsDown :size="10" /> Hayır (0)</button>
                </div>

                <button type="button" class="text-blue-600 flex items-center gap-1">Web yardımı ihtiyacım var <ExternalLink :size="10" /></button>
              </div>
            </div>
          </div>

          <!-- Faq 1: İhaleciBurada kimler için uygundur? -->
          <div class="rounded-xl border bg-white overflow-hidden transition" style="border-color: #E2E8F0;">
            <button 
              type="button"
              @click="toggleFaq(1)"
              class="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 text-left hover:bg-slate-50 transition"
            >
              <span class="flex items-center gap-2">
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">GENEL</span>
                İhaleciBurada kimler için uygundur?
              </span>
              <ChevronUp v-if="openFaq === 1" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>
            <div v-if="openFaq === 1" class="p-4 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
              Satın alma ekipleri, KOBİ'ler ve büyük ölçekli üreticiler için tasarlanmıştır. Tedarikçiler yeni ihalelere teklif vererek müşteri portföyünü büyütebilir, alıcılar ise maliyet düşürebilir.
            </div>
          </div>

          <!-- Faq 2: Hangi sektörler için kullanılabilir? -->
          <div class="rounded-xl border bg-white overflow-hidden transition" style="border-color: #E2E8F0;">
            <button 
              type="button"
              @click="toggleFaq(2)"
              class="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 text-left hover:bg-slate-50 transition"
            >
              <span class="flex items-center gap-2">
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">GENEL</span>
                Hangi sektörler için kullanılabilir?
              </span>
              <ChevronUp v-if="openFaq === 2" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>
            <div v-if="openFaq === 2" class="p-4 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
              İnşaat, kırtasiye, lojistik, hammadde imalatı, gıda, tekstil ve teknoloji başta olmak üzere tüm kurumsal satın alma gereksinimi duyan sektörlerde aktiftir.
            </div>
          </div>

          <!-- Faq 3: İhaleciBurada üzerinden satış yapmak güvenli mi? -->
          <div class="rounded-xl border bg-white overflow-hidden transition" style="border-color: #E2E8F0;">
            <button 
              type="button"
              @click="toggleFaq(3)"
              class="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 text-left hover:bg-slate-50 transition"
            >
              <span class="flex items-center gap-2">
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">GÜVEN & TİCARET</span>
                İhaleciBurada üzerinden satış yapmak güvenli mi?
              </span>
              <ChevronUp v-if="openFaq === 3" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>
            <div v-if="openFaq === 3" class="p-4 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
              Evet. Platforma dahil edilen tüm şirketlerin kurumsal kimlik ve MERSİS/vergi levhası kayıtları titizlikle denetlenmektedir.
            </div>
          </div>

          <!-- Faq 4: İhaleye nasıl teklif verilir? -->
          <div class="rounded-xl border bg-white overflow-hidden transition" style="border-color: #E2E8F0;">
            <button 
              type="button"
              @click="toggleFaq(4)"
              class="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 text-left hover:bg-slate-50 transition"
            >
              <span class="flex items-center gap-2">
                <span class="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">İHALE SÜRECİ</span>
                İhaleye nasıl teklif verilir?
              </span>
              <ChevronUp v-if="openFaq === 4" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>
            <div v-if="openFaq === 4" class="p-4 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
              Pazar yeri ekranından açık ihaleleri listeleyin, ilgilendiğiniz ihaleye tıklayarak fiyat teklifinizi ve varsa gerekli belgelerinizi sisteme yükleyin.
            </div>
          </div>

        </div>

      </div>

      <!-- Right Column: Support actions & Bize Yazın Form (1 Column) -->
      <div class="space-y-6">
        
        <!-- Hızlı İşlemler -->
        <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">HIZLI İŞLEMLER</h4>
          
          <button 
            type="button"
            @click="openFaq = null"
            class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 shadow-lg shadow-blue-500/20 transition"
          >
            Destek Talebi Aç
          </button>
          
          <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center">
            <Phone :size="12" />
            <span>Destek Hattı: Hafta içi 09:00 - 18:00</span>
          </div>
        </div>

        <!-- Bize Yazın Form (Screenshot 7 right style) -->
        <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-4" style="border-color: #E2E8F0;">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Bize yazın</h4>
            <p class="text-[10px] text-slate-400 mt-0.5">Sorunuzu veya sorununuza yakın olan konuyu seçin.</p>
          </div>

          <div class="space-y-3">
            <!-- Konu -->
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Konu</label>
              <select v-model="supportSubject" class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none" style="border-color: #E2E8F0;">
                <option value="İhale ve Teklifler">İhale ve Teklifler</option>
                <option value="Üyelik ve Ödemeler">Üyelik ve Ödemeler</option>
                <option value="Teknik Destek">Teknik Destek</option>
              </select>
            </div>

            <!-- E-posta -->
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">E-posta</label>
              <input v-model="supportEmail" type="email" class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none" style="border-color: #E2E8F0;" />
            </div>

            <!-- Mesajınız -->
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">Mesajınız</label>
              <textarea 
                v-model="supportMessage" 
                rows="3" 
                placeholder="Sorunuzu buraya yazın..."
                class="w-full rounded-xl border px-3 py-2 text-xs bg-white outline-none focus:border-blue-500 transition" 
                style="border-color: #E2E8F0;"
              ></textarea>
            </div>

            <!-- KVKK Checkbox 1 -->
            <label class="flex items-start gap-2 cursor-pointer text-[9px] text-slate-500 font-bold select-none leading-normal">
              <button 
                type="button" 
                @click="kvkkAccepted1 = !kvkkAccepted1"
                class="shrink-0 h-4.5 w-4.5 rounded border flex items-center justify-center"
                :class="kvkkAccepted1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'"
              >
                <Check v-if="kvkkAccepted1" :size="10" />
              </button>
              <span>KVKK bilgilendirmesini okudum ve kabul ediyorum.</span>
            </label>

            <!-- KVKK Checkbox 2 -->
            <label class="flex items-start gap-2 cursor-pointer text-[9px] text-slate-500 font-bold select-none leading-normal">
              <button 
                type="button" 
                @click="kvkkAccepted2 = !kvkkAccepted2"
                class="shrink-0 h-4.5 w-4.5 rounded border flex items-center justify-center"
                :class="kvkkAccepted2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200'"
              >
                <Check v-if="kvkkAccepted2" :size="10" />
              </button>
              <span>İletişim iznini onaylıyorum.</span>
            </label>

            <!-- Submit button -->
            <button 
              type="button" 
              @click="submitSupport"
              class="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 transition shadow"
            >
              Destek talebini gönder
            </button>
          </div>

          <div v-if="isSubmitted" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-xl mt-3 flex items-center gap-1.5">
            <CheckCircle2 :size="13" /> Destek talebiniz başarıyla gönderilmiştir.
          </div>
        </div>

        <!-- Durum & Duyurular -->
        <div class="rounded-2xl border bg-white p-5 shadow-sm space-y-3" style="border-color: #E2E8F0;">
          <h4 class="text-[10px] font-black uppercase tracking-wider text-slate-400">DURUM & DUYURULAR</h4>
          <span class="text-xs font-bold text-slate-700 block">Sistem Çalışma saati</span>
          <p class="text-[9px] text-slate-400 leading-normal bg-slate-50 p-3 border rounded-xl">
            Tüm B2B ihale ve teklif sistemleri şu anda aktif ve sorunsuz çalışmaktadır.
          </p>
        </div>

      </div>

    </div>

    <!-- Video Guide Modal -->
    <VideoGuideModal
      v-model="showVideoModal"
      :initial-video-id="selectedVideoId"
    />

  </div>
</template>
