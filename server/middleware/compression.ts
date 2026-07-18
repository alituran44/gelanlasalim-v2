import { defineEventHandler, getHeader } from 'h3'
import zlib from 'zlib'

export default defineEventHandler((event) => {
  const req = event.node.req
  const res = event.node.res
  const acceptEncoding = getHeader(event, 'accept-encoding') || ''

  // Skip compression for assets pre-compressed by Nitro or non-compressible files
  if (req.url?.includes('/_nuxt/') || req.url?.includes('/assets/')) {
    return
  }

  const oldWrite = res.write
  const oldEnd = res.end
  const chunks: Buffer[] = []

  // Override write to buffer chunks
  res.write = function (chunk: any, ...args: any[]): boolean {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return true
  }

  // Override end to compress buffer chunks
  res.end = function (chunk: any, ...args: any[]): any {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    const buffer = Buffer.concat(chunks)
    const contentType = (res.getHeader('content-type') || '') as string
    const contentEncoding = res.getHeader('content-encoding')

    // Only compress text, HTML, JSON, JS, CSS and XML, and avoid double compression
    const isCompressible = !contentEncoding && (
      contentType.includes('text/') || 
      contentType.includes('json') || 
      contentType.includes('javascript') ||
      contentType.includes('xml') ||
      contentType.includes('svg')
    )

    if (isCompressible && buffer.length > 512) {
      try {
        if (acceptEncoding.includes('br')) {
          res.setHeader('Content-Encoding', 'br')
          res.removeHeader('Content-Length')
          const compressed = zlib.brotliCompressSync(buffer)
          res.setHeader('Content-Length', compressed.length)
          return oldEnd.call(res, compressed)
        } else if (acceptEncoding.includes('gzip')) {
          res.setHeader('Content-Encoding', 'gzip')
          res.removeHeader('Content-Length')
          const compressed = zlib.gzipSync(buffer)
          res.setHeader('Content-Length', compressed.length)
          return oldEnd.call(res, compressed)
        }
      } catch (err) {
        console.error('Compression error:', err)
      }
    }

    return oldEnd.call(res, buffer)
  }
})
