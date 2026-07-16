<script setup lang="ts">
import AppBadge from "~/components/ui/AppBadge.vue"
import AppButton from "~/components/ui/AppButton.vue"

const tenders = [
  {
    title: "Hastane Yazılım Alımı",
    company: "ABC Sağlık",
    city: "İstanbul",
    budget: "2.500.000 ₺",
    category: "Yazılım"
  },
  {
    title: "Okul İnşaat Projesi",
    company: "XYZ İnşaat",
    city: "Ankara",
    budget: "18.000.000 ₺",
    category: "İnşaat"
  },
  {
    title: "Güneş Enerji Santrali",
    company: "Enerji AŞ",
    city: "İzmir",
    budget: "32.000.000 ₺",
    category: "Enerji"
  }
]
</script>

<template>
  <section class="bg-slate-50 py-24">

    <div class="mx-auto max-w-7xl px-6">

      <div class="mb-12 flex items-center justify-between">

        <div>

          <h2 class="text-4xl font-black">
            Öne Çıkan İhaleler
          </h2>

          <p class="mt-3 text-slate-500">
            Güncel ve yüksek bütçeli fırsatları keşfedin.
          </p>

        </div>

        <NuxtLink to="/ihaleler">
          <AppButton variant="secondary">
            Tümünü Gör
          </AppButton>
        </NuxtLink>

      </div>

      <div class="grid gap-8 lg:grid-cols-3">

        <div
          v-for="tender in tenders"
          :key="tender.title"
          class="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
        >

          <AppBadge>
            {{ tender.category }}
          </AppBadge>

          <h3 class="mt-6 text-2xl font-bold">
            {{ tender.title }}
          </h3>

          <div class="mt-6 space-y-3 text-slate-600">

            <div>
              🏢 {{ tender.company }}
            </div>

            <div>
              📍 {{ tender.city }}
            </div>

            <div class="font-bold text-blue-600">
              💰 {{ tender.budget }}
            </div>

          </div>

          <NuxtLink
            to="/ihaleler"
            class="mt-8 block"
          >
            <AppButton block>
              Teklif Ver
            </AppButton>
          </NuxtLink>

        </div>

      </div>

    </div>

  </section>
</template>