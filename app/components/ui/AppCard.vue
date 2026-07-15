<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true
})
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    :class="padding ? 'p-6' : ''"
  >
    <div
      v-if="title || subtitle"
      class="mb-6"
    >
      <h2
        v-if="title"
        class="text-xl font-bold text-slate-800"
      >
        {{ title }}
      </h2>

      <p
        v-if="subtitle"
        class="mt-1 text-sm text-slate-500"
      >
        {{ subtitle }}
      </p>
    </div>

    <slot />
  </div>
</template>