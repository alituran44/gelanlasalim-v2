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
      title: 'İhaleciBurada — B2B Ters İhale ve Canlı Eksiltme Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'İhaleciBurada.com ile kurumsal satın alma taleplerinizi yayınlayın, onaylı tedarikçilerden kapalı zarf veya canlı eksiltme ile en rekabetçi teklifleri anında toplayın ve pazarlık yapın.'
        },
        { name: 'author', content: 'İhaleciBurada Bilişim ve Tedarik A.Ş.' },
        { name: 'theme-color', content: '#0F223D' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:title', content: 'İhaleciBurada.com — Kurumsal B2B Ters İhale ve Eksiltme Platformu' },
        { property: 'og:description', content: 'Satın alma taleplerinizi canlı eksiltme ve pazarlık modülü ile en avantajlı maliyete dönüştürün.' },
        { property: 'og:url', content: 'https://ihaleciburada.com' },
        { property: 'og:site_name', content: 'İhaleciBurada' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'İhaleciBurada — Kurumsal B2B Ters İhale' },
        { name: 'twitter:description', content: 'Satın alma maliyetlerinizi canlı eksiltme ve pazarlık ile düşürün.' }
      ],
      link: [
        { rel: 'canonical', href: 'https://ihaleciburada.com' },
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
