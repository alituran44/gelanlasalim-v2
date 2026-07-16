<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: "Kayıt bulunamadı",
  description: "Gösterilecek veri bulunmuyor."
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center"
  >
    <div
      class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200"
    >
      📂
    </div>

    <h3 class="text-xl font-bold text-slate-700">
      {{ title }}
    </h3>

    <p class="mt-2 max-w-sm text-slate-500">
      {{ description }}
    </p>

    <slot />
  </div>
</template>