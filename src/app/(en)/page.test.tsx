import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/render-route';
import HomePage from './page';

describe('Home screen', () => {
  it('introduces Anderson with his name, role, employer and bio', () => {
    renderRoute(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Anderson Begossi' })).toBeInTheDocument();
    expect(screen.getByText(/Senior Mobile Developer/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bamse' })).toHaveAttribute(
      'href',
      'https://www.bamse.co/',
    );
    expect(screen.getByText(/I build mobile apps used by thousands of people/)).toBeInTheDocument();
    expect(screen.getByAltText('Anderson Begossi')).toBeInTheDocument();
  });

  it('shows that Anderson is open to work', () => {
    renderRoute(<HomePage />);

    expect(screen.getByText('open to new opportunities & freelance')).toBeInTheDocument();
  });

  it('offers the committed resume PDF as a download', () => {
    renderRoute(<HomePage />);

    const download = screen.getByRole('link', { name: /Download resume/ });
    expect(download).toHaveAttribute('href', '/Anderson-Begossi-Resume.pdf');
    expect(download).toHaveAttribute('download', 'Anderson-Begossi-Resume.pdf');
  });

  it('routes the get-in-touch action to the contact page', () => {
    renderRoute(<HomePage />);

    expect(screen.getByRole('link', { name: /Get in touch/ })).toHaveAttribute('href', '/contact');
  });

  it('links the profiles to the andersonbegossi accounts', () => {
    renderRoute(<HomePage />);

    const hero = screen.getByRole('region', { name: 'Anderson Begossi' });
    expect(within(hero).getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi',
    );
    expect(within(hero).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/andersonbegossi',
    );
  });

  it('previews the featured andersonbegossi.dev project, leading to the projects screen', () => {
    renderRoute(<HomePage />);

    const selectedWork = screen.getByRole('region', { name: 'Selected work' });
    const card = within(selectedWork).getByRole('link', { name: /andersonbegossi\.dev/ });

    expect(card).toHaveAttribute('href', '/projects');
    expect(within(selectedWork).getByText(/Next\.js · MDX · i18n/)).toBeInTheDocument();
    expect(
      within(selectedWork).getByText(/This website — a bilingual, themeable/),
    ).toBeInTheDocument();
    expect(within(selectedWork).queryByText(/Stewart Acid-Base/)).not.toBeInTheDocument();
    expect(within(selectedWork).getByRole('link', { name: /View all/ })).toHaveAttribute(
      'href',
      '/projects',
    );
  });

  it('previews the latest post in the writing section', () => {
    renderRoute(<HomePage />);

    const writing = screen.getByRole('region', { name: 'Writing' });
    expect(
      within(writing).getByRole('link', {
        name: /How to configure different environments in React Native apps/,
      }),
    ).toHaveAttribute('href', '/blog/react-native-environments');
  });
});
