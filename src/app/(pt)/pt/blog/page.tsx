import { BlogScreen } from '@/components/blog-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('pt', '/blog');

export default function BlogPage() {
  return <BlogScreen locale="pt" />;
}
