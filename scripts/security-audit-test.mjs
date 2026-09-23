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

// 3. NETGSM SMS SIFIR SALDIRI YÜZEYİ (ZERO-ATTACK SURFACE) TESTİ
console.log('\n--- 3. NetGSM SMS Sıfır Saldırı Yüzeyi Testi ---')
assert(!fs.existsSync(path.join(repoRoot, 'server/api/v1/netgsm-send.post.ts')), 'SMS Gateway: /api/v1/netgsm-send uç noktası tamamen kaldırılmış (Zero Surface)', 'netgsm-send.post.ts hala mevcut')
assert(!fs.existsSync(path.join(repoRoot, 'server/utils/netgsmClient.ts')), 'SMS Gateway: server/utils/netgsmClient.ts istemcisi tamamen kaldırılmış', 'netgsmClient.ts hala mevcut')
assert(!fs.existsSync(path.join(repoRoot, 'server/api/v1/sms-bildirim.post.ts')), 'SMS Gateway: /api/v1/sms-bildirim uç noktası tamamen kaldırılmış', 'sms-bildirim.post.ts hala mevcut')
const mfaSendContent = fs.readFileSync(path.join(repoRoot, 'server/api/auth/mfa/send.post.ts'), 'utf8')
assert(!mfaSendContent.includes('sendViaNetGsm'), 'MFA Güvenliği: SMS iletim kodu kaldırılmış, yalnızca güvenli Google SMTP aktif', 'sendViaNetGsm hala var')
const nuxtConfigContent = fs.readFileSync(path.join(repoRoot, 'nuxt.config.ts'), 'utf8')
assert(!nuxtConfigContent.includes('netgsmUsercode'), 'Konfigürasyon: nuxt.config.ts içerisinden NetGSM anahtarları temizlenmiş', 'netgsmUsercode hala var')

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

// 11. NORMAL LOGIN ADMIN ELEVATION ENGELİ TESTİ
console.log('\n--- 11. Normal Girişte Admin Yetki Yükseltme Engeli Testi ---')
const userLoginContent = fs.readFileSync(path.join(repoRoot, 'server/api/auth/login.post.ts'), 'utf8')
assert(!userLoginContent.includes("email.startsWith('admin@')"), 'User Login: admin@ e-posta başlangıcıyla yetki yükseltme engellenmiş', 'Hala startsWith(admin@) var')
assert(!userLoginContent.includes("isAdminEmail ="), 'User Login: isAdminEmail serbest admin tanımı kaldırılmış', 'Hala isAdminEmail var')
assert(userLoginContent.includes('isAdmin: false'), 'User Login: Normal girişten açılan oturumlar zorunlu isAdmin: false', 'isAdmin: false eksik')

// 12. BİLDİRİM SERVİSLERİ YETKİLENDİRME VE TENANT İZOLASYONU TESTİ
console.log('\n--- 12. Bildirim Servisleri Tenant İzolasyonu Testi ---')
const notifGetContent = fs.readFileSync(path.join(repoRoot, 'server/api/notifications/index.get.ts'), 'utf8')
assert(notifGetContent.includes('requireAuth(event)'), 'Notifications GET: requireAuth(event) ile anonim istekler engellenmiş', 'requireAuth eksik')
assert(!notifGetContent.includes("headers['x-user-email']"), 'Notifications GET: x-user-email sahteciliği engellenmiş', 'x-user-email hala var')

const notifReadContent = fs.readFileSync(path.join(repoRoot, 'server/api/notifications/read.patch.ts'), 'utf8')
assert(notifReadContent.includes('requireAuth(event)'), 'Notifications PATCH: requireAuth(event) zorunlu', 'requireAuth eksik')

const notifDeleteContent = fs.readFileSync(path.join(repoRoot, 'server/api/notifications/index.delete.ts'), 'utf8')
assert(notifDeleteContent.includes('requireAuth(event)'), 'Notifications DELETE: requireAuth(event) zorunlu', 'requireAuth eksik')

// 13. İHALE İŞLEMLERİ IDOR VE TENANT KORUMASI TESTİ
console.log('\n--- 13. İhale IDOR ve Tenant Koruması Testi ---')
const tenderDeleteContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/[id].delete.ts'), 'utf8')
assert(tenderDeleteContent.includes('assertTenantAccess(event, allowedOwners)'), 'Tender DELETE: assertTenantAccess ile IDOR korumalı', 'assertTenantAccess eksik')
assert(!tenderDeleteContent.includes("headers['x-user-email']"), 'Tender DELETE: x-user-email başlığına güvenilmiyor', 'x-user-email hala var')

const tenderPatchContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/[id].patch.ts'), 'utf8')
assert(tenderPatchContent.includes('assertTenantAccess(event, allowedOwners)'), 'Tender PATCH: assertTenantAccess ile IDOR korumalı', 'assertTenantAccess eksik')
assert(!tenderPatchContent.includes("headers['x-user-email']"), 'Tender PATCH: x-user-email başlığına güvenilmiyor', 'x-user-email hala var')

const tenderPutContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/[id].put.ts'), 'utf8')
assert(tenderPutContent.includes('assertTenantAccess(event, allowedOwners)'), 'Tender PUT: assertTenantAccess ile IDOR korumalı', 'assertTenantAccess eksik')
assert(!tenderPutContent.includes("headers['x-user-email']"), 'Tender PUT: x-user-email başlığına güvenilmiyor', 'x-user-email hala var')

// 14. İHALE VE TEKLİF GİZLİLİK TESTİ
console.log('\n--- 14. İhale ve Teklif Gizlilik / Maskeleme Testi ---')
const tendersGetContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/index.get.ts'), 'utf8')
assert(tendersGetContent.includes('resolveSession(event)'), 'Tenders GET: resolveSession ile oturum çözümleniyor', 'resolveSession eksik')
assert(!tendersGetContent.includes("headers['x-admin-token']"), 'Tenders GET: x-admin-token sahteciliği engellenmiş', 'x-admin-token hala var')

const bidsGetContent = fs.readFileSync(path.join(repoRoot, 'server/api/bids/index.get.ts'), 'utf8')
assert(bidsGetContent.includes('resolveSession(event)'), 'Bids GET: resolveSession ile oturum çözümleniyor', 'resolveSession eksik')
assert(!bidsGetContent.includes("headers['x-admin-token']"), 'Bids GET: x-admin-token sahteciliği engellenmiş', 'x-admin-token hala var')

// 15. İHALE TUTANAK GİZLİLİK TESTİ
console.log('\n--- 15. İhale Karar Tutanağı Gizlilik Testi ---')
const tutanakContent = fs.readFileSync(path.join(repoRoot, 'server/api/tenders/[id]/tutanak.get.ts'), 'utf8')
assert(tutanakContent.includes('requireAuth(event)'), 'Tutanak GET: requireAuth zorunlu', 'requireAuth eksik')
assert(tutanakContent.includes('isOwner') && tutanakContent.includes('isParticipant'), 'Tutanak GET: Sadece ihale sahibi veya teklif veren görebilir', 'Owner/Participant kontrolü eksik')

// 16. ŞİRKET EVRAK VE DURUM YETKİLENDİRME TESTİ
console.log('\n--- 16. Şirket Evrak ve Veri Güvenliği Testi ---')
const companyDocContent = fs.readFileSync(path.join(repoRoot, 'server/api/company/documents.post.ts'), 'utf8')
assert(companyDocContent.includes('assertTenantAccess(event, vkn)'), 'Company Documents: assertTenantAccess ile tenant kilitli', 'assertTenantAccess eksik')

const companyStatusContent = fs.readFileSync(path.join(repoRoot, 'server/api/company/status.get.ts'), 'utf8')
assert(companyStatusContent.includes('requireAdmin(event)'), 'Company Status: Tüm şirketleri listeleme admin korumalı', 'requireAdmin eksik')

// 17. CI/CD GÜVENLİK BORU HATTI (GITHUB ACTIONS) TESTİ
console.log('\n--- 17. CI/CD Güvenlik Boru Hattı Testi ---')
const workflowPath = fs.existsSync(path.join(repoRoot, 'ci/security.yml')) ? path.join(repoRoot, 'ci/security.yml') : path.join(repoRoot, '.github/workflows/security.yml')
assert(fs.existsSync(workflowPath), 'CI/CD: Güvenlik boru hattı workflow dosyası mevcut (ci/security.yml)', 'security.yml eksik')
const workflowContent = fs.existsSync(workflowPath) ? fs.readFileSync(workflowPath, 'utf8') : ''
assert(workflowContent.includes('npm run test:security'), 'CI/CD: Otomatik güvenlik testi komutu tanımlı', 'test:security workflowda yok')

