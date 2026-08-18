// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'tr'
      },
      title: 'GelAnlaşalım — Kurumsal B2B Ters İhale Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Kurumsal satın alma taleplerinizi yayınlayın, onaylı üretici ve tedarikçilerden kapalı zarf veya canlı eksiltme ile en uygun teklifleri hemen toplayın.'
        },
        { name: 'author', content: 'GelAnlaşalım Bilişim A.Ş.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:title', content: 'GelAnlaşalım — Kurumsal B2B Ters İhale Platformu' },
        { property: 'og:description', content: 'B2B satın alma taleplerinizi canlı eksiltme ile maliyet avantajına dönüştürün.' },
        { property: 'og:url', content: 'https://gelanlasalim-v2.vercel.app' },
        { property: 'og:site_name', content: 'GelAnlaşalım' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'canonical', href: 'https://gelanlasalim-v2.vercel.app' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
