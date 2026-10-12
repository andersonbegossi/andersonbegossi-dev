import { featuredPost, loadPosts } from '@/lib/blog/posts';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import { BlogIndex } from './blog-index';
import styles from './blog-screen.module.css';

/**
 * The Blog screen body. Posts are read here, at build time; searching and
 * filtering them happens in the browser (`BlogIndex`), since the site is a
 * static export (ADR 0001). The bodies stay behind so the page ships only what
 * the index shows.
 */
export function BlogScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = loadPosts(locale);
  const summaries = posts.map(({ body: _body, ...summary }) => summary);
  const featured = featuredPost(summaries);

  return (
    <div className={styles.screen}>
      <h1 id="blog-title" className={styles.title}>
        {t.blog.title}
      </h1>
      <p className={styles.subtitle}>{t.blog.subtitle}</p>

      {posts.length === 0 ? (
        <p className={styles.empty}>{t.blog.empty}</p>
      ) : (
        <BlogIndex locale={locale} posts={summaries} featured={featured} labelledBy="blog-title" />
      )}
    </div>
  );
}
