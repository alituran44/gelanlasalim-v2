import { defineEventHandler, getRequestHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event)

  const vercelCity = headers['x-vercel-ip-city']
  const vercelRegion = headers['x-vercel-ip-country-region']
  const vercelLat = headers['x-vercel-ip-latitude']
  const vercelLon = headers['x-vercel-ip-longitude']
  const vercelCountry = headers['x-vercel-ip-country']

  let city = vercelCity ? decodeURIComponent(vercelCity) : ''

  // Yerel geliştirme ortamında veya Vercel başlığı olmadığında hızlı IP fallback
  if (!city) {
    try {
      const clientIp = headers['x-forwarded-for']?.split(',')[0]?.trim() || ''
      const ipParam = clientIp && clientIp !== '127.0.0.1' && clientIp !== '::1' ? clientIp : ''
      const res = await $fetch<any>(`https://ipapi.co/${ipParam ? `${ipParam}/` : ''}json/`, {
        timeout: 2500
      }).catch(() => null)

      if (res && res.city) {
        city = res.city
        return {
          success: true,
          city,
          region: res.region || null,
          latitude: res.latitude || null,
          longitude: res.longitude || null,
          source: 'ipapi'
        }
      }
    } catch {
      // Hata durumunda sessizce null döner
    }
  }

  return {
    success: true,
    city: city || null,
    region: vercelRegion || null,
    latitude: vercelLat ? parseFloat(vercelLat) : null,
    longitude: vercelLon ? parseFloat(vercelLon) : null,
    country: vercelCountry || 'TR',
    source: vercelCity ? 'vercel-headers' : 'fallback'
  }
})
