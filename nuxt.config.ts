// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    compressPublicAssets: true
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; media-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https: data:;",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    }
  }
})