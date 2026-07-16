<script setup lang="ts">
definePageMeta({
  layout: "dashboard"
})

import StatsCards from "~/components/dashboard/StatsCards.vue"
import DashboardChart from "~/components/dashboard/DashboardChart.vue"
import QuickActions from "~/components/dashboard/QuickActions.vue"
import RecentTenders from "~/components/dashboard/RecentTenders.vue"
import RecentOffers from "~/components/dashboard/RecentOffers.vue"
import ActivityFeed from "~/components/dashboard/ActivityFeed.vue"
import Notifications from "~/components/dashboard/Notifications.vue"
</script>

<template>
  <div class="space-y-6">

    <!-- İstatistik Kartları -->
    <StatsCards />

    <!-- Grafik + Hızlı İşlemler -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">

      <div class="xl:col-span-2">
        <DashboardChart />
      </div>

      <QuickActions />

    </div>

    <!-- Son İhaleler + Gelen Teklifler -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <RecentTenders />

      <RecentOffers />

    </div>

    <!-- Aktivite + Bildirim -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <ActivityFeed />

      <Notifications />

    </div>

  </div>
</template>