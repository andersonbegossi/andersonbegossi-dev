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

  it('offers the committed resume PDF as a download', () => {
    renderRoute(<AboutPage />, '/about');

    const download = screen.getByRole('link', { name: /Download resume/ });
    expect(download).toHaveAttribute('href', '/Anderson-Begossi-Resume.pdf');
    expect(download).toHaveAttribute('download', 'Anderson-Begossi-Resume.pdf');
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
    expect(within(jobs[0]).getAllByRole('listitem')).toHaveLength(7);
    expect(
      within(jobs[0]).getByText(/maintaining a 4\.9★ average app store rating/),
    ).toBeInTheDocument();
    expect(
      within(jobs[1]).getByRole('heading', {
        level: 3,
        name: 'Front-end Developer (React / React Native)',
      }),
    ).toBeInTheDocument();
    expect(within(jobs[1]).getByText('2020 — 2022')).toBeInTheDocument();
    expect(within(jobs[1]).getByText('Softaliza · Santa Maria, BR (remote)')).toBeInTheDocument();
    expect(within(jobs[1]).getAllByRole('listitem')).toHaveLength(3);
    expect(
      within(jobs[2]).getByRole('heading', {
        level: 3,
        name: 'Full-stack Developer (React / React Native / Node.js)',
      }),
    ).toBeInTheDocument();
    expect(within(jobs[2]).getByText('2020 — 2021')).toBeInTheDocument();
    expect(
      within(jobs[2]).getByText('Zion Tech · Caxias do Sul, BR (remote, part-time)'),
    ).toBeInTheDocument();
    expect(within(jobs[2]).getAllByRole('listitem')).toHaveLength(4);
    expect(
      within(jobs[3]).getByRole('heading', { level: 3, name: 'Undergraduate Researcher' }),
    ).toBeInTheDocument();
    expect(within(jobs[3]).getByText('2017 — 2019')).toBeInTheDocument();
    expect(within(jobs[3]).getByText('UCS · Caxias do Sul, BR')).toBeInTheDocument();
    expect(within(jobs[3]).getAllByRole('listitem')).toHaveLength(2);
    expect(within(jobs[3]).getByText(/27th Young Researchers Conference/)).toBeInTheDocument();
  });

  it('groups the skills into six chip rows', () => {
    renderRoute(<AboutPage />, '/about');

    const skills = screen.getByRole('region', { name: 'Skills & technologies' });
    const groups = within(skills).getAllByRole('heading', { level: 3 });

    expect(groups.map((group) => group.textContent)).toEqual([
      'Mobile',
      'Frontend',
      'Backend',
      'Architecture',
      'Languages',
      'Tooling',
    ]);
    const tooling = within(skills).getByRole('list', { name: 'Tooling' });
    expect(
      within(tooling)
        .getAllByRole('listitem')
        .map((chip) => chip.textContent),
    ).toEqual([
      'Git',
      'GitHub Actions',
      'Turborepo',
      'Firebase',
      'Jest',
      'NPM',
      'Claude Code',
      'Jupyter Notebook',
      'Matplotlib',
    ]);
  });

  it('shows the spoken languages with their level', () => {
    renderRoute(<AboutPage />, '/about');

    const languages = screen.getByRole('region', { name: 'Languages' });

    expect(within(languages).getByText('Portuguese')).toBeInTheDocument();
    expect(within(languages).getByText('— native')).toBeInTheDocument();
    expect(within(languages).getByText('English')).toBeInTheDocument();
    expect(within(languages).getByText('— basic to intermediate')).toBeInTheDocument();
  });

  it('shows the degree, the thesis and the certifications', () => {
    renderRoute(<AboutPage />, '/about');

    const education = screen.getByRole('region', { name: 'Education' });

    expect(within(education).getByText('BSc in Computer Science')).toBeInTheDocument();
    expect(
      within(education).getByText('UCS — Universidade de Caxias do Sul · 2015–2021'),
    ).toBeInTheDocument();
    expect(within(education).getByText(/Thesis: mobile app prototype/)).toBeInTheDocument();
    expect(within(education).getByText('GoStack 10 Bootcamp — Rocketseat')).toBeInTheDocument();
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
