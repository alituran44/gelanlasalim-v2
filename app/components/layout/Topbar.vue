<script setup lang="ts">
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { Search, Bell, Plus, ChevronDown } from "lucide-vue-next"

const route = useRoute()
const search = ref("")
const notifCount = ref(3)
const showUserMenu = ref(false)

const userSession = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('userSession') || '{}')
  } catch {
    return {}
  }
})

const userName = computed(() => userSession.value?.firstName || 'Kullanıcı')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/panel': 'Dashboard',
    '/panel/ilanlarim': 'İlanlarım',
    '/panel/gelen-teklifler': 'Gelen Teklifler',
    '/panel/yaptigim-teklifler': 'Yaptığım Teklifler',
    '/panel/mesajlar': 'Mesajlar',
    '/panel/bildirimler': 'Bildirimler',
    '/panel/ayarlar': 'Ayarlar',
    '/panel/ihale-olustur': 'Yeni İhale Oluştur',
  }
  return titles[route.path] || 'Panel'
})
</script>

<template>
  <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6"
    style="border-color: #E2E8F0;">

    <!-- Sol: Sayfa Başlığı -->
    <div class="flex items-center gap-4">
      <div>
        <h2 class="text-base font-semibold" style="color: #0F172A;">{{ pageTitle }}</h2>
        <p class="text-xs" style="color: #94A3B8;">GelAnlaşalım B2B Platformu</p>
      </div>

      <!-- Arama -->
      <div class="relative hidden md:block">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2" :size="15" style="color: #94A3B8;" />
        <input
          v-model="search"
          type="text"
          placeholder="İhale ara..."
          class="w-64 rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition"
          style="border-color: #E2E8F0; background: #F8FAFC; color: #0F172A;"
          onfocus="this.style.borderColor='#F59E0B'; this.style.boxShadow='0 0 0 3px rgba(245,158,11,0.1)'"
          onblur="this.style.borderColor='#E2E8F0'; this.style.boxShadow='none'"
        />
      </div>
    </div>

    <!-- Sağ: Aksiyonlar -->
    <div class="flex items-center gap-2">

      <!-- Yeni İhale Butonu -->
      <NuxtLink
        to="/panel/ihale-olustur"
        class="hidden md:flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
        style="background: #1E3A5F;"
        onmouseover="this.style.background='#F59E0B'"
        onmouseout="this.style.background='#1E3A5F'"
      >
        <Plus :size="16" />
        Yeni İhale
      </NuxtLink>

      <!-- Bildirim -->
      <button class="relative flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-slate-50"
        style="border-color: #E2E8F0;">
        <Bell :size="17" style="color: #475569;" />
        <span
          v-if="notifCount > 0"
          class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style="background: #EF4444;"
        >
          {{ notifCount }}
        </span>
      </button>

      <!-- Kullanıcı -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition hover:bg-slate-50"
          style="border-color: #E2E8F0;"
        >
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style="background: #1E3A5F;"
          >
            {{ userInitial }}
          </div>
          <span class="hidden md:block font-medium" style="color: #0F172A;">{{ userName }}</span>
          <ChevronDown :size="14" style="color: #94A3B8;" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-11 z-50 w-44 rounded-xl border bg-white shadow-lg py-1"
          style="border-color: #E2E8F0;"
        >
          <NuxtLink to="/panel/ayarlar" @click="showUserMenu=false"
            class="block px-4 py-2 text-sm hover:bg-slate-50 transition" style="color: #475569;">
            Profil Ayarları
          </NuxtLink>
          <NuxtLink to="/abonelik" @click="showUserMenu=false"
            class="block px-4 py-2 text-sm hover:bg-slate-50 transition" style="color: #475569;">
            Abonelik
          </NuxtLink>
          <div class="my-1 border-t" style="border-color: #F1F5F9;"></div>
          <button
            @click="() => { localStorage.removeItem('userSession'); $router.push('/') }"
            class="block w-full px-4 py-2 text-left text-sm transition hover:bg-red-50"
            style="color: #EF4444;"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

    </div>
  </header>
</template>