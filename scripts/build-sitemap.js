import fs from 'node:fs';

const base = 'https://ihaleciburada.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '', priority: '1.0', changefreq: 'daily' },
  { loc: '/pazar-yeri', priority: '0.9', changefreq: 'hourly' },
  { loc: '/firmalar', priority: '0.9', changefreq: 'daily' },
  { loc: '/entegrasyonlar', priority: '0.9', changefreq: 'weekly' },
  { loc: '/abonelik', priority: '0.8', changefreq: 'weekly' },
  { loc: '/sozlesmeler', priority: '0.8', changefreq: 'monthly' },
  { loc: '/firma-dogrulama', priority: '0.8', changefreq: 'monthly' },
  { loc: '/hakkimizda', priority: '0.7', changefreq: 'monthly' },
  { loc: '/yardim', priority: '0.7', changefreq: 'monthly' },
  { loc: '/uyelik', priority: '0.8', changefreq: 'monthly' },
  { loc: '/videolar', priority: '0.7', changefreq: 'monthly' }
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

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`[build-sitemap] Generated public/sitemap.xml with ${staticPages.length} canonical URLs.`);
