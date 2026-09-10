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
  if (t === 'kullanim' || t === 'kullanici' || t === 'sla' || t === 'tedarikci-uyum') return 'kullanim'
  if (t === 'gizlilik' || t === 'kvkk' || t === 'riza' || t === 'bilgi-guvenligi') return 'gizlilik'
  if (t === 'mesafeli-satis' || t === 'on-bilgilendirme' || t === 'iptal-iade' || t === 'teslimat') return 'mesafeli-satis'
  if (t === 'ihale-kurallari' || t === 'aracilik' || t === 'escrow') return 'ihale-kurallari'
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
              Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)
            </h2>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              Platformumuz 6563 Sayılı Elektronik Ticaret Kanunu, 6102 Sayılı Türk Ticaret Kanunu ve 6493 Sayılı Ödeme Hizmetleri mevzuatına tam uyumlu olarak TCMB & BDDK lisanslı ödeme geçitleri (PayTR, iyzico) altyapısıyla faaliyet göstermektedir.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto text-[11px] font-medium text-slate-700 shrink-0">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">Vergi Dairesi & VKN</span>
              <strong class="text-slate-900 font-mono">Çanakkale / 9560161511</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[9px] font-black text-slate-400 block uppercase">İşletme Türü</span>
              <strong class="text-slate-900 font-semibold">B2B Ticari İşletme</strong>
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
            <strong class="text-white">4. Sabit %4 Escrow ve Platform Komisyonu:</strong> Platformumuzda <strong>alıcılar (ihale açan kurum ve şirketler) için %0 Komisyon (Sıfır Komisyon)</strong> uygulanır. İhaleyi kazanan satıcı/tedarikçiler için ise sektör ayrımı yapılmaksızın tüm işlemler için sabit net <strong>%4 (+ KDV) Escrow Güvenli Havuz ve Banka Transfer Altyapı Bedeli</strong> uygulanır. Bu komisyon bedeli yalnızca ihale başarıyla tamamlanıp mal/hizmet teslimatı alıcı tarafından onaylandığında hakediş tutarından tahakkuk ettirilir. Kazanılamayan, sonuçsuz kalan veya iptal edilen ihalelerden hiçbir komisyon tahsil edilmez (%0).
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
              <span>1. Kullanıcı Sözleşmesi</span>
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
              VKN: 9560161511
            </span>
          </div>

          <!-- 1. KULLANIM ŞARTLARI VE KULLANICI SÖZLEŞMESİ -->
          <article v-if="activeTab === 'kullanim'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-900 font-mono text-xs font-bold rounded-lg border border-blue-200">6563 SK & TTK UYUMLU</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">ARACI HİZMET SAĞLAYICI GÜVENCESİ</span>
              <span class="text-xs text-slate-400 font-mono">Belge Sürümü: TR-2026-09-10-01-R1</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ 'İhaleciBurada Kullanıcı Sözleşmesi' }}
            </h1>
            
            <!-- İşletmeci ve Yasal Tanıtım Kutusu -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p class="font-semibold text-slate-900">
                {{ 'Bu sözleşme, İhaleciBurada platformunu işleten Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi) ile platforma işletmesi adına katılan üye arasındaki platform kullanım ilişkisini düzenler. Hesabı kullanan gerçek kişi, temsil ettiği işletmeden ayrı olarak "yetkili kullanıcı"dır.' }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div><strong>İşletmeci:</strong> Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</div>
                <div><strong>Vergi Dairesi / VKN:</strong> Çanakkale V.D. / 9560161511</div>
                <div><strong>Adres:</strong> Çanakkale, Türkiye</div>
                <div><strong>Müşteri Destek & Tel:</strong> 0850 840 86 95</div>
                <div><strong>Resmi E-Posta:</strong> ihalecib@gmail.com</div>
                <div><strong>KEP Adresi:</strong> hasanhuseyin.yildirim.17@hs01.kep.tr</div>
              </div>
            </div>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              
              <!-- 1. Taraflar ve amaç -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">1. TARAFLAR VE AMAÇ</h3>
                <p><strong>1.1.</strong> Bu sözleşme, İhaleciBurada platformunu işleten <strong>Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</strong> (“İhaleciBurada”) ile platforma işletmesi adına katılan üye arasındaki platform kullanım ilişkisini düzenler. Hesabı kullanan gerçek kişi, temsil ettiği işletmeden ayrı olarak “yetkili kullanıcı”dır. İşletmeci: Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi). Adres: Çanakkale, Türkiye. VKN: 9560161511; Çanakkale Vergi Dairesi. Telefon: 0850 840 86 95. E-posta: ihalecib@gmail.com; KEP: hasanhuseyin.yildirim.17@hs01.kep.tr.</p>
                <p><strong>1.2.</strong> Platform ticari ve mesleki amaçlı işlemler içindir. Üye, işletmesi ve temsil yetkisi hakkında doğru bilgi verir. Bu amaç beyanı, somut işlemin hukuki niteliğini tek başına belirlemez ve uygulanması zorunlu koruyucu hükümleri ortadan kaldırmaz.</p>
                <p><strong>1.3.</strong> Üyelik ve üyelik paketleri, geçmişte geçerli biçimde edinilmiş paket hakları, alıcı ile tedarikçi arasındaki ticaret ve ayrı danışmanlık hizmeti farklı ilişkilerdir. Birine katılmak diğerini kendiliğinden kurmaz. İhaleciBurada'nın platformda gösterdiği üyelik paketleri gerçek birer tekliftir; paketin kapsamı, süresi ve bedeli işlem öncesinde gösterilen güncel bilgilere göre belirlenir ve uygulanabilir ödeme yöntemi ile koşulları da işlem öncesinde bildirilir.</p>
              </section>

              <!-- 2. Sözleşme kapsamı ve ayrı belgeler -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">2. SÖZLEŞME KAPSAMI VE AYRI BELGELER</h3>
                <p><strong>2.1.</strong> Platform; ilgili yetki, kota ve geçerli kullanım hakları kapsamında kurumsal hesap, ihtiyaç ve ihale yayımlama, teklif, karşılaştırma, sonuçlandırma ve işlem takibi işlevleri sağlar. Paket veya hak kaydının bulunması, kapsam dışındaki işlevlerin de açık olduğu anlamına gelmez; her paketin kapsamı, kotaları ve süresi kendi koşullarıyla uygulanır. Her işlemin şartları, işlem öncesinde gösterilen ilgili ihale ve teklif bilgileriyle birlikte değerlendirilir.</p>
                <p><strong>2.2.</strong> Bir işlem için ayrıca uygulanacak katılım veya ücret koşulları, adı ve sürümüyle o işlemden önce sunulur. Bu sözleşmenin kabulü, ileride yayımlanacak bütün belgelerin veya kişisel veri işleme izinlerinin topluca kabulü anlamına gelmez. Ziyaretçilere yönelik site kullanım koşulları da üyelik veya satın alma işleminin yerine geçmez.</p>
                <p><strong>2.3.</strong> İhaleciBurada danışmanlığında başlangıç, bitiş, kapsam ve bedel koordinatörle müzakere edilerek müşteriye özgü hizmet sözleşmesine işlenir; bedel o hizmet sözleşmesinde mutabık kalınan şartlarla havaleyle veya platform üzerinden ödenir. Kayıt ve ihtiyaç bildirimi tek başına sözleşmeyi kurmaz veya hizmeti başlatmaz. Şartların belirlenmesi, sistemce doldurulan aynı sözleşmenin önce İhaleciBurada onaylı, ardından müşteri tarafından da onaylı tam nüshasının yüklenmesi, koordinatör incelemesi ve aktivasyon koşulları ayrı hizmet akışına tabidir. Bu metin imzalı sözleşmeyi değiştirmez, ikinci bir kayıt sözleşmesi veya ek personel onayı yaratmaz ve müşterinin bağlayıcı karar yetkisini devretmez. Bir ödeme belgesi yüklemek tek başına ödeme kanıtı veya otomatik aktivasyon değildir.</p>
              </section>

              <!-- 3. Hesap, temsil ve doğrulama -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">3. HESAP, TEMSİL VE DOĞRULAMA</h3>
                <p><strong>3.1.</strong> Üye; işletme, yetkili kişi ve işlem bilgilerinin doğruluğunu korur, değişiklikleri gecikmeden günceller. İşlemin gerektirdiği doğrulama bilgileri ve belgeleri ilgili adımda açıklanır. Gereksiz kişisel veri veya üçüncü kişilere ait yetkisiz belgeler yüklenmemelidir.</p>
                <p><strong>3.2.</strong> Üye, kullanıcılarına görevlerine uygun yetkiler verir ve ayrılan kişilerin erişimini kaldırır. Yetkili kullanıcı yalnız kendisine tanınan yetki ve temsil sınırında hareket eder. Sırf bir hesaba erişebilmek, bütün kullanıcıları bütün borçlardan kişisel ve müteselsil sorumlu yapmaz; temsil ve sorumluluk somut işlem ve uygulanabilir hukuka göre belirlenir.</p>
                <p><strong>3.3.</strong> Kullanıcılar giriş bilgilerini paylaşmaz, hesap ele geçirilmesi şüphesini derhal bildirir. İhaleciBurada da kendi erişim, yetkilendirme ve güvenlik yükümlülüklerini yerine getirir. Bir hesap kaydı, işlemin yetkili kişi tarafından yapıldığının tartışılamaz kanıtı değildir.</p>
              </section>

              <!-- 4. Paket, ücret ve ödeme -->
              <section class="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">4. PAKET, ÜCRET VE ÖDEME</h3>
                <p><strong>4.1.</strong> İhaleciBurada, platformda gösterdiği üyelik paketlerini gerçek birer hizmet ve kullanım hakkı teklifi olarak sunar; paketin kapsamı, hak ve kotaları, süresi, bedeli ve vergileri işlem öncesinde platformda gösterilen güncel bilgilere göre belirlenir ve bu sözleşmenin sürekli hükümlerine tabidir. Paket edinimi, yenileme ve plan değişikliğinde, işlem sırasında ödeme adımında fiilen sunulan ve kullanılabilir olan ödeme yöntemleri ile bunların işlem öncesinde açıklanan koşulları uygulanır. Kartlı ödeme sunulduğunda bu ödeme, işlem öncesinde açıklanan koşullar altında TCMB ve BDDK lisanslı ödeme hizmeti sağlayıcıları (PayTR / iyzico) altyapısı üzerinden alınır; bu hüküm hiçbir ödeme yönteminin, paketin veya aktivasyonun her zaman kullanılabilir olduğunu göstermez ve ödeme adımında sunulmayan bir yöntemin kullanılabilir olduğu anlamına gelmez. Mevcut ücretsiz erişim, yetki ve kotalar ile geçmişte geçerli biçimde edinilmiş haklar kendi kapsamlarında değerlendirilir; ücretsiz hesap bütün işlevlerin sınırsız olduğu veya hiçbir işlemin yapılamayacağı anlamına gelmez. Üyelik süresi sonunda kendiliğinden yenilenmez; yenileme üyenin talebiyle ve o tarihte geçerli koşullarla yapılır.</p>
                <p><strong>4.2.</strong> Üyelik paketlerinden ayrı olarak danışmanlık hizmeti de sunulmaya devam eder. Müşterinin mutabakatından önce hizmetin kapsamı, başlangıç ve bitişi, bedeli, vergi ve toplam tutarı, havale veya ödeme şartları ve kullanım hakları açıklanır ve ayrı sözleşmeyle ilişkilendirilir. Bu metin kart saklama, otomatik yenileme, otomatik tahsilat veya işlem öncesinde açıklanmamış yeni bir ücret yetkisi vermez; tek başına herhangi bir ödeme aracına başvurma yetkisi oluşturmaz ve herhangi bir ödeme yönteminin kullanılabilirliğini, kesintisizliğini veya bir açılış tarihini taahhüt etmez.</p>
                <p><strong>4.3.</strong> Platformun ihale aracılığı nedeniyle işlem bedeli üzerinden komisyon alması bu sözleşmeyle alıcılar için kararlaştırılmamıştır (%0 Alıcı Komisyonu). Geçmiş üyelik ilişkilerinden doğmuş geçerli bedeller ile ayrı danışmanlık bedeli birbirinden ayrıdır. Bu hüküm danışmanlık sözleşmesindeki bedeli kaldırmaz veya değiştirmez; geçmiş kayıt yeni satış veya yeniden tahsilat izni sayılamaz.</p>
                <p><strong>4.4.</strong> Üyelik veya danışmanlık bedeli ile alıcı ve tedarikçi arasındaki mal veya hizmet bedeli ayrıdır. Paketin sona ermesi, yenilenmemesi ya da paket koşullarındaki bir değişiklik, daha önce kurulan alım-satım ilişkisini, doğmuş borçları, geçmiş sözleşme ve kabul kayıtlarını kendiliğinden ortadan kaldırmaz. Geçerli bağımsız ücretli üyeliğin kalan süresi ve ayrı hizmet sonu 24 saatlik ödeme penceresi kendi koşullarıyla korunur; bu pencere teklif geri çekme süresi veya kart yenileme yetkisi değildir. İade ve sona erme sonuçları uygulanabilir hukuk ile işlem öncesinde geçerli şekilde kararlaştırılmış koşullara göre değerlendirilir.</p>
              </section>

              <!-- 5. İhale bilgileri ve değişiklikler -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">5. İHALE BİLGİLERİ VE DEĞİŞİKLİKLER</h3>
                <p><strong>5.1.</strong> İhaleyi düzenleyen üye; mal veya hizmetin niteliğini, miktarını, teknik şartlarını, teklif kapsamını, teslim ve ödeme koşullarını doğru ve yeterli biçimde açıklar. İhale türüne göre alıcı ve satıcı rolleri değişebilir; özellikle proje fazlası veya stok satışında ilanı yayımlayan kişi alıcı olmayabilir.</p>
                <p><strong>5.2.</strong> Açık veya kapalı teklif, tek veya iki aşama, kısmi teklif, fiyat değişim yönü, asgari eksiltme adımı ve varsa hemen al koşulları ilgili ihalenin kurallarıdır. Bütün ihaleler yalnız fiyat düşürmeye veya aynı katılım yöntemine tabi değildir.</p>
                <p><strong>5.3.</strong> İhale şartlarının değiştirilmesi, uzatılması veya iptali; aşama, mevcut teklifler ve işlem yetkileri dikkate alınarak uygulanır. Bir değişiklik geçmiş teklife sessizce yeni yükümlülük eklemez. Esaslı değişiklik ve iptalin mevcut tekliflere etkisi ilgililere açıklanır; doğmuş sözleşmeler genel iptal yetkisiyle ortadan kaldırılamaz.</p>
              </section>

              <!-- 6. Teklif ve geri çekme -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">6. TEKLİF VE GERİ ÇEKME</h3>
                <p><strong>6.1.</strong> Yetkili kullanıcı, teklif vermeden önce fiyat, vergi, miktar, kapsam, teslim, ödeme ve geçerlilik koşullarını kontrol eder. Usulüne uygun iletilen teklif, ilgili şartlarıyla bağlayıcı öneri niteliğinde olabilir; teklif verilmesi her durumda kazanan olunduğu veya sözleşmenin kurulduğu anlamına gelmez.</p>
                <p><strong>6.2.</strong> Platformdaki olağan teklif geri çekme penceresi, teklifin verilmesinden itibaren yirmi dört saat ile ihalenin kapanışından önceki sürelerden kısa olanıdır. İhale daha önce sonuçlanır veya teklif artık geri çekilebilir durumda değilse bu pencere kullanılamaz. Kanundan doğan hata, yetkisizlik veya diğer itiraz hakları bu işlem penceresiyle kaldırılmaz.</p>
                <p><strong>6.3.</strong> Teklif güncelleme ve kısmi teklif, ilgili ihalenin izin verdiği sınırlar içinde yapılır. Bilgi isteme, taslak hazırlama veya platform dışında yürütülen görüşme, tek başına sistemde verilmiş teklif sayılmaz. Yanıltıcı fiyat, sahte belge ve anlaşmalı tekliflerle rekabetin bozulması yasaktır.</p>
              </section>

              <!-- 7. Sonuçlandırma ve taraflar arası sözleşme -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">7. SONUÇLANDIRMA VE TARAFLAR ARASI SÖZLEŞME</h3>
                <p><strong>7.1.</strong> Olağan kazanan belirleme akışında taslak seçim ile bağlayıcı sonuçlandırma ayrıdır. Yetkili taraf, son işlemden önce seçilen teklifleri ve ticari koşulları kontrol eder. Geçerli teklifin yetkili kabulüyle oluşan taraflar arası sözleşme için, olağan akışta kazanan teklif verenden ikinci bir platform kabulü aranmaz.</p>
                <p><strong>7.2.</strong> Hemen al gibi önceden açıklanan özel işlem türlerinde sonuçlandırma, o işlem için açıkça gösterilmiş koşullara göre gerçekleşebilir. Alıcı ve satıcının kimliği ile işlemin bağlayıcı sonucu işlem öncesinde anlaşılır olmalıdır.</p>
                <p><strong>7.3.</strong> Sistem kaydı ve sözleşme numarası işlemin izlenmesini sağlar. Taslak, başarısız istek veya tek başına bir veri tabanı satırı, eksik irade beyanını ya da yetkiyi tamamlamaz. Hata, geçersizlik, fesih ve kanuni başvuru hakları saklıdır; sonuçlandırma “hiçbir koşulda geri alınamaz” bir feragat değildir.</p>
                <p><strong>7.4.</strong> İhaleciBurada, yalnız platform işletmecisi (6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun m. 9 uyarınca Aracı Hizmet Sağlayıcı) sıfatıyla alıcı ve tedarikçi arasındaki sözleşmenin mal veya hizmet sağlayıcısı, kefili ya da ödeme garantörü olmaz. Kendi adına ayrıca üstlendiği bir yükümlülük veya kanuni sorumluluk varsa bu hüküm onu ortadan kaldırmaz.</p>
              </section>

              <!-- 8. İfa, ödeme, teslim ve ayıp -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">8. İFA, ÖDEME, TESLİM VE AYIP</h3>
                <p><strong>8.1.</strong> Alıcı ve tedarikçi, kararlaştırılmış teknik şartlara, teslim programına, ödeme yöntemine ve hukuka uygun faturalandırma yükümlülüklerine uyar. Ticaret bedeli taraflar arasında doğrudan ödenir; bu metin İhaleciBurada adına emanet para, tahsilat garantisi veya ödeme kuruluşu hizmeti kurmaz.</p>
                <p><strong>8.2.</strong> Sevkiyat ve teslim kayıtları ile teslim kodu, ilgili olayın kaydı için kullanılır. Kod girilmesi tek başına mülkiyet veya hasar riskinin her durumda devredildiği, malın kusursuz olduğu yahut inceleme ve ayıp haklarından vazgeçildiği anlamına gelmez. Bu sonuçlar tarafların geçerli anlaşmasına ve uygulanabilir hukuka göre belirlenir.</p>
                <p><strong>8.3.</strong> Ayıp, eksik teslim veya gecikme, hak kaybını önlemek için uygulanabilir kanuni ve sözleşmesel sürelerde ve gerekli yöntemle karşı tarafa bildirilmelidir. Platforma bildirim yapılması, hukuken gereken muhataba ve usulle bildirim yükümlülüğünün kendiliğinden yerine geçtiği anlamına gelmez.</p>
                <p><strong>8.4.</strong> Garanti, gecikme cezası, zarar ve fesih koşulları ilgili işlemde geçerli biçimde kararlaştırılan hükümler ve uygulanabilir hukukla belirlenir. Bu genel metin bütün mal ve hizmetler için tek tip garanti süresi veya yeni bir varsayılan ceza oranı oluşturmaz.</p>
              </section>

              <!-- 9. Platform hizmeti ve sorumluluk -->
              <section class="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">9. PLATFORM HİZMETİ VE SORUMLULUK</h3>
                <p><strong>9.1.</strong> İhaleciBurada platformun işletilmesi, kendi işlem ve bildirimleri ile mevzuattan doğan yükümlülüklerinden sorumludur. Üyelerin sunduğu her içeriğin doğruluğunu veya her ticaretin başarıyla tamamlanacağını garanti etmez. Hukuken gerekli inceleme ve müdahale yükümlülükleri saklıdır.</p>
                <p><strong>9.2.</strong> Bakım, arıza veya dış hizmet kesintisinin bir işleme etkisi olayın koşullarıyla değerlendirilir. Kesinti, mevcut teklifin veya sözleşmenin kendiliğinden iptali ya da sürelerin her durumda otomatik uzaması değildir. İşlem durumu belirsizse mükerrer bağlayıcı işlem yapılmadan önce kayıt kontrol edilmelidir.</p>
                <p><strong>9.3.</strong> Hiçbir hüküm, kast veya ağır kusurdan doğan yahut önceden kaldırılamayan sorumluluğu dışlamaz. Tarafların kusuru, zarar ve illiyet bağı somut olay ve uygulanabilir hukuk çerçevesinde değerlendirilir.</p>
              </section>

              <!-- 10. Kötüye kullanım ve erişim tedbirleri -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">10. KÖTÜYE KULLANIM VE ERİŞİM TEDBİRLERİ</h3>
                <p><strong>10.1.</strong> Yetkisiz erişim, zararlı yazılım, hukuka aykırı içerik, sahte kimlik veya belge, teklif danışıklılığı ve başka üyelerin gizli bilgilerinin izinsiz alınması yasaktır. Güvenlik, hukuki yükümlülük veya ciddi ihlal halinde işlem ya da erişim için gerekli ve ölçülü tedbir alınabilir.</p>
                <p><strong>10.2.</strong> Tedbirin gerekçesi ve etkisi, açıklanmasının hukuken yasak olduğu veya somut güvenliği tehlikeye düşürdüğü haller dışında ilgili üyeye bildirilir. Üye, sözleşme öncesinde açıklanan destek ve başvuru kanallarından inceleme isteyebilir. Uygulanabilir mevzuattaki bildirim, savunma ve itiraz güvenceleri korunur.</p>
                <p><strong>10.3.</strong> Her ihlal otomatik sürekli kapatma, bütün ücretlerin kaybı veya belirli tutarda ceza doğurmaz. Mevcut ticaret ve belgeye erişim ihtiyacı, güvenlik ve yasal saklama yükümlülükleriyle birlikte değerlendirilir.</p>
              </section>

              <!-- 11. Değerlendirmeler ve ticari iletişim -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">11. DEĞERLENDİRMELER VE TİCARİ İLETİŞİM</h3>
                <p><strong>11.1.</strong> Değerlendirme yalnız ilgili akışta değerlendirme hakkı bulunan gerçek işlem tarafınca, dürüst ve işlemle ilgili olarak yapılır. Yorumlar ticari başarı veya kalite garantisi değildir. Sahte değerlendirme, tehdit, kişisel veri ifşası ve değerlendirme karşılığında menfaatle sonucu yanıltma yasaktır.</p>
                <p><strong>11.2.</strong> İhaleciBurada, hukuka aykırı veya kuralları ihlal eden içeriğe ilişkin gerekçeli inceleme yapabilir. Bu hüküm her değerlendirmeyi önceden doğruladığı veya açıklanmayan bir puanın nesnel ticari yeterlilik ölçüsü olduğu iddiasını içermez.</p>
                <p><strong>11.3.</strong> Üyeler arasındaki meşru doğrudan görüşme ve doğrudan ödeme yasak değildir. Aldatma, kararlaştırılmış bir yükümlülüğü kötü niyetle dolanma ve ticari sır ihlali ayrıca değerlendirilir. Bu metin, sırf platform dışında iletişim kurulduğu için otomatik sözleşme cezası doğurmaz.</p>
              </section>

              <!-- 12. Gizlilik ve fikri haklar -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">12. GİZLİLİK VE FİKRİ HAKLAR</h3>
                <p><strong>12.1.</strong> Kamuya açık olmayan fiyat, teklif, teknik dosya ve iş bilgileri, işlem amacı dışında yetkisiz kullanılamaz veya açıklanamaz. Hukuki danışmanlık, kanuni yükümlülük ve yetkili mercilere hak arama amacıyla gerekli açıklamalar bu yasağın dışındadır; açıklama gerekli kapsamla sınırlanır.</p>
                <p><strong>12.2.</strong> Üye, yüklediği içeriği kullanmaya ve işlem kapsamında paylaşmaya yetkili olmalıdır. Platforma yükleme, üyenin içeriğinin mülkiyetini İhaleciBurada’ya devretmez. İşlem için gerekli kullanım, içeriği başka amaçlarla sınırsız yayımlama izni değildir.</p>
                <p><strong>12.3.</strong> Platform yazılımı, markası ve tasarımındaki haklar hak sahiplerine aittir. Yetkisiz kopyalama, teknik güvenliğin aşılması ve hukuka aykırı toplu veri çekimi yasaktır; kanundan doğan istisnalar saklıdır.</p>
              </section>

              <!-- 13. Kişisel veriler ve isteğe bağlı izinler -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">13. KİŞİSEL VERİLER VE İSTEĞE BAĞLI İZİNLER</h3>
                <p><strong>13.1.</strong> Kişisel veri işleme faaliyetleri, ilgili işlem için sunulan aydınlatma metinlerinde amaç, hukuki sebep, veri kapsamı, alıcılar ve haklarla açıklanır. Bu sözleşme aydınlatmanın veya açık rızanın yerine geçmez; üyelik kabulü bütün veri işlemlerine rıza olarak kullanılamaz.</p>
                <p><strong>13.2.</strong> Açık rıza gereken isteğe bağlı faaliyet ve ticari ileti izinleri ayrı sunulur. İzin vermemek veya izni geri çekmek, o izne bağlı olmayan temel hizmetlerin hukuki dayanağını ortadan kaldırmaz. Zorunlu hizmet bildirimleri ile pazarlama mesajları birbirinden ayrıdır.</p>
                <p><strong>13.3.</strong> Kayıtlar amaçları ve uygulanabilir saklama yükümlülükleriyle sınırlı tutulur. Bu genel sözleşme bütün veriler için sınırsız veya tek tip süreli saklama yetkisi vermez. Başvuru ve iletişim yolları ilgili güncel aydınlatmada gösterilir.</p>
              </section>

              <!-- 14. Süre, sona erme ve bildirim -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">14. SÜRE, SONA ERME VE BİLDİRİM</h3>
                <p><strong>14.1.</strong> Platform kullanım ilişkisi, geçerli şekilde kurulmasından sona ermesine kadar sürer; satın alınmış hizmetin dönemi kendi ticari koşullarında belirlenir. Hesabın kapatılması doğmuş borçları, devam eden taraflar arası ticareti veya gerekli delilleri ortadan kaldırmaz.</p>
                <p><strong>14.2.</strong> Haklı nedenle sona erme ve uygulanabilir mevzuattaki bildirim ve giderim hakları saklıdır. Mücbir sebep, ancak etkilediği yükümlülük ve süre bakımından değerlendirilir; bildirim ve zararı azaltma yükümlülüklerini kendiliğinden kaldırmaz.</p>
                <p><strong>14.3.</strong> Platform içi bildirim, e-posta veya destek kaydı ile kanunen özel usule tabi ihtar ve tebligatlar farklıdır. Taraflar, ilgili hukuki işlem için gereken yöntem ve adresi kullanır. Bu metin müşterinin KEP adresi vermesini genel üyelik şartı haline getirmez; kanuni özel yükümlülükler saklıdır.</p>
              </section>

              <!-- 15. Değişiklik, delil ve uyuşmazlık -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">15. DEĞİŞİKLİK, DELİL VE UYUŞMAZLIK</h3>
                <p><strong>15.1.</strong> Yeni sözleşme sürümü önceki kabul veya imzalı belgeleri geriye dönük değiştirmez. Esaslı değişikliklerin bildirimi, yürürlük zamanı ve gerekli kabulü uygulanabilir hukuk ve ilgili hizmet ilişkisine göre sağlanır. Salt siteyi ziyaret, her yeni yükümlülüğün kabulü sayılmaz.</p>
                <p><strong>15.2.</strong> Elektronik kayıtlar, teklif ve onaylar hukuken değerlendirilebilen delillerdir. Tarafların aksi delil sunma ve kayıtların doğruluğuna itiraz hakları korunur; İhaleciBurada kayıtları tek başına kesin ve itiraz edilemez delil ilan edilmez.</p>
                <p><strong>15.3.</strong> Türk hukuku uygulanır; zorunlu kanunlar ihtilafı ve görev kuralları saklıdır. Yetkili mahkeme ve diğer başvuru mercileri uygulanabilir usul hükümleriyle belirlenir. Uyuşmazlıkların çözümünde Çanakkale Mahkemeleri ve İcra Daireleri yetkilidir. Bu sözleşme bütün kullanıcılar için münhasır mahkeme anlaşması veya zorunlu başvurulardan feragat içermez.</p>
                <p><strong>15.4.</strong> Türkçe ve İngilizce metinler aynı madde yapısıyla sunulur. Çeviri farklılığı kullanıcının görmediği ek bir borç doğurmaz; uyuşmazlıkta somut kabul edilen metin ve uygulanabilir yorum kuralları değerlendirilir.</p>
                <p><strong>15.5.</strong> Bir hükmün geçersizliği, diğer hükümlerin geçerliliğini kendiliğinden ortadan kaldırmaz; geçersiz hüküm olmadan sözleşmenin kurulmayacağının açıkça anlaşılmasına ilişkin kanuni istisna saklıdır. Genel işlem koşullarının yazılmamış sayılmasına ilişkin özel kanuni sonuçlar ayrıca uygulanır; bu hüküm bunları bertaraf etmez veya geçersiz hüküm yerine kullanıcıya yeni bir borç yüklemez.</p>
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
                  <p><strong>Ticaret Unvanı:</strong> Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</p>
                  <p><strong>Merkez Adresi:</strong> İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</p>
                  <p><strong>Vergi Dairesi & No:</strong> Çanakkale Vergi Dairesi / VKN: 9560161511</p>
                  <p><strong>Telefon / Müşteri Destek:</strong> 0850 840 86 95 | <strong>E-Posta:</strong> ihalecib@gmail.com</p>
                  <p><strong>KEP Adresi:</strong> hasanhuseyin.yildirim.17@hs01.kep.tr | <strong>Web Sitesi:</strong> https://ihaleciburada.com</p>
                </div>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — HİZMETİN TEMEL NİTELİKLERİ VE FİYATLANDIRMA</h3>
                <p>2.1. <strong>Hizmet Türü ve Aracı Kurum Statüsü:</strong> Şirketimiz 6563 Sayılı Elektronik Ticaret Kanunu uyarınca Aracı Hizmet Sağlayıcı olup bulut tabanlı B2B e-ihale açma, teklif toplama, canlı tersine eksiltme (reverse auction), tedarikçi KYC doğrulama ve güvenli Escrow havuz entegrasyonu hizmeti sunmaktadır.</p>
                <p>2.1.1. <strong>Alıcılar İçin %0 Komisyon, Kazanan Tedarikçiler İçin Sabit %4 Escrow Bedeli:</strong> Platformumuzda alıcılar için ihale açma ve satın alma süreçleri %0 komisyondur (ücretsizdir). İhaleyi kazanan satıcı/tedarikçilerden ise, sektör ayrımı yapılmaksızın tüm kategorilerde yalnızca mal veya hizmet teslimatı alıcı tarafından onaylanıp hakediş serbest bırakıldığında sabit net %4 (+ KDV) Escrow Güvenli Havuz ve teknolojik altyapı bedeli tahsil edilir. İptal edilen, tamamlanmayan veya kazanılamayan ihalelerden hiçbir ücret veya komisyon kesilmez.</p>
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

