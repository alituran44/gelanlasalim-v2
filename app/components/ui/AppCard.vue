<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  variant?: "white" | "obsidian" | "subtle"
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: "white",
  padding: "md",
  hover: true
})

const variants = {
  white: "bg-white border-slate-200 text-slate-900 shadow-xs",
  obsidian: "bg-[#0B1528] border-[#1E2D4A] text-white shadow-md",
  subtle: "bg-slate-50/70 border-slate-200/80 text-slate-900"
}

const paddings = {
  none: "p-0",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8"
}
</script>

<template>
  <div
    class="rounded-2xl sm:rounded-3xl border transition-all duration-200 text-left"
    :class="[
      variants[props.variant],
      paddings[props.padding],
      hover ? 'hover:shadow-md hover:border-slate-300' : ''
    ]"
  >
    <div
      v-if="title || subtitle || $slots.header"
      class="mb-4 sm:mb-5 pb-3 border-b border-inherit/60 flex items-center justify-between gap-3"
    >
      <div>
        <h3
          v-if="title"
          class="text-base font-black tracking-tight"
          :class="variant === 'obsidian' ? 'text-white' : 'text-slate-900'"
        >
          {{ title }}
        </h3>

        <p
          v-if="subtitle"
          class="mt-0.5 text-xs font-medium"
          :class="variant === 'obsidian' ? 'text-slate-400' : 'text-slate-500'"
        >
          {{ subtitle }}
        </p>
      </div>

      <slot name="header-action" />
    </div>

    <slot />

    <div v-if="$slots.footer" class="mt-4 pt-3 border-t border-inherit/60">
      <slot name="footer" />
    </div>
  </div>
</template>