import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const res = event.node.res
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
})
