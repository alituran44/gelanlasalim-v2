import { getAllTenders, addTender, TenderItem } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID belirtilmelidir.'
    })
  }

  const body = await readBody<Partial<TenderItem>>(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek ihale verisi bulunamadı.'
    })
  }

  const allTenders = getAllTenders()
  const targetTender = allTenders.find(t => t.id === id)

  if (!targetTender) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Güncellenmek istenen ihale bulunamadı.'
    })
  }

  // 🛡️ Sistem referans ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri değiştirilemez.'
    })
  }

  // Yetkilendirme kontrolü: İhale sahibi veya admin token
  const headers = getRequestHeaders(event)
  const reqEmail = (headers['x-user-email'] as string | undefined)?.toLowerCase().trim()
  const authHeader = headers['authorization'] || ''
  const isAdmin = authHeader.includes('admin') || Boolean(headers['x-admin-token'])

  if (targetTender.ownerEmail && reqEmail && !isAdmin) {
    if (targetTender.ownerEmail.toLowerCase().trim() !== reqEmail) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bu ihaleyi yalnızca ihale sahibi güncelleyebilir (Yetkisiz IDOR işlemi engellendi).'
      })
    }
  }

  // Revizyon geçmişi kaydı (TND-014 denetim izi)
  const currentVersion = Number(targetTender.specVersion || 1)
  const newVersion = currentVersion + 1

  const specHistory = Array.isArray(targetTender.specHistory) ? [...targetTender.specHistory] : []
  specHistory.push({
    version: currentVersion,
    changedAt: new Date().toISOString(),
    changedBy: reqEmail || targetTender.ownerEmail || 'İhale Sahibi',
    changeNote: body.changeNote || 'İhale detayları güncellendi.'
  })

  // Güncellenen nesne
  const updatedTender: TenderItem = {
    ...targetTender,
    ...body,
    id: targetTender.id, // ID korunur
    ownerEmail: targetTender.ownerEmail, // Sahip korunur
    ownerCompany: targetTender.ownerCompany || body.ownerCompany,
    specVersion: newVersion,
    specHistory,
    updatedAt: new Date().toISOString()
  }

  // Kalemler güncelleniyorsa garanti altına al
  if (body.kalemler && Array.isArray(body.kalemler)) {
    updatedTender.kalemler = body.kalemler
  }

  // Dosya & Görseller
  if (body.images) updatedTender.images = body.images
  if (body.files) updatedTender.files = body.files
  if (body.documents) updatedTender.documents = body.documents

  addTender(updatedTender)

  // GİB Denetim Günlüğü (595 VUK)
  try {
    addGibLog({
      tenderId: updatedTender.id,
      tenderTitle: updatedTender.baslik,
      action: 'IHALE_GUNCELLENDI',
      actionLabel: `İhale Bilgileri Güncellendi (Revizyon v${newVersion})`,
      category: updatedTender.kategori || 'Genel',
      budget: updatedTender.butce || '-',
      direction: updatedTender.tur || updatedTender.ihaleYonu || '-',
      taxIdType: 'VKN',
      taxId: '9560161511',
      taxOffice: 'Çanakkale Vergi Dairesi',
      companyOrFullName: updatedTender.ownerCompany || 'İhale Sahibi',
      ownerEmail: updatedTender.ownerEmail || reqEmail || 'ihalecib@gmail.com',
      ownerPhone: '0850 840 86 95',
      city: updatedTender.city || 'Türkiye',
      address: updatedTender.teslimatAdresi || `${updatedTender.city || 'Türkiye'} / Merkez`,
      ipAddress: (headers['x-forwarded-for'] as string)?.split(',')[0].trim() || '127.0.0.1',
      timestamp: new Date().toISOString(),
      status: 'HAZIR'
    })
  } catch (gibErr) {
    console.warn('[GIB Log Warning in PUT tender]:', gibErr)
  }

  return {
    success: true,
    message: `İhale bilgileri başarıyla güncellendi (Revizyon ${newVersion}).`,
    tender: updatedTender
  }
})
