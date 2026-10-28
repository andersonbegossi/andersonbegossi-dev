import type { MetadataRoute } from 'next';
import { postScreen } from '@/lib/blog/format';
import { loadPosts } from '@/lib/blog/posts';
import { locales, screens } from '@/lib/i18n/locale';
import { absoluteUrl } from '@/lib/metadata';

/** A static export only prerenders a route handler that opts in (ADR 0001). */
export const dynamic = 'force-static';

/**
 * Every static screen and every published article, in both locales. Articles
 * come from the content loader (ADR 0003), so a post is listed only where its
 * file exists and the empty-blog placeholder is not.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = locales.flatMap((locale) => screens.map((screen) => absoluteUrl(screen, locale)));
  const articles = locales.flatMap((locale) =>
    loadPosts(locale).map((post) => absoluteUrl(postScreen(post.slug), locale)),
  );

  return [...pages, ...articles].map((url) => ({ url }));
}
