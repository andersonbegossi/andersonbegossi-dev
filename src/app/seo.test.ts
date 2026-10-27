import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';

/** Layouts render the document, which loads next/font. The metadata under test does not. */
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));
import { en } from '@/lib/i18n/en';
import { type Locale, localePath, type ScreenPath } from '@/lib/i18n/locale';
import { pt } from '@/lib/i18n/pt';
import { siteConfig } from '@/lib/site-config';
import { metadata as enLayout } from './(en)/layout';
import { metadata as enHome } from './(en)/page';
import { metadata as enAbout } from './(en)/about/page';
import { metadata as enBlog } from './(en)/blog/page';
import { metadata as enContact } from './(en)/contact/page';
import { metadata as enProjects } from './(en)/projects/page';
import { metadata as ptLayout } from './(pt)/layout';
import { metadata as ptAbout } from './(pt)/pt/about/page';
import { metadata as ptBlog } from './(pt)/pt/blog/page';
import { metadata as ptContact } from './(pt)/pt/contact/page';
import { metadata as ptHome } from './(pt)/pt/page';
import { metadata as ptProjects } from './(pt)/pt/projects/page';
import { metadata as notFound } from './global-not-found';
import robots from './robots';
import sitemap from './sitemap';

/**
 * What a visitor's tab and a crawler read for one screen. Titles and
 * descriptions are the dictionary's own sentences, so the test fails if a
 * page invents copy or forgets to export `screenMetadata`.
 */
const pages: {
  locale: Locale;
  screen: ScreenPath;
  metadata: Metadata;
  title: string;
  description: string;
}[] = [
  {
    locale: 'en',
    screen: '/',
    metadata: enHome,
    title: `${siteConfig.author} — ${en.home.role}`,
    description: en.home.bio,
  },
  {
    locale: 'en',
    screen: '/about',
    metadata: enAbout,
    title: `${en.about.title} — ${siteConfig.author}`,
    description: en.about.p1,
  },
  {
    locale: 'en',
    screen: '/projects',
    metadata: enProjects,
    title: `${en.projects.title} — ${siteConfig.author}`,
    description: en.projects.subtitle,
  },
  {
    locale: 'en',
    screen: '/blog',
    metadata: enBlog,
    title: `${en.blog.title} — ${siteConfig.author}`,
    description: en.blog.subtitle,
  },
  {
    locale: 'en',
    screen: '/contact',
    metadata: enContact,
    title: `${en.contact.title} — ${siteConfig.author}`,
    description: en.contact.subtitle,
  },
  {
    locale: 'pt',
    screen: '/',
    metadata: ptHome,
    title: `${siteConfig.author} — ${pt.home.role}`,
    description: pt.home.bio,
  },
  {
    locale: 'pt',
    screen: '/about',
    metadata: ptAbout,
    title: `${pt.about.title} — ${siteConfig.author}`,
    description: pt.about.p1,
  },
  {
    locale: 'pt',
    screen: '/projects',
    metadata: ptProjects,
    title: `${pt.projects.title} — ${siteConfig.author}`,
    description: pt.projects.subtitle,
  },
  {
    locale: 'pt',
    screen: '/blog',
    metadata: ptBlog,
    title: `${pt.blog.title} — ${siteConfig.author}`,
    description: pt.blog.subtitle,
  },
  {
    locale: 'pt',
    screen: '/contact',
    metadata: ptContact,
    title: `${pt.contact.title} — ${siteConfig.author}`,
    description: pt.contact.subtitle,
  },
];

/** Directory URLs (ADR 0006). `localePath` is the prefix rule; the slash is the assertion. */
function canonical(screen: ScreenPath, locale: Locale): string {
  const path = localePath(screen, locale);
  return path.endsWith('/') ? path : `${path}/`;
}

describe('screen metadata', () => {
  it('gives every screen its own title and description, in both locales', () => {
    for (const page of pages) {
      expect(page.metadata.title, `${page.locale} ${page.screen}`).toBe(page.title);
      expect(page.metadata.description, `${page.locale} ${page.screen}`).toBe(page.description);
    }

    for (const locale of ['en', 'pt'] as const) {
      const group = pages.filter((page) => page.locale === locale);
      expect(new Set(group.map((page) => page.metadata.title)).size).toBe(group.length);
      expect(new Set(group.map((page) => page.metadata.description)).size).toBe(group.length);
    }
  });

  it('derives canonical and hreflang from the locale paths, with no host of their own', () => {
    for (const page of pages) {
      expect(page.metadata.alternates, `${page.locale} ${page.screen}`).toEqual({
        canonical: canonical(page.screen, page.locale),
        languages: {
          en: canonical(page.screen, 'en'),
          'pt-BR': canonical(page.screen, 'pt'),
          'x-default': canonical(page.screen, 'en'),
        },
      });
      expect(JSON.stringify(page.metadata), `${page.locale} ${page.screen}`).not.toMatch(/https?:/);
    }
  });

  it('points both layouts at the single base URL (ADR 0005)', () => {
    expect(enLayout.metadataBase).toEqual(new URL(siteConfig.baseUrl));
    expect(ptLayout.metadataBase).toEqual(new URL(siteConfig.baseUrl));
  });
});

describe('sitemap and robots', () => {
  it('lists every static route in both locales and no placeholder article', () => {
    const origin = siteConfig.baseUrl;

    expect(sitemap().map((entry) => entry.url)).toEqual([
      `${origin}/`,
      `${origin}/about/`,
      `${origin}/projects/`,
      `${origin}/blog/`,
      `${origin}/contact/`,
      `${origin}/pt/`,
      `${origin}/pt/about/`,
      `${origin}/pt/projects/`,
      `${origin}/pt/blog/`,
      `${origin}/pt/contact/`,
    ]);
  });

  it('allows indexing and points at the sitemap on the base URL', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    });
  });
});

describe('404 metadata', () => {
  it('names the missing page and asks crawlers not to index it', () => {
    expect(notFound.title).toBe(`${en.notFound.title} — ${siteConfig.author}`);
    expect(notFound.description).toBe(en.notFound.subtitle);
    expect(notFound.metadataBase).toEqual(new URL(siteConfig.baseUrl));
    expect(notFound.robots).toBeUndefined();
  });
});
