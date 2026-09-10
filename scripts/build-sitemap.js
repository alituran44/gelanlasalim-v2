import fs from 'node:fs';

const base = 'https://ihaleciburada.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/pazar-yeri', priority: '0.9', changefreq: 'hourly' },
  { loc: '/entegrasyonlar', priority: '0.9', changefreq: 'weekly' },
  { loc: '/abonelik', priority: '0.8', changefreq: 'weekly' },
  { loc: '/sozlesmeler', priority: '0.8', changefreq: 'monthly' },
  { loc: '/firma-dogrulama', priority: '0.8', changefreq: 'monthly' },
  { loc: '/hakkimizda', priority: '0.7', changefreq: 'monthly' },
  { loc: '/yardim', priority: '0.7', changefreq: 'monthly' },
  { loc: '/uyelik', priority: '0.8', changefreq: 'monthly' },
  { loc: '/videolar', priority: '0.7', changefreq: 'monthly' }
];

const sectors = [
  'İnşaat ve Altyapı Yapım İşleri',
  'Sağlık, Medikal ve İlaç Malzemeleri',
  'Gıda Maddeleri, Tarım ve Yiyecek Alımı',
  'Tıbbi Teçhizat ve Laboratuvar Cihazları',
  'Kanalizasyon, Su Arıtma ve Sıhhi Tesisat',
  'Elektrik, Güç Sistemleri ve Aydınlatma',
  'Akaryakıt, LPG, Madeni Yağ Tedariği',
  'Endüstriyel Makineler ve Ekipmanlar',
  'Bilişim, Yazılım ve Ağ Teknolojileri',
  'Lojistik, Taşımacılık ve Personel Servisi',
  'Ofis Mobilyaları ve İç Mekan Donanımı',
  'Hırdavat, Nalburiye ve Metal Malzemeler',
  'Yangın Söndürme ve İkaz Sistemleri',
  'Kimyasal Ürünler ve Temizlik Maddeleri',
  'Ambalaj, Matbaa ve Kağıt Ürünleri'
];

const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli',
  'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
  'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

staticPages.forEach(p => {
  xml += '  <url>\n';
  xml += `    <loc>${base}${p.loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += '  </url>\n';
});

sectors.forEach(s => {
  const query = encodeURIComponent(s);
  xml += '  <url>\n';
  xml += `    <loc>${base}/?kategori=${query}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.85</priority>\n';
  xml += '  </url>\n';
});

cities.forEach(c => {
  const query = encodeURIComponent(c);
  xml += '  <url>\n';
  xml += `    <loc>${base}/?sehir=${query}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.80</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`[build-sitemap] Generated public/sitemap.xml with ${staticPages.length + sectors.length + cities.length} URLs.`);
