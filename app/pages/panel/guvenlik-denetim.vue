<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShieldCheck, ArrowRight, Lock } from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'Yetkilendirme Kontrolü | İhaleciBurada',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { userSession } = useUserSession()

onMounted(() => {
  // Sadece yetkili yöneticiler yönetim panelindeki Güvenlik & Denetim sekmesine erişebilir.
  // Normal kullanıcıların sistemik güvenlik denetim kayıtlarına erişimi sınırlandırılmıştır.
  const isAdmin = 
    userSession.value?.role === 'ADMIN' ||
    (typeof window !== 'undefined' && Boolean(localStorage.getItem('adminToken'))) ||
    (typeof document !== 'undefined' && document.cookie.includes('ihb_auth=1'))

  if (isAdmin) {
    router.replace('/admin?tab=security_audit')
  } else {
    // Normal kullanıcıyı güvenle paneline geri yönlendir
    router.replace('/panel')
  }
})
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-6 text-center">
    <div class="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <Lock :size="28" />
      </div>
      
      <div class="space-y-1">
        <h2 class="text-lg font-black text-slate-900 dark:text-white">
          Yönetici Güvenlik Alanı
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Sistem ve manipülasyon denetim kayıtları yalnızca yetkili yöneticilere açıktır. Güvenli bölgeye yönlendiriliyorsunuz...
        </p>
      </div>

      <div class="pt-2 flex justify-center">
        <NuxtLink
          to="/panel"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
        >
          <span>Panele Geri Dön</span>
          <ArrowRight :size="14" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
