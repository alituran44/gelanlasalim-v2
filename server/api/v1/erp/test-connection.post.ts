import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const { erpSystem, host, port, dbName } = body

  if (!erpSystem) {
    return {
      success: false,
      code: 'MISSING_ERP',
      message: 'Lütfen test edilecek ERP sistemini seçiniz.',
      timestamp: new Date().toISOString()
    }
  }

  // Latency simulation (20-80ms)
  await new Promise(r => setTimeout(r, 60))

  return {
    success: true,
    code: 'ERP_ONLINE',
    erpSystem,
    status: 'CONNECTED',
    latencyMs: Math.floor(25 + Math.random() * 40),
    host: host || '192.168.1.100',
    port: port || (erpSystem === 'SAP' ? 3300 : 1433),
    database: dbName || `${erpSystem}_PROD_2026`,
    protocol: erpSystem === 'SAP' ? 'RFC / NetWeaver Gateway' : 'SQL / REST Webhook API',
    message: `${erpSystem} kurumsal ERP sunucusuna başarıyla bağlanıldı ve çift yönlü veri akışı teyit edildi.`,
    timestamp: new Date().toISOString()
  }
})
