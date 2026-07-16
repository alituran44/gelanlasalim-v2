<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}

function closeOutside(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  window.addEventListener("click", closeOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener("click", closeOutside)
})
</script>

<template>
  <div
    ref="root"
    class="relative inline-block"
  >
    <div @click.stop="toggle">
      <slot name="trigger" />
    </div>

    <Transition
      enter-active-class="transition duration-150"
      leave-active-class="transition duration-150"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 z-40 mt-3 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>