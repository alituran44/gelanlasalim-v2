<script setup lang="ts">
import { computed } from 'vue'
import { useCmsData } from '~/composables/useCmsData'
import { Building2, Trees, PartyPopper, Compass, Home, Cpu, Cog, Truck, ArrowRight } from 'lucide-vue-next'

const { cmsData } = useCmsData()
const tenders = computed(() => cmsData.value?.dashboard?.tenders || [])

const rawCategories = [
  { name: "Gayrimenkul", slug: "Gayrimenkul", desc: "Arsa, Daire, Ticari & Kat Karşılığı Projeler", icon: Home, bg: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Peyzaj & Bahçe", slug: "Peyzaj", desc: "Peyzaj Mimarlığı, Rulo Çim & Otomatik Sulama", icon: Trees, bg: "bg-teal-50 text-teal-700 border-teal-200" },
  { name: "İnşaat & Yapı", slug: "İnşaat", desc: "Kaba & İnce İşçilik, Taahhüt ve Projelendirme", icon: Building2, bg: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Organizasyon", slug: "Organizasyon", desc: "Kurumsal Etkinlik, Düğün, İftar & Sahne", icon: PartyPopper, bg: "bg-rose-50 text-rose-700 border-rose-200" },
  { name: "Turizm & Umre", slug: "Turizm", desc: "Hac & Umre Paketleri, Otel ve Grup Turları", icon: Compass, bg: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Yazılım & Bilişim", slug: "Yazılım", desc: "Web Tasarım, Mobil Uygulama & Entegrasyon", icon: Cpu, bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "Makine & Ekipman", slug: "Makine", desc: "İş Makinesi, Forklift ve Endüstriyel Donanım", icon: Cog, bg: "bg-slate-100 text-slate-700 border-slate-200" },
  { name: "Lojistik & Nakliye", slug: "Lojistik", desc: "Yurtiçi Sevkiyat, Ağır Nakliyat & Depolama", icon: Truck, bg: "bg-emerald-50 text-emerald-700 border-emerald-200" }
]

const categories = computed(() => {
  return rawCategories.map(cat => ({
    ...cat,
    count: tenders.value.filter(t => 
      (t.kategori || '').toLowerCase().includes(cat.slug.toLowerCase()) || 
      (t.mainCategory || '').toLowerCase().includes(cat.slug.toLowerCase()) ||
      (t.baslik || '').toLowerCase().includes(cat.slug.toLowerCase())
    ).length
  }))
})
</script>

<template>
  <section class="py-16 bg-slate-50/50 border-y border-slate-200/60">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">

      <div class="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
          Sektörel İhale Masaları
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Popüler İhale & İlan Kategorileri
        </h2>
        <p class="text-sm text-slate-500 font-medium">
          İhtiyacınıza en uygun sektörü seçin, yüzlerce doğrulanmış kurumsal ilanı ve canlı eksiltmeyi anında inceleyin.
        </p>
      </div>

      <div class="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.name"
          :to="`/pazar-yeri?category=${encodeURIComponent(category.name)}`"
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-md flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors" :class="category.bg">
                <component :is="category.icon" :size="24" />
              </div>
              <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-600 transition-colors border border-slate-200">
                {{ category.count }} İlan
              </span>
            </div>

            <div>
              <h3 class="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 leading-snug">
                {{ category.desc }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
            <span>İlanları Görüntüle</span>
            <ArrowRight :size="14" class="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>