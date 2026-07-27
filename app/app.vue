<script setup lang="ts">
import { computed } from 'vue'
import { locale } from '~/composables/useLocale'

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  title: computed(() => locale.value === 'tr' 
    ? 'GelAnlaşalım | Canlı Eksiltmeli B2B Satın Alma ve Ters İhale Arenası' 
    : 'GelAnlasalim | Live Reverse Auction B2B Procurement Arena'
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => locale.value === 'tr' 
        ? 'GelAnlaşalım, kurumsal alıcıların canlı eksiltmeli ters ihaleler düzenleyerek malzeme ve lojistik tedarik maliyetlerini düşürdüğü yeni nesil B2B pazaryeridir.' 
        : 'GelAnlasalim is a next-generation B2B marketplace where corporate buyers reduce material and logistics procurement costs by running live reverse auctions.'
      ) 
    },
    {
      name: 'keywords',
      content: computed(() => locale.value === 'tr'
        ? 'ters ihale, canlı eksiltme, B2B satın alma, tedarik zinciri, teklif toplama, kurumsal satıcı, e-ihale'
        : 'reverse auction, live bidding, B2B procurement, supply chain, request for quote, enterprise supplier, e-procurement'
      )
    }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body, html {
  font-family: 'Inter', sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif !important;
}

.premium-shadow {
  box-shadow: 0 10px 30px -10px rgba(0, 48, 87, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
  border-color: rgba(226, 232, 240, 0.8) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-shadow:hover {
  box-shadow: 0 20px 40px -15px rgba(0, 48, 87, 0.15), 0 0 0 1px rgba(30, 174, 76, 0.25) !important;
  transform: translateY(-3px);
}
</style>