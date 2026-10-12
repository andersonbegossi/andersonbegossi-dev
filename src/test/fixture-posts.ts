import { join } from 'node:path';
import type * as Posts from '@/lib/blog/posts';
import type { Locale } from '@/lib/i18n/locale';

/**
 * The site ships with no posts (ADR 0003), so route tests that need some read
 * these instead: the design's featured post in both locales — its monorepo
 * layout is the reference code block — and one post published in English only.
 *
 * Swaps the content directory, nothing else; mock the loader with
 * `vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts'))`.
 */
export const fixtureContentDir = join(process.cwd(), 'src', 'test', 'fixtures', 'blog');

const actual = await vi.importActual<typeof Posts>('@/lib/blog/posts');

export const featuredPost = actual.featuredPost;

export function loadPosts(locale: Locale, contentDir = fixtureContentDir): Posts.Post[] {
  return actual.loadPosts(locale, contentDir);
}
