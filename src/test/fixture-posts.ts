import { join } from 'node:path';
import { vi } from 'vitest';
import type { Locale } from '@/lib/i18n/locale';

/**
 * A content directory laid out like `content/blog/` (ADR 0003), holding the
 * design's four seed posts in both locales.
 */
export const fixturePostsDir = join(process.cwd(), 'src', 'test', 'fixtures', 'blog');

/**
 * The site ships with no posts, so Blog tests that need some point the real
 * loader at the fixtures instead:
 *
 *   vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts').then((m) => m.withFixturePosts()));
 */
export async function withFixturePosts() {
  const posts = await vi.importActual<typeof import('@/lib/blog/posts')>('@/lib/blog/posts');
  return { ...posts, loadPosts: (locale: Locale) => posts.loadPosts(locale, fixturePostsDir) };
}
