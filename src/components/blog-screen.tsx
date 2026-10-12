import Link from 'next/link';
import { formatPostDate, postPath } from '@/lib/blog/format';
import { featuredPost, loadPosts, type Post } from '@/lib/blog/posts';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import styles from './blog-screen.module.css';

/** The Blog screen body: the featured post as a large card, then every other post as a row. */
export function BlogScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = loadPosts(locale);
  const featured = featuredPost(posts);
  const rest = posts.filter((post) => post !== featured);
  const meta = (post: Post) =>
    `${formatPostDate(post.date, locale)} · ${post.minutes} ${t.blog.minRead}`;

  return (
    <div className={styles.screen}>
      <h1 id="blog-title" className={styles.title}>
        {t.blog.title}
      </h1>
      <p className={styles.subtitle}>{t.blog.subtitle}</p>

      {featured ? (
        <Link href={postPath(featured.slug, locale)} className={styles.featured}>
          <span className={styles.featuredLabel}>★ {t.blog.featured}</span>
          <span className={styles.featuredTitle}>{featured.title}</span>
          <span className={styles.featuredExcerpt}>{featured.excerpt}</span>
          <span className={styles.meta}>{meta(featured)}</span>
        </Link>
      ) : null}

      {posts.length === 0 ? <p className={styles.empty}>{t.blog.empty}</p> : null}

      {rest.length > 0 ? (
        <ul aria-labelledby="blog-title" className={styles.list}>
          {rest.map((post) => (
            <li key={post.slug}>
              <Link href={postPath(post.slug, locale)} className={styles.row}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.rowTitle}>{post.title}</span>
                <span className={styles.rowExcerpt}>{post.excerpt}</span>
                <span className={styles.meta}>{meta(post)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
