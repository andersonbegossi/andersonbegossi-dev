import type { Metadata } from 'next';
import { type PostScreenPath, postScreen } from './blog/format';
import type { Post } from './blog/posts';
import { type Dictionary, getDictionary } from './i18n';
import {
  defaultLocale,
  htmlLang,
  localePath,
  type Locale,
  locales,
  type ScreenPath,
} from './i18n/locale';
import { siteConfig } from './site-config';

/** Document title for a named page. Home leads with the author instead. */
function pageTitle(name: string): string {
  return `${name} — ${siteConfig.author}`;
}

/**
 * Title and description for one screen, taken from the dictionary the page
 * already renders. A missing screen is a type error, so a new route cannot
 * ship with the layout's title.
 */
const screenCopy: Record<ScreenPath, (t: Dictionary) => { title: string; description: string }> = {
  '/': (t) => ({
    title: `${siteConfig.author} — ${t.home.role}`,
    description: t.home.bio,
  }),
  '/about': (t) => ({ title: pageTitle(t.about.title), description: t.about.p1 }),
  '/projects': (t) => ({ title: pageTitle(t.projects.title), description: t.projects.subtitle }),
  '/blog': (t) => ({ title: pageTitle(t.blog.title), description: t.blog.subtitle }),
  '/contact': (t) => ({ title: pageTitle(t.contact.title), description: t.contact.subtitle }),
};

/**
 * Title, description and base URL for a locale's root layout. Pages that don't
 * set their own inherit the Home screen's, which is the right fallback for the
 * one placeholder article route and nothing else.
 */
export function localeMetadata(locale: Locale): Metadata {
  const home = screenCopy['/'](getDictionary(locale));

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: home.title,
    description: home.description,
  };
}

/**
 * Title, description, canonical URL and the `hreflang` pair for one screen
 * (ADR 0002). Every page exports this for its own screen path — the layout
 * cannot, since it would then claim the same canonical URL for every page
 * underneath it.
 */
export function screenMetadata(locale: Locale, screen: ScreenPath): Metadata {
  const copy = screenCopy[screen](getDictionary(locale));
  return {
    title: copy.title,
    description: copy.description,
    alternates: alternates(screen, locale, locales),
  };
}

/**
 * An Article screen's title, description, canonical URL and `hreflang` links.
 * A post is published in a locale only where its file exists (ADR 0003), so it
 * pairs with just the translations it has — never one that would 404.
 */
export function postMetadata(post: Post): Metadata {
  return {
    title: pageTitle(post.title),
    description: post.excerpt,
    alternates: alternates(postScreen(post.slug), post.locale, post.locales),
  };
}

function alternates(
  screen: ScreenPath | PostScreenPath,
  locale: Locale,
  published: readonly Locale[],
): Metadata['alternates'] {
  /** No locale redirect at the root (ADR 0002), so English is the default where it exists. */
  const fallback = published.includes(defaultLocale) ? defaultLocale : locale;
  return {
    canonical: canonicalUrl(screen, locale),
    languages: {
      ...Object.fromEntries(published.map((l) => [htmlLang[l], canonicalUrl(screen, l)])),
      'x-default': canonicalUrl(screen, fallback),
    },
  };
}

/** The site publishes directory-style URLs (ADR 0006), so canonicals end in a slash. */
function canonicalUrl(screen: ScreenPath | PostScreenPath, locale: Locale): string {
  const path = localePath(screen, locale);
  return path.endsWith('/') ? path : `${path}/`;
}

/** Same path as a canonical, resolved against the one base URL (ADR 0005). */
export function absoluteUrl(screen: ScreenPath | PostScreenPath, locale: Locale): string {
  return new URL(canonicalUrl(screen, locale), siteConfig.baseUrl).href;
}

/**
 * The global 404 has no layout of its own, so it carries the base URL.
 * Next injects `noindex` for this file. Setting `robots` here as well ships
 * a second tag.
 */
export function notFoundMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    ...localeMetadata(locale),
    title: pageTitle(t.notFound.title),
    description: t.notFound.subtitle,
  };
}
