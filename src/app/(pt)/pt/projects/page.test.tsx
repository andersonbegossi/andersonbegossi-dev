import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ProjectsPage from './page';

const PT_PROJECTS = '/pt/projects';

describe('Portuguese Projects screen', () => {
  it('shows the andersonbegossi.dev and Nathan Minozzo cards in Portuguese', () => {
    renderRoute(<ProjectsPage />, PT_PROJECTS);

    expect(screen.getByRole('heading', { level: 1, name: 'Projetos' })).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('article')
        .map((card) => within(card).getByRole('heading', { level: 2 }).textContent),
    ).toEqual(['andersonbegossi.dev', 'Nathan Minozzo']);
    const site = screen.getByRole('article', { name: 'andersonbegossi.dev' });
    expect(
      within(site).getByText(/Este site — portfólio e blog técnico bilíngue/),
    ).toBeInTheDocument();
    const shot = within(site).getByRole('img', { name: 'Marca ab.' });
    expect(shot.getAttribute('src')).toContain('andersonbegossi-dev.webp');
    expect(shot).toHaveAttribute('width', '1280');
    expect(shot).toHaveAttribute('height', '720');
    expect(screen.queryByRole('img', { name: 'ab. mark' })).not.toBeInTheDocument();
    expect(screen.queryByText('screenshot do site')).not.toBeInTheDocument();

    const nathan = screen.getByRole('article', { name: 'Nathan Minozzo' });
    expect(
      within(nathan).getByText(
        'Portfólio do Nathan Minozzo, designer gráfico e fundador do Nozzo Studio — site estático de uma página, rápido e construído em torno de branding e direção de arte.',
      ),
    ).toBeInTheDocument();
    const logo = within(nathan).getByRole('img', { name: 'Logo do portfólio de Nathan Minozzo' });
    expect(logo.getAttribute('src')).toContain('nathan-minozzo.webp');
    expect(logo).toHaveAttribute('width', '1280');
    expect(logo).toHaveAttribute('height', '720');
    expect(
      screen.queryByRole('img', { name: 'Nathan Minozzo portfolio logo' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'page');
  });

  it('applies the same link policy', () => {
    renderRoute(<ProjectsPage />, PT_PROJECTS);

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
    expect(within(site).queryByRole('link', { name: /Demo/ })).not.toBeInTheDocument();

    const live = within(nathan).getByRole('link', { name: /Demo/ });
    expect(live).toHaveAttribute('href', 'https://nozzo-studio.vercel.app');
    expect(within(nathan).queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
    expect(within(main).getAllByRole('link', { name: /Demo/ })).toEqual([live]);

    for (const link of within(main).getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/ambegossi|apps\.apple\.com/);
    }
  });
});
