<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Sparkles, 
  Building2, 
  Mail, 
  Clock, 
  AlertCircle,
  FileCheck,
  Shield
} from 'lucide-vue-next'
import { useUserSession } from '~/composables/useUserSession'

definePageMeta({
  layout: 'dashboard'
})

const { userSession, userEmail, userName } = useUserSession()

const activeTab = ref<'members' | 'requests' | 'matrix' | 'audit'>('members')
const isLoading = ref(true)
const companyData = ref<any>(null)
const currentMember = ref<any>(null)

const showInviteModal = ref(false)
const showRoleModal = ref(false)
const selectedMember = ref<any>(null)

const inviteForm = ref({
  fullName: '',
  email: '',
  role: 'TEKLİF_YETKİLİSİ' as string,
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
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    code: 'SATIN_ALMA',
    title: 'Satın Alma Kullanıcısı',
    desc: 'İhale oluşturma, katılımcı yönetimi, teklif toplama ve teknik/ticari değerlendirme yetkilisi.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    code: 'İHALE_ONAYLAYICISI',
    title: 'İhale Onaylayıcısı',
    desc: 'Taslak ihalelerin yayınlanması öncesinde şirket içi idari ve bütçe kontrolünü onaylar.',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    code: 'TEKNİK_DEĞERLENDİRİCİ',
    title: 'Teknik Değerlendirici',
    desc: 'Gelen tekliflerin teknik şartname ve numune uygunluğunu denetler, gerekçeli ret/kabul verir.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    code: 'TEKLİF_YETKİLİSİ',
    title: 'Satıcı / Teklif Yetkilisi',
    desc: 'Firma adına ihalelere katılma, bağlayıcı ticari teklif verme ve revize fiyat sunma yetkilisi.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    code: 'SONUÇ_ONAYLAYICISI',
    title: 'Sonuç Onaylayıcısı',
    desc: 'İhale bitiminde kazanan teklifi nihai olarak onaylar ve ihale sonuç tutanağını kesinleştirir.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    code: 'GÖRÜNTÜLEYİCİ',
    title: 'Görüntüleyici (Salt Okunur)',
    desc: 'Yalnızca yetkili olduğu ihale ve teklif kayıtlarını inceler; ticari teklif sunamaz veya ihale açamaz.',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
  }
]

async function loadCompanyStatus() {
  isLoading.value = true
  try {
    const res: any = await $fetch('/api/company/status', {
      query: { email: userEmail.value || 'ihalecib@gmail.com' }
    })
    if (res?.company) {
      companyData.value = res.company
      currentMember.value = res.member || res.company.members[0]
    }
  } catch (e) {
    console.warn('Company status fetch error:', e)
  } finally {
    isLoading.value = false
  }
}

const activeMembers = computed(() => {
  return companyData.value?.members?.filter((m: any) => m.status === 'ACTIVE') || []
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

  try {
    const res: any = await $fetch('/api/company/join-request', {
      method: 'POST',
      body: {
        vkn: companyData.value?.vkn || '9560161511',
        userEmail: inviteForm.value.email,
        fullName: inviteForm.value.fullName,
        requestedRole: inviteForm.value.role,
        note: inviteForm.value.note
      }
    })

    // Otomatik onaylama (Yönetici davet ettiği için)
    if (res?.request?.requestId) {
      await $fetch('/api/company/join-request', {
        method: 'PATCH',
        body: {
          vkn: companyData.value?.vkn || '9560161511',
          requestId: res.request.requestId,
          approved: true,
          adminEmail: userEmail.value || 'ihalecib@gmail.com',
          assignedRole: inviteForm.value.role
        }
      })
    }

    showInviteModal.value = false
    await loadCompanyStatus()
    alert(`🎉 Davet Başarılı (Kural USR-003)!\n\n"${inviteForm.value.fullName}" (${inviteForm.value.email}) firmanıza "${inviteForm.value.role}" yetkisiyle başarıyla eklendi.`)
  } catch (e: any) {
    alert('Davet gönderilemedi: ' + (e?.data?.message || e?.message || 'Bilinmeyen hata'))
  }
}

function openEditRoleModal(member: any) {
  selectedMember.value = member
  roleForm.value.newRole = member.role
  showRoleModal.value = true
}

async function saveRoleUpdate() {
  if (!selectedMember.value) return
  try {
    await $fetch('/api/company/members', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || '9560161511',
        targetEmail: selectedMember.value.userEmail,
        newRole: roleForm.value.newRole,
        adminEmail: userEmail.value || 'ihalecib@gmail.com'
      }
    })
    showRoleModal.value = false
    await loadCompanyStatus()
    alert(`✅ Rol Güncellendi (Kural USR-004)!\n\n${selectedMember.value.fullName} için yeni rol: "${roleForm.value.newRole}" olarak kaydedildi.`)
  } catch (e: any) {
    alert('Rol güncellenemedi: ' + (e?.data?.message || e?.message))
  }
}

