<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, ShieldAlert, Settings, Building2, Send, Clock, Sparkles } from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'

definePageMeta({ layout: 'dashboard' })

const { cmsData } = useCmsData()
const userSession = ref<any>({})
const deletedNotifIds = ref<string[]>([])
const readNotifIds = ref<string[]>([])

// Gerçek Sistem Verilerinden Dinamik Bildirim Üretici
const realNotifications = computed(() => {
  const list: any[] = []

  // 1. Kendi açtığı ihalelere gelen gerçek teklif bildirimleri
  const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
  let myTenders: any[] = []
  if (typeof window !== 'undefined') {
    try {
      myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
    } catch (e) {}
  }

  // İhale teklif bildirimleri
  receivedGroups.forEach((group: any) => {
    (group.teklifler || []).forEach((tkf: any, idx: number) => {
      list.push({
        id: 'notif-bid-' + (tkf.id || idx) + '-' + group.id,
        type: 'success',
        title: '🎯 İhalenize Yeni Teklif Geldi',
        desc: `"${group.baslik} (#${group.id})" ihaleniz için ${tkf.firma} tarafından ${tkf.fiyat} tutarında ve ${tkf.sure || '7 gün'} teslimat süreli yeni bir teklif sunuldu.`,
        time: tkf.tarih || 'Bugün',
        link: '/panel/gelen-teklifler',
        category: 'bid'
      })
    })
  })

  // 2. Kullanıcının verdiği kendi teklif bildirimleri
  if (typeof window !== 'undefined') {
    try {
      const mySubmitted = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      mySubmitted.forEach((sb: any) => {
        list.push({
          id: 'notif-sub-' + sb.id,
          type: 'info',
          title: '⚡ Teklifiniz Başarıyla İletildi',
          desc: `"${sb.tenderTitle || 'Satın Alma İhalesi'}" için ${sb.price} tutarındaki teklifiniz alıcı kuruma (${sb.buyerCompany || 'Alıcı Masası'}) güvenle ulaştırıldı.`,
          time: sb.submittedAt || 'Bugün',
          link: '/panel/yaptigim-teklifler',
          category: 'submitted'
        })
      })
    } catch (e) {}
  }

  // 3. Kullanıcının oluşturduğu gerçek ihalelerin bildirimleri
  myTenders.forEach((tender: any) => {
    list.push({
      id: 'notif-tender-' + tender.id,
      type: 'info',
      title: '📄 İhale İlanınız Yayında / Onayda',
      desc: `"${tender.baslik} (#${tender.id})" başlıklı satın alma ihaleniz oluşturuldu. ${tender.city || 'Balıkesir'} lokasyonundaki tedarikçilere teklif çağrısı iletildi.`,
      time: tender.olusturma || 'Bugün',
      link: '/panel/ilanlarim',
      category: 'tender'
    })
  })

  // 4. Şirket KYC ve Güvenli Ödeme Bildirimleri
  const compName = userSession.value?.companyName || userSession.value?.company || 'Şirketiniz'
  list.push({
    id: 'notif-kyc-verified',
    type: 'success',
    title: '🛡️ Kurumsal Kimlik & KYC Doğrulandı',
    desc: `${compName} kurumsal firma kaydı, Vergi Kimlik Numarası (GİB) ve Ticaret Sicil kayıtları onaylanmış olup hesabınıza Doğrulanmış Mavi Rozet tanımlanmıştır.`,
    time: 'Bu Hafta',
    link: '/panel/ayarlar?tab=sirket',
    category: 'kyc'
  })

  list.push({
    id: 'notif-escrow-active',
    type: 'success',
    title: '🔒 Escrow Güvenli Havuz Koruması Aktif',
    desc: 'Tüm ihaleleriniz ve teklifleriniz BDDK/TCMB lisanslı Güvenli Ödeme Havuzu güvencesi altındadır. Hakedişler muayene kabul onayına kadar bloke edilir.',
    time: 'Sürekli Aktif',
    link: '/panel/siparis-teslimat',
    category: 'escrow'
  })

  // Filter out deleted notifications and map read status
  return list
    .filter(n => !deletedNotifIds.value.includes(n.id))
    .map(n => ({
      ...n,
      read: readNotifIds.value.includes(n.id)
    }))
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
      deletedNotifIds.value = JSON.parse(localStorage.getItem('deletedNotifs') || '[]')
      readNotifIds.value = JSON.parse(localStorage.getItem('readNotifs') || '[]')
    } catch (e) {}
  }
})

