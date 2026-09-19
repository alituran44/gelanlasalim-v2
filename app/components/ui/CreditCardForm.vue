<template>
  <div class="credit-card-form-wrapper w-full" :class="className">
    <div class="card-and-form-grid">
      <!-- 3D KREDİ KARTI GÖRSEL ALANI -->
      <div class="card-scene">
        <div id="card" class="interactive-card" :class="{ 'flip': isFlipped }">
          <!-- ODAKLANMA ÇERÇEVESİ (HIGHLIGHT BOX) -->
          <div id="highlight" :class="highlightClass"></div>

          <!-- KART ÖN YÜZÜ -->
          <div 
            class="card-side card-front" 
            :style="{ '--ring1': ring1, '--ring2': ring2 }"
          >
            <div class="card-header-row">
              <div class="card-chip-and-type flex items-center gap-2.5">
                <!-- EMV Chip SVG -->
                <svg class="chip-svg" width="38" height="28" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="32" rx="5" fill="url(#chip-grad)" />
                  <rect x="2" y="2" width="40" height="28" rx="3" stroke="#D97706" stroke-width="0.8" fill="none" />
                  <line x1="0" y1="11" x2="44" y2="11" stroke="#B45309" stroke-width="0.7" />
                  <line x1="0" y1="21" x2="44" y2="21" stroke="#B45309" stroke-width="0.7" />
                  <line x1="16" y1="0" x2="16" y2="32" stroke="#B45309" stroke-width="0.7" />
                  <line x1="28" y1="0" x2="28" y2="32" stroke="#B45309" stroke-width="0.7" />
                  <defs>
                    <linearGradient id="chip-grad" x1="0" y1="0" x2="44" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FDE68A" />
                      <stop offset="0.5" stop-color="#F59E0B" />
                      <stop offset="1" stop-color="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>

                <!-- Temassız Ödeme İkonu -->
                <svg class="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a9 9 0 0 0 0-14" />
                  <path d="M15.5 21.5a13 13 0 0 0 0-19" />
                </svg>
              </div>

              <!-- KART TÜRÜ / LOGO (Troy, Mastercard, Visa) -->
              <div class="card-brand-logo">
                <template v-if="cardBrand === 'troy'">
                  <div class="px-2 py-0.5 rounded bg-white/95 text-blue-900 font-black text-xs tracking-wider shadow-xs">
                    troy
                  </div>
                </template>
                <template v-else-if="cardBrand === 'visa'">
                  <span class="text-white font-black italic text-xl tracking-wider font-serif">VISA</span>
                </template>
                <template v-else>
                  <!-- Mastercard / Genel Logo -->
                  <svg xmlns="http://www.w3.org/2000/svg" height="32" width="48" viewBox="-96 -98.908 832 593.448">
                    <path fill="#ff5f00" d="M224.833 42.298h190.416v311.005H224.833z" />
                    <path d="M244.446 197.828a197.448 197.448 0 0175.54-155.475 197.777 197.777 0 100 311.004 197.448 197.448 0 01-75.54-155.53z" fill="#eb001b" />
                    <path d="M621.101 320.394v-6.372h2.747v-1.319h-6.537v1.319h2.582v6.373zm12.691 0v-7.69h-1.978l-2.307 5.493-2.308-5.494h-1.977v7.691h1.428v-5.823l2.143 5h1.483l2.143-5v5.823z" fill="#f79e1b" />
                    <path d="M640 197.828a197.777 197.777 0 01-320.015 155.474 197.777 197.777 0 000-311.004A197.777 197.777 0 01640 197.773z" fill="#f79e1b" />
                  </svg>
                </template>
              </div>
            </div>

            <!-- KART NUMARASI YUVASI (SLIDE ANİMASYONLU) -->
            <div id="card_number" class="card-number-slots" aria-label="Kart Numarası">
              <span v-for="(slot, idx) in displayedSlots" :key="idx" class="slot">
                <span class="digit" :class="{ 'filed': slot.filed }">
                  <span class="row placeholder">#</span>
                  <span class="row value">{{ slot.textTop }}</span>
                </span>
              </span>
            </div>

            <!-- KART ALT ALANI: İSİM VE SON KULLANMA -->
            <div class="card-footer-row">
              <div class="card-holder-col">
                <div class="card-sec-title">KART SAHİBİ</div>
                <div id="card_holder" class="card-sec-value truncate max-w-[200px]">
                  {{ holder || 'AD SOYAD' }}
                </div>
              </div>
              <div class="card-expires-col">
                <div class="card-sec-title">SKT</div>
                <div class="card-sec-value font-mono">
                  <span id="card_expires_month">{{ month || 'AA' }}</span>/<span id="card_expires_year">{{ year ? year.slice(-2) : 'YY' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- KART ARKA YÜZÜ (CVV ALANI) -->
          <div 
            class="card-side card-back" 
            :style="{ '--ring1': ring1, '--ring2': ring2 }"
          >
            <div class="card-magnetic-stripe"></div>
            <div class="card-cvv-section">
              <span class="text-[11px] font-bold text-slate-300">GÜVENLİK KODU (CVV / CVC)</span>
              <div id="card_cvv_field" class="card-cvv-box">
                {{ '*'.repeat(cvv.length) || '•••' }}
              </div>
              <p class="text-[9px] text-slate-400 mt-2 text-right">
                Kartınızın arkasındaki son 3 haneli güvenlik kodu.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- KART GİRİŞ FORMU -->
      <form class="card-form" @submit.prevent="handleSubmit" novalidate>
        <!-- KART NUMARASI -->
        <div class="form-field">
          <label for="card_num_input" class="form-label">
            Kart Numarası
            <span class="text-xs text-slate-400 font-normal ml-1">(Troy, Visa, MasterCard)</span>
          </label>
          <div class="relative">
            <input
              id="card_num_input"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="0000 0000 0000 0000"
              :value="formattedNumber"
              @input="onNumberInput"
              @focus="focusField = 'number'"
              @blur="focusField = null"
              class="form-input font-mono"
              :class="{ 'border-rose-500 ring-rose-200': !validity.number && number.length >= 13 }"
              maxlength="23"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
              <span v-if="cardBrand === 'troy'" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">TROY</span>
              <span v-else-if="cardBrand === 'visa'" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">VISA</span>
              <span v-else-if="cardBrand === 'mastercard'" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">MC</span>
            </div>
          </div>
          <small v-if="!validity.number && number.length >= 13" class="form-error">
            Geçersiz kart numarası formatı
          </small>
        </div>

        <!-- KART SAHİBİ -->
        <div class="form-field">
          <label for="card_holder_input" class="form-label">Kart Üzerindeki İsim Soyisim</label>
          <input
            id="card_holder_input"
            type="text"
            autocomplete="cc-name"
            placeholder="AHMET YILMAZ"
            :value="holder"
            @input="onHolderInput"
            @focus="focusField = 'holder'"
            @blur="focusField = null"
            class="form-input uppercase"
            maxlength="36"
          />
        </div>

        <!-- SKT VE CVV -->
        <div class="form-row-2">
          <!-- SON KULLANMA TARİHİ -->
          <div class="form-field">
            <label class="form-label">Son Kullanma Tarihi</label>
            <div class="grid grid-cols-2 gap-2">
              <select
                id="expiration_month"
                :value="month"
                @change="onMonthChange"
                @focus="focusField = 'expire'"
                @blur="focusField = null"
                class="form-select font-mono"
              >
                <option value="" disabled>Ay</option>
                <option v-for="m in monthOptions" :key="m" :value="m">{{ m }}</option>
              </select>

              <select
                id="expiration_year"
                :value="year"
                @change="onYearChange"
                @focus="focusField = 'expire'"
                @blur="focusField = null"
                class="form-select font-mono"
              >
                <option value="" disabled>Yıl</option>
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <!-- CVV / CVC -->
          <div class="form-field">
            <label for="card_cvv_input" class="form-label flex items-center justify-between">
              <span>CVV / CVC</span>
              <span class="text-[10px] text-slate-400 font-normal">Arka yüzdeki 3 hane</span>
            </label>
            <input
              id="card_cvv_input"
              type="password"
              inputmode="numeric"
              autocomplete="cc-csc"
              placeholder="•••"
              :value="cvv"
              @input="onCvvInput"
              @focus="focusField = 'cvv'"
              @blur="focusField = null"
              class="form-input font-mono text-center tracking-widest"
              maxlength="4"
            />
          </div>
        </div>

        <!-- GÜVENLİK ROZETİ VE 3D SECURE NOTU -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-[11px] leading-snug">
            TCMB & BDDK lisanslı <strong>Paynkolay 3D Secure</strong> SMS banka onay şifresiyle %100 güvenceli ödeme.
          </span>
        </div>

        <!-- ONAY VE GÖNDER BUTONU -->
        <button
          v-if="showSubmit"
          type="submit"
          class="submit-btn"
          :disabled="!validity.allValid || isSubmitting"
        >
          <span v-if="isSubmitting" class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Ödeme İşleniyor...
          </span>
          <span v-else>
            {{ validity.allValid ? submitButtonText : 'Kart Bilgilerini Eksiksiz Giriniz' }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export type CardState = {
  number: string
  holder: string
  month: string
  year: string
  cvv: string
}

export type CardValidity = {
  number: boolean
  holder: boolean
  month: boolean
  year: boolean
  cvv: boolean
  allValid: boolean
}

const props = withDefaults(defineProps<{
  defaultNumber?: string
  defaultHolder?: string
  defaultMonth?: string
  defaultYear?: string
  defaultCVV?: string
  maskMiddle?: boolean
  ring1?: string
  ring2?: string
  showSubmit?: boolean
  submitButtonText?: string
  isSubmitting?: boolean
  className?: string
}>(), {
  defaultNumber: '',
  defaultHolder: '',
  defaultMonth: '',
  defaultYear: '',
  defaultCVV: '',
  maskMiddle: true,
  ring1: '#ff6be7',
  ring2: '#7288ff',
  showSubmit: true,
  submitButtonText: 'Güvenli Ödemeyi Tamamla (3D Secure)',
  isSubmitting: false,
  className: ''
})

const emit = defineEmits<{
  (e: 'change', state: CardState, validity: CardValidity): void
  (e: 'submit', state: CardState, validity: CardValidity): void
  (e: 'update:modelValue', state: CardState): void
}>()

// Kart Veri Durumları
const number = ref<string>(clampDigits(props.defaultNumber, 19))
const holder = ref<string>(props.defaultHolder.toUpperCase())
const month = ref<string>(props.defaultMonth)
const year = ref<string>(props.defaultYear)
const cvv = ref<string>(clampDigits(props.defaultCVV, 4))
const focusField = ref<null | 'number' | 'holder' | 'expire' | 'cvv'>(null)

// 3D Flip Kontrolü: CVV odaklandığında kart arkaya döner
const isFlipped = computed(() => focusField.value === 'cvv')

// Ay ve Yıl Seçenekleri
const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 11 }, (_, i) => String(currentYear + i))

// Kart Markası Tespiti (Troy, Visa, Mastercard)
const cardBrand = computed(() => {
  const clean = number.value
  if (clean.startsWith('9792')) return 'troy'
  if (clean.startsWith('4')) return 'visa'
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard'
  return 'other'
})

// Boşluklu Formatlanmış Kart Numarası
const formattedNumber = computed(() => {
  return number.value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
})

function clampDigits(value: string, maxLen: number): string {
  return (value || '').replace(/\D/g, '').slice(0, maxLen)
}

function onNumberInput(e: Event) {
  const target = e.target as HTMLInputElement
  number.value = clampDigits(target.value, 19)
}

function onHolderInput(e: Event) {
  const target = e.target as HTMLInputElement
  holder.value = (target.value || '').toLocaleUpperCase('tr-TR')
}

function onMonthChange(e: Event) {
  const target = e.target as HTMLSelectElement
  month.value = target.value
}

function onYearChange(e: Event) {
  const target = e.target as HTMLSelectElement
  year.value = target.value
}

function onCvvInput(e: Event) {
  const target = e.target as HTMLInputElement
  cvv.value = clampDigits(target.value, 4)
}

// Kart Doğrulama (Validity) & Luhn Kontrolü
function checkLuhn(cardNo: string): boolean {
  let s = 0
  let doubleDigit = false
  for (let i = cardNo.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNo.charAt(i), 10)
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    s += digit
    doubleDigit = !doubleDigit
  }
  return s % 10 === 0
}

