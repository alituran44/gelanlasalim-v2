export interface Tender {
  id: string
  baslik: string
  kategori: string
  mainCategory?: string
  subCategory?: string
  categoryId?: number
  ihaleYonu?: string
  tur?: string
  rekabetTuru?: string
  sure?: string
  teklifSayisi?: number
  durum?: string
  statusCode?: string
  statusLabel?: string
  butce?: string
  city?: string
  teslimatAdresi?: string
  odemeYontemi?: string
  image?: string
  images?: string[]
  aciklama?: string
  customFields?: Record<string, any>
  websiteUrl?: string
  ownerPhone?: string
  ownerEmail?: string
  ownerCompany?: string
  isMine?: boolean
  olusturma?: string
}

export interface CategoryItem {
  id: number
  name: string
  short: string
  icon: string
  orderRank: number
}

export interface BidItem {
  id: string
  tenderId: string
  tenderTitle: string
  bidderCompany: string
  amount: string
  date: string
  status: 'pending' | 'accepted' | 'rejected'
}
