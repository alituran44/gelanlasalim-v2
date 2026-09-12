import { defineEventHandler, readBody, createError } from 'h3'
import { restoreFullSystemSnapshot, testBackupRestoreCycle } from '~~/server/utils/systemEnvironmentStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Eğer test modu ise, tam bir döngü self-test gerçekleştir
  if (body?.mode === 'SELF_TEST') {
    const testResult = testBackupRestoreCycle()
    return {
      success: true,
      message: 'Otomatik yedekleme ve geri yükleme döngü testi başarıyla tamamlandı.',
      testResult
    }
  }

  if (!body || !body.snapshot) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geri yüklenecek snapshot verisi eksik.'
    })
  }

  try {
    const restoreResult = restoreFullSystemSnapshot(body.snapshot)
    return {
      success: true,
      message: restoreResult.message,
      checksum: restoreResult.restoredChecksum
    }
  } catch (err: any) {
    throw createError({
      statusCode: 422,
      statusMessage: err.message || 'Yedek geri yüklenirken hata oluştu.'
    })
  }
})
