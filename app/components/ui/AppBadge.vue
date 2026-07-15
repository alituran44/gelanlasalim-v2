<script setup lang="ts">
interface Props {
  color?: "blue" | "green" | "yellow" | "red" | "gray"
}

const props = withDefaults(defineProps<Props>(), {
  color: "blue"
})

const colors = {
  blue:
    "bg-blue-100 text-blue-700",

  green:
    "bg-green-100 text-green-700",

  yellow:
    "bg-yellow-100 text-yellow-700",

  red:
    "bg-red-100 text-red-700",

  gray:
    "bg-slate-100 text-slate-700"
}
</script>

<template>
  <span
    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
    :class="colors[props.color]"
  >
    <slot />
  </span>
</template>