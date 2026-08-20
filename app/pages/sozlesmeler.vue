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
          {{ 'Ana Sayfaya Dön' }}
        </NuxtLink>

        <div class="flex items-center gap-3">
          <button 
            @click="printDocument"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs"
          >
            <Printer :size="13" />
            <span>{{ 'Yazdır / PDF Sakla' }}</span>
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
              <span>{{ 'RESMİ SÖZLEŞMELER & HUKUKİ EVRAKLAR' }}</span>
            </div>

            <button 
              @click="setTab('kullanim')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kullanim' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              <span>{{ '1. Kullanım Şartları & Hizmet Sözleşmesi' }}</span>
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'gizlilik' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              <span>{{ '2. Gizlilik & Veri Güvenliği Politikası' }}</span>
            </button>

            <button 
              @click="setTab('kvkk')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kvkk' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="14" />
              <span>{{ '3. KVKK Aydınlatma & Veri İşleme (DPA)' }}</span>
            </button>

            <button 
              @click="setTab('ihale-kurallari')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'ihale-kurallari' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Gavel :size="14" />
              <span>{{ '4. B2B Eksiltme & İhale Kuralları' }}</span>
            </button>

            <button 
              @click="setTab('mesafeli-satis')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'mesafeli-satis' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CheckCircle2 :size="14" />
              <span>{{ '5. Mesafeli Satış & Abonelik Sözleşmesi' }}</span>
            </button>

            <button 
              @click="setTab('cerezler')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'cerezler' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CookieIcon :size="14" />
              <span>{{ '6. Çerez Politikası & Takip Şartları' }}</span>
            </button>

            <button 
              @click="setTab('tedarikci-uyum')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'tedarikci-uyum' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <UserCheck :size="14" />
              <span>{{ '7. Tedarikçi Doğrulama & KYC Beyanı' }}</span>
            </button>

            <button 
              @click="setTab('sla')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'sla' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Server :size="14" />
              <span>{{ '8. Servis Seviyesi Taahhüdü (SLA)' }}</span>
            </button>

            <button 
              @click="setTab('bilgi-guvenligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'bilgi-guvenligi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Lock :size="14" />
              <span>{{ '9. Bilgi Güvenliği & ISO 27001 Standardı' }}</span>
            </button>
          </div>

          <!-- Corporate Info Group -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-xs">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">{{ 'KURUMSAL & GENEL BİLGİ' }}</div>
            
            <button 
              @click="setTab('hakkimizda')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'hakkimizda' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Info :size="14" />
              <span>{{ 'Hakkımızda & Vizyon' }}</span>
            </button>

            <button 
              @click="setTab('kariyer')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'kariyer' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Briefcase :size="14" />
              <span>{{ 'Kariyer Fırsatları' }}</span>
            </button>

            <button 
              @click="setTab('is-ortakligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'is-ortakligi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Award :size="14" />
              <span>{{ 'İş Ortaklığı & Komisyon' }}</span>
            </button>

            <button 
              @click="setTab('blog')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'blog' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <BookOpen :size="14" />
              <span>{{ 'Blog & Makaleler' }}</span>
            </button>

            <button 
              @click="setTab('basin')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'basin' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              <span>{{ 'Basın Odası & Medya Kiti' }}</span>
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
              {{ '1. Kullanım Şartları ve Hizmet Sözleşmesi (MSA)' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Bu Kullanım Şartları ve Hizmet Sözleşmesi ("Sözleşme"), İhaleciBurada Bilişim A.Ş. ("Şirket") ile İhaleciBurada B2B dijital e-ihale platformunu ("Platform") kullanan kurumsal veya bireysel kullanıcılar ("Kullanıcı") arasında akdedilmiştir.' 
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — KAPSAM VE KONU</h3>
                <p>1.1. Platform; dijital canlı eksiltme altyapısı, alıcı ihale yayınlama araçları, tedarikçi teklif yönetimi ve otomatik B2B işlem günlükleri sunar.</p>
                <p>1.2. Platforma erişim ve kullanım işbu Sözleşme hükümlerine tabidir. Üyelik kaydı yapılması veya teklif verilmesi bu Sözleşmenin tüm şartlarının kabul edildiği anlamına gelir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — KULLANICI ŞARTLARI VE KURUMSAL TEMSİL</h3>
                <p>2.1. Platform, yalnızca yasal olarak tescilli kurumsal şirketler, şahıs firmaları veya ticari mevzuat çerçevesinde hareket eden yetkili temsilcilerin kullanımına açıktır.</p>
                <p>2.2. Kullanıcılar; doğrulama sürecinde sundukları Vergi Levhası, Ticaret Sicil Gazetesi, İmza Sirküleri gibi tüm kurumsal evrakların doğru, gerçek ve güncel olduğunu taahhüt eder.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — TEKLİFLERİN BAĞLAYICILIĞI VE CANLI EKSİLTME KURALLARI</h3>
                <p>3.1. Canlı eksiltme süresince Tedarikçi tarafından sunulan her fiyat teklifi veya eksiltme adımı kesin ve bağlayıcı bir ticari teklif niteliğindedir.</p>
                <p>3.2. Tedarikçilerin sunulan teklifleri geriye dönük iptal etmesi veya rakiplerle muvazaalı hareket etmesi yasaktır. İhlal halinde hesap derhal askıya alınır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — FİKRİ MÜLKİYET VE VERİ HAKLARI</h3>
                <p>4.1. Platform üzerindeki tüm markalar, yazılım kaynak kodları, arayüz tasarımları, algoritmalar ve dokümantasyon İhaleciBurada Bilişim A.Ş.'nin mülkiyetindedir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3>
                <p>5.1. İşbu Sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Balıkesir Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.</p>
              </section>
            </div>
          </article>

          <!-- 2. GİZLİLİK POLİTİKASI (PRIVACY POLICY) -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '2. Gizlilik ve Veri Güvenliği Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Bu politika, İhaleciBurada B2B e-ihale platformunu ziyaret eden veya kullanan tarafların ticari ve kişisel verilerinin korunması prensiplerini düzenlemektedir.'
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — VERİ TOPLAMA VE KATEGORİLER</h3>
                <p>1.1. Kurumsal kimlik bilgileri, vergi dairesi kayıtları, resmi iletişim adresleri, kullanıcı giriş bilgileri, IP günlükleri ve ihale işlem geçmişi toplanmaktadır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — TİCARİ BİLGİLERİN KULLANIMI</h3>
                <p>2.1. Gizli teknik şartnameler, teklif rakamları ve tedarikçi fiyatları yalnızca e-ihale süreçlerinin yürütülmesi amacıyla işlenir.</p>
                <p>2.2. Ticari teklif verileri üçüncü taraflara satılmaz, kiralanmaz ve reklam ağlarıyla paylaşılmaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — GÜVENLİK ALTYAPISI</h3>
                <p>3.1. Veriler uçtan uca HTTPS/TLS 1.2+ şifreleme ile korunur. Durağan veriler ISO 27001 sertifikalı güvenli sunucularda saklanır.</p>
              </section>
            </div>
          </article>

          <!-- 3. KVKK / GDPR (DATA PROCESSING AGREEMENT - DPA) -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '3. KVKK Aydınlatma Metni & Veri İşleyen Sözleşmesi (DPA)' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ '6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve AB Genel Veri Koruma Tüzüğü ("GDPR") kapsamında Veri Sorumlusu Aydınlatma Metnidir.'
              }}
            </p>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDELER — VERİ SORUMLUSU KİMLİĞİ</h3>
                <p>Veri Sorumlusu: İhaleciBurada Bilişim Anonim Şirketi</p>
                <p>Tax Office / No: Karesi V.D. / 3920941829 | KEP: ihaleciburada@hs01.kep.tr</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — İŞLEME AMAÇLARI VE HUKUKİ SEBEPLER</h3>
                <p>2.1. Kişisel veriler (Ad, Soyad, Kurumsal E-Posta, Telefon, İmza) KVKK Madde 5/2-c (Sözleşmenin kurulması) ve 5/2-f (Meşru menfaat) kapsamında işlenmektedir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — İLGİLİ KİŞİNİN HAKLARI (KVKK MADDE 11)</h3>
                <p>3.1. Kullanıcılar verilerinin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahiptir.</p>
                <p>3.2. Başvurular <strong>kvkk@ihaleciburada.com</strong> adresine veya KEP üzerinden iletilebilir.</p>
              </section>
            </div>
          </article>

          <!-- 4. İHALE VE EKSİLTME KURALLARI (REVERSE AUCTION RULES) -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '4. B2B Canlı Eksiltme ve İhale Standartları Sözleşmesi' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 1 — CANLI EKSİLTME VE İHALE KURALLARI</h3>
                <p>1.1. İhaleler kapalı zarf veya canlı eksiltme modeliyle yürütülür; tedarikçiler anlık fiyat düşürür.</p>
                <p>1.2. Alıcı firma toplam fiyat, teslimat takvimi ve kalite uyumuna göre en uygun teklifi seçmekte serbesttir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 2 — REKABET HUKUKU VE DÜRÜSTLÜK İLKESİ</h3>
                <p>2.1. Fiyat anlaşması yapılması, yapay fiyat yükseltilmesi ve danışıklı teklif verilmesi yasaktır.</p>
              </section>
            </div>
          </article>

          <!-- 5. MESAFELİ SATIŞ VE ABONELİK (DISTANCE SALES AGREEMENT) -->
          <article v-if="activeTab === 'mesafeli-satis'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '5. Mesafeli Satış ve Abonelik Hizmet Sözleşmesi' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TARAFLAR VE ABONELİK PAKETLERİ</h3>
                <p>1.1. Satıcı: İhaleciBurada Bilişim A.Ş. | Alıcı: Abone Kurumsal Kullanıcı.</p>
                <p>1.2. Paket seçenekleri 1, 3, 6 ve 9 aylık dönemleri kapsar; ödemeler kredi kartı veya havale/EFT ile yapılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — FATURALANDIRMA VE KDV</h3>
                <p>2.1. Tüm üyelik faturaları ödeme onayını müteakip e-Fatura/e-Arşiv olarak düzenlenip kurumsal e-postaya gönderilir.</p>
              </section>
            </div>
          </article>

          <!-- 6. ÇEREZ POLİTİKASI (COOKIE POLICY) -->
          <article v-if="activeTab === 'cerezler'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '6. Çerez ve Takip Teknolojileri Politikası' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">POLİTİKA 1 — ZORUNLU ÇEREZLER</h3>
                <p>1.1. Zorunlu çerezler oturum güvenliği ve kullanıcı tercihlerini korur.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">POLİTİKA 2 — ÇEREZ YÖNETİMİ</h3>
                <p>2.1. Zorunlu olmayan çerezler tarayıcı ayarlarından her zaman kapatılabilir.</p>
              </section>
            </div>
          </article>

          <!-- 7. TEDARİKÇİ DOĞRULAMA (SUPPLIER KYC CHARTER) -->
          <article v-if="activeTab === 'tedarikci-uyum'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '7. Tedarikçi Kalifikasyonu ve Uyum Beyannamesi (KYC)' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">ŞART 1 — DOĞRULAMA GEREKSİNİMLERİ</h3>
                <p>1.1. Tedarikçiler teklif vermeden önce Vergi Levhası, Ticaret Sicil Gazetesi ve İmza Sirkülerini yüklemekle yükümlüdür.</p>
              </section>
            </div>
          </article>

          <!-- 8. SLA (SERVICE LEVEL AGREEMENT) -->
          <article v-if="activeTab === 'sla'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '8. Servis Seviyesi Taahhüdü (SLA)' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SLA 1 — %99.9 KESİNTİSİZLİK TAAHHÜDÜ</h3>
                <p>1.1. İhaleciBurada, canlı eksiltme motorları ve sistem erişilebilirliği için aylık %99.9 kesintisizlik taahhüt eder.</p>
              </section>
            </div>
          </article>

          <!-- 9. BİLGİ GÜVENLİĞİ POLİTİKASI (INFO SECURITY) -->
          <article v-if="activeTab === 'bilgi-guvenligi'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '9. Bilgi Güvenliği Politikası (ISO 27001)' }}
            </h1>

            <div class="space-y-5 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">SECURITY STANDARDS</h3>
                <p>1.1. İhaleciBurada adheres to ISO/IEC 27001:2022 Information Security Management Standards. All infrastructure undergoes routine vulnerability scanning and penetration testing.</p>
              </section>
            </div>
          </article>

          <!-- CORPORATE TABS (HAKKIMIZDA, KARİYER, İŞ ORTAKLIĞI, BLOG, BASIN) -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Hakkımızda & Vizyonumuz' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'İhaleciBurada, kurumsal satın alma süreçlerini şeffaf, rekabetçi ve tamamen dijital hale getirmek amacıyla kurulmuş yeni nesil bir B2B e-ihale platformudur.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'kariyer'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Kariyer Fırsatları' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'B2B ticaretin geleceğini şekillendiren vizyoner ekibimize katılmak ister misiniz? Sürekli büyüyen ekibimize yetenekli çalışma arkadaşları arıyoruz.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'is-ortakligi'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'İş Ortaklığı ve Komisyon Programı' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Kurumsal danışmanlar ve iş geliştiriciler için hazırladığımız özel gelir paylaşım ortaklığı programımız yayında.'
              }}
            </p>
          </article>

          <article v-if="activeTab === 'blog'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Blog & Analizler' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Satın alma operasyonlarınızı verimli hale getirecek ipuçları ve sektörel analizler.' }}
            </p>
          </article>

          <article v-if="activeTab === 'basin'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Basın Odası & Medya Kiti' }}</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'İhaleciBurada basın bültenleri, haberler ve vektörel logo kitleri.' }}
            </p>
          </article>

        </main>
      </div>

    </div>
  </div>
</template>
