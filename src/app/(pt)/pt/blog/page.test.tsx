import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';

describe('Portuguese Blog screen', () => {
  it('introduces the blog in Portuguese and marks Blog active', () => {
    renderRoute(<BlogPage />, '/pt/blog');

    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument();
    expect(
      screen.getByText('Notas sobre React Native, arquitetura e engenharia mobile.'),
    ).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
  });

  it('says posts are coming in Portuguese while none are published', () => {
    renderRoute(<BlogPage />, '/pt/blog');

    expect(
      screen.getByText('Nenhum artigo ainda — o primeiro está a caminho.'),
    ).toBeInTheDocument();
  });
});
