import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import ResumePage from './page';

describe('Resume screen', () => {
  it('opens with the summary', () => {
    renderRoute(<ResumePage />, '/resume');

    expect(screen.getByRole('heading', { level: 1, name: 'Resume' })).toBeInTheDocument();
    expect(
      screen.getByText(/Software engineer with 6\+ years of experience, specialized in mobile/),
    ).toBeInTheDocument();
  });

  it('offers the committed resume PDF as a download', () => {
    renderRoute(<ResumePage />, '/resume');

    const download = screen.getByRole('link', { name: /Download PDF/ });
    expect(download).toHaveAttribute('href', '/Anderson-Begossi-Resume.pdf');
    expect(download).toHaveAttribute('download', 'Anderson-Begossi-Resume.pdf');
  });

  it('lists the experience compactly, with each period', () => {
    renderRoute(<ResumePage />, '/resume');

    const experience = screen.getByRole('region', { name: 'Experience' });
    const jobs = within(experience).getAllByRole('listitem');

    expect(jobs).toHaveLength(4);
    expect(within(jobs[0]).getByText('React Native Mobile Developer')).toBeInTheDocument();
    expect(within(jobs[0]).getByText('Bamse · Blumenau, BR (remote)')).toBeInTheDocument();
    expect(within(jobs[0]).getByText('2022 — now')).toBeInTheDocument();
    expect(within(jobs[1]).getByText('2020 — 2022')).toBeInTheDocument();
    expect(within(jobs[2]).getByText('2020 — 2021')).toBeInTheDocument();
    expect(within(jobs[3]).getByText('2017 — 2019')).toBeInTheDocument();
    expect(within(experience).queryByText(/Shipped Pix payments/)).not.toBeInTheDocument();
  });

  it('shows education and languages', () => {
    renderRoute(<ResumePage />, '/resume');

    const education = screen.getByRole('region', { name: 'Education' });
    expect(within(education).getByText('BSc in Computer Science')).toBeInTheDocument();
    expect(within(education).getByText('UCS · 2015–2021')).toBeInTheDocument();

    const languages = screen.getByRole('region', { name: 'Languages' });
    expect(within(languages).getByText('Portuguese')).toBeInTheDocument();
    expect(within(languages).getByText('— intermediate')).toBeInTheDocument();
  });

  it('marks Resume as the active nav item', () => {
    renderRoute(<ResumePage />, '/resume');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
  });
});
