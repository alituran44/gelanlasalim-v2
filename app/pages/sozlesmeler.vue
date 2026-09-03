<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  FileText, 
  Shield, 
  Info, 
  ArrowLeft, 
  Printer, 
  Scale, 
  Gavel, 
  Cookie as CookieIcon, 
  ShieldCheck 
} from 'lucide-vue-next'
import { detectLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()

export type TabKey = 
  | 'kullanim' 
  | 'gizlilik' 
  | 'mesafeli-satis'
  | 'ihale-kurallari'
  | 'cerezler'
  | 'hakkimizda'

const activeTab = ref<TabKey>('kullanim')

function normalizeTab(rawTab: string | undefined): TabKey {
  if (!rawTab) return 'kullanim'
  const t = rawTab.toLowerCase()
  if (t === 'kullanim' || t === 'sla' || t === 'tedarikci-uyum') return 'kullanim'
  if (t === 'gizlilik' || t === 'kvkk' || t === 'bilgi-guvenligi') return 'gizlilik'
  if (t === 'mesafeli-satis' || t === 'on-bilgilendirme' || t === 'iptal-iade' || t === 'teslimat') return 'mesafeli-satis'
  if (t === 'ihale-kurallari' || t === 'escrow') return 'ihale-kurallari'
  if (t === 'cerezler' || t === 'cookies') return 'cerezler'
  if (t === 'hakkimizda' || t === 'kariyer' || t === 'is-ortakligi' || t === 'blog' || t === 'basin') return 'hakkimizda'
  return 'kullanim'
}

onMounted(() => {
  detectLocale()
  if (route.query.tab) {
    activeTab.value = normalizeTab(route.query.tab as string)
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = normalizeTab(newTab as string)
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
              <strong class="text-slate-900">ihalecib@gmail.com</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">KEP Adresi</span>
              <strong class="text-slate-900 font-mono">hasanhuseyin.yildirim.17@hs01.kep.tr</strong>
            </div>
          </div>
        </div>
      </div>

      
      <!-- 🛡️ RESMİ ARACI HİZMET SAĞLAYICI VE HUKUKİ SORUMSUZLUK BEYANI (6563 SK MADDE 9) -->
      <div class="mb-8 rounded-3xl bg-slate-900 border-2 border-blue-600/40 p-6 sm:p-8 text-white shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <Scale :size="24" />
          </div>
          <div>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-mono text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
              6563 SAYILI ELEKTRONİK TİCARET KANUNU VE TTK UYARINCA
            </span>
            <h2 class="text-base sm:text-lg font-black text-white mt-1">
              ARACI HİZMET SAĞLAYICI VE ELEKTRONİK PAZAR YERİ HUKUKİ STATÜSÜ
            </h2>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong class="text-white">1. Taraflar Arasındaki İlişki:</strong> İhaleciBurada (Platform), 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun'un 2/1-d ve 9. maddeleri ile Elektronik Ticarette Hizmet Sağlayıcılar Yönetmeliği kapsamında münhasıran bir <strong>"Aracı Hizmet Sağlayıcı" (Elektronik Pazar Yeri & Yer Sağlayıcı)</strong> niteliğindedir.
          </p>
          <p>
            <strong class="text-white">2. Sözleşmenin Tarafı Olmama ve Tam Sorumsuzluk:</strong> Platform; Alıcı (İhale Sahibi) ile Satıcı / Tedarikçi (Teklif Veren) arasında kurulan hiçbir alım-satım, sipariş, eser, hizmet veya taşeronluk sözleşmesinin <strong>tarafı, kefili, garantörü, komisyoncusu veya acentesi DEĞİLDİR</strong>.
          </p>
          <p>
            <strong class="text-white">3. Ayıp, Teslimat, Eksik İfa ve Cayma Sorumsuzluğu:</strong> İhale konusu malların/hizmetlerin ayıplı, kusurlu, eksik olması, taahhüt edilen sürede teslim edilmemesi, şartnameye uymaması veya ödemenin gecikmesi hallerinde Platform'un hiçbir doğrudan, dolaylı veya müteselsil hukuki veya cezai sorumluluğu bulunmamaktadır. Alıcı ve Satıcı arasındaki uyuşmazlıklarda yegane muhatap sözleşmenin taraflarıdır.
          </p>
          <p>
            <strong class="text-white">4. Sabit %4 Escrow ve Platform Komisyonu:</strong> Platformumuzda <strong>sektör ayrımı yapılmaksızın tüm işlemler için sabit net %4 (+ KDV) Escrow Güvenli Havuz ve Platform Hizmet Bedeli</strong> uygulanır. Bu komisyon bedeli yalnızca ihale başarıyla tamamlanıp mal/hizmet teslimatı alıcı tarafından onaylandığında hakediş tutarından tahakkuk ettirilir. Kazanılamayan, sonuçsuz kalan veya iptal edilen ihalelerden hiçbir komisyon tahsil edilmez.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar Navigation (4 cols) -->
        <div class="lg:col-span-4 space-y-4">
          
          <!-- Legal Contracts Group (5 Essential Tabs) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5 shadow-xs">
            <div class="text-[10px] font-black text-blue-900 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
              <Scale :size="13" class="text-blue-600" />
              <span>RESMİ SÖZLEŞMELER (5 TEMEL BELGE)</span>
            </div>

            <button 
              @click="setTab('kullanim')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'kullanim' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <FileText :size="15" />
              <span>1. Kullanım Şartları & Hizmet Sözleşmesi</span>
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'gizlilik' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Shield :size="15" />
              <span>2. Gizlilik Politikası & KVKK Aydınlatma</span>
            </button>

            <button 
              @click="setTab('mesafeli-satis')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'mesafeli-satis' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="15" />
              <span>3. Mesafeli Satış & Abonelik Sözleşmesi</span>
            </button>

            <button 
              @click="setTab('ihale-kurallari')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'ihale-kurallari' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Gavel :size="15" />
              <span>4. B2B İhale ve Satın Alma Kuralları</span>
            </button>

            <button 
              @click="setTab('cerezler')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'cerezler' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CookieIcon :size="15" />
              <span>5. Çerez (Cookie) Politikası</span>
            </button>
          </div>

          <!-- Corporate Info Group (1 About Tab) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-xs">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">KURUMSAL BİLGİ</div>
            
            <button 
              @click="setTab('hakkimizda')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'hakkimizda' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Info :size="15" />
              <span>Hakkımızda & Vizyonumuz</span>
            </button>
          </div>
        </div>

        <!-- Content Display Area (8 cols) -->
        <main class="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs min-h-[600px] text-slate-800">
          
          <!-- Document Header Tag -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              RESMİ HUKUKİ METİN · YÜRÜRLÜK TARİHİ: 2026.08
            </span>
            <span class="text-[11px] font-mono font-bold text-slate-400">
              MERSİS: 0470085421000001
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
                <h3 class="font-bold text-blue-950 text-sm">MADDE 2 — ARACI HİZMET SAĞLAYICI KONUMU, KOMİSYON ORANLARI VE TAM SORUMSUZLUK KAYDI</h3>
                <div class="p-3.5 bg-white rounded-xl border border-blue-300 space-y-1.5 text-[11px] text-blue-950">
                  <p class="font-black text-xs text-blue-900 flex items-center gap-1.5">
                    <span>⚖️ YASAL STATÜ: 6563 SAYILI KANUN KAPSAMINDA ARACI HİZMET SAĞLAYICI</span>
                  </p>
                  <p>
                    Platform işleticisi Şirket, 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun m. 2/1-d ve m. 9 uyarınca münhasıran <strong>Aracı Hizmet Sağlayıcı (Elektronik Pazar Yeri & Yer Sağlayıcı)</strong> konumundadır. Platform; Alıcı ile Tedarikçi arasında akdedilen hiçbir ticari sözleşmenin, siparişin veya edimin <strong>tarafı, kefili, garantörü veya vekili DEĞİLDİR</strong>.
                  </p>
                </div>
                <p>2.1. <strong>Sektör Ayrımı Olmaksızın Sabit %4 Escrow Komisyonu:</strong></p>
                <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 space-y-1 text-xs">
                  <p class="font-bold">✓ Sabit Oran Standartı: Tüm sektörlerde sabit %4 (+ KDV) Escrow ve Başarı Komisyonu uygulanır.</p>
                  <p class="text-[11px] leading-relaxed">
                    İhale ve satın alma işlemlerinde sektör ayrımı yapılmaksızın tüm kategorilerde aynı şeffaf oran geçerlidir. Bu komisyon yalnızca ihale kesinleşip mal kabul tutanağı onaylandığında hakediş tutarından tahsil edilir. İptal edilen, tamamlanmayan veya kazanılamayan ihalelerde hiçbir komisyon veya ücret alınmaz (%0).
                  </p>
                </div>
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
                <p>3.2. Şirket, yüklenen şartnamelerin içeriğini önceden incelemek, patent veri tabanlarında araştırmak veya doğrulamakla yükümlü değildir. Hak ihlali iddiasında bulunan hak sahipleri "Uyar-Kaldır" mekanizması kapsamında <strong>ihalecib@gmail.com</strong> adresine noter onaylı delilleriyle başvurduğunda ilgili içerik derhal incelemeye alınır.</p>
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
                <p>1.3. E-Posta: <strong>ihalecib@gmail.com</strong> | DPO İletişim: <strong>0850 840 86 95</strong></p>
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
                  <p><strong>Telefon / Müşteri Destek:</strong> 0850 840 86 95 | <strong>E-Posta:</strong> ihalecib@gmail.com</p>
                  <p><strong>KEP Adresi:</strong> hasanhuseyin.yildirim.17@hs01.kep.tr | <strong>Web Sitesi:</strong> https://ihaleciburada.com</p>
                </div>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — HİZMETİN TEMEL NİTELİKLERİ VE FİYATLANDIRMA</h3>
                <p>2.1. <strong>Hizmet Türü ve Aracı Kurum Statüsü:</strong> Şirketimiz 6563 Sayılı Elektronik Ticaret Kanunu uyarınca Aracı Hizmet Sağlayıcı olup bulut tabanlı B2B e-ihale açma, teklif toplama, canlı tersine eksiltme (reverse auction), tedarikçi KYC doğrulama ve güvenli Escrow havuz entegrasyonu hizmeti sunmaktadır.</p>
                <p>2.1.1. <strong>Sabit %4 Escrow ve Hizmet Bedeli Oranı:</strong> Platformumuzda sektör ayrımı yapılmaksızın tüm işlemler için sabit net %4 (+ KDV) Escrow Güvenli Havuz ve teknolojik pazar yeri işletim bedeli tahsil edilir. Bu bedel yalnızca ihale tamamlanıp mal/hizmet teslimatı alıcı tarafından onaylandığında hakedişten kesilir; kazanılamayan ihalelerden hiçbir ücret alınmaz.</p>
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
                <p>5.1. Abone, hizmete ilişkin her türlü talep ve şikayetini <strong>0850 840 86 95</strong> no\'lu destek hattından veya <strong>ihalecib@gmail.com</strong> adresinden kurumsal müşteri temsilcilerimize iletebilir. Başvurular en geç 24 saat içinde yanıtlanır.</p>
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
              </section>

              <section class="space-y-2 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">MADDE 3 — ANINDA DİJİTAL İFA VE TESLİMAT</h3>
                <p>3.1. Hizmet tamamen dijital ortamda sunulmakta olup herhangi bir fiziksel kargo teslimatı veya kargo bedeli bulunmamaktadır.</p>
                <p>3.2. PayTR / iyzico 3D Secure ödeme onayı alındığı anda veya 1 Aylık Ücretsiz Deneme başlatıldığında, abonenin kullanıcı hesabı <strong>anında (0 saniye gecikmeyle)</strong> aktif edilir.</p>
                <p>3.3. E-Fatura / e-Arşiv faturası en geç 7 iş günü içerisinde düzenlenerek abonenin e-posta adresine iletilir.</p>
              </section>

              <section class="space-y-2 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">MADDE 4 — CAYMA HAKKI, İADE VE GERİ ÖDEME KOŞULLARI</h3>
                <p>4.1. <strong>Dijital İfa İstisnası:</strong> Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-ğ uyarınca elektronik ortamda anında ifa edilen gayrimaddi hizmetlerde re'sen cayma hakkı bulunmamaktadır.</p>
                <p>4.2. <strong>İade Yapılacak Haller:</strong> Mükerrer/hatalı çekimlerde tutar 24 saat içinde kesintisiz iade edilir. Platform kaynaklı arıza nedeniyle hesabın 48 saat aktif edilememesi halinde bedel %100 kesintisiz iade edilir.</p>
                <p>4.3. <strong>Geri Ödeme Süresi:</strong> Onaylanan iadeler kredi kartına 3-7 iş günü, banka havalesine 1-3 iş günü içinde yansıtılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — ABONELİK YENİLEME VE İPTAL</h3>
                <p>5.1. Abone, panel üzerinden dilediği an bir sonraki döneme ait otomatik yenilemeyi iptal edebilir. Süre bitimine kadar hakları korunur, ek ücret tahsil edilmez.</p>
              </section>
            </div>
          </article>

          <!-- ========================================================================= -->
          <!-- 4. B2B İHALE, TERSİNE EKSİLTME & ESCROW GÜVENLİK KURALLARI -->
          <!-- ========================================================================= -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-red-50 text-red-800 font-mono text-xs font-bold rounded-lg border border-red-200">MANİPÜLASYON & KARTEL YASAĞI</span>
              <span class="px-3 py-1 bg-blue-50 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-200">ANTİ-SNİPİNG (+2 DK SÜRE UZATMA)</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">TCMB ESCROW BLOKE VE HAKEDİŞ</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              4. B2B İhale, Tersine Eksiltme ve Escrow Güvenlik Kuralları
            </h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              Platformumuzda düzenlenen tüm satın alma ihaleleri, canlı tersine eksiltmeler, tedarikçi teklif verme süreçleri ve Escrow güvenli havuz ödeme mutabakatı işbu kurallara tabidir.
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 1 — İHALE AÇMA, ŞARTNAME VE TAVAN BÜTÇE</h3>
                <p>1.1. Alıcı firma; talep ettiği ürün/hizmetin teknik özelliklerini, metrajını, teslimat adresini, kabul şartlarını ve başlangıç tavan bütçesini eksiksiz girmelidir.</p>
                <p>1.2. İhale canlı yayına alındıktan ve teklif toplanmaya başlandıktan sonra şartnamede esaslı değişiklik yapılamaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 2 — CANLI TERSİNE EKSİLTME VE DİNAMİK SÜRE UZATMA (+2 DK)</h3>
                <p>2.1. Canlı eksiltmede tedarikçiler başlangıç tavan fiyatından aşağı doğru en az tanımlanan "Minimum İndirim Adımı" kadar indirim yaparak teklif sunar.</p>
                <p>2.2. <strong>Anti-Sniping:</strong> İhalenin bitimine son iki (2) dakika kala yeni bir en iyi teklif gelirse, sistem süreyi otomatik olarak +2 dakika uzatır.</p>
              </section>

              <section class="space-y-2 bg-red-50/60 p-4 rounded-xl border border-red-200">
                <h3 class="font-bold text-red-950 text-sm">KURAL 3 — TEKLİFİN KESİN BAĞLAYICILIĞI VE FİYAT FARKI TAZMİNİ</h3>
                <p>3.1. Tedarikçinin ihale ve satın almade verdiği her fiyat teklifi bağlayıcı bir ticari taahhüttür (icap). Kazanan tedarikçi teklifinden cayamayacağı gibi fiyat artıramaz.</p>
                <p>3.2. Cayma halinde tedarikçi, Alıcı'nın ikinci teklif sahibiyle çalışmasından doğacak fiyat farkı zararını doğrudan Alıcı'ya tazmin etmekle yükümlüdür.</p>
              </section>

              <section class="space-y-2 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">KURAL 4 — ESCROW GÜVENLİ HAVUZ VE HAKEDİŞ AKTARIMI</h3>
                <p>4.1. İhale mutabakatında Alıcı bedeli TCMB lisanslı güvenli havuz hesabına yatırır; tutar bloke edilir.</p>
                <p>4.2. Tedarikçi malı sevk edip sevk irsaliyesini yükler. Alıcı malı muayene edip mal kabul onayını verdiğinde havuzdaki bloke çözülerek hakediş Tedarikçiye aktarılır.</p>
                <p>4.3. Şirket bir banka değildir; fonlar lisanslı ödeme kuruluşu (PayTR/iyzico) nezdinde güvence altındadır.</p>
                <p>4.4. <strong>Sabit %4 Escrow ve Platform Komisyonu:</strong> Platformumuzda sektör ayrımı yapılmaksızın tüm ihalelerde <strong>sabit net %4 (+ KDV) Escrow Güvenli Havuz ve Başarı Hizmet Bedeli</strong> uygulanır. Bu bedel yalnızca ihale tamamlanıp mal kabul onayı verildiğinde hakediş tutarından tahakkuk ettirilir. İptal edilen, sonuçlanmayan veya kazanılamayan ihalelerde hiçbir komisyon alınmaz (%0).</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 5 — MAVİ ONAY ROZETİ (KYC) SORUMSUZLUK BEYANI</h3>
                <p>5.1. Mavi Rozet, firmanın ibraz ettiği resmi evrakların (Vergi Levhası, İmza Sirküleri, Faaliyet Belgesi) şeklen yüklendiğini gösterir; firmanın mali gücüne veya borç ödeme kabiliyetine Platform'un kefil olduğu anlamına gelmez.</p>
              </section>
            </div>
          </article>

          <!-- ========================================================================= -->
          <!-- 5. ÇEREZ (COOKIE) POLİTİKASI -->
          <!-- ========================================================================= -->
          <article v-if="activeTab === 'cerezler'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              5. Çerez (Cookie) ve Oturum Güvenliği Politikası
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — ÇEREZLERİN KULLANIM AMACI</h3>
                <p>1.1. Çerezler; oturum güvenliğinin sağlanması, canlı websocket ihale bağlantısının kopmaması, dil ve tema tercihlerinizin hatırlanması ve sistem hızının optimize edilmesi amacıyla kullanılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — ÇEREZ KATEGORİLERİ</h3>
                <p>2.1. <strong>Zorunlu & Güvenlik Çerezleri:</strong> 2FA kimlik doğrulama tokenları ve CSRF saldırı önleme mekanizmaları için şarttır; kapatılamaz.</p>
                <p>2.2. <strong>İşlevsellik & Performans Çerezleri:</strong> Tema (Aydınlık/Karanlık) ve pazar yeri filtre tercihlerini saklar.</p>
              </section>

              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — ÇEREZ YÖNETİMİ</h3>
                <p>3.1. Tarayıcı ayarlarınızdan çerez izinlerini dilediğiniz an değiştirebilirsiniz. Zorunlu oturum çerezlerinin kapatılması halinde canlı ihale odalarına giriş yapılamaz.</p>
              </section>
            </div>
          </article>

          <!-- ========================================================================= -->
          <!-- 6. HAKKIMIZDA & VİZYON -->
          <!-- ========================================================================= -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Hakkımızda, Misyon ve Vizyonumuz</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              İhaleciBurada, Türkiye genelindeki kurumsal satın alma ve tedarik operasyonlarını şeffaf, rekabetçi ve tamamen dijital bir borsaya dönüştüren bağımsız B2B e-ihale platformudur.
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

        </main>
      </div>

    </div>
  </div>
</template>

