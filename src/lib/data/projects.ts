import type { Locale } from '@/lib/i18n/locale';
import { siteConfig } from '@/lib/site-config';

export type Project = {
  slug: string;
  /** Product names are brands — the same in both locales. */
  name: string;
  desc: Record<Locale, string>;
  tech: readonly string[];
  /** What the card's image placeholder says it is waiting for, until a real screenshot exists. */
  placeholder: Record<Locale, string>;
  /** Link policy (CONTEXT.md): omitted while the repository is not public. */
  github?: string;
  /** Omitted while nothing is actually deployed at the target. */
  live?: string;
};

/**
 * Copied from the design snapshot's `projectItems` in both locales, keeping
 * only begossi.dev: the design's other cards (`stewart-acid-base`,
 * `voce-mais-saude`, `rn-monorepo-starter`) are not shown. begossi.dev links to
 * this repository, and gets no Live link until the domain is purchased.
 */
export const projects: readonly Project[] = [
  {
    slug: 'begossi-dev',
    name: 'begossi.dev',
    desc: {
      en: 'This website — a bilingual, themeable portfolio and technical blog focused on typography and performance.',
      pt: 'Este site — portfólio e blog técnico bilíngue, com temas e foco em tipografia e performance.',
    },
    tech: ['Next.js', 'MDX', 'i18n'],
    placeholder: { en: 'site screenshot', pt: 'screenshot do site' },
    github: siteConfig.repo,
  },
];

/** The cards (at most two) the Home screen previews under "Selected work". */
export const featuredProjects = projects.slice(0, 2);
