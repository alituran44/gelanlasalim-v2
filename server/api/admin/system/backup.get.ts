import { defineEventHandler, setHeader } from 'h3'
import { exportFullSystemSnapshot } from '~~/server/utils/systemEnvironmentStore'
import { requireAdmin } from '~~/server/utils/authGuard'

export default defineEventHandler((event) => {
  // 🛡️ Admin Yetki Doğrulaması
  requireAdmin(event)

  const snapshot = exportFullSystemSnapshot()

  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="ihaleciburada-backup-${snapshot.snapshotId}.json"`)

  return snapshot
})
