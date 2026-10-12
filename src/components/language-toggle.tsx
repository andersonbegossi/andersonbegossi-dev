'use client';

import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { localePath, storeLocale, type Locale } from '@/lib/i18n/locale';
import styles from './toggle.module.css';

/**
 * Navigates to the same screen in the other locale (ADR 0002) rather than
 * swapping strings in place — so it is a real link, and the URL a visitor
 * shares is the language they were reading. The label names the language you
 * would switch *to*, as in the design.
 *
 * A post with no translation has no same screen there, so the toggle lands on
 * that locale's Blog instead: a visible link must resolve (link policy).
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
  const target = untranslated[other].includes(screen) ? '/blog' : screen;

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
