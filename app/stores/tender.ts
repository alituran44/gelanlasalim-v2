import { defineStore } from "pinia"

export const useTenderStore = defineStore("tender", {
  state: () => ({
    tenders: [] as any[],
    selectedTender: null as any
  }),

  actions: {
    setTenders(tenders: any[]) {
      this.tenders = tenders
    },
    selectTender(tender: any) {
      this.selectedTender = tender
    }
  }
})