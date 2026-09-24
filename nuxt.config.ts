// nuxt.config.ts

// 🛡️ Katman 3: Derleme zamanı güvenlik denetimi
// Production ortamında hiçbir koşulda güvensiz MFA bypass / demo sızıntı flag'i açık olamaz
if ((process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') && 
    (process.env.ENABLE_MFA_DEMO_CODE === 'true' || process.env.ALLOW_INSECURE_MFA === 'true')) {
  throw new Error('[SECURITY FATAL] ENABLE_MFA_DEMO_CODE cannot be enabled in production environments (Kural SEC-009)!')
}

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
    paynkolayMerchantId: process.env.PAYNKOLAY_MERCHANT_ID || '',
    paynkolaySecretKey: process.env.PAYNKOLAY_SECRET_KEY || '',
    paynkolayTerminalId: process.env.PAYNKOLAY_TERMINAL_ID || '',
    deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',

    // Public keys (client & server)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://ihaleciburada.com',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '', // Google Analytics 4 ID (e.g. G-XXXXXXXXXX)
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    }
  },

  // 2. RATE LIMIT, CACHING & COMPRESS (Nitro Configuration)
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true, // Gzip (.gz) ve Brotli (.br) otomatik sıkıştırma
    prerender: {
      crawlLinks: true,
      failOnError: false
    },
    routeRules: {
      // Statik JS/CSS varlıkları için 1 yıllık değişmez önbellek (Caching) & Güvenli Köken Sınırlandırması
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable', 'access-control-allow-origin': 'https://www.ihaleciburada.com' } },
      // Görseller ve ikonlar için 7 günlük önbellek
      '/**/*.png': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000', 'access-control-allow-origin': 'https://www.ihaleciburada.com' } },
      '/**/*.jpg': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000', 'access-control-allow-origin': 'https://www.ihaleciburada.com' } },
      '/**/*.ico': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000', 'access-control-allow-origin': 'https://www.ihaleciburada.com' } },
      '/**/*.svg': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000', 'access-control-allow-origin': 'https://www.ihaleciburada.com' } },
      // SEO, Crawler & RFC 9116 Güvenlik İletişim Dosyaları
      '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400', 'access-control-allow-origin': '*' } },
      '/sitemap.xml': { headers: { 'cache-control': 'public, max-age=86400', 'access-control-allow-origin': '*' } },
      '/llms.txt': { headers: { 'cache-control': 'public, max-age=86400', 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' } },
      '/.well-known/llms.txt': { headers: { 'cache-control': 'public, max-age=86400', 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' } },
      '/.well-known/security.txt': { headers: { 'cache-control': 'public, max-age=86400', 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' } },
      '/security.txt': { headers: { 'cache-control': 'public, max-age=86400', 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' } },
      // Yasal Sayfa Kısayolları (301 Yönlendirme)
      '/legal': { redirect: { to: '/sozlesmeler', statusCode: 301 } },
      '/yasal': { redirect: { to: '/sozlesmeler', statusCode: 301 } },
      '/kvkk': { redirect: { to: '/sozlesmeler?tab=kvkk', statusCode: 301 } },
      '/gizlilik': { redirect: { to: '/sozlesmeler?tab=gizlilik', statusCode: 301 } },
      '/kullanim-sartlari': { redirect: { to: '/sozlesmeler?tab=kullanim', statusCode: 301 } },
      '/escrow': { redirect: { to: '/sozlesmeler?tab=escrow', statusCode: 301 } },
      // Tüm rotalarda savunma derinliği (Defense-in-Depth) güvenlik başlıkları
      '/**': {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'Content-Security-Policy': "default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:;",
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)'
        }
      }
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
        { name: 'keywords', content: 'b2b ihale, tersine ihale, eksiltme ihalesi, satın alma platformu, şartname, doğrudan teklif verme, tedarikçi ağı, escrow güvenli havuz, balıkesir ihaleleri, çanakkale ihaleleri, bursa sanayi ihaleleri, istanbul b2b satın alma, kocaeli gebze osb, ankara ostim ihaleleri, izmir b2b portalı, kurumsal satın alma, kamu ve özel sektör ihaleleri, toptan malzeme alımı' },
        { name: 'author', content: 'Hasan Hüseyin Yıldırım - İhaleciBurada' },
        { name: 'publisher', content: 'Hasan Hüseyin Yıldırım (İhaleciBurada)' },
        { name: 'copyright', content: 'İhaleciBurada / Hasan Hüseyin Yıldırım' },
        { name: 'theme-color', content: '#0F223D' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'geo.region', content: 'TR' },
        { name: 'geo.placename', content: 'Türkiye (Marmara, Çanakkale, Balıkesir, Bursa, İstanbul, Kocaeli, Ankara, İzmir)' },
        { name: 'geo.position', content: '40.1553;26.4142' },
        { name: 'ICBM', content: '40.1553, 26.4142' },
        { name: 'rating', content: 'general' },
        { name: 'distribution', content: 'global' },
        ...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? [{
          name: 'google-site-verification',
          content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        }] : []),
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:title', content: 'İhaleciBurada.com — Kurumsal B2B İhale ve Satın Alma Platformu' },
        { property: 'og:description', content: 'Satın alma taleplerinizi dijital ihale ve şeffaf teklif modülü ile en avantajlı maliyete dönüştürün.' },
        { property: 'og:url', content: 'https://ihaleciburada.com' },
        { property: 'og:site_name', content: 'İhaleciBurada' },
        { property: 'og:image', content: 'https://ihaleciburada.com/auth_skyscraper_bg.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:alt', content: 'İhaleciBurada Kurumsal B2B Genel Merkez' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@ihaleciburada' },
        { name: 'twitter:creator', content: '@ihaleciburada' },
        { name: 'twitter:title', content: 'İhaleciBurada — Kurumsal B2B İhale' },
        { name: 'twitter:description', content: 'Satın alma maliyetlerinizi dijital ihale ve doğrudan teklif ile optimize edin.' },
        { name: 'twitter:image', content: 'https://ihaleciburada.com/auth_skyscraper_bg.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'image', href: '/logo.png', fetchpriority: 'high' },
        { rel: 'preconnect', href: 'https://images.unsplash.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://accounts.google.com' },
        { rel: 'dns-prefetch', href: 'https://accounts.google.com' },
        { rel: 'canonical', href: 'https://ihaleciburada.com' },
        { rel: 'alternate', hreflang: 'tr', href: 'https://ihaleciburada.com' },
        { rel: 'alternate', hreflang: 'en', href: 'https://ihaleciburada.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://ihaleciburada.com' }
      ],
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true, crossorigin: 'anonymous' }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
