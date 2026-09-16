import { useUserSession } from '~/composables/useUserSession'

export default defineNuxtRouteMiddleware((to, from) => {
  // 🛡️ SEC-010: Panel sayfası için özel rota middleware'i
  if (import.meta.server) {
    const sessionCookie = useCookie<string | null | undefined>('ihb_session')
    if (!sessionCookie.value) {
      return navigateTo('/uyelik', { redirectCode: 302 })
    }
  }

  if (import.meta.client) {
    const authCookie = useCookie<string | null | undefined>('ihb_auth')
    const sessionCookie = useCookie<string | null | undefined>('ihb_session')
    const { isLoggedIn } = useUserSession()

    if (!authCookie.value && !sessionCookie.value && !isLoggedIn.value) {
      return navigateTo('/uyelik')
    }
  }
})
