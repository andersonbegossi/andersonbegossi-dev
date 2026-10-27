import { afterEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { en } from '@/lib/i18n/en';
import { pt } from '@/lib/i18n/pt';
import { renderRoute } from '@/test/render-route';
import { NotFoundScreen } from './not-found-screen';

afterEach(() => {
  document.documentElement.lang = 'en';
  window.history.pushState({}, '', '/');
});

describe('404 screen', () => {
  it('offers a way home in the language of the page', () => {
    renderRoute(<NotFoundScreen locale="en" />, '/nope');

    expect(screen.getByRole('heading', { level: 1, name: en.notFound.title })).toBeInTheDocument();
    expect(screen.getByText(en.notFound.subtitle)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `← ${en.a11y.home}` })).toHaveAttribute('href', '/');
  });

  it('speaks Portuguese on a Portuguese page', () => {
    renderRoute(<NotFoundScreen locale="pt" />, '/pt/blog/_');

    expect(screen.getByRole('heading', { level: 1, name: pt.notFound.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `← ${pt.a11y.home}` })).toHaveAttribute('href', '/pt');
  });

  it('follows a /pt URL when the one static 404 was rendered in English', async () => {
    window.history.pushState({}, '', '/pt/nope/');
    renderRoute(<NotFoundScreen locale="en" />, '/pt/nope/');

    expect(
      await screen.findByRole('heading', { level: 1, name: pt.notFound.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `← ${pt.a11y.home}` })).toHaveAttribute('href', '/pt');
    expect(document.documentElement).toHaveAttribute('lang', 'pt-BR');
  });
});
