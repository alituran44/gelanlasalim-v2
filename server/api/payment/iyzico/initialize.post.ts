import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const conversationId = 'IB-IYZ-' + Date.now()
  const price = (Number(body.amount) || 900).toFixed(2)

  return {
    status: 'success',
    conversationId,
    token: 'iyzico_checkout_token_' + Date.now(),
    checkoutFormContent: '<div id="iyzipay-checkout-form" class="responsive"></div>',
    paymentPageUrl: 'https://sandbox-api.iyzipay.com/payment/mock'
  }
})