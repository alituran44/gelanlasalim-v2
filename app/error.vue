<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { clearError } from '#app'
import { AlertTriangle, Home, RefreshCw, ShieldAlert, FileQuestion, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  error: {
    type: Object as PropType<{
      statusCode?: number
      statusMessage?: string
      message?: string
      stack?: string
    }>,
    required: true
  }
})

const statusCode = computed(() => Number(props.error?.statusCode) || 500)

const isNotFound = computed(() => statusCode.value === 404)
const isForbidden = computed(() => statusCode.value === 403 || statusCode.value === 401)

const errorTitle = computed(() => {
  if (isNotFound.value) return 'Sayfa Bulunamadı'
  if (isForbidden.value) return 'Yetkisiz Erişim Engellendi'
  return 'Sistem İşlem Hatası'
})

const errorDescription = computed(() => {
  if (isNotFound.value) {
    return 'Ulaşmaya çalıştığınız sayfa veya kaynak kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.'
  }
  if (isForbidden.value) {
    return 'Bu sayfayı veya kurumsal kaynağı görüntülemek için gerekli yetkilere ya da aktif oturuma sahip değilsiniz. Lütfen kurumsal giriş yapınız.'
  }
  return 'İşleminiz gerçekleştirilirken beklenmeyen bir durum oluştu. Güvenlik ve veri bütünlüğü protokolleri gereği işlem durduruldu. Lütfen tekrar deneyiniz.'
})

function handleGoHome() {
  clearError({ redirect: '/' })
}

function handleGoMarketplace() {
  clearError({ redirect: '/pazar-yeri' })
}

function handleGoLogin() {
  clearError({ redirect: '/uyelik' })
}

function handleReload() {
  clearError({ redirect: window.location.pathname })
}
</script>

<template>
  <div class="min-h-screen bg-[#070D18] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300 font-sans antialiased">
    <!-- Üst Bar / Minimalist Güvenlik Şeridi -->
    <header class="border-b border-slate-800/80 bg-[#0B1326]/80 backdrop-blur-md px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm tracking-wider">
            İB
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              İhaleciBurada
            </span>
            <span class="text-[10px] text-slate-400 tracking-wider uppercase">
              B2B Dijital İhale Platformu
            </span>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Sistem Güvenliği Aktif
          </span>
        </div>
      </div>
    </header>

    <!-- Ana Hata Gövdesi -->
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-2xl bg-[#0B1326] border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <!-- Arka Plan İnce Vurgu -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col items-center text-center">
          <!-- Hata İkonu & Durum Kodu -->
          <div class="mb-6 relative">
            <div class="w-20 h-20 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-300"
              :class="{
                'bg-amber-500/10 border-amber-500/30 text-amber-400': isNotFound,
                'bg-rose-500/10 border-rose-500/30 text-rose-400': isForbidden,
                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400': !isNotFound && !isForbidden
              }">
              <FileQuestion v-if="isNotFound" :size="38" />
              <ShieldAlert v-else-if="isForbidden" :size="38" />
              <AlertTriangle v-else :size="38" />
            </div>
            <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#070D18] border border-slate-700 text-slate-300">
              {{ statusCode }}
            </span>
          </div>

          <!-- Başlık ve Açıklama -->
          <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            {{ errorTitle }}
          </h1>
          <p class="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mb-8">
            {{ errorDescription }}
          </p>

          <!-- Aksiyon Butonları -->
          <div class="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            <button
              type="button"
              @click="handleGoHome"
              class="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-[#070D18] font-semibold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0B1326]"
            >
              <Home :size="16" />
              Ana Sayfaya Dön
            </button>

            <button
              v-if="isForbidden"
              type="button"
              @click="handleGoLogin"
              class="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Giriş Yap
              <ArrowRight :size="16" />
            </button>

            <button
              v-else-if="isNotFound"
              type="button"
              @click="handleGoMarketplace"
              class="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              İhale Pazar Yeri
              <ArrowRight :size="16" />
            </button>

            <button
              v-else
              type="button"
              @click="handleReload"
              class="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <RefreshCw :size="16" />
              Sayfayı Yenile
            </button>
          </div>

          <!-- Güvenlik & Destek Bilgisi -->
          <div class="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-slate-500">
            <span>Referans: SEC-{{ statusCode }}-{{ Math.floor(Date.now() / 1000).toString(16).toUpperCase() }}</span>
            <NuxtLink to="/yardim" class="text-slate-400 hover:text-emerald-400 transition-colors">
              Destek Al &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Alt Bilgi -->
    <footer class="border-t border-slate-800/80 bg-[#0B1326]/60 px-6 py-4 text-center text-xs text-slate-500">
      <p>&copy; 2026 İhaleciBurada. 6698 sayılı KVKK ve ISO 27001 bilgi güvenliği standartları kapsamında korunmaktadır.</p>
    </footer>
  </div>
</template>
