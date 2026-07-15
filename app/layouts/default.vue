<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
import Topbar from '~/components/layout/Topbar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-100">

    <div class="flex">

      <!-- Sidebar -->
      <Sidebar />

      <!-- Main -->
      <div class="flex min-h-screen flex-1 flex-col">

        <!-- Topbar -->
        <Topbar />

        <!-- Page -->
        <main class="flex-1 p-8">
          <slot />
        </main>

      </div>

    </div>

  </div>
</template>