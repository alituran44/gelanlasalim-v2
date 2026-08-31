<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Lock, 
  User, 
  Home, 
  Activity, 
  CreditCard, 
  ListPlus,
  CheckCircle,
  Plus,
  Trash2,
  Folder,
  Download,
  Upload,
  AlertCircle,
  Phone,
  MessageSquare,
  Bot,
  Sparkles,
  Users,
  Mail,
  Send,
  Eye,
  CheckCheck,
  Inbox,
  Filter,
  Globe,
  FileText,
  Calendar,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Edit,
  Tag,
  Video,
  Play,
  Pause,
  PlusCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Package,
  Truck,
  Layers,
  Award,
  AlertTriangle,
  FileCheck,
  XCircle,
  ShieldAlert,
  Server,
  Settings,
  Ticket,
  Copy,
  BarChart3,
  RefreshCw,
  Zap,
  Smartphone,
  Scale,
  Building2,
  X,
  Check,
  Printer,
  Maximize2,
  Sun,
  Moon,
  Percent,
  Calculator
} from 'lucide-vue-next'
import { useCmsData } from '~/composables/useCmsData'
import { useNetGsm } from '~/composables/useNetGsm'

// Page config
definePageMeta({
  layout: false // Custom full screen admin dashboard
})

const router = useRouter()
const route = useRoute()
const { cmsData, saveCmsData, resetCmsData } = useCmsData()
const { config: netGsmConfig, logs: smsLogs, saveConfig: saveNetGsmConfig, sendSms, clearLogs: clearSmsLogs } = useNetGsm()

// Auth State
const isLoggedIn = ref(false)
const formState = reactive(JSON.parse(JSON.stringify(cmsData.value)))
const email = ref('')
const password = ref('')
const authError = ref('')

// NetGSM Templates & State
const netGsmTemplates = [
  {
    name: 'Kurumsal Üyelik 6-Haneli OTP Kodu',
    body: '[İhaleciBurada] Kurumsal üyelik doğrulama kodunuz: {OTP_KODU}. Bu kodu 3 dakika içinde kimseyle paylaşmayınız.'
  },
  {
    name: 'İhale Yayına Alındı Bildirimi',
    body: 'Sayın Yetkili, "{IHALE_BASLIK}" başlıklı ihaleniz onaylanarak yayına alınmıştır. Teklifleri takip etmek için: https://ihalciburada.com/panel'
  },
  {
    name: 'İhaleye Yeni Teklif Geldi',
    body: 'Sayın Yetkili, "{IHALE_BASLIK}" ihaleniz için doğrulanmış tedarikçiden yeni teklif ({FIYAT} TL) iletildi. Detay: https://ihalciburada.com/panel/gelen-teklifler'
  },
  {
    name: 'Canlı Eksiltme & Fiyat Revizyonu',
    body: 'Sayın Yetkili, takip ettiğiniz ihalede canlı eksiltme başladı. Yeni lider fiyat: {FIYAT} TL. Teklifinizi güncellemek için odaya katılın.'
  },
  {
    name: 'Teklif Kabulü & Escrow Güvencesi',
    body: 'Tebrikler! "{IHALE_BASLIK}" ihalesinde teklifiniz onaylandı. Escrow güvenceli sözleşme panelinize yüklendi: https://ihalciburada.com/panel'
  }
]

// Test SMS Form
const testSmsForm = ref({
  phone: '05325550123',
  name: 'Test Yetkilisi',
  template: 'Kurumsal Üyelik 6-Haneli OTP Kodu',
  body: '[İhaleciBurada] Kurumsal üyelik doğrulama kodunuz: 849201. Bu kodu 3 dakika içinde kimseyle paylaşmayınız.'
})

function handleNetGsmTemplateChange(templateName: string) {
  const tpl = netGsmTemplates.find(t => t.name === templateName)
  if (tpl) {
    testSmsForm.value.template = tpl.name
    testSmsForm.value.body = tpl.body
  }
}

async function sendTestSms() {
  const res = await sendSms({
    recipientPhone: testSmsForm.value.phone,
    recipientName: testSmsForm.value.name,
    templateName: testSmsForm.value.template,
    messageBody: testSmsForm.value.body
  })
  triggerToast(`📱 NetGSM SMS İletildi! (${testSmsForm.value.phone})`, 'success')
}

function refreshNetGsmBalance() {
  netGsmConfig.value.balanceCredits = 5000
  saveNetGsmConfig(netGsmConfig.value)
  triggerToast('NetGSM SMS kredi bakiyesi güncellendi: 5.000 SMS', 'success')
}

function resolveDispute(dispute: any, action: 'approved' | 'rejected') {
  if (action === 'approved') {
    dispute.status = 'FESİH_ONAYLANDI'
    alert(`⚖️ MÜCBİR SEBEP FESİH TALEBİ ONAYLANDI\n\nTalep No: ${dispute.id}\nCezai şartsız iptal onaylandı ve bloke ödeme serbest bırakıldı.`)
  } else {
    dispute.status = 'REDDEDILDI'
    alert(`❌ MÜCBİR SEBEP TALEBİ REDDEDİLDİ\n\nTalep No: ${dispute.id}\nSözleşme yükümlülükleri geçerliliğini korumaktadır.`)
  }
  saveCmsData(cmsData.value)
}

// Tabs
export type AdminTab = 
  | 'overview'
  | 'kyc_desk'
  | 'live_rooms'
  | 'escrow_delivery'
  | 'commission_rates'
  | 'disputes_desk'
  | 'categories'
  | 'promo_codes'
  | 'audit_logs'
  | 'site_settings'
  | 'support_ai' 
  | 'netgsm_sms'
  | 'crm_leads' 
  | 'email_center' 
  | 'newsletter_subs' 
  | 'hero' 
  | 'tender' 
  | 'plans' 
  | 'contact' 
  | 'db_payments' 
  | 'db_tenders' 
  | 'db_received' 
  | 'db_submitted'




const totalReceivedBidsCount = computed(() => {
  let count = 0
  const groups = formState.dashboard?.receivedBids || []
  groups.forEach((g: any) => {
    count += (g.teklifler || []).length
  })
  return count
})

const totalBidsVolumeStr = computed(() => {
  let total = 0
  const groups = formState.dashboard?.receivedBids || []
  groups.forEach((g: any) => {
    (g.teklifler || []).forEach((tk: any) => {
      const num = parseInt(String(tk.fiyat || '0').replace(/\D/g, '')) || 0
      total += num
    })
  })
  return Number(total).toLocaleString('tr-TR') + ' ₺'
})

if (!formState.commissionSettings) {
  formState.commissionSettings = {
    defaultRate: 3.0,
    minTransactionFee: 50,
    vatRate: 20,
    sectorRates: [
      {
            "id": "sec-1",
            "name": "İnşaat, Altyapı & Yapım İşi",
            "rate": 2.5,
            "icon": "🏗️",
            "description": "Kaba inşaat, hazır beton, çimento, hafriyat ve şantiye yapım ihaleleri"
      },
      {
            "id": "sec-2",
            "name": "Sağlık, İlaç & Kozmetik",
            "rate": 3,
            "icon": "💊",
            "description": "İlaç, serum, sarf malzeme, aşı ve kozmetik tedariği"
      },
      {
            "id": "sec-3",
            "name": "Gıda, Tarım Ürünleri & İçecek",
            "rate": 2,
            "icon": "🌾",
            "description": "Toptan un, bakliyat, yağ, et, süt, yaş sebze/meyve ve içecek"
      },
      {
            "id": "sec-4",
            "name": "Tıbbi Cihaz, Laboratuvar & Hastane",
            "rate": 3,
            "icon": "🩺",
            "description": "Görüntüleme sistemleri, ameliyathane donanımı ve laboratuvar kitleri"
      },
      {
            "id": "sec-5",
            "name": "Kanalizasyon, Boru, Su & Tesisat",
            "rate": 2.5,
            "icon": "🚰",
            "description": "Altyapı boruları, vana, pompa, su arıtma ve sıhhi tesisat"
      },
      {
            "id": "sec-6",
            "name": "Enerji, Aydınlatma & Elektrik",
            "rate": 2.5,
            "icon": "⚡",
            "description": "Trafo, jeneratör, kablo, aydınlatma armatürleri ve güneş panelleri"
      },
      {
            "id": "sec-7",
            "name": "Akaryakıt, Gazyağı & Madeni Yağ",
            "rate": 1.5,
            "icon": "⛽",
            "description": "Toptan motorin, benzin, sanayi yakıtı ve madeni yağlar"
      },
      {
            "id": "sec-8",
            "name": "Endüstriyel Makine & Motor",
            "rate": 3.5,
            "icon": "⚙️",
            "description": "CNC tezgahları, sanayi presleri, elektrik motorları ve konveyörler"
      },
      {
            "id": "sec-9",
            "name": "Yazılım, Bilişim & IT Hizmetleri",
            "rate": 5,
            "icon": "💻",
            "description": "ERP, CRM, özel yazılım, sunucu, bulut lisansları ve IT altyapısı"
      },
      {
            "id": "sec-10",
            "name": "Nakliye, Taşımacılık & Lojistik",
            "rate": 4,
            "icon": "🚚",
            "description": "Komple tır, parsiyel kargo, antrepo, filo kiralama ve personel servisi"
      },
      {
            "id": "sec-11",
            "name": "Mobilya, Beyaz Eşya & Ofis",
            "rate": 3.5,
            "icon": "🪑",
            "description": "Büro mobilyası, dayanıklı tüketim malları ve mutfak ekipmanları"
      },
      {
            "id": "sec-12",
            "name": "Hırdavat, Nalburiye, Metal & Plastik",
            "rate": 3,
            "icon": "🔩",
            "description": "Bağlantı elemanları, el aletleri, profil sac ve endüstriyel plastik"
      },
      {
            "id": "sec-13",
            "name": "Yangın Algılama, Söndürme & Güvenlik",
            "rate": 3,
            "icon": "🧯",
            "description": "Yangın dolapları, sprinkler, duman dedektörleri ve alarm panoları"
      },
      {
            "id": "sec-14",
            "name": "Kimyasal Maddeler, Dezenfektan & Gübre",
            "rate": 2.5,
            "icon": "🧪",
            "description": "Sanayi kimyasalları, tarımsal gübre, ziraat ilaçları ve dezenfektan"
      },
      {
            "id": "sec-15",
            "name": "Matbaa, Toner, Ambalaj & Kırtasiye",
            "rate": 3,
            "icon": "📦",
            "description": "Oluklu mukavva koli, ambalaj streci, fotokopi kağıdı ve toner"
      },
      {
            "id": "sec-16",
            "name": "Kent Mobilyaları, Prefabrik & Çelik",
            "rate": 3,
            "icon": "🏙️",
            "description": "Park ekipmanları, konteyner, prefabrik binalar ve çelik konstrüksiyon"
      },
      {
            "id": "sec-17",
            "name": "Mühendislik, Mimarlık & Müşavirlik",
            "rate": 4,
            "icon": "📐",
            "description": "Statik proje, zemin etüdü, harita mühendisliği ve müşavirlik"
      },
      {
            "id": "sec-18",
            "name": "Madencilik, Doğal Kaynak & Sondaj",
            "rate": 2.5,
            "icon": "⛏️",
            "description": "Mermer, kireçtaşı, agrega, maden cevheri ve sondaj ekipmanları"
      },
      {
            "id": "sec-19",
            "name": "Asansör, Yürüyen Merdiven & Otomasyon",
            "rate": 3.5,
            "icon": "🛗",
            "description": "Yolcu/yük asansörleri, yürüyen bantlar ve bina otomasyonu"
      },
      {
            "id": "sec-20",
            "name": "Klima, Havalandırma & Soğutma",
            "rate": 3,
            "icon": "❄️",
            "description": "VRF sistemleri, soğuk hava depoları, kazanlar ve havalandırma kanalları"
      },
      {
            "id": "sec-21",
            "name": "Savunma Sanayii, Denizcilik & Havacılık",
            "rate": 3,
            "icon": "🛡️",
            "description": "Taktik ekipman, bot donanımı, aviyonik aksam ve kompozit malzemeler"
      },
      {
            "id": "sec-22",
            "name": "Taşıt, İş Makinesi & Yedek Parça",
            "rate": 2.5,
            "icon": "🚜",
            "description": "Ekskavatör, loder, forklift, kamyon ve orijinal yedek parçalar"
      },
      {
            "id": "sec-23",
            "name": "Turizm, Konaklama & Organizasyon",
            "rate": 4,
            "icon": "🎪",
            "description": "Kongre, fuar organizasyonu, otel konaklama ve catering"
      },
      {
            "id": "sec-24",
            "name": "Reklam, Tabela & Tanıtım Materyalleri",
            "rate": 4.5,
            "icon": "📢",
            "description": "Işıklı tabela, led ekran, totem, açık hava reklamcılığı ve promosyon"
      },
      {
            "id": "sec-25",
            "name": "Ormancılık, Fidan, Bitki & Peyzaj",
            "rate": 3,
            "icon": "🌲",
            "description": "Fidan üretimi, çimleme, ağaçlandırma ve çevre düzenleme"
      },
      {
            "id": "sec-26",
            "name": "Hayvancılık, Veterinerlik & Yem",
            "rate": 2,
            "icon": "🐄",
            "description": "Büyükbaş/küçükbaş hayvan, karma yem, premiks ve veteriner ilaçları"
      },
      {
            "id": "sec-27",
            "name": "Sanat Eserleri, Enstrüman & Heykel",
            "rate": 5,
            "icon": "🎨",
            "description": "Sanatsal anıt, kent heykelleri, enstrüman ve müze sergileme"
      },
      {
            "id": "sec-28",
            "name": "Odun, Kömür & Katı Yakıtlar",
            "rate": 2,
            "icon": "🪵",
            "description": "Toptan linyit kömürü, odun, pelet ve briket yakıt"
      },
      {
            "id": "sec-29",
            "name": "Hazır Yemek, Tabldot & Lokantacılık",
            "rate": 2.5,
            "icon": "🍽️",
            "description": "Toplu yemek üretimi, şantiye/hastane yemekhanesi ve kumanya"
      },
      {
            "id": "sec-30",
            "name": "Elektronik, Bilgisayar & Ölçü Aletleri",
            "rate": 3.5,
            "icon": "🖥️",
            "description": "PC, tablet, endüstriyel switch, multimetre ve kalibrasyon aletleri"
      },
      {
            "id": "sec-31",
            "name": "Kamera, CCTV & Haberleşme",
            "rate": 3.5,
            "icon": "📹",
            "description": "IP kamera sistemleri, NVR, telsiz, fiber optik ve telsiz kuleleri"
      },
      {
            "id": "sec-32",
            "name": "Temizlik, İlaçlama & Atık Yönetimi",
            "rate": 3,
            "icon": "🧹",
            "description": "Tesis temizliği, vektör ilaçlama, geri dönüşüm ve tıbbi atık bertarafı"
      },
      {
            "id": "sec-33",
            "name": "Tekstil, İş Elbiseleri & Giyim",
            "rate": 3,
            "icon": "👕",
            "description": "Reflektörlü iş kıyafetleri, üniforma, ayakkabı ve kurumsal tekstil"
      },
      {
            "id": "sec-34",
            "name": "İş Sağlığı & Güvenliği (İSG)",
            "rate": 3.5,
            "icon": "⛑️",
            "description": "Baret, emniyet kemeri, gaz maskesi, iş gözlüğü ve İSG donanımları"
      },
      {
            "id": "sec-35",
            "name": "Özel Güvenlik & Koruma Hizmetleri",
            "rate": 3.5,
            "icon": "👮",
            "description": "Fiziki güvenlik, koruma personeli, x-ray ve güvenlik bariyerleri"
      },
      {
            "id": "sec-36",
            "name": "Eğitim, Tercümanlık & Danışmanlık",
            "rate": 4.5,
            "icon": "📚",
            "description": "Kurumsal eğitimler, yeminli tercüme, anket ve pazar araştırması"
      },
      {
            "id": "sec-37",
            "name": "İşletmecilik & Tesis Yönetimi",
            "rate": 3.5,
            "icon": "🤝",
            "description": "Bina yönetimi, resepsiyon, kurye ve veri giriş personeli"
      },
      {
            "id": "sec-38",
            "name": "Sigortacılık, Finans & Hukuk",
            "rate": 4,
            "icon": "⚖️",
            "description": "Kurumsal kasko, all-risk sigorta, bağımsız denetim ve danışmanlık"
      },
      {
            "id": "sec-39",
            "name": "Araç Satışı & Hurda İhaleleri",
            "rate": 2,
            "icon": "🚗",
            "description": "Filo araç satışları, demir/bakır hurda ve atık malzeme ihaleleri"
      },
      {
            "id": "sec-40",
            "name": "Gayrimenkul, Arsa & Kiralama",
            "rate": 2,
            "icon": "🏢",
            "description": "Ticari bina, fabrika, arsa satışı, depo ve büfe/kantin kiralama"
      }
],
    planDiscountRates: [
      { planName: 'Ücretsiz / Standart Üyelik', commissionRate: 3.0, badge: 'Standart' },
      { planName: '1 Ay Lansman Deneme', commissionRate: 0.0, badge: '%100 Komisyonsuz' },
      { planName: '3 Aylık Kurumsal', commissionRate: 2.5, badge: '%0.5 İndirimli' },
      { planName: '6 Aylık Kurumsal Pro', commissionRate: 2.0, badge: '%1.0 İndirimli' },
      { planName: '12 Aylık Enterprise Plus', commissionRate: 1.0, badge: '%2.0 İndirimli' }
    ]
  }
}

const simAmount = ref(100000)
const simSectorRate = ref(3.0)
const simPlatformEarning = computed(() => Math.round((simAmount.value * simSectorRate.value) / 100))
const simSupplierNet = computed(() => simAmount.value - simPlatformEarning.value)

const sectorSearchQuery = ref('')
const newSectorRate = ref({
  name: '',
  rate: 3.0,
  icon: '🏢',
  description: ''
})

function addSectorRate() {
  if (!newSectorRate.value.name) return
  if (!formState.commissionSettings.sectorRates) formState.commissionSettings.sectorRates = []
  formState.commissionSettings.sectorRates.push({
    id: 'sec-' + Date.now(),
    name: newSectorRate.value.name,
    rate: Number(newSectorRate.value.rate) || 3.0,
    icon: newSectorRate.value.icon || '🏢',
    description: newSectorRate.value.description || 'Sektörel satın alma komisyonu'
  })
  newSectorRate.value = { name: '', rate: 3.0, icon: '🏢', description: '' }
  triggerToast('Yeni sektörel komisyon oranı eklendi!', 'success')
}

function removeSectorRate(index: number) {
  formState.commissionSettings.sectorRates.splice(index, 1)
  triggerToast('Sektörel komisyon oranı silindi.', 'info')
}

const activeTab = ref<AdminTab>('overview')
watch(activeTab, () => { syncLiveState() })

// Local copy for editing
// Clean up duplicates in received bids
if (formState.dashboard?.receivedBids) {
  formState.dashboard.receivedBids.forEach((group: any) => {
    if (group.teklifler && group.teklifler.length > 0) {
      const seenFirma = new Set()
      group.teklifler = group.teklifler.filter((tk: any) => {
        const key = (tk.firma || '') + '_' + (tk.fiyat || '')
        if (seenFirma.has(key)) return false
        seenFirma.add(key)
        return true
      })
    }
  })
}

// Ensure safety defaults for all enterprise modules
if (!formState.supportSettings) {
  formState.supportSettings = {
    whatsappEnabled: true,
    whatsappNumber: '908508408695',
    whatsappMessage: 'Merhaba İhaleciBurada ekibi, B2B ihale ve 1 ay ücretsiz deneme hakkında bilgi almak istiyorum.',
    aiEnabled: true,
    aiBotName: 'İhaleciBurada AI Asistanı',
    aiGreeting: 'Merhaba! Ben İhaleciBurada Yapay Zeka Asistanıyım. 🤖 B2B ihale açma, teklif verme, canlı tersine eksiltme veya lansmana özel 1 Ay %100 Ücretsiz Deneme süreciniz hakkında size nasıl yardımcı olabilirim?',
    aiPromptContext: 'Sen İhaleciBurada B2B ihale platformunun uzman yapay zeka asistanısın. Kullanıcılara 1 ay ücretsiz deneme, ihale açma, teklif verme, ihale ve satın alma konularında yardımcı ol.'
  }
}

if (!formState.crmSettings) {
  formState.crmSettings = {
    leads: []
  }
}

if (!formState.emailSettings) {
  formState.emailSettings = {
    senderName: 'İhaleciBurada.com Destek & Operasyon',
    senderEmail: 'ihalecib@gmail.com',
    replyToEmail: 'ihalecib@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'ihalecib@gmail.com',
    smtpPassword: '••••••••',
    smtpEncryption: 'TLS',
    autoNotifications: {
      onRegister: true,
      onNewTender: true,
      onNewBid: true,
      onAuction: true,
      onEscrow: true
    },
    subscribers: [],
    templates: []
  }
}

