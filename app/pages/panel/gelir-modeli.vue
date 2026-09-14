<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Percent, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Coins, 
  ArrowRight, 
  Receipt,
  FileText,
  Lock,
  Package,
  Building2,
  Sparkles,
  HelpCircle
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Komisyon Oranları & Kesinti Bilgisi | İhaleciBurada'
})

const { userSession } = useUserSession()

// Hesaplayıcı Durumu
const calcAmount = ref<number>(100000)
const selectedRole = ref<'seller' | 'buyer'>('seller')

const calcSellerCommission = computed(() => Math.round(calcAmount.value * 0.05))
const calcSellerVat = computed(() => Math.round(calcSellerCommission.value * 0.20))
const calcSellerTotalDeduction = computed(() => calcSellerCommission.value + calcSellerVat.value)
const calcSellerNetPayout = computed(() => Math.max(0, calcAmount.value - calcSellerCommission.value))

// Örnek Kullanıcı Hakediş / Kesinti Geçmişi
const userTransactions = ref([
  {
    id: 'İHL-2026-089',
    title: '400 Ton Nervürlü İnşaat Demiri Alımı',
    role: 'Satıcı (Tedarikçi)',
    tenderAmount: 420000,
    rate: 5,
    commissionAmount: 21000,
    netPayout: 399000,
    status: 'Tamamlandı (Hakediş Ödendi)',
    date: '10 Eylül 2026'
  },
  {
    id: 'İHL-2026-074',
    title: '50 Adet Kurumsal Dizüstü Bilgisayar & Monitör',
    role: 'Alıcı (Kurum)',
    tenderAmount: 285000,
    rate: 0,
    commissionAmount: 0,
    netPayout: 285000,
    status: 'Tamamlandı (%0 Masraf)',
    date: '02 Eylül 2026'
  },
  {
    id: 'İHL-2026-061',
    title: 'Fabrika Güneş Enerji Paneli ve Trafo Donanımı',
    role: 'Satıcı (Tedarikçi)',
    tenderAmount: 750000,
    rate: 5,
    commissionAmount: 37500,
    netPayout: 712500,
    status: 'Emanet Havuzunda (Teslimat Aşamasında)',
    date: '28 Ağustos 2026'
  }
])
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto text-left">
    
    <!-- Üst Başlık & Şeffaflık Güvencesi -->
    <div class="rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs relative overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2 max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck :size="14" />
              %100 ŞEFFAF VE SABİT KOMİSYON POLİTİKASI
            </span>
            <span class="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              ALICILARA %0 MASRAF
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Coins class="text-emerald-500 shrink-0" :size="30" />
            Komisyon Oranları & Kesinti Bilgisi
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            İhaleciBurada platformunda gizli ücret, aidat veya peşin listeleme masrafı yoktur. 
            Alıcı kurumlar tüm satın alma süreçlerini <strong>sıfır maliyetle (%0)</strong> yürütür; kazanan tedarikçi firmalar ise yalnızca mal veya hizmet teslimatı alıcı tarafından onaylandığında <strong>sabit net %5 başarı bedeli</strong> öder.
          </p>
        </div>

        <!-- Özet Oran Rozet Kartı -->
        <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div class="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Percent :size="24" />
          </div>
          <div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Geçerli Başarı Oranı</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white font-mono">
              %5 <span class="text-xs font-semibold text-slate-400">Sabit</span>
            </div>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Yalnızca Onaylanan Teslimatta</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Temel İlke Kartı (Net ve Sade) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      <!-- İlke 1: Alıcı -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
          %0
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Alıcı Şirketler İçin %0 Masraf</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            İhale açmak, şartname yayınlamak, teklif toplamak ve satıcı seçmek tamamen ücretsizdir. Alıcılardan hiçbir aşamada komisyon kesilmez.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Sınırsız ihale açma</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Sıfır üyelik ve aidat maliyeti</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-emerald-500 shrink-0" /> Doğrulanmış üreticilere doğrudan erişim</li>
        </ul>
      </div>

      <!-- İlke 2: Satıcı -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
          %5
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Satıcılar İçin Sabit %5 Başarı Komisyonu</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            İhalelere teklif vermek ücretsizdir. Komisyon sadece ihale kazanılıp alıcı malı/hizmeti teslim aldığında hakediş tutarından kesilir.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Yalnızca kazandığınızda ödeme</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Sektörden bağımsız sabit %5 kuralı</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-blue-500 shrink-0" /> Resmi e-Fatura / e-Arşiv kesintisi</li>
        </ul>
      </div>

      <!-- İlke 3: Sıfır Risk -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
          <Lock :size="18" />
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white">Kayıp / İptal Durumunda Sıfır Risk</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Kazanamadığınız, alıcı tarafından iptal edilen veya mutabakat sağlanamayan ihaleler için hiçbir bedel ödemezsiniz.
          </p>
        </div>
        <ul class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Başarısız tekliflerde 0 ₺ kesinti</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Lisanslı ödeme havuzu güvencesi</li>
          <li class="flex items-center gap-1.5"><CheckCircle2 :size="13" class="text-purple-500 shrink-0" /> Sürpriz ek maliyet veya ceza yok</li>
        </ul>
      </div>

    </div>

    <!-- Hızlı Şeffaf Hakediş & Kesinti Hesaplayıcı -->
    <div class="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator class="text-blue-600" :size="20" />
            Canlı Komisyon & Net Hakediş Hesaplayıcı
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            İhale tutarını girerek hesabınıza geçecek net tutarı ve platform komisyonunu anında hesaplayın.
          </p>
        </div>

        <!-- Rol Seçici -->
        <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
          <button 
            type="button" 
            @click="selectedRole = 'seller'" 
            class="px-3 py-1.5 rounded-lg transition cursor-pointer"
            :class="selectedRole === 'seller' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            Tedarikçi (Satıcı) Gözüyle
          </button>
          <button 
            type="button" 
            @click="selectedRole = 'buyer'" 
            class="px-3 py-1.5 rounded-lg transition cursor-pointer"
            :class="selectedRole === 'buyer' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          >
            Satın Alıcı Gözüyle
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <!-- Giriş Alanı -->
        <div class="lg:col-span-5 space-y-4">
          <div>
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              İhale / Sipariş Bedeli (₺)
            </label>
            <div class="relative">
              <input 
                v-model.number="calcAmount" 
                type="number" 
                step="5000"
                min="1000"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-base font-black font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 font-mono">₺</span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <button 
                v-for="amt in [50000, 100000, 250000, 500000, 1000000]" 
                :key="amt"
                type="button"
                @click="calcAmount = amt"
                class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
              >
                {{ (amt / 1000) }}K ₺
              </button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
            <div class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Lock :size="13" class="text-blue-600" />
              TCMB Lisanslı Havuz Güvencesi:
            </div>
            <p>
              Tutar alıcı tarafından yatırıldığında lisanslı banka havuzunda bloke edilir. Siz şartnameye uygun malı/hizmeti teslim edip alıcı onay verene kadar hiçbir kesinti veya para transferi gerçekleşmez.
            </p>
          </div>
        </div>

        <!-- Sonuç Kartları (Satıcı Gözüyle) -->
        <div v-if="selectedRole === 'seller'" class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
            <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Platform Hizmet Bedeli (%5)</span>
            <div class="text-2xl font-black font-mono text-blue-700 dark:text-blue-400">
              {{ calcSellerCommission.toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">+ KDV (Faturanız sistemden iletilir)</p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Hesabınıza Aktarılacak Net Tutar (%95)</span>
            <div class="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {{ calcSellerNetPayout.toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Mal kabul onayında doğrudan IBAN'ınıza aktarılır</p>
          </div>

          <div class="sm:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
            <span class="text-slate-600 dark:text-slate-400">Başarısız / Kazanılamayan İhalelerde Kesinti:</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-mono font-bold">0,00 ₺ (%0 Komisyon)</strong>
          </div>
        </div>

        <!-- Sonuç Kartları (Alıcı Gözüyle) -->
        <div v-else class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Alıcı Komisyon Bedeli</span>
            <div class="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              0,00 ₺ (%0)
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Alıcı firmalardan hiçbir komisyon alınmaz</p>
          </div>

          <div class="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
            <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Toplam Ödeyeceğiniz Tutar</span>
            <div class="text-2xl font-black font-mono text-blue-700 dark:text-blue-400">
              {{ Number(calcAmount).toLocaleString('tr-TR') }} ₺
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Yalnızca ihalede kabul ettiğiniz mal bedeli</p>
          </div>

          <div class="sm:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
            <span class="text-slate-600 dark:text-slate-400">Platform İhale Açma & Şartname Masrafı:</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Tamamen Ücretsiz (0 ₺)</strong>
          </div>
        </div>

      </div>
    </div>

    <!-- Hakediş & Sipariş Dökümü (Şeffaf Tablo) -->
    <div class="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt class="text-emerald-500" :size="18" />
            İhale Hakediş & Kesinti Dökümüm
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sonuçlanan işlemlerinizde uygulanan resmi komisyon oranları ve net hakediş durumları.
          </p>
        </div>

        <NuxtLink 
          to="/panel/siparis-teslimat" 
          class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Tüm Escrow İşlemlerini Gör</span>
          <ArrowRight :size="14" />
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <th class="py-3 px-3">İhale No & Başlık</th>
              <th class="py-3 px-3">Rol</th>
              <th class="py-3 px-3 text-right">İşlem Tutarı</th>
              <th class="py-3 px-3 text-center">Komisyon Oranı</th>
              <th class="py-3 px-3 text-right">Kesinti Tutarı</th>
              <th class="py-3 px-3 text-right">Net Hakediş</th>
              <th class="py-3 px-3 text-right">Durum</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr v-for="t in userTransactions" :key="t.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
              <td class="py-3.5 px-3">
                <div class="font-bold text-slate-900 dark:text-white">{{ t.title }}</div>
                <div class="text-[10px] font-mono text-slate-400">{{ t.id }} · {{ t.date }}</div>
              </td>
              <td class="py-3.5 px-3">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="t.role.includes('Alıcı') ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'"
                >
                  {{ t.role }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                {{ t.tenderAmount.toLocaleString('tr-TR') }} ₺
              </td>
              <td class="py-3.5 px-3 text-center font-mono font-bold" :class="t.rate === 0 ? 'text-emerald-600' : 'text-blue-600'">
                %{{ t.rate }}
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-bold" :class="t.commissionAmount === 0 ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'">
                {{ t.commissionAmount > 0 ? '-' + t.commissionAmount.toLocaleString('tr-TR') + ' ₺' : '0 ₺' }}
              </td>
              <td class="py-3.5 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                {{ t.netPayout.toLocaleString('tr-TR') }} ₺
              </td>
              <td class="py-3.5 px-3 text-right">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ t.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alt Bilgilendirme & Yasal Dayanak -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
      <div class="flex items-center gap-2">
        <FileText :size="16" class="text-blue-600 shrink-0" />
        <span>Tüm komisyon ve hakediş kuralları <strong>Platform Aracılık Sözleşmesi (6563 SK Md. 9)</strong> kapsamında güvence altındadır.</span>
      </div>
      <NuxtLink 
        to="/sozlesmeler?tab=aracilik" 
        class="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
      >
        Yasal Şartları İncele →
      </NuxtLink>
    </div>

  </div>
</template>
