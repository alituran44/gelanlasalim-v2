/**
 * İhaleciBurada - Gelir Modeli ve Ücretlendirme Motoru
 * PRD Referans: Bölüm 12 & REV-001, REV-002, REV-003
 *
 * İş Kuralları:
 * - REV-001: Gelir modeli şeffaf ve esnek karar matrisine bağlıdır.
 *   * Alıcı Komisyonu: Net %0 (Her zaman ücretsiz - B2B satın alma alıcı teşviki).
 *   * Satıcı Komisyonu: Net %4 sabit Platform Hizmet / Escrow Havuz Bedeli.
 * - REV-002: Temel ihale ve teklif motoru ücretlendirmeye BAĞIMSIZDIR (Decoupled).
 *   * İhale açma, teklif verme veya süre uzatma asla bir ödeme duvarına (paywall) kilitlenmez.
 * - REV-003: Kurumsal paket, başarı komisyonu ve faturalandırma simülasyonu analiz edilebilir.
 */

import { logSecurityEvent } from './securityAuditStore'

export type RevenueModelType = 'HYBRID' | 'COMMISSION_ONLY' | 'SUBSCRIPTION_ONLY' | 'FREE_PILOT'
export type CorporateTier = 'STANDART' | 'KURUMSAL_PRO' | 'KURUMSAL_ENTERPRISE'
export type AccrualStatus = 'PENDING_INVOICE' | 'INVOICED' | 'COLLECTED' | 'EXEMPT' | 'DISPUTED'

export interface RevenueModelConfig {
  activeModel: RevenueModelType
  buyerCommissionRate: number // Her zaman 0
  sellerCommissionRate: number // Standart satıcı komisyon oranı (Örn: %4.0)
  minCommissionAmount: number // Minimum taban komisyon (₺)
  maxCommissionCap: number // Maksimum tavan komisyon (₺)
  vatRate: number // KDV oranı (%20)
  withholdingRate: number // B2B KDV Tevkifatı (5/10 = 0.5)
  isDecoupledFromBidding: boolean // REV-002: İhale motoru bağımsızlığı
  lastUpdated: string
  updatedBy: string
}

export interface CorporateTierInfo {
  id: CorporateTier
  name: string
  monthlyPrice: number
  annualPrice: number
  commissionRate: number
  features: string[]
  isPopular?: boolean
}

export interface CommissionAccrualRecord {
  id: string
  tenderId: string
  tenderTitle: string
  buyerCompany: string
  awardedSupplier: string
  awardedSupplierVkn: string
  sellerTier: CorporateTier
  tenderFinalAmount: number
  commissionRate: number
  grossCommission: number
  vatAmount: number
  withholdingAmount: number
  netPayableCommission: number
  status: AccrualStatus
  invoiceNo?: string
  invoiceDate?: string
  createdAt: string
  notes?: string
}

// 1. Standart Gelir Modeli Konfigürasyonu
let revenueConfig: RevenueModelConfig = {
  activeModel: 'HYBRID',
  buyerCommissionRate: 0, // Alıcı her zaman %0
  sellerCommissionRate: 4.0, // Satıcı standart %4.0
  minCommissionAmount: 500,
  maxCommissionCap: 150000,
  vatRate: 20, // %20 KDV
  withholdingRate: 0.5, // 5/10 Tevkifat
  isDecoupledFromBidding: true, // REV-002 kuralı gereği ihale akışını bloke etmez
  lastUpdated: '2026-09-12T00:00:00.000Z',
  updatedBy: 'Sistem Yöneticisi (9560161511)'
}

