<script setup lang="ts">
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Award, 
  Scale, 
  FileText, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Server, 
  TrendingDown, 
  Users 
} from 'lucide-vue-next'
import PaymentBadges from '~/components/common/PaymentBadges.vue'

definePageMeta({
  layout: 'public'
})
</script>

<template>
  <div class="min-h-[calc(100vh-76px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left font-sans">
    <div class="max-w-6xl mx-auto space-y-12">

      <!-- HERO / HEADER -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-black uppercase tracking-wider">
          KURUMSAL ŞİRKET PROFİLİ & VİZYON
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Türkiye'nin Yeni Nesil B2B Canlı Eksiltme ve Ters İhale Arenası
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          İhaleciBurada; satın alma yapan kurumsal alıcılar ile onaylı B2B üretici ve tedarikçileri şeffaf, rekabetçi ve zaman damgalı canlı eksiltme müzayedelerinde buluşturan güvenli tedarik ekosistemidir.
        </p>
      </div>

      <!-- PAYTR & İYZİCO ONAYLI RESMİ ŞİRKET KÜNYESİ (MERCHANT REGISTRY) -->
      <div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest block">T.C. TİCARET SİCİLİNE VE VERGİ DAİRESİNE KAYITLI RESMİ ŞİRKET</span>
            <h2 class="text-xl font-black text-slate-900 mt-1">İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş.</h2>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 :size="14" />
              Faal & Doğrulanmış Tacir
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">Ticaret Unvanı</span>
            <p class="font-bold text-slate-900">İhaleciBurada Bilişim ve Elektronik Ticaret Platformu A.Ş.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">Vergi Dairesi & No (VKN)</span>
            <p class="font-bold text-slate-900 font-mono">Çanakkale V.D. / 4700854210</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">MERSİS Numarası</span>
            <p class="font-bold text-slate-900 font-mono">0470085421000001</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">Ticaret Sicil Numarası</span>
            <p class="font-bold text-slate-900 font-mono">14520 (Çanakkale TSO)</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">Resmi KEP Adresi</span>
            <p class="font-bold text-slate-900 font-mono">ihaleciburada@hs01.kep.tr</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase">Müşteri Destek & Çağrı</span>
            <p class="font-bold text-blue-700">0850 308 00 00 / ihalecib@gmail.com</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
          <MapPin :size="18" class="text-blue-600 shrink-0" />
          <div>
            <span class="text-[10px] font-black text-slate-400 uppercase block">Merkez Adres</span>
            <p class="font-bold text-slate-800">İsmetpaşa Mah. Büyük Hamam Sok. Taşöz Apt. No:52/1 Çanakkale, Türkiye</p>
          </div>
        </div>
      </div>

      <!-- SECURITY & SSL CERTIFICATION GUARANTEES -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
          <div class="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock :size="20" />
          </div>
          <h3 class="text-sm font-black text-slate-900">256-Bit SSL Sertifikası</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">
            Platformumuz üzerindeki tüm veri trafiği, oturum bilgileri ve ödeme işlemleri 256-Bit TLS 1.3 SSL şifreleme protokolü ile korunmaktadır.
          </p>
        </div>

        <div class="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
          <div class="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck :size="20" />
          </div>
          <h3 class="text-sm font-black text-slate-900">PayTR & iyzico 3D Secure</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">
            TCMB ve BDDK lisanslı ödeme geçitleri (PayTR ve iyzico) altyapısıyla kredi kartı bilgileriniz kaydedilmeden doğrudan banka SMS onayıyla tahsil edilir.
          </p>
        </div>

        <div class="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
          <div class="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Scale :size="20" />
          </div>
          <h3 class="text-sm font-black text-slate-900">6698 Sayılı KVKK Uyumu</h3>
          <p class="text-xs text-slate-600 leading-relaxed font-medium">
            Kişisel ve kurumsal ticari verileriniz Kişisel Verilerin Korunması Kanunu ve ISO 27001 Bilgi Güvenliği Standartlarına uygun olarak işlenir ve saklanır.
          </p>
        </div>
      </div>

      <!-- ACCEPTED PAYMENT METHODS & LOGOS STRIP -->
      <div class="rounded-3xl bg-[#0F223D] p-6 sm:p-8 text-white space-y-4 shadow-xl">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span class="text-[10px] font-black uppercase text-emerald-400 tracking-widest block">ÖDEME GÜVENLİĞİ VE KART ANLAŞMALARI</span>
            <h3 class="text-lg font-black text-white mt-1">Geçerli Ödeme Yöntemleri ve Kart Şemaları</h3>
          </div>
          <span class="text-xs text-slate-300 font-medium">3D Secure Zorunludur</span>
        </div>

        <div class="pt-2">
          <PaymentBadges />
        </div>
      </div>

      <!-- DIRECT ACCESS TO LEGAL CONTRACTS & POLICIES -->
      <div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 class="text-base font-black text-slate-900">Resmi Sözleşmeler ve Yasal Politikalar</h3>
        <p class="text-xs text-slate-500 font-medium">
          6563 Sayılı Elektronik Ticaret Kanunu ve Mesafeli Sözleşmeler Yönetmeliği uyarınca yürürlükteki tüm resmi belgelerimize aşağıdan ulaşabilirsiniz:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <NuxtLink to="/sozlesmeler?tab=on-bilgilendirme" class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-400 text-xs font-bold text-amber-950 flex items-center justify-between group transition">
            <span>Ön Bilgilendirme Formu</span>
            <ArrowRight :size="14" class="text-amber-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=mesafeli-satis" class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 text-xs font-bold text-blue-950 flex items-center justify-between group transition">
            <span>Mesafeli Satış Sözleşmesi</span>
            <ArrowRight :size="14" class="text-blue-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=iptal-iade" class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 text-xs font-bold text-emerald-950 flex items-center justify-between group transition">
            <span>İptal ve İade Koşulları</span>
            <ArrowRight :size="14" class="text-emerald-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=teslimat" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition">
            <span>Teslimat ve İfa Politikası</span>
            <ArrowRight :size="14" class="text-slate-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=gizlilik" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition">
            <span>Gizlilik & Güvenlik Politikası</span>
            <ArrowRight :size="14" class="text-slate-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=kvkk" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition">
            <span>KVKK Aydınlatma Metni</span>
            <ArrowRight :size="14" class="text-slate-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=kullanim" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition">
            <span>Kullanım Şartları (MSA)</span>
            <ArrowRight :size="14" class="text-slate-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>

          <NuxtLink to="/sozlesmeler?tab=cerezler" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center justify-between group transition">
            <span>Çerez (Cookie) Politikası</span>
            <ArrowRight :size="14" class="text-slate-600 group-hover:translate-x-0.5 transition" />
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
