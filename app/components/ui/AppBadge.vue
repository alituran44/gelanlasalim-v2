<script setup lang="ts">
interface Props {
  color?: "emerald" | "blue" | "amber" | "red" | "purple" | "slate"
  size?: "xs" | "sm" | "md"
  rounded?: "full" | "lg" | "md"
  hasDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "blue",
  size: "sm",
  rounded: "full",
  hasDot: false
})

const colors = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  blue: "bg-blue-50 text-[#0052FF] border-blue-200/80",
  amber: "bg-amber-50 text-amber-800 border-amber-300/80",
  red: "bg-red-50 text-red-700 border-red-200/80",
  purple: "bg-purple-50 text-purple-700 border-purple-200/80",
  slate: "bg-slate-100 text-slate-700 border-slate-200"
}

const dotColors = {
  emerald: "bg-emerald-500",
  blue: "bg-[#0052FF]",
  amber: "bg-amber-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  slate: "bg-slate-400"
}

const sizes = {
  xs: "px-2 py-0.5 text-[9px] gap-1",
  sm: "px-2.5 py-0.5 text-[10px] gap-1.5",
  md: "px-3 py-1 text-xs gap-1.5"
}

const roundedMap = {
  full: "rounded-full",
  lg: "rounded-xl",
  md: "rounded-lg"
}
</script>

<template>
  <span
    class="inline-flex items-center font-black border uppercase tracking-wider select-none shrink-0"
    :class="[
      colors[props.color],
      sizes[props.size],
      roundedMap[props.rounded]
    ]"
  >
    <span
      v-if="hasDot"
      class="h-1.5 w-1.5 rounded-full shrink-0"
      :class="dotColors[props.color]"
    ></span>
    <slot />
  </span>
</template>