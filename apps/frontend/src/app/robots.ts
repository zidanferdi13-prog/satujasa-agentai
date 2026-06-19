import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/download'],
      disallow: ['/auth/', '/admin/', '/owner/', '/user-admin/', '/monitoring/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
