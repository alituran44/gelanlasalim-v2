<script setup lang="ts">
import { ref, computed } from 'vue'
import { Inbox, Shield, ChevronDown, ChevronUp, Star, Clock, Building2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useCmsData } from '~/composables/useCmsData'
import { locale } from '~/composables/useLocale'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const expandedIlan = ref<string | null>(route.query.ilan as string || null)

const { cmsData } = useCmsData()

const ilanlar = computed(() => cmsData.value.dashboard.receivedBids || [])

function toggle(id: string) {
  expandedIlan.value = expandedIlan.value === id ? null : id
}

const showNegotiationModal = ref(false)
const selectedTeklifForNegotiation = ref<any>(null)
const currentIlanTitle = ref('')
const counterOfferPrice = ref('')
const counterOfferNotes = ref('')

function openNegotiation(teklif: any, ilan: any) {
  selectedTeklifForNegotiation.value = teklif
  currentIlanTitle.value = ilan.baslik
  counterOfferPrice.value = ''
  counterOfferNotes.value = 'Teklifinizi inceledik. Belirttiğimiz hedef fiyata çekilmesi durumunda ihale tarafınıza verilecektir.'
  showNegotiationModal.value = true
}

function submitCounterOffer() {
  if (!counterOfferPrice.value) {
    alert('Lütfen karşı teklif / hedef pazarlık tutarını giriniz.')
    return
  }
  if (selectedTeklifForNegotiation.value) {
    selectedTeklifForNegotiation.value.durum = 'pazarlik'
  }
  showNegotiationModal.value = false
  alert(`💬 PAZARLIK TEKLİFİNİZ İLETİLDİ!\n\n${selectedTeklifForNegotiation.value?.firma} firmasına ${Number(counterOfferPrice.value).toLocaleString('tr-TR')} ₺ tutarındaki karşı teklifiniz başarıyla gönderilmiştir.`)
}