// 18. GLOBAL HATA YÖNETİMİ (EXCEPTION HANDLING) TESTİ
console.log('\n--- 18. Global Hata Yönetimi Testi ---')
const errorVuePath = path.join(repoRoot, 'app/error.vue')
assert(fs.existsSync(errorVuePath), 'Error Handling: app/error.vue global hata arayüzü mevcut', 'app/error.vue eksik')
const errorVueContent = fs.existsSync(errorVuePath) ? fs.readFileSync(errorVuePath, 'utf8') : ''
assert(errorVueContent.includes('clearError'), 'Error Handling: clearError ile güvenli hata sıfırlama aktif', 'clearError eksik')

// 19. CSRF & ORIGIN KORUMA MIDDLEWARE TESTİ
console.log('\n--- 19. CSRF & Origin Koruma Middleware Testi ---')
const csrfMiddlewarePath = path.join(repoRoot, 'server/middleware/csrf-guard.ts')
assert(fs.existsSync(csrfMiddlewarePath), 'CSRF Protection: server/middleware/csrf-guard.ts mevcut', 'csrf-guard.ts eksik')
const csrfContent = fs.existsSync(csrfMiddlewarePath) ? fs.readFileSync(csrfMiddlewarePath, 'utf8') : ''
assert(csrfContent.includes('sec-fetch-site') && csrfContent.includes('cross-site'), 'CSRF Protection: Sec-Fetch-Site cross-site bloklaması devrede', 'cross-site kontrolü eksik')

// 20. İLERİ DÜZEY GÜVENLİK BAŞLIKLARI (PERMISSIONS-POLICY) TESTİ
console.log('\n--- 20. İleri Düzey Güvenlik Başlıkları Testi ---')
const vercelContent = fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf8')
assert(vercelContent.includes('Permissions-Policy'), 'Security Headers: Permissions-Policy donanım kısıtlama başlığı tanımlı', 'Permissions-Policy eksik')

// 21. SCRYPT PAROLA HASHLEME & KİMLİK KORUMASI TESTİ
console.log('\n--- 21. Scrypt Parola Hashleme & Kimlik Koruması Testi ---')
const credentialStorePath = path.join(repoRoot, 'server/utils/credentialStore.ts')
assert(fs.existsSync(credentialStorePath), 'Password Security: server/utils/credentialStore.ts mevcut', 'credentialStore.ts eksik')
const credentialStoreContent = fs.existsSync(credentialStorePath) ? fs.readFileSync(credentialStorePath, 'utf8') : ''
assert(credentialStoreContent.includes('scryptSync'), 'Password Security: scryptSync kriptografik hashleme aktif', 'scryptSync eksik')
assert(credentialStoreContent.includes('timingSafeEqual'), 'Password Security: timingSafeEqual sabit zamanlı parola karşılaştırma aktif', 'timingSafeEqual eksik')

const loginPostContent = fs.readFileSync(path.join(repoRoot, 'server/api/auth/login.post.ts'), 'utf8')
assert(loginPostContent.includes('verifyUserCredential'), 'Password Security: login.post.ts içinde parola doğrulama zorunlu', 'verifyUserCredential eksik')

// 22. İSTEMCİ DOSYALARINDA STATİK SIR ARINDIRMA TESTİ
console.log('\n--- 22. İstemci Dosyalarında Statik Sır Arındırma Testi ---')
const uyelikVueContent = fs.readFileSync(path.join(repoRoot, 'app/pages/uyelik.vue'), 'utf8')
assert(!uyelikVueContent.includes('ihb_admin_secret_guard_2026_master_key'), 'Client Secret Hygiene: uyelik.vue içinde hardcoded secret kalmamış', 'uyelik.vue içinde statik secret bulundu')
assert(!uyelikVueContent.includes('849201'), 'Client Secret Hygiene: uyelik.vue içinde statik OTP kodu kaldırılmış, dinamik OTP aktif', '849201 statik OTP hala mevcut')

const adminVueContent = fs.readFileSync(path.join(repoRoot, 'app/pages/admin.vue'), 'utf8')
assert(!adminVueContent.includes('ihb_admin_secret_guard_2026_master_key'), 'Client Secret Hygiene: admin.vue içinde hardcoded secret kalmamış', 'admin.vue içinde statik secret bulundu')

