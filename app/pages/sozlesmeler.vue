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
  | 'on-bilgilendirme'
  | 'iptal-iade'
  | 'teslimat'
  | 'cerezler'
  | 'tedarikci-uyum'
  | 'sla'
  | 'bilgi-guvenligi'
  | 'escrow'
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

      <!-- PAYTR & İYZİCO RESMİ SATICI KÜNYESİ (MERCHANT IDENTITY & REGISTRATION BANNER) -->
      <div class="mb-8 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-1.5 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck :size="13" class="text-blue-600" />
              <span>T.C. TİCARET BAKANLIĞI & VERGİ SİCİLİNE KAYITLI RESMİ ŞİRKET BİLGİLERİ</span>
            </div>
            <h2 class="text-lg font-black text-slate-900 tracking-tight">
              İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş.
            </h2>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              Platformumuz 6563 Sayılı Elektronik Ticaret Kanunu, 6102 Sayılı Türk Ticaret Kanunu ve 6493 Sayılı Ödeme Hizmetleri mevzuatına tam uyumlu olarak TCMB & BDDK lisanslı ödeme geçitleri (PayTR, iyzico) altyapısıyla faaliyet göstermektedir.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto text-[11px] font-medium text-slate-700 shrink-0">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">Vergi Dairesi & VKN</span>
              <strong class="text-slate-900 font-mono">Çanakkale / 4700854210</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">MERSİS No</span>
              <strong class="text-slate-900 font-mono">0470085421000001</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">Ticaret Sicil No</span>
              <strong class="text-slate-900 font-mono">14520</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">Kurumsal Destek</span>
              <strong class="text-blue-700 font-bold">0850 840 86 95</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">Resmi E-Posta</span>
              <strong class="text-slate-900">ihalcib@gmail.com</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">KEP Adresi</span>
              <strong class="text-slate-900 font-mono">ihaleciburada@hs01.kep.tr</strong>
            </div>
          </div>
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
              @click="setTab('on-bilgilendirme')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'on-bilgilendirme' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="14" class="text-amber-500" />
              <span>{{ '4. Ön Bilgilendirme Formu' }}</span>
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
              @click="setTab('iptal-iade')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'iptal-iade' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Award :size="14" class="text-emerald-500" />
              <span>{{ '6. İptal, İade ve Cayma Koşulları' }}</span>
            </button>

            <button 
              @click="setTab('teslimat')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'teslimat' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Server :size="14" class="text-blue-500" />
              <span>{{ '7. Teslimat ve Dijital İfa Politikası' }}</span>
            </button>

            <button 
              @click="setTab('ihale-kurallari')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'ihale-kurallari' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Gavel :size="14" />
              <span>{{ '8. B2B Eksiltme & İhale Kuralları' }}</span>
            </button>

            <button 
              @click="setTab('cerezler')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'cerezler' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CookieIcon :size="14" />
              <span>{{ '9. Çerez Politikası & Takip Şartları' }}</span>
            </button>

            <button 
              @click="setTab('tedarikci-uyum')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'tedarikci-uyum' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <UserCheck :size="14" />
              <span>{{ '10. Tedarikçi Doğrulama & KYC Beyanı' }}</span>
            </button>

            <button 
              @click="setTab('sla')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'sla' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Server :size="14" />
              <span>{{ '11. Servis Seviyesi Taahhüdü (SLA)' }}</span>
            </button>

            <button 
              @click="setTab('bilgi-guvenligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'bilgi-guvenligi' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Lock :size="14" />
              <span>{{ '12. Bilgi Güvenliği & ISO 27001 Standardı' }}</span>
            </button>

            <button 
              @click="setTab('escrow')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'escrow' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="14" />
              <span>{{ '13. Güvenli Havuz (Escrow) & Ödeme Sözleşmesi' }}</span>
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
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">6563 SK & TTK UYUMLU</span>
              <span class="px-3 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-200">ARACI HİZMET SAĞLAYICI ZIRHI</span>
              <span class="text-xs text-slate-400">Yürürlük Tarihi: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '1. Kullanım Şartları ve Ana Hizmet Sözleşmesi (MSA)' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'Bu Kullanım Şartları ve Ana Hizmet Sözleşmesi ("Sözleşme"), İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu ("Platform İşleticisi / Şirket") ile Platform\'a kaydolan, ihale açan, teklif sunan veya dijital hizmetlerden yararlanan tüm tüzel kişi ve tacir kullanıcılar ("Kullanıcı / Üye") arasında hukuken bağlayıcı olarak akdedilmiştir. Platform\'a giriş yapılması, üyelik oluşturulması veya herhangi bir teklif verilmesi işbu Sözleşme\'nin tüm hükümlerinin peşinen, kayıtsız ve şartsız kabul edildiği anlamına gelir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TANIMLAR VE HUKUKİ STATÜ</h3>
                <p>1.1. <strong>Platform:</strong> Mülkiyeti, fikri hakları ve işletme yetkisi münhasıran Şirket\'e ait olan internet sitesi, mobil arayüzler, API servisleri, bulut tabanlı e-ihale motorları ve bağlı tüm yazılım ekosistemini ifade eder.</p>
                <p>1.2. <strong>Aracı Hizmet Sağlayıcı:</strong> 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun Madde 2/1-d uyarınca, başkalarına ait iktisadi ve ticari faaliyetlerin yapılmasına elektronik ticaret ortamını sağlayan Şirket\'tir.</p>
                <p>1.3. <strong>Alıcı (İhale Sahibi):</strong> Kendi ticari gereksinimleri doğrultusunda mal, hizmet veya yapım işi satın almak üzere Platform üzerinde teknik şartname yükleyerek ihale veya tersine ihale ve satın alma başlatan onaylı tüzel kişi kullanıcıdır.</p>
                <p>1.4. <strong>Tedarikçi (Teklif Veren):</strong> Alıcı tarafından açılan ihalelere şartnameye uygun teknik ve mali teklif sunan, fiyat indirim adımlarını takip eden ve eksiltmeye katılan onaylı işletmedir.</p>
                <p>1.5. <strong>İhale ve Satın Alma (Reverse Auction):</strong> Belirlenen ihale süresi zarfında tedarikçilerin anlık olarak fiyat düşürdüğü, en düşük teklifin sistem tarafından otomatik olarak sıralandığı dinamik e-ihale yarışıdır.</p>
                <p>1.6. <strong>Şartname:</strong> Alıcı tarafından talep edilen mal/hizmetin teknik özelliklerini, teslimat yerini, ödeme vadesini ve kabul kriterlerini belirleyen bağlayıcı teknik dokümandır.</p>
              </section>

              <section class="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">MADDE 2 — ARACI HİZMET SAĞLAYICI KONUMU VE TAM SORUMSUZLUK KAYDI</h3>
                <p>2.1. <strong>Sözleşmenin Tarafı Olmama:</strong> Şirket, Alıcı ile Tedarikçi arasında kurulan hiçbir alım-satım, eser, hizmet, taşeronluk veya tedarik sözleşmesinin tarafı, garantörü, kefili, temsilcisi, komisyoncusu veya acentesi DEĞİLDİR. Platform münhasıran dijital bir pazar yeri ve e-ihale zemini sunmaktadır.</p>
                <p>2.2. <strong>İçerik ve Şartname Sorumsuzluğu:</strong> 6563 Sayılı Kanun Madde 9 ve Elektronik Ticarette Hizmet Sağlayıcılar Hakkında Yönetmelik uyarınca Şirket, Kullanıcılar tarafından sisteme yüklenen teknik şartnamelerin, tekliflerin, ürün tanımlarının, lisansların, patentlerin ve görsellerin doğruluğunu, yasallığını veya ayıptan ari olduğunu araştırmakla yükümlü değildir.</p>
                <p>2.3. <strong>Ayıp, Hasar, Eksik İfa ve Teslimat Temerrüdü:</strong> Tedarik edilen malların kusurlu, hasarlı, eksik çıkması, gecikmeli teslim edilmesi, şartname kriterlerini karşılamaması veya mücbir sebep olmaksızın hiç teslim edilmemesi durumunda tek hukuki muhatap Tedarikçi\'dir. Alıcı, bu nedenlerle Şirket\'ten hiçbir nam altında maddi, manevi veya cezai tazminat talep edemez.</p>
                <p>2.4. <strong>Ödeme Temerrüdü ve Tahsilat Riski:</strong> Alıcı\'nın mal/hizmet bedelini ödememesi, vadesinde ifa etmemesi veya çek/senet temerrüdüne düşmesi halinde tek muhatap Alıcı\'dır. Şirket hiçbir şekilde borçlu veya müteselsil kefil sıfatı taşımaz; tahsilat garantisi vermez.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — KURUMSAL ÜYELİK, TEMSİL YETKİSİ VE HESAP GÜVENLİĞİ</h3>
                <p>3.1. Platform yalnızca Türk Ticaret Kanunu uyarınca tescil edilmiş tacirlerin ve tüzel kişilerin kullanımına açıktır. Bireysel tüketici (B2C) işlemlerine kapalıdır.</p>
                <p>3.2. Üyelik hesabı açan kişi, temsil ettiği şirketi ilzam ve taahhüt altına sokmaya hukuken tam yetkili olduğunu (İmza Sirküleri veya şirket içi vekaletname ile yetkilendirildiğini) beyan ve taahhüt eder. Yetkisiz temsil durumunda hesabı açan ve işlem yapan gerçek kişi Türk Borçlar Kanunu Madde 46 uyarınca şahsen ve müteselsilen sorumludur.</p>
                <p>3.3. Hesap kullanıcı adı, şifre, API anahtarı ve 2FA kodlarının güvenliği münhasıran Kullanıcı\'ya aittir. Kullanıcı hesabından yapılan tüm ihale açma, şartname yükleme, teklif verme ve onaylama işlemleri Kullanıcı\'yı kesin olarak bağlar.</p>
                <p>3.4. Şirket, şüpheli gördüğü hesapları tek taraflı olarak askıya alma, ek resmi evrak talep etme ve kural ihlali durumunda üyeliği derhal sonlandırma yetkisine sahiptir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — İHALE AÇMA, TEKLİFLERİN BAĞLAYICILIĞI VE SEÇİM SERBESTİSİ</h3>
                <p>4.1. <strong>İcaba Davet Niteliği:</strong> Alıcı\'nın açtığı ihale hukuken "icaba davet" mahiyetindedir. Alıcı, şartnamede aksi açıkça belirtilmedikçe ihaleyi dilediği aşamada gerekçe göstermeksizin iptal etmekte, ertelemekte veya en düşük teklifi veren yerine teslimat vadesi, kalite veya referans kriterlerine göre başka bir tedarikçiyi tercih etmekte tamamen serbesttir. Bu durum Tedarikçi\'ye herhangi bir tazminat hakkı vermez.</p>
                <p>4.2. <strong>Teklifin Bağlayıcılığı (Kesin İcap):</strong> Tedarikçi\'nin ihale ve satın alma süresince verdiği her fiyat teklifi kesin, geri alınamaz ve bağlayıcı bir ticari taahhüttür (icap). Tedarikçi, ihaleyi kazandıktan sonra haklı bir mücbir sebep olmaksızın teklifinden dönemez, fiyat artıramaz, şartname harici ek maliyet talep edemez.</p>
                <p>4.3. İhale mutabakatı sağlandığında sistem tarafından otomatik olarak zaman damgalı Dijital İhale Tutanağı düzenlenir ve taraflara e-posta/panel yoluyla iletilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — REKABET HUKUKU, KARTEL VE PİYASA MANİPÜLASYONU YASAĞI</h3>
                <p>5.1. Tedarikçilerin aralarında gizlice anlaşarak taban/tavan fiyat belirlemesi (kartel), muvazaalı veya danışıklı teklifler vermesi, aynı sermaye grubuna veya IP bloğuna ait firmalar üzerinden fiyat manipülasyonu yapması kesinlikle yasaktır.</p>
                <p>5.2. 4054 Sayılı Rekabetin Korunması Hakkında Kanun ve Türk Ticaret Kanunu haksız rekabet hükümlerine aykırı hareket eden kullanıcıların hesapları derhal kapatılır, teklifleri geçersiz sayılır ve durum Rekabet Kurumu ile Cumhuriyet Başsavcılığı\'na resmi olarak bildirilir.</p>
              </section>

              <section class="space-y-2 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">MADDE 6 — SORUMLULUĞUN SINIRLANDIRILMASI (CAP ON LIABILITY)</h3>
                <p>6.1. <strong>Dolaylı ve Netice Zararlarının Kesin Reddi:</strong> Şirket; Platform\'un kullanımından, kullanılamamasından veya e-ihale süreçlerinin aksamasından kaynaklanan kar kaybı, ciro kaybı, iş durması, ticari itibar kaybı, veri kaybı veya üçüncü şahıslara ödenen cezai şartlar dahil hiçbir dolaylı, arızi veya özel zarardan kusurlu olsa dahi sorumlu tutulamaz.</p>
                <p>6.2. <strong>Azami Mali Sorumluluk Tavanı:</strong> Şirket\'in işbu Sözleşme\'den veya Platform\'un işleyişinden kaynaklanan kanıtlanmış doğrudan zararlardaki toplam mali sorumluluğu, Kullanıcı\'nın zarara yol açan olaydan önceki son üç (3) ay içinde Şirket\'e fiilen ödediği toplam net abonelik bedeli ile kesin olarak sınırlandırılmıştır.</p>
                <p>6.3. <strong>Teknik Kesintiler ve İnternet Altyapısı:</strong> Telekomünikasyon sağlayıcıları, internet servis sağlayıcı arızaları, elektrik kesintileri, DDOS saldırıları veya donanım çökmeleri nedeniyle teklif iletilememesinden veya ihalenin kaçırılmasından Şirket sorumlu tutulamaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 7 — FİKRİ VE SINAİ MÜLKİYET HAKLARI</h3>
                <p>7.1. Platform üzerindeki tüm kaynak kodları, veri tabanı yapıları, algoritmalar, kullanıcı arayüzleri, ticari markalar ve tasarımlar Şirket\'in münhasır mülkiyetindedir; kopyalanamaz, kaynak koda dönüştürülemez (reverse engineering) ve izinsiz çoğaltılamaz.</p>
                <p>7.2. İhalelerde paylaşılan teknik şartnameler ve CAD çizimleri yalnızca ilgili ihaleye teklif hazırlama amacıyla kullanılabilir; üçüncü kişilerle paylaşılamaz veya ticari amaçla kopyalanamaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 8 — MÜCBİR SEBEPLER VE TEK TARAFLI DEĞİŞİKLİK YETKİSİ</h3>
                <p>8.1. Doğal afetler, deprem, yangın, sel, savaş, seferberlik, siber terör, genel internet omurgası çökmesi ve yasal mevzuat değişiklikleri gibi Şirket\'in makul kontrolü dışındaki mücbir sebep hallerinde Şirket yükümlülüklerini ifa edememekten sorumlu tutulamaz.</p>
                <p>8.2. Şirket, işbu Sözleşme şartlarını ve platform kurallarını web sitesinde yayınlamak suretiyle dilediği zaman tek taraflı olarak güncelleme hakkını saklı tutar. Güncellenen şartlar sitede yayınlandığı tarihte yürürlüğe girer.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 9 — DELİL SÖZLEŞMESİ (HMK 193), UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3>
                <p>9.1. <strong>HMK 193 Delil Sözleşmesi:</strong> Taraflar arasında doğabilecek her türlü ticari ve hukuki uyuşmazlıkta Şirket\'in sunucu logları, veri tabanı kayıtları, zaman damgalı sistem günlükleri, e-posta yazışmaları ve sistem kayıtları Hukuk Muhakemeleri Kanunu Madde 193 uyarınca münhasır, bağlayıcı ve kesin delil teşkil eder.</p>
                <p>9.2. <strong>Uygulanacak Hukuk ve Yetki:</strong> İşbu Sözleşme Türkiye Cumhuriyeti Kanunlarına tabidir. Uyuşmazlıkların çözümünde İstanbul ve Balıkesir Mahkemeleri ile İcra Daireleri münhasıran yetkilidir.</p>
              </section>
            </div>
          </article>

          <!-- 2. GİZLİLİK POLİTİKASI (PRIVACY POLICY) -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">TİCARİ SIR & ENDÜSTRİYEL VERİ</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">TLS 1.3 & AES-256</span>
              <span class="text-xs text-slate-400">Revizyon: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '2. Gizlilik, Veri Güvenliği ve Ticari Sırların Korunması Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'Bu Gizlilik ve Ticari Sırların Korunması Politikası ("Politika"), İhaleciBurada B2B Elektronik İhale Platformu ("Platform") üzerinde işlem yapan Alıcı ve Tedarikçilerin ticari sır niteliğindeki maliyet verileri, şartnameleri, CAD çizimleri, teklif birim fiyatları ve sistem işlem loglarının korunması, işlenmesi, şifrelenmesi ve saklanmasına ilişkin kuralları ve platform işleticisinin sorumluluk muafiyetlerini düzenler.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — TOPLANAN TİCARİ VE TEKNİK VERİLERİN KAPSAMI</h3>
                <p>1.1. <strong>Kurumsal Kimlik ve Doğrulama Verileri:</strong> Şirket ticaret unvanı, Vergi Kimlik Numarası (VKN), Vergi Dairesi, MERSİS numarası, Ticaret Sicil Gazetesi kuruluş ve pay dökümleri, Noter Onaylı İmza Sirküleri, Faaliyet Belgesi ve şirket yetkilisinin kurumsal iletişim bilgileri.</p>
                <p>1.2. <strong>İhale ve Satın Alma Şartname Verileri:</strong> Alıcı tarafından yüklenen malzeme listeleri, metraj cetvelleri, teknik şartnameler, CAD/DWG teknik çizim dosyaları, iş programları, kalite toleransları ve tahmini satın alma bütçeleri.</p>
                <p>1.3. <strong>Teklif, İndirim ve Maliyet Verileri:</strong> Tedarikçiler tarafından sunulan malzeme birim fiyatları, iskonto oranları, teslim süreleri, nakliye/lojistik şartları, ödeme vadeleri, banka IBAN bilgileri ve Escrow bloke hesap mutabakat kayıtları.</p>
                <p>1.4. <strong>Sistem Güvenlik ve Denetim Logları:</strong> 5651 Sayılı Kanun uyarınca zaman damgalı IP adresleri, oturum açma/kapama zamanları, verilen tekliflerin nanosaniye bazlı zaman damgaları, parola değişiklikleri ve 2FA doğrulama işlem kayıtları.</p>
              </section>

              <section class="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">BÖLÜM 2 — KAPALI ZARF VE ANONİM TEKLİF GİZLİLİK ZIRHI</h3>
                <p>2.1. <strong>Tedarikçi Anonimliği Kuralı:</strong> Canlı eksiltme süresince yarışan tedarikçilerin ticari unvanları sistem tarafından otomatik olarak maskelenir (Firma-1, Firma-2, vb.). Hiçbir katılımcı, diğer rakip firmaların kim olduğunu, kurumsal unvanını veya detaylı maliyet analizini canlı ekranda göremez.</p>
                <p>2.2. <strong>Alıcıya Sunum:</strong> Alıcı, yalnızca ihale tamamlandıktan sonra veya şartnamede açıkça belirtilen teklif açma gün ve saatinde teklif veren tüm tedarikçilerin kimlik ve detaylı fiyat analiz tablolarına erişebilir.</p>
                <p>2.3. <strong>Veri Satışı Yasağı:</strong> Şirket personeli ve yöneticileri, platformda oluşan hiçbir ihale fiyatını, tedarikçi teklifini veya satın alma şartnamesini üçüncü şahıslara, rakip platformlara veya reklam ağlarına satmayacağını, kiralamayacağını ve paylaşmayacağını açıkça taahhüt eder.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — ŞARTNAME, PATENT VE TELİF SORUMSUZLUK KAYDI</h3>
                <p>3.1. Alıcı tarafından sisteme yüklenen teknik şartname, formül, patentli tasarım veya CAD çizimlerinin üçüncü tarafların sınai mülkiyet haklarını, patentlerini veya ticari sırlarını ihlal etmesinden kaynaklanan her türlü hukuki, cezai ve idari sorumluluk münhasıran Alıcı\'ya aittir.</p>
                <p>3.2. Şirket, yüklenen şartnamelerin içeriğini önceden incelemek, patent veri tabanlarında araştırmak veya doğrulamakla yükümlü değildir. Hak ihlali iddiasında bulunan hak sahipleri "Uyar-Kaldır" mekanizması kapsamında <strong>ihalcib@gmail.com</strong> adresine noter onaylı delilleriyle başvurduğunda ilgili içerik derhal incelemeye alınır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 4 — KRİPTOGRAFİK GÜVENLİK STANDARTLARI VE SİBER RİSKLER</h3>
                <p>4.1. Tüm web trafiği ve API veri iletimi modern TLS 1.3 şifreleme protokolleri ile güvence altına alınmıştır. Durağan veritabanı kayıtları AES-256 algoritmasıyla şifrelenerek Türkiye sınırları içerisindeki ISO 27001 sertifikalı Tier-3 veri merkezlerinde saklanmaktadır.</p>
                <p>4.2. <strong>Kullanıcı İhmal Muafiyeti:</strong> Kullanıcı\'nın kendi personeline ait şifrelerin çalınması, 2FA kodlarının paylaşılması, kullanıcı cihazındaki virüs/trojan/keylogger yazılımları veya oltalama (phishing) saldırıları neticesinde yaşanabilecek bilgi sızıntılarından Şirket sorumlu tutulamaz.</p>
                <p>4.3. <strong>Yasal Mercilere Açıklama:</strong> Mahkeme kararları, Cumhuriyet Başsavcılığı müzekkereleri, MASAK, Rekabet Kurumu veya BTK gibi yetkili resmi kurumların kanuna uygun yazılı talepleri doğrultusunda bilgi verilmesi gizlilik ihlali teşkil etmez.</p>
              </section>
            </div>
          </article>

          <!-- 3. KVKK / GDPR (DATA PROCESSING AGREEMENT - DPA) -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">6698 SAYILI KVKK</span>
              <span class="px-3 py-1 bg-purple-50 text-purple-800 font-mono text-xs font-bold rounded-lg border border-purple-200">VERİ SORUMLUSU AYDINLATMA METNİ</span>
              <span class="text-xs text-slate-400">Versiyon: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '3. KVKK Aydınlatma Metni ve Veri İşleme Sözleşmesi (DPA)' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ '6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") Madde 10 uyarınca, veri sorumlusu sıfatıyla İhaleciBurada B2B platform işleticisi tarafından işlenen kişisel verilere ilişkin aydınlatma metnidir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — VERİ SORUMLUSUNUN KİMLİĞİ VE İRTİBAT KANALLARI</h3>
                <p>1.1. Veri Sorumlusu: İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu İşleticisi.</p>
                <p>1.2. Adres: İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</p>
                <p>1.3. E-Posta: <strong>ihalcib@gmail.com</strong> | DPO İletişim: <strong>0850 840 86 95</strong></p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — İŞLENEN KİŞİSEL VERİ KATEGORİLERİ</h3>
                <p>2.1. <strong>Kimlik Verisi:</strong> Şirket temsilcisi veya yetkili çalışanının Adı, Soyadı, T.C. Kimlik Numarası, İmza Sirkülerindeki imza örneği.</p>
                <p>2.2. <strong>İletişim Verisi:</strong> Kurumsal e-posta adresi, cep telefonu numarası, şirket resmi tebligat adresi, KEP adresi.</p>
                <p>2.3. <strong>İşlem Güvenliği Verisi:</strong> IP adresleri, port bilgileri, şifrelenmiş parola hashleri, oturum çerezleri, sisteme giriş-çıkış zaman damgaları.</p>
                <p>2.4. <strong>Finansal ve Hukuki İşlem Verisi:</strong> Banka hesap IBAN bilgisi, e-Fatura kayıtları, ödeme dekontları, ihale tutanakları ve adli müzekkere kayıtları.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — KİŞİSEL VERİ İŞLEMENİN HUKUKİ SEBEPLERİ VE AMAÇLARI</h3>
                <p>3.1. <strong>Sözleşmenin Kurulması ve İfası (KVKK Madde 5/2-c):</strong> Üyelik kaydının oluşturulması, ihalelerin açılması, tekliflerin kabul edilmesi, abonelik paketlerinin faturalandırılması ve Escrow ödeme mutabakatının sağlanması.</p>
                <p>3.2. <strong>Kanuni Yükümlülüklerin Yerine Getirilmesi (KVKK Madde 5/2-ç):</strong> 6563 sayılı Kanun, 6102 sayılı TTK, 213 sayılı VUK ve 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Kanunu gereği yasal log ve muhasebe kayıtlarının tutulması.</p>
                <p>3.3. <strong>Meşru Menfaat ve Güvenlik (KVKK Madde 5/2-f):</strong> Canlı eksiltmelerde hile, kartel ve manipülasyonun engellenmesi, sistem performansının optimize edilmesi ve siber güvenlik altyapısının korunması.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — KİŞİSEL VERİLERİN AKTARILDIĞI TARAFLAR VE SAKLAMA SÜRELERİ</h3>
                <p>4.1. Kişisel verileriniz yalnızca; kanunen yetkili kamu kurum ve kuruluşlarına (BTK, Gelir İdaresi, Mahkemeler, Savcılıklar), TCMB/BDDK lisanslı ödeme kuruluşlarına (İyzico, PayTR vb.) ve bağımsız mali müşavirlik/denetim firmalarına yasal çerçevede aktarılır.</p>
                <p>4.2. Kişisel veriler ve ticari işlem günlükleri, Türk Ticaret Kanunu ve Vergi Usul Kanunu gereğince işlem tarihinden itibaren on (10) yıl boyunca saklanır; sürenin bitiminde re\'sen silinir veya anonim hale getirilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — İLGİLİ KİŞİNİN HAKLARI VE BAŞVURU USULÜ (KVKK MADDE 11)</h3>
                <p>5.1. Veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, işlenme amacına uygun kullanılıp kullanılmadığını bilme, yurt içinde/dışında aktarıldığı 3. kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini talep etme ve kanuna aykırı işleme sebebiyle zarara uğraması halinde zararın giderilmesini talep etme hakkına sahiptir.</p>
                <p>5.2. Başvurular; Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca kimlik teyidi yapılabilen kayıtlı kurumsal e-posta veya noter kanalıyla iletildiğinde en geç 30 gün içinde gerekçeli olarak ücretsiz yanıtlanır.</p>
              </section>
            </div>
          </article>

          <!-- 4. İHALE VE EKSİLTME KURALLARI (REVERSE AUCTION RULES) -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-red-50 text-red-800 font-mono text-xs font-bold rounded-lg border border-red-200">MANİPÜLASYON & KARTEL YASAĞI</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">DİNAMİK SÜRE UZATMA (+2 DK)</span>
              <span class="text-xs text-slate-400">Standart: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '4. B2B İhale ve Satın Alma, Ters İhale ve Rekabet Standartları Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 1 — İHALE BAŞLATMA, ŞARTNAME YÜKLEME VE TAVAN FİYAT</h3>
                <p>1.1. Alıcı firma; talep ettiği ürün/hizmetin teknik özelliklerini, malzeme adet/metraj bilgilerini, teslimat adresini, nakliye sorumluluğunu, kabul şartlarını ve başlangıç tavan bütçesini eksiksiz olarak sisteme girmelidir.</p>
                <p>1.2. İhale canlı yayına alındıktan ve tedarikçilerden ilk teklifler toplanmaya başlandıktan sonra şartnamede esaslı değişiklik yapılamaz. Esaslı değişiklik gereken durumlarda ihale iptal edilerek revize şartnameyle yeniden açılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 2 — İHALE VE SATIN ALMA MEKANİZMASI VE MİNİMUM İNDİRİM ADIMI</h3>
                <p>2.1. Canlı eksiltmede tedarikçiler başlangıç tavan fiyatından aşağı doğru en az sistem tarafından belirlenen veya Alıcı tarafından tanımlanan "Minimum İndirim Adımı" tutarı kadar indirim yaparak teklif sunabilir.</p>
                <p>2.2. Sistemde teklif veren firma, anlık olarak kendisinden daha iyi teklif verilip verilmediğini ve sıralamasını görür; ancak diğer teklif sahiplerinin unvanlarını göremez.</p>
              </section>

              <section class="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">KURAL 3 — DİNAMİK SÜRE UZATMA (ANTI-SNIPING) KURALI</h3>
                <p>3.1. İhalenin bitimine son iki (2) dakika kala yeni bir en iyi teklif sunulursa, sistem otomatik olarak ihale süresini +2 dakika daha uzatır.</p>
                <p>3.2. Amaç, son saniyelerde bot veya anlık spekülatif hamlelerle diğer dürüst tedarikçilerin teklif verme hakkının engellenmesini (sniping) önlemek ve Alıcı için en rekabetçi piyasa fiyatını elde etmektir. Katılımcılar sunucu saatine ve bu uzatmalara itiraz edemez.</p>
              </section>

              <section class="space-y-2 bg-red-50/60 p-4 rounded-xl border border-red-200">
                <h3 class="font-bold text-red-950 text-sm">KURAL 4 — TEKLİFİN BAĞLAYICILIĞI, CAYMA YASAĞI VE ZARAR TAZMİNİ</h3>
                <p>4.1. <strong>Geri Dönülemez Ticari Taahhüt:</strong> Tedarikçinin ihale ve satın almade sisteme girdiği her fiyat teklifi bağlayıcı bir ticari taahhüttür (icap). İhaleyi kazanan tedarikçi teklifinden cayamaz, fiyat artıramaz, şartnameye aykırı şart öne süremez.</p>
                <p>4.2. <strong>Tedarikçinin Cayması Halinde Sorumluluk:</strong> İhaleyi kazandıktan sonra taahhüdünü yerine getirmeyen Tedarikçi, Alıcı\'nın bu nedenle ikinci en iyi teklif sahibiyle çalışmak zorunda kalmasından doğacak fiyat farkı zararını (müspet zarar) doğrudan Alıcı\'ya tazmin etmekle yükümlüdür.</p>
                <p>4.3. <strong>Platformun Sorumsuzluğu:</strong> Alıcı ile Tedarikçi arasındaki bu cayma uyuşmazlığında Platform tazminat ödeyicisi veya kefil değildir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 5 — İHALE SONUÇLANDIRMA VE ALICININ SEÇİM SERBESTİSİ</h3>
                <p>5.1. Alıcı, ihale ve satın alma sonunda en düşük teklifi veren tedarikçiyi seçmek zorunda değildir; teslimat vadesi, finansal güç, referanslar veya teknik uygunluk kriterlerine göre teklifler arasından serbestçe seçim yapabilir veya ihaleyi sonuçsuz bırakabilir.</p>
                <p>5.2. İhalenin iptal edilmesi veya başka bir firmanın tercih edilmesi nedeniyle tedarikçiler Alıcı\'dan veya Platform\'dan teklif hazırlık masrafı veya kar mahrumiyeti talep edemez.</p>
              </section>
            </div>
          </article>

          <!-- 4. ÖN BİLGİLENDİRME FORMU (PRE-INFORMATION FORM) -->
          <article v-if="activeTab === 'on-bilgilendirme'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-200">PAYTR & İYZİCO ZORUNLU FORMU</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">6563 SK & MESAFELİ SÖZLEŞMELER</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '4. Ön Bilgilendirme Formu' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca, ALICI / ABONE\'nin sipariş onayından önce bilgilendirilmesi amacıyla hazırlanmıştır.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — SATICI / HİZMET SAĞLAYICI BİLGİLERİ</h3>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-medium">
                  <p><strong>Ticaret Unvanı:</strong> İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş.</p>
                  <p><strong>Merkez Adresi:</strong> İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</p>
                  <p><strong>Vergi Dairesi & No:</strong> Çanakkale Vergi Dairesi / VKN: 4700854210</p>
                  <p><strong>MERSİS Numarası:</strong> 0470085421000001 | <strong>Ticaret Sicil No:</strong> 14520</p>
                  <p><strong>Telefon / Müşteri Destek:</strong> 0850 840 86 95 | <strong>E-Posta:</strong> ihalcib@gmail.com</p>
                  <p><strong>KEP Adresi:</strong> ihaleciburada@hs01.kep.tr | <strong>Web Sitesi:</strong> https://ihaleciburada.com</p>
                </div>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — HİZMETİN TEMEL NİTELİKLERİ VE FİYATLANDIRMA</h3>
                <p>2.1. <strong>Hizmet Türü:</strong> Bulut tabanlı B2B e-ihale açma, teklif toplama, canlı tersine eksiltme (reverse auction), tedarikçi KYC doğrulama ve satın alma analitik raporlama yazılımı aboneliğidir.</p>
                <p>2.2. <strong>Paketler ve Toplam Fiyat (Tüm Vergiler Dahil):</strong></p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>1 Ay Lansman Deneme Paketi:</strong> 0,00 ₺ (Ücretsiz)</li>
                  <li><strong>1 Aylık Standart Paket:</strong> 900,00 ₺ (%20 KDV Dahil)</li>
                  <li><strong>3 Aylık Çeyrek Paket:</strong> 1.800,00 ₺ (%20 KDV Dahil)</li>
                  <li><strong>6 Aylık Yarı Yıl Paketi:</strong> 2.700,00 ₺ (%20 KDV Dahil)</li>
                  <li><strong>9 Aylık Kurumsal Avantaj Paketi:</strong> 3.600,00 ₺ (%20 KDV Dahil)</li>
                </ul>
                <p>2.3. Satın alınan dijital pakete ilişkin bedel, seçilen ödeme kanalına göre (Kredi Kartı 3D Secure / Havale-EFT) peşin olarak tahsil edilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — TESLİMAT VE İFA BİLGİLERİ</h3>
                <p>3.1. Hizmet tamamen dijital ortamda sunulmakta olup herhangi bir fiziksel kargo teslimatı bulunmamaktadır.</p>
                <p>3.2. Ödeme onayı lisanslı ödeme kuruluşu (PayTR, iyzico) veya banka tarafından teyit edildiği anda, abonenin kullanıcı hesabı anında ve otomatik olarak aktif edilir. Giriş bilgileri ve aktivasyon onayı kayıtlı e-posta adresine iletilir.</p>
                <p>3.3. E-Fatura / e-Arşiv faturası, Vergi Usul Kanunu uyarınca en geç yedi (7) gün içinde abonenin şirket unvanı ve VKN/TCKN bilgileriyle düzenlenerek e-posta ile gönderilir.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — CAYMA HAKKI VE İADE İSTİSNALARI</h3>
                <p>4.1. <strong>B2B İstisnası:</strong> İşbu hizmet ticari işletmeler ve tacirler arasında akdedilmekte olup 6502 sayılı Tüketici Kanunu hükümleri uygulanmaz.</p>
                <p>4.2. <strong>Dijital İfa İstisnası:</strong> Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-ğ bendi uyarınca; <em>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</em> kapsamında cayma hakkı kullanılamaz. Ancak teknik hata veya mükerrer çekim durumlarında tam iade derhal yapılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — ŞİKAYET VE İTİRAZ KANALLARI</h3>
                <p>5.1. Abone, hizmete ilişkin her türlü talep ve şikayetini <strong>0850 840 86 95</strong> no\'lu destek hattından veya <strong>ihalcib@gmail.com</strong> adresinden kurumsal müşteri temsilcilerimize iletebilir. Başvurular en geç 24 saat içinde yanıtlanır.</p>
              </section>
            </div>
          </article>

          <!-- 5. MESAFELİ SATIŞ VE ABONELİK (DISTANCE SALES AGREEMENT) -->
          <article v-if="activeTab === 'mesafeli-satis'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-indigo-50 text-indigo-800 font-mono text-xs font-bold rounded-lg border border-indigo-200">B2B TİCARİ ABONELİK</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">PAYTR & İYZİCO 3D SECURE</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '5. Mesafeli Satış ve Kurumsal Abonelik Hizmet Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TARAFLAR</h3>
                <p>1.1. <strong>SATICI (Hizmet Sağlayıcı):</strong> İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş. (Adres: İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale | VKN: 4700854210 | MERSİS: 0470085421000001 | Tel: 0850 840 86 95 | E-posta: ihalcib@gmail.com)</p>
                <p>1.2. <strong>ALICI (Kurumsal Abone):</strong> Platform üzerinden elektronik ortamda sipariş oluşturan, fatura bilgilerini beyan eden ve ödeme yapan tüzel kişi veya tacir müşteri.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — SÖZLEŞMENİN KONUSU VE KAPSAMI</h3>
                <p>2.1. İşbu Sözleşme, ALICI\'nın SATICI\'ya ait https://ihaleciburada.com internet sitesi üzerinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı belirtilen kurumsal B2B e-ihale ve ihale ve satın alma platformu abonelik hizmetinin satışı, ödemesi, ifası ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — ÖDEME YÖNTEMLERİ, LİSANSLI ÖDEME KURULUŞLARI VE GÜVENLİK</h3>
                <p>3.1. Ödemeler; TCMB ve BDDK lisanslı ödeme kuruluşları (PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş. ve iyzico / İyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.) altyapısı üzerinden 256-bit SSL şifrelemeli 3D Secure güvenli ödeme protokolüyle gerçekleştirilir.</p>
                <p>3.2. SATICI hiçbir şart altında ALICI\'nın kredi kartı numarasını, son kullanma tarihini veya CVV kodunu sunucularında tutmaz veya saklamaz.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — ANINDA DİJİTAL İFA VE FATURALANDIRMA</h3>
                <p>4.1. Hizmet dijital ortamda anında ifa edilir. Ödemenin başarıyla tamamlanmasıyla birlikte kurumsal panel erişimi anında aktif hale gelir.</p>
                <p>4.2. Sipariş sırasında ALICI tarafından beyan edilen Vergi Dairesi, VKN / TCKN ve Ticaret Unvanı bilgileri esas alınarak 213 sayılı VUK uyarınca e-Fatura / e-Arşiv faturası düzenlenir ve e-posta ile tebliğ edilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — UYUŞMAZLIKLARIN ÇÖZÜMÜ VE YETKİLİ MAHKEME</h3>
                <p>5.1. İşbu Sözleşme\'den doğabilecek her türlü ticari ve hukuki uyuşmazlıkta Türk Hukuku uygulanır. İstanbul ve Çanakkale / Balıkesir Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.</p>
              </section>
            </div>
          </article>

          <!-- 6. İPTAL, İADE VE CAYMA KOŞULLARI (CANCELLATION & REFUND POLICY) -->
          <article v-if="activeTab === 'iptal-iade'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">PAYTR & İYZİCO İADE ŞARTLARI</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">ŞEFFAF GERİ ÖDEME SÜRECİ</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '6. İptal, İade ve Cayma Koşulları Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İhaleciBurada B2B Elektronik İhale Platformu üzerinden satın alınan kurumsal abonelik paketleri, yazılım lisansları ve dijital hizmetlerin iptal, iade ve geri ödeme prosedürlerine ilişkin yasal bilgilendirme metnidir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — DİJİTAL HİZMETLERDE CAYMA VE İADE HAKKI ESASLARI</h3>
                <p>1.1. İhaleciBurada platformu üzerinden sunulan hizmetler; kurumsal üyelik, ihale açma, teklif verme ve dijital analitik yazılım kullanım haklarını kapsayan gayrimaddi dijital hizmetlerdir.</p>
                <p>1.2. <strong>Yasal İstisna:</strong> 29188 sayılı Resmi Gazete\'de yayımlanan Mesafeli Sözleşmeler Yönetmeliği\'nin 15. Maddesinin 1. Fıkrasının (ğ) bendi uyarınca; <em>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</em> cayma hakkının istisnaları arasında yer almaktadır. Kullanıcı hesabı aktive edilip yazılım araçları kullanıma açıldıktan sonra re\'sen cayma hakkı kullanılamaz.</p>
              </section>

              <section class="space-y-2 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">MADDE 2 — İADE YAPILABİLECEK HALLER VE KOŞULLAR</h3>
                <p>2.1. <strong>Mükerrer / Hatalı Çekimler:</strong> Sistem veya banka kaynaklı teknik nedenlerle aynı sipariş için birden fazla tahsilat yapılması halinde, mükerrer tahsil edilen tutar herhangi bir kesinti yapılmaksızın 24 saat içinde derhal ve re\'sen iade edilir.</p>
                <p>2.2. <strong>Teknik Arıza ve Hizmetin Başlatılamaması:</strong> Ödeme yapılmasına rağmen platform kaynaklı bir arıza nedeniyle kullanıcının hesabının 48 saat içinde aktif edilememesi ve sorunun giderilememesi halinde, abonenin talebi üzerine ödenen tutarın %100\'ü kesintisiz iade edilir.</p>
                <p>2.3. <strong>Henüz Kullanılmamış ve Aktive Edilmemiş Paketler:</strong> Satın alma anından itibaren 14 gün içinde sisteme hiç giriş yapılmamış, hiçbir ihale açılmamış veya teklif verilmemiş olması şartıyla yazılı başvuru üzerine iade değerlendirmeye alınır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — İPTAL VE İADE BAŞVURU SÜRECİ</h3>
                <p>3.1. İade ve iptal talepleri, sipariş numarası ve fatura bilgileri belirtilerek <strong>ihalcib@gmail.com</strong> e-posta adresine veya <strong>0850 840 86 95</strong> çağrı merkezine yazılı olarak iletilmelidir.</p>
                <p>3.2. Müşteri hizmetleri ekibimiz başvuruyu en geç 2 (iki) iş günü içinde inceleyerek sonucu yazılı olarak bildirir.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — GERİ ÖDEME SÜRESİ VE PARANIN HESABA GEÇMESİ</h3>
                <p>4.1. Onaylanan iadeler, ödemenin yapıldığı orijinal yöntemle (PayTR / iyzico Sanal POS veya Banka Havalesi) derhal işleme alınır.</p>
                <p>4.2. <strong>Kredi Kartı ile Yapılan Ödemeler:</strong> İade işlemi tarafımızdan lisanslı ödeme kuruluşuna anında iletilir. Bankaların işlem süreçlerine bağlı olarak tutar <strong>3 ila 7 iş günü</strong> (bazı bankalarda en geç 14 gün) içinde kart ekstrenize yansır.</p>
                <p>4.3. <strong>Banka Havalesi / EFT ile Yapılan Ödemeler:</strong> İade onayını takiben <strong>1 ila 3 iş günü</strong> içinde ödemenin geldiği şirkete ait IBAN hesabına aktarılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — ABONELİK YENİLEME İPTALİ</h3>
                <p>5.1. Abone, yönetim paneli üzerinden dilediği zaman bir sonraki döneme ait otomatik yenilemeyi iptal edebilir. İptal işlemi yapıldığında mevcut paket süresi sonuna kadar kullanım hakkı devam eder, süre bitiminde ise karttan herhangi bir tahsilat yapılmaz.</p>
              </section>
            </div>
          </article>

          <!-- 7. TESLİMAT VE DİJİTAL İFA POLİTİKASI (DELIVERY POLICY) -->
          <article v-if="activeTab === 'teslimat'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">ANINDA DİJİTAL AKTİVASYON</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">SIFIR KARGO BEDELİ</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '7. Teslimat ve Dijital İfa Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İhaleciBurada platformu üzerinden satın alınan tüm abonelik ve yazılım lisanslarının teslimat, ifa ve kullanıcıya erişim sağlama koşullarını düzenleyen resmi politikadır.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TESLİMAT ŞEKLİ VE KARGO BİLGİSİ</h3>
                <p>1.1. İhaleciBurada, tamamen bulut tabanlı bir B2B SaaS (Software as a Service) platformudur. Platformda satılan hiçbir paket için fiziksel kargo teslimatı, kutulu ürün veya kurye gönderimi bulunmamaktadır.</p>
                <p>1.2. Herhangi bir kargo ücreti, taşıma bedeli veya fiziksel teslimat masrafı tahsil edilmez.</p>
              </section>

              <section class="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">MADDE 2 — DİJİTAL İFA VE AKTİVASYON SÜRESİ</h3>
                <p>2.1. <strong>Kredi Kartı ile Yapılan Ödemelerde:</strong> PayTR veya iyzico 3D Secure ödeme onayının alındığı anda sistem kullanıcının abonelik yetkilerini <strong>anında (0 saniye gecikmeyle)</strong> aktif eder.</p>
                <p>2.2. <strong>Banka Havalesi / EFT ile Yapılan Ödemelerde:</strong> Banka hesabımıza geçen tutar muhasebe birimimizce teyit edildiği anda (mesai saatlerinde en geç 30 dakika içinde) abonelik aktifleştirilir.</p>
                <p>2.3. Aktivasyon tamamlandığında kullanıcıya sistemde kayıtlı e-posta ve SMS üzerinden "Aboneliğiniz Aktifleştirildi" bilgilendirmesi gönderilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — FATURA TESLİMATI</h3>
                <p>3.1. Yapılan tüm ödemelere ilişkin e-Fatura / e-Arşiv faturaları, Gelir İdaresi Başkanlığı (GİB) standartlarına uygun olarak en geç yedi (7) iş günü içerisinde düzenlenerek abonenin kurumsal e-posta adresine iletilir.</p>
                <p>3.2. Abone dilediği zaman yönetim panelindeki "Abonelik ve Faturalarım" sekmesinden geçmiş faturalarını PDF olarak indirebilir.</p>
              </section>
            </div>
          </article>

          <!-- 6. ÇEREZ POLİTİKASI (COOKIE POLICY) -->
          <article v-if="activeTab === 'cerezler'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '6. Çerez (Cookie) ve Oturum Güvenliği Politikası' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — ÇEREZLERİN KULLANIM AMACI VE MEKANİZMASI</h3>
                <p>1.1. Çerezler (Cookies), platformumuzu ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; oturum güvenliğinin sağlanması, canlı websocket bağlantısının kopmaması, dil ve tema tercihlerinizin hatırlanması ve sistem hızının optimize edilmesi amacıyla kullanılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — KULLANILAN ÇEREZ KATEGORİLERİ</h3>
                <p>2.1. <strong>Zorunlu ve Güvenlik Çerezleri:</strong> Kullanıcı girişi, 2FA kimlik doğrulama tokenları ve CSRF (Cross-Site Request Forgery) saldırı önleme mekanizmaları için teknik olarak şarttır; kapatılamaz.</p>
                <p>2.2. <strong>İşlevsellik Çerezleri:</strong> Dil seçimi (TR/EN), pazar yeri filtreleme tercihleri ve ihale listeleme görünüm ayarlarını depolar.</p>
                <p>2.3. <strong>Performans ve Hata Analiz Çerezleri:</strong> Sayfa yükleme hızlarını, websocket gecikme sürelerini ve sunucu yanıt sürelerini anonim olarak ölçümleyerek kesintisiz ihale altyapısı sağlar.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — ÇEREZ YÖNETİMİ VE TEKNİK SORUMSUZLUK</h3>
                <p>3.1. Tarayıcı ayarlarınızdan (Chrome, Edge, Safari, Firefox) çerez izinlerini dilediğiniz an değiştirebilir, silebilir veya engelleyebilirsiniz.</p>
                <p>3.2. Zorunlu oturum çerezlerinin kullanıcı tarafından engellenmesi durumunda ihale paneline giriş yapılamamasından, ihale ve satın alma fiyatlarının anlık güncellenememesinden veya teklif iletim gecikmelerinden Platform sorumlu tutulamaz.</p>
              </section>
            </div>
          </article>

          <!-- 7. TEDARİKÇİ DOĞRULAMA (SUPPLIER KYC CHARTER) -->
          <article v-if="activeTab === 'tedarikci-uyum'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">MAVİ ONAY ROZETİ</span>
              <span class="px-3 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-200">KEFALET / GARANTİ DEĞİLDİR</span>
              <span class="text-xs text-slate-400">Revizyon: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '7. Tedarikçi Kalifikasyonu, Uyum ve KYC Beyannamesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">STANDART 1 — ZORUNLU KURUMSAL BELGELER VE ŞEKLİ DOĞRULAMA</h3>
                <p>1.1. İhaleciBurada'da "Mavi Onaylı Tedarikçi" rozeti almak için firmaların şu resmi evrakları sisteme yüklemesi şarttır:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Son takvim yılına ait onaylı Vergi Levhası</li>
                  <li>Ticaret Sicil Gazetesi kuruluş ve son pay/temsil dağılım nüshası</li>
                  <li>Şirket yetkililerine ait Noter Onaylı İmza Sirküleri</li>
                  <li>Bağlı bulunulan Ticaret veya Sanayi Odası Faaliyet Belgesi (Son 6 ay)</li>
                </ul>
                <p>1.2. Sahte, süresi dolmuş veya tahrif edilmiş evrak sunan firmaların üyelikleri derhal iptal edilir ve TCK Madde 204 uyarınca Cumhuriyet Başsavcılığı'na suç duyurusunda bulunulur.</p>
              </section>

              <section class="space-y-2 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">STANDART 2 — MAVİ ONAY ROZETİNİN HUKUKİ NİTELİĞİ (KRİTİK SORUMSUZLUK BEYANI)</h3>
                <p>2.1. Platform üzerindeki <strong>"Mavi Onay Rozeti"</strong>, yalnızca firmanın ibraz ettiği resmi evrakların şeklen sisteme yüklendiğini ve vergi dairesi kaydının faal olduğunu gösterir.</p>
                <p>2.2. Mavi Rozet; tedarikçi firmanın mali gücüne, iflas etmeyeceğine, malı ayıpsız teslim edeceğine, borçlarını ödeyeceğine veya ticari güvenilirliğine Şirket\'in <strong>kefil, garantör veya sigortacı olduğu anlamına KESİNLİKLE GELMEZ</strong>.</p>
                <p>2.3. Alıcı firma, sipariş vermeden ve sözleşme akdetmeden önce Türk Ticaret Kanunu Madde 18/2 uyarınca basiretli bir tacir gibi hareket ederek tedarikçi hakkında kendi istihbaratını ve değerlendirmesini yapmakla yükümlüdür.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">STANDART 3 — İŞ AHLAKI, ÇEVRE VE YASAL UYUM TAAHHÜDÜ</h3>
                <p>3.1. Tedarikçiler; çocuk işçi çalıştırmama, çevre koruma mevzuatına tam uyum, iş sağlığı ve güvenliği kuralları ile rüşvet/yolsuzlukla mücadele ilkelerine bağlı kalacaklarını peşinen taahhüt eder.</p>
                <p>3.2. Sahte ürün, standart dışı malzeme veya şartnameye aykırı sevkiyat yapan tedarikçilerin Mavi Rozeti derhal iptal edilir ve sistem geneline ihlal kaydı işlenir.</p>
              </section>
            </div>
          </article>

          <!-- 8. SLA (SERVICE LEVEL AGREEMENT) -->
          <article v-if="activeTab === 'sla'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">%99.9 UPTIME TAAHHÜDÜ</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">YALNIZCA HİZMET KREDİSİ TAZMİNİ</span>
              <span class="text-xs text-slate-400">SLA Sürüm: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '8. Servis Seviyesi Taahhüdü ve Sistem Kesintisizliği (SLA)' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — KAPSAM VE %99.9 ERİŞİLEBİLİRLİK TAAHHÜDÜ</h3>
                <p>1.1. İhaleciBurada, e-ihale motorları, ihale ve satın alma teklif kabul sunucuları ve Escrow API ağ geçitlerinin aylık takvim bazında en az <strong>%99.9</strong> kesintisiz çalışacağını taahhüt eder.</p>
                <p>1.2. <strong>Kesinti Hesabına Dahil Edilmeyen Haller:</strong> Önceden duyurulan planlı gece bakımları (01:00 - 05:00), telekomünikasyon omurga arızaları, genel internet erişim problemleri, siber saldırılar (DDoS) ve mücbir sebep halleri SLA kesinti süresine dahil edilmez.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — HATA SINIFLANDIRMASI VE MÜDAHALE SÜRELERİ</h3>
                <p>2.1. <strong>Kritik Seviye 1 (Canlı eksiltme motorunun durması veya ödeme geçidi hatası):</strong> Müdahale süresi &lt; 15 dakika, hedef çözüm süresi &lt; 2 saat.</p>
                <p>2.2. <strong>Yüksek Seviye 2 (Tekil sayfa, filtre veya raporlama arızası):</strong> Müdahale süresi &lt; 1 saat, hedef çözüm süresi &lt; 6 saat.</p>
                <p>2.3. <strong>Normal Seviye 3 (Genel soru, kılavuz ve kullanım desteği):</strong> Mesai saatleri içinde &lt; 2 saat içinde geri dönüş.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — SLA İHLALİNDE TEK TAZMİNAT: HİZMET KREDİSİ (NAKİT İADE YAPILMAZ)</h3>
                <p>3.1. Mücbir sebepler hariç aylık erişilebilirlik oranının %99.0\'ın altına düşmesi durumunda Şirket nakit tazminat ödemez; yalnızca abonenin bir sonraki fatura dönemine mahsuben %10 Hizmet Kredisi tanımlar.</p>
                <p>3.2. Kesintiden doğduğu iddia edilen kar kaybı, kaçırılan ihale fırsatı veya ticari zararlar için hiçbir tazminat talebinde bulunulamaz.</p>
              </section>
            </div>
          </article>

          <!-- 9. BİLGİ GÜVENLİĞİ POLİTİKASI (INFO SECURITY) -->
          <article v-if="activeTab === 'bilgi-guvenligi'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '9. Bilgi Güvenliği Politikası (ISO/IEC 27001:2022 Standartları)' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">İLKE 1 — BGYS STANDARTLARI VE VERİ ŞİFRELEME</h3>
                <p>1.1. İhaleciBurada platform altyapısı, ISO/IEC 27001:2022 uluslararası bilgi güvenliği yönetim sistemi standartlarına tam uyumlu olarak işletilmektedir.</p>
                <p>1.2. Veritabanı ve yedekleme sistemleri AES-256 algoritmasıyla şifrelenir. API ve web trafiği uçtan uca TLS 1.3 protokolleri ile korunur.</p>
                <p>1.3. Sistem bağımsız yetkili siber güvenlik firmaları tarafından periyodik olarak sızma testlerine (pentest) tabi tutulur.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">İLKE 2 — ERİŞİM KONTROLÜ, 2FA VE KULLANICI YÜKÜMLÜLÜĞÜ</h3>
                <p>2.1. Tüm kurumsal panel girişlerinde SMS OTP ve e-Devlet kimlik doğrulama katmanları desteklenmektedir.</p>
                <p>2.2. Kullanıcı, 2FA kodlarını, şifrelerini ve API anahtarlarını gizli tutmakla yükümlüdür. Yetkisiz giriş şüphesi durumunda derhal Platform\'a yazılı bildirim yapılmalıdır.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">İLKE 3 — SİBER OLAY BİLDİRİMİ VE USOM/KVKK ENTEGRASYONU</h3>
                <p>3.1. Olası bir siber güvenlik olayı tespit edildiğinde, mevzuatın öngördüğü yasal süreler içinde Ulusal Siber Olaylara Müdahale Merkezi (USOM) ve Kişisel Verileri Koruma Kurumu\'na (KVKK) resmi bildirimler yapılır.</p>
              </section>
            </div>
          </article>

          <!-- 10. GÜVENLİ HAVUZ (ESCROW) VE PAZARYERİ ÖDEME ARACILIK SÖZLEŞMESİ -->
          <article v-if="activeTab === 'escrow'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">6493 SAYILI KANUN & TCMB</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">LİSANSLI ÖDEME KURULUŞU GÜVENCESİ</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '10. B2B Pazaryeri Güvenli Havuz (Escrow) ve Ödeme Aracılık Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">MADDE 1 — PLATFORMUN BANKA OLMADIĞI VURGUSU (TCMB & BDDK KORUMASI)</h3>
                <p>1.1. Şirket bir banka, finansal kuruluş veya ödeme kuruluşu DEĞİLDİR. Platform mevduat toplamaz, faiz işletmez, kredi vermez ve emanet para tutmaz.</p>
                <p>1.2. Güvenli Havuz (Escrow) ve Otomatik Para Bölme (Split Payment) işlemleri; 6493 Sayılı Kanun kapsamında TCMB ve BDDK tarafından lisanslanmış yetkili ödeme kuruluşları (PayTR, İyzico vb.) aracılığıyla yürütülür.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — BLOKE, SEVKİYAT VE SERBEST BIRAKMA AŞAMALARI</h3>
                <p>2.1. <strong>Havuz Bloke Aşaması:</strong> İhalede mutabakat sağlandığında Alıcı ihale bedelini lisanslı havuz hesabına yatırır; tutar lisanslı kuruluş güvencesinde bloke edilir.</p>
                <p>2.2. <strong>Sevkiyat Aşaması:</strong> Tedarikçi malı şartnameye uygun sevk ederek sevk irsaliyesi/kargo takip belgesini sisteme yükler.</p>
                <p>2.3. <strong>Mal Kabul ve Hakediş Aktarımı:</strong> Alıcı malı muayene edip sistem üzerinden mal kabul onayını verdiğinde havuzdaki bloke çözülür; platform hizmet aracılık komisyonu kesildikten sonra kalan net hakediş tutarı otomatik olarak Tedarikçinin banka IBAN hesabına aktarılır.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — ONAY SONRASI TAM SORUMSUZLUK VE UYUŞMAZLIK HAKEM HEYETİ</h3>
                <p>3.1. <strong>Onay Sonrası Sorumsuzluk:</strong> Alıcı mal kabul onayını verdikten sonra blokaj çözülmüş olacağından, sonradan ortaya çıkacak gizli ayıp, eksiklik veya gecikme cezaları nedeniyle Platform\'dan geri ödeme talep edilemez. Alıcı doğrudan Tedarikçi\'ye yasal başvuru yapmalıdır.</p>
                <p>3.2. <strong>Uyuşmazlık Bildirimi:</strong> Mal kabul onayından önce Alıcı uyuşmazlık bildirirse havuzdaki bloke çözülmez; Platform Escrow Hakem Heyeti teknik inceleme başlatır. Hakem Heyeti kararı yalnızca havuzdaki tutarın idari olarak serbest bırakılması veya iadesine ilişkin olup mahkeme hükmü yerine geçmez.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — VERGİSEL VE FATURA SORUMLULUKLARI</h3>
                <p>4.1. Satışa konu mal/hizmetin asıl faturası, KDV, tevkifat ve stopaj beyanları münhasıran Tedarikçi ile Alıcı arasındadır. Şirket yalnızca tahsil ettiği aracılık hizmet komisyonu için Tedarikçiye e-Fatura düzenler.</p>
              </section>
            </div>
          </article>

          <!-- 11. HAKKIMIZDA & VİZYON -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Hakkımızda, Misyon ve Vizyonumuz' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İhaleciBurada, Türkiye genelindeki kurumsal satın alma ve tedarik operasyonlarını şeffaf, rekabetçi ve tamamen dijital bir borsaya dönüştüren bağımsız B2B e-ihale platformudur.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BİZ KİMİZ?</h3>
                <p>Sanayi, inşaat, lojistik, ambalaj ve kurumsal sarf sektörlerinde onaylı üretici ve alıcıları buluşturuyoruz. Zaman damgalı ihale ve satın alma altyapımız ile satın alma maliyetlerinde ortalama %14.2 tasarruf sağlarken, alıcı ve tedarikçiler arasındaki ticareti hızlandırıyoruz.</p>
              </section>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                  <span class="text-[10px] font-black uppercase text-blue-700 tracking-wider">MİSYONUMUZ</span>
                  <h4 class="text-xs font-black text-slate-900">Adil & Şeffaf Satın Alma</h4>
                  <p class="text-[11px] text-slate-600">Her ölçekteki işletmenin en kaliteli tedarikçilere en uygun piyasa fiyatıyla ulaşmasını sağlamak.</p>
                </div>

                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <span class="text-[10px] font-black uppercase text-emerald-700 tracking-wider">VİZYONUMUZ</span>
                  <h4 class="text-xs font-black text-slate-900">B2B Ticaretin Borsası</h4>
                  <p class="text-[11px] text-slate-600">Türkiye ve bölgenin en yüksek hacimli dijital tedarik ve ihale borsası olmak.</p>
                </div>

                <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                  <span class="text-[10px] font-black uppercase text-slate-700 tracking-wider">DEĞERLERİMİZ</span>
                  <h4 class="text-xs font-black text-slate-900">Güven, Hız & Tarafsızlık</h4>
                  <p class="text-[11px] text-slate-600">TCMB uyumlu Escrow koruması, doğrulanmış KYC firmaları ve sıfır komisyonlu alıcı desteği.</p>
                </div>
              </div>
            </div>
          </article>

          <!-- 12. KARİYER -->
          <article v-if="activeTab === 'kariyer'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Kariyer Fırsatları & Kültürümüz' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'Türkiye\'nin B2B satın alma ve tedarik ekosistemini yeniden yazan ekibimizin bir parçası olmak ister misiniz? Sürekli büyüyen yetenekli kadromuza yeni takım arkadaşları arıyoruz.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BİZİMLE ÇALIŞMANIN AYRICALIKLARI</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span class="text-emerald-500 font-black">✓</span>
                    <span>Hibrit ve Esnek Çalışma Modeli</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span class="text-emerald-500 font-black">✓</span>
                    <span>Kapsamlı Özel Sağlık Sigortası</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span class="text-emerald-500 font-black">✓</span>
                    <span>Yıllık Teknoloji ve Eğitim Bütçesi</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span class="text-emerald-500 font-black">✓</span>
                    <span>Başarı ve Hacim Odaklı Performans Primi</span>
                  </div>
                </div>
              </section>

              <section class="space-y-3">
                <h3 class="font-bold text-slate-900 text-sm">AÇIK POZİSYONLAR</h3>
                <div class="space-y-2">
                  <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h4 class="font-black text-slate-900 text-xs">Senior Fullstack Engineer (Vue / Nuxt / Node.js)</h4>
                      <p class="text-[11px] text-slate-500">İstanbul / Balıkesir / Uzaktan • Tam Zamanlı</p>
                    </div>
                    <a href="mailto:kariyer@ihaleciburada.com?subject=Basvuru-Fullstack" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Başvur</a>
                  </div>

                  <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h4 class="font-black text-slate-900 text-xs">B2B Kurumsal Portföy & Satış Yöneticisi</h4>
                      <p class="text-[11px] text-slate-500">İstanbul & Marmara Bölgesi • Saha & Hibrit</p>
                    </div>
                    <a href="mailto:kariyer@ihaleciburada.com?subject=Basvuru-Satis" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Başvur</a>
                  </div>
                </div>
              </section>
            </div>
          </article>

          <!-- 13. İŞ ORTAKLIĞI -->
          <article v-if="activeTab === 'is-ortakligi'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'İş Ortaklığı ve Gelir Paylaşım Programı' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'ERP yazılım şirketleri, satın alma danışmanları, sanayi odası temsilcileri ve kurumsal iş geliştiriciler için tasarlanan yüksek kazançlı iş ortaklığı programımız.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">İŞ ORTAĞI MODELLERİ VE KAZANÇ ORANLARI</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                    <span class="text-[10px] font-black uppercase text-blue-700">ERP & YAZILIM ENTEGRATÖRLERİ</span>
                    <h4 class="font-black text-slate-900 text-xs">API Entegrasyon Ortaklığı</h4>
                    <p class="text-[11px] text-slate-600">Logo Tiger, SAP, Mikro ve Dynamics entegrasyonu sağlayan ortaklarımıza her aktif müşteri başına düzenli gelir paylaşımı.</p>
                  </div>

                  <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                    <span class="text-[10px] font-black uppercase text-emerald-700">KURUMSAL SATIN ALMA DANIŞMANLARI</span>
                    <h4 class="font-black text-slate-900 text-xs">%20'ye Varan Komisyon Paylaşımı</h4>
                    <p class="text-[11px] text-slate-600">Portföyünüzdeki şirketleri platforma kazandırın, tamamlanan her ihale hacminden ve abonelikten düzenli pay alın.</p>
                  </div>
                </div>
              </section>

              <div class="p-5 bg-[#0F223D] text-white rounded-2xl space-y-3">
                <h4 class="font-black text-sm text-white">İş Ortaklığı Başvurusu Yapın</h4>
                <p class="text-xs text-slate-300">Kurumsal temsilcimiz sizinle 24 saat içinde iletişime geçerek özel gelir paylaşım modelini ve entegrasyon API anahtarlarını tanımlasın.</p>
                <a href="mailto:isortakligi@ihaleciburada.com" class="inline-block px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition">
                  İş Ortaklığı Başvuru Formu İletin ↗
                </a>
              </div>
            </div>
          </article>

          <!-- 14. BLOG & MAKALELER -->
          <article v-if="activeTab === 'blog'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'B2B Satın Alma Blogu & Sektörel Analizler' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'Kurumsal satın alma yöneticileri, tedarik zinciri liderleri ve finans direktörleri için hazırladığımız güncel rehberler ve piyasa analizleri.' }}
            </p>

            <div class="space-y-4 border-t border-slate-100 pt-4">
              <!-- Makale 1 -->
              <div class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs transition space-y-2">
                <div class="flex items-center gap-2 text-[10px] font-bold text-blue-600">
                  <span>STRATEJİ & TASARRUF</span> • <span class="text-slate-400">2026.08</span>
                </div>
                <h3 class="font-black text-slate-900 text-sm hover:text-blue-600 transition cursor-pointer">
                  Tersine İhale ve Satın Alma (Reverse Auction) ile Satın Alma Maliyetlerini %18 Düşürmenin 5 Adımı
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed">
                  Geleneksel kapalı teklif yöntemine kıyasla dinamik eksiltme motorları, tedarikçiler arasında anlık şeffaf rekabet yaratarak satın alma birim maliyetlerini ciddi oranda aşağı çekmektedir...
                </p>
              </div>

              <!-- Makale 2 -->
              <div class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs transition space-y-2">
                <div class="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                  <span>FİNTECH & GÜVENLİK</span> • <span class="text-slate-400">2026.08</span>
                </div>
                <h3 class="font-black text-slate-900 text-sm hover:text-blue-600 transition cursor-pointer">
                  B2B Ticarette Escrow (Güvenli Havuz) ile Tahsilat ve Teslimat Risklerini Sıfırlamak
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed">
                  TCMB ve BDDK lisanslı ödeme kuruluşları güvencesinde çalışan güvenli havuz modeli, mal teslim edilene kadar parayı, para ödenene kadar malı güvence altına alarak ticari ihtilafları önler...
                </p>
              </div>
            </div>
          </article>

          <!-- 15. BASIN ODASI & MEDYA KİTİ -->
          <article v-if="activeTab === 'basin'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Basın Odası & Kurumsal Medya Kiti' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İhaleciBurada hakkında basın bültenleri, haberler, yönetici biyografileri ve yüksek çözünürlüklü vektörel marka varlıkları.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-3">
                <h3 class="font-bold text-slate-900 text-sm">İNDİRİLEBİLİR MARKA VE LOGO PAKETİ</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href="/logo.png" download class="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between transition">
                    <div>
                      <h4 class="font-black text-slate-900 text-xs">Vektörel Logo (Açık Zemin / Light)</h4>
                      <p class="text-[10px] text-slate-500">Şeffaf PNG / Yüksek Çözünürlük</p>
                    </div>
                    <Download :size="16" class="text-blue-600" />
                  </a>

                  <a href="/logo-white.png" download class="p-4 bg-[#0F223D] hover:bg-[#152B4D] text-white rounded-2xl border border-slate-800 flex items-center justify-between transition">
                    <div>
                      <h4 class="font-black text-white text-xs">Vektörel Logo (Koyu Zemin / Dark)</h4>
                      <p class="text-[10px] text-slate-400">Beyaz Metin & Turkuaz Vurgu</p>
                    </div>
                    <Download :size="16" class="text-emerald-400" />
                  </a>
                </div>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BASIN İRTİBAT & RÖPORTAJ TALEPLERİ</h3>
                <p>Medya ve basın mensupları bülten talepleri ve röportajlar için <strong>basin@ihaleciburada.com</strong> adresinden iletişim kurabilir.</p>
              </section>
            </div>
          </article>

        </main>
      </div>

    </div>
  </div>
</template>
