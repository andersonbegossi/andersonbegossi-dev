'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDictionary } from '@/lib/i18n';
import {
  defaultLocale,
  htmlLang,
  type Locale,
  localeFromPathname,
  localePath,
} from '@/lib/i18n/locale';
import { ScreenStub } from './screen-stub';
import styles from './not-found-screen.module.css';

/**
 * The site's 404, in the design's type. A static export serves one 404 document
 * in the default locale. When that file is what answers a `/pt` URL, follow the
 * URL so the copy and the way home match the locale the visitor asked for.
 */
export function NotFoundScreen({ locale }: { locale: Locale }) {
  const resolved = useNotFoundLocale(locale);
  const t = getDictionary(resolved);

  return (
    <>
      <ScreenStub title={t.notFound.title} subtitle={t.notFound.subtitle} />
      <Link href={localePath('/', resolved)} className={styles.home}>
        ← {t.a11y.home}
      </Link>
    </>
  );
}

function useNotFoundLocale(locale: Locale): Locale {
  const [resolved, setResolved] = useState(locale);

  useEffect(() => {
    if (locale !== defaultLocale) return;
    const fromUrl = localeFromPathname(window.location.pathname);
    if (fromUrl === defaultLocale) return;
    setResolved(fromUrl);
    document.documentElement.lang = htmlLang[fromUrl];
  }, [locale]);

  return resolved;
}
