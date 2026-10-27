import { RootDocument } from '@/components/root-document';
import { NotFoundScreen } from '@/components/not-found-screen';
import { defaultLocale } from '@/lib/i18n/locale';
import { notFoundMetadata } from '@/lib/metadata';

/**
 * One root layout per locale (ADR 0002) means no root layout is left to wrap
 * the 404, so it renders the document itself — `global-not-found` is the file
 * convention for exactly that. Without it a 404 arrives with no `lang`, no
 * theme script and no chrome. A static export serves one 404 for both locales.
 * The screen follows a `/pt` URL once it can see it; the document starts in
 * the default locale because that is the file the host has.
 */
export const metadata = notFoundMetadata(defaultLocale);

export default function GlobalNotFound() {
  return (
    <RootDocument locale={defaultLocale}>
      <NotFoundScreen locale={defaultLocale} />
    </RootDocument>
  );
}
