import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { featuredPost, loadPosts } from './posts';

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

type Frontmatter = {
  title?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  minutes?: number;
  featured?: boolean;
};

const complete: Required<Frontmatter> = {
  title: 'A post',
  excerpt: 'What it is about.',
  date: '2026-01-01',
  category: 'Architecture',
  tags: ['react-native'],
  minutes: 4,
  featured: false,
};

/** A content directory laid out as ADR 0003 describes: `<slug>/<locale>.mdx`. */
function contentDir(files: Record<string, { frontmatter: Frontmatter; body?: string }>): string {
  const dir = mkdtempSync(join(tmpdir(), 'posts-'));
  dirs.push(dir);
  for (const [file, { frontmatter, body = 'Body.' }] of Object.entries(files)) {
    const yaml = Object.entries(frontmatter)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n');
    mkdirSync(join(dir, file, '..'), { recursive: true });
    writeFileSync(join(dir, file), `---\n${yaml}\n---\n\n${body}\n`);
  }
  return dir;
}

describe('loadPosts', () => {
  it('turns a post file into a typed post', () => {
    const dir = contentDir({
      'sharing-code/en.mdx': {
        frontmatter: {
          title: 'Sharing code',
          excerpt: 'How we cut development time.',
          date: '2026-06-12',
          category: 'Architecture',
          tags: ['react-native', 'monorepo'],
          minutes: 8,
          featured: true,
        },
        body: 'At Bamse I work on three apps.',
      },
    });

    expect(loadPosts('en', dir)).toEqual([
      {
        slug: 'sharing-code',
        locale: 'en',
        title: 'Sharing code',
        excerpt: 'How we cut development time.',
        date: '2026-06-12',
        category: 'Architecture',
        tags: ['react-native', 'monorepo'],
        minutes: 8,
        featured: true,
        locales: ['en'],
        body: 'At Bamse I work on three apps.',
      },
    ]);
  });

  it('pairs a post across locales and publishes it only where its file exists', () => {
    const dir = contentDir({
      'both/en.mdx': { frontmatter: { ...complete, title: 'In English' } },
      'both/pt.mdx': { frontmatter: { ...complete, title: 'Em português' } },
      'english-only/en.mdx': { frontmatter: complete },
    });

    const en = loadPosts('en', dir);
    const pt = loadPosts('pt', dir);

    expect(en.map((post) => [post.slug, post.locales])).toEqual(
      expect.arrayContaining([
        ['both', ['en', 'pt']],
        ['english-only', ['en']],
      ]),
    );
    expect(pt).toHaveLength(1);
    expect(pt[0]).toMatchObject({ slug: 'both', title: 'Em português', locales: ['en', 'pt'] });
  });

  it('orders posts newest first', () => {
    const dir = contentDir({
      'middle/en.mdx': { frontmatter: { ...complete, date: '2026-02-09' } },
      'oldest/en.mdx': { frontmatter: { ...complete, date: '2025-12-03' } },
      'newest/en.mdx': { frontmatter: { ...complete, date: '2026-06-12' } },
    });

    expect(loadPosts('en', dir).map((post) => post.slug)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('reads an unquoted YAML date as the same calendar day', () => {
    const dir = contentDir({ 'post/en.mdx': { frontmatter: complete } });
    writeFileSync(
      join(dir, 'post/en.mdx'),
      '---\ntitle: T\nexcerpt: E\ndate: 2026-04-28\ncategory: C\ntags: [a]\nminutes: 6\nfeatured: false\n---\nBody\n',
    );

    expect(loadPosts('en', dir)[0].date).toBe('2026-04-28');
  });

  it.each(Object.keys(complete))('rejects a post missing `%s`', (field) => {
    const { [field as keyof Frontmatter]: _, ...incomplete } = complete;
    const dir = contentDir({ 'broken/en.mdx': { frontmatter: incomplete } });

    expect(() => loadPosts('en', dir)).toThrow(`broken/en.mdx: frontmatter \`${field}\``);
  });
});

describe('featuredPost', () => {
  it('picks the newest post marked featured', () => {
    const dir = contentDir({
      'old-featured/en.mdx': { frontmatter: { ...complete, date: '2025-01-01', featured: true } },
      'new-featured/en.mdx': { frontmatter: { ...complete, date: '2026-01-01', featured: true } },
      'newest-plain/en.mdx': { frontmatter: { ...complete, date: '2026-09-01' } },
    });

    expect(featuredPost(loadPosts('en', dir))?.slug).toBe('new-featured');
  });

  it('has nothing to feature when no post is marked', () => {
    const dir = contentDir({ 'plain/en.mdx': { frontmatter: complete } });

    expect(featuredPost(loadPosts('en', dir))).toBeUndefined();
  });
});

describe('the seed posts in content/blog', () => {
  it.each(['en', 'pt'] as const)('publishes all four designed posts in %s', (locale) => {
    const posts = loadPosts(locale);

    expect(posts.map((post) => post.slug)).toEqual([
      'sharing-code',
      'biometric-auth',
      'pix-checkout',
      'rn-accessibility',
    ]);
    for (const post of posts) expect(post.locales).toEqual(['en', 'pt']);
    expect(featuredPost(posts)?.slug).toBe('sharing-code');
  });

  it('carries the featured post’s code block in both locales', () => {
    for (const locale of ['en', 'pt'] as const) {
      const body = loadPosts(locale)[0].body;
      expect(body).toContain('```text\napps/\n  dental-cremer/');
      expect(body).toContain('packages/\n  ui/          # design system (Styled Components)');
    }
  });
});
