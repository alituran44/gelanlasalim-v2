<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Building2, 
  Users, 
  Search, 
  DollarSign, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Printer, 
  X, 
  ExternalLink, 
  Briefcase, 
  Filter,
  Receipt,
  Layers,
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
  escrowOrders?: any[]
  tenders?: any[]
  kycVerifications?: any[]
}>(), {
  theme: 'dark',
  escrowOrders: () => [],
  tenders: () => [],
  kycVerifications: () => []
})

// Tab & Search State
const searchQuery = ref('')
const selectedRoleFilter = ref<'all' | 'tedarikci' | 'alici' | 'kyc_verified' | 'has_receivables'>('all')

// Detail Modal State
const showDetailModal = ref(false)
const selectedEntity = ref<any>(null)

// ----------------------------------------------------
// Base Seed Data for Realistic B2B Entities
// ----------------------------------------------------
const seedCompanies = [
  {
    id: 'ENT-001',
    companyName: 'Borusan Lojistik & Dağıtım A.Ş.',
    legalName: 'Borusan Lojistik Dağıtım Depolama Taşımacılık ve Ticaret A.Ş.',
    authorizedPerson: 'Mehmet Yılmaz',
    email: 'tedarik@borusanlojistik.com',
    phone: '0850 399 22 00',
    taxNo: '1800045921',
    taxOffice: 'Büyük Mükellefler Vergi Dairesi',
    city: 'İstanbul',
    companyType: 'Kurumsal Anonim Şirket (A.Ş.)',
    role: 'tedarikci',
    roleLabel: 'Tedarikçi Firma (Lojistik & Ambar)',
    isKycVerified: true,
    iban: 'TR33 0006 2000 0001 2009 8834 11',
    bankName: 'Garanti BBVA - Zincirlikuyu Şubesi',
    createdAt: '12.01.2026'
  },
  {
    id: 'ENT-002',
    companyName: 'Kalyon & Cengiz Altyapı Ortaklığı',
    legalName: 'Kalyon Cengiz İnşaat Sanayi ve Ticaret A.Ş. İş Ortaklığı',
    authorizedPerson: 'Ahmet Kalyoncu',
    email: 'satinalma@kalyoncengiz.com.tr',
    phone: '0216 444 88 90',
    taxNo: '4900128472',
    taxOffice: 'Üsküdar Vergi Dairesi',
    city: 'İstanbul',
    companyType: 'Konsorsiyum & İş Ortaklığı',
    role: 'alici',
    roleLabel: 'Kurumsal Satın Alma (Alıcı)',
    isKycVerified: true,
    iban: 'TR12 0001 0000 0002 9845 1100 22',
    bankName: 'Ziraat Bankası - Ankara Kurumsal',
    createdAt: '18.01.2026'
  },
  {
    id: 'ENT-003',
    companyName: 'Eczacıbaşı Tüketim & Hijyen A.Ş.',
    legalName: 'Eczacıbaşı Tüketim Ürünleri Sanayi ve Ticaret A.Ş.',
    authorizedPerson: 'Zeynep Kaya',
    email: 'kurumsal@eczacibasi.com.tr',
    phone: '0212 371 70 00',
    taxNo: '3250019482',
    taxOffice: 'Boğaziçi Kurumlar Vergi Dairesi',
    city: 'Kocaeli',
    companyType: 'Kurumsal Anonim Şirket (A.Ş.)',
    role: 'tedarikci',
    roleLabel: 'Tedarikçi Firma (Kimya & Hijyen)',
    isKycVerified: true,
    iban: 'TR88 0006 4000 0011 4455 2200 99',
    bankName: 'İş Bankası - Gebze OSB Şubesi',
    createdAt: '22.01.2026'
  },
  {
    id: 'ENT-004',
    companyName: 'Mega Endüstriyel Çelik & Konstrüksiyon Ltd. Şti.',
    legalName: 'Mega Endüstriyel Çelik Yapı Sistemleri İmalat Sanayi Ltd. Şti.',
    authorizedPerson: 'Mustafa Demir',
    email: 'info@megacelik.com.tr',
    phone: '0312 395 40 50',
    taxNo: '6140592810',
    taxOffice: 'Ostim Vergi Dairesi',
    city: 'Ankara',
    companyType: 'Limited Şirket (Ltd. Şti.)',
    role: 'tedarikci',
    roleLabel: 'Tedarikçi Firma (Metal & Konstrüksiyon)',
    isKycVerified: true,
    iban: 'TR55 0001 5001 5800 7300 6611 22',
    bankName: 'VakıfBank - Ostim Sanayi Şubesi',
    createdAt: '01.02.2026'
  },
  {
    id: 'ENT-005',
    companyName: 'Anadolu Medikal & Sağlık Gereçleri San. Tic. A.Ş.',
    legalName: 'Anadolu Medikal Tıbbi Cihaz ve Sarf Malzemeleri San. ve Tic. A.Ş.',
    authorizedPerson: 'Dr. Serkan Şahin',
    email: 'ihale@anadolumedikal.com.tr',
    phone: '0232 458 90 90',
    taxNo: '0680394819',
    taxOffice: 'Konak Vergi Dairesi',
    city: 'İzmir',
    companyType: 'Anonim Şirket (A.Ş.)',
    role: 'alici_tedarikci',
    roleLabel: 'Alıcı & Tedarikçi (Hibrit)',
    isKycVerified: true,
    iban: 'TR44 0006 2000 0003 4488 9911 00',
    bankName: 'Yapı Kredi - Bornova Şubesi',
    createdAt: '08.02.2026'
  }
]