function acceptTeklif(teklif: any) {
  teklif.durum = 'onaylandi'
  alert(`🎉 TEBRİKLER!\n\n${teklif.firma} firmasının teklifini kabul ettiniz. Sözleşme ve onay aşamasına geçilmiştir.`)
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto text-left space-y-6">

    <!-- Başlık + Gizlilik Notu -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-xl font-black text-slate-800 tracking-tight" style="color: #0F172A;">
          {{ 'Aldığım Teklifler (Gelen)' }}
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          {{ 'Açtığınız ihalelere tedarikçilerden gelen tüm teklifleri inceleyin ve pazarlık yapın' }}
        </p>
      </div>

      <!-- Kapalı Zarf Bilgi Bandı -->
      <div
        class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold shrink-0 self-start sm:self-auto"
        style="background: rgba(0,48,87,0.06); color: #003057; border: 1px solid rgba(0,48,87,0.12);"
      >
        <Shield :size="14" style="color: #1EAE4C;" />
        <span>{{ 'Kapalı Zarf — Teklifler Gizlidir' }}</span>
      </div>
    </div>

    <!-- Hızlı Geçiş Segment Sekmeleri -->
    <div class="flex items-center gap-2 p-1 bg-slate-200/70 rounded-2xl w-fit">
      <NuxtLink
        to="/panel/gelen-teklifler"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all bg-white text-[#003057]"
      >
        <Inbox :size="14" class="text-[#1EAE4C]" />
        <span>Aldığım Teklifler (Gelen)</span>
      </NuxtLink>
      <NuxtLink
        to="/panel/yaptigim-teklifler"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all"
      >
        <Send :size="14" class="text-slate-400" />
        <span>Verdiğim Teklifler (Yaptığım)</span>
      </NuxtLink>
    </div>

    <!-- İlan Grupları -->
    <div class="space-y-3">
      <div
        v-for="ilan in ilanlar"
        :key="ilan.id"
        class="rounded-2xl border bg-white overflow-hidden shadow-xs"
        style="border-color: #E2E8F0;"
      >
        <!-- İlan Başlık Satırı -->
        <button
          @click="toggle(ilan.id)"
          class="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50/80 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style="background: rgba(30,58,95,0.06);"
            >
              <Inbox :size="18" style="color: #1E3A5F;" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-800">{{ ilan.baslik }}</h3>
              <p class="text-xs text-slate-400 mt-0.5 font-medium">
                {{ ilan.kategori }} • {{ 'Bitiş:' }} {{ ilan.bitis }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              style="background: rgba(245,158,11,0.1); color: #D97706;"
            >
              {{ ilan.teklifler.length }} {{ 'Teklif' }}
            </span>
            <ChevronDown v-if="expandedIlan !== ilan.id" :size="18" style="color: #94A3B8;" />
            <ChevronUp v-else :size="18" style="color: #94A3B8;" />
          </div>
        </button>

        <!-- Teklif Detayları (sadece ilan sahibine açık) -->
        <div v-if="expandedIlan === ilan.id" class="border-t" style="border-color: #F1F5F9;">
          <div class="px-5 py-3" style="background: #FFFBEB;">
            <div class="flex items-center gap-2 text-xs font-bold" style="color: #92400E;">
              <Shield :size="13" />
              <span>
                {{ 'Bu teklifler gizlidir. Tedarikçiler birbirlerinin tekliflerini göremez.' 
                }}
              </span>
            </div>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="teklif in ilan.teklifler"
              :key="teklif.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                  style="background: #003057;"
                >
                  {{ teklif.firma.charAt(0) }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-800">{{ teklif.firma }}</span>
                    <span class="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                      <Star :size="11" fill="#16A34A" class="text-emerald-600" />
                      {{ teklif.puan }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mt-0.5 text-xs text-slate-400 font-medium">
                    <span class="flex items-center gap-1"><Clock :size="11" /> {{ teklif.sure }} {{ 'teslimat' }}</span>
                    <span class="font-mono text-xs text-slate-400">{{ teklif.id }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 justify-between sm:justify-end">
                <span class="text-base font-black font-mono text-slate-900">{{ teklif.fiyat }}</span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :style="teklif.durum === 'onaylandi'
                    ? 'background: rgba(34,197,94,0.1); color: #16A34A;'
                    : (teklif.durum === 'pazarlik' ? 'background: #FEF3C7; color: #B45309;' : 'background: rgba(148,163,184,0.12); color: #64748B;')"
                >
                  {{ teklif.durum === 'onaylandi' ? '✓ Onaylandı' : (teklif.durum === 'pazarlik' ? '💬 Pazarlık Sürecinde' : 'Değerlendiriliyor') }}
                </span>
                <div v-if="teklif.durum !== 'onaylandi'" class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="openNegotiation(teklif, ilan)"
                    class="rounded-xl px-3 py-2 text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer"
                  >
                    💬 Pazarlık
                  </button>
                  <button
                    type="button"
                    @click="acceptTeklif(teklif)"
                    class="rounded-xl px-4 py-2 text-xs font-bold text-white transition cursor-pointer hover:bg-emerald-600 bg-[#0052FF]"
                  >
                    Kabul Et
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 🟢 FİYAT PAZARLIĞI VE KARŞI TEKLİF MODALI -->
    <div v-if="showNegotiationModal && selectedTeklifForNegotiation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <span class="text-[9px] font-black text-amber-600 uppercase tracking-wider block">B2B FİYAT PAZARLIĞI</span>
              <h3 class="text-sm font-black text-slate-900">Tedarikçi ile Pazarlık & Karşı Teklif</h3>
            </div>
          </div>
          <button @click="showNegotiationModal = false" class="text-slate-400 hover:text-slate-700 transition">
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Tedarikçi Firma:</span>
              <span class="font-black text-slate-800">{{ selectedTeklifForNegotiation.firma }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Mevcut Teklif Tutarı:</span>
              <span class="font-black text-emerald-600 font-mono text-sm">{{ selectedTeklifForNegotiation.fiyat }}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-slate-400">İhale:</span>
              <span class="text-slate-700 font-bold line-clamp-1">{{ currentIlanTitle }}</span>
            </div>
          </div>

          <!-- Hedef Pazarlık Fiyatı -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              HEDEF PAZARLIK / KARŞI TEKLİF TUTARI (₺) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-amber-600 text-sm">₺</span>
              <input
                v-model="counterOfferPrice"
                type="number"
                placeholder="Örn: 950.000"
                class="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
              />
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block">Tedarikçiye iletilecek revize hedef teklif tutarı.</span>
          </div>

          <!-- Pazarlık Notu / Şartları -->
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              PAZARLIK ŞARTLARI VE NOTUNUZ *
            </label>
            <textarea
              v-model="counterOfferNotes"
              rows="3"
              placeholder="Örn: Belirtilen fiyata inilmesi durumunda ihale tarafınıza verilecektir."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            @click="showNegotiationModal = false"
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="submitCounterOffer"
            class="w-2/3 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <span>💬 Karşı Teklifi İlet</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
