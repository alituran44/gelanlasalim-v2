import { ref, computed } from 'vue'
import { useCmsData } from './useCmsData'

export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  desc: string
  time: string
  link: string
  to?: string
  category?: 'tender' | 'bid' | 'submitted' | 'kyc' | 'escrow' | 'system'
  read: boolean
  unread: boolean
}

const readNotifIds = ref<string[]>([])
const deletedNotifIds = ref<string[]>([])
const isInitialized = ref(false)

const defaultNotificationSettings = {
  emailBids: true,
  emailTenderUpdates: true,
  emailMessages: true,
  emailDigest: false,
  smsUrgent: true,
  smsVerification: true,
  browserPush: true,
  promotional: false
}

const notificationSettings = ref({ ...defaultNotificationSettings })

function loadFromStorage() {
  if (typeof window === 'undefined') return
  try {
    const rawRead = localStorage.getItem('user_read_notifications')
    if (rawRead) {
      readNotifIds.value = JSON.parse(rawRead)
    }
    const rawDel = localStorage.getItem('user_deleted_notifications')
    if (rawDel) {
      deletedNotifIds.value = JSON.parse(rawDel)
    }
    const rawSettings = localStorage.getItem('user_notification_settings')
    if (rawSettings) {
      notificationSettings.value = { ...defaultNotificationSettings, ...JSON.parse(rawSettings) }
    }
  } catch (e) {
    console.warn('Error reading notification state from storage:', e)
  }
}

function saveToStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('user_read_notifications', JSON.stringify(readNotifIds.value))
    localStorage.setItem('user_deleted_notifications', JSON.stringify(deletedNotifIds.value))
    localStorage.setItem('user_notification_settings', JSON.stringify(notificationSettings.value))
    window.dispatchEvent(new CustomEvent('notifications-updated'))
  } catch (e) {
    console.warn('Error saving notification state to storage:', e)
  }
}

const serverNotifications = ref<any[]>([])

async function fetchServerNotifications() {
  if (typeof window === 'undefined') return
  try {
    let email = 'ihalecib@gmail.com'
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}')
      if (session?.email) email = session.email
    } catch {}
    
    const res: any = await $fetch(`/api/notifications?email=${encodeURIComponent(email)}`)
    if (res?.notifications && Array.isArray(res.notifications)) {
      serverNotifications.value = res.notifications
    }
  } catch (e) {
    // COM-010: Notification network errors do not break application
    console.warn('[Notifications] Server sync skipped:', e)
  }
}

