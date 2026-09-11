<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck, 
  UserX, 
  Building2, 
  FileText, 
  Clock, 
  Radio, 
  Megaphone,
  Check
} from 'lucide-vue-next'

const props = defineProps<{
  tender: any
  isOpen: boolean
  isOwner?: boolean
}>()

const emit = defineEmits(['close', 'question-added', 'answered'])

const questions = ref<any[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showAskForm = ref(false)

// New question form state
const newQuestionText = ref('')
const questionType = ref<'GENEL' | 'OZEL'>('GENEL')
const isAnonymous = ref(false)

// Answer form state
const answeringQuestionId = ref<string | null>(null)
const answerText = ref('')
const isPublicAnnouncement = ref(true)

const userSession = ref<any>({})

function loadSession() {
  if (typeof window !== 'undefined') {
    try {
      userSession.value = JSON.parse(localStorage.getItem('userSession') || '{}')
    } catch {}
  }
}

async function fetchQuestions() {
  if (!props.tender?.id) return
  isLoading.value = true
  try {
    loadSession()
    const email = userSession.value?.email || 'ihalecib@gmail.com'
    const res: any = await $fetch(`/api/tenders/${encodeURIComponent(props.tender.id)}/questions?email=${encodeURIComponent(email)}`)
    if (res?.success && Array.isArray(res.questions)) {
      questions.value = res.questions
    }
  } catch (e) {
    console.warn('[Questions Modal] Fetch error:', e)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (val) => {
  if (val) {
    loadSession()
    fetchQuestions()
    showAskForm.value = false
    answeringQuestionId.value = null
  }
})

async function submitQuestion() {
  if (!newQuestionText.value.trim() || isSubmitting.value) return
  isSubmitting.value = true
  loadSession()

  const email = userSession.value?.email || 'ihalecib@gmail.com'
  const companyName = userSession.value?.companyName || userSession.value?.company || userSession.value?.name || 'Onaylı Katılımcı'

  try {
    const res: any = await $fetch(`/api/tenders/${encodeURIComponent(props.tender.id)}/questions`, {
      method: 'POST',
      body: {
        tenderTitle: props.tender.baslik || props.tender.title || 'İhale',
        askerEmail: email,
        askerCompanyName: companyName,
        isAnonymous: isAnonymous.value,
        type: questionType.value,
        question: newQuestionText.value.trim()
      }
    })

    if (res?.success) {
      newQuestionText.value = ''
      showAskForm.value = false
      await fetchQuestions()
      emit('question-added')
      alert('Sorunuz başarıyla iletildi (Kural COM-005 & COM-007).\n\nİhale sahibi sorunuzu yanıtladığında bildirim merkezinden anında haberdar edileceksiniz.')
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Soru iletilirken bir hata oluştu.')
  } finally {
    isSubmitting.value = false
  }
}

async function submitAnswer(questionId: string) {
  if (!answerText.value.trim() || isSubmitting.value) return
  isSubmitting.value = true
  loadSession()

  const responderName = userSession.value?.companyName || userSession.value?.name || 'Hasan Hüseyin Yıldırım (İhale Sahibi)'

  try {
    const res: any = await $fetch(`/api/tenders/${encodeURIComponent(props.tender.id)}/questions/${encodeURIComponent(questionId)}`, {
      method: 'PATCH',
      body: {
        answer: answerText.value.trim(),
        answeredBy: responderName,
        isPublicAnnouncement: isPublicAnnouncement.value
      }
    })

    if (res?.success) {
      answerText.value = ''
      answeringQuestionId.value = null
      await fetchQuestions()
      emit('answered')
      alert(res.message || 'Soru yanıtlandı.')
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Cevap kaydedilirken bir hata oluştu.')
  } finally {
    isSubmitting.value = false
  }
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-left">
    <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fadeIn border border-slate-200">
      
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-mono font-black">
              #{{ tender?.id }}
            </span>
            <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">
              Kural COM-005 / COM-006
            </span>
          </div>
          <h2 class="text-base sm:text-lg font-black text-slate-900 line-clamp-1">
            {{ tender?.baslik || 'İhale Soru-Cevap & Zeyilname Masası' }}
          </h2>
          <p class="text-xs text-slate-500">
            Resmî ihale şartnamesi açıklamaları, soru-cevap kayıtları ve bağlayıcı zeyilnameler
          </p>
        </div>

        <button 
          @click="closeModal" 
          class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Content Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        
        <!-- Üst Bilgi Kartı -->
        <div class="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 leading-relaxed space-y-1">
          <div class="flex items-center gap-1.5 font-bold text-blue-950">
            <ShieldCheck :size="15" class="text-blue-600" />
            <span>Resmî İhale İletişim İlkeleri (Kural COM-005 & COM-006)</span>
          </div>
          <p class="text-[11px] text-blue-800">
            Tüm katılımcılar şartnameye dair açıklama talep edebilir. Firma adı anonim tutulabilir. İhale koşullarını etkileyen cevaplar ihale sahibi tarafından <strong>Genel Zeyilname (Addendum)</strong> duyurusuna dönüştürülür ve tüm katılımcılara zorunlu sistem bildirimi ile iletilir.
          </p>
        </div>

        <!-- Soru Sorma Butonu (Katılımcılar İçin) -->
        <div v-if="!isOwner && !showAskForm" class="flex justify-end">
          <button 
            type="button"
            @click="showAskForm = true"
            class="px-4 py-2.5 rounded-xl bg-[#0F223D] hover:bg-[#1A365D] text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <HelpCircle :size="14" />
            <span>Yeni Soru İlet</span>
          </button>
        </div>

        <!-- Soru Sorma Formu -->
        <div v-if="showAskForm" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <MessageSquare :size="14" class="text-blue-600" />
              <span>İhale Sahibine Soru Gönder</span>
            </h4>
            <button 
              type="button" 
              @click="showAskForm = false"
              class="text-xs text-slate-400 hover:text-slate-600"
            >
              Vazgeç
            </button>
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-slate-700 block">Sorunuz *</label>
            <textarea 
              v-model="newQuestionText"
              rows="3"
              placeholder="Şartname maddesi, teslim tarihi veya teknik özellik hakkında sorunuzu açıkça yazınız..."
              class="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-900 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <!-- Soru Tipi -->
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-slate-700 block">Soru Kapsamı (COM-005)</label>
              <div class="flex items-center gap-2">
                <label class="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                  <input type="radio" v-model="questionType" value="GENEL" class="text-blue-600 focus:ring-0" />
                  <span>Genel Soru (Herkese Açık)</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium ml-2">
                  <input type="radio" v-model="questionType" value="OZEL" class="text-blue-600 focus:ring-0" />
                  <span>Özel Soru</span>
                </label>
              </div>
            </div>

            <!-- Anonimlik -->
            <div class="flex items-center pt-3 sm:pt-4">
              <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium text-xs">
                <input type="checkbox" v-model="isAnonymous" class="rounded text-blue-600 focus:ring-0" />
                <span>Firma Adımı Gizle (Anonim Katılımcı)</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              type="button"
              @click="submitQuestion"
              :disabled="!newQuestionText.trim() || isSubmitting"
              class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send :size="13" />
              <span>{{ isSubmitting ? 'İletiliyor...' : 'Soruyu İlet' }}</span>
            </button>
          </div>
        </div>

        <!-- Sorular Listesi -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b pb-2 border-slate-100">
            <span class="text-xs font-black text-slate-900 uppercase tracking-wider">
              Soru & Cevap Geçmişi ({{ questions.length }})
            </span>
            <span v-if="isLoading" class="text-xs text-slate-400 font-mono">Yükleniyor...</span>
          </div>

          <div v-if="questions.length === 0 && !isLoading" class="text-center py-10 text-slate-400 text-xs">
            <HelpCircle class="mx-auto text-slate-300 mb-2" :size="32" />
            <p>Bu ihale için henüz bir soru veya zeyilname kaydı bulunmamaktadır.</p>
          </div>

          <div 
            v-for="q in questions" 
            :key="q.id"
            class="p-4 rounded-2xl border transition-all text-xs space-y-3"
            :class="q.isPublicAnnouncement ? 'bg-amber-50/40 border-amber-300 shadow-2xs' : 'bg-white border-slate-200'"
          >
            <!-- Soru Başlık & Meta -->
            <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 border-slate-100">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  {{ q.id }}
                </span>

                <span 
                  v-if="q.isPublicAnnouncement"
                  class="px-2.5 py-0.5 rounded-md bg-amber-500 text-white font-black text-[10px] flex items-center gap-1 shadow-2xs"
                >
                  <Megaphone :size="11" />
                  <span>GENEL ZEYİLNAME (ADDENDUM)</span>
                </span>

                <span 
                  v-else-if="q.type === 'OZEL'"
                  class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold"
                >
                  Özel Soru
                </span>

                <span 
                  v-else
                  class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold"
                >
                  Genel Soru
                </span>

                <span class="font-bold text-slate-800">
                  {{ q.askerCompanyName }}
                </span>
              </div>

              <span class="text-[10px] text-slate-400 font-mono">
                {{ new Date(q.askedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>

            <!-- Soru Metni -->
            <div class="text-slate-800 font-medium leading-relaxed pl-2 border-l-2 border-blue-500">
              {{ q.question }}
            </div>

            <!-- Cevap Alanı (Varsa) -->
            <div v-if="q.answer" class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-black text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 :size="13" class="text-emerald-600" />
                  <span>İhale Sahibi Cevabı ({{ q.answeredBy || 'Satın Alma Yetkilisi' }})</span>
                </span>
                <span v-if="q.answeredAt" class="text-[10px] text-slate-400 font-mono">
                  {{ new Date(q.answeredAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
              <p class="text-slate-700 leading-relaxed font-normal">
                {{ q.answer }}
              </p>
            </div>

            <!-- İhale Sahibi Yanıtlama Alanı -->
            <div v-else-if="isOwner && answeringQuestionId !== q.id" class="pt-1 flex justify-end">
              <button 
                type="button"
                @click="answeringQuestionId = q.id; answerText = ''; isPublicAnnouncement = true"
                class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare :size="12" />
                <span>Bu Soruyu Yanıtla</span>
              </button>
            </div>

            <!-- Aktif Cevap Yazma Formu (İhale Sahibi İçin) -->
            <div v-if="isOwner && answeringQuestionId === q.id" class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2.5 animate-fadeIn">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-black text-slate-900">Resmî Yanıtınızı Yazınız:</span>
                <button 
                  type="button" 
                  @click="answeringQuestionId = null"
                  class="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Vazgeç
                </button>
              </div>

              <textarea 
                v-model="answerText"
                rows="3"
                placeholder="Şartname açıklaması veya teknik cevabınızı giriniz..."
                class="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-white text-slate-900 resize-none"
              ></textarea>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <label class="flex items-center gap-2 cursor-pointer text-slate-800 text-[11px] font-bold">
                  <input type="checkbox" v-model="isPublicAnnouncement" class="rounded text-blue-600 focus:ring-0" />
                  <span>Genel Zeyilname (Addendum) Olarak Duyur (Kural COM-006)</span>
                </label>

                <button 
                  type="button"
                  @click="submitAnswer(q.id)"
                  :disabled="!answerText.trim() || isSubmitting"
                  class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <Check :size="13" />
                  <span>{{ isSubmitting ? 'Kaydediliyor...' : 'Cevabı Yayınla' }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>Resmî İletişim Masası · 5070 SK & VUK 595 Uyumlu</span>
        <button 
          type="button"
          @click="closeModal"
          class="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
        >
          Kapat
        </button>
      </div>

    </div>
  </div>
</template>
