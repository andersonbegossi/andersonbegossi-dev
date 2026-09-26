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
      'https://linkedin.com/in/andersonbegossi-b5065a130',
    );
  });

  it('previews two featured projects that lead to the projects screen', () => {
    renderRoute(<HomePage />);

    const selectedWork = screen.getByRole('region', { name: 'Selected work' });
    const cards = within(selectedWork).getAllByRole('link', {
      name: /Stewart Acid-Base|Você \+ Saúde/,
    });

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAccessibleName(/Stewart Acid-Base/);
    expect(cards[1]).toHaveAccessibleName(/Você \+ Saúde/);
    for (const card of cards) {
      expect(card).toHaveAttribute('href', '/projects');
    }

    expect(within(selectedWork).getByText(/React Native · TypeScript/)).toBeInTheDocument();
    expect(within(selectedWork).getByText(/Clinical decision-support app/)).toBeInTheDocument();
    expect(within(selectedWork).getByRole('link', { name: /View all/ })).toHaveAttribute(
      'href',
      '/projects',
    );
  });

  it('previews the three most recent posts, linked to their URLs', () => {
    renderRoute(<HomePage />);

    const writing = screen.getByRole('region', { name: 'Writing' });
    const posts = within(writing).getAllByRole('listitem');

    expect(posts).toHaveLength(3);
    expect(within(posts[0]).getByRole('link')).toHaveAttribute('href', '/blog/sharing-code');
    expect(posts[0]).toHaveTextContent('Sharing code between three production React Native apps');
    expect(posts[0]).toHaveTextContent('Jun 12, 2026');
    expect(within(posts[1]).getByRole('link')).toHaveAttribute('href', '/blog/biometric-auth');
    expect(posts[1]).toHaveTextContent('Apr 28, 2026');
    expect(within(posts[2]).getByRole('link')).toHaveAttribute('href', '/blog/pix-checkout');
    expect(posts[2]).toHaveTextContent('Feb 9, 2026');
    expect(within(writing).getByRole('link', { name: /View all/ })).toHaveAttribute(
      'href',
      '/blog',
    );
  });
});
