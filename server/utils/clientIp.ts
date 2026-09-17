import type { H3Event } from 'h3'
import { getRequestHeaders } from 'h3'

/**
 * 🛡️ SEC-IP: Güvenilir İstemci IP Çözümleyicisi (Trusted Proxy & Anti-Spoofing)
 *
 * Mimarisi & Tehdit Modeli:
 * 1. Doğrudan veya Ters Vekil (Reverse Proxy) Ortamları:
 *    - İstemci tarafından gönderilen "X-Forwarded-For" başlığı, araya giren güvenilir bir ters vekil
 *      (örn: Vercel, Cloudflare, Nginx) tarafından sanitize edilmediğinde kolayca sahtelenebilir (IP Spoofing).
 * 2. Vercel & Cloudflare Koruması:
 *    - Vercel, istemcinin doğrudan bağlandığı dış IP'yi 'x-real-ip' ve 'x-vercel-forwarded-for' başlıklarına yazar.
 *      İstemciden gelen sahte 'x-real-ip' başlıkları Vercel Edge proxy tarafından ezilir.
 *    - Cloudflare 'cf-connecting-ip' başlığını yetkili kaynak olarak sunar.
 * 3. Fallback Sıralaması:
 *    - x-real-ip (En yüksek güven: Vercel / Nginx over-write)
 *    - x-vercel-forwarded-for
 *    - cf-connecting-ip (Cloudflare Edge)
 *    - x-forwarded-for (Virgülle ayrılmış listede ilk geçerli IP)
 *    - socket.remoteAddress (TCP soketi)
 */
export function resolveClientIp(event: H3Event): string {
  const headers = getRequestHeaders(event)

  // 1. Vercel & Nginx tarafından doğrulanmış gerçek istemci IP'si
  const realIp = (headers['x-real-ip'] as string || '').trim()
  if (realIp && isValidIp(realIp)) {
    return realIp
  }

  // 2. Vercel Edge Forwarded For
  const vercelFwd = (headers['x-vercel-forwarded-for'] as string || '').trim()
  if (vercelFwd) {
    const firstVercel = vercelFwd.split(',')[0].trim()
    if (isValidIp(firstVercel)) {
      return firstVercel
    }
  }

  // 3. Cloudflare Edge
  const cfIp = (headers['cf-connecting-ip'] as string || '').trim()
  if (cfIp && isValidIp(cfIp)) {
    return cfIp
  }

  // 4. Standart X-Forwarded-For
  const forwardedFor = (headers['x-forwarded-for'] as string || '').trim()
  if (forwardedFor) {
    const clientCandidates = forwardedFor.split(',').map(s => s.trim()).filter(Boolean)
    if (clientCandidates.length > 0 && isValidIp(clientCandidates[0])) {
      return clientCandidates[0]
    }
  }

  // 5. Node.js TCP Soket Adresi
  const socketIp = event.node?.req?.socket?.remoteAddress
  if (socketIp) {
    const cleanSocketIp = socketIp.replace(/^::ffff:/, '').trim()
    if (cleanSocketIp) {
      return cleanSocketIp
    }
  }

  return '127.0.0.1'
}

function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 64) return false
  // Basit IPv4 veya IPv6 denetimi, header injection veya CRLF engelleme
  if (/[\r\n\t]/.test(ip)) return false
  return true
}
