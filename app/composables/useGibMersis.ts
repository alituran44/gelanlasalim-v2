import { ref } from 'vue'

export interface GibMersisData {
  vkn: string
  unvan: string
  vergiDairesi: string
  faaliyetDurumu: 'FAAL / AKTİF' | 'TERK / GAYRİ FAAL' | 'TASFİYE HALİNDE'
  mersisNo: string
  ticaretSicilNo: string
  tescilTarihi: string
  naceKodu: string
  naceAciklamasi: string
  eFaturaMukellefi: boolean
  eFaturaPostaKutusu: string
  eFaturaKayitTarihi: string
  eIrsaliyeMukellefi: boolean
  eArsivMukellefi: boolean
  gibDogrulamaKodu: string
  sorguZamani: string
}

export function useGibMersis() {
  const isVerifying = ref(false)
  const verificationResult = ref<GibMersisData | null>(null)
  const errorMessage = ref('')

  async function queryGibMersis(vknOrTckn: string, companyTitle?: string, taxOffice?: string): Promise<{ success: boolean; data?: GibMersisData; message: string }> {
    isVerifying.value = true
    errorMessage.value = ''

    try {
      const res = await $fetch<{
        success: boolean
        code: string
        message: string
        data?: GibMersisData
      }>('/api/v1/gib-sorgula', {
        method: 'POST',
        body: {
          vkn: vknOrTckn,
          companyTitle,
          taxOffice
        }
      })

      if (res.success && res.data) {
        verificationResult.value = res.data
        return {
          success: true,
          data: res.data,
          message: res.message
        }
      } else {
        errorMessage.value = res.message || 'GİB ve MERSİS sorgulaması başarısız oldu.'
        return {
          success: false,
          message: errorMessage.value
        }
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'GİB / MERSİS web servisine ulaşılamadı.'
      errorMessage.value = msg
      return {
        success: false,
        message: msg
      }
    } finally {
      isVerifying.value = false
    }
  }

  return {
    isVerifying,
    verificationResult,
    errorMessage,
    queryGibMersis
  }
}
