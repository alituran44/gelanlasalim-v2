import { defineNuxtPlugin } from '#app'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App as CapApp } from '@capacitor/app'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const isNative = Capacitor.isNativePlatform()

  if (isNative) {
    document.documentElement.classList.add('capacitor-native-app')

    // 1. Durum Çubuğu (Status Bar) Kurumsal Lacivert (#0F223D) ve Beyaz Yazı
    try {
      StatusBar.setBackgroundColor({ color: '#0F223D' }).catch(() => {})
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
    } catch (e) {
      // Platform unsupported or mock
    }

    // 2. Açılış Ekranı (Splash Screen) Gizleme
    setTimeout(() => {
      try {
        SplashScreen.hide().catch(() => {})
      } catch (e) {
        // Ignored
      }
    }, 600)

    // 3. Android Donanım Geri Tuşu Yönetimi
    try {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack && window.location.pathname !== '/' && window.history.length > 1) {
          window.history.back()
        } else {
          CapApp.exitApp()
        }
      })
    } catch (e) {
      // Ignored
    }
  }
})
