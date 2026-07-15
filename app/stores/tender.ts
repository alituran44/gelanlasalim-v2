import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    token: "",
    authenticated: false
  }),

  actions: {
    login(user: any, token: string) {
      this.user = user
      this.token = token
      this.authenticated = true
    },

    logout() {
      this.user = null
      this.token = ""
      this.authenticated = false
    }
  }
})