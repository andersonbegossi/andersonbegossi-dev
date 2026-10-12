import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import { ScreenStub } from './screen-stub';

/** The site's 404 copy in the design's voice, inside whichever document renders it. */
export function NotFoundScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return <ScreenStub title={t.notFound.title} subtitle={t.notFound.subtitle} />;
}