// 2. Kurumsal Üyelik Paketleri Kataloğu
export const CORPORATE_TIERS: CorporateTierInfo[] = [
  {
    id: 'STANDART',
    name: 'Standart Üretici / Tedarikçi',
    monthlyPrice: 0,
    annualPrice: 0,
    commissionRate: 4.0,
    features: [
      'Alıcı firmalar için %0 komisyonla sınırsız ihale açma',
      'Tüm açık B2B ihalelere katılabilme ve teklif verme',
      'Standart %4.0 başarı/escrow komisyonu',
      'Temel e-posta bildirimleri',
      'Resmi İhale Sonuç Tutanağı erişimi'
    ],
    isPopular: false
  },
  {
    id: 'KURUMSAL_PRO',
    name: 'Kurumsal Pro Tedarikçi',
    monthlyPrice: 1800,
    annualPrice: 18000,
    commissionRate: 2.5,
    features: [
      'İndirimli %2.5 platform başarı komisyonu (%37.5 tasarruf)',
      'Doğrulanmış B2B Rozeti (Mavi Kalkan)',
      'Yeni açılan ihalelerde 15 dakika öncelikli SMS/E-posta alarmı',
      'Sınırsız teklif revizyonu ve detaylı rakip analiz özeti',
      '7/24 Öncelikli telefon & KEP destek hattı'
    ],
    isPopular: true
  },
  {
    id: 'KURUMSAL_ENTERPRISE',
    name: 'Kurumsal Enterprise',
    monthlyPrice: 4500,
    annualPrice: 45000,
    commissionRate: 1.5,
    features: [
      'Özel indirimli %1.5 platform başarı komisyonu',
      'Kurumsal Alt Kullanıcı & Ekip Yetki Yönetimi (Limitsiz)',
      'SAP / Logo / Netsis / Mikro ERP REST API Entegrasyonu',
      'Özel Müşteri Başarı Yöneticisi (Account Manager)',
      'Özel davetli kapalı ihalelere otomatik doğrudan davet',
      'Gelişmiş Likidite ve Fiyat Hareketi Analitik Raporu'
    ],
    isPopular: false
  }
]

// 3. Hafıza İçi Komisyon Tahakkuk Havuzu (Sonuçlanan İhalelerden Üretilenler)
const accrualsStore: CommissionAccrualRecord[] = [
  {
    id: 'ACC-2026-001',
    tenderId: '2026/14601',
    tenderTitle: '30.000 Metre Alüminyum Profil Ekstrüzyon İhalesi',
    buyerCompany: 'Turanlar Endüstriyel Yapı A.Ş.',
    awardedSupplier: 'Ege Profil & Alüminyum San. Ltd. Şti.',
    awardedSupplierVkn: '9560161511',
    sellerTier: 'STANDART',
    tenderFinalAmount: 850000,
    commissionRate: 4.0,
    grossCommission: 34000,
    vatAmount: 6800,
    withholdingAmount: 3400,
    netPayableCommission: 37400,
    status: 'INVOICED',
    invoiceNo: 'IB202600000142',
    invoiceDate: '2026-09-10',
    createdAt: '2026-09-10T14:30:00.000Z',
    notes: 'İhale sonuç tutanağı taraflarca onaylandı. %4 platform hizmet faturası kesildi.'
  },
  {
    id: 'ACC-2026-002',
    tenderId: '2026/14602',
    tenderTitle: '10.000 Adet Endüstriyel Ahşap Palet Tedariği',
    buyerCompany: 'Marmara Global Lojistik Dağıtım A.Ş.',
    awardedSupplier: 'Anadolu Orman Ürünleri A.Ş.',
    awardedSupplierVkn: '3829104812',
    sellerTier: 'KURUMSAL_PRO',
    tenderFinalAmount: 420000,
    commissionRate: 2.5,
    grossCommission: 10500,
    vatAmount: 2100,
    withholdingAmount: 1050,
    netPayableCommission: 11550,
    status: 'COLLECTED',
    invoiceNo: 'IB202600000143',
    invoiceDate: '2026-09-11',
    createdAt: '2026-09-11T11:20:00.000Z',
    notes: 'Kurumsal Pro indirimli komisyon oranı uygulandı. Ödeme tahsil edildi.'
  },
  {
    id: 'ACC-2026-003',
    tenderId: '2026/14603',
    tenderTitle: 'Hafif Çelik Konstrüksiyon Fabrika Binası İmalatı',
    buyerCompany: 'Atlas Kimya Sanayi A.Ş.',
    awardedSupplier: 'Özçelik Metal Konstrüksiyon Ltd.',
    awardedSupplierVkn: '1940283741',
    sellerTier: 'STANDART',
    tenderFinalAmount: 2150000,
    commissionRate: 4.0,
    grossCommission: 86000,
    vatAmount: 17200,
    withholdingAmount: 8600,
    netPayableCommission: 94600,
    status: 'PENDING_INVOICE',
    createdAt: '2026-09-11T16:45:00.000Z',
    notes: 'İhale kesinleşti. Fatura kesim kuyruğunda bekliyor.'
  }
]

