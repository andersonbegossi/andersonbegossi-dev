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
    expect(download).toHaveAttribute('href', '/Anderson-Begossi-Resume.pdf');
    expect(screen.getByRole('link', { name: /Fale comigo/ })).toHaveAttribute(
      'href',
      '/pt/contact',
    );
  });

  it('previews the featured projects with their Portuguese descriptions', () => {
    renderRoute(<HomePage />, PT_HOME);

    const selectedWork = screen.getByRole('region', { name: 'Trabalhos selecionados' });

    expect(within(selectedWork).getByText(/App de apoio à decisão clínica/)).toBeInTheDocument();
    expect(
      within(selectedWork).getByText(/App de acompanhamento de saúde com backend/),
    ).toBeInTheDocument();
    expect(within(selectedWork).getByRole('link', { name: /Ver todos/ })).toHaveAttribute(
      'href',
      '/pt/projects',
    );
  });

  it('previews the three most recent Portuguese posts', () => {
    renderRoute(<HomePage />, PT_HOME);

    const writing = screen.getByRole('region', { name: 'Artigos' });
    const posts = within(writing).getAllByRole('listitem');

    expect(posts).toHaveLength(3);
    expect(within(posts[0]).getByRole('link')).toHaveAttribute('href', '/pt/blog/sharing-code');
    expect(posts[0]).toHaveTextContent(
      'Compartilhando código entre três apps React Native em produção',
    );
    expect(posts[0]).toHaveTextContent('12 jun 2026');
    expect(posts[2]).toHaveTextContent('9 fev 2026');
    expect(within(writing).getByRole('link', { name: /Ver todos/ })).toHaveAttribute(
      'href',
      '/pt/blog',
    );
  });
});
