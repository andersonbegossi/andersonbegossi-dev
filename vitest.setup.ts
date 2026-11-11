import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { stubMatchMedia } from './src/test/match-media';

/**
 * Tests render routes directly rather than through the Next.js router, so the
 * chrome reads its pathname from the store `renderRoute` writes to. Web
 * Analytics also reads the route (`useParams`, `useSearchParams`, and the
 * `.js` entry the package imports); an empty param set is enough for it to
 * inject its script.
 */
const navigationMock = vi.hoisted(() => async () => {
  const { getTestPathname } = await import('./src/test/router');
  return {
    usePathname: () => getTestPathname(),
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock('next/navigation', navigationMock);
vi.mock('next/navigation.js', navigationMock);

beforeEach(() => {
  stubMatchMedia();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  vi.unstubAllGlobals();
});
