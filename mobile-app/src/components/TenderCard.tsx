import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { Tender } from '../types/tender'
import { COLORS, isReklamIlani, getDigerCustomBadge } from '../constants/taxonomy'

interface TenderCardProps {
  tender: Tender
  onPress: () => void
  isGrid?: boolean
}

const { width } = Dimensions.get('window')
const GRID_ITEM_WIDTH = (width - 40) / 2

export const TenderCard: React.FC<TenderCardProps> = ({
  tender,
  onPress,
  isGrid = true
}) => {
  const isReklam = isReklamIlani(tender)
  const customBadge = getDigerCustomBadge(tender)
  const photosCount = tender.images?.length || (tender.image ? 1 : 0)
  const coverImage = tender.images?.[0] || tender.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        isGrid ? { width: GRID_ITEM_WIDTH } : styles.cardFullWidth,
        isReklam && styles.cardReklamBorder
      ]}
    >
      {/* Cover Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coverImage }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Reklam İlanı Badge (Top Left) */}
        {isReklam && (
          <View style={styles.reklamBadge}>
            <Text style={styles.reklamBadgeText}>📢 Reklam İlanı</Text>
          </View>
        )}

        {/* Photo Counter Badge (Bottom Left) */}
        {photosCount > 1 && (
          <View style={styles.photoCountBadge}>
            <Text style={styles.photoCountText}>📷 1/{photosCount}</Text>
          </View>
        )}

        {/* City Badge (Bottom Right) */}
        {tender.city && (
          <View style={styles.cityBadge}>
            <Text style={styles.cityBadgeText}>📍 {tender.city}</Text>
          </View>
        )}
      </View>

      {/* Content Body */}
      <View style={styles.content}>
        {/* Diğer Custom Badge or SubCategory */}
        {customBadge ? (
          <View style={styles.customBadgeContainer}>
            <Text style={styles.customBadgeText} numberOfLines={1}>
              ✨ {customBadge}
            </Text>
          </View>
        ) : tender.subCategory ? (
          <View style={styles.subCategoryContainer}>
            <Text style={styles.subCategoryText} numberOfLines={1}>
              {tender.subCategory}
            </Text>
          </View>
        ) : null}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {tender.baslik}
        </Text>

        {/* Price / Budget */}
        <View style={styles.priceContainer}>
          <Text style={styles.price} numberOfLines={1}>
            {tender.butce || 'Teklif Usulü'}
          </Text>
        </View>

        {/* Footer Meta */}
        <View style={styles.footer}>
          <Text style={styles.teklifCount} numberOfLines={1}>
            {tender.teklifSayisi ? `🔥 ${tender.teklifSayisi} Teklif` : '⏳ İlk Teklifi Ver'}
          </Text>
          <Text style={styles.sure} numberOfLines={1}>
            {tender.sure || 'Aktif'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  cardFullWidth: {
    width: '100%'
  },
  cardReklamBorder: {
    borderColor: '#FDBA74',
    borderWidth: 1.5
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  reklamBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF5938',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2
  },
  reklamBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  cityBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  cityBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },
  content: {
    padding: 10
  },
  customBadgeContainer: {
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4
  },
  customBadgeText: {
    color: '#7E22CE',
    fontSize: 10,
    fontWeight: '700'
  },
  subCategoryContainer: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4
  },
  subCategoryText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '600'
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 6
  },
  priceContainer: {
    marginBottom: 6
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6
  },
  teklifCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669'
  },
  sure: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  }
})
