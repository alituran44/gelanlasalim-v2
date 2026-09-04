<script setup lang="ts">
import { navigateTo } from '#imports'

// Redirect /legal to /sozlesmeler (or specific tab if provided in query)
const route = useRoute()
const tab = route.query.tab || 'kullanim'

await navigateTo(`/sozlesmeler?tab=${tab}`, { redirectCode: 301, replace: true })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800 font-sans">
    <div class="text-center space-y-3">
      <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm font-bold text-slate-600">Yasal sözleşmelere yönlendiriliyorsunuz...</p>
    </div>
  </div>
</template>
