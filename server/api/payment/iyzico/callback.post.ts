import { defineEventHandler, readBody, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token

  if (!token) {
    return sendRedirect(event, '/abonelik?payment=error', 302)
  }

  return sendRedirect(event, '/panel?payment=success&provider=iyzico', 302)
})