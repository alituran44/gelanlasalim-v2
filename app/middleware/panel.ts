export default defineNuxtRouteMiddleware((to, from) => {
  // 🛡️ SEC-010: Panel sayfası için özel rota middleware'i
  const sessionCookie = useCookie<string | null | undefined>('ihb_session')

  if (!sessionCookie.value) {
    return navigateTo('/uyelik', { redirectCode: 302 })
  }
})
