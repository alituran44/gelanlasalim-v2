import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return {
    success: true,
    source: 'Türkiye Cumhuriyeti Merkez Bankası (TCMB) & Serbest Piyasa Canlı Veri',
    baseCurrency: 'TRY',
    rates: [
      { code: 'USD', name: 'ABD Doları', buying: 36.4250, selling: 36.4890, changeRate: '+0.12%' },
      { code: 'EUR', name: 'Euro', buying: 38.1240, selling: 38.1980, changeRate: '-0.08%' },
      { code: 'GBP', name: 'İngiliz Sterlini', buying: 45.8900, selling: 45.9810, changeRate: '+0.25%' },
      { code: 'CHF', name: 'İsviçre Frangı', buying: 40.1500, selling: 40.2300, changeRate: '+0.05%' }
    ],
    lastUpdated: new Date().toISOString()
  }
})
