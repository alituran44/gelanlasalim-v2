<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Download, 
  Building2, 
  Mail, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Shield, 
  Search, 
  RefreshCw, 
  ChevronDown,
  Briefcase,
  AlertTriangle
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'dark'
})

const { userSession, userEmail } = useUserSession()

const activeTab = ref<'members' | 'requests' | 'matrix' | 'audit'>('members')
const isLoading = ref(true)
const isUpdating = ref(false)

// Şirket listesi ve seçilen şirket
const companies = ref<any[]>([])
const selectedVkn = ref<string>('9560161511')
const companyData = ref<any>(null)
const memberSearchQuery = ref('')

// Modallar
const showInviteModal = ref(false)
const showRoleModal = ref(false)
const selectedMember = ref<any>(null)

const inviteForm = ref({
  fullName: '',
  email: '',
  role: 'TEKLİF_YETKİLİSİ',
  note: ''
})

const roleForm = ref({
  newRole: 'TEKLİF_YETKİLİSİ'
})

const ROLES = [
  {
    code: 'FİRMA_YÖNETİCİSİ',
    title: 'Firma Yöneticisi',
    desc: 'Kullanıcı daveti, rol yönetimi, şirket profili ve tüm ihale/teklif süreçlerinin nihai yetkilisi.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
  },
  {
    code: 'SATIN_ALMA',
    title: 'Satın Alma Kullanıcısı',
    desc: 'İhale oluşturma, katılımcı yönetimi, teklif toplama ve teknik/ticari değerlendirme yetkilisi.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
  },
  {
    code: 'İHALE_ONAYLAYICISI',
    title: 'İhale Onaylayıcısı',
    desc: 'Taslak ihalelerin yayınlanması öncesinde şirket içi idari ve bütçe kontrolünü onaylar.',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800'
  },
  {
    code: 'TEKNİK_DEĞERLENDİRİCİ',
    title: 'Teknik Değerlendirici',
    desc: 'Gelen tekliflerin teknik şartname ve numune uygunluğunu denetler, gerekçeli ret/kabul verir.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
  },
  {
    code: 'TEKLİF_YETKİLİSİ',
    title: 'Satıcı / Teklif Yetkilisi',
    desc: 'Firma adına ihalelere katılma, bağlayıcı ticari teklif verme ve revize fiyat sunma yetkilisi.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    code: 'SONUÇ_ONAYLAYICISI',
    title: 'Sonuç Onaylayıcısı',
    desc: 'İhale bitiminde kazanan teklifi nihai olarak onaylar ve ihale sonuç tutanağını kesinleştirir.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
  },
  {
    code: 'GÖRÜNTÜLEYİCİ',
    title: 'Görüntüleyici (Salt Okunur)',
    desc: 'Yalnızca yetkili olduğu ihale ve teklif kayıtlarını inceler; ticari teklif sunamaz veya ihale açamaz.',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
]

function getRoleObj(roleCode: string) {
  return ROLES.find(r => r.code === roleCode) || {
    code: roleCode,
    title: roleCode,
    desc: 'Standart Çalışan',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
}

// Şirket listesini yükle
async function loadCompanies() {
  try {
    const res: any = await $fetch('/api/company/status', {
      query: { all: 'true' }
    })
    if (res?.companies && res.companies.length > 0) {
      companies.value = res.companies
      if (!selectedVkn.value || !res.companies.some((c: any) => c.vkn === selectedVkn.value)) {
        selectedVkn.value = res.companies[0].vkn
      }
    }
  } catch (err) {
    console.warn('Companies list fetch error:', err)
  }
}

// Seçili şirketin tam detaylarını yükle
async function loadCompanyDetails() {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/company/status', {
      query: { 
        vkn: selectedVkn.value || '9560161511',
        full: 'true'
      }
    })
    if (res?.company) {
      companyData.value = res.company
    } else {
      // Fallback
      const fallbackRes: any = await $fetch('/api/company/status', {
        query: { email: userEmail.value || 'ihalecib@gmail.com' }
      })
      if (fallbackRes?.company) {
        companyData.value = fallbackRes.company
        selectedVkn.value = fallbackRes.company.vkn
      }
    }
  } catch (err) {
    console.error('Company details fetch error:', err)
  } finally {
    isLoading.value = false
  }
}

