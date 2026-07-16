<script setup lang="ts">
const platformLinks = [
  { label: "İhaleler", to: "/ihaleler" },
  { label: "Firmalar", to: "/firmalar" },
  { label: "Paketler", to: "/paketler" },
  { label: "Nasıl Çalışır", to: "/#how" }
]

const companyLinks = [
  { label: "Hakkımızda", to: "/hakkimizda" },
  { label: "Blog", to: "/blog" },
  { label: "Kariyer", to: "/kariyer" },
  { label: "İletişim", to: "/iletisim" }
]

const legalLinks = [
  { label: "KVKK", to: "/kvkk" },
  { label: "Gizlilik Politikası", to: "/gizlilik" },
  { label: "Kullanım Şartları", to: "/kullanim" },
  { label: "Çerez Politikası", to: "/cerezler" }
]
</script>

<template>
  <footer class="bg-slate-950 text-white">

    <div class="mx-auto max-w-7xl px-6 py-20">

      <div class="grid gap-12 lg:grid-cols-5">

        <!-- Logo -->

        <div class="lg:col-span-2">

          <NuxtLink
            to="/"
            class="flex items-center gap-4"
          >
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black"
            >
              G
            </div>

            <div>

              <div class="text-3xl font-black">
                GelAnlaşalım
              </div>

              <div class="text-slate-400">
                Dijital İhale Platformu
              </div>

            </div>

          </NuxtLink>

          <p class="mt-8 max-w-md leading-8 text-slate-400">
            Türkiye'nin yeni nesil dijital ihale platformu.
            İhalelerinizi oluşturun, teklifleri karşılaştırın
            ve en doğru firmayla güvenle anlaşın.
          </p>

          <div class="mt-8 flex gap-4">

            <a
              href="#"
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition hover:bg-blue-600"
            >
              𝕏
            </a>

            <a
              href="#"
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition hover:bg-blue-600"
            >
              in
            </a>

            <a
              href="#"
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition hover:bg-blue-600"
            >
              ▶
            </a>

            <a
              href="#"
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition hover:bg-blue-600"
            >
              f
            </a>

          </div>

        </div>

        <!-- Platform -->

        <div>

          <h3 class="mb-6 text-lg font-bold">
            Platform
          </h3>

          <ul class="space-y-4">

            <li
              v-for="item in platformLinks"
              :key="item.label"
            >
              <NuxtLink
                :to="item.to"
                class="text-slate-400 transition hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>

          </ul>

        </div>

        <!-- Kurumsal -->

        <div>

          <h3 class="mb-6 text-lg font-bold">
            Kurumsal
          </h3>

          <ul class="space-y-4">

            <li
              v-for="item in companyLinks"
              :key="item.label"
            >
              <NuxtLink
                :to="item.to"
                class="text-slate-400 transition hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>

          </ul>

        </div>

        <!-- Yasal -->

        <div>

          <h3 class="mb-6 text-lg font-bold">
            Yasal
          </h3>

          <ul class="space-y-4">

            <li
              v-for="item in legalLinks"
              :key="item.label"
            >
              <NuxtLink
                :to="item.to"
                class="text-slate-400 transition hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>

          </ul>

        </div>

      </div>

      <!-- Newsletter -->

      <div
        class="mt-20 rounded-3xl border border-slate-800 bg-slate-900 p-8"
      >

        <div
          class="flex flex-col items-center justify-between gap-6 lg:flex-row"
        >

          <div>

            <h3 class="text-2xl font-bold">
              Güncel İhaleleri Kaçırmayın
            </h3>

            <p class="mt-2 text-slate-400">
              Yeni ihaleler ve platform duyurularını e-posta ile alın.
            </p>

          </div>

          <div class="flex w-full max-w-xl gap-3">

            <input
              type="email"
              placeholder="E-posta adresiniz"
              class="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-blue-500"
            >

            <button
              class="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-700"
            >
              Abone Ol
            </button>

          </div>

        </div>

      </div>

      <!-- Alt Bilgi -->

      <div
        class="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 lg:flex-row"
      >

        <p class="text-slate-500">
          © 2026 GelAnlaşalım. Tüm hakları saklıdır.
        </p>

        <div class="flex gap-8 text-sm text-slate-500">

          <NuxtLink to="/gizlilik" class="hover:text-white">
            Gizlilik
          </NuxtLink>

          <NuxtLink to="/kvkk" class="hover:text-white">
            KVKK
          </NuxtLink>

          <NuxtLink to="/kullanim" class="hover:text-white">
            Kullanım Şartları
          </NuxtLink>

        </div>

      </div>

    </div>

  </footer>
</template>