import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from '../page';
import HomePage from '../../page';
import ArticlePage, { generateMetadata, generateStaticParams } from './page';

vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts'));

async function renderArticle(slug: string) {
  const page = await ArticlePage({ params: Promise.resolve({ slug }) });
  return renderRoute(page, `/pt/blog/${slug}`);
}

describe('Portuguese Article screen', () => {
  it('heads the post in Portuguese', async () => {
    await renderArticle('sharing-code');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Compartilhando código entre três apps React Native em produção',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Arquitetura')).toBeInTheDocument();
    expect(screen.getByText('12 jun 2026 · 8 min de leitura')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Blog' })).toHaveAttribute('href', '/pt/blog');
  });

  it('renders the Portuguese MDX body, code block included', async () => {
    await renderArticle('sharing-code');

    expect(
      screen.getByRole('heading', { level: 2, name: 'O custo de três repositórios' }),
    ).toBeInTheDocument();
    const code = screen.getByText(/^apps\//);
    expect(code.closest('pre')).not.toBeNull();
    expect(code).toHaveTextContent('core/ # regras de negócio, clients de API');
  });

  it('names its tags in Portuguese and switches language to the English post', async () => {
    await renderArticle('sharing-code');

    expect(
      within(screen.getByRole('list', { name: 'Tags' })).getAllByRole('listitem'),
    ).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Mudar idioma' })).toHaveAttribute(
      'href',
      '/blog/sharing-code',
    );
  });
});

describe('Portuguese Article pages', () => {
  it('are generated only for posts published in Portuguese', () => {
    expect(generateStaticParams()).toEqual([{ slug: 'sharing-code' }]);
  });

  it('are where every post link on the Portuguese Blog and Home screens leads', () => {
    const postLinks = () =>
      screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
        .filter((href) => href?.startsWith('/pt/blog/'));

    const { unmount } = renderRoute(<BlogPage />, '/pt/blog');
    expect(postLinks()).toEqual(['/pt/blog/sharing-code']);
    unmount();

    renderRoute(<HomePage />, '/pt');
    expect(postLinks()).toEqual(['/pt/blog/sharing-code']);
  });

  it('point at their own canonical URL and their English original', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'sharing-code' }) });

    expect(metadata.title).toBe(
      'Compartilhando código entre três apps React Native em produção — Anderson Begossi',
    );
    expect(metadata.alternates).toEqual({
      canonical: '/pt/blog/sharing-code/',
      languages: {
        en: '/blog/sharing-code/',
        'pt-BR': '/pt/blog/sharing-code/',
        'x-default': '/blog/sharing-code/',
      },
    });
  });
});