// ==================== STORE FONKSİYONLARI ====================

export function getRevenueModelConfig(): RevenueModelConfig {
  return { ...revenueConfig }
}

export function updateRevenueModelConfig(partial: Partial<RevenueModelConfig>, updatedBy = 'Admin'): RevenueModelConfig {
  revenueConfig = {
    ...revenueConfig,
    ...partial,
    buyerCommissionRate: 0, // Alıcı komisyonu daima 0 olmalı (PRD kuralı)
    isDecoupledFromBidding: true, // Decoupled mimari korunur (REV-002)
    lastUpdated: new Date().toISOString(),
    updatedBy
  }

  logSecurityEvent({
    eventType: 'ROLE_VIOLATION', // Audit için yapılandırma değişikliği
    severity: 'MEDIUM',
    reason: `Gelir modeli güncellendi: Aktif Model: ${revenueConfig.activeModel}, Satıcı Komisyonu: %${revenueConfig.sellerCommissionRate}`
  })

  return { ...revenueConfig }
}

export function getCorporateTiers(): CorporateTierInfo[] {
  return [...CORPORATE_TIERS]
}

export function calculateCommission(
  tenderId: string,
  tenderTitle: string,
  finalAmount: number,
  sellerTier: CorporateTier = 'STANDART',
  buyerCompany = 'Alıcı Firma',
  awardedSupplier = 'Kazanan Tedarikçi',
  awardedSupplierVkn = '9560161511'
): CommissionAccrualRecord {
  const tier = CORPORATE_TIERS.find(t => t.id === sellerTier) || CORPORATE_TIERS[0]
  let rate = tier.commissionRate

  if (revenueConfig.activeModel === 'SUBSCRIPTION_ONLY' || revenueConfig.activeModel === 'FREE_PILOT') {
    rate = 0
  }

  let gross = Math.round((finalAmount * rate) / 100)
  if (rate > 0) {
    if (gross < revenueConfig.minCommissionAmount) gross = revenueConfig.minCommissionAmount
    if (gross > revenueConfig.maxCommissionCap) gross = revenueConfig.maxCommissionCap
  }

  const vat = Math.round((gross * revenueConfig.vatRate) / 100)
  const withholding = Math.round(vat * revenueConfig.withholdingRate)
  const netPayable = gross + vat - withholding

  const record: CommissionAccrualRecord = {
    id: `ACC-2026-${Math.floor(100 + Math.random() * 900)}`,
    tenderId,
    tenderTitle,
    buyerCompany,
    awardedSupplier,
    awardedSupplierVkn,
    sellerTier,
    tenderFinalAmount: finalAmount,
    commissionRate: rate,
    grossCommission: gross,
    vatAmount: vat,
    withholdingAmount: withholding,
    netPayableCommission: netPayable,
    status: rate === 0 ? 'EXEMPT' : 'PENDING_INVOICE',
    createdAt: new Date().toISOString(),
    notes: `Nihai ihale bedeli ${finalAmount.toLocaleString('tr-TR')} ₺ üzerinden %${rate} platform hizmet bedeli.`
  }

  accrualsStore.unshift(record)
  return record
}

