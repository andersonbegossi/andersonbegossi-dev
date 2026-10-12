import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from '../page';
import HomePage from '../../page';
import ArticlePage, { generateMetadata, generateStaticParams } from './page';

vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts'));

async function renderArticle(slug: string) {
  const page = await ArticlePage({ params: Promise.resolve({ slug }) });
  return renderRoute(page, `/blog/${slug}`);
}

describe('Article screen', () => {
  it('heads the post with its category, title, date and reading time', async () => {
    await renderArticle('sharing-code');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Sharing code between three production React Native apps',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('Jun 12, 2026 · 8 min read')).toBeInTheDocument();
  });

  it('leads back to the Blog', async () => {
    await renderArticle('sharing-code');

    expect(screen.getByRole('link', { name: '← Blog' })).toHaveAttribute('href', '/blog');
  });

  it('renders the MDX body as section headings, paragraphs and code blocks', async () => {
    await renderArticle('sharing-code');

    expect(
      screen.getByRole('heading', { level: 2, name: 'The cost of three repos' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^At Bamse I work on three e-commerce apps/)).toBeInTheDocument();

    const code = screen.getByText(/^apps\//);
    expect(code.closest('pre')).not.toBeNull();
    expect(code.textContent).toBe(
      [
        'apps/',
        '  dental-cremer/',
        '  dental-speed/',
        '  utilidades-clinicas/',
        'packages/',
        '  ui/          # design system (Styled Components)',
        '  core/        # business rules, API clients',
        '  config/      # eslint, tsconfig, jest presets',
        '',
      ].join('\n'),
    );
  });

  it('ends with the post’s tags', async () => {
    await renderArticle('sharing-code');

    const tags = screen.getByRole('list', { name: 'Tags' });
    expect(
      within(tags)
        .getAllByRole('listitem')
        .map((tag) => tag.textContent),
    ).toEqual(['#react-native', '#monorepo', '#design-system']);
  });

  it('switches language to the same post in Portuguese', async () => {
    await renderArticle('sharing-code');

    expect(screen.getByRole('link', { name: 'Switch language' })).toHaveAttribute(
      'href',
      '/pt/blog/sharing-code',
    );
  });

  it('switches a post published only in English to the Portuguese Blog (link policy)', async () => {
    await renderArticle('biometric-auth');

    expect(screen.getByRole('link', { name: 'Switch language' })).toHaveAttribute(
      'href',
      '/pt/blog',
    );
  });
});

describe('Article pages', () => {
  it('are where every post link on the Blog and Home screens leads', () => {
    const generated = generateStaticParams().map(({ slug }) => `/blog/${slug}`);
    const postLinks = () =>
      screen
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
        .filter((href) => href?.startsWith('/blog/'));

    const { unmount } = renderRoute(<BlogPage />, '/blog');
    expect(postLinks().sort()).toEqual([...generated].sort());
    unmount();

    renderRoute(<HomePage />, '/');
    expect(postLinks().sort()).toEqual([...generated].sort());
  });

  it('are generated for every English post', () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([{ slug: 'sharing-code' }, { slug: 'biometric-auth' }]),
    );
    expect(generateStaticParams()).toHaveLength(2);
  });

  it('title the document after the post and pair it only with translations that exist', async () => {
    const paired = await generateMetadata({ params: Promise.resolve({ slug: 'sharing-code' }) });
    expect(paired).toMatchObject({
      title: 'Sharing code between three production React Native apps — Anderson Begossi',
      description:
        'How we cut development time by ~30% with a monorepo, private NPM packages and a shared design system.',
      alternates: {
        canonical: '/blog/sharing-code/',
        languages: {
          en: '/blog/sharing-code/',
          'pt-BR': '/pt/blog/sharing-code/',
          'x-default': '/blog/sharing-code/',
        },
      },
    });

    const single = await generateMetadata({ params: Promise.resolve({ slug: 'biometric-auth' }) });
    expect(single.alternates?.languages).toEqual({
      en: '/blog/biometric-auth/',
      'x-default': '/blog/biometric-auth/',
    });
  });
});
