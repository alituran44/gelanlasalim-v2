import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tender } from '../types/tender'
import { apiService } from '../services/api'
import { TenderCard } from '../components/TenderCard'
import { ALL_40_CATEGORIES, CITIES, COLORS } from '../constants/taxonomy'
import { Search, MapPin, X, ArrowUpDown, ChevronDown } from 'lucide-react-native'

export const MarketScreen = ({ navigation }: any) => {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedCity, setSelectedCity] = useState('Tümü')
  const [sortBy, setSortBy] = useState<'newest' | 'bids' | 'price'>('newest')
  
  const [cityModalVisible, setCityModalVisible] = useState(false)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      let data = await apiService.getTenders({
        categoryId: selectedCategory || undefined,
        city: selectedCity,
        search: searchQuery
      })

      if (sortBy === 'bids') {
        data.sort((a, b) => (b.teklifSayisi || 0) - (a.teklifSayisi || 0))
      }

      setTenders(data)
    } finally {
      setRefreshing(false)
    }
  }, [selectedCategory, selectedCity, searchQuery, sortBy])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const selectedCategoryObj = ALL_40_CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Tüm ilanlar ve ihalelerde ara..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills Row */}
        <View style={styles.filterRow}>
          {/* Category Filter Button */}
          <TouchableOpacity
            style={[styles.filterPill, selectedCategory !== null && styles.filterPillActive]}
            onPress={() => setCategoryModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.filterPillText, selectedCategory !== null && styles.filterPillTextActive]}
              numberOfLines={1}
            >
              {selectedCategoryObj ? `${selectedCategoryObj.icon} ${selectedCategoryObj.short}` : 'Tüm Kategoriler'}
            </Text>
            <ChevronDown size={14} color={selectedCategory !== null ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>

          {/* City Filter Button */}
          <TouchableOpacity
            style={[styles.filterPill, selectedCity !== 'Tümü' && styles.filterPillActive]}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}
          >
            <MapPin size={13} color={selectedCity !== 'Tümü' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 4 }} />
            <Text
              style={[styles.filterPillText, selectedCity !== 'Tümü' && styles.filterPillTextActive]}
              numberOfLines={1}
            >
              {selectedCity}
            </Text>
            <ChevronDown size={14} color={selectedCity !== 'Tümü' ? '#FFFFFF' : '#64748B'} />
          </TouchableOpacity>

          {/* Sort Toggle */}
          <TouchableOpacity
            style={[styles.filterPill, sortBy !== 'newest' && styles.filterPillActive]}
            onPress={() => {
              setSortBy(prev => (prev === 'newest' ? 'bids' : 'newest'))
            }}
            activeOpacity={0.8}
          >
            <ArrowUpDown size={13} color={sortBy !== 'newest' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 4 }} />
            <Text style={[styles.filterPillText, sortBy !== 'newest' && styles.filterPillTextActive]}>
              {sortBy === 'newest' ? 'En Yeni' : 'En Çok Teklif'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filter Chips */}
      {(selectedCategory !== null || selectedCity !== 'Tümü') && (
        <View style={styles.activeFilterChipsRow}>
          {selectedCategory !== null && (
            <TouchableOpacity
              style={styles.activeFilterTag}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.activeFilterTagText}>{selectedCategoryObj?.short}</Text>
              <X size={12} color="#0F172A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
          {selectedCity !== 'Tümü' && (
            <TouchableOpacity
              style={styles.activeFilterTag}
              onPress={() => setSelectedCity('Tümü')}
            >
              <Text style={styles.activeFilterTagText}>{selectedCity}</Text>
              <X size={12} color="#0F172A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tenders Grid */}
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
        renderItem={({ item }) => (
          <TenderCard
            tender={item}
            isGrid={true}
            onPress={() => navigation.navigate('TenderDetail', { id: item.id, tender: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏢</Text>
            <Text style={styles.emptyTitle}>Seçilen Kriterde İlan Bulunamadı</Text>
            <Text style={styles.emptySubtitle}>Filtreleri sıfırlayarak tekrar arama yapabilirsiniz.</Text>
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={() => {
                setSelectedCategory(null)
                setSelectedCity('Tümü')
                setSearchQuery('')
              }}
            >
              <Text style={styles.resetFiltersBtnText}>Filtreleri Sıfırla</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* City Selector Modal */}
      <Modal visible={cityModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şehir Seçin</Text>
              <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                <X size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[styles.modalItem, selectedCity === city && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedCity(city)
                    setCityModalVisible(false)
                  }}
                >
                  <Text style={[styles.modalItemText, selectedCity === city && styles.modalItemTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Selector Modal */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategori Seçin</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <X size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <TouchableOpacity
                style={[styles.modalItem, selectedCategory === null && styles.modalItemActive]}
                onPress={() => {
                  setSelectedCategory(null)
                  setCategoryModalVisible(false)
                }}
              >
                <Text style={[styles.modalItemText, selectedCategory === null && styles.modalItemTextActive]}>
                  🔥 Tüm Kategoriler
                </Text>
              </TouchableOpacity>
              {ALL_40_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.modalItem,
                    selectedCategory === cat.id && styles.modalItemActive,
                    cat.id === 99 && styles.digerModalItem
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id)
                    setCategoryModalVisible(false)
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCategory === cat.id && styles.modalItemTextActive,
                      cat.id === 99 && { fontWeight: '700', color: '#7E22CE' }
                    ]}
                  >
                    {cat.icon} {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  activeFilterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  activeFilterTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A'
  },
  listContent: {
    paddingVertical: 14
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16
  },
  resetFiltersBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },
  resetFiltersBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalScroll: {
    paddingHorizontal: 16
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  modalItemActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  digerModalItem: {
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  modalItemText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500'
  },
  modalItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700'
  }
})
