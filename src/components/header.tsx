'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Dictionary, getDictionary } from '@/lib/i18n';
import {
  type Locale,
  localeFromPathname,
  localePath,
  screenFromPathname,
  type ScreenPath,
} from '@/lib/i18n/locale';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';
import styles from './header.module.css';

/** Screen path → the `nav` key holding its label, so a nav item is one entry. */
const navItems = [
  ['/about', 'about'],
  ['/projects', 'projects'],
  ['/blog', 'blog'],
] as const satisfies readonly (readonly [ScreenPath, keyof Dictionary['nav']])[];

/**
 * The chrome reads its locale off the URL rather than taking a prop: every
 * screen is routed per locale (ADR 0002), so the pathname already says which
 * language the visitor is reading and no page has to thread it down.
 */
export function Header({ untranslated }: { untranslated: Record<Locale, readonly string[]> }) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const screen = screenFromPathname(pathname);
  const t = getDictionary(locale);

  return (
    <header className={styles.header}>
      <nav aria-label={t.a11y.mainNav} className={styles.nav}>
        <Link href={localePath('/', locale)} aria-label={t.a11y.home} className={styles.brand}>
          ab<span className={styles.brandDot}>.</span>
        </Link>
        <div className={styles.links}>
          {navItems.map(([navScreen, label]) => (
            <Link
              key={navScreen}
              href={localePath(navScreen, locale)}
              className={styles.link}
              aria-current={navScreen === screen ? 'page' : undefined}
            >
              {t.nav[label]}
            </Link>
          ))}
        </div>
        <LanguageToggle locale={locale} screen={screen} untranslated={untranslated} />
        <ThemeToggle locale={locale} />
      </nav>
    </header>
  );
}
