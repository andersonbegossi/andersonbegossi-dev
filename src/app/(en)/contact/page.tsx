import { ScreenStub } from '@/components/screen-stub';
import { getDictionary } from '@/lib/i18n';
import { screenMetadata } from '@/lib/metadata';

const t = getDictionary('en');

export const metadata = screenMetadata('en', '/contact');

/* Stub until the Contact ticket wires the Web3Forms form. */
export default function ContactPage() {
  return <ScreenStub title={t.contact.title} subtitle={t.contact.subtitle} />;
}
