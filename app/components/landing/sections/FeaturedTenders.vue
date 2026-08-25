<script setup lang="ts">
import { computed } from "vue"
import AppBadge from "~/components/ui/AppBadge.vue"
import AppButton from "~/components/ui/AppButton.vue"
import { useCmsData } from "~/composables/useCmsData"

const { cmsData } = useCmsData()

const tenders = computed(() => {
  return (cmsData.value?.dashboard?.tenders || []).map((t: any) => ({
    title: t.baslik,
    company: t.companyName || t.firma || `${t.city || 'Doğrulanmış'} Kurumsal Alıcı`,
    city: t.city || 'Türkiye Geneli',
    budget: t.butce || 'Açık Eksiltme',
    category: t.kategori?.split('/')[0]?.trim() || 'Satın Alma'
  }))
})
</script>

<template>
  <section class="bg-slate-50 py-20 border-t border-slate-100">

    <div class="mx-auto max-w-7xl px-6">

      <div class="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 class="text-3xl font-black text-slate-900">
            Öne Çıkan İhaleler
          </h2>

          <p class="mt-2 text-sm text-slate-500">
            Güncel ve onaylı kurumsal satın alma fırsatları.
          </p>

        </div>

        <NuxtLink to="/pazar-yeri">
          <AppButton variant="secondary">
            Tümünü Gör ↗
          </AppButton>
        </NuxtLink>

      </div>

      <div v-if="tenders.length > 0" class="grid gap-6 lg:grid-cols-3">

        <div
          v-for="tender in tenders"
          :key="tender.title"
          class="rounded-3xl bg-white p-7 shadow-xs border border-slate-200/80 transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
        >

          <div>
            <AppBadge>
              {{ tender.category }}
            </AppBadge>

            <h3 class="mt-4 text-xl font-bold text-slate-900 line-clamp-2">
              {{ tender.title }}
            </h3>

            <div class="mt-4 space-y-2 text-xs text-slate-600 font-medium">

              <div class="truncate">
                🏢 {{ tender.company }}
              </div>

              <div>
                📍 {{ tender.city }}
              </div>

              <div class="font-bold text-blue-600 font-mono">
                💰 {{ tender.budget }}
              </div>

            </div>
          </div>

          <NuxtLink
            to="/pazar-yeri"
            class="mt-6 block"
          >
            <AppButton block>
              Teklif Ver
            </AppButton>
          </NuxtLink>

        </div>

      </div>

      <div v-else class="rounded-3xl bg-white p-12 border border-slate-200 text-center space-y-3">
        <p class="text-xs text-slate-500 font-medium">Henüz yayında öne çıkan ihale bulunmuyor. Yeni bir satın alma ihalesi açıldığında burada listelenecektir.</p>
        <NuxtLink to="/panel/ihale-olustur" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
          + Hemen İhale Açın
        </NuxtLink>
      </div>

    </div>

  </section>
</template>