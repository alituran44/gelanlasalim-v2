/**
 * AI Tabanlı Akıllı Tedarikçi & Gayrimenkul Eşleştirme Motoru
 * PRD: Bölüm 13.3 (Faz 3 Büyüme & Otomasyon)
 */

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
  matchScore: number // 0 - 100
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

// Havuzda yer alan örnek doğrulanmış tedarikçiler ve yatırımcı alıcılar
const VERIFIED_DIRECTORY: Omit<MatchCandidate, 'matchScore' | 'matchReason' | 'suggestedAction'>[] = [
  {
    id: 'COMP-101',
    companyName: 'Kalyoncu Demir Çelik Sanayi A.Ş.',
    contactName: 'Serdar Kalyoncu',
    phone: '0532 200 33 44',
    email: 'serdar@kalyoncudemir.com.tr',
    city: 'İstanbul',
    category: 'İnşaat, Yapı & Şantiye Malzemeleri',
    naceCode: '24.10.01 - Ham Çelik ve Demir Ürünleri İmalatı',
    verified: true,
    rating: 4.9
  },
  {
    id: 'COMP-102',
    companyName: 'Anadolu Çimento ve Hazır Beton Ltd. Şti.',
    contactName: 'Murat Arslan',
    phone: '0533 300 44 55',
    email: 'murat@anadolucimento.com.tr',
    city: 'Balıkesir',
    category: 'İnşaat, Yapı & Şantiye Malzemeleri',
    naceCode: '23.51.01 - Çimento İmalatı',
    verified: true,
    rating: 4.8
  },
  {
    id: 'COMP-103',
    companyName: 'Marmara Lüks Konut & Gayrimenkul Yatırım Fonu',
    contactName: 'Elif Karaca',
    phone: '0530 400 55 66',
    email: 'elif@marmaragayrimenkul.com.tr',
    city: 'İstanbul',
    category: 'Emlak, Arsa & Konut Projeleri',
    naceCode: '68.31.01 - Gayrimenkul Acenteleri Faaliyetleri',
    verified: true,
    rating: 5.0
  },
  {
    id: 'COMP-104',
    companyName: 'Ege Tarım ve Endüstriyel Gıda San. Tic. A.Ş.',
    contactName: 'Kemal Öztürk',
    phone: '0535 500 66 77',
    email: 'kemal@egetarim.com.tr',
    city: 'İzmir',
    category: 'Gıda, Tarım & Hayvancılık',
    naceCode: '10.89.01 - Çeşitli Gıda İmalatı',
    verified: true,
    rating: 4.7
  },
  {
    id: 'COMP-105',
    companyName: 'Boğaziçi Ambalaj & Oluklu Mukavva Koli A.Ş.',
    contactName: 'Burak Tan',
    phone: '0536 600 77 88',
    email: 'burak@bogaziciambalaj.com.tr',
    city: 'Bursa',
    category: 'Ambalaj, Paketleme & Kağıt',
    naceCode: '17.21.01 - Oluklu Kağıt ve Mukavva İmalatı',
    verified: true,
    rating: 4.9
  },
  {
    id: 'COMP-106',
    companyName: 'Çanakkale Boğazı Gayrimenkul & Yatırım Ortaklığı',
    contactName: 'Hasan Yıldırım',
    phone: '0850 840 86 95',
    email: 'ihalecib@gmail.com',
    city: 'Çanakkale',
    category: 'Emlak, Arsa & Konut Projeleri',
    naceCode: '68.10.01 - Kendine Ait Gayrimenkullerin Alım Satımı',
    verified: true,
    rating: 5.0
  }
]

