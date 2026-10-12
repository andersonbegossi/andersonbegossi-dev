import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { type Locale, locales } from '@/lib/i18n/locale';

/**
 * A Post (CONTEXT.md) in one locale: the frontmatter ADR 0003 fixes, plus the
 * MDX body left uncompiled for the Article screen to render.
 */
export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  /** Calendar date as `YYYY-MM-DD`; screens format it per locale. */
  date: string;
  category: string;
  tags: string[];
  minutes: number;
  featured: boolean;
  /** Every locale this post is published in — its file exists (ADR 0003). */
  locales: Locale[];
  body: string;
};

/** A post without its body: what an index of posts shows, and all a client component needs. */
export type PostSummary = Omit<Post, 'body'>;

const defaultContentDir = join(process.cwd(), 'content', 'blog');

/**
 * The content seam: every post published in `locale`, newest first. It is the
 * only reader of `content/blog/`, so pages, search and the sitemap all see the
 * same posts. A malformed file throws, which fails the static build rather
 * than shipping a half-rendered post.
 */
export function loadPosts(locale: Locale, contentDir = defaultContentDir): Post[] {
  // Git keeps no empty directories: with every post removed, `content/blog/` is gone.
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap(({ name: slug }) => {
      const file = join(contentDir, slug, `${locale}.mdx`);
      if (!existsSync(file)) return [];
      const published = locales.filter((l) => existsSync(join(contentDir, slug, `${l}.mdx`)));
      return [parsePost(file, slug, locale, published)];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function parsePost(file: string, slug: string, locale: Locale, published: Locale[]): Post {
  const { data, content } = matter(readFileSync(file, 'utf8'));
  const fail = (field: string, expected: string): never => {
    throw new Error(`${file}: frontmatter \`${field}\` must be ${expected}`);
  };
  const text = (field: string): string =>
    typeof data[field] === 'string' && data[field] !== '' ? data[field] : fail(field, 'a string');

  return {
    slug,
    locale,
    title: text('title'),
    excerpt: text('excerpt'),
    date: calendarDate(data.date) ?? fail('date', 'a YYYY-MM-DD date'),
    category: text('category'),
    tags:
      Array.isArray(data.tags) && data.tags.every((tag) => typeof tag === 'string')
        ? data.tags
        : fail('tags', 'a list of strings'),
    minutes:
      Number.isInteger(data.minutes) && data.minutes > 0
        ? data.minutes
        : fail('minutes', 'a positive integer'),
    featured: typeof data.featured === 'boolean' ? data.featured : fail('featured', 'a boolean'),
    locales: published,
    body: content.trim(),
  };
}

/** YAML reads an unquoted `2026-06-12` as a Date at UTC midnight; accept both spellings. */
function calendarDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return undefined;
}

/** The post that leads the Blog screen: the newest one marked `featured` (user story 22). */
export function featuredPost<P extends Pick<Post, 'featured'>>(posts: readonly P[]): P | undefined {
  return posts.find((post) => post.featured);
}
