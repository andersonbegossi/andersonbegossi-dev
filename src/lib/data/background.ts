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
          'Developed and maintained the mobile applications for Dental Cremer, Dental Speed, and Utilidades Clínicas (Henry Schein – NASDAQ: HSIC), serving thousands of users and maintaining a 4.9★ average app store rating by delivering new features, bug fixes, and continuous improvements using React Native.',
          'Developed key application features, including the product details page, voice search, biometric authentication, social authentication, two-factor authentication (2FA), and virtual try-on, following software engineering best practices and integrating with internal APIs and native platform capabilities while focusing on performance, security, and maintainability.',
          'Implemented the Pix payment flow in the checkout process, integrating the mobile application with internal APIs to deliver a secure, reliable, and optimized purchasing experience.',
          'Implemented the shared Design System across all three applications using Styled Components, increasing component reusability, ensuring UI consistency, and improving development productivity.',
          'Improved the accessibility of the mobile applications by implementing screen reader support and accessibility best practices to provide a more inclusive user experience.',
          'Reduced development time by approximately 30% and increased code reuse across applications by creating shared private libraries for components, themes, and business logic.',
          "Contributed to the migration of the applications' architecture to a monorepo, significantly reducing setup, development, and maintenance time by centralizing shared libraries, standardizing the project structure, and simplifying dependency management.",
        ],
      },
      {
        period: '2020 — 2022',
        role: 'Front-end Developer (React / React Native)',
        company: 'Softaliza',
        location: 'Santa Maria, BR (remote)',
        bullets: [
          'Developed key features for the Ciente Studio event platform, including event microsites, microsite management dashboard, registration flow, and live streaming module, following software engineering best practices with a focus on scalability, performance, and maintainability.',
          'Implemented Zoom integration for the Ciente Studio platform, enabling live event streaming through APIs while ensuring a reliable and stable integration.',
          'Performed technology upgrades and maintenance for the Camobi Segura mobile application, modernizing dependencies, implementing bug fixes, and improving application stability and reliability.',
        ],
      },
      {
        period: '2020 — 2021',
        role: 'Full-stack Developer (React / React Native / Node.js)',
        company: 'Zion Tech',
        location: 'Caxias do Sul, BR (remote, part-time)',
        bullets: [
          'Developed the Você + Saúde mobile application using React Native, implementing health monitoring features with a focus on performance, quality, and maintainability.',
          'Developed a backend service using Node.js and AdonisJS, centralizing communication with APIs and implementing secure and scalable integrations.',
          'Developed a responsive landing page using Next.js, applying best practices for performance, SEO, and responsiveness to support user acquisition.',
          'Developed the Stewart Acid-Base mobile application, creating a clinical decision support tool for healthcare professionals by implementing reliable clinical calculations and an intuitive user interface.',
        ],
      },
      {
        period: '2017 — 2019',
        role: 'Undergraduate Researcher',
        company: 'UCS',
        location: 'Caxias do Sul, BR',
        bullets: [
          'Developed a force measurement system capable of detecting nanonewton-level forces using a quartz piezoelectric sensor and Python scripts, enabling high-precision measurements for experimental applications.',
          'Presented the piezoelectric sensor project at the 27th Young Researchers Conference at the University of Caxias do Sul (UCS), sharing the academic results and their scientific applications.',
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
          'Desenvolvi e mantive os aplicativos mobile da Dental Cremer, Dental Speed e Utilidades Clínicas (Henry Schein — NASDAQ:HSIC) com React Native, utilizados por milhares de usuários e com avaliação média de 4,9★ nas lojas.',
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
