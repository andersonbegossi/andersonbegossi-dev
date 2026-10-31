import type { Locale } from '@/lib/i18n/locale';
import { siteConfig } from '@/lib/site-config';

export type Project = {
  slug: string;
  /** Product names are brands — the same in both locales. */
  name: string;
  desc: Record<Locale, string>;
  tech: readonly string[];
  /**
   * Image for the card's 16:9 slot. Omitted when the project has none yet.
   * `width` and `height` are the file's intrinsic pixels, so the slot can reserve
   * its space before the image loads.
   */
  image?: {
    src: string;
    width: number;
    height: number;
    alt: Record<Locale, string>;
  };
  /** Link policy (CONTEXT.md): omitted while the repository is not public. */
  github?: string;
  /** Omitted while nothing is actually deployed at the target. */
  live?: string;
};

/**
 * Copied from the design snapshot's `projectItems` in both locales, keeping
 * only the site's own card, renamed from the design's `begossi.dev` to the real
 * domain: the design's other cards (`stewart-acid-base`, `voce-mais-saude`,
 * `rn-monorepo-starter`) are not shown. andersonbegossi.dev links to this
 * repository, and gets no Live link until the domain resolves.
 */
export const projects: readonly Project[] = [
  {
    slug: 'andersonbegossi-dev',
    name: 'andersonbegossi.dev',
    desc: {
      en: 'This website — a bilingual, themeable portfolio and technical blog focused on typography and performance.',
      pt: 'Este site — portfólio e blog técnico bilíngue, com temas e foco em tipografia e performance.',
    },
    tech: ['Next.js', 'MDX', 'i18n'],
    image: {
      src: '/images/projects/andersonbegossi-dev.webp',
      width: 1280,
      height: 720,
      alt: {
        en: 'ab. mark',
        pt: 'Marca ab.',
      },
    },
    github: siteConfig.repo,
  },
];

/** The cards (at most two) the Home screen previews under "Selected work". */
export const featuredProjects = projects.slice(0, 2);
