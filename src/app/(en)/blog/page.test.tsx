import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';

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
  });
});
