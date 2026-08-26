<script setup lang="ts">
interface Props {
  variant?: "primary" | "emerald" | "amber" | "secondary" | "outline" | "danger" | "ghost"
  size?: "xs" | "sm" | "md" | "lg"
  block?: boolean
  loading?: boolean
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  block: false,
  loading: false,
  disabled: false,
  type: "button"
})

const variants = {
  primary:
    "bg-[#0F223D] hover:bg-[#1A3358] text-white shadow-xs border border-[#1A3358] focus:ring-2 focus:ring-[#0052FF]/30",
  emerald:
    "bg-[#10B981] hover:bg-[#059669] text-white shadow-xs border border-emerald-600 focus:ring-2 focus:ring-emerald-400/40",
  amber:
    "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs border border-amber-300 font-black focus:ring-2 focus:ring-amber-400/40",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-2 focus:ring-slate-300",
  outline:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-200",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-xs border border-red-700 focus:ring-2 focus:ring-red-400/40",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent"
}

const sizes = {
  xs: "px-2.5 py-1 text-[10px] rounded-lg gap-1",
  sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
  md: "px-4 py-2.5 text-xs rounded-xl gap-2 font-bold",
  lg: "px-6 py-3.5 text-sm rounded-2xl gap-2.5 font-black"
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 active:scale-[0.98] select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
    :class="[
      variants[props.variant],
      sizes[props.size],
      block ? 'w-full' : ''
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>