import type { Locale } from '@/lib/i18n/locale';

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
 * Copied from the design snapshot's `projectItems` in both locales, with the
 * link policy applied: `stewart-acid-base`, `voce-mais-saude` and
 * `rn-monorepo-starter` are not public, so their GitHub buttons are dropped;
 * the design's placeholder apps.apple.com "Live" link is dropped; begossi.dev
 * links to this repository, and gets no Live link until the domain is purchased.
 */
export const projects: readonly Project[] = [
  {
    slug: 'stewart-acid-base',
    name: 'Stewart Acid-Base',
    desc: {
      en: 'Clinical decision-support app that applies Stewart’s physicochemical model to acid-base analysis, giving healthcare professionals reliable bedside calculations.',
      pt: 'App de apoio à decisão clínica que aplica o modelo físico-químico de Stewart à análise ácido-base, com cálculos confiáveis à beira do leito.',
    },
    tech: ['React Native', 'TypeScript'],
    placeholder: { en: 'app screenshot', pt: 'screenshot do app' },
  },
  {
    slug: 'voce-mais-saude',
    name: 'Você + Saúde',
    desc: {
      en: 'Health-tracking mobile app with a companion Node.js backend — habits, vitals and progress in one place.',
      pt: 'App de acompanhamento de saúde com backend em Node.js — hábitos, sinais vitais e progresso em um só lugar.',
    },
    tech: ['React Native', 'Node.js', 'AdonisJS'],
    placeholder: { en: 'app screenshot', pt: 'screenshot do app' },
  },
  {
    slug: 'rn-monorepo-starter',
    name: 'RN Monorepo Starter',
    desc: {
      en: 'Production-ready React Native template: monorepo layout, shared UI package, theming, testing and CI configured out of the box.',
      pt: 'Template React Native pronto para produção: monorepo, pacote de UI compartilhado, temas, testes e CI configurados.',
    },
    tech: ['Expo', 'Turborepo', 'TypeScript'],
    placeholder: { en: 'repo preview', pt: 'preview do repo' },
  },
  {
    slug: 'begossi-dev',
    name: 'begossi.dev',
    desc: {
      en: 'This website — a bilingual, themeable portfolio and technical blog focused on typography and performance.',
      pt: 'Este site — portfólio e blog técnico bilíngue, com temas e foco em tipografia e performance.',
    },
    tech: ['Next.js', 'MDX', 'i18n'],
    placeholder: { en: 'site screenshot', pt: 'screenshot do site' },
    github: 'https://github.com/andersonbegossi/abegossi',
  },
];

/** The two cards the Home screen previews under "Selected work". */
export const featuredProjects = projects.slice(0, 2);
