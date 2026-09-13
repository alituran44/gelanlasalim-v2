import { ref, computed } from 'vue'
import { useCmsData } from '~/composables/useCmsData'

export interface AgencySettings {
  agentListingVisibility: 'own_only' | 'all_office'
  allowAgentDirectPublish: boolean
  notifyBrokerOnListingCreated: boolean
  enforceAgentQuota: boolean
}

export interface RealEstateAgency {
  id: string
  name: string
  tradeTitle: string
  taxNumber: string
  taxOffice: string
  ttbLicenseNumber: string
  city: string
  district: string
  address: string
  phone: string
  logoUrl?: string
  creditBalance: number
  subscriptionPlan: 'kurumsal_starter' | 'kurumsal_pro' | 'broker_network'
  subscriptionExpiresAt: string
  agentsCount: number
  activeListingsCount: number
  settings: AgencySettings
}

export interface RealEstateAgent {
  id: string
  agencyId: string
  name: string
  surname: string
  email: string
  phone: string
  avatarUrl?: string
  title: string
  mykCertificateNo: string
  role: 'agency_admin' | 'agent'
  monthlyCreditQuota?: number
  usedCreditsThisMonth: number
  isActive: boolean
  createdAt: string
}

export interface CreditTransaction {
  id: string
  agencyId: string
  agentId?: string
  agentName?: string
  type: 'TOPUP' | 'LISTING_CONSUME' | 'LISTING_REFUND' | 'ADMIN_ADJUST'
  creditsChange: number
  unitPriceNet: number
  vatAmount: number
  totalChargedTry: number
  balanceAfter: number
  tenderOrListingId?: string
  description: string
  createdAt: string
}

const DEFAULT_AGENCY: RealEstateAgency = {
  id: 'agency-remax-01',
  name: 'Remax Cadde Gayrimenkul',
  tradeTitle: 'Remax Cadde Emlak Danışmanlık A.Ş.',
  taxNumber: '1234567890',
  taxOffice: 'Kadıköy V.D.',
  ttbLicenseNumber: '3400124',
  city: 'İstanbul',
  district: 'Kadıköy',
  address: 'Bağdat Caddesi No: 242/4',
  phone: '0216 411 00 00',
  creditBalance: 42,
  subscriptionPlan: 'kurumsal_pro',
  subscriptionExpiresAt: '2026-12-31',
  agentsCount: 4,
  activeListingsCount: 18,
  settings: {
    agentListingVisibility: 'own_only',
    allowAgentDirectPublish: true,
    notifyBrokerOnListingCreated: true,
    enforceAgentQuota: false
  }
}

const DEFAULT_AGENTS: RealEstateAgent[] = [
  {
    id: 'agent-1',
    agencyId: 'agency-remax-01',
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'ahmet.yilmaz@remax-cadde.com',
    phone: '0532 111 22 33',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
    title: 'Lüks Konut & Villa Uzmanı',
    mykCertificateNo: 'YB0217/17UY0333-5/00/1234',
    role: 'agency_admin',
    usedCreditsThisMonth: 8,
    isActive: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'agent-2',
    agencyId: 'agency-remax-01',
    name: 'Selin',
    surname: 'Kaya',
    email: 'selin.kaya@remax-cadde.com',
    phone: '0533 444 55 66',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    title: 'Arsa & Ticari Gayrimenkul Danışmanı',
    mykCertificateNo: 'YB0217/17UY0333-5/00/5678',
    role: 'agent',
    usedCreditsThisMonth: 12,
    isActive: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'agent-3',
    agencyId: 'agency-remax-01',
    name: 'Burak',
    surname: 'Demir',
    email: 'burak.demir@remax-cadde.com',
    phone: '0535 777 88 99',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    title: 'Konut & Site Projeleri Uzmanı',
    mykCertificateNo: 'YB0217/17UY0333-5/00/9012',
    role: 'agent',
    usedCreditsThisMonth: 5,
    isActive: true,
    createdAt: '2026-02-20'
  },
  {
    id: 'agent-4',
    agencyId: 'agency-remax-01',
    name: 'Elif',
    surname: 'Öztürk',
    email: 'elif.ozturk@remax-cadde.com',
    phone: '0530 222 33 44',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    title: 'Yatırım & Kentsel Dönüşüm Danışmanı',
    mykCertificateNo: 'YB0217/17UY0333-5/00/3456',
    role: 'agent',
    usedCreditsThisMonth: 3,
    isActive: true,
    createdAt: '2026-03-01'
  }
]

