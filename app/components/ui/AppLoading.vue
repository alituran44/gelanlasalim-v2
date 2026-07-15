<template>

<div class="space-y-4 animate-pulse">

<div class="h-6 w-40 rounded bg-slate-200"/>

<div class="h-32 rounded-xl bg-slate-200"/>

<div class="grid grid-cols-3 gap-4">

<div
v-for="n in 3"
:key="n"
class="h-24 rounded-xl bg-slate-200"
/>

</div>

</div>

</template>