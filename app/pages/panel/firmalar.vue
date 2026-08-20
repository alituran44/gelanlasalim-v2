<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, SlidersHorizontal, Download, LayoutGrid, List, MapPin, Building2, User, Star, X } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const searchQuery = ref('')
const selectedCity = ref('Balıkesir')

const firms = [
  { name: 'İSTFA GLOBAL TEDARİK YAPI BİLİŞİM LİMİTED ŞİRKETİ', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', city: 'İstanbul', district: 'Başakşehir', status: 'Doğrulanmış', sector: 'Hizmet', initial: 'İŞ', isBig: true },
  { name: 'Marmara Teknoloji Yatırımları A.Ş.', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', city: 'İstanbul', district: 'Levent', status: 'Doğrulanmış', sector: 'Bilişim', initial: 'MT', isBig: true },
  { name: 'Anadolu E-Ticaret A.Ş.', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80', city: 'Ankara', district: 'Çankaya', status: 'Doğrulanmış', sector: 'Matbaa & Ambalaj', initial: 'AE', isBig: true },
  { name: 'Bursa Endüstri Üretim A.Ş.', logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80', city: 'Bursa', district: 'Nilüfer', status: 'Doğrulanmış', sector: 'Sanayi & İmalat', initial: 'BE' },
  { name: 'Ege Gıda Sanayi Ltd. Şti.', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80', city: 'İzmir', district: 'Bornova', status: 'Doğrulanmış', sector: 'Gıda & Catering', initial: 'EG' },
  { name: 'Atlas Holding A.Ş.', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80', city: 'İstanbul', district: 'Ataşehir', status: 'Doğrulanmış', sector: 'Lojistik', initial: 'AH' },
  { name: 'Ali Turan Mühendislik', logo: '', city: 'Çanakkale', district: 'Merkez', status: 'Doğrulanmamış', sector: 'Hizmet', initial: 'AT' },
  { name: 'Yavuz Uyanık İnşaat', logo: '', city: 'İstanbul', district: 'Beylikdüzü', status: 'Doğrulanmamış', sector: 'İnşaat', initial: 'YU' },
  { name: 'Kadir Ak Yapı', logo: '', city: 'İstanbul', district: 'Başakşehir', status: 'Doğrulanmamış', sector: 'Yapı', initial: 'KA' },
  { name: 'SMT Rulman Sanayi', logo: '', city: 'İstanbul', district: 'Ümraniye', status: 'Doğrulanmamış', sector: 'Yedek Parça', initial: 'SR' },
  { name: 'Makks Villas A.Ş.', logo: '', city: 'İstanbul', district: 'Pendik', status: 'Doğrulanmamış', sector: 'Gayrimenkul', initial: 'MA' }
]

// Shared Mock Company Profiles Database
const companyProfiles: Record<string, {
  name: string
  logo?: string
  verified: boolean
  sector: string
  phone: string
  email: string
  address: string
  kep: string
  mersis: string
  rating: number
  reviews: Array<{ author: string, company: string, rating: number, comment: string, date: string }>
}> = {
  'İSTFA GLOBAL TEDARİK YAPI BİLİŞİM LİMİTED ŞİRKETİ': {
    name: 'İSTFA GLOBAL TEDARİK YAPI BİLİŞİM LİMİTED ŞİRKETİ',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    verified: true,
    sector: 'Yapı, Bilişim ve Dış Ticaret Tedariği',
    phone: '+90 (212) 654 32 10',
    email: 'info@istfaglobal.com',
    address: 'Başakşehir, İstanbul, Türkiye',
    kep: 'istfaglobal@hs01.kep.tr',
    mersis: '0481-0899-7712-0021',
    rating: 4.8,
    reviews: [
      { author: 'Caner Aksoy', company: 'Aksoy Holding', rating: 5, comment: 'Bilişim ve altyapı malzemesi tedariğinde son derece güvenilirlikler.', date: '11 Tem 2026' }
    ]
  },
  'Makks Villas A.Ş.': {
    name: 'Makks Villas A.Ş.',
    logo: '',
    verified: false,
    sector: 'İnşaat, Gayrimenkul ve Villa Yapımı',
    phone: '+90 (216) 333 44 55',
    email: 'satis@makksvillas.com',
    address: 'Pendik, İstanbul, Türkiye',
    kep: 'makksvillas@hs01.kep.tr',
    mersis: '0612-0941-0024-0012',
    rating: 4.5,
    reviews: [
      { author: 'Gökhan Tan', company: 'Tan İnşaat Geliştirme', rating: 4.5, comment: 'Şantiye tadilat süreçlerini çok titiz yönettiler.', date: '01 Haz 2026' }
    ]
  }
}

const showCompanyModal = ref(false)
const selectedCompany = ref<any>(null)

function openCompanyModal(firm: any) {
  const profile = companyProfiles[firm.name]
  if (profile) {
    selectedCompany.value = profile
  } else {
    selectedCompany.value = {
      name: firm.name,
      verified: firm.status === 'Doğrulanmış',
      sector: firm.sector + ' Sektörü Tedarikçisi',
      phone: '+90 (850) 888 00 00',
      email: 'info@' + firm.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '') + '.com',
      address: `${firm.district}, ${firm.city}, Türkiye`,
      kep: firm.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '') + '@hs01.kep.tr',
      mersis: '0XXX-XXXX-XXXX-XXXX',
      rating: 4.5,
      reviews: [
        { author: 'Sistem Yöneticisi', company: 'GelAnlaşalım Platformu', rating: 5, comment: 'Doğrulanmış B2B platform üyesi kurumsal satıcı.', date: 'Temmuz 2026' }
      ]
    }
  }
  showCompanyModal.value = true
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Kurumsal Firmalar</h1>
        <p class="text-xs text-slate-500 mt-1">Tedarikçi ve firma ağınızı konum, sektör ve doğrulama durumuna göre yönetin. <span class="text-slate-400">Toplam: 99 - Doğrulanmış: 10 - Ortalama puan: --</span></p>
      </div>

      <button 
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto"
      >
        <Plus :size="14" />
        Tedarikçi davet et
      </button>
    </div>

    <!-- Map Dropdown Bar -->
    <div class="flex items-center bg-white border p-3 rounded-xl gap-3" style="border-color: #E2E8F0;">
      <div class="flex items-center gap-2 text-slate-400 shrink-0">
        <MapPin :size="15" />
        <span class="text-xs font-bold text-slate-500">Firma konumları:</span>
      </div>
      
      <select 
        v-model="selectedCity"
        class="rounded-lg border px-3 py-1.5 text-xs bg-white outline-none font-bold text-slate-700 max-w-xs"
        style="border-color: #E2E8F0;"
      >
        <option value="Balıkesir">Balıkesir (1 firma)</option>
        <option value="İstanbul">İstanbul (82 firma)</option>
        <option value="Çanakkale">Çanakkale (4 firma)</option>
        <option value="İzmir">İzmir (3 firma)</option>
      </select>
    </div>

    <!-- Search and Filters Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 w-full max-w-md">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Firma adı, vergi no veya e-posta ile ara..."
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500"
          style="border-color: #E2E8F0; color: #0F172A;"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto justify-end">
        <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <SlidersHorizontal :size="13" />
          Detaylı filtre
        </button>
        
        <button type="button" class="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition" style="border-color: #E2E8F0;">
          <Download :size="13" />
          Dışa aktar
        </button>

        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <List :size="14" />
        </button>
        <button type="button" class="p-2.5 rounded-xl border bg-white text-slate-400 hover:bg-slate-50" style="border-color: #E2E8F0;">
          <LayoutGrid :size="14" />
        </button>
      </div>
    </div>

    <!-- Corporate Directory Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(firm, idx) in firms" 
        :key="idx"
        class="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between min-h-[190px]"
        style="border-color: #E2E8F0;"
      >
        <!-- Top header tags -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex gap-1.5">
            <span class="text-[8px] font-black uppercase rounded bg-slate-100 text-slate-500 px-1.5 py-0.5">
              {{ firm.status }}
            </span>
            <span class="text-[8px] font-black uppercase rounded bg-slate-100 text-slate-500 px-1.5 py-0.5">
              {{ firm.sector }}
            </span>
          </div>
        </div>

        <!-- Corporate Branding banner overlay if BIG firm -->
        <div v-if="firm.isBig" class="absolute top-0 left-0 right-0 h-16 bg-slate-900 rounded-t-2xl flex items-center justify-center p-3 overflow-hidden select-none z-0">
          <span class="text-[10px] text-white/20 font-black tracking-widest">KURUMSAL TEDARİKÇİ</span>
        </div>

        <!-- Corporate Avatar / Logo & Name -->
        <div class="flex items-start gap-3 mt-4 relative z-10">
          <div 
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 overflow-hidden"
            :style="firm.isBig ? 'background: #FFFFFF; border-color: #E2E8F0; margin-top: 8px;' : ''"
          >
            <img v-if="firm.logo" :src="firm.logo" :alt="firm.name" class="w-full h-full object-cover" />
            <span v-else>{{ firm.initial }}</span>
          </div>
          <div class="min-w-0" :style="firm.isBig ? 'margin-top: 8px;' : ''">
            <h4 class="text-xs font-black text-slate-800 leading-snug truncate" :title="firm.name">{{ firm.name }}</h4>
            <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin :size="9" /> {{ firm.district }}, {{ firm.city }}</p>
          </div>
        </div>

        <!-- Metrics block -->
        <div class="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold mt-4">
          <div>
            <span class="block text-[7px] text-slate-300">KATILDIĞI İHALE</span>
            <span class="text-slate-600 font-mono">0</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">TAMAMLANAN</span>
            <span class="text-slate-600 font-mono">0</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">BAŞARI ORANI</span>
            <span class="text-slate-600">--</span>
          </div>
        </div>

        <!-- Footer link -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-50 mt-3 text-[10px] font-bold text-slate-400">
          <span>Üye: Tem 2026</span>
          <button @click="openCompanyModal(firm)" class="text-blue-600 hover:underline">Detayları görüntüle ↗</button>
        </div>

      </div>
    </div>

    <!-- Pagination controls -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style="border-color: #F1F5F9;">
      <span class="text-xs font-bold text-slate-400">1-12 / 99 sonuç</span>
      
      <div class="flex items-center gap-1 text-xs font-bold text-slate-500">
        <button type="button" class="px-2 py-1 rounded hover:bg-slate-100">Önceki</button>
        <button type="button" class="h-6 w-6 rounded bg-slate-950 text-white flex items-center justify-center font-mono">1</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">2</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">3</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">4</button>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">5</button>
        <span class="px-1 text-slate-300">...</span>
        <button type="button" class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center font-mono">9</button>
        <button type="button" class="px-2 py-1 rounded hover:bg-slate-100">Sonraki</button>
      </div>
    </div>

  </div>

  <!-- FİRMA DETAY VE YORUM MODALI (Photo 2 / 5 Feedbacks) -->
  <div v-if="showCompanyModal && selectedCompany" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-start border-b pb-4" style="border-color: #F1F5F9;">
        <div class="flex items-center gap-3">
          <div class="h-14 w-14 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
            <img v-if="selectedCompany.logo" :src="selectedCompany.logo" :alt="selectedCompany.name" class="w-full h-full object-cover" />
            <span v-else class="text-base font-black text-slate-700 font-mono">{{ selectedCompany.name.charAt(0) }}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-black text-slate-800 uppercase tracking-wider">{{ selectedCompany.name }}</h3>
              <span v-if="selectedCompany.verified" class="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wider">
                ✓ ONAYLI
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1 font-bold">{{ selectedCompany.sector }}</p>
          </div>
        </div>
        <button @click="showCompanyModal = false" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
          <X :size="18" />
        </button>
      </div>

      <!-- Details Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider">İLETİŞİM BİLGİLERİ</h4>
          <div class="text-xs text-slate-600 space-y-2">
            <div><strong class="text-slate-400">Telefon:</strong> {{ selectedCompany.phone }}</div>
            <div><strong class="text-slate-400">E-Posta:</strong> {{ selectedCompany.email }}</div>
            <div><strong class="text-slate-400">Adres:</strong> {{ selectedCompany.address }}</div>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider">RESMİ BİLGİLER</h4>
          <div class="text-xs text-slate-600 space-y-2">
            <div><strong class="text-slate-400">KEP Adresi:</strong> {{ selectedCompany.kep }}</div>
            <div><strong class="text-slate-400">MERSİS No:</strong> {{ selectedCompany.mersis }}</div>
            <div class="flex items-center gap-1">
              <strong class="text-slate-400">Puanlama:</strong>
              <span class="font-bold text-amber-500 font-mono text-xs">{{ selectedCompany.rating }} / 5.0</span>
              <div class="flex text-amber-400">
                <Star v-for="i in 5" :key="i" :size="12" :fill="i <= Math.round(selectedCompany.rating) ? 'currentColor' : 'none'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments & Reviews -->
      <div class="space-y-3 pt-4 border-t" style="border-color: #F1F5F9;">
        <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider">FİRMA HAKKINDA YORUMLAR ({{ selectedCompany.reviews.length }})</h4>
        
        <div class="space-y-3">
          <div 
            v-for="(review, rIdx) in selectedCompany.reviews" 
            :key="rIdx"
            class="rounded-2xl border p-4 bg-slate-50/50 space-y-2"
            style="border-color: #E2E8F0;"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-700 block">{{ review.author }}</span>
                <span class="text-[9px] text-slate-400 font-medium block">{{ review.company }}</span>
              </div>
              <div class="text-right">
                <div class="flex text-amber-400 justify-end">
                  <Star v-for="i in 5" :key="i" :size="10" :fill="i <= review.rating ? 'currentColor' : 'none'" />
                </div>
                <span class="text-[9px] text-slate-400 font-mono">{{ review.date }}</span>
              </div>
            </div>
            <p class="text-xs leading-relaxed text-slate-600 font-medium">
              {{ review.comment }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-3 border-t" style="border-color: #F1F5F9;">
        <button @click="showCompanyModal = false" class="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 transition shadow-lg">
          Kapat
        </button>
      </div>
    </div>
  </div>
</template>
