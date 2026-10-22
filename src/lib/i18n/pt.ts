import type { Dictionary } from './dictionary';

/**
 * UI chrome strings, verbatim from the design snapshot's `pt` object
 * (`docs/design/portfolio.dc.html`). Brazilian Portuguese — served under the
 * `/pt/` prefix (ADR 0002).
 */
export const pt: Dictionary = {
  nav: { about: 'Sobre', projects: 'Projetos', blog: 'Blog' },
  a11y: {
    mainNav: 'Principal',
    home: 'Início',
    switchLanguage: 'Mudar idioma',
    toggleTheme: 'Alternar tema',
    techStack: 'Tecnologias',
    tags: 'Tags',
  },
  notFound: {
    title: 'Página não encontrada',
    subtitle: 'Essa página não existe — use a navegação acima.',
  },
  theme: { light: 'CLARO', dark: 'ESCURO' },
  home: {
    role: 'Desenvolvedor Mobile Sênior',
    bio: 'Construo aplicativos mobile usados por milhares de pessoas. Atualmente desenvolvo os apps de e-commerce da Dental Cremer, Dental Speed e Utilidades Clínicas (Henry Schein) — avaliados em 4,9/5 na App Store e no Google Play.',
    availability: 'aberto a oportunidades & freelance',
    downloadResume: 'Baixar currículo',
    contactMe: 'Fale comigo',
    selectedWork: 'Trabalhos selecionados',
    recentWriting: 'Artigos',
    viewAll: 'Ver todos',
  },
  about: {
    title: 'Sobre',
    p1: 'Sou o Anderson, engenheiro de software de Nova Prata (RS), com mais de 6 anos de experiência, especializado em desenvolvimento mobile e frontend com React Native, React, Expo e Node.js.',
    p2: 'Tenho foco em performance, segurança e acessibilidade. Meus trabalhos recentes incluem funcionalidades críticas de e-commerce — checkout com Pix, provador virtual, busca por voz, autenticação biométrica e 2FA — além de arquitetura de monorepos, bibliotecas privadas no NPM e Design Systems compartilhados entre apps em produção.',
    experienceTitle: 'Experiência',
    skillsTitle: 'Competências & tecnologias',
    languagesTitle: 'Idiomas',
    educationTitle: 'Formação',
    degree: 'Bacharelado em Ciência da Computação',
    downloadResume: 'Baixar currículo',
  },
  projects: {
    title: 'Projetos',
    subtitle:
      'Projetos pessoais e apps que projetei, construí e publiquei — arraste screenshots reais para os placeholders.',
    demo: 'Demo',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Notas sobre React Native, arquitetura e engenharia mobile.',
    searchPlaceholder: 'Buscar artigos…',
    searchLabel: 'Buscar artigos',
    featured: 'Destaque',
    minRead: 'min de leitura',
    noResults: 'Nenhum artigo encontrado — tente outra busca.',
    empty: 'Nenhum artigo ainda — o primeiro está a caminho.',
  },
  contact: {
    title: 'Contato',
    subtitle:
      'Tem um projeto, uma vaga, ou só quer conversar sobre engenharia? Minha caixa de entrada está aberta.',
    formName: 'Nome',
    formEmail: 'E-mail',
    formMessage: 'Mensagem',
    send: 'Enviar mensagem',
    sentTitle: 'Mensagem enviada!',
    sentBody: 'Obrigado pelo contato — respondo em breve.',
    error: 'Não foi possível enviar — tente de novo, ou use o e-mail acima.',
  },
};
