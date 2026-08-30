import { ref } from 'vue'

export type Locale = 'tr' | 'en'

export const locale = ref<Locale>('tr')

// Translations dictionary - Turkish & English
export const translations: Record<Locale, Record<string, string>> = {
  tr: {
    home: 'Anasayfa',
    tenders: 'İhaleler',
    pricing: 'Abonelik',
    about: 'Hakkımızda',
    login: 'Giriş Yap',
    register: 'Yeni Üyelik',
    dashboard: 'Yönetim Paneli',
    logout: 'Çıkış Yap',
    language: 'Dil',
    hero_tagline: 'ÖZEL SEKTÖRÜN CANLI TERS İHALE ARENASI',
    hero_title1: 'İhale Ver.',
    hero_title2: 'Teklif Al.',
    hero_title3: 'İhaleci Burada.',
    hero_desc: 'İhaleciBurada; e-ihale, teklif toplama, sipariş ve tedarik süreçlerinizi tek platformda dijitalleştirir.',
    hero_cta_create: 'Ücretsiz İhale Oluştur',
    hero_cta_explore: 'İhaleleri Keşfet'
  },
  en: {
    home: 'Home',
    tenders: 'Tenders',
    pricing: 'Subscriptions',
    about: 'About Us',
    login: 'Log In',
    register: 'Sign Up',
    dashboard: 'Dashboard',
    logout: 'Log Out',
    language: 'Language',
    hero_tagline: 'LIVE REVERSE AUCTION PLATFORM FOR ENTERPRISES',
    hero_title1: 'Create Tender.',
    hero_title2: 'Receive Quotes.',
    hero_title3: 'İhaleci Burada.',
    hero_desc: 'İhaleciBurada digitizes your e-tenders, quotations, procurement, and supplier pipelines in a single platform.',
    hero_cta_create: 'Create Free Tender',
    hero_cta_explore: 'Explore Tenders'
  }
}

export function detectLocale() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('user_locale') as Locale
    if (saved === 'en' || saved === 'tr') {
      locale.value = saved
    } else {
      locale.value = 'tr'
    }
    if (document && document.documentElement) {
      document.documentElement.lang = locale.value
    }
  }
}

export function setLocale(newLocale: Locale) {
  locale.value = newLocale
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_locale', newLocale)
    if (document && document.documentElement) {
      document.documentElement.lang = newLocale
    }
  }
}

export function t(key: string): string {
  const currentLang = locale.value || 'tr'
  return translations[currentLang]?.[key] || translations.tr[key] || key
}
