import { ref } from 'vue'

export type Locale = 'tr'

export const locale = ref<Locale>('tr')

// Translations dictionary - 100% Turkish
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
    hero_title3: 'İhaleci Burada.',
    hero_desc: 'İhaleciBurada; e-ihale, teklif toplama, sipariş ve tedarik süreçlerinizi tek platformda dijitalleştirir. Maliyetlerinizi düşürün, zamandan tasarruf edin ve satın alma operasyonlarınızı daha verimli yönetin.',
    hero_cta_create: 'Ücretsiz İhale Oluştur',
    hero_cta_explore: 'İhaleleri Keşfet',

    // Pricing / Subscription Page
    pricing_title: 'Platform Üyeliği ve Erişim Paketleri',
    pricing_desc: 'İhaleciBurada platformunun gelişmiş ihale arama, KİK analizleri ve anlık bildirim servislerinden yararlanmak için üyeliğinizi hemen başlatın.',
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
    feat_ekap_tenders: 'EKAP kamu ihaleleri',
    feat_ekap_results: 'EKAP ihale sonuçları',
    feat_direct_proc: 'Doğrudan temin ilanları',
    feat_sales_leases: 'Satış ve Kiralama duyuruları',
    feat_limit_calc: 'Eşik değer hesaplama',
    feat_search_suggest: 'Akıllı arama önerileri',
    feat_upcoming_notif: 'Yaklaşan ihale bildirimleri',
    feat_won_notif: 'Sonuçlanan ihale uyarıları',
    feat_cancel_notif: 'İptal ve düzeltme duyuruları',
    feat_unlimit_notif: 'Sınırsız bildirim (SMS + E-Posta)',
    feat_unlimit_report: 'Sınırsız raporlama (Excel)',
    feat_contractor_anal: 'Yüklenici firma analizleri',
    feat_admin_anal: 'İdare/Kurum analizleri',
    feat_sector_anal: 'Sektörel pazar analizleri',
    feat_competitor_anal: 'Rakip firma analizleri',
    feat_mobile_compat: 'Mobil uyumlu uygulama'
  }
}

export function detectLocale() {
  locale.value = 'tr'
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_locale', 'tr')
    if (document && document.documentElement) {
      document.documentElement.lang = 'tr'
    }
  }
}

export function setLocale(newLocale?: any) {
  locale.value = 'tr'
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_locale', 'tr')
    if (document && document.documentElement) {
      document.documentElement.lang = 'tr'
    }
  }
}

export function t(key: string): string {
  return translations.tr[key] || key
}
