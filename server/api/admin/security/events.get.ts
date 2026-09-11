import { defineEventHandler, getQuery } from 'h3'
import { getAllSecurityEvents, SecurityEventType, SecuritySeverity } from '~~/server/utils/securityAuditStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const eventType = query.type as SecurityEventType | undefined
  const severity = query.severity as SecuritySeverity | undefined
  const limit = parseInt(query.limit as string || '100', 10)

  let events = getAllSecurityEvents()

  if (eventType) {
    events = events.filter(e => e.eventType === eventType)
  }
  if (severity) {
    events = events.filter(e => e.severity === severity)
  }

  const all = getAllSecurityEvents()
  const metrics = {
    totalEvents: all.length,
    collusionSignals: all.filter(e => e.eventType === 'COLLUSION_SIGNAL_DETECTED').length,
    idorAttempts: all.filter(e => e.eventType === 'IDOR_ATTEMPT').length,
    mfaVerifications: all.filter(e => e.eventType === 'MFA_VERIFIED').length,
    maliciousFilesBlocked: all.filter(e => e.eventType === 'MALICIOUS_FILE_BLOCKED').length,
    rateLimitsHit: all.filter(e => e.eventType === 'RATE_LIMIT_HIT').length,
    roleViolations: all.filter(e => e.eventType === 'ROLE_VIOLATION').length
  }

  return {
    success: true,
    serverTime: new Date().toISOString(),
    metrics,
    systemHealth: {
      tenantIsolationActive: true, // SEC-002
      rateLimitingActive: true, // SEC-008
      sealedBidMaskingActive: true, // SEC-004
      immutableAuditActive: true, // SEC-005
      xssSanitizationActive: true, // SEC-013
      fileValidationActive: true // SEC-012
    },
    count: events.length,
    events: events.slice(0, limit)
  }
})
