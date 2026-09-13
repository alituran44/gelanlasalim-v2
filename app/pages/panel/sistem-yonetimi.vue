<script setup lang="ts">
definePageMeta({
  middleware: [
    () => {
      return navigateTo('/admin?tab=system_ops')
    }
  ]
})
</script>

<template>
  <div></div>
</template>

