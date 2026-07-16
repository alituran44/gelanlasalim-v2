<script setup lang="ts">
interface Column {
  key: string
  label: string
}

defineProps<{
  columns: Column[]
  rows: any[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">

    <table class="w-full">

      <thead class="bg-slate-50">

        <tr>

          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 text-left text-sm font-bold text-slate-700"
          >
            {{ column.label }}
          </th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="border-t border-slate-100 hover:bg-slate-50"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 text-sm text-slate-700"
          >
            {{ row[column.key] }}
          </td>
        </tr>

      </tbody>

    </table>

    <div
      v-if="rows.length === 0"
      class="p-10"
    >
      <AppEmpty />
    </div>

  </div>
</template>