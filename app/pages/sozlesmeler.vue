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

useSeoMeta({
  title: 'Yasal Sözleşmeler, KVKK & Escrow Güvenlik Şartları | İhaleciBurada',
  description: 'İhaleciBurada kullanıcı sözleşmesi, platform aracılık sözleşmesi, KVKK aydınlatma metni, Paynkolay Escrow havuz kuralları ve gizlilik politikası.'
})

const route = useRoute()
const router = useRouter()

export type TabKey = 
  | 'kullanim' 
  | 'aracilik'
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
  if (t === 'aracilik' || t === 'platform-aracilik' || t === 'aracilik-sozlesmesi') return 'aracilik'
  if (t === 'gizlilik' || t === 'kvkk' || t === 'riza' || t === 'bilgi-guvenligi') return 'gizlilik'
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

      <!-- PAYNKOLAY RESMİ SATICI KÜNYESİ (MERCHANT IDENTITY & REGISTRATION BANNER) -->
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
              Platformumuz 6563 Sayılı Elektronik Ticaret Kanunu, 6102 Sayılı Türk Ticaret Kanunu ve 6493 Sayılı Ödeme Hizmetleri mevzuatına tam uyumlu olarak TCMB & BDDK lisanslı ödeme altyapısı (Paynkolay - Aktif Bank) üzerinden faaliyet göstermektedir.
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
          
          <!-- Legal Contracts Group (6 Essential Tabs) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5 shadow-xs">
            <div class="text-[10px] font-black text-blue-900 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
              <Scale :size="13" class="text-blue-600" />
              <span>RESMİ SÖZLEŞMELER (6 TEMEL BELGE)</span>
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
              @click="setTab('aracilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'aracilik' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Scale :size="15" />
              <span>2. Platform Aracılık Sözleşmesi</span>
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'gizlilik' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Shield :size="15" />
              <span>3. Gizlilik Politikası & KVKK Aydınlatma</span>
            </button>

            <button 
              @click="setTab('mesafeli-satis')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'mesafeli-satis' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <ShieldCheck :size="15" />
              <span>4. Mesafeli Satış & Abonelik Sözleşmesi</span>
            </button>

            <button 
              @click="setTab('ihale-kurallari')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'ihale-kurallari' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <Gavel :size="15" />
              <span>5. B2B İhale ve Satın Alma Kuralları</span>
            </button>

            <button 
              @click="setTab('cerezler')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'cerezler' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'"
            >
              <CookieIcon :size="15" />
              <span>6. Çerez (Cookie) Politikası</span>
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
                <p><strong>4.1.</strong> İhaleciBurada, platformda gösterdiği üyelik paketlerini gerçek birer hizmet ve kullanım hakkı teklifi olarak sunar; paketin kapsamı, hak ve kotaları, süresi, bedeli ve vergileri işlem öncesinde platformda gösterilen güncel bilgilere göre belirlenir ve bu sözleşmenin sürekli hükümlerine tabidir. Paket edinimi, yenileme ve plan değişikliğinde, işlem sırasında ödeme adımında fiilen sunulan ve kullanılabilir olan ödeme yöntemleri ile bunların işlem öncesinde açıklanan koşulları uygulanır. Kartlı ödeme sunulduğunda bu ödeme, işlem öncesinde açıklanan koşullar altında TCMB ve BDDK lisanslı ödeme hizmeti sağlayıcıları (Paynkolay / Aktif Bank) altyapısı üzerinden alınır; bu hüküm hiçbir ödeme yönteminin, paketin veya aktivasyonun her zaman kullanılabilir olduğunu göstermez ve ödeme adımında sunulmayan bir yöntemin kullanılabilir olduğu anlamına gelmez. Mevcut ücretsiz erişim, yetki ve kotalar ile geçmişte geçerli biçimde edinilmiş haklar kendi kapsamlarında değerlendirilir; ücretsiz hesap bütün işlevlerin sınırsız olduğu veya hiçbir işlemin yapılamayacağı anlamına gelmez. Üyelik süresi sonunda kendiliğinden yenilenmez; yenileme üyenin talebiyle ve o tarihte geçerli koşullarla yapılır.</p>
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

          <!-- 2. PLATFORM ARACILIK SÖZLEŞMESİ -->
          <article v-if="activeTab === 'aracilik'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-900 font-mono text-xs font-bold rounded-lg border border-blue-200">6563 SK ARACI HİZMET SAĞLAYICI</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">B2B TİCARİ VE MESLEKİ İŞLEMLER</span>
              <span class="text-xs text-slate-400 font-mono">Belge Sürümü: TR-2026-09-10-02-R1</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ 'İhaleciBurada Platform Aracılık Sözleşmesi' }}
            </h1>
            
            <!-- İşletmeci ve Yasal Tanıtım Kutusu -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p class="font-semibold text-slate-900">
                {{ 'Bu sözleşme, İhaleciBurada platformunu işleten Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi) ile kendi işletmesi adına platform aracılık hizmetinden yararlanan üye arasındadır. Hesabı kullanan yetkili kullanıcının temsil yetkisi, işletmenin hak ve borçlarından ayrı değerlendirilir; salt hesap erişimi kişisel ve müteselsil sorumluluk yaratmaz.' }}
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
              
              <!-- 1. Taraflar ve sözleşme ilişkisi -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">1. TARAFLAR VE SÖZLEŞME İLİŞKİSİ</h3>
                <p><strong>1.1.</strong> Bu sözleşme, İhaleciBurada platformunu işleten <strong>Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</strong> (İşletmeci) ile kendi işletmesi adına platform aracılık hizmetinden yararlanan üye arasındadır. Hesabı kullanan yetkili kullanıcının temsil yetkisi, işletmenin hak ve borçlarından ayrı değerlendirilir; salt hesap erişimi kişisel ve müteselsil sorumluluk yaratmaz. İhaleciBurada platformun adıdır; tek başına ayrı bir sözleşme tarafını tanımlamaz. İşletmeci: Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi). Adres: Çanakkale, Türkiye. VKN: 9560161511; Çanakkale Vergi Dairesi. Telefon: 0850 840 86 95. E-posta: ihalecib@gmail.com; KEP: hasanhuseyin.yildirim.17@hs01.kep.tr.</p>
                <p><strong>1.2.</strong> Platform işletmelerin ticari ve mesleki işlemlerine yöneliktir. Bu amaç, somut işlemin niteliğini, tarafların kanuni statüsünü veya uygulanması zorunlu koruyucu hükümleri tek başına belirlemez. Bu sözleşme bir faaliyet izni, sicil kaydı, güven damgası veya kanuni istisnadan yararlanıldığı beyanı değildir.</p>
                <p><strong>1.3.</strong> Kullanıcı Sözleşmesi hesap ve genel kullanım ilişkisini; bu metin aracılık hizmetini düzenler. Birlikte uygulanacak belgeler adları ve sürümleriyle kabul öncesinde sunulur. Metinler çatışırsa sırf belgenin adı veya bağlantı adresi ek borç ya da üstünlük yaratmaz; geçerli biçimde kararlaştırılan koşullar ve uygulanabilir yorum kuralları esas alınır.</p>
              </section>

              <!-- 2. Aracılık kapsamı ve ayrı danışmanlık -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">2. ARACILIK KAPSAMI VE AYRI DANIŞMANLIK</h3>
                <p><strong>2.1.</strong> Aracılık hizmeti, ilgili yetki, kota ve geçerli kullanım hakları kapsamında ihtiyaç ve ihale yayımlama, teklif iletme, karşılaştırma, sonuçlandırma ve işlem kayıtlarının takibi için elektronik altyapı sunar. Kullanılabilen işlevler ve sınırlamalar hizmet alınmadan önce açıklanır; her üyenin bütün işlevleri sınırsız kullanacağı taahhüt edilmez. Paket veya ücretli hak kaydı, kapsam dışındaki işlevlerin de açık olduğu anlamına gelmez; her paketin kapsamı, kotaları ve süresi kendi koşullarıyla uygulanır. Bu hüküm üyeler arasında bir sohbet işlevi sunulduğu anlamına gelmez.</p>
                <p><strong>2.2.</strong> İhale türüne göre ilanı yayımlayan, teklif veren, alıcı ve satıcı rolleri değişebilir. Proje fazlası veya stok satışları dahil işlemlerin tamamının yalnız aşağı yönlü fiyat rekabetiyle veya tek bir ihale yöntemiyle yürütüldüğü söylenemez. Somut teklif ve işlem koşulları ilgili ihale ekranında ayrıca gösterilir.</p>
                <p><strong>2.3.</strong> İhaleciBurada danışmanlığı ayrı sözleşmeye tabidir; başlangıç, bitiş, kapsam ve bedel koordinatörle müzakere edilir, sözleşmeye işlenir ve bedel mutabık havale veya ödeme şartlarıyla ödenir. Kayıt ve ihtiyaç bildirimi tek başına hizmeti başlatmaz. Şartların belirlenmesi, sistemce doldurulan aynı sözleşmenin önce İhaleciBurada onaylı, ardından müşteri tarafından da onaylı tam nüshasının yüklenmesi, koordinatör incelemesi ve aktivasyon koşulları korunur. Bu aracılık metni imzalı sözleşmeyi değiştirmez, ikinci kayıt sözleşmesi veya ek personel onayı getirmez ve müşterinin bağlayıcı karar yetkisini devretmez. Bir ödeme belgesinin yüklenmesi tek başına ödeme kanıtı veya otomatik aktivasyon değildir.</p>
              </section>

              <!-- 3. Tarafların işlemleri ve platformun konumu -->
              <section class="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">3. TARAFLARIN İŞLEMLERİ VE PLATFORMUN KONUMU</h3>
                <p><strong>3.1.</strong> Üye, kendi yetkisi kapsamında doğru ve hukuka uygun ilan, teklif ve işlem bilgisi sunar; karşı tarafın koşullarını kabul etmeden önce inceler. Platformun elektronik altyapısı eksik temsil yetkisini veya irade beyanını tamamlamaz. Taslak kayıt, başarısız işlem veya sözleşme numarası tek başına geçerli sözleşme kurulduğunu kanıtlamaz.</p>
                <p><strong>3.2.</strong> Olağan kazanan belirlemede taslak seçim ile bağlayıcı sonuçlandırma ayrıdır; geçerli teklifin yetkili kabulünden sonra olağan akışta kazanan teklif verenin ikinci bir platform kabulü aranmaz. Hemen al gibi önceden açıklanmış özel işlemler kendi koşullarıyla değerlendirilir. Kanuni hata, geçersizlik ve başvuru hakları saklıdır.</p>
                <p><strong>3.3.</strong> Yalnız platformu işletmek İşletmeciyi üyeler arasındaki mal veya hizmet sözleşmesinin satıcısı, alıcısı, kefili veya ödeme garantörü yapmaz (6563 Sayılı Kanun Madde 9). Kendi adına ayrıca üstlendiği ve kanundan doğan yükümlülükleri korunur. Üyeler arasındaki uyuşmazlıkta destek iletişimi, bağlayıcı yargı kararı veya tarafların haklarından feragati sayılmaz.</p>
              </section>

              <!-- 4. Ücretler ve doğrudan ödeme -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">4. ÜCRETLER VE DOĞRUDAN ÖDEME</h3>
                <p><strong>4.1.</strong> İhaleciBurada, platformda gösterdiği üyelik paketlerini gerçek birer hizmet ve kullanım hakkı teklifi olarak sunar; paketin kapsamı, hak ve kotaları, süresi, bedeli ve vergileri işlem öncesinde platformda gösterilen güncel bilgilere göre belirlenir. Paket edinimi ve plan değişikliğinde, işlem sırasında ödeme adımında fiilen sunulan ve kullanılabilir olan ödeme yöntemleri ile bunların işlem öncesinde açıklanan koşulları uygulanır; kartlı ödeme sunulduğunda bu ödeme, işlem öncesinde açıklanan koşullar altında BDDK ve TCMB lisanslı ödeme hizmeti sağlayıcıları (Paynkolay / Aktif Bank) altyapısı üzerinden alınır. Üyelik paketlerinden ayrı olarak danışmanlık hizmeti de sunulur; müşterinin mutabakatından önce bu hizmetin türü, kapsamı, başlangıç ve bitişi, tutarı veya hesaplanma yöntemi, vergi ve toplam bedeli ile havale veya ödeme şartları açıklanır. Bu sözleşme kart saklama, otomatik yenileme veya otomatik tahsilat yetkisi vermez; herhangi bir ödeme yönteminin kullanılabilirliğini, kesintisizliğini veya bir açılış tarihini taahhüt etmez.</p>
                <p><strong>4.2.</strong> Bu sözleşmeyle alıcılar için ihale bedeli üzerinden komisyon, ihale başına komisyon veya başarı komisyonu kararlaştırılmamıştır (%0 Alıcı Komisyonu). Geçmiş üyelik ilişkilerinden doğmuş geçerli bedeller ve ayrıca geçerli biçimde kararlaştırılan danışmanlık bedeli farklıdır. Ayrı danışmanlık sözleşmesindeki bedel kaldırılmaz veya değiştirilmez. Paket koşullarındaki bir değişiklik geçmişte edinilmiş hakları veya bağımsız ücretli üyeliğin kalan süresini kendiliğinden kaldırmaz.</p>
                <p><strong>4.3.</strong> Mal veya hizmetin ticaret bedeli alıcı ile satıcı arasında doğrudan ödenir. Bu metin İşletmeci nezdinde emanet hesap, tahsilat garantisi veya ödeme kuruluşu hizmeti kurmaz; İşletmecinin ayrı danışmanlık alacağını ortadan kaldırmaz. Ücret değişikliği mevcut dönem veya başlamış işlem için geriye dönük yeni borç doğurmaz. Gelecekte yeni bir ücret veya satış modeli uygulanması bu metinle kararlaştırılmış değildir; böyle bir değişiklik ayrıca yetkili karar, önceden açıklanan geçerli koşullar ve kanuni güvenceler gerektirir.</p>
              </section>

              <!-- 5. Görünürlük, sıralama ve işlem adaleti -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">5. GÖRÜNÜRLÜK, SIRALAMA VE İŞLEM ADALETİ</h3>
                <p><strong>5.1.</strong> İhale sonuçlandırması, firma dizini görünürlüğü, arama sırası ve üye değerlendirmeleri farklı işlevlerdir. Bir listede yer almak veya üst sırada görünmek, ihaleyi kazanma, ifa kapasitesi veya kalite garantisi değildir. İlgili işlem için gösterilen yetki ve teklif kuralları korunur.</p>
                <p><strong>5.2.</strong> Bir sıralama veya tavsiye işlevi sunuluyorsa kullanılan temel parametreler, bunların önceliği ve varsa geçmişte geçerli biçimde edinilmiş görünürlük hakkının etkisi ilgili hizmet açıklamasında belirtilir. Kayıtlarda ücretli görünürlük alanı bulunması bugün satın alınabilir yeni bir seçenek sunulduğu anlamına gelmez. Bu açıklama, kaynak kodunun veya diğer üyelerin gizli bilgilerinin yayımlanması anlamına gelmez. Açıklanmamış bir puanın nesnel ticari yeterlilik ölçüsü olduğu kabul edilmez.</p>
                <p><strong>5.3.</strong> Sahte teklif, danışıklılık, yanıltıcı değerlendirme ve diğer üyelerin gizli bilgilerinin izinsiz kullanımı yasaktır. Kanuni hak arama veya yetkili mercilere başvuru tek başına cezalandırıcı sıralama düşürme ya da hizmet kısıtlama sebebi yapılamaz. Üyelerin meşru doğrudan iletişimi ve doğrudan ödemesi sırf platform dışında gerçekleştiği için otomatik ceza doğurmaz.</p>
              </section>

              <!-- 6. Destek, bildirim ve hak ihlali başvuruları -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">6. DESTEK, BİLDİRİM VE HAK İHLALİ BAŞVURULARI</h3>
                <p><strong>6.1.</strong> Hesabına erişebilen üye, platform hizmetine ilişkin destek talebini hesap içindeki Destek & İletişim alanından iletebilir. Talebin konusu, ilgili işlem veya içerik ve sorunun açıklaması gerekli kapsamla sınırlı sunulur. Başvurunun kayda alınması, talebin haklı bulunduğu veya uyuşmazlığın çözüldüğü anlamına gelmez.</p>
                <p><strong>6.2.</strong> Hesabınıza erişemediğinizde veya içerikle ilgili fikri ya da sınai hak ihlali bildirmek istediğinizde <strong>ihalecib@gmail.com</strong> adresine yazabilirsiniz. Bildirimde başvuranın kimliği ve iletişim yolu, hak veya yetki dayanağı, ilgili içeriğin bağlantısı/işlem numarası, itirazın açıklaması ve gerekli dayanak belgeler bulunmalıdır. Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)’ne yapılacak yazılı bildirimler için 1.1’deki adres, KEP için <strong>hasanhuseyin.yildirim.17@hs01.kep.tr</strong> kullanılabilir. İlgili başvuruya kanunen özgü yöntem ve içerik şartları saklıdır. Başvuru tek başına ihlalin kesin kanıtı sayılmaz; ilgili tarafların açıklama ve itiraz hakları korunur.</p>
                <p><strong>6.3.</strong> Destek başvurusu kanunen gereken muhataba ve yöntemle yapılacak ihtar, ayıp bildirimi, dava veya diğer başvuruların yerine kendiliğinden geçmez. Kanuni süreler saklıdır. Bu metin bütün başvurular için tek tip cevap veya çözüm süresi taahhüt etmez; uygulanacak özel süre ve güvenceler ilgili başvuru türü için ayrıca açıklanır.</p>
              </section>

              <!-- 7. Hizmet kısıtlamaları ve inceleme -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">7. HİZMET KISITLAMALARI VE İNCELEME</h3>
                <p><strong>7.1.</strong> Hukuka aykırı içerik, sahte kimlik veya belge, yetkisiz erişim, kötü amaçlı teknik faaliyet, teklif danışıklılığı ya da ciddi sözleşme ihlali halinde gerekli ve ölçülü işlem veya erişim tedbirleri uygulanabilir. Her ihlal otomatik sürekli kapatma, bütün ücretlerin kaybı veya önceden kararlaştırılmamış ceza doğurmaz.</p>
                <p><strong>7.2.</strong> Tedbirin gerekçesi, kapsamı ve başvuru imkânı ilgili üyeye açıklanır; açıklamanın kanunen yasak olduğu veya somut güvenliği tehlikeye düşürdüğü durumlar ayrıca değerlendirilir. Uygulanması gereken ön bildirim, açıklama isteme, süre ve itiraz güvenceleri ortadan kaldırılamaz. Acil tedbir, her durumda kalıcı kapatma anlamına gelmez.</p>
                <p><strong>7.3.</strong> Tedbirler mevcut sözleşmeleri, gerekli belgeye erişimi ve tarafların hak arama imkânlarını dikkate alır. Teknik bakım veya güvenlik kesintisi her teklifi kendiliğinden iptal etmez ya da her süreyi otomatik uzatmaz. Mevcut bir işlemin sonucu belirsizse mükerrer bağlayıcı işlemden önce kayıtların kontrol edilmesi önerilir.</p>
              </section>

              <!-- 8. İçerik ve fikri haklar -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">8. İÇERİK VE FİKRİ HAKLAR</h3>
                <p><strong>8.1.</strong> Üye, yüklediği ilan, teklif, görsel ve teknik belgenin kullanım ve paylaşımına yetkili olmalıdır. Üye, İşletmeciye yalnız kararlaştırılan hizmet için gerekli saklama, gösterim ve iletim bakımından sınırlı ve münhasır olmayan kullanım izni verir. İzin, içeriğin ilgili işlemde belirlenen gizlilik ve erişim koşullarına tabidir; yayımlanmak üzere sunulan ilan veya dizin içeriğinin belirlenmiş hedef kitleye gösterimini kapsar, gizli teklif ve belgeleri herkese açma yetkisi vermez. İçerik mülkiyeti devredilmez. İşlem amacı dışında tanıtım, yeniden yayımlama veya alt lisans için sınırsız bir yetki verilmez.</p>
                <p><strong>8.2.</strong> Platform yazılımı, marka, tasarım ve diğer korunan unsurlardaki haklar ilgili hak sahiplerine aittir. Yetkisiz kopyalama, teknik güvenliğin aşılması ve hukuka aykırı toplu veri çekimi yasaktır; kanuni kullanım ve inceleme istisnaları saklıdır. Üyeye ait içerik platformun bütün içeriklerinin işletmeciye ait olduğu iddiasıyla sahiplenilmez.</p>
                <p><strong>8.3.</strong> İstatistiksel kullanım, işlemin amacı, gizlilik ve kişisel veri kurallarıyla sınırlıdır. Kimliksiz olduğu ileri sürülen veri gerçekten kişi veya işletmeyle ilişkilendirilebiliyorsa yalnız bu adlandırma onu sınırsız kullanıma açmaz. Bu hüküm yeni bir pazarlama izni veya başka işletmelerle rekabette sınırsız veri kullanımı yetkisi değildir.</p>
              </section>

              <!-- 9. Ticari gizlilik ve kişisel veriler -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">9. TİCARİ GİZLİLİK VE KİŞİSEL VERİLER</h3>
                <p><strong>9.1.</strong> İşletmeci ve üye, hizmet kapsamında edindikleri kamuya açık olmayan fiyat, teklif, strateji, teknik dosya ve iş bilgilerini yetkisiz kişilerle veya işlem amacı dışında paylaşmaz. İlgili ihale için belirlenen gizlilik ve erişim koşulları korunur. Kamuya açık bilgi, bağımsız geliştirilen bilgi, hukuki danışmanlık ve kanuni yükümlülük veya hak arama için gerekli açıklama bu yasağın dışındadır. Açıklama gerekli kapsamla sınırlanır; kanunun yasakladığı bir ön bildirim yükümlülüğü yaratılmaz.</p>
                <p><strong>9.2.</strong> Gizlilik yükümlülüğünün süresi, bilginin korunma niteliği, geçerli sözleşmesel şartlar ve uygulanabilir hukukla değerlendirilir. Sözleşmenin sona ermesi bütün ticari bilgileri kendiliğinden kamuya açmaz. Gizlilik süresi ile kişisel veri saklama süresi aynı kavram değildir.</p>
                <p><strong>9.3.</strong> Kişisel veri amaçları, hukuki sebepleri, alıcılar, aktarım koşulları ve haklar ilgili aydınlatmalarda açıklanır. Bu sözleşme açık rıza, ticari ileti izni veya bütün veri türleri için tek tip saklama yetkisi yerine geçmez. İsteğe bağlı izinler ve zorunlu hizmet işlemleri ayrı değerlendirilir.</p>
              </section>

              <!-- 10. Özen ve sorumluluk -->
              <section class="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h3 class="font-bold text-amber-950 text-sm">10. ÖZEN VE SORUMLULUK</h3>
                <p><strong>10.1.</strong> İşletmeci kendi hizmeti, güvenliği, işlem ve bildirimleri ile kanuni inceleme ve müdahale yükümlülüklerinden sorumludur. Bütün üye beyanlarını önceden doğruladığı, her işlemin başarıya ulaşacağı veya kesintisiz ve hatasız hizmet vereceği garanti edilmez; bu durum kendi yükümlülüklerini ortadan kaldırmaz.</p>
                <p><strong>10.2.</strong> Kast, ağır kusur veya önceden kaldırılamayan sorumluluk hiçbir hükümle dışlanmaz. Üyenin ya da İşletmecinin tazmin sorumluluğu ihlal, kusur, zarar ve illiyet bağı yönünden somut olay ve uygulanabilir hukukla belirlenir. Bu metin ayrıca bir parasal sorumluluk tavanı veya bütün dolaylı zararları kapsayan mutlak muafiyet getirmez.</p>
                <p><strong>10.3.</strong> Platformda teslim kodu veya sevkiyat kaydı kullanılması, her durumda mülkiyet ve hasar riskinin devri, kusursuz ifa veya ayıp haklarından feragat değildir. Üyeler arasındaki geçerli ticari şartlar ve kanuni haklar saklıdır. Bu sözleşme tek tip garanti süresi, gecikme cezası veya ticaret bedelinin iadesi garantisi oluşturmaz.</p>
              </section>

              <!-- 11. Süre, sona erme ve kayıtlara erişim -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">11. SÜRE, SONA ERME VE KAYITLARA ERİŞİM</h3>
                <p><strong>11.1.</strong> Aracılık ilişkisi bu sözleşmenin geçerli biçimde kurulmasıyla başlar; geçmişte edinilmiş hizmet haklarının ve ayrı danışmanlığın dönemleri kendi geçerli ticari şartlarında belirlenir. Hesabın kapatılması veya aracılık ilişkisinin sona ermesi doğmuş borçları, devam eden üyeler arası sözleşmeleri ve gerekli delilleri kendiliğinden ortadan kaldırmaz. Ayrı hizmet sonu 24 saatlik ödeme penceresi kendi koşullarıyla korunur; bu pencere teklif geri çekme süresi veya kart yenileme yetkisi değildir.</p>
                <p><strong>11.2.</strong> Sona erme sonrasında hangi sözleşme, işlem ve üye verilerine hangi yöntemle ve ne süreyle erişilebileceği hizmet açıklamasında belirtilir. Üyenin kendi verilerine ve belgelerine ilişkin kanuni hakları, diğer kişilerin hakları ve güvenlik kuralları birlikte korunur. İşletmecinin bir kaydı saklaması, üyeye o kayda sınırsız veya süresiz erişim sağlandığı anlamına gelmez.</p>
                <p><strong>11.3.</strong> Haklı neden, kanuni fesih, bildirim ve giderim hakları saklıdır. Sona erme koşulları diğer geçerli sözleşmelerin kapsamını aşacak şekilde otomatik sonuç doğurmaz. Mücbir sebep yalnız etkilediği yükümlülük ve süre bakımından değerlendirilir; gerekli bildirim ve zararı azaltma yükümlülüklerini kendiliğinden kaldırmaz.</p>
              </section>

              <!-- 12. Sürüm, delil ve uyuşmazlık -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">12. SÜRÜM, DELİL VE UYUŞMAZLIK</h3>
                <p><strong>12.1.</strong> Değişiklikler önceki kabul veya imzalı belgeleri geriye dönük değiştirmez. Geleceğe yönelik değişikliğin kapsamı, yürürlük zamanı, gerekli bildirim ve kabul ile uygulanabilecek fesih hakları somut hizmet ve kanuni güvencelerle belirlenir. Salt site ziyareti yeni bir yükümlülüğün kabulü değildir.</p>
                <p><strong>12.2.</strong> Elektronik kayıtlar hukuken değerlendirilebilen delillerdir (HMK Madde 193); aksi delil sunma ve doğruluğa itiraz hakları korunur. Bir hükmün geçersizliği, kısmi geçersizlik ve genel işlem koşullarının yazılmamış sayılmasına ilişkin kanuni sonuçlar gözetilerek değerlendirilir. Geçersiz hüküm yerine üyeye yeni bir borç yüklenmez.</p>
                <p><strong>12.3.</strong> Türk hukuku uygulanır; uygulanması zorunlu kanunlar ihtilafı, görev ve yetki kuralları saklıdır. Uyuşmazlıkların çözümünde <strong>Çanakkale Mahkemeleri ve İcra Daireleri</strong> yetkilidir. Bu sözleşme her üye için münhasır mahkeme seçimi yapmaz veya kanuni başvuru hakkını kaldırmaz. TR/EN çeviri farkı, üyenin görmediği ek bir yükümlülük yaratmaz; geçerli biçimde kabul edilen metin ve uygulanabilir yorum kuralları esas alınır.</p>
              </section>
            </div>
          </article>

          <!-- 3. GİZLİLİK POLİTİKASI & KVKK AYDINLATMA METNİ -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-900 font-mono text-xs font-bold rounded-lg border border-blue-200">6698 SAYILI KVKK UYUMLU</span>
              <span class="px-3 py-1 bg-purple-50 text-purple-800 font-mono text-xs font-bold rounded-lg border border-purple-200">VERİ SORUMLUSU AYDINLATMA METNİ</span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-200">TLS 1.3 & AES-256 GÜVENLİK</span>
              <span class="text-xs text-slate-400 font-mono">Belge Sürümü: TR-2026-09-10-03-R1</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ 'İhaleciBurada Üyelik ve Platform İşlemleri KVKK Aydınlatma Metni' }}
            </h1>
            
            <!-- Veri Sorumlusu ve Yasal Tanıtım Kutusu -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p class="font-semibold text-slate-900">
                {{ '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") m. 10 uyarınca, veri sorumlusu sıfatıyla Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi) tarafından işlenen kişisel verilere ilişkin aydınlatma metnidir.' }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                <div><strong>Veri Sorumlusu:</strong> Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</div>
                <div><strong>Vergi Dairesi / VKN:</strong> Çanakkale V.D. / 9560161511</div>
                <div><strong>Tebligat Adresi:</strong> İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</div>
                <div><strong>Kurumsal Destek:</strong> 0850 840 86 95</div>
                <div><strong>Resmi E-Posta:</strong> ihalecib@gmail.com</div>
                <div><strong>KEP Adresi:</strong> hasanhuseyin.yildirim.17@hs01.kep.tr</div>
              </div>
            </div>

            <!-- Hızlı Belge Gezintisi (Quick Nav Pills) -->
            <div class="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <a href="#kvkk-aydinlatma" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center gap-1.5">
                <Shield :size="12" class="text-blue-700" />
                <span>1. KVKK Aydınlatma Metni (8 Madde)</span>
              </a>
              <a href="#acik-riza" class="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold transition flex items-center gap-1.5">
                <ShieldCheck :size="12" class="text-purple-700" />
                <span>2. Açık Rıza Tercihleri (5 Madde)</span>
              </a>
              <a href="#ticari-sir" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition flex items-center gap-1.5">
                <Scale :size="12" class="text-blue-400" />
                <span>3. B2B Ticari Sırlar & Güvenlik</span>
              </a>
            </div>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              
              <!-- 1. Kapsam ve veri sorumlusu -->
              <section id="kvkk-aydinlatma" class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">1. KAPSAM VE VERİ SORUMLUSU</h3>
                <p><strong>1.1.</strong> Bu metin, İhaleciBurada hesabı açan gerçek kişiler ile şirket hesabındaki temsilci ve yetkili kullanıcıların üyelik ve platform işlemlerine ilişkin kişisel verilerini konu alır. Veri sorumlusu: <strong>Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</strong>; adres: Çanakkale, Türkiye (Tebligat Adresi: İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye); VKN: 9560161511; Çanakkale Vergi Dairesi; telefon: 0850 840 86 95; başvuru kanalları: <strong>ihalecib@gmail.com</strong> ve <strong>hasanhuseyin.yildirim.17@hs01.kep.tr</strong>. İhaleciBurada marka ve platform adı tek başına tüzel kişi kimliği değildir.</p>
                <p><strong>1.2.</strong> Şirket bilgileri, bir gerçek kişiyi belirlediği veya belirlenebilir kıldığı ölçüde kişisel veridir. Şirket adına işlem yapan kişinin verisi, sırf şirket sözleşmenin tarafı olduğu için sözleşmenin ifası şartına dayanılarak işlenemez. Aşağıdaki faaliyetler, ilgili kişinin konumu ve gerçekten yürütülen işlemle sınırlıdır.</p>
                <p><strong>1.3.</strong> Genel Gizlilik Politikası, çerez, isteğe bağlı amaç ve kurumsal bilgilendirmeler ayrı kapsamları açıklar. Bu bildirim için rıza verilmesi istenmez. Metnin açılması veya okunduğunun bildirilmesi, sözleşme kabulü ya da isteğe bağlı işlemlere açık rıza değildir.</p>
              </section>

              <!-- 2. Hesap açılması ve kullanılması -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">2. HESAP AÇILMASI VE KULLANILMASI</h3>
                <p><strong>2.1.</strong> Kayıt formunda bildirilen ad, soyad, iletişim ve hesap bilgileri; hesap açılması, kimlik doğrulama, hesaba erişim ve hesapla ilgili hizmet bildirimleri için elektronik form ve hesap işlemleri üzerinden otomatik veya kısmen otomatik yollarla toplanır. Gerçek kişinin tarafı olduğu üyelik ilişkisinin kurulması veya ifası için doğrudan gerekli işlem bakımından hukuki sebep, 6698 sayılı Kanun'un 5/2-c maddesidir. Pazarlama bu kapsama dahil değildir.</p>
                <p><strong>2.2.</strong> Şirket temsilcisi veya yetkili kullanıcının ad, iş iletişim, görev ve yetki bilgileri; şirket hesabını doğru kişiyle ilişkilendirmek ve yetkili erişimi yönetmek amacıyla kişinin beyanından ve yetkilendirme kayıtlarından alınır. Bu faaliyet için 5/2-f kapsamında meşru menfaat dayanağı ancak gereklilik ve temel haklar dengesi sağlandığında kullanılabilir. Başka bir kişiden alınan bilgiler bakımından da ilgili kişiye kanuni zamanda ayrıca bilgi verilmesi gerekir.</p>
                <p><strong>2.3.</strong> Oturum, erişim ve işlem zamanları ile gerçekten üretilen güvenlik kayıtları, yetkisiz erişimi ve kötüye kullanımı tespit etmek için otomatik olarak işlenir; bu amaç için 5/2-f şartları ayrıca değerlendirilir. Gösterilen belge ve gerçek kabul/geri alma işlemlerine ilişkin kayıtların bir hakkın tesisi, kullanılması veya korunması için gerekli muhafazasında 5/2-e uygulanır. Bir gösterim kaydı, verilmemiş rıza veya görülmemiş belge için kabul kanıtına dönüştürülemez.</p>
              </section>

              <!-- 3. Platform işlemleri ve danışmanlık -->
              <section class="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h3 class="font-bold text-blue-950 text-sm">3. PLATFORM İŞLEMLERİ VE DANIŞMANLIK</h3>
                <p><strong>3.1.</strong> Kullanıcının talebiyle yürütülen ihale, teklif, işlem iletişimi ve uyuşmazlık süreçlerinde beyan edilen kişi iletişim bilgileri, işlem içeriği, belgeler ve işlem kayıtları elektronik giriş, yükleme ve süreç kayıtlarından elde edilir. İlgili gerçek kişinin taraf olduğu sözleşme için doğrudan gerekli işlemler 5/2-c; şirket yetkilisinin işlem koordinasyonu için gerekli işlemler şartları sağlanmış 5/2-f; somut hak talebi ve uyuşmazlık kanıtlarının gerekli işlenmesi 5/2-e bakımından ayrı değerlendirilir. İşlem verisi kendiliğinden pazarlama veya herkese açık profil verisi olmaz.</p>
                <p><strong>3.2.</strong> Danışmanlık başvurusu ve hizmetin yürütülmesi için iletişim bilgileriniz, ihtiyaç talebiniz, kararlaştırılan kapsam, dönem ve bedel, temsil bilgileriniz, sözleşme sürümü, tarafların imzalı nüshaları ile inceleme ve hizmet durumu kayıtları işlenir. Amaç, talebinizi yanıtlamak, kararlaştırılan hizmeti yürütmek ve tarafların haklarını korumaktır. Hukuki sebepler, kişinin sözleşmenin tarafı veya şirket temsilcisi olmasına göre 3.1’de ayrılan şartlardır. İmza ve hizmete başlama koşulları ayrı danışmanlık sözleşmenizde yer alır.</p>
                <p><strong>3.3.</strong> Fatura, banka havalesi, ödeme referansı ve muhasebe kayıtları; ilgili mevzuatın gerektirdiği kayıt ve bildirim yükümlülükleri için Kanun’un 5/2-ç maddesi, somut bir alacak veya uyuşmazlıkta gerekli kanıtın korunması için 5/2-e maddesi kapsamında işlenir. Yalnız ilgili yükümlülük veya hak talebi için gereken veriler kullanılır. Bu veriler isteğe bağlı pazarlama izninin konusu değildir.</p>
              </section>

              <!-- 4. İsteğe bağlı faaliyetlerin sınırı -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">4. İSTEĞE BAĞLI FAALİYETLERİN SINIRI</h3>
                <p><strong>4.1.</strong> Firma profilindeki isteğe bağlı kişisel tanıtım içeriği Dijital Varlıklar ve Görsel İçerik Bilgilendirmesinde; işlem karşı tarafının girdiği puan ve yorumlar Firma Değerlendirmeleri ve Puan Bilgilendirmesinde; İhaleciBurada tanıtım ve bilgilendirme iletileri Ticari İletişim Amacı metninde açıklanır. Bu faaliyetlerin verileri, toplama yöntemleri, amaçları, alıcıları ve hukuki sebepleri kendi bölümlerinde ayrılmıştır. Firma işlem değerlendirmesi, ayrı kişisel davranış/profil analiziyle aynı değildir. Açık Rıza Tercihleri Bilgilendirmesi bu faaliyetler arasındaki seçim sınırlarını gösterir; hesap açılması veya genel metnin okunması hepsine izin sayılmaz.</p>
                <p><strong>4.2.</strong> Çerez ve benzeri teknolojiler için Çerez Politikası ile işlevsel, analitik ve pazarlama tercih bildirimleri ayrıca geçerlidir. Bir kategoriyi seçmek, ayrı ticari ileti onayı veya her türlü yurt dışı aktarım yetkisi değildir. Zorunlu güvenlik işlemleri isteğe bağlı analitik adı altında; analitik de yalnız “güvenlik” etiketiyle zorunlu gösterilemez.</p>
                <p><strong>4.3.</strong> Rıza vermemek, rızadan bağımsız geçerli şartlarla sunulan temel hizmetlere erişimin kısıtlanmasına veya cezalandırmaya gerekçe olamaz. Rıza geri alınabilir; veri sorumlusuna ulaşmasıyla ileriye etkili olur. Geri alma öncesinde hukuka uygun yapılmış işlemleri geriye dönük olarak hukuka aykırı kılmaz; başka geçerli şart bulunmayan gelecekteki işleme veya süresiz saklamaya izin vermez. Aynı isteğe bağlı faaliyeti sürdürmek için geri almadan sonra hukuki sebep değiştirilerek rızanın geri alınması etkisizleştirilemez.</p>
              </section>

              <!-- 5. Alıcılar ve yurt dışı aktarım -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">5. ALICILAR VE YURT DIŞI AKTARIM</h3>
                <p><strong>5.1.</strong> Bir işlemin karşı tarafına kişi iletişim veya işlem içeriği verilmesi, yalnız ilgili işlemin yürütülmesi için gerekli kapsamla sınırlıdır. Tüm üyelerin veya kamuoyunun erişebileceği yayın ayrı bir faaliyettir; işlem karşı tarafıyla paylaşım, dizinde herkese açık yayın izni oluşturmaz. Veri sorumlusu, ilgili paylaşım başlamadan önce paylaşılan verileri, alıcı gruplarını ve paylaşım amacını açıklamakla yükümlüdür.</p>
                <p><strong>5.2.</strong> Altyapı hizmet sağlayıcıları, işlem için gerekli meslek danışmanları ve kanunen yetkili makamlarla paylaşım, her alıcının görevi ve ilgili amaç için gerekli veriyle sınırlıdır. İç ekip erişimi görev gereğiyle sınırlanır. Kişisel veriler üçüncü kişilere ticari amaçlarla satılmaz.</p>
                <p><strong>5.3.</strong> Yurt dışından erişim dahil yurt dışı aktarımda, yurt içindeki işleme şartına ek olarak Kanun'un 9. maddesine uygun aktarım koşulları gerekir. Düzenli altyapı aktarımı, genel bir rıza kutusuyla arızi aktarım istisnasına dönüştürülemez. Aktarım koşulları, ilgili faaliyet ve kullanılan hukuki yol bakımından sağlanmak zorundadır.</p>
              </section>

              <!-- 6. Saklama, veri sınırı ve güvenlik -->
              <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 class="font-bold text-slate-900 text-sm">6. SAKLAMA, VERİ SINIRI VE GÜVENLİK</h3>
                <p><strong>6.1.</strong> Saklama süresi veri türüne ve sürenin başlangıç olayına göre ayrılır. <strong>Vergi Usul Kanunu’nun 253. maddesi</strong> kapsamındaki defter ve belgeler, ilgili oldukları yılı izleyen takvim yılından başlayarak <strong>5 yıl</strong> muhafaza edilir. <strong>Türk Ticaret Kanunu’nun 82. maddesi</strong> kapsamındaki belgeler <strong>10 yıl</strong> saklanır. Bu on yıllık süre, 82/6. madde uyarınca, belge türüne göre ticari defterlere son kaydın yapıldığı, envanterin çıkarıldığı, ara bilançonun düzenlendiği, yılsonu finansal tabloları ile konsolide finansal tabloların hazırlandığı, ticari yazışmaların yapıldığı veya muhasebe belgelerinin oluştuğu takvim yılının bitiminde başlar. Aynı belge her iki kanunun kapsamına giriyorsa daha geç sona eren kanuni saklama yükümlülüğü korunur. Bu süreler tüm profil, gezinme veya güvenlik verilerine uygulanmaz. Hesap verisinin aktif kullanım süresi üyelik ilişkisine; işlem, onay ve uyuşmazlık kanıtının ek muhafazası ilgili hakkın korunması ihtiyacına, uygulanabilir kanuni süreye ve varsa devam eden yargı veya inceleme sürecine bağlıdır. Muhafaza amacı sona eren veri yeni pazarlama amacıyla kullanılamaz; 6.2’deki imha yükümlülüğü uygulanır.</p>
                <p><strong>6.2.</strong> İşleme şartlarının tamamı ortadan kalktığında veriler kanuni usule göre silinir, yok edilir veya anonim hâle getirilir. Rıza geri alma, hesap kapatma ve yasal muhafaza ayrı değerlendirilir; tüm kopyaların anında silindiği taahhüt edilmez. Takma ad, IP kısaltması veya doğrudan tanımlayıcının çıkarılması tek başına anonimleştirme değildir.</p>
                <p><strong>6.3.</strong> İşlemle ilgisiz üçüncü kişi veya özel nitelikli verileri, parola ve tek kullanımlık kodları serbest metin ve dosyalara eklemeyin. Bu uyarı veri sorumlusunun veri minimizasyonu ve gerekli teknik/idari tedbirleri alma yükümlülüğünü size devretmez. Belirli bir sertifika, şifreleme kapsamı, yedekleme süresi veya kusursuz güvenlik bu metinle garanti edilmez.</p>
              </section>

              <!-- 7. Haklarınız ve başvuru -->
              <section class="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                <h3 class="font-bold text-emerald-950 text-sm">7. HAKLARINIZ VE BAŞVURU (KVKK MADDE 11)</h3>
                <p><strong>7.1.</strong> Kanun'un 11. maddesindeki haklarınız saklıdır. Verilerinizin işlenip işlenmediğini öğrenebilir, işlenmişse bilgi isteyebilir; işleme amacını, amaca uygun kullanımı ve yurt içi/yurt dışı alıcıları öğrenebilirsiniz. Eksik veya yanlış verinin düzeltilmesini, kanuni şartlarla silme veya yok etmeyi ve bu işlemlerin aktarılan üçüncü kişilere bildirilmesini talep edebilir; münhasıran otomatik analizle aleyhinize ortaya çıkan sonuca itiraz edebilir ve hukuka aykırı işleme nedeniyle zararınızın giderilmesini isteyebilirsiniz. Bu özet kanuni hakları sınırlamaz.</p>
                <p><strong>7.2.</strong> Başvurunuzu <strong>İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</strong> adresine yazılı olarak veya <strong>hasanhuseyin.yildirim.17@hs01.kep.tr</strong> adresine KEP yoluyla iletebilirsiniz. Daha önce İhaleciBurada’ya bildirdiğiniz ve sistemde kayıtlı e-posta adresinizden <strong>ihalecib@gmail.com</strong> adresine de başvurabilirsiniz. Güvenli elektronik imza ve mobil imza dahil Tebliğin izin verdiği diğer yöntemler saklıdır. Platformumuzun <strong>/sozlesmeler?tab=gizlilik</strong> sayfasında yer alan kurumsal iletişim kanalları talebinizi hazırlamanıza yardımcı olur; formu kullanmak veya KEP hesabı edinmek zorunda değilsiniz. Kimlik ve temsil yetkisi yalnız talep için gerekli ölçüde doğrulanır.</p>
                <p><strong>7.3.</strong> Başvurular talebin niteliğine göre en kısa sürede ve en geç <strong>otuz (30) gün</strong> içinde sonuçlandırılır. İşlem ayrıca bir maliyet gerektirirse yalnız Kişisel Verileri Koruma Kurulu'nun belirlediği tarifedeki ücret uygulanabilir. Kanuni şikâyet ve diğer başvuru hakları saklıdır; bu metnin kabulü hak kullanmanın şartı değildir.</p>
              </section>

              <!-- 8. Bilgilendirme ve sürüm kayıtları -->
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">8. BİLGİLENDİRME VE SÜRÜM KAYITLARI</h3>
                <p><strong>8.1.</strong> Aydınlatma, rıza dahil hangi işleme şartı kullanılırsa kullanılsın yerine getirilir. Yeni amaçla işlemden önce o amaca ilişkin bildirim ayrıca yapılır. Sitede daha sonra bir metin yayımlamak, daha önce eksik bırakılan aydınlatmayı veya verilmemiş rızayı geriye dönük tamamlamaz.</p>
                <p><strong>8.2.</strong> Veri sorumlusu, size sunulan dil, belge sürümü ve yürürlük bilgisini ilgili gösterim ve işlem kayıtlarıyla ilişkili olarak korumak ve Türkçe ile İngilizce metinlerin kapsamını tutarlı tutmakla yükümlüdür. Eski belge ve kayıtlar sonradan yeni metin kabul edilmiş gibi değiştirilemez.</p>
                <p><strong>8.3.</strong> Aydınlatma, sözleşme kabulü veya isteğe bağlı veri işlemeye rıza değildir. Verileriniz yeni bir amaçla işlenecekse bu amaç işleme başlamadan önce size açıklanır ve gerektiğinde ayrıca rızanız alınır.</p>
              </section>

              <!-- 9. B2B Ticari Sırların Korunması ve Kriptografik Güvenlik Standartları -->
              <section id="ticari-sir" class="space-y-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                <h3 class="font-bold text-blue-400 text-sm">9. B2B TİCARİ SIRLARIN KORUNMASI VE KRİPTOGRAFİK GÜVENLİK STANDARTLARI</h3>
                <p class="text-slate-300 text-xs"><strong>9.1. Kapalı Zarf ve Canlı İhale Anonimliği:</strong> Canlı eksiltme süresince yarışan tedarikçilerin ticari unvanları sistem tarafından otomatik olarak maskelenir (Firma-1, Firma-2 vb.). Hiçbir katılımcı, diğer rakip firmaların kimliğini veya birim maliyet dökümünü canlı ekranda göremez. İhale fiyatları ve satın alma şartnameleri asla üçüncü şahıslara veya reklam ağlarına satılamaz, devredilemez.</p>
                <p class="text-slate-300 text-xs"><strong>9.2. Kriptografik Güvenlik (TLS 1.3 & AES-256):</strong> Tüm web trafiği ve API veri iletimi modern TLS 1.3 şifreleme protokolleri ile güvence altına alınmıştır. Durağan veritabanı kayıtları AES-256 algoritmasıyla şifrelenerek Türkiye sınırları içerisindeki ISO 27001 sertifikalı Tier-3 veri merkezlerinde saklanmaktadır.</p>
                <p class="text-slate-300 text-xs"><strong>9.3. Şartname, Telif ve Uyar-Kaldır:</strong> Sisteme yüklenen teknik şartname, CAD çizimleri veya belgelerden doğan fikri ve sınai mülkiyet hakları sahiplerine aittir. Hak ihlali iddialarında <strong>ihalecib@gmail.com</strong> adresine noter onaylı delillerle başvurulduğunda yasal uyar-kaldır prosedürü derhal işletilir.</p>
              </section>

              <!-- ========================================================================= -->
              <!-- İHALECİBURADA AÇIK RIZA TERCİHLERİ BİLGİLENDİRMESİ (5 BÖLÜM) -->
              <!-- ========================================================================= -->
              <div id="acik-riza" class="pt-8 border-t-2 border-slate-200 mt-10 space-y-6">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 bg-purple-50 text-purple-900 font-mono text-xs font-bold rounded-lg border border-purple-200">6698 SAYILI KVKK M. 5/1 UYUMLU</span>
                  <span class="px-3 py-1 bg-indigo-50 text-indigo-800 font-mono text-xs font-bold rounded-lg border border-indigo-200">İSTEĞE BAĞLI TERCİHLER ÇERÇEVESİ</span>
                  <span class="text-xs text-slate-400 font-mono">Belge Sürümü: TR-2026-09-10-04-R1</span>
                </div>

                <h2 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  İhaleciBurada Açık Rıza Tercihleri Bilgilendirmesi
                </h2>

                <div class="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 text-xs text-purple-950 leading-relaxed font-medium space-y-2">
                  <p>
                    Bu belge, aşağıda ayrılan faaliyetler ve tercihlerin kapsamı için yol gösterir. İlgili faaliyetin kendi veri, amaç, alıcı ve hukuki sebep açıklamasıyla birlikte okunur; yalnız okumak veya metni açmak rıza beyanı değildir.
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-purple-200/60 text-[11px] text-slate-700">
                    <div><strong>Veri Sorumlusu:</strong> Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</div>
                    <div><strong>Vergi Dairesi / VKN:</strong> Çanakkale V.D. / 9560161511</div>
                    <div><strong>Tebligat Adresi:</strong> İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</div>
                    <div><strong>Kurumsal İletişim:</strong> 0850 840 86 95 | ihalecib@gmail.com</div>
                  </div>
                </div>

                <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed">
                  <!-- 1. Bilgilendirme ile rızanın ayrılması -->
                  <section class="space-y-2">
                    <h3 class="font-bold text-slate-900 text-sm">1. BİLGİLENDİRME İLE RIZANIN AYRILMASI</h3>
                    <p><strong>1.1.</strong> İhaleciBurada platformunu işleten veri sorumlusu <strong>Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)</strong>, adresi <strong>İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</strong> (VKN: 9560161511, Çanakkale Vergi Dairesi, Tel: 0850 840 86 95) ve başvuru kanalları <strong>ihalecib@gmail.com</strong> ve <strong>hasanhuseyin.yildirim.17@hs01.kep.tr</strong> üzerinden tanımlanır. Kişisel veriler, kimliği belirli veya belirlenebilir gerçek kişiye ilişkin bilgilerdir; şirket bilgileri de bu ölçüde kapsama girer.</p>
                    <p><strong>1.2.</strong> KVKK Aydınlatma Metni kişisel veri işlemenin açıklamasıdır; bu üst metin isteğe bağlı amaçlar arasındaki farkları açıklar. İkisini okumak, metni açmak, siteyi kullanmak veya sessiz kalmak rıza değildir. Aydınlatmanın yapıldığına ilişkin geri bildirim, rıza beyanıyla aynı işlem sayılamaz.</p>
                    <p><strong>1.3.</strong> Açık rıza belirli, bilgilendirmeye dayalı, özgür ve olumlu bir seçim olmalıdır. Bağımsız amaçlar toplu ve belirsiz bir izin altında birleştirilemez. Rızadan bağımsız geçerli şartlara dayanan temel üyelik ve talep edilmiş hizmetler için ayrıca isteğe bağlı pazarlama veya analiz rızası zorunlu tutulamaz.</p>
                  </section>

                  <!-- 2. Dijital varlıklar, profil ve ileri analiz -->
                  <section class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 class="font-bold text-slate-900 text-sm">2. DİJİTAL VARLIKLAR, PROFİL VE İLERİ ANALİZ</h3>
                    <p><strong>2.1.</strong> Dijital Varlıklar ve Görsel İçerik Bilgilendirmesi, firma profilindeki tanıtım alanlarına sağladığınız görsel, tanıtım videosu, hakkında/biyografi ve bağlantılarda yer alan kişisel verilerin alınmasını, saklanmasını ve profilin erişim kapsamına göre gösterilmesini açıklar. Bu isteğe bağlı kişisel tanıtım için 5/1 kapsamında ayrı açık rıza esas alınır. Profil yayını tercihi İhaleciBurada’nın ayrı reklam kampanyası veya sosyal medya yayınına, içerikteki başka kişilerin adına rıza vermeye ya da bütün altyapı aktarımlarına izin değildir.</p>
                    <p><strong>2.2.</strong> Firma Değerlendirmeleri ve Puan Bilgilendirmesi, ticaret yapan karşı firmanın uygun ihale işlemi veya tamamlanmış satın alma siparişi hakkında girdiği puan ve yorumları, bunlardan hesaplanan ortalamayı ve gösterim kapsamını açıklar. Bu faaliyet, gezinme veya ihale davranışınızdan ayrı bir kişisel profil/güvenilirlik skoru üretilmesiyle aynı değildir. Firma değerlendirmesine ilişkin hukuki sebepler o metinde ayrılmıştır; kayıt veya ayarlardaki “profil skoru” tercihi tüm firma yorumlarına verilmiş genel rıza sayılamaz. Ayrı kişisel analiz amacı için yeni, somut bilgilendirme ve gerekiyorsa ayrı seçim gerekir.</p>
                    <p><strong>2.3.</strong> Kullanım ve performans ölçümü, Analitik Tercihi ve Çerez Politikasında açıklanan ayrı faaliyettir; dijital tanıtım veya firma değerlendirmesi seçiminin içine eklenmez. “Diğer veri” başlığı altında bu belgelerde tanımlanmamış ek bir veri kategorisi, amaç veya alıcı için izin alınmaz. Arama, teknik şartname veya işlem içeriği, başka bir amaç için edinilmiş olması nedeniyle kişisel hedefleme veya yeni analizde kullanılamaz; böyle bir faaliyet ayrı hukuki şart ve önceden somut bilgilendirme gerektirir.</p>
                  </section>

                  <!-- 3. İletişim, çerez ve aktarım -->
                  <section class="space-y-2">
                    <h3 class="font-bold text-slate-900 text-sm">3. İLETİŞİM, ÇEREZ VE AKTARIM</h3>
                    <p><strong>3.1.</strong> Ticari İletişim Amacı metni, seçtiğiniz e-posta adresine İhaleciBurada’nın kendi hizmetleriyle ilgili bülten, kampanya, genel ihale fırsatı ve tanıtım güncellemesi gönderilmesi için ad-soyad ve e-posta adresinizin kullanımını açıklar. SMS veya WhatsApp pazarlaması bu seçime dahil değildir. KVKK kapsamındaki kişisel veri işleme tercihi ile Ticari Elektronik İleti Onayı metnindeki 6563 sayılı Kanun kapsamındaki ileti onayı ve ret düzeni ayrıdır. Hesap güvenliği ve talep edilmiş işlemler için gerekli bildirimler pazarlama sayılmaz; bu mesajlara tanıtım eklenerek ret tercihi aşılamaz.</p>
                    <p><strong>3.2.</strong> İşlevsel, analitik ve pazarlama çerez tercihleri ilgili çerez bildirimleriyle birlikte değerlendirilir; ticari ileti tercihiyle aynı işlem değildir. Gerekli olmayan teknoloji için rıza gerekiyorsa geçerli rıza öncesinde çalıştırılamaz. Bu üst metin belirli bir etiketin gerçekten engellendiğini veya tarayıcı tercihinin tüm hesap ve cihazlarla eşzamanlandığını doğrulamaz.</p>
                    <p><strong>3.3.</strong> Yurt dışı aktarım için Yurt Dışı Aktarım Bilgilendirmesinde açıklanan ayrı Kanun'un 9. maddesi koşulları uygulanır. Yalnız bir açık rıza kutusu, düzenli bulut altyapısı aktarımını hukuka uygun hâle getirmez. Alıcı, ülke, veri, amaç ve gerçek mekanizma bilinmeden sağlayıcı listesi, standart sözleşme veya ISO sertifikası varmış gibi beyanda bulunulamaz.</p>
                  </section>

                  <!-- 4. Seçimin kapsamı ve geri alma -->
                  <section class="space-y-2 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                    <h3 class="font-bold text-purple-950 text-sm">4. SEÇİMİN KAPSAMI VE GERİ ALMA</h3>
                    <p><strong>4.1.</strong> Bir ekranda birden çok amaç birlikte gösteriliyorsa hangi seçimin hangi işlemlere karşılık geldiği anlaşılır olmalı ve bağımsız amaçlar bakımından özgür seçim sağlanmalıdır. Bağımsız amaçların aynı ekranda sunulması, her amaç için ayrı ve özgür tercih sağlandığının tek başına kanıtı değildir. Her amaç için tamamlanmış bilgilendirme olmadan genel bir “tümünü kabul” beyanı eksikliği gidermez.</p>
                    <p><strong>4.2.</strong> Verdiğiniz rızayı gerekçe göstermeden dilediğiniz an geri alabilirsiniz; geri alma veri sorumlusuna ulaşmasıyla ileriye etkili olur. Sunulan tercih/hesap araçları veya belirtilen başvuru kanalları (<strong>ihalecib@gmail.com</strong>) kullanılabilir. Belirli bir tek-tık yolunun bütün sağlayıcılarda anında durdurma ve silme yaptığı garanti edilmez; bu sınır geri almanın hukuki etkisini veya veri sorumlusunun gereğini yapma yükümlülüğünü kaldırmaz.</p>
                    <p><strong>4.3.</strong> Geri alma, geçmişte hukuka uygun yapılmış işlemleri geriye dönük hukuka aykırı kılmaz. Ancak başka geçerli işleme şartı bulunmayan faaliyet devam ettirilemez; gerekli olmayan veri süresiz saklanamaz. Aynı isteğe bağlı faaliyeti sürdürmek için geri almadan sonra hukuki sebep değiştirilerek rızanın geri alınması etkisizleştirilemez. Amaç bazlı saklama ve silme kuralları ayrıca açıklanmalı; üyelik sonu, rıza geri alma ve gerekli hukuki kanıtın muhafazası birbirine karıştırılmamalıdır.</p>
                  </section>

                  <!-- 5. Haklar ve metnin sınırları -->
                  <section class="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                    <h3 class="font-bold text-emerald-950 text-sm">5. HAKLAR VE METNİN SINIRLARI</h3>
                    <p><strong>5.1.</strong> Kanun'un 11. maddesi kapsamındaki haklarınızı KVKK Aydınlatma Metninde belirtilen başvuru kanallarıyla (<strong>ihalecib@gmail.com</strong>, <strong>hasanhuseyin.yildirim.17@hs01.kep.tr</strong> veya <strong>İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</strong>) kullanabilirsiniz. Form kullanmak veya müşteriye ait KEP adresi sağlamak zorunlu değildir. İşlemenin eksiksiz açıklandığını kabul veya taahhüt etmeniz haklarınızın şartı değildir; bilgilendirme yükümlülüğü veri sorumlusunda kalır.</p>
                    <p><strong>5.2.</strong> Bu tercihler yalnız kişisel verilerin belirtilen isteğe bağlı amaçlarla işlenmesine ilişkindir. Üyelik ve danışmanlık hizmetinin kapsamı, bedeli, imzalanması ve sona ermesi <NuxtLink to="/sozlesmeler?tab=kullanim" class="text-blue-700 underline font-bold">Kullanıcı Sözleşmesinin 2.3 ve 4. bölümleri</NuxtLink> ile taraf olduğunuz ayrı hizmet sözleşmesine tabidir. Bir veri işleme tercihi hizmet sözleşmesi imzası veya ödeme talimatı yerine geçmez.</p>
                    <p><strong>5.3.</strong> Bu üst metnin bir cümlesi bütün amaçları kabul ettiğiniz anlamına gelmez; ayrı ve geçerli seçiminizin gerçek kapsamı esastır. Yeni amaç için gereken bildirim ve rıza ayrıca sağlanır. Önceki sürüm ve gerçek seçim kayıtları korunur; geçmişte başka bir metin görülmüş veya kabul edilmiş gibi yeniden yazılamaz.</p>
                  </section>
                </div>
              </div>

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
              <span class="px-3 py-1 bg-amber-50 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-200">PAYNKOLAY ZORUNLU FORMU</span>
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
                <p>3.2. Ödeme onayı lisanslı ödeme kuruluşu (Paynkolay - Aktif Bank) veya banka tarafından teyit edildiği anda, abonenin kullanıcı hesabı anında ve otomatik olarak aktif edilir. Giriş bilgileri ve aktivasyon onayı kayıtlı e-posta adresine iletilir.</p>
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
              <span class="px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">PAYNKOLAY 3D SECURE</span>
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
                <p>3.2. Paynkolay (Aktif Bank) 3D Secure ödeme onayı alındığı anda veya 1 Aylık Ücretsiz Deneme başlatıldığında, abonenin kullanıcı hesabı <strong>anında (0 saniye gecikmeyle)</strong> aktif edilir.</p>
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
                <p>4.3. Şirket bir banka değildir; fonlar lisanslı ödeme kuruluşu (Paynkolay - Aktif Bank) nezdinde güvence altındadır.</p>
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

