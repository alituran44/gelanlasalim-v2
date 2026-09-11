<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, ShieldAlert, Settings, Building2, Send, Clock, Sparkles, ChevronRight, Lock, Check } from 'lucide-vue-next'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({ layout: 'dashboard' })

const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

const selectedFilter = ref<'all' | 'CRITICAL' | 'bid' | 'escrow'>('all')

const filteredNotifications = computed(() => {
  if (selectedFilter.value === 'all') return notifications.value
  if (selectedFilter.value === 'CRITICAL') {
    return notifications.value.filter(n => n.category === 'CRITICAL' || n.isMandatory)
  }
  if (selectedFilter.value === 'bid') {
    return notifications.value.filter(n => n.category === 'bid' || n.category === 'submitted')
  }
  if (selectedFilter.value === 'escrow') {
    return notifications.value.filter(n => n.category === 'escrow' || n.category === 'kyc')
  }
  return notifications.value
})

function markAllRead() {
  markAllAsRead()
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
          İhaleciBurada platformundaki resmî ihale, teklif, soru-cevap ve mevzuat bildirimlerinizi izleyin (Kural COM-001 – COM-010)
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
        <span class="font-mono font-black text-slate-900 text-base">{{ notifications.length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Okunmamış</span>
        <span class="font-mono font-black text-blue-600 text-base">{{ notifications.filter(n => !n.read).length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Kritik Bildirimler</span>
        <span class="font-mono font-black text-red-600 text-base">{{ notifications.filter(n => n.category === 'CRITICAL' || n.isMandatory).length }}</span>
      </div>
      <div class="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <span class="text-[9px] font-black text-slate-400 uppercase block">Escrow & Güvenlik</span>
        <span class="font-mono font-black text-purple-600 text-base">✓ %100 Aktif</span>
      </div>
    </div>

    <!-- Kategori Filtre Butonları -->
    <div class="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs font-bold">
      <button 
        @click="selectedFilter = 'all'"
        class="px-3 py-1.5 rounded-xl transition cursor-pointer"
        :class="selectedFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        Tümü ({{ notifications.length }})
      </button>
      <button 
        @click="selectedFilter = 'CRITICAL'"
        class="px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
        :class="selectedFilter === 'CRITICAL' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'"
      >
        <ShieldAlert :size="13" />
        <span>Kritik (Kapatılamaz - COM-003)</span>
      </button>
      <button 
        @click="selectedFilter = 'bid'"
        class="px-3 py-1.5 rounded-xl transition cursor-pointer"
        :class="selectedFilter === 'bid' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        Teklif & İhale Olayları
      </button>
      <button 
        @click="selectedFilter = 'escrow'"
        class="px-3 py-1.5 rounded-xl transition cursor-pointer"
        :class="selectedFilter === 'escrow' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        Escrow & KYC
      </button>
    </div>

    <!-- Bildirim Listesi -->
    <div class="space-y-3">
      <div 
        v-for="notif in filteredNotifications" 
        :key="notif.id"
        class="rounded-2xl border bg-white p-4 sm:p-5 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between relative group hover:shadow-xs"
        :class="notif.read ? 'border-slate-200 bg-white opacity-85' : 'border-blue-200 bg-blue-50/20 shadow-2xs'"
      >
        <!-- Sol Kenar Aktiflik Çizgisi -->
        <span 
          v-if="!notif.read" 
          class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          :class="notif.category === 'CRITICAL' ? 'bg-red-600' : 'bg-blue-600'"
        ></span>

        <div class="flex gap-3.5 items-start min-w-0 flex-1">
          <!-- İkon -->
          <div class="shrink-0 mt-0.5">
            <div 
              class="w-9 h-9 rounded-xl flex items-center justify-center"
              :class="notif.category === 'CRITICAL' ? 'bg-red-50 text-red-600 border border-red-200' : (notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200')"
            >
              <ShieldAlert v-if="notif.category === 'CRITICAL'" :size="18" />
              <CheckCircle2 v-else-if="notif.type === 'success'" :size="18" />
              <Info v-else :size="18" />
            </div>
          </div>

          <!-- Metinler -->
          <div class="flex-1 min-w-0 space-y-1.5">
            <div class="flex flex-wrap items-center gap-2 justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <span 
                  v-if="notif.category === 'CRITICAL' || notif.isMandatory"
                  class="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-black border border-red-200"
                >
                  KRİTİK (Kapatılamaz - COM-003)
                </span>
                <span 
                  v-else
                  class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                >
                  Bilgilendirme
                </span>
                <h3 class="font-bold text-xs sm:text-sm text-slate-900">{{ notif.title }}</h3>
              </div>
              <span class="text-[10px] text-slate-400 shrink-0 font-mono font-medium">{{ notif.time }}</span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">{{ notif.desc }}</p>

            <!-- Kanallar ve Okundu Zamanı (COM-002, COM-009) -->
            <div class="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500">
              <div class="flex items-center gap-1">
                <span class="text-slate-400 font-bold">Kanallar (COM-002):</span>
                <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Sistem İçi</span>
                <span v-if="(notif.channels || []).includes('SMS')" class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">SMS</span>
                <span v-if="(notif.channels || []).includes('EMAIL')" class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">E-Posta</span>
              </div>

              <div v-if="notif.readAt" class="flex items-center gap-1 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <Check :size="11" />
                <span>Okundu: {{ new Date(notif.readAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }} (COM-009)</span>
              </div>

              <button 
                v-else
                @click="markAsRead(notif.id)"
                class="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
              >
                Okundu İşaretle
              </button>
            </div>

            <div v-if="notif.link" class="pt-1">
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

        <!-- Sil Butonu veya Kilit Rozeti (COM-003) -->
        <div class="shrink-0 self-start sm:self-center">
          <div 
            v-if="notif.isMandatory || notif.category === 'CRITICAL'" 
            class="text-slate-400 p-1.5 rounded-lg bg-slate-50 border border-slate-200" 
            title="Kural COM-003: Kritik sistem bildirimleri kapatılamaz ve silinemez."
          >
            <Lock :size="14" class="text-slate-400" />
          </div>
          <button 
            v-else
            @click="deleteNotification(notif.id)"
            class="text-slate-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Bildirimi Sil"
          >
            <Trash2 :size="14" />
          </button>
        </div>

      </div>

      <!-- Boş Durum -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
        <Bell class="mx-auto text-slate-300 mb-2" :size="36" />
        <h3 class="text-sm font-bold text-slate-800">Bu Kategoride Bildirim Bulunmuyor</h3>
        <p class="text-xs text-slate-400 mt-1">İhaleleriniz veya teklifleriniz geliştikçe anlık bildirimler burada listelenecektir.</p>
      </div>

    </div>
  </div>
</template>
