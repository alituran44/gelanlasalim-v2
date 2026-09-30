import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BidItem } from '../types/tender'
import { apiService } from '../services/api'
import { COLORS } from '../constants/taxonomy'
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react-native'

export const BidsScreen = ({ navigation }: any) => {
  const [bids, setBids] = useState<BidItem[]>([])
  const [activeTab, setActiveTab] = useState<'incoming' | 'myBids'>('incoming')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService.getBids().then(data => {
      setBids(data)
      setLoading(false)
    })
  }, [])

  const handleAction = (bidId: string, status: 'accepted' | 'rejected') => {
    setBids(prev =>
      prev.map(b => (b.id === bidId ? { ...b, status } : b))
    )
    Alert.alert(
      status === 'accepted' ? 'Teklif Kabul Edildi! 🤝' : 'Teklif Reddedildi',
      status === 'accepted'
        ? 'İhale sahibi ve teklif veren firma arasında iletişim kanalları açıldı.'
        : 'Teklif durumu güncellendi.'
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teklifler & Başvurular</Text>
        <Text style={styles.headerSubtitle}>İhalelerinize gelen ve verdiğiniz tüm teklifleri yönetin</Text>
      </View>

      {/* Segmented Tab */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentTab, activeTab === 'incoming' && styles.segmentTabActive]}
          onPress={() => setActiveTab('incoming')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'incoming' && styles.segmentTextActive]}>
            Gelen Teklifler ({bids.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentTab, activeTab === 'myBids' && styles.segmentTabActive]}
          onPress={() => setActiveTab('myBids')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'myBids' && styles.segmentTextActive]}>
            Verdiğim Teklifler (2)
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'incoming' ? bids : bids.slice(0, 2)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.bidCard}>
            <View style={styles.bidCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bidTenderTitle} numberOfLines={2}>
                  {item.tenderTitle}
                </Text>
                <Text style={styles.bidCompany}>🏢 {item.bidderCompany}</Text>
              </View>
              <View style={styles.statusBadge}>
                {item.status === 'accepted' ? (
                  <Text style={styles.statusAccepted}>Onaylandı</Text>
                ) : item.status === 'rejected' ? (
                  <Text style={styles.statusRejected}>Reddedildi</Text>
                ) : (
                  <Text style={styles.statusPending}>Beklemede</Text>
                )}
              </View>
            </View>

            <View style={styles.bidAmountRow}>
              <View>
                <Text style={styles.amountLabel}>Teklif Tutarı</Text>
                <Text style={styles.amountValue}>{item.amount}</Text>
              </View>
              <View style={styles.dateRow}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>

            {/* Actions if pending and incoming */}
            {item.status === 'pending' && activeTab === 'incoming' && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleAction(item.id, 'rejected')}
                >
                  <XCircle size={16} color="#DC2626" style={{ marginRight: 4 }} />
                  <Text style={styles.rejectBtnText}>Reddet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAction(item.id, 'accepted')}
                >
                  <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.acceptBtnText}>Kabul Et</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Henüz Teklif Yok</Text>
            <Text style={styles.emptySubtitle}>İhaleleriniz yayımlandıkça teklifler burada toplanacaktır.</Text>
          </View>
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    margin: 16,
    borderRadius: 12,
    padding: 3
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  bidCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  bidTenderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18
  },
  bidCompany: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500'
  },
  statusBadge: {
    marginLeft: 8
  },
  statusPending: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusAccepted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusRejected: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  bidAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10
  },
  amountLabel: {
    fontSize: 11,
    color: '#64748B'
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dateText: {
    fontSize: 11,
    color: '#64748B'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 10
  },
  rejectBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700'
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 10
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center'
  }
})
