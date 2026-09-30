import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../constants/taxonomy'
import {
  FileText,
  Heart,
  ShieldCheck,
  Building,
  Bell,
  Headphones,
  LogOut,
  ChevronRight,
  CheckCircle
} from 'lucide-react-native'

export const ProfileScreen = ({ navigation }: any) => {
  const menuItems = [
    {
      icon: <FileText size={20} color={COLORS.primary} />,
      title: 'İlanlarım ve İhalelerim',
      badge: '4 Aktif',
      action: () => navigation.navigate('Home')
    },
    {
      icon: <Heart size={20} color="#E11D48" />,
      title: 'Favori İlanlarım',
      badge: '12',
      action: () => Alert.alert('Favoriler', 'Favorilerinize eklenen 12 ilan bulunmaktadır.')
    },
    {
      icon: <Building size={20} color="#7C3AED" />,
      title: 'Kurumsal Şirket Bilgileri',
      action: () => Alert.alert('Şirket Bilgileri', 'Yıldırım İnşaat & Gayrimenkul Yatırım A.Ş. (Doğrulanmış)')
    },
    {
      icon: <ShieldCheck size={20} color="#059669" />,
      title: 'Güvenlik & Doğrulama (KYC)',
      badge: 'Onaylı',
      action: () => Alert.alert('Doğrulama', 'Kurumsal hesabınız ve vergi levhanız onaylanmıştır.')
    },
    {
      icon: <Bell size={20} color="#D97706" />,
      title: 'Bildirim & SMS Tercihleri',
      action: () => Alert.alert('Bildirimler', 'Anlık ihale ve teklif bildirimleri aktif.')
    },
    {
      icon: <Headphones size={20} color="#0284C7" />,
      title: 'Canlı Destek & İletişim',
      action: () => Alert.alert('Destek', '7/24 Çağrı Merkezi: 0850 123 45 67')
    }
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Profile Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>HY</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.userName}>Hasan Yıldırım</Text>
            <CheckCircle size={16} color="#059669" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.userRole}>Kurumsal Firma Yöneticisi</Text>
          <Text style={styles.companyName}>Yıldırım İnşaat & Gayrimenkul Yatırım</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Aktif İlan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Gelen Teklif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>%100</Text>
          <Text style={styles.statLabel}>Güven Puanı</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Menu Section */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.menuItem, idx === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>{item.icon}</View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Çıkış', 'Hesabınızdan güvenle çıkış yapmak istiyor musunuz?')}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Oturumu Kapat</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>İhaleciBurada v1.0.0 (Native React Native)</Text>
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
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800'
  },
  headerInfo: {
    flex: 1
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  userRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  companyName: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  statCol: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500'
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0'
  },
  scroll: {
    flex: 1,
    marginTop: 14
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  menuIconWrapper: {
    marginRight: 14
  },
  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B'
  },
  menuBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8
  },
  menuBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700'
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 20,
    marginBottom: 30
  }
})
