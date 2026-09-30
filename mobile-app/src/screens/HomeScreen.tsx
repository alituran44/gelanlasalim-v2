import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tender } from '../types/tender'
import { apiService } from '../services/api'
import { CategoryChips } from '../components/CategoryChips'
import { TenderCard } from '../components/TenderCard'
import { COLORS } from '../constants/taxonomy'
import { Search, Bell, SlidersHorizontal, PlusCircle } from 'lucide-react-native'

export const HomeScreen = ({ navigation }: any) => {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const data = await apiService.getTenders({
        categoryId: selectedCategoryId || undefined,
        search: searchQuery
      })
      setTenders(data)
    } catch {
      // handled in service
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedCategoryId, searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Brand Bar */}
      <View style={styles.brandRow}>
        <View>
          <Text style={styles.brandTitle}>İhaleci<Text style={styles.brandHighlight}>Burada</Text></Text>
          <Text style={styles.brandSubtitle}>Türkiye'nin İhale & Fırsat Pazar Yeri</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Bell size={20} color="#0F172A" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Native Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="İlan, ihale, arsa, araç ara..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate('Market')}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Fast-Action Banner */}
      <View style={styles.actionBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionBannerTag}>ÖNE ÇIKAN FIRSAT</Text>
          <Text style={styles.actionBannerTitle}>Kendi İhaleni veya İlanını 2 Dakikada Başlat</Text>
          <Text style={styles.actionBannerDesc}>Komisyonsuz, doğrudan teklif topla veya sat.</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBannerBtn}
          onPress={() => navigation.navigate('CreateTender')}
          activeOpacity={0.85}
        >
          <PlusCircle size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.actionBannerBtnText}>İlan Aç</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Bar */}
      <CategoryChips
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Section Title */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategoryId === 99
            ? '✨ Diğer İhale ve İlanlar'
            : selectedCategoryId === 40
            ? '🏢 Emlak & Gayrimenkul İlanları'
            : 'Vitrin İlanları & İhaleler'}
        </Text>
        <Text style={styles.resultCount}>{tenders.length} İlan</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <FlatList
        data={tenders}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TenderCard
            tender={item}
            isGrid={true}
            onPress={() => navigation.navigate('TenderDetail', { id: item.id, tender: item })}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>İlan Bulunamadı</Text>
              <Text style={styles.emptySubtitle}>Arama kriterlerinize uygun aktif ihale bulunamadı.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 4
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  brandHighlight: {
    color: COLORS.primary
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500'
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandOrange,
    position: 'absolute',
    top: 9,
    right: 9
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionBannerTag: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  actionBannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2
  },
  actionBannerDesc: {
    color: '#94A3B8',
    fontSize: 11
  },
  actionBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10
  },
  actionBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  resultCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: 24
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center'
  }
})
