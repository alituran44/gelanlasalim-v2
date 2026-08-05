<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileText, Shield, Info, Briefcase, Award, Users, BookOpen, ArrowLeft } from 'lucide-vue-next'
import { locale, detectLocale, t } from '~/composables/useLocale'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()

type TabKey = 'hakkimizda' | 'kvkk' | 'kullanim' | 'gizlilik' | 'kariyer' | 'is-ortakligi' | 'blog'

const activeTab = ref<TabKey>('kvkk')

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
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left font-sans">
    <div class="max-w-6xl mx-auto">
      
      <!-- Back button -->
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6">
        <ArrowLeft :size="14" />
        {{ locale === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home' }}
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar Navigation (3 cols) -->
        <div class="lg:col-span-3 space-y-2">
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-sm">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">{{ locale === 'tr' ? 'BİLGİ MERKEZİ' : 'INFORMATION CENTER' }}</div>
            
            <button 
              @click="setTab('hakkimizda')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'hakkimizda' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Info :size="14" />
              {{ locale === 'tr' ? 'Hakkımızda' : 'About Us' }}
            </button>

            <button 
              @click="setTab('kvkk')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kvkk' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              {{ locale === 'tr' ? 'KVKK Aydınlatma' : 'Privacy & KVKK' }}
            </button>

            <button 
              @click="setTab('kullanim')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kullanim' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              {{ locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Service' }}
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'gizlilik' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              {{ locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy' }}
            </button>

            <button 
              @click="setTab('kariyer')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kariyer' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Briefcase :size="14" />
              {{ locale === 'tr' ? 'Kariyer Fırsatları' : 'Careers' }}
            </button>

            <button 
              @click="setTab('is-ortakligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'is-ortakligi' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Award :size="14" />
              {{ locale === 'tr' ? 'İş Ortaklığı' : 'Partnership' }}
            </button>

            <button 
              @click="setTab('blog')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'blog' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <BookOpen :size="14" />
              {{ locale === 'tr' ? 'Blog & Basın' : 'Blog & Press' }}
            </button>
          </div>
        </div>

        <!-- Content Area (9 cols) -->
        <main class="lg:col-span-9 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm min-h-[500px]">
          
          <!-- HAKKIMIZDA -->
          <article v-if="activeTab === 'hakkimizda'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Biz Kimiz?</h1>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              GelAnlaşalım, kurumsal satın alma süreçlerini şeffaf, rekabetçi ve tamamen dijital hale getirmek amacıyla kurulmuş yeni nesil bir B2B e-ihale platformudur.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <h3 class="text-xs font-bold text-slate-800">Vizyonumuz</h3>
                <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">Şirketler arası ticarette zaman kaybını sıfırlamak, maliyet kontrolünü yapay zeka gücüyle optimize etmek ve her işletmeye adil pazar erişimi sağlamak.</p>
              </div>
              <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <h3 class="text-xs font-bold text-slate-800">Misyonumuz</h3>
                <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">Geleneksel teklif toplama süreçlerinin getirdiği e-posta trafiği ve teklif karşılaştırma zorluklarını ortadan kaldırarak akıllı ters ihale altyapısını Türkiye genelinde yaygınlaştırmak.</p>
              </div>
            </div>
          </article>

          <!-- KVKK -->
          <article v-if="activeTab === 'kvkk'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">KVKK Aydınlatma Metni</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, GelAnlaşalım olarak, veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine ve gizliliğine büyük önem vermekteyiz.
            </p>
            <div class="space-y-4 text-xs text-slate-600 font-medium">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">1. Hangi Verileri İşliyoruz?</h3>
                <p class="leading-relaxed">Platformumuza üye olurken paylaştığınız Ad, Soyad, E-posta Adresi, Telefon Numarası, Temsil Edilen Şirket Bilgileri (Vergi No, Unvan, Adres) ve sisteme yüklenen kurumsal doğrulama belgeleri KVKK kapsamında işlenmektedir.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">2. Veri İşleme Amaçları</h3>
                <p class="leading-relaxed">Kişisel verileriniz, üyelik kayıt işlemlerinin tamamlanması, kurumsal firma doğrulaması, ihale tekliflerinin doğru yetkililerle eşleştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">3. Veri Güvenliği Önlemleri</h3>
                <p class="leading-relaxed">Verileriniz TLS 1.2+ şifreli iletişim kanalları üzerinden iletilmekte olup, KVKK standartlarına uygun veri merkezlerinde güvenlik duvarları ile korunarak saklanmaktadır.</p>
              </section>
            </div>
          </article>

          <!-- KULLANIM KOŞULLARI -->
          <article v-if="activeTab === 'kullanim'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Kullanım Koşulları</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              GelAnlaşalım platformunu ziyaret ederek veya üye olarak bu belgede yer alan kullanım şartlarını kabul etmiş sayılırsınız.
            </p>
            <div class="space-y-4 text-xs text-slate-600 font-medium">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">1. Kurumsal Üyelik ve Yetki</h3>
                <p class="leading-relaxed">Platform sadece kurumsal kimliğe sahip şirketlerin kullanımı için tasarlanmıştır. Üye olan her kullanıcı, temsil ettiği şirketi hukuki olarak bağlama yetkisine sahip olduğunu taahhüt eder.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">2. İhale Kuralları ve Teklif Verme</h3>
                <p class="leading-relaxed">Tedarikçi firmaların ihalelere verdikleri teklifler hukuki olarak bağlayıcı niteliktedir. Belirlenen ihale kurallarına ve eksiltme standartlarına uymak tüm tarafların sorumluluğundadır.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">3. İçerik ve Fikri Mülkiyet</h3>
                <p class="leading-relaxed">GelAnlaşalım logosu, yazılım kodları, tasarımı ve tescilli markası üzerindeki tüm haklar GelAnlaşalım Bilişim A.Ş.'ye aittir. Yazılı izin olmadan kopyalanamaz veya kullanılamaz.</p>
              </section>
            </div>
          </article>

          <!-- GİZLİLİK POLİTİKASI -->
          <article v-if="activeTab === 'gizlilik'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Gizlilik Politikası</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              Bu Gizlilik Politikası, GelAnlaşalım platformunu kullanırken toplanan kurumsal ve bireysel verilerinizin nasıl yönetildiğini açıklamaktadır.
            </p>
            <div class="space-y-4 text-xs text-slate-600 font-medium">
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">1. Bilgi Toplama ve Kullanım</h3>
                <p class="leading-relaxed">İhale sürecinin sağlıklı ilerleyebilmesi için firmaların unvanı, referansları ve yetkili iletişim bilgileri toplanır. Bu bilgiler sadece ilgili satın alma ve teklif süreçlerinin yürütülmesi amacıyla kullanılır.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">2. Çerezler (Cookies)</h3>
                <p class="leading-relaxed">Platformda oturum yönetimini sağlamak ve kullanıcı deneyimini özelleştirmek amacıyla teknik çerezler kullanılmaktadır. Tarayıcınızdan çerez tercihlerini dilediğiniz gibi güncelleyebilirsiniz.</p>
              </section>
              <section class="space-y-2">
                <h3 class="font-bold text-slate-800">3. Üçüncü Şahıslarla Paylaşım</h3>
                <p class="leading-relaxed">Toplanan hiçbir ticari veri veya kullanıcı bilgisi, mahkeme kararları ve yasal zorunluluklar haricinde hiçbir üçüncü şahıs veya reklam ağıyla paylaşılmaz.</p>
              </section>
            </div>
          </article>

          <!-- KARİYER -->
          <article v-if="activeTab === 'kariyer'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Kariyer Fırsatları</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              B2B ticaretin geleceğini şekillendiren vizyoner ekibimize katılmak ister misiniz? Sürekli büyüyen yapımızda yetenekli takım arkadaşları arıyoruz.
            </p>
            <div class="space-y-4">
              <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
                <div class="flex justify-between items-center">
                  <h4 class="text-xs font-bold text-slate-800">Kıdemli Arayüz Geliştirici (Nuxt.js / Vue)</h4>
                  <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">TAM ZAMANLI / HİBRİT</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">Nuxt 3 ve Tailwind CSS ekosistemine hakim, görsel detaylara ve performans optimizasyonlarına önem veren geliştirici arayışımız bulunmaktadır.</p>
              </div>
              
              <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
                <div class="flex justify-between items-center">
                  <h4 class="text-xs font-bold text-slate-800">Kurumsal Satış Yöneticisi</h4>
                  <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">MASAÜSTÜ / BALIKESİR</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">B2B SaaS satış tecrübesine sahip, şirketler arası ihale süreçleri ve kurumsal iş geliştirme konularında tecrübeli adaylar aramaktayız.</p>
              </div>
            </div>
          </article>

          <!-- İŞ ORTAKLIĞI -->
          <article v-if="activeTab === 'is-ortakligi'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">İş Ortaklığı Programı</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              GelAnlaşalım ekosistemini büyüterek gelir elde etmeye ne dersiniz? Kurumsal danışmanlar ve iş geliştiriciler için hazırladığımız özel gelir paylaşım ortaklığı programımız yayında.
            </p>
            <div class="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3 text-xs text-slate-600 font-medium">
              <h3 class="font-bold text-slate-800">Nasıl Çalışır?</h3>
              <p>1. İş ortağı olarak kayıt olun ve size özel tavsiye linkinizi alın.</p>
              <p>2. Satın alma yapan şirketleri veya kurumsal tedarikçileri platforma davet edin.</p>
              <p>3. Davet ettiğiniz firmaların premium paket aktivasyonlarından **%20 sürekli komisyon** kazanın.</p>
              <div class="pt-2">
                <a href="mailto:info@gelanlasalim.com" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                  Başvuru için iletişime geçin ->
                </a>
              </div>
            </div>
          </article>

          <!-- BLOG -->
          <article v-if="activeTab === 'blog'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">{{ locale === 'tr' ? 'Blog & Makaleler' : 'Blog & Articles' }}</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              {{ locale === 'tr' ? 'Satın alma operasyonlarınızı verimli hale getirecek ipuçları ve sektörel analizler.' : 'Insights, tips, and industry analyses to streamline your B2B procurement operations.' }}
            </p>
            <div class="space-y-4">
              <div class="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="h-14 w-14 bg-blue-100 text-blue-700 flex items-center justify-center rounded-xl font-mono text-[9px] font-black uppercase shrink-0">B2B</div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Tersine İhale ile Tedarik Tasarrufunuzu Nasıl %14 Artırırsınız?' : 'How to Increase Procurement Savings by 14% via Reverse Auctions' }}</h4>
                  <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">{{ locale === 'tr' ? 'Geleneksel pazarlık süreçlerini geride bırakarak rekabet arenaları ile tasarrufu katlamanın formülü.' : 'Formula for multiplying cost savings using competitive live bidding arenas.' }}</p>
                </div>
              </div>
              <div class="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="h-14 w-14 bg-blue-100 text-blue-700 flex items-center justify-center rounded-xl font-mono text-[9px] font-black uppercase shrink-0">EKAP</div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'Kamu İhale Standartlarının Özel Sektör Satın Almalarına Entegrasyonu' : 'Integrating Public Procurement Standards into B2B Purchases' }}</h4>
                  <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">{{ locale === 'tr' ? 'Ekap sistemindeki şeffaflık ilkelerini şirket içi B2B satın alma akışlarında kullanma yöntemleri.' : 'Best practices for leveraging public transparency principles in corporate B2B purchasing.' }}</p>
                </div>
              </div>
            </div>
          </article>

          <!-- BASIN ODASI -->
          <article v-if="activeTab === 'basin'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">{{ locale === 'tr' ? 'Basın Odası & Görseller' : 'Press Room & Media Kit' }}</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              {{ locale === 'tr' ? 'GelAnlaşalım hakkında basın bültenleri, haberler ve resmi logo/medya kiti varlıkları.' : 'Press releases, news coverage, and official brand logo/media kit assets.' }}
            </p>
            <div class="space-y-4">
              <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
                <span class="text-[9px] font-black text-blue-600 uppercase tracking-wider block">BASIN BÜLTENİ · 2026</span>
                <h4 class="text-xs font-bold text-slate-800">{{ locale === 'tr' ? 'GelAnlaşalım: Özel Sektörün Canlı Ters İhale Arenası Açıldı' : 'GelAnlaşalım Launch: B2B Live Reverse Auction Arena Goes Live' }}</h4>
                <p class="text-[11px] text-slate-500 leading-relaxed">{{ locale === 'tr' ? 'Balıkesir merkezli teknoloji şirketi GelAnlaşalım, kurumsal satın alma maliyetlerini düşüren dijital eksiltme platformunu yayına aldı.' : 'Tech platform GelAnlaşalım rolls out its digital reverse auction suite aimed at cutting corporate procurement costs.' }}</p>
              </div>
              
              <div class="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 class="font-bold text-slate-800">{{ locale === 'tr' ? 'Vektörel Logo & Medya Kiti (.ZIP)' : 'Vector Logos & Media Kit (.ZIP)' }}</h4>
                  <p class="text-[10px] text-slate-500 mt-0.5">{{ locale === 'tr' ? 'Yüksek çözünürlüklü amblem, logo ve kurumsal kimlik kılavuzu.' : 'High-resolution emblem, logos, and brand guidelines.' }}</p>
                </div>
                <a href="/logo.png" download class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl text-center transition">
                  {{ locale === 'tr' ? 'İndir (PNG / SVG)' : 'Download (PNG / SVG)' }}
                </a>
              </div>
            </div>
          </article>

        </main>
      </div>

    </div>
  </div>
</template>
