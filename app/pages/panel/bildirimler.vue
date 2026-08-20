<script setup lang="ts">
import { ref } from 'vue'
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, ShieldAlert } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const notifications = ref([
  {
    id: 'notif-1',
    type: 'success',
    title: 'Yeni Teklif Alındı',
    desc: 'Ofis Malzemeleri Alımı (IHC-2024-001) ihalesine ABC Ofis Malzemeleri A.Ş. tarafından 38.500 ₺ tutarında yeni bir teklif sunuldu.',
    time: '5 dakika önce',
    read: false
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Yeni Mesajınız Var',
    desc: 'SecureTech Sistemleri firmasından "Güvenlik Kamera Sistemi (IHC-2024-002)" ihalesi kapsamında yeni bir mesaj aldınız.',
    time: '2 saat önce',
    read: false
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Premium Üyelik Aktif Edildi',
    desc: 'Tebrikler! 6 Aylık B2B Premium Kurumsal üyelik paketiniz başarıyla aktif edildi. Sınırsız ihale açabilir ve teklif verebilirsiniz.',
    time: 'Dün 10:15',
    read: true
  },
  {
    id: 'notif-4',
    type: 'warning',
    title: 'İhale Süresi Yaklaşıyor',
    desc: 'Tarımsal Sulama Ekipmanı (IHC-2024-003) ihalesinin teklif toplama süresi son 24 saate girdi.',
    time: '2 gün önce',
    read: true
  },
  {
    id: 'notif-5',
    type: 'info',
    title: 'Belge Doğrulama Onayı',
    desc: 'Firma profilinize yüklediğiniz Sanayi Sicil Belgesi ve İmza Sirküleri onay ekibimiz tarafından doğrulanmıştır.',
    time: '3 gün önce',
    read: true
  }
])

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}

function deleteNotification(id: string) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto text-left">
    
    <!-- Başlık ve Hızlı Aksiyonlar -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
          <Bell class="text-blue-600" :size="22" />
          Bildirimler
        </h1>
        <p class="text-sm mt-0.5" style="color: #64748B;">İhaleciBurada platformundaki ihale ve teklif bildirimlerini izleyin</p>
      </div>

      <button 
        @click="markAllRead"
        class="text-xs font-bold text-blue-600 hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100/80 px-3.5 py-2 rounded-lg"
      >
        Tümünü Okundu İşaretle
      </button>
    </div>

    <!-- Bildirim Listesi -->
    <div class="space-y-3">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="rounded-xl border bg-white p-5 transition flex gap-4 items-start relative group"
        :style="notif.read ? 'border-color: #E2E8F0; opacity: 0.85;' : 'border-color: #BFDBFE; background: #EFF6FF/20;'"
      >
        <!-- Sol Kenar Aktiflik Çizgisi -->
        <span 
          v-if="!notif.read" 
          class="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-blue-600"
        ></span>

        <!-- İkon -->
        <div class="shrink-0 mt-0.5">
          <CheckCircle2 v-if="notif.type === 'success'" class="text-emerald-500" :size="20" />
          <Info v-else-if="notif.type === 'info'" class="text-blue-500" :size="20" />
          <ShieldAlert v-else-if="notif.type === 'warning'" class="text-amber-500" :size="20" />
          <AlertCircle v-else class="text-slate-400" :size="20" />
        </div>

        <!-- Metinler -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="font-bold text-sm" style="color: #0F172A;">{{ notif.title }}</h3>
            <span class="text-[10px] text-slate-400 shrink-0 font-medium">{{ notif.time }}</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">{{ notif.desc }}</p>
        </div>

        <!-- Sil Butonu -->
        <button 
          @click="deleteNotification(notif.id)"
          class="shrink-0 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100 self-center"
          title="Bildirimi Sil"
        >
          <Trash2 :size="15" />
        </button>

      </div>

      <!-- Boş Durum -->
      <div v-if="notifications.length === 0" class="text-center py-16 rounded-xl border border-dashed border-slate-200 bg-white">
        <Bell class="mx-auto text-slate-300 mb-2" :size="36" />
        <h3 class="text-sm font-bold text-slate-800">Hiç Bildiriminiz Yok</h3>
        <p class="text-xs text-slate-400 mt-1">Her şey yolunda! Yeni bir ihale veya teklif gelişmesi olduğunda burada görünecektir.</p>
      </div>

    </div>
  </div>
</template>
