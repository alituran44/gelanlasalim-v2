<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  SECTOR_DEFINITIONS, 
  resolveSectorKey, 
  type CategoryFieldDef, 
  type SectorDefinition 
} from '~/utils/categoryFieldsSchema'
import {
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
  Layers,
  Fuel,
  HardHat,
  MapPin,
  Home,
  Building2,
  Truck,
  UtensilsCrossed,
  Laptop,
  Stethoscope,
  ChevronDown,
  Check
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    category?: string
    subCategory?: string
    disabled?: boolean
  }>(),
  {
    modelValue: () => ({}),
    category: '',
    subCategory: '',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'sectorChanged', sectorKey: string): void
}>()

// Internal reactive form state
const formData = ref<Record<string, any>>({ ...props.modelValue })

// Active sector key (auto-resolved or manually selected)
const activeSectorKey = ref<string>('insaat_yapi')
const isManualOverride = ref(false)

// Resolve sector automatically whenever category or subcategory changes
watch(
  [() => props.category, () => props.subCategory],
  ([newCat, newSub]) => {
    if (!isManualOverride.value) {
      const detected = resolveSectorKey(newCat, newSub)
      if (detected !== activeSectorKey.value) {
        activeSectorKey.value = detected
        emit('sectorChanged', detected)
        applyDefaultValues()
      }
    }
  },
  { immediate: true }
)

// Sync with incoming modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(formData.value)) {
      formData.value = { ...newVal }
    }
  },
  { deep: true }
)

// Active sector definition object
const currentSector = computed<SectorDefinition>(() => {
  return SECTOR_DEFINITIONS[activeSectorKey.value] || SECTOR_DEFINITIONS.insaat_yapi || SECTOR_DEFINITIONS.insaat_altyapi
})

// Unique list of sector definitions for manual selection dropdown
const availableSectors = computed(() => {
  const seen = new Set<string>()
  const list: SectorDefinition[] = []
  for (const s of Object.values(SECTOR_DEFINITIONS)) {
    if (s && s.key && !seen.has(s.key)) {
      seen.add(s.key)
      list.push(s)
    }
  }
  return list
})

// Grouped fields
const teknikFields = computed(() => {
  return currentSector.value.fields.filter(f => f.group === 'teknik')
})

const mevzuatFields = computed(() => {
  return currentSector.value.fields.filter(f => f.group === 'mevzuat')
})

const ticariFields = computed(() => {
  return currentSector.value.fields.filter(f => f.group === 'ticari')
})

// Apply default values for empty fields in active sector
function applyDefaultValues() {
  const current = { ...formData.value, _sectorKey: activeSectorKey.value }
  let changed = false
  currentSector.value.fields.forEach((field) => {
    if (current[field.id] === undefined && field.defaultValue !== undefined) {
      current[field.id] = field.defaultValue
      changed = true
    }
  })
  formData.value = current
  emit('update:modelValue', current)
}

function updateField(id: string, value: any) {
  formData.value = {
    ...formData.value,
    _sectorKey: activeSectorKey.value,
    [id]: value
  }
  emit('update:modelValue', { ...formData.value })
}

function handleSectorSelect(key: string) {
  isManualOverride.value = true
  activeSectorKey.value = key
  emit('sectorChanged', key)
  applyDefaultValues()
}

function applyPreset(presetValues: Record<string, any>) {
  formData.value = {
    ...formData.value,
    _sectorKey: activeSectorKey.value,
    ...presetValues
  }
  emit('update:modelValue', { ...formData.value })
}

