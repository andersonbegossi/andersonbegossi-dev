import { htmlLang, type Locale, localePath } from '@/lib/i18n/locale';

/**
 * A post's canonical URL, without the trailing slash like every other `next/link`
 * href here (ADR 0006 adds it at deploy). Kept apart from the loader so client
 * components can link to posts without pulling in `node:fs`.
 */
export function postPath(slug: string, locale: Locale): string {
  return localePath(`/blog/${slug}`, locale);
}

/**
 * The design's date spellings: "Jun 12, 2026" and "12 jun 2026". Intl gives the
 * English one as is; Portuguese needs its parts reassembled, since pt-BR writes
 * "12 de jun. de 2026". Formatted in UTC so the calendar day never shifts with
 * the build machine's time zone.
 */
export function formatPostDate(date: string, locale: Locale): string {
  const format = new Intl.DateTimeFormat(htmlLang[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const instant = new Date(`${date}T00:00:00Z`);
  if (locale === 'en') return format.format(instant);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    format.formatToParts(instant).find((p) => p.type === type)?.value ?? '';
  return `${part('day')} ${part('month').replace('.', '')} ${part('year')}`;
}
