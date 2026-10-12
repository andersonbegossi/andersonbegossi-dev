import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import AboutPage from './page';

const PT_ABOUT = '/pt/about';

describe('Portuguese About screen', () => {
  it('introduces Anderson in Portuguese', () => {
    renderRoute(<AboutPage />, PT_ABOUT);

    expect(screen.getByRole('heading', { level: 1, name: 'Sobre' })).toBeInTheDocument();
    expect(screen.getByText(/Sou o Anderson, engenheiro de software/)).toBeInTheDocument();
    expect(screen.getByText(/Tenho foco em performance/)).toBeInTheDocument();
  });

  it('lists the four jobs in Portuguese', () => {
    renderRoute(<AboutPage />, PT_ABOUT);

    const experience = screen.getByRole('region', { name: 'Experiência' });
    const jobs = within(experience).getAllByRole('article');

    expect(jobs).toHaveLength(4);
    expect(within(jobs[0]).getByText('2022 — atual')).toBeInTheDocument();
    expect(within(jobs[0]).getByText('Bamse · Blumenau, SC (remoto)')).toBeInTheDocument();
    expect(within(jobs[0]).getByText(/Implementei pagamento via Pix/)).toBeInTheDocument();
    expect(
      within(jobs[3]).getByRole('heading', { name: 'Pesquisador de Iniciação Científica' }),
    ).toBeInTheDocument();
  });

  it('groups the skills under Portuguese labels', () => {
    renderRoute(<AboutPage />, PT_ABOUT);

    const skills = screen.getByRole('region', { name: 'Competências & tecnologias' });

    expect(
      within(skills)
        .getAllByRole('heading', { level: 3 })
        .map((group) => group.textContent),
    ).toEqual(['Mobile', 'Frontend', 'Backend', 'Linguagens', 'Ferramentas']);
    expect(within(skills).getByText('Acessibilidade')).toBeInTheDocument();
  });

  it('shows languages, degree and certifications in Portuguese', () => {
    renderRoute(<AboutPage />, PT_ABOUT);

    const languages = screen.getByRole('region', { name: 'Idiomas' });
    expect(within(languages).getByText('Português')).toBeInTheDocument();
    expect(within(languages).getByText('— nativo')).toBeInTheDocument();

    const education = screen.getByRole('region', { name: 'Formação' });
    expect(within(education).getByText('Bacharelado em Ciência da Computação')).toBeInTheDocument();
    expect(within(education).getByText('Bootcamp GoStack — Rocketseat')).toBeInTheDocument();
  });

  it('marks Sobre as the active nav item', () => {
    renderRoute(<AboutPage />, PT_ABOUT);

    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('aria-current', 'page');
  });
});
