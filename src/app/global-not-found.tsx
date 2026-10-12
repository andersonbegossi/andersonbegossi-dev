import { RootDocument } from '@/components/root-document';
import { NotFoundScreen } from '@/components/not-found-screen';
import { defaultLocale } from '@/lib/i18n/locale';
import { localeMetadata } from '@/lib/metadata';

/**
 * One root layout per locale (ADR 0002) means no root layout is left to wrap
 * the 404, so it renders the document itself — `global-not-found` is the file
 * convention for exactly that. Without it a 404 arrives with no `lang`, no
 * theme script and no chrome. A static export serves one 404 for both locales,
 * so it speaks the default one.
 */
export const metadata = localeMetadata(defaultLocale);

export default function GlobalNotFound() {
  return (
    <RootDocument locale={defaultLocale}>
      <NotFoundScreen locale={defaultLocale} />
    </RootDocument>
  );
}