const DEFAULT_LEDGER: CreditTransaction[] = [
  {
    id: 'tx-101',
    agencyId: 'agency-remax-01',
    type: 'TOPUP',
    creditsChange: 50,
    unitPriceNet: 30.00,
    vatAmount: 300.00,
    totalChargedTry: 1800.00,
    balanceAfter: 50,
    description: '50 İlanlık Kurumsal Kontör Yüklemesi (PayTR)',
    createdAt: '2026-03-01 10:30'
  },
  {
    id: 'tx-102',
    agencyId: 'agency-remax-01',
    agentId: 'agent-1',
    agentName: 'Ahmet Yılmaz',
    type: 'LISTING_CONSUME',
    creditsChange: -1,
    unitPriceNet: 30.00,
    vatAmount: 6.00,
    totalChargedTry: 36.00,
    balanceAfter: 49,
    tenderOrListingId: 'listing-cadde-3-1',
    description: 'Caddebostan 3+1 Lüks Daire (İlan Kontör Düşümü)',
    createdAt: '2026-03-02 14:15'
  },
  {
    id: 'tx-103',
    agencyId: 'agency-remax-01',
    agentId: 'agent-2',
    agentName: 'Selin Kaya',
    type: 'LISTING_CONSUME',
    creditsChange: -1,
    unitPriceNet: 30.00,
    vatAmount: 6.00,
    totalChargedTry: 36.00,
    balanceAfter: 48,
    tenderOrListingId: 'listing-catalca-arsa',
    description: 'Çatalca 500m2 Konut İmarlı Arsa (İlan Kontör Düşümü)',
    createdAt: '2026-03-04 11:40'
  }
]

const currentAgency = ref<RealEstateAgency>(JSON.parse(JSON.stringify(DEFAULT_AGENCY)))
const agentsList = ref<RealEstateAgent[]>(JSON.parse(JSON.stringify(DEFAULT_AGENTS)))
const creditLedger = ref<CreditTransaction[]>(JSON.parse(JSON.stringify(DEFAULT_LEDGER)))
const isInitialized = ref(false)

function syncToLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('agency_profile', JSON.stringify(currentAgency.value))
    localStorage.setItem('agency_agents', JSON.stringify(agentsList.value))
    localStorage.setItem('agency_credit_ledger', JSON.stringify(creditLedger.value))
  } catch (e) {
    console.warn('Failed to save agency state to localStorage:', e)
  }
}

function loadFromLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    const savedAgency = localStorage.getItem('agency_profile')
    const savedAgents = localStorage.getItem('agency_agents')
    const savedLedger = localStorage.getItem('agency_credit_ledger')

    if (savedAgency) {
      const parsed = JSON.parse(savedAgency)
      currentAgency.value = { 
        ...DEFAULT_AGENCY, 
        ...parsed,
        settings: {
          ...DEFAULT_AGENCY.settings,
          ...(parsed.settings || {})
        }
      }
    }
    if (savedAgents) agentsList.value = JSON.parse(savedAgents)
    if (savedLedger) creditLedger.value = JSON.parse(savedLedger)
  } catch (e) {
    console.warn('Failed to load agency state from localStorage:', e)
  }
  isInitialized.value = true
}

