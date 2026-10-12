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

  it('shows the four project cards with description and tech chips', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const cards = screen.getAllByRole('article');
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 2 }).textContent),
    ).toEqual(['Stewart Acid-Base', 'Você + Saúde', 'RN Monorepo Starter', 'begossi.dev']);

    const starter = screen.getByRole('article', { name: 'RN Monorepo Starter' });
    expect(within(starter).getByText(/Production-ready React Native template/)).toBeInTheDocument();
    expect(
      within(within(starter).getByRole('list', { name: /tech/i }))
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual(['Expo', 'Turborepo', 'TypeScript']);
  });

  it('only links begossi.dev to this repository and shows no Live buttons', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const main = screen.getByRole('main');
    const githubLinks = within(main).getAllByRole('link', { name: /GitHub/ });
    expect(githubLinks).toHaveLength(1);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/andersonbegossi/abegossi');
    expect(
      within(screen.getByRole('article', { name: 'begossi.dev' })).getByRole('link', {
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
