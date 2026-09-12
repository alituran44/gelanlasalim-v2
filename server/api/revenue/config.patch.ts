import { defineEventHandler, readBody, createError } from 'h3'
import { updateRevenueModelConfig, RevenueModelConfig } from '~~/server/utils/revenueModelStore'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<RevenueModelConfig>>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz parametre gövdesi.'
    })
  }

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