watch(selectedVkn, () => {
  loadCompanyDetails()
})

const activeMembers = computed(() => {
  const members = companyData.value?.members?.filter((m: any) => m.status === 'ACTIVE') || []
  if (!memberSearchQuery.value.trim()) return members
  const q = memberSearchQuery.value.trim().toLowerCase()
  return members.filter((m: any) => 
    (m.fullName || '').toLowerCase().includes(q) || 
    (m.userEmail || '').toLowerCase().includes(q) ||
    (m.role || '').toLowerCase().includes(q)
  )
})

const pendingRequests = computed(() => {
  return companyData.value?.joinRequests?.filter((r: any) => r.status === 'PENDING') || []
})

const auditLogs = computed(() => {
  return companyData.value?.auditLog || []
})

function openInviteModal() {
  inviteForm.value = {
    fullName: '',
    email: '',
    role: 'TEKLİF_YETKİLİSİ',
    note: ''
  }
  showInviteModal.value = true
}

async function sendInvite() {
  if (!inviteForm.value.fullName || !inviteForm.value.email) {
    alert('Lütfen ad-soyad ve kurumsal e-posta adresini giriniz.')
    return
  }

  isUpdating.value = true
  try {
    const res: any = await $fetch('/api/company/join-request', {
      method: 'POST',
      body: {
        vkn: companyData.value?.vkn || selectedVkn.value,
        userEmail: inviteForm.value.email,
        fullName: inviteForm.value.fullName,
        requestedRole: inviteForm.value.role,
        note: inviteForm.value.note
      }
    })

    // Yönetici davet ettiği için otomatik onaylama
    if (res?.request?.requestId) {
      await $fetch('/api/company/join-request', {
        method: 'PATCH',
        body: {
          vkn: companyData.value?.vkn || selectedVkn.value,
          requestId: res.request.requestId,
          approved: true,
          adminEmail: userEmail.value || 'admin@ihaleciburada.com',
          assignedRole: inviteForm.value.role
        }
      })
    }

    showInviteModal.value = false
    await loadCompanyDetails()
    alert(`🎉 Davet Başarılı (Kural USR-003)!\n\n"${inviteForm.value.fullName}" (${inviteForm.value.email}) firmanıza "${inviteForm.value.role}" yetkisiyle başarıyla eklendi.`)
  } catch (e: any) {
    alert('Davet gönderilemedi: ' + (e?.data?.message || e?.message || 'Bilinmeyen hata'))
  } finally {
    isUpdating.value = false
  }
}

function openEditRoleModal(member: any) {
  selectedMember.value = member
  roleForm.value.newRole = member.role
  showRoleModal.value = true
}

async function saveRoleUpdate() {
  if (!selectedMember.value) return
  isUpdating.value = true
  try {
    await $fetch('/api/company/members', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || selectedVkn.value,
        targetEmail: selectedMember.value.userEmail,
        newRole: roleForm.value.newRole,
        adminEmail: userEmail.value || 'admin@ihaleciburada.com'
      }
    })
    showRoleModal.value = false
    await loadCompanyDetails()
    alert(`✅ Rol Güncellendi (Kural USR-004)!\n\n${selectedMember.value.fullName} için yeni rol: "${roleForm.value.newRole}" olarak kaydedildi.`)
  } catch (e: any) {
    alert('Rol güncellenemedi: ' + (e?.data?.message || e?.message))
  } finally {
    isUpdating.value = false
  }
}

async function removeMember(member: any) {
  if (member.role === 'FİRMA_YÖNETİCİSİ') {
    alert('Firma Yöneticisi hesabı silinemez.')
    return
  }
  const confirmed = confirm(`"${member.fullName}" (${member.userEmail}) çalışanının firma erişim yetkisini iptal etmek istediğinize emin misiniz? (Kural USR-006)`)
  if (!confirmed) return

  isUpdating.value = true
  try {
    await $fetch('/api/company/members', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || selectedVkn.value,
        targetEmail: member.userEmail,
        action: 'REMOVE',
        adminEmail: userEmail.value || 'admin@ihaleciburada.com'
      }
    })
    await loadCompanyDetails()
    alert(`🔒 Erişim İptal Edildi (Kural USR-006)!\n\n${member.fullName} firma hesabından çıkarıldı, aktif oturumları sonlandırıldı.`)
  } catch (e: any) {
    alert('İşlem başarısız: ' + (e?.data?.message || e?.message))
  } finally {
    isUpdating.value = false
  }
}

