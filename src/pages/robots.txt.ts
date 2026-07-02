import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.origin || 'https://www.simulateurplus.com';
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?*

Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap-index.xml
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' }
  });
};
