<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  block: false
})

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-slate-200 hover:bg-slate-300 text-slate-800",

  success:
    "bg-green-600 hover:bg-green-700 text-white",

  danger:
    "bg-red-600 hover:bg-red-700 text-white"
}

const sizes = {
  sm: "px-3 py-2 text-sm",

  md: "px-5 py-3",

  lg: "px-7 py-4 text-lg"
}
</script>

<template>
  <button
    class="rounded-xl font-semibold transition duration-200 active:scale-95"
    :class="[
      variants[props.variant],
      sizes[props.size],
      block ? 'w-full' : ''
    ]"
  >
    <slot />
  </button>
</template>