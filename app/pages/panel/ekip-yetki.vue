<script setup lang="ts">
import { ref } from 'vue'
import { Check, ShieldAlert, Sparkles, ArrowRight, Download, UserPlus } from 'lucide-vue-next'

definePageMeta({
  layout: "dashboard"
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto text-left space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style="border-color: #F1F5F9;">
      <div>
        <h1 class="text-2xl font-black text-slate-800" style="color: #0F172A;">Ekip & Yetki Merkezi</h1>
        <p class="text-xs text-slate-500 mt-1">Çalışan rollerini, yetki politikalarını ve denetim kayıtlarını tek ekrandan yönetin.</p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button 
          type="button"
          class="flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition" 
          style="border-color: #E2E8F0;"
        >
          <Download :size="13" />
          Tüm Ekibi Dışa Aktar
        </button>
        <button 
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600/50 cursor-not-allowed text-white font-bold text-xs px-5 py-3 shadow transition"
          disabled
        >
          <UserPlus :size="14" />
          Çalışan Ekle
        </button>
      </div>
    </div>

    <!-- Pricing / Upgrade Wall Card -->
    <div class="rounded-2xl border bg-white p-6 shadow-sm grid grid-cols-1 lg:grid-cols-5 gap-8" style="border-color: #E2E8F0;">
      
      <!-- Left Info Upgrade Wall -->
      <div class="lg:col-span-3 space-y-5 flex flex-col justify-between">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
            <Sparkles :size="10" /> KURUMSAL PAKET
          </span>
          <h2 class="text-xl font-black text-slate-800 leading-tight">
            Ekip ve yetki yönetimi Kurumsal pakete özel
          </h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            Ekip üyelerini davet et, rolleri ince ayarla ve kim-ne-yaptı denetim kayıtlarını oku. Bu sayfayı çalışır hale getirmek için Kurumsal pakete ihtiyacın var.
          </p>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-100">
          <div class="flex flex-wrap gap-3">
            <NuxtLink 
              to="/abonelik"
              class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow transition"
            >
              Kurumsal Pakete Yükselt
              <ArrowRight :size="13" />
            </NuxtLink>
            <NuxtLink 
              to="/abonelik"
              class="inline-flex items-center gap-1.5 rounded-xl border px-5 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition"
              style="border-color: #E2E8F0;"
            >
              Tüm paketleri karşılaştır
            </NuxtLink>
          </div>

          <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            Mevcut paketin: 
            <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold lowercase first-letter:uppercase">Profesyonel</span>
          </div>
        </div>
      </div>

      <!-- Right Perks Details List -->
      <div class="lg:col-span-2 rounded-xl bg-slate-50 border p-5 space-y-4" style="border-color: #F1F5F9;">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider block">BU PAKETLE NE ALIYORSUN</span>
        
        <div class="space-y-3">
          
          <div class="flex items-start gap-2.5">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 mt-0.5">
              <Check :size="11" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Sınırsız ekip üyesi</h4>
              <p class="text-[10px] text-slate-400 leading-normal">Kurumsal pakette ekip büyüklüğünde alt veya üst sınır yok.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 mt-0.5">
              <Check :size="11" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Rol bazlı yetkilendirme</h4>
              <p class="text-[10px] text-slate-400 leading-normal">Yönetici, editör ve görüntüleyen rolleriyle her çalışanın erişim alanını kontrol et.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 mt-0.5">
              <Check :size="11" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Aktivite denetimi</h4>
              <p class="text-[10px] text-slate-400 leading-normal">Kim kimi davet etti, kim yetki değiştirdi — hepsi zaman damgalı kayıt altında.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 mt-0.5">
              <Check :size="11" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">Toplu davet ve rol atama</h4>
              <p class="text-[10px] text-slate-400 leading-normal">Birden çok çalışanı tek seferde davet et, rolleri toplu ata.</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0 mt-0.5">
              <Check :size="11" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">CSV ve Excel dışa aktarımı</h4>
              <p class="text-[10px] text-slate-400 leading-normal">Üyeleri ve aktivite kayıtlarını raporlamak için tek tuşla indir.</p>
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>
