import { createError, H3Event } from 'h3'
import { logSecurityEvent } from './securityAuditStore'

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx']
const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.js', '.jsx', '.ts',
  '.vbs', '.dll', '.msi', '.scr', '.jar', '.ps1', '.py', '.rb', '.pl'
]

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15 MB

export interface FileValidationResult {
  valid: boolean
  error?: string
  sanitizedFileName: string
}

/**
 * 🛡️ SEC-012: Dosya Yükleme Güvenliği & Zararlı İçerik Filtresi
 */
export function validateUploadedFile(
  event: H3Event | null,
  fileMeta: {
    fileName: string
    fileSize?: number
    base64OrBuffer?: string
    mimeType?: string
  }
): FileValidationResult {
  const rawName = (fileMeta.fileName || '').trim()
  const lowerName = rawName.toLowerCase()

  // 1. Check blocked extensions
  const isBlocked = BLOCKED_EXTENSIONS.some(ext => lowerName.endsWith(ext))
  if (isBlocked) {
    if (event) {
      logSecurityEvent(event, {
        eventType: 'MALICIOUS_FILE_BLOCKED',
        severity: 'HIGH',
        targetResource: event.node.req.url,
        actionTaken: 'BLOCKED_403',
        details: { fileName: rawName, reason: 'Yasaklı çalıştırılabilir dosya uzantısı tespit edildi.' }
      })
    }
    throw createError({
      statusCode: 400,
      statusMessage: `Güvenlik İhlali: "${rawName}" dosya türünün platforma yüklenmesi güvenlik gerekçesiyle engellenmiştir (Kural SEC-012).`
    })
  }

  // 2. Check allowed extensions
  const isAllowed = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext))
  if (!isAllowed) {
    throw createError({
      statusCode: 400,
      statusMessage: `Geçersiz dosya formatı. Yalnızca PDF, PNG, JPG, DOCX ve XLSX formatları kabul edilmektedir (Kural SEC-012).`
    })
  }

  // 3. Check file size
  if (fileMeta.fileSize && fileMeta.fileSize > MAX_FILE_SIZE_BYTES) {
    throw createError({
      statusCode: 400,
      statusMessage: `Dosya boyutu 15 MB sınırını aşamaz (Mevcut: ${(fileMeta.fileSize / (1024 * 1024)).toFixed(1)} MB).`
    })
  }

  // 4. Magic Bytes Inspection (if base64 content provided)
  if (fileMeta.base64OrBuffer && typeof fileMeta.base64OrBuffer === 'string') {
    const rawContent = fileMeta.base64OrBuffer
    // Check for obvious PHP/script injection in data
    if (rawContent.includes('<?php') || rawContent.includes('<script') || rawContent.includes('eval(')) {
      if (event) {
        logSecurityEvent(event, {
          eventType: 'MALICIOUS_FILE_BLOCKED',
          severity: 'CRITICAL',
          targetResource: event.node.req.url,
          actionTaken: 'BLOCKED_403',
          details: { fileName: rawName, reason: 'Dosya içeriğinde zararlı betik/kod parçası tespit edildi.' }
        })
      }
      throw createError({
        statusCode: 400,
        statusMessage: 'Zararlı içerik tespit edildi: Dosya yükleme işlemi reddedildi (Kural SEC-012).'
      })
    }
  }

  // Clean filename of path traversal attempts (e.g. ../../)
  const sanitizedFileName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_')

  return {
    valid: true,
    sanitizedFileName
  }
}
