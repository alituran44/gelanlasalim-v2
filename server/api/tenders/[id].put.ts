import { defineEventHandler, getRouterParam, readBody, setHeader, createError, getRequestHeaders } from 'h3'
import { getAllTenders, addTender, TenderItem } from '~~/server/utils/tendersStore'
import { addGibLog } from '~~/server/utils/gibAuditStore'
import { resolveSession, assertTenantAccess, requireAuth } from '~~/server/utils/authGuard'
import { resolveClientIp } from '~~/server/utils/clientIp'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhale ID belirtilmelidir.'
    })
  }

  const rawBody = await readBody<Partial<TenderItem>>(event)
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek ihale verisi bulunamadı.'
    })
  }

  const session = resolveSession(event)
  const reqEmail = (session.userEmail || (rawBody.ownerEmail as string) || '').trim().toLowerCase()

  const allTenders = getAllTenders()
  let targetTender = allTenders.find(t => t.id === id)

  // 🛡️ Upsert Pattern: Serverless ortamda Lambda soğuk başlatma (cold start) veya
  // istemcide oluşturulmuş ihalelerde hedef ihale sunucu belleğinde henüz yoksa gövdeden üret
  if (!targetTender) {
    if (rawBody.baslik) {
      targetTender = {
        id,
        baslik: rawBody.baslik,
        kategori: rawBody.kategori || 'Genel',
        ownerEmail: rawBody.ownerEmail || reqEmail || 'ihalecib@gmail.com',
        ownerCompany: rawBody.ownerCompany || session.companyVkn || 'İhale Sahibi',
        durum: rawBody.durum || 'active',
        sure: rawBody.sure || '7 gün kaldı',
        butce: rawBody.butce || '💬 Teklif Usulü',
        kalemler: Array.isArray(rawBody.kalemler) ? rawBody.kalemler : [],
        ...rawBody
      } as TenderItem
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Güncellenmek istenen ihale bulunamadı.'
      })
    }
  }

  // 🛡️ Sistem referans ihaleleri koruma altındadır
  if (targetTender.isBaseline) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Sistem referans ihaleleri değiştirilemez.'
    })
  }

  // 🛡️ SEC-002: Tenant İzolasyonu & Yetki Denetimi: İhaleyi açan kişi veya sistem admini güncelleyebilir
  const allowedOwners = [
    targetTender.ownerEmail,
    (targetTender as any).vkn,
    (targetTender as any).taxId
  ].filter(Boolean)

  assertTenantAccess(event, allowedOwners)

  // Revizyon geçmişi kaydı (TND-014 denetim izi)
  const currentVersion = Number(targetTender.specVersion || 1)
  const newVersion = currentVersion + 1

  const specHistory = Array.isArray(targetTender.specHistory) ? [...targetTender.specHistory] : []
  specHistory.push({
    version: currentVersion,
    changedAt: new Date().toISOString(),
    changedBy: reqEmail || targetTender.ownerEmail || 'İhale Sahibi',
    changeNote: rawBody.changeNote || 'İhale detayları güncellendi.'
  })

  // Güncellenen nesne
  const updatedTender: TenderItem = {
    ...targetTender,
    ...rawBody,
    id: targetTender.id, // ID korunur
    ownerEmail: targetTender.ownerEmail || reqEmail, // Sahip korunur
    ownerCompany: targetTender.ownerCompany || rawBody.ownerCompany,
    specVersion: newVersion,
    specHistory,
    updatedAt: new Date().toISOString()
  }

  // Kalemler güncelleniyorsa garanti altına al
  if (rawBody.kalemler && Array.isArray(rawBody.kalemler)) {
    updatedTender.kalemler = rawBody.kalemler
  }

  // Dosya, Görseller ve Sektörel Parametreler
  if (rawBody.images) updatedTender.images = rawBody.images
  if (rawBody.files) updatedTender.files = rawBody.files
  if (rawBody.documents) updatedTender.documents = rawBody.documents
  if (rawBody.categorySpecificData) updatedTender.categorySpecificData = rawBody.categorySpecificData
  if (rawBody.customFields) updatedTender.customFields = rawBody.customFields

  addTender(updatedTender)

  // GİB Denetim Günlüğü (595 VUK)
  try {
    const clientIp = resolveClientIp(event)
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
      ipAddress: clientIp || '127.0.0.1',
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