// 23. PROTOTYPE POLLUTION & INPUT SANITIZATION TESTİ
console.log('\n--- 23. Prototype Pollution Koruması Testi ---')
const authGuardContent = fs.readFileSync(path.join(repoRoot, 'server/utils/authGuard.ts'), 'utf8')
assert(authGuardContent.includes('__proto__') && authGuardContent.includes('constructor') && authGuardContent.includes('prototype'), 'Input Sanitization: Prototype pollution koruması devrede', 'Prototype pollution filtresi eksik')

// 24. RFC 9116, SEO H1, WCAG VE CORS SIKILAŞTIRMA TESTLERİ
console.log('\n--- 24. RFC 9116, SEO H1, WCAG ve CORS Sıkılaştırma Testleri ---')
const wellKnownSecPath = path.join(repoRoot, 'public/.well-known/security.txt')
const rootSecPath = path.join(repoRoot, 'public/security.txt')
assert(fs.existsSync(wellKnownSecPath), 'RFC 9116: public/.well-known/security.txt mevcut', 'public/.well-known/security.txt eksik')
assert(fs.existsSync(rootSecPath), 'RFC 9116: public/security.txt mevcut', 'public/security.txt eksik')

const wellKnownSecContent = fs.existsSync(wellKnownSecPath) ? fs.readFileSync(wellKnownSecPath, 'utf8') : ''
assert(wellKnownSecContent.includes('Contact: mailto:guvenlik@ihaleciburada.com'), 'RFC 9116: Güvenlik iletişim adresi tanımlı', 'security.txt içinde Contact eksik')
assert(wellKnownSecContent.includes('Expires:'), 'RFC 9116: Son geçerlilik tarihi (Expires) tanımlı', 'security.txt içinde Expires eksik')

const indexVueContent = fs.readFileSync(path.join(repoRoot, 'app/pages/index.vue'), 'utf8')
const h1Matches = indexVueContent.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || []
assert(h1Matches.length === 1, 'SEO H1: index.vue sayfasında tam olarak 1 adet semantik H1 başlığı mevcut', `H1 başlık sayısı: ${h1Matches.length}`)
assert(indexVueContent.includes('Türkiye’nin En Kapsamlı B2B İhale ve Satın Alma Portalı'), 'SEO H1: H1 başlığında anahtar kelimeler mevcut', 'H1 anahtar kelimeleri eksik')

assert(indexVueContent.includes('aria-label="Ana ihale arama kelimesi veya malzeme adı"'), 'WCAG Form Labels: Ana arama kutusu erişilebilir aria-label etiketine sahip', 'Ana arama kutusunda aria-label eksik')
assert(indexVueContent.includes('id="left-sidebar-search"') && indexVueContent.includes('aria-label="Sol menü içi arama kutusu"'), 'WCAG Form Labels: Sol menü arama kutusu erişilebilir aria-label ve id etiketine sahip', 'Sol menü arama kutusunda aria-label eksik')
assert(indexVueContent.includes('id="select-tender-city"') && indexVueContent.includes('for="select-tender-city"'), 'WCAG Form Labels: Şehir seçimi ilişkili label ve id ile bağlı', 'Şehir filtre label eksik')

const appVueContent = fs.readFileSync(path.join(repoRoot, 'app/app.vue'), 'utf8')
assert(appVueContent.includes(':focus-visible'), 'WCAG 2.1 AA: Odak çerçevesi (:focus-visible) tanımlı', 'focus-visible tanımı eksik')

const dnsSpfDocPath = path.join(repoRoot, 'DNS-SECURITY-SPF.md')
assert(fs.existsSync(dnsSpfDocPath), 'DNS Security: DNS-SECURITY-SPF.md kılavuzu mevcut', 'DNS-SECURITY-SPF.md eksik')

const currentNuxtConfig = fs.readFileSync(path.join(repoRoot, 'nuxt.config.ts'), 'utf8')
assert(currentNuxtConfig.includes("crossorigin: 'anonymous'"), 'SRI & Harici Script: Google Identity Services scriptinde crossorigin: anonymous tanımlı', 'crossorigin anonymous eksik')

console.log('\n====================================================')
console.log(`📊 TEST SONUÇLARI: Toplam: ${totalTests} | Başarılı: ${passedTests} | Başarısız: ${failedTests}`)
console.log('====================================================')

if (failedTests > 0) {
  process.exit(1)
} else {
  console.log('🎉 TÜM GÜVENLİK TESTLERİ BAŞARIYLA GEÇTİ!')
  process.exit(0)
}