onMounted(() => {
  applyDefaultValues()
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-6 text-left transition-all">
    
    <!-- 🎯 1. ÜST BAŞLIK & SEKTÖR TESPİT BİLGİSİ -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Sparkles :size="12" class="text-emerald-600" />
            {{ currentSector.badgeText }}
          </span>
          <span class="text-xs text-slate-400 font-mono">Dinamik Şartname Kriterleri</span>
        </div>
        <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <span>{{ currentSector.name }}</span>
        </h3>
        <p class="text-xs text-slate-500 leading-relaxed max-w-2xl">
          {{ currentSector.description }}
        </p>
      </div>

      <!-- Sektör Değiştirme / Preset Seçici -->
      <div class="flex items-center gap-2 shrink-0">
        <div class="relative inline-block text-left">
          <select 
            :value="activeSectorKey"
            @change="handleSectorSelect(($event.target as HTMLSelectElement).value)"
            class="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option v-for="s in availableSectors" :key="s.key" :value="s.key">
              {{ s.badgeText }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ⚡ 2. HIZLI ŞARTNAME ŞABLONLARI (PRESETS) -->
    <div v-if="currentSector.quickPresets && currentSector.quickPresets.length > 0" class="p-3 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-bold text-blue-900">
          <Sparkles :size="14" class="text-blue-600" />
          <span>⚡ Hızlı Şartname Şablonu Doldur:</span>
        </div>
        <span class="text-[10px] text-blue-600 font-medium">1-Tıkla Standart Değerleri Yükle</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in currentSector.quickPresets"
          :key="preset.label"
          type="button"
          @click="applyPreset(preset.values)"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
        >
          <span>👉</span>
          <span>{{ preset.label }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 📋 3. GRUPLANMIŞ ALANLAR (TEKNİK, MEVZUAT, TİCARİ) -->
    <!-- ========================================================================= -->

    <!-- GRUP 1: TEKNİK PARAMETRELER -->
    <div v-if="teknikFields.length > 0" class="space-y-3">
      <div class="border-b border-slate-100 pb-2">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Layers :size="14" class="text-blue-600" />
          {{ currentSector.groups.teknik.title }}
        </h4>
        <p class="text-[11px] text-slate-400 mt-0.5">{{ currentSector.groups.teknik.desc }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="field in teknikFields" 
          :key="field.id" 
          class="space-y-1.5"
          :class="field.type === 'badge-group' ? 'md:col-span-2' : ''"
        >
          <label class="block text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
            </span>
            <span v-if="field.unit" class="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
              Birim: {{ field.unit }}
            </span>
          </label>

          <!-- SELECT -->
          <div v-if="field.type === 'select'" class="relative">
            <select
              :value="formData[field.id] || ''"
              @change="updateField(field.id, ($event.target as HTMLSelectElement).value)"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
            >
              <option value="" disabled>Lütfen seçiniz...</option>
              <option 
                v-for="opt in field.options" 
                :key="typeof opt === 'string' ? opt : opt.value" 
                :value="typeof opt === 'string' ? opt : opt.value"
              >
                {{ typeof opt === 'string' ? opt : opt.label }}
              </option>
            </select>
          </div>

          <!-- BADGE-GROUP (Clickable Chips) -->
          <div v-else-if="field.type === 'badge-group'" class="flex flex-wrap gap-2 pt-0.5">
            <button
              v-for="opt in field.options"
              :key="typeof opt === 'string' ? opt : opt.value"
              type="button"
              @click="updateField(field.id, typeof opt === 'string' ? opt : opt.value)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5"
              :class="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'"
            >
              <Check v-if="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)" :size="12" />
              <span>{{ typeof opt === 'string' ? opt : opt.label }}</span>
            </button>
          </div>

          <!-- NUMBER -->
          <div v-else-if="field.type === 'number'" class="relative">
            <input
              type="number"
              :value="formData[field.id]"
              @input="updateField(field.id, Number(($event.target as HTMLInputElement).value))"
              :placeholder="field.placeholder || '0'"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 pr-14 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
            <span v-if="field.unit" class="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">
              {{ field.unit }}
            </span>
          </div>

          <!-- TEXT -->
          <div v-else class="relative">
            <input
              type="text"
              :value="formData[field.id] || ''"
              @input="updateField(field.id, ($event.target as HTMLInputElement).value)"
              :placeholder="field.placeholder || ''"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <p v-if="field.helpText" class="text-[10px] text-slate-400 leading-tight">
            ℹ️ {{ field.helpText }}
          </p>
        </div>
      </div>
    </div>

    <!-- GRUP 2: MEVZUAT & LİSANS ZORUNLULUKLARI -->
    <div v-if="mevzuatFields.length > 0" class="space-y-3 pt-2">
      <div class="border-b border-slate-100 pb-2">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <CheckCircle2 :size="14" class="text-emerald-600" />
          {{ currentSector.groups.mevzuat.title }}
        </h4>
        <p class="text-[11px] text-slate-400 mt-0.5">{{ currentSector.groups.mevzuat.desc }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="field in mevzuatFields" 
          :key="field.id" 
          class="space-y-1.5"
          :class="field.type === 'boolean' ? 'p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3' : ''"
        >
          <!-- BOOLEAN SWITCH -->
          <template v-if="field.type === 'boolean'">
            <div class="space-y-0.5">
              <label class="text-xs font-bold text-slate-800 block cursor-pointer" @click="updateField(field.id, !formData[field.id])">
                {{ field.label }}
              </label>
              <p v-if="field.helpText" class="text-[10px] text-slate-400 leading-tight">
                {{ field.helpText }}
              </p>
            </div>

            <button
              type="button"
              @click="updateField(field.id, !formData[field.id])"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="formData[field.id] ? 'bg-emerald-600' : 'bg-slate-300'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                :class="formData[field.id] ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </template>

          <!-- OTHER TYPES IN MEVZUAT -->
          <template v-else>
            <label class="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>
                {{ field.label }}
                <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
              </span>
            </label>

            <!-- SELECT -->
            <select
              v-if="field.type === 'select'"
              :value="formData[field.id] || ''"
              @change="updateField(field.id, ($event.target as HTMLSelectElement).value)"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
            >
              <option value="" disabled>Lütfen seçiniz...</option>
              <option 
                v-for="opt in field.options" 
                :key="typeof opt === 'string' ? opt : opt.value" 
                :value="typeof opt === 'string' ? opt : opt.value"
              >
                {{ typeof opt === 'string' ? opt : opt.label }}
              </option>
            </select>

            <!-- BADGE GROUP -->
            <div v-else-if="field.type === 'badge-group'" class="flex flex-wrap gap-2 pt-0.5">
              <button
                v-for="opt in field.options"
                :key="typeof opt === 'string' ? opt : opt.value"
                type="button"
                @click="updateField(field.id, typeof opt === 'string' ? opt : opt.value)"
                class="px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5"
                :class="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
              >
                <Check v-if="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)" :size="12" />
                <span>{{ typeof opt === 'string' ? opt : opt.label }}</span>
              </button>
            </div>

            <!-- TEXT -->
            <input
              v-else
              type="text"
              :value="formData[field.id] || ''"
              @input="updateField(field.id, ($event.target as HTMLInputElement).value)"
              :placeholder="field.placeholder || ''"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />

            <p v-if="field.helpText" class="text-[10px] text-slate-400 leading-tight">
              ℹ️ {{ field.helpText }}
            </p>
          </template>
        </div>
      </div>
    </div>

    <!-- GRUP 3: FİYATLANDIRMA & TİCARİ TESLİM KOŞULLARI -->
    <div v-if="ticariFields.length > 0" class="space-y-3 pt-2">
      <div class="border-b border-slate-100 pb-2">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Sliders :size="14" class="text-amber-600" />
          {{ currentSector.groups.ticari.title }}
        </h4>
        <p class="text-[11px] text-slate-400 mt-0.5">{{ currentSector.groups.ticari.desc }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="field in ticariFields" 
          :key="field.id" 
          class="space-y-1.5"
          :class="field.type === 'badge-group' ? 'md:col-span-2' : ''"
        >
          <label class="block text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
            </span>
            <span v-if="field.unit" class="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
              Birim: {{ field.unit }}
            </span>
          </label>

          <!-- SELECT -->
          <div v-if="field.type === 'select'" class="relative">
            <select
              :value="formData[field.id] || ''"
              @change="updateField(field.id, ($event.target as HTMLSelectElement).value)"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
            >
              <option value="" disabled>Lütfen seçiniz...</option>
              <option 
                v-for="opt in field.options" 
                :key="typeof opt === 'string' ? opt : opt.value" 
                :value="typeof opt === 'string' ? opt : opt.value"
              >
                {{ typeof opt === 'string' ? opt : opt.label }}
              </option>
            </select>
          </div>

          <!-- BADGE GROUP -->
          <div v-else-if="field.type === 'badge-group'" class="flex flex-wrap gap-2 pt-0.5">
            <button
              v-for="opt in field.options"
              :key="typeof opt === 'string' ? opt : opt.value"
              type="button"
              @click="updateField(field.id, typeof opt === 'string' ? opt : opt.value)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5"
              :class="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              <Check v-if="formData[field.id] === (typeof opt === 'string' ? opt : opt.value)" :size="12" />
              <span>{{ typeof opt === 'string' ? opt : opt.label }}</span>
            </button>
          </div>

          <!-- NUMBER -->
          <div v-else-if="field.type === 'number'" class="relative">
            <input
              type="number"
              :value="formData[field.id]"
              @input="updateField(field.id, Number(($event.target as HTMLInputElement).value))"
              :placeholder="field.placeholder || '0'"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 pr-14 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
            <span v-if="field.unit" class="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-mono">
              {{ field.unit }}
            </span>
          </div>

          <!-- TEXT -->
          <div v-else class="relative">
            <input
              type="text"
              :value="formData[field.id] || ''"
              @input="updateField(field.id, ($event.target as HTMLInputElement).value)"
              :placeholder="field.placeholder || ''"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <p v-if="field.helpText" class="text-[10px] text-slate-400 leading-tight">
            ℹ️ {{ field.helpText }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

