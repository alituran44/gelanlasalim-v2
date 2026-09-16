import { defineEventHandler, sendRedirect } from 'h3'
import { resolveSession } from '../utils/authGuard'

/**
 * 🛡️ SEC-010 (Katman 4): Panel Rotalarını Sunucu Tarafında Koru (SSR Koruması)
 * Bu middleware Nuxt Vue SSR motoru sayfayı render etmeden önce doğrudan Nitro seviyesinde çalışır.
 * Oturum cookie'si ('ihb_session') veya geçerli oturumu olmayan hiçbir isteğin
 * HTML render aşamasına geçmesine izin verilmez; anında 302 yönlendirmesiyle /uyelik sayfasına yönlendirilir.
 */
export default defineEventHandler((event) => {
  const rawPath = (event.path || event.node?.req?.url || '').split('?')[0]

  // Sadece /panel ve altındaki tüm dashboard sayfalarını denetle
  if (rawPath === '/panel' || rawPath.startsWith('/panel/')) {
    const session = resolveSession(event)

    if (!session.isAuthenticated) {
      return sendRedirect(event, '/uyelik', 302)
    }
  }
})
