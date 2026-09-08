import fs from 'node:fs'
import path from 'node:path'

console.log('[clean-output] Cleaning .vercel/output and .output...')
fs.rmSync(path.join('.vercel', 'output'), { recursive: true, force: true })
fs.rmSync('.output', { recursive: true, force: true })
console.log('[clean-output] Done.')

