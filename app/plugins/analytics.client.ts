import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#imports'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gaId = config.public?.gaId as string

  if (process.client && gaId && gaId.startsWith('G-')) {
    // Inject Google Analytics 4 Script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', gaId, {
      send_page_view: true,
      anonymize_ip: true
    })

    // Track route changes
    const router = useRouter()
    router.afterEach((to) => {
      gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title
      })
    })
  }

  // Helper for tracking custom B2B events
  return {
    provide: {
      analytics: {
        track: (eventName: string, params: Record<string, any> = {}) => {
          if (process.client && typeof window.gtag === 'function') {
            window.gtag('event', eventName, params)
          }
        }
      }
    }
  }
})
