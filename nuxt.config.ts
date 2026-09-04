// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },

  // 1. API ANAHTARLARI VE SECRET'LAR (Runtime Config)
  runtimeConfig: {
    // Private keys (server-only)
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || 'ihalecib@gmail.com',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    netgsmUsercode: process.env.NETGSM_USERCODE || '8508408695',
    netgsmPassword: process.env.NETGSM_PASSWORD || '',
    netgsmHeader: process.env.NETGSM_HEADER || '8508408695',
    paytrMerchantId: process.env.PAYTR_MERCHANT_ID || '',
    paytrMerchantKey: process.env.PAYTR_MERCHANT_KEY || '',
    paytrMerchantSalt: process.env.PAYTR_MERCHANT_SALT || '',
    deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',

    // Public keys (client & server)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://ihaleciburada.com',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '', // Google Analytics 4 ID (e.g. G-XXXXXXXXXX)
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-token',
    }
  },

  // 2. RATE LIMIT, CACHING & COMPRESS (Nitro Configuration)
  nitro: {
    compressPublicAssets: true, // Gzip (.gz) ve Brotli (.br) otomatik sıkıştırma
    prerender: {
      crawlLinks: true,
    },
    routeRules: {
      // Statik JS/CSS varlıkları için 1 yıllık değişmez önbellek (Caching)
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // Görseller ve ikonlar için 7 günlük önbellek
      '/**/*.png': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' } },
      '/**/*.jpg': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' } },
      '/**/*.ico': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' } },
      '/**/*.svg': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' } },
      // SEO & Crawler dosyaları
      '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } },
      '/sitemap.xml': { headers: { 'cache-control': 'public, max-age=86400' } },
      // Yasal Sayfa Kısayolları (301 Yönlendirme)
      '/legal': { redirect: { to: '/sozlesmeler', statusCode: 301 } },
      '/yasal': { redirect: { to: '/sozlesmeler', statusCode: 301 } },
      '/kvkk': { redirect: { to: '/sozlesmeler?tab=kvkk', statusCode: 301 } },
      '/gizlilik': { redirect: { to: '/sozlesmeler?tab=gizlilik', statusCode: 301 } },
      '/kullanim-sartlari': { redirect: { to: '/sozlesmeler?tab=kullanim', statusCode: 301 } },
      '/escrow': { redirect: { to: '/sozlesmeler?tab=escrow', statusCode: 301 } },
    }
  },

  // 4. COMPRESS & MINIFY (Vite Build Settings)
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    }
  },

  // 5. GOOGLE SEARCH CONSOLE & META SEO
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
        // Google Search Console Doğrulama Meta Etiketi
        {
          name: 'google-site-verification',
          content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-token'
        },
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
