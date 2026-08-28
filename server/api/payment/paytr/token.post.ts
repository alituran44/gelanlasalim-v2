import { defineEventHandler, readBody } from 'h3'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const merchantId = process.env.PAYTR_MERCHANT_ID || '123456'
  const merchantKey = process.env.PAYTR_MERCHANT_KEY || 'paytr_demo_merchant_key'
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'paytr_demo_merchant_salt'

  const userIp = (event.node.req.headers['x-forwarded-for'] as string) || event.node.req.socket.remoteAddress || '127.0.0.1'
  const merchantOid = 'IB-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
  const email = body.email || 'ihalecib@gmail.com'
  const paymentAmount = Math.round((Number(body.amount) || 900) * 100)
  const userName = body.name || 'Yetkili Kullanici'
  const userAddress = body.address || 'Ismetpasa Mah. Tasoz Apt. No:52/1 Canakkale'
  const userPhone = body.phone || '08503080000'
  const merchantOkUrl = body.okUrl || 'https://ihaleciburada.com/panel?payment=success'
  const merchantFailUrl = body.failUrl || 'https://ihaleciburada.com/abonelik?payment=fail'

  const userBasket = JSON.stringify([
    [body.packageName || 'Kurumsal Abonelik Paketi', (body.amount || 900).toString(), 1]
  ])

  const noInstallment = '0'
  const maxInstallment = '12'
  const currency = 'TL'
  const testMode = process.env.NODE_ENV === 'production' ? '0' : '1'

  // PayTR Hash Calculation
  const hashString = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`
  const paytrToken = crypto
    .createHmac('sha256', merchantKey)
    .update(hashString + merchantSalt)
    .digest('base64')

  return {
    status: 'success',
    token: paytrToken,
    merchantOid,
    iframeUrl: `https://www.paytr.com/odeme/guvenli/${paytrToken}`
  }
})
