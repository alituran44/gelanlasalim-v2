import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native'
import { ALL_40_CATEGORIES, COLORS } from '../constants/taxonomy'
import { CategoryItem } from '../types/tender'

interface CategoryChipsProps {
  selectedCategoryId: number | null
  onSelectCategory: (categoryId: number | null) => void
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const sortedCategories = [...ALL_40_CATEGORIES].sort((a, b) => a.orderRank - b.orderRank)

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectCategory(null)}
          style={[
            styles.chip,
            selectedCategoryId === null && styles.chipActive
          ]}
        >
          <Text style={[styles.chipText, selectedCategoryId === null && styles.chipTextActive]}>
            🔥 Tümü
          </Text>
        </TouchableOpacity>

        {sortedCategories.map((cat: CategoryItem) => {
          const isSelected = selectedCategoryId === cat.id
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(isSelected ? null : cat.id)}
              style={[
                styles.chip,
                isSelected && styles.chipActive,
                cat.id === 99 && styles.digerChipSpecial
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextActive,
                  cat.id === 99 && !isSelected && styles.digerChipTextSpecial
                ]}
                numberOfLines={1}
              >
                {cat.icon} {cat.short}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  digerChipSpecial: {
    borderColor: '#C084FC',
    backgroundColor: '#FAF5FF'
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  digerChipTextSpecial: {
    color: '#7E22CE'
  }
})