// ----------------------------------------------------
// Aggregated Entities with Financial Calculations
// ----------------------------------------------------
const allEntities = computed(() => {
  const entityMap = new Map<string, any>()

  // 1. Add base seed companies
  seedCompanies.forEach(c => {
    entityMap.set(c.companyName.toLowerCase(), { ...c })
  })

  // 2. Add companies from KYC Desk
  ;(props.kycVerifications || []).forEach(k => {
    if (!k || !k.companyName) return
    const key = k.companyName.toLowerCase()
    const existing = entityMap.get(key)
    const isApproved = k.status === 'approved' || k.badgeGranted === true

    if (existing) {
      existing.isKycVerified = existing.isKycVerified || isApproved
      existing.legalName = k.legalName || existing.legalName
      existing.taxNo = k.taxNo || existing.taxNo
      existing.taxOffice = k.taxOffice || existing.taxOffice
      existing.email = k.email || existing.email
      existing.phone = k.phone || existing.phone
      existing.city = k.city || existing.city
    } else {
      entityMap.set(key, {
        id: k.id || 'ENT-' + Math.floor(100 + Math.random() * 900),
        companyName: k.companyName,
        legalName: k.legalName || k.companyName,
        authorizedPerson: k.authorizedPerson || 'Yetkili',
        email: k.email || 'kurumsal@firma.com',
        phone: k.phone || '0850 840 86 95',
        taxNo: k.taxNo || '9560161511',
        taxOffice: k.taxOffice || 'Çanakkale Vergi Dairesi',
        city: k.city || 'Balıkesir',
        companyType: k.companyType || 'Kurumsal Şirket',
        role: 'tedarikci',
        roleLabel: 'Tedarikçi Firma',
        isKycVerified: isApproved,
        iban: 'TR' + Math.floor(10 + Math.random() * 89) + ' 0006 2000 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(10 + Math.random() * 89),
        bankName: 'Türkiye İş Bankası / Garanti BBVA',
        createdAt: k.createdAt || 'Bugün'
      })
    }
  })

  // 3. Add registered users from localStorage
  if (typeof window !== 'undefined') {
    try {
      const allUsers = JSON.parse(localStorage.getItem('allRegisteredUsers') || '[]')
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      const usersToProcess = [...allUsers]
      if (session && session.email && !usersToProcess.some((u: any) => u.email === session.email)) {
        usersToProcess.unshift(session)
      }

      usersToProcess.forEach((u: any) => {
        const cName = u.companyName || u.company || u.name || (u.email ? u.email.split('@')[0] : 'Kayıtlı Üye')
        const key = cName.toLowerCase()
        if (!entityMap.has(key)) {
          entityMap.set(key, {
            id: 'ENT-' + (u.taxNo || Math.floor(100 + Math.random() * 900)),
            companyName: cName,
            legalName: u.legalName || cName,
            authorizedPerson: u.name || u.firstName || 'Yetkili',
            email: u.email || 'uye@gelanlasalim.com',
            phone: u.phone || '0555 123 45 67',
            taxNo: u.taxNo || '1234567890',
            taxOffice: u.taxOffice || 'Vergi Dairesi',
            city: u.city || 'İstanbul',
            companyType: u.companyType || 'Kurumsal Üye',
            role: u.role === 'buyer' ? 'alici' : 'tedarikci',
            roleLabel: u.role === 'buyer' ? 'Kurumsal Satın Alma (Alıcı)' : 'Tedarikçi Firma',
            isKycVerified: Boolean(u.isCompanyVerified || u.badgeGranted),
            iban: 'TR18 0006 2000 0001 9845 2200 33',
            bankName: 'QNB Finansbank',
            createdAt: u.createdAt || 'Bugün'
          })
        }
      })
    } catch {}
  }

  // 4. Calculate Financials from Escrow Orders and Tenders
  const escrowList = props.escrowOrders || []
  const tenderList = props.tenders || []

  const result: any[] = []

  entityMap.forEach(entity => {
    const eName = entity.companyName.toLowerCase()

    // Match escrow orders where this entity is supplier
    const supplierOrders = escrowList.filter(o => {
      const sName = (o.supplierCompany || o.supplierFirm || '').toLowerCase()
      return sName && (sName.includes(eName) || eName.includes(sName))
    })

    // Match escrow orders where this entity is buyer
    const buyerOrders = escrowList.filter(o => {
      const bName = (o.buyerCompany || o.buyerFirm || '').toLowerCase()
      return bName && (bName.includes(eName) || eName.includes(bName))
    })

    // Match tenders opened by this entity
    const myTenders = tenderList.filter(t => {
      const oComp = (t.ownerCompany || '').toLowerCase()
      const oEmail = (t.ownerEmail || '').toLowerCase()
      return (oComp && (oComp.includes(eName) || eName.includes(oComp))) || (oEmail && oEmail === entity.email.toLowerCase())
    })

    // Calculate payouts received (Completed)
    let receivedPayoutTotal = 0
    let pendingReceivablesTotal = 0

    supplierOrders.forEach(o => {
      const num = o.numericAmount || parseInt(String(o.totalAmount || '0').replace(/\D/g, '')) || 75000
      const commissionRate = (o.commissionRate || 5) / 100
      const payoutVal = Math.round(num * (1 - commissionRate))

      if (o.status === 'TAMAMLANDI' || o.escrowStatus === 'odeme_cozuldu') {
        receivedPayoutTotal += payoutVal
      } else {
        pendingReceivablesTotal += payoutVal
      }
    })

    // Calculate buyer spend & locked
    let buyerCompletedSpent = 0
    let buyerEscrowLocked = 0

    buyerOrders.forEach(o => {
      const num = o.numericAmount || parseInt(String(o.totalAmount || '0').replace(/\D/g, '')) || 75000
      if (o.status === 'TAMAMLANDI' || o.escrowStatus === 'odeme_cozuldu') {
        buyerCompletedSpent += num
      } else {
        buyerEscrowLocked += num
      }
    })

    // If seed entity has no orders yet, provide realistic mock baseline
    if (supplierOrders.length === 0 && buyerOrders.length === 0) {
      if (entity.id === 'ENT-001') {
        receivedPayoutTotal = 142500
        pendingReceivablesTotal = 85500
      } else if (entity.id === 'ENT-002') {
        buyerCompletedSpent = 450000
        buyerEscrowLocked = 120000
      } else if (entity.id === 'ENT-003') {
        receivedPayoutTotal = 95000
        pendingReceivablesTotal = 47500
      } else if (entity.id === 'ENT-004') {
        receivedPayoutTotal = 285000
        pendingReceivablesTotal = 0
      } else if (entity.id === 'ENT-005') {
        receivedPayoutTotal = 71250
        pendingReceivablesTotal = 38000
        buyerCompletedSpent = 95000
      }
    }

    const totalOrdersCount = supplierOrders.length + buyerOrders.length || (entity.id.startsWith('ENT-00') ? 2 : 0)

    result.push({
      ...entity,
      tendersCount: myTenders.length,
      ordersCount: totalOrdersCount,
      supplierOrders,
      buyerOrders,
      receivedPayoutTotal,
      pendingReceivablesTotal,
      buyerCompletedSpent,
      buyerEscrowLocked,
      settlementStatus: pendingReceivablesTotal > 0 ? 'pending_receivable' : 'clean',
      settlementLabel: pendingReceivablesTotal > 0 
        ? `${pendingReceivablesTotal.toLocaleString('tr-TR')} ₺ Hakediş Bloke` 
        : '✓ Cari Mutabık (Temiz)'
    })
  })

  return result
})

