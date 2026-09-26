import { projects } from '@/lib/data/projects';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import styles from './projects-screen.module.css';

/**
 * The Projects screen body, rendered by the routed page of each locale. Every
 * card's buttons come from the project data, which already applies the link
 * policy (CONTEXT.md) — a card with no public target simply renders none.
 */
export function ProjectsScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{t.projects.title}</h1>
      <p className={styles.subtitle}>{t.projects.subtitle}</p>
      <div className={styles.grid}>
        {projects.map((project) => {
          const headingId = `project-${project.slug}`;
          return (
            <article key={project.slug} aria-labelledby={headingId} className={styles.card}>
              <div aria-hidden="true" className={styles.placeholder}>
                {project.placeholder[locale]}
              </div>
              <div className={styles.body}>
                <h2 id={headingId} className={styles.name}>
                  {project.name}
                </h2>
                <p className={styles.desc}>{project.desc[locale]}</p>
                <ul aria-label={t.a11y.techStack} className={styles.chips}>
                  {project.tech.map((tech) => (
                    <li key={tech} className={styles.chip}>
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.github || project.live ? (
                  <div className={styles.links}>
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener"
                        className={styles.github}
                      >
                        GitHub ↗
                      </a>
                    ) : null}
                    {project.live ? (
                      <a href={project.live} target="_blank" rel="noopener" className={styles.live}>
                        {t.projects.demo} ↗
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
