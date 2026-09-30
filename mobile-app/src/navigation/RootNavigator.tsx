import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/HomeScreen'
import { MarketScreen } from '../screens/MarketScreen'
import { CreateTenderScreen } from '../screens/CreateTenderScreen'
import { BidsScreen } from '../screens/BidsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { TenderDetailScreen } from '../screens/TenderDetailScreen'
import { COLORS } from '../constants/taxonomy'
import { Home, ShoppingBag, Plus, FileText, User } from 'lucide-react-native'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.fabContainer}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.fabButton}>
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  </TouchableOpacity>
)

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          elevation: 10,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Vitrin',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarLabel: 'Pazar Yeri',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="CreateTenderTab"
        component={CreateTenderScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: props => <CustomTabBarButton {...props} />
        }}
      />
      <Tab.Screen
        name="Bids"
        component={BidsScreen}
        options={{
          tabBarLabel: 'Teklifler',
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.brandOrange,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700'
          },
          tabBarIcon: ({ color, size }) => <FileText size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hesabım',
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />
        }}
      />
    </Tab.Navigator>
  )
}

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="TenderDetail" component={TenderDetailScreen} />
      <Stack.Screen name="CreateTender" component={CreateTenderScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6
  }
})
