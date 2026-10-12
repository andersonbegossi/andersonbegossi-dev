import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ResumePage from './page';

const PT_RESUME = '/pt/resume';

describe('Portuguese Resume screen', () => {
  it('opens with the Portuguese summary and download', () => {
    renderRoute(<ResumePage />, PT_RESUME);

    expect(screen.getByRole('heading', { level: 1, name: 'Currículo' })).toBeInTheDocument();
    expect(
      screen.getByText(/Engenheiro de software com mais de 6 anos de experiência/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Baixar PDF/ })).toHaveAttribute(
      'href',
      '/Anderson-Begossi-Resume.pdf',
    );
  });

  it('lists the experience with Portuguese periods and roles', () => {
    renderRoute(<ResumePage />, PT_RESUME);

    const jobs = within(screen.getByRole('region', { name: 'Experiência' })).getAllByRole(
      'listitem',
    );

    expect(jobs).toHaveLength(4);
    expect(within(jobs[0]).getByText('2022 — atual')).toBeInTheDocument();
    expect(
      within(jobs[1]).getByText('Desenvolvedor Front-end (React / React Native)'),
    ).toBeInTheDocument();
  });

  it('shows education and languages in Portuguese', () => {
    renderRoute(<ResumePage />, PT_RESUME);

    expect(
      within(screen.getByRole('region', { name: 'Formação' })).getByText(
        'Bacharelado em Ciência da Computação',
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Idiomas' })).getByText('— intermediário'),
    ).toBeInTheDocument();
  });

  it('marks Currículo as the active nav item', () => {
    renderRoute(<ResumePage />, PT_RESUME);

    expect(screen.getByRole('link', { name: 'Currículo' })).toHaveAttribute('aria-current', 'page');
  });
});
