<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "close"): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div
          class="flex items-center justify-between border-b border-slate-200 p-5"
        >
          <h2 class="text-xl font-bold">
            {{ title }}
          </h2>

          <button
            class="text-2xl text-slate-400 hover:text-slate-700"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <div class="p-6">
          <slot />
        </div>

      </div>
    </div>
  </Teleport>
</template>