import { defineEventHandler } from 'h3'
import { getRevenueModelConfig, getCorporateTiers } from '~~/server/utils/revenueModelStore'

export default defineEventHandler(() => {
  const config = getRevenueModelConfig()
  const tiers = getCorporateTiers()

  return {
    success: true,
    serverTime: new Date().toISOString(),
    config,
    tiers,
    officialMerchant: {
      tradeName: 'Hasan Hüseyin Yıldırım (İhaleciBurada Ticari İşletmesi)',
      taxOffice: 'Çanakkale Vergi Dairesi',
      vkn: '9560161511',
      kep: 'hasanhuseyin.yildirim.17@hs01.kep.tr',
      phone: '0850 840 86 95',
      address: 'İsmetpaşa Mah. Demircioğlu Cad. No: 132/A Merkez / Çanakkale'
    },
    legalNotes: [
      'REV-001: Alıcı firmalardan ihale açma ve teklif alma aşamalarında komisyon alınmaz (%0 Komisyon).',
      'REV-002: Temel ihale ve teklif motoru ücretlendirmeye bağımsızdır (Decoupled Architecture).',
      'REV-003: Platform başarı komisyonu (%4.0) yalnızca ihale sonuçlanıp tutanak onaylandığında satıcı tarafına tahakkuk eder.'
    ]
  }
})
