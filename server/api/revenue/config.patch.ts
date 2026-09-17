import { defineEventHandler, readBody, createError } from 'h3'
import { updateRevenueModelConfig, RevenueModelConfig } from '~~/server/utils/revenueModelStore'
import { requireAdmin, sanitizePayload } from '~~/server/utils/authGuard'

export default defineEventHandler(async (event) => {
  // 🛡️ Admin Yetki Doğrulaması (401/403)
  requireAdmin(event)
  const rawBody = await readBody<Partial<RevenueModelConfig>>(event)

  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz parametre gövdesi.'
    })
  }

  // 🛡️ SEC-013: Girdi Temizleme
  const body = sanitizePayload(rawBody)

  // Alıcı komisyonu değiştirilemez (PRD kuralı: REV-001)
  if (body.buyerCommissionRate !== undefined && body.buyerCommissionRate !== 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İhaleciBurada B2B prensibi gereği Alıcı Komisyonu %0 olmak zorundadır.'
    })
  }

  const updated = updateRevenueModelConfig(body, 'Admin (9560161511)')

  return {
    success: true,
    message: 'Gelir modeli yapılandırması başarıyla güncellendi.',
    config: updated
  }
})
