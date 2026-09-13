export interface MatchCandidate {
  id: string
  companyName: string
  contactName: string
  phone: string
  email: string
  city: string
  category: string
  naceCode: string
  verified: boolean
  rating: number
  matchScore: number
  matchReason: string
  suggestedAction: string
}

export interface MatchResult {
  targetId: string
  targetTitle: string
  targetCategory: string
  targetCity: string
  totalAnalyzed: number
  matchedCount: number
  topMatches: MatchCandidate[]
  recommendedNotificationDraft: {
    smsText: string
    emailSubject: string
    emailBodyHtml: string
  }
}

export interface MatchRequestParams {
  id?: string
  title: string
  category?: string
  city?: string
  budget?: number | string
  description?: string
}

export const useAiMatcher = () => {
  const isMatching = ref(false)
  const isSendingInvite = ref(false)
  const currentResult = ref<MatchResult | null>(null)
  const error = ref<string | null>(null)
  const inviteStatus = ref<Record<string, 'sent' | 'sending' | 'idle'>>({})

  const findMatches = async (params: MatchRequestParams): Promise<MatchResult | null> => {
    isMatching.value = true
    error.value = null
    try {
      const response = await $fetch<{
        success: boolean
        code: string
        durationMs: number
        result: MatchResult
        message?: string
      }>('/api/v1/ai/match-suppliers', {
        method: 'POST',
        body: params
      })

      if (response && response.success) {
        currentResult.value = response.result
        return response.result
      } else {
        error.value = response?.message || 'Eşleştirme motorundan geçerli yanıt alınamadı.'
        return null
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'AI Eşleştirme servisine bağlanırken bir hata oluştu.'
      return null
    } finally {
      isMatching.value = false
    }
  }

  const sendInvitation = async (candidateId: string, channel: 'sms' | 'email' | 'all' = 'all') => {
    inviteStatus.value[candidateId] = 'sending'
    
    // Simüle / Gerçek Bildirim Gönderimi
    await new Promise(resolve => setTimeout(resolve, 800))
    
    inviteStatus.value[candidateId] = 'sent'
    return {
      success: true,
      candidateId,
      channel,
      sentAt: new Date().toISOString()
    }
  }

  const clearResults = () => {
    currentResult.value = null
    error.value = null
    inviteStatus.value = {}
  }

  return {
    isMatching,
    isSendingInvite,
    currentResult,
    error,
    inviteStatus,
    findMatches,
    sendInvitation,
    clearResults
  }
}