export function useNotifications() {
  const { cmsData } = useCmsData()

  if (typeof window !== 'undefined' && !isInitialized.value) {
    isInitialized.value = true
    loadFromStorage()
    fetchServerNotifications()
    window.addEventListener('storage', loadFromStorage)
    window.addEventListener('notifications-updated', loadFromStorage)
  }

  const notifications = computed<NotificationItem[]>(() => {
    const list: Array<any> = []

    let userSession: any = {}
    let myTenders: any[] = []
    let mySubmitted: any[] = []

    if (typeof window !== 'undefined') {
      try {
        userSession = JSON.parse(localStorage.getItem('userSession') || '{}')
        myTenders = JSON.parse(localStorage.getItem('myTenders') || '[]')
        mySubmitted = JSON.parse(localStorage.getItem('mySubmittedBids') || '[]')
      } catch (e) {}
    }

    const userName = userSession?.name || userSession?.firstName || 'Kullanıcı'
    const isCompany = userSession?.isCompanyActive === true || userSession?.role === 'company'
    const compName = isCompany ? (userSession?.companyName || userSession?.company || 'Kurumsal Firma') : userName

    // 0. Server-Side Notifications (COM-001, COM-003, COM-008, COM-009)
    serverNotifications.value.forEach(sn => {
      const isCritical = sn.category === 'CRITICAL'
      list.push({
        id: sn.id,
        type: isCritical ? 'warning' : 'info',
        title: sn.title,
        desc: sn.message,
        time: sn.createdAt ? new Date(sn.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Bugün',
        link: sn.actionUrl || '/panel/bildirimler',
        to: sn.actionUrl || '/panel/bildirimler',
        category: sn.category,
        isMandatory: sn.isMandatory || isCritical, // COM-003
        channels: sn.channels || ['IN_APP'],
        deliveryStatus: sn.deliveryStatus || 'DELIVERED',
        readAt: sn.readAt,
        serverStored: true
      })
    })

    // 1. Kendi açtığı ihalelere gelen teklif bildirimleri
    const receivedGroups = cmsData.value?.dashboard?.receivedBids || []
    receivedGroups.forEach((group: any) => {
      (group.teklifler || []).forEach((tkf: any, idx: number) => {
        const id = `notif-bid-${tkf.id || idx}-${group.id}`
        list.push({
          id,
          type: 'success',
          title: '🎯 İhalenize Yeni Teklif Geldi',
          desc: `"${group.baslik} (#${group.id})" ihaleniz için ${tkf.firma || 'Tedarikçi'} tarafından ${tkf.fiyat || 'Teklif'} tutarında yeni bir teklif sunuldu.`,
          time: tkf.tarih || 'Bugün',
          link: '/panel/gelen-teklifler',
          to: '/panel/gelen-teklifler',
          category: 'bid',
          isMandatory: false,
          channels: ['IN_APP', 'EMAIL']
        })
      })
    })

    // 2. Kullanıcının verdiği kendi teklif bildirimleri
    mySubmitted.forEach((sb: any) => {
      const id = `notif-sub-${sb.id}`
      list.push({
        id,
        type: 'info',
        title: '⚡ Teklifiniz Başarıyla İletildi',
        desc: `"${sb.tenderTitle || 'Satın Alma İhalesi'}" için ${sb.price || 'Teklifiniz'} alıcı kuruma güvenle ulaştırıldı.`,
        time: sb.submittedAt || 'Bugün',
        link: '/panel/yaptigim-teklifler',
        to: '/panel/yaptigim-teklifler',
        category: 'submitted',
        isMandatory: false,
        channels: ['IN_APP']
      })
    })

    // 3. Kullanıcının oluşturduğu ihalelerin bildirimleri
    myTenders.forEach((tender: any) => {
      const id = `notif-tender-${tender.id}`
      list.push({
        id,
        type: 'info',
        title: '📄 İhale İlanınız Yayında / Onayda',
        desc: `"${tender.baslik} (#${tender.id})" başlıklı satın alma ihaleniz başarıyla oluşturuldu.`,
        time: tender.olusturma || 'Bugün',
        link: '/panel/ilanlarim',
        to: '/panel/ilanlarim',
        category: 'tender',
        isMandatory: false,
        channels: ['IN_APP', 'EMAIL']
      })
    })

    // 4. Sabit Sistem / Güvenlik / Escrow Bildirimleri
    list.push({
      id: 'notif-escrow-active',
      type: 'success',
      title: '🔒 Escrow %4 Güvenli Havuz Koruması Aktif',
      desc: 'Tüm ihaleleriniz ve teklifleriniz BDDK/TCMB lisanslı Güvenli Ödeme Havuzu güvencesi altındadır. Komisyon oranı tüm işlemler için net %4 olarak uygulanır.',
      time: 'Sürekli Aktif',
      link: '/panel/siparis-teslimat',
      to: '/panel/siparis-teslimat',
      category: 'escrow',
      isMandatory: true, // COM-003
      channels: ['IN_APP']
    })

    if (isCompany) {
      list.push({
        id: 'notif-kyc-verified',
        type: 'success',
        title: '🛡️ Kurumsal Kimlik & KYC Durumu',
        desc: `${compName} kurumsal firma hesabınız üzerinden ihalelere teklif verebilir ve kurumsal satın alma ilanları yayınlayabilirsiniz.`,
        time: 'Bu Hafta',
        link: '/panel/ayarlar?tab=sirket',
        to: '/panel/ayarlar?tab=sirket',
        category: 'kyc',
        isMandatory: true,
        channels: ['IN_APP']
      })
    } else {
      list.push({
        id: 'notif-welcome-personal',
        type: 'info',
        title: '👋 Hoş Geldiniz, ' + userName,
        desc: 'Hesabınız kişisel çalışma modunda aktiftir. İhtiyaç halinde sol menüden Firma Modunu dilediğiniz an tek tıkla aktif edebilirsiniz.',
        time: 'Şimdi',
        link: '/panel/ayarlar?tab=kisisel',
        to: '/panel/ayarlar?tab=kisisel',
        category: 'system',
        isMandatory: false,
        channels: ['IN_APP']
      })
    }

    // Filter out deleted notifications (except mandatory ones) and map read/unread status
    return list
      .filter(item => item.isMandatory || !deletedNotifIds.value.includes(item.id))
      .map(item => {
        const isRead = item.readAt ? true : readNotifIds.value.includes(item.id)
        return {
          ...item,
          read: isRead,
          unread: !isRead
        }
      })
  })

  const unreadCount = computed(() => {
    return notifications.value.filter(n => n.unread).length
  })

  async function markAsRead(id: string) {
    if (!readNotifIds.value.includes(id)) {
      readNotifIds.value.push(id)
      saveToStorage()
    }
    try {
      let email = 'ihalecib@gmail.com'
      try {
        const session = JSON.parse(localStorage.getItem('userSession') || '{}')
        if (session?.email) email = session.email
      } catch {}
      await $fetch('/api/notifications/read', {
        method: 'PATCH',
        body: { id, email }
      })
    } catch {}
  }

  async function markAllAsRead() {
    notifications.value.forEach(n => {
      if (!readNotifIds.value.includes(n.id)) {
        readNotifIds.value.push(n.id)
      }
    })
    saveToStorage()
    try {
      let email = 'ihalecib@gmail.com'
      try {
        const session = JSON.parse(localStorage.getItem('userSession') || '{}')
        if (session?.email) email = session.email
      } catch {}
      await $fetch('/api/notifications/read', {
        method: 'PATCH',
        body: { all: true, email }
      })
    } catch {}
  }

  function deleteNotification(id: string) {
    const target = notifications.value.find(n => n.id === id)
    if (target?.isMandatory || target?.category === 'CRITICAL') {
      alert('🛡️ Kural COM-003 Uyarınca:\n\nKritik ihale ve güvenlik bildirimleri sistem kayıt bütünlüğü gereğince tamamen kapatılamaz ve silinemez.')
      return
    }
    if (!deletedNotifIds.value.includes(id)) {
      deletedNotifIds.value.push(id)
      saveToStorage()
    }
  }

  function updateNotificationSettings(newSettings: Partial<typeof defaultNotificationSettings>) {
    notificationSettings.value = { ...notificationSettings.value, ...newSettings }
    saveToStorage()
  }

  return {
    notifications,
    unreadCount,
    readNotifIds,
    deletedNotifIds,
    notificationSettings,
    fetchServerNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateNotificationSettings
  }
}