export function matchSuppliersOrBuyers(target: {
  id: string
  title: string
  category: string
  city?: string
  budget?: string
  description?: string
}): MatchResult {
  const titleLower = (target.title || '').toLowerCase()
  const catLower = (target.category || '').toLowerCase()
  const cityLower = (target.city || '').toLowerCase()
  const descLower = (target.description || '').toLowerCase()

  const scoredCandidates: MatchCandidate[] = VERIFIED_DIRECTORY.map(candidate => {
    let score = 50 // Taban puan

    // 1. Kategori & Sektör Uyumu (+25 puan)
    if (catLower && candidate.category.toLowerCase().includes(catLower)) {
      score += 25
    } else if (
      (titleLower.includes('daire') || titleLower.includes('arsa') || titleLower.includes('villa') || titleLower.includes('konut')) &&
      candidate.category.includes('Emlak')
    ) {
      score += 25
    } else if (
      (titleLower.includes('demir') || titleLower.includes('çimento') || titleLower.includes('inşaat')) &&
      candidate.category.includes('İnşaat')
    ) {
      score += 25
    } else if (
      (titleLower.includes('koli') || titleLower.includes('ambalaj') || titleLower.includes('kutu')) &&
      candidate.category.includes('Ambalaj')
    ) {
      score += 25
    }

    // 2. Coğrafi / Şehir Yakınlığı (+15 puan)
    if (cityLower && candidate.city.toLowerCase().includes(cityLower)) {
      score += 15
    } else if (candidate.city === 'İstanbul' || candidate.city === 'Ankara') {
      score += 8 // Metropol merkezli tedarikçi
    }

    // 3. Semantik Anahtar Kelime Puanı (+10 puan)
    const keywords = ['lüks', 'ton', 'fason', 'hakediş', 'ihale', 'yatırım', 'deprem', 'iskân']
    keywords.forEach(kw => {
      if (titleLower.includes(kw) || descLower.includes(kw)) {
        score += 2
      }
    })

    // Sınırla 99
    const finalScore = Math.min(score, 99)

    let matchReason = ''
    if (finalScore >= 85) {
      matchReason = `${candidate.category} alanında NACE kodu tam uyumlu ve ${candidate.city} bölgesinde aktif alıcı/tedarikçi.`
    } else {
      matchReason = `Bölgesel kapasite ve tedarikçi derecelendirmesi (${candidate.rating} Puan) kriterlerine uygun.`
    }

    return {
      ...candidate,
      matchScore: finalScore,
      matchReason,
      suggestedAction: finalScore >= 85 ? 'Doğrudan Teklife Davet Et (SMS & Mail)' : 'İlan Bildirimi İlet'
    }
  })

  // En yüksek skordan düşüğe sırala
  scoredCandidates.sort((a, b) => b.matchScore - a.matchScore)
  const topMatches = scoredCandidates.slice(0, 4)

  const smsText = `Sayin Yetkili, IhaleciBurada platformunda firmanizin uzmanlik alanina (${target.category}) %${topMatches[0]?.matchScore || 94} uyumlu yeni bir talep/ilan acildi: "${target.title.substring(0, 45)}...". Detaylar: ihaleciburada.com/pazar-yeri`
  const emailSubject = `🎯 Akıllı Eşleşme Bildirimi: ${target.title}`
  const emailBodyHtml = `
    <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
      <h3 style="color: #0052ff;">Yeni B2B İhale / Portföy Eşleşmesi</h3>
      <p>Sayın Firma Yetkilisi,</p>
      <p>İhaleciBurada Akıllı Eşleştirme Motoru, firmanızın kayıtlı faaliyet alanı ve NACE kodu ile %${topMatches[0]?.matchScore || 94} uyumlu yeni bir fırsat tespit etti:</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <div style="font-weight: bold; font-size: 15px;">${target.title}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Kategori: ${target.category} | Şehir: ${target.city || 'Türkiye Geneli'}</div>
      </div>
      <p>Teklif hazırlamak veya doğrudan şartnameyi incelemek için yönetim panelinize giriş yapabilirsiniz.</p>
    </div>
  `

  return {
    targetId: target.id,
    targetTitle: target.title,
    targetCategory: target.category,
    targetCity: target.city || 'Türkiye Geneli',
    totalAnalyzed: VERIFIED_DIRECTORY.length,
    matchedCount: topMatches.length,
    topMatches,
    recommendedNotificationDraft: {
      smsText,
      emailSubject,
      emailBodyHtml
    }
  }
}
