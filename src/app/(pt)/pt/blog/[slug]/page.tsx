import type { Metadata } from 'next';
import { ArticleScreen, articleParams, findPost } from '@/components/article-screen';
import { NotFoundScreen } from '@/components/not-found-screen';
import { placeholderArticleMetadata, postMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ slug: string }> };

/** Only posts the loader finds get a page; any other slug is the 404 (ADR 0001). */
export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams('pt');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPost('pt', (await params).slug);
  return post ? postMetadata(post) : placeholderArticleMetadata('pt');
}

export default async function ArticlePage({ params }: Props) {
  const post = findPost('pt', (await params).slug);
  /* Only the no-posts placeholder lacks a post. `notFound()` would prerender
     an empty error shell in a static export, so it gets the 404 screen itself. */
  return post ? <ArticleScreen post={post} /> : <NotFoundScreen locale="pt" />;
}