const validity = computed<CardValidity>(() => {
  const len = number.value.length
  const numberValid = len >= 13 && len <= 19 && (len >= 16 ? checkLuhn(number.value) : true)
  const holderValid = holder.value.trim().length >= 3
  const monthValid = !!month.value && +month.value >= 1 && +month.value <= 12
  const yearValid = !!year.value && +year.value >= currentYear
  const cvvValid = /^\d{3,4}$/.test(cvv.value)

  return {
    number: numberValid,
    holder: holderValid,
    month: monthValid,
    year: yearValid,
    cvv: cvvValid,
    allValid: numberValid && holderValid && monthValid && yearValid && cvvValid
  }
})

// Canlı Değişiklik Yayını (Emit)
watch([number, holder, month, year, cvv], () => {
  const state: CardState = {
    number: number.value,
    holder: holder.value,
    month: month.value,
    year: year.value,
    cvv: cvv.value
  }
  emit('change', state, validity.value)
  emit('update:modelValue', state)
}, { immediate: true })

// 16 Haneli Görsel Slot Dizilimi
const displayDigits = computed(() => number.value.slice(0, 16).split(''))

const displayedSlots = computed(() => {
  const arr: { textTop: string; filed: boolean }[] = []
  for (let i = 0; i < 16; i++) {
    let content = '#'
    if (i < displayDigits.value.length) {
      const d = displayDigits.value[i]
      const shouldMask = props.maskMiddle && i >= 4 && i <= 11
      content = shouldMask ? '*' : d
    }
    arr.push({ textTop: content, filed: i < displayDigits.value.length })
  }
  return arr
})

