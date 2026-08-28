<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  FileText, 
  Inbox, 
  Send, 
  Building2, 
  UploadCloud, 
  FileCheck, 
  Eye, 
  MessageSquare,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-vue-next'
import { locale } from '~/composables/useLocale'

definePageMeta({
  layout: "dashboard"
})

const companyName = ref('Yılmaz Ambalaj Sanayi A.Ş.')
const userRole = ref('company')
const isVerified = ref(true)

// ==================== EVRAK YÜKLEME DURUMLARI ====================
const companyDocs = ref([
  { id: 'vergi', name: 'Güncel Vergi Levhası', required: true, uploaded: true, fileName: 'vergi_levhasi_2026.pdf', date: '25.08.2026' },
  { id: 'imza', name: 'İmza Sirküleri / Yetki Belgesi', required: true, uploaded: true, fileName: 'imza_sirkuleri_noter.pdf', date: '25.08.2026' },
  { id: 'sicil', name: 'Ticaret Sicil Gazetesi', required: true, uploaded: true, fileName: 'ticaret_sicil_gazetesi.pdf', date: '26.08.2026' },
  { id: 'faaliyet', name: 'Faaliyet / Oda Kayıt Belgesi', required: false, uploaded: false, fileName: null, date: null }
])

const fileInput = ref<HTMLInputElement | null>(null)
const activeDocId = ref<string | null>(null)

function triggerUpload(docId: string) {
  activeDocId.value = docId
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0] && activeDocId.value) {
    const file = target.files[0]
    const doc = companyDocs.value.find(d => d.id === activeDocId.value)
    if (doc) {
      doc.uploaded = true
      doc.fileName = file.name
      doc.date = new Date().toLocaleDateString('tr-TR')
      alert(`✓ "${doc.name}" başarıyla yüklendi ve sisteme kaydedildi!`)
    }
  }
}

// ==================== BASİT İLANLAR & TEKLİFLER LİSTESİ ====================
const myActiveTenders = ref([
  {
    id: 1,
    no: '2026/14590',
    title: '100.000 Adet Çift Oluklu Baskılı Koli ve Ambalaj Malzemesi Alımı',
    bidsCount: 4,
    bestOffer: '340.000 ₺',
    date: '02.09.2026',
    status: 'Yayında & Teklif Alıyor'
  },
  {
    id: 2,
    no: '2026/14605',
    title: '50 Ton Streç Film ve Palet Sabitleme Çemberi Temini',
    bidsCount: 2,
    bestOffer: '185.000 ₺',
    date: '08.09.2026',
    status: 'Yayında & Teklif Alıyor'
  }
])

const recentBids = ref([
  {
    id: 101,
    tenderTitle: '100.000 Adet Çift Oluklu Baskılı Koli ve Ambalaj Malzemesi Alımı',
    bidder: 'Kalyon Ambalaj & Kağıt Sanayi A.Ş.',
    score: '4.9 ★',
    amount: '340.000 ₺',
    date: '10 dk önce',
    status: 'Yeni Teklif ⚡'
  },
  {
    id: 102,
    tenderTitle: '100.000 Adet Çift Oluklu Baskılı Koli ve Ambalaj Malzemesi Alımı',
    bidder: 'Ege Karton Sanayi Ltd. Şti.',
    score: '4.7 ★',
    amount: '355.000 ₺',
    date: '1 saat önce',
    status: 'İnceleniyor'
  },
  {
    id: 103,
    tenderTitle: '50 Ton Streç Film ve Palet Sabitleme Çemberi Temini',
    bidder: 'Marmara Plastik Üretim A.Ş.',
    score: '5.0 ★',
    amount: '185.000 ₺',
    date: '3 saat önce',
    status: 'Pazarlık Talebi 💬'
  }
])

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (session.companyName || session.company) {
        companyName.value = session.companyName || session.company
      }
      if (session.role) {
        userRole.value = session.role
      }

      const savedMyTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
      if (savedMyTenders.length > 0) {
        const mapped = savedMyTenders.map((t: any, index: number) => ({
          id: t.id || index + 10,
          no: t.id || `2026/${14600 + index}`,
          title: t.baslik,
          bidsCount: t.teklifSayisi || 0,
          bestOffer: t.butce || 'Teklif Bekleniyor',
          date: 'Aktif',
          status: 'Yayında & Teklif Alıyor'
        }))
        myActiveTenders.value = [...mapped, ...myActiveTenders.value]
      }
    } catch (e) {
      console.error(e)
    }
  }
})
</script>

