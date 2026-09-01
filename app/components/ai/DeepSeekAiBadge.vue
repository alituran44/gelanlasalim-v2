<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

defineProps<{
  score?: number | string
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black shadow-2xs">
    <Sparkles :size="11" class="text-blue-600 animate-pulse" />
    <span>DeepSeek AI Onaylı (%{{ score || '98.5' }})</span>
  </span>
</template>
