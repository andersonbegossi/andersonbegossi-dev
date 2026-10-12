'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatPostMeta, postPath } from '@/lib/blog/format';
import type { PostSummary } from '@/lib/blog/posts';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import styles from './blog-screen.module.css';

type Props = {
  locale: Locale;
  /** The locale's posts, newest first, as `loadPosts` returns them. */
  posts: PostSummary[];
  featured: PostSummary | undefined;
  /** The id of the heading that names the post list. */
  labelledBy: string;
};

/**
 * The searchable part of the Blog screen. With no filter it is the featured card
 * followed by every other post; once a query or category is set the card steps
 * aside and every matching post, the featured one included, is listed instead.
 */
export function BlogIndex({ locale, posts, featured, labelledBy }: Props) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = [...new Set(posts.map((post) => post.category))];
  const needle = query.trim().toLowerCase();
  const filtering = needle !== '' || category !== null;
  const matches = (post: PostSummary) =>
    (category === null || post.category === category) &&
    [post.title, post.excerpt, post.category, ...post.tags]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  const listed = filtering
    ? posts.filter(matches)
    : posts.filter((post) => post.slug !== featured?.slug);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.blog.searchPlaceholder}
        aria-label={t.blog.searchLabel}
        className={styles.search}
      />

      <div className={styles.pills}>
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(category === name ? null : name)}
            className={styles.pill}
          >
            {name}
          </button>
        ))}
      </div>

      {featured && !filtering ? (
        <Link href={postPath(featured.slug, locale)} className={styles.featured}>
          <span className={styles.featuredLabel}>★ {t.blog.featured}</span>
          <span className={styles.featuredTitle}>{featured.title}</span>
          <span className={styles.featuredExcerpt}>{featured.excerpt}</span>
          <span className={styles.meta}>{formatPostMeta(featured, locale)}</span>
        </Link>
      ) : null}

      {listed.length > 0 ? (
        <ul aria-labelledby={labelledBy} className={styles.list}>
          {listed.map((post) => (
            <li key={post.slug}>
              <Link href={postPath(post.slug, locale)} className={styles.row}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.rowTitle}>{post.title}</span>
                <span className={styles.rowExcerpt}>{post.excerpt}</span>
                <span className={styles.meta}>{formatPostMeta(post, locale)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {filtering && listed.length === 0 ? <p className={styles.empty}>{t.blog.noResults}</p> : null}
    </>
  );
}