export function getAllCommissionAccruals(): CommissionAccrualRecord[] {
  return [...accrualsStore]
}

export function updateCommissionAccrualStatus(
  id: string,
  status: AccrualStatus,
  invoiceNo?: string,
  notes?: string
): CommissionAccrualRecord | null {
  const idx = accrualsStore.findIndex(a => a.id === id)
  if (idx === -1) return null

  accrualsStore[idx] = {
    ...accrualsStore[idx],
    status,
    invoiceNo: invoiceNo || accrualsStore[idx].invoiceNo,
    invoiceDate: status === 'INVOICED' ? new Date().toISOString().split('T')[0] : accrualsStore[idx].invoiceDate,
    notes: notes || accrualsStore[idx].notes
  }

  return accrualsStore[idx]
}

export interface SimulationParams {
  monthlyTenderCount: number
  avgTenderAmount: number
  proSubscriberCount: number
  enterpriseSubscriberCount: number
  sellerCommissionRate?: number
}

export interface SimulationResult {
  monthlyTenderCount: number
  avgTenderAmount: number
  totalGrossMerchandiseVolume: number // GMV
  buyerCommissionRevenue: number // 0 ₺
  sellerCommissionRevenue: number
  proSubscriptionRevenue: number
  enterpriseSubscriptionRevenue: number
  totalSubscriptionRevenue: number
  totalGrossRevenue: number
  totalVatLiability: number
  netPlatformRevenue: number
  buyerSavingsEstimated: number // Ortalama %14.2 B2B tasarruf
  effectiveTakeRate: number // Net take rate %
}

export function simulateRevenueProjection(params: SimulationParams): SimulationResult {
  const count = Math.max(1, params.monthlyTenderCount)
  const avg = Math.max(1000, params.avgTenderAmount)
  const gmv = count * avg
  const sellerRate = params.sellerCommissionRate ?? revenueConfig.sellerCommissionRate

  // Satıcı komisyonu (Tier dağılımı: %70 standart, %20 pro, %10 enterprise)
  const standardVolume = gmv * 0.70
  const proVolume = gmv * 0.20
  const enterpriseVolume = gmv * 0.10

  const commStandard = standardVolume * (sellerRate / 100)
  const commPro = proVolume * (2.5 / 100)
  const commEnterprise = enterpriseVolume * (1.5 / 100)
  const sellerCommissionRev = Math.round(commStandard + commPro + commEnterprise)

  // Abonelik gelirleri
  const proMonthly = params.proSubscriberCount * 1800
  const enterpriseMonthly = params.enterpriseSubscriberCount * 4500
  const subscriptionRev = proMonthly + enterpriseMonthly

  const grossTotal = sellerCommissionRev + subscriptionRev
  const vatTotal = Math.round((grossTotal * revenueConfig.vatRate) / 100)
  const netTotal = grossTotal

  // Alıcı tasarrufu (Geleneksel pazara kıyasla %14.2 ortalama eksiltme tasarrufu)
  const buyerSavings = Math.round(gmv * 0.142)
  const effectiveTakeRate = parseFloat(((grossTotal / gmv) * 100).toFixed(2))

  return {
    monthlyTenderCount: count,
    avgTenderAmount: avg,
    totalGrossMerchandiseVolume: gmv,
    buyerCommissionRevenue: 0, // Alıcı her zaman 0 ₺
    sellerCommissionRevenue: sellerCommissionRev,
    proSubscriptionRevenue: proMonthly,
    enterpriseSubscriptionRevenue: enterpriseMonthly,
    totalSubscriptionRevenue: subscriptionRev,
    totalGrossRevenue: grossTotal,
    totalVatLiability: vatTotal,
    netPlatformRevenue: netTotal,
    buyerSavingsEstimated: buyerSavings,
    effectiveTakeRate
  }
}
