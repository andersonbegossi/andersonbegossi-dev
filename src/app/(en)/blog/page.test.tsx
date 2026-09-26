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

  it('leads with the featured post as a large card', () => {
    renderRoute(<BlogPage />, '/blog');

    const card = screen.getByRole('link', { name: /★ Featured/ });
    expect(card).toHaveAttribute('href', '/blog/sharing-code');
    expect(card).toHaveTextContent('Sharing code between three production React Native apps');
    expect(card).toHaveTextContent(
      'How we cut development time by ~30% with a monorepo, private NPM packages and a shared design system.',
    );
    expect(card).toHaveTextContent('Jun 12, 2026 · 8 min read');
  });

  it('lists the remaining posts newest first with their metadata', () => {
    renderRoute(<BlogPage />, '/blog');

    const list = screen.getByRole('list', { name: 'Blog' });
    const rows = within(list).getAllByRole('link');

    expect(rows.map((row) => row.getAttribute('href'))).toEqual([
      '/blog/biometric-auth',
      '/blog/pix-checkout',
      '/blog/rn-accessibility',
    ]);
    expect(rows[0]).toHaveTextContent('Security');
    expect(rows[0]).toHaveTextContent('Biometric authentication in React Native, done right');
    expect(rows[0]).toHaveTextContent(/Face ID and fingerprint login are easy to demo/);
    expect(rows[0]).toHaveTextContent('Apr 28, 2026 · 6 min read');
    expect(rows[2]).toHaveTextContent('Accessibility');
    expect(rows[2]).toHaveTextContent('Dec 3, 2025 · 5 min read');
  });

  it('does not repeat the featured post in the list', () => {
    renderRoute(<BlogPage />, '/blog');

    const list = screen.getByRole('list', { name: 'Blog' });
    expect(within(list).queryByText(/Sharing code/)).not.toBeInTheDocument();
  });
});
