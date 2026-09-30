import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ALL_40_CATEGORIES, GAYRIMENKUL_SUBCATEGORIES, CITIES, COLORS, formatExternalUrl } from '../constants/taxonomy'
import { apiService } from '../services/api'
import { Camera, Plus, Check, ChevronRight } from 'lucide-react-native'

export const CreateTenderScreen = ({ navigation }: any) => {
  // Form State
  const [baslik, setBaslik] = useState('')
  const [categoryId, setCategoryId] = useState<number>(99) // Default: Diğer
  const [subCategory, setSubCategory] = useState<string>('Ev')
  const [digerMetni, setDigerMetni] = useState('')
  const [isReklam, setIsReklam] = useState(false)
  const [butce, setButce] = useState('')
  const [city, setCity] = useState('İstanbul')
  const [teslimatAdresi, setTeslimatAdresi] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [aciklama, setAciklama] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [ownerCompany, setOwnerCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Demo photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80'
  ])

  const addPhoto = () => {
    const samplePool = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80'
    ]
    const nextImg = samplePool[images.length % samplePool.length]
    setImages(prev => [...prev, nextImg])
  }

  const handleSubmit = async () => {
    if (!baslik.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen ilan/ihale başlığı girin.')
      return
    }

    if (categoryId === 99 && !digerMetni.trim()) {
      Alert.alert('Eksik Bilgi', 'Diğer kategorisi için özel ilan türünü veya başlığını belirtin.')
      return
    }

    setSubmitting(true)
    try {
      const selectedCategoryObj = ALL_40_CATEGORIES.find(c => c.id === categoryId)

      const formattedUrl = formatExternalUrl(websiteUrl)

      const created = await apiService.createTender({
        baslik: baslik.trim(),
        categoryId,
        kategori: selectedCategoryObj?.name || 'Diğer İhale ve İlanlar',
        subCategory: categoryId === 40 ? subCategory : (categoryId === 99 ? 'Diğer' : 'Genel'),
        ihaleYonu: isReklam ? 'reklam' : 'teklif_toplama',
        tur: isReklam ? 'Reklam İlanı' : 'Açık İhale',
        butce: butce.trim() || 'Teklif Usulü',
        city,
        teslimatAdresi,
        websiteUrl: formattedUrl,
        aciklama,
        images,
        ownerPhone,
        ownerCompany,
        customFields: {
          digerMetni: categoryId === 99 ? digerMetni.trim() : undefined,
          altKategoriDiger: categoryId === 99 ? digerMetni.trim() : undefined,
          formType: isReklam ? 'REKLAM_ILANI' : (categoryId === 40 ? 'GAYRIMENKUL' : 'STANDART')
        }
      })

      Alert.alert(
        'Tebrikler! 🎉',
        'İlanınız başarıyla yayına alındı ve vitrinde görüntülenebilir.',
        [
          {
            text: 'İlanı Görüntüle',
            onPress: () => {
              navigation.navigate('TenderDetail', { id: created.id, tender: created })
            }
          }
        ]
      )
    } catch {
      Alert.alert('Hata', 'İlan kaydedilirken bir hata oluştu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni İhale & İlan Başlat</Text>
        <Text style={styles.headerSubtitle}>Türkiye çapında binlerce alıcı ve tedarikçiye anında ulaşın</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photos Section */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>📷 İlan Fotoğrafları ({images.length})</Text>
          <Text style={styles.helperText}>İlk fotoğraf kapak görseli olarak vitrinde yer alacaktır.</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
            {images.map((img, idx) => (
              <View key={idx} style={styles.photoThumbWrapper}>
                <Image source={{ uri: img }} style={styles.photoThumb} />
                {idx === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Kapak</Text>
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto} activeOpacity={0.8}>
              <Camera size={24} color={COLORS.primary} />
              <Text style={styles.addPhotoText}>+ Fotoğraf</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>📝 İlan Başlığı</Text>
          <TextInput
            placeholder="Örn: Kadıköy Devren Kafe / 1000 Ton Buğday Alımı..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={baslik}
            onChangeText={setBaslik}
          />

          {/* Reklam İlanı Switch */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>📢 Reklam & Tanıtım İlanı Olarak İşaretle</Text>
              <Text style={styles.switchDesc}>İlanınız vitrinde turuncu "📢 Reklam İlanı" rozetiyle öne çıkar.</Text>
            </View>
            <Switch
              value={isReklam}
              onValueChange={setIsReklam}
              trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
              thumbColor={isReklam ? COLORS.brandOrange : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>🏷️ Ana Kategori</Text>
          <Text style={styles.helperText}>İlanınızın listeleneceği sektörü seçin.</Text>
          
          <View style={styles.categoryPillsWrapper}>
            {ALL_40_CATEGORIES.slice(0, 10).map(cat => {
              const isSelected = categoryId === cat.id
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catPill,
                    isSelected && styles.catPillActive,
                    cat.id === 99 && styles.digerPillSpecial
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                    {cat.icon} {cat.short}
                  </Text>
                  {isSelected && <Check size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Conditional: "Diğer" Özel Metni Input */}
          {categoryId === 99 && (
            <View style={styles.digerInputBox}>
              <Text style={styles.digerInputLabel}>✨ Diğer İlanı Özel Tanımı / Alt Başlığı:</Text>
              <TextInput
                placeholder="Örn: Drone ile GES Denetimi, Fason Talaşlı İmalat..."
                placeholderTextColor="#A855F7"
                style={styles.digerInput}
                value={digerMetni}
                onChangeText={setDigerMetni}
              />
              <Text style={styles.digerInputHint}>Bu metin ilan kartında mor yıldızlı özel rozet olarak gösterilecektir.</Text>
            </View>
          )}

          {/* Conditional: Gayrimenkul Alt Kategorileri */}
          {categoryId === 40 && (
            <View style={styles.subCategoryBox}>
              <Text style={styles.subCategoryBoxLabel}>🏢 Gayrimenkul Türü:</Text>
              <View style={styles.subCategoryChips}>
                {GAYRIMENKUL_SUBCATEGORIES.map(sub => (
                  <TouchableOpacity
                    key={sub}
                    style={[styles.subChip, subCategory === sub && styles.subChipActive]}
                    onPress={() => setSubCategory(sub)}
                  >
                    <Text style={[styles.subChipText, subCategory === sub && styles.subChipTextActive]}>
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Commercial Details */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>💰 Fiyat / Bütçe & Şehir</Text>
          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputMiniLabel}>Bütçe / Tutar (₺)</Text>
              <TextInput
                placeholder="Örn: 2.500.000 ₺"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={butce}
                onChangeText={setButce}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputMiniLabel}>Şehir</Text>
              <TextInput
                placeholder="Örn: İstanbul"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <Text style={styles.inputMiniLabel}>Teslimat / İhale Konum Adresi</Text>
          <TextInput
            placeholder="Örn: Başakşehir Sanayi Bölgesi 14. Cad."
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={teslimatAdresi}
            onChangeText={setTeslimatAdresi}
          />

          {/* Web Site Link (with auto https:// rule) */}
          <Text style={styles.inputMiniLabel}>🌐 Web Sayfası / İnceleme Linki</Text>
          <TextInput
            placeholder="www.sirketiniz.com/ilan (Otomatik https:// eklenir)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="url"
            style={styles.input}
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
          />
          <Text style={styles.helperText}>İlanı ziyaret eden kullanıcılar bu bağlantıya doğrudan tıklayabilecektir.</Text>
        </View>

        {/* Detailed Description */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>📄 İlan / Şartname Açıklaması</Text>
          <TextInput
            placeholder="İhale şartları, teslim koşulları, ürün özellikleri ve ödeme vadesini detaylandırın..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, { minHeight: 90 }]}
            value={aciklama}
            onChangeText={setAciklama}
          />
        </View>

        {/* Contact Info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>📞 İletişim Bilgileri</Text>
          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputMiniLabel}>Şirket / Yetkili Adı</Text>
              <TextInput
                placeholder="Örn: Yıldırım İnşaat A.Ş."
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={ownerCompany}
                onChangeText={setOwnerCompany}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputMiniLabel}>Telefon Numarası</Text>
              <TextInput
                placeholder="0532..."
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                style={styles.input}
                value={ownerPhone}
                onChangeText={setOwnerPhone}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.88}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'İlan Oluşturuluyor...' : '🚀 İlanı Hemen Yayına Al'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12
  },
  photosRow: {
    flexDirection: 'row',
    marginTop: 6
  },
  photoThumbWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
    position: 'relative',
    overflow: 'hidden'
  },
  photoThumb: {
    width: '100%',
    height: '100%'
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  coverBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  addPhotoText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 10
  },
  inputMiniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginTop: 6
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A3412'
  },
  switchDesc: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 2
  },
  categoryPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  digerPillSpecial: {
    borderColor: '#C084FC',
    backgroundColor: '#FAF5FF'
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  digerInputBox: {
    marginTop: 14,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 12,
    padding: 12
  },
  digerInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7E22CE',
    marginBottom: 6
  },
  digerInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8B4FE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A'
  },
  digerInputHint: {
    fontSize: 11,
    color: '#9333EA',
    marginTop: 4
  },
  subCategoryBox: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12
  },
  subCategoryBoxLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8
  },
  subCategoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  subChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  subChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600'
  },
  subChipTextActive: {
    color: '#FFFFFF'
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  }
})
