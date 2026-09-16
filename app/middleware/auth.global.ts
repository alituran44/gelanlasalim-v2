export default defineNuxtRouteMiddleware((to, from) => {
  const isPanelRoute = to.path === '/panel' || to.path.startsWith('/panel/')
  if (!isPanelRoute) return

  // 🛡️ SEC-010 (Katman 4): Cookie tabanlı sunucu oturum doğrulaması
  // useCookie('ihb_session') hem SSR sırasında gelen istek başlıklarından hem de client'ta çalışır
  const sessionCookie = useCookie<string | null | undefined>('ihb_session')

  if (!sessionCookie.value) {
    // SSR ve Client aşamasında anında /uyelik sayfasına yönlendir
    return navigateTo('/uyelik', { redirectCode: 302 })
  }
})
