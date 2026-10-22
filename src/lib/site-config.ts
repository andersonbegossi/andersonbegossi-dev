import type { Locale } from '@/lib/i18n/locale';

/**
 * Every host-dependent value lives here (ADR 0005): canonical URLs, hreflang,
 * sitemap and robots read `baseUrl` and nothing else may hardcode the host, so
 * moving the site to another host is a one-line change.
 */
export const siteConfig = {
  baseUrl: 'https://andersonbegossi.dev',
  author: 'Anderson Begossi',
  email: 'andersonbegossi@gmail.com',
  github: 'https://github.com/andersonbegossi',
  /** This site's own repository — public, so the andersonbegossi.dev project card links to it. */
  repo: 'https://github.com/andersonbegossi/andersonbegossi-dev',
  linkedin: 'https://www.linkedin.com/in/andersonbegossi',
  /** Not the design's bamse.com.br, which is NXDOMAIN — this is the live site. */
  employer: { name: 'Bamse', url: 'https://www.bamse.co/' },
  /** One PDF per locale, both built by `scripts/build-resume.py`. */
  resume: {
    en: { href: '/Anderson-Begossi-Resume.pdf', fileName: 'Anderson-Begossi-Resume.pdf' },
    pt: { href: '/Anderson-Begossi-Curriculo.pdf', fileName: 'Anderson-Begossi-Curriculo.pdf' },
  } satisfies Record<Locale, { href: string; fileName: string }>,
  heroPhoto: '/hero-photo.webp',
} as const;

/**
 * Web3Forms endpoint for the Contact screen (ADR 0009). The browser POSTs here
 * directly — a static export has no server of its own (ADR 0001).
 */
export const web3formsEndpoint = 'https://api.web3forms.com/submit';

/**
 * Sentinel for `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. The Contact screen hides the
 * form while that variable is unset, blank, or still this value; the mailto
 * link is the fallback until Anderson sets a real key. Next inlines every
 * `NEXT_PUBLIC_*` variable into the static export at build time, and the key
 * is public in the client bundle by design (ADR 0009).
 */
export const web3formsAccessKeyPlaceholder = 'placeholder';

/** The configured access key, or `undefined` while it is still the placeholder. */
export function web3formsAccessKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  if (!key || key === web3formsAccessKeyPlaceholder) return undefined;
  return key;
}
