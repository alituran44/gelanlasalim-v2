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
    hero_cta_explore: 'İhaleleri Keşfet',
    feat_ekap_tenders: 'Güncel B2B & Kurumsal Satın Alma İlanları',
    feat_ekap_results: 'Sonuçlanan İhaleler & Piyasa Fiyat Analizi',
    feat_direct_proc: 'Doğrudan Temin & Hızlı Fiyat Araştırması',
    feat_sales_leases: 'Taşınmaz Satış, Kiralama ve Devir İlanları',
    feat_limit_calc: 'Doğrudan Temin Limit & Bütçe Hesaplayıcı',
    feat_search_suggest: 'Akıllı CPV ve Sektörel Arama Motoru',
    feat_upcoming_notif: 'Yaklaşan İhale ve Şartname Alarmı',
    feat_won_notif: 'Sonuçlanan İhale & Hakediş Bildirimleri',
    feat_cancel_notif: 'İptal ve Zeyilname Değişiklik Bildirimleri',
    feat_unlimit_notif: 'Sınırsız E-Posta ve Anlık SMS Bildirimleri',
    feat_unlimit_report: 'Sınırsız Excel ve PDF İhale Raporlama',
    feat_contractor_anal: 'Tedarikçi Karnesi ve Güvenilirlik Puanı',
    feat_admin_anal: 'Alıcı ve Kurum Bazlı Harcama Analitiği',
    feat_sector_anal: '40 Sektörde Piyasa ve Fiyat Trendleri',
    feat_competitor_anal: 'Rakip Teklif ve Eksiltme Davranış Analizi',
    feat_mobile_compat: '%100 Mobil Uyumlu Arayüz ve CAD/DWG Önizleme'
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
    hero_cta_explore: 'Explore Tenders',
    feat_ekap_tenders: 'Live B2B & Enterprise Procurement Tenders',
    feat_ekap_results: 'Awarded Tender Results & Price Benchmarking',
    feat_direct_proc: 'Direct Sourcing & Quick Price Inquiries',
    feat_sales_leases: 'Commercial Real Estate, Sales & Leases',
    feat_limit_calc: 'Procurement Threshold & Budget Calculator',
    feat_search_suggest: 'Smart CPV & Sectoral Search Intelligence',
    feat_upcoming_notif: 'Upcoming Tender & Specification Alerts',
    feat_won_notif: 'Awarded Tender & Settlement Notifications',
    feat_cancel_notif: 'Real-time Cancellation & Addendum Alerts',
    feat_unlimit_notif: 'Unlimited Instant SMS & Email Alerts',
    feat_unlimit_report: 'Unlimited Excel & PDF Procurement Reports',
    feat_contractor_anal: 'Supplier Scorecard & Reliability Rating',
    feat_admin_anal: 'Buyer & Corporate Spend Analytics',
    feat_sector_anal: 'Market & Pricing Trends Across 40 Sectors',
    feat_competitor_anal: 'Competitor Bidding & Reverse Auction Analytics',
    feat_mobile_compat: '100% Mobile Responsive UI & CAD/DWG Preview'
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
