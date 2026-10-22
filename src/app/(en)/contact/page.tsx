import { ContactScreen } from '@/components/contact-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('en', '/contact');

export default function ContactPage() {
  return <ContactScreen locale="en" />;
}
