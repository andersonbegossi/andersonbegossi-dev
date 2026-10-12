import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';

vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts').then((m) => m.withFixturePosts()));

const sharingCode = 'Compartilhando código entre três apps React Native em produção';
const biometricAuth = 'Autenticação biométrica em React Native, do jeito certo';
const pixCheckout = 'Adicionando Pix a um checkout mobile';
const rnAccessibility = 'Acessibilidade em React Native além dos labels';

function renderBlog() {
  renderRoute(<BlogPage />, '/pt/blog');
  return {
    user: userEvent.setup(),
    search: screen.getByRole('searchbox', { name: 'Buscar artigos' }),
  };
}

function listedTitles(): string[] {
  const list = screen.queryByRole('list', { name: 'Blog' });
  if (!list) return [];
  return [sharingCode, biometricAuth, pixCheckout, rnAccessibility].filter(
    (title) => within(list).queryByText(title) !== null,
  );
}

const pill = (name: string) => screen.getByRole('button', { name });

describe('Portuguese Blog search and category filters', () => {
  it('searches the Portuguese posts', async () => {
    const { user, search } = renderBlog();

    expect(search).toHaveAttribute('placeholder', 'Buscar artigos…');
    await user.type(search, 'BIOMETRIA');

    expect(screen.queryByText('★ Destaque')).not.toBeInTheDocument();
    expect(listedTitles()).toEqual([biometricAuth]);
  });

  it('offers the Portuguese categories as pills', async () => {
    const { user } = renderBlog();

    for (const category of ['Arquitetura', 'Segurança', 'Pagamentos', 'Acessibilidade']) {
      expect(pill(category)).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.queryByRole('button', { name: 'Security' })).not.toBeInTheDocument();

    await user.click(pill('Pagamentos'));

    expect(pill('Pagamentos')).toHaveAttribute('aria-pressed', 'true');
    expect(listedTitles()).toEqual([pixCheckout]);
  });

  it('says nothing was found in Portuguese, and restores the layout once cleared', async () => {
    const { user, search } = renderBlog();

    await user.click(pill('Arquitetura'));
    await user.type(search, 'pix');

    expect(screen.getByText('Nenhum artigo encontrado — tente outra busca.')).toBeInTheDocument();

    await user.clear(search);
    await user.click(pill('Arquitetura'));

    expect(screen.getByText('★ Destaque')).toBeInTheDocument();
    expect(listedTitles()).toEqual([biometricAuth, pixCheckout, rnAccessibility]);
  });
});
