<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, MapPin, Building2, User, Star, X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: "public"
})

useSeoMeta({
  title: 'Kurumsal B2B Firmalar - İhaleciBurada',
  description: 'Türkiye genelinde doğrulanmış B2B üretici, toptancı ve tedarikçi firmaların listesi ve kurumsal profilleri.',
  ogTitle: 'Kurumsal B2B Firmalar - İhaleciBurada',
  ogDescription: 'Türkiye genelinde doğrulanmış B2B üretici, toptancı ve tedarikçi firmalar.'
})

const searchQuery = ref('')
const selectedCity = ref('Tümü')
const selectedSector = ref('Tümü')

const sectors = [
  'Tümü',
  'Ambalaj & Koli',
  'İnşaat & Yapı',
  'Sanayi & Makine',
  'Lojistik & Nakliye',
  'Enerji & Akaryakıt',
  'Kırtasiye & Ofis',
  'Gıda & İkram',
  'Tekstil & İş Güvenliği'
]

const verifiedFirms = ref<any[]>([])

const filteredFirms = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return verifiedFirms.value.filter(firm => {
    if (selectedCity.value !== 'Tümü' && firm.city !== selectedCity.value) return false
    if (selectedSector.value !== 'Tümü' && firm.sector !== selectedSector.value) return false
    if (q) {
      const matchName = firm.name.toLowerCase().includes(q)
      const matchSector = firm.sector.toLowerCase().includes(q)
      const matchCity = firm.city.toLowerCase().includes(q)
      const matchDesc = firm.description.toLowerCase().includes(q)
      if (!matchName && !matchSector && !matchCity && !matchDesc) return false
    }
    return true
  })
})

