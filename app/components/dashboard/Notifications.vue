<script setup lang="ts">
import { computed } from "vue"
import { locale } from "~/composables/useLocale"

const notifications = computed(() => {
  if (locale.value === 'en') {
    return [
      {
        id: 1,
        title: "3 new supplier bids received",
        type: "Info",
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "Subscription renews in 5 days",
        type: "Alert",
        color: "bg-amber-500"
      },
      {
        id: 3,
        title: "New supplier followed your company",
        type: "System",
        color: "bg-emerald-500"
      },
      {
        id: 4,
        title: "Platform v2.4 updates live",
        type: "Update",
        color: "bg-purple-500"
      }
    ]
  } else {
    return [
      {
        id: 1,
        title: "3 yeni teklif geldi",
        type: "Bilgi",
        color: "bg-blue-500"
      },
      {
        id: 2,
        title: "Aboneliğiniz 5 gün sonra bitecek",
        type: "Uyarı",
        color: "bg-amber-500"
      },
      {
        id: 3,
        title: "Yeni firma sizi takip etti",
        type: "Sistem",
        color: "bg-emerald-500"
      },
      {
        id: 4,
        title: "Yeni sürüm yayınlandı",
        type: "Güncelleme",
        color: "bg-purple-500"
      }
    ]
  }
})
</script>

<template>
  <div class="rounded-2xl bg-white border border-slate-200 shadow-xs">
    <div class="border-b border-slate-100 p-6">
      <h2 class="text-base font-black text-slate-800 tracking-tight">
        {{ locale === 'tr' ? 'Bildirim Merkezi' : 'Notification Center' }}
      </h2>
      <p class="text-xs font-medium text-slate-500 mt-0.5">
        {{ locale === 'tr' ? 'Son gelen bildirim ve sistem duyuruları' : 'Latest system notifications and alerts' }}
      </p>
    </div>

    <div class="divide-y divide-slate-100">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="flex items-center justify-between p-4 hover:bg-slate-50/80 transition"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :class="item.color"
          ></div>
          <span class="text-xs font-bold text-slate-800">
            {{ item.title }}
          </span>
        </div>

        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
          {{ item.type }}
        </span>
      </div>
    </div>
  </div>
</template>