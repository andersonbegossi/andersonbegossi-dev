import { AboutScreen } from '@/components/about-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('en', '/about');

export default function AboutPage() {
  return <AboutScreen locale="en" />;
}
