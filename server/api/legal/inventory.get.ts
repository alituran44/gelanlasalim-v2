import { defineEventHandler } from 'h3'
import { 
  OFFICIAL_DATA_INVENTORY, 
  OFFICIAL_LEGAL_DOCUMENTS, 
  OFFICIAL_SANCTIONS_CATALOG 
} from '~~/server/utils/legalComplianceStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')

  return {
    success: true,
    dataInventory: OFFICIAL_DATA_INVENTORY,
    documents: OFFICIAL_LEGAL_DOCUMENTS,
    sanctionsCatalog: OFFICIAL_SANCTIONS_CATALOG,
    merchantInfo: {
      ownerName: 'Hasan Hüseyin Yıldırım',
      tradeName: 'İhaleciBurada Ticari İşletmesi',
      taxOffice: 'Çanakkale Vergi Dairesi',
      taxId: '9560161511',
      kep: 'hasanhuseyin.yildirim.17@hs01.kep.tr',
      email: 'ihalecib@gmail.com',
      phone: '0850 840 86 95',
      centralOffice: 'Çanakkale / Türkiye'
    }
  }
})
