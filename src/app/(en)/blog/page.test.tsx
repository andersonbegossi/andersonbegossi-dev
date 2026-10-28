import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';
import ArticlePage, { generateMetadata, generateStaticParams } from './[slug]/page';

describe('Blog screen', () => {
  it('introduces the blog', () => {
    renderRoute(<BlogPage />, '/blog');

    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument();
    expect(
      screen.getByText('Notes on React Native, architecture and mobile engineering.'),
    ).toBeInTheDocument();
  });

  it('marks Blog as the active nav item', () => {
    renderRoute(<BlogPage />, '/blog');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
  });

  it('says posts are coming while none are published', () => {
    renderRoute(<BlogPage />, '/blog');

    expect(screen.getByText('No posts yet — the first one is on its way.')).toBeInTheDocument();
    expect(screen.queryByText(/★ Featured/)).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Blog' })).not.toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('generates no article while none are published, only an unindexed 404', async () => {
    // A static export refuses a dynamic route with no pages, so one placeholder stands in.
    const generated = generateStaticParams();
    expect(generated).toHaveLength(1);
    const params = Promise.resolve(generated[0]);

    renderRoute(await ArticlePage({ params }), `/blog/${generated[0].slug}`);

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(await generateMetadata({ params })).toMatchObject({
      title: 'Page not found — Anderson Begossi',
      robots: { index: false },
    });
  });
});
