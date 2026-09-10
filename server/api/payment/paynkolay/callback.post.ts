import { defineEventHandler, readBody, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))

  // Paynkolay Return / 3D Secure Callback
  const mdStatus = body?.mdStatus || body?.Response || 'Approved'
  
  if (mdStatus === '1' || mdStatus === 'Approved') {
    return sendRedirect(event, '/panel?payment=success&provider=paynkolay', 302)
  }

  return sendRedirect(event, '/abonelik?payment=fail&provider=paynkolay&reason=' + encodeURIComponent(body?.ErrMsg || 'Islem onaylanamadi'), 302)
})
