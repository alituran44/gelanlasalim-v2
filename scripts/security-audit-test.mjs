import fs from 'node:fs'
import path from 'node:path'

console.log('====================================================')
console.log('🛡️  İHALECİBURADA (gelanlasalim-v2) GÜVENLİK TEST SUITE')
console.log('====================================================\n')

const repoRoot = process.cwd()
let totalTests = 0
let passedTests = 0
let failedTests = 0

function assert(condition, testName, details) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`✅ [PASS] ${testName}`)
  } else {
    failedTests++
    console.error(`❌ [FAIL] ${testName} - Detay: ${details}`)
  }
}

// 1. STATİK SIR TARAMASI (Zero-Secrets Leakage)
console.log('--- 1. Statik Sır ve Parola Sızıntısı Testi ---')
const bannedPatterns = [
  { pattern: '191214.Et', label: 'Gmail SMTP eski şifresi' },
  { pattern: '0ZE3LG59', label: 'NetGSM API eski şifresi' },
  { pattern: 'exvyodxrjlnatvqh', label: 'Gmail uygulama şifresi' },
  { pattern: 'admin123', label: 'Zayıf admin şifresi' },
  { pattern: 'demo-password', label: 'Demo admin şifresi' },
  { pattern: 'ihalciburada.com', label: 'Hatalı SMS alan adı yazımı' }
]

function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.output' || file === '.vercel' || file === '.nuxt') continue
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      scanDirectory(fullPath, fileList)
    } else if (/\.(ts|vue|js|mjs|json)$/.test(file)) {
      fileList.push(fullPath)
    }
  }
  return fileList
}

const allCodeFiles = scanDirectory(repoRoot)

for (const { pattern, label } of bannedPatterns) {
  let foundIn = []
  for (const f of allCodeFiles) {
    if (f.includes('security-audit-test.mjs')) continue
    const content = fs.readFileSync(f, 'utf8')
    if (content.includes(pattern)) {
      foundIn.push(path.relative(repoRoot, f))
    }
  }
  assert(foundIn.length === 0, `Sır Sızıntısı Yok: ${label}`, `Bulunduğu dosyalar: ${foundIn.join(', ')}`)
}

// 2. ADMIN LOGIN BYPASS TESTİ
console.log('\n--- 2. Admin Girişi Bypass Denetimi ---')
const adminLoginContent = fs.readFileSync(path.join(repoRoot, 'server/api/auth/admin-login.post.ts'), 'utf8')
assert(!adminLoginContent.includes('isPrivilegedAdminEmail'), 'Admin Login: isPrivilegedAdminEmail bypass kaldırılmış', 'Hala isPrivilegedAdminEmail bulunuyor')
assert(!adminLoginContent.includes('secretKey.length >= 3'), 'Admin Login: secretKey.length >= 3 bypass kaldırılmış', 'Hala 3 karakter bypass bulunuyor')
assert(!adminLoginContent.includes('allowedKeys'), 'Admin Login: allowedKeys zayıf şifre listesi kaldırılmış', 'Hala allowedKeys dizisi var')
assert(adminLoginContent.includes('timingSafeEqual'), 'Admin Login: timingSafeEqual sabit zamanlı doğrulama aktif', 'timingSafeEqual eksik')

// 3. NETGSM SMS GATEWAY KORUMASI TESTİ
console.log('\n--- 3. NetGSM SMS Gateway Koruma Testi ---')
const netgsmSendContent = fs.readFileSync(path.join(repoRoot, 'server/api/v1/netgsm-send.post.ts'), 'utf8')
assert(netgsmSendContent.includes('requireAuth(event)'), 'NetGSM Gateway: requireAuth(event) ile anonim istekler engellenmiş', 'requireAuth eksik')
assert(netgsmSendContent.includes('smsRateLimitMap'), 'NetGSM Gateway: Oran sınırlama (Rate Limiting) aktif', 'smsRateLimitMap eksik')
assert(!netgsmSendContent.includes('body.password'), 'NetGSM Gateway: İstemciden şifre kabul edilmiyor', 'body.password hala var')
assert(!netgsmSendContent.includes('body.usercode'), 'NetGSM Gateway: İstemciden usercode kabul edilmiyor', 'body.usercode hala var')