const selectedFirmForModal = ref<any>(null)
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-left">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Hero Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#070F1E] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div class="absolute right-0 top-0 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#00C2FF] text-xs font-black">
            <ShieldCheck :size="14" />
            DOĞRULANMIŞ KURUMSAL B2B FİRMALAR
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">Firma Rehberi & B2B Tedarikçiler</h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Vergi levhası, MERSİS ve ticaret sicil kayıtları doğrulanmış güvenilir üretici ve yüklenici firmaları inceleyin, doğrudan ihalelerinize davet edin.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <NuxtLink
            to="/pazar-yeri"
            class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <span>Canlı İhalelere Git</span>
            <ArrowRight :size="14" />
          </NuxtLink>
          <NuxtLink
            to="/uyelik"
            class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition"
          >
            <Plus :size="14" />
            <span>Firmanızı Ekleyin</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-8 relative">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Firma adı, sektör (ambalaj, inşaat, beton, lojistik), şehir ile ara..."
              class="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm outline-none transition focus:border-blue-500 bg-slate-50/70"
            />
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <select
              v-model="selectedCity"
              class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-slate-50/70 cursor-pointer"
            >
              <option value="Tümü">Tüm Şehirler</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Kocaeli">Kocaeli</option>
              <option value="Çanakkale">Çanakkale</option>
            </select>
          </div>
        </div>

        <!-- Sector Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            v-for="sec in sectors"
            :key="sec"
            @click="selectedSector = sec"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
            :class="selectedSector === sec ? 'bg-[#0052FF] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ sec }}
          </button>
        </div>
      </div>

      <!-- Companies Grid -->
      <div v-if="filteredFirms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="firm in filteredFirms"
          :key="firm.id"
          class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-blue-400 transition-all group"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F223D] to-blue-700 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                  <Building2 :size="22" />
                </div>
                <div>
                  <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{{ firm.sector }}</span>
                  <h3 class="text-sm font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {{ firm.name }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Star Rating Strip -->
            <div class="flex items-center gap-2 pt-1">
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                <Star :size="12" class="fill-amber-400 text-amber-500" />
                <span>{{ firm.rating || 4.9 }}</span>
              </div>
              <span class="text-[11px] text-slate-500 font-bold">({{ firm.reviewCount || 38 }} Değerlendirme)</span>
            </div>

            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {{ firm.description }}
            </p>

            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-medium">Tamamlanan İhale:</span>
                <span class="font-mono font-black text-blue-900">{{ firm.completedTenders }} Başarılı İhale</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-medium">Toplam Teklif:</span>
                <span class="font-mono font-bold text-slate-800">{{ firm.totalBids || 120 }} Teklif Katılımı</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-medium">İş / Ticaret Hacmi:</span>
                <span class="font-mono font-black text-emerald-600">{{ firm.tradeVolume || '35.0M ₺' }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span class="font-medium">Konum:</span>
                <span class="font-bold text-slate-900">{{ firm.district }}, {{ firm.city }}</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 :size="12" />
              <span>{{ firm.badge }}</span>
            </span>

            <button
              type="button"
              @click="selectedFirmForModal = firm"
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition cursor-pointer"
            >
              Profili İncele
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Building2 :size="32" />
        </div>
        <div class="space-y-1">
          <h3 class="font-black text-slate-800 text-base">Henüz Kayıtlı Firma Bulunmuyor</h3>
          <p class="text-slate-500 text-xs max-w-md mx-auto">
            Platformda şu anda listelenen kayıtlı firma bulunmamaktadır. Firmanızı ekleyerek B2B tedarikçi ağında yerinizi alabilirsiniz.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NuxtLink to="/uyelik" class="px-5 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-md">
            <Plus :size="14" />
            <span>Firmanızı Ekleyin</span>
          </NuxtLink>
          <button v-if="searchQuery || selectedCity !== 'Tümü' || selectedSector !== 'Tümü'" type="button" @click="searchQuery = ''; selectedCity = 'Tümü'; selectedSector = 'Tümü'" class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
            Filtreleri Sıfırla
          </button>
        </div>
      </div>

      <!-- Company Profile Modal -->
      <div v-if="selectedFirmForModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-left border border-slate-200">
          <div class="flex items-start justify-between gap-4 border-b pb-4 border-slate-100">
            <div class="flex items-center gap-3.5">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F223D] to-blue-700 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                <Building2 :size="28" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-blue-600 uppercase">{{ selectedFirmForModal.sector }}</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">✓ {{ selectedFirmForModal.badge }}</span>
                </div>
                <h2 class="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">{{ selectedFirmForModal.name }}</h2>
                <span class="text-xs text-slate-500">📍 {{ selectedFirmForModal.district }}, {{ selectedFirmForModal.city }}</span>
              </div>
            </div>
            <button @click="selectedFirmForModal = null" class="text-slate-400 hover:text-slate-700 p-2 rounded-xl cursor-pointer">
              <X :size="22" />
            </button>
          </div>

          <!-- 4-Stat Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
              <span class="text-[10px] font-bold text-amber-800 uppercase block">Yıldız Skoru</span>
              <div class="flex items-center justify-center gap-1 font-black text-xl text-amber-900">
                <Star :size="18" class="fill-amber-400 text-amber-500" />
                <span>{{ selectedFirmForModal.rating || 4.9 }}</span>
              </div>
              <span class="text-[10px] text-amber-700 font-bold block">{{ selectedFirmForModal.reviewCount || 38 }} Değerlendirme</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
              <span class="text-[10px] font-bold text-blue-800 uppercase block">Tamamlanan İhale</span>
              <div class="font-black text-xl text-blue-950 font-mono">
                {{ selectedFirmForModal.completedTenders }}
              </div>
              <span class="text-[10px] text-blue-700 font-bold block">Başarılı Sözleşme</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span class="text-[10px] font-bold text-slate-500 uppercase block">Toplam Teklif</span>
              <div class="font-black text-xl text-slate-900 font-mono">
                {{ selectedFirmForModal.totalBids || 120 }}
              </div>
              <span class="text-[10px] text-slate-500 font-bold block">İhale Katılımı</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1">
              <span class="text-[10px] font-bold text-emerald-800 uppercase block">Toplam İş Hacmi</span>
              <div class="font-black text-xl text-emerald-700 font-mono">
                {{ selectedFirmForModal.tradeVolume || '35.0M ₺' }}
              </div>
              <span class="text-[10px] text-emerald-700 font-bold block">Escrow Hacmi</span>
            </div>
          </div>

          <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider">Şirket Faaliyet Özeti & Kurumsal Tanıtım</h4>
              <p>{{ selectedFirmForModal.description }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 font-bold uppercase block">Vergi Dairesi / VKN</span>
                <span class="font-black text-slate-800 text-xs">{{ selectedFirmForModal.taxOffice }}</span>
              </div>
              <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 font-bold uppercase block">MERSİS Numarası</span>
                <span class="font-black font-mono text-slate-800 text-xs">{{ selectedFirmForModal.mersis }}</span>
              </div>
              <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span class="text-[10px] text-slate-400 font-bold uppercase block">İletişim & Destek</span>
                <span class="font-bold text-slate-800 text-xs">{{ selectedFirmForModal.phone }}</span>
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4 text-[11px] font-bold">
              <span class="text-emerald-700">✓ Zamanında Teslimat: {{ selectedFirmForModal.onTimeDelivery || '%99.0' }}</span>
              <span class="text-blue-700">✓ Şartname Uyumu: {{ selectedFirmForModal.specCompliance || '%100' }}</span>
              <span class="text-purple-700">✓ Yanıt Süresi: {{ selectedFirmForModal.avgResponseTime || '10 dk' }}</span>
            </div>

            <!-- Reviews -->
            <div v-if="selectedFirmForModal.reviews && selectedFirmForModal.reviews.length > 0" class="space-y-2.5 pt-2">
              <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Star :size="13" class="fill-amber-400 text-amber-500" />
                <span>Doğrulanmış Alıcı & İdare Yorumları</span>
              </h4>
              <div
                v-for="(rev, rIdx) in selectedFirmForModal.reviews"
                :key="rIdx"
                class="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs"
              >
                <div class="flex items-center justify-between text-xs font-bold">
                  <span class="text-slate-900">{{ rev.author }}</span>
                  <div class="flex items-center gap-1 text-amber-500">
                    <Star v-for="i in 5" :key="i" :size="10" class="fill-amber-400 text-amber-400" />
                    <span class="text-[10px] text-slate-400 font-normal ml-1">({{ rev.date }})</span>
                  </div>
                </div>
                <p class="text-xs text-slate-600 italic">"{{ rev.comment }}"</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              @click="selectedFirmForModal = null" 
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Kapat
            </button>
            <NuxtLink
              to="/panel/ihale-olustur"
              class="px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Bu Firmaya Özel İhale Aç</span>
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