<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-left">
    
    <!-- Hidden File Input -->
    <input ref="fileInput" type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="handleFileChange" />

    <!-- ========================================================================= -->
    <!-- 🏢 1. ÜST HOŞ GELDİNİZ VE KURUMSAL AKSİYON KARTI -->
    <!-- ========================================================================= -->
    <div class="bg-gradient-to-r from-[#0F223D] via-[#1A365D] to-[#0F223D] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase flex items-center gap-1">
            <ShieldCheck :size="12" />
            <span>Onaylı Kurumsal Firma</span>
          </span>
          <span class="text-xs text-slate-300">|</span>
          <span class="text-xs text-slate-300">1 Ay Ücretsiz Kurumsal Deneme</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black tracking-tight">{{ companyName }}</h1>
        <p class="text-xs text-slate-300">İhalelerinizi yönetebilir, gelen teklifleri inceleyebilir ve kurumsal evraklarınızı güncelleyebilirsiniz.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink 
          to="/panel/ihale-olustur" 
          class="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus :size="15" />
          <span>+ Yeni İhale / İlan Aç</span>
        </NuxtLink>
        <NuxtLink 
          to="/panel/ayarlar?tab=sirket" 
          class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud :size="15" class="text-sky-300" />
          <span>📁 Evrakları Düzenle</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📊 2. SADE 4'LÜ DURUM VE SAYAÇ KARTLARI -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Kart 1: İlanlarım -->
      <NuxtLink to="/panel/ilanlarim" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Yayındaki İlanlarım</span>
          <FileText :size="18" class="text-blue-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">{{ myActiveTenders.length }} İlan</div>
        <div class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
          <span>● Aktif teklif toplanıyor</span>
        </div>
      </NuxtLink>

      <!-- Kart 2: Gelen Teklifler -->
      <NuxtLink to="/panel/gelen-teklifler" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Gelen Teklifler</span>
          <Inbox :size="18" class="text-emerald-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">6 Teklif</div>
        <div class="text-[11px] text-amber-600 font-bold flex items-center gap-1">
          <span>⚡ 2 Yeni teklif incelenmeyi bekliyor</span>
        </div>
      </NuxtLink>

      <!-- Kart 3: Verdiğim Teklifler -->
      <NuxtLink to="/panel/yaptigim-teklifler" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Verdiğim Teklifler</span>
          <Send :size="18" class="text-orange-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-slate-800 font-mono">3 İhale</div>
        <div class="text-[11px] text-blue-600 font-bold flex items-center gap-1">
          <span>1 Teklifte karşı pazarlık var</span>
        </div>
      </NuxtLink>

      <!-- Kart 4: Evrak ve Doğrulama Durumu -->
      <NuxtLink to="/panel/ayarlar?tab=sirket" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-500 transition shadow-xs space-y-2 group">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-bold uppercase">Firma Evrakları</span>
          <ShieldCheck :size="18" class="text-sky-600 group-hover:scale-110 transition" />
        </div>
        <div class="text-2xl font-black text-emerald-700 font-mono">%100 Tamam</div>
        <div class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
          <span>✓ Vergi & İmza Sirküleri Onaylı</span>
        </div>
      </NuxtLink>

    </div>

    <!-- ========================================================================= -->
    <!-- 📁 3. FİRMA KAYITLARI & EVRAK YÜKLEME MODÜLÜ (KULLANICI TALEBİ) -->
    <!-- ========================================================================= -->
    <div class="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div class="space-y-0.5">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2">
            <FileCheck :size="18" class="text-blue-600" />
            <span>Firma Kayıt Evrakları & Kurumsal Doğrulama</span>
          </h2>
          <p class="text-xs text-slate-500">İhale açabilmek ve resmi teklif verebilmek için zorunlu şirket evraklarınızı buradan yükleyebilirsiniz.</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
          ✓ Kurumsal Doğrulama Aktif
        </span>
      </div>

      <!-- 4 Temel Evrak Kartı -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div 
          v-for="doc in companyDocs" 
          :key="doc.id"
          class="p-3.5 rounded-xl border transition flex flex-col justify-between gap-3"
          :class="doc.uploaded ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'"
        >
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase text-slate-400">
                {{ doc.required ? 'ZORUNLU BELGE' : 'İSTEĞE BAĞLI' }}
              </span>
              <span v-if="doc.uploaded" class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5">
                <Check :size="12" /> Yüklendi
              </span>
              <span v-else class="text-amber-600 font-bold text-[10px]">
                Eksik
              </span>
            </div>
            <h4 class="font-bold text-slate-800 text-xs">{{ doc.name }}</h4>
            <p v-if="doc.fileName" class="text-[10px] text-slate-500 font-mono truncate">
              📄 {{ doc.fileName }}
            </p>
          </div>

          <div>
            <button 
              type="button" 
              @click="triggerUpload(doc.id)" 
              class="w-full py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
              :class="doc.uploaded 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'"
            >
              <UploadCloud :size="13" />
              <span>{{ doc.uploaded ? 'Evrakı Güncelle' : 'Belge Yükle' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📋 4. YAYINDAKİ İLANLARIM VE GELEN TEKLİFLER (LETGO SADELİĞİNDE) -->
    <!-- ========================================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Sol: Yayındaki İlanlarım -->
      <div class="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 class="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <span>📑 Yayındaki İlanlarım</span>
          </h3>
          <NuxtLink to="/panel/ilanlarim" class="text-blue-600 hover:underline text-xs font-bold">
            Tümünü Gör ➔
          </NuxtLink>
        </div>

        <div class="space-y-2.5">
          <div 
            v-for="item in myActiveTenders" 
            :key="item.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-sky-50/40 transition space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                {{ item.no }}
              </span>
              <span class="text-xs font-bold text-emerald-700 font-mono">
                En İyi: {{ item.bestOffer }}
              </span>
            </div>

            <h4 class="font-bold text-xs text-slate-800 line-clamp-1">{{ item.title }}</h4>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              <span>{{ item.bidsCount }} Teklif Geldi</span>
              <NuxtLink :to="`/panel/gelen-teklifler`" class="text-blue-600 font-bold hover:underline">
                Teklifleri İncele ➔
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Sağ: Son Gelen Teklifler (Pazarlık & Kabul) -->
      <div class="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 class="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <span>📥 Son Gelen Teklifler</span>
          </h3>
          <NuxtLink to="/panel/gelen-teklifler" class="text-blue-600 hover:underline text-xs font-bold">
            Pazarlık Masası ➔
          </NuxtLink>
        </div>

        <div class="space-y-2.5">
          <div 
            v-for="bid in recentBids" 
            :key="bid.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/30 transition space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-slate-800 truncate pr-2">{{ bid.bidder }}</span>
              <span class="font-black text-xs text-emerald-700 font-mono shrink-0">{{ bid.amount }}</span>
            </div>

            <p class="text-[10px] text-slate-500 truncate">{{ bid.tenderTitle }}</p>

            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
              <span class="text-amber-600 font-bold">{{ bid.score }} Puan</span>
              <NuxtLink to="/panel/gelen-teklifler" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]">
                Kabul / Karşı Teklif ➔
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
