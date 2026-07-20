// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap' }
      ]
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
    compressPublicAssets: true
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; media-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https: data:; style-src 'self' 'unsafe-inline' https: fonts.googleapis.com; font-src 'self' https: data: fonts.gstatic.com;",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    }
  }
})