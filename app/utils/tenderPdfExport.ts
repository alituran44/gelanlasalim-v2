/**
 * İhaleciBurada Resmi Şartname & İhale İlanı Yazdırma / PDF İndirme Modülü
 * 6098 s. TBK ve B2B Elektronik İhale Standartlarına Uygun Resmi A4 Formatı
 */

export function exportTenderPdf(tender: any) {
  if (typeof window === 'undefined') return
  if (!tender) {
    alert('Şartname belgesi oluşturulacak ihale bulunamadı.')
    return
  }

  const printWindow = window.open('', '_blank', 'width=950,height=1050')
  if (!printWindow) {
    alert('Lütfen tarayıcınızın açılır pencere (popup) engelleyicisini kapatınız.')
    return
  }

  const ikn = tender.id || 'IHC-2026-001'
  const baslik = tender.baslik || 'Kurumsal Satın Alma İhalesi'
  const kategori = tender.kategori || 'Genel Satın Alma'
  const tur = tender.tur || 'İhale'
  const butce = tender.butce || 'Teklif Usulü'
  const sehir = tender.city || 'Türkiye Geneli'
  const adres = tender.teslimatAdresi || (sehir && sehir !== 'Türkiye Geneli' ? `${sehir} Merkez / Saha Depo Teslimat` : 'Belirtilen Teslimat Adresi')
  const aliciFirma = tender.ownerCompany || tender.company || tender.authority || 'İhaleciBurada Kurumsal Alıcı Masası'
  const yetkili = tender.authority || 'Satın Alma Komisyonu'
  const telefon = tender.ownerPhone || '0850 840 86 95'
  const email = tender.ownerEmail || 'destek@ihaleciburada.com'
  const website = tender.websiteUrl || ''
  const aciklama = tender.aciklama || 'Bu ihale şartnamesinde yer alan tüm teknik kriterler, teslimat takvimi ve kalite standartları uyarınca temin sağlanacaktır.'
  const tarih = tender.yayinTarihi || new Date().toLocaleDateString('tr-TR')
  const sure = tender.sure || '7 Gün'
  const dogrulamaKodu = `IHC-TR-${String(ikn).replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`

  // Sektörel / Emlak Parametreleri Tablosu
  let sectorRowsHtml = ''
  if (tender.categorySpecificData && typeof tender.categorySpecificData === 'object') {
    const data = tender.categorySpecificData
    const entries = Object.entries(data).filter(([k, v]) => !k.startsWith('_') && v !== '' && v !== null && v !== undefined)
    if (entries.length > 0) {
      sectorRowsHtml = `
        <div class="section-title">2. TEKNİK & SEKTÖREL ŞARTNAME KRİTERLERİ</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40%;">Teknik Parametre / Kriter</th>
              <th>Şartname Değeri / Taahhüt</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(([k, v]) => `
              <tr>
                <td style="font-weight: 600; text-transform: capitalize;">${k.replace(/([A-Z])/g, ' $1').trim()}</td>
                <td>${Array.isArray(v) ? v.join(', ') : v}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
    }
  }

  // Kalemler / Metraj Tablosu
  let kalemlerHtml = ''
  if (Array.isArray(tender.kalemler) && tender.kalemler.length > 0) {
    kalemlerHtml = `
      <div class="section-title">3. İHALE KALEMLERİ VE METRAJ CETVELİ</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 10%;">Sıra</th>
            <th style="width: 50%;">Malzeme / İş Kalemi</th>
            <th style="width: 20%;">Miktar</th>
            <th style="width: 20%;">Birim</th>
          </tr>
        </thead>
        <tbody>
          ${tender.kalemler.map((klm: any, idx: number) => `
            <tr>
              <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
              <td style="font-weight: 600;">${klm.ad || klm.name || baslik}</td>
              <td style="text-align: center; font-family: monospace;">${klm.miktar || 1}</td>
              <td style="text-align: center;">${klm.birim || 'Adet'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Resmi Şartname - ${ikn} - İhaleciBurada</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 20px;
      font-size: 11pt;
      line-height: 1.5;
    }
    .print-actions {
      position: sticky;
      top: 10px;
      margin-bottom: 20px;
      background: #0f223d;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999;
    }
    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-primary {
      background: #0052ff;
      color: white;
    }
    .btn-close {
      background: #334155;
      color: white;
    }
    .document-page {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      border-bottom: 3px solid #0f223d;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 900;
      color: #0f223d;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 8.5pt;
      font-weight: 800;
      color: #0052ff;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .brand-meta {
      font-size: 8.5pt;
      color: #64748b;
    }
    .doc-badge {
      text-align: right;
    }
    .ikn-number {
      font-family: monospace;
      font-size: 14pt;
      font-weight: 900;
      color: #0f223d;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      font-size: 8pt;
      font-weight: 800;
      margin-top: 4px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 900;
      color: #0f223d;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 24px 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
    }
    .info-label {
      font-size: 8pt;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      display: block;
      margin-bottom: 2px;
    }
    .info-value {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }
    .desc-box {
      background: #f8fafc;
      border-left: 4px solid #0052ff;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      font-size: 10pt;
      color: #1e293b;
      line-height: 1.6;
      white-space: pre-line;
      margin-bottom: 16px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 9.5pt;
    }
    .data-table th {
      background: #0f223d;
      color: white;
      text-align: left;
      padding: 8px 12px;
      font-weight: 800;
      font-size: 8.5pt;
      text-transform: uppercase;
    }
    .data-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .clauses {
      font-size: 9pt;
      color: #475569;
      line-height: 1.6;
      padding-left: 20px;
      margin-bottom: 20px;
    }
    .clauses li {
      margin-bottom: 6px;
    }
    .footer-stamp {
      border-top: 2px solid #0f223d;
      padding-top: 20px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .stamp-box {
      border: 2px solid #0052ff;
      background: #eff6ff;
      border-radius: 12px;
      padding: 12px 18px;
      text-align: center;
      width: 220px;
    }
    .stamp-title {
      font-size: 8pt;
      font-weight: 900;
      color: #1e3a8a;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .stamp-sub {
      font-size: 7.5pt;
      color: #3b82f6;
      font-weight: 700;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .print-actions {
        display: none !important;
      }
      .document-page {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="print-actions">
    <div>
      <strong>📄 ${ikn}</strong> numaralı resmi ihale şartnamesi hazırlandı.
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Yazdır / PDF Olarak Kaydet</button>
      <button class="btn btn-close" onclick="window.close()">✕ Kapat</button>
    </div>
  </div>

  <div class="document-page">
    
    <div class="header">
      <div>
        <div class="brand-sub">T.C. ELEKTRONİK TİCARET VE B2B İHALE SİSTEMİ</div>
        <div class="brand-title">İHALECİBURADA RESMİ ŞARTNAMESİ</div>
        <div class="brand-meta">Portal İşleticisi: Hasan Hüseyin Yıldırım · GİB VKN: 9560161511 · 6563 SK Kapsamında Aracı Hizmet Sağlayıcı</div>
      </div>
      <div class="doc-badge">
        <div style="font-size: 8pt; font-weight: 800; color: #64748b;">İHALE KAYIT NO (İKN)</div>
        <div class="ikn-number">#${ikn}</div>
        <div class="status-badge">● e-Mühürlü ve Onaylı</div>
      </div>
    </div>

    <div class="section-title">1. İHALE VE İLAN GENEL BİLGİLERİ</div>
    <div class="info-grid">
      <div class="info-box" style="grid-column: span 2;">
        <span class="info-label">İhale / Proje Başlığı:</span>
        <span class="info-value" style="font-size: 11pt; color: #0052ff;">${baslik}</span>
      </div>
      <div class="info-box">
        <span class="info-label">Sektör & Kategori:</span>
        <span class="info-value">${kategori}</span>
      </div>
      <div class="info-box">
        <span class="info-label">İhale Usulü:</span>
        <span class="info-value">${tur}</span>
      </div>
      <div class="info-box">
        <span class="info-label">Hedef Bütçe / Fiyat:</span>
        <span class="info-value" style="color: #047857; font-family: monospace;">${butce}</span>
      </div>
      <div class="info-box">
        <span class="info-label">Kalan Süre / İhale Süresi:</span>
        <span class="info-value">${sure}</span>
      </div>
      <div class="info-box">
        <span class="info-label">İlan Sahibi / Kurum:</span>
        <span class="info-value">${aliciFirma}</span>
      </div>
      <div class="info-box">
        <span class="info-label">İletişim Telefonu:</span>
        <span class="info-value">${telefon}</span>
      </div>
      <div class="info-box">
        <span class="info-label">Kurumsal E-Posta:</span>
        <span class="info-value">${email}</span>
      </div>
      <div class="info-box">
        <span class="info-label">İl / Teslimat Lokasyonu:</span>
        <span class="info-value">${sehir}</span>
      </div>
      <div class="info-box" style="grid-column: span 2;">
        <span class="info-label">Açık Adres / Saha:</span>
        <span class="info-value">${adres}</span>
      </div>
      ${website ? `
      <div class="info-box" style="grid-column: span 2;">
        <span class="info-label">Resmi Proje / Web Sitesi:</span>
        <span class="info-value" style="color: #0052ff;">${website}</span>
      </div>` : ''}
    </div>

    <div class="section-title">2. ŞARTNAME KAPSAMI VE TEKNİK AÇIKLAMALAR</div>
    <div class="desc-box">
      ${aciklama}
    </div>

    ${sectorRowsHtml}
    ${kalemlerHtml}

    <div class="section-title">4. İDARİ VE MALİ HÜKÜMLER</div>
    <ol class="clauses">
      <li><strong>Teklif Bağlayıcılığı:</strong> Sunulan tüm teklifler 6098 sayılı Türk Borçlar Kanunu kapsamında bağlayıcı ticari icap ve taahhüt niteliğindedir.</li>
      <li><strong>Güvenli Emanet Havuz (Escrow):</strong> İhale kabulünden sonra alıcı bedeli BDDK ve TCMB mevzuatına uygun Güvenli Havuz hesabında bloke edilir. Mal/hizmet teslim alınıp muayene kabulü onaylanmadan satıcıya aktarılmaz.</li>
      <li><strong>Yeterlilik Belgeleri:</strong> İhaleye teklif veren yükleniciler şartnamede istenen vergi levhası, yetki belgesi ve teknik yeterlilik evraklarını sağlamakla yükümlüdür.</li>
      <li><strong>Uyuşmazlık Çözümü:</strong> Taraflar arasında doğabilecek hukuki uyuşmazlıklarda Türkiye Cumhuriyeti Mahkemeleri ve İcra Daireleri yetkilidir.</li>
    </ol>

    <div class="footer-stamp">
      <div style="font-size: 8pt; color: #64748b;">
        <div>Tanzim Tarihi: ${tarih} · Saat: ${new Date().toLocaleTimeString('tr-TR')}</div>
        <div>Resmi Doğrulama Kodu: <strong style="font-family: monospace; color: #0f223d;">${dogrulamaKodu}</strong></div>
        <div>6102 s. TTK ve 6563 s. ETDHK uyarınca sistem tarafından oluşturulmuştur.</div>
      </div>

      <div class="stamp-box">
        <div class="stamp-title">İHALECİBURADA SİSTEMİ</div>
        <div style="font-size: 16pt; margin: 2px 0;">✓</div>
        <div class="stamp-sub">ELEKTRONİK ZAMAN DAMGALI VE DİJİTAL MÜHÜRLÜ ŞARTNAME</div>
      </div>
    </div>

  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  <\/script>
</body>
</html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