const netgsmClientContent = fs.readFileSync(path.join(repoRoot, 'server/utils/netgsmClient.ts'), 'utf8')
assert(!netgsmClientContent.includes('options.password'), 'NetGSM Client: options.password parametresi kaldırılmış', 'options.password hala var')

// 4. İHALE SENKRONİZASYONU YETKİSİZ YAZMA TESTİ
console.log('\n--- 4. İhale Senkronizasyonu Koruma Testi ---')
const tenderSyncContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/sync.post.ts'), 'utf8')
assert(tenderSyncContent.includes('resolveSession(event)'), 'Tender Sync: Oturum çözümleme aktif', 'resolveSession eksik')
assert(tenderSyncContent.includes('x-sync-secret'), 'Tender Sync: x-sync-secret yetkilendirmesi var', 'x-sync-secret eksik')
assert(tenderSyncContent.includes('timingSafeEqual'), 'Tender Sync: timingSafeEqual ile secret kontrolü yapılıyor', 'timingSafeEqual eksik')
assert(tenderSyncContent.includes('createError({'), 'Tender Sync: Yetkisiz istekler 401 ile reddediliyor', 'createError eksik')

// 5. ERP WEBHOOK SSRF KORUMASI TESTİ
console.log('\n--- 5. ERP Webhook SSRF Koruma Testi ---')
const webhookContent = fs.readFileSync(path.join(repoRoot, 'server/api/v1/erp/webhook-dispatch.post.ts'), 'utf8')
assert(webhookContent.includes('validateWebhookUrl'), 'ERP Webhook: validateWebhookUrl motoru tanımlı', 'validateWebhookUrl eksik')
assert(webhookContent.includes('169.254.'), 'ERP Webhook: 169.254.x.x cloud metadata engeli var', 'Metadata engeli eksik')
assert(webhookContent.includes('127.0.0.1'), 'ERP Webhook: 127.0.0.1 loopback engeli var', 'Loopback engeli eksik')
assert(webhookContent.includes('10.x.x.x') || webhookContent.includes('10\\.'), 'ERP Webhook: 10.x.x.x özel ağ engeli var', '10.x engeli eksik')
assert(webhookContent.includes('192.168.'), 'ERP Webhook: 192.168.x.x özel ağ engeli var', '192.168 engeli eksik')

// 6. DOĞRULAMA SERVİSLERİ YETKİLENDİRME TESTİ
console.log('\n--- 6. KEP / Vergi / GİB Doğrulama Servisleri Koruma Testi ---')
const kepContent = fs.readFileSync(path.join(repoRoot, 'server/api/v1/kep-dogrulama.post.ts'), 'utf8')
assert(kepContent.includes('requireAuth(event)'), 'KEP Doğrulama: requireAuth koruması devrede', 'requireAuth eksik')
assert(kepContent.includes('kepRateLimitMap'), 'KEP Doğrulama: Rate limiting devrede', 'Rate limiting eksik')

const vergiContent = fs.readFileSync(path.join(repoRoot, 'server/api/v1/vergi-dogrulama.post.ts'), 'utf8')
assert(vergiContent.includes('requireAuth(event)'), 'Vergi Doğrulama: requireAuth koruması devrede', 'requireAuth eksik')
assert(vergiContent.includes('vergiRateLimitMap'), 'Vergi Doğrulama: Rate limiting devrede', 'Rate limiting eksik')

const gibContent = fs.readFileSync(path.join(repoRoot, 'server/api/v1/gib-sorgula.post.ts'), 'utf8')
assert(gibContent.includes('requireAuth(event)'), 'GİB Sorgula: requireAuth koruması devrede', 'requireAuth eksik')
assert(gibContent.includes('gibRateLimitMap'), 'GİB Sorgula: Rate limiting devrede', 'Rate limiting eksik')

