import fs from 'node:fs'
import path from 'node:path'

import { execSync } from 'node:child_process'

console.log('[clean-output] Cleaning .vercel/output and .output...')
if (process.platform === 'win32') {
  try {
    execSync('cmd /c "if exist .vercel\\output rmdir /s /q .vercel\\output"', { stdio: 'ignore' })
  } catch {}
  try {
    execSync('cmd /c "if exist .output rmdir /s /q .output"', { stdio: 'ignore' })
  } catch {}
} else {
  try {
    fs.rmSync(path.join('.vercel', 'output'), { recursive: true, force: true })
  } catch {}
  try {
    fs.rmSync('.output', { recursive: true, force: true })
  } catch {}
}
console.log('[clean-output] Done.')

try {
  await import('./build-sitemap.js')
} catch (e) {
  console.warn('[clean-output] Could not run build-sitemap:', e)
}
