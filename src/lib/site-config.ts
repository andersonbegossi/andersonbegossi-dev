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
