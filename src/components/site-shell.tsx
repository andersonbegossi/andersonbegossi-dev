import type { ReactNode } from 'react';
import { postScreen } from '@/lib/blog/format';
import { loadPosts } from '@/lib/blog/posts';
import { type Locale, locales } from '@/lib/i18n/locale';
import { Header } from './header';
import { Footer } from './footer';
import styles from './site-shell.module.css';

/**
 * The chrome every route renders inside. Kept out of `layout.tsx` so tests can
 * render a route in its real surroundings without an `<html>` document.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header untranslated={untranslatedPosts()} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Per locale, the post screens that exist only in another locale (ADR 0003 lets
 * a post skip a translation). The header is a client component and cannot read
 * `content/blog/`, so the shell hands it the gaps its language toggle must avoid.
 */
function untranslatedPosts(): Record<Locale, string[]> {
  const gaps: Record<Locale, string[]> = { en: [], pt: [] };
  for (const post of locales.flatMap((locale) => loadPosts(locale))) {
    for (const locale of locales) {
      if (!post.locales.includes(locale)) gaps[locale].push(postScreen(post.slug));
    }
  }
  return gaps;
}
