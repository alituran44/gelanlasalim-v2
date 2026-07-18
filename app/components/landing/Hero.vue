<script setup lang="ts">
import SearchBox from "./search/SearchBox.vue"
import Stats from "./sections/Stats.vue"
import AppButton from "~/components/ui/AppButton.vue"
</script>

<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50"
  >
    <!-- Background -->
    <div
      class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"
    />

    <div
      class="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl"
    />

    <div
      class="relative mx-auto max-w-7xl px-6 py-24"
    >

      <div
        class="grid items-center gap-20 lg:grid-cols-2"
      >

        <!-- SOL -->

        <div>

          <span
            class="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            🚀 Türkiye'nin Yeni Nesil Dijital İhale Platformu
          </span>

          <h1
            class="mt-8 text-5xl font-black leading-tight text-slate-900 lg:text-7xl"
          >
            Binlerce Firmadan

            <span class="text-blue-600">

              Teklif Al,

            </span>

            Dakikalar İçinde Karşılaştır.
          </h1>

          <p
            class="mt-8 max-w-xl text-xl leading-9 text-slate-600"
          >
            GelAnlaşalım ile dijital ihale oluştur,
            güvenilir firmalardan teklif al,
            fiyatları karşılaştır,
            en doğru kararı ver.
          </p>

          <div
            class="mt-10 flex flex-wrap gap-4"
          >

            <NuxtLink to="/register">

              <AppButton size="lg">

                Hemen Başla

              </AppButton>

            </NuxtLink>

            <NuxtLink to="/panel">

              <AppButton
                variant="secondary"
                size="lg"
              >

                Demo İncele

              </AppButton>

            </NuxtLink>

          </div>

          <div class="mt-14">

            <SearchBox />

          </div>

          <div class="mt-14">

            <Stats />

          </div>

        </div>

        <!-- SAĞ -->

        <div>

          <div
            class="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
          >

            <div
              class="mb-8 flex items-center justify-between"
            >

              <div>

                <h2
                  class="text-2xl font-bold"
                >
                  Dashboard
                </h2>

                <p
                  class="text-slate-500"
                >
                  Canlı Önizleme
                </p>

              </div>

              <div
                class="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
              >
                ● Online
              </div>

            </div>

            <div
              class="grid grid-cols-2 gap-5"
            >

              <div
                class="rounded-2xl bg-blue-600 p-5 text-white"
              >

                <div class="text-sm opacity-80">

                  Aktif İhale

                </div>

                <div class="mt-3 text-4xl font-black">

                  148

                </div>

              </div>

              <div
                class="rounded-2xl bg-emerald-500 p-5 text-white"
              >

                <div class="text-sm opacity-80">

                  Gelen Teklif

                </div>

                <div class="mt-3 text-4xl font-black">

                  324

                </div>

              </div>

            </div>

            <div
              class="mt-8 h-56 rounded-2xl bg-slate-100"
            >

              <div
                class="flex h-full items-center justify-center text-slate-400"
              >

                📈 Grafik Alanı

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
</template>