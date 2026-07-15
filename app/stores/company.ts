import { defineStore } from "pinia"

export const useCompanyStore = defineStore("company", {
  state: () => ({
    companies: [],
    loading: false
  })
})