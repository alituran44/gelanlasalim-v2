<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppButton from "~/components/ui/AppButton.vue"

const userSession = ref<any>(null)

const isLoggedIn = computed(() => {
  if (!userSession.value) return false
  return !!(userSession.value.email || userSession.value.name || userSession.value.username)
})

function checkSession() {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('userSession')
      if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '{}') {
        userSession.value = JSON.parse(raw)
      } else {
        userSession.value = null
      }
    } catch {
      userSession.value = null
    }
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
    localStorage.removeItem('guestSession')
    window.location.reload()
  }
}

onMounted(() => {
  checkSession()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkSession)
  }
})

const menu = [
  { title: "İhaleler", to: "/pazar-yeri" },
  { title: "Firmalar", to: "/panel/firmalar" },
  { title: "Nasıl Çalışır", to: "/#how" },
  { title: "Abonelik Paketleri", to: "/abonelik" },
  { title: "Sözleşmeler & Bilgi", to: "/sozlesmeler" }
]
const isAudioNotificationEnabled = ref(true)

function playNotificationChime() {
  if (!isAudioNotificationEnabled.value || typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch (e) {}
}

function toggleAudioNotification() {
  isAudioNotificationEnabled.value = !isAudioNotificationEnabled.value
  if (isAudioNotificationEnabled.value) {
    playNotificationChime()
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
          İ
        </div>
        <div>
          <div class="text-xl font-black text-slate-800">
            İhaleciBurada
          </div>
          <div class="text-xs text-slate-500">
            B2B Dijital İhale Platformu
          </div>
        </div>
      </NuxtLink>

      <!-- Menü -->
      <nav class="hidden items-center gap-8 lg:flex">
        <NuxtLink
          v-for="item in menu"
          :key="item.title"
          :to="item.to"
          class="font-medium text-slate-600 transition hover:text-blue-600"
        >
          {{ item.title }}
        </NuxtLink>
      </nav>

      <!-- Sağ: Giriş Yapılmışsa Panel & Çıkış, Yapılmamışsa Giriş & Başla -->
      <div class="flex items-center gap-3">
        <template v-if="!isLoggedIn">
          <NuxtLink to="/uyelik?tab=login">
            <AppButton variant="secondary">
              Giriş Yap
            </AppButton>
          </NuxtLink>

          <NuxtLink to="/uyelik?tab=register">
            <AppButton>
              Hemen Başla
            </AppButton>
          </NuxtLink>
        </template>

        <template v-else>
          <NuxtLink to="/panel">
            <AppButton>
              🎛️ Panelime Git
            </AppButton>
          </NuxtLink>

          <button 
            @click="handleLogout" 
            class="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer border border-red-200"
          >
            Çıkış Yap
          </button>
        </template>
      </div>
    </div>
  </header>
</template>
