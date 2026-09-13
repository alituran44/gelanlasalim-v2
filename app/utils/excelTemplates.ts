/**
 * Danisman ve Emlak Ilan Toplu Yukleme CSV/Excel Sablon Uretici ve Ayristirici
 */

export function downloadAgentExcelTemplate() {
  const headers = ['ad', 'soyad', 'eposta', 'telefon', 'unvan', 'myk_belge_no', 'aylik_kontor_limiti']
  const sampleRows = [
    ['Ahmet', 'Yılmaz', 'ahmet.yilmaz@ornekremax.com', '05321112233', 'Lüks Konut Uzmanı', 'YB0217/17UY0333-5/00/1234', '25'],
    ['Selin', 'Kaya', 'selin.kaya@ornekremax.com', '05334445566', 'Arsa ve Proje Danışmanı', 'YB0217/17UY0333-5/00/5678', ''],
    ['Burak', 'Demir', 'burak.demir@ornekremax.com', '05357778899', 'Ticari Gayrimenkul Uzmanı', 'YB0217/17UY0333-5/00/9012', '15']
  ]
  
  const csvLines = [
    headers.join(';'),
    ...sampleRows.map(r => r.join(';'))
  ]
  
  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'danisman_toplu_ekleme_sablonu.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadListingExcelTemplate() {
  const headers = [
    'danisman_eposta',
    'kategori',
    'baslik',
    'fiyat_tl',
    'il',
    'ilce',
    'mahalle',
    'm2_brut',
    'm2_net',
    'oda_sayisi',
    'bulundugu_kat',
    'bina_yasi',
    'isitma',
    'deprem_2018',
    'iskan',
    'ic_ozellikler',
    'ada_parsel',
    'imar_durumu',
    'emsal_kaks',
    'altyapi',
    'aciklama'
  ]

  const sampleKonut = [
    'ahmet.yilmaz@ornekremax.com',
    'konut_daire',
    'Caddebostan Sahilde Sıfır 3+1 Lüks Daire',
    '14500000',
    'İstanbul',
    'Kadıköy',
    'Caddebostan',
    '165',
    '135',
    '3+1',
    '4',
    '0 (Yeni)',
    'Kombi (Doğalgaz)',
    'Evet',
    'Kat Mülkiyetli',
    'Ebeveyn Banyosu, Akıllı Ev, Yerden Isıtma',
    '',
    '',
    '',
    '',
    'Caddeye ve sahile 2 dakika yürüme mesafesinde ferah daire.'
  ]

  const sampleArsa = [
    'selin.kaya@ornekremax.com',
    'arsa_arazi',
    'Çatalca Merkezde Konut İmarlı 500m2 Arsa',
    '3250000',
    'İstanbul',
    'Çatalca',
    'Ferhatpaşa',
    '500',
    '500',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '1452 / 12',
    'Konut İmarı',
    '1.20',
    'Elektrik, Su, Doğalgaz, Yolu Açılmış',
    'Yatırımlık ve hemen inşaata uygun köşe parsel.'
  ]

  const csvLines = [
    headers.join(';'),
    sampleKonut.join(';'),
    sampleArsa.join(';')
  ]

  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'emlak_ilan_toplu_yukleme_sablonu.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseAgentCsv(text: string): { success: boolean; agents: any[]; errors: string[] } {
  const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0)
  if (lines.length < 2) {
    return { success: false, agents: [], errors: ['Dosya boş veya başlık satırı eksik!'] }
  }

  const results: any[] = []
  const errors: string[] = []
  const sep = lines[0].includes(';') ? ';' : ','

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) continue

    const cols = rawLine.split(sep).map(c => c.trim().replace(/^"|"$/g, ''))
    
    const ad = cols[0] || ''
    const soyad = cols[1] || ''
    const eposta = cols[2] || ''
    const telefon = cols[3] || ''
    const unvan = cols[4] || 'Gayrimenkul Danışmanı'
    const mykNo = cols[5] || ''
    const kotaStr = cols[6] || ''

    if (!ad || !eposta) {
      errors.push(`Satır ${i + 1}: Danışman Adı ve E-posta zorunludur.`)
      continue
    }

    if (!eposta.includes('@') || !eposta.includes('.')) {
      errors.push(`Satır ${i + 1}: Geçersiz e-posta adresi (${eposta}).`)
      continue
    }

    results.push({
      name: ad,
      surname: soyad,
      email: eposta,
      phone: telefon || '05XX XXX XX XX',
      title: unvan,
      mykCertificateNo: mykNo || ('YB0217/17UY0333-5/00/' + Math.floor(1000 + Math.random() * 9000)),
      monthlyCreditQuota: kotaStr ? parseInt(kotaStr, 10) : undefined,
      role: 'agent' as const,
      isActive: true
    })
  }

  return {
    success: results.length > 0,
    agents: results,
    errors
  }
}

export function parseListingCsv(text: string): { success: boolean; listings: any[]; errors: string[] } {
  const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0)
  if (lines.length < 2) {
    return { success: false, listings: [], errors: ['Dosya boş veya başlık satırı eksik!'] }
  }

  const results: any[] = []
  const errors: string[] = []
  const sep = lines[0].includes(';') ? ';' : ','

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) continue

    const cols = rawLine.split(sep).map(c => c.trim().replace(/^"|"$/g, ''))

    const danismanEposta = cols[0] || ''
    const kategori = cols[1] || 'konut_daire'
    const baslik = cols[2] || ''
    const fiyatTl = parseFloat(cols[3] || '0')
    const il = cols[4] || 'İstanbul'
    const ilce = cols[5] || ''
    const mahalle = cols[6] || ''
    const m2Brut = cols[7] || '100'
    const m2Net = cols[8] || '85'
    const odaSayisi = cols[9] || '2+1'
    const kat = cols[10] || '1'
    const binaYasi = cols[11] || '0 (Yeni)'
    const isitma = cols[12] || 'Kombi'
    const deprem2018 = cols[13] || 'Evet'
    const iskan = cols[14] || 'Kat Mülkiyetli'
    const icOzellikler = cols[15] || ''
    const adaParsel = cols[16] || ''
    const imarDurumu = cols[17] || ''
    const emsalKaks = cols[18] || ''
    const altyapi = cols[19] || ''
    const aciklama = cols[20] || baslik

    if (!baslik) {
      errors.push(`Satır ${i + 1}: İlan başlığı zorunludur.`)
      continue
    }

    if (!fiyatTl || isNaN(fiyatTl) || fiyatTl <= 0) {
      errors.push(`Satır ${i + 1}: Geçerli bir satış bedeli (fiyat_tl) girilmelidir.`)
      continue
    }

    results.push({
      id: 'listing-' + Date.now() + '-' + i,
      assignedAgentEmail: danismanEposta,
      kategori,
      baslik,
      fiyatTl,
      il,
      ilce,
      mahalle,
      m2Brut,
      m2Net,
      odaSayisi,
      kat,
      binaYasi,
      isitma,
      deprem2018,
      iskan,
      icOzellikler: icOzellikler ? icOzellikler.split(',').map(s => s.trim()) : [],
      adaParsel,
      imarDurumu,
      emsalKaks,
      altyapi: altyapi ? altyapi.split(',').map(s => s.trim()) : [],
      aciklama,
      createdAt: new Date().toISOString()
    })
  }

  return {
    success: results.length > 0,
    listings: results,
    errors
  }
}

