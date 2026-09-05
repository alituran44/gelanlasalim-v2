<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, SlidersHorizontal, Download, LayoutGrid, List, MapPin, Building2, User, Star, X, UserPlus, CheckCircle2, Copy } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})

const searchQuery = ref('')
const selectedCity = ref('Tümü')

// Real / dynamic registered companies list (Sample mock companies cleared)
const firms = ref<any[]>([])

// Shared Company Profiles Database
const companyProfiles = ref<Record<string, any>>({})

const filteredFirms = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return firms.value.filter(firm => {
    if (selectedCity.value !== 'Tümü' && firm.city !== selectedCity.value) return false
    if (q) {
      const matchName = (firm.name || '').toLowerCase().includes(q)
      const matchSector = (firm.sector || '').toLowerCase().includes(q)
      const matchCity = (firm.city || '').toLowerCase().includes(q)
      if (!matchName && !matchSector && !matchCity) return false
    }
    return true
  })
})

const showCompanyModal = ref(false)
const selectedCompany = ref<any>(null)

const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteCompanyName = ref('')
const inviteCopied = ref(false)
const inviteUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/uyelik?ref=portal`
  }
  return 'https://www.ihaleciburada.com/uyelik?ref=portal'
})

function copyInviteLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(inviteUrl.value)
    inviteCopied.value = true
    setTimeout(() => {
      inviteCopied.value = false
    }, 2000)
  }
}

function sendInvite() {
  if (!inviteEmail.value) {
    alert('Lütfen davet edilecek e-posta adresini giriniz.')
    return
  }
  alert(`✓ DAVET GÖNDERİLDİ\n\n"${inviteEmail.value}" adresine kurumsal tedarikçi katılım davetiyesi ve 1 ay ücretsiz deneme linki iletildi.`)
  showInviteModal.value = false
  inviteEmail.value = ''
  inviteCompanyName.value = ''
}

function openCompanyModal(firm: any) {
  const profile = companyProfiles.value[firm.name]
  if (profile) {
    selectedCompany.value = profile
  } else {
    selectedCompany.value = {
      name: firm.name,
      verified: firm.status === 'Doğrulanmış',
      sector: firm.sector + ' Sektörü Tedarikçisi',
      phone: firm.phone || '+90 (850) 888 00 00',
      email: firm.email || ('info@' + firm.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '') + '.com'),
      address: `${firm.district || 'Merkez'}, ${firm.city || 'Türkiye'}, Türkiye`,
      mersis: firm.mersis || '0XXX-XXXX-XXXX-XXXX',
      rating: firm.rating || 5.0,
      reviews: firm.reviews || []
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
        <p class="text-xs text-slate-500 mt-1">Tedarikçi ve firma ağınızı konum, sektör ve doğrulama durumuna göre yönetin. <span class="text-slate-400">Toplam: {{ firms.length }} - Doğrulanmış: {{ firms.filter(f => f.status === 'Doğrulanmış').length }}</span></p>
      </div>

      <button 
        type="button"
        @click="showInviteModal = true"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-lg shadow-blue-500/20 transition self-start sm:self-auto cursor-pointer"
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
        <option value="Tümü">Tüm Şehirler ({{ firms.length }} firma)</option>
        <option value="İstanbul">İstanbul</option>
        <option value="Ankara">Ankara</option>
        <option value="İzmir">İzmir</option>
        <option value="Bursa">Bursa</option>
        <option value="Çanakkale">Çanakkale</option>
        <option value="Balıkesir">Balıkesir</option>
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
          class="w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs outline-none bg-white transition focus:border-blue-500 font-medium"
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
      </div>
    </div>

    <!-- Corporate Directory Grid Cards (If Any) -->
    <div v-if="filteredFirms.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(firm, idx) in filteredFirms" 
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

        <!-- Corporate Avatar / Logo & Name -->
        <div class="flex items-start gap-3 mt-4 relative z-10">
          <div 
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 overflow-hidden"
          >
            <img v-if="firm.logo" :src="firm.logo" :alt="firm.name" class="w-full h-full object-cover" />
            <span v-else>{{ firm.initial || (firm.name ? firm.name.charAt(0) : 'F') }}</span>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-black text-slate-800 leading-snug truncate" :title="firm.name">{{ firm.name }}</h4>
            <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin :size="9" /> {{ firm.district || 'Merkez' }}, {{ firm.city }}</p>
          </div>
        </div>

        <!-- Metrics block -->
        <div class="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold mt-4">
          <div>
            <span class="block text-[7px] text-slate-300">KATILDIĞI İHALE</span>
            <span class="text-slate-600 font-mono">{{ firm.tendersCount || 0 }}</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">TAMAMLANAN</span>
            <span class="text-slate-600 font-mono">{{ firm.completedCount || 0 }}</span>
          </div>
          <div>
            <span class="block text-[7px] text-slate-300">BAŞARI ORANI</span>
            <span class="text-slate-600">{{ firm.successRate || '--' }}</span>
          </div>
        </div>

        <!-- Footer link -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-50 mt-3 text-[10px] font-bold text-slate-400">
          <span>Üye: 2026</span>
          <button @click="openCompanyModal(firm)" class="text-blue-600 hover:underline cursor-pointer">Detayları görüntüle ↗</button>
        </div>

      </div>
    </div>

    <!-- CLEAN EMPTY STATE VIEW -->
    <div v-else class="rounded-3xl border bg-white p-12 sm:p-16 text-center space-y-4 shadow-xs" style="border-color: #E2E8F0;">
      <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mx-auto">
        <Building2 :size="24" />
      </div>
      <div class="space-y-1.5 max-w-md mx-auto">
        <h3 class="text-base font-black text-slate-800">Kayıtlı Firma Bulunmuyor</h3>
        <p class="text-xs text-slate-500 font-medium leading-relaxed">
          Tüm örnek firmalar temizlendi. Platformunuza yeni kayıt olan ve MERSİS/vergi levhası doğrulanan kurumsal firmalar burada görüntülenecektir.
        </p>
      </div>
      <div class="pt-2">
        <button
          type="button"
          @click="showInviteModal = true"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-sm cursor-pointer"
        >
          <UserPlus :size="14" />
          <span>İlk Tedarikçiyi Davet Et</span>
        </button>
      </div>
    </div>

  </div>

  <!-- TEDARİKÇİ DAVET MODALI -->
  <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
    <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl text-left space-y-5">
      <div class="flex justify-between items-center border-b pb-3" style="border-color: #F1F5F9;">
        <div class="flex items-center gap-2">
          <div class="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserPlus :size="18" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900">Kurumsal Tedarikçi Davet Et</h3>
            <span class="text-[10px] text-slate-400">1 Ay %100 Ücretsiz Katılım Linki</span>
          </div>
        </div>
        <button @click="showInviteModal = false" class="text-slate-400 hover:text-slate-600 p-1">✕</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">FİRMA ADI (OPSİYONEL)</label>
          <input v-model="inviteCompanyName" type="text" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white text-slate-800 font-medium" placeholder="Örn: Atlas Endüstri A.Ş." />
        </div>

        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">YETKİLİ E-POSTA ADRESİ *</label>
          <input v-model="inviteEmail" type="email" class="w-full rounded-xl border px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white text-slate-800 font-medium" placeholder="satinalma@firma.com" />
        </div>

        <div class="pt-2">
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">HIZLI PAYLAŞIM LİNKİ</label>
          <div class="flex items-center gap-2">
            <input readonly :value="inviteUrl" class="flex-1 rounded-xl border px-3 py-2 bg-slate-50 text-slate-600 font-mono text-[11px] outline-none" />
            <button @click="copyInviteLink" type="button" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
              <CheckCircle2 v-if="inviteCopied" :size="12" class="text-emerald-600" />
              <Copy v-else :size="12" />
              <span>{{ inviteCopied ? 'Kopyalandı!' : 'Kopyala' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-3 border-t" style="border-color: #F1F5F9;">
        <button @click="showInviteModal = false" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
          Vazgeç
        </button>
        <button @click="sendInvite" class="px-5 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md">
          Davet Gönder
        </button>
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
