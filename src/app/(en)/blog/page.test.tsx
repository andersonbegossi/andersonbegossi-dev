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

  it('lists the React Native environments post', () => {
    renderRoute(<BlogPage />, '/blog');

    expect(
      screen.queryByText('No posts yet — the first one is on its way.'),
    ).not.toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Blog' });
    expect(
      within(list).getByRole('link', {
        name: /How to configure different environments in React Native apps/,
      }),
    ).toHaveAttribute('href', '/blog/react-native-environments');
  });

  it('generates the published article and pairs it with the Portuguese translation', async () => {
    expect(generateStaticParams()).toEqual([{ slug: 'react-native-environments' }]);
    const params = Promise.resolve({ slug: 'react-native-environments' });

    renderRoute(await ArticlePage({ params }), '/blog/react-native-environments');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'How to configure different environments in React Native apps',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'BuildVariants' })).toHaveAttribute(
      'src',
      '/images/blog/react-native-environments/build-variants.png',
    );
    expect(screen.getByText(/signingConfig signingConfigs.debug/).closest('pre')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Switch language' })).toHaveAttribute(
      'href',
      '/pt/blog/react-native-environments',
    );
    expect(await generateMetadata({ params })).toMatchObject({
      title: 'How to configure different environments in React Native apps — Anderson Begossi',
      description:
        'In React Native projects, it is common to work with different environments — such as development, staging, and production.',
      alternates: {
        canonical: '/blog/react-native-environments/',
        languages: {
          en: '/blog/react-native-environments/',
          'pt-BR': '/pt/blog/react-native-environments/',
          'x-default': '/blog/react-native-environments/',
        },
      },
    });
  });
});
