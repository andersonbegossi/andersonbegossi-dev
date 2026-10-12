import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderRoute } from '@/test/render-route';
import BlogPage from './page';

vi.mock('@/lib/blog/posts', () => import('@/test/fixture-index-posts'));

const sharingCode = 'Sharing code between three production React Native apps';
const biometricAuth = 'Biometric authentication in React Native, done right';
const pixCheckout = 'Adding Pix to a mobile checkout';
const rnAccessibility = 'React Native accessibility beyond labels';

function renderBlog() {
  renderRoute(<BlogPage />, '/blog');
  return {
    user: userEvent.setup(),
    search: screen.getByRole('searchbox', { name: 'Search articles' }),
  };
}

/** The title of the post on the featured card, or undefined while the card is hidden. */
function featuredTitle(): string | undefined {
  const card = screen.queryByRole('link', { name: /^★ Featured/ });
  if (!card) return undefined;
  return [sharingCode, biometricAuth, pixCheckout, rnAccessibility].find(
    (title) => within(card).queryByText(title) !== null,
  );
}

/** Titles of the posts listed as rows, newest first. */
function listedTitles(): string[] {
  const list = screen.queryByRole('list', { name: 'Blog' });
  if (!list) return [];
  return [sharingCode, biometricAuth, pixCheckout, rnAccessibility].filter(
    (title) => within(list).queryByText(title) !== null,
  );
}

const pill = (name: string) => screen.getByRole('button', { name });

describe('Blog search and category filters', () => {
  it('shows the featured card above the other posts until a filter is applied', () => {
    renderBlog();

    expect(featuredTitle()).toBe(sharingCode);
    expect(listedTitles()).toEqual([biometricAuth, pixCheckout, rnAccessibility]);
    expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search articles…');
  });

  it('offers one pill per category, none of them active', () => {
    renderBlog();

    for (const category of ['Architecture', 'Security', 'Payments', 'Accessibility']) {
      expect(pill(category)).toHaveAttribute('aria-pressed', 'false');
    }
  });

  it.each([
    ['title', 'done right', [biometricAuth]],
    ['excerpt', 'fingerprint', [biometricAuth]],
    ['category', 'payments', [pixCheckout]],
    ['tags', 'a11y', [rnAccessibility]],
  ])('narrows the list as you type, matching the %s', async (_, query, expected) => {
    const { user, search } = renderBlog();

    await user.type(search, query);

    expect(listedTitles()).toEqual(expected);
  });

  it('ignores case', async () => {
    const { user, search } = renderBlog();

    await user.type(search, 'REACT NATIVE');

    expect(listedTitles()).toEqual([sharingCode, biometricAuth, rnAccessibility]);
  });

  it('hides the featured card while filtering and lists the featured post when it matches', async () => {
    const { user, search } = renderBlog();

    await user.type(search, 'monorepo');

    expect(featuredTitle()).toBeUndefined();
    expect(listedTitles()).toEqual([sharingCode]);
  });

  it('filters by a category pill and toggles it off on a second click', async () => {
    const { user } = renderBlog();

    await user.click(pill('Security'));

    expect(pill('Security')).toHaveAttribute('aria-pressed', 'true');
    expect(featuredTitle()).toBeUndefined();
    expect(listedTitles()).toEqual([biometricAuth]);

    await user.click(pill('Security'));

    expect(pill('Security')).toHaveAttribute('aria-pressed', 'false');
    expect(featuredTitle()).toBe(sharingCode);
    expect(listedTitles()).toEqual([biometricAuth, pixCheckout, rnAccessibility]);
  });

  it('keeps one category active at a time', async () => {
    const { user } = renderBlog();

    await user.click(pill('Security'));
    await user.click(pill('Architecture'));

    expect(pill('Security')).toHaveAttribute('aria-pressed', 'false');
    expect(pill('Architecture')).toHaveAttribute('aria-pressed', 'true');
    expect(listedTitles()).toEqual([sharingCode]);
  });

  it('combines the category with the query', async () => {
    const { user, search } = renderBlog();

    await user.type(search, 'react-native');
    await user.click(pill('Accessibility'));

    expect(listedTitles()).toEqual([rnAccessibility]);
  });

  it('says nothing was found when no post matches', async () => {
    const { user, search } = renderBlog();

    await user.click(pill('Payments'));
    await user.type(search, 'biometric');

    expect(screen.getByText('No articles found — try another search.')).toBeInTheDocument();
    expect(featuredTitle()).toBeUndefined();
    expect(listedTitles()).toEqual([]);
  });

  it('restores the featured layout once the filters are cleared', async () => {
    const { user, search } = renderBlog();

    await user.type(search, 'kubernetes');
    await user.clear(search);

    expect(screen.queryByText('No articles found — try another search.')).not.toBeInTheDocument();
    expect(featuredTitle()).toBe(sharingCode);
    expect(listedTitles()).toEqual([biometricAuth, pixCheckout, rnAccessibility]);
  });

  it('treats a query of only spaces as no query', async () => {
    const { user, search } = renderBlog();

    await user.type(search, '   ');

    expect(featuredTitle()).toBe(sharingCode);
  });
});
