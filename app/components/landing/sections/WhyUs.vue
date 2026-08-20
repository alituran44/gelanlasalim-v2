<script setup lang="ts">
const features = [
  {
    icon: "⚡",
    title: "Hızlı Teklif Süreci",
    description:
      "Dakikalar içinde onlarca firmadan teklif alın."
  },
  {
    icon: "🛡️",
    title: "Doğrulanmış Firmalar",
    description:
      "Sisteme kayıtlı firmalar kontrol edilerek onaylanır."
  },
  {
    icon: "📊",
    title: "Teklif Karşılaştırma",
    description:
      "Fiyat, kalite ve teslim süresini aynı ekranda görün."
  },
  {
    icon: "💬",
    title: "Anlık Mesajlaşma",
    description:
      "Firmalarla platform üzerinden güvenli iletişim kurun."
  },
  {
    icon: "📁",
    title: "Doküman Yönetimi",
    description:
      "Şartname, sözleşme ve dosyaları tek noktadan yönetin."
  },
  {
    icon: "🔒",
    title: "Güvenli Altyapı",
    description:
      "Verileriniz güvenli sunucularda korunur."
  }
]
</script>

<template>
  <section class="bg-slate-50 py-24">

    <div class="mx-auto max-w-7xl px-6">

      <div class="text-center">

        <span class="font-semibold uppercase tracking-widest text-blue-600">
          Neden Biz?
        </span>

        <h2 class="mt-4 text-5xl font-black text-slate-900">
          Neden İhaleciBurada?
        </h2>

        <p class="mx-auto mt-6 max-w-3xl text-lg text-slate-500">
          Dijital ihale süreçlerini hızlandıran,
          maliyetleri düşüren ve karar vermeyi kolaylaştıran
          modern bir platform.
        </p>

      </div>

      <div class="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
        >

          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl"
          >
            {{ feature.icon }}
          </div>

          <h3 class="mt-6 text-2xl font-bold text-slate-800">
            {{ feature.title }}
          </h3>

          <p class="mt-4 leading-8 text-slate-500">
            {{ feature.description }}
          </p>

        </div>

      </div>

    </div>
  </section>
</template>