import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env['WEB_URL'] ?? 'http://localhost:3000';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/admin/', '/onboarding'] },
    sitemap: `${base}/sitemap.xml`,
  };
}