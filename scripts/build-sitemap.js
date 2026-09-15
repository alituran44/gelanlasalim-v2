import fs from 'node:fs';

const base = 'https://ihaleciburada.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '', priority: '1.0', changefreq: 'daily', image: 'https://ihaleciburada.com/auth_skyscraper_bg.jpg', title: 'İhaleciBurada Kurumsal B2B İhale ve Satın Alma Platformu' },
  { loc: '/pazar-yeri', priority: '0.9', changefreq: 'hourly', image: 'https://ihaleciburada.com/auth_skyscraper_bg.jpg', title: 'Canlı B2B İhale ve Eksiltme Pazar Yeri' },
  { loc: '/firmalar', priority: '0.9', changefreq: 'daily', image: 'https://ihaleciburada.com/logo.png', title: 'Doğrulanmış B2B Üretici ve Tedarikçi Firmalar' },
  { loc: '/entegrasyonlar', priority: '0.9', changefreq: 'weekly', image: 'https://ihaleciburada.com/logo.png', title: 'Kurumsal ERP ve API Entegrasyonları (SAP, Logo, Netsis)' },
  { loc: '/abonelik', priority: '0.8', changefreq: 'weekly', image: 'https://ihaleciburada.com/logo.png', title: 'Kurumsal İhale Paketleri ve B2B Üyelik' },
  { loc: '/sozlesmeler', priority: '0.8', changefreq: 'monthly', image: 'https://ihaleciburada.com/logo.png', title: 'Yasal Sözleşmeler, KVKK ve Escrow Şartları' },
  { loc: '/firma-dogrulama', priority: '0.8', changefreq: 'monthly', image: 'https://ihaleciburada.com/logo.png', title: 'Kurumsal Kimlik ve Evrak Doğrulama (KYC)' },
  { loc: '/hakkimizda', priority: '0.7', changefreq: 'monthly', image: 'https://ihaleciburada.com/auth_skyscraper_bg.jpg', title: 'Hakkımızda - İhaleciBurada Şirket Künyesi ve Vizyon' },
  { loc: '/yardim', priority: '0.7', changefreq: 'monthly', image: 'https://ihaleciburada.com/logo.png', title: 'Yardım Merkezi & Sıkça Sorulan Sorular (SSS)' },
  { loc: '/uyelik', priority: '0.8', changefreq: 'monthly', image: 'https://ihaleciburada.com/logo.png', title: 'Üye Kaydı ve Kurumsal Giriş' },
  { loc: '/videolar', priority: '0.7', changefreq: 'monthly', image: 'https://ihaleciburada.com/logo.png', title: 'Video Kılavuzlar ve İhale Eğitim Rehberi' }
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

staticPages.forEach(p => {
  xml += '  <url>\n';
  xml += `    <loc>${base}${p.loc}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="tr" href="${base}${p.loc}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en" href="${base}${p.loc}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${p.loc}" />\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  if (p.image) {
    xml += '    <image:image>\n';
    xml += `      <image:loc>${p.image}</image:loc>\n`;
    xml += `      <image:title>${p.title}</image:title>\n`;
    xml += '    </image:image>\n';
  }
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`[build-sitemap] Generated public/sitemap.xml with ${staticPages.length} canonical URLs with image & hreflang tags.`);
