import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/** Layouts render the document, which loads next/font. The script under test does not. */
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

import EnglishLayout from './(en)/layout';
import PortugueseLayout from './(pt)/layout';
import GlobalNotFound from './global-not-found';

/**
 * `@vercel/analytics` appends this from an effect and tags it with the package
 * name. Vitest counts as development, so the src is the debug script there; a
 * production build requests `/_vercel/insights/script.js`.
 */
const ANALYTICS_SCRIPT = 'script[data-sdkn="@vercel/analytics/next"]';

function mount(layout: ReactElement): HTMLScriptElement | null {
  for (const node of document.querySelectorAll(ANALYTICS_SCRIPT)) node.remove();
  render(layout);
  return document.querySelector(ANALYTICS_SCRIPT);
}

describe('Web Analytics', () => {
  it('injects the insights script from the English root layout', () => {
    const script = mount(<EnglishLayout>Home</EnglishLayout>);

    expect(script).not.toBeNull();
    expect(script?.src).toMatch(/\/script(\.debug)?\.js$/);
  });

  it('injects the insights script from the Portuguese root layout', () => {
    const script = mount(<PortugueseLayout>Início</PortugueseLayout>);

    expect(script).not.toBeNull();
    expect(script?.src).toMatch(/\/script(\.debug)?\.js$/);
  });

  it('injects the insights script on the static 404, which has no layout of its own', () => {
    const script = mount(<GlobalNotFound />);

    expect(script).not.toBeNull();
  });
});
