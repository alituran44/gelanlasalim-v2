import { useUserSession } from '~/composables/useUserSession'

export default defineNuxtRouteMiddleware((to, from) => {
  const isPanelRoute = to.path === '/panel' || to.path.startsWith('/panel/')
  if (!isPanelRoute) return

  // 🛡️ SEC-010 (Katman 4): Sunucu Tarafı SSR Koruması
  // SSR sırasında HTTP başlıklarında taşınan imzalı 'ihb_session' veya 'ihb_auth' doğrulanır.
  if (import.meta.server) {
    const sessionCookie = useCookie<string | null | undefined>('ihb_session')
    const authCookie = useCookie<string | null | undefined>('ihb_auth')
    if (!sessionCookie.value && !authCookie.value) {
      return navigateTo('/uyelik?tab=login', { redirectCode: 302 })
    }
  }

  // 🛡️ SEC-010: İstemci Tarafı Navigasyon Doğrulaması
  // İstemcide 'ihb_auth' çerezi veya reaktif oturum durumu kontrol edilir.
  if (import.meta.client) {
    const authCookie = useCookie<string | null | undefined>('ihb_auth')
    const sessionCookie = useCookie<string | null | undefined>('ihb_session')
    const { isLoggedIn, userSession, loadSessionFromStorage } = useUserSession()

    const hasClientCookie = typeof document !== 'undefined' && document.cookie.includes('ihb_auth=1')
    let hasStorageSession = false
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('userSession')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && (parsed.email || parsed.name || parsed.username)) {
            hasStorageSession = true
            if (!userSession.value?.email) {
              loadSessionFromStorage()
            }
          }
        }
        if (localStorage.getItem('adminToken')) {
          hasStorageSession = true
        }
      } catch {}
    }

    if (!authCookie.value && !hasClientCookie && !sessionCookie.value && !isLoggedIn.value && !hasStorageSession) {
      return navigateTo('/uyelik?tab=login')
    }
  }
})
