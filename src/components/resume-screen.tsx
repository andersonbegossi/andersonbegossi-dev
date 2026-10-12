import { background, education } from '@/lib/data/background';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import { siteConfig } from '@/lib/site-config';
import styles from './resume-screen.module.css';

/** The Resume screen body, rendered by the routed page of each locale. */
export function ResumeScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { experience, languages } = background[locale];

  return (
    <div className={styles.screen}>
      <div className={styles.head}>
        <h1 className={styles.title}>{t.resume.title}</h1>
        <a
          href={siteConfig.resumePdf}
          download={siteConfig.resumeFileName}
          className={styles.download}
        >
          {t.resume.download} ↓
        </a>
      </div>
      <p className={styles.summary}>{t.resume.summary}</p>

      <section aria-labelledby="resume-experience" className={styles.experience}>
        <h2 id="resume-experience" className={`${styles.sectionTitle} ${styles.experienceTitle}`}>
          {t.about.experienceTitle}
        </h2>
        <ul className={styles.jobs}>
          {experience.map((job) => (
            <li key={`${job.company}-${job.period}`} className={styles.job}>
              <div>
                <p className={styles.role}>{job.role}</p>
                <p className={styles.company}>
                  {job.company} · {job.location}
                </p>
              </div>
              <span className={styles.period}>{job.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.columns}>
        <section aria-labelledby="resume-education">
          <h2 id="resume-education" className={styles.sectionTitle}>
            {t.about.educationTitle}
          </h2>
          <p className={styles.degree}>{t.about.degree}</p>
          <p className={styles.school}>
            {education.schoolShort} · {education.years}
          </p>
        </section>
        <section aria-labelledby="resume-languages">
          <h2 id="resume-languages" className={styles.sectionTitle}>
            {t.about.languagesTitle}
          </h2>
          {languages.map((language) => (
            <p key={language.name} className={styles.language}>
              <span className={styles.languageName}>{language.name}</span>{' '}
              <span className={styles.muted}>— {language.level}</span>
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
