<script setup lang="ts">
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

const chartData = {
  labels: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran"
  ],
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
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <div class="mb-6 flex items-center justify-between">

      <div>

        <h2 class="text-xl font-bold text-slate-800">
          İhale Analizi
        </h2>

        <p class="text-sm text-slate-500">
          Son 6 aylık ihale istatistikleri
        </p>

      </div>

      <div
        class="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
      >
        +18%
      </div>

    </div>

    <div class="h-[360px]">

      <Line
        :data="chartData"
        :options="chartOptions"
      />

    </div>

  </div>
</template>