async function handleJoinRequest(req: any, approved: boolean) {
  isUpdating.value = true
  try {
    await $fetch('/api/company/join-request', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || selectedVkn.value,
        requestId: req.requestId,
        approved,
        adminEmail: userEmail.value || 'admin@ihaleciburada.com',
        assignedRole: req.requestedRole
      }
    })
    await loadCompanyDetails()
    alert(approved ? `✅ Katılım Talebi Onaylandı (Kural VER-006)!` : `⛔ Katılım Talebi Reddedildi.`)
  } catch (e: any) {
    alert('Talep işlenemedi: ' + (e?.data?.message || e?.message))
  } finally {
    isUpdating.value = false
  }
}

function exportTeamCsv() {
  const members = activeMembers.value
  const csvContent = 'data:text/csv;charset=utf-8,' + 
    'Ad Soyad,E-Posta,Firma İçi Rol,Durum,Katılım Tarihi\n' +
    members.map((m: any) => `"${m.fullName}","${m.userEmail}","${m.role}","${m.status}","${m.joinedAt}"`).join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `ekip_yetki_listesi_${companyData.value?.vkn || selectedVkn.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(async () => {
  await loadCompanies()
  await loadCompanyDetails()
})
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    
    <!-- ÜST FİRMA SEÇİCİ & YÖNETİM BARİ (ADMIN ONLY) -->
    <div 
      class="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
      :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
    >
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-blue-600/10 text-blue-600">
          <Building2 :size="20" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-wider text-blue-500">Yönetilen Kurumsal Firma</span>
            <span class="text-[10px] px-2 py-0.5 rounded-md font-mono font-black"
              :class="props.theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'">
              {{ companies.length }} Kayıtlı Firma
            </span>
          </div>
          <div class="mt-1 flex items-center gap-2">
            <select 
              v-model="selectedVkn" 
              class="text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
              :class="props.theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'"
            >
              <option v-for="comp in companies" :key="comp.vkn" :value="comp.vkn">
                {{ comp.companyTitle }} (VKN: {{ comp.vkn }}) - {{ comp.membersCount }} Üye
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-auto">
        <button 
          type="button" 
          @click="loadCompanyDetails" 
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer"
          :class="props.theme === 'light' ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-slate-800 hover:bg-slate-800 text-slate-300'"
        >
          <RefreshCw :size="13" :class="isLoading ? 'animate-spin' : ''" />
          <span>Yenile</span>
        </button>
      </div>
    </div>

    <!-- FİRMA RESMİ KİMLİK KARTI (GÖRSEL BİREBİR UYUM) -->
    <div 
      class="rounded-3xl border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
      :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'"
    >
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1">
            <Building2 :size="12" />
            <span>B2B KURUMSAL KİMLİK (BÖLÜM 2 & 5)</span>
          </span>
          <span 
            v-if="companyData?.status === 'VERIFIED'"
            class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1"
          >
            <ShieldCheck :size="12" />
            <span>{{ companyData?.verificationBadge || '✓ Doğrulanmış Mükellef (Mavi Rozet)' }}</span>
          </span>
          <span 
            v-else
            class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200 flex items-center gap-1"
          >
            <Clock :size="12" />
            <span>{{ companyData?.verificationBadge || '⏳ Sicil & GİB Teyidi Bekliyor (Algoritmik Kontrol Başarılı)' }}</span>
          </span>
        </div>

        <h2 
          class="text-xl sm:text-2xl font-black"
          :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'"
        >
          {{ companyData?.companyTitle || 'İhaleciBurada Ticari İşletmesi' }}
        </h2>

        <p class="text-xs flex flex-wrap items-center gap-x-4 gap-y-1 font-medium"
          :class="props.theme === 'light' ? 'text-slate-500' : 'text-slate-400'">
          <span>🏛️ <strong>Vergi Dairesi:</strong> {{ companyData?.taxOffice || 'Çanakkale Vergi Dairesi' }}</span>
          <span>💳 <strong>VKN/TCKN:</strong> {{ companyData?.vkn || '9560161511' }}</span>
          <span>📮 <strong>KEP:</strong> {{ companyData?.kepAddress || 'hasanhuseyin.yildirim.17@hs01.kep.tr' }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button 
          type="button"
          @click="exportTeamCsv"
          class="flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shadow-xs" 
          :class="props.theme === 'light' ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-700 text-slate-300 bg-slate-800/80 hover:bg-slate-800'"
        >
          <Download :size="13" />
          <span>CSV İndir</span>
        </button>
        <button 
          type="button"
          @click="openInviteModal"
          class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 shadow transition cursor-pointer"
        >
          <UserPlus :size="14" />
          <span>Yeni Çalışan Ekle</span>
        </button>
      </div>
    </div>

    <!-- SEKMELER (TABS) -->
    <div 
      class="flex border-b overflow-x-auto gap-2"
      :class="props.theme === 'light' ? 'border-slate-200' : 'border-slate-800'"
    >
      <button 
        type="button"
        @click="activeTab = 'members'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'members' 
          ? 'text-blue-500 border-b-2 border-blue-600 font-black' 
          : (props.theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')"
      >
        <Users :size="14" />
        <span>Ekip Üyeleri ({{ (companyData?.members || []).filter((m: any) => m.status === 'ACTIVE').length }})</span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'requests'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'requests' 
          ? 'text-blue-500 border-b-2 border-blue-600 font-black' 
          : (props.theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')"
      >
        <Clock :size="14" />
        <span>Katılım Talepleri ({{ pendingRequests.length }})</span>
        <span v-if="pendingRequests.length > 0" class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'matrix'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'matrix' 
          ? 'text-blue-500 border-b-2 border-blue-600 font-black' 
          : (props.theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')"
      >
        <Shield :size="14" />
        <span>Yetki Matrisi (Bölüm 2.3)</span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'audit'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'audit' 
          ? 'text-blue-500 border-b-2 border-blue-600 font-black' 
          : (props.theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white')"
      >
        <FileCheck :size="14" />
        <span>Denetim Günlüğü (Audit Log)</span>
      </button>
    </div>

    <!-- TAB 1: EKİP ÜYELERİ LİSTESİ -->
    <div v-if="activeTab === 'members'" class="space-y-4">
      
      <!-- Arama Filtresi -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <Search :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="memberSearchQuery" 
            type="text" 
            placeholder="İsim, e-posta veya role göre ara..." 
            class="w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition"
            :class="props.theme === 'light' 
              ? 'bg-white border-slate-200 text-slate-900 focus:border-blue-500' 
              : 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'"
          />
        </div>
      </div>

      <div 
        class="rounded-2xl border overflow-hidden shadow-sm"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead 
              class="border-b uppercase text-[10px] font-black tracking-wider"
              :class="props.theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'"
            >
              <tr>
                <th class="py-3 px-4">Çalışan</th>
                <th class="py-3 px-4">E-Posta</th>
                <th class="py-3 px-4">Firma İçi Rol (USR-004)</th>
                <th class="py-3 px-4">Durum</th>
                <th class="py-3 px-4">Kayıt Tarihi</th>
                <th class="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody 
              class="divide-y font-medium"
              :class="props.theme === 'light' ? 'divide-slate-100' : 'divide-slate-800'"
            >
              <tr v-if="activeMembers.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-400">
                  <Users :size="28" class="mx-auto text-slate-500 mb-2" />
                  Kayıtlı aktif çalışan bulunamadı.
                </td>
              </tr>
              <tr 
                v-for="member in activeMembers" 
                :key="member.userId" 
                class="transition"
                :class="props.theme === 'light' ? 'hover:bg-slate-50/70' : 'hover:bg-slate-800/40'"
              >
                <td class="py-3.5 px-4 font-bold flex items-center gap-2.5"
                  :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">
                  <div class="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 border border-blue-500/20">
                    {{ member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <div>
                    <span class="block">{{ member.fullName }}</span>
                    <span v-if="member.userEmail === userEmail" class="text-[9px] text-blue-500 font-bold">(Siz)</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-mono text-[11px]"
                  :class="props.theme === 'light' ? 'text-slate-600' : 'text-slate-400'">
                  {{ member.userEmail }}
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-black" :class="getRoleObj(member.role).badgeColor">
                    {{ getRoleObj(member.role).title }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    ✓ Aktif
                  </span>
                </td>
                <td class="py-3.5 px-4 text-[11px]"
                  :class="props.theme === 'light' ? 'text-slate-500' : 'text-slate-400'">
                  {{ member.joinedAt ? member.joinedAt.slice(0, 10) : '2026-01-15' }}
                </td>
                <td class="py-3.5 px-4 text-right space-x-1">
                  <button 
                    type="button" 
                    @click="openEditRoleModal(member)"
                    class="p-1.5 rounded-lg transition cursor-pointer" 
                    :class="props.theme === 'light' ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-950/50'"
                    title="Yetki/Rol Değiştir (USR-004)"
                  >
                    <Edit3 :size="14" />
                  </button>
                  <button 
                    type="button" 
                    @click="removeMember(member)"
                    :disabled="member.role === 'FİRMA_YÖNETİCİSİ'"
                    class="p-1.5 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                    :class="props.theme === 'light' ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-red-950/50'"
                    title="Firma Yetkisini Kaldır (USR-006)"
                  >
                    <Trash2 :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bilgi Notu -->
      <div 
        class="p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-2xs"
        :class="props.theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-950' : 'bg-blue-950/30 border-blue-900/50 text-blue-200'"
      >
        <ShieldCheck :size="20" class="text-blue-500 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h4 class="font-black" :class="props.theme === 'light' ? 'text-blue-900' : 'text-blue-300'">
            Kurumsal Güvenlik & Yetki Ayrıştırma İlkesi (USR-001 ~ USR-006)
          </h4>
          <p class="text-[11px] leading-relaxed opacity-90">
            Kullanıcının sisteme üye olması tek başına firmanız adına ihale açma veya teklif verme hakkı doğurmaz. Teklif verebilmek için çalışanın <strong>"Teklif Yetkilisi"</strong> veya <strong>"Satın Alma"</strong> yetkisine sahip olması ve firmanızın onaylı VKN'si gereklidir (Kural VER-001 & VER-004).
          </p>
        </div>
      </div>
    </div>

    <!-- TAB 2: BEKLEYEN KATILIM TALEPLERİ (VER-006) -->
    <div v-if="activeTab === 'requests'" class="space-y-4">
      <div 
        v-if="pendingRequests.length === 0" 
        class="p-10 rounded-2xl border text-center space-y-2"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
      >
        <Users :size="40" class="mx-auto opacity-30 text-slate-400" />
        <h3 class="text-sm font-black" :class="props.theme === 'light' ? 'text-slate-700' : 'text-slate-200'">
          Bekleyen Katılım Talebi Yok
        </h3>
        <p class="text-xs max-w-md mx-auto" :class="props.theme === 'light' ? 'text-slate-500' : 'text-slate-400'">
          Firmanızın VKN numarasını girerek katılım talebi gönderen çalışanlar burada listelenir.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="req in pendingRequests" 
          :key="req.requestId"
          class="p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">
                {{ req.fullName }}
              </span>
              <span class="text-[11px] text-slate-500">({{ req.userEmail }})</span>
            </div>
            <p class="text-[11px]" :class="props.theme === 'light' ? 'text-slate-600' : 'text-slate-400'">
              Talep Edilen Yetki: <strong class="text-blue-500 font-bold">{{ req.requestedRole }}</strong>
              <span v-if="req.note" class="block text-slate-400 mt-0.5 italic">"{{ req.note }}"</span>
            </p>
            <span class="text-[10px] text-slate-400 block font-mono">
              {{ req.createdAt ? req.createdAt.slice(0, 16).replace('T', ' ') : '' }}
            </span>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button 
              type="button" 
              @click="handleJoinRequest(req, false)"
              class="px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer"
              :class="props.theme === 'light' ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
            >
              Reddet
            </button>
            <button 
              type="button" 
              @click="handleJoinRequest(req, true)"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check :size="13" />
              <span>Onayla & Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: YETKİ MATRİSİ (BÖLÜM 2.3) -->
    <div v-if="activeTab === 'matrix'" class="space-y-4">
      <div 
        class="rounded-2xl border overflow-hidden shadow-sm"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
      >
        <div 
          class="p-4 border-b flex items-center justify-between"
          :class="props.theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'"
        >
          <h3 class="text-xs font-black uppercase tracking-wider" :class="props.theme === 'light' ? 'text-slate-800' : 'text-slate-200'">
            Resmi Ürün Analizi Yetki Matrisi (Bölüm 2.3)
          </h3>
          <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-500/10 text-blue-500">
            RBAC Entegrasyonu
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead 
              class="border-b uppercase text-[10px] font-black"
              :class="props.theme === 'light' ? 'bg-slate-100/70 border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-400'"
            >
              <tr>
                <th class="py-3 px-4">İşlem</th>
                <th class="py-3 px-4 text-center">Firma Yön.</th>
                <th class="py-3 px-4 text-center">Satın Alma</th>
                <th class="py-3 px-4 text-center">Teklif Yetk.</th>
                <th class="py-3 px-4 text-center">Onaylayıcı</th>
                <th class="py-3 px-4 text-center">Görüntüleyici</th>
              </tr>
            </thead>
            <tbody 
              class="divide-y font-medium"
              :class="props.theme === 'light' ? 'divide-slate-100 text-slate-700' : 'divide-slate-800 text-slate-300'"
            >
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">Firma Kullanıcı Yönetimi</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">İhale Oluşturma</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">İhale Yayınlama / Onay</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-amber-500 font-bold">Politikaya Göre</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">Bağlayıcı Teklif Verme (BID)</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">Teknik Değerlendirme</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">Kesin Sonuç Onayı (AWD)</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-amber-500 font-bold">Politikaya Göre</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-500 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr class="bg-red-500/10 border-t border-red-500/20">
                <td class="py-3 px-4 font-bold text-red-500">Teklif Tutarını Doğrudan Değiştirme (BID-007)</td>
                <td class="py-3 px-4 text-center text-red-500 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-500 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-500 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-500 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-500 font-black">⛔ Yasak</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: DENETİM GÜNLÜĞÜ (AUDIT LOG) -->
    <div v-if="activeTab === 'audit'" class="space-y-4">
      <div 
        class="rounded-2xl border overflow-hidden shadow-sm"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'"
      >
        <div 
          class="p-4 border-b flex items-center justify-between"
          :class="props.theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'"
        >
          <h3 class="text-xs font-black uppercase tracking-wider" :class="props.theme === 'light' ? 'text-slate-800' : 'text-slate-200'">
            Firma Güvenlik & Yetki Denetim İzi (SEC-006, SEC-007)
          </h3>
          <span class="text-[10px] text-slate-400 font-mono font-bold">Değiştirilemez Log Kaydı</span>
        </div>
        <div 
          class="divide-y text-xs"
          :class="props.theme === 'light' ? 'divide-slate-100' : 'divide-slate-800'"
        >
          <div v-if="auditLogs.length === 0" class="p-8 text-center text-slate-400">
            Henüz kaydedilmiş denetim kaydı bulunmuyor.
          </div>
          <div v-for="(log, idx) in auditLogs" :key="idx" class="p-4 flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="font-black" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">
                {{ log.action }}
              </span>
              <p class="text-[11px] text-slate-400">
                Aktör: <strong :class="props.theme === 'light' ? 'text-slate-700' : 'text-slate-300'">{{ log.actor }}</strong> | Detay: 
                <code class="px-1.5 py-0.5 rounded font-mono text-[10px]"
                  :class="props.theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'">
                  {{ JSON.stringify(log.details || {}) }}
                </code>
              </p>
            </div>
            <span class="text-[10px] text-slate-400 shrink-0 font-mono">
              {{ log.timestamp ? log.timestamp.slice(0, 19).replace('T', ' ') : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: YENİ ÇALIŞAN DAVET ET (USR-003) -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        class="rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn text-left border"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-white'"
      >
        <div class="flex items-center justify-between border-b pb-3"
          :class="props.theme === 'light' ? 'border-slate-100' : 'border-slate-800'">
          <div>
            <h3 class="text-base font-black" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">
              Yeni Çalışan Davet Et
            </h3>
            <p class="text-[11px] text-slate-400">Firmanız adına işlem yapacak yetkiliyi sisteme tanımlayın.</p>
          </div>
          <button @click="showInviteModal = false" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-400">AD SOYAD *</label>
            <input 
              v-model="inviteForm.fullName" 
              type="text" 
              placeholder="Örn: Ahmet Yılmaz" 
              class="w-full p-2.5 rounded-xl border text-xs outline-none font-bold"
              :class="props.theme === 'light' ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-600' : 'border-slate-700 bg-slate-950 text-white focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-400">KURUMSAL E-POSTA *</label>
            <input 
              v-model="inviteForm.email" 
              type="email" 
              placeholder="Örn: ahmet@sirketiniz.com" 
              class="w-full p-2.5 rounded-xl border text-xs outline-none"
              :class="props.theme === 'light' ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-600' : 'border-slate-700 bg-slate-950 text-white focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-400">FİRMA İÇİ ROL (USR-004) *</label>
            <select 
              v-model="inviteForm.role" 
              class="w-full p-2.5 rounded-xl border text-xs outline-none font-bold"
              :class="props.theme === 'light' ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-600' : 'border-slate-700 bg-slate-950 text-white focus:border-blue-500'"
            >
              <option v-for="r in ROLES" :key="r.code" :value="r.code">
                {{ r.title }}
              </option>
            </select>
            <p class="text-[10px] text-slate-400 mt-1">
              {{ getRoleObj(inviteForm.role).desc }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-400">DAVET NOTU (İSTEĞE BAĞLI)</label>
            <textarea 
              v-model="inviteForm.note" 
              rows="2" 
              placeholder="Örn: Satın alma ekibimize hoş geldiniz..." 
              class="w-full p-2.5 rounded-xl border text-xs outline-none"
              :class="props.theme === 'light' ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-600' : 'border-slate-700 bg-slate-950 text-white focus:border-blue-500'"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t"
          :class="props.theme === 'light' ? 'border-slate-100' : 'border-slate-800'">
          <button 
            type="button" 
            @click="showInviteModal = false" 
            class="px-4 py-2 rounded-xl border text-xs font-bold transition cursor-pointer"
            :class="props.theme === 'light' ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="sendInvite" 
            :disabled="isUpdating"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <UserPlus :size="14" />
            <span>{{ isUpdating ? 'Gönderiliyor...' : 'Daveti Gönder' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: ROL DÜZENLE (USR-004) -->
    <div v-if="showRoleModal && selectedMember" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        class="rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-left border"
        :class="props.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-white'"
      >
        <div class="flex items-center justify-between border-b pb-3"
          :class="props.theme === 'light' ? 'border-slate-100' : 'border-slate-800'">
          <div>
            <h3 class="text-sm font-black" :class="props.theme === 'light' ? 'text-slate-900' : 'text-white'">
              Çalışan Rolünü Değiştir
            </h3>
            <span class="text-xs text-slate-400">{{ selectedMember.fullName }}</span>
          </div>
          <button @click="showRoleModal = false" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider mb-1 text-slate-400">YENİ ROL *</label>
            <select 
              v-model="roleForm.newRole" 
              class="w-full p-2.5 rounded-xl border text-xs outline-none font-bold"
              :class="props.theme === 'light' ? 'border-slate-200 bg-white text-slate-900 focus:border-blue-600' : 'border-slate-700 bg-slate-950 text-white focus:border-blue-500'"
            >
              <option v-for="r in ROLES" :key="r.code" :value="r.code">
                {{ r.title }}
              </option>
            </select>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            {{ getRoleObj(roleForm.newRole).desc }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t"
          :class="props.theme === 'light' ? 'border-slate-100' : 'border-slate-800'">
          <button 
            type="button" 
            @click="showRoleModal = false" 
            class="px-4 py-2 rounded-xl border text-xs font-bold transition cursor-pointer"
            :class="props.theme === 'light' ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="saveRoleUpdate" 
            :disabled="isUpdating"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow transition cursor-pointer disabled:opacity-50"
          >
            {{ isUpdating ? 'Kaydediliyor...' : 'Güncelle' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
