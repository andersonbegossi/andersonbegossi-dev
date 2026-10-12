import type { Dictionary } from './dictionary';

/**
 * UI chrome strings, verbatim from the design snapshot's `en` object
 * (`docs/design/portfolio.dc.html`). Article copy is MDX (ADR 0003); this file
 * only holds nav, buttons and section titles.
 */
export const en: Dictionary = {
  nav: { about: 'About', projects: 'Projects', blog: 'Blog', resume: 'Resume' },
  a11y: {
    mainNav: 'Main',
    home: 'Home',
    switchLanguage: 'Switch language',
    toggleTheme: 'Toggle theme',
  },
  notFound: {
    title: 'Page not found',
    subtitle: 'That page doesn’t exist — try the navigation above.',
  },
  theme: { light: 'LIGHT', dark: 'DARK' },
  home: {
    role: 'Senior Mobile Developer',
    bio: 'I build mobile apps used by thousands of people. Currently crafting the e-commerce apps of Dental Cremer, Dental Speed and Utilidades Clínicas (Henry Schein) — rated 4.9/5 on the App Store and Google Play.',
    availability: 'open to new opportunities & freelance',
    downloadResume: 'Download resume',
    contactMe: 'Get in touch',
    selectedWork: 'Selected work',
    recentWriting: 'Writing',
    viewAll: 'View all',
  },
  about: {
    title: 'About',
    p1: 'I’m Anderson, a software engineer from Nova Prata, Brazil, with 6+ years of experience specialized in mobile and frontend development with React Native, React, Expo and Node.js.',
    p2: 'I care deeply about performance, security and accessibility. My recent work includes critical e-commerce features — Pix checkout, virtual try-on, voice search, biometric and two-factor authentication — plus monorepo architecture, private NPM libraries and design systems shared across production apps.',
    experienceTitle: 'Experience',
    skillsTitle: 'Skills & technologies',
    languagesTitle: 'Languages',
    educationTitle: 'Education',
    degree: 'BSc in Computer Science',
  },
  projects: {
    title: 'Projects',
    subtitle:
      'Personal projects and apps I’ve designed, built and shipped — drop real screenshots into the placeholders.',
    demo: 'Live',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Notes on React Native, architecture and mobile engineering.',
    searchPlaceholder: 'Search articles…',
    featured: 'Featured',
    minRead: 'min read',
    noResults: 'No articles found — try another search.',
    empty: 'No posts yet — the first one is on its way.',
  },
  resume: {
    title: 'Resume',
    download: 'Download PDF',
    summary:
      'Software engineer with 6+ years of experience, specialized in mobile and frontend development with React Native, React, Expo and Node.js. Currently building and maintaining mobile apps for major healthcare brands (Henry Schein — NASDAQ:HSIC), used by thousands of users with a 4.9/5 average store rating.',
  },
  contact: {
    title: 'Contact',
    subtitle: 'Have a project, a role, or just want to talk engineering? My inbox is open.',
    formName: 'Name',
    formEmail: 'Email',
    formMessage: 'Message',
    send: 'Send message',
    sentTitle: 'Message sent!',
    sentBody: 'Thanks for reaching out — I’ll get back to you soon.',
  },
};
