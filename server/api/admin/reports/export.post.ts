import { defineEventHandler, readBody, createError } from 'h3'
import { logSecurityEvent } from '~~/server/utils/securityAuditStore'
import { getAllTenders } from '~~/server/utils/tendersStore'
import { getAllBids } from '~~/server/utils/bidsStore'
import { getAllCompanies } from '~~/server/utils/companyVerificationStore'
import { calculatePlatformKpis } from '~~/server/utils/reportingKpiStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const actorEmail = (body.userEmail || 'ihalecib@gmail.com') as string
  const reportType = (body.reportType || 'kpi') as 'kpi' | 'tenders' | 'bids' | 'companies'
  const period = (body.period || '30gun') as string

  let csvContent = ''
  let recordCount = 0

  if (reportType === 'kpi') {
    const kpi = calculatePlatformKpis(period)
    const rows = [
      ['KPI Kodu', 'Gosterge Adi', 'Deger', 'Birim', 'Kural'],
      ['REP-001', 'Toplam Kayitli Firma', String(kpi.companies.totalRegistered), 'Adet', 'REP-001'],
      ['REP-001', 'Dogrulanmis Firma', String(kpi.companies.totalVerified), 'Adet', 'REP-001'],
      ['REP-001', 'Aktif Firma', String(kpi.companies.totalActive), 'Adet', 'REP-001'],
      ['REP-002', 'Aktif Alici Firma', String(kpi.actors.activeBuyers), 'Adet', 'REP-002'],
      ['REP-002', 'Aktif Satici Firma', String(kpi.actors.activeSellers), 'Adet', 'REP-002'],
      ['REP-003', 'Toplam Teklif Olayi (Revizyonlar Dahil)', String(kpi.biddingActivity.totalBidEvents), 'Olay', 'REP-003'],
      ['REP-003', 'Benzersiz Teklif Veren Firma', String(kpi.biddingActivity.uniqueBiddingCompanies), 'Firma', 'REP-003'],
      ['REP-004', 'Ihale Basina Benzersiz Teklifci', String(kpi.liquidity.uniqueBiddersPerTender), 'Teklifci/Ihale', 'REP-004'],
      ['REP-005', 'Teklif Alma Orani (Liquidity Rate)', `%${kpi.liquidity.bidReceiptRate}`, '%', 'REP-005'],
      ['REP-006', 'Ilk Gecerli Teklif Suresi', `${kpi.liquidity.avgFirstBidHours} Saat`, 'Saat', 'REP-006'],
      ['REP-008', 'Tekrar Ihale Acan Alici Orani', `%${kpi.repeatBuyerRate}`, '%', 'REP-008'],
      ['REP-009', 'Funnel Donusum Orani', `%${kpi.funnel.conversionRate}`, '%', 'REP-009'],
      ['REP-010', 'Ihale Ici Fiyat Hareketi', `%${kpi.financials.priceMovementRate}`, '%', 'REP-010'],
      ['REP-011', 'Net Tasarruf Orani (Referans Bedele Gore)', `%${kpi.financials.savingsRate}`, '%', 'REP-011'],
      ['REP-011', 'Referans Fiyat Kaynagi', kpi.financials.savingsReferenceSource, 'Metin', 'REP-011'],
      ['REP-012', 'Toplam Guvenlik ve Risk Olayi', String(kpi.riskSummary.totalRiskEvents), 'Olay', 'REP-012'],
      ['REP-012', 'Danisikli Teklif (Collusion) Sinyali', String(kpi.riskSummary.collusionSignals), 'Olay', 'REP-012']
    ]
    csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(';')).join('\r\n')
    recordCount = rows.length - 1
  } else if (reportType === 'tenders') {
    const tenders = getAllTenders()
    const rows = [
      ['Ihale Kodu', 'Baslik', 'Kategori', 'Durum', 'Teklif Sayisi', 'Butce', 'Kapanis', 'Iptal Kodu'],
      ...tenders.map(t => [
        t.id,
        t.baslik,
        t.kategori || '',
        t.durum || 'LIVE',
        String(t.teklifSayisi || 0),
        t.butce || '',
        t.sure || '',
        t.reasonCode || ''
      ])
    ]
    csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(';')).join('\r\n')
    recordCount = tenders.length
  } else if (reportType === 'bids') {
    const bids = getAllBids()
    const rows = [
      ['Teklif ID', 'Ihale ID', 'Ihale Basligi', 'Tedarikci Firma', 'Fiyat', 'Durum', 'Tarih'],
      ...bids.map(b => [
        b.id,
        b.tenderId,
        b.tenderTitle,
        b.firma,
        b.fiyat,
        b.durum || 'bekliyor',
        b.tarih || ''
      ])
    ]
    csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(';')).join('\r\n')
    recordCount = bids.length
  }

  // 🛡️ REP-013: Hassas Veri Export Denetim İzi Kaydı
  logSecurityEvent(event, {
    eventType: 'EXPORT_SENSITIVE_DATA',
    severity: 'MEDIUM',
    actorEmail,
    actionTaken: 'ALLOWED',
    targetResource: `/api/admin/reports/export?type=${reportType}`,
    details: {
      reportType,
      period,
      recordCount,
      exportFormat: 'CSV',
      complianceRule: 'REP-013 & KVKK'
    }
  })

  // Add UTF-8 BOM so Excel opens Turkish characters correctly
  const bom = '\uFEFF'
  const finalCsv = bom + csvContent

  return {
    success: true,
    reportType,
    recordCount,
    fileName: `IhaleciBurada_${reportType.toUpperCase()}_Raporu_${new Date().toISOString().slice(0, 10)}.csv`,
    csvContent: finalCsv,
    message: `Hassas veri dışa aktarımı başarıyla tamamlandı ve güvenlik denetim izine kaydedildi (Kural REP-013).`
  }
})