// 7. HUKUKİ SÖZLEŞME KABULÜ TESTİ
console.log('\n--- 7. Sözleşme Kabulü ve Tenant İzolasyonu Testi ---')
const legalPostContent = fs.readFileSync(path.join(repoRoot, 'server/api/legal/acceptances.post.ts'), 'utf8')
assert(legalPostContent.includes('requireAuth(event)'), 'Legal Post: requireAuth devrede', 'requireAuth eksik')
assert(legalPostContent.includes('session.userEmail'), 'Legal Post: Kabul oturum sahibi e-postasına bağlanıyor', 'session.userEmail eksik')

const legalGetContent = fs.readFileSync(path.join(repoRoot, 'server/api/legal/acceptances.get.ts'), 'utf8')
assert(legalGetContent.includes('requireAuth(event)'), 'Legal Get: requireAuth devrede', 'requireAuth eksik')
assert(legalGetContent.includes('session.isAdmin'), 'Legal Get: Tenant izolasyonu var (yalnızca kendi kabulünü görür)', 'Tenant kontrolü eksik')

// 8. PAYNKOLAY CALLBACK HASH TESTİ
console.log('\n--- 8. Paynkolay Callback Hash Testi ---')
const callbackContent = fs.readFileSync(path.join(repoRoot, 'server/api/payment/paynkolay/callback.post.ts'), 'utf8')
assert(callbackContent.includes('HASHPARAMS'), 'Paynkolay: HASHPARAMS imza parametreleri kontrol ediliyor', 'HASHPARAMS eksik')
assert(callbackContent.includes('timingSafeEqual'), 'Paynkolay: timingSafeEqual SHA-512 imza doğrulaması var', 'timingSafeEqual eksik')
assert(!callbackContent.includes('body?.mdStatus || body?.Response || \'Approved\''), 'Paynkolay: Fail-open \'Approved\' varsayılanı kaldırılmış', 'Approved varsayılanı hala var')

// 9. DEV MFA INSPECT İZOLASYON TESTİ
console.log('\n--- 9. Geliştirici MFA Inspect İzolasyon Testi ---')
const mfaInspectContent = fs.readFileSync(path.join(repoRoot, 'server/api/dev/mfa-inspect.get.ts'), 'utf8')
assert(mfaInspectContent.includes('ENABLE_DEV_MFA === \'true\''), 'MFA Inspect: Açıkça ENABLE_DEV_MFA=true bayrağı şart koşulmuş', 'ENABLE_DEV_MFA kontrolü eksik')
assert(mfaInspectContent.includes('!process.env.VERCEL'), 'MFA Inspect: Vercel üzerinde 404 kilitli', 'VERCEL kontrolü eksik')

// 10. GÜVENLİK BAŞLIKLARI VE CSP TESTİ
console.log('\n--- 10. Vercel Güvenlik Başlıkları Testi ---')
const vercelJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf8'))
const headers = vercelJson.headers || []
const rootHeader = headers.find(h => h.source === '/(.*)')?.headers || []
const cspHeader = rootHeader.find(h => h.key === 'Content-Security-Policy')?.value || ''
const xssHeader = rootHeader.find(h => h.key === 'X-XSS-Protection')
const apiCorsHeader = headers.find(h => h.source === '/api/(.*)')?.headers?.find(h => h.key === 'Access-Control-Allow-Origin')?.value || ''

assert(!cspHeader.includes('unsafe-eval'), 'CSP: unsafe-eval kaldırılmış', 'unsafe-eval hala var')
assert(!xssHeader, 'Headers: Eski X-XSS-Protection kaldırılmış', 'X-XSS-Protection hala var')
assert(apiCorsHeader.includes('ihaleciburada.com') && !apiCorsHeader.includes('*'), 'CORS: * yerine spesifik domain sınırlandırılmış', 'CORS hala wildcard')

console.log('\n====================================================')
console.log(`📊 TEST SONUÇLARI: Toplam: ${totalTests} | Başarılı: ${passedTests} | Başarısız: ${failedTests}`)
console.log('====================================================')

if (failedTests > 0) {
  process.exit(1)
} else {
  console.log('🎉 TÜM GÜVENLİK TESTLERİ BAŞARIYLA GEÇTİ!')
  process.exit(0)
}
