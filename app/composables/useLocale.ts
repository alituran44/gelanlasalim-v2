import { ref } from 'vue'

export type Locale = 'tr' | 'en'

export const locale = ref<Locale>('tr')

// Translations dictionary
export const translations: Record<Locale, Record<string, string>> = {
  tr: {
    // Navigation / Header
    home: 'Anasayfa',
    tenders: 'İhaleler',
    pricing: 'Abonelik',
    about: 'Hakkımızda',
    login: 'Giriş Yap',
    register: 'Yeni Üyelik',
    dashboard: 'Yönetim Paneli',
    logout: 'Çıkış Yap',
    language: 'Dil',

    // Hero Section
    hero_tagline: 'ÖZEL SEKTÖRÜN CANLI TERS İHALE ARENASI',
    hero_title1: 'İhale Ver.',
    hero_title2: 'Teklif Al.',
    hero_title3: 'Gel Anlaşalım.',
    hero_desc: 'GelAnlaşalım; e-ihale, teklif toplama, sipariş ve tedarik süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, zamandan tasarruf edin ve satın alma operasyonlarınızı daha verimli yönetin.',
    hero_cta_create: 'Ücretsiz İhale Oluştur',
    hero_cta_explore: 'İhaleleri Keşfet',

    // Pricing / Subscription Page
    pricing_title: 'Platform Üyeliği ve Erişim Paketleri',
    pricing_desc: 'GelAnlaşalım platformunun gelişmiş ihale arama, KİK analizleri ve anlık bildirim servislerinden yararlanmak için üyeliğinizi hemen başlatın.',
    pricing_select: 'Seç',
    pricing_popular: 'EN POPÜLER',
    pricing_vat_notice: 'Fiyatlara %20 KDV dahildir.',
    pricing_renewal: 'Eğer üyeliğiniz varsa aşağıdaki bağlantıya tıklayıp %20 indirimli fiyatlarla üyeliğinizi uzatabilirsiniz.',
    pricing_renewal_btn: 'Üyelik uzat',
    pricing_features_title: 'Tüm paketler için geçerlidir',

    // Registration Page
    reg_title: 'Yeni Üyelik',
    reg_login_tab: 'GİRİŞ YAP',
    reg_register_tab: 'YENİ ÜYELİK',
    reg_personal_info: 'Kişisel Bilgiler',
    reg_sectors: 'Sektörler',
    reg_role: 'Üyelik Türü / Rolünüz *',
    reg_role_company: '🏢 Firma Kaydı',
    reg_role_company_desc: 'Şirketler İçin',
    reg_role_indiv: '👤 Kullanıcı Kaydı',
    reg_role_indiv_desc: 'Bireysel Kullanıcı',
    reg_fname: 'Ad *',
    reg_lname: 'Soyad *',
    reg_company_name: 'Firma / Şirket Adı *',
    reg_email_company: 'Kurumsal E-Posta *',
    reg_email_indiv: 'E-Posta Adresi *',
    reg_phone: 'Telefon *',
    reg_password: 'Şifre *',
    reg_err_all: 'Lütfen tüm zorunlu alanları doldurun.',
    reg_err_company: 'Lütfen firma adını girin.',
    reg_continue_sectors: 'Devam Et — Sektör Seçimi',

    // EKAP Features List
    feat_ekap_tenders: 'Ekap ihaleleri',
    feat_ekap_results: 'Ekap ihale sonuçları',
    feat_direct_proc: 'Doğrudan teminler',
    feat_sales_leases: 'Satış ve Kiralamalar',
    feat_limit_calc: 'Sınır değer hesaplama',
    feat_search_suggest: 'Arama önerileri',
    feat_upcoming_notif: 'Yaklaşan ihale bildirimleri',
    feat_won_notif: 'Kazanılan ihale bildirimleri',
    feat_cancel_notif: 'İptal-Düzeltme-Sonuç bildirimleri',
    feat_unlimit_notif: 'Sınırsız bildirim (Sms+Email)',
    feat_unlimit_report: 'Sınırsız raporlama (Excel)',
    feat_contractor_anal: 'Yüklenici analizleri',
    feat_admin_anal: 'İdare analizleri',
    feat_sector_anal: 'Sektör analizleri',
    feat_competitor_anal: 'Rakip analizleri',
    feat_mobile_compat: 'Mobil uyumluluk'
  },
  en: {
    // Navigation / Header
    home: 'Home',
    tenders: 'Tenders',
    pricing: 'Pricing',
    about: 'About Us',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Log Out',
    language: 'Language',

    // Hero Section
    hero_tagline: "PRIVATE SECTOR'S LIVE REVERSE AUCTION ARENA",
    hero_title1: 'Start Tenders.',
    hero_title2: 'Get Bids.',
    hero_title3: "Let's Agree.",
    hero_desc: 'GelAnlaşalım digitalizes your e-tenders, bid collection, orders, and procurement workflows in a single platform. Reduce your costs, save time, and manage your procurement operations efficiently.',
    hero_cta_create: 'Create Free Tender',
    hero_cta_explore: 'Explore Tenders',

    // Pricing / Subscription Page
    pricing_title: 'Platform Membership and Access Packages',
    pricing_desc: "Start your membership today to benefit from GelAnlaşalım's advanced tender search, public procurement analyses, and instant notification services.",
    pricing_select: 'Select',
    pricing_popular: 'POPULAR',
    pricing_vat_notice: 'Prices are inclusive of 20% VAT.',
    pricing_renewal: 'If you already have a membership, click below to renew with a 20% discount.',
    pricing_renewal_btn: 'Renew Membership',
    pricing_features_title: 'Applicable to all packages',

    // Registration Page
    reg_title: 'New Account',
    reg_login_tab: 'LOGIN',
    reg_register_tab: 'REGISTER',
    reg_personal_info: 'Personal Info',
    reg_sectors: 'Sectors',
    reg_role: 'Account Type / Your Role *',
    reg_role_company: '🏢 Company Account',
    reg_role_company_desc: 'For Businesses',
    reg_role_indiv: '👤 Individual Account',
    reg_role_indiv_desc: 'For Private Users',
    reg_fname: 'First Name *',
    reg_lname: 'Last Name *',
    reg_company_name: 'Company / Business Name *',
    reg_email_company: 'Corporate Email *',
    reg_email_indiv: 'Email Address *',
    reg_phone: 'Phone Number *',
    reg_password: 'Password *',
    reg_err_all: 'Please fill in all required fields.',
    reg_err_company: 'Please enter your company name.',
    reg_continue_sectors: 'Continue — Select Sectors',

    // EKAP Features List
    feat_ekap_tenders: 'EKAP public tenders',
    feat_ekap_results: 'EKAP tender results',
    feat_direct_proc: 'Direct procurements',
    feat_sales_leases: 'Sales and Leases',
    feat_limit_calc: 'Limit value calculation',
    feat_search_suggest: 'Smart search suggestions',
    feat_upcoming_notif: 'Upcoming tender alerts',
    feat_won_notif: 'Awarded tender notifications',
    feat_cancel_notif: 'Cancellation & outcome alerts',
    feat_unlimit_notif: 'Unlimited alerts (SMS + Email)',
    feat_unlimit_report: 'Unlimited reports (Excel)',
    feat_contractor_anal: 'Contractor analytics',
    feat_admin_anal: 'Authority analytics',
    feat_sector_anal: 'Sector analytics',
    feat_competitor_anal: 'Competitor analytics',
    feat_mobile_compat: 'Mobile responsive design'
  }
}

export function detectLocale() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('user_locale')
    if (saved === 'tr' || saved === 'en') {
      locale.value = saved
      return
    }
    const browserLang = navigator.language || ''
    if (browserLang.toLowerCase().includes('tr')) {
      locale.value = 'tr'
    } else {
      locale.value = 'en'
    }
  }
}

export function setLocale(newLocale: Locale) {
  locale.value = newLocale
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_locale', newLocale)
  }
}

export function t(key: string): string {
  return translations[locale.value][key] || key
}
