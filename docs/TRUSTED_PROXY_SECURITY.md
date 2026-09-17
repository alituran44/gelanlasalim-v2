# Güvenilir Ters Vekil (Trusted Proxy) & IP Sahteleme (Anti-Spoofing) Kılavuzu

Bu doküman, **İhaleciBurada B2B Platformu**'nun hız sınırlama (Rate-Limit), güvenlik günlüğü (Security Audit) ve 5651/VUK 538 mevzuat loglamalarında istemci IP adreslerinin sahtelenmesini (IP Spoofing) önlemek amacıyla tasarlanan güvenlik mimarisini açıklar.

---

## 1. Tehdit Modeli: X-Forwarded-For Sahtelemesi (IP Spoofing)

HTTP isteklerinde bulunan `X-Forwarded-For` başlığı, doğrudan istemci tarafından özgürce üretilebilir:
```http
POST /api/auth/login HTTP/1.1
Host: ihaleciburada.com
X-Forwarded-For: 8.8.8.8
```
Eğer uygulama doğrudan `req.headers['x-forwarded-for'].split(',')[0]` değerine güvenirse:
1. **Hız Sınırını Atlama (Rate-Limit Bypass):** Saldırgan her istekte rastgele bir IP göndererek hız sınırına takılmadan brute-force veya DoS saldırısı yapabilir.
2. **Denetim İzi Tahrifatı (Audit Log Tampering):** 5651 sayılı kanun ve VUK 538 kapsamında tutulan ihale ve teklif loglarında hatalı/sahte IP kayıtları oluşabilir.
3. **Coğrafi veya IP Tabanlı İzin Engelleri:** Güvenlik katmanı yanıltılabilir.

---

## 2. İhaleciBurada Çözüm Mimarisi (`server/utils/clientIp.ts`)

Sistemimizde tüm IP çözümlemeleri merkezi `resolveClientIp(event)` fonksiyonu üzerinden hiyerarşik bir güven zinciriyle çalışır:

```
[ Gelen İstek ]
       │
       ▼
1. Vercel / Nginx Güvenilir Başlığı: `x-real-ip` (Ters vekil tarafından ezilir, istemci değiştiremez)
       │ (Yoksa)
       ▼
2. Vercel Edge Doğrulama Başlığı: `x-vercel-forwarded-for`
       │ (Yoksa)
       ▼
3. Cloudflare Edge Başlığı: `cf-connecting-ip`
       │ (Yoksa)
       ▼
4. Standart `x-forwarded-for` (Güvenilir proxy arkasındaki ilk doğrulanmış IP)
       │ (Yoksa)
       ▼
5. Doğrudan TCP Soket IP Adresi: `event.node.req.socket.remoteAddress`
```

---

## 3. Dağıtım Ortamı Yapılandırma Kılavuzu

### A. Vercel (Mevcut Canlı Ortam)
- Vercel Serverless ve Edge ağında `x-real-ip` başlığı istemciden gelen değerleri **otomatik olarak ezer ve siler**.
- Vercel kendi edge router'ının gördüğü gerçek istemci TCP IP'sini `x-real-ip` ve `x-vercel-forwarded-for` içerisine yerleştirir.
- Dolayısıyla Vercel üzerinde ek bir proxy yapılandırmasına gerek kalmaksızın `resolveClientIp` tam güvenlik sağlar.

### B. Cloudflare (Reverse Proxy / WAF)
- Cloudflare arkasında çalışırken `cf-connecting-ip` başlığı yetkili kaynaktır.
- Sunucu tarafında `resolveClientIp` bu başlığı otomatik olarak 3. öncelikle tanır.

### C. Kendi Sunucusu (Nginx / Caddy / Docker / VPS Dağıtımları)
Platform Vercel dışındaki bağımsız bir Linux/Nginx sunucusuna taşınırsa, Nginx konfigürasyonunda upstream başlıklarının temizlenmesi ve `real_ip` modülünün tanımlanması zorunludur:

```nginx
# /etc/nginx/conf.d/ihaleciburada.conf

# 1. Yalnızca bilinen ve güvenilen vekillerin IP'lerini kabul edin
set_real_ip_from 10.0.0.0/8;
set_real_ip_from 172.16.0.0/12;
set_real_ip_from 192.168.0.0/16;

# Cloudflare IP blokları (Cloudflare kullanılıyorsa):
# set_real_ip_from 173.245.48.0/20;
# ...

# 2. Gerçek istemci IP'sini aktarın
real_ip_header X-Forwarded-For;
real_ip_recursive on;

location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 4. İlgili Dosyalar
- `server/utils/clientIp.ts`: Merkezi IP çözümleme mantığı.
- `server/middleware/rate-limit.ts`: IP bazlı hız sınırlandırma (60 req/min standart, 15 req/min hassas SMS/ödeme).
- `server/utils/authGuard.ts`: Oturum çözümlemede güvenilir IP bağlama.
