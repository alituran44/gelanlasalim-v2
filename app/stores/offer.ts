import { defineStore } from "pinia"

export const useOfferStore = defineStore("offer", {
  state: () => ({
    offers: [],
    loading: false
  })
})