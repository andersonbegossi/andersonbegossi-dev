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

  it('shows the andersonbegossi.dev and Nathan Minozzo cards', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const cards = screen.getAllByRole('article');
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 2 }).textContent),
    ).toEqual(['andersonbegossi.dev', 'Nathan Minozzo']);

    const site = screen.getByRole('article', { name: 'andersonbegossi.dev' });
    expect(within(site).getByText(/This website — a bilingual, themeable/)).toBeInTheDocument();
    const shot = within(site).getByRole('img', { name: 'ab. mark' });
    expect(shot.getAttribute('src')).toContain('andersonbegossi-dev.webp');
    expect(shot).toHaveAttribute('width', '1280');
    expect(shot).toHaveAttribute('height', '720');
    expect(screen.queryByRole('img', { name: 'Marca ab.' })).not.toBeInTheDocument();
    expect(screen.queryByText('site screenshot')).not.toBeInTheDocument();
    expect(
      within(within(site).getByRole('list', { name: /tech/i }))
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual(['Next.js', 'MDX', 'i18n']);

    const nathan = screen.getByRole('article', { name: 'Nathan Minozzo' });
    expect(
      within(nathan).getByText(
        'Portfolio for Nathan Minozzo, graphic designer and founder of Nozzo Studio — a fast, one-page static site built around branding and art direction.',
      ),
    ).toBeInTheDocument();
    const logo = within(nathan).getByRole('img', { name: 'Nathan Minozzo portfolio logo' });
    expect(logo.getAttribute('src')).toContain('nathan-minozzo.webp');
    expect(logo).toHaveAttribute('width', '1280');
    expect(logo).toHaveAttribute('height', '720');
    expect(
      screen.queryByRole('img', { name: 'Logo do portfólio de Nathan Minozzo' }),
    ).not.toBeInTheDocument();
    expect(
      within(within(nathan).getByRole('list', { name: /tech/i }))
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual(['Astro', 'TypeScript', 'SEO']);
  });

  it('links andersonbegossi.dev to this repository and Nathan Minozzo to the live site', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    const main = screen.getByRole('main');
    const site = screen.getByRole('article', { name: 'andersonbegossi.dev' });
    const nathan = screen.getByRole('article', { name: 'Nathan Minozzo' });

    const githubLinks = within(main).getAllByRole('link', { name: /GitHub/ });
    expect(githubLinks).toHaveLength(1);
    expect(githubLinks[0]).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi/andersonbegossi-dev',
    );
    expect(within(site).getByRole('link', { name: /GitHub/ })).toBe(githubLinks[0]);
    expect(within(site).queryByRole('link', { name: /Live/ })).not.toBeInTheDocument();

    const live = within(nathan).getByRole('link', { name: /Live/ });
    expect(live).toHaveAttribute('href', 'https://nozzo-studio.vercel.app');
    expect(within(nathan).queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
    expect(within(main).getAllByRole('link', { name: /Live/ })).toEqual([live]);

    for (const link of within(main).getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/ambegossi|apps\.apple\.com/);
    }
  });

  it('marks Projects as the current page in the header', () => {
    renderRoute(<ProjectsPage />, PROJECTS);

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  });
});
