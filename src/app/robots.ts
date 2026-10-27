import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

/** A static export only prerenders a route handler that opts in (ADR 0001). */
export const dynamic = 'force-static';

/** Allow indexing. The sitemap host is the base URL, same as every canonical. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteConfig.baseUrl).href,
  };
}
