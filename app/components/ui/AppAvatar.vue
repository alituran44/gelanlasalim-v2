<script setup lang="ts">
interface Props{
name?:string
size?:"sm"|"md"|"lg"
}

const props=withDefaults(defineProps<Props>(),{
name:"A",
size:"md"
})

const sizes={
sm:"w-8 h-8 text-xs",
md:"w-10 h-10 text-sm",
lg:"w-14 h-14 text-lg"
}
</script>

<template>

<div
class="rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
:class="sizes[size]"
>

{{ name.charAt(0).toUpperCase() }}

</div>

</template>