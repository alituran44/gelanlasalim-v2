import fs from 'node:fs'
import path from 'node:path'

function resolveJunctions(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir)
  for (const name of entries) {
    const full = path.join(dir, name)
    const lstat = fs.lstatSync(full)
    if (lstat.isSymbolicLink()) {
      const target = fs.realpathSync(full)
      fs.unlinkSync(full)
      fs.cpSync(target, full, { recursive: true })
      console.log(`[resolve-vercel-output] Converted symlink to directory: ${name}`)
    } else if (lstat.isDirectory()) {
      resolveJunctions(full)
    }
  }
}

const functionsDir = path.join('.vercel', 'output', 'functions')
if (fs.existsSync(functionsDir)) {
  console.log('[resolve-vercel-output] Checking functions directory for Windows symlinks...')
  resolveJunctions(functionsDir)
  console.log('[resolve-vercel-output] Done.')
}
