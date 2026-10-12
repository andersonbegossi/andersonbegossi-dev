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
  thesis: string;
  certifications: readonly string[];
};

/**
 * Anderson's career, as the About screen lists it. Mirrors his LinkedIn
 * profile (linkedin.com/in/andersonbegossi) — the same positions, bullets,
 * skills, languages and certifications — and so does the resume PDF, built by
 * `scripts/build-resume.py`; change all three together. Typed per locale so a
 * missing translation is a compile error, as with the dictionaries.
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
          'Build and maintain the Dental Cremer, Dental Speed and Utilidades Clínicas apps (Henry Schein — NASDAQ:HSIC) with React Native, used by thousands of users and rated 4.9★ on the stores.',
          'Built product detail, voice search, biometric, social and two-factor authentication, and virtual try-on, integrating internal APIs and native features with a focus on performance, security and maintainability.',
          'Implemented Pix payments in checkout, integrating the app with internal APIs for a secure, reliable and optimized purchase flow.',
          'Implemented the Design System shared by the three apps with Styled Components, for component reuse, visual consistency and faster development.',
          'Improved accessibility with screen-reader support and other good practices, making navigation more inclusive.',
          'Cut development time by ~30% and increased code reuse across the apps by creating shared private libraries for components, themes and business rules.',
          'Helped migrate the apps to a monorepo, cutting setup, development and maintenance time, centralizing shared libraries, standardizing project structure and simplifying dependency management.',
        ],
      },
      {
        period: '2020 — 2022',
        role: 'Front-end Developer (React / React Native)',
        company: 'Softaliza',
        location: 'Santa Maria, BR (remote)',
        bullets: [
          'Built strategic features for the Ciente Studio events platform — event hotsites, hotsite configuration panel, registration flow and streaming module — focused on scalability, performance and maintainability.',
          'Integrated Ciente Studio with Zoom through its APIs, enabling reliable and stable live streams.',
          'Upgraded and maintained the Camobi Segura app, modernizing dependencies, shipping fixes and improving its stability and reliability.',
        ],
      },
      {
        period: '2020 — 2021',
        role: 'Full-stack Developer (React / React Native / Node.js)',
        company: 'Zion Tech',
        location: 'Caxias do Sul, BR (remote, part-time)',
        bullets: [
          'Built the Você + Saúde health-tracking app in React Native, focused on performance, quality and maintainability.',
          'Built a Node.js / AdonisJS backend service that centralizes API communication with secure, scalable integrations.',
          'Built a responsive Next.js landing page applying performance, SEO and responsiveness best practices to support user acquisition.',
          'Built the Stewart Acid-Base app, a clinical decision-support tool for healthcare professionals with reliable calculations and an intuitive interface.',
        ],
      },
      {
        period: '2017 — 2019',
        role: 'Undergraduate Researcher',
        company: 'UCS',
        location: 'Caxias do Sul, BR',
        bullets: [
          'Built a nanonewton-scale force measurement system with a quartz piezoelectric sensor and Python scripts, enabling high-precision measurements for experimental applications.',
          'Presented the piezoelectric sensor project at the XXVII UCS Young Researchers Meeting.',
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
        items: ['React', 'Next.js', 'Redux', 'Styled Components', 'Material UI', 'Design Systems'],
      },
      {
        label: 'Backend',
        items: ['Node.js', 'AdonisJS', 'REST APIs', 'Google Cloud (GCP)', 'Speech-to-Text'],
      },
      {
        label: 'Architecture',
        items: ['Software Architecture', 'Domain-Driven Design', 'Monorepos'],
      },
      { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] },
      {
        label: 'Tooling',
        items: [
          'Git',
          'GitHub Actions',
          'Turborepo',
          'Firebase',
          'Jest',
          'NPM',
          'Claude Code',
          'Jupyter Notebook',
          'Matplotlib',
        ],
      },
    ],
    languages: [
      { name: 'Portuguese', level: 'native' },
      { name: 'English', level: 'basic to intermediate' },
    ],
    thesis:
      'Thesis: mobile app prototype to support children with dyslexia (React Native, Node.js, DDD, Google Speech-to-Text)',
    certifications: ['GoStack 10 Bootcamp — Rocketseat', 'Complete Web Design — Origamid'],
  },
  pt: {
    experience: [
      {
        period: '2022 — atual',
        role: 'Desenvolvedor Mobile React Native',
        company: 'Bamse',
        location: 'Blumenau, SC (remoto)',
        bullets: [
          'Desenvolvo e mantenho os aplicativos mobile da Dental Cremer, Dental Speed e Utilidades Clínicas (Henry Schein — NASDAQ:HSIC) com React Native, utilizados por milhares de usuários e com avaliação média de 4,9★ nas lojas.',
          'Desenvolvi funcionalidades estratégicas como tela de detalhes do produto, busca por voz, autenticação biométrica, social e em dois fatores (2FA) e provador virtual, integrando APIs internas e recursos nativos com foco em desempenho, segurança e manutenibilidade.',
          'Implementei o fluxo de pagamento via Pix no checkout, integrando o aplicativo às APIs internas em um fluxo seguro, confiável e otimizado para o processo de compra.',
          'Implementei o Design System compartilhado entre os três aplicativos com Styled Components, promovendo reutilização de componentes, consistência visual e maior produtividade.',
          'Aprimorei a acessibilidade dos aplicativos com suporte a leitores de tela e outras boas práticas, tornando a navegação mais inclusiva.',
          'Reduzi o tempo de desenvolvimento em ~30% e aumentei a reutilização de código entre os aplicativos, criando bibliotecas privadas compartilhadas para componentes, temas e regras de negócio.',
          'Contribuí para a migração dos aplicativos para um monorepo, reduzindo o tempo de setup, desenvolvimento e manutenção, centralizando bibliotecas compartilhadas, padronizando a estrutura dos projetos e simplificando o gerenciamento de dependências.',
        ],
      },
      {
        period: '2020 — 2022',
        role: 'Desenvolvedor Front-end (React / React Native)',
        company: 'Softaliza',
        location: 'Santa Maria, RS (remoto)',
        bullets: [
          'Desenvolvi funcionalidades estratégicas para a plataforma de eventos Ciente Studio — hotsites de eventos, painel de configuração de hotsites, fluxo de inscrição e módulo de transmissão — com foco em escalabilidade, desempenho e manutenibilidade.',
          'Implementei a integração do Ciente Studio com o Zoom via APIs, viabilizando transmissões ao vivo de forma confiável e estável.',
          'Realizei a atualização tecnológica e a manutenção do aplicativo Camobi Segura, modernizando dependências, implementando correções e aumentando sua estabilidade e confiabilidade.',
        ],
      },
      {
        period: '2020 — 2021',
        role: 'Desenvolvedor Full-stack (React / React Native / Node.js)',
        company: 'Zion Tech',
        location: 'Caxias do Sul, RS (remoto, meio período)',
        bullets: [
          'Desenvolvi o aplicativo Você + Saúde em React Native, com funcionalidades de acompanhamento de saúde focadas em desempenho, qualidade e manutenibilidade.',
          'Desenvolvi um serviço backend com Node.js e AdonisJS, centralizando a comunicação com APIs e implementando integrações seguras e escaláveis.',
          'Desenvolvi uma landing page responsiva com Next.js, aplicando boas práticas de performance, SEO e responsividade para apoiar a aquisição de usuários.',
          'Desenvolvi o aplicativo Stewart Acid-Base, ferramenta de apoio à decisão clínica para profissionais de saúde, com cálculos confiáveis e interface intuitiva.',
        ],
      },
      {
        period: '2017 — 2019',
        role: 'Pesquisador de Iniciação Científica',
        company: 'UCS',
        location: 'Caxias do Sul, RS',
        bullets: [
          'Desenvolvi um sistema de medição de forças na ordem de nanonewtons com sensor piezoelétrico de quartzo e scripts em Python, viabilizando medições de alta precisão para aplicações experimentais.',
          'Apresentei o projeto do sensor piezoelétrico no XXVII Encontro de Jovens Pesquisadores da UCS.',
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
        items: ['React', 'Next.js', 'Redux', 'Styled Components', 'Material UI', 'Design Systems'],
      },
      {
        label: 'Backend',
        items: ['Node.js', 'AdonisJS', 'APIs REST', 'Google Cloud (GCP)', 'Speech-to-Text'],
      },
      {
        label: 'Arquitetura',
        items: ['Arquitetura de Software', 'Domain-Driven Design', 'Monorepos'],
      },
      { label: 'Linguagens', items: ['TypeScript', 'JavaScript', 'Python'] },
      {
        label: 'Ferramentas',
        items: [
          'Git',
          'GitHub Actions',
          'Turborepo',
          'Firebase',
          'Jest',
          'NPM',
          'Claude Code',
          'Jupyter Notebook',
          'Matplotlib',
        ],
      },
    ],
    languages: [
      { name: 'Português', level: 'nativo' },
      { name: 'Inglês', level: 'básico a intermediário' },
    ],
    thesis:
      'TCC: protótipo de aplicativo para o auxílio de crianças com dislexia (React Native, Node.js, DDD, Google Speech-to-Text)',
    certifications: ['Bootcamp GoStack 10 — Rocketseat', 'Web Design Completo — Origamid'],
  },
};

/** The design hardcodes the school line in both locales. */
export const education = {
  school: 'UCS — Universidade de Caxias do Sul',
  years: '2015–2021',
} as const;
