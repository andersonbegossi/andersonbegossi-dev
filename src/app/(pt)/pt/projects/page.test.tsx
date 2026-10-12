import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ProjectsPage from './page';

const PT_PROJECTS = '/pt/projects';

describe('Portuguese Projects screen', () => {
  it('shows the screen and the andersonbegossi.dev card in Portuguese', () => {
    renderRoute(<ProjectsPage />, PT_PROJECTS);

    expect(screen.getByRole('heading', { level: 1, name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(
      within(screen.getByRole('article', { name: 'andersonbegossi.dev' })).getByText(
        /Este site — portfólio e blog técnico bilíngue/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'page');
  });

  it('applies the same link policy', () => {
    renderRoute(<ProjectsPage />, PT_PROJECTS);

    const main = screen.getByRole('main');
    const githubLinks = within(main).getAllByRole('link', { name: /GitHub/ });
    expect(githubLinks).toHaveLength(1);
    expect(githubLinks[0]).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi/andersonbegossi.dev',
    );
    expect(
      within(screen.getByRole('article', { name: 'andersonbegossi.dev' })).getByRole('link', {
        name: /GitHub/,
      }),
    ).toBe(githubLinks[0]);

    expect(within(main).queryByRole('link', { name: /Demo/ })).not.toBeInTheDocument();
    for (const link of within(main).getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/ambegossi|apps\.apple\.com/);
    }
  });
});
