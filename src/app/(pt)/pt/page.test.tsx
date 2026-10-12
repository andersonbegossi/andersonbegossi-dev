import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import HomePage from './page';

const PT_HOME = '/pt';

describe('Portuguese Home screen', () => {
  it('introduces Anderson in Portuguese', () => {
    renderRoute(<HomePage />, PT_HOME);

    expect(screen.getByRole('heading', { level: 1, name: 'Anderson Begossi' })).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor Mobile Sênior/)).toBeInTheDocument();
    expect(screen.getByText(/Construo aplicativos mobile usados por milhares/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bamse' })).toHaveAttribute(
      'href',
      'https://www.bamse.co/',
    );
  });

  it('shows the availability note in Portuguese', () => {
    renderRoute(<HomePage />, PT_HOME);

    expect(screen.getByText('aberto a oportunidades & freelance')).toBeInTheDocument();
  });

  it('keeps its actions inside the Portuguese locale', () => {
    renderRoute(<HomePage />, PT_HOME);

    const download = screen.getByRole('link', { name: /Baixar currículo/ });
    expect(download).toHaveAttribute('href', '/Anderson-Begossi-Curriculo.pdf');
    expect(download).toHaveAttribute('download', 'Anderson-Begossi-Curriculo.pdf');
    expect(screen.getByRole('link', { name: /Fale comigo/ })).toHaveAttribute(
      'href',
      '/pt/contact',
    );
  });

  it('previews the featured project with its Portuguese description', () => {
    renderRoute(<HomePage />, PT_HOME);

    const selectedWork = screen.getByRole('region', { name: 'Trabalhos selecionados' });

    expect(
      within(selectedWork).getByText(/Este site — portfólio e blog técnico bilíngue/),
    ).toBeInTheDocument();
    expect(within(selectedWork).getByRole('link', { name: /Ver todos/ })).toHaveAttribute(
      'href',
      '/pt/projects',
    );
  });

  it('leaves out the writing section while no posts are published', () => {
    renderRoute(<HomePage />, PT_HOME);

    expect(screen.queryByRole('region', { name: 'Artigos' })).not.toBeInTheDocument();
  });
});