async function removeMember(member: any) {
  if (member.role === 'FİRMA_YÖNETİCİSİ') {
    alert('Firma Yöneticisi hesabı silinemez.')
    return
  }
  const confirmed = confirm(`"${member.fullName}" (${member.userEmail}) çalışanının firma erişim yetkisini iptal etmek istediğinize emin misiniz? (Kural USR-006)`)
  if (!confirmed) return

  try {
    await $fetch('/api/company/members', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || '9560161511',
        targetEmail: member.userEmail,
        action: 'REMOVE',
        adminEmail: userEmail.value || 'ihalecib@gmail.com'
      }
    })
    await loadCompanyStatus()
    alert(`🔒 Erişim İptal Edildi (Kural USR-006)!\n\n${member.fullName} firma hesabından çıkarıldı, aktif oturumları sonlandırıldı.`)
  } catch (e: any) {
    alert('İşlem başarısız: ' + (e?.data?.message || e?.message))
  }
}

async function handleJoinRequest(req: any, approved: boolean) {
  try {
    await $fetch('/api/company/join-request', {
      method: 'PATCH',
      body: {
        vkn: companyData.value?.vkn || '9560161511',
        requestId: req.requestId,
        approved,
        adminEmail: userEmail.value || 'ihalecib@gmail.com',
        assignedRole: req.requestedRole
      }
    })
    await loadCompanyStatus()
    alert(approved ? `✅ Katılım Talebi Onaylandı (Kural VER-006)!` : `⛔ Katılım Talebi Reddedildi.`)
  } catch (e: any) {
    alert('Talep işlenemedi: ' + (e?.data?.message || e?.message))
  }
}

