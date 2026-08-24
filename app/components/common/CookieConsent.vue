<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Cookie, X, ShieldCheck, ExternalLink } from 'lucide-vue-next'

const showConsent = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const accepted = localStorage.getItem('cookieConsentAccepted')
      if (!accepted) {
        // Show after brief delay for smooth appearance
        setTimeout(() => {
          showConsent.value = true
        }, 500)
      }
    } catch (e) {
      console.error('Cookie consent check failed', e)
    }
  }
})

function acceptAll() {
  showConsent.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('cookieConsentAccepted', 'true')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
  }
}

function acceptEssential() {
  showConsent.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('cookieConsentAccepted', 'essential')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
  }
}
</script>

<template>
  <Transition name="cookie-slide">
    <div
      v-if="showConsent"
      class="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md z-[99999] rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl text-left font-sans animate-fadeIn"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#003057]/10 text-[#003057]">
            <Cookie :size="18" />
          </div>
          <div>
            <h4 id="cookie-title" class="text-xs font-black text-slate-900 uppercase tracking-wider">
              Çerez & KVKK Onayı
            </h4>
            <span class="text-[10px] text-slate-400 font-bold block">6698 Sayılı KVKK Uyumlu</span>
          </div>
        </div>

        <!-- Close / Dismiss button -->
        <button
          type="button"
          @click="acceptEssential"
          class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          title="Kapat"
        >
          <X :size="16" />
        </button>
      </div>

      <p id="cookie-desc" class="mt-3 text-[11px] leading-relaxed text-slate-600 font-medium">
        Platformumuzda oturum güvenliği, canlı ihale teklif akışı ve kullanıcı deneyimini optimize etmek amacıyla zorunlu ve analitik çerezler kullanılmaktadır. 
        <NuxtLink to="/sozlesmeler?tab=cerez" class="text-[#003057] font-bold underline hover:text-[#1EAE4C] ml-1 inline-flex items-center gap-0.5">
          <span>Çerez Politikası</span>
          <ExternalLink :size="10" />
        </NuxtLink>
      </p>

      <!-- Action Buttons (Responsive Grid on Mobile) -->
      <div class="mt-4 flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          @click="acceptAll"
          class="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#003057] hover:bg-[#1EAE4C] text-white font-black text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShieldCheck :size="14" class="text-emerald-400" />
          <span>Tümünü Kabul Et</span>
        </button>

        <button
          type="button"
          @click="acceptEssential"
          class="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer text-center"
        >
          Sadece Zorunlular
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
