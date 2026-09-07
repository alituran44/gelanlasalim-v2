import { getAllBids, getBidsForTender } from '~~/server/utils/bidsStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const query = getQuery(event)
  const tenderId = query.tenderId as string | undefined
  const ownerEmail = query.ownerEmail as string | undefined

  let bids = getAllBids()

  if (tenderId) {
    bids = bids.filter(b => b.tenderId === tenderId)
  }

  if (ownerEmail) {
    const cleanEmail = ownerEmail.trim().toLowerCase()
    bids = bids.filter(b => (b.ownerEmail || '').trim().toLowerCase() === cleanEmail)
  }

  return {
    success: true,
    count: bids.length,
    bids
  }
})