function getRoleObj(roleCode: string) {
  return ROLES.find(r => r.code === roleCode) || {
    code: roleCode,
    title: roleCode,
    desc: 'Standart Çalışan',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
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
  link.setAttribute('download', `ekip_yetki_listesi_${companyData.value?.vkn || 'vkn'}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  loadCompanyStatus()
})
</script>

<template>
  <div class="p-4 sm:p-6 max-w-6xl mx-auto text-left space-y-6 animate-fadeIn">
    
    <!-- ÜST BAŞLIK & FİRMA RESMİ KİMLİK KARTI -->
    <div class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1">
            <Building2 :size="12" />
            <span>B2B KURUMSAL KİMLİK (BÖLÜM 2 & 5)</span>
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
            <ShieldCheck :size="12" />
            <span>{{ companyData?.verificationBadge || '✓ GİB Doğrulanmış Mükellef' }}</span>
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900">
          {{ companyData?.companyTitle || 'İhaleciBurada Ticari İşletmesi' }}
        </h1>
        <p class="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
          <span>🏛️ <strong>Vergi Dairesi:</strong> {{ companyData?.taxOffice || 'Çanakkale Vergi Dairesi' }}</span>
          <span>💳 <strong>VKN/TCKN:</strong> {{ companyData?.vkn || '9560161511' }}</span>
          <span>📮 <strong>KEP:</strong> {{ companyData?.kepAddress || 'hasanhuseyin.yildirim.17@hs01.kep.tr' }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button 
          type="button"
          @click="exportTeamCsv"
          class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs" 
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
    <div class="flex border-b border-slate-200 overflow-x-auto gap-2">
      <button 
        type="button"
        @click="activeTab = 'members'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'members' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <Users :size="14" />
        <span>Ekip Üyeleri ({{ activeMembers.length }})</span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'requests'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <Clock :size="14" />
        <span>Katılım Talepleri ({{ pendingRequests.length }})</span>
        <span v-if="pendingRequests.length > 0" class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'matrix'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'matrix' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <Shield :size="14" />
        <span>Yetki Matrisi (Bölüm 2.3)</span>
      </button>

      <button 
        type="button"
        @click="activeTab = 'audit'"
        class="pb-3 px-4 text-xs font-black transition relative flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'audit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'"
      >
        <FileCheck :size="14" />
        <span>Denetim Günlüğü (Audit Log)</span>
      </button>
    </div>

    <!-- TAB 1: EKİP ÜYELERİ LİSTESİ -->
    <div v-if="activeTab === 'members'" class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th class="py-3 px-4">Çalışan</th>
                <th class="py-3 px-4">E-Posta</th>
                <th class="py-3 px-4">Firma İçi Rol (USR-004)</th>
                <th class="py-3 px-4">Durum</th>
                <th class="py-3 px-4">Kayıt Tarihi</th>
                <th class="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="member in activeMembers" :key="member.userId" class="hover:bg-slate-50/70 transition">
                <td class="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                    {{ member.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <span class="block">{{ member.fullName }}</span>
                    <span v-if="member.userEmail === userEmail" class="text-[9px] text-blue-600 font-bold">(Siz)</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-slate-600">
                  {{ member.userEmail }}
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-black" :class="getRoleObj(member.role).badgeColor">
                    {{ getRoleObj(member.role).title }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                    ✓ Aktif
                  </span>
                </td>
                <td class="py-3.5 px-4 text-slate-500 text-[11px]">
                  {{ member.joinedAt?.slice(0, 10) || '2026-01-15' }}
                </td>
                <td class="py-3.5 px-4 text-right space-x-1">
                  <button 
                    type="button" 
                    @click="openEditRoleModal(member)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer" 
                    title="Yetki/Rol Değiştir (USR-004)"
                  >
                    <Edit3 :size="14" />
                  </button>
                  <button 
                    type="button" 
                    @click="removeMember(member)"
                    :disabled="member.role === 'FİRMA_YÖNETİCİSİ'"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
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
      <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3 shadow-2xs">
        <ShieldCheck :size="20" class="text-blue-600 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h4 class="font-black text-blue-900">Kurumsal Güvenlik & Yetki Ayrıştırma İlkesi (USR-001 ~ USR-006)</h4>
          <p class="text-[11px] text-blue-900/90 leading-relaxed">
            Kullanıcının sisteme üye olması tek başına firmanız adına ihale açma veya teklif verme hakkı doğurmaz. Teklif verebilmek için çalışanın <strong>"Teklif Yetkilisi"</strong> veya <strong>"Satın Alma"</strong> yetkisine sahip olması ve firmanızın onaylı VKN'si gereklidir (Kural VER-001 & VER-004).
          </p>
        </div>
      </div>
    </div>

    <!-- TAB 2: BEKLEYEN KATILIM TALEPLERİ (VER-006) -->
    <div v-if="activeTab === 'requests'" class="space-y-4">
      <div v-if="pendingRequests.length === 0" class="p-8 rounded-2xl border border-slate-200 bg-white text-center space-y-2">
        <Users :size="36" class="mx-auto text-slate-300" />
        <h3 class="text-sm font-black text-slate-700">Bekleyen Katılım Talebi Yok</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Firmanızın VKN numarasını girerek katılım talebi gönderen çalışanlar burada listelenir.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="req in pendingRequests" 
          :key="req.requestId"
          class="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-900">{{ req.fullName }}</span>
              <span class="text-[11px] text-slate-500">({{ req.userEmail }})</span>
            </div>
            <p class="text-[11px] text-slate-600">
              Talep Edilen Yetki: <strong class="text-blue-700">{{ req.requestedRole }}</strong>
              <span v-if="req.note" class="block text-slate-400 mt-0.5 italic">"{{ req.note }}"</span>
            </p>
            <span class="text-[10px] text-slate-400 block">{{ req.createdAt?.slice(0, 16).replace('T', ' ') }}</span>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button 
              type="button" 
              @click="handleJoinRequest(req, false)"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
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
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div class="p-4 bg-slate-50 border-b border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
            Resmi Ürün Analizi Yetki Matrisi (Bölüm 2.3)
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase text-[10px] font-black">
              <tr>
                <th class="py-3 px-4">İşlem</th>
                <th class="py-3 px-4 text-center">Firma Yön.</th>
                <th class="py-3 px-4 text-center">Satın Alma</th>
                <th class="py-3 px-4 text-center">Teklif Yetk.</th>
                <th class="py-3 px-4 text-center">Onaylayıcı</th>
                <th class="py-3 px-4 text-center">Görüntüleyici</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Firma Kullanıcı Yönetimi</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">İhale Oluşturma</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">İhale Yayınlama / Onay</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-amber-600 font-bold">Politikaya Göre</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Bağlayıcı Teklif Verme (BID)</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Teknik Değerlendirme</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Kesin Sonuç Onayı (AWD)</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-amber-600 font-bold">Politikaya Göre</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
                <td class="py-3 px-4 text-center text-emerald-600 font-black">✓ Evet</td>
                <td class="py-3 px-4 text-center text-red-500 font-bold">✗ Hayır</td>
              </tr>
              <tr class="bg-red-50/50">
                <td class="py-3 px-4 font-bold text-red-900">Teklif Tutarını Doğrudan Değiştirme (BID-007)</td>
                <td class="py-3 px-4 text-center text-red-600 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-600 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-600 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-600 font-black">⛔ Yasak</td>
                <td class="py-3 px-4 text-center text-red-600 font-black">⛔ Yasak</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: DENETİM GÜNLÜĞÜ (AUDIT LOG) -->
    <div v-if="activeTab === 'audit'" class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
            Firma Güvenlik & Yetki Denetim İzi (SEC-006, SEC-007)
          </h3>
          <span class="text-[10px] text-slate-500 font-bold">Değiştirilemez Log Kaydı</span>
        </div>
        <div class="divide-y divide-slate-100 text-xs">
          <div v-for="(log, idx) in auditLogs" :key="idx" class="p-4 flex items-start justify-between gap-3">
            <div class="space-y-1">
              <span class="font-black text-slate-900">{{ log.action }}</span>
              <p class="text-[11px] text-slate-500">
                Aktör: <strong>{{ log.actor }}</strong> | Detay: <code class="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">{{ JSON.stringify(log.details || {}) }}</code>
              </p>
            </div>
            <span class="text-[10px] text-slate-400 shrink-0 font-mono">{{ log.timestamp?.slice(0, 19).replace('T', ' ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: YENİ ÇALIŞAN DAVET ET (USR-003) -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 class="text-base font-black text-slate-900">Yeni Çalışan Davet Et</h3>
            <p class="text-[11px] text-slate-500">Firmanız adına işlem yapacak yetkiliyi sisteme tanımlayın.</p>
          </div>
          <button @click="showInviteModal = false" class="text-slate-400 hover:text-slate-700 p-1">
            <X :size="18" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">AD SOYAD *</label>
            <input 
              v-model="inviteForm.fullName" 
              type="text" 
              placeholder="Örn: Ahmet Yılmaz" 
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600 font-bold"
            />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">KURUMSAL E-POSTA *</label>
            <input 
              v-model="inviteForm.email" 
              type="email" 
              placeholder="Örn: ahmet@sirketiniz.com" 
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">FİRMA İÇİ ROL (USR-004) *</label>
            <select 
              v-model="inviteForm.role" 
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold focus:border-blue-600"
            >
              <option v-for="r in ROLES" :key="r.code" :value="r.code">
                {{ r.title }}
              </option>
            </select>
            <p class="text-[10px] text-slate-500 mt-1">
              {{ getRoleObj(inviteForm.role).desc }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">DAVET NOTU (İSTEĞE BAĞLI)</label>
            <textarea 
              v-model="inviteForm.note" 
              rows="2" 
              placeholder="Örn: Satın alma ekibimize hoş geldiniz..." 
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showInviteModal = false" 
            class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="sendInvite" 
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus :size="14" />
            <span>Daveti Gönder</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: ROL DÜZENLE (USR-004) -->
    <div v-if="showRoleModal && selectedMember" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-left">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 class="text-sm font-black text-slate-900">Çalışan Rolünü Değiştir</h3>
            <span class="text-xs text-slate-500">{{ selectedMember.fullName }}</span>
          </div>
          <button @click="showRoleModal = false" class="text-slate-400 hover:text-slate-700 p-1">
            <X :size="16" />
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">YENİ ROL *</label>
            <select 
              v-model="roleForm.newRole" 
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none bg-white font-bold focus:border-blue-600"
            >
              <option v-for="r in ROLES" :key="r.code" :value="r.code">
                {{ r.title }}
              </option>
            </select>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            {{ getRoleObj(roleForm.newRole).desc }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showRoleModal = false" 
            class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            @click="saveRoleUpdate" 
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow transition cursor-pointer"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
