// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'tr'
      },
      title: 'GelAnlaşalım — B2B Canlı İhale & Satın Alma Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'GelAnlaşalım ile kurumsal tedarik maliyetlerinizi canlı eksiltme ihaleleriyle düşürün. Doğrulanmış B2B tedarikçi ağı ve kapalı zarf güvenliği.' },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        { name: 'author', content: 'GelAnlaşalım B2B Platform' },
        { property: 'og:title', content: 'GelAnlaşalım — B2B Canlı İhale & Satın Alma Platformu' },
        { property: 'og:description', content: 'Canlı tersine eksiltme ve dijital B2B satın alma platformu.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://gelanlasalim-v2.vercel.app' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preload', as: 'image', href: '/hero_port_background.png', fetchpriority: 'high' },
        { rel: 'preload', as: 'image', href: '/logo.png', fetchpriority: 'high' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  routeRules: {
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Content-Security-Policy': "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:;",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Access-Control-Allow-Origin': 'https://gelanlasalim-v2.vercel.app'
      }
    }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            blue: {
              50: '#F0F5FA',
              100: '#E1ECF5',
              200: '#C2D9EB',
              300: '#94BEE0',
              400: '#5E9CD1',
              500: '#347BB8',
              600: '#003057', // Primary corporate Navy
              700: '#002545',
              800: '#001D36',
              900: '#001426',
              950: '#000A14'
            },
            green: {
              50: '#F0FAF2',
              100: '#DCF5E1',
              200: '#B9EBC3',
              300: '#87DB97',
              400: '#50C665',
              500: '#2DB345',
              600: '#1EAE4C', // Accent corporate Green
              700: '#178A3C',
              800: '#146E31',
              900: '#105628',
              950: '#063316'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            outfit: ['Outfit', 'sans-serif']
          }
        }
      }
    }
  },
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true
  }
})