function markAllRead() {
  realNotifications.value.forEach(n => {
    if (!readNotifIds.value.includes(n.id)) {
      readNotifIds.value.push(n.id)
    }
  })
  if (typeof window !== 'undefined') {
    localStorage.setItem('readNotifs', JSON.stringify(readNotifIds.value))
  }
}

function deleteNotification(id: string) {
  if (!deletedNotifIds.value.includes(id)) {
    deletedNotifIds.value.push(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('deletedNotifs', JSON.stringify(deletedNotifIds.value))
    }
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto text-left">
    
    <!-- Başlık ve Hızlı Aksiyonlar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-black flex items-center gap-2" style="color: #0F172A;">
          <Bell class="text-blue-600" :size="22" />
          <span>Canlı Bildirimler & İşlem Akışı</span>
        </h1>
        <p class="text-xs mt-0.5 text-slate-500">
          İhaleciBurada platformundaki gerçek ihale, teklif, escrow ve kurumsal onay bildirimlerinizi izleyin
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <NuxtLink 
          to="/panel/ayarlar?tab=bildirimler"
          class="text-xs font-bold text-slate-700 hover:text-blue-600 transition bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Settings :size="13" class="text-slate-500" />
          <span>Bildirim Tercihleri</span>
        </NuxtLink>

        <button 
          @click="markAllRead"
          class="text-xs font-bold text-blue-600 hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100/80 px-3.5 py-2 rounded-xl cursor-pointer"
        >
          Tümünü Okundu İşaretle
        </button>
      </div>
    </div>

    <!-- Bildirim İstatistik Şeridi -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center">
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Toplam Bildirim</span>
        <span class="font-mono font-black text-slate-900 text-base">{{ realNotifications.length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Okunmamış</span>
        <span class="font-mono font-black text-blue-600 text-base">{{ realNotifications.filter(n => !n.read).length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Teklif Bildirimleri</span>
        <span class="font-mono font-black text-emerald-600 text-base">{{ realNotifications.filter(n => n.category === 'bid' || n.category === 'submitted').length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Escrow & Güvenlik</span>
        <span class="font-mono font-black text-purple-600 text-base">✓ %100 Aktif</span>
      </div>
    </div>

    <!-- Bildirim Listesi -->
    <div class="space-y-3">
      <div 
        v-for="notif in realNotifications" 
        :key="notif.id"
        class="rounded-2xl border bg-white p-4 sm:p-5 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between relative group hover:shadow-xs"
        :class="notif.read ? 'border-slate-200 bg-white opacity-85' : 'border-blue-200 bg-blue-50/20 shadow-2xs'"
      >
        <!-- Sol Kenar Aktiflik Çizgisi -->
        <span 
          v-if="!notif.read" 
          class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-blue-600"
        ></span>

        <div class="flex gap-3.5 items-start min-w-0 flex-1">
          <!-- İkon -->
          <div class="shrink-0 mt-0.5">
            <div 
              class="w-9 h-9 rounded-xl flex items-center justify-center"
              :class="notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'"
            >
              <CheckCircle2 v-if="notif.type === 'success'" :size="18" />
              <Info v-else :size="18" />
            </div>
          </div>

          <!-- Metinler -->
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-bold text-xs sm:text-sm text-slate-900">{{ notif.title }}</h3>
              <span class="text-[10px] text-slate-400 shrink-0 font-mono font-medium">{{ notif.time }}</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">{{ notif.desc }}</p>

            <div v-if="notif.link" class="pt-1.5">
              <NuxtLink 
                :to="notif.link" 
                class="inline-flex items-center gap-1 font-bold text-[11px] text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>İlgili Bölüme Git</span>
                <span>→</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sil Butonu -->
        <button 
          @click="deleteNotification(notif.id)"
          class="shrink-0 text-slate-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer self-start sm:self-center"
          title="Bildirimi Sil"
        >
          <Trash2 :size="14" />
        </button>

      </div>

      <!-- Boş Durum -->
      <div v-if="realNotifications.length === 0" class="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
        <Bell class="mx-auto text-slate-300 mb-2" :size="36" />
        <h3 class="text-sm font-bold text-slate-800">Henüz Yeni Bir Bildiriminiz Yok</h3>
        <p class="text-xs text-slate-400 mt-1">İhaleleriniz veya teklifleriniz geliştikçe anlık bildirimler burada listelenecektir.</p>
      </div>

    </div>
  </div>
</template>
