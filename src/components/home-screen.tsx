import Image from 'next/image';
import Link from 'next/link';
import { formatPostDate, postPath } from '@/lib/blog/format';
import { loadPosts } from '@/lib/blog/posts';
import { featuredProjects } from '@/lib/data/projects';
import { getDictionary } from '@/lib/i18n';
import { localePath, type Locale } from '@/lib/i18n/locale';
import { siteConfig } from '@/lib/site-config';
import styles from './home-screen.module.css';

/** The Home screen body, rendered by the routed page of each locale. */
export function HomeScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const recentPosts = loadPosts(locale).slice(0, 3);

  return (
    <div className={styles.screen}>
      <section aria-labelledby="hero-name">
        <div className={styles.hero}>
          <Image
            src={siteConfig.heroPhoto}
            alt={siteConfig.author}
            width={96}
            height={96}
            priority
            className={styles.photo}
          />
          <div className={styles.intro}>
            <h1 id="hero-name" className={styles.name}>
              {siteConfig.author}
            </h1>
            <p className={styles.role}>
              {t.home.role} ·{' '}
              <a
                href={siteConfig.employer.url}
                target="_blank"
                rel="noopener"
                className={styles.employer}
              >
                {siteConfig.employer.name}
              </a>
            </p>
            <p className={styles.bio}>{t.home.bio}</p>
          </div>
        </div>

        <p className={styles.availability}>
          <span aria-hidden="true" className={styles.availabilityDot} />
          <span>{t.home.availability}</span>
        </p>

        <div className={styles.actions}>
          <a
            href={siteConfig.resumePdf}
            download={siteConfig.resumeFileName}
            className={styles.primaryAction}
          >
            {t.home.downloadResume} ↓
          </a>
          <Link href={localePath('/contact', locale)} className={styles.secondaryAction}>
            {t.home.contactMe}
          </Link>
          <div className={styles.profiles}>
            <a href={siteConfig.github} target="_blank" rel="noopener" className={styles.profile}>
              GitHub ↗
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener" className={styles.profile}>
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="selected-work" className={styles.selectedWork}>
        <div className={styles.sectionHead}>
          <h2 id="selected-work" className={styles.sectionTitle}>
            {t.home.selectedWork}
          </h2>
          <Link href={localePath('/projects', locale)} className={styles.viewAll}>
            {t.home.viewAll} →
          </Link>
        </div>
        <div className={styles.cards}>
          {featuredProjects.map((project) => (
            <Link key={project.slug} href={localePath('/projects', locale)} className={styles.card}>
              <span className={styles.cardName}>{project.name}</span>
              <span className={styles.cardDesc}>{project.desc[locale]}</span>
              <span className={styles.cardTech}>{project.tech.join(' · ')}</span>
            </Link>
          ))}
        </div>
      </section>

      {recentPosts.length > 0 ? (
        <section aria-labelledby="recent-writing" className={styles.writing}>
          <div className={styles.sectionHead}>
            <h2 id="recent-writing" className={styles.sectionTitle}>
              {t.home.recentWriting}
            </h2>
            <Link href={localePath('/blog', locale)} className={styles.viewAll}>
              {t.home.viewAll} →
            </Link>
          </div>
          <ul className={styles.posts}>
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link href={postPath(post.slug, locale)} className={styles.post}>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postDate}>{formatPostDate(post.date, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
