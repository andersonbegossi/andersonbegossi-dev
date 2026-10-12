import { AboutScreen } from '@/components/about-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('pt', '/about');

export default function AboutPage() {
  return <AboutScreen locale="pt" />;
}
