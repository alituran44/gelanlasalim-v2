/**
 * Kurumsal ERP Veri Şemaları ve Formatlayıcıları (SAP S/4HANA, Logo Tiger, Netsis, Mikro)
 */

export interface ErpWebhookPayload {
  eventId: string
  eventType: 'TENDER_PUBLISHED' | 'BID_RECEIVED' | 'TENDER_AWARDED' | 'PAYMENT_ESCROW_LOCKED' | 'GOODS_ACCEPTED'
  timestamp: string
  companyVkn: string
  erpSystem: 'SAP' | 'LOGO' | 'NETSIS' | 'MIKRO'
  payload: any
}

// 1. SAP S/4HANA (BAPI_PO_CREATE / Purchase Requisition formatı)
export function formatForSap(tenderOrBid: any) {
  return {
    HEADER: {
      COMP_CODE: '1000',
      DOC_TYPE: 'NB',
      VENDOR: tenderOrBid.winnerCompanyVkn || tenderOrBid.ownerVkn || 'VEND-00192',
      PURCH_ORG: '1000',
      PUR_GROUP: '001',
      CREATED_BY: 'IHALECIBURADA_API',
      REF_1: tenderOrBid.id || 'TND-2026'
    },
    ITEMS: [
      {
        PO_ITEM: '00010',
        SHORT_TEXT: (tenderOrBid.baslik || 'Satın Alma Hizmet/Malzeme Kalemi').substring(0, 40),
        PLANT: '1001',
        STGE_LOC: '0001',
        QUANTITY: 1,
        PO_UNIT: 'EA',
        NET_PRICE: parseFloat(String(tenderOrBid.butce || tenderOrBid.fiyat || '0').replace(/[^0-9.]/g, '')) || 50000,
        CURRENCY: 'TRY',
        DELIV_DATE: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      }
    ]
  }
}

// 2. Logo Tiger & Netsis (L-KART / XML / REST formatı)
export function formatForLogo(tenderOrBid: any) {
  return {
    INTERNAL_REFERENCE: tenderOrBid.id,
    RECORD_TYPE: 1, // Satın Alma Sipariş Fişi
    NUMBER: `IHC-${Date.now().toString().slice(-6)}`,
    DATE: new Date().toISOString().split('T')[0],
    ARP_CODE: `CARI.${tenderOrBid.ownerVkn || '9560161511'}`,
    GL_CODE: '320.01.001',
    DOC_CURRENCY: 160, // TRY
    NET_TOTAL: parseFloat(String(tenderOrBid.butce || tenderOrBid.fiyat || '0').replace(/[^0-9.]/g, '')) || 50000,
    DESCRIPTION: `İhaleciBurada B2B Entegrasyonu: ${tenderOrBid.baslik || ''}`,
    LINES: [
      {
        TYPE: 0, // Malzeme
        MASTER_CODE: 'MALZ.001',
        QUANTITY: 1,
        PRICE: parseFloat(String(tenderOrBid.butce || tenderOrBid.fiyat || '0').replace(/[^0-9.]/g, '')) || 50000,
        VAT_RATE: 20
      }
    ]
  }
}

// 3. Mikro ERP (V16 / V17 Satın Alma Talep Şeması)
export function formatForMikro(tenderOrBid: any) {
  return {
    cha_kod: `CARI-${tenderOrBid.ownerVkn || '9560161511'}`,
    cha_unvan: tenderOrBid.ownerCompany || 'Kurumsal Tedarikçi',
    sip_evrakno_seri: 'IHC',
    sip_evrakno_sira: Math.floor(1000 + Math.random() * 9000),
    sip_tarih: new Date().toISOString().split('T')[0],
    sip_teslim_tarih: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    sip_aciklama: `İhaleciBurada İKN: #${tenderOrBid.id}`,
    sip_tutari: parseFloat(String(tenderOrBid.butce || tenderOrBid.fiyat || '0').replace(/[^0-9.]/g, '')) || 50000,
    sip_doviz_cinsi: 'TRY'
  }
}