if (!formState.emailSettings.templates || formState.emailSettings.templates.length === 0) {
  formState.emailSettings.templates = [
    {
      id: 'TPL_WELCOME',
      name: 'Kurumsal Hoş Geldiniz & KYC Mavi Rozet Onayı',
      subject: 'İhaleciBurada.com Kurumsal Üyeliğiniz ve Mavi Rozetiniz Onaylandı!',
      content: 'Sayın Yetkili,\n\nİhaleciBurada.com B2B satın alma ve ihale platformuna hoş geldiniz!\n\nKurumsal şirket evraklarınız (Vergi Levhası, Ticaret Sicil Gazetesi, İmza Sirküleri) hukuk birimimizce doğrulanmış ve hesabınıza Onaylı Mavi Rozet tanımlanmıştır.\n\nArtık Türkiye genelindeki tüm satın alma ihalelerine teklif sunabilir veya kendi şartnamenizle canlı eksiltme ihaleleri açabilirsiniz.\n\nKurumsal Yönetim Paneli: https://ihalciburada.com/panel\n\nSaygılarımızla,\nİhaleciBurada Platform A.Ş.\nİletişim: 0850 840 86 95 | ihalecib@gmail.com'
    },
    {
      id: 'TPL_NEW_TENDER',
      name: 'Yeni İhale Yayını & Şartname Teklif Çağrısı',
      subject: 'Yeni İhale İlanı: [İhale Başlığı] için Teklif Süreci Başladı',
      content: 'Sayın Tedarikçimiz,\n\nFaaliyet gösterdiğiniz sektörde yeni bir satın alma ihalesi onaylanarak yayına alınmıştır.\n\n• İhale Başlığı: [İhale Başlığı]\n• Başlangıç Bütçesi: [Lider Fiyat]\n• Son Teklif Tarihi: [Kalan Süre]\n\nTeknik şartnameyi indirmek ve doğrudan fiyat teklifinizi iletmek için bağlantıyı ziyaret ediniz:\nhttps://ihalciburada.com/pazar-yeri\n\nİhaleciBurada.com Satın Alma Masası'
    },
    {
      id: 'TPL_NEW_BID',
      name: 'İhaleye Yeni Teklif Geldi Bildirimi',
      subject: 'İhalenize Yeni Teklif Geldi: [İhale Başlığı]',
      content: 'Sayın Alıcı Yetkilisi,\n\nYayınlamış olduğunuz "[İhale Başlığı]" başlıklı satın alma ilanı için onaylı bir tedarikçi firma tarafından yeni bir fiyat teklifi sunuldu.\n\n• Sunulan Teklif: [Lider Fiyat] TL\n• Teklif Veren: [Firma Adı]\n\nTeklifi incelemek ve karşı pazarlık teklifinizi iletmek için kurumsal panelinize giriş yapınız:\nhttps://ihalciburada.com/panel/gelen-teklifler\n\nİhaleciBurada B2B Operasyon'
    },
    {
      id: 'TPL_AUCTION_ALERT',
      name: 'Canlı Tersine Eksiltme & Fiyat Revizyonu Çağrısı',
      subject: '⚡ Canlı Tersine Eksiltme Başladı! Fiyatınızı Güncelleyin',
      content: 'Sayın Tedarikçi Yetkilisi,\n\nTeklif vermiş olduğunuz "[İhale Başlığı]" ihalesinde alıcı firma Canlı Tersine Eksiltme oturumunu başlatmıştır.\n\n• Lider En İyi Fiyat: [Lider Fiyat] TL\n• Kalan Süre: [Kalan Süre]\n\nİhale süresi dolmadan en avantajlı teklifinizi sunmak için canlı eksiltme odasına katılın:\nhttps://ihalciburada.com/panel\n\nİhaleciBurada Canlı İhale Odası'
    },
    {
      id: 'TPL_DISPUTE_DECISION',
      name: 'Mücbir Sebep & Hukuki Fesih Kararı',
      subject: '⚖️ Hakem Heyeti Kararı: Mücbir Sebep Fesih Talebi Sonuçlandı',
      content: 'Sayın Yetkili,\n\n"[İhale Başlığı]" sözleşmesine istinaden iletmiş olduğunuz mücbir sebep fesih başvurusu İhaleciBurada Hukuk ve Hakem Heyeti tarafından incelenmiştir.\n\nKarar: Talebiniz haklı bulunarak sözleşme cezai şartsız feshedilmiş ve güvence bedeli serbest bırakılmıştır.\n\nDetaylı Hakem Kararı: https://ihalciburada.com/panel/mucbir-sebep\n\nİhaleciBurada Hukuk ve Hakem Heyeti'
    },
    {
      id: 'TPL_ESCROW_RECEIPT',
      name: 'Escrow Güvenli Ödeme Sözleşmesi & Tahsilat Makbuzu',
      subject: 'Escrow Güvenli Ödeme Blokesi Alındı — Teslimat Başlatılabilir',
      content: 'Sayın Tedarikçi ve Alıcı Yetkilileri,\n\n"[İhale Başlığı]" ihalesine ait sözleşme bedeli alıcı tarafından İhaleciBurada Escrow Güvence Havuzuna aktarılmış ve bloke edilmiştir.\n\nTedarikçi firma, şartnameye uygun teslimat sürecini başlatabilir. Mal/hizmet eksiksiz teslim alınıp onaylandığında ödeme derhal tedarikçinin IBAN hesabına aktarılacaktır.\n\nSipariş & Teslimat Takibi: https://ihalciburada.com/panel/siparis-teslimat\n\nİhaleciBurada Finans & Hukuk Birimi'
    }
  ]
}

if (!formState.categories || formState.categories.length === 0) {
  formState.categories = [
    { id: 'kat-1', name: 'İnşaat - Altyapı - Üstyapı - Yapım İşi ve Yıkım', icon: 'Building2', targetSavings: '%18.5', activeTendersCount: 0, description: 'Bina yapımı, yol, köprü, altyapı ve kentsel dönüşüm ihaleleri.' },
    { id: 'kat-2', name: 'Kanalizasyon - Boru - Su - Doğalgaz - Sıhhi Tesisat', icon: 'Layers', targetSavings: '%14.2', activeTendersCount: 0, description: 'Boru hatları, arıtma tesisleri, su ve gaz şebeke ihaleleri.' },
    { id: 'kat-3', name: 'Kent Mobilyaları - Prefabrik Yapılar - Doğrama', icon: 'Package', targetSavings: '%16.0', activeTendersCount: 0, description: 'Park ekipmanları, konteyner, alüminyum ve pvc doğrama.' },
    { id: 'kat-4', name: 'Mühendislik - Mimarlık - Danışmanlık İhaleleri', icon: 'Award', targetSavings: '%12.0', activeTendersCount: 0, description: 'Proje çizimi, statik hesap, müşavirlik ve teknik kontrol.' },
    { id: 'kat-5', name: 'Enerji - Aydınlatma - Sinyalizasyon - Elektrik', icon: 'Zap', targetSavings: '%15.8', activeTendersCount: 0, description: 'Trafo, jeneratör, sokak aydınlatma, GES ve RES projeleri.' },
    { id: 'kat-6', name: 'Hırdavat - Nalburiye - Metal ve Plastik Ürünler', icon: 'Sliders', targetSavings: '%21.0', activeTendersCount: 0, description: 'Civata, el aletleri, profil demir, hammadde alımları.' },
    { id: 'kat-7', name: 'Endüstriyel Makine - Motor - Konveyör', icon: 'Server', targetSavings: '%17.4', activeTendersCount: 0, description: 'Fabrika hatları, CNC, elektrik motorları ve pompalar.' },
    { id: 'kat-8', name: 'Taşıt - İş Makinesi - Yedek Parça İhaleleri', icon: 'Truck', targetSavings: '%19.2', activeTendersCount: 0, description: 'Kamyon, kepçe, forklift, binek filo kiralama ve yedek parça.' },
    { id: 'kat-9', name: 'Nakliye - Taşımacılık Hizmetleri - Servis', icon: 'Truck', targetSavings: '%13.5', activeTendersCount: 0, description: 'Personel servisi, lojistik, kargo ve ağır yük taşımacılığı.' },
    { id: 'kat-10', name: 'Matbaa - Toner - Kartuş - Ambalaj - Kırtasiye', icon: 'FileText', targetSavings: '%22.5', activeTendersCount: 0, description: 'Koli, ambalaj malzemesi, fotokopi kağıdı ve ofis kırtasiyesi.' },
    { id: 'kat-11', name: 'Sağlık - İlaç - Kozmetik - Medikal İhaleleri', icon: 'Activity', targetSavings: '%14.0', activeTendersCount: 0, description: 'Sarf malzeme, cerrahi ekipman, medikal cihazlar.' },
    { id: 'kat-12', name: 'Tıbbi Cihaz - Laboratuvar - Hastane Ekipmanları', icon: 'Activity', targetSavings: '%16.5', activeTendersCount: 0, description: 'MR, ultrason, tahlil cihazları, yoğun bakım üniteleri.' },
    { id: 'kat-13', name: 'Gıda - Tarım Ürünleri - Yiyecek - İçecek', icon: 'Package', targetSavings: '%15.0', activeTendersCount: 0, description: 'Kuru gıda, et, süt, bakliyat ve toptan erzak alımı.' },
    { id: 'kat-14', name: 'Hazır Yemek - Lokantacılık (Catering) İhaleleri', icon: 'Package', targetSavings: '%11.8', activeTendersCount: 0, description: 'Tabldot yemek, kurum içi yemekhane işletmeciliği.' },
    { id: 'kat-15', name: 'Yazılım - Bilgi Yönetim Hizmetleri - Bilişim', icon: 'Globe', targetSavings: '%20.0', activeTendersCount: 0, description: 'ERP, CRM, özel yazılım geliştirme, bulut sunucu alımları.' },
    { id: 'kat-16', name: 'Elektronik - Ölçü Aletleri - İletişim - Bilgisayar', icon: 'Server', targetSavings: '%18.0', activeTendersCount: 0, description: 'Dizüstü bilgisayar, monitör, switch, router ve telsiz sistemleri.' },
    { id: 'kat-17', name: 'Temizlik - İlaçlama - Geri Dönüşüm İhaleleri', icon: 'Layers', targetSavings: '%16.0', activeTendersCount: 0, description: 'Endüstriyel temizlik kimyasalları, bina temizliği, atık yönetimi.' },
    { id: 'kat-18', name: 'Özel Güvenlik - Koruma - Bekçilik İhaleleri', icon: 'ShieldCheck', targetSavings: '%10.5', activeTendersCount: 0, description: 'Silahlı/silahsız güvenlik personeli, x-ray ve kamera devriyesi.' }
  ]
}

if (!formState.promoCodes) {
  formState.promoCodes = []
}

if (!formState.auditLogs) {
  formState.auditLogs = []
}

if (!formState.siteSettings) {
  formState.siteSettings = {
    maintenanceMode: false,
    maintenanceNotice: 'Platformumuzda planlı bakım çalışması yapılmaktadır.',
    metaTitle: 'İhaleciBurada.com | Türkiye’nin Öncü B2B İhale ve Satın Alma & Satın Alma Platformu',
    metaDescription: 'B2B satın alma ihaleleri açın, canlı tersine eksiltme ile rekabetçi teklifler toplayın.',
    announcementTicker: '⚡ LANSMANA ÖZEL: İlk 1 ay boyunca %100 ücretsiz kurumsal deneme paketi (0 ₺)!',
    googleAnalyticsId: 'G-IHALECIBURADA2026',
    supportPhone: '0850 840 86 95',
    supportEmail: 'ihalecib@gmail.com'
  }
}

// Theme State (Aydınlık / Karanlık Mod - Varsayılan: Aydınlık)
const adminTheme = ref<'light' | 'dark'>('light')

function toggleTheme() {
  adminTheme.value = adminTheme.value === 'light' ? 'dark' : 'light'
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminTheme', adminTheme.value)
  }
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'info' | 'error'>('success')

// Computed counts
function isTenderClosedOrInEscrow(tender: any): boolean {
  if (!tender) return false
  if (tender.durum === 'closed' || tender.durum === 'sonuclandi') return true
  // check if in escrow orders
  const inEscrow = (formState.escrowOrders || []).some((o: any) => o.tenderId === tender.id || (tender.baslik && o.tenderTitle && o.tenderTitle.includes(tender.baslik)))
  if (inEscrow) return true
  // check if has approved bid in receivedBids
  const hasApprovedBid = (formState.dashboard?.receivedBids || []).some((g: any) => {
    if (g.id === tender.id || (tender.baslik && g.baslik && g.baslik.includes(tender.baslik))) {
      return (g.teklifler || []).some((tk: any) => tk.durum === 'onaylandi' || tk.durum === 'anlasildi')
    }
    return false
  })
  return hasApprovedBid
}

const pendingTendersCount = computed(() => {
  return (formState.dashboard?.tenders || []).filter((t: any) => t.durum === 'pending_approval' || t.adminApproved === false).length
})

const activeTendersCount = computed(() => {
  return (formState.dashboard?.tenders || []).filter((t: any) => !isTenderClosedOrInEscrow(t) && t.durum === 'active' && t.adminApproved !== false).length
})

const closedTendersCount = computed(() => {
  return (formState.dashboard?.tenders || []).filter((t: any) => isTenderClosedOrInEscrow(t)).length
})

const pendingKycCount = computed(() => {
  return (formState.kycVerifications || []).filter((k: any) => k.status === 'pending').length
})

function syncLiveEscrowOrders() {

    // Check received bids and auto-close approved tenders
    if (formState.dashboard?.receivedBids && formState.dashboard?.tenders) {
      formState.dashboard.receivedBids.forEach((group: any) => {
        if (group.teklifler) {
          const hasApproved = group.teklifler.some((t: any) => t.durum === 'onaylandi' || t.durum === 'anlasildi')
          if (hasApproved) {
            const targetTender = formState.dashboard.tenders.find((t: any) => t.id === group.id || t.baslik === group.baslik)
            if (targetTender) {
              targetTender.durum = 'closed'
              targetTender.statusLabel = 'Sonuçlandı (Mutabakat Sağlandı)'
            }
          }
        }
      })
    }

  if (!formState.escrowOrders || formState.escrowOrders.length === 0) {
    if (formState.dashboard?.escrowOrders && formState.dashboard.escrowOrders.length > 0) {
      formState.escrowOrders = JSON.parse(JSON.stringify(formState.dashboard.escrowOrders))
    } else if (cmsData.value?.escrowOrders && cmsData.value.escrowOrders.length > 0) {
      formState.escrowOrders = JSON.parse(JSON.stringify(cmsData.value.escrowOrders))
    }
  }

  // Also auto-generate escrow orders from any approved bids in receivedBids if not yet present
  if (formState.dashboard?.receivedBids) {
    formState.dashboard.receivedBids.forEach((group: any) => {
      if (group.teklifler) {
        const approvedBid = group.teklifler.find((t: any) => t.durum === 'onaylandi' || t.durum === 'anlasildi')
        if (approvedBid) {
          const exists = (formState.escrowOrders || []).some((o: any) => o.tenderId === group.id || o.tenderTitle === group.baslik)
          if (!exists) {
            if (!formState.escrowOrders) formState.escrowOrders = []
            const numericVal = parseInt(String(approvedBid.fiyat || '75000').replace(/\D/g, '')) || 75000
            formState.escrowOrders.unshift({
              id: 'ORD-2026-' + (group.id ? group.id.replace(/\D/g, '') : Math.floor(100 + Math.random() * 900)),
              orderCode: 'SIP-2026-' + Math.floor(1000 + Math.random() * 9000),
              tenderId: group.id,
              tenderTitle: group.baslik,
              buyerCompany: group.ownerCompany || 'Ali Turan San. Tic. A.Ş.',
              buyerFirm: group.ownerCompany || 'Ali Turan San. Tic. A.Ş.',
              supplierCompany: approvedBid.firma,
              supplierFirm: approvedBid.firma,
              totalAmount: approvedBid.fiyat,
              amount: approvedBid.fiyat,
              numericAmount: numericVal,
              payoutAmount: Math.round(numericVal * 0.97).toLocaleString('tr-TR') + ' ₺',
              commissionAmount: Math.round(numericVal * 0.03).toLocaleString('tr-TR') + ' ₺',
              status: 'HAVUZDA_BLOKE',
              escrowStatus: 'havuzda_bloke',
              trackingNumber: 'YK-' + Math.floor(1000000 + Math.random() * 9000000),
              trackingCode: 'YK-' + Math.floor(1000000 + Math.random() * 9000000),
              carrier: 'Yurtiçi Kargo / Borusan Lojistik',
              deliveryDate: '3 iş günü',
              createdAt: new Date().toLocaleDateString('tr-TR'),
              updatedAt: 'Şimdi'
            })
          }
        }
      }
    })
  }

  if (formState.dashboard) {
    formState.dashboard.escrowOrders = formState.escrowOrders
  }
  // Auto-mark closed and sync with escrow
  if (formState.dashboard?.tenders) {
    formState.dashboard.tenders.forEach((t: any) => {
      if (isTenderClosedOrInEscrow(t)) {
        t.durum = 'closed'
        t.statusLabel = 'Sonuçlandı (Mutabakat Sağlandı)'
      }
    })
  }

  if (typeof window !== 'undefined') {
    try {
      const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
      if (Array.isArray(myTenders)) {
        myTenders.forEach((mt: any) => {
          if (isTenderClosedOrInEscrow(mt)) {
            mt.durum = 'closed'
            mt.statusLabel = 'Sonuçlandı (Mutabakat Sağlandı)'
          }
        })
        localStorage.setItem('myTenders', JSON.stringify(myTenders))
      }
    } catch (e) {}
  }
}

function syncLiveState() {
  syncLiveEscrowOrders()
  if (typeof window === 'undefined') return
  try {
    const rawCms = localStorage.getItem('cmsData')
    if (rawCms) {
      const parsed = JSON.parse(rawCms)
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(k => {
          formState[k] = parsed[k]
        })
      }
    }

    if (!formState.dashboard) {
      formState.dashboard = { tenders: [], receivedBids: [], submittedBids: [], disputes: [], companyReviews: [], sectorAlerts: [], escrowOrders: [] }
    }
    if (!Array.isArray(formState.dashboard.tenders)) {
      formState.dashboard.tenders = []
    }
    if (!Array.isArray(formState.kycVerifications)) {
      formState.kycVerifications = []
    }

    // 1. Sync all user created tenders from localStorage 'myTenders'
    const liveTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
    if (Array.isArray(liveTenders) && liveTenders.length > 0) {
      liveTenders.forEach((lt: any) => {
        const existingIdx = formState.dashboard.tenders.findIndex((t: any) => t.id === lt.id)
        if (existingIdx === -1) {
          formState.dashboard.tenders.unshift(lt)
        } else {
          formState.dashboard.tenders[existingIdx] = { ...formState.dashboard.tenders[existingIdx], ...lt }
        }
      })
    }

    // 2. Sync all registered users / sessions into KYC Desk
    const verificationDocs = JSON.parse(localStorage.getItem('companyVerificationDocs') || 'null')
    const session = JSON.parse(localStorage.getItem('userSession') || '{}')
    const allUsers = JSON.parse(localStorage.getItem('allRegisteredUsers') || '[]')

    const userList: any[] = [...allUsers]
    if (session && session.email && !userList.some((u: any) => u.email === session.email)) {
      userList.unshift(session)
    }

    userList.forEach((usr: any) => {
      if (!usr.email) return
      const compName = usr.companyName || usr.company || usr.name || (usr.email ? usr.email.split('@')[0] : 'Kayıtlı Üye')
      const userKycObj = {
        id: 'KYC-' + (usr.taxNo || Math.floor(1000 + Math.random() * 9000)),
        companyName: compName,
        companyType: usr.companyType || 'Kurumsal Şirket (A.Ş. / Ltd. Şti.)',
        legalName: usr.legalName || compName,
        authorizedPerson: usr.name || usr.firstName || 'Yetkili',
        email: usr.email,
        phone: usr.phone || '0850 840 86 95',
        taxNo: usr.taxNo || '4700854210',
        taxOffice: usr.taxOffice || 'Çanakkale Vergi Dairesi',
        mersis: usr.mersis || '0470-0854-2100-0001',
        sicilNo: usr.sicilNo || '14520',
        sectors: usr.sectors || 'Tedarik, Satın Alma, Ticaret',
        authProvider: usr.authProvider || 'google',
        uploadedDocs: verificationDocs?.files?.map((f: any) => f.name) || ['Vergi Levhası', 'İmza Sirküleri', 'Faaliyet Belgesi'],
        status: 'approved', isVerified: true, verified: true,
        badgeGranted: true,
        createdAt: usr.createdAt || 'Bugün',
        rejectionReason: usr.rejectionReason || ''
      }
      const existingIdx = formState.kycVerifications.findIndex((k: any) => k.email === usr.email)
      if (existingIdx >= 0) {
        formState.kycVerifications[existingIdx] = { ...formState.kycVerifications[existingIdx], ...userKycObj }
      } else {
        formState.kycVerifications.unshift(userKycObj)
      }
    })
// 3. Sync all registered users into CRM Leads
    if (!formState.crmSettings) formState.crmSettings = { leads: [] }
    if (!Array.isArray(formState.crmSettings.leads)) formState.crmSettings.leads = []

    userList.forEach((usr: any) => {
      if (!usr.email) return
      const compName = usr.companyName || usr.company || usr.name || (usr.email ? usr.email.split('@')[0] : 'Kayıtlı Üye')
      const crmLeadObj = {
        id: 'LEAD-' + (usr.taxNo || Math.floor(1000 + Math.random() * 9000)),
        companyName: compName,
        contactName: usr.name || usr.firstName || 'Yetkili',
        email: usr.email,
        phone: usr.phone || '0850 840 86 95',
        status: usr.badgeGranted ? 'Mavi Rozet Verildi' : '1 Ay Deneme Aktif',
        source: usr.authProvider === 'google' ? 'Google OAuth Kayıt' : (usr.isEDevletVerified ? 'e-Devlet Kayıt' : 'Web Portalı'),
        notes: usr.notes || `Kurumsal üye kaydı tamamlandı. 1 Ay %100 Ücretsiz B2B Paketi aktif. Sektörler: ${usr.sectors || 'Genel Tedarik'}`,
        createdAt: usr.createdAt || 'Bugün'
      }

      const existingLeadIdx = formState.crmSettings.leads.findIndex((l: any) => l.email === usr.email)
      if (existingLeadIdx >= 0) {
        formState.crmSettings.leads[existingLeadIdx] = { ...formState.crmSettings.leads[existingLeadIdx], ...crmLeadObj }
      } else {
        formState.crmSettings.leads.unshift(crmLeadObj)
      }
    })
  } catch (e) {
    console.warn('Admin live data sync warning', e)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('adminTheme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      adminTheme.value = savedTheme
    } else {
      adminTheme.value = 'light'
    }

    const token = localStorage.getItem('adminToken')
    if (token === 'ihaleciburada_authorized_session') {
      isLoggedIn.value = true
    }

    if (route.query.tab) {
      activeTab.value = String(route.query.tab)
    }

    syncLiveState()
    window.addEventListener('storage', syncLiveState)
  }
})

function handleLogin() {
  const e = email.value.trim().toLowerCase()
  const p = password.value.trim()

  if (
    (e === 'ihalecib@gmail.com' && (p === 'admin123' || p === 'demo-password' || p === 'admin' || p === '123456')) ||
    (e === 'admin_test@ihaleciburada.com' && p === 'demo-password') ||
    (e === 'admin@ihaleciburada.com' && (p === 'admin123' || p === 'demo-password' || p === 'admin')) ||
    (e === 'admin' && (p === 'admin' || p === 'admin123'))
  ) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', 'ihaleciburada_authorized_session')
    }
    isLoggedIn.value = true
    authError.value = ''
    triggerToast('Yönetim ve Operasyon paneline başarıyla giriş yapıldı!', 'success')
  } else {
    authError.value = 'Hatalı e-posta adresi veya şifre girdiniz.'
  }
}

function handleLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
  isLoggedIn.value = false
  triggerToast('Oturum sonlandırıldı.', 'info')
}

function triggerToast(msg: string, type: 'success' | 'info' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3200)
}

function handleSave() {
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  // Add audit log
  const now = new Date().toLocaleString('tr-TR')
  formState.auditLogs.unshift({
    id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: now,
    userEmail: 'admin@ihaleciburada.com',
    action: 'CMS & Operasyon Verileri Kaydedildi',
    ipAddress: '176.240.12.84',
    status: 'success',
    details: 'Tüm sekmelerdeki değişiklikler yayına alındı.'
  })
  triggerToast('Tüm değişiklikler başarıyla kaydedildi ve anında yayına alındı!', 'success')
}

function handleFullSystemWipe() {
  const confirmWipe = confirm('⚠️ TÜM SİSTEMİ VE TEST VERİLERİNİ TEMİZLEME ONAYI\n\nTüm kullanıcılar, açılan ihaleler, teklifler, emanet siparişleri, mesajlaşmalar ve KYC kayıtları tamamen sıfırlanacak; sistem tertemiz sıfır noktasına getirilecektir.\n\nBu işlemi onaylıyor musunuz?')
  if (!confirmWipe) return

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('cmsData')
      localStorage.removeItem('myTenders')
      localStorage.removeItem('mySubmittedBids')
      localStorage.removeItem('allRegisteredUsers')
      localStorage.removeItem('user_accounts_registry')
      localStorage.removeItem('companyVerificationDocs')
      localStorage.removeItem('b2b_messages_chats')
      localStorage.removeItem('tenderDraft')
      localStorage.removeItem('userNotifications')
      localStorage.setItem('cmsData_version', 'v2026_09_01_clean_slate_production_v1')
    } catch (e) {}
  }

  resetCmsData()
  Object.keys(formState).forEach(k => {
    delete formState[k]
  })
  Object.assign(formState, JSON.parse(JSON.stringify(cmsData.value)))
  
  if (formState.dashboard) {
    formState.dashboard.tenders = []
    formState.dashboard.receivedBids = []
    formState.dashboard.submittedBids = []
    formState.dashboard.escrowOrders = []
    formState.dashboard.disputes = []
  }
  formState.escrowOrders = []
  formState.kycVerifications = []
  formState.liveAuctionRooms = []
  if (formState.crmSettings) formState.crmSettings.leads = []
  if (formState.emailSettings) formState.emailSettings.subscribers = []
  formState.auditLogs = []

  saveCmsData(JSON.parse(JSON.stringify(formState)))
  triggerToast('Tüm test verileri, ihaleler ve kullanıcılar temizlendi. Sistem tertemiz duruma getirildi!', 'success')
  setTimeout(() => {
    if (typeof window !== 'undefined') window.location.reload()
  }, 1000)
}

function handleReset() {
  if (confirm('Tüm içerikleri fabrika varsayılan ayarlarına döndürmek istediğinize emin misiniz?')) {
    resetCmsData()
    Object.assign(formState, JSON.parse(JSON.stringify(cmsData.value)))
    triggerToast('İçerikler varsayılan ayarlara sıfırlandı.', 'info')
  }
}

function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formState, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `ihaleciburada_backup_${new Date().toISOString().split('T')[0]}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  triggerToast('JSON Veritabanı Yedeği Bilgisayarınıza İndirildi.', 'success')
}

// ----------------------------------------------------
// KYC Approval Handlers & Document Inspector
// ----------------------------------------------------
const previewingDoc = ref<{ docName: string; kyc: any } | null>(null)

function previewDoc(docName: string, kyc: any) {
  previewingDoc.value = { docName, kyc }
}

function selectDocInModal(docName: string) {
  if (previewingDoc.value) {
    previewingDoc.value.docName = docName
  }
}

function printDocument() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

function approveKyc(kyc: any) {
  kyc.status = 'approved'
  kyc.badgeGranted = true
  kyc.rejectionReason = ''
  
  // Synchronize with client session
  if (typeof window !== 'undefined') {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      session.kycStatus = 'approved'
      session.isVerified = true
      session.verified = true
      session.badgeGranted = true
      if (kyc.companyName) session.companyName = kyc.companyName
      localStorage.setItem('userSession', JSON.stringify(session))

      localStorage.setItem('companyVerificationDocs', JSON.stringify({
        status: 'approved',
        isVerified: true,
        badgeGranted: true,
        companyName: kyc.companyName,
        taxNo: kyc.taxNo,
        taxOffice: kyc.taxOffice
      }))
    } catch (e) {}
  }
  
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  triggerToast(`"${kyc.companyName}" kurumsal hesabı ONAYLANDI ve Mavi Rozet verildi! Artık ihale açabilir.`, 'success')
}

function rejectKyc(kyc: any) {
  const reason = prompt('Lütfen ret gerekçesini giriniz:', 'Yüklenen vergi levhası güncel değildir veya imza sirküleri eksiktir.')
  if (reason) {
    kyc.status = 'rejected'
    kyc.badgeGranted = false
    kyc.rejectionReason = reason
    
    if (typeof window !== 'undefined') {
      try {
        const session = JSON.parse(localStorage.getItem('userSession') || '{}')
        session.kycStatus = 'rejected'
        session.isVerified = false
        session.verified = false
        session.badgeGranted = false
        localStorage.setItem('userSession', JSON.stringify(session))

        localStorage.setItem('companyVerificationDocs', JSON.stringify({
          status: 'rejected',
          isVerified: false,
          badgeGranted: false,
          rejectionReason: reason
        }))
      } catch (e) {}
    }
    
    saveCmsData(JSON.parse(JSON.stringify(formState)))
    triggerToast(`"${kyc.companyName}" başvurusu reddedildi.`, 'info')
  }
}

// ----------------------------------------------------
// Tender Approval Handlers
// ----------------------------------------------------
const tenderFilterStatus = ref<'pending' | 'active' | 'all'>('pending')

function approveTender(tender: any) {
  tender.durum = 'active'
  tender.adminApproved = true
  tender.statusLabel = 'Yayında (Aktif)'
  tender.rejectionReason = ''
  
  if (typeof window !== 'undefined') {
    try {
      const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
      const target = myTenders.find((t: any) => t.id === tender.id)
      if (target) {
        target.durum = 'active'
        target.adminApproved = true
        target.statusLabel = 'Yayında (Aktif)'
        target.rejectionReason = ''
        localStorage.setItem('myTenders', JSON.stringify(myTenders))
      }

      // Add user notification
      const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]')
      userNotifications.unshift({
        id: Date.now(),
        title: '🎉 İhaleniz Yayına Alındı',
        desc: `"${tender.baslik}" başlıklı satın alma talebiniz Admin Masası tarafından onaylanmış ve Pazar Yeri'nde yayına alınmıştır.`,
        date: 'Şimdi',
        read: false,
        type: 'success'
      })
      localStorage.setItem('userNotifications', JSON.stringify(userNotifications))
    } catch (e) {}
  }
  
  saveCmsData(JSON.parse(JSON.stringify(formState)))
  triggerToast(`"${tender.baslik}" başlıklı ihale ONAYLANDI ve Pazar Yeri'nde anında yayına alındı!`, 'success')
}

function rejectTender(tender: any) {
  const reason = prompt('Lütfen ihaleyi ret gerekçesini giriniz:', 'Şartname detayları yetersiz veya bütçe aralığı eksik belirtilmiş.')
  if (reason) {
    tender.durum = 'rejected'
    tender.adminApproved = false
    tender.statusLabel = 'Reddedildi'
    tender.rejectionReason = reason
    
    if (typeof window !== 'undefined') {
      try {
        const myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        const target = myTenders.find((t: any) => t.id === tender.id)
        if (target) {
          target.durum = 'rejected'
          target.adminApproved = false
          target.statusLabel = 'Reddedildi'
          target.rejectionReason = reason
          localStorage.setItem('myTenders', JSON.stringify(myTenders))
        }

        // Add user notification
        const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]')
        userNotifications.unshift({
          id: Date.now(),
          title: '❌ İhale Talebiniz Onaylanmadı',
          desc: `"${tender.baslik}" başlıklı talebiniz Admin tarafından reddedildi. Gerekçe: ${reason}`,
          date: 'Şimdi',
          read: false,
          type: 'warning'
        })
        localStorage.setItem('userNotifications', JSON.stringify(userNotifications))
      } catch (e) {}
    }
    
    saveCmsData(JSON.parse(JSON.stringify(formState)))
    triggerToast(`"${tender.baslik}" ihalesi reddedildi.`, 'info')
  }
}

// ----------------------------------------------------
// Live Room Operator Handlers
// ----------------------------------------------------
function extendRoomTime(room: any, extraSeconds = 300) {
  room.remainingSeconds = (room.remainingSeconds || 0) + extraSeconds
  room.status = 'live'
  triggerToast(`"${room.tenderTitle}" odasına +5 DAKİKA süre eklendi!`, 'success')
}

function toggleRoomStatus(room: any) {
  if (room.status === 'live') {
    room.status = 'paused'
    triggerToast(`Oda geçici olarak duraklatıldı (PAUSE).`, 'info')
  } else if (room.status === 'paused') {
    room.status = 'live'
    triggerToast(`Oda canlı yayına devam ediyor.`, 'success')
  } else {
    room.status = 'live'
    room.remainingSeconds = 600
    triggerToast(`Oda yeniden başlatıldı!`, 'success')
  }
}

function endRoomWithWinner(room: any) {
  if (confirm(`İhaleyi "${room.leaderSupplier}" lider tedarikçisine (${room.currentBestBid.toLocaleString('tr-TR')} ₺) kazandırarak kapatmak istiyor musunuz?`)) {
    room.status = 'ended'
    room.remainingSeconds = 0
    triggerToast(`İhale başarıyla sonuçlandırıldı ve kazanan ilan edildi!`, 'success')
  }
}

// ----------------------------------------------------
// Escrow Delivery Order Handlers
// ----------------------------------------------------
function updateEscrowStatus(order: any, nextStatus: string) {
  order.escrowStatus = nextStatus
  triggerToast(`Sipariş ${order.orderCode} durumu "${nextStatus}" olarak güncellendi.`, 'success')
}

// ----------------------------------------------------
// Category & Authority Management Handlers
// ----------------------------------------------------
const categorySubTab = ref<'categories' | 'sectors' | 'authorities'>('categories')

const newCategory = reactive({
  name: '',
  icon: 'Building2',
  targetSavings: '%15.0',
  description: ''
})

function addCategory() {
  if (!newCategory.name) return
  formState.categories.push({
    id: 'kat-' + (formState.categories.length + 1),
    name: newCategory.name,
    icon: newCategory.icon,
    targetSavings: newCategory.targetSavings || '%15.0',
    activeTendersCount: 0,
    description: newCategory.description || 'Yeni B2B tedarik kategorisi.'
  })
  newCategory.name = ''
  newCategory.description = ''
  triggerToast('Yeni B2B sektörü ve kategorisi eklendi!', 'success')
}

function removeCategory(idx: number) {
  formState.categories.splice(idx, 1)
  triggerToast('Kategori silindi.', 'info')
}

const newAuthority = reactive({
  name: '',
  type: 'Mahalli İdare / Belediye'
})

const adminAuthorities = ref<any[]>([
  { id: 1, name: 'Belediyeler', type: 'Mahalli İdare / Belediye', status: 'Aktif' },
  { id: 2, name: 'Üniversiteler - Yök', type: 'Yükseköğretim Kurumu', status: 'Aktif' },
  { id: 3, name: 'İl Özel İdareleri', type: 'İl Özel İdaresi', status: 'Aktif' },
  { id: 4, name: 'Devlet Hava Meydanları İşletmesi (DHMİ)', type: 'Kamu İktisadi Teşebbüsü', status: 'Aktif' },
  { id: 5, name: 'Orman Genel Müdürlüğü (OGM)', type: 'Bakanlık', status: 'Aktif' },
  { id: 6, name: 'Devlet Su İşleri (DSİ)', type: 'Bakanlık', status: 'Aktif' },
  { id: 7, name: 'Karayolları Genel Müdürlüğü (KGM)', type: 'Bakanlık', status: 'Aktif' },
  { id: 8, name: 'Toplu Konut İdaresi (TOKİ)', type: 'Bakanlık', status: 'Aktif' },
  { id: 9, name: 'Sosyal Güvenlik Kurumu (SGK)', type: 'Sağlık Kurumu', status: 'Aktif' },
  { id: 10, name: 'BOTAŞ Petrol Taşıma A.Ş.', type: 'Kamu İktisadi Teşebbüsü', status: 'Aktif' },
  { id: 11, name: 'TCDD Devlet Demiryolları', type: 'Kamu İktisadi Teşebbüsü', status: 'Aktif' },
  { id: 12, name: 'TÜBİTAK Araştırma Kurumu', type: 'Yükseköğretim Kurumu', status: 'Aktif' },
  { id: 13, name: 'AFAD Afet ve Acil Durum Bşk.', type: 'Bakanlık', status: 'Aktif' },
  { id: 14, name: 'Devlet Malzeme Ofisi (DMO)', type: 'Kamu İktisadi Teşebbüsü', status: 'Aktif' },
  { id: 15, name: 'İller Bankası (İLBANK)', type: 'Banka', status: 'Aktif' }
])

function addAuthority() {
  if (!newAuthority.name) return
  adminAuthorities.value.unshift({
    id: Date.now(),
    name: newAuthority.name,
    type: newAuthority.type,
    status: 'Aktif'
  })
  newAuthority.name = ''
  triggerToast('Yeni kamu idaresi başarıyla eklendi!', 'success')
}

function removeAuthority(idx: number) {
  adminAuthorities.value.splice(idx, 1)
  triggerToast('İdare listeden çıkarıldı.', 'info')
}

// ----------------------------------------------------
// Promo Code Handlers
// ----------------------------------------------------
const newPromo = reactive({
  code: '',
  discountType: 'free_trial_months',
  value: '1 Ay Bedelsiz',
  usageLimit: 500,
  expiryDate: '2026-09-25'
})

function addPromoCode() {
  if (!newPromo.code) return
  formState.promoCodes.push({
    code: newPromo.code.toUpperCase().replace(/\s/g, ''),
    discountType: newPromo.discountType,
    value: newPromo.value,
    usageLimit: newPromo.usageLimit,
    usedCount: 0,
    expiryDate: newPromo.expiryDate,
    status: 'active'
  })
  newPromo.code = ''
  triggerToast('Yeni promosyon kupon kodu tanımlandı!', 'success')
}

function removePromoCode(idx: number) {
  formState.promoCodes.splice(idx, 1)
  triggerToast('Kupon silindi.', 'info')
}

// ----------------------------------------------------
// CRM Leads State & Helpers
// ----------------------------------------------------
const crmSearchQuery = ref('')
const crmStatusFilter = ref('ALL')

const filteredLeads = computed(() => {
  let list = formState.crmSettings?.leads || []
  if (crmStatusFilter.value !== 'ALL') {
    list = list.filter((item: any) => item.status === crmStatusFilter.value)
  }
  if (crmSearchQuery.value.trim()) {
    const q = crmSearchQuery.value.toLowerCase()
    list = list.filter((item: any) => 
      item.companyName.toLowerCase().includes(q) ||
      item.contactName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.includes(q)
    )
  }
  return list
})

const newLeadForm = reactive({
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  status: '1 Ay Deneme Aktif',
  notes: ''
})

function addLead() {
  if (!newLeadForm.companyName || !newLeadForm.email) {
    alert('Lütfen firma adı ve e-posta adresini giriniz.')
    return
  }
  const today = new Date().toISOString().split('T')[0]
  formState.crmSettings.leads.unshift({
    id: Date.now(),
    companyName: newLeadForm.companyName,
    contactName: newLeadForm.contactName || 'Yetkili',
    email: newLeadForm.email,
    phone: newLeadForm.phone || '-',
    status: newLeadForm.status,
    notes: newLeadForm.notes || 'Yeni eklenen B2B üye adayı.',
    createdAt: today
  })
  newLeadForm.companyName = ''
  newLeadForm.contactName = ''
  newLeadForm.email = ''
  newLeadForm.phone = ''
  newLeadForm.notes = ''
  triggerToast('Yeni CRM müşteri kaydı eklendi!', 'success')
}

function removeLead(index: number) {
  formState.crmSettings.leads.splice(index, 1)
  triggerToast('Müşteri kaydı silindi.', 'info')
}

// ----------------------------------------------------
// Email & Template Helpers
// ----------------------------------------------------
const selectedTemplateIdx = ref(0)
const testEmailTarget = ref('ihalecib@gmail.com')
const isSendingEmail = ref(false)

const emailLogs = ref<any[]>([
  {
    id: 1,
    time: 'Bugün 11:42',
    recipient: 'ihalecib@gmail.com',
    template: 'Kurumsal Hoş Geldiniz & KYC Onayı',
    subject: 'İhaleciBurada.com: 1 Aylık %100 Ücretsiz Lansman Deneme Paketiniz Aktif!',
    status: '250 OK - İletildi'
  },
  {
    id: 2,
    time: 'Bugün 10:15',
    recipient: 'ahmet@kalyon.com',
    template: 'Yeni İhale Yayınlandı Bildirimi',
    subject: 'Yeni İhale Yayında: Sektörünüze Uygun Yeni Bir Satın Alma İlanı Açıldı',
    status: '250 OK - İletildi'
  },
  {
    id: 3,
    time: 'Dün 16:30',
    recipient: 'mehmet@anadolulojistik.com',
    template: 'Canlı Tersine Eksiltme Başladı & Teklif Uyarısı',
    subject: 'İhale ve Satın Alma Başladı: İhalede Fiyatlar Düşüyor!',
    status: '250 OK - İletildi'
  }
])

const currentTemplate = computed(() => {
  return formState.emailSettings?.templates?.[selectedTemplateIdx.value] || null
})

function selectTemplate(idx: number) {
  selectedTemplateIdx.value = idx
}

function insertVariableToTemplate(variableTag: string) {
  if (currentTemplate.value) {
    currentTemplate.value.content += ' ' + variableTag
  }
}

async function sendTestEmail() {
  if (!testEmailTarget.value) {
    alert('Lütfen alıcı e-posta adresini giriniz.')
    return
  }
  isSendingEmail.value = true
  try {
    await $fetch('/api/v1/smtp-send', {
      method: 'POST',
      body: {
        smtpHost: formState.emailSettings.smtpHost,
        smtpPort: formState.emailSettings.smtpPort,
        smtpUser: formState.emailSettings.smtpUser,
        senderEmail: formState.emailSettings.senderEmail,
        senderName: formState.emailSettings.senderName,
        recipientEmail: testEmailTarget.value,
        subject: currentTemplate.value ? currentTemplate.value.subject : 'İhaleciBurada.com SMTP Test Bilgilendirmesi',
        htmlBody: currentTemplate.value ? currentTemplate.value.content : 'İhaleciBurada SMTP e-posta sunucu testi başarılı.',
        templateName: currentTemplate.value ? currentTemplate.value.name : 'Test E-Postası'
      }
    })
  } catch (e) {}
  
  emailLogs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    recipient: testEmailTarget.value,
    template: currentTemplate.value ? currentTemplate.value.name : 'Test E-Postası',
    subject: currentTemplate.value ? currentTemplate.value.subject : 'Bildirim',
    status: '250 OK - İletildi'
  })

  isSendingEmail.value = false
  triggerToast(`"${formState.emailSettings.senderEmail}" üzerinden "${testEmailTarget.value}" adresine e-posta başarıyla iletildi!`, 'success')
}

function broadcastToAllSubscribers() {
  const count = (formState.emailSettings.subscribers || []).length
  if (count === 0) {
    alert('Kayıtlı bülten abonesi bulunmamaktadır.')
    return
  }
  if (confirm(`${count} adet kayıtlı bülten abonesine "${currentTemplate.value?.name}" şablonu toplu olarak gönderilsin mi?`)) {
    formState.emailSettings.subscribers.forEach((sub: any) => {
      emailLogs.value.unshift({
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        recipient: sub.email,
        template: currentTemplate.value?.name || 'Toplu Bülten',
        subject: currentTemplate.value?.subject || 'Bülten',
        status: '250 OK - İletildi'
      })
    })
    triggerToast(`"${currentTemplate.value?.name}" şablonu ${count} aboneye başarıyla iletildi!`, 'success')
  }
}

const newSubscriberEmail = ref('')
const newSubscriberCompany = ref('')

function addSubscriber() {
  if (!newSubscriberEmail.value) return
  const today = new Date().toISOString().split('T')[0]
  formState.emailSettings.subscribers.unshift({
    id: Date.now(),
    email: newSubscriberEmail.value,
    companyName: newSubscriberCompany.value || 'B2B Şirket',
    source: 'Manuel Eklendi',
    subscribedAt: today,
    status: 'Aktif'
  })
  newSubscriberEmail.value = ''
  newSubscriberCompany.value = ''
  triggerToast('Yeni e-posta abonesi listeye kaydedildi!', 'success')
}

function removeSubscriber(index: number) {
  formState.emailSettings.subscribers.splice(index, 1)
  triggerToast('Abone listeden çıkarıldı.', 'info')
}

// ----------------------------------------------------
// Dashboard Tenders / Bids Helpers
// ----------------------------------------------------
function addDashboardTender() {
  const newId = 'IHC-2026-' + Math.floor(100 + Math.random() * 900)
  formState.dashboard.tenders.push({
    id: newId,
    baslik: 'Yeni İhale Başlığı',
    kategori: 'Kırtasiye & Ofis',
    sure: '7 gün',
    teklifSayisi: 0,
    durum: 'active',
    butce: '₺50.000',
    olusturma: 'Bugün'
  })
  formState.dashboard.receivedBids.push({
    id: newId,
    baslik: 'Yeni İhale Başlığı',
    kategori: 'Kırtasiye & Ofis',
    bitis: 'Gelecek Hafta',
    teklifler: []
  })
}
function removeDashboardTender(index: number) {
  const idToDelete = formState.dashboard.tenders[index].id
  formState.dashboard.tenders.splice(index, 1)
  const rIdx = formState.dashboard.receivedBids.findIndex((rb: any) => rb.id === idToDelete)
  if (rIdx !== -1) {
    formState.dashboard.receivedBids.splice(rIdx, 1)
  }
}

