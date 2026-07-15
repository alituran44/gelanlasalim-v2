<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  disabled: false
})

const emit = defineEmits([
  "update:modelValue"
])
</script>

<template>

<div class="space-y-2">

<label
v-if="label"
class="text-sm font-semibold text-slate-700"
>

{{ label }}

</label>

<input
:value="props.modelValue"
@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
:type="type"
:placeholder="placeholder"
:disabled="disabled"
class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
/>

<p
v-if="error"
class="text-sm text-red-500"
>

{{ error }}

</p>

</div>

</template>