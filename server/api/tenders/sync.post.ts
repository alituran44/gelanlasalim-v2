import { defineEventHandler, readBody, setHeader } from 'h3'
import { syncTendersBatch, TenderItem } from '../../utils/tendersStore'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const body = await readBody<{ tenders?: TenderItem[] }>(event)
    const incoming = Array.isArray(body?.tenders) ? body.tenders : []
    const updated = syncTendersBatch(incoming)
    return {
      success: true,
      count: updated.length,
      tenders: updated
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Sync failed',
      tenders: []
    }
  }
})
