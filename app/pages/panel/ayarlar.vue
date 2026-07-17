<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Settings, ShieldCheck, Building, Key, ShieldAlert, CheckCircle2 } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

const companyData = ref({
  name: 'GelAnlaşalım Satın Alma Hizmetleri A.Ş.',
  mersis: '0901-8392-4820-0012',
  kep: 'gelanlasalim@hs03.kep.tr',
  taxOffice: 'Maslak Vergi Dairesi',
  taxNumber: '9280183920',
  address: 'Maslak Mahallesi, Dereboyu Caddesi No:42, Sarıyer/İstanbul'
})

const userData = ref({
  firstName: 'Kemal',
  lastName: 'Yılmaz',
  email: 'kamu_ihale@gelanlasalim.com',
  phone: '+90 (555) 018 39 20',
  role: 'buyer',
  isPremium: false
})

const showSaveSuccess = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedSession = localStorage.getItem('userSession')
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        userData.value.firstName = parsed.firstName || userData.value.firstName
        userData.value.lastName = parsed.lastName || userData.value.lastName
        userData.value.email = parsed.email || userData.value.email
        userData.value.role = parsed.role || userData.value.role
        userData.value.isPremium = !!parsed.isPremium
        companyData.value.name = parsed.company || companyData.value.name
      } catch (e) {
        console.error('Failed to parse user session in settings page', e)
      }
    }
  }
})

function handleSave() {
  if (typeof window !== 'undefined') {
    const savedSession = localStorage.getItem('userSession')
    const parsed = savedSession ? JSON.parse(savedSession) : {}
    parsed.firstName = userData.value.firstName
    parsed.lastName = userData.value.lastName
    parsed.email = userData.value.email
    parsed.company = companyData.value.name
    localStorage.setItem('userSession', JSON.stringify(parsed))
  }
  
  showSaveSuccess.value = true
  setTimeout(() => {
    showSaveSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto text-left">
    
    <!-- Başlık -->
    <div class="mb-6">
      <h1 class="text-xl font-bold flex items-center gap-2" style="color: #0F172A;">
        <Settings class="text-blue-600" :size="22" />
        Firma & Profil Ayarları
      </h1>
      <p class="text-sm mt-0.5" style="color: #64748B;">Kurumsal firma kaydınızı ve kullanıcı hesabı tercihlerinizi yönetin</p>
    </div>

    <!-- Başarı Mesajı -->
    <div v-if="showSaveSuccess" class="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-bold flex items-center gap-2">
      <CheckCircle2 class="text-emerald-500 shrink-0" :size="18" />
      Profil ve firma bilgileri başarıyla kaydedildi!
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Sol Kolon: Üyelik Durumu & Kartlar -->
      <div class="space-y-6">
        
        <!-- Üyelik Durumu Kartı -->
        <div class="rounded-xl border bg-white p-5 shadow-sm" style="border-color: #E2E8F0;">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Üyelik Modeli</h3>
          
          <div class="flex items-center gap-3 mb-4">
            <div 
              class="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
              :class="userData.isPremium ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'"
            >
              <ShieldCheck v-if="userData.isPremium" :size="22" />
              <ShieldAlert v-else :size="22" />
            </div>
            <div>
              <div class="font-bold text-sm" :class="userData.isPremium ? 'text-amber-600' : 'text-slate-700'">
                {{ userData.isPremium ? 'B2B PREMIUM ÜYE' : 'STANDART (ÜCRETSİZ)' }}
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ userData.isPremium ? 'Premium ayrıcalıklar aktif' : 'Sınırlı ihale katılımı' }}
              </p>
            </div>
          </div>

          <!-- Yükseltme Yönlendirmesi -->
          <NuxtLink 
            v-if="!userData.isPremium"
            to="/abonelik"
            class="block w-full text-center rounded-lg bg-amber-500 hover:bg-amber-600 py-2.5 text-xs font-bold text-white transition shadow-sm"
          >
            Premium'a Yükselt
          </NuxtLink>
          <div 
            v-else
            class="w-full text-center rounded-lg bg-emerald-50 text-emerald-700 py-2.5 text-xs font-bold border border-emerald-200"
          >
            Tüm Özellikler Açık
          </div>

        </div>

        <!-- Rol Bilgisi -->
        <div class="rounded-xl border bg-white p-5 shadow-sm" style="border-color: #E2E8F0;">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform Rolü</h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-3">
            Hesabınızın yetki rolü şu anda <strong>{{ userData.role === 'buyer' ? 'Alıcı Firma' : 'Tedarikçi' }}</strong> olarak tanımlanmıştır. Rol değişikliği için müşteri hizmetleriyle irtibata geçiniz.
          </p>
          <span 
            class="inline-flex rounded px-2.5 py-1 text-xs font-bold"
            :class="userData.role === 'buyer' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'"
          >
            {{ userData.role === 'buyer' ? 'Alıcı (Canlı Eksiltme İhalesi Açar)' : 'Tedarikçi (İhalelere Teklif Verir)' }}
          </span>
        </div>

      </div>

      <!-- Sağ Kolon: Formlar -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Kişisel Bilgiler -->
        <div class="rounded-xl border bg-white p-6 shadow-sm" style="border-color: #E2E8F0;">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Key class="text-blue-500" :size="16" />
            Kişisel Bilgiler
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">ADINIZ</label>
              <input v-model="userData.firstName" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">SOYADINIZ</label>
              <input v-model="userData.lastName" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">E-POSTA ADRESİ</label>
              <input v-model="userData.email" type="email" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">TELEFON</label>
              <input v-model="userData.phone" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
            </div>
          </div>
        </div>

        <!-- Firma Kurumsal Bilgileri -->
        <div class="rounded-xl border bg-white p-6 shadow-sm" style="border-color: #E2E8F0;">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Building class="text-blue-500" :size="16" />
            Firma Kurumsal Bilgileri
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">FİRMA UNVANI</label>
              <input v-model="companyData.name" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">MERSİS NUMARASI</label>
                <input v-model="companyData.mersis" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">KEP ADRESİ</label>
                <input v-model="companyData.kep" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">VERGİ DAİRESİ</label>
                <input v-model="companyData.taxOffice" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">VERGİ NUMARASI</label>
                <input v-model="companyData.taxNumber" type="text" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">FİRMA MERKEZ ADRESİ</label>
              <textarea v-model="companyData.address" rows="3" class="w-full rounded-lg border p-2.5 text-xs outline-none bg-slate-50" style="border-color: #E2E8F0; color: #0F172A;"></textarea>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t flex justify-end" style="border-color: #F1F5F9;">
            <button 
              @click="handleSave"
              class="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 transition shadow-md shadow-blue-500/10"
            >
              Değişiklikleri Kaydet
            </button>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
