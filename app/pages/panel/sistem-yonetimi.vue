<script setup lang="ts">
import SystemManagementView from '~/components/admin/SystemManagementView.vue'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Sistem Yönetimi, UAT & Güvenlik Matrisi (SEC-016 - SEC-020) | İhaleciBurada'
})
</script>

<template>
  <SystemManagementView />
</template>