// Highlight Odaklanma Çerçevesi Sınıfı
const highlightClass = computed(() => {
  switch (focusField.value) {
    case 'number':
      return 'highlight__number'
    case 'holder':
      return 'highlight__holder'
    case 'expire':
      return 'highlight__expire'
    case 'cvv':
      return 'highlight__cvv'
    default:
      return 'hidden'
  }
})

function handleSubmit() {
  if (!validity.value.allValid) return
  emit('submit', {
    number: number.value,
    holder: holder.value,
    month: month.value,
    year: year.value,
    cvv: cvv.value
  }, validity.value)
}
</script>

<style scoped>
.credit-card-form-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.card-and-form-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* 3D Kart Sahnesi */
.card-scene {
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.interactive-card {
  position: relative;
  width: 100%;
  height: 220px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.interactive-card.flip {
  transform: rotateY(180deg);
}

/* Kart Yüzeyleri */
.card-side {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  padding: 22px 24px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
  box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  color: #fff;
  overflow: hidden;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
  padding: 20px 0 0;
}

/* Arka Plan Gradient Halkaları */
.card-front::before,
.card-back::before {
  content: "";
  position: absolute;
  border: 14px solid var(--ring1, #ff6be7);
  border-radius: 100%;
  left: -20%;
  top: -40px;
  height: 260px;
  width: 260px;
  filter: blur(14px);
  opacity: 0.7;
}

.card-front::after,
.card-back::after {
  content: "";
  position: absolute;
  border: 14px solid var(--ring2, #7288ff);
  border-radius: 100%;
  width: 260px;
  top: 50%;
  left: -120px;
  height: 260px;
  filter: blur(14px);
  opacity: 0.6;
}

/* Odaklanma Çerçevesi (Highlight) */
#highlight {
  position: absolute;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  z-index: 5;
  top: 0;
  left: 0;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

#highlight.highlight__number {
  width: 320px;
  height: 38px;
  top: 86px;
  left: 18px;
}

#highlight.highlight__holder {
  width: 230px;
  height: 48px;
  top: 148px;
  left: 18px;
}

#highlight.highlight__expire {
  width: 80px;
  height: 48px;
  top: 148px;
  left: 300px;
}

#highlight.highlight__cvv {
  width: 330px;
  height: 80px;
  top: 76px;
  left: 18px;
}

