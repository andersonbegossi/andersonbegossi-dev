import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import AboutPage from './page';

describe('About screen', () => {
  it('introduces Anderson in two paragraphs', () => {
    renderRoute(<AboutPage />, '/about');

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(screen.getByText(/software engineer from Nova Prata, Brazil/)).toBeInTheDocument();
    expect(screen.getByText(/I care deeply about performance/)).toBeInTheDocument();
  });

  it('lists the four jobs with their period, company and every bullet', () => {
    renderRoute(<AboutPage />, '/about');

    const experience = screen.getByRole('region', { name: 'Experience' });
    const jobs = within(experience).getAllByRole('article');

    expect(jobs).toHaveLength(4);
    expect(
      within(jobs[0]).getByRole('heading', { level: 3, name: 'React Native Mobile Developer' }),
    ).toBeInTheDocument();
    expect(within(jobs[0]).getByText('2022 — now')).toBeInTheDocument();
    expect(within(jobs[0]).getByText('Bamse · Blumenau, BR (remote)')).toBeInTheDocument();
    expect(within(jobs[0]).getAllByRole('listitem')).toHaveLength(4);
    expect(within(jobs[1]).getAllByRole('listitem')).toHaveLength(2);
    expect(within(jobs[2]).getAllByRole('listitem')).toHaveLength(2);
    expect(within(jobs[3]).getByText('UCS · Caxias do Sul, BR')).toBeInTheDocument();
    expect(within(jobs[3]).getAllByRole('listitem')).toHaveLength(1);
  });

  it('groups the skills into five chip rows', () => {
    renderRoute(<AboutPage />, '/about');

    const skills = screen.getByRole('region', { name: 'Skills & technologies' });
    const groups = within(skills).getAllByRole('heading', { level: 3 });

    expect(groups.map((group) => group.textContent)).toEqual([
      'Mobile',
      'Frontend',
      'Backend',
      'Languages',
      'Tooling',
    ]);
    const tooling = within(skills).getByRole('list', { name: 'Tooling' });
    expect(
      within(tooling)
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual(['Jest', 'Firebase', 'GitHub Actions', 'Turborepo', 'NPM', 'Claude Code']);
  });

  it('shows the spoken languages with their level', () => {
    renderRoute(<AboutPage />, '/about');

    const languages = screen.getByRole('region', { name: 'Languages' });

    expect(within(languages).getByText('Portuguese')).toBeInTheDocument();
    expect(within(languages).getByText('— native')).toBeInTheDocument();
    expect(within(languages).getByText('English')).toBeInTheDocument();
    expect(within(languages).getByText('— intermediate')).toBeInTheDocument();
  });

  it('shows the degree and the certifications', () => {
    renderRoute(<AboutPage />, '/about');

    const education = screen.getByRole('region', { name: 'Education' });

    expect(within(education).getByText('BSc in Computer Science')).toBeInTheDocument();
    expect(
      within(education).getByText('UCS — Universidade de Caxias do Sul · 2015–2021'),
    ).toBeInTheDocument();
    expect(within(education).getByText('GoStack Bootcamp — Rocketseat')).toBeInTheDocument();
    expect(within(education).getByText('Complete Web Design — Origamid')).toBeInTheDocument();
  });

  it('marks About as the active nav item', () => {
    renderRoute(<AboutPage />, '/about');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
