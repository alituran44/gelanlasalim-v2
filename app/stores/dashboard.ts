import { defineStore } from "pinia"

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    stats: [],
    recentTenders: [],
    recentOffers: [],
    notifications: [],
    loading: false
  }),

  actions: {
    async loadDashboard() {
      this.loading = true

      try {
        // API buraya bağlanacak
      } finally {
        this.loading = false
      }
    }
  }
})