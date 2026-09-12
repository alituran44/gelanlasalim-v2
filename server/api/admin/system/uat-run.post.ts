import { defineEventHandler } from 'h3'
import { runCompleteUatSuite } from '~~/server/utils/penetrationTestMatrix'

export default defineEventHandler(() => {
  const uatReport = runCompleteUatSuite()

  return {
    success: true,
    serverTime: new Date().toISOString(),
    uatReport
  }
})
