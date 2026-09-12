# -*- coding: utf-8 -*-
"""
compile_all.py
43 Sektörün tümünü ve geriye uyumlu alias'ları birleştirerek
app/utils/categoryFieldsSchema.ts dosyasını derler.
"""
import sys
import json
from pathlib import Path

# Add sectors directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR / 'sectors'))

import p1, p2, p3, p4, p5, p6

all_sectors = {}
all_sectors.update(p1.DATA)
all_sectors.update(p2.DATA)
all_sectors.update(p3.DATA)
all_sectors.update(p4.DATA)
all_sectors.update(p5.DATA)
all_sectors.update(p6.DATA)

# Aliases for 100% backward compatibility
all_sectors['insaat_yapi'] = all_sectors['insaat_altyapi']
all_sectors['saglik_medikal'] = all_sectors['saglik_ilac']
all_sectors['gida_catering'] = all_sectors['gida_tarim']

print(f"Loaded {len(all_sectors)} sector keys (43 unique + 3 aliases).")

# TypeScript Generator
def generate_ts():
    lines = []
    lines.append("/**")
    lines.append(" * Sektöre Özgü Dinamik İhale Parametreleri ve Şartname Şeması")
    lines.append(" * ")
    lines.append(" * İhaleciBurada platformundaki 40 ana taksonomi kategorisinin tamamı ve")
    lines.append(" * özelleşmiş alt sektörler (Arsa, Konut, Ticari Gayrimenkul) için teknik,")
    lines.append(" * mevzuat ve ticari şartname kriterlerini dinamik olarak yönetir.")
    lines.append(" */")
    lines.append("")
    lines.append("export interface CategoryFieldDef {")
    lines.append("  id: string")
    lines.append("  label: string")
    lines.append("  type: 'text' | 'number' | 'select' | 'badge-group' | 'radio' | 'boolean' | 'date'")
    lines.append("  placeholder?: string")
    lines.append("  unit?: string")
    lines.append("  options?: Array<string | { value: string; label: string }>")
    lines.append("  helpText?: string")
    lines.append("  group: 'teknik' | 'mevzuat' | 'ticari'")
    lines.append("  required?: boolean")
    lines.append("  defaultValue?: any")
    lines.append("}")
    lines.append("")
    lines.append("export interface SectorDefinition {")
    lines.append("  key: string")
    lines.append("  name: string")
    lines.append("  icon: string")
    lines.append("  badgeText: string")
    lines.append("  description: string")
    lines.append("  groups: {")
    lines.append("    teknik: { title: string; desc: string }")
    lines.append("    mevzuat: { title: string; desc: string }")
    lines.append("    ticari: { title: string; desc: string }")
    lines.append("  }")
    lines.append("  fields: CategoryFieldDef[]")
    lines.append("  quickPresets?: Array<{")
    lines.append("    label: string")
    lines.append("    values: Record<string, any>")
    lines.append("  }>")
    lines.append("}")
    lines.append("")
    lines.append("export const SECTOR_DEFINITIONS: Record<string, SectorDefinition> = {")

    sector_keys = list(all_sectors.keys())
    for idx, key in enumerate(sector_keys):
        sec = all_sectors[key]
        lines.append(f"  // =========================================================================")
        lines.append(f"  // {key.upper()}")
        lines.append(f"  // =========================================================================")
        lines.append(f"  {key}: {{")
        lines.append(f"    key: {json.dumps(key, ensure_ascii=False)},")
        lines.append(f"    name: {json.dumps(sec['name'], ensure_ascii=False)},")
        lines.append(f"    icon: {json.dumps(sec['icon'], ensure_ascii=False)},")
        lines.append(f"    badgeText: {json.dumps(sec['badgeText'], ensure_ascii=False)},")
        lines.append(f"    description: {json.dumps(sec['description'], ensure_ascii=False)},")
        lines.append(f"    groups: {{")
        lines.append(f"      teknik: {{ title: {json.dumps(sec['groups']['teknik']['title'], ensure_ascii=False)}, desc: {json.dumps(sec['groups']['teknik']['desc'], ensure_ascii=False)} }},")
        lines.append(f"      mevzuat: {{ title: {json.dumps(sec['groups']['mevzuat']['title'], ensure_ascii=False)}, desc: {json.dumps(sec['groups']['mevzuat']['desc'], ensure_ascii=False)} }},")
        lines.append(f"      ticari: {{ title: {json.dumps(sec['groups']['ticari']['title'], ensure_ascii=False)}, desc: {json.dumps(sec['groups']['ticari']['desc'], ensure_ascii=False)} }}")
        lines.append(f"    }},")

        # quickPresets
        lines.append(f"    quickPresets: [")
        for p_idx, preset in enumerate(sec.get('quickPresets', [])):
            comma = "," if p_idx < len(sec['quickPresets']) - 1 else ""
            lines.append(f"      {{")
            lines.append(f"        label: {json.dumps(preset['label'], ensure_ascii=False)},")
            lines.append(f"        values: {json.dumps(preset['values'], ensure_ascii=False)}")
            lines.append(f"      }}{comma}")
        lines.append(f"    ],")

        # fields
        lines.append(f"    fields: [")
        for f_idx, f in enumerate(sec.get('fields', [])):
            comma = "," if f_idx < len(sec['fields']) - 1 else ""
            lines.append(f"      {{")
            lines.append(f"        id: {json.dumps(f['id'], ensure_ascii=False)},")
            lines.append(f"        label: {json.dumps(f['label'], ensure_ascii=False)},")
            lines.append(f"        type: {json.dumps(f['type'], ensure_ascii=False)},")
            lines.append(f"        group: {json.dumps(f['group'], ensure_ascii=False)},")
            if 'required' in f and f['required']:
                lines.append(f"        required: true,")
            if 'unit' in f and f['unit']:
                lines.append(f"        unit: {json.dumps(f['unit'], ensure_ascii=False)},")
            if 'placeholder' in f and f['placeholder']:
                lines.append(f"        placeholder: {json.dumps(f['placeholder'], ensure_ascii=False)},")
            if 'options' in f and f['options']:
                lines.append(f"        options: {json.dumps(f['options'], ensure_ascii=False)},")
            if 'defaultValue' in f and f['defaultValue'] is not None:
                lines.append(f"        defaultValue: {json.dumps(f['defaultValue'], ensure_ascii=False)}")
            else:
                lines.append(f"        defaultValue: null")
            lines.append(f"      }}{comma}")
        lines.append(f"    ]")

        comma_sec = "," if idx < len(sector_keys) - 1 else ""
        lines.append(f"  }}{comma_sec}")

    lines.append("}")
    lines.append("")

    # resolveSectorKey function
    lines.append("""/**
 * Kategori ve Alt Kategori bilgilerine göre en uygun sektör şema anahtarını döndürür.
 * 40 ana taksonomi kategorisinin tamamını ve özel alt sektörleri tam olarak çözer.
 */
export function resolveSectorKey(category?: string | number, subCategory?: string): string {
  const catStr = String(category || '').trim().toLowerCase()
  const subStr = String(subCategory || '').trim().toLowerCase()
  const combined = `${catStr} ${subStr}`

  // 1. Doğrudan Kategori ID Eşleşmeleri
  if (catStr === '1') return 'insaat_altyapi'
  if (catStr === '2') return 'saglik_ilac'
  if (catStr === '3') return 'gida_tarim'
  if (catStr === '4') return 'tibbi_cihaz'
  if (catStr === '5') return 'kanalizasyon_su'
  if (catStr === '6') return 'enerji_elektrik'
  if (catStr === '7') return 'akaryakit_enerji'
  if (catStr === '8') return 'endustriyel_makine'
  if (catStr === '9') return 'bilisim_teknoloji'
  if (catStr === '10') return 'lojistik_tasimacilik'
  if (catStr === '11') return 'mobilya_ofis'
  if (catStr === '12') return 'hirdavat_metal'
  if (catStr === '13') return 'yangin_guvenlik'
  if (catStr === '14') return 'kimyasal_gubre'
  if (catStr === '15') return 'matbaa_kirtasiye'
  if (catStr === '16') return 'kent_mobilyalari'
  if (catStr === '17') return 'muhendislik_mimarlik'
  if (catStr === '18') return 'madencilik_sondaj'
  if (catStr === '19') return 'asansor_otomasyon'
  if (catStr === '20') return 'klima_havalandirma'
  if (catStr === '21') return 'savunma_havacilik'
  if (catStr === '22') return 'arac_is_makinesi'
  if (catStr === '23') return 'turizm_organizasyon'
  if (catStr === '24') return 'reklam_tanitim'
  if (catStr === '25') return 'peyzaj_ormancilik'
  if (catStr === '26') return 'hayvancilik_yem'
  if (catStr === '27') return 'sanat_heykel'
  if (catStr === '28') return 'odun_komur'
  if (catStr === '29') return 'hazir_yemek_ikram'
  if (catStr === '30') return 'elektronik_bilgisayar'
  if (catStr === '31') return 'kamera_guvenlik_scada'
  if (catStr === '32') return 'temizlik_geri_donusum'
  if (catStr === '33') return 'tekstil_giyim'
  if (catStr === '34') return 'is_sagligi_guvenligi'
  if (catStr === '35') return 'ozel_guvenlik'
  if (catStr === '36') return 'egitim_tercume'
  if (catStr === '37') return 'isletmecilik_hizmet'
  if (catStr === '38') return 'sigorta_finans'
  if (catStr === '39') return 'hurda_arac_satisi'
  if (catStr === '40') {
    // 40. kategoride alt kategoriye göre spesifik alt sektör
    if (subStr.includes('arsa') || subStr.includes('arazi') || subStr.includes('tarla') || subStr.includes('kat karşılığı')) {
      return 'arsa_arazi'
    }
    if (subStr.includes('dükkan') || subStr.includes('işyeri') || subStr.includes('kantin') || subStr.includes('depo') || subStr.includes('otopark')) {
      return 'ticari_gayrimenkul'
    }
    return 'gayrimenkul_arsa'
  }

  // 2. Özelleşmiş Alt Kategori Anahtarları
  if (subStr.includes('arsa') || subStr.includes('arazi') || subStr.includes('tarla') || combined.includes('kat karşılığı')) {
    return 'arsa_arazi'
  }
  if (subStr.includes('konut') || subStr.includes('daire') || subStr.includes('rezidans') || subStr.includes('villa') || subStr.includes('lojman')) {
    return 'konut_daire'
  }
  if (subStr.includes('dükkan') || subStr.includes('işyeri') || subStr.includes('plaza') || subStr.includes('mağaza') || subStr.includes('antrepo')) {
    return 'ticari_gayrimenkul'
  }

  // 3. Metin Tabanlı Kategori & Alt Kategori Eşleştirmeleri
  if (combined.includes('akaryakıt') || combined.includes('benzin') || combined.includes('motorin') || combined.includes('madeni yağ') || combined.includes('otogaz') || combined.includes('lpg')) {
    return 'akaryakit_enerji'
  }
  if (combined.includes('tıbbi cihaz') || combined.includes('hastane ekipman') || combined.includes('radyoloji') || combined.includes('otoklav') || combined.includes('cerrahi')) {
    return 'tibbi_cihaz'
  }
  if (combined.includes('ilaç') || combined.includes('serum') || combined.includes('sağlık') || combined.includes('medikal') || combined.includes('titck') || combined.includes('biyomedikal')) {
    return 'saglik_ilac'
  }
  if (combined.includes('tabldot') || combined.includes('kumanya') || combined.includes('catering') || combined.includes('hazır yemek') || combined.includes('lokantacılık')) {
    return 'hazir_yemek_ikram'
  }
  if (combined.includes('gıda') || combined.includes('tarım') || combined.includes('hububat') || combined.includes('bakliyat') || combined.includes('un') || combined.includes('şeker') || combined.includes('yağ')) {
    return 'gida_tarim'
  }
  if (combined.includes('kanalizasyon') || combined.includes('şebeke') || combined.includes('su borusu') || combined.includes('koruge') || combined.includes('hdpe') || combined.includes('sıhhi tesisat') || combined.includes('vana')) {
    return 'kanalizasyon_su'
  }
  if (combined.includes('güneş') || combined.includes('ges') || combined.includes('trafo') || combined.includes('elektrik tesisatı') || combined.includes('aydınlatma') || combined.includes('jeneratör')) {
    return 'enerji_elektrik'
  }
  if (combined.includes('cnc') || combined.includes('endüstriyel makine') || combined.includes('kompresör') || combined.includes('konveyör') || combined.includes('redüktör') || combined.includes('torna')) {
    return 'endustriyel_makine'
  }
  if (combined.includes('yazılım') || combined.includes('bilişim') || combined.includes('erp') || combined.includes('bulut') || combined.includes('siber') || combined.includes('web')) {
    return 'bilisim_teknoloji'
  }
  if (combined.includes('nakliye') || combined.includes('taşımacılık') || combined.includes('lojistik') || combined.includes('servis') || combined.includes('kargo') || combined.includes('ftl') || combined.includes('konteyner')) {
    return 'lojistik_tasimacilik'
  }
  if (combined.includes('mobilya') || combined.includes('ofis') || combined.includes('büro') || combined.includes('endüstriyel mutfak') || combined.includes('beyaz eşya') || combined.includes('raf')) {
    return 'mobilya_ofis'
  }
  if (combined.includes('hırdavat') || combined.includes('civata') || combined.includes('nalburiye') || combined.includes('metal') || combined.includes('profil') || combined.includes('sac') || combined.includes('plastik hammadde')) {
    return 'hirdavat_metal'
  }
  if (combined.includes('yangın') || combined.includes('sprinkler') || combined.includes('fm200') || combined.includes('davlumbaz') || combined.includes('söndürme') || combined.includes('ihbar')) {
    return 'yangin_guvenlik'
  }
  if (combined.includes('kimyasal') || combined.includes('gübre') || combined.includes('dezenfektan') || combined.includes('asit') || combined.includes('klor') || combined.includes('biyosidal')) {
    return 'kimyasal_gubre'
  }
  if (combined.includes('matbaa') || combined.includes('baskı') || combined.includes('koli') || combined.includes('ambalaj') || combined.includes('toner') || combined.includes('kartuş') || combined.includes('kırtasiye') || combined.includes('fotokopi')) {
    return 'matbaa_kirtasiye'
  }
  if (combined.includes('kent mobilya') || combined.includes('prefabrik') || combined.includes('bank') || combined.includes('doğrama') || combined.includes('çocuk oyun') || combined.includes('durak')) {
    return 'kent_mobilyalari'
  }
  if (combined.includes('mühendislik') || combined.includes('mimarlık') || combined.includes('statik') || combined.includes('müşavirlik') || combined.includes('zemin etüdü') || combined.includes('geoteknik')) {
    return 'muhendislik_mimarlik'
  }
  if (combined.includes('maden') || combined.includes('sondaj') || combined.includes('kuyu') || combined.includes('taş ocağı') || combined.includes('mermer') || combined.includes('mapeg')) {
    return 'madencilik_sondaj'
  }
  if (combined.includes('asansör') || combined.includes('yürüyen merdiven') || combined.includes('bms') || combined.includes('otomasyon') || combined.includes('en 81')) {
    return 'asansor_otomasyon'
  }
  if (combined.includes('klima') || combined.includes('soğutma') || combined.includes('hvac') || combined.includes('havalandırma') || combined.includes('vrf') || combined.includes('chiller') || combined.includes('kazan dairesi')) {
    return 'klima_havalandirma'
  }
  if (combined.includes('savunma') || combined.includes('silah') || combined.includes('denizcilik') || combined.includes('havacılık') || combined.includes('balistik') || combined.includes('askeri')) {
    return 'savunma_havacilik'
  }
  if (combined.includes('iş makine') || combined.includes('taşıt') || combined.includes('ekskavatör') || combined.includes('loder') || combined.includes('kamyon') || combined.includes('filo kiralama') || combined.includes('traktör')) {
    return 'arac_is_makinesi'
  }
  if (combined.includes('turizm') || combined.includes('organizasyon') || combined.includes('kongre') || combined.includes('seminer') || combined.includes('festival') || combined.includes('düğün') || combined.includes('türsab')) {
    return 'turizm_organizasyon'
  }
  if (combined.includes('reklam') || combined.includes('tabela') || combined.includes('billboard') || combined.includes('totem') || combined.includes('led ekran') || combined.includes('fuar standı')) {
    return 'reklam_tanitim'
  }
  if (combined.includes('peyzaj') || combined.includes('bahçe') || combined.includes('rulo çim') || combined.includes('sulama') || combined.includes('ormancılık') || combined.includes('fidan')) {
    return 'peyzaj_ormancilik'
  }
  if (combined.includes('hayvancılık') || combined.includes('yem') || combined.includes('büyükbaş') || combined.includes('küçükbaş') || combined.includes('veteriner') || combined.includes('damızlık')) {
    return 'hayvancilik_yem'
  }
  if (combined.includes('sanat') || combined.includes('heykel') || combined.includes('maket') || combined.includes('müzik alet') || combined.includes('rölyef') || combined.includes('enstrüman')) {
    return 'sanat_heykel'
  }
  if (combined.includes('odun') || combined.includes('kömür') || combined.includes('pelet') || combined.includes('katı yakıt') || combined.includes('linyit')) {
    return 'odun_komur'
  }
  if (combined.includes('elektronik') || combined.includes('bilgisayar') || combined.includes('laptop') || combined.includes('sunucu') || combined.includes('ölçü alet') || combined.includes('server')) {
    return 'elektronik_bilgisayar'
  }
  if (combined.includes('kamera') || combined.includes('cctv') || combined.includes('scada') || combined.includes('plaka tanıma') || combined.includes('pts') || combined.includes('gps') || combined.includes('uydu takip')) {
    return 'kamera_guvenlik_scada'
  }
  if (combined.includes('temizlik') || combined.includes('ilaçlama') || combined.includes('geri dönüşüm') || combined.includes('pest kontrol') || combined.includes('katı atık') || combined.includes('dezenfeksiyon')) {
    return 'temizlik_geri_donusum'
  }
  if (combined.includes('tekstil') || combined.includes('giyim') || combined.includes('iş kıyafeti') || combined.includes('tulum') || combined.includes('üniforma') || combined.includes('iş ayakkabısı')) {
    return 'tekstil_giyim'
  }
  if (combined.includes('iş sağlığı') || combined.includes('iş güvenliği') || combined.includes('isg') || combined.includes('kkd') || combined.includes('baret') || combined.includes('emniyet kemeri')) {
    return 'is_sagligi_guvenligi'
  }
  if (combined.includes('özel güvenlik') || combined.includes('5188') || combined.includes('bekçilik') || combined.includes('koruma') || combined.includes('devriye')) {
    return 'ozel_guvenlik'
  }
  if (combined.includes('tercüme') || combined.includes('çeviri') || combined.includes('eğitim') || combined.includes('anket') || combined.includes('araştırma') || combined.includes('yeminli')) {
    return 'egitim_tercume'
  }
  if (combined.includes('işletmecilik') || combined.includes('resepsiyon') || combined.includes('bordrolama') || combined.includes('destek personeli') || combined.includes('sosyal hizmetler') || combined.includes('tesis işletme')) {
    return 'isletmecilik_hizmet'
  }
  if (combined.includes('sigorta') || combined.includes('kasko') || combined.includes('bağımsız denetim') || combined.includes('mali müşavir') || combined.includes('hukuki')) {
    return 'sigorta_finans'
  }
  if (combined.includes('hurda') || combined.includes('araç satışı') || combined.includes('menkul') || combined.includes('e-atık') || combined.includes('ikinci el taşıt')) {
    return 'hurda_arac_satisi'
  }
  if (combined.includes('gayrimenkul') || combined.includes('arsa satışı') || combined.includes('kantin') || combined.includes('işyeri kiralama')) {
    return 'gayrimenkul_arsa'
  }
  if (combined.includes('inşaat') || combined.includes('altyapı') || combined.includes('yapım') || combined.includes('yıkım') || combined.includes('hafriyat') || combined.includes('müteahhit')) {
    return 'insaat_altyapi'
  }

  // Varsayılan sektör
  return 'insaat_altyapi'
}
""")

    # formatSectorSummaryBadges function
    lines.append("""/**
 * İhale kartlarında gösterilmek üzere doldurulmuş sektörel parametrelerden
 * özet rozetler türetir. Tüm 40 sektör ve özelleşmiş alt sektörleri destekler.
 */
export function formatSectorSummaryBadges(
  categorySpecificData: Record<string, any> = {},
  sectorKey: string = ''
): Array<{ label: string; value: string }> {
  if (!categorySpecificData || Object.keys(categorySpecificData).length === 0) {
    return []
  }

  // Otomatik tespit (eğer sectorKey verilmemişse)
  let effectiveKey = sectorKey || categorySpecificData._sectorKey || ''
  if (!effectiveKey) {
    if (categorySpecificData.yakitTuru || categorySpecificData.miktarLitre) effectiveKey = 'akaryakit_enerji'
    else if (categorySpecificData.toplamInsaatAlani || categorySpecificData.projeTuru || categorySpecificData.muteahhitlikBelgeGrubu) effectiveKey = 'insaat_altyapi'
    else if (categorySpecificData.adaParselNo || categorySpecificData.toplamYuzolcumuM2 || categorySpecificData.imarDurumu) effectiveKey = 'arsa_arazi'
    else if (categorySpecificData.odaSayisi || categorySpecificData.netMetrekare) effectiveKey = 'konut_daire'
    else if (categorySpecificData.ticariNitelik || categorySpecificData.kapaliAlanM2) effectiveKey = 'ticari_gayrimenkul'
    else if (categorySpecificData.aracSinifi || categorySpecificData.aracAdedi) effectiveKey = 'arac_is_makinesi'
    else if (categorySpecificData.gunlukKisiSayisi || categorySpecificData.menuKapSayisi) effectiveKey = 'hazir_yemek_ikram'
    else if (categorySpecificData.projeKapsami || categorySpecificData.teknolojiYigini) effectiveKey = 'bilisim_teknoloji'
    else if (categorySpecificData.ilacSarfKategorisi || categorySpecificData.kutuAdedi) effectiveKey = 'saglik_ilac'
    else if (categorySpecificData.cihazSinifi || categorySpecificData.cihazAdedi) effectiveKey = 'tibbi_cihaz'
    else if (categorySpecificData.gidaGrubu || categorySpecificData.miktarTon) effectiveKey = 'gida_tarim'
    else if (categorySpecificData.tasimaTuru || categorySpecificData.seferSayisi) effectiveKey = 'lojistik_tasimacilik'
    else effectiveKey = 'insaat_altyapi'
  }

  const badges: Array<{ label: string; value: string }> = []

  switch (effectiveKey) {
    case 'insaat_altyapi':
    case 'insaat_yapi':
      if (categorySpecificData.toplamInsaatAlani) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamInsaatAlani).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.projeTuru) badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeTuru) })
      if (categorySpecificData.betonSinifi) badges.push({ label: 'Beton', value: String(categorySpecificData.betonSinifi) })
      if (categorySpecificData.muteahhitlikBelgeGrubu) badges.push({ label: 'Yetki', value: String(categorySpecificData.muteahhitlikBelgeGrubu) })
      break

    case 'saglik_ilac':
    case 'saglik_medikal':
      if (categorySpecificData.ilacSarfKategorisi || categorySpecificData.urunKategorisi) badges.push({ label: 'Kategori', value: String(categorySpecificData.ilacSarfKategorisi || categorySpecificData.urunKategorisi) })
      if (categorySpecificData.kutuAdedi) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.kutuAdedi).toLocaleString('tr-TR')} Kutu` })
      if (categorySpecificData.saklamaKosulu) badges.push({ label: 'Saklama', value: String(categorySpecificData.saklamaKosulu) })
      if (categorySpecificData.itsKarekodSarti) badges.push({ label: 'İTS', value: 'Karekod Zorunlu' })
      break

    case 'gida_tarim':
    case 'gida_catering':
      if (categorySpecificData.gidaGrubu) badges.push({ label: 'Ürün', value: String(categorySpecificData.gidaGrubu) })
      if (categorySpecificData.miktarTon) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.miktarTon).toLocaleString('tr-TR')} Ton` })
      if (categorySpecificData.ambalajSekli) badges.push({ label: 'Ambalaj', value: String(categorySpecificData.ambalajSekli) })
      if (categorySpecificData.sogukZincirSevkiyat) badges.push({ label: 'Lojistik', value: 'Soğuk Zincir (+4°C/-18°C)' })
      break

    case 'tibbi_cihaz':
      if (categorySpecificData.cihazSinifi) badges.push({ label: 'Cihaz', value: String(categorySpecificData.cihazSinifi) })
      if (categorySpecificData.cihazAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.cihazAdedi} Adet` })
      if (categorySpecificData.garantiSuresiYil) badges.push({ label: 'Garanti', value: String(categorySpecificData.garantiSuresiYil) })
      if (categorySpecificData.utsKayitZorunlulugu) badges.push({ label: 'ÜTS', value: 'Kayıtlı' })
      break

    case 'kanalizasyon_su':
      if (categorySpecificData.boruTuru) badges.push({ label: 'Boru', value: String(categorySpecificData.boruTuru) })
      if (categorySpecificData.boruCapi) badges.push({ label: 'Çap', value: String(categorySpecificData.boruCapi) })
      if (categorySpecificData.basincDayanimi) badges.push({ label: 'Basınç', value: String(categorySpecificData.basincDayanimi) })
      if (categorySpecificData.toplamMetraj) badges.push({ label: 'Metraj', value: `${Number(categorySpecificData.toplamMetraj).toLocaleString('tr-TR')} m` })
      break

    case 'enerji_elektrik':
      if (categorySpecificData.sistemTipi) badges.push({ label: 'Sistem', value: String(categorySpecificData.sistemTipi) })
      if (categorySpecificData.kuruluGucKva) badges.push({ label: 'Güç', value: `${Number(categorySpecificData.kuruluGucKva).toLocaleString('tr-TR')} kVA/kWp` })
      if (categorySpecificData.anahtarTeslimDevreyeAlma) badges.push({ label: 'Model', value: 'EPC Anahtar Teslim' })
      break

    case 'akaryakit_enerji':
      if (categorySpecificData.yakitTuru) badges.push({ label: 'Yakıt', value: String(categorySpecificData.yakitTuru) })
      if (categorySpecificData.miktarLitre) badges.push({ label: 'Hacim', value: `${Number(categorySpecificData.miktarLitre).toLocaleString('tr-TR')} L` })
      if (categorySpecificData.iskontoOrani) badges.push({ label: 'İskonto', value: `%${categorySpecificData.iskontoOrani}` })
      if (categorySpecificData.teslimatYontemi) badges.push({ label: 'Teslimat', value: String(categorySpecificData.teslimatYontemi) })
      break

    case 'endustriyel_makine':
      if (categorySpecificData.makineKategorisi) badges.push({ label: 'Makine', value: String(categorySpecificData.makineKategorisi) })
      if (categorySpecificData.makineAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.makineAdedi} Adet` })
      if (categorySpecificData.motorGucuKw) badges.push({ label: 'Güç', value: `${categorySpecificData.motorGucuKw} kW` })
      if (categorySpecificData.makineGarantiSuresi) badges.push({ label: 'Garanti', value: String(categorySpecificData.makineGarantiSuresi) })
      break

    case 'bilisim_teknoloji':
      if (categorySpecificData.projeKapsami) badges.push({ label: 'Kapsam', value: String(categorySpecificData.projeKapsami) })
      if (categorySpecificData.kullaniciKapasitesi) badges.push({ label: 'Kapasite', value: `${categorySpecificData.kullaniciKapasitesi} Kullanıcı` })
      if (categorySpecificData.slaHedefi) badges.push({ label: 'SLA', value: String(categorySpecificData.slaHedefi) })
      break

    case 'lojistik_tasimacilik':
      if (categorySpecificData.tasimaTuru) badges.push({ label: 'Taşıma', value: String(categorySpecificData.tasimaTuru) })
      if (categorySpecificData.seferSayisi) badges.push({ label: 'Sefer', value: `${categorySpecificData.seferSayisi} Sefer` })
      if (categorySpecificData.ulastirmaBakanligiYetkiBelgesi) badges.push({ label: 'Belge', value: String(categorySpecificData.ulastirmaBakanligiYetkiBelgesi) })
      break

    case 'mobilya_ofis':
      if (categorySpecificData.mobilyaGrubu) badges.push({ label: 'Mobilya', value: String(categorySpecificData.mobilyaGrubu) })
      if (categorySpecificData.toplamTakimAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.toplamTakimAdedi} Parça` })
      if (categorySpecificData.katlaraTasimaVeMontaj) badges.push({ label: 'Montaj', value: 'Yerinde Kurulum Dahil' })
      break

    case 'hirdavat_metal':
      if (categorySpecificData.hammaddeTuru) badges.push({ label: 'Malzeme', value: String(categorySpecificData.hammaddeTuru) })
      if (categorySpecificData.siparisMiktari) badges.push({ label: 'Miktar', value: `${Number(categorySpecificData.siparisMiktari).toLocaleString('tr-TR')} Ton/Adet` })
      if (categorySpecificData.celikKaliteSinifi) badges.push({ label: 'Kalite', value: String(categorySpecificData.celikKaliteSinifi) })
      break

    case 'yangin_guvenlik':
      if (categorySpecificData.sistemTipi) badges.push({ label: 'Sistem', value: String(categorySpecificData.sistemTipi) })
      if (categorySpecificData.noktaVeyaHacim) badges.push({ label: 'Kapasite', value: `${categorySpecificData.noktaVeyaHacim} Nokta/m²` })
      if (categorySpecificData.en54VdUlfmsertifikasi) badges.push({ label: 'Standart', value: 'EN 54 / UL-FM' })
      break

    case 'kimyasal_gubre':
      if (categorySpecificData.kimyasalKategorisi) badges.push({ label: 'Kimyasal', value: String(categorySpecificData.kimyasalKategorisi) })
      if (categorySpecificData.siparisMiktariTon) badges.push({ label: 'Tonaj', value: `${categorySpecificData.siparisMiktariTon} Ton` })
      if (categorySpecificData.konsantrasyonSaflik) badges.push({ label: 'Saflık', value: String(categorySpecificData.konsantrasyonSaflik) })
      break

    case 'matbaa_kirtasiye':
      if (categorySpecificData.kirtasiyeMatbaaTuru) badges.push({ label: 'Ürün', value: String(categorySpecificData.kirtasiyeMatbaaTuru) })
      if (categorySpecificData.siparisAdedi) badges.push({ label: 'Adet', value: `${Number(categorySpecificData.siparisAdedi).toLocaleString('tr-TR')} Adet` })
      if (categorySpecificData.baskiProvasiOnayi) badges.push({ label: 'Prova', value: 'Fiziksel Renk Onaylı' })
      break

    case 'kent_mobilyalari':
      if (categorySpecificData.urunTuru) badges.push({ label: 'Tip', value: String(categorySpecificData.urunTuru) })
      if (categorySpecificData.toplamMiktarAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.toplamMiktarAdet} Adet/m²` })
      if (categorySpecificData.sahadaAnkrajVeMontaj) badges.push({ label: 'Montaj', value: 'Ankraj Sabitlemeli' })
      break

    case 'muhendislik_mimarlik':
      if (categorySpecificData.projeDisiplini) badges.push({ label: 'Disiplin', value: String(categorySpecificData.projeDisiplini) })
      if (categorySpecificData.toplamProjeAlaniM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamProjeAlaniM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.tmmobBuroTescilBelgesi) badges.push({ label: 'TMMOB', value: 'BTB Tescilli' })
      break

    case 'madencilik_sondaj':
      if (categorySpecificData.sondajTuru) badges.push({ label: 'Faaliyet', value: String(categorySpecificData.sondajTuru) })
      if (categorySpecificData.hedefDerinlikMetre) badges.push({ label: 'Metraj', value: `${Number(categorySpecificData.hedefDerinlikMetre).toLocaleString('tr-TR')} m` })
      if (categorySpecificData.kuyuInkisafVeDebiTesti) badges.push({ label: 'Test', value: 'Debi Raporlu' })
      break

    case 'asansor_otomasyon':
      if (categorySpecificData.asansorTipi) badges.push({ label: 'Tip', value: String(categorySpecificData.asansorTipi) })
      if (categorySpecificData.kapasiteKg) badges.push({ label: 'Kapasite', value: String(categorySpecificData.kapasiteKg) })
      if (categorySpecificData.durakSayisi) badges.push({ label: 'Durak', value: `${categorySpecificData.durakSayisi} Durak` })
      if (categorySpecificData.yesilEtiketRuhsatSarti) badges.push({ label: 'Ruhsat', value: 'Yeşil Etiket Dahil' })
      break

    case 'klima_havalandirma':
      if (categorySpecificData.hvacSistemi) badges.push({ label: 'HVAC', value: String(categorySpecificData.hvacSistemi) })
      if (categorySpecificData.toplamSogutmaGucuKw) badges.push({ label: 'Kapasite', value: `${categorySpecificData.toplamSogutmaGucuKw} kW` })
      if (categorySpecificData.gazCinsi) badges.push({ label: 'Gaz', value: String(categorySpecificData.gazCinsi) })
      break

    case 'savunma_havacilik':
      if (categorySpecificData.savunmaAlani) badges.push({ label: 'Kategori', value: String(categorySpecificData.savunmaAlani) })
      if (categorySpecificData.balistikKorumaSeviyesi) badges.push({ label: 'Balistik', value: String(categorySpecificData.balistikKorumaSeviyesi) })
      if (categorySpecificData.talepMiktariAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.talepMiktariAdet} Adet` })
      break

    case 'arac_is_makinesi':
      if (categorySpecificData.aracSinifi) badges.push({ label: 'Sınıf', value: String(categorySpecificData.aracSinifi) })
      if (categorySpecificData.aracAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.aracAdedi} Adet` })
      if (categorySpecificData.sozlesmeTuru) badges.push({ label: 'Model', value: String(categorySpecificData.sozlesmeTuru) })
      break

    case 'turizm_organizasyon':
      if (categorySpecificData.etkinlikTuru) badges.push({ label: 'Etkinlik', value: String(categorySpecificData.etkinlikTuru) })
      if (categorySpecificData.katilimciSayisi) badges.push({ label: 'Katılımcı', value: `${Number(categorySpecificData.katilimciSayisi).toLocaleString('tr-TR')} Kişi` })
      if (categorySpecificData.tursabAGrubuBelgesi) badges.push({ label: 'TÜRSAB', value: 'A Grubu Belgeli' })
      break

    case 'reklam_tanitim':
      if (categorySpecificData.reklamTuru) badges.push({ label: 'Reklam', value: String(categorySpecificData.reklamTuru) })
      if (categorySpecificData.olcuM2VeyaAdet) badges.push({ label: 'Ölçü', value: `${categorySpecificData.olcuM2VeyaAdet} m²/Adet` })
      if (categorySpecificData.isiklandirmaStandarti) badges.push({ label: 'LED', value: String(categorySpecificData.isiklandirmaStandarti) })
      break

    case 'peyzaj_ormancilik':
      if (categorySpecificData.peyzajKapsami) badges.push({ label: 'Uygulama', value: String(categorySpecificData.peyzajKapsami) })
      if (categorySpecificData.toplamAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.bitkiTutmaGarantisi) badges.push({ label: 'Garanti', value: '1 Yıl Tutma Garantili' })
      break

    case 'hayvancilik_yem':
      if (categorySpecificData.yemHayvanKategorisi) badges.push({ label: 'Yem/Hayvan', value: String(categorySpecificData.yemHayvanKategorisi) })
      if (categorySpecificData.miktarTonVeyaBas) badges.push({ label: 'Miktar', value: `${categorySpecificData.miktarTonVeyaBas} Ton/Baş` })
      if (categorySpecificData.hamProteinOrani) badges.push({ label: 'Protein', value: String(categorySpecificData.hamProteinOrani) })
      break

    case 'sanat_heykel':
      if (categorySpecificData.eserTuru) badges.push({ label: 'Eser', value: String(categorySpecificData.eserTuru) })
      if (categorySpecificData.malzemeCinsi) badges.push({ label: 'Malzeme', value: String(categorySpecificData.malzemeCinsi) })
      if (categorySpecificData.olcekVeyaEbatMetre) badges.push({ label: 'Boyut', value: String(categorySpecificData.olcekVeyaEbatMetre) })
      break

    case 'odun_komur':
      if (categorySpecificData.katiYakitTuru) badges.push({ label: 'Yakıt', value: String(categorySpecificData.katiYakitTuru) })
      if (categorySpecificData.siparisMiktariTon) badges.push({ label: 'Tonaj', value: `${categorySpecificData.siparisMiktariTon} Ton` })
      if (categorySpecificData.asgariKaloriDegeri) badges.push({ label: 'Kalori', value: String(categorySpecificData.asgariKaloriDegeri) })
      break

    case 'hazir_yemek_ikram':
      if (categorySpecificData.gunlukKisiSayisi) badges.push({ label: 'Kapasite', value: `${categorySpecificData.gunlukKisiSayisi} Kişi/Gün` })
      if (categorySpecificData.menuKapSayisi) badges.push({ label: 'Menü', value: String(categorySpecificData.menuKapSayisi) })
      if (categorySpecificData.servisBicimi) badges.push({ label: 'Servis', value: String(categorySpecificData.servisBicimi) })
      break

    case 'elektronik_bilgisayar':
      if (categorySpecificData.donanimTuru) badges.push({ label: 'Donanım', value: String(categorySpecificData.donanimTuru) })
      if (categorySpecificData.cihazAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.cihazAdedi} Adet` })
      if (categorySpecificData.yerindeGarantiTuru) badges.push({ label: 'Garanti', value: String(categorySpecificData.yerindeGarantiTuru) })
      break

    case 'kamera_guvenlik_scada':
      if (categorySpecificData.guvenlikSistemiTuru) badges.push({ label: 'Sistem', value: String(categorySpecificData.guvenlikSistemiTuru) })
      if (categorySpecificData.kameraKanalAdedi) badges.push({ label: 'Kanal', value: `${categorySpecificData.kameraKanalAdedi} Nokta` })
      if (categorySpecificData.kayitSuresiVeRaid) badges.push({ label: 'Kayıt', value: String(categorySpecificData.kayitSuresiVeRaid) })
      break

    case 'temizlik_geri_donusum':
      if (categorySpecificData.temizlikKapsami) badges.push({ label: 'Hizmet', value: String(categorySpecificData.temizlikKapsami) })
      if (categorySpecificData.kapaliAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Kadrosu', value: `${categorySpecificData.personelSayisi} Personel` })
      break

    case 'tekstil_giyim':
      if (categorySpecificData.tekstilUrunTuru) badges.push({ label: 'Ürün', value: String(categorySpecificData.tekstilUrunTuru) })
      if (categorySpecificData.toplamTakimAdedi) badges.push({ label: 'Adet', value: `${categorySpecificData.toplamTakimAdedi} Takım` })
      if (categorySpecificData.kurumsalLogoNakisiDahil) badges.push({ label: 'Baskı', value: 'Logo Nakışlı' })
      break

    case 'is_sagligi_guvenligi':
      if (categorySpecificData.kkdKategorisi) badges.push({ label: 'KKD', value: String(categorySpecificData.kkdKategorisi) })
      if (categorySpecificData.siparisAdedi) badges.push({ label: 'Adet', value: `${Number(categorySpecificData.siparisAdedi).toLocaleString('tr-TR')} Adet` })
      if (categorySpecificData.ceKategoriIiiSertifikasi) badges.push({ label: 'Belge', value: 'Kat III CE Sertifikalı' })
      break

    case 'ozel_guvenlik':
      if (categorySpecificData.guvenlikTuru) badges.push({ label: 'Güvenlik', value: String(categorySpecificData.guvenlikTuru) })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Personel', value: `${categorySpecificData.personelSayisi} Güvenlik Görevlisi` })
      if (categorySpecificData.vardiyaSistemi) badges.push({ label: 'Vardiya', value: String(categorySpecificData.vardiyaSistemi) })
      break

    case 'egitim_tercume':
      if (categorySpecificData.hizmetAlani) badges.push({ label: 'Hizmet', value: String(categorySpecificData.hizmetAlani) })
      if (categorySpecificData.hacimBirimSayisi) badges.push({ label: 'Hacim', value: `${Number(categorySpecificData.hacimBirimSayisi).toLocaleString('tr-TR')} Birim` })
      if (categorySpecificData.noterYeminZapti) badges.push({ label: 'Yemin', value: 'Noter Yeminli' })
      break

    case 'isletmecilik_hizmet':
      if (categorySpecificData.isletmeKapsami) badges.push({ label: 'İşletme', value: String(categorySpecificData.isletmeKapsami) })
      if (categorySpecificData.personelSayisi) badges.push({ label: 'Personel', value: `${categorySpecificData.personelSayisi} Kişi` })
      if (categorySpecificData.iskurOzelIstihdamIzni) badges.push({ label: 'İZİN', value: 'İŞKUR İzinli' })
      break

    case 'sigorta_finans':
      if (categorySpecificData.sigortaFinansTuru) badges.push({ label: 'Poliçe', value: String(categorySpecificData.sigortaFinansTuru) })
      if (categorySpecificData.aracVeyaVarlikSayisi) badges.push({ label: 'Varlık', value: `${categorySpecificData.aracVeyaVarlikSayisi} Adet/Tesis` })
      if (categorySpecificData.toplamSigortaBedeliTl) badges.push({ label: 'Teminat', value: `${Number(categorySpecificData.toplamSigortaBedeliTl).toLocaleString('tr-TR')} ₺` })
      break

    case 'hurda_arac_satisi':
      if (categorySpecificData.satisTuru) badges.push({ label: 'Satış', value: String(categorySpecificData.satisTuru) })
      if (categorySpecificData.tahminiMiktarTonVeyaAdet) badges.push({ label: 'Miktar', value: `${categorySpecificData.tahminiMiktarTonVeyaAdet} Ton/Adet` })
      if (categorySpecificData.asgariMuhammenBedel) badges.push({ label: 'Muhammen', value: `${Number(categorySpecificData.asgariMuhammenBedel).toLocaleString('tr-TR')} ₺` })
      break

    case 'gayrimenkul_arsa':
      if (categorySpecificData.gayrimenkulTuru) badges.push({ label: 'Mülk', value: String(categorySpecificData.gayrimenkulTuru) })
      if (categorySpecificData.toplamAlanM2) badges.push({ label: 'Alan', value: `${Number(categorySpecificData.toplamAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.imarDurumu) badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
      if (categorySpecificData.katKarsiligiAsgariOran) badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.katKarsiligiAsgariOran}` })
      break

    case 'arsa_arazi':
      if (categorySpecificData.adaParselNo) badges.push({ label: 'Ada/Parsel', value: String(categorySpecificData.adaParselNo) })
      if (categorySpecificData.toplamYuzolcumuM2) badges.push({ label: 'Yüzölçümü', value: `${Number(categorySpecificData.toplamYuzolcumuM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.imarDurumu) badges.push({ label: 'İmar', value: String(categorySpecificData.imarDurumu) })
      if (categorySpecificData.asgariKatKarsiligiOrani) badges.push({ label: 'Kat Karşılığı', value: `%${categorySpecificData.asgariKatKarsiligiOrani}` })
      break

    case 'konut_daire':
      if (categorySpecificData.odaSayisi) badges.push({ label: 'Oda', value: String(categorySpecificData.odaSayisi) })
      if (categorySpecificData.netMetrekare) badges.push({ label: 'Net', value: `${categorySpecificData.netMetrekare} m²` })
      if (categorySpecificData.tapuMulkDurumu) badges.push({ label: 'Tapu', value: String(categorySpecificData.tapuMulkDurumu) })
      if (categorySpecificData.binaYasi) badges.push({ label: 'Yaş', value: String(categorySpecificData.binaYasi) })
      break

    case 'ticari_gayrimenkul':
      if (categorySpecificData.ticariNitelik) badges.push({ label: 'Tip', value: String(categorySpecificData.ticariNitelik) })
      if (categorySpecificData.kapaliAlanM2) badges.push({ label: 'Kapalı Alan', value: `${Number(categorySpecificData.kapaliAlanM2).toLocaleString('tr-TR')} m²` })
      if (categorySpecificData.tavanYuksekligiMetre) badges.push({ label: 'Yükseklik', value: String(categorySpecificData.tavanYuksekligiMetre) })
      if (categorySpecificData.tirYuklemeRampasiAdedi) badges.push({ label: 'Rampa', value: `${categorySpecificData.tirYuklemeRampasiAdedi} Adet` })
      break
  }

  return badges
}
""")

    output_path = BASE_DIR.parent / 'app' / 'utils' / 'categoryFieldsSchema.ts'
    output_content = "\n".join(lines)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
    print(f"Successfully wrote {len(lines)} lines to {output_path}")

if __name__ == '__main__':
    generate_ts()
