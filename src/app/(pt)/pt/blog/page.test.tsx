import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';
import ArticlePage, { generateMetadata, generateStaticParams } from './[slug]/page';

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

  it('lists the React Native environments post', () => {
    renderRoute(<BlogPage />, '/pt/blog');

    expect(
      screen.queryByText('Nenhum artigo ainda — o primeiro está a caminho.'),
    ).not.toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Blog' });
    expect(
      within(list).getByRole('link', {
        name: /Como configurar diferentes ambientes em apps React Native/,
      }),
    ).toHaveAttribute('href', '/pt/blog/react-native-environments');
  });

  it('generates the published article and pairs it with the English translation', async () => {
    expect(generateStaticParams()).toEqual([{ slug: 'react-native-environments' }]);
    const params = Promise.resolve({ slug: 'react-native-environments' });

    renderRoute(await ArticlePage({ params }), '/pt/blog/react-native-environments');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Como configurar diferentes ambientes em apps React Native',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'BuildVariants' })).toHaveAttribute(
      'src',
      '/images/blog/react-native-environments/build-variants.png',
    );
    expect(screen.getByText(/signingConfig signingConfigs.debug/).closest('pre')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Mudar idioma' })).toHaveAttribute(
      'href',
      '/blog/react-native-environments',
    );
    expect(await generateMetadata({ params })).toMatchObject({
      alternates: {
        canonical: '/pt/blog/react-native-environments/',
        languages: {
          en: '/blog/react-native-environments/',
          'pt-BR': '/pt/blog/react-native-environments/',
          'x-default': '/blog/react-native-environments/',
        },
      },
    });
  });
});
