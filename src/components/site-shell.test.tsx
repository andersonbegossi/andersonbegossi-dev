import { describe, expect, it, onTestFinished } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderRoute } from '@/test/render-route';
import { stubMatchMedia } from '@/test/match-media';
import HomePage from '@/app/(en)/page';
import PortugueseHomePage from '@/app/(pt)/pt/page';

function prefersDarkOS(): void {
  stubMatchMedia({ prefersDark: true });
}

/**
 * `next/link` handles a click in the app and routes on the client; jsdom would
 * otherwise attempt a real document navigation and warn that it cannot.
 */
function stubClientNavigation(): void {
  const preventNavigation = (event: MouseEvent) => event.preventDefault();
  document.addEventListener('click', preventNavigation);
  onTestFinished(() => document.removeEventListener('click', preventNavigation));
}

describe('site chrome', () => {
  it('navigates to every screen from the header', () => {
    renderRoute(<HomePage />);

    const nav = screen.getByRole('navigation', { name: 'Main' });

    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
  });

  it('marks the current screen as the active nav item', () => {
    renderRoute(<HomePage />, '/projects');

    const nav = screen.getByRole('navigation', { name: 'Main' });

    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Blog' })).not.toHaveAttribute('aria-current');
  });

  it('links the footer to the andersonbegossi profiles and the email', () => {
    renderRoute(<HomePage />);

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByText('© 2026 Anderson Begossi')).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi',
    );
    expect(within(footer).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/andersonbegossi',
    );
    expect(within(footer).getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:andersonbegossi@gmail.com',
    );
  });
});

describe('language', () => {
  it('translates the nav and keeps it inside the Portuguese locale', () => {
    renderRoute(<PortugueseHomePage />, '/pt');

    const nav = screen.getByRole('navigation', { name: 'Principal' });

    expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/pt');
    expect(within(nav).getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/pt/about');
    expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute(
      'href',
      '/pt/projects',
    );
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/pt/blog');
  });

  it('marks the current screen as active in either locale', () => {
    renderRoute(<PortugueseHomePage />, '/pt/projects');

    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'page');
  });

  it('offers the same screen in the other language', () => {
    renderRoute(<HomePage />, '/about');

    const toggle = screen.getByRole('link', { name: 'Switch language' });

    expect(toggle).toHaveTextContent('PT');
    expect(toggle).toHaveAttribute('href', '/pt/about');
  });

  it('leads back to the same screen in English from Portuguese', () => {
    renderRoute(<PortugueseHomePage />, '/pt/about');

    const toggle = screen.getByRole('link', { name: 'Mudar idioma' });

    expect(toggle).toHaveTextContent('EN');
    expect(toggle).toHaveAttribute('href', '/about');
  });

  it('switches the Home screens between each other, not into a sub-page', () => {
    renderRoute(<PortugueseHomePage />, '/pt');

    expect(screen.getByRole('link', { name: 'Mudar idioma' })).toHaveAttribute('href', '/');
  });

  it('remembers the language the visitor picked', async () => {
    const user = userEvent.setup();
    stubClientNavigation();
    renderRoute(<HomePage />, '/');

    await user.click(screen.getByRole('link', { name: 'Switch language' }));

    expect(localStorage.getItem('ab-lang')).toBe('pt');
  });

  it('names the chrome controls in the language of the page', () => {
    renderRoute(<PortugueseHomePage />, '/pt');

    const toggle = screen.getByRole('button', { name: 'Alternar tema' });

    expect(within(toggle).getByText('ESCURO')).toBeInTheDocument();
    expect(within(toggle).getByText('CLARO')).toBeInTheDocument();
  });
});

describe('theme', () => {
  it('defaults to the OS preference', () => {
    prefersDarkOS();

    renderRoute(<HomePage />);

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('falls back to light when the OS prefers light', () => {
    renderRoute(<HomePage />);

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('switches the theme when the toggle is used', async () => {
    const user = userEvent.setup();
    renderRoute(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('remembers the visitor’s choice over the OS preference', async () => {
    const user = userEvent.setup();
    prefersDarkOS();
    renderRoute(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(localStorage.getItem('ab-theme')).toBe('light');
  });

  it('restores the stored choice on the next visit', () => {
    localStorage.setItem('ab-theme', 'dark');

    renderRoute(<HomePage />);

    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
