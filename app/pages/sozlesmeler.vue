<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  FileText, 
  Shield, 
  Info, 
  Briefcase, 
  Award, 
  BookOpen, 
  ArrowLeft, 
  Printer, 
  Download, 
  Lock, 
  CheckCircle2, 
  Scale, 
  Gavel, 
  Cookie as CookieIcon, 
  UserCheck, 
  Server, 
  ShieldCheck 
} from 'lucide-vue-next'
import { locale, detectLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()

type TabKey = 
  | 'hakkimizda' 
  | 'kvkk' 
  | 'kullanim' 
  | 'gizlilik' 
  | 'ihale-kurallari'
  | 'mesafeli-satis'
  | 'cerezler'
  | 'tedarikci-uyum'
  | 'sla'
  | 'bilgi-guvenligi'
  | 'kariyer' 
  | 'is-ortakligi' 
  | 'blog'
  | 'basin'

const activeTab = ref<TabKey>('kullanim')

onMounted(() => {
  detectLocale()
  if (route.query.tab) {
    activeTab.value = route.query.tab as TabKey
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as TabKey
  }
})

function setTab(tab: TabKey) {
  activeTab.value = tab
  router.replace({ query: { tab } })
}

function printDocument() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left font-sans">
    <div class="max-w-7xl mx-auto">
      
      <!-- Back & Actions Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft :size="14" />
          {{ locale === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Homepage' }}
        </NuxtLink>

        <div class="flex items-center gap-3">
          <button 
            @click="printDocument"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
          >
            <Printer :size="13" />
            <span>{{ locale === 'tr' ? 'Yazdır / PDF Sakla' : 'Print / Save PDF' }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar Navigation (4 cols) -->
        <div class="lg:col-span-4 space-y-4">
          
          <!-- Legal Contracts Group -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-xs">
            <div class="text-[10px] font-black text-blue-900 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
              <Scale :size="13" class="text-blue-600" />
              <span>{{ locale === 'tr' ? 'RESMİ SÖZLEŞMELER & HUKUKİ EVRAKLAR' : 'OFFICIAL LEGAL AGREEMENTS' }}</span>
            </div>

            <button 
              @click="setTab('kullanim')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kullanim' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              <span>{{ locale === 'tr' ? '1. Kullanım Şartları & Hizmet Sözleşmesi' : '1. Terms of Service & MSA' }}</span>
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'gizlilik' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              <span>{{ locale === 'tr' ? '2. Gizlilik & Veri Güvenliği Politikası' : '2. Privacy & Data Security Policy' }}</span>
            </button>

            <button 
              @click="setTab('kvkk')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kvkk' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="14" />
              <span>{{ locale === 'tr' ? '3. KVKK Aydınlatma & Veri İşleme (DPA)' : '3. GDPR & KVKK Compliance (DPA)' }}</span>
            </button>

            <button 
              @click="setTab('ihale-kurallari')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'ihale-kurallari' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Gavel :size="14" />
              <span>{{ locale === 'tr' ? '4. B2B Eksiltme & İhale Kuralları' : '4. B2B Reverse Auction & Tender Rules' }}</span>
            </button>

            <button 
              @click="setTab('mesafeli-satis')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'mesafeli-satis' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CheckCircle2 :size="14" />
              <span>{{ locale === 'tr' ? '5. Mesafeli Satış & Abonelik Sözleşmesi' : '5. Distance Sales & Subscription Terms' }}</span>
            </button>

            <button 
              @click="setTab('cerezler')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'cerezler' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CookieIcon :size="14" />
              <span>{{ locale === 'tr' ? '6. Çerez Politikası & Takip Şartları' : '6. Cookie & Tracking Policy' }}</span>
            </button>

            <button 
              @click="setTab('tedarikci-uyum')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'tedarikci-uyum' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <UserCheck :size="14" />
              <span>{{ locale === 'tr' ? '7. Tedarikçi Doğrulama & KYC Beyanı' : '7. Supplier Verification & KYC Charter' }}</span>
            </button>

            <button 
              @click="setTab('sla')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'sla' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Server :size="14" />
              <span>{{ locale === 'tr' ? '8. Servis Seviyesi Taahhüdü (SLA)' : '8. Service Level Agreement (SLA)' }}</span>
            </button>

            <button 
              @click="setTab('bilgi-guvenligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'bilgi-guvenligi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Lock :size="14" />
              <span>{{ locale === 'tr' ? '9. Bilgi Güvenliği & ISO 27001 Standardı' : '9. Information Security & ISO 27001' }}</span>
            </button>
          </div>

          <!-- Corporate Info Group -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-xs">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">{{ locale === 'tr' ? 'KURUMSAL & GENEL BİLGİ' : 'CORPORATE & ABOUT' }}</div>
            
            <button 
              @click="setTab('hakkimizda')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'hakkimizda' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Info :size="14" />
              <span>{{ locale === 'tr' ? 'Hakkımızda & Vizyon' : 'About Us & Vision' }}</span>
            </button>

            <button 
              @click="setTab('kariyer')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kariyer' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Briefcase :size="14" />
              <span>{{ locale === 'tr' ? 'Kariyer Fırsatları' : 'Careers' }}</span>
            </button>

            <button 
              @click="setTab('is-ortakligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'is-ortakligi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Award :size="14" />
              <span>{{ locale === 'tr' ? 'İş Ortaklığı & Komisyon' : 'Affiliate & Partnership' }}</span>
            </button>

            <button 
              @click="setTab('blog')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'blog' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <BookOpen :size="14" />
              <span>{{ locale === 'tr' ? 'Blog & Makaleler' : 'Blog & Articles' }}</span>
            </button>

            <button 
              @click="setTab('basin')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'basin' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              <span>{{ locale === 'tr' ? 'Basın Odası & Medya Kiti' : 'Press Room & Media Kit' }}</span>
            </button>
          </div>
        </div>

        <!-- Content Display Area (8 cols) -->
        <main class="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs min-h-[600px] text-slate-800">
          
          <!-- Document Header Tag -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              OFFICIAL B2B LEGAL DOCUMENT · REVISION 2026.08
            </span>
            <span class="text-[11px] font-mono font-bold text-slate-400">
              MERSİS: 0392094182900018
            </span>
          </div>

          <!-- 1. KULLANIM ŞARTLARI (TERMS OF SERVICE / MSA) -->
          <article v-if="activeTab === 'kullanim'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '1. Kullanım Şartları ve Hizmet Sözleşmesi (MSA)' : '1. Master Services Agreement & Terms of Service' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr' 
                ? 'Bu Kullanım Şartları ve Hizmet Sözleşmesi ("Sözleşme"), GelAnlaşalım Bilişim A.Ş. ("Şirket") ile GelAnlaşalım B2B dijital e-ihale platformunu ("Platform") kullanan kurumsal veya bireysel kullanıcılar ("Kullanıcı") arasında akdedilmiştir.'
                : 'This Master Services Agreement and Terms of Service ("Agreement") is executed by and between GelAnlaşalım Bilişim A.Ş. ("Company") and the enterprise or individual user ("User") accessing the GelAnlaşalım B2B digital reverse auction platform ("Platform").' 
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 1 — SCOPE & SUBJECT MATTER</h3>
                <p>1.1. The Platform provides digital reverse auction infrastructure, buyer procurement publishing tools, supplier bidding management, and automated B2B transaction logs.</p>
                <p>1.2. Access to and use of the Platform is strictly governed by the terms herein. Registration or submission of bids constitutes full, unconditional consent to this Agreement.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 2 — USER ELIGIBILITY & CORPORATE REPRESENTATION</h3>
                <p>2.1. The Platform is restricted to legally registered corporate entities, sole proprietorships, or authorized individuals operating in good faith under applicable commercial law.</p>
                <p>2.2. Users guarantee that all corporate documents (Tax ID, Trade Registry Gazette, Signature Circulars) submitted during verification are accurate, genuine, and up to date.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 3 — BINDING NATURE OF BIDS & REVERSE AUCTION RULES</h3>
                <p>3.1. Any price quotation, bidding increment, or proposal submitted by a Supplier during a live reverse auction constitutes an irrevocable, legally binding commercial offer.</p>
                <p>3.2. Bidders are prohibited from withdrawing submitted bids or colluding with rival suppliers. Violation results in immediate account suspension and statutory damages.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 4 — INTELLECTUAL PROPERTY & DATA RIGHTS</h3>
                <p>4.1. All trademarks, software source code, interface designs, algorithms, and documentation are the exclusive intellectual property of GelAnlaşalım Bilişim A.Ş.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 5 — GOVERNING LAW & JURISDICTION</h3>
                <p>5.1. This Agreement is governed by the laws of the Republic of Turkey. The Courts and Execution Offices of Balıkesir shall have exclusive jurisdiction over any disputes.</p>
              </section>
            </div>
          </article>

          <!-- 2. GİZLİLİK POLİTİKASI (PRIVACY POLICY) -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '2. Gizlilik ve Veri Güvenliği Politikası' : '2. Privacy & Data Security Policy' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr'
                ? 'Bu politika, GelAnlaşalım B2B e-ihale platformunu ziyaret eden veya kullanan tarafların ticari ve kişisel verilerinin korunması prensiplerini düzenlemektedir.'
                : 'This Privacy & Data Security Policy details how GelAnlaşalım Bilişim A.Ş. collects, protects, processes, and handles commercial data and personal identification information across our B2B procurement suite.'
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SECTION 1 — DATA COLLECTION & CATEGORIES</h3>
                <p>1.1. We collect corporate identification metrics, tax registry records, official contact details, user login credentials, IP logs, and reverse auction transactional history.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SECTION 2 — USE OF COMMERCIAL INFORMATION</h3>
                <p>2.1. Confidential procurement specifications, bid figures, and supplier quotes are processed solely for the execution of authorized reverse auction events.</p>
                <p>2.2. Commercial bid numbers are never sold, rented, or disclosed to unauthorized third parties or public advertising networks.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SECTION 3 — SECURITY INFRASTRUCTURE</h3>
                <p>3.1. Data in transit is protected using end-to-end HTTPS/TLS 1.2+ encryption. Data at rest is stored in ISO 27001-certified SOC-2 tier servers with real-time firewall audit streams.</p>
              </section>
            </div>
          </article>

          <!-- 3. KVKK / GDPR (DATA PROCESSING AGREEMENT - DPA) -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '3. KVKK Aydınlatma Metni & Veri İşleyen Sözleşmesi (DPA)' : '3. GDPR & KVKK Data Processing Agreement (DPA)' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr'
                ? '6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve AB Genel Veri Koruma Tüzüğü ("GDPR") kapsamında Veri Sorumlusu Aydınlatma Metnidir.'
                : 'Data Processing Addendum (DPA) and Clarification Charter compliant with Turkish KVKK Law No. 6698 and EU General Data Protection Regulation (GDPR).'
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">CLAUSE 1 — DATA CONTROLLER IDENTIFICATION</h3>
                <p>Data Controller: GelAnlaşalım Bilişim Anonim Şirketi</p>
                <p>Tax Office / No: Karesi V.D. / 3920941829 | KEP: gelanlasalim@hs01.kep.tr</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">CLAUSE 2 — PURPOSES OF PROCESSING & LEGAL GROUNDS</h3>
                <p>2.1. Personal data (Name, Surname, Corporate Email, Phone Number, Authorized Signature) is processed under KVKK Art. 5/2-c (Contractual obligation) and Art. 5/2-f (Legitimate interest).</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">CLAUSE 3 — DATA SUBJECT RIGHTS (KVKK ART. 11 & GDPR ART. 15-22)</h3>
                <p>3.1. Users maintain rights to request confirmation of processing, request correction of inaccurate data, demand erasure ("right to be forgotten"), and object to automated profiling.</p>
                <p>3.2. Official applications may be directed to <strong>kvkk@gelanlasalim.com</strong> or submitted via registered KEP email.</p>
              </section>
            </div>
          </article>

          <!-- 4. İHALE VE EKSİLTME KURALLARI (REVERSE AUCTION RULES) -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '4. B2B Canlı Eksiltme ve İhale Standartları Sözleşmesi' : '4. B2B Reverse Auction & Tender Execution Charter' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">RULE 1 — REVERSE AUCTION MECHANICS</h3>
                <p>1.1. Procurement tenders operate on a sealed-bid or open dynamic reverse auction model where suppliers decrease unit quotes in real time.</p>
                <p>1.2. The Buyer reserves full discretion to select winning bids based on total price, delivery timetable, supplier verification score, or specification compliance.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">RULE 2 — ANTI-COLLUSION & INTEGRITY GUARANTEE</h3>
                <p>2.1. Price fixing, artificial bid inflation, horizontal cartel agreements, and proxy bidding between competing suppliers are strictly illegal and monitored by anti-fraud AI engines.</p>
              </section>
            </div>
          </article>

          <!-- 5. MESAFELİ SATIŞ VE ABONELİK (DISTANCE SALES AGREEMENT) -->
          <article v-if="activeTab === 'mesafeli-satis'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '5. Mesafeli Satış ve Abonelik Hizmet Sözleşmesi' : '5. Distance Sales & Subscription Services Agreement' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 1 — PARTIES & SUBSCRIPTION PACKAGES</h3>
                <p>1.1. Seller: GelAnlaşalım Bilişim A.Ş. | Buyer: Subscribed Enterprise User.</p>
                <p>1.2. Package options include 1-Month, 3-Month, 6-Month, and 9-Month B2B corporate access tiers billed electronically via credit card (PayTR/iyzico) or corporate wire transfer.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ARTICLE 2 — INVOICING & VAT TAXATION</h3>
                <p>2.1. All subscription invoices are generated electronically (e-Fatura / e-Arşiv) within 24 hours of payment approval and sent to the registered corporate email address.</p>
              </section>
            </div>
          </article>

          <!-- 6. ÇEREZ POLİTİKASI (COOKIE POLICY) -->
          <article v-if="activeTab === 'cerezler'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '6. Çerez ve Takip Teknolojileri Politikası' : '6. Cookie & Web Tracking Policy' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">POLICY 1 — ESSENTIAL & SESSION COOKIES</h3>
                <p>1.1. Necessary cookies maintain user sessions, authentications, language preferences (`user_locale`), and tender draft state (`tenderDraft`). These are required for system functionality.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">POLICY 2 — COOKIE MANAGEMENT</h3>
                <p>2.1. Users can disable non-essential cookies via the bottom Cookie Consent Banner or browser settings anytime without affecting core reverse auction participation.</p>
              </section>
            </div>
          </article>

          <!-- 7. TEDARİKÇİ DOĞRULAMA (SUPPLIER KYC CHARTER) -->
          <article v-if="activeTab === 'tedarikci-uyum'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '7. Tedarikçi Kalifikasyonu ve Uyum Beyannamesi (KYC)' : '7. Supplier Verification & KYC Compliance Charter' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">CHARTER 1 — VERIFICATION REQUIREMENTS</h3>
                <p>1.1. Suppliers must submit valid Tax Certificates (Vergi Levhası), Trade Registry Gazette filings (Ticaret Sicil Gazetesi), and Authorized Signatory Lists before bidding on tier-1 procurement contracts.</p>
              </section>
            </div>
          </article>

          <!-- 8. SLA (SERVICE LEVEL AGREEMENT) -->
          <article v-if="activeTab === 'sla'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '8. Servis Seviyesi Taahhüdü (SLA)' : '8. Service Level Agreement (SLA)' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SLA 1 — 99.9% UPTIME COMMITMENT</h3>
                <p>1.1. GelAnlaşalım guarantees 99.9% operational availability for live reverse auction engines, websocket feeds, and bid submission endpoints on a monthly rolling average.</p>
              </section>
            </div>
          </article>

          <!-- 9. BİLGİ GÜVENLİĞİ POLİTİKASI (INFO SECURITY) -->
          <article v-if="activeTab === 'bilgi-guvenligi'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ locale === 'tr' ? '9. Bilgi Güvenliği Politikası (ISO 27001)' : '9. Information Security Policy (ISO 27001)' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SECURITY STANDARDS</h3>
                <p>1.1. GelAnlaşalım adheres to ISO/IEC 27001:2022 Information Security Management Standards. All infrastructure undergoes routine vulnerability scanning and penetration testing.</p>
              </section>
            </div>
          </article>

          <!-- CORPORATE TABS (HAKKIMIZDA, KARİYER, İŞ ORTAKLIĞI, BLOG, BASIN) -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ locale === 'tr' ? 'Hakkımızda & Vizyonumuz' : 'About Us & Company Vision' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr' 
                ? 'GelAnlaşalım, kurumsal satın alma süreçlerini şeffaf, rekabetçi ve tamamen dijital hale getirmek amacıyla kurulmuş yeni nesil bir B2B e-ihale platformudur.'
                : 'GelAnlaşalım is an enterprise digital reverse auction ecosystem engineered to streamline corporate B2B procurement workflows, eliminate email clutter, and maximize savings.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'kariyer'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ locale === 'tr' ? 'Kariyer Fırsatları' : 'Careers & Open Positions' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr'
                ? 'B2B ticaretin geleceğini şekillendiren vizyoner ekibimize katılmak ister misiniz? Sürekli büyüyen ekibimize yetenekli çalışma arkadaşları arıyoruz.'
                : 'Join our team shaping the future of digital B2B trade. We are looking for passionate engineers, product managers, and sales specialists.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'is-ortakligi'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ locale === 'tr' ? 'İş Ortaklığı ve Komisyon Programı' : 'Partnership & Affiliate Commission Program' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr'
                ? 'Kurumsal danışmanlar ve iş geliştiriciler için hazırladığımız özel gelir paylaşım ortaklığı programımız yayında.'
                : 'Earn 20% recurring commissions by introducing corporate procurement buyers and verified suppliers to GelAnlaşalım.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'blog'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ locale === 'tr' ? 'Blog & Analizler' : 'Blog & Procurement Insights' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr' ? 'Satın alma operasyonlarınızı verimli hale getirecek ipuçları ve sektörel analizler.' : 'Insights, whitepapers, and guides on dynamic reverse auctions.' }}
            </p>
          </article>

          <article v-if="activeTab === 'basin'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ locale === 'tr' ? 'Basın Odası & Medya Kiti' : 'Press Room & Media Assets' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ locale === 'tr' ? 'GelAnlaşalım basın bültenleri, haberler ve vektörel logo kitleri.' : 'Press releases, corporate news, and official media kit vector assets.' }}
            </p>
          </article>

        </main>
      </div>

    </div>
  </div>
</template>
