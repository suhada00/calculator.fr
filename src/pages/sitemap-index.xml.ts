import type { APIRoute } from 'astro';
import categories from '../data/categories.json';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin || 'https://www.simulateur-gratuit.com';
  
  const files = import.meta.glob('../data/calculators/**/*.json', { eager: true });
  
  const urls: string[] = [];
  
  // 1. Core static pages
  const staticPages = ['', 'about', 'contact', 'privacy-policy', 'terms'];
  for (const page of staticPages) {
    for (const locale of ['en', 'fr']) {
      const path = page === '' ? `/${locale}/` : `/${locale}/${page}/`;
      urls.push(`  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }
  
  // 2. Hub pages
  urls.push(`  <url>
    <loc>${siteUrl}/en/calculators/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  urls.push(`  <url>
    <loc>${siteUrl}/fr/calculateurs/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  
  // 3. Calculator pages
  for (const path in files) {
    const file = (files[path] as any).default || files[path];
    if (file.status !== 'published') continue;
    
    const catId = file.category;
    const catConfig = (categories as any)[catId];
    if (!catConfig) continue;
    
    for (const locale of ['en', 'fr']) {
      const trans = file.translations[locale];
      if (!trans) continue;
      
      const toolsSlug = locale === 'fr' ? 'calculateurs' : 'calculators';
      const catSlug = catConfig.translations[locale].slug;
      const urlPath = `/${locale}/${toolsSlug}/${catSlug}/${trans.slug}/`;
      const lastmod = file.updatedAt || '2026-07-02';
      
      urls.push(`  <url>
    <loc>${siteUrl}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`);
    }
  }
  
  // 4. Blog pages
  // Index pages
  for (const locale of ['en', 'fr']) {
    urls.push(`  <url>
    <loc>${siteUrl}/${locale}/blog/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Individual posts
  try {
    const posts = await getCollection('blog');
    for (const post of posts) {
      const parts = post.id.split('/');
      const cleanSlug = parts[parts.length - 1].replace(/\.md$/, '');
      const locale = post.data.lang;
      const urlPath = `/${locale}/blog/${cleanSlug}/`;
      const lastmod = post.data.pubDate.toISOString().split('T')[0];
      
      urls.push(`  <url>
    <loc>${siteUrl}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  } catch (e) {
    console.error('Error fetching blog posts for sitemap', e);
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
