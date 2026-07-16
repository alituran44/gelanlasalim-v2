<script setup lang="ts">
const steps = [
  {
    step: "01",
    title: "İhaleni Oluştur",
    description:
      "Dakikalar içinde ihale oluştur, şartname ve dosyalarını yükle."
  },
  {
    step: "02",
    title: "Teklifleri Topla",
    description:
      "Onaylı firmalar tekliflerini güvenli şekilde sisteme iletsin."
  },
  {
    step: "03",
    title: "Karşılaştır",
    description:
      "Fiyat, teslim süresi ve firma puanlarını tek ekranda incele."
  },
  {
    step: "04",
    title: "Anlaşmanı Yap",
    description:
      "En uygun firmayı seç, süreci platform üzerinden yönet."
  }
]
</script>

<template>
  <section id="how" class="py-24 bg-white">
    <div class="mx-auto max-w-7xl px-6">

      <div class="text-center mb-16">
        <span class="text-blue-600 font-semibold uppercase tracking-widest">
          Süreç
        </span>

        <h2 class="mt-4 text-5xl font-black text-slate-900">
          4 Adımda Dijital İhale
        </h2>

        <p class="mt-6 max-w-3xl mx-auto text-lg text-slate-500">
          GelAnlaşalım ile ihale oluşturmak ve teklif toplamak
          birkaç dakikanızı alır.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        <div
          v-for="item in steps"
          :key="item.step"
          class="group rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
        >

          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white"
          >
            {{ item.step }}
          </div>

          <h3 class="mt-8 text-2xl font-bold text-slate-800">
            {{ item.title }}
          </h3>

          <p class="mt-4 leading-8 text-slate-500">
            {{ item.description }}
          </p>

        </div>

      </div>

    </div>
  </section>
</template>