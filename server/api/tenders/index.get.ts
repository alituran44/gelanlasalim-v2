import { getAllTenders } from '~~/server/utils/tendersStore'

export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  const tenders = getAllTenders()
  return {
    success: true,
    count: tenders.length,
    tenders
  }
})