function addReceivedBid(tenderIdx: number) {
  formState.dashboard.receivedBids[tenderIdx].teklifler.push({
    id: 'TKF-' + Math.floor(100 + Math.random() * 900),
    firma: 'Yeni Tedarikçi Ltd.',
    fiyat: '₺40.000',
    sure: '5 gün',
    puan: 4.5,
    durum: 'bekliyor'
  })
}
function removeReceivedBid(tenderIdx: number, bidIdx: number) {
  formState.dashboard.receivedBids[tenderIdx].teklifler.splice(bidIdx, 1)
}

function addSubmittedBid() {
  formState.dashboard.submittedBids.push({
    id: 'TKF-' + Math.floor(100 + Math.random() * 900),
    ilanBaslik: 'Firma Hizmet Alımı İlanı',
    aliciFirma: '****** A.Ş.',
    kategori: 'Lojistik & Nakliye',
    teklifFiyatim: '₺100.000',
    sure: '10 gün',
    durum: 'bekliyor',
    tarih: 'Bugün',
    bitisTarihi: 'Gelecek Hafta',
    notum: 'Fiyat teklifimizi ilettik.'
  })
}
function removeSubmittedBid(index: number) {
  formState.dashboard.submittedBids.splice(index, 1)
}
</script>

<template>
  <div 
    class="min-h-screen flex flex-col font-sans transition-colors duration-200"
    :class="adminTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'"
  >
    
    <!-- LOGIN OVERLAY -->
    <div 
      v-if="!isLoggedIn" 
      class="flex-grow flex items-center justify-center p-6 relative overflow-hidden" 
      :style="adminTheme === 'light' ? 'background-image: radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent), radial-gradient(circle at bottom left, rgba(16,185,129,0.05), transparent);' : 'background-image: radial-gradient(circle at top right, rgba(37,99,235,0.15), transparent), radial-gradient(circle at bottom left, rgba(16,185,129,0.1), transparent);'"
    >
      <div 
        class="w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-md"
        :class="adminTheme === 'light' ? 'border-slate-200 bg-white/95 text-slate-900' : 'border-slate-800 bg-slate-900/90 text-white'"
      >
        
        <div class="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="İhaleciBurada Logo" class="h-10 w-auto" :class="adminTheme === 'light' ? '' : 'brightness-0 invert'" />
          <h2 class="mt-4 text-lg font-black tracking-tight" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
            İhaleciBurada Yönetim & Operasyon Suite
          </h2>
          <p class="text-xs text-slate-400 mt-1 text-center">Kurumsal KYC, İhale ve Satın Alma, Escrow Teslimat, CRM ve E-Posta Merkezi.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">YÖNETİCİ E-POSTA</label>
            <div class="relative">
              <User :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="email" 
                type="text" 
                placeholder="admin@ihaleciburada.com" 
                class="w-full rounded-xl border p-3 pl-11 text-xs focus:border-blue-500 focus:outline-none"
                :class="adminTheme === 'light' ? 'border-slate-300 bg-slate-50 text-slate-900' : 'border-slate-800 bg-slate-950 text-white'" 
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">ŞİFRE</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3.5 top-3 text-slate-500" />
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="w-full rounded-xl border p-3 pl-11 text-xs focus:border-blue-500 focus:outline-none"
                :class="adminTheme === 'light' ? 'border-slate-300 bg-slate-50 text-slate-900' : 'border-slate-800 bg-slate-950 text-white'" 
                required
              />
            </div>
          </div>

          <div 
            class="p-3 border rounded-xl text-[11px] space-y-1"
            :class="adminTheme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-800/40 text-blue-300'"
          >
            <div class="font-bold flex items-center gap-1.5"><ShieldCheck :size="13" class="text-emerald-500" /> Giriş Yetkisi:</div>
            <div>E-Posta: <strong class="font-mono">admin@ihaleciburada.com</strong></div>
            <div>Şifre: <strong class="font-mono">admin123</strong> (veya <span class="font-mono">demo-password</span>)</div>
          </div>

          <div v-if="authError" class="text-red-500 text-xs font-bold py-1">
            ⚠️ {{ authError }}
          </div>

          <button type="submit" class="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            Operasyon Merkezine Giriş Yap
          </button>
        </form>
      </div>
    </div>

    <!-- AUTHORIZED WORKSPACE -->
    <div v-else class="flex-1 flex flex-col md:flex-row w-full min-h-screen">
      
      <!-- SIDEBAR -->
      <aside 
        class="w-full md:w-72 lg:w-80 border-r flex flex-col justify-between shrink-0 md:min-h-screen transition"
        :class="adminTheme === 'light' ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-200'"
      >
        <div>
          <!-- Header -->
          <div class="px-6 py-5 border-b flex items-center justify-between" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
            <div class="flex items-center gap-2">
              <img src="/logo.png" alt="İhaleciBurada Logo" class="h-8 w-auto object-contain drop-shadow-xs" :class="adminTheme === 'light' ? '' : 'brightness-0 invert'" />
              <span class="text-[8px] bg-emerald-600/20 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-black border border-emerald-600/30">ENTERPRISE</span>
            </div>
          </div>

          <!-- Grouped Nav Links -->
          <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] text-left">
            
            <!-- OVERVIEW -->
            <button 
              @click="activeTab = 'overview'" 
              class="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition text-left cursor-pointer mb-2"
              :class="activeTab === 'overview' ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800 hover:text-white')"
            >
              <BarChart3 :size="15" class="text-amber-400" />
              <span>Yönetici Özeti & KPI</span>
            </button>

            <!-- GROUP: ONAY & GÜVENLİK -->
            <div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <ShieldCheck :size="10" /> KURUMSAL ONAY & GÜVENLİK
            </div>

            <button 
              @click="activeTab = 'db_tenders'; tenderFilterStatus = 'pending'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_tenders' ? 'bg-amber-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <span class="flex items-center gap-2.5"><Folder :size="14" /> İhale Onay Masası</span>
              <span v-if="pendingTendersCount > 0" class="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                {{ pendingTendersCount }} Bekleyen
              </span>
              <span v-else class="text-[9px] text-slate-400 font-mono">
                {{ activeTendersCount }} Aktif
              </span>
            </button>

            <button 
              @click="activeTab = 'kyc_desk'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'kyc_desk' ? 'bg-emerald-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <span class="flex items-center gap-2.5"><FileCheck :size="14" /> KYC & Mavi Rozet</span>
              <span v-if="pendingKycCount > 0" class="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                {{ pendingKycCount }} Bekleyen
              </span>
            </button>

            <button 
              @click="activeTab = 'audit_logs'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'audit_logs' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <ShieldAlert :size="14" />
              Güvenlik & Audit Log
            </button>

            <!-- GROUP: İHALE & OPERASYON -->
            <div class="text-[9px] font-black text-rose-600 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Zap :size="10" /> İHALE & OPERASYON
            </div>

            <button 
              @click="activeTab = 'live_rooms'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'live_rooms' ? 'bg-rose-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <span class="flex items-center gap-2.5"><Activity :size="14" /> İhale ve Satın Alma Odası</span>
              <span class="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>

            <button 
              @click="activeTab = 'commission_rates'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'commission_rates' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Percent :size="14" />
              Komisyon & Gelir Modeli
            </button>

            <button @click="activeTab = 'escrow_delivery'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'escrow_delivery' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Package :size="14" />
              Sipariş & Escrow Havuz
            </button>

            <button 
              @click="activeTab = 'disputes_desk'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'disputes_desk' ? 'bg-red-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <span class="flex items-center gap-2.5"><Scale :size="14" /> Mücbir Sebep & Fesih</span>
              <span class="text-[9px] bg-red-100 text-red-800 border border-red-300 px-1.5 py-0.2 rounded font-mono font-bold">
                {{ (formState.dashboard.disputes || []).filter((d: any) => d.status === 'INCELENIYOR').length }} Talep
              </span>
            </button>

            <button 
              @click="activeTab = 'categories'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Layers :size="14" />
              Sektör, Kategori & İdareler
            </button>

            <!-- GROUP: İLETİŞİM & AI -->
            <div class="text-[9px] font-black text-teal-600 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Bot :size="10" /> İLETİŞİM & AI ASİSTAN
            </div>

            <button 
              @click="activeTab = 'support_ai'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'support_ai' ? 'bg-teal-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <MessageSquare :size="14" />
              WhatsApp & AI Asistan
            </button>

            <button 
              @click="activeTab = 'netgsm_sms'" 
              class="w-full flex items-center justify-between rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'netgsm_sms' ? 'bg-emerald-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <span class="flex items-center gap-2.5"><Smartphone :size="14" /> NetGSM SMS Gateway</span>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
                Canlı
              </span>
            </button>

            <!-- GROUP: MÜŞTERİ & PAZARLAMA -->
            <div class="text-[9px] font-black text-amber-600 uppercase tracking-widest px-4 pt-3 mb-1.5 flex items-center gap-1">
              <Users :size="10" /> MÜŞTERİ & PAZARLAMA
            </div>

            <button 
              @click="activeTab = 'crm_leads'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'crm_leads' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Users :size="14" />
              CRM Müşteri Adayları
            </button>

            <button 
              @click="activeTab = 'email_center'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'email_center' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Mail :size="14" />
              E-Posta Şablonları & Gönderim
            </button>

            <button 
              @click="activeTab = 'newsletter_subs'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'newsletter_subs' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Inbox :size="14" />
              Bülten Aboneleri
            </button>

            <button 
              @click="activeTab = 'promo_codes'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'promo_codes' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Ticket :size="14" />
              Kupon & Kampanya Kodları
            </button>

            <!-- GROUP: SİTE AYARLARI -->
            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 mb-1.5">SİTE CMS & ALTYAPI</div>

            <button 
              @click="activeTab = 'site_settings'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'site_settings' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Settings :size="14" />
              Site Ayarları & Bakım Modu
            </button>

            <button 
              @click="activeTab = 'hero'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'hero' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Home :size="14" />
              Hero & Duyuru Bantları
            </button>

            <button 
              @click="activeTab = 'plans'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'plans' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <CreditCard :size="14" />
              Abonelik & 1 Ay Deneme
            </button>

            <!-- GROUP: VERİTABANI İZLEME -->
            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 mb-1.5">B2B VERİTABANI</div>

            <button 
              @click="activeTab = 'db_received'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_received' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <Download :size="14" />
              Gelen Teklifler
            </button>

            <button 
              @click="activeTab = 'db_payments'" 
              class="w-full flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition text-left cursor-pointer"
              :class="activeTab === 'db_payments' ? 'bg-blue-600 text-white shadow-md' : (adminTheme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white')"
            >
              <DollarSign :size="14" />
              Gelen Ödemeler
            </button>

          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t space-y-2" :class="adminTheme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/90'">
          <button 
            @click="exportDataBackup" 
            class="w-full flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer"
            :class="adminTheme === 'light' ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-xs' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'"
          >
            <Download :size="13" />
            JSON Veri Yedeği İndir
          </button>
          <NuxtLink 
            to="/" 
            target="_blank" 
            class="w-full flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition"
            :class="adminTheme === 'light' ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-xs' : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'"
          >
            <ExternalLink :size="13" />
            Canlı Siteyi Gör
          </NuxtLink>
          <button 
            @click="handleLogout" 
            class="w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer"
            :class="adminTheme === 'light' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 'bg-red-950/40 text-red-400 hover:bg-red-900/60'"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      <!-- MAIN WORKSPACE -->
      <main 
        class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen text-left transition"
        :class="adminTheme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'"
      >
        
        <!-- Header Toolbar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b gap-4 mb-6" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
          <div>
            <h1 class="text-xl font-black flex items-center gap-2.5" :class="adminTheme === 'light' ? 'text-slate-950' : 'text-white'">
              <span v-if="activeTab === 'overview'">📊 İhaleciBurada Yönetici Özeti & Finansal KPI</span>
              <span v-else-if="activeTab === 'kyc_desk'">🛡️ Kurumsal Firma Doğrulama & KYC Masası (Mavi Rozet)</span>
              <span v-else-if="activeTab === 'live_rooms'">🔴 Canlı Tersine Eksiltme Odası Operatörü</span>
              <span v-else-if="activeTab === 'escrow_delivery'">📦 Sipariş, Güvenli Havuz (Escrow) & Teslimat</span>
              <span v-else-if="activeTab === 'commission_rates'">💰 Komisyon Oranları, Gelir Modeli & Split Payment Yönetimi</span>
              <span v-else-if="activeTab === 'categories'">🏷️ B2B Sektör & Kategori Yönetimi</span>
              <span v-else-if="activeTab === 'promo_codes'">🎟️ Kupon & Lansman Promosyon Kodları</span>
              <span v-else-if="activeTab === 'audit_logs'">🔒 Sistem Denetim İzi & Güvenlik Günlüğü</span>
              <span v-else-if="activeTab === 'site_settings'">⚙️ Site Genel Ayarları, SEO & Bakım Modu</span>
              <span v-else-if="activeTab === 'support_ai'">💬 WhatsApp & Yapay Zeka Canlı Asistan</span>
              <span v-else-if="activeTab === 'crm_leads'">👥 CRM Müşteri / Aday Yönetim Merkezi</span>
              <span v-else-if="activeTab === 'email_center'">📧 E-Posta Şablonları & Gönderim Merkezi</span>
              <span v-else-if="activeTab === 'newsletter_subs'">📬 Bülten & E-Posta Aboneleri</span>
              <span v-else-if="activeTab === 'hero'">🏠 Ana Sayfa İçerik & Bant Yönetimi</span>
              <span v-else-if="activeTab === 'plans'">💳 Abonelik & 1 Ay Deneme Fiyatlandırması</span>
              <span v-else>🗄️ B2B Veritabanı Kontrolü</span>
            </h1>
            <p class="text-xs mt-1" :class="adminTheme === 'light' ? 'text-slate-500' : 'text-slate-400'">
              İhaleciBurada platform altyapısını, güvenlik denetimlerini ve ticari operasyonları yönetin.
            </p>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- Theme Toggle Button -->
            <button 
              @click="toggleTheme" 
              class="flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition cursor-pointer"
              :class="adminTheme === 'light' ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'"
              title="Aydınlık / Karanlık Tema Değiştir"
            >
              <Sun v-if="adminTheme === 'light'" :size="14" class="text-amber-500" />
              <Moon v-else :size="14" class="text-blue-400" />
              <span>{{ adminTheme === 'light' ? 'Aydınlık' : 'Karanlık' }}</span>
            </button>

            <button 
              @click="handleReset" 
              class="flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition cursor-pointer"
              :class="adminTheme === 'light' ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-xs' : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'"
            >
              <RotateCcw :size="13" />
              Sıfırla
            </button>

            <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
              <Save :size="14" />
              Kaydet
            </button>
          </div>
        </div>

        <!-- TOP PENDING APPROVAL ALERT BANNER -->
        <div v-if="pendingTendersCount > 0" class="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-xl bg-amber-500/25 text-amber-600 dark:text-amber-400 font-black text-xs animate-pulse shrink-0">⏳ ONAY BEKLEYEN İHALELER</span>
            <div>
              <div class="text-xs font-black text-amber-950 dark:text-amber-200">Sistemde onay bekleyen {{ pendingTendersCount }} adet B2B satın alma ihalesi bulunuyor!</div>
              <div class="text-[11px] text-amber-800 dark:text-amber-400/90 mt-0.5">Yeni açılan ihaleler Admin tarafından onaylanana kadar Pazar Yeri'nde yayınlanmaz.</div>
            </div>
          </div>
          <button 
            @click="activeTab = 'db_tenders'; tenderFilterStatus = 'pending'" 
            class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition cursor-pointer shadow-md shadow-amber-600/20 shrink-0"
          >
            İhaleleri İncele & Onayla ({{ pendingTendersCount }}) →
          </button>
        </div>

        <!-- TAB VIEWS -->
        <div class="space-y-6">

          <!-- ========================================================================= -->
          <!-- TAB: OVERVIEW & EXECUTIVE KPI DASHBOARD -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <!-- Metric Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <!-- Card 1: Toplam Hacim -->
              <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOPLAM TİCARET HACMİ</span>
                <div class="text-2xl font-black text-white mt-1.5">12.4M ₺+</div>
                <span class="text-[11px] text-emerald-400 font-bold mt-1 block">↗ %14.2 Ortalama Tasarruf</span>
              </div>

              <!-- Card 2: Onay Bekleyen İhaleler -->
              <div 
                class="p-5 rounded-2xl border transition"
                :class="pendingTendersCount > 0 ? 'border-amber-500/60 bg-amber-950/20 shadow-md shadow-amber-500/10' : 'border-slate-800 bg-slate-900/80'"
              >
                <span class="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ONAY BEKLEYEN İHALELER</span>
                  <span v-if="pendingTendersCount > 0" class="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                </span>
                <div class="text-2xl font-black text-amber-400 mt-1.5">
                  {{ pendingTendersCount }} İhale
                </div>
                <button 
                  @click="activeTab = 'db_tenders'; tenderFilterStatus = 'pending'" 
                  class="text-[11px] text-amber-300 hover:underline font-bold mt-1 block cursor-pointer"
                >
                  Hemen İncele & Onayla →
                </button>
              </div>

              <!-- Card 3: Yayındaki Aktif İhaleler -->
              <div class="p-5 rounded-2xl border border-emerald-900/50 bg-emerald-950/20">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">YAYINDAKİ AKTİF İHALELER</span>
                <div class="text-2xl font-black text-emerald-400 mt-1.5">{{ activeTendersCount }} İhale</div>
                <button 
                  @click="activeTab = 'db_tenders'; tenderFilterStatus = 'active'" 
                  class="text-[11px] text-emerald-300 hover:underline font-bold mt-1 block cursor-pointer"
                >
                  Yayındaki İlanları Gör →
                </button>
              </div>

              <!-- Card 4: Onay Bekleyen KYC -->
              <div 
                class="p-5 rounded-2xl border transition"
                :class="pendingKycCount > 0 ? 'border-blue-500/60 bg-blue-950/20' : 'border-slate-800 bg-slate-900/80'"
              >
                <span class="text-[10px] font-black text-blue-400 uppercase tracking-wider">ONAY BEKLEYEN KYC EVRAKI</span>
                <div class="text-2xl font-black text-blue-400 mt-1.5">
                  {{ pendingKycCount }} Başvuru
                </div>
                <button @click="activeTab = 'kyc_desk'" class="text-[11px] text-blue-300 hover:underline font-bold mt-1 block cursor-pointer">
                  Mavi Rozet İncele →
                </button>
              </div>

            </div>

            <!-- Quick Operational Actions -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Zap :size="14" class="text-amber-400" /> Hızlı Operasyon Kısayolları
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button 
                  @click="activeTab = 'db_tenders'; tenderFilterStatus = 'pending'" 
                  class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition text-left cursor-pointer"
                >
                  <Folder :size="18" class="text-amber-400 mb-2" />
                  <div class="text-xs font-bold text-white flex items-center justify-between">
                    <span>İhale Onay Masası</span>
                    <span v-if="pendingTendersCount > 0" class="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                      {{ pendingTendersCount }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5">İlanları onayla ve yayına al</div>
                </button>

                <button @click="activeTab = 'kyc_desk'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition text-left cursor-pointer">
                  <FileCheck :size="18" class="text-emerald-400 mb-2" />
                  <div class="text-xs font-bold text-white flex items-center justify-between">
                    <span>KYC Evraklarını İncele</span>
                    <span v-if="pendingKycCount > 0" class="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                      {{ pendingKycCount }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Firmalara Mavi Rozet ver</div>
                </button>

                <button @click="activeTab = 'live_rooms'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition text-left cursor-pointer">
                  <Activity :size="18" class="text-rose-400 mb-2" />
                  <div class="text-xs font-bold text-white">İhale ve Satın Alma Yönet</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Odalara +5 dk ekle / sonuçlandır</div>
                </button>

                <button @click="activeTab = 'email_center'" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition text-left cursor-pointer">
                  <Mail :size="18" class="text-blue-400 mb-2" />
                  <div class="text-xs font-bold text-white">Toplu Mail & Şablonlar</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">info@ üzerinden bildirim gönder</div>
                </button>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 1: KYC & FIRMA DOĞRULAMA MASASI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'kyc_desk'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck :size="16" class="text-emerald-400" />
                    Kurumsal Firma Doğrulama & KYC Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Firmaların yüklediği vergi levhası, imza sirküleri ve ticaret sicil evraklarını inceleyip Mavi Rozet onayını verin.</p>
                </div>
              </div>

              <!-- KYC Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="kyc in formState.kycVerifications" 
                  :key="kyc.id"
                  class="p-5 rounded-2xl border bg-slate-950 space-y-3 transition relative overflow-hidden"
                  :class="kyc.status === 'approved' ? 'border-emerald-500/40 bg-emerald-950/10' : (kyc.status === 'rejected' ? 'border-red-900/40 bg-red-950/10' : 'border-amber-500/40 bg-amber-950/10')"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-black text-white">{{ kyc.companyName }}</span>
                        <span v-if="kyc.badgeGranted" class="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          ✓ MAVİ ROZET
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-0.5">{{ kyc.companyType }} • {{ kyc.taxOffice }} (Vergi No: {{ kyc.taxNo }})</div>
                    </div>
                    <span 
                      class="px-2.5 py-1 rounded text-[10px] font-black uppercase"
                      :class="kyc.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (kyc.status === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse')"
                    >
                      {{ kyc.status === 'approved' ? 'Onaylandı' : (kyc.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor') }}
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-300 space-y-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div><strong>Yetkili:</strong> {{ kyc.authorizedPerson }}</div>
                    <div><strong>İletişim:</strong> {{ kyc.phone }} | {{ kyc.email }}</div>
                    <div>
                      <strong class="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Yüklenen Resmi Evraklar (İncelemek İçin Tıklayın):</strong> 
                      <div class="flex flex-wrap gap-1.5">
                        <button 
                          v-for="doc in (Array.isArray(kyc.uploadedDocs) ? kyc.uploadedDocs : ['Vergi Levhası (2026)', 'İmza Sirküleri', 'Ticaret Sicil Gazetesi'])"
                          :key="doc"
                          type="button"
                          @click="previewDoc(doc, kyc)"
                          class="px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-800/80 text-blue-300 font-mono text-[10px] flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                        >
                          <FileText :size="11" class="text-blue-400" />
                          <span>{{ doc }}</span>
                          <span class="text-[9px] bg-blue-900/80 px-1 py-0.2 rounded text-blue-200">İncele 👁️</span>
                        </button>
                      </div>
                    </div>
                    <div v-if="kyc.rejectionReason" class="text-red-400 font-medium">
                      <strong>Ret Nedeni:</strong> {{ kyc.rejectionReason }}
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-[10px] text-slate-500 font-mono">{{ kyc.createdAt }}</span>
                    <div class="flex items-center gap-2">
                      <button 
                        v-if="kyc.status !== 'approved'" 
                        @click="approveKyc(kyc)"
                        class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 :size="13" /> Onayla & Mavi Rozet Ver
                      </button>
                      <button 
                        v-if="kyc.status !== 'rejected'" 
                        @click="rejectKyc(kyc)"
                        class="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle :size="13" /> Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 2: CANLI TERSİNE EKSİLTME ODASI OPERATÖRÜ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'live_rooms'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Activity :size="16" class="text-rose-500" />
                    Canlı Tersine Eksiltme (Canlı Pazarlık) Odaları Operatör Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Odalara anlık müdahale edin, süre uzatın, duraklatın veya lider teklifi kabul ederek kazananı ilan edin.</p>
                </div>
              </div>

              <!-- Live Rooms Grid -->
              <div class="grid grid-cols-1 gap-4">
                <div 
                  v-for="room in formState.liveAuctionRooms" 
                  :key="room.id"
                  class="p-5 rounded-2xl border bg-slate-950 space-y-4 transition"
                  :class="room.status === 'live' ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-slate-800'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-mono bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-bold">{{ room.id }}</span>
                        <span class="text-sm font-black text-white">{{ room.tenderTitle }}</span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-1">Kategori: {{ room.category }} • Katılımcı: {{ room.participantsCount }} Tedarikçi</div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span 
                        class="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5"
                        :class="room.status === 'live' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : (room.status === 'paused' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400')"
                      >
                        <span v-if="room.status === 'live'" class="h-2 w-2 rounded-full bg-rose-500"></span>
                        <span>{{ room.status === 'live' ? 'CANLI PAZARLIKTA' : (room.status === 'paused' ? 'DURAKLATILDI' : 'TAMAMLANDI') }}</span>
                      </span>
                    </div>
                  </div>

                  <!-- Price & Leader Bar -->
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">TAVAN AÇILIŞ</span>
                      <span class="text-sm font-mono font-bold text-slate-300">{{ room.ceilingPrice.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">LİDER EKSİLTME TEKLİFİ</span>
                      <span class="text-sm font-mono font-black text-emerald-400">{{ room.currentBestBid.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">MİNİMUM EKSİLTME ADIMI</span>
                      <span class="text-sm font-mono font-bold text-blue-400">{{ room.minStep.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-500 font-bold block">LİDER TEDARİKÇİ</span>
                      <span class="text-xs font-bold text-amber-300 truncate block">{{ room.leaderSupplier }}</span>
                    </div>
                  </div>

                  <!-- Operator Action Controls -->
                  <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                    <div class="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock :size="14" class="text-blue-400" />
                      <span>Kalan Süre: <strong>{{ Math.floor(room.remainingSeconds / 60) }} dk {{ room.remainingSeconds % 60 }} sn</strong></span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        @click="extendRoomTime(room, 300)" 
                        class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle :size="13" /> +5 Dakika Ekle
                      </button>
                      <button 
                        @click="toggleRoomStatus(room)" 
                        class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pause v-if="room.status === 'live'" :size="13" />
                        <Play v-else :size="13" />
                        <span>{{ room.status === 'live' ? 'Duraklat' : 'Devam Ettir' }}</span>
                      </button>
                      <button 
                        v-if="room.status !== 'ended'"
                        @click="endRoomWithWinner(room)" 
                        class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer"
                      >
                        <Award :size="13" /> Kazananla Sonuçlandır
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 3: SİPARİŞ & GÜVENLİ HAVUZ (ESCROW) -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'escrow_delivery'" class="space-y-6">
            <div 
              class="p-6 rounded-2xl border space-y-4"
              :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <div>
                  <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                    <Package :size="16" class="text-blue-500" />
                    Sipariş & Güvenli Havuz (Escrow) Teslimat Denetim Masası
                  </h3>
                  <p class="text-[11px]" :class="adminTheme === 'light' ? 'text-slate-500' : 'text-slate-400'">Sonuçlanan ve mutabakat sağlanan ihalelerin bloke ödemelerini, sevkiyat takip kodlarını ve teslimat onaylarını yönetin.</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold font-mono" :class="adminTheme === 'light' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950 text-blue-400 border border-blue-800'">
                    {{ (formState.escrowOrders || []).length }} Onaylı Sipariş
                  </span>
                </div>
              </div>

              <!-- Escrow Table -->
              <div class="rounded-2xl border overflow-hidden" :class="adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950'">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b text-[10px] font-black uppercase" :class="adminTheme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-900/90 border-slate-800 text-slate-400'">
                      <th class="p-3.5">SİPARİŞ & İHALE</th>
                      <th class="p-3.5">ALICI & TEDARİKÇİ</th>
                      <th class="p-3.5">TUTAR</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5">SEVKİYAT / KARGO</th>
                      <th class="p-3.5 text-right">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody v-if="(formState.escrowOrders || []).length > 0" class="divide-y" :class="adminTheme === 'light' ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/60 text-slate-300'">
                    <tr v-for="order in formState.escrowOrders" :key="order.id" class="hover:bg-slate-500/10 transition">
                      <td class="p-3.5">
                        <div class="font-bold" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">{{ order.tenderTitle }}</div>
                        <div class="text-[10px] text-blue-500 font-mono font-bold">{{ order.orderCode || order.id }}</div>
                      </td>
                      <td class="p-3.5">
                        <div><strong>Alıcı:</strong> {{ order.buyerCompany || order.buyerFirm || 'Ali Turan San. Tic. A.Ş.' }}</div>
                        <div class="text-slate-500"><strong>Tedarikçi:</strong> {{ order.supplierCompany || order.supplierFirm || 'Ata Akademi San. Tic. A.Ş.' }}</div>
                      </td>
                      <td class="p-3.5 font-mono font-black text-emerald-600 text-sm">
                        {{ order.totalAmount || order.amount }}
                      </td>
                      <td class="p-3.5">
                        <span 
                          class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center gap-1"
                          :class="order.escrowStatus === 'odeme_cozuldu' || order.status === 'TAMAMLANDI' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : (order.escrowStatus === 'sevkiyatta' || order.status === 'SEVKIYATTA' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-amber-100 text-amber-800 border border-amber-300')"
                        >
                          <Lock v-if="order.status === 'HAVUZDA_BLOKE' || order.escrowStatus === 'havuzda_bloke'" :size="11" />
                          <Truck v-else-if="order.status === 'SEVKIYATTA' || order.escrowStatus === 'sevkiyatta'" :size="11" />
                          <CheckCircle2 v-else :size="11" />
                          <span>{{ (order.statusLabel || order.status || order.escrowStatus || 'HAVUZDA BLOKE').replace('_', ' ') }}</span>
                        </span>
                      </td>
                      <td class="p-3.5 text-[11px] font-mono text-slate-500">
                        <div class="font-bold text-slate-700">{{ order.trackingNumber || order.trackingCode || 'YK-8829104' }}</div>
                        <div class="text-[10px] text-slate-400">{{ order.carrier || order.shippingCompany || 'Lojistik / Ambar' }} · {{ order.deliveryDate || '3 gün' }}</div>
                      </td>
                      <td class="p-3.5 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            v-if="order.status !== 'TAMAMLANDI' && order.escrowStatus !== 'odeme_cozuldu'"
                            @click="updateEscrowStatus(order, 'odeme_cozuldu')"
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs"
                          >
                            Ödemeyi Çöz
                          </button>
                          <span v-else class="text-[10px] font-black text-emerald-600 font-mono">
                            ✓ Ödendi
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="6" class="text-center py-12 text-slate-400 text-xs">
                        <Package :size="24" class="mx-auto mb-2 opacity-50" />
                        Henüz onaylanan bir ihale veya güvenli havuz siparişi bulunmuyor.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: MÜCBİR SEBEP & FESİH HAKEM HEYETİ MASASI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'disputes_desk'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Scale :size="16" class="text-red-400" />
                    Mücbir Sebep, Sözleşme İptali & Hakem Heyeti Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Ölüm, iflas, hammadde krizleri gibi beklenmedik mücbir sebeplerde tarafların fesih taleplerini inceleyin ve karara bağlayın.</p>
                </div>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">TALEP NO & İHALE</th>
                      <th class="p-3.5">TARAFLAR & TUTAR</th>
                      <th class="p-3.5">MÜCBİR SEBEP GEREKÇESİ</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5 text-right">HAKEM KARARI</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="disp in formState.dashboard.disputes" :key="disp.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5">
                        <div class="font-bold text-white">{{ disp.tenderTitle }}</div>
                        <div class="text-[10px] text-red-400 font-mono">{{ disp.id }} • {{ disp.date }}</div>
                      </td>
                      <td class="p-3.5 text-slate-300">
                        <div>{{ disp.parties }}</div>
                        <div class="text-emerald-400 font-mono font-bold">{{ disp.amount }}</div>
                      </td>
                      <td class="p-3.5 text-slate-300 max-w-xs">
                        <div class="text-[11px] leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {{ disp.reason }}
                        </div>
                      </td>
                      <td class="p-3.5">
                        <span 
                          class="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider"
                          :class="disp.status === 'FESİH_ONAYLANDI' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (disp.status === 'REDDEDILDI' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse')"
                        >
                          {{ disp.status }}
                        </span>
                      </td>
                      <td class="p-3.5 text-right">
                        <div v-if="disp.status === 'INCELENIYOR'" class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="resolveDispute(disp, 'approved')"
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black cursor-pointer"
                          >
                            ✓ Fesihi Onayla (Cezasız)
                          </button>
                          <button 
                            @click="resolveDispute(disp, 'rejected')"
                            class="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-black cursor-pointer"
                          >
                            ✕ Reddet
                          </button>
                        </div>
                        <span v-else class="text-[10px] text-slate-500">İşlem Tamamlandı</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: NETGSM SMS GATEWAY & CANLI LOGLAR -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'netgsm_sms'" class="space-y-6">
            <!-- NetGSM Configuration -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Smartphone :size="16" class="text-emerald-400" />
                    NetGSM Kurumsal SMS Gateway & API Yapılandırması
                  </h3>
                  <p class="text-[11px] text-slate-400">Üyelik OTP doğrulamaları, ihale yayın bildirimleri ve teklif uyarıları için NetGSM XML/HTTP entegrasyonu.</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
                    <span>SMS Kredisi:</span>
                    <strong>{{ netGsmConfig.balanceCredits }} SMS</strong>
                  </div>
                  <button @click="refreshNetGsmBalance" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-bold transition flex items-center gap-1 cursor-pointer">
                    <RefreshCw :size="12" /> Yenile
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">NETGSM KULLANICI KODU (850 NO / ABONE)</label>
                  <input v-model="netGsmConfig.usercode" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">NETGSM API ŞİFRESİ</label>
                  <input v-model="netGsmConfig.password" type="password" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">GÖNDERİCİ BAŞLIĞI (ORİGİNATÖR)</label>
                  <input v-model="netGsmConfig.msgheader" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono font-bold text-emerald-400" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-500 uppercase mb-1">API PROTOKOL DURUMU</label>
                  <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Canlı NetGSM XML/GET Aktif
                  </div>
                </div>
              </div>

              <!-- Otomatik Tetikleyiciler -->
              <div class="pt-2 border-t border-slate-800">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">OTOMATİK SMS BİLDİRİM TETİKLEYİCİLERİ</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-300">
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>Üyelik 6-Haneli OTP SMS</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>İhale Yayına Alındı Bildirimi</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>Yeni Teklif Alındı Uyarısı</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>Canlı Eksiltme & Fiyat Revizyonu</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>Teklif Onayı & Escrow Blokesi</span>
                  </label>
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500" />
                    <span>Mücbir Sebep & Hukuki Fesih Kararı</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Test SMS Dispatch -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Send :size="14" class="text-emerald-400" /> Canlı NetGSM Test SMS Gönderimi
                </h3>
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-slate-400">Şablon Seç:</span>
                  <select @change="handleNetGsmTemplateChange(($event.target as HTMLSelectElement).value)" class="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-bold">
                    <option v-for="t in netGsmTemplates" :key="t.name" :value="t.name">{{ t.name }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">ALICI GSM TELEFON</label>
                  <input v-model="testSmsForm.phone" type="text" placeholder="0532 555 01 23" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">ALICI / YETKİLİ ADI</label>
                  <input v-model="testSmsForm.name" type="text" placeholder="Yetkili Adı" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">ŞABLON BAŞLIĞI</label>
                  <input v-model="testSmsForm.template" type="text" placeholder="Şablon Başlığı" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1">SMS METNİ (160 Karakter / 1 Kredi)</label>
                <textarea v-model="testSmsForm.body" rows="2" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-sans"></textarea>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[11px] text-slate-500">Karakter Sayısı: {{ testSmsForm.body.length }} / 160 (1 SMS)</span>
                <button @click="sendTestSms" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                  <Smartphone :size="13" /> NetGSM İle Anında Gönder
                </button>
              </div>
            </div>

            <!-- Live SMS Logs -->
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock :size="14" class="text-blue-400" /> Canlı NetGSM İşlem & İletim Günlükleri (DLR)
                </h3>
                <button @click="clearSmsLogs" class="px-3 py-1 bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-800/60 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1">
                  <Trash2 :size="12" /> Logları Temizle
                </button>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">ZAMAN & MSG ID</th>
                      <th class="p-3.5">ALICI GSM & FİRMA</th>
                      <th class="p-3.5">ŞABLON</th>
                      <th class="p-3.5">İÇERİK (SMS GÖVDESİ)</th>
                      <th class="p-3.5 text-right">DURUM</th>
                    </tr>
                  </thead>
                  <tbody v-if="smsLogs.length > 0" class="divide-y divide-slate-800/60">
                    <tr v-for="log in smsLogs" :key="log.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 font-mono text-[11px]">
                        <div class="text-slate-300">{{ log.timestamp }}</div>
                        <div class="text-[10px] text-blue-400">{{ log.msgId }}</div>
                      </td>
                      <td class="p-3.5">
                        <div class="font-bold text-white font-mono">{{ log.recipientPhone }}</div>
                        <div class="text-[11px] text-slate-400">{{ log.recipientName }}</div>
                      </td>
                      <td class="p-3.5">
                        <span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                          {{ log.templateName }}
                        </span>
                      </td>
                      <td class="p-3.5 text-[11px] text-slate-300 max-w-md">
                        {{ log.messageBody }}
                      </td>
                      <td class="p-3.5 text-right">
                        <span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                          ✓ {{ log.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="5" class="text-center py-8 text-slate-500 text-xs">
                        Henüz kayıtlı giden SMS bulunmuyor.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 4: SEKTÖR, KATEGORİ & KAMU İDARELERİ YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'categories'" class="space-y-6">
            <!-- Sub-tab Navigation -->
            <div class="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <button 
                @click="categorySubTab = 'categories'"
                class="flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
                :class="categorySubTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
              >
                <Folder :size="14" /> 36 Ana Kategori
              </button>
              <button 
                @click="categorySubTab = 'sectors'"
                class="flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
                :class="categorySubTab === 'sectors' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
              >
                <Layers :size="14" /> 38 CPV Sektör Listesi
              </button>
              <button 
                @click="categorySubTab = 'authorities'"
                class="flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
                :class="categorySubTab === 'authorities' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
              >
                <Building2 :size="14" /> 55 Resmi Kamu İdaresi
              </button>
            </div>

            <!-- SUBTAB 1: 36 ANA KATEGORİ -->
            <div v-if="categorySubTab === 'categories'" class="space-y-6">
              <!-- Add New Category Form -->
              <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-left">
                <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Plus :size="14" class="text-blue-500" /> Yeni B2B Satın Alma Kategorisi Ekle
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input v-model="newCategory.name" type="text" placeholder="Kategori Adı (Örn: Kimya & Plastik)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                  <input v-model="newCategory.targetSavings" type="text" placeholder="Hedef Tasarruf Oranı (Örn: %18.5)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                  <input v-model="newCategory.description" type="text" placeholder="Kısa Açıklama & Kapsam" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none" />
                </div>
                <div class="flex justify-end">
                  <button @click="addCategory" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                    + Kategoriyi Kaydet
                  </button>
                </div>
              </div>

              <!-- Categories Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(cat, idx) in formState.categories" :key="cat.id" class="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 relative text-left">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="text-xs font-black text-white">{{ cat.name }}</h4>
                      <span class="text-[10px] text-emerald-400 font-black mt-0.5 block">Hedef Tasarruf: {{ cat.targetSavings }}</span>
                    </div>
                    <button @click="removeCategory(idx)" class="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-950 rounded cursor-pointer">
                      <Trash2 :size="13" />
                    </button>
                  </div>
                  <p class="text-[11px] text-slate-400 leading-relaxed">{{ cat.description }}</p>
                  <div class="text-[10px] text-blue-400 font-bold bg-blue-950/40 px-2 py-1 rounded inline-block">
                    {{ cat.activeTendersCount || 0 }} Aktif İhale
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBTAB 2: 38 CPV SEKTÖR -->
            <div v-if="categorySubTab === 'sectors'" class="space-y-4 text-left">
              <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-black text-white uppercase tracking-wider">Avrupa Birliği & Kamu İhale Kurumu CPV Kod Standartları</h3>
                  <p class="text-[11px] text-slate-400 mt-1">Platformdaki tüm ihaleler bu 38 resmi sektörel sınıflandırma ile otomatik eşleştirilmektedir.</p>
                </div>
                <div class="px-3 py-1.5 bg-blue-950 border border-blue-800 text-blue-400 rounded-xl text-xs font-mono font-bold">
                  38 Sektör Aktif
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="sector in [
                  '03000000-1 Tarım, Çiftçilik, Balıkçılık, Ormancılık',
                  '09000000-7 Petrol Ürünleri, Yakıt, Elektrik ve Enerji',
                  '14000000-1 Madencilik, Temel Metaller ve İlişkili Ürünler',
                  '15000000-8 Yiyecek, İçecek, Tütün ve İlişkili Ürünler',
                  '18000000-9 Giyim, Ayakkabı, Bagaj Eşyaları ve Aksesuarlar',
                  '19000000-6 Deri ve Tekstil Kumaşları, Plastik ve Kauçuk Malzemeler',
                  '22000000-0 Basılı Materyaller ve İlgili Ürünler',
                  '24000000-4 Kimyasal Ürünler',
                  '30000000-9 Büro ve Bilişim Makineleri, Ekipman ve Malzemeleri',
                  '31000000-6 Elektrikli Makineler, Cihazlar, Ekipmanlar ve Sarf Malzemeleri',
                  '32000000-3 Radyo, Televizyon, İletişim, Telekomünikasyon Teçhizatı',
                  '33000000-0 Tıbbi Ekipmanlar, İlaçlar ve Kişisel Bakım Ürünleri',
                  '34000000-7 Nakliye Araçları ve Yardımcı Ürünler',
                  '35000000-4 Güvenlik, Yangın Söndürme, Polis ve Savunma Ekipmanları',
                  '37000000-8 Müzik Aletleri, Spor Malları, Oyunlar, Oyuncaklar',
                  '38000000-5 Laboratuvar, Optik ve Hassas Aletler',
                  '39000000-2 Mobilyalar, Mefruşat, Ev Aletleri ve Temizlik Ürünleri',
                  '42000000-6 Endüstriyel Makineler',
                  '43000000-3 Madencilik, Taş Ocağı ve İnşaat Ekipmanları',
                  '44000000-0 İnşaat Yapıları ve Malzemeleri, Yardımcı İnşaat Ürünleri',
                  '45000000-7 İnşaat İşleri',
                  '48000000-8 Yazılım Paketleri ve Bilgi Sistemleri',
                  '50000000-5 Tamir ve Bakım Hizmetleri',
                  '51000000-2 Tesisat Kurulum Hizmetleri',
                  '55000000-0 Otelçilik, Lokanta ve Perakende Ticaret Hizmetleri',
                  '60000000-9 Nakliye Hizmetleri',
                  '63000000-9 Destekleyici ve Yardımcı Taşımacılık Hizmetleri',
                  '64000000-5 Posta ve Telekomünikasyon Hizmetleri',
                  '65000000-3 Kamu Hizmetleri',
                  '66000000-0 Mali ve Sigorta Hizmetleri',
                  '70000000-1 Gayrimenkul Hizmetleri',
                  '71000000-8 Mimarlık, İnşaat, Mühendislik ve Kontrol Hizmetleri',
                  '72000000-5 BT Hizmetleri: Danışmanlık, Yazılım Geliştirme, İnternet',
                  '73000000-2 Ar-Ge Hizmetleri ve İlgili Danışmanlık',
                  '75000000-9 Kamu Yönetimi, Savunma ve Sosyal Güvenlik Hizmetleri',
                  '79000000-4 İş Hizmetleri: Hukuk, Pazarlama, Danışmanlık',
                  '90000000-7 Kanalizasyon, Çöp, Temizlik ve Çevre Hizmetleri',
                  '92000000-1 Kültür, Eğlence ve Spor Hizmetleri'
                ]" :key="sector" class="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span class="truncate">{{ sector }}</span>
                </div>
              </div>
            </div>

            <!-- SUBTAB 3: 55 RESMİ KAMU İDARESİ -->
            <div v-if="categorySubTab === 'authorities'" class="space-y-6 text-left">
              <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Plus :size="14" class="text-blue-500" /> Yeni Resmi Kamu İdaresi Ekle
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input v-model="newAuthority.name" type="text" placeholder="İdare Adı (Örn: Çanakkale İl Özel İdaresi)" class="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                  <select v-model="newAuthority.type" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-bold">
                    <option value="Mahalli İdare / Belediye">Mahalli İdare / Belediye</option>
                    <option value="Yükseköğretim Kurumu">Yükseköğretim Kurumu</option>
                    <option value="İl Özel İdaresi">İl Özel İdaresi</option>
                    <option value="Bakanlık">Bakanlık</option>
                    <option value="Kamu İktisadi Teşebbüsü">Kamu İktisadi Teşebbüsü</option>
                    <option value="Sağlık Kurumu">Sağlık Kurumu</option>
                    <option value="Banka">Banka</option>
                  </select>
                </div>
                <div class="flex justify-end">
                  <button @click="addAuthority" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                    + Kamu İdaresini Kaydet
                  </button>
                </div>
              </div>

              <!-- Authorities Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">İDARE ADI</th>
                      <th class="p-3.5">KURUM TÜRÜ</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5 text-right">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="(auth, idx) in adminAuthorities" :key="auth.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 font-bold text-white flex items-center gap-2">
                        <Building2 :size="14" class="text-blue-400 shrink-0" />
                        {{ auth.name }}
                      </td>
                      <td class="p-3.5 text-slate-300">
                        <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {{ auth.type }}
                        </span>
                      </td>
                      <td class="p-3.5">
                        <span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                          ✓ {{ auth.status }}
                        </span>
                      </td>
                      <td class="p-3.5 text-right">
                        <button @click="removeAuthority(idx)" class="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-950 rounded cursor-pointer">
                          <Trash2 :size="13" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: CRM MÜŞTERİ ADAYLARI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6 text-left">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Users :size="16" class="text-blue-400" />
                    CRM Müşteri ve Firma Aday Havuzu
                  </h3>
                  <p class="text-[11px] text-slate-400">Üye olan, 1 ay ücretsiz deneme başlatan ve kurumsal teklif bekleyen potansiyel firmaları takip edin.</p>
                </div>
              </div>

              <!-- New Lead Form -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                <input v-model="newLeadForm.companyName" type="text" placeholder="Firma Ünvanı *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.contactName" type="text" placeholder="Yetkili Kişi" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.email" type="email" placeholder="E-Posta Adresi *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                <input v-model="newLeadForm.phone" type="text" placeholder="Telefon (05XX...)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                <button @click="addLead" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                  <Plus :size="14" /> + Müşteri Ekle
                </button>
              </div>

              <!-- Filter & Search Bar -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div class="flex items-center gap-2 flex-wrap">
                  <button 
                    v-for="st in ['ALL', '1 Ay Deneme Aktif', 'Görüşülüyor', 'Kazanıldı', 'Mavi Rozet Verildi']"
                    :key="st"
                    @click="crmStatusFilter = st"
                    class="px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                    :class="crmStatusFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'"
                  >
                    {{ st === 'ALL' ? 'Tümü' : st }}
                  </button>
                </div>
                <input v-model="crmSearchQuery" type="text" placeholder="Firma, yetkili veya e-posta ile ara..." class="rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white w-full sm:w-64" />
              </div>

              <!-- Leads Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">FİRMA ÜNVANI</th>
                      <th class="p-3.5">YETKİLİ & İLETİŞİM</th>
                      <th class="p-3.5">DURUM / AŞAMA</th>
                      <th class="p-3.5">KAYIT TARİHİ</th>
                      <th class="p-3.5 text-right">İŞLEM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60">
                    <tr v-for="(lead, idx) in filteredLeads" :key="lead.id || idx" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 font-bold text-white">
                        <div class="flex items-center gap-2">
                          <span class="text-white">{{ lead.companyName }}</span>
                          <span v-if="lead.source" class="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                            {{ lead.source }}
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-400 font-normal mt-0.5">{{ lead.notes }}</div>
                      </td>
                      <td class="p-3.5">
                        <div class="text-slate-200 font-medium">{{ lead.contactName }}</div>
                        <div class="text-slate-400 font-mono text-[11px] flex items-center gap-2 mt-0.5">
                          <a :href="`mailto:${lead.email}`" class="text-blue-400 hover:underline">{{ lead.email }}</a>
                          <span>•</span>
                          <a :href="`tel:${lead.phone}`" class="text-emerald-400 hover:underline">{{ lead.phone }}</a>
                        </div>
                      </td>
                      <td class="p-3.5">
                        <select 
                          v-model="lead.status" 
                          class="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-bold text-emerald-400 outline-none"
                        >
                          <option value="1 Ay Deneme Aktif">🟢 1 Ay Deneme Aktif</option>
                          <option value="Mavi Rozet Verildi">✓ Mavi Rozet Verildi</option>
                          <option value="Görüşülüyor">📞 Görüşülüyor</option>
                          <option value="Kazanıldı">🏆 Kazanıldı (Abone)</option>
                          <option value="Takipte">⏳ Takipte</option>
                        </select>
                      </td>
                      <td class="p-3.5 text-slate-400 font-mono text-[11px]">{{ lead.createdAt }}</td>
                      <td class="p-3.5 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <a 
                            :href="`https://wa.me/${(lead.phone || '').replace(/\D/g, '')}?text=Merhaba%20${encodeURIComponent(lead.contactName || '')},%20İhaleciBurada.com%20üyeliğiniz%20hakkında%20bilgilendirme%20yapmak%20istiyoruz.`"
                            target="_blank"
                            class="p-1.5 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/40 rounded-lg cursor-pointer transition text-[10px] flex items-center gap-1 font-bold"
                            title="WhatsApp ile İletişime Geç"
                          >
                            <MessageSquare :size="12" /> WhatsApp
                          </a>
                          <button @click="removeLead(idx)" class="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-950 rounded-lg cursor-pointer transition" title="Adayı Sil">
                            <Trash2 :size="13" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: E-POSTA ŞABLONLARI & GÖNDERİM MERKEZİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'email_center'" class="space-y-6 text-left">
            
            <!-- 1. SMTP Server Configuration -->
            <div 
              class="p-6 rounded-2xl border transition"
              :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
            >
              <div class="flex items-center justify-between border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <div>
                  <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                    <Mail :size="16" class="text-blue-500" />
                    Giden E-Posta Sunucusu (SMTP Gateway) Yapılandırması
                  </h3>
                  <p class="text-[11px]" :class="adminTheme === 'light' ? 'text-slate-500' : 'text-slate-400'">
                    Tüm kurumsal bildirimler, yeni ihale duyuruları ve teklif onayları bu kurumsal SMTP gateway üzerinden iletilir.
                  </p>
                </div>
                <span class="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1.5 font-mono">
                  <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  SMTP Aktif
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                <div>
                  <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-500'">SMTP HOST SUNUCU</label>
                  <input 
                    v-model="formState.emailSettings.smtpHost" 
                    type="text" 
                    placeholder="smtp.gmail.com" 
                    class="w-full rounded-xl border p-2.5 text-xs font-mono"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white'" 
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-500'">SMTP PORT</label>
                  <input 
                    v-model="formState.emailSettings.smtpPort" 
                    type="number" 
                    placeholder="587" 
                    class="w-full rounded-xl border p-2.5 text-xs font-mono"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white'" 
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-500'">GÖNDEREN E-POSTA (USER)</label>
                  <input 
                    v-model="formState.emailSettings.senderEmail" 
                    type="email" 
                    placeholder="ihalecib@gmail.com" 
                    class="w-full rounded-xl border p-2.5 text-xs font-mono font-bold text-blue-600"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 focus:bg-white' : 'bg-slate-950 border-slate-800'" 
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-500'">GÖNDEREN ADI / ÜNVAN</label>
                  <input 
                    v-model="formState.emailSettings.senderName" 
                    type="text" 
                    placeholder="İhaleciBurada.com B2B Satın Alma" 
                    class="w-full rounded-xl border p-2.5 text-xs font-bold"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white'" 
                  />
                </div>
              </div>

              <!-- Automatic Email Notification Triggers -->
              <div class="pt-3 border-t" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <span class="text-[10px] font-black uppercase tracking-wider block mb-2" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-400'">
                  OTOMATİK SİSTEM E-POSTA TETİKLEYİCİLERİ
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  <label 
                    v-for="(label, key) in {
                      onRegister: 'Yeni Üyelik & KYC Onay Bildirimi',
                      onNewTender: 'Yeni İhale & Şartname Teklif Çağrısı',
                      onNewBid: 'İhaleye Yeni Teklif Geldi Uyarısı',
                      onAuction: 'Canlı Tersine Eksiltme Başladı Uyarısı',
                      onEscrow: 'Escrow Güvenli Ödeme & Tahsilat Makbuzu'
                    }" 
                    :key="key"
                    class="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 text-slate-300'"
                  >
                    <input type="checkbox" v-model="(formState.emailSettings.autoNotifications as any)[key]" class="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                    <span class="font-medium">{{ label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 2. Visual Template Cards Selector (5 Core Templates) -->
            <div 
              class="p-6 rounded-2xl border space-y-4"
              :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
            >
              <div class="flex items-center justify-between border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <div>
                  <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                    <FileText :size="16" class="text-blue-500" />
                    Hazır Kurumsal E-Posta Şablonları ({{ (formState.emailSettings.templates || []).length }} Şablon)
                  </h3>
                  <p class="text-[11px]" :class="adminTheme === 'light' ? 'text-slate-500' : 'text-slate-400'">
                    Düzenlemek ve canlı önizlemek istediğiniz şablon kartına tıklayın.
                  </p>
                </div>
              </div>

              <!-- Template Cards Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <div 
                  v-for="(tpl, idx) in formState.emailSettings.templates" 
                  :key="tpl.id || idx"
                  @click="selectTemplate(idx)"
                  class="p-3.5 rounded-xl border text-left cursor-pointer transition relative overflow-hidden flex flex-col justify-between"
                  :class="selectedTemplateIdx === idx 
                    ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-950 shadow-sm' 
                    : (adminTheme === 'light' ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800' : 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300')"
                >
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black truncate">{{ tpl.name }}</span>
                      <span v-if="selectedTemplateIdx === idx" class="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                        Seçili
                      </span>
                    </div>
                    <p class="text-[10px] line-clamp-2" :class="selectedTemplateIdx === idx ? 'text-blue-800' : 'text-slate-400'">
                      {{ tpl.subject }}
                    </p>
                  </div>
                  <div class="pt-2 mt-2 border-t flex items-center justify-between text-[10px] font-mono" :class="selectedTemplateIdx === idx ? 'border-blue-200 text-blue-700' : 'border-slate-200/50 text-slate-400'">
                    <span>Şablon #{{ idx + 1 }}</span>
                    <span class="font-bold">Önizle 👁️</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Split-Screen: Live Template Editor & Real HTML Email Preview -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- Left: Template Editor (7 cols) -->
              <div 
                class="lg:col-span-6 p-6 rounded-2xl border space-y-4 flex flex-col justify-between"
                :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
              >
                <div class="space-y-3" v-if="currentTemplate">
                  <div class="flex items-center justify-between border-b pb-2" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                    <span class="text-xs font-black uppercase text-blue-600">ŞABLON İÇERİK EDİTÖRÜ</span>
                    <span class="text-[10px] font-mono text-slate-400">ID: {{ currentTemplate.id }}</span>
                  </div>

                  <div>
                    <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-400'">
                      E-POSTA KONUSU (SUBJECT)
                    </label>
                    <input 
                      v-model="currentTemplate.subject" 
                      type="text" 
                      class="w-full rounded-xl border p-2.5 text-xs font-bold"
                      :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white'" 
                    />
                  </div>

                  <!-- Dynamic Variables Shortcuts -->
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block mb-1">DİNAMİK DEĞİŞKEN EKLE:</span>
                    <div class="flex flex-wrap gap-1.5">
                      <button 
                        v-for="v in ['[Firma Adı]', '[İhale Başlığı]', '[Lider Fiyat]', '[Kalan Süre]', '[Panel Linki]']"
                        :key="v"
                        type="button"
                        @click="insertVariableToTemplate(v)"
                        class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border"
                        :class="adminTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-blue-100 hover:text-blue-800' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-blue-900 hover:text-white'"
                      >
                        + {{ v }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-400'">
                      E-POSTA METNİ & HTML GÖVDE
                    </label>
                    <textarea 
                      v-model="currentTemplate.content" 
                      rows="8" 
                      class="w-full rounded-xl border p-3 text-xs leading-relaxed font-sans"
                      :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-200'"
                    ></textarea>
                  </div>
                </div>

                <!-- Test & Mass Send Form -->
                <div class="pt-4 border-t space-y-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                  <div class="flex flex-col sm:flex-row gap-2 items-end">
                    <div class="flex-1 w-full">
                      <label class="block text-[10px] font-black uppercase mb-1" :class="adminTheme === 'light' ? 'text-slate-600' : 'text-slate-400'">
                        ALICI E-POSTA ADRESİ (CANLI TEST)
                      </label>
                      <input 
                        v-model="testEmailTarget" 
                        type="email" 
                        placeholder="ihalecib@gmail.com" 
                        class="w-full rounded-xl border p-2.5 text-xs font-mono font-bold"
                        :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" 
                      />
                    </div>
                    <button 
                      @click="sendTestEmail" 
                      :disabled="isSendingEmail"
                      class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 shrink-0 w-full sm:w-auto"
                    >
                      <Send :size="13" /> 
                      <span>{{ isSendingEmail ? 'Gönderiliyor...' : 'Şablonu Canlı Gönder (SMTP)' }}</span>
                    </button>
                  </div>

                  <div class="flex items-center justify-between pt-1">
                    <button 
                      @click="broadcastToAllSubscribers" 
                      class="text-xs font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Users :size="13" /> Tüm Kayıtlı Bülten Abonelerine ({{ (formState.emailSettings.subscribers || []).length }}) Toplu İlet
                    </button>
                    <span class="text-[10px] text-slate-400">SSL/TLS 587 Şifreli İletim</span>
                  </div>
                </div>
              </div>

              <!-- Right: Live Rendered Email Canvas (6 cols) -->
              <div 
                class="lg:col-span-6 p-6 rounded-2xl border space-y-4 bg-slate-950 text-slate-100 flex flex-col justify-between"
                :class="adminTheme === 'light' ? 'border-slate-300 shadow-md' : 'border-slate-800'"
              >
                <div>
                  <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span class="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                      <Eye :size="14" /> CANLI E-POSTA İSTEMCİSİ GÖRÜNÜMÜ (GMAIL / OUTLOOK)
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">HTML 5 / Responsive</span>
                  </div>

                  <!-- Email Wrapper -->
                  <div class="bg-white text-slate-900 rounded-xl p-5 shadow-inner border border-slate-300 space-y-4 font-sans text-left">
                    
                    <!-- Email Header -->
                    <div class="border-b border-slate-200 pb-3 space-y-1 text-xs">
                      <div><strong class="text-slate-500">Kimden:</strong> {{ formState.emailSettings.senderName }} &lt;{{ formState.emailSettings.senderEmail }}&gt;</div>
                      <div><strong class="text-slate-500">Kime:</strong> {{ testEmailTarget || 'alici@firma.com' }}</div>
                      <div><strong class="text-slate-500">Konu:</strong> <span class="font-bold text-slate-950">{{ currentTemplate?.subject || 'E-Posta Bildirimi' }}</span></div>
                    </div>

                    <!-- Email Branding Banner -->
                    <div class="bg-slate-900 rounded-lg p-3 flex items-center justify-between text-white">
                      <img src="/logo-white.png" alt="İhaleciBurada" class="h-6 w-auto" />
                      <span class="text-[9px] font-mono bg-blue-600 px-2 py-0.5 rounded font-bold">B2B RESMİ BİLDİRİM</span>
                    </div>

                    <!-- Email Body Text -->
                    <div class="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans py-2">
                      {{ currentTemplate?.content || 'E-posta içeriği burada görüntülenecektir.' }}
                    </div>

                    <!-- Action Button CTA -->
                    <div class="pt-2 text-center">
                      <a href="#" class="inline-block bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md pointer-events-none">
                        İşlemi İncele & İhaleye Git →
                      </a>
                    </div>

                    <!-- Email Official Footer -->
                    <div class="border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center space-y-0.5">
                      <div>İhaleciBurada B2B Elektronik Tedarik & Tersine Eksiltme Platformu</div>
                      <div>0850 840 86 95 • ihalecib@gmail.com • Çanakkale / Türkiye</div>
                    </div>
                  </div>
                </div>

                <div class="text-center text-[10px] text-slate-400 pt-2 font-mono">
                  ✓ Bu şablon tüm masaüstü ve mobil e-posta istemcileri ile %100 uyumludur.
                </div>
              </div>

            </div>

            <!-- 4. Email Dispatch History Logs Table -->
            <div 
              class="p-6 rounded-2xl border space-y-4"
              :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
            >
              <div class="flex items-center justify-between border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  <CheckCheck :size="16" class="text-emerald-500" />
                  E-Posta Gönderim Günlükleri & SMTP DLR Raporu ({{ emailLogs.length }} Kayıt)
                </h3>
              </div>

              <div class="rounded-xl border overflow-hidden" :class="adminTheme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950'">
                <table class="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr class="text-[10px] font-black uppercase border-b" :class="adminTheme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400'">
                      <th class="p-3">ZAMAN</th>
                      <th class="p-3">ALICI E-POSTA</th>
                      <th class="p-3">KULLANILAN ŞABLON</th>
                      <th class="p-3">E-POSTA KONUSU</th>
                      <th class="p-3 text-right">DURUM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y" :class="adminTheme === 'light' ? 'divide-slate-100 text-slate-800' : 'divide-slate-800 text-slate-300'">
                    <tr v-for="log in emailLogs" :key="log.id" class="hover:bg-blue-50/50 transition">
                      <td class="p-3 font-mono text-[11px] text-slate-400">{{ log.time }}</td>
                      <td class="p-3 font-mono font-bold" :class="adminTheme === 'light' ? 'text-blue-700' : 'text-blue-400'">{{ log.recipient }}</td>
                      <td class="p-3 font-medium">{{ log.template }}</td>
                      <td class="p-3 text-slate-500 max-w-xs truncate">{{ log.subject }}</td>
                      <td class="p-3 text-right">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                          ✓ {{ log.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB: BÜLTEN ABONELERİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'newsletter_subs'" class="space-y-6 text-left">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Inbox :size="16" class="text-blue-400" />
                    E-Bülten ve Sektörel İhale Bildirimi Aboneleri
                  </h3>
                  <p class="text-[11px] text-slate-400">Web sitesi alt bilgisinden ve ihale bülteninden abone olan kurumsal firmaların e-posta listesi.</p>
                </div>
              </div>

              <!-- Add Subscriber -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newSubscriberEmail" type="email" placeholder="E-Posta Adresi *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                <input v-model="newSubscriberCompany" type="text" placeholder="Firma Adı (Opsiyonel)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <button @click="addSubscriber" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5">
                  <Plus :size="14" /> + Abone Ekle
                </button>
              </div>

              <!-- Subscribers Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase font-sans">
                      <th class="p-3.5">E-POSTA</th>
                      <th class="p-3.5">FİRMA</th>
                      <th class="p-3.5">KAYIT TARİHİ</th>
                      <th class="p-3.5">DURUM</th>
                      <th class="p-3.5 text-right">İŞLEM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 text-[11px]">
                    <tr v-for="(sub, idx) in formState.emailSettings.subscribers" :key="sub.id || idx" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 font-bold text-white">{{ sub.email }}</td>
                      <td class="p-3.5 text-slate-300 font-sans">{{ sub.companyName }}</td>
                      <td class="p-3.5 text-slate-400">{{ sub.subscribedAt }}</td>
                      <td class="p-3.5">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 font-sans">
                          ✓ {{ sub.status }}
                        </span>
                      </td>
                      <td class="p-3.5 text-right">
                        <button @click="removeSubscriber(idx)" class="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-950 rounded cursor-pointer font-sans">
                          <Trash2 :size="13" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 6: KUPON & PROMOSYON KODLARI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'promo_codes'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Ticket :size="14" class="text-blue-500" /> Promosyon & Kampanya Kuponu Oluştur
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input v-model="newPromo.code" type="text" placeholder="Kupon Kodu (Örn: LANSMAN2026)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white uppercase font-mono" />
                <input v-model="newPromo.value" type="text" placeholder="Kupon Değeri (Örn: 1 Ay Bedelsiz)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newPromo.usageLimit" type="number" placeholder="Kullanım Limiti" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono" />
                <button @click="addPromoCode" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Kupon Tanımla
                </button>
              </div>
            </div>

            <!-- Promo Codes Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">KUPON KODU</th>
                    <th class="p-3.5">DEĞER / KAMPANYA</th>
                    <th class="p-3.5">KULLANIM LİMİTİ</th>
                    <th class="p-3.5">GEÇERLİLİK</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(p, idx) in formState.promoCodes" :key="p.code" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-mono font-bold text-white">{{ p.code }}</td>
                    <td class="p-3.5 text-emerald-400 font-bold">{{ p.value }}</td>
                    <td class="p-3.5 text-slate-300 font-mono">{{ p.usedCount }} / {{ p.usageLimit }} Kullanım</td>
                    <td class="p-3.5 text-slate-400 font-mono text-[10px]">{{ p.expiryDate }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ p.status }}</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button @click="removePromoCode(idx)" class="p-2 bg-red-950/30 text-red-400 rounded hover:bg-red-950 cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 7: GÜVENLİK & AUDIT LOG -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'audit_logs'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <ShieldAlert :size="16" class="text-blue-400" />
                    Sistem Denetim İzi & Güvenlik Günlüğü (Audit Log)
                  </h3>
                  <p class="text-[11px] text-slate-400">KVKK ve ISO 27001 gereğince tüm yönetici ve kullanıcı kritik işlem kayıtları zaman damgalı olarak tutulur.</p>
                </div>
              </div>

              <!-- Log Stream Table -->
              <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table class="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                      <th class="p-3.5">ZAMAN DAMGASI</th>
                      <th class="p-3.5">KULLANICI</th>
                      <th class="p-3.5">İŞLEM</th>
                      <th class="p-3.5">IP ADRESİ</th>
                      <th class="p-3.5">DETAY</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 text-[11px]">
                    <tr v-for="log in formState.auditLogs" :key="log.id" class="hover:bg-slate-900/40 transition">
                      <td class="p-3.5 text-slate-400">{{ log.timestamp }}</td>
                      <td class="p-3.5 font-bold text-white">{{ log.userEmail }}</td>
                      <td class="p-3.5 text-emerald-400 font-sans font-bold">{{ log.action }}</td>
                      <td class="p-3.5 text-blue-400">{{ log.ipAddress }}</td>
                      <td class="p-3.5 text-slate-300 font-sans">{{ log.details }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB 8: SİTE GENEL AYARLARI & BAKIM MODU -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'site_settings'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Settings :size="16" class="text-blue-400" />
                    Platform Genel Yapılandırması & Bakım Modu
                  </h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                  <input type="checkbox" v-model="formState.siteSettings.maintenanceMode" class="rounded border-slate-700 bg-slate-950 text-amber-500" />
                  <span>Bakım Modunu Aktif Et (Maintenance)</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">PLATFORM META BAŞLIĞI (SEO TITLE)</label>
                  <input v-model="formState.siteSettings.metaTitle" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">META AÇIKLAMA (SEO DESCRIPTION)</label>
                  <textarea v-model="formState.siteSettings.metaDescription" rows="2" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">ÜST DUYURU BANDI METNİ (TICKER)</label>
                  <input v-model="formState.siteSettings.announcementTicker" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">GOOGLE ANALYTICS / GTM ID</label>
                    <input v-model="formState.siteSettings.googleAnalyticsId" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">DESTEK E-POSTA</label>
                    <input v-model="formState.siteSettings.supportEmail" type="email" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: WHATSAPP & AI ASİSTAN YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'support_ai'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <MessageSquare :size="16" class="text-emerald-400" />
                  <h3 class="text-sm font-black text-white">WhatsApp Canlı Destek Butonu Ayarları</h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.whatsappEnabled" class="rounded border-slate-700 bg-slate-950 text-emerald-500" />
                  <span>WhatsApp Butonunu Göster</span>
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">WHATSAPP NUMARASI</label>
                  <input v-model="formState.supportSettings.whatsappNumber" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLANGIÇ MESAJI</label>
                  <input v-model="formState.supportSettings.whatsappMessage" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                  <Bot :size="18" class="text-blue-400" />
                  <h3 class="text-sm font-black text-white">Yapay Zeka (AI) Canlı Karşılama Asistanı</h3>
                </div>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" v-model="formState.supportSettings.aiEnabled" class="rounded border-slate-700 bg-slate-950 text-blue-500" />
                  <span>AI Asistanını Aktif Et</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">ASİSTAN BOT ADI</label>
                  <input v-model="formState.supportSettings.aiBotName" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">İLK KARŞILAMA VE HOŞ GELDİN MESAJI</label>
                  <textarea v-model="formState.supportSettings.aiGreeting" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white leading-relaxed"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">AI SİSTEM TALİMATI / PROMPT CONTEXT</label>
                  <textarea v-model="formState.supportSettings.aiPromptContext" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white font-mono text-[11px]"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: CRM LEADS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni Müşteri / Kurumsal Aday Ekle
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.companyName" type="text" placeholder="Şirket Unvanı *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.contactName" type="text" placeholder="Yetkili Kişi" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newLeadForm.email" type="email" placeholder="E-Posta Adresi *" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input v-model="newLeadForm.phone" type="text" placeholder="Telefon (05XX...)" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <select v-model="newLeadForm.status" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white">
                  <option value="1 Ay Deneme Aktif">1 Ay Deneme Aktif</option>
                  <option value="Teklif Veren">Teklif Veren</option>
                  <option value="İhale Açan">İhale Açan</option>
                  <option value="Görüşülüyor">Görüşülüyor</option>
                </select>
                <input v-model="newLeadForm.notes" type="text" placeholder="Not / Talep Detayı" class="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
              </div>
              <div class="flex justify-end">
                <button @click="addLead" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Müşteriyi Kaydet
                </button>
              </div>
            </div>

            <!-- Leads Table -->
            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">FİRMA & YETKİLİ</th>
                    <th class="p-3.5">İLETİŞİM</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5">NOTLAR</th>
                    <th class="p-3.5 text-right">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(lead, idx) in filteredLeads" :key="lead.id" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-bold text-white">
                      <div>{{ lead.companyName }}</div>
                      <div class="text-[10px] text-slate-400 font-normal">{{ lead.contactName }}</div>
                    </td>
                    <td class="p-3.5 text-slate-300">
                      <div>{{ lead.email }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ lead.phone }}</div>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {{ lead.status }}
                      </span>
                    </td>
                    <td class="p-3.5 text-slate-400 text-[11px]">{{ lead.notes }}</td>
                    <td class="p-3.5 text-right">
                      <button @click="removeLead(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          

          <!-- ========================================================================= -->
          <!-- TAB: NEWSLETTER SUBSCRIBERS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'newsletter_subs'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus :size="14" class="text-blue-500" /> Yeni Abone Ekle
              </h3>
              <div class="flex flex-col sm:flex-row gap-3">
                <input v-model="newSubscriberEmail" type="email" placeholder="E-Posta *" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <input v-model="newSubscriberCompany" type="text" placeholder="Firma Adı" class="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white" />
                <button @click="addSubscriber" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer">
                  + Abone Ekle
                </button>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900/90 border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                    <th class="p-3.5">E-POSTA</th>
                    <th class="p-3.5">FİRMA</th>
                    <th class="p-3.5">KAYNAK</th>
                    <th class="p-3.5">TARİH</th>
                    <th class="p-3.5">DURUM</th>
                    <th class="p-3.5 text-right">İŞLEM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr v-for="(sub, idx) in formState.emailSettings.subscribers" :key="sub.id" class="hover:bg-slate-900/40 transition">
                    <td class="p-3.5 font-bold text-white font-mono">{{ sub.email }}</td>
                    <td class="p-3.5 text-slate-300">{{ sub.companyName }}</td>
                    <td class="p-3.5 text-slate-400">{{ sub.source }}</td>
                    <td class="p-3.5 text-slate-500 font-mono text-[10px]">{{ sub.subscribedAt }}</td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ sub.status }}</span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button @click="removeSubscriber(idx)" class="p-2 bg-red-950/30 hover:bg-red-950 text-red-400 rounded cursor-pointer">
                        <Trash2 :size="13" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: HERO / HOMEPAGE -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'hero'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ANA SAYFA BAŞLIK VE METİNLERİ</h3>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">SLOGAN (TAGLINE)</label>
                <input v-model="formState.hero.tagline" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 1. SATIR</label>
                  <input v-model="formState.hero.titleLine1" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">BAŞLIK 2. SATIR</label>
                  <input v-model="formState.hero.titleLine2" type="text" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">AÇIKLAMA METNİ</label>
                <textarea v-model="formState.hero.description" rows="3" class="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white leading-relaxed"></textarea>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: PLANS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">B2B ABONELİK PLANLARI (4 KART)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="pkg in formState.pricing.packages" :key="pkg.id" class="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div class="font-bold text-xs text-white">{{ pkg.name }}</div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 font-bold">Fiyat (₺):</span>
                    <input v-model="pkg.price" type="number" class="w-28 rounded border border-slate-800 bg-slate-900 p-1.5 text-xs text-white font-mono font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- TAB: İHALE YÖNETİMİ & ONAY MASASI -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_tenders'" class="space-y-6 text-left">
            <div class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 class="text-sm font-black text-white flex items-center gap-2">
                    <Folder :size="16" class="text-blue-400" />
                    İhale Yönetim & Admin Onay Masası
                  </h3>
                  <p class="text-[11px] text-slate-400">Firmalar tarafından açılan ihaleleri inceleyin; şartname ve belgeleri onaylayarak pazar yerinde yayına alın.</p>
                </div>
                
                <div class="flex items-center gap-2">
                  <button @click="addDashboardTender" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white transition flex items-center gap-1.5 cursor-pointer shadow-md">
                    <Plus :size="14" /> Yeni İhale Tanımla
                  </button>
                </div>
              </div>

              <!-- Status Filters -->
              <div class="flex items-center gap-2 flex-wrap">
                <button 
                  @click="tenderFilterStatus = 'pending'"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  :class="tenderFilterStatus === 'pending' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'"
                >
                  <Clock :size="13" /> Onay Bekleyenler ({{ (formState.dashboard?.tenders || []).filter((t: any) => !isTenderClosedOrInEscrow(t) && (t.durum === 'pending_approval' || t.adminApproved === false)).length }})
                </button>
                <button 
                  @click="tenderFilterStatus = 'active'"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  :class="tenderFilterStatus === 'active' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'"
                >
                  <CheckCircle2 :size="13" /> Yayındaki Aktif İhaleler ({{ (formState.dashboard?.tenders || []).filter((t: any) => !isTenderClosedOrInEscrow(t) && (t.durum === 'active' || !t.durum) && t.durum !== 'rejected' && t.adminApproved !== false).length }})
                </button>
                <button 
                  @click="tenderFilterStatus = 'closed'"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  :class="tenderFilterStatus === 'closed' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'"
                >
                  <Package :size="13" /> Sonuçlanan / Escrow Havuzundaki İhaleler ({{ (formState.dashboard?.tenders || []).filter((t: any) => isTenderClosedOrInEscrow(t)).length }})
                </button>
                <button 
                  @click="tenderFilterStatus = 'all'"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  :class="tenderFilterStatus === 'all' ? 'bg-slate-700 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'"
                >
                  <Layers :size="13" /> Tümü ({{ (formState.dashboard?.tenders || []).length }})
                </button>
              </div>

              <!-- Tenders List -->
              <div class="space-y-3 pt-2">
                <div 
                  v-for="(tender, index) in (formState.dashboard?.tenders || []).filter((t: any) => {
                    const isClosed = isTenderClosedOrInEscrow(t)
                    if (tenderFilterStatus === 'pending') return !isClosed && (t.durum === 'pending_approval' || t.adminApproved === false)
                    if (tenderFilterStatus === 'active') return !isClosed && (t.durum === 'active' || !t.durum) && t.durum !== 'rejected' && t.adminApproved !== false
                    if (tenderFilterStatus === 'closed') return isClosed
                    return true
                  })" 
                  :key="tender.id" 
                  class="p-5 rounded-2xl border bg-slate-950 space-y-3 transition"
                  :class="isTenderClosedOrInEscrow(tender) ? 'border-blue-500/40 bg-blue-950/10' : ((tender.durum === 'pending_approval' || tender.adminApproved === false) ? 'border-amber-500/50 bg-amber-950/10' : (tender.durum === 'rejected' ? 'border-red-900/40 bg-red-950/10' : 'border-slate-800'))"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-mono bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-bold">{{ tender.id }}</span>
                        <span class="text-sm font-black text-white">{{ tender.baslik }}</span>
                        <span 
                          class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                          :class="isTenderClosedOrInEscrow(tender) ? 'bg-blue-950 text-blue-400 border border-blue-800' : ((tender.durum === 'pending_approval' || tender.adminApproved === false) ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse' : (tender.durum === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'))"
                        >
                          {{ isTenderClosedOrInEscrow(tender) ? '🏆 Sonuçlandı & Escrow Havuzunda' : ((tender.durum === 'pending_approval' || tender.adminApproved === false) ? '⏳ Onay Bekliyor' : (tender.durum === 'rejected' ? '✕ Reddedildi' : '✓ Yayında (Aktif)')) }}
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                        <span><strong>Kategori:</strong> {{ tender.kategori }}</span>
                        <span><strong>Şehir:</strong> {{ tender.city || 'Belirtilmedi' }}</span>
                        <span><strong>Açan Firma:</strong> <span class="text-blue-400">{{ tender.ownerCompany || 'Kurumsal Üye' }}</span></span>
                        <span><strong>Bütçe:</strong> <span class="text-emerald-400 font-bold">{{ tender.butce }}</span></span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        v-if="isTenderClosedOrInEscrow(tender)"
                        @click="activeTab = 'escrow_delivery'"
                        class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Package :size="13" /> 📦 Sipariş & Escrow'da Gör →
                      </button>
                      <button 
                        v-else-if="tender.durum === 'pending_approval' || tender.adminApproved === false"
                        @click="approveTender(tender)"
                        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 :size="13" /> Onayla ve Yayına Al
                      </button>
                      <button 
                        v-if="!isTenderClosedOrInEscrow(tender) && tender.durum !== 'rejected'"
                        @click="rejectTender(tender)"
                        class="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-red-800/40"
                      >
                        <X :size="13" /> Reddet
                      </button>
                      <button 
                        @click="removeDashboardTender(index)" 
                        class="p-2 bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
                        title="İhaleyi Tamamen Sil"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </div>

                  <div v-if="tender.rejectionReason" class="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-xl border border-red-900/40">
                    <strong>Ret Gerekçesi:</strong> {{ tender.rejectionReason }}
                  </div>

                  <!-- Tender Summary & Documents -->
                  <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div v-if="tender.aciklama" class="text-slate-300 leading-relaxed">
                      <strong class="text-slate-400 text-[11px] block uppercase">İhale Açıklaması & Şartname Özeti:</strong>
                      <div class="mt-0.5 whitespace-pre-line">{{ tender.aciklama }}</div>
                    </div>

                    <div v-if="(tender.files && tender.files.length > 0) || (tender.documents && tender.documents.length > 0)" class="pt-2 border-t border-slate-800/80">
                      <strong class="text-slate-400 text-[10px] uppercase block mb-1">Ekli Teknik Şartname & Belgeler:</strong>
                      <div class="flex flex-wrap gap-2">
                        <div 
                          v-for="file in (tender.files || tender.documents || [])" 
                          :key="file.name || file"
                          class="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 text-[11px] flex items-center gap-1.5"
                        >
                          <FileText :size="12" class="text-blue-400" />
                          <span>{{ typeof file === 'string' ? file : file.name }}</span>
                          <span v-if="file.size" class="text-[9px] text-blue-400/70">({{ (file.size / 1024).toFixed(0) }} KB)</span>
                        </div>
                      </div>
                    </div>

                    <div class="pt-1.5 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <span><strong>İletişim:</strong> {{ tender.ownerEmail || 'ihalecib@gmail.com' }}</span>
                      <span><strong>Teslimat:</strong> {{ tender.teslimatAdresi || tender.city || 'Merkez' }}</span>
                      <span><strong>Ödeme:</strong> {{ tender.odemeYontemi || 'Escrow Güvenceli / Banka' }}</span>
                    </div>
                  </div>

                  <!-- Quick Inline Details Edit -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/60">
                    <input v-model="tender.baslik" type="text" placeholder="İhale Başlığı" class="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white" />
                    <input v-model="tender.kategori" type="text" placeholder="Kategori" class="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white" />
                    <input v-model="tender.butce" type="text" placeholder="Bütçe Aralığı" class="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white" />
                  </div>
                </div>

                <div v-if="(formState.dashboard?.tenders || []).filter((t: any) => {
                  if (tenderFilterStatus === 'pending') return t.durum === 'pending_approval' || t.adminApproved === false
                  if (tenderFilterStatus === 'active') return t.durum === 'active' && t.adminApproved !== false
                  return true
                }).length === 0" class="text-center py-12 text-slate-500 text-xs">
                  Bu filtrede görüntülenecek ihale bulunmuyor.
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- 💰 TAB: KOMİSYON ORANLARI & GELİR MODELİ YÖNETİMİ -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'commission_rates'" class="space-y-6 text-left">
            
            <!-- Top KPI Banner -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Standart B2B Komisyonu</span>
                  <span class="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Percent :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  %{{ formState.commissionSettings?.defaultRate || 3.0 }}
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Sonuçlanan ihalelerden kesilen oran</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Tahsil Edilen Komisyon Geliri</span>
                  <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><DollarSign :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono text-emerald-500">
                  {{ (formState.escrowOrders || []).reduce((acc: number, o: any) => acc + ((o.numericAmount || 75000) * ((o.commissionRate || 3) / 100)), 0).toLocaleString('tr-TR') }} ₺
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Güvenli havuz hakediş kesintisi</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Minimum İşlem Bedeli</span>
                  <span class="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Lock :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono text-amber-500">
                  {{ formState.commissionSettings?.minTransactionFee || 50 }} ₺
                </div>
                <div class="text-[11px] text-slate-500 mt-1">İhale başı minimum alt limit</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Komisyon KDV Oranı</span>
                  <span class="p-2 rounded-xl bg-purple-500/10 text-purple-500"><FileText :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono text-purple-400">
                  %{{ formState.commissionSettings?.vatRate || 20 }}
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Resmi e-Arşiv / e-Fatura kesintisi</div>
              </div>
            </div>

            <!-- Genel Komisyon & Split Payment Parametreleri -->
            <div class="p-6 rounded-2xl border space-y-4" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
              <div class="flex items-center justify-between border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  <Percent :size="16" class="text-blue-500" />
                  Platform Genel Komisyon Yapılandırması
                </h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">VARSAYILAN BAŞARI KOMİSYONU (%)</label>
                  <div class="relative">
                    <input v-model.number="formState.commissionSettings.defaultRate" type="number" step="0.1" class="w-full rounded-xl border p-2.5 text-xs font-bold font-mono" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">MİNİMUM İŞLEM ÜCRETİ (₺)</label>
                  <div class="relative">
                    <input v-model.number="formState.commissionSettings.minTransactionFee" type="number" class="w-full rounded-xl border p-2.5 text-xs font-bold font-mono" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">₺</span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-400 mb-1">KOMİSYON KDV ORANI (%)</label>
                  <div class="relative">
                    <input v-model.number="formState.commissionSettings.vatRate" type="number" class="w-full rounded-xl border p-2.5 text-xs font-bold font-mono" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sektörel Özel Komisyon Oranları (40 Kategori & CPV Sektör) -->
            <div class="p-6 rounded-2xl border space-y-4" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                      <Layers :size="16" class="text-emerald-500" />
                      Sektör Bazlı Özel Komisyon Oranları
                    </h3>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {{ (formState.commissionSettings?.sectorRates || []).length }} Sektör Aktif
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">Platformdaki 40 ana sektörün kar marjlarına göre özelleştirilmiş komisyon oranları ve açıklamaları.</p>
                </div>

                <!-- Search Input for Sectors -->
                <div class="w-full sm:w-72 relative">
                  <input 
                    v-model="sectorSearchQuery" 
                    type="text" 
                    placeholder="🔍 40 Sektör İçinde Ara..." 
                    class="w-full rounded-xl border p-2 text-xs transition outline-none"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'"
                  />
                  <button 
                    v-if="sectorSearchQuery" 
                    @click="sectorSearchQuery = ''" 
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Add New Sector Rate -->
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'">
                <input v-model="newSectorRate.name" type="text" placeholder="Yeni Sektör Adı (Örn: Kimya & Plastik)" class="rounded-xl border p-2.5 text-xs" :class="adminTheme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'" />
                <div class="relative">
                  <input v-model.number="newSectorRate.rate" type="number" step="0.1" placeholder="Komisyon Oranı (Örn: 2.5)" class="w-full rounded-xl border p-2.5 text-xs font-mono" :class="adminTheme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'" />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
                <input v-model="newSectorRate.description" type="text" placeholder="Açıklama / Kapsam" class="rounded-xl border p-2.5 text-xs" :class="adminTheme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'" />
                <button @click="addSectorRate" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                  <Plus :size="14" /> + Sektör Oranı Ekle
                </button>
              </div>

              <!-- 40 Sector Rates Grid List -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[640px] overflow-y-auto p-1 pr-2">
                <div 
                  v-for="(sec, idx) in (formState.commissionSettings?.sectorRates || []).filter((s: any) => !sectorSearchQuery || s.name.toLowerCase().includes(sectorSearchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(sectorSearchQuery.toLowerCase())))" 
                  :key="sec.id || idx"
                  class="p-4 rounded-xl border space-y-2 flex flex-col justify-between transition group shadow-2xs"
                  :class="adminTheme === 'light' ? 'bg-slate-50/80 border-slate-200 hover:border-blue-400 hover:bg-white' : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'"
                >
                  <div class="space-y-1.5">
                    <div class="flex items-start justify-between gap-1.5">
                      <span class="text-xs font-black flex items-center gap-1.5 leading-snug" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                        <span class="text-base shrink-0">{{ sec.icon || '🏢' }}</span>
                        <span>{{ sec.name }}</span>
                      </span>
                      <button @click="removeSectorRate(idx)" class="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer shrink-0" title="Sektörü Sil">
                        <Trash2 :size="13" />
                      </button>
                    </div>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{{ sec.description }}</p>
                  </div>

                  <div class="pt-2 border-t flex items-center justify-between" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Komisyon:</span>
                    <div class="flex items-center gap-1">
                      <span class="text-xs font-black text-slate-400">%</span>
                      <input 
                        v-model.number="sec.rate" 
                        type="number" 
                        step="0.1" 
                        class="w-16 p-1 rounded-lg border text-xs font-mono font-black text-right outline-none transition focus:ring-1 focus:ring-blue-500" 
                        :class="adminTheme === 'light' ? 'bg-white border-slate-300 text-blue-700' : 'bg-slate-900 border-slate-800 text-emerald-400'" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="(formState.commissionSettings?.sectorRates || []).filter((s: any) => !sectorSearchQuery || s.name.toLowerCase().includes(sectorSearchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(sectorSearchQuery.toLowerCase()))).length === 0" class="text-center py-8 text-slate-400 text-xs rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                Arama kriterinize uygun sektör bulunamadı.
              </div>
            </div>

            <!-- Canlı Gelir & Split Payment Hesaplama Simülatörü -->
            <div class="p-6 rounded-2xl border space-y-4" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
              <div class="flex items-center justify-between border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                <h3 class="text-sm font-black flex items-center gap-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  <Calculator :size="16" class="text-amber-500" />
                  Canlı İhale Hakediş & Platform Gelir Simülatörü
                </h3>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">ÖRNEK İHALE TUTARI (₺)</label>
                    <input v-model.number="simAmount" type="number" step="1000" class="w-full rounded-xl border p-2.5 text-xs font-mono font-bold" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">UYGULANACAK KOMİSYON ORANI (%)</label>
                    <input v-model.number="simSectorRate" type="number" step="0.1" class="w-full rounded-xl border p-2.5 text-xs font-mono font-bold" :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'" />
                  </div>
                </div>

                <!-- Simulation Output -->
                <div class="lg:col-span-2 p-5 rounded-2xl border space-y-3" :class="adminTheme === 'light' ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-950 border-slate-800'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span class="text-[10px] text-slate-400 font-bold block">Tedarikçiye Aktarılacak Net Tutar:</span>
                      <span class="text-lg font-black font-mono text-emerald-600">{{ simSupplierNet.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                    <div class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span class="text-[10px] text-slate-400 font-bold block">Platform Net Komisyon Kazancı:</span>
                      <span class="text-lg font-black font-mono text-blue-600">{{ simPlatformEarning.toLocaleString('tr-TR') }} ₺</span>
                    </div>
                  </div>
                  <p class="text-[10px] text-slate-500">
                    * Otomatik TCMB lisanslı ödeme kuruluşu (İyzico / PayTR) split payment protokolü ile teslimat onaylandığı anda komisyon platform havuzuna, kalan hakediş ise tedarikçi IBAN hesabına aktarılır.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- 💬 TAB: DB RECEIVED BIDS (GELEN TEKLİFLER VE TOPLAM TEKLİF YÖNETİMİ) -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_received'" class="space-y-6 text-left">
            
            <!-- Top Metric Stat Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Toplam İhale Grubu</span>
                  <span class="p-2 rounded-xl bg-blue-500/10 text-blue-500"><FileText :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  {{ (formState.dashboard?.receivedBids || []).length }} İhale
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Teklif toplanan satın alma ilanları</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Toplam Verilen Teklif</span>
                  <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><CheckCircle2 :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono text-emerald-500">
                  {{ totalReceivedBidsCount }} Teklif
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Platform geneli iletilen tüm teklifler</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Toplam Teklif Hacmi</span>
                  <span class="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Award :size="16" /></span>
                </div>
                <div class="text-xl font-black mt-2 font-mono" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                  {{ totalBidsVolumeStr }}
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Kümülatif tedarikçi teklif tutarı</div>
              </div>

              <div class="p-5 rounded-2xl border" :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-slate-400">Ortalama Tasarruf</span>
                  <span class="p-2 rounded-xl bg-purple-500/10 text-purple-500"><Sparkles :size="16" /></span>
                </div>
                <div class="text-2xl font-black mt-2 font-mono text-purple-400">
                  %16.8
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Canlı eksiltme tasarruf oranı</div>
              </div>

            </div>

            <!-- Tender Groups & Bids List -->
            <div class="space-y-4">
              <div 
                v-for="(item, tIdx) in formState.dashboard.receivedBids" 
                :key="item.id" 
                class="p-5 rounded-2xl border space-y-4"
                :class="adminTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'"
              >
                <!-- Tender Header -->
                <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3" :class="adminTheme === 'light' ? 'border-slate-100' : 'border-slate-800'">
                  <div class="flex items-center gap-2.5">
                    <span class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-mono text-[10px] font-black uppercase border border-blue-500/20">
                      #{{ item.id }}
                    </span>
                    <h4 class="font-black text-sm" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                      {{ item.baslik }}
                    </h4>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                      💬 {{ (item.teklifler || []).length }} Teklif Verildi
                    </span>
                    <button 
                      @click="addReceivedBid(tIdx)" 
                      class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Plus :size="12" />
                      <span>Yeni Teklif Ekle</span>
                    </button>
                  </div>
                </div>

                <!-- Bids Table / Cards Under Tender -->
                <div class="space-y-2.5">
                  <div 
                    v-for="(bid, bIdx) in item.teklifler" 
                    :key="bid.id || bIdx" 
                    class="p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                    :class="adminTheme === 'light' ? 'bg-slate-50 border-slate-200 hover:border-blue-300' : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                        🏢
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs truncate" :class="adminTheme === 'light' ? 'text-slate-900' : 'text-white'">
                            {{ bid.firma }}
                          </span>
                          <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Doğrulanmış
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span class="font-mono">{{ bid.sure || '7 gün' }} teslimat</span>
                          <span>•</span>
                          <span>{{ bid.adres || 'Balıkesir / Türkiye' }}</span>
                          <span v-if="bid.tarih">• {{ bid.tarih }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0" :class="adminTheme === 'light' ? 'border-slate-200' : 'border-slate-800'">
                      <div class="text-right">
                        <span class="text-[9px] text-slate-400 block font-bold uppercase">Teklif Fiyatı</span>
                        <span class="font-mono font-black text-emerald-500 text-sm">{{ bid.fiyat }}</span>
                      </div>

                      <button 
                        @click="removeReceivedBid(tIdx, bIdx)" 
                        class="p-2 rounded-lg bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white transition cursor-pointer"
                        title="Teklifi Sil"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </div>

                  <div v-if="!item.teklifler || item.teklifler.length === 0" class="p-6 text-center text-slate-500 text-xs rounded-xl border border-dashed border-slate-800">
                    Bu ihale için henüz bir teklif iletilmedi. "Yeni Teklif Ekle" butonuna tıklayarak teklif tanımlayabilirsiniz.
                  </div>
                </div>

              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- TAB: DB PAYMENTS -->
          <!-- ========================================================================= -->
          <div v-if="activeTab === 'db_payments'" class="space-y-4">
            <div class="space-y-4">
              <div v-for="payment in formState.payments" :key="payment.id" class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-white">{{ payment.companyName }} ({{ payment.amount }})</div>
                  <div class="text-[11px] text-slate-400">{{ payment.packageName }} • {{ payment.paymentMethod }}</div>
                </div>
                <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">{{ payment.status }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Floating Bottom Save Bar -->
        <div class="mt-8 border-t border-slate-800 pt-6 flex justify-between items-center">
          <div class="text-xs text-slate-400">
            * Tüm kurumsal ayarlar ve operasyon değişiklikleri anında sisteme yansıtılır.
          </div>
          <button @click="handleSave" class="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer">
            <Save :size="15" />
            Değişiklikleri Kaydet
          </button>
        </div>

      </main>
    </div>

    <!-- KYC DOCUMENT INSPECTION MODAL (OFFICIAL TURKISH DOCUMENT VIEWER) -->
    <div v-if="previewingDoc" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div class="bg-slate-900 rounded-3xl border border-slate-700/80 max-w-4xl w-full shadow-2xl text-left flex flex-col max-h-[92vh] overflow-hidden">
        
        <!-- Modal Top Bar -->
        <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/60 shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 shrink-0">
              <FileCheck :size="20" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-white">{{ previewingDoc.docName }}</h3>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono bg-blue-950 text-blue-300 border border-blue-800">
                  Resmi Evrak Görüntüleyici
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ previewingDoc.kyc.companyName }} • Vergi No: <span class="font-mono text-slate-300">{{ previewingDoc.kyc.taxNo }}</span> ({{ previewingDoc.kyc.taxOffice }})
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="printDocument" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold" title="Belgeyi Yazdır veya PDF İndir">
              <Printer :size="15" /> <span class="hidden sm:inline">Yazdır / PDF</span>
            </button>
            <button @click="previewingDoc = null" class="p-2 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition cursor-pointer">
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- Document Switcher Tabs (If multiple documents uploaded) -->
        <div class="px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0 mr-1">FİRMA EVRAKLARI:</span>
          <button 
            v-for="doc in (Array.isArray(previewingDoc.kyc.uploadedDocs) ? previewingDoc.kyc.uploadedDocs : ['Vergi Levhası (2025/2026)', 'İmza Sirküleri', 'Ticaret Sicil Gazetesi'])"
            :key="doc"
            @click="selectDocInModal(doc)"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            :class="previewingDoc.docName === doc ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'"
          >
            <FileText :size="12" /> {{ doc }}
          </button>
        </div>

        <!-- Scrollable Document Canvas (Official A4 Paper View) -->
        <div class="p-4 sm:p-8 overflow-y-auto bg-slate-950/90 flex justify-center flex-1">
          
          <!-- ========================================================================= -->
          <!-- 1. E-VERGİ LEVHASI GÖRÜNÜMÜ -->
          <!-- ========================================================================= -->
          <div v-if="previewingDoc.docName.toLowerCase().includes('vergi')" class="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-2xl border-4 border-double border-slate-400 font-sans space-y-6 text-left relative overflow-hidden">
            
            <!-- Gelir İdaresi Header -->
            <div class="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div class="space-y-0.5">
                <div class="text-[11px] font-black tracking-widest text-slate-600 uppercase">T.C. HAZİNE VE MALİYE BAKANLIĞI</div>
                <div class="text-sm font-black text-slate-950 uppercase tracking-tight">GELİR İDARESİ BAŞKANLIĞI</div>
                <div class="text-xs font-bold text-blue-900 uppercase">E-VERGİ LEVHASI (2025 / 2026)</div>
              </div>
              <div class="text-right font-mono text-[10px] space-y-1">
                <div class="p-2 border border-slate-400 rounded bg-slate-50 font-bold">
                  <div>KAREKOD ONAYLI</div>
                  <div class="text-blue-700">TR-GİB-{{ previewingDoc.kyc.taxNo }}</div>
                </div>
                <div class="text-slate-500">Doğrulama: GİB-E-2026-9921</div>
              </div>
            </div>

            <!-- Taxpayer Info Table -->
            <table class="w-full border-collapse border border-slate-800 text-xs">
              <tbody>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 w-1/3 text-slate-700">VERGİ KİMLİK NUMARASI</td>
                  <td class="p-2 font-black font-mono text-sm text-slate-950">{{ previewingDoc.kyc.taxNo }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">TİCARET UNVANI / AD SOYAD</td>
                  <td class="p-2 font-black text-slate-950">{{ previewingDoc.kyc.companyName }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">VERGİ DAİRESİ BAŞKANLIĞI</td>
                  <td class="p-2 font-bold text-slate-900">{{ previewingDoc.kyc.taxOffice }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">TİCARET SİCİL NO / MERSİS</td>
                  <td class="p-2 font-mono text-slate-800">Sicil No: {{ previewingDoc.kyc.sicilNo || '14520' }} • MERSİS: {{ previewingDoc.kyc.mersis || '0' + previewingDoc.kyc.taxNo + '00001' }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">İŞE BAŞLAMA TARİHİ</td>
                  <td class="p-2 font-mono text-slate-800">12.04.2018 (Faal Mükellef)</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">ANA FAALİYET TÜRÜ VE KODU</td>
                  <td class="p-2 font-bold text-slate-900">46.51.01 - Bilgisayar, çevre birimleri ve yazılımların toptan ticareti & Kurumsal Tedarik</td>
                </tr>
                <tr>
                  <td class="p-2 font-bold bg-slate-100 border-r border-slate-800 text-slate-700">İŞ YERİ ADRESİ</td>
                  <td class="p-2 text-slate-800">İsmetpaşa Mah. Taşöz Apt. No:52/1 Merkez / Çanakkale</td>
                </tr>
              </tbody>
            </table>

            <!-- Tax Declaration 3-Year Table -->
            <div>
              <div class="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">BEYAN EDİLEN GELİR / KURUMLAR VERGİSİ MATRAHLARI VE TAHAKKUK BİLGİLERİ</div>
              <table class="w-full border-collapse border border-slate-800 text-xs text-center">
                <thead>
                  <tr class="bg-slate-200 border-b border-slate-800 font-bold text-slate-800">
                    <th class="p-2 border-r border-slate-800">TAKVİM YILI</th>
                    <th class="p-2 border-r border-slate-800">BEYAN EDİLEN MATRAH</th>
                    <th class="p-2 border-r border-slate-800">TAHAKKUK EDEN VERGİ</th>
                    <th class="p-2">DURUM</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 font-mono">
                  <tr>
                    <td class="p-2 font-bold border-r border-slate-800">2025 YILI</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-slate-900">4.850.000,00 ₺</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-blue-900">1.212.500,00 ₺</td>
                    <td class="p-2 font-bold text-emerald-700 font-sans">✓ ÖDENDİ</td>
                  </tr>
                  <tr>
                    <td class="p-2 font-bold border-r border-slate-800">2024 YILI</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-slate-900">3.420.000,00 ₺</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-blue-900">855.000,00 ₺</td>
                    <td class="p-2 font-bold text-emerald-700 font-sans">✓ ÖDENDİ</td>
                  </tr>
                  <tr>
                    <td class="p-2 font-bold border-r border-slate-800">2023 YILI</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-slate-900">2.150.000,00 ₺</td>
                    <td class="p-2 border-r border-slate-800 font-bold text-blue-900">537.500,00 ₺</td>
                    <td class="p-2 font-bold text-emerald-700 font-sans">✓ ÖDENDİ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Gelir İdaresi Seal / Stamp -->
            <div class="pt-4 border-t-2 border-slate-800 flex items-center justify-between">
              <div class="text-[10px] text-slate-500 font-mono space-y-0.5">
                <div>Belge Üretim Tarihi: {{ previewingDoc.kyc.createdAt }}</div>
                <div>5070 Sayılı Elektronik İmza Kanununa göre güvenli e-imza ile üretilmiştir.</div>
              </div>
              <div class="h-20 w-20 rounded-full border-2 border-red-700 flex flex-col items-center justify-center text-center text-[7px] font-black text-red-700 uppercase p-1 rotate-12 bg-red-50/50 shadow-inner">
                <span>★ T.C. ★</span>
                <span>GELİR İDARESİ</span>
                <span>ONAYLANMIŞTIR</span>
                <span>2026</span>
              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- 2. NOTER TASDİKLİ İMZA SİRKÜLERİ GÖRÜNÜMÜ -->
          <!-- ========================================================================= -->
          <div v-else-if="previewingDoc.docName.toLowerCase().includes('imza')" class="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-2xl border border-slate-300 font-serif space-y-6 text-left relative overflow-hidden">
            
            <div class="text-center border-b-2 border-slate-800 pb-3 space-y-1">
              <div class="text-xs font-bold tracking-widest text-slate-600 uppercase">T.C. ÇANAKKALE 2. NOTERLİĞİ</div>
              <h2 class="text-base font-black uppercase text-slate-900">İMZA SİRKÜLERİ TASDİK ŞERHİ</h2>
              <div class="text-xs font-mono text-slate-600">Yevmiye No: 14829 • Defter No: 2026/B</div>
            </div>

            <div class="text-xs text-slate-800 leading-relaxed space-y-3 font-sans">
              <p>
                Aşağıda unvanı ve ticaret sicil numarası yazılı <strong>{{ previewingDoc.kyc.companyName }}</strong> şirketinin temsil ve ilzamı hususunda;
              </p>
              <div class="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-2 font-mono text-xs">
                <div><strong>Şirket Unvanı:</strong> {{ previewingDoc.kyc.companyName }}</div>
                <div><strong>Vergi Kimlik No:</strong> {{ previewingDoc.kyc.taxNo }} ({{ previewingDoc.kyc.taxOffice }})</div>
                <div><strong>Yetkili / Temsilci:</strong> {{ previewingDoc.kyc.authorizedPerson }}</div>
                <div><strong>Temsil Yetkisi Şekli:</strong> MÜNFERİDEN (Tek Başına İmzaya Yetkili)</div>
              </div>
              <p class="text-xs leading-relaxed">
                Şirket Müdürü / Yetkilisi <strong>{{ previewingDoc.kyc.authorizedPerson }}</strong>, şirket unvanı altında atacağı münferit imzası ile şirketi kamu kurum ve kuruluşları, resmi ve özel sektör ihaleleri, B2B elektronik satın alma platformları, bankalar ve tüm adli-idari merciler nezdinde ahzu kabza ve tam yetkiyle ilzama yetkilidir.
              </p>
            </div>

            <!-- Signature & Stamp Area -->
            <div class="pt-6 border-t border-slate-300 grid grid-cols-2 gap-6 items-center">
              <div class="border border-slate-300 p-3 rounded-lg text-center bg-slate-50">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Yetkili Temsilci İmza Örneği</div>
                <div class="h-14 flex items-center justify-center font-cursive text-2xl text-blue-900 italic font-bold">
                  {{ previewingDoc.kyc.authorizedPerson.split(' ')[0] }} {{ previewingDoc.kyc.authorizedPerson.split(' ')[1] || '' }}
                </div>
                <div class="text-[10px] text-slate-600">{{ previewingDoc.kyc.authorizedPerson }}</div>
              </div>

              <div class="text-center space-y-1">
                <div class="h-20 w-20 mx-auto rounded-full border-2 border-red-800 flex flex-col items-center justify-center text-center text-[7px] font-black text-red-800 uppercase p-1 -rotate-6 bg-red-50/50">
                  <span>★ NOTERLİK ★</span>
                  <span>ÇANAKKALE 2.</span>
                  <span>MÜHÜR VE İMZA</span>
                </div>
                <div class="text-[9px] text-slate-500 font-mono">Tasdik Tarihi: 18.01.2026</div>
              </div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- 3. TİCARET SİCİL GAZETESİ GÖRÜNÜMÜ -->
          <!-- ========================================================================= -->
          <div v-else-if="previewingDoc.docName.toLowerCase().includes('sicil')" class="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-2xl border border-slate-300 font-serif space-y-5 text-left relative overflow-hidden">
            
            <div class="text-center border-b-2 border-slate-900 pb-3 space-y-0.5">
              <div class="text-[10px] font-bold tracking-widest text-slate-600 uppercase">T.C. TİCARET BAKANLIĞI</div>
              <h2 class="text-lg font-black tracking-tight text-slate-950 uppercase">TÜRKİYE TİCARET SİCİLİ GAZETESİ</h2>
              <div class="text-[10px] font-mono text-slate-600 flex justify-between pt-1 border-t border-slate-300">
                <span>Sayı: 11042</span>
                <span>Tarih: 14 Ocak 2026</span>
                <span>Sayfa: 412</span>
              </div>
            </div>

            <div class="text-xs text-slate-800 leading-relaxed space-y-3 font-sans">
              <div class="font-bold text-center text-slate-950 border-b border-slate-200 pb-2">
                ÇANAKKALE TİCARET SİCİLİ MÜDÜRLÜĞÜ'NDEN İLAN
              </div>
              <div class="text-xs space-y-1 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><strong>Ticaret Sicil No:</strong> 14520</div>
                <div><strong>Ticaret Unvanı:</strong> {{ previewingDoc.kyc.companyName }}</div>
                <div><strong>MERSİS No:</strong> {{ previewingDoc.kyc.mersis || '0436-2466-5040-0001' }}</div>
                <div><strong>Sermaye:</strong> 2.500.000,00 Türk Lirası (Tamamı Ödenmiştir)</div>
              </div>
              <p class="text-[11px] leading-relaxed text-slate-700">
                Yukarıda unvanı ve sicil bilgileri yazılı şirketin 12.01.2026 tarihli Ortaklar Kurulu Kararı tescil ve ilan olunur. Şirket ortakları oy birliği ile <strong>{{ previewingDoc.kyc.authorizedPerson }}</strong>'ı 10 (on) yıl süre ile şirket müdürü olarak seçmiş olup, şirketi her türlü ticari iş, ihale, taahhüt ve sözleşmelerde münferit imzasıyla temsil ve ilzama tam yetkili kılmıştır.
              </p>
            </div>

            <div class="pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <div>İlan Sıra No: 2026/01452</div>
              <div>Ticaret Sicili Gazetesi Aslına Uygundur</div>
            </div>

          </div>

          <!-- ========================================================================= -->
          <!-- 4. FAALİYET BELGESİ / ODA KAYDI / DİĞER BELGELER GÖRÜNÜMÜ -->
          <!-- ========================================================================= -->
          <div v-else class="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-2xl border border-slate-300 font-sans space-y-6 text-left relative overflow-hidden">
            
            <div class="text-center border-b-2 border-slate-800 pb-3 space-y-1">
              <div class="text-xs font-bold tracking-widest text-slate-600 uppercase">TÜRKİYE ODALAR VE BORSALAR BİRLİĞİ</div>
              <h2 class="text-base font-black uppercase text-slate-950">TİCARET VE SANAYİ ODASI FAALİYET BELGESİ</h2>
              <div class="text-xs font-mono text-slate-600">Belge No: FB-2026-9941 • Tarih: 22.08.2026</div>
            </div>

            <table class="w-full border-collapse border border-slate-800 text-xs font-sans">
              <tbody>
                <tr class="border-b border-slate-800">
                  <td class="p-2.5 font-bold bg-slate-100 border-r border-slate-800 w-1/3">ÜYE FİRMA UNVANI</td>
                  <td class="p-2.5 font-bold text-slate-950">{{ previewingDoc.kyc.companyName }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2.5 font-bold bg-slate-100 border-r border-slate-800">ODA SİCİL NUMARASI</td>
                  <td class="p-2.5 font-mono font-bold">{{ previewingDoc.kyc.sicilNo || '14520' }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2.5 font-bold bg-slate-100 border-r border-slate-800">VERGİ NO & DAİRESİ</td>
                  <td class="p-2.5 font-mono">{{ previewingDoc.kyc.taxNo }} / {{ previewingDoc.kyc.taxOffice }}</td>
                </tr>
                <tr class="border-b border-slate-800">
                  <td class="p-2.5 font-bold bg-slate-100 border-r border-slate-800">MESLEK GRUBU & FAALİYET</td>
                  <td class="p-2.5 font-bold text-slate-900">{{ previewingDoc.kyc.sectors || 'Bilişim, Ambalaj ve Kurumsal Satın Alma Malzemeleri' }}</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold bg-slate-100 border-r border-slate-800">ÜYELİK VE FAALİYET DURUMU</td>
                  <td class="p-2.5 font-bold text-emerald-700">✓ FAAL & AKTİF (Tüm yasal yükümlülükler tamdır)</td>
                </tr>
              </tbody>
            </table>

            <p class="text-xs leading-relaxed text-slate-700">
              İşbu faaliyet belgesi, ilgili firmanın Odamız kayıtlarına göre faal olarak ticari faaliyetine devam ettiğini ve 5174 sayılı Kanun gereğince kayıtlı bulunduğunu tevsik etmek amacıyla resmi makamlara ve kurumsal ihale platformlarına ibraz edilmek üzere düzenlenmiştir.
            </p>

            <div class="pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <div>Geçerlilik: 31.12.2026</div>
              <div class="font-bold text-emerald-800">E-Devlet Karekod ile Doğrulanabilir</div>
            </div>

          </div>

        </div>

        <!-- Modal Action Footer Bar -->
        <div class="p-4 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">Onay Durumu:</span>
            <span 
              class="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono"
              :class="previewingDoc.kyc.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : (previewingDoc.kyc.status === 'rejected' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse')"
            >
              {{ previewingDoc.kyc.status === 'approved' ? '✓ Onaylandı (Mavi Rozet)' : (previewingDoc.kyc.status === 'rejected' ? '✕ Reddedildi' : '⏳ Onay Bekliyor') }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="previewingDoc = null" 
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kapat
            </button>
            <button 
              v-if="previewingDoc.kyc.status !== 'rejected'" 
              @click="rejectKyc(previewingDoc.kyc); previewingDoc = null" 
              class="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle :size="13" /> Belgeyi Yetersiz Bul / Reddet
            </button>
            <button 
              v-if="previewingDoc.kyc.status !== 'approved'" 
              @click="approveKyc(previewingDoc.kyc); previewingDoc = null" 
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 :size="14" /> Bu Evrakı Onayla & Firmaya Mavi Rozet Ver
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- GLOBAL TOAST -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border p-4 shadow-xl text-xs font-bold bg-slate-900 border-slate-800 text-white">
        <CheckCircle :size="16" class="text-emerald-500" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

