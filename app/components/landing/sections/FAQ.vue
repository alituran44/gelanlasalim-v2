<script setup lang="ts">
import { ref } from "vue"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "GelAnlaşalım nedir?",
    answer:
      "GelAnlaşalım, firmaların dijital ortamda ihale oluşturmasını, teklif toplamasını ve teklifleri karşılaştırarak en doğru tedarikçiyi seçmesini sağlayan modern bir B2B platformudur."
  },
  {
    question: "Platformu kullanmak ücretli mi?",
    answer:
      "Temel üyelik ücretsizdir. Daha fazla özellik, sınırsız ihale ve gelişmiş raporlama için profesyonel paketlere geçebilirsiniz."
  },
  {
    question: "Kimler teklif verebilir?",
    answer:
      "Sisteme kayıtlı ve doğrulanmış tüm firmalar yayınlanan ihalelere teklif verebilir."
  },
  {
    question: "İhaleler güvenli mi?",
    answer:
      "Tüm teklifler güvenli altyapıda saklanır. Yetkilendirme sistemi sayesinde sadece ilgili kullanıcılar teklifleri görüntüleyebilir."
  },
  {
    question: "Teklifleri nasıl karşılaştırırım?",
    answer:
      "Teklifler fiyat, teslim süresi, firma puanı ve diğer kriterlere göre tek ekranda karşılaştırılabilir."
  },
  {
    question: "Destek alabilir miyim?",
    answer:
      "Evet. Destek ekibimiz e-posta ve canlı destek üzerinden çalışma saatleri içerisinde yardımcı olmaktadır."
  }
]

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="bg-white py-24">

    <div class="mx-auto max-w-4xl px-6">

      <div class="text-center">

        <span
          class="font-semibold uppercase tracking-widest text-blue-600"
        >
          Sık Sorulan Sorular
        </span>

        <h2
          class="mt-4 text-5xl font-black text-slate-900"
        >
          Merak Ettikleriniz
        </h2>

        <p
          class="mt-6 text-lg text-slate-500"
        >
          GelAnlaşalım hakkında en çok sorulan soruların cevaplarını burada
          bulabilirsiniz.
        </p>

      </div>

      <div class="mt-16 space-y-5">

        <div
          v-for="(faq, index) in faqs"
          :key="faq.question"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          <button
            class="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-50"
            @click="toggle(index)"
          >

            <span
              class="text-lg font-semibold text-slate-800"
            >
              {{ faq.question }}
            </span>

            <span
              class="text-2xl font-bold text-blue-600"
            >
              {{ openIndex === index ? "−" : "+" }}
            </span>

          </button>

          <Transition
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-300"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >

            <div
              v-if="openIndex === index"
              class="border-t border-slate-200 px-6 py-5 text-slate-600 leading-8"
            >
              {{ faq.answer }}
            </div>

          </Transition>

        </div>

      </div>

    </div>

  </section>
</template>