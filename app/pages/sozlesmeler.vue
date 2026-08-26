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
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '1. Kullanım Şartları ve Ana Hizmet Sözleşmesi (MSA)' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Bu Kullanım Şartları ve Ana Hizmet Sözleşmesi ("Sözleşme"), İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu ("Platform İşleticisi / Şirket") ile Platform\'a üye olan, ihale açan, teklif veren veya hizmetlerden yararlanan tüm tüzel kişi ve ticari işletmeler ("Kullanıcı / Üye") arasında akdedilmiştir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TANIMLAR VE KAPSAM</h3>
                <p>1.1. <strong>Platform:</strong> İhaleciBurada web sitesi, mobil arayüzleri, API servisleri ve bağlı tüm dijital operasyon altyapısını ifade eder.</p>
                <p>1.2. <strong>Alıcı:</strong> Satın almak istediği mal, hizmet veya yapım işi için Platform üzerinde şartname yükleyerek ihale / tersine eksiltme başlatan onaylı kurumsal kullanıcıdır.</p>
                <p>1.3. <strong>Tedarikçi:</strong> Alıcı tarafından açılan ihalelere teknik ve mali teklif sunan, eksiltmeye katılan doğrulanmış üretici, distribütör veya hizmet sağlayıcıdır.</p>
                <p>1.4. <strong>Canlı Eksiltme (Reverse Auction):</strong> Tedarikçilerin belirlenen süre zarfında birbirlerinin tekliflerini anonim olarak görerek fiyatı aşağı doğru yarıştırdığı dinamik e-ihale mekanizmasıdır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — KURUMSAL ÜYELİK VE DOĞRULAMA (KYC)</h3>
                <p>2.1. Platform hizmetleri münhasıran ticari faaliyet yürüten tüzel kişiler ve şahıs şirketlerinin kullanımına açıktır. Tüketici (B2C) işlemlerine kapalıdır.</p>
                <p>2.2. Üye, kayıt sırasında beyan ettiği Vergi Kimlik Numarası (VKN), MERSİS no, Ticaret Sicil Gazetesi, İmza Sirküleri ve yetkili iletişim bilgilerinin hukuken geçerli ve doğru olduğunu kabul eder.</p>
                <p>2.3. Platform İşleticisi, şüpheli veya yanıltıcı evrak sunan hesapları tek taraflı olarak askıya alma, ek doğrulama talep etme ve gerektiğinde üyeliği derhal sonlandırma hakkını saklı tutar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — İHALE VE TEKLİF SÜREÇLERİNİN HUKUKİ NİTELİĞİ</h3>
                <p>3.1. Alıcı tarafından açılan ihaleler hukuken "icaba davet" niteliğindedir; Alıcı, şartnamede aksi belirtilmedikçe en düşük teklifi kabul etmek zorunda değildir; fiyat, kalite ve teslimat şartlarına göre serbestçe değerlendirme yapar.</p>
                <p>3.2. Tedarikçi tarafından sunulan teklifler, ihale süresi boyunca geri alınamaz, kesin ve bağlayıcı bir ticari taahhüt ("icap") teşkil eder.</p>
                <p>3.3. Canlı eksiltmede Alıcı ve Tedarikçi arasında sağlanan mutabakat zaman damgalı Dijital İhale Tutanağı ile kayıt altına alınır ve taraflar arasında bağlayıcı bir satım/eser akdi doğurur.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — REKABET VE TİCARİ ETİK KURALLARI</h3>
                <p>4.1. Tedarikçilerin aralarında anlaşarak fiyat belirlemesi (kartel), yapay teklif sunması, alıcı ile platform harici danışıklı işlem yapması veya diğer teklif verenleri yanıltması kesinlikle yasaktır.</p>
                <p>4.2. 4054 Sayılı Rekabetin Korunması Hakkında Kanun ve Türk Ticaret Kanunu haksız rekabet hükümlerine aykırı davranan kullanıcıların hesapları kapatılır, teminatları irat kaydedilir ve haklarında yasal işlem başlatılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 5 — MALİ HÜKÜMLER VE FATURALANDIRMA</h3>
                <p>5.1. Platformda ihale açma, teklif verme ve sistem kullanımı lansman kapsamında 1 ay boyunca %100 ücretsizdir. Süre bitiminde üyelik paketleri yürürlüğe girer.</p>
                <p>5.2. Escrow (Güvenli Havuz) üzerinden gerçekleşen başarılı ticari işlemlerde belirlenen hizmet aracılık bedeli kesintisi yapılarak e-Fatura/e-Arşiv olarak faturası iletilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 6 — GİZLİLİK VE FİKRİ MÜLKİYET</h3>
                <p>6.1. Platform üzerindeki tüm yazılım mimarisi, tasarımlar, grafikler, ticari unvanlar ve algoritmalar Platform İşleticisi'nin mülkiyetindedir; kopyalanamaz ve tersine mühendislik yapılamaz.</p>
                <p>6.2. İhalelerde paylaşılan teknik şartnameler, CAD çizimleri ve formüller yalnızca ilgili ihaleye teklif hazırlama amacıyla kullanılabilir; üçüncü kişilerle paylaşılamaz.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 7 — YETKİLİ MAHKEME VE UYUŞMAZLIKLAR</h3>
                <p>7.1. İşbu Sözleşmenin uygulanmasından ve yorumlanmasından doğacak her türlü uyuşmazlıkta Türkiye Cumhuriyeti Kanunları uygulanır.</p>
                <p>7.2. Uyuşmazlıkların çözümünde İstanbul ve Balıkesir Mahkemeleri ile İcra Daireleri münhasıran yetkilidir.</p>
              </section>
            </div>
          </article>

          <!-- 2. GİZLİLİK POLİTİKASI (PRIVACY POLICY) -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '2. Gizlilik ve Ticari Sırların Korunması Politikası' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ 'Bu Gizlilik Politikası, İhaleciBurada platformu üzerinden toplanan, işlenen ve korunan kurumsal ve teknik verilerin güvenliği, gizliliği ve kullanım sınırlarını düzenlemektedir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — TOPLANAN TİCARİ VE TEKNİK VERİLER</h3>
                <p>1.1. <strong>Kurumsal Profil Verileri:</strong> Şirket unvanı, vergi dairesi/numarası, ticaret sicil kaydı, kurumsal iletişim bilgileri ve yetkili kişi bilgileri.</p>
                <p>1.2. <strong>İhale ve Şartname Verileri:</strong> Satın alma kalemleri, teknik şartname dosyaları, malzeme gereksinimleri, teslimat adresleri ve tahmini bütçe verileri.</p>
                <p>1.3. <strong>Teklif ve Finansal Veriler:</strong> Tedarikçi birim fiyatları, iskonto oranları, ödeme vadeleri, banka hesap bilgileri ve Escrow mutabakat kayıtları.</p>
                <p>1.4. <strong>Log ve Denetim Verileri:</strong> IP adresleri, zaman damgalı teklif girişleri, oturum kayıtları ve işlem güvenlik logları.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — KAPALI ZARF VE ŞİFRELİ TEKLİF GİZLİLİĞİ</h3>
                <p>2.1. İhale süresince tedarikçilerin sunduğu teklifler şifrelenmiş olarak saklanır. Rakip tedarikçiler birbirlerinin ticari unvanlarını ve maliyet detaylarını göremez (Anonimlik Kuralı).</p>
                <p>2.2. Canlı eksiltme ekranlarında yalnızca anlık en iyi teklif ve sıralama gösterilir; firma kimlikleri ihale sonuçlanana kadar gizli tutulur.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — VERİLERİN KORUNMASI VE ŞİFRELEME STANDARTLARI</h3>
                <p>3.1. Tüm veri iletimi uçtan uca TLS 1.3 ve 256-bit AES şifreleme protokolleri ile korunmaktadır.</p>
                <p>3.2. Veritabanı ve yedekleme sistemleri ISO 27001 sertifikalı Türkiye merkezli yüksek güvenlikli Tier-3 veri merkezlerinde barındırılmaktadır.</p>
                <p>3.3. Platform İşleticisi personeli, teknik şartnameleri ve teklif fiyatlarını gizlilik taahhüdü altında tutar; ticari veriler hiçbir reklam ağına veya üçüncü şahsa satılmaz.</p>
              </section>
            </div>
          </article>

          <!-- 3. KVKK / GDPR (DATA PROCESSING AGREEMENT - DPA) -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '3. KVKK Aydınlatma Metni ve Veri İşleme Sözleşmesi (DPA)' }}
            </h1>
            
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              {{ '6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat uyarınca, veri sorumlusu sıfatıyla İhaleciBurada tarafından işlenen kişisel verilere ilişkin aydınlatma metnidir.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — VERİ SORUMLUSUNUN KİMLİĞİ</h3>
                <p>Veri Sorumlusu: İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu</p>
                <p>İletişim & DPO E-Posta: <strong>ihalecib@gmail.com</strong> | Telefon: <strong>0850 308 00 00</strong></p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — İŞLENEN KİŞİSEL VERİLER VE İŞLEME AMAÇLARI</h3>
                <p>2.1. <strong>Kimlik ve İletişim:</strong> Şirket yetkilisinin Adı, Soyadı, T.C. Kimlik No, Kurumsal E-Posta, Telefon Numarası ve İmza Örneği.</p>
                <p>2.2. <strong>İşleme Amaçları:</strong> Sözleşmenin kurulması ve ifası (Madde 5/2-c), yasal yükümlülüklerin yerine getirilmesi (Madde 5/2-ç) ve e-ihale güvenliğinin temini (Madde 5/2-f).</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — KİŞİSEL VERİLERİN AKTARIMI VE SAKLANMASI</h3>
                <p>3.1. Veriler yalnızca kanunen yetkili kamu kurumlarına, bağımsız denetçilere ve TCMB/BDDK lisanslı ödeme ve e-fatura entegratörlerine kanuni sınırlar içinde aktarılır.</p>
                <p>3.2. Ticari işlem ve log kayıtları Türk Ticaret Kanunu ve Vergi Usul Kanunu uyarınca yasal zamanaşımı süreleri (10 yıl) boyunca güvenli sunucularda saklanır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 4 — İLGİLİ KİŞİNİN HAKLARI (KVKK MADDE 11)</h3>
                <p>4.1. Veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, yanlış işlenmişse düzeltilmesini isteme, yasal şartlar oluştuğunda silinmesini veya yok edilmesini talep etme hakkına sahiptir.</p>
                <p>4.2. Başvurular, kimlik teyidi yapılabilen kayıtlı kurumsal e-posta ile <strong>ihalecib@gmail.com</strong> adresine iletildiğinde en geç 30 gün içinde ücretsiz yanıtlanır.</p>
              </section>
            </div>
          </article>

          <!-- 4. İHALE VE EKSİLTME KURALLARI (REVERSE AUCTION RULES) -->
          <article v-if="activeTab === 'ihale-kurallari'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '4. B2B Canlı Eksiltme ve İhale Standartları Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 1 — İHALE BAŞLATMA VE ŞARTNAME YÜKLEME</h3>
                <p>1.1. Alıcı firma, ihale açarken teknik şartname, malzeme/iş miktarı, teslim yeri, ödeme vadesi ve teklif toplama süresini eksiksiz olarak sisteme girmelidir.</p>
                <p>1.2. İhale yayınlandıktan sonra teklif toplama aşamasında şartnamede esaslı değişiklik yapılamaz; değişiklik gerekiyorsa zeyilname yayınlanır veya ihale iptal edilip yenilenir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 2 — CANLI EKSİLTME İŞLEYİŞİ VE UZATMA KURALI (DYNAMIC EXTENSION)</h3>
                <p>2.1. Canlı eksiltmede tedarikçiler başlangıç tavan fiyatından aşağı doğru en az sistem tarafından belirlenen "Minimum İndirim Adımı" kadar eksiltme yapabilir.</p>
                <p>2.2. Eksiltmenin son 2 dakikası içinde yeni bir en iyi teklif verilirse, tüm katılımcıların adil rekabetini sağlamak amacıyla süre otomatik olarak +2 dakika uzatılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">KURAL 3 — TEKLİFİN BAĞLAYICILIĞI VE TEMİNAT YÜKÜMLÜLÜĞÜ</h3>
                <p>3.1. Tedarikçinin canlı eksiltmede verdiği her fiyat teklifi bağlayıcıdır. İhaleyi kazandıktan sonra haklı bir mücbir sebep olmaksızın taahhüdünden cayan tedarikçinin hesabı süresiz kapatılır.</p>
                <p>3.2. Yüksek bütçeli ihalelerde Alıcı firma talep ederse sistem üzerinden Teminat Mektubu veya Escrow Teminatı zorunluluğu koyabilir.</p>
              </section>
            </div>
          </article>

          <!-- 5. MESAFELİ SATIŞ VE ABONELİK (DISTANCE SALES AGREEMENT) -->
          <article v-if="activeTab === 'mesafeli-satis'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '5. Mesafeli Satış ve Kurumsal Abonelik Hizmet Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 1 — TARAFLAR VE HİZMET TANIMI</h3>
                <p>1.1. <strong>Hizmet Sağlayıcı:</strong> İhaleciBurada B2B Elektronik İhale ve Ticaret Platformu</p>
                <p>1.2. <strong>Abone / Müşteri:</strong> Platform üzerinde kurumsal üyelik paketi satın alan tüzel kişi veya ticari işletme.</p>
                <p>1.3. <strong>Hizmet Konusu:</strong> B2B e-ihale açma, teklif verme, analitik raporlar, ERP entegrasyonu ve canlı eksiltme modüllerine dönemsel erişim hakkı.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 2 — ABONELİK PAKETLERİ VE ÖDEME ŞARTLARI</h3>
                <p>2.1. Platformda sunulan paketler: 1 Ay Lansman Deneme (0 ₺), 3 Aylık Çeyrek Paket, 6 Aylık Yarı Yıl Paketi ve 9 Aylık Kurumsal Pakettir.</p>
                <p>2.2. Ödemeler kredi kartı (3D Secure), havale/EFT veya kurumsal sanal pos kanallarıyla peşin tahsil edilir. Faturalar ödeme teyidinden sonra 7 iş günü içinde e-Fatura olarak iletilir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">MADDE 3 — CAYMA HAKKI VE TİCARİ İSTİSNALAR</h3>
                <p>3.1. İşbu sözleşme B2B (ticari işletmeler arası) nitelikte olup, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki tüketici cayma hükümleri uygulanmaz.</p>
                <p>3.2. Dijital erişim ve yazılım hizmeti anında aktive edildiğinden, aktive edilen döneme ait abonelik bedellerinde kısmi iade yapılmaz; sonraki dönem yenilemesi istenirse iptal edilebilir.</p>
              </section>
            </div>
          </article>

          <!-- 6. ÇEREZ POLİTİKASI (COOKIE POLICY) -->
          <article v-if="activeTab === 'cerezler'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '6. Çerez ve Takip Teknolojileri Politikası' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — ÇEREZLERİN KULLANIM AMACI</h3>
                <p>1.1. Platformumuzda kullanıcı deneyimini iyileştirmek, oturum güvenliğini sağlamak, canlı eksiltme esnasında veri bütünlüğünü korumak ve tercihlerinizi hatırlamak amacıyla çerezler (cookies) kullanılmaktadır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — KULLANILAN ÇEREZ TÜRLERİ</h3>
                <p>2.1. <strong>Zorunlu Çerezler:</strong> Kullanıcı girişi, oturum kimlik doğrulaması ve CSRF güvenlik tokenları için şart olan teknik çerezlerdir; kapatılamaz.</p>
                <p>2.2. <strong>İşlevsel Çerezler:</strong> Dil tercihi (TR/EN), filtreleme kriterleri ve arayüz kişiselleştirme ayarlarını saklar.</p>
                <p>2.3. <strong>Performans & Analitik Çerezleri:</strong> Sayfa yükleme hızları, hata logları ve sistem yanıt sürelerini ölçümleyerek kesintisiz ihale deneyimi sunmamızı sağlar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 3 — ÇEREZLERİN YÖNETİMİ VE ENGELLENMESİ</h3>
                <p>3.1. Tarayıcınızın ayarlar menüsünden (Chrome, Edge, Safari, Firefox) çerez izinlerini dilediğiniz zaman değiştirebilir veya silebilirsiniz.</p>
                <p>3.2. Zorunlu çerezlerin engellenmesi durumunda ihale paneline giriş yapılamayabilir ve canlı teklif verme fonksiyonları devre dışı kalabilir.</p>
              </section>
            </div>
          </article>

          <!-- 7. TEDARİKÇİ DOĞRULAMA (SUPPLIER KYC CHARTER) -->
          <article v-if="activeTab === 'tedarikci-uyum'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '7. Tedarikçi Kalifikasyonu, Uyum ve KYC Beyannamesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">STANDART 1 — BELGE DOĞRULAMA ŞARTLARI</h3>
                <p>1.1. İhaleciBurada'da "Mavi Onaylı Tedarikçi" statüsü almak için aşağıdaki resmi evrakların yüklenmesi zorunludur:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Güncel Vergi Levhası (Son takvim yılı onaylı)</li>
                  <li>Ticaret Sicil Gazetesi kuruluşu ve son pay dağılım nüshası</li>
                  <li>Şirket yetkililerine ait Noter Onaylı İmza Sirküleri</li>
                  <li>İlgili Ticaret / Sanayi Odası Faaliyet Belgesi (Son 6 ay)</li>
                </ul>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">STANDART 2 — TİCARİ ETİK VE ÇEVRESEL UYUM</h3>
                <p>2.1. Tedarikçiler; çocuk işçi çalıştırmama, çevre mevzuatına uyum, iş sağlığı ve güvenliği standartları ile rüşvet/yolsuzlukla mücadele ilkelerine tam uyum sağlayacağını taahhüt eder.</p>
                <p>2.2. Sahte ürün, kusurlu malzeme veya şartnameye aykırı sevkiyat yapan firmaların rozeti iptal edilir ve sistem geneline ihlal kaydı işlenir.</p>
              </section>
            </div>
          </article>

          <!-- 8. SLA (SERVICE LEVEL AGREEMENT) -->
          <article v-if="activeTab === 'sla'" class="space-y-6">
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '8. Servis Seviyesi Taahhüdü ve Sistem Kesintisizliği (SLA)' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 1 — %99.9 ERİŞİLEBİLİRLİK TAAHHÜDÜ</h3>
                <p>1.1. İhaleciBurada, e-ihale motorları, teklif kabul sunucuları ve Escrow ödeme ağ geçitlerinin aylık takvim bazında en az <strong>%99.9</strong> kesintisiz çalışacağını taahhüt eder.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BÖLÜM 2 — DESTEK VE MÜDAHALE SÜRELERİ</h3>
                <p>2.1. <strong>Kritik Seviye 1 (İhale veya ödeme motoru durması):</strong> Müdahale süresi &lt; 15 dakika, çözüm süresi &lt; 2 saat.</p>
                <p>2.2. <strong>Yüksek Seviye 2 (Tekil sayfa veya raporlama hatası):</strong> Müdahale süresi &lt; 1 saat, çözüm süresi &lt; 6 saat.</p>
                <p>2.3. <strong>Normal Seviye 3 (Genel soru ve kullanım desteği):</strong> Mesai saatleri içinde &lt; 2 saat içinde geri dönüş.</p>
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
                <h3 class="font-bold text-slate-900 text-sm">İLKE 1 — BİLGİ GÜVENLİĞİ YÖNETİM SİSTEMİ (BGYS)</h3>
                <p>1.1. İhaleciBurada altyapısı, ISO/IEC 27001:2022 uluslararası bilgi güvenliği yönetim standardına tam uyumlu olarak işletilmektedir.</p>
                <p>1.2. Ticari sırların gizliliği, ihale verilerinin bütünlüğü ve sistem erişilebilirliği periyodik bağımsız sızma testleri (pentest) ile denetlenir.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">İLKE 2 — ERİŞİM KONTROLÜ VE İKİ ADIMLI DOĞRULAMA (2FA)</h3>
                <p>2.1. Tüm kurumsal panel girişlerinde SMS OTP ve e-Devlet kimlik doğrulama katmanları desteklenmektedir.</p>
                <p>2.2. Veritabanı şifreleri, API gizli anahtarları ve kullanıcı oturumları HSM (Hardware Security Module) standartlarında korunur.</p>
              </section>
            </div>
          </article>

          <!-- 10. GÜVENLİ HAVUZ (ESCROW) VE PAZARYERİ ÖDEME ARACILIK SÖZLEŞMESİ -->
          <article v-if="activeTab === 'escrow'" class="space-y-6">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-bold rounded-lg border border-emerald-200">TCMB & BDDK UYUMLU</span>
              <span class="text-xs text-slate-400">Son Güncelleme: 2026.08</span>
            </div>

            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              {{ '10. B2B Pazaryeri Güvenli Havuz (Escrow) ve Ödeme Aracılık Sözleşmesi' }}
            </h1>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">1. TARAFLAR VE SÖZLEŞMENİN AMACI</h3>
                <p>1.1. İşbu Sözleşme, İhaleciBurada platformu üzerinden ihale açan Alıcılar, teklif veren Tedarikçiler ve platform işleticisi arasında, 6493 Sayılı Ödeme ve Menkul Kıymet Mutabakat Sistemleri, Ödeme Hizmetleri ve Elektronik Para Kuruluşları Hakkında Kanun kapsamında akdedilmiştir.</p>
                <p>1.2. Platform, BDDK ve TCMB lisanslı yetkili ödeme kuruluşları (İyzico, PayTR vb.) ile entegre çalışarak Güvenli Havuz (Escrow) ve Otomatik Para Bölme (Split Payment) altyapısını sağlar.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">2. GÜVENLİ HAVUZ (ESCROW) İŞLEYİŞİ</h3>
                <p>2.1. İhalede mutabakat sağlandığında, Alıcı sipariş bedelini kredi kartı veya B2B Sanal IBAN ile lisanslı ödeme havuzuna yatırır. Tutar, lisanslı kuruluş güvencesinde bloke edilir.</p>
                <p>2.2. Tedarikçi, malı veya hizmeti şartnameye uygun olarak sevk eder ve sevk irsaliyesi/kargo takip belgesini sisteme yükler.</p>
                <p>2.3. Alıcı mal kabulünü onayladığında havuzdaki bloke çözülür; platform komisyonu kesildikten sonra kalan hakediş tutarı otomatik olarak Tedarikçinin banka IBAN hesabına aktarılır.</p>
              </section>

              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">3. UYUŞMAZLIK VE HAKEM HEYETİ İNCELEMESİ</h3>
                <p>3.1. Teslim edilen malların şartnameye aykırı, hasarlı veya eksik olması durumunda Alıcı "Uyuşmazlık" bildirebilir. Bu durumda havuzdaki bloke çözülmez ve İhaleciBurada Escrow Hakem Heyeti inceleme başlatır.</p>
              </section>
            </div>
          </article>

          <!-- 11. HAKKIMIZDA & VİZYON -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ 'Hakkımızda, Misyon ve Vizyonumuz' }}</h1>
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              {{ 'İhaleciBurada, Türkiye genelindeki kurumsal satın alma ve tedarik operasyonlarını şeffaf, rekabetçi ve tamamen dijital bir borsaya dönüştürmek amacıyla kurulmuş yeni nesil B2B e-ihale platformudur.' }}
            </p>

            <div class="space-y-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-900 text-sm">BİZ KİMİZ?</h3>
                <p>İnşaat, sanayi, lojistik, teknoloji ve kurumsal sarf sektörlerinde faaliyet gösteren binlerce onaylı üretici ve alıcı firmayı tek bir dijital platformda buluşturuyoruz. Geleneksel Excel tabloları ve e-posta karmaşası yerine, zaman damgalı tersine açık eksiltme ve Escrow güvenli havuz altyapısıyla satın alma maliyetlerinde ortalama <strong>%14.2</strong> net tasarruf sağlıyoruz.</p>
              </section>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                  <span class="text-[10px] font-black uppercase text-blue-700 tracking-wider">MİSYONUMUZ</span>
                  <h4 class="text-xs font-black text-slate-900">Adil & Şeffaf Satın Alma</h4>
                  <p class="text-[11px] text-slate-600">Her büyüklükteki şirketin en kaliteli tedarikçilere en uygun piyasa fiyatıyla zahmetsizce ulaşmasını sağlamak.</p>
                </div>

                <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <span class="text-[10px] font-black uppercase text-emerald-700 tracking-wider">VİZYONUMUZ</span>
                  <h4 class="text-xs font-black text-slate-900">B2B Ticaretin Borsası</h4>
                  <p class="text-[11px] text-slate-600">Avrasya ve Türkiye bölgesinin en güvenilir ve en yüksek hacimli dijital tedarik ve ihale borsası olmak.</p>
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
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
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
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
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
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
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
            
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
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
