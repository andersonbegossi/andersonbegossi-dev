import { describe, expect, it, vi } from 'vitest';
import { siteConfig } from '@/lib/site-config';
import sitemap from './sitemap';

vi.mock('@/lib/blog/posts', () => import('@/test/fixture-posts'));

describe('sitemap articles', () => {
  it('lists each post in the locales the content loader publishes it in', () => {
    const urls = sitemap().map((entry) => entry.url);
    const origin = siteConfig.baseUrl;

    expect(urls).toEqual(
      expect.arrayContaining([
        `${origin}/`,
        `${origin}/pt/`,
        `${origin}/blog/sharing-code/`,
        `${origin}/pt/blog/sharing-code/`,
        `${origin}/blog/biometric-auth/`,
      ]),
    );
    expect(urls).not.toContain(`${origin}/pt/blog/biometric-auth/`);
    expect(urls).not.toContain(`${origin}/blog/_/`);
    expect(urls.filter((url) => url.includes('/blog/') && !url.endsWith('/blog/'))).toEqual([
      `${origin}/blog/sharing-code/`,
      `${origin}/blog/biometric-auth/`,
      `${origin}/pt/blog/sharing-code/`,
    ]);
  });
});
