<script setup lang="ts">
import { computed } from "vue"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

import { Line } from "vue-chartjs"
import { locale } from "~/composables/useLocale"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = computed(() => {
  // Pure Turkish mode
  {
    return {
      labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
      datasets: [
        {
          label: "Açılan İhaleler",
          data: [12, 19, 14, 28, 35, 41],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,.12)",
          fill: true,
          tension: 0.4
        }
      ]
    }
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "#e5e7eb"
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-base font-black text-slate-800 tracking-tight">
          {{ 'İhale Trend Analizi' }}
        </h2>
        <p class="text-xs font-medium text-slate-500 mt-0.5">
          {{ 'Son 6 aylık ihale hacmi istatistikleri' }}
        </p>
      </div>

      <div class="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
        +18% {{ 'Büyüme' }}
      </div>
    </div>

    <div class="h-[340px]">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>