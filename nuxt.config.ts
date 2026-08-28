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
      title: 'İhaleciBurada — B2B İhale ve Doğrudan Satın Alma Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'İhaleciBurada.com ile kurumsal satın alma taleplerinizi yayınlayın, onaylı tedarikçilerden en rekabetçi teklifleri anında toplayın ve güvenle ticaret yapın.'
        },
        { name: 'author', content: 'İhaleciBurada Bilişim ve Tedarik A.Ş.' },
        { name: 'theme-color', content: '#0F223D' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:title', content: 'İhaleciBurada.com — Kurumsal B2B İhale ve Satın Alma Platformu' },
        { property: 'og:description', content: 'Satın alma taleplerinizi dijital ihale ve şeffaf teklif modülü ile en avantajlı maliyete dönüştürün.' },
        { property: 'og:url', content: 'https://ihaleciburada.com' },
        { property: 'og:site_name', content: 'İhaleciBurada' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'İhaleciBurada — Kurumsal B2B İhale' },
        { name: 'twitter:description', content: 'Satın alma maliyetlerinizi dijital ihale ve doğrudan teklif ile optimize edin.' }
      ],
      link: [
        { rel: 'canonical', href: 'https://ihaleciburada.com' },
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ],
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
