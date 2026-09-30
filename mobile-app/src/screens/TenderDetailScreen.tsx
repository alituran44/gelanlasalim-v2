import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  Modal,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, isReklamIlani, getDigerCustomBadge, formatExternalUrl } from '../constants/taxonomy'
import { apiService } from '../services/api'
import {
  Phone,
  Globe,
  Share2,
  ChevronLeft,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  X
} from 'lucide-react-native'

const { width } = Dimensions.get('window')

export const TenderDetailScreen = ({ route, navigation }: any) => {
  const { tender } = route.params
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [bidModalVisible, setBidModalVisible] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidderCompany, setBidderCompany] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [currentTender, setCurrentTender] = useState(tender)

  const isReklam = isReklamIlani(currentTender)
  const customBadge = getDigerCustomBadge(currentTender)
  const images = currentTender.images || (currentTender.image ? [currentTender.image] : [])
  const websiteUrl = formatExternalUrl(currentTender.websiteUrl)

  const handleOpenWebsite = async () => {
    if (!websiteUrl) {
      Alert.alert('Bilgi', 'Bu ilan için tanımlı bir web sayfası bulunamadı.')
      return
    }
    try {
      const supported = await Linking.canOpenURL(websiteUrl)
      if (supported) {
        await Linking.openURL(websiteUrl)
      } else {
        Alert.alert('Hata', 'Web bağlantısı açılamadı: ' + websiteUrl)
      }
    } catch {
      Alert.alert('Hata', 'Bağlantı açılırken sorun oluştu.')
    }
  }

  const handleCallOwner = () => {
    const phone = currentTender.ownerPhone || '+905551234567'
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {
      Alert.alert('Telefon', phone)
    })
  }

  const handleSendBid = async () => {
    if (!bidAmount.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen bir teklif tutarı girin.')
      return
    }

    setSubmittingBid(true)
    try {
      await apiService.submitBid(
        currentTender.id,
        `${bidAmount.trim()} ₺`,
        bidderCompany.trim() || 'Şirketim A.Ş.'
      )
      setCurrentTender((prev: any) => ({
        ...prev,
        teklifSayisi: (prev.teklifSayisi || 0) + 1
      }))
      setBidModalVisible(false)
      setBidAmount('')
      Alert.alert('Başarılı! 🎉', 'Teklifiniz ihale sahibine başarıyla iletildi.')
    } catch {
      Alert.alert('Hata', 'Teklif iletilirken bir sorun oluştu.')
    } finally {
      setSubmittingBid(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          İlan No: #{currentTender.id.replace('tender-', '')}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={() => Alert.alert('Paylaş', currentTender.baslik)}>
          <Share2 size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Swipeable Photo Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width)
              setActivePhotoIndex(slide)
            }}
            scrollEventThrottle={16}
          >
            {images.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} style={styles.galleryImage} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Badges Over Image */}
          <View style={styles.imageOverlayTop}>
            {isReklam && (
              <View style={styles.reklamBadge}>
                <Text style={styles.reklamBadgeText}>📢 Reklam İlanı</Text>
              </View>
            )}
            {customBadge && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>✨ {customBadge}</Text>
              </View>
            )}
          </View>

          {/* Photo Counter */}
          {images.length > 1 && (
            <View style={styles.photoCounter}>
              <Text style={styles.photoCounterText}>
                📷 {activePhotoIndex + 1}/{images.length}
              </Text>
            </View>
          )}
        </View>

        {/* Main Info Header */}
        <View style={styles.infoCard}>
          {/* Price Box */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Bütçe / Fiyat</Text>
              <Text style={styles.priceValue}>{currentTender.butce || 'Teklif Usulü'}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{currentTender.sure || 'Aktif İhale'}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{currentTender.baslik}</Text>

          {/* Category breadcrumb */}
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbText}>
              {currentTender.kategori} {currentTender.subCategory ? `› ${currentTender.subCategory}` : ''}
            </Text>
          </View>

          {/* Key Quick Badges */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.quickStatText}>{currentTender.teklifSayisi || 0} Teklif</Text>
            </View>
            <View style={styles.quickStat}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.quickStatText}>İlan: {currentTender.olusturma || 'Yeni'}</Text>
            </View>
            <View style={styles.quickStat}>
              <Building size={14} color="#64748B" />
              <Text style={styles.quickStatText}>{currentTender.city || 'Türkiye'}</Text>
            </View>
          </View>

          {/* Web Site Link Button (Hasan Yıldırım Rule) */}
          {websiteUrl ? (
            <TouchableOpacity
              style={styles.websiteBtn}
              onPress={handleOpenWebsite}
              activeOpacity={0.85}
            >
              <Globe size={18} color="#0052FF" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.websiteBtnTitle}>Web Sitesini İncele</Text>
                <Text style={styles.websiteBtnUrl} numberOfLines={1}>{websiteUrl}</Text>
              </View>
              <Text style={styles.websiteBtnAction}>Aç ›</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Sahibinden-Style Specs Table */}
        <View style={styles.specsCard}>
          <Text style={styles.sectionHeading}>📋 İlan & Şartname Detayları</Text>
          
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>İhale / İlan No</Text>
            <Text style={styles.specValue}>#{currentTender.id}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>İhale Yönü</Text>
            <Text style={styles.specValue}>{currentTender.ihaleYonu?.toUpperCase() || 'AÇIK İHALE'}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Konum / Şehir</Text>
            <Text style={styles.specValue}>{currentTender.city || 'Tümü'}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Teslimat Yeri</Text>
            <Text style={styles.specValue}>{currentTender.teslimatAdresi || 'Belirtilmedi'}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Ödeme Yöntemi</Text>
            <Text style={styles.specValue}>{currentTender.odemeYontemi || 'Anlaşmalı / Teminat'}</Text>
          </View>

          {currentTender.customFields?.metrekare && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Metrekare</Text>
              <Text style={styles.specValue}>{currentTender.customFields.metrekare}</Text>
            </View>
          )}

          {currentTender.customFields?.adaParsel && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Ada / Parsel</Text>
              <Text style={styles.specValue}>{currentTender.customFields.adaParsel}</Text>
            </View>
          )}

          {currentTender.customFields?.imarDurumu && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>İmar Durumu</Text>
              <Text style={styles.specValue}>{currentTender.customFields.imarDurumu}</Text>
            </View>
          )}

          {currentTender.customFields?.odaSayisi && (
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Oda Sayısı</Text>
              <Text style={styles.specValue}>{currentTender.customFields.odaSayisi}</Text>
            </View>
          )}
        </View>

        {/* Detailed Description */}
        <View style={styles.specsCard}>
          <Text style={styles.sectionHeading}>📄 Detaylı Açıklama</Text>
          <Text style={styles.descText}>{currentTender.aciklama}</Text>
        </View>

        {/* Owner & Trust Card */}
        <View style={styles.specsCard}>
          <Text style={styles.sectionHeading}>🏢 İlan Sahibi / Kurum</Text>
          <View style={styles.ownerHeader}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>
                {(currentTender.ownerCompany || 'İ')[0].toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.ownerName} numberOfLines={1}>
                  {currentTender.ownerCompany || 'Kurumsal Üye'}
                </Text>
                <CheckCircle size={14} color="#059669" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.ownerTrust}>Doğrulanmış Kurumsal Profil</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCallOwner}
          activeOpacity={0.8}
        >
          <Phone size={18} color="#0F172A" />
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bidButton}
          onPress={() => setBidModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.bidButtonText}>💰 Hemen Teklif Ver</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Submitting a Bid */}
      <Modal visible={bidModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İhaleye Teklif Ver</Text>
              <TouchableOpacity onPress={() => setBidModalVisible(false)}>
                <X size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle} numberOfLines={2}>
              {currentTender.baslik}
            </Text>

            <Text style={styles.modalInputLabel}>Teklif Ettiğiniz Tutar (₺)</Text>
            <TextInput
              placeholder="Örn: 42.000.000 ₺"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
            />

            <Text style={styles.modalInputLabel}>Firma veya Teklif Sahibi Ünvanı</Text>
            <TextInput
              placeholder="Örn: Anadolu Yatırım Ltd."
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              value={bidderCompany}
              onChangeText={setBidderCompany}
            />

            <TouchableOpacity
              style={[styles.sendBidBtn, submittingBid && { opacity: 0.7 }]}
              onPress={handleSendBid}
              disabled={submittingBid}
              activeOpacity={0.88}
            >
              <Text style={styles.sendBidBtnText}>
                {submittingBid ? 'Gönderiliyor...' : 'Teklifi Onayla & Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  navBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  scroll: {
    flex: 1
  },
  galleryContainer: {
    width: width,
    height: 270,
    backgroundColor: '#0F172A',
    position: 'relative'
  },
  galleryImage: {
    width: width,
    height: 270
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2
  },
  reklamBadge: {
    backgroundColor: COLORS.brandOrange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  reklamBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  customBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  customBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  photoCounter: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  photoCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary
  },
  statusPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 8
  },
  breadcrumb: {
    marginBottom: 12
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  quickStatText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600'
  },
  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    borderRadius: 12,
    marginTop: 10
  },
  websiteBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D'
  },
  websiteBtnUrl: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1
  },
  websiteBtnAction: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
    marginLeft: 8
  },
  specsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  specLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  },
  specValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700'
  },
  descText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  ownerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ownerAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  ownerTrust: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 12
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 48,
    gap: 6
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  bidButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48
  },
  bidButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16
  },
  modalInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 14
  },
  sendBidBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6
  },
  sendBidBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  }
})
