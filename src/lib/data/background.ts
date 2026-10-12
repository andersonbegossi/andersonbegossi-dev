import type { Locale } from '@/lib/i18n/locale';

export type Job = {
  period: string;
  role: string;
  company: string;
  location: string;
  bullets: readonly string[];
};

export type SkillGroup = { label: string; items: readonly string[] };

export type SpokenLanguage = { name: string; level: string };

export type Background = {
  experience: readonly Job[];
  skills: readonly SkillGroup[];
  languages: readonly SpokenLanguage[];
  certifications: readonly string[];
};

/**
 * Anderson's career, shared by the About and Resume screens. Copied verbatim
 * from the design snapshot's `experience`, `skills`, `languages` and
 * `certifications` in both locales; typed per locale so a missing translation
 * is a compile error, as with the dictionaries.
 */
export const background: Record<Locale, Background> = {
  en: {
    experience: [
      {
        period: '2022 — now',
        role: 'React Native Mobile Developer',
        company: 'Bamse',
        location: 'Blumenau, BR (remote)',
        bullets: [
          'Build and maintain the Dental Cremer, Dental Speed and Utilidades Clínicas apps (Henry Schein — NASDAQ:HSIC), used by thousands of users with a 4.9/5 average rating.',
          'Shipped Pix payments in checkout, virtual try-on, voice search, and biometric, social and two-factor authentication.',
          'Cut development time ~30% by extracting shared private NPM libraries and a Styled Components design system used by all three apps.',
          'Helped migrate from multi-repo to a monorepo and improved accessibility with screen-reader support.',
        ],
      },
      {
        period: '2020 — 2022',
        role: 'Front-end Developer (React / React Native)',
        company: 'Softaliza',
        location: 'Santa Maria, BR (remote)',
        bullets: [
          'Built event hotsites, configuration panel, registration flow and streaming module for the Ciente Studio events platform.',
          'Integrated the Zoom API for reliable live streams; modernized and maintained the Camobi Segura app.',
        ],
      },
      {
        period: '2020 — 2021',
        role: 'Full-stack Developer (React / Node.js)',
        company: 'Zion Tech',
        location: 'Caxias do Sul, BR (remote)',
        bullets: [
          'Built the Você + Saúde health-tracking app in React Native and its Node.js / AdonisJS backend service.',
          'Created the Stewart Acid-Base clinical decision-support app and a Next.js landing page focused on performance and SEO.',
        ],
      },
      {
        period: '2017 — 2019',
        role: 'Undergraduate Researcher',
        company: 'UCS',
        location: 'Caxias do Sul, BR',
        bullets: [
          'Built a nanonewton-scale force measurement system with a quartz piezoelectric sensor and Python scripts; presented at the XXVII UCS Young Researchers Meeting.',
        ],
      },
    ],
    skills: [
      {
        label: 'Mobile',
        items: ['React Native', 'Expo', 'iOS', 'Android', 'Biometrics', 'Accessibility'],
      },
      {
        label: 'Frontend',
        items: ['React', 'Next.js', 'Redux', 'Styled Components', 'Design Systems'],
      },
      { label: 'Backend', items: ['Node.js', 'AdonisJS', 'REST APIs'] },
      { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] },
      {
        label: 'Tooling',
        items: ['Jest', 'Firebase', 'GitHub Actions', 'Turborepo', 'NPM', 'Claude Code'],
      },
    ],
    languages: [
      { name: 'Portuguese', level: 'native' },
      { name: 'English', level: 'intermediate' },
    ],
    certifications: ['GoStack Bootcamp — Rocketseat', 'Complete Web Design — Origamid'],
  },
  pt: {
    experience: [
      {
        period: '2022 — atual',
        role: 'Desenvolvedor Mobile React Native',
        company: 'Bamse',
        location: 'Blumenau, SC (remoto)',
        bullets: [
          'Desenvolvo e mantenho os apps da Dental Cremer, Dental Speed e Utilidades Clínicas (Henry Schein — NASDAQ:HSIC), usados por milhares de usuários com avaliação média de 4,9/5.',
          'Implementei pagamento via Pix no checkout, provador virtual, busca por voz e autenticação biométrica, social e em dois fatores (2FA).',
          'Reduzi o tempo de desenvolvimento em ~30% criando bibliotecas privadas no NPM e um Design System com Styled Components compartilhado entre os três apps.',
          'Contribuí na migração de multirrepositórios para monorepo e aprimorei a acessibilidade com suporte a leitores de tela.',
        ],
      },
      {
        period: '2020 — 2022',
        role: 'Desenvolvedor Front-end (React / React Native)',
        company: 'Softaliza',
        location: 'Santa Maria, RS (remoto)',
        bullets: [
          'Desenvolvi hotsites de eventos, painel de configuração, fluxo de inscrição e módulo de transmissão para a plataforma Ciente Studio.',
          'Integrei a API do Zoom para transmissões ao vivo confiáveis; modernizei e mantive o app Camobi Segura.',
        ],
      },
      {
        period: '2020 — 2021',
        role: 'Desenvolvedor Full-stack (React / Node.js)',
        company: 'Zion Tech',
        location: 'Caxias do Sul, RS (remoto)',
        bullets: [
          'Desenvolvi o app Você + Saúde em React Native e seu backend em Node.js / AdonisJS.',
          'Criei o app Stewart Acid-Base, de apoio à decisão clínica, e uma landing page em Next.js focada em performance e SEO.',
        ],
      },
      {
        period: '2017 — 2019',
        role: 'Pesquisador de Iniciação Científica',
        company: 'UCS',
        location: 'Caxias do Sul, RS',
        bullets: [
          'Desenvolvi um sistema de medição de forças em nanonewtons com sensor piezoelétrico de quartzo e Python; apresentei no XXVII Encontro de Jovens Pesquisadores da UCS.',
        ],
      },
    ],
    skills: [
      {
        label: 'Mobile',
        items: ['React Native', 'Expo', 'iOS', 'Android', 'Biometria', 'Acessibilidade'],
      },
      {
        label: 'Frontend',
        items: ['React', 'Next.js', 'Redux', 'Styled Components', 'Design Systems'],
      },
      { label: 'Backend', items: ['Node.js', 'AdonisJS', 'APIs REST'] },
      { label: 'Linguagens', items: ['TypeScript', 'JavaScript', 'Python'] },
      {
        label: 'Ferramentas',
        items: ['Jest', 'Firebase', 'GitHub Actions', 'Turborepo', 'NPM', 'Claude Code'],
      },
    ],
    languages: [
      { name: 'Português', level: 'nativo' },
      { name: 'Inglês', level: 'intermediário' },
    ],
    certifications: ['Bootcamp GoStack — Rocketseat', 'Web Design Completo — Origamid'],
  },
};

/**
 * The design hardcodes the school line in both locales: About spells the name
 * out, the compact Resume abbreviates it.
 */
export const education = {
  school: 'UCS — Universidade de Caxias do Sul',
  schoolShort: 'UCS',
  years: '2015–2021',
} as const;
