import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ProjectsPage from './page';

const PT_PROJECTS = '/pt/projects';

describe('Portuguese Projects screen', () => {
  it('shows the screen and the four cards in Portuguese', () => {
    renderRoute(<ProjectsPage />, PT_PROJECTS);

    expect(screen.getByRole('heading', { level: 1, name: 'Projetos' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(
      within(screen.getByRole('article', { name: 'begossi.dev' })).getByText(
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
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/andersonbegossi/abegossi');
    expect(within(main).queryByRole('link', { name: /Demo/ })).not.toBeInTheDocument();
  });
});
