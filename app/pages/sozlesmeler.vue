<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileText, Shield, Info, Briefcase, Award, Users, BookOpen, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()

type TabKey = 'hakkimizda' | 'kvkk' | 'kullanim' | 'gizlilik' | 'kariyer' | 'is-ortakligi' | 'blog'

const activeTab = ref<TabKey>('kvkk')

onMounted(() => {
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
        Ana Sayfaya Dön
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar Navigation (3 cols) -->
        <div class="lg:col-span-3 space-y-2">
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 shadow-sm">
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">BİLGİ MERKEZİ</div>
            
            <button 
              @click="setTab('hakkimizda')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'hakkimizda' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Info :size="14" />
              Hakkımızda
            </button>

            <button 
              @click="setTab('kvkk')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kvkk' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              KVKK Aydınlatma
            </button>

            <button 
              @click="setTab('kullanim')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kullanim' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <FileText :size="14" />
              Kullanım Koşulları
            </button>

            <button 
              @click="setTab('gizlilik')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'gizlilik' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Shield :size="14" />
              Gizlilik Politikası
            </button>

            <button 
              @click="setTab('kariyer')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'kariyer' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Briefcase :size="14" />
              Kariyer Fırsatları
            </button>

            <button 
              @click="setTab('is-ortakligi')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'is-ortakligi' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <Award :size="14" />
              İş Ortaklığı
            </button>

            <button 
              @click="setTab('blog')"
              class="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition text-left"
              :class="activeTab === 'blog' ? 'bg-[#003057] text-white' : 'text-slate-600 hover:bg-slate-100'"
            >
              <BookOpen :size="14" />
              Blog & Basın
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

          <!-- BLOG & BASIN -->
          <article v-if="activeTab === 'blog'" class="space-y-6">
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Blog & Basın Odası</h1>
            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              Satın alma operasyonlarınızı verimli hale getirecek ipuçları ve platformumuz hakkında en güncel basın bültenleri.
            </p>
            <div class="space-y-4">
              <div class="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div class="h-16 w-16 bg-[#003057]/10 text-[#003057] flex items-center justify-center rounded-xl font-mono text-[9px] font-black uppercase shrink-0">B2B</div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Tersine İhale ile Tedarik Tasarrufunuzu Nasıl %14 Artırırsınız?</h4>
                  <p class="text-[10px] text-slate-400 mt-1">Geleneksel pazarlık süreçlerini geride bırakarak rekabet arenaları ile tasarrufu katlamanın formülü.</p>
                </div>
              </div>
              <div class="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div class="h-16 w-16 bg-[#003057]/10 text-[#003057] flex items-center justify-center rounded-xl font-mono text-[9px] font-black uppercase shrink-0">EKAP</div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Kamu İhale Standartlarının Özel Sektör Satın Almalarına Entegrasyonu</h4>
                  <p class="text-[10px] text-slate-400 mt-1">Ekap sistemindeki şeffaflık ilkelerini şirket içi B2B satın alma akışlarında kullanma yöntemleri.</p>
                </div>
              </div>
            </div>
          </article>

        </main>
      </div>

    </div>
  </div>
</template>
