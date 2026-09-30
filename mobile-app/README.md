# 📱 İhaleciBurada — %100 Saf Native Mobil Uygulama (iOS & Android)

Bu proje, **İhaleciBurada** platformunun gerçek, saf (native) mobil deneyimini sunan **React Native & Expo SDK 51** mobil uygulamasıdır. 
Kesinlikle bir webview ("web sitesinin telefondan açılması") **değildir**. Sahibinden, Trendyol ve Letgo standartlarında; alt gezinme çubuğu (Bottom Navigation Bar), akıcı yatay kategori çipleri, 2 sütunlu vitrin kartları, tam ekran kaydırmalı fotoğraf galerisi ve yerel teklif verme pencereleriyle donatılmıştır.

---

## 🌟 Öne Çıkan Özellikler ve Kurallar

1. **✨ Diğer İhale ve İlanlar Önceliği (1. Sıra):**
   - Kategori listesinde en başta yer alır (`orderRank: 1`).
   - İlan açarken veya görüntülerken kullanıcının girdiği özel başlık (`✨ {{ customText }}`) mor rozetle öne çıkarılır.
2. **🏢 Emlak & Gayrimenkul Alt Kategorileri (2. Sıra):**
   - `Ev`, `Arsa`, `Ofis`, `İşyeri`, `Tarla & Bağ-Bahçe`, `Ticari Gayrimenkul`, `Diğer` alt kategorilerini eksiksiz barındırır.
3. **📢 Reklam İlanı Rozeti:**
   - Reklam / Tanıtım olarak işaretlenen ilanlarda turuncu yüksek kontrastlı `📢 Reklam İlanı` rozeti gösterilir.
4. **📷 1/N Fotoğraf Sayacı & Galeri:**
   - Kartlarda kapak fotoğrafının üzerinde `📷 1/N Fotoğraf` sayacı yer alır.
   - Detay sayfasına tıklandığında tam ekran kaydırmalı (swipe) fotoğraf galerisi açılır.
5. **🌐 Güvenli Web Bağlantısı Yönlendirmesi:**
   - İlanda belirtilen web sitesi adreslerine otomatik `https://` eklenir, telefon tarayıcısında tek dokunuşla açılır.
6. **⚡ Kesintisiz Çalışma (Offline / Online Fallback):**
   - İnternet olmasa veya API sunucusuna erişilemese bile zengin yerleşik veri setiyle uygulama anında açılır, çökmez.
   - Canlıda `https://ihaleciburada.com/api` uç noktalarıyla senkronize çalışır.

---

## 🚀 Hızlı Başlangıç (Telefonda 30 Saniyede Test Edin)

Herhangi bir emülatör veya Android Studio / Xcode kurulumu yapmadan, doğrudan kendi fiziksel telefonunuzda test edebilirsiniz:

### 1. Adım: Telefona Expo Go Uygulamasını İndirin
- **Android:** Google Play Store'dan **Expo Go** uygulamasını yükleyin.
- **iOS:** App Store'dan **Expo Go** uygulamasını yükleyin.

### 2. Adım: Bilgisayarda Uygulamayı Başlatın
Terminal veya PowerShell üzerinden `mobile-app` dizininde:

```bash
cd mobile-app
npx expo start
```

### 3. Adım: QR Kodu Okutun
- Terminal ekranında büyük bir **QR Kod** belirecektir.
- **Android için:** Expo Go uygulamasını açıp "Scan QR code" butonuna basarak okutun.
- **iOS için:** Telefonunuzun normal Kamera uygulamasını açıp QR koda tutun ve "Expo Go ile Aç" bildirimine dokunun.
- Uygulama saniyeler içinde telefonunuzda yerel (native) olarak açılacaktır!

---

## 📦 Android APK Oluşturma (Google Play veya Doğrudan Kurulum İçin)

EAS (Expo Application Services) kullanarak tek komutla bulutta ücretsiz `.apk` derleyebilirsiniz:

```bash
# 1. EAS CLI yükleyin
npm install -g eas-cli

# 2. Ücretsiz Expo hesabınızla giriş yapın
npx eas login

# 3. Android APK derlemesini başlatın
npx eas build -p android --profile preview
```

Derleme tamamlandığında doğrudan telefonunuza indirebileceğiniz bir `.apk` indirme bağlantısı alırsınız.

---

## 📁 Proje Dizin Yapısı

```
mobile-app/
├── App.tsx                     # Kök uygulama ve SafeArea/Navigation Container
├── app.json                    # Uygulama adı, paket kimliği, izinler ve splash ayarları
├── package.json                # React Native 0.74, Expo SDK 51 bağımlılıkları
├── assets/                     # İkon, splash ekranı ve görseller
└── src/
    ├── constants/
    │   └── taxonomy.ts         # 40 kategori, renk sistemi, URL ve reklam kuralları
    ├── types/
    │   └── tender.ts           # İhale, teklif ve kategori TypeScript modelleri
    ├── services/
    │   └── api.ts              # API servisi, veri saklama ve offline fallback
    ├── components/
    │   ├── CategoryChips.tsx   # Yatay kaydırılabilir kategori çubukları
    │   └── TenderCard.tsx      # Sahibinden/Letgo tarzı 2 sütunlu ilan kartı
    ├── screens/
    │   ├── HomeScreen.tsx      # Vitrin ana ekranı
    │   ├── MarketScreen.tsx    # Arama ve filtrelemeli Pazar Yeri ekranı
    │   ├── CreateTenderScreen.tsx # Çok adımlı ihale & ilan oluşturma
    │   ├── BidsScreen.tsx      # Gelen & verilen teklifler yönetimi
    │   ├── ProfileScreen.tsx   # Kurumsal profil ve hesap ekranı
    │   └── TenderDetailScreen.tsx # Fotoğraf galerili ilan detay ekranı
    └── navigation/
        └── RootNavigator.tsx   # Alt Gezinme Sekmeleri (BottomTabs) + Stack Gezintisi
```
