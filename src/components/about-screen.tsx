import { background, education } from '@/lib/data/background';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import styles from './about-screen.module.css';

/** The About screen body, rendered by the routed page of each locale. */
export function AboutScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { experience, skills, languages, certifications } = background[locale];

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{t.about.title}</h1>
      <p className={styles.lead}>{t.about.p1}</p>
      <p className={styles.secondary}>{t.about.p2}</p>

      <section aria-labelledby="about-experience" className={styles.section}>
        <h2 id="about-experience" className={styles.sectionTitle}>
          {t.about.experienceTitle}
        </h2>
        <div className={styles.jobs}>
          {experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className={styles.row}>
              <span className={styles.period}>{job.period}</span>
              <div>
                <h3 className={styles.role}>{job.role}</h3>
                <p className={styles.company}>
                  {job.company} · {job.location}
                </p>
                <ul className={styles.bullets}>
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className={styles.bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-skills" className={styles.section}>
        <h2 id="about-skills" className={`${styles.sectionTitle} ${styles.skillsTitle}`}>
          {t.about.skillsTitle}
        </h2>
        <div className={styles.skillGroups}>
          {skills.map((group, index) => {
            const labelId = `about-skills-${index}`;
            return (
              <div key={group.label} className={`${styles.row} ${styles.skillGroup}`}>
                <h3 id={labelId} className={styles.skillLabel}>
                  {group.label}
                </h3>
                <ul aria-labelledby={labelId} className={styles.chips}>
                  {group.items.map((skill) => (
                    <li key={skill} className={styles.chip}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <div className={`${styles.section} ${styles.columns}`}>
        <section aria-labelledby="about-languages">
          <h2 id="about-languages" className={`${styles.sectionTitle} ${styles.columnTitle}`}>
            {t.about.languagesTitle}
          </h2>
          {languages.map((language) => (
            <p key={language.name} className={styles.language}>
              <span className={styles.languageName}>{language.name}</span>{' '}
              <span className={styles.muted}>— {language.level}</span>
            </p>
          ))}
        </section>
        <section aria-labelledby="about-education">
          <h2 id="about-education" className={`${styles.sectionTitle} ${styles.columnTitle}`}>
            {t.about.educationTitle}
          </h2>
          <p className={styles.degree}>{t.about.degree}</p>
          <p className={styles.school}>
            {education.school} · {education.years}
          </p>
          <div className={styles.certifications}>
            {certifications.map((certification) => (
              <p key={certification} className={styles.certification}>
                {certification}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