export function useAgencyManagement() {
  const { cmsData } = useCmsData()

  if (typeof window !== 'undefined' && !isInitialized.value) {
    loadFromLocalStorage()
  }

  const listingPriceNet = computed(() => {
    return cmsData.value.pricing?.realEstate?.listingUnitPriceNet ?? 30.00
  })

  const vatRate = computed(() => {
    return cmsData.value.pricing?.realEstate?.vatRate ?? 20
  })

  const listingPriceGross = computed(() => {
    const net = Number(listingPriceNet.value) || 30.00
    const vat = Number(vatRate.value) || 20
    return Number((net * (1 + vat / 100)).toFixed(2))
  })

  function addAgent(agentData: Omit<RealEstateAgent, 'id' | 'agencyId' | 'usedCreditsThisMonth' | 'createdAt'>) {
    const newAgent: RealEstateAgent = {
      ...agentData,
      id: 'agent-' + Date.now(),
      agencyId: currentAgency.value.id,
      usedCreditsThisMonth: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    agentsList.value.unshift(newAgent)
    currentAgency.value.agentsCount = agentsList.value.length
    syncToLocalStorage()
    return newAgent
  }

  function updateAgent(agentId: string, patch: Partial<RealEstateAgent>) {
    const idx = agentsList.value.findIndex(a => a.id === agentId)
    if (idx !== -1) {
      agentsList.value[idx] = { ...agentsList.value[idx], ...patch }
      syncToLocalStorage()
    }
  }

  function deleteAgent(agentId: string) {
    agentsList.value = agentsList.value.filter(a => a.id !== agentId)
    currentAgency.value.agentsCount = agentsList.value.length
    syncToLocalStorage()
  }

  function addAgentsBulk(parsedAgents: Array<Omit<RealEstateAgent, 'id' | 'agencyId' | 'usedCreditsThisMonth' | 'createdAt'>>) {
    const added: RealEstateAgent[] = []
    parsedAgents.forEach(item => {
      const agent: RealEstateAgent = {
        ...item,
        id: 'agent-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        agencyId: currentAgency.value.id,
        usedCreditsThisMonth: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      agentsList.value.unshift(agent)
      added.push(agent)
    })
    currentAgency.value.agentsCount = agentsList.value.length
    syncToLocalStorage()
    return added
  }

  function consumeListingCredit(agentId: string, listingId: string, listingTitle: string): { success: boolean; message: string; balanceAfter?: number } {
    if (currentAgency.value.creditBalance < 1) {
      return {
        success: false,
        message: 'Yetersiz Bakiye! İlan açmak için ofis cüzdanında en az 1 kontör (' + listingPriceGross.value + ' TL KDV dahil) bulunmalıdır. Lütfen kontör yükleyiniz.'
      }
    }

    currentAgency.value.creditBalance -= 1
    currentAgency.value.activeListingsCount += 1

    const agent = agentsList.value.find(a => a.id === agentId)
    if (agent) {
      agent.usedCreditsThisMonth = (agent.usedCreditsThisMonth || 0) + 1
    }

    const net = listingPriceNet.value
    const vat = Number((net * (vatRate.value / 100)).toFixed(2))
    const gross = listingPriceGross.value

    const tx: CreditTransaction = {
      id: 'tx-' + Date.now(),
      agencyId: currentAgency.value.id,
      agentId,
      agentName: agent ? (agent.name + ' ' + agent.surname) : 'Ofis Yöneticisi',
      type: 'LISTING_CONSUME',
      creditsChange: -1,
      unitPriceNet: net,
      vatAmount: vat,
      totalChargedTry: gross,
      balanceAfter: currentAgency.value.creditBalance,
      tenderOrListingId: listingId,
      description: listingTitle + ' (İlan Başı Kontör Düşümü)',
      createdAt: new Date().toLocaleString('tr-TR')
    }

    creditLedger.value.unshift(tx)
    syncToLocalStorage()

    return {
      success: true,
      message: 'İlan yayına alındı! 1 Kontör (' + gross + ' TL KDV dahil) ofis bakiyesinden düşüldü. Kalan: ' + currentAgency.value.creditBalance + ' Kontör',
      balanceAfter: currentAgency.value.creditBalance
    }
  }

  function topupCredits(creditAmount: number, description?: string) {
    const net = creditAmount * listingPriceNet.value
    const vat = Number((net * (vatRate.value / 100)).toFixed(2))
    const total = Number((net + vat).toFixed(2))

    currentAgency.value.creditBalance += creditAmount

    const tx: CreditTransaction = {
      id: 'tx-' + Date.now(),
      agencyId: currentAgency.value.id,
      type: 'TOPUP',
      creditsChange: creditAmount,
      unitPriceNet: listingPriceNet.value,
      vatAmount: vat,
      totalChargedTry: total,
      balanceAfter: currentAgency.value.creditBalance,
      description: description || (creditAmount + ' Adet İlan Kontörü Satın Alma'),
      createdAt: new Date().toLocaleString('tr-TR')
    }

    creditLedger.value.unshift(tx)
    syncToLocalStorage()
    return tx
  }

  function adminAdjustCredits(agencyId: string, amount: number, note: string) {
    currentAgency.value.creditBalance += amount

    const tx: CreditTransaction = {
      id: 'tx-' + Date.now(),
      agencyId,
      type: 'ADMIN_ADJUST',
      creditsChange: amount,
      unitPriceNet: listingPriceNet.value,
      vatAmount: 0,
      totalChargedTry: 0,
      balanceAfter: currentAgency.value.creditBalance,
      description: 'Yönetici Müdahalesi: ' + note,
      createdAt: new Date().toLocaleString('tr-TR')
    }

    creditLedger.value.unshift(tx)
    syncToLocalStorage()
  }

  function updateAgencySettings(newSettings: Partial<AgencySettings>) {
    if (!currentAgency.value.settings) {
      currentAgency.value.settings = { ...DEFAULT_AGENCY.settings }
    }
    currentAgency.value.settings = {
      ...currentAgency.value.settings,
      ...newSettings
    }
    syncToLocalStorage()
  }

  function updateAgencyProfile(profileData: Partial<RealEstateAgency>) {
    currentAgency.value = {
      ...currentAgency.value,
      ...profileData
    }
    syncToLocalStorage()
  }

  function canAgentViewListing(agentEmailOrId: string, listingOwnerAgentEmailOrId: string): boolean {
    const policy = currentAgency.value.settings?.agentListingVisibility || 'own_only'
    if (policy === 'all_office') return true
    if (!listingOwnerAgentEmailOrId) return true
    return agentEmailOrId === listingOwnerAgentEmailOrId
  }

  return {
    currentAgency,
    agentsList,
    creditLedger,
    listingPriceNet,
    vatRate,
    listingPriceGross,
    addAgent,
    updateAgent,
    deleteAgent,
    addAgentsBulk,
    consumeListingCredit,
    topupCredits,
    adminAdjustCredits,
    updateAgencySettings,
    updateAgencyProfile,
    canAgentViewListing,
    syncToLocalStorage
  }
}
