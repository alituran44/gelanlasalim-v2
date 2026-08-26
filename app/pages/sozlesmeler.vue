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

            <button 
              @click="setTab('escrow')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition text-left"
              :class="activeTab === 'escrow' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="14" />
              <span>{{ '10. Güvenli Havuz (Escrow) & Ödeme Sözleşmesi' }}</span>
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
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TANIMLAR VE HUKUKİ NİTELİK</h3>
                <p>1.1. <strong>Platform:</strong> Mülkiyeti ve işletmesi Şirket\'e ait olan web sitesi, mobil uygulamalar, API servisleri ve canlı eksiltme sunucularını ifade eder.</p>
                <p>1.2. <strong>Aracı Hizmet Sağlayıcı:</strong> 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun Madde 2/1-d uyarınca, başkalarına ait iktisadi ve ticari faaliyetlerin yapılmasına elektronik ticaret ortamını sağlayan Şirket\'tir.</p>
                <p>1.3. <strong>Alıcı (İhale Sahibi):</strong> Kendi ticari gereksinimleri doğrultusunda mal, hizmet veya yapım işi satın almak üzere Platform üzerinde şartname yayınlayan onaylı tüzel kişi kullanıcıdır.</p>
                <p>1.4. <strong>Tedarikçi (Teklif Veren):</strong> Alıcı tarafından açılan ihalelere ticari teklif sunan, fiyat indirim adımlarını takip eden ve eksiltmeye katılan onaylı işletmedir.</p>
                <p>1.5. <strong>Canlı Eksiltme (Reverse Auction):</strong> Belirlenen süre zarfında tedarikçilerin anlık olarak fiyat düşürdüğü dijital ihale yarışıdır.</p>
              </section>

              <section class="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">MADDE 2 — ARACI HİZMET SAĞLAYICI KONUMU VE TAM SORUMSUZLUK KAYDI</h3>
                <p>2.1. <strong>Sözleşmenin Tarafı Olmama:</strong> Şirket, Alıcı ile Tedarikçi arasında kurulan hiçbir alım-satım, eser, hizmet veya tedarik sözleşmesinin tarafı, garantörü, kefili, temsilcisi veya acentesi DEĞİLDİR.</p>
                <p>2.2. <strong>İçerik ve Mal Sorumsuzluğu:</strong> 6563 Sayılı Kanun Madde 9 uyarınca Şirket, Kullanıcılar tarafından sunulan teknik şartnamelerin, tekliflerin, ürün tanımlarının ve görsellerin doğruluğunu, yasallığını veya ayıptan ari olduğunu araştırmakla yükümlü değildir.</p>
                <p>2.3. <strong>Ayıp, Hasar ve İfa İmkansızlığı:</strong> Tedarik edilen malların kusurlu, hasarlı, eksik çıkması, geç teslim edilmesi, şartnameye uymaması veya teslim edilmemesi durumunda tek muhatap Tedarikçi\'dir. Alıcı, bu nedenlerle Şirket\'ten hiçbir nam altında maddi/manevi tazminat talep edemez.</p>
                <p>2.4. <strong>Ödeme Temerrüdü:</strong> Alıcı\'nın mal/hizmet bedelini ödememesi veya geciktirmesi halinde tek muhatap Alıcı\'dır. Şirket hiçbir şekilde borçlu veya müteselsil kefil sıfatı taşımaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — KURUMSAL ÜYELİK, TEMSİL YETKİSİ VE HESAP GÜVENLİĞİ</h3>
                <p>3.1. Platform yalnızca Türk Ticaret Kanunu uyarınca tescil edilmiş tacirlerin ve tüzel kişilerin kullanımına açıktır. Bireysel tüketici (B2C) işlemlerine kapalıdır.</p>
                <p>3.2. Üyelik açan kişi, temsil ettiği şirketi ilzam ve taahhüt altına sokmaya hukuken tam yetkili olduğunu beyan eder. Yetkisiz temsil durumunda hesabı açan gerçek kişi Türk Borçlar Kanunu Madde 46 uyarınca şahsen ve müteselsilen sorumludur.</p>
                <p>3.3. Hesap kullanıcı adı, şifre ve 2FA kodlarının güvenliği münhasıran Kullanıcı\'ya aittir. Kullanıcı hesabından yapılan tüm ihale açma ve teklif verme işlemleri Kullanıcı\'yı kesin olarak bağlar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — TEKLİFLERİN BAĞLAYICILIĞI VE İHALE SERBESTİSİ</h3>
                <p>4.1. Alıcı\'nın açtığı ihale hukuken "icaba davet" mahiyetindedir. Alıcı, ihaleyi dilediği aşamada iptal etmekte, ertelemekte veya en düşük teklifi veren yerine teslimat/kalite şartlarına göre başka bir tedarikçiyi tercih etmekte tamamen serbesttir. Bu durum Tedarikçi\'ye herhangi bir tazminat hakkı vermez.</p>
                <p>4.2. Tedarikçi\'nin canlı eksiltme süresince verdiği her teklif kesin ve geri alınamaz bir ticari taahhüttür (icap). Tedarikçi, ihaleyi kazandıktan sonra teklifinden dönemez, fiyat artıramaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — REKABET HUKUKU VE MANİPÜLASYON YASAĞI</h3>
                <p>5.1. Tedarikçilerin aralarında anlaşarak taban fiyat belirlemesi (kartel), muvazaalı veya yapay teklifler vermesi, aynı sermaye grubuna ait firmalar üzerinden fiyat manipülasyonu yapması kesinlikle yasaktır.</p>
                <p>5.2. 4054 Sayılı Rekabetin Korunması Hakkında Kanun\'a aykırı hareket eden kullanıcıların hesapları derhal kapatılır, ihaleleri iptal edilir ve yetkili kamu mercilerine (Rekabet Kurumu, Savcılık) bildirimde bulunulur.</p>
              </section>

              <section class="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">MADDE 6 — SORUMLULUĞUN SINIRLANDIRILMASI (CAP ON LIABILITY)</h3>
                <p>6.1. <strong>Dolaylı Zararların Reddi:</strong> Şirket; kar kaybı, ciro kaybı, iş durması, veri kaybı, itibar kaybı veya dolaylı/özel hiçbir zarardan kusurlu olsa dahi sorumlu tutulamaz.</p>
                <p>6.2. <strong>Azami Mali Sorumluluk Tavanı:</strong> Şirket\'in işbu Sözleşme\'den veya Platform\'un kullanımından kaynaklanan kanıtlanmış doğrudan zararlardaki toplam mali sorumluluğu, Kullanıcı\'nın zarara yol açan olaydan önceki son üç (3) ay içinde Şirket\'e fiilen ödediği toplam net abonelik bedeli ile kesin olarak sınırlandırılmıştır.</p>
                <p>6.3. <strong>Teknik Kesintiler ve Siber Saldırılar:</strong> Telekomünikasyon sağlayıcıları, internet omurga arızaları, elektrik kesintileri, DDOS saldırıları veya donanım çökmeleri nedeniyle ihalenin aksamasından veya teklif iletilememesinden Şirket sorumlu değildir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 7 — MÜCBİR SEBEPLER VE TEK TARAFLI DEĞİŞİKLİK</h3>
                <p>7.1. Doğal afetler, savaş, seferberlik, yangın, salgın hastalık, grev, siber terör, yasal mevzuat değişiklikleri gibi Şirket\'in makul kontrolü dışındaki hallerde Şirket yükümlülüklerini ifa edememekten sorumlu tutulamaz.</p>
                <p>7.2. Şirket, işbu Sözleşme şartlarını ve platform kurallarını web sitesinde yayınlamak suretiyle dilediği zaman tek taraflı olarak güncelleme hakkını saklı tutar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 8 — DELİL SÖZLEŞMESİ, UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3>
                <p>8.1. <strong>HMK 193 Delil Sözleşmesi:</strong> Taraflar arasında doğabilecek her türlü uyuşmazlıkta Şirket\'in sunucu logları, veri tabanı kayıtları, zaman damgalı sistem günlükleri ve e-posta kayıtları HMK 193 uyarınca münhasır, bağlayıcı ve kesin delil teşkil eder.</p>
                <p>8.2. <strong>Yetki:</strong> İşbu Sözleşme Türkiye Cumhuriyeti Kanunlarına tabidir. Uyuşmazlıkların çözümünde İstanbul ve Balıkesir Mahkemeleri ile İcra Daireleri münhasıran yetkilidir.</p>
              </section>
            </div>
          </article>

          <!-- 2. GİZLİLİK POLİTİKASI (PRIVACY POLICY) -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">TİCARİ SIR KORUMASI</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">TLS 1.3 & AES-256</span>
              <span class="text-xs text-slate-400">Revizyon: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '2. Gizlilik, Veri Güvenliği ve Ticari Sırların Korunması Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'Bu Gizlilik Politikası, İhaleciBurada platformu üzerinden işlenen kurumsal verilerin, şartnamelerin, tekliflerin ve ticari sırların korunma esaslarını, güvenlik sınırlarını ve platform işleticisinin sorumluluk muafiyetlerini düzenler.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — İŞLENEN BİLGİ KAPSAMI VE ANONİMLİK</h3>
                <p>1.1. Şirket unvanı, VKN, MERSİS, yetkili kimlik bilgileri, ihale şartnameleri, teknik çizimler, birim fiyatlar ve ödeme kayıtları platform operasyonu için zorunlu olarak işlenir.</p>
                <p>1.2. <strong>Anonim Teklif Güvencesi:</strong> Canlı eksiltme sırasında tedarikçi unvanları sistem tarafından maskelenir (Firma A, Firma B vb.); böylece tarafsız rekabet ve fiyat gizliliği korunur.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — ŞARTNAME VE FİKRİ MÜLKİYET SORUMSUZLUK KAYDI</h3>
                <p>2.1. Alıcı tarafından sisteme yüklenen şartname, teknik çizim veya formüllerin üçüncü tarafların patent, telif veya ticari sır haklarını ihlal etmesinden kaynaklanan her türlü hukuki ve cezai sorumluluk münhasıran Alıcı\'ya aittir.</p>
                <p>2.2. Şirket, yüklenen şartnameleri önceden incelemekle veya doğrulamakla yükümlü değildir. İhlal iddiası durumunda "Uyar-Kaldır" (Notice-and-Takedown) mekanizması işletilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — VERİ GÜVENLİĞİ VE SİBER RİSKLER</h3>
                <p>3.1. Platform uçtan uca TLS 1.3 şifreleme ve ISO 27001 sertifikalı Tier-3 veri merkezi sunucuları ile korunur.</p>
                <p>3.2. Kullanıcı\'nın kendi donanımındaki virüsler, şifre sızdırması veya oltalama (phishing) saldırıları sonucu uğrayacağı veri kayıplarından Şirket sorumlu tutulamaz.</p>
                <p>3.3. Mahkeme, savcılık, MASAK veya yetkili idari mercilerin yasal talepleri doğrultusunda bilgi paylaşılması gizlilik ihlali sayılmaz.</p>
              </section>
            </div>
          </article>

          <!-- 3. KVKK / GDPR (DATA PROCESSING AGREEMENT - DPA) -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">6698 SAYILI KVKK</span>
              <span class="px-3 py-1 bg-purple-50 text-purple-800 font-mono text-xs font-bold rounded-lg border border-purple-200">VERİ SORUMLUSU AYDINLATMA</span>
              <span class="text-xs text-slate-400">Versiyon: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '3. KVKK Aydınlatma Metni ve Veri İşleme Sözleşmesi (DPA)' }}
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ '6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") Madde 10 uyarınca, veri sorumlusu sıfatıyla İhaleciBurada platform işleticisi tarafından işlenen kişisel verilere ilişkin kurumsal aydınlatma metnidir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — VERİ SORUMLUSUNUN KİMLİĞİ VE TEMSİLCİSİ</h3>
                <p>Veri Sorumlusu: İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu İşleticisi</p>
                <p>İrtibat E-Posta: <strong>ihalecib@gmail.com</strong> | DPO Hattı: <strong>0850 308 00 00</strong></p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — İŞLENEN KİŞİSEL VERİLER VE HUKUKİ SEBEPLER</h3>
                <p>2.1. Şirket yetkililerine ve personeline ait Ad-Soyad, TCKN, kurumsal e-posta, telefon, imza örneği ve IP kayıtları işlenmektedir.</p>
                <p>2.2. Hukuki Sebepler: KVKK Madde 5/2-c (Sözleşmenin kurulması ve ifası), 5/2-ç (Kanuni yükümlülüklerin yerine getirilmesi) ve 5/2-f (Meşru menfaat ve işlem güvenliği).</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — VERİ AKTARIMI VE SAKLAMA SÜRELERİ</h3>
                <p>3.1. Kişisel veriler yalnızca kanunen yetkili kamu kurumlarına, BDDK/TCMB lisanslı ödeme kuruluşlarına ve e-Fatura entegratörlerine mevzuatın çizdiği sınırlar dahilinde aktarılır.</p>
                <p>3.2. Ticari işlem kayıtları Türk Ticaret Kanunu ve Vergi Usul Kanunu gereğince on (10) yıl süreyle güvenli arşivde saklanır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — İLGİLİ KİŞİNİN HAKLARI VE BAŞVURU YÖNTEMİ</h3>
                <p>4.1. Veri sahipleri KVKK Madde 11 uyarınca bilgi talep etme, düzeltme, silme ve zararın giderilmesini talep etme hakkına sahiptir.</p>
                <p>4.2. Başvurular kayıtlı kurumsal e-posta veya KEP adresi üzerinden yazılı olarak iletildiğinde en geç 30 gün içinde ücretsiz sonuçlandırılır.</p>
              </section>
            </div>
          </article>

          <!-- 4. İHALE VE EKSİLTME KURALLARI (REVERSE AUCTION RULES) -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-red-50 text-red-800 font-mono text-xs font-bold rounded-lg border border-red-200">MANİPÜLASYON YASAĞI</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">DİNAMİK SÜRE UZATMA (+2 DK)</span>
              <span class="text-xs text-slate-400">Standart: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '4. B2B Canlı Eksiltme, Ters İhale ve Rekabet Standartları Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 1 — ŞARTNAME YAYINLAMA VE DEĞİŞİKLİK YASAĞI</h3>
                <p>1.1. Alıcı, satın alma kalemlerini, teknik kriterleri, teslimat şartlarını ve ödeme vadesini sisteme eksiksiz girmek zorundadır.</p>
                <p>1.2. İhale canlı yayına girdikten sonra şartnamede esaslı değişiklik yapılamaz; değişiklik gerekiyorsa ihale iptal edilir ve yeni ihale açılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 2 — DİNAMİK SÜRE UZATMA (ANTI-SNIPING) ALGORİTMASI</h3>
                <p>2.1. İhalenin son 2 dakikası içinde yeni bir en iyi teklif sunulursa, tüm tedarikçilerin eşit şartlarda rekabet edebilmesi için kalan süre otomatik olarak +2 dakika uzatılır.</p>
                <p>2.2. Bu uzatma mekanizması teknik algoritma tarafından yönetilir; Kullanıcılar bu uzatmalara veya sunucu saatine itiraz edemez.</p>
              </section>

              <section class="space-y-2 bg-red-50/50 p-4 rounded-xl border border-red-200">
                <h3 class="font-bold text-red-950 text-sm">KURAL 3 — CAYMA, İPTAL VE ZARAR TAZMİNİ SORUMSUZLUĞU</h3>
                <p>3.1. <strong>Tedarikçinin Cayması:</strong> Canlı eksiltmeyi kazandıktan sonra taahhüdünü yerine getirmeyen Tedarikçi, Alıcı\'nın uğrayacağı doğrudan zararlardan şahsen sorumludur. Platform bu uyuşmazlıkta taraf veya tazminat ödeyicisi değildir.</p>
                <p>3.2. <strong>Alıcının İptali:</strong> Alıcı, ihale sürecini veya sonucunu dilediği zaman iptal edebilir; Tedarikçiler teklif hazırlama gideri veya beklenen kar gerekçesiyle Platform\'dan tazminat talep edemez.</p>
              </section>
            </div>
          </article>

          <!-- 5. MESAFELİ SATIŞ VE ABONELİK (DISTANCE SALES AGREEMENT) -->
          <article v-if="activeTab === 'mesafeli-satis'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-indigo-50 text-indigo-800 font-mono text-xs font-bold rounded-lg border border-indigo-200">B2B TİCARİ ABONELİK</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">1 AY ÜCRETSİZ LANSMAN</span>
              <span class="text-xs text-slate-400">Yürürlük: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '5. Mesafeli Satış ve Kurumsal Abonelik Hizmet Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TARAFLAR VE TİCARİ NİTELİK</h3>
                <p>1.1. İşbu Sözleşme Türk Ticaret Kanunu hükümleri uyarınca iki tacir arasında akdedilmiştir. 6502 Sayılı Tüketici Kanunu hükümleri ve genel tüketici cayma hakları uygulanmaz.</p>
                <p>1.2. Hizmet Konusu: B2B ihale açma, teklif yönetimi, canlı eksiltme modülü ve analitik raporlara dijital abonelik erişimidir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — FİYATLANDIRMA, 1 AY DENEME VE FATURALANDIRMA</h3>
                <p>2.1. Platformda 1 Ay Lansman Denemesi 0 ₺ olarak sunulur. Devamında 3, 6 ve 9 aylık kurumsal paketler seçilebilir.</p>
                <p>2.2. Abonelik ücretleri kredi kartı veya havale ile tahsil edilir. Faturalar ödeme onayını takiben e-Fatura/e-Arşiv olarak düzenlenir. TTK Madde 18/3 uyarınca 8 gün içinde itiraz edilmeyen faturalar kesinleşir.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — DİJİTAL HİZMET İFASI VE İADE İSTİSNASI</h3>
                <p>3.1. Yazılım ve erişim hizmeti satın alma anında derhal ifa edildiğinden, aktif döneme ait abonelik bedellerinde kısmi veya tam iade yapılmaz.</p>
                <p>3.2. Kullanıcı dilediği zaman panel üzerinden otomatik yenilemeyi iptal edebilir; iptal bir sonraki dönemden itibaren geçerli olur.</p>
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
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — KULLANILAN ÇEREZ TÜRLERİ</h3>
                <p>1.1. <strong>Zorunlu Çerezler:</strong> Kullanıcı girişi, oturum kimliği, CSRF koruması ve websocket canlı teklif akışı için şarttır; kapatılamaz.</p>
                <p>1.2. <strong>İşlevsel Çerezler:</strong> Dil seçimi (TR/EN), filtreleme ve UI tercihlerini depolar.</p>
                <p>1.3. <strong>Performans Çerezleri:</strong> Sayfa hızları ve sistem hatalarını tespit ederek kesintisiz ihale deneyimi sağlar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — SORUMLULUK SINIRI</h3>
                <p>2.1. Zorunlu çerezlerin tarayıcı tarafından engellenmesi halinde canlı ihale teklif motorunun çalışmamasından Platform sorumlu değildir.</p>
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
                <h3 class="font-bold text-slate-900 text-sm">STANDART 1 — ZORUNLU RESMİ EVRAKLAR</h3>
                <p>1.1. Tedarikçiler; Vergi Levhası, Ticaret Sicil Gazetesi, Noter Onaylı İmza Sirküleri ve Faaliyet Belgesini sisteme yüklemekle yükümlüdür.</p>
                <p>1.2. Sahte veya tahrif edilmiş evrak sunan firmaların hesapları derhal kapatılır ve Cumhuriyet Savcılığı\'na suç duyurusunda bulunulur.</p>
              </section>

              <section class="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">STANDART 2 — MAVİ ONAY ROZETİNİN HUKUKİ ANLAMI (ÖNEMLİ BEYAN)</h3>
                <p>2.1. Platform üzerindeki <strong>"Mavi Onay Rozeti"</strong>, yalnızca firmanın ibraz ettiği resmi evrakların şeklen incelendiğini gösterir.</p>
                <p>2.2. Mavi Rozet; firmanın mali gücüne, iflas etmeyeceğine, malı ayıpsız teslim edeceğine veya ticari güvenilirliğine Şirket\'in <strong>kefil veya garantör olduğu anlamına KESİNLİKLE GELMEZ</strong>.</p>
                <p>2.3. Alıcı, sipariş vermeden önce tedarikçi ile ilgili kendi ticari ve hukuki basiretini (TTK Madde 18/2) göstermekle yükümlüdür.</p>
              </section>
            </div>
          </article>

          <!-- 8. SLA (SERVICE LEVEL AGREEMENT) -->
          <article v-if="activeTab === 'sla'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">%99.9 UPTIME</span>
              <span class="px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">HİZMET KREDİSİ TAZMİNİ</span>
              <span class="text-xs text-slate-400">SLA Sürüm: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '8. Servis Seviyesi Taahhüdü ve Sistem Kesintisizliği (SLA)' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — ERİŞİLEBİLİRLİK VE İSTİSNALAR</h3>
                <p>1.1. Platform, aylık bazda en az <strong>%99.9</strong> kesintisizlik oranı taahhüt eder.</p>
                <p>1.2. Önceden duyurulan planlı bakımlar (01:00-05:00 gece penceresi), telekomünikasyon altyapı arızaları, siber saldırılar (DDoS) ve mücbir sebepler kesinti süresi hesabına dahil edilmez.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — TAZMİNAT SINIRI (YALNIZCA HİZMET KREDİSİ)</h3>
                <p>2.1. SLA oranının %99.0\'ın altına düşmesi halinde Şirket nakit tazminat ödemez; yalnızca abonenin bir sonraki fatura dönemine mahsuben %10 Hizmet Kredisi tanımlar.</p>
                <p>2.2. Kesintiden doğduğu iddia edilen kar kaybı veya ticari kayıplar için hiçbir tazminat talebinde bulunulamaz.</p>
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
                <h3 class="font-bold text-slate-900 text-sm">İLKE 1 — BGYS VE ŞİFRELEME STANDARTLARI</h3>
                <p>1.1. Platform altyapısı ISO/IEC 27001 standardında işletilmektedir. Veritabanı ve yedekleme sistemleri AES-256 algoritmasıyla şifrelenir.</p>
                <p>1.2. Sistem bağımsız güvenlik şirketleri tarafından periyodik olarak sızma testlerine (pentest) tabi tutulur.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">İLKE 2 — KULLANICI GÜVENLİK YÜKÜMLÜLÜKLERİ</h3>
                <p>2.1. Kullanıcı, 2FA kodlarını ve API anahtarlarını gizli tutmakla yükümlüdür. Yetkisiz erişim tespit edildiğinde derhal Platform\'a bildirilmelidir.</p>
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
              <section class="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">MADDE 1 — PLATFORMUN BANKA OLMADIĞI VURGUSU (TCMB & BDDK KORUMASI)</h3>
                <p>1.1. Şirket bir banka, finansal kuruluş veya ödeme kuruluşu DEĞİLDİR. Platform mevduat toplamaz, faiz işletmez ve kredi vermez.</p>
                <p>1.2. Güvenli Havuz (Escrow) ve Otomatik Para Bölme (Split Payment) işlemleri, TCMB ve BDDK tarafından lisanslanmış yetkili ödeme kuruluşları (PayTR, İyzico vb.) aracılığıyla yürütülür.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — BLOKE VE SERBEST BIRAKMA MEKANİZMASI</h3>
                <p>2.1. İhalede mutabakat sağlandığında Alıcı ihale bedelini lisanslı havuz hesabına yatırır; tutar lisanslı kuruluş nezdinde bloke edilir.</p>
                <p>2.2. Tedarikçi malı sevk edip sevk irsaliyesini sisteme yükler. Alıcı mal kabul onayını verdiğinde havuzdaki bloke çözülür; platform aracılık komisyonu kesilerek kalan hakediş Tedarikçi IBAN\'ına aktarılır.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — ONAY SONRASI SORUMSUZLUK VE UYUŞMAZLIK HAKEM HEYETİ</h3>
                <p>3.1. <strong>Onay Sonrası Sorumsuzluk:</strong> Alıcı mal kabul onayını verdikten sonra blokaj çözülmüş olacağından, sonradan ortaya çıkacak gizli ayıp veya eksiklikler nedeniyle Platform\'dan geri ödeme talep edilemez. Alıcı doğrudan Tedarikçi\'ye yasal başvuru yapmalıdır.</p>
                <p>3.2. <strong>Uyuşmazlık Bildirimi:</strong> Mal kabul onayından önce Alıcı uyuşmazlık bildirirse havuzdaki bloke çözülmez; Platform Escrow Hakem Heyeti teknik inceleme başlatır. Hakem Heyeti kararı yalnızca havuzdaki tutarın idari olarak yönlendirilmesine ilişkin olup mahkeme hükmü yerine geçmez.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — VERGİSEL SORUMLULUKLAR</h3>
                <p>4.1. Satışa konu mal/hizmetin asıl faturası, KDV, tevkifat ve stopaj beyanları münhasıran Tedarikçi ile Alıcı arasındadır. Şirket yalnızca tahsil ettiği aracılık hizmet komisyonu için e-Fatura düzenler.</p>
              </section>
            </div>
          </article>

          <!-- 11. HAKKIMIZDA & VİZYON -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Hakkımızda, Misyon ve Vizyonumuz' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {{ 'İhaleciBurada, kurumsal satın alma ve tedarik süreçlerini şeffaf, rekabetçi ve tamamen dijital bir borsaya dönüştüren bağımsız B2B e-ihale platformudur.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BİZ KİMİZ?</h3>
                <p>Sanayi, inşaat, lojistik, ambalaj ve kurumsal sarf sektörlerinde onaylı üretici ve alıcıları buluşturuyoruz. Zaman damgalı canlı eksiltme altyapımız ile satın alma maliyetlerinde ortalama %14.2 tasarruf sağlarken, alıcı ve tedarikçiler arasındaki ticareti hızlandırıyoruz.</p>
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
                  Tersine Canlı Eksiltme (Reverse Auction) ile Satın Alma Maliyetlerini %18 Düşürmenin 5 Adımı
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
