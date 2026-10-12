/**
 * The locale as it shows up in URLs. English is served at the root and
 * Portuguese under `/pt/` (ADR 0002), so a pathname carries the locale and the
 * screen it points at; `localePath` and `screenFromPathname` are the two
 * directions of that translation, and nothing else may build a `/pt` prefix.
 */
export const locales = ['en', 'pt'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Value for `<html lang>` — `pt` is Brazilian Portuguese (CONTEXT.md glossary). */
export const htmlLang: Record<Locale, string> = { en: 'en', pt: 'pt-BR' };

/** Storage key carried over from the design prototype. */
export const LOCALE_STORAGE_KEY = 'ab-lang';

/**
 * The designed screens (CONTEXT.md), as the locale-independent paths they route
 * at — `/about` is `/about` in English and `/pt/about` in Portuguese. Typing the
 * screen means a page cannot claim a canonical URL the site does not serve.
 */
export const screens = ['/', '/about', '/projects', '/blog', '/contact'] as const;

export type ScreenPath = (typeof screens)[number];

const urlPrefix: Record<Locale, string> = { en: '', pt: '/pt' };

/**
 * The URL a screen has in `locale`. Takes a plain string, not a `ScreenPath`:
 * the language toggle hands it whatever screen the current URL reduces to, and
 * that has to keep working for routes the union does not list yet (blog posts).
 */
export function localePath(screen: string, locale: Locale): string {
  const path = `${urlPrefix[locale]}${screen === '/' ? '' : screen}`;
  return path === '' ? '/' : path;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === urlPrefix.pt || pathname.startsWith(`${urlPrefix.pt}/`) ? 'pt' : 'en';
}

/**
 * The inverse of `localePath`: the screen a URL points at, whatever its locale.
 * Deployed URLs carry a trailing slash (ADR 0006) but `next/link` hrefs in this
 * codebase do not, so both spellings have to reduce to the same screen.
 */
export function screenFromPathname(pathname: string): string {
  const locale = localeFromPathname(pathname);
  const screen = pathname.slice(urlPrefix[locale].length).replace(/\/$/, '');
  return screen === '' ? '/' : screen;
}

/**
 * Records the visitor's choice under the design's key. The URL is what actually
 * decides the language (ADR 0002 rules out a locale redirect at the root), so
 * this is the preference itself, not the mechanism that applies it.
 */
export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Private-mode browsers reject writes; the visitor is still on the URL they chose.
  }
}
