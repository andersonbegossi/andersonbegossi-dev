import { join } from 'node:path';
import type { Locale } from '@/lib/i18n/locale';
import { loadPosts as loadFixturePosts } from './fixture-posts';

export { featuredPost } from './fixture-posts';

/**
 * The design's four seed posts, in both locales and four categories each — what
 * the Blog index's search and category filters need. Kept apart from the shared
 * fixtures, whose exact set the Article tests depend on; mock the loader with
 * `vi.mock('@/lib/blog/posts', () => import('@/test/fixture-index-posts'))`.
 */
export const indexFixtureContentDir = join(process.cwd(), 'src', 'test', 'fixtures', 'blog-index');

export function loadPosts(locale: Locale, contentDir = indexFixtureContentDir) {
  return loadFixturePosts(locale, contentDir);
}
