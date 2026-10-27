'use client';

import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { localePath, screens, storeLocale, type Locale } from '@/lib/i18n/locale';
import styles from './toggle.module.css';

/**
 * Navigates to the same screen in the other locale (ADR 0002) rather than
 * swapping strings in place — so it is a real link, and the URL a visitor
 * shares is the language they were reading. The label names the language you
 * would switch *to*, as in the design.
 *
 * A post with no translation has no same screen there, so the toggle lands on
 * that locale's Blog instead. An unknown path (the 404, including the static
 * file's own `/_not-found`) is not a screen either, so the toggle lands on
 * Home. A visible link must resolve (link policy).
 */
export function LanguageToggle({
  locale,
  screen,
  untranslated,
}: {
  locale: Locale;
  screen: string;
  /** Per locale, the post screens that do not exist in it. */
  untranslated: Record<Locale, readonly string[]>;
}) {
  const other: Locale = locale === 'en' ? 'pt' : 'en';
  const target = otherScreen(screen, other, untranslated);

  return (
    <Link
      href={localePath(target, other)}
      hrefLang={other}
      onClick={() => storeLocale(other)}
      aria-label={getDictionary(locale).a11y.switchLanguage}
      className={styles.toggle}
    >
      {other.toUpperCase()}
    </Link>
  );
}

/**
 * Where the toggle points. A designed screen or a blog post keeps its path.
 * Anything else would 404 in the other locale too, so it goes Home.
 */
function otherScreen(
  screen: string,
  other: Locale,
  untranslated: Record<Locale, readonly string[]>,
): string {
  if (untranslated[other].includes(screen)) return '/blog';
  if ((screens as readonly string[]).includes(screen) || screen.startsWith('/blog/')) return screen;
  return '/';
}
