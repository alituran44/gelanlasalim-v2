# 🛡️ www.ihaleciburada.com DNS Güvenlik ve SPF (Sender Policy Framework) Yapılandırma Kılavuzu

Bu belge, **ihaleciburada.com** alan adı için e-posta sahteciliğini (spoofing/phishing), kimlik taklidini ve Strix Pentest bulgularını önlemek amacıyla hazırlanmış resmi DNS güvenlik direktifidir.

---

## 🚨 1. DNS SPF (Sender Policy Framework) Kaydı
E-posta sunucularının siteniz adına yetkisiz e-posta göndermesini engeller.

- **Kayıt Türü (Type):** `TXT`
- **Ana Bilgisayar / Ad (Host / Name):** `@` (veya `ihaleciburada.com`)
- **TTL:** `3600` (veya 1 saat)
- **Değer / İçerik (Value):**
  ```text
  v=spf1 include:_spf.google.com ~all
  ```
  *(Eğer sunucunuz doğrudan Vercel veya harici bir SMTP servisi kullanıyorsa: `v=spf1 include:_spf.google.com include:mailgun.org ~all`)*

---

## 🔒 2. DMARC (Domain-based Message Authentication) Kaydı
SPF ve DKIM doğrulaması başarısız olan sahte e-postaların alıcı sunucular (Gmail, Outlook vb.) tarafından nasıl işleneceğini belirler.

- **Kayıt Türü (Type):** `TXT`
- **Ana Bilgisayar / Ad (Host / Name):** `_dmarc`
- **TTL:** `3600`
- **Değer / İçerik (Value):**
  ```text
  v=DMARC1; p=quarantine; rua=mailto:guvenlik@ihaleciburada.com; pct=100; sp=quarantine
  ```

---

## 🔑 3. RFC 9116 security.txt Uyumlu İletişim Bilgileri
Sitede aktif RFC 9116 güvenlik iletişim uç noktaları:
- `https://www.ihaleciburada.com/.well-known/security.txt`
- `https://www.ihaleciburada.com/security.txt`

Güvenlik E-Posta İletişimi: `guvenlik@ihaleciburada.com`  
KEP Adresi: `hasanhuseyin.yildirim.17@hs01.kep.tr`  
Destek Hattı: `0850 840 86 95`