#highlight.hidden {
  display: none;
}

/* Kart Başlık Satırı */
.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  position: relative;
  z-index: 2;
}

/* Kart Numarası Slotları */
.card-number-slots {
  font-size: 20px;
  font-family: monospace;
  font-weight: 700;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
  display: flex;
  height: 30px;
  overflow: hidden;
  letter-spacing: 2px;
}

.card-number-slots .slot {
  display: inline-flex;
}

.card-number-slots .slot:nth-child(4n) {
  margin-right: 12px;
}

.card-number-slots .digit {
  display: flex;
  flex-direction: column;
  height: 30px;
  line-height: 30px;
  transition: transform 0.25s cubic-bezier(0.3, 1, 0.4, 1);
}

.card-number-slots .digit.filed {
  transform: translateY(-30px);
}

.card-number-slots .row {
  height: 30px;
  display: block;
}

/* Kart Alt Bilgileri */
.card-footer-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.card-sec-title {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.card-sec-value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

/* Arka Yüz Manyetik Şerit */
.card-magnetic-stripe {
  height: 38px;
  width: 100%;
  background-color: #0f172a;
  position: relative;
  z-index: 2;
}

.card-cvv-section {
  position: relative;
  z-index: 2;
  margin-top: 18px;
  padding: 0 24px;
}

.card-cvv-box {
  margin-top: 4px;
  background-color: #f8fafc;
  border-radius: 8px;
  height: 38px;
  width: 100%;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  font-size: 22px;
  font-family: monospace;
  font-weight: 900;
  letter-spacing: 4px;
}

/* FORM ALANI */
.card-form {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}

.form-input,
.form-select {
  height: 44px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  padding: 0 14px;
  font-size: 13px;
  color: #0f172a;
  background-color: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-row-2 {
    grid-template-columns: 1fr;
  }
  
  #highlight.highlight__number {
    width: 270px;
  }
  #highlight.highlight__expire {
    left: 240px;
  }
}

.form-error {
  color: #e11d48;
  font-size: 11px;
  margin-top: 4px;
  font-weight: 500;
}

.submit-btn {
  height: 46px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(2, 132, 199, 0.3);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}
</style>