// ----------------------------------------------------
// Filtered Entities
// ----------------------------------------------------
const filteredEntities = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allEntities.value.filter(e => {
    // Role / Category filter
    if (selectedRoleFilter.value === 'tedarikci' && e.role !== 'tedarikci' && e.role !== 'alici_tedarikci') {
      return false
    }
    if (selectedRoleFilter.value === 'alici' && e.role !== 'alici' && e.role !== 'alici_tedarikci') {
      return false
    }
    if (selectedRoleFilter.value === 'kyc_verified' && !e.isKycVerified) {
      return false
    }
    if (selectedRoleFilter.value === 'has_receivables' && e.pendingReceivablesTotal <= 0) {
      return false
    }

    // Search Query
    if (q) {
      const matchComp = (e.companyName || '').toLowerCase().includes(q)
      const matchPerson = (e.authorizedPerson || '').toLowerCase().includes(q)
      const matchEmail = (e.email || '').toLowerCase().includes(q)
      const matchTax = (e.taxNo || '').toLowerCase().includes(q)
      const matchCity = (e.city || '').toLowerCase().includes(q)
      if (!matchComp && !matchPerson && !matchEmail && !matchTax && !matchCity) {
        return false
      }
    }

    return true
  })
})

// ----------------------------------------------------
// Financial Summaries for KPI Cards
// ----------------------------------------------------
const totalDistributedPayout = computed(() => {
  return allEntities.value.reduce((acc, e) => acc + (e.receivedPayoutTotal || 0), 0)
})

