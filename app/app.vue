<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppTheme } from '~/composables/useAppTheme'
import { detectLocale } from '~/composables/useLocale'

const route = useRoute()

// ==================== DİNAMİK STANDART URL (CANONICAL) SİSTEMİ ====================
useHead(() => {
  const cleanPath = route.path === '/' ? '' : route.path.replace(/\/$/, '')
  return {
    link: [
      {
        rel: 'canonical',
        href: `https://ihaleciburada.com${cleanPath}`
      }
    ]
  }
})

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
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  letter-spacing: -0.012em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Safe-area insets for modern mobile devices (iOS notch, dynamic island, bottom bar) */
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
  --sar: env(safe-area-inset-right, 0px);
}

html.capacitor-native-app body {
  padding-top: var(--sat);
  padding-bottom: var(--sab);
  -webkit-tap-highlight-color: transparent;
}

html.capacitor-native-app input,
html.capacitor-native-app textarea,
html.capacitor-native-app [contenteditable] {
  user-select: text;
  -webkit-user-select: text;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif !important;
  letter-spacing: -0.024em;
  font-weight: 700;
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

/* ==================== MARKA LOGOSU KARANLIK MOD KONTRASTI ==================== */
html.dark svg text[fill="#0B1E3B"],
[data-theme="dark"] svg text[fill="#0B1E3B"],
.dark svg text[fill="#0B1E3B"] {
  fill: #FFFFFF !important;
}

html.dark svg path[fill="#0B1E3B"],
[data-theme="dark"] svg path[fill="#0B1E3B"],
.dark svg path[fill="#0B1E3B"] {
  fill: #38BDF8 !important;
}

/* ==================== WCAG 2.1 AA Erişilebilirlik :focus-visible ==================== */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid #0284C7 !important;
  outline-offset: 2px !important;
}

html.dark button:focus-visible,
html.dark a:focus-visible,
html.dark input:focus-visible,
html.dark select:focus-visible,
html.dark textarea:focus-visible,
html.dark [tabindex]:focus-visible {
  outline: 2px solid #38BDF8 !important;
  outline-offset: 2px !important;
}
</style>
