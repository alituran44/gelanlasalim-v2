# 📱 İhaleciBurada — Mobil Uygulama (Android & iOS) Kullanım ve Dağıtım Kılavuzu

Bu belge, **İhaleciBurada** platformunun hem **Android** hem de **iOS** platformları için oluşturulan native projelerinin ve PWA özelliklerinin nasıl kullanılacağını ve derleneceğini adım adım açıklar.

---

## 🏛️ Proje Mimarisi

- **Framework:** Capacitor 6+ Native Shell & Nuxt 4 Web Engine
- **Paket Kimliği (App ID):** `com.ihaleciburada.app`
- **Uygulama Adı:** `İhaleciBurada`
- **Hedef Sunucu:** `https://ihaleciburada.com` (Canlı senkronize mod)
- **Çevrimdışı Kabuk:** `.output/public/index.html` (İnternet kesintisi koruması)
- **Native Proje Yolları:**
  - Android: `android/` (Android Studio & Gradle)
  - iOS: `ios/` (Xcode & Swift)

---

## 🤖 1. Android Uygulaması

### A. Bulut Üzerinden Otomatik APK İndirme (Android Studio Gerektirmez!)
Projeye entegre edilen `.github/workflows/build-mobile.yml` sayesinde:
1. Kodunuzu GitHub'a `git push` yaptığınızda veya GitHub'daki **Actions** sekmesinden **"Run workflow"** dediğinizde bulut sunucuları otomatik çalışır.
2. Derleme tamamlandığında **`IhaleciBurada-Android-APK`** başlığı altında doğrudan telefonunuza kurabileceğiniz imzalı `.apk` dosyası hazır olur.
3. APK'yı telefonunuza indirip tek tıkla kurabilirsiniz.

### B. Android Studio ile Yerel Çalıştırma
Bilgisayarınızda Android Studio yüklü ise:
```bash
npx cap open android
```
- Bu komut `android/` klasörünü Android Studio'da açar.
- **Run (Yeşil Oynat Tuşu)** ile bağlı Android telefonunuzda veya emülatörde test edebilirsiniz.
- **Build -> Build Bundle(s) / APK(s) -> Build APK(s)** adımıyla doğrudan `.apk` dosyası alabilirsiniz.
- **Generate Signed Bundle / APK** adımıyla Google Play Store'a yüklenecek `.aab` dosyasını üretebilirsiniz.

---

## 🍏 2. iOS (iPhone & iPad) Uygulaması

### A. Xcode ile Çalıştırma (Mac Üzerinde)
Capacitor iOS native projesi hazırdır:
```bash
npx cap open ios
```
- `ios/App/App.xcworkspace` otomatik açılır.
- **Signing & Capabilities** sekmesinden Apple Developer hesabınızı seçin.
- iPhone veya Simulator seçerek **Run** butonuna basın.
- **Product -> Archive** menüsünden **TestFlight** veya **Apple App Store**'a gönderim yapabilirsiniz.

### B. iPhone Safe Area ve Kamera İzinleri
- iPhone 14/15/16 Pro Dynamic Island ve çentik desteği CSS `:root (--sat, --sab)` ile tam uyumludur.
- Kamera ve fotoğraf galerisi erişim açıklamaları `Info.plist` içerisine App Store gereksinimlerine uygun şekilde eklenmiştir.

---

## 🌐 3. PWA (Progressive Web App - Anında Kurulum)

Kullanıcıların mağazaya gitmeden web sitesi üzerinden uygulamayı anında telefonlarına kurabilmeleri için:
- `public/manifest.webmanifest` aktif edildi.
- **Android'de (Chrome):** `ihaleciburada.com` adresine girildiğinde tarayıcı "Uygulamayı Yükle" seçeneği sunar.
- **iOS'ta (Safari):** Safari altındaki **Paylaş (Kare ve yukarı ok)** ikonuna tıklayıp **"Ana Ekrana Ekle"** seçildiğinde, uygulama ana ekrana İhaleciBurada kurumsal ikonuyla tam ekran (adres çubuğu olmadan) native bir uygulama gibi yerleşir.

---

## 🔄 4. Değişiklikleri Senkronize Etme

Web arayüzünde veya konfigürasyonda değişiklik yaptığınızda mobil projelere yansıtmak için:
```bash
npx cap sync
```
komutunu çalıştırmanız yeterlidir.
