<script setup lang="ts">
import { ref } from "vue"
import {
  Search,
  Bell,
  MessageCircle,
  Plus,
  Moon,
  User
} from "lucide-vue-next"

const search = ref("")
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm"
  >
    <!-- Sol -->
    <div class="flex items-center gap-6">

      <div>
        <h2 class="text-2xl font-black text-slate-800">
          Dashboard
        </h2>

        <p class="text-sm text-slate-500">
          Hoş geldiniz 👋
        </p>
      </div>

      <div class="relative">

        <Search
          class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          :size="18"
        />

        <input
          v-model="search"
          type="text"
          placeholder="İhale, firma veya teklif ara..."
          class="w-[420px] rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
        />

      </div>

    </div>

    <!-- Sağ -->
    <div class="flex items-center gap-4">

      <button
        class="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        <span class="flex items-center gap-2">
          <Plus :size="18" />
          Yeni İhale
        </span>
      </button>

      <button
        class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
      >
        <Bell :size="20" />
      </button>

      <button
        class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
      >
        <MessageCircle :size="20" />
      </button>

      <button
        class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
      >
        <Moon :size="20" />
      </button>

      <button
        class="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-100"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white"
        >
          A
        </div>

        <div class="text-left">
          <div class="font-semibold text-slate-700">
            Ali Turan
          </div>

          <div class="text-xs text-slate-500">
            Premium Firma
          </div>
        </div>

        <User :size="18" />
      </button>

    </div>
  </header>
</template>