import { defineEventHandler } from 'h3'
import { runCompleteUatSuite } from '~~/server/utils/penetrationTestMatrix'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması
  requireAdmin(event)

  const uatReport = runCompleteUatSuite()

  return {
    success: true,
    serverTime: new Date().toISOString(),
    uatReport
  }
})
