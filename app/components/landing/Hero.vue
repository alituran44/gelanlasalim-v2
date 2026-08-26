<script setup lang="ts">
import { ArrowRight, ShieldCheck, Sparkles, Building2, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <section class="relative overflow-hidden bg-[#070F1E] text-white py-20">
    <div class="relative mx-auto max-w-7xl px-6">
      <div class="grid items-center gap-12 lg:grid-cols-2 text-left">
        <!-- Sol -->
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-black uppercase tracking-wider text-[#00C2FF]">
            <Sparkles :size="14" />
            <span>TCMB & BDDK UYUMLU KURUMSAL TEDARİK BORSASI</span>
          </div>

          <h1 class="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
            Binlerce Doğrulanmış Firmadan <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-emerald-400">Teklif Al</span>, Canlı Eksiltme ile Yarıştır.
          </h1>

          <p class="max-w-xl text-base text-slate-300 font-medium leading-relaxed">
            İhaleciBurada ile dijital ihale oluşturun, doğrulanmış B2B üreticilerden belgeli teklif toplayın ve güvenli havuz (Escrow) güvencesiyle satın alma maliyetlerinizi düşürün.
          </p>

          <div class="flex flex-wrap gap-4 pt-2">
            <NuxtLink to="/uyelik" class="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#0052FF] hover:bg-blue-600 font-black text-xs text-white shadow-xl shadow-blue-600/30 transition">
              <span>Hemen Başla</span>
              <ArrowRight :size="15" />
            </NuxtLink>
            <NuxtLink to="/panel" class="flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 font-black text-xs text-slate-200 hover:text-white transition">
              <span>Kurumsal Panel</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Sağ -->
        <div>
          <div class="rounded-3xl border border-slate-700 bg-[#0B1528] p-8 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 class="text-lg font-black text-white">Canlı İşlem Kokpiti</h2>
                <p class="text-xs text-slate-400">Gerçek Zamanlı İhale & Eksiltme Akışı</p>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
                <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Canlı Bağlantı</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <div class="text-xs text-slate-400 font-bold uppercase">Ortalama Tasarruf</div>
                <div class="mt-2 text-3xl font-black font-mono text-emerald-400">%14.2</div>
              </div>
              <div class="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <div class="text-xs text-slate-400 font-bold uppercase">Güvenli Havuz</div>
                <div class="mt-2 text-3xl font-black font-mono text-[#00C2FF]">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>