<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  prefixText?: string
  suffixText?: string
  mono?: boolean
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  disabled: false,
  mono: false,
  required: false
})

const emit = defineEmits([
  "update:modelValue"
])
</script>

<template>
  <div class="space-y-1 text-left">
    <label
      v-if="label"
      class="block text-[10px] font-black uppercase tracking-wider text-slate-500"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- Prefix Text (e.g. ₺, $, %) -->
      <span
        v-if="prefixText"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-xs select-none pointer-events-none"
      >
        {{ prefixText }}
      </span>

      <input
        :value="props.modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full rounded-xl border bg-white py-2.5 text-xs text-slate-900 outline-none transition-all duration-150 focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/10 disabled:bg-slate-100 disabled:text-slate-400"
        :class="[
          prefixText ? 'pl-8' : 'px-3.5',
          suffixText ? 'pr-8' : 'px-3.5',
          mono ? 'font-mono font-bold' : 'font-medium',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'
        ]"
      />

      <!-- Suffix Text -->
      <span
        v-if="suffixText"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs select-none pointer-events-none"
      >
        {{ suffixText }}
      </span>
    </div>

    <p
      v-if="error"
      class="text-[11px] font-bold text-red-500 mt-1"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      class="text-[10px] text-slate-400 mt-1"
    >
      {{ hint }}
    </p>
  </div>
</template>