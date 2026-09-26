import { BlogScreen } from '@/components/blog-screen';
import { screenMetadata } from '@/lib/metadata';

export const metadata = screenMetadata('en', '/blog');

export default function BlogPage() {
  return <BlogScreen locale="en" />;
}
