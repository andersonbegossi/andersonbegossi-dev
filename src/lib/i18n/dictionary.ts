/**
 * The shape every locale dictionary fills. Written out rather than inferred
 * from `en` so the compiler rejects a locale that is missing a string — a `pt`
 * page silently falling back to English is exactly what this must prevent.
 */
export type Dictionary = {
  nav: { about: string; projects: string; blog: string };
  /**
   * Accessible names for the controls whose visible label is a glyph or a code.
   * The design hardcodes these in English; a `lang="pt-BR"` document that
   * announces its chrome in English is the bug that would leave.
   */
  a11y: {
    mainNav: string;
    home: string;
    switchLanguage: string;
    toggleTheme: string;
    /** Names a project card's list of tech chips. */
    techStack: string;
    /** Names the list of tag chips that closes an article. */
    tags: string;
  };
  /** The design has no 404 screen; this copy is ours, kept to the design's voice. */
  notFound: { title: string; subtitle: string };
  /** Labels name the theme you would switch *to*; the design derives them inline. */
  theme: { light: string; dark: string };
  home: {
    role: string;
    bio: string;
    availability: string;
    downloadResume: string;
    contactMe: string;
    selectedWork: string;
    recentWriting: string;
    viewAll: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    experienceTitle: string;
    skillsTitle: string;
    languagesTitle: string;
    educationTitle: string;
    degree: string;
    /** The design puts this on its own Resume screen, which About absorbed. */
    downloadResume: string;
  };
  projects: { title: string; subtitle: string; demo: string };
  blog: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    featured: string;
    minRead: string;
    noResults: string;
    /** Shown while no post is published; the design always has posts, so this copy is ours. */
    empty: string;
  };
  contact: {
    title: string;
    subtitle: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    send: string;
    sentTitle: string;
    sentBody: string;
  };
};
