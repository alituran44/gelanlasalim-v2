<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppTheme } from '~/composables/useAppTheme'
import { detectLocale } from '~/composables/useLocale'

const { initTheme } = useAppTheme()

onMounted(() => {
  if (typeof window !== 'undefined') {
    const SCHEMA_VERSION = 'v2026_08_30_clean_slate_final_1'
    if (localStorage.getItem('cms_schema_version') !== SCHEMA_VERSION) {
      localStorage.removeItem('cmsData')
      localStorage.removeItem('myTenders')
      localStorage.setItem('cms_schema_version', SCHEMA_VERSION)
    }
  }
  initTheme()
  detectLocale()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body, html {
  font-family: 'Inter', sans-serif !important;
  transition: background-color 0.3s ease, color 0.3s ease;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif !important;
}

.premium-shadow {
  box-shadow: 0 10px 30px -10px rgba(0, 48, 87, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
  border-color: rgba(226, 232, 240, 0.8) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-shadow:hover {
  box-shadow: 0 20px 40px -15px rgba(0, 48, 87, 0.15), 0 0 0 1px rgba(30, 174, 76, 0.25) !important;
  transform: translateY(-3px);
}

/* ==================== AKTİF KARANLIK (DARK) TEMA STİLLERİ ==================== */
html.dark {
  color-scheme: dark;
  background-color: #0B0F19 !important;
}

html.dark body {
  background-color: #0B0F19 !important;
  color: #E2E8F0 !important;
}

html.dark .bg-white {
  background-color: #111827 !important;
  color: #F8FAFC !important;
}

html.dark .bg-slate-50,
html.dark .bg-slate-100 {
  background-color: #1E293B !important;
  color: #E2E8F0 !important;
}

html.dark .bg-\[\#F4F6F9\],
html.dark .bg-slate-200 {
  background-color: #0B0F19 !important;
}

html.dark .border-slate-200,
html.dark .border-slate-300,
html.dark .border-slate-100 {
  border-color: #334155 !important;
}

html.dark .text-slate-800,
html.dark .text-slate-900,
html.dark .text-slate-700 {
  color: #F8FAFC !important;
}

html.dark .text-slate-500,
html.dark .text-slate-600 {
  color: #94A3B8 !important;
}

html.dark input:not([type="checkbox"]),
html.dark select,
html.dark textarea {
  background-color: #1E293B !important;
  color: #FFFFFF !important;
  border-color: #475569 !important;
}
</style>
