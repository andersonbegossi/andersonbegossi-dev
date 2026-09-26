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

  it('leads with the Portuguese featured post', () => {
    renderRoute(<BlogPage />, '/pt/blog');

    const card = screen.getByRole('link', { name: /★ Destaque/ });
    expect(card).toHaveAttribute('href', '/pt/blog/sharing-code');
    expect(card).toHaveTextContent(
      'Compartilhando código entre três apps React Native em produção',
    );
    expect(card).toHaveTextContent('12 jun 2026 · 8 min de leitura');
  });

  it('lists the remaining Portuguese posts with their metadata', () => {
    renderRoute(<BlogPage />, '/pt/blog');

    const rows = within(screen.getByRole('list', { name: 'Blog' })).getAllByRole('link');

    expect(rows.map((row) => row.getAttribute('href'))).toEqual([
      '/pt/blog/biometric-auth',
      '/pt/blog/pix-checkout',
      '/pt/blog/rn-accessibility',
    ]);
    expect(rows[1]).toHaveTextContent('Pagamentos');
    expect(rows[1]).toHaveTextContent('Adicionando Pix a um checkout mobile');
    expect(rows[1]).toHaveTextContent(/Integrando o pagamento instantâneo brasileiro/);
    expect(rows[1]).toHaveTextContent('9 fev 2026 · 7 min de leitura');
  });
});
