<script setup lang="ts">
const testimonials = [
  {
    name: "Ahmet Yılmaz",
    company: "Yılmaz İnşaat",
    text: "GelAnlaşalım sayesinde teklif toplama süremiz günlerden saatlere düştü.",
    rating: 5
  },
  {
    name: "Ayşe Demir",
    company: "ABC Teknoloji",
    text: "Teklifleri karşılaştırmak hiç bu kadar kolay olmamıştı.",
    rating: 5
  },
  {
    name: "Mehmet Kaya",
    company: "Kaya Enerji",
    text: "Aradığımız profesyonel ihale platformunu sonunda bulduk.",
    rating: 5
  }
]
</script>

<template>
<section class="py-24 bg-white">

<div class="mx-auto max-w-7xl px-6">

<div class="text-center">

<span class="text-blue-600 font-semibold uppercase tracking-widest">

Müşteri Yorumları

</span>

<h2 class="mt-4 text-5xl font-black">

Firmalar Neler Söylüyor?

</h2>

</div>

<div class="mt-16 grid gap-8 lg:grid-cols-3">

<div
v-for="item in testimonials"
:key="item.name"
class="rounded-3xl bg-slate-50 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
>

<div class="text-yellow-500 text-xl">

★★★★★

</div>

<p class="mt-6 text-slate-600 leading-8">

"{{ item.text }}"

</p>

<div class="mt-8">

<div class="font-bold">

{{ item.name }}

</div>

<div class="text-slate-500">

{{ item.company }}

</div>

</div>

</div>

</div>

</div>

</section>
</template>