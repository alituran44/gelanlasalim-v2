import fs from 'node:fs'
import path from 'node:path'

export interface TenderQuestionItem {
  id: string
  tenderId: string
  tenderTitle: string
  askerEmail: string
  askerCompanyName: string
  isAnonymous: boolean // 🛡️ COM-005: Soru sahibi firma adı anonim tutulabilir
  type: 'GENEL' | 'OZEL' // 🛡️ COM-005: Genel soru veya firma özel soru
  question: string
  askedAt: string
  answer: string | null
  answeredAt: string | null
  answeredBy: string | null
  isPublicAnnouncement: boolean // 🛡️ COM-006: Cevabın genel duyuruya (Zeyilname) dönüştürülmesi
  status: 'BEKLIYOR' | 'CEVAPLANDI' | 'REDDEDILDI'
}

let inMemoryQuestions: TenderQuestionItem[] | null = null

const BACKUP_FILE = path.resolve(process.cwd(), '.tender_questions.json')
const TMP_FILE = '/tmp/ihaleciburada_tender_questions.json'

function getStoragePath(): string {
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (fs.existsSync(tmpDir)) return TMP_FILE
  } catch {}
  return BACKUP_FILE
}

function readFromDisk(): TenderQuestionItem[] {
  const filePath = getStoragePath()
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('[Tender Questions Store] Read error:', e)
  }
  return []
}

function writeToDisk(items: TenderQuestionItem[]) {
  const filePath = getStoragePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(items.slice(0, 1000), null, 2), 'utf-8')
  } catch (e) {
    console.warn('[Tender Questions Store] Write error:', e)
  }
}

export function getAllTenderQuestions(): TenderQuestionItem[] {
  if (!inMemoryQuestions) {
    inMemoryQuestions = readFromDisk()
    if (inMemoryQuestions.length === 0) {
      // Seed default demo questions
      inMemoryQuestions = [
        {
          id: 'QST-2026-101',
          tenderId: 'IHC-2026-001',
          tenderTitle: 'İstanbul Anadolu Yakası Lojistik ve Taşımacılık Hizmeti',
          askerEmail: 'tedarik@lojistik.com',
          askerCompanyName: 'Marmara Nakliyat A.Ş.',
          isAnonymous: true,
          type: 'GENEL',
          question: 'Şartnamede belirtilen araçların Euro 6 motor standardına sahip olması zorunlu mudur?',
          askedAt: new Date(Date.now() - 86400000).toISOString(),
          answer: 'Evet, çevre standartları gereği tüm çekici filosu Euro 6 normunda olmalıdır.',
          answeredAt: new Date(Date.now() - 43200000).toISOString(),
          answeredBy: 'Hasan Hüseyin Yıldırım (Satın Alma Md.)',
          isPublicAnnouncement: true, // 🛡️ COM-006: Genel zeyilname
          status: 'CEVAPLANDI'
        }
      ]
      writeToDisk(inMemoryQuestions)
    }
  }
  return inMemoryQuestions
}

export function getQuestionsForTender(
  tenderId: string,
  requesterEmail?: string,
  isOwner?: boolean
): TenderQuestionItem[] {
  const all = getAllTenderQuestions().filter(q => q.tenderId === tenderId)
  const cleanEmail = (requesterEmail || '').trim().toLowerCase()

  // 🛡️ COM-005: Görünürlük kuralları
  return all.map(q => {
    const isMyQuestion = Boolean(cleanEmail && q.askerEmail.toLowerCase() === cleanEmail)
    const canSee = q.type === 'GENEL' || q.isPublicAnnouncement || isMyQuestion || isOwner

    if (!canSee) {
      return null // Hidden private question
    }

    const copy = { ...q }
    // Mask company name if anonymous and requester is not the buyer/owner or asker
    if (q.isAnonymous && !isOwner && !isMyQuestion) {
      copy.askerCompanyName = 'Onaylı Tedarikçi (Anonim Katılımcı)'
      copy.askerEmail = '***'
    }
    return copy
  }).filter(Boolean) as TenderQuestionItem[]
}

export function addTenderQuestion(data: {
  tenderId: string
  tenderTitle: string
  askerEmail: string
  askerCompanyName: string
  isAnonymous?: boolean
  type?: 'GENEL' | 'OZEL'
  question: string
}): TenderQuestionItem {
  const list = getAllTenderQuestions()
  const id = `QST-2026-${Math.floor(1000 + Math.random() * 9000)}`

  const item: TenderQuestionItem = {
    id,
    tenderId: data.tenderId,
    tenderTitle: data.tenderTitle,
    askerEmail: data.askerEmail.toLowerCase().trim(),
    askerCompanyName: data.askerCompanyName || 'Katılımcı Tedarikçi',
    isAnonymous: Boolean(data.isAnonymous),
    type: data.type || 'GENEL',
    question: data.question.trim(),
    askedAt: new Date().toISOString(),
    answer: null,
    answeredAt: null,
    answeredBy: null,
    isPublicAnnouncement: false,
    status: 'BEKLIYOR'
  }

  list.unshift(item)
  writeToDisk(list)
  return item
}

/**
 * 🛡️ COM-006: Sorunun Cevaplanması ve İsteğe Bağlı Genel Zeyilnameye Dönüştürülmesi
 */
export function answerTenderQuestion(
  questionId: string,
  data: {
    answer: string
    answeredBy: string
    isPublicAnnouncement?: boolean
  }
): TenderQuestionItem | null {
  const list = getAllTenderQuestions()
  const target = list.find(q => q.id === questionId)

  if (!target) return null

  target.answer = data.answer.trim()
  target.answeredAt = new Date().toISOString()
  target.answeredBy = data.answeredBy || 'İhale Sahibi'
  target.status = 'CEVAPLANDI'
  target.isPublicAnnouncement = Boolean(data.isPublicAnnouncement)

  writeToDisk(list)
  return target
}
