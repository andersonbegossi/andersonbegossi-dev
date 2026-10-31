import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ProjectsPage from './page';

const PROJECTS = '/projects';

describe('Projects screen', () => {
  it('introduces the screen with its title and subtitle', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText(/Personal projects and apps I’ve designed/)).toBeInTheDocument();
  });

  it('shows only the andersonbegossi.dev card with description and tech chips', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const cards = screen.getAllByRole('article');
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 2 }).textContent),
    ).toEqual(['andersonbegossi.dev']);

    const site = screen.getByRole('article', { name: 'andersonbegossi.dev' });
    expect(within(site).getByText(/This website — a bilingual, themeable/)).toBeInTheDocument();
    const shot = within(site).getByRole('img', { name: 'Home page of andersonbegossi.dev' });
    expect(shot.getAttribute('src')).toContain('andersonbegossi-dev.webp');
    expect(shot).toHaveAttribute('width', '1280');
    expect(shot).toHaveAttribute('height', '720');
    expect(
      screen.queryByRole('img', { name: 'Página inicial do andersonbegossi.dev' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('site screenshot')).not.toBeInTheDocument();
    expect(
      within(within(site).getByRole('list', { name: /tech/i }))
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual(['Next.js', 'MDX', 'i18n']);
  });

  it('links andersonbegossi.dev to this repository and shows no Live buttons', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const main = screen.getByRole('main');
    const githubLinks = within(main).getAllByRole('link', { name: /GitHub/ });
    expect(githubLinks).toHaveLength(1);
    expect(githubLinks[0]).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi/andersonbegossi-dev',
    );
    expect(
      within(screen.getByRole('article', { name: 'andersonbegossi.dev' })).getByRole('link', {
        name: /GitHub/,
      }),
    ).toBe(githubLinks[0]);

    expect(within(main).queryByRole('link', { name: /Live/ })).not.toBeInTheDocument();
    for (const link of within(main).getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/ambegossi|apps\.apple\.com/);
    }
  });

  it('marks Projects as the current page in the header', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });
});
