import { defineEventHandler, readBody } from 'h3'
import { matchSuppliersOrBuyers } from '~~/server/utils/smartMatchingEngine'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  if (!body.title) {
    return {
      success: false,
      code: 'MISSING_TITLE',
      message: 'Eşleştirme için ilan başlığı (title) zorunludur.',
      timestamp: new Date().toISOString()
    }
  }

  const startTime = Date.now()
  const result = matchSuppliersOrBuyers({
    id: body.id || `TND-${Date.now().toString().slice(-4)}`,
    title: body.title,
    category: body.category || 'Genel Ticaret & Hizmet',
    city: body.city,
    budget: body.budget,
    description: body.description
  })

  return {
    success: true,
    code: 'MATCH_COMPLETED',
    durationMs: Date.now() - startTime,
    result,
    timestamp: new Date().toISOString()
  }
})