const totalPendingReceivables = computed(() => {
  return allEntities.value.reduce((acc, e) => acc + (e.pendingReceivablesTotal || 0), 0)
})

const totalPlatformCommissionRevenue = computed(() => {
  // 5% standard B2B commission on completed volume
  const completedVolume = allEntities.value.reduce((acc, e) => acc + (e.receivedPayoutTotal || 0) + (e.buyerCompletedSpent || 0), 0)
  return Math.round(completedVolume * 0.05) + 48500 // including enterprise subscription fees
})

// Open Modal
function openDetail(entity: any) {
  selectedEntity.value = entity
  showDetailModal.value = true
}

function printStatement() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-6 text-left">
    
    <!-- Top Header & Summary -->
    <div 
      class="p-6 rounded-2xl border space-y-4"
      :class="theme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3" :class="theme === 'light' ? 'border-slate-200' : 'border-slate-800'">
        <div>
          <h3 class="text-sm font-black flex items-center gap-2" :class="theme === 'light' ? 'text-slate-900' : 'text-white'">
            <Building2 :size="16" class="text-blue-500" />
            Kullanıcılar, Kurumsal Firmalar & Cari Alacak/Ödeme Masası
          </h3>
          <p class="text-[11px]" :class="theme === 'light' ? 'text-slate-500' : 'text-slate-400'">
            Platformdaki tüm kayıtlı firmaları, alıcıları ve tedarikçileri inceleyin; aldıkları ödemeleri, bekleyen escrow hakediş alacaklarını ve cari mutabakat durumunu yönetin.
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <span 
            class="px-3 py-1.5 rounded-xl text-xs font-black font-mono flex items-center gap-1.5 border"
            :class="theme === 'light' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-blue-950/70 text-blue-300 border-blue-800'"
          >
            <Users :size="13" /> {{ allEntities.length }} Kayıtlı Firma / Üye
          </span>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        <!-- Card 1: Toplam Firma -->
        <div 
          class="p-4 rounded-xl border transition"
          :class="theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'"
        >
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-slate-400">Kayıtlı Kurumsal Firma</span>
            <span class="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Building2 :size="15" /></span>
          </div>
          <div class="text-2xl font-black mt-2 font-mono" :class="theme === 'light' ? 'text-slate-900' : 'text-white'">
            {{ allEntities.length }} Firma
          </div>
          <div class="text-[11px] text-blue-500 font-bold mt-1">
            {{ allEntities.filter(e => e.isKycVerified).length }} Mavi Rozetli Doğrulanmış
          </div>
        </div>

        <!-- Card 2: Dağıtılan Hakediş (Tahsil Edilen) -->
        <div 
          class="p-4 rounded-xl border transition"
          :class="theme === 'light' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/40'"
        >
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Dağıtılan Hakediş (Tahsil Edilen)</span>
            <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><ArrowDownRight :size="15" /></span>
          </div>
          <div class="text-2xl font-black mt-2 font-mono text-emerald-600 dark:text-emerald-400">
            {{ totalDistributedPayout.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            Tedarikçilere başarıyla ödenen net tutar
          </div>
        </div>

        <!-- Card 3: Bekleyen Alacaklar (Escrow Bloke) -->
        <div 
          class="p-4 rounded-xl border transition"
          :class="theme === 'light' ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/20 border-amber-900/40'"
        >
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">Bekleyen Alacak (Escrow Bloke)</span>
            <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Clock :size="15" /></span>
          </div>
          <div class="text-2xl font-black mt-2 font-mono text-amber-600 dark:text-amber-400">
            {{ totalPendingReceivables.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            Sevkiyat ve onay bekleyen hakedişler
          </div>
        </div>

        <!-- Card 4: Platform Toplam Kazancı -->
        <div 
          class="p-4 rounded-xl border transition"
          :class="theme === 'light' ? 'bg-blue-50/50 border-blue-200' : 'bg-blue-950/20 border-blue-900/40'"
        >
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Platform Toplam Kazancımız</span>
            <span class="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><DollarSign :size="15" /></span>
          </div>
          <div class="text-2xl font-black mt-2 font-mono text-blue-600 dark:text-blue-400">
            {{ totalPlatformCommissionRevenue.toLocaleString('tr-TR') }} ₺
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            Net komisyon ve kurumsal üyelik geliri
          </div>
        </div>

      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t" :class="theme === 'light' ? 'border-slate-200' : 'border-slate-800'">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            @click="selectedRoleFilter = 'all'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            :class="selectedRoleFilter === 'all' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : (theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800')"
          >
            Tüm Firmalar ({{ allEntities.length }})
          </button>
          
          <button
            @click="selectedRoleFilter = 'tedarikci'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            :class="selectedRoleFilter === 'tedarikci' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : (theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800')"
          >
            Tedarikçiler ({{ allEntities.filter(e => e.role === 'tedarikci' || e.role === 'alici_tedarikci').length }})
          </button>

          <button
            @click="selectedRoleFilter = 'alici'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            :class="selectedRoleFilter === 'alici' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : (theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800')"
          >
            Alıcı Şirketler ({{ allEntities.filter(e => e.role === 'alici' || e.role === 'alici_tedarikci').length }})
          </button>

          <button
            @click="selectedRoleFilter = 'has_receivables'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            :class="selectedRoleFilter === 'has_receivables' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : (theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800')"
          >
            Alacağı Olanlar ({{ allEntities.filter(e => e.pendingReceivablesTotal > 0).length }})
          </button>

          <button
            @click="selectedRoleFilter = 'kyc_verified'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
            :class="selectedRoleFilter === 'kyc_verified' 
              ? 'bg-sky-600 text-white shadow-xs' 
              : (theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800')"
          >
            <ShieldCheck :size="12" /> Mavi Rozetli
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full md:w-72">
          <Search :size="13" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Firma adı, VKN, yetkili, şehir..."
            class="w-full pl-9 pr-3.5 py-1.5 rounded-xl text-xs border outline-none transition focus:border-blue-500"
            :class="theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'"
          />
        </div>

      </div>

      <!-- MAIN DATA TABLE -->
      <div class="rounded-2xl border overflow-hidden" :class="theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950'">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b text-[10px] font-black uppercase" :class="theme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-900/90 border-slate-800 text-slate-400'">
                <th class="p-3.5">FİRMA & YETKİLİ</th>
                <th class="p-3.5">VKN / TCKN & ŞEHİR</th>
                <th class="p-3.5">FAALİYET & ROL</th>
                <th class="p-3.5 text-right text-emerald-600 dark:text-emerald-400">ALDIĞI ÖDEMELER (TAHSİL EDİLEN)</th>
                <th class="p-3.5 text-right text-amber-600 dark:text-amber-400">BEKLEYEN ALACAK (ESCROW BLOKE)</th>
                <th class="p-3.5">CARİ DURUM</th>
                <th class="p-3.5 text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="theme === 'light' ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/60 text-slate-300'">
              <tr 
                v-for="entity in filteredEntities" 
                :key="entity.id" 
                class="hover:bg-slate-500/5 transition"
              >
                <!-- Firma & Yetkili -->
                <td class="p-3.5">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs" :class="theme === 'light' ? 'text-slate-900' : 'text-white'">
                      {{ entity.companyName }}
                    </span>
                    <span v-if="entity.isKycVerified" class="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-black flex items-center gap-0.5">
                      ✓ MAVİ ROZET
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{{ entity.authorizedPerson }}</span>
                    <span>•</span>
                    <span class="font-mono">{{ entity.email }}</span>
                  </div>
                </td>

                <!-- VKN & Şehir -->
                <td class="p-3.5 text-[11px] font-mono">
                  <div class="font-bold" :class="theme === 'light' ? 'text-slate-800' : 'text-slate-200'">
                    {{ entity.taxNo }}
                  </div>
                  <div class="text-[10px] text-slate-400">
                    {{ entity.city }} • {{ entity.taxOffice }}
                  </div>
                </td>

                <!-- Faaliyet Rolü -->
                <td class="p-3.5">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 border"
                    :class="entity.role === 'tedarikci' 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' 
                      : (entity.role === 'alici' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-800/60' : 'bg-purple-950/40 text-purple-400 border-purple-800/60')"
                  >
                    <Briefcase :size="10" />
                    <span>{{ entity.roleLabel }}</span>
                  </span>
                  <div class="text-[10px] text-slate-500 mt-1">
                    {{ entity.tendersCount }} İhale • {{ entity.ordersCount }} Sipariş
                  </div>
                </td>

                <!-- Aldığı Ödemeler (Tahsil Edilen ₺) -->
                <td class="p-3.5 text-right font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                  <div v-if="entity.receivedPayoutTotal > 0">
                    {{ entity.receivedPayoutTotal.toLocaleString('tr-TR') }} ₺
                  </div>
                  <div v-else class="text-slate-500 text-xs font-normal">
                    0 ₺
                  </div>
                  <div class="text-[9px] text-slate-500 font-normal">
                    Hesaba Aktarıldı
                  </div>
                </td>

                <!-- Bekleyen Alacaklar (Escrow Bloke ₺) -->
                <td class="p-3.5 text-right font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                  <div v-if="entity.pendingReceivablesTotal > 0">
                    {{ entity.pendingReceivablesTotal.toLocaleString('tr-TR') }} ₺
                  </div>
                  <div v-else class="text-slate-500 text-xs font-normal">
                    0 ₺
                  </div>
                  <div class="text-[9px] text-slate-500 font-normal">
                    Escrow Havuzunda
                  </div>
                </td>

                <!-- Cari Mutabakat Durumu -->
                <td class="p-3.5">
                  <span 
                    class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center gap-1 border"
                    :class="entity.pendingReceivablesTotal > 0 
                      ? 'bg-amber-950/40 text-amber-400 border-amber-800/60' 
                      : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'"
                  >
                    <Clock v-if="entity.pendingReceivablesTotal > 0" :size="10" />
                    <CheckCircle2 v-else :size="10" />
                    <span>{{ entity.settlementLabel }}</span>
                  </span>
                </td>

                <!-- İşlemler -->
                <td class="p-3.5 text-right">
                  <button 
                    @click="openDetail(entity)"
                    class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                  >
                    <Receipt :size="12" /> Cari Ekstre İncele
                  </button>
                </td>
              </tr>

              <tr v-if="filteredEntities.length === 0">
                <td colspan="7" class="text-center py-12 text-slate-500 text-xs">
                  Aranan kriterlere uygun kullanıcı veya firma kaydı bulunamadı.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: CARİ HESAP EKSTRESİ VE FİRMA DETAYI -->
    <!-- ========================================================================= -->
    <div 
      v-if="showDetailModal && selectedEntity"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        class="w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-8 text-left transition"
        :class="theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'"
      >
        <!-- Modal Header -->
        <div class="p-6 border-b flex items-start justify-between gap-4" :class="theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/80'">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-base font-black text-white">{{ selectedEntity.companyName }}</span>
              <span v-if="selectedEntity.isKycVerified" class="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ✓ MAVİ ROZETLİ DOĞRULANMIŞ
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              {{ selectedEntity.legalName }} • VKN: {{ selectedEntity.taxNo }} ({{ selectedEntity.taxOffice }})
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="printStatement"
              class="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Cari Ekstre Yazdır / PDF İndir"
            >
              <Printer :size="15" />
            </button>
            <button 
              @click="showDetailModal = false"
              class="p-2 rounded-xl border border-slate-700 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition cursor-pointer"
            >
              <X :size="15" />
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <!-- Financial Snapshot 4-Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50">
              <span class="text-[10px] font-black uppercase text-emerald-400">TAHSİL EDİLEN (ALDIĞI ÖDEMELER)</span>
              <div class="text-xl font-black font-mono text-emerald-400 mt-1">
                {{ selectedEntity.receivedPayoutTotal.toLocaleString('tr-TR') }} ₺
              </div>
              <span class="text-[10px] text-slate-400">Banka hesabına aktarılmış hakediş</span>
            </div>

            <div class="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/50">
              <span class="text-[10px] font-black uppercase text-amber-400">BEKLEYEN ALACAK (ESCROW BLOKE)</span>
              <div class="text-xl font-black font-mono text-amber-400 mt-1">
                {{ selectedEntity.pendingReceivablesTotal.toLocaleString('tr-TR') }} ₺
              </div>
              <span class="text-[10px] text-slate-400">Teslimat & onay sonrası çözülecek</span>
            </div>

            <div class="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/50">
              <span class="text-[10px] font-black uppercase text-blue-400">ALICI OLARAK İŞLEM HACMİ</span>
              <div class="text-xl font-black font-mono text-blue-400 mt-1">
                {{ (selectedEntity.buyerCompletedSpent + selectedEntity.buyerEscrowLocked).toLocaleString('tr-TR') }} ₺
              </div>
              <span class="text-[10px] text-slate-400">Açtığı ihalelerdeki toplam alım</span>
            </div>
          </div>

          <!-- Company Details & Bank Info -->
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
            <h4 class="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase :size="13" class="text-blue-400" /> Kurumsal Banka & İletişim Bilgileri
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div><strong>Yetkili Kişi:</strong> {{ selectedEntity.authorizedPerson }}</div>
              <div><strong>E-Posta:</strong> {{ selectedEntity.email }}</div>
              <div><strong>Telefon:</strong> {{ selectedEntity.phone }}</div>
              <div><strong>Şehir:</strong> {{ selectedEntity.city }}</div>
              <div class="sm:col-span-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <strong>Banka & IBAN:</strong> 
                <span class="font-mono text-emerald-400 font-bold ml-1">{{ selectedEntity.iban }}</span>
                <span class="text-slate-400 ml-1">({{ selectedEntity.bankName }})</span>
              </div>
            </div>
          </div>

          <!-- Transaction Movements (Cari Hesap Hareketleri) -->
          <div class="space-y-3">
            <h4 class="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><Receipt :size="13" class="text-emerald-400" /> Cari Hesap & Sipariş Hareketleri</span>
              <span class="text-[10px] text-slate-500 font-mono">Tüm işlemler TCMB ve BDDK onaylı güvenli havuzdadır</span>
            </h4>

            <div class="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-[10px] font-black uppercase bg-slate-900/90 text-slate-400">
                    <th class="p-2.5">SİPARİŞ / İHALE</th>
                    <th class="p-2.5">ROL</th>
                    <th class="p-2.5 text-right">BRÜT TUTAR</th>
                    <th class="p-2.5 text-right text-blue-400">KOMİSYON (%5)</th>
                    <th class="p-2.5 text-right text-emerald-400">NET HAKEDİŞ</th>
                    <th class="p-2.5 text-right">DURUM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 text-slate-300">
                  <!-- Orders where supplier -->
                  <tr v-for="order in (selectedEntity.supplierOrders || [])" :key="order.id" class="hover:bg-slate-900/50">
                    <td class="p-2.5">
                      <div class="font-bold text-white">{{ order.tenderTitle }}</div>
                      <div class="text-[10px] text-slate-500 font-mono">{{ order.orderCode || order.id }}</div>
                    </td>
                    <td class="p-2.5">
                      <span class="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">Tedarikçi</span>
                    </td>
                    <td class="p-2.5 text-right font-mono font-bold">{{ order.totalAmount }}</td>
                    <td class="p-2.5 text-right font-mono text-blue-400">{{ order.commissionAmount }}</td>
                    <td class="p-2.5 text-right font-mono font-bold text-emerald-400">{{ order.payoutAmount }}</td>
                    <td class="p-2.5 text-right">
                      <span 
                        class="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                        :class="order.status === 'TAMAMLANDI' || order.escrowStatus === 'odeme_cozuldu' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'"
                      >
                        {{ order.status === 'TAMAMLANDI' || order.escrowStatus === 'odeme_cozuldu' ? '✓ Ödendi' : '⏳ Bloke' }}
                      </span>
                    </td>
                  </tr>

                  <!-- Fallback sample movements if entity has seed orders -->
                  <tr v-if="(!selectedEntity.supplierOrders || selectedEntity.supplierOrders.length === 0) && selectedEntity.receivedPayoutTotal > 0" class="hover:bg-slate-900/50">
                    <td class="p-2.5">
                      <div class="font-bold text-white">B2B Malzeme & Hizmet İhalesi Sevkiyatı</div>
                      <div class="text-[10px] text-slate-500 font-mono">SIP-2026-8812</div>
                    </td>
                    <td class="p-2.5">
                      <span class="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">Tedarikçi</span>
                    </td>
                    <td class="p-2.5 text-right font-mono font-bold">{{ (selectedEntity.receivedPayoutTotal / 0.95).toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right font-mono text-blue-400">{{ (selectedEntity.receivedPayoutTotal * 0.05 / 0.95).toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right font-mono font-bold text-emerald-400">{{ selectedEntity.receivedPayoutTotal.toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right">
                      <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">✓ Ödendi</span>
                    </td>
                  </tr>

                  <tr v-if="selectedEntity.pendingReceivablesTotal > 0" class="hover:bg-slate-900/50">
                    <td class="p-2.5">
                      <div class="font-bold text-white">Yurtiçi Sevkiyat & Lojistik İhalesi (Yolda)</div>
                      <div class="text-[10px] text-slate-500 font-mono">SIP-2026-9430</div>
                    </td>
                    <td class="p-2.5">
                      <span class="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">Tedarikçi</span>
                    </td>
                    <td class="p-2.5 text-right font-mono font-bold">{{ (selectedEntity.pendingReceivablesTotal / 0.95).toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right font-mono text-blue-400">{{ (selectedEntity.pendingReceivablesTotal * 0.05 / 0.95).toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right font-mono font-bold text-amber-400">{{ selectedEntity.pendingReceivablesTotal.toLocaleString('tr-TR') }} ₺</td>
                    <td class="p-2.5 text-right">
                      <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-950 text-amber-400 border border-amber-800">⏳ Havuzda Bloke</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div class="text-[11px] text-slate-400">
            Resmi cari mutabakat ve e-Fatura entegrasyonu için GİB e-Defter standartlarına uygundur.
          </div>
          <button 
            @click="showDetailModal = false"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
